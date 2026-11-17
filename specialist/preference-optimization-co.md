---
id: preference-optimization-co
short_title: PO-CO
title: Preference Optimization for Combinatorial Optimization Problems
authors:
- Mingjun Pan
- Guanquan Lin
- You-Wei Luo
- Bin Zhu
- Zhien Dai
- Lijun Sun
- Chun Yuan
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/pan25e.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/pan25e.html
institutions:
- China Mobile
- Peking University
- Tsinghua University
- Jiaying University
- Sun Yat-sen University
- Central South University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Flexible Flow Shop Scheduling Problem
summary: PO trains existing task-specific CO policies on reward-ranked solution comparisons,
  optionally adding local-search winners during fine-tuning; empirical improvements
  do not establish exact finite-temperature entropy-RL equivalence.
code_url: https://github.com/MingjunPan/PO4COPs
---

# Preference Optimization for Combinatorial Optimization Problems

> **TL;DR:** Replace raw reward advantages with comparisons between sampled solutions, then train their relative policy log-probabilities. Local-search-improved trajectories can provide additional winners during fine-tuning. Here preference means better solution quality, not a multi-objective weight vector or human judgment. Each native task/backbone is separately trained.

## Motivation

Small reward advantages can weaken REINFORCE updates late in training. The paper uses ordinal comparisons to retain a signal favoring better sampled solutions, and moves optional local search into post-training so a direct neural constructor can benefit without adding search to its later inference pipeline. The measured objective is still required to generate the preference labels (Sections1-3).

## Contributions

PO applies a statistical-comparison-style loss to trajectory policy probabilities. A Gibbs-policy derivation motivates reparameterizing reward differences as scaled log-policy differences; an additive instance-dependent reward-shift proposition explains partition-function cancellation. The method is evaluated as a replacement training objective for attention-based routing constructors, MatNet scheduling and additional population/hybrid solvers. An optional fine-tuning phase learns from local-search-refined solutions.

This is a specialist solver-training framework, not one checkpoint for TSP, CVRP and flexible flow shop scheduling. Its optimizer is architecture-reusable; actual models, task representations and training runs are separate. The additional DIMES experiment remains a hybrid method with inference-time search.

## Methodology

For each instance, sample several trajectories and compare their rewards. For cost minimization, reward must prefer lower cost, e.g. negative route length/makespan; the main text's positive-length reward wording should not reverse that ordering. A winning trajectory receives a label1 against a worse one; ties contribute no winning comparison. With Bradley-Terry, the comparison log-likelihood is log sigmoid(alpha*(log pi(winner)-log pi(loser))). Sum log-probabilities over trajectory actions and average the pair losses. Thurstone, ranking-based Plackett-Luce and a linear log-ratio/exponential-score alternative are also studied (Equations6-8; Algorithm1; AppendixC/E).

After initial training, TSP2-opt or CVRP swap* can produce improved trajectories. Their policy log-probabilities are evaluated as teacher-forced candidates and added to preference comparisons. This is an imitation-style training surrogate; no importance-weighted unbiased on-policy-gradient guarantee is established for the local-search candidates. Search incurs fine-tuning computation even when absent from the final constructor's inference (Section3.4).

**Theory and its scope.** For a finite feasible trajectory space, accessible rewards and alpha>0, the unrestricted entropy-regularized optimum has Gibbs probabilities proportional to exp(reward/alpha). Shifting every trajectory reward by the same instance-dependent constant leaves this distribution unchanged; Proposition3.1/AppendixD prove that result. It does not by itself prove convergence of the neural comparison objective, exact optimal solutions, or recovery of the original reward's finite-temperature distribution from deterministic rank labels.

## Experiments

**Routing/scheduling.** Table1 evaluates10,000 uniform TSP/CVRP instances at20/50/100 nodes, with aggregate solving times. POMO-TSP100 gaps improve0.15%→0.07% with PO and0.03% after local-search fine-tuning; CVRP100 improves1.76%→1.37%→1.19%. TSP references include Concorde, while CVRP gaps use strong heuristic references rather than certified optima. PO improves many tested backbones but AM20 worsens on both tasks. Table2 evaluates1,000 FFSP instances, with makespan and gaps against the listed best reference: MatNet-FFSP100 improves91.5→91.1 without augmentation, and FFSP50 improves51.5→51.3. AM20 is an exception to uniform superiority.

Training curves often reach RF performance in40%-60% as many epochs, with larger step-count gains in the additional Poppy/COMPASS experiments. These are threshold/epoch comparisons, not uniform wall-clock speedups. The long POMO protocols train2,000 TSP or4,000 CVRP epochs, then100/200 fine-tuning epochs. A normal TSP epoch takes about9minutes versus12 with search; CVRP takes8 versus20. CPU search remains real computation (Figures2/4/5; AppendixE/F).

