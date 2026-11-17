---
id: soft-rank-diffusion
short_title: Soft-Rank Diffusion
title: Learning Permutation Distributions via Reflected Diffusion on Ranks
authors:
- Sizhuang He
- Yangtian Zhang
- Shiyang Zhang
- David van Dijk
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/he26ax.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/he26ax.html
institutions:
- Department of Computer Science, Yale University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Permutation Optimization
- Routing
problems:
- Sorting
- Traveling Salesman Problem
- Jigsaw Puzzles
summary: Task-specific reflected soft-rank diffusion and autoregressive contextual Plackett–Luce denoisers generate
  sorting, TSP and jigsaw permutations, with measured accuracy/runtime and theoretical-scope limits.
figure:
  path: paper-assets/soft-rank-diffusion/framework.png
  alt: Original Soft-Rank Diffusion Figure1 and full caption showing continuous rank bridges and discrete/continuous
    reverse updates.
  caption: 'Figure1: original soft-rank forward process and hybrid reverse sampler.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/he26ax/he26ax.pdf#page=5
---

# Learning Permutation Distributions via Reflected Diffusion on Ranks

> **TL;DR:** Soft-Rank Diffusion lifts permutations to continuous ranks, uses reflected bridge updates, and learns an autoregressive contextual Plackett–Luce denoiser. Task-specific models improve sorting, small Euclidean TSP and image-jigsaw reconstruction over the tested permutation baselines, with substantial inference overhead at larger jigsaw sizes.

## Motivation

Shuffle-based permutation diffusion can make abrupt global moves that are hard to invert at longer lengths. Continuous ranks provide smoother latent corruption; sorting them always produces a permutation, although that alone does not ensure a good tour or correct reconstruction. [pp.1–3]

## Contributions

- An N-dimensional rank relaxation replaces an N×N permutation-matrix representation.
- A hybrid reverse sampler combines clean-permutation prediction, grid lifting, an unconstrained Gaussian bridge proposal and subsequent reflection.
- Contextualized generalized Plackett–Luce(cGPL) conditions each selection on the generated prefix; Pointer-cGPL uses a biaffine item-aligned output head.
- Controlled architecture comparisons and KV-cache timing quantify accuracy/cost trade-offs. [pp.3–9,12–18]

## Methodology

**Latent process.** Each item's integer rank r is lifted to(r−1)/(N−1). Coordinates undergo a reflected Brownian-bridge construction toward a sampled reference endpoint, usually uniform on the unit cube. The rank convention is double-argsort; a single argsort gives the inverse ordering. AppendixB derives the unreflected Gaussian conditional with mean μ(s)+(s/t)(zt−μ(t)) and varianceη²s(t−s)/t. The practical sampler applies reflection after that proposal. [pp.3–4,13–15]

**Denoiser and training.** Static GPL predicts a position-specific score matrix once; cGPL recomputes scores conditional on the emitted prefix and masks already selected items. Pointer-cGPL compares each encoded input item with the current decoder state through a learned biaffine score. Teacher forcing permits parallel training on ground-truth prefixes with masked cross-entropy. Inference still requires N autoregressive selections per diffusion step; KV caching reduces repeated attention work, not this sequential dependence. The paper gives an ELBO and a clean-permutation cross-entropy objective, without deriving their exact equality for the reflected approximate reverse kernel. [pp.4–7]

**Classification:** Specialist / constructive. Sorting, TSP and jigsaw models use task-specific inputs and training; one shared cross-problem checkpoint is not demonstrated. Repeated denoising samples an output permutation rather than editing an objective-selected incumbent through a separate improvement policy. [pp.7–9,12–13]

## Experiments

| Task | Protocol |
| --- | --- |
| Four-digit MNIST sorting |Lengths9/15/32/52/75/100/150/200;60K sequences generated per epoch,120 epochs;10K test sequences; batch64, single H100 |
| Sorting architecture |Seven Transformer layers:3 encoder+4 decoder versus seven encoder-only layers for SymmetricDiffusers; hidden512/feedforward128/eight heads |
| Euclidean TSP |20/50 nodes;1,512,000 training graphs,1,280 test graphs;50 epochs, batch64, H100; peak learning rate2×10⁻⁴,51,600 warmup steps |
| TSP architecture |16 layers:8 encoder+8 decoder versus16 encoder-only layers; hidden1,024/feedforward256/eight heads |
| CIFAR10 jigsaw |3×3,4×4,8×8 patches; seven layers with matched hidden width; timing covers10K test samples on H100 |
| Baseline decoding |SymmetricDiffusers uses GPL with beam search disabled; its original200-item sorting model used12 layers, whereas this controlled rerun uses seven |

**TSP gaps are fractions in the original table/formula.** Converted to percentages:

