---
id: matrix-encoding-networks
short_title: MatNet
title: Matrix Encoding Networks for Neural Combinatorial Optimization
authors:
- Yeong-Dae Kwon
- Jinho Choo
- Iljoo Yoon
- Minah Park
- Duwon Park
- Youngjune Gwon
year: 2021
date: '2021-06-21'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/29539ed932d32f1c56324cded92c07c2-Abstract.html
arxiv_url: https://arxiv.org/abs/2106.11113
code_url: https://github.com/yd-kwon/MatNet
institutions:
- Samsung SDS
figure:
  path: paper-assets/matrix-encoding-networks/framework.png
  alt: MatNet cross-attention architecture and mixed-score attention over a relation matrix.
  caption: 'Figure 2: MatNet architecture and its mixed-score attention mechanism.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/file/29539ed932d32f1c56324cded92c07c2-Paper.pdf
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Asymmetric Traveling Salesman Problem
- Flexible Flow Shop Problem
- Traveling Salesman Problem
summary: MatNet mixes learned cross-attention scores with explicit matrix entries; task-specific POMO-trained decoders
  construct ATSP tours and flexible-flow-shop schedules under separately documented search budgets.
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper/2021/hash/29539ed932d32f1c56324cded92c07c2-Abstract.html
---

# Matrix Encoding Networks for Neural Combinatorial Optimization

> **TL;DR:** MatNet encodes a matrix as a weighted complete bipartite graph, mixing each explicit relationship value with learned cross-attention. Separate POMO-trained construction systems solve ATSP and flexible flow shop scheduling; the stronger results use randomized embedding augmentation.

## Motivation

Distances in asymmetric routing and processing times for machine-job pairs are naturally relational matrices. Their row and column orders have no semantic meaning, while the two item roles can differ. MatNet supplies an encoder that respects those roles and directly consumes matrix entries. The paper's historical novelty statements describe its research context; they should not be read as a present-day claim that no other matrix or weighted-graph encoders exist. [Sections 1-3, main PDF pp. 1-3](https://proceedings.neurips.cc/paper_files/paper/2021/file/29539ed932d32f1c56324cded92c07c2-Paper.pdf#page=2).

## Contributions

- Two cross-attention update functions separately encode row and column items of a weighted bipartite graph.
- Per-head MLPs mix internal query-key compatibility with the external matrix entry before attention normalization.
- Distinct initial identifiers enable useful embeddings even without intrinsic node features, and randomized assignments provide inference augmentation.
- Separate ATSP and FFSP systems demonstrate the encoder with task-specific construction and POMO training; additional experiments cover Euclidean TSP and FFSP size transfer.

## Methodology

