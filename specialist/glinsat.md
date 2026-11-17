---
id: glinsat
short_title: GLinSAT
title: 'GLinSAT: The General Linear Satisfiability Neural Network Layer By Accelerated
  Gradient Descent'
authors:
- Hongtai Zeng
- Chao Yang
- Yanzhen Zhou
- Cheng Yang
- Qinglai Guo
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/dd73f39426a03131c38c8d943153d44b-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/dd73f39426a03131c38c8d943153d44b-Abstract-Conference.html
institutions:
- Tsinghua University
- Alibaba DAMO Academy
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Differentiable Optimization
problems:
- General Linear Constraints
- Routing
- Partial Graph Matching
- Portfolio Optimization
- Unit Commitment
summary: A parameter-free layer enforces bounded signed linear constraints through
  logistic-entropy regularization and accelerated primal-dual gradient iterations,
  with automatic or implicit backward passes.
code_url: https://github.com/HunterTracer/GLinSAT
---

# GLinSAT: The General Linear Satisfiability Neural Network Layer By Accelerated Gradient Descent

> **TL;DR:** GLinSAT is a matrix-factorization-free constraint layer for bounded variables with general signed linear constraints. It uses a logistic-entropy-regularized linear objective, accelerated primal-dual iterations and automatic or implicit differentiation. Separate task networks demonstrate its use; the layer alone does not solve arbitrary integer or nonlinear programs.

## Motivation

Neural predictions used as decisions must satisfy coupled constraints, whereas penalty losses and simple activations need not ensure joint feasibility. Positive-coefficient layers such as LinSAT cannot directly express a relation like x-y <= 0. General convex layers are more expressive but can incur CPU batching or matrix-factorization costs. GLinSAT targets bounded general linear systems with GPU-friendly matrix-vector and elementwise operations (Sections 1-2; Appendix A.1).

## Contributions

The paper derives a smooth unconstrained dual for an entropy-regularized linear problem, adapts accelerated primal-dual gradient descent with numerical safeguards, and supplies dense/sparse implementations with explicit and implicit backward variants. The constraint layer has no learned parameters; the surrounding networks are trained separately for constrained routing, partial graph matching, portfolio allocation and unit commitment. Its reusable formulation is a specialist modeling layer, not evidence of one checkpoint shared across these applications.

The iteration bound in Corollary 1 is conditional: it assumes an attained optimal dual solution with norm at most R and gives order ||A|| max(u) sqrt(theta R / epsilon). It is not an unconditional iteration guarantee for every nonempty feasible bounded system or a combinatorial optimality guarantee.

## Methodology

Bounds are shifted and bounded slack variables turn signed inequalities/equalities into Ax=b, 0<=x<=u. The layer maximizes dot-product similarity to the network output with logistic entropy regularization on x/u and its complement. This is not Euclidean projection. The resulting dual has a sigmoid primal map and a Lipschitz gradient; APDAGD uses adaptive step estimates, weighted primal averaging and a small numerical relaxation of its descent test (Equations 1-8; Algorithm 1).

The inverse temperature theta controls regularization 1/theta. Smaller regularization approaches a linear objective and can encourage extreme points, but does not universally force binary outputs. Explicit differentiation unrolls the finite iteration sequence and stores its graph. Implicit differentiation instead solves a Jacobian system using conjugate gradients without forming a matrix factorization. Appendix A.7 derives gradients with respect to c, A, b and u; tolerances, floating-point precision and regularity of that system affect the computed result.

For TSP, a Transformer predicts a relaxed city-position matrix, followed by rounding or width-2048 beam search. Partial matching adapts a pretrained NGMv2 model with a known inlier count, followed by Hungarian matching and retaining the highest-scoring p pairs. Portfolio allocation remains continuous. Unit commitment predicts generator states with supervised labels; rounded states are fixed before Gurobi solves the remaining LP. These post-processing and oracle costs are part of the pipelines.

## Experiments

