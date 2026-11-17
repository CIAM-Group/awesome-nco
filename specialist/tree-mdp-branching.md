---
id: tree-mdp-branching
short_title: TreeMDP Branching
title: Learning to Branch with Tree MDPs
authors:
- Lara Scavuzzo
- Feng Yang Chen
- Didier Chételat
- Maxime Gasse
- Andrea Lodi
- Neil Yorke-Smith
- Karen Aardal
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/756d74cd58592849c904421e3b2ec7a4-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/756d74cd58592849c904421e3b2ec7a4-Abstract-Conference.html
institutions:
- Delft University of Technology
- Polytechnique Montreal
- Mila
- Cornell Tech
- Technion
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
- Graph Optimization
- Set Selection
- Facility Location
- Knapsack
problems:
- Mixed-Integer Linear Programming
- Set Covering
- Combinatorial Auction Winner Determination
- Maximum Independent Set
- Capacitated Facility Location
- Multiple Knapsack
summary: Tree policy gradients improve selected task-specific RL branchers under explicit tree-Markov training conditions.
code_url: https://github.com/lascavana/rl2branch
---

# Learning to Branch with Tree MDPs

> **TL;DR:** Tree MDPs credit a branch with rewards from its descendants. This improves selected RL learning curves under specific training conditions, while learned branching remains weaker than imitation or SCIP on most evaluated families.

## Motivation

Temporal RL credits a branching decision with rewards from subsequently processed nodes that may lie outside its subtree. Long, policy-dependent B&B episodes make this expensive and noisy. The paper formalizes a tree-structured alternative that separates descendant outcomes, instead of learning another approximation of strong branching (Sections1–3).

## Contributions

- A binary tree MDP and tree Markov property support a policy-gradient identity involving only descendant returns.
- Two sufficient training settings make vanilla B&B satisfy the required bound-transition condition: fixed optimal objective limit or left-first depth-first traversal.
- REINFORCE experiments compare temporal and tree credit assignment across five task-trained MILP benchmarks, evaluating the learned policies without the special training objective limit or DFS rule (Sections4–5).

## Methodology

**Theory and assumptions.** A finite tree episode has states at nodes, actions at non-leaves and conditional child transitions. Tree Markov independence requires each child/subtree to depend on the local state/action rather than non-descendants. Proposition4.1 derives an expected gradient summing score-function terms times descendant rewards. It is an identity for that model, not a proof of lower gradient variance, convergence to the best brancher, or polynomial-time optimization (pp.5–6; supplementA.1–A.2).

For vanilla B&B, state is the local sub-MILP plus its global upper bound. Assumption4.2 requires both children's upper bounds to be derivable from that state and branch. Ordinary interleaved search can violate it, as the paper's one-variable counterexample shows. A known optimal objective value fixes all upper bounds; alternatively left-first DFS completes the left subtree before the right and determines its incoming bound. Objective-limit training therefore requires offline optimal values, whereas DFS trades that requirement for potentially longer episodes. Assumption4.6 also requires a node-additive state reward:−1 per node gives negative tree size; runtime fits only under additional assumptions about local LP/decision costs and negligible other components (pp.6–7).

**Implementation.** A Gasse-style bipartite GNN with local solver features parametrizes each branching policy. It does not observe the full temporal search state, so the temporal comparison is a POMDP. Plain REINFORCE with entropy regularization trains three variants: temporalMDP, tree+DFS and tree+ObjLim. Each epoch samples10instances, collects completed solver episodes and subsamples state/action/return tuples; tree returns are computed bottom-up. Training stops after15000epochs or sixdays. Restarts and non-root cuts are disabled (p.8,Algorithm1).

**Deployment.** Both special training settings are removed during evaluation; the solver returns to its normal node selection and no supplied optimum. The paper explicitly does not prove this transfer valid and assumes its effect is negligible for its empirical study. The retained solver supplies valid branching, bounding and completion guarantees; policy-gradient theory supplies no guarantee of best solver performance (Sections4.4,5).

## Experiments

