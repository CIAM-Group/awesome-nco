---
id: mapdp
short_title: MAPDP
title: 'MAPDP: Cooperative Multi-Agent Reinforcement Learning to Solve Pickup and Delivery Problems'
authors:
- Zefang Zong
- Meng Zheng
- Yong Li
- Depeng Jin
year: 2022
date: '2022'
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/21236
institutions:
- Tsinghua University
- Hitachi China Research and Development Corporation
figure:
  path: paper-assets/mapdp/framework.png
  alt: MAPDP architecture with paired context embedding, context encoding, and cooperative agent decoding.
  caption: 'Figure 2: Overall multi-agent model structure with shared context and communicating vehicle policies.'
  source_url: https://cdn.aaai.org/ojs/21236/21236-13-25249-1-2-20220628.pdf#page=4
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Pickup and Delivery Problem
summary: A shared paired-node encoder, distinct vehicle decoders and centralized A2C construct cooperative pickup-delivery
  routes, with communication and randomized conflict handling; reported gaps are to the best tested method.
publication:
  date: '2022'
  source_url: https://www.aaaipress.org/Library/AAAI/aaai22-issue09.php
---

# MAPDP: Cooperative Multi-Agent Reinforcement Learning to Solve Pickup and Delivery Problems

> **TL;DR:** MAPDP constructs routes for several cooperating vehicles using shared node representations, individual decoders and a centralized critic. Its reported zero gaps mean best among the compared methods, not proved optimality.

## Motivation

Cooperative pickup-and-delivery requires each parcel's pickup to precede its delivery on the same vehicle, while vehicles coordinate their allocation of requests. A standard single-vehicle or sequential CVRP decoder does not directly model these dependencies. MAPDP jointly learns the next-node decisions of the fleet, under centralized observation and communication (main Introduction and Problem Formulation).

## Contributions

- Represents a pickup together with its paired delivery before shared attention-based encoding.
- Gives each vehicle a separate decoder, conditioned on a communication embedding of the fleet's states.
- Trains the shared encoder and vehicle policies using a common reward and centralized A2C critic, with a fleet handler for conflicting selections.
- Evaluates constructed solutions, workload case studies and decoder-sharing/communication ablations on synthetic and static real-world instances.

## Methodology

**Task and state.** An instance has N pickup/delivery pairs, K capacitated vehicles and a common depot. Signed demands update vehicle load; a parcel must stay on the vehicle that picks it up. Each agent observes its current location, remaining capacity and trajectory. States are fully observable through centralized control. The shared objective minimizes the sum of all vehicle travel distances, rather than the longest individual route or workload imbalance (PDF pp. 3-4).

**Paired encoder.** A linear layer embeds each node's two coordinates and demand. A pickup representation concatenates its corresponding delivery representation; the depot and delivery nodes use separate projections. A shared Transformer encoder processes these representations through attention, residual connections, feed-forward and batch-normalization layers. The paper also pools a graph representation. Sharing this encoder among vehicles is distinct from sharing a model across different optimization problems (PDF pp. 4-5).

**Cooperative decoding.** Each vehicle has its own decoder parameters. Its context combines the graph embedding, its current-node embedding and capacity, and a communication vector concatenating all vehicles' current-node embeddings and capacities. Multi-head attention and a clipped dot-product score produce next-node probabilities. A feasibility mask is described, including visited-node exclusion. If multiple vehicles select the same node, a fleet handler randomly retains one action and holds the others at their current locations. Construction ends after all pickup/delivery nodes are served and all vehicles return to the depot. This is centralized cooperative execution with an explicit conflict rule, rather than coordination without hand-written rules (PDF p. 5).

**Learning.** Each traversed arc gives a negative-distance reward and the common return sums over agents and steps. A centralized critic combines policy-weighted node embeddings from all vehicles, projects them into a 128-dimensional vector and uses two dense layers to estimate state value. A2C updates vehicle policies and the shared encoder using a common advantage. Reported settings are three encoder layers, eight attention heads, `dk=128` as printed, Adam learning rate 0.001 and PyTorch 1.7 (PDF pp. 5-6).

## Experiments

