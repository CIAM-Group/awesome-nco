---
id: neural-3-opt
short_title: Neural-3-OPT
title: Learning 3-opt Heuristics for Traveling Salesman Problem via Deep Reinforcement Learning
authors:
- Jingyan Sui
- Shizhe Ding
- Ruizhi Liu
- Liming Xu
- Dongbo Bu
year: 2021
date: '2021-11-28'
venue: ACML
paper_url: https://proceedings.mlr.press/v157/sui21a.html
institutions:
- Institute of Computing Technology
- Chinese Academy of Sciences
- University of Chinese Academy of Sciences
- Zhongke Big Data Academy
figure:
  path: paper-assets/neural-3-opt/framework.png
  alt: Neural-3-OPT improvement loop and learned link and reconnection selectors.
  caption: 'Figure 2: Overview of the Neural-3-OPT iterative TSP improvement pipeline.'
  source_url: https://proceedings.mlr.press/v157/sui21a/sui21a.pdf
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: Neural-3-OPT learns ordered tour-link selection and a FiLM-conditioned three-category reconnection policy,
  trained with actor-critic rewards for best-so-far TSP improvements.
inclusion: reference
inclusion_reason: ACML is outside the approved main-conference and journal inclusion list.
publication:
  date: '2021-11-28'
  source_url: https://proceedings.mlr.press/v157/sui21a.html
---

# Learning 3-opt Heuristics for Traveling Salesman Problem via Deep Reinforcement Learning

> **TL;DR:** A pointer policy selects three tour links, while a FiLM-conditioned policy chooses how to reconnect them. Actor-critic training rewards improvements to the best tour found, allowing the current tour to take a non-improving move.

## Motivation

Learning 2-opt moves leaves only one nontrivial reconnection for a selected pair of links. A 3-opt policy must additionally select the reconnection pattern, enlarging the search neighborhood and introducing a conditional decision. The paper learns both parts rather than greedily taking the largest immediate reduction.

## Contributions

- Factorizes the move into an ordered three-link selector and a conditional reconnection classifier.
- Combines sparse nearest-neighbor graph convolution, tour-order bi-LSTM encoding, and feature-wise linear modulation (FiLM).
- Evaluates synthetic TSP, ten TSPLIB instances, component ablations, and cross-size transfer. ACML remains a reference venue under the repository's approved main-collection policy.

## Methodology

The state contains the current tour and the best tour so far, encoded independently. Starting from a random complete tour, an action selects three links and a reconnection type. Reward is `L(best_t)-min(L(best_t),L(current_{t+1}))`: it is nonnegative improvement of the incumbent best, not necessarily reduction in the immediately preceding current-tour length. The next current tour need not be strictly shorter. [Sections 4.1-4.2, pp. 5-6.]

A sparse `K=8` nearest-neighbor graph supplies normalized inverse-distance edge weights to three residual graph-convolution layers. A bi-LSTM then encodes tour order. The pointer decoder conditions on current and best-tour embeddings, selects links sequentially, and masks choices to enforce increasing link indices. The reconnection module conditions the current-tour embedding on the summed selected-link embeddings through three FiLM layers, applying learned feature-wise scales and offsets. [Sections 4.3.1-4.3.2, Equations 1-12.]

There are seven nontrivial reconnections after cutting three links, but the default policy uses **three representatives of the paper's permutation-equivalence categories**, rather than a seven-output classifier. A seven-type variant is evaluated separately. A learned state-value decoder supplies the advantage baseline, and actor-critic optimization includes an entropy bonus. The framework retains a prescribed 3-opt move grammar; it does not learn arbitrary legal edits. [Sections 3, 4.3-4.4; Table 6.]

Training uses batch size 512, embedding dimension 128, three graph/FiLM layers, critic-loss weight 0.5 and entropy weight 0.005. Separate models receive 200 epochs for size 20, 300 for 50/100, and 500 for 200. Episode length increases from 8 to 10 to 20 at the reported epoch milestones. Evaluation compares 500/1,000/2,000 sampled improvement steps. These are distinct training and inference budgets. [Section 5.1, Table 1.]

