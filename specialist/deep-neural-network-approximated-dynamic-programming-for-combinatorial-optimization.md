---
id: deep-neural-network-approximated-dynamic-programming-for-combinatorial-optimization
short_title: NDP
title: Deep Neural Network Approximated Dynamic Programming for Combinatorial Optimization
authors:
- Shenghe Xu
- Shivendra S. Panwar
- Murali Kodialam
- T. V. Lakshman
year: 2020
date: '2020-04-03'
publication:
  date: '2020-04-03'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/5531
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/5531
institutions:
- New York University
- Nokia Bell Labs
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Assignment
- Routing
- Scheduling
problems:
- Linear Sum Assignment
- TSP
- Talent Scheduling
summary: Stage-specific fully connected network banks approximate dynamic-programming values or policies for assignment,
  TSP and talent scheduling, trading exactness and substantial training for fast batched construction.
code_url: https://github.com/shenghexu/DNN-DP
figure:
  path: paper-assets/deep-neural-network-approximated-dynamic-programming-for-combinatorial-optimization/framework.png
  alt: OriginalFigure1 shows fourfullyconnectedlayers withReLU andbatchnormalization in theTSPnetwork.
  caption: OriginalFigure1/fullcaption shows oneTSPstage-networkarchitecture; thefullsolverusesseparatenetworksacrossremainingproblemstages.
  source_url: https://raw.githubusercontent.com/shenghexu/DNN-DP/41864a6df870391aa83c218db9dbad3465aa20e8/Deep%20Neural%20Network%20Approximated%20Dynamic%20Programming%20for%20Combinatorial%20Optimization.pdf#page=5
---

# Deep Neural Network Approximated Dynamic Programming for Combinatorial Optimization

> **TL;DR:** NDP replaces dynamic-programming value or policy calculations with a sequence of stage-specific fully connected networks. Small-to-large pretraining and rollout-distribution fine-tuning trade exactness for fast batched inference. The general framework uses separate trained models for assignment, routing and talent scheduling.

## Motivation

Exact dynamic programming can remain exponentially expensive even when a problem has an appropriate recursive structure. NDP approximates its decision stages with neural networks trained on a known instance distribution, aiming to reduce inference work without training on each test instance. [pp. 1–3]

## Contributions

- Value-based NDP regresses action values; policy-based NDP classifies the next action.
- Train networks from the smallest subproblem upward, then fine-tune on states reached by the current sequence of policies.
- Demonstrate the framework on linear sum assignment, TSP and talent scheduling, with explicit throughput/quality comparisons. [pp. 3–7]

## Methodology

Each remaining subproblem size has its own network. The smallest stage supplies directly computed rewards; later stages use rollouts of previously trained networks to form training targets. Value approximation uses squared error, while policy approximation uses cross-entropy for selected actions. Fine-tuning adjusts the training-state distribution to that induced by the current policies. “Unsupervised” here refers to self-generated objectives/targets, not exact optimal labels for every large instance. [Equations 1–6; Algorithms 1–2]

The networks sequentially assign jobs, choose tour nodes or schedule scenes. They are separately trained across tasks and sizes, with task-dependent inputs and hidden layers. The collection therefore uses **specialist/constructive**, rather than inferring a shared generalist checkpoint from the framework's broad applicability. [pp. 4–6]

## Experiments

LSAP uses sizes 20/50, TSP uses 20/50 cities, and talent scheduling uses 20 actors with 20/25/30 scenes. Timing covers **10,000 LSAP/TSP instances** or **1000 scheduling instances**, on a P100 GPU and two Xeon Silver 4114 CPUs. Neural models use large batches; CPU baselines use the server's CPU cores. Reported times are batch throughput measurements, not individual-instance latency including training. [pp. 5–6]

For LSAP-20, Table 1 reports policy/value gaps of 3.47%/3.07% and 0.01-second batch times versus Hungarian's exact solution in 1.47 seconds. On TSP-50, policy/value gaps are **12.02%/24.69%**, versus AM's 1.76% and farthest insertion's 5.53%; NDP's faster 0.14-second batch inference trades away substantial quality. [Tables 1–2]

For talent scheduling with 30 scenes, policy/value gaps are 14.63%/21.77%. With 25 scenes the policy gap is 7.65%, with a reported 0.13-second batch time versus EBB's 49.28 seconds. These results coexist with substantial training: about 28 hours of LSAP-20 fine-tuning, 70 hours for TSP-20, and 55–75 hours for TSP-50 in the reported configurations. [p. 6; Table 3]

## Limitations

Approximating DP stages removes exact optimality guarantees and can compound errors over decisions. Stage-specific network banks require additional storage and training, and do not demonstrate arbitrary-size or cross-task checkpoint transfer. The TSP-50 and larger scheduling gaps qualify the broad speed/quality claims. [pp. 6–8]

Experiments assume specified problem distributions and modest sizes. The reported GPU batching advantage should be distinguished from a hardware-independent algorithmic speedup. The prose's sequential EBB timings and Table 3's parallel batch timings describe different protocols and are not interchangeable latency estimates. Exact replication also needs clarification of several printed training-count notations. [pp. 5–7]

## Reproducibility

Read all **eight pages** of the [author-repository PDF](https://raw.githubusercontent.com/shenghexu/DNN-DP/41864a6df870391aa83c218db9dbad3465aa20e8/Deep%20Neural%20Network%20Approximated%20Dynamic%20Programming%20for%20Combinatorial%20Optimization.pdf), including all algorithms, results and references; inspected both figures and all three tables. Original Figure 1 and its caption show the actual TSP network. The [AAAI 2020 publisher record](https://ojs.aaai.org/index.php/AAAI/article/view/5531) and DOI deposit establish four authors, pages 1684–1691 and online publication **2020-04-03**. The publisher download returned HTTP 520, while the author-linked repository supplied a readable copy. No same-identity arXiv record was established, so no preprint date is invented.

The [inspected author release](https://github.com/shenghexu/DNN-DP/tree/41864a6df870391aa83c218db9dbad3465aa20e8) has 37 archive members. Its sole PDF has the same checksum as the read copy; no additional scientific appendix or notebook is present. README documents the TSP-20 policy workflow and older Python/PyTorch dependencies. Its default 1600 fine-tuning epochs/about 60 hours on a P40 differ from the paper's 1500/about 70-hour TSP-20 protocol. This public workflow should not be described as verified reproduction of every task/configuration. No training or benchmark replication was performed.
