---
id: learning-to-solve-grouped-2d-bin-packing-problems-in-the-manufacturing-industry
short_title: IHRL / G2DBP
title: Learning to Solve Grouped 2D Bin Packing Problems in the Manufacturing Industry
authors:
- Wenxuan Ao
- Guozhen Zhang
- Yong Li
- Depeng Jin
year: 2023
date: '2023-08-04'
publication:
  date: '2023-08-04'
  source_url: https://api.crossref.org/works/10.1145/3580305.3599860
venue: KDD
paper_url: https://doi.org/10.1145/3580305.3599860
institutions:
- Tsinghua University
- BNRist
- TsingRoc
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Packing
problems:
- Grouped 2D Bin Packing
summary: A hierarchical solver improves complete customer-order partitions with a PPO swap/relocate policy and constructs
  shelf-packing permutations with a separate POMO-trained attention policy. Experiments cover synthetic and private
  furniture-production data; the reported deployment saving is a two-week observation with an annual projection.
code_url: https://github.com/tsinghua-fib-lab/G2DBP
figure:
  path: paper-assets/learning-to-solve-grouped-2d-bin-packing-problems-in-the-manufacturing-industry/framework.png
  alt: GroupRL modifies complete order groups, PermRL constructs packing sequences, and the resulting bin utilization
    feeds back to GroupRL.
  caption: 'Original Figure 3: hierarchical grouping improvement and packing construction in the manufacturing pipeline.'
  source_url: https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=4
---

# IHRL: Learning to Solve Grouped 2D Bin Packing Problems in the Manufacturing Industry

> **TL;DR:** IHRL couples a learned editor of complete customer-order partitions with a learned item-permutation constructor and a classical shelf-packing algorithm. It is **specialist/constructive-improvement**: both neural stages are core components, but they are distinct agents for one coupled manufacturing problem, rather than a single checkpoint solving multiple native optimization problems.

## Motivation

Manufacturing batches must keep each customer's items together while limiting the number of items in a batch. Optimizing packing independently after a fixed order partition can waste material; optimizing partitions without the lower-level packing cost can also choose poor batches. The grouped 2D bin packing problem therefore minimizes total sheet usage across a partition of whole orders, subject to a per-group item-count limit and feasible two-dimensional cuts. [Problem and motivation.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=1)

## Contributions

- A bi-level formulation couples order grouping and guillotine-constrained rectangular packing.
- **PermRL** learns a sequential item permutation that a fast, deterministic shelf algorithm turns into a packing plan.
- **GroupRL** learns swap and relocate moves on complete grouping plans using feedback from lower-level packing.
- Experiments separate both agents' contributions, examine shape/capacity transfer, and report a factory deployment observation. [Overview.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=2)

## Methodology

### Feasible packing and initial grouping

Bins have identical width and height. Rectangular items must fit without overlap, and all items of an order belong to the same group. A three-stage horizontal–vertical–horizontal guillotine structure divides a bin into shelves and same-width blocks. Given an item order, the classical placement routine tries an existing matching-width block, a new block in an existing shelf, a new shelf in an existing bin, then a new bin. The neural model chooses the permutation, rather than continuous coordinates or arbitrary cutting patterns.

The classical Min-Group initializer sorts orders by nonincreasing item count and inserts each into the first group with sufficient remaining capacity. This supplies a complete feasible incumbent partition. [Definitions, cuts and initialization.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=3)

### PermRL: neural construction

Normalized item width/height are embedded and processed by self-attention. The decoder combines the mean item embedding with a GRU representation of previously selected items, uses an attention glimpse, masks selected items and samples the next item. The resulting complete permutation is scored by negative bin count after shelf packing. POMO-style multiple starting items and a shared rollout-mean baseline train this lower policy. The text specifies Adam with learning rate1e-5. [Architecture and training.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=4)

### GroupRL: neural improvement

The upper state is an already complete order grouping with packing utilization statistics, group capacities and recent action history. Hierarchical min/max/mean aggregation summarizes item, order and group features. A PPO actor first selects a pair of groups, then selects a valid order swap or relocation; a critic pools group embeddings. The transition reward is the reduction in packed-bin count. Moves may worsen the current state, while the best solution encountered is retained for production.

Factoring group-pair and conditional order selection avoids enumerating all joint alternatives at once; it is not a theorem that the global optimization problem becomes easy. GroupRL explicitly edits a complete incumbent, whereas PermRL supplies a substantive learned constructor. Thus the combined solver has both paradigms. Transfer across group limits remains transfer within G2DBP, and the released G100/G200 lower/upper checkpoints are separate. [Equations12–22.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=6)

## Experiments

### Data, training and search budgets

The private Real data contain two weeks of production:2,418orders and81,083items, with a200-item group limit. Synthetic G200 mimics its item-size distribution; daily order counts follow a truncated Gaussian centered at200. AppendixA specifies1,000training days and10test days. G100 halves orders/items and uses limit100. The released files contain100test days, but `run_ours.py` explicitly slices the first10, matching the paper's evaluation count.

