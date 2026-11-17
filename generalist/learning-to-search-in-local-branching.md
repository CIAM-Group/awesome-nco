---
id: learning-to-search-in-local-branching
short_title: Learned Local Branching
title: Learning to Search in Local Branching
authors:
- Defeng Liu
- Matteo Fischetti
- Andrea Lodi
year: 2022
date: '2022-06-28'
publication:
  date: '2022-06-28'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/20294
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/20294
institutions:
- Polytechnique Montréal
- University of Padova
- Jacobs Technion-Cornell Institute, Cornell Tech and Technion – IIT
scope: generalist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
- Graph Optimization
problems:
- Set Covering
- Maximum Independent Set
- Combinatorial Auction
- Generalized Independent Set
- Mixed Integer Linear Programming
summary: A shared GNN regressor initializes local-branching neighborhood size, while an SC-trained linear reinforcement
  policy adjusts it across MILP families; SCIP solves each neighborhood and supplies feasible improving incumbents.
code_url: https://github.com/pandat8/ML4LB
figure:
  path: paper-assets/learning-to-search-in-local-branching/framework.png
  alt: Objective and runtime change differently with the local-branching radius on set covering and independent
    set.
  caption: 'Original Figure 1 plots: instance-dependent neighborhood quality and search cost.'
  source_url: https://cdn.aaai.org/ojs/20294/20294-13-24307-1-2-20220628.pdf#page=2
---

# Learning to Search in Local Branching

> **TL;DR:** Learn the radius of a local-branching neighborhood rather than individual variable assignments. A shared GNN predicts its initial size and a compact reinforcement policy updates it during search. SCIP performs the neighborhood optimization; actual cross-family model reuse supports a generalist classification.

## Motivation

A small neighborhood is cheap to search but can miss substantial improvement; a large one may consume the available runtime. The best size depends on the MILP and the current incumbent. Repeatedly solving related instances offers data for learning that balance, including statistics from earlier neighborhood solves. [PDF pp. 1–3, Figure 1]

## Contributions

- Predicts a normalized first-iteration radius using a bipartite graph regressor.
- Adjusts subsequent radii with a linear REINFORCE policy over four actions.
- Combines both policies and evaluates shared models across set covering, independent set, auctions and unseen MILP collections.
- Retains a generic MILP solver as the component producing feasible solutions. [pp. 3–7]

## Methodology

Given a feasible incumbent, the local-branching constraint limits the Hamming distance over binary variables. An asymmetric alternative counts removed incumbent support entries. The paper assumes binary variables; its reference to general-integer extensions is not a demonstrated extension of these experiments. A complete left/right branching scheme can preserve exactness, while the evaluated application is a time-limited refinement heuristic. [pp. 2–3, Eqs. 1–8]

Offline labels approximate a useful initial radius through grid search over a tradeoff between scaled solve time and solution objective. The regressor predicts a fraction of k′, the incumbent's distance from the unconstrained LP solution. This scaling is a heuristic restriction motivated by whether the LB cut changes the LP optimum, rather than a theorem that globally best neighborhoods must have radius below k′. Variable/constraint feature embeddings exchange messages in two bipartite half-layers and pool to one scalar. [pp. 3–5, Eqs. 9–16, Algorithm 1]

The dynamic controller reads compact solver statistics and chooses increase, preserve, decrease or reset of the previous radius. Its reward multiplies objective improvement by remaining global time. REINFORCE trains a simple linear action model; SCIP searches the selected neighborhood, updates the incumbent and generates the next statistics. There is no approximation-ratio or learned-policy optimality theorem. [p. 5, Eqs. 17–18, Algorithm 2]

**Classification: Generalist / improvement.** The paper explicitly trains one regression model on mixed SC/MIS/CA instances and reuses it across those problems, larger variants, GISP and MIPLIB. The reinforcement policy is trained only on SC and evaluated across all families. The single-family `lb-sr` regressors are separate comparison models. Shared neural decisions control improvement of an existing feasible incumbent; this is not simply a shared architecture with independently trained task models. [pp. 6–7, Training and Evaluation / Broader Generalization]

## Experiments

Each SC/MIS/CA dataset has 200 instances split 70%/10%/20%. SC has 5,000 rows and 2,000 columns; MIS uses 1,000-node Barabási–Albert graphs; CA has 4,000 items and 2,000 bids. Forty doubled-size instances per family, 35 GISP instances and 29 selected binary MIPLIB instances test generalization. Runs start either from SCIP's first feasible solution or its root-node incumbent. Label search uses fraction resolution 0.01 and repeated neighborhood solves, an offline cost distinct from deployment. Metrics are average primal integral and final gap to optimal or best-known solutions. [pp. 5–7]

For first-solution SC, Table 1 gives primal integrals 56.641 for baseline LB and 2.874 for the hybrid; Table 2 gives final gaps 1136.74% and 1.15%. Larger SC has hybrid integral 2.424 versus baseline 59.306. On unseen GISP, hybrid first/root gaps are 9.44%/4.82%, versus 27.21%/20.65%. These compare LB variants using SCIP, not a claim to dominate all modern MILP solvers or all learned LNS methods. [p. 7, Tables 1–6]

The hybrid is not uniformly best. On root-initialized MIS its final gap is 0.23%, exceeding baseline 0.20% and `lb-sr`/`lb-rl` 0.18%. For MIPLIB, mixed regression alone has lower first-solution primal integral than the hybrid, 10.891 versus 11.655, and lower root final gap, 5.22% versus 6.22%. The eight-page conference text does not enumerate the hardware, full feature list, exact global budget or all training hyperparameters; the current repository's extended experiments are not silently substituted for these tables. [pp. 6–7]

## Limitations

An initial feasible solution and repeated SCIP subproblem solves are required. Reported quality depends on the incumbent, solver settings, neighborhood time allowance and best-known reference objective. Grid-search labels are approximate and expensive. The evaluation is limited to the selected binary MILP distributions and provides averages without a comprehensive seed-level uncertainty analysis. Cross-family evidence supports the stated shared models, not universal problem coverage or a solver-independent speed guarantee.

## Reproducibility

All eight formal pages, references, six tables, Figure 1, both algorithms and key equations were read, with original diagrams/tables visually checked. Publication is 2022-06-28 in the publisher-deposited record; no identified arXiv version was attached. Publisher HTML and institutional/OpenReview requests were unavailable locally, but the publisher CDN supplied the complete article. No separate scientific appendix is explicitly missing from the text.

The paper links the official ML4LB repository. Commit `5600ca019e7833312dcbb2a0b3a9b0599426fc7d` is dated 2026-11-11, before the cutoff. Its 1,508-member archive contains 1,407 files, 769 `.pth` files, customized Ecole and two vendor tutorial notebooks, with no PDF/TeX/video or separate scientific appendix. The notebook headings and markdown identify Ecole branching/configuration demonstrations, not additional experiments for this article. README, the shared evaluation loader and linear policy definition were inspected; weights were not deserialized.

The current README is titled **Revisiting local branching with a machine learning lens**, describes later extended sections, and requires unavailable >31 GB datasets by contact. Its current 60-second default, ten-second subproblem setting, 600/3600-second extended runs, SCIP 7.0.3 environment and newer hardware guidance are repository-version facts, not independently recovered AAAI experimental settings. The shared evaluation loader names a mixed SC/MIS/CA regressor and SC-trained RL policy for all dataset IDs, consistent with the conference's cross-family statement. No solver/training benchmark was executed.
