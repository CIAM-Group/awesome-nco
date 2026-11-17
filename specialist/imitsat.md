---
id: imitsat
short_title: ImitSAT
title: Boolean Satisfiability via Imitation Learning
authors:
- Zewei Zhang
- Huan Liu
- Yuanhao Yu
- Jun Chen
- Xiangyu Xu
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/48adb34f7ee39177c4c23a8e4253a492-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/48adb34f7ee39177c4c23a8e4253a492-Abstract-Conference.html
institutions:
- McMaster University
- Xi'an Jiaotong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
problems:
- Boolean Satisfiability
summary: KeyTrace behavior cloning guides a few early CDCL branches; propagation gains coexist with small-context
  filters, solver-specific overhead, negative advanced-solver cases and implementation guard limits.
code_url: https://github.com/zewei-Zhang/ImitSAT
---

# Boolean Satisfiability via Imitation Learning

> **TL;DR:** A Perceiver-AR imitates surviving CDCL decisions and proposes a few early branches before reverting to native heuristics. Propagation counts often improve, but plain MiniSAT remains faster on easier cases, advanced-solver gains depend on configuration, and structured/industrial tests are small, filtered subsets.

## Motivation

Raw CDCL traces contain decisions later erased by backtracking. Cloning those detours may waste supervision and obscure the useful prefix. ImitSAT collapses traces into surviving decisions/propagations, then learns the next signed decision from a CNF and current prefix. The motivating88.9% propagation share is measured on the **Python MiniSAT61–100-variable test set**, not a universal cost decomposition for every SAT engine (Sections1/4, AppendixC).

## Contributions

- KeyTrace extraction compresses complete expert traces by trimming backtracked suffixes and handling restarts.
- Decision-level behavior cloning casts CDCL branching as prefix-conditioned next-symbol prediction using a one-latent Perceiver-AR.
- A small early-query budget with legality-based fallback integrates predictions into classical CDCL.
- Random/structured SAT, matched-training baselines, query/curriculum/augmentation studies and CaDiCaL/Kissat integrations test benefits and limits; released code/model/dataset cards and runnable examples aid inspection (Sections4–5/AppendicesA–R).

## Methodology

**Demonstrations.** A level-annotated trail records decisions D, implications A and backtracks BT. Extraction keeps a working sequence: D/A events append, backtracking trims levels above the target then inserts the surviving signed literal, and restarts trim to level0. The formal Equation7 normalizes the inserted event to D, whereas the worked Equation19 and raw implementation retain a BT tag before serialization; utils/keytrace_utils.py subsequently converts BT→D and removes levels/A tags, so distinguish raw traces from model inputs. This retains useful consequences of a completed expert run; calling the trace conflict-free is an empirical near-conflict-free observation, not a theorem that learned replay avoids conflicts (Section4.1/AppendixH).

The model input is [CNF], DIMACS signed-integer clauses separated by0, [SEP], serialized surviving decisions/implications, then a D probe. Cross-entropy supervises the next signed variable at decision positions. The one output latent cross-attends to input lengthN and avoids a full N-by-N decoder attention matrix; at fixed width/output length its attention cost is linear inN, not a theorem that complete CDCL search is linear-time. The architecture has12 blocks,16 heads,4x feed-forward expansion, squared-ReLU and.1 dropout. Variable-ID permutations and a small-to-large curriculum combat overfitting (Sections4.2/5.1/AppendicesF–G).

**Deployment.** The policy argmax proposes one signed variable. An ideal legality predicate requires a nonzero in-range **unassigned** variable; otherwise native VSIDS handles the decision. Three front-loaded queries are default, with five-query variants. This is a legality fallback, **not a calibrated confidence-threshold test**. Algorithm1 decrements a query before checking validity, and current MiniSAT/CaDiCaL code does likewise; the prose's only-legal-predictions-consume-budget wording is inconsistent. The budget must persist across branch callbacks despite the abbreviated Algorithm1 reinitialization line. All other solver reasoning is classical; completeness/UNSAT correctness require valid integration and eventual native CDCL search, not a neural proof of satisfiability (p7/AppendixA).

**Scope.** The actual neural action guides branching of a partial CDCL trail, supporting **constructive**. The primary demonstrated task remains SAT decision, with one shared model transferring across CNF distributions and solvers. PRET requires precise scope: AppendixB identifies its60-variable UNSAT two-coloring family, and the original SATLIB description says the graph encoding adds a **parity constraint to force unsatisfiability**. It is not ordinary unconstrained graph two-colorability or a graph optimization benchmark. Only four60-variable PRET instances fit the paper's≤100-variable filter; this very small constrained decision transfer must not become a broad multi-problem optimization claim. **Specialist** is retained because no independent native graph decision/reduction protocol preserving its original answer is demonstrated, unlike explicit native-task SAT reductions elsewhere in this catalogue. This does not erase the real unchanged-weight, no-tuning cross-structure result: PRET MRPP=.42/Win@1%=1 on the four all-UNSAT formulas. Root independently checked pp9/15 and the primary-source distinction (pp9/15, primary SATLIB PRET description).

