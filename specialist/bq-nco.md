---
id: bq-nco
short_title: BQ-NCO
title: 'BQ-NCO: Bisimulation Quotienting for Efficient Neural Combinatorial Optimization'
authors:
- Darko Drakulic
- Sofia Michel
- Florian Mai
- Arnaud Sors
- Jean-Marc Andreoli
year: 2023
date: '2023-01-09'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/f445ba15f0f05c26e1d24f908ea78d60-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2301.03313
code_url: https://github.com/naver/bq-nco
institutions:
- NAVER LABS Europe
- IDIAP Research Institute
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Traveling Salesman Problem
- Asymmetric Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Orienteering Problem
- 0-1 Knapsack Problem
summary: Bisimulation maps partial solutions to remaining subproblem instances; separately trained supervised policies
  recompute attention over these reduced states at every construction step.
figure:
  path: paper-assets/bq-nco/framework.png
  alt: Direct-MDP and bisimulation-quotient MDP policy architectures shown side by side.
  caption: 'Figure 1: Policy architectures for the direct MDP and BQ-MDP formulations.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=5
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/f445ba15f0f05c26e1d24f908ea78d60-Abstract-Conference.html
---

# BQ-NCO: Bisimulation Quotienting for Efficient Neural Combinatorial Optimization

> **TL;DR:** BQ-NCO represents a partial construction by its remaining optimization subproblem, removing irrelevant history through bisimulation. A supervised policy recomputes the **entire model at every step** on this shrinking state. Separate policies cover Euclidean TSP, ATSP, CVRP, OP and knapsack, with strong size-transfer results but nontrivial inference and teacher-data costs.

## Motivation

In a direct constructive MDP, visited history grows even as fewer choices remain. Many different histories induce the same remaining decision problem. Treating them as distinct states makes a network relearn equivalent continuations. BQ-NCO expresses this equivalence through bisimulation and uses the residual instance as the state. This symmetry arises from recursive problem structure and is broader than Euclidean rotation/reflection. [Sections 1-3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=1)

## Contributions

- Defines a direct MDP from an algebraic solution space and proves correspondence between its optimal policies and optimal combinatorial solutions under the stated feasibility and finite-decomposition assumptions.
- Maps states to tail subproblems, preserving allowed action/reward continuations through bisimulation; recursive formulations give practical parameterizations of these reduced states.
- Uses attention policies trained by imitation of expert solution subsequences, with tailored inputs/actions for TSP, ATSP, CVRP, OP and KP.
- Evaluates single greedy rollouts, beam width 16 and a faster PerceiverIO variant across scale, distribution and benchmark shifts. [Sections 2-6 and supplement A-G.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=3)

## Methodology

### Direct MDP and quotient state

A solution space has an associative composition operator, an empty element and generating construction steps, with finitely many decompositions for each solution. The direct state is a partial solution that admits at least one feasible completion. Appending a step gives the objective difference as reward; a zero-reward neutral action is permitted at a feasible completed solution. This formal definition presupposes that feasible continuations can be identified. It is not a polynomial-time procedure for deciding arbitrary hard global constraints. [Section 2 and supplement F.1-F.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=3)

For a fixed partial solution, the tail objective evaluates the cost of that prefix followed by a candidate continuation, and the tail feasible set contains its valid completions. The BQ state is this induced problem instance. Bisimulation preserves the action/reward transitions; the proofs establish that an **optimal** BQ policy solves the original COP. They do not guarantee that a learned approximate policy is optimal. The general quotient is formalized using the disjoint union of direct MDPs across instances; the supplement also supplies the monoid/LTS background and all quotienting proofs. [Section 3.2 and supplement F.3-G.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=4)

For TSP, the implementation uses path-TSP: an origin, destination and unvisited customers. Selecting a node changes the origin and removes that node. Path-CVRP adds remaining vehicle capacity and a depot; path-OP adds remaining distance; KP removes selected items and decreases capacity. The usual closed-tour problems are initial states of these path variants. [Section 3.3 and supplement A-C.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=5)

### Neural policy and repeated computation

The TSP policy embeds coordinates, adds learned origin/destination role vectors, applies nine Transformer layers with ReZero and produces masked action probabilities. There are 12 attention heads, embedding dimension 192 and feed-forward dimension 512. The BQ formulation removes the conventional fixed-encoder/autoregressive-decoder separation: **every decision recomputes all layers on the remaining instance**. Full-graph total complexity is `O(N^3)`, compared with the paper's `O(N^2)` encoder-decoder baselines. There are no autoregressive decoder layers, although decisions still occur sequentially. [Sections 3.2-4 and Figure 2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=5)

