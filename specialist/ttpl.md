---
id: ttpl
short_title: "TTPL"
title: "Improving Generalization of Neural Combinatorial Optimization for Vehicle Routing Problems via Test-Time Projection Learning"
authors:
  - "Yuanyao Chen"
  - "Rongsheng Chen"
  - "Fu Luo"
  - "Zhenkun Wang"
year: 2025
date: 2025-06-03
acceptance:
  date: "2025-09-18"
  source_url: "https://neurips.cc/Conferences/2025/CallForPapers"
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/6edd46d69ef91f4555d67f7b321d6902-Abstract-Conference.html"
code_url: "https://github.com/CIAM-Group/TTPL"
arxiv_url: "https://arxiv.org/abs/2506.02392"
institutions:
  - "Southern University of Science and Technology"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "TTPL adapts a routing policy at test time by projecting shifted instances or representations back toward the training manifold."
figure:
  path: paper-assets/ttpl/framework.png
  alt: TTPL test-time projection loop using an LLM-guided program population and routing feedback.
  caption: 'Figure 2: Test-time projection and policy-adaptation workflow of TTPL.'
  source_url: https://arxiv.org/pdf/2506.02392
---

# Improving Generalization of Neural Combinatorial Optimization for Vehicle Routing Problems via Test-Time Projection Learning

> **TL;DR:** TTPL adapts a routing policy at test time by projecting shifted instances or representations back toward the training manifold.

## Motivation

Scale and coordinate-distribution shifts move test instances outside the feature region in which the pretrained decoder is calibrated.

## Contributions

- Introduces **TTPL** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A lightweight projection module is optimized or selected at test time to align target-instance features before construction.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A lightweight projection module is optimized or selected at test time to align target-instance features before construction.
3. Projection updates add an adaptation budget before greedy or augmented decoding and must be counted in total runtime.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** The study evaluates TSP and CVRP across scale, distribution, and public benchmark shifts.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Test-time alignment improves zero-shot generalization without retraining the full solver.

## Limitations

### Reported by the Authors

- The method needs target-specific optimization and its projection objective may not correlate with routing quality under novel shifts.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2025/hash/6edd46d69ef91f4555d67f7b321d6902-Abstract-Conference.html)
- **Preprint:** [arXiv:2506.02392](https://arxiv.org/abs/2506.02392)
- **Official implementation:** [repository](https://github.com/CIAM-Group/TTPL)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
