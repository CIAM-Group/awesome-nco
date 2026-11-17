---
id: hierarchical-reinforcement-learning-for-cooperative-air-ground-delivery-in-urban-syste
short_title: HRL4AG
title: Hierarchical Reinforcement Learning for Cooperative Air-Ground Delivery in Urban System
authors:
- Songxin Lei
- Chunming Ma
- Haomin Wen
- Yexin Li
- Lizhenghe Chen
- Qianyu Yang
- Fugee Tsung
- Lei Chen
- Sijie Ruan
- Yuxuan Liang
year: 2026
date: '2026-02-13'
publication:
  date: '2026-08-08'
  source_url: https://doi.org/10.1145/3770855.3818964
venue: KDD
paper_url: https://doi.org/10.1145/3770855.3818964
institutions:
- The Hong Kong University of Science and Technology (Guangzhou)
- Carnegie Mellon University
- Beijing Institute for General Artificial Intelligence
- Beijing Institute of Technology
- The Hong Kong University of Science and Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Cooperative Air-Ground Delivery Dispatching
summary: A hierarchical manager selects transport modes and mode-specific workers score feasible order–vehicle pairs,
  followed by greedy dispatch and classical flight/road execution. Two urban-data simulations support throughput/latency
  gains; heterogeneous vehicles do not imply a generalist checkpoint, and the public MLP/reward implementation differs
  from the manuscript.
arxiv_url: https://arxiv.org/abs/2602.12913
code_url: https://github.com/thunderlrr/Cooperative-Air-Ground-Delivery
figure:
  path: paper-assets/hierarchical-reinforcement-learning-for-cooperative-air-ground-delivery-in-urban-syste/framework.png
  alt: Type-specific state encoders feed a mode-selection manager and UAV/carrier scoring workers with trajectory
    and intrinsic reward feedback.
  caption: 'Figure 3: HRL4AG heterogeneous encoding, manager/worker dispatch and reward shaping.'
  source_url: https://arxiv.org/pdf/2602.12913v2#page=4
---

# Hierarchical Reinforcement Learning for Cooperative Air-Ground Delivery in Urban System

> **TL;DR:** HRL4AG decomposes dynamic delivery dispatch into a manager's air/ground selection and worker scores for feasible order–vehicle pairs, followed by greedy matching. It is a **specialist/constructive** dispatch solver. Experiments use real urban datasets in simulation; the visual evaluation platform is not evidence of a live UAV-fleet deployment.

## Motivation

