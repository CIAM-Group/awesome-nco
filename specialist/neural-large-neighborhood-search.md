---
id: neural-large-neighborhood-search
short_title: NLNS
title: 'Neural Large Neighborhood Search for the Capacitated Vehicle Routing Problem'
authors:
  - André Hottung
  - Kevin Tierney
year: 2020
date: 2019-11-21
acceptance:
  date: "2020-01-15"
  source_url: "https://ecai2020.eu/call-for-papers/mainconference/"
venue: ECAI
paper_url: https://ebooks.iospress.nl/doi/10.3233/FAIA200283
arxiv_url: https://arxiv.org/abs/1911.09539
code_url: https://github.com/ahottung/NLNS
institutions:
  - Bielefeld University
figure:
  path: paper-assets/neural-large-neighborhood-search/framework.png
  alt: NLNS repair network attending over incomplete routes and feasibility features.
  caption: 'Figure 2: Neural repair network used inside large-neighborhood search.'
  source_url: https://arxiv.org/pdf/1911.09539
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - Capacitated Vehicle Routing Problem
summary: NLNS couples a learned repair policy with large-neighborhood destruction and repeated improvement for CVRP.
---

# Neural Large Neighborhood Search for the Capacitated Vehicle Routing Problem

> **TL;DR:** NLNS destroys part of a CVRP solution and uses a neural policy to reconstruct the missing customers inside a large-neighborhood-search loop.

## Motivation

Autoregressive constructors are fast but leave little opportunity to revise early routing choices. Large neighborhood search can revise substantial solution regions, yet its repair step is often hand engineered and computationally expensive.

## Contributions

- Learns a neural repair operator for partial CVRP solutions.
- Embeds that operator in repeated destroy-and-repair search.
- Adds instance-specific adaptation to improve performance on a single target instance.

## Methodology

1. Produce an initial feasible CVRP solution.
2. Remove a subset of customers according to a destruction rule.
3. Use a learned attention policy to reinsert removed customers while respecting capacity.
4. Accept improved solutions and repeat; optional active search adapts model parameters to the target instance.

## Experiments

- **Problems:** CVRP on synthetic distributions and established benchmark instances.
- **Scale and budget:** The paper evaluates multiple customer counts and reports results for fixed destroy-repair iteration or time budgets, including a more expensive active-search mode.
- **Baselines:** Neural construction methods, LNS variants, and classical CVRP heuristics.
- **Metrics:** Route cost, gap, and runtime.
- **Main finding:** Learned repair improves the LNS trajectory and active adaptation further closes gaps, at the cost of per-instance optimization time.

## Limitations

### Reported by the Authors

- Active search is substantially slower than a single forward pass.

### Curator Notes

- Destroy operators and acceptance logic remain manually specified.
- Results from different iteration or adaptation budgets are not directly interchangeable.

## Reproducibility

- **Official implementation:** [ahottung/NLNS](https://github.com/ahottung/NLNS)
- **Checkpoints:** See the official repository.
- **Main paper references:** Neural repair model, NLNS algorithm, and benchmark evaluation sections.
