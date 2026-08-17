---
id: neural-combinatorial-optimization
short_title: PN-AC
title: 'Neural Combinatorial Optimization with Reinforcement Learning'
authors:
  - Irwan Bello
  - Hieu Pham
  - Quoc V. Le
  - Mohammad Norouzi
  - Samy Bengio
year: 2017
date: 2016-11-29
acceptance:
  date: "2017-02-06"
  source_url: "https://iclr.cc/archive/www/doku.php%3Fid%3Diclr2017%3Amain.html"
venue: ICLR
paper_url: https://arxiv.org/abs/1611.09940
arxiv_url: https://arxiv.org/abs/1611.09940
institutions:
  - Google Brain
scope: specialist
paradigm: constructive
problem_families:
  - Routing
  - Packing
problems:
  - Traveling Salesman Problem
  - Knapsack Problem
summary: Neural Combinatorial Optimization trains a pointer-network policy with reinforcement learning to construct solutions for TSP and knapsack instances.
figure:
  path: paper-assets/neural-combinatorial-optimization/framework.png
  alt: Pointer Network encoder-decoder architecture for selecting a permutation of input elements.
  caption: 'Figure 1: Pointer Network policy architecture used for neural combinatorial optimization.'
  source_url: https://arxiv.org/pdf/1611.09940
---

# Neural Combinatorial Optimization with Reinforcement Learning

> **TL;DR:** Neural Combinatorial Optimization learns a pointer-network policy that constructs combinatorial solutions directly from reward feedback instead of supervised optimal labels.

## Motivation

Classical combinatorial optimization solvers often depend on hand-designed heuristics that work well for a specific problem but must be redesigned when the problem changes. Supervised neural approaches also require optimal or high-quality labels, which are expensive or unavailable for many NP-hard problems. This paper investigates whether neural networks can learn construction heuristics directly from solution-quality rewards.

## Contributions

- Introduces Neural Combinatorial Optimization, a reinforcement-learning framework for training neural policies over combinatorial solutions.
- Uses a Pointer Network to represent a stochastic policy over permutations or subsets of input elements.
- Trains the policy with policy gradients and an actor-critic baseline, using negative tour length or objective value as the reward.
- Studies both RL pretraining across generated instances and active search on a single test instance.
- Demonstrates the same framework on Euclidean TSP and 0-1 knapsack instances.

## Methodology

1. A combinatorial instance is encoded as a sequence of input elements, such as city coordinates for TSP or item weight-value pairs for knapsack.
2. A Pointer Network encoder-decoder produces a distribution over the next element to select at each construction step.
3. Feasibility is enforced when possible by masking invalid actions, such as already visited cities.
4. A sampled solution receives a reward derived from the final objective value.
5. Policy-gradient updates increase the probability of solutions with better rewards.
6. In RL pretraining, the model is trained on generated instances and then decoded greedily or by sampling at test time.
7. In active search, the policy is optimized on a single test instance while keeping the best sampled solution.

## Experiments

- **Problems:** Euclidean TSP with 20, 50, and 100 nodes; 0-1 knapsack with 50, 100, and 200 items.
- **Data:** Randomly generated TSP points in the unit square and randomly generated knapsack item weights and values.
- **Baselines:** Supervised Pointer Networks, Christofides heuristic, OR-Tools local search, Concorde, Lin-Kernighan-Helsgaun, random search, and greedy weight-to-value knapsack heuristic.
- **Metrics:** Average tour length, running time, ratio to optimality, and knapsack objective value.
- **Main finding:** Reinforcement learning improves over supervised Pointer Network training and produces close-to-optimal TSP tours up to 100 nodes when enough inference-time search is allowed; active search solves the tested knapsack instances to optimality in the reported experiments.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- The architecture must be adapted to the target combinatorial problem; for example, Pointer Networks naturally fit permutations, truncated permutations, or subsets.
- Feasibility can be difficult for problems where invalid partial decisions are not easy to identify, such as TSP with time windows.
- Penalty-based handling of constraints is proposed as future work and does not guarantee feasible samples at inference time.

### Curator Notes

- The strongest results rely on sampling or active search with large inference budgets, so comparisons should account for the number of candidate solutions and runtime.
- The learned policy is not a shared cross-problem checkpoint; applying the framework to another problem still requires problem-specific modeling and training.
- Main TSP experiments use synthetic Euclidean instances up to 100 nodes, so performance on larger or real-world routing data is not established by this paper.
- The paper states that TensorFlow code would be released, but the PDF itself does not provide a stable official implementation link.

## Reproducibility

- **Official implementation:** Not publicly available in the paper.
- **Checkpoints:** Not publicly available in the paper.
- **Main paper references:** Sections 3-6 and Appendices A.1-A.4.
