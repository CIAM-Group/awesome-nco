---
id: nn-steiner-a-mixed-neural-algorithmic-approach-for-the-rectilinear-steiner-minimum-tre
short_title: NN-Steiner
title: 'NN-Steiner: A Mixed Neural-Algorithmic Approach for the Rectilinear Steiner Minimum Tree Problem'
authors:
- Andrew B. Kahng
- Robert R. Nerem
- Yusu Wang
- Chien-Yi Yang
year: 2024
date: '2023-12-17'
publication:
  date: '2024-03-24'
  source_url: https://doi.org/10.1609/aaai.v38i12.29200
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v38i12.29200
institutions:
- University of California San Diego
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Rectilinear Steiner Minimum Tree
summary: Reusable MLPs predict quadtree portal configurations before MST construction and classical GeoSteiner refinement;
  empirical RSMT size transfer is separate from the theoretical capacity sketch.
arxiv_url: https://arxiv.org/abs/2312.10589
code_url: https://github.com/ABKGroup/NN-Steiner
figure:
  path: paper-assets/nn-steiner-a-mixed-neural-algorithmic-approach-for-the-rectilinear-steiner-minimum-tre/framework.png
  alt: Original Figure4 shows quadtree, bottom-up encodings, top-down retrieval, MST and classical local refinement.
  caption: Original Figure4 and full caption show practical NN-Steiner, distinct from the exponentially large theoretical
    exact-DP network construction.
  source_url: https://arxiv.org/pdf/2312.10589v2#page=5
---

# NN-Steiner: A Mixed Neural-Algorithmic Approach for the Rectilinear Steiner Minimum Tree Problem

> **TL;DR:** Four reusable MLPs predict portal configurations inside an Arora-inspired quadtree decomposition; an MST and classical local refinement produce a rectilinear Steiner tree. Size transfer is demonstrated within RSMT. The theoretical capacity construction is distinct from the compressed networks actually trained.

## Motivation

Arora's approximation framework reduces large geometric problems to bounded local DP components, but explicit configuration enumeration is expensive. NN-Steiner learns compact representations of these components while keeping the hierarchical algorithmic structure. [pp. 1–4]

## Contributions

- Describe a neural simulation of the portal-configuration DP and a bounded-component capacity theorem.
- Instantiate four MLP modules for bottom-up encoding and top-down portal prediction.
- Evaluate size/distribution transfer and the effects of refinement, leaf size, portal count and threshold. [Sections 3–4; Appendices A–C]

## Methodology

Build a quadtree, stopping at at most k_b terminals per leaf. NN_base and NN_DP recursively encode local configuration information. NN_top/NN_retrieve predict portal likelihoods; thresholded portals join the input terminals in an MST. Cell/subtree GeoSteiner refinement, low-degree removal and coordinate rounding finish the construction. Classical postprocessing does not establish a learned incumbent-improvement policy: this is **specialist/constructive** RSMT solving. [Figure 4; pp. 4–6]

The theoretical configuration dimension is bounded for fixed m,r but can be exponentially large in those parameters. Its approximation expression contains log L/m; bounded component size does not mean a fixed-size learned model is proven to attain every fixed approximation ratio at arbitrary scale. The practical d_c-dimensional representation is much smaller than the full configuration vector. Theorem 3.1 gives a capacity sketch, not a guarantee that the trained compressed networks implement exact DP. Only the NN_DP construction is spelled out; the text defers other neural cases to a full version, and the identified extended copy does not supply explicit constructions for them. [Theorems 2.1/3.1; Appendix A]

## Experiments

Training uses 120000 GeoSteiner-labeled pointsets with fewer than 180 points, a fixed depth-three training tree and four 4096-wide MLPs, 5000 epochs and batch size 5000. Testing adapts the tree to each instance, with 50–5000 points on a larger integer grid. Default m=15, k_b=4, threshold=.95, refinement subtree size10. Results average 100 pointsets. [p. 6; appendices]

At 5000 points, the final tree is 2.99% shorter than FLUTE, versus REST's 147.48% longer. At 50 points, NN-Steiner is 2.10% longer than FLUTE while REST is 0.14% shorter. FLUTE is a heuristic reference, so negative percentages are not negative optimality gaps. GeoSteiner exact comparisons are available only through 1000 points. [Table 1]

Runtime is not uniformly better: totals for 100 sets of 5000 points are NN-Steiner 1021 s, FLUTE 613.77 s and REST 5707.48 s. MST-plus-refinement alone takes 332.46 s with a 2.46% length reduction, showing that classical refinement contributes much of the gain. NN construction improves its quality further at additional cost. The 0.95 threshold is not uniformly best; Table 11 includes better choices at some smaller sizes. [Tables 2–4, 11]

## Limitations

Experiments concern planar, obstacle-free RSMT; 3D and obstacle avoidance are proposed extensions, not demonstrated shared-checkpoint tasks. Expensive exact labels and GeoSteiner refinement remain part of the method. Approximate linear runtime on tested sizes is an empirical observation, not a hardware-independent complexity guarantee. The proof-detail boundary above must be retained when discussing neural approximation guarantees. [Conclusion; Appendices A–C]

## Reproducibility

Read all **13 pages of arXiv v2**, including the complete bibliography, full structure-theorem proof and all scientific Appendices A–C/tables/threshold results; inspected all four contact sheets and original Figure4/full caption. Actual arXiv history is v1 **2023-12-17**, v2 **2023-12-19**. The publisher DOI independently establishes four UCSD authors, AAAI2024, pages13022–13030 and publication **2024-03-24**. No independent complete proof of all four theoretical network constructions is claimed.

The [pinned author repository](https://github.com/ABKGroup/NN-Steiner/tree/5fd75c5e437bd7651aee2740dadec1cdc6636895) has5064 tree entries. Its TeX document is a vendored GeoSteiner manual, not an additional NN-Steiner appendix. The full README documents code/data generation/training/evaluation and warns that paper results use a CPLEX-compiled GeoSteiner library that cannot be distributed. Its release uses GeoSteiner5.3 whereas the text specifies5.1; example two-epoch/batch60 settings are not the reported5000-epoch/batch5000 training run. No model archive was deserialized or benchmark reproduced.
