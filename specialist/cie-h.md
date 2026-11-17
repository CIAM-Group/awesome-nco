---
id: cie-h
short_title: CIE-H
title: Learning deep graph matching with channel-independent embedding and Hungarian attention
authors:
- Tianshu Yu
- Runzhong Wang
- Junchi Yan
- Baoxin Li
year: 2020
date: 2020-04
publication:
  date: 2020-04
  source_url: https://iclr.cc/virtual_2020/poster_rJgBd2NYPH.html
venue: ICLR
paper_url: https://openreview.net/forum?id=rJgBd2NYPH
institutions:
- Arizona State University
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Semantic Graph Matching
summary: Supervised visual matching combines channel-wise node/edge embeddings with a ground-truth/Hungarian loss
  mask; exact decoding remains a linear assignment substep.
code_url: https://github.com/Thinklab-SJTU/ThinkMatch
---

# Learning deep graph matching with channel-independent embedding and Hungarian attention

> **TL;DR:** Channel-wise node/edge message passing improves visual matching features, while a ground-truth/predicted-Hungarian mask focuses supervised loss on selected entries. Hungarian remains a discrete linear-assignment step; the method does not certify the optimum of a general quadratic assignment problem.

## Motivation

Graph matching depends on relational edge attributes as well as node appearance. Earlier node-focused deep matchers underuse explicit edge features. Training a dense continuous assignment matrix also differs from evaluating its discretized Hungarian prediction, motivating a structured hard-attention loss (Sections 1–3).

## Contributions

- **Channel-independent embedding (CIE):** linearly transform features across channels, then merge node/edge messages separately within each channel.
- **Hungarian attention:** mask element-wise losses using the union of ground-truth positive assignments and the current Hungarian prediction, emphasizing selected false assignments as well as required positives.
- Test the components together and as modifications to other visual graph-matching architectures/losses on CUB, Pascal VOC, Willow and synthetic data.

## Methodology

**Visual graph input.** VGG16 relu4_2/relu5_1 features are sampled at provided semantic keypoint locations and concatenated. Delaunay triangulation supplies graph adjacency; edge features are initialized from reciprocal edge length in the reported implementation. Siamese node/edge processing, cross-graph feature exchange, learned similarity and a continuous assignment layer precede final discretization. The method assumes keypoints/object crops are already available, rather than discovering arbitrary correspondences directly from unannotated raw images (Sections 3.1/4).

**Two CIE variants.** Node updates combine a transformed self-message and neighbor features gated by edge channels. CIE1 uses these edge embeddings but only a separate linear update on them; CIE2 additionally couples edge updates to endpoint-node features. CIE1 is therefore not an edge-free model. “Channel-independent” concerns the local merging operation after channel-mixing linear maps, not a statistical independence theorem for the final learned features. Two CIE layers follow the CNN (Sections 3.2/4).

**Masked supervision.** Compute Z=OR(Hungarian(S),X_groundtruth). Optimize masked binary cross-entropy or an analogous focal/margin loss over continuous scores S; ground-truth assignments remain in the mask even when not selected by Hungarian. The mask can be constructed by a discrete black box and treated as fixed for a gradient update. This does not differentiate through Hungarian's discrete decisions. When predictions switch, the mask can change discontinuously, so the paper's smoothness/avoiding-local-optima discussion is qualitative rather than a proof of a globally smoother objective or convergence to the correct permutation (Section 3.3; Equations 13–14; official loss implementation).

**Exactness boundary.** The introductory Lawler QAP describes general graph matching, but the deployed network predicts an affinity/assignment representation and Hungarian optimizes the resulting linear assignment. That exact substep is not a global QAP optimality guarantee. The printed normalization Equation 5 is not the usual alternating multiplicative Sinkhorn form, and the second cross-graph update in Equation 6 has a feature-index ambiguity; reproduction should use the documented implementation rather than silently treating every printed formula as an unambiguous solver specification (Sections 1/3.1).

## Experiments

**Training and metric.** Experiments use supervised ground-truth correspondences, batch eight and SGD with momentum 0.9. Images are cropped/resized to 256×256. Matching accuracy is the fraction of correct final Hungarian correspondences, not an objective-optimality rate. Pascal VOC provides 7,020 training and 1,682 test images across twenty classes with six to twenty-three keypoints. Gray rows in Table 1 are training accuracies and must not be compared as held-out results (Section 4/Table 1).

