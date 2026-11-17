---
id: intelligent-electric-vehicle-charging-recommendation-based-on-multi-agent-reinforcemen
short_title: MASTER
title: Intelligent Electric Vehicle Charging Recommendation Based on Multi-Agent Reinforcement Learning
authors:
- Weijia Zhang
- Hao Liu
- Fan Wang
- Tong Xu
- Haoran Xin
- Dejing Dou
- Hui Xiong
year: 2021
date: '2021-02-15'
publication:
  date: '2021-06-03'
  source_url: https://api.crossref.org/works/10.1145/3442381.3449934
venue: WWW
paper_url: https://doi.org/10.1145/3442381.3449934
institutions:
- University of Science and Technology of China
- Business Intelligence Lab, Baidu Research
- Baidu Inc.
- Rutgers University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Resource Allocation
problems:
- Charging Station Recommendation
- Online Charging Request Allocation
summary: Shared station actors bid for sequential EV charging requests, trained by attentive critics with retrospective
  competition information and adaptive multi-objective weights. Two-city trace-driven simulations evaluate waiting,
  price and failure trade-offs; this is one online allocation task, with important released-code versus paper forecast
  differences.
arxiv_url: https://arxiv.org/abs/2102.07359
code_url: https://github.com/willzhang3/MASTER-electric_vehicle_charging_recommendation
figure:
  path: paper-assets/intelligent-electric-vehicle-charging-recommendation-based-on-multi-agent-reinforcemen/framework.png
  alt: Nearby station actors bid for an EV request, with the highest bid selected; a centralized attentive critic
    trains actors while execution uses local observations.
  caption: 'Original Figure 3: station bidding and centralized training with decentralized actor execution.'
  source_url: http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=4
---

# MASTER: Intelligent Electric Vehicle Charging Recommendation Based on Multi-Agent Reinforcement Learning

> **TL;DR:** MASTER constructs a sequence of charging-station allocations using neural station bids. A centralized training critic uses retrospective competition information; deployed actors use local observations. It is **specialist/constructive**: many agents share a policy for one charging-allocation task, without a neural operator editing a complete incumbent assignment or a checkpoint demonstrated across native problems.

## Motivation

Sending every EV to the nearest or cheapest station can create queues and leave later requests without charging capacity. The task recommends one station per arriving charging request while balancing travel-plus-queue time, unit charging price and failure rate. Realized recommendations affect future station availability. The objective is online resource allocation, rather than producing a TSP route or a globally optimal batch matching. [Problem setting.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=1)

## Contributions

- Charging stations act as agents, avoiding a separately trained policy for each transient driver.
- An attentive critic aggregates the currently active nearby stations during centralized training.
- Delayed experience collection supplies retrospective future competition to the critic, while actor execution does not need that exact future information.
- Two objective critics and adaptive actor-gradient weights address waiting/price trade-offs, with failure penalties in both rewards.
- Trace-driven simulation in Beijing and Shanghai compares the full model, baselines and ablations. [Overview.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=2)

## Methodology

### Sequential station allocation

For a request, only its nearest k stations participate. Each station actor outputs a scalar bid; an argmax selects one recommendation. Parameters are shared across station actors. Local observations include station identity, time, current availability, predicted near-future demand, power, travel time and charging price. Shared weights across hundreds of stations therefore mean one task-specific policy, not hundreds of independently trained policies or a multi-native-problem generalist.

Charging wait time is travel plus queue time until charging begins or the request fails; it excludes the subsequent physical charging duration. The simulator gives reward when an accepted request starts charging or exceeds its waiting threshold. Successful charging occupies a spot for a power-dependent Gaussian duration. A rejected recommendation follows the historical station instead. These acceptance and duration assumptions matter to the resulting allocation process. [Definitions and MDP.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=3) [Simulator.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=11)

### Retrospective critics and actor updates

Each station's observation, action and future-competition representation receive an attention weight, and the pooled representation feeds a centralized critic. Collection of a transition is delayed until its future supply information is available; the current request's own effect is removed from that retrospective information. Rewards accumulate over the elapsed real-time interval, with matching time-dependent discount in the critic target.

The actor only requires its own observation at inference, followed by highest-bid selection among active stations. This removes the training critic and exact future supply from actor execution; it does not remove the need to identify nearby candidates, forecast local demand and compare bids.

Separate CWT and price critics are compared with separately pretrained single-objective reference policies. A softmax of relative critic gaps changes the weights of their actor gradients. Those reference policies are learned approximations called optimal in the paper, not certified global optima. Failure is represented through penalties rather than a third independent critic. [Equations4–15 / Algorithm1.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=4)

### Theory and current implementation boundary

AppendixC PropositionC.1 uses linearity of expected returns to show that the true Q for summed rewards equals the sum of the two true component Q functions, yielding the same formal deterministic-policy gradient for static weights. It does not prove that independently fitted nonlinear critics produce identical gradients or training trajectories, nor guarantee Pareto optimality or convergence of adaptive weighting.

AppendixA says an MLP predicts future demand during evaluation. In the inspected official release, however, `env.py:demand_load` directly counts subsequent15-minute requests from the loaded day's request file; `reset` uses those counts in the actor observation. No separate demand-prediction training/model artifact is present in the five-file tree. This is a specific current-code versus paper-protocol difference, not evidence that the reported original experiments used that code path unchanged. The release also applies normalization/clipping, reference-value scaling and an actor regularizer beyond the abbreviated equations. [Proposition and simulator description.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=11)

