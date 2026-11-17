---
id: l-rho
short_title: L-RHO
title: Learning-Guided Rolling Horizon Optimization for Long-Horizon Flexible Job-Shop
  Scheduling
authors:
- Sirui Li
- Wenbin Ouyang
- Yining Ma
- Cathy Wu
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/052e2404709e8df9dc38fbc7bfec5b80-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/052e2404709e8df9dc38fbc7bfec5b80-Abstract-Conference.html
institutions:
- Massachusetts Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Flexible Job Shop Scheduling Problem
- Flexible Job Shop Scheduling with Release Times and Delay Objectives
- Flexible Job Shop Scheduling with Noisy Processing-Time Observations
- Flexible Job Shop Scheduling with Machine Breakdowns
summary: An oracle-trained MLP fixes selected overlapping machine assignments in rolling-horizon
  CP-SAT, progressively constructing long-horizon FJSP schedules with scenario-specific
  models.
code_url: https://github.com/mit-wu-lab/l-rho
---

# Learning-Guided Rolling Horizon Optimization for Long-Horizon Flexible Job-Shop Scheduling

> **TL;DR:** Learn which overlapping operations can retain their machine assignments between rolling-horizon subproblems. An MLP selects assignments to fix; CP-SAT still chooses operation times and sequencing. Benefits depend on the prediction errors, horizon configuration and computational budget.

## Motivation

Rolling-horizon optimization (RHO) repeatedly replans overlapping parts of a long schedule. Many operation-to-machine assignments stay unchanged, making their repeated optimization potentially wasteful. L-RHO learns to identify these assignments, restricting subsequent subproblems while retaining the conventional solver for the remaining choices (Sections1-3).

## Contributions

The paper introduces learned assignment fixing for RHO, a look-ahead labeling procedure, an operation/machine MLP and a probabilistic analysis of prediction errors. Experiments cover makespan, start-delay and combined start/tardiness objectives, congestion changes, noisy future-duration observations and machine breakdowns. These are actual FJSP experiments; they are not evidence that a single checkpoint solves all variants.

The work remains **specialist/constructive**. RHO progressively commits operations and constructs the overall schedule, rather than repeatedly improving a complete schedule as LNS does. Neural variable fixing is a hybrid component of this constructive process. The paper trains separate canonical size models and collects/trains per FJSP setting; AppendixA.3-A.4 and the release use five different input layouts. Transfer to larger instances and a public FJSP benchmark is demonstrated, but a common model across the objectives and online variants is not established (PDF6-7/19-23/35).

## Methodology

A job is an ordered operation chain. Each non-preemptive operation chooses a compatible machine with a machine-dependent duration. Canonical FJSP minimizes makespan. Delay variants constrain operation start to be at least its release time and minimize total start delay, or start delay plus positive tardiness beyond target completion times (PDF3/16).

An RHO iteration considers the next **H operations**, ordered by normalized position within each job or by release time. It solves this window for at most T seconds, with an early-stop threshold Tes after no incumbent improvement. It commits the S operations with earliest scheduled start times and replans the remaining overlap. Boundary constraints enforce previously executed job and machine availability. L-RHO fixes only selected overlapping operations' previous **machine assignments**; their start times and sequencing remain optimization variables (Figure1; Algorithms1-3/7-8).

The printed training procedure solves the unrestricted subproblem Q times and chooses the solution with **largest machine-assignment agreement** with the previous solution. Matching overlapping assignments supply positive labels. The classifier uses separate two-layer, 64-dimensional operation/machine MLP embeddings, a pooled global representation and the operation's previously assigned machine embedding. Weighted binary cross-entropy uses positive weight0.5; inference thresholds at0.5. This architecture is an MLP with pooling, rather than a graph message-passing network. Attention is evaluated separately as an ablation (PDF4-5/23/35-37).

The formal setup collects450training,20validation,100test and10RHO-parameter-search instances **per FJSP setting**; it uses Adam1e-3, batch64 and500epochs, about500,000gradient steps. Q=5 oracle trials require24-72hours of label collection per setting; parameter search requires48-96hours and neural training less than12hours on a V100. CP-SAT uses12CPUworkers per solve in the reported setup. The main makespan configurations use(H,S,T,Tes)=(80,30,60,3); delay comparisons select each baseline's own best configuration, with L-RHO using Oracle's selected configuration. AppendixA.5 also reports common-parameter comparisons (PDF23/32-34).

**Analysis and its assumptions.** Let W=H-S and p(i)=Pr(an overlapping operation belongs to the look-ahead fix set). Random fixing has expected FP=σ[W-E(nfix)] and FN=(1-σ)E(nfix). First-k fixing uses the sums of1-p(i) over the first k positions and p(i) over the remainder. Under the assumed valid linear probabilities p(i)=b-mi/W, the paper derives closed forms with E(nfix)=(b-m/2)W-m/2, for integer k=σW. These are label-disagreement counts relative to the finite-solve look-ahead reference, not guarantees of global schedule optimality. The links from these counts to objective and runtime are explicitly qualitative/empirical; Figure9 fits a declining trend to training labels (Section6; AppendixA.7).

## Experiments

