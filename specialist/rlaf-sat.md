---
id: rlaf-sat
short_title: RLAF
title: 'Learning from Algorithm Feedback: One-Shot SAT Solver Guidance with GNNs'
authors:
- Jan Tönshoff
- Martin Grohe
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/a04c50c0bd6937760a3b89ee10010c96-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/a04c50c0bd6937760a3b89ee10010c96-Abstract-Conference.html
institutions:
- RWTH Aachen University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
problems:
- Boolean Satisfiability
summary: Task-specific one-shot GNN guidance scales SAT solver scores; GRPO minimizes decision counts, with useful
  mean runtime gains, backend/UNSAT exceptions and version-qualified metric/timing/baseline comparisons.
code_url: https://github.com/toenshoff/RLAF
---

# Learning from Algorithm Feedback: One-Shot SAT Solver Guidance with GNNs

> **TL;DR:** A task-specific GNN predicts variable weights and polarities once, then classical Glucose/March reuse that guidance. GRPO trains from solver decision counts; reported runtime gains have backend/UNSAT exceptions, and the Graph-Q-SAT appendix compares a decision-reduction metric rather than a wall-time speedup.

## Motivation

Predicting hand-designed variable properties may fail to optimize the solver that actually receives them, while invoking a GNN at every branch can overwhelm solver costs. RLAF instead learns one initial parameterization that continuously modulates a solver's own evolving heuristic. Training uses algorithm feedback directly without expert core/backbone labels. Transfer of this recipe to other combinatorial domains is proposed future work, distinct from the demonstrated SAT experiments (Sections1/4).

## Contributions

- A positive variable-weight interface scales existing branching scores, alongside predicted initial/decision polarities.
- A literal–clause GNN parameterizes independent LogNormal weights and Bernoulli polarities in one pass.
- A single-step RL formulation uses GRPO with group-relative solver-cost feedback instead of handcrafted supervised targets.
- Six solver/distribution-specific models test size/hardness transfer, adapted supervised guidance, learned-weight correlations and backend transfer, including explicit counterexamples to uniform speed improvement (Sections2–3/AppendicesA–B9).

## Methodology

**Guidance.** The ideal branch variable maximizes w(x)*Score(x) over eligible variables, with w>0. It preserves dynamic base scores rather than replacing every branch with a new neural action. Glucose4.2.1 applies the weight to each EVSIDS activity increment; predicted polarities initialize phases, but **phase saving stays enabled** and may overwrite them later. Experiments disable random decisions and set K=.1 to reduce restarts. March applies the weight to both its cheap10% candidate preselection and its expensive look-ahead score, then uses the supplied polarity at decisions. Thus the implementation is backend-specific beneath the generic interface (Section2.1/AppendixA3).

**GNN/policy.** A literal–clause graph connects every literal to its containing clauses and to its opposite literal. A degree-based log(deg+1) MLP initializes embeddings. Ten fixed feed-forward message-passing layers of width256 aggregate means from literals→clauses, then clauses→literals while including the opposite literal. Two-layer SiLU MLPs have hidden width2d; concatenated positive/negative embeddings feed two output logits. Separate LogNormal(log-meanµ,σ=.1) and Bernoulli(sigmoidρ) distributions define an independent product over variables. Training samples full assignments of these guidance parameters, while testing uses distribution modes; LogNormal mode is exp(µ−σ²), not its mean. Zero output initialization gives near-unit weights and uniform polarity probabilities (Section2.2–2.3/AppendixA1–A2).

**Learning.** For each formula, a single action is the complete weight/polarity vector, after which a classical solve produces negative **decision count** as reward. Direct CPU-time rewards were less stable and are not the main training objective. Each GRPO iteration samplesN=100 formulas andM=40 parameterizations per formula, requiring4000 solver calls. Group-standardized advantages feed a clipped joint-density ratio objective with KL(new||previous) regularization. The code sums log probabilities/KLs over variables, uses an epsilon for zero-variance groups and AdamW(maximize=True), rather than accidentally minimizing the ascent objective. AtK=2000 this is8M sampled solver runs per main model, before validation, explaining the easy-training-instance constraint. Fifty optimizer steps/iteration, warmup five iterations and tuned learning rates/clips/KL weights complete the main recipe (Sections2.4–2.5/Algorithm4/Table3).

