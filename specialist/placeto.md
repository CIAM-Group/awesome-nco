---
id: placeto
short_title: Placeto
title: Learning Generalizable Device Placement Algorithms for Distributed Machine Learning
authors:
- Ravichandra Addanki
- Shaileshh Bojja Venkatakrishnan
- Shreyan Gupta
- Hongzi Mao
- Mohammad Alizadeh
year: 2019
date: '2019'
publication:
  date: '2019'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/71560ce98c8250ce57a6a970c9991a5f-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/71560ce98c8250ce57a6a970c9991a5f-Abstract.html
institutions:
- Massachusetts Institute of Technology
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Placement
problems:
- Device Placement
summary: A graph-based iterative placement policy transfers within trained computation-graph families; simulator
  training, manual grouping and nonuniform sample/runtime gains limit broader claims.
code_url: https://github.com/aravic/generalizable-device-placement
---

# Learning Generalizable Device Placement Algorithms for Distributed Machine Learning

> **TL;DR:** Placeto learns a graph-based policy that revises node placements and transfers to unseen computation graphs from the same trained family. Training uses a profiled simulator; runtime and sample-efficiency gains are task-dependent rather than universal.

## Motivation

Earlier placement policies often search anew for every input graph. That overhead is costly during model development or when the hardware environment changes. Placeto aims to learn a placement-improvement policy reusable within a distribution of related computation graphs (Sections 1–2).

## Contributions

- Formulate placement as sequential revisions of a complete current assignment, rather than constructing a whole answer from an empty state.
- Encode graph structure through shared, bidirectional message passing and pooled parent/child/parallel-node summaries.
- Demonstrate zero-shot transfer within three graph families, along with single-graph placement comparisons, traversal-order tests and architecture/reward ablations. “Generalizable” concerns new instances of device placement, not one model solving different native combinatorial tasks.

## Methodology

**State and action.** Nodes are predetermined operation groups. Features encode measured operation runtime, output tensor sizes, current device, current-node flag and visited flag. Each action reassigns the current node to a device. An episode visits each node once or twice, starting from an arbitrary complete placement. REINFORCE with time-dependent baselines trains the policy; intermediate rewards are runtime improvements, with an alternative terminal negative-runtime reward (Section 2.1; supplement A.1,A.7).

**Graph policy.** Separate top-down and bottom-up message functions aggregate neighborhood information with shared MLPs. Additional learned sums summarize nodes that can reach the current node, are reachable from it or are parallel to it. These summaries and the current-node embedding feed a device softmax. Small networks use eight-dimensional embeddings, two hidden layers of eight units for message/aggregation functions and sixteen-unit policy layers. Four or eight message rounds work best in the reported settings. Structural aggregation avoids arbitrary node-index features, but sequential decisions still have traversal-order sensitivity (Section 2.2; supplement A.7).

**Grouping and feedback.** The method retains manual co-location based on the prior placer and merges small-output groups with neighbors. Graphs in the synthetic families are reduced to roughly 128 or 160 nodes. Training uses a discrete-event simulator built from device-specific operation profiling and linear tensor-transfer costs. Per-device operation and transfer FIFO queues model readiness, overlap and peak memory. Selected RNN learning curves validate agreement with hardware, not all possible graphs/hardware configurations. The paper states that reported runtime improvements are measured on real hardware unless explicitly indicated otherwise (Section 3.3; supplement A.5–A.6).

**Objective and implementation detail.** Memory-penalized runtime is r+2·ReLU(m−M), with M=10.7 GB for nominally 11-GB K80 GPUs. Eight synchronous workers send summed policy gradients; Adam starts between 10⁻³ and 10⁻⁴ with linear decay and task-tuned entropy decay. The supplement describes both per-current-policy rollouts and a practical moving baseline over ten previous episodes. Main Section 2.1 defines intermediate reward as old minus new runtime, but Figure 2/supplement A.7 print the reverse sign. The released `compute_rewards` routine uses previous minus subsequent values, consistent with rewarding improvement. This is a source-specification discrepancy, not evidence that the implementation intentionally optimizes worse runtimes (supplement A.7; author `model/progressive_placer.py`).

## Experiments

**Setting and baselines.** TensorFlow r1.9 runs on an AWS p2.8xlarge instance with eight K80 GPUs and a Xeon E5-2686 processor; placements use two/four GPUs. Main workloads are Inception-V3, NASNet and two/four-layer NMT. The simulator first measures per-operation costs on devices. Comparisons use CPU/single GPU, Scotch, manual expert placements and a tuned official TensorFlow implementation of the earlier recurrent approach. Thus the baseline is a concrete implementation on this setup, rather than a direct reuse of previous papers' absolute times (Section 3; supplement A.2,A.7).

