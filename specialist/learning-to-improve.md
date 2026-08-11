---
id: learning-to-improve
short_title: L2I
title: 'A Learning-based Iterative Method for Solving Vehicle Routing Problems'
authors:
  - Lu Hao
  - Xingwen Zhang
  - Shuang Yang
year: 2020
date: 2019-09-25
venue: ICLR
paper_url: https://openreview.net/forum?id=BJe1334YDH
code_url: https://github.com/rlopt/l2i
institutions:
  - Ant Financial
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - Capacitated Vehicle Routing Problem
  - Split Delivery Vehicle Routing Problem
summary: L2I alternates learned solution-improvement operators in an iterative reinforcement-learning framework for VRP.
---

# A Learning-based Iterative Method for Solving Vehicle Routing Problems

> **TL;DR:** L2I learns how to choose and parameterize local improvement operations, then applies them repeatedly to an initial vehicle-routing solution.

## Motivation

End-to-end construction policies are difficult to scale to long routes and cannot revise previous decisions. Classical iterative methods are effective, but their operator scheduling and move choices require expert tuning.

## Contributions

- Formulates VRP solving as iterative improvement from an initial feasible solution.
- Uses learned operator and rule selection to coordinate local modifications.
- Studies both CVRP and split-delivery VRP under the same iterative framework.

## Methodology

1. Generate a feasible starting solution.
2. Encode routes and customer states with a neural policy.
3. Choose a local operator and its target positions.
4. Apply the feasible move, retain the best incumbent, and continue for a fixed number of iterations.

## Experiments

- **Problems:** CVRP and SDVRP on synthetic instances.
- **Scale and budget:** Evaluations use the paper's customer sizes and fixed iterative-search horizons; longer runs trade runtime for improved cost.
- **Baselines:** Learned constructors, classical local search, and routing heuristics.
- **Metrics:** Average route length, gap, and running time.
- **Main finding:** Iterative learned improvement outperforms its initial solutions and contemporary neural baselines under matched settings, while requiring many sequential search steps.

## Limitations

### Reported by the Authors

- Runtime grows with the improvement horizon.

### Curator Notes

- The approach relies on a hand-specified set of feasible operators.
- Separate task configurations are used; the work does not provide one shared multi-problem checkpoint.

## Reproducibility

- **Official implementation:** [rlopt/l2i](https://github.com/rlopt/l2i)
- **Checkpoints:** Consult the official repository.
- **Main paper references:** Sections 3–5 and supplementary implementation details.
