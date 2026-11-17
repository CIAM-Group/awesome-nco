---
id: dualopt-a-dual-divide-and-optimize-algorithm-for-the-large-scale-traveling-salesman-pr
short_title: DualOpt
title: 'DualOpt: A Dual Divide-and-Optimize Algorithm for the Large-scale Traveling Salesman Problem'
authors:
- Shipei Zhou
- Yuandong Ding
- Chi Zhang
- Zhiguang Cao
- Yan Jin
year: 2025
date: '2025-01-15'
publication:
  date: '2025-04-11'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/34926
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/34926
institutions:
- Huazhong University of Science and Technology
- Singapore Management University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: Classical grid-wise LKH builds a complete large-scale Euclidean TSP tour; a learned fixed-endpoint subpath
  decoder then reconstructs and accepts improving segments. Experiments reach 100,000 nodes, with selected quality/time
  gains over LKH rather than uniform runtime dominance.
arxiv_url: https://arxiv.org/abs/2501.08565
code_url: https://github.com/Learning4Optimization-HUST/DualOpt
figure:
  path: paper-assets/dualopt-a-dual-divide-and-optimize-algorithm-for-the-large-scale-traveling-salesman-pr/framework.png
  alt: Grid-wise classical LKH tours are merged through edge breaking and fixed partial routes into one complete
    initial tour.
  caption: 'Original Figure 1: grid-based divide-and-conquer initialization with three levels.'
  source_url: https://arxiv.org/pdf/2501.08565v1#page=4
---

# DualOpt: A Dual Divide-and-Optimize Algorithm for the Large-scale Traveling Salesman Problem

> **TL;DR:** DualOpt combines a classical grid/LKH initialization with learned reconstruction of subpaths of an existing tour. It is a **specialist/improvement** solver: autoregressive generation inside an incumbent subpath is the neural improvement action, while the full initial solution is constructed classically.

## Motivation

