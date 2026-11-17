---
id: seedgnn
short_title: SeedGNN
title: 'SeedGNN: Graph Neural Network for Supervised Seeded Graph Matching'
authors:
- Liren Yu
- Jiaming Xu
- Xiaojun Lin
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/yu23h.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/yu23h.html
institutions:
- Purdue University
- Duke University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Seeded Graph Matching
summary: Pairwise witness aggregation and confidence-weighted assignment propagation learn seeded graph matching
  that transfers across graph sizes and datasets.
code_url: https://github.com/Leron33/SeedGNN
---

# SeedGNN: Graph Neural Network for Supervised Seeded Graph Matching

> **TL;DR:** Pairwise witness aggregation and Hungarian-filtered confidence propagation learn seeded graph correspondence, transferring a mixed graph-trained model to new sizes and visual shapes; theory and current released code require careful qualification.

## Motivation

Training a separate node-embedding network from a few seeds on each test pair can fail when non-topological features are uninformative. SeedGNN instead learns from many graph pairs with full correspondence labels, then uses a small supplied seed set on an unseen pair. Hand-designed witness-count/percolation algorithms motivate its architecture, without making the trained network a universally exact graph matcher (Sections 1-3).

## Contributions

- Encode seeds as scalar indicators for source-target node pairs, avoiding a learned input dimension tied to the number of seeds.
- Aggregate pairwise neighborhood information to obtain multi-hop witness-like features, then propagate Hungarian-filtered matching confidences as new seeds.
- Demonstrate graph-size/type transfer and refinement of seedless visual matching; provide a simplified correlated-random-graph comparison with normalized aggregation.

## Methodology

**Task and supervision.** Given two graphs and known seed correspondences, predict an injective ground-truth node map. Training examples contain graph pairs, initial seeds and complete target mappings; the small test seed fraction does not mean training uses only that fraction of labels. The base SeedGNN uses topology and seeds, without semantic node features. A separate front-end can provide feature-derived candidate seeds for visual matching (Sections 3/6.2).

**Pairwise convolution.** A scalar indicator initializes each node-pair representation. Aggregation on the graph-pair product counts compatible neighboring pairs; compute it as A1 S A2 instead of materializing the Kronecker graph. Per-pair neural transformations combine witness information at multiple hops. The reported model has six layers, hidden width sixteen and two-layer ReLU transformations (Sections 4.1-4.2/6.1).

**Percolation and decoding.** Average row-wise and column-wise softmax similarities. Hungarian finds a maximum-score injective assignment; mask similarities by that assignment, concatenate the retained confidences with local features and continue to the next layer. Every layer can revise its newly generated matches. The paper sums supervised binary cross-entropy over true and fake pairs at all layers and uses the final assignment for prediction. Hungarian is exact for the learned linear score, not for the original graph-matching QAP or correctness of the inferred correspondence (Sections 4.3-4.4).

**Theory with its actual conditions.** Section 5 analyzes a simplified two-layer model whose second layer uses only first-layer percolation output. Graphs follow a correlated Erdős-Rényi model; train/test share p, edge retention s and seed rate, varying graph size. With beta denoting the correct fraction of first-layer matches, Theorem 5.1 reports a sufficient beta proportional to log(n)/(n p s squared) for its SeedGNN abstraction, compared with an additional square-root(log(n)/(n s squared)) requirement for an NGM-like normalized abstraction, subject to its degree/Lipschitz bound. These are sufficient-condition comparisons, not lower bounds proving real NGM failure or a guarantee for the trained six-layer network.

Appendix B.2 further idealizes correct new-seed confidence as one and incorrect confidence as 1/n, then approximates witness counts by binomials. It does not derive that perfect confidence separation, favorable learned readout behavior or independence of graph-dependent selected seeds from arbitrary training. Those assumptions/approximations must remain visible; the proof is not an unconditional learned-model recovery theorem.

## Experiments

**Mixed training and transfer.** The stated training set uses 100 correlated ER pairs of size 100 across p=0.1/0.3/0.5 and s=0.6/0.8/1, plus ten Facebook network examples, with seed fraction 0.1. Adam at 0.01 trains 500 epochs in about twelve hours on an i7-8750H CPU, requiring 2.68GB training memory. ER tests use 500 nodes, including much sparser p=0.01. Facebook splits ten institutions for training/ninety for testing; training parents are downsampled, and edges/nodes are independently sampled to construct correlated pairs. These are constructed graph pairs with known mappings, rather than unpaired naturally occurring cross-platform identities (Section 6.1; Appendix D.1).

