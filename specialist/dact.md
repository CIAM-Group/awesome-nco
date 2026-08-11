---
id: dact
short_title: DACT
title: 'Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer'
authors:
  - Yining Ma
  - Jingwen Li
  - Zhiguang Cao
  - Wen Song
  - Le Zhang
  - Zhenghua Chen
  - Jing Tang
year: 2021
date: 2021-10-06
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/5c53292c032b6cb8510041c54274e65f-Abstract.html
arxiv_url: https://arxiv.org/abs/2110.02544
code_url: https://github.com/yining043/VRP-DACT
institutions:
  - National University of Singapore
  - A*STAR
  - Shandong University
  - University of Electronic Science and Technology of China
  - Hong Kong University of Science and Technology
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
  - Capacitated Vehicle Routing Problem
summary: DACT improves an existing route by separately encoding node identity and cyclic position, then learning pairwise local moves with PPO.
figure:
  path: paper-assets/dact/framework.png
  alt: Dual-aspect collaborative Transformer policy network with node and positional feature streams.
  caption: 'Figure 3: Architecture of the dual-aspect collaborative Transformer policy network.'
  source_url: https://arxiv.org/pdf/2110.02544
---

# Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer

> **TL;DR:** DACT improves an existing route by separately encoding node identity and cyclic position, then learning pairwise local moves with PPO.

## Motivation

Transformers are effective construction models, but standard positional encodings are designed for linear sequences. Routing solutions are cyclic: the same tour can be represented by different rotations or traversal directions. Fusing node features and positional features may also introduce incompatible correlations. These issues make conventional Transformer representations less suitable for neural improvement heuristics and can hurt size generalization.

## Contributions

- Proposes a Dual-Aspect Collaborative Transformer that maintains separate node and positional embeddings while allowing information exchange between them.
- Introduces cyclic positional encoding to represent the rotation and reflection symmetries of routing solutions.
- Uses a dual-aspect decoder to combine action proposals derived from node and positional views.
- Introduces a curriculum-learning strategy for more stable and sample-efficient PPO training.

## Methodology

1. The current route is represented through node features and positions in the cyclic solution.
2. Two embedding streams encode node and positional information separately.
3. Collaborative attention lets each stream refer to the other without prematurely merging their representations.
4. The decoder produces a distribution over pairwise local actions that modify the current solution.
5. The policy is trained with n-step Proximal Policy Optimization and a curriculum over improvement horizons.
6. At inference, the learned operator is applied iteratively, optionally with augmentation and a larger step budget.

## Experiments

- **Problems:** TSP and CVRP
- **Synthetic sizes:** Primarily 20, 50, and 100 nodes/customers
- **Benchmark data:** TSPLIB and CVRPLIB, including instances larger than the main training sizes
- **Main baselines:** Transformer-based improvement models, construction models, OR-Tools, LKH, and other learned search methods
- **Metrics:** Objective value, optimality gap, runtime, and cross-size generalization
- **Ablations:** Dual-aspect representation, cyclic positional encoding, and curriculum learning
- **Main finding:** DACT improves over the compared Transformer-based improvement methods and shows stronger cross-size and benchmark generalization, at the cost of iterative inference.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- The architecture is currently more directly useful for improvement models than construction models.
- Iterative inference can be slower than fast construction policies; the authors identify diverse rollouts and model compression as possible directions.

### Curator Notes

- Stronger results may use thousands of improvement steps and multiple augmentations, so comparisons require matching the inference budget.
- The evaluation focuses on TSP and CVRP; effectiveness on non-routing combinatorial structures is not established.
- Problem-specific training means the method does not meet the cross-problem definition of a generalist solver.

## Reproducibility

- Official implementation: [yining043/VRP-DACT](https://github.com/yining043/VRP-DACT)
- Pretrained checkpoints: available
- Notebook/demo: available
- Main paper references: Sections 3-5 and Appendices C-E
