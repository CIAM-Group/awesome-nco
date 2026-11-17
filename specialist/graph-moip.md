---
id: graph-moip
short_title: Graph-MOIP
title: Graph Learning Assisted Multi-Objective Integer Programming
authors:
- Yaoxin Wu
- Wen Song
- Zhiguang Cao
- Jie Zhang
- Abhishek Gupta
- Mingyan Simon Lin
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/710aae9186778a91b656e609778f7898-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/710aae9186778a91b656e609778f7898-Abstract-Conference.html
institutions:
- Nanyang Technological University
- Shandong University
- A*STAR
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Multi-Objective Integer Programming
summary: A task-specific GNN learns to skip scalarized MOIP subproblems, improving bounded-time front approximation
  at the cost of potentially discarding useful Pareto regions.
figure:
  path: paper-assets/graph-moip/framework.png
  alt: Graph encoding and graph learning for multi-objective integer programming.
  caption: 'Figure 2: Graph encoding and graph learning for multi-objective integer programming.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/file/710aae9186778a91b656e609778f7898-Paper-Conference.pdf
---

# Graph Learning Assisted Multi-Objective Integer Programming

> **TL;DR:** Learn when to skip scalarized integer programs inside an objective-space decomposition algorithm. This can improve bounded-time Pareto-front approximation, but false skips can discard useful regions and remove the base algorithm's completeness guarantee.

## Motivation

Objective-space decomposition algorithms repeatedly solve scalarized IPs to enumerate nondominated images. Some calls are infeasible or repeat an existing point. Identifying these calls cheaply could free a limited budget for more productive regions (Sections1–4).

## Contributions

- Cast the reduction/skip decision as a binary policy within an otherwise classical objective-space search.
- Encode variables, constraints and multiple objectives with a two-stage attention-based GNN and three pooled hypernodes.
- Use oracle-labeled solver trajectories for behavioral cloning, then test separate knapsack/assignment models, larger instances and additional objectives. The generic MOIP interface is not evidence of shared unchanged weights across those native task families.

## Methodology

**Classical foundation and theorem assumptions.** Local upper bounds define zones containing unexplored nondominated images. A strictly monotone scalarization, solved to optimality within a selected zone, returns a globally nondominated image. Classical finite enumeration requires the bounded, discrete setting and sound region updates/reductions. The infeasibility proposition uses containment of feasible regions and an already optimal scalarized reference. These are properties of the classical exact procedure, not a proof that a learned classifier can safely delete arbitrary zones (main Section3/Proposition3;supplement A.1–A.3).

**Learned decision.** A selected local upper bound defines a scalarized IP; the classifier predicts whether solving it would be infeasible or repeat an image. A score above0.5discards that bound without a solver call. Otherwise Gurobi solves the IP and the ODA updates its search region. The paper explicitly notes that false skips can ignore useful nondominated points. Thus exhausting the learned procedure's remaining bounds does not establish that the full Pareto front has been enumerated (Section4.1remark,4.2,5.1).

**Representation.** Nodes include variables, original/upper-bound constraints and objectives. Features contain coefficients, RHS values, ideal point, selected/defining bounds, bound statistics, current objective priority and statistics of historical solutions. Four message passes follow variable→constraint→variable→objective→variable. The second stage separately pools constraint/variable, objective/variable and constraint/objective node sets into three hypernodes, then produces a scalar sigmoid score. Hidden dimension is128; ε is fixed to0. Lexicographic scalarization optimizes a priority objective then the sum of the others without degrading that priority optimum (Sections4.3–4.4;supplement A.2,A.4).

**Supervision and training.** Run the original ODA, solve candidate IPs and label infeasible/repeated calls as skip1and useful calls as0. This needs no learned reward policy: the MDP describes the procedure, while training is supervised behavioral cloning. Labels come from original-ODA trajectories rather than a DAgger-style recollection under the evolving classifier. A1%state-data holdout selects checkpoints. Adam starts at0.001,batch64; learning rate multiplies by0.2after eight nonimproving validation epochs, with stopping after sixteen. Exact complete labels are collected for the small three-objective knapsack group; other groups use1,000-secondcollection budgets (Sections4.4,5.1;supplement Algorithm2).

## Experiments

**Task-specific datasets.** Multiobjective knapsack samples item weights/values1–100with capacity half total weight. Multiobjective assignment samples costs1–15. Four main groups are100-itemknapsack or50×50assignment with three/four objectives. Each has100training and10test instances. Four-objective models transfer to150items/75×75assignment or five objectives; extra experiments train six-objective models and test seven objectives. Models are trained separately for the respective problem groups, not shown transferring unchanged between knapsack and assignment (Sections5.1,5.3;supplement A.6).

