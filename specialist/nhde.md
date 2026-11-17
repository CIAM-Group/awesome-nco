---
id: nhde
short_title: NHDE
title: Neural Multi-Objective Combinatorial Optimization with Diversity Enhancement
authors:
- Jinbiao Chen
- Zizhen Zhang
- Zhiguang Cao
- Yaoxin Wu
- Yining Ma
- Te Ye
- Jiahai Wang
year: 2023
date: '2023-10-22'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/7b5ae891000049b91b3b62de596b1560-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/7b5ae891000049b91b3b62de596b1560-Abstract-Conference.html
institutions:
- Sun Yat-sen University
- Singapore Management University
- Eindhoven University of Technology
- National University of Singapore
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
summary: NHDE constructs solutions conditioned on scalarization preferences and an existing objective-space front,
  combining hypervolume-aware RL, heterogeneous attention and sampled nondominated-set updates.
code_url: https://github.com/bill-cjb/NHDE
arxiv_url: https://arxiv.org/abs/2310.15195
figure:
  path: paper-assets/nhde/framework.png
  alt: NHDE sequentially solves scalarization subproblems using an instance graph, current front, preference and
    diversity factor, then updates sampled nondominated points.
  caption: 'Figure 1: Preference/front-conditioned construction followed by multiple Pareto optima sampling and
    archive updates.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=2
---
# Neural Multi-Objective Combinatorial Optimization with Diversity Enhancement

> **TL;DR:** NHDE conditions constructive policies on previously found objective-space points and rewards both scalarized quality and hypervolume. It retains multiple sampled nondominated candidates per preference. Separate task models use either a preference hypernetwork or a fine-tuned meta-model; returned fronts approximate the Pareto set rather than certify it.

## Motivation

Solving weighted-sum subproblems independently can repeatedly return the same solution, wasting preferences and leaving sparse Pareto approximations. NHDE makes subproblems dependent on the front accumulated so far and retains more than the single scalarized winner. Hypervolume (HV) measures convergence and coverage together, while the number of nondominated points alone does not establish quality. [Sections 1-3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=2)

## Contributions

- Adds a hypervolume term to preference-dependent reinforcement learning.
- Builds heterogeneous attention between instance nodes and existing **objective-space points**.
- Introduces multiple Pareto optima (MPO) sampling and restricted front-update comparisons.
- Integrates these mechanisms into PMOCO and MDRL, evaluating bi-/tri-objective TSP, bi-objective CVRP and bi-objective knapsack. [Section 4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=4)

## Methodology

### Sequential preference-conditioned construction

For each preference lambda, rank existing front points by that scalarization and select up to **K** nearby-in-objective-score points. Add the reference point and feed this surrogate landscape to the policy together with the instance and a two-component diversity factor w. The terminal reward is **-w1*weighted_sum + w2*HV** of the surrogate front plus the new point. HV includes the existing selected points; it is not an explicitly hand-designed pairwise solution-distance penalty. Preferences are processed sequentially, so later construction can respond to earlier results. [Section 4.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=4)

The HGA encoder has **six layers, width 128 and eight attention heads**. It uses node-to-node, node-to-point and point-to-node attention, omitting point-to-point attention. Separate linear projections embed decision features and objective vectors. Residual connections, batch normalization and feed-forward blocks update both graph types; the autoregressive decoder attends to nodes and points before masked action selection. The front graph contains objective values, not all earlier route sequences. [Section 4.2, Equations 3-8.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=5)

**NHDE-P** uses an MLP hypernetwork with two 256-dimensional hidden layers, taking M objective weights plus two diversity-factor entries and generating decoder parameters. **NHDE-M** meta-trains an HGA model, then fine-tunes a submodel for each preference/diversity factor using sampled fine-tuning instances. This preference-specific tuning is distinct from editing an incumbent test solution or necessarily adapting on each individual evaluation instance. [Supplement B/E.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=1)

### Sampling and archive update

POMO-style multiple starts and optional coordinate transformations generate candidate solutions for each preference. MPO retains useful nondominated candidates instead of only the highest scalarized-reward solution. To reduce comparison cost, it uses at most K selected old points and **J** scalarization-ranked new candidates, giving the stated **O((K+J)*J)** local-update comparison cost instead of comparing all new candidates against the whole large front. Restricting comparisons/candidates sacrifices some quality; it does not prove recovery of the global Pareto set. [Section 4.3 and Figure 4b.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=6)

