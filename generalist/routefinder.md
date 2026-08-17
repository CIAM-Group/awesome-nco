---
id: routefinder
short_title: "RouteFinder"
title: "RouteFinder: Towards Foundation Models for Vehicle Routing Problems"
authors:
  - "Federico Berto"
  - "Chuanbo Hua"
  - "Nayeli Gast Zepeda"
  - "Andre Hottung"
  - "Niels Wouda"
  - "Leon Lan"
  - "Junyoung Park"
  - "Kevin Tierney"
  - "Jinkyoo Park"
year: 2025
date: 2024-06-21
venue: "TMLR"
paper_url: "https://openreview.net/forum?id=QzGLoaOPiY"
arxiv_url: "https://arxiv.org/abs/2406.15007"
code_url: "https://github.com/ai4co/routefinder"
institutions:
  - "TU Dortmund University"
  - "KAIST"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Open Vehicle Routing Problem"
  - "Vehicle Routing Problem with Time Windows"
  - "Pickup and Delivery Vehicle Routing Problem"
summary: "RouteFinder treats each VRP variant as a subset of a generalized attribute-rich routing problem and supports efficient adapters for new variants."
---

# RouteFinder: Towards Foundation Models for Vehicle Routing Problems

> **TL;DR:** RouteFinder treats each VRP variant as a subset of a generalized attribute-rich routing problem and supports efficient adapters for new variants.

## Motivation

Foundation-style routing needs one representation for many constraint combinations without training a separate environment and policy for each.

## Contributions

- Introduces **RouteFinder** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Time Windows and Pickup and Delivery Vehicle Routing Problem.
- A unified batched environment, global feature embeddings, mixed-task training, and lightweight adapters form the shared model.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Time Windows and Pickup and Delivery Vehicle Routing Problem.
2. A unified batched environment, global feature embeddings, mixed-task training, and lightweight adapters form the shared model.
3. One pretrained checkpoint is evaluated on 24 variants, while adapter results include additional fine-tuning cost; greedy and multi-start budgets remain distinct.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Time Windows; Pickup and Delivery Vehicle Routing Problem.
- **Scale and budget:** The final TMLR version evaluates 24 VRP variants at common scales and adaptation to previously unseen attributes.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The shared model is competitive across many tasks and adapters provide data-efficient extension.

## Limitations

### Reported by the Authors

- The foundation-model label applies within an engineered VRP attribute space, not arbitrary optimization problems or natural-language constraints.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [TMLR](https://openreview.net/forum?id=QzGLoaOPiY)
- **Preprint:** [arXiv:2406.15007](https://arxiv.org/abs/2406.15007)
- **Official implementation:** [repository](https://github.com/ai4co/routefinder)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
