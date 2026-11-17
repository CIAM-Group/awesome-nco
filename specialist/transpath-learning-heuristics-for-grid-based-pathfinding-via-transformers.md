---
id: transpath-learning-heuristics-for-grid-based-pathfinding-via-transformers
short_title: TransPath
title: 'TransPath: Learning Heuristics for Grid-Based Pathfinding via Transformers'
authors:
- Daniil Kirilenko
- Anton Andreychuk
- Aleksandr Panov
- Konstantin Yakovlev
year: 2023
date: '2022-12-22'
publication:
  date: '2023-06-26'
  source_url: https://doi.org/10.1609/aaai.v37i10.26465
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v37i10.26465
institutions:
- Federal Research Center Computer Science and Control of the Russian Academy of Sciences
- AIRI
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Path Planning
problems:
- Grid-Based Pathfinding
summary: Separately supervised CNN-transformers guide grid search with correction factors or path-probability maps;
  only admissible-primary focal search retains a suboptimality bound.
arxiv_url: https://arxiv.org/abs/2212.11730
code_url: https://github.com/Cognitive-AI-Systems/TransPath
figure:
  path: paper-assets/transpath-learning-heuristics-for-grid-based-pathfinding-via-transformers/framework.png
  alt: Original Figure2 depicts CNN encoder/decoder and spatial transformer blocks.
  caption: Original Figure2 and complete caption show the architecture shared structurally by separately trained
    guidance models.
  source_url: https://arxiv.org/pdf/2212.11730v1#page=5
---

# TransPath: Learning Heuristics for Grid-Based Pathfinding via Transformers

> **TL;DR:** A CNN/transformer predicts correction factors or path-probability maps for classical grid search. Focal search preserves its bound through an admissible primary heuristic; correction-factor search has no such guarantee. These are separately trained **specialist/constructive** variants.

## Motivation

Octile distance ignores obstacles and can cause many search expansions. TransPath learns map-dependent guidance while retaining explicit classical search to produce valid paths. [pp. 1–3]

## Contributions

- Learn the ratio of octile distance to true cost-to-go, rather than absolute cost alone.
- Learn path-probability maps for secondary focal-search ordering.
- Compare supervised and differentiable-search training, transformer ablations and OOD maps. [pp. 2–7; Appendices A–C]

## Methodology

Eight-connected grids use unit cardinal and square-root-two diagonal costs. A convolutional encoder, spatial transformers and convolutional decoder predict dense guidance. Correction-factor search ranks nodes using g+h/cf; prediction errors mean its solution cost is not bounded. Focal search instead retains admissible octile-based membership and uses learned PPM values as secondary guidance, preserving the classical w-suboptimality guarantee under that search framework. [pp. 3–5; Algorithm 1]

Correction-factor and PPM models have **different supervision and separately learned parameters**. Size/topology transfer within grid pathfinding does not establish a shared solver for distinct native combinatorial problems. Search constructs paths rather than applying learned edits to complete incumbents. PPM labels use rasterized Theta* paths and nearby corridors with a 0.95 cost-ratio threshold; they are proxy targets, not calibrated probabilities of membership in every optimal eight-connected path. [pp. 4–6]

## Experiments

The augmented dataset has 640000 instances on 64-square maps, split 8:1:1 with related augmentations confined to one split; test instances with hardness below 1.05 are excluded. Each supervised model trains for 35 epochs, batch size 512, in about 3.5 hours on an A100-80GB. [p. 6]

At w=2, FS+PPM averages a 100.24% cost ratio and 26.36% expansion ratio relative to A*, with 82.97% optimal paths. WA*+CF obtains 100.25%, 36.98% and 85.40%, respectively. These are empirical averages, not a 0.3% worst-case guarantee. OOD FS+PPM worsens to 105.62% cost and 55.06% expansions; WA* has a lower 104.31% cost ratio and 57.52% expansions. A*+HL expands 148.94% as many nodes as A* on that OOD set. [Tables 1/4]

For a batch of 64, inference takes 9.5 ms on an A100, followed by about 37 ms CPU search for FS+PPM versus 155 ms for A*. The paper explicitly avoids directly comparing Neural A* wall-clock times because Python/C++ implementations differ. Expansion ratios must not be described as universal end-to-end speedups. [p. 7]

## Limitations

Learned guidance degrades on difficult OOD mazes and incurs preprocessing/GPU costs. The focal bound belongs to admissible primary search, not the neural predictor; CF and greedy-PPM variants lack it. Demonstrations concern static planar grids; 3D and kinodynamic planning remain future work. Table captions specify standard deviations, despite nearby prose saying standard errors. [pp. 7–8; Appendices B/C]

## Reproducibility

Read all **13 pages of arXiv v1**, complete references and scientific Appendices A–C, and inspected all four contact sheets and original Figure 2/full caption. Actual history dates v1 **2022-12-22**; primary publisher/author records identify AAAI2023, four authors and pages 12436–12443.

The [pinned official release](https://github.com/Cognitive-AI-Systems/TransPath/tree/7c82b00fe2a1ce4641307e5d522759e229e11f40) contains 65 ZIP members. Read its complete README and five-cell example notebook source, which demonstrates predictions/search rather than supplying a separate scientific appendix. Notebook output bytes were inventoried, not presented as newly reproduced results. The README provides grid/DEM data links, weights, training and evaluation scripts; no weights were deserialized and no benchmark was rerun.
