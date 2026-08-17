---
id: learning-collaborative-policies
short_title: LCP
title: 'Learning Collaborative Policies to Solve NP-hard Routing Problems'
authors: [Minsu Kim, Jinkyoo Park, Joungho Kim]
year: 2021
date: 2021-10-26
acceptance:
  date: "2021-09-28"
  source_url: "https://neurips.cc/Conferences/2021/CallForPapers"
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/564127c03caab942e503ee6f810f54fd-Abstract.html
arxiv_url: https://arxiv.org/abs/2110.13987
code_url: https://github.com/alstn12088/LCP
institutions: [Korea Advanced Institute of Science and Technology]
figure:
  path: paper-assets/learning-collaborative-policies/framework.png
  alt: LCP revision process decomposing tours into segments and composing revised sub-tours.
  caption: 'Figure 1: Seeder-reviser collaboration for TSP, focused on the parallel revision stage.'
  source_url: https://arxiv.org/pdf/2110.13987
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Traveling Salesman Problem, Prize Collecting Traveling Salesman Problem, Capacitated Vehicle Routing Problem]
summary: LCP coordinates a diversity-oriented seeder with a sub-tour reviser to balance global exploration and local improvement.
---

# Learning Collaborative Policies to Solve NP-hard Routing Problems

> **TL;DR:** LCP produces diverse complete routes with a seeder and improves their sub-tours in parallel with a second learned policy.

## Motivation

One policy must otherwise balance global exploration with fine local exploitation. LCP assigns these roles to separate learned components and coordinates them hierarchically.

## Contributions

- Trains an entropy-regularized seeder to produce diverse candidates.
- Trains a reviser on shorter sub-tours where improvement is easier.
- Applies the collaboration to TSP, PCTSP, and CVRP.

## Methodology

1. The seeder constructs a batch of routes. 2. Partition each trajectory into sub-tours. 3. The reviser reconstructs sub-tours and accepts beneficial replacements. 4. Repeat revision rounds and return the best candidate.

## Experiments

- **Problems:** TSP, PCTSP, and CVRP on standard synthetic sizes.
- **Baselines:** Single-policy attention solvers, sampling methods, and problem-specific heuristics.
- **Metrics:** Objective/gap and runtime.
- **Main finding:** Seeder diversity plus repeated revision improves best-solution quality; gains grow with candidate and revision budgets.

## Limitations

### Reported by the Authors

- Multiple policies and revision rounds increase computation.

### Curator Notes

- Each problem uses task-specific training; sub-tour length is an additional tuning choice.

## Reproducibility

- **Official implementation:** [alstn12088/LCP](https://github.com/alstn12088/LCP)
- **Checkpoints:** Consult the official repository.
- **Main paper references:** Sections 3–5 and supplementary ablations.
