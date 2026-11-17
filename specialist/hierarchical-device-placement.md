---
id: hierarchical-device-placement
short_title: Hierarchical Placement
title: A Hierarchical Model for Device Placement
authors:
- Azalia Mirhoseini
- Anna Goldie
- Hieu Pham
- Benoit Steiner
- Quoc V. Le
- Jeff Dean
year: 2018
date: '2018'
publication:
  date: '2018'
  source_url: https://openreview.net/forum?id=Hkc-TeZ0W
venue: ICLR
paper_url: https://openreview.net/forum?id=Hkc-TeZ0W
institutions:
- Google Brain
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Device Placement
summary: A separately trained hierarchical policy jointly learns operation groups and device assignments from runtime
  feedback, avoiding manual grouping but requiring graph-specific hardware search.
---

# A Hierarchical Model for Device Placement

> **TL;DR:** Jointly learn operation grouping and group-to-device placement from measured execution time. A separate policy is trained for each graph; selected NMT workloads improve substantially, while the eight-layer NMT case is slower than human placement.

## Motivation

The earlier recurrent placer needs manually defined co-location groups to handle large TensorFlow graphs. Static cost-based partitioning also struggles with runtime variation in a shared hardware environment. A learned hierarchy aims to reduce the recurrent decision sequence while discovering finer-grained parallelism without manually defining those groups (Sections 1–2).

## Contributions

- A feed-forward Grouper assigns operations to groups and an attentional sequence-to-sequence Placer allocates those groups to devices; both are trained jointly with policy gradients.
- The method handles graphs with up to 83,712 operations without the previous method's manual co-location preprocessing.
- Experiments include alternative grouping architectures, runtime measurements and a limited-resource training analysis. “End-to-end” describes joint grouping/placement learning, not a shared policy across tasks: the paper explicitly trains a new policy for each target graph (p.8).

## Methodology

**Inputs and hierarchy.** Operation features include a 20-dimensional type embedding over 200 common operation types, bounded/padded output-shape features and BFS-indexed incoming/outgoing operation identifiers. A 64-hidden-unit feed-forward model independently samples group assignments. Group features aggregate operation types/shapes and group adjacency. A two-layer bidirectional LSTM encoder and autoregressive LSTM decoder, with hidden size 256 and attention, place the groups. Experiments use 256 possible groups after exploring 64–1,024; this is not a graph-invariant message-passing architecture (pp.2–3,6).

**Objective and updates.** Reward is negative square-root measured runtime for one forward pass, backward pass and parameter update. Joint REINFORCE gradients train group and device policies, using a moving-average baseline per controller. Device logits use temperature 10 and tanh constant 5. Invalid placements receive −10; after 500 updates only valid samples update policy and baseline. Adam uses learning rate 0.1, gradient clipping norm 1, one grouping sample and four placement samples. Early logit noise encourages exploration (pp.3–4,6, Equations 1–6).

**Runtime feedback and distributed search.** The principal measurement protocol executes ten steps, discards the first five and takes the median of the final five. Four GPU-hosted controllers and sixteen workers train asynchronously; a two-GPU placement experiment therefore consumes 36 GPUs including controllers. All reported main placements follow 1,000 policy updates, taking at most three elapsed hours on the largest benchmark. These costs are not included in Table 1's deployment step runtimes. A later overhead paragraph describes five measured steps without restating warmup; reproduction should retain this protocol distinction rather than silently assuming identical execution counts (pp.4,6,8).

## Experiments

**Environment and data.** TensorFlow r1.3 runs on one Intel Haswell 2300 CPU and up to eight Tesla K40 GPUs. Graphs include Inception-V3 with batch 1 and 24,713 operations, ResNet-152 with batch 128 and 20,586 operations, RNNLM with batch 64 and 9,021 operations, and two/four/eight-layer NMT graphs with 28,044/46,600/83,712 operations. Comparisons include CPU-only, GPU-only, Scotch, GPU-only Scotch/MinCut and published expert placements. These are neural-network application workloads for the same combinatorial placement task (pp.5–6).

