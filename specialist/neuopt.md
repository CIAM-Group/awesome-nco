---
id: neuopt
short_title: "NeuOpt"
title: "Learning to Search Feasible and Infeasible Regions of Routing Problems with Flexible Neural k-Opt"
authors:
  - "Yining Ma"
  - "Zhiguang Cao"
  - "Yeow Meng Chee"
year: 2023
date: 2023-10-27
venue: "NeurIPS"
paper_url: "https://proceedings.neurips.cc/paper_files/paper/2023/hash/9bae70d354793a95fa18751888cea07d-Abstract-Conference.html"
arxiv_url: "https://arxiv.org/abs/2310.18264"
code_url: "https://github.com/yining043/NeuOpt"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: improvement
problem_families:
  - Routing
problems:
  - "Traveling Salesman Problem"
  - "Capacitated Vehicle Routing Problem"
summary: "NeuOpt learns flexible k-opt moves and deliberately searches both feasible and infeasible regions to improve routing solutions."
figure:
  path: paper-assets/neuopt/framework.png
  alt: NeuOpt sequence of flexible k-opt transformations over a routing solution.
  caption: 'Figure 1: Flexible neural k-opt transformation used by NeuOpt.'
  source_url: https://arxiv.org/pdf/2310.18264
---

# Learning to Search Feasible and Infeasible Regions of Routing Problems with Flexible Neural k-Opt

> **TL;DR:** NeuOpt learns flexible k-opt moves and deliberately searches both feasible and infeasible regions to improve routing solutions.

## Motivation

Fixed 2-opt or 3-opt policies restrict the neighborhood, while always enforcing feasibility can prevent the search from crossing useful temporary violations.

## Contributions

- Introduces **NeuOpt** as a concrete neural routing method for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
- A Transformer policy selects variable-length edge exchanges, tracks constraint violations, and learns when to return from infeasible states to better feasible routes.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Traveling Salesman Problem and Capacitated Vehicle Routing Problem.
2. A Transformer policy selects variable-length edge exchanges, tracks constraint violations, and learns when to return from infeasible states to better feasible routes.
3. The policy is applied for a prescribed number of improvement steps; reported 1K and 10K-step settings represent different search budgets.

## Experiments

- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments study TSP and CVRP at common 20-, 50-, and 100-node training scales with larger and benchmark instances used to test transfer.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** Flexible moves and controlled infeasibility improve over fixed-neighborhood neural search under comparable iteration counts.

## Limitations

### Reported by the Authors

- Long improvement horizons are computationally expensive and performance is sensitive to the allowed move count and feasibility penalties.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2023/hash/9bae70d354793a95fa18751888cea07d-Abstract-Conference.html)
- **Preprint:** [arXiv:2310.18264](https://arxiv.org/abs/2310.18264)
- **Official implementation:** [repository](https://github.com/yining043/NeuOpt)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
