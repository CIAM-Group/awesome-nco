---
id: pregm
short_title: PREGM
title: Improving Graph Matching with Positional Reconstruction Encoder-Decoder Network
authors:
- Yixiao Zhou
- Ruiqi Jia
- Hongxiang Lin
- Hefeng Quan
- Yumeng Zhao
- Xiaoqing Lyu
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/6cd3ac24cdb789beeaa9f7145670fcae-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/6cd3ac24cdb789beeaa9f7145670fcae-Abstract-Conference.html
institutions:
- Peking University
- Nanjing University of Technology
- Beijing University of Posts and Telecommunications
- Beijing Institute of Big Data Research
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Semantic Keypoint Matching
summary: Frozen coordinate embeddings learned with contrastive and triangle reconstruction objectives augment supervised
  visual graph matching through a blackbox combinatorial solver.
---

# Improving Graph Matching with Positional Reconstruction Encoder-Decoder Network

> **TL;DR:** PREGM pretrains coordinate embeddings by contrastive learning and triangle reconstruction, freezes that encoder, and combines its output with visual features in a supervised blackbox graph-matching pipeline.

## Motivation

Visual keypoint descriptors and Delaunay adjacency can miss useful spatial relationships between provided keypoint coordinates. The paper learns a richer coordinate representation before training semantic keypoint correspondence. Its formal objective is a bijective quadratic assignment, but reported performance measures correspondence accuracy rather than a certified QAP optimum (Sections 1-3).

## Contributions

- A positional reconstruction encoder-decoder, PR-EnDec, learns graph-contextual coordinate features with positive/negative graph-pair contrastive supervision.
- A pretraining decoder predicts three pairwise distances and a triangle area, encouraging the encoder to retain geometric structure.
- A frozen positional encoder augments visual features in a BBGM/LPMP-based matcher, evaluated on four visual keypoint datasets with component ablations.

## Methodology

**Coordinate pretraining.** A two-layer coordinate MLP and three self-attention blocks produce positional node embeddings. Positive graph pairs have affine-related coordinates or corresponding keypoints; negative pairs do not preserve the matching. The contrastive objective is minus the log ratio of summed exponentiated positive similarities to positive-plus-negative similarities. Its printed logits multiply cosine similarity by tau=2. A decoder samples three nearby points, applies two attention blocks and two MLP heads, and predicts three Euclidean distances plus triangle area. Mean squared reconstruction error is added with lambda=1/32 (Sections 4.1-4.2/Equations 6-12).

**Matching stage.** Pretrain PR-EnDec on PascalVOC, then freeze its encoder. Add a learned linear projection of its output to aligned VGG16_bn image descriptors. A two-layer SplineCNN refines these features; node/edge affinities enter LPMP, with blackbox differentiation and a supervised Hamming loss against ground-truth matches. Matching frameworks are trained separately on each dataset. A transferable encoder is not evidence of one unchanged solver spanning different native optimization tasks (Sections 4.3/5.3).

**Guarantee boundary.** Contrastive augmentation encourages affine robustness; no exact affine-invariance or global QAP-optimality theorem is established. Distances and triangle area themselves change under general affine transforms. An exactly unchanged representation could not let a deterministic decoder recover all such changed raw quantities without additional transformation information. The objectives therefore express a learned tradeoff, not a proof of exact invariance. Self-attention without positional ordering is permutation equivariant at node level, rather than making all node outputs independent of their correspondence order (Section 4).

## Experiments

**Protocols and metric.** Accuracy counts correctly matched keypoint pairs relative to ground-truth pairs. Intersection filtering makes paired graphs equal-sized. PascalVOC uses 7,020 training/1,682 test images, cropped and resized to 256 square pixels. Willow uses twenty training images per category and the rest for testing. SPair-71k uses 53,340/5,384/12,234 train/validation/test pairs. IMC-PT-SparseGM holds out three of sixteen landmark classes and evaluates fifty anchors. These are annotated visual correspondence settings, not tests of arbitrary unfiltered partial QAP instances (Sections 5.1-5.4).

