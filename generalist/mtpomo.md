---
id: mtpomo
short_title: "MTPOMO"
title: "Multi-Task Learning for Routing Problem with Cross-Problem Zero-Shot Generalization"
authors:
  - "Fei Liu"
  - "Xi Lin"
  - "Zhenkun Wang"
  - "Qingfu Zhang"
  - "Xialiang Tong"
  - "Mingxuan Yuan"
year: 2024
date: 2024-02-23
venue: "KDD"
paper_url: "https://doi.org/10.1145/3637528.3672040"
arxiv_url: "https://arxiv.org/abs/2402.16891"
code_url: "https://github.com/FeiLiu36/MTNCO"
institutions:
  - "Southern University of Science and Technology"
scope: generalist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Open Vehicle Routing Problem"
  - "Vehicle Routing Problem with Backhauls"
  - "Pickup and Delivery Vehicle Routing Problem"
summary: "MTPOMO jointly trains a POMO-style policy on routing attributes and evaluates zero-shot combinations not observed as complete tasks during training."
figure:
  path: paper-assets/mtpomo/framework.png
  alt: MTPOMO encoder, decoder, and attribute-composition mechanism for multi-task routing.
  caption: 'Figure 2: Multi-task POMO architecture with compositional routing attributes.'
  source_url: https://arxiv.org/pdf/2402.16891
---

# Multi-Task Learning for Routing Problem with Cross-Problem Zero-Shot Generalization

> **TL;DR:** MTPOMO jointly trains a POMO-style policy on routing attributes and evaluates zero-shot combinations not observed as complete tasks during training.

## Motivation

Training one model per VRP wastes shared structure and cannot exploit the compositional relationship among routing constraints.

## Contributions

- Introduces **MTPOMO** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls and Pickup and Delivery Vehicle Routing Problem.
- A common encoder-decoder represents problem attributes and multi-task batches expose the policy to several base variants while retaining POMO symmetry training.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Open Vehicle Routing Problem and Vehicle Routing Problem with Backhauls and Pickup and Delivery Vehicle Routing Problem.
2. A common encoder-decoder represents problem attributes and multi-task batches expose the policy to several base variants while retaining POMO symmetry training.
3. The single checkpoint uses greedy or multi-start augmented decoding across all tasks; the latter evaluates many parallel trajectories.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls; Pickup and Delivery Vehicle Routing Problem.
- **Scale and budget:** Experiments span standard routing variants and 20-, 50-, and 100-customer instances, including held-out attribute combinations.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Multi-task training supports cross-problem zero-shot transfer and reduces the need for separate specialist checkpoints.

## Limitations

### Reported by the Authors

- Generalization is bounded by the predefined attribute vocabulary and does not cover arbitrary unseen constraint semantics.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [KDD](https://doi.org/10.1145/3637528.3672040)
- **Preprint:** [arXiv:2402.16891](https://arxiv.org/abs/2402.16891)
- **Official implementation:** [repository](https://github.com/FeiLiu36/MTNCO)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
