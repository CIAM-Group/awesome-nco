---
id: spatio-temporal-capsule-based-reinforcement-learning-for-mobility-on-demand-network-co
short_title: STRide
title: Spatio-Temporal Capsule-based Reinforcement Learning for Mobility-on-Demand Network Coordination
authors:
- Suining He
- Kang G. Shin
year: 2019
date: '2019-05-13'
publication:
  date: '2019-05-13'
  source_url: https://api.crossref.org/works/10.1145/3308558.3313401
venue: WWW
paper_url: https://doi.org/10.1145/3308558.3313401
institutions:
- The University of Michigan–Ann Arbor
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Resource Allocation
problems:
- Mobility-on-Demand Vehicle Relocation
- Ride-Hailing Fleet Coordination
summary: A capsule Double-DQN predicts local relocation-zone values from demand/supply heatmaps and external context.
  Sequential neural relocation plus nearest-request matching is evaluated in historical-trace simulations; incomplete
  split and training specifications limit reproducibility.
figure:
  path: paper-assets/spatio-temporal-capsule-based-reinforcement-learning-for-mobility-on-demand-network-co/framework.png
  alt: Capsule spatial Q branch and dense external-context branch sum into a relocation action-value map.
  caption: 'Original Figure 2: STRide capsule-based Q-network and external-feature branch.'
  source_url: https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=5
---

# STRide: Spatio-Temporal Capsule-based Reinforcement Learning for Mobility-on-Demand Network Coordination

> **TL;DR:** STRide learns values for neighboring relocation zones from demand/supply heatmaps and external factors. Idle vehicles make sequential neural relocation choices, followed by nearest-request matching. It is **specialist/constructive**: capsule routing is internal network computation, not an incumbent-route improvement operator.

## Motivation

Myopic redistribution can over-serve some neighborhoods while leaving future requests without nearby cars. STRide addresses the long-term effects of where an idle vehicle moves, with historical travel patterns, weather and event context. The paper relates its formulation to [dynamic bike repositioning](../specialist/dynamic-bike-reposition-a-spatio-temporal-reinforcement-learning-approach.md) and [multi-agent fleet management](../specialist/efficient-large-scale-fleet-management-via-multi-agent-deep-reinforcement-learning.md). [Introduction.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=1) [Related work.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=6)

## Contributions

- A data-driven emulator combines local vehicle context, ride preferences, travel-time estimates and external factors.
- A capsule Q-network represents spatial demand/supply relationships; a dense branch adds temporal/external context.
- Double DQN trains sequential vehicle-relocation decisions, with evaluation on three historical ride datasets. [System overview.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=3)

## Methodology

The state contains spatial heatmaps of requests, available vehicles and all vehicles, plus weather/events/time. A cropped and zero-padded local context centers on the target vehicle. Each vacant vehicle chooses a neighboring zone or stays. Other vehicles' current states are considered, but the current choice is independent of their next actions. Vehicles sharing a spatiotemporal state use the same value function; this is one mobility-coordination task, not a checkpoint demonstrated across different native optimization problems.

The reward aggregates recent fare-based earnings minus relocation costs over a window with w = 15. Historical bidirectional zone-to-zone proportions define a sigmoid ride-preference measure, computed in four six-hour periods. Relocation travel cost is weighted by that preference. An OSM-based random-forest estimator predicts travel time from locations, path length and calendar/time features. Nearest-request matching and assumed distance-based rejection form part of the emulator. These choices define the evaluated objective and environment, rather than recovering all passenger or driver preferences from first principles. [Emulator.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=4)

A convolutional input is transformed into primary and output capsules. Learned transformations, softmax coupling, squash normalization and iterative agreement propagate vector features; an output convolution yields a spatial Q map. Two dense layers process external features and location, producing another Q map added to the spatial map. The highest-value neighboring zone is selected subject to epsilon-greedy exploration. Agreement routing updates activations/couplings inside the Q-network and does not edit a complete assignment. The paper describes Double DQN but provides neither a new convergence proof nor a global-optimality guarantee. [Network.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=5)

