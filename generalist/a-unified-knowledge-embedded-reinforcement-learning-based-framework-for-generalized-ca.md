---
id: a-unified-knowledge-embedded-reinforcement-learning-based-framework-for-generalized-ca
short_title: RFCS
title: A Unified Knowledge Embedded Reinforcement Learning-based Framework for Generalized Capacitated Vehicle Routing
  Problems
authors:
- Wen Wang
- Xiangchen Wu
- Liang Wang
- Hao Hu
- Xianping Tao
year: 2026
date: '2026-05-14'
publication:
  date: '2026'
  source_url: https://ijcai.org/proceedings/2026/691
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2026/691
institutions:
- Nanjing University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- CVRP
- OVRP
- VRPB
- VRPL
- VRPTW
- OVRPB
- OVRPL
- OVRPTW
- VRPBL
- VRPBTW
- VRPLTW
- OVRPBL
- OVRPBTW
- OVRPLTW
- VRPBLTW
- OVRPBLTW
- Mixed Backhaul Vehicle Routing
summary: A jointly trained sixteen-variant customer-permutation policy receives rewards from an exact fixed-order
  dynamic-programming split, with LSTM context; native-task gains and large-size transfer coexist with weaker VRPL/mixed-backhaul
  cases and release-specific implementation gaps.
arxiv_url: https://arxiv.org/abs/2605.14416
code_url: https://github.com/wenwenla/ijcai26-cvrp-solver
figure:
  path: paper-assets/a-unified-knowledge-embedded-reinforcement-learning-based-framework-for-generalized-ca/framework.png
  alt: A shared transformer/LSTM route-first policy generates a customer sequence; a constraint-aware dynamic program
    splits it and returns the training reward.
  caption: 'Figure 1: Knowledge-embedded route-first, cluster-second framework.'
  source_url: https://ijcai.org/proceedings/2026/0691.pdf#page=4
---

# A Unified Knowledge Embedded Reinforcement Learning-based Framework for Generalized Capacitated Vehicle Routing Problems

> **TL;DR:** RFCS learns a customer permutation and evaluates it through a dynamic program that optimally splits **that fixed order** into feasible routes. One checkpoint is trained across sixteen CVRP variants: **generalist/constructive**. Conditional split optimality does not make the overall VRP solution optimal, and classical splitting does not create a learned improvement stage.

## Motivation

