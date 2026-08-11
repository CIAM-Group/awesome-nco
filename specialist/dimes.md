---
id: dimes
short_title: DIMES
title: 'DIMES: A Differentiable Meta Solver for Combinatorial Optimization Problems'
authors: [Ruizhong Qiu, Zhiqing Sun, Yiming Yang]
year: 2022
date: 2022-10-08
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/a3a7387e49f4de290c23beea2dfcdc75-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2210.04123
code_url: https://github.com/DIMESTeam/DIMES
institutions: [Carnegie Mellon University]
scope: specialist
paradigm: constructive-improvement
problem_families: [Routing, Graph Optimization]
problems: [Traveling Salesman Problem, Maximum Independent Set]
summary: DIMES learns a compact continuous parameterization of solution distributions and meta-learns an initialization for per-instance fine-tuning.
---

# DIMES: A Differentiable Meta Solver for Combinatorial Optimization Problems

> **TL;DR:** DIMES predicts a continuous solution distribution, samples discrete candidates in parallel, and adapts that distribution to each target instance.

## Motivation

Autoregressive decoding is sequential and costly on large graphs, while direct discrete refinement produces unstable gradients. DIMES moves optimization to continuous distribution parameters that support parallel sampling.

## Contributions

- Defines compact differentiable parameterizations for TSP and MIS solution distributions.
- Uses REINFORCE to train and fine-tune those parameters.
- Meta-learns an initialization intended to accelerate instance-specific adaptation.

## Methodology

1. A graph model predicts continuous edge or node logits. 2. Sample many discrete candidates in parallel. 3. Evaluate them with problem-specific feasibility/search decoding. 4. Update logits at test time from sampled rewards and retain the best solution.

## Experiments

- **Problems:** TSP and maximum independent set, including large benchmark graphs.
- **Baselines:** Autoregressive DRL solvers, learned heatmap methods, and classical/search baselines.
- **Metrics:** Objective/gap, runtime, and scaling.
- **Main finding:** Parallel distribution search scales beyond typical autoregressive models and improves with fine-tuning; reported quality includes a substantial sampling/adaptation budget.

## Limitations

### Reported by the Authors

- Per-instance fine-tuning and sampling remain computationally expensive.

### Curator Notes

- Problem-specific feasibility decoding and parameterizations are still required.

## Reproducibility

- **Official implementation:** [DIMESTeam/DIMES](https://github.com/DIMESTeam/DIMES)
- **Checkpoints:** Consult the official repository.
- **Main paper references:** Sections 3–5 and supplementary hyperparameters.
