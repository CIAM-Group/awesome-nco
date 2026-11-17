---
id: spotlight-placement
short_title: Spotlight
title: 'Spotlight: Optimizing Device Placement for Training Deep Neural Networks'
authors:
- Yuanxiang Gao
- Li Chen
- Baochun Li
year: 2018
date: '2018-07-03'
publication:
  date: '2018-07-03'
  source_url: https://proceedings.mlr.press/v80/gao18a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v80/gao18a.html
institutions:
- University of Toronto
- University of Electronic Science and Technology of China
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Device Placement
summary: A recurrent policy optimizes graph-specific device placements using repeated KL-penalized updates; practical
  empirical gains do not inherit the ideal exact-update guarantee.
code_url: https://proceedings.mlr.press/v80/gao18a/gao18a-supp.zip
---

# Spotlight: Optimizing Device Placement for Training Deep Neural Networks

> **TL;DR:** A recurrent placement policy uses repeated KL-penalized policy updates to improve measured TensorFlow runtimes. Reported gains are empirical; the practical algorithm does not retain the exact assumptions of the paper's monotonic-improvement argument.

## Motivation

Measuring candidate placements on hardware is expensive, and earlier single-gradient-step policy training can learn slowly. Spotlight treats sequential operation placement as a finite-horizon decision process and uses multiple policy updates per sampled trajectory to improve placement-search efficiency (Sections 1–2).

## Contributions

- A placement MDP has states describing previous device assignments, actions assigning the next operation and a terminal reward given by baseline runtime minus measured runtime.
- The paper derives a policy surrogate, a claimed lower bound and an ideal minorization-maximization improvement argument, then introduces practical approximations leading to a KL-penalty objective.
- Experiments compare search progress and deployment training on CIFAR-10, language modeling and machine translation; the official scientific supplement also distributes implementation files.

## Methodology

**Policy and grouping.** A sequence-to-sequence LSTM with attention encodes operation names and outputs device probabilities. CIFAR's 926 operations are manually reduced to 86 super-operations by matching two-level TensorFlow name prefixes. The network still depends on a chosen sequence and grouping scheme; no shared trained policy across unrelated placement graphs or native combinatorial tasks is demonstrated (pp.5–6, Figure 3).

**Reward and update.** A full candidate assignment executes the target network for ten steps. The reward subtracts its runtime from a moving-average runtime baseline. The practical objective averages per-stage likelihood-ratio reward terms minus KL penalties, and each trajectory supplies ten stochastic-gradient-ascent updates. The algorithm retains the fastest observed complete placement, rather than providing an optimality certificate (Sections 3–4, Algorithm 1).

**Theoretical scope.** Theorems 1–2 concern an ideal performance lower bound and exact iterative maximization. The bound contains a supremum Q-function change, a supremum Q magnitude and maximal statewise KL divergence. The practical method cannot compute these quantities: it drops the first term, substitutes a tunable coefficient for the second and replaces the maximum divergence with sampled distribution penalties. Finite gradient steps on noisy samples therefore are not the exact minorization-maximization procedure in Theorem 2. Neither theorem establishes that every practical update improves runtime or that the final placement is globally optimal (main pp.4–5; appendix A–B).

**Printed proof caveat.** Appendix A moves from a coupling mismatch probability α to α equal to KL divergence in A.9–A.10. That identification is not valid in general: categorical distributions (0.5,0.5) and (0.51,0.49) have minimum coupling mismatch 0.01 but KL about 0.00020004. Thus even arbitrarily small KL does not justify the stated α-coupling substitution. The appendix additionally presents a small-α first-order approximation. These steps do not establish the printed lower bound as a general rigorous guarantee; the empirical results should be assessed independently of that claim (appendix p.2).

## Experiments

**Environment and search.** Ten Google Cloud machines have an eight-core Intel Broadwell CPU and two/four K80 GPUs each. A distributed search uses five machines, including a controller that also evaluates the target model. Each round samples five assignments and collects ten-step runtime measurements. The CIFAR learning curves cover 20,000 sampled placements over approximately 500 minutes. Those controller-search resources are additional to subsequent target-network training (Sections 5.1–5.3).

