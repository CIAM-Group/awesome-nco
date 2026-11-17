---
id: time-delay-td-jobshop
short_title: TDNN-TD(lambda)
title: High-Performance Job-Shop Scheduling With A Time-Delay TD(λ) Network
authors:
- Wei Zhang
- Thomas G. Dietterich
year: 1995
date: '1995'
publication:
  date: '1995'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/4f16c818875d9fcb6867c7bdc89be7eb-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/4f16c818875d9fcb6867c7bdc89be7eb-Abstract.html
institutions:
- Oregon State University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Scheduling
problems:
- Job Shop Scheduling Problem
- Space-Shuttle Payload Scheduling
summary: Shared-kernel block features and TD(lambda) value learning guide iterative schedule repair; synthetic NASA-style
  results improve quality, while engineered features retain the better CPU/quality tradeoff.
---

# High-Performance Job-Shop Scheduling With A Time-Delay TD(λ) Network

> **TL;DR:** A TD-trained time-delay network evaluates variable-length schedules to guide iterative repair of NASA-style payload-processing plans. It reduces high-level feature engineering and improves schedule quality; the earlier engineered-feature network has the better reported CPU/quality tradeoff.

## Motivation

NASA space-shuttle payload processing combines partially ordered tasks, resource pools and fixed launch dates. The objective is a feasible short schedule. Earlier neural value functions relied on hand-engineered schedule summaries; this paper learns intermediate features from simpler schedule-block statistics (PDF pp. 1-4).

## Contributions

- Applies online TD(lambda) value learning to an existing iterative-repair search space.
- Extends shared-kernel processing to variable-length schedules through block features and pooling.
- Compares learned and engineered representations with simulated-annealing repair baselines on synthetic NASA-style problems.

## Methodology

Start from a critical-path schedule that ignores resource constraints. Existing operators reassign a resource pool or move a task to the first earlier/later suitable time, rescheduling its temporal dependents. The learned evaluator uses one-step lookahead over candidate repairs; it does not construct a schedule from an empty sequence. Each infeasible state gives reward -0.001, and the feasible terminal reward is negative resource dilation factor (RDF), a normalized resource-utilization/duration measure relative to the initial schedule (PDF pp. 2-3).

Blocks are maximal time intervals over which active tasks and resource assignments remain unchanged. Twelve supplied primitive features describe each block. Five shared kernels produce learned features; their means within each third of the schedule give fifteen pooled values, augmented by two global features. A 40-unit hidden layer and eight sigmoid outputs encode RDF using overlapping Gaussian ranges. The network has 1,123 adjustable parameters. This reduces high-level feature engineering but still depends on manually defined block statistics (PDF pp. 4-5).

## Experiments

One hundred generated problems are divided into 50 final tests, 20 validation problems and three ten-problem training sets. Training the three sets at lambda 0.2 and 0.7 gives six networks; retaining final and best-validation weights gives twelve. The best single network is selected on validation data. Results averaged across twelve networks are not a voting ensemble (PDF p. 5).

Figures 2-3 report single-run mean RDF and repair counts, 95% confidence intervals and ANOVA groupings. The selected TDNN gives significantly better RDF than the compared methods except the twelve-TDNN average. Engineered-feature networks use slightly fewer repairs than TDNN, while all neural variants improve on the two simulated-annealing repair baselines. Only accepted repairs are counted for those baselines (PDF pp. 5-6).

Repeated-search comparisons use different configurations: 50 annealing runs, one run from each of twelve networks, or ten runs of a selected single network. A reported twelve-TDNN endpoint uses 21,676 repairs for mean RDF 1.196, compared with 19,406 repairs and 1.202 for twelve engineered-feature networks. TDNN evaluates each repair more expensively; the paper names the engineered-feature G12N configuration as the best CPU/quality tradeoff. Figures 4-5 use logarithmic axes and report CPU time separately from repair counts (PDF pp. 6-7).

## Limitations

These are synthetic problems based on NASA specifications, not evidence of a deployed operational scheduler or realized monetary savings. The article defers full problem/training details to an earlier paper. Learned value approximation and restricted repair operators do not certify global makespan optimality. Different repeated-search budgets and per-action costs prevent treating fewer repairs as a general runtime advantage. Classification is specialist **improvement**, because the learned policy guides repair of an existing, initially resource-infeasible schedule.

## Reproducibility

- **Read source:** all seven official pages, printed pages 1024-1030, were read visually from rendered pages because the embedded font mapping yields unreadable extracted text. All seven references, formulas, architecture counts, plots and captions were checked.
- **Publication:** NIPS 1995 volume 8. The corrupted lambda in the old title is restored from the scanned title and official record; Thomas G. Dietterich's middle initial is restored.
- **Supplements:** the official landing has bibliography, metadata and the article. No appendix or separate scientific attachment is identified. Deferred details in the separately cited IJCAI 1995 predecessor are not claimed as read supplement content.
- **Implementation:** no code/data release or complete training settings are linked. Experiments were not rerun.
- **Relations:** all bibliography entries were checked; none identify another frozen collection entry. The earlier IJCAI paper is distinct from this NIPS article, so no self-equivalence edge is created.
