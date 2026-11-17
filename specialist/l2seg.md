---
id: l2seg
short_title: L2Seg
title: Learning to Segment for Vehicle Routing Problems
authors:
- Wenbin Ouyang
- Sirui Li
- Yining Ma
- Cathy Wu
year: 2026
date: '2025-06-22'
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/f274af80a7a3aa9ed23ba6f7908470bc-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2507.01037
institutions:
- Massachusetts Institute of Technology
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Vehicle Routing Problem with Time Windows
summary: Predict unstable incumbent edges with global non-autoregressive and local autoregressive models, aggregate stable segments into hypernodes, and warm-start an iterative solver on the reduced problem; CVRP and VRPTW use task-specific settings.
figure:
  path: paper-assets/l2seg/framework.png
  alt: FSTA predicts unstable edges, aggregates stable segments, reoptimizes and recovers routes; L2Seg-SYN uses NAR predictions to seed local AR edge detection.
  caption: 'Figure 2: FSTA and the NAR, AR and synergized L2Seg prediction pipelines.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=4
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/f274af80a7a3aa9ed23ba6f7908470bc-Abstract-Conference.html
code_url: https://github.com/mit-wu-lab/learning-to-segment
---
# Learning to Segment for Vehicle Routing Problems

> **TL;DR:** L2Seg learns which **existing solution edges** may change under further search. It temporarily fixes the remaining segments, aggregates their nodes and lets a warm-started solver improve the reduced problem. Its synergized predictor uses global NAR detection to seed local AR edge prediction. It remains **specialist/improvement**: the neural decision guides incumbent refinement, and no shared checkpoint across CVRP/VRPTW is established.

## Motivation

Repeated local search often leaves much of a routing solution unchanged. Spending further work on those stable interiors can be wasteful, particularly when vehicle capacity permits long routes. L2Seg seeks useful search-space reduction by learning instability patterns from a look-ahead solver. “Stable” is **relative to the next budgeted solver invocation**, rather than a certificate that an edge belongs to every optimum or should never change. [Sections1–3/AppendixA.1.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=1)

## Contributions

- First-Segment-Then-Aggregate (FSTA) removes selected unstable edges, compresses the remaining consecutive segments and recovers original routes after re-optimization.
- A route-aware Transformer plus graph-attention encoder combines incumbent structure, spatial information and engineered node/edge features.
- Non-autoregressive, autoregressive and synergized prediction variants trade global coverage against local precision.
- The framework enhances LKH-3, random-neighborhood LNS and Learning-to-Delegate (L2D) on CVRP and capacity-constrained VRPTW. Its theoretical discussion also considers backhauls and single-commodity pickup/delivery, separately from those measured tasks.

## Methodology

### Compression within incumbent search

Starting with a feasible solution, identify edges to release, always including depot-incident edges. Removing them partitions routes into consecutive segments. In CVRP, each segment is represented by its two endpoints with half its total demand at each endpoint; the connecting edge must remain fixed in the reduced solver. Expansion restores its internal customer sequence. VRPTW additionally aggregates windows, service and internal travel time, using one or two hypernodes according to the temporal representation. Single-hypernode aggregation fixes direction and can create asymmetric costs; dual endpoints permit appropriate reversal only where task constraints allow it. [Figure2/AppendicesB.1–B.2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=4)

The paper's feasibility and monotonicity arguments concern **valid, task-specific aggregation with fixed segments**. Objective values differ by a segment-dependent constant, so an improvement within that reduced space transfers to the original space. This is not equality of all objective values, preservation of the entire unrestricted search space or guaranteed global improvement at every call. False-stable predictions can remove beneficial moves. The printed single-commodity pickup/delivery formulas also have a conservation inconsistency described below.

### What the neural models predict

Node features include demand, route centroid/neighbors, depot angles, local distances and proportions of nearby nodes on the same route; VRPTW adds window/service attributes. Route-masked Transformer layers encode incumbent sequences, followed by graph-attention layers over solution edges and k-nearest-neighbor relations. NAR predicts unstable-node probabilities in one pass; its standalone variant releases associated incident edges. [Figure3/Table8.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=5)

AR predicts a sequence alternating between **marking an existing edge unstable** and selecting a pseudo-insertion edge that bridges to another region. These pseudo insertions model dependencies; they do not themselves edit the routing solution. A GRU and shallow deletion/deeper insertion attention modules choose the sequence. In SYN, approximately adjacent-route-pair subproblems are processed in batches; NAR probabilities above.6 are clustered into three regions, whose highest-probability nodes seed AR. The intended final unstable set combines AR predictions over seeds/subproblems, rather than releasing every NAR-predicted incident edge as well. [Section4/Algorithms3–5.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=7)

