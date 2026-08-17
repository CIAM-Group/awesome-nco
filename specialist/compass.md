---
id: compass
short_title: "COMPASS"
title: "Combinatorial Optimization with Policy Adaptation using Latent Space Search"
authors:
  - "Felix Chalumeau"
  - "Shikha Surana"
  - "Clement Bonnet"
  - "Nathan Grinsztajn"
  - "Arnu Pretorius"
  - "Alexandre Laterre"
  - "Thomas D. Barrett"
year: 2023
date: 2023-11-13
acceptance:
  date: "2023-09-21"
  source_url: "https://neurips.cc/Conferences/2023/CallForPapers"
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/18d3a2f3068d6c669dcae19ceca1bc24-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2311.13569"
code_url: "https://github.com/instadeepai/compass"
institutions:
  - "InstaDeep"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "COMPASS trains a latent-conditioned policy and adapts that latent code with evolutionary search for each test instance."
figure:
  path: paper-assets/compass/framework.png
  alt: COMPASS training and inference pipelines for latent-conditioned routing policies.
  caption: 'Figure 1: COMPASS training and per-instance latent-search workflow.'
  source_url: https://arxiv.org/pdf/2311.13569
---

# Combinatorial Optimization with Policy Adaptation using Latent Space Search

> **TL;DR:** COMPASS trains a latent-conditioned policy and adapts that latent code with evolutionary search for each test instance.

## Motivation

One policy often represents only one construction strategy, limiting adaptation when instance distributions or preferred search behavior change.

## Contributions

- Introduces **COMPASS** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A conditional policy learns a family of behaviors indexed by a low-dimensional latent vector rather than a single deterministic strategy.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A conditional policy learns a family of behaviors indexed by a low-dimensional latent vector rather than a single deterministic strategy.
3. At test time CMA-ES searches the latent space; population size and optimization generations define the inference budget.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments span routing and other combinatorial tasks with distribution shifts and compare fixed policies against per-instance latent adaptation.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Latent search can discover instance-specific strategies without updating network weights.

## Limitations

### Reported by the Authors

- The evolutionary adaptation loop is substantially more expensive than greedy decoding and can be sensitive to its population budget.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/18d3a2f3068d6c669dcae19ceca1bc24-Abstract-Conference.html)
- **Preprint:** [arXiv:2311.13569](https://arxiv.org/abs/2311.13569)
- **Official implementation:** [repository](https://github.com/instadeepai/compass)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
