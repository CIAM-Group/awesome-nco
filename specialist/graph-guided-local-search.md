---
id: graph-guided-local-search
short_title: RGLS
title: Graph Neural Network Guided Local Search for the Traveling Salesperson Problem
authors:
- Benjamin Hudson
- Qingbiao Li
- Matthew Malencia
- Amanda Prorok
year: 2022
date: 2021-10-11
venue: ICLR
paper_url: https://openreview.net/forum?id=ar92oEosBIg
arxiv_url: https://arxiv.org/abs/2110.05291
code_url: https://github.com/proroklab/gnngls
institutions:
- University of Cambridge
- University of Pennsylvania
figure:
  path: paper-assets/graph-guided-local-search/framework.png
  alt: Original pipeline maps a TSP to its line graph, predicts edge regret, and uses those scores in Guided Local Search.
  caption: 'Figure 1: line-graph regret prediction and Guided Local Search.'
  source_url: https://arxiv.org/pdf/2110.05291v3#page=4
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: A supervised line-graph GNN predicts static edge regret to initialize and guide classical GLS tour improvement; matched ten-second learned-baseline gains coexist with stronger conventional solvers and costly forced-edge training labels.
publication:
  date: '2022'
  source_url: https://openreview.net/forum?id=ar92oEosBIg
---
# Graph Neural Network Guided Local Search for the Traveling Salesperson Problem

> **TL;DR:** A GNN predicts the global regret of including each edge. A classical greedy rule uses these scores for initialization, and GLS uses them to decide which incumbent-tour edges to penalize before 2-opt/relocate improvement. The paper reports lower mean gaps than three selected learned baselines at a **ten-second per-instance budget**. Conventional Concorde/LKH-3 remain much faster and stronger on these small Euclidean TSPs.

## Motivation