**Classification.** Each base solver and each native distribution is trained **separately**, explicitly stated on p7 and in six training commands. Random3SAT, graph3-colorability and cipher instances therefore do not demonstrate a single shared neural checkpoint across native tasks. Correlated weights of separately trained models are not that evidence. A Glucose-trained random-SAT model does transfer to MiniSAT in the appendix, establishing backend reuse within SAT. **Specialist/constructive** is appropriate: learned initial heuristic parameters guide classical search, without neural edits to complete feasible incumbents (Sections3/AppendixB6).

## Experiments

**Data.** Random3SAT training uses200 variables,853 clauses and20K balanced SAT/UNSAT instances, plus200 balanced validation formulas. Tests use200 each at300/350/400 variables. Graph coloring uses explicit answer-preserving3-colorability SAT encodings of Erdős–Rényi graphs at expected degree4.67:20K balanced300-vertex training graphs,200 validation and200 each400/500/600-vertex tests. The resulting SAT variable counts are3n, so600 graph vertices means1800 Boolean variables. CRYPTO uses Grain-of-Salt HiTag2 decryption encodings with22 help bits for20K training/200 validation, then100 each at20/15/10 help bits; fewer bits are harder. All reported crypto splits are UNSAT. Table2's3COL500 count91SAT+108UNSAT=199 conflicts with its stated200, so the exact test total needs the released manifest (AppendixB1/Table2).

Each run uses oneH100 GPU,48-core Xeon8468 and128GB RAM. The paper reports training runtimes in a24–48hour range. Test metrics are arithmetic means separated by SAT/UNSAT; standard deviations/confidence intervals are not provided for the main table. Main runtime includes GNN inference, but the released measurement combines solver-reported CPU time with CUDA-event GPU timing, not every preprocessing/launch/data-transfer cost (Tables1/3–4).

**Main gains and exceptions.** On satisfiable3SAT400, Glucose598.35→186.70seconds gives about68.8% reduction; UNSAT1895.62→1112.71 gives41.3%. Graph3COL600 UNSAT improves193.96→155.23seconds Glucose and313.57→197.12 March. CRYPTO10 improves162.45→64.95 Glucose and467.38→169.22 March. These are useful reported family means. However, March UNSAT random3SAT is **slower despite fewer decisions**:1.01→1.04,5.14→5.16 and27.49→27.51seconds at300/350/400. The text's consistently-accelerates wording must retain that explicit exception. One-shot overhead does not vanish: Table4 GPU means range.0205–.1174seconds, including values above the prose's rounded.1 bound; CRYPTO20 Glucose inference.0974 is a substantial part of.15seconds total (Tables1/4).

**Supervised guidance.** Identical-sized GNNs predict nonminimal DRAT-derived UNSAT-core membership for coloring/crypto, or backbone membership for satisfiable random3SAT. Core/phase targets are uninformative for some distributions, so comparisons use different applicable subsets. Predictions are transformed to multiplicative weights and validated over anα grid; this is an **adaptation** of prior ideas rather than the unchanged original NeuroSAT-core/NeuroBack integrations. The printed transformation is1+αp. RLAF mostly improves the reported means, while the backbone baseline wins Glucose SAT3SAT300 and roughly matches March SAT3SAT. Consequently neither every-cell superiority nor a universal claim about RL versus supervision is justified (Figures4/8/Table5/AppendixB5).

**Graph-Q-SAT comparison.** Its public code did not run in the authors' environment, so Table6 imports Kurin et al.'s reported3.94/3.91/2.24/1.54 results. The original Graph-Q-SAT formal p5 defines **Median Relative Iteration Reduction**: median across formulas of baseline decision count divided by guided decision count, then averaged over five training runs. RLAF p21 instead expands MRIR as Mean Relative Improvement in Runtime. That expansion is incorrect for the cited numbers; they must not be quoted as measured wall-clock speedups. Without an explicit matching aggregation script, equivalence of RLAF's own MRIR implementation remains a reproduction detail.

On SAT100, RLAF-SATLIB3.14 and RLAF-Main3.58 are below imported Graph-Q-SAT3.94; on SAT250 they give11.03/7.33 versus3.91. UNSAT100 gives1.56/2.03 versus2.24, while UNSAT250 gives1.30/1.94 versus1.54. Thus small/UNSAT losses coexist with larger-SAT decision-ratio gains. RLAF-SATLIB uses800 satisfiable50-variable training formulas and five runs. RLAF-Main is described here as Glucose-trained on mixed3SAT250, whereas main training elsewhere is3SAT200; retain the source discrepancy rather than silently treating both as the same checkpoint. These results support persistent guidance and some solver/size transfer, not a new hardware-matched runtime leaderboard (AppendixB6/Table6).

