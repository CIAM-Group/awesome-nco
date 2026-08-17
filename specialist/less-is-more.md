---
id: less-is-more
short_title: "Less Is More"
title: "Less Is More -- On the Importance of Sparsification for Transformers and Graph Neural Networks for TSP"
authors:
  - "Attila Lischka"
  - "Jiaming Wu"
  - "Rafael Basso"
  - "Morteza Haghir Chehreghani"
  - "Balazs Kulcsar"
year: 2024
date: 2024-03-25
venue: "arXiv"
paper_url: "https://arxiv.org/abs/2403.17159"
arxiv_url: "https://arxiv.org/abs/2403.17159"
institutions:
  - "Chalmers University of Technology"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "Less Is More studies graph sparsification as the central inductive bias for Transformer and GNN TSP solvers rather than treating a complete graph as mandatory."
figure:
  path: paper-assets/less-is-more/framework.png
  alt: Message passing on an optimal-tour graph compared with message passing on a complete graph.
  caption: 'Figure 1: The effect of graph sparsification on GNN message passing for TSP.'
  source_url: https://arxiv.org/pdf/2403.17159
---

# Less Is More -- On the Importance of Sparsification for Transformers and Graph Neural Networks for TSP

> **TL;DR:** Less Is More studies graph sparsification as the central inductive bias for Transformer and GNN TSP solvers rather than treating a complete graph as mandatory.

## Motivation

Complete-graph attention is expensive and can dilute the local geometric edges that dominate good Euclidean tours.

## Contributions

- Introduces **Less Is More** as a concrete neural routing method for Traveling Salesman Problem.
- The study constructs sparse candidate graphs and evaluates how neighborhood size changes learned representations, decoding quality, and computation.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. The study constructs sparse candidate graphs and evaluates how neighborhood size changes learned representations, decoding quality, and computation.
3. Inference uses the underlying Transformer or GNN decoder on the sparse graph; candidate degree and any repair search are explicit budget choices.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** Experiments compare architectures and sparsification levels over synthetic Euclidean TSP sizes and generalization settings.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Appropriate sparsity can improve both efficiency and solution quality by focusing learning on plausible edges.

## Limitations

### Reported by the Authors

- This remains an arXiv study and is primarily an architectural analysis; aggressive pruning can disconnect necessary tour edges.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [arXiv](https://arxiv.org/abs/2403.17159)
- **Preprint:** [arXiv:2403.17159](https://arxiv.org/abs/2403.17159)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
