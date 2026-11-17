---
id: ws-option
short_title: WS-option
title: Sequential Stochastic Combinatorial Optimization Using Hierarchical Reinforcement Learning
authors:
- Xinsong Feng
- Zihan Yu
- Yanhai Xiong
- Haipeng Chen
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/38b787fc530d0b31825827e2cc306656-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/38b787fc530d0b31825827e2cc306656-Abstract-Conference.html
institutions:
- University of California, Los Angeles
- The University of Hong Kong
- William & Mary
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Routing
problems:
- Influence Maximization
- Stochastic Route Planning
summary: Task-specific hierarchical Q-networks construct budgeted adaptive node sets and profit routes; same-task
  size transfer and conditional tabular theory have explicit limits.
code_url: https://github.com/wmd3i/HRL4SSCO
---

# Sequential Stochastic Combinatorial Optimization Using Hierarchical Reinforcement Learning

> **TL;DR:** WS-option learns daily budget allocation and sequential node selection with separate hierarchical Q-networks, using a fixed-budget warm-up, high-level Monte Carlo returns and low-level TD learning. Task-specific models transfer to larger graphs. The tabular conditional analysis does not guarantee convergence/global optimality of the finite neural co-training procedure.

## Motivation

Sequential stochastic combinatorial optimization(SSCO) must decide both how much limited resource to spend now and which subset to choose, accounting for later uncertainty. Uniform budgets can waste resources. The two-layer policy learns adaptive resource allocation while retaining manageable node-wise actions (Sections1–3).

## Contributions

- A high-level budget decision and lower-level sequential subset selector formulate adaptive SSCO.
- Wake–sleep training first fixes average allocation, then jointly trains both policies; high-level MC and low-level TD updates aim to reduce unstable bootstrapping.
- Adaptive influence maximization(AIM) and stochastic reward route-planning(RP) experiments assess layer ablations and within-task graph-size transfer (Sections3–4/AppendicesA–D).

## Methodology

**Tasks.** AIM selects seed nodes over Tdays under total budget K. A directed independent-cascade process activates each inactive neighbor with probability1/indegree, with active nodes able to propagate only on the next day; reward counts newly influenced nodes. Synthetic directed Erdős–Rényi graphs use edge probability.01. RP selects cities over Tdays with dynamically perturbed profits, subtracting.1×(daily city count−1)²and soft excess-distance penalties. Initial profits are uniform.5–1, changes uniform−.05to.05, and the daily distance threshold is1.5times maximum pair distance with penalty coefficient5. This is stochastic prize collection with soft travel penalties, not shortest-path minimization or a standard hard-feasible TSP (Section2/AppendicesC.2–C.3).

**Policies.** The higher network scores a candidate allocated budget as an input, permitting a variable budget action set; graph mean pooling supplies context. The lower network scores candidate nodes and a null action; its simplified option is continue/stop. AIM uses structure2vec: three64dimensional message-passing rounds at the higher level and one at the lower. RP uses three/one attention layers plus current/start-node context. Separate architectures/models are trained per native problem, so graph-size transfer does not imply shared AIM/RPweights (Section3/AppendixC.1).

**Rewards and training.** Marginal node rewards use simulator estimates(typically ten simulations in the paper), then normalize to sum to the high-level realized reward after a null-action contribution. This provides shaped substep credit, with substantial simulator access, not just one black-box observed reward per decision. The first half of20epochs fixes average allocation while pretraining the high-level values from those trajectories; the second jointly updates both layers. Each epoch has ten episodes, batch32, γ.99and target updates every ten episodes. Epsilon decays.9×.98per update to a **positive floor.1**. High-level returns use MC regression; lower learning uses DDQN-style TD. Code tests also expose beam search, so neural policy evaluation need not be a single greedy pass (Sections3.2–3.3/Algorithms1–3/AppendicesB/C.4).

**Theory and scope.** Theorem1assumes a fixed higher policy; Theorem2assumes the lower policy always supplies its conditionally optimal response for every higher policy. The paper explicitly limits analysis to tabular values. Finite warm-up and empirical similarity of different best responses do not establish these exact assumptions for changing neural models. Specialist / constructive is retained: each task trains independently and the NN incrementally creates subsets/routes rather than editing a complete incumbent.

## Experiments

**Main comparisons.** AIMn200/T10,K10/20/30andT20,K10reports rewards76.00/118.56/129.06/80.95versus best listed heuristics75.05/118.13/128.29/80.31. Some gains are therefore modest, e.g.118.56versus118.13. RPn100reports7.46/12.86/18.57/7.52versus greedy6.29/12.02/15.68/6.73andGA6.79/11.65/15.70/6.93. Layer-fixed comparisons support useful learned allocation and selection; they use different reported reward realizations from the headline table (Tables1–3).

