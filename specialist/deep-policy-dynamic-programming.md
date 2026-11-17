---
id: deep-policy-dynamic-programming
short_title: DPDP
title: Deep Policy Dynamic Programming for Vehicle Routing Problems
authors:
- Wouter Kool
- Herke van Hoof
- Joaquim Gromicho
- Max Welling
year: 2022
date: 2021-02-23
venue: CPAIOR
paper_url: https://doi.org/10.1007/978-3-031-08011-1_14
arxiv_url: https://arxiv.org/abs/2102.11756
code_url: https://github.com/wouterkool/dpdp
institutions:
- University of Amsterdam
- ORTEC
figure:
  path: paper-assets/deep-policy-dynamic-programming/framework.png
  alt: DPDP pipeline combining a learned heatmap with bounded dynamic programming search.
  caption: 'Figure 2: DPDP for TSP, from neural heatmap prediction through restricted dynamic-programming expansion.'
  source_url: https://arxiv.org/pdf/2102.11756v2#page=3
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Traveling Salesman Problem with Time Windows
summary: A supervised edge heatmap ranks bounded-width dynamic-programming states while exact resource dominance
  removes redundant partial routes.
inclusion: reference
inclusion_reason: CPAIOR is outside the approved main-conference and journal inclusion list.
publication:
  date: '2022-06-10'
  source_url: https://link.springer.com/chapter/10.1007/978-3-031-08011-1_14
---

# Deep Policy Dynamic Programming for Vehicle Routing Problems

> **TL;DR:** DPDP evaluates a supervised graph network once per instance, then uses its edge heatmap to guide restricted dynamic programming for TSP, CVRP and single-vehicle TSP with time windows. Resource-aware dominance distinguishes this search from ordinary sequence beam search; finite beams and graph pruning remain heuristic.

## Motivation

