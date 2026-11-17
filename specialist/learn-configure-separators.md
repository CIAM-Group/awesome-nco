---
id: learn-configure-separators
short_title: Learn Separator Configuration
title: Learning to Configure Separators in Branch-and-Cut
authors:
- Sirui Li
- Wenbin Ouyang
- Max B. Paulus
- Cathy Wu
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/bcdec1c2d60f94a93b6e36f937aa0530-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/bcdec1c2d60f94a93b6e36f937aa0530-Abstract-Conference.html
institutions:
- Massachusetts Institute of Technology
- ETH Zurich
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Separate task-specific graph bandit models choose sampled separator portfolios at limited solver rounds;
  positive median speedups coexist with negative mean MIPLIB improvement.
code_url: https://github.com/mit-wu-lab/learning-to-configure-separators
---

# Learning to Configure Separators in Branch-and-Cut

> **TL;DR:** Build a small portfolio of separator activation patterns, then learn instance-aware choices at two solver rounds. L2Sep changes upstream cut generation rather than selecting individual cuts; its conditional portfolio analysis does not certify speedup for every instance or the final neural policy.

## Motivation

MILP solvers invoke multiple separators to populate a cut pool, then a separate selector retains useful cuts. Generating unused cuts can consume time, and different separator combinations can affect later bounds and search. The task is to choose which separators to activate, potentially updating that configuration during the solve (Sections 1–4).

## Contributions

- Define separator activation as a combinatorial configuration problem, complementing downstream cut selection.
- Restrict both the configuration portfolio and update frequency using empirical performance, a conditional generalization model and a submodular training objective.
- Train configuration scorers with neural contextual-bandit exploration and evaluate separate task models in SCIP, plus separately configured single-update Gurobi experiments.

## Methodology

**Configuration and portfolio.** SCIP has seventeen controlled separator flags. Rather than enumerate all 2¹⁷ patterns across every round, sample roughly 1,700–2,700 patterns: patterns activating at most three separators and patterns near a good configuration found by a 500-pattern random search. Evaluate these on a small training set. Greedily add configurations that improve each instance's best available training result, rejecting configurations with poor average training performance. Manually chosen thresholds and final portfolio sizes of fifteen to thirty balance the two empirical terms; the resulting portfolio is not an exhaustive search of all policies (Section 5.1; supplement A.3/Table 7).

**Conditional analysis.** Proposition 1 assumes perfect generalization with probability 1−α and an independent uniform random configuration on mistakes with probability α. Under that stipulated mixture, expected performance decomposes into training performance and average portfolio quality. Lemma 3 adds an analogous random-error assumption for imperfect training. Replacing true configuration performance by empirical averages adds another approximation. These are modeling assumptions motivating filtering, not distribution-free generalization guarantees; worst-case context-dependent mistakes need not follow that mixture (main Proposition 1; supplement A.2).

**Submodularity boundary.** The empirical oracle objective F(A)=mean_x max_{s∈A}δ(s,x) is monotone submodular on nonempty portfolios. Standard greedy 1−1/e guarantees require a fixed cardinality budget and an appropriate normalized nonnegative baseline/objective. Raw relative time improvements can be negative and F(empty) is not specified, so the printed unconditional multiplicative guarantee on raw performance does not follow from monotonicity/submodularity alone. Even under suitable normalization, that result concerns empirical oracle portfolio selection, not sampled/filtered trade-off optimization, test-time neural generalization, two-stage policy quality or original MILP optimality (Proposition 2; supplement A.2.3).

**Two-stage learned control.** Freeze earlier predictors and train the next one on solver states produced by them. Update at round zero and round five for Tang tasks, eight for Ecole, or ten for the real-world datasets; hold each pattern until the next update/end. A triplet graph includes variables, original constraints/new cuts and separator nodes. Coefficient edges join variables/rows and complete connections join separators to both. Message passing, four-head attention on separators and pooled embeddings predict an instance/configuration reward. Training samples configurations using predicted reward plus gradient-based UCB uncertainty, collects solver feedback and regresses clipped reward with MSE. Point-estimate or UCB inference is chosen on validation data (Sections 5.2–5.3; supplement A.4–A.6).

**Resources and reward.** Seventy epochs sample six instances and eight configurations per epoch, repeating solver labels three times. Adam uses learning rate 0.001, batch 64 and the supplement reports 180,000 gradient steps. Relative-time labels are clipped below −1.5 to reduce expensive training runs. Configuration-space construction takes about thirty-six hours and policy training up to forty-eight hours on the reported cluster; these costs are separate from online solve-time comparisons (supplement Tables 8–10/A.6.4).

**Host guarantee.** Selecting among the host's valid separator algorithms does not itself add arbitrary invalid inequalities. Original-problem correctness/certification comes from the conventional branch-and-cut solver under its usual assumptions. Neither the bandit training nor portfolio theorem proves the learned controller is optimal or faster.

## Experiments

**Task/split definitions.** Tang bin packing, maximum cut and packing; Ecole auction, independent set and facility location; neural verification, load balancing and a filtered heterogeneous MIPLIB subset receive separate model/portfolio training. Default splits are 100 portfolio-construction, 800 network-training, 100 validation and 100 test instances. MIPLIB instead uses 30/270/55/88 from 443 filtered instances. The mixed MIPLIB model covers heterogeneous benchmark instances, but the paper/released manifest does not identify multiple native application-task examples for a shared unchanged-model test; Appendix A.9 explicitly leaves an aggregated model across MILP classes to future work. Specialist classification therefore remains appropriate under this repository's native-task criterion (Section 6.1; supplement A.6.4/A.9).

