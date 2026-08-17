---
id: att-gcn
short_title: Att-GCN
title: 'Generalize a Small Pre-trained Model to Arbitrarily Large TSP Instances'
authors: [Zhang-Hua Fu, Kai-Bin Qiu, Hongyuan Zha]
year: 2021
date: 2020-11-26
acceptance:
  date: "2020-12-01"
  source_url: "https://aaai.org/conference/aaai/aaai-21/"
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/16916
code_url: https://github.com/Spider-scnu/TSP
institutions: [The Chinese University of Hong Kong, Shenzhen]
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Traveling Salesman Problem]
summary: Att-GCN repeatedly predicts local edges on sampled subgraphs and merges them through search to solve TSP instances larger than the training scale.
---

# Generalize a Small Pre-trained Model to Arbitrarily Large TSP Instances

> **TL;DR:** Att-GCN applies a small-instance edge model to local subproblems and iteratively merges its decisions into a large TSP tour.

## Motivation

Neural TSP models trained on tens of nodes often fail or run out of memory on much larger graphs. The paper seeks a decomposition that reuses a fixed small model instead of retraining for every size.

## Contributions

- Combines graph convolution and attention to predict useful local edges.
- Uses iterative subgraph sampling and tour merging to scale the fixed model.
- Evaluates generalization from small training instances to much larger random and benchmark TSPs.

## Methodology

1. Sample local subgraphs from the current large instance. 2. Score candidate edges with Att-GCN. 3. merge predicted subtours while respecting degree and connectivity constraints. 4. Repeat and refine the tour with the prescribed search routine.

## Experiments

- **Problems:** Euclidean TSP, including TSPLIB and large synthetic instances.
- **Scale and budget:** A small pretrained model is reused up to the large sizes reported in the paper; runtime includes repeated subgraph calls and merging.
- **Baselines:** Learned TSP solvers and classical heuristics.
- **Metrics:** Tour length/gap and runtime.
- **Main finding:** Decomposition sharply improves size extrapolation over direct neural decoding, while classical specialized solvers remain important reference points.

## Limitations

### Reported by the Authors

- Repeated local prediction and merging introduce a search-time cost.

### Curator Notes

- The guarantee is empirical and specific to TSP geometry and the merge procedure.

## Reproducibility

- **Official implementation:** [Spider-scnu/TSP](https://github.com/Spider-scnu/TSP)
- **Checkpoints:** See the official repository.
- **Main paper references:** Att-GCN model, Algorithm 1, and large-instance tables.
