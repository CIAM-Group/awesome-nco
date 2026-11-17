---
id: multi-decoder-attention-model
short_title: MDAM
title: Multi-Decoder Attention Model with Embedding Glimpse for Solving Vehicle Routing Problems
authors:
- Liang Xin
- Wen Song
- Zhiguang Cao
- Jie Zhang
year: 2021
date: 2020-12-19
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/17430
arxiv_url: https://arxiv.org/abs/2012.10638
code_url: https://github.com/liangxinedu/MDAM
institutions:
- Nanyang Technological University
- National University of Singapore
- Shandong University
figure:
  path: paper-assets/multi-decoder-attention-model/framework.png
  alt: MDAM shared encoder, embedding glimpse layer, and multiple attention decoders.
  caption: 'Figure 1: Multi-Decoder Attention Model with two decoders shown for illustration.'
  source_url: https://arxiv.org/pdf/2012.10638v1
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Split Delivery Vehicle Routing Problem
- Orienteering Problem
- Prize Collecting Traveling Salesman Problem
- Stochastic Prize Collecting Traveling Salesman Problem
summary: Multiple independently parameterized attention decoders, first-step KL diversity and periodically refreshed
  top-layer embeddings support task-specific routing construction with separate merged beams.
publication:
  date: '2021-05-18'
  source_url: https://ojs.aaai.org/index.php/AAAI/citationstylelanguage/get/turabian-fullnote-bibliography?publicationId=15746&submissionId=17430
---

# Multi-Decoder Attention Model with Embedding Glimpse for Solving Vehicle Routing Problems

> **TL;DR:** MDAM diversifies several constructive policies sharing an encoder, periodically refreshes its top attention layer to exclude visited nodes, and searches separate beams for each decoder. Experiments use task-specific models for six routing formulations.

## Motivation

