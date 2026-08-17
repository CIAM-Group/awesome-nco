---
id: pointerformer
short_title: "Pointerformer"
title: "Pointerformer: Deep Reinforced Multi-Pointer Transformer for the Traveling Salesman Problem"
authors:
  - "Yan Jin"
  - "Yuandong Ding"
  - "Xuanhao Pan"
  - "Kun He"
  - "Li Zhao"
  - "Tao Qin"
  - "Lei Song"
  - "Jiang Bian"
year: 2023
date: 2023-04-19
venue: "AAAI"
paper_url: "https://ojs.aaai.org/index.php/AAAI/article/view/25982"
arxiv_url: "https://arxiv.org/abs/2304.09407"
institutions:
  - "Huazhong University of Science and Technology"
  - "Microsoft Research Asia"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "Pointerformer combines reversible residual encoding, multiple pointers, richer context, and symmetry augmentation for memory-efficient large-scale TSP construction."
figure:
  path: paper-assets/pointerformer/framework.png
  alt: Pointerformer encoder with reversible attention blocks and a multi-pointer autoregressive decoder.
  caption: 'Figure 1: Overall encoder-decoder architecture of Pointerformer.'
  source_url: https://arxiv.org/pdf/2304.09407
---

# Pointerformer: Deep Reinforced Multi-Pointer Transformer for the Traveling Salesman Problem

> **TL;DR:** Pointerformer combines reversible residual encoding, multiple pointers, richer context, and symmetry augmentation for memory-efficient large-scale TSP construction.

## Motivation

Conventional attention solvers face rapidly increasing encoder memory and expose only one pointer decision at a time.

## Contributions

- Introduces **Pointerformer** as a concrete neural routing method for Traveling Salesman Problem.
- The reversible Transformer reduces activation storage while a multi-pointer decoder models several route positions and an enhanced context represents partial-tour state.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. The reversible Transformer reduces activation storage while a multi-pointer decoder models several route positions and an enhanced context represents partial-tour state.
3. Greedy and augmented decoding are reported; augmentation evaluates symmetric transformations and therefore uses a larger inference budget.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** The study covers random and public TSP benchmarks from standard sizes to larger instances beyond common attention-model training scales.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Pointerformer retains competitive small-instance quality and transfers more gracefully to large TSPs with controlled memory.

## Limitations

### Reported by the Authors

- The architecture remains quadratic in important attention operations and is specialized to Euclidean TSP construction.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [AAAI](https://ojs.aaai.org/index.php/AAAI/article/view/25982)
- **Preprint:** [arXiv:2304.09407](https://arxiv.org/abs/2304.09407)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
