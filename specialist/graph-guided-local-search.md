---
id: graph-guided-local-search
short_title: RGLS
title: 'Graph Neural Network Guided Local Search for the Traveling Salesperson Problem'
authors: [Benjamin Hudson, Qingbiao Li, Matthew Malencia, Amanda Prorok]
year: 2022
date: 2021-10-11
acceptance:
  date: "2022-01-24"
  source_url: "https://iclr.cc/Conferences/2022/Dates"
venue: ICLR
paper_url: https://openreview.net/forum?id=ar92oEosBIg
arxiv_url: https://arxiv.org/abs/2110.05291
code_url: https://github.com/ProrokLab/gnn-guided-local-search
institutions: [University of Cambridge]
figure:
  path: paper-assets/graph-guided-local-search/framework.png
  alt: Pipeline transforming a TSP into a line graph, predicting edge regret, and guiding local search.
  caption: 'Figure 1: Learned edge-regret prediction integrated with Guided Local Search.'
  source_url: https://arxiv.org/pdf/2110.05291
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Traveling Salesman Problem]
summary: RGLS predicts edge regret with a graph network and inserts those predictions into Guided Local Search penalties.
---

# Graph Neural Network Guided Local Search for the Traveling Salesperson Problem

> **TL;DR:** RGLS leaves Guided Local Search intact but replaces uniform hand-crafted utility with learned edge-regret predictions.

## Motivation

Guided Local Search escapes local minima by penalizing solution features, but generic utility scores ignore distributional patterns that a GNN can learn from training instances.

## Contributions

- Trains a graph network to predict regret for including each TSP edge.
- Uses predictions to initialize or guide GLS penalties.
- Studies both in-distribution quality and transfer from small to larger TSPs.

## Methodology

1. Encode the weighted graph and predict per-edge regret. 2. build an initial tour. 3. run local search to a local minimum. 4. modify GLS feature utilities with neural regret and continue under a fixed time/iteration budget.

## Experiments

- **Problems:** Euclidean TSP, chiefly 20–100 nodes, with small-to-large generalization.
- **Baselines:** Uninformed GLS and contemporary learned TSP methods.
- **Metrics:** Mean optimality gap over time.
- **Main finding:** Learned regret accelerates convergence; on the reported 100-node set it reduces mean gap relative to the compared learned baseline under matched evaluation settings.

## Limitations

### Reported by the Authors

- The edge model is trained on generated instances and evaluated only for TSP.

### Curator Notes

- Final performance remains sensitive to local-search implementation and wall-clock budget.

## Reproducibility

- **Official implementation:** [ProrokLab/gnn-guided-local-search](https://github.com/ProrokLab/gnn-guided-local-search)
- **Checkpoints:** Consult the repository.
- **Main paper references:** Regret model, guided-search integration, and Figures 3–5.
