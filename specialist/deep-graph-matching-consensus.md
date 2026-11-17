---
id: deep-graph-matching-consensus
short_title: DGMC
title: Deep Graph Matching Consensus
authors:
- Matthias Fey
- Jan E. Lenssen
- Christopher Morris
- Jonathan Masci
- Nils M. Kriege
year: 2020
date: '2020-01-27'
publication:
  date: 2020-04
  source_url: https://iclr.cc/virtual_2020/poster_HyeJf1HKvS.html
venue: ICLR
paper_url: https://openreview.net/forum?id=HyeJf1HKvS
institutions:
- TU Dortmund University
- NNAISENSE
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2001.09621
paradigm: constructive-improvement
problem_families:
- Graph Matching
problems:
- Graph Matching
- Entity Alignment
summary: Local learned node similarities are refined by synchronous random-function graph message passing, with
  optional sparse candidate support for correspondence ranking.
code_url: https://github.com/rusty1s/deep-graph-matching-consensus
---

# Deep Graph Matching Consensus

> **TL;DR:** DGMC learns local node similarities, then refines them with synchronous random-feature message passing; sparse candidates scale correspondence ranking, while the practical row-softmax output is not an exact one-to-one QAP solution.

## Motivation

Similar local descriptors can suggest correspondences whose neighboring graph structure is inconsistent. DGMC first learns candidate node matches, then repeatedly compares neighborhoods under the current soft correspondence. It targets data-dependent supervised visual matching and semi-supervised entity alignment; the combinatorial QAP motivates neighborhood consensus, without making the neural output a globally optimal QAP solution (Sections 1-3).

## Contributions

- Combine a task-specific local graph encoder with a shared synchronous message-passing refinement network.
- Transport node functions through the current correspondence matrix and learn score updates from differences between propagated source/target functions.
- Use sparse top-k candidates, low-dimensional random functions and row-wise normalization for larger problems, evaluating synthetic graphs, visual keypoints and cross-lingual knowledge graphs.

## Methodology

**Initial matching.** A shared GNN embeds source and target nodes, and pairwise inner products produce scores. The initial mathematical formulation uses rectangular Sinkhorn normalization, but the deployed scalable formulation replaces this by row-wise softmax. Supervised negative log-likelihood trains correct correspondence scores (Sections 3.1/3.4).

**Consensus refinement.** Start conceptually with distinct one-hot functions on source nodes. Transport them to target nodes through the transpose of the soft correspondence, apply the same second GNN on both graphs and compare propagated features for each candidate pair. An MLP adds updates to its previous score; repeat and normalize. The objective combines initial and refined negative log-likelihood. A simple fixed aggregation recovers a relationship with the classical graduated-assignment gradient; trainable updates generalize that construction without inheriting a monotone QAP optimization guarantee (Sections 3.2-3.3).

**Practical scaling changes.** Keep only the initial top-k target candidates per source, replacing O(ns nt) correspondence storage by O(k ns) and refinement work by O(k ns + es + et) for fixed feature sizes. Candidate discovery still compares source and target descriptors; that refinement bound is not a blanket linear-time end-to-end search result. Ground-truth candidates are added during sparse training. At inference a true match omitted initially cannot be recovered by reordering the fixed support. Low-dimensional Gaussian functions replace one-hot functions, and can be resampled each iteration (Section 3.4).

**Exactness and constraints.** Theorem 1 states that a correct graph isomorphism yields zero propagated discrepancy for a permutation-equivariant GNN. The stronger converse in Theorem 2 requires injective aggregation/update functions and the idealized coloring setup; Section 3.4 explicitly says it need not survive random low-dimensional functions. Row-softmax also drops the target-column capacity constraint, and final Hits@1 uses independent row argmax. Thus the implementation does not certify injectivity, complete structural isomorphism, convergence or a global QAP optimum (Sections 3.2/3.4; Appendix A).

## Experiments

**Synthetic graphs.** Separate synthetic setups use ER source graphs with fifty/one hundred nodes; target edges are deleted at rates up to 50% without isolating nodes. Training/evaluation each use 1,000 graphs per configuration, degree features and three-layer GINs. Ten training refinements versus twenty test refinements improve the illustrated dense results to nearly perfect Hits@1. Sparse experiments are capped by initial top-k recall. Additional node-insertion tests likewise support the tested settings, not universal recovery under arbitrary structural perturbations (Section 4.1; Appendix E/Figures 2-3).

**Visual keypoints.** Filtered Pascal VOC contains 6,953 training/1,671 test images, with provided keypoint locations, Delaunay edges and pretrained VGG16 features. A separate two-layer SplineCNN evaluates isotropic distances versus anisotropic relative coordinates. The reviewed v1 Table 1 anisotropic mean rises from 67.3% initially to 72.8% at ten refinements and 73.0% at twenty; PCA-GM is 63.8%. Individual categories can worsen: ten-to-twenty refinement reduces table 92.3 to 84.5, dog 64.0 to 63.8 and sofa 95.0 to 92.2. Refinement is not category-wise monotone (Sections 4.2/Table 1).

