---
id: l2dive
short_title: L2Dive
title: Learning to Dive in Branch and Bound
authors:
- Max B. Paulus
- Andreas Krause
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/6bbda0824bcc20749f21510fd8b28de5-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/6bbda0824bcc20749f21510fd8b28de5-Abstract-Conference.html
institutions:
- ETH Zurich
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Separate application-specific GNN assignment models guide LP-duality-inspired diving inside SCIP, improving
  incumbents without a learned-feasibility or original-optimality guarantee.
---

# Learning to Dive in Branch and Bound

> **TL;DR:** Learn integer-variable assignments, then use model confidence and LP dual information to guide a sequence of bound tightenings and LP solves. L2Dive is an application-specific primal heuristic inside SCIP; its complementary-slackness proposition assumes a feasible target assignment and does not guarantee that a learned prediction yields a successful or globally optimal dive.

## Motivation

Diving heuristics seek feasible incumbents by following a depth-first sequence of bound changes and LP resolutions. Generic rules can miss recurring structure in related instances. A learned assignment can guide these decisions without asking a separate restricted integer-program solver to complete each neighborhood (Sections 1–3).

## Contributions

- A GNN learns from a small pool of good feasible assignments rather than requiring every training label to be a proven optimum.
- An LP-duality-inspired rule prioritizes variables whose predicted values violate complementary slackness, then breaks ties by prediction confidence.
- Direct SCIP diving-plugin integration supports both controlled single-dive comparisons and whole branch-and-bound evaluation with online overhead included.

## Methodology

**Learning target.** For each training instance, collected feasible solutions receive Boltzmann weights proportional to exp(−cᵀx/τ); uncollected assignments have no target mass. Minimize KL from the target marginal on divable integer variables to the GNN model. Binary outputs are conditionally factorized Bernoulli parameters. Graph features use thirty-six variable and sixty-nine constraint features; batch normalization, 64-dimensional embeddings and variable→constraint→variable convolutions precede output MLPs. This factorization cannot reproduce arbitrary correlated feasible-solution distributions (Section 3.1; Appendix B).

**Scope of integer predictions.** The framework discusses bitwise representations for general-integer domains, including overflow/recurrent-output options. All actual experiments have exclusively binary divable variables. Thus general-integer handling is a proposed extension rather than demonstrated experimental coverage. Fixed variables and slack variables are normally excluded from the divable set (Sections 2.1/3.1; Appendix B.2).

**Dive decisions.** Predict the modal assignment once at dive initiation. At each LP solve, compute the set of predicted coordinates violating complementary slackness with current dual-bound multipliers. Give them priority above other candidates and rank within these groups by model confidence. Tighten a selected variable toward its predicted value, propagate/resolve and try rounding when possible. A dive may terminate infeasible or early under depth, LP-iteration or objective limits; predicted assignments themselves are rarely feasible or can have poor quality. Reported experiments use one dive, without parallel sampled divers (Sections 2–3/5).

**What Proposition 1 guarantees.** Given an already feasible MILP solution and an optimal dual solution of the LP relaxation, tighten the corresponding variable bounds precisely at that feasible solution on every complementary-slackness-violating coordinate. Dual feasibility plus restored complementary slackness makes that known solution optimal for the tightened LP. This does not establish original MILP optimality, feasibility of a neural prediction, or that an LP optimizer will return an integer solution when fractional alternative optima exist. The paper expressly warns about excluded slack variables, incomplete candidate sets and multiple optima. The deployed rule is inspired by this proposition; it does not satisfy its feasible-target assumption automatically (Proposition 1 and discussion; Appendix D).

**Supervision and symmetry.** Most datasets use the best feasible solution found within a cutoff, not a certified optimum. Set-cover and independent-set training additionally enumerate assignments on an auxiliary model fixing an established optimal objective, exploiting symmetry. That augmentation requires its reference objective and solver enumeration cost; it is distinct from assuming free availability of many optimal labels. Data collection and training are offline and intended to amortize over repeated related instances (Sections 3.1/5; Appendix C).

## Experiments

**Task-specific training.** Six datasets receive separate models. Synthetic set-cover, combinatorial auction, facility location and independent set each use 1,000/500/500 train/validation/test instances. The load-balancing dataset has 9,900/100/100, and neural-network verification is described as 2,384/519/545 in the main text. Models train for 100 epochs in the synthetic experiment or ten in whole-solver evaluation; learning rates are individually selected from 10⁻²/10⁻³/10⁻⁴, with batch size filling one 1080 Ti. Best validation loss chooses the checkpoint. Test inference uses CPU only (Section 5).

