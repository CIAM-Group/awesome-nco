---
id: birkhoff-extension
short_title: Birkhoff Extension
title: Differentiable extensions with rounding guarantees for combinatorial optimization over permutations
authors:
- Robert (Riley) Nerem
- Zhishang Luo
- Akbar Rafiey
- Yusu Wang
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/9840235bd522f0f067f306ddfd6d1ca1-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/9840235bd522f0f067f306ddfd6d1ca1-Abstract-Conference.html
institutions:
- University of California, San Diego
- New York University
scope: study
paper_type: theory
problem_families:
- Permutation Optimization
- Differentiable Optimization
problems:
- Permutation Optimization
- Quadratic Assignment Problem
- Traveling Salesman Problem
- Directed Feedback Arc Set
summary: A score-ordered Birkhoff decomposition extends permutation objectives with support-based rounding, alongside
  direct optimization and a neural TSP pilot; stronger guarantees require qualification.
code_url: https://github.com/luckyjackluo/BE-for-Combinatorial-Optimization
---

# Differentiable extensions with rounding guarantees for combinatorial optimization over permutations

> **TL;DR:** A fixed score ordering makes Birkhoff coefficients continuous, enabling objective differentiation and rounding by choosing the best supported permutation. Direct QAP/TSP/ordering optimization and a separate neural TSP pilot illustrate the construction. Several stronger guarantees in the published article need qualification, documented below as curator analysis.

## Motivation

Set-function extensions do not directly supply an extension for objectives whose discrete variables are permutations. A doubly stochastic matrix is a convex combination of permutation matrices, but the decomposition is not unique: arbitrary matching choices can make the induced objective discontinuous. The paper seeks a continuous, differentiable-almost-everywhere decomposition that can be evaluated without enumerating all `n!` permutations.

## Contributions

- Fixes a total permutation order and recursively removes the first supported perfect matching, obtaining Lipschitz coefficients and a continuous, almost-everywhere differentiable extension.
- Represents the order through an identifying score matrix, making the next supported permutation computable by weighted bipartite matching.
- Proposes direct Frank-Wolfe-style optimization with changing scores, a normalized truncated variant, a tree-topology construction and an unsupervised neural TSP demonstration.
- Establishes a basic rounding inequality for a genuine convex-combination extension: the best supported objective is at most the weighted average. This fact is distinct from the stronger warm-start and convergence claims assessed below.

## Methodology

For `A` in the Birkhoff polytope, the decomposition repeatedly selects a maximum-score permutation whose edges have positive residual mass. It subtracts the minimum residual value on that permutation, and continues until the residual vanishes. A fixed identifying score matrix assigns distinct scores to every permutation; independent absolutely continuous score entries ensure this almost surely. The ordering remains fixed as `A` varies. The coefficient recursion is Lipschitz, hence differentiable almost everywhere relative to the polytope's affine hull.

The full extension is `F_S(A)=sum alpha_k*f(P_k)`, with nonnegative coefficients summing to one and `A=sum alpha_k*P_k`. Exact full decomposition has `O(n^5)` matching overhead plus objective-evaluation costs; this is not a polynomial-time algorithm for globally minimizing an arbitrary permutation objective. Full-extension global minimum values equal discrete global minimum values, and full-extension global minimizers lie in the convex hull of discrete minimizers. Rounding chooses the best supported permutation, giving `f(round_S(A)) <= F_S(A)`. Multiplicative approximation language additionally needs the usual compatible objective-sign/optimum convention; the value inequality itself applies to arbitrary real-valued objectives.

The proposed optimization repeatedly solves a linear matching subproblem and takes convex-combination steps to retain feasibility. Score changes alter the nonconvex extension. Practical experiments keep only five decomposition terms; Appendix J defines renormalization by their total weight, reducing matching work to `O(K*n^3)`. Renormalization retains the best-supported-value versus average inequality, but does not preserve every property of the full decomposition. No general guarantee of globally successful gradient optimization follows.

