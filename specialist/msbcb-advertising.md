---
id: msbcb-advertising
short_title: MSBCB
title: Dynamic Knapsack Optimization Towards Efficient Multi-Channel Sequential Advertising
authors:
- Xiaotian Hao
- Zhaoqing Peng
- Yi Ma
- Guan Wang
- Junqi Jin
- Jianye Hao
- Shan Chen
- Rongquan Bai
- Mingzhou Xie
- Miao Xu
- Zhenzhe Zheng
- Chuan Yu
- Han Li
- Jian Xu
- Kun Gai
year: 2020
date: '2020-11-21'
publication:
  date: '2020-11-21'
  source_url: https://proceedings.mlr.press/v119/hao20b.html
venue: ICML
paper_url: https://proceedings.mlr.press/v119/hao20b.html
institutions:
- Tianjin University
- Alibaba Group
- Tsinghua University
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Resource Allocation
problems:
- Dynamic Knapsack
- Sequential Advertising
summary: A scalar budget threshold coordinates neural long-term bidding values and greedy user selection; binary
  exposure decisions reduce bid exploration, with conditional theory, simulated knapsack comparisons and a
  limited advertiser A/B deployment.
code_url: https://github.com/tjuHaoXiaotian/ICML-2020-MSBCB
figure:
  path: paper-assets/msbcb-advertising/framework.png
  alt: A shared feature-embedding bottom feeds long-term purchase-probability and zero-inflated cost branches,
    each for display and non-display actions.
  caption: 'Supplementary Figure 12: deployed long-term value prediction architecture.'
  source_url: http://proceedings.mlr.press/v119/hao20b/hao20b-supp.pdf#page=5
---

# Dynamic Knapsack Optimization Towards Efficient Multi-Channel Sequential Advertising

> **TL;DR:** MSBCB combines learned per-user long-term bidding values with a scalar budget threshold and greedy user selection. Its binary display/no-display reduction improves sample efficiency in simulation; a Taobao A/B test reports higher advertiser revenue. **Specialist/constructive:** it makes sequential allocation/bidding decisions for one application, rather than editing a complete knapsack incumbent or demonstrating a shared solver for other combinatorial problems.

## Motivation

Several ad exposures across channels may precede a purchase. Optimizing only the immediate value of each request can miss earlier exposures' contribution to later revenue. A single huge constrained MDP over all requests is also difficult to learn. The paper separates each user's sequential interaction policy from the advertiser's budget allocation across users, under the assumption that serving one user does not directly change another user's behavior. [Sections1–2.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=1)

## Contributions

- A dynamic-knapsack formulation treats users as indivisible items whose expected cumulative value and cost depend on their bidding policies.
- A threshold-based decomposition uses a per-user surplus reward and a scalar feedback-controlled budget multiplier, replacing explicit search over all binary user subsets.
- Binary display/no-display values yield an executable bid formula under the assumed second-price auction model, reducing continuous-action exploration.
- Simulation separates learned policies, exact per-user policy enumeration and an offline dynamic-programming reference; an online experiment evaluates a limited group of advertisers. These results have distinct optimality and generalization scopes.

## Methodology

### Two coupled levels

For user i and policy pi_i, `V_G` and `V_C` are expected cumulative revenue and advertising cost over that user's interaction sequence. The objective selects users x_i in{0,1} and policies to maximize `sum x_i V_G(i|pi_i)` subject to `sum x_i V_C(i|pi_i) <= B`. For fixed policies, this is a static0–1 knapsack; it is called dynamic because policies change item values/costs. “Multi-channel” does not establish a cross-problem generalist model. [Section2.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=2)

Given threshold lambda=`CPR_thr`, the lower level maximizes each user's **surplus**, `V_G-lambda V_C`, rather than independently maximizing the revenue/cost ratio. It trains on immediate reward `v_t-lambda c_t`. A user episode starts at first interaction and ends at purchase or a maximum sequence length. State includes user/ad information, interaction history and auction context; the original action is a bounded continuous bid. Neural estimates of revenue/cost support selecting users with expected revenue/cost at least the threshold. [Sections3.1–3.3.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=4)

