---
id: neurocut-a-neural-approach-for-robust-graph-partitioning
short_title: NeuroCUT
title: 'NeuroCut: A Neural Approach for Robust Graph Partitioning'
authors:
- Rishi Shah
- Krishnanshu Jain
- Sahil Manchanda
- Sourav Medya
- Sayan Ranu
year: 2024
date: '2023-10-18'
publication:
  date: '2024-08-24'
  source_url: https://doi.org/10.1145/3637528.3671815
venue: KDD
paper_url: https://doi.org/10.1145/3637528.3671815
institutions:
- Indian Institute of Technology Delhi
- University of Illinois Chicago
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Optimization
problems:
- Graph Partitioning
summary: A learned partition-scoring policy reassigns nodes in a complete warm-start partition; variable-count transfer
  is demonstrated, while different cut objectives use objective-specific training.
arxiv_url: https://arxiv.org/abs/2310.11787
code_url: https://github.com/idea-iitd/NeuroCUT
figure:
  path: paper-assets/neurocut-a-neural-approach-for-robust-graph-partitioning/framework.png
  alt: Original Figure1 shows complete initial partition, heuristic node selection and learned reassignment.
  caption: Original Figure1 and full caption distinguish training-time GNN updates from inference-time node embeddings
    and iterative partition edits.
  source_url: https://arxiv.org/pdf/2310.11787v3#page=4
---

# NeuroCUT: A Neural Approach for Robust Graph Partitioning

> **TL;DR:** Starting from a complete clustering, NeuroCUT learns which partition should receive a selected node. The architecture supports different partition counts and objective-specific training. It is **specialist/improvement**, with demonstrated transfer in partition count rather than one checkpoint optimizing every cut objective.

## Motivation

Existing neural partitioners often have a fixed output dimension tied to the partition count and optimize differentiable relaxations of a particular objective. NeuroCUT separates partition scoring from the number of partitions and uses reward-based learning for discrete cut objectives. [pp. 1–3]

## Contributions

- Combine node features and random-walk positional embeddings for a complete warm-start partition.
- Use a heuristic node-selection stage and a learned, variable-count partition-scoring stage.
- Evaluate normalized, balanced, sparsest and k-minimum cuts, unseen partition counts and extensive ablations. [Sections 2–4; Appendix A]

## Methodology

K-means initializes every node's assignment. Two-layer GraphSAGE produces node embeddings. A hand-designed neighborhood ratio prioritizes nodes; an MLP aggregates scores over neighbors in each candidate partition, followed by softmax selection. The selected node changes its assignment in the complete partition. REINFORCE optimizes scaled relative objective changes with discounted returns. This is learned **incumbent improvement**; the initial construction is classical. [pp. 4–7; Figure 1]

The same architecture can be trained for four objectives, but the evidence does not establish one trained policy transferring between them. The official code makes cuttype part of the model/checkpoint path. Training on k=5/8 and testing k=10 is genuine partition-count transfer within the objective. Reported complexity assumes sparse graphs, small anchor/walk parameters and a sublinear number of inference perturbations; it is not an unconditional subquadratic guarantee for arbitrary budgets or dense graphs. [Sections 3.4/4.3; Appendix A.2]

## Experiments

Tests include Cora, CiteSeer, Harbin and Actor, with Facebook/SBM comparisons in the appendix. Main hardware is a 96-core Xeon 6248 system and an A100-40GB. Settings include hidden size 32, learning rate 0.0001, gamma 0.99, training horizon two, 35 anchors and 100 random-walk iterations. [pp. 6–8]

Normalized-cut values are strong, such as Cora 0.02/0.33/0.92 for k=2/5/10. Results do **not** show universal superiority: Cora balanced cut at k=2 is 0.45 versus GAP 0.10, Actor is 0.59 versus GAP 0.25, and Harbin k-mincut at k=10 is 0.03 versus several reported zeros. Rounded values below 0.01 are not exact zero cuts. [Tables 3–6]

The inductive Cora k=10 model has normalized cut 1.18 versus the transductive model's 0.92, and balanced cut 2.03 versus 1.08. On clear SBM structure, NeuroCUT ties hMETIS/spectral results on several objectives; the Gomory–Hu tree can have smaller k-mincut while producing highly unbalanced partitions. Three-run stability tables are limited to particular settings. [Tables 7/9/12–17]

## Limitations

Sequential perturbations, initialization, raw features and positional encodings affect cost and quality. The architecture's variable partition count is not an approximation guarantee or proof of nonempty partitions for every run. Objective-specific training and performance exceptions qualify the abstract's broad robustness language. The additional two-page segmentation document contains qualitative horse-image examples, without a quantified cross-objective checkpoint-transfer protocol. [Conclusion; Appendix A; author visual supplement]

## Reproducibility

Read all **12 pages of arXiv v3**, all 49 references and complete scientific Appendix A.1–A.10, plus both pages of the author segmentation supplement. Inspected all four contact sheets and original Figure 1/full caption. History gives v1 **2023-10-18**, v3 **2024-06-21**. DOI metadata confirms five authors, KDD2024, pages 2584–2595 and publication **2024-08-24**.

The [pinned official repository](https://github.com/idea-iitd/NeuroCUT/tree/f98aaad5b435bf0f7160ede0e4add0a79af7e749) has 95 files. Read its full README/makefile and the relevant main-script checkpoint/objective lines. Its anonymous 11-page review manuscript was inventoried as an older source, not counted as another fully read copy; the current arXiv manuscript contains the identified scientific appendix. No weights were deserialized or training/evaluation rerun.
