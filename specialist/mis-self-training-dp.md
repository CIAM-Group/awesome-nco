---
id: mis-self-training-dp
short_title: MIS-DP Self-Training
title: 'Maximum Independent Set: Self-Training through Dynamic Programming'
authors:
- Lorenzo Brusca
- Lars C.P.M. Quaedvlieg
- Stratis Skoulakis
- Grigorios Chrysos
- Volkan Cevher
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/7fe3170d88a8310ca86df2843f54236c-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/7fe3170d88a8310ca86df2843f54236c-Abstract-Conference.html
institutions:
- EPFL
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Minimum Vertex Cover
summary: A graph comparator follows one MIS recurrence branch and self-trains from best-of-rollout labels; MVC uses
  a separate trained comparator.
code_url: https://github.com/LIONS-EPFL/dynamic-MIS
---

# Maximum Independent Set: Self-Training through Dynamic Programming

> **TL;DR:** A neural graph comparator chooses one branch of an MIS recurrence and learns from best-of-rollout pseudo-labels, optionally mixed with greedy solutions. Universal exact consistency implies optimality in theory; finite self-training is an empirical heuristic without that guarantee.

## Motivation

Exact MIS labels are expensive. The paper replaces explicit dynamic-programming lookup values with a comparison model, then uses that model's own feasible rollouts to create more pairwise training labels. The aim is to train useful graph decisions without an externally labeled optimum for every training graph (Sections1-2/5).

## Contributions

- A comparator-induced recurrence always produces an independent set, while accurate branch comparisons recover the MIS optimum.
- A graph embedding module separately combines self, neighbor and anti-neighbor information before graph-level scoring.
- A consistency theorem characterizes an ideal comparator through its induced algorithm's exact expected values.
- Best-of-rollout and mixed-greedy self-annotation train practical comparators; a separately trained gadget-based variant addresses minimum vertex cover.

## Methodology

**MIS recurrence.** Choose a random nonisolated vertex v. Compare G-v with G-N(v), where the latter keeps v as an isolated node. Recurse only into the predicted better graph until no edges remain; the remaining vertices form an independent set. The exact identity alpha(G)=max(alpha(G-v),alpha(G-N(v))) is correct, but following one learned branch can discard the optimal branch. Unlike exact exhaustive DP, practical inference does not explore both subproblems fully (Sections3-4/Algorithm1).

**Model and complexity.** Initially zero node embeddings are transformed using separate linear maps for a node, the sum over neighbors and the sum over anti-neighbors, then concatenation/GELU/layer normalization. Biases are essential and omitted only from the printed formula. Three GEM iterations, width parameter32, mean graph pooling and four dense layers with a skip connection produce one score per graph. Two scores define a softmax comparison. The paper's dense implementation costs O(n^2) per graph embedding and up to O(n^3) per recursive inference for fixed network dimensions; this polynomial heuristic cost does not imply polynomial exact MIS solution (Sections4.2-4.3/AppendixC).

**Conditional consistency theorem.** A comparator must, for every pair of graphs, rank their **exact expected** outputs under its own randomized induced algorithm consistently, including ties. Theorem2 proves by induction on edge count that such a universally consistent comparator yields exact MIS. It does not show such parameters exist in the chosen network, that SGD finds them, or that approximate consistency on finite samples yields a specified approximation ratio. The authors explicitly state these practical guarantees are absent (Section5.1/Remark4/AppendixI/Limitations).

**Actual self-training.** Collect subgraph pairs into a buffer using a frozen current comparator, run m randomized rollouts per graph, and label pairs by the maximum observed feasible independent-set size. The mixed variant takes the maximum of these rollouts and a minimum-degree greedy solution. These best-of-m pseudo-labels differ from the exact expectations in the theorem; they remain lower bounds and can rank graphs incorrectly. Updated models periodically regenerate data. Tie pseudo-labels are balanced probabilities in the release. No formal monotone improvement in true solution quality is established (Section5.2/Algorithm2).

**MVC extension.** A separate comparator minimizes cover size on graphs transformed with degree-one copy-node gadgets encoding inclusion of v or all its neighbors. Base graphs contain only isolated vertices/edges. AppendixB/E explicitly describes self-training in the MVC context, and the release has independent MIS/MVC pipelines. These results do not demonstrate an unchanged MIS checkpoint solving MVC.

## Experiments

**Data and references.** Main MIS tests use RB, COLLAB, TWITTER and an engineered SPECIAL distribution, with average nodes216.67/74.49/131.76/106.89. Train/test graph counts are200/400,600/1,000,777/196 and160/40 respectively. Reference solutions are obtained from Gurobi with a one-hour limit per graph. The text calls them optima, but per-instance optimal-status/bound records are not supplied in the paper, so a finite-budget reference should not automatically be called a certificate. MIS ratios are found/reference, higher better; MVC ratios are found/reference, lower better (Section6/AppendixC/Tables1/4/6).

