---
id: utsp
short_title: "UTSP"
title: "Unsupervised Learning for Solving the Travelling Salesman Problem"
authors:
  - "Yimeng Min"
  - "Yiwei Bai"
  - "Carla P. Gomes"
year: 2023
date: 2023-03-19
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/93b8618a9061f8a55825c13ecf28392b-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2303.10538"
institutions:
  - "Cornell University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "UTSP trains a non-autoregressive graph model without optimal-tour labels by optimizing a continuous surrogate of tour structure and length."
---

# Unsupervised Learning for Solving the Travelling Salesman Problem

> **TL;DR:** UTSP trains a non-autoregressive graph model without optimal-tour labels by optimizing a continuous surrogate of tour structure and length.

## Motivation

Supervised heatmap models depend on expensive exact labels, while reinforcement learning over complete tours can have high-variance credit assignment.

## Contributions

- Introduces **UTSP** as a concrete neural routing method for Traveling Salesman Problem.
- The method predicts a soft adjacency structure and optimizes unsupervised objectives that encourage short, degree-constrained tours before discrete decoding.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. The method predicts a soft adjacency structure and optimizes unsupervised objectives that encourage short, degree-constrained tours before discrete decoding.
3. Inference converts the learned scores into a tour and can apply search or repair; decoding settings must be included in runtime comparisons.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** Reported experiments cover synthetic Euclidean TSP at standard small and medium scales and assess transfer beyond the training distribution.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The unsupervised objective yields competitive edge scores without Concorde-generated training labels.

## Limitations

### Reported by the Authors

- The relaxed objective does not enforce a valid Hamiltonian cycle by itself and still relies on a discrete decoder or repair procedure.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/93b8618a9061f8a55825c13ecf28392b-Abstract-Conference.html)
- **Preprint:** [arXiv:2303.10538](https://arxiv.org/abs/2303.10538)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
