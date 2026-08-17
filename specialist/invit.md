---
id: invit
short_title: "INViT"
title: "INViT: A Generalizable Routing Problem Solver with Invariant Nested View Transformer"
authors:
  - "Han Fang"
  - "Zhihao Song"
  - "Paul Weng"
  - "Yutong Ban"
year: 2024
date: 2024-02-04
acceptance:
  date: "2024-05-01"
  source_url: "https://icml.cc/Conferences/2024/Dates"
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v235/fang24c.html"
arxiv_url: "https://arxiv.org/abs/2402.02317"
institutions:
  - "Shanghai Jiao Tong University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "INViT builds invariant nested local views around the current decision to transfer a routing policy across graph sizes and coordinate distributions."
figure:
  path: paper-assets/invit/framework.png
  alt: INViT trained on nested local views and generalized to larger scales and different distributions.
  caption: 'Figure 1: INViT uses invariant nested local views for cross-scale and cross-distribution generalization.'
  source_url: https://arxiv.org/pdf/2402.02317
---

# INViT: A Generalizable Routing Problem Solver with Invariant Nested View Transformer

> **TL;DR:** INViT builds invariant nested local views around the current decision to transfer a routing policy across graph sizes and coordinate distributions.

## Motivation

Absolute coordinates and a full fixed-size view entangle a policy with the scale and geometry seen during training.

## Contributions

- Introduces **INViT** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- The nested-view Transformer normalizes local neighborhoods at multiple radii and aggregates them into an invariant representation for autoregressive decisions.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. The nested-view Transformer normalizes local neighborhoods at multiple radii and aggregates them into an invariant representation for autoregressive decisions.
3. Greedy and augmented evaluation are distinguished; larger nested neighborhoods increase both context and inference cost.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** TSP and CVRP experiments train on standard synthetic sizes and test larger sizes, shifted distributions, and public benchmarks.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Nested invariant views improve zero-shot scale and distribution transfer over global coordinate encoders.

## Limitations

### Reported by the Authors

- Local views may hide long-range route interactions, and neighborhood selection introduces an additional scale-sensitive design choice.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v235/fang24c.html)
- **Preprint:** [arXiv:2402.02317](https://arxiv.org/abs/2402.02317)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