**Stopping and selection.** Standard tasks and verification solve to optimality; MIPLIB and load balancing stop at a 10% primal-dual gap. MIPLIB filtering removes infeasible/presolve-solved instances and those failing to reach 10% gap within 300 seconds, retaining about 40% of the collection. Verification is further restricted to instances solving within 120 seconds. These selections limit claims about the hardest original instances. Ecole auction/IS generation parameters are deliberately diversified. Set cover is omitted after an all-separators-off constant configuration already gives 88.6% median improvement and a learned instance-aware oracle adds less than one percentage point (supplement A.6.5).

**Reported metric.** Per-instance time improvement is (default time−configured time)/default time. Main tables report its median and standard deviation across instances; this is neither a ratio of aggregate times nor an average runtime reduction. Synthetic medians range from 28.5% to 72.4%; the maximum is independent set. Real-world medians are MIPLIB 12.9%, verification 37.5% and load balancing 21.2%. These refer to the stated stopping criteria, including 10% gap for two datasets (Tables 1/3).

**Critical mean/outlier result.** Supplemental Table 16 reports MIPLIB IQM +11.9% but mean relative improvement **−8.0%**, despite its positive median. Some severely slower instances therefore outweigh gains in the untrimmed mean of per-instance improvements. Verification mean is +29.9% and load-balancing +18.6%. The paper acknowledges negative outliers and proposes default-solver fallback detection as future work. “Improves all datasets on average” would be inaccurate without naming the statistic (supplement A.8.1/A.9).

**Ablation exceptions.** Two updates and UCB are useful overall, but not uniformly best: k=3 has bin-packing median 44.2% versus k=2 42.3%; offline supervised training has facility-location 31.0% versus L2Sep 29.4%, with four times the data. Rebuilding the second-stage portfolio improves several mean results but lowers IS median 72.4→68.7%. The unrestricted-space ablation also changes exploration to epsilon-greedy because UCB is impractical there, so it does not isolate only portfolio size (Table 2; supplement A.7/Tables 12–13).

**Gurobi and alternative objective.** Gurobi exposes twenty-one separator controls but only one pre-solve update is used; these are separately trained/configured tests, not transfer of the SCIP model. Medians range 12.6–56.7% on four tasks. A separate fixed-time objective reports mean relative gap improvements of 15.4–68.8%, using denominator max(g_default,g_policy)+ε, rather than simple division by the default gap. Its five short time limits and model objective must remain distinct from the solve-time tables (Table 4; supplement A.8.5/Table 17).

**Interpretation and comparisons.** Frequency plots recover some expected preferences (e.g. clique for IS) but also deactivate theoretically useful maximum-cut separators; these are empirical policy observations, not proofs of individual separator causality. Published comparisons to prior cut-selection results use different stopping criteria, curated datasets, metrics and machines and are explicitly contextual rather than controlled head-to-head rankings. Profiling shows reduced separator and later solver costs, but does not replace complete deployment accounting (Section 6.4; supplement A.8.2–A.8.4).

## Limitations

### Discussed in the Paper

Each MILP class requires data collection and model fitting. More frequent adaptive updates and a common model across classes remain future directions. Outlier slowdowns lower the mean relative to median/IQM; detecting those cases for fallback is unresolved. Empirical training/holdout agreement for configuration quality may fail on other distributions (supplement A.2.2/A.9).

### Curator Notes

Maintain the assumptions behind the mixture and oracle-portfolio analysis, the sampled/filtered action space, separate task/solver models, offline compute, solve-to-gap settings and negative MIPLIB mean. A heterogeneous benchmark label alone is insufficient evidence of shared native-task competence. Source inconsistencies also matter: the main text describes separator identity one-hot plus activation features (M+1), while supplement tables describe one activation feature; the current code's main network uses one-dimensional action features. These specifications should be reconciled when reproducing the published model.

The appendix's “three times default” hard-stop description is inconsistent with its stated −300% relative-improvement floor, which corresponds to four times default under Equation 1. The released test script explicitly uses four times default, precomputes configuration predictions in a preliminary context run and subtracts separator-manager callback time from the final measured SCIP time. Thus those script values should not be advertised as inclusive end-to-end prediction/controller wall time without separate measurement. This is a source/current-code accounting distinction, not proof of which revision produced the published tables.

## Reproducibility

- **Publication:** [NeurIPS 2023 proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/bcdec1c2d60f94a93b6e36f937aa0530-Abstract-Conference.html). Four authors at MIT/ETH match the publisher PDF; the note restores Max B. Paulus's full spelling. Official HTML metadata explicitly records `2023-12-15`.
- **Reading:** all fourteen main-paper pages plus [thirty-four publisher supplement pages](https://proceedings.neurips.cc/paper_files/paper/2023/file/bcdec1c2d60f94a93b6e36f937aa0530-Supplemental-Conference.pdf), including complete proofs, A.1–A.10, every experiment/profiling/mean table, all interpretation plots and duplicate references. Manual publisher Supplemental discovery matches this sole scientific PDF; the repository notebook is the documented portfolio-construction workflow, with no additional scientific PDF found in its recursive inventory.
- **Code:** [official repository](https://github.com/mit-wu-lab/learning-to-configure-separators) provides generators/filtering, portfolio notebook, training/test scripts and example task models. Its README requires customized SCIP 7.0.2/PySCIPOpt 3.3.0 interfaces and says the upstream plugin will be released; ordinary package installation alone is not sufficient evidence of full reproducibility. The README and present model/context/test paths were inspected, including the accounting differences above.
- **Citation graph:** eight exact existing catalogue papers are explicitly cited and matched to main/supplement bibliography identities. No relationship is inferred merely from using a common solver or graph representation.
