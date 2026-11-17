---
id: egate
short_title: EGATE
title: Learn to Design the Heuristics for Vehicle Routing Problem
authors:
- Lei Gao
- Mingxiang Chen
- Qichang Chen
- Ganzhong Luo
- Nuoyi Zhu
- Zhixin Liu
year: 2020
date: '2020-02-20'
venue: IJCAI HSI Workshop
paper_url: https://arxiv.org/abs/2002.08539
arxiv_url: https://arxiv.org/abs/2002.08539
code_url: https://github.com/water-mirror/NeuLNS
institutions:
- WaterMirror Inc.
figure:
  path: paper-assets/egate/framework.png
  alt: Original EGATE figure shows feature-wise edge-aware message weights and stacked encoder layers followed by mean pooling.
  caption: 'Figure 1: element-wise graph attention with edge embeddings and pooled solution encoder.'
  source_url: https://arxiv.org/pdf/2002.08539v1#page=4
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Capacitated Vehicle Routing Problem with Time Windows
summary: EGATE encodes incumbent routes and edge attributes, then a GRU chooses an ordered removal list; classical least-cost reinsertion and simulated annealing implement local improvement, with separate CVRP/CVRPTW models and substantial multitrajectory budgets.
inclusion: reference
inclusion_reason: Workshop-track publication outside the approved main-conference criteria.
publication:
  date: '2020'
  source_url: https://arxiv.org/abs/2002.08539
---
# Learn to Design the Heuristics for Vehicle Routing Problem

> **TL;DR:** EGATE represents the **current complete routing solution**, and a GRU pointer selects an ordered list of customers to remove. A classical least-cost heuristic reinserts them in that learned order; simulated annealing accepts candidates during repeated improvement. Strongest results use **100/256/192 parallel trajectories**, rather than one run at the same total move budget as every baseline. **Workshop/reference-only status is retained.**

## Motivation

