---
id: identity-projection
short_title: Identity with Projection
title: 'Backpropagation through Combinatorial Algorithms: Identity with Projection Works'
authors:
- Subham Sekhar Sahoo
- Anselm Paulus
- Marin Vlastelica Pogančić
- Vít Musil
- Volodymyr Kuleshov
- Georg Martius
year: 2023
date: '2022-05-30'
publication:
  date: '2023'
  source_url: https://iclr.cc/virtual/2023/poster/10752
venue: ICLR
paper_url: https://openreview.net/forum?id=JZMR727O29
institutions:
- Cornell University
- Max Planck Institute for Intelligent Systems
- Masaryk University
- Cornell Tech
scope: study
paper_type: analysis
arxiv_url: https://arxiv.org/abs/2205.15213
problem_families:
- Differentiable Optimization
problems:
- Combinatorial Solver Differentiation
- Discrete Subset Sampling
- Graph Matching
- Traveling Salesman Problem
- Shortest Path
- Ranking
summary: A negative-identity surrogate avoids backward solver calls, while differentiable invariant cost transforms and optional noise determine its task-dependent performance.
code_url: https://github.com/martius-lab/solver-differentiation-identity
---

# Backpropagation through Combinatorial Algorithms: Identity with Projection Works

> **TL;DR:** Use the real solver forward and a negative-identity Jacobian backward, differentiating any invariant cost normalization in the usual way. This saves a backward solver call but provides a surrogate gradient. Projections help some tasks and hurt others; the paper's direct-cost theorem and empirical comparisons do not guarantee global training of the surrounding neural network.

## Motivation

Discrete argmin layers have a zero derivative almost everywhere, while methods such as Blackbox Backpropagation (BB) obtain an informative replacement by solving a perturbed problem. That additional solver call can be costly. The paper asks how far a simpler straight-through-style rule can go, and why directions that do not affect the solver can nevertheless disrupt training of the network producing its costs.

## Contributions

- Proposes a negative-identity backward rule for finite feasible sets with linear objective costs, without an additional backward solver invocation or BB's perturbation-scale parameter.
- Uses known solver invariances to remove irrelevant cost-gradient components through centering, normalization or their composition.
- Studies symmetric cost noise as a label-independent alternative to a ground-truth-informed margin.
- Provides a direct-cost, linearized-loss justification and empirical comparisons across discrete sampling, matching, retrieval, TSP and shortest paths. These are separate task models, not a shared generalist checkpoint.

## Methodology

For `y(omega)=argmin_{y in Y} omega.y` with finite encoded feasible set `Y`, the method returns `dL/domega=-dL/dy` instead of the ordinary zero Jacobian. The negative sign is for minimization; argmax uses the corresponding sign convention. No perturbed solve is needed in the backward pass. This is a replacement derivative, not the classical derivative of the discrete solver.

Theorem 1 considers repeated updates **directly in cost space**, with a sufficiently small step and exact optimization. Appendix C.3 explicitly requires tie-breaking in favor of the previously returned solution when it remains optimal. Before the first solution switch the incoming gradient is fixed, and the proof shows that a switch to a strictly lower **linearized** loss occurs if such a feasible solution exists. If no linearized improvement exists, the stated dynamics stay at the current solution. This is neither convergence to the global optimum of the original nonlinear loss nor a guarantee for arbitrary backbone-parameter updates, projections, noisy gradients or approximate solvers.

If a transformation `P` leaves solver solutions invariant, insert `P` before the solver and differentiate it while using negative identity for the argmin. Examples are subtracting the mean when all solutions share a coordinate sum, normalizing the costs by their norm, and standardization combining the two. The chain rule removes irrelevant directions on the backward pass while preserving the forward optimization where the transform is defined. Norm normalization requires nonzero input; standardization additionally requires a nonzero centered vector. The paper also interprets these Jacobians through increasingly constrained continuous relaxations.

Optional symmetric cost perturbations aim to discourage predictions near decision boundaries and cost collapse. Their amplitude `alpha` is explicitly a hyperparameter. Consequently, “hyperparameter-free” describes the basic estimator's lack of an additional BB-like scale, not every projection/noise/training choice in the full experimental pipeline. The noise used to sample a discrete latent distribution and the separate margin-inducing cost noise also have different roles.

## Experiments

The experiments have materially different outcomes and should not be summarized as universal dominance:

