---
id: nds
short_title: "NDS"
title: "Neural Deconstruction Search for Vehicle Routing Problems"
authors:
  - "Andre Hottung"
  - "Paula Wong-Chung"
  - "Kevin Tierney"
year: 2025
date: 2025-01-07
acceptance:
  date: "2025-05-05"
  source_url: "https://openreview.net/forum?id=bCmEP1Ltwq"
venue: "TMLR"
paper_url: "https://openreview.net/forum?id=bCmEP1Ltwq"
arxiv_url: "https://arxiv.org/abs/2501.03715"
code_url: "https://github.com/ahottung/NDS"
institutions:
  - "TU Dortmund University"
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Vehicle Routing Problem with Time Windows"
summary: "NDS learns which parts of a route to remove and delegates rebuilding to a simple greedy insertion heuristic."
figure:
  path: paper-assets/nds/framework.png
  alt: NDS autoregressive customer-removal policy followed by sequential greedy insertion.
  caption: 'Figure 1: Neural destruction followed by greedy route reconstruction in NDS.'
  source_url: https://arxiv.org/pdf/2501.03715
---

# Neural Deconstruction Search for Vehicle Routing Problems

> **TL;DR:** NDS learns which parts of a route to remove and delegates rebuilding to a simple greedy insertion heuristic.

## Motivation

Neural construction must learn every decision, whereas classical insertion is already effective once the right elements are removed.

## Contributions

- Introduces **NDS** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
- A policy deconstructs the incumbent solution, a deterministic heuristic reinserts removed customers, and accepted solutions seed the next iteration.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
2. A policy deconstructs the incumbent solution, a deterministic heuristic reinserts removed customers, and accepted solutions seed the next iteration.
3. The number of deconstruction rounds and parallel candidates defines search cost; the method is not a one-shot decoder.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows.
- **Scale and budget:** The TMLR evaluation covers three challenging VRP variants, several scales, and established operations-research baselines.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Combining learned removal with transparent repair matches or exceeds strong baselines in reported settings.

## Limitations

### Reported by the Authors

- Search quality depends on the hand-designed insertion rule and repeated iterations, and requires an initial route.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [TMLR](https://openreview.net/forum?id=bCmEP1Ltwq)
- **Preprint:** [arXiv:2501.03715](https://arxiv.org/abs/2501.03715)
- **Official implementation:** [repository](https://github.com/ahottung/NDS)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
