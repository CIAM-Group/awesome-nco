---
id: neural-set-function-extensions
short_title: Neural SFE
title: 'Neural Set Function Extensions: Learning with Discrete Functions in High Dimensions'
authors:
- Nikolaos Karalias
- Joshua W. Robinson
- Andreas Loukas
- Stefanie Jegelka
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/6294a235c0b80f0a2b224375c546c750-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/6294a235c0b80f0a2b224375c546c750-Abstract-Conference.html
institutions:
- EPFL
- Massachusetts Institute of Technology
- Genentech
- Roche
scope: study
paper_type: theory
problem_families:
- Differentiable Optimization
- Graph Optimization
problems:
- Set Function Optimization
- Maximum Clique
- Maximum Independent Set
- k-Clique Decision
summary: A general set-function-extension framework lifts discrete objectives into richer continuous neural representations.
---

# Neural Set Function Extensions: Learning with Discrete Functions in High Dimensions

> **TL;DR:** Continuous extensions express a set-function value as a weighted combination of discrete evaluations; a matrix-valued lifting lets neural embeddings remain high-dimensional. The work supplies a loss/layer framework with separate task experiments, not one jointly trained generalist solver.

## Motivation

Discrete set functions are hard to insert into gradient-based neural computation. Replacing each item by one scalar can also discard the high-dimensional representations used by the upstream network. The paper seeks extensions that agree on discrete inputs, permit differentiation and can operate on richer vector embeddings while keeping the number of discrete function calls manageable.

## Contributions

- Organizes scalar extensions through distributions on subsets whose expected indicator vector is the continuous input, connecting familiar Lovász and multilinear extensions with task-specific variants.
- Uses an SDP-inspired matrix formulation to construct neural counterparts of scalar extensions and analyzes support and evaluation cost.
- Studies unsupervised clique/independent-set learning, k-clique decision, classification training losses and the effect of embedding dimension/eigenvector truncation.

## Methodology

A scalar extension chooses nonnegative coefficients `p_x(S)` summing to one and satisfying `sum p_x(S)*1_S = x`, then evaluates `F(x)=sum p_x(S)*f(S)`. On discrete indicators it must agree with the original function, with continuity required for the core definition. A small support gives efficient evaluation; Lovász uses nested level sets, whereas the general multilinear extension has exponentially many supported sets unless its objective admits a special closed form. The framework requires access to `f`, not a free polynomial-time oracle for every hard function.

Proposition 1 proves equality of **global** minimum values and places global extension minimizers in the convex hull of discrete minimizers. Its proof uses the convex-combination representation. Despite the phrase “no bad minima,” the stated result does not rule out suboptimal local minima, stationary points or traps after composing the extension with a nonconvex neural network. Selecting the best supported set gives a discrete value no worse than a true normalized expectation, but it need not recover a globally optimal set.

The neural construction embeds sets as indicator outer products and combines scalar distributions on vector components, evaluating intersections `S ∩ T`. The LP/SDP formulations are analytical devices; the proposed closed-form extensions do not require an LP/SDP solver inside each training forward pass. Appendix D's construction uses normalized nonnegative component weights and addresses continuity under distinct eigenvalues and an eigenvector sign convention. Eigenvectors are mapped into the scalar domain using a sigmoid in the exposition, while practical variants also evaluate outside that domain. These domain/normalization conventions matter; the theorem should not be described as an unconditional guarantee for every PSD matrix or arbitrary numerical eigendecomposition.

In the experiments a GNN returns node embeddings and forms their Gram matrix. The neural Lovász implementation retains four leading eigenvectors, approximated by five power-method iterations rather than the numerically unstable eigensolver tested by the authors. With `k` retained vectors, its function-call cost is `O(kn)` versus `O(n)` for scalar Lovász; a general support may require pairwise intersections. Truncation and numerical approximation are practical choices rather than exact evaluations of the full idealized construction.

Not every presented variant satisfies all core conditions unchanged. Appendix C.2 notes a boundary-continuity limitation for the bounded-cardinality construction; the singleton variant is not dual-LP feasible and its separate global-minimum argument assumes a negative, unique discrete minimum. These exceptions should accompany uses of those variants.

## Experiments

