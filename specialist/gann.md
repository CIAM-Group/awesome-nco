---
id: gann
short_title: GANN
title: Graduated Assignment for Joint Multi-Graph Matching and Clustering with Application to Unsupervised Graph
  Matching Network Learning
authors:
- Runzhong Wang
- Junchi Yan
- Xiaokang Yang
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/e6384711491713d29bc63fc5eeb5ba4f-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/e6384711491713d29bc63fc5eeb5ba4f-Abstract.html
institutions:
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Graph Matching
problems:
- Multi-Graph Matching
- Graph Clustering
summary: Unsupervised correspondence pseudo labels from classical multi-graph assignment/clustering train a visual
  feature network, with transductive Willow results and heuristic QAP guarantees.
code_url: https://github.com/Thinklab-SJTU/ThinkMatch
---

# Graduated Assignment for Joint Multi-Graph Matching and Clustering with Application to Unsupervised Graph Matching Network Learning

> **TL;DR:** A classical annealed assignment procedure supplies multi-graph matching/clustering pseudo labels to train image-keypoint features. The learned GANN pipeline improves several visual-matching benchmarks, but does not certify global QAP optimality or arbitrary partial-matching cycle equalities.

## Motivation

Pairwise visual matches can disagree across an image collection, and collections may mix object categories. Joint matching can exploit consistency, while clustering separates incompatible graphs. Using these joint results as pseudo labels reduces dependence on ground-truth correspondence supervision (Sections 1–2).

## Contributions

- **GA-MGM:** a learning-free graduated-assignment heuristic for multi-graph Koopmans–Beckmann QAP matching.
- **GA-MGMC:** alternate that matching procedure with spectral clustering and a second annealing parameter controlling intercluster influence.
- **GANN:** train a VGG16 feature extractor using cross-entropy between differentiable pairwise Sinkhorn predictions and the joint solver's pseudo assignments. Learning features and solving the assignment are distinct parts of the method.

## Methodology

**Matching representation.** Each image graph contains annotated keypoint locations, CNN features bilinearly sampled at them and distance-based edge weights. Pairwise similarity uses a Sinkhorn-normalized feature inner product. Each graph maps to a common universe through U_i, giving pairwise assignment X_ij=U_i U_jᵀ. The KB-QAP objective combines node agreement with a quadratic edge-alignment term over graph pairs (Section 2.1).

**Annealed heuristic.** Initialize U near a uniform assignment with small Gaussian noise. Repeatedly form a linearized score, project it by entropy-regularized Sinkhorn, lower its temperature τ and finally use Hungarian projection for a discrete assignment. Compact matrix operations accelerate the implementation on GPU. Hungarian solves the induced linear assignment exactly; it does not solve the original nonconvex joint QAP exactly. The paper's Taylor discussion is a heuristic construction, without a proof of global optimality, objective monotonicity throughout annealing or convergence to the best joint assignment (Algorithm 1; Section 2.1.3; supplement A/B).

**Joint clustering.** Graph-to-graph similarity combines aligned adjacency agreement and node-feature agreement. Spectral clustering with k-means++ produces a cluster matrix C for a supplied number of clusters. Matching weights are one within predicted clusters and β across them; decreasing β gradually trusts clustering more. The known cluster count and graph/keypoint inputs remain required. MGM and MGMC are related visual correspondence settings within this specialist pipeline, not a shared neural solver shown across unrelated native optimization tasks (Section 2.2; Algorithm 2).

**Learned component.** The ImageNet-pretrained VGG16 relu4_2/relu5_1 features feed two branches. A joint GA-MGM/C teacher supplies discrete pseudo labels; a differentiable feature-inner-product/Sinkhorn student is optimized by binary cross-entropy. In MGMC, only pairs inside predicted clusters contribute. Gradients train the feature/student branch rather than differentiating through the full discrete teacher/clustering solver. “Unsupervised” refers to correspondence/cluster pseudo supervision in this procedure, not training from scratch without pretrained supervision, annotated keypoint locations or benchmark category-based batch construction (Sections 2.3/3; Figure 1).

**Partial-matching consistency caveat.** The strict identity X_ij=X_ik X_kj is appropriate to compatible complete bijections. Universe factorization supports coherent identities in partial matches, but does not imply that equality for every intermediate graph if it omits a shared node: X_ik X_kj contains U_kᵀU_k, which need not be the universe identity. For example, graphs i/j containing only universe node one and k containing only node two have X_ij=1 but X_ik X_kj=0. The printed doubly-stochastic two-way constraints likewise need dummy-node/partial interpretation for unequal sizes. This is a limitation of transferring the printed full-matching definition verbatim to arbitrary partial data, not a claim that partial inference cannot be implemented (Definition 1/Section 2.1).

## Experiments

