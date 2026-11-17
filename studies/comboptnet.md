---
id: comboptnet
short_title: CombOptNet
title: 'CombOptNet: Fit the Right NP-Hard Problem by Learning Integer Programming Constraints'
authors:
- Anselm Paulus
- Michal Rolínek
- Vít Musil
- Brandon Amos
- Georg Martius
year: 2021
date: '2021-05-05'
publication:
  date: '2021-07-01'
  source_url: https://proceedings.mlr.press/v139/paulus21a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v139/paulus21a.html
arxiv_url: https://arxiv.org/abs/2105.02343
code_url: https://github.com/martius-lab/CombOptNet
institutions:
- Max Planck Institute for Intelligent Systems
- Masaryk University
- Facebook AI Research
scope: study
paper_type: analysis
problem_families:
- Differentiable Optimization
problems:
- Integer Programming Layer
- Keypoint Matching
summary: An integer-program layer learns both objective coefficients and constraints end to end.
---

# CombOptNet: Fit the Right NP-Hard Problem by Learning Integer Programming Constraints

> **TL;DR:** An exact ILP solver forms the forward layer, while a geometric surrogate backward pass trains objective coefficients and constraints from solution losses. CombOptNet is a reusable modeling layer; experiments train separate models and retain the conventional solver's computational cost.

## Motivation

Cost-only differentiable optimization layers require the combinatorial constraints to be specified in advance. Learning a constraint system could instead infer which discrete problem is appropriate for observed solutions or raw inputs. Ordinary differentiation fails because the optimal integer solution is piecewise constant and constraints can matter without being tight, unlike a typical LP vertex description.

## Contributions

- Provides a surrogate backward pass for the bounded ILP `min c*y` subject to `A*y <= b`, covering both objective and constraint parameters.
- Decomposes incoming solution gradients into nearby integer directions, then uses distances to constraint hyperplanes to construct informative updates.
- Demonstrates constraint recovery, weighted set covering, text-described knapsack and visual keypoint matching, with explicit ablations and runtime analysis in the separate supplement.

## Methodology

The forward pass invokes an unmodified ILP solver and stores its solution. The backward construction sorts the magnitudes of the incoming gradient and expresses it as a nonnegative combination of signed integer directions. Proposition 1 establishes this decomposition through successive differences of the sorted magnitudes; its complete induction proof is in the supplement.

For each proposed neighboring integer target, a piecewise mismatch function measures hyperplane distances. If a different target is feasible, moving a nearby constraint can make the current solution less favorable; if it is infeasible, violated constraints receive a signal that can enlarge feasibility toward the target. The resulting surrogate updates are recombined with the decomposition weights. A soft minimum lets several nearby constraints move, with temperature 0.5 in the principal experiments. Constraints are parameterized by normals, distances and learnable local origins to facilitate rotations.

This is a constructed learning signal, not the ordinary nonzero derivative of an integer argmin. Supplementary Proposition S1 justifies the descent-direction interpretation when the underlying mapping and loss are differentiable; it does not prove global learning convergence, exact identification of true ILP constraints or correctness of a discrete derivative. Every forward solution still belongs to the learned ILP, which may differ from the original data-generating problem.

## Experiments

- **Random constraints:** Ten datasets per constraint count use 16 integer variables, one/two/four/eight ground-truth inequalities, 1,600 training pairs and 1,000 test pairs. Costs are observed; only a static constraint system is learned. Exact-solution agreement decreases as difficulty grows: supplementary Table S3 gives 97.8% to 46.5% for binary variables and 87.3% to 2.3% for the dense setting with one-times-ground-truth learned constraint counts. More constraints improve some binary results but can overfit.
- **Weighted set covering:** Similar cost/solution training learns a static covering formulation. Table S4 reports 100%, 97.2%, 79.7% and 56.7% exact agreement over its displayed sizes. The dataset paragraph and figure/table labels disagree about some universe sizes; the note does not silently reconcile those labels. CVXPY-relaxation and direct-MLP baselines are substantially weaker in the harder displayed cases.
- **Text knapsack:** Each instance has ten item descriptions embedded into 4,096-dimensional vectors, with 4,500 training and 500 test examples. A separate network predicts weights and prices. Crucially, Supplement A.1 fixes capacity to the known value 100, despite the main text's broad discussion of learning the specification. The one-constraint model achieves 64.7% ± 2.8% exact item-vector agreement over ten restarts in Table S6. Some predictions violate the true weights even though they solve the learned formulation; the supplement explicitly visualizes these cases.
- **Keypoint matching:** The SPair-71k split has 53,340 training, 5,384 validation and 12,234 test image pairs. Four separate models handle `p=4,5,6,7`, each with `p^2` variables and `2p` learned static inequalities. Table 1 gives per-variable accuracies 83.1%, 80.7%, 78.6% and 76.1%, compared with dedicated BB-GM's 84.3%, 82.9%, 80.5% and 79.8%. This is competitive but lower accuracy, not a new best result or variable-size transfer.

All forward solves use Gurobi. Supplementary runtime totals on one Tesla V100 are 1h30m for set covering/random constraints, 3h50m for knapsack and 5h30m for the largest matching model; BB-GM's matching total is 55 minutes. These are training-plus-evaluation model runs, not per-instance inference latencies. Backward overhead is reported negligible relative to the ILP forward pass. Ablations study the direction basis, origin parameterization, soft-min temperature, constraint count and loss function.

## Limitations

### Discussed in the Paper

- Training data need not identify a unique constraint system. Infeasible learned ILPs can arise, and the solver-layer output is undefined when no feasible solution exists.
- Static constraints require fixed dimensionality. The matching experiment therefore trains separate models for each keypoint count; a flexible number of constraints is future work.
- The general layer is slower and slightly less accurate than the dedicated matching baseline in the reported experiment.

### Curator Notes

- General ILP expressivity is a representation statement, not a polynomial-time optimizer or a single generalist checkpoint. A conventional NP-hard solver remains inside training and inference.
- Exact agreement with labels and feasibility under learned constraints do not certify feasibility or optimality for unknown true parameters.
- The simplified text task uses known item count, bounded prediction ranges and fixed capacity; it is not unrestricted natural-language program induction.

## Reproducibility

- **Publication:** [PMLR 139, ICML 2021](https://proceedings.mlr.press/v139/paulus21a.html), pages 8443-8453, July 2021. The public first-preprint date is [5 May 2021](https://arxiv.org/abs/2105.02343); neither date is inferred to be an individual acceptance day.
- **Reviewed sources:** All 11 [publisher paper](https://proceedings.mlr.press/v139/paulus21a/paulus21a.pdf) pages and all five [publisher-linked supplementary](https://proceedings.mlr.press/v139/paulus21a/paulus21a-supp.pdf) pages. References, both proposition proofs, hyperparameters, ablations, qualitative feasibility analysis and runtime tables were read. Key equations, diagrams and tables were visually inspected.
- **Implementation:** [martius-lab/CombOptNet](https://github.com/martius-lab/CombOptNet), explicitly linked on Supplement page 1 and independently opened. Its PyTorch setup requires Gurobi and a solver license, plus the linked datasets. The previous note's claim that no implementation was verified has been corrected.
- **Reading map:** Main Sections 2-3 define the surrogate and its parameterization; Section 4 provides four demonstrations; Supplement A contains essential fixed-capacity, solver, training and runtime details; Supplement B proves the differentiable analogue and basis decomposition. This review does not claim numerical reproduction.
