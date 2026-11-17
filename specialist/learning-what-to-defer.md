---
id: learning-what-to-defer
short_title: LwD
title: Learning What to Defer for Maximum Independent Sets
authors:
- Sungsoo Ahn
- Younggyo Seo
- Jinwoo Shin
year: 2020
date: '2020-11-21'
publication:
  date: '2020-11-21'
  source_url: https://proceedings.mlr.press/v119/ahn20a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v119/ahn20a.html
institutions:
- KAIST
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Maximum Weighted Independent Set
- Prize Collecting Maximum Independent Set
- Maximum Cut
- Ising MAP Inference
summary: A graph policy constructs solutions through simultaneous include/exclude/defer decisions, with feasibility
  cleanup and a diversity reward; task adaptations and optional local search use distinct settings.
code_url: https://github.com/sungsoo-ahn/learning_what_to_defer
---

# Learning What to Defer for Maximum Independent Sets

> **TL;DR:** LwD learns to include, exclude or defer many vertices simultaneously, reducing repeated neural decisions on large graphs. Conflict cleanup preserves independent-set feasibility; PPO and a coupled-solution diversity reward train the policy. Results distinguish the base constructive solver from a variant adding conventional local search.

## Motivation

One-vertex-per-step neural policies become expensive on million-node graphs. For locally decomposable problems, multiple compatible decisions can be made together. LwD learns which decisions to commit now and which to delay, rather than using a fixed hand-designed parallelization schedule. TSP's global tour constraint is explicitly outside this local-decomposability argument.

## Contributions

- A deferred-decision MDP with parallel node assignments and deterministic conflict cleanup.
- A training reward that compares two independently generated solutions to encourage diverse final candidates, beyond policy entropy alone.
- Large-scale MIS evaluation and task-specific adaptations to weighted/prize-collecting independent sets, MaxCut and Ising MAP inference.

## Methodology

An MIS state labels each vertex included, excluded or deferred. The policy independently assigns actions on all deferred vertices. If two newly included neighboring vertices conflict, cleanup returns them to deferred status; neighbors of retained included vertices become excluded. Earlier fixed decisions are immutable. The reward counts newly included vertices, so cumulative objective reward equals the independent-set cardinality. A finite episode can stop with some vertices deferred; the included subset remains feasible but need not be maximum or maximal.

The policy and value networks use graph convolutions on the residual deferred subgraph, with four layers and 128 hidden dimensions in the supplement. Inputs include degree and normalized iteration index. Actor-critic learning uses PPO with per-vertex probability-ratio clipping, rather than the original single joint clipping operation. Two coupled MDP copies receive an additional reward for differing assignments, encouraging different final solutions. Entropy and diversity bonuses can be combined. Inference samples candidates and returns the best; this is not one deterministic forward pass.

The paper denotes the base method **LwD** and the version adding 2-improvement local search **LwD-dagger**. The latter replaces one selected vertex by two compatible vertices when possible. These variants must remain separate in quality and runtime comparisons.

Other tasks change the objective and, where needed, features/transitions. MWIS adds node weights and weighted reward. Prize-collecting MIS replaces hard independence by a soft adjacent-pair penalty (0.5 in experiments). MaxCut and antiferromagnetic Ising MAP remove MIS cleanup and reward objective increments; Ising uses interaction and field coefficients both equal to one. This demonstrates an adaptable framework with task-specific settings, without establishing one shared checkpoint across tasks; the entry remains specialist and constructive.

## Experiments

Every model instance uses 20,000 PPO updates with Adam at `1e-4`; graph-type hyperparameters are chosen on validation data. Synthetic training graphs are generated online, with fixed 1,000-graph validation/evaluation sets. SATLIB is split into 38,000/1,000/1,000 graphs. Episode limits are 32 for the small synthetic families, 64 for REDDIT and 128 for SATLIB/PPI/as-Caida. Model selection uses ten candidate samples; the objective/time trade-off experiments vary sample counts or solver limits. Computation uses one RTX 2080 Ti and one Xeon E5-2630 v4 CPU.

