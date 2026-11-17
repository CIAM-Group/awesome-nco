---
id: simulation-guided-beam-search
short_title: SGBS
title: Simulation-Guided Beam Search for Neural Combinatorial Optimization
authors:
- Jinho Choo
- Yeong-Dae Kwon
- Jihoon Kim
- Jeongwoo Jae
- André Hottung
- Kevin Tierney
- Youngjune Gwon
year: 2022
date: '2022-07-13'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/39b9b60f0d149eabd1fff2d7c7d5afc4-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2207.06190
code_url: https://github.com/yd-kwon/SGBS
institutions:
- Samsung SDS
- Bielefeld University
figure:
  path: paper-assets/simulation-guided-beam-search/framework.png
  alt: SGBS tree search phases for neural expansion, rollout simulation, and beam pruning.
  caption: 'Figure 1: Expansion, simulation, and pruning phases of Simulation-Guided Beam Search.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/file/39b9b60f0d149eabd1fff2d7c7d5afc4-Paper-Conference.pdf#page=4
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Flexible Flow Shop Problem
summary: SGBS keeps per-parent high-probability expansions but prunes them by greedy rollout cost; alternating with
  EAS-Lay adapts task-specific constructive policies for longer search.
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/39b9b60f0d149eabd1fff2d7c7d5afc4-Abstract-Conference.html
---

# Simulation-guided Beam Search for Neural Combinatorial Optimization

> **TL;DR:** Keep promising next actions from each beam member, complete them with greedy simulations, and prune by actual completed-solution quality. Alternating this deterministic search with instance-specific EAS-Lay updates makes longer search useful.

## Motivation

Ordinary neural beam search ranks partial solutions by policy likelihood, which can overvalue a confident mistake. MCTS supplies lookahead but incurs substantial rollout and tree-management costs. SGBS uses a fixed beam and parallel neural completions to obtain objective-based guidance without a full MCTS backup mechanism.

## Contributions

- Introduces per-parent preselection followed by complete-rollout evaluation and fixed-width pruning.
- Combines SGBS with EAS-Lay so improved solutions inform instance adaptation and adapted policies change subsequent search trees.
- Evaluates TSP/CVRP via POMO policies and flexible flow-shop scheduling via separate MatNet policies, including longer-budget, transfer and pretraining analyses.

## Methodology

For beam width `beta`, each partial solution proposes its top `gamma` next actions by the policy's local probabilities. Each expanded child is completed using one greedy rollout. Retain up to `beta` children according to these complete-solution rewards and repeat until terminal. Preselection is **per parent**, not a global ranking of accumulated path likelihoods. The implementation reuses the previously simulated greedy continuation, requiring up to `beta*(gamma-1)` new rollouts per level rather than repeating all `beta*gamma`. [Main, Algorithm 1 and Section 3.2; supplement, B.]

With a fixed model and settings, SGBS is deterministic; repeating it unchanged provides no new search. SGBS+EAS alternates it with sampling and **EAS-Lay** updates to added instance-specific layers. The original pretrained parameters remain fixed. REINFORCE encourages better sampled solutions and incumbent imitation promotes the best solution found by either process. SGBS consumes more than 75% of runtime in most hybrid experiments, so fewer gradient updates can still yield better results. This is adaptive constructive sampling, not a learned local-edit improvement policy. [Main, Section 4 and Algorithm 2.]

The default routing widths are `(beta,gamma)=(10,10)` for TSP and `(4,4)` for CVRP, with eight coordinate augmentations. FFSP uses `(5,6)`. Separate task/size policies remain necessary. For FFSP, greedily evaluate 128 machine-order augmentations first and retain the best eight for search; this screening is part of the protocol. [Main, Tables 1-2; supplement, G.]

## Experiments

**Hardware and budgets.** Reported GPU runtimes are adjusted to a single 80 GB A100 equivalent; CPU solvers use a single CPU and cannot be compared directly by hardware speed. Main routing tests contain 10,000 instances at size 100 and 1,000 each at 150/200. Tables report **dataset-total** times. Routing baselines are rerun on the same test sets, while FFSP classical results are imported from MatNet with GA/PSO CPU times converted back from its divide-by-eight convention. No main-result error bars are provided. [Main, Section 5 and checklist; supplement, F-G.]

**TSP.** Standalone SGBS at size 100 gives 0.058% gap in nine minutes. The hybrid gives 0.035% after three hours and 0.024% after 15 hours, versus EAS's 0.053% and 0.044% at matching budgets. DPDP has 0.004% in two hours in this table, so 'best learned method' is not an unrestricted conclusion across all approaches. At size 200, hybrid gap is 0.378% after three hours and 0.196% after 30 hours. Larger search budgets materially affect quality. [Main, Table 1.]

