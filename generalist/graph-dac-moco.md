---
id: graph-dac-moco
short_title: Graph-DAC
title: Graph-Supported Dynamic Algorithm Configuration for Multi-Objective Combinatorial
  Optimization
authors:
- Robbert Reijnen
- Yaoxin Wu
- Zaharah Bukhsh
- Yingqian Zhang
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/reijnen25a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/reijnen25a.html
institutions:
- Eindhoven University of Technology
scope: generalist
paper_type: solver
paradigm: improvement
problem_families:
- Scheduling
- Routing
problems:
- Multi-Objective Flexible Job Shop Scheduling Problem
- Multi-Objective Capacitated Vehicle Routing Problem
- Assembly Flexible Job Shop Scheduling with Sequence-Dependent Setup Times
summary: A shared graph-PPO controller transfers from basic FJSP to assembly/setup-constrained
  scheduling; separate routing and optimizer configurations also demonstrate dynamic
  evolutionary control.
code_url: https://github.com/RobbertReijnen/GS-MODAC
---

# Graph-Supported Dynamic Algorithm Configuration for Multi-Objective Combinatorial Optimization

> **TL;DR:** A graph-based PPO controller adjusts an evolutionary optimizer's parameters each generation. It improves several scheduling/routing benchmarks and supports size/objective-definition/constraint-variant transfer. Routing and scheduling are separately trained, and the method still executes the underlying population search; it is not a direct neural route/schedule constructor.

## Motivation

Good mutation/crossover or swarm parameters can change during search. Static tuning cannot respond to those changes, while previous dynamic controllers often rely on manually selected population metrics. GS-MODAC learns a representation of the evolving objective-space population to choose parameters online (Sections1-3).

## Contributions

The framework combines a graph of current solutions, a graph-neural controller, and a reward based on record hypervolume improvements. NSGA-II instantiations cover multi-objective flexible job-shop scheduling and CVRP; a separately instantiated MOPSO controller demonstrates another underlying optimizer. Experiments include cross-size routing, transfer from basic scheduling to assembly/setup-constrained scheduling, changed objective definitions and distribution shift.

The generalist improvement/controller classification rests on one specific shared-model result: a controller trained on basic FJSP10j5m is directly applied to DAFJS-SDST with assembly precedence and sequence-dependent setup constraints (Table3). This changes the scheduling problem structure/feasible set, beyond size or input-distribution shift. The transferred row is distinct from the model separately trained on DAFJS-SDST; the article describes application of the trained FJSP model without a fine-tuning stage. Transfer to a different pair of scheduling objectives is additional evidence, while multiple native domains, objective counts and optimizer configurations retain their own models. The article does not demonstrate the same checkpoint moving between routing and scheduling, or from two-action NSGA-II control to three-action MOPSO control (Tables2-4/6).

## Methodology

Each population member becomes a node whose features are normalized objective values. Non-dominated sorting partitions the population into fronts, with edges connecting members of the same front. Two64-unit GCN layers and global mean pooling produce a graph embedding, concatenated with elapsed/remaining-budget information. PPO's Gaussian actor outputs continuous optimizer parameters; the evolutionary environment generates/evaluates/selects the next population. The graph summarizes objective values rather than the native routing/scheduling constraint graph (Sections3.1-3.2).

For NSGA-II the printed action ranges are crossover0.6-1.0 and mutation0-0.1. MOPSO instead controls cognitive/social coefficients1-3 and inertia0.6-0.9. Reward is zero without a new best HV; otherwise it is the increase in squared percentage improvement from initial HV, scaled by an estimated ideal-HV denominator. That ideal is approximated by an additional higher-budget optimizer run, not an oracle Pareto front. Reward/reference estimation and population search are real costs; the formula requires a defined nonzero denominator (Section3.1; AppendixB).

## Experiments

**Protocol.** FJSP sizes are5j5m,10j5m and25j5m, with100 training and100 test instances per size. Two/three/five objectives select makespan, workload balance, average flowtime, total workload and maximum flowtime as described in AppendixA. Routing tests100/200/500 uniformly placed customers, demands1-9, capacity40, minimizing total distance and longest route. The printed training budgets are1M scheduling and2.5M routing steps with50 generations and population50. Separate policy training takes roughly5hours to3days, depending on configuration.

Each method runs ten times on each of100 test instances. Tables average per-instance mean, best and standard-deviation statistics, with Wilcoxon rank-sum tests at5%. SMAC3 and irace explicitly tune on the generated **test instances**, so their results are tuned-test baselines rather than independently held-out parameter-selection results. MADAC uses discretized parameter choices, unlike the proposed continuous controller (Section4).

