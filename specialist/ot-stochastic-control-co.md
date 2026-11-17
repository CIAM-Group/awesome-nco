---
id: ot-stochastic-control-co
short_title: OT-Control CO
title: Optimal Transport–Guided Stochastic Control for Graph Combinatorial Optimization
authors:
- Yang Huang
- Yifan Zhang
- Jian Cheng
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/huang26bz.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/huang26bz.html
institutions:
- Chinese Academy of Sciences
- University of Chinese Academy of Sciences
- AiRiA
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Quadratic Unconstrained Binary Optimization
- Maximum Independent Set
- Maximum Clique
- Maximum Cut
summary: A GNN amortizes a Laplace-energy subproblem to guide projected stochastic
  sampling of exact multilinear QUBO relaxations; task-specific decoding produces
  discrete solutions.
code_url: https://github.com/mengxi7/Optimal-Transport-Guided-Stochastic-Control-for-Graph-Combinatorial-Optimization
---

# Optimal Transport–Guided Stochastic Control for Graph Combinatorial Optimization

> **TL;DR:** The method learns graph-conditioned sampling dynamics for multilinear QUBO energies. A GNN approximates a Laplace-energy minimizer and supplies drift for multiple projected noisy trajectories. Exactness of the continuous optimum does not make the finite neural sampler an exact optimizer, nor does the method exactly match an OT/Schrodinger-bridge target distribution.

## Motivation

MIS, MaxClique and MaxCut can be written as QUBOs. Replacing squared binary coordinates by their linear equivalents gives a multilinear extension over the unit cube that preserves the optimal value and admits a binary optimum. The landscape remains nonconvex. The paper therefore explores objective-aware sampling trajectories that can escape poor local solutions, motivated by the transport of probability mass from a simple initial distribution toward low-energy regions (Sections 1-4).

## Contributions

The paper combines the classical exact multilinear relaxation, an OT-inspired stochastic-control formulation and a GNN amortization of a Laplace subproblem. Proposition 3.1 has a short independent-Bernoulli expectation proof: every continuous energy is an average of binary energies, so extending the domain creates no optimal-value gap. Fractional minimizers can still exist. This result concerns the formulation, not the success rate or global optimality of the learned sampler.

The same method family is evaluated on MIS, MaxClique and MaxCut. Training is task/dataset specific, with different hidden dimensions for small and large graphs; a separate experiment transfers small-trained models to larger graphs. The paper does not establish one checkpoint trained jointly across all three tasks. It remains a specialist solver framework.

## Methodology

The target energy density is proportional to exp(-f). A terminal-energy stochastic-control objective balances drift effort against low-energy terminal states. Section 4.2 explicitly describes OT as a structural motivation: the practical objective replaces exact terminal-distribution matching, so it is not an exact standard OT/SB solver. Under the corresponding control/heat-kernel derivation, the ideal drift is a conditional-mean displacement divided by 1-t (Equations 9-12; Appendix C).

Computing that mean is difficult. The method substitutes a minimizer of L(t,x,y)=lambda_h f(y)+||x-y||^2/[4 epsilon(1-t)], then amortizes this subproblem with a five-layer GIN with virtual-node messages, residuals and LayerNorm. Inputs include the continuous state, a Bernoulli draw from it and time. Training minimizes this Laplace energy on detached rollout-buffer states; it does not differentiate through the state-distribution collection process. Inference uses projected Euler-Maruyama updates, multiple particles and a truncated time horizon. The main training setup uses 5,000 graphs, 100 epochs, eight particles, 20 rollout steps, epsilon=0.7 and delta=0.01 (Algorithms 1-2; Appendix E.3).

MIS is decoded by sorting node scores and greedily retaining a feasible independent set; MaxClique is treated as MIS on the complemented graph. The inspected public implementation instead uses threshold assignments for MaxCut, where either binary partition is feasible. This task-specific distinction matters: the text's generic greedy rule cannot be applied literally to unconstrained MaxCut, because it would keep adding every vertex.

## Experiments

MIS uses RB graphs with 200-300 or 800-1,200 vertices and ER graphs with 700-800 vertices and edge probability 0.15. MaxClique uses RB graphs, and MaxCut uses BA graphs with attachment parameter four. Test sets contain 500 RB/BA graphs or 128 ER graphs. PPO and RLNN are rerun under the authors' protocol; many other baseline values are taken from their source papers. Consequently the tables are not uniformly hardware- and budget-matched reruns (Section 5.1; Appendix E.2).

