---
id: pointerformer
short_title: Pointerformer
title: 'Pointerformer: Deep Reinforced Multi-Pointer Transformer for the Traveling Salesman Problem'
authors:
- Yan Jin
- Yuandong Ding
- Xuanhao Pan
- Kun He
- Li Zhao
- Tao Qin
- Lei Song
- Jiang Bian
year: 2023
date: 2023-04-19
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/25982
arxiv_url: https://arxiv.org/abs/2304.09407
institutions:
- Huazhong University of Science and Technology
- Microsoft Research Asia
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: Pointerformer combines a reversible Transformer encoder, averaged pointer-head logits and partial-route
  context for autoregressive Euclidean TSP construction.
figure:
  path: paper-assets/pointerformer/framework.png
  alt: Pointerformer encoder with reversible attention blocks and a multi-pointer autoregressive decoder.
  caption: 'Figure 1: Overall encoder-decoder architecture of Pointerformer.'
  source_url: https://arxiv.org/pdf/2304.09407v1#page=4
publication:
  date: '2023-06-26'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/25982
code_url: https://github.com/Pointerformer/Pointerformer
---

# Pointerformer: Deep Reinforced Multi-Pointer Transformer for the Traveling Salesman Problem

> **TL;DR:** Pointerformer combines a reversible Transformer encoder, averaged pointer-head logits and partial-route context for autoregressive Euclidean TSP construction. It trains separate models up to 500 cities and transfers smaller models to TSPLIB, where substantial gaps remain on larger instances.

## Motivation