**Data and protocol.** Synthetic coordinates lie in a 5-by-5 square, pickup demand is sampled from (1,10) and vehicle capacity is 10. The real-world source contains more than 100,000 monthly order pairs from a logistics platform in Guangdong; orders are known one day ahead, with a fixed historical fleet and capacity 6. Both evaluations use 20/50/100 pickup-plus-delivery nodes and respectively 2/5/10 vehicles. These are static planning experiments, not tests of continuous online arrivals or cancellations (PDF pp. 5-6).

**Baselines and references.** The compared heuristics are ant-colony optimization, tabu search and OR-Tools. RL-VRP, Attention Model and MDAM are manually adapted with pickup/delivery masks and a fixed order in which vehicles receive decoded nodes. Consequently the neural comparison includes both a model change and a coordination-protocol change. There is no reported certified optimum or comparison to a specialized exact PDP solver (PDF p. 6).

Table 1 defines each gap relative to the best method among those tested, which is MAPDP in every column. For 100 service nodes and 10 vehicles, synthetic costs are 88.97 for MAPDP versus 94.25 for OR-Tools and 105.11 for MDAM; real-world costs are 1,705 versus 1,811 and 1,733. The real-world MDAM row's 1.64% is `(1733 - 1705) / 1705`, a comparator gap measured relative to MAPDP, not a certified optimality gap or a 1.64% reduction with MDAM as denominator. Zero in MAPDP's gap column follows from that reference choice (PDF Table 1).

**Time and ablations.** Table 1 lists MAPDP inference times of 1/4/7 seconds at the three scales, versus minutes for the heuristic settings. The paper describes a four-2080Ti-GPU experimental setup, but the timing aggregation, test-instance counts, training budget and separate heuristic hardware/execution details are not sufficiently specified to infer universal per-instance latency or a hardware-normalized speedup. At 100 synthetic nodes, sharing decoder parameters changes cost from 88.97 to 89.78, while removing communication changes it to 108.12; real-world costs change from 1,705 to 1,721 and 1,896. Communication is the larger empirical effect in these ablations. Workload plots show substantial real-world imbalance and conflict-related halting, rather than a fairness guarantee (PDF p. 7 and Table 2).

## Limitations

The study does not establish zero-shot transfer to arbitrary vehicle counts, new constraints or new problem types. Separate vehicle decoders and scale-specific fleet settings should be preserved when assessing such transfer. The entry is specialist and constructive; multiple cooperating vehicle policies are not multiple optimization-task competencies.

Feasibility constraints are stated in the formulation, but the mask implementation is only briefly specified. Visited-node masking and random conflict resolution alone do not constitute a proof of pickup precedence, same-vehicle assignment and load feasibility. Reproduction needs the actual constraint checks and complete decoder/critic update details. Centralized access to all fleet states is an assumption of the method.

The conclusions are restricted to the reported static datasets and adapted baselines. The paper motivates rapid replanning under changing orders, but does not report a dynamic arrival/cancellation experiment. No approximation guarantee, optimality certificate or balanced-workload objective is supplied. Published table values and units are retained without inventing missing timing or dataset-split details.

## Reproducibility

- **Full reading:** all nine pages of the official AAAI-22 PDF, including the complete bibliography. Architecture, mathematical formulation and both experiment tables were visually checked. The former framework asset cropped off the lower inputs; it was replaced with a complete original Figure 2 crop from PDF page 4.
- **Formal publication:** the official AAAI-22 volume-36 technical-track-9 index lists pages 9980-9988; the PDF header and copyright also identify 2022. The inferred conference-wide acceptance day was removed. The general AAAI website repost date is not used as the paper's publication year.
- **Supplement discovery:** the full paper makes no reference to a separate scientific appendix, and available official AAAI paper/index pages and targeted author/title searches did not identify one. The OJS landing currently denies automated access, so no successful inspection of unavailable attachment fields is claimed. No absent scientific material is explicitly required by the text read.
- **Code and data:** the paper supplies no author code URL or public real-world-data download. A targeted public search did not establish an official repository; this does not prove that none exists. Training or result reproduction was not performed.
- **Citations:** Catalogue references include Bello, Nazari, Attention Model, MDAM, NeuRewriter and L2I. The bibliography duplicates the same Lu et al. work as 2019a/2019b; these are one paper identity and one directed relation, with both printed labels retained.
