---
id: rl-device-placement
short_title: RL Device Placement
title: Device Placement Optimization with Reinforcement Learning
authors:
- Azalia Mirhoseini
- Hieu Pham
- Quoc V. Le
- Benoit Steiner
- Rasmus Larsen
- Yuefeng Zhou
- Naveen Kumar
- Mohammad Norouzi
- Samy Bengio
- Jeff Dean
year: 2017
date: '2017-07-17'
publication:
  date: '2017-07-17'
  source_url: https://proceedings.mlr.press/v70/mirhoseini17a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v70/mirhoseini17a.html
institutions:
- Google Brain
- Google
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Device Placement
summary: A graph-specific attentional sequence-to-sequence controller searches co-located TensorFlow operation placements
  using measured hardware runtimes; downstream gains exclude placement-search cost.
---

# Device Placement Optimization with Reinforcement Learning

> **TL;DR:** An attentional sequence-to-sequence policy searches for fast operation-group placements using measured TensorFlow execution time. Improvements depend on the workload and hardware; the reported downstream training times exclude the expensive placement search.

## Motivation

Human placement rules and graph-partitioning cost models can miss communication, memory and computation interactions in heterogeneous CPU/GPU execution. The paper learns from actual execution measurements rather than optimal-placement labels or a separately calibrated runtime predictor (Sections 1–2).

## Contributions

- A policy-gradient controller assigns co-located TensorFlow operation groups to devices, directly optimizing a transformed runtime signal.
- Distributed controllers and workers evaluate candidate placements on real hardware.
- Experiments demonstrate useful placements for recurrent language modeling, neural machine translation and Inception-V3, including downstream training comparisons and computational/communication profiling. These are applications of one placement task, with graph-specific searches, rather than evidence of shared weights solving distinct combinatorial task families.

## Methodology

**Objective and policy.** For graph G and D devices, a placement assigns each operation to one device. The practical search space is reduced by co-location before learning. An LSTM encoder receives operation type embeddings, zero-padded output shapes and one-hot adjacency information; an attentional autoregressive LSTM decoder predicts device identities. This is a sequence model over a graph description, not a permutation-invariant GNN (Sections 3.1–3.3, Figure 2).

**Learning and failures.** REINFORCE minimizes expected square-root runtime, with Adam and a moving-average baseline. The square-root transform has the same ordering for individual deterministic runtimes but is not the same expectation objective as raw time. Failed placements receive a manually selected large penalty; after 5,000 training steps, parameter updates use only successfully executing samples to reduce instability from sporadic failures. The baseline is initialized with the failure penalty to encourage exploration (p.3, Equations 1–3).

**Grouping.** TensorFlow's default co-location and recursively merging an operation whose output has a single consumer reduce sequence length. Additional domain rules group each LSTM cell, embedding lookup, attention step and softmax prediction; an Inception branch is one group. The three graphs shrink from 8,943/22,097/31,180 operations to 188/280/83 groups respectively. Thus the search does not explore every independent operation assignment, and manually chosen grouping remains part of the method (pp.4–5, Table 1).

**Evaluation infrastructure.** Up to 20 asynchronous controllers share policy parameters; each has 4 or 8 workers and its own baseline. A candidate runs for ten steps, discarding the first and averaging the remaining nine. The reported search takes 12–27 hours to find the best placement, using substantial parallel hardware. This search cost is separate from the time to train a target network after selecting its placement (Section 3.4).

## Experiments

**Setting and baselines.** Machines contain one 18-core Intel Haswell 2300 CPU and two or four Nvidia Tesla K80 GPUs, with a 50-GB RAM allowance. Baselines include single CPU/GPU, Scotch with estimated operation/communication costs, a GPU-only Scotch variant called MinCut, and manually designed placements. The original recurrent workloads have two LSTM layers, batch 64 and sequence length 40; Inception uses 299×299 images (Sections 4.1–4.2).

**Per-step runtime.** Table 2 measures a forward pass, backward pass and parameter update, in seconds. RNNLM ties the single-GPU baseline at 1.57 seconds in both device settings. NMT improves the fastest baseline from 4.99 to 4.04 seconds with two GPUs and from 4.73 to 3.92 with four; the last column reports baseline/runtime ratios minus one, 23.5% and 20.6%, rather than percentage elapsed-time reductions. Inception batch 32 ties single GPU at 4.60 seconds with two GPUs, while four GPUs reduce runtime to 3.85 seconds, a reported 19.0% throughput speedup. Claims that every benchmark improves over its best baseline would therefore be incorrect. Runtime measurements below ten seconds are repeated 15 times. Large-memory RNNLM/NMT variants also receive feasible placements, but those examples do not establish optimality (p.6).

**Downstream training.** NMT trains for 200,000 steps on filtered WMT14 English–German data; four independent training runs are averaged. Reported elapsed times are 229.57 versus 165.73 hours, a 27.8% reduction. This is a different denominator and measurement protocol from Table 2; the paper attributes differences partly to RL measurement overhead. Inception is trained to 72% validation accuracy on ImageNet, comparing model-parallel RL placement against synchronous/asynchronous data-parallel towers with batch 32 per tower. The reported improvement over synchronous towers is 19.7%. Asynchronous towers have shorter steps but less favorable convergence, demonstrating that step runtime alone does not determine time to an accuracy target (Section 4.4, Figures 6–7).

**Interpretation of placements.** NMT profiling shows improved device load balance, whereas Inception is less balanced but reduces memory-copy costs. These are measured examples of different trade-offs, not a theorem that balanced load is necessary or that the controller finds a global minimum (Section 4.5, Figures 8–9).

## Limitations

### Discussed in the Paper

Long operation sequences are difficult for the recurrent controller, motivating grouping. Runtime measurements are noisy and some placements fail through memory limits or transient machine conditions. Distributed search can leave workers idle; different controllers need separate baselines. The paper distinguishes deployment measurements from controller measurement overhead.

### Curator Notes

The policy is searched for each graph/hardware setup; no unchanged-model transfer across graph families or other combinatorial problems is demonstrated. Hardware feedback avoids an explicit analytic cost model but consumes 12–27 hours of parallel search and retains manual grouping. Deployment speedups do not establish a net end-to-end saving after charging search, nor do they imply global optimality or universal superiority over all placements. The Single-GPU description on p.5 says “CPU,” an apparent local prose typo resolved by its heading and the GPU results; the abstract/introduction's approximate improvement summary should not replace the precise experiment definitions above.

## Reproducibility

- **Publication:** [ICML 2017, PMLR 70:2430–2439](https://proceedings.mlr.press/v70/mirhoseini17a.html). The publisher's source explicitly records an issued date of 2017-07-17; the conference took place August 6–11. These are different date fields.
- **Read source:** the complete ten-page [publisher PDF](https://proceedings.mlr.press/v70/mirhoseini17a/mirhoseini17a.pdf), including references; key architecture, metric table and profiling/training figures were visually inspected. The publisher's Related Material and source `extras: []` expose no separate scientific supplement, and the PDF contains no appendix.
- **Implementation:** no author-confirmed implementation link was exposed by the paper or publisher record reviewed. TensorFlow and Scotch being public does not by itself provide this controller's implementation. Exact grouping, failure penalties, controller settings and hardware execution conditions matter for reproduction.
- **Citation graph:** explicit related-work citations to Pointer Networks and Bello et al.'s Neural Combinatorial Optimization are recorded from p.2 and their matching bibliography entries. General neural-network or classical-partitioning citations are not replaced with superficially related catalogue papers.