**Budgets and baselines.** Gurobi9.5.1supports three ODA variants and the learned ODA-T wrapper. Most ODA/learned runs receive1,000seconds; evolutionary methods receive2,000seconds and PMOCO1,000seconds. The small three-objective knapsack case runs to termination. PMOCO is adapted to knapsack and is retrained for new objective counts, while the learned reduction policy transfers without that retraining. Other ODA computation uses an i9-10940XCPU and the GNN uses an RTX2080Ti; timing comparisons include different computational components (Section5).

**Completeness/time trade-off.** On MOKP(3-100), exact ODAs return4,169.8points on average, while the learned version returns3,379.7in486.9seconds versus ODA-T993.3seconds. Rounded HV0.55andIGD0.000are nearly identical, but the point counts show substantial incompleteness. A rounded zero distance is not exact Pareto-front equality. On the other main groups, the learned method generally finds more nondominated points within the fixed budget; e.g.MOAP(4-50)returns3,771.3versusODA-T2,663.7 (Table1).

**Metric reference quality.** `Card.` counts nondominated images for exact-scalarization ODAs/learned ODA, but feasible returned points for the other methods; these are not identical quality measures. Reported HV is normalized by the product of reference coordinates, with each instance's reference point chosen as coordinatewise maxima over all compared methods' points. IGD uses the known exact front only for MOKP(3-100); elsewhere it uses the pooled nondominated reference set obtained from compared methods. Such IGD measures agreement with an empirical reference, not distance to a proven complete front (main p.8;supplement A.7).

**Counterexamples and transfer.** More-objective/larger-instance results often improve ODA-T, but no blanket all-metric win holds. In Table2,MOEADreturns more feasible points on MOKP(5-100)andMOAP(5-50), and MOAP(4-75)IGD tiesODA-T. In supplemental seven-objective knapsack, PMOCO has slightly better HV0.512versus0.508andIGD0.064versus0.065, albeit with retraining for seven objectives. GNN classification also has exceptions: on MOKP(4-100)two-stageGIN82.5%beatsours80.9%; on largerMOKP(4-150)GCN70.4%beatsours68.6%; onMOAP(4-75)two-stageGIN95.2%beatsours95.0%. Classifier accuracy does not itself quantify the cost of false skips or prove front completeness (Tables2–3;supplement TableA.2).

**Ablations.** Useful nondominated points per solver call improve relative to ODA-T/its vanilla variant, supporting less futile solving on the tested groups. The largest easy case still loses points when skipping. The checklist supplies no independent-seed error bars, so average-over-instance tables should not be mistaken for uncertainty estimates across training runs (Figure3;checklist).

## Limitations

### Discussed in the Paper

False skip decisions can impair completeness. Hard scalarized IPs can remain the dominant bottleneck even after learning. Replacing exact IP solves with heuristics would further compromise nondominance guarantees; the authors leave that and other ODA integrations to future work (Section4.1remark,6).

### Curator Notes

The learned policy accelerates a specialist MOIP search component, with separate native-problem training. Exactness of retained IP solves does not restore regions already discarded incorrectly. Class imbalance, asymmetric false-skip cost, trajectory distribution shift,1%state-level validation and limited test-instance counts should temper broader generalization claims. Preserve solver/budget/reference-set definitions when comparing runtime, cardinality,HVandIGD.

## Reproducibility

- **Publication:** [NeurIPS2022proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/710aae9186778a91b656e609778f7898-Abstract-Conference.html), six authors, pp.17774–17787. Publisher HTML explicitly records `citation_publication_date=2022-12-06`. The PDF uses the full name Mingyan Simon Lin, shortened on the landing record.
- **Reading:** complete fourteen-page publisher article and [six-page supplement](https://proceedings.neurips.cc/paper_files/paper/2022/file/710aae9186778a91b656e609778f7898-Supplemental-Conference.pdf), including both proofs, bound updates, all features, additional tables and front visualizations. Manual Supplemental discovery matches this sole scientific PDF; key formulas/results were visually checked.
- **Code:** no author-confirmed implementation URL is supplied by the reviewed article/publisher record. The coauthor publication page's “Code&Paper” entry links back to that publication page, so it is not treated as a verified code release. Gurobi and the external MOIP benchmark library alone do not supply the learned wrapper.
- **Citation graph:** twelve exact catalogue predecessors are supported by explicit body citations and matching bibliography entries. Other cited IP/optimization papers were not replaced with similarly named catalogue works.
