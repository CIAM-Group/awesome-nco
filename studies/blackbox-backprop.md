---
id: blackbox-backprop
short_title: Blackbox Backprop
title: Differentiation of Blackbox Combinatorial Solvers
authors:
- Marin Vlastelica Pogančić
- Anselm Paulus
- Vít Musil
- Georg Martius
- Michal Rolínek
year: 2020
date: '2019-12-04'
publication:
  date: '2020'
  source_url: https://iclr.cc/virtual_2020/poster_BkevoJSYPB.html
venue: ICLR
paper_url: https://openreview.net/forum?id=BkevoJSYPB
institutions:
- Max Planck Institute for Intelligent Systems
- University of Florence
scope: study
paper_type: analysis
arxiv_url: https://arxiv.org/abs/1912.02175
problem_families:
- Differentiable Optimization
problems:
- Traveling Salesman Problem
- Minimum-Cost Matching
- Shortest Path
summary: A loss-informed second solver call computes the gradient of a continuous interpolation for training neural feature extractors around fixed-feasible-set combinatorial argmin layers.
code_url: https://github.com/martius-lab/blackbox-backprop
---

# Differentiation of Blackbox Combinatorial Solvers

> **TL;DR:** Keep the combinatorial solver in the forward pass, perturb its linear costs using the incoming loss gradient, and solve once more in the backward pass. The difference of the two discrete outputs supplies a continuous-interpolation gradient. Separate synthetic shortest-path, matching and TSP experiments demonstrate this layer; it is not one learned generalist solver or a global neural-training guarantee.

## Motivation

Conventional solvers encode useful constraints and can optimize exactly, while neural networks can learn costs from raw images. Combining them is difficult because the discrete argmin is piecewise constant: its ordinary derivative is zero almost everywhere and undefined at transitions. Differentiable relaxations can help training but change the forward problem. This work instead preserves the original solver and constructs an informative replacement for its backward computation.

## Contributions

- Defines a solver-agnostic backward construction for finite feasible sets with objectives linear in the learned input costs.
- Relates its update to a continuous, piecewise-affine interpolation of the linearized downstream loss, with an explicit perturbation-scale parameter.
- Demonstrates end-to-end neural feature learning around Dijkstra, Blossom V and a Gurobi TSP formulation, with an additional approximate OR-Tools experiment.
- Connects to earlier loss-augmented inference: the paper explicitly acknowledges that the update form predates this work, while developing its interpolation analysis and application to blackbox layers.

## Methodology

For a fixed finite feasible set `Y`, the solver returns `y(w)=argmin_{y in Y} w.y`, where feasible outputs have an injective vector encoding. The learned quantities are objective costs; the construction does not itself differentiate arbitrary changes in constraints or feasible-set structure. Given the forward output `y_hat` and incoming gradient `g=dL/dy`, it linearizes the downstream loss at `y_hat`, then computes

```text
w_prime = w + lambda*g
y_lambda = Solver(w_prime)
backward_gradient = (y_lambda-y_hat)/lambda,   lambda > 0.
```

The perturbed solve minimizes the original linear cost plus the scaled linearized loss. Thus the backward pass needs one additional call to the same solver and stores the forward costs/output. One extra call describes the computational structure; it is not a guarantee that two different solver instances have identical wall-clock runtimes.

For exact minimization, the interpolation can be written as the difference between two minimum-value functions, divided by `lambda`. Finite minima of affine functions are continuous and piecewise affine, giving an almost-everywhere gradient equal to the output difference above. The paper further analyzes agreement regions and affine interpolation geometry. The uniqueness argument for agreement as `lambda` vanishes is stated almost everywhere, outside tie boundaries. These properties concern the constructed interpolation of a local linearization; the returned vector is not the ordinary derivative of the original discrete task loss.

`lambda` trades fidelity against the size of regions with a useful nonzero gradient. If it is too small to change the selected solution, the update is zero. Appendix A.1 suggests matching the scale of the learned costs and loss perturbation; the experiments use 10 or 20. No convergence to globally optimal neural-network parameters follows. Approximate solvers can be used empirically, but the exact-minimization guarantees do not automatically carry over.

## Experiments