**Main quality.** Improvements are strongest in some larger/more-objective scheduling settings: Penta-FJSP25j5m mean HV is5.62e12 versus irace5.18e12 and vanilla NSGA-II5.08e12. Results are not uniformly best: irace exceeds GS-MODAC on Tri-FJSP5j5m, and MADAC has higher mean HV on Bi-CVRP200. HV is reference-dependent; those values are not optimality gaps (Table1).

**Transfer boundaries.** A routing policy trained at100 customers remains useful at200/500 but generally trails policies trained for the target size. The FJSP10j5m policy transfers without retraining to assembly/sequence-dependent-setup scheduling; Table3 explicitly compares this transferred controller with one trained on that harder variant. Table4 changes the two scheduling objectives while retaining the same objective count. These tests do not establish arbitrary objective-count invariance: released GCN input dimensions and checkpoints are configured separately for2/3/5 objectives (Tables2-4).

**Additional evidence.** MOPSO configuration improves tested CVRP20/50/100 quality but uses a different controller instantiation. The IGD+ and non-dominated-solution metrics improve in the scheduling tests; ordinary IGD does not uniformly improve. The reference-front construction for these distances is insufficiently specified to treat them as proof of convergence to the true Pareto front. Budget features and a second GCN layer help the tested cases, while a Transformer alternative is close in Penta-FJSP25j5m (AppendicesC-E).

The profiled graph-state plus policy overhead is about0.30seconds against15.09seconds total for small Bi-FJSP, and0.37seconds against305seconds for large Bi-FJSP. These are full-run profiling figures, not per-generation times or an asymptotic complexity theorem. An end-to-end PMOCO comparison favors PMOCO in matched-size CVRP100 best HV438.06 versus GS-MODAC366.63, while GS-MODAC fares better in the stated smaller-size and shifted-normal-distribution/outlier tests. Neither is universally superior (AppendicesF-G).

## Limitations

The controller inherits the underlying optimizer's feasibility handling and search cost. Population HV can improve without reaching an exact Pareto front; no convergence/approximation theorem or PPO performance-collapse guarantee is established. Reward normalization needs an extra estimated ideal point, and objective count affects node-feature dimension despite broad invariance wording. Native domains and optimizer action spaces remain separately configured. Main results depend on modest populations/generation budgets and particular synthetic/test-tuning protocols.

### Curator Notes

The printed Pareto-set formula in Definition3 reverses the domination direction relative to Definition2; this note uses the latter's standard non-domination definition. Current official code also requires reconciliation before exact reproduction. The routing environment maps actions to crossover0.5-0.7 and mutation0-0.2, whereas scheduling matches the printed0.6-1.0/0-0.1. The normalization helper updates both minimum and maximum bounds, rather than keeping the initial worst bound fixed. In both actor and critic, every member of an observation batch uses the first member's edge mask; when graph topologies differ, that does not implement each sample's own graph. These are static findings in the inspected release, not rerun evidence that the paper's experiments are invalid.

## Reproducibility

- All16 pages of the [formal ICML2025 article](https://raw.githubusercontent.com/mlresearch/v267/main/assets/reijnen25a/reijnen25a.pdf) were read, including full references and scientific AppendicesA-G. Eight framework/reward/results/appendix pages were visually inspected. The publisher verifies four TU Eindhoven authors, PMLR267:51405-51420 and publication metadata October6,2025, separately from the July conference dates.
- Manual publisher links identify Paper, OpenReview and Software, with no separate scientific supplement. Both notes APIs for `KCDoaDlzUB` returned403. The official763-file tree contains no scientific PDF/ZIP attachment and lists14 PT/PTH model files for separate configurations; no explicitly missing scientific document was identified.
- The [official implementation](https://github.com/RobbertReijnen/GS-MODAC) was inspected at `0bbdb2132091253c14cea69ef90b6c632f59c85e`. The full README, requirements,145-line training entry,80-line actor/critic and80-line graph helper were read, plus routing environment lines41-246 and scheduling lines96-170. Models, graph masking, bounds, action mapping and reward behavior were crosschecked statically. The complete98-line scheduling evaluation entry and142-line ordinary-FJSP10j5m training configuration were also read: model and problem paths are independent; inference loads existing weights, sets eval mode, uses no optimizer and collects an evaluation episode. The helper selects a separate assembly/setup parser for `/fajsp_sdsts/`. The checked default JSON is a basic5j5m example, so it is not claimed to reproduce Table3 configuration directly. No training, routing/scheduling optimization or benchmark was rerun. The exact PMOCO citation is recorded from AppendixG and the full bibliography.
