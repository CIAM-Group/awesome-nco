---
id: glop
short_title: GLOP
title: 'GLOP: Learning Global Partition and Local Construction for Solving Large-Scale Routing Problems in Real-Time'
authors:
- Haoran Ye
- Jiarui Wang
- Helan Liang
- Zhiguang Cao
- Yong Li
- Fanzhang Li
year: 2024
date: 2023-12-13
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/30009
arxiv_url: https://arxiv.org/abs/2312.08224
code_url: https://github.com/henry-yeh/GLOP
institutions:
- Soochow University
- Singapore Management University
- Tsinghua University
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Asymmetric Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Prize Collecting Traveling Salesman Problem
summary: GLOP combines task-specific neural global partitioning with repeated fixed-endpoint neural path reconstruction to scale routing, improving complete TSP tours and constructed CVRP/PCTSP routes.
figure:
  path: paper-assets/glop/framework.png
  alt: GLOP first improves complete TSP tours through SHPP revisers; task-specific partitioners turn CVRP/PCTSP into sub-TSPs.
  caption: 'Figure 1: TSP incumbent revision and task-specific global partition plus local reconstruction.'
  source_url: https://arxiv.org/pdf/2312.08224v2#page=3
publication:
  date: '2024-03-24'
  source_url: https://api.crossref.org/works/10.1609/aaai.v38i18.30009
---
# GLOP: Learning Global Partition and Local Construction for Solving Large-Scale Routing Problems in Real-Time

> **TL;DR:** GLOP repeatedly reconstructs short fixed-endpoint paths inside complete tours. Separate neural partitioners extend this local solver to CVRP and PCTSP. Large-scale results favor short inference budgets; they do not establish optimality or uniformly better solution quality.

## Motivation

