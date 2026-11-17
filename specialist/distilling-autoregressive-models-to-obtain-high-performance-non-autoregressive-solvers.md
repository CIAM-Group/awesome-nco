---
id: distilling-autoregressive-models-to-obtain-high-performance-non-autoregressive-solvers
short_title: GNARKD
title: Distilling Autoregressive Models to Obtain High-Performance Non-autoregressive Solvers for Vehicle Routing
  Problems with Faster Inference Speed
authors:
- Yubin Xiao
- Di Wang
- Boyang Li
- Mingzhao Wang
- Xuan Wu
- Changliang Zhou
- You Zhou
year: 2024
date: '2023-12-19'
publication:
  date: '2024-03-24'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/30008
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/30008
institutions:
- Jilin University
- Nanyang Technological University
- Southern University of Science and Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: Guided knowledge distillation converts separately trained AM, POMO and Transformer teachers into parallel
  successor-score students, decoded with classical feasibility masks and greedy/beam search. The measured latency
  gains depend on batching and inference budget; CVRP quality losses can exceed the abstract averages.
arxiv_url: https://arxiv.org/abs/2312.12469
code_url: https://github.com/xybFight/GNARKD
figure:
  path: paper-assets/distilling-autoregressive-models-to-obtain-high-performance-non-autoregressive-solvers/framework.png
  alt: Autoregressive teacher and non-autoregressive student with copied encoder initialization, fixed node queries
    and guided distribution distillation.
  caption: 'Original Figure 2: GNARKD architecture and guided distillation.'
  source_url: https://arxiv.org/pdf/2312.12469v2#page=4
---

# GNARKD: Distilling Autoregressive Models into Non-Autoregressive Vehicle-routing Solvers

> **TL;DR:** GNARKD transfers an autoregressive teacher's masked next-node distributions to a student that predicts all successor scores in parallel. Feasible tours still require sequential classical decoding. It is **specialist/constructive**: AM, POMO and Transformer students are separate models, and TSP/CVRP are not demonstrated with one shared checkpoint.

## Motivation

Autoregressive routing networks repeatedly invoke their decoder, whereas parallel edge-score models can sacrifice tour quality. GNARKD combines a teacher's sequential guidance with a static student score matrix. Its motivating confidence visualization compares TM and GCN on one random TSP50 instance; this is an illustrative probability-distribution observation, not a calibration study or a proof that confidence causes better routes. [Motivation.](https://arxiv.org/pdf/2312.12469v2#page=3)

## Contributions

