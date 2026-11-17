---
id: neur2bilo
short_title: Neur2BiLO
title: 'Neur2BiLO: Neural Bilevel Optimization'
authors:
- Justin Dumouchelle
- Esther Julien
- Jannis Kurtz
- Elias B. Khalil
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/9ddb899a45c889af822fbc49957807ec-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/9ddb899a45c889af822fbc49957807ec-Abstract-Conference.html
institutions:
- University of Toronto
- Delft University of Technology
- University of Amsterdam
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Bilevel Knapsack Interdiction
- Critical Node Protection
- Donor-Recipient Subsidy Optimization
- Discrete Network Design
summary: Task-specific neural value-function surrogates embed bilevel decisions in MIPs, followed by classical follower
  recovery; printed lower-level guarantees require qualification.
code_url: https://github.com/khalil-research/Neur2BiLO
---

# Neur2BiLO: Neural Bilevel Optimization

> **TL;DR:** Task-specific neural value functions replace part of a bilevel problem with a solver-embedded surrogate, followed by classical follower evaluation/repair. The framework is fast on several reported applications, but its printed lower-level error guarantee and broad coupling-feasibility claim need mathematical qualification; neither should be presented as an established general guarantee.

## Motivation

A leader's decision changes a follower's feasible optimization problem. Solving that nested problem exactly can be costly, especially with integer follower choices or nonlinear interactions. Repeated instances from one application permit an offline collection of leader decisions and exact follower responses. Neur2BiLO learns value functions from those samples, then optimizes a compact surrogate with a MIP solver (Sections1-3).

## Contributions

- Upper-level approximation predicts the leader value after an optimal follower response and omits explicit follower variables.
- Lower-level approximation replaces the follower's optimal-value constraint in an optimistic value-function reformulation, retaining explicit leader/follower constraints and a penalized slack.
- Solver-representable neural/boosted-tree models combine instance information, per-decision features and problem-specific heuristic features.
- Evaluations cover knapsack interdiction(KIP), critical-node protection(CNP), donor-recipient subsidies(DRP) and discrete road-network design(DNDP), including negative comparisons and detailed cost/architecture appendices.

## Methodology

**Optimistic bilevel model.** The leader minimizes F(x,y), subject to G(x,y)>=0 and y being a maximizer of f(x,y') over follower constraints g(x,y')>=0. If multiple follower optima exist, the response most favorable to the leader is selected. The paper assumes attained follower optima and either follower feasibility for every x or no follower-dependent leader constraints. The empirical problems all have leader budget constraints independent of y; the paper explicitly notes that no benchmark with coupling G(x,y) was tested (Section2/Conclusion).

**Two surrogates.** NNu approximates the leader's optimistically evaluated value and is minimized over leader-feasible x; it applies only without leader coupling and may choose an x with an infeasible follower if complete follower feasibility is absent. NNl approximates Phi(x)=max f(x,y). The lower surrogate minimizes F(x,y)+lambda*s subject to both levels' constraints, s>=0 and f(x,y)>=NNl(x)-s. Slack avoids infeasibility caused by an overestimated follower value, but does not enforce follower optimality. After selecting x, the stated repair solves the true follower and then optimizes the leader over tied optimal follower responses with x fixed. This is a classical recovery procedure, not a neural edit of a complete incumbent (Section3.1/AppendixB).

**Networks and task sharing.** KIP/CNP/DRP use a set-based encoder: shared item-feature embeddings, sum aggregation and an instance embedding combine with decision-dependent features; per-variable predictions are weighted by known objective coefficients. Subnetworks have128-wide hidden layers, decision embeddings64 and instance embeddings32. KIP includes greedy/double-greedy features and an interdiction mask. DNDP uses a one-hidden-layer16-neuron network or50-estimator boosted trees on30 candidate-link indicators. Each task/size has configured features and separately trained models; sharing KIP upper/lower weights is possible because its two objective functions coincide, not because KIP/CNP/DRP/DNDP share one checkpoint. The scope remains specialist constructive (Sections3.2/AppendixK.1).

