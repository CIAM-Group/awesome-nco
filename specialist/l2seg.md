---
id: l2seg
short_title: "L2Seg"
title: "Learning to Segment for Vehicle Routing Problems"
authors:
  - "Wenbin Ouyang"
  - "Sirui Li"
  - "Yining Ma"
  - "Cathy Wu"
year: 2026
date: 2025-06-22
acceptance:
  date: "2026-01-25"
  source_url: "https://iclr.cc/Conferences/2026/Dates"
venue: "ICLR"
paper_url: "https://proceedings.iclr.cc/paper_files/paper/2026/hash/f274af80a7a3aa9ed23ba6f7908470bc-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2507.01037"
institutions:
  - "Massachusetts Institute of Technology"
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
summary: "L2Seg learns route segmentation boundaries so large VRP solutions can be improved through coordinated segment-level operations."
figure:
  path: paper-assets/l2seg/framework.png
  alt: L2Seg framework splitting routes into segments and applying coordinated segment-level improvements.
  caption: 'Figure 2: Route segmentation and segment-level reconstruction workflow of L2Seg.'
  source_url: https://arxiv.org/pdf/2507.01037
---

# Learning to Segment for Vehicle Routing Problems

> **TL;DR:** L2Seg learns route segmentation boundaries so large VRP solutions can be improved through coordinated segment-level operations.

## Motivation

Node-level neighborhoods become too expensive and myopic on long routes, while fixed segments ignore instance-specific structure.

## Contributions

- Introduces **L2Seg** as a concrete neural routing method for Capacitated Vehicle Routing Problem.
- A learned policy partitions incumbent routes into meaningful segments and applies segment-level reordering or reconstruction.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem.
2. A learned policy partitions incumbent routes into meaningful segments and applies segment-level reordering or reconstruction.
3. Improvement rounds and segment candidates define the inference budget; the accepted ICLR version reports these alongside runtime.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments cover CVRP across multiple scales and compare learned segmentation with node-level and fixed-window search.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Adaptive segments enlarge the effective neighborhood while keeping action selection tractable.

## Limitations

### Reported by the Authors

- The method requires an incumbent solution and errors in segmentation can exclude useful cross-boundary moves.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [ICLR](https://proceedings.iclr.cc/paper_files/paper/2026/hash/f274af80a7a3aa9ed23ba6f7908470bc-Abstract-Conference.html)
- **Preprint:** [arXiv:2507.01037](https://arxiv.org/abs/2507.01037)
- **Official implementation:** No author-maintained repository was confirmed at curation time.
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
