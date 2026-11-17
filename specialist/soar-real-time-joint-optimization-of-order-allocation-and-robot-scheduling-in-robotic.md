---
id: soar-real-time-joint-optimization-of-order-allocation-and-robot-scheduling-in-robotic
short_title: SOAR
title: 'SOAR: Real-Time Joint Optimization of Order Allocation and Robot Scheduling in Robotic Mobile Fulfillment
  Systems'
authors:
- Yibang Tang
- Yifan Yang
- Jingyuan Wang
- Junhua Chen
- Zhen Zhao
year: 2026
date: '2026-05-05'
publication:
  date: '2026-08-08'
  source_url: https://doi.org/10.1145/3770855.3818484
venue: KDD
paper_url: https://doi.org/10.1145/3770855.3818484
institutions:
- Beihang University
- Geekplus Technology Co., Ltd.
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Assignment
problems:
- Dynamic Order Allocation and Robot Scheduling
- Robotic Mobile Fulfillment
summary: Soft order allocation supplies candidate/heat features to an event-driven heterogeneous-graph PPO destination
  scheduler for warehouse robots; simulation and a seven-day deployment show quality gains, with digital-twin baselines,
  classical remainder allocation and separate low-level path planning.
arxiv_url: https://arxiv.org/abs/2605.03842
code_url: https://github.com/200815147/SOAR
figure:
  path: paper-assets/soar-real-time-joint-optimization-of-order-allocation-and-robot-scheduling-in-robotic/framework.png
  alt: SOAR soft allocation on order arrivals and heterogeneous-graph robot destination selection on asynchronous
    decision events.
  caption: Original Figure 2 framework from the official repository, resized for display. High-level decisions and
    classical inventory allocation are coupled within one warehouse task.
  source_url: https://github.com/200815147/SOAR/blob/7833238f55536c2f2ad17708ccd66078686c12f8/framework.png
---

# SOAR: Real-Time Joint Optimization of Order Allocation and Robot Scheduling in Robotic Mobile Fulfillment Systems

> **TL;DR:** SOAR delays hard order allocation and feeds shelf/workstation matching information into an event-driven PPO robot scheduler. It improves reported makespan and order completion in simulation and operates in a warehouse field trial, while baseline field comparisons use a digital twin and collision-free routing remains a separate system.

## Motivation

Order allocation, shelf pickup, workstation delivery and shelf return influence one another in goods-to-person warehouses. Fixing allocations before robot execution can miss later changes, while repeatedly solving static joint models may incur excessive latency. SOAR jointly considers these coupled decisions through soft allocation and asynchronous high-level robot actions. Its native problem is dynamic order allocation and robot scheduling (DOARS), with makespan as the stated objective. [pp. 1–2]

## Contributions

- Maintains top-K candidate shelves, soft order sets and heat scores rather than committing every arriving order immediately.
- Uses an event-driven MDP, heterogeneous graph attention, phase-conditioned action priors and time-aware PPO to select robot destinations.
- Reports six simulation settings, component/sensitivity studies and a seven-day deployment with mirrored-stream digital-twin comparisons. The method has no claimed approximation ratio or certified global-optimality guarantee. [pp. 2–8]

## Methodology

For an arriving order, the matching matrix scores each shelf/workstation pair by the quantity of requested items available divided by transport distance. Top-K shelves per workstation enter soft candidate sets. Their scores accumulate into shelf and workstation heat features. These values guide future decisions but do not reserve a complete fixed assignment immediately. [p. 3, Eqs. 2–6]

Decision events occur when a robot becomes idle, completes a pickup or finishes workstation service. Depending on its phase, it selects an occupied shelf location, a workstation, or a workstation/empty return location. The encoder represents robots, workstations and storage locations, with shelves embedded as entity features, and a phase node. Type-specific features and distance edges pass through heterogeneous GAT-style layers. A pairwise MLP scores each target with the active robot's embedding; phase priors favor high-heat shelves, low-workload workstations or short returns, followed by validity masking and a categorical policy. The negative-log workload formula favors smaller workload, despite the prose's reversed wording about penalizing lower workload. [p. 4; Appendices E–F]

Actual order allocation combines neural decisions with explicit rules. At pickup, fulfillable soft orders consume shelf inventory; the algorithm removes their old soft contributions. At delivery, orders are assigned to a workstation and remaining unsatisfied demands are allocated greedily to additional shelves. Appendix J reports 78.3% of orders completed through soft allocation, leaving a meaningful remainder handled by the default allocation mechanism. [p. 5; Appendices B, J]

Training uses a scaled finite-p norm of robot time values as a dense surrogate for maximum completion time. PPO uses physical inter-event durations in its value discount and GAE recursion. This is an empirical surrogate objective: citing potential-based shaping does not establish exact equivalence to makespan for finite p, arbitrary terminal potentials or inconsistent discount conventions. The paper uses p=8 and tests alternatives rather than proving policy preservation. [p. 5, Eqs. 17–21; pp. 7, 12]

**Classification: Specialist / constructive.** Pickup, delivery and return are phases of one coupled warehouse problem. Their joint policy is not evidence of a checkpoint solving distinct native optimization problems. The official materials provide separate synthetic/real and small/medium/large checkpoint references, and the agent constructs online assignments/destinations rather than editing an incumbent complete schedule. [pp. 2–5; official checkpoint inventory]

## Experiments

