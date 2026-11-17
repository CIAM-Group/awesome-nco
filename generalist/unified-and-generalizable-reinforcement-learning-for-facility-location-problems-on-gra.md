---
id: unified-and-generalizable-reinforcement-learning-for-facility-location-problems-on-gra
short_title: PPO-swap
title: Unified and Generalizable Reinforcement Learning for Facility Location Problems on Graphs
authors:
- Wenxuan Guo
- Runzhong Wang
- Yanyan Xu
- Yaohui Jin
year: 2025
date: '2025-04-22'
publication:
  date: '2025-04-22'
  source_url: https://dl.acm.org/doi/10.1145/3696410.3714812
venue: WWW
paper_url: https://doi.org/10.1145/3696410.3714812
institutions:
- Shanghai Jiao Tong University
- Massachusetts Institute of Technology
scope: generalist
paper_type: solver
paradigm: improvement
problem_families:
- Facility Location
problems:
- P-Median Problem
- Facility Relocation Problem
summary: A shared PPO/GNN swap agent selects facility removals and insertions for budgeted relocation and p-median
  search on weighted graphs, using Voronoi-aware features; cross-task reuse is limited to these two formulations
  and speed–quality tradeoffs remain explicit.
code_url: https://github.com/AryaGuo/PPO-swap
figure:
  path: paper-assets/unified-and-generalizable-reinforcement-learning-for-facility-location-problems-on-gra/framework.png
  alt: PPO-swap combines static graph attributes, dynamic facility and Voronoi features, a graph actor choosing
    removal then insertion, and a pooled graph critic.
  caption: 'Original Figure 2: the shared PPO-swap actor–critic and state features.'
  source_url: https://dspace.mit.edu/bitstreams/b845cf5d-15fc-49be-8b92-19916ad11248/download#page=5
---

# Unified and Generalizable Reinforcement Learning for Facility Location Problems on Graphs

> **TL;DR:** PPO-swap learns a facility-exchange policy and reuses it for budgeted facility relocation and p-median optimization. Voronoi-aware graph features support transfer to larger graphs and different facility counts. Its speed advantage is a quality–runtime tradeoff; the headline 2000× speedup applies to particular cases, rather than every average or task.

## Motivation

Facility placement on road or supply networks depends on shortest-path travel costs, which can differ substantially from Euclidean distances. Constructing a facility set once can be myopic when selected sites cannot be reconsidered. The paper learns an improving policy over complete feasible facility sets, supporting both a limited relocation budget and repeated search for a new p-median layout. [PDF pp. 2–4; article pp. 1182–1184]

## Contributions

- Introduces a shared swap-based neural agent for p-median and facility relocation on weighted graphs.
- Uses static node attributes and dynamic facility/Voronoi-cell features to represent the current solution.
- Factorizes a quadratic pair action into removal followed by conditional insertion.
- Evaluates graph-size/facility-count transfer, feature and architecture ablations, constructive neural baselines and a Shanghai road-network application. [PDF pp. 3–9, 11–15]

## Methodology

P-median selects p facilities minimizing the demand-weighted shortest-path distance to each customer's closest site. The studied relocation formulation starts from F0 and permits at most k original facilities to be replaced by sites outside F0. Cardinality and membership constraints define the two formulations; the objective does not include capacity limits, location-opening charges or the separate exposure objective of the cited relocation predecessor. [PDF p. 4, Eqs. 1–5]

The policy repeatedly removes an active facility and inserts an inactive node. Features include coordinates, demand, facility membership, current travel cost, and cell demand/travel-cost totals attached to facility nodes. GraphConv layers embed the weighted graph. The actor scores removal candidates with local/global embeddings, then conditions insertion attention on the chosen removal embedding. Masks preserve facility cardinality; the critic pools graph embeddings. PPO uses incremental improvement ratios as reward. [PDF pp. 5–6, Fig. 2, Eqs. 6–10]

For relocation, multiple trajectories start from the supplied layout and retain the best encountered solution. For p-median, an outer restart procedure initializes p sites and invokes the same SwapRelocate agent as a subroutine, allowing p swaps per trial by default. The neural model makes the exchanges in both modes; the p-median wrapper adds initialization and search-budget control. No optimality or approximation-ratio theorem for the learned policy is supplied. Shortest-path matrices are computed offline, so neural solve times should not be interpreted as including every graph-preprocessing cost. [PDF pp. 4–6, Algorithms 1–2]

**Classification: Generalist / improvement.** Section 4.5 and Algorithms 1–2 reuse the same swap agent across the two native formulations, and the official implementation has one model loader/training route used by both FRP and PMP entry points. This supports the described cross-task policy reuse. It does not assert one model across every experimental domain: the Euclidean/unweighted comparison and Shanghai population-perturbation experiment describe additional training. Historical shared weight files were not available to inspect directly. [PDF pp. 6–9, 11; methods/ppo_swap.py]

## Experiments