The core experimental optimizer is conventional per-instance continuous optimization. Appendix B separately trains a neural network from coordinates and an MST-derived score matrix, using the extension loss plus a row/column penalty. A finite penalty makes outputs approximately doubly stochastic, as the figure explicitly labels them; it does not by itself establish exact feasibility. The neural pilot trains on TSP sizes 20/30/40 and fine-tunes at test time. It does not demonstrate a shared checkpoint for QAP, TSP and directed feedback arc set.

## Experiments

For QAP, the 136 QAPLIB instances have sizes 12-256 and mix certified optimal with best-known reference objectives. Under a `2*n`-second cap, Table 1 reports average gaps of 6.30% for the proposed random-score optimizer, 7.67% for Kaufman-Broeckx/Gurobi, 15.41% for FAQ and 10.38% for 2-opt, with respective average runtimes 23.01, 90.3, 0.01 and 22.82 seconds. These figures reflect selected formulations/budgets, not dominance over all QAP solvers.

The TSP benchmark uses 50 uniform two-dimensional Euclidean instances at each size 20/30/40/50/100. At size 100, Table 2 gives tour length 7.748 for Gurobi, 10.288 for MST, 15.615 for random-score BE, 9.836 for MST-score BE and 11.782 for QP-score BE. Gurobi is both faster and better on this benchmark; the reported MST-score improvement is 4.60% relative to MST, not a gap to the optimum. Appendix E gives CentOS 7/Intel Xeon E5-2650L and single-threaded Gurobi; Table 5 reports the MST-score BE run at 1,318 seconds versus less than one second for Gurobi.

Directed Erdős-Rényi feedback-arc experiments use probabilities 0.1/0.5/0.9, with main setup sizes 20/50/100 and Table 3 additionally displaying 250. Both methods receive `n/10` minutes: two minutes at 20 nodes, five at 50 and ten at 100. BE is competitive and better in several larger/dense cases, while Gurobi wins other cells. These are mean feedback-arc counts, with no error bars or significance tests, as the checklist explicitly states.

The neural TSP pilot uses 6,000 mixed-size training instances, 100 epochs and learning rate 0.001 selected from four candidates. Table 4 includes test-time fine-tuning: at size 100 it gives length 10.220 in 5.42 seconds, compared with length 10.239 in 24.56 seconds for the displayed 100-step direct optimizer. It remains worse than the longer MST-score run's length 9.836; the result is a time/quality tradeoff, not equal-quality universal acceleration.

Appendix F studies truncation, update frequency, initialization and optimizer on 14 small QAPLIB instances, plus 20 synthetic size-1000 QAPs. On the latter, FAQ has 0.10% gap to the best reported reference in 345 seconds, whereas random-initialized BE variants retain 14-32% gaps under the displayed budgets; FAQ-initialized BE reaches that best reference after 2,000 seconds. These synthetic results limit broad scalability claims. Tree and constraint extensions are mathematical constructions, not separately reported learned benchmarks.

## Limitations

### Discussed in the Paper

- Full evaluation is expensive, and repeated matching is a bottleneck. Truncation and GPU-friendly matching are proposed practical directions.
- The extension is generally nonconvex/nonsmooth; nonsmooth Frank-Wolfe need not converge in general. Better score updates and larger neural experiments remain future work.
- Results are averaged over instances without error bars or significance testing.

### Curator Analysis: Published Guarantees Need Qualification

The following checks concern the statements as printed in the reviewed publisher version. They are independent curator analysis, not author-provided corrections.