| Method | TSP20 length/gap | TSP50 length/gap |
| --- | --- | --- |
| SymmetricDiffusers GPL |5.4342 /41.69% |12.8525 /126.18% |
| Soft-Rank cGPL |3.8732 /.79% |5.7336 /.78% |
| Soft-Rank Pointer-cGPL |3.8557 /.34% |5.7157 /.47% |

These are comparisons against the configured permutation-diffusion baseline, not a state-of-the-art routing comparison: the table does not include strong specialized TSP solvers. The reference is described as an OR-solver baseline; no claim of globally optimal output follows from the small reported gaps. [pp.7–8,12–13]

- **Sorting:** At200 items, Pointer-cGPL reaches Kendallτ.6048, exact-list accuracy1.37%, and correct-position fraction66.07%. Plain cGPL reaches.3982/.04%/46.44%. Thus long-sequence performance remains imperfect. Plain cGPL is also worse than SymmetricDiffusers at75 items inτ(.6925 versus.7304) and positional correctness(.7347 versus.7733). At9 items plain cGPL's exact accuracy.9397 exceeds Pointer's.9329. [pp.7–8]
- **Jigsaw:** At8×8, Pointer-cGPL gives27.00% exact reconstruction and52.56% correct positions versus cGPL9.24%/28.54% and SymmetricDiffusers0%/5.01%. At4×4, plain cGPL's87.52% exact accuracy exceeds Pointer's86.81%. The zero-exact-accuracy baseline still has positional accuracy above uniform random1/64 and mean patch displacement3.8 versus random5.2. [pp.8–9,18]
- **Runtime:** Cached Pointer-cGPL takes26.7/36.7/156.7s for the complete10K jigsaw sets, versus SymmetricDiffusers28.0/21.6/36.3s. At8×8 it is4.32× slower, despite its own1.55× cache speedup. Accuracy ratios against zero baseline accuracy are undefined; the starred plot points are clipped visualizations, not finite measured speed or quality multipliers. [pp.9,17]
- **Ablations:** On32-item MNIST, soft-rank cGPL with previous-step prediction gives64.25% exact accuracy versus riffle/cGPL58.33%; the corresponding pointer values are71.52% and64.04%. Riffle with clean-permutation prediction fails in these runs. Uniform/Gaussian reference robustness is tested only on4×4 jigsaw with noise.5/five steps, not all tasks or arbitrary reference laws. [pp.14,17]

## Limitations

### Curator Notes

- **Static GPL is not universally expressive as stated on p2.** Under the later prefix-agnostic definition, every positive three-item distribution obeys(p123/p132)(p231/p213)(p312/p321)=1: the second-position score ratios cancel. A full-support target assigning1/4 to123/231/312 and1/12 to132/213/321 instead gives27. This limits the printed static-GPL universality assertion, not the richer prefix-conditional cGPL construction.
- **Grid-centroid claim:** AppendixC.3 calls the uniform endpoint-inclusive grid the chamber centroid and gives a common boundary margin. For N=2, its lift is(0,1), whereas the ordered triangle's centroid is(1/3,2/3); the lift also lies on the outer cube boundary. Therefore that geometric centering/margin argument does not follow. The valid many-to-one chamber representation and equal1/N! volumes remain useful facts.
- **Reverse-kernel scope:** AppendixB proves the ordinary Gaussian-bridge formula for0<s<t<1. Reflection after an unreflected proposal is a practical construction, not a proof that this Gaussian is the exact reflected conditional. Main-text shorthand also switches between ranks and orderings, and applies LiftToGrid to a latent variable where a permutation is expected; a reproduction must resolve those conventions consistently.
- **Cost and evidence:** Linear latent dimension is not linear total Transformer decoding time. Performance gains depend on autoregressive inference and the chosen baseline depth/beam budget. Separate models, small TSP sizes and no reported training-seed error bars limit broader claims. Constrained-permutation generation is explicitly future work; it was not experimentally demonstrated.
- The available paper does not fully specify jigsaw training settings or all main-task diffusion grids/noise schedules. No author implementation/checkpoint or full benchmark replay was available to resolve those gaps. Exact rational/geometry checks recorded here verify only the specified printed claims.

## Reproducibility

- **Publication:** [ICML2026/PMLR306,42280–42297](https://proceedings.mlr.press/v306/he26ax.html); publisher metadata explicitly records2026-09-29. All four authors are affiliated with Yale Computer Science; He and Yangtian Zhang contributed equally. Author-name casing follows the PDF/event.
- **Full text:** All18 formal pages, complete references, AppendicesA–D, both algorithms, all seven figures and nine tables were freshly read; eleven relevant pages were visually checked.
- **Companions:** The [official event](https://icml.cc/virtual/2026/poster/62101) provides a2.430MB poster, fully read in three overlapping tiles. No separate slides/scientific supplement is linked on the accessible publisher/event pages; OpenReview/API access was blocked during this review. Author homepages were checked and did not identify an implementation for this work, so no speculative code URL is added.
- **Figure:** Original formal Figure1 with its complete caption depicts the forward latent trajectory and hybrid reverse update.
