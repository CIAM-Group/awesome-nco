---
id: hncs
short_title: HNCS
title: Hierarchical Neural Constructive Solver for Real-world TSP Scenarios
authors:
- Yong Liang Goh
- Zhiguang Cao
- Yining Ma
- Yanfei Dong
- Mohammed Haroon Dupty
- Wee Sun Lee
year: 2024
date: '2024-08-07'
venue: KDD
paper_url: https://doi.org/10.1145/3637528.3672053
arxiv_url: https://arxiv.org/abs/2408.03585
institutions:
- GrabTaxi Holdings Pte. Ltd.
- National University of Singapore
- Singapore Management University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: A current-node-conditioned diagonal hypernetwork changes next-node attention, while learned soft-cluster
  embeddings track unvisited cities; map-specific TSP100 experiments evaluate this hierarchical representation without
  partitioning and merging independent local tours.
figure:
  path: paper-assets/hncs/framework.png
  alt: A Transformer encoder feeds an EM-inspired cluster-representation layer and an autoregressive decoder with
    a local hypernetwork choice layer.
  caption: 'Figure 4: HNCS hierarchically represents unvisited cities and conditions the next-node decoder on the
    current location.'
  source_url: https://arxiv.org/pdf/2408.03585v1#page=4
publication:
  date: '2024-08-24'
  source_url: https://api.crossref.org/works/10.1145/3637528.3672053
---
# Hierarchical Neural Constructive Solver for Real-world TSP Scenarios

> **TL;DR:** Condition the next-node attention scores on the current location and summarize unvisited cities with several learned soft-cluster embeddings. The hierarchy is a **representation inside one autoregressive tour constructor**, not a partition–solve–merge procedure. Experiments concern100-node subsets drawn from fixed country/PCB maps, with separately trained distribution-specific models.

## Motivation

