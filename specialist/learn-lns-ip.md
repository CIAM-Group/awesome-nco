---
id: learn-lns-ip
short_title: Learn-LNS
title: Learning Large Neighborhood Search Policy for Integer Programming
authors:
- Yaoxin Wu
- Wen Song
- Zhiguang Cao
- Jie Zhang
year: 2021
date: '2021-12-06'
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/hash/fc9e62695def29ccdb9eb3fed5b4c8c8-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2021/hash/fc9e62695def29ccdb9eb3fed5b4c8c8-Abstract.html
institutions:
- Nanyang Technological University
- Shandong University
- A*STAR
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
- Graph Optimization
- Set Selection
problems:
- Integer Programming
- Set Covering
- Maximum Independent Set
- Combinatorial Auction Winner Determination
- Maximum Cut
summary: Task-specific factorized graph policies select LNS neighborhoods for bounded-time IP repair, with best-observed
  primal-gap evaluation.
code_url: https://github.com/WXY1427/Learn-LNS-policy
---

# Learning Large Neighborhood Search Policy for Integer Programming

> **TL;DR:** A task-trained graph policy samples a variable mask for large-neighborhood search, then a time-limited IP solver repairs that neighborhood. Parallel Bernoulli decisions avoid enumerating subsets, with heuristic quality measured against observed reference solutions.

## Motivation

Internal learned branching requires solver callbacks and can be costly at large scale. This work instead controls an external destroy operator, using an existing solver to optimize a restricted neighborhood. The main modeling challenge is selecting a useful subset from exponentially many variable masks without explicitly scoring every subset (Sections1–4).

## Contributions

- A variable–constraint GNN shares parameters across variable decisions and supports different instance sizes.
- A conditionally factorized Bernoulli mask permits variable neighborhood cardinalities, unlike the fixed-cardinality grouping baseline.
- A customized actor–critic uses one global subset Q-value to update parallel variable decisions. Separate SCIP/Gurobi task experiments and per-instance MIPLIB active search test different applications of the framework (Sections4–5).

## Methodology

**LNS and objective.** Starting from a feasible incumbent, sampled variables are freed while others retain their current values. The repair solver returns a new feasible solution; reward is the decrease in the minimization objective. Equation1 idealizes repair as an exact sub-IP argmin, but experiments impose short repair time limits, so neighborhoods need not be solved to optimality. The overall method is a primal improvement heuristic without a global optimality certificate (pp.4,7,10).

**Policy.** Conditioned on the graph state, independent Bernoulli probabilities define a product distribution over masks. This assigns support to all subsets before rejection, but cannot represent every correlated joint distribution over subsets. Empty/full masks are rejected by resampling and probabilities clipped to[0.2,0.8]. The GNN can coordinate probabilities through shared state embeddings, while the sampled bits remain conditionally independent before rejection (pp.5–6).

The residual bipartite GCN uses128-dimensional variable/constraint embeddings, two alternating message rounds, layer normalization and Tanh. A256/128-hidden-unit MLP outputs each variable's selection probability. State features include root-presolve variable statistics, current/incumbent/historical-average values, constraint RHS and matrix coefficients. Zero-variance variable features are removed (paperpp.5–7; supplementA.1,A.4).

**Learning.** The critic adds a selected-bit feature to variables and mean-pools their embeddings into one subset Q-value. Global TD targets train the critic; this shared Q-value weights the sum of variable log probabilities for the actor. A per-elementary-action critic variant performs worse, and the semi-shared network comparison has an MIS exception rather than uniformly favoring shared heads. Training uses200 iterations,10 instances per iteration, Adam0.0001, gamma0.99 and four replay updates. Training episodes have50/50/70/100 steps for SC/MIS/CA/MC, with2-second SCIP repairs (pp.6–7; supplementA.2–A.3).

## Experiments

**Scope and data.** Models train separately on set cover, maximum independent set, combinatorial-auction winner determination and maximum cut, with100/20/50 train/validation/test instances per family. The paper calls MIS “maximal” in places, but the cardinality objective is maximum independent set. Size transfer doubles/quadruples encoded variable counts; MC's500-vertex graph already has2975 IP variables. This is within-family transfer, not one shared checkpoint across the four optimization tasks (p.7,Table1).

