---
id: fast-t2t
short_title: "Fast T2T"
title: "Fast T2T: Optimization Consistency Speeds Up Diffusion-Based Training-to-Testing Solving for Combinatorial Optimization"
authors:
  - "Yang Li"
  - "Jinpei Guo"
  - "Runzhong Wang"
  - "Hongyuan Zha"
  - "Junchi Yan"
year: 2024
date: 2024-12-09
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/352b13f01566ae34affacc60e98c16af-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2502.02941"
code_url: "https://github.com/Thinklab-SJTU/Fast-T2T"
institutions:
  - "Shanghai Jiao Tong University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "Fast T2T aligns training and test-time objectives so diffusion-based combinatorial search requires fewer refinement steps."
figure:
  path: paper-assets/fast-t2t/framework.png
  alt: Fast T2T graph diffusion process from random noise to a combinatorial solution.
  caption: 'Figure 1: Fast T2T diffusion and denoising process for combinatorial optimization.'
  source_url: https://arxiv.org/pdf/2502.02941
---

# Fast T2T: Optimization Consistency Speeds Up Diffusion-Based Training-to-Testing Solving for Combinatorial Optimization

> **TL;DR:** Fast T2T aligns training and test-time objectives so diffusion-based combinatorial search requires fewer refinement steps.

## Motivation

T2T-style gradient search can improve solutions but its many test-time updates limit throughput.

## Contributions

- Introduces **Fast T2T** as a concrete neural routing method for Traveling Salesman Problem.
- The method introduces an optimization-consistency objective that trains the generative landscape to support faster downstream refinement.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. The method introduces an optimization-consistency objective that trains the generative landscape to support faster downstream refinement.
3. Inference retains gradient-based search but reports substantially shorter schedules; step count and restarts remain part of the budget.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** The study evaluates TSP and other combinatorial tasks across the established T2T settings and distribution shifts.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Consistency training preserves much of the search quality while reducing test-time optimization cost.

## Limitations

### Reported by the Authors

- The approach still needs iterative test-time computation and inherits the discrete projection choices of the underlying diffusion solver.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2024/hash/352b13f01566ae34affacc60e98c16af-Abstract-Conference.html)
- **Preprint:** [arXiv:2502.02941](https://arxiv.org/abs/2502.02941)
- **Official implementation:** [repository](https://github.com/Thinklab-SJTU/Fast-T2T)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
