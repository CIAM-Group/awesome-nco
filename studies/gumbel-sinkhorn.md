---
id: gumbel-sinkhorn
short_title: Gumbel-Sinkhorn
title: Learning Latent Permutations with Gumbel-Sinkhorn Networks
authors:
- Gonzalo E. Mena
- David Belanger
- Scott Linderman
- Jasper Snoek
year: 2018
date: '2018-02-23'
publication:
  date: '2018'
  source_url: https://openreview.net/forum?id=Byt3oJ-0W
venue: ICLR
paper_url: https://openreview.net/forum?id=Byt3oJ-0W
institutions:
- Columbia University
- Google Brain
scope: study
paper_type: analysis
arxiv_url: https://arxiv.org/abs/1802.08665
problem_families:
- Differentiable Optimization
- Graph Matching
problems:
- Permutation Learning
- Jigsaw Puzzles
summary: Entropy-regularized Sinkhorn layers and Gumbel perturbations permit differentiable learning and approximate
  inference with latent permutations.
code_url: https://github.com/google/gumbel_sinkhorn
---

# Learning Latent Permutations with Gumbel-Sinkhorn Networks

> **TL;DR:** Sinkhorn normalization supplies a differentiable soft permutation, and entrywise Gumbel noise supplies an implicit relaxed sampling model. This is a reusable permutation-learning and inference layer, demonstrated with separately specified task networks, rather than one trained generalist optimizer.

## Motivation

An unobserved permutation can align objects or explain a scrambled observation, but exact marginalization spans `N!` possibilities. The discrete matching operator also blocks ordinary backpropagation. The paper seeks differentiable deterministic and stochastic representations that preserve the one-to-one assignment structure while allowing upstream neural parameters to learn from reconstruction or latent-variable objectives.

## Contributions

- Relates temperature-scaled Sinkhorn normalization to entropy-regularized linear assignment and proves a zero-temperature convergence result under explicit uniqueness conditions.
- Builds permutation-equivariant Sinkhorn networks for reconstruction from scrambled pieces.
- Defines Gumbel-Matching and its Gumbel-Sinkhorn relaxation, and derives a tractable auxiliary-space variational objective when their own densities cannot be evaluated.

## Methodology

For a real score matrix `X`, the hard operator `M(X)` maximizes the Frobenius inner product with a permutation matrix. Starting from `exp(X)`, Sinkhorn repeatedly normalizes rows and columns. At convergence, `S(X/tau)` is the unique maximizer of `<P,X> + tau*h(P)` over doubly stochastic matrices for positive temperature. The proof uses strict concavity and positive diagonal matrix scaling.

Theorem 1's convergence to a single hard permutation assumes that entries of `X` are independent draws from distributions absolutely continuous with respect to Lebesgue measure; this makes an optimal assignment unique almost surely. Appendix A proves uniqueness by excluding the finitely many tie hyperplanes, then uses vanishing regularization and the unique LP optimum to obtain matrix convergence. This is an infinite-normalization, zero-temperature statement. Actual finite Sinkhorn iterations provide an approximation, and tied deterministic scores need separate treatment.

For deterministic supervised reconstruction, a shared network maps each input piece to one score-matrix row, ensuring equivariance to scrambling. Training applies the soft matrix to reconstruct the observation; evaluation can use Hungarian assignment for a hard permutation. Small temperatures sharpen assignments but can destroy gradients, while large temperatures can leave diffuse and unhelpful reconstructions. The authors inject noise to regularize and break ties.

For latent permutations, `M(X+epsilon)` with independent entrywise standard Gumbels defines Gumbel-Matching, and `S((X+epsilon)/tau)` defines Gumbel-Sinkhorn. Entrywise perturbations are a tractable surrogate for perturbing all factorially many permutations; this is not a claim of exact Gibbs sampling over permutations. Neither implicit distribution has a tractable density. The variational construction instead computes a KL between the underlying affine Gumbel matrices. Because Sinkhorn is non-invertible, this auxiliary-space KL upper-bounds the corresponding transformed KL and can loosen the likelihood bound. Appendix B.3 derives its closed form, and Appendix C.3 explains the data-processing inequality used here.

## Experiments

