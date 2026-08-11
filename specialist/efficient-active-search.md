---
id: efficient-active-search
short_title: EAS
title: 'Efficient Active Search for Combinatorial Optimization Problems'
authors: [André Hottung, Yeong-Dae Kwon, Kevin Tierney]
year: 2022
date: 2021-06-09
venue: ICLR
paper_url: https://openreview.net/forum?id=nO5caZwFwYu
arxiv_url: https://arxiv.org/abs/2106.05126
code_url: https://github.com/ahottung/EAS
institutions: [Bielefeld University, Samsung SDS]
figure:
  path: paper-assets/efficient-active-search/framework.png
  alt: Efficient Active Search variants that adapt instance embeddings or lightweight decoder parameters.
  caption: 'Figure 1: Sampling a TSP solution with static instance embeddings; the diagram motivates the lightweight EAS updates.'
  source_url: https://arxiv.org/pdf/2106.05126
scope: specialist
paradigm: constructive
problem_families: [Routing, Scheduling]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem, Orienteering Problem, Prize Collecting Traveling Salesman Problem, Flexible Flow Shop Problem]
summary: EAS adapts only a small set of added or selected model parameters to one test instance while sampling candidates from a pretrained policy.
---

# Efficient Active Search for Combinatorial Optimization Problems

> **TL;DR:** EAS keeps most pretrained weights fixed and performs instance-specific gradient search through lightweight embedding, layer, or tabular adaptations.

## Motivation

Active Search can improve one target instance but updating an entire policy is slow and memory intensive. The paper asks how little of a pretrained solver must change to redirect its samples.

## Contributions

- Introduces EAS-Emb, EAS-Lay, and EAS-Tab instance-specific adaptations.
- Reuses pretrained POMO/MatNet-style policies across routing and scheduling tasks.
- Provides a stronger quality-time trade-off than full-model active search in the tested settings.

## Methodology

1. Load a pretrained problem-specific policy. 2. add or select a small set of trainable instance parameters. 3. sample solution batches and update those parameters with policy gradients. 4. retain the best solution over the allotted iterations.

## Experiments

- **Problems:** TSP, CVRP, OP, PCTSP, and FFSP.
- **Scale and budget:** Standard learned-CO sizes with results plotted across adaptation time/iterations and sample batches.
- **Baselines:** POMO/MatNet inference, sampling, and full Active Search.
- **Metrics:** Objective gap versus runtime.
- **Main finding:** Lightweight adaptation reaches stronger solutions sooner than full-network tuning; it remains a multi-sample per-instance optimizer rather than amortized inference.

## Limitations

### Reported by the Authors

- Every new instance still requires gradient updates.

### Curator Notes

- Results depend on pretrained policy quality and exact adaptation budget.

## Reproducibility

- **Official implementation:** [ahottung/EAS](https://github.com/ahottung/EAS)
- **Checkpoints:** Base checkpoints and scripts are linked by the authors.
- **Main paper references:** Section 3, anytime plots, and appendix hyperparameters.
