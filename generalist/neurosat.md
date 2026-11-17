---
id: neurosat
short_title: NeuroSAT
title: Learning a SAT Solver from Single-Bit Supervision
authors:
- Daniel Selsam
- Matthew Lamm
- Benedikt Bünz
- Percy Liang
- Leonardo de Moura
- David L. Dill
year: 2019
date: '2018-02-11'
publication:
  date: '2019'
  source_url: https://openreview.net/forum?id=HJMC_iA5tm
venue: ICLR
paper_url: https://openreview.net/forum?id=HJMC_iA5tm
institutions:
- Stanford University
- Microsoft Research
scope: generalist
paper_type: solver
arxiv_url: https://arxiv.org/abs/1802.03685
paradigm: constructive
problem_families:
- Satisfiability
- Graph Optimization
problems:
- Boolean Satisfiability
- Graph Coloring Decision
- Clique Detection
- Dominating Set Decision
- Vertex Cover Decision
summary: One recurrent SAT model learns from satisfiability bits and decodes candidate assignments; reduction-based
  transfer covers small bounded graph decision tasks, with no UNSAT or optimization completeness guarantee.
code_url: https://github.com/dselsam/neurosat
---

# Learning a SAT Solver from Single-Bit Supervision

> **TL;DR:** NeuroSAT is trained only to classify satisfiable/unsatisfiable formulas. Recurrent literal-clause message passing learns embeddings from which candidate satisfying assignments can be decoded by clustering. The same trained model transfers through SAT encodings to several small graph decision problems, while remaining much less reliable than conventional SAT solvers.

## Motivation

The paper asks whether one satisfiability bit per formula can teach a neural network precise discrete search, without supervising assignments or individual solver decisions. It is primarily a study of learned reasoning, not a claim to replace highly engineered SAT solvers.

## Contributions

- A size-independent recurrent message-passing architecture that respects variable/clause permutation and variable-negation symmetries.
- A training distribution of nearly identical SAT/UNSAT pairs, intended to discourage classification by crude formula statistics.
- Assignment extraction from learned literal embeddings, size/time extrapolation and reuse through SAT reductions. A separately trained NeuroUNSAT model studies detection of a few small contradiction templates.

## Methodology

Each variable has two literal nodes, with clause nodes connected to their occurring literals and a distinguished relation between complementary literals. Learned messages flow from literals to clauses and back, with layer-normalized LSTM updates. After a fixed number of recurrent rounds, an MLP produces per-literal votes whose mean is a satisfiability logit. All parameters are shared across graph sizes and recurrent steps; no test graph labels or truth assignments are supplied.

The SAT/UNSAT training pairs differ by negating one literal occurrence in the final clause. A conventional MiniSAT solver is repeatedly queried to generate and label these pairs. Thus single-bit supervision avoids assignment labels but does not eliminate solver-dependent training-data generation.

Directly thresholding literal votes does not reliably give an assignment. The decoder instead clusters the high-dimensional literal embeddings into two groups, aligns each variable's complementary literals with the two centers, and tests both truth-value orientations. A verified assignment is a SAT certificate. A classifier output, failed clustering or exhausted recurrent budget is not an UNSAT proof.

The same trained NeuroSAT checkpoint, learned on random CNF, is applied to SAT encodings of graph coloring, clique-existence, bounded dominating-set and bounded vertex-cover decision problems. This supports reduction-based generalist reuse. The paper does not optimize clique cardinality or minimum cover/dominating-set size through an evaluated optimization loop. Recurrent embedding updates followed by assignment decoding are classified here as constructive; there is no explicit incumbent local-move solver.

## Experiments

The model trains on millions of randomly generated formulas with uniformly sampled 10-40 variables. Literal/clause embeddings and hidden units have dimension 128. Training uses 26 recurrent rounds, three-hidden-layer MLPs, Adam at `2e-5`, global gradient clipping and batches capped at 12,000 literal-plus-clause nodes. The paper does not specify a complete hardware/runtime budget for training.

On the 40-variable test distribution, Table 1 reports 85% overall classification accuracy: 96% on UNSAT formulas and 73% on SAT formulas. The fraction of SAT formulas with an extracted satisfying assignment is 70%. These are different denominators and tasks; classification accuracy must not be reported as solver success. The observed low-confidence UNSAT behavior is a search failure pattern, not a logically justified negative decision.

For larger formulas, more message-passing rounds improve witness recovery. The paper reports roughly 25% of satisfiable 200-variable instances solved with four times the training number of rounds, versus under 10% at the training budget. This is extrapolation within the random generator, with increased inference work, not guaranteed convergence after enough iterations.

The cross-task experiment starts with 100 graphs from each of six random graph families, averaging ten nodes and seventeen edges. It generates 7,200 bounded graph decision instances, then retains only the 4,888 satisfiable formulas. The fixed trained model runs for 512 rounds and yields satisfying assignments on 85% of this SAT-selected collection. This is evidence for transfer through SAT encodings on small graphs; it is not mixed SAT/UNSAT accuracy, optimal graph-solution quality or large-graph scalability. The compared Survey Propagation variant fails to converge to assignments on this collection, but the authors explicitly do not claim superiority to modern SAT solvers.

NeuroUNSAT is a different trained model, using formulas whose negative examples contain one of three fixed small unsatisfiable cores. It reaches 100% classification accuracy on that constructed test distribution, and isolates core-related literals by clustering 98% of the time. The authors explicitly expect template memorization rather than a generic UNSAT proof procedure. These results must not be attributed to the original NeuroSAT checkpoint or arbitrary contradictions.

## Limitations

### Reported by the Authors

- NeuroSAT is much less reliable than state-of-the-art SAT solvers, with no obvious route shown to surpass them.
- The original model is not helpful for constructing UNSAT proofs; NeuroUNSAT is restricted to its small trained core templates.
- Useful information before a satisfying assignment emerges is unclear, limiting straightforward integration into conventional solvers.

### Curator Notes

- Single-bit labels still require extensive conventional-solver generation, and inference may need hundreds of recurrent rounds plus clustering and assignment checks.
- Graph transfer is to bounded decision instances through explicit SAT encodings; it does not establish optimal clique, cover, coloring-number or dominating-set optimization.
- Selected satisfiable test formulas, classification percentages, witness success and separate-model core detection are distinct evaluation outcomes.
- Size-independent parameters and additional recurrent steps do not constitute a completeness or termination guarantee.

## Reproducibility

- **Formal qualification:** [ICLR 2019 official paper listing](https://iclr.cc/Downloads/2019) and the publication header identify the conference article; [OpenReview](https://openreview.net/forum?id=HJMC_iA5tm) remains the canonical record.
- **Actual reading copy:** [arXiv:1802.03685v4](https://arxiv.org/abs/1802.03685v4), revised 12 March 2019. All 11 pages were read, including every reference, equation, result and NeuroUNSAT discussion; key formulas/figures/Table 1 were visually checked.
- **Official code:** [dselsam/neurosat](https://github.com/dselsam/neurosat), with Python/scripts resources and README. Code availability is separate from numerical reproduction.
- **Supplement discovery:** the formal forum/API/attachment endpoints returned access challenges; the complete arXiv copy and author repository were checked, and no separate scientific appendix was referenced in the paper or found in the repository. This records the available-source check without claiming to have retrieved an inaccessible OpenReview archive.
- **Validation scope:** literature/source/note verification; training and experiments were not rerun.
