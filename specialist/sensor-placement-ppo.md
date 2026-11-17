---
id: sensor-placement-ppo
short_title: Sensor Placement PPO
title: Flow Field Reconstruction with Sensor Placement Policy Learning
authors:
- Ruoyan Li
- Guancheng Wan
- Zijie Huang
- Zixiao Liu
- Haixin Wang
- Xiao Luo
- Wei Wang
- Yizhou Sun
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/9708c7d3a0fef3710f33ba05a74e10b3-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/9708c7d3a0fef3710f33ba05a74e10b3-Abstract-Conference.html
institutions:
- University of California, Los Angeles
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Sensor Placement
summary: Directional transport-aware GNN reconstruction is paired with two-stage PPO
  for fixed-count boundary sensor selection; the printed sampling/likelihood and penalty
  claims need qualifications, and the released code covers reconstruction.
code_url: https://github.com/RuoyanLi2002/Flow-Field-Reconstruction-with-Sensor-Placement-Policy-Learning.git
---

# Flow Field Reconstruction with Sensor Placement Policy Learning

> **TL;DR:** Learn a boundary-field reconstructor and a fixed-cardinality sensor-selection policy adapted to its errors. Experiments report improved reconstruction and placement quality; printed constrained-distribution and penalty guarantees require qualifications, and the inspected release contains reconstruction code rather than the PPO implementation.

## Motivation

Sparse sensing must balance measurement cost and reconstruction accuracy on irregular geometries. A placement optimized for a linear reconstruction method need not suit a neural reconstructor. This work studies 3D boundary meshes without imposing governing PDEs in the learned model and learns sensor layouts using the reconstructor's negative error as reward. Its CFD data are numerical simulations intended to be more realistic, not physical sensor measurements.

## Contributions

The paper introduces a directional transport-aware GNN (DTA-GNN), four COMSOL-simulated geometry datasets, and Two-Step Constrained PPO for a fixed sensor budget. The first stage penalizes count violations; the second uses exact-count subset sampling with an approximate conditional likelihood. Reconstruction tests include additional turbulence data, cross-geometry transfer and real sea-surface temperature observations. Placement ablations compare uniform/random, linear selection heuristics and training-stage alternatives.

This is a **specialist/constructive** placement solver coupled to a reconstruction model. The combinatorial action selects a sensor subset from predetermined boundary nodes. Changing geometry or sensor density remains the native sensing problem; the paper does not establish one policy checkpoint solving distinct CO families. The SST experiment evaluates reconstruction, not a demonstrated extension of the PPO selector to another native optimization problem.

## Methodology

DTA-GNN encodes measured velocity/pressure, sensor masks and mesh edges. Each processor computes a directional alignment between latent node/edge features, multiplies this by a neighboring latent-state difference, and transforms/aggregates messages through MLPs. Residual updates and a decoder predict unmeasured values. The advection/interpolation connections are architectural analogies, not a proof of governing-equation fidelity. Appendix C specifies six message-passing layers of width 64, mask embeddings of width 16, four-layer MLPs, batch size 16 and 300 epochs with cosine learning rate 0.0001 to 0.00001.

For placement, Section 4 defines a policy input graph containing **complete field information** and one Bernoulli parameter per candidate. The reward is negative normalized velocity/pressure MSE on unmeasured nodes. Exactly m=k|V| nodes must be selected; m must be an admissible integer count. Stage one uses independent Bernoulli sampling and a squared count penalty. Stage two selects the top m of log-probability-plus-Gumbel scores and uses a saddlepoint estimate of a conditioned Bernoulli likelihood in PPO. Sampling exactly m nodes enforces the count even though its distribution differs from that printed conditional likelihood, as detailed below.

Appendix F uses separate six-layer, width-128 actor/critic GNNs, a graph-mean critic, penalty coefficient 0.00015, five gradient updates, PPO clipping 0.2 and cosine learning rate 0.00001 to 0.0000001. Penalized training lasts 1.5 million steps, followed by 0.5 million constrained steps. These budgets and the complete-field policy-input assumption belong in any reproduction/deployment description.

## Experiments

**3D reconstruction.** COMSOL DNS generates sphere, ellipsoid, cylinder and NACA 4-digit geometries with variable shape parameters and stochastic/time-dependent inlet conditions. Table 2 compares 5/10/20/30% uniform and random sensors against interpolation, OFormer, GKO, FCN, MeshGraphNets and a mesh-adapted DiffusionPDE. Values are MSE scaled by 10^-4. For sphere/10% uniform, DTA-GNN obtains 3.092 versus MeshGraphNets 3.537 and DiffusionPDE 3.755. For NACA/30% random, its 29.803 is only slightly below DiffusionPDE 29.912: improvement varies by condition.

**Placement.** Figure 4 reports approximately 15% lower MSE than uniform placement at 10% sensors across the four shapes. Appendix G's sphere comparison gives uniform 3.092, random 4.110, QR pivoting 6.988 and D-optimal 6.309. Those protocols differ: random locations are redrawn per frame, whereas QR/D-optimal locations remain fixed for a trajectory. The comparison does not show that linear selection is universally inferior under every reconstruction or deployment protocol.

