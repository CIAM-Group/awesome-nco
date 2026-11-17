---
id: fld-co
short_title: FLD4CO
title: Fractional Langevin Dynamics for Combinatorial Optimization via Polynomial-Time
  Escape
authors:
- Shiyue Wang
- Ziao Guo
- Changhong Lu
- Junchi Yan
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/989a74f28a550b71c77067ba04e9d081-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/989a74f28a550b71c77067ba04e9d081-Abstract-Conference.html
institutions:
- East China Normal University
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Maximum Clique
- Maximum Cut
summary: FLD-EG adds heavy-tailed noise to an analytical graph-search heuristic; FLD-IG
  trains task-specific noisy flip policies. Idealized escape analysis is distinct
  from the truncated binary algorithms, whose implementation remains unreleased.
---

# Fractional Langevin Dynamics for Combinatorial Optimization via Polynomial-Time Escape

> **TL;DR:** Replace Gaussian perturbations with symmetric stable noise to encourage exploration in graph optimization. FLD-EG is an analytical, training-free heuristic; FLD-IG is a learned iterative policy. The title's polynomial escape comparison is not a polynomial-time guarantee for arbitrary NP-hard CO or for the actual truncated neural solver.

## Motivation

Light-tailed Langevin perturbations can remain trapped in narrow potential wells. Heavy-tailed stable noise permits occasional larger jumps. The paper asks whether that exploration mechanism can improve both analytical-gradient graph search and data-driven iterative solvers, while controlling outliers through truncation/projection (Sections1-3).

## Contributions

The framework derives from fractional Langevin dynamics with symmetric alpha-stable noise. Alpha=2 recovers the Gaussian-noise case; smaller alpha creates heavier tails. FLD-EG combines explicit graph-energy derivatives with gradient/noise gating and an auxiliary continuous state. FLD-IG adds stable noise to a GCN-based binary flip policy. Experiments evaluate MIS, maximum clique and MaxCut, including trajectory/alpha/truncation ablations.

The neural solver is specialist: native tasks and graph datasets have separate training configurations/checkpoints. FLD-EG's reuse of analytical formulas is not shared neural generalism. Large-ER testing is within-MIS size transfer, with adjusted inference/noise settings rather than transfer to another native problem.

## Methodology

The ideal continuous process adds stable Levy increments to a drift. The exact target-preserving drift involves a nonlocal fractional operator. The practical expression uses c_alpha*score, where c_alpha=Gamma(alpha-1)/Gamma(alpha/2)^2, as a computational approximation. Its coefficient is finite/positive for the experimental alpha values above1 and equals1 at alpha2. Equality of this local approximation to the exact nonlocal drift is not established for arbitrary energies (Theorem1; AppendixA).

FLD-EG maintains binary assignments and an auxiliary continuous vector. It samples stable noise with a Chambers-Mallows-Stuck-style transform, gates drift and noise using gradient-derived order-statistic masks, updates the auxiliary state, clamps it to[0,1], samples binary coordinates and retains the best energy. The masks are based on gradient/improvement scores, not a literal sorting of noise magnitudes; independent sigmoid/Bernoulli masks also do not enforce exactly d changed coordinates. A greedy decoder supplies feasibility. MIS/clique penalties and MaxCut energy/derivatives are given in AppendixC (Section4.4; AppendixD.1/Algorithm1).

FLD-IG uses a five-layer128-dimensional GCN to predict mean-field flip probabilities. It collects noise-augmented trajectories and trains a local objective modeled on RLNN: a one-step energy term plus a soft expected-distance penalty. The **printed** Equation28 instead contains H(x_n), the fixed current-state energy, rather than the next-state energy. For the fixed states used in Algorithm2's update this term supplies no proposal gradient. The intended objective requires clarification; no public implementation is available to resolve that discrepancy. The paper reports30 training epochs and alpha1.7 for every IG task (Section4.5; AppendixD.2/E).

## Experiments

Small RB/BA graphs have200-300 nodes and large graphs800-1200. MIS additionally uses ER700-800 for training and ER9000-11000 for transfer testing. The printed split is1000 training/500 validation graphs; testing uses500 RB/BA,128 small-ER or16 large-ER graphs. Experiments report an H100 GPU and Xeon Platinum8468 CPU. EG uses200 parallel searches and100-5000 steps; IG uses20 searches and100-800 inference steps. EG alpha varies1.01-1.7, while IG is1.7. These branches have different training and inference budgets (Tables3-4; AppendixE).

**Analytical EG branch.** MIS small-RB improves RLSA19.97→20.02 at35→38seconds, while large-RB improves40.19→40.25 at1.85→1.93minutes. Large-ER reaches377.50 in1.12minutes versus RLSA375.31/1.66minutes, but remains below KaMIS381.31. Small clique ties RLSA18.97; large clique improves40.53→40.63 while taking1.91 versus1.27minutes. Large-BA MaxCut improves2955.81→2960.13 at1.70 versus1.45minutes, yet remains below SDDS2971.62. Quality improvements therefore need not mean uniformly shorter runtime (Tables1-2).

