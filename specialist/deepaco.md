---
id: deepaco
short_title: DeepACO
title: 'DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization'
authors:
- Haoran Ye
- Jiarui Wang
- Zhiguang Cao
- Helan Liang
- Yong Li
year: 2023
date: '2023-09-25'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/883105b282fe15275991b411e6b200c5-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2309.14032
code_url: https://github.com/henry-yeh/DeepACO
institutions:
- Soochow University
- Singapore Management University
- Tsinghua University
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
- Assignment
- Scheduling
- Subset Selection
- Packing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Orienteering Problem
- Prize Collecting Traveling Salesman Problem
- Sequential Ordering Problem
- Single Machine Total Weighted Tardiness Problem
- Resource-Constrained Project Scheduling Problem
- Multidimensional Knapsack Problem
- Bin Packing Problem
summary: DeepACO learns instance-dependent heuristic measures for Ant Colony Optimization, using them both to construct
  solutions and to guide perturbations between local-search phases.
figure:
  path: paper-assets/deepaco/framework.png
  alt: Side-by-side workflow diagrams for conventional ACO and DeepACO.
  caption: 'Figure 1: Schematic comparison of ACO and DeepACO, including learned heuristic measures and optional
    local search.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=4
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/883105b282fe15275991b411e6b200c5-Abstract-Conference.html
---

# DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization

> **TL;DR:** DeepACO learns instance-dependent ACO heuristic measures, then combines ant construction, pheromone updates and optional local search guided by the same learned measures. Its broad framework is instantiated with separately trained task/scale models.

## Motivation

ACO needs a feasible construction procedure, a pheromone representation and a heuristic measure for each problem. Designing the latter usually requires expertise. DeepACO learns this measure from objective evaluations and tests whether it can improve several ACO variants. To improve final quality, it also reuses the learned measure to move local search beyond a local optimum. [Sections 1-4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=2)

## Contributions

- A non-autoregressive heuristic learner replaces hand-crafted desirability scores inside ant transition probabilities.
- Neural local search (NLS) alternates true-objective improvement and heuristic-guided perturbation, without adding another network.
- REINFORCE can combine costs before and after NLS; optional multihead, entropy and imitation losses encourage exploration.
- Eight main problem types are evaluated, with bin packing added in the appendix. A common architecture and framework across tasks do **not** imply a single shared checkpoint. [Sections 4-5 and Appendices A-D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=4)

## Methodology

### Learned construction and pheromones

A 12-layer anisotropic GNN with edge gating, residual connections, batch normalization and SiLU activations produces edge features; a three-layer MLP with sigmoid output predicts a nonnegative heuristic matrix. Ants sample feasible components with probability proportional to `pheromone^alpha * heuristic^beta`, with alpha and beta normally one. Feasibility masks and the solution representation remain problem-specific. The network computes the heuristic once per instance rather than rerunning at every construction step. At inference, objective-based pheromone updates change subsequent sampling; this is not a neural-weight update. [Sections 3-4.1 and Appendix A.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=4)

Most experiments use successor-edge pheromones. For item-based knapsack pheromones, Appendix A instead uses a three-layer Transformer (hidden width 32, two heads, no positional encoding) and a pointwise MLP. Thus even the architecture has an explicitly documented variant. TSP uses nearest-neighbor pruning (10 neighbors at size 20, 20 at 50/100, 50 at 500); comparison ACO receives the same pruning. [Appendices A, C.5 and D.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=16)

### Neural local search and learning

Ordinary local search first reaches a local optimum under true cost. Each NLS iteration then performs up to `Tp` local moves using the inverse learned heuristic as its surrogate objective, followed by ordinary true-cost local search. The best incumbent is retained even if intermediate perturbations worsen its true cost. TSP uses 2-opt; CVRP uses HGS operators including swap, relocate, 2-opt, 2-opt-star and swap-star. Occasionally infeasible CVRP local-search results are discarded. [Algorithm 1 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=5)

Training minimizes expected `raw_cost + W * NLS_cost`, using REINFORCE and separate mean baselines for the two costs. NLS itself does not pass gradients through its moves. Training pheromones are fixed to one, while inference uses ACO updates. The eight-problem ACO experiment omits NLS and uses W=0. The stronger TSP comparison uses W=9, ten NLS rounds and twenty perturbation moves per round. Optional exploration variants use four heuristic heads with a diversity term, a top-five entropy term, or imitation of an expert heuristic; the imitation variant therefore uses expert information. [Sections 4.3-4.4, 5.2-5.3 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=5)

## Experiments

### Scope and training

The main tasks are TSP, CVRP, OP, PCTSP, sequential ordering, single-machine total weighted tardiness, RCPSP and the task called MKP in the paper. Appendix D.8's binary selection formulation has multiple resource constraints on one chosen subset: it is **multidimensional 0-1 knapsack**, rather than assignment to multiple knapsacks. Appendix C.3/D.9 additionally evaluates bin packing with 120 items, capacity 150 and item sizes sampled from 20 to 100. [Section 5.1 and Appendix D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=7)

