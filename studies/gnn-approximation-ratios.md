---
id: gnn-approximation-ratios
short_title: GNN Approximation Ratios
title: Approximation Ratios of Graph Neural Networks for Combinatorial Problems
authors:
- Ryoma Sato
- Makoto Yamada
- Hisashi Kashima
year: 2019
date: '2019'
publication:
  date: '2019'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/635440afdfc39fe37995fed127d7df4f-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/635440afdfc39fe37995fed127d7df4f-Abstract.html
institutions:
- Kyoto University
- RIKEN
- JST
scope: study
paper_type: theory
problem_families:
- Graph Optimization
problems:
- Minimum Dominating Set
- Minimum Vertex Cover
- Maximum Matching
summary: Distributed-local-algorithm theory characterizes GNN approximation power and feature limitations.
---

# Approximation Ratios of Graph Neural Networks for Combinatorial Problems

> **TL;DR:** Fixed-depth, deterministic local GNNs inherit approximation limits from distributed computing. Consistent port numbering and supplied coloring features change their representational power. These are worst-case existence/impossibility results under a specified model, not guarantees that gradient training discovers the corresponding algorithms.

## Motivation

Empirical success on sampled graphs does not identify what a local GNN can guarantee on every graph. The paper connects message-passing architectures to constant-round distributed algorithms so that known local-computation constructions and indistinguishability lower bounds can characterize combinatorial approximation power.

## Contributions

- Establishes an equivalence between three GNN classes and corresponding distributed-local computation models when possible node features form a finite set.
- Introduces vector-vector consistent GNNs and CPNGNN, using ordered, consistent edge-port information rather than only a multiset or set of broadcast messages.
- Transfers tight dominating-set, vertex-cover and matching approximation results, showing how weak/proper coloring changes attainable guarantees.

## Methodology

The setting fixes an arbitrary maximum degree `Delta`, finite node features and a fixed number of message-passing rounds independent of graph size. Node degree alone is the default feature. There are no unique node identifiers or random symmetry-breaking inputs in the expressivity model. Parameters may depend on the degree bound and target problem; a representable algorithm must work for all graphs within that degree class, and a port-based algorithm must succeed for every consistent port assignment.

Set-broadcasting and multiset-broadcasting GNNs send the same embedding to all neighbors. Port-based VVC-GNNs can use ordered neighbor slots and the sending port number, adding structural information that distinguishes otherwise symmetric leaves. CPNGNN concatenates these inputs, applies linear/ReLU layers and a final MLP. Its claim to be most powerful is confined to this VVC class with finite features.

The supplement proves the local-model correspondence by explicitly encoding each node's transmitted messages and internal state. It proves CPNGNN's representational completeness by reconstructing bounded-radius views in finite encodings and approximating the final finite-label function with an MLP. Approximation bounds then follow from cited distributed-local results, not a newly trained optimizer or an optimization-landscape theorem.

| Problem and supplied features | Guarantee in the studied CPNGNN model |
| --- | --- |
| Minimum dominating set, degrees only | Tight ratio `Delta+1` |
| Minimum dominating set, degrees plus weak 2-coloring | Tight ratio `(Delta+1)/2`; proper 2-coloring cannot improve this worst-case bound |
| Minimum vertex cover, degrees only | Tight ratio 2 |
| Maximum matching, degrees only | No finite worst-case approximation factor under the specified endpoint-consistent edge-output rule |
| Maximum matching, degrees plus weak 2-coloring | Tight ratio `(Delta+1)/2` |
| Maximum matching, degrees plus proper 2-coloring | Any fixed factor `alpha>1` is representable on the resulting bipartite class |

A weak 2-coloring gives each non-isolated vertex at least one differently colored neighbor; a proper 2-coloring makes every adjacent pair different and therefore restricts graphs to bipartite ones. These features are provided by preprocessing, which is part of the computational setup. The final matching result does not assert exact factor-one matching. The no-factor result concerns anonymous local symmetry and does not imply that maximum matching is computationally intractable in general.

## Experiments

The main evidence is Theorems 1-10 with complete supporting proofs and transferred local bounds in Supplement A. An empirical illustration does appear in Supplement C: the single-leaf task uses the same four-node star for training and testing, with one center and three leaves. A two-layer CPNGNN is trained with REINFORCE and reward +1 for selecting exactly one leaf, -1 otherwise. Across ten seeds it succeeds after 10,000 iterations; the tested GCN, GraphSAGE and GAT models do not solve the symmetry-breaking task.

This toy result illustrates the representational separation. It is not an empirical validation of all approximation ratios, a test on held-out graph distributions or evidence of one checkpoint solving dominating set, cover and matching jointly. No large combinatorial benchmark or numerical solver-speed comparison is reported.

## Limitations

### Discussed in the Paper

- Bounds are derived under bounded-degree and specified-feature assumptions. Extending the constructive representation results to unbounded-degree graphs is difficult.
- Some optimal ratios are no stronger than trivial or classical approximation algorithms. Extra features or hybrid search may be necessary for stronger guarantees.

### Curator Notes

- The results do not constrain arbitrary global-attention, graph-size-dependent-depth, uniquely identified, randomized or search-augmented architectures.
- Representability is not a learnability, sample-complexity or optimization-convergence guarantee. Preprocessing can supply information unavailable to the original local feature model.
- The displayed BFS pseudocode starts at one vertex; disconnected graphs require processing all components, and isolated vertices require separate handling for weak-coloring statements.
- The introduction incorrectly groups maximum matching with NP-hard problems. Ordinary maximum matching is polynomial-time solvable; this note treats its lower bound as a local-model restriction instead of repeating that complexity claim.

## Reproducibility

- **Publication:** [Official NeurIPS 2019 record](https://proceedings.neurips.cc/paper_files/paper/2019/hash/635440afdfc39fe37995fed127d7df4f-Abstract.html), with the year supported by the proceedings.
- **Reviewed sources:** All ten [main PDF](https://proceedings.neurips.cc/paper_files/paper/2019/file/635440afdfc39fe37995fed127d7df4f-Paper.pdf) pages and all five pages of `approximation_1910241941_supp.pdf` inside the [publisher supplement ZIP](https://proceedings.neurips.cc/paper_files/paper/2019/file/635440afdfc39fe37995fed127d7df4f-Supplemental.zip). The entire ZIP contains this scientific PDF only.
- **Reading map:** Main Sections 3-5 specify assumptions/classes and equivalence; Section 6 states approximation ratios; Supplement A proves simulations and completeness, B gives preprocessing algorithms, and C reports the star experiment. Theorems, formulas, full simulation proof and pseudocode were visually checked.
- **Implementation:** No external implementation URL is supplied in the reviewed paper/supplement or the inspected publisher attachment. The supplement gives architecture, reward, trial count and iteration count, but this audit did not reproduce the experiment.
