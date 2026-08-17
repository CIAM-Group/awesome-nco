---
id: matrix-encoding-networks
short_title: MatNet
title: 'Matrix Encoding Networks for Neural Combinatorial Optimization'
authors: [Yeong-Dae Kwon, Jinho Choo, Iljoo Yoon, Minah Park, Duwon Park, Youngjune Gwon]
year: 2021
date: 2021-06-21
acceptance:
  date: "2021-09-28"
  source_url: "https://neurips.cc/Conferences/2021/CallForPapers"
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/29539ed932d32f1c56324cded92c07c2-Abstract.html
arxiv_url: https://arxiv.org/abs/2106.11113
code_url: https://github.com/yd-kwon/MatNet
institutions: [Samsung SDS]
figure:
  path: paper-assets/matrix-encoding-networks/framework.png
  alt: MatNet cross-attention architecture and mixed-score attention over a relation matrix.
  caption: 'Figure 2: MatNet architecture and its mixed-score attention mechanism.'
  source_url: https://arxiv.org/pdf/2106.11113
scope: specialist
paradigm: constructive
problem_families: [Routing, Scheduling]
problems: [Asymmetric Traveling Salesman Problem, Flexible Flow Shop Problem]
summary: MatNet encodes matrix-valued relations between two item sets and supports autoregressive solvers for ATSP and flexible flow shop scheduling.
---

# Matrix Encoding Networks for Neural Combinatorial Optimization

> **TL;DR:** MatNet replaces coordinate-centric graph encoding with cross-attention over rows and columns of a problem-defining matrix.

## Motivation

Many neural CO encoders assume node features and symmetric geometric edges. ATSP costs and machine-job processing times are naturally matrices connecting two roles, which calls for an encoder that preserves this structure.

## Contributions

- Introduces a matrix encoder with alternating row-to-column and column-to-row attention.
- Builds end-to-end RL solvers for ATSP and flexible flow shop scheduling.
- Evaluates size generalization for matrix inputs.

## Methodology

1. Initialize embeddings for the two item sets. 2. Use matrix entries as attention compatibility information in alternating cross-attention layers. 3. Decode a problem-specific sequence with POMO-style policy optimization. 4. Select the best rollout under the stated augmentation budget.

## Experiments

- **Problems:** ATSP and three-stage FFSP; main learned models cover sizes 20, 50, and 100, with additional FFSP size tests.
- **Baselines:** Exact/OR methods, metaheuristics, and adapted neural attention solvers.
- **Metrics:** Tour cost or makespan, gap, and runtime.
- **Main finding:** Matrix-aware encoding enables strong end-to-end results on the two asymmetric relation problems; strongest numbers use multiple rollouts and augmentation.

## Limitations

### Reported by the Authors

- The paper validates two matrix-form problem families rather than a universal matrix interface.

### Curator Notes

- ATSP and FFSP still use distinct decoders and training runs.

## Reproducibility

- **Official implementation:** [yd-kwon/MatNet](https://github.com/yd-kwon/MatNet)
- **Checkpoints:** ATSP checkpoints and linked FFSP models are documented by the authors.
- **Main paper references:** Sections 3–5 and appendix generalization experiments.
