---
id: dimes
short_title: DIMES
title: 'DIMES: A Differentiable Meta Solver for Combinatorial Optimization Problems'
authors:
- Ruizhong Qiu
- Zhiqing Sun
- Yiming Yang
year: 2022
date: '2022-10-08'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/a3a7387e49f4de290c23beea2dfcdc75-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2210.04123
code_url: https://github.com/DIMESTeam/DIMES
institutions:
- University of Illinois Urbana-Champaign
- Carnegie Mellon University
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Maximum Independent Set
summary: Separate TSP/MIS networks initialize score-based constructive sampling; first-order meta-learning supports
  per-instance TSP adaptation, with optional MCTS and distinct inference budgets.
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/a3a7387e49f4de290c23beea2dfcdc75-Abstract-Conference.html
---

# DIMES: A Differentiable Meta Solver for Combinatorial Optimization Problems

> **TL;DR:** DIMES predicts continuous scores that parameterize cheap, task-specific solution sampling. First-order meta-learning prepares these scores for per-instance adaptation. The strongest TSP setting additionally uses MCTS; the MIS setting uses a different network and no active search.

## Motivation

Large neural routing policies repeatedly evaluate a network during sequential decoding. DIMES separates graph representation from candidate generation: run a graph network to produce continuous scores, then sample many feasible solutions using those scores without a neural forward pass at each decision. This removes repeated neural decoding computation, **not the sequential dependency of the auxiliary sampler**.

## Contributions

- Defines a continuous energy-based solution parameterization and tractable auxiliary sampling distributions for TSP and independent sets.
- Uses objective-only REINFORCE updates and first-order meta-learning across individual instances, avoiding reference-tour training labels.
- Separates direct decoding, active search and heatmap-guided MCTS in large-scale TSP experiments, with additional independent-set evaluations.

## Methodology

The conceptual energy model scores feasible binary selections as `pθ(f) ∝ exp(fᵀθ)`. Direct sampling from this constrained distribution is difficult, so DIMES instead optimizes expected cost under an auxiliary distribution `qθ`. For TSP, choose a random first node and repeatedly sample an unvisited next node according to outgoing edge logits. For independent sets, sample a node from those still compatible with the selected set until the set is maximal. The objective seeks the largest set: “maximal” describes the sampler's stopping constraint, while maximum cardinality is the optimization goal.

REINFORCE estimates `∇θ E[f ∼ qθ][c(f)]` with a sampling-based baseline. A network initializes instance-specific scores, inner updates adapt to a sampled instance, and a first-order meta-update favors low cost after adaptation. The evaluated TSP implementation freezes the GNN backbone during adaptation and optimizes **the GNN output representation and the following MLP**, rather than simply updating raw logits or all network weights. Ablations compare these alternatives.

TSP uses a 12-layer anisotropic GNN and a three-layer MLP, both with width 32, with nearest-neighbor graph sparsification. MIS instead uses a GCN backbone followed by a ten-layer residual MLP. These are separate trained task models. A general framework and meta-learning across instances do not demonstrate one generalist model across TSP and MIS.

The supplement's propositions state that concentration of `qθ` on a solution implies concentration of `pθ` on that solution; the MIS statement adds normalization and boundedness assumptions. They do **not** prove that REINFORCE finds a globally optimal solution. The first-order meta-gradient argument omits higher-order terms in a small-step-size approximation, not an exact equality for arbitrary finite updates.

Greedy and sampled decoding construct solutions from the scores. An optional TSP MCTS stage samples heatmap-guided k-opt improvements. We classify the main neural solver as **constructive**, consistent with Section 2.1; parameter adaptation alone is not incumbent local search. MCTS remains an explicitly identified additional improvement procedure.

## Experiments

Synthetic TSP nodes are uniform in the unit square. Separate models train directly on TSP500, TSP1000 and TSP10000 using 120, 120 and 50 meta-updates, each with three generated instances. Reported training times are about 1.5, 1.7 and ten hours on a P100. These small instance counts do not equal the number of sampled candidate trajectories, because each meta-update contains inner optimization and solution sampling.

