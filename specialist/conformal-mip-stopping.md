---
id: conformal-mip-stopping
short_title: Conformal MIP Stopping
title: Conformal Prediction for Early Stopping in Mixed Integer Optimization
authors:
- Stefan Clarke
- Bartolomeo Stellato
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/clarke26a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/clarke26a.html
institutions:
- Princeton University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Family-specific neural gap prediction calibrates early stopping for classical MIP solvers; reported speedups,
  empirical undercoverage, distribution assumptions, a printed threshold-endpoint gap and strict online implementation
  differences are distinguished.
code_url: https://github.com/stellatogrp/conformal_mip
---

# Conformal Prediction for Early Stopping in Mixed Integer Optimization

> **TL;DR:** A family-specific LSTM predicts remaining incumbent suboptimality, and calibration chooses an early-stop threshold for Gurobi/COPT. Large reported runtime reductions have quality and distribution qualifications. The printed conformal theorem needs endpoint handling, and online strict stopping differs from the paper and offline evaluator.

## Motivation

Branch-and-bound often discovers its eventual best solution well before closing its certified bound. Instead of learning branching or a new primal solution, this work learns when to return the classical solver's current feasible incumbent. Repeated instances from a target distribution supply solved trajectories for training and calibration (Sections1–3).

## Contributions

- A neural trajectory-based predictor and conformally calibrated threshold control early termination without access to the complete problem graph.
- Marginal coverage, calibration-conditional concentration and total-variation shift analyses describe the proposed statistical contract, subject to the qualifications below.
- Six Distributional MIPLIB families, two solvers, simple stopping baselines and sensitivity experiments study the time/quality tradeoff (Sections4–6/AppendicesA–D).

## Methodology

For a minimization problem with nonzero optimum z*, the paper defines true relative suboptimality g(t)=(U(t)−z*)/|z*|. U is the incumbent objective and L a certified lower bound. The predictor observes current bounds, their rolling summaries, time and branch-and-bound node count. The described model has a two-layer LSTM with200 units per layer, followed by a two-hidden-layer200-unit ReLU network. A bounded squashing output lies in[0,U−L], tending to zero when the complete solver closes its bounds. Training minimizes a weighted squared loss against the **absolute** gap U−z*, emphasizing small gaps; relative accuracy is the eventual evaluation target. Training labels require expensive completed solves (Sections3/4.2/6.1).

The printed stopping rule is the first time prediction≤kappa. A rolling minimum makes the trajectory score monotone. Theorem4.1 defines kappa as the supremum of thresholds giving at least n safe calibration trajectories, and states coverage n/(c+1) for an independent new draw. This is marginal over calibration and the new instance, not a deterministic per-instance optimality certificate or95% success conditional on every fixed calibration set. Even the stated n≤c construction cannot reach a nominal coverage above c/(c+1) without a fallback. Theorem5.2 gives a weaker high-probability calibration-conditional bound; Theorem5.1 assumes bounded runtime/suboptimality, and Theorem5.3 loses total-variation distance rho under shift. Unknown shift is not automatically controlled (Sections4/5).

**Endpoint qualification.** The printed hypotheses allow step trajectories and ties, but a safe threshold set need not contain its supremum. Consider identical iid instances with z*=1, U=2,L=0 before time1 and U=L=1 afterward; let prediction be1 then0 and epsilon=.1. Every kappa<1 is safe, whereas kappa≥1 stops at0 with true gap1. Thus the safe set is[0,1), its printed supremum is1, and the stated coverage fails, including c=n=9. The predictor is nonnegative and tends to zero and can be realized by the stated squash. The proof's non-strict inverse equivalence also fails on plateaus. This is a curator counterexample to the theorem **as printed**, independently checked by the root reviewer; it does not invalidate the elementary randomized-rank lemma or rule out a corrected strict/conservative calibration theorem (pp3–4; research/full-text-review/conformal-mip-root-endpoint-check.json).

The paper's standard algorithm-gap expression (U−L)/|L| is also not generally an upper bound on (U−z*)/|z*| solely from L≤z*: L=−100,z*=1,U=100 gives2 versus99. Sign/denominator conditions or an appropriate certified absolute-gap formulation are needed; this algebraic example is not a claim about a measured Gurobi outcome (Section3.3).

**Scope.** The six native families use separately trained predictors and calibration data. No shared trained checkpoint across those native applications is demonstrated. This remains **specialist/constructive** solver control: the network decides when to return a classical incumbent, rather than learning edits to a complete feasible assignment.

## Experiments

**Protocol.** Families are capacitated facility location, generalized independent set, maximum independent set, minimum vertex cover, optimal transmission switching and middle-mile consolidation network design. Most have800 training/100 calibration/100 test instances; OTS has only100 real instances for calibration/test, split28/72, with800 training instances separately listed. Models train for about30minutes on an A100. Evaluation uses EPYC9334 CPUs, single-threaded Gurobi12/COPT, presolve disabled and600seconds maximum; Gurobi MIPFocus=1. The stated hardware limit is1GB per solve. Target relative tolerance is.1%, nominal alpha=.05. These are solver settings, not a comparison against unrestricted default presolved multithreaded solvers (Table1/Section6.1).

