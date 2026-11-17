---
id: mixed-curvature
short_title: Mixed-Curvature
title: A Mixed-Curvature based Pre-training Paradigm for Multi-Task Vehicle Routing Solver
authors:
- Suyu Liu
- Zhiguang Cao
- Shanshan Feng
- Yew-Soon Ong
year: 2025
date: '2025-10-06'
venue: ICML
paper_url: https://proceedings.mlr.press/v267/liu25b.html
institutions:
- Nanyang Technological University
- Singapore Management University
- Agency for Science, Technology and Research (Centre for Frontier AI Research / Institute of High Performance Computing)
scope: generalist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Duration Limits
- Vehicle Routing Problem with Mixed Backhauls
summary: Learnable mixed-curvature feature transforms and inter-layer mixing augment shared multi-task VRP policies;
  distinct protocols separate six/sixteen trained variants from zero-shot combinations and target-task adaptation.
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/liu25b.html
code_url: https://github.com/lsyysl9711/Mixed_Curvature_VRPs
figure:
  path: paper-assets/mixed-curvature/framework.png
  alt: Original product-curvature embedding, encoder feature mixture and routing decoder.
  caption: 'Figure 2: mixed-curvature feature modules inserted into existing routing backbones; original ICML figure.'
  source_url: https://raw.githubusercontent.com/mlresearch/v267/main/assets/liu25b/liu25b.pdf#page=4
---

# A Mixed-Curvature based Pre-training Paradigm for Multi-Task Vehicle Routing Solver

> **TL;DR:** Learnable product-space curvature and an inter-layer feature mixture augment existing multi-task VRP solvers. The paper studies two separate training protocols; its eight new mixed-backhaul tasks require adaptation, and improvements are not uniform across backbones or distributions.

## Motivation

Existing multi-task routing encoders process hidden features in Euclidean space. The authors motivate richer representations using distributions of Ollivier–Ricci curvature on five-nearest-neighbour diagnostic graphs. The routing inputs and distance objectives themselves remain Euclidean, and the solver still receives the complete graph. Nonzero curvature of this derived graph is a motivation, rather than a proof that Euclidean neural representations cannot solve the tasks. [pp. 1–4, 14–16, 23–24]

## Contributions

- Adds mixed-curvature transformations to the depot/customer embeddings and to existing encoder layers, rather than replacing the routing decoder or introducing a new problem objective.
- Splits 128-dimensional features into eight 16-dimensional subspaces, each with a trainable curvature initialized at zero. Hyperbolic, flat and positively curved representations can emerge during training.
- Learns an inter-layer mixture of the previous Euclidean features and logarithm-mapped transformed features. Ablations separately examine parameter count, the mixture and the number of subspaces. [pp. 4–5, 9, 18–22]

## Methodology

1. Map embedded depot and customer features into product manifolds, apply the geometric linear transformations, map them back to the tangent representation, and concatenate the node embeddings.
2. Before each attention block, combine its input with the transformed features using learned coefficients α and β. This is a mixture across representations of the same input, not interpolation between training instances; the coefficients are not constrained to sum to one.
3. Retain the POMO-style autoregressive route decoder, dynamic vehicle-state features and feasibility masks. Train with a REINFORCE objective and the backbone's shared baseline; MoE versions also retain their auxiliary load-balancing loss. [pp. 4–7, 26, 33]

**Classification:** Generalist / constructive. Each multi-task checkpoint handles distinct native constraint combinations. Backbones, training protocols and sizes 50/100 use separate models. The reported 24 variants are the union of a 16-task setting and eight further adapted tasks, rather than 24 tasks solved by one unchanged checkpoint.

## Experiments

| Protocol | Training and transfer | Evaluation |
| --- | --- | --- |
| MVMoE settings | POMO-MTL, MVMoE and MVMoE-Light: six trained variants, ten unseen combinations; 5,000 × 20,000 = 100 million training instances | 1,000 instances per task at 50/100 customers; eightfold geometric augmentation and greedy POMO decoding; two unseen tasks additionally receive 10 × 10,000 adaptation instances |
| Earlier RouteFinder settings | Sixteen trained variants; 300 × 100,000 = 30 million training instances | Sixteen seen tasks and eight new mixed-backhaul variants; EAL adaptation uses 10 × 10,000 target instances |

