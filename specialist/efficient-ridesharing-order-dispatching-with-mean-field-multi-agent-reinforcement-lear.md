---
id: efficient-ridesharing-order-dispatching-with-mean-field-multi-agent-reinforcement-lear
short_title: IOD / COD
title: Efficient Ridesharing Order Dispatching with Mean Field Multi-Agent Reinforcement Learning
authors:
- Minne Li
- Zhiwei (Tony) Qin
- Yan Jiao
- Yaodong Yang
- Zhichen Gong
- Jun Wang
- Chenxi Wang
- Guobin Wu
- Jieping Ye
year: 2019
date: '2019-01-31'
publication:
  date: '2019-05-13'
  source_url: https://api.crossref.org/works/10.1145/3308558.3313433
venue: WWW
paper_url: https://doi.org/10.1145/3308558.3313433
institutions:
- University College London
- DiDi Research America
- DiDi Research
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Resource Allocation
problems:
- Online Driver–Order Dispatching
- Ride-Hailing Assignment
summary: Shared IOD/COD actors construct online driver–order allocations, with COD using neighborhood mean-field
  critics during training. Simulated income gains trade off with pick-up time. Author/conference sources list nine
  authors; publisher-deposit eight creates a disclosed version-byline ambiguity.
arxiv_url: https://arxiv.org/abs/1901.11454
figure:
  path: paper-assets/efficient-ridesharing-order-dispatching-with-mean-field-multi-agent-reinforcement-lear/framework.png
  alt: COD centralized mean-field training and local actors score variable order candidates.
  caption: 'Original Figure 2: COD information flow and actor/critic candidate scoring.'
  source_url: https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf#page=4
---

# Efficient Ridesharing Order Dispatching with Mean Field Multi-Agent Reinforcement Learning

> **TL;DR:** IOD/COD score variable order candidates for each driver; COD adds neighborhood mean-field information to the training critic. The shared policy constructs online driver–order allocations for one task (**specialist/constructive**). Author and conference sources list nine authors, while the publisher's Crossref deposit lists eight; this version-level byline ambiguity is retained below.

## Motivation

