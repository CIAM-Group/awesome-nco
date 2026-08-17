---
id: cross-problem-learning
short_title: "Cross-Problem Learning"
title: "Cross-Problem Learning for Solving Vehicle Routing Problems"
authors:
  - "Zhuoyi Lin"
  - "Yaoxin Wu"
  - "Bangjian Zhou"
  - "Zhiguang Cao"
  - "Wen Song"
  - "Yingqian Zhang"
  - "Senthilnath Jayavelu"
year: 2024
date: 2024-04-17
acceptance:
  date: "2024-04-16"
  source_url: "https://ijcai24.org/call-for-papers/index.html"
venue: "IJCAI"
paper_url: "https://www.ijcai.org/proceedings/2024/0769"
code_url: "https://github.com/Zhuoyi-Lin/Cross_problem_learning"
arxiv_url: "https://arxiv.org/abs/2404.11677"
institutions:
  - "Nanyang Technological University"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Vehicle Routing Problem with Time Windows"
  - "Orienteering Problem"
summary: "Cross-Problem Learning shares routing representations and transfers knowledge through lightweight problem-aware components across several VRP formulations."
figure:
  path: paper-assets/cross-problem-learning/framework.png
  alt: Problem-specific and cross-problem graph Transformer architectures for routing.
  caption: 'Figure 1: Comparison of task-specific and cross-problem Transformer designs.'
  source_url: https://arxiv.org/pdf/2404.11677
---

# Cross-Problem Learning for Solving Vehicle Routing Problems

> **TL;DR:** Cross-Problem Learning shares routing representations and transfers knowledge through lightweight problem-aware components across several VRP formulations.

## Motivation

Closely related routing problems are usually trained independently even though geometry, capacity, and route-construction patterns overlap.

## Contributions

- Introduces **Cross-Problem Learning** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows and Orienteering Problem.
- A shared backbone learns common node interactions while problem embeddings or lightweight heads represent constraint-specific decisions.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows and Orienteering Problem.
2. A shared backbone learns common node interactions while problem embeddings or lightweight heads represent constraint-specific decisions.
3. One multi-problem model is decoded under each task mask, with augmentation reported separately from greedy results.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows; Orienteering Problem.
- **Scale and budget:** Experiments train jointly on several routing problems at standard scales and evaluate transfer and data efficiency.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Shared representations improve joint performance and reduce training needed for related tasks.

## Limitations

### Reported by the Authors

- Each supported problem still requires an explicit formulation and feasibility mechanism; the model is not constraint-language general.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IJCAI](https://www.ijcai.org/proceedings/2024/0769)
- **Preprint:** [arXiv:2404.11677](https://arxiv.org/abs/2404.11677)
- **Official implementation:** [repository](https://github.com/Zhuoyi-Lin/Cross_problem_learning)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