**Metrics and SCIP results.** SCIP6.0.1 and all LNS methods receive200seconds, with additional SCIP500/1000-second comparisons. Gaps are averaged per-instance relative differences from the best solution found by the compared methods, using max absolute objective magnitude in the denominator. They are not certified optimality gaps, and0% can mean “best observed” rather than optimum. Objective standard deviations are across50 instances, not uncertainty from repeated independent training (p.8).

At200seconds, learned LNS reports gaps0.68%,0.06%,0.77%,0.27% for SC/MIS/CA/MC versus SCIP3.62%,0.29%,2.98%,4.37%. SCIP1000seconds improves SC to0.53%, beating learned200-second SC. On larger groups, SCIP1000seconds also beats learned200seconds on SC2,CA2,SC4. The500-second learned tests in Table4 improve the aggregate objectives versus SCIP1000seconds, but this does not establish equal quality for every instance (pp.8–9).

**Gurobi.** Gurobi9.0.3 experiments retrain with reduced static features, a2-second initial solve and1-second repairs; they are not zero-shot reuse of a SCIP-trained checkpoint. Most tests use100seconds, while MIS uses20seconds because the solver already solves most training cases in about40seconds. SupplementA.7 contains a negative SC4 transfer case: learned objective177.66 is worse than U-LNS176.84 and R-LNS176.08, although better than standalone Gurobi183.60. Short-horizon FT-LNS can beat its random-demonstration baseline, qualifying its poorer long-budget results (paperpp.9–10; supplementA.5–A.7).

**MIPLIB.** Thirty-five selected hard/open pure-integer instances exclude small/easy cases and instances for which neither solver finds feasibility within3600seconds. Each instance receives active RL adaptation using Gurobi repairs, initialized by a100-second Gurobi solution; active search has a stated1000-second limit. This is per-instance learning on a filtered benchmark, not held-out shared-policy inference. The paper reports an improved historical incumbent for `neos-3682128-sandon`; no claim is made here about today's best-known value (supplementA.8).

The main aggregate statement that24/35 cases beat both solvers should not be repeated without qualifications: TableA.5 includes contradictory highlighting. For example, on the displayed minimization instance `ns1828997`, learned128 is worse than SCIP43 at1000seconds and32 at3600seconds, yet is marked as beating both3600-second solvers. This audit relies on individual reported objective values and explicitly records that aggregate-table inconsistency.

## Limitations

### Discussed in the Paper

The method targets bounded-time improvement, cannot certify global optimality and is not compared sufficiently to conclude superiority over specialized highly optimized algorithms. Future work includes mixed-integer problems and combining learned components (Section6).

### Curator Notes

General IP syntax and a shared architecture do not establish generalist weights: benchmark policies specialize by family and solver, while MIPLIB adapts on each instance. Time-limited repairs are not exact Equation1 transitions in general. Best-observed primal gaps depend on the comparison pool and cannot certify true optimality. Product masks restrict joint action distributions even while allowing exponentially many possible masks.

SupplementAlgorithm1 prints a positive gradient update on squared TD error for the critic; minimizing that error normally requires descent. This sign convention should be checked against the actual optimizer before reproducing training, rather than silently treating the printed pseudocode as a verified optimization guarantee. MIPLIB's separately stated100-second initialization and1000-second active-search budget also require explicit accounting in any timing reproduction.

## Reproducibility

- Fully read13-page [NeurIPS2021 publisher paper](https://proceedings.neurips.cc/paper_files/paper/2021/file/fc9e62695def29ccdb9eb3fed5b4c8c8-Paper.pdf) and all5pages of the [official supplement](https://proceedings.neurips.cc/paper_files/paper/2021/file/fc9e62695def29ccdb9eb3fed5b4c8c8-Supplemental.pdf), including all algorithms, features, negative cases and MIPLIB rows. Both are linked on the [publication record](https://proceedings.neurips.cc/paper_files/paper/2021/hash/fc9e62695def29ccdb9eb3fed5b4c8c8-Abstract.html).
- Author-linked [WXY1427/Learn-LNS-policy](https://github.com/WXY1427/Learn-LNS-policy) supplies task-specific code folders and train/test instructions with learn2branch dependencies. No LNS, solver, active-search or optimality-certificate experiment was rerun in this audit.
