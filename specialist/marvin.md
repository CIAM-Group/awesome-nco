---
id: marvin
short_title: MARVIN
title: Multi-Agent Routing Value Iteration Network
authors:
- Quinlan Sykora
- Mengye Ren
- Raquel Urtasun
year: 2020
date: '2020-11-21'
publication:
  date: '2020-11-21'
  source_url: https://proceedings.mlr.press/v119/sykora20a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v119/sykora20a.html
institutions:
- University of Toronto
- Uber Advanced Technologies Group
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Multi-Agent Road-Network Coverage Routing
- Traveling Salesman Problem
summary: A shared agent policy constructs coverage routes using dense shortest-path-aware attention/LSTM reasoning and learned inter-agent messages, trained by privileged-teacher imitation or fleet-level REINFORCE; realistic-road data availability and oracle/budget differences remain material.
code_url: https://github.com/uber/MARVIN
figure:
  path: paper-assets/marvin/framework.png
  alt: MARVIN combines a map graph, repeated attention-LSTM value reasoning and agent-level communication attention before choosing the next routing destination.
  caption: 'Figure 2: map-level value reasoning and inter-agent communication modules.'
  source_url: https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=4
---
# Multi-Agent Routing Value Iteration Network

> **TL;DR:** MARVIN builds multi-agent road-coverage routes online. Each agent uses the **same policy**, combines shortest-path-aware graph attention/LSTM reasoning with messages from other agents, selects an uncovered destination and follows a shortest path to it. IL and RL are separate training alternatives. Strong small-setting results coexist with substantial large-setting gaps, and the official public repository still distinguishes its toy examples from the realistic street dataset awaiting licensing.

## Motivation

Autonomous mapping may require a street to be traversed more than once because of failed observations. Required visit counts and traffic costs are initially unknown, so a static once-through tour can waste effort. MARVIN studies coordination under these partial observations on directed street graphs. This is a **coverage-routing** problem, not standard capacity-constrained depot CVRP. Each street segment becomes a graph node; edges encode legal movement between segments. [Sections 1/3/5.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=3)

## Contributions

- A shared decentralized agent policy uses learned, value-iteration-inspired reasoning on street graphs.
- Dense all-pairs shortest-path information lets distant map regions influence local decisions despite sparse road connectivity.
- Agent-level attention combines asynchronously received messages for coordinated coverage.
- A simulated mapping benchmark adds unknown repeat counts, traffic multipliers and asynchronous execution to real road subgraphs; IL/RL, generalization and communication ablations are evaluated. [Sections 3-6.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=4)

## Methodology

### Routing objective and observations

For each node v, the fleet must collectively visit it at least M_v times. M_v is unknown until the mapping requirement is satisfied. The objective is **the sum of all agents' traversal-time costs**, not the maximum completion time or a load-balance objective. Inputs include in/out graph statistics, own position, coverage/exploration indicators, shortest-path distance, local traffic information, adjacency and received communication channels. The method assumes a strongly connected road graph and that agents can broadcast to the rest of the fleet. [Equation 2/Tables 1-2.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=3)

### Learned value reasoning and action execution

Floyd-Warshall computes all-pairs minimum-path distances, normalized into a dense matrix. Each node's features and communication channels are linearly embedded. At each of K recurrent reasoning steps, query/key attention scores are fused with graph-distance information through an MLP; weighted values enter an LSTM, with residual feature updates. A scalar score is decoded per node. Fully covered destinations are masked, and the highest-scoring remaining node is selected. An ordinary shortest-path algorithm connects the current position to that destination. Intermediate road segments can be revisited. [Equations 3-11/Figure 2.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=4)

The name value iteration describes an architectural bias. These learned attention/LSTM transitions are not an exact Bellman solver with a demonstrated optimality/convergence certificate. Sparse physical roads also do not make its learned representation sparse: the dense pairwise matrix creates **quadratic memory**, and Floyd-Warshall preprocessing has a separate cost.

### Communication and learning

