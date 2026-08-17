---
id: mixed-curvature
short_title: "Mixed-Curvature"
title: "A Mixed-Curvature based Pre-training Paradigm for Multi-Task Vehicle Routing Solver"
authors:
  - "Suyu Liu"
  - "Zhiguang Cao"
  - "Shanshan Feng"
  - "Yew-Soon Ong"
year: 2025
date: 2025-01-28
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v267/liu25b.html"
institutions:
  - "Nanyang Technological University"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Open Vehicle Routing Problem"
  - "Vehicle Routing Problem with Backhauls"
summary: "Mixed-Curvature pretraining combines Euclidean and non-Euclidean representation spaces to capture shared and task-specific VRP geometry."
---

# A Mixed-Curvature based Pre-training Paradigm for Multi-Task Vehicle Routing Solver

> **TL;DR:** Mixed-Curvature pretraining combines Euclidean and non-Euclidean representation spaces to capture shared and task-specific VRP geometry.

## Motivation

One Euclidean latent space may not represent both local metric structure and hierarchical constraint interactions across routing tasks.

## Contributions

- Introduces **Mixed-Curvature** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls.
- The encoder mixes components with different curvature and pretrains them jointly across VRP variants before task-aware decoding.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls.
2. The encoder mixes components with different curvature and pretrains them jointly across VRP variants before task-aware decoding.
3. The shared checkpoint is evaluated on several tasks with greedy and multi-start settings reported separately.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls.
- **Scale and budget:** The ICML study covers multi-task routing at common customer scales and transfer to held-out variants or distributions.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Mixed geometry improves shared representations and reduces negative transfer compared with a single-curvature backbone.

## Limitations

### Reported by the Authors

- Curvature choices and fusion add hyperparameters, and supported tasks remain within a predefined VRP family.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v267/liu25b.html)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
