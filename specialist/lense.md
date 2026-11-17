---
id: lense
short_title: LeNSE
title: 'LeNSE: Learning To Navigate Subgraph Embeddings for Large-Scale Combinatorial Optimisation'
authors:
- David Ireland
- Giovanni Montana
year: 2022
date: '2022-06-28'
publication:
  date: '2022-06-28'
  source_url: https://proceedings.mlr.press/v162/ireland22a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v162/ireland22a.html
institutions:
- University of Warwick
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Vertex Cover
- Budgeted Maximum Cut
- Influence Maximization
summary: Task-specific contrastive subgraph embeddings and DQN root swaps prune a graph before an existing budgeted
  optimization heuristic.
code_url: https://github.com/davidireland3/LeNSE
---

# LeNSE: Learning To Navigate Subgraph Embeddings for Large-Scale Combinatorial Optimisation

> **TL;DR:** LeNSE learns a heuristic-labeled subgraph embedding and a DQN that swaps root vertices to select a smaller search region, then runs an existing task-specific solver there. Its quality target is relative to that solver's full-graph reference, not a certified global optimum.

## Motivation

Graph heuristics may become slow or memory intensive at large scale. Instead of directly predicting the final solution, LeNSE tries to remove graph regions unlikely to be useful, retaining a smaller region on which an established solver can run. Training uses a smaller edge-sampled graph and transfers to its held-out-edge counterpart (Sections1-3).

## Contributions

- A supervised contrastive subgraph encoder provides a continuous proxy for heuristic solution quality.
- A reinforcement-learning navigation policy modifies a fixed-size root set while embedding its larger neighborhood subgraph.
- Guided exploration uses known training heuristic seed nodes, and the final solver is kept separate from the learned pruning policy.
- Experiments study pruning/quality across three budgeted graph tasks, large-graph runtime, lower solution budgets and embedding-loss ablations.

## Methodology

**Actual tasks.** Every problem selects exactly b vertices. The printed MVC task is **Max Vertex Cover**, maximizing the fraction of edges incident to the selected set, rather than Minimum Vertex Cover. BMC is **Budgeted Max Cut**, maximizing crossing edges subject to one side having b vertices, rather than unconstrained Max Cut. IM maximizes expected Independent-Cascade spread for b seeds on a directed weighted graph (Section4). The common framework does not imply a single shared learned checkpoint across these problems.

**Quality labels and encoding.** Run heuristic H on a small training graph and on sampled subgraphs. Label a subgraph by f(H(S))/f(H(Gtrain)). Four bins use thresholds0.6,0.8 and0.95; the top bin is greater than0.95, with three bins in selected Facebook settings. A three-layer GraphSAGE/TopK-pooling encoder is trained with same-class positives and other-class negatives using InfoNCE. The intended geometry clusters high-quality subgraphs near a goal centroid. These empirically observed clusters do not establish a theorem that InfoNCE guarantees unimodality, ordinal ordering or calibrated probabilities of containing a true optimum (Sections3-4/AppendicesA/C/F).

**State and actions.** A root set X has fixed cardinality M. Its subgraph includes X and their one-hop neighbors, retaining edges incident to at least one root; it is not necessarily the complete induced graph on the expanded vertex set and does not have exactly M vertices. For each root, sample a candidate neighbor outside X and score replacing that root with the candidate. A DQN takes the subgraph embedding and the two vertex embeddings, with128-unit fully connected components. Reward is minus beta times Euclidean distance of the next embedding to the best-class centroid. This proxy is not the actual downstream objective improvement (Section3/Algorithm1).

During epsilon exploration, an alpha-controlled branch favors candidate additions belonging to the known training heuristic solution. This uses training labels only; held-out inference does not know optimal seeds. Adam learning rates are0.001, batches128, pooling ratio0.8, temperature0.1, discount0.995, replay capacity25,000 and target Polyak coefficient0.0025. Root counts, feature/embedding widths, reward scales and episode lengths vary by task and graph; encoder/policy training is separate for those configurations (AppendixC/Table3).

**Final decoding.** Apply an existing solver to the selected region. The paper describes greedy/probabilistic-greedy coverage, the BMC heuristic/MIP setting and IMM for influence. GCOMB-P denotes only the ranking-based pruning component adapted from GCOMB, not the complete neural GCOMB solver. The observed ratio uses the corresponding heuristic's full test-graph result as denominator; a value above one can occur because the reference is suboptimal (Section4/AppendixE).

## Experiments

**Graphs and splits.** Eight SNAP graphs are Facebook, Wiki, Deezer, Slashdot, Twitter, DBLP, YouTube and Skitter; Talk is used separately for IM scalability. Training samples1-30% of edges, with the other edges forming the test graph. Vertices can overlap across these edge partitions, so this is not an unrelated graph-family holdout. Skitter's test graph has1,694,024 vertices/10,980,128 edges; Talk has2,329,147 vertices/4,839,567 edges. The encoder uses solution budget100, with most root sets300-1,250 and dataset-specific horizons (AppendicesB-C).

