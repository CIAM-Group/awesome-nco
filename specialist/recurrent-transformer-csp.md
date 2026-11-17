---
id: recurrent-transformer-csp
short_title: Recurrent Transformer
title: Learning to Solve Constraint Satisfaction Problems with Recurrent Transformer
authors:
- Zhun Yang
- Adam Ishay
- Joohyung Lee
year: 2023
date: '2023-07-10'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=udNhDCr2KQe
venue: ICLR
paper_url: https://openreview.net/forum?id=udNhDCr2KQe
institutions:
- Arizona State University
- Samsung Research
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2307.04895
paradigm: improvement
problem_families:
- Constraint Satisfaction
problems:
- Sudoku
- Nonogram
- Shortest Path
summary: Task-specific recurrent Transformers use intermediate supervision and optional straight-through cardinality
  losses for symbolic and visual CSP prediction.
code_url: https://github.com/azreasoners/recurrent_transformer
---

# Learning to Solve Constraint Satisfaction Problems with Recurrent Transformer

> **TL;DR:** An encoder-only Transformer repeatedly reuses its blocks, supervises intermediate predictions, and can add straight-through cardinality losses. Separately trained Sudoku, Nonogram and path models improve several benchmark accuracies, without a shared-task checkpoint or guaranteed feasible/optimal decoding.

## Motivation

Structured puzzles require repeated relational reasoning. The paper investigates whether recurrent full-attention encoders can learn this computation and ground handwritten symbols without exposing their input-digit labels. Known constraints can additionally guide learning when solution labels are scarce. The baseline data-only model and explicitly constraint-trained variants should be distinguished (Sections1-3/5).

## Contributions

- Recurrent reuse of encoder blocks provides additional reasoning steps with fewer parameters than a deep unshared stack.
- Cross entropy at every block/recurrence supports intermediate supervision rather than only a final loss.
- A CNN token embedder supports ungrounded visual Sudoku, where given-digit labels are masked during training.
- Discrete cardinality penalties with identity straight-through gradients can act on outputs and attention; semi-supervised Sudoku and supervised path tests illustrate their effects.

## Methodology

**Architecture.** Tokens represent task variables. Token embeddings, learned positional embeddings, full self-attention, residual MLPs and a shared output head predict variable domains. L distinct blocks are repeated R times; parameters are shared across recurrences within that model, not across all task-specific trained networks. Most Sudoku models train with32 recurrences and test with64. The standard small model uses one block, four heads and128-dimensional embeddings. Visual versions replace text embedding with a LeNet-style CNN. Nonogram15x15,16x16 Sudoku and path experiments have different contexts/widths/output encodings (Sections3-4/AppendicesA/F).

**Losses.** Sum cross entropy over known targets at every intermediate output. Ungrounded visual Sudoku masks the labels at given cells, preventing the original digit-label leakage in SATNet's training setup. Optional cardinality losses threshold probabilities at0.5, count active atoms and penalize violations of lower/upper/exact counts. Identity straight-through differentiation substitutes a surrogate derivative of one; it is not the true derivative of the discrete threshold or a convergence guarantee. Sudoku penalties encourage each digit exactly once in rows/columns/boxes, and an auxiliary attention penalty encourages mass on structurally related cells. Attention constraints are inductive biases, not proof of valid solutions (Sections3/5).

**Path-specific supervision.** The shortest-path loss penalizes endpoint degree one and degree two at internal nodes identified from the target path. Thus that loss uses solution-label information and is not a label-free equivalent of the full shortest-path constraint. These local degree conditions alone do not establish connectivity, absence of disjoint cycles, avoidance of removed edges or minimum length; those outcomes are separately evaluated. Model predictions remain direct classifications without a complete symbolic verification/repair solver (AppendixD.1; inspected reg_sp).

## Experiments

**Sudoku protocols.** SATNet's easier9x9 data has31-42 givens and9k/1k train/test puzzles; RRN's harder data has17-34 givens and180k/18k, with a hardest17-given subset. The main table reports100%/99.5%/96.7% for textual SATNet/RRN/hardest and93.5%/75.6% for ungrounded SATNet-V/RRN-V at9k/1k. These are whole-board accuracies for distinct trained settings. Visual solution accuracy checks only initially empty cells; whole-board accuracy additionally checks given-digit classifications. AppendixTable6 gives RRN-V whole/solution74.8/75.5%, while main Table1 lists75.6% whole-board; both source values are retained as a reporting discrepancy rather than silently merged (Tables1/6).

