---
id: simulation-guided-beam-search
short_title: SGBS
title: 'Simulation-Guided Beam Search for Neural Combinatorial Optimization'
authors: [Jinho Choo, Yeong-Dae Kwon, Jihoon Kim, Jeongwoo Jae, André Hottung, Kevin Tierney, Youngjune Gwon]
year: 2022
date: 2022-07-13
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/39b9b60f0d149eabd1fff2d7c7d5afc4-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2207.06190
code_url: https://github.com/yd-kwon/SGBS
institutions: [Samsung SDS, Bielefeld University]
figure:
  path: paper-assets/simulation-guided-beam-search/framework.png
  alt: SGBS tree search phases for neural expansion, rollout simulation, and beam pruning.
  caption: 'Figure 1: Expansion, simulation, and pruning phases of Simulation-Guided Beam Search.'
  source_url: https://arxiv.org/pdf/2207.06190
scope: specialist
paradigm: constructive
problem_families: [Routing, Scheduling]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem, Flexible Flow Shop Problem]
summary: SGBS expands a fixed-width neural beam but ranks promising branches with complete rollout simulations.
---

# Simulation-Guided Beam Search for Neural Combinatorial Optimization

> **TL;DR:** SGBS uses rollouts to correct overconfident neural beam decisions and can alternate with EAS for longer test-time search.

## Motivation

Plain neural beam search follows model probability even when it makes a locally confident mistake. MCTS can recover through rollouts but has high tree-management cost.

## Contributions

- Combines fixed-width beam expansion with simulation-based candidate ranking.
- Retains batched neural rollout throughput.
- Defines a hybrid that alternates SGBS with Efficient Active Search.

## Methodology

1. Expand each beam state with high-probability actions. 2. Complete candidate children with policy rollouts. 3. keep the children with best simulated outcomes. 4. Repeat to terminal solutions; optionally update EAS parameters between search rounds.

## Experiments

- **Problems:** TSP, CVRP, and FFSP using pretrained POMO/MatNet-style policies.
- **Baselines:** Sampling, beam search, EAS, and classical problem-specific methods.
- **Metrics:** Objective gap and runtime at multiple beam/rollout settings.
- **Main finding:** Simulation ranking improves ordinary sampling and beam search; SGBS+EAS obtains stronger long-budget results but includes both rollout and gradient-update costs.

## Limitations

### Reported by the Authors

- Search quality and memory depend on beam width and simulation count.

### Curator Notes

- SGBS is an inference procedure over pretrained problem-specific policies, not one general trained solver.

## Reproducibility

- **Official implementation:** [yd-kwon/SGBS](https://github.com/yd-kwon/SGBS)
- **Checkpoints:** Base-model checkpoints are documented by the authors.
- **Main paper references:** Algorithm 1, hybrid search section, and main benchmark tables.
