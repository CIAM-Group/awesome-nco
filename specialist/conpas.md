---
id: conpas
short_title: ConPaS
title: Contrastive Predict-and-Search for Mixed Integer Linear Programs
authors:
- Taoan Huang
- Aaron M Ferber
- Arman Zharmagambetov
- Yuandong Tian
- Bistra Dilkina
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/huang24f.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/huang24f.html
institutions:
- University of Southern California
- Cornell University
- Meta FAIR
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Task-specific contrastive solution prediction guides classical partial-assignment search; infeasible/poor
  negatives improve reported budgeted BKS gaps and integrals with explicit incompleteness, tuning and reproduction
  limits.
---

# Contrastive Predict-and-Search for Mixed Integer Linear Programs

> **TL;DR:** Task-specific bipartite GCNs learn from good solutions and deliberately infeasible or poor nearby assignments. Their binary scores restrict a classical solver's search from scratch. Reported gap/integral gains are strong on the tested families, but do not imply complete or optimal search, universal superiority, or a shared cross-task model.

## Motivation

Neural Diving and Predict-and-Search learn from good feasible solutions, but may not distinguish a near-looking assignment that is poor or infeasible. Independent marginals do not capture joint feasibility. ConPaS asks whether explicit negative examples can improve the ranking used to choose which binary variables to restrict, while retaining the classical solver's role in constructing complete solutions (Sections1–3).

## Contributions

- Two tailored negative-data strategies: infeasible perturbations(ConPaS-Inf) and low-quality feasible neighbors(ConPaS-LQ).
- Supervised contrastive training compares positive and negative assignment vectors against one predicted score vector, with solution-quality-dependent temperatures.
- Integration with Predict-and-Search's partial-assignment Hamming trust region.
- Native-family and50%-larger-instance evaluation, including solver, data-fraction, hyperparameter and prediction-accuracy analyses.

## Methodology

**Positive/negative data.** The formal problem has binary and continuous variables; bounded general integers require extra encoding. For each training instance, one-hour Gurobi runs save up to50 best found feasible solutions. They are described as optimal/near-optimal but are not all independently certified optimal. Each positive supplies ten negative examples. Inf flips an initial10% of binary decisions, checking constraint violation for pure-binary MILPs or absence of a feasible continuous completion for mixed cases. If insufficient negatives are found after20 attempts, the flip rate rises in5-percentage-point steps (Sections2/4.1).

For pure-binary LQ, a reversed-objective local-branching MILP searches for the worst feasible assignments within an initial10%-Hamming neighborhood, retaining solutions worse than a quality threshold and enlarging the radius if necessary. For mixed variables the intended target is max over binary assignments of the **minimum** objective achievable by their continuous completion. A joint bad continuous assignment is not sufficient to make that binary assignment poor. The paper explicitly uses an iterative objective-threshold heuristic for this maximin target, with adaptive epsilon/radius, rather than an exact general bilevel solver or a proved maximizer (Eqs3–4/Section4.1.2).

**Network and training.** A variable/constraint bipartite graph encodes coefficients and node features. Two-layer64-unit ReLU MLPs embed features, followed by variable-to-constraint and constraint-to-variable half-convolutions; a final MLP and sigmoid produce binary scores. This is one full bipartite exchange, not two complete two-way GNN layers. The contrastive loss averages over positive assignments; each numerator scores that positive against the network prediction and the denominator includes it plus all negatives. Other positives are not treated as negatives. The main text weights reciprocal temperature according to negative energy for feasible samples, with a constant for infeasible ones. This is solution-ranking supervision, not likelihood calibration of a jointly feasible assignment distribution (Section4.2/AppendixA).

**Search/classification.** The model ranks binary scores. The k0 most confident zeros and k1 most confident ones define disjoint selected sets; a classical solver minimizes the original objective subject to original feasibility and at most Delta flips of those selected predictions. Delta0 is hard fixing. Larger Delta permits corrections, without guaranteeing that a globally best or any feasible solution lies inside the chosen region. This is **specialist constructive**: page6 explicitly trains a separate model per native family, and page3 explicitly distinguishes construction from scratch from CL-LNS's incumbent refinement. Seeding LNS or guiding branching/cuts is suggested as future/complementary use, not demonstrated neural improvement by this paper's solver (Sections2.3/3.3/4.3/6).

## Experiments

**Protocol and cost.** MVC/MIS use6000-node Barabasi–Albert graphs; CA2000items/4000bids; balanced item placement(IP) has about1050binary/33continuous variables. Each family uses400train/100validation/100test instances. WA is separately reported because it is relatively easy. Training uses Adam1e-3, batch8 and100epochs, usually converging within50epochs/five hours, on a P100; CPU tests use2.4GHz Corei7/16GB RAM. Each reduced test MILP receives1000seconds under SCIP8.0.1 with tuned restart/presolve/aggressive primal heuristics. The offline bill includes one-hour positive collection per training instance **plus** negative-sample optimization/feasibility checks and model training (Sections5.1/AppendicesB–C).

**Metrics and baselines.** BKS is the best primal bound found within60minutes by a portfolio, not a universal optimum certificate. Primal gap, its time integral(PI), and fraction below a chosen BKS-gap threshold measure different aspects. Survival thresholds are selected from the methods' median final average gap, rounded to.5%;100% survival means all instances meet that threshold, not that all are solved optimally. ND is a reimplementation because original code was unavailable, with only coverage.2/.3/.4 trained due to limited resources. PaS and ConPaS have separately tuned per-family search parameters; solver replacements have different tuned values (Section5.1/AppendixC).

