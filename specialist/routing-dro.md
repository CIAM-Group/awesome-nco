---
id: routing-dro
short_title: DRO
title: Learning to Solve Routing Problems via Distributionally Robust Optimization
authors:
- Yuan Jiang
- Yaoxin Wu
- Zhiguang Cao
- Jie Zhang
year: 2022
date: 2022-02-15
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/21214
arxiv_url: https://arxiv.org/abs/2202.07241
institutions:
- Nanyang Technological University
- Singapore Institute of Manufacturing Technology
figure:
  path: paper-assets/routing-dro/framework.png
  alt: Six predefined spatial distribution groups feed a CNN embedding and routing model, with alternating policy and group-weight updates.
  caption: 'Figure 1: predefined distribution groups, convolutional embedding and interleaved group-DRO updates.'
  source_url: https://arxiv.org/pdf/2202.07241v1#page=3
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: Group DRO reweights predefined routing-instance distribution groups while training separate constructive policies, with a nearest-neighbor CNN embedding; robustness is evaluated empirically rather than guaranteed for arbitrary shifts.
publication:
  date: '2022-06-28'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/21214
---
# Learning to Solve Routing Problems via Distributionally Robust Optimization

> **TL;DR:** The method learns routing policies across **predefined spatial-distribution groups**, emphasizes groups with larger losses through group DRO, and adds a local nearest-neighbor CNN embedding. It is evaluated as supervised DROG and reinforcement-trained DROP. The uncertainty set is a mixture of known groups, not a learned generator of arbitrary adversarial distributions or a universal robustness certificate.

## Motivation

