---
id: pointer-networks
short_title: Ptr-Net
title: Pointer Networks
authors:
- Oriol Vinyals
- Meire Fortunato
- Navdeep Jaitly
year: 2015
date: 2015-06-09
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2015/hash/29921001f2f04bd3baee84a12e98098f-Abstract.html
arxiv_url: https://arxiv.org/abs/1506.03134
institutions:
- Google Brain
- University of California, Berkeley
figure:
  path: paper-assets/pointer-networks/framework.png
  alt: Sequence-to-sequence and Pointer Network architectures comparing fixed-vocabulary and input-position outputs.
  caption: 'Figure 1: Sequence-to-sequence model and Pointer Network architecture.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Geometry
problems:
- Traveling Salesman Problem
- Convex Hull
- Delaunay Triangulation
summary: A supervised recurrent pointer decoder constructs variable-size geometric outputs, with task-specific training
  and documented limits in exact recovery and TSP extrapolation.
publication:
  date: '2015'
  source_url: https://proceedings.neurips.cc/paper/2015/hash/29921001f2f04bd3baee84a12e98098f-Abstract.html
inclusion: main
paper_type: solver
---

# Pointer Networks

> **TL;DR:** Ptr-Net predicts a distribution over input positions, allowing a recurrent sequence model to construct variable-size geometric outputs. Its supervised experiments establish this representation, while showing substantial limits in exact recovery and TSP extrapolation.

## Motivation

A conventional sequence decoder has a fixed output vocabulary. A geometric instance with `n` points instead needs output symbols that refer to those particular `n` inputs; a different instance size changes the available symbols. Predicting coordinates directly would not ensure that a prediction identifies an actual input point. The paper replaces the fixed vocabulary with an attention distribution over encoder positions. [Sections 1–2, PDF pp. 1–4](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=1).

## Contributions

- An attention-based output layer produces pointers to input elements instead of using attention only to form a context vector.
- A common architecture is evaluated on planar convex hulls, Delaunay triangulations, and Euclidean TSP. This is architectural reuse with task-specific training; the paper does not establish one checkpoint that solves all three tasks.
- Models trained on varying input sizes can be applied to unseen sizes. The experiments quantify where geometric coverage remains useful and where exact correctness or tour quality deteriorates. [Contribution list, PDF p. 2; Sections 4.2–4.4, pp. 6–8](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=2).

## Methodology

Let `P=(P_1,...,P_n)` be input coordinates and `C` a sequence of input indices describing a solution. An LSTM encoder produces states `e_j`; an LSTM decoder produces state `d_i` for output step `i`. The pointer scores are:

```text
u_ij = v^T tanh(W_1 e_j + W_2 d_i)
p(C_i = j | C_<i, P) = softmax_j(u_i)
```

The normalization has `n` entries because it ranges over input positions. The parameters are shared over positions, so changing `n` does not require changing the output layer. The selected point's coordinates become the next decoder input. Unlike the attention baseline, this pointer layer does not use the scores merely to average encoder states. Training maximizes the likelihood of demonstrated output sequences, factorized over output steps. For outputs with linear length, attention gives the model quadratic inference complexity in `n`. [Sections 2.1–2.3, PDF pp. 2–4](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=3).

Solution serialization is part of the learning setup. Convex hulls begin at the hull point with the lowest input index and proceed counterclockwise. Delaunay triangles are ordered by incenter coordinates, and each triangle uses increasing vertex indices. TSP demonstrations begin at the first city. These conventions reduce ambiguity among equivalent targets. [Sections 3.1–3.3, PDF pp. 4–5](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=4).

Inference uses beam search. For TSP, the search is constrained to valid tours, preventing repeated or omitted cities; feasibility is therefore not guaranteed by the pointer output layer alone. Convex hull and triangulation decoding are reported without that tour constraint. [Section 4.4, PDF p. 8](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=8).

## Experiments

