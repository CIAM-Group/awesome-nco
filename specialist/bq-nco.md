---
id: bq-nco
short_title: "BQ-NCO"
title: "BQ-NCO: Bisimulation Quotienting for Efficient Neural Combinatorial Optimization"
authors:
  - "Darko Drakulic"
  - "Sofia Michel"
  - "Florian Mai"
  - "Arnaud Sors"
  - "Jean-Marc Andreoli"
year: 2023
date: 2023-01-09
acceptance:
  date: "2023-09-21"
  source_url: "https://neurips.cc/Conferences/2023/CallForPapers"
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/f445ba15f0f05c26e1d24f908ea78d60-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2301.03313"
code_url: "https://github.com/naver/bq-nco"
institutions:
  - "NAVER LABS Europe"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "BQ-NCO compresses equivalent decision states through bisimulation quotienting and applies a light autoregressive policy to much larger routing instances."
figure:
  path: paper-assets/bq-nco/framework.png
  alt: Direct-MDP and bisimulation-quotient MDP policy architectures shown side by side.
  caption: 'Figure 1: Policy architectures for the direct MDP and BQ-MDP formulations.'
  source_url: https://arxiv.org/pdf/2301.03313
---

# BQ-NCO: Bisimulation Quotienting for Efficient Neural Combinatorial Optimization

> **TL;DR:** BQ-NCO compresses equivalent decision states through bisimulation quotienting and applies a light autoregressive policy to much larger routing instances.

## Motivation

Autoregressive policies repeatedly process states that are equivalent for the remaining decision, wasting memory and computation as instance size grows.

## Contributions

- Introduces **BQ-NCO** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- The method defines quotient states that retain decision-relevant information while removing already resolved structure, then decodes over the compact representation.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. The method defines quotient states that retain decision-relevant information while removing already resolved structure, then decodes over the compact representation.
3. Greedy and sampling-style decoding operate on the reduced state; larger sampling budgets improve quality but increase total evaluated trajectories.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments cover synthetic TSP and CVRP across standard training sizes and substantially larger test sizes, with runtime and optimality gap reported together.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Quotienting enables efficient inference and useful zero-shot scale transfer without a full Transformer re-encoding at every step.

## Limitations

### Reported by the Authors

- The quotient construction is tailored to the studied routing formulations and does not by itself guarantee transfer to unrelated combinatorial problems.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/f445ba15f0f05c26e1d24f908ea78d60-Abstract-Conference.html)
- **Preprint:** [arXiv:2301.03313](https://arxiv.org/abs/2301.03313)
- **Official implementation:** [repository](https://github.com/naver/bq-nco)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