**Willow and geometric transfer.** Willow results involve Pascal pretraining and fine-tuning over twenty random splits with twenty training images per category, rather than direct zero-shot application. In the reviewed v1 anisotropic GNN row, ten refinements give face/motorbike/car/duck/wine 100/98.80/96.53/93.22/99.87%; twenty gives 100/99.40/95.53/93.00/99.39. The latter is worse on three categories, and duck remains below PCA-GM's 93.5. Separately, a coordinate-only model trained on 32,000 synthetic point-cloud pairs transfers to PascalPF, giving mean 95.8% at ten iterations and 95.7% at twenty. This is a different training setup from image-feature matching (Sections 4.2-4.3/Tables 2-3).

**Knowledge-graph alignment.** DBP15K has 15,000 known entity links per language pair, with roughly 19,000-20,000 entities in each full graph. This is transductive semi-supervision on fixed graph pairs, using aligned FastText-derived entity features and a separate directed GNN that ignores relation types. Feature matching and refinement train for one hundred epochs each. Sparse top-ten candidates yield ZH-to-EN Hits@1 80.12 versus initial 67.59, and FR-to-EN 93.34 versus 83.36. Hits@10 stays fixed by the unchanged candidate support. These retrieval percentages are not exact optimization rates (Section 4.4/Table 4).

**Evidence limits.** The reviewed paper does not provide a standardized wall-clock/training-cost table establishing universal speed superiority. Dense and sparse variants, different task encoders, supervised held-out visual graphs and transductive entity pairs use distinct protocols. Qualitative examples include an explicit failure and annotation problems; high reported accuracy does not remove ambiguity from symmetric structures (Sections 4-5; Appendix I).

## Limitations

### Discussed in the Paper

Nodes that remain indistinguishable under the GNN/WL structure can receive identical updates and fail to converge to one assignment. Sparse support requires good initial candidate recall. Random-function scaling forfeits the stronger converse theorem, and row normalization relies on learning rather than enforcing one-to-one target constraints (Sections 3.4/5).

### Curator Notes

**The local induced-neighborhood theorem is too strong as printed.** Section 2 defines G[S] as an induced subgraph, and Theorem 2 concludes isomorphism of the induced T-hop neighborhoods from equal root outputs. A one-layer message-passing network cannot inspect edges between two distance-one neighbors. For a checkable example, let both graphs have nodes root,a,b, S=identity and distinct one-hot initial colors. Give the source edges root-a/root-b and the target those edges plus a-b. Root self features and the multiset of neighbor features are identical, so its one-layer output/discrepancy is identical even with injective local functions; the induced neighborhoods are a path versus a triangle. This challenges the stated local induced-neighborhood implication, not a statement about identical unrolled computation trees or an empirical failure of trained DGMC (Theorem 2/Appendix C).

Separate task-specific training does not show one unchanged generalist optimizer. Approximate random-feature consensus, row-wise ranking and an isomorphism-inspired intuition should not be promoted to exact graph matching. Result values here are from the explicitly identified arXiv v1; later papers' copied/modified DGMC tables are not silently substituted for this source.

## Reproducibility

- **Publication and reading version:** [official ICLR 2020 poster](https://iclr.cc/virtual_2020/poster_HyeJf1HKvS.html) confirms title/authors and its HTML citation_publication_date=2020/04. Formal publication month is therefore April 2020; January 27 is the [arXiv v1](https://arxiv.org/abs/2001.09621v1) submission date, not the formal publication date. The cached PDF matches a fresh version-pinned retrieval by SHA-256.
- **Coverage/supplements:** all twenty-three v1 pages, complete bibliography and Appendices A-I, including both proofs, algorithm, graduated-assignment comparison, additional perturbation experiments, detailed dataset tables and qualitative failure images. Normal OpenReview forum/API/API2 checks require verification/return 403; no publisher-byte identity is claimed. The public complete manuscript and author repository inventory identify no additional scientific PDF/ZIP attachment.
- **Code:** [official DGMC repository](https://github.com/rusty1s/deep-graph-matching-consensus) supplies core dense/sparse models and Pascal/Willow/PascalPF/DBP15K examples. The sampler, fixed sparse support, row-argmax metric, initial/refined losses and separate entity-training stages were inspected. README specifies PyTorch/PyG/KeOps dependencies. Training was not rerun.
- **Citation graph:** explicit body references and the full bibliography were compared with the current catalogue. No exact existing target paper was found; classical graduated assignment and similarly named neural graph-matching papers do not acquire invented edges.
