---
id: rome-milp
short_title: RoME
title: 'RoME: Domain-Robust Mixture-of-Experts for MILP Solution Prediction across Domains'
authors:
- Tianle Pu
- Zijie Geng
- Haoyang Liu
- Shixuan Liu
- Jie Wang
- Li Zeng
- Chao Chen
- Changjun Fan
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/3071ed272658c4418309962ba7b94ec8-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/3071ed272658c4418309962ba7b94ec8-Abstract-Conference.html
institutions:
- National University of Defense Technology
- University of Science and Technology of China
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: One dense-MoE solution predictor transfers across native MILP domains with classical restricted search;
  average gains have explicit instance, ablation, reference and current-code-version limits.
code_url: https://github.com/happypu326/RoME
---

# RoME: Domain-Robust Mixture-of-Experts for MILP Solution Prediction across Domains

> **TL;DR:** One shared graph/MoE binary-solution predictor trained on independent set, item placement and set cover transfers to auction, workload appointment and selected MIPLIB instances. Classical restricted search turns predictions into solutions; substantial average gains coexist with instance losses, tuned search parameters and a current codebase explicitly targeting a different journal extension.

## Motivation

Per-domain MILP predictors can overfit local structures and require fresh labels for each application. RoME studies whether diverse training domains, adaptive expert mixtures and robust reweighting can improve one shared prediction component across native problems and unseen domains (Sections1-3).

## Contributions

- A shared bipartite GNN and soft mixture of experts produce instance-conditioned variable representations.
- A second soft gate combines multiple output heads into binary marginal predictions.
- Expert-diversity and perturbed-task-embedding consistency regularize within-domain learning; group-DRO reweights training domains.
- One model trained on three native families is evaluated on five families, larger instances and selected real-world MILPs.

## Methodology

**Prediction and search.** Six variable features, four constraint features and one coefficient feature feed a two-layer bipartite GNN, with two half-convolutions per layer. Objective-weighted binary cross-entropy fits marginals from up to50 good feasible solutions collected by a3600-second classical run. The output is a factorized approximation, not a jointly feasible solution distribution. Predict-and-Search then restricts a Gurobi/SCIP subproblem near high-confidence predicted assignments. The classical solver finds complete solutions; a trust region can exclude a globally optimal solution, so exactness of the underlying solver is not a certificate for the unrestricted MILP (Sections3.1/A).

**Conference architecture.** Mean variable pooling yields a task embedding. A softmax gate weights three expert MLPs; their representations are blended for each variable. A separately parameterized gate weights three scalar-logit heads before sigmoid. This formal version uses dense soft mixtures, not the later top-k shared/dedicated architecture. A cosine-similarity regularizer encourages diverse expert outputs; normalized Gaussian perturbation htilde=h+r*delta/||delta|| and representation consistency encourage local gate stability. Group-DRO alternates neural updates with exponential reweighting of high-loss training domains. These are training objectives, not a proved arbitrary-domain robustness or optimization-quality bound (Sections3.2-3.4/Table4).

**Shared-component scope.** The same neural model trains on240 instances each from independent set(IS), balanced item placement(IP) and set cover(SC). Its unchanged weights predict on these and zero-shot auction(CA), workload appointment(WA) and selected MIPLIB instances. This supports generalist constructive classification on actual shared native-task experiments, rather than generic MILP syntax. Search parameters(k0,k1,Delta) remain manually tuned per family/model/solver; shared prediction weights do not make the whole pipeline parameter-free or an end-to-end universal decoder (Section4.1/Table1/A.3).

## Experiments

**Protocol and reference.** Main text gives720 shared-model training instances and240 validation instances, split equally across the three training families; baselines train separately by family. Tests have100instances/family and1000-second primal-focused solver budgets. Gurobi3600-second single-thread best solutions supply synthetic BKS values, which are approximations to optima except where independently solved. Main metrics are objective and absolute reference difference, with IS time to the reported common optimum. Hardware is RTX3090 and24-core EPYC7402; formal implementation lists Gurobi11.0.3/SCIP8.1.0, learning rate.0005 and128-dimensional embeddings (Sections4/A-B).

**Five-family results.** All four methods reach IS685, with RoME+Gurobi2.08s versus vanilla57.35, PS14.67 and ConPS20.13. IP/SC/WA/CA absolute gaps decrease.27/.57/.42/215.44 for vanilla Gurobi to.06/.05/.06/35.09. The reported reductions77.8/91.2/85.7/83.7% concern absolute gaps, not raw objective percentage or universal solve-time speedups. The abstract's67.7% headline lacks a fully specified common aggregation across the heterogeneous IS-time and other gap metrics; the table's individual values are the reviewable evidence. SCIP gains are smaller on some tasks: IP gap5.39 to4.92, CA1100.47 to1084.55, while IS time254.63 to13.55 improves strongly (Tables1,9).

