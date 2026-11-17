---
id: pareto-set-learning
short_title: P-MOCO
title: Pareto Set Learning for Neural Multi-Objective Combinatorial Optimization
authors:
- Xi Lin
- Zhiyuan Yang
- Qingfu Zhang
year: 2022
date: 2022-03-29
venue: ICLR
paper_url: https://openreview.net/forum?id=QuObT9BTWo
arxiv_url: https://arxiv.org/abs/2203.15386
code_url: https://github.com/Xi-L/PMOCO
institutions:
- City University of Hong Kong
figure:
  path: paper-assets/pareto-set-learning/framework.png
  alt: Preference-conditioned neural multi-objective model generating solutions along
    a Pareto front.
  caption: 'Figure 1: Preference-conditioned neural multi-objective combinatorial
    optimization.'
  source_url: https://arxiv.org/pdf/2203.15386
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Multi-objective Optimization
- Knapsack
problems:
- Bi-objective Traveling Salesman Problem
- Tri-objective Traveling Salesman Problem
- Multi-objective Capacitated Vehicle Routing Problem
- Multi-objective Knapsack Problem
summary: P-MOCO reuses a preference-independent encoder and a hypernetwork-conditioned
  decoder to approximate trade-off sets for each separately trained multi-objective
  problem.
publication:
  date: '2022'
  source_url: https://iclr.cc/Downloads/2022
paper_type: solver
---

# Pareto Set Learning for Neural Multi-Objective Combinatorial Optimization

> **TL;DR:** P-MOCO replaces a separate network per preference with one preference-conditioned model for a given multi-objective problem. A shared instance encoder and a hypernetwork-generated decoder produce candidate trade-offs. Different tasks, objective configurations and main training sizes use separate models; a learned policy does not certify the full Pareto front.

## Motivation

Multi-objective combinatorial problems seek a set of compromises rather than one scalar optimum. A decomposition method can train a network for every fixed preference, but storage and training grow with the desired resolution. The paper learns a reusable mapping from preferences to constructive policies, supporting additional preference queries after training (Sections 1-3).

## Contributions

P-MOCO uses a preference-agnostic attention encoder, evaluated once per instance, and a hypernetwork that generates the attention decoder parameters from the preference vector. It extends POMO-style multi-start policy optimization across preferences and provides an optional active-adaptation procedure for a particular test instance. Evaluations cover bi-/tri-objective TSP, capacitated VRP and multi-objective 0-1 knapsack, including a separately trained ten-objective knapsack model.

The single-model claim concerns preferences within a problem configuration. This remains a specialist constructive method, not one universal TSP/VRP/knapsack checkpoint. The approximate Pareto set is represented through repeated finite queries; neither exact coverage nor a fixed number of preferences sufficient for every instance is guaranteed.

## Methodology

The paper's encoder has six attention layers, 128-dimensional embeddings and eight heads. A two-hidden-layer hypernetwork generates decoder projection parameters. Sequential masks enforce task feasibility: unvisited nodes for TSP, remaining capacity/demands for CVRP, and unselected items that fit for knapsack. CVRP minimizes total route length and the longest route; knapsack maximizes multiple profits under one weight capacity.

Training samples preferences, instances and multiple rollouts, using a shared rollout-cost baseline and REINFORCE. The reported setting uses one preference per update, 64 instances and a number of starts equal to the problem size, for 200 epochs with 100,000 generated instances per epoch. Two-objective experiments use weighted Tchebycheff aggregation. Appendix D.5 explicitly uses inverted penalty-based boundary intersection (IPBI) for more than two objectives; the entire study should not be described as using Tchebycheff alone.

Inference can query additional preferences and apply task-preserving coordinate augmentation: 8^m transformations for m independent Euclidean TSP objectives, eight for CVRP, none for knapsack. Optional active adaptation updates the model on the test instance. These extra computations have separate costs from a single forward construction.

## Experiments