Choosing the highest-priced ride can leave a driver in an area with little future demand. Large-scale dispatch also has changing driver populations and variable candidate orders. The goal is accumulated driver income while considering service response and pick-up distance, rather than a one-shot maximum-weight matching alone. The paper reuses the simulator introduced in [Efficient Large-Scale Fleet Management](../specialist/efficient-large-scale-fleet-management-via-multi-agent-deep-reinforcement-learning.md), explicitly cited as its 2018 arXiv manuscript 1802.06444. [Introduction.](https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf#page=1)

## Contributions

- Independent Order Dispatching (IOD) scores observation–order pairs to handle a variable action set.
- Cooperative Order Dispatching (COD) augments the critic with an average neighborhood response, avoiding concatenation over a variable number of agents.
- Centralized training supports local actor execution and asynchronous retries after conflicting order choices.
- Grid and coordinate simulations compare income, response, demand–supply balance and pick-up time. A conditional linear-function-approximation convergence analysis accompanies the neural experiments. [Overview.](https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf#page=3)

## Methodology

Each active driver is an agent. Local observations encode location, timestamp and availability; orders contribute origin/destination features. A shared actor maps each observation–candidate pair to a ranking score, and a Boltzmann selector chooses among currently available orders. Evaluating M candidates requires M pair scores rather than a fixed output vocabulary.

The reward combines the driver's own fare with destination demand-minus-supply potential and a pick-up-distance regularizer. Destination potential is applied when origin demand exceeds supply. These are explicit reward-design choices, rather than optimization of income without additional shaping. IOD uses a local actor–critic; COD's critic additionally conditions on a neighborhood response defined through drivers arriving relative to available orders. Mean-field information is used for model updates, while the execution actor uses local information. Actors and critics share parameters across homogeneous drivers; many agents therefore remain one task-specific model, not a multi-problem generalist.

Drivers choosing the same order can conflict. The proposed asynchronous mechanism lets a driver with an invalid assignment immediately choose again from the refreshed pool. This is online allocation construction, not neural editing of a complete incumbent matching. The claim that local execution removes a centralized action controller does not eliminate the need for current order availability or conflict resolution. [Figure 2 and Algorithm 1.](https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf#page=4)

### Scope of the theory

Theorem 2.2 analyzes a fully observable MDP with a fixed, linearly parameterized feature basis, bounded rewards, infinite state–action visitation, GLIE exploration, assumptions on stage-game equilibria, appropriate decreasing step sizes, a finite state set and a sufficiently small policy Lipschitz constant K/(2T). It does not establish convergence of the actual partially observed nonlinear deep actor–critic under finite training. Page 7 acknowledges that nonlinear activations break the linear condition and offers an informal small-nonlinearity argument; this is not a substitute for proving all hypotheses for the neural experiment. [Theorem and proof.](https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf#page=6)

## Experiments

### Settings and budgets

The grid simulator uses three weeks of DiDi data, roughly 7,000 drivers, hexagonal cells approximately 1.2 km apart and ten-minute steps. It samples historical orders with replacement at specified bootstrap ratios. Pick-up differences within a cell and pre-pick-up cancellation are suppressed. The cited simulator calibration has income r² = 0.9331 and correlation 0.9853; calibration does not make the simulator a live intervention.

The critic MLP has hidden widths 512/256/128/64; the actor has 256/128/64. Learning rates are 1e-4 and 1e-3 respectively, discount 0.95, replay capacity 500,000 and batch size 2,048, with updates after 3,000 new samples. Temperature decreases from 1 to 0.01. Grid reward coefficients are 0.01 for destination potential and zero for pick-up distance. Models train for 20 episodes; the checkpoint with best training performance is evaluated. Training normally bootstraps 50% of orders, and testing uses five random seeds. Hardware, wall time and end-to-end deployment latency are not reported.

The coordinate simulator represents precise locations and includes pick-up-related cancellation. Five training weekdays provide 350,000 dispatch events and 9,000 drivers; testing uses three later weekdays. Training lasts 400,000 iterations with batch 200 and pick-up coefficient −0.1. These are distinct simulations and budgets. [Setups.](https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf#page=7)

### Results and trade-offs

At the full grid test bootstrap ratio, COD improves normalized daily income by 7.78% relative to Random, versus 6.27% for IOD. The response table reports +5.35% for COD and +4.67% for IOD relative to Random; the paper presents normalized percentage differences, so these are not silently converted to percentage points. COD's destination-potential improvement is 66.74%, although the underlying potentials remain negative. Revenue-greedy dispatch can earn more in late-night/early-morning hours; COD's daily advantage is not universal hourly dominance.

The separate reward ablation trains and tests at 10% bootstrap. IOD with individual-income reward plus destination potential gives +2.97% income relative to Random; average-income rewards perform worse. This ablation uses a different training distribution from the main table and should not be pooled as the same result.

In coordinate simulation, COD improves income by only 0.32% without cancellation and 0.06% with cancellation relative to the Hungarian baseline. Its average arriving time is **5.49% longer**, so it does not dominate the baseline on customer pick-up experience. Other neural variants lose cancellation-aware income relative to Hungarian matching. [Tables 1–5.](https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf#page=8)

## Limitations

The evidence is simulation using historical traces, not reported live randomized deployment. Congestion reduction is inferred from demand–supply balance, without a direct network congestion experiment. Robustness to centralized failure is an architectural motivation rather than measured fault-injection evidence. Performance depends on reward coefficients, candidate neighborhoods, order generation and cancellation assumptions. The conditional linear theorem does not certify neural convergence or global optimal assignments.

## Reproducibility

All 12 pages of the identified author-hosted WWW-layout manuscript, the complete 45-entry bibliography, key equations, tables and Figure 2 were read. There is no pointer to a separate necessary scientific appendix. ACM HTML remains inaccessible (403); public title/code searches and author sources did not identify an official release for this particular dispatch paper. The inspected `mlii/mfrl` README implements the separate ICML 2018 mean-field paper on Ising/battle environments and is not presented as COD/IOD code. No benchmark was rerun.

The author-hosted manuscript and official conference handbook (PDF pages 61–62) list nine authors, including Zhichen Gong. The publisher-deposited Crossref author list has eight and omits Gong. The front matter follows the actual manuscript and official conference program, with this unresolved formal-version metadata discrepancy stated explicitly; an inaccessible publisher PDF has not been claimed as inspected. No equal-contribution or corresponding-author marker appears in the read byline.

Primary arXiv history has one version, v1 on January 31, 2019; its PDF is not claimed as read. The publication date is the publisher deposit's May 13, 2019. Original Figure 2 was cropped from manuscript page 4 (coordinates 50,45–560,267 at 4×) and visually checked. [Read manuscript.](https://tonyzqin.wordpress.com/wp-content/uploads/2020/09/li-www19.pdf) [Official conference handbook.](https://archives.iw3c2.org/www2019/media/TheWebConf2019-Handbook.pdf)
