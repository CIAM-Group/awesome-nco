---
id: gnn-milp-expressivity
short_title: GNN-MILP Theory
title: On Representing Mixed-Integer Linear Programs by Graph Neural Networks
authors:
- Ziang Chen
- Jialin Liu
- Xinshang Wang
- Wotao Yin
year: 2023
date: '2022-10-19'
publication:
  date: '2023'
  source_url: https://iclr.cc/virtual/2023/poster/10797
venue: ICLR
paper_url: https://openreview.net/forum?id=4gc3MGZra1d
institutions:
- Duke University
- Alibaba Group
scope: study
paper_type: theory
arxiv_url: https://arxiv.org/abs/2210.10759
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: A specified message-passing GNN class cannot distinguish certain feasible/infeasible MILPs; conditional capacity results for unfoldable inputs and random features require careful treatment of solution selection.
code_url: https://github.com/liujl11git/GNN-MILP
---

# On Representing Mixed-Integer Linear Programs by Graph Neural Networks

> **TL;DR:** Some MILPs with different feasibility have indistinguishable message-passing representations. The paper gives conditional approximation results when color refinement separates vertices, and studies random features as symmetry breaking. These are representation results, not polynomial-time MILP solving. The reviewed v2's stronger claim about predicting one fixed optimal solution with random features has a symmetry/target-definition gap, explained below as curator analysis.

## Motivation

GNNs are natural models for MILP because reordering constraints should not change feasibility or objective value, and reordering variables should reorder a predicted solution consistently. But respecting permutations alone does not establish enough expressive power to distinguish MILPs with different answers. The paper studies feasibility, finite optimal objective values and selected optimal solutions before drawing conclusions about practical branching or primal heuristics.

## Contributions

- Gives an explicit feasible/infeasible MILP pair that a specified weighted message-passing GNN family cannot distinguish, related to a color-refinement test.
- Defines foldability and proves capacity results on unfoldable instances, distinguishing finite-dataset fitting from approximation outside a small exceptional-measure set.
- Studies independent continuous vertex features to break representational symmetries, with separate probabilistic claims for feasibility, objective values and solutions.
- Presents small synthetic fitting and generalization experiments. The solution-selection caveat below concerns a particular printed v2 statement and proof, not all these results.

## Methodology

The formulation is `min c^T x` subject to linear constraints, lower/upper bounds and selected integer variables. A weighted bipartite graph has one vertex per constraint and variable, constraint features `(right-hand side, relation)`, variable features `(cost, lower bound, upper bound, integrality)` and edge weights from the constraint matrix. The studied class uses continuous learned maps, weighted neighbor-sum messages, and invariant graph or equivariant variable readouts. Its limitation is not a theorem about every possible GNN, higher-order architecture, preprocessing feature set or search-augmented solver.

The counterexample has six binary variables. One instance imposes `x_i+x_(i+1)=1` around an even six-cycle and is feasible; the other imposes the same relations on two disjoint triangles and is infeasible. Initial features and weighted neighborhood summaries agree at every refinement step, so the defined GNN class gives identical graph outputs. The distinction is mathematical feasibility, not a training failure demonstrated for one network.

An instance is unfoldable when the paper's color refinement eventually distinguishes every constraint vertex and every variable vertex within its respective side. On a finite dataset of such instances, suitable networks exist to classify feasibility and approximate finite objective values to any prescribed accuracy. For solutions, the deterministic construction additionally restricts to feasible instances with finite variable bounds and selects a canonical optimum using a refinement-defined variable order. These restrictions ensure an optimum exists and its selector is well defined. A finite infimum by itself need not be attained for the paper's real-coefficient MILP domain.

Appendix A extends the capacity statements to measurable finite-measure input sets: the error may exceed the prescribed tolerance on an exceptional set of arbitrarily small measure. This is not uniform accuracy on every arbitrary MILP. The proof uses measurability, Lusin's theorem and invariant/equivariant approximation on compact sets. It gives existence, with no practical bound on network size, training sample complexity or optimization time. Unfoldability is a sufficient condition; a foldable instance is not automatically one on which every target prediction fails.

Independent uniform vertex features almost surely give distinct initial colors. The paper derives probabilistic finite-dataset capacity claims from this symmetry breaking. Its permutation statements act jointly on the graph, original features and appended random features; a fresh random draw need not give the same individual prediction. The experiments use **one fixed random feature vector for all training and test instances of the same size**, and the authors explicitly note that this setup does not directly support different-size inputs. The stronger fixed-optimal-solution claim needs the separate qualification below.

## Experiments

The main study uses two 1,000-instance datasets, each with six constraints and 20 variables. `D1` is randomly generated and unfoldable, with 460 feasible instances; `D2` constructs balanced feasible/infeasible pairs using even-cycle versus triangle constraints, with additional continuous variables. SCIP supplies labels. Networks have two message-passing layers and ReLU MLP components, and model sizes are varied. Feasibility, objective-value and solution predictors are separately trained.

