---
id: hncs
short_title: "HNCS"
title: "Hierarchical Neural Constructive Solver for Real-world TSP Scenarios"
authors:
  - "Yong Liang Goh"
  - "Zhiguang Cao"
  - "Yining Ma"
  - "Yanfei Dong"
  - "Mohammed Haroon Dupty"
  - "Wee Sun Lee"
year: 2024
date: 2024-08-07
venue: "KDD"
paper_url: "https://doi.org/10.1145/3637528.3672053"
arxiv_url: "https://arxiv.org/abs/2408.03585"
institutions:
  - "National University of Singapore"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "HNCS hierarchically clusters real-world TSP instances and learns to connect locally constructed routes across sparse, non-uniform geographies."
figure:
  path: paper-assets/hncs/framework.png
  alt: HNCS architecture from clustered city representations to a completed TSP tour.
  caption: 'Figure 4: Hierarchical neural construction architecture of HNCS.'
  source_url: https://arxiv.org/pdf/2408.03585
---

# Hierarchical Neural Constructive Solver for Real-world TSP Scenarios

> **TL;DR:** HNCS hierarchically clusters real-world TSP instances and learns to connect locally constructed routes across sparse, non-uniform geographies.

## Motivation

Uniform random training instances poorly reflect the clustered and irregular spatial structure of real delivery or map data.

## Contributions

- Introduces **HNCS** as a concrete neural routing method for Traveling Salesman Problem.
- The solver learns a hierarchy of regions, applies local constructive policies, and coordinates inter-region connections to preserve global tour structure.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. The solver learns a hierarchy of regions, applies local constructive policies, and coordinates inter-region connections to preserve global tour structure.
3. Inference uses the learned hierarchy and local solvers; clustering granularity controls both runtime and the risk of boundary errors.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** Experiments include synthetic distributions and real-world TSP benchmarks at scales reaching thousands of nodes.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Hierarchical spatial modeling improves transfer to non-uniform real-world layouts over flat constructive baselines.

## Limitations

### Reported by the Authors

- Performance depends on meaningful spatial hierarchy and may degrade when good tours require many cross-cluster interactions.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [KDD](https://doi.org/10.1145/3637528.3672053)
- **Preprint:** [arXiv:2408.03585](https://arxiv.org/abs/2408.03585)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
