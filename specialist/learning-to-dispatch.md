---
id: learning-to-dispatch
short_title: L2D-JSSP
title: Learning to Dispatch for Job Shop Scheduling via Deep Reinforcement Learning
authors:
- Cong Zhang
- Wen Song
- Zhiguang Cao
- Jie Zhang
- Puay Siew Tan
- Chi Xu
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/11958dfee29b6709f48a9ba0387a2431-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/11958dfee29b6709f48a9ba0387a2431-Abstract.html
institutions:
- Nanyang Technological University
- Shandong University
- National University of Singapore
- A*STAR
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Job Shop Scheduling Problem
summary: A GIN/PPO dispatch policy constructs JSSP schedules with stronger average makespan than four simple rules,
  trading longer inference for quality and transferring within the same scheduling task.
code_url: https://github.com/zcaicaros/L2D
---

# Learning to Dispatch for Job Shop Scheduling via Deep Reinforcement Learning

> **TL;DR:** A GIN/PPO policy selects eligible operations for a schedule-building heuristic. It improves average makespan over four dispatch rules and transfers to larger JSSP instances, but remains slower than those rules and far from optimal/reference schedules.

## Motivation

Priority dispatching rules are inexpensive but require expertise and vary by instance distribution. The paper learns a dispatch policy from operation dependencies and partial-schedule features, targeting deterministic, nonpreemptive job-shop makespan minimization (Sections 1–3).

## Contributions

- An MDP selects the next eligible operation while a classical schedule-generation procedure determines its start time.
- Directed GIN embeddings and shared action scoring support variable numbers of jobs and machines.
- PPO learns policies without optimal-schedule demonstrations; experiments test matched-size instances, larger instances and Taillard/DMU benchmarks. Flow-shop, open-shop, dynamic arrivals and breakdown handling are proposed extensions, not demonstrated shared-model capabilities.

## Methodology

**Scheduling decisions.** Each job has ordered operations assigned to specified machines; machines process at most one operation at a time without preemption. At most one next operation per unfinished job is eligible. An action chooses one eligible operation; the environment places it in an early feasible machine position and updates precedence/resource-order arcs. This constructs a feasible schedule through a chosen schedule generator rather than outputting arbitrary start times or searching the entire schedule space directly (Sections 3,4.1).

**Graph representation.** Node features are a scheduled flag and a completion-time lower bound, equal to actual completion for scheduled operations and recursively propagated through job precedence for unscheduled ones. To avoid a dense machine-conflict graph, the encoder omits unresolved disjunctive arcs and uses a sparse directed approximation with job arcs and decided machine-order arcs. GIN aggregates incoming neighbors for two rounds, with ε fixed at zero; graph context is mean pooling. Candidate node/context embeddings enter an MLP/softmax, masked to eligible operations. Test-time selection is greedy argmax. Sparse encoding is an intentional approximation, not a proof of complete information preservation (Section 4.2).

**Reward and training.** Reward is H(s_t)−H(s_{t+1}), where H is the maximum completion lower bound. With discount one, the sum telescopes to H(s_0)−makespan, aligning the return objective with makespan for a fixed instance; this is not a guarantee of globally optimal learned decisions. Actor and critic share the GIN. Training uses 10,000 updates, four new-instance trajectories per update, one PPO update epoch, clip 0.2, policy/value/entropy coefficients 2/1/0.01 and Adam learning rate 2×10⁻⁵. GIN MLPs have two 64-unit hidden layers; policy/value heads have two 32-unit layers. Validation uses a fixed set of 100 generated instances (Sections 4.1,4.3,5).

**Source/implementation details.** The supplement's printed critic loss uses the estimated advantage as its regression target, whereas the official PPO code computes advantage as return minus detached value and regresses value against return. These are distinct formulas; reproduction should use the specified code version rather than silently treating the pseudocode literally. The paper's insertion illustration also describes delaying an already scheduled operation, while the released `permissibleLS.py` checks legal gaps and inserts the new operation without changing existing start-time values. These are documented source-description differences, not a claim that the released schedules are invalid (main p.4; supplement Algorithm 1; author PPO/environment source).

## Experiments

**Data and comparison scope.** Generated Taillard-style instances cover 6×6 through 30×20 for matched-size learning, with 100 test instances per size. Policies trained on 20×20/30×20 transfer directly to 50×20 and 100×20. Separate policies/settings address public Taillard and DMU groups; DMU processing times range to 199 rather than 99. Four Python dispatch baselines are SPT, MWKR, MOPNR and FDD/MWKR. This is not an exhaustive comparison against advanced metaheuristics, exact solvers under matched budgets or all published dispatch rules (Section 5; supplement Sections 2–5).

