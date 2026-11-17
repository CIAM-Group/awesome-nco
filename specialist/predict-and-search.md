---
id: predict-and-search
short_title: Predict-and-Search
title: A GNN-Guided Predict-and-Search Framework for Mixed-Integer Linear Programming
authors:
- Qingyu Han
- Linxin Yang
- Qian Chen
- Xiang Zhou
- Dong Zhang
- Akang Wang
- Ruoyu Sun
- Xiaodong Luo
year: 2023
date: '2023-02-11'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=pHMpgT5xWaE
venue: ICLR
paper_url: https://openreview.net/forum?id=pHMpgT5xWaE
institutions:
- Shenzhen Research Institute of Big Data
- Shandong University
- The Chinese University of Hong Kong, Shenzhen
- Huawei
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2302.05636
paradigm: constructive-improvement
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Task-specific GNN marginals define one-shot binary-variable neighborhoods for conventional MILP search,
  with exact set-containment guarantees limited to the restricted subproblem.
code_url: https://github.com/sribdcn/Predict-and-Search_MILP_method
---

# A GNN-Guided Predict-and-Search Framework for Mixed-Integer Linear Programming

> **TL;DR:** Predict binary-variable marginals from collected feasible solutions, then solve the original problem within a Hamming neighborhood around a confident partial assignment. The neighborhood is more flexible than fixing those same variables, but its exact subproblem optimum and finite-time solver performance are different guarantees.

## Motivation

Repeated related MILPs provide reusable statistical structure. Directly fixing predicted variables can exclude good solutions or make a subproblem infeasible, while collecting only proven optima for supervision is costly. This framework uses ordinary feasible solutions for training and allows limited disagreement with predictions during search (Sections 1–3).

## Contributions

- Objective-weighted feasible-solution pools provide soft marginal targets for a bipartite GNN.
- A solver searches a single neighborhood of a predicted partial assignment, rather than irrevocably fixing every selected variable.
- Separate models for balanced item placement, workload appointment, independent set and combinatorial auction are compared with SCIP/Gurobi and adapted neural-diving baselines.

## Methodology

**Training distribution.** Single-thread Gurobi collects feasible solutions during up to 3,600 seconds per training instance. A solution receives weight proportional to exp(−cᵀx) over that collected pool. The theoretical energy assigns zero mass to infeasible solutions; the finite pool only approximates the feasible distribution and need not contain a proven optimum. Under a factorized Bernoulli model, weighted solution log-likelihood becomes binary cross-entropy against each variable's weighted marginal. This derivation does not establish that variables in the true feasible distribution are independent or that the rounded marginal vector is feasible (Sections 3.1; Appendix B).

**Graph model.** Variables and constraints form a coefficient-linked bipartite graph. A 64-dimensional embedding, layer normalization, variable→constraint→variable half-convolutions and a two-layer output MLP/sigmoid produce probabilities. Features include objective/constraint statistics, variable type and a twelve-bit variable-order encoding; the latter can distinguish otherwise symmetric variables but depends on input ordering. Unlike dynamic branching features, these features do not require an LP presolve (Section 4; Appendices A/E).

**Search decision.** Select k₀ lowest-probability variables as predicted zero and k₁ highest-probability variables as predicted one. Append a constraint limiting the number of disagreements on this selected index set to Δ; unselected variables and continuous variables remain free subject to original constraints. Solve this restricted original MILP once. It is inspired by trust-region/local-branching ideas, not an iterative trust-region convergence algorithm. Although the title uses general MILP, the studied discrete variables are binary; general-integer MIPLIB instances are explicitly outside the work's scope (Sections 2.1, 3.2, 5.2; Algorithm 1).

**What Proposition 1 proves.** For the same predicted partial assignment, Δ≥0 gives a feasible region containing the region obtained by fixing every selected variable (Δ=0). Consequently, exact minimization over the neighborhood has objective no worse than exact minimization over that fixing region, when these values are well-defined. It does not prove the neighborhood contains a global original-problem optimum, that the neighborhood is nonempty, that search succeeds within a budget, or that a larger region is faster. The paper's closeness-to-optimum argument is empirical/hypothetical; a high-weight optimum in a solution pool does not mathematically force every marginal rounding to be close to it (Section 3.2/Proposition 1; Appendices C–D).

## Experiments

**Data and training.** Each of four datasets has 400 instances split 240/60/100 for training/validation/test. Models train separately with Adam, learning rate 0.003 and batch eight. IP and WA originate from ML4CO2021 generators; IS and CA use Ecole generators. Maximum sizes include 61,000 variables/64,480 constraints for WA, with 1,000 binary variables. This supports mixed binary/continuous models, not arbitrary general-integer decisions (Section 4; Appendix F).

