---
id: reld
short_title: "ReLD"
title: "Rethinking Light Decoder-based Solvers for Vehicle Routing Problems"
authors:
  - "Ziwei Huang"
  - "Jianan Zhou"
  - "Zhiguang Cao"
  - "Yixin Xu"
year: 2025
date: 2024-09-26
venue: "ICLR"
paper_url: "https://proceedings.iclr.cc/paper_files/paper/2025/hash/447ac93bf22099aa346a45577376492d-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2503.00753"
code_url: "https://github.com/ziweileonhuang/reld-nco"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "ReLD redesigns light-decoder routing policies to recover context quality while keeping inference efficient and scale tolerant."
figure:
  path: paper-assets/reld/framework.png
  alt: ReLD light-decoder variants compared with the POMO decoder structure.
  caption: 'Figure 1: Decoder designs evaluated in the ReLD architecture.'
  source_url: https://arxiv.org/pdf/2503.00753
---

# Rethinking Light Decoder-based Solvers for Vehicle Routing Problems

> **TL;DR:** ReLD redesigns light-decoder routing policies to recover context quality while keeping inference efficient and scale tolerant.

## Motivation

Reducing decoder computation improves speed but can remove precisely the dynamic information needed for robust construction.

## Contributions

- Introduces **ReLD** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- The method identifies essential decoder context, reorganizes attention and state features, and keeps expensive graph processing outside the sequential loop.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. The method identifies essential decoder context, reorganizes attention and state features, and keeps expensive graph processing outside the sequential loop.
3. Greedy and augmented decoding are evaluated separately; augmentation multiplies starts while preserving the light per-step decoder.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Tests include TSP and CVRP at common scales, much larger instances, and non-uniform or benchmark distributions.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The revised decoder improves the quality-efficiency frontier and zero-shot scale generalization.

## Limitations

### Reported by the Authors

- Light decoding still accumulates autoregressive errors and its hand-selected state features are routing specific.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICLR](https://proceedings.iclr.cc/paper_files/paper/2025/hash/447ac93bf22099aa346a45577376492d-Abstract-Conference.html)
- **Preprint:** [arXiv:2503.00753](https://arxiv.org/abs/2503.00753)
- **Official implementation:** [repository](https://github.com/ziweileonhuang/reld-nco)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
