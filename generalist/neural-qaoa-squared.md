---
id: neural-qaoa-squared
short_title: Neural QAOA2
title: 'Neural QAOA2: Differentiable Joint Graph Partitioning and Parameter Initialization for Quantum Combinatorial
  Optimization'
authors:
- Zubin Zheng
- Jiahao Wu
- Shengcai Liu
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/zheng26x.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/zheng26x.html
institutions:
- Southern University of Science and Technology
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Quantum Optimization
problems:
- Quadratic Unconstrained Binary Optimization
- Ising Model
- Maximum Cut
summary: A shared QUBO/MaxCut-trained generator transfers to Ising families through fixed graph reductions, configuring
  simulated QAOA² partitions and angles; TTA/reference/theory/runtime limits and stronger classical baselines are
  explicit.
code_url: https://github.com/0SliverBullet/Neural-QAOA-Squared
---

# Neural QAOA²: Differentiable Joint Graph Partitioning and Parameter Initialization for Quantum Combinatorial Optimization

> **TL;DR:** One shared pretrained neural generator proposes capacity-feasible graph partitions and circuit parameters for simulated QAOA-in-QAOA, with per-instance surrogate adaptation. It transfers across QUBO/MaxCut and untrained Ising families, but its strongest claim is improvement within that quantum divide-and-conquer pipeline; classical baselines often give better solutions.

## Motivation

Limited qubits motivate partitioning a large binary optimization problem into smaller quantum subproblems and merging them recursively. Handcrafted graph-partition metrics can disagree with eventual QAOA solution quality, while random circuit initialization ignores topology. This work learns both decisions together, using a differentiable predictor instead of repeatedly simulating circuits during neural adaptation (Sections1–4).

## Contributions

- A multi-view graph evaluator predicts QAOA² performance from global topology, partition-induced subgraphs and circuit parameters.
- A joint generator uses orthogonal-complement cluster centers, greedy capacity discretization and approximate straight-through gradients, followed by partition-conditioned parameter prediction.
- Shared distribution pretraining and per-instance adaptation are tested across183held-out/distribution-shift/large-scale graphs, circuit depths, qubit limits, noise models and classical comparisons (Sections4–5/AppendicesA–F).

## Methodology

**Binary task and quantum pipeline.** QUBO variables map to Ising spins, with linear terms absorbed using an auxiliary spin to obtain a weighted MaxCut representation. This fixed reduction is not evidence of solving arbitrary constrained optimization without an encoding. QAOA² partitions a graph, solves each subgraph, then chooses a polarity flip per local solution through a reduced MaxCut graph; recursion continues until the reduced graph fits the qubit limit. Classical reconstruction produces a complete spin/cut assignment. Fixing local patterns restricts the global search space; merging is exact for those fixed local patterns, not proof of the original optimum (Sections3/4/AppendixB.4).

**Evaluator.** Five standardized node features are degree, signed weighted degree, absolute-weight clustering/PageRank and absolute-weight-distance betweenness. Three64-dimensional,three-layer graph encoders capture the complete graph, masked intra-partition graph and sine/cosine circuit parameters. Pooled192-dimensional features pass through a256-hidden-unit MLP; a scaled sigmoid restricts predictions to(.5,1). The evaluator is supervised using simulated performance, then frozen (Sections4.1–4.2/AppendixA.3).

**Generator.** A128-dimensional,two-layer GAT produces embeddings. A frozen anchor pool and QR produce k orthonormal cluster centers orthogonal to normalized global context, then temperature.05 similarities yield soft assignments. This construction requires nondegenerate normalization and k≤h−1; the current implementation explicitly rejects k≥128, with at most127partitions. Greedy admission assigns every node to one partition while respecting available capacity, provided total capacity suffices. Straight-through identity gradients are an approximation, not the exact derivative of sorting or a proof of a globally improving discrete move. The appendix acknowledges O(Nklogk) row sorting and O(kNlogN) worst-case conflict work; a later reference to only the first cost is not the complete worst-case bound (Sections4.3/AppendicesA.1–A.3).

A stop-gradient protects the learned partition representation from parameter-head gradients. A GCN pools within partitions; an MLP and arctan2 synthesize circuit angles. Per-instance adaptation maximizes the **frozen evaluator**, retaining its best-scored partition/parameters, before QAOA simulation and merging. A better predicted score need not guarantee a better measured cut. Correlation studies support the surrogate empirically but do not certify its gradient or every generated configuration.

