---
id: urs
short_title: "URS"
title: "URS: A Unified Neural Routing Solver for Cross-Problem Zero-Shot Generalization"
authors:
  - "Changliang Zhou"
  - "Canhong Yu"
  - "Shunyu Yao"
  - "Xi Lin"
  - "Zhenkun Wang"
  - "Yu Zhou"
  - "Qingfu Zhang"
year: 2026
date: 2025-09-27
acceptance:
  date: "2026-04-30"
  source_url: "https://icml.cc/Conferences/2026/Dates"
venue: "ICML"
paper_url: "https://icml.cc/virtual/2026/poster/61527"
arxiv_url: "https://arxiv.org/abs/2509.23413"
code_url: "https://github.com/CIAM-Group/URS"
institutions:
  - "Southern University of Science and Technology"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Vehicle Routing Problem with Time Windows"
  - "Pickup and Delivery Vehicle Routing Problem"
summary: "URS represents constraints in a unified form and uses one checkpoint for zero-shot construction across more than one hundred VRP variants."
figure:
  path: paper-assets/urs/framework.png
  alt: URS architecture unifying vehicle-routing constraints, feature representations, encoding, and decoding.
  caption: 'Figure 1: Unified neural routing solver for cross-problem zero-shot generalization.'
  source_url: https://arxiv.org/pdf/2509.23413
---

# URS: A Unified Neural Routing Solver for Cross-Problem Zero-Shot Generalization

> **TL;DR:** URS represents constraints in a unified form and uses one checkpoint for zero-shot construction across more than one hundred VRP variants.

## Motivation

Attribute-combination models remain confined to a small predefined catalog and struggle with unseen cross-problem constraint compositions.

## Contributions

- Introduces **URS** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows and Pickup and Delivery Vehicle Routing Problem.
- The solver builds a unified constraint-conditioned state representation and shares the routing backbone and decoder across a broad problem suite.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows and Pickup and Delivery Vehicle Routing Problem.
2. The solver builds a unified constraint-conditioned state representation and shares the routing backbone and decoder across a broad problem suite.
3. One model handles all reported variants; greedy and augmented modes differ only in trajectory budget rather than retraining.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows; Pickup and Delivery Vehicle Routing Problem.
- **Scale and budget:** ICML 2026 experiments cover more than 100 VRP variants, including held-out cross-problem combinations and multiple sizes.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The broad unified representation substantially expands zero-shot coverage beyond earlier multi-task VRP solvers.

## Limitations

### Reported by the Authors

- Coverage is still defined by the constraint representation and benchmark generator, so arbitrary real-world constraints remain unproven.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://icml.cc/virtual/2026/poster/61527)
- **Preprint:** [arXiv:2509.23413](https://arxiv.org/abs/2509.23413)
- **Official implementation:** [repository](https://github.com/CIAM-Group/URS)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
