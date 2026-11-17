---
id: dcan-mofjsp
short_title: DCAN
title: Neural Multi-Objective Combinatorial Optimization for Flexible Job Shop Scheduling
  Problems
authors:
- Igor G. Smit
- Yaoxin Wu
- Pavel Troubil
- Yingqian Zhang
- Wim P.M. Nuijten
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/5c411eef5b6ee7d9895ad129a4bfc6cc-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/5c411eef5b6ee7d9895ad129a4bfc6cc-Abstract-Conference.html
institutions:
- Eindhoven University of Technology
- Dassault Systemes
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Multi-Objective Flexible Job Shop Scheduling Problem
- Multi-Objective Job Shop Scheduling Problem
- Multi-Objective Flexible Flow Shop Scheduling Problem
summary: Objective-preference nodes condition dual attention, while vector-value PPO
  and bound-difference rewards train constructive multi-objective schedulers separately
  for FJSP, JSSP and FFSP.
code_url: https://github.com/ai-for-decision-making-tue/Neural_Multi-Objective_CO_for_FJSP
---

# Neural Multi-Objective Combinatorial Optimization for Flexible Job Shop Scheduling Problems

> **TL;DR:** A preference-conditioned dual-attention policy constructs schedules for a range of objective trade-offs. Decomposition-based PPO learns from stepwise objective-bound changes. Larger instances benefit most; long-running evolutionary search and CP-SAT can retain better quality on smaller benchmarks.

## Motivation

Scheduling decisions trade off completion time, delay, flowtime and processing cost. Solving a large set of preferences independently can be expensive, while a separately trained network for every preference scales poorly. The paper trains a conditional policy for many preference vectors and supplies richer scheduling state/reward information than a simple terminal-cost formulation (Sections1-3).

## Contributions

The method combines weighted-sum decomposition, objective-specific bound features/rewards and vector-critic PPO. It compares WI-DAN, which concatenates preferences to input features, with DCAN, which introduces evolving preference embeddings as additional attention nodes. Experiments cover two, three and four objectives, size/distribution transfer, preference/sample budgets and separately trained JSSP/FFSP models (Sections4-5; AppendicesA-O).

The paper remains **specialist/constructive**. A policy shares parameters across preferences for its configured objective combination and scheduling setting. AppendixH explicitly trains/validates JSSP and FFSP separately; the main FJSP models also have size/distribution/objective-specific training. This demonstrates method and architecture reuse, rather than a shared FJSP/JSSP/FFSP checkpoint. Each decision assigns a job's next operation to a compatible machine and appends it to the partial schedule; it does not improve an already complete incumbent (PDF4/7/20).

## Methodology

The objectives are makespan, total tardiness, total earliness, average job flowtime and total processing cost. Flowtime means completion minus the job's actual first-operation start, rather than completion from a common release date. Cost is the synthetic sum of maximum allowed processing time minus the chosen processing time, so faster machine choices cost more; it is not measured monetary expenditure. Deadlines are1.5times each job's sum of minimum operation durations in the main data (Definitions3-7; PDF7).

The MDP state contains operation, machine and operation-machine pair features, plus relevant objective bounds. Its actions are all compatible machines for each job's first unscheduled operation. Completion-time bounds recursively add minimum compatible processing times until an operation is scheduled. Tardiness and flowtime use derived lower bounds, costs use actual assigned/minimum remaining costs, and earliness uses an upper bound. Reward for objective i is Hi(state_t)-Hi(state_t+1), with a fixed preference vector weighting the reward components during an episode (PDF4-5/16).

**The proved alignment is conditional.** Proposition1 telescopes the weighted stepwise rewards to the negative weighted change in H when **gamma=1 and preferences stay fixed through the trajectory**. To identify this with minimizing final objective values, terminal H must equal the corresponding objective and the initial H must be policy independent. This identity neither proves PPO convergence nor guarantees an entire Pareto front. Finite weighted-sum scalarizations can miss unsupported portions of nonconvex discrete fronts; the authors explicitly discuss Tchebycheff's nonconvex-front advantage. The current implementation defaults to gamma1 (PDF5/16-17).

