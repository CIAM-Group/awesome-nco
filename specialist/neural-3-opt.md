---
id: neural-3-opt
short_title: Neural-3-OPT
title: 'Learning 3-opt Heuristics for Traveling Salesman Problem via Deep Reinforcement Learning'
authors: [Jingyan Sui, Shizhe Ding, Ruizhi Liu, Liming Xu, Dongbo Bu]
year: 2021
date: 2021-11-17
venue: ACML
paper_url: https://proceedings.mlr.press/v157/sui21a.html
institutions: [Institute of Computing Technology, Chinese Academy of Sciences, University of Chinese Academy of Sciences, Zhongke Big Data Academy]
figure:
  path: paper-assets/neural-3-opt/framework.png
  alt: Neural-3-OPT improvement loop and learned link and reconnection selectors.
  caption: 'Figure 2: Overview of the Neural-3-OPT iterative TSP improvement pipeline.'
  source_url: https://proceedings.mlr.press/v157/sui21a/sui21a.pdf
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Traveling Salesman Problem]
summary: Neural-3-OPT learns which three tour edges to remove and how to reconnect the resulting segments.
---

# Learning 3-opt Heuristics for Traveling Salesman Problem via Deep Reinforcement Learning

> **TL;DR:** Neural-3-OPT learns both edge selection and one of the feasible 3-opt reconnection patterns.

## Motivation

Learned 2-opt policies explore a restricted neighborhood. Classical 3-opt is stronger but has a larger coupled decision space over removed edges and reconnection types.

## Contributions

- Learns a 3-opt move policy with a pointer decoder for edges and FiLM conditioning for reconnection.
- Applies repeated moves to synthetic and real TSP instances.
- Compares the larger learned neighborhood with neural improvement baselines.

## Methodology

1. Encode the current tour with graph and sequence features. 2. Point to three edges to remove. 3. Condition a FiLM network on the selection and choose a legal reconnection. 4. Apply the move and repeat under a fixed step budget.

## Experiments

- **Problems:** Euclidean random TSP and TSPLIB instances across the paper's small-to-medium scales.
- **Baselines:** Neural 2-opt/improvement methods and classical heuristics.
- **Metrics:** Tour length, gap, and search time.
- **Main finding:** The learned 3-opt neighborhood improves solution quality over smaller learned moves under the reported iteration budget, with additional action-selection cost.

## Limitations

### Reported by the Authors

- Iterative inference is slower than one-shot construction.

### Curator Notes

- The policy is specialized to symmetric TSP and its fixed 3-opt move grammar.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Main paper references:** Sections 3–5 and the pointer/FiLM method diagram.
