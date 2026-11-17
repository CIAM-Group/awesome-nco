---
id: value-set-invariance
short_title: Value-Set Invariance
title: Neural Models for Output-Space Invariance in Combinatorial Problems
authors:
- Yatin Nandwani
- Vidit Jain
- Mausam
- Parag Singla
year: 2022
date: '2022-02-07'
publication:
  date: '2022'
  source_url: https://openreview.net/forum?id=ibrUkC-pbis
venue: ICLR
paper_url: https://openreview.net/forum?id=ibrUkC-pbis
institutions:
- Indian Institute of Technology Delhi
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2202.03229
paradigm: constructive
problem_families:
- Constraint Satisfaction
problems:
- Sudoku
- Futoshiki
- Graph Coloring
summary: Two recurrent graph models transfer within a CSP domain to larger value sets,
  trading binarized accuracy against a compact model with a preallocated embedding
  pool.
---

# Neural Models for Output-Space Invariance in Combinatorial Problems

> **TL;DR:** Two RRN-based architectures learn to complete puzzles with a larger set of possible values than in training. Binarization generally transfers better from small training puzzles; the compact multi-valued model uses less memory but needs a known maximum value-set size. Models are trained separately for each task.

## Motivation

Graph-size flexibility alone does not remove a fixed classifier's output-label limit. A network trained to assign nine Sudoku digits or four graph colors cannot simply acquire new output labels by increasing the graph size. The paper studies transfer between groundings of the same lifted constraint-satisfaction problem (CSP), with different variable and value-set sizes (Sections 1-3).

## Contributions

The binarized model converts each variable/value pair into a Boolean node and reuses three learned input embeddings for zero, one and unassigned states. Its output vocabulary stays binary while the message graph grows. The multi-valued model instead introduces explicit value nodes, a relation message-passing graph and a variable constraint graph, avoiding replication of every variable per value.

These are specialized learned CSP solvers evaluated on Futoshiki, graph coloring and Sudoku, rather than one checkpoint jointly solving the three domains. Value-set invariance means architectural accommodation and observed transfer within the same domain; it is not a proof of perfect generalization or guaranteed feasible predictions.

## Methodology

Training receives solved/partially solved examples, typed constraint graphs and graphs describing relations between values. The explicit logical constraints are unavailable to the network, but relational structure is supplied. Typed recurrent messages and layer-normalized LSTM updates produce final per-variable argmax predictions. Loss is applied at each recurrent step.

The binarized graph has n*k nodes for n variables and k values, including replicated constraint edges and within-variable relational edges. Binary cross-entropy trains its scores. The multi-valued model first creates relation-aware value embeddings, then exchanges messages on the compact constraint graph and scores variable/value pairs. During training it randomly selects and permutes k embeddings from a pool of size k_max; testing uses the first k-prime embeddings. Consequently k_max must be chosen in advance. A pairwise orthogonality penalty discourages identical value embeddings.

Main experiments use 96-dimensional embeddings, 32 constraint-message steps, one relation-message step for the multi-valued model, and Adam with learning rate 0.0002. The value pools are 12/7/16 for Futoshiki/coloring/Sudoku. Model averaging combines checkpoints after the learning curve flattens. For multiple-solution tasks, an algorithmically validated discovered solution can replace the supplied training target (Appendix).

## Experiments

Training uses 12,300 size-6 Futoshiki boards, 25,010 four-color graph examples and 10,000 size-9 Sudoku puzzles. Larger value sets are tested separately. Reported numbers are means and standard deviations over three seeds. Board accuracy requires a valid complete CSP solution; pointwise accuracy gives partial credit. For multiple-solution coloring and size-24/25 Sudoku, a local search approximates the closest valid solution, giving a lower bound on the ideal pointwise metric (Appendix, pages 16-19).

From size-6 Futoshiki training, size-12 board accuracy is 68.15% +/- 22.08 for the binarized model versus 11.97% +/- 5.54 for the multi-valued model. For seven-color graphs after four-color training, the corresponding values are 94.35% +/- 4.82 and 72.21% +/- 11.17. NLM baselines are competitive on some settings but suffer memory limits, and no Sudoku NLM model was successfully trained at the tested configuration (Tables 1-3).

With size-9 Sudoku training, size-16 board accuracy falls to 27.31% +/- 23.81 for binarization and 19.70% +/- 14.03 for the multi-valued model. A separate multi-valued checkpoint fine-tuned on 8,000 size-24 puzzles achieves 54.57% +/- 21.25 at size 24 and 43.77% +/- 14.42 at size 25. The Table 4 binarized comparator remains trained at size 9 because size-24 fine-tuning did not fit in memory. The result should not be presented as an equal-training comparison.

The compact model uses less inference time and memory in the measured Futoshiki experiment. Its training does not always take less wall time: Table 9 gives 33 hours versus 17 for binarization on coloring, and 68 versus 63 on Sudoku. Smaller inference graphs and larger batches do not imply uniformly cheaper training.

## Limitations

Transfer depends on learned graph reasoning and can degrade sharply or vary substantially across seeds. The multi-valued embedding pool imposes a known upper size bound; binarization increases memory and runtime. Dataset generation changes with size: uniqueness becomes harder to verify and mask ranges decrease, while high-chromatic-number graphs have fewer nodes. These are not controlled increases in just one difficulty dimension.

The appendix's representational and learnability discussion is a hypothesis based on recurrence, labels and existing GNN results, not a new guarantee that every transferred CSP is solved. The paper does not benchmark against industrial SAT solvers or establish a speed advantage over them. The coloring training-node range is 40-120 in prose but 40-100 in Table 5; this unresolved source discrepancy is not silently normalized.

## Reproducibility

- [ICLR 2022 record](https://openreview.net/forum?id=ibrUkC-pbis) and the [official conference downloads](https://iclr.cc/Downloads/2022) establish the conference entry. The scientific source read is the complete 20-page [arXiv v1](https://arxiv.org/abs/2202.03229v1), dated February 7, 2022, including its integrated appendix and bibliography. This date is the preprint date, separate from the formal publication year.
- Architecture, datasets, metrics, hyperparameters and training costs are described in the read appendix. The manuscript promises release on acceptance but supplies no implementation URL; no unverified code link is added.
- Both OpenReview API versions returned 403 for `ibrUkC-pbis`; no explicitly referenced missing scientific document was identified. Key graph construction, metric definitions and result tables were visually inspected. Experiments were not rerun.