**Generalization.** ELG trained with PO improves the reported TSPLIB mean gap3.08%→3.00% and CVRPLIB-X6.03%→5.94%. Table3 times are mean per-instance times, unlike Table1's totals. It does not beat every different architecture: BQ-NCO/LEHD have lower total TSP gaps in this comparison. Five shifted distributions, each with10,000 cases, show POMO-PO improvements over its RF counterpart (Table11). These tests do not establish cross-native-task transfer.

**Additional architectures and mechanism probes.** DIMES experiments cover500/1,000/10,000-node TSP with greedy, sampling, active-search and MCTS/2-opt decoding. Most results improve, but MCTS-TSP1000 worsens5.10%→5.23%, contrary to the blanket all-decoding claim. Retaining those decoders means the hybrid experiment is not free of inference search. Poppy/COMPASS use separate100k-step runs on an80GB A800. Measured reward/probability ordering consistency rises but remains below100%; early action-entropy sums are empirical observations, not proof of exact entropy regularization (AppendixF).

## Limitations

Reward-derived labels require the grounding objective; the method is not reward-free or based on unknown human utility. Deterministic rankings discard reward gaps. Alpha, architecture, pair coverage and choice of comparison function affect learning; the paper tunes alpha per problem/model. Positive affine invariance concerns the labels, not general reward shaping or equality of finite-temperature Gibbs distributions. Pair comparisons cost quadratically in the number of sampled solutions, though practical tensors are finite. Network capacity and training do not guarantee global feasibility beyond the task masks, global optimality or complete preference ordering.

### Curator Analysis

**Ranks versus finite-temperature calibration.** At alpha=1, rewards(1,0) and(10,0) give the same hard winner/loser label but different Gibbs winner probabilities, approximately0.731059 and0.999955. Their fixed-pair PO comparison losses cannot distinguish these reward gaps. For a fixed conditional winning pair, increasing its probability0.731059→0.99 improves the Bradley-Terry log-likelihood. This example limits a claim of recovering the original reward's finite-temperature distribution; it is **not** a characterization of the optimum of Equation7 with its complete theta-dependent pair-sampling weights, ties or self-pairs.

Equation7 writes sampling from the current policy, while Equation8/current code differentiate the comparison loss holding sampled trajectories fixed. A full derivative through the sampling distribution has additional score-function terms. The implemented step is therefore best described as the detached-sample comparison surrogate, not an established unbiased full gradient of Equation7. AppendixF.4 itself discusses extreme hard preferences and an unbounded exponential alternative; that exponential score is not a normalized probability. None of these distinctions refutes the empirical usefulness of the training method or the valid additive-shift proposition.

## Reproducibility

- All25 pages of the [formal ICML2025 article](https://raw.githubusercontent.com/mlresearch/v267/main/assets/pan25e/pan25e.pdf) were read, including every reference and scientific AppendicesA-F. Twelve method, proof and experimental pages were visually inspected. Publisher metadata verifies seven authors, the six listed institutions, PMLR267:47672-47696 and October6,2025 publication date, separately from the July conference.
- Manual publisher links give Paper/OpenReview/Software and no separate scientific supplement. Both notes APIs for `Jwe5FJ8QGx` returned403. The official60-file tree has no PDF/ZIP scientific attachment and contains four PT/PTH files: two model checkpoints and two validation datasets. No explicitly missing science document was found.
- The [official implementation](https://github.com/MingjunPan/PO4COPs) was inspected at `c300a7103e3a507088c04c49446a04bae07dcc79`. The full README/requirements,270-line TSP trainer and144-line TSP configuration were read, plus CVRP trainer lines121-233. The release is a POMO implementation; other-backbone code is described as future release. Its CVRP loss uses Bradley-Terry although the printed table specifies exponential. The TSP entry sets `pf_ls_loss` when local search is enabled, while the trainer dispatch accepts `po_ls_loss`, requiring configuration reconciliation. Current TSP configuration has2,010 epochs rather than the table's2,000. No external code was changed.
- The small curator arithmetic script `research/full-text-review/preference-optimization-co/recompute_ordinal_scope.py` was executed for the Gibbs/conditional-pair numbers; this is not a neural training or benchmark rerun. Twenty-four exact existing-paper references are recorded. The body labels a d'O Costa citation NeuRewriter, but its full reference is the separate2020 learning2-opt paper, so an unsupported NeuRewriter relation is not inferred.
