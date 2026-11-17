---
id: m3c
short_title: M3C / UM3C
title: 'M3C: A Framework towards Convergent, Flexible, and Unsupervised Learning of Mixture Graph Matching and Clustering'
authors:
- Jiaxin Lu
- Zetian Jiang
- Tianzhe Wang
- Junchi Yan
year: 2024
date: '2024-05-31'
publication:
  date: '2024-05-31'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/2030d35841f8617ab22cca913f55697e-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/2030d35841f8617ab22cca913f55697e-Abstract-Conference.html
institutions:
- University of Texas at Austin
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Graph Matching
problems:
- Multi-Graph Matching
- Graph Clustering
summary: Learning-free ranked matching composition and graph grouping generate selected pseudo labels for neural
  visual node/edge affinity learning.
code_url: https://github.com/Thinklab-SJTU/M3C
---

# M3C: A Framework towards Convergent, Flexible, and Unsupervised Learning of Mixture Graph Matching and Clustering

> **TL;DR:** Learning-free M3C alternates pair selection and matching composition for mixed graph collections; neural UM3C learns visual node/edge affinities from selected solver-generated pseudo labels.

## Motivation

Graphs in a collection may belong to different object categories, so enforcing correspondence across every pair can be misleading. Mixture graph matching and clustering seeks both node correspondences and graph-level groups, using matching scores to inform grouping and selected group relationships to improve matching (Sections1-3).

## Contributions

- Formulate a normalized joint matching/grouping objective and a minorize-maximization interpretation.
- Relax hard clusters into discrete selected graph-pair indicators, with global, local or fused ranking and supergraph path composition.
- Build unsupervised UM3C with learned unary/edge affinities, geometric-affinity fusion and selected pseudo-label affinity supervision. M3C itself is learning-free; the neural contribution is UM3C.

## Methodology

**M3C.** Initialize every pair through a solver such as RRWM. Select high-affinity graph pairs to form a sparse supergraph, improve correspondences by composing matches along its paths, and repeat. Global ranking selects a fixed total number of pairs; local ranking selects neighbors per graph; fused ranking combines both endpoint ranks. In the practical parameter rule, add ranked edges until the supergraph becomes connected. Finally sparsify pair affinities with ten nearest neighbors and use spectral clustering (or the tested multicut alternative). The final number of clusters is supplied to the clustering setup; relaxed pair indicators during optimization need not themselves form transitive clusters (Sections4/G.4/H.5; Algorithms1/3).

**UM3C.** ImageNet-pretrained VGG16 and SplineCNN produce node features; differences between node features represent edges. Inner products define unary and quadratic affinities, fused with length/angle-based geometric affinity. M3C gives pseudo matches; their vector outer products become target affinity labels. Only graph pairs selected by the relaxed indicator contribute to affinity training. No gradient through the discrete solver is required. Parameters, geometric-fusion weights and separate Willow/Pascal settings are specified in Table7; ordinary inference uses only two M3C iterations (Sections5/F; Algorithm2).

**Convergence conditions.** The ideal MM proof defines h(X) as an exact optimal indicator and requires a nondecreasing surrogate update for fixed affinity. Under a bounded objective this gives convergence of objective values, not a global optimum, unique matching, correct semantic labels or convergence of changing neural parameters. Global/local fixed-cardinality affinity ranking solves the associated selection problem. Spectral hard clustering, fused endpoint ranking and dynamic connectivity/cardinality are practical procedures; the exact-h proof does not by itself prove their equivalence to every displayed argmax or cover arbitrary changing feasible sets. Proposition4.1 additionally assumes fixed cluster-size multiset and independent improvement only of selected pairs; its final non-strict inequality needs uniqueness/tie handling to force unchanged indicators rather than equal-objective alternate clusters (Sections4/C.2-C.3/H.5).

## Experiments

**Protocol and metrics.** Willow tests mix car/duck/motorbike, usually three categories with eight graphs each, with0/2/4 random outliers. Pascal is restricted to ten selected classes, filtered to9-10 common keypoints and padded with random outliers to exactly ten, giving944 training/220 evaluation images. Images are cropped/resized to256 square pixels and graphs use Delaunay edges. Mean results usually average fifty tests. MA is evaluated only over graph pairs in the true same class; clustering accuracy, purity and Rand index are separate grouping metrics. High MA therefore does not alone measure correct grouping or exact recovery of the joint problem (Sections6/G.1-G.2).

