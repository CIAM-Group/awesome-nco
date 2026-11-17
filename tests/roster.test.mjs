import fs from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../scripts/content-lib.mjs'
import { loadReviews } from '../scripts/review-lib.mjs'

const manifest = JSON.parse(await fs.readFile(new URL('../data/imports/iclr-neurips-icml-2026-11.json', import.meta.url), 'utf8'))
const conferenceManifest = JSON.parse(await fs.readFile(new URL('../data/imports/conference-163-2026-11-17.json', import.meta.url), 'utf8'))
const importedIds = new Set([...manifest.papers, ...conferenceManifest.papers].map(paper => paper.paper_id))
const reviews = await loadReviews(process.cwd())

function expectHistoricalMetadata(paper, expected) {
  expect(paper, expected.id).toBeDefined()
  expect(paper.id).toBe(expected.id)
  for (const [field, value] of Object.entries(expected)) {
    if (paper[field] === value) continue
    const review = reviews.get(paper.id)
    expect(review?.status, `${paper.id}: correction to ${field} needs verified source evidence`).toBe('verified')
    if (['scope', 'paradigm', 'paper_type'].includes(field)) {
      expect(review.claims.some(claim => claim.category === 'classification')).toBe(true)
    } else {
      expect(review.metadata_evidence.length).toBeGreaterThan(0)
    }
  }
}

const roster = [
  ['pointer-networks', 'Ptr-Net', 'NeurIPS', 2015, 'constructive'],
  ['neurewriter', 'NeuRewriter', 'NeurIPS', 2019, 'improvement'],
  ['pomo', 'POMO', 'NeurIPS', 2020, 'constructive'],
  ['gnn-mcts-tsp', 'GNN-MCTS', 'IEEE Access', 2020, 'constructive'],
  ['neural-large-neighborhood-search', 'NLNS', 'ECAI', 2020, 'improvement'],
  ['egate', 'EGATE', 'IJCAI HSI Workshop', 2020, 'improvement'],
  ['learning-to-improve', 'L2I', 'ICLR', 2020, 'improvement'],
  ['multi-decoder-attention-model', 'MDAM', 'AAAI', 2021, 'constructive'],
  ['matrix-encoding-networks', 'MatNet', 'NeurIPS', 2021, 'constructive'],
  ['neural-3-opt', 'Neural-3-OPT', 'ACML', 2021, 'improvement'],
  ['neurolkh', 'NeuroLKH', 'NeurIPS', 2021, 'improvement'],
  ['att-gcn', 'Att-GCN', 'AAAI', 2021, 'improvement'],
  ['learning-collaborative-policies', 'LCP', 'NeurIPS', 2021, 'improvement'],
  ['learning-to-delegate', 'L2D', 'NeurIPS', 2021, 'improvement'],
  ['latent-search-space-routing', 'CVAE-Opt', 'ICLR', 2021, 'improvement'],
  ['step-wise-routing', 'Step-Wise', 'IEEE TII', 2021, 'constructive'],
  ['learning-improvement-heuristics', 'LIH', 'IEEE TNNLS', 2022, 'improvement'],
  ['dimes', 'DIMES', 'NeurIPS', 2022, 'constructive'],
  ['simulation-guided-beam-search', 'SGBS', 'NeurIPS', 2022, 'constructive'],
  ['deep-policy-dynamic-programming', 'DPDP', 'CPAIOR', 2022, 'constructive'],
  ['sym-nco', 'Sym-NCO', 'NeurIPS', 2022, 'constructive'],
  ['mapdp', 'MAPDP', 'AAAI', 2022, 'constructive'],
  ['pareto-set-learning', 'P-MOCO', 'ICLR', 2022, 'constructive'],
  ['diffusion-plug-and-play-priors', 'DMPP', 'NeurIPS', 2022, 'constructive'],
  ['graph-guided-local-search', 'RGLS', 'ICLR', 2022, 'improvement'],
  ['rbg', 'RBG', 'KDD', 2022, 'improvement'],
  ['efficient-active-search', 'EAS', 'ICLR', 2022, 'constructive'],
  ['routing-dro', 'DRO', 'AAAI', 2022, 'constructive'],
]