- A conversion recipe replaces history-dependent decoder queries with fixed node/placeholder queries, removes positional encoding and removes visited-node masking from the student's final neural attention layer.
- Guided distillation gathers student predictions along the teacher's greedy tour and applies the teacher-prefix feasibility mask during learning.
- A classical decoder enforces visited-node and capacity constraints when constructing TSP/CVRP routes from the fixed score matrix.
- Three separately distilled architecture families are evaluated on synthetic instances and a small TSPLIB sample, with latency, batching and memory-capacity comparisons. [Figure2 and sections4-5.](https://arxiv.org/pdf/2312.12469v2#page=4)

## Methodology

### Parallel student and feasible decoding

The encoder architecture is retained and student encoder parameters are initialized from the teacher. This does **not** imply frozen shared weights: the inspected released training script optimizes all student parameters. A learned linear transformation builds queries from every node embedding and a placeholder/depot, producing an(n+1)-by-n successor-score matrix in one neural forward pass.

Greedy or beam search then constructs a complete route with visited-node exclusion. For CVRP, customers exceeding remaining capacity are masked and a depot visit resets capacity. Thus parallel neural scoring does not eliminate sequential feasibility processing, and the static matrix is not an exact representation of every possible capacity-dependent autoregressive policy. [Equations3-11.](https://arxiv.org/pdf/2312.12469v2#page=4)

### Guided knowledge distillation

The teacher greedily supplies the sequence and conditional target distributions. The student selects the corresponding score-matrix row at each teacher prefix, masks invalid choices, and uses a teacher temperature of.1 and student temperature1. The objective is described as teacher-to-student KL divergence. The last line of printed Equation6 instead contains a logarithm of a probability **difference**, which is not that KL expression. The released POMO/TSP training path uses `nn.KLDivLoss` with student log-softmax inputs and teacher probabilities, consistent with the stated KL objective rather than the printed log-difference. This note follows the intended objective and records the notation issue. [Guided distillation.](https://arxiv.org/pdf/2312.12469v2#page=5)

## Experiments

### Training and timing protocol

Each epoch generates1,000batches of100instances on the fly; training lasts500epochs for50nodes and1,000epochs for100nodes, with Adam at1e-5. These are separately trained teacher/student, task and size settings. Hardware is an Intel i5-11400F and RTX3060Ti with8GB GPU memory. Each synthetic comparison uses10,000test instances.

The paper separately reports **single-instance latency** and **total time for10,000instances at the largest feasible batch size of each model**. They are different measurements: multiplying the former by10,000 does not recover the latter. Table1 averages speedup to4.42x single/52.77x total for50nodes and6.03x/50.59x for100nodes, with respective average learning gaps1.61%/3.25%. These averages are not uniform bounds. CVRP100 AM greedy loses12.03% relative to its teacher, while selected beam-search TSP students slightly improve on their teachers. [Training/Table1.](https://arxiv.org/pdf/2312.12469v2#page=6)

### Quality depends on the task and search budget

In Table2, GNARKD-TM with beam width2,000 obtains TSP100 gap.42%, single latency.078s and total71.7s; the TM comparison is.44%,1.36s and12,200s. For CVRP100, however, GNARKD-AM beam2,000 has7.51% gap against AM3.43%, and GNARKD-POMO's1,000-sample result has3.80% against augmented POMO.69%. The abstract's2-3% performance-drop description should not replace these task-specific comparisons.

Concorde is an exact TSP reference. LKH3, labelled an exact solver in the table, is a heuristic CVRP reference; a gap relative to it is not a certified gap to the optimum. [Complete comparison and speed curves.](https://arxiv.org/pdf/2312.12469v2#page=7)

### Generalization, capacity and ablations

Table3 averages20randomly selected TSPLIB instances with51-159nodes; individual instances/results are not enumerated. For GNARKD-TM beam2,000, average gap/time are3.89%/.076s versus TM5.17%/1.565s. Greedy GNARKD-TM is faster but worse in quality(11.92% versus8.60%). POMO remains more accurate than its student in both reported augmentation protocols. Concorde obtains zero gap in.178s on this selected small-instance set.

The reported maximum TSP size of9,000 for GNARKD-POMO versus1,000 for POMO concerns **GPU memory feasibility**, not a9,000-node quality benchmark. The figure's850-node POMO limit and prose1,000-node limit are not fully reconciled by a common protocol. The augmented case reports3,100 versus500. Speed curves repeat timings100times; no multiple-training-seed confidence intervals are given.

Low teacher temperatures improve the tested students. In the matched TSP50 beam1,000 experiment, guided KD gaps(.36% AM,.01% TM,.05% POMO) beat the displayed supervised/RL training alternatives. The confidence heatmaps are single-instance observations; high probabilities do not certify calibration or optimality. [Tables3-4/Figures4-5.](https://arxiv.org/pdf/2312.12469v2#page=8)

## Limitations

Student quality is limited by its teacher and the static representation; the conclusion explicitly identifies complex constraints as a weakness and direct neural constraint modelling/multiple teachers as future work. Distinct teacher architectures and tasks require distinct training. The experiments do not demonstrate warehouse deployment, MAPF, arbitrary constraint generalization or a common checkpoint across routing problems. Larger feasible tensors alone do not establish good large-instance solutions.

The speed/quality balance changes with greedy versus beam decoding, augmentation and model-specific batching. No theorem establishes an approximation guarantee. The probability-confidence motivation and printed KL notation should be interpreted with the qualifications above. Training and benchmark runs were not independently reproduced.

## Reproducibility

- Formal AAAI2024 DOI10.1609/aaai.v38i18.30008, pages20274-20283, was published2024-03-24 according to the publisher. Seven-author manuscript affiliations identify Jilin University, NTU and SUSTech; no corresponding-author designation is invented. The arXiv first submission is2023-12-19, independently distinguished from formal publication.
- **All11pages of arXiv2312.12469v2(2024-01-18), including every reference, were fully read.** The official README directs readers to the arXiv version for all content. The ordinary formal-PDF request returned HTML and was not registered as a PDF. No unread formal pages are claimed as read.
- The official repository at SHA4cd60e77a6289c3adc627f5ac2a0bed38be26a53 has87entries. Its full README, file inventory and empty releases were checked. No separate scientific proof/appendix PDF, TeX source or ZIP is listed. The8-page `AAAI24_Comments.pdf` was **fully read**: it contains reviewer reports, not author corrections or an extra proof. Vague reviewer references to theoretical evidence do not establish an independently retrievable supplement; the actual complete reading version provides no such theorem.
- The three teacher codebases are linked by the README. Branches separate AM/POMO/TM and TSP/CVRP; teacher weights must be obtained from the original projects. Relevant student initialization, optimizer, masking and KL inputs were inspected without claiming an end-to-end reproduction.
- Original Figure2 is cropped from arXiv PDFpage4, rectangle(50,49,563,345), at4x and actually viewed. Confidence heatmaps, the printed KL equation and all result tables/plots were rendered and visually inspected.
- Internal relationships are restricted to explicit in-text citations with matching full bibliography entries. Uncatalogued teacher manuscripts and independent journal extensions are not forced onto similarly named conference records.
