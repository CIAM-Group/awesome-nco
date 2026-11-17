---
id: linsatnet
short_title: LinSATNet
title: 'LinSATNet: The Positive Linear Satisfiability Neural Networks'
authors:
- Runzhong Wang
- Yunhao Zhang
- Ziao Guo
- Tianyi Chen
- Xiaokang Yang
- Junchi Yan
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/wang23at.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/wang23at.html
institutions:
- Shanghai Jiao Tong University
- Shanghai AI Laboratory
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Differentiable Optimization
problems:
- Positive Linear Constraints
- TSP with Start/End Constraints
- TSP with Priority Constraints
- Partial Graph Matching
- Portfolio Optimization
summary: A parameter-free differentiable layer targets positive linear constraints
  via multi-set Sinkhorn; specialized task experiments and the general-coefficient
  convergence claim require separate interpretation.
code_url: https://github.com/Thinklab-SJTU/LinSATNet
figure:
  path: paper-assets/linsatnet/framework.png
  alt: The proposed LinSAT constraint-layer architecture.
  caption: 'Figure 1: The proposed use of LinSAT between unconstrained network outputs
    and positive linear constraints.'
  source_url: https://proceedings.mlr.press/v202/wang23at/wang23at.pdf
---

# LinSATNet: The Positive Linear Satisfiability Neural Networks

> **TL;DR:** LinSAT is a parameter-free differentiable constraint layer, illustrated with separately trained routing, matching and portfolio networks. It targets nonnegative-coefficient linear constraints on continuous outputs. Discrete applications still require decoding, and the printed general multi-set convergence claim needs qualification for unequal positive coefficients.

## Motivation

Neural predictions often need several packing, covering and equality constraints simultaneously. Penalties do not automatically produce feasible outputs; standard Sinkhorn primarily handles a single pair of row/column marginals. The paper extends this normalization approach to a broader intended family of constraints (Sections 1-3).

## Contributions

The proposed layer maps logits to variables in [0,1] under Ax<=b, Cx>=d and Ex=f, with nonnegative coefficients and right-hand sides. It converts constraints into marginal systems, adding slack/dummy variables for inequalities. Matrix/vector operations support automatic differentiation without trainable layer parameters.

This is principally a modeling-layer contribution with specialized application solvers. It is not a Boolean SAT solver or a joint routing/matching/portfolio checkpoint. The authors provide KL/L1 convergence arguments and an entropic optimization interpretation; the general joint-convergence interpretation is subject to the curator analysis below.

## Methodology

Logits and dummy values form a two-row matrix W, transformed through exp(W/tau). The proposed multi-set Sinkhorn alternates weighted row and column normalizations across constraint sets. The analysis assumes compatible marginal totals and a nonempty common feasible region. Exact automatic differentiation refers to the implemented sequence of arithmetic operations, not a guarantee that any finite iteration limit has reached the intended feasible projection.

For routing, a Transformer predicts a city-by-position matrix, LinSAT applies assignment/start/end/priority constraints to its continuous relaxation, and an unsupervised quadratic route-length loss trains the network. Beam search of width 2,048 produces discrete routes. For partial matching, an NGMv2 backbone is trained with permutation supervision, followed by LinSAT and Hungarian/top-phi decoding; the number of inliers phi is supplied. Portfolio experiments use separate LSTM or StemGNN networks and continuous allocations with sum-to-one and sector/preference constraints.

Small temperature can sharpen outputs but does not generally guarantee binary solutions. Positive linear polytopes can have fractional vertices, and the paper's own simple-rounding experiments retain infeasible cases. Continuous constraint satisfaction and feasible discrete decoding are separate requirements.

## Experiments

The routing experiment tests 10,000 uniformly sampled 20-city instances for each variant. Table 2 reports start/end route length 3.811 in 19 seconds and priority route length 3.943 in 18 seconds, compared with the modified Attention Model's 3.677/4.008 in 4m39s/4m43s. Standard TSP solvers reach 3.648 on the start/end reduction; thus the neural layer does not provide the best quality in every comparison. Direct quadratic-formulation Gurobi time limits differ from the stronger MTZ/reduction baselines and should not be conflated.

