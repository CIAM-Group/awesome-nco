---
id: gensco
short_title: "GenSCO"
title: "Generation as Search Operator for Test-Time Scaling of Diffusion-Based Combinatorial Optimization"
authors:
  - "Yang Li"
  - "Lvda Chen"
  - "Haonan Wang"
  - "Runzhong Wang"
  - "Junchi Yan"
year: 2025
date: 2025-05-23
acceptance:
  date: "2025-09-18"
  source_url: "https://neurips.cc/Conferences/2025/CallForPapers"
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8e9869fa827226ff68db9290659a20c-Abstract-Conference.html"
code_url: "https://github.com/Thinklab-SJTU/GenSCO"
institutions:
  - "Shanghai Jiao Tong University"
scope: specialist
paradigm: constructive-improvement
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
summary: "GenSCO treats diffusion generation itself as a reusable search operator and scales test-time quality through repeated guided generation."
---

# Generation as Search Operator for Test-Time Scaling of Diffusion-Based Combinatorial Optimization

> **TL;DR:** GenSCO treats diffusion generation itself as a reusable search operator and scales test-time quality through repeated guided generation.

## Motivation

Independent diffusion samples do not exploit information from previously found solutions, leaving test-time compute poorly coordinated.

## Contributions

- Introduces **GenSCO** as a concrete neural routing method for Traveling Salesman Problem.
- The method conditions new diffusion trajectories on incumbent structure and alternates generation with selection or refinement.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem.
2. The method conditions new diffusion trajectories on incumbent structure and alternates generation with selection or refinement.
3. Number of generation rounds, samples per round, and optional local search jointly define the test-time scaling budget.

## Experiments

- **Problems:** Traveling Salesman Problem.
- **Scale and budget:** Experiments evaluate diffusion-based TSP solving over standard and large scales under increasing compute budgets.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Incumbent-guided generation converts extra inference compute into more consistent improvements than independent resampling.

## Limitations

### Reported by the Authors

- The method can be expensive at large budgets and depends on a capable pretrained diffusion model.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8e9869fa827226ff68db9290659a20c-Abstract-Conference.html)
- **Official implementation:** [repository](https://github.com/Thinklab-SJTU/GenSCO)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
