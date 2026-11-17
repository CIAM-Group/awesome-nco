---
id: gflownet-combopt
short_title: GFlowNet-CombOpt
title: 'Let the Flows Tell:  Solving Graph Combinatorial Problems with GFlowNets'
authors:
- Dinghuai Zhang
- Hanjun Dai
- Esmeralda S. Whitammer
- Aaron Courville
- Yoshua Bengio
- Ling Pan
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/27571b74d6cd650b8eb6cf1837953ae8-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/27571b74d6cd650b8eb6cf1837953ae8-Abstract-Conference.html
institutions:
- Mila
- Google DeepMind
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Maximum Clique
- Minimum Dominating Set
- Maximum Cut
summary: Task-specific graph-conditioned GFlowNets learn reward-proportional vertex-set construction with transition
  replay and best-of20 decoding.
code_url: https://github.com/zdhNarsil/GFlowNet-CombOpt
---

# Let the Flows Tell: Solving Graph Combinatorial Problems with GFlowNets

> **TL;DR:** Task-specific graph-conditioned GFlowNets construct feasible vertex-set candidates and optimize best-of20 solutions. Transition replay and forward-looking state energies improve training, while exact Boltzmann sampling remains an ideal zero-loss statement rather than a practical optimality guarantee.

## Motivation

Several construction orders can produce the same solution. Reward maximization or trajectory entropy therefore need not explore distinct high-quality terminal objects. GFlowNets target a reward-proportional distribution over terminal objects, aiming to amortize diverse solution generation across graphs. Long graph-construction trajectories motivate training on replayed transitions rather than keeping every trajectory's activation graph (Sections1-3).

## Contributions

- Separate MDPs encode unit-weight maximum independent set(MIS), maximum clique(MC), minimum dominating set(MDS) and maximum cut(MCut).
- Graph-conditioned forward policies/state flows generalize across instances of a task.
- Transition-based detailed-balance learning and forward-looking intermediate energies improve credit assignment and memory use in the studied implementations.
- Best-of20 evaluations compare objective quality and aggregate test runtime on synthetic/SAT-derived graphs, including approximately10,000-node MIS instances.

## Methodology

**State spaces.** Each vertex is selected(1), excluded(0) or undecided. MIS actions select a vertex and exclude undecided neighbors, reaching **maximal** independent sets, not every independent set. MC similarly excludes nonneighbors and reaches maximal cliques. MDS starts with all vertices provisionally included and removes candidates while forcing vertices needed for domination. MCut adds vertices to one side and permanently excludes undecided vertices whose addition would lower the cut. Thus the target support is the actually reachable terminal space, not an unrestricted claim about all binary assignments (Section3.2/AppendixB).

**Reward and learning.** Positive terminal reward is exp(-E/T), with E negative MIS/clique size, positive dominating-set size or negative cut size. Separate five-layer256-dimensional GINs predict forward logits and log state flows; SATLIB doubles depth. The backward policy is uniform over candidate chosen vertices. A forward-looking parametrization log F=-E_tilde+log F_tilde supplies partial-object signals while preserving the detailed-balance target at terminal states. Transition replay uses batch64 and avoids differentiating through the rollout that gathered samples. This still requires complete environment rollouts and network calls to gather data; the savings concern training activation storage/update sampling (Sections2-3/AppendixC).

**Theoretical boundary.** With positive rewards, full support and zero balance loss on all relevant transitions/trajectories, the GFlowNet samples the specified reward-proportional terminal distribution. For a fixed finite support, T→infinity gives uniform sampling and T→0 concentrates uniformly on its optimal-energy terminals. Finite SGD loss, finite temperature and20 samples do not certify an optimum or calibrated sampling distribution. AppendixC's final proof phrase says argmax E, but the stated exp(-E/T) objective and Proposition1 require **argmin E**. This is a sign typo in that sentence, not an alternative maximization target (Sections2-3/AppendixC).

**Task sharing.** The model conditions on a graph within a configured task. Task-specific MDPs/rewards and independently trained configurations are used; there is no demonstrated unchanged common checkpoint across MIS/MC/MDS/MCut. The conditional label therefore does not justify classifying it as a generalist solver.

## Experiments

**Data and budgets.** Small/large synthetic graphs contain200-300/800-1,200 vertices; RB is used for MIS/MC and BA with four attachment edges for MDS/MCut. Training has4,000 graphs per synthetic setting; validation/test each have500. SATLIB has40,000 graphs, largest1,347 vertices. Adam1e-3,20 epochs, inverse temperature500 and five seeds are reported; the largest ER task uses a separately specified temperature coefficient1,000/batch32. Inference samples20 solutions per graph and reports the best. Hardware is Tesla V100; a40GB device is separately mentioned for the trajectory-memory illustration (AppendicesC-D).

