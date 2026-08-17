---
id: omni-vrp
short_title: "Omni-VRP"
title: "Towards Omni-generalizable Neural Methods for Vehicle Routing Problems"
authors:
  - "Jianan Zhou"
  - "Yaoxin Wu"
  - "Wen Song"
  - "Zhiguang Cao"
  - "Jie Zhang"
year: 2023
date: 2023-05-31
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v202/zhou23o.html"
arxiv_url: "https://arxiv.org/abs/2305.19587"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: constructive-improvement
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Vehicle Routing Problem with Time Windows"
summary: "Omni-VRP combines broad training distributions with constructive and improvement components to generalize across scale, distribution, and routing attributes."
figure:
  path: paper-assets/omni-vrp/framework.png
  alt: Omni-VRP workflow from broad training data through meta-training and test-time inference.
  caption: 'Figure 1: Meta-training and inference framework of Omni-VRP.'
  source_url: https://arxiv.org/pdf/2305.19587
---

# Towards Omni-generalizable Neural Methods for Vehicle Routing Problems

> **TL;DR:** Omni-VRP combines broad training distributions with constructive and improvement components to generalize across scale, distribution, and routing attributes.

## Motivation

Many neural routing claims vary only one factor at a time and fail when scale, node distribution, or problem attributes change together.

## Contributions

- Introduces **Omni-VRP** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
- The framework trains on diversified instances, uses a general construction policy, and adds an improvement stage to repair solutions under compound shifts.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
2. The framework trains on diversified instances, uses a general construction policy, and adds an improvement stage to repair solutions under compound shifts.
3. Reported results separate constructive output from the stronger improvement budget, whose iteration count materially affects runtime.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows.
- **Scale and budget:** Evaluation spans multiple CVRP-style variants, scales, spatial distributions, and real-world benchmarks rather than one synthetic generator.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Joint exposure to heterogeneous instances improves broad routing robustness compared with narrowly trained specialists.

## Limitations

### Reported by the Authors

- It still uses routing-specific representations and does not constitute one model for unrelated combinatorial problem families.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v202/zhou23o.html)
- **Preprint:** [arXiv:2305.19587](https://arxiv.org/abs/2305.19587)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
