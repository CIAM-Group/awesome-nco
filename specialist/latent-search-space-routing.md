---
id: latent-search-space-routing
short_title: CVAE-Opt
title: 'Learning a Latent Search Space for Routing Problems Using Variational Autoencoders'
authors: [André Hottung, Bhanu Bhandari, Kevin Tierney]
year: 2021
date: 2020-09-25
acceptance:
  date: "2021-01-14"
  source_url: "https://iclr.cc/Conferences/2021/Dates"
venue: ICLR
paper_url: https://openreview.net/forum?id=90JprVrJBO
code_url: https://github.com/ahottung/learning-a-latent-search-space
institutions: [Bielefeld University, University of Massachusetts Amherst]
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem]
summary: CVAE-Opt learns a continuous latent distribution over routing solutions and optimizes latent codes for a target instance.
---

# Learning a Latent Search Space for Routing Problems Using Variational Autoencoders

> **TL;DR:** CVAE-Opt moves search from discrete tours into a learned continuous latent space, then decodes optimized latent points back to feasible routes.

## Motivation

Direct search over permutations is discontinuous, and per-instance active search over all network weights is expensive. A compact latent variable can provide a smoother, lower-dimensional target for optimization.

## Contributions

- Trains a conditional variational autoencoder over routing solutions.
- Optimizes latent vectors for individual instances while freezing model parameters.
- Evaluates the approach on TSP and CVRP.

## Methodology

1. Encode training solutions into a conditional latent distribution. 2. Decode a latent sample autoregressively for the target instance. 3. Evaluate its route cost and update the latent search distribution. 4. Return the best feasible decoded route under the evaluation budget.

## Experiments

- **Problems:** TSP and CVRP on synthetic instances at the scales in the paper.
- **Baselines:** Neural constructors, active search, and sampling/search variants.
- **Metrics:** Objective/gap against the number of decoded candidates and runtime.
- **Main finding:** Latent optimization improves over plain sampling and reduces the variables adapted per instance, while quality remains evaluation-budget dependent.

## Limitations

### Reported by the Authors

- The learned latent geometry may not transfer to distributions far from training.

### Curator Notes

- Per-instance optimization is not one-pass inference and requires fair candidate-count accounting.

## Reproducibility

- **Official implementation:** [ahottung/learning-a-latent-search-space](https://github.com/ahottung/learning-a-latent-search-space)
- **Checkpoints:** See the official repository.
- **Main paper references:** CVAE formulation, latent optimizer, and experiment sections.
