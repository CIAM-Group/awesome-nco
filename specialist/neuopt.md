---
id: neuopt
short_title: NeuOpt
title: Learning to Search Feasible and Infeasible Regions of Routing Problems with Flexible Neural k-Opt
authors:
- Yining Ma
- Zhiguang Cao
- Yeow Meng Chee
year: 2023
date: '2023-10-27'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/9bae70d354793a95fa18751888cea07d-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2310.18264
code_url: https://github.com/yining043/NeuOpt
institutions:
- National University of Singapore
- Singapore Management University
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: NeuOpt learns sequential k-opt incumbent moves with a dual-GRU decoder; CVRP adds features and shaped rewards
  to explore temporary capacity violations, and dynamic augmentation diversifies inference.
figure:
  path: paper-assets/neuopt/framework.png
  alt: NeuOpt sequence of flexible k-opt transformations over a routing solution.
  caption: 'Figure 1: Recurrent dual-stream decoding of a 3-opt exchange, including the complete node/edge update
    panels.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=4
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/9bae70d354793a95fa18751888cea07d-Abstract-Conference.html
---

# Learning to Search Feasible and Infeasible Regions of Routing Problems with Flexible Neural k-Opt

> **TL;DR:** NeuOpt learns sequential k-opt incumbent moves with a dual-GRU decoder. CVRP adds features and shaped rewards to explore temporary capacity violations, while dynamic augmentation diversifies inference. Strong results depend on the move and augmentation budget.

## Motivation

Neural local search restricted to fixed 2-opt or 3-opt neighborhoods can miss useful larger exchanges. Enforcing every capacity constraint by action masking can also prevent movement between promising feasible regions. NeuOpt learns how long a sequential exchange should be, and its Guided Infeasible Region Exploration (GIRE) scheme deliberately visits capacity-infeasible routes while retaining the best feasible answer. [Sections 1-5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=2)

## Contributions

- Starting, intermediate and ending moves factor a sequential k-opt action into node selections, permitting early termination and varying exchange sizes.
- A recurrent dual-stream (RDS) decoder tracks prior selected moves and proposed edges using separate GRUs.
- GIRE supplies capacity-violation indicators, recent feasibility-transition statistics and shaped rewards to guide exploration beyond feasible-only masking.
- Dynamic Data Augmentation (D2A) changes coordinate representations after search stagnation, improving diversity without changing the underlying routing objective. [Sections 4-5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=4)

## Methodology

### Factorized incumbent moves

An S-move removes an edge from the current cycle, creating a path and an anchor. I-moves reconnect one endpoint to a later-ranked node, remove its outgoing edge and reverse the intervening path direction. An E-move closes the path. Sequential rank restrictions preserve a valid tour structure. Decoding can stop early; null padding gives a fixed action representation, and a final closure is added if necessary. The formulation represents a restricted sequential exchange family, not an enumeration of every possible k-opt reconnection. [Section 4.1 and Appendix A.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=4)

The main experiments set the maximum decoding length **K=4**; studies vary K from two through six. The general architecture's ability to support larger k should not be mistaken for unbounded exchanges in a reported run. Each action changes the current solution, which can worsen before later improvement; reward tracks improvement of the best-so-far solution. The policy observes the current route/instance, while the best-so-far route is used by reward and critic rather than as policy input. [Section 4.1, Table 8 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=5)

Three Transformer-style encoders use Synthesis Attention and cyclic positional features to combine instance attributes and current-route order. A width-128 representation feeds two GRUs: the move stream receives the last selected node, while the edge stream receives the source of the next proposed edge. Their additive and elementwise-product attention scores are combined, clipped and masked for structural validity. The recurrent history concerns selections **within an exchange**; this is more specific than describing an unspecified Transformer policy. [Sections 4.2 and Appendices B-C.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=5)

### Capacity exploration and training

