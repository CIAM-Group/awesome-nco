---
id: rl-qbf
short_title: RL-QBF
title: Learning Heuristics for Quantified Boolean Formulas through Reinforcement Learning
authors:
- Gil Lederman
- Markus N. Rabe
- Edward A. Lee
- Sanjit A. Seshia
year: 2020
date: '2018-07-20'
publication:
  date: 2020-04
  source_url: https://openreview.net/forum?id=BJluxREKDB
venue: ICLR
paper_url: https://openreview.net/forum?id=BJluxREKDB
institutions:
- University of California, Berkeley
- Google Research
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/1807.08058
paradigm: constructive
problem_families:
- Satisfiability
problems:
- Two-Block Quantified Boolean Formulas
summary: A small RL graph policy guides certifying CADET on forall–exists2QBF, with benchmark-specific runtime gains
  and limited transfer.
---

# Learning Heuristics for Quantified Boolean Formulas through Reinforcement Learning

> **TL;DR:** A small graph policy learns branching decisions inside the certifying CADET engine for forall–exists 2QBF. It improves its training-family benchmark at larger time limits, while cross-benchmark transfer remains weaker than VSIDS.

## Motivation

The paper seeks tighter integration of learned decisions with a symbolic reasoning engine: neural models choose branches, while the engine retains deduction and proof production. This setting has variable-size actions, long high-variance episodes and substantial inference overhead, so fewer decisions need not mean less runtime (formal pp.1–4).

## Contributions

- CADET incremental determinization is exposed as an RL environment, preserving its symbolic search and proof-producing capability.
- A clause/literal GNN plus a shared per-literal policy handles formulas of varying size without learning names for variables.
- REINFORCE learns specialized branching behavior on Reductions, with within-family long-episode transfer and separate Boolean/Words experiments. The demonstrated task is 2QBF with prefix forall X, exists Y and a CNF matrix, not arbitrary quantified logics or shared optimization across native problem families (formal Sections2–5; AppendicesE–F).

## Methodology

**Host and actions.** CADET retains incremental determinization, propagation of Skolem functions, conflicts, backtracking, restarts and termination. A policy action selects a literal, hence a variable and polarity. The formal version explicitly masks universally quantified and already assigned variables. Proof production and possible independent checking come from the engine; the network supplies neither a standalone truth classifier nor a new proof system (formal pp.4–6).

**Observation and network.** The bipartite graph contains literals and clauses, including learned clauses. Seven variable labels encode universal/existential type, existing Skolem function, constant truth value and decided polarity; one clause label distinguishes original from learned. Literal embeddings have dimension16 and clause embeddings64. Sum-based clause/literal updates account for each literal and its negation. Five global values describe decision level, restart counts, conflicts to the next restart and the fraction of variables with Skolem functions. A two-layer ReLU policy combines literal/negation embeddings, labels and global state, then applies masked softmax (formal pp.5–6,14).

**Learning.** REINFORCE jointly trains encoder and policy. Each batch samples one formula and generates repeated episodes, capped at400 decisions during training. Each decision gets−0.0001 and successful completion adds terminal reward1; incomplete capped episodes receive no terminal success. Reward normalization, input whitening and gradient clipping stabilize updates. The best reported model has one GNN iteration and8353 parameters. AppendixD specifies10million steps on AWS C5, learning rate0.0006 for the first2million then0.0001, gamma0.99, clipping2 and at least1200 timesteps per batch (formal pp.7–8,14–15).

## Experiments

**Data and baselines.** The accepted paper gives4608 Reductions formulas, removes2573 needing no heuristic decisions, reserves200 for testing and uses1835 for training. Average size is316 variables, with largest instances over1600variables/12000clauses. These exact formal counts replace the rounded, internally inconsistent numbers in arXivv3. Baselines are CADET's VSIDS with Jeroslow–Wang polarity and uniform random branching; they share the symbolic engine (formal pp.4–7).

**Decisions and runtime.** Figure3 reports one episode per formula/heuristic and cactus curves sorted separately for each method. Learned solves more Reductions cases at the400-decision training limit and at longer decision budgets. With a one-hour per-instance timeout it solves120 versus VSIDS110; reaching110 solved formulas requires less than12minutes versus one hour. At limits up to10seconds VSIDS solves more. These are timeout/solve-count comparisons, not an average10X speedup across all instances; the conclusion's10X wording is broader than the particular threshold comparison described in the results (formal pp.7–9).

**Transfer.** On the separate QBFEVAL 2QBF set, the Reductions-trained policy solves111 formulas, compared with VSIDS125 and random67. AppendixE trains new policies for Boolean and Words, rather than reusing the Reductions checkpoint. Boolean random-circuit formulas average50.7variables; Words bitvector-derived formulas71.4. The Words policy is reused on Words30, averaging186.6variables, supporting within-family size transfer measured by decisions (formal p.8,15–17).

**Ablations.** Zero message rounds learn behavior better than random but below VSIDS. Two/three rounds slightly improve decision counts at greater overhead; one round gives best wall-clock behavior in the implementation. Untied transformations, residual access, layer normalization and GRU variants do not clearly improve the overall tradeoff. Adding VSIDS activity features learns faster initially but degrades final generalization in the reported tests (formal pp.17–18).

## Limitations

### Discussed in the Paper

Cross-benchmark transfer is limited. A Python agent in a separate process incurs communication/context-switch costs and at least an order-of-magnitude lower decision throughput. More engineering could reduce this overhead, but future performance improvements are not measured results. Bigger networks fail to deliver better runtime (formal pp.2,8–9,18).

### Curator Notes

The engine's broad ability to handle large formulas must be distinguished from the sizes tested with learned policies. Formal scope is forall–exists 2QBF; separate dataset policies and size transfer do not establish a generalist cross-native-task checkpoint. Independent proof-checking capability is a correctness mechanism, not evidence that this audit reran or checked every experiment's proof. Cactus curves and selected timeout thresholds must accompany timing claims, especially the negative small-time and QBFEVAL results.

## Reproducibility

- Primary reviewed scientific version: all18pages of the [Berkeley author-hosted accepted ICLR2020 PDF](https://ptolemy.berkeley.edu/publications/papers/20/LedermanEtAl_QBF_ICLR_2020.pdf), including integrated AppendicesA–G. The [official ICLR2020 listing](https://iclr.cc/virtual_2020/poster_BJluxREKDB.html) independently confirms formal publication. Author order here follows the accepted PDF (Lee before Seshia); the ICLR webpage lists those two in the opposite order.
- The audit also fully read17-page [arXiv:1807.08058v3](https://arxiv.org/pdf/1807.08058v3), dated2019-10-30, before finding the accepted copy. The formal paper explicitly calls arXiv an earlier version; they are not asserted byte- or content-identical. Method/results above follow accepted page numbers.
- Supplement discovery checked the OpenReview forum, both public API endpoints and supplementary-attachment endpoint; these returned a challenge/403. Both complete copies integrate all scientifically referenced appendices, and no additional scientific appendix is identified in their text. The author-linked repository was also checked; this is a factual discovery record, not a claim that inaccessible attachments do not exist.
- The formal paper's code/data link, [lederg/learningqbf](https://github.com/lederg/learningqbf), currently displays an empty repository (Git tree API409). It is not presented as an available reproduction implementation. No CADET training, inference or proof-checker execution was rerun in this audit.