The upper level updates the threshold from current and recent-period spend relative to budget: overspending raises it and underspending lowers it. The paper calls this a PID controller; the printed update is a multiplicative combination of current and averaged historical budget error. This controller and policy-parameter training are not neural moves on a complete incumbent allocation. [Algorithm1/Equation8.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=6)

### Binary action reduction

Different bids determine whether an exposure is won. The model estimates `Q_G(s,display)` and expected future cost for display/no-display, compares their surplus, and converts that comparison to a bid. For CPM, the bid is the revenue-value difference divided by lambda, minus the future-cost difference. CPC/CPS versions incorporate click/conversion probabilities into immediate payment. With exact values, positive lambda and the assumed second-price rule, bidding this boundary implements the preferred win/lose action without knowing the market's second price in advance. [Equations9–12 and supplementary Theorem3.](http://proceedings.mlr.press/v119/hao20b/hao20b-supp.pdf#page=3)

This is not a regret bound for imperfect neural predictions or arbitrary first-price/multi-slot mechanisms. It presumes payment conditional on winning is independent of one's own bid as modeled, appropriate handling of feasible bid bounds/ties, and suitable value estimates. The released simulator clips bids and uses probability-scaled CPC-style predictions; those implementation choices are distinct from the ideal algebraic statement.

### Neural deployment model

