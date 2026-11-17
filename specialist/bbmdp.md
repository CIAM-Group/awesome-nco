---
id: bbmdp
short_title: BBMDP
title: A Markov Decision Process for Variable Selection in Branch & Bound
authors:
- Paul Strang
- Zacharie Alès
- Côme Bissuel
- Olivier Juan
- Safia Kedad-Sidhoum
- Emmanuel Rachelson
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/923464fb9fc9e0e0cc64878b52e09ed2-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/923464fb9fc9e0e0cc64878b52e09ed2-Abstract-Conference.html
institutions:
- EDF R&D
- CNAM
- ENSTA Paris
- ISAE-SUPAERO
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: A full-tree MDP and DFS subtree decomposition support separately trained multi-step graph DQN branching
  agents with histogram losses; aggregate RL gains have explicit IL/transfer exceptions.
code_url: https://github.com/abfariah/bbmdp
---

# A Markov Decision Process for Variable Selection in Branch & Bound

> **TL;DR:** BBMDP models the entire branch-and-bound process as a conventional MDP, derives a DFS subtree decomposition, and trains separate graph DQN branching agents with actual sequential multi-step targets and a histogram loss. Reported aggregate performance improves earlier RL agents, while imitation learning remains stronger overall and some transfer tasks favor other baselines.

## Motivation

Branching affects future subproblems, incumbents and pruning. A current-node-only representation with two child successors is not a conventional sequential MDP in general. This matters when extending one-step subtree updates to multi-step learning or search-based policy improvement. The paper distinguishes a complete classical MDP model from practical local neural approximations (Sections1-3).

## Contributions

- A deterministic full-tree state and fixed node-selection rule define a conventional branch-and-bound MDP.
- Under DFS, policy-value decomposition reduces learning to the current subtree and its entering incumbent, with a one-step Bellman identity.
- Multi-step targets follow actual sequential expansions and their remaining frontier, unlike simultaneously unfolding every tree branch to a fixed depth.
- A log-scale histogram Gaussian loss and Rainbow-style DQN components yield improved reported RL branching performance on four generated MILP families, with detailed ablations and reproducibility material.

## Methodology

**Formal model.** State contains the full partial B&B tree and incumbent; the MILPs attached to its nodes contain the remaining mathematical information. A fixed node-selection rule determines the next open node. Branching on a fractional integer variable adds two children, and a formal reward-2 per branch makes undiscounted return the negative number of added tree nodes. Stopping when no nodes remain gives classical optimality if exact B&B completes. Node count is a proxy for computation, not a wall-time identity. The definition also permits nonfractional-action self-loops; the bounded-episode/node-count interpretation requires valid branching actions/proper terminating policies, as used by candidate masking in code (Sections2-3.1).

**DFS assumptions and Bellman updates.** With ordinary deterministic B&B dynamics and DFS, an earlier subtree is completely resolved before another begins, fixing the later subtree's entering incumbent independently of how the earlier subtree was searched. Proposition3.1 cancels the unaffected open-subtree terms and obtains local value=-2+left-value+right-value. Exact optimal subtree values permit optimal branch choices under these assumptions; they do not certify a fitted network or arbitrary node-selection strategy. The k-step update counts k actual branch expansions and bootstraps the resulting frontier, including termination/pruning handling. Current LP features are the learned observation, not the full formal state (Sections3.2-3.4/Figure3/AppendixA).

**Neural training.** A variable-constraint bipartite GCNN outputs18 histogram logits per candidate. Targets are encoded on log2(-value), with Gaussian smoothing sigma0.75. Training uses double DQN,3-step returns, prioritized replay and soft target updates. Practical rewards are-1 for all RL baselines, a constant rescaling of the formal-2 convention. Adam rate5e-5, batch128, replay20000-100000, soft-update1e-4, mixed epsilon-greedy/Boltzmann exploration and200000 gradient updates are reported. DQN-BBMDP/TreeMDP use gamma1 while Retro uses0.99. AppendixB's stated histogram decoding and actual released decoding differ as recorded below (AppendicesB,E,G).

**Scope.** Models are explicitly trained separately for each of set covering, combinatorial auction, MIS and multiple knapsack. The common MDP/architecture and larger-instance tests do not demonstrate one checkpoint across those native tasks. It remains specialist constructive solver control, not neural editing of a complete primal incumbent. MCTS, learned cut selection and primal-search extensions are discussed future opportunities rather than demonstrated applications.

## Experiments

**Protocol and cost.** SCIP8.0.3/Ecole disable restart and cuts beyond the root, with a one-hour limit. Each family has100 unseen same-size and100 larger transfer instances, averaged over five seeds. Auctions grow100items/500bids to200/1000; set covering500 to1000rows with1000columns; MIS500 to1000nodes; knapsack6 to12bins with100items. A DGXA100 system(8xA10040GB,2xEPYC7742,1TBRAM) is reported. Training takes approximately2days auction,3set-cover,5knapsack and7MIS; validation uses20 instances. These offline costs are separate from online solve time (Section4/AppendicesF-H).

**Metrics/references.** Tables report geometric-mean nodes and solve time outside presolve, with presolve separately listed. The standard-deviation and solved-count tables matter when timeouts occur; final dual gap orders tied timeouts in ranking. Presolve alone is4.74s for same-size set cover versus subsecond learned branching times, so excluding it materially enlarges apparent end-to-end speedups. Conventional SCIP branching also triggers formulation strengthening, making raw node counts across learned and classical rules an incomplete performance comparison (Sections4.1-4.2/AppendixI).