DCAN's operation block attends to predecessor/current/successor operation representations and a local preference embedding. Its machine block attends over competing machines and a preference node, using shared-candidate operation embeddings to represent machine competition. The preference embeddings are updated between blocks. The actor scores feasible operation-machine pairs; a vector critic predicts one value per objective. Per-objective GAE targets train the critic, while preference-weighted advantages train clipped PPO. A scalar critic is also considered; the paper reports no significant performance improvement from the vector critic in its tests (PDF6/17-19).

Training uses1,500episodes,20instances per batch, replacement every20episodes and validation every40episodes. The formal preference distribution is flat Dirichlet. Test construction uses101preferences for two objectives,105for three, and120for the four-objective example; sampling generates ten schedules per preference. Main models train separately on10x5/20x5/15x10/20x10; the20x10models transfer to30x10/40x10. Additional SD2 data are separately trained, not a zero-shot SD1-to-SD2 result (PDF7/20-21).

## Experiments

**Quality and time on FJSP.** For20x10 makespan/cost, sampled DCAN reports normalized HV0.8200 versus NSGA-II0.6289, MOEA/D0.4879 and CP-SAT0.8548; runtime is48.32seconds versus2798.44/1774.73seconds for the evolutionary baselines. For20x10 makespan/flowtime/cost, sampled DCAN0.6314 is near CP-SAT0.6612 and above NSGA-II0.3834. However, at10x5 with three objectives, NSGA-II0.6146 exceeds sampled DCAN0.5130. DCAN's architecture is not uniformly best: WI-DAN is better on larger tardiness/cost transfer rows and several SD2 settings (Tables1-2/11).

At40x10, the20x10 DCAN model achieves HV0.5194 for three objectives versus the finite CP-SAT reference0.3043, producing the printed-70.70% HV gap. CP-SAT receives60seconds per scalar subproblem, totaling101or105minutes per instance; negative gaps therefore mean improvement over those finite-time solution sets, not improvement over a certified optimal Pareto front (Table2; PDF7).

**Public benchmarks and metrics.** With15x10-trained models, sampled DCAN HV is0.3047/0.6367/0.5689/0.7378 on mk/rdata/edata/vdata; NSGA-II is0.3416/0.6586/0.6439/0.7180. Thus long-run NSGA-II wins three of four, while DCAN is much faster. Equal machine-option durations make processing cost constant on rdata/edata/vdata: nominal three-objective evaluation has only two varying objectives, and the two-objective cost combinations collapse to a single varying objective (Tables3/13).

Normalized HV uses an instance reference point obtained from1,000evolutionary initial solutions and objective bounds. IGD+ instead uses the nondominated union of all methods' found solutions, because true optimal fronts are unavailable. Those metrics can rank methods differently: DCAN improves IGD+ on three public datasets while losing HV on two of those. The scores depend on the reference construction and objective normalization; they do not establish recovery of every Pareto solution (AppendicesF-G; Tables6-8).

**Other scheduling tasks and ablations.** Separate JSSP models optimize makespan/tardiness, while separate FFSP models optimize makespan/flowtime/cost. On JSSP6x6, sampled DCAN HV0.8244 is below MOEA/D0.8729; on20x20 it reaches0.9245 versus0.8394for NSGA-II and0.9576for CP-SAT. FFSP15x5 retains a slight NSGA-II HV advantage(0.4492vs0.4385), while DCAN wins the20x4 evolutionary comparison(0.4521vs0.4039). These FFSP sizes count stages, with alternative parallel machines per stage (Tables9-10; AppendixH).

