---
id: greedy-policy-moco
short_title: Greedy Policy MOCO
title: Training Greedy Policy for Proposal Batch Selection in Expensive Multi-Objective
  Combinatorial Optimization
authors:
- Deokjae Lee
- Hyun Oh Song
- Kyunghyun Cho
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/lee24w.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/lee24w.html
institutions:
- Seoul National University
- Neural Processing Research Center
- New York University
- Genentech
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Constrained Design
problems:
- Expensive Multi-Objective Design
summary: A set-conditioned sequence policy amortizes greedy marginal-acquisition subproblems
  for active-learning proposal batches; theoretical ratios remain conditional on per-step
  approximation quality.
code_url: https://github.com/snu-mllab/GreedyPolicyForMOCO
---

# Training Greedy Policy for Proposal Batch Selection in Expensive Multi-Objective Combinatorial Optimization

> **TL;DR:** Train a policy conditioned on the candidates already selected, then greedily sample a proposal batch that accounts for joint acquisition value. A single policy handles different greedy stages/cardinalities within a task. This does not establish one checkpoint shared across native design tasks, exact greedy decisions after finite training, or guaranteed Pareto-optimal experimental designs.

## Motivation

Expensive multi-objective design uses a surrogate model to choose small batches for costly oracle evaluation. Selecting candidates solely by individual acquisition scores ignores overlap within a batch. Direct joint optimization is large and latent-space optimization can mismatch the discrete sequence space. Training a separate policy for every sequential greedy stage also repeats optimization and limits parallelism (Sections 1-2).

## Contributions

The paper trains one set-conditioned policy to improve marginal batch acquisition across sampled greedy stages. It gives a self-consistent expected-gain definition of a greedy policy, sufficient conditions for convergence of ideal partial-gradient updates, and approximation bounds for monotone near-submodular acquisition and acquisition plus metric sum-dispersion. Experiments evaluate synthetic sequences, DNA aptamers, red fluorescent proteins and first-round small-molecule proposals.

This remains a specialist constructive approach to the proposal-batch selection problem. Separate task configurations and sequence models are trained; sharing across partial batches or batch sizes is not demonstrated sharing of one native-task checkpoint. The expensive oracle, statistical surrogate and batch policy also have different roles.

## Methodology

For a current set B, the policy samples a sequence x with reward a(B union {x}) minus a(B). A DeepSet encoder summarizes predicted objective vectors for B; a Transformer encodes the growing/edited sequence. Appending MDPs construct sequences from scratch. Editing MDPs modify candidates from an active pool, optionally using masked-language-model logits learned alongside the surrogate. Deterministic HVI depends on predicted objective sets; statistical-acquisition experiments use UCB objective vectors with beta=0.1 as conditioning features. This feature choice need not retain all information relevant to input diversity (Section 3; Appendix B).

Training samples a stage uniformly, obtains a partial batch under a periodically refreshed behavior policy, and applies REINFORCE-style updates to marginal gains. Practical updates center and standardize returns within the sampled candidate batch. Proposition3.6's unbiased estimator concerns a baseline depending only on B; that result should not automatically be transferred to the sample-dependent normalized estimator. At construction time, candidate sequences are sampled and the one with the greatest marginal acquisition is appended. The final batch is still built sequentially (Algorithms4-5).

**Theory and assumptions.** Lemma3.3 assumes enough representational power to model every conditional policy and an exact self-consistent maximizer of expected gain. The convergence result requires a smooth objective, uniform strong concavity in its first argument, cross-derivative norm smaller than that concavity strength, and a suitable domain/stationary fixed point for the iterates. The authors explicitly state that practical neural-policy objectives may not meet these assumptions. It is a sufficient-condition analysis of ideal updates, not a finite-sample neural training guarantee (Appendices A.1-A.2).

For a nonnegative monotone acquisition a, a per-step alpha approximation yields a batch ratio of at least 1-exp(-alpha*gamma), where gamma is the specified submodularity ratio. For a nonnegative monotone s plus lambda times metric sum-dispersion, the alpha*gamma/2 bound uses **non-oblivious marginal scoring s/2+lambda*div**, while evaluating s+lambda*div. No empirical training procedure here certifies its own alpha or gamma, and neither ratio is an unconditional approximation guarantee for the unknown expensive oracle (Theorems3.9-3.10; Appendix A.3).

## Experiments

