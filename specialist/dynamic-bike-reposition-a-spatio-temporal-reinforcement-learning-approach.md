---
id: dynamic-bike-reposition-a-spatio-temporal-reinforcement-learning-approach
short_title: STRL
title: 'Dynamic Bike Reposition: A Spatio-Temporal Reinforcement Learning Approach'
authors:
- Yexin Li
- Yu Zheng
- Qiang Yang
year: 2018
date: '2018-07-19'
publication:
  date: '2018-07-19'
  source_url: https://api.crossref.org/works/10.1145/3219819.3220110
venue: KDD
paper_url: https://doi.org/10.1145/3219819.3220110
institutions:
- The Hong Kong University of Science and Technology
- Urban Computing Business Unit, JD Finance
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Resource Allocation
problems:
- Dynamic Bike Repositioning
- Multi-Trike Bike Rebalancing
summary: Classical region/cluster decomposition and separate neural state–action value models choose asynchronous
  trike destinations and bike quantities. Historical-data simulation reports lower lost demand in two busy clusters;
  heuristic pruning, approximate cluster independence and incomplete training specifications qualify the results.
figure:
  path: paper-assets/dynamic-bike-reposition-a-spatio-temporal-reinforcement-learning-approach/framework.png
  alt: Shared region embeddings and fully connected layers predict a trike action value from state, action and episode
    time.
  caption: 'Original Figure 9: the STRL long-term value network.'
  source_url: http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=7
---

# Dynamic Bike Reposition: A Spatio-Temporal Reinforcement Learning Approach

> **TL;DR:** STRL chooses the next region and signed loading quantity for a repositioning trike. Classical clustering reduces the system, and a separate neural value model is trained per cluster. It is **specialist/constructive**: asynchronous online relocation choices do not edit a complete incumbent plan.

## Motivation

Empty bike stations and full docks cause customer loss, while individual repositioning moves influence later rentals, returns and future truck moves. The method learns long-term, state-dependent relocation decisions instead of executing a fixed schedule. Its objective is simulated failed rental/return demand, not simply shortest routing distance. [Problem setting.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=1)

## Contributions

- Two-stage grouping first forms nearby functional regions, then applies Inter-Independent Inner-Balance (IIIB) clustering.
- Demand and destination/time predictors generate an interactive rental/return/repositioning simulator.
- A neural state–action value model selects asynchronous trike moves within each cluster.
- Two heuristic spatial/temporal pruning rules reduce the candidate-action space. [Framework.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=3)

## Methodology

### Classical decomposition and simulator

Nearby stations with similar transitions form regions through bipartite clustering. For an episode, frequent transitions define a region graph; community detection and agglomerative merging trade off geographical distance against improvement in demand balance. Inner balance and cross-cluster independence are approximate goals. The reported clusters still have roughly 10% inter-cluster commutes, which are ignored; the method does not prove exact decomposition without loss.

Five episode settings reflect morning rush, daytime, evening rush, travel and evening periods. These windows overlap, so they are not a disjoint partition of a day. Each setting has its own clustering. Repositioning does not deliver bikes across clusters.

The O-Model predicts rental demand with a similarity-weighted KNN over historical time/weather periods; Poisson arrivals generate rental events. The I-Model samples destination regions and travel times for rented bikes and tracks their returns. A renter finding an empty region leaves immediately; a returner finding no docks moves to the nearest neighboring region. Repositioning duration combines travel, fixed loading time and noise. These assumptions determine what customer loss means in the evaluation. [Clustering and simulator.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=4)

### Neural decisions and training

Whenever a trike completes a move, it immediately receives another action, without waiting for other trikes. The action specifies a destination region and a signed number of bikes to load or unload. Observation features combine predicted bike availability, other trikes' planned loading/unloading, current location and carried inventory. An interleaved history of observations/actions plus time forms the state.