ATSP uses random node identifiers and cost-matrix-weighted graph convolutions before attention, allowing asymmetric edge costs. CVRP adds demand and current-capacity channels, and outputs two choices per customer: visit directly or via the depot. OP adds prize and distance-budget channels and feasibility masks. KP embeds weight, value and remaining capacity without origin/destination tokens; any remaining teacher-selected item can be a valid training action. These are separate problem policies, not one shared cross-task checkpoint. [Section 4 and supplement A-C.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=6)

For Transformer routing models, inference normally restricts each state to the 250 nearest neighbors of the origin; OP(distance) and the Perceiver variant are exceptions. This heuristic changes the candidate set and trades speed against quality. PerceiverIO instead uses cross-attention to a fixed latent array and attention in latent space, reducing the input-length cost of each step. Its nine layers use eight heads and a `64*48` latent array. [Section 6 and supplement D-E.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=8)

### Supervised training

Each routing model uses one million size-100 expert solutions: Concorde for TSP, LKH for ATSP/CVRP and EA4OP for OP. Training samples solution subsequences of varying sizes (TSP lengths 4-100), thus exposing residual instances of many sizes even though the original instances have fixed size. Batch size is 1,024; training runs 500 epochs with Adam, initial learning rate `7.5e-4`, decaying by `0.98` every 50 epochs. KP instead trains on one million 200-item instances of capacity 25, with OR-Tools DP labels, and converges in 50 epochs. Teacher quality is exact or heuristic according to its solver; it should not be described uniformly as optimal labels. [Section 6 and supplement C.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=8)

