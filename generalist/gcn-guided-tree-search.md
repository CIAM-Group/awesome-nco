---
id: gcn-guided-tree-search
short_title: GCN Tree Search
title: Combinatorial Optimization with Graph Convolutional Networks and Guided Tree Search
authors:
- Zhuwen Li
- Qifeng Chen
- Vladlen Koltun
year: 2018
date: '2018'
publication:
  date: '2018'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2018/hash/8d3bba7425e7c98c50f52ca1b52d3735-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2018/hash/8d3bba7425e7c98c50f52ca1b52d3735-Abstract.html
institutions:
- Intel Labs
- The Hong Kong University of Science and Technology
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Satisfiability
problems:
- Maximum Independent Set
- Minimum Vertex Cover
- Maximum Clique
- Boolean Satisfiability
summary: One SATLIB-trained MIS GCN guides constructive tree search across explicit problem reductions, with conventional
  reduction and local improvement; performance depends on search budgets.
code_url: https://github.com/isl-org/NPHard
---

# Combinatorial Optimization with Graph Convolutional Networks and Guided Tree Search

> **TL;DR:** A supervised GCN predicts diverse independent-set membership maps. Parallel tree search, graph reductions and local improvement turn them into solutions. One SATLIB-trained MIS model is reused for MIS, vertex cover, clique and satisfiability through explicit reductions; the result is a hybrid heuristic without a general optimality certificate.

## Motivation

One graph can have many incompatible optimal solutions. A single probability map trained against different labels can average these modes into an uninformative prediction. The paper couples a multioutput network with search to explore several alternatives, while retaining conventional reductions and local search that help on hard graph instances.

## Contributions

- A GCN with multiple output maps and a hindsight loss that selects the most accurate map for each training label.
- A randomized queue-based tree search, with a parallel variant, that repeatedly applies the network to residual graphs.
- Reuse of a trained independent-set solver on other tasks through problem reductions, evaluated on synthetic SAT/clique instances and social/citation graphs.

## Methodology

The network has 20 graph-convolutional layers, hidden width 32, all-one initial node features and 32 sigmoid output maps. Supervised labels are independent sets obtained from known satisfying assignments of synthetic SATLIB instances. The hindsight objective gives a training example to its best-matching output map, encouraging different maps to represent different modes rather than averaging their labels.

Each map orders unlabelled vertices. A greedy partial step includes a vertex and excludes its neighbors until a conflict stops the sweep, then removes labelled vertices and processes the residual graph. Search maintains partial solutions in a queue and randomly selects nodes to expand, rather than performing exhaustive branch-and-bound. The parallel algorithm samples one output map per thread. Complete solutions undergo a 2-improvement step that replaces one selected node with two compatible nodes. Pendant, folding, unconfined and twin reductions reduce the graph with reconstruction of removed choices. These conventional components are part of the evaluated solver.

Although the paper says **maximal** independent set and clique, its definitions seek the largest set, so the objectives are maximum cardinality. A minimum vertex cover is the complement of a maximum independent set on the same graph. A maximum clique is an independent set on the complement graph. For SAT, literal occurrences become vertices, clauses become cliques, and contradictory occurrences are connected; an independent set as large as the number of clauses yields a satisfying assignment. Failing to find such a set with this heuristic does not certify UNSAT.

This is generalist reuse **through a common MIS representation and fixed reductions**: Section 5.1 explicitly applies the same SATLIB-trained network to every subsequent problem/dataset. It does not demonstrate a neural policy that directly understands arbitrary task specifications, and the reductions can impose major memory costs. The neural role is constructive search guidance; local improvement is an additional conventional stage.

## Experiments

Training uses 38,000 satisfiable SATLIB formulas, with 1,000 validation and 1,000 test instances. Each formula has roughly 400 clauses and becomes a graph of roughly 1,200 vertices. Adam uses a learning rate of `1e-4`, one graph per minibatch and 200 epochs; reported training takes about 16 hours on an i7-5960X CPU and Titan X GPU. SAT Competition evaluation selects only 20 instances of comparable scale, not the full competition collection.

The main solver uses 16 search threads, with 10-minute limits for SAT datasets and 30-minute limits for large social/citation graphs. The authors give other continuing-search methods 16 times the solver's wall-clock budget to account for parallelism; single-solution baselines follow different stopping rules. These are not identical wall-clock comparisons. SAT tables report median termination seconds, since a found satisfying assignment permits early stopping.

On the SATLIB test set the full solver satisfies all 1,000 formulas, with mean independent-set size 426.90 and median time 11.47 seconds. Z3 also solves all formulas in a reported 0.01 seconds by operating directly on SAT, while ReduMIS reaches the same solved fraction in 47.79 seconds. The analogous selected SAT Competition result is 100% solved in 12.20 seconds; again Z3 is much faster. These results support transfer of the MIS pipeline but not a claim of superiority to dedicated SAT solvers.

On 40 hard BUAA-MC instances, 62.5% of clique optima are found, versus ReduMIS 25%. The model was not retrained on these instances. On the reported social and citation graphs, solution sizes match ReduMIS; this equality does not establish that either is optimal. The largest listed graph, ego-Gplus, has 107,614 vertices and 13,673,453 edges. Maximum-clique evaluation on these large graphs fails because complement graphs are too dense, causing memory/time failures even with a 24-hour horizon.

The SATLIB validation ablation makes conventional components consequential: the full single-thread pipeline solves 98.8%, versus 42.4% without local search and 91.0% without graph reduction. A basic predictor with reductions/local search solves 18.8%, rising to 59.2% with randomized tree search and 98.8% with the full diversity-trained single-thread method. Thus this paper contains evidence for multiple interacting components, not a neural-only result. Output-map benefits plateau near 32; increasing hidden width reduces achieved quality under the search budget because more network work leaves fewer search steps.

## Limitations

### Reported by the Authors

- This is not a universal solver: only problems efficiently mapped to MIS are demonstrated.
- Dense complement graphs prevent large maximum-clique experiments; direct task-specific models are suggested as future work.
- Network cost competes with search breadth under a fixed budget.

### Curator Notes

- Feasibility-preserving construction and reduction rules do not make the incomplete search globally optimal. SAT success is a witness; heuristic failure is not an UNSAT proof.
- Reported large-graph equalities with ReduMIS are empirical solution sizes, with no accompanying optimality proof.
- Parallel threads, median early-termination times, reduction/local-search work and the enlarged baseline limits must accompany runtime comparisons.
- A trained common MIS model supports reduction-based transfer, a narrower claim than direct multitask or language-conditioned generalist optimization.

## Reproducibility

- **Official publication:** [NeurIPS 2018](https://proceedings.neurips.cc/paper_files/paper/2018/hash/8d3bba7425e7c98c50f52ca1b52d3735-Abstract.html); authors and Intel Labs/HKUST affiliations checked on both PDFs.
- **Official code:** [isl-org/NPHard](https://github.com/isl-org/NPHard), the matching Intel implementation. Its default demo excludes graph reduction/local search; the README describes linking a KaMIS-derived shared library to enable them. It does not distribute the training data and is archived.
- **Reviewed sources:** all ten main pages and all four pages of `Neurips319-supp.pdf` inside the official supplementary ZIP. Equations, main tables, diversity curve and parallel-search pseudocode were visually checked.
- **Source map:** main Section 4 defines network/search; Section 5 specifies training and budgets; Supplement A gives reductions, B algorithms, C classical components, D graph statistics and E width controls.
- **Validation scope:** full-text and metadata verification; no training, library compilation or solver runs were performed.
