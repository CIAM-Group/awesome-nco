---
id: agfn
short_title: "AGFN"
title: "Adversarial Generative Flow Network for Solving Vehicle Routing Problems"
authors:
  - "Ni Zhang"
  - "Jingfeng Yang"
  - "Zhiguang Cao"
  - "Xu Chi"
year: 2025
date: 2024-09-28
venue: "ICLR"
paper_url: "https://proceedings.iclr.cc/paper_files/paper/2025/hash/b210c387381713a14a4f5a607aff3520-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2503.01931"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "AGFN combines a generative flow network with adversarial training to learn diverse high-reward routing trajectories."
figure:
  path: paper-assets/agfn/framework.png
  alt: AGFN training framework with a GFlowNet generator, local search, and an adversarial discriminator.
  caption: 'Figure 1: Overall framework of the Adversarial Generative Flow Network.'
  source_url: https://arxiv.org/pdf/2503.01931
---

# Adversarial Generative Flow Network for Solving Vehicle Routing Problems

> **TL;DR:** AGFN combines a generative flow network with adversarial training to learn diverse high-reward routing trajectories.

## Motivation

Policy-gradient solvers can collapse around one construction mode, limiting the candidate diversity needed for best-of-many inference.

## Contributions

- Introduces **AGFN** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A flow-matching objective assigns probability across multiple good routes while an adversarial signal encourages realistic high-quality solution structure.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A flow-matching objective assigns probability across multiple good routes while an adversarial signal encourages realistic high-quality solution structure.
3. Inference samples a candidate set from the learned flow and selects the best; sample count must accompany objective results.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** The evaluation covers standard TSP and CVRP sizes and analyzes both solution quality and diversity under fixed sampling budgets.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The learned distribution yields more useful diverse candidates than conventional stochastic decoding.

## Limitations

### Reported by the Authors

- Training is more complex than REINFORCE and best-of-many gains depend on evaluating multiple full trajectories.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICLR](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b210c387381713a14a4f5a607aff3520-Abstract-Conference.html)
- **Preprint:** [arXiv:2503.01931](https://arxiv.org/abs/2503.01931)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
