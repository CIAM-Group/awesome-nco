---
id: practical-vrp-joint-learning
short_title: GCN-NPEC
title: 'Efficiently Solving the Practical Vehicle Routing Problem: A Novel Joint Learning Approach'
authors:
- Lu Duan
- Yang Zhan
- Haoyuan Hu
- Yu Gong
- Jiangwen Wei
- Xiaodong Zhang
- Yinghui Xu
year: 2020
date: '2020-08-20'
venue: KDD
paper_url: https://doi.org/10.1145/3394486.3403356
institutions:
- Zhejiang Cainiao Supply Chain Management Co. Ltd
- Alibaba Group
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Vehicle Routing Problem
- Capacitated Vehicle Routing Problem
summary: A node-edge GCN and GRU construct asymmetric capacitated routes using GIS distances; an auxiliary edge
  classifier learns from the sampled policy routes through joint RL and self-generated supervision.
publication:
  date: '2020-08-20'
  source_url: https://api.crossref.org/works/10.1145/3394486.3403356
figure:
  path: paper-assets/practical-vrp-joint-learning/framework.png
  alt: A shared node-edge GCN feeds sequential route prediction and edge classification, with sampled routes supplying
    edge labels.
  caption: 'Figure 3: GCN-NPEC architecture and the auxiliary self-generated edge-label pathway.'
  source_url: https://doi.org/10.1145/3394486.3403356#page=4
---

# Efficiently Solving the Practical Vehicle Routing Problem: A Novel Joint Learning Approach

> **TL;DR:** GCN-NPEC constructs capacitated routes using directed GIS travel distances. A shared node-edge GCN supports a GRU route policy and an auxiliary edge classifier trained on that policy's sampled routes, combining reinforcement learning with self-generated supervision.

## Motivation

Euclidean distances do not fully represent road travel, including directional asymmetry. The paper considers a static capacitated delivery problem with actual directed travel distances and an objective comprising vehicle fixed costs and travel costs. Historical delivery data supply locations, demands and road-distance information. Obtaining optimal training labels is expensive, motivating policy-gradient construction with an additional learning signal from the policy's own solutions.

## Contributions

- Joint node/edge graph convolution captures coordinates, customer demand, directed road distance and a ten-nearest-neighbour adjacency feature.
- A sequential node decoder constructs routes, while a second decoder predicts their binary edge-incidence matrix.
- Reinforcement and edge-classification losses train the shared representation without requiring optimal route labels.
- Experiments include five fixed-size historical-data-derived sets and a variable-size real-order set, with explicit greedy and beam-decoding comparisons.

## Methodology

**Encoder and actions.** Three GCN layers update node and directed-edge embeddings using neighbourhood aggregation and endpoint/edge information. Node features contain coordinates and demand; edge features contain directed distance and adjacency, with a distinct self indicator. A two-layer GRU with attention selects the next customer or depot. Masks prohibit visited customers and capacity-infeasible choices. The policy constructs complete routes rather than learning edits to an incumbent.

**Joint learning.** REINFORCE uses a greedy rollout baseline. A three-layer edge MLP learns binary incidence labels generated from the route sampled by the node policy. These labels are neither optimal solutions nor an independent expert dataset. The combined objective weights the policy and classification terms equally. Although the edge matrix is discussed as another prediction view, the paper does not fully specify an independent feasible-route extraction algorithm from that matrix; the reported route generation is tied to the sequential decoder.

**Inference.** G selects each action greedily. BM selects the highest-probability sequence from the beam, while BMS chooses the lowest actual-cost candidate within the beam. The latter changes candidate selection and should be distinguished from probability-only beam decoding. The tested method is a specialist constructive solver; proposed pickup/delivery adaptations in the conclusion are not additional evaluated tasks.

## Experiments

- **Data:** Fixed sizes 20/50/100/200/400 use historical delivery locations, GIS distances from Amap, integer demands 1–9 and capacities 30/40/50/60/80. Training/test counts are 50,000/10,000 for the first three sizes and 25,600/5,000 for the last two. VRP-R contains 20–300 customers, with 30,000 training and 10,000 test cases from the first and second halves of September 2019, respectively.
- **Training:** Embedding/hidden width 256, three GCN layers, two GRU layers, 1,000 epochs, batch size 256 except 64 at sizes 200/400, Adam starting at 0.001 with decay 0.96 and floor 0.000003, and gradient clipping at five. Vehicle fixed cost is zero on the five resampled sets and 100 on VRP-R; travel-cost coefficient is one.
- **Quality:** Table 3 reports BMS costs 4.398/7.304/11.186/17.516/25.876 versus OR-Tools 4.420/7.493/11.348/17.995/26.095, all normalized by 100,000. Corresponding reported BMS gaps are −0.50/−2.52/−1.43/−2.66/−0.84%. These are OR-Tools-relative differences, not certified optimality gaps. At size 400, greedy 27.428 and probability-only BM 26.977 are worse than OR-Tools, so the advantage does not apply to every decoding mode.
- **Real orders and convergence:** Table 4 reports GCN-NPEC BMS 129.949 versus node-only GCN 130.634 and OR-Tools 131.596, using the same normalization. Figure 5 shows epoch-wise learning curves for VRP50; faster convergence in epochs does not establish a measured wall-time advantage. Variable-size VRP-R supports a bounded size-generalization observation, not unrestricted arbitrary-size performance.

## Limitations

The paper provides qualitative seconds-versus-hours runtime discussion but no complete numerical runtime table, hardware specification or beam width, limiting controlled efficiency comparisons. OR-Tools is a heuristic reference here; the reported Gurobi time limit is not a general impossibility result for solving small VRPs exactly. Pickup/delivery is discussed as a future adaptation, without experiments establishing handling of varying pickup/delivery loads or precedence constraints.

**Printed inconsistencies:** In Table 3, node-only BM cost 27.037 exceeds the OR-Tools cost 26.095 although the printed gap is −3.60%. At size 100, BM costs 11.276 and 11.266 imply approximately −0.63% and −0.72%, while the table prints −0.06% and −0.07%. Costs and printed percentages should therefore be quoted separately. Equation 18's demand-greater-than-or-equal mask disagrees with the prose's strictly exceeding condition at exact capacity fit; the sign convention of the edge loss also requires care when implementing it. These are statements about the printed source, without an author-code reproduction establishing their implementation impact.

## Reproducibility

- **Full text:** Freshly read all ten pages of the user-provided final KDD 2020 Applied Data Science paper, including 36 references and Appendix A's route visualizations. The original remains in `addpapers`; the cache copy is SHA-registered. Original Figure 3 is cropped from PDF page 4 and visually checked with its caption. All four experimental tables and the relevant method equations were checked against their rendered pages.
- **Metadata:** The formal seven-author PDF and proceedings index take precedence over the accepted-paper web page's incomplete author list. Crossref records online publication on **20 August 2020** and print publication on **23 August 2020**. The generic conference notification deadline is not evidence of this paper's acceptance date and has been removed.
- **Code/supplements:** No author code link or additional scientific supplement is identified in the complete paper. The public `fulcrum-zou/VRP-GCN-NPEC` repository was found as a community implementation; authorship equivalence has not been established, so it is not labelled official code. The ACM attachment inventory was inaccessible, so no claim of exhaustive publisher-attachment absence is made. No optimization or training experiments were rerun.
- **Relations:** Seven exact references match existing repository papers. References to other works with similar topics or generic attention architectures do not create inferred citation edges.
