---
id: ufgm
short_title: UFGM
title: Effective Federated Graph Matching
authors:
- Yang Zhou
- Zijie Zhang
- Zeru Zhang
- Lingjuan Lyu
- Wei-Shinn Ku
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/zhou24v.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/zhou24v.html
institutions:
- Auburn University
- Sony AI
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Graph Matching
problems:
- Federated Graph Matching
summary: Graphlet pseudo-correspondences and separate scalar trust-region updates train federated neural entity
  alignment on shared-key transformed embeddings.
---

# Effective Federated Graph Matching

> **TL;DR:** UFGM uses sampled graphlet features to create pseudo correspondences, then trains a GCN-based alignment model through server-side evaluation and client-side scalar trust-region updates on masked embeddings.

## Motivation

Cross-client node alignment needs information about multiple private graphs, while conventional supervised training assumes access to known aligned pairs and both graphs. UFGM replaces manually supplied alignment labels with graphlet-based pseudo pairs and separates evaluation from client parameter updates. Its native task is network entity correspondence; the evaluated output is ranked nearest-embedding retrieval, rather than a certified global one-to-one QAP assignment (Sections 1-2/4-5).

## Contributions

- Sample connected induced graphlets by random expansion and use inverse-probability weighting to estimate structural counts for pseudo-pair generation.
- Evaluate the shared matching model at the server using transformed embeddings, sending client-specific losses/gradients for separate trust-region updates.
- Approximate curvature by a scalar identity matrix from two weak quasi-Newton conditions, with auxiliary sampling/curvature/model-decrease analyses and three network-alignment datasets.

## Methodology

**Neural alignment and pseudo labels.** GCNs embed adjacency-based node representations; a mapping model minimizes squared distances between aligned embeddings. Sample a starting node, expand a connected induced subgraph through uniformly sampled boundary edges, sum probabilities over valid connected node orderings, and apply inverse-probability weighting. Per-node graphlet-frequency vectors give cosine similarities; the highest-scoring node pairs become pseudo training data. Similar local topology is a heuristic for entity identity, not an exact alignment certificate (Sections 2-3).

**Federated update.** Clients share a secret nonsingular matrix K and send embeddings multiplied by K to the server. Appendix A.5 specifically orthogonalizes K to preserve distances. The server aggregates client parameters and computes individual pseudo-pair losses and first-order gradients. Clients build scalar curvature alpha from parameter/gradient changes and function values, then solve a norm-constrained quadratic model. The positive-scalar solution is a clipped negative-gradient step. The paper selects smallest-distance node pairs and reports Hits@K ranking; no explicit globally injective assignment decoder is established (Section 4; Appendix A.2/A.5).

**Theory boundaries.** Theorem 1 derives expansion probabilities. Theorem 2 bounds graphlet-count variance for stationary degree-proportional starting nodes; its proof assumes independently sampled starting nodes and independent expansions. It does not supply an autocorrelation correction for arbitrary dependent MCMC trajectories, a node-matching recovery theorem or a privacy theorem. The rendered degree factor D multiplies 2|E|/|S| in Equation 9; PDF text extraction can misleadingly reorder it. Theorem 3 is a small-step, sufficiently smooth directional Taylor error expansion. Theorem 4's proof establishes decrease of the positive-scalar quadratic surrogate with nonzero gradient; it is not a proof that actual nonconvex loss or discrete matching converges globally. Positivity/zero-step handling require care because the displayed scalar ratio alone does not guarantee positive curvature for arbitrary objectives (Sections 3-4; Appendix A.2).

## Experiments

**Federated datasets and protocol.** SNS has three Flickr/Last.fm/MySpace graphs averaging14,331 nodes; PPI has fifty tissue graphs with1,767 nodes each; DBLP has twenty year-based graphs averaging10,038 nodes. One graph is assigned to each client and all clients participate. Supervised competitors receive20% aligned-pair training labels. Experiments use three trials. Full UFGM pseudo-pair counts are3,041/1,264/2,817 for SNS/PPI/DBLP respectively; these are generated labels, not human alignment supervision. Models are trained/evaluated per dataset, without demonstrating identical weights across unrelated native optimization tasks (Sections 5; Appendix A.4-A.5/Tables7-8).