The hardware configuration lists four RTX A6000 GPUs with 48 GB each. Adam, learning-rate schedules and batch sizes differ between the two protocols. The RouteFinder comparison follows the cited 2024 version; it must not be conflated with the later 48-environment TMLR version. [pp. 6–8, 25–26, 32–35]

- **Seen and unseen synthetic tasks:** Mixed-MVMoE improves the reported gaps across the main Tables 1–2. Other backbones have negative cases: Mixed-POMO-MTL has a 7.831% gap on OVRPB100 versus 7.335% before augmentation. In the RouteFinder protocol, Mixed-MVMoE's CVRP50 gap is 1.265% versus 1.242%, whereas Mixed-RF-TE improves that task from 1.274% to 1.166%.
- **Real-world transfer:** Under the MVMoE protocol, Mixed-POMO-MTL improves the reported mean gap on the listed Solomon instances from 21.380% to 17.84%. On large Set-X instances it changes 16.769% to 16.614%. In the RouteFinder protocol, the seven-set VRPLib average changes from 5.627% to 5.579%, with worse results on sets B, E, M and X. Table 19 lists seven sets despite its caption naming only Set-X.
- **New constraints:** Table 20's mixed-curvature zero-shot model is worse than its original counterpart on all eight new mixed-backhaul targets. The improved Mixed-EAL results follow target-task training; they are not evidence of zero-shot superiority.
- **Ablations and cost:** The added parameters range from 3.57% to 10.56%. Parameter-matched Euclidean controls, removal of the inter-layer mixture, and 4/8/16-subspace comparisons support the architectural study, with exceptions. The added transforms increase inference time; HGS/LKH/PyVRP reference costs are heuristic comparisons, not certificates of optimality. [pp. 6–9, 18–22, 27–29, 34–35]

## Limitations

### Reported by the Authors

- Exponential/logarithmic maps add computation and can cause numerical instability.
- Training/evaluation concentrates on 50/100-customer synthetic instances; approximately 10,000-node settings are not studied.
- The standard configuration fixes subspace dimensions instead of learning an adaptive partition. [p. 9]

### Curator Notes

- Curvature histograms and representation-distortion measurements are diagnostics, not approximation bounds or a proof of geometric necessity. The paper does not establish universal gains across all tasks, backbones or distributions.
- Some printed geometric explanations/formulas need care. The p. 4 statement that the conformal factor decreases as |κ| grows contradicts its displayed expression for fixed valid x and κ < 0. At x = 0, printed Eq. (18) points along −y, so it is not the inverse of the displayed positive-direction exponential map. The released implementation calls Geoopt's stereographic maps; these printed issues do not establish that the experiments used the faulty formulas.
- Current public code has a separate reproducibility issue: `MTLModel_Mixed.py` reads undefined `c_list`/`c_list_layer` attributes and passes an extra curvature argument to `StereographicLinear.forward`, whose signature accepts only the features. The MoE implementations use the layer's `.c` parameters instead. This is a static check of the downloaded release, not a rerun or a finding that the historical measurements are invalid.

## Reproducibility

- **Published paper:** [ICML / PMLR 267, pp. 38066–38101](https://proceedings.mlr.press/v267/liu25b.html). All 36 pages, including complete appendices, references and tables, were read. PMLR's `citation_publication_date` is 2025-10-06; the conference took place in July. The previous generic submission/notification dates were removed.
- **Official implementation:** [Mixed_Curvature_VRPs](https://github.com/lsyysl9711/Mixed_Curvature_VRPs), linked from p. 6. The README supplies training commands and dependencies. The downloaded archive contains 278 members, including checkpoints; its only additional PDF is byte-identical to the published 36-page paper. No extra scientific notebook, archive, slides or video was found in that inventory. The publisher page lists only the main PDF; the official conference page supplies an OpenReview link, and the OpenReview API returned 403 during this check.
- **Code coverage:** Read the README, training options, the geometric-map wrapper, mixed-POMO encoder/decoder and geometric linear layer, and checked the corresponding mixed-MoE parameter/mixing calls. No training or full benchmark reproduction was performed. Match the backbone, protocol, sample budget, target adaptation and runtime accounting before comparing results.