**Willow.** Learning-free M3C MA is0.884/0.687/0.635 for0/2/4 outliers, versus MGM-Floyd0.879/0.716/0.653. Thus M3C loses in MA at two/four outliers despite better clustering accuracy. UM3C gives MA0.955/0.858/0.815 versus GANN0.896/0.610/0.461, with CA0.983/0.984/0.981. At four outliers the MA improvement over GANN is35.4 percentage points, under the specific protocol. UM3C takes3.2/3.3/3.6s versus GANN5.2/20.6/30.2s; zero-outlier UM3C is slower than BBGM1.6s and learning-free M3C0.5s (Table2).

**Pascal and pretrained extensions.** Standalone unsupervised UM3C MA0.4979/0.4817 exceeds GANN0.2774/0.2372 in3x8/5x10 settings, but remains below supervised models. The +UM3C rows load pretrained feature extractors/initializers from the compared methods. They are extensions with that supervised-training provenance, not a from-scratch label-free equivalent. For NGMv2/BBGM features the5x10 extension MA0.7862 remains below NGMv20.821 and BBGM0.7926; GCAN-based MA also decreases while clustering improves. COMMON-based extension improves both. Inference cost generally rises versus each underlying two-graph baseline (Table3).

**Ablations and sensitivity.** Component ablations support pseudo-label selection and edge affinities. Models trained on5x10 graphs without outliers are tested on other cluster counts/sizes, unbalanced20/10/5 groups and two outliers; this is transfer within the same visual correspondence/grouping task. Two-graph solver transfer also shows stronger learned-affinity portability on the tested Willow setting. Pseudo-label quality matters sharply: reducing RRWM pseudo-label fraction from100% to20% drops MA0.955 to0.156 and CA0.983 to0.512. Qualitative images retain failure cases rather than perfect recovery (Figures3-10/Tables8-11).

**Timing limits.** Learning-free code uses a four-core laptop/Matlab; neural experiments use a Xeon workstation, a GPU named RX8000 by the paper and128GB RAM. Reported solve times do not account for complete neural training cost. The complexity bound retains pairwise initialization O(N²*tau_pair), repeated O(N³*n³) composition and graph-pair sorting/clustering. Sparse practical constants and fewer iterations help empirically, without a blanket constant-time or universal speed guarantee (Sections6/E/F).

## Limitations

### Discussed in the Paper

Hard clustering can lock exploration; too few or too many selected edges can hurt results. Handcrafted affinity can help more complex mixtures but hurt simpler settings once neural affinity improves. Poor pseudo labels degrade both matching and grouping. Broader protein-docking/instance-generation uses are future directions rather than evaluated native tasks (Sections4-7/H).

### Curator Notes

Printed Equation8 calls its log-likelihood expression cross entropy but omits the usual leading minus for a minimized loss. Raw inner products also need explicit probability/range handling before logarithms. The named repository is currently empty, so neither implementation detail can be independently resolved. AppendixG.1 says304 Willow images but lists208+50+66+40+40=404; this source inconsistency is not silently adopted as a dataset manifest. AppendixH.5 contains decimal/caption inconsistencies in r and graph-count discussion; the actual ranking/connectivity rule and experimental table settings are the useful reproducible statements.

MM objective convergence should not be promoted into convergence of the neural training loop, feasibility of every optional global cycle-consistency condition or optimal clustering. The cluster-equivalence discussion also implicitly needs symmetric/reflexive same-class indicators, rather than transitivity alone for arbitrary directed binary matrices. The note records mathematical/protocol limitations without treating them as proof that the reported empirical results are invalid.

## Reproducibility

- **Publication:** [ICLR2024 proceedings](https://proceedings.iclr.cc/paper_files/paper/2024/hash/2030d35841f8617ab22cca913f55697e-Abstract-Conference.html), pages8029-8056. Official HTML citation_publication_date is May31,2024. First two authors share equal contribution; PDF affiliations are UT Austin and Shanghai Jiao Tong.
- **Full reading:** all twenty-eight [publisher PDF](https://proceedings.iclr.cc/paper_files/paper/2024/file/2030d35841f8617ab22cca913f55697e-Paper-Conference.pdf) pages, references and AppendicesA-I, all proofs/algorithms, hyperparameters, additional noise/convergence/transfer tests and visualizations. Publisher links show the paper/BibTeX, with integrated science complete. Normal OpenReviewAXC9KydyZq/API checks require verification/return403; no further scientific attachment was identified.
- **Code availability:** [author-named M3C repository](https://github.com/Thinklab-SJTU/M3C) resolves but explicitly says it is empty; normal main/master archive requests return404. It is a promised location, not a verified runnable implementation. No training was rerun.
- **Relations:** Source-supported catalogue references include DGMC, DLGM, GANN and stochastic SIGMA. The later TPAMI mixture-of-modes article is kept distinct from the NeurIPS GANN paper; absent related papers receive no invented edge.
