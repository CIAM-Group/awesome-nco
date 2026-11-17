---
id: synthesis-of-search-heuristics-for-temporal-planning-via-reinforcement-learning
short_title: RL Temporal Planning
title: Synthesis of Search Heuristics for Temporal Planning via Reinforcement Learning
authors:
- Andrea Micheli
- Alessandro Valentini
year: 2021
date: '2021-05-18'
publication:
  date: '2021-05-18'
  source_url: https://doi.org/10.1609/aaai.v35i13.17413
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v35i13.17413
institutions:
- Fondazione Bruno Kessler
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Combinatorial Search
- Scheduling
problems:
- Temporal Planning
summary: Domain-specific value learning guides TAMER temporal search, improving coverage on bounded scheduling and
  kitting instances with longer plans and mixed training-duration effects.
code_url: https://es-static.fbk.eu/people/amicheli/resources/prl20
figure:
  path: paper-assets/synthesis-of-search-heuristics-for-temporal-planning-via-reinforcement-learning/framework.png
  alt: Original Figure2 five-branch temporal-state value network.
  caption: Original Figure2 and full caption from the author manuscript.
  source_url: https://andrea.micheli.website/papers/learning-heuristics-prl.pdf#page=4
---

# Synthesis of Search Heuristics for Temporal Planning via Reinforcement Learning

> **TL;DR:** Learn a domain-specific value function through simulated temporal planning, then transform it into a heuristic for TAMER search. The combination improves coverage on two bounded domains, with longer plans and non-monotonic training gains. It is **specialist/constructive**.

## Motivation

Temporal planning must order events and schedule duration/precedence constraints. Hand-designed heuristics can struggle with industrial domains containing intermediate conditions/effects. This work learns search guidance from problem instances and simulator interaction rather than supplied solution plans. [pp. 1–2]

## Contributions

- Formulate a finite, bounded-object set of temporal planning problems as an MDP.
- Relate an ideal optimal value function to distance-to-go under the paper's terminal-reward convention.
- Train a neural approximation and integrate a clipped heuristic into symbolic temporal search.
- Compare search, a learned policy alone and their combination with ten-fold evaluation. [Sections 2–6]

## Methodology

TAMER states include true predicates, active durative conditions, an agenda of future events, a Simple Temporal Network and the last scheduled time point. Grounding is padded to a known object bound. Fluents, actions, constants, goals and a fixed-length temporal summary enter five 100-unit ReLU branches, followed by a 100-unit ReLU layer and scalar SoftSign value. [Definitions 2.1–2.8; Algorithm 2; Figure 2]

Training favors less-often-solved instances and uses heuristic-biased exploration, replay and deterministic successor-based value updates. Terminal success/dead-end rewards are 1/−1; small first-achieved-subgoal rewards provide additional shaping. A piecewise logarithmic transformation clips positive predictions, maps zero to a depth constant and reserves a larger finite range for negative values. Learned negative values do not justify sound dead-end pruning. TAMER combines this estimate with path cost for search; the network does not edit complete incumbent plans. [Algorithms 1/3; Sections 3/4]

The ideal-value proof is not a guarantee that a function approximator trained with shaping and finite-depth exploration is admissible or optimal. Each domain receives its own bounded representation and networks. Sharing a framework across domains does not establish a shared trained generalist solver. [Theorem 3.1; Sections 4/6]

## Experiments

The two domains are mobile-agent job-shop scheduling (MAJSP, 770 generated instances) and warehouse kitting (1092 stated generated instances). Ten-fold cross-validation uses domain-specific models, with 600-second/20-GB planning limits on a Xeon E5-2620. Defaults are gamma 0.99, replay memory 50000, replay batch 1000, exploration depth 140, heuristic depth 1200 and search weight 0.8. Training runs to 100000 episodes. [Section 6]

For MAJSP, learned-heuristic search solves **744 instances at 50000 episodes**, falling to **708 at 100000**, versus symbolic TAMER's 560; average plan lengths are 18 versus 14. At 100000 episodes, the learned policy alone solves 699, with average length 20. More training is not uniformly better. [Figure 3]

For kitting, 100000-episode learned search solves 1015 versus symbolic TAMER's 395; average plan lengths are 21 versus 15. The policy alone solves 896. The displayed table evaluates ten folds of 109, or **1090 instances**, leaving a discrepancy with the prose's 1092 generated count; these figures are preserved separately. Average plan lengths are measured on each method's solved subset, so they are not a paired optimality comparison. Input ablations show domain-dependent redundancy between goals and constants. [Figures 4/5]

## Limitations

The method requires a finite training set and a known object bound. Separate per-domain models and fixed-size grounding restrict transfer. Self-overlapping copies of the same ground action are excluded. The network's temporal summary is compressed; classical search retains the full temporal checks. Increased coverage does not imply shortest plans, and learned-policy execution alone can fail without backtracking. The ideal value-distance relation does not certify learned heuristic accuracy. [Sections 2–4/7]

## Reproducibility

Read all **nine pages of the author-hosted manuscript**, complete 27-reference bibliography, Algorithms 1–3, all tables/plots and three contact sheets; inspected original Figure 2/full caption. Primary DOI metadata confirms two FBK authors, AAAI2021, pages 11895–11902 and publication **2021-05-18**. The nine-page author layout is not asserted byte-identical to the eight-page formal layout.

The [author's experiment page](https://es-static.fbk.eu/people/amicheli/resources/prl20) supplies `PRL2020.zip`: 1951 archived entries with benchmark instances, trained networks and a GNU/Linux TAMER executable. The full README and file inventory were checked; no additional scientific PDF, TeX or notebook was identified. The README labels use as reviewer inspection only; availability of this artifact does not establish an unrestricted source-code release. No executable, training, saved network or benchmark was run.