const surveyExpansionRoster = [
  ['lehd', 'LEHD', 'NeurIPS', 2023, 'constructive', 'specialist'],
  ['bq-nco', 'BQ-NCO', 'NeurIPS', 2023, 'constructive', 'specialist'],
  ['difusco', 'DIFUSCO', 'NeurIPS', 2023, 'constructive', 'specialist'],
  ['neuopt', 'NeuOpt', 'NeurIPS', 2023, 'improvement', 'specialist'],
  ['utsp', 'UTSP', 'NeurIPS', 2023, 'constructive', 'specialist'],
  ['t2t', 'T2T', 'NeurIPS', 2023, 'constructive', 'specialist'],
  ['compass', 'COMPASS', 'NeurIPS', 2023, 'constructive', 'specialist'],
  ['h-tsp', 'H-TSP', 'AAAI', 2023, 'constructive', 'specialist'],
  ['pointerformer', 'Pointerformer', 'AAAI', 2023, 'constructive', 'specialist'],
  ['tam', 'TAM', 'ICLR', 2023, 'constructive', 'specialist'],
  ['meta-sage', 'Meta-SAGE', 'ICML', 2023, 'constructive', 'specialist'],
  ['omni-vrp', 'Omni-VRP', 'ICML', 2023, 'constructive-improvement', 'specialist'],
  ['select-and-optimize', 'Select & Optimize', 'AISTATS', 2023, 'improvement', 'specialist'],
  ['udc', 'UDC', 'NeurIPS', 2024, 'constructive-improvement', 'specialist'],
  ['fast-t2t', 'Fast T2T', 'NeurIPS', 2024, 'constructive', 'specialist'],
  ['pip', 'PIP/PIP-D', 'NeurIPS', 2024, 'constructive', 'specialist'],
  ['invit', 'INViT', 'ICML', 2024, 'constructive', 'specialist'],
  ['dpn', 'DPN', 'ICML', 2024, 'constructive', 'specialist'],
  ['mvmoe', 'MVMoE', 'ICML', 2024, 'constructive', 'generalist'],
  ['softdist', 'SoftDist', 'ICML', 2024, undefined, 'study'],
  ['mtpomo', 'MTPOMO', 'KDD', 2024, 'constructive', 'generalist'],
  ['hncs', 'HNCS', 'KDD', 2024, 'constructive', 'specialist'],
  ['elg', 'ELG', 'IJCAI', 2024, 'constructive', 'specialist'],
  ['cross-problem-learning', 'Cross-Problem Learning', 'IJCAI', 2024, 'constructive', 'generalist'],
  ['fer', 'FER', 'IEEE TNNLS', 2024, 'constructive', 'specialist'],
  ['ncs', 'NCS', 'IEEE TPAMI', 2024, 'improvement', 'specialist'],
  ['asp', 'ASP', 'IEEE TPAMI', 2024, 'constructive', 'specialist'],
  ['glop', 'GLOP', 'AAAI', 2024, 'constructive', 'specialist'],
  ['gumbeldore', 'Gumbeldore', 'TMLR', 2024, 'constructive', 'specialist'],
  ['less-is-more', 'Less Is More', 'arXiv', 2024, 'constructive', 'specialist'],
  ['sil', 'SIL', 'ICLR', 2025, 'constructive', 'specialist'],
  ['polynet', 'PolyNet', 'ICLR', 2025, 'constructive', 'specialist'],
  ['reld', 'ReLD', 'ICLR', 2025, 'constructive', 'specialist'],
  ['agfn', 'AGFN', 'ICLR', 2025, 'constructive', 'specialist'],
  ['cada', 'CaDA', 'ICML', 2025, 'constructive', 'generalist'],
  ['mixed-curvature', 'Mixed-Curvature', 'ICML', 2025, 'constructive', 'generalist'],
  ['shield', 'SHIELD', 'ICML', 2025, 'constructive', 'generalist'],
  ['l2c-insert', 'L2C-Insert', 'NeurIPS', 2025, 'constructive', 'specialist'],
  ['gensco', 'GenSCO', 'NeurIPS', 2025, 'constructive-improvement', 'specialist'],
  ['ttpl', 'TTPL', 'NeurIPS', 2025, 'constructive', 'specialist'],
  ['mtl-kd', 'MTL-KD', 'NeurIPS', 2025, 'constructive', 'generalist'],
  ['constraint-tightness', 'Constraint Tightness', 'NeurIPS', 2025, 'constructive', 'specialist'],
  ['drhg', 'DRHG', 'AAAI', 2025, 'improvement', 'specialist'],
  ['gfacs', 'GFACS', 'AISTATS', 2025, 'constructive-improvement', 'specialist'],
  ['dgl', 'DGL', 'IJCAI', 2025, 'constructive', 'specialist'],
  ['nds', 'NDS', 'TMLR', 2025, 'improvement', 'specialist'],
  ['routefinder', 'RouteFinder', 'TMLR', 2025, 'constructive', 'generalist'],
  ['dar', 'DAR', 'IEEE TNNLS', 2025, 'constructive', 'specialist'],
  ['l2seg', 'L2Seg', 'ICLR', 2026, 'improvement', 'specialist'],
  ['urs', 'URS', 'ICML', 2026, 'constructive', 'generalist'],
  ['l2r', 'L2R', 'KDD', 2026, 'constructive', 'specialist'],
  ['icam', 'ICAM', 'IEEE T-ITS', 2026, 'constructive', 'specialist'],
]

