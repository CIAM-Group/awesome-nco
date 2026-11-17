---
id: hybrid-scattering-clique
short_title: Scattering MaxClique
title: Can Hybrid Geometric Scattering Networks Help Solve the Maximum Clique Problem?
authors:
- Yimeng Min
- Frederik Wenkel
- Michael Perlmutter
- Guy Wolf
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/8ec88961d36d9a87ac24baf45402744f-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/8ec88961d36d9a87ac24baf45402744f-Abstract-Conference.html
institutions:
- Cornell University
- Universite de Montreal
- Mila
- University of California, Los Angeles
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Clique
summary: Hybrid low-pass and scattering filters train with an edge/nonedge loss; multistart greedy decoding returns
  feasible cliques, with heuristic-reference LARGE scores and no inherited probability certificate.
code_url: https://github.com/yimengmin/GeometricScatteringMaximalClique
---

# Can Hybrid Geometric Scattering Networks Help Solve the Maximum Clique Problem?

> **TL;DR:** ScatteringClique combines low-pass graph filters with band-pass diffusion wavelets to predict clique-node scores. An unsupervised connectivity/nonedge loss trains the network, and a multistart greedy decoder returns feasible cliques. The paper reports a favorable quality/time trade-off in several settings, without a maximum-clique guarantee.

## Motivation

Low-pass aggregation can make clique members and neighboring nonmembers look similar. A decoder that relies on their ranking may then accept an incompatible early node. The paper investigates whether multiscale band-pass filters preserve useful distinctions with fewer learned parameters than the compared neural models.

## Contributions

- A hybrid scattering/GCN architecture with learned node-wise attention over low-pass and band-pass filters, and readouts from all layers.
- A two-term unsupervised loss rewarding mass on graph edges while penalizing mass on nonedges, related explicitly to the Erdos Goes Neural loss.
- A feasible multistart clique decoder and comparisons on real graph datasets plus synthetic SMALL/LARGE instances of varying hardness.

## Methodology

Input features are eccentricity, clustering coefficient and logarithmic degree. An embedding MLP maps these to width-eight features. Each aggregation layer mixes GCN-type low-pass powers with diffusion-wavelet differences of lazy-random-walk powers, using attention scores at each node. Intermediate readouts are concatenated, mapped to one value per node and min-max normalized to obtain scores in the unit interval.

The loss subtracts edge-connected probability mass and adds a weighted nonedge penalty. Lemma 1 proves that, for nonnegative probabilities, the nonedge quadratic form is exactly zero if and only if its positive support lies within a clique. This characterizes zero penalty, not the optimality of a finite-loss trained solution. Supplement C explicitly states that the chosen loss **does not satisfy** the probability-quality corollary of Erdos Goes Neural. That predecessor's certificate must not be transferred to this model.

The decoder sorts scores, starts cliques from the first `kappa` candidates, greedily accepts only compatible nodes within a bounded ranked window, and selects the largest returned clique. It enforces feasibility but can miss a larger clique; limited candidate windows need not even produce a globally maximal clique. Validation tuning uses prior information about expected clique sizes. The printed Algorithm 1 and surrounding prose differ in candidate-loop indexing/window bounds, so exact implementation should be checked against the released code rather than inferred from the pseudocode alone. The only evaluated optimization task is maximum clique, making this a specialist constructive solver.

## Experiments

Real datasets are IMDB, COLLAB and TWITTER. SMALL subclasses average about 181-209 nodes, while LARGE subclasses average about 1,324-1,347. The decoder uses one start for IMDB/COLLAB and ten for TWITTER; synthetic easy/medium/hard settings use one/one/ten starts. The paper reports mean/std quality and seconds per graph and states three runs. It does not disclose the compute hardware in the scientific supplement's checklist, limiting independent interpretation of its runtime comparisons.

On real graphs, Table 1 reports solution-size ratios to known maximum cliques: 1.000 on IMDB in 0.004 seconds, 0.999 on COLLAB in 0.029 seconds, and 0.952 on TWITTER in 0.05 seconds. Accurate RUN-CSP is more accurate on TWITTER (0.987 in the table, 0.39 seconds); the prose's 0.34-second comparison is inconsistent with that table. Gurobi with longer budgets also gives higher TWITTER quality. These are quality/time trade-offs, not uniform domination.

**LARGE scores have a different denominator:** they normalize to a clique found by Gurobi under its nominal 0.1-second subroutine limit, not a known optimum. Thus the LARGE-hard score 1.102 means a larger clique than that reference incumbent, not 110.2% of the optimum. ScatteringClique takes 0.46 seconds there, versus Gurobi's measured 9.46 seconds for its nominal 0.1-second configuration. Gurobi at 50 seconds and a longer local-search heuristic obtain higher scores, 1.335 and 1.296, at measured times 60.3 and 22.9 seconds. Nominal limits can be exceeded by the solver's other work.

On SMALL-hard, where optimum clique sizes are known, the reported score is 0.846 in 0.184 seconds. This improves over the low-pass counterpart 0.776, but Gurobi at 0.5 seconds reaches 0.962 and a longer heuristic 0.891. The low-pass ablation shares the loss/decoder and supports the architecture comparison under these settings. Qualitative supplement examples include failures, such as returning nine of an eleven-node maximum clique, despite outperforming the low-pass example.

The reported models have 705, 1,001 and 1,297 parameters on IMDB, COLLAB and TWITTER. The paper compares these with a particular 1,880,709-parameter Erdos implementation. This is a parameter-count comparison for that implementation; it does not measure the cost of computing structural input features, training, decoding or every alternative architecture.

## Limitations

### Explicit in the Scientific Sources

- Supplement C excludes the predecessor's probabilistic quality certificate for this chosen loss.
- Decoder parameters require validation/prior clique-size information, and longer-budget conventional methods can find larger cliques.
- The checklist answers no to reporting limitations and compute resources; those omissions should not be filled with assumed hardware or training budgets.

### Curator Notes

- Feasible greedy output and a zero-penalty characterization are not proofs of maximum-cardinality recovery or training convergence.
- LARGE scores are heuristic-reference ratios, whereas real/SMALL scores use optima; combining them as the same optimality metric would be misleading.
- The scientific PDFs do not fully specify optimizer/split/epoch and end-to-end preprocessing/runtime details. Repository commands supply some implementation settings, without establishing complete experimental reproduction.
- Decoder indexing and one runtime prose/table discrepancy remain source caveats rather than silently chosen facts.

## Reproducibility

- **Formal publication:** [NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/hash/8ec88961d36d9a87ac24baf45402744f-Abstract-Conference.html); authors/affiliations checked on PDF page 1. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2022/hash/8ec88961d36d9a87ac24baf45402744f-Abstract-Conference.html) explicitly records `citation_publication_date` as **2022-12-06**, independently of any paper-specific acceptance date.
- **Official implementation:** [yimengmin/GeometricScatteringMaximalClique](https://github.com/yimengmin/GeometricScatteringMaximalClique), linked in Supplement A, with dataset scripts, sampler, model and filter modules; README commands expose dataset-specific penalties and walkers.
- **Reviewed sources:** all 12 main pages and all four pages of `mc-camera-ready-supp.pdf`, the sole member of the official supplementary ZIP. Loss proof, decoder, all result tables and all supplementary examples were visually checked.
- **Source map:** Sections 3.1-3.5 define architecture/loss/decoder, Section 4 result metrics; Supplement B contains dataset sizes, C the certificate exclusion, D SMALL results and E additional examples.
- **Validation scope:** full-text/note/metadata verification; no training or numerical reproduction was performed.