Unsupervised graph experiments use ENZYMES, PROTEINS, IMDB-BINARY, MUTAG and the first 1,000 COLLAB graphs, with a common GAT/gated-convolution backbone family. Training is objective-based; exact labels are unnecessary for training the solver, while Gurobi provides reference clique/independent-set sizes for evaluation. The supplement replaces the simple feasible-set-size descriptions in the main text with the density-based objectives actually used for stable training; REINFORCE additionally receives problem-specific normalization/filtering modifications.

| Selected Table 1 result | Scalar Lovász | Neural Lovász | Erdős baseline |
| --- | ---: | ---: | ---: |
| PROTEINS maximum clique | 0.778 | 0.926 | 0.905 |
| ENZYMES maximum independent set | 0.311 | 0.775 | 0.821 |
| COLLAB maximum independent set | 0.302 | 0.392 | 0.886 |

Scores are mean achieved objective/optimal objective over test graphs, so larger is better. Reported deviations describe variation across test graphs, not repeated-seed confidence intervals. Neural Lovász improves its scalar counterpart in eight of ten graph-task/dataset comparisons, but it is weaker in several independent-set cases and is not universally best against Erdős or other estimators.

Cardinality-aware extensions improve F1 in k-clique decision on ENZYMES/PROTEINS, illustrating the value of task-specific support. Image experiments use separate ResNet-18 classifiers on CIFAR10, SVHN and tinyImageNet. Singleton loss tracks numerical training error closely; test accuracy is broadly comparable to other losses, without a claimed generalization or calibration guarantee. Eigenvector ablations show performance saturation around four components and approximately linear runtime growth in the retained count on the tested datasets.

The graph training search varies batch size 4/32/64, depth 6/10/16 and width 64/128/256, for 200 epochs with Adam at initial learning rate `1e-4`. Each run uses one RTX 2080 Ti. The main text and supplement disagree about the order of validation/test fractions: 60/30/10 is labeled train/test/val in the main text but train/val/test in the supplement. Moreover, the supplied code's `get_loaders` reserves `floor(0.3*num_trainpoints)` for validation after taking 60% for training, giving approximately 60%/18%/22%. The released code and prose therefore cannot be treated as one confirmed split protocol without further author clarification; no rerun was performed to resolve which generated the published table.

## Limitations

### Discussed in the Paper

- Very large ground sets remain a scaling challenge; localized extensions are proposed as a possible direction.
- Eigenvalue separation is needed in the discussed continuity argument, and practical truncation trades cost against fidelity.
- Different discrete objectives and gradient-estimator baselines show substantial stability differences.

### Curator Notes

- A valid extension and equality of global optima do not make arbitrary discrete optimization tractable or guarantee successful network training.
- Structural assumptions, normalization, approximate eigenvectors, boundary behavior and the singleton exception must accompany theoretical descriptions.
- Different problems/datasets use separately trained networks and hyperparameter selection. A reusable extension family is not evidence for one generalist checkpoint.
- Published split descriptions and released loader code conflict. Numeric results above are attributed to the paper, not independently reproduced or silently repaired.

## Reproducibility

- **Publication:** [Official NeurIPS 2022 proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/6294a235c0b80f0a2b224375c546c750-Abstract-Conference.html). The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2022/hash/6294a235c0b80f0a2b224375c546c750-Abstract-Conference.html) explicitly records `citation_publication_date` as **2022-12-06**, independently of any paper-specific acceptance date.
- **Reviewed sources:** All 15 main-paper pages and all 21 pages of `lovasz_neurips2022_supp.pdf` inside the [official supplement ZIP](https://proceedings.neurips.cc/paper_files/paper/2022/file/6294a235c0b80f0a2b224375c546c750-Supplemental-Conference.zip), including both complete reference lists, dual derivations, every proof and experiment detail. Key equations, figures, global-minimum proof and implementation pseudocode were checked visually.
- **Code availability:** The same ZIP contains `code_SFE.zip`, an anonymous PyTorch/PyG code package with objective/extension modules, experiment scripts and data. Its complete nested member inventory contains no further scientific PDF. Loader lines 241-254 were inspected to document the split discrepancy; code and pickled data were not executed. An external official implementation URL is not asserted.
- **Reading map:** Main Sections 3-4 define scalar/neural extensions; 5 reports tasks/ablations. Supplement A derives LP/SDP duals; B proves the global-minimum statement; C-D give variant/lifting proofs; E-G give the actual training protocol; H provides pseudocode and I discusses scale. This audit verifies reported claims and limitations, not experiment reproduction.