Bound-based rewards drive the largest ablation gain; extra bound features add a smaller improvement. More preferences or samples increase quality with diminishing returns. Combining WI-DAN with DCAN gives mixed results. Four-objective scheduling including earliness is genuinely evaluated, but10x5 NSGA-II HV0.5628 remains above DCAN0.4773, and20x5 sampled WI-DAN0.4177 exceeds DCAN0.4147. At400samples per preference, DCAN still trails long-run NSGA-II HV on mk/rdata/edata, despite improved quality; reduced evolutionary budgets change the comparison (Tables4-5/12/14-16).

Neural inference uses an A100 and a9-core Xeon8360Y; classical baselines use a16-core AMD7H12. The tables report averages over instance sets, without an identified independently retrained seed count, confidence intervals or hypothesis tests. Runtime differences should retain these hardware and solution-budget distinctions. Pareto scatter plots show one selected instance per dataset, rather than distribution-wide evidence (PDF7; AppendixJ).

## Limitations

The constructor does not explicitly choose waiting times or post-process schedules. The authors acknowledge that this restricts nonregular earliness optimization; the general scheduling solution space contains schedules unavailable to this action set. Finite preference grids, restricted constructors and heuristic PPO produce approximate trade-off sets, not complete Pareto fronts. Public benchmark cost degeneracy and pooled IGD+ reference sets limit some multi-objective interpretations. New objective combinations and different scheduling tasks require separate configured training; arbitrary-objective or cross-task checkpoint transfer is not demonstrated (PDF20-22).

### Curator Notes

The current release differs from the printed preference sampler: `mo_train.py:182-185` normalizes independent U(0,1) draws, which is not a flat Dirichlet distribution on the simplex. For two objectives, its probability of a weight below0.1is1/18, whereas a flat Dirichlet gives0.1. The default `use_gamma_beta=True` additionally transforms node features by preference-dependent scale/shift before conditional attention; this step is absent from the printed PDF6 formulas. These are current-version differences, not a rerun-based explanation of historical result tables.

Per-objective reward multipliers in the release change the effective scalarization weights. Earliness uses a zero lower bound for HV normalization while its training potential is an upper bound; these two roles should be distinguished when applying AppendixF's general bound description. The inspected PPO code uses critic targets GAE+old value, consistent with AppendixC's complete definition. Its gamma1 default satisfies the telescoping proposition. Statements of broad baseline superiority should retain the countervailing rows above, including the authors' own acknowledged earliness and public-benchmark limits.

## Reproducibility

- All30pages of the [formal ICLR2026 PDF](https://proceedings.iclr.cc/paper_files/paper/2026/file/5c411eef5b6ee7d9895ad129a4bfc6cc-Paper-Conference.pdf) were read, including full bibliography and scientific AppendicesA-O. Sixteen key pages were rendered and checked, covering all four figures, sixteen tables, Proposition1's full proof and PPO/attention equations. Publisher metadata confirms April20,2026, five authors and pages56306-56335; PDF1 gives Eindhoven/Dassault affiliations.
- The publisher lists the integrated paper without separate scientific supplements. Both OpenReview notes APIs for`YAgOaYedLQ` returned403. The official repository's sole PDF is Behnke/Geiger's31-page January2012benchmark report; its title page was checked to establish that it is a cited external resource, not this paper's scientific appendix.
- The [official repository](https://github.com/ai-for-decision-making-tue/Neural_Multi-Objective_CO_for_FJSP) was inspected at`caf60d8da721382c79009539a9c8d9ccbc39e734`:8,303files and no pretrained .pt/.pth checkpoints. The complete README and conditional-attention source, plus central train/environment/PPO/test/model-wrapper sections were read. Code includes objective-specific scaling, datasets/reference points and evolutionary baselines. The README gives explicit training/test commands; no full neural training or scheduling benchmark was executed.
- Six catalogue relations have explicit body citations and matching full bibliography identities. Related FJSP backbones and other references absent from the existing catalogue do not receive invented IDs. All page, source, visual, code and metadata evidence remains in the review record.
