---
id: principled-co-relaxation
short_title: Principled CO Relaxation
title: Unsupervised Learning for Combinatorial Optimization with Principled Objective Relaxation
authors:
- Haoyu Peter Wang
- Nan Wu
- Hang Yang
- Cong Hao
- Pan Li
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/cbc1ad2066f0afebbcea930c5688fc1f-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/cbc1ad2066f0afebbcea930c5688fc1f-Abstract-Conference.html
institutions:
- Purdue University
- University of California, Santa Barbara
- Georgia Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Constrained Design
problems:
- Maximum Clique
- Feature-based Edge Covering
- Feature-based Perfect Matching
- Circuit Resource Allocation
- Approximate Computing
summary: Entry-wise concave objective and constraint relaxations support nonincreasing deterministic rounding; learned
  proxies enable specialized graph and hardware-design optimization.
code_url: https://github.com/Graph-COM/CO_ProxyDesign
---

# Unsupervised Learning for Combinatorial Optimization with Principled Objective Relaxation

> **TL;DR:** Train a network to output relaxed binary decisions, then round coordinates while controlling an entry-wise concave penalized objective. For expensive black-box design tasks, learn constrained proxy functions first. Solver training avoids optimal-solution labels, while proxy training still uses supervised objective/constraint evaluations.

## Motivation

A differentiable surrogate can fit discrete data yet have a continuous landscape whose optimized soft decisions round poorly. The paper seeks a structural condition connecting relaxed losses to the quality of discrete outputs, especially when expensive simulations require learned objective proxies (Sections 1-3).

## Contributions

The framework uses entry-wise concavity: with all other coordinates fixed, the relaxed function is concave in each binary-decision coordinate. Sequentially choosing the better endpoint cannot increase the penalized relaxed loss. The paper also gives a multilinear extension for any finite binary-input function; this is an existence construction with potentially exponentially many terms, not an efficient universal neural representation.

For proxy-based optimization, AFF and CON architectures combine graph-derived coefficients with relaxed decisions. Separate specialized solver/proxy models are evaluated on maximum clique, image-feature edge covering/perfect matching, FPGA resource allocation and approximate-computing assignment. The work remains a specialist method framework; no single checkpoint is shown to solve all these domains.

## Methodology

A solver network predicts soft decisions in [0,1]^n and minimizes f_r + beta*g_r. The normalized discrete constraint has g>=0 and feasibility g<1. Rounding compares the two endpoints of one coordinate at a time while fixing the others. The exact-objective argument requires the relaxations to match the discrete objective and constraint at binary vertices; approximate proxy fitting alone does not establish this premise.

The AFF proxy is linear in graph-conditioned first-/second-order decision features. The CON proxy takes a nonnegative weighted sum of negative ReLUs of entry-wise affine features, preserving entry-wise concavity. A separate GNN learns the relaxed solver. For proxy tasks, costs/constraints are first fitted to sampled decision/configuration evaluations; the subsequent solver optimization uses no optimal decision labels. Explicit constraints can instead be relaxed analytically.

The theoretical rounding statement is conditional on suitable penalties and a soft loss below beta. It does not prove that gradient training reaches this threshold or a global optimum. For learned hardware constraints, feasibility under the approximate proxy need not imply feasibility under actual synthesis; experiments therefore evaluate actual HLS outcomes.

## Experiments

On maximum clique, Table 2 reports AFF approximation rates 0.926 +/- 0.113 on Twitter and 0.787 +/- 0.065 on RBtest, close to the EPM baseline's 0.924 and 0.788. The deliberately altered Badloss relaxation performs worse. The experiment supports the measured relaxation comparison, not a universal claim that every unsupervised model outperforms reinforcement learning.

The image-based graph experiment uses 4-by-4 grids and 24 edge decisions, learned visual cost proxies, 100,000 sampled proxy-training/validation pairs and 500 test configurations. AFF obtains costs 44.55 for edge covering and 418.96 for matching, versus brute-force references 42.69 and 416.01. CON gives 49.59 and 422.47; AFF is stronger on these reported tasks (Table 4).

