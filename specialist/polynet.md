---
id: polynet
short_title: "PolyNet"
title: "PolyNet: Learning Diverse Solution Strategies for Neural Combinatorial Optimization"
authors:
  - "Andre Hottung"
  - "Mridul Mahajan"
  - "Kevin Tierney"
year: 2025
date: 2024-02-21
acceptance:
  date: "2025-01-22"
  source_url: "https://iclr.cc/Conferences/2025/Dates"
venue: "ICLR"
paper_url: "https://proceedings.iclr.cc/paper_files/paper/2025/hash/c7b9810b2e27bccdc8d605a3a54c8cd6-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2402.14048"
code_url: "https://github.com/ahottung/PolyNet"
institutions:
  - "TU Dortmund University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "PolyNet learns a set of distinct construction strategies in one model and chooses among their solutions at inference."
figure:
  path: paper-assets/polynet/framework.png
  alt: PolyNet encoder followed by several decoders that construct diverse routing solutions.
  caption: 'Figure 1: PolyNet learns multiple construction policies within one network.'
  source_url: https://arxiv.org/pdf/2402.14048
---

# PolyNet: Learning Diverse Solution Strategies for Neural Combinatorial Optimization

> **TL;DR:** PolyNet learns a set of distinct construction strategies in one model and chooses among their solutions at inference.

## Motivation

Independent multi-start decoding changes only the start state and may still produce highly correlated routes from one policy.

## Contributions

- Introduces **PolyNet** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A shared encoder feeds multiple strategy embeddings or policy heads trained with an explicit diversity mechanism.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A shared encoder feeds multiple strategy embeddings or policy heads trained with an explicit diversity mechanism.
3. Inference runs a configurable number of strategies and returns the best route; strategy count is the principal budget multiplier.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments cover TSP and CVRP across standard scales and compare diversity, objective gap, and runtime with POMO-style multi-start baselines.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Learned strategy diversity improves best-of-set performance more efficiently than redundant samples.

## Limitations

### Reported by the Authors

- Memory and runtime grow with the number of evaluated strategies, and specialization is learned separately for each routing problem.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICLR](https://proceedings.iclr.cc/paper_files/paper/2025/hash/c7b9810b2e27bccdc8d605a3a54c8cd6-Abstract-Conference.html)
- **Preprint:** [arXiv:2402.14048](https://arxiv.org/abs/2402.14048)
- **Official implementation:** [repository](https://github.com/ahottung/PolyNet)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
