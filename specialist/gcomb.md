---
id: gcomb
short_title: GCOMB
title: 'GCOMB: Learning Budget-constrained Combinatorial Algorithms over Billion-sized Graphs'
authors:
- Sahil Manchanda
- Akash Mittal
- Anuj Dhawan
- Sourav Medya
- Sayan Ranu
- Ambuj Singh
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/e7532dbeff7ef901f2e70daacb3f452d-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/e7532dbeff7ef901f2e70daacb3f452d-Abstract.html
institutions:
- Indian Institute of Technology Delhi
- Northwestern University
- University of California, Santa Barbara
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Coverage
- Budget-Constrained Maximum Vertex Cover
- Influence Maximization
summary: Objective-trained pruning, node scoring and a Q-policy build budgeted graph sets at billion-edge scale.
code_url: https://github.com/idea-iitd/GCOMB
---

# GCOMB: Learning Budget-constrained Combinatorial Algorithms over Billion-sized Graphs

> **TL;DR:** Objective-trained node scoring and budget-dependent pruning restrict a lightweight Q-policy to promising candidates, enabling set construction on graphs with billions of edges. These are heuristic solutions with benchmark-specific quality and timing evidence.

## Motivation

Graph neural optimization pipelines can spend most computation on nodes that never enter a small budgeted solution. GCOMB targets repeated budget-constrained set-selection problems on similar graphs, separating candidate pruning and individual node quality from the combinatorial interaction among selected nodes (Sections1–3).

## Contributions

- Probabilistic greedy trajectories provide supervised marginal-contribution labels rather than marking every unselected node equally negative.
- A lightweight degree/weighted-degree rank predictor prunes candidates as a function of normalized budget; a GCN scores the retained candidates and a separate n-step Q-network constructs the set.
- Experiments cover maximum coverage, budget-constrained maximum vertex cover and independent-cascade influence maximization, including Twitter/Friendster with1.5/1.8billion edges. The largest graph has65.6million nodes, not billions of nodes (Table1a).

## Methodology

**Objectives and scope.** Maximum coverage selectsb left-side vertices to maximize the fraction of covered right-side vertices. Budgeted maximum vertex cover selectsb vertices to maximize the fraction of covered edges; it is not minimum vertex cover. Influence maximization choosesb seeds maximizing expected activated-node fraction under independent cascade. Training consumes the objective function for the problem in hand. A common architecture and budget transfer are shown, rather than one checkpoint transferred across different objectives, so specialist scope is retained (Sections2–3; supplementA,M).

**Labels and pruning.** Thirty probabilistic-greedy runs sample each next node in proportion to marginal gain until gain falls below0.01. Each node's label is its accumulated contribution divided by total trajectory objective. Pruning uses outgoing-weight sums (degree for unweighted graphs), retaining nodes above a rank threshold fitted from the worst selected rank over training trajectories. Budgets and ranks are normalized by graph size, with linear interpolation across budgets. This learned filter is empirical, not a proof that removed nodes cannot be optimal (p.4).

**Networks.** A two-layer mean-pooling GraphSAGE-style GCN, embedding dimension60, regresses score labels on good candidates, while computing their required two-hop context and extra neighbor scores for sampling. The Q-network uses two features per node: predicted score and uncovered-neighborhood locality. Max-pool summaries of remaining candidates and the selected set, plus the candidate vector, feed small learned linear maps and a final Q-score. The immediate reward is objective marginal gain; training uses2-step fitted Q-learning, replay capacity50, batch8 and gamma0.8. GCN Adam rate is0.001 for1000epochs with dropout0.1; Q rate is0.0005 (paperpp.4–5; supplementB–C,H).

**Inference and theorem scope.** Prune, perform one GCN forward pass over required context, then makeb sequential Q-policy selections. Importance sampling reduces locality computation; sampling percentage is chosen on validation data. Theorem1 concerns a mean-importance estimation bound with logarithmic neighborhood-size dependence and inverse-square error dependence. It does not bound final coverage, seed spread, pruning error or optimization regret. SupplementF assumes bounded i.i.d. quantities and an asserted unbiased estimator; its proof limitations are recorded below.

The appendix's exact noise-filter implementation costsO(|V|logl) using a top-l heap, which is approximated asO(|V|) in the summary expression by treatingl as small. Full graph storage still costsO(|V|+|E|); candidate pruning does not remove the need to load the graph (supplementD).