## Experiments

**Synthetic instances.** Four test sets each contain 10,000 unit-square instances at 20/50/100/200 vertices; the smaller sets match the datasets used by AM and L-2-OPT. At 2,000 steps, Table 1 reports gaps of 0.00%/0.08%/0.74% and lengths 3.84/5.70/7.82 for Neural-3-OPT at 20/50/100. L-2-OPT gives 0.00%/0.12%/0.87%. Neural-3-OPT's total 10,000-instance times are 32/48/80 minutes, versus 31/41/59 minutes for L-2-OPT, measured on the same Xeon/RTX 3090 platform. Its TSP100 quality improves with more steps: 1.65% at 500, 1.06% at 1,000, and 0.74% at 2,000. Other Table 1 baseline rows are drawn from the cited literature rather than all uniformly rerun. [Sections 5.1-5.2, Table 1.]

**TSPLIB.** The size-100 model is tested on ten instances from 51 to 280 cities. The mean optimality gap is 2.93%, versus 4.56% for L-2-OPT and 3.79% for the configured OR-Tools baseline. It wins against L-2-OPT on only five instances, and against OR-Tools on seven. For example, at `ts225`, Neural-3-OPT obtains 129,381, worse than both baselines (127,731 and 127,763); the favorable average does not imply an instance-wise win. [Section 5.3, Table 2.]

**Ablations.** At TSP100, replacing FiLM with an MLP increases gap from 0.74% to 7.61% with the sparse encoder. Using a complete graph slightly improves gap to 0.73% but raises the Table 3 runtime from 27 to 37 minutes; that timing experiment uses **2,000 instances** due to memory limits, unlike Table 1's 10,000. At `K=4/8/16`, gaps are 7.77%/0.74%/1.13%, so a smaller neighborhood is not always adequate. Selecting among three reconnection categories yields 0.74%, versus 0.90% with seven types and 9.97% with the greedy reconnection strategy. These comparisons concern the reported learned policies, not a proof that 3-opt universally dominates 2-opt. [Sections 5.4-5.6, Tables 3-6.]

**Size transfer.** On TSP200, the size-50 model gives 7.02% versus L-2-OPT's 7.82%, but the size-100 model gives 3.40% versus L-2-OPT's better 2.80%. The separately trained size-200 model gives 7.04%, worse than the transferred size-100 model in this table. This qualifies the claim of reliable larger-size generalization. [Section 5.7, Table 7.]

## Limitations

The move grammar and evaluation are specific to symmetric Euclidean TSP. More improvement steps consume more inference time, and the method is slower than L-2-OPT at comparable iteration counts on the larger small-instance datasets. Transfer gains are inconsistent and the TSPLIB sample is limited. The paper suggests extending the architecture to higher-order k-opt, but it does not experimentally establish those extensions. Reported rounded zero gaps and the authors' statement of solving all TSP20 examples should not be generalized into an optimality guarantee.

## Reproducibility

- **Source material:** The complete 16-page PMLR publisher PDF was freshly read, including all seven result tables, five figures, algorithm, and bibliography. [Audit record](../data/reviews/papers/neural-3-opt.json).
- **Supplement inventory:** The publisher landing's Related Material section links only the main PDF; no supplementary PDF, ZIP, or author code is linked there or in the article. No separate scientific appendix is referenced. The note does not claim that no implementation exists anywhere.
- **Publication evidence:** PMLR volume 157 identifies ACML 2021 and pages 1301-1316; its BibTeX month is the conference interval 17-19 November. The note records November 2021 without inferring a distinct first-online day or individual acceptance date.
- **Classification:** This is a specialist improvement solver with separate size-specific models and a random initial-tour constructor.
