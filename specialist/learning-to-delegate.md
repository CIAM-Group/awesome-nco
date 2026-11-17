---
id: learning-to-delegate
short_title: L2D
title: Learning to Delegate for Large-Scale Vehicle Routing
authors:
- Sirui Li
- Zhongxia Yan
- Cathy Wu
year: 2021
date: '2021-07-08'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/dc9fa5f217a1e57b8a6adeb065560b38-Abstract.html
arxiv_url: https://arxiv.org/abs/2107.04139
code_url: https://github.com/mit-wu-lab/learning-to-delegate
institutions:
- Massachusetts Institute of Technology
figure:
  path: paper-assets/learning-to-delegate/framework.png
  alt: 'Complete six-panel Learning to Delegate loop: current routes, centroids, local route groups, learned selection,
    black-box subsolver, and replaced solution.'
  caption: 'Figure 1: Iterative VRP framework from a current solution to subproblem selection and repaired solution.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/file/dc9fa5f217a1e57b8a6adeb065560b38-Paper.pdf#page=3
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Capacitated Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Mixed Pickup and Delivery
summary: A supervised selector predicts black-box subsolver costs for spatial groups of complete routes, choosing
  promising local VRP improvements while retaining solver-specific feasibility.
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper/2021/hash/dc9fa5f217a1e57b8a6adeb065560b38-Abstract.html
---

# Learning to Delegate for Large-scale Vehicle Routing

> **TL;DR:** Learn which group of nearby complete routes a strong solver should improve next. A Transformer predicts the subsolver's output cost; repeated accepted local replacements make large VRP search faster under the evaluated budgets.

## Motivation

A strong routing solver can spend hours refining a problem with thousands of customers. Solving selected smaller subproblems can be cheaper, but random selection wastes calls on already good regions. Learning to Delegate (L2D) learns an ordering over spatially local subproblems while retaining an existing solver for actual route optimization and feasibility.

## Contributions

- Restricts a combinatorial route-subset search space to one local candidate per current route, then learns which candidate to delegate.
- Uses supervised **subsolver-cost regression** with moderate-quality labels; optimal global solutions and reinforcement learning are unnecessary for the main selector.
- Evaluates CVRP, capacitated time windows, mixed pickup/delivery, spatial-distribution transfer, and both LKH-3 and HGS subsolvers. Models are separately trained for relevant distributions, variants, or solvers; this is not a single shared multitask checkpoint.

## Methodology

Each candidate contains the depot and all customers from the `k` routes whose centroids are closest to a chosen route's centroid. There are as many candidates as current routes, `R=O(N)`, though finding and scoring them still has a cost. Selecting entire routes means a feasible replacement can be combined with untouched routes. The subsolver is deliberately not given the current subsolution, to avoid inheriting its local optimum. At test time, a hill-climbing check rejects non-improving replacements; masking avoids immediately reselecting the same failed subproblem. These safeguards also apply to heuristic selection baselines. [Main, Sections 4-5, Algorithm 1.]

For candidate `S`, the selector predicts the subsolver's new cost `f(S)` and chooses the largest `current_cost(S)-f(S)`. It does not directly regress improvement or encode the current route ordering. Input consists of the unordered customer coordinates relative to the depot and capacity-normalized demands. Six Transformer layers use dimension 128, eight heads, feed-forward size 512, layer normalization and no dropout. A final linear projection and mean pooling output one scalar; Huber loss fits the solver-produced cost. Predictions and solver results for unchanged candidates are cached. [Main, Figure 2 and Section 5; supplement, A.1.]

Labels come from enumerating every candidate at each training step, executing the subsolver, and selecting the best observed immediate improvement. For the default LKH-3 CVRP setting, `k=10`, 500 LKH trials per candidate, and 30 greedy delegation steps are used. Actual uniform training combines 2,000 instances each at sizes **500 and 1,000 only**; Appendix A.1 explicitly states that size-2,000/3,000 labels were not collected for this setting, qualifying the main text's broader description. Clustered/mixed training similarly excludes size 2,000. [Supplement, A.1-A.2.]

Initialization splits space into ten angular sectors and runs LKH-3 for 100 trials per sector. This separately costs approximately 6/18/50/94 s at sizes 500/1,000/2,000/3,000. Label generation takes about ten hours on 200 CPUs; training takes at most eight hours on one V100. Adam uses learning rate 0.001, cosine decay and 40,000 updates. **Table 6 says batch size 512 while its accompanying prose says 2,048; the official README training command also uses 2,048.** This source inconsistency is retained explicitly. [Supplement, A.1; official README.]