**Transfer.** A separately trained small-graph model(50–100nodes,T10,K20) is evaluated at200/400/700/1000nodes. AIMrewards120.88/176.13/204.87/221.16exceed baselines, but the1000node normal-score reward220.81is close. RP14.45/13.48/14.49/14.23exceeds the listedgreedy/GAruns. A power2500network test reports496.37versus462.54normal-score. These show empirical same-task size/topology transfer; architecture size independence by itself is not an approximation or universal generalization guarantee (Section4.4/AppendicesD.3–D.4).

**Ablations/statistics/compute.** Sleep fractions1/2and2/3give118.56/118.59, while1/3drops104.84, below several heuristics. Simplified versus numerical options give118.56versus116.37on the displayed setting. These ablations use the same random seed, rather than establishing a distributional advantage across seeds. Tables repeatedly assert two-sample p≤.05but omit per-cell deviations/raw test details; significance does not measure effect size or replace variability reporting. Experiments useRTX4090/i9andV100/Xeon setups. No comprehensive end-to-end runtime/training-simulation budget table substantiates a universal computational-speedup claim (AppendicesC.4–C.5/D.5–D.6).

## Limitations

### Discussed in the Paper

Each new native problem needs a new graph embedding. Two learned layers can interfere, and insufficient lower-level warm-up hurts performance. Convergence discussion is tabular and conditional, with neural applicability assessed empirically (Sections3.3.3/5/AppendixA).

### Curator Notes

- Theorem2's proof asserts `E[q_t−MCreturn]=0` from an optimal lower response. That response alone does not make an arbitrary current estimate equal its expected return, nor make returns under an exploring current higher policy equal optimal control values. State-action visitation, stochastic-approximation step sizes and policy improvement/GLIE conditions require further treatment. The γcontraction discussion also does not prove finite neural coupled training converges globally.
- Budget irrelevance is not a general SSCO fact. For coverage sets A={1,2,3,4},B={1,2,5},C={3,4,6}, a one-item optimum uniquely choosesA, whereas a two-item optimum chooses{B,C}. A lower policy seeing identical preselection features and only a binary continue flag cannot choose a universally optimal first item for both budgets. This bounds the general information-compression claim; it does not invalidate reported AIM/RPresults or deny its practical regularization benefit.
- Equation4needs a nonzero marginal-sum convention. The released AIMcode uses20simulations, clips negative estimated marginals and adds10⁻⁵regularization/zero-effective-budget handling, differing from the printed ten-simulation normalization. Algorithm3also prints a return discount exponent indexed from global1rather than the current time; code uses the usual recursive return.
- Frozen and currentRP`Env.step([])` return before advancing time/updating profits, which should be checked against intended empty-budget days. The currentRPPscript creates aGAobject but itsGA-labelled loop calls `greedy.run()`. These are release-reproduction issues, not evidence that every formal baseline result used that path. Beam width/expansion settings and simulation calls must be included in any future timing replication.
- Figure7copies individual policy reward labels from the precedingK10figure despite a different overall mean; those labels are not independent quantitative evidence forK20.

## Reproducibility

The [formal ICLR2025 proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/38b787fc530d0b31825827e2cc306656-Abstract-Conference.html) give2025-05-01andpp22563–22589. Formal p1spells **Hierarchical** while the publisher metadata/event use **Hierarchal**; this note follows the PDF and records the identity-preserving spelling difference. All27formal pages, proofs, algorithm appendices, full bibliography and plots/tables were read and key pages rendered.

The publisher-linked16.63MBsupplement ZIPwas downloaded/inventoried(43members): Python implementations, graph datasets and two short READMEfiles, with no extra scientific PDF/TeX/notebook. Both READMEs and relevant frozen network/environment/update/evaluation code were inspected. The [official implementation repository](https://github.com/wmd3i/HRL4SSCO) identifies the study and was checked through its complete14-entry tree, READMEand core current code. The frozen ZIPand current repository differ; neither is claimed to have been rerun. The event30618links OpenReviewAloCXPpq54and no extra slide/poster file; the APIreturned403.

**Internal citations.** Exact text/reference identities verify [RL-VRP](rl-vrp.md), [Neural CO](neural-combinatorial-optimization.md) (cited2016arXiv version), [Attention Model](attention-model.md), [Learning CO over Graphs](learning-co-over-graphs.md), [NeuRewriter](neurewriter.md), [Learning Heuristics](learning-heuristic.md), [Learning to Improve](learning-to-improve.md), [Efficient Active Search](efficient-active-search.md), [Att-GCN](att-gcn.md) and [POMO](pomo.md). Source bibliography years sometimes describe earlier versions; they are not copied as the targets' formal publication dates.
