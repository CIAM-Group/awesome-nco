---
id: coeks
short_title: CoEKS
title: Combination-of-Experts with Knowledge Sharing for Cross-Task Vehicle Routing Problems
authors:
- Zikang Yu
- Jinbiao Chen
- Jiahai Wang
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/4572bc2f514e627914cbe60d0398a2d1-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/4572bc2f514e627914cbe60d0398a2d1-Abstract-Conference.html
institutions:
- Sun Yat-sen University
- National University of Singapore
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Duration Limits
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Mixed Backhauls
- Multi-Depot Vehicle Routing Problem
summary: Constraint-specific encoder experts and first-layer MSE sharing support constructive routing across seven
  trained and nine unseen task combinations; MB/MD zero-shot and adapted extensions are evaluated separately.
code_url: https://github.com/yuzikang0/CoEKS
figure:
  path: paper-assets/coeks/framework.png
  alt: CoEKS encoder with task masks, constraint experts, shared combiners and early-layer mutual distillation.
  caption: 'Figure 2: original formal CoEKS cross-task constructive-routing workflow.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/4572bc2f514e627914cbe60d0398a2d1-Paper-Conference.pdf#page=5
---

# Combination-of-Experts with Knowledge Sharing for Cross-Task Vehicle Routing Problems

> **TL;DR:** CoEKS replaces encoder feed-forward layers with constraint-specific experts. A shared capacity expert, task-masked combiners and early-layer mutual distillation support a shared constructive routing policy. Unseen combinations are evaluated without retraining; newly added experts and adaptation layers are fine-tuned for new constraints, with separate zero-shot multi-depot tests.

## Motivation

Routing tasks are combinations of constraints. CoEKS argues that fully shared networks can suffer negative transfer, while generic node-level MoE routing does not explicitly align experts with the constraints defining a task. It assigns experts to known constraints and shares some representation/combiner knowledge to improve composition. These motivations do not establish that generic MoE experts necessarily lack useful task-level information. [pp. 1–3]

## Contributions

- Five encoder experts correspond to capacity C, open routes O, backhauls B, route-duration limits L and time windows TW. C is always present; a known task mask determines the eligible experts.
- Combines expert-view mutual distillation with combiner-view knowledge sharing through a low-rank residual transformation.
- Tests seven trained tasks, nine unseen combinations, eight mixed-backhaul variants and 24 multi-depot variants, distinguishing zero-shot tests from fine-tuned extensions. [pp. 4–9, 14–15, 22–23]

## Methodology

The six-layer, 128-dimensional encoder has eight attention heads and 512-dimensional expert FFNs. Each node receives a softmax-weighted sum over the experts selected by its instance's constraint mask. The combiners see a shared residual bottleneck MLP with rank 16 in the release. The ReLD-based decoder combines current-node embeddings and dynamic vehicle state, then applies feasibility masks and clipped pointer logits to construct routes. POMO-based REINFORCE, mixed-task batches and RouteFinder reward normalization train the model. [pp. 4–6, 15–17]

**Mutual distillation is an MSE feature loss, not KL distillation between action distributions.** It is zero with one active expert, pairwise MSE with two, and mean MSE to the active-expert mean with more than two. Only the first encoder layer applies it, with weight 0.01. Deeper-layer distillation or excessive strength can worsen held-out-task results. The t-SNE plots illustrate representational differences; they do not prove causal necessity or guarantee specialization. [pp. 5–6, 8–9, 21–23]

**Classification:** Generalist / constructive. One trained neural model handles multiple native routing variants by selecting known constraint experts; it does not learn to edit a complete incumbent. Size-50/100 models, POMO/ReLD backbones, seven-task/all-16 training runs and adapted extensions are separate configurations. Backhaul B requires deliveries before pickups; MB permits interleaving. This is not paired pickup-and-delivery with request precedence. [pp. 3–6, 14–18]

## Experiments

| Stage | Reported protocol |
| --- | --- |
| Base training | CVRP, OVRP, VRPB, VRPL, VRPTW, OVRPTW and OVRPL; 300×100,000 = 30 million instances; batch 256/128 at sizes 50/100 |
| Optimization | Adam 3×10⁻⁴, learning-rate ×0.1 at epochs 270/295; one RTX 3090 and Ryzen 5 3600 |
| Main testing | 1,000 instances per task; greedy multi-start decoding with eight geometric augmentations; nine unseen constraint combinations |
| Classical references | PyVRP and OR-Tools, 10/20-second limit per size-50/100 instance; one CPU core per instance |
| MB extension | Add an MB expert/combiner and EAL input adaptation; 10×10,000 = 100,000 fine-tuning instances on VRPMB and VRPMBTW |