**Learned IG branch.** Compared with RLNN, MIS improves19.52→19.72 on small RB and38.46→39.56 on large RB; the latter still trails SDDS39.99. Small-clique18.52 trails SDDS18.90. Large-BA MaxCut2922.54 improves RLNN2907.18 but remains below both DiffUCO2947.53 and SDDS2971.62. Across all eight listed task/dataset combinations, IG is strictly above every other listed learning method in five, rather than the prose's75% claim. This5/8 count is curator arithmetic from the displayed point estimates, not a new benchmark or significance test. Several baseline entries reproduce earlier reported results; uniform hardware/configuration-matched reruns are not established (Tables1-2; Section5).

Figure1 illustrates stable-noise tails and sample paths. Figure2 compares single-variable trajectories at alpha1.4/1.6/1.8/2 and with/without truncation; Figure3 compares best-energy curves for Gaussian and stable-noise variants. They support exploration examples under the reported configurations, not global convergence or universal dominance. Tables1-2 give no uncertainty across training seeds; the checklist's reference to an appropriate test-set size does not substitute for such uncertainty estimates.

## Limitations

**Scope of escape theory.** Section4.3 contrasts small-noise continuous multiwell escape behavior and conductance/spectral expressions for reversible chains with positive stationary distributions and appropriate Metropolis-Hastings correction. Polynomial dependence on well width is not polynomial complexity in graph size. A lower spectral-gap bound is not by itself a complete bound on hitting an arbitrary specified optimum without further target/starting-state conditions. The paper does not derive an algorithm-specific hitting-time theorem for its time-varying, gradient-gated, clamped binary procedures, which show no MH acceptance step. AppendicesA/B address drift approximation and noise generation, rather than filling that missing connection. These distinctions limit a guarantee attributed to the practical solvers; they do not negate the reported empirical comparisons.

Binary graph tasks are the demonstrated scope. Global constraints, integer/mixed-integer variables, arbitrary black-box objectives and industrial deployment remain untested. Graph-energy knowledge, architecture, annealing, truncation, best-of-many selection and greedy decoding are substantial ingredients. The broader-impact discussion describes possible applications and energy benefits, without measured deployment or energy savings.

### Curator Analysis

AppendixA first uses an approximation in Equation33, but Equation34 then writes equalities for the simplified drift; it should be understood as an approximation. The cited [fractional-Langevin primary paper](https://proceedings.mlr.press/v70/simsekli17a.html), Sections3.2-3.3, explicitly distinguishes the exact and simplified schemes and analyzes approximation error for alpha>1. The present c_alpha is singular at alpha1 and does not give a positive coefficient below1; all tabulated EG choices are above1.

Equation18's alpha1 branch is(pi/2)*tan(U), which has Cauchy scale pi/2. Definition1 with unit scale instead has characteristic function exp(-|w|), corresponding to tan(U). AppendixB uses a different stable-distribution parameterization, explaining the convention change but not making those two unit scales identical. The reported alpha values avoid1, so this is a general-form scale qualification, not evidence that its experimental samples used the wrong scale.

Printed Algorithm1 anneals temperature to zero at its last iteration despite divisions by temperature, and its drift sign/auxiliary-state complement convention needs an explicit implementation specification. Those are unresolved reproduction details, not confirmed defects in unavailable executable code. Algorithm1/2 correctly use -log(U) for the exponential variate; describing this as direct replacement by a uniform variate would itself be inaccurate.

## Reproducibility

- All28 pages of the [formal NeurIPS2025 PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/989a74f28a550b71c77067ba04e9d081-Paper-Conference.pdf) were read, including all69 references, the checklist and scientific AppendicesA-F. Twelve key method/theory/result/algorithm pages were visually inspected. The publisher verifies four authors, three institutions, DOI10.52202/085713-3542 and April23,2026 publication date, separately from the2025 conference label.
- Manual publisher links list Paper/Bibtex and no separate scientific supplement. Both OpenReview notes APIs for `BZ0igCEeoU` returned403. No explicitly missing scientific attachment was found; all integrated appendices were read.
- The [official repository](https://github.com/Thinklab-SJTU/FLD4CO) at `083101d0b6f07c22a4b9d0c8c2f779e7bbb2425c` contains only LICENSE and README and states **Code coming soon**. It supplies no implementation, configurations, weights or additional scientific PDF/ZIP. Its URL is retained here as a publication resource, while the catalog's available-code link is omitted. Implementation-level verification and exact reproduction remain unavailable. No training or benchmark was rerun.
- The curator script `research/full-text-review/fld-co/recompute_table_scope.py` only checks the5/8 table count, coefficient values and Cauchy-scale arithmetic. 19 exact existing-paper references are recorded. The main ERDOES citation[16] actually names the1960 random-graph paper; the valid EGN relation instead uses explicit[27]. This bibliographic mismatch is not converted into an unrelated relation.
