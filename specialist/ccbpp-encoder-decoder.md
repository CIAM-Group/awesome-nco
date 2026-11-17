---
id: ccbpp-encoder-decoder
short_title: CCBPP-ED
title: Learning to solve Class-Constrained Bin Packing Problems via Encoder-Decoder
  Model
authors:
- Hanni Cheng
- Ya Cong
- Weihao Jiang
- Shiliang Pu
year: 2024
date: '2024-05-31'
publication:
  date: '2024-05-31'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Abstract-Conference.html
institutions:
- Hikvision Research Institute
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Packing
- Knapsack
problems:
- Class-Constrained Bin Packing
- One-Dimensional Bin Packing
- Manufacturing Order Consolidation
- Multi-Dimensional Knapsack
summary: A supervised GCN predicts same-bin relationships; constraint-aware First
  Fit decodes cluster-guided item orders and instance-specific last-layer active search
  improves the packing count.
code_url: https://proceedings.iclr.cc/paper_files/paper/2024/file/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Supplementary-Conference.zip
---

# Learning to solve Class-Constrained Bin Packing Problems via Encoder-Decoder Model

> **TL;DR:** Learn which items should share bins, decode an ordering with packing-state-aware clustering, and adapt the last neural layer per test instance. Results cover class-constrained packing, manufacturing orders and a separately trained knapsack variant. Optimality and released-code qualifications matter for interpreting the tables.

## Motivation

Many valid item orders represent the same packing partition. Learning one assembly sequence can obscure these equivalences, while sizes and shared classes create relationships that a graph model can encode directly. The paper replaces sequence labels with a same-bin connection matrix and combines supervised prediction with constraint-aware decoding and test-time adaptation.

## Contributions

The encoder is a residual gated GCN predicting item-pair heatmaps from size/class features. Cluster Decode aggregates relationships to items already in the latest bin; First Fit converts the selected order into a packing. Active Search adjusts the final prediction layer for each instance. Experiments include single- and multi-class CCBPP, ordinary1Dpacking, an industrial order-consolidation case and an additional multidimensional knapsack model (AppendicesA-E).

The method is **specialist/constructive-improvement**. Neural heatmaps guide construction and per-instance active updates improve its result. Different C/Q/M settings are treated as separate problems, and the OCP model is separately trained on2,000synthetic instances. Its shared deployment on synthetic and real OCP is distribution transfer. AppendixE5 explicitly trains a different MDKP network with a vector output and different decoding; it is not one checkpoint jointly solving CCBPP/OCP/MDKP (PDF9/22-24).

## Methodology

CCBPP minimizes the number of bins, each with additive item-size capacity B and at most C distinct classes from Q possibilities. An item has one class or a fixed-size class subset. OCP differs: a consolidated order requires the union of its component types; each distinct component consumes its feeder bandwidth once, regardless of quantity or repeated use across orders. It has a weighted union-capacity constraint and unlimited additive item-size capacity (PDF3/13-15).

The fully connected item graph uses normalized size/class node features and class cosine-similarity edges, replacing zero similarity with0.3. Three residual GCN layers update edge and node embeddings with featurewise gates and batch normalization. A three-layer MLP predicts same-bin labels. Training combines weighted cross entropy and the stated modular penalty, with coefficient0.3. Supervision is obtained from constructed feasible partitions rather than solving every generated instance exactly. The formal training protocol uses20epochs, learning rate0.00005and weight decay0.00001, taking about two hours for single-class and three for multi-class CCBPP (PDF4-5/17).

Cluster Decode starts from a random item, inserts items using First Fit, and chooses later items by aggregate heatmap affinity to the latest opened bin. First Fit is responsible for checking capacity and class union; a high connection score alone does not establish feasibility. Active Search freezes the encoder and updates the last MLP layer, using solution costs and relative log-probabilities. The paper uses32candidates,30updates for single-class packing and50for multi-class/OCP, with adaptation learning rate0.005. This adaptation is part of inference cost, not an extra offline training step (PDF6-7/16-18).

## Experiments

**Synthetic CCBPP.** Main datasets use B100, integer sizes10-25,6,400training and200test instances. Each constructed instance has a20-bin reference. Under the printed full-size cutting procedure, total item size is20B, giving a matching20-bin lower bound. At C5/Q10single-class, AS averages20.47bins versus GA20.63and ACO20.785, taking10.14seconds versus13.96/93.11. Harder multi-class C5/Q20/M3averages25.915bins, a29.58% gap, so near-optimal descriptions do not apply uniformly. Its58.21seconds exceed GA56.74seconds in that row. Direct sampling is much faster than AS but often loses quality; Random/FFD are also much faster, with poorer counts (Tables1-3).

**Manufacturing orders.** One OCP model trains on2,000synthetic days and is tested on200synthetic and24real days of September2022. Real days contain123-178orders. AS averages9.325bins against the constructed synthetic reference mean9.11, reported as2.36%, and14.29consolidated real orders versus ACO15.33and GA17.00. Real optimal values are unknown. The synthetic reference needs the additional qualification below: filling a shared-component feeder does not by itself establish minimum bin count (Table4; AppendixD1).

