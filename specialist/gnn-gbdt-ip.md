---
id: gnn-gbdt-ip
short_title: GNN-GBDT IP
title: GNN&GBDT-Guided Fast Optimizing Framework for Large-scale Integer Programming
authors:
- Huigen Ye
- Hua Xu
- Hongyan Wang
- Chengming Wang
- Yu Jiang
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/ye23e.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/ye23e.html
institutions:
- Tsinghua University
- Beijing National Research Center for Information Science and Technology
- Meituan
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
problems:
- Integer Programming
summary: Task-specific GNN and boosted-tree guidance supports limited-free-variable IP search and crossover, with
  heuristic repair and no original optimality guarantee.
code_url: https://github.com/thuiar/GNN-GBDT-Guided-Fast-Optimizing-Framework
---

# GNN&GBDT-Guided Fast Optimizing Framework for Large-scale Integer Programming

> **TL;DR:** Learn variable embeddings with solution-value and graph-partition objectives, then use boosted trees to guide initial fixing, neighborhood partitions and crossover. Conventional solver calls optimize restricted subproblems; a bound on the fraction of free variables does not imply global optimality or a proportional bound on total computational cost.

## Motivation

Prediction-guided large-neighborhood search can still ask a solver to handle a large unrestricted region. This work seeks useful variable partitions and predictions so that repeated restricted solver calls improve a large IP while limiting how many variables are free in each call (Sections 1–3).

## Contributions

- A random-feature bipartite GNN learns a representation using graph-partition and solution-value metric-learning objectives.
- GBDT regression predicts variable values and supplies tree-leaf partitions plus a heuristic prediction-loss score.
- Initial search, restricted neighborhood optimization and crossover use SCIP/Gurobi on free-variable subsets of roughly 20/30/50% of the original variables.

“Multi-task” here means two embedding-learning objectives, not one unchanged model demonstrated across multiple native combinatorial problems.

## Methodology

**Representation and labels.** Variable nodes carry objective coefficient, bounds and a random Uniform(0,1) feature; constraint nodes carry RHS, sense and another random feature; coefficient values are edge features. A FENNEL streaming partition labels the bipartite graph. Half-convolution message passing produces variable embeddings. Two ProxyAnchor losses encourage proximity for variables with a common graph-partition label or solution value; β balances those losses. Although the main text calls these labels optimal, Appendix D says Gurobi runs eight hours to obtain approximate optima, so they are not uniformly certified optimal labels (Sections 2.2–3.1; Appendices B/D).

**Boosted-tree guidance.** GBDT regresses variable values from embeddings. A regression tree, sampled according to its weight, partitions embeddings for neighborhood construction. Accumulated leaf quantities derived from the second-order Taylor objective rank variables during initialization; neighborhood search also uses disagreement with the current solution. These quantities are training-derived heuristics, not calibrated confidence intervals or known test-time squared errors. The displayed minimized Taylor objective is negative up to a discarded constant; it should not automatically be interpreted as a nonnegative Euclidean distance or an optimization guarantee (Sections 2.4, 3.2; Appendix A).

**Restricted optimization.** Initialization rounds predictions, fixes a selected fraction and releases variables through REPAIR as needed. For subsequent neighborhoods, all variables outside the selected free set are fixed to the current solution and the original linear objective/constraints remain. “Fixed radius” means a limited free-variable subset, not a demonstrated metric-ball approximation theorem. Neighborhood crossover combines assignments from two neighborhoods and repairs/releases inconsistent fixings before another solver call (Section 3.3; Algorithms 1–3).

**Repair and exactness boundary.** REPAIR scans each inequality, computes a lower bound on its LHS using unfixed-variable bounds and cancels fixings when that bound already exceeds the RHS. This detects some individually impossible rows; passing such checks does not prove simultaneous integer feasibility of the entire restricted model. No theorem establishes termination of the initialization/release loop, original global optimality, or a convergence rate. Solver optimality, if obtained, concerns the selected restricted subproblem. Limiting free variables to αn still leaves constraint representation, graph embedding, repair, parallel neighborhoods and offline training costs (Appendix C; Algorithms 1/5).

## Experiments

**Scale and setup.** Four synthetic families are combinatorial auction, maximum independent set, minimum vertex cover and set cover, plus an industrial internet-domain IP. Large instances reach one million CA variables/constraints, one million MIS/MVC variables with three million constraints, two million SC variables/constraints, and 1.92 million industrial variables with 100,003 constraints. Experiments use two Xeon Platinum 8375C CPUs and four 32-GB V100 GPUs. The appendix names Gurobi 10.0; it does not fully specify all training sample counts, model hyperparameters, solver-thread settings or total offline cost (Table 3; Appendix D).