**Protocol and metrics.** Willow uses ten common keypoints without outliers and evaluates both MGM and three-category MGMC. The entire Willow dataset is used for both unsupervised training and testing, so results are transductive rather than held-out-image generalization. CUB2011 contains 11,788 bird images across 200 categories, with partially visible fifteen-keypoint annotations; the original approximately half/half split is respected and evaluation uses held-out images. Training samples eight graphs per category. Matching precision/recall/F1 and cluster purity/Rand index/clustering accuracy are distinct metrics; without outliers matching precision/recall/F1 coincide (Section 3).

**MGM outcomes and comparison limits.** Main Table 2 reports Willow GANN accuracy 0.964/0.949/1.000/1.000/0.978 on car/duck/face/motorbike/winebottle. These lead or tie several columns, but NMGM has better car accuracy 0.973. Learning-free GA-MGM is not uniformly strongest either. Many supervised baseline values are quoted from their original papers and mostly solve two-graph matching, while GANN jointly uses multiple graphs and Willow test images during unsupervised learning; these protocols should not be flattened into a controlled universal supervision comparison. CUB results show comparable held-out matching to selected supervised methods, not an optimum certificate (Table 2; Figure 2).

**MGMC quality/time trade-offs.** Main Table 3's 24-graph learned method reaches purity/Rand/clustering accuracy 0.976/0.970/0.963 and matching accuracy 0.896 in 5.2 seconds; RRWM is faster at 0.4 seconds. For 130 graphs, GANN has strong clustering values but matching accuracy 0.906 loses to DPMC 0.941 and ties CAO-C. Its reported 80.7 seconds is faster than DPMC 97.5, but far from the fastest baseline. Neither all-metric dominance nor uniformly fastest inference is supported (Table 3).

**Ablations and scaling.** The supplement's PIA-GM variant adds randomly initialized GCN layers and performs much worse than the VGG-only pipeline, supporting sensitivity of pseudo-label learning to feature initialization. Annealing-factor tests favor γ≈0.8 on one 130-graph setting; γ<0.6 can struggle to converge. Initialization variants are similar in that experiment, not proven irrelevant for every graph. Compact-form memory grows quadratically in total graph nodes; simplified time bounds additionally assume the tested size relationships among graph count, universe size and Sinkhorn iterations (supplement C/E).

**Publisher-version discrepancies.** The separately hosted supplement retains draft numbering and materially different entries. Main λ values are 0.5/0.05, versus supplement 1/0.1; the current author experiment YAMLs use 0.5/0.05. Main Taylor Equation 8 uses a factor two on the quadratic contribution whereas its algorithm and supplemental derivative use a different relative coefficient. The supplement also reports different baseline clustering values and 130-graph GANN time 9.2 seconds versus main 80.7. These tables must not be silently merged into one experiment. The supplemental Willow class counts sum to 404 while its stated total is 304; the main paper gives 304. The note retains main-table values with these source conflicts explicit.

## Limitations

### Discussed in the Paper

Pseudo clusters can be wrong and lead to meaningless cross-category matching supervision. Unsupervised learning can overfit biased/small data; the GCN ablation can fail under inadequate initialization. Clustering in the bird example reflects pose/graph structure, and the two illustrated misclassifications have poses atypical for their species. The authors distinguish this from semantic image classification using richer high-level features (Section 2.3/Broader Impact; supplement E.3–E.4).

### Curator Notes

This is specialist visual matching with a learned feature extractor and classical approximate assignment/clustering. Do not promote exact Hungarian substeps to exact QAP solving, strict full-bijection cycle identities to arbitrary missing-node cases, or transductive Willow results to unseen-image generalization. Required keypoints, supplied cluster counts, ImageNet initialization, different joint/pairwise protocols and source-version discrepancies remain important for interpretation and reproduction.

## Reproducibility

- **Publication:** [NeurIPS 2020 proceedings](https://proceedings.neurips.cc/paper_files/paper/2020/hash/e6384711491713d29bc63fc5eeb5ba4f-Abstract.html). Three authors and SJTU affiliations match the reviewed PDF; publisher HTML supplies year-level `citation_publication_date=2020`, so no unverified precise date is added.
- **Reading:** all twelve publisher-paper pages and [eight publisher supplement pages](https://proceedings.neurips.cc/paper_files/paper/2020/file/e6384711491713d29bc63fc5eeb5ba4f-Supplemental.pdf), including the complete derivative, implementation/complexity, detailed conflicting tables, all ablations and bird visualization. Manual Supplemental discovery identifies this scientific PDF; its draft-style numbering/version differences are recorded rather than concealed.
- **Code:** [author ThinkMatch GANN module](https://github.com/Thinklab-SJTU/ThinkMatch/tree/master/models/GANN) and experiment YAMLs were inspected. The current README covers both the NeurIPS paper and a later TPAMI2023 extension, with additional two-graph variants, datasets and pretrained-model links. Current combined results must not automatically be attributed to the 2020 article. Recursive repository inventory contains no extra scientific PDF/ZIP document.
- **Citation graph:** 6 exact catalogue references are supported, including the earlier “Attention solves your TSP” title under the same arXiv 1803.08475 identity as the later attention-model paper. Other similarly named graph/QAP papers are not substituted.