## Experiments

**Data and compute.** Training uses planted satisfiable random3-SAT with clause/variable ratio4.1–4.4. Buckets5–15/16–30/31–60/61–100/fixed50/fixed100 have2M/1M/.5M/.1M/1M/.1M formulas, totaling4.7M before multiple prefix examples. Held-out tests have5000/5000/1000/100/100/500 instances. Structured SATLIB tests include AIM/JNH/PARITY satisfiable and PHOLE/PRET unsatisfiable, all≤100 variables. FourV100 GPUs limit training; current repository reports ColabA100 evaluation and hardware-dependent JAX/XLA numerical variation. SATformer/Graph-Q-SAT use both their original public training setup and starred variants retrained on equivalent-volume ImitSAT data (Section5.1/AppendicesB/L).

**Metrics.** MRPP is the median per-instance propagation ratio to plain MiniSAT, and Win@1% is the fraction achieving at least1% fewer propagations. They are not SAT accuracy, optimum rates, mean speedup or proof size. The current metric script excludes zero-baseline propagation cases from both ratios and win denominators; Equation16 instead prints anN denominator alongside a positive-baseline sum, so denominator handling must be explicit when preprocessing solves instances. Wall-clock starts at the CDCL solve loop, excludes CNF parsing/simplification and includes model queries; JAX checkpoint load/compilation/warmup outside that loop are not per-instance solve cost (pp8–9, code analysis_data/metrics_mrpp_win.py and run_ImitSAT.py).

**Random SAT.** Three-query MRPP across the six buckets is.75/.83/.75/.78/.74/.76, with win rates.68/.65/.65/.64/.69/.60. Five queries can help MRPP on fixed50(.66) but worsen fixed100(.83 versus.76) and several win rates. These are substantial aggregate reductions with losses/ties on individual instances, not guaranteed monotone benefits from more calls. Retrained GQSAT* often exceeds ratio1, showing training-protocol sensitivity rather than an inherent theorem about RL versus imitation (Table1).

**Structured SAT.** With five calls, MRPP is.85 JNH/.81 AIM/.30 PARITY/.82 PHOLE/.42 PRET. The prose's lowest-or-tied-on-all-families claim is too broad: retrained GQSAT*-5 has PHOLE.77, better than ImitSAT.82. PRET Win@1%=1 concerns only the four small selected UNSAT encodings. Three-query JNH and PHOLE have median1, not strict improvement. No retraining/tuning is used for these transfers, but formula-family generalization is not itself a large-scale industrial result (Table2).

**Wall-clock qualification.** Table12 explicitly selects the **50 hardest test instances** in each variable range. Total solve times16–30/31–60/61–100 are ImitSAT.85/2.70/6.11seconds versus plain Python MiniSAT.53/2.54/6.44; thus the learned solver is slower on the first two and about5.1% faster on the hardest range. These are selected50-instance totals, not averages over every test bucket or speedups over optimized C++ MiniSAT. It beats the other learned methods in those rows. The large propagation share and expert-replay reduction do not guarantee net runtime savings once neural overhead is included (Sections5.4/AppendixO).

**Expert replay and training controls.** On61–100, expert replay reduces means71.96→.11 conflicts,103.94→20.38 decisions and1474.64→62.74 propagations. This uses the **completed run's expert trace on the same formula**, an oracle analysis distinct from learned test prediction. The staged curriculum's16–30 MRPP.83 loses to same-total430k-step from-scratch.80, though it retains small-instance competence and beats130k-step from-scratch1.00. Therefore its main evidence is sample efficiency/coverage, not uniformly better end accuracy. Removing permutations gives MRPP1.00 versus.75, while replacing CNF text with naive trained-GNN embeddings also worsens1.00/.99 versus.75/.83 (Tables7/10–11/13).

**Scheduling/fallback controls.** Front-loading three queries beats spacing/delaying them on fixed100/AIM. Forced legal Top-K choices can harm OOD cases: JNH1.33/1.68 for3/5calls versus unmasked fallback1.00/.85; AIM5call1.04 versus.81. Low confidence is a proposed explanation for this ablation, not a measured calibrated deployment threshold. Diminishing-return budget plots on5–15 motivate default3; they do not supersede the explicit nonmonotone table entries (Tables8–9/14/AppendixN).

**SATCOMP and advanced solvers.** SATCOMP is filtered to≤100 variables with the entire DIMACS formula fitting context. MiniSAT is capped at10seconds; Figure6 groups30 **solved** instances after runtime sorting. ImitSAT/SATformer compare well against GQSAT's harder tail, but this is not unfiltered competition-scale coverage or a reported complete solved/timeout leaderboard (AppendixM).

