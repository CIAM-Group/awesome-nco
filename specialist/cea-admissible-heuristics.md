---
id: cea-admissible-heuristics
short_title: CEA
title: 'Learning Admissible Heuristics for A*: Theory and Practice'
authors:
- Ehsan Futuhi
- Nathan R. Sturtevant
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/7f3b25e39e0f0330435d1ffc1d6fa193-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/7f3b25e39e0f0330435d1ffc1d6fa193-Abstract-Conference.html
institutions:
- University of Alberta
- Alberta Machine Intelligence Institute
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Rubik's Cube
summary: An asymmetric ordinal loss learns compact Rubik PDB heuristics with much lower but nonzero overestimation;
  exact admissibility, full-state proof coverage and neural sample-complexity proof steps remain qualified.
---

# Learning Admissible Heuristics for A*: Theory and Practice

> **TL;DR:** CEA learns compact Rubik's-Cube pattern-database heuristics with an asymmetric classification loss, greatly reducing overestimation compared with ordinary cross-entropy. The reported rates remain nonzero, and two steps in the neural sample-complexity proof require additional justification; these results do not certify universal admissibility or optimal A* solutions.

## Motivation

A* with reopening can use an admissible but inconsistent heuristic and still recover an optimal path. Neural estimates can guide search well but occasionally overestimate, invalidating that guarantee. Pattern databases(PDBs) provide exact abstract-state distances that are admissible for the original problem, at substantial storage cost. CEA tries to compress these tables into a small network while keeping strong average estimates and very few overestimations, alongside theoretical analysis of heuristic learning (Sections1–3).

## Contributions

- Fixed-graph and PDB-based pseudo-dimension analyses distinguish graph size from abstract-state size.
- A reopening-A* suboptimality bound uses the maximum heuristic overestimate along an optimal path; expected generalization results follow under boundedness/sampling assumptions.
- Network-parameter and goal-dependent extensions are stated, with proof limitations identified below.
- An ordinal CEA loss, delta-PDB targets and FP16 inference improve the compression/admissibility tradeoff on four Rubik's-Cube PDBs (Sections3–5/AppendicesD–J).

## Methodology

**Search assumptions.** Initial theory fixes a finite graph and goal, assumes every start can reach that goal, and uses a strict state order to resolve equal A* priorities. CLOSED nodes reopen when a better g-value is found. Most pseudo-dimension results further assume constant positive edge cost c0; the loss/classification setting uses discrete distance classes. Bounded utility u∈[0,H], i.i.d. training instances and a specified test distribution are required for empirical-to-expected uniform convergence. These are expectation/distribution statements, not pointwise admissibility of all unseen states or a learning-convergence theorem (Assumptions1–4/Proposition1).

**PDB and network.** Abstraction maps full cube states to corner/edge configurations and stores exact abstract distances, lower-bounding full-state cost. Classical min compression stores the smallest value in a group and therefore preserves admissibility. Learned compression instead feeds cubie features into a convolution/fully connected residual network with ReLU and softmax classification. Corner inputs have36 channels over3×3; edge inputs encode locations, orientations and fixed goal positions using3n channels. Separate PDB-specific networks are trained; neither theoretical goal-conditioning nor several cube abstractions establishes a shared checkpoint across different native optimization tasks. Thus **specialist/constructive** is retained for a learned cost-to-go component guiding the construction of a first search path (Sections2/4/AppendixG).

**CEA objective.** For a positive target class h*, the first term is minus the log of sum_(k≤h*)[(k/h*)^beta p_k], promoting probability on admissible classes while favoring stronger estimates. A small eta times ordinary cross-entropy sharpens the true class. Smaller beta/eta trades heuristic strength for lower overestimation. An ideal probability-simplex optimum at the true class would fit each labelled state, but finite neural optimization need not attain that optimum or generalize without error. The printed formula starts summation at1 and divides by h*: target0 therefore requires a class-index shift or explicit special treatment, which is not documented in executable code. This matters especially for the delta PDB, where over one million targets are0. It is a formula/reproducibility qualification, not a claim that the experiments necessarily divided by zero (Equation5/Table3).

