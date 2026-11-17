---
id: h-tsp
short_title: H-TSP
title: 'H-TSP: Hierarchically Solving the Large-Scale Traveling Salesman Problem'
authors:
- Xuanhao Pan
- Yan Jin
- Yuandong Ding
- Mingxiao Feng
- Li Zhao
- Lei Song
- Jiang Bian
year: 2023
date: 2023-04-19
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/26120
arxiv_url: https://arxiv.org/abs/2304.09395
code_url: https://github.com/Learning4Optimization-HUST/H-TSP
institutions:
- Huazhong University of Science and Technology
- University of Science and Technology of China
- Microsoft Research Asia
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: H-TSP jointly trains a pixel-based decomposition policy and an endpoint-conditioned path constructor to
  insert local paths into a growing TSP tour.
publication:
  date: '2023-06-26'
  source_url: https://api.crossref.org/works/10.1609/aaai.v37i8.26120
figure:
  path: paper-assets/h-tsp/framework.png
  alt: Heatmap of cross-size generalization gaps for four size-trained H-TSP models.
  caption: 'Figure 1: Cross-size generalization of four separate H-TSP models; larger-instance gaps use LKH-3 references.'
  source_url: https://arxiv.org/pdf/2304.09395v1#page=7
---

# H-TSP: Hierarchically Solving the Large-Scale Traveling Salesman Problem

> **TL;DR:** H-TSP jointly trains a pixel-based decomposition policy and an endpoint-conditioned path constructor to insert local paths into a growing TSP tour. Its very short reported inference time trades off against a substantial quality gap to stronger search solvers.

## Motivation

