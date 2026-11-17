---
id: general-lns-ilp
short_title: General LNS-ILP
title: A General Large Neighborhood Search Framework for Solving Integer Linear Programs
authors:
- Jialin Song
- Ravi Lanka
- Yisong Yue
- Bistra Dilkina
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/e769e03a9d329b2e864b4bf4ff54ff39-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/e769e03a9d329b2e864b4bf4ff54ff39-Abstract.html
institutions:
- California Institute of Technology
- Rakuten
- University of Southern California
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
- Graph Optimization
- Path Planning
problems:
- Integer Linear Programming
- Weighted Minimum Vertex Cover
- Weighted Maximum Cut
- Combinatorial Auction Winner Determination
- Risk-Aware Path Planning
summary: Task-specific decomposition policies and random partitions guide time-limited ILP repair; imitation improves
  selected bounded-time results.
---

# A General Large Neighborhood Search Framework for Solving Integer Linear Programs

> **TL;DR:** Partition integer variables into neighborhoods and let Gurobi optimize each while others stay fixed. Random partitions are already strong; task-specific imitation improves selected cases, whereas basic REINFORCE is not uniformly beneficial.

## Motivation

Embedding learned decisions deep inside a commercial solver can require unavailable interfaces or expensive callbacks. This work instead wraps an existing solver with decomposition-based large-neighborhood search, seeking better bounded-time feasible solutions through a generic ILP interface (Sections1–3).

## Contributions

- Disjoint variable groups define a sweep of fix-and-optimize subproblems, each solved by an off-the-shelf ILP engine.
- Random partitions provide a strong reference. Behavioral cloning, forward-training imitation and REINFORCE learn task-specific decomposition policies.
- Experiments compare bounded-time objectives with Gurobi9.0 and specialized heuristics on weighted vertex cover, weighted max cut, auction winner determination and risk-aware path planning. Generality refers to the framework/interface, not one shared trained model across tasks.

## Methodology

**Neighborhoods.** Given a feasible solution and a decomposition into kdisjoint subsets, sequentially free one group, fix other integer variables at their current values, and call the solver. A full sweep processes each group; later sweeps can change the partition. Subproblems receive time limits, so the ideal description of local optimization should not be read as every neighborhood reaching a proven optimum. This is an incomplete primal heuristic rather than a complete global search (p.4,Algorithm1).

**Learning.** The state is the incumbent assignment, with fixed instance features; an action assigns each variable to a group. Reward is objective improvement after a sweep and the finite-horizon discount is1. Demonstrations are selected from multiple random-partition rollouts by final objective. Behavioral cloning classifies variable group labels from those trajectories. Forward training instead collects new one-step demonstrations after each learned stage, returning a sequence of policies for successive stages. REINFORCE samples trajectories to estimate return-weighted policy gradients (pp.4–6,Algorithms2–3).

**Representation.** Graph tasks use weighted adjacency; general ILPs use a variable–constraint coefficient matrix. PCA reduces feature dimension and current variable values are appended. The predictor is a fully connected ReLU/softmax network, not a GNN: MVC uses100→300→2, MaxCut300→100→5, CATS2000 uses100→300→100→2, CATS4000 uses400→300→2, and path planning500→100→3. These different task/input architectures support specialist classification (supplementA.3,Table14).

**Configuration and initialization.** Sweep kfrom2to5and subproblem limits1–3seconds, selecting improvement per elapsed time. Initial solutions are all vertices for vertex cover, one cut side for max cut and no accepted bids for auctions; path planning uses a3-second Gurobi initialization counted in comparisons. The paper calls configured groups equally sized, while neural group-label classification and its balancing details are not fully specified in the PDF. This detail needs the actual implementation for exact reproduction (pp.6–7; supplementA.1).

## Experiments

**Data and budgets.** Weighted MVC uses1000vertices, weighted max cut500vertices, each under ER/BA graph distributions with uniform[0,1]weights. CATS uses regions/arbitrary distributions and2000items/4000bids or4000/8000. Path-planning maps contain30or40obstacles. Learned experiments use100train/10validation/50test instances, averaged over five seeds; RL samples five trajectories per problem and imitation selects among five random decompositions. Main runs apply10decomposition sweeps; Gurobi gets the longest LNS runtime across the compared instances, giving it at least the wrapper's time budget. Additional time-profile plots use100sweeps on selected representative instances (pp.6–8).

**Main objectives.** All variants improve the reported aggregate objectives over standalone Gurobi in Tables1–3. Yet learning does not always beat random LNS: MVC-BA random433.59 beats RL434.16 and MVC-ER471.21 beats RL471.52; max-cut-ER random−5488.49 beats RL−5481.57 in the minimization representation. Auction arbitrary4000 BC−172268.1 beats FT−169846.7; path30obstacles BC0.5876 slightly beats FT0.5883. Thus forward training/RL have task-dependent effects, rather than an unconditional learned advantage (Table1–3).

**Specialized comparisons.** Best-LNS improves the selected weighted vertex-cover and auction heuristic baselines. On MaxCut, Burer's rank-two-relaxation heuristic is better: BA−3647.46/ER−5568.18 versus best-LNS−3586.29/−5496.29. This directly limits claims of state-of-the-art across all compared methods (Tables4–5).

**Time and solver integration.** Figure2's2–10X and one MaxCut example where a5-second Random-LNS solution beats a2-hour Gurobi run are representative-instance profiles, not aggregate speedup guarantees. Table6 contrasts published learned-SCIP brancher times with Gurobi; it changes both software backbone and decision method, so it does not isolate a causal benefit of LNS or show every learned brancher inferior. A separate CATSregions2000 experiment replaces repair with SCIP and again reports better bounded-time objectives from LNS (pp.8–9).

**Interpretation.** The appendix's path-planning visualization shows frequently grouped obstacles/waypoints near important updates on a20-obstacle example. It is qualitative evidence, not a theorem that the learned partition identifies a backdoor or an optimal problem decomposition (supplementA.2).

## Limitations

### Discussed in the Paper

The framework relies on a good repair solver and targets bounded-time feasible solutions; complete optimal solving, adaptive configuration and broader structural understanding are future work. A specialized MaxCut heuristic can outperform it, and stronger RL may be needed to improve the simple REINFORCE variant (Sections5–6).

### Curator Notes

A generic ILP wrapper is distinct from shared cross-native-task weights. The reported policies have task-dependent PCA/input dimensions and heads, and no unchanged-model cross-task transfer is shown. Feasible objective comparisons do not supply certified optimality gaps. Offline demonstrations/configuration costs, solver versions and task-specific initialization matter for timing. Group-label symmetry, balancing, PCA fitting and detailed optimizer/training schedules are not fully documented in the paper/supplement, so full reproduction requires additional artifacts rather than assumptions.

## Reproducibility

- Fully reviewed12-page [NeurIPS2020 paper](https://proceedings.neurips.cc/paper_files/paper/2020/file/e769e03a9d329b2e864b4bf4ff54ff39-Paper.pdf) and all3pages of the [official appendix](https://proceedings.neurips.cc/paper_files/paper/2020/file/e769e03a9d329b2e864b4bf4ff54ff39-Supplemental.pdf), including every configuration table, architecture and plot. The [formal proceedings record](https://proceedings.neurips.cc/paper_files/paper/2020/hash/e769e03a9d329b2e864b4bf4ff54ff39-Abstract.html) links both.
- No author-confirmed implementation link was established from the paper, supplement or publication page in this audit; related implementations are not relabeled as official. No LNS training, Gurobi/SCIP run or heuristic comparison was rerun.
