---
id: mean-field-annealing
short_title: Mean Field Annealing
title: Optimization by Mean Field Annealing
authors:
- Griff Bilbro
- Reinhold Mann
- Thomas K. Miller
- Wesley E. Snyder
- David E. van den Bout
- Mark White
year: 1988
date: '1988'
publication:
  date: '1988'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1988/hash/ec5decca5ed3d6b8079e2e7e7bacc9f2-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1988/hash/ec5decca5ed3d6b8079e2e7e7bacc9f2-Abstract.html
institutions:
- North Carolina State University
- Oak Ridge National Laboratory
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Graph Optimization
problems:
- Graph Bipartitioning
summary: Naive mean-field fixed-point relaxation replaces stochastic spin sampling during cooling; balanced graph-partition
  examples use fewer relaxation iterations, with quality and critical-temperature claims limited to the stated experiments
  and approximations.
figure:
  path: paper-assets/mean-field-annealing/framework.png
  alt: 'Original mean field annealing algorithm: initialize spin averages, relax fixed-point updates at each temperature
    and cool until freezing.'
  caption: 'Figure 1: Mean field annealing with temperature-dependent relaxation.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1988/file/ec5decca5ed3d6b8079e2e7e7bacc9f2-Paper.pdf#page=3
---

# Optimization by Mean Field Annealing

> **TL;DR:** Mean Field Annealing (MFA) cools approximate spin averages instead of equilibrating a stochastic spin chain. Three graph-bipartition examples need fewer relaxation iterations, without establishing a universal wall-clock speedup or global-optimization guarantee.

## Motivation

Stochastic simulated annealing must equilibrate at successive temperatures, which can require many state transitions. The paper replaces individual binary spin sampling with a naive mean-field approximation and tracks its equilibrium as temperature decreases. It separates temperature scheduling from relaxation at each temperature and relates a parallel relaxation limit to Hopfield dynamics (PDF pp. 1-4).

## Contributions

- Derives a mean-field relaxation for a pair-interaction Ising objective with 0/1 spins.
- Shows how fixed-temperature parallel relaxation corresponds to a particular Hopfield-network dynamics.
- Applies the method to balanced graph bipartitioning and studies an approximate critical temperature and relaxation effort near it.
- Compares objective values and relaxation-iteration counts with stochastic annealing on three example graphs.

## Methodology

For a binary-spin Hamiltonian with unary coefficients h and symmetric pair coefficients V, replace other spins by their averages m. The effective field is `Phi_i = h_i + 2*sum_{j!=i} V_ij*m_j`; a mean-field coordinate update is `m_i = 1/(1+exp(Phi_i/T))`. Figure 1 initializes averages near one half with small symmetry-breaking noise, randomly selects coordinates for relaxation until a fixed point is reached, then lowers temperature and repeats until freezing. This is a mean-field approximation, not exact computation of the original joint Boltzmann distribution (PDF pp. 2-3).

The paper also gives a damped parallel field update. Its small-damping limit matches the cited Hopfield equations with the specified unit constants and temperature-dependent sigmoid. Hopfield behavior here is a fixed-temperature relaxation special case; annealing still introduces a temperature schedule (PDF pp. 3-4).

For graph bipartitioning, attractive weighted edges favor putting adjacent vertices together, while an all-pairs repulsive term favors balanced bin sizes. This is a soft balancing formulation, not an exact equality constraint implemented by construction, and not Maximum Cut. Instance weights and the schedule are supplied rather than learned over a dataset (PDF p. 4).

## Experiments

Table 1 uses 100 trials on each of three graphs with node/edge counts 83/115, 100/200 and 100/400. The reported MFA/SSA Hamiltonian ratios are 0.762, 1.078 and 1.030. Their relaxation-iteration ratios are 0.187, 0.063 and 0.019, corresponding to roughly 5-53 times fewer iterations. These are relative results against stochastic annealing under the displayed setup, not gaps to certified optima. In particular, ratios of a Hamiltonian that contains a repulsive offset should not be silently converted into percentages of optimality improvement (PDF pp. 4-5).

The critical-temperature model assumes that, within an idealized cluster, repulsion is negligible, edge attractions can be replaced by an average strength, degree by an average degree and every spin follows the same deviation from one half. Under these approximations it gives `Tc = average_edge_strength * average_degree / 2`. A freezing-temperature expression additionally uses a one-neighbor idealization and a chosen spin-deviation threshold, usually 0.9. Relaxation is predicted to slow down near Tc; these are not universal thresholds for arbitrary graph instances (PDF pp. 5-6).

A two-stage experiment equilibrates at an initial temperature, then quenches near zero. Figure 3 varies the initial temperature and iterations per node. On the shown graph, 40 or 90 relaxation iterations near Tc give good solutions, while 5 or 20 often fail; starting too cold can freeze into a poor local minimum even with more iterations. This negative result limits the preceding informal suggestion that simply tracking mean-field fixed points must find the optimum (PDF pp. 6-7).

The conclusion mentions other applications and near-linear parallel speedups on a ZIP array processor, 64-node NCUBE and 10-processor Sequent. Those are author-reported statements without comparable detailed benchmark/timing tables in this article; they are not additional reproduced experiments in this note (PDF pp. 7-8).

## Limitations

The naive mean-field approximation discards dependencies of the stochastic system, and its temperature trajectory can settle into poor local minima. The empirical comparison is small and reports iteration counts, not a controlled hardware-independent elapsed-time advantage. Cooling rate, equilibrium tolerance, balancing strength and final feasibility all matter to reproducing graph-bipartition results.

The critical-temperature derivation relies on the four listed cluster approximations. It does not certify optimality, exact balance or a general polynomial-time solution of graph partitioning. The historical network is specialist and neurodynamic; reuse of a hand-designed mean-field algorithm is not a shared trained multi-problem model.

## Reproducibility

- **Read source:** all eight official scanned PDF pages, printed pages 91-98, including all seven references. Effective-field/sigmoid equations, the algorithm, Table 1 and phase-transition displays were visually checked. The original Figure 1 is extracted from PDF page 3.
- **Publication:** official NIPS 1988 volume 1 record. The six author names and middle initials were checked against the publisher and title page; affiliations are North Carolina State University and Oak Ridge National Laboratory.
- **Supplements:** the official landing offers bibliography, metadata and the article only. The complete paper has no appendix or reference to separate scientific attachments; no extra supplement was identified. Separately cited application papers are not merged into this entry's benchmark claims.
- **Implementation:** no source repository, checkpoint, machine-readable graphs or complete annealing configuration is linked. No simulation or claimed parallel speedup was rerun during this review.
- **Relations:** all references were checked; none identify another frozen collection entry. No outgoing internal edge is added.
