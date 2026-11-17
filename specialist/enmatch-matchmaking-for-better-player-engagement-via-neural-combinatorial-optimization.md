---
id: enmatch-matchmaking-for-better-player-engagement-via-neural-combinatorial-optimization
short_title: EnMatch
title: 'EnMatch: Matchmaking for Better Player Engagement via Neural Combinatorial Optimization'
authors:
- Kai Wang
- Haoyu Liu
- Zhipeng Hu
- Xiaochuan Feng
- Minghao Zhao
- Shiwei Zhao
- Runze Wu
- Xudong Shen
- Tangjie Lv
- Changjie Fan
year: 2024
date: '2024-03-24'
publication:
  date: '2024-03-24'
  source_url: https://doi.org/10.1609/aaai.v38i8.28760
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/28760
institutions:
- Fuxi AI Lab, NetEase
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Assignment
problems:
- Engagement-oriented Team Matchmaking
- Balanced Matchmaking
summary: An engagement predictor and neural team constructor combine with classical local refinement for k-vs-k
  matchmaking; proprietary simulations and live match counts have distinct evidence and reproduction limits.
code_url: https://github.com/anonymouss2023/EnMatch
figure:
  path: paper-assets/enmatch-matchmaking-for-better-player-engagement-via-neural-combinatorial-optimization/framework.png
  alt: Original Figure2 shows the engagement network, player graph encoder, masked decoder and heuristic operator.
  caption: Original Figure2 and complete caption distinguish data, supervised-learning and reinforcement-learning
    flows.
  source_url: https://raw.githubusercontent.com/anonymouss2023/EnMatch/347a27d2f02fd12835a514269330e2e548c623b1/_AAAI2024_EnMatch.pdf#page=5
---

# EnMatch: Matchmaking for Better Player Engagement via Neural Combinatorial Optimization

> **TL;DR:** EnMatch learns an engagement predictor and a policy that constructs k-vs-k teams across a player pool, then refines each match with a heuristic operator. Real-data simulations and a reported online A/B deployment support its application, while proprietary data and differences in the public prototype limit independent reproducibility.

## Motivation

Equal-skill teams do not necessarily maximize players' willingness to continue playing. Team composition and individual roles introduce nonlinear interactions, making engagement-oriented multi-team assignment more complex than balancing skill totals. Observational behavior analysis motivates the objective, without establishing that every observed association is causal. [pp. 1–4]

## Contributions

- Predict individual retention using player/team context and auxiliary in-game performance tasks.
- Construct teams using neural representations, constrained player selection and PPO-style learning.
- Combine policy output with local heuristic search, evaluating simulations and two-week live tests. [pp. 4–7; appendix]

## Methodology

A pruned player graph represents compatibility rules; a GCN encodes players. A Transformer-style decoder uses similarity-based candidate selection and masking to select 2K players, assigned to opposing teams by alternating positions. The engagement network supplies predicted rewards. A destroy/shuffle/score heuristic refines the selected players' team assignment, and training considers both raw and refined outcomes. This is **specialist/constructive** neural assignment with classical refinement, not a learned incumbent-editing policy or a demonstrated shared model across native problem families. [Figure 2; Equations 3–11; Algorithm 1]

The printed zero-logit invalid-player mask does not mathematically force zero probability after softmax; the inspected public LSTM prototype instead uses minus-infinity for already-selected entries. These are different specifications. Likewise, the partition constraints' printed summation indices require clarification relative to the stated one-team-per-player and K-player-per-team intentions. [Equations 2/5–6; inspected release]

## Experiments

The manuscript reports SPG 3-vs-3 and RPGPVP 15-vs-15 datasets with 851648/400985 matches and 33873/185232 players. Simulation pools contain 120 players, use a time-ordered 80/20 train/test split and average 100 sampled rounds. All methods are scored by the same learned engagement simulator; those rewards measure predicted retention, not directly observed future outcomes. Hardware is a 2080Ti, eight CPUs and 64GB RAM. [Table 3; appendix]

Simulation reward is 66.5±0.9/58.9±1.5, versus second-best 65.1/52.7, reported as 2.15%/11.76% relative gains. The two-week equal-traffic A/B test reports 222880/59097 matches, relative gains 1.64%/7.19% over the strongest listed comparators. Match counts proxy engagement; these are not percentage-point improvements in independently measured long-term daily retention. GPU policy inference is reported as 20–30ms, while average online request response is below 200ms for typically fewer than 400 players. [Tables 5–6; p. 7]

Synthetic balanced matchmaking is a separate objective. EnMatch-1000's N=60,K=10 result is 1247.5 versus OR-Tools-120's 230.3; OR-Tools is much better with a larger two-minute budget. Time-limited OR-Tools incumbents are feasible-reference upper bounds for minimization, not automatically proven optima. [Table 8]

## Limitations

Simulation shares a learned reward model with the optimization objective; proprietary longitudinal data and operational details prevent independent replication here. The paper gives no global optimality guarantee or tail-latency guarantee. General claims that neural objectives categorically exceed every mathematical solver's capabilities are not adopted; representability depends on the objective and formulation. [pp. 3, 6–7; appendix]

The read review-stage copy specifies three recent games in one feature description and five in preprocessing; exact feature construction requires clarification. Printed masking and partition-index details also need care. Public code inspection does not establish the historical production architecture or validate every fairness constraint. [pp. 5, 10–11]

## Reproducibility

Read the complete **12-page repository manuscript** and its separately released **three-page appendix**, including all references, formulas, algorithm, feature rows and eight tables; inspected all four contact sheets and original Figure 2/full caption. The appendix overlaps manuscript pp. 10–12: this is 15 registered source pages, not 15 unique scientific pages. The reading copy is explicitly anonymous/review-stage; publisher metadata independently identifies ten NetEase Fuxi AI Lab authors, AAAI2024, pages 9098–9106 and publication **2024-03-24**. No same-identity arXiv date was established.

The [pinned repository](https://github.com/anonymouss2023/EnMatch/tree/347a27d2f02fd12835a514269330e2e548c623b1) contains 67 entries and exactly those two PDFs. Its README is a short submission identification. Relevant portions of `code/enmatch/nets/enmatch/enmatch.py` instantiate LSTM encoder/decoder and pointer attention, differing from the manuscript's GCN/Transformer description. This prototype snapshot is not claimed to reproduce the production engagement model. No private data, weights, training or deployment benchmark was executed.