The delta target is h_large−h_base; reconstruction adds the exact smaller PDB. Lower delta imbalance can help learning. Models train in FP32 and infer in FP16; despite the “post-hoc weight pruning” heading, this is precision reduction rather than evidence that individual weights were pruned. INT8 was tested and rejected because accuracy deteriorated (Section5).

**Theoretical scope.** Theorem3 bounds returned path cost minus optimum by max_(v on an optimal path)[h(v)−h*(v)], assuming reopening and h(goal)=0 with the stated finite/reachability conditions. This bound uses unknown true distances and an optimal path; it is not an efficient deployment certificate. Theorem4 bounds expected maximum overestimation via its empirical average and an explicitly bounded class. Finite individual h-values alone do not supply a uniform bound over an unrestricted parameter class. Theorem5's finite-class counting argument is n log(ell), written O(n) with the number of distance classes treated as fixed. Theorems6–7 additionally retain logarithmic dependence on represented-state counts, and goal-dependent terms in n/m, rather than removing all graph-size dependence (Sections3/AppendicesD–F).

## Experiments

**Full-table compression protocol.** Four learned targets are8-corner,6-edge,7-edge and delta(6,4)-edge. PDBs have88,179,840/42,577,920/510,935,040 states, with respective original storage44.09/21.29/255.47MB; the4-edge base has3,041,280 states/1.52MB. Training samples batches from the entire PDB rather than a fixed disjoint train/test partition. Many states may never be sampled, but the experiment is compression of a fully enumerated labelled domain, not generalization from scarce random instances of an unknown large domain. The description samples within classes proportionally to class size, which retains the original class marginals; exact rebalancing is unclear without the implementation (Section5/AppendixG).

**Reported strength and overestimation.** Table2 CEA mean estimate/rate/model MB are7.45/2e−5/3.75 on7-edge,8.76/3e−7/1.89 on8-corner,6.92/9e−5/1.95 on6-edge, and1.31/3e−6/3.20 on delta. Similar-size admissible min-compressed PDB means are6.83/6.84/6.68/1.05, with rate0. Ordinary CE gives stronger or equal mean estimates8.44/8.76/7.46/1.89 but much worse rates .014/.002/.09/.15. CEA therefore improves the strength-versus-error tradeoff; it does **not** dominate classical compression on strict admissibility, nor CE on mean estimate alone. Means/rates are different quantities, not optimality gaps for completed cube solutions.

The abstract/conclusion statements of around/below1e−6 across PDBs do not match Table2's6-edge9e−5 and7-edge2e−5. Claims of a “perfect” or “fully admissible”8-corner heuristic conflict with its nonzero3e−7 rate. AppendixFigure7 explicitly annotates202 overestimated corner states(2+21+59+9+11+78+21+1), about2.29e−6 of88,179,840, which also differs from Table2's rate. Other figures likewise show positive errors, including delta target0 states. These internal differences are preserved as unresolved reported-result inconsistencies; no single reconciled zero-error rate is invented (Table2/Figures6–9).

**Compression/parameter tradeoffs.** On corners, shrinking1.89MB to .86MB gives mean8.76→8.75 at the displayed3e−7 rate, approximately51-fold compression relative to44.09MB. At .51/.24MB, means fall8.57/8.24 and error rates grow2e−5/1e−3. This is an explicit loss of quality at extreme compression. Delta-model size should also be read with its required base-PDB lookup, rather than assuming all supporting storage vanished (Table5).

