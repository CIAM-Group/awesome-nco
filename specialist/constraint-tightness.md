---
id: constraint-tightness
short_title: Constraint Tightness
title: Rethinking Neural Combinatorial Optimization for Vehicle Routing Problems with Different Constraint Tightness
  Degrees
authors:
- Fu Luo
- Yaoxin Wu
- Zhi Zheng
- Zhenkun Wang
year: 2025
date: '2025-05-30'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8fc784104e74f1b427865d30ad22931-Abstract-Conference.html
code_url: https://github.com/CIAM-Group/Rethinking_Constraint_Tightness
arxiv_url: https://arxiv.org/abs/2505.24627
institutions:
- Southern University of Science and Technology
- Eindhoven University of Technology
- National University of Singapore
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Duration Limits
summary: Varying constraint training and a deterministic tightness-based expert switch reduce capacity/time-window
  overfitting in separately trained constructive routing models, with measured runtime and in-domain trade-offs.
figure:
  path: paper-assets/constraint-tightness/framework.png
  alt: A light encoder and shared heavy decoder feed three experts selected by a deterministic instance-capacity
    gate.
  caption: 'Figure 3: Varying-tightness training and a multi-expert constructive decoder; the main gate is a fixed
    switch, not a learned router.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=6
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8fc784104e74f1b427865d30ad22931-Abstract-Conference.html
---
# Rethinking Neural Combinatorial Optimization for Vehicle Routing Problems with Different Constraint Tightness Degrees

> **TL;DR:** Training only at a fixed vehicle capacity or time-window width can produce severe constraint overfitting. Sample a range of constraint values during training and select a specialized expert with a deterministic interval switch. The resulting models improve average greedy quality across the tested ranges, while some in-domain cases worsen and inference becomes more expensive. CVRP and time-window variants use separate models.

## Motivation

Size generalization does not imply robustness to a different feasible region at the same size. A CVRP100 policy trained at capacity50 may learn route lengths and depot-return behavior that are unsuitable at capacity10 or500. The initial study evaluates nine existing pretrained solvers on seven10,000-instance test sets, keeping unit-square coordinates and integer demands1鈥? fixed in distribution while changing capacity. All use their basic greedy inference rather than their strongest sampling, adaptation or reconstruction protocols. [Sections1鈥?.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=1)

The structural diagnosis compares tight CVRP with open routing and loose CVRP with TSP. These are useful similarities, not equivalent objectives or a proof that capacity500 always permits one tour: total demand is random, and the HGS reference still averages1.44 vehicles at500. The OVRP-transfer demonstration also changes training capacity, so it does not isolate the causal effect of an open-route objective alone. [Figures1鈥?/AppendixK.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=5)

## Contributions

- Documents constraint overfitting across AM, POMO, MDAM, BQ, LEHD, ELG, INViT, POMO-MTL and MVMoE, using matched CVRP100 capacity sweeps rather than graph-size changes.
- Introduces **varying constraint tightness training (VCT)**: independently sample each training instance's capacity or time-window scale from a prescribed range.
- Adds a **multi-expert module (MEM)** with a deterministic one-hot interval gate. A separate learned top-two MoE is an ablation, not the principal architecture.
- Extends the study to separately trained CVRPTW, backhaul/time-window and backhaul/duration/time-window variants. Appendices provide a heuristic-relative tightness definition and a Knapsack overfitting diagnosis; they do not demonstrate a new VCT/MEM Knapsack solver.

## Methodology

### Training and expert selection

For CVRP, capacities are sampled independently as integers from10 through500. Assigning one capacity to an entire batch is weaker in the reported ablation. A light encoder feeds six shared heavy-decoder attention layers, followed by three experts, each with three attention layers and its own probability projection. Embedding size is192, feed-forward width512,12 attention heads and query/key width16. The policy constructs customer visits and depot returns; it does not propose neural edits to an incumbent solution. [Sections4.2鈥?.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=6)

The formal gate divides the capacity range into three equal intervals and activates one expert. It is a known function of the instance's capacity, **not a learned estimate of difficulty or a learned routing network**. The test policy is greedy. CVRP uses supervised learning from one million HGS-labelled CVRP100 instances,40 epochs, batch512 and Adam with initial learning rate0.0001 and a0.9 per-epoch decay. HGS labels are heuristic incumbents rather than optimality certificates.

