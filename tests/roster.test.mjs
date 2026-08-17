import { describe, expect, it } from 'vitest'
import { loadContent } from '../scripts/content-lib.mjs'

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
  ['dimes', 'DIMES', 'NeurIPS', 2022, 'constructive-improvement'],
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
  ['softdist', 'SoftDist', 'ICML', 2024, 'constructive', 'specialist'],
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
      expect(paper, id).toMatchObject({ id, short_title: shortTitle, venue, year, paradigm, scope: 'specialist' })
    }
  })

  it('keeps every previously added paper connected after later expansions', async () => {
    const content = await loadContent(process.cwd())
    for (const [id] of roster) {
      const count = content.relations.filter((relation) => relation.papers.includes(id)).length
      expect(count, id).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('52-paper survey expansion', () => {
  it('contains 92 papers with the approved venues, names, scopes, and paradigms', async () => {
    const content = await loadContent(process.cwd())
    expect(content.papers).toHaveLength(92)
    expect(surveyExpansionRoster).toHaveLength(52)

    for (const [id, shortTitle, venue, year, paradigm, scope] of surveyExpansionRoster) {
      const paper = content.papers.find((item) => item.id === id)
      expect(paper, id).toMatchObject({ id, short_title: shortTitle, venue, year, paradigm, scope })
    }
  })

  it('has the approved collection-level scope and paradigm totals', async () => {
    const { papers } = await loadContent(process.cwd())
    const count = (field, value) => papers.filter((paper) => paper[field] === value).length

    expect(count('scope', 'specialist')).toBe(82)
    expect(count('scope', 'generalist')).toBe(10)
    expect(count('paradigm', 'constructive')).toBe(66)
    expect(count('paradigm', 'improvement')).toBe(20)
    expect(count('paradigm', 'constructive-improvement')).toBe(6)
  })

  it('uses formal publication records except for Less Is More', async () => {
    const { papers } = await loadContent(process.cwd())
    const added = surveyExpansionRoster.map(([id]) => papers.find((paper) => paper.id === id))
    expect(added.filter((paper) => paper?.venue === 'arXiv').map((paper) => paper.id)).toEqual(['less-is-more'])

    expect(papers.find((paper) => paper.id === 'l2r')).toMatchObject({ venue: 'KDD', year: 2026 })
    expect(papers.find((paper) => paper.id === 'urs')).toMatchObject({ venue: 'ICML', year: 2026, paper_url: 'https://icml.cc/virtual/2026/poster/61527' })
    expect(papers.find((paper) => paper.id === 'icam')).toMatchObject({
      title: 'Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver',
      venue: 'IEEE T-ITS',
      year: 2026,
      paper_url: 'https://doi.org/10.1109/TITS.2026.3674538',
    })
  })

  it('connects every added paper with two to four undirected thematic relations', async () => {
    const content = await loadContent(process.cwd())
    for (const [id] of surveyExpansionRoster) {
      const count = content.relations.filter((relation) => relation.papers.includes(id)).length
      expect(count, id).toBeGreaterThanOrEqual(2)
      expect(count, id).toBeLessThanOrEqual(4)
    }
  })
})