**Data and training.** Inputs are uniformly sampled points in the unit square. The setup uses one million training pairs, single-layer LSTMs with 256 or 512 hidden units, batch size 128, SGD at learning rate 1.0, and gradient clipping at norm 2.0. Training generally converges after 10–20 epochs. Exact TSP demonstrations use dynamic programming up to 20 cities; 50-city demonstrations come from heuristics. [Sections 3 and 4.1, PDF pp. 4–6](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=5).

| Experiment | Reported evidence | Interpretation |
| --- | --- | --- |
| Convex hull, trained and tested at 50 points | Ptr-Net: 72.6% exact accuracy and 99.9% area coverage; attention baseline: 38.9% and 99.7% | Near-complete area does not mean an exactly correct hull. |
| Convex hull, trained on 5–50 points and tested at 500 | 1.3% exact accuracy and 99.2% area coverage | Extrapolation preserves much of the area while exact recovery degrades sharply. |
| Delaunay triangulation, 50 points | No exactly correct triangulation; 52.8% triangle coverage | Partial structural accuracy must be distinguished from solving the instance correctly. |
| TSP, trained on 5–20 cities and tested at 20 | Mean tour length 3.88, versus optimum 3.83 | Small-instance approximation is promising but not exact. |
| TSP, trained on 5–20 cities and tested at 50 | Mean tour length 7.66, versus 5.79 for heuristic A3 | This training regime does not extrapolate reliably to 50-city TSP. |

The values above are from Table 1, Section 4.3, and Table 2, respectively. For 50-city TSP, the paper does not report an optimal reference length. Training on A1 demonstrations produces length 6.42 against A1's 6.46, but this does not outperform the stronger A3 baseline. [PDF pp. 7–8](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=7).

The reviewed paper does not provide a reproducible beam width or a hardware-matched runtime comparison. Its reported quadratic network complexity is not a complete measured search-time budget.

## Limitations

### Discussed in the Paper

- Input order affects recurrent processing; target order also affects triangulation learning. Section 3.2 leaves better target ordering as future work.
- Exact triangulation quality deteriorates with size. TSP extrapolation degrades substantially beyond the training range.
- Unconstrained TSP decoding can be infeasible: the paper reports failure rates of 35% at 30 cities and 98% at 40 for the extrapolation setting, motivating tour-constrained beam search.
- Some simpler settings show overfitting despite the large training set. [Sections 3.2 and 4, PDF pp. 5–8](https://proceedings.neurips.cc/paper_files/paper/2015/file/29921001f2f04bd3baee84a12e98098f-Paper.pdf#page=5).

### Curator Notes

- Shared architecture and shared hyperparameters do not establish a generalist checkpoint. This note remains a specialist constructive-method entry.
- An input-dependent output dictionary removes a representation restriction; it supplies neither an optimality guarantee nor unrestricted size generalization.
- Coverage metrics, exact accuracy, valid-tour rate, and objective quality measure different outcomes and should not be conflated.

## Reproducibility

- **Formal record:** [NIPS 2015 proceedings](https://proceedings.neurips.cc/paper/2015/hash/29921001f2f04bd3baee84a12e98098f-Abstract.html). The historical conference name is NIPS; the repository uses the normalized venue label NeurIPS.
- **Reviewed version:** The publisher's nine-page PDF, including all 21 bibliography entries. The publication page does not link a separate supplement.
- **Preprint:** [arXiv:1506.03134](https://arxiv.org/abs/1506.03134), first submitted 9 June 2015. The current preprint was revised in 2017; the formal proceedings version is the basis of this note.
- **Implementation:** No author-maintained Ptr-Net implementation is identified in the reviewed paper. Its three linked GitHub repositories are TSP baseline implementations, not an official implementation of the learned model.
- **Audit trail:** [Full-text review record](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/pointer-networks.json). No bibliography entry in this reviewed version matches another paper in the frozen repository collection; incoming citations are established when the citing papers are reviewed.