Classical dynamic programming can exploit exact state equivalence and resource dominance, but its exponential state space makes unrestricted routing search impractical. Autoregressive neural policies repeatedly evaluate a network for every partial route considered during search. DPDP instead predicts an edge heatmap once and uses inexpensive scores to explore a much wider restricted DP state space. Its goal is a flexible routing framework with competitive quality, rather than a claim to replace every specialized operations-research solver. [Sections 1-2, PDF pp. 1-4.](https://arxiv.org/pdf/2102.11756v2#page=1)

## Contributions

- Combines supervised graph-convolutional edge predictions with a bounded DP search, retaining at most `B` non-dominated partial solutions after each expansion.
- Ranks candidates using accumulated edge heat plus a manually designed remaining-node potential; optionally removes unlikely edges through heatmap thresholding.
- Defines feasible actions and dominance for TSP, capacitated VRP and **TSPTW**, including two-resource Pareto dominance for capacity or arrival time. TSPTW is a single tour, rather than a multi-vehicle VRPTW experiment.
- Provides GPU-oriented state grouping, packed visited masks and expansion pruning, with ablations isolating neural scores, potential, dominance and graph sparsity. [Sections 3-4 and Appendix A.](https://arxiv.org/pdf/2102.11756v2#page=4)

## Methodology

### Learned heatmap and state scoring

The network predicts whether each edge belongs to a teacher solution. TSP reuses the pretrained graph-convolutional model of Joshi et al.; CVRP adds depot-specific embeddings, depot edge types and normalized demands. TSPTW adds time-window features and unties the source/destination edge-update matrices so opposite directions can receive different predictions. These are problem-specific models and training targets, rather than one shared checkpoint across tasks. [Sections 3.1-3.3 and Appendix B.1.](https://arxiv.org/pdf/2102.11756v2#page=5)

The formal publication's self-contained model appendix specifies 30 residual graph-convolutional layers with 300-dimensional representations, gated neighbor aggregation, batch normalization and an edge MLP with two hidden layers. Its TSP training uses one million Concorde solutions and weighted binary cross-entropy. [Publisher Appendix 1.](https://link.springer.com/chapter/10.1007/978-3-031-08011-1_14)

For TSP, predicted edge values are symmetrized using the maximum of the two directions. A partial route receives its accumulated edge heat plus a potential estimating useful heat still accessible at unvisited nodes and the start. Incoming heat is normalized; a small distance-dependent node-weight adjustment favors preserving return connections. The potential is a hand-designed heuristic, with no admissibility or optimality guarantee for a finite beam. CVRP represents each customer visit either directly or via the depot; the via-depot heat multiplies the two depot-edge values and a factor `0.1`, biasing search against additional routes. [Sections 3.1-3.2, PDF pp. 5-6.](https://arxiv.org/pdf/2102.11756v2#page=5)

### DP construction and resource dominance

Each iteration expands every retained partial route, discards dominated expansions, then keeps the `B` highest-scoring candidates. The final solution minimizes actual route cost among the completed candidates; the heat score is used to choose which partial states survive.

- **TSP:** the state is the visited set and current node; only a minimum-cost partial route is needed for each state.
- **CVRP:** direct and via-depot actions give exactly one newly served customer per iteration. For a fixed visited set and current node, retain cost/remaining-capacity Pareto-efficient partial routes: a cheaper route with at least as much remaining capacity dominates.
- **TSPTW:** track arrival time, allow waiting before a window opens, and disallow an action that arrives late or makes another customer immediately unreachable. For the same state, lower cost and no later arrival dominate. The objective excludes waiting time.

TSP becomes exact if the beam is sufficiently large to retain the full DP state space and no necessary graph edges are removed. The reported restricted beams and sparse graphs do not inherit a general exactness guarantee. A default heatmap threshold of `1e-5` reduces expansions; the alternative is a nearest-neighbor graph. CVRP additionally connects every customer to the depot. [Sections 3.1-3.4.](https://arxiv.org/pdf/2102.11756v2#page=4)

### Training and implementation

For the basic CVRP distribution, one million 100-customer instances are labeled by one LKH run each. Training uses batch size 48, learning rate `1e-3`, at most 1,500 epochs of 500 updates and the checkpoint with lowest validation loss. TSPTW uses heuristic DP with cost-based heat/potential and beam one million to generate labels; these labels are not all certified optima. The harder time-window generator samples windows around a random no-waiting tour and increases maximum window size from 100 to 1,000. [Section 4.2 and Appendix B.2.](https://arxiv.org/pdf/2102.11756v2#page=7)

The implementation stores visited sets in 64-bit masks, groups states before checking dominance, and keeps the `O(Bn)` backtracking trace in CPU memory. Cost-sorted cumulative resource maxima/minima identify Pareto-efficient expansions. A streaming top-`B` queue reduces memory, although Appendix A.3 warns that score-bound pruning before dominance can slightly change results when score and dominance are inconsistent. Search constructs routes; it neither updates network weights per test instance nor applies neural incumbent-tour moves. [Appendix A, PDF pp. 17-20.](https://arxiv.org/pdf/2102.11756v2#page=17)

## Experiments

### Synthetic TSP100 and CVRP100

Table 1 evaluates 10,000 test instances per problem. TSP gaps use Concorde optima; CVRP gaps use the stronger HGS heuristic reference, not LKH. Times are dataset totals after training, with heatmap generation reported separately from DP search. The paper warns that literature baselines use different hardware and that starred results use slightly different datasets.

| Task and beam | Mean cost | Reference gap | Heatmap + DP time |
| --- | ---: | ---: | ---: |
| TSP100, 10K | 7.765 | 0.009% | 10 min + 16 min |
| TSP100, 100K | 7.765 | 0.004% | 10 min + 2 h 35 min |
| CVRP100, 10K | 15.830 | 1.713% | 10 min + 50 min |
| CVRP100, 100K | 15.694 | 0.843% | 10 min + 5 h 48 min |
| CVRP100, 1M | 15.627 | 0.409% | 10 min + 48 h 27 min |

The rounded TSP costs conceal the nonzero gaps. DPDP offers substantially smaller TSP gaps than many neural baselines, while POMO is much faster at 0.14% in one minute. For CVRP, LKH has 0.536% gap in 12 h 57 min and HGS is the reference at 6 h 11 min: the largest DPDP beam narrowly improves on LKH's cost but takes substantially longer, and remains behind HGS. This supports a quality/runtime trade-off rather than uniform solver dominance. [Table 1, PDF p. 8.](https://arxiv.org/pdf/2102.11756v2#page=8)

### More varied CVRP100 distribution

Table 2 uses 10,000 Uchoa-style instances with clustered locations and varied demands. DPDP gaps to HGS are 2.018%, 1.127% and 0.659% for beams 10K, 100K and 1M; LKH is at 0.507%. Thus the largest beam still trails LKH on this distribution. Runs use four GPUs; the paper also estimates one-1080Ti timings and compares HGS/LKH at 16 or 32 CPU cores. For beam 1M, the four-GPU dataset time is 2 min for heatmaps plus 12 h 7 min for search, versus an estimated single-GPU 10 min plus 48 h 27 min. Two LKH failures under its default fixed vehicle count require a rerun allowing more routes. [Section 4.2 and Table 2, PDF pp. 8-9.](https://arxiv.org/pdf/2102.11756v2#page=8)

### TSPTW100 and ablations

For 100 small-window instances, DPDP finds all optima in about seven seconds total including heatmaps, but even plain DP with a beam near ten solves this restrictive distribution; this result does not isolate a neural advantage. The larger-window dataset has 10,000 instances. Relative to 30-run GVNS, DPDP obtains -0.040% and -0.051% gaps at beams 10K and 100K, taking 10 min + 8 min 7 s and 10 min + 1 h 16 min. GVNS takes 37 min 15 s, so the smaller beam is faster while the larger beam trades additional time for quality. These negative gaps are improvements over a heuristic reference, not negative optimality gaps. LKH achieves -0.029% in 34 h 58 min; the RL/constraint-programming baselines were not rerun on the harder distribution. [Section 4.3 and Table 3.](https://arxiv.org/pdf/2102.11756v2#page=9)

Ablations use 100 CVRP100 validation instances. Learned heat improves over cost-based scores, adding potential improves its quality, and exact dominance outperforms an otherwise similar sequence beam search. Heatmap thresholding gives a better sparsity/runtime trade-off than nearest-neighbor pruning. Beam widths up to 2.5 million illustrate substantial computation growth. These are component studies on that validation set, rather than a guarantee across sizes or distributions. [Section 4.4 and Figure 3.](https://arxiv.org/pdf/2102.11756v2#page=10)

## Limitations

### Reported by the Authors

- Experiments center on 100 nodes; the fully connected graph network's quadratic scaling and the DP beam limit larger instances.
- Supervised teacher solutions are expensive, particularly for larger or more complex problems.
- The heat-plus-potential function and sparsity threshold require manual design or tuning. Transferring the framework to a new problem still requires its own state, action, feasibility and dominance definitions.
- Specialized HGS/LKH solvers remain difficult to beat in general; the authors do not present DPDP as a practical replacement for every routing setting. [Section 5.](https://arxiv.org/pdf/2102.11756v2#page=11)

### Curator Notes

- One reusable DP framework across tasks is compatible with this repository's **specialist / constructive** classification: the experiments use task-specific neural models and complete routes are built from partial states.
- Beam truncation, heatmap edge removal and score-bound implementation choices can discard a state needed by the unrestricted optimum. Large-beam quality should be assessed alongside memory and actual search time.
- HGS, GVNS and LKH reference gaps, different test distributions and estimated hardware timings must remain separate. Training and label-generation costs are additional to the tables' inference totals.

## Reproducibility

- **Reading version:** the complete [arXiv v2 manuscript, revised 2 December 2021](https://arxiv.org/abs/2102.11756v2), including Appendices A-B, was reread. The [formal CPAIOR chapter](https://link.springer.com/chapter/10.1007/978-3-031-08011-1_14), published 10 June 2022, provides additional self-contained model details in its online appendices; these appendices were also read. The author manuscript supplies the numerical results summarized here. CPAIOR remains a reference venue under this repository's inclusion policy.
- **Official implementation:** [wouterkool/dpdp](https://github.com/wouterkool/dpdp), linked in Section 3.5. Its README gives training/evaluation commands and links to datasets, labels, checkpoints, heatmaps and saved results, including TSPTW resources. Download availability was inspected; the experiments were not rerun.
- **Implementation/version caution:** the released README notes a later batched implementation: small-beam timing improves, large-beam execution is roughly 10% less efficient and results may vary slightly. Consequently current-code timings should not be silently substituted for the manuscript tables. The README also identifies a gradient issue with its optional model-checkpointing configuration.
- **Audit locators:** main PDF pp. 4-7 for definitions, pp. 8-10 for every main table/ablation, pp. 17-21 for implementation and TSPTW generation; publisher Appendix 1 for the full GNN description. The displayed asset is an uncropped-content rendering of original Figure 2 on PDF p. 3.
