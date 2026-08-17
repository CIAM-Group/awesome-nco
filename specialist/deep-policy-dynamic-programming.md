---
id: deep-policy-dynamic-programming
short_title: DPDP
title: 'Deep Policy Dynamic Programming for Vehicle Routing Problems'
authors: [Wouter Kool, Herke van Hoof, Joaquim Gromicho, Max Welling]
year: 2022
date: 2021-02-23
acceptance:
  date: "2022"
  source_url: "https://doi.org/10.1007/978-3-031-08011-1_14"
venue: CPAIOR
paper_url: https://doi.org/10.1007/978-3-031-08011-1_14
arxiv_url: https://arxiv.org/abs/2102.11756
code_url: https://github.com/wouterkool/dpdp
institutions: [University of Amsterdam, ORTEC]
figure:
  path: paper-assets/deep-policy-dynamic-programming/framework.png
  alt: DPDP pipeline combining a learned heatmap with bounded dynamic programming search.
  caption: 'Figure 2: DPDP for TSP, from neural heatmap prediction through restricted dynamic-programming expansion.'
  source_url: https://arxiv.org/pdf/2102.11756
scope: specialist
paradigm: constructive
problem_families: [Routing]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem, Vehicle Routing Problem with Time Windows]
summary: DPDP uses a learned edge policy to prioritize states inside a bounded-width dynamic-programming search.
---

# Deep Policy Dynamic Programming for Vehicle Routing Problems

> **TL;DR:** DPDP combines neural edge heatmaps with dynamic-programming state dominance, keeping a bounded set of promising partial routes.

## Motivation

Neural construction is fast but myopic, while exact dynamic programming is prohibitively broad. Learned policy scores can prioritize states without discarding DP's feasibility and dominance structure.

## Contributions

- Integrates learned edge potentials into restricted dynamic programming.
- Uses state aggregation and dominance to remove redundant partial solutions.
- Applies the framework to TSP, CVRP, and VRPTW.

## Methodology

1. Predict edge scores for an instance. 2. Extend feasible DP states. 3. merge or dominate equivalent resource states. 4. Rank remaining states with learned scores and retain a bounded beam until completion.

## Experiments

- **Problems:** TSP, CVRP, and VRPTW on synthetic and benchmark instances.
- **Scale and budget:** Multiple widths are evaluated; larger DP beams improve quality while consuming more memory and time.
- **Baselines:** Neural beam search, attention policies, exact/heuristic solvers, and heatmap-guided methods.
- **Metrics:** Objective gap, runtime, and memory.
- **Main finding:** DP state management uses a given beam more effectively than sequence beam search, but strongest results require wider state sets.

## Limitations

### Reported by the Authors

- Memory remains the limiting resource as width and problem size grow.

### Curator Notes

- Each routing variant needs its own state, resources, dominance, and feasibility logic.

## Reproducibility

- **Official implementation:** [wouterkool/dpdp](https://github.com/wouterkool/dpdp)
- **Checkpoints:** Links are provided in the repository.
- **Main paper references:** DP formulation, policy-guided beam, and width/runtime tables.
