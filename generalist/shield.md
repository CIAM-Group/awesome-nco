---
id: shield
short_title: "SHIELD"
title: "SHIELD: Multi-task Multi-distribution Vehicle Routing Solver with Sparsity and Hierarchy"
authors:
  - "Yong Liang Goh"
  - "Zhiguang Cao"
  - "Yining Ma"
  - "Jianan Zhou"
  - "Mohammed Haroon Dupty"
  - "Wee Sun Lee"
year: 2025
date: 2025-06-10
acceptance:
  date: "2025-05-01"
  source_url: "https://icml.cc/Conferences/2025/Dates"
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v267/goh25a.html"
arxiv_url: "https://arxiv.org/abs/2506.08424"
institutions:
  - "National University of Singapore"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Open Vehicle Routing Problem"
  - "Vehicle Routing Problem with Time Windows"
summary: "SHIELD introduces sparse hierarchical attention for one model spanning multiple VRP variants and heterogeneous real-world node distributions."
figure:
  path: paper-assets/shield/framework.png
  alt: SHIELD multi-task routing architecture with sparse hierarchical attention and shared decoding.
  caption: 'Figure 1: Sparse hierarchical multi-task routing architecture of SHIELD.'
  source_url: https://arxiv.org/pdf/2506.08424
---

# SHIELD: Multi-task Multi-distribution Vehicle Routing Solver with Sparsity and Hierarchy

> **TL;DR:** SHIELD introduces sparse hierarchical attention for one model spanning multiple VRP variants and heterogeneous real-world node distributions.

## Motivation

Multi-task solvers trained on uniform points can fail on clustered roads and large maps even when they recognize the routing constraints.

## Contributions

- Introduces **SHIELD** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
- Sparse neighborhoods control computation, a hierarchy communicates long-range information, and task attributes condition the shared policy.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
2. Sparse neighborhoods control computation, a hierarchy communicates long-range information, and task attributes condition the shared policy.
3. The same model decodes all supported settings; sparse-neighborhood size and augmentation determine the quality-runtime tradeoff.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Time Windows.
- **Scale and budget:** Experiments combine 16 VRP variants with nine real-world maps and synthetic distributions across multiple scales.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Sparsity and hierarchy improve both multi-task and cross-distribution generalization over dense foundation-style baselines.

## Limitations

### Reported by the Authors

- The neighborhood graph and hierarchy are additional assumptions, and zero-shot coverage remains limited to the encoded constraint vocabulary.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v267/goh25a.html)
- **Preprint:** [arXiv:2506.08424](https://arxiv.org/abs/2506.08424)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