Main comparisons solve 200 test instances per setting and report normalized hypervolume (HV), relative HV differences and total runtime. Larger HV is better, but the displayed gap is generally relative to a selected P-MOCO result, not a certificate of distance to the unknown optimum. A 1% Wilcoxon rank-sum test is reported. Training uses one RTX 2080 Ti.

Table 1 gives 1.4M parameters for P-MOCO versus 131.3M across 101 separate attention models. On bi-objective TSP100, 101 preferences yield HV 0.67 in 16 seconds, while augmentation takes 12 minutes; weighted-sum LKH reaches HV 0.68 in 3.1 hours. Thus P-MOCO does not uniformly beat LKH in quality. On CVRP100, its 101-preference result is HV 0.44 in 36 seconds, and augmentation reaches 0.45 in 4.5 minutes. On knapsack100 it reports HV 0.86 in 15 seconds (Table 2).

For tri-objective TSP100, increasing queries from 105 to 10,011 raises reported HV from 0.44 to 0.47 while runtime rises from 19 seconds to 33 minutes. This is a resolution/budget trade-off, not a free improvement at identical inference cost (Table 3). On six out-of-distribution TSP100 instances with known fronts, augmentation plus ten-minute active adaptation obtains 1.19-1.48% HV gaps, still behind the listed LKH baseline (Appendix D.2).

Appendix D.8 trains a new ten-objective knapsack100 model and queries 715 preferences. Value-path plots compare it with evolutionary methods at their stated evaluation budgets and show transfer to 500 items. Those plots do not report the same HV statistics as the main tables, and this is not transfer from a bi-objective checkpoint.

## Limitations

Uniform preference grids can map unevenly into objective space, especially with asymmetric scales. Increasing query counts or using prior scale information helps in the shown examples but does not guarantee uniform or complete coverage. Training, objective count, aggregation and distribution affect quality; active adaptation changes the zero-shot protocol.

Appendix A's approximation statement is conditional on generating componentwise epsilon-dominating approximations to scalarized optima for every preference. The authors explicitly do not establish that neural training achieves this assumption. It should not be reported as a training-convergence or unconditional approximation-ratio guarantee.

### Curator Notes

The reverse direction of the printed Lemma 1 on page 15 needs a tie qualification: positive weighted-Tchebycheff weights can admit a dominated minimizer. For example, minimizing over objective vectors x=(1,2), y=(1,1), with strict utopia (0,0) and weights (0.9,0.1), gives value 0.9 for both even though y dominates x. The useful direction that a Pareto point can be selected by suitable weights remains distinct; this local qualification does not refute the empirical method or its conditional coverage argument.

## Reproducibility

- [ICLR 2022 entry](https://openreview.net/forum?id=QuObT9BTWo) and [official downloads](https://iclr.cc/Downloads/2022) establish publication. The complete scientific source read is [arXiv v2](https://arxiv.org/abs/2203.15386v2), May 9, 2022, marked final camera-ready, with 31 pages including all references and Appendices A-D. March 29 remains the v1 preprint date; the generic conference notification date is not retained as paper-specific acceptance evidence.
- The [official code](https://github.com/Xi-L/PMOCO), inspected at `8e734c819b0adaa2851c51ac800df5c5c7d5bbb6`, contains task-specific training/testing scripts and checkpoints. Its README describes a refactor removing graph embeddings and replacing BatchNorm with InstanceNorm; the inspected hypernetwork also differs from the printed hidden-layer specification. Reproducing paper settings requires identifying the intended revision.
- In the current tri-objective trainer, `d2 = torch.norm(...)` has no dimension argument and produces one batch-wide scalar. This shared penalty cancels in the per-instance rollout-centered advantage, unlike the per-solution IPBI term in Equation 21. This is a code-path observation at that commit, not proof that the published tables used that path. The current preference sampler also differs from the idealized uniform-simplex description.
- All 63 repository files were inventoried, with no separate PDF/ZIP scientific attachment. Both OpenReview API versions returned 403 for `QuObT9BTWo`; no explicitly referenced missing scientific document was identified. Key proofs, architecture, result tables and plots were visually checked. Experiments/checkpoints were not rerun; 20 exact existing-paper citations are recorded.
