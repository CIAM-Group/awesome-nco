---
id: sym-nco
short_title: Sym-NCO
title: 'Sym-NCO: Leveraging Symmetricity for Neural Combinatorial Optimization'
authors: [Minsu Kim, Junyoung Park, Jinkyoo Park]
year: 2022
date: 2022-05-26
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/0cddb777d3441326544e21b67f41bdc8-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2205.13209
code_url: https://github.com/alstn12088/Sym-NCO
institutions: [Korea Advanced Institute of Science and Technology]
figure:
  path: paper-assets/sym-nco/framework.png
  alt: Sym-NCO architecture applying transformed instances and symmetric solutions around a shared encoder-decoder.
  caption: 'Figure 3: Overview of Sym-NCO problem and solution symmetry training.'
  source_url: https://arxiv.org/pdf/2205.13209
scope: specialist
paradigm: constructive
problem_families: [Routing]
problems: [Traveling Salesman Problem, Capacitated Vehicle Routing Problem, Prize Collecting Traveling Salesman Problem, Orienteering Problem]
summary: Sym-NCO regularizes neural routing policies with problem and solution symmetries during reinforcement learning.
---

# Sym-NCO: Leveraging Symmetricity for Neural Combinatorial Optimization

> **TL;DR:** Sym-NCO teaches a base routing policy to agree across equivalent transformed instances and equivalent solution representations.

## Motivation

Geometric transformations and cyclic/reversal solution representations preserve routing objectives, yet ordinary policy gradients do not enforce consistent behavior across them.

## Contributions

- Distinguishes problem symmetry from solution symmetry.
- Adds invariant representation and symmetric solution losses to existing DRL-NCO backbones.
- Tests the training scheme on four routing tasks and several architectures.

## Methodology

1. Generate symmetric transformations of each instance. 2. sample multiple equivalent trajectories. 3. optimize the routing reward together with representation and solution-symmetry regularizers. 4. decode with the selected base model and augmentation budget.

## Experiments

- **Problems:** TSP, CVRP, PCTSP, and OP, mainly at 20/50/100-node scales.
- **Baselines:** PointerNet, AM, POMO, and classical task solvers.
- **Metrics:** Objective/gap and runtime.
- **Main finding:** Symmetry regularization consistently strengthens the tested DRL backbones; reported best results combine it with POMO-style multiple rollouts.

## Limitations

### Reported by the Authors

- Useful transformations and equivalent solution definitions must be known for each problem.

### Curator Notes

- The contribution is a training scheme; it does not create a shared cross-problem checkpoint.

## Reproducibility

- **Official implementation:** [alstn12088/Sym-NCO](https://github.com/alstn12088/Sym-NCO)
- **Checkpoints:** See the official repository.
- **Main paper references:** Section 3, Tables 1–4, and Appendix C.
