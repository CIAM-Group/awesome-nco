---
id: ncs
short_title: "NCS"
title: "Efficient Neural Collaborative Search for Pickup and Delivery Problems"
authors:
  - "Detian Kong"
  - "Yining Ma"
  - "Zhiguang Cao"
  - "Tianshu Yu"
  - "Jianhua Xiao"
year: 2024
date: 2023-08-01
acceptance:
  date: "2024"
  source_url: "https://doi.org/10.1109/TPAMI.2024.3450850"
venue: "IEEE TPAMI"
paper_url: "https://doi.org/10.1109/TPAMI.2024.3450850"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - "Pickup and Delivery Problem"
  - "Pickup and Delivery Problem with Time Windows"
summary: "NCS coordinates several learned improvement policies so complementary neighborhoods can search pickup-and-delivery solutions efficiently."
---

# Efficient Neural Collaborative Search for Pickup and Delivery Problems

> **TL;DR:** NCS coordinates several learned improvement policies so complementary neighborhoods can search pickup-and-delivery solutions efficiently.

## Motivation

One learned operator tends to specialize in a narrow move pattern and can stagnate on constrained pickup-and-delivery routes.

## Contributions

- Introduces **NCS** as a concrete neural routing method for Pickup and Delivery Problem and Pickup and Delivery Problem with Time Windows.
- Multiple neural policies propose complementary moves and a collaboration mechanism allocates search effort using shared solution feedback.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Pickup and Delivery Problem and Pickup and Delivery Problem with Time Windows.
2. Multiple neural policies propose complementary moves and a collaboration mechanism allocates search effort using shared solution feedback.
3. Iteration count, number of collaborators, and parallel rollout settings jointly determine the inference budget.

## Experiments

- **Problems:** Pickup and Delivery Problem; Pickup and Delivery Problem with Time Windows.
- **Scale and budget:** Experiments cover pickup-and-delivery variants, multiple instance sizes, and comparisons with neural and handcrafted search baselines.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Collaboration improves search diversity and the quality-time tradeoff over isolated policies.

## Limitations

### Reported by the Authors

- The method needs an initial feasible solution and its trained operators are specific to pickup-and-delivery constraints.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IEEE TPAMI](https://doi.org/10.1109/TPAMI.2024.3450850)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