**Classification and actual shared weights.** This is **generalist/constructive**, approved by the root reviewer under the same fixed-reduction criterion as NeuroSAT. One GEN trains jointly on200B/BE(QUBO) andW(MaxCut) graphs, then transfers to unseen QUBO/Ising families and sizes; the released inference loader uses the same `generator_best_model_1766545107.pth` and evaluator across graph inputs. `utilities.py`177–180 loads those models, then adapts the generator for the current graph. Shared capability concerns a partition/quantum-parameter neural component plus the same QAOA² pipeline, not a universal end-to-end decoder. Neural TTA optimizes configurations before producing a complete primal cut; classical quantum-parameter optimization does not turn it into neural incumbent improvement (pp3–7/18; src/local_search.py55–92).

**Metric guarantee.** rho=(Cut−Neg)/(OPT−Neg), where Neg is the sum of negative weights. Proposition4.1's[.5,1] proof requires positive total absolute weight, **Cut at least the expected random-cut value**, and OPT an actual upper bound on Cut. AppendixD explicitly states the no-worse-than-random premise. Twenty local optimization steps followed by finite1000-shot sampling do not independently establish that premise for every realized output. Furthermore, p3 calls OPT a best-known cut; a merely feasible BKS need not upper-bound an improved cut, so the universal≤1 claim requires a certified optimum/upper bound or an explicit no-BKS-improvement condition. These are conditional metric bounds, not an approximation guarantee for every learned stochastic output (pp3/26–27).

## Experiments

**Protocol.** B/BE/W instances with IDs ending1or2 form50held-out tests; the other200graphs(51–501nodes) supply training/validation. Evaluator labels comprise52587heuristic-partition/random-angle configurations generated by simulation over about two days on fourA30GPUs. Evaluator/generator training takes2.65/2.12hours,100/1500epochs. The evaluator/generator learning rates are1e−3/4e−3, while TTA uses1e−3. Quantum subproblems normally have≤10qubits, depth1,20gradient steps, exact adjoint gradients and1000shots, using PennyLane lightning.gpu. For500nodes the recursion gives50+5+1=56subproblem calls; O(N) call count at fixed qubit budget does not include graph-feature/backprop cost or prove practical quantum advantage (AppendixB/C.6).

Each instance's rho averages10simulation runs; ranks and cross-instance standard deviations are different from confidence intervals over independent neural training seeds. Main results win28/50, OOD GKA/L60/93, and183-instance total101wins. OnB/BE/W the mean ratios are.8417/.8824/.9153. W average rank2.23 ties modularity, which wins9instances versusGEN8. On unseen IsingL, GEN wins more instances28/48 and has better average rank, but **lower mean ratio.8160 than boundary.8205**. On a separately ER-trained model, Regular graphs also favor modularity.8643 overGEN.8628. These are actual negative cases, not uniform distribution dominance (Tables1/2/10).

**Depth/qubit/size transfer.** The same learned depth1configuration is extended by classical INTERP to depths2/3, rather than training a new high-depth neural model. The overall mean exceeds compared initializers, while W average ranks favor modularity+INTERP/FOURIER atp2(4.54vsGEN5.08) andFOURIER atp3(5.04vs5.15). Hardware tests vary qubit limits5–15 on the50main graphs, distinct from claiming every1000-node case works at fivequbits under the127partition architecture cap. Large held-out HR/BMZ test graphs reach1000nodes. The “interpolation” label for21/31nodes in the prose actually describes sizes below the training minimum51 (Sections5.3–5.4/AppendixC.1–C.3).

**Budget and runtime.** Section5.5 recommends64TTAsteps, yielding.8892 at11.78seconds versusmodularity.8869 at7.27seconds, boundary7.26 andKL9.26; the neural method has a quality/runtime tradeoff, not dominance in both axes. AppendixB/Table8 separately specifies1000steps, associated with the.8930 main overall mean, so do not silently assign every main number to the cheaper64-step protocol. Figure4 explores up to4096steps, while1000defines an empirical ceiling elsewhere. AppendixC.6 reports64-step total times50.3/87.0/174.3/435.6seconds at51/101/251/501nodes, substantially different from the11.78second aggregate comparison without a reconciled common accounting explanation. Keep these reported clocks distinct. Effective adaptation steps to recover90% of the1000-step gain grow16/64/256/512; a finite empirical trend is not an asymptotic runtime theorem (Tables8/13/18).

