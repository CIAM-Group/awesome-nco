---
id: neat-weight-embedding
short_title: Weight Embedding
title: Rethinking Neural Multi-Objective Combinatorial Optimization via Neat Weight
  Embedding
authors:
- Jinbiao Chen
- Zhiguang Cao
- Jiahai Wang
- Yaoxin Wu
- Hanzhang Qin
- Zizhen Zhang
- Yue-Jiao Gong
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/78efbc5386c5a7c241e7fcc482d3c3dc-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/78efbc5386c5a7c241e7fcc482d3c3dc-Abstract-Conference.html
institutions:
- Sun Yat-sen University
- Singapore Management University
- Eindhoven University of Technology
- National University of Singapore
- South China University of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Multi-Objective Traveling Salesman Problem
- Multi-Objective Capacitated Vehicle Routing Problem
- Multi-Objective Knapsack Problem
summary: WE-Add and WE-CA condition node representations on scalarization weights;
  separate task-specific POMO models support preference sharing and optional mixed-size
  training.
code_url: https://github.com/bill-cjb/WE
---

# Rethinking Neural Multi-Objective Combinatorial Optimization via Neat Weight Embedding

> **TL;DR:** Inject objective weights into node representation learning instead of conditioning only a decoder or its parameters. WE-Add adds a projected weight vector to every node; WE-CA jointly updates a weight token and conditionally modulated node embeddings. Single-model and unified-size claims concern preferences/sizes within each native problem; the released TSP, CVRP and knapsack checkpoints are separate.

## Motivation

Decomposition-based MOCO solves scalarized subproblems at many objective weights. A weight-agnostic encoder may miss how preferences change useful instance representations, while independent weight models and hypernetwork/size-conditioning schemes add training or implementation costs. The paper tests whether direct weight–instance interaction can improve this setting with a comparatively simple architecture (Sections1-3).

## Contributions

Two POMO-based constructions learn preference-specific representations. WE-Add changes the initial embedding only. WE-CA combines feature-wise modulation and joint self-attention on a weight token and nodes. Experiments compare fixed-size and mixed-size training, transfer to larger TSP instances, parallel preference inference, representation ablations, inference-weight density and weighted-sum versus Tchebycheff scalarization.

The contribution is an empirical specialist solver architecture. “Single-model” means all preference subproblems of a native task; “unified” adds sizes of that task. Neither establishes a single checkpoint jointly solving MOTSP, MOCVRP and MOKP, nor supplies a theorem of global scalarized optimality or exact Pareto-front recovery.

## Methodology

The base constructor has six attention layers, eight heads and dimension128, with instance normalization and POMO multiple-start rollouts. WE-Add initializes each node as its projected features plus the same projected preference. WE-CA instead creates a separate weight token. At every encoder layer, that token produces feature-wise scale/shift vectors for the nodes; attention jointly updates the token and nodes, and decoder attention includes the final token. Masked autoregressive selection constructs a feasible route/item sequence under the specified task rules (Equations1-11).

REINFORCE uses a per-instance mean of multi-start scalarized costs as baseline. Each batch samples a preference; mixed-size training also samples a size before drawing that batch's instances. Default training uses200 epochs of100,000 random instances, batch64, Adam learning rate1e-4 and weight decay1e-6. Inference evaluates101 bi-objective or105 tri-objective weights; weight-conditioned models can batch these evaluations subject to memory limits. This does not imply a101-fold speedup (Algorithm1; AppendicesC-D).

MOTSP gives every node independent2D coordinates for each objective. Bi-CVRP minimizes total distance and longest-route distance with capacity masking; Bi-KP maximizes two values under a weight capacity. Different feature dimensions, contexts, masks and separate models implement these tasks (AppendixB).

## Experiments

**Protocol and metrics.** The main settings are TSP/CVRP20/50/100 and knapsack50/100/200, with200 random instances per setting. Tables report normalized hypervolume using common reference/ideal points, solution time for those200 instances, and HV gaps relative to **WE-CA-Aug**, not the unknown optimal Pareto front. Wilcoxon rank-sum tests at1% identify statistically indistinguishable results; this is not a multi-training-seed uncertainty analysis. Scalarized-cost gaps in Table4 instead use LKH as the reference, which is also not an exact-optimum certificate (Tables1-5; AppendixE).