**Theory as stated versus established scope.** Upper approximation has the usual2*alpha additive argument if every relevant leader decision has an appropriate feasible response and the leader-value approximation has uniform absolute error alpha over all x. A validation average error is insufficient. For NNl, Theorem3.1 states opt+3*alpha+2*Delta/lambda under common leader/follower objective, uniform error and lambda>1, with Delta a largest gap between adjacent attainable follower values. The main experiments instead use lambda=1 and a DNDP ablation0.1. More seriously, the printed lower theorem and general coupling-repair statement have explicit counterexamples below; the reported formula is not accepted here as a generally valid guarantee (Sections3.1/3.3/AppendixD).

## Experiments

**Data and compute.** KIP/CNP/DRP sample1,000 instances and100 leader decisions each, giving100,000 labeled samples per configured problem. Thirty CPUs solve follower labels in parallel. Models use Adam0.01, batch32, up to1,000 epochs and early stopping after200 validation checks. P100/XeonE5-2683/64GB, PyTorch2.0.1, Gurobi11.0.1 and gurobi-machinelearning1.4.0 are reported. Offline labels/training range from seconds to over an hour in AppendixK.2; a statement that all runs take under one hour would be inaccurate (AppendicesJ-K).

**References and time.** Mean relative error(MRE) is100*abs(method objective-best-known objective)/abs(best-known objective), not a certified optimality gap when the reference is merely best found. KIP uses180 published small instances and100 per100-item setting; CNP uses300 per size. B&C has a one-hour budget for KIP/CNP, and the DRP baseline is a specialized B&C variant. DNDP uses60 fixed-base Sioux Falls instances with10/20 available candidate links and compares a5-second surrogate cap against5/10/30-second MKKT. Models are not tested on unrelated road networks. The current release saves Gurobi surrogate RunTime before true follower solves; its displayed time excludes those subsequent evaluations/repair, model construction and offline learning. ISNN comparisons include per-instance data/training for ISNN while Neur2BiLO amortizes those costs (Sections4-5/AppendicesF-G/current script).

**KIP positive and negative cases.** For n<=30, NNl/NNu mean MRE1.86% versus exact B&C0%, with reported times1.06/0.91 versus95.43 seconds. At n100, their mean error0.66% beats one-hour B&C7.64%, with28.80/27.15 seconds reported. The no-learning greedy surrogate G-VFA is stronger in mean quality at0.05% and31.07 seconds; at k25 it gives0%/4.19 seconds versus NNl0.93%/10.02. The high-budget22-item case has14.43% neural error despite subsecond surrogate optimization. These are meaningful speed-quality tradeoffs, not universal dominance (Table2/AppendixG).

**Other tasks.** Small CNP B&C has lower error than both neural variants; at100/300/500 nodes NNu gives0.56/0.33/0.45% versus B&C1.79/2.32/2.47%. DRP NNu reaches the best reported reference on all ten cases, while NNl has39.31% mean error and B&C26%. Table6 gives average times NNl0.11/NNu2.30 seconds, conflicting with main text's attribution of approximately0.1 to NNu; use the explicit table labels with this discrepancy recorded. DNDP means are NNl1.72%, NNu1.80%, versus MKKT6.62/1.76/0.29% at5/10/30 seconds: longer-budget MKKT is more accurate. GBT sometimes improves neural quality, and low lambda improves some lower-surrogate cases (Tables2/6-9).

**Ablation/distribution limits.** Greedy features improve KIP objectives but increase solve time; no-slack and dampened variants are not uniformly ordered. Some MRE columns in ablation Tables8/10 differ from Table2 despite identical mean objectives, so percentages must not be compared across those tables without resolving the reference calculation. CNP appendix Table5 repeats the500-node time entries in every row, conflicting with the size-dependent main Table2. Boxplots describe instance distributions, including large outliers; two500-node B&C failures are excluded from the CNP plot. None of these plots supplies a uniform prediction-error bound (AppendicesG-I/K.3).

