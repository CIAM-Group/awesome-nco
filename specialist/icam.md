---
id: icam
short_title: ICAM
title: Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver
authors:
- Changliang Zhou
- Xi Lin
- Zhenkun Wang
- Xialiang Tong
- Mingxuan Yuan
- Qingfu Zhang
year: 2026
date: '2024-05-03'
venue: IEEE T-ITS
paper_url: https://doi.org/10.1109/TITS.2026.3674538
arxiv_url: https://arxiv.org/abs/2405.01906
code_url: https://github.com/CIAM-Group/ICAM
institutions:
- Southern University of Science and Technology
- Xi’an Jiaotong University
- Huawei Noah’s Ark Lab
- City University of Hong Kong
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Asymmetric Traveling Salesman Problem
- Vehicle Routing Problem with Time Windows
summary: A learned scale-and-distance bias conditions attention-free feature aggregation and next-node compatibility,
  with three-stage varying-size training and separate problem-specific routing models; inference adapts features
  without updating network weights.
figure:
  path: paper-assets/icam/framework.png
  alt: Scale and node distances produce an adaptation-bias matrix used by attention-free modules and final compatibility
    in an encoder-decoder routing constructor.
  caption: 'Figure 2: ICAM conditions neural aggregation and compatibility on instance scale and pairwise costs.'
  source_url: https://arxiv.org/pdf/2405.01906v3#page=5
publication:
  date: 2026-07
  source_url: https://api.crossref.org/works/10.1109/TITS.2026.3674538
---
# Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver

> **TL;DR:** Insert a learned `−alpha × log2(N) × distance` bias into attention-free feature aggregation and next-node compatibility, and train with warm-up, varying-size and elite-trajectory stages. “Adaptation” here means recomputing features/biases for each instance with **fixed inference weights**. Four separately trained models cover TSP, CVRP, ATSP and CVRPTW; multi-greedy/augmentation budgets remain distinct from single-trajectory decoding.

## Motivation