## Experiments

### Data, simulation and training budget

Data span May18–July1,2019:596Beijing stations/152,889requests and367Shanghai stations/87,142requests. The chronological split is28training days,3validation days and14test days. Historical availability/prices/power and map-based travel estimates initialize the simulator. Local future demand aggregates the station's1kmgrid and eight neighbors; the evaluation protocol specifies an MLP forecast.

Failure occurs after45minutes; failure rewards are−60for CWT and−2.8for price. Recommendation acceptance follows an empirically estimated probability, with nonacceptors using the original station. These are offline counterfactual simulations using real traces, not measured deployed savings or randomized field experiments.

Training uses top50nearby stations,60iterations, three-layer64-dimensional actor/critic networks, replay1,000, batch32, Adam5e-4, target update0.001, discount0.99, competition step30minutes and weighting temperature0.2. Hardware is a26-core XeonGold5117 and TeslaP40. Best iteration is selected using validation data. Single-objective reference-policy pretraining is an additional prerequisite; total wall time, inference latency and repeated-seed uncertainty are not reported. [Setup.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=6)

### Results with distinct metric denominators

Mean wait time and failure rate are calculated over accepted recommendations; mean price only over successful accepted recommendations. Total saving fee sums price differences times charged quantity for successful accepted requests, divided by evaluation days. These denominators differ and can change with the policy; they are not unconditional improvements for every driver.

| Data | Mean wait | Mean unit price | Saving fee/day | Failure rate |
| --- | --- | --- | --- | --- |
| Beijing MASTER |10.46min|1.512CNY/kWh|16,219CNY|0.9%|
| Beijing historical actions |21.51min|1.749CNY/kWh|not reported|25.9%|
| Shanghai MASTER |11.80min|1.497CNY/kWh|12,497CNY|1.5%|
| Shanghai historical actions |19.31min|1.787CNY/kWh|not reported|16.7%|

The full policy improves the listed learned baselines on the reported aggregate metrics. It does not win every metric against every heuristic: Greedy-P-10has lower mean price in both cities,1.424and1.357, and higher Shanghai saving fee,15,649CNY/day. Thus best comprehensive performance describes a trade-off, not metric-wise dominance or an optimal allocation certificate. [Tables2–3 and metrics.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=7)

### Component and candidate-set analysis

Removing attention or competition information particularly worsens waiting; removing the multi-critic design worsens price/saving metrics. Convergence curves illustrate adaptive weighting in the selected experiment, without a general convergence theorem.

Increasing active candidate count exposes cheaper but more distant stations. For Beijing, k20gives9.56minutes/1.603unit price, while activating all stations gives11.73minutes/1.437. This is a controllable trade-off; enlarging the choice set does not uniformly improve all objectives. Attention case studies show correlations with bids and supply/demand, rather than establish causal explanations. [Ablations and analysis.](http://staff.ustc.edu.cn/~tongxu/Papers/Weijia_WWW21.pdf#page=8)

## Limitations

Evidence concerns one online charging-allocation application and two chronological city datasets. There is no global combinatorial optimality guarantee, certified multi-objective optimum or demonstrated joint transfer to another native optimization task. Shared station parameters and critic cooperation do not change that scope.

Simulator assumptions about acceptance, charging duration, queues and future-demand forecasting affect the numerical conclusions. Historical-action comparisons are counterfactual simulation outputs. Different metric populations complicate simple claims of user benefit. Data/model artifacts needed for the real-data pipeline are absent from the inspected release, which also differs from the stated evaluation forecast protocol. No experiment was independently rerun.

## Reproducibility

- Formal WWW2021 DOI10.1145/3442381.3449934 spans1856–1867. All12author-hosted formal pages were fully read, including49references and scientific AppendicesA–C with simulator details and the proposition. HTTPS access failed; the ordinary HTTP link on the USTC author host returned the actual PDF, with byline/DOI/formal pagination independently identified.
- The seven authors list USTC, Baidu Research, Baidu Inc. and Rutgers. Hao Liu and Hui Xiong are explicitly corresponding authors. Weijia Zhang's dagger identifies an internship under Hao Liu, not equal contribution. Deposited metadata distinguish print2021-04-19from electronic publication2021-06-03; the latter is the publication date here. Primary arXiv history gives v1on2021-02-15; no unexamined arXiv PDF is claimed as a reading source.
- The formal appendix's Vvrep repository now resolves to the official willzhang3 repository. Commit e7bd09a87f55b954ce149178a87f5a67e645710e has five files:README and four Python modules. The complete README, all-file inventory and ordinary empty releases page were inspected, with relevant simulator, forecast-input, actor/critic and training controls checked. No extra scientific PDF/TeX/archive/notebook exists. Historical data under `../exp_data` and pretrained reference-model artifacts are not included; a synthetic debug mode is documented.
- The current source's temperature5corresponds to reciprocal0.2in the printed softmax, rather than a contradictory temperature value. Source-specific scaling/regularization and hindsight demand counts are disclosed without claiming code equivalence or a full implementation audit.
- Original Figure3 is cropped from PDFpage4, rectangle(48,80,300,251), at5x and actually viewed in full. All10figures, all3tables, Algorithm1 and key method/proposition equations were rendered and visually inspected.
- Three internal relations have explicit body citations and matching full references: the WWW mean-field ridesharing paper, KDD dynamic-bike repositioning and KDD large-scale fleet management. Other application/control references are not forced onto unrelated catalogue IDs.