**Individual and MIPLIB exceptions.** Pairwise RoME versus Gurobi wins are65/100 CA and91/100 SC, leaving35/9 losses; mean loss magnitudes114.93/.10 remain nonzero. Its global best-method win counts55/100 CA and85/100 SC are different statistics. On selected MIPLIB tests, all-instance dominance is false: dws008-01 has RoME37415.68 versus Gurobi37412.60; bab2 has?357542.78 versus ConPS?357544.31; bab6 has?284224.56 versus Gurobi?284248.23; bg512142 has190018 versus184202.75. Several instances tie. These explicit counterexamples qualify the main text/poster's consistently-best claims (Tables8,10-11).

The MIPLIB setup uses an IIS-style small split plus15 selected harder/similar instances, not the entire benchmark. Baselines receive IIS training data, while RoME remains synthetic-only; remaining instances are zero-shot for all methods. Main plots use1000seconds, whereas Table7 explicitly reports3600seconds. Table8 references website BKS rather than the main synthetic3600-second reference definition. The selected-average IIS gap10.8 versus Gurobi15 does not erase the per-instance losses or establish universal MIPLIB generalization (Section4.3/AppendicesC.3,D.1).

**Size transfer and ablations.** Larger SC6000constraints/10000variables gives RoME102.03 versus Gurobi102.29; larger CA reaches the selected BKS115787.97 versus114960.25. Ablations show important tradeoffs: DRO-only SC reaches124.64 versus full124.69; single-head IP11.18 beats full11.22. Variable-embedding perturbation gives IP11.16 versus11.22, while feature perturbation has WA703.10 versus703.11. Radius.15 improves SC gap.02 versus default.10's.05 but worsens CA150.05 versus35.09. Thus every component does not improve every task/cell (Tables12-16).

**Interpretability and costs.** Expert activation maps and t-SNE show observed task clustering and specialization. They are descriptive visualizations, not causal evidence that arbitrary structural similarity is learned. The formal dense-softmax equations and binary activation plot are different representations; the threshold/selection convention should not be inferred from current top-k code. Labels require long solver runs and the dense cross-domain model has acknowledged memory/training overhead. No matched total labeling+training+deployment cost reduction is established (Figure6/AppendixE).

## Limitations

### Discussed in the Paper

Cross-domain learning requires diverse labeled data and relatively high compute. GPU memory limits dataset size. More efficient sparse experts, expressive encoders and stronger uncertainty-aware optimization are future work in the formal conference version. Robustness is currently encouraged through domain reweighting and task-embedding perturbations.

### Curator Notes

No theorem guarantees domain-general optimal prediction, feasible independent marginals or globally optimal restricted search. Group-DRO optimizes worst-case mixtures of observed training-domain losses; normalized random perturbations do not automatically give worst-case guarantees over every unseen MILP. Minimizing average cosine similarity is a diversity heuristic, not strict mutual-orthogonality enforcement. NP-hard problem reductions motivate shared structure but do not themselves prove shared-checkpoint transfer; the actual experiments provide that evidence.

Reproduction has source inconsistencies. Main validation counts are80per family, but AppendixA.3 says300total instances split80/20, implying60validation. AppendixC.3 calls the IIS test scpk4 while Figures4/Table8 use scpl4; Table6 lists both. Main MIPLIB wording describes different subset averages from Table7's selected groups. Some gap cells do not match printed objectives: Table7 ConPS210.60?BKS196=14.60 rather than14.20; Table13 single-head WA703.14?703.05=.09 rather than1.09; Table14 feature-perturbed IP11.23?11.16=.07 rather than.01. Notes retain objectives and identify these discrepancies instead of silently changing historical tables.

The present official repository explicitly says it implements an extended journal version, with top-k/shared+dedicated experts, different perturbation description and expanded training/test applications. Those additional results are not part of the reviewed formal conference paper and are not imported into its scientific scope. A conference-named IS_IP_SC checkpoint is present, but that filename alone does not prove compatibility with current architecture. Exact historical source/configuration remains a reproduction boundary, even though current code and artifacts are public.

## Reproducibility

- **Publication:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/3071ed272658c4418309962ba7b94ec8-Abstract-Conference.html), official HTML publication date April23,2026, distinct from venue year2025. Eight authors and NUDT/USTC affiliations checked against page1.
- **Coverage:** all29 formal pages, full bibliography/checklist and AppendicesA-E, every result/ablation/feature table read; key formulas/results rendered. Publisher actions list only Paper/Bibtex. Full3,871,363-byte author ZIP contains no extra PDF/TeX/notebook scientific document. Official NeurIPS event115327 scientific poster PNG1,484,522bytes was downloaded/read/inspected. The event links OpenReview wRQmQ6UXYF whereas the author README links VmK7gYaKXl; ordinary VmK7gYaKXl API returned403, and the proceedings PDF remains the identified reading source.
- **Code:** [happypu326/RoME](https://github.com/happypu326/RoME). README/version declaration, full archive inventory, current top-k/shared-expert/perturbation architecture, group-DRO, test/checkpoint path and classical-solver interfaces inspected. Current README environment(Gurobi9.5.2/SCIP8.0.1) differs from formalA.3. No journal-extension result is labeled a conference result, and no training/solver benchmark was rerun.
- **Relations:** seventeen explicit body/bibliography matches, including PS/ConPaS, neural solver control/LNS, MVMoE/MTPOMO/GOAL and UniCO. Topic similarity does not generate additional edges.