On Pascal VOC keypoint matching with unmatchable points, NGMv2-LinSAT reaches 61.2% mean F1 versus 60.7% for NGMv2 with Sinkhorn plus post-processing and 59.0% for partial BBGM. This assumes the inlier count, rather than estimating it end to end (Table 3). The linked ThinkMatch implementation also explicitly cautions against unrestricted comparisons with methods that estimate the match count.

Portfolio experiments use 494 assets, 2018-2020 training data and March-December 2021 tests, with 120 trading days of history to allocate for the following 120 days. The imposed preference assigns at least 50% to the specified six technology stocks. Table 4 gives Sharpe ratios 2.27 for LSTM-LinSAT and 2.42 for StemGNN-LinSAT, versus 2.08/2.00 for their two-stage Gurobi variants. These are results of that historical protocol and preference, not a general financial-performance guarantee.

Appendix C.4 distinguishes layer outputs from decoding. At tau=0.1, simple threshold rounding is feasible on only 1.19%/1.52% of the routing instances; beam search reaches 100% in the tested set. Smaller temperatures improve direct-rounding feasibility but do not reach 100% in the listed settings, and quality is reported only on feasible outputs. Beam search accounts for about 87% of routing inference time. LinSAT itself accounts for 81.4% of matching and 79.9% of portfolio inference time (Appendix G).

## Limitations

The intended constraints require nonnegative coefficients and compatible feasible systems. Iteration limits, numerical conditioning and temperature matter; the current README advises monitoring violations. The layer does not guarantee optimization of the downstream objective, discrete integrality, or removal of post-processing. The main routing table uses 2s/10s quadratic Gurobi limits while Appendix E.2 says 2s/20s; this discrepancy is not silently resolved.

### Curator Analysis of General Multi-set Convergence

The printed joint-convergence interpretation does not follow for arbitrary unequal positive coefficients. Consider Algorithm 2 with an all-ones 2-by-2 score matrix, u1=(1,1), v1=(1,1), u2=(1,2), v2=(1.8,1.2). A strictly positive common feasible matrix exists: Z has rows (0.2,0.8) and (0.8,0.2). Nevertheless, the normalized initialization has every entry 0.5. The first marginal set leaves it unchanged; the second produces identical columns (0.6,0.4); the next first-set update resets it to 0.5. The iterates cycle and do not jointly satisfy both sets.

Theorem 3.2's literal statement about obtaining a small divergence for a current marginal is weaker: this example already has zero error for the first set at initialization, so it does not refute that literal statement. It does invalidate upgrading such a statement to joint feasibility or the general Equation 11 solver interpretation without additional conditions. Appendix B's Equation 32 changes the marginal-dependent potential from eta to eta-prime without a valid identity in this example: its left side is approximately -0.0405465 while its displayed right side is zero.

The same two-equality input was also tested with the current public dense, ungrouped v1/v2 kernels: at 10, 100 and 1,000 iterations both return approximately (0.6,0.6), with equality residual (0.2,0), despite feasible (0.2,0.8). This test concerns those exact code paths and coefficients; grouped/sparse kernels and the paper's application experiments were not rerun. The routing, matching and portfolio demonstrations largely use binary membership coefficients, so the general-coefficient counterexample must not be recast as evidence that every reported demonstration fails.

## Reproducibility

- [ICML 2023 proceedings](https://proceedings.mlr.press/v202/wang23at.html), PMLR 202:36605-36625: all 21 pages were read, including references and Appendices A-G. Official HTML publication metadata supports July 3, 2023, separately from the July 23-29 conference dates.
- The publisher lists PDF/OpenReview, with no separate supplement. Both API versions for forum `D2Oaj7v9YJ` returned 403; the complete scientific appendices are integrated in the read PDF and no explicitly missing attachment was identified.
- The [official repository](https://github.com/Thinklab-SJTU/LinSATNet), inspected at `bf4a44a6b0f5aa241dfb1a623426c573378e9aa2`, has 34 files and no separate PDF/ZIP. README, application instructions, constraint initialization and dense v1/v2 kernels were read. Its current default is an improved grouped v2 mode; TSP instructions pin an older package version. Matching implementation is linked through [ThinkMatch/LinSAT](https://github.com/Thinklab-SJTU/ThinkMatch/tree/master/models/LinSAT).
- Eight key mathematical/result pages and the existing source-derived framework figure were visually checked. The two minimal calculation scripts and tested code revision are retained in the review cache. Full training and application results were not reproduced; 18 exact existing-paper citations are recorded.
