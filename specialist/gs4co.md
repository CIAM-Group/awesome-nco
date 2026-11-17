---
id: gs4co
short_title: GS4CO
title: 'Towards General Algorithm Discovery for Combinatorial Optimization: Learning Symbolic Branching Policy from
  Bipartite Graph'
authors:
- Yufei Kuang
- Jie Wang
- Yuyan Zhou
- Xijun Li
- Fangzhou Zhu
- Jianye Hao
- Feng Wu
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/kuang24a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/kuang24a.html
institutions:
- University of Science and Technology of China
- Huawei Noah's Ark Lab
- Tianjin University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Offline Transformer discovery exports compact graph-symbolic branching rules, including unchanged auction-to-MIS
  transfer; CPU gains have explicit task, GPU and implementation exceptions.
code_url: https://github.com/MIRALab-USTC/L2O-GS4CO
---

# Towards General Algorithm Discovery for Combinatorial Optimization: Learning Symbolic Branching Policy from Bipartite Graph

> **TL;DR:** An offline Transformer/PPO search discovers compact symbolic graph-aggregation policies that imitate strong branching. The deployed policy is an ordinary symbolic tensor expression plus SCIP, with an explicitly shared auction-trained expression transferred unchanged to MIS. CPU efficiency is promising but has documented task and implementation exceptions.

## Motivation

GNN branching policies can be expensive on CPU and difficult to inspect. Distilling each GNN message-passing layer into a symbolic function can compound approximation error. GS4CO directly searches a grammar containing graph-aggregation functions, seeking interpretable branching scores with inexpensive deployment (Sections1-4/Figure2).

## Contributions

- A symbolic grammar represents variable-to-constraint and constraint-to-variable aggregation plus a final per-variable score.
- A decoder-only Transformer generates expression trees with positional, layer, parent/sibling and relational encodings.
- Risk-seeking PPO optimizes imitation accuracy on full-strong-branching(FSB) demonstrations; expression length and grammar constraints guide search.
- Exported formulas support CPU inference, size transfer and an explicitly reported auction-to-MIS policy transfer, alongside deployment/interpretability analyses.

## Methodology

**Graph symbolic policy.** Inputs use19 variable features,5 constraint features and1 edge coefficient. Mathematical operators/constants and min/max/mean/sum aggregations define nested expression trees. C-side functions aggregate variable information into constraints; V-side functions aggregate back to variables; the main function selects the highest-scoring valid branching candidate. At most two aggregation layers and expression length4-64 are allowed. All deployed paper formulas use two-hop structure and a subset of node features, not their edge coefficient; graph adjacency still matters even when the numeric edge feature is absent (Sections4.2-4.3/AppendixA).

**Neural discovery.** Depth-first tree traversal yields tokens for a4-layer decoder Transformer with dimension32,4heads and feed-forward width128. Fitness is the proportion of FSB-labeled states where the formula's selected variable ties a maximum FSB score, rather than solver runtime itself. PPO optimizes the top20% reward tail with entropy/soft-length regularization and learning rate5e-5; stagnation for2000iterations stops search. The top ten imitation formulas are subsequently compared on validation solve performance. The final solver evaluates an exported Python/PyTorch expression; it does not run the Transformer at every B&B node (Sections4.3-5.1/AppendixB/TableB7).

**Deployment.** The symbolic rule is used while depth<25, followed by reliability pseudocost branching(RPB). The release uses patched SCIP6.0.1/PySCIPOpt, disables restart and cuts beyond root, and evaluates CPU expressions by default. Exact branch partition/search, not a learned certificate, establishes optimality if SCIP completes. CPU user-time, process-time and elapsed wall-time are separately collected; these must not be conflated when reproducing Table1.

**Transfer and classification boundary.** TableB5 explicitly uses the same auction-trained formula for both Cauctions and Indset. The actual evaluation and accuracy-test entry points remap indset to cauctions before loading the formula, independently confirming this genuine fixed-policy transfer. The unused distinct expressions/indset file is not evidence of a contradictory deployed policy. Set-cover/facility rules are separately learned. The repository's current generalist taxonomy concerns shared neural models/checkpoints, so this entry remains specialist constructive while prominently recording its shared exported symbolic-policy capability. It must not be described as lacking cross-task policy sharing (AppendixA/TableB5/release entry points).

## Experiments

**Protocol and cost.** Four families are set covering, auction, facility location and MIS. Main settings and TableB7 give100training/20validation instances with10000/2000 FSB states for GS4CO, versus10000/2000 instances and100000/20000 states for learned baselines. Training uses XeonPlatinum2.5GHz and TeslaV100. Main Table1 evaluates50 instances per easy/medium/hard size at3000seconds with SCIP seed0 and reports shifted geometric means and wins/solved counts. FSB data reduction does not measure all neural search, fitness evaluation and validation-solving cost; total offline speedup is not established (Sections5.1-5.2/AppendixB).