After acting, an agent broadcasts a node-indexed communication vector. Other agents retain the latest message from each sender. When deciding, an agent applies attention across senders to form communication features for its next map-level reasoning step. The message width is 16 **per graph node**, rather than one fixed-size 16-number fleet message. The same neural parameters are used by all agents. [Equations 12-16.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=5)

**IL:** an LKH3 teacher receives global hidden information, including required repeat counts and congestion; teacher-forced cross-entropy trains the next action. This expert is privileged relative to the deployed partially observed agent. **RL:** REINFORCE uses negative total fleet traversal cost, standardized over a batch, without expert action labels. IL and RL models are compared separately, rather than described as one mandatory combined training pipeline. At inference, adapting to new observations changes actions/messages, not neural weights. [Equations 17-19.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=6)

Classification remains **specialist / constructive**. Shared weights across agents and transfers over graph/fleet size concern the same coverage-routing task. Actions extend the current traversal under newly observed state; they are not learned edits to a completed incumbent tour. A separate toy-TSP experiment tests the architecture, without demonstrating one jointly trained cross-task checkpoint.

## Experiments

### Dataset and training protocol

The paper reports **22,814 training road graphs from 18 cities**, 10% validation, and **373 test graphs** from a separate city. Train/test contain 420,452/14,284 graph nodes in total. Repeat requirements are sampled uniformly from one to three during training; shifted distributions are tested separately. Traffic flow is simulated, with travel-cost inflation capped at four times the base cost. The simulator's hidden road/traffic conditions should not be equated with a deployed system receiving real-world traffic streams. [Table 3/Section 5.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=6)

Training uses **two agents**, graphs up to **25 nodes**, width/communication channels 16, **five value-reasoning iterations**, Adam 1e-3, batch 50 and **5,000 epochs**, with .1 learning-rate decay every 2,000 epochs. Training agent turns are synchronous/sequential; evaluation uses simulated asynchronous completion according to travel time. Increasing reasoning to ten iterations at test time adds compute and improves selected results. Current public argument defaults list **10,000 epochs**, so they are a code-version configuration, not the paper's stated schedule. [Section 6.1/Figure 4C.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=8)

### Road-coverage results

Table 4 uses **hours for traversal cost** and **milliseconds for solver runtime**. Its Oracle is a **globally informed LKH3 heuristic**, not a certified optimum or a mathematical lower bound. The ordinary LKH3 baseline replans coverage tours with limited information. GVIN receives the new communication module; AM/EAN receive an added GCN and imitation training, and are evaluated only in the single-agent setting. These are adapted baselines, rather than unchanged published TSP models. [Table 4/baseline definitions.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=7)

| Graph/fleet | Oracle cost | MARVIN RL cost / gap | MARVIN IL cost / gap | RL runtime |
| --- | --- | --- | --- | --- |
| 25 nodes, one agent | 1.16 h | 1.25 h / 8.17% | 1.37 h / 18.0% | 62.8 ms |
| 25 nodes, two agents | 1.28 h | 1.32 h / 2.87% | 1.42 h / 11.3% | 56.6 ms |
| 50 nodes, two agents | 1.85 h | 2.12 h / 14.5% | 2.21 h / 19.0% | 71.4 ms |
| 100 nodes, five agents | 3.19 h | 4.62 h / 44.9% | 4.36 h / 36.7% | 72.8 ms |

The small two-agent setting is close to the selected oracle, while substantial gaps remain at larger size/fleet. **IL beats RL in the 100-node/five-agent row**, so RL is not uniformly better. The limited-information LKH3 row costs 6.14 hours and 2,430 ms there; comparison to this adaptation does not establish superiority over all conventional routing methods or a true optimum. Timing does not separately characterize distributed messaging latency or full deployment hardware/preprocessing costs.

Table 5 changes repeat-count distributions. For uniform 1-10, Oracle/LKH3/RL costs are **3.50/5.72/3.82 hours**; for truncated Gaussian 1-3 they are **1.51/2.52/1.75**. These support robustness over tested distributions while retaining nonzero gaps. Low observed Gini coefficients for agent costs are an empirical outcome, not an optimized makespan guarantee. [Table 5/Figure 3.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=8)

