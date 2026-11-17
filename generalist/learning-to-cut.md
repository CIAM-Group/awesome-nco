---
id: learning-to-cut
short_title: Learning to Cut
title: 'Reinforcement Learning for Integer Programming: Learning to Cut'
authors:
- Yunhao Tang
- Shipra Agrawal
- Yuri Faenza
year: 2020
date: '2020-11-21'
publication:
  date: '2020-11-21'
  source_url: https://proceedings.mlr.press/v119/tang20a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v119/tang20a.html
institutions:
- Columbia University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
- Graph Optimization
- Packing
- Production Planning
- Knapsack
problems:
- Integer Programming
- Packing
- Binary Packing
- Production Planning
- Maximum Cut
- Binary Knapsack
summary: A shared Gomory-cut policy transfers from packing to Max-Cut; attention-based cut selection improves selected
  IP relaxation benchmarks.
---

# Reinforcement Learning for Integer Programming: Learning to Cut

> **TL;DR:** An evolution-strategy-trained policy chooses Gomory cuts inside an IP relaxation procedure. One small-packing-trained policy transfers to larger Max-Cut instances, supporting limited generalist scope; main task comparisons otherwise train separate policies.

## Motivation

Valid cuts tighten a linear relaxation, but their sequence can strongly affect progress and numerical behavior. The paper studies learned selection among tableau-generated Gomory candidates, with a controlled cutting-plane environment that exposes the contribution of cut quality (Sections1–3).

## Contributions

- A variable-action MDP chooses one Gomory cut per iteration and rewards increases in the minimization LP lower bound, without optimal-solution labels during training.
- Attention over current inequalities and candidate cuts handles changing constraint sets; an LSTM variant also accepts different variable counts.
- A shared small-packing policy is directly evaluated on larger Max-Cut instances (Figure4), distinct from the separately trained per-task main comparisons. This demonstrated cross-native-task reuse through a common IP cut-selection interface supports generalist classification here; it is not a universal optimizer checkpoint or a full commercial solver.

## Methodology

**Environment and reward.** The state includes existing inequalities, objective coefficients, the LP optimum and candidate Gomory cuts. Choose a candidate, add it, solve the new LP with Gurobi, then regenerate candidates from its simplex tableau. Slack-variable substitution projects cuts back into the original variable space. Reward is the LP objective increase, with discounting favoring earlier progress. These are dual-bound improvements, not necessarily better feasible incumbents (paperpp.3–4; supplementA.1).

**Networks.** A two-layer64-unit Tanh network embeds every existing constraint and candidate cut. Each candidate's score is the mean inner product with current constraint embeddings; softmax produces its selection probability. This is agnostic to inequality order. The fixed-size main IGC policies use attention alone; size/cross-class generalization uses an LSTM with10-dimensional hidden state before attention. The LSTM is not inherently invariant to permuting variable coordinates (p.4; supplementA.4).

**Training and test behavior.** Evolution strategies estimate a parameter-search direction using Gaussian perturbations and trajectory returns, averaged across training instances. Chainer/Adam uses rate0.01, typically10perturbations with sigma0.2; planning uses sigma0.02 and five trajectories per instance/iteration. Reported training typically converges within500updates on a distributed CPU server (60/64virtualCPU descriptions differ between appendix sections). Training samples cut actions, while tests generally use greedy argmax (pp.5–6; supplementA.4,F–G).

**Numerical limitations.** Appropriate classical Gomory selection has a finite-termination result in exact arithmetic; that is not proved for arbitrary learned selections or this floating-point implementation. Without countermeasures, the policy cuts off integer optima in up to20% of some tested cases. Test-time stopping averages recent improvement fractions overH5cuts and stops beloweta0.001. The paper reports eliminating observed invalid-cut errors on its tasks, which is an empirical safeguard rather than a formal certificate (p.5; supplementC).

## Experiments

**Tasks and scale.** Main studies cover packing, binary packing, production planning and maximum cut. Small/medium datasets use30train/20test instances; larger studies double these counts. “Size” is encoded variables times constraints, with several tabulated dimensions differing substantially from the rough1000/5000labels. Small Max-Cut, for example, is only10IPvariables/22constraints. A separate10-item binary-knapsack experiment analyzes cut shapes (pp.5–8; supplementA.2,D).

