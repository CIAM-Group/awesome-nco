---
id: cross-problem-learning
short_title: Cross-Problem Learning
title: Cross-Problem Learning for Solving Vehicle Routing Problems
authors:
- Zhuoyi Lin
- Yaoxin Wu
- Bangjian Zhou
- Zhiguang Cao
- Wen Song
- Yingqian Zhang
- Senthilnath Jayavelu
year: 2024
date: '2024-04-17'
venue: IJCAI
paper_url: https://ijcai.org/proceedings/2024/769
code_url: https://github.com/Zhuoyi-Lin/Cross_problem_learning
arxiv_url: https://arxiv.org/abs/2404.11677
institutions:
- Institute for Infocomm Research, A*STAR
- Eindhoven University of Technology
- Unidt
- Singapore Management University
- Shandong University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Orienteering Problem
- Prize-Collecting Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: TSP pretraining initializes separately fine-tuned OP, PCTSP and CVRP constructors using full training or
  task adapters; transfer improves several quality/parameter tradeoffs but does not produce one unchanged cross-task
  solver.
figure:
  path: paper-assets/cross-problem-learning/framework.png
  alt: Original Figure1 compares a TSP Transformer and an OP Transformer with additional task feature layers.
  caption: 'Figure 1: task-specific modularization for transferring TSP pretrained weights to OP.'
  source_url: https://ijcai.org/proceedings/2024/0769.pdf#page=3
publication:
  date: '2024'
  source_url: https://ijcai.org/proceedings/2024/769
---

# Cross-Problem Learning for Solving Vehicle Routing Problems

> **TL;DR:** Pretrain an attention routing model on TSP, then separately fine-tune a full model or small adaptation modules for each downstream problem. The contribution is efficient transfer into specialist solvers, rather than one unchanged solver handling every task.

## Motivation

Related routing tasks share coordinates and geometric structure, yet are commonly trained from scratch. The paper asks whether TSP representations can reduce the cost and improve the outcome of training OP, PCTSP and CVRP policies (Sections 1–3).

## Contributions

- Separate the TSP backbone from feature-processing modules for downstream tasks, such as depot coordinates, prizes, penalties and remaining-resource context.
- Compare full fine-tuning with inside adapters, a side network and rank-two LoRA adjustments.
- Evaluate transfer with AM and POMO backbones, a Gaussian-distribution training experiment and selected CVRPLIB instances.

## Methodology

**Transfer workflow.** Pretrain a TSP Transformer with REINFORCE. For each target task, load the TSP weights, initialize task-specific feature layers and train a separate target policy. Full fine-tuning updates the backbone and added layers. Adapter variants aim to reuse frozen pretrained components while learning target-specific modules; these modules still require downstream optimization. The resulting masked autoregressive policies construct routes. Freezing part of a shared backbone does not establish that one complete trained checkpoint solves all tasks, so the collection classifies this work as **specialist, constructive**.

**Adaptation mechanisms.** Inside tuning inserts two-layer LeakyReLU adapters after attention/feed-forward components. Side tuning adds a separate shallow attention/feed-forward path to the backbone output. LoRA adds rank-two updates to encoder query/key/value projections and the initial projection. The study compares these alternatives rather than jointly composing all three. The OP description inconsistently calls its dynamic feature remaining length and total collected prize; these are different quantities and should not be conflated (Section 4; Figure 1).

## Experiments

- **AM transfer:** Uniform OP and PCTSP at 20/50/100 customers, with unit OP prizes. Train target models for 100 epochs with 2,500 batches per epoch, batch 512 except 256 at size 100, learning rate 1e-4 and 10,000 validation instances. Test 10,000 instances per setting; the proposed main results use best-of-1,280 sampling. Reported runtimes are totals across the test set, not per-instance latencies. Hardware is an i9-10940X and RTX 2080Ti (Section 5).
- **Quality and parameters:** At OP100, full fine-tuning reduces the AM sampling gap from 1.62% to 0.79%, with the same reported 19-minute total runtime; inside tuning gives 0.99%. At PCTSP100, gaps are 1.67%/1.00%/1.34% for AM/full/inside. Gains are not universal: at OP20, full fine-tuning gives 0.76% versus AM sampling's 0.71%. Specialized Compass/ILS provide stronger reference solutions on several settings. The 198K/199K adapter counts versus 694K full-model counts concern **trained parameters**, with the reused backbone still needed at deployment (Table 1).
- **POMO transfer:** Separately fine-tune TSP-pretrained POMO on CVRP20/50/100 for 100 epochs, 100,000 instances per epoch and batch 64; use learning rates 1e-4 at size 20 and 1e-5 at 50/100. Evaluate with and without eightfold augmentation. At CVRP100 with augmentation, reported gaps are 0.06% for scratch POMO, 0.00% for full transfer and 0.39% for inside tuning. These gaps use the best compared solutions as reference, so 0.00% does not certify optimality. Full/inside/LoRA report 1.254M/0.256M/0.122M trainable parameters (Table 2).
- **Additional tests:** Appendix B fine-tunes on Gaussian OP50/PCTSP50 after uniform TSP pretraining; it demonstrates transfer during training, not unchanged-model zero-shot distribution transfer. Its text says “side tuning” where Figure 5 labels the successful curve “Inside tuning.” Appendix D lists 19 CVRPLIB instances of 101–1,001 nodes. Full transfer improves many results but not every row; adapters can deteriorate strongly on larger instances. These selected instances do not establish universal large-scale performance (Tables 3–4).

## Limitations

Each downstream problem requires training its own full weights or adaptation modules. Task and size diversity is limited; job-shop scheduling and bin packing are future work, and the paper does not evaluate VRPTW. The study reports selected training curves and empirical comparisons, not a general transfer or optimality guarantee. Pretraining cost, target training, sampling/augmentation and the retained backbone must be included when comparing efficiency.

**Current implementation qualification:** The released `run.py` freezes the original encoder and coordinate projection according to adaptation mode, but leaves decoder parameters trainable. Thus a blanket statement that every pretrained backbone parameter is frozen does not describe that code. The README's OP training examples also omit `--problem op`, while `options.py` defaults to TSP; its inside-adapter default activation is tanh, so the reported LeakyReLU setting needs an explicit option. These are reproducibility qualifications to the current release, not a rerun of the published experiments.

## Reproducibility

- **Sources:** Freshly read all nine formal IJCAI pages (6958–6966) and all twelve pages of arXiv 2404.11677v3 (18 June 2024), including Appendix A–D and the complete bibliographies. The formal paper explicitly points to the arXiv version for its appendix; the current official proceedings page links no separate supplement. Versions and hashes are registered independently.
- **Metadata:** The official proceedings record confirms seven authors and five affiliations: A*STAR's Institute for Infocomm Research, Eindhoven University of Technology, Unidt, Singapore Management University and Shandong University. The previous NTU-only affiliation was incorrect. The first arXiv submission is 17 April 2024; formal publication is recorded at year precision. A conference-calendar acceptance date is removed.
- **Code:** [Zhuoyi-Lin/Cross_problem_learning](https://github.com/Zhuoyi-Lin/Cross_problem_learning) is linked in the paper. README, configurations and relevant model/loading/freezing sections were inspected; the root includes checkpoint, problem, utility and network folders. The GitHub tree API was unavailable during this check, so a recursive supplementary-file inventory is not claimed. No training or optimization experiment was rerun.
- **Figure/relations:** The original Figure 1 is reproduced from formal PDF page 3 with both TSP and OP panels and the caption. Exact named citations are matched to existing stable IDs; the OP solver named Compass is a classical evolutionary method and is not the unrelated COMPASS neural solver.