For CVRP, six base node features include coordinates, demand, cumulative route demand before/after the node and a customer indicator. GIRE adds two binary violation indicators. Nine exploration features encode eight recent feasible/infeasible transition statistics and current feasibility, using a 25-step window. Small hypernetworks use these features to generate each stream's final projection weights. Structural route-validity masking remains; GIRE relaxes **capacity** feasibility in the demonstrated task, not every possible routing constraint. [Section 5 and Appendix B/D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=6)

Reward shaping combines the original feasible-best improvement reward, a regulation term penalizing extreme feasibility-transition behavior, and a bonus for improved near-feasible solutions. Both shaping weights are 0.05. Near-feasibility is defined by a capacity-violation threshold scaled using customer count, average demand and capacity, with coefficient 0.1. Three critics estimate the separate reward components. This differs from simply adding a fixed capacity penalty to route length. [Equations 4-5 and Appendices C-D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=7)

Training uses n-step PPO with curriculum-generated starting solutions, 200 epochs and twenty batches per epoch. TSP uses batch 512, four-step returns and 200 rollout steps; CVRP uses batch 600, five-step returns and 250 steps. Discount is 0.999, three PPO inner updates, clip 0.1, actor/critic learning rates 8e-5/2e-5 with 0.985 epoch decay. Reported CVRP training costs are about four days on one GPU at size 20, five days on two GPUs at size 50, and eight days on four GPUs at size 100. [Appendix C.1/E.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=16)

### Dynamic inference augmentation

Each of D2A parallel trajectories starts from a random feasible route. After ten steps without a new best, reapply a randomly configured sequence of coordinate swaps, reflections and right-angle rotations. The incumbent route is retained while its geometric representation changes; this is neither a neural-weight adaptation nor a route restart. Return the best feasible solution over all trajectories. Both trajectory count and improvement horizon contribute to compute. [Appendix C.2, Algorithms 2-3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=17)

## Experiments

### Synthetic routing benchmarks

Main tests use **10000 instances** at each of 20/50/100 customers. Coordinates are uniform in the unit square; CVRP demands are 1-9, with capacities 30/40/50 and 10/20/20 dummy depots for batching. Models are trained separately by task and size. Reported dataset runtimes use one 2080 Ti for neural inference and one CPU for classical methods, except explicitly imported comparisons; the server CPU is an E5-2680 at 2.40 GHz. TSP gaps use Concorde, while CVRP gaps use **HGS**, a heuristic reference. [Section 6 and Appendix E.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=7)

| Size-100 setting | Reported gap | Whole-dataset time |
| --- | --- | --- |
| TSP, D2A=1 / 1000 moves | 0.33% | 17 min |
| TSP, D2A=1 / 10000 moves | 0.02% | 2.8 h |
| TSP, D2A=5 / 5000 moves | 0.00% rounded | 7 h |
| CVRP-GIRE, D2A=1 / 1000 moves | 1.94% | 28 min |
| CVRP-GIRE, D2A=1 / 10000 moves | 0.60% | 4.6 h |
| CVRP-GIRE, D2A=5 / 6000 moves | 0.30% | 13.8 h |
| CVRP-GIRE, D2A=5 / 40000 moves | 0.10% | 3.8 days |

The largest CVRP budget improves LKH-3's 0.54% reference gap, but remains above the HGS reference. The advantage over EAS/SGBS depends on configuration: the table's long EAS+SGBS row also has 0.10% at 4.1 days. At smaller budgets, POMO's 0.70% in 7.2 h is stronger in quality than NeuOpt's 1.94% at 28 min, illustrating the need to compare quality/runtime pairs. Rounded TSP 0.00% does not certify every test instance optimal. [Table 1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=8)

Some baseline results are reproduced on the authors' hardware; rows marked with approximately-equal signs are imported. Appendix E.1 additionally identifies alleged GEO-versus-Euclidean reference issues for several heatmap baselines. These are **the authors' diagnosis**, not a new independent correction established by this audit. The original source denominators and import markings matter when comparing very small TSP gaps. [Table 1 footnotes and Appendix E.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=20)

### Mechanism, generalization and size 200

