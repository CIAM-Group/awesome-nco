---
id: neuro-algorithmic-policies
short_title: NAP
title: Neuro-algorithmic Policies Enable Fast Combinatorial Generalization
authors:
- Marin Vlastelica
- Michal Rolínek
- Georg Martius
year: 2021
date: '2021-07-01'
publication:
  date: '2021-07-01'
  source_url: https://proceedings.mlr.press/v139/vlastelica21a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v139/vlastelica21a.html
institutions:
- Max Planck Institute for Intelligent Systems
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Time-Dependent Shortest Path
summary: A neural image-to-cost/endpoint predictor embeds classical time-dependent shortest-path planning for expert-supervised
  visual control, with restricted topology assumptions and environment-specific training.
---

# Neuro-algorithmic Policies Enable Fast Combinatorial Generalization

> **TL;DR:** Neural image encoders predict a time-dependent grid-planning problem, and an exact classical shortest-path component supplies a receding-horizon control policy. Expert imitation improves selected low-data generalization results; the learned policy itself has no global control-optimality guarantee.

## Motivation

Image-to-action networks can memorize training levels while failing to recombine familiar geometric/dynamic situations. NAP delegates combinatorial path selection to a known solver and learns the costs, positions and subgoals that make that solver useful for visual control (Sections 1–3).

## Contributions

- Relate restricted goal-conditioned MDPs to shortest-path planning, including factorized states with action-independent environmental dynamics.
- Embed a time-dependent shortest-path solver into a trainable visual policy using blackbox differentiation of a surrogate loss.
- Demonstrate expert-supervised transfer to unseen levels of Crash Jewel Hunt and selected ProcGen environments, including local subgoal planning for Chaser. These use task/environment-specific training, not one unchanged model shared across native optimization tasks.

## Methodology

**Assumptions and reduction.** The basic analysis concerns finite discrete goal-conditioned MDPs with deterministic action effects. For reduction to a smaller planning graph, state factors into an action-controlled component and an environment component whose dynamics are independent of actions. The graph topology/action-to-edge mapping is assumed known and fixed. Time-varying costs account for predicted environmental effects. The reward-to-cost shift c_max−reward requires a common horizon or appropriate absorbing-goal accounting when comparing variable-duration returns; a per-step constant can otherwise alter path preferences. These structural assumptions do not describe arbitrary stochastic control problems (Sections 3–3.1,7).

**Planner and visual policy.** Two stacked image frames enter simplified ResNet18 encoders. One predicts nonnegative, time-indexed vertex costs; the other predicts start/goal heatmaps. A time-expanded graph has nodes (position,time), spatial transition edges and waiting self-loops. Dijkstra's algorithm optimizes the represented path problem. The controller replans every step and executes only the first action. Global goals serve navigation; local goal supervision uses expert positions between t+H and t+2H, allowing repeated short plans in nonterminal collection tasks (Sections 4–5.1).

**Training signal.** Expert trajectories are mapped to latent grid locations by a known training-time mapping. The cost predictor minimizes Hamming discrepancy between planned and expert paths; start/goal predictors use cross-entropy. During cost-loss training, true expert endpoints are used; evaluation uses predicted endpoints, except in the privileged NAP* ablation. Backpropagation makes one additional solver call at costs perturbed by λ times the upstream gradient. Its output is the gradient of an interpolation surrogate, not the ordinary derivative of a discrete argmin or a proof that the representation learns true environment costs. A margin raises expert-path costs and lowers other costs during training to promote robustness (Sections 4.1–5).

**Configuration.** Adam learning rate is 10⁻³; standard experiments use margin 0.2 for Crash or 0.15 for Maze/Leaper, λ=20, and batch 32 or16. Chaser uses margin 0.2, λ=40 and batch16 with a smaller backbone configuration. Three network-initialization seeds are evaluated; the epoch schedule is min(150000/number_of_levels,15000), with stopping when training error vanishes (supplement C–D,Tables S1–S2).

## Experiments

**Environments and data.** Crash uses 5×5/5×10 grids with moving obstacles and varying starts/goals; 2,000 solvable levels are divided into 1,000 training candidates and 1,000 test levels. ProcGen Maze, Leaper and Chaser use disjoint seed ranges. Leaper is explicitly modified to discrete grid motion: logs and agent move in steps, and the agent is not passively transported by a log. It is therefore reported as **Leaper(Grid)** rather than unmodified ProcGen Leaper (Sections 6.1–6.2; supplement A–B).

