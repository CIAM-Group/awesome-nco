---
id: cl-lns
short_title: CL-LNS
title: Searching Large Neighborhoods for Integer Linear Programs with Contrastive Learning
authors:
- Taoan Huang
- Aaron M Ferber
- Yuandong Tian
- Bistra Dilkina
- Benoit Steiner
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/huang23g.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/huang23g.html
institutions:
- University of Southern California
- Meta FAIR
- Anthropic
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
problems:
- Minimum Vertex Cover
- Maximum Independent Set
- Set Covering
- Combinatorial Auction
summary: Task-specific contrastive GAT destroy policies learn effective binary ILP neighborhoods; SCIP repairs them
  around a feasible incumbent.
code_url: https://github.com/facebookresearch/CL-LNS
---

# Searching Large Neighborhoods for Integer Linear Programs with Contrastive Learning

> **TL;DR:** A task-specific graph-attention destroy policy learns from both effective and ineffective local-branching neighborhoods. SCIP repairs its selected neighborhood around a feasible incumbent. Contrastive training improves anytime primal performance on the studied binary ILPs, without proving optimality or demonstrating a shared cross-task model.

## Motivation

Large neighborhood search(LNS) repeatedly chooses variables to unfix and reoptimizes them while retaining the other incumbent values. The destroy policy strongly affects both repair cost and objective improvement. Local branching(LB) can supply strong neighborhoods, but solving the full ILP with a Hamming-ball constraint is expensive. A single expert action also discards alternative effective neighborhoods and informative failures. CL-LNS amortizes that offline effort with supervised contrastive learning (Sections1-4).

## Contributions

- Positive neighborhoods include intermediate LB solutions delivering at least half the best observed improvement, rather than a single target action.
- Perturbed neighborhoods yielding at most5% of that improvement supply negative examples.
- A bipartite graph-attention policy combines static ILP features, root branching features and recent incumbent values.
- Top-score destruction, adaptive neighborhood sizes and SCIP repair form an anytime primal heuristic evaluated across four separately trained problem domains and doubled-size tests.

## Methodology

**Scope and LNS.** The formal experiments use binary linear programs min c^T x subject to Ax<=b. MVC, MIS, set covering(SC) and combinatorial auction(CA) have explicit binary formulations; maximization MIS/revenue are represented by negative minimization objectives. The method starts from a feasible SCIP incumbent, fixes the unselected variables, and invokes SCIP on the selected subproblem. Keeping the incumbent available allows feasible, nonworsening updates, but the restricted and time-limited neighborhood search is not a global optimality certificate (Section2/AppendixC).

**Expert data.** For each training state, LB adds a Hamming-distance bound to the full binary ILP. The conceptual optimum is the best point in that ball; the actual collection run has a one-hour SCIP limit, so its best found solution need not be certified neighborhood optimal. Up to ten intermediate actions with at least0.5 times the best found improvement become positives. The method replaces initially5% of expert-selected variables with unselected variables, solves each resulting repair problem, and increases the perturbation rate in5-point increments if necessary. Negatives have at most0.05 times the reference improvement, targeting nine negatives per positive. Collecting negatives is reported to take under five minutes per state. Collection uses fixed neighborhood sizes50/500/200/50 for MVC/MIS/CA/SC, rather than the larger testing sizes (Section4.1/Section5.1).

**Representation and learning.** Variable and constraint nodes are connected by nonzero coefficients. Features include the Gasse set, the previous three incumbent values and Khalil root features. Embeddings have dimension64. Eight-head attention first sends variable information to constraints, then back to variables; an MLP and sigmoid produce variable scores. The supervised InfoNCE objective increases dot-product similarity to positive binary action vectors relative to each positive and its negatives, using temperature0.07. This is an empirically motivated loss, not a new convergence or approximation-ratio theorem (Sections4.2-4.3/AppendixB).

**Deployment and sharing.** Greedy top-k scores choose the destroy set. After a nonimproving iteration, k grows by1.02 up to half the variables; at that cap, the described policy changes to sequential sampling without replacement, proportional to score^0.5. The current release's SAMPLE path instead uses independently sampled normalized inclusion probabilities, so its realized cardinality can vary. Each problem receives a separately trained model, and cross-domain policies are explicitly future work. Its common ILP representation therefore supports specialist improvement classification, not demonstrated generalist weight sharing (Sections4.4-6).

## Experiments

**Data.** Each domain has1,024 small instances split896/128 for training/validation and separate100-instance small/large test sets. MVC uses BA graphs with1,000/2,000 variables and about65,100/135,100 edge constraints. MIS uses sparse ER graphs with6,000/12,000 variables. CA has4,000/8,000 bids, with2,000 items in the small setting. SC has4,000/8,000 variables and5,000 covering constraints. Large means doubled variables in these specified distributions, not arbitrary distribution or domain transfer (Section5.1/Table1/AppendixC).

