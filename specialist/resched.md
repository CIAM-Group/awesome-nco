---
id: resched
short_title: RESCHED
title: 'RESCHED: Rethinking Flexible Job Shop Scheduling from a Transformer-based
  Architecture with Simplified States'
authors:
- Xiangjie Xiao
- Cong Zhang
- Wen Song
- Zhiguang Cao
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/467e109270678b3e2b3c2e7fa6b3d575-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/467e109270678b3e2b3c2e7fa6b3d575-Abstract-Conference.html
institutions:
- Singapore Management University
- Nanyang Technological University
- Shandong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Flexible Job Shop Scheduling Problem
- Job Shop Scheduling Problem
- Flexible Flow Shop Scheduling Problem
summary: A constructive scheduling policy uses relative availability, processing durations
  and remaining precedence/eligibility graphs with dual Transformer branches; separate
  models cover FJSP, JSSP and FFSP.
code_url: https://github.com/XiangjieXiao/ReSched
---

# RESCHED: Rethinking Flexible Job Shop Scheduling from a Transformer-based Architecture with Simplified States

> **TL;DR:** Represent the remaining scheduling subproblem with four numeric feature types plus precedence and machine-eligibility structure. A dual-branch Transformer constructs schedules. The same architecture is evaluated on FJSP, JSSP and FFSP using separately trained models; its proposed KV acceleration is not implemented in the reported experiments.

## Motivation

Many neural schedulers rely on numerous hand-engineered features and heuristic masks. RESCHED asks whether current operation/machine availability, duration and remaining structure suffice for effective decisions, allowing a simpler model and fewer tracked historical variables. Its four feature types still require the full remaining precedence/eligibility graphs and machine-dependent edge durations (Sections1-4).

## Contributions

The paper presents a remaining-subproblem formulation, a state-sufficiency proposition for scheduling, a Transformer operation branch with intra-job RoPE, and a machine branch with duration-aware/self-based cross-attention. It studies REINFORCE and PPO, feature/architecture/reward ablations, seeds and size transfer (Sections4-5; AppendicesA-H).

The classification remains **specialist/constructive**. PDF8 explicitly trains FJSP, JSSP and FFSP respectively. JSSP uses a10x10-trained model; FFSP uses a20-job model with three stages/four machines per stage. FJSP has separate size/distribution checkpoints. A shared formulation/architecture is demonstrated, but a single cross-task neural checkpoint is not. Edge-computing offloading in the FAQ is a proposed mapping, not an additional tested native task (PDF8/10/14/27).

## Methodology

An action selects a precedence-ready operation and an eligible machine. The append schedule starts it at the maximum of predecessor completion and machine availability, then adds its machine-specific duration. The scheduled operation is removed, leaving a smaller subproblem. The state retains operation/machine available times, duration and minimum eligible-machine duration; graph masks retain job precedence and machine eligibility. Available times are shifted by a common minimum. Minimum duration is derived from the edge data rather than a proof of four independent minimal quantities (PDF4-6).

Proposition1/AppendixD establish identical feasible continuations for equal complete states containing current machine availability, job completion status and remaining constraints/durations. For the native makespan objective and this append formulation, the relevant past is summarized in these variables. This is state sufficiency, not a theorem that a trained policy is optimal or that arbitrary communication/setup constraints can be ignored. Relative-time representations compare continuations up to the common clock shift (PDF5/21-22).

The operation branch attends to same-job successors using RoPE. The machine branch aggregates eligible operations, directly includes duration embeddings in attention values/scores and includes a learned self-weight to avoid diluting machine information. A three-layer64-unit MLP scores operation-machine pairs, with only hard precedence/eligibility masking and no global policy embedding. Two Transformer blocks use eight heads,128embedding and512feed-forward dimensions (PDF6-8/16).

Main training uses REINFORCE, a negative lower-bound-makespan difference reward, gamma0.99, Adam5e-5,2000epochs and1000instances/batch50 per epoch; larger settings use500/batch24, totaling one or two million sampled instances. Best-validation checkpoints are evaluated. Undiscounted complete potential differences telescope; gamma0.99 is a discounted surrogate. FJSP sampling reports the best of100independent decodes; FFSP uses24parallel solutions. PPO is a separately evaluated actor-critic alternative (PDF8/15-16/22-26).

## Experiments

**FJSP.** Table1 compares SD1/SD2 across training shapes, larger30x10/40x10 and Brandimarte/Hurink. Quality improves in many displayed comparisons. For SD2 15x10, sampling gives9.81% versus DANIEL38.70%; for SD1 10x5, however, greedy RESCHED12.25% is worse than DANIEL10.87%, and sampling5.98% is worse than5.57%. On SD2 40x10 the20x10-trained model gives-7.61% relative to finite OR-Tools incumbents, not a negative optimality gap (Table1).

Public FJSP performance depends on checkpoint and strategy. Brandimarte sampling gives6.61% for the10x5 model versus DANIEL8.95% for its15x10 model. Hurink rdata sampling has5.04% for the smaller RESCHED model versus DANIEL4.95%, while the larger RESCHED model reaches4.92%. On vdata its best0.69% ties DANIEL. OR-Tools and2SGA provide stronger solution quality in several rows;2SGA vdata uses the la1-30 subset, so that objective is not directly comparable to the full40-instance mean. Some neural baseline results are taken from original papers; DOAGNN and MatNet use public-code evaluations/retraining. Figure3 reports five-run average inference times. The FJSP table specifies OR-Tools1800seconds, while surrounding prose says3600seconds, which is retained as a source inconsistency (PDF9/16-17).

