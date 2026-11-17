---
id: rgm
short_title: RGM
title: Revocable Deep Reinforcement Learning with Affinity Regularization for Outlier-Robust Graph Matching
authors:
- Chang Liu
- Zetian Jiang
- Runzhong Wang
- Lingxiao Huang
- Pinyan Lu
- Junchi Yan
year: 2023
date: '2020-12-16'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=QjQibO3scV_
venue: ICLR
paper_url: https://openreview.net/forum?id=QjQibO3scV_
institutions:
- Shanghai Jiao Tong University
- Shanghai AI Laboratory
- Nanjing University
- Shanghai University of Finance and Economics
- Huawei TCS Lab
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2012.08950
paradigm: constructive-improvement
problem_families:
- Graph Matching
problems:
- Quadratic Assignment Problem
- Partial Graph Matching
summary: Revocable association-graph Q-learning constructs partial matches, with cardinality-dependent affinity
  regularization or an optional supplied inlier count.
code_url: https://github.com/Thinklab-SJTU/RGM
---

# Revocable Deep Reinforcement Learning with Affinity Regularization for Outlier-Robust Graph Matching

> **TL;DR:** RGM learns sequential partial correspondence from an affinity matrix, removes conflicting earlier choices when revising a match, and uses a cardinality-dependent reward to discourage matching outliers.

## Motivation

Nonnegative graph-matching affinity objectives reward additional matches even when some nodes have no counterpart. One-shot full assignment can consequently match outliers. RGM learns the back-end Lawler-QAP solver from a supplied affinity matrix, allowing partial one-to-one correspondence and optional early stopping without a supplied inlier count (Sections 1-3).

## Contributions

- An association-graph GNN and double-dueling DQN select node pairs sequentially using objective improvements as rewards.
- Revocable actions insert a pair and remove up to two conflicting earlier pairs, maintaining partial one-to-one feasibility while permitting revision.
- Affinity regularization uses a fitted quadratic approximation to a cardinality penalty; known inlier-count stopping is a separate option. Experiments include outlier-augmented visual matching, synthetic data and QAPLIB.

## Methodology

**State and actions.** Each association vertex represents a source-target pair; vertex/edge weights encode unary/pairwise affinity. A state is the selected partial correspondence. Basic actions mask row/column conflicts; revocable actions can choose conflicting vertices, then the environment removes conflicts before insertion. A three-round GNN embeds the current selection and affinity structure; dueling Q heads estimate actions with target networks and prioritized replay (Sections 3-4.2; Appendix A.2).

**Outliers and stopping.** IC stops at a supplied inlier count. AR instead rewards changes in J(X)f(number of matches), with decreasing f. It least-squares fits 1-f by a quadratic around the current cardinality, and treats the current affinity J as fixed to form a state-dependent regularized matrix for the GNN. Rewards still use the actual cardinality-weighted objective. Stop at the supplied count, unchanged best solution for a chosen number of rounds, or a maximum step budget, returning the best encountered solution. Step penalties discourage cycling (Section 4.3/Algorithm 1; Appendix A.2.4).

**Guarantees and cost.** Conflict removal enforces partial row/column feasibility, not a globally optimal assignment or correct outlier identification. Quadratic fitting/current-J freezing are approximations without an optimization equivalence, approximation ratio or convergence theorem. Equation 7 prints a plus sign for bJ times the identity, whereas the subsequent Kreg definition and released get_norm_affinity use minus; the latter follows the displayed subtraction expansion. An n1*n2 association graph with potentially quadratic pair-pair edges is costly, rather than a linear-size representation of the original graphs (Sections 3-4.3; Appendix A.2).

## Experiments

**Data and supervision.** Synthetic data comprise 3,000 ten-inlier pairs with coordinate-scale noise, split 2:1. Visual experiments use supervised BBGM-pretrained CNN/GNN affinities and the paper's stated 8:1 image train/test split. The back-end RL reward itself needs no matching labels, but the whole visual pipeline is not label-free. Willow adds one to six random outliers on each side around ten provided inliers. QAPLIB uses fourteen categories, training on the smaller half of each category and testing on the larger half; NGM's compared protocol trains/tests on the same set. Regular QAPLIB matches all nodes without outlier handling (Appendix A.3).

**Willow.** At three outliers, Table 1 gives F1 75.65% for AR alone, 76.72% for IC and 77.57% for both, versus BBGM 73.41%. The no-extra-inlier-information AR variant is worse than BBGM at one outlier, 85.63 versus 87.21%, despite broad superiority wording. AR+IC performs best in the displayed mean rows; revocation improves its three-outlier F1 from 73.92 to 77.57%. Table 6 rounds/reports the AR/IC averages as 75.70/76.70, slightly differently from Table 1. Incorrect inlier counts degrade IC; at an input count of eight its F1 is 70.78, below BBGM 73.41 (Tables 1-2/6).

