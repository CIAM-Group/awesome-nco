---
id: tam
short_title: "TAM"
title: "Generalize Learned Heuristics to Solve Large-scale Vehicle Routing Problems in Real-time"
authors:
  - "Qingchun Hou"
  - "Jingwei Yang"
  - "Yiqiang Su"
  - "Xiaoqing Wang"
  - "Yuming Deng"
year: 2023
date: 2023-02-01
venue: "ICLR"
paper_url: "https://openreview.net/forum?id=6ZajpxqTlQ"
institutions:
  - "Alibaba Group"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Traveling Salesman Problem"
summary: "TAM learns a two-stage divide policy that maps a large CVRP into parallel small TSP-like subproblems while enforcing global capacity constraints."
---

# Generalize Learned Heuristics to Solve Large-scale Vehicle Routing Problems in Real-time

> **TL;DR:** TAM learns a two-stage divide policy that maps a large CVRP into parallel small TSP-like subproblems while enforcing global capacity constraints.

## Motivation

Policies trained on CVRP100 do not directly fit thousands of customers, and naive partitioning can violate vehicle-level constraints.

## Contributions

- Introduces **TAM** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Traveling Salesman Problem.
- A reinforcement-learned upper policy generates sub-route sequences, a global mask preserves constraints, and a lower solver handles the small subproblems in parallel.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Traveling Salesman Problem.
2. A reinforcement-learned upper policy generates sub-route sequences, a global mask preserves constraints, and a lower solver handles the small subproblems in parallel.
3. Inference is primarily one hierarchical pass; the amount of parallel lower-level solving determines practical real-time performance.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Traveling Salesman Problem.
- **Scale and budget:** The model is trained around 100-customer instances and evaluated on synthetic and real-world cases with more than 5,000 nodes.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The reported pipeline generalizes without retraining and remains competitive with traditional heuristics at much lower latency.

## Limitations

### Reported by the Authors

- Errors made by the divide policy propagate to all subroutes and the method assumes the lower-level problem remains well represented by its training regime.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICLR](https://openreview.net/forum?id=6ZajpxqTlQ)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