**All Table 1 cases.** Four-GPU NMT improves runtime from RNN's 3.15 to 2.63 seconds, 16.5%, but needs **94,000 versus 51,700** sampled placements, so sample efficiency is worse in this case. Two-GPU Inception requires far fewer samples but is slightly slower than RNN: 1.18 versus 1.17 seconds, −0.85% reported improvement. Four-GPU Inception gives 1.13 versus 1.19 seconds and the maximum 6.1× sampling reduction, 5,800 versus 35,800. Two-GPU NMT gives 2.32 versus 2.35 seconds with 20,400 versus 73,000 samples. NASNet's two/four-GPU cases give 0.86/0.74 versus 0.89/0.76 seconds. Neither every runtime nor every sample-count comparison is a win (p.7).

**Meaning of training time.** Table 1 labels training time as number of sampled placements, not elapsed seconds, GPU-hours or total profiling cost. The stopping criterion is less than 2% reward variation over a 1,000-episode window. Intermediate rewards require evaluating successive placements throughout an episode, whereas terminal rewards require only the final evaluation; sample counts, episode counts and wall-clock costs should therefore not be conflated (supplement A.4,A.7).

**Within-family transfer.** Each of cifar10, ptb and nmt contains 32 generated graphs, split equally into training and test sets. ENAS generates CIFAR/Penn-Treebank architecture families; NMT varies sequence length and batch size. Figure 5 compares zero-shot policies with per-test-graph optimization and random placement. Placeto's zero-shot CDFs are close to its optimized versions, while the recurrent zero-shot baseline is much weaker. The experiment trains within each family; it does not demonstrate an unchanged policy transferred across all three families, arbitrary architectures or a different combinatorial task (Section 4.2; supplement A.3).

**Ablations.** After training on 64 node orders, 64 unseen orders yield Placeto runtimes within about 5% of optimized placement on average, with roughly 10% fastest-to-slowest variation; the RNN baseline is about 30% worse on average. Removing structured pooling or local message passing produces roughly 20%/13% slower placements in the NMT-family ablation. Intermediate rewards improve selected learning curves but cost more simulator evaluations (Section 4.3; supplement A.4).

## Limitations

### Discussed in the Paper

The method still uses manual operation grouping. Removing grouping and jointly exploiting model/data parallelism are proposed future directions. Intermediate rewards improve credit assignment while increasing evaluation cost. Generalization is tested on unseen graphs from the same distributions.

### Curator Notes

Distribution-level placement generalization supports specialist classification. Profiling, simulator calibration, manual grouping and hardware assumptions remain part of deployment. An invariant graph encoder does not make the whole sequential policy independent of traversal order, and empirical runtime improvements do not prove global optimality. Preserve the negative Table 1 cases and distinguish placement evaluations from elapsed search time. The printed reward-sign inconsistency should be resolved using the cited implementation version for reproduction.

## Reproducibility

- **Publication:** [NeurIPS 2019 proceedings](https://proceedings.neurips.cc/paper/2019/hash/71560ce98c8250ce57a6a970c9991a5f-Abstract.html). The proceedings landing title omits the PDF's “Placeto:” prefix; both identify the same paper. First-author capitalization was normalized to Ravichandra Addanki from the PDF.
- **Scientific reading:** complete eleven-page publisher PDF, all references and the official [Supplemental ZIP](https://proceedings.neurips.cc/paper_files/paper/2019/file/71560ce98c8250ce57a6a970c9991a5f-Supplemental.zip). Its sole `appendix.pdf` contains six pages, all read, including simulator event handlers, family generation and experimental settings. Main/supplement figures and tables were visually checked.
- **Code and data:** [author repository](https://github.com/aravic/generalizable-device-placement), explicitly linked on main p.6, contains policy/model and simulator code. Its README calls the release research/reference code; dataset instructions link the three 32-graph datasets separately and specify TensorFlow/NetworkX/pickle dependencies. Dataset links were identified, not treated as a fresh reproduction run.
- **Citation graph:** explicit references to RL Device Placement [13], Hierarchical Placement [12] and Spotlight [6] are recorded. The cited concurrent reinforced-genetic-algorithm paper is not the catalogue's differently authored EGRL memory-placement paper, so no false relation is created.