describe('confirmed 28-paper expansion', () => {
  it('retains the approved publication metadata', async () => {
    const content = await loadContent(process.cwd())
    for (const [id, shortTitle, venue, year, paradigm] of roster) {
      const paper = content.papers.find((item) => item.id === id)
      expectHistoricalMetadata(paper, { id, short_title: shortTitle, venue, year, paradigm, scope: 'specialist' })
    }
  })

  it('preserves original paper IDs even when unsupported edges are removed', async () => {
    const content = await loadContent(process.cwd())
    for (const [id] of roster) expect(content.papers.some(paper => paper.id === id), id).toBe(true)
  })
})

describe('52-paper survey expansion', () => {
  it('preserves the original 92 papers and their reviewed metadata', async () => {
    const content = await loadContent(process.cwd())
    expect(content.papers.filter(paper => !importedIds.has(paper.id))).toHaveLength(92)
    expect(surveyExpansionRoster).toHaveLength(52)

    for (const [id, shortTitle, venue, year, paradigm, scope] of surveyExpansionRoster) {
      const paper = content.papers.find((item) => item.id === id)
      expectHistoricalMetadata(paper, { id, short_title: shortTitle, venue, year, scope, ...(paradigm ? { paradigm } : { paper_type: 'analysis' }) })
    }
  })

  it('retains all original papers as classifications are corrected', async () => {
    const content = await loadContent(process.cwd())
    const papers = content.papers.filter(paper => !importedIds.has(paper.id))
    expect(papers).toHaveLength(92)
    expect(new Set(papers.map(paper => paper.id)).size).toBe(92)
    expect(papers.every(paper => ['specialist', 'generalist', 'study'].includes(paper.scope))).toBe(true)
  })

  it('uses formal publication records except for Less Is More', async () => {
    const { papers } = await loadContent(process.cwd())
    const added = surveyExpansionRoster.map(([id]) => papers.find((paper) => paper.id === id))
    expect(added.filter((paper) => paper?.venue === 'arXiv').map((paper) => paper.id)).toEqual(['less-is-more'])

    expect(papers.find((paper) => paper.id === 'l2r')).toMatchObject({ venue: 'KDD', year: 2026 })
    expect(papers.find((paper) => paper.id === 'urs')).toMatchObject({ venue: 'ICML', year: 2026, paper_url: 'https://proceedings.mlr.press/v306/zhou26bg.html' })
    expect(papers.find((paper) => paper.id === 'icam')).toMatchObject({
      title: 'Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver',
      venue: 'IEEE T-ITS',
      year: 2026,
      paper_url: 'https://doi.org/10.1109/TITS.2026.3674538',
    })
  })

  it('retains expansion notes independently of citation degree', async () => {
    const content = await loadContent(process.cwd())
    for (const [id] of surveyExpansionRoster) expect(content.papers.some(paper => paper.id === id), id).toBe(true)
  })

  it('records sourced acceptance or publication evidence for formal papers and leaves both arXiv-only entries unset', async () => {
    const { papers } = await loadContent(process.cwd())
    const formallyPublished = papers.filter((paper) => paper.venue !== 'arXiv')
    const arxivOnly = papers.filter((paper) => paper.venue === 'arXiv')

    expect(formallyPublished).toHaveLength(papers.length - 2)
    expect(formallyPublished.every((paper) => /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test((paper.acceptance ?? paper.publication)?.date ?? '') && Boolean((paper.acceptance ?? paper.publication)?.source_url))).toBe(true)
    expect(arxivOnly.map((paper) => paper.id).sort()).toEqual(['efficient-graph-convnet-tsp', 'less-is-more'])
    expect(arxivOnly.every((paper) => paper.acceptance === undefined)).toBe(true)
  })

  it('uses arXiv v1 dates when a preprint link is present', async () => {
    const { papers } = await loadContent(process.cwd())
    const correctedDates = {
      agfn: '2025-03-03',
      reld: '2025-03-02',
      'fast-t2t': '2025-02-05',
      udc: '2024-06-29',
      'graph-guided-local-search': '2021-10-11',
      'multi-decoder-attention-model': '2020-12-19',
      'dynamic-am': '2020-02-09',
      'pointer-networks': '2015-06-09',
    }

    for (const [id, date] of Object.entries(correctedDates)) {
      expect(papers.find((paper) => paper.id === id), id).toMatchObject({ date, arxiv_url: expect.stringContaining('arxiv.org/abs/') })
    }
  })
})
