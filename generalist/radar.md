---
id: radar
short_title: RADAR
title: 'RADAR: Learning to Route with Asymmetry-aware Distance Representations'
authors:
- Hang Yi
- Ziwei Huang
- Yining Ma
- Zhiguang Cao
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/d28077e5ff52034cd35b4aa15320caea-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/d28077e5ff52034cd35b4aa15320caea-Abstract-Conference.html
institutions:
- Singapore Management University
- Massachusetts Institute of Technology
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Asymmetric Traveling Salesman Problem
- Asymmetric Capacitated Vehicle Routing Problem
- Asymmetric Open Vehicle Routing Problem
- Asymmetric Vehicle Routing Problem with Backhauls
- Asymmetric Vehicle Routing Problem with Duration Limits
- Asymmetric Vehicle Routing Problem with Time Windows
- Flexible Flow Shop Scheduling Problem
summary: Truncated SVD supplies directional cost embeddings and Sinkhorn balances encoder attention; one jointly trained routing checkpoint handles sixteen asymmetric constraint combinations, while synthetic single-task, real-data and FFSP studies use separate models.
code_url: https://github.com/yihang0410/RADAR
figure:
  path: paper-assets/radar/framework.png
  alt: Truncated SVD concatenates left/right distance factors into node features; encoder attention mixes dot products and both directional costs before Sinkhorn normalization, then a decoder constructs routes.
  caption: 'Figure 1: RADAR combines SVD-based initialization and Sinkhorn-normalized encoder attention.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=4
---
# RADAR: Learning to Route with Asymmetry-aware Distance Representations

> **TL;DR:** Initialize node embeddings from the left/right factors of a truncated cost-matrix SVD, then replace row-only encoder softmax with Sinkhorn normalization. A single jointly trained checkpoint handles16 asymmetric routing variants, supporting **generalist/constructive** classification. Synthetic ATSP/ACVRP, three real-data tasks and an FFSP transfer study use additional separately trained models.

## Motivation

An asymmetric cost matrix supplies directed relations without the convenient geometric coordinates used by many routing constructors. RADAR seeks informative initial node tokens and attention weights that consider both source and destination neighborhoods. “Dynamic asymmetry” means layer-dependent encoder interactions; it does **not** mean the main solver models live, time-varying road congestion. [Sections1–4.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=1)

## Contributions

- A compact initialization concatenates source/outgoing and destination/incoming truncated-SVD factors.
- Learned attention mixes dot-product similarity, directed cost and reverse directed cost, followed by Sinkhorn row/column normalization.
- The same recipe is integrated into MatNet, RouteFinder multitask routing and an RRNCO real-data pipeline, with distinct training protocols.
- Full ablations assess initialization, attention normalization, matrix normalization, rank, runtime and seed variation; AppendixH additionally tests SVD initialization in FFSP.

## Methodology

### SVD-based directional initialization

After per-instance mean/std normalization, approximate `D ≈ U_k Σ_k V_k^T`. Each node receives the concatenated row of `U_k sqrt(Σ_k)` and `V_k sqrt(Σ_k)`, together with its problem attributes, followed by a learned projection. Default k=10 gives20 relational features independent of node count. The two halves can be projected back to a rank-k approximation of D. This establishes a representation property, not exact reconstruction of an arbitrary full-rank matrix or guaranteed optimal tour preservation. [Equations1–5/Algorithm1.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=4)

The release uses randomized `torch.svd_lowrank`. SVD signs/bases are not uniquely determined, and the released multitask test script explicitly seeds this step because unseeded results vary slightly. The paper's “deterministic initialization” wording should therefore be understood relative to artificial random node identifiers, rather than as proof of bitwise deterministic output or exact sign/basis invariance.

### Sinkhorn-normalized attention

For each ordered pair, a small MLP combines query/key similarity, D_ij and D_ji. Ten alternating row/column normalizations produce balanced attention weights before value aggregation. The source uses log-space subtraction of `logsumexp`, avoiding a naive exponentiate-and-divide implementation. Its final normalization order differs from Algorithm2: finite iterations approximate both constraints, and do not make the matrix symmetric. Doubly stochastic attention is also not a feasible tour or routing-flow certificate. [Section4.2/Algorithm2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=5)

The constructor then masks invalid/visited choices and selects the next node autoregressively. No newly proposed neural operator edits a complete incumbent. Improvement/search integration is future work, so the paradigm remains **constructive**.

### Why scope changes to generalist

Section5.2 and AppendixB.2 train **one RouteFinder-based policy jointly on16 asymmetric capacitated routing variants**, combining optional open routes, strict linehaul-before-backhaul ordering, route-duration limits and time windows. The release loads one `radar_mtvrp100.ckpt` before looping through all16 test sets. This supplies direct shared-checkpoint evidence, rather than inference from a reusable architecture. The old specialist note is migrated to `generalist/radar.md` with its stable ID unchanged. [Section5.2/Table8.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=7)

