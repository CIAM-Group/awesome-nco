---
id: emnh
short_title: EMNH
title: Efficient Meta Neural Heuristic for Multi-Objective Combinatorial Optimization
authors:
- Jinbiao Chen
- Jiahai Wang
- Zizhen Zhang
- Zhiguang Cao
- Te Ye
- Siyuan Chen
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html
institutions:
- Sun Yat-sen University
- Singapore Management University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Multi-Objective Traveling Salesman Problem
- Multi-Objective Capacitated Vehicle Routing Problem
- Multi-Objective Knapsack Problem
summary: EMNH accelerates preference-based meta-learning with shared-body heads and
  scaled symmetric sampling, then hierarchically fine-tunes separate scalarization
  policies for each task-specific model.
code_url: https://github.com/bill-cjb/EMNH
---

# Efficient Meta Neural Heuristic for Multi-Objective Combinatorial Optimization

> **TL;DR:** EMNH learns an initialization, then uses hierarchical gradient-based adaptation to obtain policies for many objective-weight vectors. Parallel preference heads reduce meta-training cost and scale-aware symmetric sampling stabilizes it. The experiments train separate models for each native problem/size; sharing across preferences does not establish a generalist solver across TSP, CVRP and knapsack.

## Motivation

Approximating a multi-objective Pareto set with scalarization can require many preference-specific policies. Independently adapting each one repeats early updates, while small random samples of preference weights can destabilize meta-training, especially when objectives have different scales. EMNH addresses those training/adaptation costs rather than eliminating preference-specific adaptation (Sections 1-3).

## Contributions

The method introduces shared-body, preference-specific heads during meta-training, cyclic weight sampling adjusted by estimated objective scales, and a hierarchy that reuses coarse adapted policies to initialize nearby preferences. Experiments span bi-/tri-objective TSP variants, bi-objective CVRP and bi-objective knapsack, with learning-efficiency, augmentation, generalization and lightweight-adaptation studies.

This is a specialist constructive framework. Native tasks have distinct input/context/masking rules and separate released checkpoints. “Multi-task” means differently weighted scalarized subproblems of one native problem. After meta-training, the default method adapts complete policy parameters for each preference. Head-only and decoder-only alternatives are additional ablations, not evidence that the main method uses a single unchanged preference-conditioned checkpoint (Appendices D and K).

## Methodology

POMO supplies a six-layer, eight-head, dimension-128 attention constructor and multiple starting-node rollouts. During a meta-iteration, the shared body comprises the encoder and decoder except the final key-projection matrix W_K. Each sampled preference gets its own W_K head. REINFORCE with a per-instance multi-start mean baseline trains all heads and the shared body in parallel. The meta body is copied from the updated body, while the head moves toward the mean updated head using an annealed coefficient; this is the printed Reptile-inspired update, not identical interpolation of every parameter (Algorithm 1).

Scaled symmetric sampling starts from a random simplex weight, cyclically permutes it after correcting for objective-scale estimates and renormalizes. The scales come from validation rollouts at equal objective weights, not known ideal objective values. At deployment preparation, a binary or four-way hierarchy branches from coarse preferences to finer ones. Fine-tuning uses newly sampled, dedicated instances; test instances are subsequently solved without gradient adaptation. Weighted sums produce scalarized objectives, with Tchebycheff studied separately (Sections 4-5; Appendices A-C and J).

## Experiments

TSP/CVRP use sizes 20/50/100 and knapsack 50/100/200, with 200 random evaluation instances per setting. TSP type 1 has separate 2D coordinates per objective; type 2 adds an altitude-derived objective. CVRP minimizes total distance and longest-route distance. Knapsack maximizes two values under one capacity. The default Pareto construction uses 101 bi-objective or 105 tri-objective weights. Quality is normalized hypervolume using fixed reference/ideal points. The reported “gap” is relative to EMNH-Aug's hypervolume, **not** the unknown optimal Pareto front (Tables 1-2; Appendix E).