Figures 3–4 report **training-set** fitting, as the text explicitly states. Plain GNNs remain unable to distinguish the constructed foldable feasibility pairs, whereas unfoldable or random-feature variants fit substantially better as capacity grows. Fitting an entire solution vector requires much larger networks than fitting objective values. These curves do not establish a practical replacement for a MILP solver or out-of-distribution accuracy.

Appendix D adds held-out tests for a random-feature network of embedding size 8, with 10, 100 or 1,000 training instances and 1,000 same-generator test instances. The feasibility error falls from 0.289 to 0.104 to 0.022. At 1,000 training instances, objective-value test MSE is `1.1e-6`, while solution-vector test MSE remains about `7.3e-2`; the latter is not an exact-feasibility or exact-optimal-solution success rate. No substantial MIPLIB solving-time evaluation is reported.

For these extra tests, the authors replace zero objective coefficients by uniform `0.01` coefficients, explaining that this is intended to remove solver-dependent labels. **Curator qualification:** it does not remove every optimum tie. The binary six-cycle still has two alternating feasible assignments with three ones each, both contributing objective `0.03`; the other continuous variables can be held identical at their minimizing values. Uniform positive costs therefore do not by themselves guarantee a unique intrinsic solution target.

## Limitations

### Curator Notes

Existence of an approximating network does not imply efficient learning, cross-size generalization, an exact feasible prediction or polynomial-time MILP optimization. The results depend on the specified feature/message class, target domain and approximation criterion. Small vector MSE must not be reported as a certified feasible/optimal assignment without an additional check or repair procedure.

**Independent curator analysis of the v2 fixed-target random-solution claim:** Theorem 5.3 on PDF p.11 includes foldable inputs and asks for high-probability approximation of `Phi_solu(G,H)`. Appendix B p.22 explicitly makes this target independent of random features, p.23 asserts its equivariance, and p.25 treats that property as automatic. However, the canonical selector in Appendix C pp.26–28 was defined only on bounded, feasible **unfoldable** inputs. The displayed theorem's finite-objective domain is also broader than that domain and need not even ensure attainment.

A bounded two-variable example isolates the symmetry problem without any attainment issue:

```text
minimize 0
subject to x1+x2=1,  x1,x2 in {0,1}.
```

The MILP graph is unchanged by swapping its two variables. Under independent identically distributed random vertex features and a jointly permutation-equivariant GNN, the output distribution is exchangeable. Any fixed optimal target is either `(1,0)` or `(0,1)`. Their Euclidean radius-`1/4` neighborhoods are disjoint and have equal output probability, so the probability of approximating either fixed target is at most `1/2`. Thus the printed arbitrary-confidence fixed-target claim cannot hold on this instance with error probability below `1/2`.

Allowing the selected optimum to depend on random identifiers, or measuring distance to the **set** of optima, would be different statements. These are possible additional target conventions, not corrections stated or proved here by the authors. This curator observation is limited to the v2 fixed-target solution statement/proof; it does not refute the feasibility/objective random-feature claims or the appropriately restricted unfoldable results.

## Reproducibility

- Publication record: [official ICLR 2023 listing](https://iclr.cc/virtual/2023/poster/10797), linked to [OpenReview](https://openreview.net/forum?id=4gc3MGZra1d).
- Scientific reading source: [complete 31-page arXiv v2, May 25, 2023](https://arxiv.org/pdf/2210.10759v2), including all 46 references and Appendices A-D. The PDF also prints an internal May 29 date. Its header and primary arXiv history identify the version; v1 was submitted October 19, 2022.
- The official conference listing names Ziang Chen, Jialin Liu, Xinshang Wang and Wotao Yin. The reviewed v2 and current author repository additionally name Jianfeng Lu. Frontmatter retains the formal listing's author list; this version difference is documented rather than silently conflated.
- Implementation linked by the authors: [code](https://github.com/liujl11git/GNN-MILP).
- The public repository supplies data generation, separate feasibility/objective/solution training and testing scripts, and reproduction commands. It lists TensorFlow 2.4.1, PySCIPOpt 4.2.0, CUDA 10.1 and a Tesla V100 environment. Numerical experiments were not rerun in this review.
- OpenReview's forum and both notes/attachment APIs returned verification challenges/403. Every scientific appendix explicitly referenced by the article is integrated in the completely read v2; no identified separate scientific attachment remains unread. The counterexample graphs, theorem domains, random-feature proof statements and numerical tables were visually checked.
- Exact enumeration verifies the two-variable feasible set and the six-cycle's tied `0.01` objectives. The fixed-target probability bound is the independent symmetry argument above, not an empirical rerun or an author conclusion.