The two main sampler budgets are 500 steps by 64 particles and 100 steps by 20 particles. The larger budget reports MIS sizes 20.12/39.25/43.41 on small RB/large RB/ER, with times 6.381/9.93/7.934 seconds. It improves over several learned baselines, but large-RB SDDS reports 39.32 and KaMIS 43.15; this is not a universal quality win. Many baselines are faster. On large RB MaxClique the larger budget reaches 40.52, versus RLNN 35.23. Large BA MaxCut reaches 2965.94, versus DiffUCO 2947.53, with a substantially larger reported time budget (Tables 1-2).

Increasing particles or steps improves the plotted average best-so-far MIS quality at additional cost. A 20-step neural ablation attains Laplace energy -19.13 versus -15.53 for a 500-step normalized projected-NAG baseline; step counts alone are not equal wall-clock cost. Appendix E.5 compares RLSA at matched step and particle counts, which similarly does not establish equal per-step computation. Small-to-large transfer at 100-by-20 retains 98.50%, 93.64% and 98.25% of the corresponding large-trained MIS/MaxClique/MaxCut objectives. These ratios compare learned models, not optimality gaps (Tables 3 and 5; Figures 2-3).

## Limitations

The authors explicitly give no global-optimality guarantee. Laplace approximation, imperfect GNN minimization, replay-distribution shift, time discretization and decoding can all introduce error. More particles or steps consume additional inference time; distribution and size transfer can degrade. The reported means do not include confidence intervals or repeated-training uncertainty. The ideal continuous-control representation should not be identified with the finite projected, truncated neural process without additional boundary and approximation analysis.

### Curator Notes

Several printed details need care in reproduction. Appendix B.1 Equation 19 minimizes positive x^T L x for a standard graph Laplacian; maximizing a cut requires the opposite sign. For a single positive edge, the printed minimization prefers equal endpoint labels, so an additive constant cannot fix it. The symmetric MIS/MaxClique matrices in Equations 21/23 also double the coefficient relative to a sum over unordered edges. The public objective code uses negative cut value and a half factor for duplicated directed edge lists, and its MaxCut decoder is threshold based. These are print/implementation distinctions, not evidence that the reported experiments optimized the wrong objective.

Appendix D writes q proportional to exp(-L/(2 epsilon)), whereas Equations 12-13 imply exp(-L) for the stated L. Its concentration-to-a-minimizer-set discussion also does not by itself justify replacing a multimodal mean by any single representative mode. The MAP substitution remains an approximation with no reported finite-error guarantee. Appendix C uses a free Gaussian heat kernel while describing a cube state space; a state-boundary convention or a terminal-only restriction is needed to identify its exact stochastic process. None of these qualifications changes the valid Bernoulli-expectation proof of multilinear optimal-value exactness.

## Reproducibility

- [ICML 2026 proceedings](https://proceedings.mlr.press/v306/huang26bz.html), PMLR 306:48274-48292: all 19 pages, the complete bibliography and Appendices A-E were read. The HTML supports the retained September 29 publication date. Eight key formulation, proof and result pages were visually checked.
- The publisher lists no separate supplement. OpenReview forum `Pf2erYy0yY` API v1/v2 both returned 403. The [first author's homepage](https://mengxi7.github.io/) identifies the implementation repository; its additional June 24, 2026 preprint was downloaded, registered and read in full, including all 19 pages. It has reflowed main-text pagination and the same scientific appendices.
- [Author-linked code](https://github.com/mengxi7/Optimal-Transport-Guided-Stochastic-Control-for-Graph-Combinatorial-Optimization), revision `cf35b6bed53b3cbbb09e89e80c06c046062dfdfd`, contains 15 files including that preprint. README and the complete objective, decoding, sampler, training, CLI and evaluation modules were read. Datasets and trained weights are not in that tree. Example defaults differ from the paper's epochs, particles and penalties, and the loss supports an additional diversity penalty. The evaluation timer surrounds sampling and excludes the subsequent decoding loop; these current-source facts should not be assumed to reproduce the printed benchmark numbers directly.
- No training, sampling benchmark or solver experiment was rerun. Thirteen exact existing-paper references are registered. The related-work phrase “Pointer Networks (Bello et al., 2017)” is a mismatched attribution; its complete reference identifies the Bello RL paper, so no unsupported edge to the separate Pointer Networks paper is added.
