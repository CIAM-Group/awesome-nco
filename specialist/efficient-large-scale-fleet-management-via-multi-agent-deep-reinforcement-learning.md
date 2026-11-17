---
id: efficient-large-scale-fleet-management-via-multi-agent-deep-reinforcement-learning
short_title: cDQN / cA2C
title: Efficient Large-Scale Fleet Management via Multi-Agent Deep Reinforcement Learning
authors:
- Kaixiang Lin
- Renyu Zhao
- Zhe Xu
- Jiayu Zhou
year: 2018
date: '2018-02-18'
publication:
  date: '2018-07-19'
  source_url: https://api.crossref.org/works/10.1145/3219819.3219993
venue: KDD
paper_url: https://doi.org/10.1145/3219819.3219993
institutions:
- Michigan State University
- DiDi Chuxing
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Resource Allocation
problems:
- Online Fleet Repositioning
- Ride-Hailing Supply Allocation
summary: Contextual DQN and actor–critic share grid-level values and geographic/collaborative action masks to construct
  online vehicle relocations. Centralized values remain necessary for execution context; gains are calibrated historical-trace
  simulation results with explicit training and run-selection differences.
arxiv_url: https://arxiv.org/abs/1802.06444
code_url: https://github.com/illidanlab/Simulator
figure:
  path: paper-assets/efficient-large-scale-fleet-management-via-multi-agent-deep-reinforcement-learning/framework.png
  alt: Centralized critic outputs produce collaborative action masks for a shared vehicle policy alongside geographic
    masks.
  caption: 'Original Figure 2: contextual actor–critic and execution-time context masking.'
  source_url: https://arxiv.org/pdf/1802.06444v2#page=5
---

# Efficient Large-Scale Fleet Management via Multi-Agent Deep Reinforcement Learning

> **TL;DR:** Contextual DQN (cDQN) and actor–critic (cA2C) share grid-level values and restrict vehicle moves using geographic and collaborative masks. They construct online relocations for one fleet-management task (**specialist/constructive**). Execution still depends on centralized value outputs to form collaborative context.

## Motivation