**Transfer, turbulence and SST.** Appendix I reports reconstruction results on numerically simulated Kolmogorov flow and Taylor–Green vortex, distinct from the four COMSOL geometry datasets. An ellipsoid-trained reconstructor tested on sphere increases 10%-random MSE from the sphere-trained 4.110 to 4.468, an 8.71% degradation. SST reconstruction uses an 80/10/10 split and 10% observed grid locations; its table reports DTA-GNN 6.853 versus DiffusionPDE 7.969, scaled by 10^-2, or 14.01% relative reduction. Main Section 5.2 dates the SST range December 1989–January 2023, while its data reference says subset 1990–2016; the exact processed range needs clarification.

**Ablations/resources.** Appendix K removes directional or difference features. Appendix L reports severe degradation from constrained-only initialization and smaller differences between penalized-only and two-stage variants. The displayed tables/plots do not state training-replicate counts or uncertainty calculations; the checklist's affirmative statistical-significance answer alone supplies neither. Hardware specifications list five server types with eight GPUs each, but do not assign precise total compute to each reported run. The DTA-GNN parameter table reports 266,260 parameters versus 315,412 for its MeshGraphNets baseline.

## Limitations

Simulated CFD observations do not establish robustness to noisy physical sensors; Appendix A acknowledges possible real-world degradation. The placement objective depends on a trained reconstructor and on the availability of representative complete fields to the policy. Boundary candidates, a fixed count, and geometry-specific experimental conditions restrict deployment claims. Theoretical qualifications below concern the printed probability model and guarantees, not a rerun or rejection of the empirical tables.

### Curator Analysis

**Sampling versus likelihood.** Section 4 defines independent Bernoulli variables conditioned on their sum. Equations 4–5 instead apply Gumbel top-m to log p_i, producing a weighted-without-replacement distribution. For n=2, m=1 and p=(0.8,0.2), the printed sampler selects the first node with probability 0.8. The claimed conditioned Bernoulli law selects it with probability 0.8×0.8/(0.8×0.8+0.2×0.2)=16/17. Thus the sampler and conditional-likelihood model are not generally identical. Exact cardinality still holds. This distinction matters for interpreting PPO ratios and cannot be resolved from the released reconstruction-only source.

**Penalty equivalence.** Proposition 3 and the following paragraph claim that Lipschitz reward suffices for equivalence to the constrained optimum for every positive penalty weight. A two-bit example violates that unrestricted assertion: let m=1, R(a)=a_1+a_2−2 and lambda=0.1. Feasible choices have penalized reward −1; the infeasible vector (1,1) has penalized reward −0.1 and is preferred. R is Lipschitz and nonpositive. A sufficiently strong penalty relative to reward changes could restore equivalence on this finite domain, but that is an additional condition, not the printed all-positive-lambda conclusion. This example does not evaluate the actual neural reward or chosen experimental coefficient.

**Saddlepoint qualifications.** Equation 7 prints the root equation as psi(t*)=m and the exponent as psi(t*)−k t*. The standard cardinality saddlepoint formula instead uses psi'(t*)=m and psi(t*)−m t*. Appendix D supplies derivatives but does not resolve those printed expressions through an executable policy implementation. Its linear-time statement assumes fixed precision and a bounded iteration count; quadratic Newton convergence is local and not a uniform runtime guarantee for all Bernoulli parameters.

Appendix E explicitly invokes a standard asymptotic regime for its relative-error estimate. It should not be read as a uniform O(1/n) guarantee over arbitrary learned probabilities. For example, with half of n probabilities equal to 1−1/n and half to 1/n, and target m=n/2, the variance stays near one. An exact convolution gives normalizer 0.465755 at n=10,000, while the mean saddlepoint estimate is 0.398962: the relative discrepancy remains about 14.34%. The example identifies missing nondegeneracy/regime conditions; it does not dispute saddlepoint asymptotics under their appropriate assumptions.

## Reproducibility

- All 25 publisher-PDF pages were read, including full references, checklist and scientific Appendices A–N. Twelve key pages were rendered and visually inspected, including the complete scientific formulas/proofs and all major result/ablation tables and SST visualizations. SHA-256: `a36f6d22ed3c94f48724ee320893905a7d3e2ea33df0ef9ee5fc8450efd68d3e`.
- Publisher metadata identifies NeurIPS 2025, DOI 10.52202/085713-3500 and proceedings publication date April 23, 2026. The PDF and author-repository citation name **Guancheng Wan**; the publisher HTML lists **Frank Wan**. This note follows the formal PDF and preserves the discrepancy instead of treating it as a ninth author.
- The publisher page offers the complete paper and no separate scientific supplement. Standard supplemental-PDF/ZIP endpoints return 404; exact-title OpenReview API v1/v2 queries return 403. These responses are cached, and the complete integrated appendix is read.
- The [author repository](https://github.com/RuoyanLi2002/Flow-Field-Reconstruction-with-Sensor-Placement-Policy-Learning), commit `ae1b4594c1da8c870233908bf61c73503b4d6b98`, contains 15 files, no scientific PDFs/archives/checkpoints, and external dataset links. Full `main.py`, `model.py` and `utils.py` were inspected; the other Python files are data preparation/statistics. Its current release implements reconstruction and has no identified PPO actor/critic, Gumbel constrained sampler or saddlepoint routine. It therefore does not independently reproduce the sensor-policy training. Its nearest-neighbor imputation also differs from the main text's stated randomly initialized unknown-node features.
- Exact finite probability/penalty examples, normalizer calculations and source hashes are saved in `research/full-text-review/sensor-placement-ppo/recompute_scope.py` and JSON. No CFD simulation, network training or sensor-placement benchmark was rerun. Complete bibliography review identified no supported existing-catalogue relation target; no generic GNN similarity edge is added.
