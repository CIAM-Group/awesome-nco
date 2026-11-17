---
id: gnn-mcts-tsp
short_title: GNN-MCTS
title: A Graph Neural Network Assisted Monte Carlo Tree Search Approach to Traveling
  Salesman Problem
authors:
- Zhihao Xing
- Shikui Tu
year: 2020
date: '2020-06-05'
acceptance:
  date: '2020-05-14'
  source_url: https://www.cs.sjtu.edu.cn/~tushikui/publications/2020-xzh-IEEE-ACCESS.pdf#page=1
venue: IEEE Access
paper_url: https://doi.org/10.1109/ACCESS.2020.3000236
institutions:
- Shanghai Jiao Tong University
figure:
  path: paper-assets/gnn-mcts-tsp/framework.png
  alt: GNN-MCTS pipeline from an input graph through learned probabilities and Monte
    Carlo tree search.
  caption: 'Figure 1: Overview of graph encoding, neural guidance, Monte Carlo tree
    search, and vertex selection.'
  source_url: https://www.cs.sjtu.edu.cn/~tushikui/publications/2020-xzh-IEEE-ACCESS.pdf
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: A supervised static-edge GNN predicts next-vertex priors, while MCTS uses
  neural beam completions and best-value backups to construct Euclidean TSP tours.
inclusion: reference
inclusion_reason: IEEE Access is outside the approved main-conference and journal
  inclusion list.
publication:
  date: '2020-06-05'
  source_url: https://www.cs.sjtu.edu.cn/~tushikui/publications/2020-xzh-IEEE-ACCESS.pdf#page=1
code_url: https://github.com/CMACH508/2020-GNN-MCTS-TSP
---

# A Graph Neural Network Assisted Monte Carlo Tree Search Approach to Traveling Salesman Problem

> **TL;DR:** A supervised graph network supplies next-vertex probabilities to MCTS. Neural-guided completions evaluate leaves, and best observed tour values guide the final constructive decisions.

## Motivation

Selecting the most probable next city directly can make a poor irreversible choice. The paper combines a learned graph representation with lookahead search, adapting AlphaGo-style search to a minimum-cost tour rather than an average win rate. Static distance information and a tour's visited/start/end context inform the network.

## Contributions

- Defines a static-edge GNN (SE-GNN) with layer-specific MLP aggregation of node and edge information.
- Combines next-vertex priors, a neural beam-completion evaluator, sibling-normalized action values, and best-value MCTS backups.
- Studies synthetic random and clustered Euclidean TSP instances, larger-size transfer, search components, beam width, and GNN depth. IEEE Access remains outside this repository's approved main-journal list, so the paper is retained as a reference entry.

## Methodology

The solver incrementally extends a partial tour. Node features contain a visited indicator and coordinates, plus the corresponding features of the first and current last vertices: nine input dimensions in total. SE-GNN aggregates a node's current representation, summed neighbor representations, and static Euclidean edge distances through an MLP. Layers have separate parameters, unlike the shared update parameters in the compared structure2vec implementation. Three update layers and hidden width 128 are the default. A softmax over reduced node embeddings predicts the *next vertex*, rather than a one-shot edge-probability matrix. [Section III-A, Equations 1-5; Section IV-E5.]

Training is supervised cross-entropy along optimal tours produced with Gurobi and Concorde. The paper generates 100,000/40,000/20,000 instances for 20/50/100 vertices and splits them 8:1:1, using Adam, learning rate `1e-3`, and 60 epochs. Its wording is '512 mini-batches'; it does not unambiguously distinguish a batch size of 512 from a count of 512 batches. MCTS does not supply an AlphaZero self-play training loop or a learned critic. [Section IV-A3.]

Each search edge stores a visit count, next-vertex prior, and best discovered action value. PUCT combines the prior-based exploration term with a sibling-normalized value. A leaf is evaluated by completing its partial tour with the pretrained GNN and beam search; the highest-likelihood retained complete sequence supplies its tour length. Thus the evaluator is a deterministic search procedure using a learned policy, rather than a separate neural value model. Negative completion length is backed up using a maximum, not an average. After scouting, the solver selects the best-valued next move and reuses the corresponding subtree. [Section III-B, Equations 6-8, Algorithm 1.]

