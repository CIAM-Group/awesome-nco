---
id: symb4co
short_title: Symb4CO
title: 'Rethinking Branching on Exact Combinatorial Optimization Solver: The First
  Deep Symbolic Discovery Framework'
authors:
- Yufei Kuang
- Jie Wang
- Haoyang Liu
- Fangzhou Zhu
- Xijun Li
- Jia Zeng
- Jianye Hao
- Bin Li
- Feng Wu
year: 2024
date: '2024-05-31'
publication:
  date: '2024-05-31'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/da669dfd3c36c93905a17ddba01eef06-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/da669dfd3c36c93905a17ddba01eef06-Abstract-Conference.html
institutions:
- University of Science and Technology of China
- Huawei Noah's Ark Lab
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
- Set Covering
- Combinatorial Auction
- Capacitated Facility Location
- Maximum Independent Set
summary: An LSTM searches compact symbolic branching scores by imitating strong branching;
  compiled expressions run on CPUs with deep-node pseudocost fallback, and fixed expressions
  also show cross-task transfer.
code_url: https://github.com/MIRALab-USTC/L2O-Symb4CO
---

# Rethinking Branching on Exact Combinatorial Optimization Solver: The First Deep Symbolic Discovery Framework

> **TL;DR:** Symb4CO uses a neural generator during training to discover compact branching expressions, then compiles the expressions for CPU deployment inside SCIP. Main experiments train separate policies per benchmark; Appendix B also demonstrates genuine transfer of a fixed exported expression across four tasks. The deployed shared object is a symbolic policy, rather than a shared neural checkpoint.

## Motivation

Neural branching can imitate strong branching effectively while adding feature-extraction, inference and deployment costs. The paper investigates whether a small nonlinear score over solver features can retain useful decisions and execute cheaply on a CPU. Preliminary masking and small-MLP experiments motivate this search empirically; they are not an existence or sample-complexity theorem (Sections 1-3).

## Contributions

The framework combines expression-tree generation, strong-branching imitation fitness, risk-seeking policy optimization and compiled symbolic deployment. It studies four MILP benchmark families, very small instance pools, decision latency, expression compactness and operator/length ablations.

Under this repository's shared-neural-model criterion, the entry remains specialist: the main policies are searched separately on Set Covering, Combinatorial Auction, Capacitated Facility Location and MIS. This does not negate the distinct evidence in Table B7: the same exported expression is reused across these four native tasks through their MILP formulations. Joint cross-benchmark symbolic training is proposed as future work, not demonstrated as one neural generator/checkpoint solving all tasks at inference.

## Methodology

A two-layer, 128-hidden-unit LSTM samples expression tokens using parent/sibling context. Leaves are among 91 raw static/dynamic branching features and constants 0.2, 0.5, 2 and 5; operators include arithmetic, log, exp and power. Hard length bounds 4-64, inverse-operator restrictions, a required input feature and soft length/entropy priors constrain the grammar. Candidate features are normalized within each branch-and-bound node (Sections 4.1-4.2; Appendices B-C).

Fitness is the fraction of recorded decisions at which the expression selects a variable with a maximal full-strong-branching score. PPO optimizes an upper-quantile, risk-seeking reward objective; this is not direct end-to-end solve-time reinforcement learning. Training uses ten easy instances producing 1,000 state/action samples, with four validation instances producing 400 samples. The main protocol first takes ten policies with highest validation imitation accuracy, then chooses by validation solve time because imitation and runtime are imperfectly correlated (Sections 4.3-5).

Only features used by the chosen expression are extracted by specialized C code. The expression is compiled into a shared object and integrated with SCIP. Crucially, the reported default switches to reliability pseudocost branching at depth greater than sixteen. Exactness comes from the surrounding solver's valid branch-and-bound process, not from the learned score proving an optimum or the neural generator running at test time (Appendix C).

## Experiments