1. **Warm-start score bound needs a support condition.** Property 4-2 on PDF page 6 claims `f(round_S(A)) <= f(P*)` for every doubly stochastic `A` whenever `S` is sufficiently close to `P*`. Take `n=2`, `P*=I`, `A=Q=[[0,1],[1,0]]`, `S=I`, and define `f(I)=0`, `f(Q)=1`. The score-distance requirement is satisfied with distance zero, and `S` identifies the two permutations. However, the only positive-weight decomposition term of `A` is `Q`, so rounding has value 1 > 0. Algorithm 2 on page 5 correctly restricts selection to `P(A)`; the page-17 proof before Equations (11)-(14) replaces that domain with all permutations. An additional condition such as `P*` having positive support in `A` would make it the first removable term; that is a curator inference, not the published unconditional theorem.

2. **Truncated global minimizers need not satisfy the full convex-hull conclusion.** Remark J.3 on page 32 extends the full argmin statement to normalized truncation. For three cities, let `A` have every entry `1/3`, and order its three disjoint cyclic permutations as `I,C,C^2`, each with coefficient `1/3`. Set `f(I)=f(C)=0` and all other permutation values to 1. A score matrix can realize this decomposition, for example `[[9,4,1],[1,9,4],[4,1,9]]` plus distinct sufficiently small binary-place perturbations. With `K=2`, the normalized truncated value is zero and globally minimal, but `A` is outside `Conv(I,C)` because it has positive entries on `C^2`'s disjoint support. Equality of optimal values and best-support rounding survive; the stronger minimizer-location statement does not follow from discarding mass.

3. **The displayed row-greedy matching algorithm does not have its stated half-optimum bound.** Appendix L's Algorithm 7/Theorem L.2 on page 33 processes source vertices in fixed order. In a complete two-by-two graph with nonnegative weights `[[10,9],[100,0]]`, every edge is allowed in a perfect matching. The first row chooses weight 10, leaving weight 0 for the second row: total 10, versus optimum 109. Thus the displayed algorithm's ratio is below one half. This check does not challenge the separate basic rounding-by-average inequality.

4. **Local-minimum and pseudocode wording require care.** Theorem 2.11/page 7 and Theorem J.2/page 31 literally claim escape for any point, including global minima. The proof's equality case on page 28 already identifies a global minimum; that point is also a local minimum. The useful narrower implication is a descent direction when the selected permutation has strictly smaller objective, not universal escape or an efficient method to find the right score. Algorithms 3/4 display an `argmax` of the gradient although the prose describes a minimization/negative-gradient step. Implementations should resolve this sign convention and retain residual-support restrictions, rather than transcribe these displays blindly.

These qualifications prevent the note from endorsing universal warm-start nondegradation, preservation of every full-extension property after truncation, or global optimization/convergence guarantees.

## Reproducibility

- **Publication:** [Official NeurIPS 2025 record](https://proceedings.neurips.cc/paper_files/paper/2025/hash/9840235bd522f0f067f306ddfd6d1ca1-Abstract-Conference.html), with the official author-name form retained.
- **Reviewed source:** All 40 [publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/9840235bd522f0f067f306ddfd6d1ca1-Paper-Conference.pdf) pages, including complete references, Appendices A-L and the full checklist. Key definitions, formulas/proofs, result tables, curves and the neural framework were checked visually.
- **Supplement:** The [publisher ZIP](https://proceedings.neurips.cc/paper_files/paper/2025/file/9840235bd522f0f067f306ddfd6d1ca1-Supplemental-Conference.zip) contains code, datasets, checkpoints, logs and notebooks, with no further scientific PDF. Its member inventory, README and notebook text-cell inventory were inspected; all six notebooks contain code cells rather than additional narrative manuscript sections.
- **Implementation:** [Official author repository](https://github.com/luckyjackluo/BE-for-Combinatorial-Optimization), explicitly linked in the paper checklist and independently opened. This audit did not rerun the large benchmarks. Small exact-arithmetic counterexamples above check printed theoretical statements and are not experimental replications.
- **Reading map:** A proves the main properties; B contains the neural TSP pilot; C trees; D formulations; E-F experiments/ablations; G score changes; H convex closure; I constraints; J truncation; K an additional Lipschitz claim; L the proposed matching routine. Published assertions and curator inferences are separated explicitly.