**Classical comparisons.** Fine-tuned PI-GNN produces.9416/.9311 onB/BE, clearly aboveGEN.8417/.8824. GW onW gives.9473 versusGEN.9153. Thus at least one classical/hybrid baseline beats GEN in **each** of the three reported groups. The GW SCS relaxation has only25iterations and five hyperplane trials; these are particular baseline budgets. The paper explicitly narrows its contribution to QAOA² partition/initialization, rather than classical supremacy (Tables14–16/AppendixC.7).

**Ablations/noise/surrogate.** Removing evaluator views or OCH/stop-gradient reduces the64-step overall mean by.8–1.07%, with one-sided paired p-values. Generated-sample correlations are.8415 overall/.8146 on one representative TTA case; correlation is not calibration error or a certified bound against surrogate exploitation. Earlier evaluator checkpoints cause small quality losses, significant at the earliest one. The20% data row lists8314, although20% of42069would be8413.8, and “not statistically significant” is not an equivalence guarantee. Shot noise1000shots and readout bit-phase flips(p=.01/.05) slightly reduce means on16BEinstances. These simulated noise tests contradict a literal “limited to noiseless simulation” sentence inSection7, but still do not establish hardware results or full gate/decoherence robustness (Tables3–5/11/17/AppendicesC/D).

## Limitations

### Discussed in the Paper

The binary unconstrained structure and spin-flip symmetry limit direct use on strongly constrained TSP/MIS. Offline simulated labels cost time; a frozen surrogate is an indirect objective. High-depth training/barren plateaus are largely avoided by depth1training plus classical parameter expansion, not generally solved. Hardware-specific noise-aware learning and meta-learning remain future work.

### Curator Notes

Keep the conditional ratio premise, BKS reference status, finite-shot/local-optimization distinction and exact127partition cap explicit. QR orthogonality improves geometry but cannot guarantee distinct assignments or an unbiased discrete gradient. Higher mean quality at higher cost can be Pareto competitive among measured points; it does not prove global Pareto dominance. Formal main/appendix runtime and TTA-budget discrepancies remain traceable rather than reconciled by invention.

Current `QAOA.py` initializes unprovided angles at a constant.01 rather than the formal uniform random initialization. The source evaluator loader expects a `.pth` filename that some README download examples omit; the actual release has the `.pth` asset. The current64-iteration loop records before updating and skips its final backward step, so it executes up to63updates in that branch. These are release/formal differences, not a rerun or disproof of published tables. No physical quantum device or optimization benchmark was run during this audit.

## Reproducibility

- **Publication:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/zheng26x.html), pp163739–163766, citation_publication_date September29,2026. Three SUSTech authors, first-two equal contribution and formal title checked.
- **Full scientific materials:** all28formal pages, references, AppendicesA–F, all tables/proofs/figures read. Key QR/STE/conditional-proof formulas rendered. Publisher HTML provides the integrated PDF only; asset API404 and normal OpenReviewknVbandOWj API403 recorded without bypass. Official event62005 has16slides(11,783,696bytes) and a2,017,352-byte poster image, all fully read/rendered/visually checked, with no additional scientific appendix.
- **Code/release inventory:** [author repository](https://github.com/0SliverBullet/Neural-QAOA-Squared),15,101,015-byte691-member ZIP and fiveREADMEs manually checked(the two data READMEs are empty); no PDF/TeX/notebook attachment. Core generator/evaluator/partition/quantum/loader/adaptation routines checked. Releasev1.0(May10,2026) explicitly supplies one shared evaluator/generator pair and two optional serialized datasets, not hidden scientific PDF attachments. The1.88GBlabel dataset was inventoried as data, not falsely marked as a read paper.
- **Relations/classification:** four actual text-plus-bibliography stable-ID citations retained. Root approved generalist/constructive after full shared-loading/mixture-training/cross-family evidence. ID remains unchanged; only its note location/classification changes.
