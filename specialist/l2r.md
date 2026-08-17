---
id: l2r
short_title: "L2R"
title: "Learning to Reduce Search Space for Generalizable Neural Routing Solver"
authors:
  - "Changliang Zhou"
  - "Xi Lin"
  - "Zhenkun Wang"
  - "Qingfu Zhang"
year: 2026
date: 2025-03-05
acceptance:
  date: "2025-11-23"
  source_url: "https://kdd2026.kdd.org/research-track-call-for-papers/"
venue: "KDD"
paper_url: "https://doi.org/10.1145/3770855.3818173"
arxiv_url: "https://arxiv.org/abs/2503.03137"
code_url: "https://github.com/CIAM-Group/L2R"
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
summary: "L2R learns to prune the candidate search space before construction, retaining promising local choices as routing instances scale."
figure:
  path: paper-assets/l2r/framework.png
  alt: L2R pipeline combining static graph reduction, learned candidate reduction, and local construction.
  caption: 'Figure 3: L2R pipeline for large-scale vehicle-routing instances.'
  source_url: https://arxiv.org/pdf/2503.03137
---

# Learning to Reduce Search Space for Generalizable Neural Routing Solver

> **TL;DR:** L2R learns to prune the candidate search space before construction, retaining promising local choices as routing instances scale.

## Motivation

Full attention and unrestricted candidate scoring become costly at thousands of nodes, while fixed nearest-neighbor pruning can discard important edges.

## Contributions

- Introduces **L2R** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A learned reduction model predicts an instance-adaptive candidate subgraph that a downstream neural routing policy uses for efficient decoding.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A learned reduction model predicts an instance-adaptive candidate subgraph that a downstream neural routing policy uses for efficient decoding.
3. Candidate budget controls speed and risk of pruning; greedy and augmented downstream decoding are reported separately.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** The KDD 2026 paper evaluates TSP and CVRP from standard training sizes through large synthetic and public benchmarks.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Learned reduction preserves stronger routing options than static sparsification while cutting inference cost.

## Limitations

### Reported by the Authors

- If a necessary connection is pruned it cannot be recovered, and the reduction model introduces another generalization dependency.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [KDD](https://doi.org/10.1145/3770855.3818173)
- **Preprint:** [arXiv:2503.03137](https://arxiv.org/abs/2503.03137)
- **Official implementation:** [repository](https://github.com/CIAM-Group/L2R)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