Table 1 compares solution cardinalities, not certified gaps. On ER400-500, base LwD reaches 38.29 in 0.16 seconds and LwD-dagger 39.81 in 5.91 seconds, versus KaMIS 39.61 under the stated five-second limit. On SATLIB, the base reaches 424.8 and LwD-dagger 426.7, below KaMIS 426.9. Base LwD also underperforms the neural alternatives on REDDIT-M-12K. Local search can therefore affect both quality and cost materially.

Million-node tests use models trained on 400-500-node graphs of the corresponding BA/HK/WS family. On a two-million-node BA graph, base LwD returns 915,887 vertices in 276 seconds, versus KaMIS 909,988 in 3,637 seconds; this is the source of the roughly 13-times speed claim. It concerns those solutions and budgets, not equal-quality time to optimum. KaMIS is stronger on WS500,000 (157,298 versus base 155,086 and LwD-dagger 155,574), although slower. Nominal classical-solver limits of 1,000 seconds are often exceeded by preprocessing; out-of-budget entries also include a 15,000-second or memory ceiling.

Table 3 evaluates unseen citation, Amazon and coauthor graphs. Ratios are against CPLEX solutions obtained without a time limit. Values displayed as 1.00 are rounded reported ratios, rather than a proof that the learned algorithm always solves these families optimally. LwD-dagger has a substantial time cost on some graphs, such as 186 seconds on Coauthor-Physics versus nine seconds for the base solver.

Table 4's additional tasks use ER graphs up to 500 nodes and a five-second CPLEX budget. Large gains occur where the selected integer-quadratic formulation struggles to find good incumbents quickly; this is not a comparison against all specialized MaxCut, Ising or prize-collecting solvers. CPLEX beats LwD on the smallest MaxCut and prize-collecting cases. Ablations on ER50-100 report means and standard deviations over three runs: more deferred-decision stages and the combined entropy/diversity reward improve validation objective in that setting.

## Limitations

### Discussed in the Paper

- The efficient parallel transition relies on local decomposability; the paper explicitly distinguishes TSP.
- Solver comparisons depend on specialized local search, supervised-label access and whether a method can prove optimality.
- Conventional solver setup can exceed nominal time budgets, while some neural baselines cannot scale to the largest graphs.

### Curator Notes

- Feasible conflict cleanup does not imply an approximation guarantee or convergence to an optimum.
- Candidate counts, graph-type tuning, episode limits and optional local search are separate parts of the inference/training budget.
- The implementation of the TGS baseline caps its search queue on large graphs, and S2V-DQN uses curriculum/subgraph training; the supplement documents these adaptations.
- The main text calls as-Caida a road network, but Supplement A.3 identifies it correctly as autonomous-system BGP graphs. The supplementary definition is used here.
- Additional tasks use different problem-specific features/rewards/transitions; framework breadth alone is insufficient evidence for a common multitask model.

## Reproducibility

- **Formal publication:** [ICML 2020, PMLR 119:134-144](https://proceedings.mlr.press/v119/ahn20a.html). The [publisher metadata](https://proceedings.mlr.press/v119/ahn20a.html) explicitly records `citation_publication_date` as **2020-11-21**, independently of any paper-specific acceptance date.
- **Official software:** [sungsoo-ahn/learning_what_to_defer](https://github.com/sungsoo-ahn/learning_what_to_defer), reached from PMLR's Software link. The README gives Python/PyTorch/DGL requirements and a training command.
- **Reviewed sources:** all 11 main pages and all five supplementary pages, including extra task definitions, references and the complete framework diagram. PPO, transitions, all main tables and ablation curves were visually checked.
- **Source map:** main Section 3 gives MDP/rewards/PPO, Section 4 results; Supplement A gives hyperparameters/baselines/splits and B defines additional tasks.
- **Validation scope:** source/note verification; training and numerical experiments were not rerun.