### Supervised labels, initialization and backbones

A look-ahead solver improves each incumbent, and the symmetric difference between old/new edges supplies binary unstable-node labels. Connected components spanning at most two routes provide alternating AR target sequences, with improvement/sampling filters. NAR uses positive-weighted binary cross-entropy; AR uses stage-weighted cross-entropy. No differentiable gradient through the classical reoptimizer is required. [Section4.2/Algorithm2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=6)

Initialization uses a **classical** angular sweep into groups of roughly six vehicles' demand, factor.95, followed by parallel LKH-3. LNS then samples three adjacent routes and runs LKH-3 for up to1,000 local-search updates; L2D learns neighborhood delegation before the additional L2Seg model is trained. Warm-start support and fixed-edge constraints are practical requirements. HGS is a comparison baseline, rather than an already demonstrated plug-in host without modifications. [AppendixD.1.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=31)

## Experiments

### Data, training and time accounting

For each problem type/scale,1,000 training instances and40 look-ahead steps produce transitions from which a variable number of node and sequence labels are extracted; these do not imply exactly40K independent AR examples. Validation uses30 instances per configuration. Both networks train200epochs, batch128, Adam at1e-3 for large-capacity CVRP and1e-4 for small-capacity CVRP/VRPTW. Positive-class weight is9; insertion/deletion weights are.8/.2. Hidden dimension128, two route-Transformer layers and two graph layers are reported, with one deletion and four insertion attention layers. [Tables9–10.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=32)

Table16 includes data collection: CVRP1K takes6.3h data +6.8h NAR/13.7h AR, totaling20.0h **with parallel network training**;2K totals32.8h and5K59.9h. The stated10K/six-day figure is an extrapolation, not a measured10K experiment. A V100 is the specified GPU; total hardware allocation for the parallel timing is not fully detailed.

Large-capacity CVRP uses100 test instances at2K/5K nodes, capacities500/1,000 and150/240second **per-instance** limits. Standard CVRP uses1,000 instances per scale, capacities200/300/300 at1K/2K/5K and150/240/300second limits. VRPTW uses100 instances per scale with120/240/600seconds. Its windows follow Solomon-style generation and service time is.2. Runs may overrun limits by several seconds. Some neural baselines are borrowed with their original hardware/budgets; SIL/NDS are rerun on V100. CVRP comparisons use common instances, whereas VRPTW comparisons are described as common-distribution instances. [Section5/AppendixD.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=8)

### Main comparisons

At the large-capacity fixed budgets, SYN improves LKH-3 by2.92%/1.87%, LNS by3.34%/1.16%, and L2D by.78%/.50% at2K/5K. The headline **2–7× acceleration** describes time to reach comparable quality on search curves, rather than every full run taking2–7× less wall time. [Table1/Figure5.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=8)

| Standard benchmark | SYN–L2D cost | HGS reference cost | Per-instance time |
| --- | --- | --- | --- |
| CVRP1K |41.23 |41.20 |2.5min |
| CVRP2K |56.05 |57.20 |4.1min |
| CVRP5K |121.87 |126.20 |5.1min |
| VRPTW1K |87.25 |90.35 |2min |
| VRPTW2K |163.74 |173.46 |4min |
| VRPTW5K |333.4 |344.2 |10min |

SYN–L2D improves the displayed larger-scale references, but **CVRP1K HGS41.20 and NDS41.16 remain better than41.23**. SYN–LKH alone is also worse than HGS on VRPTW5K,345.2 versus344.2. Negative HGS-relative gaps denote a better heuristic run, not performance beyond a certified optimum. Main-text claims of universal superiority should be read within these rows and budgets. [Table2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=9)

### Components, transfer and uncertainty

Randomly releasing40%/60% of edges worsens large-capacity CVRP2K from LNS44.92 to46.24/46.89, while SYN reaches43.42; engineered features improve its ablation43.65. SYN's reported89.02% recall/61.24% true-negative rate balances the NAR/AR alternatives, but labels depend on the look-ahead solver and budget. An oracle study excludes the cost of obtaining its look-ahead labels and is not an attainable inference runtime. [Tables3–6.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=9)

