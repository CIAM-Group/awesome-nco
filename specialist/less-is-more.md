---
id: less-is-more
short_title: Less Is More
title: Less Is More -- On the Importance of Sparsification for Transformers and Graph Neural Networks for TSP
authors:
- Attila Lischka
- Jiaming Wu
- Rafael Basso
- Morteza Haghir Chehreghani
- Balázs Kulcsár
year: 2024
date: 2024-03-25
venue: arXiv
paper_url: https://arxiv.org/abs/2403.17159
arxiv_url: https://arxiv.org/abs/2403.17159
institutions:
- Chalmers University of Technology
- Volvo Group Trucks Technology
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: kNN or LKH-style 1-tree candidates sparsify encoder message passing, while the constructive TSP decoder can still choose any unvisited node; multi-level encoder ensembles improve selected validation gaps with preprocessing and training costs.
figure:
  path: paper-assets/less-is-more/framework.png
  alt: Original flowchart adds sparsification before the GNN or transformer encoder, then retains node embeddings and the autoregressive TSP decoder.
  caption: 'Figure 3: sparsification changes the encoder input while retaining the constructive decoder.'
  source_url: https://arxiv.org/pdf/2403.17159v1#page=6
inclusion: reference
inclusion_reason: The official Chalmers publication record still labels this work Preprint; no qualifying formal publication has been established as of 2026-11-16.
---
# Less Is More -- On the Importance of Sparsification for Transformers and Graph Neural Networks for TSP

> **TL;DR:** Sparse k-nearest-neighbor or 1-tree candidate graphs can help an encoder focus on useful TSP structure. Transformer attention masks implement the same idea. Crucially, the **decoder still has access to all unvisited nodes**; the sparse graph limits information propagation, not the feasible tour edges. Multi-level encoder ensembles improve reported validation gaps, with additional preprocessing, model and training costs. **Publication status: reference-only preprint.**

## Motivation

