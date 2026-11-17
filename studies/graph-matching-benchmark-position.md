---
id: graph-matching-benchmark-position
short_title: Matching Benchmark Position
title: 'Position: Graph Matching Systems Deserve Better Benchmarks'
authors:
- Indradyumna Roy
- Saswat Meher
- Eeshaan Jain
- Soumen Chakrabarti
- Abir De
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/roy25a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/roy25a.html
institutions:
- Indian Institute of Technology Bombay
- EPFL
scope: study
paper_type: analysis
problem_families:
- Graph Matching
problems:
- Graph Edit Distance
summary: A GED benchmark critique separates isomorphic-pair recall from generalization and tests transfer across
  a restricted family of edit costs.
---

# Position: Graph Matching Systems Deserve Better Benchmarks

> **TL;DR:** A GED benchmark critique measures isomorphic train/test overlap, proposes graph-disjoint splits, and tests cost transfer. Its alignment-invariance theorem assumes zero node-substitution cost; this restriction matters when reusing labels.

## Motivation

Exact graph edit distance (GED) labels are expensive, encouraging repeated use of small datasets and approximate supervision. Node-order-invariant neural models can encounter effectively repeated graph pairs even when dataset identifiers differ. The paper argues that benchmark evaluations must distinguish structural recall from performance on unseen graphs and should test more than one uniform edit-cost setting (PDF pp. 1–3, 9).

## Contributions

The position paper audits structural duplication in LINUX, IMDB and labelled/unlabelled AIDS, evaluates eleven GED prediction models before and after filtering, and proposes an isomorphism-free splitting/pair-generation pipeline. It also formulates edit paths through node alignments and derives a restricted cost-invariance result that permits relabelling a solved pair under multiple compatible cost vectors (pp. 2–8).

The contribution is benchmark diagnosis and evaluation methodology, rather than a new neural matching solver. The cost-shift experiments assess scalar GED prediction and ranking; these metrics provide useful diagnostics but do not directly certify that a model recovers a particular optimal permutation or every valid edit path (pp. 7–9, 14–20).

## Methodology

Graphs are padded with dummy-node indicators; an alignment induces edge deletions, node edits and edge insertions, in that order. Costs distinguish node insertion/deletion/substitution and edge insertion/deletion. Proposition 4.1 states that substitution cheaper than deletion plus insertion rules out an optimal path containing both node addition and deletion. **Theorem 4.2 additionally fixes node-substitution cost to zero**, with the other four costs strictly positive, when asserting invariance of the optimal alignment set across cost vectors (pp. 2, 4–5).

The dataset pipeline removes isomorphic graph duplicates before a 60:20:20 graph-level split. It then constructs within-split pairs, including self-pairs, and a separate retrieval-style test of unseen graphs against the training corpus. MIP-F2 supplies reference costs/alignments; under the compatible zero-substitution-cost family, operation counts can be reweighted without resolving the combinatorial problem (pp. 6–8).

Cost-transfer evaluation uses Mutag, Code2, Molhiv and Molpcba, with seven cost vectors C0–C6. Every published vector has zero node-substitution cost. Main experiments train at C0; the appendix also trains at unequal-cost C1 and encodes the four remaining costs in node features for adapted baselines. Different cost magnitudes change the scale of MSE, so MSE comparisons across cost settings are not normalized comparisons of robustness (pp. 8–9, 14–20).

## Experiments

Table 1 reports 1,000 LINUX graph records but only 89 unique structures, with 91.3% intra-test-pair leakage and 94.8% retrieval-pair leakage in the examined split. Label-aware AIDS has much less reported overlap: 0.24% and 2.92%, respectively. These rates describe these datasets, label conventions and pair-generation protocols, not every graph-matching benchmark (p. 6).

On LINUX intra-test pairs, ISONET's MSE changes from 0.323 with overlap to 5.146 after filtering, and Kendall tau from 0.903 to 0.646. Many methods show similar deterioration, but the printed tables contain exceptions: GEDGNN's MSE improves in several cases, and GraphSim's labelled-AIDS MSE improves. Filtering also changes the available unique graphs and training/test populations, so these results do not isolate duplication as the sole causal factor (pp. 6–7, 13).

The cost-shift tables show sensitivity of GED predictions/rankings to unseen costs and selected advantages for the explicitly edge-aware GRAPHEDX model. For example, Code2 C0-trained intra-test GRAPHEDX has MSE 0.76 at C0 and 688.71 at C4, versus GMN-Match's 1.68 and 28,743.35. These are within-setting comparisons; a larger MSE at C4 alone is not a scale-adjusted failure measure. GRAPHEDX is not uniformly best in every dataset, cost and metric, and C1-only training does not establish generalization to arbitrary costs (pp. 8–9, 15–20).

## Limitations

### Curator Notes

The paper's alternative-view discussion acknowledges that repeated structures can occur naturally in deployment. The critique targets conflating recall with unseen-structure generalization; it does not make every use of repeated graphs invalid. Deduplication removes exact isomorphisms under the chosen label convention, not every near-duplicate, distribution shift or source of leakage (p. 9).

**Theorem scope.** The proof's final wording and Appendix A.2.1 broaden the zero-substitution statement to the inequality `cNS < cNA + cND`. That broader claim should not be used as a label-generation guarantee. A curator counterexample uses two three-node paths 1–2–3 with labels `(A,B,C)` and `(A,C,B)`. Set substitution cost 1 and node insertion/deletion costs 2 each. With both edge costs 0.1, swapping nodes 2 and 3 preserves labels and costs 0.2; the identity costs 2. With both edge costs 2, the identity costs 2 and that swap costs 4; other non-automorphisms require an edge deletion and insertion, and path reversal costs three substitutions. Thus the optimum changes even though `1 < 2 + 2` throughout. This analysis concerns the broadened positive-substitution wording, while all seven experimental cost vectors satisfy the formal theorem's zero-substitution condition (pp. 5, 14).

**Printed counts.** Table 1's IMDB intra-test counts give `26,463 / 45,150 ≈ 58.61%`, rather than the printed 34.1%; unlabelled AIDS gives `4,268 / 9,870 ≈ 43.24%`, rather than 21.1%. These are arithmetic cross-checks of the displayed counts, not independently reconstructed dataset leakage rates. Exact percentages require the released splits and detection code (p. 6).

The article does not supply a complete standalone training/hardware/repeated-seed protocol for all reproduced models, and scalar error/ranking measurements should be kept distinct from explicit edit-path correctness (pp. 3, 7–9, 13–20).

## Reproducibility

- Publication record: [ICML 2025](https://proceedings.mlr.press/v267/roy25a.html).
- Source text: [paper](https://raw.githubusercontent.com/mlresearch/v267/main/assets/roy25a/roy25a.pdf).
- Author-linked implementation/data: [anonymous repository](https://anonymous.4open.science/r/better-graph-matching-7146/), explicitly linked by the paper and publisher; it returned HTTP 410 `repository_expired` during this audit, so its code/data could not be inspected.

The [publisher metadata](https://proceedings.mlr.press/v267/roy25a.html) explicitly records `citation_publication_date` as **2025-10-06**, independently of any paper-specific acceptance date. July13–19 describes the ICML2025 meeting, rather than its publication-record date. This audit read the complete 20-page proceedings article, all references and Appendix A, including every result table, and visually checked eight key pages. The publisher lists PDF, OpenReview and software, with no separate scientific supplement. Both OpenReview API versions returned 403; the expired software repository could not be inventoried. No separately referenced missing scientific attachment was identified. A six-permutation calculation checks the curator example above; the empirical benchmark itself was not rerun.
