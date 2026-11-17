---
id: symilo
short_title: SymILO
title: 'SymILO: A Symmetry-Aware Learning Framework for Integer Linear Optimization'
authors:
- Qian Chen
- Tianjian Zhang
- Linxin Yang
- Qingyu Han
- Akang Wang
- Ruoyu Sun
- Xiaodong Luo
- Tsung-Hui Chang
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/2b94c01ad2b79432f9499501f8754aee-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/2b94c01ad2b79432f9499501f8754aee-Abstract-Conference.html
institutions:
- The Chinese University of Hong Kong, Shenzhen
- Shenzhen Research Institute of Big Data
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Integer Linear Programming
- Item Placement
- Steel Mill Slab Design
- Periodic Event Scheduling
- Dihedral Periodic Event Scheduling
summary: Supervised GNN prediction alternates model updates with symmetry-equivalent label alignment, then guides
  classical partial fixing, local branching or node selection; known symmetry groups, incumbent labels and host
  solver budgets bound the demonstrated scope.
code_url: https://github.com/NetSysOpt/SymILO
figure:
  path: paper-assets/symilo/framework.png
  alt: SymILO trains a bipartite GNN with alternating solution-permutation and parameter updates, then supplies
    predictions to classical fixing, node-selection or local-branching pipelines.
  caption: 'Figure 2: symmetry-aware training and the three downstream solver pipelines.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=5
---
# SymILO: A Symmetry-Aware Learning Framework for Integer Linear Optimization

> **TL;DR:** Align supervised labels over **valid problem symmetries** while training a GNN predictor. At test time, its probabilities guide existing solver pipelines. The new contribution is symmetry-aware supervision, rather than a neural local-search policy or an automatic symmetry detector. The paper reports reduced800-second primal gaps, while several theoretical statements and public-code details need qualifications.

## Motivation

A symmetric integer program can have multiple objective-equivalent solutions. Arbitrarily selecting one label for each instance can give an otherwise equivalent prediction a large supervised error. SymILO permits the label to move within its known symmetry orbit so training can align it with the current prediction. An allowed permutation must preserve feasibility and objective value; arbitrary variable shuffling is not a valid symmetry. [Sections1/3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=3)

## Contributions

- Jointly optimize network weights and one label permutation per training instance.
- Alternate discrete label alignment and gradient-based model training.
- Instantiate alignment for full symmetric, cyclic and dihedral groups.
- Test the trained predictor with three host pipelines: **Neural Diving-style fix-and-optimize, predict-and-search local branching, and MIP-GNN node selection/warm-starting**. These are distinct experiments, not a single mandatory sequence of three solver stages. [Sections4-5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=6)

## Methodology

### Symmetry-aware learning

Training data comprise an optimization instance, a collected solution label and its symmetry group. The objective replaces loss(prediction,label) with **loss(prediction,permuted label)**. Full symmetric groups allow q! column permutations, cyclic groups q rotations, and dihedral groups2q rotations/reflections. Symmetry information is supplied by the formulation; no general-purpose group-discovery algorithm is demonstrated.

At each outer iteration, find the best label permutation for the current model, then make a finite number of gradient updates. The procedure is not exact global minimization of the neural objective and has no demonstrated global convergence certificate. Permutation variables are used **only during training**, not optimized at test time. [Equations4-9/Algorithm1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=5)

Cyclic/dihedral alignment enumerates their relatively small groups. For a full symmetric group acting on columns, alignment is an assignment problem. For squared loss and an integral permutation, the label norm is constant, giving a **linear assignment objective**; BCE is also linear in the permuted binary label. An integral optimal assignment can then be selected efficiently rather than enumerating q! possibilities.

The correct relaxation interpretation matters. The norm identity in AppendixA.2 holds for permutation matrices, not arbitrary doubly stochastic matrices. A literal continuous relaxation of the original squared loss can have a fractional optimum: with label[1,0] and prediction[.5,.5], the all-.5 matrix gives zero loss, while either permutation gives.5. Thus the squared objective should be **linearized on permutations before relaxation**. Total unimodularity supplies an integral optimal vertex for that linear assignment problem; it does not mean every degenerate LP optimum must be integral. [Proposition4.2/AppendixA.2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=13)

### What the theoretical comparison establishes

