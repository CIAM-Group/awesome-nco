---
id: rlcg
short_title: RLCG
title: A Deep Reinforcement Learning Framework for Column Generation
authors:
- Cheng Chi
- Amine Mohamed Aboussalah
- Elias B. Khalil
- Juyoung Wang
- Zoha Sherkat-Masoumi
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/3ecfe5c632afb7d96a2337b18ff99b1f-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/3ecfe5c632afb7d96a2337b18ff99b1f-Abstract-Conference.html
institutions:
- University of Toronto
- New York University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
- Routing
- Packing
problems:
- Column Generation
- Cutting Stock
- Vehicle Routing Problem with Time Windows
summary: Task-specific GNN/DQN policies select CG columns for LP relaxations; empirical early-stopped runtime gains
  do not certify full integer optimality.
code_url: https://github.com/khalil-research/RLCG
---

# A Deep Reinforcement Learning Framework for Column Generation

> **TL;DR:** A bipartite GNN/DQN chooses one candidate column per iteration to accelerate column generation. CSP and VRPTW use separately trained policies. Experiments concern their LP relaxations, with early stopping that can change final objective quality; full integer branch-and-price acceleration is proposed rather than demonstrated.

## Motivation

Choosing the most negative reduced-cost column is locally attractive but may prolong later restricted-master solves. RLCG treats the sequence of column additions as a decision process and trains to favor future progress, while retaining classical restricted-master and pricing solvers (Sections1–3).

## Contributions

- A sequential RL formulation for selecting columns from a classical pricing solver's solution pool.
- Bipartite graph states encode existing columns, candidate columns, constraints and changing basis information.
- Problem-specific easy-to-hard curricula and tests on larger CSP/VRPTW instances assess iteration counts and inclusive solver runtime (Sections4–5/AppendicesA–K).

## Methodology

**Scope.** Cutting-stock patterns or vehicle routes become exponentially many master variables. The restricted master optimizes continuous weights for a subset; classical pricing searches for useful omitted columns using dual values. The neural policy selects among returned negative-reduced-cost candidates, not among all possible columns. Classical exact pricing and absence of negative reduced costs underpin standard LP optimality. They do not give integer optimality, and RLCG's practical early-stop rule need not establish even the fully converged LP optimum. The paper explicitly restricts evaluation to LPs; integrating the policy into branch-and-price is future work (Sections1/3/6).

**State/action/network.** Constraint nodes connect to columns with nonzero coefficients. Nine CSP column features include reduced cost, connectivity, primal value, waste, basis-entry/exit history and candidate status; two constraint features are dual value and connectivity. VRPTW substitutes route cost and uses an eight-feature variant. Candidate nodes are appended to the current graph, one is selected, others discarded, and a new master/pricing solve creates the next state. Variable→constraint and constraint→variable message passing feeds a column-wise Q-value head. Gurobi's near-optimal solution pool provides up to ten candidates, so the controller relies on substantial classical optimization at each step (Section4/AppendicesD/G).

**Learning.** DQN with replay minimizes a bootstrapped squared Q loss. The printed reward is `α(objective_previous−objective_current)/objective_initial−1`; α trades immediate progress against iteration count. CSP curricula order400instances by stock length/orders; VRPTW orders240small instances by clustered, random, then mixed geography. Hyperparameter selection samples31of81combinations using30CSPvalidation instances; the selected printed configuration is α300,ε.05,γ.9,learning rate.001, then reused as hyperparameters for a **new VRPTW model**. Training takes about8–10CPUhours per curriculum; it is not one shared checkpoint across the two native problems (Sections4.2/5/AppendicesA–F).

**Classification.** Specialist / constructive denotes task-specific learned column-generation control within a classical solver. The NN does not directly edit a complete feasible integer cutting/routing incumbent. Common GNN architecture and transferred hyperparameters do not establish shared trained cross-native-task weights.

## Experiments

**Data and clocks.** CSP BPPLIB uses400train/30validation/156test instances: train stock lengths50/100/200 and test counts49/86/21at50/200/750. The final21large cases are unseen-size tests. Solomon VRPTW uses240training prefixes of5–8customers,60small tests and37larger tests described as15–30customers. Some test prefixes derive from the same original Solomon instances with different customer counts; this is not a wholly base-instance-disjoint protocol. The per-instance table also includes14customer cases, slightly outside the stated large range. TensorFlow2.7/Gurobi9.5 run on two2.3GHzHaswellXeon CPUcores. Reported time includes GNN inference and feature construction (Section5/AppendicesC/E).

