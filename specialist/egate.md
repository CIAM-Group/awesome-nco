---
id: egate
short_title: EGATE
title: 'Learn to Design the Heuristics for Vehicle Routing Problem'
authors:
  - Lei Gao
  - Mingxiang Chen
  - Qichang Chen
  - Ganzhong Luo
  - Nuoyi Zhu
  - Zhixin Liu
year: 2020
date: 2020-02-20
venue: IJCAI HSI Workshop
paper_url: https://hsi-workshop.github.io/hsi2020-website/hsi2020/Learn%20to%20Design%20the%20Heuristics%20for%20Vehicle%20Routing%20Problem.pdf
arxiv_url: https://arxiv.org/abs/2002.08539
code_url: https://github.com/water-mirror/NeuLNS
institutions:
  - Nanjing University of Aeronautics and Astronautics
figure:
  path: paper-assets/egate/framework.png
  alt: EGATE node and edge embedding modules feeding a pooled solution representation.
  caption: 'Figure 1: Element-wise graph attention with edge embeddings and the overall EGATE network.'
  source_url: https://arxiv.org/pdf/2002.08539
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - Capacitated Vehicle Routing Problem
summary: EGATE learns edge-aware graph representations to guide iterative local improvement for vehicle routing.
---

# Learn to Design the Heuristics for Vehicle Routing Problem

> **TL;DR:** EGATE uses edge-aware graph attention inside a learned routing heuristic that repeatedly modifies an incumbent CVRP solution.

## Motivation

Vehicle-routing local search depends on manually designed move-selection rules. The paper studies whether an edge-aware graph encoder can learn which parts of the incumbent solution should be changed.

## Contributions

- Proposes an edge-aware graph attention representation for routing states.
- Integrates the learned representation with a reinforcement-learning improvement policy.
- Evaluates the resulting heuristic on synthetic CVRP instances.

## Methodology

1. Represent customers, pairwise distances, and the incumbent route as node and edge features.
2. Apply edge-aware attention to obtain contextual embeddings.
3. Select a local modification with the policy network.
4. Apply the move, update the incumbent, and repeat for a fixed search horizon.

## Experiments

- **Problems:** Capacitated VRP on randomly generated instances.
- **Scale and budget:** Quality is measured at the instance sizes and iterative decision horizons specified in the workshop paper.
- **Baselines:** Hand-designed heuristics and contemporary neural routing methods.
- **Metrics:** Average route length and improvement over the starting solution.
- **Main finding:** Edge-aware learned guidance improves the incumbent over repeated steps; the result depends on the allowed improvement horizon.

## Limitations

### Reported by the Authors

- The evaluation is limited in breadth and scale relative to full industrial VRP benchmarks.

### Curator Notes

- The workshop paper leaves fewer implementation details than later journal-scale studies.
- The policy remains tied to the chosen neighborhood and CVRP state representation.

## Reproducibility

- **Official implementation:** [water-mirror/NeuLNS](https://github.com/water-mirror/NeuLNS)
- **Checkpoints:** Consult the official repository.
- **Main paper references:** Model architecture, learned heuristic procedure, and experiment section.
