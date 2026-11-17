---
id: deep-latent-graph-matching
short_title: DLGM
title: Deep Latent Graph Matching
authors:
- Tianshu Yu
- Runzhong Wang
- Junchi Yan
- Baoxin Li
year: 2021
date: '2021-07-01'
publication:
  date: '2021-07-01'
  source_url: https://proceedings.mlr.press/v139/yu21d.html
venue: ICML
paper_url: https://proceedings.mlr.press/v139/yu21d.html
institutions:
- Arizona State University
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Graph Matching
summary: Supervised visual graph matching learns deterministic or stochastic latent topology before a BBGM matcher,
  improving mean correspondence accuracy with additional training cost.
---

# Deep Latent Graph Matching

> **TL;DR:** Supervised visual graph matching learns a deterministic or stochastic topology before a BBGM-style matcher; better average correspondence accuracy comes with additional training cost and no global QAP guarantee.

## Motivation

Heuristic Delaunay or nearest-neighbor connectivity fixes how visual keypoints exchange information before a learned matcher is trained. DLGM asks whether a matching-aware latent topology can improve that representation. Its primary setting requires constructing topology from visual input; modifying edges is not an admissible replacement for fixed structural constraints in an arbitrary graph-isomorphism problem (Section 1, footnote 2; Appendix A.1).

## Contributions

- Add a trainable latent graph module to a visual graph-matching pipeline, with locality relative to the initial graph and cross-graph consistency as priors.
- Compare deterministic rounded edge generation (DLGM-D) with stochastic topology generation and alternating training (DLGM-G).
- Evaluate correspondence accuracy, outlier-aware F1, transfer/fine-tuning and loss/sample-size ablations on Pascal VOC, Willow and SPair-71k.

## Methodology

**Input and backbone.** Annotated semantic keypoints, object crops and initial Delaunay connectivity are provided. VGG16 extracts node/edge and global visual features. The new topology module precedes SplineCNN feature refinement, learned affinity construction and the BBGM/message-passing black-box matching solver. Removing the topology module recovers the Rolínek et al. (2020) baseline. The formal introduction describes a bijective quadratic assignment; unequal sizes/outliers need additional constraints or dummy treatment (Sections 1/3; Appendix A.2-A.3).

**Deterministic topology.** A GCN produces node embeddings; a bilinear sigmoid edge score is rounded. Backpropagation uses a straight-through identity derivative for rounding, a biased estimator rather than the true derivative of discrete graph selection. All modules are jointly trained with correspondence Hamming loss, locality Hamming loss relative to Delaunay, and a matching-conditioned discrepancy between the two generated adjacency matrices. Locality is a prior, not a requirement to reconstruct every initial edge (Equations 5/8-12).

**Generative topology.** GCNs parameterize latent means/variances, and conditional Bernoulli edge scores are sampled using a Gumbel-softmax relaxation. Alternating inference freezes the feature/matching parameters and updates the graph generator using locality plus consistency with the current predicted matching. Alternating learning fixes the generator and updates feature/matching modules against ground-truth correspondences. A Delaunay-based pretraining stage precedes alternating updates; the text reports shared random vectors for each graph pair. All reported datasets use locality weight 5 and consistency weight 0.3 (Sections 3.4/4; Algorithm 1).

**Probability and guarantee boundaries.** The supplementary Jensen/ELBO derivation is standard for a normalized joint model and proposal with the appropriate support; equality requires the proposal to equal the posterior. A restricted factorized neural proposal need not attain that posterior, and finite surrogate updates, straight-through/relaxed sampling and predicted-match priors do not inherit an exact EM monotonicity or global QAP guarantee. Appendix A.5 asserts deterministic local convergence and generic EM convergence without a result establishing those claims for this implementation. The observed training curves are empirical evidence, not a proof of optimal topology recovery.

## Experiments

**Protocols and metrics.** Pascal VOC uses 7,020 training and 1,682 test images in twenty classes, resized to 256 by 256 with 6-23 keypoints. Table 1 filters to inliers and reports matching accuracy; Table 2 includes outliers and reports precision/recall F1. Neither metric measures the rate of globally optimal QAP solutions. SPair-71k has 53,340/5,384/12,234 training/validation/test image pairs across eighteen classes. Willow distinguishes a Pascal-trained model applied directly (Pt) from one fine-tuned on Willow (Wt); those protocols must not be merged (Sections 4.1-4.3).

