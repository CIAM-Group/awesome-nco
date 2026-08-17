---
id: pointer-networks
short_title: Ptr-Net
title: 'Pointer Networks'
authors:
  - Oriol Vinyals
  - Meire Fortunato
  - Navdeep Jaitly
year: 2015
date: 2015-06-09
acceptance:
  date: "2015"
  source_url: "https://neurips.cc/Conferences/2015/Dates"
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2015/hash/29921001f2f04bd3baee84a12e98098f-Abstract.html
arxiv_url: https://arxiv.org/abs/1506.03134
institutions:
  - Google Brain
  - University of California, Berkeley
figure:
  path: paper-assets/pointer-networks/framework.png
  alt: Sequence-to-sequence and Pointer Network architectures comparing fixed-vocabulary and input-position outputs.
  caption: 'Figure 1: Sequence-to-sequence model and Pointer Network architecture.'
  source_url: https://arxiv.org/pdf/1506.03134
scope: specialist
paradigm: constructive
problem_families:
  - Routing
  - Geometry
problems:
  - Traveling Salesman Problem
  - Convex Hull
  - Delaunay Triangulation
summary: Pointer Networks use attention as a pointer over variable-sized inputs to construct combinatorial outputs.
---

# Pointer Networks

> **TL;DR:** Ptr-Net turns attention scores into a distribution over input positions, enabling sequence models to emit variable-sized combinatorial structures.

## Motivation

Ordinary sequence-to-sequence models predict from a fixed output vocabulary, whereas many combinatorial tasks require selecting elements from an input set whose size changes between instances. The paper asks whether attention itself can provide the output vocabulary.

## Contributions

- Introduces the Pointer Network output layer, which normalizes attention over encoder positions.
- Applies the same sequence model to convex hull, Delaunay triangulation, and Euclidean TSP instances.
- Demonstrates that a model trained on one size can be evaluated on larger inputs, while documenting degradation outside the training range.

## Methodology

1. An LSTM encoder maps the ordered input points to hidden states.
2. An LSTM decoder forms a query at every output step.
3. Attention scores over encoder states are normalized directly and the selected input index becomes the next output token.
4. Supervised learning maximizes the likelihood of reference output sequences.

## Experiments

- **Problems:** Convex hull, Delaunay triangulation, and Euclidean TSP.
- **Scale and budget:** Synthetic instances with the paper's task-specific training ranges; decoding is autoregressive rather than a post-hoc local-search budget.
- **Baselines:** Sequence-to-sequence and attention-based sequence models.
- **Metrics:** Output accuracy or tour length depending on the task.
- **Main finding:** Pointer outputs handle variable input sizes and improve the studied structured predictions, but TSP quality and extrapolation remain limited as size grows.

## Limitations

### Reported by the Authors

- Generalization weakens when test sizes are substantially larger than the training sizes.

### Curator Notes

- TSP supervision requires labeled solutions and the sequence representation introduces arbitrary ordering choices for set-valued inputs.
- Ptr-Net is an architectural foundation rather than a competitive large-scale TSP solver by itself.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Main paper references:** Sections 2–4 and the main Pointer Network architecture figure.
