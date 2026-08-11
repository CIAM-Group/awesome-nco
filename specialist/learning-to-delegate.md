---
id: learning-to-delegate
short_title: L2D
title: 'Learning to Delegate for Large-Scale Vehicle Routing'
authors: [Sirui Li, Zhongxia Yan, Cathy Wu]
year: 2021
date: 2021-07-08
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/dc9fa5f217a1e57b8a6adeb065560b38-Abstract.html
arxiv_url: https://arxiv.org/abs/2107.04139
code_url: https://github.com/mit-wu-lab/learning-to-delegate
institutions: [Massachusetts Institute of Technology]
figure:
  path: paper-assets/learning-to-delegate/framework.png
  alt: Iterative learning-to-delegate framework selecting a spatial vehicle-routing subproblem for repair.
  caption: 'Figure 1: Iterative VRP framework from a current solution to subproblem selection and repaired solution.'
  source_url: https://arxiv.org/pdf/2107.04139
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Capacitated Vehicle Routing Problem, Vehicle Routing Problem with Time Windows]
summary: L2D learns which spatially local subproblem to delegate to a black-box solver during large-scale VRP improvement.
---

# Learning to Delegate for Large-Scale Vehicle Routing

> **TL;DR:** L2D does not learn the subsolver; it learns where an existing solver should spend its next local-improvement call.

## Motivation

Strong VRP solvers become costly on thousands of customers, while end-to-end neural policies often fail to scale. Spatial locality provides a linear-sized candidate set of smaller subproblems.

## Contributions

- Frames subproblem selection as supervised regression over predicted improvement.
- Keeps the local subsolver interchangeable.
- Demonstrates large-scale CVRP acceleration across distributions and solver backends.

## Methodology

1. Start from a feasible global solution. 2. Enumerate spatially local customer groups. 3. Rank groups with a Transformer trained on solver-generated labels. 4. Delegate the best group to a black-box subsolver and merge the result; repeat.

## Experiments

- **Problems:** Large CVRP and variants with 500–3,000 customers.
- **Baselines:** Random/heuristic delegation and full classical solvers.
- **Metrics:** Objective versus wall-clock time and selector speedup.
- **Main finding:** Learned selection reaches competitive quality 10–100× faster than full solver runs in reported settings, with 1.5–2× selection gains over heuristic/random choices.

## Limitations

### Reported by the Authors

- Training labels require many black-box solver calls.

### Curator Notes

- End quality inherits the chosen subsolver and wall-clock results are implementation dependent.

## Reproducibility

- **Official implementation:** [mit-wu-lab/learning-to-delegate](https://github.com/mit-wu-lab/learning-to-delegate)
- **Checkpoints:** See the repository.
- **Main paper references:** Sections 3–5 and Appendix experiments.