Region one-hot vectors use a shared embedding; remaining numeric features and embeddings feed fully connected layers to predict a state–action value. The trikes within a cluster share one policy, but different clusters use different networks. This does not establish a common checkpoint across native problems or even across all clusters. Immediate reward is negative customer loss over the transition; replay mini-batches and temporal-difference targets train the value network.

Pruning permits delivery to predicted severely deficient regions and pickup from predicted congested regions, restricts destination candidates to nearby regions and discretizes the quantity. Thus even initial exploration follows a prediction-based heuristic rather than unrestricted random actions. The learned policy is not guaranteed globally optimal within the unpruned problem. [STRL and network.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=6)

## Experiments

### Data and budget

Citi Bike data cover April–October 2016, with 9,846,248 recorded rides, 389 stations and 98 regions grouped into four clusters. Latent rental demand is estimated from observed rentals divided by the fraction of a period with available bikes. Evaluation focuses on morning rush-hour simulation in the two busy clusters C1 and C3. The other two clusters have fewer than 50 lost customers in the reported simulation and are considered adequately served by a simple heuristic; detailed learned-policy results are not supplied for them.

Each training epoch contains 500 simulated episodes; the plotted run lasts 45 epochs, or 22,500 episode simulations for that cluster. Exploration decreases from 1 to 0.1. The included appendix gives C1 four trikes of capacity 10, speed 200 m/min, three-minute loading, reposition noise printed as N(0,3), one-hour forecast periods, one-minute simulation windows, quantity step 5, embedding width 30 and FC widths 64/32. Exact optimizer, learning rate, replay capacity, discount, history length, hardware and wall time are not supplied. No clear held-out chronological split or repeated-seed uncertainty accompanies the final loss table. [Evaluation.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=8) [Included appendix.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=10)

### Results and comparison boundaries

For C1/C3 combined, STRL loses 291 customers versus 553 without repositioning, 407 with prediction-constrained random moves, 456 with current-state greedy moves, 395 with prediction-based greedy moves and 427 with the optimization baseline. This is about 47.4% less loss than no repositioning and 26.3% less than prediction-based greedy under this simulation. The main result is not a system-wide field measurement.

The optimization baseline replaces k trikes with one vehicle having k times the speed and capacity to fit a static formulation, so its physical fleet and optimization protocol differ. It is not an equal-budget exact solution to the same dynamic problem. STRL surpasses the plotted C1 greedy reference after roughly 30 epochs; without pruning, loss barely improves within 45 epochs. This shows the importance of the restricted search space for the tested budget, not a proof that an unpruned method cannot learn with more training. [Table 6 and Figures 11–13.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf#page=8)

## Limitations

Approximate region independence, within-cluster restriction, demand-estimation errors and simulated customer behavior can change the task. No certified optimality, live randomized deployment or general cross-city transfer is demonstrated. The time-dependent output cutoff is not fully clear: the method describes rho2 near the episode end, while the appendix lists 20 minutes. The appendix is introduced as Table 7 but captioned Table 6, duplicating the result-table number. These source ambiguities are retained rather than resolved by invention.

## Reproducibility

The first author's homepage explicitly links the ten-page urban-computing manuscript read here, which has the correct KDD 2018 title, three authors and DOI. All pages, 20 references and the included scientific appendix were read. The official KDD entry and author homepage were inspected; no additional necessary scientific appendix or official code release was identified. Public title/arXiv/code searches did not yield a corresponding arXiv identifier. An unrelated public Mobike project holding a copy of the paper is not presented as the authors' implementation.

The byline identifies HKUST and JD Finance, with no equal-contribution or corresponding-author marker. The publisher-deposited online/print publication date is July 19, 2018; the conference took place in August. Original Figure 9 was cropped from page 7 (55,462–298,595 at 5×), with the method, result tables and appendix visually checked. No benchmark was rerun. The bibliography contains no confirmed reference to another current catalogue entry, so no internal relation is forced.

[Read author manuscript.](http://urban-computing.com/pdf/KDD2018dynamic-bike-reposition.pdf) [First-author publication page.](https://liyexn.github.io/)
