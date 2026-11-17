---
id: learn-lagrangian-multipliers
short_title: Learn Lagrangian Multipliers
title: Predicting Lagrangian Multipliers for Mixed Integer Linear Programs
authors:
- Francesco Demelas
- Joseph Le Roux
- Mathieu Lacroix
- Axel Parmentier
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/demelas24a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/demelas24a.html
institutions:
- Universite Sorbonne Paris Nord
- CNRS
- Ecole des Ponts
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
- Network Design
- Generalized Assignment
summary: Separate probabilistic graph models predict CR-conditioned multipliers whose exact Lagrangian subproblems
  yield stronger reported dual bounds and useful bundle warm starts.
code_url: https://github.com/FDemelas/Learning_Lagrangian_Multipliers.jl
---

# Predicting Lagrangian Multipliers for Mixed Integer Linear Programs

> **TL;DR:** Separately trained probabilistic graph models predict Lagrangian multipliers from a MILP and its continuous-relaxation solution. Exact application-specific relaxed subproblems turn those predictions into dual bounds; the models improve reported bound quality and bundle-method initialization, rather than directly constructing feasible primal solutions.

## Motivation

Lagrangian dual optimization repeatedly solves relaxed combinatorial subproblems while updating a large multiplier vector. Across related instances this iteration can be expensive. Amortizing the choice of multipliers can produce a useful bound quickly or initialize a classical iterative method, provided the chosen relaxation can be evaluated efficiently (Sections1-2).

## Contributions

- A self-supervised encoder-decoder learns from the resulting Lagrangian objective, without target optimal-multiplier labels.
- Continuous-relaxation primal/dual information and predicted deviations provide an informed starting point.
- A probabilistic constraint representation permits several multiplier predictions and selection by their evaluated bounds.
- Multi-commodity fixed-charge network design(MCND) and generalized assignment(GA) experiments compare bound quality, computation, warm starts and architecture/feature ablations.

## Methodology

**Bound and learning signal.** For a minimization MILP with difficult constraints Ax>=b, retaining a specified feasible set X gives LR(pi)=min_{x in X} w'x+pi'(b-Ax), with pi>=0 for those inequalities. Its maximum is a Lagrangian dual bound, potentially stronger than the continuous relaxation(CR). At a relaxed optimum xbar, b-A*xbar supplies the concave dual objective's supergradient, called a subgradient in the paper. The training loss differentiates through this analytic quantity and the neural predictor; it must still solve the relaxed subproblems. A merely feasible subproblem objective does not itself certify a lower bound on that minimization (Sections2.1-2.2).

**Architecture.** Variable and constraint nodes have eight-component features containing coefficients, CR primal values/reduced costs, right-hand sides/dual values, integrality and dualization flags. Five residual blocks for MC and three for GA alternate normalized linear graph convolution and normalized per-node MLPs with dropout0.25. Gaussian representations of dualized constraints use reparameterized sampling and clipped variance; a shared local decoder predicts deviations from CR multipliers. Initial features map8->250, block MLP hidden width1000 and decoder hidden width250. At test time five complete multiplier assignments are evaluated and the best bound retained, rather than five samples being free neural-only predictions (Sections2.3/AppendicesA,E).

**Application-specific signs and oracles.** MCND dualizes flow-conservation equalities: its multipliers are unrestricted, and arc subproblems are fixed-charge continuous knapsacks. GA as formulated maximizes profit with at-most-one-bin constraints; its nonnegative multipliers yield an upper bound and the dual minimizes it. Equivalently negating the maximization gives a minimization/lower-bound convention. GA has integer-knapsack subproblems. Thus the generic main-text softplus/lower-bound description must not be applied unchanged to the equality multipliers or the unnegated GA objective. AppendixB's free-sign footnote and AppendixE's GA-specific softplus qualify it; the current code also explicitly changes GA signs. Relaxations and specialized solvers are supplied, not learned or discovered (AppendicesB-C).

**Scope.** MC and GA use different block counts, application-specific relaxed solvers and separately trained dataset models. The larger-instance test transfers within MCND, not between MCND and GA. This remains a specialist constructive solver component: it predicts a dual configuration and may initialize classical dual optimization, rather than neurally editing a complete feasible primal incumbent.

## Experiments

**Data/reference/compute.** Each of six datasets has2000 instances with1600/200/200 training/validation/test and three random training initializations. MC uses two fixed Canad-derived directed networks(20nodes/230arcs and30nodes/520arcs), varying40-200 commodities/costs/demands; GA uses10bins/100items and20bins/400items drawn around two standard instances. CPLEX solves CR; SMS++ proximal bundle solves each instance to provide the Lagrangian reference, whose stated cost ranges from about one second to one hour. GAP is the mean percentage difference from this reference Lagrangian bound, not the original MILP's primal optimality gap. Training uses QuadroRTX5000 or A40 GPUs; inference is on A40 and bundle warm starts on i7-8565U CPU. RAdam rates are1e-4 MC/1e-5 GA, with clipping/decay (Section4/AppendicesD-E).