Testing uses 128 instances for each of TSP500/1000 and 16 for TSP10000. **Table 1 times cover the entire corresponding test set.** Neural inference uses a GTX 1080 Ti; MCTS uses a Xeon Gold 6230 CPU with 64 or 16 threads. Other classical-solver timings use a different stated CPU, and many baseline qualities are inherited, so the table is not uniformly hardware matched.

| Test | Direct greedy gap | MCTS gap without active search | MCTS gap with active search | Total time with active search + MCTS |
| --- | ---: | ---: | ---: | ---: |
| TSP500 | 14.38% | 1.93% | 1.76% | 2.15 h |
| TSP1000 | 14.97% | 2.64% | 2.46% | 4.62 h |
| TSP10000 | 20.44% | 3.98% | 3.19% | 3.57 h |

Active search uses 100 updates per TSP500/1000 instance or 50 for TSP10000. Without active search, MCTS totals are 2.92, 6.87 and 29.83 minutes, respectively. Thus adaptation has a substantial cost. Smaller-scale gaps use Concorde references; TSP10000 uses LKH3 and is not certified optimality. The reported gains over earlier neural methods do not imply beating LKH3.

On TSP1000, Table 2a's greedy ablation gives length 27.11 with neither meta inner updates nor test adaptation, 26.58 with inner updates only, 25.68 with adaptation only, and 24.91 with both. A separate `T=5` ablation finds adapting the GNN output plus MLP strongest among the tested choices. These controls support benefits of both components under their stated budgets.

Independent-set tests cover SATLIB, ER700–800 with edge probability 0.15 and ER9000–11000 with probability 0.02. SATLIB uses 39,500 training and 500 test graphs. **Active search is disabled** because preliminary gains were insignificant, and learned baselines have graph reduction/local search disabled. Sampling reaches SATLIB size 423.28 versus KaMIS' 425.96, and ER700–800 size 42.06 versus 44.87. On the largest ER graphs, DIMES reaches 332.80, below LwD's 345.88 and KaMIS' 381.31. Large ER training initializes from the smaller ER checkpoint; this is additional training, not a zero-shot result.

Supplemental TSP100-to-large-size sampling tests report gaps 16.07%, 17.69% and 20.16%, compared with 13.84%, 14.01% and 19.48% for size-specific models. Training-efficiency plots compare AM/POMO trained on TSP100 against DIMES trained on TSP500, all evaluated on TSP500; this difference must accompany their interpretation.

## Limitations

### Reported by the Authors

- One-shot score prediction can limit reasoning power; LwD performs better on the largest MIS benchmark.
- Extension to multi-valued variables and mixed-integer programming is nontrivial; MIP is discussed but not evaluated.
- The checklist explicitly states that experimental error bars are not reported.

### Curator Notes

- Sequential score-based sampling is cheaper than repeated neural decoding, but is not fully parallel generation of all decisions.
- Active-search updates, repeated candidates and downstream MCTS are separate costs. The strongest result cannot be attributed to one forward pass.
- Training-data size, model scale and hardware differ across several comparisons; small neural training sets do not remove search effort or establish universal sample efficiency.
- Distribution-concentration propositions are not optimization-convergence or approximation guarantees.

## Reproducibility

- **Official implementation:** [DIMESTeam/DIMES](https://github.com/DIMESTeam/DIMES), linked in the supplement. The repository separates TSP and MIS; its README distinguishes sparse `TSP-KNN` from full-graph `TSP-Full` implementations.
- **Reviewed sources:** All 16 pages of the NeurIPS 2022 publisher paper and all seven separately published supplementary pages, including proofs, implementation details, checklist and additional experiments. Equations and quantitative tables were visually cross-checked.
- **Reading map:** Sections 3.1–3.3 define distributions and meta-learning; Section 4 separates task protocols; Supplement B–D gives sampling/architecture/hardware; Supplement E contains conditional propositions and Supplement F additional tests.
- **Validation scope:** Source and note verification, without rerunning solver training or claiming numerical reproduction.