Flat autoregressive policies scale poorly in sequential decoding and memory, whereas heatmap methods can require lengthy search after inference. GLOP aims to give useful large-instance solutions quickly by batching many small neural path problems. Its TSP branch improves a complete initial tour; the global neural partitioner is used for other routing tasks. [Sections 1-3.](https://arxiv.org/pdf/2312.08224v2#page=1)

## Contributions

- A reusable local **reviser** solves fixed-endpoint shortest Hamiltonian path problems (SHPP), using forward/backward decoding and retaining better reconstructions.
- A shifting decomposition revises different portions of a complete TSP tour. Several reviser sizes can be applied in sequence.
- Task-specific sparse GNN partitioners construct CVRP clusters or a PCTSP selected subset before local reconstruction.
- Two curriculum stages train the local policies, followed by experiments on large synthetic instances, distribution shifts, TSPLIB and CVRPLIB. [Sections 4-6 and Appendix A.](https://arxiv.org/pdf/2312.08224v2#page=3)

## Methodology

### Local reconstruction of an incumbent tour

Classical **Random Insertion** produces one or W complete TSP tours. Reviser-n splits each into floor(N/n) consecutive, non-overlapping SHPPs, leaving a possible tail unchanged. Endpoints are fixed; the neural policy reconstructs interior city order. A reconstruction is accepted only if its path is shorter, so reconnecting the original endpoints preserves a complete feasible tour and does not increase its cost. Partition start positions shift by `max(1,floor(n/I_n))` between revisions. Boundaries therefore change rather than permanently freezing a single partition. [Section 4 and Algorithm 1.](https://arxiv.org/pdf/2312.08224v2#page=3)

The local Attention Model has **six encoder layers**, rather than the original three. It decodes from both endpoints and selects the shorter direction at inference. Min-max scaling and optional axis exchange normalize each local instance; coordinate-flip augmentation adds trajectories. REINFORCE trains both directions using the mean cost of two greedy rollouts as baseline. There is no differentiation through the discrete accepted tour. [Equations 1-2 and Appendices A.1-A.3/A.5.](https://arxiv.org/pdf/2312.08224v2#page=11)

Stage 1 samples SHPP rectangles with a random y-axis upper bound: Reviser-10 trains for 100 epochs, others for 200, with **1.28 million instances per epoch**. Stage 2 fine-tunes every reviser for **300 epochs with one million instances per epoch**, using uniformly generated TSPs, Random Insertion and outputs from earlier revisers to generate later revisers' inputs. The substantial offline budget must accompany claims of inexpensive inference. [Appendices A.3/A.5.](https://arxiv.org/pdf/2312.08224v2#page=11)

### Global construction for constrained tasks

A DIMES-style sparse GNN predicts a positive partition heatmap in one forward pass. The **discrete partition is still sampled sequentially** with masks; non-autoregressive heatmap inference does not mean all assignments are made simultaneously. CVRP masks account for capacity, revisits and the specified vehicle limit. PCTSP forms a subset satisfying the minimum collected prize. Each resulting sub-TSP is handled by the local solver. Global policies are trained with REINFORCE using final local-solver cost, rather than optimal labelled partitions. [Section 5, Equation 3 and Appendix A.4.](https://arxiv.org/pdf/2312.08224v2#page=4)

CVRP and PCTSP use different input features, graph sparsity, learning rates and **separately trained global policies**; each global policy uses 5.12K training instances. The ATSP experiment substitutes a pretrained **MatNet-50** reviser, with a different architecture, without retraining that checkpoint. Reusing a local component does not make the entire system one checkpoint across tasks. Under this repository's definitions, GLOP is **specialist, constructive-improvement**: its complete-tour TSP revision is improvement, and the constrained branches combine learned partition construction with learned incumbent revision. Neural weights remain fixed during inference. [Sections 5-6 and Appendices A.4-A.6.](https://arxiv.org/pdf/2312.08224v2#page=4)

## Experiments

### Synthetic TSP and budget accounting

Unless noted, hardware is a 12-core Xeon Platinum 8255C and RTX 3090 (24 GB). Table 1 uses **128 TSP500, 128 TSP1000 and 16 TSP10000 instances**; the times below are for the **whole dataset**. The size-10000 reference is LKH, not a certified optimum. [Section 6 and Tables 1-2.](https://arxiv.org/pdf/2312.08224v2#page=5)

| Size | GLOP gap / time | More revisions gap / time | Reference comparison |
| --- | --- | --- | --- |
| 500 | 3.14% / 19 s | 1.99% / 1.5 min | GCN+MCTS 2.48%; DeepACO 2.36% |
| 1000 | 3.85% / 34 s | 3.11% / 3 min | GCN+MCTS 3.20%; DeepACO 3.16% |
| 10000 | 5.36% / 32 s | 4.90% / 1.8 min | GCN+MCTS 5.50%; DIMES+MCTS 5.90% |

Default quality is worse than several longer-budget methods at 500/1000. Appendix E.1 explicitly shows MCTS eventually overtaking GLOP when allowed more time. GLOP's objective is rapid useful solutions, not a universal quality win.

The 100000-city result uses **one generated instance**. The reference LKH configuration sets runs=1 and trials=1, returning cost 226.4 in 8.1 hours. GLOP gives 240.0 (6.01% reference gap) in 1.8 minutes; more revisions gives 238.0 (5.10%) in 2.8 minutes. The cited **174-fold speedup** describes that single instance and restricted LKH configuration, not an optimality certificate or a general timing law. [Table 2 and Appendix F.](https://arxiv.org/pdf/2312.08224v2#page=5)

Table 9 makes the search budget explicit. For 500/1000, default W=1 and more-revisions W=10, with Reviser-20/50/100 applied for 5/25/20 revisions. At 10000, W=1 and revisions change from 5/20/10 to 5/25/50; at 100000 they change from 5/5/5 to 5/25/50. Sampling width, augmentation and revision counts materially affect the comparison. [Appendix A.6.](https://arxiv.org/pdf/2312.08224v2#page=12)

### Public instances and distribution shifts

Across **49 symmetric EUC_2D TSPLIB cases below 1000 nodes**, tested individually without parallel batching, default GLOP averages 1.53% gap in 42 seconds; more revisions gives 0.69% in 2.6 minutes. GCN+MCTS gives 1.10% in 7.5 minutes, so default GLOP does not have the lowest gap. Selected baseline checkpoints are transferred across scales; for example, DACT uses models trained only up to 100 with 1000 moves and no augmentation. Its very poor aggregate here must be interpreted within that transfer protocol. [Table 3 and Appendix F.](https://arxiv.org/pdf/2312.08224v2#page=5)

On TSP100 distribution shifts, the 0.5-hour GLOP experiment reports gaps 0.091/0.166/0.066/0.082% on uniform/expansion/explosion/implosion; the two-hour more-revisions variant gives 0.048/0.076/0.028/0.044%. Its reported relative deterioration is `gap_OOD/gap_uniform-1`, so a small absolute gap can coexist with a large relative deterioration. Stage 1 improves distribution coverage; Stage 2 specializes toward uniform TSP. This is not complete distribution invariance. [Table 5 and Appendix E.3.](https://arxiv.org/pdf/2312.08224v2#page=6)

### CVRP, PCTSP and updated ATSP

CVRP uses 100 instances at each of 1000/2000/5000/7000 customers, with **per-instance** timing. GLOP-G reports cost/time 47.1/0.4 s, 63.5/1.2 s, 141.9/1.7 s and 191.7/2.4 s. The 2000-trained global policy transfers to larger scales. TAM-LKH is better at 1000 (46.3), but worse at the three larger sizes (64.8/144.6/196.9). Replacing neural local solving with LKH is a separate hybrid variant, not the default neural runtime. Appendix F notes different original generators for L2D/RBG, whose released checkpoints are directly adapted here. [Table 6 and Appendix F.](https://arxiv.org/pdf/2312.08224v2#page=6)

Eight Belgium CVRPLIB instances span **3001-16001 customers**. Default GLOP gaps range from **16.9% to 27.6%**, with 2-9 seconds per instance. It loses to TAM-LKH on LEUVEN2 (21.8% versus 15.9%) and BRUSSELS1 (27.6% versus 27.2%). These benchmark tests support fast feasible solutions, not consistently small gaps or operational deployment claims. [Table 7.](https://arxiv.org/pdf/2312.08224v2#page=7)

PCTSP has **128 cases per size** at 500/1000/5000, with whole-dataset timing. Greedy GLOP costs 14.6/20.0/46.0 in 26 s/47 s/3.7 min; sampling ten partitions improves these to 14.3/19.8/44.9 in 1.5/2.5/16 minutes. The listed OR-Tools costs are 14.4/20.6/54.4 at 16 hours. The official README's example uses val_size=100; that command is not the paper's 128-instance evaluation. [Table 8 and Appendix A.6.](https://arxiv.org/pdf/2312.08224v2#page=7)

**Version distinction:** the read manuscript is **arXiv v2, 21 July 2024**, after AAAI publication. Its Table 4 explicitly updates ATSP after an initialization/environment bug fix. GLOP's current gaps/times for 150/250/1000 are **1.89%/8.2 s, 2.04%/9.3 s and 2.33%/15 s**. The official README preserves the earlier 1.89%/6.4 s, 2.10%/9.6 s and 2.79%/39 s results; these are different versions. The July update required no retraining. These new numbers must not be attributed to the unchanged original AAAI PDF. [Table 4 footnote and official PR #3.](https://github.com/henry-yeh/GLOP/pull/3)

## Limitations

### Reported by the Authors

- Long-budget sophisticated search can obtain better TSP solutions. Fixed-endpoint local reconstruction limits immediate global route changes, despite shifting boundaries.
- The global policy remains task-specific; extending to another constrained problem requires its representation, masks and training.
- Local policies require substantial offline curriculum training. Small inference time does not imply small total training cost. [Section 7 and Appendices A/E.](https://arxiv.org/pdf/2312.08224v2#page=7)

### Curator Notes

- The local revision has **linear work in instance size** for fixed SHPP size; an empirically flat GPU timing curve below 10K nodes is not asymptotically constant complexity. Table 16 uses its own 50 Reviser-50 plus 20 Reviser-20 setting, not every main-table setting.
- LKH reference gaps, a single TSP100K case and significant CVRPLIB gaps limit broad quality claims. Baseline transfer rules, generators, hardware and search budgets need matching.
- The main comparison, curriculum ablation and official example commands use different budgets. Their objective values should not be combined as though measured under one configuration.

## Reproducibility

- **Formal publication:** [AAAI 2024 publisher record](https://ojs.aaai.org/index.php/AAAI/article/view/30009); publisher-deposited metadata gives 24 March 2024. The generic conference notification date was removed as unsupported individual acceptance evidence.
- **Full text actually read:** [arXiv v2](https://arxiv.org/pdf/2312.08224v2), all **16 pages including Appendices A-G**, with history and July bug-fix provenance checked. The AAAI site/attachment requests returned access/server errors; no claim of inspecting unavailable publisher bytes is made. No extra scientific PDF/ZIP was found in the inspected official code tree.
- **Official code:** [henry-yeh/GLOP](https://github.com/henry-yeh/GLOP), including the main README and local-construction, CVRP, PCTSP and ATSP instructions. Released data/checkpoints use external download links. Code examples and paper budgets are distinguished above.
- **Figure:** the original Figure 1 is cropped from PDF page 3; the upper branch is incumbent TSP improvement and the lower branch adds task-specific neural construction.