**Same-size results.** DQN-BBMDP has152.3/97.9/103.2/236.6 mean nodes on the four tasks, better than the compared RL agents. Relative to DQN-Retro, aggregate normalized node/time scores137/160 versus100/100 correspond to about27%/38% reductions in these reported metrics. IL remains better in aggregate(82nodes/95time), and MIS IL0.36s is faster than BBMDP0.69 in main Table1. IL-DFS is also faster on set cover0.74 versus0.77 and auction0.56 versus0.62. Multiple-knapsack SCIP0.53 beats BBMDP0.66. Thus neither all-baseline SOTA nor uniformly faster solving is claimed (Table1).

**Transfer exceptions.** BBMDP times46.4/11.8/81.3/109s improve the DQN-Retro aggregate, but PG-TreeMDP is better on MIS(39.5s,3133nodes versus81.3,7168), and DQN-TreeMDP/Retro are better on knapsack(65.1/79.5s versus109). IL's aggregate39nodes/54time and SCIP62/90 also beat BBMDP100/100. BBMDP solves95/100 transfer MIS versus IL/SCIP/PG100/100; on knapsack it solves100 but is slower than several methods. This is transfer within each family, not across unrelated MILP domains (Tables1,6-7).

**Ablation/implementation context.** At one-step, removing BBMDP changes nothing; adding the histogram loss improves node counts from175.8 to158.9. Three-step BBMDP reaches152.3, while three-step TreeMDP178.9 is worse than its one-step175.8. Removing DFS slightly improves set-cover counts150.1, outside the DFS decomposition's guarantee. A substantial fraction of the observed gain is attributed by the authors to the loss, not solely the MDP. PG uses official pretrained weights; other DQN baselines are reimplemented, and IL is the Ecole reimplementation. AppendixC explicitly evaluates all knapsack baselines except IL-DFS with SCIP's default node selection, despite the theory's DFS restriction (Table2/AppendicesC-D).

## Limitations

### Discussed in the Paper

RL generalization still lags IL, potentially because transfer subtrees exceed training value scales. Three benchmarks were stopped before apparent convergence, and no knapsack agent converged. Node-selection effects and differing retro-baseline constructions complicate comparisons. Exploring MCTS, other RL algorithms and domain adaptation remains future work (Conclusion/AppendicesD,H).

### Curator Notes

**Theory scope.** Classical MDP/Bellman identities do not establish finite-sample neural convergence, polynomial solving time or optimal learned branching. The reduced-state arguments require DFS and the stated deterministic B&B information; solver-wide history, changing cuts/pseudocost state or different node selection are not automatically covered. Correctness of a fully completed classical solver is distinct from speed or success within the time cap.

**Published/released differences.** Rendered AppendixB decodes a histogram as sum_i p_i*(-2^center_i). Both the publisher code and author repository instead return -2^(sum_i p_i*center_i) in TreeDQNAgent._to_value_from_logits, generally a different quantity by Jensen's inequality. They can rank two broad distributions differently. The release uses a proper PyTorch cross-entropy loss; the main-text shorthand for that loss should not be copied as an executable formula. These are documented implementation/prose differences, not proof that historical tables used any particular revision.

Main Table1 reports MIS BBMDP0.69s versus AppendixI Table7's0.62, and IL knapsack transfer43.5 versus46.5; smaller discrepancies also occur for random-transfer results. AppendixI Table6 gives knapsack test wins SCIP88/100 versus BBMDP6/100, contradicting a broad reading of the main prose that BBMDP wins most against all baselines there. The supplemental standalone benchmark figure uses older normalized numbers816/229/186/152/100/61 rather than the main995/233/151/137/100/82. The main figure/table are used here, with source differences retained explicitly. No benchmark was rerun.

## Reproducibility

- **Publication:** [NeurIPS2025, volume38](https://proceedings.neurips.cc/paper_files/paper/2025/hash/923464fb9fc9e0e0cc64878b52e09ed2-Abstract-Conference.html), pages100886-100912, DOI10.52202/085713-3377. The official HTML issued metadata is April23,2026, distinct from the2025 conference year. Six authors/EDF-CNAM-ENSTA-IPParis-ISAE affiliations checked; accented names restored.
- **Coverage:** all27 proceedings pages, bibliography/checklist and AppendicesA-I; the complete25.2MB publisher ZIP inventory adds five one-page scientific figure PDFs, all separately registered/read/rendered(32scientific source pages). Four training curves match the appendix plots; the standalone summary figure differs as described. The folder's ICML2025 name does not change the publisher identity of this attachment.
- **Code:** [abfariah/bbmdp](https://github.com/abfariah/bbmdp), author5.2MB ZIP and publisher implementation, READMEs/INSTALL, candidate masking, tree-transition training, histogram decoding/loss, parameters and timing inspected. SCIP8.0.3, PySCIPOpt4.3.0, PyTorch/Geometric and Ecole are dependencies. Data/models are supplied; no pickle execution, retraining or solver reproduction was performed.
- **Relations:** only exact in-text/bibliography identities in this catalogue. The Poppy relation uses the explicitly cited earlier title Population-Based Reinforcement Learning for Combinatorial Optimization and its identical arXiv2210.03475, not a guessed title match. Other similarly named LNS/branching papers are not conflated.
