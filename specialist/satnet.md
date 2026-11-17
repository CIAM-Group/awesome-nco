---
id: satnet
short_title: SATNet
title: 'SATNet: Bridging deep learning and logical reasoning using a differentiable satisfiability solver'
authors:
- Po-Wei Wang
- Priya L. Donti
- Bryan Wilder
- Zico Kolter
year: 2019
date: '2019-05-24'
publication:
  date: '2019-05-24'
  source_url: https://proceedings.mlr.press/v97/wang19e.html
venue: ICML
paper_url: https://proceedings.mlr.press/v97/wang19e.html
institutions:
- Carnegie Mellon University
- University of Southern California
- Bosch Center for Artificial Intelligence
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Differentiable Optimization
- Constraint Satisfaction
problems:
- MAXSAT
- Parity Learning
- Sudoku
- Visual Sudoku
summary: Task-trained differentiable low-rank MAXSAT layers support parity and Sudoku learning through implicit
  SDP gradients.
code_url: https://github.com/locuslab/SATNet
---

# SATNet: Bridging deep learning and logical reasoning using a differentiable satisfiability solver

> **TL;DR:** A differentiable low-rank MAXSAT relaxation learns task-specific logical relationships. Coordinate-descent forward and implicit backward passes support parity and Sudoku learning, without providing an exact discrete SAT certificate.

## Motivation

Logical constraints are difficult for ordinary neural layers to discover and enforce. SATNet introduces an optimization layer whose parameters describe a smoothed logical objective and can be learned jointly with perception. The experiments ask whether this layer can learn relations from examples without being handed explicit Sudoku rules (Sections1–2).

## Contributions

- A low-rank semidefinite relaxation of MAXSAT becomes a neural layer mapping known variable assignments to predictions for unknown assignments.
- Analytical differentiation through a converged fixed point avoids storing every forward update; a similar coordinate algorithm solves the backward linear system (Theorem1).
- CPU/GPU implementations support task-specific parity, ordinary/permuted Sudoku and visual Sudoku models. The same layer design is reusable, but shared weights across these native tasks are not demonstrated; the note retains specialist scope.

## Methodology

**Relaxed objective.** Binary variables are represented by unit vectors relative to a truth direction. A low-rank factorS defines the SDP objective, and the variable vectorsV minimize a quadratic form with unit-norm constraints. In the learned layer,S is trainable and need not remain a discrete clause-incidence matrix; learning it is not equivalent to recovering a unique human-readable rule set. The paper chooses vector dimension above the stated square-root rank bound for the associated SDP. SDP recovery and cited coordinate-convergence properties concern a relaxation, not exact MAXSAT or proof of Boolean unsatisfiability (pp.3–4).

**Forward and rounding.** Known inputs are held fixed after relaxation. Output vectors are updated one at a time using the normalized negative interaction vector; low-rank accumulators receive rank-one updates. During training, outputs are probabilities obtained from the angle to the truth vector. At test time thresholding or repeated random-hyperplane rounding can produce discrete predictions. Approximation ratios mentioned for special problems assume appropriate objective weights and rounding; they do not establish a general guarantee for arbitrary learnedS or Sudoku boards (Algorithms1–2, Sections3.1–3.2).

**Backward pass.** Theorem1 expresses derivatives using tangent projectors and a pseudoinverse of the linearized fixed-point system. A coordinate solve computes adjoint quantities and gradients forS and known inputs, without unrolling the forward trajectory. This derivation presumes a converged, differentiable fixed-point setting and nonzero interaction norms where the normalized updates/derivatives divide; it is not a blanket differentiability claim at degenerate solutions. Forward/backward sweeps costO(nmk) in the stated dimensions (p.5; supplementA–D).

**Task architectures.** Parity uses a deliberately specified chain ofL−1 SATNet layers with tied weights and supervision only on the final parity bit. Sudoku uses a vectorized bit board and an explicit known/unknown mask, one layer with300 auxiliary variables andm600, trained from solved-board examples with digit-wise negative log likelihood. Visual Sudoku adds a cell-wise LeNet front end, with Adam rates0.002 for SATNet and0.00001 for perception. The mask and chain are architectural priors even though the complete Sudoku constraint system is not supplied (pp.6–8).

