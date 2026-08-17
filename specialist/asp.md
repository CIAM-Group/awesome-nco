---
id: asp
short_title: "ASP"
title: "ASP: Learn a Universal Neural Solver!"
authors:
  - "Chenguang Wang"
  - "Zhouliang Yu"
  - "Stephen McAleer"
  - "Tianshu Yu"
  - "Yaodong Yang"
year: 2024
date: 2023-03-01
acceptance:
  date: "2024"
  source_url: "https://doi.org/10.1109/TPAMI.2024.3352096"
venue: "IEEE TPAMI"
paper_url: "https://doi.org/10.1109/TPAMI.2024.3352096"
arxiv_url: "https://arxiv.org/abs/2303.00466"
code_url: "https://github.com/LOGO-CUHKSZ/ASP"
institutions:
  - "Peking University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "ASP learns an adaptive solver policy that transfers algorithmic behavior across instance distributions while retaining problem-specific training."
figure:
  path: paper-assets/asp/framework.png
  alt: ASP pipeline alternating distributional exploration and persistent scale adaptation.
  caption: 'Figure 1: ASP training pipeline for distributional exploration and persistent scale adaptation.'
  source_url: https://arxiv.org/pdf/2303.00466
---

# ASP: Learn a Universal Neural Solver!

> **TL;DR:** ASP learns an adaptive solver policy that transfers algorithmic behavior across instance distributions while retaining problem-specific training.

## Motivation

A single fixed policy can overfit one generator, whereas manually selecting a solver or training regime for every distribution is expensive.

## Contributions

- Introduces **ASP** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- The framework maintains a population or portfolio of solver behaviors and learns how to adapt or select them for the current instance distribution.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. The framework maintains a population or portfolio of solver behaviors and learns how to adapt or select them for the current instance distribution.
3. Evaluation includes adaptive search and multiple candidate policies; the portfolio size and adaptation rounds are part of compute.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** The final journal version studies several combinatorial settings and broad distribution shifts with specialist models for each problem.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Adaptive solver selection improves robustness across instances relative to one static policy.

## Limitations

### Reported by the Authors

- Despite the universal framing, the experiments do not establish one checkpoint that handles unrelated problem definitions without problem-specific setup.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IEEE TPAMI](https://doi.org/10.1109/TPAMI.2024.3352096)
- **Preprint:** [arXiv:2303.00466](https://arxiv.org/abs/2303.00466)
- **Official implementation:** [repository](https://github.com/LOGO-CUHKSZ/ASP)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
