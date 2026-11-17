---
id: udc
short_title: UDC
title: 'UDC: A Unified Neural Divide-and-Conquer Framework for Large-Scale Combinatorial Optimization Problems'
authors:
- Zhi Zheng
- Changliang Zhou
- Xialiang Tong
- Mingxuan Yuan
- Zhenkun Wang
year: 2024
date: '2024-06-29'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/0b8e4c8468273ee3bafb288229c0acbc-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2407.00312
code_url: https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/UDC-Large-scale-CO-master
institutions:
- Southern University of Science and Technology
- Huawei Noah's Ark Lab
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
- Packing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- 0-1 Knapsack Problem
- Maximum Independent Set
- Asymmetric Traveling Salesman Problem
- Orienteering Problem
- Prize-Collecting Traveling Salesman Problem
- Stochastic Prize-Collecting Traveling Salesman Problem (nonstandard observation setting)
- Open Vehicle Routing Problem
- Min-Max Multiple Traveling Salesman Problem
summary: UDC jointly trains task-specific neural initialization and incumbent subproblem repair using Divide-Conquer-Reunion;
  ten problem settings are studied, with later author corrections to SPCTSP and explicit large-TSP divider failures.
figure:
  path: paper-assets/udc/framework.png
  alt: UDC constructs task-specific initial solutions using AGNN heatmaps, prepares constrained VRP/KP/MIS subproblems,
    solves them and merges improving replacements.
  caption: 'Figure 1: UDC initialization and constrained subproblem improvement across routing, knapsack and independent
    set.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=4
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/0b8e4c8468273ee3bafb288229c0acbc-Abstract-Conference.html
---
# UDC: A Unified Neural Divide-and-Conquer Framework for Large-Scale Combinatorial Optimization Problems

> **TL;DR:** UDC jointly trains a neural initial-solution policy and a neural subproblem improver. Divide-Conquer-Reunion (DCR) shifts the second repair pass across the first pass's boundaries before rewarding the initializer. The paper studies **ten task settings using separate models**. Important qualifications include **nonstandard SPCTSP information**, later acknowledged by the authors, and failure of the learned divider on very large TSP, where a separate experiment replaces it with random insertion.

## Motivation

A partition can place useful connections across fixed subproblem boundaries. Even a strong local solver cannot repair those connections unless the boundaries change. Training a divider against a frozen local solver can also specialize it to that solver's weaknesses. DCR trains the two policies together and assesses the divider after a second, shifted repair pass. This is an empirical training design; the checklist explicitly says the paper has no theoretical results. [Sections3/5 and checklist.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=5)

## Contributions

- A learned sparse-graph initializer and learned subproblem solver form a two-stage constructive-and-improvement pipeline.
- DCR adds a shifted **Reunion** pass to cover previous boundaries and jointly trains both policies with REINFORCE.
- A common framework supports ten settings with task-specific feasibility masks, subproblem constraints and suitable neural architectures.
- Extensive experiments include different search budgets, sizes/distributions, benchmarks and ablations. The reported scope is broader than the previous TSP/CVRP-only note, but neither a shared checkpoint nor uniform superiority is demonstrated. [Sections3-5 and AppendicesB-E.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=4)

## Methodology

### Neural initialization and constrained improvement

Build a sparse graph with100neighbors per node, or use the original graph for MIS. For KP, neighborhood selection uses a value/weight-derived relation rather than Euclidean distance. A **12-layer,width64 anisotropic GNN** with edge gating, SiLU, batch normalization and mean aggregation produces a heatmap. Feasibility-masked decoding generates an initial complete solution. **T-revisit** refreshes heatmaps with partial-solution information through MLPs: training generally uses T=floor(N/n), while very-large tests use T10. [AppendixC.1-C.2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=20)

