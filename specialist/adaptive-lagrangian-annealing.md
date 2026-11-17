---
id: adaptive-lagrangian-annealing
short_title: Adaptive Lagrangian Annealing
title: Merging Constrained Optimisation with Deterministic Annealing to "Solve" Combinatorially Hard Problems
authors:
- Paul Stolorz
year: 1991
date: '1991'
publication:
  date: '1991'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1991/hash/99c5e07b4d5de9d18c350cdf64c5aa3d-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1991/hash/99c5e07b4d5de9d18c350cdf64c5aa3d-Abstract.html
institutions:
- Santa Fe Institute
- Los Alamos National Laboratory
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: Entropy-constrained saddle dynamics replace an externally prescribed deterministic-annealing schedule;
  elastic-net TSP experiments show faster convergence, while solution-quality gains are not statistically significant.
---

# Merging Constrained Optimisation with Deterministic Annealing to "Solve" Combinatorially Hard Problems

> **TL;DR:** Treating temperature as a dynamic multiplier couples entropy reduction and state relaxation. Elastic-net TSP variants run faster in the reported experiments; neither the numerical convergence nor the small tour-length gains establish global optimality.

## Motivation

Deterministic mean-field annealing needs an externally selected temperature schedule. Conventional Lagrangian relaxations can introduce costly penalties, derivatives or matrix inversions. This paper uses the mean-field entropy itself as a constraint and evolves a multiplier alongside the original state, avoiding repeated equilibration under a separately prescribed schedule (PDF pp. 1-4).

## Contributions

- Combines mean-field free energies and first-order Lagrangian dynamics through an entropy constraint.
- Develops a global-multiplier elastic-net variant and a city-specific multiplier extension.
- Compares tour lengths and CPU times on random TSP50 instances and reports one historical TSP100 example.

## Methodology

Starting from `F(x,T)=U(x)-T*S(x)`, use the vanishing of the entropy estimate as temperature approaches zero. Replace T by a variable lambda and evolve the state down the free-energy gradient while evolving lambda up its gradient. A modified objective adds `c*log(lambda)`, yielding `lambda_dot=-S(x)+c/lambda`; this positive-multiplier barrier is proposed in the formulation but was omitted in the reported numerical experiment, which instead stops at a small lambda (PDF pp. 2-4).

The elastic-net case is subtler: its entropy-like term also depends on lambda, so the paper explicitly says this is not a literal Lagrange multiplier for a lambda-independent constraint. Its update includes `lambda_dot=-epsilon*(S+lambda*dS/dlambda)`. Epsilon remains an externally selected positive rate, fixed at initialization. City-specific multipliers control additive components of the entropy term. Removing an externally supplied cooling schedule therefore does not remove all tuning parameters (PDF pp. 4-5).

The proposed explanation is exchange between state and multiplier components of a kinetic-energy quantity. Oscillations can carry a trajectory away from a valley followed by ordinary elastic-net annealing. Figure 1(b) is a schematic free-energy landscape, not a measured global landscape or proof of escaping every local minimum. The text refers local convergence and discrete-constraint arguments to a separate technical report; it calls broader convergence plausible and empirically observed. Convergence of a trajectory must not be equated with convergence to the optimal TSP tour (PDF pp. 4-7).

## Experiments

Table 1 uses 40 random 50-city unit-square instances on a SUN SPARC Station 1+. Elastic net, global multiplier and local multipliers have mean tour lengths `5.95 +/- 0.10`, `5.92 +/- 0.09` and `5.92 +/- 0.08`; CPU times are `260 +/- 33`, `49 +/- 5` and `82 +/- 12` seconds. The displayed mean times give approximately 5.3x and 3.2x speedups, rather than a universal tenfold result. Alpha differs between elastic net (0.2) and multiplier variants (0.4), beta is 2.5, and update sizes were separately tuned. The authors explicitly say the roughly 0.5% quality differences are not statistically significant (PDF p. 6).

For the cited 100-city instance, a tour of length 7.746 improves on the elastic-net value 7.783. It remains about 0.5% longer than the best simulated-annealing tour mentioned in the text. The claimed lower CPU effort is not accompanied by a corresponding timing table for that instance. Neither comparison uses a certified optimum as its reported reference (PDF p. 6).

## Limitations

Evidence is restricted to these elastic-net TSP experiments. The article does not establish a general global-optimization guarantee, statistically significant quality improvement, or controlled speed advantage over modern solvers. The barrier omission, stopping threshold, epsilon, integration steps and elastic-net settings matter for replication. Generalization to other mean-field formulations is a methodological proposal, not evidence of one trained model solving several native tasks; this remains a specialist neurodynamic entry.

## Reproducibility

- **Read source:** all eight official scanned pages, printed pages 1025-1032, including all 16 references. Equations 1-9, Table 1 and both Figure 1 panels were visually checked where OCR lost mathematical symbols.
- **Publication:** official NIPS 1991 volume 4 record; Paul Stolorz, Santa Fe Institute, with the title-page Los Alamos National Laboratory affiliation also recorded.
- **Supplements:** the official record links bibliography, metadata and the article. No separate scientific attachment or appendix is identified. The separately cited LA-UR-91-3593 technical report was not silently treated as part of this eight-page article, and its deferred proofs are not asserted as checked here.
- **Implementation:** no code, complete integration settings or machine-readable instances are linked. Experiments were not rerun.
- **Relations:** every reference was checked against the frozen collection; none identify another entry, so no internal citation edge is added.
