---
id: approximation-and-learning-based-algorithms-for-influence-maximization-in-multilayer-s
short_title: LGQIM / STARIM
title: Approximation and Learning-based Algorithms for Influence Maximization in Multilayer Social Networks
authors:
- Xueqin Chang
- Ruize Liu
- Qing Liu
- Baihua Zheng
- Yunjun Gao
year: 2026
date: '2026-08-08'
publication:
  date: '2026-08-08'
  source_url: https://doi.org/10.1145/3770855.3817870
venue: KDD
paper_url: https://doi.org/10.1145/3770855.3817870
institutions:
- Zhejiang University
- Singapore Management University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Multilayer Influence Maximization
summary: A hybrid multilayer propagation model supports classical STARIM approximation and a separate GNN/Q-learning
  seed constructor, whose inference savings require offline influence labels and dataset-specific training.
code_url: https://github.com/ZJU-DAILY/MLIM
figure:
  path: paper-assets/approximation-and-learning-based-algorithms-for-influence-maximization-in-multilayer-s/framework.png
  alt: Original Figure3 shows offline influence-label training and adaptive Q-network seed selection.
  caption: Original Figure3, including its full caption, shows LGQIM training; STARIM is a separate classical algorithm.
  source_url: https://raw.githubusercontent.com/ZJU-DAILY/MLIM/79eb8fa837ee3fbeb6a56f0d1880194d5205a6d9/SIGKDD26_MLIM_technical_report.pdf#page=6
---

# Approximation and Learning-based Algorithms for Influence Maximization in Multilayer Social Networks

> **TL;DR:** MLIM models propagation within and across social-network layers. STARIM supplies a classical sampling-based approximation algorithm; LGQIM instead learns node influence scores and a sequential seed-selection policy. Its speed gains require offline sampling and training, and do not inherit STARIM's approximation guarantee.

## Motivation

Single-network influence models miss cross-platform propagation and heterogeneous layer dynamics. The paper selects a budgeted set of node-layer copies under a hybrid IC/LT process, maximizing the sum of expected activations across layers. This is cross-platform exposure, rather than a count of distinct people reached. [pp. 1–4]

## Contributions

- Formalize multilayer influence maximization and establish hardness, monotonicity and submodularity under the specified propagation model.
- Develop Mlim-Greedy and STARIM, using multilayer reverse-reachable sampling and layer-weighted estimation.
- Develop LGQIM: supervised graph representation learning followed by Q-learning for adaptive seed construction. [pp. 3–7; Appendices A–C]

## Methodology

STARIM uses independent M-RR sample sets for selection and stopping/accuracy checks. Its reported high-probability approximation bound concerns this classical procedure under the paper's sampling assumptions. LGQIM is a separate heuristic: sample-derived single-node spread labels train a graph encoder, and a Q-network sequentially adds seeds using predicted influence, uncovered one-hop neighbors and selected-node overlap features. Spread marginal gain supplies the training reward. At test time it avoids repeated online MRIS estimation. [Equations 5–16; Algorithms 1–5]

The main text prints a normalized GCN update, while Appendix A's pseudocode uses mean-neighbor aggregation and concatenation. The main exploration schedule is linear, whereas Algorithm 5 uses an exponential schedule. The note preserves these specifications separately. Models trained per dataset, plus same-task CS-to-VT/FTY transfer, support **specialist/constructive**, not a checkpoint shared across distinct native problems. [pp. 6–7, 9, 11–12]

## Experiments

Nine multilayer networks are reported, with IC/LT layer assignments and weighted cross-layer links. Although Table 1 lists full-network statistics, the evaluation protocol says sampled subgraphs contain **10% of the original nodes**. Training and testing divide nodes within datasets; the separate cross-graph experiment transfers CS-trained LGQIM to VT/FTY. Results average five runs, using independently generated M-RR sets for evaluation. Hardware is a 3.70 GHz Xeon/128 GB server. [pp. 7–9]

LGQIM usually trades some influence spread for lower selection time. For example, Table 2's FTY, k=100 result is 7479.7 with GCN scores versus 8089.7 with sampled scores. Runtime improvements vary: OB is 777.17 versus 1064.0 seconds, whereas SF is 2698.1 versus 29425 seconds. These exclude score-label generation and neural training; Figure 5 reports those costs separately. Simple degree/random baselines are faster but generally lower quality. [Figures 4–5; Table 2]

CS-trained transfer at k=100 reaches 1038.845 on VT and 6380.36 on FTY, versus dataset-trained LGQIM's 1217.07 and 7479.77. These are roughly 15% drops, qualifying the broad generalization claim. The baseline called DeepIM [27] is Keikha et al.'s heterogeneous-network method; the separately cited [ICML DeepIM](../specialist/deepim.md) [38] appears in related work. [Table 3; references 27/38]

## Limitations

The classical approximation results are not guarantees for LGQIM's learned ranking. They depend on progressive IC/LT assumptions and the stated sampling/estimation conditions; the note does not independently certify every proof step. Appendix B proposes a distinct unique-user union objective, rather than evaluating it in the main tables. [pp. 3–5, 12–14]

Offline spread labels, graph-specific training and sampled subgraphs constrain the interpretation of scalability. A same-graph node split is weaker evidence than independent unseen-graph evaluation. Architecture and exploration pseudocode discrepancies require clarification for exact replication. No historical checkpoint or benchmark rerun was independently verified. [pp. 7–9; Appendix A]

## Reproducibility

Read the complete **14-page author technical report**, including all 68 references and scientific Appendices A–C; inspected all four rendered contact sheets, every table/figure and the original Figure 3 crop with full caption. The publisher DOI establishes KDD 2026, five authors, pages 354–365 and online publication **2026-08-08**. No same-identity arXiv history was established.

The [pinned author repository](https://github.com/ZJU-DAILY/MLIM/tree/79eb8fa837ee3fbeb6a56f0d1880194d5205a6d9) contains 139 files, one scientific PDF, STARIM/LGQIM source directories and three example datasets. Its README explains data formats, C++ compilation and separate GNN/Q-network training. The README's SF node count differs from Table 1; this note uses the paper's dataset statistics and its 10% evaluation qualification. Inventory/README inspection does not establish successful execution or reproduction of all reported networks.