**Fixed-size results.** WE-CA generally improves on WE-Add and PMOCO: Bi-CVRP100 gaps are0.24% versus PMOCO4.14%, and Tri-TSP100 are1.19% versus3.53%. It does not win every setting. EMNH has higher raw HV on Bi-CVRP20/50 and Bi-KP100/200; WS-LKH often gives higher TSP HV with more time. For Bi-TSP100, WE-CA-Aug gives0.7067 in15minutes versus WS-LKH0.7090 in6hours. Tri-TSP100 augmentation costs about1.7hours. These solving times exclude the neural models' training (Table1).

**Preference and size sharing.** Mixed-size policies train on20-100 nodes, or50-200 knapsack items, within each native task. WE-CA-U generally improves size transfer and average gaps versus the tested CNH and PMOCO variants. Out-of-range evaluation focuses on Bi-TSP150/200 and three KroAB benchmark instances; it does not test arbitrary native-task transfer. At Bi-TSP200, WE-CA-U-Aug HV0.7381 exceeds CNH-Aug0.7343 but remains below WS-LKH0.7490. Mixed-size training is not uniformly best on every individual instance: at KroAB100, fixed-size WE-CA-Aug0.6997 exceeds WE-CA-U-Aug0.6990 (Tables2-3/9).

**Ablations and cost.** The feature-wise conditional attention combination generally improves the tested representation variants. A size-embedding ablation takes30hours versus19hours for WE-CA-U with little HV benefit in the reported Bi-TSP setting; this is an implementation/benchmark finding, not a proof that size embeddings can never help. Parallel preference inference reduces Bi-TSP100 time20→15seconds and Bi-CVRP100 time25→19seconds, with task/size-dependent gains (Table5/7; AppendixH).

Increasing inference weights105→1,035→10,011 creates denser candidate fronts at higher time cost. For Tri-TSP50, WE-CA at1,035 weights gives HV0.4531 versus PMOCO at10,011 weights0.4497; WE-CA at10,011 reaches0.4566. Such improvements can exceed the fixed105-weight reference without proving optimality. Weighted sums outperform the tested Tchebycheff version here; the latter gives different concentration near front boundaries. This is not universal superiority of weighted sums across nonconvex fronts (AppendixI).

## Limitations

The authors identify complex real-world constraints and improved cross-size sampling/learning as remaining work. Finite scalarization grids and approximate learned policies do not recover every Pareto solution; weighted sums can miss unsupported nonconvex tradeoffs. Masks enforce the modeled constraints, not arbitrary application requirements. Preference sharing and size training incur repeated encoder computation, multiple starts and possible augmentation costs. A result called zero gap is relative to a chosen neural baseline and rounded, not an exact Pareto guarantee.

### Curator Notes

Instance augmentation comprises eight coordinate symmetries for CVRP and8^M combinations for M-objective TSP, rather than merely permuting objective labels. The reported difficulty with preallocated maximum-size embeddings concerns the evaluated CNH implementation; sinusoidal encodings as a mathematical family are not intrinsically limited to those maxima. The paper contains definitions/algorithmic formulas but no general approximation-ratio, convergence or cross-size-generalization theorem.

## Reproducibility

- All20 pages of the [formal ICLR2025 article](https://proceedings.iclr.cc/paper_files/paper/2025/file/78efbc5386c5a7c241e7fcc482d3c3dc-Paper-Conference.pdf) were read, including the full bibliography and scientific AppendicesA-I. Ten architecture, result and plot pages were inspected visually. Publisher metadata verifies seven authors and May1,2025; the byline gives SYSU/SMU/TU Eindhoven/NUS/SCUT affiliations.
- Manual publisher links provide Paper/Bibtex with no separate scientific supplement. OpenReview notes APIsv1/v2 for `GM7cmQfk2F` returned403. The official208-file repository tree has no PDF/ZIP attachment. Its74 PT files include test datasets and28 specifically named checkpoint files, separated by native task, size and model variant.
- The [official implementation](https://github.com/bill-cjb/WE) was inspected at `849f849da0abf950dd026446aa69b4b7a06d09af`. The full README and116-line mixed-size TSP training configuration were read, together with the actual mixed-size/preference/REINFORCE routine and275 lines of the355-line model through conditional attention/decoder. Code explicitly samples size20-100 and Dirichlet(1,1) preferences; decoding uses the weight token in attention but excludes it as a selectable node. No model training, solver benchmark or HV computation was rerun. Eleven exact existing-paper citations are registered with body and complete-reference evidence.
