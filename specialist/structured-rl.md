---
id: structured-rl
short_title: SRL
title: Structured Reinforcement Learning for Combinatorial Decision-Making
authors:
- Heiko Hoppe
- Léo Baty
- Louis Bouvier
- Axel Parmentier
- Maximilian Schiffer
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/fe100e5e7bca984803f0e4c6e94a6a88-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/fe100e5e7bca984803f0e4c6e94a6a88-Abstract-Conference.html
institutions:
- Technical University of Munich
- Ecole des Ponts
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Scheduling
- Resource Allocation
problems:
- Warcraft Shortest Path
- Single Machine Scheduling
- Stochastic Vehicle Scheduling
- Dynamic Vehicle Scheduling
- Dynamic Assortment
- Gridworld Shortest Paths
summary: Separate score models plus optimization layers learn structured actions using sampled FY targets; myopic
  baselines, selected seeds and solver-call overhead qualify empirical gains.
code_url: https://github.com/tumBAIS/Structured-RL
---

# Structured Reinforcement Learning for Combinatorial Decision-Making

> **TL;DR:** SRL learns score vectors, constructs feasible combinatorial actions with classical optimization layers and trains using critic-weighted sampled targets/Fenchel-Young losses. Separate environment-specific models show strong gains over the tested PPO adaptation, at higher solver-call cost. Its geometry concerns an idealized static fixed-critic update; “online optimum” baselines in endogenous tasks are actually myopic experts.

## Motivation

Industrial MDP actions can be whole paths, schedules or assortments. Representing every feasible action as a neural output is impractical. A learned score vector plus combinatorial optimizer exploits constraints, but the discrete optimizer is piecewise constant and frustrates direct backpropagation. SRL learns from interaction rather than requiring expert labels (Sections1–2).

## Contributions

- A structured actor combines a statistical score model and a classical linear-objective combinatorial solver.
- Perturbed candidate generation, critic-weighted soft targets and smoothed Fenchel-Young losses train the actor alongside value estimation.
- A fixed-state/static geometric interpretation relates sampled updates to primal-dual optimization; six separately trained environments evaluate quality, variance and compute (Sections2–3/AppendicesA–E).

## Methodology

**Actor and targets.** At state s, scores θ=ϕ(s) parameterize `argmax[a∈A(s)] θᵀa`. The optimizer enforces action feasibility conditional on the specified action set and successful solver execution. Gaussian score perturbations produce a finite multiset of candidate actions. Their critic values yield softmax weights; the target is their weighted average in `conv(A)`, which need not be a discrete feasible action because it is a training target only. A second perturbation smooths the support-function/Fenchel-Young loss. Forward exploration, target-action exploration and loss smoothing have separate scales σf/σb/ε. Neural parameters receive stochastic surrogate gradients, rather than exact derivatives of the discrete argmax (Section2.1/Algorithm1).

**Critics and environments.** Static Warcraft uses a truncated ResNet18-style CNN plus Dijkstra, and direct black-box cost evaluation. Single-machine scheduling uses27features/job and a generalized linear score model/ranking, with direct completion-cost evaluation. Stochastic vehicle scheduling uses20features/arc, a linear actor, flow optimization and sample-average delay costs. These static variants do **not** train neural Q-critics. Dynamic vehicle scheduling(DVSP) uses a14feature linear prize model, scheduling solver, and solution-graph neural critic. Dynamic assortment(DAP) uses a10→5→1MLP plus top4selection among20items, with immediate/future reward estimators; PPO uses only the first after its two-critic version failed. Gridworld(GSPP) uses7feature linear cell scores plus Dijkstra and two differently initialized linear critics. Thus “actor–critic network on every benchmark” would overstate the implementation (AppendixD).

**Theory.** Proposition2 fixes one state/action set and critic in the static setting. It assumes a finite action set, the stated Legendre/convex-conjugate constructions and ideal Fenchel-Young minimization. The proof retains multiplicities when sampled actions repeat and explicitly extends boundary mappings using−∞score coordinates. It is an interpretation of an ideal update, not a convergence/global-optimality theorem for finite SGD through a nonlinear actor with a simultaneously changing critic. Convexity in free scores θ does not imply convexity in neural weights (Section2.2/AppendixB).

**Scope.** Specialist / constructive: models, features, optimizers and training differ by environment. A common learning framework is not one cross-task checkpoint. The NN predicts scores before classical construction of the complete action; candidate evaluation in training does not constitute neural editing of an incumbent solution. Some actor models are linear, while the framework also explicitly implements CNN/MLP/GNN components.

## Experiments

**Protocol.** Three static and three dynamic tasks include exogenous and endogenous uncertainty. DVSP has eight periods; DAP80; GSPP100on a20×20grid. The static stochastic scheduling test uses25tasks. MacBookAirM3/Julia implement all experiments. Each algorithm/environment receives3–30tuning runs and ten model initializations; PPO determines common update/episode budgets. Best saved actors are restored using validation performance. Curves are **running-best mean validation rewards**, not raw monotone learning trajectories. Boxplots summarize per-instance ten-model mean rewards and omit outliers beyond1.5IQR; table deviations are across initializations (AppendixC/checklist).