Default K=20 and J=200. At inference, **40 preferences for two objectives or 210 for three** are shuffled, and w changes linearly from (1,0) toward (0,1). TSP/CVRP/KP use separate models and task representations/masks; one preference-conditioned model covers objectives within one task, not all tasks. The solver remains **specialist, constructive**: neural policies construct each feasible solution from partial decisions, while archive filtering is not a learned incumbent-editing policy. [Section 4.4 and Supplement C/F.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=2)

## Experiments

### Protocol and learning budgets

MOTSP uses one independent 2-D coordinate set per objective, sizes 20/50/100. CVRP minimizes **total distance and longest-route distance**, sizes 20/50/100 and capacities 30/40/50. Knapsack maximizes two item-value sums with sizes 50/100/200 and capacities 12.5/25/25. Tests contain **200 random instances per setting**, run on RTX 3090 and Xeon 4216; table times cover that test set. [Section 5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=7)

NHDE-P trains for **200 epochs of 5000 generated instances**, sampling 20 weights per instance, batch 64. Adam learning rates are 1e-4, or 1e-5 for knapsack. This entails many preference/trajectory gradient computations per generated instance. NHDE-M uses 150 meta-iterations, 20 sampling steps, M tasks and 100 inner updates; each evaluation preference receives **50 additional fine-tuning updates** on sampled instances. The compared MDRL uses 3000 meta-iterations to match training gradient count. Its tuning cost also grows with the number of preferences; inference tables should not be read as the full offline-plus-tuning cost. [Supplement E/F/G.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=3)

HV is normalized with fixed task/size-specific reference and ideal points, including reversed inequalities for maximization in knapsack. **Table “Gap” is relative to the designated NHDE result**, not the unknown exact Pareto front. A negative gap means that comparator has higher HV than the reference NHDE row, not an impossible improvement beyond an optimum. Main tables use a 1% Wilcoxon rank-sum significance convention; the supplement reports per-instance HV variances and ten preference-shuffle runs. [Supplement A/M.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=1)

Coordinate augmentation is another budget: full TSP augmentation has 8^M transformations, whereas NHDE uses **2*4^M** (32 bi-objective, 128 tri-objective). CVRP uses eight transformations. “aug.” rows cannot be equated to one policy rollout per preference. [Supplement D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=2)

### Quality, diversity and counterexamples

At Bi-TSP50 with 40 preferences, NHDE-P obtains **HV .6388 / 127 nondominated points / 53 s**, versus PMOCO **.6331 / 31 / 5 s**. At a comparable 53-second budget, PMOCO with 600 preferences gives .6361/68. NHDE's augmented row gives .6429/269 in 2.5 minutes. This supports better front coverage at suitable budgets, with additional per-preference work. [Table 1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=8)

The strongest result is not uniformly NHDE. At **Bi-TSP100**, WS-LKH gives HV **.7072** versus augmented NHDE-P .7050, using 2.7 hours versus 5.6 minutes. At **Bi-CVRP100**, DRL-MOA's .4055 exceeds NHDE-P's .3991; NHDE-M improves to .4074. More nondominated points alone can accompany a worse HV: PPLS/D-C may return thousands of crowded, lower-quality points. [Tables 1-2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=8)

On Tri-TSP100, augmented NHDE-P reports **.5209 HV / 16999 points / 1.5 h**, versus PMOCO's .5044/209/4.2 h at full augmentation. NHDE-M instead reaches .5118/13216/1.5 h, below WS-LKH's .5165; P and M results should remain separate. [Tables 1-2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=9)

NHDE-M usually beats MDRL at the same number of preferences, but matched larger-preference baselines expose failures. On Bi-CVRP100 without augmentation, MDRL300 gives **.4078** versus NHDE-M40 .4053 at 1.5/1.4 minutes. With augmentation MDRL300 reaches **.4086** versus NHDE-M40 .4074, at 7.7/2.7 minutes. The supplement also reports non-augmented NHDE-M losses on Bi-CVRP50 and Tri-TSP100. [Supplement Table 5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=4)

### Transfer, ablation and runtime