Controlled ablations compare four training runs, while GIRE component boxplots use eight. An upgraded DACT encoder reduces an architectural confound; RDS, both GRU streams, larger K, GIRE and D2A each help in the tested settings. Table 2's gaps are relative to its best compared model, unlike Table 1's Concorde/HGS references. Without D2A, TSP100/CVRP100 at 5000 steps give 0.09%/1.00%, compared with 0.05%/0.87% with D2A. [Tables 2-4 and Figures 4-6.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=9)

Size-100 checkpoints transfer to **20 TSPLIB** and **21 CVRPLIB** instances up to 200 nodes, with ten independent runs. At 10000 explored solutions, mean/best aggregate gaps are 0.85%/0.50% on TSPLIB and 4.80%/3.27% on CVRPLIB. Aggregate improvement does not imply per-instance dominance: for example, CVRPLIB X-n153-k22 has NeuOpt mean 9.16% versus DACT 7.62% at the same budget. More search improves the aggregates, with its extra cost. [Tables 10-11.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=22)

The size-200 study instead **trains new size-200 models**, uses CVRP capacity 70 and thirty dummy depots, and reports separate results. At D2A=5/30000 steps, TSP200 has 0.01% in 14.1 h and CVRP200 0.39% against HGS in 1.2 days, versus LKH's CVRP 1.17%. This is not zero-shot scaling from size 100. Multi-GPU timings are separately reported; for example, CVRP100 at D2A=1/1000 steps drops from 28 minutes on one GPU to eight on four. [Appendix E.3-E.4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=23)

## Limitations

### Reported by the Authors

- Scalability still trails some prediction-based large-TSP solvers; decomposition, heatmaps, scalable encoders and optimized kernels are future improvements.
- Additional routing constraints and stronger distribution/size generalization remain future work; only CVRP capacity handling demonstrates GIRE here. [Section 7 and Appendix D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9bae70d354793a95fa18751888cea07d-Paper-Conference.pdf#page=10)

### Curator Notes

- **Specialist / improvement** follows separate task/size checkpoints and neural edits of complete incumbents; random initialization is not a learned construction phase.
- Feasible outputs coexist with infeasible intermediate routes. The paper gives no general global-optimality or eventual-feasibility theorem for arbitrary constraints.
- Model architecture, K, D2A, move count, offline multi-GPU training and the gap denominator all materially affect comparison claims.
- The original institution metadata incorrectly said Nanyang Technological University; the actual title-page affiliations are National University of Singapore and Singapore Management University.

## Reproducibility

- **Reading:** all 24 pages of the formal publisher PDF were reread, including Appendices A-E.6. Manual inspection of the official NeurIPS page shows the paper link and no separate scientific supplement; every referenced appendix is integrated and was read. [Publisher record.](https://proceedings.neurips.cc/paper_files/paper/2023/hash/9bae70d354793a95fa18751888cea07d-Abstract-Conference.html)
- **Metadata:** the title page confirms three authors, NUS and SMU. Formal publication is NeurIPS 2023; arXiv history gives its only v1 on 27 October 2023. Generic conference notification-day acceptance metadata was removed.
- **Implementation:** [yining043/NeuOpt](https://github.com/yining043/NeuOpt). The complete official README was read; it documents TSP/CVRP models at 20/50/100/200, K=4, data generation, multi-GPU training commands, D2A settings, example notebooks and evaluation. Runtime numbers above are paper results; experiments were not rerun.
- **Citation identity:** reference [8] is the separate 2022 Artificial Intelligence article *Neural large neighborhood search for routing problems*, article 103786. It is not forced onto the repository's ECAI 2020 NLNS ID merely because the authors/code overlap; that expanded journal article needs its own version/eligibility review.
- **Image:** complete Figure 1 is cropped from formal p. 4, preserving the RDS streams and all lower edge-update panels. Factorization examples, reward/critic equations, feasible/infeasible trajectories, training plots and the main/appendix tables were visually checked.