**Compute and evaluation limits.** Hardware is a32-core Ryzen Threadripper2950X and two RTX2080Ti GPUs. Adam uses roughly1e−3/3e−3 learning rates,100,000/500,000-state batches and two/three residual blocks depending on PDB. AppendixJ adapts beta/eta when progress stalls; Table4 and Figure5 give differing values/schedules, and the exact total training iterations/epochs are not numerically specified. Models are compared under stated equal iterations and matched approximate storage, without repeated-run error bars, complete per-call latency or full training wall-time tables. The claim of fewer than half as many generated search nodes cites a **separate2025 CPU/GPU batching paper**, rather than a standalone A* benchmark in this article. Figure2's decreasing empirical error is consistent with a square-root trend; it does not independently prove a rate or validate every proof assumption.

## Limitations

### Discussed in the Paper

There is a model-size/strength/admissibility tradeoff. Goal-independent Rubik's-Cube PDB experiments do not test the more general goal-dependent theorem empirically. INT8 inference loses accuracy. Joint design of search and learned heuristics with guarantees is left as future work.

### Curator Notes

Two specific steps in the **printed proof** of Theorems6–7 are not established. First, p23 treats argmax(softmax(Az)) as a polynomial of degree equal to final-layer width in theta=exp(A_ki). Argmax is discontinuous/piecewise constant, while theta^(z_i) has generally real ReLU-derived exponents, not the claimed polynomial form. Monotonic softmax ordering alone does not justify applying that polynomial sign-counting lemma.

Second, p7 defines representation set B using states encountered by search with the perfect h*. Such states need not cover all states expanded under another learned heuristic. A concrete unit-cost example has paths s→a→g and s→b→c→g. Perfect-heuristic A* generates B={s,a,b,g}, excluding c. Fix h(s)=h(b)=h(g)=0 and h(a)=2; tie order puts g before a. Setting h(c)=0 returns a cost3 path, whereas h(c)=2 returns cost2. Both heuristics agree on every B state but have different suboptimality. Hence partitioning only by outputs on that B does not fix all learned-A* performance. The root reviewer independently read pp5–7/23 and executed this A* check; evidence is saved in cea-root-independent-check.json. These observations limit the stated proof's coverage/polynomial steps, **not the possibility of repaired network-dependent bounds or the observed error reduction**.

Low average overestimation is insufficient for strict A* optimality. No correction table, verification mechanism or admissible fallback eliminating all positive errors is supplied here. HOG2 is explicitly cited as the PDB source; it is not a verified release of the CEA neural training implementation. Therefore its previous generic code badge/link has been removed from the paper metadata while the reproducibility reference remains below. No training/search benchmark was reproduced during this audit.

## Reproducibility

- **Publication/identity:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/7f3b25e39e0f0330435d1ffc1d6fa193-Abstract-Conference.html), pp78781–78811, citation_publication_date April20,2026. FormalPDF uses Nathan R. Sturtevant; publisher shortens Nathan Sturtevant. University of Alberta/Amii checked.
- **Scientific coverage:** all31 formal pages, complete bibliography and AppendicesA–J, all equations/proofs and each overestimation plot read. Key proof/loss/scaling pages and all four distribution pages rendered and inspected. Publisher/event10009069 expose no separate scientific/poster artifact; normal OpenReview WAQIxi7ifb API403 recorded without bypass. No explicitly missing scientific appendix was identified.
- **Artifact inventory:** [HOG2 PDB-refactor](https://github.com/nathansttt/hog2/tree/PDB-refactor) footnote is labelled a **PDB source**. Its complete, untruncated GitHub tree has3615 entries, one unrelated DSWA plotting Python file and129 PDFs entirely under snakebird puzzle-map inputs, no CEA training notebook/TeX/scientific supplement. Root README fully read; supplied Rubik/PDB C++ components are library/data-construction infrastructure. The snakebird inputs are not mislabeled as unread scientific appendices. Targeted author/CEA admissible repository searches yielded no paper-specific release; no byte identity to hidden submission code is assumed.
- **Relations:** AppendixA/p17 explicitly cites [the neural algorithm-selection sample-complexity paper](../studies/neural-algorithm-selection-theory.md); its four authors/title match bibliography p11. Other cited planning/Nature/workshop papers do not become internal graph edges without a matching catalogue identity.