**Metric definitions.** Main metrics are mean objective and total latency over the test set, not single-instance times. MIS uses KAMIS as a reference and other tasks use Gurobi. These finite solver results are not automatically exact certificates. Maximization DROP is1-algorithm/reference; minimization GAP is the less usual1-reference/algorithm. Ratios use test-set aggregate objectives rather than mean per-instance ratios, so they should not be silently replaced with the conventional (algorithm-reference)/reference gap (Section5/footnote3).

**MIS.** Small/large/SATLIB means are19.18/37.48/423.54, with DROP4.57/13.14/0.57% and test-set times32s/4m22s/23m13s. KAMIS means20.10/43.15/425.96 are better; PPO gives19.01/32.32/421.49, but is faster on SATLIB,13m12s. Supervised INTEL/DGL disable graph reductions and2-opt, retaining queue pruning/weighted queue popping. Their10-hour dashes mean no sufficiently meaningful result under this restricted configuration, not inability of every full solver implementation (Table1/AppendixD).

**Other tasks and negative cases.** Small MC mean16.24 versus Gurobi19.05 and best non-OR baseline14.82; large MC31.42 versus33.89 and27.94. MDS gives28.61/110.28 versus Gurobi27.89/103.80. Large MCut is a counterexample to universal superiority: GFlowNet2864.61(DROP1.74%) is below Erdos2870.34(1.54%) and takes21m20s versus2m49s. Small MCut's704.30 only narrowly exceeds MFA704.03 and takes2m57s versus1m36s. Large MDS32m12s is much slower than annealed3m55s, despite slightly better size110.28 versus111.50 (Tables2-3).

**Larger MIS/protocol limits.** ER700-800/9000-11000 means41.14/349.42 have DROP8.53/6.98% relative to KAMIS44.98/374.57. The largest neural time is1h49m43s versus PPO1h02m29s and KAMIS7h37m21s. DIMES/DIFUSCO comparisons are explicitly not protocol matched: training counts, data folds, supervision and decoding variants differ. They support contextual comparison, not a controlled universal SOTA claim. Ablations cover loss variants, temperature, exploration noise and depth, but main optimization tables report best-of20 objective quality rather than a comprehensive quantitative terminal-diversity/coverage benchmark (AppendicesC-D).

## Limitations

### Discussed in the Paper

Sequential construction costs more inference time than one-pass probabilistic models. Long trajectories strain training memory and credit assignment, motivating transition sampling/forward-looking energies. Dense intermediate reward design is task specific; large MCut is an explicit quality exception (Sections3/5).

### Curator Notes

The ideal sampling theorem requires the actual reachable state space and exact balance, neither a practical optimum nor arbitrary-size generalization. The printed MCut transition does not guarantee a full one-vertex-flip local maximum: on a four-node star, selecting a leaf then its center is legal; the other leaves are excluded, giving cut2, but removing the selected leaf gives cut3. It rules out improving additions from the outside, while selected vertices are never reconsidered. This is a small mathematical counterexample to that local-optimality sentence, not evidence against the reported empirical objectives.

The current MDS implementation also needs initial-isolated-vertex handling: it begins all vertices undecided and may delete an isolated vertex before its forced-inclusion check; a singleton would then return the empty, nondominating set. The reported connected BA setting does not test that edge case. These precise boundaries should accompany broad feasibility language. No training/benchmark was rerun; current code was inspected to match transition/loss/best-of20 behavior.

## Reproducibility

- **Publication:** [NeurIPS2023 proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/27571b74d6cd650b8eb6cf1837953ae8-Abstract-Conference.html), official HTML publication date December15,2023. Current publisher metadata and author README use Esmeralda S. Whitammer, while the PDF prints Nikolay Malkin; the catalogue retains the publisher's current author list. Publisher title omits “Optimization”, included in the PDF heading; this version difference is recorded explicitly. Affiliations are Mila/Google DeepMind.
- **Scientific coverage:** all eighteen [publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2023/file/27571b74d6cd650b8eb6cf1837953ae8-Paper-Conference.pdf) pages, full bibliography, AppendicesA-D, all MDPs/limit proof/results. Publisher action links list no scientific supplement; the full official author archive contains no extra PDF/scientific archive. Key figures/tables/formulas were rendered and checked.
- **Implementation:** [official GFlowNet-CombOpt](https://github.com/zdhNarsil/GFlowNet-CombOpt), complete archive inventory, README, four MDP transitions, balance/replay modules, configuration and20-sample evaluation inspected. Public code is not a claim of fully reproduced baselines/checkpoints or matched historical protocols.
- **Relations:** twenty current-catalogue papers have explicit matching body citations and bibliography identities, including the MIS audit, neural MIS/search/branching baselines, routing methods, DIFUSCO/DIMES, learned SAT local search and robust GFlowNet scheduling. Bilbro1988 mean-field annealing and Deudon2018 policy-gradient heuristics are also explicitly cited and bibliography-confirmed. Bilbro1988 mean-field annealing and Deudon2018 policy-gradient heuristics are also explicitly cited and bibliography-confirmed. Foundational GFlowNet citations are not automatically NCO catalogue relations.
