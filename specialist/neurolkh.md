---
id: neurolkh
short_title: NeuroLKH
title: 'NeuroLKH: Combining Deep Learning Model with Lin-Kernighan-Helsgaun Heuristic for Solving the Traveling Salesman Problem'
authors: [Liang Xin, Wen Song, Zhiguang Cao, Jie Zhang]
year: 2021
date: 2021-10-15
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/3d863b367aa379f71c7afc0c9cdca41d-Abstract.html
arxiv_url: https://arxiv.org/abs/2110.07983
code_url: https://github.com/liangxinedu/NeuroLKH
institutions: [Nanyang Technological University, National University of Singapore, Shandong University]
figure:
  path: paper-assets/neurolkh/framework.png
  alt: NeuroLKH pipeline predicting candidate edges and node penalties for the LKH heuristic.
  caption: 'Figure 1: NeuroLKH and original LKH pipelines, highlighting learned candidate and penalty guidance.'
  source_url: https://arxiv.org/pdf/2110.07983
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem, Pickup and Delivery Problem, Vehicle Routing Problem with Time Windows]
summary: NeuroLKH predicts candidate edges and node penalties with a sparse graph network, then delegates the combinatorial search to LKH.
---

# NeuroLKH: Combining Deep Learning Model with Lin-Kernighan-Helsgaun Heuristic for Solving the Traveling Salesman Problem

> **TL;DR:** NeuroLKH learns the two pieces of guidance that LKH consumes—candidate edges and penalties—without replacing LKH's search machinery.

## Motivation

LKH is powerful but its hand-crafted candidate sets and penalty initialization can spend time exploring unproductive moves. A learned sparse graph representation can prioritize search while retaining the mature heuristic.

## Contributions

- Predicts candidate-edge scores with supervised learning and node penalties with unsupervised training.
- Integrates both outputs into LKH without changing its core move engine.
- Studies transfer from mixed training sizes to larger TSP and several VRP variants.

## Methodology

1. Build a sparse k-nearest-neighbor graph. 2. Run a sparse graph network to score edges and estimate penalties. 3. construct the LKH candidate set and transformed costs. 4. Run LKH under a fixed trial/time budget.

## Experiments

- **Problems:** TSP as the main task, plus CVRP, PDP, and CVRPTW extensions; synthetic and benchmark instances reach thousands of nodes.
- **Baselines:** LKH, neural construction methods, and learned heatmap/search hybrids.
- **Metrics:** Objective gap and runtime at matched search settings.
- **Main finding:** Learned guidance accelerates LKH and improves anytime quality on the studied distributions; the final result still depends on LKH trials and candidate settings.

## Limitations

### Reported by the Authors

- Integration depends on LKH and problem-specific transformations.

### Curator Notes

- This is a hybrid search system, not a standalone neural decoder; hardware and solver parameters matter for runtime claims.

## Reproducibility

- **Official implementation:** [liangxinedu/NeuroLKH](https://github.com/liangxinedu/NeuroLKH)
- **Checkpoints:** Provided by the authors.
- **Main paper references:** SGN section, NeuroLKH integration, Tables 1–4, and appendices.
