---
id: mtpomo
short_title: MTPOMO
title: Multi-Task Learning for Routing Problem with Cross-Problem Zero-Shot Generalization
authors:
- Fei Liu
- Xi Lin
- Zhenkun Wang
- Qingfu Zhang
- Xialiang Tong
- Mingxuan Yuan
year: 2024
date: 2024-02-23
venue: KDD
paper_url: https://doi.org/10.1145/3637528.3672040
arxiv_url: https://arxiv.org/abs/2402.16891
code_url: https://github.com/FeiLiu36/MTNCO
institutions:
- City University of Hong Kong
- Southern University of Science and Technology
- Huawei Noah's Ark Lab
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
summary: One POMO-style policy handles five trained capacitated VRP variants and unseen attribute combinations through
  explicit state/mask composition; optional fine-tuning and search have separate budgets.
figure:
  path: paper-assets/mtpomo/framework.png
  alt: Shared attention encoder and decoder with explicit attribute composition supplying state and masks for multiple
    VRP combinations.
  caption: 'Figure 2: task-shared attention architecture and explicit attribute-composition mechanism.'
  source_url: https://arxiv.org/pdf/2402.16891v2#page=4
publication:
  date: '2024-08-24'
  source_url: https://api.crossref.org/works/10.1145/3637528.3672040
---

# Multi-Task Learning for Routing Problem with Cross-Problem Zero-Shot Generalization

> **TL;DR:** MTPOMO jointly trains one attention policy on five capacitated VRP variants and reuses it on unseen combinations of open routes, backhauls, time windows and route-length limits. The network is shared across tasks, while explicit attribute-specific state updates, masks and objective rules supply problem semantics.

## Motivation

Training a separate neural solver for every combination of routing constraints is expensive. Many variants share underlying attributes. The paper learns from individual attribute-bearing problems and tests whether the same policy can compose those attributes at inference, without requiring target-task fine-tuning for its zero-shot results.

## Contributions

- An attention encoder-decoder represents common node features and a dynamic attribute vector.
- Handcrafted attribute procedures combine their feasibility masks and update capacity, time, route length and open-route state.
- POMO-style multi-task reinforcement learning trains on CVRP, OVRP, VRPB, VRPL and VRPTW, then evaluates unseen combinations using the same task-shared checkpoint.
- Experiments distinguish direct transfer, augmented or simulation-guided decoding, and optional target-task fine-tuning.

## Methodology

**Representation and construction.** The encoder has six attention layers, eight heads, 128-dimensional embeddings and a 512-dimensional feed-forward layer, with instance normalization. It encodes coordinates, signed demand and early/late time windows once. A masked attention decoder selects the next node, conditioned on the current-node embedding and remaining capacity, current time, route length and open-route indicator. Backhauls are represented through signed demands. This is sequential constructive routing, with no learned incumbent-edit operator.

**Attribute composition.** Explicit problem flags activate deterministic update and feasibility procedures; masks are combined by union. Time-window masking includes return-to-depot feasibility, while open routes alter whether the final return cost is charged. Inactive attributes receive default values. These rules are supplied by the environment rather than discovered solely from a task name. Mixed backhaul customers are unpaired pickups; this is not an evaluated paired pickup-and-delivery problem with pickup-before-delivery requests.

**Learning and scope.** Each batch samples one of five training tasks with equal task weighting. REINFORCE uses POMO's multiple starts and shared baseline. One checkpoint handles different native VRP variants; separate size-50 and size-100 checkpoints are released. This satisfies task-generalist classification without implying one unchanged checkpoint covers all sizes. The training paragraph's deterministic-trajectory wording should be read with care: the inspected current model actually samples multinomial actions during training and uses argmax for greedy evaluation.

## Experiments

