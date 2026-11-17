---
id: learning-to-improve
short_title: L2I
title: A Learning-based Iterative Method for Solving Vehicle Routing Problems
authors:
- Hao Lu
- Xingwen Zhang
- Shuang Yang
year: 2020
date: '2020'
venue: ICLR
paper_url: https://openreview.net/forum?id=BJe1334YDH
code_url: https://github.com/rlopt/l2i
institutions:
- Princeton University
- Ant Financial Services Group
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Traveling Salesman Problem
summary: A neural selector chooses classical improvement operators while rules handle perturbation; six policies
  search feasible incumbents, with CVRP and appendix TSP results under substantial per-policy budgets.
publication:
  date: '2020'
  source_url: https://iclr.cc/virtual_2020/poster_BJe1334YDH.html
figure:
  path: paper-assets/learning-to-improve/framework.png
  alt: Original L2I policy network combining current solution and instance features with recent actions/effects
    to choose operator probabilities.
  caption: 'Figure 6: Neural improvement-operator selector; perturbation control is separate and rule based.'
  source_url: https://openreview.net/pdf?id=BJe1334YDH#page=13
---

# A Learning-based Iterative Method for Solving Vehicle Routing Problems

> **TL;DR:** A neural policy selects classical improvement-operator variants, while rules trigger and choose perturbations. Six policies search from feasible starts and return their best incumbent. CVRP results and an appendix TSP study are reported; the old note's split-delivery VRP claim is unsupported.

## Motivation

Neural constructors can generate routes quickly but historically trailed strong classical heuristics in the compared literature. L2I combines routing-specific local operators with a learned operator selector, rather than learning every move or constructing a route directly (PDF pp. 1-4).

## Contributions

- Separates learned improvement selection from rule-based perturbation/restart.
- Encodes the instance, current routes and recent actions/effects for operator choice.
- Uses six history-conditioned policies and studies search budget, operator usage, perturbation strength, size transfer and distribution changes.

## Methodology

Start with a random feasible solution. After six consecutive non-improving steps, perturb selected routes using hand-designed destruction/reconstruction operators and resume improvement. Current solutions may worsen during perturbation; the returned best incumbent is retained. The policy chooses an operator variant, not customer positions or arbitrary learned continuous move parameters. Table 5 includes intra-route 2-opt/exchange/relocate and inter-route cross, reverse-cross, exchanges, relocations and cyclic moves (PDF pp. 3-5,12).

Demand, remaining capacity, customer/neighbour coordinates and distances pass through a 64-dimensional embedding and one eight-head attention layer. Concatenate recent actions and binary effects, then apply two fully connected layers to obtain action probabilities. REINFORCE trains the selector, with a myopic improve/not-improve reward or an iteration-level baseline-relative reward, no discounting, and 0.05 random-action exploration. Six policies use history lengths 1-6 (PDF pp. 4-5,11,13).

## Experiments

Main CVRP tests use 20/50/100 customers, unit-square locations, demands 1-9 and capacities 20/30/40. Reported means generally cover 2,000 instances. The default is 40,000 rollout steps **per instance and policy**, counting improvement and perturbation; the ensemble takes the best of six policies. Its work must not be treated as one policy's 40,000 steps. Nodes have a Tesla T4 GPU, while complete comparative hardware/resource accounting is not supplied (PDF pp. 6-7).

Table 1 gives L2I lengths 6.12/10.35/15.57 versus LKH3 6.14/10.38/15.65. Its caption explicitly compares results reported in the literature. These numbers do not establish paired-instance, equal-budget superiority over a fully specified contemporary LKH configuration. Figure 3 explores budget effects; six-policy best-of benefits and per-policy step counts must remain distinct (PDF pp. 6-7).

Randomly permuting two routes is markedly better than perturbing every route in the shown example. Appendix D adapts the code to single-route TSP and shows size-100 costs slightly above its 7.76 reference; same-checkpoint CVRP-to-TSP transfer is not established. Appendix E adds CVRP200/1000, with only 200 test instances for size 1000, and uses capacity 50 despite describing settings as the same as size 100. Figure 8 labels time in minutes but does not fully specify comparative limits/aggregation at every scale (PDF pp. 8,12-14).

Appendix F tests changed depot/customer distributions and larger-trained models on smaller CVRPs. Its distribution ratios divide by the **best achieved value within each distribution**, not a certified optimum. No SDVRP experiment appears in the fifteen-page source; VRPTW, MIS and graph coloring are future directions (PDF pp. 9,14-15).

## Limitations

The method depends on a rich handcrafted operator pool, restart rules and large search budgets. Finite training/search does not certify optimality. The printed Appendix A IP is not a complete ready-to-copy exact model: degree equalities with the stated `K=N` require an unused-vehicle convention, and diagonal/incompatible-arc exclusions are not separately shown. This qualifies the printed formulation, not a claim that the actual operator implementation violates feasibility. This remains a specialist improvement method; the appendix's code adaptation does not prove a single shared cross-task model.

## Reproducibility

- **Read source:** all fifteen pages, including all 34 references and complete Appendices A-F. All main/appendix tables and plots were visually checked. Complete original Figure 6 is extracted from PDF page 13.
- **Publication:** official ICLR 2020 virtual poster confirms title/authors. Correct first author **Hao Lu**, with Princeton and Ant Financial Services Group affiliations. The old exact submission/acceptance dates lacked a verified paper-specific source; publication is recorded at year-level 2020.
- **Version/supplements:** the blocked OpenReview PDF was recovered from the public Conference_2020-2025 mirror; actual retrieval URL/hash are registered. The published-as-ICLR header and byline match the official record; byte identity to the inaccessible original is not asserted. All identified scientific appendices are included. The official page has Abstract/Paper/Reviews; normal OpenReview attachment inventory remains challenged, with no separately missing scientific attachment identified.
- **Code:** the current author repository is accessible, despite the paper's conditional-release footnote. README, both Python modules and relevant embedding/policy/reward/default sections were checked. Current defaults use 20,000 rollout steps and history zero, while the main experiment uses 40,000 and histories 1-6. The four-file release provides no trained six-policy checkpoints or complete experiment recipe. No optimization experiment was rerun.
- **Relations:** eight exact internal citations are retained from text and bibliography, including Deudon and Li's guided graph-tree search; unrelated branching or resource-management papers are not substituted.
