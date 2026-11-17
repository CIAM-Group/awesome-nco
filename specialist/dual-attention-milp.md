---
id: dual-attention-milp
short_title: Dual-Attention MILP
title: A General Neural Backbone for Mixed-Integer Linear Optimization via Dual Attention
authors:
- Peixin Huang
- Yaoxin Wu
- Yining Ma
- Cathy Wu
- Wei Zhang
- Wen Song
year: 2026
date: '2026-01-08'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/huang26bl.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/huang26bl.html
institutions:
- Shandong University
- Eindhoven University of Technology
- Massachusetts Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Kernel self-attention and sparse coefficient-aware cross-attention support separately trained MILP prediction/branching
  models, with BGNN-relative gains and explicit solver, metric and transfer exceptions.
code_url: https://github.com/hpx2024/Dual-Attention
arxiv_url: https://arxiv.org/abs/2601.04509
---

# A General Neural Backbone for Mixed-Integer Linear Optimization via Dual Attention

> **TL;DR:** Parallel kernel self-attention and sparse coefficient-aware cross-attention provide a MILP backbone for separately trained property, variable and branching predictors. Integrating its binary predictions into PaS/Apollo generally improves their BGNN versions, with explicit solver, metric and out-of-distribution exceptions.

## Motivation

Local variable-constraint message passing can lose long-range signals or become difficult to deepen. This work treats variables and constraints as two element types, combining global within-type interaction with sparse cross-type interaction rather than relying entirely on sequential variable-to-constraint-to-variable propagation (Sections1-2).

## Contributions

- A parallel dual-attention layer combines within-variable/within-constraint context and coefficient-aware variable-constraint dependencies.
- Positive-kernel self-attention and sparse cross-attention avoid materializing quadratic dense attention matrices.
- Three task-specific heads support instance feasibility/objective prediction, binary-variable prediction and imitation of strong branching.
- Synthetic property tests, four native MILP families, size transfer, advanced-backbone comparisons and MIPLIB prediction tests characterize empirical benefits and limitations.

## Methodology

**Backbone.** Variables, constraints and nonzero coefficients receive feature embeddings. Within each node type, sigmoid-transformed queries/keys define normalized positive-kernel attention; computing the key-value product first gives global interaction without exact dense softmax. Inter-type attention acts only on nonzero coefficients, with a learned shared coefficient projection modulating query/key interactions. Variable-to-constraint and constraint-to-variable streams use previous-layer embeddings in parallel. Residual/layer-normalized self/cross outputs are concatenated through an MLP and feed-forward block. The reported per-layer time is O((m+n+e)d^2) and memory O((m+n+e)d), for e nonzeros. This is neither an exact-softmax implementation nor a proved approximation-error guarantee (Sections3.1-3.2/Figure1).

**Heads and learning.** Mean-pooled variable/constraint embeddings feed feasibility classification or objective regression; a variable MLP gives binary logits; candidate-variable softmax imitates strong-branching decisions. The principal model uses four64-dimensional dual layers and two heads, versus a two-layer64-dimensional BGNN. Binary training uses the best50 feasible solutions collected within3600seconds and objective-weighted cross-entropy. These time-limited solutions need not be certified optimal. Models and heads are trained separately for datasets/tasks; a common architecture does not imply jointly shared neural weights (Sections3-4/AppendicesB-E).

**Solving and scope.** Binary probabilities guide PaS or Apollo trust-region subproblems solved by Gurobi. The branching head changes variable selection in a classical B&B framework. Predictions are solver components, not independent feasibility/optimality certificates. This remains specialist constructive: no neural editing policy operates on complete primal incumbents, and the main native-task solvers use separate models. AppendixA.3 genuinely transfers each pretrained MIS/auction/WA checkpoint unchanged to MIPLIB for variable classification, but reports no corresponding cross-native-task optimization performance. That positive prediction transfer is retained without upgrading it to a shared generalist solver.

## Experiments

**Synthetic instance prediction.** Each of the unfoldable/foldable datasets has2000 tiny instances, split1000/1000, with20variables and6constraints; random features are supplied to both models. On foldable cases, feasibility error improves6% to0%; both obtain0% on unfoldable cases. Objective MSE decreases from3.975e-9 to3.889e-14 on the first dataset and1.178e-11 to2.312e-13 on the second. AppendixC.1 sets all objective coefficients to zero on the foldable dataset, so extremely small objective MSE there is not evidence of arbitrary-objective optimal solving (Table1/AppendixC.1).

**Variable prediction and bounded search.** Balanced item placement(IP), workload appointment(WA), MIS and combinatorial auction(CA) each use400 training/100 test instances. Gurobi has1000seconds per downstream solve; quality uses best-known values from all methods and a3600-second reference run, not proven optima. Table2 error rates decrease20.88 to17.72%,6.83 to5.32%,17.72 to15.29% and23.10 to21.86%. The prose's15.1/22.2/13.7/5.4% figures are relative reductions in prediction error, not percentage-point gains in correctly predicted variables. IP MSE is tied at.0900; improved discrimination does not imply every metric strictly improves.

In Table3, PaS-BGNN to PaS-Ours primal gaps are7.435 to5.556%,.021 to.016%,0 to0%, and.246 to.232%; mean relative gap/integral improvements are14.462/22.065%. Apollo's corresponding means improve36.143/9.802%. Standalone Gurobi still has the better CA gap.222%, versus PaS-Ours.232% and Apollo-Ours.249%; its CA primal integral4.34 also beats Apollo-Ours4.53. BKV agreement is not an optimality certificate. Search parameters are tuned per model/dataset; Table19 permits different numbers of selected variables, so final solving results include tuning effects (Table3/Figure2/AppendicesD,E.2).

