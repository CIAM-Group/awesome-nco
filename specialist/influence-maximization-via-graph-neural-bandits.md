---
id: influence-maximization-via-graph-neural-bandits
short_title: IM-GNB
title: Influence Maximization via Graph Neural Bandits
authors:
- Yuting Feng
- Vincent Y. F. Tan
- Bogdan Cautis
year: 2024
date: '2024-06-18'
publication:
  date: '2024-08-24'
  source_url: https://doi.org/10.1145/3637528.3671983
venue: KDD
paper_url: https://doi.org/10.1145/3637528.3671983
institutions:
- National University of Singapore
- Université Paris-Saclay
- CNRS LISN
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Online Influence Maximization
summary: Graph neural bandits construct influencer subsets using learned activation and exploration correlations;
  logged-data results and clustering costs qualify its unknown-topology campaign gains.
arxiv_url: https://arxiv.org/abs/2406.12835
code_url: https://github.com/goldenretriever-5423/IM_GNB
figure:
  path: paper-assets/influence-maximization-via-graph-neural-bandits/framework.png
  alt: Original Figure1 shows learned exploitation/exploration graphs, GCN refinement and arm selection.
  caption: Original Figure1 and full caption; the displayed L2 aggregation must be distinguished from the caption
    description as a sum.
  source_url: https://arxiv.org/pdf/2406.12835v1#page=5
---

# Influence Maximization via Graph Neural Bandits

> **TL;DR:** IM-GNB learns user correlations and exploration bonuses while selecting influencer subsets over a multi-round campaign. It is a **specialist/constructive** online influence-maximization method; learned reward estimates and empirical spread gains do not establish optimal selection or a regret bound.

## Motivation

Standard influence maximization assumes access to a diffusion network and propagation parameters. IM-GNB instead learns from contextual campaign feedback when topology and diffusion mechanics are unknown to the decision maker. The objective is the number of distinct users reached across rounds, counting repeated activations once. [pp. 1–3]

## Contributions

- Adapt graph neural bandits to contextual, multi-round influencer selection.
- Build separate exploitation and exploration correlation graphs from estimated activation probabilities and gradients.
- Evaluate logged-data campaigns, clustering costs and artificially boosted exploration. [Sections 3–5; Appendices A/B]

## Methodology

Each round receives a message context and selects L influencers from a known pool. Per-user fully connected networks estimate activation and residual uncertainty; RBF similarities construct user correlation graphs. Simplified GCNs followed by fully connected networks refine exploitation and exploration outputs, which guide influencer-set construction. Newly activated-user feedback updates the models online. This is selection during a campaign, not learned revision of a complete seed-set incumbent, nor evidence of one fixed checkpoint solving different native tasks. [pp. 3–7; Algorithm 1]

The printed reward aggregation in Equations 14/17 and Figure 1 uses **L2 norms**, although the caption describes a sum. A norm of predicted probabilities is generally different from their sum, so it should not be described as the exact expected number of activations. The reward recurrence in Equation 2 also requires care when interpreting per-round versus cumulative quantities; the intended unique-user indicator is made explicit in Equation 8. No new regret or global-optimality proof is supplied. [pp. 3–6]

## Experiments

Original Twitter/Weibo logs contain 11.6M/1.8M users, but the experiments filter around major influencers to 31.6k/54.4k users and cluster them into 50 groups. Contexts come from topic representations of posts. The environment samples logged tweets for influencer/context choices and discounts previously encountered users. Campaigns run 500 rounds, with L from one to five and averages/standard deviations over 100 runs. These are logged-data simulations rather than live marketing experiments. [pp. 7–9]

Spread curves generally favor IM-GNB later in the campaign. On Weibo with small L, GLM-GT-UCB can learn faster and outperform it initially. The advantage also shrinks as more of the ten available influencers are selected. Increasing clustering granularity helps up to a point and then hurts: Appendix A reports 41.43 hours at 50 clusters versus 735.35 at 250 for its stated runtime comparison. [Figures 2–5; Table 3]

## Limitations

Dense correlation graphs have quadratic user-count terms, and gradient features can be large; clustering and pooling are important computational approximations. The text's empirical characterization of runtime growth as exponential is not an exponential complexity theorem. Neither dataset scale before filtering nor a claim of real-time decision making establishes per-decision latency on the original full networks. There is no demonstrated cross-problem shared solver or optimality guarantee. [Sections 4.2.4/5; Appendix A]

## Reproducibility

Read all **11 pages of arXiv v1**, including all 41 references and scientific Appendices A/B, and inspected all three contact sheets, every result plot/table, key formulas and original Figure 1/full caption. Actual arXiv history dates v1 **2024-06-18**. Primary DOI metadata confirms **three authors**, KDD2024, pages 771–781 and online publication **2024-08-24**.

The manuscript's [pinned official repository](https://github.com/goldenretriever-5423/IM_GNB/tree/ee410ced6223eb3b3308b5b90e58c35e64bab14e) has 12 files and no extra scientific PDF/TeX/notebook/archive. Its complete short README links the original Weibo dataset; it does not provide a detailed reproduction protocol. No model was executed or benchmark rerun. A similarly named secondary code URL was unavailable and was not substituted for the actual manuscript link. No exact current-catalogue citation target was established after full body/bibliography checking.
