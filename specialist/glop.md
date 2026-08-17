---
id: glop
short_title: "GLOP"
title: "GLOP: Learning Global Partition and Local Construction for Solving Large-Scale Routing Problems in Real-Time"
authors:
  - "Haoran Ye"
  - "Jiarui Wang"
  - "Helan Liang"
  - "Zhiguang Cao"
  - "Yong Li"
  - "Fanzhang Li"
year: 2024
date: 2023-12-13
acceptance:
  date: "2023-12-09"
  source_url: "https://aaai.org/conference/aaai/aaai-24/"
venue: "AAAI"
paper_url: "https://ojs.aaai.org/index.php/AAAI/article/view/30009"
arxiv_url: "https://arxiv.org/abs/2312.08224"
code_url: "https://github.com/henry-yeh/GLOP"
institutions:
  - "Soochow University"
  - "Singapore Management University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Asymmetric Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
  - "Prize Collecting Traveling Salesman Problem"
summary: "GLOP combines non-autoregressive global partitioning with autoregressive local path construction for real-time routing at up to 100,000 nodes."
figure:
  path: paper-assets/glop/framework.png
  alt: GLOP pipeline for partitioning a routing graph, solving subpaths, and composing a final route.
  caption: 'Figure 1: Global partitioning and local reconstruction pipeline of GLOP.'
  source_url: https://arxiv.org/pdf/2312.08224
---

# GLOP: Learning Global Partition and Local Construction for Solving Large-Scale Routing Problems in Real-Time

> **TL;DR:** GLOP combines non-autoregressive global partitioning with autoregressive local path construction for real-time routing at up to 100,000 nodes.

## Motivation

Flat neural solvers either exceed memory on large instances or depend on slow post-hoc search to recover quality.

## Contributions

- Introduces **GLOP** as a concrete neural routing method for Traveling Salesman Problem and Asymmetric Traveling Salesman Problem and Capacitated Vehicle Routing Problem and Prize Collecting Traveling Salesman Problem.
- A learned heatmap partitions the graph into TSP-like regions, then a local policy constructs shortest Hamiltonian paths that are joined into a complete route.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Asymmetric Traveling Salesman Problem and Capacitated Vehicle Routing Problem and Prize Collecting Traveling Salesman Problem.
2. A learned heatmap partitions the graph into TSP-like regions, then a local policy constructs shortest Hamiltonian paths that are joined into a complete route.
3. The main pipeline is feed-forward and hierarchical; optional local settings and batching should be matched when comparing runtime.

## Experiments

- **Problems:** Traveling Salesman Problem; Asymmetric Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Prize Collecting Traveling Salesman Problem.
- **Scale and budget:** Evaluation covers TSP, ATSP, CVRP, and PCTSP, including TSP100K and public benchmarks.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The hybrid hierarchy reports strong real-time quality and large speedups over iterative large-scale baselines.

## Limitations

### Reported by the Authors

- Partition boundaries can lock in global mistakes, and separate task-specific models or components are used across the studied problems.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [AAAI](https://ojs.aaai.org/index.php/AAAI/article/view/30009)
- **Preprint:** [arXiv:2312.08224](https://arxiv.org/abs/2312.08224)
- **Official implementation:** [repository](https://github.com/henry-yeh/GLOP)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
