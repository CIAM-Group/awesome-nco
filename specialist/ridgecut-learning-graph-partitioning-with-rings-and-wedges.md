---
id: ridgecut-learning-graph-partitioning-with-rings-and-wedges
short_title: RIDGECUT
title: 'RIDGECUT: Learning Graph Partitioning with Rings and Wedges'
authors:
- Qize Jiang
- Angelo Zangari
- Linsey Pang
- Alice Gatti
- Mahima Aggarwal
- Giovanna Vantini
- Xiaosong Ma
- Weiwei Sun
- Sourav Medya
- Sanjay Chawla
year: 2026
date: '2025-05-20'
publication:
  date: '2026-08-08'
  source_url: https://doi.org/10.1145/3770855.3818103
venue: KDD
paper_url: https://doi.org/10.1145/3770855.3818103
institutions:
- Fudan University
- Shanghai Institute of Intelligent Electronics & Systems
- University of Illinois Chicago
- PayPal Inc.
- Center for AI Safety
- Qatar Computing Research Institute, Hamad Bin Khalifa University
- Mohamed bin Zayed University of Artificial Intelligence
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Graph Partitioning
- Normalized Cut
summary: PPO policies construct ring/wedge graph partitions using ordered geometry and partition-aware attention,
  followed by classical dynamic programming/refinement; graph-size transfer is qualified by domain assumptions,
  negative ablations and release/data limits.
arxiv_url: https://arxiv.org/abs/2505.13986
code_url: https://github.com/zyr17/RIDGECUT
figure:
  path: paper-assets/ridgecut-learning-graph-partitioning-with-rings-and-wedges/framework.png
  alt: OriginalFigure4 depicts radial/angular transformations, partition-aware Transformer, two-stage PPO training
    and classical post-refinement.
  caption: OriginalFigure4 and fullcaption from latestten-author21p extendedversion; learned modules share architecture
    with distinct weights.
  source_url: https://arxiv.org/pdf/2505.13986v4#page=6
---

# RIDGECUT: Learning Graph Partitioning with Rings and Wedges

> **TL;DR:** RIDGECUT uses learned ring/wedge decisions to partition spatial graphs. Ordered radial/angular representations and PPO incorporate road-network geometry into the action space; dynamic programming and greedy connectivity refinement complete the pipeline. Its transfer results concern graph partitioning, with important metric, scale and reproducibility qualifications.

## Motivation

Node-by-node graph partition edits expose a large search space and may ignore useful spatial structure. For road networks with a meaningful center, concentric rings and radial wedges offer a smaller family of partition primitives. RIDGECUT learns within that structured family rather than assuming it represents every optimal graph partition. [pp. 2–4]

## Contributions

- Preserve graph connectivity/weights while ordering nodes by radial distance or polar angle.
- Use partition-aware Transformer policies and PPO for ring/wedge decisions, with staged training to reduce interference between the two policies.
- Combine learned decisions with ring dynamic programming, sampling and classical post-refinement; evaluate quality, geometric alignment and transfer across graph sizes. [pp. 4–8; Appendices C–J]

## Methodology

The paper's objective is the **maximum** cut-to-volume ratio over partitions, rather than the usual sum-form normalized-cut objective. A partition consists of inner rings and wedges in the outermost ring. The Transformer takes cut weights, volume information and current partition marks, with attention masks reflecting partition structure. [Equations 1–3; Figure 4]

First train the wedge policy with randomly selected ring boundaries and a wedge-only reward. Then freeze the wedge policy while training the ring component, reinitializing the relevant critics for the changed reward. A learned maximum ring radius is combined with an `O(n²k)` ring dynamic program. At evaluation, disconnected groups can be split and greedily merged, and the best of multiple samples is selected. The principal reported configuration uses hidden width 64, three Transformer layers, learning rate 0.001, batch 256, discount 0.9, 400,000 training steps and ten sampled partitions. [pp. 5–6; Appendices D–E, I–J]

This is **specialist/constructive**. It produces partitions for one native graph-partitioning task; ring/wedge modules have distinct weights. Classical dynamic programming and greedy post-refinement do not establish a second neural improvement policy. [Figure 4; Appendix D]

