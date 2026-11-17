---
id: asp
short_title: ASP
title: 'ASP: Learn a Universal Neural Solver!'
authors:
- Chenguang Wang
- Zhouliang Yu
- Stephen McAleer
- Tianshu Yu
- Yaodong Yang
year: 2024
date: '2023-03-01'
venue: IEEE TPAMI
paper_url: https://doi.org/10.1109/TPAMI.2024.3352096
arxiv_url: https://arxiv.org/abs/2303.00466
code_url: https://github.com/LOGO-CUHKSZ/ASP
institutions:
- The Chinese University of Hong Kong, Shenzhen
- Carnegie Mellon University
- Peking University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Split Delivery Vehicle Routing Problem
- Prize Collecting Traveling Salesman Problem
- Stochastic Prize Collecting Traveling Salesman Problem
summary: ASP alternates adversarial distribution exploration with adaptive size curricula to train separate constructive routing solvers; a selected checkpoint covers multiple sizes within a task, with model-capacity and training-budget qualifications.
figure:
  path: paper-assets/asp/framework.png
  alt: ASP evaluates a solver and switches between PSRO-based distribution exploration at a larger size and persistent training on previous sizes.
  caption: 'Figure 1: ASP training pipeline; the selected task-specific solver is used at inference.'
  source_url: https://arxiv.org/pdf/2303.00466v1#page=4
publication:
  date: 2024-06
  source_url: https://doi.org/10.1109/TPAMI.2024.3352096
---
# ASP: Learn a Universal Neural Solver!

> **TL;DR:** ASP is a **training framework** that alternates adversarial distribution exploration and an adaptive curriculum over instance sizes. It can produce one selected AM/POMO checkpoint covering several sizes **within one routing task**. The experiments train each task from scratch; they do not demonstrate one checkpoint for all tasks. The AM comparisons also change depth and training epochs, so their full gains cannot be attributed solely to the curriculum.

## Motivation