For CVRPTW, a separate POMO backbone learns by policy gradient for1,000 epochs of10,000 instances, batch64. The time-window scale alpha is sampled across0鈥?, with three expert intervals. Here the experts are placed in the **encoder**, as specified in AppendixG; they are not the CVRP decoder copied unchanged. The release uses POMO's within-instance multiple-start mean reward baseline. [Section6/AppendixG.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=9)

The repository classification remains **specialist / constructive**. One checkpoint handles different capacity values within CVRP, but there is no demonstrated shared checkpoint spanning CVRP and all time-window/backhaul/duration problems. Reusing the framework or using three experts within one problem does not establish cross-problem generalist scope.

### What the tightness and similarity measures mean

AppendixJ defines tightness through a reference heuristic H and positive objective values:

`T = (log f(H(P_constraint)) 鈭?log f(H(P_relaxed))) / (log f(H(P_extreme)) 鈭?log f(H(P_relaxed)))`.

This measures normalized degradation of a chosen heuristic, not feasible-region volume or an algorithm-independent intrinsic difficulty. The denominator must be nonzero. A value within0鈥? additionally requires the observed heuristic costs to be bracketed by the chosen relaxed/extreme references; this is not automatic for arbitrary heuristics or constraints. Nearest-neighbor routing and greedy value/weight Knapsack illustrate the definition. The main capacity sweep covers approximately.018鈥?837 on this calibration rather than literally the whole0鈥? interval. [AppendixJ/Table12.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=28)

The separate inter-problem similarity multiplies two relative transferred-cost factors. Transfer includes explicit classical repairs: splitting routes, reinserting depot edges, greedy segment merging or enforcing time windows. It depends on those repairs and reference solutions and is not proved to be a metric. At capacity10, reported CVRP鈥揙VRP similarity is97.5% versus25.5% for CVRP鈥揟SP; at500 they are74.1% and98.2%. [AppendicesC鈥揇.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=22)

## Experiments

### CVRP100 capacity generalization

The seven capacities are10,50,100,200,300,400 and500, each with10,000 test instances. Gaps use HGS as a **heuristic reference**, despite the paper's occasional optimal/ground-truth terminology. Main comparisons use greedy decoding on a single RTX3090 with24GB; the reported HGS time uses CPU and is not an equal-hardware comparison.

| Capacity | Best displayed existing gap | VCT + MEM gap |
| --- | --- | --- |
|10 |7.47% |1.54% |
|50 |3.25% |3.82% |
|100 |3.48% |3.67% |
|200 |4.18% |1.49% |
|300 |5.78% |.87% |
|400 |4.92% |.75% |
|500 |6.82% |.87% |

Thus the proposed model improves five settings, with worse results at50 and100. Table3 prints averages5.13% and1.86%; the prose's3.71% comparison average is inconsistent with that table and is not adopted here. The nine-baseline Table2 also prints a17.24% MVMoE average although its seven displayed entries average about14.80%; the row is disclosed rather than silently corrected or used as an independently reconciled statistic. [Tables2鈥?.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=3)

The controlled ablation reports mean gaps10.78% for fixed-capacity base training,8.95% with MEM alone,2.41% with VCT alone and1.86% with both. Most of the robustness gain comes from VCT. AppendixM reports.67 minutes per10,000-instance set for VCT and.96 minutes with MEM: approximately43% more inference time. Main AppendixA gives57.6 seconds for the full model versus27 for LEHD,3 for POMO and roughly109.8 for BQ, averaged across these test sets. These are whole-set times, not per-instance latencies. [Tables4/6/14.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=8)

The learned top-two MoE comparison averages2.17% versus1.86% for the fixed switch, but is slightly better at capacity10 and500. It does not establish that hard switching wins in every regime. [AppendixH/Table10.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=27)

### Time-window and additional constraints

The separate CVRPTW100 experiment evaluates alpha=.2,.5,1,1.5,2,2.5 and3. Baseline POMO trained at alpha1 averages19.58%; VCT gives12.14% and VCT+MEM11.58%. At the original alpha1, however, the proposed11.91% is worse than the baseline11.39%. These remain substantial heuristic-reference gaps, rather than uniformly near-optimal results. [Table5.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=8)

AppendixI additionally studies **VRPBTW** (backhauls and time windows) and **VRPBLTW** (backhauls, duration limits and time windows), following MVMoE's constraint settings with POMO. OR-Tools is the reference here. Mean gaps improve20.91鈫?0.03% and17.70鈫?.75%, respectively, while alpha1 worsens8.46鈫?.34% and8.29鈫?.09%. These experiments demonstrate framework reuse across separately configured problems, not a jointly trained solver. [Table11.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=28)

