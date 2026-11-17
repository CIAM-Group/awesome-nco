---
id: llmco4mr-llms-aided-neural-combinatorial-optimization-for-ancient-manuscript-restorati
short_title: LLMCO4MR
title: 'LLMCO4MR: LLMs-aided Neural Combinatorial Optimization for Ancient Manuscript Restoration from Fragments
  with Case Studies on Dunhuang'
authors:
- Yuqing Zhang
- Hangqi Li
- Shengyu Zhang
- Runzhong Wang
- Baoyi He
- Huaiyong Dou
- Junchi Yan
- Yongquan Zhang
- Fei Wu
year: 2024
date: '2024-11-01'
publication:
  date: '2024-11-01'
  source_url: https://link.springer.com/chapter/10.1007/978-3-031-73226-3_15
venue: ECCV
paper_url: https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/9585_ECCV_2024_paper.php
institutions:
- Zhejiang University
- Shanghai Institute for Advanced Study of Zhejiang University
- Shanghai Jiao Tong University
- Shanghai AI Laboratory
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Cardinality-constrained Manuscript Fragment Selection
- 2D Manuscript Fragment Assembly
summary: A supervised siamese/GCN selector with differentiable OT constructs fixed-cardinality fragment subsets
  before zero-shot GPT-4V pairwise matching. Experiments use synthetic grid shredding and small Dunhuang case studies;
  candidate rejection triggers reselection and final assembly conflicts still require human experts.
figure:
  path: paper-assets/llmco4mr-llms-aided-neural-combinatorial-optimization-for-ancient-manuscript-restorati/framework.png
  alt: Siamese fragment contours define a similarity graph; GNN and OT select Top-K pieces, MLLM checks pair matches
    and directions, and anomalous input pieces are removed for reselection.
  caption: 'Original Figure 4: neural candidate selection and MLLM pairwise matching.'
  source_url: https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=7
---

# LLMCO4MR: Neural Fragment Selection and MLLM-assisted Manuscript Restoration

> **TL;DR:** A learned cardinality-constrained selector filters a fragment pool before an MLLM judges pairwise compatibility and direction. The method is **specialist/constructive**, with iterative input-pool filtering; the supplement explicitly retains expert intervention for conflicting final assemblies. Reported selection/pairing scores are not proof of fully automatic historical reconstruction.

## Motivation

Small Dunhuang fragments can have little text, irregular contours and unrelated pieces mixed into the collection. Comparing every pair with a multimodal model is expensive and unreliable. LLMCO4MR uses contour-based neural selection to narrow the candidate pool, then exploits an MLLM's visual/textual judgement for local matching. Its open-world setting concerns outlier pieces; it does not solve arbitrary missing-piece or mixed-scale reconstruction. [Task and assumptions.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=2)

## Contributions

- Fragment subset selection is formulated as a cardinality-constrained objective maximizing mutual contour compatibility.
- A siamese CNN, similarity-graph GCN and differentiable optimal-transport layer learn to select a specified number of pieces.
- A two-stage grid-aware selection heuristic improves the nine-piece synthetic setting.
- Zero-shot MLLM prompts request pairwise scores and relative directions; rejected pieces can be removed from the input pool before reselection. Synthetic tests and expert-annotated Dunhuang cases evaluate the components and combination. [Framework.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=7)

## Methodology

### Neural construction of a candidate subset

For m fragments, the method is given the desired cardinality k. A shared CNN compares masked contour images and predicts pairwise adjacency scores. Thresholded similarities form an undirected graph with fragment features on vertices and similarity weights on edges. A GCN produces node scores; a Sinkhorn-based OT layer encodes selection marginals and yields a Top-K subset.

The selection objective is the negative sum of similarities among chosen pieces, subject to a cardinality bound. Training additionally uses binary cross-entropy for pairwise adjacency and node membership. Although one paragraph calls the loss unsupervised, the described complete training procedure includes synthetic labels and these supervised terms. Annotation-free in the comparison table refers to generating labels through synthetic shredding, not learning without target labels. [Equations1-3 and solver.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=7)

### Grid-aware refinement and MLLM checks

Synthetic examples originate from a complete rectangular manuscript, cut with contours extracted from real pieces. Edge filters reject overly short, straight or curved contours. For a3x3 grid, the second-order strategy selects five more-connected central pieces first, prunes edges unrelated to them, then selects the remaining four. This encodes a grid-layout assumption rather than solving a general unstructured assembly problem.