- **Sorting:** A shared two-layer network with 32 hidden units is trained on numbers in `[0,1]`. Table 1 reports the fraction of sequences containing any error, not per-number error. It is zero through `N=100` and 0.01 at `N=120` on that interval. Some translated test intervals fail badly at larger lengths, so the results do not demonstrate universal interval transfer.
- **Jigsaw reconstruction:** Separate CNN-based networks are evaluated on MNIST, CelebA and ImageNet. At CelebA 5-by-5, 21% of pieces are incorrect and 73% of puzzles contain an error, with Kendall tau 0.78. ImageNet 3-by-3 obtains tau 0.73 against the cited DeepPermNet's 0.72; this network has 1,053,440 parameters by Appendix B.2, but the comparison is not a universal accuracy advantage. Blank MNIST pieces make the original permutation unidentifiable even when reconstruction error is small.
- **Arbitrary digit assembly:** A network with digit-specific output branches rearranges 10-by-10 pieces into requested MNIST digits. A separately trained classifier recognizes 85.1% of transformed examples as the requested target. This is a supervised rearrangement demonstration, not an unsupervised generative model or a generic optimization benchmark.
- **Latent neural identity:** The C. elegans experiment infers permutations within a linear dynamical model, using a connectome-derived prior and partially known identities. Table 3 varies known-neuron fractions and difficulty; for 10% known identities the Gumbel-Sinkhorn matching accuracy is 0.44/0.26 in easy/hard settings versus 0.39/0.21 for the cited alternative. Not every condition improves: at 30% known/hard it is 0.84 versus 0.85. Appendix C.4 also varies candidate identities and number of worms.

The standard experimental protocol uses 20 Sinkhorn iterations and ten perturbations for each of ten batch examples. TensorFlow experiments used Tesla K20/K40/K80/P100 GPUs across hyperparameter searches. These are architecture-specific experiments; the paper does not evaluate one shared checkpoint across all tasks.

## Limitations

### Discussed in the Paper

- Diverse ImageNet structure is difficult for the simple assignment parameterization. Sequential refinement, quadratic interactions and reinforcement learning are proposed extensions.
- Temperature selection materially affects optimization; truncating the normalization separates practical computation from the exact theorem.
- The auxiliary-space variational objective may be less tight. A small categorical-VAE difference in Appendix C.3 is supporting evidence for that example, not proof that the loss is negligible for arbitrary permutation models.

### Curator Notes

- Exactness of Hungarian decoding concerns a linear assignment score, not global optimality for every nonlinear downstream objective.
- Gumbel-Sinkhorn provides biased relaxed learning/inference; continuous samples are not literal permutations and implicit low-dimensional perturbations are not exact factorial Gibbs draws.
- The network constructions and data differ by application. Reusability of a layer does not establish generalist-solver transfer.

## Reproducibility

- **Formal publication:** [Official ICLR 2018 poster record](https://iclr.cc/virtual/2018/poster/183), linked to the [OpenReview article](https://openreview.net/forum?id=Byt3oJ-0W). Poster is the presentation format of the conference paper.
- **Reviewed version:** All 22 pages of [arXiv:1802.08665v1](https://arxiv.org/pdf/1802.08665v1), submitted 23 February 2018, with the published-ICLR header. Full references and Appendices A-D were read, including proofs, KL derivation, supplementary protocols, ablations and summary table. Key equations, proof assumptions, tables and framework/reconstruction figures were visually inspected.
- **Code:** [google/gumbel_sinkhorn](https://github.com/google/gumbel_sinkhorn), linked in Section 7. The public repository contains the core operator and sorting experiment, as the paper states; availability alone does not establish released reproduction scripts for every reported task. It was archived in 2022.
- **Attachment check:** The official ICLR page lists its PDF. OpenReview forum/API requests required a browser challenge during this audit, preventing independent inspection of any additional attachment fields; the available manuscript already integrates its scientific supplemental sections. This access limitation is retained in the review ledger.
- **Citation identity:** The Vinyals, Bengio and Kudlur sorting reference is *Order Matters: Sequence to Sequence for Sets*, not *Pointer Networks*. Only exact existing-work identities are recorded as internal citation edges.
