---
id: difusco
short_title: DIFUSCO
title: 'DIFUSCO: Graph-based Diffusion Solvers for Combinatorial Optimization'
authors:
- Zhiqing Sun
- Yiming Yang
year: 2023
date: '2023-02-16'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/0ba520d93c3df592c83a611961314c98-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2302.08224
code_url: https://github.com/Edward-Sun/DIFUSCO
institutions:
- Carnegie Mellon University
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Maximum Independent Set
summary: Separate graph diffusion models denoise tour-edge or independent-set node indicators, followed by task-specific
  decoding; results depend on diffusion, sampling and postprocessing budgets.
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/0ba520d93c3df592c83a611961314c98-Abstract-Conference.html
---

# DIFUSCO: Graph-based Diffusion Solvers for Combinatorial Optimization

> **TL;DR:** DIFUSCO learns to denoise binary node or edge indicators and turns the resulting heatmaps into feasible solutions with task-specific decoding. Experiments cover TSP and maximum-cardinality independent sets; strong TSP results combine diffusion with 2-opt or MCTS, while independent-set results depend strongly on the graph distribution.

## Motivation

Autoregressive solvers require sequential construction decisions. Earlier heatmap methods predict many decisions in parallel but commonly factor their output distribution across variables. DIFUSCO seeks a richer distribution over good solutions through iterative, graph-conditioned denoising, while evaluating all variables in parallel at each neural step. The final feasible solution still requires a separate decoding procedure.

## Contributions

- Formulates solutions as binary edge selections for TSP or node selections for independent sets and learns a supervised graph diffusion model.
- Compares Bernoulli discrete diffusion with a Gaussian alternative and studies inference schedules, denoising-step counts and sample counts.
- Evaluates size transfer, TSP search combinations and independent-set benchmarks, exposing both favorable and unfavorable settings.

## Methodology

The discrete forward process independently corrupts binary variables with a two-state transition matrix. A graph network predicts clean binary values from noisy states and the diffusion timestep; its predictions parameterize the reverse transition. The continuous alternative maps bits to `{−1, 1}` and learns to predict Gaussian noise. Training uses reference solutions rather than objective-only reinforcement learning: Concorde labels TSP50/100, LKH3 labels larger TSP instances, and KaMIS labels independent-set graphs. Consequently, large-task labels are high-quality heuristic solutions, not certified optima.

Both variants use a 12-layer anisotropic GNN with width 256, residual updates, edge gating and timestep features. The binary variables occupy edges for TSP and nodes for independent sets. Larger TSP graphs retain nearest-neighbor edges: 50 neighbors for TSP500 and 100 for TSP1000/10000. Training uses a 1,000-step noise process; accelerated inference selects a smaller subsequence of timesteps. The cosine **inference** schedule concentrates more evaluations in the low-noise regime and should be distinguished from the training noise schedule and learning-rate schedule.

Diffusion outputs need not satisfy combinatorial constraints. For TSP, the decoder ranks edges by symmetrized heatmap score divided by Euclidean distance and inserts them subject to conflicts. Results optionally add 2-opt or use heatmap-guided MCTS over k-opt moves. For independent sets, nodes are inserted greedily by their heatmap scores while excluding conflicts; graph reduction and local-search postprocessing are disabled in the reported comparison. Different random seeds yield different heatmaps, and sampling returns the best decoded solution.

The paper sometimes calls the graph task **maximal** independent set. Its objective minimizes the number of unselected nodes, so the optimization task is maximum-cardinality independent set; finding an arbitrary maximal set is not the hard optimization objective. Using the same architecture for the two tasks does not demonstrate shared trained parameters. This entry remains a specialist constructive method, with separately identified search/refinement settings.

## Experiments

All models train for 50 epochs with a cosine learning rate starting at `2e-4`. Training uses eight V100 GPUs; evaluation uses one V100 and the stated Xeon CPU resources. The large TSP models use curriculum initialization: TSP500/1000 initialize from TSP100, and TSP10000 from TSP500. These are separate trained checkpoints, distinct from the cross-size tests. Results average five inference random seeds.

The default TSP greedy setting uses 50 diffusion steps and one heatmap; sampling uses ten steps and 16 heatmaps. The default decoding includes 2-opt, so “greedy” does not mean a single neural pass without refinement.

