---
id: self-improving-wa-star
short_title: Self-Improving WA*
title: Learning to Search and Searching to Learn for Generalization in Planning
authors:
- Michael Aichmüller
- Yannik Hesse
- Hector Geffner
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/aichmuller26a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/aichmuller26a.html
institutions:
- RWTH Aachen University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Classical Planning
summary: Separately trained relational Q-networks guide plan construction and learn from bounded WAstar search;
  strong within-domain transfer has clear failure and selection limits.
code_url: https://github.com/maichmueller/generalized-search-for-planning
---

# Learning to Search and Searching to Learn for Generalization in Planning

> **TL;DR:** Generalized Search for Planning(GSP) alternates relational-GNN-guided weighted-A* search and Q-learning from discovered transitions/solutions. Separately trained domain policies can generalize strongly in object count, but greedy execution often beats search, sliding-tile training fails, and some classical planners are much faster. “Self-improving” describes training, not neural editing of a complete plan.

## Motivation

Sparse rewards make stepwise RL exploration ineffective in difficult deterministic planning. When a transition model is known, best-first search can find informative goal paths more efficiently. GSP uses those searches to improve a relational heuristic, which then guides later searches on instances with different starts, goals and object counts within the same planning domain (Sections1–3).

## Contributions

- An alternating search/Q-learning loop obtains training signals from best-first search without requiring expert plans, goal reversal or hindsight relabeling.
- A relational GNN encodes objects, predicate atoms and explicit action objects, producing size-adaptive action values.
- IPC2023, fixed-size puzzle and PushWorld tests distinguish greedy policies, heuristic search, training progress and ablations (Sections4–6/AppendixA).

## Methodology

**Planning and graph model.** A PDDL domain fixes predicates and action schemas; instances change objects, initial states and goals. The network initializes object vectors at zero, exchanges argument-position-aware messages through predicate-specific MLPs, uses smoothmax aggregation/shared residual updates and reads out each explicit action object's embedding together with a pooled graph summary. Embedding width is32. Predicate-specific parameterization is domain-dependent; the shared action readout within a domain is not evidence for a single checkpoint across unrelated PDDL domains (Sections3/5).

**Search and targets.** Search maximizes `g(s)+wQ(s,a)` using negative-depth return g and w2, expanding state–action pairs. Concrete goal suffixes give returns that lower-bound the optimal return of those path actions. Bellman targets are clamped below by such achieved returns; non-goal samples use ordinary bootstrapping, while states with no applicable actions get a fixed dead-end penalty. A first-discovery visited set avoids repeated expansion. Search stops at the first found goal or its finite budget. The heuristic is learned and need not be admissible; the paper proves no approximation, shortest-plan or universal policy-convergence guarantee for this neural procedure (Section4/Algorithm1).

**Learning and sampling.** A learner and search workers maintain a FIFO40-batch replay store, update a target network every ten buffer passes and optimize squared Q loss. Learning rates are10⁻⁴for the relational network and10⁻³for readout. Instances move among unsolved, satisficed and solved pools with priority sampling. “Solved” means search followed one plan without extra expansions, **not** proof that the plan is shortest. Each search-training episode has a60second budget/batch256. Runs last12hours, with five seeds; main results select the single best validation checkpoint across those seeds (Sections4/6/AppendixA.1).

**Classification.** Specialist / constructive is retained for inference: each native planning domain gets its own learned predicate-specific model. Greedy execution appends actions and heuristic search constructs a plan from the initial state. The training improvement loop does not edit an already complete feasible plan, so the earlier constructive-improvement label is corrected.

## Experiments

**IPC2023.** Ten domains provide70train/30validation/90test instances each. Tests impose10000expansions or one hour. Greedy GSP solves100%in Blocksworld/Miconic/Spanner, including a488-block Blocksworld instance versus fewer than30training blocks. These are strong **within-domain size-transfer** results. WA* reduces coverage relative to greedy in Blocksworld100→79%,Spanner100→27%,Transport73→57%; it helps Sokoban14→32%andFloortile20→28%. LAMA remains stronger on Rovers79%versus24/11%and Satellite100%versus61/33%. Published external baseline clocks and own measurements are not interchangeable (Sections6.1/Table2).

