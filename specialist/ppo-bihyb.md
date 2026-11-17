---
id: ppo-bihyb
short_title: PPO-BiHyb
title: A Bi-Level Framework for Learning to Solve Combinatorial Optimization on Graphs
authors:
- Runzhong Wang
- Zhigang Hua
- Gan Liu
- Jiayi Zhang
- Junchi Yan
- Feng Qi
- Shuang Yang
- Jun Zhou
- Xiaokang Yang
year: 2021
date: '2021-12-06'
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/hash/b2f627fff19fda463cb386442eac2b3d-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2021/hash/b2f627fff19fda463cb386442eac2b3d-Abstract.html
institutions:
- Shanghai Jiao Tong University
- Ant Group
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Scheduling
- Graph Matching
- Graph Optimization
problems:
- DAG Scheduling
- Graph Edit Distance
- Hamiltonian Cycle
summary: Task-specific PPO graph modifiers repeatedly rerun conventional heuristics and rescore original instances;
  beam/search budgets and heuristic references qualify the empirical gains.
code_url: https://github.com/Thinklab-SJTU/PPO-BiHyb
---

# A Bi-Level Framework for Learning to Solve Combinatorial Optimization on Graphs

> **TL;DR:** PPO-BiHyb learns a short sequence of graph modifications, repeatedly calls a conventional heuristic on each modified graph, and scores its solutions on the original problem. DAG scheduling, graph edit distance and Hamiltonian-cycle experiments use different policies/encoders, actions and lower-level heuristics. The strongest claims are empirical improvements within these task-specific settings.

## Motivation

Learning every decision of a large combinatorial solution can require long episodes and a large model. A strong heuristic already supplies a complete solution. The paper instead asks whether a learned graph modifier can make that heuristic produce better original-instance solutions using a smaller number of RL decisions.

## Contributions

- A bi-level formulation separating the original objective from a heuristic's solution on a modified input graph.
- A PPO graph-modification policy, with an edge action factorized into two node selections and rewards after each heuristic call.
- Three task-specific case studies, controlled random-modification baselines, single-level PPO peers and size-transfer tests.

## Methodology

At each step the upper policy changes graph edges, the lower heuristic solves the resulting instance, and reward is the reduction in objective **measured on the original graph**. The framework's constraints must preserve a valid mapping back to the original feasible space. Two conditional node selections avoid predicting all edge probabilities in one flat output, but the joint edge-action space still has quadratic cardinality. Each modification and each evaluated beam candidate incurs another lower-level solve.

The proposition assumes the heuristic maps allowed modified graphs surjectively onto the original feasible solutions. Under that assumption an input inducing an optimum exists, directly by the definition of surjectivity. It does not show that PPO can find that graph efficiently, that the assumption holds for every task/heuristic, or that a fixed small modification budget reaches an optimum. The mathematical lower level uses an argmin notation, while the implementation uses approximate heuristics.

The case studies differ materially:

- **DAG scheduling:** add precedence edges while keeping a valid DAG, then run Critical Path scheduling. Makespan is evaluated with the original job/resource requirements. Two GCNs encode forward/reversed dependencies. The published configuration uses 20 modifications and beam width three.
- **Graph edit distance:** add/delete edges only in the first graph, solve its matching to the fixed second graph with IPFP, and evaluate the induced edit path between the original pair. The encoder uses cross-graph Sinkhorn propagation. The configuration uses ten modifications and beam width three.
- **Hamiltonian cycle:** transform the input to complete 0/1-cost TSP, where original edges cost zero. Increase selected current-tour edge costs by ten to discourage their reuse, rerun LKH-fast and rescore on the original 0/1 costs. Eight modifications and beam width twelve are used. A zero original cost witnesses a Hamiltonian cycle; a positive heuristic tour cost does not prove none exists.

The task-specific GNNs, encoders, heuristics and training configurations do not demonstrate one cross-task checkpoint; this remains specialist. The hybrid combines heuristic construction with iterative learned graph modification, rather than a pure one-pass constructive network or a direct neural k-opt policy.

## Experiments