**Quality and pruning.** Table1 averages ten random initializations and gives standard errors for LeNSE ratios. MVC ratios span0.968-1.094, BMC0.960-0.993, and IM0.960-0.983. These exceed the chosen0.95 threshold, not a proven95% approximation to the true global optimum. On DBLP-MVC, LeNSE prunes90% of vertices/96% of edges at ratio0.990; on DBLP-BMC92%/97% at0.993. Smaller Facebook-MVC retains most vertices, pruning only7% while removing73% of edges (Table1).

Quality is not uniformly best: Facebook-MVC GNN-R reaches0.998 versus LeNSE0.968; GCOMB-P gives0.999 versus0.990 on DBLP-MVC with far less pruning. Wiki-IM GNN-T gives0.973 versus LeNSE0.960 while pruning more vertices/edges. These tradeoffs distinguish quality from compression and speed. GNN-R's retained vertex count is set using LeNSE's returned count, so it is a matched-size comparison with information supplied by LeNSE (Section4/Table1).

**Runtime.** On Talk-IM, Figure3 reports over140x speedup at full scale for navigation plus the final heuristic relative to the full-graph heuristic, while maintaining a ratio above0.95. Navigation time is relatively stable over the shown edge fractions, but this does not prove constant total complexity as arbitrary graph size/degree grows. The displayed timing separates navigation and heuristic execution. Offline heuristic labeling, embedding/DQN training, whole-graph feature preprocessing and model selection are not comprehensively charged to that speedup; the paper does not specify a full hardware/repeated-training-time account (Section4/Figure3).

**Lower budgets and loss ablations.** Reuse of a region selected for b=100 usually works for lower tested budgets, but b=1 ratios fall to0.86 for Facebook-IM and DBLP-IM,0.77 for Skitter-IM and0.85 for Skitter-MVC. Therefore the suggested strategy of training at the largest budget is not a general guarantee for every lower budget. InfoNCE is better than the particular ordinal/cross-entropy implementations in six reported settings; the2D plots use additional autoencoder projections, and Twitter-BMC's class3/4 distances violate strict monotonic ordering even in the paper's discussion (AppendicesD/F/Tables4-5).

## Limitations

### Discussed in the Paper

Only neighbor-swap root modifications and neighborhood expansion are studied. Other task classes/operations are future work. Some low-budget results degrade, and the final quality depends on the heuristic and learned embedding geometry (Conclusion/AppendicesD/F).

### Curator Notes

An embedding-based reward provides neither optimality nor safe-pruning guarantees. The exact root cardinality differs from the variable expanded-subgraph size. Training on held-out-edge partitions of the same original network, and per-task/per-graph models, should not be described as one generalist checkpoint across unrelated tasks. Original-graph eigenvector-centrality/degree features still require graph-wide preprocessing even though repeated neural passes process smaller regions.

**Current-code discrepancy:** MVC/functions.py's greedy_mvc marks a selected vertex and its neighbors covered, and cover() counts selected/neighbor vertices rather than counting incident edges as in the printed MVC definition. The latter can even count adjacent selected vertices more than once. This prevents treating the inspected release as a verified implementation of the stated edge-coverage objective; it does not establish which historical code produced the paper's tables. The released environment confirms fixed action-limit termination rather than a quality certificate, and inference leaves epsilon=0.01 in dqn_test.py. No benchmarks were rerun.

## Reproducibility

- **Publication:** [ICML2022/PMLR162](https://proceedings.mlr.press/v162/ireland22a.html), pages9622-9638. Official HTML citation_publication_date and source issued metadata give June28,2022. Ireland and Montana have Warwick affiliations, with Montana also in Statistics.
- **Scientific coverage:** all seventeen [publisher PDF](https://proceedings.mlr.press/v162/ireland22a/ireland22a.pdf) pages, all bibliography, AppendicesA-F and every table/plot. Publisher HTML and source list extras:[]; no extra scientific supplement was identified in the inventoried official author archive.
- **Implementation:** [official LeNSE](https://github.com/davidireland3/LeNSE). README, task-separated archive inventory, MVC network/environment/pruning/heuristic/test code were inspected. Data generation and independent per-task/graph training are required; current MVC scoring differs from the printed objective as noted above.
- **Relations:** ten exact current-catalogue body/bibliography citations: Pointer Networks, Bello's NCO, Learning CO over Graphs, GCNN branching, Attention Model, Graph Pointer Network/HRL, GLSearch, GCOMB, PPO-BiHyb and Joshi/Laurent/Bresson's GCN(arXiv1906.01227). Generic GNN/contrastive-learning references and absent related papers were not converted into inferred relations.
