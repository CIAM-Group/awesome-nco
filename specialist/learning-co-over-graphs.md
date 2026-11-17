---
id: learning-co-over-graphs
short_title: S2V-DQN
title: Learning Combinatorial Optimization Algorithms over Graphs
authors:
- Hanjun Dai
- Elias B. Khalil
- Yuyu Zhang
- Bistra Dilkina
- Le Song
year: 2017
date: 2017-04-05
venue: NIPS
paper_url: https://proceedings.neurips.cc/paper/2017/hash/d9896106ca98d3d05b8cbdf4fd8b13a1-Abstract.html
arxiv_url: https://arxiv.org/abs/1704.01665
code_url: https://github.com/Hanjun-Dai/graph_comb_opt
institutions:
- Georgia Institute of Technology
- Ant Financial
scope: specialist
paradigm: constructive
problem_families:
- Graph Optimization
- Routing
problems:
- Minimum Vertex Cover
- Maximum Cut
- Traveling Salesman Problem
- Set Covering Problem
summary: Problem-specific structure2vec Q-functions learn greedy node selection for four optimization tasks, with
  supplied feasibility helpers and a separate active-search protocol for TSPLIB.
figure:
  path: paper-assets/learning-co-over-graphs/framework.png
  alt: S2V-DQN graph embedding and greedy node-selection process for two construction steps.
  caption: 'Figure 1: Graph embedding and greedy construction in the S2V-DQN framework.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2017/file/d9896106ca98d3d05b8cbdf4fd8b13a1-Paper.pdf#page=2
publication:
  date: '2017'
  source_url: https://proceedings.neurips.cc/paper/2017/hash/d9896106ca98d3d05b8cbdf4fd8b13a1-Abstract.html
---

# Learning Combinatorial Optimization Algorithms over Graphs

> **TL;DR:** S2V-DQN trains structure2vec Q-functions to select nodes within a supplied greedy construction template. The framework is reused across problems, while trained policies remain problem-specific; TSPLIB uses per-instance active search.

## Motivation

Repeated optimization instances from an application often share structure. The paper proposes paying an offline learning cost to improve the speed and quality of later heuristic decisions, while representing graph topology explicitly rather than treating each instance only as a sequence. It learns the node-selection evaluation function; the instance distribution, objective, feasibility helper and stopping rule are supplied by the designer (main Sections 1-2).

## Contributions

- Combines a common greedy node-addition template, structure2vec message passing and fitted Q-learning with replay.
- Conditions node scores on both the graph and the tagged partial solution, with shared parameters that can be applied at different graph sizes.
- Evaluates Minimum Vertex Cover (MVC), Maximum Cut and Euclidean TSP in the main paper, and Set Covering (SCP) in Appendix B and the experiments in Appendices C-D.
- Studies size transfer, time-quality trade-offs and qualitative learned decisions. This is empirical heuristic learning, without an approximation or optimality guarantee for the trained neural policy.

## Methodology

**Construction and feasibility.** A state records the ordered nodes already selected and their binary tags. The action chooses an unselected node. MVC adds cover vertices until every edge is covered; Maximum Cut builds one side of a partition and stops when the cut cannot be improved. TSP uses a hand-written helper that inserts the selected node at the position of least tour-length increase, rather than simply appending it. SCP uses a bipartite element/subset graph and selects subset vertices until all elements are covered, with reward -1 per selected subset (main Sections 2-4; supplement Appendix B).

**Graph-conditioned Q-function.** Embeddings start at zero and undergo synchronous structure2vec updates that aggregate selected-node tags, neighboring embeddings and edge features through sums and ReLU transformations. The Q-head concatenates a transformed sum of all node embeddings with the candidate node embedding. Global pooling and local message passing are distinct operations. The experiment configurations use dimension 64 and respectively 5, 3, 4 and 5 message-passing iterations for MVC, Maximum Cut, TSP and SCP; the corresponding n-step settings are 5, 1, 1 and 2. TSP uses a 10-nearest-neighbor graph for embedding computation at scale (main Sections 3-5; supplement Table D.9).

**Learning and search.** The conceptual immediate reward is the objective change after an action. Fitted n-step Q-learning uses epsilon-greedy exploration and minibatches sampled from replay. The supplementary implementation details qualify the simple formulation: rewards are normalized by maximum node count; the discount is 1 for MVC, Maximum Cut and SCP, but 0.1 for TSP, where the authors also report reversing the designed reward sign. A common architecture is trained separately for tasks and graph distributions. MVC larger-size training can initialize from a smaller-size model; this is not one jointly trained multi-problem checkpoint (supplement D.4-D.6).