| TSP test | Greedy + 2-opt gap | Sampling + 2-opt gap | Single-heatmap MCTS gap | MCTS total reported time |
| --- | ---: | ---: | ---: | ---: |
| 500 nodes | 1.49% | 0.57% | 0.46% | 10.13 min |
| 1,000 nodes | 1.90% | 1.43% | 1.17% | 24.47 min |
| 10,000 nodes | 3.10% | 2.95% | 2.58% | 47.36 min |

These Table 2 times cover the full corresponding test set, not one instance. The large-table baselines are taken from earlier studies and may use different hardware, so their times are not directly comparable. TSP500/1000 gaps use Concorde references; TSP10000 uses an LKH3 reference and is not a certified optimality gap. MCTS results compare one generated heatmap; Appendix C separately studies two and four heatmaps with increased computation.

Postprocessing is consequential. On TSP10000, one heatmap with greedy decoding alone has a 36.75% gap, falling to 3.10% with 2-opt. On TSP100, Table 4 reports 1.45574% without 2-opt versus 0.23869% with it for 50 steps and one sample. The small negative gaps against Concorde in sampling results are attributed by the authors to integer-coordinate rounding, not a solution better than the true optimum.

Discrete diffusion is stronger than the continuous variant in the studied TSP regimes, particularly with more than five denoising steps. The paper also finds that additional denoising steps can be more efficient than many one-step samples. Cross-size heatmaps and 29 small Euclidean TSPLIB instances provide transfer evidence; the TSP100-trained model has mean TSPLIB gap 0.290% in Table 6. This evidence does not establish transfer to arbitrary constraints or all TSPLIB sizes. Appendix C prose rounds the comparison to 0.29% versus 1.48%, whereas Table 6 gives 1.529% for Hudson et al. and 1.480% for the TSP50-trained DIFUSCO model; the table is used here.

Independent-set tests use SATLIB-derived graphs and ER graphs with 700–800 nodes and edge probability 0.15. SATLIB uses discrete diffusion, while ER uses **continuous diffusion** because discrete diffusion performs poorly there. SATLIB sampling reaches mean set size 425.13 and a 0.21% gap to the KaMIS reference, versus DIMES' 423.28 and 0.63%. On ER, DIFUSCO sampling reaches 41.12 and 8.36%, while DIMES reaches 42.06 and 6.26%. These references come from a heuristic solver; neither the SATLIB improvement nor a small gap proves exactness. The authors' proposed explanation involving GNN inductive bias is a hypothesis.

## Limitations

### Reported by the Authors

- Raw denoising outputs can be infeasible; Figure 12 shows a TSP failure without postprocessing.
- ER independent-set performance is weaker, particularly with discrete diffusion.
- Mixed-integer programming is discussed as a possible binary encoding, without an evaluated MIP solver in this paper.

### Curator Notes

- Training data generation, curriculum, diffusion evaluations, candidate counts and downstream search belong in the comparison budget.
- Strong large-TSP results include substantial conventional decoding/search. The neural-only heatmap is not the final solver.
- The publisher appendix labels a Table 1 baseline “DPDP” but points to reference [79], which is DACT. This inconsistent attribution is retained as a caveat; it is not silently resolved into a citation edge to the separate DPDP paper. Other numerical inconsistencies and small negative gaps are also not treated as exact performance certificates.
- Terminology and broad statements in the abstract are qualified here using the task definitions and actual per-distribution results.

## Reproducibility

- **Official implementation:** [Edward-Sun/DIFUSCO](https://github.com/Edward-Sun/DIFUSCO), linked on publisher page 1. The author repository includes diffusion code, data resources, `tsp_mcts`, an environment file and reproduction scripts.
- **Reviewed source:** All 26 pages of the NeurIPS 2023 publisher PDF, including references and Appendices A–H. Key equations, quantitative tables and qualitative success/failure examples were visually checked.
- **Validation scope:** Source and note verification; no claim of rerunning training, compiling MCTS or numerically reproducing the reported experiments.
- **Reading map:** Sections 3–5 define the model and task-specific results; Appendix A explains rounding caveats; Appendix C contains transfer and search ablations; Appendix E gives training/hardware details; Appendices F–H give decoding, fast transitions and baselines.
