import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { PageMeta } from '../components/PageMeta'
import {
  getPaper,
  papers,
  relationKindLabels,
  relationKindStyles,
  relationNodeRelSize,
  relationNodeValue,
  relations,
  uniqueValues,
} from '../lib/data'
import type { RelationKind, Scope } from '../types'

interface GraphNode {
  id: string
  name: string
  scope: Scope
  degree: number
  x?: number
  y?: number
}

interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
  kind: RelationKind
}

function RelationStyleKey({ kind }: { kind: RelationKind }) {
  const style = relationKindStyles[kind]
  const path = style.curvature > 0
    ? 'M2 13 Q18 -1 34 13'
    : style.curvature < 0
      ? 'M2 3 Q18 17 34 3'
      : 'M2 8 L34 8'

  return (
    <svg className="relation-style-key" viewBox="0 0 36 16" aria-hidden="true" focusable="false">
      <path d={path} fill="none" stroke={style.color} strokeDasharray={style.dash.join(' ')} strokeWidth={style.width} vectorEffect="non-scaling-stroke" />
      {style.marker === 'opposed-triangles' && (
        <path d="M13 8 L17 5 L17 11 Z M23 8 L19 5 L19 11 Z" fill="#fcfbf8" stroke={style.color} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  )
}

function drawRelationMarker(link: GraphLink, context: CanvasRenderingContext2D, globalScale: number) {
  const style = relationKindStyles[link.kind]
  if (style.marker !== 'opposed-triangles' || typeof link.source === 'string' || typeof link.target === 'string') return
  if (link.source.x === undefined || link.source.y === undefined || link.target.x === undefined || link.target.y === undefined) return

  const midpointX = (link.source.x + link.target.x) / 2
  const midpointY = (link.source.y + link.target.y) / 2
  const angle = Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x)
  const size = 4.8 / globalScale
  const offset = size * 0.55

  function drawTriangle(center: number, direction: 1 | -1) {
    context.beginPath()
    context.moveTo(center + direction * size, 0)
    context.lineTo(center - direction * size * 0.45, -size * 0.7)
    context.lineTo(center - direction * size * 0.45, size * 0.7)
    context.closePath()
    context.fill()
    context.stroke()
  }

  context.save()
  context.translate(midpointX, midpointY)
  context.rotate(angle)
  context.setLineDash([])
  context.fillStyle = '#fcfbf8'
  context.strokeStyle = style.color
  context.lineWidth = 1.4 / globalScale
  drawTriangle(-offset, -1)
  drawTriangle(offset, 1)
  context.restore()
}

function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(800)
  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, Math.floor(entry.contentRect.width))))
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return { ref, width }
}