The conquering stage extracts fixed-size subproblems from the incumbent, normalizes relevant inputs, solves them and retains **only improving replacements**. Routing fragments preserve first/last nodes; CVRP carries residual capacities across fragment boundaries. OP/PCTSP also include randomly selected unvisited nodes, with task-specific length/prize constraints and slack allocation. MIS forbids local selections adjacent to fixed outside selections. Min-max mTSP incorporates neighboring route lengths and avoids simultaneously updating adjacent fragments. These explicit task-dependent operations qualify the broad claim of requiring no problem-specific design. [AppendixB/C.3-C.4.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=16)

Most routing/KP subproblems have n100; MIS uses200 and ATSP50. Conquerors differ: **ICAM** for TSP/CVRP/OVRP/KP; **POMO** for OP/PCTSP/SPCTSP; **AGNN** for MIS; **MatNet** for ATSP; **DPN** for min-max mTSP. ICAM/POMO have six layers, MatNet five, DPN three, and sub-MIS AGNN12layers/width256. The framework does not have one universal neural solver or checkpoint. [AppendixC.5/Table7.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=21)

### Divide-Conquer-Reunion training

Sample alpha complete initial solutions. Conquer their subproblems, then roll the decomposition start by **n/2** and conquer again across the former boundaries. The initializer's reward depends on the **final merged solution after Reunion**; the local solver receives its subproblem objective reward. REINFORCE uses averages over alpha initial solutions and beta local samples as baselines. Both networks update offline, with learning rate1e-4. This is joint policy-gradient training, not differentiating through an optimal local solver or proving an unbiased optimal reward estimator. [Equation6 and Algorithms1-2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=6)

**KP disables Reunion/DCR**, since item subsets have no route-boundary connection to repair; ablations show similar results with it enabled. Later inference passes shift the decomposition randomly. Typical test local sample counts are1for asymmetric problems and2for symmetric problems, though Algorithm2's initial beta listing conflicts with AppendixC.5/Table7 for ATSP; task-specific settings need checking. No neural weights are optimized at test time.

**Specialist, constructive-improvement:** both the neural initializer and learned incumbent repair are substantive components of UDC, trained jointly for each task. Separate task models share a framework and can transfer within a task across size/distribution. The random-insertion variant discussed below replaces the neural initializer and must be identified separately.

## Experiments

### Tasks, training and budgets

Ten settings are TSP, CVRP, KP, MIS, ATSP, OP, PCTSP, SPCTSP, OVRP and min-max mTSP. **The SPCTSP experiment is nonstandard:** the official README's27January2025 correction says the implementation allowed some solutions access to actual stochastic values. Its scores cannot be treated as valid standard-SPCTSP results or clean comparisons against methods using the standard information restriction. [Author correction.](https://github.com/CIAM-Group/NCO_code/blob/main/single_objective/UDC-Large-scale-CO-master/Readme.md)

Models generally train at varying500-1000nodes; ATSP250-500 and MIS700-800 are exceptions. Per-task epochs are500forTSP/OP/(S)PCTSP,200forCVRP/OVRP/min-max mTSP,120forKP,1000forMIS and300forATSP, with1000instances per epoch. The paper reports most runs finishing within **ten days on one V100S**. There are two different CVRP capacity descriptions: AppendixB says training100-200, while Table7 says50-100; test capacities are100/200/300 at500/1000/2000+. [Table7 and AppendixB.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=25)

**UDC-xr** denotes rconquering passes. Main routing uses alpha50initial solutions and r2/50/250; OP/(S)PCTSP often uses alpha1. More samples/passes materially increase runtime. Most reported times are for **the whole test set**, whose size varies: typically128TSP cases,100CVRP1000/2000 cases, and only16cases in several2000/10000-node settings. A shorter time at a larger size may reflect fewer cases. [Tables2-3/8-18.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=7)

Gaps are generally relative to the **best listed method**, sometimes UDC itself, or benchmark best-known values. They are not a single fixed optimality certificate. Most heatmap baselines were not successfully reimplemented and use reported results; BQ's OP results were also borrowed after feasibility failures. Neural baselines use different start, beam, augmentation and reconstruction budgets. [AppendixG.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=38)

