---
id: learn-remove-cuts
short_title: Learn to Remove Cuts
title: Learning to Remove Cuts in Integer Linear Programming
authors:
- Pol Puigdemont
- Stratis Skoulakis
- Grigorios Chrysos
- Volkan Cevher
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/puigdemont24a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/puigdemont24a.html
institutions:
- EPFL
- Universitat Politecnica de Catalunya
- University of Wisconsin-Madison
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Packing
- Bin Packing
- Maximum Cut
- Production Planning
- Set Covering
- Neural Network Verification
summary: Task-specific neural cut reselection follows an add-all Gomory solve and an integer-objective bound checkpoint;
  it controls LP search rather than editing a primal incumbent.
code_url: https://github.com/LIONS-EPFL/LearningToRemoveCutsILP
---

# Learning to Remove Cuts in Integer Linear Programming

> **TL;DR:** A cutting-plane method temporarily adds the whole Gomory pool, learns which old/new cuts to retain, and preserves the achieved bound with an objective checkpoint. It improves gap closure on four of five synthetic families; Max-Cut is an explicit exception. The checkpoint's ceiling requires an integer-valued objective, and iteration gains must be separated from the limited runtime/SCIP evidence.

## Motivation

Adding every candidate cut can tighten an LP quickly but makes later relaxations expensive. Adding only one cut keeps the system small but permanently retains outdated choices. The paper learns cut removal/reselection so that many cuts can inform each iteration while the retained system grows slowly. Expensive leave-one-out LP scores motivate learning a lightweight approximation (Sections1-3).

## Contributions

- Add-all-then-remove cutting-plane search retains a small growing subset of both previous and current cuts.
- An objective-bound checkpoint prevents regression after removal under the paper's pure-integer assumptions.
- A14-feature MLP learns a scalar cut score from solver-generated trajectories.
- Synthetic size-transfer, cut-pool distributions, selected runtime comparisons and a26-instance SCIP neural-network-verification experiment extend the evaluation.

## Methodology

**Add, solve, reselect.** At iteration k, form the Gomory pool C_k from the current relaxation H+P_k, solve with all P_k+C_k, and stop if the optimum is integral. Otherwise retain k+1 cuts from that union and add c^T x>=ceil(z_k), where z_k is the all-cuts LP value. The original constraints stay protected. The retained cuts plus one checkpoint grow linearly with iterations; the temporary LP still contains the entire generated pool. Neural scoring does not eliminate the all-pool LP solve (Algorithm2/Figure1).

**Guarantee boundary.** For the formal pure ILP with integral c and integer x, every feasible objective is integer. Since z_k is a valid lower bound, ceil(z_k) cannot exceed the integer optimum; valid Gomory cuts and this checkpoint preserve integer optima while maintaining a nondecreasing LP lower bound. Corollary3.2 establishes that preservation, not a polynomial runtime, approximation ratio or finite-step guarantee for every learned/numerical implementation. A general MIP with continuous contributions need not have an integer-valued objective; ceiling its valid fractional lower bound requires an additional justification. For example, min x with0.2<=x<=1 has optimum0.2, which x>=ceil(0.2) would incorrectly exclude. This illustrates the assumption, not a claim about a particular reported benchmark (Sections2-3/AppendixA.2).

**Scoring and labels.** Equation4 defines a leave-one-out bound loss: LP value with the full set minus the value after removing one cut. Retaining high-score cuts is a greedy surrogate for joint subset selection; interactions and redundant cuts can make marginal scores insufficient. Section3.2's normalized-label expression instead uses an addition-style bound-improvement notation. The current release distinguishes these: new-cut labels use individual addition gains, while historical-cut labels are refreshed by removal LPs. Thus it should not be described as exactly evaluating Equation4 on every full-pool candidate during learning. Normalization by a previous LP value also needs care at zero/negative values; the release handles zero by substituting one.

**Features, training and scope.** The14 features include summary statistics of cut/objective coefficients, parallelism, efficacy, support, integral support, violation and membership in the latest pool. An MLP with sigmoid-transformed scores is fit by squared regression; the release uses three512-wide hidden layers. AppendixB.4 reports SGD5e-3,50 epochs, batch10,000 and patience5. Models are trained separately on each native family, without a demonstrated unchanged checkpoint across them. The neural module edits a relaxation's cut set, not a complete feasible primal incumbent, so its solver-control paradigm is constructive despite the word removal (Sections3.1-3.2/AppendixB/release).

## Experiments

**Data and exact sizes.** Each synthetic family has2,000 training/500 validation/500 test instances; expert trajectories run up to30 iterations. In-distribution packing uses50 variables/50 resource constraints; bin packing adds50 binary constraints; Max-Cut has9 vertices/25 edges; production planning has10 periods; set cover has35 elements/subsets with inclusion probability0.2 and unit costs. Larger tests have500 fresh instances per family, using100/100 packing,100/100+100 bin packing, Max-Cut14/40,15-period planning and50/50 set cover. These sizes vary by family; a blanket50% scale increase would misstate the doubled packing dimensions (AppendixA.1/B.1).