Bi-TSP100-trained models transfer to sizes 150/200 and three KroAB100/150/200 benchmarks. NHDE-P gives augmented HV **.7012/.7324** at sizes 150/200, versus WS-LKH **.7075/.7435**. It exceeds the listed neural/MOEA fronts under those protocols but does not surpass the longer-running weighted-sum LKH reference. Benchmark Pareto plots similarly show improved neural coverage without exact-front certification. [Table 3 and Supplement G/H.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=5)

At Bi-TSP50, removing the indicator/front input lowers HV from .6388 to .6361; removing MPO gives .6335; indicator-only training without decomposition gives .6260. Removing either cross-graph attention direction also hurts. At the **shortest matched budget**, however, PMOCO150 gives .6355 versus NHDE10 .6334 in 14 seconds. NHDE's advantage becomes clearer at larger evaluated preference budgets. [Figure 4 and Supplement Tables 9-11.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=6)

The runtime breakdown is **82% MPO front updates, 13% original PMOCO, 5% added HGA inference** on Bi-TSP50. Thus the neural attention addition is not the dominant measured overhead. On Tri-TSP50, restricting J=200 gives .4588 HV in 30 minutes; J=400 gives .4589 in 39 minutes; the full update gives .4590 in 6.2 hours. These quantify the chosen approximation. [Supplement J/L.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=8)

The duplicate-count ablation gives **196 versus 225** duplicates with/without the indicator on Bi-TSP50, stronger evidence about duplication than |NDS| alone. Nonuniform weights help when objectives have different scales; shuffled preference order has a small measured effect over ten runs, not a proof of order invariance. [Supplement K/M.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Supplemental-Conference.pdf#page=9)

## Limitations

### Reported by the Authors

- HV computation becomes costly for larger instances or more objectives; approximate HV and real-world tasks are future directions.
- Restricted front information can lose useful points, while too many front points make learning harder. J trades runtime against quality.
- Preference allocation and objective scales affect the resulting front. The learned diversity-factor effect is imperfect. [Section 6 and Supplement K-M.](https://proceedings.neurips.cc/paper_files/paper/2023/file/7b5ae891000049b91b3b62de596b1560-Paper-Conference.pdf#page=10)

### Curator Notes

- “Pareto” refers to an approximate sampled nondominated archive, not guaranteed global Pareto optimality or exact coverage. Weighted-sum scalarization also restricts which regions are directly targeted.
- Higher |NDS| is useful alongside comparable HV, not by itself. Reference points, normalization, objective direction, weights, starts and augmentations need matching.
- Adapted meta-model construction is not incumbent improvement; NHDE-M's per-preference tuning cost must be separated from fixed-model NHDE-P inference.
- Supplement M mistakenly describes (1,0) as emphasizing HV despite the reward definition assigning HV to w2; Figure 9's low pure-HV bar is at (0,1). This note follows the explicit reward equation and does not propagate that reversed label. Table 2 also has an inconsistent MDRL Bi-CVRP100 |NDS|=0 beside positive HV; that cell is not used for a quantitative claim.

## Reproducibility

- **Formal sources:** [NeurIPS 2023](https://proceedings.neurips.cc/paper_files/paper/2023/hash/7b5ae891000049b91b3b62de596b1560-Abstract-Conference.html), all **13 main-PDF pages plus nine separately linked supplemental pages A-M**, fully reread. Publisher landing and supplement link manually checked; official code tree has no additional scientific PDF/ZIP.
- **Date/provenance:** [arXiv:2310.15195](https://arxiv.org/abs/2310.15195), first posted **22 October 2023**. The actual read sources are publisher PDFs. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2023/hash/7b5ae891000049b91b3b62de596b1560-Abstract-Conference.html) explicitly records `citation_publication_date` as **2023-12-15**, independently of any paper-specific acceptance date.
- **Official code:** [Bill-CJB/NHDE](https://github.com/Bill-CJB/NHDE), master branch. Its README identifies separate NHDE-P and NHDE-M train/test/fine-tuning commands and per-problem result checkpoints. Recursive inventory, front-update routine and a TSP50 test configuration were inspected; no numerical retraining is claimed.
- **Affiliations:** seven authors match the title page's four universities; the Sun Yat-sen Ministry of Education laboratory and Guangdong Key Laboratory of Big Data Analysis and Processing are also listed on that page.
- **Figure:** original Figure 1, PDF page 2. Main/supplement formulas, tables, normalization points and ablation/front plots were visually checked.