The online model shares feature embeddings and pools historical user-behavior embeddings, then branches into long-term revenue and cost predictions for display/no-display. Revenue is purchase probability times item price. Cost uses a zero-inflated decomposition, probability of positive cost times its conditional expectation; classification and regression losses address sparse costs. Features cover the preceding7–14 days; Monte Carlo labels use the following7 days, while the described TD alternative bootstraps future values. [Supplementary SectionsC.1–C.2/Figure12.](http://proceedings.mlr.press/v119/hao20b/hao20b-supp.pdf#page=5)

The simulation release is a separate implementation: two GMV/future-cost MLPs, user-ID embeddings, nonnegative outputs, Monte Carlo replay losses, gamma1, Adam learning rate.001, batch512 and10 updates per training call in the entry configuration. Its shared-feature details should not be substituted for the production architecture. The public entry point trains1,000 episodes and limits user requests to7; the README supplies10,000-user/budget12,000 commands.

## Experiments

### Controlled simulation

The simulator has10,000 users,2,000 ads and20 interest categories, with budget12,000. Ad consumption updates synthetic user interests; requests come from a stable distribution. Results average10 runs, with best-found grid-search hyperparameters. The paper reports a dual-CPU server and two TeslaM40 GPUs, but does not provide a complete matched-wall-time accounting. DQN/PPO bid baselines discretize the bid interval into11 actions; DDPG keeps continuous bids, while MSBCB learns the binary exposure decisions. [Section4 and supplementary SectionD.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=7)

Table1 reports MSBCB revenue87,947.99, cost11,957.57 and **+17.95±.42%** revenue versus Contextual Bandit. Its offline-optimal ratio is **98.50±.33% in the table**; nearby prose reports98.53±.36%, so the two are not silently combined. Greedy+maxCPR reaches83,668.70, confirming that independently maximizing user ratios is not the best observed budget-wide policy. [Table1.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=8)

MSBCB(enum) enumerates per-user policies and reaches89,251.77, or99.96% of the offline DP reference89,291.11. This enumeration-assisted variant is not the learned neural solver, and the offline reference requires information unavailable to live bidding. Supplementary Table5 reports53.3% exactly optimal per-user learned policies,21.6% in[90%,100%) and25.3% below90%; these printed rounded percentages sum to100.2%, and do not imply all neural policies are exact.

To reach revenue75,000, MSBCB takes61 epochs/312,320 samples, compared with DDPG154/788,480, DQN373/1,909,760 and PPO817/4,183,040. At80,000 it takes71 epochs versus DQN754 and DDPG853; only MSBCB reaches85,000 in the reported threshold table, at104 epochs. These are **training sample/epoch comparisons**, not measured end-to-end speedups. [Table2/supplementary Table6.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=9)

### Online A/B test

From2019-12-10 to2019-12-20,135,858,118 users are randomly/evenly divided into three groups, with72,147 ad items from186 advertisers using CEM, Contextual Bandit or MSBCB per group. Relative to **CEM**, aggregate MSBCB revenue is+10.08%, cost−.20%, conversion rate+6.04%, page views+15.37% and ROI+10.31%. These are the authors' production experiment results, rather than an offline logged-policy evaluation. [Section5/Table3.](http://proceedings.mlr.press/v119/hao20b/hao20b.pdf#page=9)

The supplementary advertiser analysis instead compares with **Contextual Bandit** and includes advertisers with over100 weekly conversions. It reports85.1% with positive ROI changes and14.9% with negative changes; one top-cost advertiser has ROI−1.8% despite page views+31.5%. Higher page views may be useful, but the suggested later revenue benefit is not established by that observation alone. Channel allocation and longer interaction sequences are additional descriptive analyses. [Supplementary SectionE/Table7/Figures19–21.](http://proceedings.mlr.press/v119/hao20b/hao20b-supp.pdf#page=11)

## Limitations

The guarantees are conditional. Greedy's near-optimal knapsack ratio requires every item cost to be a sufficiently small fraction of the advertiser budget. The supplementary platform statistics report an **average of per-ad maximum user-cost ratios** plus five large advertisers; they do not prove the required bound for every possible advertiser. Theorem1's area argument also treats displaced budget near the threshold as a small/smooth change, rather than solving every finite indivisible knapsack exactly. [Section3.1/supplementary B.1.](http://proceedings.mlr.press/v119/hao20b/hao20b-supp.pdf#page=2)

The convergence discussion assumes lower-level RL reaches its optimum and sufficiently small learning rates. Its diagram and empirical curves do not establish general neural optimization convergence, a specified PID stability region or uniqueness for arbitrary discrete environments. Learned prediction error and unrealizable bids can weaken the ideal binary-reduction result.

Only186 advertisers—about.2% of advertisers in the business setting described—use the new strategy. The authors rely on an approximately stationary environment for one advertiser and explicitly identify widespread adoption as requiring multi-agent modeling/coordination. The evaluation does not demonstrate stationarity or improvement when the whole market simultaneously changes policies. Production logs, counterfactual value identification, complete model/training settings and exact confidence intervals for the aggregate online comparison are not released here.

## Reproducibility

- [Official PMLR record](https://proceedings.mlr.press/v119/hao20b.html) lists15 authors, ICML2020/PMLR119 and publication date2020-11-21. The first three authors contribute equally; affiliations are Tianjin University, Alimama/Alibaba, Tsinghua and Shanghai Jiao Tong, with Junqi Jin/Jianye Hao corresponding. No inferred acceptance date is added.
- Both publisher files were read completely:11-page main paper and12-page supplement, covering all proofs, deployment architecture, simulation and advertiser analyses. The publisher manually exposes exactly the paper, this scientific supplementary PDF and the software link; the supplement points to the same official repository.
- [Official implementation](https://github.com/tjuHaoXiaotian/ICML-2020-MSBCB), tree SHA `d8b0a37585985cb22bc12d2e60bb63dca874cdb3`, supplies simulation, agents/baselines, replay and plotting code. The73-entry recursive tree contains no additional scientific PDF/archive; the README, main MSBCB learner and bid/PID paths were inspected. Production data/model deployment are not supplied by this simulation release.
- Dependency pins mix `tensorflow_gpu==1.5.0`/`tensorflow_tensorboard==1.5.0` with `tensorflow==2.1.0`/`tensorboard==2.1.0`; the source uses TF1 placeholders/contrib, so the requirement list is not a validated modern environment. The entry point disables visible GPUs despite the paper's server hardware report. No training, online test or full table reproduction was rerun during this review.
- Complete main/supplementary bibliographies and their in-text uses were checked against the frozen catalogue; no matching internal primary-paper identity was found, so no relation was invented. The framework image is an original crop of supplementary Figure12.
