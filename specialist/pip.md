---
id: pip
short_title: "PIP/PIP-D"
title: "Learning to Handle Complex Constraints for Vehicle Routing Problems"
authors:
  - "Jieyi Bi"
  - "Yining Ma"
  - "Jianan Zhou"
  - "Wen Song"
  - "Zhiguang Cao"
  - "Yaoxin Wu"
  - "Jie Zhang"
year: 2024
date: 2024-10-28
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2024/hash/a9d2a5fd12d34250c21b5e4fa8d906b0-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2410.21066"
code_url: "https://github.com/jieyibi/PIP-constraint"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Vehicle Routing Problem with Time Windows"
  - "Orienteering Problem"
summary: "PIP and PIP-D learn proactive infeasibility prediction so constructive policies can handle routing constraints that cannot be enforced by a simple immediate mask."
figure:
  path: paper-assets/pip/framework.png
  alt: PIP-D architecture predicting future infeasibility while constructing constrained routes.
  caption: 'Figure 3: Proactive infeasibility-prediction framework used by PIP-D.'
  source_url: https://arxiv.org/pdf/2410.21066
---

# Learning to Handle Complex Constraints for Vehicle Routing Problems

> **TL;DR:** PIP and PIP-D learn proactive infeasibility prediction so constructive policies can handle routing constraints that cannot be enforced by a simple immediate mask.

## Motivation

For constraints such as time windows, an action can be locally feasible yet make every completion impossible, which standard step-wise masking cannot detect.

## Contributions

- Introduces **PIP/PIP-D** as a concrete neural routing method for Vehicle Routing Problem with Time Windows and Orienteering Problem.
- A preventative infeasibility predictor estimates whether candidate actions lead to dead ends; PIP-D distills or accelerates that signal for cheaper decoding.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Vehicle Routing Problem with Time Windows and Orienteering Problem.
2. A preventative infeasibility predictor estimates whether candidate actions lead to dead ends; PIP-D distills or accelerates that signal for cheaper decoding.
3. The policy constructs one route autoregressively, with optional augmentation or sampling reported separately from greedy performance.

## Experiments

- **Problems:** Vehicle Routing Problem with Time Windows; Orienteering Problem.
- **Scale and budget:** Experiments cover several complex constrained VRPs at standard 50- and 100-node scales and out-of-distribution constraint settings.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Look-ahead infeasibility prediction reduces dead ends and improves solution quality on constraints with delayed consequences.

## Limitations

### Reported by the Authors

- Predictor errors can reject useful actions or admit unrecoverable states, and each new constraint family requires suitable training data.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2024/hash/a9d2a5fd12d34250c21b5e4fa8d906b0-Abstract-Conference.html)
- **Preprint:** [arXiv:2410.21066](https://arxiv.org/abs/2410.21066)
- **Official implementation:** [repository](https://github.com/jieyibi/PIP-constraint)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
