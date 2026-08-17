---
id: icam
short_title: "ICAM"
title: "Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver"
authors:
  - "Changliang Zhou"
  - "Xi Lin"
  - "Zhenkun Wang"
  - "Xialiang Tong"
  - "Mingxuan Yuan"
  - "Qingfu Zhang"
year: 2026
date: 2024-05-03
venue: "IEEE T-ITS"
paper_url: "https://doi.org/10.1109/TITS.2026.3674538"
arxiv_url: "https://arxiv.org/abs/2405.01906"
code_url: "https://github.com/CIAM-Group/ICAM"
institutions:
  - "Southern University of Science and Technology"
  - "City University of Hong Kong"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
  - "Asymmetric Traveling Salesman Problem"
summary: "ICAM conditions attention and policy adaptation on each instance’s geometry, scale, and density for large-scale routing generalization."
figure:
  path: paper-assets/icam/framework.png
  alt: ICAM adaptation module producing an instance-conditioned attention-bias matrix for routing.
  caption: 'Figure 2: Instance-conditioned adaptation mechanism used by ICAM.'
  source_url: https://arxiv.org/pdf/2405.01906
---

# Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver

> **TL;DR:** ICAM conditions attention and policy adaptation on each instance’s geometry, scale, and density for large-scale routing generalization.

## Motivation

A policy trained on one size and spatial density sees systematically different distance statistics on large or real-world instances.

## Contributions

- Introduces **ICAM** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem and Asymmetric Traveling Salesman Problem.
- Low-complexity instance-conditioned modules derive adaptation signals from global geometry and reshape the routing policy for the current graph.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem and Asymmetric Traveling Salesman Problem.
2. Low-complexity instance-conditioned modules derive adaptation signals from global geometry and reshape the routing policy for the current graph.
3. The journal evaluates greedy and augmented settings; eightfold augmentation multiplies decoded trajectories.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Asymmetric Traveling Salesman Problem.
- **Scale and budget:** The final IEEE T-ITS study reports synthetic, benchmark, and real-world results across four large-scale routing scenarios.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Instance conditioning improves in- and out-of-distribution quality while retaining fast constructive inference.

## Limitations

### Reported by the Authors

- The adaptation features target geometric shifts and may not address fundamentally new constraints or objectives.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IEEE T-ITS](https://doi.org/10.1109/TITS.2026.3674538)
- **Preprint:** [arXiv:2405.01906](https://arxiv.org/abs/2405.01906)
- **Official implementation:** [repository](https://github.com/CIAM-Group/ICAM)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
