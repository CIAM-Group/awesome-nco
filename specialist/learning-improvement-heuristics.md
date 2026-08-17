---
id: learning-improvement-heuristics
short_title: LIH
title: 'Learning Improvement Heuristics for Solving Routing Problems'
authors: [Yaoxin Wu, Wen Song, Zhiguang Cao, Jie Zhang, Andrew Lim]
year: 2022
date: 2019-12-12
acceptance:
  date: "2021"
  source_url: "https://doi.org/10.1109/TNNLS.2021.3068828"
venue: IEEE TNNLS
paper_url: https://doi.org/10.1109/TNNLS.2021.3068828
arxiv_url: https://arxiv.org/abs/1912.05784
code_url: https://github.com/WXY1427/Learn-Improvement-Heuristics-for-Routing
institutions: [Nanyang Technological University, National University of Singapore, Shandong University, Singapore Institute of Manufacturing Technology]
figure:
  path: paper-assets/learning-improvement-heuristics/framework.png
  alt: LIH policy network with self-attention node embeddings and pairwise move compatibility scores.
  caption: 'Figure 2: Policy-network architecture for node embedding and pairwise move selection.'
  source_url: https://arxiv.org/pdf/1912.05784
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem]
summary: LIH learns pairwise routing moves with a graph-attention actor and improves tours through repeated reinforcement-learning decisions.
---

# Learning Improvement Heuristics for Solving Routing Problems

> **TL;DR:** LIH encodes an incumbent route and repeatedly selects a pairwise local move, using a recurrent history signal to escape short search cycles.

## Motivation

Construction policies cannot revise decisions, while manually tuned local search lacks data-driven move selection. The paper focuses learning on the choice of improvement moves rather than complete solutions.

## Contributions

- Proposes a graph-attention improvement policy for TSP and CVRP.
- Adds a recurrent state mechanism to summarize recent search behavior.
- Trains the policy with actor-critic reinforcement learning over multi-step improvement trajectories.

## Methodology

1. Encode nodes, current tour adjacency, and routing state. 2. Select two positions with attention. 3. Apply the corresponding pairwise exchange/reconnection. 4. Update the recurrent search state and incumbent; repeat for the test budget.

## Experiments

- **Problems:** TSP and CVRP, chiefly 20-, 50-, and 100-node/customer synthetic sets plus generalization tests.
- **Baselines:** Neural constructors, classical local search, and learned improvement policies.
- **Metrics:** Best objective/gap over iterations and runtime.
- **Main finding:** Learned move selection improves incumbents throughout the allotted horizon; longer rollouts yield better routes but make one-shot runtime comparisons inappropriate.

## Limitations

### Reported by the Authors

- Iterative search requires many sequential policy evaluations.

### Curator Notes

- Separate task models and fixed neighborhood definitions limit cross-problem reuse.

## Reproducibility

- **Official implementation:** [WXY1427/Learn-Improvement-Heuristics-for-Routing](https://github.com/WXY1427/Learn-Improvement-Heuristics-for-Routing)
- **Checkpoints:** See the official repository.
- **Main paper references:** Actor architecture, improvement algorithm, and Tables II–VI.