- **Protocol:** 10,000 instances per epoch, 10,000 epochs, batch size 64, Adam learning rate 0.0001 and weight decay 0.000001. Size-100 training takes about ten days on one RTX 2080Ti. Table 1 compares 1.35 million parameters/10.5 days for one model with 6.56 million/49 days for five separately trained POMO models. Times elsewhere for size 50 should not be treated as the same size-100 experiment.
- **Seen tasks:** Each setting uses 5,000 test instances; reported times are totals over that set. At size 100, average gaps in Table 2 are 4.37% for direct MTPOMO, 3.05% with eightfold augmentation, and 1.59% with SGBS. Separate POMO/SGBS models achieve 3.33%/1.28%, respectively: shared-task coverage comes with a modest quality cost on these seen tasks. HGS/LKH outputs are heuristic references, not universal certified optima.
- **Unseen tasks:** Table 3 evaluates VRPBL, OVRPL, VRPBTW, OVRPLTW and OVRPBTW without target-task training, giving mean HGS-relative gaps 4.59% at size 50 and 7.03% at size 100. Individual size-100 gaps reach 11.50%/11.61% on OVRPLTW/OVRPBTW. Single-task POMO-VRPTW is better on VRPBTW50, 1.22% versus 1.66%. The eleventh combination OVRPBLTW appears in the aggregate and Appendix B experiments; the five-task table is not the entire eleven-task evaluation.
- **External/real data:** CVRPLIB evaluates 181 instances across six suites; Table 4 includes Set P sizes 15–100 despite prose describing the overall minimum as 30. On size 700–1,000 cases, the model's mean gap is 13.8% versus POMO's 31.9%. Historical cross-city logistics span thirty days, with 64 underlying instances and CVRP/OVRP/VRPL settings; these are task transfer results without real-data fine-tuning.
- **Adaptation and OOD:** Optional 200-epoch fine-tuning uses two million target-task instances and approximately five hours at size 100, reducing the five-unseen-task mean gap to 3.40%; these are adaptation results, distinct from zero-shot transfer. The OOD VRPL experiment also raises vehicle capacity to 150, so it does not isolate changing duration alone. Appendix D's capacity list in the prose differs from Table 8's eight tested capacities, which extend to 200. Reduced-space t-SNE/Hausdorff observations are descriptive, not proofs of compositional generalization.

## Limitations

The model relies on predefined attributes and feasibility logic; unseen attribute combinations differ from genuinely new constraint types. It does not universally dominate specialized networks or classical solvers, and augmentation/SGBS require additional trajectories and time. Table 6's full-network fine-tuning is also not best on every individual problem, despite broad superiority wording in the prose.

**Backhaul implementation qualification:** Appendix A and the inspected `VRPEnv.py` update the remaining-capacity variable by subtracting signed demand, and use a one-sided demand mask. Negative pickup demands can therefore increase this variable beyond its initial value; that routine does not by itself establish both bounds of conventional physical vehicle-load feasibility. For example, six pickup-only customers of demand −0.2 are not rejected by this capacity rule although their total pickup is 1.2 for a unit-capacity vehicle. This local observation concerns the printed/current rule; it does not establish that such a route occurred in the reported experiments. Reported results should be understood with their supplied signed-demand environment rather than silently equated with every standard mixed-backhaul formulation.

## Reproducibility

- **Full text/version:** Freshly read all fifteen pages of arXiv v2 dated 12 April 2024, including 52 references and Appendices A–D. The manuscript retains an unpublished-draft watermark. Formal publication is independently verified by the KDD DOI/Crossref record, with online publication 24 August 2024; no byte-identical equivalence to an unavailable ACM PDF is asserted. First public arXiv date is 23 February 2024. A generic conference notification date has been removed from acceptance metadata.
- **Code and supplements:** The author-linked [MTNCO repository](https://github.com/FeiLiu36/MTNCO) archive has 376 members and no additional PDF, scientific notebook, nested archive or video. README, training configuration and relevant policy/environment routines were inspected. Its README BibTeX omits Zhenkun Wang; the complete six-author PDF and formal metadata take precedence. No training or benchmark reproduction was run, and inaccessible ACM attachment listings are not asserted empty.
- **Figure/relations:** Original Figure 2 is cropped from PDF page 4 with the full model, attribute block and caption. Main tables, rotated Appendix Table 6 and all appendix result pages were read; eighteen exact references match existing repository entries. Different works sharing a broad topic or model acronym are not merged into citation edges.