**Main results and counterexamples.** Mixed MIS ratios are0.836/0.990/0.977/0.994 with per-graph inference0.36/0.21/0.21/0.05s. Normal rollouts are better on SPECIAL,0.996 versus0.994. Greedy is better on RB0.925 and COLLAB0.998, while mixed is better on TWITTER0.977 versus0.964 and SPECIAL0.994 versus0.131. SPECIAL is deliberately constructed to defeat the greedy degree choice, so that large gain should not be generalized to arbitrary graphs (Table1/AppendixC.2).

Traditional solvers remain much stronger in several tests: Gurobi1s gives0.983 on RB and1.0 on the other three datasets; at5s RB is0.999. LwDMIS is slightly faster than mixed on TWITTER,0.19 versus0.21s, despite lower quality0.972 versus0.977. Thus neither universal best solution quality nor universal fastest neural runtime follows. Some RUN-CSP results are omitted because the implementation performed unexpectedly poorly; the omitted values are not evidence of infeasibility or timeout (Section6/Table1).

**Distribution transfer.** The COLLAB-trained comparator obtains RB0.856 and TWITTER0.906. Conversely RB-to-TWITTER degrades to0.668, below Erdos-GNN's0.752 in that transfer. Cross-distribution MIS is still one native task. On additional BA/WS tests mixed gives0.942/0.831 versus greedy0.959/0.937; the mixed ER result0.954 only slightly exceeds greedy0.950. Small IMDB graphs are solved at reference ratio1.0 by nearly all methods (Table2/AppendixD/Table5).

**MVC.** RB200/RB500 comparator ratios are1.031/1.015. Meta-EGN is better on RB200,1.028, while greedy is better on both,1.027/1.014; Gurobi5s gives1.000/1.004. The comparator narrowly leads the listed neural models on RB500, not all baselines. Several neural baseline rows are taken from Wang and Li rather than retrained within a completely matched execution protocol (AppendixE/Table6).

**Training and budgets.** Main comparators use300 epochs, batch32 and Adam0.001. Ablations use200 epochs; larger/deeper models do not monotonically improve quality, with K=5 giving0.960 versus K=4 0.992 on COLLAB. Timed experiments use Windows10/Python3.10, GTX1060 Max-Q6GB and i7-7700HQ/16GB RAM. Per-graph test timing excludes rollout-label generation and all training; exact rollout counts/data-refresh settings remain necessary reproduction parameters. The final consistency plot shows finite sampled agreement rising with fluctuations, not calibrated confidence or the universal premise of Theorem2 (AppendicesC/G/J).

## Limitations

### Discussed in the Paper

The empirical algorithm has no proven convergence or approximate-optimality guarantee. Richer modules and learned vertex selection are proposed future work. Random pivot selection and approximate comparisons can be suboptimal (Limitations/Remark4).

### Curator Notes

Self-generated labels avoid external exact supervision but still incur repeated inference and can reinforce errors. Best observed rollout values and finite agreement rates cannot be substituted for exact expectations over all graphs in the theorem. Dense adjacency/complement processing limits scaling; favorable small/medium graph results do not establish million-node behavior. Optimal-reference certification, baseline omissions and the engineered SPECIAL distribution should remain visible.

The current public and publisher-supplement core implementations agree after line-ending normalization on inspected model/recursion files. Evaluation functions primarily return solution sizes; preserving/reconstructing original vertex identities is additionally needed when a user requires a witness set, particularly for MVC's copy-node gadgets. No training, solver run or dataset regeneration was performed in this audit.

## Reproducibility

- **Publication:** [NeurIPS2023 proceedings](https://proceedings.neurips.cc/paper_files/paper/2023/hash/7fe3170d88a8310ca86df2843f54236c-Abstract-Conference.html), official HTML publication date December15,2023. Five authors have EPFL affiliation; the first three share equal contribution and Chrysos notes work done at EPFL/current Wisconsin affiliation.
- **Scientific coverage:** all twenty-two [final publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2023/file/7fe3170d88a8310ca86df2843f54236c-Paper-Conference.pdf) pages, references and AppendicesA-J. The linked [supplement ZIP](https://proceedings.neurips.cc/paper_files/paper/2023/file/7fe3170d88a8310ca86df2843f54236c-Supplemental-Conference.zip) was downloaded/inventoried; its additional_material/main_paper_appendix.pdf is an earlier anonymous twenty-page complete manuscript, not merely code. All twenty pages and its AppendicesA-I were read as a separate source, with final-paper metadata/results taking precedence.
- **Implementation:** [official dynamic-MIS](https://github.com/LIONS-EPFL/dynamic-MIS). Full author/publisher archive inventories, both READMEs, comparator, recursive rollout, test and MIP reference code inspected; task-specific training/data/checkpoint paths remain required.
- **Relations:** ten exact current-catalogue body/bibliography citations: Learning What to Defer, Erdos Goes Neural, GCNN branching, GCN-guided Tree Search, Pointer Networks, RL-VRP, Principled CO Relaxation, Meta-EGN, Learning to Dispatch and the two-author IEEEAccess GNN-MCTS. The distinct three-author MCTS/DNN preprint is not conflated with that target. Related preprints and other absent works were not conflated with different catalogue entries.