Expert trajectory construction matters: CVRP subtours are ordered from least remaining capacity to most, encouraging full vehicles before the final residual route. The authors report nearly twice better performance than arbitrary subtour order. An ablation freezing lower layers and updating only the top layer is 1.6 times faster but degrades TSP100 gap from 0.35% to 8.175%, supporting the importance of full recomputation in this implementation. [Supplement E.2-E.3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Supplemental-Conference.pdf#page=4)

## Experiments

### Synthetic scale transfer

Table 1 uses **10,000 instances at size 100**, but **128 instances at each larger size** of 200, 500 and 1,000. Its reported times are totals for those different-sized datasets. Most neural runs use one Tesla V100-S GPU; non-neural solvers use one Xeon E5-2670 CPU thread. Starred rows are imported from other publications, and MatNet's daggered ATSP row uses its own training-distribution-compatible instances. These qualifiers prevent a fully controlled cross-method timing/distribution comparison. [Section 6 and Table 1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=8)

| Task, size 1,000 | Greedy gap / dataset time | Beam-16 gap / dataset time | Reference |
| --- | --- | --- | --- |
| Euclidean TSP | 2.29% / 2 min | 1.38% / 38 min | Concorde optimum |
| CVRP | 5.88% / 2 min | 2.55% / 38 min | LKH heuristic |
| OP(distance) | 8.40% / 8.9 min | 4.81% / 2.2 h | EA4OP heuristic |
| ATSP | 11.59% / 14 s | 8.26% / 7 min | LKH heuristic |

For TSP1000, the compared size-100-trained POMO and Sym-NCO gaps are 40.60% and 37.51%; Att-GCN+MCTS and DIFUSCO+2opt report 3.22% and 3.40% with longer imported runtimes. BQ's transfer advantage does not imply a win at every size: TSP100 greedy is 0.35%, versus POMO 0.13% and SGBS 0.06%. Similarly, BQ CVRP100 greedy is 2.79%, versus POMO 0.69% and SGBS 0.08%. For CVRP1000, HGS improves 1.10% over the LKH reference while BQ beam-16 remains 2.55% above LKH. Negative gaps to LKH/EA4OP would denote better heuristic results, not negative optimality gaps. [Table 1, PDF p. 10.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=10)

The faster Perceiver variant obtains TSP1000 gap 8.97% in 22 seconds and CVRP1000 10.21% in 24 seconds, illustrating a substantial quality/runtime trade-off. The nearest-neighbor ablation compares full graphs, 500 and 250 neighbors: at TSP1000, full-graph beam-16 takes 3.5 hours for 1.412% gap, while 250 neighbors takes 38 minutes for 1.379%. This empirical improvement does not establish that pruning always preserves an optimal continuation. [Supplement D-E.1, Table 4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Supplemental-Conference.pdf#page=4)

### TSPLIB, CVRPLIB and knapsack

TSPLIB tests include instances up to 4,461 nodes. Table 2 reports aggregate gaps of 3.30% greedy and 2.55% beam-16, versus MDAM 19.01% and POMO 26.30%. In its above-1,000 group, BQ gaps rise to 6.42%/5.90%. CVRPLIB groups A/B/F/M/P/X span 15-1,000 nodes: aggregate greedy/beam gaps are 7.62%/4.83%, with group X at 9.94%/7.22%. These remain nonzero benchmark gaps; the aggregate table does not supply benchmark inference times. Appendix H visually compares four representative routes, rather than adding an independent numerical benchmark suite. [Table 2 and supplement H.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=10)

KP tests cross 200/500/1,000 items with capacities 10/25/50/100. The reported aggregate gap is 0.516% for one BQ greedy trajectory, versus 4.647% for POMO selecting among all initial-item trajectories. BQ does not win every cell: at 200 items/capacity 25, POMO is 0.016% versus BQ 0.102%; at 500/capacity 100 it is 0.285% versus 0.407%. The largest gains occur under strong size/capacity shift, such as 1,000 items/capacity 10: 2.074% versus POMO's 28.565%. [Supplement C, Table 3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Supplemental-Conference.pdf#page=3)

## Limitations

### Reported by the Authors

- The constructive formulation requires feasible continuation checks; harder global constraints may need constraint-programming integration.
- Full recomputation has cubic full-graph complexity, motivating nearest-neighbor candidate restriction and PerceiverIO.
- Supervised experiments depend on precomputed solutions and expert-trajectory choices; reinforcement learning and stochastic COPs are future directions. [Sections 4 and 7, supplement E.](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf#page=9)

### Curator Notes

- A general MDP formulation and minor architectural changes across tasks do not establish one generalist checkpoint; the experiments train separate **specialist / constructive** policies.
- Formal bisimulation preserves the original decision problem, while imitation, beam pruning and candidate restriction remain approximation choices. The learned greedy policy has no certified optimality guarantee.
- Size-100 training includes variable-sized residual subproblems. Generalization is evaluated without parameter adaptation, but the best reported BQ results use beam search and the main Transformer results usually use a nearest-neighbor heuristic.
- Dataset counts, imported results, solver-dependent gap denominators and CPU/GPU configurations need to accompany quality comparisons. The original note's claim that BQ avoids per-step re-encoding was the opposite of the reported method.

## Reproducibility

- **Formal title and version history:** the NeurIPS 2023 title is **Efficient Neural Combinatorial Optimization**. [ArXiv v1](https://arxiv.org/abs/2301.03313v1) (9 January 2023) and [v2](https://arxiv.org/abs/2301.03313v2) (12 January) used **Generalizable Neural Combinatorial Optimization**; [v3](https://arxiv.org/abs/2301.03313v3) (28 September) uses Efficient. These are versions of the same stable `bq-nco` work, so an explicit older-title citation can match this ID while retaining its cited version.
- **Full reading:** [14-page publisher paper](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Paper-Conference.pdf) and [12-page scientific supplement](https://proceedings.neurips.cc/paper_files/paper/2023/file/f445ba15f0f05c26e1d24f908ea78d60-Supplemental-Conference.pdf), including every problem extension, ablation, proof/background section and Appendix H plot, were read. The proceedings page lists one Supplemental PDF. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2023/hash/f445ba15f0f05c26e1d24f908ea78d60-Abstract-Conference.html) explicitly records `citation_publication_date` as **2023-12-15**, independently of any paper-specific acceptance date. The generic acceptance-day inference remains removed; the title-page affiliation footnote adds IDIAP for Florian Mai, whose work was performed during a NAVER internship.
- **Official implementation:** [naver/bq-nco](https://github.com/naver/bq-nco), linked by the official proceedings page. Its README provides problem-specific training/test commands and pretrained-model paths, with a separate Perceiver branch. Source and resource links were inspected; this audit did not rerun training or benchmark experiments.
- **Audit locators:** main pp. 3-6 for definitions and full recomputation, p. 8 for training/evaluation, p. 10 for both main tables; supplement pp. 1-4 for extensions/ablations, pp. 5-10 for all proofs, pp. 11-12 for route plots. The displayed original Figure 1 is rendered from publisher PDF p. 5 with the complete right-hand output marker.