**Interpretation/ablations.** Independently trained Glucose/March models have weight correlationsr=.7350/.8456/.8478 on5000 validation variables for randomSAT/coloring/crypto. High structured-instance weights correlate with core membership, while random-SAT backbone membership is less clear. This is a structural observation, not proof of causal importance or direct cross-solver checkpoint equivalence. Weights account for most gains; polarities materially help satisfiable randomSAT. More depth3→5→10 improves3SAT300 decisions in the reported experiment. σ=.05 and.1 perform similarly, while.5 degrades; greater model size or exploration variance is not automatically better. March randomSAT validation cost plateaus/noises after roughly700iterations; preliminary DPO performs worse on tests (Figures5–6/9–10).

## Limitations

### Discussed in the Paper

The prototype trains on easy formulas because millions of solver calls must fit a local CPU/GPU setup. Industrial-scale GNN memory/compute and color-refinement expressivity remain barriers. Distributed feedback collection and integration with newer industrial solvers are future work. Other algorithmic domains such as MIP/CSP are suggestions, not presented experiments (Section4).

### Curator Notes

GRPO clipping/KL regularization supplies no theorem of monotone runtime improvement, optimal branching, polynomial-time solving or an approximation ratio. Completeness remains the classical backtracking solver's property under valid guidance and fair search, not a neural certificate. Decision count and elapsed time differ significantly between CDCL and expensive look-ahead branches. Main means do not establish per-instance dominance or variance robustness.

Several reproduction distinctions are concrete. The official supplement and current repository have identical checked policy/GRPO/evaluation files. Both supervised-transform implementations useαp **without the printed+1** in Equation21; this changes the affine weighting rule, so the released baseline path should not be described as exact implementation of that equation. Evaluation uses default batch200, measures a CUDA event around each batch's inference, attaches that whole batch latency to every contained formula, then adds solver CPU time. Warmup, graph preparation, process launch and host transfers are separate. This is not a clean single-instance end-to-end wall-time protocol, though it includes an explicit GPU-time charge. Exact historical timing/weight-transform settings need confirmation for replication; these distinctions do not by themselves invalidate all reported gains. Solver weights are serialized to four decimals, and extreme values/numeric limits remain implementation conditions beyond ideal strictly positive continuous weights.

## Reproducibility

- **Publication/identity:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/a04c50c0bd6937760a3b89ee10010c96-Abstract-Conference.html), pp98621–98642, official citation_publication_date April20,2026. Jan Tönshoff/Martin Grohe and RWTH Aachen affiliation checked against PDF/official poster.
- **Scientific coverage:** all22 formal pages/references/AppendicesA–B9 read, every table entry and rendered key curve/ablation page checked. Official1001739byte supplemental ZIP234members and author986509byte ZIP235members manually inventoried: source/configs/vendor docs, no extra PDF/TeX/notebook/scientific image. Complete primary READMEs and all unique vendor READMEs read; byte-identical copies documented by hashes. Official event10009842 poster3842133bytes fully inspected. Normal OpenReview NfWrLOKnfk API403 was recorded without bypass. Linked Figshare data page returned202/empty response; it is identified as external data, with no separately described unread scientific appendix.
- **Code:** [author repository](https://github.com/toenshoff/RLAF) and [publisher ZIP](https://proceedings.iclr.cc/paper_files/paper/2026/file/a04c50c0bd6937760a3b89ee10010c96-Supplemental-Conference.zip). Checked LogNormal/Bernoulli mode, variable-summed joint probability/KL, epsilon-normalized GRPO and maximize=True optimizer, separate six model commands, actual affine-transform mismatch, weighted solver interface, checkpoint evaluation and timing pipeline. Key five-file publisher/current SHA comparisons are saved in code-key-file-comparison.json. Publisher README misspells build_sovlers.sh while the actual file/current README is build_solvers.sh; README March learning-rate/KL examples also differ from Table3 and should be treated as examples. No solver/training benchmark was executed.
- **Relations:** four explicit catalogue identities confirmed from actual body plus bibliography. The original Graph-Q-SAT p5 was independently reread to resolve MRIR, while NeuroSAT is kept distinct from later Selsam/Bjørner core-guidance. Noncatalogue solver/survey/CSP citations do not create invented internal nodes.