**Table 1 results.** Two-layer NMT falls from the expert's 2.13 to 0.84 seconds per step, a reported 60.6% elapsed-time reduction; four-layer NMT falls from 3.64 to 1.69 seconds, 53.7%. Inception improves from roughly 0.15 to 0.13 seconds, with the paper reporting 16.3% from its underlying unrounded measurements. ResNet and RNNLM tie single-GPU/expert results at 1.18 and 1.57 seconds. Eight-layer NMT is worse: 4.07 versus 3.88 seconds, a 4.9% regression explicitly acknowledged in the paper. Thus “up to 60.6%” is a selected per-step improvement, not universal superiority or an observed reduction in complete target-model training time (pp.6–7).

**Prior RL comparison.** The prior ColocRL paper uses K80 GPUs and a different TensorFlow version, while this work uses K40/r1.3. The paper correctly says their absolute runtimes are not directly comparable. Its comparison of relative baseline improvements also depends on different environments and baseline values; it does not isolate a controlled same-stack improvement over the earlier implementation. The previous work's reported percentages use differing runtime/speedup conventions, so the prose's quoted 19.0% should not be treated as a harmonized NMT metric (p.7).

**Ablations.** An independent feed-forward direct placer finds single-GPU solutions for ResNet/RNNLM but fails to find valid placements for four/eight-layer NMT. Ten random-grouping trials show substantial variance and worse best results on Inception/NMT, but ResNet/RNNLM remain exact ties. Ten group-order shuffles on four-layer NMT differ by less than 7%, an empirical sensitivity result rather than permutation invariance (pp.8–9, Table 2).

**Limited resources and amortization.** One worker with four GPUs plus a controller reaches a four-layer NMT placement of 1.94 seconds in less than 2.5 hours, versus the main experiment's 1.69 seconds. The paper extrapolates savings over 562,500 target-training steps; it does not actually run that full epoch in this analysis. Its stated saving of “265 GPU-hours” equals about 265 elapsed hours from 562,500×(3.64−1.94)/3,600; charging all four worker GPUs would multiply that quantity by four. The stated 12.5 GPU-hours search cost does count five GPUs over 2.5 hours. These accounting units should be clarified before reusing the amortization claim (p.8, Figure 3).

## Limitations

### Discussed in the Paper

The eight-layer NMT placement underperforms the expert. Direct comparison to prior RL is limited by hardware/software differences, runtime measurements dominate training cost, and group ordering has measurable effects. Jointly interleaving placement search with target-network training is proposed for future efficiency; experiments first train the planner and then deploy its best placement (pp.7–9).

### Curator Notes

This is a specialist placement policy trained anew for each model/hardware setup. The independence of grouping decisions, truncated indexed features and fixed group count are modeling restrictions. No optimization or convergence guarantee is proved. Real-hardware search, invalid samples and resource counts matter when assessing total cost; per-step gains alone do not establish net savings for short jobs or unchanged-model transfer. Learned grouping removes manual co-location decisions, but still uses chosen features, architecture, group budget and search hyperparameters.

## Reproducibility

- **Formal identity:** [ICLR 2018 record](https://openreview.net/forum?id=Hkc-TeZ0W); the official ICLR 2018 download list includes this title. Google Research also lists the same six authors and ICLR 2018 under the alias [Hierarchical Planning for Device Placement](https://research.google/pubs/hierarchical-planning-for-device-placement/).
- **Read version:** the full eleven-page [Google Research archived PDF](https://storage.googleapis.com/gweb-research2023-media/pubtools/4317.pdf) is byte-identical to the Cambridge course reading copy used for this review. It retains “Submitted as a conference paper to ICLR 2018” headers, so it is described as an archived author manuscript rather than asserted to be the final OpenReview PDF. All pages, references, key formulas, tables and figures were reviewed.
- **Scientific supplements:** the author record exposes only the paper; the complete manuscript has no appendix or scientific supplement reference. Manual OpenReview forum/API/attachment discovery was blocked by HTTP 429/403 challenges. No separate scientific attachment was identified through the accessible author/conference sources; this is recorded as a discovery limitation rather than fabricated evidence of an attachment's contents.
- **Implementation:** no author-confirmed code link was exposed by the reviewed paper/author record. TensorFlow availability alone does not identify this experiment's training implementation.
- **Citation graph:** explicit citations to Pointer Networks, Bello et al.'s neural combinatorial optimization and the 2017 RL device-placement predecessor are matched to their actual bibliography entries, including the predecessor's printed author-order differences.
