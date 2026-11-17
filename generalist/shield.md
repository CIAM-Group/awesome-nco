---
id: shield
short_title: SHIELD
title: 'SHIELD: Multi-task Multi-distribution Vehicle Routing Solver with Sparsity and Hierarchy'
authors:
- Yong Liang Goh
- Zhiguang Cao
- Yining Ma
- Jianan Zhou
- Mohammed Haroon Dupty
- Wee Sun Lee
year: 2025
date: 2025-06-10
venue: ICML
paper_url: https://proceedings.mlr.press/v267/goh25a.html
arxiv_url: https://arxiv.org/abs/2506.08424
institutions:
- National University of Singapore
- GrabTaxi Holdings
- Grab-NUS AI Lab
- Singapore Management University
- Massachusetts Institute of Technology
- Nanyang Technological University
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
summary: A shared constructive VRP policy uses query-level mixture-of-depths decoding and task-conditioned context
  clusters to generalize across six trained and ten unseen routing variants and country-point distributions.
figure:
  path: paper-assets/shield/framework.png
  alt: SHIELD map/task sampling, MoE encoder, context clustering and MoD autoregressive decoder.
  caption: 'Figure 1: original formal SHIELD data-generation, model and evaluation framework.'
  source_url: https://raw.githubusercontent.com/mlresearch/v267/main/assets/goh25a/goh25a.pdf#page=4
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/goh25a.html
---

# SHIELD: Multi-task Multi-distribution Vehicle Routing Solver with Sparsity and Hierarchy

> **TL;DR:** A shared constructive routing policy combines a mixture-of-experts encoder, dynamically skipped decoder layers and learned context clustering. Six routing tasks and three country point maps are used in training; ten unseen constraint combinations and six held-out maps test generalization. The maps supply Euclidean point coordinates, rather than road-network travel times.

## Motivation

Multi-task routing policies can generalize poorly when both constraints and customer-coordinate distributions change. SHIELD studies these two axes jointly. Its Multi-Task Multi-Distribution VRP samples subsets of fixed country-map point sets, rather than relying entirely on uniformly distributed synthetic locations. These are geographical point distributions with Euclidean costs; the experiments do not establish performance on operational road-network logistics. [pp. 1–3, 6, 16–18]

## Contributions

- Defines a task/distribution split with six trained routing variants, ten held-out constraint combinations, three training maps and six held-out maps.
- Uses three Mixture-of-Depths decoder layers to allocate computation selectively to contextual query tokens, alongside a six-layer MoE encoder.
- Learns five context clusters and task-conditioned cluster summaries, updating their contributions as customers are visited. The resulting hierarchy provides additional local context for next-action selection. [pp. 3–6]

## Methodology

The encoder has four experts with top-two routing. The decoder uses 128-dimensional embeddings, eight attention heads and 512-dimensional feed-forward layers. In each of its three MoD layers, approximately 10% of the contextual query tokens receive the layer computation; the other queries follow a residual skip. These contextual tokens correspond to the routing agents/current states. All node embeddings remain available as attention keys and values. This is not a k-nearest-neighbor graph or a rule that discards all distant unvisited nodes. [pp. 4–5, 14–15]

Five learned cluster centers undergo five EM-inspired soft-clustering passes. Task attributes for open routes, time windows, duration limits and backhauls condition the centers and their weighted node aggregates. Visited-node contributions are subtracted during decoding. The contextual query combines these summaries with the last/first-node information and current vehicle state. The clustering is a learned pseudo-EM mechanism; no likelihood-convergence guarantee is established. Feasibility masks and POMO REINFORCE with a shared baseline train autoregressive construction. [pp. 4–5, 13–15]

**Classification:** Generalist / constructive. A model shares parameters across CVRP, OVRP, VRPB, VRPL, VRPTW and OVRPTW; ten other combinations are unseen in training. Size-50 and size-100 models are trained separately. Backhauls use signed demands and allow interleaved delivery/pickup customers, without paired-request precedence. The single-task and uniform-distribution ablations are separately trained models. [pp. 2–3, 6, 13, 22–23]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Training | 1,000 epochs × 20,000 instances = 20 million per model; batch 128; Adam 10⁻⁴; one A100 80 GB; separate size-50/100 models |
| Task split | Six trained tasks and ten unseen constraint combinations |
| Map split | Train: USA13509, JA9847, BM33708; held out: KZ9976, SW24978, VM22775, EG7146, FI10639, GR9882 |
| Main tests | 1,000 instances per map/task; eight geometric augmentations with best selection |
| References | Classical solver limits 20/40 seconds per size-50/100 instance; 80 seconds at size 200; reference identity has the discrepancy described below |