**Controlled protocol.** Main experiments use a from-scratch Gomory-only cutting-plane environment with no presolve. Look-ahead addition, an in-house feature-matched NeuralCut approximation and random/violation/lexicographic/similarity heuristics are compared. This is not the full published NeuralCut SCIP system with its original graph encoding, presolve and mixed cut types. The primary metric is integrality-gap closure, (z_k-z_LP)/(z_integer-z_LP), requiring a nonzero initial gap and the SCIP integer reference. A high LP-bound closure does not itself supply a feasible integer witness. Plot bands represent instance variability, not a reported repeated-training confidence interval (Sections4.1-4.3).

**Results and exceptions.** Removal improves the gap-closure curves for packing, bin packing, production planning and set cover. Bin packing/set cover eventually approach addition methods near full closure; gains are clearer in early iterations. Max-Cut does not beat the expert/neural addition policies; many candidate cuts have similar useful quality and random is competitive initially. Larger-instance results retain the four-family advantage, with production-planning look-ahead catching up in the last third of iterations. The heatmaps sort and aggregate cut quality across500 trajectories, normalized either to the best cut or the previous LP value; they explain distributional patterns rather than prove a universal rule (Figures2-3/AppendixE/Figures4-8).

**Runtime evidence.** Main plots deliberately compare iterations. AppendixD separately reports elapsed-time speedups only on instances where at least one policy converged: bin packing1.14x versus NeuralCut/24.59x versus look-ahead/2.71x versus other nonneural baselines; packing1.61x/24.30x/2.15x; set cover5.12x/47.26x/5.41x. Max-Cut and production planning are excluded because no method reached IGC1 under that protocol. These selected-subset aggregate ratios, without absolute times or full-set timeout analysis, are narrower evidence than an end-to-end general speedup claim (AppendixD/Table4).

**SCIP extension.** AppendixC uses a PySCIPOpt cut selector on26 randomly chosen neural-network-verification instances with a100-node B&B cap, including native mixed cut types and presolve. It reports mean35% solution improvement,23/26 instances improved and three tied; some percentages exceed100%, so the signed objective/reference formula matters. Per-node LP-bound improvements are a separate statistic, not those primal solution gains. The paper does not provide sufficient raw objective values/formulas to reinterpret these percentages as optimality-gap closure or infer certified optimal solves. Nor does it identify enough shared-checkpoint provenance to establish cross-native-task generalist behavior (AppendixC/Tables2-3).

## Limitations

### Discussed in the Paper

Marginal per-cut features do not model joint cut-set structure; richer graph/set models and variable retained-set sizes are future work. Runtime depends on solver/implementation details, and the selected runtime table omits two families. Max-Cut is an explicit empirical exception to superior gap closure (Sections3-5/AppendicesC-E).

### Curator Notes

The objective ceiling is justified by integer-valued feasible objectives, not arbitrary mixed-variable programs. The public SCIP verification interface also applies ceil unconditionally; the audit did not establish that the verification dataset satisfies that integrality condition, so the pure-ILP corollary must not be transferred as an unconditional mixed-MIP guarantee. Valid bound preservation is weaker than strict progress, finite convergence or a learned optimality guarantee.

The current public SCIP script has reproducibility gaps: SimpleMLP is referenced without its import; a checkpoint argument is accepted by the outer test function but is not passed into the scorer, and the callback creates a fresh scorer each selection. Thus the released path does not verify execution with the trained checkpoint behind AppendixC. Original constraints/cuts/label refresh and the main environment were inspected separately; these release issues do not establish which historical implementation produced the paper's tables. No optimization benchmark was rerun.

## Reproducibility

- **Publication:** [ICML2024/PMLR235,41235-41255](https://proceedings.mlr.press/v235/puigdemont24a.html), official publication metadata July8,2024. Publisher authors and PDF EPFL/UPC/Wisconsin affiliations verified; Puigdemont/Skoulakis are equal contributors.
- **Scientific coverage:** all21 publisher pages, bibliography and AppendicesA-E, every runtime/SCIP result and all five families' rendered heatmaps. Publisher links and the official conference entry were manually checked; no additional scientific PDF is linked. Ordinary OpenReview API access returned403 without bypass. The full author ZIP inventory has no extra scientific PDF/archive.
- **Implementation:** [LIONS-EPFL/LearningToRemoveCutsILP](https://github.com/LIONS-EPFL/LearningToRemoveCutsILP), official README, generation/training interface, add-all/remove/checkpoint environment, historical-label refresh, MLP/sigmoid and SCIP verification callback inspected. Requirements include CPLEX and SCIP; README reports Python3.8.10/SCIP8.0. Full checkpoint/baseline reproduction was not performed.
- **Relations:** Source-supported catalogue citations include Learning to Cut, hierarchical cut selection, hybrid branching, GCNN branching and RL column generation, each present in body text and matching bibliography. Nonneural/sample-complexity background not present in the catalogue does not create inferred edges.