**Main results.** The text reports Inf final-gap reductions3.54–52.83% and LQ9.82–86.02% relative to the best tested baseline. Table6 gives PI means: MVC2.8 for LQ versus13.9 PaS/10.7 ND; MIS5.4 versus34.5/22.9; CA19.7 versus28.9/71.0; IP192.0 versus236.8/244.0. Inf PI is3.1/5.5/24.0/221.8. These are substantial reported budgeted average gains; cross-instance standard deviations are also given, including IP LQ67.8. They are not reported confidence intervals over independently retrained seeds (Figures2–4/Table6).

**Scale/solver transfer.** Fixed native-family models transfer to9000-node MVC and CA3000items/6000bids,50% larger than training. LQ PI2.1 versus PaS5.0 on larger MVC and28.7 versus96.9 on larger CA corresponds to about58%/70% PI reductions. WA PaS and ConPaS curves almost overlap; LQ is only slightly better. Gurobi10.0.0-based restricted-search comparisons on MVC/MIS/CA also favor ConPaS in the reported plots, with the solver changed for all methods and separately tuned Table7 parameters. This is not a benchmark of one shared model across unrelated native tasks (Figures5/7–9/AppendixD).

**Ablations and negative cases.** The weighted contrastive objective improves unweighted InfoNCE in Table2, but source cells conflict: LQ CA PG.16% there versus.55% at the selected k0=2000 in Tables3/5; MVC PI2.9 there versus2.8 in Table6. They should remain distinct reported values rather than silently reconciled. A hyperparameter negative case is explicit: k0=800 yields ConPaS CA gap6.59/PI117.5 versus PaS6.28/114.4. At k0=2000 LQ improves both, while increasing to3000 worsens its gap to11.56%. More restriction can converge quickly to a poorer final result. Using50% of training instances performs similarly to100% in the CA study;25% degrades both methods, although ConPaS remains competitive (Figures6/Tables2–5).

Prediction classification accuracy does not explain every search gain: MVC ConPaS76.9% is below PaS81.2%, although AUROC.91 exceeds.88; CA accuracy86.9 versus88.3 and AUROC.86 versus.87 are both lower. The authors expressly warn that these metrics need not track downstream search quality (Table8/AppendixD.3).

## Limitations

### Discussed in the Paper

Restricted prediction-based search does not guarantee completeness or optimality. Threshold-aware generation was not compared because that concurrent implementation was unavailable to the authors. Extensive generalization/ablations focus on only MVC and CA due to compute overhead. Negative-sample collection and task-specific hyperparameter/model training incur costs. Integrating the predictor into optimal tree search is future work, not a guarantee supplied by the current pipeline.

### Curator Notes

The predictor supplies independent scores, while feasibility comes from the restricted classical solve. Solver exactness within a region does not certify the unrestricted optimum. The quality-temperature proportionality and printed primal-gap formula need precise objective-sign handling: the latter writes max(v,v*,epsilon) without absolute values even though MIS/CA are negative-objective minimizations. The reported sensible normalized curves do not establish that this literal expression was implemented; absent an identified author release, its intended task-wise normalization cannot be confirmed. No general optimum/approximation theorem follows from cited contrastive-learning motivation.

Mixed-variable LQ collection is explicitly heuristic. Imposing an objective lower threshold on a joint binary/continuous solution is not by itself a proof that the binary assignment has a poor **best** completion; the inner completion must be handled as specified by the maximin target. The available paper does not provide a convergence/global-bilevel guarantee, and the sample-collection expense should be counted separately from the1000second deployment budget.

The main best-baseline result is bounded by these benchmark families, tuned search parameters, limited ND coverage grid and empirical BKS portfolio. It does not establish universal SOTA or same-checkpoint native-task generality. Application illustrations on the poster are motivation, not additional evaluated VRP/energy/scientific-discovery solver tasks. No new solver run was performed in this audit.

## Reproducibility

- **Publication:** [ICML2024/PMLR235,19757–19771](https://proceedings.mlr.press/v235/huang24f.html), official publication date July8,2024. Five-author identity and USC/Cornell/Meta affiliations match formal page1; Aaron M Ferber is the publisher's expanded name.
- **Coverage:** all15 formal pages, complete references and AppendicesA–D read; formula, result, hyperparameter and accuracy pages rendered. PMLR manually lists only the integrated PDF. Official ICML event32626 poster826604bytes fully read; it repeats the core method/results. No extra scientific PDF/ZIP/notebook was linked in the checked primary publisher/event/author records.
- **Code:** no author implementation link was located in the checked PMLR/event records or Taoan Huang publication entry. The author's CL-LNS link is for a distinct earlier paper and is not mislabeled as ConPaS code. Architecture, data generation and search hyperparameters are provided in the paper, but code-level normalization/heuristic details remain unverified.
- **Relations:** ten explicit in-text and bibliography matches. Han et al.'s Predict-and-Search is printed with2022 despite its catalogue formal publication2023; matching full title/authors identify the same work. Citation to CL-LNS does not turn ConPaS into an incumbent-editing solver.