Dense message passing can dilute local geometric structure or make it difficult to distinguish node embeddings. The paper illustrates this with a simple sum-aggregation example. Its proposed preprocessing removes unpromising edges before encoding, while retaining the original constructive decoder. The example motivates an inductive bias; it does not prove that every attention or GNN architecture fails on complete graphs. [Introduction/Figure 1.](https://arxiv.org/pdf/2403.17159v1#page=1)

## Contributions

- Compares kNN and LKH-style **1-tree alpha-candidate** preprocessing, including their empirical retention of optimal tour edges.
- Applies sparse adjacency to GCN/GAT message passing and transformer encoder attention masks.
- Combines encoders at multiple sparsification levels to balance local focus and wider information flow.
- Evaluates data size, distribution, graph degree and encoder family, then studies masked transformer ensembles for TSP50/TSP100. Extensions to constrained VRP or learned improvement/search are future work, rather than demonstrated task coverage. [Sections IV-V.](https://arxiv.org/pdf/2403.17159v1#page=4)

## Methodology

### Candidate graphs and masks

kNN retains each node's k closest neighbors. It can disconnect clustered graphs, which blocks information exchange across components. The alternative uses alpha scores: compare a cheapest 1-tree's cost with the cheapest 1-tree forced to include a given edge, then retain low-alpha candidates. The implementation described in the paper uses efficient LKH candidate generation, rather than literally recomputing a whole 1-tree for every edge as the explanatory algorithm does. Reverse edges are added to symmetrize the candidates. [Algorithm 1/Section IV.A.](https://arxiv.org/pdf/2403.17159v1#page=5)

For GNNs, candidate adjacency limits message passing. For transformers, it becomes an encoder attention mask. GCN edge weights use alpha scores for 1-tree candidates and distances for dense/kNN cases: normalize to [0,1], reverse the score and apply softmax over neighbors. GAT also incorporates and updates distance-derived edge features. Thus the GCN comparison changes both adjacency and the numerical edge-weight source, rather than isolating adjacency alone. [Appendix B/Algorithm 2.](https://arxiv.org/pdf/2403.17159v1#page=10)

The paper motivates connectivity using the underlying 1-tree and reports strong empirical retention. These arguments should not be elevated into a general optimal-edge guarantee for arbitrary top-k candidate sets. An underlying connected tree and a truncated candidate graph are different objects; the paper supplies empirical coverage counts, not a universal optimum-retention certificate.

### Multi-level encoder ensembles

Separate encoders process different sparsifications of the **same instance**. Their node embeddings are concatenated and passed through an MLP, producing one node representation for the unchanged decoder. This is a representation ensemble, rather than independently decoding three solutions and choosing the best. GNN ensembles use **k=3/10/50**; transformer ensembles use **k=3/20/50**. The encoders and combination are trained as part of the routing model. [Section IV.B/Figure 3.](https://arxiv.org/pdf/2403.17159v1#page=6)

The framework is based on Pointerformer's end-to-end, POMO-inspired RL training. The paper explicitly states that its autoregressive decoder was **not changed**: any unvisited node can follow any other node, even when that edge is absent from the encoder graph. This preserves the ability to construct a Hamiltonian cycle when sparse encoder graphs omit optimal edges or are disconnected. No extra repair/local-search stage is required by the evaluated decoder. [Appendix B.](https://arxiv.org/pdf/2403.17159v1#page=11)

Classification remains **specialist / constructive**. Experiments solve Euclidean symmetric TSP, with models trained for particular architectures/distributions/sizes. Sparsification is not learned incumbent editing, and broader applicability is a proposed extension rather than a shared cross-task checkpoint.

## Experiments

### Training and evaluation protocol

GNN experiments train GATs with six layers and GCNs with three layers, sizes **500/1,000/5,000/20,000 training instances**, degrees **3/5/10/20/50**, two distributions and both sparsifiers. Each configuration runs **1,000 epochs**. Most use a **16 GB NVIDIA T4**; the largest dense GAT and transformer runs use a **48 GB A40**. A common **1,000-instance validation set** is reused within each distribution, and the tables report the **best validation gap over epochs**. These are not results from a separately described untouched final test set. [Section V.B/Appendix B.](https://arxiv.org/pdf/2403.17159v1#page=7)

The mixed distribution applies 100 random mutation operators to uniform coordinates, including clustering, explosion/implosion and projections. It is synthetic, despite resembling clustered public instances. The study does not report a TSPLIB/CVRPLIB benchmark or cross-scale transfer experiment. Training TSP50 and TSP100 models separately is not evidence that one model generalizes across those sizes. [Appendix A/Section V.B.](https://arxiv.org/pdf/2403.17159v1#page=10)

For transformers, **one million original instances become 16 million augmented instances** through flips/rotations. Training samples 100,000 from this pool per epoch, for **900 epochs at TSP100** and **1,000 at TSP50**. This is a smaller pool of distinct augmented data than Pointerformer's stated 50 million freshly generated instances, but corresponds to about **90/100 million sampled training examples**. Smaller data variety is not automatically fewer optimization examples or lower total compute. [Section V.B/Appendix C.](https://arxiv.org/pdf/2403.17159v1#page=7)

### Optimal-edge coverage

On 100 random TSP100 cases per distribution, Table I counts cases retaining **all** optimal-tour edges. At k=5, uniform coverage is **65/100 with 1-tree versus 5/100 with kNN**; mixed coverage is **76 versus 2**. At k=10, counts are **98 versus 85** for uniform and **98 versus 49** for mixed. These are whole-case coverage counts, not percentages of all individual edges. Tuning ascent-candidate/initial-period settings can reach 100/100 on these samples at roughly double preprocessing time; it still does not establish coverage for every future graph. [Table I and footnote.](https://arxiv.org/pdf/2403.17159v1#page=7)

### Encoder results

| Configuration | Dense validation gap | Selected sparse/ensemble gap | Qualification |
| --- | --- | --- | --- |
| Uniform GAT, 20,000 training cases | 15.66% | .70% | Best single 1-tree k=20 and mixed-level ensemble tie |
| Mixed GAT, 20,000 | 14.29% | 1.15% | 1-tree ensemble; unusually poor dense baseline |
| Uniform GCN, 20,000 | 2.35% | .94% single k=3; .77% ensemble | Alpha weights differ from dense distance weights |
| Mixed GCN, 20,000 | 2.59% | .87% ensemble | Improvement remains distribution/configuration-specific |

GAT's strong dense failure motivates the study but should not be generalized to all transformer implementations. The authors themselves distinguish PyTorch Geometric message passing from traditional attention implementations. Ensembles are also not always best: at uniform GAT d=500, 1-tree k=5 reaches **3.70%**, while the 1-tree ensemble is **4.93%**. Choice of degree and dataset size matters. [Tables II-III.](https://arxiv.org/pdf/2403.17159v1#page=8)

### Transformers and compute

On the common 10,000-instance uniform validation dataset, Table IV gives **TSP100: .25% dense versus .10% ensemble**, with inference times **1.52 versus 1.78 minutes**. Pointerformer's separately trained 50-million-instance row is **.16%/52 seconds**; POMO is **.14%/one minute**. At TSP50, own dense/ensemble gaps are **.05%/.00%**, taking **27/34 seconds**. A displayed .00% is rounded precision, not proof that every tour was exactly optimal. [Table IV.](https://arxiv.org/pdf/2403.17159v1#page=9)

Preprocessing is additional. On an **eight-core M1 MacBook Air**, Table V gives 10,000-case times at TSP100 of **49 seconds dense, 1.7 minutes kNN and 3.6 minutes 1-tree**; at TSP50, **12/40 seconds/2.2 minutes**. These timing configurations generate five candidate degrees and include GCN edge-weight calculations, so they are not exact measurements for every three-level transformer setting. Nevertheless, omitting preprocessing makes a runtime comparison incomplete. Search-based att-GCN has a better listed TSP100 gap **.04%**, at 14 minutes. The paper's state-of-the-art wording is limited to selected contemporaneous encoder-decoder rows and budgets. [Tables IV-V/Appendix D.](https://arxiv.org/pdf/2403.17159v1#page=12)

Appendix E compares same-degree ensembles against mixed-degree ensembles at d=20,000. The 1-tree GCN mixed ensemble reaches **.77%**, versus **.84%** for k=3/3/3 and **1.96%** for k=50/50/50. This supports the selected representation mixture, but does not search all ensemble compositions or isolate equal-parameter training against every baseline. [Table VI.](https://arxiv.org/pdf/2403.17159v1#page=12)

## Limitations

### Reported by the Authors

- Optimal edges can be lost at sparse degrees; ensemble composition and preprocessing speed involve tradeoffs.
- Preprocessing millions of original instances is costly, motivating reuse through augmentation.
- Constrained routing, repeated-depot visitation, scalable search/improvement integrations and optimal ensemble composition remain future work. [Conclusion/Appendices C-E.](https://arxiv.org/pdf/2403.17159v1#page=10)

### Curator Notes

- Main experiments concern TSP50/100 and synthetic distributions, with best-epoch validation selection.
- Three encoders, longer training and 1-tree preprocessing contribute compute; a smaller unique data pool does not mean a smaller training budget.
- GCN edge-score changes and unusually weak dense GAT baselines complicate a pure sparsification-only attribution.
- Empirical candidate coverage, rounded zero gaps and illustrative message-passing examples are not general optimality or connectivity proofs.
- The study is still identified as a preprint by the official institutional record and remains outside the qualifying formal-publication main list.

## Reproducibility

- **Reading:** all **14 pages of arXiv v1, 25 March 2024**, were read, including Appendices A-E, every table/algorithm, references and the final biography page. Scientific metadata and source-version provenance are separate from formal eligibility.
- **Publication status:** [official Chalmers record](https://research.chalmers.se/en/publication/540540) explicitly labels the work **Preprint, 2024**. It does not provide a qualifying conference/journal record. The reference-only flag is retained, and no acceptance/publication date is invented.
- **Authors/institutions:** five authors; Chalmers University of Technology and **Volvo Group Trucks Technology**, the latter restored from the title page. Historical education/employment in biographies is not added as current paper affiliation.
- **Scientific materials/code:** the manuscript includes the scientific A-E appendices, with no pointer to a missing scientific attachment. The arXiv and official institutional landing records were manually checked; no separate scientific supplement or official code repository was located. Page 11 promises code upon acceptance; this promise is not a working code link or evidence of acceptance.
- **Figure:** original **Figure 3**, PDF page 6, directly cropped from the source. Main algorithms, all result/retention/runtime/ensemble tables and appendix illustrations were visually checked.
- **Verification limits:** the reading verifies reported claims and reference provenance, rather than independently rerunning training or establishing the authors' strongest generality claims. A stray in-text [36] around the dense baseline points bibliographically to routing DRO; that numbering inconsistency is retained as a citation qualification rather than silently relabeling the referenced work.
