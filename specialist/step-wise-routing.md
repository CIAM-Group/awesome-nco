---
id: step-wise-routing
short_title: Step-Wise
title: 'Step-Wise Deep Learning Models for Solving Routing Problems'
authors: [Liang Xin, Wen Song, Zhiguang Cao, Jie Zhang]
year: 2021
date: 2020-10-15
acceptance:
  date: "2020"
  source_url: "https://doi.org/10.1109/TII.2020.3031409"
venue: IEEE TII
paper_url: https://doi.org/10.1109/TII.2020.3031409
institutions: [Nanyang Technological University, National University of Singapore, Shandong University]
scope: specialist
paradigm: constructive
problem_families: [Routing]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem]
summary: Step-Wise recomputes graph representations after each routing decision so the policy explicitly reflects the remaining problem state.
---

# Step-Wise Deep Learning Models for Solving Routing Problems

> **TL;DR:** Step-Wise re-encodes the residual routing graph during construction instead of relying on one static encoder pass.

## Motivation

Static embeddings become stale as customers are visited, vehicle capacity changes, and the residual graph shrinks. The paper makes state-dependent re-encoding the central modeling choice.

## Contributions

- Introduces step-wise graph encoding for sequential routing decisions.
- Combines dynamic representations with reinforcement-learning construction.
- Evaluates TSP and CVRP variants and size transfer.

## Methodology

1. Encode the current feasible nodes and route state. 2. Decode the next node with attention. 3. update masks, capacity, and residual graph. 4. Re-run the encoder and continue until the solution is complete.

## Experiments

- **Problems:** TSP and CVRP on synthetic instances over the sizes reported in the article.
- **Baselines:** Static neural constructors and classical routing solvers.
- **Metrics:** Objective/gap and runtime.
- **Main finding:** Dynamic re-encoding improves state awareness and solution quality, but requires an encoder pass at every decision step.

## Limitations

### Reported by the Authors

- Step-wise encoding has higher computational complexity than static encoding.

### Curator Notes

- Models remain problem specific and scaling to very large graphs is constrained by repeated attention computation.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Main paper references:** Model section, step-wise architecture figure, and routing experiments.
