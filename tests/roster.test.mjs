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

describe('confirmed 28-paper expansion', () => {
  it('contains 40 papers and the approved publication metadata', async () => {
    const content = await loadContent(process.cwd())
    expect(content.papers).toHaveLength(40)
    for (const [id, shortTitle, venue, year, paradigm] of roster) {
      const paper = content.papers.find((item) => item.id === id)
      expect(paper, id).toMatchObject({ id, short_title: shortTitle, venue, year, paradigm, scope: 'specialist' })
    }
  })

  it('connects every added paper with two to four undirected thematic relations', async () => {
    const content = await loadContent(process.cwd())
    for (const [id] of roster) {
      const count = content.relations.filter((relation) => relation.papers.includes(id)).length
      expect(count, id).toBeGreaterThanOrEqual(2)
      expect(count, id).toBeLessThanOrEqual(4)
    }
  })
})
