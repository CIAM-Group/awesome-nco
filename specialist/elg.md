---
id: elg
short_title: ELG
title: Towards Generalizable Neural Solvers for Vehicle Routing Problems via Ensemble with Transferrable Local Policy
authors:
- Chengrui Gao
- Haopu Shang
- Ke Xue
- Dong Li
- Chao Qian
year: 2024
date: '2023-08-27'
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2024/764
code_url: https://github.com/lamda-bbo/ELG
institutions:
- Nanjing University
- Huawei Noah's Ark Lab
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: Jointly trains a global POMO policy and a normalized local-neighborhood policy for size and distribution
  transfer, with separate TSP/CVRP models and explicit decoding budgets.
publication:
  date: '2024'
  source_url: https://www.ijcai.org/proceedings/2024/764
arxiv_url: https://arxiv.org/abs/2308.14104
figure:
  path: paper-assets/elg/framework.png
  alt: Original ELG framework with a local-neighborhood policy, global encoder-decoder and normalized distance penalty.
  caption: 'Figure 2: Local and global policy scores are combined before feasible-action decoding.'
  source_url: https://www.ijcai.org/proceedings/2024/0764.pdf#page=4
---

# Towards Generalizable Neural Solvers for Vehicle Routing Problems via Ensemble with Transferrable Local Policy

> **TL;DR:** ELG jointly trains complementary global and local construction policies. Small normalized neighborhoods help transfer across routing sizes and distributions; TSP and CVRP use separate models, and strong classical solvers remain better on several reported comparisons.

## Motivation

Constructive neural routing policies trained on uniform 100-node instances often degrade on larger or differently distributed instances. ELG adds a locally normalized view of the current decision to a global policy, aiming to retain useful short-distance patterns without partitioning the whole instance. Its target is cross-size and cross-distribution transfer, not a jointly trained solver for arbitrary routing constraints (main Sections 1-2).

## Contributions

- Defines a local policy over the K nearest currently valid neighbors, represented relative to the current node.
- Adds its action scores to a distance-penalized global POMO policy, with joint reinforcement learning rather than independent-model voting.
- Evaluates Euclidean TSP and CVRP on selected TSPLIB/CVRPLIB instances and synthetic distribution shifts, with component and standalone-local ablations.

## Methodology

**Local state and network.** At each construction step, choose the K nearest unvisited nodes that satisfy the current feasibility constraints. Relative polar radii are divided by the largest radius in that neighborhood; CVRP demands are divided by remaining capacity. Nodes are sorted by distance and receive sinusoidal positional encodings. A shared linear layer produces node embeddings. A learned context vector queries one multi-head-attention layer, then its aggregated context scores the local nodes. Padded local states are attention-masked. The experimental local network has dimension 32 and four heads; K is 30 for TSP and 40 for CVRP (main Sections 3.1-3.2; arXiv Appendix A-B.1).

**Ensemble and feasibility.** The global network is POMO. Its scores receive a normalized distance penalty within the local neighborhood and a fixed penalty of 1 outside it. Local scores are zero outside that neighborhood; this does not prohibit the global policy from choosing a distant valid node. The two score vectors are added, clipped with `C * tanh` using C=50, masked for invalid actions and softmaxed. The ensemble is a combination within each decision, not an unspecified best-of-many collection of independent local models (main Section 3.3).

**Training and decoding.** Pretrain the penalized global policy, then jointly update both policies using REINFORCE with POMO's multiple starts and shared mean-reward baseline. The main setting uses uniform 100-node training, 1.2 million instances per epoch and batch size 120. TSP uses 30 pretraining plus five joint epochs; CVRP uses 20 plus five. Early stopping is manually chosen from 200-node validation performance. The supplementary training description also normalizes rollout advantages by their maximum. POMO-based evaluation uses greedy decoding from multiple starts and eight geometric instance augmentations, so greedy refers to each trajectory rather than one tour per instance. The mixed-distribution AMDKD comparison retrains on uniform/cluster/mixture instances with an adaptive distribution scheduler; its CVRP pretraining is extended to 40 epochs (arXiv Appendices A, B.2 and C.4).

## Experiments