EMNH is broadly competitive with or better than the tested neural baselines, with many ties. For Bi-CVRP100, EMNH's normalized HV is 0.4072 versus MDRL 0.4056 and PMOCO 0.3913; augmentation gives 0.4079. On larger TSP instances, WS-LKH often has higher HV: Bi-TSP-1 at size100 gives 0.7090 versus EMNH-Aug 0.7023, at substantially higher reported solve time. The tables use a Wilcoxon rank-sum test at 1%, not a complete training-seed uncertainty analysis. Appendix ablations also contain exceptions to blanket superiority, including an MDRL raw-HV advantage in one balanced setting (Tables 1-2; supplement Table 5).

EMNH/MDRL meta-training uses approximately 19.2M sampled instances, versus PMOCO's 20M. Parallel reuse approaches an M-fold training-time reduction versus sequential MDRL in the tested settings, rather than reducing all task/weight adaptation to one forward pass. For bi-objective adaptation the exact hierarchy costs 227K updates; MDRL uses 101 times its per-policy update count. Default K=20 therefore costs 4,540 hierarchy updates. For tri-objective adaptation, (4+16+64+105) times25 equals 4,725 updates, matching 105 times45 for MDRL. These are preparation costs alongside the reported test solving times, not a claim that the fast table inference includes training/adaptation (Figure 4; Appendix F).

Augmentation solves equivalent transformed instances: 64/512 transforms for bi-/tri-TSP type1, 16/128 for type2, eight for CVRP and none for knapsack. Its cost can be substantial, e.g. 1.7 hours for 200 Tri-TSP100 cases. Larger-size transfer trains and fine-tunes at size100 before testing at150/200 and KroAB instances; it does not transfer a common checkpoint between native tasks. Lightweight head/decoder adaptation trades storage and computation for quality, with some CVRP100 improvements but losses on Tri-TSP. Denser weight grids can give denser approximate fronts without an exact-front guarantee (Appendices G-K).

## Limitations

The authors explicitly cannot guarantee the exact Pareto front. Finite weighted-sum policies can miss unsupported nonconvex tradeoffs even with exact scalarized optimization, and learned policies introduce additional approximation. Preference weights do not necessarily yield uniformly distributed solutions; scale estimation and optional weight reassignment mitigate rather than prove uniform coverage. Native-task-specific representations, synthetic training, per-weight adaptation and storage remain relevant costs. The geometric step-count illustration is an order-of-1/L argument with a branching-factor constant and a truncated final level, not an exact universal 1/L reduction.

### Curator Notes

Supplement Algorithm 2 writes greedy rollout and an argmax of g although the main minimization convention defines g as cost. The checked current CVRP validation code instead samples rollout actions and selects the minimum scalarized cost. This is a notation/release discrepancy requiring care in reproduction, not a demonstration that reported experiments are wrong. Table 10 also uses EMDRL labels in the section discussing EMNH variants; the note follows that section's head/decoder-adaptation definitions.

## Reproducibility

- All thirteen pages of the [NeurIPS 2023 article](https://proceedings.neurips.cc/paper_files/paper/2023/file/b1efde53be364a73914f58805a001731-Paper-Conference.pdf) and all twelve pages of its separately linked [scientific supplement](https://proceedings.neurips.cc/paper_files/paper/2023/file/b1efde53be364a73914f58805a001731-Supplemental-Conference.pdf) were read, including all references and Appendices A-K. Twelve key algorithm, result and plot pages were visually inspected, including figures whose text extraction was garbled. Publisher metadata verifies six authors, SYSU/SMU affiliations, DOI 10.52202/075280-2482 and December 15, 2023.
- Manual publisher links identify the twelve-page supplement; no additional scientific attachment is linked. OpenReview API v1/v2 for `593fc38lhN` returned 403. The official 104-file repository tree contains no PDF/ZIP attachment.
- The [official implementation](https://github.com/bill-cjb/EMNH) was checked at commit `f5740a86a1747706efd9a85ac879e6481c30cc8b`. Its full README/configuration and selected complete helper modules plus active CVRP validation/hierarchical-adaptation sections were read. The tree lists 41 PT/PTH files, including separate problem/size checkpoints. No model training, fine-tuning, hypervolume computation or test-solving experiment was rerun. Eighteen exact existing-paper citations are registered with body and full-reference evidence.
