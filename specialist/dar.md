---
id: dar
short_title: "DAR"
title: "Distance-Aware Attention Reshaping for Enhancing Generalization of Neural Solvers"
authors:
  - "Yang Wang"
  - "Ya-Hui Jia"
  - "Wei-Neng Chen"
  - "Yi Mei"
year: 2025
date: 2023-11-01
acceptance:
  date: "2025"
  source_url: "https://doi.org/10.1109/TNNLS.2025.3588209"
venue: "IEEE TNNLS"
paper_url: "https://doi.org/10.1109/TNNLS.2025.3588209"
institutions:
  - "South China University of Technology"
  - "Victoria University of Wellington"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "DAR reshapes attention with explicit distance structure so routing policies retain geometric locality under scale and distribution shifts."
---

# Distance-Aware Attention Reshaping for Enhancing Generalization of Neural Solvers

> **TL;DR:** DAR reshapes attention with explicit distance structure so routing policies retain geometric locality under scale and distribution shifts.

## Motivation

Dot-product attention learned on one coordinate distribution may assign unstable priorities when density or graph size changes.

## Contributions

- Introduces **DAR** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- Distance-aware biases recalibrate attention logits using normalized geometric relations while preserving the base autoregressive solver.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. Distance-aware biases recalibrate attention logits using normalized geometric relations while preserving the base autoregressive solver.
3. The method adds little search beyond the underlying decoder; augmentation settings are reported separately from greedy evaluation.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Journal experiments cover TSP and CVRP across training scales, larger tests, and shifted spatial distributions.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Explicit geometry improves generalization with modest architectural overhead.

## Limitations

### Reported by the Authors

- Distance bias is most natural for metric routing and may not transfer to objectives where edge cost is not well described by normalized geometry.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IEEE TNNLS](https://doi.org/10.1109/TNNLS.2025.3588209)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
