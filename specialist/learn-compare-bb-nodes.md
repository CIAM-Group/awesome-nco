---
id: learn-compare-bb-nodes
short_title: Learn to Compare Nodes
title: Learning to Compare Nodes in Branch and Bound with Graph Neural Networks
authors:
- Abdel Ghani Labassi
- Didier Chételat
- Andrea Lodi
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/cf5bb18807a3e9cfaaa51e667e18f807-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/cf5bb18807a3e9cfaaa51e667e18f807-Abstract-Conference.html
institutions:
- Johns Hopkins University
- Polytechnique Montreal
- Cornell University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
- Graph Optimization
- Satisfiability
- Network Optimization
problems:
- Mixed-Integer Linear Programming
- Fixed-Charge Multicommodity Network Flow
- MAXSAT
- Generalized Independent Set
summary: Task-specific siamese graph scoring ranks B&B nodes until two feasible solutions, then falls back to a
  classical comparator.
code_url: https://github.com/ds4dm/learn2comparenodes
---

# Learning to Compare Nodes in Branch and Bound with Graph Neural Networks

> **TL;DR:** A task-trained siamese GNN ranks open B&B nodes by imitating a diving oracle. It guides only the first phase until two feasible solutions, then hands comparison back to a classical rule; improvements vary by benchmark.

## Motivation

Node comparison determines the priority of open B&B subproblems and is distinct from branching-variable selection. Fixed-dimensional handcrafted node summaries may discard useful MILP structure. This paper tests a graph representation for comparing subproblems while retaining the solver's valid bounding, branching and pruning (Sections1–3).

## Contributions

- A variable–constraint bipartite representation describes each sub-MILP, with global objective/bound estimates.
- A shared graph scoring network produces a pairwise sigmoid preference, imitating an oracle that knows an optimal training solution.
- Deliberately taking the opposite of recorded oracle decisions broadens the training-state distribution without repeated DAGGER rounds. Three separately trained primal-difficult task families test same-size and larger-instance behavior (Sections4–5).

## Methodology

**Comparator and state.** SCIP's NODECOMP orders two open nodes; NODESELECT decides which node to expand. Each subproblem graph has variable objective/bounds/type, constraint RHS/type and coefficient edges. Two unconnected global attributes supply SCIP's estimated best feasible objective and lower bound. This captures a useful sub-MILP description, not the entire evolving solver state (pp.3–4).

A siamese network computes f(a,b)=sigmoid(g(a)−g(b)). It always chooses one node, using a0.5 threshold and no equality action. The shared scalar scoring is symmetric under pair reversal except for forced discrete tie handling. Features are embedded to32dimensions, then processed by three ReLU graph convolutions of8/4/4dimensions. Variable and constraint embeddings are separately mean-pooled, concatenated with global values, and the resulting vector'sL2norm is the score (pp.4–5).

**Oracle and imitation.** Training first solves instances to obtain optimal solutions. The oracle prioritizes the subtree containing that solution, otherwise falling back to best-estimate comparison. During a second solve, the sampler records oracle preferences but deliberately executes their opposite, exposing off-oracle states. Weighted binary cross-entropy trains the comparator; depth-based weights emphasize early costly mistakes. This requires offline optimal solutions and is not solution-free learning (p.5).

**Runtime policy.** The learned comparison is paired with plain highest-priority node selection only until two feasible solutions have been found, after which it falls back to ESTIMATE. This handoff is essential to the reported performance and distinguishes the method from learned comparison at every node until termination. Exactness comes from the unchanged solver's valid search, not an oracle imitation theorem (pp.5–6).

## Experiments

**Tasks.** Fixed-charge multicommodity network flow trains/tests on15-node graphs and transfers to20; MAXSAT uses60–70graph nodes and transfers to80–100; generalized independent set uses60–70 and transfers to70–80. Underlying graphs are Erdos–Renyi with probabilities0.3for flow and0.6for the other tasks. Policies are trained for each family, supporting specialist scope despite the shared MILP interface (p.6).