**Quality metric.** Integrality Gap Closure is(initial LP gap−current LP gap)/initial LP gap, using a separately computed integer optimum only for evaluation. It is not a primal solution error, and IGC1alone does not supply a decoded feasible witness. Fixed-budget experiments add50or250cuts. Medium task IGCs for RL are0.55/0.88/0.95/0.86; large task IGCs0.11/0.68/0.61/0.57, the last only slightly above MNV0.56. Small cases require mean14/10/22/13cuts versus random48/44/81/69, respectively (Tables1–3).

**Shared-policy evidence.** Experiment3 trains on smaller instances and evaluates size transfer. Its separate cross-class test reuses a small-packing-trained LSTM+attention policy on10Xlarger Max-Cut formulations without retraining; Figure4 compares its percentile IGC curve with Max-Cut-trained policy and classical rules. This supports demonstrated packing-to-Max-Cut cut selection. It does not mean the per-family results in Tables1–4 or the separately trained knapsack analysis use the same weights (pp.7–8).

**Branch-and-cut.** The downstream implementation uses most-fractional branching, FIFO/breadth-first node selection and10cuts per node. Gurobi supplies LP solves; this is not a comparison against its full commercial branch-and-cut pipeline. Plots count nodes to95%IGC, with25%for the difficult large-packing case and node caps of200/1000depending on task/study. Separately, the implementation's termination statistic is a normalized current primal–dual residual with threshold0.0001. These stopping quantities should not be conflated (paperpp.7–8; supplementB,E).

**Time and adverse cases.** At a fixed50cuts, RL can be slower: planning0.14s versus random0.09s, packing0.10s versus0.06s; binary0.07s versus0.088s is favorable. Large B&C timing is normalized to RL100% and includes only cases reaching the target within the node cap. On Max-Cut MNV95% is faster than RL100%; some planning baselines areN/Abecause they fail the threshold, rather than have infinite observed runtime (supplementTables6–7).

**Interpretation.** The knapsack study counts three increasingly loose coefficient-pattern criteria resembling lifted cover inequalities. Resemblance is neither a proof of equivalence to a lifted cover cut nor discovery of a new valid family. MainFigure6 says80training instances, while supplementD says100; the exact artifact needs to resolve that discrepancy (p.8; supplementD).

## Limitations

### Discussed in the Paper

Floating-point cut validity needs care, training can be costly, and the method's aim is cut selection quality rather than the fastest full B&C implementation. Most medium/large cutting-plane-only instances do not reach optimality, motivating bound-progress metrics and downstream branching (Sections3.4–4).

### Curator Notes

Generalist scope rests on one explicit shared packing-to-Max-Cut transfer, with the same cut interface; other task-specific policies remain separate. Classical Gomory convergence and integer-validity theory do not certify learned floating-point selection with early stopping. Runtime comparisons and IGC curves are conditional on budgets, task encodings, reference optima and selected successful cases.

SupplementA.2 says packing uses the canonical minimization form with allA,b,c nonnegative. As printed, that makes zero a feasible optimum, inconsistent with the nontrivial packing experiments. The intended objective sign must be resolved against the actual generator before reproduction; the note does not silently treat that specification as an exact benchmark definition. Published80/100knapsack training counts,121/122planning variable counts and60/64CPU descriptions are additional small provenance discrepancies.

## Reproducibility

- Formal publication: [ICML2020, PMLR119:9367–9376](https://proceedings.mlr.press/v119/tang20a.html). The official [PMLR source metadata](https://raw.githubusercontent.com/mlresearch/v119/gh-pages/_posts/2020-11-21-tang20a.md) records issued date2020-11-21, distinct from the July13–18conference period used in its BibTeX.
- Fully read all10pages of the [publisher paper](https://proceedings.mlr.press/v119/tang20a/tang20a.pdf) and8pages of the [official supplementary PDF](https://proceedings.mlr.press/v119/tang20a/tang20a-supp.pdf), including all formulations, hyperparameters, numerical safeguards, cut criteria and timing tables. The publisher page explicitly links the supplement.
- No author-confirmed implementation link was established from the paper, supplement or publisher record during this audit; third-party similarly named repositories are not presented as official code. No LP/cut validity, training or B&C experiment was rerun.
