---
id: softdist
short_title: "SoftDist"
title: "Position: Rethinking Post-Hoc Search-Based Neural Approaches for Solving Large-Scale Traveling Salesman Problems"
authors:
  - "Yifan Xia"
  - "Xianliang Yang"
  - "Zichuan Liu"
  - "Zhihao Liu"
  - "Lei Song"
  - "Jiang Bian"
year: 2024
date: 2024-06-02
acceptance:
  date: "2024-05-01"
  source_url: "https://icml.cc/Conferences/2024/Dates"
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v235/xia24f.html"
arxiv_url: "https://arxiv.org/abs/2406.03503"
institutions:
  - "Microsoft Research Asia"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "SoftDist is a position-paper baseline that studies soft distance guidance and argues for careful accounting of post-hoc search in large-scale neural TSP results."
figure:
  path: paper-assets/softdist/framework.png
  alt: SoftDist training loss over a tour image and test-time graph extraction with combinatorial search.
  caption: 'Figure 3: Soft-distance supervision during training and tour extraction at test time.'
  source_url: https://arxiv.org/pdf/2406.03503
---

# Position: Rethinking Post-Hoc Search-Based Neural Approaches for Solving Large-Scale Traveling Salesman Problems

> **TL;DR:** SoftDist is a position-paper baseline that studies soft distance guidance and argues for careful accounting of post-hoc search in large-scale neural TSP results.

## Motivation

Large-scale neural solvers are often credited for results produced mainly by expensive downstream search rather than learned construction.

## Contributions

- Introduces **SoftDist** as a concrete neural routing method for Traveling Salesman Problem.
- The paper analyzes the learned-score-plus-search pipeline and introduces a simple soft-distance signal as a controlled baseline for testing where gains arise.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. The paper analyzes the learned-score-plus-search pipeline and introduces a simple soft-distance signal as a controlled baseline for testing where gains arise.
3. Decoding, local search, and candidate-set budgets are reported as first-class experimental variables rather than hidden implementation details.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** The evaluation focuses on large synthetic and benchmark TSPs under multiple post-hoc search budgets.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Simple structural priors can match parts of the performance attributed to complex neural heatmaps when search is strong.

## Limitations

### Reported by the Authors

- SoftDist is primarily an analysis and baseline contribution, not a complete standalone neural routing architecture.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v235/xia24f.html)
- **Preprint:** [arXiv:2406.03503](https://arxiv.org/abs/2406.03503)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
