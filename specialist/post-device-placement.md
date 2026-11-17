---
id: post-device-placement
short_title: Post
title: 'Post: Device Placement with Cross-Entropy Minimization and Proximal Policy Optimization'
authors:
- Yuanxiang Gao
- Li Chen
- Baochun Li
year: 2018
date: '2018'
publication:
  date: '2018'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2018/hash/92650b2e92217715fe312e6fa7b90d82-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2018/hash/92650b2e92217715fe312e6fa7b90d82-Abstract.html
institutions:
- University of Toronto
- University of Electronic Science and Technology of China
- University of Louisiana at Lafayette
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Device Placement
summary: Graph-specific factorized categorical placement search combines elite-sample cross-entropy fitting with
  PPO; distribution-fitting guarantees do not certify optimal placements.
inclusion: reference
inclusion_reason: Related RL placement optimizer using directly fitted independent categorical logits rather than
  a neural solver; retained as a topical reference.
---

# Post: Device Placement with Cross-Entropy Minimization and Proximal Policy Optimization

> **TL;DR:** Fit independent operation-to-device categorical probabilities using elite-sample cross-entropy updates and intervening PPO updates. The theorem solves a distribution-fitting subproblem; it does not certify globally optimal placements or the sample efficiency of the full search.

## Motivation

Real-hardware placement trials are costly. Earlier policy-gradient placement methods can improve slowly under finite evaluation budgets. Post combines aggressive batch fitting to good samples with more frequent gradient updates to use those trials more effectively (Sections 1–3).

## Contributions

- Placement is represented by a product of per-operation softmax distributions, rather than a recurrent neural policy.
- A closed-form cross-entropy update sets each operation's device probabilities to empirical frequencies among elite placements.
- PPO updates between elite-fitting rounds improve finite-budget search empirically. Main and supplemental experiments compare runtime, learning progress and selected simple-search/scheduling baselines.

## Methodology

**Search representation.** For each operation and device, store one logit; the probability of a complete placement is the product of the per-operation categorical probabilities. These are directly optimized graph-specific parameters, not predictions of a trained GNN/RNN or a reusable graph encoder. Independent assignability of operations does not imply their runtime effects are independent; the product family is a modeling restriction (Section 3.2, Equations 2–3).

**Cross-entropy update and theorem scope.** Select the best fraction of measured placements, then maximize their log-likelihood. Theorem 1 and its full appendix proof derive the resulting marginal frequency update. This optimizes the empirical factorized distribution-fitting problem for fixed elite data. It does not prove that the finite search finds a minimum-runtime placement, that the ideal elite-conditioned joint distribution factorizes, or that the complete CE/PPO scheme has globally optimal sample efficiency. Conditioning a product distribution on a coupled runtime event generally creates dependencies; the practical update is a projection back to the product family. Zero elite frequencies are boundary probabilities requiring limiting logits; uniform mixing restores positive probabilities during exploration (main pp.4–5; appendix pp.1–2).

**PPO and exploration.** Every small batch supplies a runtime advantage relative to a moving-average baseline. The objective uses per-operation likelihood ratios and an adaptive KL penalty, followed by multiple gradient-ascent steps. Larger batches trigger CE fitting; the result is mixed with a uniform distribution to preserve exploration. The paper's performance-lower-bound discussion should not be read as a verified monotonic-runtime guarantee for finite sampled, penalized updates interleaved with CE resets (Section 3.3, Algorithm 1; appendix Section 2).

**Budget and feedback.** Twelve workers on twelve Google Cloud machines evaluate 2,400 placements per target graph. Each machine has an eight-core Intel Broadwell CPU, 26 GB RAM and two/four/eight K80 GPUs with 11 GB each. A trial executes eleven target-training steps, drops the first and averages the other ten. PPO updates after twelve samples; CE fits the six best of sixty samples every five rounds. Gradient learning rate is 1, initial KL coefficient 1 with target 0.03, and uniform exploration starts at 0.1 and decays to zero. OOM placements receive a large artificial time, e.g.100 seconds (Section 4).

## Experiments

**Tasks and baselines.** TensorFlow workloads include Inception-V3, several ResNets, a four-layer language model and two/four/eight-layer NMT. Vision batch size is 32, recurrent/NMT batch size 64. Comparators are single GPU, expert placement, Metis, a policy-gradient implementation, PPO alone and CE alone. The authors explicitly say complete reproduction of the earlier RL papers is infeasible across changed hardware and benchmark versions; their PG baseline is a same-environment implementation of the method rather than the original reported implementation/results (pp.6–7).