**Shapes and accuracy.** The same SeedGNN training excludes SHREC'16, whose meshes have approximately 8,000-11,000 nodes. At 1% seeds, matching accuracy is 43.1 +/- 8.5% versus adapted NGM 37.9 +/- 5.7 and DGMC 23.2 +/- 6.8. The numbers do not establish exact recovery or statistical significance without an appropriate comparison test. Facebook performance is described as comparable to SGM and saturates near 80%, with roughly 15% of nodes lacking a common neighbor; sparse/no-seed cases remain difficult (Section 6.2/Table 1/Figures 6-8).

**Willow refinement is a separate pipeline.** On supplied keypoints with pretrained VGG16 features, an MLP or DGMC first proposes seeds; the unchanged topology-trained SeedGNN then refines them. MLP alone averages 71.1%, unfiltered MLP+SeedGNN-1 85.6, Hungarian-cleaned MLP+SeedGNN-2 97.5 and DGMC+SeedGNN 98.9. Other published baselines are copied from their respective papers, rather than all rerun under one controlled setting. The combined model's wine-bottle accuracy 99.0 is below DLGM's 99.3 and BBGM's 99.1, despite the higher mean (Table 2).

**Complexity and runtime accounting.** With fixed layers/width, sparse aggregation costs O(n1 n2 dmean), all-pair representations require O(n1 n2) memory, and repeated Hungarian steps give O(n1 n2 squared) time under the stated n1<=n2 convention. Appendix C proposes a faster greedy matcher, which sacrifices exact learned-score assignment and is not the same decoder. On SHREC, the reported SeedGNN runtime is 141.5 seconds versus DGMC 80.2, BBGM 130.1 and NGM 879.2. Semi-supervised baseline times include their per-pair training; supervised times exclude prior offline training. The twelve-hour training cost and 2.68GB memory must not be mistaken for test-time cost/memory on every large graph (Appendix C/Table 3).

**Ablations and limits.** Removing percolation largely fails in the illustrated ER setting, and keeping confidence as well as Hungarian matches improves it. Training only one density or correlation regime causes clear transfer failures; using more training seeds is not uniformly helpful. Layer-wise heatmaps are qualitative evidence for different witness use on fixed examples, not proof that every layer improves accuracy or automatically adapts to all graph distributions (Appendix E).

## Limitations

### Discussed in the Paper

The base method uses topology alone, requires additional supervised training and higher complexity than non-learning alternatives, and could incorporate additional seedless/feature-based insights. Graph matching can also affect user privacy when applied to network de-anonymization (Appendices F-G).

### Curator Notes

This remains specialist graph correspondence despite meaningful transfer across networks and visual shape categories. Few test seeds, full supervised training mappings, pseudo-seeds from another matcher and unrelated native optimization tasks are distinct notions. Quadratic pair storage and repeated assignment remain material scaling limits. The simplified random-graph analysis depends on confidence/selection assumptions that are stronger than the actual architecture alone supplies.

**Current code differs materially from the printed configuration.** The inspected SeedGNN.py uses single linear maps rather than the stated two-layer ReLU modules, scales local/seed channels, clamps supplied seeds, and sums only positive-match log losses rather than the full printed binary cross-entropy. Current train.py defaults are width four, learning rate 0.1 and 200 epochs, versus sixteen/0.01/500 in the paper. Its Facebook loader defaults to a 200-node sample even in TestFacebook and does not use the passed node-retention alpha, so the demo does not directly implement the appendix's full-network sampling protocol. TestWillow supplies seven true seeds instead of reproducing the reported MLP/DGMC noisy-seed pipeline. The current README's Willow results also differ from the formal table. These are reproduction/version discrepancies, not evidence that the published measurements are false.

## Reproducibility

- **Publication:** [PMLR ICML 2023 record](https://proceedings.mlr.press/v202/yu23h.html), pp. 40390-40411. Three authors, Purdue ECE and Duke Fuqua affiliations match. The [publisher source](https://raw.githubusercontent.com/mlresearch/v202/gh-pages/_posts/2023-07-03-yu23h.md) explicitly records issued date 2023-07-03, distinct from the conference dates.
- **Reading/supplements:** all twenty-two publisher PDF pages, including complete references and Appendices A-G, every theoretical proof, runtime/split detail, ablation and witness heatmap. Publisher source extras are empty; normal OpenReview API/API2 checks return 403. Manual official-repository recursive inventory identifies no additional scientific PDF/ZIP supplement beyond the integrated appendices.
- **Code:** [official SeedGNN repository](https://github.com/Leron33/SeedGNN), directly linked in the paper, includes training, graph generation, test scripts and model checkpoints/data instructions. Core architecture/loss, seed handling, graph sampling and test paths were inspected. Reproducing the paper requires resolving the version/configuration differences above; training was not rerun.
- **Citation graph:** explicit exact DGMC, DLGM and CIE-H citations match existing IDs. CIE-H is labeled Yu et al. (2019) in this bibliography, but its title/authors identify the ICLR 2020 work; the incorrect cited year does not create a second paper.
