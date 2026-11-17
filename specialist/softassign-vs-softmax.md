---
id: softassign-vs-softmax
short_title: Softassign vs Softmax
title: 'Softassign versus Softmax: Benchmarks in Combinatorial Optimization'
authors:
- Steven Gold
- Anand Rangarajan
year: 1995
date: '1995'
publication:
  date: '1995'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/b1563a78ec59337587f6ab6397699afc-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/b1563a78ec59337587f6ab6397699afc-Abstract.html
institutions:
- Yale University
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Graph Partitioning
summary: Two-way matrix normalization replaces assignment penalties in annealed TSP and balanced graph partitioning;
  random benchmarks improve on tested Potts updates, without a discrete global-optimality guarantee.
---

# Softassign versus Softmax: Benchmarks in Combinatorial Optimization

> **TL;DR:** Alternating two-way normalization replaces assignment-constraint penalties in annealed neural TSP and balanced graph partitioning. Benchmarks favor it over the tested Potts/softmax dynamics; matrix-scaling convergence is not a proof of discrete global optimization.

## Motivation

Softmax directly enforces one set of assignment constraints but needs a penalty for the other set. Penalty tuning can introduce poor local minima. Softassign instead applies iterative normalization to both dimensions. The paper explicitly limits its comparison to these neural/statistical-physics formulations and acknowledges that conventional solvers or elastic-net methods can be better in some respects (PDF pp. 1-2).

## Contributions

- Applies softassign to city/visit-position TSP assignments.
- Extends normalization to equal-sized multiple-membership constraints for graph partitioning.
- Compares softassign with synchronous and serial Potts/softmax updates on random benchmarks.

## Methodology

For TSP, a binary permutation matrix assigns cities to tour positions. Relax it with entropy and Lagrange terms, retain a gamma stability term, linearize the non-entropic energy using the previous match matrix, then apply exponentiation and iterative row/column scaling while inverse temperature increases. Assignment-constraint penalties disappear; the stability term and annealing/termination choices remain (PDF pp. 2-4).

The cited matrix-scaling result maps a strictly positive matrix to a doubly stochastic matrix. Such a matrix can be fractional. It does not alone prove that the surrounding nonlinear annealing dynamics returns a permutation, a feasible decoded tour or a global TSP optimum (PDF pp. 3-4; curator qualification).

Graph partitioning minimizes cut size subject to each node belonging to one bin and each bin containing exactly `I/A` nodes, assumed integer. Normalization targets are modified accordingly; the objective and its derivatives differ from TSP. Reusing a hand-designed normalization algorithm across these formulations is not evidence for one trained generalist model (PDF pp. 4-5).

## Experiments

The TSP benchmark uses 500 independently generated 100-city unit-square instances. The text says 95% of softassign tour lengths lie between 8 and 11. Its discussion of expected asymptotic optimum length is not a certified per-instance reference, so these lengths must not be converted into exact optimality gaps. Serial Potts is reported about five times slower and synchronous Potts about twice as slow (PDF pp. 5-6).

Graph partitioning uses 2,000 random unweighted 100-node graphs with 10% connectivity, split into four equal bins. The cut-size distributions favor softassign, with a smaller quality separation than for TSP; the same approximate timing ratios are reported. The serial update lacks the parallelism of the compared synchronous schemes. The suggestion that more bins would widen the advantage is an extrapolation, not a reported scaling experiment (PDF pp. 5-6).

No hardware, absolute elapsed-time table, full annealing settings, per-instance certified solutions or external classical-solver evaluation is supplied. The reported ratios therefore describe this implementation comparison rather than general speedups over optimization algorithms (PDF pp. 5-7).

## Limitations

The study does not establish global convergence of the quadratic optimization or universal superiority outside the tested sizes/distributions. Positive finite-temperature assignments and equal-sum constraints must be distinguished from discrete feasibility. Penalty-free assignment enforcement still needs stability, schedule and stopping choices. This entry remains a specialist neurodynamic method with task-specific energies, rather than a learned cross-task solver.

## Reproducibility

- **Read source:** all seven official scanned pages, printed pages 626-632, including all thirteen references. The normalization diagram, objectives, update equations, histograms and legends were visually inspected.
- **Publication:** official NIPS 1995 volume 8 record; Steven Gold and Anand Rangarajan, Yale University.
- **Supplements:** the official record links bibliography, metadata and the article. No appendix or separate scientific attachment is identified. Cited earlier theory/matching papers are not claimed as read scientific supplements.
- **Implementation:** no public source, benchmark instances or complete configuration is linked; results were not rerun.
- **Relations:** none of the references identify another frozen collection entry; no internal citation edge is added.