The full set is ACVRP, AOVRP, AVRPB, AVRPL, AOVRPB, AOVRPL, AVRPBL, AVRPTW, AOVRPBL, AOVRPTW, AVRPBTW, AVRPLTW, AOVRPBTW, AOVRPLTW, AVRPBLTW and AOVRPBLTW. These16 share a checkpoint; the separate ATSP/ACVRP architecture studies, three real-data models and FFSP extension are not asserted to share those weights. Masks and environment rules explicitly supply each constraint.

## Experiments

### Three training/evaluation protocols

Synthetic ATSP/ACVRP train100-node models for2,100epochs ×10,000 instances, approximately21M presentations, batch64. Architecture is256-dimensional, eight heads, five encoder layers and512-dimensional feed-forward blocks; Adam starts at.0004 with weight decay.000001 and decay from epoch2001. A single RTX3090/24GB takes39.31hours ATSP and54.74hours ACVRP. Evaluation uses N greedy starting-point trajectories,1,000 instances per size100/200/500/1K, without adaptation. Table1 times are **whole-set wall time**, with ATSP batch sizes1,000/400/50/3. [AppendixB.1.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=14)

Joint routing trains300epochs ×100,000 newly generated instances, or30M presentations, batch256, Adam.0003 with drops at270/295. It evaluates1,000100-node instances per variant, again using node-count starts. The real-data branch trains200epochs ×100,000 instances with128-dimensional embeddings, eight heads and the reported12-layer setting; tests use1,280100-node instances, batch32 and eightfold coordinate augmentation. These budgets must not be combined into one universal model or one common runtime. [AppendixB.2–B.3.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=15)

Synthetic baselines are retrained with the stated normalizations, except released UniCO weights. ELG is modified for asymmetric inputs, and mixed-size training is disabled for ICAM/UDC. These controlled variants do not represent their original complete protocols. RouteFinder comparison variants also replace its attention and use either attribute-only or nearest50-cost initialization. Real baseline results are borrowed from the RRNCO study, while the release supplies newly retrained checkpoints.

### Synthetic and joint-routing results

| Synthetic size | ATSP gap / total time | ACVRP gap / total time |
| --- | --- | --- |
|100 |.72% /.04min |1.64% /.05min |
|200 |1.01% /.15min |-.75% /.14min |
|500 |2.13% /1.45min |3.39% /1.75min |
|1,000 |4.13% /11.57min |.96% /11.60min |

Gaps use heuristic LKH references. A negative gap means improvement over that run, not over a certified optimum. The attractive negative HGS rows in Table1 must be read with feasibility: short-budget HGS fails capacity constraints in25.9/48.7/92.2/6.6% of cases; long-budget rates are2.5/.1/4.6/0%. In particular, the fully feasible reported long-budget HGS1K objective1.9792 is substantially better than RADAR2.4634, at36.33hours versus11.60minutes for the whole set. Those quality/time and feasibility boundaries prevent a universal superiority claim. [Tables1/14.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=7)

The joint16-variant mean gap is1.3331% versus modified RF2.4688% and RF-NN1.9875%; all16 displayed neural quality comparisons favor RADAR. It is generally slower than those neural variants: ACVRP takes3.51seconds versus RF2.39seconds per1K-instance set. OR-Tools is more accurate on some constrained variants, such as AVRPTW1.43% versus1.92%, with a much longer CPU budget. [Tables2/8.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=17)

### Real maps and coordinate ablations

The inherited100-city dataset uses3×3km patches, asymmetric OSRM matrices and generated demands/time windows, with known-map, unseen-city and clustered tests. RADAR's in-distribution/held-out-city/cluster gaps are.74/.95/1.18% ATSP,2.61/2.62/2.59% ACVRP and2.71/2.81/3.07% ACVRPTW, with21/23/32seconds whole-set times. These are finite benchmark results, not deployed traffic-response evidence. [Table3.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=8)

Table3's RRNCO ACVRPTW costs122.693/123.249/41.077 match the **distance-plus-angle, duration-removed ablation** in RRNCO's formal paper, rather than its full three-input model122.466/122.986/40.937. RADAR calls these borrowed baseline results without explicitly explaining this version difference. The values are retained as printed and not silently relabelled as a full-model comparison.

Without coordinate augmentation, adding coordinates can worsen RADAR, e.g., held-out-city ATSP1.66→2.22%. Coordinate augmentation improves the displayed result to.95%. This distinguishes a useful source of candidate diversity from evidence that coordinates necessarily improve structural encoding. [Table4.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=8)

### Components, statistics and non-routing extension

The matched2×2 ablation gives ATSP1K gaps38.64% without either component,22.89% with SVD only,7.24% with Sinkhorn only and4.13% with both. Whole-set time changes11.11→11.57minutes. Removing SVD reduces training39.31→35.67hours, about9%; the relative inference overhead is smaller at larger N. Ten Sinkhorn iterations improve1K gap4.13% versus5.41% at five and11.67% at one. [Tables6/11–12.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=10)

