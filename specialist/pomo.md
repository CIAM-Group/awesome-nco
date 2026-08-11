---
id: pomo
short_title: POMO
title: 'POMO: Policy Optimization with Multiple Optima for Reinforcement Learning'
authors:
  - Yeong-Dae Kwon
  - Jinho Choo
  - Byoungjip Kim
  - Iljoo Yoon
  - Youngjune Gwon
  - Seung-Jai Min
year: 2020
date: 2020-10-30
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2020/hash/f231f2107df69eab0a3862d50018a9b2-Abstract.html
arxiv_url: https://arxiv.org/abs/2010.16011
code_url: https://github.com/yd-kwon/POMO
institutions:
  - Samsung SDS
figure:
  path: paper-assets/pomo/framework.png
  alt: POMO comparison between one start-token rollout and parallel rollouts from multiple starting nodes.
  caption: 'Figure 2: Single-trajectory decoding and POMO multi-start parallel trajectories.'
  source_url: https://arxiv.org/pdf/2010.16011
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
  - Capacitated Vehicle Routing Problem
summary: POMO trains and evaluates multiple equivalent starts together to exploit the symmetric optima of routing problems.
---

# POMO: Policy Optimization with Multiple Optima for Reinforcement Learning

> **TL;DR:** POMO replaces a single sampled rollout with parallel rollouts from multiple equivalent starts and uses their shared mean as the policy-gradient baseline.

## Motivation

Routing instances usually admit multiple equivalent representations of the same optimal tour. A policy trained from one arbitrary start receives unnecessarily noisy feedback and may explore only a narrow part of the solution space.

## Contributions

- Exploits equivalent starting nodes to generate multiple rollouts per instance.
- Uses the mean reward of those rollouts as an instance-specific REINFORCE baseline.
- Couples training with instance augmentation and best-of-multiple-rollout inference.

## Methodology

1. Encode the routing instance with an attention model.
2. Start one rollout from each selected node or route-start configuration.
3. Decode all rollouts in parallel with shared parameters.
4. Train each trajectory against the mean reward over the POMO group; at test time return the best augmented rollout.

## Experiments

- **Problems:** Euclidean TSP and CVRP.
- **Scale and budget:** Synthetic 20-, 50-, and 100-node/customer instances; reported inference ranges from one POMO group to augmented multi-start evaluation.
- **Baselines:** Attention Model, Pointer Network variants, OR solvers, and established routing heuristics.
- **Metrics:** Average objective, optimality gap, and runtime.
- **Main finding:** Multi-start training and augmented inference substantially improve the attention baseline, but the strongest results consume a larger parallel rollout budget than greedy decoding.

## Limitations

### Reported by the Authors

- The method relies on identifiable equivalent starting choices and geometric augmentations.

### Curator Notes

- Models are trained separately for TSP and CVRP and for the studied scales.
- POMO's parallelism is hardware friendly, but total evaluated trajectories remain an important comparison budget.

## Reproducibility

- **Official implementation:** [yd-kwon/POMO](https://github.com/yd-kwon/POMO)
- **Checkpoints:** Included in the official repository.
- **Main paper references:** Sections 3–5 and the POMO rollout/training diagrams.