Experiments use an A100 80GB GPU, a 24-core Xeon Platinum 8360H and PyTorch 2.2. In the 20-city routing comparison at regularization 0.1, dense implicit GLinSAT reports 0.306s projection and 0.143s backpropagation for StartEnd, versus 1.323s and 1.927s for dense LinSAT with 500 iterations. Its width-2048 beam-decoded StartEnd/Priority tour lengths are 3.811/3.927 with 100% feasibility on the evaluated set. Direct rounding at regularization 0.01 gives 94.2%/93.4% feasibility instead. Training, temperature and decoding settings matter; the CPU/OptNet timing rows are first-epoch statistics, since those baselines were not fully trained within the authors' time budget (Tables 2-3; A.1-A.2).

Pascal VOC partial matching uses the unfiltered setting and pretrained NGMv2, with F1 values around 0.620 for GLinSAT variants. Variable-size graphs are batched as block-diagonal systems for LinSAT/GLinSAT but processed sequentially for CVXPYLayers/OptNet; some variants also use different numerical precision. The speed comparison includes these implementation choices. Portfolio allocation uses historical prices, a StemGNN backbone, full investment and a minimum preferred-subset allocation. GLinSAT reports Sharpe ratios 2.535/2.608 at regularizations 0.1/0.01; OptNet's 2.553 at 0.1 is higher, so GLinSAT does not win every objective comparison (Tables 4-5; A.3-A.4).

Unit commitment uses approximately 360 generators, 96 time periods and over 1,400 network sections, with a 70/30 split of one year's data. Gurobi solves training MILPs to a 0.1% gap for labels. Only sparse implicit GLinSAT fits the authors' million-row batched projection among the tested GLinSAT variants. Validation rounds predicted states and solves a fixed-state LP: feasibility rises from 86.23% at regularization 0.01 to 100% at 0.0005/0.0001, with an average gap of 0.1114% among feasible cases. Load-balance/network violations are soft penalties in this formulation. The finite validation result does not establish generic integer feasibility, and the reported gap excludes infeasible predictions (Table 6; Appendix A.11).

## Limitations

The formulation requires finite lower and upper bounds and a feasible linear system. Unbounded, one-sided or conic constraints need additional treatment. Generic integer feasibility still needs decoding or a suitable integral polytope; smaller entropy regularization alone is insufficient. Iterative tolerances and finite precision create a speed/accuracy tradeoff. The checklist explicitly reports no error bars because of computational expense, so small F1 or Sharpe differences lack reported statistical uncertainty. Unit-commitment data and code are withheld under confidentiality agreements.

### Curator Notes

The printed inverse-Jacobian formula needs additional regularity beyond the positive-semidefinite property established in Equation A.21. Redundant equality rows can make that matrix singular even at a strictly interior primal optimum; positive semidefiniteness alone does not imply invertibility. A compatible singular system may still be handled by a suitable solver, but that requires an appropriate solution convention rather than the literal inverse. Likewise a constraint forcing a bound, such as x=0 with 0<=x<=1, has no finite sigmoid dual representation of its exact solution; Corollary 1's finite-dual assumption cannot be silently dropped. These are conditions on the printed derivation, not evidence that the reported application results are invalid.

## Reproducibility

- [NeurIPS 2024 proceedings](https://proceedings.neurips.cc/paper_files/paper/2024/hash/dd73f39426a03131c38c8d943153d44b-Abstract-Conference.html), DOI 10.52202/079017-3896: all 32 pages, all 44 references, Appendices A.1-A.11 and the full checklist were read. The publisher HTML supports the retained December 16 publication date. Eight key derivation/result pages were visually checked.
- The publisher supplement ZIP has 246 members and no scientific PDF. Its four full README files document the first three applications and the confidential unit-commitment exception; these instructions were read. Both OpenReview API versions for `m1PVjNHvtP` returned 403. The full scientific appendices are integrated in the read proceedings PDF; no explicitly referenced scientific document is missing.
- [Official code](https://github.com/HunterTracer/GLinSAT), revision `56d72b8044cfe9e25cf62d0199e9d84df70e6dfe`, has 181 files and no separate PDF/ZIP. The repository README/application instructions and the complete 242-line TSP dense APDAGD layer plus 80-line conjugate-gradient helper were inspected. This is source review, not an end-to-end experiment rerun.
- 10 exact existing-paper citations are registered using explicit body and complete-reference locators. No training, benchmark or numerical solver reproduction was performed for this paper.
