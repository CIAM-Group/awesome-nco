---
id: udc
short_title: "UDC"
title: "UDC: A Unified Neural Divide-and-Conquer Framework for Large-Scale Combinatorial Optimization Problems"
authors:
  - "Zhi Zheng"
  - "Changliang Zhou"
  - "Xialiang Tong"
  - "Mingxuan Yuan"
  - "Zhenkun Wang"
year: 2024
date: 2024-06-29
acceptance:
  date: "2024-09-25"
  source_url: "https://neurips.cc/Conferences/2024/CallForPapers"
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/0b8e4c8468273ee3bafb288229c0acbc-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2407.00312"
code_url: "https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/UDC-Large-scale-CO-master"
institutions:
  - "Southern University of Science and Technology"
scope: specialist
paradigm: constructive-improvement
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "UDC provides a shared divide-and-conquer recipe that partitions large routing instances, solves normalized subproblems, and coordinates local reconstruction."
figure:
  path: paper-assets/udc/framework.png
  alt: UDC divide-and-conquer framework for partitioning, solving, and merging routing subproblems.
  caption: 'Figure 1: Unified divide-and-conquer framework for large routing instances.'
  source_url: https://arxiv.org/pdf/2407.00312
---

# UDC: A Unified Neural Divide-and-Conquer Framework for Large-Scale Combinatorial Optimization Problems

> **TL;DR:** UDC provides a shared divide-and-conquer recipe that partitions large routing instances, solves normalized subproblems, and coordinates local reconstruction.

## Motivation

Large graphs exceed the reliable scale of pretrained neural policies, but hand-designed decomposition rules often ignore learned solution structure.

## Contributions

- Introduces **UDC** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A learned dividing policy forms normalized subinstances, a base neural solver handles them, and a unified reconstruction mechanism joins or revisits local solutions.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A learned dividing policy forms normalized subinstances, a base neural solver handles them, and a unified reconstruction mechanism joins or revisits local solutions.
3. Different base solvers and reconstruction counts produce distinct budgets; each problem still uses a separately trained model under the repository scope policy.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments span TSP and CVRP from standard training scales to large synthetic and benchmark instances.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The same high-level framework improves the scale reach of multiple neural solvers and problems.

## Limitations

### Reported by the Authors

- Boundary decisions can dominate final quality, and the framework is unified at the algorithm level rather than a single cross-problem checkpoint.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2024/hash/0b8e4c8468273ee3bafb288229c0acbc-Abstract-Conference.html)
- **Preprint:** [arXiv:2407.00312](https://arxiv.org/abs/2407.00312)
- **Official implementation:** [repository](https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/UDC-Large-scale-CO-master)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
