---
id: goal
short_title: GOAL
title: 'GOAL: A Generalist Combinatorial Optimization Agent Learner'
authors:
  - Darko Drakulic
  - Sofia Michel
  - Jean-Marc Andreoli
year: 2025
date: 2024-06-21
acceptance:
  date: "2025-01-22"
  source_url: "https://iclr.cc/Conferences/2025/Dates"
venue: ICLR
paper_url: https://openreview.net/forum?id=z2z9suDRjw
arxiv_url: https://arxiv.org/abs/2406.15079
code_url: https://github.com/naver/goal-co
institutions:
  - NAVER LABS Europe
scope: generalist
paradigm: constructive
problem_families:
  - Routing
  - Scheduling
  - Packing
  - Graph Optimization
problems:
  - Asymmetric Traveling Salesman Problem
  - Capacitated Vehicle Routing Problem
  - Capacitated Vehicle Routing Problem with Time Windows
  - Orienteering Problem
  - Job Shop Scheduling Problem
  - Uniform Machine Scheduling Problem
  - Knapsack Problem
  - Minimum Vertex Cover
summary: GOAL shares one Transformer backbone across routing, scheduling, packing, and graph problems while using lightweight problem-specific input and output adapters.
figure:
  path: paper-assets/goal/framework.png
  alt: GOAL architectures for single-type and multi-type combinatorial optimization problems.
  caption: 'Figure 2: GOAL architectures for single-type and multi-type problems, showing the shared backbone and task-specific adapters.'
  source_url: https://arxiv.org/pdf/2406.15079
---

# GOAL: A Generalist Combinatorial Optimization Agent Learner

> **TL;DR:** GOAL shares one Transformer backbone across routing, scheduling, packing, and graph problems while using lightweight problem-specific input and output adapters.

## Motivation

Most neural combinatorial solvers require a separate architecture or separately trained model for every problem. This prevents them from reusing representations and optimization knowledge across related tasks. GOAL asks whether a single backbone can accommodate different graph feature types and solution structures while remaining competitive with specialized solvers and easier to adapt to unseen problems.

## Contributions

- Introduces a shared generalist backbone with lightweight task-specific input and output adapters.
- Proposes mixed-attention blocks that incorporate node, edge, and instance-level features.
- Introduces a multi-type Transformer for problems with heterogeneous node or edge types while sharing parameters across attention blocks.
- Demonstrates joint imitation learning across routing, scheduling, packing, and graph problems.
- Evaluates supervised and unsupervised adaptation to eight additional problems.

## Methodology

1. A problem-specific input adapter maps heterogeneous problem features into a common embedding space.
2. A shared codebook encourages compatible representations across tasks.
3. The shared backbone uses mixed attention to combine node and edge information.
4. Multi-type attention handles multipartite structures such as scheduling problems while reusing the same backbone parameters.
5. A lightweight output adapter scores the feasible construction actions for the current problem.
6. The multi-task model is pretrained by imitating expert solution trajectories and can later be fine-tuned on unseen problems.

## Experiments

- **Multi-task training:** Eight problems spanning routing, scheduling, packing, and classic graph optimization
- **Training problems:** ATSP, CVRP, CVRPTW, OP, JSSP, UMSP, KP, MVC
- **Transfer evaluation:** Eight additional tasks, including routing variants, SOP, MCLP, MIS, and open-shop scheduling
- **Comparisons:** Specialized neural baselines, single-task GOAL variants, and training from scratch
- **Metrics:** Objective/optimality gap, training or fine-tuning time, and transfer performance
- **Ablations:** Shared codebook, mixed attention, and multi-type Transformer components
- **Main finding:** The shared multi-task backbone remains broadly competitive with specialized solvers and can be adapted to new problems with substantially less data or training time than learning from scratch.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- Multi-task imitation learning depends on access to good-quality expert solutions.
- The constructive formulation is limited to problems for which feasibility can be maintained during sequential construction.
- Quadratic Transformer complexity makes the approach costly beyond roughly one thousand nodes.

### Curator Notes

- The method uses problem-specific adapters, so it is a shared-backbone generalist rather than a completely task-agnostic solver.
- New problems still require an adapter and fine-tuning; the paper does not claim unrestricted zero-shot transfer to arbitrary optimization problems.
- Broad coverage trades some per-problem performance for parameter sharing, so comparisons should distinguish the multi-task model from separately trained single-task variants.

## Reproducibility

- Official implementation: [naver/goal-co](https://github.com/naver/goal-co)
- Multi-task training and evaluation scripts: available
- Fine-tuning scripts: available
- Main paper references: Sections 3-5 and Appendices B-D