**Single-round tasks.** Two/three/four target-bigram sequence tasks use batch sizes4-256 as applicable; a three-objective DNA-aptamer benchmark uses NUPACK properties. Tables1-2 report means and standard deviations over ten trials. The learned policy matches exact greedy on the two-bigram task but not universally: at three bigrams and n=64, its HV is0.359 versus exact greedy0.409. For aptamers at n=256, it obtains0.778 versus PC-RL(Tchebycheff)0.731 and sequential greedy+RL0.739.

Bigram policies train with n_train=64,4,000 updates and128 candidate episodes, evaluating every500 updates and reporting the best evaluated HV for each batch size. Averages include about32 conditioning-sequence samples per update; other RL methods receive5,000 updates to match the surrogate-query budget. Learning rate/random-action choices are selected from a grid using ten trials. DNA uses a larger four-layer,16-head,dimension256 Transformer and2,000 updates. These are best-checkpoint/hyperparameter results on the specified search tasks, not a held-out checkpoint-selection test or equal wall-clock budget (Appendix B.3).

**Batch Bayesian optimization.** RFP optimizes stability and solvent-accessible surface area with a statistical surrogate; the main budget is1,024 queries. The reported25% relative-HV improvement and1.69-fold fewer queries for comparable performance are specific benchmark comparisons, not a wet-lab discovery guarantee. Curves show the median with30th/70th percentile bands over ten trials, rather than mean±standard-deviation bands. The authors correct earlier LaMBO NEHVI and GA mutation implementations and increase inner-loop sampling for reproduced baselines; original, corrected and longer-run variants must remain distinct (Figure2; Appendices B-D).

First-round NEHVI is0.779 for the method versus0.591 LaMBO and0.654 MBGA on RFP; additional first-round tests cover three bigrams and SELFIES molecules with logP/QED. Full-length RFP NEHVI optimization takes18.9minutes versus MBGA14.0, while the half-update variant takes9.5minutes with similar value0.778. UCBHVI and PES comparisons also favor the method in the tested value/runtime settings. End-to-end RFP active-learning runs take roughly two to three days across the compared methods; query efficiency is not zero computational cost (Tables3/10).

Cardinality transfer is within a trained task. Larger training cardinality usually helps but is not uniformly best in Table9. MLM guidance helps RFP but hurts the synthetic three-bigram setting. Adding diversity on RFP raises reported dispersion78.35→95.92 while lowering NEHVI0.779→0.731. The authors identify improved diversity features as future work (Appendix C).

## Limitations

Acquisition quality relies on the surrogate and reference point; good acquisition need not imply true-oracle Pareto optimality. The theoretical assumptions do not verify finite neural training or a nonzero practical alpha. Statistical acquisition estimation, sequential batch construction and repeated surrogate/policy fitting add computation. The experiments are sequence-design benchmarks with task-specific training, not broad native-problem generalization. Return normalization, checkpoint/hyperparameter selection and baseline fixes are material parts of reproduction.

### Curator Notes

Some appendix displays contain local notation slips: PropositionA.8 initially omits log from its score-function estimator, while the derivation and final expression on the next page include it; LemmaA.9's displayed proof writes marginal gain as HVI(B), although its deterministic-HVI statement follows by comparing the sets before and after adding x. These should be read with the definitions, not promoted into a claim that the empirical method or entire bound is invalid (PDF pages16-17).

## Reproducibility

- All28 pages of the [formal ICML2024 article](https://raw.githubusercontent.com/mlresearch/v235/main/assets/lee24w/lee24w.pdf) were read, including the complete references and scientific AppendicesA-D. Eight key proof/result pages were inspected visually, including all poorly extracted plot legends. Publisher metadata verifies three authors, affiliationsSNU/NPRC/NYU/Genentech, PMLR235:26948-26975 and publication July8,2024.
- Manual publisher links expose the complete article and OpenReview only, with no separate scientific supplement. Notes APIsv1/v2 for `jP8mf34iCW` both returned403. The official122-file repository tree contains no scientific PDF/ZIP attachment; no explicitly referenced missing supplement was found.
- The [official implementation](https://github.com/snu-mllab/GreedyPolicyForMOCO) was inspected at `f13a40a7eaf465d3f7cc67f2242b35a89b00b730`. The full README, requirements, three configuration files and200-line active-learning wrapper were read, together with selected training/sampling sections of the355-line single-round module and451-line editing loop. The wrapper reinitializes the policy each active-learning round by default. Current evaluation configuration uses32 candidates, while the printed batch-BO protocol gives16; exact reproduction should reconcile that release setting.
- NUPACK and FoldX require separately obtained assets as documented by the authors. No policy training, acquisition evaluation, oracle query or benchmark rerun was performed. Three exact existing-catalogue references are recorded with body and complete-bibliography evidence.
