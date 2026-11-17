---
id: scaling-combinatorial-optimization-neural-improvement-heuristics-with-online-search-an
short_title: LRBS
title: Scaling Combinatorial Optimization Neural Improvement Heuristics with Online Search and Adaptation
authors:
- Federico Julian Camerota Verdù
- Lorenzo Castelli
- Luca Bortolussi
year: 2025
date: '2024-12-13'
publication:
  date: '2025-04-11'
  source_url: https://doi.org/10.1609/aaai.v39i25.34921
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/34921
institutions:
- University of Trieste
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Routing
problems:
- TSP
- Pickup and Delivery TSP
- Pickup and Delivery TSP with LIFO
summary: Short learned-improvement rollouts guide beam search over complete tours, with optional offline fine-tuning
  or online adaptation; separate native-task policies and substantial large-instance gaps qualify generalization.
arxiv_url: https://arxiv.org/abs/2412.10163
code_url: https://github.com/federico-camerota/LRBS
figure:
  path: paper-assets/scaling-combinatorial-optimization-neural-improvement-heuristics-with-online-search-an/framework.png
  alt: Original Figure2 compares expansion, rollout and beam selection for BS, SGBS and LRBS.
  caption: Original Figure2/full caption distinguish LRBS rollout-endpoint selection from direct-child beam selection.
  source_url: https://arxiv.org/pdf/2412.10163v1#page=3
---

# Scaling Combinatorial Optimization Neural Improvement Heuristics with Online Search and Adaptation

> **TL;DR:** Limited Rollout Beam Search (LRBS) expands a beam of complete solutions, rolls each candidate forward for a short learned improvement trajectory, and retains the best rollout endpoints. Optional offline fine-tuning or online adaptation improves some scaling results, with substantial search costs and remaining large-instance gaps.

## Motivation

Improvement policies need long trajectories and may pass through temporarily worse solutions. Full rollouts are expensive, while one-step beam selection can discard useful exploratory paths. LRBS uses short rollouts to balance these costs. [pp. 1–4]

## Contributions

- Adapt beam search to learned improvement policies by selecting rollout endpoints.
- Add small EAS-style parameters for separate offline fine-tuning and online adaptation regimes.
- Evaluate TSP scaling and precedence/LIFO pickup-and-delivery variants. [Algorithm 1; Sections 4–5]

## Methodology

Starting from a complete incumbent, keep β beam states, sample α moves per state, run the policy for n_s steps and select β rollout endpoints using the objective. Preserve the best solution encountered. TSP uses learned 2-opt; PDTSP/PDTSPL use request removal/reinsertion. TSP and pickup/delivery experiments use different pretrained models, so the collection uses **specialist/improvement**. [pp. 2–4, 7]

Offline fine-tuning uses a separate small sample from the target-size distribution; online adaptation resets added parameters between test batches. Their results are distinct from frozen-policy inference. The printed reward subtracts the previous best tour cost from the current best, giving a nonpositive value when cost improves, opposite to the stated positive-reward interpretation. The unreleased implementation prevents resolving this sign from code. [p. 2; Equation 1; Section 4]

## Experiments

The main TSP budget uses αβ=60, n_s=20 and up to 5000 improvement steps; pickup/delivery uses a smaller beam budget. Hyperparameters are selected using ten separate same-size random instances. Experiments report one Ampere GPU with 64 GB HBM2 memory; several constructive baseline numbers are borrowed from prior papers, requiring hardware/protocol qualification. Times cover whole test datasets. [pp. 4–7]

On TSP100, LRBS reports a 0.014% gap in 19 hours; adding adaptation gives 0.013% in 22 hours. On TSP1000, plain LRBS is **20.740%**, worse than beam search's 14.536% and Meta-SAGE's 12.038%. Online adaptation reaches 11.889% in 8.1 hours; offline fine-tuning reaches 11.483% in 8.6 hours, including its fine-tuning phase. [Tables 1–2]

Pickup/delivery improves over the N2S-A baseline but remains far from LKH: adapted PDTSP500 has a **56.532% gap** in 35.4 hours; adapted PDTSPL500 has 10.161% in 64.2 hours. LKH is a reference heuristic here, not a proven optimum for every pickup/delivery instance. Appendix A uses different TSP500/1000 sample counts from the main tables, so those runtimes are kept separate. [Table 4; Appendix A]

## Limitations

Frozen-policy search does not eliminate distribution shift, and online/offline adaptation adds computation. There is no universal dominance over beam search or stronger constructive methods. The main dataset paragraph inconsistently mentions 150 and 125 nodes; the reported TSP150 table is retained without inventing an independently recovered test-file identity. [pp. 4–7]

The work evaluates separately trained problem-specific policies and a fixed set of move operators. Its broad applicability is not evidence of a shared cross-problem model. No benchmark or training replication was performed. [Sections 2/5]

## Reproducibility

Read all **11 pages of arXiv v1**, including the complete bibliography, full scientific Appendix A and every configuration row in Tables 5–9; inspected all three contact sheets and original Figure 2/full caption. Actual arXiv history records **2024-12-13**. The publisher DOI establishes AAAI2025, three University of Trieste authors, pages 27135–27143 and publication **2025-04-11**.

The [author repository snapshot](https://github.com/federico-camerota/LRBS/tree/1a23d4c7c4d59854b276700a722eab36a6b75d1b) contains only README and LICENSE. Its README explicitly says the codebase is still under construction. The code link therefore identifies a release location, **not an available implementation**. All identified scientific appendix content is in the read preprint; neither a missing implementation nor an ordinary presentation is treated as an unread scientific proof.