**CVRP.** Gaps use HGS as a heuristic reference, not LKH3 or certified optimality. At size 100, standalone SGBS gives 0.62% in ten minutes; SGBS+EAS gives 0.20% after six hours and 0.11% after 30 hours. At those hybrid budgets EAS gives 0.35% and 0.23%, while LKH3's gap is 0.53%. At size 200, the hybrid improves from 1.02% at five hours to 0.40% at 50 hours. Comparing these percentages directly with EAS's own LKH-referenced paper would mix different denominators. [Main, Table 1 and Figure 3.]

**Search-efficiency control.** Figure 2 limits completed-candidate evaluations to approximately 1,200 at CVRP100 or 2,400 at CVRP200; it is not an equal-runtime comparison. SGBS is weaker than EAS in the ordinary pretrained size-100 setting, but favorable under the tested size shift and fine-tuning. The appendix initializes most methods from the four best greedy starting customers, whereas MCTS starts from just the single best; MCTS's exploration denominator is also changed for the low rollout budget. These are implementation-specific comparisons, not a universal MCTS inferiority result. [Main, Figure 2; supplement, B-C.]

**FFSP.** Each set has 1,000 instances with 20/50/100 jobs, three stages and four machines per stage. Hybrid means are 24.30/48.35/88.23 after 50/100/200 hours of total dataset time. Standalone SGBS gives 24.96/49.13/89.21 in 12/47 minutes/three hours; MatNet greedy gives 25.38/49.63/89.70 in 3/8/23 minutes. Table 2's 'Gap' is an **absolute makespan difference** from the strongest hybrid mean, not a percentage optimality gap: e.g., 89.21-88.23=0.98. The authors explicitly do not claim global FFSP state of the art. [Main, Table 2.]

**Structured XE CVRP.** Nine groups each contain 20 instances with 100-297 customers. A different base model is trained per group for 3,000 epochs of 10,000 instances each. Search uses ten parallel copies of the same target, eight hybrid iterations, 30 EAS updates per iteration, `(35,5)` widths and rounded integer distances. All nine group means beat EAS and LKH3 in quality but remain above HGS. At `XE_17`, hybrid cost exceeds HGS by 161.0 units and takes 1,117 s, versus LKH3's 152 s and HGS's 126 s. These absolute table differences must not be read as percentage gaps. [Supplement, A, Table A.]

**Pretraining.** Default routing policies are early-stopped intermediate models: TSP100 at 1,900 epochs/about ten days, CVRP100 at 10,000 epochs/about eight days. FFSP policies receive 54/95/120 epochs, about 2/5/35 hours. A separate short-pretraining study reaches LKH3-like CVRP quality with two hours of pretraining **plus three hours of hybrid search on 1,000 instances**. It does not show comparable quality from two-hour training alone. Entropy regularization is a further ablation that can mitigate degradation from excessive pretraining. [Supplement, F-I.]

## Limitations

The method depends on the pretrained constructive policy and cannot recover branches removed during preselection. Greedy rollout scores can misrank promising partial solutions. Increasing beam parameters has diminishing returns, and high headline quality uses substantial adaptation/search budgets. Policies and training remain task specific, so the method is specialist under the repository's shared-checkpoint criterion. Experimental claims depend on candidate counts, initialization, augmentation, early checkpoint selection, reference solver and timing convention; no exactness or approximation guarantee is provided.

## Reproducibility

- **Official code:** [yd-kwon/SGBS](https://github.com/yd-kwon/SGBS), explicitly linked in the paper. The README documents TSP/CVRP inference, search-baseline controls, and FFSP code/model/data via a separate archive. Instructions were inspected; experiments were not rerun.
- **Full reading:** All 13 publisher main-paper pages and all six publisher supplement pages were freshly read, including Appendices A-I and every table. Key algorithms, diagrams, plots and result units were visually checked. [Audit record](../data/reviews/papers/simulation-guided-beam-search.json).
- **Supplement inventory:** The official NeurIPS landing links one six-page Supplemental PDF, fully read. The repository's separately downloaded FFSP archive is documented as implementation/model/data; it is not an unread scientific appendix.
- **Dates and identity:** First arXiv submission 13 July 2022; formal NeurIPS 2022 Main Conference Track. The conference-wide acceptance date was removed, and the author's accent restored.