- **Task and map transfer:** At size 100, reported mean gaps on trained tasks/held-out maps are 3.1638% for SHIELD versus 4.6855% for MVMoE. On unseen tasks/held-out maps they are 6.2727% versus 8.5140%. These are improvements over the reported heuristic references, rather than certified optimality gaps. [pp. 6–7]
- **Cost tradeoff:** Full SHIELD has 4.59 million parameters, versus 4.46 million for depth-matched MVMoE-Deeper and 3.68 million for MVMoE. The reported 106.72 GFLOPs cover the encoder plus one decoder step, including forward and backward computation; they are not full-inference FLOPs. Mean test times are 6.16/20.07 seconds at sizes 50/100, versus MVMoE's 3.72/11.21 seconds. Sparsity does not make the full method uniformly smaller or faster. The deeper baseline is slower at size 50 and runs out of memory at size 100 under the reported configuration. [pp. 7–8]
- **Scale transfer:** Size-100 checkpoints are tested directly at 200 nodes. On unseen tasks/held-out maps, SHIELD reports 7.8179% versus MVMoE's 10.5085%; times are 47.92 versus 45.23 seconds. Larger batches are possible for SHIELD in this setting, so batching also affects this comparison. [pp. 9, 20]
- **CVRPLib:** Mean gaps on the 28 listed Set-X instances with 101–251 nodes are 4.6437% versus MVMoE's 6.0845%. On 32 instances with 502–1,001 nodes they are 9.8164% versus 14.9631%; the MoD-only ablation is close at 9.8527%. Individual losses remain: on X-n190-k8, SHIELD is 4.8410% versus MoD's 2.5736%. These aggregate results do not imply instancewise dominance. [pp. 20–22]
- **Ablations:** Routing 10% of queries and using five centers favor held-out performance, whereas some higher routing fractions or ten centers give better in-domain cells. The inference-width study uses 100 instances per problem, a separate subset from the main 1,000-instance tests. [pp. 7–8, 23–24]

## Limitations

### Reported by the Authors

- The VC-dimension motivation uses an arithmetic-operation bound that the authors explicitly say is not strictly applicable to exponential operations. It motivates architectural regularization; it is not a routing approximation or generalization guarantee.
- The conclusion identifies further size generalization as an ongoing direction. Coverage remains limited to the encoded constraint vocabulary and evaluated map distributions. [pp. 4, 9]

### Curator Notes

- There is no learned incumbent-improvement phase in the evaluated SHIELD pipeline. Decoder sparsity concerns contextual queries and must not be described as neighborhood pruning.
- The main text and experimental-detail prose say HGS is used for CVRP and VRPTW, whereas the detailed Tables 14–22 label VRPTW's reference as OR-Tools. The source does not resolve this identity discrepancy. The reported reference-based gaps should retain that qualification.
- Appendix F defines gap as a ratio of mean lengths, but some displayed objective/reference/gap cells do not reproduce that ratio. For example, BM33708 CVRP50 lists reference 6.5032 and SHIELD 6.4843 while reporting +1.1648%. An undisclosed aggregation convention or table error could explain this; the note preserves the published values without inventing corrected results.
- Country point maps do not provide asymmetric street distances, traffic or real customer-service measurements. Separate synthetic/single-task runs and different-size checkpoints should not be combined into a claim that one unchanged checkpoint was evaluated in every protocol.
- Reported quality and timing comparisons depend on augmentation, batch sizes and CPU/GPU configurations. No independent full training or benchmark reproduction was performed.

## Reproducibility

- **Published paper:** [ICML 2025 / PMLR 267](https://proceedings.mlr.press/v267/goh25a.html). All 33 formal pages, complete references, Appendices A–S, Tables 1–22 and Figures 1–6 were read. Rotated detailed tables were additionally read in PDF block order and visually checked. The publisher records 2025-10-06; the [arXiv history](https://arxiv.org/abs/2506.08424) begins on 2025-06-10. A generic conference notification date was removed.
- **Supplement inventory:** The publisher exposes the complete 33-page paper without a separate scientific supplement. The complete [official ICML poster](https://icml.cc/virtual/2025/poster/46391) was visually read; it repeats the architecture, principal results and ablations. Publisher, event, OpenReview access and author publication pages were checked for additional materials.
- **Code:** No author-maintained implementation or pretrained checkpoint was confirmed from those primary sources. No speculative repository link is added.
- **Relations and figure:** Relations come from explicit bibliography entries, with earlier RouteFinder, BQ-NCO and RRNCO versions identified separately from their later formal representatives. The displayed framework is the original formal Figure 1, rather than a generated diagram.