Direct attention-based construction becomes expensive as the number of cities grows, while repeated search over a complete large tour can take too long for time-sensitive routing. H-TSP splits a two-dimensional Euclidean TSP into small, adaptively selected fixed-endpoint path problems, letting a learned upper policy coordinate local construction. The demonstrated task is TSP; pickup-and-delivery, vehicle routing and scheduling are related work or future extensions. [Introduction and Problem Definition.](https://arxiv.org/pdf/2304.09395v1#page=1)

## Contributions

- A two-level RL framework learns both which local region to expand and the path through the chosen cities.
- A pixel/CNN encoder avoids representing all pairwise relationships in the upper policy.
- Joint training couples PPO decomposition with a REINFORCE/POMO-style path solver, following lower-policy warm-up.
- Large-scale tests cover 1000-10000 nodes with separate trained models; an additional cross-size study evaluates up to 50000 nodes. The paper's historical first-method claim is an author claim, not a current exhaustive priority result. [Framework and Experiments.](https://arxiv.org/pdf/2304.09395v1#page=3)

## Methodology

### Adaptive decomposition and insertion

Start with the depot and its nearest city. The upper policy emits a continuous 2D coordinate. Select the nearest unvisited city, find a nearby visited city, and expand unvisited neighbors breadth-first on a k-nearest-neighbor graph. Add a contiguous fragment of the existing partial route around that visited city, fixing the fragment's two endpoints. The lower policy solves this local open TSP, and its path replaces the old fragment while inserting new cities. Repeat until all cities are covered. Thus local construction can reorder already visited **partial-tour** nodes; the default pipeline is not a post hoc search over a complete incumbent. [Algorithms 1-2.](https://arxiv.org/pdf/2304.09395v1#page=3)

The experiments set k=40, local size 200 and maximum newly inserted nodes 190. The upper encoder starts from eleven features per city: absolute coordinates, offsets from the grid and cluster centers, predecessor/successor coordinates for visited nodes, and visitation status. A linear projection and per-grid max pooling produce a pseudo-image. A three-layer CNN with 16/32/32 channels outputs a 128-dimensional embedding, followed by separate four-layer actor and critic MLPs. [Upper-level Model and hyperparameters.](https://arxiv.org/pdf/2304.09395v1#page=3)

### Endpoint-aware path construction

The lower network uses twelve self-attention encoder layers and two context-attention decoder layers, generally width 128. Its context includes graph, first/last partial-path city and both required endpoint embeddings. To reuse POMO's symmetric rollouts, when one endpoint is selected the other is selected immediately; deleting this artificial endpoint-to-endpoint edge converts the constructed cycle into the required path. Visited-node masks maintain feasibility. [Lower-level Model.](https://arxiv.org/pdf/2304.09395v1#page=4)

The upper actor-critic uses PPO clipping, generalized advantage estimation, a value loss and entropy term. Its reward is the change in partial-tour length, with discount one. The lower model uses REINFORCE on negative local path length with a mean-return baseline across rollouts of the same instance. Joint training alternates trajectories collected with the current lower policy and lower-policy updates from upper-generated subproblems. This is coordinated RL, rather than differentiating a route through both networks. [Training, Equations 4-10.](https://arxiv.org/pdf/2304.09395v1#page=5)

Lower-policy warm-up lasts 500 epochs. Joint training uses 500/1000/1500/2000 epochs for the four respective problem sizes, AdamW learning rate 1e-4 and weight decay 1e-6. These are separate size-trained models, not a single checkpoint trained once for every scale or task. [Experiments.](https://arxiv.org/pdf/2304.09395v1#page=6)

## Experiments

### Large-scale synthetic benchmark

Random1000 contains 128 instances; Random2000/5000/10000 each contain 16. The 1000- and 10000-node sets match Att-GCN+MCTS's data, while the other sets use uniform unit-square coordinates. Reported hardware is one Tesla V100 16GB and an Intel Xeon Platinum CPU. Table 1 times are **average seconds per instance**. Gaps use Concorde for 1000/2000 and LKH-3 for 5000/10000; the latter are heuristic-reference gaps. [Table 1.](https://arxiv.org/pdf/2304.09395v1#page=6)

| Size | H-TSP cost / gap / time | Att-GCN+MCTS cost / gap / time | LKH-3 cost / time |
| --- | --- | --- | --- |
| 1000 | 24.65 / 6.62% / 0.33 s | 23.86 / 3.22% / 5.85 s | 23.16 / 22.01 s |
| 2000 | 34.88 / 7.39% / 0.72 s | 33.42 / 2.91% / 200.28 s | 32.64 / 79.75 s |
| 5000 | 55.01 / 7.10% / 1.66 s | 52.83 / 2.86% / 377.47 s | 51.36 / 561.74 s |
| 10000 | 77.75 / 7.32% / 3.32 s | 74.93 / 3.42% / 395.85 s | 72.45 / 4746.59 s |

The abstract's 3.42% versus 7.32% compares Att-GCN+MCTS with H-TSP on 10000 nodes. H-TSP is faster in this setup, while Att-GCN+MCTS and LKH-3 produce shorter tours. POMO and DRL-2opt transfer poorly from small graphs, and POMO runs out of memory at 10000; this does not imply H-TSP dominates every contemporary neural solver under every inference budget. [Comparative Study.](https://arxiv.org/pdf/2304.09395v1#page=6)

### Transfer and ablations

Figure 1 evaluates all four trained models on 1000-50000 nodes. Model1000 gives 8.51% on Random10000 versus size-matched Model10000's 7.32%. Model10000's gaps at 20000/50000 are 7.38%/6.83%, but the authors explicitly attribute the apparently improved largest-scale gap partly to declining LKH-3 reference quality. It is not evidence that absolute optimality improves as instances grow. [Figure 1 and discussion.](https://arxiv.org/pdf/2304.09395v1#page=7)

Replacing the upper policy with random coordinates or the lower policy with farthest insertion worsens quality; lower-level quality has the larger effect. Replacing the learned lower policy with LKH-3 at inference improves gaps to **4.06/5.01/5.10/5.57%** at 1000/2000/5000/10000, with times **3.53/6.88/15.12/27.94 s**. This is a separate hybrid variant, not the default end-to-end inference cost. [Figure 2 and Table 2.](https://arxiv.org/pdf/2304.09395v1#page=7)

The shorter ablation trains on 1000 nodes for 250 epochs: its full model has 6.76% gap, versus 7.42% without the visited fragment, 7.69% without kNN, 7.53% without joint training, and **27.05% without warm-up**. These ablation numbers use a different training budget from Table 1. [Table 3.](https://arxiv.org/pdf/2304.09395v1#page=7)

## Limitations

### Reported by the Authors

- Decomposition can reduce solution quality, and lower-policy quality materially limits the final tour.
- Stronger local solvers improve quality at extra inference cost; other optimization problems are left to future work. [Framework and Conclusion.](https://arxiv.org/pdf/2304.09395v1#page=3)

### Curator Notes

- The method is a **specialist constructive solver** for Euclidean TSP. Re-solving a partial fragment while inserting unvisited cities is part of construction; it is not the same mechanism as a learned improvement policy repeatedly editing a complete incumbent.
- The main quality advantage is over poorly transferring small-scale neural baselines, while strong classical and heatmap/search solvers have better tours.
- Large-scale sets above 1000 contain only sixteen instances each. Timings depend on the stated implementation, lower-level rollouts and hardware; offline warm-up and joint training are additional costs.
- The original note's claim that partition choices cannot be corrected was too strong: selected visited fragments can be reconstructed during insertion.

## Reproducibility

- **Reading:** all nine pages of arXiv v1 (19 April 2023) were reread, including the complete references. The AAAI page returns a bot-access denial; the author Microsoft Research page and official repository were manually inspected. The full manuscript contains no appendix or reference to a missing scientific supplement, and these author pages expose no separate scientific attachment. The user-authorized arXiv fallback supplies the reading source; inaccessible publisher attachments are not claimed to have been inspected.
- **Metadata:** formal title uses *Traveling*, while arXiv uses *Travelling*. The title page confirms seven authors and **three** institutions, including the previously omitted University of Science and Technology of China. The publisher-deposited [Crossref record](https://api.crossref.org/works/10.1609/aaai.v37i8.26120) gives formal online publication **26 June 2023**, distinct from the February conference and April preprint. Generic notification-day acceptance metadata was removed.
- **Code:** [Learning4Optimization-HUST/H-TSP](https://github.com/Learning4Optimization-HUST/H-TSP). Both main and lower-POMO READMEs were read; Linux, PyTorch 1.10/CUDA 11.3 and manual LKH installation are documented, with Docker setup, configuration files, training/evaluation entry points, model and data links. Experiments were not rerun.
- **Image:** Figure 1 is the original arXiv p. 7 cross-size heatmap crop, not an invented architecture illustration. Algorithms 1-2, model equations and all three result tables were visually checked.
