---
id: efficient-neural-neighborhood-search-for-pickup-and-delivery-problems
short_title: N2S
title: Efficient Neural Neighborhood Search for Pickup and Delivery Problems
authors:
- Yining Ma
- Jingwen Li
- Zhiguang Cao
- Wen Song
- Hongliang Guo
- Yuejiao Gong
- Yeow Meng Chee
year: 2022
date: '2022-04-25'
publication:
  date: 2022-07
  source_url: https://www.ijcai.org/proceedings/2022/662
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2022/662
institutions:
- National University of Singapore
- Singapore Institute of Manufacturing Technology, A*STAR
- Shandong University
- Institute for Infocomm Research, A*STAR
- South China University of Technology
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Routing
problems:
- Pickup and Delivery Travelling Salesman Problem
- Pickup and Delivery Travelling Salesman Problem with LIFO
summary: Synthesis attention encodes a complete pickup-delivery tour and two learned decoders remove and reinsert
  one request pair. PPO and inference augmentation improve synthetic PDTSP/PDTSP-LIFO results with separate task
  models; finite-LKH comparisons and distribution-shift limitations qualify the gains.
arxiv_url: https://arxiv.org/abs/2204.11399
code_url: https://github.com/yining043/PDP-N2S
figure:
  path: paper-assets/efficient-neural-neighborhood-search-for-pickup-and-delivery-problems/framework.png
  alt: Node and cyclic-position features feed synthesis attention; removal and reinsertion decoders edit a complete
    pickup-delivery tour into another feasible tour.
  caption: 'Original Figure 1: N2S complete-tour encoding, request-pair removal/reinsertion, and state transition.'
  source_url: https://www.ijcai.org/proceedings/2022/0662.pdf#page=2
---

# N2S: Efficient Neural Neighborhood Search for Pickup and Delivery Problems

> **TL;DR:** N2S learns how to remove and reinsert a pickup-delivery pair in an existing tour. It is **specialist/improvement**: separate models are trained for PDTSP and PDTSP-LIFO and each size, while initialization is random feasible construction. Generic architecture and an untested capacity extension do not establish one checkpoint across native problems.

## Motivation