FPGA experiments use 40 training/validation data-flow graphs with 200 sampled mappings each, plus 20 test graphs. Assignments allocate DSP/LUT resources; the goal is lower actual LUT use under DSP limits. In the final main paper, CON has mean rank 2.35 across the displayed 40-70% DSP thresholds, versus 2.87 for Gumbel-softmax plus rounding, 3.16 for RL, 2.95 for GA and 3.60 for simulated annealing. CON is not best at every threshold. The main paper compares a GPU-parallel GA with matched inference time; the supplement retains an older population setting.

Approximate-computing experiments assign at least 3/5/8 imprecise units in 15-node computation graphs, minimizing expected output error. Main Table 5 gives AFF errors 3.10/5.38/10.04, CON 3.18/5.13/10.17 and brute-force references 2.77/4.74/8.56. These are error measurements, not direct energy-saving measurements. The supplement reports three seeds and distinguishes proxy-data counts from smaller solver-training configuration sets. Its older RL/rank numbers are not substituted for the final main tables.

## Limitations

Proxy error and distribution shift can undermine the real-task meaning of an improved relaxed loss. Entry-wise concavity controls rounding but does not remove local optimization difficulty, simulation-data costs or the gap to an optimal discrete solution. Explicit multilinear extension can be exponential, and the constructive small-network universal-representation proposition concerns only two binary variables.

### Curator Notes

The printed Theorem 1 and proof require qualification. The proof uses nonnegativity of f over all rounded binary candidates, whereas the main statement only explicitly assumes nonnegativity on the feasible set. For n=1, let g(x)=x, f(x)=-2x, feasible set {0}, beta=1 and soft x=0.5. Both relaxations are affine and the printed feasible-set assumptions hold, but loss=-0.5 rounds to infeasible x=1. A sufficient global nonnegativity/penalty condition must therefore be stated when using this argument. Moreover, rounding establishes a non-strict bound; f=g=0 gives equality, contradicting the statement's literal strict inequality. The valid core nonincrease argument is distinct from these printed boundary issues (main page 5; supplement page 15).

Main Equation 8 prints a product over all adjacent-edge pairs for the matching penalty. Taken literally, this misses two selected edges at a degree-four vertex and repeats powers of variables. On a 4-by-4 grid, take the horizontal perfect matching in every row and add the vertical edge between positions (2,2) and (3,2): the printed penalty remains zero although the result is not a matching. The inspected implementation instead uses a sum of pairwise conflicts, consistent with the intended constraint. This is a printed-formula/code distinction, not evidence that the experiments implemented the product.

The older supplement also gives integer 1-100 inputs with some repeated operands for approximate computing, while the final main text describes continuous inputs in [0,10]. Its constraint normalization uses inconsistent t/t+1 notation. Reproduction should resolve the data generator and revision rather than silently combining these descriptions.

## Reproducibility

- [NeurIPS 2022 proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/cbc1ad2066f0afebbcea930c5688fc1f-Abstract-Conference.html), DOI 10.52202/068431-2280: all 15 main-paper pages and all 27 pages of the publisher ZIP's scientific PDF were read, including the older repeated manuscript, full proofs, references and Appendices A-E. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2022/hash/cbc1ad2066f0afebbcea930c5688fc1f-Abstract-Conference.html) explicitly records `citation_publication_date` as **2022-12-06**, independently of any paper-specific acceptance date.
- The supplemental ZIP has nine top-level and 2,197 recursive entries, including nested code. One actual scientific PDF was read; its tiny AppleDouble metadata sidecar is not a second scientific document. All archive README instructions were read and no further scientific PDF/video was found. Both OpenReview title-query APIs returned 403.
- The [official repository](https://github.com/Graph-COM/CO_ProxyDesign), inspected at `33756550bfa69ae8c91b6ef37c1e257feb3f9c20`, contains 4,045 files and no separate PDF/ZIP. README/environment instructions and selected constraint/generator code were checked. In particular, the matching loss computes a pairwise quadratic sum, differing from printed Equation 8.
- Key mathematical, architectural and empirical pages were visually checked. Full training, HLS and dataset regeneration were not run. Exact body/reference matches to 21 existing papers are recorded separately from methodological similarity.
