---
id: deft
short_title: DEFT
title: Deft Scheduling of Dynamic Cloud Workflows with Varying Deadlines via Mixture-of-Experts
authors:
- Ya Shen
- Gang Chen
- Hui Ma
- Mengjie Zhang
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/f82526e95f7effb92f6a24f282ace472-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/f82526e95f7effb92f6a24f282ace472-Abstract-Conference.html
institutions:
- Victoria University of Wellington
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Workflow Scheduling
summary: Evolution-trained deadline-specialized experts and graph-adaptive routing construct online VM assignments,
  lowering simulated total cost with explicit SLA and latency trade-offs.
code_url: https://github.com/yashenCS/DEFT
---

# Deft Scheduling of Dynamic Cloud Workflows with Varying Deadlines via Mixture-of-Experts

> **TL;DR:** Four deadline-specialized neural experts, a GAT/cross-attention gate and a shared state encoder select VM assignments for arriving workflow tasks. Evolution strategies train the modules in two phases. The reported advantage is lower total simulated rental-plus-lateness cost; neither all deadlines met nor every cost component minimized is established.

## Motivation

Dynamic cloud workflows combine DAG precedence, heterogeneous virtual machines and different deadline tightness. A single policy mapping can struggle to trade rental fees against lateness. DEFT changes the GATESpriority mapper into a deadline-aware mixture while retaining the same native cost-aware workflow scheduling task (Sections1–3).

## Contributions

- Independently pretrained deadline experts provide several scheduling behaviors.
- Graph-adaptive routing conditions on DAG/task/VM/deadline information rather than a simple context-free expert gate.
- Joint second-stage training, scale transfer, cost-component analysis, latency and routing ablations evaluate the proposed scheduler (Sections4–5/AppendicesB–J).

## Methodology

**Task/objective.** Each arriving DAGhas an arrival time and deadline equal to arrival+γ·minimum no-wait makespan using fastest VMs. Ready tasks have completed all predecessors. The policy selects an existing VMinstance or provisions a new VMtype; resource capacity is not capped. The undiscounted objective is negative execution-based rental cost plus βtimes total positive completion-time lateness. Equations3/11charge each assigned task's execution time times the hourly rate, rather than a fully specified cloud bill including all idle lease time. Deadlines are **soft penalized**, not guaranteed hard constraints (Sections3/AppendixA).

**Network.** A GATES-derived state embedding module encodes the current task, DAGand task/VMinteractions. Two GATlayers and mean pooling provide a DAGembedding. Cross-attention queries concatenate action/VMcontext, DAG, ready task and γfeatures; learned expert tokens supply keys. The formal gate ranks experts by attention weights, selects Top-kand renormalizes. Four MLPpriority experts specialize atγ1.25/1.75/2.25/5.0. The adopted setting is **Top-1**, switching expert as the scheduling state changes; multiple expert outputs need not be combined at each step (Section4/AppendicesB/F/I).

**Training.** OpenAI-ESperturbs parameter vectors with Gaussian noise and estimates the gradient of a smoothed expected rollout fitness. Each expert is first trained at its fixedγ. The state encoder, gate and all expert parameters are then jointly optimized on small workflows withγsampled from1/1.25/1.5/1.75/2/2.25/3. Settings include population40,3000generations, initial learning rate.01and noise standard deviation.05. Finite ESoptimization is not a proof of global optimality, policy convergence or SLAfeasibility (Section4.4/Algorithms1–2).

**Classification.** Specialist / constructive: the network assigns each ready task to a VMto construct an online schedule. Four scientific application DAGpatterns and deadline/size regimes remain the same native scheduling problem; there is no demonstrated shared model across distinct combinatorial tasks. Expert pretraining is not incumbent editing.

## Experiments

**Data/protocol.** CyberShake,Montage,Inspiral andSIPHTsupply workflow patterns. Small workflows have25–30tasks, medium50–60and large100. Arrivals are Poisson(rate.01); six simulatedEC2VMtypes have fixed speeds/prices. Main train/test instances each contain10workflows;30instances per test scale and10independent runs are reported. AppendixFclarifies that **all workflows within one instance share the sameγ**;γvaries across instances. This is narrower than an experimental demonstration of arbitrarily mixed workflow deadlines within every instance. Testing performs no parameter updates (Section5.1/AppendicesE–F).