The globally minimized symmetry-aware training risk cannot exceed the ordinary risk because the identity permutation is allowed. This weak inequality is straightforward; it does not guarantee better test quality after finite training. The strict-improvement statement for duplicate instances with different labels is supported by an explicitly **“Non-rigorous Proof”**. It assumes the two labels can be aligned within the same orbit and the prediction can fit the aligned target. Different optimal solutions need not lie in the same symmetry orbit, and arbitrary model classes need not fit that target. The strict claim is therefore not treated here as an unconditional guarantee. [Proposition4.1/AppendixA.1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=13)

### Predictor and downstream solving

The bipartite graph has variable and constraint nodes and nonzero-coefficient edges. Alternating half-convolutions aggregate variable-to-constraint and constraint-to-variable messages; MLPs with ReLU and a sigmoid output predict the discrete variables. The host methods then use these predictions:

- **Fix-and-optimize:** fix selected variables, then let the classical solver optimize the remainder.
- **Local branching:** build a prediction-centered neighborhood constraint for classical search.
- **Node selection:** guide branch-and-bound exploration and warm-starting using predicted values.

The neural method does not repeatedly choose edits to an incumbent feasible solution. Classification is corrected to **specialist / constructive**: a static learned prediction assists classical solution identification. Classical CPLEX search does not by itself create a substantive learned improvement stage. Different tasks are trained separately; one shared checkpoint across all benchmarks is not demonstrated. [Section4.3/5.1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=6)

## Experiments

### Benchmarks, labels and budgets

The four datasets are **item placement (IP)**, **steel-mill slab design (SMSP)**, **periodic event scheduling (PESP)** and a modified dihedral variant **PESPD**. IP has208-1,050 binary variables and S4-S10 bin symmetry; SMSP has22K-24K binary variables and S111 slab symmetry; the scheduling cases have5K-15K integer variables and C5-C15/D5-D15 symmetries. The IP formulation also contains continuous auxiliary variables, so the practical workflow is not restricted to pure-integer coefficients/variables throughout.

IP and each scheduling dataset contain500 instances, split400/100 for training/test; SMSP uses304/76 of380. The main text holds out30% of training instances for validation. PESP data are obtained by perturbing weights of a limited set of PESPlib instances, rather than independent railway-network topologies. The precise modification that creates PESPD is not separately detailed in the published AppendixG, which ends with PESP. SMSP constraint counts also conflict: the main text says nearly10K while Table5 gives20K-22K. [Sections5.2/AppendicesF-G.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=17)

Labels are **best incumbents from single-thread CPLEX with3,600-second limits**, not guaranteed optimal solutions despite the idealized task description. The network is trained with Adam1e-3, batch16 and50 epochs, selecting the best validation loss. Downstream solving uses **one thread and800 seconds per test instance**. Fixing/neighborhood fractions are tuned separately over.1-.9 for ordinary and symmetry-aware predictors; the comparison includes those distinct hyperparameters. The reported machine has an AMD EPYC7H12,256GB RAM and RTX3080. [Sections5.3-5.4/AppendixE.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=16)

### Prediction and training cost

For the reported Top50% error, IP decreases **17.0 to5.1**, SMSP19.5 to.6, PESP52.7 to.3 and PESPD422 to223. These are counts against the nearest symmetry-equivalent label, not percentages of instances solved optimally. The printed subset formula chooses the largest rounding distance, whereas the released accuracy code chooses the most confident variables by largest distance from.5. This paper/code ordering discrepancy limits a literal reconstruction of the reported metric.

The reported mini-batch time rises from **5.54 to6.01 seconds for IP**,69.43 to71.50 for SMSP,14.97 to15.14 for PESP and16.17 to16.46 for PESPD. Per-instance permutation costs are .029/.129/.011/.018 seconds. These support modest overhead in the tested groups, not negligible cost for arbitrary large symmetry structures. [Tables1-2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=8)

### Downstream primal gaps

The metric is absolute objective difference relative to the **best-known reference**, divided by its magnitude plus epsilon. A zero displayed gap means matching that reference, not a proof of optimality. The headline50.3%/66.5%/45.4% figures are **averages of per-dataset relative primal-gap reductions** against the respective ND/PS/MIP-GNN baseline after800 seconds; they are not runtime speedups or absolute objective improvements.

