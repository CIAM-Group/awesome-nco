---
id: rl-sph
short_title: RL-SPH
title: 'RL-SPH: Learning to Achieve Feasible Solutions for Integer Linear Programs'
authors:
- Tae-Hoon Lee
- Min-Soo Kim
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/lee26ac.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/lee26ac.html
institutions:
- KAIST
scope: generalist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
problems:
- Integer Linear Programming
summary: A shared IS+MVC neural local-search policy repairs full integer assignments and improves feasible incumbents;
  conditional progress theory, exact reuse scope, empirical feasibility and benchmark/reference limitations are
  distinguished.
---

# RL-SPH: Learning to Achieve Feasible Solutions for Integer Linear Programs

> **TL;DR:** A neural local-search policy repairs complete integer assignments, then accepts improving feasible edits. A joint IS+MVC model demonstrates actual cross-task reuse, with further selected MIPLIB tests. Its100% feasibility rates are empirical, the progress theorem is conditional, and several baseline/large-instance results remain better.

## Motivation

Learning-based primal heuristics often predict partial assignments and rely on a classical solver for feasibility. RL-SPH instead learns to obtain a first feasible integer solution and subsequently improve its objective. It studies binary and nonbinary integer variables, distinguishing the difficulty of feasibility from proof of optimality (Sections1–2).

## Contributions

- A two-phase actor–critic reward balances bound/constraint repair, exploration and later objective improvement.
- ILP-GT encodes selected variables, numerical values and reward context using a graph-inspired Transformer.
- Feasibility-aware variable selection changes a logarithmic-sized subset of a complete assignment at each step.
- Five native benchmark families, a genuinely shared joint IS/MVC policy, selected MIPLIB cases, distribution/size/density shifts, solver integration and extensive ablations test the approach (Sections3–4/AppendicesA–I).

## Methodology

**Task/state.** The formal problem is min c^T x subject to Ax≤b, integer x and variable bounds. State contains the full current assignment, slack vector b−Ax and objective. Initialization is randomized rounding of an LP solution or a sparse0/1 assignment. The LP variant therefore includes a classical continuous solve; the random variant avoids this initialization solve. At each step, selected variables choose−1/0/+1; integrality is preserved from an integer start, while feasibility is explicitly checked. This is local search over complete vectors, not partial-variable prediction followed by an external integer repair solver (Sections2/3/AppendixC).

**Selection/encoder.** The policy receives2ceil(log2 n) variables: seeds selected by violated-constraint participation in phase1, or slack-related risk/objective weighting in phase2, plus variables sharing many constraints with the seeds. Unselected variables stay fixed. Structural coefficients are row-scaled, current values receive learned periodic embeddings, and bound-limit flags are appended. Reward context comprises phase, objective and scaled slacks; actor/critic heads are phase-specific with shared remaining layers. Attention operates on selected variables/context; it is not full attention over every original variable/constraint (Sections3.2–3.3/Algorithm2).

**Rewards and acceptance.** Phase1 prioritizes variable bounds and increasing the sum of negative slacks toward zero; an objective reward is allowed only under the prescribed feasibility-improvement condition. A−100 idle penalty encourages attempted movement. Phase2 rewards an objective-improving feasible assignment and penalizes worse/infeasible proposals, with default bias alpha2. Algorithm1 rolls back bound-violating phase1 moves, and in phase2 rolls back every proposal except an improving feasible one. Thus **phase2 accepted incumbents** remain feasible and improve monotonically; attempted actions need not be feasible, and the entire initial repair trajectory is not feasibility preserving. Algorithm3 deliberately repeats/resets phase1 until its training-stay limit before learning phase2 behavior.

Training uses64 parallel instances, RMSProp1e−4(decayed), weight decay1e−3, update limit5000, step budget2000 and phase1 stay500. Reward-derived TD actor/critic losses avoid near-optimal solution labels. The paper provides pseudocode but no verified paper-specific executable release (AppendicesC/G).

**Classification and shared weights.** The repository classifies RL-SPH as **generalist/improvement**, approved by the root reviewer. Table4 explicitly evaluates **one jointly trained IS+MVC model** on both native tasks, and AppendixH.2 applies this joint policy to selected MIPLIB instances. This is stronger evidence than a common ILP syntax or identical hyperparameters. Main five-family results nevertheless use separate models; single-task IS→MVC and MVC→IS transfer both fail. The policy edits complete assignments and includes neural feasible-incumbent improvement; initial repair does not turn it into a sequential constructive decoder.