## Experiments

**Setup and splits.** Five repeats average each reported metric on a XeonE5-2698v4,1080Ti and256GBRAM. The paper reports12-hour training budgets and validation-selected checkpoints for learned comparisons, while supplementG separately shows phase costs including label generation. Synthetic MCP trains/validates on fiveBP-1k graphs each; real MCP neural training uses a50/50 edge split of Brightkite. Importantly, supplementH fits MCP noise-predictor interpolators on10% edge subgraphs from Gowalla/Twitter-ego/YouTube and tests on their remaining90%; target-network-derived pruning calibration is part of that protocol (pp.6–7; supplementG–H).

Influence models use constant0.1 weights, random tri-valency weights{0.1,0.01,0.001}, or StackOverflow action-log-derived probabilities. CO/TV neural training and validation use30% of YouTube edges split equally; Stack learned-weight training uses earliest30% edges. Their own-network tests use remaining70%, while other networks are fully held out for these models (p.8).

**Quality references.** Small MCP cases compare to CPLEX optima: GCOMB sometimes matches greedy/optimum but sometimes falls below, e.g.BP-500,b=4 gives0.495 versus greedy0.505 and optimum0.51. Large-graph MCP compares coverage to greedy/CELF rather than certified optima. The paper's inference that greedy remains near-optimal on larger datasets is an extrapolation from small instances, not an established large-instance gap (Tables1–2).

**Timing and scale.** Selected MCP experiments show up to roughly100X speedup over the authors' GCN-tree-search adaptation and about10X over greedy. CELF speedup on YouTube decreases from4X atb20 to2.01X atb200. Selected IM YouTube/Stack cases show30–160X versus IMM, with spread evaluated by10000MonteCarlo simulations and small signed differences, rather than exact expected-spread equality. IMM uses epsilon0.5 and OPIM0.05; their accuracy/cost settings matter. IMM fails from memory exhaustion on Orkut/Twitter/Friendster in this setup; GCOMB finishes within minutes at small budgets and within about100minutes atb100/200. This is measured feasibility and relative timing, not quality certification where the comparator cannot finish (pp.7–9).

**Additional evidence.** SupplementM reports budgeted MVC on BA-10k–100k and three real networks, often tying greedy and GCN-tree-search in coverage. Q-learning adds up to10% relative MCP coverage over top-score selection; pruning greatly reduces runtime on the plotted cases. Sampling-rate and embedding-size ablations show selected local robustness, without an error guarantee for unseen distributions (Figure3; supplementK–N).

## Limitations

### Discussed in the Paper

The framework is limited to graph set-combinatorial problems; sequential and capacity-constrained optimization are future work (Section5). Influence spread and objective-driven training can themselves be expensive, and the full graph remains in memory (supplementA,D,G).

### Curator Notes

“Problem-agnostic” describes a reusable training architecture with an objective supplied for each problem, rather than demonstrated shared weights across objectives. Billion scale counts edges. Runtime claims depend on the implemented baselines, hardware, budgets, accuracy settings and excluded offline training costs; they are not universal speedups or optimality gaps.

SupplementF Lemma1 replaces the expectation of a self-normalized weighted ratio by a ratio of expectations without justifying that step. That equality does not hold in general for a random denominator. The subsequent concentration argument therefore should not be treated here as an independently validated guarantee for the stated estimator; even an appropriate corrected estimator bound would not certify the final combinatorial solution. The note retains the authors' theorem as a claimed sampling statement with this explicit mathematical limitation.

## Reproducibility

- Fully reviewed12-page [NeurIPS2020 publisher paper](https://proceedings.neurips.cc/paper_files/paper/2020/file/e7532dbeff7ef901f2e70daacb3f452d-Paper.pdf), all9pages of the [official supplement](https://proceedings.neurips.cc/paper_files/paper/2020/file/e7532dbeff7ef901f2e70daacb3f452d-Supplemental.pdf) (AppendicesA–N), and key tables/proofs visually. Both are linked on the [proceedings record](https://proceedings.neurips.cc/paper_files/paper/2020/hash/e7532dbeff7ef901f2e70daacb3f452d-Abstract.html).
- The author-linked [idea-iitd/GCOMB repository](https://github.com/idea-iitd/GCOMB) contains IM/MaxCover code and component READMEs with mixed Python2.7/3 dependencies. No training, billion-edge loading, timing or diffusion simulation was rerun in this audit.