A constructive neural solver trained at one size on uniform coordinates can deteriorate under distribution or size changes. Training separate policies for every size increases storage and training cost, while indiscriminately mixing tasks can destabilize optimization. ASP uses measured performance to decide when to advance to a larger instance size and when to revisit previous sizes. Here, curriculum tasks usually mean **sizes**, rather than different COP types. [Sections 1/4.](https://arxiv.org/pdf/2303.00466v1#page=1)

## Contributions

- Distributional Exploration (DE) trains a solver and an adversarial coordinate generator in a two-player empirical zero-sum game.
- Persistent Scale Adaption (PSA) revisits sizes using a mixture of recent performance deterioration and historical variability.
- An adaptive staircase switches between DE at a new size and PSA over previously introduced sizes.
- Tests AM and POMO on several routing tasks, with distribution/size generalization, capacity ablations and parameter-landscape visualizations. The word universal describes this within-task generalization objective. [Sections 2/4/5.](https://arxiv.org/pdf/2303.00466v1#page=3)

## Methodology

### Distributional exploration

At a fixed size, maintain populations of solvers and instance distributions. The solver selector minimizes expected reference-relative gap, while the generator maximizes it. PSRO repeatedly trains approximate best responses, expands the empirical payoff matrix and computes a meta-strategy. A five-coupling-layer **Real-NVP normalizing flow** transforms uniform coordinate samples, allowing a tractable density for a likelihood-ratio generator gradient. Demands, capacities, prizes and penalties retain task-specific generation rules; the adversary principally changes coordinates. [Equations 3-10/Algorithm 1/Appendices A-B.](https://arxiv.org/pdf/2303.00466v1#page=4)

The exact formal objective invokes a reference solver. Solver training can use ordinary routing cost when repeated reference evaluations are impractical, while payoff evaluation still needs a reference or approximation. The official README specifically requires LKH/OR-Tools setup. A Nash mixture in this **finite empirical game** does not certify robustness to every possible distribution. After DE, the framework selects a best solver and retains a mixture of generated distributions for later training.

### Persistent size adaptation

PSA samples among previously introduced sizes. One component emphasizes positive increases in recent evaluation cost; another uses the square root of historical cost variance, with a ten-step history. Their mixture weight is **lambda=.5**. If the current solver passes a task-specific gap threshold, the staircase introduces a larger size; otherwise PSA trains over earlier sizes. Patience is five iterations. These operations update solver weights during training, rather than adapt a solver online separately for every test instance. [Equations 11-12/Algorithms 2-3.](https://arxiv.org/pdf/2303.00466v1#page=5)

Nominal sizes are 20 through 100 in steps of 20. Algorithm 3 prints a strict new-size comparison **n'<nK**, while the inspected current `game_utils.py` permits **n'<=nK**; the implementation includes the configured final size. This boundary difference should not be used to infer that every experiment is transfer from training sizes strictly below 100.

### Solver and task scope

The study covers **TSP, CVRP, SDVRP, PCTSP and stochastic PCTSP**. It uses AM/POMO for TSP and CVRP, and AM for the other tasks. The paper explicitly says training starts from scratch for different base-solver/task combinations. A chosen checkpoint is reused over sizes for its task; separate solvers/populations are trained across task types. [Table 1 and Section 5.1.](https://arxiv.org/pdf/2303.00466v1#page=6)

Classification remains **specialist / constructive**. The evaluated base solvers build a feasible solution autoregressively. PSRO population expansion, neural parameter updates and curriculum refinement are training operations; they are not learned moves editing an incumbent tour. The main test results use the selected solver, rather than necessarily evaluating the whole PSRO population on every instance. Current code also contains additional adapters; their presence is not evidence of additional evaluated task types.

## Experiments

### Training, capacity and inference budgets

All reported training runs use one **RTX 3090**. POMO TSP/CVRP training takes about **1.67/2.25 days**, AM TSP/CVRP about **4/3.3 days**, and other AM tasks about two days with early stopping. Flow training uses Adam at 1e-4 for 100 epochs when invoked. The method adds generator training and payoff-matrix evaluation to ordinary solver training. [Section 5.1.](https://arxiv.org/pdf/2303.00466v1#page=6)

Appendix B lists **AM: nine encoder layers, batch 512, 1.28 million samples; POMO: six layers, batch 64, 100,000 samples**, with a reported total of 600 training epochs. Crucially, the main AM baseline uses the original **three-layer/100-epoch** author checkpoint, while AM(ASP) uses nine layers/600 epochs. The deeper, longer-trained uniform AM ablation performs poorly, but this does not make the main comparison an isolated curriculum ablation. POMO is described as trained under matched configurations. The branch-dependent five-DE/one-PSA schedules and table-level total should be retained as reported rather than conflated into a simple uniform per-iteration budget. [Table 5/Appendix C.](https://arxiv.org/pdf/2303.00466v1#page=13)

Generated tests perturb coordinates with mixed Gaussian noise and normalize them. The text describes 10,000 TSP instances in ten groups, CVRP evaluation size 128 and PCTSP/SPCTSP size 1,000. Demands/prizes retain problem-specific rules. Table 2 evaluates sizes 20/50/100; Figure 9 also covers intermediate sizes 30-90. Current saved POMO configuration enables **eight augmentations**; the paper's table does not fully specify a uniform decoding budget across all methods. Keep printed times with their model, task and test-count context. [Sections 5.1-5.2/Appendix D.](https://arxiv.org/pdf/2303.00466v1#page=7)

### Generated-data results and exceptions

| Task/backbone | Mean gap before ASP | Mean gap after ASP | Qualification |
| --- | --- | --- | --- |
| TSP / AM | 41.67% | 3.79% | Major shift robustness gain, with changed depth/epochs |
| TSP / POMO | 1.09% | .78% | About 28.4% reduction from displayed means; worse at sizes 20 and 50 |
| CVRP / AM | 11.72% | 9.49% | Worse at size 20: 5.72% to 9.48% |
| CVRP / POMO | 1.53% | 1.47% | Small mean gain, about 3.9%; worse at size 20 |
| SDVRP / AM | 17.52% | 11.18% | Worse at size 20: 6.20% to 13.32% |
| PCTSP / AM | 16.69% | 11.32% | Worse at size 20: 2.88% to 12.05% |
| SPCTSP / AM | 17.45% | 8.86% | About 49.2% reduction; worse at size 20 |

These are the **actual arXiv-v1 Table 2** values. The paper's TSP-POMO prose says 49.4% reduction, while the displayed means imply about 28.4%; the SPCTSP prose says 29.2%, while its means imply about 49.2%. The note retains the table values and identifies the mismatch instead of repeating those percentages. Table 2 uses the **best value among compared methods** as reference; this is not automatically a certified optimum for every problem. Classical LKH/Gurobi reference rows retain stronger quality, with different runtimes. [Table 2.](https://arxiv.org/pdf/2303.00466v1#page=7)

### Public benchmarks

Table 3 contains **35 TSPLIB cases**: AM improves from **10.69% to 5.62%** mean gap; POMO improves from **3.37% to 3.23%**, versus OR-Tools 4.19%. Individual cases still deteriorate: for example POMO's pr226 cost is 81,903 versus 83,117 with ASP, and ts225 is 134,184 versus 138,846. One average gain does not imply a uniformly better solver. [Table 3.](https://arxiv.org/pdf/2303.00466v1#page=8)

On **53 CVRPLIB B/E/F/X cases**, sizes 22-181, Table 4 reports AM **10.74% to 9.88%**, POMO **6.10% to 3.32%**, and OR-Tools 9.52%. POMO(ASP) improves 37 of the 53 selected cases, leaving 16 without that improvement; AM(ASP) still has a worse average than OR-Tools. The abstract's 45.57% CVRP relative reduction corresponds to the POMO comparison, not the AM comparison. These selected public cases do not establish performance on arbitrary large-scale routing. [Table 4.](https://arxiv.org/pdf/2303.00466v1#page=9)

### Ablations and landscape evidence

Ablations use **five random seeds**, examining task-selection variability, thresholds, depth and sample count. Uniform mixed-size POMO is competitive in some settings, while uniform AM can fail. Larger sample budgets and deeper AM models help at additional compute cost. A lower performance threshold can improve results even when never reached; threshold choice remains a tuned design decision. [Figures 2-6.](https://arxiv.org/pdf/2303.00466v1#page=10)

Appendices C-F were fully read. The plots compare parameter perturbations under filter normalization and 1,000 evaluation instances, including uniform/mixed-Gaussian data and easy/median/hard subsets. Their smooth/sharp visual differences are empirical diagnostics, rather than a causal proof of robustness or optimization guarantees. Figure 10's learned densities can be extremely close to uniform, with offset/scientific-notation color bars; visually colored surfaces should not be mistaken for large density changes. [Figures 7-12.](https://arxiv.org/pdf/2303.00466v1#page=15)

## Limitations

### Reported by the Authors

- Training depends on model capacity, sample budget and threshold selection; naive mixed training can fail.
- Generator training and meta-payoff evaluation add cost, and a dynamic threshold is proposed as future improvement.
- The adversary retains standard non-coordinate task features, rather than exploring all possible demand/prize/constraint shifts. [Sections 5-6/Appendix B.](https://arxiv.org/pdf/2303.00466v1#page=13)

### Curator Notes

- The universal label does not establish shared parameters across five problems, arbitrary distributions or much larger scales.
- Main AM gains combine a different training strategy, model depth and training budget.
- Mean improvements coexist with small-size and individual public-case regressions.
- Table/prose percentage conflicts, the algorithm/code endpoint difference and incompletely specified decoding budgets require version-specific replication.
- Finite PSRO best-response training and landscape illustrations do not give a universal optimality/generalization guarantee.

## Reproducibility

- **Reading version:** all 15 pages of **arXiv v1, 1 March 2023**, were read, including scientific Appendices A-F and every final-page plot. The arXiv history lists only v1. The user authorized author-manuscript fallback; the note does not claim byte identity with the later journal PDF.
- **Formal eligibility:** Crossref's publisher-deposited record independently confirms **IEEE TPAMI 46(6), June 2024, pages 4102-4114**, DOI 10.1109/TPAMI.2024.3352096. The previous year-only acceptance field was removed because it did not establish an actual acceptance date; publication uses the evidenced month. Five authors and all three title-page institutions are retained.
- **Scientific supplement discovery:** the publisher landing request returned an empty verification response and was not treated as a successful attachment inventory. The actual arXiv manuscript contains its full A-F scientific appendices; the official 445-member repository tree and full README were manually inspected, with no separate scientific PDF/ZIP. No explicitly referenced scientific appendix remains unread.
- **Official code:** [LOGO-CUHKSZ/ASP](https://github.com/LOGO-CUHKSZ/ASP). README, configurations, saved AM/POMO arguments and relevant staircase/evaluation code were checked. They confirm separate problem/model settings, one selected `solver_param`, inclusive final-size handling and augmented POMO defaults. Scores were not retrained or independently replicated.
- **Figure:** original Figure 1, PDF page 4, cropped directly from the reading manuscript. Formulae, table values, all main ablations and appendix figures were visually inspected.