Each task/size configuration uses its own dataset and trained model; the reported collection is not evidence of one checkpoint transferred across all three tasks or sizes. Each training dataset contains 10,000 examples, and principal accuracy tables report mean and standard deviation over five restarts.

- **Warcraft shortest path:** terrain images hide vertex costs on grids of side 12, 18, 24 or 30. A convolutional network predicts costs and Dijkstra supplies a feasible path. Training uses Hamming loss, while evaluation counts paths having the optimal cost, accommodating multiple optima. Test accuracy is `96.0±0.3%` at side 12 and `94.0±0.3%` at side 30. The baseline ResNet18 is a sanity check, not an exhaustive comparison with other differentiation methods.
- **Globe TSP:** inputs are subsets of country-flag images from 100 countries. The network predicts three-dimensional capital locations projected onto a sphere, converts them to pairwise distances and calls Gurobi with lazy subtour elimination. Full-tour test accuracy is `99.2±0.1%` for five flags and `96.7±0.4%` for 40. Learned-location errors are evaluated after an orthogonal alignment, since rotations/reflections of the sphere are irrelevant.
- **MNIST perfect matching:** digit images on a grid determine edge costs by reading neighboring digits as two-digit numbers. A convolutional network predicts values supplied to Blossom V. Test optimal-matching accuracy is `98.32±0.24%` at side 4 and `92.06±7.97%` at side 24; the latter has substantial restart variation.

The appendices contain material training details. Shortest path uses 50 epochs and `lambda=20`; matching uses 30 epochs and `lambda=10`. Globe TSP uses 100 epochs and `lambda=20`, modified Adam settings, and a size-dependent repellent regularizer active between epochs 15 and 30 to mitigate collapsed/planar embeddings. The latter matters when interpreting the main text's description of straightforward training.

Appendix A.4 replaces the exact TSP solver with approximate OR-Tools. At 40 flags, learned representations achieve `15.1±0.3%` exact-tour accuracy, versus `15.2%` when this solver receives ground-truth capital locations. This shows the influence of the chosen solver and useful feature learning despite approximation. The ground-truth-location result is an empirical reference, not a mathematical upper bound on every possible learned-cost configuration. The paper reports training under two hours per model on its single-machine GPU/CPU setup, with solver cost dominating larger TSP cases; this is not a general runtime guarantee.

## Limitations

### Discussed in the Paper

The authors identify realistic applications and approximate solvers as further directions; they explicitly note that approximation breaks some theoretical guarantees. The experiments are constructed proof-of-concept tasks, and the TSP appendix discusses local minima and sensitivity to restarts.

### Curator Notes

Backward solving adds training work and retains the computational difficulty of the underlying combinatorial problem. The linear-cost, fixed-feasible-set and exact-solve assumptions should accompany theoretical claims. Solver-compatible perturbed cost domains, ties and numerical tolerances also matter in implementation. Successful feature learning does not remove NP-hardness, certify unseen predictions under true costs or prove global convergence of the surrounding network. Feasibility of a forward solver output is separate from correctness of the learned costs.

## Reproducibility

- Publication record: [official ICLR 2020 listing](https://iclr.cc/virtual_2020/poster_BkevoJSYPB.html), with the corresponding [OpenReview record](https://openreview.net/forum?id=BkevoJSYPB).
- Source text: [complete 19-page arXiv v2, February 16, 2020](https://arxiv.org/pdf/1912.02175v2), including all references and Appendices A.1-A.4. The version is identified on its first page and the arXiv history; the formal ICLR publication is independently confirmed by the conference listing.
- Implementation linked by the authors: [code](https://github.com/martius-lab/blackbox-backprop).
- The wrapper repository links a [separate experiment repository](https://github.com/martius-lab/blackbox-differentiation-combinatorial-solvers). Its README specifically supplies dataset visualization and Warcraft training code; this should not be described as a verified complete training release for every experiment. Running the TSP wrapper also requires a Gurobi installation/license.
- OpenReview's forum and both attachment APIs returned a verification challenge/HTTP 403 during this audit. All scientific appendices referred to in the article are integrated in the fully read arXiv version; no explicitly referenced scientific attachment remains unread. This access limitation is recorded in the review evidence.
- Key interpolation formulas/proofs, task illustrations, all main result tables and appendix training/approximation tables were checked visually. The experiments were not rerun.