### Main routing, prizes and benchmark comparisons

| Setting | Selected UDC result | Qualification |
| --- | --- | --- |
| TSP1000,alpha50,x50 |23.53cost,1.78% gap,8min |ICAM23.49/1.58% in1min is better/faster |
| TSP2000,alpha50,x50 |33.26cost,2.49%,15min |Best listed neural cost, still above LKH32.45 |
| CVRP1000,alpha50,x250 |43.00cost,1.2h |Best listed cost, substantial search budget |
| OP2000,alpha1,x250 |144.10prize,14.09%,21s |EA4OP167.74prize is better;16-case set |
| PCTSP1000,alpha1,x250 |18.29cost,1.5min |Best main-table result; later alpha50 gives18.18 in70min |
| OVRP2000,alpha50,x250 |43.35cost,8.71%,20min |LKH39.88 is better |

PCTSP/OP are different objective directions: **OP maximizes collected prize**, while PCTSP minimizes distance plus missed-prize penalties. Some printed table arrows are inconsistent with those definitions. SPCTSP rows are excluded from standard-task performance conclusions because of the author correction. [Tables2-3/8/18.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=8)

On TSPLIB500-1000, UDC-x250 has **6.0%** mean best-known gap, versus LEHD4.1%; at1000-5000 it has7.6%, versus GLOP-LKH6.9%. CVRPLIB is more favorable among listed neural methods:7.1%Set-X and13.2%Set-XXL, with significant residual gaps. This does not support blanket benchmark superiority. [Table4.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=9)

### Graph, knapsack, asymmetric and min-max results

MIS on128ER700-800graphs gives **42.88nodes in21.05min** with alpha50/x50, versus KaMIS44.87in52.13min. UDC improves the listed neural search results but remains below KaMIS. With250passes, mean43.8requires1.73hours, exceeding KaMIS time while still lower quality. On the single sparse LastFM graph, KaMIS gives4177nodes in.1s, versus UDC4067in80s at2500passes. No other learned solver's out-of-distribution MIS results were reproduced. [Tables9/14.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=29)

KP's actual metric is **maximized value** (or its negative for the mathematical minimization form), despite downward arrows on positive-value tables. At1000/W100, UDC-x250 gives258.2236 versus OR-Tools258.2510, about.01%gap in56s; OR-Tools is reported to solve in real time. The result supports near-reference neural quality, not replacing an inefficient exact solver. ATSP-x50 is competitive with OR-Tools at250/500/1000 under its respective budgets; copied GLOP/MatNet results are not a uniform rerun protocol. [Tables10-11.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=27)

For min-max mTSP, alpha1/x50 has3.89-6.43%gaps. Alpha50 improves to.13/0/.23%, but fine-tuned DPN is better in two of the three settings; only500nodes/50agents gives UDC a tiny printed cost advantage. The broader framework's applicability is supported, while uniform performance dominance is not. [Table12.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=28)

### Very large instances: separate initializer settings

**The learned TSP divider fails at large scale.** With its learned initializer and alpha1/x50, gaps are7.06%at5000 and10.41%at10000, worse than several competitors. AppendixD.5 then **replaces the divider with the random-insertion heuristic** for Table17. The resulting10000-nodex250gap is4.03%; the100000-nodegap4.05%takes11.5minutes. These are heuristic-initialized repair results, not successful scaling of the learned initializer. The paper explicitly says copied100000-node baselines are **probably from a different test set**, so direct superiority cannot be established. [Tables16-17.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=30)

Large CVRP uses the learned pipeline: alpha1/x250gives costs136.7at5000 and188.2at7000, best in that table, in16/21.4minutes over100instances. Two-pass costs167.1/248.9 are much worse, demonstrating the central role of repeated repair. [Table15.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=30)