Large-neighborhood search depends on which customers are removed and the order in which they are reinserted. Selecting only a single relocate action restricts the neighborhood; a learned multi-customer sequence can explore a larger one. The network incorporates demands, route state and travel edges rather than constructing a route solely from static coordinates. The method still uses a hand-designed LNS skeleton, feasible insertion rules and simulated annealing. [Sections 1-3.](https://arxiv.org/pdf/2002.08539v1#page=2)

## Contributions

- **Element-wise GAT with Edge-embedding (EGATE)** integrates node and edge attributes into feature-wise message weights.
- A GRU pointer policy chooses a distinct ordered removal list, coupling destruction selection with insertion order.
- Actor-critic/PPO learns the sequence policy from improvements without optimal-solution labels.
- Evaluates separate CVRP and CVRPTW models, including a 400-node CVRPTW setting. The claim that all expert heuristic design is eliminated is stronger than the implemented learned component. [Sections 3-4.](https://arxiv.org/pdf/2002.08539v1#page=3)

## Methodology

### State and feature-wise attention

The paper's CVRPTW node features include time-window bounds, demand, route total/cumulative demand, cumulative travel distance/time and forward slack. Edges encode travel distance plus whether the arc occurs in the incumbent. Node/edge attributes are linearly embedded. A concatenation of source node, destination node and edge features produces a **vector** of attention weights, normalized across neighbors per feature; element-wise weighted messages update node representations. The paper includes a residual term and keeps extended edge embeddings fixed across stacked layers. Mean pooling produces a solution-level representation. [Equations 1-6/Figure 1.](https://arxiv.org/pdf/2002.08539v1#page=3)

The standard setting has **two EGATE layers, node/decoder/critic width 64 and edge width 16**. The 400-node setting changes to three layers and sparse encoder attention, retaining the nearest 10% of nodes plus selected incumbent-route/depot connections. Sparse encoding is a computational choice; it is not a proof of feasible route construction or global search coverage.

### Learned ordered removal, classical repair

The GRU starts from a pooled solution representation and repeatedly points to a customer, masking previously selected customers. Its output is **one ordered list**. Remove those customers, then apply least-cost insertion sequentially in that same order. The policy learns both the removal subset and reinsertion order, but does **not** directly choose every insertion location; the latter is supplied by the classical heuristic. [Equations 7-8/Figure 2.](https://arxiv.org/pdf/2002.08539v1#page=4)

Actor-critic training uses a state-value network and PPO clipped objective, with epsilon=.2. The intended reward is cost reduction. Equation 9 prints **new cost minus old cost**, despite calling it a reduction; inspected official training/evaluation wrappers instead use **old minus new**, consistent with rewarding improvement. This sign discrepancy is retained as a source qualification. [Equations 9-12.](https://arxiv.org/pdf/2002.08539v1#page=5)

The paper writes cost as distance plus a vehicle-count weight. Its acceptance rule favors fewer vehicles or applies a simulated-annealing distance threshold, allowing some worsening moves. The algorithm separately retains a best solution. The current environment code constructs an initial solution through classical reinsertion, removes/reinserts the selected list, and applies a cost-based annealing test. These are incumbent moves, not training-time adaptation of a constructive decoder. [Equation 13/Algorithm 1.](https://arxiv.org/pdf/2002.08539v1#page=6)

Classification remains **specialist / improvement**. CVRP and CVRPTW use different state features and separate learned models. The GRU's autoregression generates a local-search action, rather than a whole solution from an empty route. A common EGATE architecture does not establish shared weights across tasks.

## Experiments

### Tasks, training and budgets

The base synthetic instances have **100 nodes including the depot**, coordinates in a 100-by-100 map, customer demands 1-9 and capacity 100. CVRPTW adds time-window/service constraints; depot window is [0,300], service time ten and unit travel speed. The text specifies start/due ranges but does not fully resolve every instance-generation feasibility detail. The study uses **100 test instances** per comparison and no public CVRPLIB/Solomon benchmark. [Section 4.1.](https://arxiv.org/pdf/2002.08539v1#page=6)

Training runs **1,000 epochs**, with **128 generated instances per epoch**, 20 rollouts and ten TD samples per rollout. Batch size is 64, Adam learning rate 3e-4. The reported machine has **two RTX2080Ti GPUs and 40 CPU cores**; evaluation uses one GPU, and the 400-node experiment uses 32 CPU cores. Hyperparameters were chosen to keep training within about 100 hours; the arXiv-v1 text does not provide a complete measured training-time breakdown. [Section 4.2.](https://arxiv.org/pdf/2002.08539v1#page=7)

Most compared LNS methods run 1,000 iterations; SISR also runs 200,000 or one million. The neural model's suffix is material: **EGATE100/256/192** means multiple stochastic trajectories/candidates per instance and selection of the minimum. One thousand iterations with 256 trajectories is not the same total search budget as one thousand single-trajectory classical iterations. Iteration-axis convergence plots do not establish a matched wall-clock speedup. AM also uses its own greedy/1,280-sample settings. [Section 4.3.](https://arxiv.org/pdf/2002.08539v1#page=7)

### Actual table results

| Setting | Single EGATE, 1k iterations | Multitrajectory EGATE, 1k iterations | Strong SISR reference |
| --- | --- | --- | --- |
| CVRP100 | 1,148.79 | 1,078.16, 100 trajectories | 1,071.91 at one million iterations |
| CVRPTW100 | 2,537.23 | 2,415.16, 256 trajectories | 2,419.01 at one million iterations |
| CVRPTW400 | 7,146.05 | 6,924.70, 192 trajectories | 6,630.10 at one million iterations |

Single EGATE is **not best among every 1k baseline**: CVRP SISR-1k is **1,140.38**, and AM-1280 is **1,144.64**, both better than 1,148.79. In CVRPTW100, ALNS-1k **2,533.50** is slightly better than single EGATE. The strong multi-trajectory CVRP result has about **.58%** gap to SISR-1M. CVRPTW100's multi-trajectory result is slightly better than that selected reference, without being an exact optimum. At CVRPTW400, a roughly **4.44% residual gap** remains. [Tables 1-3.](https://arxiv.org/pdf/2002.08539v1#page=7)

SISR-1M is a heuristic best reference, not a proven global optimum; a negative gap relative to it does not beat the true optimum. The paper's broad superiority wording must be read with trajectory counts and baseline settings. Its 400-node result changes encoder depth/masking, so it is not evidence of unchanged-checkpoint transfer from the two-layer 100-node setting. No comprehensive worst-case/uncertainty or feasibility-rate study is supplied.

### Current code and version differences

The official code links a Rust environment with classical least-cost insertion and annealing. Inspection confirms **old-cost minus new-cost** rewards. Current CVRP defaults have **four node features**, whereas the paper says five, and vehicle fixed cost is zero in the inspected environment configuration, rather than a documented positive vehicle-count weight. The example evaluator defaults to **100 search steps** and batches distinct dataset instances; it does not by itself reproduce the paper's best-of-100/256 per-instance protocol. Its printed mean is a current-cost mean, while wrappers separately track best costs. Reproducing the main tables requires reconstructing the exact original sampling, incumbent-selection and objective settings, rather than assuming the default command is that protocol.

The Rust repair can retain unassigned jobs when insertion is impossible and charges an absence penalty. This is an implementation mechanism, rather than proof that every reported route collection always serves every customer. Task-specific feasibility and full service should be checked in a replication.

## Limitations

### Reported by the Authors

- The batching/exploration explanation is identified as needing further research.
- Interpretation of attention, other COPs and more effective layer masks remain future work.
- The 400-node experiment still has a nonzero reference gap. [Sections 4.3/5.](https://arxiv.org/pdf/2002.08539v1#page=8)

### Curator Notes

- Least-cost insertion, route features, feasible initialization and annealing remain manually specified; the network learns selection/order within that framework.
- Best-of-many trajectories materially changes the budget, and iteration plots lack a matched wall-clock study.
- Single-policy and multi-trajectory outcomes differ; superiority is not uniform over the table rows.
- Limited synthetic tasks, no standard public benchmark and changed large-size architecture constrain generalization claims.
- Reward-sign, feature-count, objective/default-evaluation and author-list version differences need explicit reproduction choices.
- The workshop track remains outside the user's qualifying main-list standard.

## Reproducibility

- **Reading source:** all **ten arXiv-v1 pages** were read, including equations, Algorithm 1, all tables/figures and references. There is no scientific appendix. The arXiv submission is **20 February 2020**; the PDF prints **21 February 2020** internally, so these dates are not conflated.
- **Authors/institution:** the actually retrieved manuscript and author README list **six authors**, including Nuoyi Zhu, and title-page affiliation **WaterMirror Inc.** The previous Nanjing University affiliation was unsupported and is removed. The indexed primary workshop PDF has a five-author list omitting Nuoyi Zhu; the current workshop link returns 404. This note retains the retrieved manuscript's six names and records the discrepancy, without claiming the inaccessible workshop PDF was read.
- **Publication scope:** historical HSI workshop identification remains reference-only. The generic May2020 notification date is removed as unsupported individual acceptance evidence. Publication is recorded only at year precision; the active arXiv record supplies the main paper link.
- **Scientific material check:** actual arXiv history shows only v1 and no ancillary/supplement links. The complete manuscript, official 34-member NeuLNS tree and linked five-member environment tree were manually checked; no separate scientific PDF/ZIP supplement was found. The inaccessible workshop version is not represented as an additional source that was fully read.
- **Implementation:** [water-mirror/NeuLNS](https://github.com/water-mirror/NeuLNS), with [environment source](https://github.com/water-mirror/vrp_env). Full README, model/argument/evaluation/reward paths and relevant Rust initialization/repair/acceptance logic were inspected. The repository includes a CPython3.6 Linux wheel; its presence is not a successful current-environment reproduction.
- **Figure:** original Figure 1, PDF page 4, cropped directly; attention equations, decoder, algorithm and every result/convergence plot were visually checked. No training/benchmark scores were independently rerun.