**Pascal VOC gains and negatives.** Mean test accuracy is 68.9% for CIE1-H versus 68.1% for CIE1-P: **0.8 percentage points**, not automatically a 0.8% relative improvement. CIE2-H reaches 67.4%, showing the more elaborate edge update is not uniformly better. Hungarian masking also loses individual categories: CIE1 boat falls 58.9→55.0, bus 76.3→72.8 and car 71.0→69.0. Other methods retain stronger categories such as PCA-P bus 77.9 and train 86.7 versus CIE1-H 72.8/85.2. The average result does not imply dominance on every object class (Table 1).

**CUB protocols.** The paper describes 11,788 bird images and fifteen annotated parts, evaluating within-category and category-agnostic pairs without the unavailable pose pre-alignment. CIE-H reaches 94.4/94.2% versus CIE-P 94.1/93.8%. Its stated intra-class test count “2,000 pairs, 100 per category” is inconsistent with the stated 200 categories; the exact sampling count needs clarification. The cited dataset reference is the older CUB200 report despite the text calling the experiment CUB2011, another provenance detail to check when reconstructing the split (Section 4/Table 3).

**Willow transfer versus fine-tuning.** Suffix V means a Pascal-trained model applied directly; W means fine-tuning on Willow. These are different protocols. Direct CIE transfer has weaker duck accuracy 73.2 than PCA-V 82.4 and GMN-V 74.3. Fine-tuned CIE-W improves motorbike to 90.0 but loses to PCA-W on car (82.2 versus 84.0) and duck (81.2 versus 93.5). This is useful visual-matching transfer with clear negative cases, not a common model shown solving unrelated native optimization tasks (Table 2).

**Ablations and evidence limits.** Hungarian masking is also evaluated with focal loss (α=0.75, γ=2) and a margin loss (β=0.2); the mean plotted results improve. Synthetic tests vary feature noise and graph size, but the authors stress that independent random high-dimensional features lack correlations/manifold structure of real images. Loss/accuracy curves and a seven-versus-eight-correct example illustrate training behavior, rather than proving all unmasked gradients are useless. The paper does not supply a comprehensive runtime, memory or independent-training-seed uncertainty comparison (Figures 4–7; Appendix A).

## Limitations

### Discussed in the Paper

Willow is small and biased toward relatively fixed poses/backgrounds. Hungarian attention helps less on easy datasets. More coupled edge updates can perform worse, and the synthetic generator is an imperfect proxy for real graph features; more realistic synthetic data are left to future work (Sections 4–5; Appendix A).

### Curator Notes

The scope is specialist supervised semantic graph matching with provided keypoints. Exact Hungarian decoding, a hard loss mask and a generic QAP motivation must not be promoted to exact quadratic optimization, differentiability of the discrete decoder or a universal optimization guarantee. Preserve direct-transfer/fine-tuned distinctions, category-level negatives, percentage-point units and unresolved dataset/formula details.

## Reproducibility

- **Publication/title:** [official ICLR 2020 poster](https://iclr.cc/virtual/2020/poster/1862), [OpenReview record](https://openreview.net/forum?id=rJgBd2NYPH). The official title and author module use “with”; the reviewed accepted-PDF heading uses “via.” Four authors and ASU/SJTU affiliations match. The legacy official conference HTML explicitly records citation_publication_date=2020/04, supporting the publication month April 2020; this comes from publication metadata, not an assumption from event dates.
- **Reading:** complete fifteen-page accepted-version public-mirror PDF, references and integrated Appendices A.1–A.2, all formulas, result tables, plots and example images. Normal OpenReview forum/PDF/API checks require browser verification; byte identity to a freshly retrieved publisher PDF is not claimed. Official conference and author module/inventory checks identified no additional scientific attachment beyond the integrated appendix.
- **Code:** [author ThinkMatch CIE module](https://github.com/Thinklab-SJTU/ThinkMatch/tree/master/models/CIE) and [Hungarian loss implementation](https://github.com/Thinklab-SJTU/ThinkMatch/blob/master/src/loss_func.py) were inspected. README supplies experiment/pretrained-model links and a current broader benchmark suite; present SPair/current table values should not be backdated to the 2020 experiments. This audit does not rerun training.
- **Citation graph:** the explicit Pointer Networks citation is matched to its exact existing catalogue record. Other permutation/graph works were manually checked without assuming similarly named Sinkhorn papers are identical.