Simulation uses real warehouse data on a 40×72 layout with 861 shelves and sixteen workstations, plus a synthetic 100×80 layout with 1,600 shelves and 23 workstations. Small/medium/large settings use fifteen/twenty/twenty-five robots and 200/500/1,000 orders. The real data covers 31 days split chronologically into 21 training, five validation and five test days, with 100 validation and 100 test instances sampled at high order density. Synthetic arrivals follow perturbed order waves and truncated-Pareto order sizes. [pp. 5, 10]

Appendix G specifies four million training steps, eight parallel environments, 128-step rollouts, four update epochs and four minibatches; PPO clipping is 0.1, entropy coefficient 0.01, value coefficient 0.1, gradient norm 0.5 and target KL 0.01. The printed network has four layers, width 256 and two heads; K=10 and both deployment pruning thresholds are fifty. Best validation models are retained. Python 3.9.23 and PyTorch 2.4.1 are stated, but complete hardware, repeated-training-seed uncertainty and confidence intervals are not supplied. [pp. 11–12]

Table 1 compares phased heuristic/OR-Tools combinations and joint methods JOTP and SABS. SOAR has the best listed makespan and average completion time in all six settings. Real-small is 406.79/152.03 versus the strongest per-metric baseline values 414.06/184.50; real-large is 828.44/275.68 versus 916.77/315.23. Arithmetic from the three real rows reproduces approximately 7.52% makespan and 15.40% completion-time reductions, using potentially different best baselines by metric and setting. [p. 6]

The reported per-instance computation times are 5.06–39.60 seconds, often slower than simple heuristics and JOTP, though faster than rolling-horizon OR-Tools/SABS. The separate sub-100ms claim concerns a single phase decision with entity pruning. OR-Tools uses ten-order/sixty-time-unit batching and ten-second real/fifteen-second synthetic solver limits before fallback; these constraints matter when interpreting quality and latency comparisons. [pp. 6–8, 12]

For deployment, the paper describes a 5,158 m² warehouse with 198 robots, 861 shelves, sixteen workstations and over 13,000 daily orders. SOAR controls physical robots for seven consecutive days; all comparison policies run in a digital twin receiving the same mirrored orders. Table 3 separates simulated SOAR from SOAR (Real). Against simulated production heuristics, simulated SOAR increases throughput from 41.95 to 43.56 and saves 54.94 completion seconds; the physical row is 43.41 and saves 49.89 seconds. The paper's approximately 3.85%, 55-second and 2.81% travel claims correspond to the simulated SOAR row, not a full live A/B test of every baseline. [pp. 7–8]

## Limitations

Collision-free path planning and physical control are delegated to the production system, and the conclusion explicitly identifies their integration as future work. Sub-100ms destination selection is not an end-to-end physical safety or response-time guarantee. Deployment additionally prunes robots and candidate shelf locations, and divides episodes at worker breaks to clear backlogs. These assumptions limit generalization to arbitrary layouts, continuously accumulating backlogs and different inventory/order distributions. [pp. 7–9]

The strongest soft-allocation ablation replaces it with random allocation, so it does not isolate the effect of delayed commitment against every competitive deterministic allocation rule. Small order size alone does not ensure a single shelf contains the required SKU combination. The paper reports empirical gains without uncertainty intervals, and some repeated bias-ablation cells differ between Tables 2 and 5; exact reproduction needs the underlying per-instance results. [pp. 7, 12–13]

Current public defaults also differ from the printed protocol: three layers/four heads/p=5 and soft allocation disabled, versus four layers/two heads/p=8 in the paper. Environment code computes an undiscounted potential difference with a norm scaled by 1/N, whereas Eq. 17 scales by N^(-1/p) and Eq. 18 includes gamma; time-aware GAE is separately implemented. The norm rescaling is a positive constant at fixed robot count and alone does not change a fixed-N optimum. These are current-version reproducibility boundaries, not evidence that the historical reported experiments are invalid.

## Reproducibility

The formal article is KDD 2026's Applied Data Science track, DOI 10.1145/3770855.3818484, pp. 8065–8076. Publisher Crossmark and Crossref distinguish online publication on 2026-08-08 from print on 2026-08-09. The scientific copy read is arXiv:2605.03842v1, submitted 2026-05-05; all thirteen pages, 37 reference entries and Appendices A–J were read. Formal publisher article/supplement pages returned 403 access challenges. The complete identified arXiv source supplies the scientific appendices and does not identify a missing separate technical attachment; no formal byte-identity claim is made.

The [official repository](https://github.com/200815147/SOAR) was inspected at commit 7833238f55536c2f2ad17708ccd66078686c12f8, dated 2026-10-29. The complete 23-file archive contains environment, neural model and PPO code, two layouts, one five-row example order CSV, one framework image and six Git LFS checkpoint pointers. The pointers identify large remote weight files; those binaries were not loaded or represented as locally bundled checkpoints. Full historical order data and the production digital twin/path planner are not included. Dependencies are mostly unpinned and the requirements file does not fully pin the PyTorch/PyG environment.

Core allocation, reward, graph/decoder, configuration and GAE paths were read. All important equations, result tables, sensitivity plots and the original framework were rendered or viewed. Local arithmetic checks separate simulated and physical deployment rows and illustrate finite-p versus maximum-objective ordering without asserting an executable warehouse counterexample. No training, warehouse benchmark, checkpoint deserialization or robot deployment was performed. Manual references were checked against the repository catalog; none identifies a matching internal paper, so no citation edge is invented from architectural similarity.