**JSSP and FFSP.** The JSSP10x10 model transfers to Taillard15x15-100x20 and DMU. It improves on L2D throughout the shown tables, but RL-GNN is better at Taillard50x15(15.9% versus16.1%) and100x20(9.2% versus9.6%). Thus the prose7/8claim should not be read as beating both comparators in seven of eight shapes. CP remains much stronger in quality. DMU20x15 is23.7% versus L2D39.0%, and50x20 is31.8% versus38.8%. FFSP20-trained sampling reaches25.12/49.65/90.80 for20/50/100jobs; greedy100 gives92.28, worse than MatNet100's91.79. These are size-transfer results within separately trained tasks (Tables3/7-9).

**Ablations and budgets.** DANIEL can retain similar quality after reducing26raw features to five in one SD2 15x10 retraining study. Removing RESCHED components worsens the displayed aggregate, though some individual OOD rows improve. Four SD1-10x5 training seeds show strong OOD/public averages, but per-case variation is not uniformly below one percentage point: Brandimarte ranges9.08-11.70. All four in-distribution runs remain worse than DANIEL10.87% (Tables4-6).

PPO's small-budget in-distribution mean is12.42% versus REINFORCE14.35% and DANIEL19.45%; larger-budget means are9.02/10.30/17.39%. Public results remain mixed. The budget definition counts reused trajectory passes:400*50*4=80,000effective PPO trajectory updates involve20,000sampled trajectories, rather than80,000unique instances; the large counterpart counts2million effective updates from500,000trajectories. This does not equalize unique data, optimizer steps or compute with2million REINFORCE trajectories. Reward ablations trade synthetic OOD gains against public-benchmark losses; gamma1results average three seeds versus four for gamma0.99. Hardware is one RTX A40 (PDF16/19/22-26).

## Limitations

No global-optimality or approximation guarantee is provided. Machine-to-operation feedback is absent; richer setup, communication, release-date and resource constraints require additional modeling. Separate training and fixed problem distributions limit broad transfer claims. Minimal numeric features do not eliminate dense attention/mask costs or training compute. The sufficiency proof applies to its stated state/continuation model, rather than establishing sufficiency for every objective based on historical completion times.

### Curator Notes

**Proposed cache and released normalization.** AppendixC explicitly says KV caching was not implemented. Its10-40xestimate is an attention-computation opportunity, not an observed solver speedup. Cache reuse assumes operation representations stay fixed. Both old/current releases use `StdNormLayer` across all valid operation rows; a changing ready-operation feature or the removal of a row can change other rows through global mean/variance. Thus backward-looking job edges alone do not establish fixed keys for that implementation. A small normalization calculation in the cache demonstrates the extra dependency, without claiming to test a complete cached network.

**Last-operation shortcut.** The current environment automatically schedules the last remaining operation by minimizing machine availability plus duration, omitting the job's available time from the machine selection. A valid two-job example has C onM1 for50, and A onM2 for100 followed by B taking10onM0 or1onM1. After C thenA, the shortcut selectsM0 and yields110, whileM1 yields101. It also discards the reward of this automatic last step: the original environment returns total reward0although initial potential101minus final110is-9. The research script executes the original environment classes on this tiny case. This is a bounded release behavior, not a re-evaluation of the published benchmark results.

**Version and generation details.** The checkpoint README explicitly documents old/rebuttal RoPE incompatibility and supplies `SchedulingModel_old.py` for main-paper reproduction. Full diffs also change disconnected-machine handling and global-versus-per-instance duration scaling. Current SD1 operation counts use0.8-1.2times the number of machines, whereas AppendixB.2 prints the number of jobs. Current default SD2/JSSP operations equal the machine count; JSSP training machine assignments are sampled independently and can repeat within a job, differing from a per-job permutation generator. The trainer halves its learning rate at500/1000/1500epochs. The evaluator's `sampling` mode is one stochastic decode; best-of-many requires `aug_sample`. All relevant versions and settings should be identified before reproducing a table.

## Reproducibility

- All28pages of the [formal ICLR2026 PDF](https://proceedings.iclr.cc/paper_files/paper/2026/file/467e109270678b3e2b3c2e7fa6b3d575-Paper-Conference.pdf) were read, including full references and AppendicesA-H. Fifteen key pages were visually checked, covering all five figures and twelve printed tables(the numbering skips2and11). Publisher metadata confirms April20,2026, four authors and pages42614-42641; PDF1 identifies SMU,NTU and Shandong University.
- Publisher HTML lists the integrated paper without a separate scientific attachment. Both OpenReview APIs for`s5pWbwf2tk` returned403. No explicitly missing scientific supplement was found. The repository's one PDF is the cited2012external FJSP benchmark report, not an additional RESCHED appendix.
- The [official repository](https://github.com/XiangjieXiao/ReSched) was inspected at`4d1fda8ab4d78d1cd9664de28f3f77d88620f309`:2,242files and21checkpoints, with separate native tasks/PPO/seed variants. Full README/checkpoint note, current model/environment/trainer/evaluator, SD1 generator and FJSP configuration were read; old/current model diffs, JSSP/FFSP configurations and relevant generic generator functions were inspected. PyTorch2.3.1/CUDA12.1 and OR-Tools9.11.4210 are documented. No neural training or full benchmark was rerun.
- 9 catalogue edges have explicit body citations and full bibliography identity. The cache preserves source files, rendered pages and`recompute_release_boundaries.py`, which executes only a tiny original environment and a normalization arithmetic check.
