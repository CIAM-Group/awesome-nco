---
id: gfacs
short_title: "GFACS"
title: "Ant Colony Sampling with GFlowNets for Combinatorial Optimization"
authors:
  - "Minsu Kim"
  - "Sanghyeok Choi"
  - "Hyeonah Kim"
  - "Jiwoo Son"
  - "Jinkyoo Park"
  - "Yoshua Bengio"
year: 2025
date: 2024-03-11
acceptance:
  date: "2025-01-21"
  source_url: "https://aistats.org/aistats2025/dates.html"
venue: "AISTATS"
paper_url: "https://proceedings.mlr.press/v258/kim25a.html"
arxiv_url: "https://arxiv.org/abs/2403.07041"
code_url: "https://github.com/ai4co/gfacs"
institutions:
  - "KAIST"
  - "Mila"
scope: specialist
paradigm: constructive-improvement
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "GFACS trains a GFlowNet to sample diverse ant-colony construction policies and then exploits pheromone-guided search."
figure:
  path: paper-assets/gfacs/framework.png
  alt: GFACS solution sampling with a pretrained GNN heuristic and pheromone updates.
  caption: 'Figure 2: Solution-sampling process of GFACS.'
  source_url: https://arxiv.org/pdf/2403.07041
---

# Ant Colony Sampling with GFlowNets for Combinatorial Optimization

> **TL;DR:** GFACS trains a GFlowNet to sample diverse ant-colony construction policies and then exploits pheromone-guided search.

## Motivation

ACO benefits from diverse promising trajectories, but hand-designed proposal distributions can converge prematurely.

## Contributions

- Introduces **GFACS** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A GFlowNet learns a reward-proportional distribution over constructions and supplies solutions or heuristic information to an ant-colony loop.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A GFlowNet learns a reward-proportional distribution over constructions and supplies solutions or heuristic information to an ant-colony loop.
3. Ant count, colony iterations, and GFlowNet samples form the inference budget and are reported separately from model evaluation.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** The evaluation spans routing and other combinatorial tasks with comparisons against neural samplers and conventional ACO.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Learned diverse sampling improves the exploration-quality balance of ant search.

## Limitations

### Reported by the Authors

- The hybrid solver remains iterative and its best results require much more compute than greedy neural construction.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [AISTATS](https://proceedings.mlr.press/v258/kim25a.html)
- **Preprint:** [arXiv:2403.07041](https://arxiv.org/abs/2403.07041)
- **Official implementation:** [repository](https://github.com/ai4co/gfacs)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