GLS escapes local minima by penalizing unfavorable features of a completed solution. Edge length alone cannot describe the global consequence of including an edge. The paper learns that consequence from training instances, while retaining the explicit feasibility handling and neighborhood operators of conventional local search. Evaluation focuses on symmetric Euclidean TSP; applicability to other routing problems is proposed rather than experimentally demonstrated. [Sections 2-4.](https://arxiv.org/pdf/2110.05291v3#page=3)

## Contributions

- **Global edge regret:** the relative cost of the best tour forced to contain an edge compared with the unconstrained optimum.
- **Line-graph regression:** represent original edges as graph nodes so a GNN can use distances without absolute city coordinates.
- **Regret-guided GLS:** use predicted regret for the initial greedy tour and for penalizing unfavorable edges during incumbent improvement.
- **Time-aware evaluation:** compare full solver pipelines under fixed and unrestricted budgets, study small-to-large/TSPLIB transfer, and measure the benefit and overhead of additional features. [Sections 4-5/Appendices A-D.](https://arxiv.org/pdf/2110.05291v3#page=5)

## Methodology

### Target and representation

For edge e, the target is **r_e = g(s*_e)/g(s*) - 1**, where s*_e is the best tour containing e and s* is an unconstrained optimal tour. This is a static, instance-level edge score. It is not the conditional regret of appending an edge to the current partial tour, and does not certify that arbitrary zero-regret prefixes can be combined into one optimal tour. [Equation 4.](https://arxiv.org/pdf/2110.05291v3#page=5)

The line graph has one node per original undirected edge, with adjacency when two original edges share a city. Euclidean edge length is the sole input in the main configuration. A 128-dimensional embedding enters **three non-shared message-passing layers**, each with eight attention heads, residual connections, batch normalization and a 512-unit ReLU feed-forward sublayer. A linear head predicts regret. The line graph has quadratic many nodes and cubic-order adjacency in the original city count, so its relative sparsity does not remove the scaling cost. [Equations 5-8/Appendix A.](https://arxiv.org/pdf/2110.05291v3#page=6)

### Offline supervised training

Training uses **100,000 random unit-square instances separately at each size 20, 50 and 100**. Unconstrained tours come from **Concorde**. Tours with a required edge are computed with **LKH-3, 100 trials and ten runs**; the authors empirically validate this setting on instances up to 100 nodes. These forced-edge labels are not described here as independently certified exact optima. Input features/targets are scaled to [0,1], and squared regression loss is minimized with Adam, initial rate .001, exponential factor .99 per epoch, up to 100 epochs with early stopping. Batches are 32 for sizes 20/50 and 15 for size 100 because of GPU memory. [Appendix A.](https://arxiv.org/pdf/2110.05291v3#page=13)

### Initialization and incumbent improvement

Starting from the origin, a greedy nearest-neighbor-style procedure repeatedly selects the unvisited neighbor with the **smallest predicted regret**, then closes the tour. The same static predictions guide GLS; the network is not repeatedly retrained or re-evaluated after every local move. Current public inference code clamps negative predictions to zero after inverse scaling.

GLS alternates two phases. **Optimization** performs best-improvement 2-opt and relocate under original distances until neither neighborhood improves the tour. **Perturbation** augments distances by edge penalties, selects an incumbent edge with maximum utility **predicted_regret/(1 + penalty)**, increases its penalty and searches restricted moves around that edge. After **20 successful perturbation moves**, ordinary optimization resumes. The best original-distance tour is retained until the wall-clock limit. Twenty is this perturbation quota, not the total number of neural or search iterations. Current code sets the penalty scale to .1 times the initial cost divided by city count; its function-level quota default is 30, but the released evaluation entry point explicitly passes **20**. [Section 4.3/Appendix A.](https://arxiv.org/pdf/2110.05291v3#page=6)

Classification is corrected to **specialist / constructive-improvement**. The paper explicitly adapts both the **construction of the initial tour** and subsequent incumbent improvement using its newly learned regret. Greedy feasibility handling does not remove the learned construction role: predicted regret directly determines which edge is added. The same score then guides GLS moves. The paper's word hybrid also describes combining machine learning and operations research, but this repository's mixed classification follows the two actual solving stages. The reported ablation does not isolate learned initialization from learned penalties, and no jointly trained cross-task checkpoint is shown. [Section 4.3/Table 5.](https://arxiv.org/pdf/2110.05291v3#page=6)

## Experiments

### Protocol and budget

The main tests use **1,000 instances per size**, at 20/50/100 cities. All rerun methods use one Xeon E5-2650 v4 CPU core, 24 GB RAM and one Tesla P100 16 GB GPU. Instances are processed one at a time; parallel candidates within one instance are allowed. Fixed-budget tests allow **ten seconds per instance including feature calculation, GNN evaluation and initial tour construction**. Neural training and forced-edge label generation are offline costs outside that limit. The code checks the deadline between outer search phases, so the measured duration can modestly exceed ten seconds. [Section 5/Appendix A.](https://arxiv.org/pdf/2110.05291v3#page=7)

Unrestricted-budget tests retain baseline-specific schedules. For example, AM uses 1,280 samples and da Costa et al. uses 2,000 improvement iterations; these are changed to run until the deadline in the fixed-budget experiment. The authors also correct a duplicate-city/invalid-tour issue in Joshi et al.'s beam search by discarding invalid candidates. These are the paper authors' adapted baseline results, not an independent rerun in this repository. POMO and Fu et al. rows copied from their papers lack comparable per-instance runtimes and should not be merged into the matched ten-second ranking. [Appendix A/Listing 1.](https://arxiv.org/pdf/2110.05291v3#page=14)

### Fixed ten-second results

| Test | RGLS mean gap | RGLS optimal tours | Selected learned comparator |
| --- | --- | --- | --- |
| TSP20 | 0.000% | 100.0% | da Costa .002%, 99.0% optimal |
| TSP50 | .009% | 96.2% | da Costa .268%, 48.7% optimal |
| TSP100 | .705% | 20.5% | da Costa 1.534%, 1.4% optimal |

These are **mean gaps and exact-tour frequencies**, distinct metrics. On TSP100, Joshi et al. reaches **51.6% optimal tours** but has a worse **1.559% mean gap**: RGLS does not lead every success-rate metric. Concorde solves all three small test sets optimally within the allowed budget. The highlighted approximately 30-fold/2-fold gap reductions concern selected learned baselines. [Table 2.](https://arxiv.org/pdf/2110.05291v3#page=9)

The unrestricted-time table is especially important for practical comparison: on TSP100, RGLS averages **.698% in 10.108 seconds**, whereas LKH-3 obtains **.011% in .118 seconds** and Concorde **0% in .573 seconds**. The learning-only Pareto front and the full solver Pareto front are different comparisons. [Table 1/Figure 3.](https://arxiv.org/pdf/2110.05291v3#page=8)

### Transfer and feature ablations

Training on 20 cities and testing on 100 yields **2.622%** mean gap in the main transfer experiment, compared with the cited learned baseline's **18.845%**. Appendix C's full convergence curves cover 20-to-50, 50-to-100 and 20-to-100 transfer; the best route is still evaluated against the larger instance's true optimum. This is within-task size transfer, not a new routing task. [Figure 5.](https://arxiv.org/pdf/2110.05291v3#page=17)

For **29 Euclidean TSPLIB instances with 50-200 nodes**, models trained on random 100-city problems are evaluated across ten runs. RGLS averages **1.529% at 10.420 seconds**, versus da Costa **1.725% at 31.766 seconds**, AM **16.767% at .532 seconds**, and Joshi **40.025% at 7.000 seconds**. Solver budgets are unequal; the large AM mean includes a severe instance-level outlier. The table is not a matched-budget proof of universal superiority or a comparison with state-of-the-art conventional TSPLIB solvers. [Table 3.](https://arxiv.org/pdf/2110.05291v3#page=18)

Appendix D evaluates ten extra engineered features, trains **100 Latin-hypercube-selected feature sets for 35 epochs**, and fits a Gaussian-process sensitivity model to validation loss. Edge weight is most influential, followed by neighbor rank, depot weight, edge width and node width. Using the top five improves some regret predictions but its extra feature computation cancels the search benefit. Under the ablation's separate training hyperparameters, 20-to-100 transfer is **2.183% with edge weight alone versus 2.228% with five features** after ten seconds; these must not be conflated with the main 2.622% transfer result. [Tables 4-5/Figure 6.](https://arxiv.org/pdf/2110.05291v3#page=19)

## Limitations

### Reported by the Authors

- Supervised regret labels are expensive; end-to-end training is left for future work.
- The line-graph representation consumes more GPU memory than models on the original city graph.
- Additional input features may improve regression while failing to improve time-limited solving.
- Extending to other routing constraints still requires suitable task-specific local-search operators. [Discussion/Appendix D.](https://arxiv.org/pdf/2110.05291v3#page=9)

### Curator Notes

- Forced-edge labels are based on empirically strong LKH-3 settings; a label-generation heuristic is not an exactness certificate.
- Static global edge regret ignores compatibility with the current partial route; the classical solver supplies feasibility and full-tour editing.
- The strongest headline reductions compare selected learned baselines. Conventional solvers dominate these small tests, and optimal-tour frequency can reverse the learned ranking.
- Offline label/training cost, line-graph memory and baseline-version modifications matter for reproduction.
- TSP-only size/distribution transfer does not demonstrate one cross-task generalist model.

## Reproducibility

- **Full reading:** all **20 pages of arXiv v3, 4 April 2022**, including Appendices A-D and Listing 1, were freshly read. Architecture/formulae and all scientific figures/tables were visually inspected. Formal eligibility is ICLR2022; reading provenance is the accepted arXiv fallback, not an unobserved OpenReview PDF.
- **Metadata:** arXiv confirms first submission **11 October 2021**, four authors, and the v3 revision. The title page gives Cambridge and **University of Pennsylvania**. The prior generic conference notification day was removed because it was not individual acceptance evidence.
- **Scientific supplement discovery:** OpenReview forum/API were inspected but returned a verification page/403. The complete arXiv v3 embeds A-D; its text points to no missing separate scientific appendix. The official author's 3,037-member repository tree and full README were inspected; no additional scientific PDF/ZIP was found. Unretrieved OpenReview attachments are not claimed to have been inspected or read.
- **Official code:** [proroklab/gnngls](https://github.com/proroklab/gnngls), correcting the prior 404 repository path. The full README and relevant generation, training and evaluation/search paths were inspected. Git-LFS test sets/pretrained models and Pipenv instructions are documented; no new solver experiment was run here.
- **Figure:** original Figure 1, PDF page 4, directly cropped with its complete pipeline and caption.
