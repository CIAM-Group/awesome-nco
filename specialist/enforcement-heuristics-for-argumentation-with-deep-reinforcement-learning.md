---
id: enforcement-heuristics-for-argumentation-with-deep-reinforcement-learning
short_title: EGNN-Enforcement
title: Enforcement Heuristics for Argumentation with Deep Reinforcement Learning
authors:
- Dennis Craandijk
- Floris Bex
year: 2022
date: '2022-06-28'
publication:
  date: '2022-06-28'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/20497
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/20497
institutions:
- Netherlands Police
- Utrecht University
- Tilburg University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Optimization
problems:
- Argumentation Enforcement
- Minimum-Change Graph Editing
summary: A graph Q-network flips attack relations in complete argumentation frameworks, using symbolic acceptance
  verification to seek short enforcement edit sequences; solved-instance gains coexist with task-specific models
  and nontrivial optimality gaps.
code_url: https://github.com/DennisCraandijk/DL-abstract-argumentation
figure:
  path: paper-assets/enforcement-heuristics-for-argumentation-with-deep-reinforcement-learning/task.png
  alt: OriginalFigure2 shows the argumentationgraph afterremovingattack(a,b) tochangeenforcedacceptance.
  caption: OriginalFigure2/fullcaption illustratesanattackdeletion inthenativeenforcementtask.
  source_url: https://cdn.aaai.org/ojs/20497/20497-13-24510-1-2-20220628.pdf#page=3
---

# Enforcement Heuristics for Argumentation with Deep Reinforcement Learning

> **TL;DR:** EGNN learns to add or delete attack relations in an argumentation graph so that requested arguments/extensions become accepted. A symbolic verifier checks success; a graph Q-network guides the edits. It trades exact minimum-change guarantees for better solved-instance coverage on several difficult enforcement variants.

## Motivation

Dynamic argumentation asks how to change an attack graph while preserving its arguments and semantics. Exact reduction-based solvers can struggle on harder variants. EGNN learns edit decisions without requiring labels from an optimal enforcement solver, while retaining symbolic verification of the requested acceptance condition. [pp. 1–4]

## Contributions

- Express strict/non-strict extension enforcement and credulous/sceptical status enforcement as sequential graph-edit tasks.
- Predict Q-values for potential directed attack flips with a fully connected graph representation and mean/max/min/standard-deviation neighborhood aggregation.
- Evaluate learned heuristics across semantics, graph sizes and enforcement ratios, including variants without an available exact enforcement baseline at publication. [pp. 4–7]

## Methodology

The state is the current complete argumentation framework. An action flips one possible directed attack; the terminal state satisfies a requested argument/extension condition. The printed reward is zero at success and −1 otherwise, encouraging short edit trajectories. Edge features identify attacks, counter-attacks and previously flipped relations; node features mark requested acceptance/rejection. A message-passing network reads out one Q-value per possible edge. [Equations 1–4]

The collection classifies this as **specialist/improvement**: neural actions revise an existing complete graph, potentially revisiting relations, rather than outputting only a static acceptance prediction. Initial/intermediate graphs need not satisfy the requested enforcement goal. Models are trained for the selected task/semantics; a common EGNN architecture does not establish an unchanged checkpoint across all variants. [Experimental Setup; author README]

## Experiments

Training graphs contain 3–9 arguments and validation graphs contain ten. Evaluation covers 1000-instance sets at 10, 20 and 50 arguments. Instances come from several ICCMA graph generators and are checked for duplicates by graph isomorphism. The termination test uses the sound/complete µ-toksia argumentation solver. The comparison imposes a 15-minute limit and a maximum number of edit actions. Approximation ratios are reported only on instances solved within the limit. [pp. 5–6]

EGNN solves all listed ten- and twenty-argument settings. At 50 arguments it solves 945/1000 strict-preferred cases versus the symbolic solver's 880, and 1000/1000 credulous-stable cases versus 544. However, quality can be far from the exact minimum: the latter setting's ratio is **4.515**, and strict-preferred's ratio is **2.515**. Sceptical-stable enforcement still has two unsolved instances. Near-optimality on smaller sets therefore does not establish near-optimality everywhere. [Table 1]

For variants lacking an exact enforcement solver, the paper reports solved instances and edit counts but cannot measure an exact-reference approximation ratio. The separate runtime study samples 10,000 twenty-argument frameworks. Its selected comparisons illustrate effects of enforcement ratio; the paper explicitly cautions about Python/C++, GPU/CPU differences. [pp. 6–7; Figure 3]

## Limitations

The learned search has no universal minimum-edit or success guarantee. Rewards penalize action count, whereas the native optimization objective measures the final attack-set Hamming distance; repeated flips need not contribute distinct final edits. The full action space and message graph are quadratic in the number of arguments.

Training is independent of optimal edit labels, but depends on symbolic acceptance/extension verification at each step. Verification cost remains part of end-to-end solving. For the newly handled variants, similar edit counts to other tasks are suggestive rather than a measured optimality certificate. [pp. 4–7]

## Reproducibility

Read all **nine pages** of the [formal publisher PDF](https://cdn.aaai.org/ojs/20497/20497-13-24510-1-2-20220628.pdf), including all definitions, formulas, results and references; inspected all figures and Table 1. Original Figure 2 with its full caption illustrates an attack deletion, rather than an invented network architecture. The [AAAI publisher record](https://ojs.aaai.org/index.php/AAAI/article/view/20497) and DOI deposit identify the two authors, pages 5573–5581 and online publication **2022-06-28**. No same-identity arXiv version was established, so no preprint date/link is invented.

The [paper-linked code at the inspected commit](https://github.com/DennisCraandijk/DL-abstract-argumentation/tree/23955a08a1cfef72c67d9bac307720d25a9ecab6) has 1761 archive members. README separates this AAAI 2022 work from the repository's earlier IJCAI 2020 work and exposes task/semantics-specific training commands. The complete enforcement environment was checked: it flips existing graph relations, records history and invokes symbolic verification. Its nonterminal reward is normalized by the maximum episode length, unlike the printed −1. Vendor PDFs document Probo/Open-WBO and related solvers; their identities/paths distinguish them from a paper-specific scientific supplement. No additional scientific appendix is referenced or identified. No model training or benchmark reproduction was performed.