## Experiments

### Data, simulator and reported budget

The datasets total 21,150,163 rides: 2,816,895 Uber NYC trips from June 2015, 11,588,760 Yellow Taxi NYC trips from May 2016 and 6,744,508 DiDi Chengdu trips from November 2016. Weather and event context supplement the traces.

Defaults include 8,000 vehicles, reward coefficients alpha = 1 and beta = 0.3, epsilon = 0.1, 12 episodes of 30 hours each and 30-minute steps. Requests are rejected if the nearest vacant vehicle is over 5 km away. The map has 219 × 219 zones, relocation uses a 15 × 15 neighborhood and local context is 23 × 23. Platform revenue and relocation subsidies each use 20% shares in the modeled accounting. These are simulator assumptions, not observed deployment parameters.

Primary capsules use eight 8-dimensional groups; output capsules use eight 50-dimensional groups. Input/output convolution settings are (64,9) and (64,6); the external branch has widths 10 and 15² = 225 for the spatial action output, with 18 external/location inputs. The paper does not specify a reproducible train/test split, replay size, optimizer/learning rate, detailed update budget, hardware or total training wall time. The dataset total therefore must not be described as a held-out test set. [Experimental setup.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=6)

### Reported outcomes

Dataset-normalized mean profits in Figure 5 are 0.7665 for STRide versus 0.5847/0.3554/0.2917 for CRL/CONT/GD on Taxi, and 0.6799 versus 0.4199/0.3909/0.2718 on DiDi. Against CRL these imply approximately 31% and 62% relative increases in these plotted normalized means, rather than one universal 30% improvement across every metric and dataset.

DiDi mean rejection rates are 0.0863 ± 0.043 for STRide, 0.2262 ± 0.028 for CRL, 0.2616 ± 0.056 for CONT and 0.2689 ± 0.047 for GD; the figure identifies standard deviations without a repeated-seed count. CDFs show shorter passenger waits and idle driving, and lower online coordination overhead on the selected datasets. The overhead figure is measured in seconds per decision, not an unsupported millisecond latency. Removing preference or external factors degrades the Uber profit distribution in Figure 4. [Figures 4–9.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf#page=6)

## Limitations

Historical-trace simulation and specified pricing/subsidy rules support the claims; no live randomized deployment or certified global optimum is reported. Dataset-specific evaluation does not establish one common checkpoint across the cities, much less multiple native tasks. Missing split/training details, limited uncertainty reporting and absent official implementation constrain exact reproduction. A later similarly named TKDE article is a separate journal publication, not substituted for this conference version or treated as a cited future work.

## Reproducibility

The author lab's publication page explicitly links the seven-page WWW manuscript used here. All seven pages, equations, figures and 40 references were read. The deposited proceedings span is 2806–2813 (eight pages); this review identifies the actual seven-page author version rather than claiming byte identity or reading an unavailable publisher PDF. The title, DOI, two authors and conference entry independently identify the work. No separate necessary scientific appendix is promised in the read version.

The author publication entry and official conference TOC were manually inspected; they provide the paper but no scientific supplement or official code link. Public title/arXiv/code searches did not identify a corresponding arXiv manuscript or verified release. A third-party table's code link is merely a Papers With Code search URL and is not an implementation. Original Figure 2 was cropped from manuscript page 5 (48,90–443,217 at 4×) and visually checked. No benchmark was rerun. Publication is May 13, 2019, supported by publisher-deposited online/print metadata; no arXiv date is invented. Neither equal-contribution nor corresponding-author markers appear in the byline.

[Read author manuscript.](https://rtcl.eecs.umich.edu/rtclweb/assets/publications/2019/he-www19.pdf) [Author lab publications.](https://rtcl.eecs.umich.edu/rtclweb/publications/)