**Sets and measurement.** Appendix D specifies 49 TSPLIB instances with at most 1,002 nodes, all 100 CVRPLIB Set-X instances with at most 1,000 nodes and four selected Set-XXL instances with roughly 3,000-7,000 nodes. Uniform TSP100/CVRP100 test sets contain 10,000 instances; each synthetic shifted-distribution set contains 1,000. Training uses an RTX 6000 Ada; neural timing uses an RTX 4090 and classical methods use an AMD EPYC 7763 CPU. Benchmark gaps average individual percentage gaps to best-known solutions, while the synthetic section uses the gap of mean objective values. These aggregation rules and hardware are relevant to comparisons; a heuristic BKS is not a universal certificate of optimality.

**Benchmark quality and speed.** On Set-X, ELG-POMO reports 6.03% mean gap and 1.90 seconds per instance, versus POMO's 10.37% and 0.80 seconds. On TSPLIB, ELG reports 3.08% and 0.63 seconds, versus POMO's 7.45% and 0.41 seconds; BQ and LEHD have lower total gaps of 2.22% and 2.50%. ELG improves on other listed neural methods in the at-most-200-node subsets, but it does not dominate larger TSP instances. HGS and LKH3 give much smaller Set-X gaps with longer budgets; even the printed 10-second HGS comparison has a better gap than ELG (main Tables 1-2).

**Very large and shifted instances.** ELG has the best listed neural gap on three of four Set-XXL instances; BQ is better on Antwerp2. Appendix C.3 reports Set-XXL mean gaps of 15.24% for ELG and 20.44% for TAM-LKH3, but ELG takes 190.45 seconds versus 24.03 seconds. This comparison uses reported TAM results with a different subset from the main Set-X table; its time columns should not be pooled across subsets. On uniform 100-node data ELG improves POMO's TSP/CVRP gaps from 0.40%/1.34% to 0.22%/1.22%, while Pointerformer and T2TCO have lower TSP100 gaps (main Tables 3-5; arXiv Table 10).

**Ablations and exceptions.** Removing the normalized distance penalty raises TSPLIB/Set-X gaps from 3.08%/6.03% to 4.19%/7.19%. Positional encoding is not uniformly better: removing it improves Set-X slightly to 5.97%. A larger standalone-local model, with three encoder layers and dimension 128 for parameter-count comparability, has TSP100/TSPLIB gaps of 1.71%/3.81%, versus 0.22%/3.08% for ELG; this differs from the lightweight local branch used inside the ensemble (arXiv Tables 7 and 12).

## Limitations

The authors identify higher latency than divide-and-conquer methods on very large instances and leave other tasks such as pickup-and-delivery to future work. Transferability is supported by the tested distributions and subsets, without a theorem guaranteeing arbitrary scale transfer or optimality. Larger-node validation is part of model selection, so the protocol is not selection without any larger-size data. Separate TSP and CVRP configurations/checkpoints keep this entry specialist and constructive.

**Source discrepancies checked by the curator.** Table 1 prints HGS (less time) subset means of 0.21% and 1.28% but a total of 1.59%. An average over that partition cannot exceed both subset means; the note does not silently repair the published row. Appendix C.4 says ELG always beats AMDKD, but its CVRP100 Mixture row is 1.02% versus 0.99%, so that statement has an exception. Appendix C.5's standalone-policy prose is also inconsistent with its table; the numerical rows, rather than the mistaken comparison wording, support the description above.

## Reproducibility

- **Complete reading:** all nine pages of the official IJCAI 2024 main-track PDF and all 12 pages of arXiv:2308.14104v3 (5 May 2024), including Appendices A-D and Tables 6-12. The publisher paper explicitly directs readers to that arXiv appendix on PDF page 8. The official landing lists no separate scientific supplement. The framework, result and ablation tables were visually checked.
- **Official code:** [lamda-bbo/ELG](https://github.com/lamda-bbo/ELG), linked in main Section 4. Its README provides trained-model evaluation and training instructions in separate TSP/CVRP folders. Code/checkpoint availability is not a reproduction of the reported results; this review did not run training or solver benchmarks.
- **Metadata corrections:** the official record names Chengrui Gao, Haopu Shang and Ke Xue, and gives Nanjing University and Huawei affiliations. The previous author names, USTC affiliation, first-public date, acceptance-day inference, broken padded landing URL and title spelling were corrected from primary sources. The actual title uses "Transferrable". The first arXiv submission was 27 August 2023; formal publication is IJCAI 2024, main track, pages 6914-6922.
- **Reference identity:** the bibliography prints Lu et al. as ICLR 2019 and uses a BQ-NCO subtitle variant. Citation records preserve those printed references while matching the same authors and paper identities; they do not create different works or change the targets' metadata without their own review.