**Budgets and metrics.** Evaluation uses two Xeon Gold 5117 CPUs, 256 GB RAM and two V100 GPUs, SCIP 8.0.1, Gurobi 9.5.2 and PyTorch 1.10.2. Primal-focused solver runs receive 1,000 seconds. BKS is a single-thread 3,600-second Gurobi incumbent, updated by better evaluated solutions. Absolute/relative gaps measure distance to this best-known feasible value, not a certified optimum unless independently established. Reaching BKS in IS is therefore not itself proof of original optimality. Offline solution collection/training is additional work (Sections 4–5).

**Headline result and exceptions.** At 1,000 seconds, Table 1 reports mean absolute-gap reductions of 51.1% against SCIP and 9.9% against Gurobi, averaging the four task-level relative reductions. These are not runtime reductions or percentage-point changes in objective quality. SCIP gains range from 3.5% on CA to 90% on IS. Against Gurobi, IP becomes worse: gap 0.63→0.69, a −9.5% gain; IS ties at reported zero gap; WA improves 6.7% and CA 43.2%. The headline average must retain these task-specific negatives/ties (Table 1; Figure 2).

**Comparison limits.** The neural-diving baseline is an author reimplementation because original detailed settings/code were unavailable. It is checked on NNV, with SCIP presolve disabled after the authors observed feasibility-assertion issues, and compared with predict-and-search on IP and IS. Suitable WA/CA training settings were not found within the authors' compute budget, so no four-task neural-diving superiority claim follows. A confidence-threshold fixing baseline is also modified to use a tunable number of selected variables. Some early WA/CA curves favor fixing before neighborhood search catches up, consistent with the absence of a finite-time dominance theorem (Section 5.2; Appendix D/Figure 5).

**Manual search parameters.** k₀/k₁ and Δ vary by task and solver: e.g. IP selects 400 zeros/five ones with Δ=1 for SCIP versus Δ=10 for Gurobi; CA selects 400 zeros for SCIP versus 600 for Gurobi. These selected neighborhoods are configuration choices, not automatically inferred calibrated radii. Perturbation studies use a selected WA instance and cannot establish universal sensitivity bounds (Appendices C/G).

## Limitations

### Discussed in the Paper

Experiments focus on binary discrete variables. The work depends on collected feasible solution pools and repeated related instances. Original neural-diving replication and comparisons are limited by unavailable details and computational resources; only two task families enter that comparison (Sections 2.1, 5.2).

### Curator Notes

Specialist classification follows separate per-task models/configurations; a generic MILP input format does not demonstrate unchanged weights across the four native tasks. Restricted-region exactness and original-problem optimality must be kept separate. Arbitrarily imperfect predictions can still exclude all feasible solutions or the global optimum, and no adaptive fallback to a full solve is established by the one-shot algorithm. Input ordering, empirical pool coverage and manually selected radii can affect transfer.

The released Gurobi test script currently has an unexpected indentation at its IP-feature branch and replaces extracted edge features with ones, whereas the paper describes coefficient edge features. It also sets a 1,000-second solver limit after graph extraction/prediction. These are reproduction details requiring attention, rather than evidence that the published results used exactly those current repository lines or measured complete end-to-end time.

## Reproducibility

- **Publication/version:** [official ICLR 2023 listing/poster](https://iclr.cc/virtual/2023/poster/11194); [OpenReview](https://openreview.net/forum?id=pHMpgT5xWaE). This audit reads all fourteen pages of [arXiv v4, 6 March 2023](https://arxiv.org/abs/2302.05636v4), whose accepted-paper header, eight authors and title match. A fresh explicit-v4 PDF download exactly matches the cached SHA-256. The first arXiv date is 11 February; neither it nor the v4 revision is asserted to be the formal publication date.
- **Scientific material:** all integrated Appendices A–G, reference pages, mathematical proposition, result curves and tables were read. Normal OpenReview forum/API checks require browser verification. Official conference listing and author-code recursive document inventory were checked; no extra scientific document beyond the integrated appendices was identified.
- **Code:** [official repository](https://github.com/sribdcn/Predict-and-Search_MILP_method) provides data-generation, per-task training, pretrained-model/test paths and solver scripts. README requirements include Python 3.8.13, PyTorch 1.10.2, PySCIPOpt 4.2, Gurobi 9.5.2 and PyG 2.0.4. README and dataset documentation were read; current script details above should be checked before rerunning experiments.
- **Citation graph:** five exact existing catalogue papers have explicit body citations and matching bibliography entries; absent Ding/Nair/Khalil works are not replaced with similarly named papers.