Scheduling samples jointly contain 50, 100 or 150 TPC-H DAG jobs, averaging about 467, 930 or 1,385 nodes, with 6,000 total resource units. There are 50 training and ten test samples per setting. PPO-BiHyb reduces mean makespan from Critical Path's 9,821/16,914/24,429 seconds to 8,906/15,193/22,371, corresponding to the reported 9.3%/10.2%/8.4% reductions. These are improvements over a heuristic schedule, not optimality gaps. Random modification also improves the baseline, although less. Size tests extend to 300 jobs, roughly 2,800 nodes, within the same task family.

GED uses AIDS molecular graphs split by sizes 20-30, 30-50 and over 50, with 50 training and ten test pairs. Node-type substitution and node/edge insertion/deletion have unit costs. PPO-BiHyb returns mean costs 29.1/61.1/77.0, versus IPFP 37.4/70.4/101.9: reported reductions of 22.2%/13.2%/24.4% against that heuristic reference. The paper does not supply certified GED optima for these comparisons. Random-BiHyb obtains 33.1/66.0/82.4, supporting separate benefits from the wrapper and learned selection under the tested budget.

HCP uses 50 training graphs of size 250-500 and 20 held-out FHCP graphs of size 500-600, a small subset of the 1,001-instance benchmark. PPO-BiHyb finds cycles on 25% versus LKH-accurate's 20%. However, LKH-accurate has the better mean surrogate TSP cost, 6.3 versus 6.7; success rate and mean cost support different rankings. LKH-fast uses five restarts, whereas LKH-accurate uses 100. A 25% success rate on 20 known-Hamiltonian instances is not an exact decision solver.

The supplement caps training time at 48 hours per model and uses separate learning rates `1e-4` for GNNs and `1e-3` for other modules. DAG/GED run on a P100 with an E5-2682v4 CPU and 128 GB RAM; HCP uses a 2080 Ti, i7-7820X and 64 GB. All experiments use one GPU. Task-specific GNN depths/widths are five/64 for DAG, three/64 for GED and three/16 for HCP.

Inference is slower than a single call to the wrapped heuristic because it is called repeatedly. Supplement Table 7 reports, for example, 48.7/110.1/407.9 seconds for the three scheduling settings and 272.2 seconds for HCP, compared with substantially longer PPO-Single times. The table does not explicitly define per-instance versus whole-test-set aggregation, so these values should remain labelled reported times. Baseline beam widths, discount factors and update intervals differ; this is not an otherwise identical-network comparison with only one switch changed.

## Limitations

### Reported by the Authors

- The method needs domain knowledge to define suitable graph modifications and lower-level heuristics; expression simplification is outside demonstrated support.
- The model uses standard GCN blocks, with possible representational improvements left open.
- Repeated lower-level solves make the wrapper slower than its original fast heuristic.

### Curator Notes

- Surjective-input existence is not an approximation ratio or an RL optimization guarantee. Feasibility and meaningful original-instance rescoring need task-specific justification.
- The supplement's capability table lists possible applications, not executed evaluations of every checked task; only the three case studies are catalogued here.
- GED PPO-Single beam width is 20 in the main text but ten in the supplement table/prose. Supplement C also reverses Table 5/6 in its introductory sentence; the table captions identify which settings belong to BiHyb and Single.
- Beam search, heuristic restarts, instance selection and training caps are part of the computational comparison. Neither superior HCP success on this sample nor improved heuristic-relative objectives establish universal state-of-the-art performance.

## Reproducibility

- **Formal publication:** [NeurIPS 2021](https://proceedings.neurips.cc/paper_files/paper/2021/hash/b2f627fff19fda463cb386442eac2b3d-Abstract.html); all nine authors and SJTU/Ant Group affiliations checked on page 1. The proceedings supports publication year, not the former exact December date.
- **Official code:** [Thinklab-SJTU/PPO-BiHyb](https://github.com/Thinklab-SJTU/PPO-BiHyb), linked on page 1, with separate DAG/GED/HCP scripts, configurations, datasets and pretrained models.
- **Reviewed sources:** all 14 main-paper pages plus all five independently published supplementary pages. Proposition, rollout, all result tables and hyperparameter/runtime tables were visually checked.
- **Source map:** main Section 3 defines the formulation, Section 4 task mappings/results; Supplement B specifies baseline variants, C hyperparameters, D timings, E action analysis and F hardware.
- **Validation scope:** full-text/note verification; no training or numerical reproduction was performed.