### Toy TSP and larger illustrations

Table 6 tests single-agent Euclidean **TSP25**. Greedy MARVIN has **7.56%** gap; allowing it to choose its starting node gives **2.38%**. Adding **1,280 sampled trajectories** gives **.10% at 1,714 ms**, versus AM with self-start/sampling **.13% at 552 ms**. Thus the tiny quality difference costs substantially more inference time; the sampled score should not be attributed to a single greedy rollout. Reported model sizes are .04 MB versus AM's 28 MB. [Table 6.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=8)

A separate Chicago illustration uses **2,426 nodes and 20 agents**. It is qualitative evidence, not a new row of quantitatively matched large-graph performance. The two-page publisher supplement was fully read and visually checked: Figures 6-7 show different value-map patterns, Figure 8 compares partial MARVIN/GVIN coverage, Figure 9 compares RL/IL traversals, and Figure 10 shows training graphs. The supplement even notes an IL traversal efficiency advantage in its displayed example. The main Figure 5's plot legend says 20-node-trained while surrounding text/caption says 25; this inconsistency should not be silently resolved as an exact new training setting.

### Ablations and currently available artifacts

The full IL value module has **75.8% action prediction accuracy**, versus no-LSTM 71.7%, GVIN 65.4% and GAT 23.5%. These are **action imitation accuracies**, not tour optimality or complete-route success rates. Communication and reasoning ablations show design-specific gains at extra channels/iterations. [Table 7/Figure 4.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=9)

The current official README says the realistic street dataset is **still in licensing**, and its available commands train on randomly generated toy graphs with optional simulated traffic/revisits. The inspected `download.sh` downloads/builds LKH and creates empty data directories; it does not retrieve the claimed full road benchmark. Public toy-model results and paper road-benchmark values are therefore separate artifacts/protocols. This is a material reproduction limit, not evidence that the reported road experiments were rerun here.

## Limitations

### Reported by the Authors

- More detailed interpretation of communication semantics remains future work.
- Massive-graph scaling is constrained by **O(n squared) evaluation memory** from pairwise adjacency.
- Expert demonstrations may require a slow, globally informed solver; RL is harder to train. [Sections 4.3/7.](https://proceedings.mlr.press/v119/sykora20a/sykora20a.pdf#page=9)

### Curator Notes

- Decentralized execution assumes a known global road graph and fleet-wide broadcasts; it is not communication-free local control.
- The oracle is a privileged heuristic reference; 2.87% small-setting gap does not summarize the larger 44.9% RL gap.
- Toy sampling, changed test-time reasoning iterations and qualitative large-map demonstrations have distinct budgets/evidence.
- The realistic dataset remains unavailable in the inspected public README, limiting direct reproduction of the real-road tables.
- Empirical learned value reasoning, coverage behavior and load balance do not provide a universal routing optimality theorem.

## Reproducibility

- **Full reading:** all **11 publisher-proceedings pages plus both publisher supplementary pages** were read, with original formulae, architecture, tables, ablations and every supplementary map panel visually inspected.
- **Publication/metadata:** official PMLR 119:9300-9310 confirms ICML2020 and three authors. Its actual HTML explicitly records **citation_publication_date=2020/11/21**, retained independently from the July conference dates. No unsupported individual acceptance day is added. The author's project page confirms **Uber Advanced Technologies Group and University of Toronto**.
- **Scientific supplement discovery:** the PMLR landing page manually lists the main PDF, official software and a separate two-page supplementary PDF; both PDFs are registered/read. The official 46-member source tree contains no additional scientific PDF/ZIP. No source attachment is counted as read from downloading alone.
- **Official code:** [uber/MARVIN](https://github.com/uber/MARVIN), linked by the publisher. The full README, argument defaults, communication module and relevant model/download paths were inspected. Toy-data commands, licensing statement and 10,000-epoch current default are distinguished from paper settings; scores were not independently reproduced.
- **Figure:** original Figure 2, PDF page 4, directly cropped from the publisher source, including its complete caption.
