---
id: save
short_title: SAVE
title: Combining Q-Learning and Search with Amortized Value Estimates
authors:
- Jessica B. Hamrick
- Victor Bapst
- Alvaro Sanchez-Gonzalez
- Tobias Pfaff
- Theophane Weber
- Lars Buesing
- Peter W. Battaglia
year: 2020
date: '2019-12-05'
publication:
  date: 2020-04
  source_url: https://openreview.net/forum?id=SkeAaJrKDS
venue: ICLR
paper_url: https://openreview.net/forum?id=SkeAaJrKDS
institutions:
- DeepMind
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/1912.02807
paradigm: constructive
problem_families:
- Planning
problems:
- Tightrope
- Physical Construction
- Marble Run
- Atari
summary: SAVE combines real-transition Q-learning with softmax distillation of MCTS root action values, reusing
  learned value estimates as one-pseudocount search priors in separately trained planning agents.
---

# Combining Q-Learning and Search with Amortized Value Estimates

> **TL;DR:** SAVE retains information computed during search. A learned Q-function initializes MCTS estimates; search root Q-values are stored beside real transitions and distilled back into that function. The tested agents use perfect simulators and separate task-specific training. Evidence includes physical construction planning and Atari, rather than a shared solver for static graph CO tasks.

## Motivation

A planner can discover that an action is poor, avoid executing it and leave a model-free learner unaware of that correction. Conversely, with small budgets and many bad actions, imitation of search visit counts can reinforce actions merely because they were explored. SAVE preserves estimated action values, including negative evidence about alternatives, so later searches can reuse past computation (Sections 1-2).

## Contributions

The method adds a learned Q prior to MCTS and a search-value amortization loss to ordinary Q-learning. Small-budget experiments compare this combination with Q-learning alone, search without amortization and count-based policy priors. The paper also introduces a difficult Marble Run construction task and studies search budgets, loss functions and exploration strategies.

The experiments span tabular/MLP Tightrope, graph-network physical construction and recurrent Atari agents. These are separate learned agents with different architectures and task objectives, not one joint checkpoint. Construction and Marble Run provide sequential combinatorial planning evidence; the Atari study tests the broader RL mechanism. The entry is classified as a specialist planning framework.

## Methodology

MCTS initializes each action with a pseudocount of one and its Q-network value. Backed-up discounted returns are averaged together with that prior; leaf values are max_a Q(s,a). After the search, the agent uses epsilon-greedy acting, with the nonrandom branch choosing among actions actually explored. It stores real transitions and the entire root search-Q vector in replay (Equations 1-4; Appendix A.2).

Training combines a real-transition TD loss with cross entropy between softmax(search Q) and softmax(network Q), at temperature one. This matches relative value structure rather than directly regressing raw Q-values with L2. The TD component anchors reward scale, while the amortization term incorporates search information. Stale search targets in replay can be misleading as the network changes; the method has no general convergence or calibrated Bayesian-inference guarantee.

All experiments use perfect environment models. Most non-Atari function-approximation experiments use one GPU learner and 64 CPU actors, a replay ratio of four, batch size 16 and a 4,000-transition buffer. Physical construction uses object graphs with Q-valued edges encoding relative block-placement actions. Atari instead uses R2D2 and a separate distributed setup (Appendices A, C and E).

## Experiments

Tightrope is an eleven-state chain with 100 actions per state, many of which terminate without useful reward. Tabular agents train for 500 episodes and evaluate on 100 episodes across twenty seeds. Figure 2 reports medians and 95% confidence intervals. Function-approximation experiments use ten seeds, one million episodes and a ten-simulation budget; their shaded regions show seed minima/maxima, not confidence intervals. SAVE is more reliable than the tested count-based prior under small budgets; the gap diminishes when larger search budgets are available.

Construction evaluates Connecting, Covering and Covering Hard, with up to tens of thousands of actions per scene. Agents train separately on their tasks for one million episodes with ten seeds. SAVE uses ten training simulations and is tested with zero to fifty; the UCT comparator uses 1,000. Evaluation uses 10,000 episodes for the main curves and 1,000 for ablations. SAVE reports stronger rewards and better retention when test search is removed. Ablations favor the combined TD plus cross-entropy design; the “without Q-learning” implementation also changes to an L2 amortization loss, so it is not a perfectly isolated one-factor comparison (Figure 3; Appendix C).

Marble Run requires building structures that route a simulated marble around obstacles. Sticky blocks cost either zero or 0.04. The adaptive curriculum advances after sufficiently represented scene-property bins each exceed 50% success over their last fifty episodes. Evaluation at a named curriculum level mixes that level with easier ones using a truncated geometric distribution; it is not a pure hardest-level success rate. Checkpoints are selected by reward on the highest reached curriculum level. SAVE advances farther than the tested Q-learning agent, which becomes unstable around levels four/five. Matching real-plus-search transition counts on Covering and comparing longer model-free training support data-efficiency gains in these setups, without establishing equal wall-clock cost (Figure 4; Appendices C.4 and D).

Atari uses fourteen games and three seeds per agent. SAVE uses ten search simulations, 1,024 actors and a shorter actor-weight update interval. The controlled R2D2 baseline also runs MCTS but discards its results to match the replay-ratio effect of slower actors. Table E.1 reports scores averaged over the last 20,000 training episodes, not a separately described held-out episode protocol. Relative to that controlled baseline, the median per-game percentage improvement is 40%; this is the median of percentage changes, not the percentage change between median raw scores. Large gains on Frostbite/Alien/Zaxxon coexist with much smaller gains on Hero/Gravitar. These experiments do not establish a jointly trained multi-game policy (Appendix E).

## Limitations

Accurate models and extra simulator queries are prerequisites in the demonstrated setup. Learning with approximate models and confidence-aware weighting is proposed as future work. Search target noise, replay staleness, action-space coverage and reward scale affect performance. Episode/transition efficiency, simulation budgets and wall-clock efficiency are distinct; the paper supplies several controls but no universal equal-resource dominance result. Seed uncertainty must be read according to each caption: confidence intervals, minima/maxima and three-seed means are different summaries.

## Reproducibility

- [Official ICLR 2020 conference page](https://iclr.cc/virtual_2020/poster_SkeAaJrKDS.html) verifies the title, seven authors and conference publication. The complete [arXiv 1912.02807v2](https://arxiv.org/abs/1912.02807v2), revised January 10, 2020 and marked as a conference paper, was read in full: all 27 pages, references and Appendices A-E. Eight key formulation, result, curriculum and Atari pages were visually checked. The preprint inception remains December5,2019. The [publisher metadata](https://openreview.net/forum?id=SkeAaJrKDS) explicitly records `citation_publication_date` as **2020-04**, independently of any paper-specific acceptance date. This supports April2020 month precision, not an exact publication day.
- OpenReview API v1/v2 for `SkeAaJrKDS` returned 403. The official conference/author pages list the paper rather than a separate scientific PDF supplement; the full appendices are integrated in the read manuscript.
- The paper-linked Drive folder contains twelve Marble Run demonstration MP4s, totaling 908.18 seconds. All were downloaded and individually hashed; container inventories show no audio tracks. Visual inspection sampled every ten seconds plus the final frame, giving 110 frames covering each clip from start to end. These are explicitly sampled storyboards, not complete frame-by-frame playback, and are used only as qualitative illustrations. They add no quantitative success-rate claim.
- No author code implementation was verified from the full article, official conference page or checked author publication page; TensorFlow/Sonnet library links are not an implementation release. No learning or planning experiment was rerun. One exact existing-paper citation, to MCTSnet, is registered with body and full-reference evidence.