**Expert access and comparison fairness.** Crash/Maze/Leaper trajectories come from ground-truth cost labeling and offline Dijkstra planning after environment unrolling. Chaser combines algorithmic and human demonstrations. Standard behavior cloning receives the same demonstrations, making it the direct architecture/inductive-bias comparison. PPO and DrAC instead receive 200 million environment interactions and no equivalent expert supervision. Their larger transition count is not a like-for-like label-cost or compute comparison. DrAC* selects the best of four augmentation variants; NAP* receives true endpoints at inference and is a privileged upper comparison (main Section 6; supplement A,D–F).

**Results and counterexamples.** NAP generalizes with fewer training levels in several selected settings: about 80% Maze success with 100 levels, and roughly one-third Crash5×5 success after thirty expert trajectories, compared with fewer than fifty of 1,000 test levels for behavior cloning in that example. However, DrAC* can outperform NAP in **Leaper(Grid) success rate**, explicitly acknowledged in Section 6.5. NAP's shorter paths on commonly solved levels are a separate conditional metric and do not reverse that success-rate result. “Optimal paths” here should not be read as an exact ratio to the optimal solution of every unseen environment (Figures 4–7).

**Horizon and margin.** Longer time dependence helps dynamic settings, while static Maze gains little from longer horizons. The margin ablation reports Maze success with/without margin of 0.839/0.834 at200levels,0.895/0.883 at500,and0.948/0.855 at1,000; the last no-margin run has large standard deviation0.241. These are empirical seed statistics, not unconditional dominance or a theorem of generalization (Figure 6; supplement H).

**Chaser and reporting consistency.** Chaser is evaluated using average reward for orb collection, distinct from static-goal success rate. Main/supplement report training configurations through 200 levels and 200 unseen test levels; supplement A describes 3×100 demonstration trajectories, two-thirds human. These source counts do not fully specify how demonstrations cover every reported training-level configuration. Exact reconstruction requires the original data or additional clarification rather than assuming all three trajectories per level are human (Figure 5; supplement A,D).

## Limitations

### Discussed in the Paper

Known fixed topology and a fixed five-action grid mapping limit applicability. The environments were selected for compatible structure and Leaper was modified. Expert or near-optimal trajectories do not ensure optimal action in unseen states. Extending to changing topology, other graph structures and online RL is future work (Sections 6.2,6.5,7; supplement E).

### Curator Notes

This is a neural cost/endpoint predictor composed with a classical exact planner, rather than a learned replacement for Dijkstra. Exactness for the predicted latent costs does not imply optimal real-environment control. Separate environment models, privileged training mappings/endpoints, expert collection and planning overhead qualify claims of data efficiency. The ordinary discrete derivative is replaced by an interpolation gradient. The printed forward pseudocode calls TDSP with the start vertex twice; the equations/architecture define distinct start and goal, so the local pseudocode line should not be treated as the intended policy specification.

## Reproducibility

- **Publication:** [ICML 2021, PMLR139:10575–10585](https://proceedings.mlr.press/v139/vlastelica21a.html). Publisher source explicitly records issued2021-07-01; the July18–24 conference period differs. Author spelling Michal Rolínek is taken from the PDF.
- **Reading:** full eleven-page publisher article and [four-page scientific supplement](https://proceedings.mlr.press/v139/vlastelica21a/vlastelica21a-supp.pdf), including generation, architectures, all hyperparameter/ablation tables, baseline fairness discussion and additional plots/references. Manual Related Material inspection identifies this sole scientific supplement. Key figures/formulas were visually checked.
- **Artifacts:** the paper links the [author project page](https://martius-lab.github.io/NAP/). The associated `martius-lab/NAP` repository currently contains a construction-placeholder README and website assets, with no training/solver implementation identified in its recursive tree. It is retained as project provenance rather than advertised as available implementation code. No reproduction run was performed.
- **Citation graph:** explicit body citations and matching bibliography entries support Blackbox Differentiation of Combinatorial Solvers and SATNet. Other cited planning/optimization works are not replaced with differently titled catalogue papers.