**Encode relationships.** For a matrix `D`, row nodes attend to column nodes and vice versa, using `D` or its transpose. The main architecture applies two separate update functions in parallel; sequential updates are an alternative discussed in Supplement A.2, rather than the definition of the evaluated main model. A head mixes its scaled internal dot product and `D_ij` through a trainable two-input, one-output MLP. Softmax then weights value vectors. Residual, normalization and feed-forward blocks complete each update. Multiple input matrices can be accommodated by an `f+1`-input mixing MLP, but the principal experiments use one relationship matrix per encoder. [Section 3 and Figure 2, pp. 3-5; Supplement A, pp. 1-2](https://proceedings.neurips.cc/paper_files/paper/2021/file/29539ed932d32f1c56324cded92c07c2-Paper.pdf#page=4).

**Initialize and augment.** One item set starts with zero vectors, the other with distinct one-hot vectors sampled from a predefined pool. The latter has a size bound `N_max`; random or learned identifier alternatives relax this restriction, with the reported performance tradeoffs. Changing the identifier assignment produces a different encoding of the same matrix. Selecting the best across these assignments improves quality at the cost of repeated encoding; it is not geometric rotation and does not change matrix values.

**ATSP policy.** Five MatNet layers use 256-dimensional embeddings, 16 heads and a 16-hidden-unit mixing MLP. The paper prints feed-forward hidden width **516** and uses instance normalization. A pointer-style decoder queries with concatenated first/current *from-city* embeddings and attends to *to-city* embeddings, omitting the mean graph embedding. Visited cities are masked. POMO uses all `N` starting cities and their mean return as baseline. Inference samples conditional trajectories, unlike the greedy-rollout choice in the original POMO experiments. A POMO group spans the starts; 128 embedding augmentations repeat the group with new identifiers. [Section 4, pp. 5-7; Supplement B-C, pp. 3-4](https://proceedings.neurips.cc/paper_files/paper/2021/file/29539ed932d32f1c56324cded92c07c2-Paper.pdf#page=6).

**FFSP policy.** Three stages each have four unrelated machines; matrix entries specify machine-job processing times. Each stage has its own MatNet and decoder, with three encoder layers, machine identifiers and initially zero job embeddings. The decoder queries a machine and selects an available job or a learned **skip** option. Jobs already processed or not yet ready are masked; busy machines receive no new job. Scanning stages and machines over advancing time constructs the schedule. The training group uses all `4! = 24` machine-order permutations. Each stage decoder lacks direct knowledge of other stages, a reason the authors suggest sampling may outperform greedy decisions. This is a specialist constructive system with separate task/stage parameters, not one jointly trained ATSP-and-FFSP checkpoint. [Section 5, pp. 7-9; Supplement J, p. 11](https://proceedings.neurips.cc/paper_files/paper/2021/file/29539ed932d32f1c56324cded92c07c2-Paper.pdf#page=8).

## Experiments

**Training.** ATSP instances are tmat matrices: integer costs 1 to `10^6`, diagonal zero, followed by repeated shortest-path closure enforcing triangle inequality. Adam uses learning rate `4e-4`, batch 200 and 10,000 new instances per epoch. Sizes 20/50/100 receive 2,000/8,000/12,000 epochs, about 6/55/110 hours. The first two use one V100; size 100 accumulates gradients from four 32 GB GPUs. FFSP processing times are independent integers 2-9. Adam uses `1e-4`, batch 50 and 1,000 instances per epoch, for 100/150/200 epochs at 20/50/100 jobs, about 4/8/14 hours; FFSP100 uses four GPUs.

**ATSP results.** Table 4.1 covers 10,000 instances. Displayed length is in units of `10^6` and gaps are relative to CPLEX's obtained values. At ATSP100, MatNet gives 1.62 and a 3.24% gap in 34 seconds; 128 augmentations give 1.59 and 0.93% in one hour. LKH3 gives 1.57 and a displayed 0.00% in one minute, so this experiment does not establish superiority over LKH3. CPLEX uses a ten-second per-instance timeout and certifies all size-20, about 99% of size-50 and 96% of size-100 solutions. Thus its reference is not a proven optimum for every larger test instance. The remaining cases have solver bound gaps of about 1.2% and 0.5%, respectively. LKH3 uses version 3.0.6, one run and `MAX_TRIALS=2N`.

**FFSP results.** Table 5.2 covers 1,000 instances. The gap column is an **absolute makespan difference from MatNet with 128 augmentations**, not a percentage and not an optimality gap.

| Jobs | MatNet makespan / time | MatNet x128 makespan / time | PSO makespan | SJF makespan |
| --- | --- | --- | ---: | ---: |
| 20 | 27.3 / 8 s | 25.4 / 3 min | 29.1 | 31.3 |
| 50 | 51.5 / 14 s | 49.6 / 8 min | 55.1 | 57.0 |
| 100 | 91.5 / 27 s | 89.7 / 23 min | 97.3 | 99.3 |

These show improvement over the particular MIP, GA, PSO and dispatch implementations tested on the specified synthetic distribution. They do not establish the best possible performance of every scheduling method. GA/PSO use populations of 25 and 1,000 iterations; their full protocol is in Supplement G. CPLEX does not prove an optimum for any FFSP test instance in the allotted time and finds no valid solution for sizes 50/100 within 600 seconds.

**Time accounting.** The main table times are total computational times for the full test sets, excluding loading. Single-thread heuristic runtimes are divided by eight as an assumed parallelization allowance; this is not measured eight-core execution. MatNet inference uses a single GPU and batches instances, so the timing comparison is not hardware matched. Appendix I separately tests three manually selected representative instances, including long-budget classical searches; those selections do not constitute a large industrial benchmark. [Sections 4-5, pp. 6-9; Supplement G/I, pp. 8-9](https://proceedings.neurips.cc/paper_files/paper/2021/file/29539ed932d32f1c56324cded92c07c2-Supplemental.pdf#page=9).

**Additional evidence.** Euclidean TSP is trained separately on symmetric distance matrices. At TSP100, MatNet x128 has a 0.17% gap in one hour, versus POMO's eight-augmentation 0.14% in one minute in the reported comparison. FFSP100-trained weights evaluated on 1,000-job instances yield makespan 803.2 with 128 augmentations, versus SJF's 847.0. This changes job count while retaining the stage/machine configuration and processing-time distribution; it does not show arbitrary machine-count or distribution transfer. [Supplement D/H, pp. 5 and 8-9](https://proceedings.neurips.cc/paper_files/paper/2021/file/29539ed932d32f1c56324cded92c07c2-Supplemental.pdf#page=5).

## Limitations

### Reported by the Authors

- Additional real-world constraint combinations need further research.
- One-hot identifier pools restrict one matrix dimension; random identifiers trade some quality for flexibility.
- Independent processing times create an intentionally unrelated-machine FFSP setting that the supplement calls somewhat unrealistic.
- Hybrid integration with OR methods is a proposed direction; the evaluated main systems use end-to-end construction.

### Curator Notes

- Encoder portability and shared hyperparameters are distinct from shared checkpoints or universal task handling.
- ATSP results are weaker than LKH3 in the reported benchmark; FFSP claims should retain the distribution and comparator implementation.
- Augmentation counts, all-start/machine-order groups, GPU batching and the CPU-time scaling convention materially affect comparisons.
- CPLEX references and self-referenced absolute FFSP differences must not all be called optimality gaps. No numerical reproduction was attempted.

## Reproducibility

- **Publication and dates:** [NeurIPS 2021 article record](https://proceedings.neurips.cc/paper/2021/hash/29539ed932d32f1c56324cded92c07c2-Abstract.html). [arXiv history](https://arxiv.org/abs/2106.11113) gives first submission on 21 June 2021. The previous generic notification date was removed from acceptance metadata.
- **Reviewed sources:** All 12 publisher-paper pages and all 11 separately linked supplement pages (Appendices A-J). The official article has one scientific Supplemental PDF; no ZIP or additional scientific attachment was linked in the manual landing-page inspection.
- **Official implementation:** [yd-kwon/MatNet](https://github.com/yd-kwon/MatNet), with separate ATSP/FFSP training and testing. The README supplies ATSP checkpoints and external FFSP checkpoint/dataset links, plus Python 3.7.6/PyTorch 1.7.0 versions. Link documentation was inspected; external model downloads and solver execution were not verified.
- **Visual check:** Original mixed-score architecture, result-table units and both task-decoding diagrams were checked in rendered pages. The previous architecture asset clipped the matrix/embedding inputs; the complete original Figure 2 is now retained.
- **Audit trail:** [Claim locators, page coverage and explicit outgoing citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/matrix-encoding-networks.json). Reference 41 is printed as ICLR 2022 in the reviewed publisher bibliography, although this is a NeurIPS 2021 paper; the ledger preserves the printed label and does not infer a different citation date.
