---
id: h-tsp
short_title: "H-TSP"
title: "H-TSP: Hierarchically Solving the Large-Scale Traveling Salesman Problem"
authors:
  - "Xuanhao Pan"
  - "Yan Jin"
  - "Yuandong Ding"
  - "Mingxiao Feng"
  - "Li Zhao"
  - "Lei Song"
  - "Jiang Bian"
year: 2023
date: 2023-04-19
venue: "AAAI"
paper_url: "https://ojs.aaai.org/index.php/AAAI/article/view/26120"
arxiv_url: "https://arxiv.org/abs/2304.09395"
code_url: "https://github.com/Learning4Optimization-HUST/H-TSP"
institutions:
  - "Huazhong University of Science and Technology"
  - "Microsoft Research Asia"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "H-TSP uses hierarchical reinforcement learning to select manageable node subsets and connect locally constructed segments for TSPs with up to 10,000 nodes."
---

# H-TSP: Hierarchically Solving the Large-Scale Traveling Salesman Problem

> **TL;DR:** H-TSP uses hierarchical reinforcement learning to select manageable node subsets and connect locally constructed segments for TSPs with up to 10,000 nodes.

## Motivation

Flat autoregressive action spaces and attention memory grow with every city, preventing direct real-time construction on very large TSPs.

## Contributions

- Introduces **H-TSP** as a concrete neural routing method for Traveling Salesman Problem.
- An upper-level policy chooses subsets of at most roughly 200 nodes and a lower-level policy builds a path that attaches each subset to the partial tour.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. An upper-level policy chooses subsets of at most roughly 200 nodes and a lower-level policy builds a path that attaches each subset to the partial tour.
3. The trained hierarchy constructs a route directly without a long post-hoc search loop, although lower-level parallelism affects measured latency.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** Synthetic TSPs range from small training instances to 10,000-node evaluation, with LKH and neural large-scale methods used as references.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The hierarchy reaches competitive gaps while reducing inference time by up to orders of magnitude in the reported large-scale setting.

## Limitations

### Reported by the Authors

- Partition choices are difficult to correct later and a visible quality gap to strong iterative heuristics remains.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [AAAI](https://ojs.aaai.org/index.php/AAAI/article/view/26120)
- **Preprint:** [arXiv:2304.09395](https://arxiv.org/abs/2304.09395)
- **Official implementation:** [repository](https://github.com/Learning4Optimization-HUST/H-TSP)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
