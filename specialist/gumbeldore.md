---
id: gumbeldore
short_title: "Gumbeldore"
title: "Self-Improvement for Neural Combinatorial Optimization: Sample without Replacement, but Improvement"
authors:
  - "Jonathan Pirnay"
  - "Dominik G. Grimm"
year: 2024
date: 2024-03-22
acceptance:
  date: "2024-06"
  source_url: "https://openreview.net/forum?id=agT8ojoH0X"
venue: "TMLR"
paper_url: "https://openreview.net/forum?id=agT8ojoH0X"
arxiv_url: "https://arxiv.org/abs/2403.15180"
code_url: "https://github.com/grimmlab/gumbeldore"
institutions:
  - "German Cancer Research Center"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "Gumbeldore performs self-improvement by sampling diverse solutions without replacement and retraining on the best discoveries."
---

# Self-Improvement for Neural Combinatorial Optimization: Sample without Replacement, but Improvement

> **TL;DR:** Gumbeldore performs self-improvement by sampling diverse solutions without replacement and retraining on the best discoveries.

## Motivation

Self-training collapses when repeated stochastic decoding returns near-duplicate trajectories and provides little new supervision.

## Contributions

- Introduces **Gumbeldore** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- Gumbel-based sequence sampling produces a without-replacement candidate set, which is filtered into improved pseudo-labels for another training round.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. Gumbel-based sequence sampling produces a without-replacement candidate set, which is filtered into improved pseudo-labels for another training round.
3. Inference and label generation use explicit beam or sample counts; larger Gumbeldore budgets explore more distinct solutions.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments include TSP, CVRP, and other sequence-construction tasks over standard scales and iterative self-improvement rounds.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Diverse sampling produces stronger pseudo-labels than repeated independent sampling at a similar candidate count.

## Limitations

### Reported by the Authors

- Self-improvement is compute intensive and can reinforce model bias when the candidate pool fails to discover better solutions.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [TMLR](https://openreview.net/forum?id=agT8ojoH0X)
- **Preprint:** [arXiv:2403.15180](https://arxiv.org/abs/2403.15180)
- **Official implementation:** [repository](https://github.com/grimmlab/gumbeldore)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