### What the other appendices do and do not test

AppendixL inspects sub-tour customer counts across192 CVRPLIB instances to motivate a capacity range. It is **not** a performance benchmark of the proposed model on those192 real-world instances. AppendixN's long-tailed demand experiment tests existing fixed-capacity baselines; it does not report the proposed model, and changing mean demand also changes effective tightness. Some varying-capacity baseline averages improve under this shift, so degradation is not universal. [AppendicesL/N.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=31)

AppendixO tests pretrained POMO/BQ on KP200 with capacities2,5,10,25 and50, against OR-Tools. At capacity2 the gaps are40.132% and3.119%; at the training capacity25 they are.472% and.094%. This supports a broader overfitting diagnosis, not successful training of the paper's method for Knapsack. The checklist explicitly reports no statistical-significance analysis; test-set means are not confidence intervals over independent training seeds. [AppendixO/checklist.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=34)

## Limitations

### Discussed in the Paper

Uniform range sampling may be improved by adaptive sampling. Extension to scheduling, planning and bin packing remains future work. The chosen capacity/time-window ranges require knowledge of the intended operating regime. [Section8/AppendixL.](https://proceedings.neurips.cc/paper_files/paper/2025/file/b8fc784104e74f1b427865d30ad22931-Paper-Conference.pdf#page=10)

### Curator Notes

- Constraint robustness is assessed mainly at100 customers within chosen ranges. No universal out-of-range, demand-distribution or cross-problem checkpoint guarantee follows.
- Tightness and inter-problem similarity depend on heuristic references and repair procedures. A very loose fixed capacity does not guarantee that every sampled instance fits one vehicle.
- Basic greedy comparisons answer a particular inference-budget question; stronger baseline sampling, reconstruction or test-time adaptation is not included in those main numbers.
- More experts improve mean quality at additional runtime and with some in-domain losses. Learned-MoE and hard-switch results have setting-specific exceptions.
- The public implementation and formal formulas differ in material generation/gating details described below. Published benchmarks were read and checked, not independently reproduced.

## Reproducibility

- **Complete reading:** all35 official NeurIPS PDF pages, main text, references, checklist and scientific AppendicesA鈥揚. All figures and tables were read; architecture, gate equations, transfer measures, time-window formulas and principal/extension results were also visually inspected.
- **Metadata:** four authors and SUSTech, Eindhoven University of Technology and National University of Singapore affiliations checked in the actual PDF. The arXiv history verifies first submission30May2025; the formal proceedings verify NeurIPS2025. The old generic conference notification date was removed because it did not establish this paper's acceptance day.
- **Scientific inventory:** the actual proceedings page links the complete35-page paper and no separate scientific supplement. OpenReview API forLwn1rLB8t7 returned403; no access to its unseen attachments is claimed. All explicitly named appendices are included and read. The180-entry official repository tree contains code/data-generation assets but no additional PDF/TEX/notebook/archive science document.
- **Official code inspected:** README, CVRP model and trainer/configuration, separate POMO model/trainer, generation entry point and active utility mapping toVRPTWEnv3, time-window generation functions and reference-solver configuration. CVRP minimizes supervised teacher-action negative log-likelihood; the time-window trainer uses POMO policy gradients. The visible PyVRP reference script uses a20,000-iteration stopping rule, not an exact solver certificate.
- **Gate discrepancy:** formal Equation3 shifts capacity byCmin=10 before equal splitting and uses a strict upper endpoint, leavingCmax unassigned if interpreted literally. The release instead uses thresholds0/163/326 with closed upper boundaries for its first two experts and a final open-ended expert. It covers capacity500 but is not the same shifted interval partition. This is documented without rewriting upstream code.
- **Time-window discrepancy:** AppendixF prints service time `max(s/alpha,s)` while saying service is only relaxed. The inspected active generation path scales service down only whenalpha>1, equivalent to `min(s/alpha,s)` for positivealpha. Windows follow the displayed midpoint expansion/contraction with a zero clamp on the opening time. Consequently the implemented sweep changes both windows and service time for loose settings; the printed formula and implementation should not be treated as identical protocols.
- **Figure:** original complete Figure3 from formal PDF page6, cropped without redrawing. No full training or benchmark rerun was performed. [Official code](https://github.com/CIAM-Group/Rethinking_Constraint_Tightness) 路 [arXiv history](https://arxiv.org/abs/2505.24627).