**Total cost and trade-offs.** Table1reports52.46/86.60/137.69forS/M/LversusGATES52.95/97.76/195.65, approximately.9%/11.4%/29.6%improvement. DEFTalso has the lowest displayed total-cost means in the21fixed-γ/scale rows ofTable2. However, medium/large SLApenalties45.54/66.81are **worse** thanGATES42.42/50.45; largeES-RL55.01is also lower. GRP-HEFThas0reported lateness penalty at a much higher VMcost. Thus the abstract's deadline-violation language must be read as a cost trade-off rather than uniform deadline dominance (Tables1–2).

**Latency and ablations.** Overall per-step inference is.2218seconds versusGATES.2159, about2.7%higher; medium DEFT.1482is faster thanGATES.1610, whereas small/large are slower. Graph-adaptive gating beats linear/MLPgating on displayed total-cost means. A deeper GATESMLPdoes not close the quality gap. Additional expert-count/Top-kandγset ablations use **10instances of five workflows**, a smaller setup than the main tests; four experts/Top-1wins medium/large, but eight experts/Top-1has the lowest small-scale cost19.61versus20.18. Broaderγcoverage outperforms the compact set under the tested choices (Table3/AppendicesG–H).

## Limitations

### Discussed in the Paper

The study uses simulation and a limited VM/workflow model. Multi-tenant deployment, interpretable routing and broader resource-management settings are future directions. Expert diversity and suitable deadline coverage matter; redundant experts or larger Top-kcan hurt in these experiments (Section6/AppendicesH–J).

### Curator Notes

- Gaussian fitness-gradient estimation is an optimization recipe, not an approximation ratio or a guarantee that a learned expert is optimal for its deadline. GATrepresentations and a finite test suite likewise do not prove universal workflow generalization.
- AppendixI's probability example correctly shows a mixture can choose an action no individual expert ranks first. It does not prove Top-1is always better: a compromise action may have better actual cost. Table9rows3–4also contain distinct expert choices despite prose describing near agreement.
- AppendixBmixes per-action expert scores, AppendixDwrites a mixture of action probabilities, and the release aggregates **priority logits** before final action selection. Those constructions are different for k>1. The main Top-1setting removes much of that blending ambiguity.
- The released default`shared_expert=True`uses the mean of VMaction embeddings to choose a shared expert for all candidate actions, rather than a separate contextual choice per action. Placeholder expert checkpoint paths must be filled. These are inspected release/configuration facts; no experiment rerun or claim that all formal results used this exact snapshot is made.

## Reproducibility

The [formal ICLR2026 record](https://proceedings.iclr.cc/paper_files/paper/2026/hash/f82526e95f7effb92f6a24f282ace472-Abstract-Conference.html) gives publication2026-04-20andpp152944–152966. All23formal pages, including complete bibliography, algorithms, appendices and routing tables, were read. The one-page author poster was read in full and visually checked with key main tables/equations. The officialevent10006550links a poster but no separate scientific slides; OpenReviewyVFOdLjd7VAPIreturned403.

The [author repository](https://github.com/yashenCS/DEFT) atSHA3bd971f19b2ded03f912998f760ff6e92efbda23has seven files: three Python modules, README, license and two versions of the poster. All three modules and the READMEwere read. Contrary to broad complete-code wording in the paper, the current READMEexplicitly says these are **DEFT-specific policy modules** requiring the separate[GATESbase](https://github.com/yashenCS/GATES) simulator/training/ESframework and manually generated dynamic-γinstances. Its7381-entry untruncated tree was inventoried; its poster belongs to the older GATESpaper, not an additional DEFTscientific supplement. Full experiment reproduction was not run.

**Internal citations.** Actual text and bibliography verify [Learning to Dispatch](learning-to-dispatch.md)(textp2/refp13), [Learning Improvement Heuristics](learning-improvement-heuristics.md)(2/12), [MDAM](multi-decoder-attention-model.md)(2/12), [GOODRL](goodrl.md)(2–3/12), [MVMoE](../generalist/mvmoe.md)(3/13), and [SHIELD](../generalist/shield.md)(3/11). The cited2025SHIELDarXivpredecessor maps to its stable formal representative; these citations do not imply DEFTsolves routing tasks.