CaDiCaL results exclude preprocessing-solved instances. Random-bucket MRPP3call is.73/.74/.73/.63/.73/.66; JNH instead worsens1.15 or1.46 for3/5calls. Current integration uses PySAT Cadical195, so do not silently equate it with the CaDiCaL2.0 reference without a historic version record. Kissat default probing/lucky mechanisms often solve these small formulas before any branch call, giving near1.0 random-bucket ratios. The reported structured Table17 disables **probing**: PRET improves.21/.06, but AIM5call worsens1.03 and JNH5call ties1.00. These are propagation metrics and configuration-specific benefits, not demonstrated universal advanced-solver runtime wins (AppendixR/Tables15–17).

## Limitations

### Discussed in the Paper

Compute limits constrain training duration/model scale. The text interface/context restricts tested formulas to small instances, and expert trace generation requires completed solver runs. Overfitting motivates augmentation; naive graph/text fusion fails. Query overhead can exceed search savings, larger budgets may hurt, and solver preprocessing can bypass neural decisions entirely. Richer demonstrations and imitation/RL combinations are proposed future work.

### Curator Notes

No approximation/optimization guarantee, learned SAT certificate or guaranteed conflict-free replay follows from behavior cloning. Legal branch guidance preserves the classical solver's reasoning only with a correct guard and solver implementation. In the current MiniSAT wrapper, parse_int_if_valid accepts token0, the upper-range/assigned checks omit abs(token)≥1, vocab.txt contains0, and compute_next_decision_value(0) returns−1 while lit_Undef is−2. This is a concrete unguarded static path if the model predicts0 and the last variable is unassigned; it does **not** establish that such output occurred in reported experiments or that published outcomes are wrong. The CaDiCaL wrapper explicitly checks1≤var≤n. Exact historical integration should be checked before unconditional completeness claims.

Current code's context8196 can truncate CNF/prefix inputs, reinforcing the formal context-fit qualification. It loads a shared ImitSAT.npz before folder evaluation and includes a JAX warmup before per-instance solve timers. The default config/training100epochs/current5–15file/replay settings are examples rather than the full formal multi-stage schedule. Main paper, Algorithm1, rawBT examples and normalized serialization use slightly different levels of abstraction; notes preserve those distinctions instead of treating every line as byte-identical execution. No model/solver benchmark was run during this audit.

## Reproducibility

- **Publication:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/48adb34f7ee39177c4c23a8e4253a492-Abstract-Conference.html), pp43867–43889, official citation_publication_date April20,2026. Five authors/two institutions checked; Yuanhao Yu capitalization normalized from publisher uppercase.
- **Coverage/source inventory:** all23 formal pages, full references/AppendicesA–R and every scientific table read; key formulas/algorithm/results rendered. Publisher page lists only the integrated paper. Official event10010041 poster1489974bytes fully inspected, along with author assets/keytrace.png on a white background. Normal OpenReview LNqWbY5iIf API returned403 without bypass. The author4556148byte ZIP89members has source/data/README/one scientificPNG and no PDF/TeX/ipynb. Complete main/dataset READMEs, HuggingFace model/dataset cards, all38 cells of the updated Colab and12 cells of the earlier linked Colab were read; notebooks were inspected, not executed.
- **Implementation:** [author repository](https://github.com/zewei-Zhang/ImitSAT), [model card](https://huggingface.co/zeweizhang/ImitSAT), [dataset card](https://huggingface.co/datasets/zeweizhang/ImitSAT-KeyTrace). Checked one shared checkpoint load, prefix serialization/BT normalization, dataset decision-target construction, actual budget/legality fallback, solve timing, metric zero-denominator handling and CaDiCaL/Kissat integration options. The base GitHub tree contains checkpoint placeholders; trained parameters are external. README's evaluation path analysis/ differs from the actual analysis_data/ location, which the Colab uses correctly.
- **Dataset identity:** primary [SATLIB PRET description](https://www.cs.ubc.ca/~hoos/SATLIB/Benchmarks/SAT/DIMACS/PRET/descr.html) confirms graph two-coloring **plus a forced-UNSAT parity constraint**, four60-variable160-clause instances within the formal filter. Its stray satisfiable=yes table cells conflict with its title/prose and the SATLIB overview; this audit follows the consistent UNSAT description rather than repeating those cells.
- **Relations:** five explicit catalogue identities are paired with actual in-text and bibliography evidence. Original NeuroSAT(Selsam et al.) is distinguished from Selsam/Bjørner's later unsat-core-guided solver; the latter title, SATformer, NeuroBack and other noncatalogue works do not create invented nodes.
