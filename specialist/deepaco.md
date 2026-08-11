---
id: deepaco
short_title: DeepACO
title: 'DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization'
authors:
  - Haoran Ye
  - Jiarui Wang
  - Zhiguang Cao
  - Helan Liang
  - Yong Li
year: 2023
date: 2023-09-25
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/883105b282fe15275991b411e6b200c5-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2309.14032
code_url: https://github.com/henry-yeh/DeepACO
institutions:
  - Soochow University
  - Singapore Management University
  - Tsinghua University
scope: specialist
paradigm: constructive-improvement
problem_families:
  - Routing
  - Assignment
  - Scheduling
  - Subset Selection
problems:
  - Traveling Salesman Problem
  - Capacitated Vehicle Routing Problem
  - Orienteering Problem
  - Prize Collecting Traveling Salesman Problem
  - Sequential Ordering Problem
  - Single Machine Total Weighted Tardiness Problem
  - Resource-Constrained Project Scheduling Problem
  - Multiple Knapsack Problem
summary: DeepACO learns instance-dependent heuristic measures for Ant Colony Optimization, using them both to construct solutions and to guide perturbations between local-search phases.
figure:
  path: paper-assets/deepaco/framework.png
  alt: Side-by-side workflow diagrams for conventional ACO and DeepACO.
  caption: 'Figure 1: Schematic comparison of ACO and DeepACO, including learned heuristic measures and optional local search.'
  source_url: https://arxiv.org/pdf/2309.14032
---

# DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization

> **TL;DR:** DeepACO learns instance-dependent heuristic measures for Ant Colony Optimization, using them both to construct solutions and to guide perturbations between local-search phases.

## Motivation

ACO relies on problem-specific heuristic measures that are normally designed using expert knowledge. This manual design makes it costly to transfer ACO to less-studied problems. Pure learned construction can be fast but may leave solution quality on the table, while conventional local search can become trapped in local optima. DeepACO aims to learn the heuristic measures and reuse them throughout a combined construction-and-search pipeline.

## Contributions

- Learns instance-dependent ACO heuristic measures with a graph neural network and deep reinforcement learning.
- Integrates learned measures into the probability distribution used by artificial ants during solution construction.
- Proposes neural local search that alternates objective-driven refinement with learned heuristic-guided perturbation.
- Introduces multihead, entropy-regularized, and imitation-based variants to balance exploration and exploitation.
- Evaluates the same general framework and hyperparameter setting across eight combinatorial problems.

## Methodology

1. A graph neural network maps a problem instance to heuristic measures for candidate solution components.
2. ACO combines those measures with instance-specific pheromone trails to sample complete solutions.
3. Conventional local search refines each selected solution until reaching a local optimum.
4. A neural-guided perturbation favors components with high learned heuristic values, moving the search to another region.
5. Local refinement and learned perturbation alternate for a fixed number of iterations.
6. REINFORCE trains the heuristic learner using both the cost of constructed solutions and the cost after neural local search.

## Experiments

- **Problems:** TSP, CVRP, OP, PCTSP, SOP, SMTWTP, RCPSP, and MKP
- **Problem families:** Routing, assignment, scheduling, and subset selection
- **ACO variants:** Ant System, Elitist Ant System, MAX-MIN Ant System, and an advanced adaptive variant
- **Routing comparisons:** Specialized neural construction and heatmap-based solvers, LKH, and ACO baselines
- **Metrics:** Objective value, optimality gap, runtime, and solution evaluations
- **Ablations:** Neural-guided perturbation, training with local search, multihead decoding, entropy loss, and imitation loss
- **Main finding:** Learned heuristic measures consistently improve the tested ACO variants; coupling construction with neural local search is competitive with specialized neural solvers on the studied routing tasks.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- Compressing learned information into an `n x n` heuristic matrix may be too restrictive for complex problem structures.
- Without local-search components, the learned heuristic measures may not produce near-optimal solutions.

### Curator Notes

- The method inherits problem modeling, pheromone modeling, and local-search requirements from ACO; applying it to a new problem is not completely problem-agnostic.
- Better solution quality generally requires more ACO evaluations or neural-local-search iterations, so inference budgets must be matched in comparisons.
- Broad evaluation across problems does not make the released models generalist under this repository's definition because training is problem-specific.

## Reproducibility

- Official implementation: [henry-yeh/DeepACO](https://github.com/henry-yeh/DeepACO)
- Implementations for multiple problem types: available
- Neural local-search variants for TSP and CVRP: available
- Main paper references: Sections 3-5 and Appendices B-D
