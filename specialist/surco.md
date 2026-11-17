---
id: surco
short_title: SurCo
title: 'SurCo: Learning Linear SURrogates for COmbinatorial Nonlinear Optimization
  Problems'
authors:
- Aaron M Ferber
- Taoan Huang
- Daochen Zha
- Martin Schubert
- Benoit Steiner
- Bistra Dilkina
- Yuandong Tian
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/ferber23a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/ferber23a.html
institutions:
- University of Southern California
- Rice University
- Meta FAIR
- Anthropic
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Constrained Design
- Integer Programming
problems:
- Nonlinear CO
- Embedding Sharding
- Photonic Design
- Route Planning
summary: SurCo optimizes or predicts linear surrogate costs for existing feasible-set
  solvers, using differentiable nonlinear objectives with instance-specific, offline
  and hybrid variants.
code_url: https://github.com/facebookresearch/SurCo
---

# SurCo: Learning Linear SURrogates for COmbinatorial Nonlinear Optimization Problems

> **TL;DR:** Learn linear objective coefficients so an existing combinatorial solver produces useful solutions for a differentiable nonlinear objective. SurCo-zero adapts coefficients per instance, SurCo-prior predicts them from offline training, and SurCo-hybrid refines that prediction. Feasibility comes from the inner solver; nonlinear global optimality is not guaranteed.

## Motivation

Many practical design problems combine discrete constraints with objectives that are expensive, nonlinear or supplied by a simulator. Strong linear-cost solvers can handle the constraints but cannot directly encode every such objective. SurCo searches the space of linear costs, using an existing solver to maintain combinatorial structure rather than predicting a possibly infeasible decision vector directly (Sections 1-3).

## Contributions

The three variants trade offline learning and deployment-time optimization. Zero requires the instance objective and gradient; prior trains a model over a problem distribution and needs only its predicted costs plus the feasible-set solver at test time; hybrid pays both offline training and instance refinement costs. Models and solver choices are specialized to their domains. This is a specialist method framework, not a shared sharding/photonic/routing checkpoint.

The theoretical discussion motivates predicting costs rather than discontinuous discrete solutions. It provides nearest-neighbor covering arguments and a statement that a finite-Lipschitz map cannot turn a domain into more mutually separated connected output components. These are not convergence or sample-complexity guarantees for the trained SurCo networks.

## Methodology

SurCo-zero minimizes f(g_Omega(c)), where g_Omega solves a linear objective over the required feasible region. Solver-gradient wrappers or differentiable relaxations propagate a useful update to c. The ordinary discrete argmin is generally piecewise constant; these wrappers must not be described as an everywhere exact classical derivative. Assumption 2.1 requires the nonlinear objective and its partial derivatives to be available, possibly through a learned differentiable cost model whose fitting is outside the main framework.

SurCo-prior predicts costs c(y;theta) from an instance description and trains through the solver against the nonlinear objective, without optimal-solution labels. Hybrid initializes from those costs before further per-instance updates. The method relies on the inner solver returning a feasible solution, and linear objectives favor exposed vertices; a nonlinear optimum at an interior integer point may be inaccessible. Binary settings help with this restriction but do not provide global optimization guarantees.

Embedding-table experiments backpropagate through an LP relaxation with CVXPYLayers and solve the integer problem with SCIP at inference. Photonic design and stochastic routing use black-box differentiation with perturbed solver calls. Thus the actual training/inference oracle differs by application.

## Experiments

Embedding sharding assigns 10-60 tables to four homogeneous devices with 5GB limits, using 50 training and 50 test instances for each size. The objective is estimated longest-device latency from a differentiable DreamShard cost model. Figure 2 reports lower predicted latency for zero than its heuristic baselines, and stronger hybrid results at additional offline cost. Prior helps more on smaller cases; zero can outperform prior on larger ones. The solver-runtime axis is distinct from the latency objective; these are not direct end-to-end measured deployment-latency guarantees.

Inverse photonics includes four fabrication-constrained device families, with 25 training and 25 test instances each. The binary filled/void grids must be representable by a 3-by-3 cross brush; resolutions range from 40-by-40 to 80-by-80. Optimization stops at zero specification loss or 200 steps. Zero matches or improves the reported success rate of the pass-through baseline, prior offers much faster deployment at a similar success rate, and hybrid obtains the strongest success rates with both training and refinement costs. A plotted zero design loss denotes meeting the simulated specification, not proof of global optimality (Figures 3-5; Appendix B).

Nonlinear routing maximizes on-time arrival probability under the stated Gaussian travel-time model, using a 5-by-5 grid and 25 parameter draws at three deadlines. SurCo-zero learns edge costs for Bellman-Ford using the Gaussian objective gradient. Figure 7 reports improvements over the tested mean/variance heuristic and results comparable to a 30-minute SCIP baseline; that baseline times out, so it is not an optimality certificate. Appendix D's high per-variable prediction accuracies still produce zero feasible solutions for several direct-prediction baselines, illustrating the difference between prediction accuracy and joint feasibility.

## Limitations

The nonlinear objective/gradient and a suitable feasible-set oracle are prerequisites. Inner-solver costs, training costs, relaxation error and cost-model error matter. An estimated-latency win need not imply the same gain under actual hardware measurements. Hybrid results include test-instance adaptation; they should not be compared as pure zero-shot inference. Generalization and convergence guarantees remain future work.

### Curator Notes

The illustrative two-dimensional example on page 5 does not match its printed conclusion: the stated feasible triangle includes (0,0), and its nonnegative squared objective is minimized there for every instance parameter. The printed positive linear surrogate also selects the origin. Consequently that example, as written, does not demonstrate the claimed switch between the other two vertices. This local example issue does not refute the separate connected-image/Lipschitz statement or the empirical method.

The inspected public routing script also requires care for baseline reproduction. It creates the SCIP objective variable without an explicit negative lower bound, while the represented Gaussian z-score can be negative. In the tight-deadline case T=0.9 times the minimum-mean path, every feasible path has negative z-score, so a nonnegative objective-variable bound excludes such paths. The no-solution branch also uses a result variable before assigning the current result. These are observations about the cited code revision, not proof that the published Figure 7 used that revision.

## Reproducibility

- [ICML 2023 proceedings](https://proceedings.mlr.press/v202/ferber23a.html), PMLR 202:10034-10052: all 19 pages were read, including the complete bibliography and Appendices A-D. Official HTML supports the retained July 3 publication date. Eight key proof/result/architecture pages were visually inspected.
- [Official code](https://github.com/facebookresearch/SurCo), inspected at `5825a906915d87e99ea2272cb015803d153a5fc6`, has 21 files and no separate scientific PDF/ZIP/video. README and the entire 409-line routing script were read. Its defaults use a 10-by-10 grid and a different mean range from the paper; photonic implementation is absent from that tree and its README section repeats other-domain commands. The code link is added, with these practical limits.
- The publisher lists no separate supplement. Both OpenReview API versions for `sSwN4NrzZr` returned 403; the project-site URL redirects to a Google Drive sign-in page. The complete scientific appendices are already integrated in the read PDF, with no explicitly missing scientific attachment identified.
- No experiments, optimizers or hardware simulations were rerun. 9 exact existing-paper citations are registered with explicit body and bibliography locators.
