---
id: cada
short_title: "CaDA"
title: "CaDA: Cross-Problem Routing Solver with Constraint-Aware Dual-Attention"
authors:
  - "Han Li"
  - "Fei Liu"
  - "Zhi Zheng"
  - "Yu Zhang"
  - "Zhenkun Wang"
year: 2025
date: 2024-11-30
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v267/li25bi.html"
arxiv_url: "https://arxiv.org/abs/2412.00346"
code_url: "https://github.com/CIAM-Group/CaDA"
institutions:
  - "Southern University of Science and Technology"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Open Vehicle Routing Problem"
  - "Vehicle Routing Problem with Backhauls"
  - "Pickup and Delivery Vehicle Routing Problem"
summary: "CaDA uses constraint-aware dual attention to share one routing solver while separating geometric interactions from problem-constraint signals."
figure:
  path: paper-assets/cada/framework.png
  alt: CaDA routing architecture with constraint prompts and dual spatial attention.
  caption: 'Figure 2: Constraint-aware dual-attention architecture used by CaDA.'
  source_url: https://arxiv.org/pdf/2412.00346
---

# CaDA: Cross-Problem Routing Solver with Constraint-Aware Dual-Attention

> **TL;DR:** CaDA uses constraint-aware dual attention to share one routing solver while separating geometric interactions from problem-constraint signals.

## Motivation

Dense multi-task sharing can obscure which relations come from coordinates and which come from the active VRP constraints.

## Contributions

- Introduces **CaDA** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls and Pickup and Delivery Vehicle Routing Problem.
- One attention stream models spatial structure and another consumes constraint prompts or attributes before the two are fused for decoding.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls and Pickup and Delivery Vehicle Routing Problem.
2. One attention stream models spatial structure and another consumes constraint prompts or attributes before the two are fused for decoding.
3. A single checkpoint handles the supported variants with greedy or augmented decoding; augmentation remains a multi-trajectory budget.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls; Pickup and Delivery Vehicle Routing Problem.
- **Scale and budget:** Experiments cover multiple VRP variants, unseen attribute combinations, standard sizes, and cross-problem transfer.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Explicit constraint attention improves multi-task accuracy and held-out-combination generalization.

## Limitations

### Reported by the Authors

- The model only recognizes constraints represented in its prompt schema and is not zero-shot to arbitrary new rules.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v267/li25bi.html)
- **Preprint:** [arXiv:2412.00346](https://arxiv.org/abs/2412.00346)
- **Official implementation:** [repository](https://github.com/CIAM-Group/CaDA)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