**Budgets and baselines.** Test runs have a60-minute overall limit, ten seconds for the initial SCIP solution and up to two minutes per repair. Test CPUs are2.5GHz Xeon Platinum8259CL with32GB RAM. Neural training uses an A10040GB, Adam1e-3, batch32 and30 epochs, typically converging in under20 epochs/24 hours. This excludes offline expert collection from test-time budgets. Baselines include SCIP8.0.1 BnB, RANDOM, LB-RELAX, IL-LNS and RL-LNS; appendix adds LB and graph-BFS destruction. BnB aggressive mode, neighborhood sizes and several baseline choices are validation tuned. IL-LNS is reimplemented because full original code was unavailable; RL-LNS selects the best of five training seeds on validation, and the authors could not reproduce its published CA results (Sections5.1-5.2/AppendicesD-E).

**Metrics.** Primal bound is objective value. Reported primal gap uses a precomputed best primal objective achieved within60 minutes by the comparison portfolio, not a certified optimum or dual bound. Primal integral integrates the gap over runtime; survival means the fraction below a specified gap, and best-performing rate counts ties, so rates may sum above one. The gap-to-virtual-best metric instead compares against the portfolio's best at the same time. Standard deviations in the tables summarize100 instances, not confidence intervals across independent training seeds (Section5.1/AppendixE).

**Main results and exceptions.** At60 minutes, CL-LNS small-instance gap/primal-integral pairs are MVC0.17%/8.7, MIS0.15%/12.8, CA0.65%/50.7 and SC0.50%/26.2. The corresponding large pairs are0.05%/9.1,0.12%/12.9,0.09%/116.1 and0.58%/39.2. It has the best reported final primal integral in all eight configurations. Final quality is not universally best: RANDOM's MIS-L gap0.11% and objective-4232.68 are slightly better than CL-LNS0.12%/-4232.50. SC-L's final1% survival rate is slightly below RL-LNS (Table2/Figure3/AppendixTables8/12).

**Earlier cutoffs and ablations.** CA-L at15/30 minutes favors LB-RELAX in gap,3.01/1.91% versus CL-LNS4.81/2.74%; at15 minutes RL-LNS has the lower primal integral58.1 versus61.3. The eventual CA-L gain therefore is not a lead at every runtime. Ablations on MVC-S/CA-S separate contrastive loss from GAT and richer features: MVC gap0.16% for GAT/partial features is marginally below full CL-LNS0.17%, although the full method improves the integral8.7 versus10.1. The LB comparison is per iteration, with LB consuming3,600 seconds each versus CL-LNS roughly2.2/1.3/25.1/50.1 seconds across domains; outperforming this bounded expert at a different tuned neighborhood is not beating an exact global solver (Figure5/Table3/AppendixTables9-12).

## Limitations

### Discussed in the Paper

The method does not guarantee optimality. Integration into complete BnB and policies that generalize across problem domains are future work. Neighborhood size, representation and training remain problem dependent; finite LB runs can struggle when their neighborhoods grow (Sections5.2-6).

### Curator Notes

The printed primal-gap formula on page6 divides |v-v*| by max(v,v*,epsilon), without absolute values in the denominator. For the paper's negative MIS/CA minimization objectives this literal denominator becomes epsilon, inconsistent with the small percentage gaps in its tables. The intended sign-safe normalization and raw calculations should be clarified; the note preserves the published table values rather than treating this typesetting/definition discrepancy as proof that the experiments are invalid.

Binary benchmarks do not establish performance for arbitrary nonbinary integers, continuous variables or unseen industrial MILPs. Expert collection, perturbed-neighborhood solves and model training are offline costs. The common representation is not evidence of one model across the four native tasks. The public SAMPLE implementation differs from the paper's fixed-cardinality sequential sampling description, so reproduction should identify the exact code revision. No solver benchmark was rerun in this audit.

## Reproducibility

- **Publication:** [ICML2023/PMLR202,13869-13890](https://proceedings.mlr.press/v202/huang23g.html), official issued date July3,2023; title/authors and USC/Meta FAIR/Anthropic affiliations checked against the proceedings/PDF.
- **Scientific coverage:** all22 proceedings pages, full bibliography and AppendicesA-E, every additional result table, architecture equations and key rendered figures. The linked [author project](https://taoanhuang.github.io/project/LNS_ILP) also embeds a one-page ICML poster; it was downloaded, registered, read and visually checked. The supplementary-PDF placeholder is inside an HTML comment and its URL returns404; the live publisher lists no extra supplement. The complete199MB author archive contains no additional scientific PDF/archive.
- **Implementation:** [facebookresearch/CL-LNS](https://github.com/facebookresearch/CL-LNS). README, data/loss selection, graph attention, greedy/sampling, adaptive-k and repair paths checked; the release includes example MIS instances/checkpoint and an Ecole feature-extraction patch/external updated library. It is not a full independent reproduction of all training sets and baseline outcomes.
- **Relations:** eighteen catalogue papers have both explicit body author-year citations and matching bibliography identities. These include learned ILP LNS/branching/cutting, neural routing/local rewriting, SAT contrastive representation learning and neural graph/SAT solvers; uncatalogued or nonneural background references are not added as local edges.