**Ablations and budgets.** Learned heatmaps outperform equal/cosine/PointNet heatmaps in the tested combinations. Cluster decoding improves synthetic packing versus last-item greedy decoding, but real OCP has the same14.29mean for both, with greedy decoding faster. Increasing AS from50to200iterations yields synthetic9.285and real14.125, at about90seconds with32candidates or180seconds with64. These curves demonstrate diminishing returns under the chosen budgets, not an optimization upper limit (Tables5-8; Figure9).

**Other scales/distributions/problems.** Separately configured1DBPP obtains20.24/20.27bins for small/large item settings. Distribution-shift tests use a U(10,25)-trained encoder: shifted U(25,50) reaches21bins, tying GA/ACO rather than strictly beating them; the normal-distribution tests have unknown optima. Larger300/500-item benchmark tables report AS near30/50-bin references, but do not establish zero-shot small-to-large checkpoint transfer. More than1,000items are not tested due to resources (Tables9-13).

AppendixE5 changes the output to per-item selection scores for MDKP and trains that model. Table14 reports value ratios of101.59%-105.30% relative to its achieved GLOP baseline, not certified integer-optimality gaps. The GLOP model/rounding details needed to interpret it as an LP bound are not specified; these ratios must not be called improvements over a valid optimal relaxation bound. AS has the best reported values, while some other learning/search methods remain faster in individual columns. Evaluation uses an RTX3090 and32-core EPYC7542; independent retraining seeds, confidence intervals and statistical tests are not identified (PDF7/24).

## Limitations

Pairwise prediction uses a complete graph and quadratic edge storage. Stronger exact class-constrained methods are omitted because the authors could not reproduce them; omitted solver results are not evidence of universal superiority. Constructed distributions and fixed reference counts can favor their learned partition patterns. Different input configurations/output formulations use separate training, and per-instance adaptation increases runtime. No optimality or approximation-ratio guarantee is proved for the GCN/decoding/AS solver.

### Curator Analysis

**Printed formulation.** AppendicesB1/B2 minimize sum(y) but contain no constraint linking item assignment/class activation to y. For one item/class with size and capacities1, x11=z11=1 and y1=0satisfy every listed constraint, giving objective0although a nonempty packing needs one bin. The printed MILPs therefore need activation links. This concerns the written formulation; it does not show that the separate First Fit implementation counts zero bins (PDF14-15).

**Constructed OCP references.** Unlike additive sizes, shared component unions are nonadditive across orders. With capacity2and unit-bandwidth components a,b, two constructed full bins each containing orders{a},{b}can be consolidated into one bin containing all four orders. Thus full utilization alone does not certify the synthetic OCP labels as optimal. The paper supplies no independent lower-bound certificate for those instances; retain9.11as its constructed reference and2.36% as the reported reference-relative number. This example does not establish that every actual generated OCP label is wrong (PDF8-9/15/17).

**Printed prediction versus released implementation.** Equation6 applies sigmoid to a ReLU, so its output cannot fall below0.5; its written matrix shape also leaves the scalar projection unclear. The publisher ZIP instead uses an unconstrained two-logit MLP and softmax. Executing that original MLP class with logits(2,-2) gives positive-class probability0.017986, which the literal printed equation cannot represent. The current cluster branch chooses subsequent items by argmax and then differentiates their softmax log-probabilities; an unbiased categorical policy-gradient interpretation requires additional sampling justification. These are specific print/release differences, not a rerun-based rejection of historical tables.

## Reproducibility

- All24pages of the [formal ICLR2024 paper](https://proceedings.iclr.cc/paper_files/paper/2024/file/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Paper-Conference.pdf) were read, including all bibliography entries and scientific AppendicesA-E. Sixteen pages were rendered and checked, covering every figure, fourteen tables, both algorithms and the central formulas. Publisher metadata verifies four Hikvision authors, May31,2024and pages24837-24860.
- The publisher's [official implementation ZIP](https://proceedings.iclr.cc/paper_files/paper/2024/file/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Supplementary-Conference.zip) was downloaded and all60members inventoried. It has26actual files after directories/AppleDouble exclusions, no scientific PDF, datasets or checkpoints. The scientific appendix is integrated in the24-page article. Both OpenReview APIs for`6hvtSLkKeZ` returned403; no explicit missing science attachment was found.
- The full README and GCN/MLP/First Fit environment/data generator were inspected, plus central loss, training configuration/checkpoint and active-search sections. The archive covers CCBPP and pointer/evolutionary baselines; OCP/MDKP implementation was not identified. Training defaults use learning rate0.0001and weight decay0.0001, differing from the formal settings. The generator cuts each100-capacity bin to97-100and pads zero-size items; with20such bins the total size still exceeds19B, supporting a20-bin size lower bound, although it differs from the printed exact-full procedure.
- Direct current-module execution needs repair: `bpp_env.py` has no Numpy/copy imports, and its unmodified constructor raises `NameError: np is not defined`. A local check extracts the original MLP class via AST to avoid the environment's unavailable local OR-Tools dependency; it also checks the literal MILP and illustrative OCP union examples. No original code was edited and no full training/packing benchmark was run.
- Thirteen relations have explicit body citations and matching full bibliography identities, including reconciled PCT preprint/publication years. Code/formula checks, source hashes, actual page coverage and archive inventory are preserved with the review.
