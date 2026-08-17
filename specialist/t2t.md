---
id: t2t
short_title: "T2T"
title: "T2T: From Distribution Learning in Training to Gradient Search in Testing for Combinatorial Optimization"
authors:
  - "Yang Li"
  - "Jinpei Guo"
  - "Runzhong Wang"
  - "Junchi Yan"
year: 2023
date: 2023-12-11
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/9c93b3cd3bc60c0fe7b0c2d74a2da966-Abstract-Conference.html"
code_url: "https://github.com/Thinklab-SJTU/T2TCO"
institutions:
  - "Shanghai Jiao Tong University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "T2T learns a continuous solution distribution and performs gradient-based test-time search to refine combinatorial solutions."
---

# T2T: From Distribution Learning in Training to Gradient Search in Testing for Combinatorial Optimization

> **TL;DR:** T2T learns a continuous solution distribution and performs gradient-based test-time search to refine combinatorial solutions.

## Motivation

A fixed neural decoder may miss instance-specific optima, but unconstrained test-time optimization can drift away from the learned solution manifold.

## Contributions

- Introduces **T2T** as a concrete neural routing method for Traveling Salesman Problem.
- Training estimates a structured solution distribution; testing treats its latent or continuous representation as an optimization variable and follows objective gradients.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. Training estimates a structured solution distribution; testing treats its latent or continuous representation as an optimization variable and follows objective gradients.
3. Quality depends on the number of test-time gradient steps, restarts, and discrete projection choices rather than a single network evaluation.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** The evaluation includes Euclidean TSP and additional combinatorial benchmarks across in-distribution and shifted settings.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Test-time optimization improves samples from the learned distribution and exposes a useful training-to-testing search continuum.

## Limitations

### Reported by the Authors

- Gradient refinement adds instance-specific compute and makes budget-matched comparison with constructive baselines essential.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/9c93b3cd3bc60c0fe7b0c2d74a2da966-Abstract-Conference.html)
- **Official implementation:** [repository](https://github.com/Thinklab-SJTU/T2TCO)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
