---
id: softassign-convergence
short_title: Softassign Convergence
title: A Convergence Proof for the Softassign Quadratic Assignment Algorithm
authors:
- Anand Rangarajan
- Alan L. Yuille
- Steven Gold
- Eric Mjolsness
year: 1996
date: '1996'
publication:
  date: '1996'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1996/hash/c8ba76c279269b1c6bc8a07e38e78fa4-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1996/hash/c8ba76c279269b1c6bc8a07e38e78fa4-Abstract.html
institutions:
- Yale University
- Smith-Kettlewell Eye Institute
- CuraGen Corporation
- University of California, San Diego
scope: study
paper_type: theory
problem_families:
- Permutation Optimization
problems:
- Quadratic Assignment Problem
- Traveling Salesman Problem
- Graph Matching
summary: An auxiliary-variable and KL-divergence argument establishes fixed-temperature energy descent for softassign QAP updates under exact doubly stochastic constraints and a projected spectral condition.
---

# A Convergence Proof for the Softassign Quadratic Assignment Algorithm

> **TL;DR:** Softassign QAP relaxation decreases an auxiliary energy at each fixed temperature when its assignment matrices are exactly doubly stochastic and self-amplification makes the quadratic form positive on feasible directions. The paper derives a spectral rule for that parameter and illustrates it on one constructed QAP; it does not prove global QAP optimality.

## Motivation

Softassign alternates row and column normalization to enforce both assignment marginals, improving on row-only softmax relaxation in earlier neural optimization work. Its empirical success on quadratic assignment, TSP and graph matching did not by itself explain when its iterative updates decrease an objective. This paper seeks a convergence argument and a principled setting for the previously free self-amplification parameter.

## Contributions

- Rewrites the entropy-regularized quadratic-assignment objective using an auxiliary assignment matrix so that two alternating updates each decrease a common energy.
- Derives a projected-eigenvalue criterion for the self-amplification coefficient, restricting curvature to directions that preserve row and column sums.
- Specializes the construction to TSP and graph matching, and supplies a synthetic QAP energy-descent illustration. The contribution is a theoretical analysis of an existing optimization procedure, not a newly trained generalist model.

## Methodology

The relaxed variable is an `N x N` positive assignment matrix `M`. The objective combines a quadratic QAP benefit, a diagonal self-amplification term controlled by `gamma`, the entropy term `(1/beta)*sum M_ai log M_ai`, and row/column constraints. The outer deterministic-annealing loop changes inverse temperature `beta`; the descent proof treats the inner relaxation at a **fixed** temperature.

An auxiliary matrix `sigma` linearizes the quadratic term in `M`. First set `sigma=M`; then compute the linear scores from `sigma` and update `M` by softassign: exponentiate the scores and alternately normalize rows and columns. The proof requires both matrices to satisfy the doubly stochastic constraints exactly, rather than merely approximately after a fixed number of Sinkhorn iterations.

For the first update, the augmented quadratic form must be positive on the feasible row/column-sum-preserving directions. With `r=I-ee^T/N` and `R=r tensor r`, the paper writes the self-amplification rule as `gamma=-lambda_min(R C R)+epsilon`, with `epsilon>0`, interpreted on the projected constraint directions. `R` annihilates directions changing the marginals, so positive definiteness here concerns the feasible tangent subspace, not every direction of the ambient `N^2` space. Computing the relevant spectrum can itself be costly for general QAPs.

For the second update, stationarity of the entropy-regularized linear subproblem and equality of the marginals cancel the constraint terms. The energy difference becomes `(1/beta)*sum sigma_ai log(sigma_ai/M_ai)`, which is nonnegative. Thus both steps decrease the auxiliary energy under the stated conditions. The TSP section expresses its distance/position objective through a Kronecker product and discusses its projected spectrum. Graph matching uses a compatibility matrix and discusses slack rows/columns; graph partitioning is mentioned as a similar extension, without a separate detailed derivation.

## Experiments

Section 3.1 contains one constructed numerical illustration, in addition to citing earlier extensive simulations. It takes `C=-v v^T` for a randomly chosen unit vector of dimension `N^2`. The projected negative eigenvalue is reported as `-0.8152`. Figure 1 compares `gamma=0` with `gamma=0.8162`, using `epsilon=0.001` in the spectral rule. Under the authors' plotted old-minus-new energy convention, negative values indicate energy increases; the adjusted run has nonnegative differences and therefore no increases.

The article gives no benchmark suite, trained neural model, approximation-gap statistics or timing comparison for QAP/TSP/graph matching. The synthetic figure illustrates the effect of the criterion; it does not independently establish general optimality or practical scaling.

## Limitations

### Discussed in the Paper

Exact doubly stochasticity is central to the proof. The authors distinguish this from a matrix only close to satisfying the constraints. The general projected matrix is `N^2 x N^2`, and finding the relevant extreme eigenvalue can be expensive; the problem-specific decompositions are intended to help.

### Curator Notes

The established decrease applies to a fixed-temperature auxiliary objective with a chosen self-amplification parameter. It should not be read as monotonicity of one unchanged objective across an arbitrary annealing schedule, a rate bound, a proof that finite-tolerance normalization obeys the same inequalities, or a guarantee of the global discrete QAP optimum. Bounded monotone energy and the paper's convergence terminology also should not be upgraded to an unqualified claim that every implementation converges to one unique permutation.

## Reproducibility

- Publication record: [NeurIPS 1996](https://proceedings.neurips.cc/paper_files/paper/1996/hash/c8ba76c279269b1c6bc8a07e38e78fa4-Abstract.html).
- Source text: [complete seven-page publisher PDF](https://proceedings.neurips.cc/paper_files/paper/1996/file/c8ba76c279269b1c6bc8a07e38e78fa4-Paper.pdf), including the full five-entry bibliography. Equations and Figure 1 were checked visually because several symbols are poorly extracted as text.
- The official proceedings page links the paper and metadata, with no separate scientific supplement or code attachment; none is cited in the complete article. No implementation URL was found.
- Pseudocode specifies the nested annealing, relaxation and Sinkhorn loops, but exact numerical replication also needs matrix size, sampled unit vector, normalization tolerance and stopping choices. These are not all supplied for the illustrated run. The experiments were not rerun in this review.