A good TSP ordering need not produce a good CVRP solution after depot returns and operational constraints are introduced. RFCS trains the ordering policy using the eventual split cost, aligning its objective with the constrained routing task. Delegating constraint checking to a classical splitter also simplifies neural action selection. The authors add recurrent history because the final partition—and therefore the meaning of partial sequence decisions—is not known during construction. This motivation is not a proof that delayed rewards alone make an otherwise fully specified state non-Markovian. [Introduction.](https://ijcai.org/proceedings/2026/0691.pdf#page=1)

## Contributions

- A shared route-first policy constructs customer permutations, with constraint-aware dynamic-programming split costs as RL rewards.
- A RouteFinder-style encoder and history-enhanced LSTM decoder process a common representation of open routes, backhauls, distance limits and time windows.
- Joint sixteen-variant experiments, capacity and mixed-backhaul transfer, history/split ablations and supplementary large-size/runtime tests characterize the benefits and exceptions.

## Methodology

### Shared native tasks and representation

The min-sum objective covers an unlimited number of depot-based vehicle routes. Capacity is always active, with optional open routes(O), linehaul-before-backhaul service(B), route-distance limits(L) and time windows(TW), giving sixteen native variants. The same training run samples one variant per batch and updates the same encoder/decoder. The released environment's uniform sixteen-way sampler and single model instantiation support **generalist** scope, beyond merely sharing an architecture. Fifty- and100-customer models are separate size-trained checkpoints. [Definitions/training.](https://ijcai.org/proceedings/2026/0691.pdf#page=3)

Customer features contain coordinates, signed demand and time-window/service information; depot features contain coordinates, four variant flags and the distance limit. Attention blocks use RMS normalization, residual multi-head attention and a gated feed-forward network. Mean pooling provides graph context. The paper's LSTM input includes graph/depot/current-node embeddings and cumulative delivered/picked-up loads; its hidden state feeds masked attention and a tanh-clipped pointer. REINFORCE trains against the negative split cost. [Architecture.](https://ijcai.org/proceedings/2026/0691.pdf#page=5)

The actual release has six128-dimensional encoder blocks/eight heads. Its LSTM receives graph, first-node and current-node embeddings; the environment initializes first-node to the depot and does not change it. Although cumulative loads are tracked, this decoder does not consume them, unlike the printed context equation. The described final standalone encoder RMS normalization is also absent from that release. These are concrete paper/code differences, not assumed details of the experiments' original executable.

### Fixed-order dynamic programming

For permutation(a1,…,an), the recurrence is p[i]=min(j<i){p[j]+C(j+1,i)}, where a segment is a single feasible route or has infinite cost. Feasibility checks capacity, required delivery/pickup precedence, distance and time windows; open routes omit the final depot-return cost. The general split takes O(n²) segment extensions. It is exact over **contiguous partitions of the supplied permutation**, under a correct segment checker, but it cannot reorder customers or certify global VRP optimality. The policy constructs a new ordering and never applies a learned edit to an incumbent solution. [Equation6/Algorithm1.](https://ijcai.org/proceedings/2026/0691.pdf#page=4)

The released C++ checker includes initial depot travel, travel-time accumulation, waiting/service, the closed-route return in both cost and distance-limit checks, and normalized separate incoming/outgoing capacity. Printed Algorithm1 abbreviates or omits several of these details, including initial depot travel, time propagation between customers and the closed-route return in its distance test. Thus its pseudocode should not be copied literally as a complete implementation. The code returns only a split cost, without predecessor reconstruction of actual route boundaries. Its strict backhaul precedence is currently unconditional whenever signed negative demands occur; mixed-backhaul transfer requires the modified checker described in the paper, which is not separately supplied in the retrieved tree.

## Experiments

### Data and budgets

Training uses300 epochs ×1.28M generated instances =384M instance presentations per size run, batch512 and eight stochastic trajectories per instance. Those repeated rollouts are not eight distinct input instances or fixed POMO starts. Constraint flags are sampled across all sixteen variants, fixed within a batch. Unit-square locations, integer demands1–9, capacities40/50 at50/100 customers,20% backhaul customers, service times[.15,.18], time-window widths[.18,.20] and per-instance distance limits define the synthetic distribution. The paper states a distance upper bound3; current generator defaults to2.8, subject to a lower-bound feasibility adjustment. [Setup.](https://ijcai.org/proceedings/2026/0691.pdf#page=5)

Main tests average1,000 instances per variant, combining eight coordinate augmentations with n sampled trajectories per instance and choosing the best. This is8n trajectories, distinct from single greedy inference. AppendixC reports16.17hours for50-node training on two RTX5090 GPUs; quoted competing training times use other architectures/hardware and are not controlled speed comparisons. [Additional experimental details.](https://arxiv.org/pdf/2605.14416v1#page=8)

The formal main text describes classical methods as taking tens of minutes, but the actually read supplement states their numbers are borrowed from RouteFinder with **10s/20s per instance for50/100 nodes**. Those reference solutions are heuristic best-known values, not proven optima. The precise borrowed budgets take precedence over a generic reading of the main prose.

### Quality, transfer and negative cases

The32 task/size columns of Table1 mostly favor RFCS among the three named neural baselines. Reported aggregate gaps to PyVRP are1.82% for RFCS and2.60% for RouteFinder, versus3.16%/3.01% for MTPOMO/MVMoE. This is a.78 percentage-point reduction relative to RouteFinder's gap, not a claim that all solution costs fall by.78%. PyVRP has lower costs throughout the displayed table, and OR-Tools' aggregate gap1.48% is also below RFCS1.82%. [Table1/Figure2.](https://ijcai.org/proceedings/2026/0691.pdf#page=6)

VRPL is an explicit exception: at50 nodes RFCS10.750 is worse than RouteFinder10.737, and at100 nodes16.064 is worse than16.051. Capacity40-to50–90 transfer does favor RFCS, with costs9.214/8.433/7.882/7.469/7.154. Mixed-backhaul transfer is uneven: RFCS improves VRPB/OVRPB but gives10.301 on VRPBL versus the best baseline10.239, and18.194 on VRPBTW versus MVMoE17.103. Supporting a new constraint checker does not guarantee competitive zero-shot performance. [Tables2–3.](https://ijcai.org/proceedings/2026/0691.pdf#page=7)

Replacing LSTM with a fully connected history-free context worsens all five displayed50-node atomic variants, e.g., CVRP10.484→10.720 and VRPTW16.228→16.271. The supplementary combined-constraint example VRPBTW changes18.464→18.489, a much smaller effect. Applying DP only after baseline construction produces tiny CVRP reductions,10.518→10.516,10.501→10.499 and10.499→10.498, remaining above RFCS10.484. This supports the chosen trained combination against those specific postprocessing comparisons; it does not alone prove that every possible DP-free training strategy must fail. [Tables4–5.](https://ijcai.org/proceedings/2026/0691.pdf#page=7)

The supplement transfers the50-trained model to500/1,000-node CVRP without fine-tuning. RFCS single-greedy costs45.274/72.891 are below the listed neural baselines' one-/100-start results. Its times1.650s/4.850s are **totals for100 instances**, not per instance. It is not uniformly fastest: for1,000 nodes, MTPOMO's single-start time3.887s is below4.850s, at worse cost114.655. The runtime hardware is an RTX5090 and8470Q CPU with208 cores; the C++ split creates a100-thread pool per call. Fixed-order O(n²) splitting does not imply zero practical overhead on all machines or identical complete autoregressive runtimes. [AppendixA/Table6.](https://arxiv.org/pdf/2605.14416v1#page=8)

Finally, LKH3 TSP tours with50 circular shifts per instance followed by splitting give11.312 versus RFCS10.484 on1,00050-node cases. This illustrates why optimizing the unconstrained tour first can be inadequate, while preserving the particular LKH/rotation budget. [AppendixB.](https://arxiv.org/pdf/2605.14416v1#page=8)

## Limitations

The network does not remove the ordering restriction of DP, and there is no global approximation/optimality guarantee. Main evaluations are synthetic and limited to the specified attributes; mixed-backhaul transfer can regress. Large-size tests compare neural baselines with restricted start counts after memory limitations, without classical reference gaps or evidence for arbitrary-scale operational routing. Statistical confidence across independently trained seeds is not established by the displayed averages.

The LSTM motivation is plausible but does not establish that a recurrent network is necessary or that the proposed state is intrinsically partially observable. Classical-time wording conflicts with the supplement. Current decoder context, generator upper bound, missing no-LSTM alternative and unsupplied mixed checker limit reproduction directly from this snapshot. Infeasible splits are assigned finite fallback penalties by the released environment, so cost-only outputs should not be substituted for independent feasible-route validation. None of these release limitations is used to deny the paper's reported method or all results.

## Reproducibility

- Formal IJCAI2026 main-track DOI10.24963/ijcai.2026/691, pages6208–6216, lists five Nanjing University authors; Liang Wang corresponds. Publisher HTML gives year-only publication, publisher-deposited Crossref says2026-09, and the official publisher BibTeX explicitly says2026-08 (also repeated in the author repository). Publication is conservatively year precision, with the month discrepancy disclosed. No acceptance day is inferred.
- Both the **official nine-page PDF** and **arXiv2605.14416v1,2026-05-14,ten pages** were fully read, including all references and AppendicesA–D. The formal paper explicitly directs runtime/scaling questions to the arXiv appendix. The source bylines, method and detailed table values establish the same work; the arXiv first-page correspondence marker differs.
- The official paper page has PDF/BibTeX links. Manual [repository](https://github.com/wenwenla/ijcai26-cvrp-solver) inventory at tree SHA`4bdff9eb5e37abaea1c273b55fbe53327dcf881d` has thirteen files, including model/train/evaluation code, C++ splitter, one test dataset and config; no separate PDF/ZIP scientific supplement is present. The README's Drive link is explicitly for50/100 pretrained models, and the Hugging Face link is test data.
- The actual trainer instantiates one encoder/decoder, samples sixteen environment variants and saves one checkpoint per epoch. Evaluation can reuse that checkpoint for the variant loop, but its current code overrides the loop to CVRP and hardcodes50 nodes,1,000 instances, eight augmentations, sampling temperature1.6 and the checkpoint path. Other tables require deliberate configuration changes.
- CMake/pybind11 builds the cost-only C++ split. The no-LSTM option imports an absent`routefinder_net_rf_nolstm.py`; the mixed-backhaul checker is not provided. No training, checkpoint evaluation or full table reproduction was rerun. Source inspection is kept separate from measured validation.
- Full original Figure1 is cropped from formal PDFpage4, rectangle(54,50,559,201), at4× and visually checked. Algorithm1, all main result/ablation tables and the supplementary scaling/budget page were actually rendered and inspected.
- Internal citations require explicit body and full bibliography matches. The source's2018 AM and2021 online-publication labels are preserved, RouteFinder's actual eight-author2024 workshop version is distinguished from its later representative, and absent catalog works are not forced onto similarly named entries.