The main synthetic data are weighted Gabriel graphs, with demand totals around three million. Training uses 1,000 graphs of 100 nodes. Testing uses ten graphs per size n=100, 200, 500 or 1000 and p=5,10,…,40 facilities. FRP starts from random facilities, budget floor(p/2), and twenty trajectories. PMP uses five initializations, twenty swap trials and swap budget p. Gurobi uses MIPGap=0; simulated annealing runs 1,000 iterations. BestResponse is adapted to the paper's single travel-cost objective and limited budget. [PDF pp. 6–8, 11]

Appendix A specifies three GNN and three MLP layers of width 128, 300 epochs, 1,024 steps per epoch, batch 64, four optimization iterations, Adam learning rate 0.005 with decay 0.995, PPO gamma 0.9 and GAE lambda 0.95. The stated hardware is a 64-core Intel Xeon Gold 6226R and RTX 3090, CUDA 12.1. A 27-combination GNN architecture search selects GraphConv/128/three layers. Full per-facility-count tables include variability; these are not repeated-training-seed confidence intervals. [PDF pp. 10–15]

At n=1000, Table 1 reports FRP improvement ratio 67.80% in 0.16 seconds for PPO-swap, versus Gurobi's 70.09% in 128.20 seconds and Greedy-swap's 69.60% in 99.52 seconds. The ratio of rounded average times is about 801×. Particular cases do exceed 2000×: Table 8 at n=1000,p=5 gives 111.32 versus 0.03 seconds, approximately 3711×. This is a curator ratio of reported rounded means, not an independent benchmark or equal-quality comparison. [PDF pp. 7, 13]

For n=1000 PMP, Table 2 gives PPO-swap 10.16% objective gap in 1.53 seconds, versus Gurobi's zero gap in 126.40 seconds (approximately 83×) and Greedy-swap's 0.11% in 733.11 seconds. At n=100 and 200, Gurobi is faster than PPO-swap in the average PMP table and returns exact solutions. The Voronoi-feature ablation worsens the n=1000 gap to 14.73% at similar runtime. These comparisons support fast approximate solutions, rather than matching the exact solver's quality. [PDF p. 8]

The separate SpoNet comparison trains on 100-node graphs at p=15 and evaluates changed facility counts. Another comparison adapts/retrains SpoNet on shortest-path costs. The Shanghai experiment retrains with 1,000 perturbations of population on a fixed 5 km-grid road graph and presents p=20 maps. It demonstrates a domain application rather than zero-shot transfer from the synthetic checkpoint. [PDF pp. 8–9, 11]

## Limitations

Results use relatively small synthetic test sets, fixed demand generators and a restricted family of uncapacitated nearest-facility objectives. They do not establish constant complexity, exponential growth of every comparator, or broad cross-native generalization beyond the two facility formulations. The authors acknowledge feature-computation overhead on small instances. [PDF pp. 6–9]

Some printed numeric/metric details require caution. The FRP text defines gap relative to improvement ratio, yet several Random-swap gaps exceed 100% despite the best-so-far formulation including the initial layout; those entries should not silently be interpreted as that printed formula. Tables 5 and 6 also repeat all eight Gurobi improvement means/deviations for n=100 and 200. The detailed n=100 Gurobi mean times do not reproduce Table 1's 0.15-second aggregate (their rounded arithmetic mean is about 0.345 seconds). The note preserves source values and flags the discrepancy without inventing corrected historical results. [PDF pp. 7, 12–13]

Current public reproduction has additional limits. Both evaluation configurations contain placeholder checkpoint paths and the archive includes no trained weights or datasets. Its training YAML uses gamma=0.99, whereas Table 3 prints 0.9. Both task entry points instantiate the same PPOSwapSolver, but absent historical weights prevent independent file-level verification of the shared checkpoint used in the published tables. [official configuration/README and methods/ppo_swap.py]

## Reproducibility

The formal WWW 2025 paper is pp. 1182–1195, DOI 10.1145/3696410.3714812, published 2025-04-22. The four-author byline is Wenxuan Guo, Runzhong Wang, Yanyan Xu and Yaohui Jin, affiliated with Shanghai Jiao Tong University and MIT. MIT identifies its deposit as the final published version. All fifteen registered PDF pages were read: one repository cover plus fourteen scientific pages, including the complete 36-entry bibliography and Appendices A–B.

The institution's original-deposit ZIP was also obtained and inventoried: mets.xml plus a fourteen-page PDF. Every scientific page has identical extracted text and identical 72-dpi rendered pixels to the corresponding covered copy, so this is a duplicate reading copy rather than an additional scientific attachment. The complete official GitHub archive at 4c0558b41f98a48a7a1bd6697308eafceb566b88 (2025-02-11) contains 27 members/24 files and no PDF/video/nested archive. The linked Zenodo v1.0 archive has 25 members and likewise no scientific PDF/video/archive. Both inventories and hashes are saved. Publisher/OpenReview supplement endpoints returned 403; all scientific appendices explicitly named by the formal paper are integrated and fully read.

README, environment, training/evaluation settings and the shared model-loading/FRP/PMP search paths were inspected. All seven figures, twelve tables and the original Figure 2 crop were visually checked. No weights were deserialized; no neural training, Gurobi solve or historical benchmark rerun was performed. An earlier differently titled, three-author arXiv preprint was found, but is not silently substituted for this four-author formal version or used to assign its publication date.