Defaults are `cpuct=1.3`, beam width 1, and 800/800/1,200 rollouts for TSP20/50/100. These are substantial repeated completion budgets during sequential construction. Larger beams improve the leaf evaluator but increase cost: width 5 takes about five times the width-1 time in the reported comparison. [Sections IV-A3 and IV-E3.]

## Experiments

**Small synthetic instances.** Testing uses 1,000 newly generated instances per setting. The generator produces random or clustered Euclidean points; this paper does not establish the previous note's claim of TSPLIB benchmark experiments. Table 1 reports random-instance gaps of 0.01%/0.20%/1.04% for GNN-MCTS at 20/50/100 vertices, compared with 0.36%/1.75%/4.57% for greedy AM. On clustered instances its gaps are 0.03%/0.44%/1.44%. The exact-solver rows are references, and rounded mean objectives can conceal the small nonzero gaps. The comparison emphasizes greedy neural baselines rather than equally expensive AM sampling. [Sections IV-A-B, Tables 1-2.]

**Larger-size transfer.** A TSP100 model obtains gaps of 1.91%/2.99%/4.37% at 200/300/500 vertices. A separate TSP500-trained model obtains 3.33% at 500 and 4.48% at 1,000. The latter result is not transfer directly from the 100-vertex model. AM's failure to converge at size 500 is the authors' training outcome, not an impossibility result for attention models. [Section IV-C, Table 3.]

**Cost.** Table 4 gives GNN-MCTS times of 0.93 s/3.58 s/27.62 s at 20/50/100 vertices, then 3.9/21/42/292 *minutes* at 200/300/500/1,000. Greedy AM is 0.149 s at 100 vertices. The timing host has two Xeon E5-2620 processors (32 virtual CPU systems) and eight RTX 2080 Ti GPUs, processing 32 instances in parallel; these numbers should not be treated as isolated single-GPU latency. Simulation consumes 93.76%-99.54% of rollout time. Figure 2 switches between seconds and minutes on its axes, so it cannot establish a lower asymptotic complexity at larger sizes. [Section IV-D, Tables 4-5, Figure 2.]

**Ablations.** At random TSP100, removing tree search worsens the gap from 1.04% to 8.95%, and average-value MCTS yields 14.23%. Removing either the prior or neural completion also hurts. Tables 6-7 support the value of static edge information and nonlinear aggregation, although four layers actually give better gaps than the three-layer default; three layers are a selected cost/quality setting, not a proven optimum. [Section IV-E.]

## Limitations

Search is much slower than direct neural construction, particularly at large sizes. Optimal-tour labels have generation costs, models are trained separately by size, and transfer quality deteriorates with scale. The evaluation uses synthetic Euclidean data and selected contemporary baselines. The paper's discussion of generic MCTS convergence under unlimited memory and computation does not prove finite-budget optimality for this modified implementation. Its appendix's assumption that a TSP tour is unique also needs qualification because reversed tours and tied optima can exist.

## Reproducibility

- **Official code located:** [CMACH508/2020-GNN-MCTS-TSP](https://github.com/CMACH508/2020-GNN-MCTS-TSP), linked directly from Shikui Tu's university publication list. This corrects the previous 'not publicly available' statement. The README includes generation, supervised training, search evaluation, dependency versions, and a dataset link; all three pages of its duplicate PDF README were also inspected. No experiments were rerun or pretrained checkpoint availability assumed.
- **Reading:** All 11 publisher-formatted pages in the author's university-hosted copy were freshly read, including the appendix and all 53 references. Image-only Tables 1-7 were read from rendered pages. [Audit record](../data/reviews/papers/gnn-mcts-tsp.json).
- **Dates:** The publisher PDF explicitly gives receipt 27 March 2020, acceptance 14 May 2020, publication 5 June 2020, and current version 22 June 2020. The note uses the actual publication date rather than a fabricated 1 January date.
- **Supplement check:** IEEE Xplore returned a JavaScript/robot check. The full author-hosted version includes its scientific appendix; the author publication entry and repository were inspected and identify code and a duplicate README, without referencing additional scientific supplements. This does not claim inspection of inaccessible Xplore attachments.