**Final retrieval.** Tables1-3 report UFGM Hits@1 of0.371 SNS,0.771 PPI and0.453 DBLP. It outperforms the listed federated graph-learning/domain-adaptation baselines in Hits@1, but is below centralized NextAlign0.430/0.951/0.572 and below SeedGNN on PPI/DBLP0.884/0.530. SNS NetTrans0.379 also exceeds0.371. These are retrieval proportions, not optimal-solution rates. SNS's printed UFGM Hits@5=0.440 exceeds Hits@10=0.411, inconsistent with cumulative ranking on one evaluation set; the same row is repeated in later tables and cannot be silently repaired. The prose also swaps SNS/PPI values. Its lowest-loss claim conflicts with SpreadGNN losses0.189/0.290 versus UFGM0.501/0.659; losses from different model objectives are not automatically comparable quality measures (Tables1-3/Section5).

**Approximation tradeoff.** Against exact-Hessian GMA-PGD, scalar UFGM takes168 versus399 minutes on SNS,153 versus367 on PPI, and732 versus1,556 on DBLP, with lower Hits@1 in every case:0.371/0.771/0.453 versus0.380/0.786/0.487. Centralized UFGM-C similarly improves Hits@1 to0.387/0.786/0.471. The comparison supports a measured efficiency/accuracy tradeoff, not lossless approximation. Convergence figures are plotted by communication/training rounds, and the31.8%/35.4% headline improvements concern rounds rather than measured total wall-clock against every baseline (Section5/Figures1-9; AppendixA.3/Tables4/6).

**Scale, ablations and resources.** Twenty-graph DBLP variants with roughly100K/200K nodes give Hits@1 0.536/0.405. Sensitivity tests vary trust radius, graphlet size/sample count, update rounds, omega and pseudo-data proportion. The stated sample-count sweep in AppendixA.5 is1/5/10/15/20, whereas the figures discuss10/50/100/500/1000; the discrepancy is unresolved. Experiments use a dual-Xeon, eight2080Ti shared server, about two days overall. A single-GPU three-to-four-day estimate is the authors' expectation, not a measured benchmark. The large-data rows provide accuracy/loss rather than a full scaling-time or communication table (AppendixA.3-A.5).

## Limitations

### Discussed in the Paper

Graphlet enumeration and full Hessian computation are expensive, motivating approximations. Large trust radii or unsuitable omega can reduce quality. The approximate curvature implementation trades some retrieval quality for reduced runtime; fewer pseudo pairs usually reduce Hits@1 (Sections3-5; AppendixA.3-A.5).

### Curator Notes

Sharing a secret orthogonal transform is not a formal privacy guarantee: it deliberately preserves pairwise inner products/distances, which remain observable to the server. No differential-privacy budget, semantic-security definition, collusion guarantee or attack evaluation is proved by the four optimization/sampling theorems. Claims about privacy should retain the stated key-sharing and access assumptions.

The stated squared-distance objective on positive pairs alone admits collapsed mappings unless additional constraints/architecture prevent them; the paper does not provide enough implementation detail to establish such a safeguard. This is a formulation/reproduction limitation, not a claim that the reported trained model necessarily collapsed. Missing implementation, the nonmonotone SNS Hits row, sample-count conflicts and undefined validation split for best-parameter selection prevent independently resolving the exact protocol. Twenty graphs over the inclusive range2002-2022 also require a precise year manifest to reproduce the split.

## Reproducibility

- **Publication:** [ICML2024/PMLR235](https://proceedings.mlr.press/v235/zhou24v.html), pages62257-62293. Official HTML citation_publication_date and publisher source metadata issued date both give July8,2024; the BibTeX event rangeJuly21-27 is a separate field.
- **Full reading/supplements:** all thirty-seven [publisher PDF](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zhou24v/zhou24v.pdf) pages, the entire long bibliography, AppendixA.1-A.5, all four proofs and all additional tables/figures. Publisher related-material links and source extras=[] identify no separate attachment; the known OpenReview forum/API requires verification/returns403. Complete integrated scientific material was read, without claiming inaccessible attachment bytes were retrieved.
- **Code:** AppendixA.5 promises a later repository, but no official UFGM implementation was verified through the available publisher/author/title searches. Listed GitHub links belong to baselines, including CityU SIGMA, and must not be presented as UFGM code. No training was rerun.
- **Citation graph:** eight exact catalogue targets are supported by body/appendix and bibliography: DGMC, CIE, DLGM, stochastic SIGMA, SeedGNN, GANN, IDRGM and Adversarial Attacks on Deep Graph Matching. The SIGMA baseline is a different CVPR2022 semantic-complete domain-adaptation method; the stochastic ICML2021 citation occurs in related work and is not substituted as that baseline.