**Gurobi gains and quality.** Mean times decrease from15.6 to3.7seconds(CFLP),37.0 to34.0(GISP),431.8 to96.2(OTS),245.2 to83.9(MMCN),221.0 to11.7(MIS),126.7 to14.3(MVC). These correspond to roughly76/8/78/66/95/89% time reductions, with GISP a clear small-gain case. Correct fractions within.1% are98/96/96.4/96/97/**88%**, respectively. MVC therefore does not achieve95% on the reported fixed test set. Mean gaps remain small, but a mean below tolerance is distinct from the correct fraction (Tables5–10).

**COPT negatives and baselines.** CP-COPT correct fractions are100/85/78.6/80/91/98% for CFLP/GISP/OTS/MMCN/MIS/MVC, versus100% in the corresponding full-solve rows. Its quality/time tradeoff must not be summarized as uniform95% empirical success. First/third-solution baselines are often faster but much worse in quality. Individual SCIP FP/RENS/simple rounding baselines have low or inconsistent feasibility/quality, while CFLP RENS already reaches100% within5%; those are isolated heuristic results, not complete SCIP performance (Tables4–10).

Linear and upper-bound-rate calibration can outperform the LSTM on particular axes: CFLP UB-rate is2.949seconds versus3.7, and MVC10.042 versus14.3; GISP simple models are also faster. Linear/full-solve gaps are often smaller. Table11's LSTM suboptimalities differ numerically from Tables5–10/13 despite matching times; retain the separately reported tables rather than pretending all values belong to one identical run. Looser deterministic solver tolerances can be faster with larger gaps, e.g. CFLP1% tolerance1.724seconds versus LSTM3.7 (Tables11–14).

**Sensitivity.** Perturbed generator parameters show no monotone average-gap deterioration through p=.2, but this is finite empirical evidence, not an estimated TV bound. Repeated calibration experiments show strong small-sample variance and undercoverage: c=5 gives about75–80% mean coverage, while c=100 still gives92.7% CFLP/92.8% GISP,95.3% MIS/96.0% MVC. The appendix acknowledges regenerated instances do not exactly reproduce unknown original generator parameters. Figure5 displays20 trajectories per family, including overshoot/error and differing convergence patterns (AppendixD/Tables15–16/Figure5).

## Limitations

### Discussed in the Paper

Training requires problems that the base solver can already solve, so this does not extend the frontier of solvable instances. Benefits depend on the gap between finding and certifying quality. Calibration assumes the same distribution; shift can hurt. More powerful sequence/graph architectures may be needed for longer or harder solves.

### Curator Notes

The printed endpoint theorem and empirical undercoverage must accompany guarantees. The public implementation is not byte-equivalent to the mathematical rule: cp.py calibrates the prediction immediately **before** the first safe label, then uses NumPy's alpha quantile without an explicit(c+1) rank adjustment. Its offline fast_eval stops at prediction≤threshold, so the step counterexample applies there. Both actual Gurobi and COPT callbacks instead use the **strict** threshold>prediction check; that particular tie example therefore does not demonstrate failure of their online callbacks. A general theorem for all these implementation choices was not established by this audit.

Current CPLSTM has an LSTM followed by one linear layer, with a tanh bounding transform; CFLP config specifies three LSTM layers, drops nodes/theta, uses an absolute threshold32.31723 and4GB rather than the paper's stated architecture/relative target/1GB. Online callbacks collect explicit inference time and evaluation returns full solver runtime; covariate elapsed time subtracts callback time. Finite differences in trajectory sampling and clocks matter. These are traceable release/paper differences, not proof that the published experiments were run with this current snapshot. No solver experiments were rerun.

## Reproducibility

- **Formal record:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/clarke26a.html), pp20968–20984, official citation_publication_date September29,2026. Both Princeton ORFE authors and PDF identity checked.
- **Complete materials:** all17 formal pages, complete bibliography and AppendicesA–D read. The theorem/inverse formulas and all sensitivity/convergence plots were visually checked. Publisher asset API lists only clarke26a.pdf; integrated appendices are complete. Official event61715 lists OpenReview nXsHRrysJX but no separate poster/scientific artifact. Normal OpenReview API403 recorded without bypass.
- **Code:** [author repository](https://github.com/stellatogrp/conformal_mip),11,090,245-byte84-member ZIP fully inventoried; its sole scientific-document candidate is the fully read README, with no additional PDF/TeX/notebook. Calibration, loss/model, both solver callbacks, evaluation and family configuration were checked. Current-code differences are explicitly separated above.
- **Relations:** ten actual text-plus-bibliography catalogue references are retained; unlisted surveys, non-neural branching and differently published/unmatched methods are not invented as internal nodes.