A100-node-trained constructor can deteriorate when instance size and pairwise-cost statistics change. ICAM studies incorporating explicit scale/cost information throughout encoding and decoding, together with varying-scale RL training. Node count is a density proxy under controlled spatial domains; it is not a complete description of geographic density, congestion or future service demand. The tested cases include random routing problems and real road-network costs, rather than an online traffic-prediction system. [SectionsI–III.](https://arxiv.org/pdf/2405.01906v3#page=1)

## Contributions

- A simple learned bias combines pairwise cost with logarithmic instance size.
- The Adaptation Attention Free Module (AAFM), based on AFT-full, replaces multi-head attention in the encoder and decoder, while the same bias form is used in output compatibility.
- Three-stage training combines fixed-size warm-up, random sizes100–500 and a top20-trajectory auxiliary objective.
- Evaluation distinguishes single trajectory, multiple greedy starts, eightfold augmentation and optional classical2-opt, across four tasks and synthetic/public/OSM datasets.

## Methodology

### What adapts to an instance

The bias is `f(N,d_ij) = −alpha log2(N)d_ij`. Separate trainable coefficients are used at encoder/decoder modules; AppendixA shows14 coefficient curves for the12-layer TSP/CVRP models. They are learned offline with other weights. At test time, new distances and N generate new bias matrices; there is no active-search gradient adaptation or updated checkpoint. The formula alone does not learn unknown travel times. [Equation1/AppendixA.](https://arxiv.org/pdf/2405.01906v3#page=4)

AAFM computes a sigmoid-gated query multiplied by a cost-biased, elementwise-key-weighted average of values:

`sigmoid(Q) * { exp(A) @ [exp(K) * V] } / { exp(A) @ exp(K) }`.

Masking excludes visited or otherwise infeasible choices. The final compatibility adds the current-to-candidate adaptation bias before tanh clipping and softmax. Thus both learned embeddings and explicit geometry/cost priors guide sequential node selection. Standard vanilla attention lacks this supplied cost bias, but MHA can incorporate one: the paper's own ICAM-MHA comparison explicitly does so. AAFM is not a proof that attention cannot represent distances. [Equations2–6/13/Figures2–4.](https://arxiv.org/pdf/2405.01906v3#page=5)

The NxN cost/bias matrix remains dense. Under the reported N-start multi-greedy regime, TableXIII gives **O(N³) time and O(N²) space**, the same asymptotic orders as the listed POMO baseline, with lower measured constants/memory. “Attention free” therefore does not mean linear total routing complexity or unlimited scalability.

### Problem-specific architectures and training

TSP/CVRP/CVRPTW use POMO-style128-dimensional embeddings, feed-forward width512,12 encoder layers and output clipping50. CVRPTW adds demand and time-window features, plus current service time and remaining capacity in the decoder context. ATSP instead adapts MatNet, with separate six-layer row/column streams. Its initial tokens contain the50 smallest outgoing/incoming cost values, while the full cost matrix still enters aggregation and next-node scoring. These are distinct models/checkpoints, supporting **specialist/constructive** classification. [SectionIV-B/TableIII.](https://arxiv.org/pdf/2405.01906v3#page=7)

Each training instance produces N starting-point trajectories and a shared mean-reward baseline. Stage1 uses100-node instances for100 epochs,1,000 batches per epoch: batch256 for(A)TSP and128 for CVRP(TW), or25.6M/12.8M instance presentations. Stage2 samples N uniformly from100–500, with batch size approximately160(100/N)² for(A)TSP or128(100/N)² for CVRP(TW); capacity is sampled50–100. Stage2 epochs are2,200TSP,700CVRP/TW and100ATSP. Stage3 adds200 varying-size epochs with learning rate.00001 and an auxiliary loss on the best20 trajectories weighted.1. Total epochs are2,500/1,000/400/1,000; Adam initially uses.0001. [SectionIII-C/TableIII.](https://arxiv.org/pdf/2405.01906v3#page=6)

The joint objective reinforces elite sampled trajectories using the shared advantage. It does not turn the network into a solution-editing policy. The main constructor has no learned incumbent-revision operator. Optional classical2-opt after construction is reported separately and does not change the neural paradigm classification.

## Experiments

### Main result budgets and negative cases

Synthetic tests generally contain10,000100-node instances and128 larger instances. Neural experiments use one RTX3090/24GB. Main TableIV times are **total test-set inference times**; smaller test sets explain some non-monotone total runtimes with increasing N. Benchmark tables and the OSM study instead give mean time per instance. Classical methods run on a single CPU, so the paper explicitly cautions against direct hardware speed comparisons. Asterisked baseline results are borrowed from their source papers. [SectionIV/TablesIII–IX.](https://arxiv.org/pdf/2405.01906v3#page=7)

| Task/size | Single trajectory | Multiple greedy starts | Eightfold augmentation |
| --- | --- | --- | --- |
| TSP1K |2.931% /2s |1.907% /28s |1.581% /3.8min |
| CVRP1K |5.070% /2s |3.577% /35s |3.091% /4.5min |
| ATSP1K |— |14.994% /34s |not used |
| CVRPTW1K |— |4.834% /1.1min |4.560% /8.5min |

These are gaps and whole-set times for128 instances. TSP/CVRP/ATSP use the stated LKH references, while CVRPTW and real-data results use HGS references as shown in their tables. Heuristic-reference gaps are not certificates of optimality. For example, HGS has negative CVRP gaps versus the LKH reference without being “better than the true optimum.”

The large-size neural comparison is favorable, but not every small-size result is best. At100 nodes, augmented ICAM TSP.148% is worse than POMO.134%; CVRP1.442% is worse than POMO.689%; ATSP4.782% is worse than MatNet's128-sample.385%; and CVRPTW5.579% is worse than ReLD-MoE4.341%. Budgets differ, especially MatNet's sampling and runtime, and quality/time trade-offs should remain visible. [TableIV.](https://arxiv.org/pdf/2405.01906v3#page=8)

### Distribution and benchmark coverage

Rotation/explosion tests use1281K instances per group. Augmented ICAM gaps are9.34/9.86% TSP and6.28/6.79% CVRP. Omni-VRP's borrowed runtime is proportionally rescaled from1,000 to128 instances; it is not a fresh measurement on precisely this batch. These finite shifts do not establish universal distribution robustness. [TableV.](https://arxiv.org/pdf/2405.01906v3#page=9)

TSPLIB evaluates70 instances up to5K, stratified48/15/4/3 by size. Augmented ICAM gaps are4.00/11.52/8.86/14.01%; SL-based LEHD/BQ are stronger in the smaller strata. Set-X covers100 instances up to1K with4.28% augmented aggregate gap/.6s mean time. Set-XXL covers **only four instances from3K–7K**, with11.52% augmented aggregate gap/253s mean time. Unaugmented ICAM is worse than ELG on Antwerp2,21.66vs17.69%, despite the prose's broad “consistently outperforms” language. [TablesVI–VIII.](https://arxiv.org/pdf/2405.01906v3#page=9)

### Real road-network costs

The OSM study uses eight cities across four continents,128 instances at100 and500 customers per city. Models are trained on synthetic uniform instances and tested without fine-tuning, all using eightfold augmentation. HGS with a10-minute budget supplies reference routes. ICAM's displayed gaps range5.441–9.099%, with mean amortized times.009s at100 and.28s at500. The release reads both node coordinates and stored road-cost matrices; route objectives sum the stored matrix entries. For model bias, that matrix is divided by its instance maximum and multiplied bysqrt(2). This is genuine matrix-cost evaluation, rather than treating an OSM screenshot as evidence of road costs. It remains an offline benchmark, without an operational dispatch or congestion-response deployment test. [TableIX/AppendixC.](https://arxiv.org/pdf/2405.01906v3#page=10)

### Architecture, training and search evidence

AAFM improves TSP1K multi-greedy gap/time1.907%/28s versus a matched ICAM-MHA2.593%/1.5min. Adding classical2-opt with a1,000-iteration cap improves augmented TSP1K1.581→1.327% with3.8→4minutes whole-set time; most runs stop within100 iterations. GANCP's best of five candidates gives5.69% Set-X gap/20.5s versus augmented ICAM4.28%/.6s, under that specific baseline configuration. [TablesX–XII.](https://arxiv.org/pdf/2405.01906v3#page=11)

Matched200-epoch varying-scale comparisons reduce TSP1K gaps to11.620% POMO,6.953% ELG and4.382% ICAM; the main ICAM result uses substantially more training. Removing the scale term gives4.236%, removing learnable alpha5.232%, and using both gives1.907%. AAFM without compatibility bias gives2.241%; the full combination gives1.907%. These support both training and instance-conditioning contributions. [TablesXIV–XVI.](https://arxiv.org/pdf/2405.01906v3#page=16)

Improvements are not monotone at every size: stage2 worsens TSP100.514→.662%, before stage3 improves to.462%; the six-layer model's.442% beats twelve-layer.462% at100 nodes, while losing at1K. POMO plus adaptation/three-stage training improves1K greatly but worsens100-node.365→2.929%. Heatmap similarity and alpha curves are illustrative, not independent statistical or causal guarantees. [TablesXVII–XIX/Figures6–9.](https://arxiv.org/pdf/2405.01906v3#page=17)

## Limitations

### Discussed in the Paper

Future work includes using ICAM as a repair operator, improving augmentation and extending conditioning to more constraints or nongeometric problems. These are proposed directions rather than already evaluated neural improvement operators. Small-size baselines and some SL methods retain quality advantages, and CPU/GPU time comparisons require care.

### Curator Notes

- Main task-specific training reaches100–500 nodes and uses different epoch budgets. Cross-size reuse of one task's checkpoint is distinct from sharing one checkpoint across four tasks.
- Full pairwise matrices, N starts and cubic multi-greedy runtime still limit scale. Set-XXL contains four cases, and its hardest augmented average exceeds four minutes per instance.
- The short OSM times are batch-amortized averages with residual reference gaps, not end-to-end dispatch guarantees. Traffic-state language should not imply learned live congestion or online weight adaptation.
- The release initializes alpha at1 as an unconstrained parameter; it does not enforce the paper's mathematical alpha>0 assumption through a positive reparameterization. Plotted learned values are empirical, not a positivity guarantee for arbitrary retraining.
- Exponential AAFM arithmetic can overflow/underflow. The active implementation repairs infinities/NaNs with `nan_to_num`; a more stable shifted-exponential alternative is commented out. Numerical repair is not exact preservation of the ideal formula in every extreme case.
- Independent-training-seed confidence intervals are not supplied for every comparison. Cosine similarity1 implies parallel embeddings, not necessarily identical vectors; visual similarity to distance structure does not alone prove causation for generalization.

## Reproducibility

- **Reading/version:** all19 pages of arXivv3 dated28June2026, comprising15 main/reference/biography pages and the explicitly labelled four-page scientific supplement with AppendicesA–D, freshly read. Main architecture/formulas, all19 tables, learned-bias curves, geographic visualizations and16-panel similarity figure were inspected; key pages were rendered for visual verification.
- **Formal metadata:** the first page explicitly identifies this as the authors' self-archived accepted version and links the formal DOI. Six authors, Zhou/Lin co-first credit, SUSTech/Xi’an Jiaotong/Huawei Noah’s Ark/CityU affiliations were checked. Crossref identifies IEEE T-ITS27(7):8270–8284, July2026, so `publication.date` retains the evidenced **2026-07** month precision. The separate `date` field is **2024-05-03**, the primary arXivv1 submission date; no exact formal publication day is inferred. ArXiv history separately verifiesv1 on3May2024,v2 on19May2025 andv3 on28June2026; the old year-only acceptance claim was removed.
- **Scientific inventory:** IEEE document access returned202 with an empty body, disclosed rather than treated as a readable publisher page. The identified reading version includes all namedA–D scientific supplement pages. The actual56-entry official repository tree contains no extra PDF/TEX/notebook/ZIP, and its single architecture PNG matches Figure2. README cloud links are labelled datasets. No unavailable separate publisher file was claimed as read.
- **Implementation:** official README and selected complete model/trainer/environment/configuration blocks were read. They confirm first-node multistarts, fixed inference parameters, dense bias matrices, separate alpha values, top20 auxiliary loss,2500-epoch TSP entry configuration, seed3407, ATSP sorted50-cost features and CVRPTW demand/time features. The real-world environment uses supplied cost matrices and demand/capacity normalization. Full training and benchmark runs were not repeated.
- **Version/identity:** actual numbered references and the full80-entry bibliography were checked. DAR retains the cited2024 preprint title; RRNCO retains the cited2025 six-author title on the same arXiv version chain. SIL is explicitly the formal2025 Boosting work. T2T's printed NeurIPS2023 attribution is a source-reference error, not evidence for a different work.
- **Figure:** original complete Figure2, PDFpage5, cropped from the identified author manuscript. [Official implementation](https://github.com/CIAM-Group/ICAM); [formal article](https://doi.org/10.1109/TITS.2026.3674538).