A model optimized for average loss can neglect a small but important distribution group. Training only on uniform coordinates also poorly represents clustered or otherwise shifted instances. The paper targets cross-distribution robustness while preserving constructive routing models and requiring no distribution-group label at inference. It explicitly does not claim to surpass all routing methods in every respect. [Introduction/Related Works.](https://arxiv.org/pdf/2202.07241v1#page=2)

## Contributions

- Apply **group distributionally robust optimization** to neural routing models, including supervised and policy-gradient training.
- Alternate routing-model parameter updates with importance-weight updates over prescribed distribution groups.
- Add a **one-dimensional CNN over nearest-neighbor coordinates** to capture local spatial patterns before the model encoder.
- Evaluate paired majority/minority distributions, component ablations and a selected TSPLIB/CVRPLIB benchmark set. [Figure 1/Methodology.](https://arxiv.org/pdf/2202.07241v1#page=3)

## Methodology

### The uncertainty set and updates

For group distributions P_g, the uncertainty set is **Q = {sum_g q_g P_g : q belongs to the probability simplex}**. The ideal objective minimizes the largest group-expected loss, equivalently a minimax weighted mixture. Training knows each instance's group; inference does not need that group identifier. This is reweighting of known generators, not optimization of a new generator or an unrestricted divergence ball. [Equations 3-5.](https://arxiv.org/pdf/2202.07241v1#page=3)

Algorithm 1 samples a group, performs inner routing-model updates with q fixed, raises the group's importance by an exponentiated loss-based update and renormalizes q. REINFORCE uses the route-length return with a variance-reducing baseline; the implementation framework can also use supervised cross-entropy. The paper says strong L2 regularization and group adjustments follow prior group-DRO work. Its ideal worst-group formulation does not by itself prove convergence of the nonconvex sampled policy-training procedure. The stated test-risk upper-bound intuition requires the tested distribution to be covered by the chosen uncertainty set; it is not a guarantee for every unseen geometry. [Algorithm 1/Equation 6.](https://arxiv.org/pdf/2202.07241v1#page=4)

### Distribution-aware embedding and routing models

For each node, the CNN consumes its **ten nearest neighbors**, using kernel length **11** and **128 kernels**. A linear projection combines the node input and convolution result, producing a 128-dimensional embedding for the downstream model. Inputs have two coordinate channels for TSP and coordinates plus demand for CVRP. This is not a rasterized two-dimensional image CNN. [Distribution-aware Embedding/Settings.](https://arxiv.org/pdf/2202.07241v1#page=5)

**DROG:** the authors adapt the GCN model to predict the next visited node autoregressively and train with supervision, rather than merely outputting the original model's adjacency heatmap. Concorde supplies TSP references and LKH-3 supplies CVRP references. The stated inner-loop count is one for this supervised configuration. **DROP:** POMO receives group DRO and the CNN, retaining its RL learning and **eightfold inference augmentation**. These are two model variants and learning alternatives, not two mandatory successive stages of one solver.

Classification remains **specialist / constructive**. Separate policies are trained for problem types, sizes and distribution combinations; route actions extend a partial solution rather than edit a completed incumbent. A common robust-training algorithm and a model that handles multiple coordinate distributions do not establish one shared cross-task neural checkpoint.

## Experiments

### Data and training cost

The synthetic experiments cover **TSP50/100 and CVRP50/100**, with six spatial generators: uniform, explosion, implosion, expansion, cluster and grid. Coordinates are normalized to the unit square. Cluster counts are two for size 50 and four for size 100. CVRP demand is uniform over integers 1-9 and normalized by capacities **40/50**; an additional randomly located depot has zero demand. [Experimental Settings.](https://arxiv.org/pdf/2202.07241v1#page=5)

Each of five paired settings trains on **100,000 uniform plus 10,000 atypical instances** and tests on **10,000 uniform plus 1,000 atypical instances from the same pair of distributions**. These paired tests use held-out instances, but not an entirely unseen generator. Baselines are retrained on the same data and hardware. A separate six-distribution training pool is used for the public benchmark transfer test.

The reported setup uses PyTorch1.2/Python3.7, one RTX2080Ti and an Intel i9-10940X CPU, SGD with momentum and learning rate **1e-4**. Training runs up to **2,000 epochs**, described as about **ten days** for TSP100; most models converge within 300 epochs, about two days. The paper also uses broader prose describing hours-to-week costs. Inference timings are separate from this substantial training cost. [Settings.](https://arxiv.org/pdf/2202.07241v1#page=5)

### Paired-distribution results

The star-marked columns are **means on the atypical group**, rather than the worst individual instance or a robust optimum under all possible distributions. Unstarred columns average the full majority/minority test pool. Reported gaps use exact Concorde references for TSP and heuristic LKH-3 references for CVRP, so a zero CVRP reference gap is not a proof of optimality. Table times refer to the test-set evaluation, not milliseconds per route.

| Setting | Original POMO overall / atypical gap | DROP overall / atypical gap | Reported POMO / DROP time |
| --- | --- | --- | --- |
| TSP100, uniform + explosion | 3.03% / 5.25% | 1.75% / 2.73% | 1 min / 1 min |
| TSP100, uniform + grid | 2.04% / 4.13% | 1.02% / 1.25% | 1 min / 1 min |
| CVRP100, uniform + cluster | 3.18% / 4.42% | 1.92% / 2.59% | 2 min / 2 min |

These results support improved group-average quality under the tested protocols. They do not show zero-gap solving, nominal-only training parity or robustness to arbitrary unmodeled shifts. DROG sometimes beats DROP, and its minutes/hours-scale evaluation differs substantially from POMO-derived seconds/minutes-scale evaluation. [Table 1.](https://arxiv.org/pdf/2202.07241v1#page=6)

### Ablations and benchmark transfer

Table 2 adds CNN alone, DRO alone and both to POMO on TSP100. For the grid pair, atypical gaps are **4.13% / 3.50% / 1.63% / 1.25%** for original POMO / CNN / DRO / both. Overall gaps are **2.04% / 1.53% / 1.27% / 1.02%**. This separates the two proposed components and shows the larger gain from group weighting in this setting; it does not isolate all regularization or training-compute effects. [Table 2.](https://arxiv.org/pdf/2202.07241v1#page=7)

For public benchmarks, the authors train size-100 models on **150,000 instances**: 100,000 uniform plus 10,000 from each of five other distributions. Fifteen TSPLIB and fifteen CVRPLIB instances, sizes **51-200**, are selected. The table reports aggregate gaps **29.93% AM, 17.57% POMO, 9.68% DROG, 8.08% DROP**. Substantial gaps remain: DROP's kroA100 route costs **24,623 versus the 21,282 reference**, about **15.7%**. The paper's broad near-optimal wording should not replace the actual per-instance and aggregate values. This is evidence on a selected 30-instance transfer set, without benchmark inference runtimes in Table 3 or a comprehensive conventional-solver comparison. [Table 3.](https://arxiv.org/pdf/2202.07241v1#page=7)

## Limitations

### Reported by the Authors

- Performance depends on how the uncertainty set and distribution groups are chosen.
- More flexible combinations of distributions and larger-scale problems are left for future work.
- The goal is cross-distribution robustness rather than superiority over all deep routing solvers in every aspect. [Introduction/Conclusion.](https://arxiv.org/pdf/2202.07241v1#page=7)

### Curator Notes

- Paired synthetic tests use the same generator pair for training and test; they measure new-instance performance under that mixture.
- Worst-group expected loss, atypical-group mean gap and worst-instance cost are different quantities.
- Known distribution mixtures do not cover all unknown test shifts; nonconvex training and finite data further limit guarantee claims.
- There is a material reporting inconsistency: page 5 says GCN is not applied to CVRP, yet Tables 1 and 3 include **DROG CVRP values**. Those rows are recorded as published rather than silently inferred into a fully specified additional model configuration.
- The paper's bibliography abbreviates Bello's author list and labels it ICLR2017, and dates the Lu et al. iterative method 2019. Citation edges preserve what this paper actually cites rather than repairing those entries into a future formal version.
- Training cost, eightfold augmentation, supervised versus RL variants and heuristic CVRP references must remain visible in comparisons.

## Reproducibility

- **Full reading:** all **nine pages of arXiv2202.07241v1, 15 February 2022**, including the complete bibliography, were read. Original Figure 1, Algorithm 1, all equations and Tables 1-3 were visually checked.
- **Formal metadata:** the indexed primary AAAI page confirms AAAI36(9), 9786-9794, DOI10.1609/aaai.v36i9.21214, published **28 June 2022**. This replaces an unsupported generic notification-based acceptance date. Four authors and NTU/SIMTech affiliations match the title page.
- **Scientific supplement discovery:** live AAAI landing access returned a bot challenge; its indexed publisher download list contains the paper PDF. The complete arXiv manuscript has no appendix or pointer to missing separate scientific material. The author's historical paper-specific GitHub candidate, `jiang-yuan/Learning-routing-DRO`, returned **404**. No additional accessible scientific attachment was found; unavailable material is not claimed as read.
- **Code availability:** no accessible paper-specific official implementation was located in this check. The manuscript links the upstream [GCN](https://github.com/chaitjo/graph-convnet-tsp) and [POMO](https://github.com/yd-kwon/POMO) repositories; those are baselines, not evidence of released DRO changes. No new model experiment was run.
- **Figure:** original Figure 1, PDF page 3, cropped directly with its complete caption.