For600/800/1200/2000operations, L-RHO reports makespans1513/2015/3011/4982 in126/160/259/473seconds; Default RHO gives1558/2103/3136/5207 in244/348/545/862seconds. The2000-operation evaluation transfers the1200-operation checkpoint. Greedy DRL is much faster(4-16seconds) but gives worse makespans. Default RHO with a longer stopping threshold obtains3002 at1200operations, slightly better than L-RHO's3011, at1099seconds in Table1. Longer limits in Table19 further improve classical RHO quality at greater cost (Tables1/18-19).

For start-delay problems with600/1050/1600operations, reported reductions relative to Default RHO are53.0/35.1/47.3% in solve time and16.0/21.0/13.1% in objective. Random/First fixing can be faster at aggressive fix rates while substantially worsening the objective. The uncertainty in Tables2/13/14 is **two standard errors**, not a statement of independently retrained seed variability. Congestion changes, combined start/end delay, duration noise and breakdown scenarios are reported in Figure3, with scenario-specific features/training (PDF8-9/23-26/33-34).

Noise experiments reveal exact durations for the first S operations by release order, while independently perturbing20% of later operations' future observations by[-5,5] and clipping to[3,30]. Execution uses true durations and adjusts start times for feasibility. Breakdown experiments trigger replanning at breakdown/recovery events and defer operations whose compatible machines are unavailable. These are specified batch-online simulations, rather than an unrestricted real-world dynamic-arrival guarantee (AppendixA.5.1).

On the Dauzere-Peres/Paulli benchmark, four easy instances are excluded and remaining jobs are also augmented by sampling operations with replacement at3/6/9times length. The600-operation checkpoint transfers directly. On the unaugmented subset, L-RHO is faster(65seconds versus Default83 and Warm Start75), but its2185makespan is slightly worse than2174/2167; the cited best-known mean is2120. Attention ablations improve makespan1513to1504/1507 for two configurations while increasing126seconds to170/179seconds. Thus the simple MLP is a speed/quality choice, not uniformly superior quality. Matching450DRL training instances does not match the expensive oracle-label generation budget (Tables15-18).

## Limitations

Incorrectly fixed assignments remove potentially useful choices. Performance depends on window configuration, label quality, distribution and objective; it does not establish optimality or uniform dominance. The reported Oracle comparison omits Q unrestricted look-ahead solves and is not a deployable equal-budget baseline. Labels and prediction statistics are relative to finite-time solver solutions. Extending the method to other long-horizon problems is future work, and separate FJSP training/feature definitions limit claims of generality (Sections6-7; Table4; AppendixA.7).

### Curator Notes

Several printed notation/pseudocode details should be read with their surrounding definitions. PDF9 swaps the FP/FN rate denominators; Table20 and its proof use FP/[W-E(nfix)] and FN/E(nfix), matching the release's confusion-matrix code. Table20's equivalent First FN expression prints σR where σF is required; an intermediate PDF44 tail sum includes k where the correct subsequent sum/formula starts at k+1. Direct summation agrees with the final formulas for integer k. The statements using expected counts near0.5or1 require a normalized fraction interpretation. These are bounded printing inconsistencies, not a refutation of the count analysis.

Algorithm4's PDF25 `continue` statements skip the increment, and Algorithm5 on PDF26 iterates an initially empty output list. They cannot be used as literal executable pseudocode. The public breakdown implementation instead filters selected tasks, advances availability when no task is schedulable and iterates a separate chosen-task list. Algorithm7's abbreviated interval notation should likewise be read with the implementation's **optional** intervals and release-time bounds. Table16 labels two delay shapes differently from Table2; the main experimental shapes are retained here.

Current release settings also differ from the formal description. In `makespan/flexible_jss_main_common.py:399-402`, oracle trials are selected by lowest objective, rather than maximum agreement; the delay implementation retains maximum agreement. CP worker count is hard-coded to4 in the current makespan solver, versus the formal12. README examples use200epochs/Q3 and different process counts. Solver time sums CP-SAT wall times, optionally adding measured feature/model time; it is not automatically full program wall time, and Oracle time excludes look-ahead. These are inspected version differences; no historical benchmark effect is inferred without rerunning the experiments.

## Reproducibility

- All45pages of the [formal ICLR2025 PDF](https://proceedings.iclr.cc/paper_files/paper/2025/file/052e2404709e8df9dc38fbc7bfec5b80-Paper-Conference.pdf) were read, including every reference and AppendicesA.1-A.7.6. Thirty-two key pages were visually checked, covering all ten figures, twenty tables, central formulas and algorithms. The publisher confirms May1,2025, four authors and pages1724-1768; PDF1 gives MIT affiliations.
- The publisher's Paper link contains the complete scientific appendix. Both OpenReview notes APIs for`Aly68Y5Es0` returned403; the official60-file code tree contains no separate PDF/ZIP scientific attachments or pretrained checkpoints. No explicitly missing scientific document was identified.
- The [official repository](https://github.com/mit-wu-lab/l-rho) was inspected at`9b44324e6ae00cd4c47d91cf2820ca6f337eadf2`. The full717-line README, requirements and makespan learner were read; oracle selection, CP constraints, prediction/timing, breakdown execution and delay/noise implementation sections were inspected. Core dependencies include PyTorch, PyG/scatter and OR-Tools; instance/label/model generation is required. No training or full scheduling benchmark was rerun.
- Fourteen catalogue relations have explicit body references and matching full bibliography identities. The printed Wang2023c key used for the FJSP/DANIEL baseline conflicts with the bibliography's MILP cut-selection paper; that mismatch does not create an HEM relation. Reading, version, visual, code and citation evidence is retained separately.
