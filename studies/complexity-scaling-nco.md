---
id: complexity-scaling-nco
short_title: Complexity Scaling
title: Complexity Scaling Laws for Neural Models using Combinatorial Optimization
authors:
- Lowell Weissman
- Michael Krumdick
- A. Lynn Abbott
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/1c9dbe4d49fa0ac833959230a9895c06-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/1c9dbe4d49fa0ac833959230a9895c06-Abstract-Conference.html
institutions:
- Virginia Tech
- Kensho Technologies
scope: study
paper_type: analysis
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: Empirical scaling of separately trained neural TSP models across compute, model size, node count and dimension,
  with explicit fit and evaluation limitations.
code_url: https://github.com/lowellw6/complexity-scaling-laws
---

# Complexity Scaling Laws for Neural Models using Combinatorial Optimization

> **TL;DR:** On uniformly sampled Euclidean TSP, model and compute scaling reduce mean tour-length gaps, while larger node counts or dimensions degrade fixed-capacity models. These are selected finite-budget empirical fits; the authors' released SFT protocol evaluates on examples also used for training.

## Motivation

Model size and training compute do not specify the difficulty of a combinatorial task. The paper uses symmetric Euclidean TSP to vary two distinct axes: node count changes the tour space, whereas coordinate dimension changes the representation while leaving the number of tours fixed. It asks how nearly converged models behave as these axes grow, rather than proving a universal computational complexity law (PDF pp. 1–3).

## Contributions

The study reports power-decay fits for model size and training compute on 20-node, two-dimensional TSP; superlinear power-growth fits for node count; and bounded negative-exponential fits for spatial dimension. It releases 128 million two-dimensional instances with Concorde tours and additional approximate higher-dimensional reference tours. Separate theoretical results concern random-tour statistics and performance ceilings, and discrete local-search experiments offer a possible analogy for the neural trends (pp. 2–9, 25–28, 32–37, 44–53).

The work is an analysis of a controlled TSP family. Each model size, node scale, dimension and training regime has a separately trained model; this is not evidence for one checkpoint solving multiple combinatorial problems.

## Methodology

Coordinates are sampled independently and uniformly from the unit hypercube. Performance is the absolute difference between mean sampled model tour length and mean reference tour length, not a percentage gap or success rate. Evaluation samples one tour per instance. Parameter/compute experiments use twelve model sizes, roughly 60 thousand to 6 million parameters, at 20 nodes in two dimensions. Node experiments use 5–50 nodes in increments of five; dimension experiments use 2–12, 15, 20, 30, 40, 50 and 100 dimensions at 10 or 20 nodes. The dimension experiments use RL only and keep non-embedding capacity fixed; input embedding parameters can change with dimension (pp. 3–7, 25–28).

The policy is an autoregressive Transformer with a pointer head and a visited-node mask, simplified from the attention model. PPO uses a critic with compositional node-level targets, without an entropy bonus. Supervised training uses teacher-forced next-node likelihood and an optimal-cost critic to match the architecture. RL runs for one million updates; SFT uses one epoch, about 73 thousand updates. The schedules differ, and the plotted neural training compute does not include the separate cost of producing optimal labels (pp. 27, 29, 37–43).

Two-dimensional labels are generated with Concorde. Higher-dimensional references are the best tours found by 100 or 1,000 independent 2-opt descents for 10 or 20 nodes. These are approximate references, not certified optima. The two-dimensional distributional comparison and high-dimensional basin diagnostics provide empirical checks, but do not certify every higher-dimensional reference tour (pp. 32–37).

## Experiments

On selected nearly converged models, parameter decay exponents are approximately 0.582 for RL and 0.712 for SFT; compute-frontier exponents are 0.439 and 0.555. Node fits have exponents 1.86 and 1.69 with a fitted node offset of 4.99. Dimension fits approach estimated gap asymptotes of 0.0533 and 0.209 for the 10- and 20-node RL models. These values describe the fitted subsets and metric used here, rather than universal constants (Tables 1–3, p. 25).

The fit selection matters. Larger models that do not converge are excluded, but so is an unusually good roughly 168-thousand-parameter RL compute-frontier point; that exclusion is explicitly unrelated to convergence. The 50-node RL model, larger SFT node scales and some dimension-boundary models are also excluded. Main scaling grids use one training seed per scale; leave-one-out fits quantify sensitivity to points, not uncertainty across training seeds. A separate 30-node baseline ablation uses five seeds (pp. 25–28, 39).

The released training instructions explicitly state that SFT has no train/evaluation split: the first 10% of each 12.8-million-example dataset is evaluated after it was seen early in the one-epoch run. Thus the reported SFT curves do not establish held-out generalization or a held-out RL-versus-SFT advantage. The repository explains how to omit the first chunk for a future split, but that is a different protocol from the stated experiment ([training instructions](https://github.com/lowellw6/complexity-scaling-laws/blob/main/train/README.md)).

Depth-limited 2-opt and 2-exchange searches can exhibit similar scaling forms. This does not identify the neural policy's internal computation with local search. Unrestricted 2-opt does not reproduce the same node law, and the gap magnitudes differ (pp. 7–8, 32–34).

## Limitations

The study covers one iid Euclidean TSP distribution, finite training budgets and small node counts. Calling the models nearly converged approximates an infinite-compute experiment. The superlinear node-gap fit must eventually break because random-tour length and the largest possible tour length grow only linearly at fixed dimension; the suggested intersection near 40,000 nodes is an extrapolation, not an experiment. Dimension references can be suboptimal, especially at 20 nodes, and non-rejection by a two-sample test is not an optimality certificate. Tiny negative estimated gaps in small evaluation batches likewise do not imply beating a true optimum (pp. 6, 9–10, 28, 35–37).

Appendix I derives random-tour means, variance and high-dimensional limits under independent coordinate assumptions. These results constrain the random baseline, rather than prove the fitted neural exponents. In this review, the printed expectation/limit exchanges in the variance argument and the limit-existence step in the random-minus-optimal argument were not independently completed; this is a qualification of the presented derivations, not a counterexample to the stated limits. The authors explicitly leave strict positivity of the limiting random-tour gap unproved (pp. 44–53).

The non-held-out SFT protocol, one-seed grids, post hoc fit exclusions, approximate high-dimensional references and omitted label-generation compute should accompany any reuse of the empirical scaling comparisons.

## Reproducibility

The complete [53-page publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/1c9dbe4d49fa0ac833959230a9895c06-Paper-Conference.pdf), including all references, checklist and Appendices A–I, was reviewed. The [NeurIPS proceedings record](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1c9dbe4d49fa0ac833959230a9895c06-Abstract-Conference.html) has no separately linked scientific supplement.

The [author repository](https://github.com/lowellw6/complexity-scaling-laws) provides training, evaluation, fitting and data-generation instructions, along with links to [evaluation data](https://doi.org/10.7294/29374511), [training data](https://doi.org/10.7294/29374535) and [checkpoints](https://doi.org/10.7294/30359275). Appendices F–H report compute, architecture, hyperparameters and BOHB tuning. The repository's training instructions and relevant launch/data-generation code were inspected to check the evaluation protocol. Large datasets and checkpoints were not downloaded, and training or fitted results were not rerun.
