---
id: drhg
short_title: "DRHG"
title: "Destroy and Repair Using Hyper-Graphs for Routing"
authors:
  - "Ke Li"
  - "Fei Liu"
  - "Zhenkun Wang"
  - "Qingfu Zhang"
year: 2025
date: 2025-02-22
venue: "AAAI"
paper_url: "https://ojs.aaai.org/index.php/AAAI/article/view/34018"
arxiv_url: "https://arxiv.org/abs/2502.16170"
code_url: "https://github.com/CIAM-Group/DRHG"
institutions:
  - "Southern University of Science and Technology"
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "DRHG represents multi-node route structure with hypergraphs and learns coordinated destroy-and-repair moves for large routing instances."
figure:
  path: paper-assets/drhg/framework.png
  alt: DRHG training and inference workflow based on graph reduction and hypergraph solving.
  caption: 'Figure 1: Graph-reduction and hypergraph-based reconstruction workflow of DRHG.'
  source_url: https://arxiv.org/pdf/2502.16170
---

# Destroy and Repair Using Hyper-Graphs for Routing

> **TL;DR:** DRHG represents multi-node route structure with hypergraphs and learns coordinated destroy-and-repair moves for large routing instances.

## Motivation

Pairwise graphs do not directly express route segments or groups that should be removed and reconstructed together.

## Contributions

- Introduces **DRHG** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A hypergraph encoder captures higher-order route relations, a destroy policy selects structured groups, and a repair model reinserts them.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A hypergraph encoder captures higher-order route relations, a destroy policy selects structured groups, and a repair model reinserts them.
3. Search repeats destroy-repair rounds; iteration count and removed fraction determine both neighborhood size and runtime.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** The AAAI experiments cover TSP and CVRP over standard and large scales with neural and classical destroy-repair baselines.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Higher-order neighborhoods improve the effectiveness of learned large-neighborhood search.

## Limitations

### Reported by the Authors

- Hypergraph construction and repeated repair add cost, and performance depends on a suitable initial solution.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [AAAI](https://ojs.aaai.org/index.php/AAAI/article/view/34018)
- **Preprint:** [arXiv:2502.16170](https://arxiv.org/abs/2502.16170)
- **Official implementation:** [repository](https://github.com/CIAM-Group/DRHG)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
