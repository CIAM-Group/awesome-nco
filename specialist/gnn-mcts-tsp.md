---
id: gnn-mcts-tsp
short_title: GNN-MCTS
title: 'A Graph Neural Network Assisted Monte Carlo Tree Search Approach to Traveling Salesman Problem'
authors:
  - Zhihao Xing
  - Shikui Tu
year: 2020
date: 2020-01-01
acceptance:
  date: "2020"
  source_url: "https://doi.org/10.1109/ACCESS.2020.3000236"
venue: IEEE Access
paper_url: https://doi.org/10.1109/ACCESS.2020.3000236
institutions:
  - Shanghai Jiao Tong University
figure:
  path: paper-assets/gnn-mcts-tsp/framework.png
  alt: GNN-MCTS pipeline from an input graph through learned probabilities and Monte Carlo tree search.
  caption: 'Figure 1: Overview of graph encoding, neural guidance, Monte Carlo tree search, and vertex selection.'
  source_url: https://www.cs.sjtu.edu.cn/~tushikui/publications/2020-xzh-IEEE-ACCESS.pdf
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
summary: GNN-MCTS learns edge probabilities with a graph network and uses them to guide Monte Carlo tree search for TSP.
---

# A Graph Neural Network Assisted Monte Carlo Tree Search Approach to Traveling Salesman Problem

> **TL;DR:** GNN-MCTS separates learned edge scoring from combinatorial search, using the neural predictions as guidance rather than as the final tour.

## Motivation

Greedy neural construction is fast but can lock in poor edges, while uninformed tree search wastes simulations on implausible branches. The paper combines a graph representation with MCTS to allocate search toward promising tours.

## Contributions

- Trains a graph neural network to estimate TSP edge probabilities.
- Incorporates learned probabilities into MCTS selection and simulation.
- Studies solution quality across random Euclidean and benchmark TSP instances.

## Methodology

1. Encode the complete weighted graph and predict edge-level guidance scores.
2. Construct a partial tour as a state in the search tree.
3. Balance learned priors and accumulated search value during MCTS selection.
4. Expand, simulate, and backpropagate outcomes until the simulation budget is consumed.

## Experiments

- **Problems:** Symmetric Euclidean TSP, including random and TSPLIB-style instances.
- **Scale and budget:** Multiple graph sizes are evaluated with fixed MCTS simulation settings reported by the paper.
- **Baselines:** Classical heuristics, MCTS variants, and neural TSP solvers.
- **Metrics:** Tour cost, gap, and computation time.
- **Main finding:** Learned guidance makes MCTS more effective than unguided search under the reported simulation budgets, while runtime remains search-budget dependent.

## Limitations

### Reported by the Authors

- Search cost grows with instance size and the number of MCTS simulations.

### Curator Notes

- Reproducing headline quality requires matching both the trained edge model and detailed tree-search settings.
- The study is TSP specific and does not establish a shared routing model.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Main paper references:** GNN architecture, MCTS algorithm, and experimental parameter tables.