Attention-based routing policies face increasing training-memory use as instance size grows. Search-based methods can improve quality but add inference time. Pointerformer targets a constructive encoder-decoder with lower activation storage and a lightweight pointer mechanism, plus richer features and partial-tour context. Its demonstrated problem is two-dimensional Euclidean TSP; extension to constrained VRP is future work. [Introduction and Problem Formulation.](https://arxiv.org/pdf/2304.09407v1#page=1)

## Contributions

- Six reversible residual encoder layers reconstruct intermediate activations during backpropagation.
- Multiple projected query/key interactions are averaged into one next-city distribution.
- An enhanced query includes the embeddings of already visited cities in addition to graph and endpoint context.
- Feature augmentation concatenates eight symmetry-derived coordinate/angle views, and POMO-style multi-start learning normalizes per-instance returns. [Pointerformer Approach.](https://arxiv.org/pdf/2304.09407v1#page=3)

## Methodology

### Reversible encoding and two kinds of augmentation

Without positional encoding, the Transformer maps node features to embeddings. A reversible block splits its representation and computes `Y1=X1+MHA(X2)` and `Y2=X2+FF(Y1)`. In backpropagation the inputs can be reconstructed from the outputs, reducing stored activations at the cost of recomputation. This does not remove the attention operations' dependence on all city pairs or establish linear total memory in the number of cities. [Equations 4-5.](https://arxiv.org/pdf/2304.09407v1#page=4)

For each city, eight coordinate reflections/swaps each contribute a three-feature view, concatenated into 24 features. The released `utils.py:data_augment` computes each angular feature as **atan(y/x)**; this implementation detail clarifies the manuscript's poorly rendered angle expression. Feature concatenation within one city representation differs from **inference augmentation**, which runs the constructor on eight equivalent instances and selects the best result. [Encoder description and official implementation.](https://arxiv.org/pdf/2304.09407v1#page=3)

### Multi-pointer autoregressive decoding

The query combines the first and last visited-city embeddings with the sum of graph embeddings and the sum over the current partial route, normalized by total city count N. It therefore contains information about already visited nodes beyond only the two endpoints. Eight distinct query/key projections produce dot-product scores, which are averaged; subtracting the distance from the last city provides an explicit short-edge prior. Tanh clipping and visited-node masking yield one categorical next-city distribution. **Multiple pointers are scoring heads, not simultaneous choices of several city positions.** [Decoder and Equation 6.](https://arxiv.org/pdf/2304.09407v1#page=4)

A route is constructed one city at a time until returning to its start. POMO-style training samples N trajectories per instance from different starting cities and uses a shared mean-return baseline. The paper describes normalizing by a per-instance variance, whereas the official `train.py` divides by **population standard deviation plus 1e-8**. This distinction matters for reproduction; the manuscript's assertion about unbiasedness should not be treated as a proof that the finite-sample standardized policy-gradient estimator is unbiased. [Equation 7 and implementation.](https://arxiv.org/pdf/2304.09407v1#page=5)

Models are trained separately at 20, 50, 100, 200 and 500 nodes. Each epoch generates 100000 uniform unit-square instances. Sizes up to 200 use one V100 16GB and batch 64; the larger case uses four V100 32GB GPUs and batch 32. The paper uses Adam learning rate 1e-4, weight decay 1e-6, six encoder layers and eight attention/pointer heads of width 128. The released default config specifies 500 epochs, clipping 50, standard-deviation normalization, and eightfold/multi-trajectory evaluation. Those code defaults should remain distinct from quantities fully specified in the paper. [Hyperparameters and released config.](https://arxiv.org/pdf/2304.09407v1#page=5)

## Experiments

### Synthetic TSP

Table 1 evaluates **10000 instances at 20/50/100 cities and 128 at 200/500**, with Concorde reference solutions. Times cover the corresponding full dataset; they are not individual-route latencies. The Att-GCN+MCTS rows are imported from its paper and use its C++ search on eight CPU cores. [Table 1 and experimental discussion.](https://arxiv.org/pdf/2304.09407v1#page=6)

| Size | Pointerformer cost / gap / dataset time | Relevant comparison |
| --- | --- | --- |
| 100 | 7.77 / 0.16% / 52.34 s | POMO 0.16% / 2.17 min |
| 200 | 10.79 / 0.68% / 5.54 s | Att-GCN+MCTS 0.88% / 2.5 min |
| 500 | 17.14 / 3.56% / 59.35 s | Att-GCN+MCTS 2.54% / 5.9 min |

The size-500 model trades worse tour quality for a shorter listed time than the search baseline. The size-200 and size-500 main rows use models trained at those sizes; they are not zero-shot transfer from size 100. The tested POMO configuration's memory limitation is evidence about that implementation and setup, not a universal barrier for every attention-based constructor. Figure 2 reports a training-memory advantage over POMO at sizes 20-200, without implying that all runtime memory is constant. [Table 1 and Figure 2.](https://arxiv.org/pdf/2304.09407v1#page=6)

### TSPLIB and ablations

The appendix lists **49 TSPLIB instances** from 51 through 1002 nodes. Model100 and Model200 transfer without task-specific retraining. Table 2 reports group means:

| TSPLIB group | Model100 gap | Model200 gap | POMO gap |
| --- | --- | --- | --- |
| Up to 100 | 1.33% | 2.91% | 1.20% |
| 101-500 | 5.43% | 8.37% | 6.99% |
| 501-1002 | 18.65% | 18.20% | 26.93% |

Model100 is better in the middle group, Model200 in the largest, and POMO in the smallest. Thus the larger trained model does not uniformly transfer better. In the full table, Model200 is especially poor on d493 (80.81% versus Model100 18.57%); on pr1002 it improves Model100 but still has a 17.92% gap. These are meaningful generalization limits despite strong gains over some baselines. [Tables 2 and 4.](https://arxiv.org/pdf/2304.09407v1#page=7)

At size 200, removing feature augmentation changes the gap from 0.68% to 0.87%, removing partial-route context to 2.73%, and removing multiple pointer scores to 0.72%. The context change has the largest effect in this experiment. Separate clipping curves compare C values and favor sufficiently large settings in the authors' setup; these do not establish a universal optimal clipping parameter. [Table 3 and Figures 3-4.](https://arxiv.org/pdf/2304.09407v1#page=7)

## Limitations

### Reported by the Authors

- Large-instance solution quality can be worse than a search-based method even with improved inference efficiency.
- Extending the method to more complicated VRPs and other optimization problems is left for future work. [Experiments and Conclusion.](https://arxiv.org/pdf/2304.09407v1#page=6)

### Curator Notes

- **Specialist / constructive** follows task-specific TSP training and fresh autoregressive route generation; feature symmetry and cross-size transfer do not make a multi-problem shared solver.
- Activation recomputation reduces a particular memory cost but does not eliminate quadratic attention or multi-start/augmentation inference costs.
- The manuscript and implementation differ in return normalization and leave some evaluation details to code defaults. Reported times should be reproduced with explicit augmentation, start count and hardware.
- Source tables contain apparent transcription inconsistencies: Table 1 gives AM TSP100 cost 7.94 and gap 23.20%, and the rd100 AM+LCP row in Table 4 repeats an unrelated cost. These values are not silently corrected or used to support a numerical advantage in this note.

## Reproducibility

- **Reading:** all ten pages of arXiv v1 (19 April 2023) were reread, including the complete appendix table and four example-route figures. The formal AAAI page is bot-protected for direct access; its indexed publisher record lists the paper PDF and publication metadata. No additional missing scientific supplement is referenced by the manuscript or linked by the inspected author code page. The user-authorized author-version fallback is identified explicitly.
- **Metadata:** eight authors at HUST and Microsoft Research Asia match the title page. The publisher record and [publisher-deposited Crossref metadata](https://api.crossref.org/works/10.1609/aaai.v37i7.25982) give **26 June 2023**, volume 37(7), pages 8132-8140, distinct from February's conference and April's preprint. Generic notification-day acceptance metadata was removed.
- **Implementation:** the paper's p. 6 footnote directly links [Pointerformer/Pointerformer](https://github.com/Pointerformer/Pointerformer), correcting the old claim that no official repository was confirmed. Its README and relevant augmentation, return normalization, evaluation and default-config code were inspected. The README supplies model/data links and train/evaluate commands; experiments were not rerun. The default eightfold evaluation uses N starting trajectories; feature concatenation is a separate operation.
- **Image:** displayed complete Figure 1 is cropped from arXiv p. 4. Reversible equations, normalization, memory plot, result/ablation tables and all appendix route examples were visually checked.