AppendixC reports10,000GroupRL epochs, approximately two days, and5,000PermRL epochs, approximately four hours, on an RTX3090 / Xeon Gold6342 server with128GBsystem memory. Main settings are embedding32, three lower attention layers, four heads, clipping10 and history length10. Both SA and GGA baselines and the proposed solver take1,000search steps. Equal iteration counts are not equal work: GGA maintains a population and performs memetic local search. Timings are average wall time per daily case, rather than time for every item or all cases combined. [Setup and complete appendices.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=7)

### Main comparison and ablations

| Data | GGA-H bins / time | IHRL bins / time | Bin reduction versus GGA-H |
| --- | --- | --- | --- |
| Real |3,172 /3,823.2s|3,111 /18.94s|1.92%|
| G200 |3,056 /4,741.5s|2,999 /22.26s|1.87%|
| G100 |836 /2,109.7s|820 /11.40s|1.91%|

These bin counts aggregate their respective test sets; times average daily instances. SA-H is much faster, at1.24–2.69seconds, but uses more bins, so the result is a quality/runtime trade-off rather than universal speed dominance.

The reported gaps7.28%,7.88% and10.66% use a reference labeled LB. It is obtained by removing grouping and guillotine restrictions and applying MaxRects. A heuristic solution of that relaxation is an estimated reference, not a certified lower bound on every constrained instance. The reductions2.10,2.05 and2.16 in the gap row are percentage-point differences. Figure5 shows benefits from both learned components: on G200 the gap is9.4% for GroupRL+height sorting,9.4% for GGA+PermRL, and7.9% for the full combination. [Table1 / Figure5.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=7)

### Transfer and deployment

A G200-trained model is tested on square-like, strip-like and uniform item shapes, plus group limits100and300. It outperforms the listed height-sorting baselines on those five settings; this is neither multi-native-task evaluation nor a guarantee for arbitrary distributions.

At ARROW Home, the paper reports two weeks of test production in which average sheet utilization changed from70%to73%, associated with4.1%lower raw-material cost. The projected annual saving is$1.2million against$30million annual material expenditure. The text does not give a randomized/concurrent control, uncertainty estimates or a year-long measured saving. [Transfer and deployment.](https://fi.ee.tsinghua.edu.cn/public/publications/816b1bb0-6439-11ee-84fe-0242ac120002.pdf#page=8)

## Limitations

The method assumes identical rectangular sheets, whole-order groups, item-count capacity and a particular three-stage shelf representation. It does not establish globally optimal grouping or packing, nor an approximation ratio. The reported relaxed MaxRects reference is not an exact optimality certificate.

Real production data are private. The public synthetic data and separate learned agents support partial reproduction, but a deployment comparison cannot be reconstructed from the release. Multiple-seed uncertainty and a controlled attribution of the factory saving are absent. No training or benchmark experiment was independently rerun.

## Reproducibility

- Formal KDD2023 DOI10.1145/3580305.3599860 identifies four authors and11pages. The actual Tsinghua-hosted formal PDF was fully read, including all40references and AppendicesA–C. Ao/Zhang list Electronic Engineering, BNRist, Tsinghua University and TsingRoc; Li/Jin list Electronic Engineering, Tsinghua. No unprinted correspondence designation is inferred.
- ACM's deposited metadata specify electronic publication2023-08-04 and print2023-08-06; the conference ran August6–10. The date field uses the explicit electronic publication date. No identifiable arXiv reading version was found or asserted.
- The official repository was inventoried at commitb3d16d4f93ced4efd62b7fca9ceb443d3829102d:25paths, including separate lower/upper G100/G200 checkpoints, synthetic data and one demo notebook. Its complete README and all notebook cells and stored scientific outputs were read; the three stored figures were actually viewed. There are no PDF/TeX/ZIP scientific attachments in that tree, and the ordinary releases page states there are no releases. GitHub API rate-limit failures were not treated as evidence of empty inventories.
- The release requires the authors' separate `pybp` dependency and does not include private Real data. Code defaults use100,000timesteps and learning rate3e-4 in training parsers, unlike the paper's stated epoch counts / lower1e-5; the saved checkpoint settings and an explicit configuration are needed to reproduce paper runs. This is a configuration distinction, not a claim that training was reproduced.
- Original Figure3 is cropped from PDFpage4 at rectangle(48,80,565,290), rendered4x, and viewed in full. Problem/cutting figures, actor/decoder formulas, all tables, ablations, transfer plots and the deployment illustration were visually inspected. No additional necessary scientific appendix is referenced beyond the included A–C and inspected demo.
- Four internal relations have explicit body citations and matching bibliography identities: Attention Model, POMO, Pointer Networks and Online3D Bin Packing. The cited POMO/preprint and AMyear labels are preserved; uncatalogued 3D-packing journal work is not forced onto a different conference ID.