**Conditional theory.** Proposition1 assumes every preceding infeasible step strictly increases the aggregate slack score while staying in bounds. AppendixA defines a uniform positive improvement delta and a sufficient horizon ceil(−D0/delta), with D0 the initial negative-slack sum. It is a conditional progress argument, not proof that the learned policy always finds such actions, that no local stagnation occurs, or that all ILPs are solved within a fixed runtime. Its positive minimum-delta argument is justified by a finite bounded integer state set or a common rational coefficient grid. Merely saying constant real A maps integer variables to discrete slack values is insufficient for arbitrary unbounded variables/irrational coefficients. The tested NBI integer coefficients satisfy a discrete grid; this qualification does not refute those experiments (Proposition1/AppendixA).

## Experiments

**Protocol/reference.** IS/MVC use Barabási–Albert graphs with1500/3000 variables; CA/SC use4000/3000; NBI has2000 nonbinary integers and2000 constraints. Each family has1000 training/100 test instances. All evaluations use one A100, two EPYC7302 CPUs and2048GB RAM. Main classical comparisons isolate SCIP8.1 heuristics by disabling presolve and branching, grouping15 diving and6 rounding variants into DHF/RHF. These are comparisons with isolated start heuristics, **not default complete SCIP**. Baselines have a1000-second limit; RL-SPH stops when their search ends. Separate learned-method comparisons use300/300/30 seconds on SC/CA/IS.

PG is normalized absolute difference to a **best-known feasible reference**, not necessarily a certified optimum. PI sums per-second normalized PG and uses1 before any feasible solution exists. PG/PI/first-feasible time are averaged **only over instances on which that method found a feasible solution**, so FR must accompany them; DHF's SC zero PG represents just1% feasibility. Main BKS is selected among compared methods; solver-integration BKS comes from1000-second SCIP. Reported deviations describe the published instance-level summaries, not an independently established training-seed confidence interval (Section4.1/Table1/AppendicesG/H).

**Main quality and counterexamples.** Both RL-SPH initializations attain100% FR on the five reported test sets. LP-initialized PG percentages are .14/3.82/9.67/.81/.22 on IS/CA/SC/MVC/NBI. RHF also attains100% FR everywhere; on NBI it has **lower PG0.00 versus.22**, with equal displayed PI11.3. LP initialization is not always the fastest route: IS first-feasible time .55seconds exceeds RHF.10 and FP.22; MVC1.55 exceeds RHF.20/FP1.17. Random initialization is fast but NBI PG28.32 is much worse than LP.22 or RHF0.00. The headline28.6-fold PG/2.6-fold PI/2.5-fold first-feasible improvements average dataset-baseline pairs restricted to100% FR, rather than universal gains (Table1).

**Other learned heuristics.** DDIM and DiffILO are evaluated under their released configurations on changed benchmark sizes; Table11 explicitly documents those differences, so zero-feasibility outcomes cannot be generalized to every original tuned setting. On IS, DiffILO PG.35/PI1.1 beats standalone RL-SPH(LP)15.35/7.1 under the30-second protocol. RL-SPH using DiffILO's initial candidate reaches PG0/PI1.0, showing useful initialization synergy; that policy was trained with LP initialization. SC/CA repair succeeds when the tested DiffILO instances have0% FR (Table2).

**Joint model and transfer.** Table4 matches both native tasks to1500 variables. Joint IS+MVC reaches100% FR, PG15.55% on IS and7.13% on MVC, compared with RHF17.65/9.06; its PI5.1/2.8 is **worse/tied** against RHF4.6/2.8. Separate task models give better within-task PG0%, but0% FR in the opposite task. Hence shared capability has a specialization tradeoff. The same joint model finds feasible solutions for17 selected MIPLIB instances within a100-second budget, averaging12seconds to first feasibility. Significant negatives include scpk4 objective13672 versus RHF765/BKS318, bppc8-02 1824 versus530/507, toll-like1774 versus1314/610 and queens−24 versus−27/−40. Other rows improve, e.g. seymour597 versus622 and gen-ip016−9352.3 versus−9229.3. These17 rows are not a success-rate claim over all MIPLIB (Table12).

The MIPLIB table includes continuous variables, whereas the formal action/integrality definition is ILP-specific. With no paper-specific code, exact handling of continuous coordinates is not independently resolved; the reported mixed-instance feasibility should not be expanded into a complete general-MILP action-space guarantee. Positive BA→ER IS, SC3000→6000/10000 and density5%→1%/10% transfers are additional **within-task** results, distinct from the joint native-task evidence (Tables13–15).