## Limitations

### Discussed in the Paper

The framework is heuristic and depends on regression error. Upper surrogates may be infeasible; lower surrogates can be larger and harder. The benchmark lacks leader coupling constraints. Extensions to uncertainty, decision-dependent robust optimization or more than two levels remain future work. Current README says the self-contained DNDP notebook will be uploaded later (Sections3/7/README).

### Curator Notes

**Printed lower-bound theorem counterexample.** Take x in{0,1}, Y=[0,4], follower max y subject to y<=4x, and leader min F=f=y. Let NNl(x)=1+2x, alpha=1 and lambda=4. Follower feasibility/attainment hold; Phi(0)=0, Phi(1)=4 and the predictor's uniform error is one. Continuous follower values give Delta=0. The surrogate at x0 has y0,s1 and value4; at x1 it chooses y3,s0 and value3. Repair returns y4, whereas the true optimum is0. Thus the printed upper bound3 is violated by the returned value4. AppendixD page18 drops the lambda multiplier in its initial surrogate optimality comparison. This is a counterexample within the stated theoretical scope, not an observation of degraded experimental outcomes.

**Coupling-feasibility counterexample.** Let x,y be binary, follower max y with no additional restriction, leader min x and coupling y<=x; set NNl=0. Every x has an attained feasible follower optimum y1, but the surrogate selects x0,y0,s0. At fixed x0 no follower-optimal y satisfies the coupling; only x1,y1 is bilevel feasible. Assumption1(i) plus attainment therefore does not alone ensure the broad repair guarantee on page5. Extra compatibility between follower optima and leader coupling is needed. The four tested families have no such coupling, so this does not establish invalid empirical solutions. Both mathematical counterexamples were independently checked against the rendered original pages by a second reviewer.

**Release/statistics evidence.** `test_model_predictions` overwrites mae_cur at every sample and returns only its final value divided by sample count, rather than the sum of absolute errors divided by count. The current release's statistic called MAE is therefore not MAE; the extremely small Table13 values cannot be treated as verified averages or theoretical alpha. The KIP optimization path also zeros the instance embedding where the training forward pass explicitly keeps it, so their represented predictors differ in that revision. These are code/provenance findings, not proof that every historical table used those exact paths. No training or optimization benchmark was rerun.

## Reproducibility

- **Publication:** [NeurIPS2024 proceedings](https://proceedings.neurips.cc/paper_files/paper/2024/hash/9ddb899a45c889af822fbc49957807ec-Abstract-Conference.html), official issued date December16,2024; authors and Toronto/TU Delft/Amsterdam affiliations verified.
- **Scientific coverage:** all32 proceedings pages,60 references, AppendicesA-K and complete checklist. All six scientific boxplot PDFs in the author main ZIP and the one-page [official project poster](https://khalil-research.github.io/Neur2BiLO/) were separately registered, fully read and rendered:39 source pages in total. Publisher action links contain no additional supplement; project/ZIP inventories were checked. Ordinary OpenReview API requests for both linked IDs returned403, without bypass.
- **Implementation:** [khalil-research/Neur2BiLO](https://github.com/khalil-research/Neur2BiLO), README/command guides, regression evaluation, surrogate embedding/slack, optimizer timing and follower recovery inspected. The archive supplies many problem instances/models/results; this audit did not execute pickle assets or reproduce them. Gurobi11/CPLEX12.7 requirements and DNDP availability limits are recorded.
- **Relations:** one current-catalogue citation, Neur2SP[19], explicitly appears in the related value-function work and bibliography. Neur2RO[20] and binary-tender learning[59] are cited by the source but absent from the current catalogue, so no invented local relation is emitted.