**CPU gains and exceptions.** On MIS, GS4CO times53.18/217.67/2157.23s improve Hybrid61.83/309.91/2223.04, with37/50 hard cases solved versus33. Auction times3.16/30.58/326.19 improve Hybrid3.35/33.12/351.75. Set-cover13.29/103.74/2100.53 also improve Hybrid13.88/105.13/2160.35. Facility easy/medium are exceptions: GS4CO76.27/295.82 is slower than Hybrid71.11/284.24; facility hard improves1018.70 versus1219.91. Hence “outperforms all CPU baselines” is not true for every reported setting. Node counts are not uniformly lower, and small FSB trees that time out are not quality wins (Table1).

**GPU and implementation comparisons.** GNN-GPU beats GS4CO on all auction/set-cover/facility time columns shown; hard set cover is2011.74s with50solved versus GS4CO2100.53 with29solved. The claimed benefit is therefore primarily CPU deployment. AppendixD13's C-implemented Symb4CO is faster on auction2.87 versus3.16 and facility60.26 versus76.27, while GS4CO is faster on MIS53.18 versus55.43 and set cover13.29 versus13.45. Python Symb4CO is also faster on facility73.32 versus76.27. These explicit counterexamples qualify broad deployment superiority (Tables1,D13).

**Accuracy, compactness and sensitivity.** GS4CO imitation accuracy44.13/66.78/40.78/41.13% is lower than GNN54.18/69.33/56.42/47.50, despite often better CPU solve time. The set-cover symbolic artifact is0.49KB versus GNN266KB and per-inference time1.84 versus33.88ms; this compares deployed policies, not the discovery Transformer's full size or all solve overhead. Aggregation depth2 improves all four displayed accuracies over depth0. Tree encodings/constraints help several tasks but tie on facility and show some ablation exceptions. In TableD11, set-cover700rows/density.03 has GS4CO time ratio1.31 relative to RPB, so robustness does not mean universal improvement (Tables2-3,D8-D12).

## Limitations

### Discussed in the Paper

The grammar/search space grows rapidly with expression complexity. Human-designed graph node features remain necessary. Mathematical readability does not remove the need for domain expertise to interpret a rule. The work currently studies variable branching; richer execution logic, node selection, primal heuristics and basis selection are future work. It explicitly trades some imitation accuracy for compact policies (ImpactStatement/AppendixC).

### Curator Notes

The paper provides empirical symbolic discovery and no theorem guaranteeing best branching, search convergence, polynomial solution time or general task coverage. Imitation reward can disagree with runtime; the validation solve selection and RPB fallback materially affect deployed results. A formula's readable terms do not establish causal explanations of why it solves faster.

The source has unresolved protocol inconsistencies: AppendixB's data paragraph says10/4 instances,1000/400 state examples and80 test instances per difficulty, unlike main text/TableB7's100/20,10000/2000 and Table1's50. Algorithm1 says output highest validation fitness while main text chooses best validation end-to-end performance among ten formulas. AppendixB's displayed shifted-geometric-mean expression omits the usual final subtraction of1. These statements are recorded without silently choosing a historical implementation. Current YAML uses512 sampled expressions rather than the paper500 and exposes a broader constant set/simple-operator default. Those are version/configuration distinctions, not independent invalidation of the tables.

The fixed auction-to-MIS formula is real and code-confirmed, but does not imply a shared Transformer checkpoint across every native problem or a task-independent optimization guarantee. The current taxonomy boundary is retained consistently with other symbolic-discovery entries.

## Reproducibility

- **Publication:** [ICML2024/PMLR235](https://proceedings.mlr.press/v235/kuang24a.html), pages25623-25641; official HTML issued July8,2024. Seven authors and USTC/Huawei/Tianjin affiliations checked against page1.
- **Coverage:** all19 proceedings pages, bibliography and AppendicesA-D; all symbolic formulas, algorithms, figures and tables read/rendered. PMLR lists only PDF/OpenReview; ordinary API ULleq1Dtaw returned403. Official ICML event33946's full scientific poster PNG was downloaded/read/visually inspected, with no additional PDF discovered. Author47355byte ZIP inventory contains code/expressions and no scientific PDF/TeX/notebook attachment.
- **Implementation:** [MIRALab-USTC/L2O-GS4CO](https://github.com/MIRALab-USTC/L2O-GS4CO), README/requirements, Transformer/PPO training, four expression files, grammar/configuration and actual evaluation/accuracy entry points inspected. Patched SCIP6.0.1/PySCIPOpt branches are explicitly linked. Exported formula deployment needs no Transformer checkpoint. No formula was executed and no solver/training benchmark was rerun.
- **Relations:** seven explicit current-catalogue citations matched by actual body and bibliography: GCNN, Hybrid Branching, HEM, Learning to Cut, L2Dive, learned B&B node comparison and Symb4CO. Generic graph/Transformer references are not emitted as invented NCO entries.