**Comparators.** GRL denotes the authors' implementation of the earlier policy-gradient placement approach using a recurrent policy. Other references include single GPU, Metis based on operation timing/data sizes/dependencies, expert layer placement and synchronous/asynchronous data-parallel towers. The experiments compare placement methods on the available environment; they are not the original predecessor paper's absolute runtime measurements (Section 5.2).

**CIFAR deployment.** Following placement search, the CNN trains for 100,000 steps to a stated 87% accuracy. With two GPUs and one CPU, Spotlight reaches convergence in 70 minutes, 70% of single-GPU time and **60.9% of GRL time**. The latter is a 39.1% elapsed-time reduction, not a 60.9% reduction. With four GPUs and one CPU, Spotlight takes 58 minutes versus synchronous towers' 95 minutes, about 39% less. Asynchronous towers have quicker steps but different convergence behavior. The selected four-GPU placement leaves two GPUs idle, so using all available devices is not itself the optimization target (pp.7–8, Figures 5–6).

**Additional workloads.** After about twelve hours of placement training, Table 1 reports four-GPU step runtimes: four-layer RNNLM 2.27 seconds versus GRL 3.15 and expert 3.86; eight-layer NMT 3.62 versus GRL 4.74 and expert 5.54. The relative reductions over GRL are 27.9% and 23.6%. An NMT deployment run for 12,000 iterations takes 12.5 hours versus GRL's 16 hours, 21.9% less. This is a fixed-iteration deployment comparison; its reported times exclude the placement-search phase (p.8).

**Profiles and interpretation.** Selected CNN profiles show how assigning related operations together can exploit partial connectivity while reducing cross-device communication. These measured examples motivate the observed speedups but do not demonstrate that no faster placement exists. Smooth learning curves in Figure 4 are empirical observations, not a substitute for the missing practical monotonicity guarantee.

## Limitations

### Discussed in the Paper

Long operation sequences require co-location to make recurrent training tractable. Exact Q-based bound constants cannot be obtained in practice, motivating approximations. Hardware runtime trials are costly. Data-parallel step speed and convergence speed can differ, and the chosen placement may use fewer devices than available.

### Curator Notes

The shared method/architecture across workloads is distinct from sharing unchanged trained weights. Manual operation-name grouping, environment-specific runtime measurements and substantial search overhead constrain transfer and total-cost claims. Practical sampled KL penalties, omitted bound terms and finite gradient optimization do not inherit the ideal theorem's guarantee; the printed proof also has the coupling/KL issue documented above. The paper does not provide confidence intervals over independent controller-training seeds or certified optimal-placement references.

## Reproducibility

- **Publication:** [ICML 2018, PMLR 80:1676–1684](https://proceedings.mlr.press/v80/gao18a.html). The publisher's explicit issued date is 2018-07-03, distinct from the July 10–15 conference dates.
- **Scientific reading:** complete nine-page publisher article and the sole three-page scientific `appendix.pdf` in the official [Supplementary ZIP](https://proceedings.mlr.press/v80/gao18a/gao18a-supp.zip), including both proofs and bibliography. Key algorithm, metric/profiling figures and appendix derivation were visually inspected.
- **Code:** that same author-supplied ZIP contains CIFAR workload, distributed controller and PG/PPO variants under `codes/`; it is a verified implementation artifact, not a separate maintained repository. Its 53 archive entries include Mac resource forks and editor metadata, which are not additional scientific PDFs. Inspected controller files use legacy TensorFlow `tf.contrib`, Python-2 syntax and hard-coded cluster addresses; current reproduction needs environment and cluster adaptation. No new experiment was executed during this source review.
- **Citation graph:** explicit references identify the 2017 RL device-placement predecessor and the 2018 hierarchical placement paper. Cluster-scheduling, streaming or architecture-search citations were not replaced with different catalogue papers sharing an author or topic.