- **Seen tasks:** Mean reported gaps are 1.751%/2.646% at sizes 50/100, versus ReLD-MoEL's 1.902%/2.852%. CoEKS is best among neural methods in 10/14 cells, rather than all. CaDA is better on time-window cases: VRPTW100 is 2.721% versus CoEKS's 3.433%, and OVRPTW100 is 1.990% versus 2.633%. [pp. 6–7]
- **Unseen combinations:** Mean gaps 3.432%/5.857% improve on the strongest reported mean, ReLD-MoEL's 4.202%/6.735%, by approximately 18.3%/13.0% relatively. Some task cells still lose: VRPBL50 is 4.387% versus 4.130% for ReLD-MoEL; VRPLTW50 is 2.949% versus CaDA's 2.514%. This is aggregate improvement over the listed models, not uniform dominance. [p. 8]
- **New constraints:** MB fine-tuning freezes the previously trained parameters while learning the new expert/combiner and accommodating new input attributes with EAL. Initializing from shared components often helps but is not uniformly superior to random initialization: VRPMBTW's reported gaps are 1.97% versus 1.92%. Appendix E.3 additionally reports both zero-shot MD tests without adding experts and separately fine-tuned MD results; the MD training-task selection and budget are not fully specified there. It should not inherit the MB budget by assumption. [pp. 7, 9, 17–18, 22–23]
- **Backbones and cost:** POMO and ReLD versions are trained separately. At matched total parameters, both CoEKS and ReLD-MoEL-E5 have about 4.6 million parameters; the latter's active-expert count is adjusted for the comparison. CoEKS improves the OOD mean, but VRPBL50 is 4.387% versus E5's 4.323%. Main size-100 inference is roughly 8–10 seconds per 1,000 instances, versus RF-TE's 6–8 seconds; it is not uniformly the fastest neural model. [pp. 7–9, 19–21]
- **Large Set-X:** Across 32 listed instances with 502–1,001 nodes, the size-100 multi-task model averages 10.832%, versus ReLD-MoEL's 11.590% and RF-TE's 14.931%. Individual failures include X-n502-k39 at 6.820% versus RF-TE's 4.149%, and X-n548-k50 at 18.933% versus ReLD-MoEL's 14.326%. [pp. 23–24]

## Limitations

### Reported by the Authors

- Adding constraint experts increases the parameter count. More efficient sharing or parameterization is proposed as future work.
- Training and fine-tuning task composition matters: OVRPL is added to stabilize O/L interactions, and VRPMBTW is added because MB-only adaptation generalizes poorly to time-window combinations. [pp. 10, 17–19]

### Curator Notes

- The main seven-task split, all-16-task retraining, MB adaptation and MD zero-shot/adapted evaluations answer different questions. The article's 48-task coverage does not mean one unchanged checkpoint solves all 48 with the reported adapted quality.
- Gaps against time-limited heuristic references are not certified optimality gaps. Several classical objective/reference/gap cells do not directly reproduce a ratio of displayed means, and the MB reference costs in Tables 3/6 appear under swapped VRPMBL/VRPMBTW columns. The note preserves the reported rows without inventing corrected reference values or instance-level results.
- The current code evaluates every expert FFN before weighting its output with the task mask. Masked-out outputs therefore do not imply that their forward computation is skipped. Active-parameter comparisons alone do not establish equal wall-clock cost.
- Current public scripts principally expose the five-expert base model. Explicit new-expert freezing/fine-tuning entry points were not confirmed in that archive, so paper-described adaptation is not presented as independently reproduced. The poster also prints an unnormalized MSE sum for more than two experts; the formal paper and code use the mean described above.

## Reproducibility

- **Published paper:** [ICLR 2026](https://proceedings.iclr.cc/paper_files/paper/2026/hash/4572bc2f514e627914cbe60d0398a2d1-Abstract-Conference.html), published 2026-04-20. All 24 formal pages, complete references and Appendices A–F were read, including every detailed result row and all eight figures.
- **Official materials:** [Source and models](https://github.com/yuzikang0/CoEKS) and [official poster](https://iclr.cc/virtual/2026/poster/10007700). The full poster was visually read, including the MSE-normalization difference. The 461-member source archive has no additional scientific PDF, notebook, nested archive, slide deck or video. Publisher and event links were checked; OpenReview API retrieval returned 403 and was not counted as read content.
- **Implementation checks:** Read task-mask construction, expert/combiner forward computation, rank-16 residual sharing, exact MSE cases, first-layer auxiliary-loss aggregation, base train configurations and policy settings. The K=2 code multiplies variance-to-mean by four to recover the formal pairwise MSE. Full training and benchmark reproduction were not performed.
- **Relations and figure:** Links derive from explicit reference entries. Earlier RouteFinder and variant bibliography titles/venue errors are qualified without changing the target's verified formal identity. The framework image is the original formal Figure 2.