Ordinary segment reversal can violate pickup-before-delivery precedence; moving one node at a time also leaves a restricted feasible neighborhood, especially with last-in-first-out loading. N2S couples a request-pair neighborhood with a cheaper way of combining coordinate and current-tour positional attention. The studied problems are single-tour PDTSP and PDTSP-LIFO, not capacitated multi-vehicle PDP by default. [Motivation and definitions.](https://www.ijcai.org/proceedings/2022/0662.pdf#page=1)

## Contributions

- Synthesis Attention combines attention scores from coordinates and cyclic tour positions through an element-wise MLP.
- A request-pair removal decoder and joint reinsertion-position decoder learn feasible neighborhood moves.
- Curriculum-assisted PPO trains the policy; symmetry augmentation and shorter action history diversify inference.
- Synthetic comparisons, encoder/decoder ablations and full out-of-distribution benchmark results characterize quality and cost. [Overview.](https://www.ijcai.org/proceedings/2022/0662.pdf#page=2)

## Methodology

### Complete-tour state and neural moves

Each request has pickup i+ and delivery i−, plus a depot. The objective is a shortest Hamiltonian cycle. PDTSP requires pickup before delivery; PDTSP-LIFO additionally requires the delivered goods to be on top of the loading stack. State includes coordinates, each node's position in the current complete tour, action history and best incumbent cost.

The policy selects a pickup-delivery pair, removes both nodes, and jointly chooses where to reinsert pickup and delivery in the remaining tour. Masks eliminate infeasible positions. The transition need not improve the current tour; reward is only the reduction in the best-so-far cost, hence is nonnegative. The best solution encountered is retained. Random feasible initialization and repeated neural edits make this an improvement method. [MDP and decoders.](https://www.ijcai.org/proceedings/2022/0662.pdf#page=3)

### Synthesis Attention and learning

Node coordinates form primary embeddings and cyclic positions auxiliary embeddings. Per-head self-attention scores from both aspects are fed to a small MLP, then normalized and used to aggregate primary values. Auxiliary scores are calculated once and shared across three encoder layers. Embedding dimension is128, with four heads and instance normalization.

Removal scores combine predecessor/successor compatibility, request frequency and recent-action indicators. Reinsertion scores jointly represent the two insertion locations. Both decoders use MLPs and tanh clipping. A critic combines pooled node representations and incumbent cost. N-step PPO trains the actor/critic, after an epoch-dependent policy warm-up improves random starting tours for curriculum learning.

N2S-A creates floor(|V|/2) transformed copies, combining coordinate swap, reflections and90-degree rotations, searches them in parallel and selects the best. These rigid transforms preserve Euclidean distances but add inference work. Training history length is |V|, reduced to floor(|V|/2) for inference. [Equations5–19 / Algorithms1–2.](https://www.ijcai.org/proceedings/2022/0662.pdf#page=4)

The fully read arXiv v3 explicitly says it corrects typos and adds discussion/results. It changes printed positional period/frequency and indexing expressions, head concatenation notation and reinsertion-score argument order relative to the formal PDF. This note describes the shared algorithm and identifies v3 when using its added material, without claiming the formal expressions were silently identical.

## Experiments

### Training and evaluation budgets

Models are trained separately for PDTSP/PDTSP-LIFO at21,51,101locations, including the depot:10,25,50requests. Training uses200epochs,20batches per epoch, batch600,5-step PPO,250rollout steps and three minibatch updates. PPO clipping is0.1; discount0.999; actor/critic learning rates are8e-5/2e-5, decayed0.985per epoch. Reported training times are approximately1,3,7days by size on an eight-RTX2080Ti / XeonE5-2680 server.

Main tables average2,000uniform test instances. Their times cover solving the full set, not single-instance latency. LKH uses16CPU cores in parallel; neural methods have all eight GPUs available, without necessarily using all of them. Comparisons are practical configurations, not matched hardware or identical work. The gap reference is LKH with10,000iterations, a finite heuristic run rather than an exact optimum. [Setup and baseline training budgets.](https://www.ijcai.org/proceedings/2022/0662.pdf#page=6)

### Quality/runtime trade-offs

On PDTSP101, plain N2S at3,000moves has4.44%gap. N2S-A reaches−0.01%at2,000moves/80minutes, and−0.20%at3,000moves/121minutes; LKH10k takes98minutes. The stronger N2S-A result therefore consumes more time than LKH. At21locations, plain DACT has slightly smaller gaps than plain N2S:0.03%versus0.05%at3,000moves.

On PDTSP-LIFO101, N2S-A3k has−1.47%gap in161minutes versus67minutes for LKH10k. Its1k result,−0.47%, is worse than Heter-POMO-A4k at−0.98%, although it is faster. Thus selected strongest settings beat the heuristic reference, while uniform superiority across every budget is not supported. Negative gaps do not mean beating a certified optimum. [Complete Tables3–4.](https://www.ijcai.org/proceedings/2022/0662.pdf#page=7)

### Ablations and distribution transfer

At128dimensions, the single-GPU PDTSP51 encoder ablation reports Synth-Att0.76Mparameters/340seconds/2.40%gap versus DAC-Att1.25M/400seconds/2.43%. Vanilla attention is faster but less accurate. Both learned decoders outperform the listed hand-crafted alternatives together; the pair formulation particularly helps LIFO compared with DACT's single-node insertion.

Generalization selects the nearest-size pretrained model, normalizes coordinates and increases decoder clipping C; the new C value is not specified. It is not entirely parameter-free protocol reuse. Across ten runs, PDTSP101 has0.08%average/0.00%best gap to exact references; PDTSP201 has2.82%/2.19%. The extended table contains all20PDTSP rows.

The24LIFO rows cover sizes25,51,75,101, despite main prose mentioning up to201. Their mean gap to the stronger B2 heuristic is2.11%, with1.06%best-of-ten mean. The paper acknowledges weaker out-of-distribution performance relative to strong classical heuristics. Improvements over Heter-POMO are not strict for every row: on pr1002_101, N2S-A average cost62,787 is worse than62,569. Some printed comparator rows even have average cost below the reported best cost; those fields are retained as source inconsistencies rather than corrected by guesswork. [Ablations.](https://www.ijcai.org/proceedings/2022/0662.pdf#page=8) [Complete generalization results.](https://arxiv.org/pdf/2204.11399v3#page=10)

## Limitations

No global optimality or approximation guarantee is established. Learned moves, masks and positional encoding are tailored to the tested precedence/stack settings. AppendixB proposes capacity/demand features, dummy depots and new masks, but does not experimentally validate a capacitated multi-vehicle extension; that proposal is not an additional demonstrated task.

Synthetic gains depend on search steps, augmentation and parallel hardware. Better mean quality does not imply a faster solver at every budget or strong transfer to arbitrary distributions. Reference heuristics, adjusted inference clipping and inconsistent individual table fields limit overly precise generalization claims. No training or benchmark run was independently reproduced.

## Reproducibility

- Formal IJCAI2022 Main Track DOI10.24963/ijcai.2022/662 spans4776–4784. Publisher BibTeX and deposited metadata agree on July2022 precision. Seven-author byline lists NUS, SIMTech/A*STAR, Shandong, I2R/A*STAR and SCUT; Yining Ma/Jingwen Li contributed equally and Zhiguang Cao corresponds.
- All9formal pages and all11pages of arXiv2204.11399v3 were fully read, including complete references and AppendicesA–B with every benchmark row. The formal footnote explicitly requests that extended version. Primary history gives v1on2022-04-25, v2onJune27 and v3onOctober7; the front date records v1, while added results are attributed to v3.
- Official default commit53429a0312bb94b9189c140ff9136b5fe696ed9c has26paths, including six distinct task/size checkpoints. The README, data/checkpoint inventory, inference loop and ordinary empty releases page were inspected. Its linked refactor branch at6aeea79398c42648ef50068b89e1b2e1280df0e1has26paths and no additional scientific document/archive; its README differences were read. The linked DACT notebook is implementation guidance for the earlier method, not an unexamined N2S scientific-results supplement.
- The release uses linked-list tours and provides separate task training/evaluation commands. Its example101-location model uses `graph_size100`, excluding the depot, and `val_m50` for augmented inference. Random initialization, unchanged model weights through rollout and best-of-augmentation selection match the improvement interpretation. Current refactoring/bug-fix notices are not evidence that original results were independently rerun.
- Original Figure1 is cropped from formal PDFpage2 at rectangle(48,49,565,241), rendered4x and actually viewed. All method diagrams, major equations/algorithms, all9tables including full appendix rows and benchmark illustrations were rendered and visually checked.
- Thirteen internal relations have explicit body citations and matching bibliography identities. Older AM/DPDP reference years retain their actual cited versions. Distinct later journal extensions and uncatalogued heterogeneous-attention/dynamic-PDP papers are not conflated with another conference ID.