**References and gaps.** Generated-instance gaps use feasible schedules returned by OR-Tools with a 3,600-second limit. The “Opt. Rate” column is the proportion for which OR-Tools proves optimality, **not the neural policy's optimal-solve rate**. It is 4%/12% on generated 20×20/30×20 and 2% on 100×20, so most of those reference gaps are not certified optimality gaps. Public-instance gaps use literature best-known upper bounds; asterisks identify known optimal references. Public “Opt. Rate” instead describes which reference instances have known optima (Tables 1–4; supplement table captions).

**Average quality versus time.** The learned rule beats all four baselines on aggregate generated objectives: 6×6 makespan 574.09 versus strongest-rule 604.64, and 30×20 2508.27 versus 2809.62. Yet runtime is higher: 0.061 versus roughly 0.012 seconds at 6×6 and 1.804 versus roughly 0.72 seconds at 30×20. Its generated-reference gaps remain 17.7% and 29.2%. These results demonstrate a quality/time trade-off, not faster inference than dispatch rules or superiority to OR-Tools in solution quality (Table 1).

**Generalization.** The 30×20 policy reaches generated 100×20 makespan 6088.68 and 9.4% gap to the time-limited OR-Tools reference in 28.616 seconds, versus MOPNR 6385.32 and 14.7% in 16.625 seconds. Public Taillard/DMU aggregates also improve the selected rules. Such size/processing-range transfer stays within JSSP and does not establish generalist cross-native-task behavior (Tables 2–4).

**Individual counterexamples.** The supplement reports matched-size wins on 46/50 Taillard and 35/40 DMU instances, rather than every instance. For Ta05 the learned makespan is 1619 versus MOPNR 1605; for Ta31 it is 2565 versus FDD/MWKR 2459. Larger-instance transfer also has failures: DMU71 gives 9797 from the 30×20 policy versus MOPNR 9514, and several high-processing-time DMU cases lose to simple rules. Best-of-two transferred policies and each policy's performance should not be conflated (supplement Tables S.1–S.4).

**Training cost.** Experiments use an i9-10940X CPU and one RTX 2080Ti. Supplemental training curves report roughly 0.95–20.3 hours per displayed configuration, separate from the single-inference runtimes. Curves average successive groups of 200 newly generated instances; they are not multiple-seed uncertainty estimates (main p.6; supplement pp.5–6).

## Limitations

### Discussed in the Paper

The learned policy is less interpretable than hand-written rules and could hide consequential scheduling details. Only selected PDRs are compared. Extending to other shop problems and uncertain/dynamic environments remains future work. Inference is longer than simple dispatching despite better average schedules.

### Curator Notes

Size-independent parameters do not imply reliable arbitrary-size generalization, cross-task shared weights or optimal schedules. The environment's insertion policy and sparse machine-arc approximation matter to what is learned. Reported gaps rely on heterogeneous reference quality and should retain those qualifications. Offline training cost, per-instance losses and source/code formula differences are part of the evidence, alongside aggregate improvements.

## Reproducibility

- **Publication:** [NeurIPS 2020 proceedings](https://proceedings.neurips.cc/paper/2020/hash/11958dfee29b6709f48a9ba0387a2431-Abstract.html), twelve-page publisher article. The PDF and author repository use **Chi Xu**; the landing metadata's “Xu Chi” order was corrected in this note.
- **Scientific reading:** the full [six-page publisher supplement](https://proceedings.neurips.cc/paper_files/paper/2020/file/11958dfee29b6709f48a9ba0387a2431-Supplemental.pdf), including every per-instance row, PPO pseudocode, rule definitions and all training curves. Manual publisher inspection identifies this sole scientific supplement. Main/supplement math, tables and figures were visually checked.
- **Code:** the paper-linked `zcajiayin/L2D` redirects to the [official L2D repository](https://github.com/zcaicaros/L2D). Its README specifies PyTorch 1.6/Gym 0.17.3 and offers saved networks, benchmark data, training/testing scripts and Docker instructions. Relevant PPO value-loss and schedule-insertion routines were inspected; no new performance reproduction was run.
- **Citation graph:** eleven exact internal predecessors are matched by explicit body citations and references. Wu et al.'s 2019 arXiv title/identifier maps to the later Routing Problems article; broad scheduling or GNN citations with different identities were not substituted.
