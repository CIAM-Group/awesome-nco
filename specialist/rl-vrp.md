---
id: rl-vrp
short_title: VRP-RL
title: 'Reinforcement Learning for Solving the Vehicle Routing Problem'
authors:
  - Mohammadreza Nazari
  - Afshin Oroojlooy
  - Martin Takac
  - Lawrence V. Snyder
year: 2018
date: 2018-02-12
acceptance:
  date: "2018-09-05"
  source_url: "https://neurips.cc/Conferences/2018/Dates"
venue: NeurIPS
paper_url: https://papers.nips.cc/paper_files/paper/2018/hash/9fb4651c05b2ed70fba5afe0b039a550-Abstract.html
arxiv_url: https://arxiv.org/abs/1802.04240
code_url: https://github.com/OptMLGroup/VRP-RL
institutions:
  - Lehigh University
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Vehicle Routing Problem
  - Capacitated Vehicle Routing Problem
summary: VRP-RL trains an attention-based reinforcement-learning policy to construct capacitated vehicle routes while updating dynamic demand and capacity states.
figure:
  path: paper-assets/rl-vrp/framework.png
  alt: VRP-RL model with input embeddings, recurrent decoder state, and an attention layer over dynamic customer states.
  caption: 'Figure 2: Dynamic vehicle-routing model with embeddings, recurrent decoder state, and attention.'
  source_url: https://arxiv.org/pdf/1802.04240
---

# Reinforcement Learning for Solving the Vehicle Routing Problem

> **TL;DR:** VRP-RL learns a constructive policy that routes a capacitated vehicle by selecting the next customer from feasible actions at each decoding step.

## Motivation

Vehicle Routing Problem variants are difficult to solve exactly and often rely on specialized heuristics. Earlier neural combinatorial optimization methods based on Pointer Networks were designed for static inputs such as TSP tours, but VRP has dynamic state: customer demand and remaining vehicle load change as a route is constructed. This paper adapts reinforcement-learning-based neural construction to capacitated VRP.

## Contributions

- Proposes an end-to-end reinforcement-learning framework for capacitated VRP instances sampled from a fixed distribution.
- Separates static elements, such as locations, from dynamic elements, such as remaining demand and vehicle load.
- Removes the recurrent encoder used in Pointer Networks and uses embeddings plus an RNN decoder with attention over feasible destinations.
- Uses masking to enforce VRP feasibility rules during decoding.
- Evaluates greedy and beam-search decoding against classical VRP heuristics and Google OR-Tools.
- Shows that the same trained model can support split delivery behavior by modifying the masking scheme without retraining.

## Methodology

1. A VRP instance is represented by depot and customer locations, customer demands, and vehicle capacity.
2. Static location features and dynamic demand/load features are embedded separately.
3. An RNN decoder keeps track of the partial route sequence.
4. At each decision step, an attention mechanism scores feasible next destinations.
5. A mask removes invalid actions, such as visiting fully served customers or selecting a customer whose demand exceeds remaining capacity.
6. The route is decoded greedily or with beam search until all demand is served.
7. The policy is trained with REINFORCE and a critic baseline to minimize expected route length.

## Experiments

- **Problems:** Capacitated VRP with 10, 20, 50, and 100 customers; split-delivery VRP variants; a stochastic VRP example in the appendix.
- **Data:** Randomly generated customer locations and demands with fixed capacity settings for each problem size.
- **Baselines:** Clarke-Wright savings heuristic, Sweep heuristic, randomized versions of both heuristics, Google OR-Tools, and exact mixed-integer solutions for small instances.
- **Metrics:** Average tour length, standard deviation, solution time, optimality gap for small instances, and pairwise winning rate for larger instances.
- **Main finding:** Beam-search decoding improves solution quality over greedy decoding; on medium-sized instances the learned policy outperforms the tested classical heuristics and is competitive with or better than OR-Tools under the paper's evaluation setup.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- The trained policy is expected to work on instances drawn from the same distribution used in training.
- Hard constraints such as time windows can require problem-specific masking, which the authors note may itself be challenging.
- Extending the framework to other combinatorial optimization problems, such as bin packing, job shop scheduling, and flow shop scheduling, is identified as future work.
- Runtime comparisons with OR-Tools are not exact because OR-Tools is implemented in C++ while the reported learning baselines use Python.

### Curator Notes

- The method is specialist under this repository's taxonomy because training is tied to a VRP distribution and problem setting.
- Results are mainly on synthetic random VRP instances rather than operational logistics benchmarks.
- Beam search improves quality but changes the inference budget, so greedy and beam-search results should be compared with runtime in mind.
- The split-delivery result comes from modifying feasibility masking rather than retraining a solver specifically for the relaxed problem.

## Reproducibility

- **Official implementation:** [OptMLGroup/VRP-RL](https://github.com/OptMLGroup/VRP-RL)
- **Checkpoints:** Not clearly documented.
- **Main paper references:** Sections 3-5 and Appendices A-C.
