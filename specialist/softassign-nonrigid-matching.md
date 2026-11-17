---
id: softassign-nonrigid-matching
short_title: Softassign Nonrigid Matching
title: A Framework for Non-rigid Matching and Correspondence
authors:
- Suguna Pappu
- Steven Gold
- Anand Rangarajan
year: 1995
date: '1995'
publication:
  date: '1995'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/c60d060b946d6dd6145dcbad5c4ccf6f-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/c60d060b946d6dd6145dcbad5c4ccf6f-Abstract.html
institutions:
- Yale University
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Graph Matching
problems:
- Point-Set Matching
- Nonrigid Correspondence
summary: Soft partial assignment alternates with regularized affine fitting; invariant features and known model-part
  regions extend it to nonrigid matching, evaluated by transformation error rather than certified correspondence
  optimality.
---

# A Framework for Non-rigid Matching and Correspondence

> **TL;DR:** Alternating soft partial assignment and regularized affine fitting extends to invariant features and locally affine object parts. Synthetic tests measure transformation error; model-part labels and feature design are supplied rather than learned.

## Motivation

Correspondence and geometric transformation depend on each other. A single affine map cannot represent independent part motion, and spatial coordinates alone may be insufficient under noise or occlusion. The paper builds an affine point-matching module, then adds invariant features and a quilt of local affine maps (PDF pp. 1-2).

## Contributions

- Alternates two-way soft assignment with a closed-form regularized affine update.
- Uses slack assignments for unmatched points and additional invariant features for correspondence.
- Extends the model to known object regions with separate affine transformations and evaluates hand-drawn, outlined-photo and synthetic examples.

## Methodology

The objective combines match-weighted squared residuals for the homogeneous-coordinate map `I+A`, a regularizer on A, and a negative match reward. Nonnegative match row/column sums are at most one; slack variables represent unmatched points. Entropy regularization produces exponentiated negative costs, followed by repeated row/column normalization. Holding matches fixed gives a weighted matrix-inverse affine update. Inverse temperature beta increases through an outer annealing loop (PDF pp. 2-3).

Invariant feature discrepancies add hand-weighted squared distances to correspondence costs. For affine quilts, **model-side part membership is known**; each region receives its own affine update, while image-side correspondence remains unknown. There is no learned segmentation or arbitrary-deformation model. The stated `O(J*K)` complexity treats dimension, features, matrix solves and iteration budgets as fixed; it is not a demonstrated bound for the full annealing computation as all these quantities vary (PDF pp. 3-4).

## Experiments

The reported time for two 50-point sets is about 20 seconds on an SGI R4400 workstation. Hand-drawn faces use roughly 250 points; outlined photographs use roughly 225 points with binary skin/hair/lip/eye feature markers. An articulated figure has six supplied model parts. These inputs already contain extracted contours/features rather than raw-image end-to-end predictions (PDF pp. 4-6).

Single-part synthetic tests use 50 model points, random affine parameters over an interval of length 1.5, Gaussian jitter standard deviations 0.01-0.08, missing/spurious points and feature corruption probability 0.05. Figures 4 and the four-feature plot use 500 runs per plotted point. The four-part case uses 120 points, 24 parameters and 70 runs per point, with overlap providing implicit spurious points. Feature weights are 0.2; the stated schedule is beta 0.091 to 100 with multiplier 1.075 and four inner alternations (PDF pp. 5-7).

The plotted error is normalized absolute **affine-parameter error**, not correspondence accuracy or gap to a certified matching optimum. Added features generally reduce the reported error, especially at larger jitter, while missing points/noise degrade recovery. No external solver comparison or uncertainty intervals are provided (PDF pp. 5-7).

## Limitations

Annealed alternating optimization does not establish a global optimum. Finite-temperature soft assignments need not be exact permutations, particularly with ambiguity and unmatched points. Results depend on supplied part regions, invariant-feature coding, regularization, match rewards, stopping tolerances and schedule. Higher-dimensional formulation does not establish equal performance at arbitrary dimension. This is a specialist neurodynamic matching method.

## Reproducibility

- **Read source:** all seven official scanned pages, printed pages 795-801, including all four references. Objectives, normalization, affine update, experimental plots and legends were visually checked.
- **Publication:** official NIPS 1995 volume 8 record; Suguna Pappu, Steven Gold and Anand Rangarajan, Yale University.
- **Supplements:** the official entry offers bibliography, metadata and the article. No separate scientific attachment or appendix is identified; the separately cited prior matching paper is not merged into this entry's evidence.
- **Implementation:** no code or datasets are linked; some parameter/stopping details remain incomplete. Results were not rerun.
- **Relations:** no reference identifies another frozen collection entry, so no internal citation edge is added.
