---
id: erdos-goes-neural
short_title: Erdos Goes Neural
title: 'Erdos Goes Neural: an Unsupervised Learning Framework for Combinatorial Optimization on Graphs'
authors:
- Nikolaos Karalias
- Andreas Loukas
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/49f85a9ed090b20c8bed85a5923c669f-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/49f85a9ed090b20c8bed85a5923c669f-Abstract.html
institutions:
- EPFL
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Clique
- Constrained Minimum Cut
- Local Graph Clustering
summary: Task-specific Bernoulli set predictors learn expected-cost/feasibility losses, followed by sequential decoding;
  guarantees depend on achieved loss and penalty or volume assumptions.
code_url: https://github.com/Stalence/erdos_neu
---

# Erdos Goes Neural: an Unsupervised Learning Framework for Combinatorial Optimization on Graphs

> **TL;DR:** A GNN predicts independent node-membership probabilities, trained through a problem-derived probabilistic loss without solution labels. Sequential decoding converts the distribution into a clique or a local partition. Certificates depend on the achieved loss and stated assumptions; this is not a proof that neural training finds an optimum.

## Motivation

Unsupervised graph optimization must connect soft neural outputs to feasible discrete solutions. A low continuous relaxation value alone can coexist with invalid thresholded solutions. The paper uses the probabilistic method to derive differentiable objectives with a direct interpretation in terms of integral subsets, then uses conditional expectations to decode them.

## Contributions

- A framework for graph subset optimization using independent Bernoulli variables, a nonnegative cost and a probability-of-infeasibility penalty.
- A separate treatment of nonnegative linear box constraints, using probability rescaling and a Hoeffding/union-bound argument.
- Instantiations for maximum clique and volume-constrained minimum cut, with conductance used to evaluate the latter as local graph clustering.

## Methodology

For node probabilities `p_i`, the network defines a product distribution over subsets. The penalized loss is the expected nonnegative cost plus `beta` times the probability of an infeasible subset, or a differentiable upper bound on that probability. The theoretical construction requires a sufficiently large penalty; when the achieved expected penalized cost is below the penalty, sequential conditional-expectation decisions can retain a feasible subset with cost bounded by that achieved loss. This is a certificate relative to a trained distribution, not a distribution-independent approximation ratio or a convergence guarantee for Adam.

Maximum clique minimizes a translated cost `gamma - w(S)`, where `w(S)` is induced edge weight and `gamma` bounds it from above. On an unweighted graph, maximizing induced edge count over cliques agrees with maximizing clique size. A nonedge penalty discourages invalid subsets. Decoding processes high-probability nodes sequentially; a faster clique-preserving sweep is also discussed. A seed node provides an input marker but need not belong to the returned clique.

For constrained minimum cut, probabilities are rescaled so the expected degree-weighted volume is the midpoint of a prescribed interval. Expected cut becomes a differentiable expression in the probabilities. The box-feasibility probability bound is informative only when its lower bound is positive. Sampling can jointly satisfy the cost/volume event under the theorem's conditions; the practical sequential procedure controls volume by stopping, and should not be described as an unconditional joint certificate. For local clustering the seed must belong to the returned set, and cut divided by volume is evaluated rather than directly optimized.

The supplement refines the main architecture description: local partitioning uses six GIN layers followed by a multihead GAT layer; maximum clique omits GAT because of its time/memory cost. Skip connections, normalization, local receptive-field masks and an output perceptron produce node probabilities. Networks and losses are task specific. A reusable framework across two problems does not establish one shared generalist checkpoint, so this entry is specialist and constructive.

## Experiments

Clique experiments use IMDB, COLLAB and TWITTER graphs plus hard RB instances. Non-RB data use a 60/20/20 train/validation/test split. RB training graphs have 50-500 nodes, the separately generated test set 50-475, and the larger set averages about 1,013 nodes. The RB test generator is only approximately matched to training and contains different clique-size ranges; the performance drop therefore mixes distribution and size effects.

