---
id: combining-reinforcement-learning-and-constraint-programming-for-combinatorial-optimiza
short_title: CP–RL via Dynamic Programming
title: Combining Reinforcement Learning and Constraint Programming for Combinatorial Optimization
authors:
- Quentin Cappart
- Thierry Moisan
- Louis-Martin Rousseau
- Isabeau Prémont-Schwarz
- Andre A. Cire
year: 2021
date: '2020-06-02'
publication:
  date: '2021-05-18'
  source_url: https://doi.org/10.1609/aaai.v35i5.16484
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v35i5.16484
institutions:
- Polytechnique Montréal
- Element AI
- University of Toronto Scarborough
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Resource Allocation
problems:
- TSPTW
- Four-Moment Portfolio Selection
- 0–1 Knapsack
summary: DQN/PPO guide CP value selection through a shared DP formulation; search provides conditional guarantees,
  while task/size-specific models and strong knapsack solver negatives limit generality.
arxiv_url: https://arxiv.org/abs/2006.01610
code_url: https://github.com/qcappart/hybrid-cp-rl-solver
figure:
  path: paper-assets/combining-reinforcement-learning-and-constraint-programming-for-combinatorial-optimiza/framework.png
  alt: Original framework linking DP, RL learning and CP solving.
  caption: Original Figure 1 and complete caption from the formal AAAI 2021 paper.
  source_url: https://cdn.aaai.org/ojs/16484/16484-13-19978-1-2-20210518.pdf#page=2
---

# Combining Reinforcement Learning and Constraint Programming for Combinatorial Optimization

> **TL;DR:** Learn value-selection heuristics with DQN or PPO, then use them inside constraint-programming search. A dynamic-programming model supplies both the RL environment and the CP encoding. Feasibility and eventual optimality come from the correctly encoded search procedure, rather than a neural prediction.

## Motivation

Standalone neural construction can produce a solution quickly but does not systematically certify optimality. CP provides propagation and complete search, yet its branching choices strongly affect runtime. The paper connects both through a common dynamic-programming representation. [Formal pp. 1–2]

## Contributions

- Translate a DP model into an RL environment and a CP model with validity and dominance conditions.
- Use learned values or probabilities in branch-and-bound, iterative limited discrepancy search and restart-based search.
- Evaluate TSP with time windows, four-moment portfolio selection and 0–1 knapsack, including unfavorable comparisons with conventional solvers. [Formal pp. 2–9]

## Methodology

An RL state combines the problem instance and the current DP state. Actions assign the next variable in a fixed order, with validity/dominance rules excluding unsuitable choices. Transitions follow the DP recurrence. The formal reward is an affine transformation designed to preserve the preference between completed solutions and discourage incomplete trajectories. DQN predicts action values; PPO supplies action probabilities. Graph or set encoders accommodate different instance sizes. [Formal pp. 2–4]

The CP model encodes successive states, actions, feasibility and the objective. BaB-DQN and ILDS-DQN order values using the learned Q function; RBS-PPO samples a value order for repeated searches. A cache avoids repeated network evaluations for previously encountered states. The theoretical completeness/optimality statements require a valid CP model, sound pruning and sufficient search time. They do not mean every time-limited run returns a certificate. [Formal pp. 4–5]

This is **specialist/constructive** under the repository's checkpoint-based definition: tasks and instance sizes use separately trained models. A common framework is not one shared checkpoint across these problems. CP's classical incumbent search also does not establish a neural policy that edits complete incumbent solutions. The portfolio variants differ in whether objective coefficients are continuous or floored; their item-selection variables remain discrete. [Formal pp. 4–8]

## Experiments

Each model receives 48 hours of training with 32 GB RAM and one V100 GPU. The best saved checkpoint is selected on 100 validation instances; testing uses 100 instances and a 60-minute search limit on a Xeon E5-2650 machine. Training is performed once per model, so these are not repeated-training uncertainty estimates. [Formal p. 6]

For 100-city TSPTW, standalone DQN succeeds on none of the instances and PPO on 21%, while cached BaB-DQN and ILDS-DQN each find feasible solutions on all instances, proving optimality on 91% and 90%, respectively. RBS-PPO finds solutions on all and proves 11%. Reported search times average only completed searches, and gap comparisons are reported only where all instances have solutions, relative to the best solutions found by the compared methods. Those denominators differ from an unconditional runtime average or a global-optimum certificate. [Formal Table 1]

Caching reduces the reported value-selection overhead from about 34 ms to 0.16 ms; the nearest-neighbor CP heuristic takes about 0.004 ms. For 100-item portfolio instances with continuous objective coefficients, KNITRO obtains 2683.55 against RBS-PPO's 2674.96; in the discrete-coefficient variant, RBS-PPO obtains 2679.57 against KNITRO's 2635.15. The hybrids do not dominate every solver or formulation. [Formal pp. 6–8; Tables 2–3]

Knapsack tests use 50, 100 and 200 items with uncorrelated, weakly correlated and strongly correlated weights/profits. COIN-OR reaches zero gap and proves every tested optimum in all nine settings. The hybrids and ordinary CP always reach the time limit; none of the other methods proves optimality for every instance in any configuration. At 200 items, RBS-PPO's easy/hard gaps are 0.11/0.28 versus PPO's 0.37/0.80, but its medium gap is **0.90 versus PPO's 0.80**. [Formal Table 4; recovered author-source KNAP section]

## Limitations

Training assumes sufficient data or a generator matching the target distribution. Fixed variable ordering, repeated neural evaluation and Python/C++ binding overhead constrain scalability. Synthetic cases do not establish performance on industrial deployments. [Formal pp. 8–9]

Version-specific details are retained: the formal paper uses set/graph encoders and adds KNAP results; the earlier uncompiled KNAP source describes a DeepSet architecture. Formal Table 3 simultaneously prints 100% proven optimality and a timeout for CP-model at size 20 despite its completed-search timing convention. The recovered KNAP hyperparameter table literally prints a PPO learning rate of **2** for 200 items, outside its own listed search range. These are source inconsistencies, not values silently repaired by this note. The author's reward-order assertions are reported under their stated bounds and assumptions; this review does not independently certify all proof steps. [Formal Table 3; recovered author-source pp. 3–5]

## Reproducibility

Read all **11 formal pages** and **20 compiled arXiv v1 pages**, including appendices A–F and complete bibliographies. The required reward definitions and KNAP details were absent from those compiled appendices. They were subsequently found in the **original arXiv v1 source**: commented lines 614–671 and lines 1079–1229 after the end-of-document marker in `main_iclr2020.tex`. These sections were rendered locally and all **nine rendered pages** were read, including the provenance cover and repeated bibliography; scientific pages 2–5 were visually checked. The resulting 40 registered pages contain overlapping versions and curator material, not 40 unique publisher pages.

The recovered source supplies the reward properties and KNAP DP, instance generator, eight input features, architecture, tuning table and complete results. It is author material from 2020, **not a separately issued publisher supplement**; unresolved original bibliography keys/cross-references and version differences remain documented in the render provenance. This closes the previously recorded material gap, and the resolved deferral history is retained.

The official repository was inspected at tree `9e2faa0d3fcff52aa2bd232964583fd5335ce80e` (136 entries), including its complete README and scientific-attachment inventory. Its documented tasks are TSPTW and portfolio; this review does not claim the inspected release includes the formal KNAP implementation. Formal publication metadata confirms the five authors, AAAI 2021, pages 3677–3687 and publication date **2021-05-18**. The arXiv v1 date is **2020-06-02**. Original formal Figure 1 and its complete caption were inspected. No training or benchmark was executed.