Uniformly random coordinates do not capture the recurring location structure of deliveries over a fixed service area. The proposed scenario starts from a fixed map of M locations and repeatedly samples100-location orders. The paper observes local-choice errors and routes that leave a region before visiting other nearby locations, motivating a richer representation of the current location and unvisited set. This is a controlled real-coordinate distribution, not an operational road-network delivery model with travel-time or service constraints. [Sections1–3/Figures1–3.](https://arxiv.org/pdf/2408.03585v1#page=1)

## Contributions

- A diagonal hypernetwork modifies compatibility between the current query and candidate node embeddings.
- An EM-inspired attention layer learns a small set of latent cluster representations rather than a single pooled global vector.
- Decoding subtracts the visited node's weighted contribution from those representations, providing a changing unvisited-set context.
- A fixed-map TSP100 benchmark tests the architecture under abundant and limited training data, with uniform and PCB-coordinate controls.

## Methodology

### Current-location-conditioned choice

A standard Transformer encodes every node, and a masked autoregressive decoder selects unvisited nodes until the tour is complete. The proposed hypernetwork outputs d scaling coefficients rather than an expensive d-by-d matrix. Elementwise multiplication rescales the query before its dot product with candidate keys, followed by tanh clipping and softmax. This is a learned feature-space preference; it does not explicitly mask every nonlocal node or force contiguous geographic clusters. [Equations10–13.](https://arxiv.org/pdf/2408.03585v1#page=4)

The prose/Equation12 conditions the hypernetwork on query Q, while Algorithm2 describes the current-node embedding as input. Without inspected implementation, the note retains the shared current-location-conditioning principle instead of resolving these two shorthand descriptions by assumption.

### Hierarchical unvisited-set representation

Five learned prototype embeddings interact with encoded nodes through attention-based soft assignments. The same clustering layer is applied five times; assignment-weighted node sums update prototypes with a residual connection and LayerNorm. During route construction, the selected node's weighted embedding is subtracted from each cluster representation. Concatenated cluster features and the current node are linearly combined, with the start-node embedding added separately, to form the next decoder context. [Equations18–23/Algorithms1–2.](https://arxiv.org/pdf/2408.03585v1#page=5)

The analogy to EM concerns alternating soft assignments and weighted updates. The actual learned attention/residual/normalization layer is not classical Gaussian-mixture EM, and the paper supplies no likelihood-monotonicity or optimal-clustering guarantee. Nor should a normalized/residual prototype automatically be identified with an exact arithmetic sum of remaining raw node embeddings.

The model keeps all nodes in the global constructive process. It neither solves each soft cluster as an independent TSP nor joins completed local routes. Masking avoids revisiting selected cities. The method is **specialist/constructive**: one problem family, separate distribution-specific training and no proposed neural operator that edits a complete incumbent.

### Training and inference convention

All compared neural models use POMO's shared-baseline training, six encoder layers, two decoder layers, batch128, Adam learning rate.0001 and weight decay.000001. The paper specifies clipping at10 and an epoch budget of100,000 episodes for200 epochs. The main renewed-data setting therefore presents20M sampled instances per model; the random-sampling description does not prove all sampled subsets are unique. Prototype count5 and iteration count5 are selected using a1,000-instance validation set. [Section4.3/AppendixA.1.](https://arxiv.org/pdf/2408.03585v1#page=7)

POMO-style starting-point rollouts and eight coordinate permutations/reflections provide the augmentation convention. These are independent construction trajectories rather than ordinary beam search with a retained frontier. The paper does not fully specify every test sampling/greedy/batch detail, hardware configuration or independent training seed. Equation8 describes maximizing return but calls R positive tour length; minimizing length requires the appropriate negative reward or minimization sign. No public implementation was identified here to resolve that notation.

## Experiments

### What the data actually contains

Country bases are USA13509, Burma BM33708 and Japan JA9847. Each is normalized into a unit square; train/test instances sample100 locations from that same underlying map, with10,000 held-out instances and Concorde reference tours. This tests new subsets of a known map, not transfer to an unseen country. Normalization and Euclidean-coordinate objectives are part of the setup. The PCB3038 experiment likewise samples100-hole subsets from the3,038-location base; it does **not** solve the full3,038-node board as one test instance. [Section4.1.](https://arxiv.org/pdf/2408.03585v1#page=6)

The evaluation gap is the **ratio of mean predicted tour length to mean reference length**, minus one. It is not generally identical to averaging each instance's percentage gap. Comparison models are reimplemented and retrained on the proposed distributions. ELG uses the authors' recommended50-neighbor local policy, but is trained using POMO's baseline rather than its original training algorithm. Thus this isolates architecture under a modified common protocol rather than reproducing every method's strongest native configuration. [Sections4.2–4.4.](https://arxiv.org/pdf/2408.03585v1#page=7)

### Main results and budgets

| TSP100 distribution | HNCS gap | HNCS augmented gap | Strong comparison augmented gap |
| --- | --- | --- | --- |
| Uniform |.6397% |.2063% |ELG.2734% |
| USA |.6024% |.5762% |Sym-NCO.7219% |
| Japan |.2741% |.2670% |Sym-NCO.4421% |
| Burma |.7261% |.6166% |Sym-NCO.6683% |
| PCB3038 subsets |.7236% |.2746% |ELG.6876% |

HNCS improves the listed neural comparators under this protocol, with the closest country margin on Burma. Its Table3 runtimes are3min03s/2min51s/3min06s for the **whole10,000-instance** USA/Japan/Burma sets, compared with POMO2min46s/2min38s/2min55s. These are not per-instance times. Concorde is used to establish the reference solution; the quality table does not show a neural tour shorter than the optimum. A faster approximate GPU-style pipeline versus exact solution time is not proof of superiority over all classical heuristics. Hardware provenance is insufficiently specified for a general speed claim. [Tables2–5.](https://arxiv.org/pdf/2408.03585v1#page=8)

AppendixA.3 compares GLOP using25/50-node local solvers to the map-trained100-node HNCS. Augmented gaps are.8799/.5762% USA,1.4094/.2670% Japan and.9822/.6166% Burma, with GLOP around6min and HNCS around3min per set. The training-distribution/local-solver difference limits conclusions about universal architecture dominance. [Table7.](https://arxiv.org/pdf/2408.03585v1#page=12)

### Ablations and important negative cases

On USA, POMO's unaugmented1.3334% gap improves to.8300% with the choice hypernetwork, then.7807% with average unvisited tracking and.6024% with soft-cluster tracking. Replacing the conditional hypernetwork with freely learned, nonconditioned coefficients worsens gap to2.1038%. This supports conditioning and richer tracking in the tested model; it does not prove every soft cluster is geographically correct. The t-SNE visualization is qualitative evidence of latent organization. [Table4/Figure7.](https://arxiv.org/pdf/2408.03585v1#page=8)

Limited-data experiments repeat fixed50,000- or10,000-instance datasets for200 epochs, unlike newly sampled100,000-instance epochs in the main setting. The corresponding totals are10M or2M presentations, so dataset diversity and total training presentations both change. With10,000 fixed instances, ELG beats HNCS on all three countries: augmented gaps2.7782vs3.3265% USA,1.4779vs1.7016% Japan and2.2109vs2.8393% Burma. Even at50,000, Japan's augmented ELG.4627% is marginally better than HNCS.4629%, despite the prose's general statement that ranking is retained. [Figure6/Table6.](https://arxiv.org/pdf/2408.03585v1#page=9)

## Limitations

### Discussed in the Paper

The model needs more data than ELG in the smallest fixed-dataset setting. The authors attribute this to learning locality in latent space instead of using explicit handcrafted polar features. Combining the designs with other solvers is suggested, but no such combined result is established here.

### Curator Notes

- All demonstrated tours have100 nodes; country-base size and PCB3038's name are not solved-instance size. No large-scale or unseen-map transfer experiment is established.
- The latent hierarchy does not eliminate dense Transformer attention or impose provably correct tour partitions. EM inspiration is not an EM convergence guarantee.
- Main gap improvements do not establish universal superiority over classical methods, independent training seeds or native ELG training. Hardware and complete inference details are not documented sufficiently for exact timing reproduction.
- Table6's Burma10K HNCS tour length5.5157 is inconsistent with its printed2.9934% gap and reference5.0019; the note retains the reported gap as source data without inventing a corrected length. Japan/Burma map labels also contain table typos. Table7's Japan/Burma times differ slightly from Table3 and are not merged into one exact runtime.
- The claim that the learned choice function is a superset of ELG is an architectural intuition here, not a demonstrated approximation theorem or uniform performance guarantee.

## Reproducibility

- **Reading:** all12 pages of the identified arXivv1 dated7August2024, including full36-item bibliography and AppendixA.1–A.3, freshly read. Figure4, Algorithms1–2 and all principal result/ablation tables were visually inspected.
- **Formal metadata:** the manuscript identifies the KDD2024 article, six authors and DOI. Crossref verifies electronic publication24August2024 and print25August2024; edition year remains2024. The SMU institutional record independently confirms the published article and pages884–895. GrabTaxi and Singapore Management University were added to the incomplete NUS-only affiliation list. Generic conference-notification acceptance dating was removed.
- **Scientific inventory:** ACM publisher access returned403. ArXiv has only the identifiedv1, containing all named scientific AppendixA material. The SMU institutional article record and author's publication/news page were inspected; they identify the paper and expose no separate named scientific attachment or linked implementation for this work. No unavailable publisher attachment was claimed as read.
- **Code and omissions:** no official implementation/checkpoint link was identified in the complete paper, arXiv metadata, institutional record or inspected author page. Consequently the reward sign/query notation, normalization/subtraction implementation, test decoder settings and missing hardware details cannot be settled by a claimed code check. No training or benchmark rerun was performed.
- **References:** explicit numbered in-text occurrences were matched to the complete bibliography. Early AM/EAS/ELG/GCN/DIFUSCO preprint years remain the versions actually cited; comparing a model does not by itself establish architectural derivation. Uncatalogued2-opt/PDP works are not forced onto different stable IDs.
- **Figure:** original full Figure4, PDFpage4, cropped from the read manuscript. [Formal article](https://doi.org/10.1145/3637528.3672053); [institutional publication record](https://ink.library.smu.edu.sg/sis_research/9334/).
