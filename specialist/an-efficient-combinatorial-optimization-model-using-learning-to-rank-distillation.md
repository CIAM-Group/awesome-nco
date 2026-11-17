---
id: an-efficient-combinatorial-optimization-model-using-learning-to-rank-distillation
short_title: RLRD
title: An Efficient Combinatorial Optimization Model Using Learning-to-Rank Distillation
authors:
- Honguk Woo
- Hyunsung Lee
- Sangwoo Cho
year: 2022
date: '2021-12-24'
publication:
  date: '2022-06-28'
  source_url: https://doi.org/10.1609/aaai.v36i8.20845
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v36i8.20845
institutions:
- Sungkyunkwan University
- Kakao Corporation
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Knapsack
- Scheduling
problems:
- Multidimensional Knapsack
- Global Fixed-Priority Assignment
summary: Problem-specific differentiable ranking distillation speeds score-based knapsack/scheduling construction;
  Gumbel sampling adds a budget, while TSP distillation fails to retain teacher performance.
arxiv_url: https://arxiv.org/abs/2201.00695
code_url: https://github.com/ita9naiwa/rlrd-aaai2022
figure:
  path: paper-assets/an-efficient-combinatorial-optimization-model-using-learning-to-rank-distillation/framework.png
  alt: Original Figure1 shows an autoregressive RL teacher distilled into a score-ranking student.
  caption: Original Figure1 and full caption show ranking distillation; the shared framework is distinct from a
    shared checkpoint across tasks.
  source_url: https://arxiv.org/pdf/2201.00695v1#page=2
---

# An Efficient Combinatorial Optimization Model Using Learning-to-Rank Distillation

> **TL;DR:** RLRD distills an autoregressive RL ranking policy into a fast score-based student, optionally sampling several rankings with Gumbel perturbations. Separate problem/condition-specific models make it **specialist/constructive**. Successful knapsack/scheduling results coexist with unsuccessful TSP distillation.

## Motivation

Sequential decoding can be too slow for time-sensitive resource-allocation decisions. RLRD investigates when a single score vector can approximate an RL ranking policy while preserving useful solution quality. [pp. 1–2]

## Contributions

- Train attention-based RL teachers and distill their rankings with differentiable sorting/ranking.
- Combine ranking loss with task-specific losses and efficient Gumbel sequence sampling.
- Evaluate multidimensional knapsack, fixed-priority assignment and the limitations of context-independent ranking for TSP. [Sections 2/3; Appendices A–F]

## Methodology

REINFORCE trains a teacher that constructs an item permutation. A simpler student outputs item scores; a permutahedron projection supplies approximate ranks for distillation. Knapsack uses an attention-based student and an additional selection-difference loss; scheduling uses a linear scorer. Gumbel perturbations generate multiple fresh rankings, which are decoded/evaluated classically. This does not learn modifications to a complete incumbent. [pp. 2–4; Appendices B/C]

The framework is reused, but teacher/student models and local adaptation are problem-specific. It is not one trained checkpoint shared across knapsack and scheduling. Proposition 1 and Appendix A describe piecewise gradients and their dependence on smoothing; they do not prove nonzero gradients at every score or global optimality of the learned solution. The Gumbel theorem concerns sampling probabilities, not an approximation ratio. [pp. 3–4/10]

## Experiments

Knapsack uses 50/100/150 items, 3/10/15 resource dimensions, weight ranges 200/500 and two weight–value correlations, evaluated on 500 instances. The table's **Gap is an objective ratio to the named GLOP baseline**, with 100% as reference, not a certified optimality gap. Scheduling evaluates 5000 task sets, using RTA-LC for learned rankings versus OPA with its compatible DA-LC test. These are schedulability-test outcomes, not proof that one method finds every feasible priority order. [Tables 1/2; Appendices B/C]

For 150-item knapsack with weight range 200 and correlation zero, RD takes 0.0090 seconds versus RL's 0.6370, while its reference ratio drops from 102.9% to 100.7%. Greedy takes only 0.0007 seconds and scores 102.0%, so neural distillation is not uniformly the fastest or best. Sampling adds cost: default MDKP/GFPS budgets are 30/10 rankings, and RD-G does not dominate all teacher variants. [Tables 1/2; Appendix F]

Appendix B compares SCIP under 3/60/600-second limits; these are time-limited outcomes and do not certify every reference as optimal. TSP explicitly defeats the simple distillation approach: the RL teacher improves over random insertion by about 2%, but the student fails to retain comparable performance. This negative result is central to the method's context-dependency boundary. [pp. 6/11–13]

## Limitations

Training and condition adaptation costs are additional to reported inference. Benefits depend on how much the ranking distribution changes after selecting items; the TSP failure is not a universal theorem that static scoring can never solve TSP. Scheduling guarantees depend on the actual test/task assumptions; the appendix's nonpreemptive wording and cited preemptive-analysis setting should not be treated as an independently certified deployment guarantee. [Appendices B–F]

## Reproducibility

Read all **13 pages of arXiv v1**, complete bibliography and scientific Appendices A–F, and inspected all four contact sheets, tables/formulas/plots and original Figure 1/full caption. Actual submission history gives **2021-12-24**, despite the arXiv identifier beginning 2201. Primary DOI metadata confirms Woo/Lee/Cho, AAAI2022, pages 8666–8674 and publication **2022-06-28**.

The [pinned official release](https://github.com/ita9naiwa/rlrd-aaai2022/tree/3976c5aadebc81e48c8dbbadc56f28f6705ef0fe) has 127 files and no additional scientific PDF/TeX/archive. Its sole checkpoint notebook has zero cells. Read the full README, which separates global training, per-condition local training and task-specific distillation/evaluation. It requires CUDA/PyTorch, OR-Tools and fast-soft-sort. No model was deserialized, training run or latency benchmark reproduced.