Synthetic2K/5K models transfer to CVRPLib:600second SYN–LNS gaps are6.9% for Set-X and12.0% for Set-XXL, compared with reported UDC×2507.1%/13.2%. At240seconds Set-X7.5% is worse than7.1%. Seven-cluster and heterogeneous-demand tests give zero-shot LNS gains.82–3.10%; separately trained in-distribution models give1.02–3.54%. This establishes specific distribution transfer, rather than a shared cross-constraint checkpoint. [Tables11–12.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=34)

Five **test-seed trials** supply mean/std for the six large-capacity backbone/SYN methods; they do not establish independent-training replication for all main results. Some SYN standard deviations are slightly higher than their backbones. Predicted-edge overlap increases gradually over iterations without a convergence proof. Measured SYN overhead is7.2–9.6% of iteration time on1K–5K CVRP/VRPTW; this finite profile does not establish arbitrary-size memory/runtime scaling. [Tables13–16.](https://proceedings.iclr.cc/paper_files/paper/2026/file/f274af80a7a3aa9ed23ba6f7908470bc-Paper-Conference.pdf#page=35)

## Limitations

### Discussed by the Authors

Not every VRP solver or variant is guaranteed to benefit. High true-negative rate can freeze useful edges and cause premature convergence; high recall leaves a large search problem. Warm-start/fixed-edge interfaces limit immediate host compatibility, and other solver integrations are future work.

### Curator Notes

- The general FSTA recipe is broader than its empirical two-task coverage. Distinct problem/scale settings and25-versus28-dimensional inputs do not supply evidence of a single joint CVRP/VRPTW checkpoint.
- **Printed1-VRPPD formula:** AppendixB.1.5/Table7 gives demands `D_min`, `D_max-D_min`, `D_k-D_max-D_min`. Their sum is `D_k-D_min`, while the proof onp26 assumes net demand `D_k`. For `D_min<0` these disagree. This visible algebraic inconsistency prevents treating all printed variant formulas as independently validated, and does not invalidate the separate measured CVRP/VRPTW results by itself.
- **Training/mask ambiguities:** Table9 sets AR acceptance coefficient0 for small CVRP/VRPTW, although Algorithm2 describes acceptance *with* that probability. Section4.1 permits the end token at insertion, while AppendixC.3 assigns it to deletion. Algorithm3's final union names the last seed variable rather than the union just accumulated. Released implementation is needed to resolve these details.
- Table4 swaps the NAR/AR objective assignments relative to Table1; they are retained as a source discrepancy. AppendixD.4 also calls the Q500 large-capacity case1K where the main protocol uses2K. Claims here use each clearly identified protocol instead of silently harmonizing the text.
- Controlled host improvements and mixed-source baseline comparisons answer different questions. CPU/GPU allocation, warm-start setup and inherited runtimes restrict extrapolation of the headline speedup.

## Reproducibility

- **Reading:** all37 formal ICLR pages, full bibliography, scientific AppendicesA–G, all16 tables and12 figures freshly read. Architecture, aggregation formulas/proof, pseudocode, budgets and training tables were rendered and visually checked.
- **Metadata:** actual publisher HTML confirms four MIT authors and electronic publication20April2026. Actual arXiv history lists v1 on22June2025 and v2 on26September2025. The generic conference notification date is removed rather than presented as an independently verified acceptance event.
- **Scientific inventory:** publisher page lists the complete paper; OpenReviewpN261iTKvr is browser-challenged and its API returns403. All namedA–G scientific materials are inside the read formal PDF. The official source tree0cfdb677bce29e8efdde5519fa28a594c1964403 contains only one README, which was fully inspected and links the paper/forum; no additional scientific attachment is present there.
- **Code availability:** the paper names an official repository, so its link is now provided. Its actual README still says **“Code will be released soon”**. The observed repository does not supply executable implementation or pretrained checkpoints, despite release claims/promises in the article. No source-level validation or experiment reproduction is claimed.
- **References:** explicit text/bibliography identities only. SIL cites both its old2403.19561 precursor and formal Boosting title; their curator-established continuity is preserved without claiming arXiv retitled itself. The AI2022 neighborhood-search journal expansion is not forced onto the distinct ECAI2020 catalog record. [Official repository](https://github.com/mit-wu-lab/learning-to-segment); [formal publication](https://proceedings.iclr.cc/paper_files/paper/2026/hash/f274af80a7a3aa9ed23ba6f7908470bc-Abstract-Conference.html).
- **Figure:** complete original Figure2, formal PDFpage4, cropped directly and visually checked.