SATNet-V93.5% exceeds the cited enhanced SATNet64.8%; RRN-V180k/18k with an eight-head model reaches89.52% whole-board. These compare particular neural baselines and data regimes, not arbitrary exact Sudoku solvers. Textual position removal drops100% to0%, showing dependence on the fixed variable-position encoding.16x16 Sudoku reaches99.9% on each of two1,000-test-board sets, but the generator did not supply harder/fewer-given boards; a different256-dimensional/eight-head model is trained (Section4/AppendicesB-C/F).

**Constraint and sample efficiency.** On9k/1k RRN data, adding both losses increases textual64-step accuracy81.9→87.0% and visual75.6→83.6%. This is not monotone at every setting: attention alone changes textual32-step80.3→80.1%. With4k labels and8k unlabeled examples,64-step textual/visual results reach73.3/64.4% versus62.0/44.0% with4k labels alone. AppendixB.3 explicitly reports that too many unlabeled examples at a fixed constraint weight can reduce accuracy (Tables2-3/Figures9-10).

**Paths and other tasks.** SP4 is a4x4 grid. Baseline recurrent prediction gives84.5% valid-path,100% no-removed-edge and83.5% shortest-path accuracy; adding the path loss gives91.9/100/91.0%. NeurASP's valid-path result96.6% is higher than91.9%, despite its weaker shortest-path33.2%, so these metrics do not support one blanket superiority claim. A separately trained12x12 model gives72.3% without and76.0% with the loss after2,000 epochs. Nonogram whole-puzzle results are97.5% on7x7 and78.3% on15x15, each9k/1k. MNIST mapping gives99% but is a separate symbol-mapping test, not another optimization solver (Section4.2/AppendixD).

**Time and reproducibility conditions.** AppendixTable5 compares RRN loss evaluation/training: cross entropy120s/epoch, added cardinality122s, first-step CL-STE211s, all-step CL-STE3,796s. The last setting reduces batch size eightfold to fit memory, so the ratio is not a matched-batch primitive-operation speedup. Experiments use a fixed seed0, Ubuntu18.04, two10-core XeonE5-2640v4 CPUs and four GTX1080 GPUs. Full total training/inference timing and repeated-run uncertainty across all tasks are not reported. Table1's H4/128 labeling and the large-RRN H8/256 configuration in AppendixF should not be collapsed into an exact single architecture specification; SP4 data size also differs between AppendixD.1's1,610/split and Table11's10k/2k label (AppendicesB/F).

## Limitations

### Discussed in the Paper

More blocks/heads increase model size, and more recurrences increase computation. Small head counts can hurt convergence; difficulty and visual classification errors limit whole-board accuracy. Excess unlabeled constraint supervision can override labels. Harder16x16 Sudoku could not be tested with the available generator (Sections4-6/AppendicesB-C).

### Curator Notes

Constraint penalties and interpretable attention plots do not certify satisfaction or minimum path length. Learned positional embeddings, separate input encoders, context sizes and training runs limit claims of generality: this is a reusable architecture with specialist task models, not one unchanged generalist checkpoint. More inference recurrences help within tested ranges but do not prove convergence or arbitrary-size transfer. AppendixB.4's exponential-CNF discussion describes the chosen expanded encoding; cardinality constraints also admit compact auxiliary-variable encodings, so it is not an impossibility result for every CNF representation.

The release confirms recurrent block reuse, intermediate losses, true identity-STE code and the label-dependent path penalty. README examples use learning rate0.001 while AppendixF lists6e-4 in several corresponding settings, and its all.sh workflow describes repeated seeds while the paper specifies seed0. These current-release differences should be reconciled for exact reproduction. No training or evaluation was rerun.

## Reproducibility

- **Publication:** [official ICLR2023 poster](https://iclr.cc/virtual/2023/poster/11188) links the matching [OpenReview record](https://openreview.net/forum?id=udNhDCr2KQe). Formal year2023 is verified separately from the reading copy's July10 arXiv posting; no unverified exact formal publication day is inferred from the event date. Three authors and ASU/Samsung affiliations match.
- **Scientific coverage:** all twenty-two [arXiv2307.04895v1](https://arxiv.org/pdf/2307.04895v1) pages, references and AppendicesA-F. A fresh explicit-v1 download has the identical source SHA256. Normal OpenReview/API requests encountered a verification403; no bypass was attempted. The complete author archive has no additional scientific PDF/archive, and all appendix scientific content identified in the source was read/rendered.
- **Implementation:** [official recurrent_transformer](https://github.com/azreasoners/recurrent_transformer). Full archive inventory, README, main recurrent/loss modules and path STE implementation inspected. Large external datasets require the documented downloads; current code/settings differences are recorded above.
- **Relations:** SATNet is the only exact current-catalogue work with explicit body citations and matching bibliography identity. General Transformer/logic-learning citations and absent RRN/CL-STE papers were not turned into inferred catalogue relations.