### Ablations, implementation and uncertainty

Joint training outperforms the tested pretrained/frozen or pretrained/joint alternatives; removing Reunion or normalization worsens the displayed learning curves. These specific experiments do not prove that pretraining always harms all divide-and-conquer methods. Alpha50improves long-budget routing/OP quality, while alpha1is faster under short budgets. Random/nearest-greedy initializations fail badly; random insertion is competitive with the learned initializer at500-2000. [Section5 and AppendixE.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=31)

The complexity discussion assumes all local subproblems run in parallel when omitting their count from the repair-time term. **Current code instead materializes O(N^2) GNN data**, with CPU offloading advised above7000nodes. Its README says reported random-instance runs use maximum batch size on an **RTX3090**, while the paper reports V100S; batching and running multiple test sets affect randomness. A25November2024 fix disables an unintended CVRP legality check that had severely slowed inference. These implementation/version differences must not be merged into a single verified resource claim. [AppendixC.8 and official README.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=24)

The checklist reports **no error bars or significance analysis**, using seed1234. Fixing a seed does not eliminate sampling or uncertainty across retraining, hardware or batching. The paper does not provide a theorem of optimal convergence or cross-task transfer.

## Limitations

### Reported by the Authors

- Applicability requires decomposable objectives, feasibility enforceable through masks and nonunique local subproblem solutions; TSPTW and some dense-MIS/scheduling formulations are excluded.
- The learned divider generalizes poorly on very-large TSP, motivating heuristic initialization.
- Better loss functions/training efficiency and extension to excluded tasks remain future work. [Sections3.3/6 and AppendixD.5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/0b8e4c8468273ee3bafb288229c0acbc-Paper-Conference.pdf#page=6)

### Curator Notes

- The official SPCTSP correction invalidates treating its published scores as standard-information SPCTSP results.
- Task-specific masks, residual constraints, graph construction, architectures and separate training remain necessary; unified refers to a framework/training recipe.
- More samples/passes can cost hours, and best-known/method-relative gaps, copied baselines, different test sizes and the100000-node dataset caveat limit direct comparisons.
- Current dense implementation, hardware/batching corrections and missing run-to-run uncertainty qualify theoretical and empirical efficiency claims.

## Reproducibility

- **Formal full text:** [NeurIPS2024](https://proceedings.neurips.cc/paper_files/paper/2024/hash/0b8e4c8468273ee3bafb288229c0acbc-Abstract-Conference.html); all **45publisher-PDF pages including AppendicesA-G and checklist** reread. Five authors and two institutions match the formal title page; previously missing Huawei Noah's Ark Lab restored. [arXiv history](https://arxiv.org/abs/2407.00312) confirms29June2024first posting. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2024/hash/0b8e4c8468273ee3bafb288229c0acbc-Abstract-Conference.html) explicitly records `citation_publication_date` as **2024-12-16**, independently of any paper-specific acceptance date. A generic conference notification date remains excluded from acceptance metadata.
- **Supplement:** publisher ZIP downloaded and all36members manually inventoried: TSP/CVRP code, checkpoints and test data, **no PDF or additional scientific appendix**. Scientific appendices are integrated into the fully read45-page publisher PDF. The current repository also carries an older45-page article copy; its wording/citation numbering differs, so the formal publisher source controls the locators used here.
- **Official implementation/corrections:** [UDC directory](https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/UDC-Large-scale-CO-master),105directory members inventoried, full **Readme.md** checked. It provides ten task generators, pretrained/test-data links, dependencies and test/training settings. Its dated SPCTSP/CVRP corrections and dense-memory/batching notes are retained above. No numerical retraining/reproduction was performed.
- **Figure:** original Figure1, PDFpage4, shows routing, KP and MIS and both initialization/improvement stages. DCR, CVRP boundary constraints, method equations, all main/appendix tables and solution visualizations were visually inspected.
