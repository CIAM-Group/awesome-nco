---
id: meta-sage
short_title: "Meta-SAGE"
title: "Meta-SAGE: Scale Meta-Learning Scheduled Adaptation with Guided Exploration for Mitigating Scale Shift on Combinatorial Optimization"
authors:
  - "Jiwoo Son"
  - "Minsu Kim"
  - "Hyeonah Kim"
  - "Jinkyoo Park"
year: 2023
date: 2023-06-05
acceptance:
  date: "2023-04-24"
  source_url: "https://icml.cc/Conferences/2023/Dates"
venue: "ICML"
paper_url: "https://proceedings.mlr.press/v202/son23a.html"
arxiv_url: "https://arxiv.org/abs/2306.02688"
institutions:
  - "KAIST"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "Meta-SAGE meta-learns an initialization and schedule for efficient test-time adaptation when routing instance size changes."
figure:
  path: paper-assets/meta-sage/framework.png
  alt: Meta-SAGE module adapting latent features between an encoder and decoder.
  caption: 'Figure 2: Meta-SAGE adaptation module for size-generalizable routing.'
  source_url: https://arxiv.org/pdf/2306.02688
---

# Meta-SAGE: Scale Meta-Learning Scheduled Adaptation with Guided Exploration for Mitigating Scale Shift on Combinatorial Optimization

> **TL;DR:** Meta-SAGE meta-learns an initialization and schedule for efficient test-time adaptation when routing instance size changes.

## Motivation

A constructive policy trained at one scale suffers a distribution shift in both graph statistics and decision horizon when evaluated at another scale.

## Contributions

- Introduces **Meta-SAGE** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- Meta-training exposes the policy to scheduled scale changes and guided exploration so a small number of adaptation updates can specialize it to a target scale.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. Meta-training exposes the policy to scheduled scale changes and guided exploration so a small number of adaptation updates can specialize it to a target scale.
3. Each test setting uses an explicit adaptation budget followed by constructive decoding, so update steps and sampled instances are part of inference cost.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** TSP and CVRP experiments train on common small scales and evaluate larger scales and cross-scale adaptation.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Meta-learned adaptation recovers more performance than naive fine-tuning for the same limited update budget.

## Limitations

### Reported by the Authors

- The method is not zero-cost zero-shot generalization: it needs target-scale instances, optimization steps, and tuned adaptation schedules.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICML](https://proceedings.mlr.press/v202/son23a.html)
- **Preprint:** [arXiv:2306.02688](https://arxiv.org/abs/2306.02688)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
