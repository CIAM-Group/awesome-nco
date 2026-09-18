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

Construction policies produce complete solutions but cannot directly revise earlier decisions. Classical improvement heuristics can refine incumbents through local search, yet their move-selection rules are usually hand crafted and can depend heavily on expert design. LIH focuses learning on the improvement stage, using reinforcement learning to choose local moves that iteratively improve an initial routing solution.

## Contributions

- Proposes a graph-attention improvement policy for TSP and CVRP.
- Formulates iterative local search as a reinforcement-learning task over routing solutions and pairwise local actions.
- Adds a recurrent state mechanism to summarize recent search behavior.
- Trains the policy with actor-critic reinforcement learning over multi-step improvement trajectories.
- Studies generalization across initial solutions, problem sizes, and public benchmark instances.

## Methodology

1. Formulate improvement search as a continuing reinforcement-learning task over incumbent routing solutions.
2. Represent each action as a pair of nodes selected for a local operator.
3. Use a self-attention policy network to embed the current solution and score all candidate node pairs.
4. Mask infeasible or immediately reversing node-pair choices before sampling an action.
5. Apply the selected pairwise operator, using 2-opt as the default operator after comparing 2-opt, node swap, and relocation.
6. Always accept the resulting state during the search, while retaining the best incumbent solution found so far.
7. Train the actor with an n-step actor-critic algorithm and a critic baseline for reward estimation.

## Experiments

- **Problems:** TSP and CVRP, chiefly 20-, 50-, and 100-node/customer synthetic sets plus generalization tests.
- **Training instances:** Random Euclidean instances generated on the fly; TSP starts from random initial tours, while CVRP starts from nearest-insertion solutions with dummy depots for batching.
- **Search budget:** Reports iterative search with step limits such as 1,000, 3,000, and 5,000, plus multi-run and multi-policy diversification strategies.
- **Baselines:** Concorde, LKH3, OR-Tools, Attention Model sampling, NeuRewriter, and simple 2-opt hand-crafted policies.
- **Metrics:** Best objective value, optimality gap, and total runtime over the test set.
- **Generalization:** Tests transfer across initial solutions, problem sizes, and public TSPLIB/CVRPLIB instances.
- **Main finding:** Learned move selection improves incumbents throughout the allotted horizon; longer rollouts and diversification improve quality, but inference-budget differences make one-shot runtime comparisons inappropriate.

## Limitations

### Reported by the Authors

- Iterative search requires many sequential policy evaluations.
- The paper uses a simple always-accept search scheme and mainly reports 2-opt, leaving multiple-operator policies and more advanced search schemes as future work.

### Curator Notes

- Separate task models and fixed neighborhood definitions limit cross-problem reuse.
- The strongest reported configurations use larger step limits or multiple runs, so comparisons should match the allowed inference budget.

## Reproducibility

- **Official implementation:** [WXY1427/Learn-Improvement-Heuristics-for-Routing](https://github.com/WXY1427/Learn-Improvement-Heuristics-for-Routing)
- **Checkpoints:** See the official repository.
- **Main paper references:** Sections IV-V and Tables I-V.
