---
id: learning-to-optimize-variational-quantum-circuits-to-solve-combinatorial-problems
short_title: Learning QAOA Parameters
title: Learning to Optimize Variational Quantum Circuits to Solve Combinatorial Problems
authors:
- Sami Khairy
- Ruslan Shaydulin
- Lukasz Cincio
- Yuri Alexeev
- Prasanna Balaprakash
year: 2020
date: '2019-11-25'
publication:
  date: '2020-04-03'
  source_url: https://doi.org/10.1609/aaai.v34i03.5616
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v34i03.5616
institutions:
- Illinois Institute of Technology
- Clemson University
- Los Alamos National Laboratory
- Argonne National Laboratory
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Max-Cut
summary: PPO learns continuous QAOA updates for hybrid Max-Cut optimization; reported neural inference adds Nelder–Mead,
  while the largest gap reduction comes from a separate non-neural KDE method.
arxiv_url: https://arxiv.org/abs/1911.11071
figure:
  path: paper-assets/learning-to-optimize-variational-quantum-circuits-to-solve-combinatorial-problems/framework.png
  alt: Original Figure3 PPO training, learned trajectories and KDE parameter density.
  caption: Original Figure3, all subcaptions and full caption from the formal AAAI2020 paper.
  source_url: https://cdn.aaai.org/ojs/5616/5616-13-8841-1-10-20200512.pdf#page=7
---

# Learning to Optimize Variational Quantum Circuits to Solve Combinatorial Problems

> **TL;DR:** Learn continuous QAOA parameter updates with PPO, or sample promising parameters with non-neural KDE, to support quantum–classical Max-Cut optimization. The neural benchmark uses **RL followed by Nelder–Mead**. The headline 30.15× gap reduction belongs to **KDE**, not the neural policy.

## Motivation

QAOA repeatedly calls a classical optimizer to choose circuit parameters. Treating every graph as an unrelated optimization can waste costly circuit evaluations. This work amortizes parameter search across small training graphs and tests larger graphs. [Sections 1–3]

## Contributions

- Cast QAOA parameter updates as a reinforcement-learning task.
- Learn a second, non-neural distribution of high-quality parameters using KDE.
- Compare both approaches with derivative-free optimizers and random sampling under a fixed query budget. [Sections 4/5]

## Methodology

The policy observes four historical differences in objective values and circuit parameters, and outputs a continuous update to the 2p QAOA angles. Actor and critic each use two 64-unit hidden layers with Tanh activations. PPO uses objective improvement as reward; training circulates through graphs, normalizes rewards and uses a Gaussian policy, whose mean is used at test time. [Section 4.1]

KDE separately fits a Gaussian-kernel mixture to high-quality parameter sets collected by extensive classical searches, retaining points with at least the stated 99% training optimality ratio. It is **not a neural network**. Both approaches support a hybrid Max-Cut process whose discrete outcomes come from QAOA measurement; neural updates are to continuous circuit parameters, not edits of complete binary cut assignments. Only Max-Cut is evaluated. Transfer across graph classes/sizes does not establish a cross-problem generalist checkpoint, so the entry is **specialist/constructive**. [Sections 2/4]

## Experiments

The AAAI setup trains on seven eight-vertex graphs and tests 94 graphs from random, ladder, barbell and caveman classes. Circuit depths are 1, 2 and 4. Qiskit Aer simulations omit hardware error while objective estimates still have measurement sampling noise. Each optimizer receives ten attempts of **192 circuit evaluations**. The reported neural strategy spends 96 on RL updates and 96 on Nelder–Mead refinement. [Table 1; Section 5]

The displayed optimality ratio uses the **largest objective observed across optimizers/restarts at the same depth** as its reference, not a certified global optimum. A separate approximation-ratio figure compares expected objective with a brute-force classical optimum. These two denominators should not be conflated. [Figures 4/5]

The maximum 30.15× median gap reduction relative to Nelder–Mead is KDE on ladder graphs at depth two. The neural hybrid's largest table factor is **5.59×**, with smaller gains such as 1.05× for community graphs at depth four. Random sampling is competitive, and learned RL performance degrades with depth more strongly than KDE. Claimed approximately 200-second quantum runtime is a projection from an assumed one second per call, not a hardware timing measurement. [Table 2; Section 5]

The referenced earlier pure-RL workshop study uses **one training graph and 97 test graphs**, distinguishes RL from RLNM, and does not find pure RL uniformly better than Nelder–Mead at depth four. Its up-to-8.61× hybrid result is a different protocol and is not substituted for the AAAI results. [Companion Sections 3/4]

## Limitations

These small simulated experiments do not demonstrate quantum computational advantage or globally optimal QAOA parameters. Offline RL training and extensive KDE sample generation are outside the test query budget. Fixed-depth angle dimensions and Max-Cut-only experiments limit generality. The displayed positive-coefficient spin maximization in Equation 3 does not express cut maximization with its stated positive edge weights; the PPO clip limits are also printed in reversed order. These source-level discrepancies are preserved as reproducibility caveats, without asserting that unpublished implementation followed the misprints or that experiments were independently reproduced. [Equations 3/7; Sections 4/5]

## Reproducibility

Read all **nine formal pages**, **ten arXiv v1 pages**, and all **seven pages of the explicitly referenced pure-RL companion**, including complete bibliographies. All contact sheets, key equations, figures, tables and original formal Figure 3/full caption/subcaptions were inspected. These 26 registered reading-copy pages include overlapping versions.

Primary DOI metadata confirms five authors, AAAI2020, pages 2367–2375 and publication **2020-04-03**. The main arXiv v1 is dated **2019-11-25**; the companion is a distinct 2019 workshop work, arXiv1911.04574v1 dated November 11. No separate necessary scientific appendix or official code repository was identified in the inspected sources. No quantum hardware, simulator, training or benchmark was run for this review.