Most synthetic tests use a frozen greedy policy. The TSPLIB experiment instead performs active search: reinforcement learning runs on each individual test instance without upfront training and retains the best tour encountered. These protocols should not be combined into a claim that all reported TSP results use a single fast greedy forward pass (main Section 5; supplement C.3).

## Experiments

**Data and references.** Synthetic MVC and Maximum Cut use Erdos-Renyi and Barabasi-Albert graphs; TSP uses random and clustered DIMACS instances. SCP uses bipartite instances with edge probabilities 0.05 or 0.1. The authors use 100 validation graphs and 1,000 test graphs. MVC training reaches 400-500 vertices, while Maximum Cut and TSP training reaches 200-300; tests extend to 1,000-1,200. CPLEX and Concorde references have a one-hour cutoff and are explicitly only possibly optimal. Learned methods run on a CUDA K80 cluster (main Section 5; supplement D.1).

**Size transfer.** With training sizes 50-100 and testing at 1,000-1,200, Table 2 reports mean ratios 1.0062 for MVC on BA graphs, 1.0038 for Maximum Cut on BA graphs and 1.1065 for clustered TSP. Results depend on graph family: the corresponding MVC ER value is 1.0238 and random TSP is 1.1171. SCP transfer is not uniformly stable: Table D.8 reports 2.5055 for training 100-200 and testing 1,000-1,200 at edge probability 0.1. A weakening time-limited reference can make larger-instance ratios look better, so these are not certified gaps to optimum (main Table 2; supplement Tables D.1-D.8).

**Realistic instances.** MemeTracker MVC has a cover of 474 against a proved optimum of 473. Ten 125-node physics Maximum Cut instances have mean ratio 1.0223 and three optimal solutions; their weights include -1, 0 and 1, despite the positive-weight introductory notation. TSPLIB uses 38 selected instances with 51-318 nodes, limited by single-GPU memory, and reports mean ratio 1.0475 under active search. The tested TSP competitors are classical construction/improvement heuristics, without a reported LKH comparison. For realistic SCP, S2V-DQN averages about 1.001, while the LP-based competitor is slightly better at 1.0009 (main Table 3; supplement C.1-C.4).

**Baselines and timing.** Synthetic TSP farthest insertion and 2-opt are competitive and sometimes better. The authors' PN-AC baseline is their reimplementation: graph inputs use rank-8 SVD features; it uses a moving-average reward baseline after a learned critic performed worse; the insertion helper is also applied to it. Its variable-size settings differ from Bello et al.'s fixed-size experiments. Reported MVC inference on 1,200 vertices takes about 11 seconds on one GPU. The paper acknowledges that GPU-versus-CPU comparisons are not fully fair; additional CPLEX comparisons include timeouts and counts of matched instances (main Sections 5.1-5.3; supplement D.8, D.11).

## Limitations

The authors identify dense-graph computation and reward design as open issues. Feasibility helpers, task representation and stopping rules require problem knowledge. A reusable architecture and cross-size transfer do not establish generalization to arbitrary constraints or a shared multi-problem neural solver.

The published metric has an internal inconsistency: Section 5.1 prints the maximum of the two objective ratios, which cannot fall below 1 for positive costs, while Section 5.3 discusses values below 1 and Table D.4 contains 0.9905. The note preserves the reported numbers as empirical reference ratios rather than silently repairing the definition or treating them as certified approximation factors. Qualitative visualizations suggest useful degree/connectivity trade-offs but do not prove a newly optimal algorithm.

## Reproducibility

- **Read sources:** all 11 pages of the official NIPS 2017 main PDF and all 13 pages of `nips_2017-appendix.pdf`, the sole member of the publisher's supplemental ZIP. Equations, experiment tables and the framework crop were checked visually. PDF page numbers restart for the supplement; its printed pages are 12-24.
- **Implementation:** [Hanjun-Dai/graph_comb_opt](https://github.com/Hanjun-Dai/graph_comb_opt), explicitly linked in main-page-7 footnote 4. Its README describes the C++/graphnn build, training and evaluation scripts and links the experimental data. It does not establish that a pretrained checkpoint reproduces every table; no training was rerun for this review.
- **Bibliographic discrepancy:** the publisher PDF lists Hanjun Dai before Elias B. Khalil and marks equal contribution; the publisher landing page lists Elias Khalil first. This note retains the PDF author order and discloses the discrepancy. The arXiv date is the first submission date, not an acceptance date. An unsupported conference-calendar acceptance day was removed; the official publication year is retained.
- **Citation graph:** explicit internal citations to Pointer Networks [37] and Bello et al. [6] are supported by the main discussion and bibliography. Different QBF and scheduling papers with overlapping authors or topics were not substituted for the actual references.