**Learning and best runtime.** Figure 2 plots average sampled per-step runtime against elapsed learning time on three selected settings. Table 1 reports best discovered per-step runtimes and calculates reductions relative to PG. Its largest reduction is ResNet-50/four GPUs, 2.37 to 0.86 seconds, 63.7%; Post nevertheless equals the trivial single-GPU/expert baseline in this case. All four ResNet rows and RNNLM tie single GPU. Thus the headline maximum is not a gain over the strongest available baseline. Inception and NMT improve over the listed expert/single-GPU options: four-GPU Inception 1.19 versus 1.75 seconds, and four-layer NMT 2.13 versus expert 3.43 seconds. These are best observed solutions, not proven optimum runtimes (Table 1).

**End-to-end deployment.** A four-GPU Inception placement runs 40,000 target-training steps in 13.5 hours versus 20 hours for single GPU and 20.5 for PG, reported 32.5%/34.1% reductions. These downstream times are distinct from the 2,400-placement search budget; the comparison does not charge all placement-search resources or establish equal task accuracy at convergence (p.8).

**Supplemental comparisons.** With twelve machines and 2,400 placement evaluations per compared search method, ResNet-50/two GPUs has best runtimes 1.64/1.52/1.56/3.41 seconds for random search/hill climbing/genetic search/HEFT versus Post 0.86. Four-GPU Inception gives 1.92/1.86/2.03/3.31 versus 1.19. HEFT uses a profiled operation/communication cost graph. These two cases broaden baseline coverage but are not a theorem or exhaustive search comparison (appendix Section 3).

**Profiling.** Selected Inception placements distribute heavier branches while avoiding excessive communication on lighter ones. An NMT placement divides encoder and decoder work across devices, contrasting with layer-wise expert placement. The profiles illustrate discovered trade-offs rather than proving an optimal scheduling structure (Figure 3).

## Limitations

**Collection boundary:** Sections 2-3 replace the neural placement controller with one independently optimized softmax logit vector per operation. The neural networks are the workloads being placed, rather than a neural solver encoding the placement instance. This formally published paper is retained as a related learned-optimization reference and excluded from the main neural-solver count. Its stable ID, reviewed note and explicit citations are preserved.

### Discussed in the Paper

Elite updates can assign zero probability to unexplored choices, motivating uniform mixing. OOM placements need a failure penalty. Earlier-paper runtimes cannot be reproduced directly across changed environments. RNNLM/ResNet deployments often collapse to a single GPU, and the paper reports those ties explicitly.

### Curator Notes

The per-operation softmax parameters are optimized separately for each fixed graph/hardware configuration; this is a specialist stochastic placement optimizer with no neural graph-to-placement network or unchanged-model transfer. “Global minimum” applies to empirical CE fitting, not the combinatorial runtime objective. Classical asymptotic MLE efficiency does not automatically yield optimal finite-sample search efficiency under adaptively selected elites, coupled runtimes and PPO updates. Decaying exploration, measurement noise and full search resource costs limit extrapolation of the reported gains.

## Reproducibility

- **Publication and source:** [NeurIPS 2018 proceedings](https://proceedings.neurips.cc/paper/2018/hash/92650b2e92217715fe312e6fa7b90d82-Abstract.html), complete ten-page publisher PDF, all references, key equations, Table 1 and learning/profiling figures reviewed.
- **Scientific supplement:** manually followed the publisher's Supplemental link. Its [ZIP](https://proceedings.neurips.cc/paper_files/paper/2018/file/92650b2e92217715fe312e6fa7b90d82-Supplemental.zip) contains exactly `appendix.pdf`, two pages; both pages, proof, parameter updates and additional experiments were read and inspected. ZIP inventory and extracted PDF are cached with provenance.
- **Code:** no author-confirmed Post implementation is linked in the reviewed article/publisher record. TensorFlow benchmark repositories cited by the paper provide workloads, not necessarily the optimizer or complete experiment pipeline.
- **Citation graph:** exact explicit citations identify the 2017 RL device-placement method [3], hierarchical placement [4] and Spotlight [16]. The source's shortened author list for [3] is retained as citation provenance rather than copied into that predecessor's canonical metadata.