export function RelationsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const graphRef = useRef<any>(null)
  const { ref: graphContainerRef, width } = useContainerWidth()
  const [focusId, setFocusId] = useState('')
  const query = searchParams.get('q') ?? ''
  const requestedKind = searchParams.get('kind') ?? 'all'
  const kind = Object.keys(relationKindLabels).includes(requestedKind) ? requestedKind : 'all'
  const families = useMemo(() => uniqueValues(papers.flatMap((paper) => paper.problem_families)), [])
  const requestedFamily = searchParams.get('family') ?? 'all'
  const family = families.includes(requestedFamily) ? requestedFamily : 'all'

  const filteredRelations = useMemo(() => relations.filter((relation) => {
    const endpointPapers = relation.papers.map((id) => getPaper(id)).filter(Boolean)
    const searchable = [relation.description, ...endpointPapers.flatMap((paper) => paper ? [paper.short_title, paper.title] : [])].join(' ').toLowerCase()
    return (!query.trim() || searchable.includes(query.trim().toLowerCase()))
      && (kind === 'all' || relation.kind === kind)
      && (family === 'all' || endpointPapers.some((paper) => paper?.problem_families.includes(family)))
  }), [family, kind, query])

  const graphData = useMemo(() => {
    const ids = new Set(filteredRelations.flatMap((relation) => relation.papers))
    const nodes: GraphNode[] = [...ids].map((id) => {
      const paper = getPaper(id)!
      return { id, name: paper.short_title, scope: paper.scope, degree: filteredRelations.filter((relation) => relation.papers.includes(id)).length }
    })
    return {
      nodes,
      links: filteredRelations.map((relation) => ({ source: relation.papers[0], target: relation.papers[1], kind: relation.kind })),
    }
  }, [filteredRelations])

  const labelledNodeIds = useMemo(() => {
    const ids = new Set(graphData.nodes.filter((node) => node.degree >= 5).map((node) => node.id))
    if (!focusId) return ids

    ids.add(focusId)
    for (const relation of filteredRelations) {
      if (!relation.papers.includes(focusId)) continue
      ids.add(relation.papers[0])
      ids.add(relation.papers[1])
    }
    return ids
  }, [filteredRelations, focusId, graphData.nodes])

  useEffect(() => {
    const linkForce = graphRef.current?.d3Force('link')
    linkForce?.distance(width < 600 ? 86 : 132)
    const chargeForce = graphRef.current?.d3Force('charge')
    chargeForce?.strength(width < 600 ? -128 : -225)
    graphRef.current?.d3ReheatSimulation()
  }, [graphData, width])

  useEffect(() => {
    if (!focusId || graphData.nodes.some((node) => node.id === focusId)) return
    setFocusId('')
  }, [focusId, graphData.nodes])

  function updateFilter(key: string, value: string) {
    const param = key === 'query' ? 'q' : key
    const next = new URLSearchParams(searchParams)
    if (value === '' || value === 'all') next.delete(param)
    else next.set(param, value)
    setSearchParams(next, { replace: true })
  }

  function focusPaper(id: string) {
    setFocusId(id)
    const node = graphData.nodes.find((item) => item.id === id)
    if (!node || node.x === undefined || node.y === undefined) return
    graphRef.current?.centerAt(node.x, node.y, 650)
    graphRef.current?.zoom(width < 600 ? 4.2 : 5, 650)
  }

  return (
    <div className="relations-page">
      <PageMeta title="Relations" description="Explore thematic relations among neural combinatorial optimization methods." />
      <header className="directory-heading page-shell">
        <p className="eyebrow">Method landscape</p>
        <h1>Paper relations</h1>
        <p>Exploratory links based on shared architectures, learning objectives, search processes, or problem scope—not claims of strict inheritance.</p>
      </header>
      <section className="relations-workbench page-shell" aria-label="Paper relations explorer">
        <FilterBar
          query={query}
          searchPlaceholder="Paper title, method, or relation description"
          selects={[
            { key: 'kind', label: 'Relation', value: kind, options: [{ value: 'all', label: 'All relation kinds' }, ...Object.entries(relationKindLabels).map(([value, label]) => ({ value, label }))] },
            { key: 'family', label: 'Problem family', value: family, options: [{ value: 'all', label: 'All problem families' }, ...families.map((value) => ({ value, label: value }))] },
          ]}
          resultCount={filteredRelations.length}
          onChange={updateFilter}
          onReset={() => setSearchParams({}, { replace: true })}
        />
        <div className="relation-toolbar">
          <label><span>Focus a paper</span><select value={focusId} onChange={(event) => focusPaper(event.target.value)}><option value="">Choose a paper</option>{[...graphData.nodes].sort((a, b) => a.name.localeCompare(b.name)).map((node) => <option value={node.id} key={node.id}>{node.name}</option>)}</select></label>
          <div className="relation-legend" aria-label="Graph legend">
            <span><i className="node-key node-key--specialist" /> Specialist</span><span><i className="node-key node-key--generalist" /> Generalist</span>
            {Object.entries(relationKindLabels).map(([value, label]) => (
              <span className="relation-legend__item" key={value}><RelationStyleKey kind={value as RelationKind} /> {label}</span>
            ))}
          </div>
        </div>
        {filteredRelations.length > 0 ? (
          <>
            <div className="relation-graph" ref={graphContainerRef} aria-label="Interactive paper relation graph">
              <ForceGraph2D
                ref={graphRef}
                width={width}
                height={width < 600 ? 500 : 820}
                graphData={graphData}
                backgroundColor="#fcfbf8"
                nodeVal={(node: any) => relationNodeValue(node.degree)}
                nodeRelSize={relationNodeRelSize}
                nodeColor={(node: any) => node.scope === 'specialist' ? '#315f86' : '#805e6f'}
                nodeLabel={(node: any) => node.name}
                linkColor={(link: any) => relationKindStyles[link.kind as RelationKind].color}
                linkWidth={(link: any) => relationKindStyles[link.kind as RelationKind].width}
                linkLineDash={(link: any) => relationKindStyles[link.kind as RelationKind].dash}
                linkCurvature={(link: any) => relationKindStyles[link.kind as RelationKind].curvature}
                linkCanvasObjectMode={() => 'after'}
                linkCanvasObject={(link: any, context, globalScale) => drawRelationMarker(link, context, globalScale)}
                cooldownTicks={220}
                onEngineStop={() => graphRef.current?.zoomToFit(600, width < 600 ? 54 : 108)}
                onNodeClick={(node: any) => navigate(`/papers/${node.id}`)}
                nodeCanvasObjectMode={() => 'after'}
                nodeCanvasObject={(node: any, context, globalScale) => {
                  if (!labelledNodeIds.has(node.id)) return
                  const fontSize = Math.max(3.5, 12 / globalScale)
                  context.font = `600 ${fontSize}px IBM Plex Sans`
                  context.textAlign = 'center'
                  context.textBaseline = 'top'
                  context.fillStyle = '#1d252a'
                  const radius = Math.sqrt(relationNodeValue(node.degree)) * relationNodeRelSize
                  context.fillText(node.name, node.x, node.y + radius + 1.5 / globalScale)
                }}
              />
            </div>
            <section className="relation-register" aria-labelledby="relation-register-title">
              <div className="section-heading section-heading--inline"><div><p className="eyebrow">Accessible index</p><h2 id="relation-register-title">Relation register</h2></div><span>{filteredRelations.length} connections</span></div>
              <div className="relation-list">
                {filteredRelations.map((relation) => {
                  const first = getPaper(relation.papers[0])!
                  const second = getPaper(relation.papers[1])!
                  return <article className="relation-row" key={[...relation.papers].sort().join(':')}><span className="relation-kind"><RelationStyleKey kind={relation.kind} /><span>{relationKindLabels[relation.kind]}</span></span><div><h3><Link to={`/papers/${first.id}`}>{first.short_title}</Link><span aria-hidden="true"> ↔ </span><Link to={`/papers/${second.id}`}>{second.short_title}</Link></h3><p>{relation.description}</p></div></article>
                })}
              </div>
            </section>
          </>
        ) : <div className="empty-state"><strong>No relations match this view.</strong><p>Clear the search or select broader filters.</p><button type="button" onClick={() => setSearchParams({}, { replace: true })}>Reset filters</button></div>}
      </section>
    </div>
  )
}