**Reported table results.** PascalVOC Table 1 gives mean 84.1% versus COMMON 82.7%, a 1.4 percentage-point difference. PREGM is strictly best in eleven of the twenty displayed categories, not seventeen as the prose claims; examples of losses include aeroplane 62.6 versus 65.6, bird 79.3 versus 80.8, plant 98.7 versus 98.9 and train 96.7 versus 99.3. Willow Table 2 gives 98.2% with PT-cross/WT-check and 99.3% with both checked. In the latter row motorbike 99.6 remains below the 99.8 non-PT row. SPair Table 3 gives 82.4% versus BBGM 78.9%; all eighteen displayed categories improve over listed baselines. IMC Table 4 gives 90.7% versus BBGM 88.4%, across the three held-out landmarks (Tables 1-4).

**Ablations and cost.** On PascalVOC, removing the positional encoder gives 83.4%, the spatial decoder 81.7%, area reconstruction 83.8%, distance reconstruction 82.7%, and visual features 76.8%, versus 84.1% complete. Learning-rate and lambda sensitivity are reported. Adam uses 1e-4 for pretraining and 9e-4 for matching, halved every three epochs; batch size eight is specified for the first three datasets and a GTX-1080Ti is used. No standardized training-time, inference-latency or total-cost comparison is supplied, and the number of training epochs is not specified in the experimental settings. Higher accuracy does not establish a speed advantage (Sections 5.3/5.5/Tables 5-6).

## Limitations

### Discussed in the Paper

The authors propose improving the positional loss and visual/spatial feature fusion. They report sensitivity to the reconstruction-loss weight (Sections 5.5/6).

### Curator Notes

Several printed results/settings conflict. The SPair prose says 81.9% while Table 3 says 82.4%. The Willow prose calls the 98.2% setting PT-only, whereas Table 2 labels it no-PT/with-WT; the table should not be presented as verified zero-shot transfer. The Pascal claim of seventeen winning categories disagrees with direct table comparison. The publisher abstract says three datasets while the PDF and four result tables show four. The publisher author list spells Hefeng Quan, whereas the PDF prints Hefeng Guan; the catalogue follows the formal publisher record. These discrepancies are retained explicitly rather than silently reconciled.

Coordinate pretraining still uses paired/corresponding keypoints or generated transforms, and the final matcher uses ground-truth correspondences. It is not an unsupervised end-to-end optimizer. Evaluation filtering, provided keypoints and separate dataset training restrict claims about outliers, arbitrary-size matching or universal task generalization. Without verified released code, augmentation distributions, triangle sampling, normalization, training schedules and the Willow setting cannot be independently resolved.

## Reproducibility

- **Formal record:** [NeurIPS 2023 proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6cd3ac24cdb789beeaa9f7145670fcae-Abstract-Conference.html), volume 36, pages 34557-34569; DOI 10.52202/075280-1501. The official HTML citation_publication_date gives December 15, 2023, independently of the conference dates.
- **Full reading:** all thirteen [publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2023/file/6cd3ac24cdb789beeaa9f7145670fcae-Paper-Conference.pdf) pages, complete references, all diagrams/objectives/tables. No integrated appendix or separately linked scientific supplement appears in the proceedings record or manuscript. The identified OpenReview forum/API requires browser verification; no missing scientific attachment is asserted from that inaccessible endpoint.
- **Implementation:** the paper says code will be made available. Title/author searches and the available primary pages did not establish an official implementation. No code URL or reproduction claim is invented; training was not rerun.
- **Citation graph:** three existing catalogue targets are explicitly cited in the body and bibliography: DGMC [9], blackbox differentiation [25], and CIE [43]. BBGM, PCA-GM and the TPAMI mixture-of-modes paper are distinct works absent from this catalogue, and are not substituted with similarly related entries.
