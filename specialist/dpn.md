---
id: dpn
short_title: "DPN"
title: "DPN: Decoupling Partition and Navigation for Neural Solvers of Min-max Vehicle Routing Problems"
authors:
  - "Zhi Zheng"
  - "Shunyu Yao"
  - "Zhenkun Wang"
  - "Xialiang Tong"
  - "Mingxuan Yuan"
  - "Ke Tang"
year: 2024
date: 2024-05-27
acceptance:
  date: "2024-05-01"
  source_url: "https://icml.cc/Conferences/2024/Dates"
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v235/zheng24m.html"
arxiv_url: "https://arxiv.org/abs/2405.17272"
code_url: "https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/DPN-minmaxVRP-master"
institutions:
  - "Southern University of Science and Technology"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Min-max Multiple Traveling Salesman Problem"
summary: "DPN separates customer partitioning from route navigation to address the equity objective in min-max multi-vehicle routing."
figure:
  path: paper-assets/dpn/framework.png
  alt: DPN framework decoupling customer partitioning and route navigation for min-max routing.
  caption: 'Figure 1: DPN separates partitioning and navigation in min-max vehicle routing.'
  source_url: https://arxiv.org/pdf/2405.17272
---

# DPN: Decoupling Partition and Navigation for Neural Solvers of Min-max Vehicle Routing Problems

> **TL;DR:** DPN separates customer partitioning from route navigation to address the equity objective in min-max multi-vehicle routing.

## Motivation

A single sequential policy must simultaneously balance workload across vehicles and order customers within each route, creating conflicting decisions.

## Contributions

- Introduces **DPN** as a concrete neural routing method for Min-max Multiple Traveling Salesman Problem.
- One policy partitions customers among vehicles under a min-max objective and a second navigation policy orders each assigned subset.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Min-max Multiple Traveling Salesman Problem.
2. One policy partitions customers among vehicles under a min-max objective and a second navigation policy orders each assigned subset.
3. Inference constructs partitions and routes with optional augmentation; the number of parallel starts changes the reported budget.

## Experiments

- **Problems:** Min-max Multiple Traveling Salesman Problem.
- **Scale and budget:** Experiments cover synthetic min-max multiple-TSP and related routing settings over several team sizes and graph scales.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Decoupling improves workload balance and makes each learned subproblem easier than a monolithic decoder.

## Limitations

### Reported by the Authors

- Partition mistakes cannot always be repaired by navigation, and the method is specialized to the studied min-max objective.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v235/zheng24m.html)
- **Preprint:** [arXiv:2405.17272](https://arxiv.org/abs/2405.17272)
- **Official implementation:** [repository](https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/DPN-minmaxVRP-master)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
