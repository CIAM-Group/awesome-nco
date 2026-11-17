---
id: learn-schedule-straight-line
short_title: Learning Code Scheduling
title: Learning to Schedule Straight-Line Code
authors:
- J. Eliot B. Moss
- Paul E. Utgoff
- John Cavazos
- Doina Precup
- Darko Stefanovic
- Carla E. Brodley
- David Scheeff
year: 1997
date: '1997'
publication:
  date: '1997'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1997/hash/bcc0d400288793e8bdcd7c19a8ac0c2b-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1997/hash/bcc0d400288793e8bdcd7c19a8ac0c2b-Abstract.html
institutions:
- University of Massachusetts Amherst
- Purdue University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Instruction Scheduling
summary: A neural pairwise comparator guides greedy Alpha instruction scheduling from optimal small-block labels;
  simulated SPEC95 results are close to other learners and below the stronger DEC heuristic.
---

# Learning to Schedule Straight-Line Code

> **TL;DR:** Supervised pairwise preferences guide greedy instruction scheduling. A ten-hidden-unit neural model matches the other learned methods closely on Alpha/SPEC95 simulation; it does not beat the stronger DEC heuristic or establish optimal complete schedules.

## Motivation

Equivalent instruction orderings can execute differently on a pipelined processor. Handcrafting scheduling heuristics for each architecture is expensive. The paper learns local decisions within straight-line basic blocks, preserving a register/memory-dependence DAG rather than rewriting instructions or scheduling globally across blocks (PDF pp. 1-3).

## Contributions

- Casts next-instruction selection as a pairwise preference on a partial schedule and two available candidates.
- Generates supervision from exhaustive optimal completions of small blocks.
- Compares decision trees, table lookup, ELF function approximation and a feedforward neural network under program-held-out validation.

## Methodology

A greedy scheduler repeatedly selects among currently legal instructions using pairwise comparisons. Labels are inferred only when one candidate's best possible completion is better than every completion following the other, accommodating multiple optimal schedules. Reversing a labeled pair provides its counter-example (PDF pp. 2-3).

Five feature types describe instruction class, weighted critical path, earliest execution delay, possible dual issue and odd/even partial-schedule length. Categorical features become indicator vectors for NN/ELF. The neural variant has ten hidden units and scaled-conjugate-gradient backpropagation; it is one of four compared learners, not the only proposed method. Feature design still uses vendor heuristics and domain knowledge (PDF pp. 3-5).

## Experiments

The target is Digital Alpha 21064, using 18 SPEC95 programs: 447,127 basic blocks and 2,205,466 instructions. The simulator assumes cache/TLB hits and idle resources at block entry. Execution estimates sum simulated block cycles weighted by observed execution frequencies, then aggregate program ratios geometrically. These are predicted program costs, not measured processor speedups (PDF pp. 4-5).

Blocks of at most ten instructions supply exhaustive labels: over 13 million choice pairs and 26 million ordered triples. The experiment samples 1% of pairs while retaining their reversed counterparts and performs 18-fold leave-one-program-out evaluation. Small blocks represent 92% of blocks, but larger blocks execute disproportionately often (PDF pp. 3,5).

Table 2 reports NN's all-block cycle ratio to the production compiler as 0.997, with 95% interval 0.986-1.008. Its 98.1% optimal-choice figure concerns labeled decisions in small blocks, **not** the percentage of globally optimal complete schedules. Table lookup is the best learned method by the all-block ratio (0.995); DEC's handcrafted scheduler is better (0.983). The learned point estimates slightly improve on the production compiler, but their reported confidence intervals include ratio 1 (PDF p. 6).

Temporal-difference learning is described as qualitatively worse and deferred to another report. Real-processor results are also described only through a separate submitted paper, where ELF reportedly ties the original compiler; they are not this article's main experiment. Training/scheduler overhead and transfer to other processors remain open (PDF pp. 6-7).

## Limitations

The learned relation depends on lossy, architecture-specific features and supervision from small optimal schedules. Local decision accuracy does not directly determine frequency-weighted whole-program cost. The simulator omits cross-block/cache effects, and the paper gives no production-compiler scheduling-overhead benchmark. This is a specialist constructive decision component, without a global optimality or cross-architecture generalization guarantee.

## Reproducibility

- **Read source:** all seven official scanned pages, printed pages 929-935, including all twelve references. Features, Table 2 and evaluation/label-generation details were visually checked.
- **Publication:** official NIPS 1997 volume 10 record. Full publisher names restore J. Eliot B. Moss, Paul E. Utgoff and Carla E. Brodley; the seven-author order and UMass/Purdue affiliations are preserved.
- **Supplements:** the official entry links bibliography, metadata and the article. No separate scientific appendix/attachment is identified. Submitted/technical reports cited for other results are not treated as read supplements.
- **Implementation:** the DEC simulator and instrumentation are described, but no complete learned scheduler/training release is linked or verified. Experiments were not rerun.
- **Relations:** no reference identifies another frozen collection entry, so no outgoing internal edge is added.