**Data and scope.** Five separately trained families each use10000training instances,20validation and40test/40larger-transfer instances. Auction sizes grow100items/500bids to200/1000; set cover400elements/750sets to500/1000; MIS500to1000vertices; facility location35to60customers with35facilities; multiple knapsack100items in6to12knapsacks. This is within-family size transfer, not one cross-family optimization checkpoint (supplementTable4).

The supplement calls MIS graphs Erdos–Renyi with affinity4, but the checked official generator invokes `Graph.barabasi_albert` with affinity4. The note preserves this paper/code provenance discrepancy rather than assert those generators are equivalent.

**Metrics and selection.** Every evaluated instance is solved with five seeds and a one-hour cap. MainTable1 reports geometric mean tree size only on instance/seed runs completed by all methods, with average within-instance seed variation; the supplement gives corresponding times and timeout counts. Excluding any run that times out for any method changes the evaluation population, so these means must be paired with Table3 failures. Learning curves use processed sample counts as a hardware-independent proxy, not measured wall-clock training speed (pp.8–10; supplementA.3).

**Results.** Tree variants generally improve learning curves and offer better RL branching on selected cases, but not every variant improves every mean. On auctiontest, ObjLim87.0nodes is slightly worse than temporal86.7. On MIStransfer, DFS2970nodes is worse than temporal2768.5. On four of five families, SCIP or strong-branching imitation remains better in tree size; e.g.auctiontransfer SCIP733.9versus tree1841.9/1804.6, and set-covertransfer SCIP61.4versus tree826.4/816.8 (Table1).

Multiple knapsack is the favorable exception for tree size: transferObjLim425.3nodes versus temporal518.4, SCIP592.3 and imitation1066.1. However, its3.9-second mean runtime is slightly worse than SCIP3.7seconds, despite better node counts. More broadly, default SCIP's strong-branching side effects incur work not counted as B&B nodes, so node and runtime rankings can disagree (supplementTable2/A.4).

**Timeouts.** On MIStransfer, temporal/DFS/ObjLim time out20/18/16of200runs versus SCIP1and imitation0. Facilitytransfer reverses part of that pattern: SCIP13timeouts versus each RL variant1and imitation0. Such failures matter independently of the common-completed means (supplementTable3).

## Limitations

### Discussed in the Paper

Theoretical tree-Markov conditions need not match a modern evaluation solver, and transfer between training/evaluation environments is unproved. RL remains expensive and often worse than supervised branching; heterogeneous large benchmarks such as MIPLIB remain beyond this study (Sections4.4,6).

### Curator Notes

Known-optimum objective-limit training is RL without branch labels, not training without offline optimal-instance information. The gradient identity and sufficient conditions concern finite vanilla-B&B models with decomposable rewards; global cuts, restarts, heuristic side effects and full solver memory require additional modeling. Faster convergence in sample plots does not prove a wall-time training advantage or a faster exact solver. Benchmark policies are specialists, and timeout-excluded metrics are not unconditional performance estimates.

## Reproducibility

- Fully read13-page [NeurIPS2022 paper](https://proceedings.neurips.cc/paper_files/paper/2022/file/756d74cd58592849c904421e3b2ec7a4-Paper-Conference.pdf) and all6pages of the [official supplement](https://proceedings.neurips.cc/paper_files/paper/2022/file/756d74cd58592849c904421e3b2ec7a4-Supplemental-Conference.pdf), including every proof, training curve, timeout table and task formulation. Both are linked by the [formal proceedings page](https://proceedings.neurips.cc/paper_files/paper/2022/hash/756d74cd58592849c904421e3b2ec7a4-Abstract-Conference.html).
- Official [lascavana/rl2branch](https://github.com/lascavana/rl2branch) provides Ecole/SCIP interfaces, configuration, generators, optimal-value collection, imitation/RL training and evaluation. Its [generator](https://github.com/lascavana/rl2branch/blob/master/01_generate_instances.py) was checked for the MIS distribution discrepancy (affinity4near684; Barabasi–Albert callnear726 at review time).
- The paper specifies GPU-equipped compute nodes but does not enumerate all training optimizer/entropy/subsampling values in the PDF; a reproducible run should pin its configuration and software revision. No training or solver experiment was rerun during this audit.