Sampling or beam search from one concentrated policy can yield similar tours. Fixed node embeddings also continue to encode already visited nodes, although remaining decisions concern a smaller subproblem. MDAM addresses these two limitations with separate decoders and an approximation to stepwise re-encoding. It aims to improve learned heuristics, rather than establish general dominance over specialized exact solvers. [Introduction, arXiv v1 pp. 1-2](https://arxiv.org/pdf/2012.10638v1#page=1).

## Contributions

- A common attention encoder feeds multiple structurally identical decoders with **unshared decoder parameters**.
- A pairwise KL-divergence term encourages different first-action distributions.
- An Embedding Glimpse (EG) layer refreshes the encoder's final attention block using masks for irrelevant nodes.
- Independent beams and within-decoder state-dominance merging preserve decoder diversity while avoiding some redundant partial solutions.

## Methodology

**Encoder and decoders.** Node coordinates and task features are projected to 128 dimensions. Three encoder blocks use eight attention heads, 512-unit feed-forward layers, residual connections and batch normalization. The top block is the EG layer. Five separately parameterized attention decoders use graph, first-node and current-node context for TSP, with learned initial placeholders, a multi-head glimpse, clipped logits `10*tanh(score)` and feasible-node softmax. Task-specific states and masks adapt the architecture to CVRP, split-delivery VRP, orienteering, deterministic and stochastic prize-collecting TSP. A common architecture across these experiments does not establish one jointly trained checkpoint. [Section 3.1, pp. 2-3; experimental settings, p. 5](https://arxiv.org/pdf/2012.10638v1#page=3).

**Diversity and training.** Each decoder samples a trajectory and receives a REINFORCE cost gradient against the same baseline: the shortest of greedy trajectories from a fixed best-previous-epoch MDAM model. Gradient descent combines this with the negative gradient of pairwise KL divergence, so KL is encouraged to increase. Although the formula is written over states, the implementation computes KL **only at the initial decision**, where decoders have a common empty state, to control cost. The coefficient is 0.01, selected using TSP20 experiments. This is not independent training followed by an ensemble, nor a proof that all sampled solutions differ. [Section 3, Equations 11 and 16-19, pp. 3-5](https://arxiv.org/pdf/2012.10638v1#page=4).

**Refresh embeddings.** The lowest two encoder blocks remain fixed during a construction. Query, key, value projections and pairwise compatibilities for the top block can be cached. At a refresh, attention to visited nodes is masked before redoing its softmax, attention aggregation, residual normalization and feed-forward block. This updates **node embeddings**, not merely the decoder context. Refreshes occur every `p` decisions: TSP20/50/100 use 2/4/8 and CVRP20/50/100 use 2/6/8. Full encoder recomputation at every step is avoided. [Section 3.2, Equations 12-15, pp. 4-5](https://arxiv.org/pdf/2012.10638v1#page=4).

**Search and merge.** A total requested beam `B` is divided among `M` independent decoders with size `ceil(B/M)` each. The experimental labels **bs30 and bs50 are per-decoder widths**, totaling 150 and 250 candidates across five decoders. Within one decoder, TSP partial solutions sharing start, visited set and current node can be compared by partial length. CVRP additionally requires the longer partial route to have no more remaining capacity for the described dominance rule. The inferior state is removed, and the surviving beam probability takes the larger of the two probabilities, not their sum. No cross-decoder merging is performed. Pairwise state comparisons have quadratic overhead in each beam's width. These operations prune construction search; they do not perform incumbent local improvement. [Section 3.1, pp. 3-4](https://arxiv.org/pdf/2012.10638v1#page=3).

## Experiments

**Budgets.** Training uses Adam at `1e-4`, 100 epochs of 2,500 batches, normally 512 instances per batch and 256 for CVRP100 due to GPU memory. Coordinates are uniform on the unit square. CVRP demands are integers 1-9 and capacities 30/40/50 for 20/50/100 customers. Test sets contain 10,000 instances per setting. MDAM uses an RTX 2080 Ti; Concorde and LKH run 32 instances in parallel on 32 virtual CPUs, while several other results are imported from prior papers. Table times cover **all 10,000 instances**, not per-instance latency or matched hardware. [Section 4 and Table 1, pp. 5-6](https://arxiv.org/pdf/2012.10638v1#page=6).

| 100-node setting | MDAM greedy | MDAM bs50, 250 total beam members | Reference |
| --- | --- | --- | --- |
| TSP, minimize length | 7.93; 2.19%; 36 s | 7.79; 0.38%; 44 min | Concorde 7.76 |
| CVRP, minimize length | 16.40; 4.86%; 45 s | 15.99; 2.23%; 53 min | LKH 15.65 |
| Split-delivery VRP, minimize length | 16.39; 2.62%; 1 min | 15.97; 0.00%; 1 h | Best reported value 15.97 |
| Distance-prize orienteering, maximize prize | 32.32; 2.61%; 32 s | 32.96; 0.69%; 32 min | Compass 33.19 |
| PCTSP, minimize cost | 6.17; 3.13%; 34 s | 6.06; 1.31%; 35 min | C++ ILS 5.98 |
| Stochastic PCTSP, minimize cost | 6.18; 1.84%; 1 min | 6.07; 0.00%; 38 min | Best reported value 6.07 |

These are the paper's reported gaps; heuristic/best-observed references in non-TSP settings do not certify optimality. MDAM improves the reported AM comparisons, but remains worse than Concorde in TSP quality and total time at bs50, Compass for OP100, and ILS for PCTSP100. The paper does **not** compare POMO, so the previous note's "POMO-era" baseline description was unsupported.

**Ablations and supplement.** Removing multi-decoder structure or EG worsens greedy TSP/CVRP results in Table 2. The comparison changes candidate count when retaining multiple decoders, so inference effort remains relevant. Supplemental Figure S.1 shows state merging improves results at fixed five-decoder bs50. Temperature-tuned AM reaches about 16.1909 on CVRP100 with 1,280 samples, versus MDAM bs50's 15.99. A single large AM beam with merging takes 227 minutes for objective 16.00, versus MDAM's 53 minutes for 15.99 in the reported setting. Training at CVRP100 and testing at CVRP200 gives 29.28 with MDAM bs50 versus 29.54 for 1,280-sample AM. The transfer table reports objective and runtime rather than an exact optimum gap. [Table 2 and analysis, p. 7; integrated supplementary material, pp. 10-11](https://arxiv.org/pdf/2012.10638v1#page=10).

## Limitations

### Reported by the Authors

- EG refreshes and larger beams add computation; state merging becomes expensive at large widths.
- Some specialized solvers remain stronger or faster in the evaluated problems.
- Decoder count is fixed before training. Flexible counts and joint decoder collaboration are future work.

### Curator Notes

- Decoder diversity and empirical size transfer do not establish arbitrary distribution or constraint generalization.
- The evaluated system combines learned construction, task-specific feasibility rules and search. The gains cannot all be assigned to the diversity loss alone.
- First-step KL regularization does not ensure uniformly diverse complete tours or global optimality.
- Stochastic beam evaluation and best-known gaps require their task-specific interpretation; the table's zero gaps are not proofs.

## Reproducibility

- **Formal publication:** [AAAI 2021, volume 35(13), pp. 12042-12049](https://ojs.aaai.org/index.php/AAAI/article/view/17430). The publisher's citation export gives publication on 18 May 2021. A generic conference date is not retained as paper-specific acceptance evidence.
- **Reviewed copy:** [arXiv:2012.10638v1](https://arxiv.org/pdf/2012.10638v1), submitted 19 December 2020, all 11 pages including references and the two-page integrated scientific supplement. The title block lists NTU, Shandong University and National University of Singapore; these affiliations describe this reading version.
- **Supplement check:** The formal OJS landing returned bot-protection/access errors. The accepted arXiv copy contains the scientific supplementary comparisons explicitly referenced by the main text, and all were read. No inspection of unavailable OJS attachments is claimed.
- **Official implementation:** [liangxinedu/MDAM](https://github.com/liangxinedu/MDAM). Its README provides task-specific train/evaluation commands, pretrained-model download commands and all six problem labels. Code/checkpoint execution was not performed.
- **Visual review:** Figure 1, EG and KL equations, the complete comparison table and supplementary plots/tables were inspected against rendered source pages.
- **Audit trail:** [Full-text source locators and explicit citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/multi-decoder-attention-model.json).