**NBI feasibility scope.** The NBI generator is an unbounded multidimensional knapsack-style maximization: nonnegative integer A, b=A xi+epsilon with xi_i≥1, epsilon>0, x≥0 and negative objective coefficients. Zero is immediately feasible, and every0/1 vector is coordinatewise≤xi and therefore feasible. In particular the stated random0/1 initialization already satisfies this generator's constraints. NBI still tests nonbinary **objective search** and LP-rounding repair, but100% FR on this distribution alone is not evidence of solving arbitrary difficult nonbinary feasibility problems (AppendicesC/G.1/Table8).

**Costs/ablations/integration.** Training takes31/32/26/83/23 minutes; DDIM's IS training14minutes is faster than RL-SPH31, despite average speedup claims. Feasibility-aware selection reduces most first-solution step counts but NBI requires46 versus27 uniform steps for better initial quality. Alpha5 worsens SC PG2.52 versus alpha1 2.39, and more neighbor variables harm CA; no setting dominates every metric. The total selection-plus-attention step is O(mn+selected_n²), **not polylogarithmic total runtime**, and a long-range-attention heatmap is an illustrative case rather than a universal representation proof (Tables5/10/19–21/AppendixI.4).

Hybrid RL-SPH+SCIP/Gurobi first takes feasible solutions for five seconds, fixes unanimous variable values and solves the reduced problem within50seconds. IS PG.14/PI.5 improves SCIP1.24/2.4; NBI Gurobi PI5.2→2.4 with PG.03→.03. Fixed-variable reduction can exclude an original optimum, as the authors acknowledge. These hybrid results use classical solvers and must be separated from standalone repair claims (Tables16–18). Larger±3/±5 moves are only a preliminary100-variable/50-constraint NBI study, not the default2000-variable benchmark (Table22).

## Limitations

### Discussed in the Paper

Feasibility is prioritized over global optimality. Very large scpk4 and unseen constraint structures such as bppc8-02 degrade solution quality. Variable selection remains O(mn), large structural projections can bottleneck, nonlinear constraints are untested, and better movement magnitudes/neighborhoods/perturbations remain future work. Solver-assisted variable fixing may introduce suboptimality.

### Curator Notes

Empirical100% FR and95.2% mean reward-condition adherence are different statements; the latter includes stagnation/recovery and does not meet the progress theorem's strict per-step hypothesis universally. The appendix's horizon/delta assumptions must accompany any theoretical feasibility claim. Best-known PG0 is not a proof of global optimum, failed-instance conditional metrics are selection-sensitive, and trivial feasible starts in the generated knapsack distribution need explicit context.

The ILP-GT projects instance-dependent constraint structure into learned input layers; individual family model sizes differ(2.4–6.2million parameters). Shared generality is therefore supported specifically by the matched-size joint model and its actual tests, not by asserting every separately trained network accepts arbitrary dimensions unchanged. A public paper-specific implementation/checkpoint was not identified in the publisher, official event or targeted repository search, limiting exact reconstruction of architecture resizing, continuous-variable handling and measured clocks. No training or optimization benchmark was rerun during this audit.

## Reproducibility

- **Formal record:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/lee26ac.html), pp64175–64204, official citation_publication_date September29,2026. Two KAIST authors checked.
- **Complete coverage:** all30 formal pages/references/AppendicesA–I and every table read; key reward/proof/joint/MIPLIB/ablation pages rendered. Publisher asset API explicitly lists only lee26ac.pdf. Normal OpenReview xEpcZDAxdW API403 recorded without bypass. No separate scientific supplement is referenced or listed.
- **Official poster/QR:** event60718's2502248-byte poster was fully inspected, including decoding its “more experiments” QR. Its ordinary redirect leads to [arXiv2411.19517v8](https://arxiv.org/abs/2411.19517v8), dated August3,2026. The v8 first page was separately read. Every complete text and rendered RGB pixel of pages2–30 exactly matches the already-read formal pages2–30; per-file/per-page SHA proof is saved in poster-qr-page-equivalence.json. Their source log explicitly records coverage via identical already-read pages, **not an independent rereading**. No additional experiments were hidden behind that QR.
- **Code inventory:** publisher/event/arXiv and targeted RL-SPH+ILP repository searches identify no paper-specific public code. Cited GraphTrans/numerical-embedding/actor-critic and baseline libraries are methodological dependencies, not falsely reported as the RL-SPH release.
- **Relations:** sixteen actual text-plus-bibliography references to existing stable IDs are recorded, including Neural Rewriter, joint-routing generality context and MILP branching/cutting/search baselines. Workshop Smart Feasibility Pump and differently titled unpublished/uncatalogued methods are not invented as internal nodes.
