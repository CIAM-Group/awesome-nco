---
id: mvmoe
short_title: "MVMoE"
title: "MVMoE: Multi-Task Vehicle Routing Solver with Mixture-of-Experts"
authors:
  - "Jianan Zhou"
  - "Zhiguang Cao"
  - "Yaoxin Wu"
  - "Wen Song"
  - "Yining Ma"
  - "Jie Zhang"
  - "Chi Xu"
year: 2024
date: 2024-05-02
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v235/zhou24c.html"
arxiv_url: "https://arxiv.org/abs/2405.01029"
code_url: "https://github.com/RoyalSkye/Routing-MVMoE"
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
  - "Pickup and Delivery Vehicle Routing Problem"
summary: "MVMoE trains one routing backbone across multiple VRP variants and routes representations through specialized mixture-of-experts layers."
figure:
  path: paper-assets/mvmoe/framework.png
  alt: MVMoE routing solver with mixture-of-experts layers shared across vehicle-routing variants.
  caption: 'Figure 2: Multi-task vehicle-routing solver with mixture-of-experts layers.'
  source_url: https://arxiv.org/pdf/2405.01029
---

# MVMoE: Multi-Task Vehicle Routing Solver with Mixture-of-Experts

> **TL;DR:** MVMoE trains one routing backbone across multiple VRP variants and routes representations through specialized mixture-of-experts layers.

## Motivation

Uniform parameter sharing can cause negative transfer because different constraints reward different features and decision patterns.

## Contributions

- Introduces **MVMoE** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls and Pickup and Delivery Vehicle Routing Problem.
- Sparse expert layers let tokens select specialized transformations while a common attention backbone and decoder retain cross-problem sharing.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls and Pickup and Delivery Vehicle Routing Problem.
2. Sparse expert layers let tokens select specialized transformations while a common attention backbone and decoder retain cross-problem sharing.
3. The same checkpoint is evaluated greedily and with POMO-style augmentation across tasks; augmentation multiplies trajectory count.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls; Pickup and Delivery Vehicle Routing Problem.
- **Scale and budget:** Training and evaluation cover multiple VRP variants and common 20-, 50-, and 100-customer settings, including unseen combinations.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Expert routing improves joint training and cross-task performance over a dense multi-task baseline.

## Limitations

### Reported by the Authors

- The task set is still defined by known attributes, and expert routing can become imbalanced without regularization.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v235/zhou24c.html)
- **Preprint:** [arXiv:2405.01029](https://arxiv.org/abs/2405.01029)
- **Official implementation:** [repository](https://github.com/RoyalSkye/Routing-MVMoE)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