**Average improvements and negative cases.** Pascal inlier accuracy is 80.1% for BBGM, 82.9% for DLGM-D and 83.8% for DLGM-G: improvements of 2.8 and 3.7 percentage points. Outlier-aware F1 is 61.4/63.9/64.8%. SPair averages are 78.9/81.3/82.0%. These means do not establish category-wise dominance: DLGM-G Pascal bottle/train accuracy is 87.2/97.4 versus BBGM 87.4/97.7, its outlier train F1 is 77.5 versus 78.0, and its SPair car/TV accuracy is 85.8/98.5 versus 86.1/98.6. The deterministic variant also loses several categories (Tables 1-3).

**Transfer and ablation.** On Willow, direct DLGM-G transfer reaches 99.9/96.4/92.0/91.8/98.0% over face/motorbike/car/duck/wine; fine-tuning gives 100/99.3/96.5/93.7/99.3. Direct face accuracy remains below BBGM's 100%, and fine-tuned wine remains below DGMC's 99.9%. Dropping either locality or consistency reduces the Pascal mean in the reported ablation. Generator sample sizes 1/16/32 yield 82.5/83.8/83.7%, so more samples are not strictly better (Tables 4-7).

**Cost and uncertainty.** Relative to BBGM training, the authors report approximately 1.2-1.3 times cost for DLGM-D and 8-9 times for DLGM-G with sixteen samples. They report no obvious testing-stage efficiency gap, without a quantitative test-latency table or comprehensive memory/independent-seed uncertainty study. This is not evidence of a measured universal inference speedup (Section 4.4).

## Limitations

### Discussed in the Paper

Generating discrete topology complicates optimization and generative training is substantially more expensive. The work focuses on topology that can be constructed or inferred, preserves locality through a prior, and notes that learned latent links need not have an exact real-world semantic interpretation. Willow is small and further improvement can be difficult (Sections 1/3-4; Appendix A.1/A.5).

### Curator Notes

**Printed implementation ambiguities.** Equation 6 specifies Gaussian latent variables, but the following text calls uniform U(0,1) noise an equivalent reparameterization. Uniform affine noise is not Gaussian; standard Gaussian reparameterization requires standard normal noise. Without an identified author implementation this discrepancy cannot be resolved by silently choosing one. The stated factorized source/target proposal also needs interpretation alongside the instruction to share random vectors. Algorithm 1 is labeled DLGM-D although its alternating procedure describes DLGM-G, Appendix A.4 uses the same misleading deterministic heading, and the Figure 3 caption swaps the locality/consistency equation numbers. These are source inconsistencies, not demonstrated algorithmic failure.

The paper states a Willow total of 256 images, whereas the other reviewed Willow papers in this collection state 304; this audit retains the reported protocol rather than inventing a split from external expectations. Scientific coverage remains specialist visual correspondence with supplied keypoints; transfer across image datasets does not demonstrate a common optimizer for unrelated native tasks. Qualitative added/deleted edges and falling consistency losses do not certify recovery of a unique true graph or exact quadratic optimum.

## Reproducibility

- **Publication:** [PMLR ICML 2021 record](https://proceedings.mlr.press/v139/yu21d.html), pp. 12187-12197. Four authors and ASU/SJTU affiliations match the full paper. The publisher's [source metadata](https://raw.githubusercontent.com/mlresearch/v139/gh-pages/_posts/2021-07-01-yu21d.md) explicitly gives issued date 2021-07-01; this is distinct from the July 18-24 conference dates.
- **Reading:** all eleven publisher main-paper pages and all five separately linked supplementary pages, including complete references, ELBO/SplineCNN derivations, Tables 1-9, diagrams and qualitative topology/matching images. The publisher lists exactly the main PDF and supplementary PDF; the coauthor publication page links the paper without another scientific supplement.
- **Code:** no official DLGM implementation was identified from the publisher, [coauthor publication listing](https://runzhong.wang/) or targeted repository search. A related BBGM/ThinkMatch implementation is not evidence that the exact latent-generator training settings are released. This audit does not rerun training.
- **Citation graph:** exact explicit citations to CIE-H, Deep Graph Matching Consensus and the earlier arXiv title of Attention, Learn to Solve Routing Problems! are matched to existing IDs. Blackbox Backprop is additionally confirmed by explicit Pogancic2020 body citations and its full five-author ICLR bibliography entry, giving four relations. Other works do not acquire edges merely through topical similarity.
