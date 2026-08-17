---
id: constraint-tightness
short_title: "Constraint Tightness"
title: "Rethinking Neural Combinatorial Optimization for Vehicle Routing Problems with Different Constraint Tightness Degrees"
authors:
  - "Fu Luo"
  - "Yaoxin Wu"
  - "Zhi Zheng"
  - "Zhenkun Wang"
year: 2025
date: 2025-05-30
acceptance:
  date: "2025-09-18"
  source_url: "https://neurips.cc/Conferences/2025/CallForPapers"
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8fc784104e74f1b427865d30ad22931-Abstract-Conference.html"
code_url: "https://github.com/CIAM-Group/Rethinking_Constraint_Tightness"
arxiv_url: "https://arxiv.org/abs/2505.24627"
institutions:
  - "Southern University of Science and Technology"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
  - "Vehicle Routing Problem with Time Windows"
summary: "Constraint Tightness conditions neural routing decisions on how restrictive the active capacity or time-window constraints are."
figure:
  path: paper-assets/constraint-tightness/framework.png
  alt: Constraint-tightness-conditioned routing network with experts selected by a learned gate.
  caption: 'Figure 3: Routing architecture conditioned on instance-level constraint tightness.'
  source_url: https://arxiv.org/pdf/2505.24627
---

# Rethinking Neural Combinatorial Optimization for Vehicle Routing Problems with Different Constraint Tightness Degrees

> **TL;DR:** Constraint Tightness conditions neural routing decisions on how restrictive the active capacity or time-window constraints are.

## Motivation

Models trained at one constraint regime often fail when feasible regions become much tighter or looser even at the same graph size.

## Contributions

- Introduces **Constraint Tightness** as a concrete neural routing method for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
- The method represents instance-level tightness and injects it into encoding or decoding so the policy can modulate construction behavior.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem and Vehicle Routing Problem with Time Windows.
2. The method represents instance-level tightness and injects it into encoding or decoding so the policy can modulate construction behavior.
3. Inference is constructive with optional augmentation; reported comparisons stratify instances by tightness rather than only size.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows.
- **Scale and budget:** Experiments sweep constraint degrees across constrained VRPs and evaluate in-range and out-of-range generalization.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Explicit tightness awareness improves robustness across feasibility regimes.

## Limitations

### Reported by the Authors

- A scalar or handcrafted tightness descriptor may not capture interacting constraints in new problem families.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8fc784104e74f1b427865d30ad22931-Abstract-Conference.html)
- **Preprint:** [arXiv:2505.24627](https://arxiv.org/abs/2505.24627)
- **Official implementation:** [repository](https://github.com/CIAM-Group/Rethinking_Constraint_Tightness)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