UAVs can travel directly but have battery/payload restrictions, while ground carriers follow road networks with different speeds and availability. A flat policy over all pending orders and heterogeneous vehicles can be costly. The paper separates mode selection and matching, retaining explicit deadline/energy pruning and different execution dynamics. Both vehicle types serve one dispatching problem; their coexistence does not demonstrate cross-native-problem generalist learning. [Introduction/framework.](https://arxiv.org/pdf/2602.12913v2#page=2)

## Contributions

- An active-order/idle-vehicle pipeline filters candidate pairs, scores dispatches and updates flight, road and charging states.
- A manager/worker policy decomposes mode selection from per-mode pair scoring; the manuscript describes type-specific transformer encoders and DDPG learning.
- A hybrid worker reward combines global dispatch/execution milestones with an intrinsic mode-consistency incentive.
- Two urban-data simulations, component ablations, homogeneous-fleet comparisons and a visualization platform evaluate throughput and decision time. [Architecture.](https://arxiv.org/pdf/2602.12913v2#page=4)

## Methodology

### Feasibility, neural scoring and construction

The dispatcher first selects unserved orders before deadline and idle vehicles. A straight-line deadline precheck precedes road-distance checks for carriers. UAV feasibility is intended to include travel to pickup, delivery and a safe return to charging; residual charge may trigger charging after delivery. Feasible pairs receive neural scores, and greedy matching removes conflicts to construct a dispatch. Classical shortest-path/flight simulation executes assignments. There is no learned operator rewriting an existing complete dispatch incumbent.

The initial binary formulation is schematic: it constrains each order to at most one vehicle but does not print the per-vehicle one-assignment constraint subsequently used in the one-to-one dispatch description. Its energy equation is also simpler than the full current→pickup→delivery→charger loop described in the framework. Feasibility and optimality conclusions should refer to the actual dispatch rules rather than treating that compact formulation as a complete certified physical model. [Equations1–2/framework.](https://arxiv.org/pdf/2602.12913v2#page=3)

### Hierarchy and learning

The manuscript describes three transformer encoders without positional embeddings for orders/UAVs/carriers, fused with system context. The manager supplies an air/ground goal distribution; mode-specific workers emit bounded pair scores, and invalid pairs are masked. DDPG actor/critic updates use replay and soft target updates. The paper's four-network shorthand groups workers, while the released code has distinct manager, UAV and carrier actor–critic pairs.

Extrinsic reward weights matching/pickup/delivery by1.5/3/10, with an execution-rate term and a time term(weight.2). Workers additionally receive an intrinsic consistency reward controlled byalpha. This is heuristic objective shaping, not a proof of policy invariance or guaranteed DDPG convergence. Scalar pair scores followed by greedy matching do not certify the globally optimal assignment at every step. [Equations3–11.](https://arxiv.org/pdf/2602.12913v2#page=5)

### Current public implementation boundary

The identified release's `hierarchical_ddpg_networks_with_intrinsic.py` uses flattened-state fully connected actors, LayerNorm/dropout and(tanh+1)/2 outputs, rather than the three stated transformer encoders/two-way manager softmax. Its intrinsic reward is cosine alignment between a prefix of the state difference and the manager-goal vector, shared by both workers, rather than the manuscript's explicitly stated successful-mode-match consistency rule. These are directly inspected snapshot differences to reconcile; this review does not assume the released MLP source exactly reproduces the transformer-based paper or invalidate the published table solely from that difference.

## Experiments

### Data, splits and budget

Shanghai contains20,664orders over30days, a590,249node road network, and mean Euclidean/road distances31.37/33.79km. Its split is70/20/10%by day. Chengdu has96,376orders over November1–6,2016, a4,658node network, mean distances7.39/8.34km, with days1–4/5/6used for training/validation/test. These are processed urban datasets applied to a simulated cooperative fleet, not recorded joint UAV/carrier execution outcomes.

Training uses PyTorch2.1.3 on one RTX A4000, batch32, actor/critic learning rate.005 and hidden256. An inference epoch contains at most50time steps. Fleet sizes30/40/50use equal UAV/carrier counts; initial UAV energy is1kWh. Shanghai UAV/carrier speeds120/90km/h and Chengdu60/45km/h are prescribed simulation settings. Five random-seed runs are reported with a mean and quantities described as variance; the ±numbers are not relabeled as standard deviations or confidence intervals. Full training duration/epoch count and the precise relationship between training/evaluation seeds are not stated. [Dataset/Table1/setup.](https://arxiv.org/pdf/2602.12913v2#page=5)

### Throughput and time

Table2 Shanghai delivered-order means are30/36/39 versus the best respective baseline22/29/31: approximately36.4/24.1/25.8%relative gains. Chengdu76/85/88 versus59/68/71gives28.8/25.0/23.9%. These are **delivery counts** under the stated workload, not directly reported calibrated success probabilities; the headline 'up to26%' is not a uniform or exact maximum derived from every displayed row.

HRL4AG's Shanghai ETs are.17/.20/.35s and Chengdu .35/.56/.83s. ET is the average duration of an inference **epoch**, not per-order latency or full training runtime. Relative to the fastest listed comparator per setting, the speedups are about85.4/75.1/33.5× in Shanghai and8.0/6.1/7.9× in Chengdu. An80×headline is therefore a selected comparison, not a constant acceleration over every method/city. All six rows show higher delivered counts and lower ET than the listed baselines, without establishing hardware-independent complexity guarantees. [Complete five-run Table2.](https://arxiv.org/pdf/2602.12913v2#page=7)

Removing the hierarchy worsens both throughput and runtime in the presented ablation; one cited Shanghai case increases ET .35→22.1s. Removing intrinsic reward or reward shaping also worsens the displayed outcomes. The homogeneous-fleet comparison fixes total vehicle count and demand ratio.5; it supports the tested mixed-fleet trade-off, not universal superiority for every demand distribution. The author explicitly acknowledges that extreme demand can favor one mode.

### Evaluation platform

The platform visualizes scenario/fleet configuration, road/flight execution, charging, individual telemetry and historical result overlays. It is a useful simulation/debugging interface. Screenshot comparisons do not independently validate real-airspace safety, physical energy models, collision avoidance, no-fly-zone compliance or large-scale field performance. Weather and uncertain energy consumption are future extensions, not tested capabilities. [Figures5–8/AppendixA.](https://arxiv.org/pdf/2602.12913v2#page=8)

## Limitations

The objective emphasizes throughput without directly penalizing energy or carrier detours; high service can increase operational cost and produce mode imbalance. Fleet sizes30–50, fixed simulation speeds and two processed urban datasets limit scale/operational claims. Greedy dispatch and heuristic reward shaping provide no global assignment or learning-convergence certificate. The manuscript/code architecture and intrinsic-reward differences restrict reproduction without further reconciliation.

No model was trained, full simulator benchmark rerun or field system deployed during this review. The LLM-use statement concerns grammar editing and author responsibility; it is not additional experimental validation.

## Reproducibility

- Formal KDD2026 DOI10.1145/3770855.3818964, pages11295–11306, has publisher-deposited online publication2026-08-08/print2026-08-09. The front date is primary arXivv1 first posting2026-02-13; the actual read version is **v2,2026-08-04**. Formal ten-author metadata agrees with the full source; SijieRuan/YuxuanLiang correspond. HKUSTGuangzhou and HKUSTHongKong are retained as distinct institutions alongside CMU/BIGAI/BIT.
- **All12pages of arXiv2602.12913v2** were fully read, including all46references and the complete platform AppendixA. This identified authorized full-reading copy is not a claim of byte comparison against an unobtained publisherPDF.
- [Official code](https://github.com/thunderlrr/Cooperative-Air-Ground-Delivery) is explicitly linked by the paper and first-author homepage. Git remote refs identify main SHA`5228fdf11ba424a8d2392a3cbc917e57239e6adc`. Its actual68,869,282byte source ZIP was inventoried:62members including eight Python files and Shanghai data/road assets, with no README, PDF, TeX, notebook or extra scientific-proof document. No external scientific appendix is promised by the paper. API rate limits are not represented as successful API inventories; the archive and actual source files provide the evidence here.
- Relevant manager/worker/reward and environment assignment paths were inspected for the concrete claims above. Public source presence is not evidence of complete table reproduction. Training/test/source dataset assumptions remain separate from manuscript results.
- Complete original Figure3 is cropped from PDFpage4, rectangle(54,80,295,196), at5× and actually viewed. Main framework/method/table/ablation/transport-mode and appendix-platform figures were rendered and visually inspected.
- The full explicit bibliography was checked against the current active catalogue; no matching internal work was confirmed, so **no internal citation edge is forced**. Distinct journal extensions, general RL/survey references, urban prediction papers and unrelated near-topic titles are not mapped onto existing solver IDs merely by topic or shared authors.