**Data and comparisons.** The paper reports1000training and100test instances for sampling, then50test and50transfer instances for solve evaluation. FCMCNF yields16285training/3019test comparisons. MAXSAT and GISP are both printed as41299/4868comparisons, a repeated count that should be checked against released artifacts. Adam batch16 trains PyTorch MLP/GNN models on TeslaV100, with XeonGold6126 for SCIP. Competitor SVM/MLP models share this paper's oracle/data collection; they are adaptations of prior methods, not reproductions of each original pruning/DAGGER/search configuration (pp.2,6).

Table2 reports1-shifted geometric mean solve times and node counts, with geometric standard deviations across instances. These dispersion factors are not seed-based confidence intervals. ORACLE accesses an optimal solution and is a diagnostic comparison, not a deployable baseline. ESTIMATE uses the default comparator with plain highest-priority selection, while default SCIP also retains its usual diving NODESELECT; this separates comparator from selection-rule effects (pp.6–7).

**Results and counterexamples.** GNN improves MAXSAT time to6.66s versus SCIP9.26s and transferMAXSAT to9.1s versus12.9s. FCMCNFtest GNN4.14s is slower than ESTIMATE4.09s and SVM4.10s; transferFCMCNF GNN24.5s is slower than ESTIMATE23.8s and MLP24.1s. GISPtraining-size time4.64s is slower than SCIP4.38s, and transferGISP22.8s is slower than SCIP19.1s despite fewer nodes1203versus1533. The oracle itself takes22.6s on transferGISP, also worse than SCIP. Thus smaller trees and strong imitation do not ensure faster solve times (Table2).

Imitation accuracies likewise do not uniformly favor GNN: FCMCNF95.7% versus MLP97.8%, MAXSAT97.7% versus97.9%, and GISP97.0% versus95.6%. Its benefit is assessed through completed search behavior, not a blanket claim of highest classification accuracy (Table1).

## Limitations

### Discussed in the Paper

Imitation can inherit the oracle's weaknesses, especially on transferGISP. The benchmarks were selected to be primal-difficult; extending to other difficulties and combining node/variable strategies are future work (Section5.5–6).

### Curator Notes

A variable-size architecture demonstrates within-family size transfer, not one shared model across flow, SAT and independent-set optimization. The two-feasible-solution fallback is part of the method and must accompany timing claims. Offline optimal labels are expensive, and the paper offers no theoretical performance guarantee. Mean-pooling and engineered global estimates do not justify its introductory “complete information” wording as a description of all solver state. Repeated MAXSAT/GISP sample counts and prototype notebook settings need verification when reproducing a precise run.

## Reproducibility

- Fully read all11pages of the [NeurIPS2022 publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2022/file/cf5bb18807a3e9cfaaa51e667e18f807-Paper-Conference.pdf), including references and checklist. The [formal proceedings record](https://proceedings.neurips.cc/paper_files/paper/2022/hash/cf5bb18807a3e9cfaaa51e667e18f807-Abstract-Conference.html) identifies volume35 and links the paper and supplement.
- The [official supplemental ZIP](https://proceedings.neurips.cc/paper_files/paper/2022/file/cf5bb18807a3e9cfaaa51e667e18f807-Supplemental-Conference.zip) was manually inventoried:775members, noPDFs or separate scientific appendix. It contains source/data/checkpoints, vendor PySCIPOpt documentation, a brief README and two project notebooks. Both notebooks' source/setup and stored result types were inspected: training has preliminary interrupted-run metrics; generation has progress logs, with no embedded scientific figures. They are reproduction artifacts, not additional reported benchmark pages.
- Author-linked [ds4dm/learn2comparenodes](https://github.com/ds4dm/learn2comparenodes) supplies model, node-selector and generator code. The publisher archive captures an earlier artifact tree, so current repository contents are not assumed byte-identical. No SCIP solves, training or oracle-label generation were rerun in this audit.
