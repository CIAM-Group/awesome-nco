import { useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { PageMeta } from '../components/PageMeta'
import {
  citationEvidenceLabel,
  citationEvidenceUrl,
  fullTextReviewComplete,
  getPaper,
  papers,
  relationKindLabels,
  scopeColors,
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

function nodeRadius(node: GraphNode, globalScale: number) {
  return Math.max(2.5 / globalScale, Math.sqrt(relationNodeValue(node.degree)) * relationNodeRelSize)
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
  const requestedScope = searchParams.get('scope') ?? 'all'
  const scope = ['specialist', 'generalist', 'study'].includes(requestedScope) ? requestedScope : 'all'
  const includeReferences = searchParams.get('inclusion') === 'all'

  const filteredRelations = useMemo(() => relations.filter((relation) => {
    const endpointPapers = relation.papers.map((id) => getPaper(id)).filter(Boolean)
    const searchable = [relation.description, ...endpointPapers.flatMap((paper) => paper ? [paper.short_title, paper.title] : [])].join(' ').toLowerCase()
    return (!query.trim() || searchable.includes(query.trim().toLowerCase()))
      && (includeReferences || endpointPapers.every(paper => paper?.inclusion === 'main'))
      && (kind === 'all' || relation.kind === kind)
      && (family === 'all' || endpointPapers.some((paper) => paper?.problem_families.includes(family)))
      && (scope === 'all' || endpointPapers.some((paper) => paper?.scope === scope))
  }), [family, kind, query, scope, includeReferences])

  const graphData = useMemo(() => {
    const ids = new Set(filteredRelations.flatMap((relation) => relation.papers))
    for (const paper of papers) {
      const matchesQuery = !query.trim() || `${paper.short_title} ${paper.title}`.toLowerCase().includes(query.trim().toLowerCase())
      if ((includeReferences || paper.inclusion === 'main') && (scope === 'all' || paper.scope === scope) && (family === 'all' || paper.problem_families.includes(family)) && matchesQuery) ids.add(paper.id)
    }
    const degrees = new Map<string, number>()
    for (const relation of filteredRelations) for (const id of relation.papers) degrees.set(id, (degrees.get(id) ?? 0) + 1)
    const nodes: GraphNode[] = [...ids].map((id) => {
      const paper = getPaper(id)!
      return { id, name: paper.short_title, scope: paper.scope, degree: degrees.get(id) ?? 0 }
    })
    return {
      nodes,
      links: filteredRelations.map((relation) => ({ source: relation.papers[0], target: relation.papers[1], kind: relation.kind })),
    }
  }, [filteredRelations, includeReferences, scope, family, query])

  const labelledNodeIds = useMemo(() => {
    const ids = new Set(
      [...graphData.nodes]
        .sort((first, second) => second.degree - first.degree || first.name.localeCompare(second.name))
        .slice(0, 8)
        .map((node) => node.id),
    )
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
    linkForce?.distance(width < 600 ? 96 : 146)
    const chargeForce = graphRef.current?.d3Force('charge')
    chargeForce?.strength(width < 600 ? -155 : -270)
    graphRef.current?.d3ReheatSimulation()
  }, [graphData, width])

  useEffect(() => {
    if (!focusId || graphData.nodes.some((node) => node.id === focusId)) return
    setFocusId('')
  }, [focusId, graphData.nodes])

  function updateFilter(key: string, value: string) {
    const param = key === 'query' ? 'q' : key
    const next = new URLSearchParams(searchParams)
    if (value === '' || (key === 'inclusion' ? value === 'main' : value === 'all')) next.delete(param)
    else next.set(param, value)
    setSearchParams(next, { replace: true })
  }

  function focusPaper(id: string) {
    setFocusId(id)
    const neighbors = new Set([id])
    for (const relation of filteredRelations) {
      if (relation.papers.includes(id)) for (const endpoint of relation.papers) neighbors.add(endpoint)
    }
    graphRef.current?.zoomToFit(650, width < 600 ? 54 : 108, (node: GraphNode) => !id || neighbors.has(node.id))
  }

  return (
    <div className="relations-page">
      <PageMeta title="Citations" description="Explore directed, source-verified citations within the collection." />
      <header className="directory-heading page-shell">
        <p className="eyebrow">Method landscape</p>
        <h1>Paper citations</h1>
        <p>Arrows point from the citing paper to the cited paper. Each edge requires an explicit in-text citation and a source-page locator. Papers without verified internal citations remain visible.</p>
        <p className="review-notice">{fullTextReviewComplete ? `Full-text review is complete for all ${papers.length} retained papers.` : 'Full-text review is in progress.'} <a href="https://github.com/CIAM-Group/awesome-nco/blob/main/docs/FULL_TEXT_REVIEW.md" target="_blank" rel="noreferrer">View source evidence and review coverage</a>.</p>
      </header>
      <section className="relations-workbench page-shell" aria-label="Paper relations explorer">
        <FilterBar
          query={query}
          searchPlaceholder="Paper title, method, or relation description"
          selects={[
            { key: 'inclusion', label: 'Collection', value: includeReferences ? 'all' : 'main', options: [{ value: 'main', label: 'Main collection' }, { value: 'all', label: 'Include reference collection' }] },
            { key: 'scope', label: 'Connected collection', value: scope, options: [{ value: 'all', label: 'All collections' }, { value: 'specialist', label: 'Specialist' }, { value: 'generalist', label: 'Generalist' }, { value: 'study', label: 'Research Studies' }] },
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
            <span><i className="node-key node-key--specialist" /> Specialist</span><span><i className="node-key node-key--generalist" /> Generalist</span><span><i className="node-key node-key--study" /> Study</span>
            {Object.entries(relationKindLabels).map(([value, label]) => (
              <span className="relation-legend__item" key={value}><RelationStyleKey kind={value as RelationKind} /> {label}</span>
            ))}
          </div>
        </div>
        {graphData.nodes.length > 0 ? (
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
                nodeColor={(node: any) => scopeColors[node.scope as Scope]}
                nodeLabel={(node: any) => node.name}
                linkColor={(link: any) => relationKindStyles[link.kind as RelationKind].color}
                linkWidth={(link: any) => relationKindStyles[link.kind as RelationKind].width}
                linkLineDash={(link: any) => relationKindStyles[link.kind as RelationKind].dash}
                linkCurvature={(link: any) => relationKindStyles[link.kind as RelationKind].curvature}
                linkDirectionalArrowLength={5}
                linkDirectionalArrowRelPos={1}
                linkCanvasObjectMode={() => 'after'}
                linkCanvasObject={(link: any, context, globalScale) => drawRelationMarker(link, context, globalScale)}
                cooldownTicks={260}
                onEngineStop={() => focusPaper(focusId)}
                onNodeClick={(node: any) => navigate(`/papers/${node.id}`)}
                nodeCanvasObjectMode={() => 'replace'}
                nodePointerAreaPaint={(node: any, color, context, globalScale) => {
                  context.beginPath()
                  context.arc(node.x, node.y, nodeRadius(node, globalScale) + 1 / globalScale, 0, 2 * Math.PI)
                  context.fillStyle = color
                  context.fill()
                }}
                nodeCanvasObject={(node: any, context, globalScale) => {
                  // Keep peripheral nodes visible when the complete collection is fitted to the canvas.
                  const radius = nodeRadius(node, globalScale)
                  context.beginPath()
                  context.arc(node.x, node.y, radius, 0, 2 * Math.PI)
                  context.fillStyle = scopeColors[node.scope as Scope]
                  context.fill()
                  if (!labelledNodeIds.has(node.id)) return
                  const fontSize = Math.max(3.5, 12 / globalScale)
                  context.font = `600 ${fontSize}px IBM Plex Sans`
                  context.textAlign = 'center'
                  context.textBaseline = 'top'
                  context.fillStyle = '#1d252a'
                  context.fillText(node.name, node.x, node.y + radius + 1.5 / globalScale)
                }}
              />
            </div>
            <section className="relation-register" aria-labelledby="relation-register-title">
              <div className="section-heading section-heading--inline"><div><p className="eyebrow">Accessible index</p><h2 id="relation-register-title">Citation register</h2></div><span>{filteredRelations.length} verified citations</span></div>
              {filteredRelations.length === 0 && <p>No verified internal citations have been recorded for this view. Isolated nodes do not imply that the papers contain no references.</p>}
              <div className="relation-list">
                {filteredRelations.map((relation) => {
                  const first = getPaper(relation.papers[0])!
                  const second = getPaper(relation.papers[1])!
                  return <article className="relation-row" key={`${relation.citing}:${relation.cited}`}><span className="relation-kind"><RelationStyleKey kind={relation.kind} /><span>{relationKindLabels[relation.kind]}</span></span><div><h3><Link to={`/papers/${first.id}`}>{first.short_title}</Link><span aria-hidden="true"> → </span><Link to={`/papers/${second.id}`}>{second.short_title}</Link></h3><p>{relation.description}</p>{relation.evidence.map((item, index) => <p key={index}><a href={citationEvidenceUrl(item)} target="_blank" rel="noreferrer">{citationEvidenceLabel(item)} · {item.locator} · Reference {relation.reference_label}</a></p>)}</div></article>
                })}
              </div>
            </section>
          </>
        ) : <div className="empty-state"><strong>No relations match this view.</strong><p>Clear the search or select broader filters.</p><button type="button" onClick={() => setSearchParams({}, { replace: true })}>Reset filters</button></div>}
      </section>
    </div>
  )
}
