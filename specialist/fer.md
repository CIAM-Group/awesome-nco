---
id: fer
short_title: "FER"
title: "Learning Feature Embedding Refiner for Solving Vehicle Routing Problems"
authors:
  - "Jingwen Li"
  - "Yining Ma"
  - "Zhiguang Cao"
  - "Yaoxin Wu"
  - "Wen Song"
  - "Jie Zhang"
  - "Yeow Meng Chee"
year: 2024
date: 2023-06-15
venue: "IEEE TNNLS"
paper_url: "https://doi.org/10.1109/TNNLS.2023.3285077"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "FER refines node embeddings during construction so the representation tracks the shrinking feasible set and current routing state."
---

# Learning Feature Embedding Refiner for Solving Vehicle Routing Problems

> **TL;DR:** FER refines node embeddings during construction so the representation tracks the shrinking feasible set and current routing state.

## Motivation

A static encoder cannot revise pairwise relationships after visited nodes, remaining capacity, and route context change.

## Contributions

- Introduces **FER** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A feature embedding refiner updates cached node representations with lightweight state-aware transformations before subsequent decoder decisions.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A feature embedding refiner updates cached node representations with lightweight state-aware transformations before subsequent decoder decisions.
3. Inference remains autoregressive; reported sampling or augmentation settings evaluate more trajectories than greedy FER.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** The journal study covers TSP and CVRP at common synthetic scales and tests size transfer and established neural baselines.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Dynamic refinement improves constructive decisions without fully recomputing a deep encoder at every step.

## Limitations

### Reported by the Authors

- Repeated refinement adds sequential cost and remains tied to the state variables designed for the target routing problems.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IEEE TNNLS](https://doi.org/10.1109/TNNLS.2023.3285077)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