**Advanced backbones.** OPTFM, Polynormer, MAGCN, GCON and GNN-SSM are adapted and depth-tuned, with WA used for depth selection. Tables7-8 report separate baseline values from Table3 and average9.047% gap/20.568% integral improvement over their BGNN row; the two experimental blocks must not be silently merged. Exceptions remain: OPTFM's IP gap9.380% is below ours9.409%, and its WA integral40.32 is below ours41.12. For IP prediction, GNN-SSM's MCC.0186 exceeds ours.0178, while some low error rates reflect class imbalance. The model is strongest overall across WA/MIS/CA rather than universally best in every reported cell (Tables6-8/AppendixE.4).

**Branching.** Set cover, auction, capacitated facility location and MIS use10000 training instances and40 test/40 larger transfer instances, each tested under five seeds. Top-one imitation accuracy rises70.35 to71.51%,70.07 to70.20%,53.50 to57.20% and81.00 to82.70%. Larger-instance tree sizes decrease160.9 to152.3,836.5 to811.7,545.7 to512.5 and10280.5 to8938.5. These node-count results do not establish a wall-time speedup: the reported table does not time the complete learned branching solver (Tables4-5/AppendixC.3).

**Out-of-distribution prediction.** AppendixA.3 evaluates215 of240 MIPLIB instances, excluding12 without binary variables after preprocessing,10 without a reference feasible solution after3600seconds, and3 out of memory. MIS-, CA- and WA-trained models are evaluated separately without retraining; IP is excluded because its positional encoding is not generally applicable. MCC improves.0846 to.1490,.0001 to.1508 and.0099 to.1053, but CA error worsens8.03 to10.29% and WA MSE worsens.2412 to.5174. The approximately42:1 label imbalance and modest absolute MCC/F1 limit broad robustness claims. This is variable prediction on selected instances, not a MIPLIB solver-runtime or certified-quality benchmark (Tables11-12).

**Mechanisms and cost.** Depth/embedding/gradient plots and five-run macro-F1 curves support an empirical resistance to representation collapse. Gradient attribution on one selected WA instance finds41.32% variable and32.84% constraint influence beyond3hops, versus BGNN.12/0%; it is not a general expressivity theorem. Removing either attention stream hurts WA MCC. Inference is slower than BGNN: IP.007 versus.003s, WA.020 versus.009, MIS.010 versus.004, CA.017 versus.005. The reported polynomial scaling does not remove this latency or all offline labeling/training cost (Figures3-5/Tables9-10,13,17-18).

## Limitations

### Discussed in the Paper

The work presents representative downstream heads and empirical architectural evidence rather than a complete universal MILP optimizer. The appendices quantify extra inference latency, restrict MIPLIB evaluation after reference/feature/memory exclusions, and exclude the IP positional encoding from general transfer. Full/higher-dimensional attention layers can trade accuracy against resources; gains with additional width/depth are not monotone in every cell.

### Curator Notes

No theorem establishes universal MILP distinguishability, optimal decisions, convergence of learned branching or global solution quality. The kernel attention is a different normalized attention rule, and histogram separation is not a formal probability-calibration test. Sparse coefficient-aware interaction remains tied to the MILP matrix even though same-type communication is global.

Tiny property-prediction datasets, time-limited supervised solutions, best-known-value evaluation and tuned restricted searches require the separate interpretations above. No robust all-task solver dominance follows from lower BGNN-relative average gaps, smaller trees or an unchanged checkpoint's MIPLIB classification. In particular, some classical/advanced baselines and individual OOD metrics are better.

The current element-training release sets learning rate1e-4, batch size1 and eight-step gradient accumulation, whereas Table17 specifies8e-4 and batch64. These are identifiable current-release/configuration differences, not proof that the published historical runs used the code defaults. Its prediction-and-search evaluation loads precomputed probability files before calling Gurobi with a1000-second solver limit, so that limit is not complete neural-plus-solver wall time.

## Reproducibility

- **Publication:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/huang26bl.html), pages47939-47959; official HTML publication date September29,2026. Six authors and Shandong/Eindhoven/MIT affiliations checked against PDF page1.
- **Coverage:** all21 proceedings pages, references and AppendicesA-E read; key equations, prediction/solve tables, depth/attribution figures and hyperparameters rendered and inspected. PMLR links only PDF/OpenReview; ordinary OpenReview fBAMvSNH8N API returned403. Official ICML event62600's scientific poster PNG was downloaded, fully read and inspected. Author5774753-byte ZIP inventory has no additional PDF/TeX/notebook scientific supplement.
- **Implementation:** [hpx2024/Dual-Attention](https://github.com/hpx2024/Dual-Attention). Three task READMEs/environments, positive-kernel/sparse attention, task-specific training, objective-weighted binary loss and PaS solver entry inspected. Separate data generation/training/evaluation pipelines and external classical-solver dependencies are required. No training/solver experiment was rerun.
- **Relations:** fifteen actual in-text/bibliography matches to current catalogue entries. Wang et al.(2024) onp1 refers to the ten-author TPAMI article *Learning to Cut via Hierarchical Sequence/Set Model for Efficient Mixed-Integer Programming* ([DOI10.1109/TPAMI.2024.3432716](https://doi.org/10.1109/TPAMI.2024.3432716)), listed onp12. Its HEM++ additions make it a distinct journal extension. The full bibliography pp10–12 does not independently cite the eight-author ICLR2023 HEM paper represented by this catalogue's stable ID, so no edge to that ID is retained. Publication lineage alone is insufficient evidence of an actual citation; no new paper is added.
