---
id: lehd
short_title: "LEHD"
title: "Neural Combinatorial Optimization with Heavy Decoder: Toward Large Scale Generalization"
authors:
  - "Fu Luo"
  - "Xi Lin"
  - "Fei Liu"
  - "Qingfu Zhang"
  - "Zhenkun Wang"
year: 2023
date: 2023-10-12
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/1c10d0c087c14689628124bbc8fa69f6-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2310.07985"
code_url: "https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/LEHD"
institutions:
  - "Southern University of Science and Technology"
  - "City University of Hong Kong"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "LEHD shifts capacity from the encoder to a dynamic heavy decoder so a model trained on small instances can construct routes with up to one thousand nodes."
figure:
  path: paper-assets/lehd/framework.png
  alt: LEHD architecture with a single-layer light encoder and a multi-layer heavy decoder.
  caption: 'Figure 1: Light-encoder and heavy-decoder architecture of LEHD.'
  source_url: https://arxiv.org/pdf/2310.07985
---

# Neural Combinatorial Optimization with Heavy Decoder: Toward Large Scale Generalization

> **TL;DR:** LEHD shifts capacity from the encoder to a dynamic heavy decoder so a model trained on small instances can construct routes with up to one thousand nodes.

## Motivation

Standard attention encoders are expensive at large scale and their static embeddings transfer poorly when the test graph is much larger than the training graph.

## Contributions

- Introduces **LEHD** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A light embedding layer encodes nodes once, while a heavier decoder repeatedly models relations among the remaining nodes and the current partial solution.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A light embedding layer encodes nodes once, while a heavier decoder repeatedly models relations among the remaining nodes and the current partial solution.
3. The paper evaluates greedy construction and random reconstruction variants; the latter spends additional reconstruction rounds to trade runtime for solution quality.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Training uses small synthetic TSP and CVRP instances and evaluation extends through 1,000 nodes plus TSPLIB and CVRPLIB benchmarks.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The decoder-centric design improves scale generalization over encoder-heavy constructive baselines, especially when reconstruction is allowed.

## Limitations

### Reported by the Authors

- The strongest results use repeated reconstruction and therefore should not be compared with one-pass greedy decoding at equal wall-clock cost.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/1c10d0c087c14689628124bbc8fa69f6-Abstract-Conference.html)
- **Preprint:** [arXiv:2310.07985](https://arxiv.org/abs/2310.07985)
- **Official implementation:** [repository](https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/LEHD)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