**Bound quality and cost.** Table1's neural GAPs are2.09/4.42/4.20/4.77% on four MC datasets versus CR12.99/22.29/15.94/20.66%, and0.55/0.15% on GA versus CR1.91/0.44%. These close a large portion of the CR-to-Lagrangian-reference difference; “up to85%” is not an85% primal-quality or runtime improvement. Corresponding neural times are approximately121-375ms MC and16/125ms GA, exceeding CR's91-287ms and10/71ms. Bounds improve at additional per-instance cost; preprocessing/CR and exact LR evaluations remain required. kNN and the MLP baseline are weaker, but their feature construction also differs (Table1/AppendicesF-G).

**Warm starts are method dependent.** On MC-BIG-VAR validation instances, bundle time at tolerance1e-1 decreases34.34s(zero) /31.67s(CR) to16.09s(predicted), and at1e-4 from105.03/101.14 to63.25s, with large standard deviations. The prose says CR is uncompetitive with zero, while these explicit mean times favor CR modestly; neither guarantees every-instance improvement. In AppendixI, the subgradient baseline instead changes275.09 to271.73s at1e-1 and281.00 to278.58s at1e-4, with a100000-iteration cap and similar iteration counts. This does not support the same large speedup for arbitrary iterative dual solvers (Tables2,7).

**Ablation/transfer limits.** Removing CR information worsens MC GAP to20.26/23.78%, worse than CR on those datasets. A single test sample has only a small effect(2.10/4.79 versus2.09/4.77); deterministic training is worse especially on mixed-size MC(5.86%). More layers improve MC but are not uniformly helpful for GA; the competing Nair architecture slightly wins selected depth settings, so the proposed block is not uniformly dominant. An MC-BIG-VAR model tested on1000 instances with160/200 commodities on the same larger network obtains6.51/7.62% versus LR(CR)27.85/30.18%, with1.53/1.43s versus0.89/1.09s. This is larger-demand transfer on a known base graph (Tables3-6).

## Limitations

### Discussed in the Paper

The dualized constraint set is assumed known, and exact LR evaluation is combinatorial/application specific. CR features are essential in the reported configurations. Generalization is limited to closely related instance families; using predictions inside primal heuristics, branch-and-bound or an unrolled/diffusion system remains future work. Subgradient initialization may need a separately tuned step schedule (Sections3/5,AppendixI).

### Curator Notes

**Bounds require the correct oracle and signs.** Weak duality validates evaluated LR bounds under the appropriate multiplier domain; it does not prove learned multipliers outperform CR, solve the dual optimally or yield a feasible original solution. The numeric SMS++ reference is not independently certified here. GA's printed maximization is an upper-bound relaxation, unlike MCND's lower-bound relaxation.

**Printed knapsack recipe.** Rendered AppendixB.2 says to fill continuous-knapsack capacity in decreasing reduced cost w for a minimization. That direction is incorrect as written: capacity1, two unit-bounded variables, w=(-1,-2) and activation cost0.1 give optimal open value-1.9, whereas the stated decreasing-order fill gives-0.9. Beneficial negative costs and the option to leave capacity unused also matter. This identifies a problem in the printed recipe, not evidence that the historical implementation used that recipe or that all empirical bounds are invalid. The current release delegates LR solving to the separately linked Instances package; no benchmark was rerun.

**Reproducibility scope.** The released framework includes additional architectures/features beyond the exact paper setup. Code inspection verifies analytic LR pullbacks, signed GA handling, CR/deviation features, stochastic prediction and separately collected feature/neural/CR/LR times; arbitrary current defaults are not treated as the historical benchmark configuration. Offline reference-generation and training costs are not amortized away by the online numbers.

## Reproducibility

- **Publication:** [ICML2024/PMLR235](https://proceedings.mlr.press/v235/demelas24a.html), pages10368-10384; official HTML citation_publication_date July8,2024, authors and affiliations cross-checked against page1.
- **Coverage:** all17 proceedings pages, full bibliography and integrated AppendicesA-I read; architecture, numerical tables and AppendixB formulas visually checked. Publisher links only this PDF/OpenReview. The author Julia ZIP and linked Instances ZIP were manually inventoried without extra scientific PDF/ZIP/TeX attachments; online documentation was checked. Ordinary OpenReview API request for aZnZOqUOHq returned403 without bypass.
- **Implementation/data:** [FDemelas/Learning_Lagrangian_Multipliers.jl](https://github.com/FDemelas/Learning_Lagrangian_Multipliers.jl), [Instances dependency](https://github.com/FDemelas/Instances), and [authors' datasets](https://github.com/FDemelas/datasets_learningPi). README, model/deviation/sampling/loss and test-time code were inspected. Julia/Flux, CPLEX and SMS++ are material dependencies; no training or solver reproduction was executed.
- **Relations:** only explicitly cited papers with matching bibliography identities in the current catalogue are emitted. In particular Khalil et al.(2017) here is Learning to Run Heuristics in Tree Search, not the different S2V paper; Nair et al.(2020) is the cited preprint identity, not an invented relation to a similarly named LNS paper.