The four benchmark families use 80 easy, 80 medium and 80 hard test instances each, with a 3,000-second cap. Easy instances train the policies; medium/hard instances increase problem sizes. Time and node counts are one-shifted geometric means. Baseline neural/tree models use their previous settings with 10,000/2,000 training/validation instances and 100,000/20,000 decisions, so main results demonstrate a smaller data budget rather than a uniformly matched-data comparison. A separate one-instance experiment is reported only for Combinatorial Auction (Tables 1-3; Appendix D).

Symb4CO is competitive with GPU GNN branching and is faster than most tested CPU policies, but not every cell supports blanket dominance: on hard Combinatorial Auction, RPB is 209.57 seconds versus Symb4CO 211.08. Hard-instance node counts are truncated by timeouts and cannot be interpreted as complete-tree size comparisons. Table 4 reports Combinatorial Auction feature-extraction-plus-inference times of 0.04/0.07/0.08 ms on easy/medium/hard instances. Those are per-decision costs, not total MILP solution times (Tables 1 and 4).

Table B7 provides real fixed-expression transfer. For example, the Set Cover-trained expression takes 7.10/1.81/46.44/22.28 seconds on Set Cover/Combinatorial Auction/Facilities/MIS, versus RPB 11.40/3.00/54.05/42.69. Transfer is not uniformly beneficial: the CA-trained expression is worse than RPB on Set Cover and Facilities. This is shared **symbolic-policy** evidence, not a jointly trained or jointly deployed neural model. Reported symbolic-search training costs range from 1.08 to 2.80 hours. The all-layers ablation is also mixed: removing fallback helps easy Set Cover but worsens medium/hard runtime (Tables B7, C11 and C13).

## Limitations

The approach retains substantial human-designed feature and grammar knowledge, expert-label generation cost, a small validation pool and a heuristic depth fallback. Compact expressions are inspectable, but that alone does not explain a causal decision mechanism or guarantee out-of-distribution performance. Experiments are synthetic benchmark distributions rather than general industrial MILP evidence. Automatic graph features, broader symbolic workflows, joint cross-task training and SAT deployment are future directions (Appendix E).

### Curator Notes

The compact-policy motivation reports the best masked-feature accuracy among five repeats. Main result tables do not supply a complete multi-seed uncertainty analysis. Algorithm 1 summarizes selection by validation imitation reward, whereas the main experimental protocol adds runtime selection among ten candidates; reproduction should follow the stated evaluation protocol. Claims that full strong branching always gives a globally smallest tree are informal background language, not a theorem established by this paper.

## Reproducibility

- All 21 pages of the [ICLR 2024 proceedings paper](https://proceedings.iclr.cc/paper_files/paper/2024/file/da669dfd3c36c93905a17ddba01eef06-Paper-Conference.pdf) were read, including complete references, Appendices A-E, all 91 feature definitions and all result/parameter tables. Eight key architecture/result/transfer/deployment pages were visually checked. Publisher metadata confirms nine authors, USTC/Huawei affiliations and publication date May 31, 2024.
- The publisher lists no separate supplement. OpenReview API v1/v2 for `jKhNBulNMh` returned 403. The official repository's 23-file tree at commit `efa0117dab764acfb18df2143a6719af0b36a9b9` contains no additional PDF/ZIP scientific attachment; all named scientific appendices are integrated in the article.
- The [official code](https://github.com/MIRALab-USTC/L2O-Symb4CO) requires patched SCIP 6.0.1 and PySCIPOpt on the `symb4co-iclr2024` branches. The full README, evaluation entry point and both YAML configurations were inspected, together with selected C feature/score code. Current training YAML uses batch size 1,024 versus Table C9's 500, and the checked tree does not contain the `results/expressions` directory mentioned in its README. The article nevertheless prints learned expressions in Table 5. These release observations do not establish which configuration produced the reported tables. No training, C compilation or solver experiment was rerun.
- Five exact existing-paper citation edges are registered with body and full-reference page evidence.
