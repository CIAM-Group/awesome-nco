---
id: difusco
short_title: "DIFUSCO"
title: "DIFUSCO: Graph-based Diffusion Solvers for Combinatorial Optimization"
authors:
  - "Zhiqing Sun"
  - "Yiming Yang"
year: 2023
date: 2023-02-16
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/0ba520d93c3df592c83a611961314c98-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2302.08224"
code_url: "https://github.com/Edward-Sun/DIFUSCO"
institutions:
  - "Carnegie Mellon University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "DIFUSCO learns a graph diffusion process over edge selections and converts denoised heatmaps into TSP tours with decoding and optional local refinement."
---

# DIFUSCO: Graph-based Diffusion Solvers for Combinatorial Optimization

> **TL;DR:** DIFUSCO learns a graph diffusion process over edge selections and converts denoised heatmaps into TSP tours with decoding and optional local refinement.

## Motivation

Sequential decoders commit early to individual nodes, whereas a non-autoregressive model can reason over the complete edge set and revise a noisy solution globally.

## Contributions

- Introduces **DIFUSCO** as a concrete neural routing method for Traveling Salesman Problem.
- A graph neural network learns the reverse process from corrupted edge indicators to a clean solution heatmap conditioned on the input graph.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. A graph neural network learns the reverse process from corrupted edge indicators to a clean solution heatmap conditioned on the input graph.
3. Inference runs a fixed diffusion schedule, decodes the final heatmap, and may add 2-opt or parallel samples; these choices define materially different budgets.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** The paper evaluates synthetic TSP at standard 50- and 100-node scales and larger instances, alongside graph combinatorial tasks in the broader study.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Diffusion produces diverse high-quality heatmaps and supports parallel search, with post-processing closing additional optimality gap.

## Limitations

### Reported by the Authors

- Sampling steps, parallel trajectories, and local search can dominate runtime, so headline results are not equivalent to a single forward pass.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0ba520d93c3df592c83a611961314c98-Abstract-Conference.html)
- **Preprint:** [arXiv:2302.08224](https://arxiv.org/abs/2302.08224)
- **Official implementation:** [repository](https://github.com/Edward-Sun/DIFUSCO)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