Relocating idle vehicles before demand arrives can increase served-order value, but independent drivers may simultaneously move in conflicting directions or overfill an attractive location. A centralized joint action over thousands of vehicles is too large. The paper uses homogeneous vehicle agents with small local action sets and shared contextual value estimates. [Introduction.](https://arxiv.org/pdf/1802.06444v2#page=1)

## Contributions

- A fleet-management Markov game uses seven neighboring/stay actions and grid-average driver rewards.
- cDQN shares a destination-grid value across moves ending at that grid.
- cA2C combines a centralized state-value model with a parameter-shared policy and masks that accommodate changing valid actions.
- A calibrated DiDi-data simulator tests income, response rate, repositioning cost and context ablations. [Overview.](https://arxiv.org/pdf/1802.06444v2#page=2)

## Methodology

Each available vehicle chooses one of six neighboring hexagons or stays during a ten-minute interval. The state contains citywide available-driver/order counts, one-hot time and grid identity. Agents arriving at a grid receive its revenue divided by the number of arriving agents. This average reward discourages flooding a high-demand destination. Vehicles sharing a location/time share policy behavior; this remains one native repositioning task rather than a generalist across problems.

In the cost-free deterministic relocation setting, cDQN ties all moves ending at a destination to the same value. A geographic mask removes invalid neighbors. A collaborative mask permits only neighbors whose value is at least the current grid's value, plus staying. The reduced action set prevents many opposing flows but is a heuristic policy restriction, not a proof that the globally optimal fleet strategy survives it.

cA2C uses expected value targets, a target critic and separate experience-collection and batch-update phases. Positive policy weights are multiplied by both masks and renormalized before sampling. The critic's centralized output forms the collaborative mask **during execution**, so decentralized actor sampling does not mean execution requires only local observations with no centralized component. This differs from architectures whose critic is removed completely at inference. Neither method edits a complete incumbent relocation plan. [Algorithms 1–4 and Figure 2.](https://arxiv.org/pdf/1802.06444v2#page=4)

The cost extension subtracts 0.6 RMB per non-stay relocation, based on 1.2 km and 0.5 RMB/km. It breaks cDQN's destination-only action-value identity because origin-dependent relocation cost matters. Accordingly, the cost comparison uses cA2C and independent DQN; it does not demonstrate the same cDQN formulation under costs. [Cost extension.](https://arxiv.org/pdf/1802.06444v2#page=7)

## Experiments

### Simulator, data and budget

Four consecutive weeks of Chengdu DiDi data provide orders and vehicle trajectories over 504 hexagonal grids. Each day has 144 ten-minute steps. Vehicle online/offline changes follow estimated distributions; orders are bootstrapped from the corresponding historical time interval. After repositioning, orders are assigned first within their grid, then to available vehicles in neighboring grids. A virtual pre-dispatch estimates available supply; the average management population is 5,356 vehicles per step.

Calibration compares seven simulated episodes with seven days of real income, yielding r² = 0.9331 and correlation 0.9853. Agreement on historical income does not establish perfect counterfactual traffic simulation. Training and testing use different seed sets controlling order generation and status updates. The main protocol trains for 15 simulated episodes and evaluates ten subsequent episodes, averaged over three runs; this is not an explicitly documented held-out-city experiment.

Contextual networks have hidden widths 128/64/32, batch size 3,000 and Adam learning rate 1e-3. At each episode end cDQN takes 4,000 value batches; cA2C takes 4,000 critic and 4,000 actor batches. DQN exploration decreases from 0.5 to 0.1 during training and remains 0.1 in testing. An extra ten simulation episodes generate historical mean values for critic pretraining. In the first Table 1 condition, independent DQN is reported using the **best three of six runs**, while other methods use three runs; this selection difference should accompany the comparison. Hardware, end-to-end training wall time and deployment latency are not reported. [Setup.](https://arxiv.org/pdf/1802.06444v2#page=6)

### Main results and exceptions

At 100% initial vehicles, cA2C obtains normalized served-order value 115.27 ± 0.70 and response rate 94.99% ± 0.48%, versus the no-management simulator's 100.00 ± 0.60 and 81.80% ± 0.37%. Thus the value increase is 15.27% relative to that reference, while response rises 13.19 percentage points. cDQN is close at 115.19 and 94.77%. At 90% initial vehicles, cDQN's value 114.29 exceeds cA2C's 113.85; cA2C is not best in every reported condition.

With relocation costs, cA2C has normalized net value 112.70 ± 0.64, response 94.74% ± 0.57% and 408,859 relocations, versus DQN's 110.81 ± 0.68, 92.50% ± 0.50% and 606,932 relocations. Here the paper's value accounting subtracts relocation cost, unlike the cost-free GMV table.

Replacing grid-average rewards with raw grid revenue reduces cA2C's normalized value from 115.27 to 105.75, supporting the reward-design choice. Removing collaborative context increases cost-free relocations from 460,586 to 704,568. The full model retains 65.37% as many moves, meaning a **34.63% reduction**, rather than a 65.37% reduction. Qualitative airport plots use a separate ten-training-episode checkpoint and one test episode. [Tables 1–4 and qualitative study.](https://arxiv.org/pdf/1802.06444v2#page=8)

## Limitations

All reported gains are simulator outcomes, without live randomized deployment or global-optimality certification. The assumptions of homogeneous drivers, deterministic one-step neighboring moves, historical order bootstrapping and grid-average rewards simplify actual operations. Testing different supply levels and simulator seeds does not show a shared checkpoint across native optimization tasks. Centralized context computation remains part of inference, and the cost extension changes which algorithms are applicable.

## Reproducibility

All ten pages of arXiv **1802.06444v2**, November 1, 2018, including four algorithms and all 30 references, were read. It has the KDD 2018 title, four authors, correct DOI and two-algorithm scope. The later v3 from December 2019 changes the title and expands to three algorithms; it is not substituted for the conference version or claimed as read. The first arXiv submission was February 18, 2018; publisher-deposited online/print publication is July 19, 2018.

The official repository was inventoried at commit `d99e2b1352a1697e5930f9b45c4704db97e33f8f`: 17 tracked files, with no PDF/TeX/ZIP/notebook supplement. The complete README, sole wiki page and relevant training/network/masking code were inspected; the releases page is empty. Python 2 source is supplied, but real-data scripts depend on the author's absolute data directories and missing private order/grid files. A synthetic example is included. The released scripts specify discount 0.9 and replay capacity 1e6, details not explicitly fixed by the paper's experiment text. cDQN currently uses a ReLU value output with an all-zero fallback, whereas the text specifies ReLU + 1; the snapshot and paper descriptions are distinguished without claiming rerun equivalence. No benchmark was executed.

No separate necessary scientific appendix is pointed to in v2 or the inspected repository/wiki. The byline has Michigan State University and DiDi Chuxing, without equal-contribution or corresponding-author markers. Original Figure 2 was cropped from v2 page 5 (316,218–563,390 at 5×), and key equations, calibration and result plots were visually checked. The complete bibliography has no confirmed target in the current NCO catalogue, so no internal edge is forced.

[Read v2 manuscript.](https://arxiv.org/pdf/1802.06444v2) [Official code.](https://github.com/illidanlab/Simulator)