- **Discrete sampling:** a MNIST discrete VAE and BeerAdvocate top-`k` explanation models compare Identity with I-MLE and task-specific baselines. Standardization is important. For BeerAdvocate Aroma with `k=10`, Identity reports test MSE times 100 of `2.47±0.11`, versus `4.43±0.09` without projection and the cited I-MLE result `2.71±0.10`. These statistics use ten models/splits. DVAE curves show lower negative ELBO with suitable projection; they are not solution-quality benchmarks for routing.
- **Deep graph matching:** Pascal VOC and SPair-71k use learned keypoint affinities and a Lagrange-decomposition/dual-block-coordinate solver, with Hamming supervision. Five-restart comparisons show unnormalized Identity competitive with BB; adding normalization can worsen Identity. For example, Pascal VOC with noise amplitude 1 gives `79.6±0.8%` for Identity and `80.1±0.4%` for BB without normalization. This practical solver should not be conflated with the exact argmin assumption of the theorem.
- **Image retrieval:** CUB-200-2011 uses a ResNet50 embedding and a rank-based recall surrogate. Projection rescues otherwise very weak Identity performance, but it **does not close the gap to BB**. At noise amplitude 0.01 with standardization, Recall@1 is `60.4±0.5%` for Identity and `63.0±0.5%` for BB. The paper relates the gap to sparse incoming gradients and a crude relaxation of the ranking polytope.
- **Globe TSP:** separate 5/10/20-flag tasks learn spherical capital coordinates and use Gurobi. The study tests injected gradient noise and fixed label corruption, finding Identity more robust than BB in the reported conditions. Margin-inducing noise is applied for the first 50 of 100 epochs, while corruption can remain throughout training; these two schedules must not be conflated.
- **Warcraft appendix:** a 32-by-32 shortest-path experiment uses softplus-generated nonnegative costs. Without projection/noise, predicted-to-optimal true path cost times 100 is `101.0±0.1` for Identity versus `100.9±0.1` for BB. This is a cost ratio, not a percentage of exact paths.

Table 8 reports training and evaluation minutes for the tested pipelines. TSP(10) training takes `53.1±2.5` minutes for Identity versus `84.6±0.7` for BB. Matching training improves more modestly; sampling and retrieval show little runtime difference. Forward evaluation is similar because both methods use the same forward computation. Avoiding one backward call therefore does not imply a universal twofold end-to-end speedup.

## Limitations

### Curator Notes

The method depends on the incoming gradient, feasible-set geometry, appropriate invariances and numerical handling of normalization. Projection is not universally beneficial, the retrieval result is weaker than BB, and the direct-cost theorem cannot certify training of the entire network. Unbiased estimation of the true discrete gradient, global optimization and robustness to every distribution shift are not established.

**Curator qualification on noise:** the zero-measure-boundary argument in Section 3.6 needs a suitably continuous perturbation distribution to imply almost-sure avoidance. The same section specifies experimental noise on the discrete set `{-alpha/2,+alpha/2}^n`. Even in one dimension, a cost `omega=alpha/2` reaches the zero decision boundary with probability one half under that noise. Thus the reported noise procedure should be described as a useful empirical regularizer, not an unconditional positive-margin certificate or guaranteed boundary avoidance.

## Reproducibility

- Publication record: [official ICLR 2023 listing](https://iclr.cc/virtual/2023/poster/10752), linked to [OpenReview](https://openreview.net/forum?id=JZMR727O29).
- Source text: [complete 27-page arXiv v3, March 17, 2023](https://arxiv.org/pdf/2205.15213v3), including all references and Appendices A-D. The version is identified by the PDF header and primary arXiv history; v1 was submitted May 30, 2022.
- Implementation linked by the authors: [code](https://github.com/martius-lab/solver-differentiation-identity).
- The publicly inspected repository currently contains a README and a discrete-VAE notebook. This verifies an available implementation example; it does not independently verify the paper's broader claim of a curated release reproducing every experiment. Dataset-specific upstream architectures and parameters remain important.
- Main text describes a length-20 latent vector, while Appendix B.1 writes the encoder output as `20 x 20`; this shape description needs reconciliation when reproducing the VAE, rather than silently selecting one interpretation.
- OpenReview's forum and both notes/attachment APIs returned verification challenges/403 during this audit. All specifically referenced scientific supplements are integrated in the completely read arXiv version; no identified separate scientific attachment remains missing. All theorem proofs, tables and key projection/gradient figures were read and visually checked. Numerical experiments were not rerun.
- Reading copy: author manuscript. The publication record above identifies the formal conference article.
