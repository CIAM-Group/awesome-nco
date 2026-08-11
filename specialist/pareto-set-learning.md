---
id: pareto-set-learning
short_title: P-MOCO
title: 'Pareto Set Learning for Neural Multi-Objective Combinatorial Optimization'
authors: [Xi Lin, Zhiyuan Yang, Qingfu Zhang]
year: 2022
date: 2022-03-29
venue: ICLR
paper_url: https://openreview.net/forum?id=QuObT9BTWo
arxiv_url: https://arxiv.org/abs/2203.15386
code_url: https://github.com/Xi-L/PMOCO
institutions: [City University of Hong Kong, University of Essex]
figure:
  path: paper-assets/pareto-set-learning/framework.png
  alt: Preference-conditioned neural multi-objective model generating solutions along a Pareto front.
  caption: 'Figure 1: Preference-conditioned neural multi-objective combinatorial optimization.'
  source_url: https://arxiv.org/pdf/2203.15386
scope: specialist
paradigm: constructive
problem_families: [Routing, Multi-objective Optimization]
problems: [Bi-objective Traveling Salesman Problem, Tri-objective Traveling Salesman Problem, Multi-objective Capacitated Vehicle Routing Problem]
summary: P-MOCO conditions one constructive routing policy on preference vectors so repeated evaluations approximate a Pareto set.
---

# Pareto Set Learning for Neural Multi-Objective Combinatorial Optimization

> **TL;DR:** P-MOCO learns a preference-conditioned family of routing policies rather than training an independent solver for every scalarization.

## Motivation

Multi-objective optimization seeks a set of trade-offs, but decomposition methods commonly train one model per preference. That cost grows with the desired Pareto-set resolution.

## Contributions

- Conditions attention-based routing on a continuous preference vector.
- Uses decomposition-style scalar rewards with POMO-style multi-start learning.
- Predicts many Pareto candidates with one trained problem-specific model.

## Methodology

1. Sample a preference vector on the objective simplex. 2. embed the preference and instance jointly. 3. construct a feasible route with a conditioned decoder and multiple starts. 4. repeat for many preferences and retain non-dominated solutions.

## Experiments

- **Problems:** Bi-/tri-objective TSP and multi-objective CVRP on standard synthetic sizes.
- **Baselines:** Evolutionary multi-objective solvers and neural decomposition baselines.
- **Metrics:** Hypervolume and related Pareto-set quality indicators, plus runtime.
- **Main finding:** One conditioned model approximates competitive fronts much faster than retraining per preference; quality depends on the number and distribution of queried preferences.

## Limitations

### Reported by the Authors

- Uniform preference sampling does not guarantee uniform coverage in objective space.

### Curator Notes

- A separate model is still trained for each problem family and objective configuration.

## Reproducibility

- **Official implementation:** [Xi-L/PMOCO](https://github.com/Xi-L/PMOCO)
- **Checkpoints:** See the official repository.
- **Main paper references:** Preference-conditioned model, Section 4, and appendix settings.