| Dataset | Fix-and-optimize baseline -> SymILO | Local-branching baseline -> SymILO | Node-selection baseline -> SymILO |
| --- | --- | --- | --- |
| IP | .201 -> .124 | .168 -> .102 | .312 -> .190 |
| SMSP | .300 -> .180 | .230 -> .160 |1.180 -> .740 |
| PESP | .084 -> .050 | .306 -> displayed .000 |1.899 -> .280 |
| PESPD |2.389 -> .404 |3.442 -> .127 |3.755 ->3.006 |

These are raw relative-gap fractions, not already percentage-scaled entries. The symmetry-aware models improve their matching hosts in all displayed means, but **tuned plain CPLEX still beats the symmetry-aware node-selection variant on IP, SMSP and PESP**. Callback overhead is acknowledged as a possible contributor. Of the12 paired t-tests, **two PESP tests have p=.0589491 and.0585871**, exceeding .05; statistical significance at that threshold is not12/12. [Table3/AppendixF.2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=9)

### Public implementation differences

The current release contains IP/SMSP workflows. Its `labelOpt` maximizes the probability inner product with SciPy assignment, which matches squared-distance alignment, while `train.py` optimizes **BCE**. Exact BCE assignment instead uses logit-weighted costs. A two-variable example makes the difference concrete: label matrix I and prediction[[.99,.6],[.6,.2]] cause probability assignment to choose the swap (score1.20 versus1.19), yet BCE favors identity (**3.452 versus5.850**). This establishes a possible alignment-objective mismatch, not a measured change in the paper's benchmark results.

The released script also uses **batch1 and an80/20 train/validation split**, compared with batch16 and70/30 described in the paper. Its data instructions collect labels with **Gurobi**, while the paper specifies CPLEX, and the README examples use1,000-second evaluations. Consequently, current repository commands are not an exact reproduction manifest for all published settings.

## Limitations

### Discussed in the Paper

- Permutation optimization must be designed for the particular symmetry group; only three group families are instantiated.
- Large/complex groups can substantially increase training cost.
- Node-selection callback interaction can slow down the host solver. [Sections6-7.](https://proceedings.neurips.cc/paper_files/paper/2024/file/2b94c01ad2b79432f9499501f8754aee-Paper-Conference.pdf#page=9)

### Curator Notes

- Labels and best-known references are time-limited solver outputs; optimality is not universally certified.
- Symmetry-orbit alignment, a lower idealized training risk and improved downstream search are separate claims.
- The strict-risk proof, literal squared-loss relaxation, confidence ordering and BCE implementation require the qualifications above.
- Different host hyperparameters, only four structured symmetry benchmarks, two nonsignificant PESP comparisons, missing PESPD construction detail and partial code coverage limit generalization/reproduction claims.

## Reproducibility

- **Full reading:** all **24 formal pages**, including AppendicesA-G, examples/formulations, all tables/figures and the six-page checklist, were freshly read. Group diagrams, the framework, proofs, result curves/tables and formulations were visually inspected.
- **Publication:** formal NeurIPS2024 title/eight authors match. CUHK-Shenzhen and SRIBD affiliations are retained. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2024/hash/2b94c01ad2b79432f9499501f8754aee-Abstract-Conference.html) explicitly records `citation_publication_date` as **2024-12-16**, independently of any paper-specific acceptance date.
- **Scientific supplements:** the manually inspected publisher page links the combined paper without a separate supplement. Its complete scientific appendix was read; no explicit unavailable scientific attachment is assumed. The official repository tree contains1,414 entries, is not truncated and has no extra PDF/ZIP/TeX science file.
- **Code:** [NetSysOpt/SymILO](https://github.com/NetSysOpt/SymILO). Both README files, full training/alignment/accuracy scripts and current data instructions were inspected. The public setup lists Python3.9.19, CPLEX22.1.1, Gurobi11.0.3, PyG2.5.3 and PyTorch2.4.0, differing from the paper's listed environment. IP/SMSP data/workflows are supplied; a complete PESP/PESPD reproduction is not established. Only small algebraic counterexamples were checked; no benchmark training or solving was rerun.
- **Figure:** complete original Figure2 on page5, directly cropped with its data, training, prediction and downstream branches.
