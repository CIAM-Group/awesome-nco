---
id: learning-co-over-graphs
short_title: S2V-DQN
title: 'Learning Combinatorial Optimization Algorithms over Graphs'
authors:
  - Hanjun Dai
  - Elias B. Khalil
  - Yuyu Zhang
  - Bistra Dilkina
  - Le Song
year: 2017
date: 2017-04-05
acceptance:
  date: "2017-09-04"
  source_url: "https://neurips.cc/Conferences/2017/Dates"
venue: NIPS
paper_url: https://papers.nips.cc/paper_files/paper/2017/hash/d9896106ca98d3d05b8cbdf4fd8b13a1-Abstract.html
arxiv_url: https://arxiv.org/abs/1704.01665
code_url: https://github.com/Hanjun-Dai/graph_comb_opt
institutions:
  - Georgia Institute of Technology
  - Ant Financial
scope: specialist
paradigm: constructive
problem_families:
  - Graph Optimization
  - Routing
problems:
  - Minimum Vertex Cover
  - Maximum Cut
  - Traveling Salesman Problem
summary: S2V-DQN combines graph embeddings and fitted Q-learning to learn greedy construction heuristics for graph combinatorial optimization problems.
figure:
  path: paper-assets/learning-co-over-graphs/framework.png
  alt: S2V-DQN graph embedding and greedy node-selection process for two construction steps.
  caption: 'Figure 1: Graph embedding and greedy construction in the S2V-DQN framework.'
  source_url: https://arxiv.org/pdf/1704.01665
---

# Learning Combinatorial Optimization Algorithms over Graphs

> **TL;DR:** S2V-DQN learns greedy graph algorithms by using structure2vec embeddings inside a Q-learning policy that adds one node to the partial solution at a time.

## Motivation

Designing effective heuristics for NP-hard graph optimization problems usually requires problem-specific expertise and repeated experimentation. In many applications, similar instances of the same graph problem are solved repeatedly, making it useful to learn heuristics from an instance distribution. This paper asks whether graph structure and reinforcement learning can be combined to learn such heuristics automatically.

## Contributions

- Frames graph combinatorial optimization as learning a greedy meta-algorithm that constructs a solution by adding nodes sequentially.
- Uses structure2vec graph embeddings to represent nodes in the context of both the graph and the current partial solution.
- Trains the greedy policy with fitted Q-learning rather than whole-solution policy-gradient updates.
- Applies the same high-level framework to Minimum Vertex Cover, Maximum Cut, and Traveling Salesman Problem.
- Evaluates generalization to larger graphs and benchmark or real-world datasets.
- Provides qualitative analysis of learned heuristics for MVC and MAXCUT.

## Methodology

1. A graph optimization problem is expressed through a common greedy construction template.
2. The state consists of the graph and the current partial solution.
3. Candidate actions correspond to adding a node to the partial solution.
4. A helper procedure maps the ordered selected nodes to a feasible problem-specific structure.
5. structure2vec computes node embeddings that reflect graph neighborhoods and the current partial solution.
6. A Q-network scores candidate nodes by estimating the future objective contribution of each action.
7. Fitted Q-learning trains the model from replayed transitions, and inference uses the learned greedy policy.

## Experiments

- **Problems:** Minimum Vertex Cover, Maximum Cut, and TSP in the main experiments; Set Covering Problem is included in the appendix.
- **Synthetic data:** Erdos-Renyi and Barabasi-Albert graph families for MVC and MAXCUT, plus random and clustered Euclidean TSP instances.
- **Benchmark and real-world data:** MemeTracker for MVC, physics MAXCUT instances, and TSPLIB for TSP.
- **Baselines:** Pointer Network actor-critic, MVC approximation heuristics, MAXCUT approximation and SDP-based methods, CPLEX, Concorde, Christofides, insertion heuristics, nearest neighbor, MST, and 2-opt.
- **Metrics:** Approximation ratio relative to optimal or best-known solutions, runtime, generalization across graph sizes, and benchmark performance.
- **Main finding:** S2V-DQN performs strongly on MVC and MAXCUT, generalizes from smaller training graphs to larger test graphs, and outperforms the tested competitors on the reported realistic datasets; on synthetic TSP, classical heuristics such as farthest insertion and 2-opt remain competitive.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- For dense graphs, the authors identify edge sampling for graph embedding computation as future work to reduce runtime.
- Some approximation ratios are computed against the best solution found by solvers within a one-hour cutoff, so the reference may not always be truly optimal.
- Runtime comparisons are affected by hardware differences because the learned method uses GPU computation.

### Curator Notes

- The framework is evaluated by training problem-specific policies, so it does not meet this repository's definition of a generalist neural solver.
- The greedy construction template is natural for the studied problems but may require nontrivial helper procedures for other combinatorial structures.
- The main reported gains are strongest on graph-structured MVC and MAXCUT; TSP results are more mixed against strong classical heuristics.
- Learned behavior is analyzed empirically, but the method does not provide approximation guarantees comparable to classical approximation algorithms.

## Reproducibility

- **Official implementation:** [Hanjun-Dai/graph_comb_opt](https://github.com/Hanjun-Dai/graph_comb_opt)
- **Checkpoints:** Not clearly documented.
- **Main paper references:** Sections 2-6 and Appendices B-D.