**Puzzles.** Relationally encoded fixed-size Sokoban/TheWitness/24-Puzzle tests use1000instances per domain and100000expansions or five hours. GSPgreedy solves681/667/0. WA* solves all1000Sokoban andWitness instances, with207/548expansions and22.1/94.2seconds in batch1. Fewer expansions do not necessarily mean faster execution: Witness PHS* reports191expansions/1.7seconds. All24-Puzzle tests fail because the finite-budget learner found no training goal path. Batch32changes expansion counts/time and improves plan lengths; keep these modes separate (Section6.2/Table3).

**PushWorld.** Level0training transfers without fine-tuning to Level1, but five of68Level1cases are excluded because they require a previously unseen predicate. On the63evaluable cases, greedy solves5,GBFS44,WA*48 andLAMA60. WA* uses about3.8Kexpansions versusLAMA118K yet takes576versus41seconds on their respective solved subsets. LAMA also has a different30minute/90GBbudget; GSPallows five hours. The reported26versus36step comparison concerns jointly solved instances, whereas Table4'sLAMA40stepmean uses its broader solved subset. Lower expansion counts are not a wall-clock or coverage victory (Section6.3/Table4).

**Ablations and selection.** Table7reports five-seed means/deviations, unlike the main best-run tables. Component removal sometimes helps: without dead-end supervision, greedyChildsnack rises33→53%andFloortile19→29%; without priority sampling,Floortile rises19→33%. The complete method is not uniformly strongest or uniformly lowest variance. AppendixA.3's additional Lifted-HER comparison extends checkpoint selection with benchmark **test instances** after fixed validation, while explicitly excluding them from gradient updates. That secondary comparison therefore is not an untouched-test evaluation; this qualification is not automatically assigned to the separate main IPC protocol (Section6.4/AppendixA.1–A.4/Tables5–7).

## Limitations

### Discussed in the Paper

Q-values generalize better as local action rankings than globally calibrated frontier scores; huge branching factors and limited GNNexpressivity can hurt search. Some predicates are unseen at transfer, and a fixed search-training budget can fail to discover any reward. Combining symbolic heuristics or hindsight signals remains future work (Sections6–7).

### Curator Notes

- The achieved-return lower bound applies to concrete successful suffixes, not a certificate that Q itself is admissible, that all dead ends are detected, or that finite WA* returns a shortest plan. A no-action dead end is only one type of unreachability.
- Section5writes state/goal input as an untagged union, which alone would lose state-versus-goal membership. Released relation formatting includes explicit goal/satisfaction/polarity tags; those distinctions matter for implementing the intended goal-conditioned model. This notation discrepancy does not establish that the released encoder omits goals.
- Main best-of-five checkpoint selection and solved-only plan/time averages favor different subsets; they must be distinguished from seed means and paired-case comparisons. Some very strong generalization anecdotes coexist with complete failure on a different puzzle.
- No benchmark rerun is claimed. General policy/heuristic terminology in the paper concerns generalization across **instances of one domain**, and is not the repository's cross-native-task shared-checkpoint meaning of generalist.

## Reproducibility

The [formal PMLR record](https://proceedings.mlr.press/v306/aichmuller26a.html) identifies ICML2026volume306,pp1434–1450, issued2026-09-29. All17formal pages, complete references, pseudocode, tables and appendix curves were read; relational equations, search pseudocode and result tables were rendered and checked. Publisher links expose the integrated PDF, software and OpenReview; the publisher asset API returned404and OpenReviewCk6Ort0wqc403, with no additional scientific attachment identified through available links.

The [author repository](https://github.com/maichmueller/generalized-search-for-planning) was checked through its71-entry untruncated tree, both complete READMEs and core train/validate/search/relational-encoding code. It contains no additional PDF/TeX/notebook. The documentation gives oneNVIDIAL40S,12hours, four data-generation plus one validation processes; the formal text says five search workers and current `train.py` defaults to five, so these are distinct reported settings. Per-domain training/validation/checkpoint selection supports the specialist scope. The README's “Python1.12” is a documentation typo, not a usable dependency specification. Actual environment installation is not claimed.

The complete bibliography was compared with the current364-entry catalogue; no matching internal paper identity with both explicit in-text citation and bibliography was established. Related external planning/puzzle methods retain their own titles rather than being mapped to a merely similar NCO paper.