## Experiments

**Parity.** For lengths20 and40, each dataset contains9000 training and1000 test examples. The designed chained model reaches zero held-out error within20epochs, versus best reported LSTM error0.476 over100epochs. This is final-bit supervision for a known chain structure, not discovery of an arbitrary program topology (p.6,Figure2).

**Sudoku.** Table1 reports whole-board accuracy after100epochs:98.3% on both ordinary and separately trained fixed-bit-permuted9x9 Sudoku, each with9000/1000 train/test examples. Ordinary ConvNet/ConvNetMask obtain0.04%/15.1% test accuracy; permuted versions obtain0%/0%. The ordinary SATNet reaches95% at22epochs/37minutes and98.3% at100epochs/172minutes on a GTX1080Ti. Permutation removes the CNN's spatial locality advantage but does not establish one trained model's zero-shot permutation invariance (p.7).

**Visual Sudoku.** Joint LeNet–SATNet training obtains63.2% test-board accuracy and93.6% train accuracy; ConvNetMask obtains0.1% test accuracy. The paper's74.7% “best” reference is0.992^36.2, computed from assumed digit accuracy and average given-cell count. It is a model-specific recognition calculation, not a proved universal upper bound or an optimality gap. Test-board accuracy must be distinguished from digit accuracy and logical constraint satisfaction (pp.7–8).

**Additional comparisons.** SupplementE compares4x4 Sudoku, where both SATNet and OptNet reach100% test-board accuracy, ConvNet93% and ConvNetMask99%. Preliminary20-epoch timings are2 versus12minutes for SATNet/OptNet on a GTX1080Ti. The main18–30X CUDA speed claim compares its GPU implementation with the corresponding OpenMP Xeon implementation, not an exact SAT solver or every competing neural architecture. SupplementF contains all original/permuted/visual convergence plots (p.6; supplementE–F).

## Limitations

### Discussed in the Paper

The layer is an approximate smoothed solver. Layer rank, clause-capacity parameter and auxiliary variables control representation and cost. Visual accuracy is limited by end-to-end digit recognition in the selected architecture, and optimization hyperparameters differ by task (Sections3–4).

### Curator Notes

SATNet is not a complete CDCL solver: a rounded prediction supplies no UNSAT certificate and may violate learned or intended constraints. Formal rank/convergence results for the associated SDP and Theorem1's gradient formulas do not imply globally optimal discrete predictions or globally optimal neural training. The learnedS may encode distributed relations without uniquely identifiable clauses. Supervision differs by experiment: a final parity bit versus full Sudoku solution labels, with a known-input mask.

The written input-relaxation Equation5 projects a random unit vector orthogonally to the truth direction; that projected component needs unit normalization (or an already orthogonal unit choice) to retain the stated unit-length input condition. This is a normalization detail to resolve against implementation when reproducing continuous inputs, rather than a claim that the reported code fails. The checked current CPU implementation explicitly constructs its known-input direction with cosine/sine components; this audit did not rerun its numerical gradients or experiments.

## Reproducibility

- Formal publication: [ICML2019, PMLR97:6545–6554](https://proceedings.mlr.press/v97/wang19e.html), The official PMLR source metadata records issued date2019-05-24; the bibliography uses the June9–15conference period. These are distinct dates, so the exact publisher-issued record is retained.
- Fully read all10pages of the [publisher paper](https://proceedings.mlr.press/v97/wang19e/wang19e.pdf) and4pages of its [official supplementary PDF](https://proceedings.mlr.press/v97/wang19e/wang19e-supp.pdf), including AppendicesA–F, all derivations and convergence figures. The publisher page explicitly links both and the code.
- Official [locuslab/SATNet](https://github.com/locuslab/SATNet) supplies C++/CUDA kernels, Python layer and experiments. The [CPU kernel](https://github.com/locuslab/SATNet/blob/master/src/satnet_cpu.cpp) was inspected for known-input initialization and invalid-gradient handling; exact paper results require an identified historical revision. No training or solver benchmark was rerun in this audit.