**Pascal VOC.** The pure RL back end has F1 60.19 and ground-truth-normalized affinity 1.040. This is below supervised BBGM 79.00 and NGM-v2 80.10 in F1, while exceeding the traditional back-end methods. The stronger 81.88 NGM-v2+RGM result uses a pretrained supervised model as imitation guidance, not the same label-free regime. An affinity ratio above one means the predicted correspondence outscores the annotated correspondence, not that it is more correct (Section 5.2/Table 3).

**QAPLIB quality and time.** Table 4 reports class-aggregated mean gap 35.8% for RGM versus NGM 62.4%, with mean inference 75.53 versus 15.72 seconds. SM/RRWM are much faster at 0.01/0.15 seconds; SK-JA is slower at 563.44. RGM loses on some categories: bur gap 7.1 versus NGM 3.4, lipa 13.3 versus SK-JA 0, and ste 134.1 versus NGM 101.7. The benchmark reference is the supplied optimum/best-known objective as discussed by the paper, without new neural optimality certification. Table 7 gives 35.84% with revocation, 41.49% without and 39.70% after local rewrite; the corresponding times are 75.53/47.24/96.45 seconds (Tables 4/7; Appendix A.3.2/A.4.6).

**Additional evidence.** The appendix tests held-out outlier counts, visual categories, QAP classes, seeds, six hyperparameter choices and alternative RL backbones. Cross-class transfer can remain weak, e.g. car-to-chair F1 25.2 versus chair-trained 35.2. Added seeds and D3QN help in the shown setups. Hardware is a 2080Ti plus 32-core Threadripper/128GB; no complete training-cost accounting is given. Separate category/dataset training and common QAP input do not establish one generalist model across identified native applications (Appendix A.3-A.4).

## Limitations

### Discussed in the Paper

Affinity optimization can disagree with semantic accuracy: in Pascal bus, 39.4% of sampled RGM outputs have objective ratio above one yet average F1 56.5%. The presented reward keeps the pretrained front end fixed; the authors do not jointly train visual feature extraction with their RL solver. Revocation is computationally costly and precludes some dynamic-embedding acceleration, making moderate graph sizes the intended setting (Appendix A.1/A.2.4/A.4.8).

### Curator Notes

The paper's Figure 4 shows empirical score/F1 correlation, not a general proof of alignment. Its statement that graph-structure embeddings reduce QAP to an optimally solved linear problem should not be read as Sinkhorn returning an exact discrete assignment or preserving the original QAP optimum. Neither the partial-assignment constraints nor reward shaping identify true outliers under arbitrary affinities.

The public code is a Willow-oriented release with cached affinities, one example checkpoint and different settings from the paper: the example uses hidden width64 rather than the described128; regularization has a 0.9 multiplier absent from printed f1 and uses a local fit-range maximum; test code performs beam search and fixes twenty environment rounds. Its current GNN and value aggregation also differ from the displayed normalized equations. These are reproduction differences, not evidence that the published experiments were run with this exact snapshot. Candidate selection uses objective reward; ground truth is used for reported F1, not beam ranking in the inspected routine.

## Reproducibility

- **Publication/version:** [official ICLR 2023 poster](https://iclr.cc/virtual/2023/poster/12157) links the formal OpenReview ID. The reading source is [arXiv v5](https://arxiv.org/abs/2012.08950v5), March 1, 2023, with the accepted ICLR header; the original submission date is December16,2020. Fresh pinned retrieval exactly matches cached SHA-256. Publication is recorded at verified year precision, without replacing it with the event date or arXiv revision date.
- **Complete coverage:** all twenty-five pages, full references, Appendix A.1-A.4.8, algorithm, architecture/learning formulas, all tables and supplementary figures. Available official/author links and the complete repository ZIP were manually checked; no additional scientific PDF/ZIP member was identified. Normal OpenReview forum/API needs verification/returns403; its inaccessible attachment bytes are not claimed read.
- **Code:** [official RGM repository](https://github.com/Thinklab-SJTU/RGM). README, actual neural model, revocable environment, fitting/reward utilities, training/stopping and beam-testing routines were inspected. The inventory contains Willow caches/checkpoint and no complete QAPLIB/Pascal end-to-end reproduction scripts. Training was not rerun.
- **Relations:** eight exact catalogue works are explicitly cited: CIE, DGMC (both2020a/b bibliography aliases merged), GANN, GLSearch, S2V-DQN, NeuRewriter, Pointer Networks and neural RL-VRP. Other graph-matching/fusion papers are not mapped to similarly named entries.