## Experiments

The main comparisons use 100 test graphs per setting, synthetic spider-web graphs with predefined/random weights, and connected subgraphs from a city traffic network. Synthetic size labels refer to nodes **per ring** with a corresponding ring count in Table 7; real-data labels refer to total graph nodes. They should not all be reported as 50/100-node graphs. The real dataset is supplied under a third-party data agreement and cannot be publicly released. [pp. 6–8; Table 7]

For real 100-node graphs, Table 1 reports normalized-cut values 0.060 versus NeuroCUT's 0.078 for four partitions, and 0.182 versus 0.226 for six. Table 2 reports transfer from the size-100 training setting to size 50/200 without fine-tuning. Classical methods and neural baselines optimize/use different structural assumptions; these are empirical comparisons rather than certificates of unrestricted partition optimality. [Tables 1–3]

There are relevant exceptions: removing PAMHA gives 0.169 versus the full model's 0.174 for four-partition 50-node traffic graphs. In transfer Table 8, not freezing the wedge policy gives 0.150 versus 0.158 in one setting; no post-refinement gives a reported 0.014 versus 0.085 for six-partition 200-node traffic graphs. Thus individual ablations do not uniformly support the prose's superiority language. [Tables 8–9]

The original Transformer is faster than NeuroCUT but slower than several classical/cluster baselines in parts of Table 4. The separate Mamba-based scalability variant in Table 5 has better reported quality but **slower** inference than NeuroCUT. Pruning to 100 retained positions raises the 500-node experiment's NC by 26.15%; the pruning observation is not a universal lossless guarantee. [p. 8; Appendix H]

## Limitations

- A meaningful center and useful ring/wedge prior are domain assumptions. Centroid offsets worsen average performance, but some individual cases improve; arbitrary graphs are not covered by the structural premise.
- The Cheeger analysis and full proofs concern restricted ring/wedge partitions of **unweighted spider-web graphs**. They do not prove PPO convergence, an approximation ratio for every learned policy, or the same bound for arbitrary weighted road networks. [Appendix B]
- The base Transformer uses dense pairwise information and the ring DP has quadratic dependence on sequence length. The Mamba/summary/pruning variants should be distinguished from this base pipeline.
- Table 5 labels values greater than one as NC although Equation 3's nonnegative cut/volume ratio is bounded by one. Its scale/aggregation is unspecified, so those absolute values are not merged with Tables 1–2. Table 7's intra/inter weight descriptions also reverse the main text's low-cross/high-within construction. Appendix A's auxiliary metric normalizations require clarification before independent reproduction.
- Figure 8 bands summarize the minimum/maximum of four tests for each checkpoint; they are not confidence intervals from independent training runs. Proprietary traffic data and absent released checkpoints restrict exact reproduction.

## Reproducibility

Read all **21 pages** of [arXiv v4](https://arxiv.org/pdf/2505.13986v4), including full references and scientific Appendices A–J, and visually inspected every figure/table. Original Figure 4 and its full caption are cropped directly from the read source. The [actual version history](https://arxiv.org/abs/2505.13986) gives v1 **2025-05-20** and v4 **2026-06-13**. This latest ten-author extended version includes Angelo Zangari and matches the [formal KDD 2026 DOI](https://doi.org/10.1145/3770855.3818103); the earlier nine-author v3 was acquired but not registered as a read source. Publisher-deposited metadata gives pages 2122–2131 and online publication **2026-08-08**, distinct from print date 2026-08-09. The formal PDF request returned HTTP 403.

The [paper-linked release](https://github.com/zyr17/RIDGECUT/tree/a0cd56206d6eb0a278bb7305cae6d2ec939e2108) has 39 archive members, no additional scientific PDF and no bundled traffic records/checkpoints. README, data guidance and training/evaluation configurations were checked. Current default configuration uses hidden width 32 and 20–30 points/rings, so reproducing Table 7 requires explicit configuration changes. The public synthetic workflow is distinguishable from the inaccessible proprietary-data evaluation. No training, benchmark reproduction or claim of exact release-to-experiment equivalence is made.