**Budgets.** Main task/scale budgets range from 60 seconds for IP1 to 30,000 seconds for CA3. Each restricted search may consume at most 20% of the total budget. CA's 50% setting uses only 30% for initial search because of memory limits. Experiments repeat five times and report averages, without a comprehensive uncertainty analysis. No unchanged cross-native-task transfer protocol is demonstrated; the released test interface defaults to a task-named model checkpoint (Section 4; Appendix D).

**Same-budget objectives.** The 30% configurations improve both solver baselines across the main large-scale Table 1 columns. This does not extend to every fraction: 20%-Gurobi loses on CA2, MIS3 and MVC3; 20%-SCIP loses on SC3. In smaller Table 4, 30%-Gurobi CA1 is 1,274.7 versus standalone Gurobi 1,286.3, so the method is not uniformly better on all small tasks either. Larger free-variable fractions also do not always improve results (Tables 1/4).

**Printed-table inconsistencies.** Table 1 marks 50%-Gurobi CA2 12,466.0 as improved even though Gurobi reaches 12,944.4 for this maximization task; the 50%-SCIP IP2 value equals baseline 901,099.8 despite an improvement arrow. Table 3 labels SC “Maximize,” whereas the result direction/curves and released set-cover generator's covering constraints reflect the usual minimization setting. The numerical objectives and task directions must be inspected instead of copying every arrow or label (Tables 1/3; Figure 6; released `data_generation.py`).

**Time-to-target and the 99% claim.** Table 2's targets are the respective 30% framework's Table 1 objectives, not known optima or an independent common-quality standard. Many baseline times are right-censored at 20,000/60,000 seconds. Very large reductions occur for selected cases, such as 50%-SCIP MVC2 reaching its target in 33.3 seconds while baseline exceeds 20,000; these support a selected time-to-target claim, not a universal 99% runtime reduction. Counterexamples include IP1 20%-SCIP 131.4 versus baseline 65.0 seconds and SC3 20%-SCIP 25,010.2 versus 7,332.0. Small CA1 30%-Gurobi takes 59.24 versus Gurobi 45.0 seconds for its target (Tables 2/5).

**Comparison scope.** The principal baselines are standalone SCIP/Gurobi and their use as restricted optimizers. The authors exclude the referenced neural-LNS system because the released code was incomplete; consequently these experiments do not establish superiority to all learned LNS methods. Time-objective curves illustrate progress, not a mathematical convergence proof or final optimality certificate (Section 4.3; Appendix D.2).

## Limitations

### Discussed in the Paper

Small neighborhoods can become trapped in local optima, motivating crossover. Increasing the free-variable fraction can worsen efficiency or exceed memory. Extending to mixed-integer, multiobjective and still larger settings remains future work (Sections 3.3, 4.1, 5; Appendix D).

### Curator Notes

This is specialist learned guidance for an IP heuristic; two training objectives and a generic IP representation are not evidence of cross-task shared-weight solving. Neither local interval repair nor exact restricted solves certify the original optimum. Approximate eight-hour labels, incomplete training details, task-dependent budgets and author-selected targets limit broader speed/quality claims. A “small optimizer” still processes the relevant original constraints and can require substantial memory and repeated work.

## Reproducibility

- **Publication:** [ICML 2023/PMLR 202](https://proceedings.mlr.press/v202/ye23e.html), pp. 39864–39878. Five authors/affiliations match the publisher PDF. Official PMLR source front matter explicitly records issued date `2023-07-03`, distinct from the July 23–29 conference dates.
- **Reading:** all fifteen publisher-PDF pages, including complete Appendices A–E, all derivations/algorithms and small/large result tables. Publisher Related Material lists the main PDF and OpenReview; normal OpenReview API access requires browser verification. Manual author-repository inventory finds only README plus `Paper/paper.pdf`, whose SHA-256 exactly matches the already read publisher PDF; no additional scientific supplement was identified.
- **Code:** [official release](https://github.com/thuiar/GNN-GBDT-Guided-Fast-Optimizing-Framework) explicitly says users must implement interfaces. The current GBDT class methods and important test/solver/initialization/crossover interfaces raise `NotImplementedError`. It supplies key components and result files, rather than a complete runnable end-to-end replication. This limitation is stated by the repository itself.
- **Citation graph:** four exact catalogue predecessors are matched to explicit citations: GCNN branching, general LNS, GNN-MILP expressivity and the 2020 workshop precursor of CombOptNet. The latter alias is independently confirmed by the first author's publication page, which identifies the ICML work as also presented orally at that workshop; the reviewed citation's earlier title/version is retained.