A separate alternative jointly classifies all subproblems with a GAT and KL-divergence soft-label loss. It requires separate-size training in the experiments and sometimes outperforms regression on the constrained variants. It is an ablation, not the Transformer regressor's architecture. [Supplement, A.5.1.]

## Experiments

**Evaluation and metric.** Default validation/test sets have 40 instances per size, and results average five random runs with standard errors. Delegation and solver evaluation use one CPU thread and no GPU; AM/NeuRewriter baselines use a V100 plus 20 CPUs. The main speedup target is **95% of the baseline solver's improvement from initialization**, not 95% optimality or a fixed percentage of its final objective value. LKH-3 runs 30,000 trials, or 50,000 at size 3,000. Initialization quality and its measured time must be retained when reproducing comparisons. [Main, Sections 6.1-6.2; supplement, A.1.]

**Uniform CVRP.** Table 1 reports 7x/12x/15x speedups over LKH-3 at that target for 500/1,000/2,000 customers. Short delegation runs take 38 s/1.5 min/3.4 min and yield costs 61.99/119.87/234.89. Doubling those times gives 61.70/119.55/233.86, versus LKH-3's 30,000-trial costs 61.87/119.88/234.65 after 30/77/149 minutes. Random delegation already provides 3.8x/5.5x/8.0x; learned selection's incremental advantage is much smaller than attributing the whole solver speedup to the neural network. At long budgets, the selection methods approach similar local improvements. [Main, Table 1, Figures 4-5.]

**Transfer and variants.** At size 2,000, clustered/mixed speedups over LKH-3 are 13x-26x, versus random's 6.4x-11x. Transfer to size 3,000 uses unchanged models. The Belgium experiment is not a direct 30,000-customer evaluation: ten original regional instances are subsampled to 2,000 customers, demands are regenerated to 1-9, and capacity becomes 50. The clustered model transfers well, while the uniform model can perform worse than random. Separate constrained-variant models use `k=5`: reported size-2,000 speedups are 8.2x for CVRPTW and 31x for mixed pickup/delivery, versus random's 5.9x/20x. At long times, CVRPTW size 500 can finish worse than the LKH-3 baseline. [Main, Sections 6.3-6.5; supplement, A.2-A.4.]

**HGS.** HGS-based models use new HGS-generated labels with a one-second subsolve budget. At sizes 2,000/3,000, reported speedups over full-instance HGS are 103x/198x, versus random delegation's 77x/152x. This is solver-specific retraining, not unchanged transfer of an LKH predictor. HGS cannot accept the common initial solution, so the evaluation subtracts mean LKH initialization time from its runtime and references the common initial cost. HGS has better final quality at size 500; its 2,000/3,000 runs are not fully converged. These details limit how broadly the headline acceleration can be interpreted. [Main, Section 6.6; supplement, A.5.3.]

**Ablations.** Smaller `k=5` candidates can improve early speed but converge to worse quality than `k=10`. Simpler regressors are competitive during the first few seconds but eventually approach the random-selection baseline. Weaker-initialization transfer is tested without fine-tuning; it reduces speed and quality despite retaining a learned-selection advantage. [Supplement, A.5.2, A.5.4-A.5.5.]

## Limitations

The selector targets immediate gains from a particular subsolver and distribution. It requires expensive label generation, a feasible initial solution, spatially local candidates, and external solver calls. A linear candidate count does not prove linear total runtime or constant per-step cost under arbitrary route changes. Locality and fixed candidate size can limit final solution quality; long-budget baselines can catch up or outperform it. The appendix proposes applications to TSP, graph problems and scheduling, but does not evaluate learned solvers for those additional domains. No optimality certificate is provided.

## Reproducibility

- **Official code:** [mit-wu-lab/learning-to-delegate](https://github.com/mit-wu-lab/learning-to-delegate), explicitly linked in the paper. Its full README documents all variants, solver builds, generation/training/evaluation commands, single-thread timing, checkpoints and a roughly 10 GB data/model archive. Instructions were inspected; the archive and experiments were not executed.
- **Reading:** All 14 publisher main-paper pages and all 19 publisher supplement pages were freshly read. This includes the complete classification alternative, every experimental appendix and all figures, rather than only the abstract's speedup claims. [Audit record](../data/reviews/papers/learning-to-delegate.json).
- **Supplement inventory:** The official NeurIPS landing links one Supplemental PDF, whose complete Appendix A.1-A.6 was read. No extra scientific ZIP attachment is linked. The code repository's large ZIP is described as data/configurations/checkpoints, not a missing scientific appendix.
- **Dates:** First arXiv submission: 8 July 2021. Formal publication: NeurIPS 2021. A conference-wide notification date was removed because it does not establish this paper's individual acceptance date.
