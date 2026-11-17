---
id: transformer-sat-reasoning
short_title: Transformer SAT Theory
title: Can Transformers Reason Logically? A Study in SAT Solving
authors:
- Leyan Pan
- Vijay Ganesh
- Jacob Abernethy
- Chris Esposo
- Wenke Lee
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/pan25d.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/pan25d.html
institutions:
- Georgia Institute of Technology
- Google Research
scope: study
paper_type: theory
problem_families:
- Satisfiability
problems:
- Boolean Satisfiability
summary: Nonuniform Transformer constructions simulate DPLL with exponential-length
  chain-of-thought; compiled and separately trained models test correctness and generalization.
---

# Can Transformers Reason Logically? A Study in SAT Solving

> **TL;DR:** The paper constructs a size-dependent Transformer family that simulates DPLL through chain-of-thought, implements a related construction with PARAT, and separately trains models on algorithmic traces. The result permits exponentially many generated tokens; it is not a polynomial-time SAT algorithm or one fixed network for arbitrary input sizes.

## Motivation

Logical reasoning claims require an explicit computation model and a distinction between weights programmed to execute an algorithm and weights learned from demonstrations. SAT provides a precise setting for testing parallel clause processing, deduction and backtracking (Sections 1-3).

## Contributions

Theorem 4.5 states that for each variable/clause bound p,c there exists a decoder-only Transformer deciding the corresponding 3-SAT inputs with at most p times 2^(p+1) autoregressive iterations. It uses seven layers, five heads, O(p) embedding dimensions and O(p squared) parameters. Each parameter needs O(p + log c) bits; the numerical positional encoding is excluded from the parameter count. The construction is nonuniform: its weights and capacity depend on the size bound.

PARAT compiles restricted numerical-array programs into Transformer weights. A programmed SAT model tests the construction empirically. A separate study trains Llama-style models from scratch on solver traces and examines distribution and length generalization. This is primarily a theory/analysis paper with implementation experiments, rather than a new broadly trained combinatorial optimizer.

## Methodology

The input encodes clauses in DIMACS-like tokens; generated tokens record decisions, unit deductions, backtracking and a final SAT/UNSAT label. Binary vectors summarize clauses and the current partial assignment. Attention processes clauses in parallel to test satisfaction, detect an already falsified clause and compute available one-step unit deductions. This local conflict test should not be confused with deciding all semantic consequences under a partial assignment.

The mathematical architecture uses ReGLU operations, numerical position indices and greedy autoregressive generation. Its COPY/MEAN primitives require bounded inputs, separated attention scores and sufficiently small approximation error. Softmax sharpness controls the approximation to saturated attention. Parallel processing within a token does not eliminate exponential search across tokens (Theorem 4.5; Appendices C.4-C.8).

PARAT builds a computation graph, reduces it to attention/GLU/linear/encoding primitives, allocates layers and residual dimensions, then assigns weights. Abstract, reduced-program and full-model evaluations support debugging. Appendix D.4 prints the complete 199-line SAT specification; this programmed construction is separate from the learned-model experiments.

## Experiments

The compiled model uses bounds p=20,c=88 and sharpness beta=20. It attains perfect reported label accuracy on 51 datasets of 2,000 formulas each: p=4 through 20 across marginal, random and skewed distributions, with clause/variable ratios around 4.1-4.4. These are 102,000 sampled tests, not an exhaustive enumeration of formulas. The sampled maximum trace lengths lie below the displayed empirical curve 8p times 2^(0.08p); this does not replace the exponential worst-case bound. Smaller attention sharpness causes errors as sizes increase (Section 5; Figures 4-5).

The learned models use six separate 500,000-example training datasets: two variable windows, 6-10 and 11-15, crossed with the three distributions. Training minimizes cross-entropy on the generated trace, while variable-ID permutation exposes all variable tokens up to 20. Evaluation separates the final binary answer from validity of the full DPLL trajectory; an alternative valid decision order can pass without matching the reference string. Runs that exceed the 850-token context without a final answer count as failures.

Table 1 reports approximately 99.88-100% binary and 88.72-99.40% full-trace accuracy across the first-window tests, and 99.11-99.89% binary and 86.06-98.66% full-trace accuracy across the second-window tests. Transfer outside the trained variable window deteriorates. These finite experiments do not prove an impossibility theorem for all length-generalizing Transformers. The main text labels the models 70M/160M, while Appendix A says 70M/140M and supplies the 6/12-layer configurations; this discrepancy is retained rather than silently resolved.

## Limitations

The theorem is an existence result under a size-dependent computation model, with potentially exponential generation and prescribed weights. It does not establish efficient SAT solving, successful discovery of the construction by ordinary training, or transfer to arbitrary larger formulas. Generalization experiments concern the reported synthetic distributions and trained models, not every pretrained language model.

### Curator Notes

Several printed expressions require correction or clarification. Appendix C.1's mask inequality points in the opposite direction to the later causal definition. On page 28, the printed integer comparison ReLU(b-a)-ReLU(b-a-1) implements the strict comparison a<b, not the displayed a<=b: at a=b it equals zero. On page 30, the printed projection assigns the conflict/BT term weight 64 and root-UNSAT weight 32, contrary to its stated priority list.

Lemma C.9's printed conflict-head matrices also lack a clause-only eligibility condition. With one variable, F=(x1) and empty assignment A, its dummy/clause/assignment scores are (-0.5,-1,0) and values are (0,1,1). Under the stated self-inclusive causal attention, the assignment row wins and reports a conflict although no clause is falsified. This is a reproducible boundary problem in that printed head, not a refutation of the main existence claim.

Crucially, Appendix D.4's actual specification differs: lines 116-129 penalize non-clause positions, and lines 183-197 gate BT and prioritize UNSAT above BT. Its library comparison operations are not the erroneous printed integer identity. These differences prevent transferring the local printed-formula counterexamples directly to the compiled program. This review records the mismatch; it does not supply an independent complete replacement proof.

## Reproducibility

- [ICML 2025 proceedings](https://proceedings.mlr.press/v267/pan25d.html), PMLR 267:47632-47671, and its complete 40-page PDF were read, including all references, proofs and the full printed PARAT program. The official HTML publication metadata supports 2025-10-06; July 13-19 is the conference date.
- Training details include the architecture sizes, five epochs, Adam settings and learning-rate schedule in Appendix A. The publisher's Software link points to `N/A` and returns 404; no verified external implementation URL is added.
- The publisher lists no separate scientific supplement. Both OpenReview API versions for forum `5BGC2I2fxx` returned 403. The complete scientific appendices and program are integrated in the read PDF; no explicitly referenced missing scientific attachment was identified.
- Key mathematical and empirical pages were visually checked. The implementation and experiments were not rerun. One exact existing-paper citation, NeuroSAT, is registered with body and reference locators.
