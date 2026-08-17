---
id: select-and-optimize
short_title: "Select & Optimize"
title: "Select and Optimize: Learning to Solve Large-Scale TSP Instances"
authors:
  - "Hanni Cheng"
  - "Haosi Zheng"
  - "Ya Cong"
  - "Weihao Jiang"
  - "Shiliang Pu"
year: 2023
date: 2023-04-25
venue: "AISTATS"
paper_url: "https://proceedings.mlr.press/v206/cheng23a.html"
institutions:
  - "Hikvision Research Institute"
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "Select & Optimize learns where to focus a local optimizer so large TSP tours can be improved without reconsidering every node."
---

# Select and Optimize: Learning to Solve Large-Scale TSP Instances

> **TL;DR:** Select & Optimize learns where to focus a local optimizer so large TSP tours can be improved without reconsidering every node.

## Motivation

Applying an expensive optimizer uniformly across a very large tour wastes most of its budget on regions that are unlikely to yield useful changes.

## Contributions

- Introduces **Select & Optimize** as a concrete neural routing method for Traveling Salesman Problem.
- A learned selector identifies promising subsegments and a local optimization module rewrites those selected regions while preserving a complete tour.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. A learned selector identifies promising subsegments and a local optimization module rewrites those selected regions while preserving a complete tour.
3. Inference repeats selection and optimization for a fixed number of rounds; both the selected window and round count define the search budget.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** The paper evaluates large synthetic and benchmark TSP instances beyond the sizes handled directly by standard end-to-end policies.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Learned focus allocation improves the quality-time tradeoff over random or exhaustive local refinement.

## Limitations

### Reported by the Authors

- The approach depends on an initial solution and can miss improvements spanning multiple selected regions.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [AISTATS](https://proceedings.mlr.press/v206/cheng23a.html)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