The non-NLS ACO comparisons use 100 held-out instances per benchmark, averaged over three runs, and compare Ant System, Elitist Ant System and MAX-MIN Ant System under matched pruning. Further CVRP experiments use adaptive elitist ACO. Hardware is a 48-core Xeon Platinum 8350C and an RTX 3090. Table 7 reports very small **non-NLS** training sets and budgets: for example 640 instances and 1/2/8 minutes for TSP20/100/500, and 640 instances and 2/4/18 minutes for CVRP20/100/500. These timings should not be attributed to the best NLS-trained routing configurations. [Sections 5.1-5.2 and Appendix C.4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=7)

### Routing quality and runtime

Table 1 times are per instance. The reference gaps below are relative to the table's LKH results, not a claim that LKH proves optimality. Several comparison rows are imported from other papers, so their hardware and implementations are not controlled by this experiment. [Table 1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=9)

| TSP setting | DeepACO, 2 ACO iterations | DeepACO, 10 iterations | Relevant comparison |
| --- | --- | --- | --- |
| 500 nodes | Cost 16.94; 2.36%; 2.0 s | 16.86; 1.84%; 10 s | DIFUSCO+MCTS: 16.63; 0.46%; 4.7 s |
| 1000 nodes | 23.99; 3.76%; 6.4 s | 23.85; 3.16%; 32 s | DIFUSCO+MCTS: 23.39; 1.17%; 11 s |

DeepACO improves the compared vanilla ACO, but DIFUSCO+MCTS has better quality and shorter listed runtimes in these settings. Removing learned perturbation or NLS-aware training worsens the reported TSP costs. Table 3's imported TSP100 means are not all from the same test set; their absolute costs should not be converted into a common certified gap. [Tables 1-3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=9)

In Table 4, ten-iteration DeepACO obtains CVRP100/400/1000/2000 costs **15.77/25.27/44.82/61.66** in **3.87/5.89/15.87/35.94 seconds**. TAM-LKH3 gives 16.08/25.93/46.34/64.78 in 0.86/1.35/1.82/5.63 seconds: DeepACO improves these costs at a larger runtime. This CVRP generator fixes the depot at the unit-square center and vehicle capacity at 50 across sizes, with demands 1-9. It is not interchangeable with every standard AM-style CVRP dataset. [Appendix C.2, Table 4 and D.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=18)

### Transfer and ablations

The TSPLIB study uses 49 symmetric EUC_2D instances below 1000 nodes, selecting TSP20-, TSP100- or TSP500-trained checkpoints by instance size. Its curves compare ACO variants and show gains from learned heuristics; they do not establish a single checkpoint's universal zero-shot superiority. A separate cross-scale experiment transfers a TSP100 model to 500/1000 nodes: costs 17.18/24.69 improve ACO's 17.55/24.93, but are worse than the scale-matched DeepACO costs 16.98/23.96. [Section 5.2 and Appendix C.3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=8)

Multihead, entropy and imitation variants improve the small-TSP no-local-search curves. Item-pheromone experiments support replacing the successor representation for knapsack. These studies demonstrate flexibility within explicitly chosen problem models and budgets. [Figures 6-8 and Appendix C.5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=9)

## Limitations

### Reported by the Authors

- A static n-by-n heuristic matrix may not capture complex structures adequately.
- Learned heuristics alone can need local search to approach high-quality solutions; richer representations and other problem structures remain future work. [Section 6.](https://proceedings.neurips.cc/paper_files/paper/2023/file/883105b282fe15275991b411e6b200c5-Paper-Conference.pdf#page=9)

### Curator Notes

- Problem-specific feasibility, graph features, pheromone design, pruning and local-search operators remain required. Separately trained task/scale checkpoints support **specialist** classification.
- The proposed learned construction plus incumbent NLS supports **constructive-improvement** classification; the no-NLS ablation should not define the whole method's paradigm.
- More ACO and NLS iterations improve quality while increasing cost. Imported baseline runtimes, heuristic gap references, the CVRP generator and offline training must remain explicit.
- Multiple task names in the paper are broad; the metadata uses the actual Appendix D.8 multidimensional-knapsack formulation and includes the appendix-only bin-packing experiment.

## Reproducibility

- **Reading:** all 23 pages of the formal NeurIPS PDF were reread, including Appendices A-D.9. The publisher's 18,751,312-byte supplement ZIP was downloaded and all 185 members inventoried. It contains code/data and READMEs, with no scientific PDF or nested ZIP; relevant task READMEs were read. All scientific appendices are in the registered PDF. [Publisher record.](https://proceedings.neurips.cc/paper_files/paper/2023/hash/883105b282fe15275991b411e6b200c5-Abstract-Conference.html)
- **Metadata:** the title page confirms five authors at Soochow University, Singapore Management University and Tsinghua University. Formal publication is NeurIPS 2023; arXiv history identifies first submission on 25 September 2023. Generic conference notification-day acceptance metadata was removed. The current arXiv abstract says *single neural architecture*, which should not be mistaken for task-shared weights. [Version history.](https://arxiv.org/abs/2309.14032)
- **Code:** [henry-yeh/DeepACO](https://github.com/henry-yeh/DeepACO). The published and current README instructions cover nine tasks, separate checkpoints and TSP/CVRP NLS. The CVRP NLS wrapper needs the modified HGS C++ build; task data generation is documented separately. The CVRP example transfers its size-500 checkpoint to 1000/2000, while TSP instructions supply size-specific models. Experiments were not rerun.
- **Image:** the displayed complete Figure 1 is cropped directly from formal PDF p. 4; its panels, Algorithm 1, objective equations, result tables and main transfer/ablation curves were visually checked.