A role prompt asks GPT-4V whether two pieces fit, requests a score out of100, relative direction and placement order. The supplement uses a60-point decision threshold. A piece judged to have no viable match can be excluded from the input pool and the selector rerun. This is repeated candidate construction, not a learned operator editing a complete assembled incumbent. Final pairwise predictions can conflict; **supplementE.2 explicitly requires human experts to resolve such collisions**. [Selection and matching.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=9) [Complete prompt and final verification.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585-supp.pdf#page=2)

## Experiments

### Data, metrics and disclosed budget

Experiments use Intel i7 CPUs at3.2GHz and RTX3090 GPUs. The selector trains on500synthetic groups and evaluates100additional groups. Siamese training compares40k/80k/120k positive-and-negative pairs and a6:1 train/test ratio. Exact image-level separation across synthetic pair/group splits is not specified. Real images come from the International Dunhuang Project, with scarce expert-provided ground truth.

The synthetic Top-K accuracy credits each selected piece that belongs to the correct fragment group. A value such as.78 is therefore not a78% rate of perfectly recovered complete puzzles. Real-case success is described through agreement with expert candidate pairings; the paper does not supply a complete-assembly success criterion with a disclosed number of independent historical manuscripts. Optimizer settings, full training epochs, loss weights, graph thresholds, exact GPT-4V API/version/temperature, number of calls/reselection rounds, total latency and monetary cost are not fully reported. [Evaluation protocol.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=11)

### Synthetic selection results

The best displayed siamese setting uses120kpairs and a1:2 positive/negative ratio, with.9731pair accuracy and.7800Top-4 score. For selecting four from10/15/20candidates, OT produces.7800/.5825/.4225, versus the GCN-without-OT baseline.7475/.3125/.2575. Random expectations are.4/.2667/.2.

For nine-piece selection from20/25/30candidates, ordinary OT scores.7256/.6444/.6044. Second-order selection improves them to.7311/.6822/.6633. Accuracy still deteriorates as the pool grows; the layer's cardinality handling is not a guarantee of identifying the true subset. [Tables2-4.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=12)

### Dunhuang cases and MLLM limitations

Across the four reported grid/pool configurations, the full pipeline scores.6750/.6250/.6222/.5556, versus the selector alone.5750/.5250/.5333/.4667. For the first2x2/pool10setting, direct GPT-4V is.3250 and LLaVA.3150. These comparisons support the staged design on the evaluated cases, without establishing an unlimited-pool or fully autonomous restoration capability.

The supplement describes mainly successful groups of3-5pieces. GPT-4V is sensitive to image order and struggles with self-similar or partially matching contours. Its threshold60experiment reports.7143correct-positive and.7194correct-negative fractions. Despite using the word precision in prose, the table does not provide a full confusion matrix establishing positive predictive value or calibrated confidence. Selected visual examples on other relics are qualitative showcases, not a separate large benchmark. [Table5.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585.pdf#page=14) [SupplementD-E.](https://www.ecva.net/papers/eccv_2024/papers_ECCV/papers/09585-supp.pdf#page=3)

## Limitations

The method assumes a roughly grid-like layout, a supplied target cardinality and suitably comparable fragment sizes. The conclusion identifies missing fragments and mixtures of small/large pieces as unresolved. The supplement's example of evaluating only three known positive pieces from a larger grid does not establish recovery of the missing material or a complete missing-piece solver.

Expert case annotation and final collision resolution remain part of the evidence. Limited data, unspecified global-assembly criteria, absent uncertainty estimates and incomplete API/training budgets restrict reproducibility and broader historical claims. Semantic compatibility and high neural similarity are proposals for archaeologists to verify, not independent historical authenticity evidence. No model training, API calls or fragment reconstruction was independently reproduced.

## Reproducibility

- ECCV2024 DOI10.1007/978-3-031-73226-3_15, pages253-269, has **First Online2024-11-01**, matching publisher-deposited Crossref. The Springer HTML's generic citation-publication-year field says2025, while the named conference edition is2024; the explicit online event is the date used here. Nine-author byline and four affiliations were checked; Shengyu Zhang and Junchi Yan correspond.
- **All18pages of the public ECVA paper and all5pages of its explicitly linked scientific supplement were fully read**, including all56references, synthetic-generation details, complete MLLM prompt, failure examples and human-verification requirements. These are the actual registered reading copies; the18-page ECVA layout is distinguished from the17-page Springer chapter range.
- Official ECVA links were manually inspected for paper, supplement and DOI. The coauthor's publication page and lab publication entry link the paper but no implementation. Normal exact-title/code/arXiv searches found no identifiable official code repository or separate arXiv version; this is a current source-inventory result, not a claim that no private implementation exists. Missing code does not imply missing scientific text.
- Original Figure4 is cropped from ECVA PDFpage7, rectangle(130,110,486,400), at4x and actually viewed. The selection formulation and loss render correctly despite corrupted text extraction; they were inspected visually. Synthetic generation, second-order pruning, all numerical result tables and supplementary matching examples were also rendered and checked.
- Six internal references have explicit in-text citations and matching bibliography identities. Distinct journal restoration methods are not forced onto conference counterparts; no relationship is added solely because two methods share a task.
