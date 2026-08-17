---
id: l2c-insert
short_title: "L2C-Insert"
title: "Learning to Insert for Constructive Neural Vehicle Routing Solver"
authors:
  - "Fu Luo"
  - "Xi Lin"
  - "Mengyuan Zhong"
  - "Fei Liu"
  - "Zhenkun Wang"
  - "Jianyong Sun"
  - "Qingfu Zhang"
year: 2025
date: 2025-05-20
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/7e3192a54b4ce5855a90dc182eac2036-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2505.13904"
code_url: "https://github.com/CIAM-Group/L2C_Insert"
institutions:
  - "Southern University of Science and Technology"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "L2C-Insert constructs routes by choosing both an unvisited node and an insertion position, then reuses the same operation for local reconstruction."
figure:
  path: paper-assets/l2c-insert/framework.png
  alt: L2C-Insert encoder and decoder selecting an unvisited node and its insertion position.
  caption: 'Figure 2: Encoder-decoder architecture for insertion-based route construction.'
  source_url: https://arxiv.org/pdf/2505.13904
---

# Learning to Insert for Constructive Neural Vehicle Routing Solver

> **TL;DR:** L2C-Insert constructs routes by choosing both an unvisited node and an insertion position, then reuses the same operation for local reconstruction.

## Motivation

Appending fixes the order of earlier decisions and cannot place a newly considered node inside an already promising route segment.

## Contributions

- Introduces **L2C-Insert** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- The model scores node-position pairs, trains on insertion decisions, and supports partial reconstruction by removing and reinserting route elements.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. The model scores node-position pairs, trains on insertion decisions, and supports partial reconstruction by removing and reinserting route elements.
3. One-pass insertion and repeated local reconstruction are separate budgets; reconstruction count must be reported with results.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments cover synthetic and real-world TSP and CVRP across several sizes and test large-scale generalization.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Flexible insertion improves constructive quality and provides a natural learned local search operator.

## Limitations

### Reported by the Authors

- The action space is larger than appending and the strongest results rely on repeated reconstruction.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2025/hash/7e3192a54b4ce5855a90dc182eac2036-Abstract-Conference.html)
- **Preprint:** [arXiv:2505.13904](https://arxiv.org/abs/2505.13904)
- **Official implementation:** [repository](https://github.com/CIAM-Group/L2C_Insert)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
