---
id: elg
short_title: "ELG"
title: "Towards Generalizable Neural Solvers for Vehicle Routing Problems via Ensemble with Transferable Local Policy"
authors:
  - "Chao Gao"
  - "Haoran Shang"
  - "Kai Xue"
  - "Dong Li"
  - "Chao Qian"
year: 2024
date: 2024-04-11
venue: "IJCAI"
paper_url: "https://www.ijcai.org/proceedings/2024/0764"
code_url: "https://github.com/gaocrr/ELG"
institutions:
  - "University of Science and Technology of China"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "ELG ensembles transferable local policies to preserve useful neighborhood decisions when routing scale or distribution changes."
---

# Towards Generalizable Neural Solvers for Vehicle Routing Problems via Ensemble with Transferable Local Policy

> **TL;DR:** ELG ensembles transferable local policies to preserve useful neighborhood decisions when routing scale or distribution changes.

## Motivation

Global embeddings learned on one distribution can shift sharply, while local geometric decisions are often more reusable.

## Contributions

- Introduces **ELG** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- The method trains local policies on normalized neighborhoods and combines their action preferences through an ensemble designed for transfer.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. The method trains local policies on normalized neighborhoods and combines their action preferences through an ensemble designed for transfer.
3. Greedy and ensemble decoding use different numbers of policy evaluations; ensemble size is part of the inference budget.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** TSP and CVRP experiments test cross-scale, cross-distribution, and benchmark generalization beyond the training generator.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Local-policy ensembling improves robustness under several distribution shifts without retraining.

## Limitations

### Reported by the Authors

- Local evidence may conflict with global route structure, and larger ensembles increase latency.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IJCAI](https://www.ijcai.org/proceedings/2024/0764)
- **Official implementation:** [repository](https://github.com/gaocrr/ELG)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