**Controlled single dives.** Presolve is enabled, branching/cuts/other primal heuristics disabled and every diver receives maximum depth 100. The comparison excludes a few instances solved at root and divers requiring incumbents or a different generic interface. L2Dive has lower mean absolute primal gap on all four tested classes: 55/222/160/5 versus best standard diver 95/256/484/18, respectively. These are objective-unit gaps, not percentage-point gaps. Same depth is not identical wall-clock cost: L2Dive takes about 0.45/0.38/3.99/0.58 seconds on these tasks, while several standard divers finish substantially faster, sometimes because they abort early (Tables 1/7; Appendices A/E).

**Dual-rule and size evidence.** On facility location, dual reasoning yields mean gap 160±10 versus confidence-only 164±10 and random candidate selection 335±14. This is a modest problem-specific increment over confidence, not universal evidence that dual reasoning dominates. A model trained on small facility-location instances transfers to 100 larger instances and leads the reported relative-gap table; it is within-family size transfer, not cross-task reuse (Table 2; Appendix E.1).

**Whole-solver comparison.** SCIP 7.0.2 disables other diving heuristics and calls L2Dive from the root, retaining branch-and-bound. Load balancing uses a 900-second cutoff and verification 3,600 seconds for collection/testing. Repeated evaluations on Xeon Gold 5118 CPUs use three solver seeds and include graph extraction, prediction and diving time. Default, no-diving and randomly tuned diving ensembles are compared. Load integral improves 3,067→2,863 (6.65%) against tuned and 4,407→2,863 (35.03%) against default. Verification mean time improves 49.9→39.8 seconds (20.24%) and 55.8→39.8 (28.67%), respectively. The abstract's approximate 7/35% and 20/29% pairings are consistent; the body incorrectly calls the latter default-time reduction 35% (Table 3).

**Wins and tuning limits.** L2Dive wins 93/100 load instances and 287/545 verification instances, not every instance. The tuned baseline searches heuristic frequencies/offsets with roughly matched solver-call data-collection budgets: sixteen configurations×625 load-validation instances and six×505 verification instances. Appendix F's verification validation count 505 differs from main text 519, so exact split reconstruction needs clarification. Tuning controls diving schedules, rather than all solver parameters or all possible primal methods (Sections 5.2; Appendix F).

**Metric-scale inconsistency.** Equations 3–4 and the footnote define a non-percent primal-dual gap bounded by one, so its integral over 900 seconds cannot exceed 900. Table 3 nevertheless reports 4,407/3,067/2,863. Official SCIP 7.0.2 source computes its integral gap as 100 times the normalized bound difference, consistent with a percentage scale. The paper's wording and reported scale therefore require reconciliation; this note preserves the published numbers and relative improvements without asserting they are literal integrals of the printed non-percent formula. Supplemental relative-primal-gap tables also require attention to displayed scaling and are not automatic optimality certificates.

## Limitations

### Discussed in the Paper

Good feasible training solutions can be expensive to collect and training instance sets may be small. Cross-application transfer, self-supervised representations and a universal diverse-instance diver remain future directions. Dual reasoning can reduce to confidence-only selection, and a learned assignment may not yield a feasible dive (Sections 3.2/5.1/6).

### Curator Notes

This is a specialist learned primal heuristic with a separate model per application and binary-only divable experiments. Successful diving improves incumbents; correctness/optimality certification remains the host solver's job under its normal assumptions. Keep the feasible-target theorem assumptions, depth-versus-time budget distinction, offline labeling/augmentation cost, limited benchmark scope and metric-scale/split inconsistencies visible. Better average whole-solver performance does not imply every instance or every individual dive improves.

## Reproducibility

- **Publication:** [NeurIPS 2023 main proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6bbda0824bcc20749f21510fd8b28de5-Abstract-Conference.html), pp. 34260–34277. The PDF lists Max B. Paulus and Andreas Krause at ETH Zurich; the note retains that full author spelling. Official HTML metadata explicitly records publication date `2023-12-15`.
- **Reading:** all eighteen publisher-PDF pages, references and integrated Appendices A–F, including duality proof, auxiliary enumeration, general-integer discussion, baseline exclusions, transfer/timing tables and tuning protocol. Manual publisher attachment inspection lists the main Paper and BibTeX without a separate Supplemental scientific document; no missing scientific appendix was identified.
- **Code:** no author-confirmed public implementation URL was verified in the reviewed article/publisher/author searches. SCIP and PySCIPOpt alone do not supply the paper's extended diving plugin and learned models. The audit does not claim to have rerun its experiments.
- **Metric reference:** [official SCIP v7.0.2 `stat.c`](https://github.com/scipopt/scip/blob/v702/src/scip/stat.c), function `getGap`, explicitly uses a 100-scaled gap for integral statistics; this supports the scale caveat above without changing the paper's raw table values.
- **Citation graph:** six exact catalogue papers have explicit body citations and matching numbered references; the full bibliography was scanned for additional exact identities.