Normalization is crucial: unnormalized RADAR reaches281.42%1K gap, min–max6.27% and z-score4.13%. Z-score is not always best for every baseline/size, and each table's plus/star legend must be interpreted locally. The alternative-factorization Table10 uses the SVD-only result1.9342 at1K, not the full Sinkhorn model's1.6389. Its symmetric/orthogonal EVD baseline does not prove that general eigendecomposition is impossible for asymmetric matrices. [Tables10/13.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=19)

Three independent ATSP100 training runs compare RADAR/ReLD, with standard-deviation training bands. Test boxplots use1,000 instances per size and independent two-sample t-tests. This supports the specified ATSP comparison; it is not uncertainty quantification for every routing task or independent-training replication of every main table. Sinkhorn heatmaps and low-rank information-retention descriptions are illustrative rather than proofs of generalization or exact reconstruction.

AppendixH replaces MatNet initialization with SVD features in **a separately trained FFSP20 model**, testing zero-shot50/100-job transfer. Makespans change28.0676→27.9727,52.5973→52.3042 and93.0295→92.4473, with modest time overhead. The zero gaps are relative to the SVD row, not proven scheduling optima. This demonstrates an initialization extension; it does not establish routing/FFSP shared weights or that every RADAR component was evaluated in FFSP. [Table15.](https://proceedings.iclr.cc/paper_files/paper/2026/file/d28077e5ff52034cd35b4aa15320caea-Paper-Conference.pdf#page=24)

## Limitations

### Discussed in the Paper

Rank is an empirical trade-off, and extending to richer relational optimization and neural improvement/search solvers remains future work. Current implementation/profile measurements motivate feasibility at the tested scales, rather than an unlimited-scale guarantee.

### Curator Notes

- Truncated SVD can discard useful cost structure; randomized factorization and nonunique singular-vector bases require seed/version care. The bilinear reconstruction argument is an approximate rank-k representation result.
- Finite Sinkhorn iterations balance encoder weights approximately, without making them symmetric or certifying valid/optimal routing decisions. Dense matrices, attention and multistart construction remain expensive.
- Joint-model generality covers16 explicit constraint combinations. Additional task/data/scheduling branches use distinct training budgets and checkpoints.
- Modified baselines, disabled varying-size training, borrowed real-data results, infeasible heuristic rows and GPU/CPU runtime differences limit broad rankings.
- The source generator uses demand/capacity for feasibility while separately normalizing demand by total demand for embedding. Its larger-size generation capacities60/80 at200/500 differ from the paper's80/100; supplied test datasets may have different provenance, so these are recorded separately rather than assumed identical.
- The released jointly retrained checkpoint README reports mean objective2.4842, while the formal table reports2.5047. The release is not asserted to reproduce that table byte-for-byte or numerically without a matched rerun.

## Reproducibility

- **Reading:** all24 formal ICLR pages, complete bibliography and scientific AppendicesA–I, including all15 tables, full16-task results, statistical plots, feasibility rates and FFSP extension, freshly read. Architecture/formulas and key tables/figures were rendered and visually checked.
- **Metadata:** actual publisher HTML confirms four authors, SMU/MIT affiliations, the Paper link and publication20April2026. Stable ID is preserved during the evidence-supported specialist→generalist migration.
- **Scientific inventory:** publisher page lists the complete paper; OpenReview API forlWdxX5s9T1 returned403. All namedA–I materials are inside the read PDF. The497-entry source tree and498-member fixed-commit ZIP contain no extra PDF/TEX/notebook/nested ZIP. All three READMEs and the sole framework PNG were inspected; Drive links are labelled datasets/checkpoints, not separate scientific text.
- **Implementation:** commita259579cd1cb34c786942defd24a36004aa301a6. SVD factors, standardization, directional score mixing, log-space Sinkhorn, demands, configs and the actual one-checkpoint16-task evaluation loop were read. The joint tester explicitly seeds randomized SVD. Separate real/synthetic branches retain different dimensions/checkpoints; no full training or benchmark rerun was performed.
- **Citation qualification:** actual in-text citations and full references were checked. The explicitly cited2025 OpenReview ICAM title/URLgyTkfVYL45 could not be independently linked to the catalog's formal ICAM manuscript from a primary author statement or direct submission text. It remains documented in the citation-identity audit without a forced graph edge. Other confirmed identities remain complete; a shared acronym/authors alone is not treated as proof.
- **Figure:** complete original Figure1, PDFpage4, cropped directly from the formal article. [Official repository](https://github.com/yihang0410/RADAR); [formal paper](https://proceedings.iclr.cc/paper_files/paper/2026/hash/d28077e5ff52034cd35b4aa15320caea-Abstract-Conference.html).
