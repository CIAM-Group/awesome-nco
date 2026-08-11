---
id: routing-dro
short_title: DRO
title: 'Learning to Solve Routing Problems via Distributionally Robust Optimization'
authors: [Yuan Jiang, Yaoxin Wu, Zhiguang Cao, Jie Zhang]
year: 2022
date: 2022-02-15
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/21214
arxiv_url: https://arxiv.org/abs/2202.07241
institutions: [Nanyang Technological University, Singapore Institute of Manufacturing Technology]
figure:
  path: paper-assets/routing-dro/framework.png
  alt: DRO training loop over routing distribution groups, a convolutional embedding, and robust parameter updates.
  caption: 'Figure 1: Distributionally robust routing training across six instance-distribution groups.'
  source_url: https://arxiv.org/pdf/2202.07241
scope: specialist
paradigm: constructive
problem_families: [Routing, Robust Optimization]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem]
summary: DRO trains neural routing policies against adversarially selected instance distributions inside a prescribed ambiguity set.
---

# Learning to Solve Routing Problems via Distributionally Robust Optimization

> **TL;DR:** DRO replaces training on one fixed generator with a minimax loop that searches for hard routing distributions and updates the solver against them.

## Motivation

Policies trained on uniform random coordinates can degrade sharply under clustered or otherwise shifted test distributions. Distributionally robust training targets worst-case performance near a nominal generator.

## Contributions

- Formulates neural routing training as distributionally robust optimization.
- Alternates policy updates with adversarial distribution generation/grouping.
- Evaluates robustness across synthetic distribution shifts for TSP and CVRP.

## Methodology

1. Define a family or ambiguity set of routing-instance distributions. 2. train an attention/graph routing policy on the current mixture. 3. identify distributions with high policy cost and update their weights or parameters. 4. repeat the minimax training loop; decode with the trained constructive policy.

## Experiments

- **Problems:** TSP and CVRP under uniform and shifted spatial distributions at standard learned-routing sizes.
- **Baselines:** Ordinary empirical-risk training and contemporary attention/POMO-style solvers.
- **Metrics:** Average and worst-distribution objective/gap.
- **Main finding:** Robust training reduces degradation on unseen or hard generators, sometimes trading a small amount of nominal-distribution performance.

## Limitations

### Reported by the Authors

- Robustness is bounded by the chosen ambiguity set and adversarial generator family.

### Curator Notes

- Separate TSP/CVRP policies remain necessary; the method is a training objective rather than one cross-task model.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Main paper references:** DRO formulation, training framework, and distribution-shift tables.