**Dynamic results.** Table11test rewards(higher better) are DVSP SRL−27.3/SIL−27.2/PPO−32.5/expert−25.5; DAP555.3/519.2/313.1/583.2; GSPP−280.2/−1253.5/−3683.9/−1284.9. Hence SRL is slightly worse than SIL on DVSP while greatly improving DAP/GSPP. The headline≈92%gain refers to reducing GSPPcost relative to this PPO adaptation, not a92%generic success rate or universal gain. The DAP/GSPPexpert has hidden model information but maximizes only immediate revenue/minimizes immediate path cost; surpassing it does **not** exceed the optimal full-horizon online policy (Sections3/AppendicesD.5–D.6/E.2).

**Static results and overhead.** Table10test rewards are WSPP SRL−30.6/SIL−30.5/exact−29.8; SMSP−154388/−154399/exact−152670; SVSP−6695/−6701/expert−6670. These near-ties include a SILwin and remaining oracle gaps. SRLtraining takes31/31/34minutes on dynamic tasks versusSIL12/3/11andPPO3/5/10; static SVSP23minutes versus11/3. Typical updates use up to61CO-layer calls versusSIL20/PPO2. This is higher quality at increased optimization cost, not faster wall-clock convergence across all methods. SIL reaches the DAP/GSPPplateau earlier. Training variance is not uniformly lower than SIL: GSPP72.1versus39.3, DAP1.8versus.8andWSPP.5versus.2in the displayed units (Tables1/9–11).

## Limitations

### Discussed in the Paper

Repeated CO-layer calls dominate difficult environments. Nonlinear critic optimization is intractable, motivating finite sampled targets that may miss good actions. SAC and alternative architectures need further adaptation; six small controlled environments do not establish industrial-scale dominance (Sections2–4/AppendixC.2).

### Curator Notes

- The unperturbed support-function loss in Equation1is convex in θ, although adjacent prose calls it nonconvex; smoothing addresses nonsmoothness. Neural composition remains generally nonconvex. Equation2also omits the target-only conjugate term of the full Fenchel-Young loss, which does not affect θgradients but matters to literal nonnegativity/zero-loss identities.
- “Softmax reduces overestimation” and averaging two critics are heuristic design claims, not unconditional bias guarantees. The main Bellman equation labels a max-over-actions target as `Q^π`; distinguish optimal versus fixed-policy Bellman operators.
- The supplemental **DAPseed list is selected to have initial rewards100–200**, and GSPPseeds to have sufficiently low initial rewards, explicitly to avoid chance convergence. Results therefore describe these selected initializations, not an unbiased random-seed population. Other environments also differ in whether algorithms share an initial model.
- Main statements of identical critic architectures are qualified by DAP's explicit PPO-only immediate critic. The methods compare one specific Gaussian-score PPO adaptation, not all unstructured RL. Imitation learning is not mathematically forbidden to outperform a teacher on every possible instance or rollout.
- Supplemental GSPP `SRL_update!` returns inside the batch loop, so its actor gradient uses the first transition of that loop despite batch_size4. The code also includes the unperturbed candidate and uses multiplicative loss perturbation for GSPP, versus the general Gaussian description. These are implementation facts to resolve for replication, not a claim that all reported results are invalid.

## Reproducibility

The [NeurIPS2025 formal record](https://proceedings.neurips.cc/paper_files/paper/2025/hash/fe100e5e7bca984803f0e4c6e94a6a88-Abstract-Conference.html) explicitly gives publication2026-04-23,volume38,pp173726–173761,DOI10.52202/085713-5780. All36pages, integrated proofs, environment specifications, complete tables and checklist were read. Equation/proof/table rendering and the official event118965poster were inspected.

The publisher-linked137030byte ZIPwas downloaded and its142members manually inventoried: it supplies Julia code and seven READMEfiles, with no extra scientific PDF/TeX/notebook. All seven READMEs were read, including seed-selection disclosures, along with relevant per-environment setup, actor-update, critic/path and train/test code. The [current author-group repository](https://github.com/tumBAIS/Structured-RL), full56-entry untruncated tree and READMEidentify the same study; its contents need not be silently equated with the frozen supplementary ZIP. OpenReviewGS9o7u5njSAPIreturned403. No training or solver rerun is claimed.

**Internal citations.** Text and bibliography jointly verify [Attention Model](attention-model.md), [Learning CO over Graphs](learning-co-over-graphs.md), [Neural Combinatorial Optimization](neural-combinatorial-optimization.md) (cited2017workshop version), [RL-VRP](rl-vrp.md), and [Blackbox Backpropagation](../studies/blackbox-backprop.md). The cited2022AIarticle *Neural large neighborhood search for routing problems* is not forced onto the distinct2020ECAINLNSentry merely because authors/software overlap.
