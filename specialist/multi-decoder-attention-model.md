---
id: multi-decoder-attention-model
short_title: MDAM
title: 'Multi-Decoder Attention Model with Embedding Glimpse for Solving Vehicle Routing Problems'
authors: [Liang Xin, Wen Song, Zhiguang Cao, Jie Zhang]
year: 2021
date: 2020-12-19
acceptance:
  date: "2020-12-01"
  source_url: "https://aaai.org/conference/aaai/aaai-21/"
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/17430
arxiv_url: https://arxiv.org/abs/2012.10638
code_url: https://github.com/liangxinedu/MDAM
institutions: [Nanyang Technological University, National University of Singapore, Shandong University]
figure:
  path: paper-assets/multi-decoder-attention-model/framework.png
  alt: MDAM shared encoder, embedding glimpse layer, and multiple attention decoders.
  caption: 'Figure 1: Multi-Decoder Attention Model with two decoders shown for illustration.'
  source_url: https://arxiv.org/pdf/2012.10638
scope: specialist
paradigm: constructive
problem_families: [Routing]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem]
summary: MDAM couples shared attention encodings with multiple decoders and an embedding glimpse to construct diverse routing solutions.
---

# Multi-Decoder Attention Model with Embedding Glimpse for Solving Vehicle Routing Problems

> **TL;DR:** MDAM trains several attention decoders to explore different solution modes while sharing a graph encoder.

## Motivation

A single autoregressive decoder tends to concentrate probability on a narrow family of tours. Sampling helps but may repeatedly produce similar candidates, so the paper explicitly diversifies decoder policies.

## Contributions

- Introduces a multi-decoder attention architecture with shared instance embeddings.
- Adds an embedding-glimpse operation that updates decoder context during construction.
- Uses a regularization term to encourage diversity between decoders.

## Methodology

1. Encode all routing nodes with multi-head attention. 2. Feed the shared representation to several decoders. 3. Let each decoder construct a feasible route with its own parameters and embedding glimpse. 4. Train by policy gradient and return the best candidate across decoders and augmentations.

## Experiments

- **Problems:** TSP and CVRP on 20-, 50-, and 100-node/customer synthetic instances.
- **Baselines:** AM, POMO-era neural solvers, OR solvers, and routing heuristics.
- **Metrics:** Objective, gap, runtime, and candidate diversity.
- **Main finding:** Multiple specialized decoders improve best-candidate quality; comparisons must include the number of decoders and augmentation budget.

## Limitations

### Reported by the Authors

- Multiple decoders increase memory and inference computation.

### Curator Notes

- Separate models are trained for each problem and scale; diversity is not a substitute for broad distribution generalization.

## Reproducibility

- **Official implementation:** [liangxinedu/MDAM](https://github.com/liangxinedu/MDAM)
- **Checkpoints:** See the official repository.
- **Main paper references:** Architecture section, embedding glimpse, and Tables 1–3.