Table 1 reports solution-to-reference clique ratios and seconds per graph. On TWITTER, the fast/accurate variants reach 0.924/0.942 in 0.17/0.42 seconds per graph. Accurate RUN-CSP reaches 0.987 in 0.39 seconds, while Gurobi with sufficient budget reaches 1.000. On large RB instances, the accurate variant reaches 0.735 in 6.68 seconds, versus RUN-CSP 0.804 in 5.46 seconds and the Toenshoff greedy baseline 0.829 in 0.35 seconds. These counterexamples rule out a general claim of superior solution quality. The authors explicitly present a comparative study rather than an exhaustive state-of-the-art evaluation.

The supplement's feasibility table reports no clique violations for this method on the tested datasets, whereas flat-threshold relaxation baselines violate constraints frequently on TWITTER. A controlled decoding ablation on TWITTER gives ratio 0.821 from one learned distribution versus 0.513 from one random probability assignment, rising to 0.905 versus 0.760 with five samples. This supports a contribution from learning in that experiment, beyond the decoder alone.

For local partitioning, Table 3 reports conductance 0.124, 0.156 and 0.292 on SF-295, FACEBOOK and TWITTER. FACEBOOK uses graphs with at most 15,000 nodes, not the entire original collection. The supplement specifies 10, 100 and 30 random seeds per graph for SF-295, FACEBOOK and TWITTER respectively, and averages conductance over the seed protocol; it explicitly corrects an older best-of-seeds description. The network improves conductance over the compared neural/graph-clustering baselines, but Gurobi is better on small SF-295 (0.105). FACEBOOK runtime is 289.28 seconds per graph, so the method is not uniformly cheap.

Reported runtimes include necessary clique-to-independent-set reduction costs and, for the cut solver, problem-construction overhead. A Gurobi label such as 10 seconds is an optimization limit per seed, not its full measured per-graph time. Experiments use an Intel Xeon Silver 4114 CPU and a single RTX TITAN GPU for neural computation; repeated seeds/distributions and fast/accurate budgets are part of inference cost.

## Limitations

### Reported by the Authors

- Sequential decoding can be a bottleneck; richer constraints involving paths or trees remain future work.
- Clique quality degrades on larger RB graphs and some simpler or conventional methods are stronger.
- The construction needs a tractable differentiable expectation or upper bound and a problem-specific loss/decoder.

### Curator Notes

- Theorems certify properties conditional on a suitable distribution and loss assumptions; they do not make neural training globally optimal. For the penalty sampling argument, the threshold used to exclude infeasible samples must remain below `beta`: choosing cost threshold `loss/(1-t)` therefore needs that threshold below the penalty. The printed Theorem 1 does not spell out this restriction for arbitrary `t`.
- The box bound can be vacuous for narrow volume intervals. A deterministic decoder controlling one quantity is not automatically a joint cost-and-volume guarantee.
- Sample counts, graph restrictions and seed aggregation materially affect reported results. Heuristic quality ratios and observed feasibility are distinct from worst-case approximation or optimization guarantees.
- The publisher ZIP supplement retains draft line and reference numbering. Main-paper reference labels are used for internal citation records to avoid mixing the two lists.

## Reproducibility

- **Official publication:** [NeurIPS 2020](https://proceedings.neurips.cc/paper_files/paper/2020/hash/49f85a9ed090b20c8bed85a5923c669f-Abstract.html); title, authors and EPFL affiliation checked on PDF page 1.
- **Implementation:** [Stalence/erdos_neu](https://github.com/Stalence/erdos_neu), linked by the paper. The official ZIP also contains four training/evaluation notebooks and Python modules; notebook explanatory Markdown was inspected.
- **Reviewed sources:** all 14 main-paper pages and all 11 pages of `CO_supplementary_material.pdf` inside the publisher's supplementary ZIP, including all proofs, references and corrections. Key equations and all main numerical tables were visually checked.
- **Source map:** main Sections 3-4 define certificates and tasks; Tables 1-3 contain results; Supplement B specifies architectures/protocol/hardware, C gives controls and solver setup costs, and D contains proofs.
- **Validation scope:** literature, metadata and note verification; training and solver experiments were not rerun.