**Results.** The abstract reports22.4%/40.9%fewer CGiterations for CSP/VRPTW. Detailed CSP means for lengths50/200/750 change51.2→41.6,78.0→64.7,292.8→227.2iterations and6.0→4.9,22.3→18.1,640.8→460.3seconds versus greedy. The expensive one-step MILP expert requires7.1/29.3/827.9seconds; it is omitted for VRPTW because of cost. Small/large VRPTW means change18.8→9.5/128.1→75.6iterations and291.1→179.9/3268.2→1832.8seconds. These are aggregate improvements, with meaningful instance variability (Section5/Tables6–7).

**Quality and negative cases.** SupplementH explicitly attributes differing final objectives to early stopping: CSP mean objectives are23.4/91.1/327.6greedy versus23.5/91.5/328.6RLCG, slightly worse for this minimization problem. Therefore the clocks do not compare an identical exact optimum across methods. Per-instance negatives include `BPP_50_200_0.1_0.8_7`:59→75iterations and8.85→12.93seconds; `BPP_750_300_0.1_0.7_9`:251→266and518.30→576.85; VRPTW`r205,n19`:11→16and1498.44→2213.35. Some cases trade longer time for a better relaxed objective. Curriculum validation improves over randomized ordering, but deterministic test runs do not eliminate training-seed uncertainty; the supplement reports only a small five-seed validation sensitivity check (AppendicesA/B/H–K).

## Limitations

### Discussed in the Paper

Only one column is selected per iteration; selecting subsets would create a combinatorial action space. Branch-and-price for full integer problems and multiple-column control are extensions. Training is distribution-dependent and pricing can be expensive (Section6).

### Curator Notes

- Rendered p4 retains `λ∈N` in the supposedly relaxed RMP and prints minimization of dual-weighted pricing. The released CSP environment uses continuous master variables and **maximizes** dual-weighted packing, which matches its reduced-cost test. Treat these printed formulations as inconsistent notation, not as the implemented LP algorithm.
- The main text calls the one-step expert an upper bound on the performance of any supervised imitator. Approximate imitation does not mathematically prevent outperforming a teacher on some states or longer trajectories; no such general upper-bound theorem is proved.
- Hyperparameter Figure10/table interpretation reverses the stated RLCG/greedy ratio: values above1are presented as good. SupplementTable1also lists α5/βsettings while the tuning description selects α300. Current VRPTW notebook parameters are α5,γ.99,ε.2,batch16, different from the printed best configuration. These are recorded inconsistencies rather than silently reconciled experimental settings.
- Current CSP code stops when pricing objective<1.01 or ten consecutive objective changes≤.1 and adds a terminal reward not in the printed equation. This explains why a standard exact-CG guarantee cannot be assigned unconditionally to reported practical clocks. No rerun or claim that all paper results are invalid is made.

## Reproducibility

The [formal proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/3ecfe5c632afb7d96a2337b18ff99b1f-Abstract-Conference.html) identify NeurIPS2022volume35, pp9633–9644, DOI10.52202/068431-0700, issued2022-12-06. Formal p1 spells **Amine Mohamed Aboussalah** and **Elias B. Khalil**, retained here despite shortened HTML names. All12main and12publisher-linked supplementary pages, including checklist, all plots/configurations/features and full per-instance tables, were read. Key equations and table layouts were rendered for visual checking.

The [author-group repository](https://github.com/khalil-research/RLCG) identifies this paper in its README. Its complete1197-entry untruncated tree contains CSP Python sources and one VRPTW implementation notebook, with no extra scientific PDF/TeX. All notebook narrative cells and saved result outputs were inspected, along with relevant pricing/master, learning, train/test and parameter code. The notebook's saved means differ from Table7 and do not establish replication. Separate CSP/VRPTW training scripts support the specialist classification. The original arXiv-linked personal repository and current research-group repository are provenance links, not a claim of byte-identical formal-release software.

**Internal citations.** Explicit text plus bibliography verify [GCNN branching](gcnn-branching.md), [Learning CO over Graphs](learning-co-over-graphs.md), [Neural Combinatorial Optimization](neural-combinatorial-optimization.md; cited2016arXivversion) and [Learning to Cut](../generalist/learning-to-cut.md). Shared method descriptions or repository names do not create additional citation edges.