Training or running one dense neural policy directly on very large TSPs is expensive, and independently solved spatial partitions can create poor boundary connections. DualOpt uses a hierarchy of classical subproblems to obtain a strong full tour, followed by small learned subpath refinements. The studied native problem is symmetric two-dimensional Euclidean TSP. Different instance sizes and TSPLIB distributions do not establish cross-problem generalist learning. [Introduction and related work.](https://arxiv.org/pdf/2501.08565v1#page=1)

## Contributions

- A grid-based divide-and-conquer initialization solves spatial cells with parallel LKH, breaks selected boundary edges and preserves interior partial routes.
- A path-based refinement batches fixed-endpoint subpaths through a neural decoder and accepts lower-cost replacements.
- Bidirectional rollout training and coordinate normalization make the small subpath solver reusable across the larger test instances.
- Random Euclidean instances up to 100,000 nodes, ten large TSPLIB instances and two component ablations characterize quality/time trade-offs. [Algorithms1-3.](https://arxiv.org/pdf/2501.08565v1#page=3)

## Methodology

### Classical initialization

The algorithm partitions coordinates into a square grid and runs LKH on each cell. It removes boundary/crossing edges while retaining internal paths, represents the retained paths by their endpoints/fixed edges, merges neighboring cells, and repeats until the remaining reduced problem can be solved as one tour. This is a heuristic classical initializer, not a learned constructor or exact optimality certificate. The first stage uses parallel cell solves, so comparisons against a serial LKH reference are not CPU-core-normalized algorithmic speedup bounds. [Algorithm2/Figure1/edge breaking.](https://arxiv.org/pdf/2501.08565v1#page=4)

### Learned incumbent refinement

The complete initial tour is split into fixed-endpoint open paths. An attention-based encoder/decoder reorders their internal nodes in batches. Only better paths replace their originals; short trailing paths are retained. Offsetting the splitting origin on later passes exposes different neighborhoods. Multiple subpath lengths and iteration counts are used. This neural operator edits an incumbent, even though its decoder produces each replacement autoregressively. The method does not introduce a separate neural full-tour construction stage.

The decoder context combines mean node embedding, previous node and destination. REINFORCE trains forward/backward traversals with a shared baseline computed from two greedy rollouts; inference keeps the shorter orientation. Translation and division by the maximum coordinate range place points in a bounded box while preserving relative distances up to a common factor. This transformation does **not** make an arbitrary spatial distribution uniform. [Algorithms3/Equations1-3.](https://arxiv.org/pdf/2501.08565v1#page=5)

## Experiments

### Scope and budget

The reported hardware is one RTX3080(10GB) and a 12-core Xeon Platinum8255C. Random tests contain128 TSP1K instances,16 each of TSP2K/5K/10K/20K/50K, and **one TSP100K instance**. TSPLIB evaluation uses ten instances with more than5,000 nodes. Separate neural subpath models are trained on sizes50/20/10 and used with25/10/5 refinement iterations, respectively. Grid levels are selected by overall instance size. This is not evidence that one size50 checkpoint alone produced all neural results. Baselines marked with a dagger are taken from the literature; the other stated baseline runs share the reported machine. [Experimental setup/Table1.](https://arxiv.org/pdf/2501.08565v1#page=6)

### Main results and comparison limits

Table2 reports DualOpt costs23.31/32.72/51.56/72.62/102.90/162.81/230.83 for1K through100K, with times5.6s/7.6s/13.9s/33.9s/1min/6.5min/8.6min. Relative to the listed LKH costs, gaps are0/-0.52/+0.08/-0.47/-0.37/-0.77/-1.40%. The highlighted100K comparison is230.83 in8.6min versus LKH234.098 in14.9h, approximately104x on that **single instance and stated reference budget**. Negative reference gaps do not mean beating the true optimum.

The method does not dominate every neural baseline in time. SIL is faster at1K(0.6s versus5.6s),50K(3.8min versus6.5min) and100K(7.5min versus8.6min), while DualOpt has the shorter reported tours at50K/100K. H-TSP/GLOP are much faster in several settings with worse costs. At5K the displayed Concorde result is worse than the LKH reference; no optimality certificate for that particular returned result is supplied. The row must not be read as evidence that DualOpt outperforms a proven optimum. [Complete Table2.](https://arxiv.org/pdf/2501.08565v1#page=7)

On the ten TSPLIB cases, DualOpt has better reported quality than the two displayed neural competitors but often takes longer than GLOP; LKH retains better quality in most cases. Table3's d18512 lengths652,457(DualOpt) and652,911(LKH) imply approximately-0.070%, although the printed gap is+0.07%. The note preserves the lengths and identifies the sign inconsistency rather than silently treating the printed gap as arithmetic evidence.

Removing the path stage gives100K cost234.2 in8.5min; the full method gives230.83 in8.6min. Replacing the grid initializer with random insertion gives240.82 in2.5min. These ablations support the importance of a strong initializer and the additional quality contribution of learned path refinement, with different runtime costs. They do not isolate every grid or network design choice. [Tables3-4.](https://arxiv.org/pdf/2501.08565v1#page=7)

## Limitations

Results cover Euclidean TSP and a small collection of large benchmark instances, with no capacity/time-window or online routing evaluation. Size-specific grid levels and subpath budgets are tuned operational choices. The largest random setting has one instance and the tables do not provide seed uncertainty or confidence intervals. Mixed literature/rerun baselines, parallel initialization and differing search budgets limit universal quality/time claims. Better-only subpath replacement ensures nonincreasing incumbent length for accepted changes; it does not prove convergence to the global optimum.

## Reproducibility

- Formal AAAI2025 identity is DOI10.1609/aaai.v39i25.34926, pages27178-27186, published2025-04-11. The five-author primary publisher record agrees with the read source. Zhou/Ding contributed equally; Jin corresponds. Affiliations are HUST and SMU.
- **All eight pages of arXiv2501.08565v1, first posted2025-01-15, were read**, including every reference and Tables1-4. The authorized arXiv fallback is the actual reading source. The nine-page formal PDF could not be retrieved because the publisher served a BotStopper denial; no formal-PDF byte comparison or reading of unobtained formal content is claimed. A page-count difference alone is not used to invent missing experiments. No separate scientific supplement is explicitly promised in the read paper.
- The [official repository](https://github.com/Learning4Optimization-HUST/DualOpt), explicitly linked by the paper, was manually inventoried at SHA6218a20cdfabe5813555ca415902d70338b13be6:111 entries, one README and no additional scientific PDF/TeX/ZIP/notebook. The complete README was read. It states Linux support, LKH3.0.7/pylkh/C dependencies and training/evaluation commands with scale-specific LKH layer numbers. The README's size50 training example does not supersede the paper's separate50/20/10-model protocol. No training or end-to-end benchmark was rerun for this review.
- Original Figure1 is cropped from PDFpage4, rectangle(54,59,296,211), at5x and actually viewed. Algorithms1-3, the normalization/training formulas and full result/ablation tables were rendered and inspected visually.
- Internal relationships require an explicit body citation and matching bibliography identity. SIL is cited here as the six-author2024 preprint2403.19561; its mapping to the formal representative uses the previously documented curator comparison of the two manuscripts, not an assertion that arXiv changed its title. ExtNCO's cited SSRN2023 manuscript and the Constraints2022 generalization article are not forced onto a merely similar catalogue entry or independent conference work.
