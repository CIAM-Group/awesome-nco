---
id: sil
short_title: SIL
title: Boosting Neural Combinatorial Optimization for Large-Scale Vehicle Routing Problems
authors:
- Fu Luo
- Xi Lin
- Yaoxin Wu
- Zhenkun Wang
- Xialiang Tong
- Mingxuan Yuan
- Qingfu Zhang
year: 2025
date: '2025-05-01'
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/264f2e10479c9370972847e96107db7f-Abstract-Conference.html
code_url: https://github.com/CIAM-Group/SIL
institutions:
- Southern University of Science and Technology
- City University of Hong Kong
- Eindhoven University of Technology
- Huawei Noah’s Ark Lab
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A representative-node cross-attention decoder and self-improved training solve TSP/CVRP through greedy
  construction or parallel incumbent-route reconstruction; task/scale-specific training and explicit reconstruction
  budgets underpin the large-scale results.
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/264f2e10479c9370972847e96107db7f-Abstract-Conference.html
figure:
  path: paper-assets/sil/framework.png
  alt: SIT improves nonoverlapping partial routes with the neural model and then uses the retained routes as pseudo-labels
    for model training.
  caption: 'Figure 2: self-improved training alternates neural local reconstruction and pseudo-label supervision.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=6
---
# Boosting Neural Combinatorial Optimization for Large-Scale Vehicle Routing Problems

> **TL;DR:** A heavy decoder exchanges information through a fixed number of representative nodes, reducing the cost of each prediction. **Self-Improved Training (SIT)** alternates learned partial-route reconstruction with supervised updates on the improved routes. Greedy construction and PRC are separate inference modes: the main **PRC starts from random insertion**, and its strongest results require up to1,000 reconstruction rounds. The stable repository ID **SIL** also represents an earlier, differently titled preprint, whose experimental settings must be kept separate.

## Motivation

Neural routing models trained on small instances often deteriorate at much larger scales. Directly training a conventional heavy self-attention decoder on large instances is expensive, while obtaining near-optimal supervision for tens of thousands of customers is difficult. The paper addresses both the per-prediction network cost and the generation of useful training targets. Its demonstrated optimization problems are **Euclidean TSP and CVRP**, rather than arbitrary combinatorial optimization. [Sections1-3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=1)

## Contributions

- A cross-attention decoder in which representative nodes aggregate graph information and then broadcast it back to the remaining nodes.
- SIT: repeatedly improve a stored solution dataset with the current model, then train on partial routes extracted from those improved solutions.
- Parallel reconstruction of disjoint route segments, with explicit CVRP rules to retain capacity feasibility when segments are merged.
- Experiments with separately trained models at1K-100K nodes, public routing libraries, smaller instances, transferred training schemes and limited zero-shot TSP tests beyond100K. [Sections4-5/AppendicesA-Q.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=4)

## Methodology

### Representative-node decoder

A linear embedding maps coordinates, and additionally normalized demand for CVRP, to128-dimensional vectors. Six decoder modules use eight attention heads and512-dimensional feed-forward layers. At a decoding step, first/last route-node embeddings receive distinct learned transformations. Representatives first attend to the graph embeddings; graph nodes then attend to the updated representatives. Residual attention/feed-forward updates precede a masked softmax over available actions. [Equations2-5.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=5)

The main equations illustrate **two** representatives, but the experimental implementation is more detailed: AppendixC repeats the last-node representation15 times. The released TSP/CVRP models implement **one first-node and15 separately projected last-node tokens**, giving16 representative tokens. This remains a fixed-size bottleneck; it should not be described as exactly two tokens in the reported implementation. Pooling/learnable representatives encountered NaNs in the reported trials, an empirical observation rather than a general impossibility result. [AppendixC.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=17)

For fixed embedding width, layer count and representative count, one decoder prediction has linear attention cost in its remaining graph size. A full autoregressive n-node construction makes n predictions and is consequently **quadratic in aggregate decoder work**, not an O(n) complete-tour solver. For a segment of length omega, reconstruction similarly uses O(omega²) work; processing approximately n/omega segments gives O(n omega) aggregate work per round before batching overhead. AppendixA's O(k lmax²) expression treats segments as parallel work and is not a hardware-independent bound on total operations. Peak batched decoder memory scales with the total segment nodes. [AppendixA.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=14)

### SIT and parallel reconstruction

Start a training solution dataset using random insertion. For each SIT iteration, improve its incumbents by repeated neural reconstruction and then train with teacher-forced cross-entropy on random contiguous partial routes of length4 through lmax. Endpoints are fixed, the internal sequence is reconstructed, and a replacement is retained only when it improves the partial-route cost. The improved dataset persists into subsequent iterations; best greedy validation performance selects the checkpoint. This uses self-generated pseudo-labels, not external optimal training tours. [Section4.3/Algorithms1-4.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=6)

PRC partitions a tour into approximately floor(n/omega) nonoverlapping segments of a shared random length and processes them in parallel. Direction and segment selection vary across iterations. For CVRP, actions select a customer **directly or via the depot**. A partial route whose final subtour does not end at the depot excludes that tail from reconstruction; its initial remaining capacity accounts for customers before the segment's head. These rules prevent a locally feasible reconstructed segment from exceeding capacity after merging with the untouched prefix/suffix. [AppendixB.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=15)

### Inference and classification

**Greedy** decoding constructs a whole solution from an empty partial route. **PRC**, separately reported in the main experiments, initializes a complete solution by random insertion and uses a frozen neural model to rewrite its segments. Inference changes the route, not the network weights. AppendixF additionally compares model-greedy and nearest-neighbor initializations; random insertion is best on6/10 tested groups and is the selected main protocol. PRC results must not be presented as an automatic continuation of the reported greedy solution. [Table1/AppendixF.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=8)

Classification is **specialist / constructive-improvement** because both the new whole-route constructor and the new learned incumbent-reconstruction mode are substantive parts of the method. TSP/CVRP and the principal training scales use separate training/checkpoints; sharing the architecture or training algorithm does not demonstrate one generalist checkpoint. [Section5/Table8.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=20)

## Experiments

### Data, training and inference budgets

The synthetic scales are1K/5K/10K/50K/100K. Each1K test set has128 instances; larger sets have16. Uniform unit-square coordinates and CVRP demands1-9 are used, with capacities250/500/1,000/2,000/2,000. Training datasets contain20,000/200/200/100/100 instances. Following random-insertion-label warm-up on1K, larger scales are trained separately from a1K model. Each SIT round uses100 reconstruction rounds and20 training epochs; TSP uses8/8/3/3/7 SIT rounds and CVRP8/8/4/4/7. Training batches are256/32/32/32/16; reconstruction batches256/32/32/16/8. The maximum segment length is1,000, Adam starts at1e-4 with.97 epoch decay, and a single24GB RTX3090 is used. Full end-to-end formal-version training wall times are not tabulated. [Section5/AppendixE.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=7)

The main comparison reports **average per-instance** objective, reference gap and inference time. PRC budgets are10/50/100/500/1,000 rounds; greedy is a different protocol. LKH3 provides TSP reference values and HGS provides CVRP values. These heuristic references are **not certified optimal solutions**: negative CVRP gaps mean beating the reported HGS incumbent. Classical reference budgets reach25h for TSP100K and24h for CVRP100K. Some baseline values are taken from their original publications; hardware, search procedures and training distributions are not universally matched. [Table1.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=8)

### Main synthetic results

| Setting | Greedy gap/time | PRC100 gap/time | PRC1,000 gap/time |
| --- | --- | --- | --- |
| TSP1K |1.95%/.2s |.58%/9.4s |.38%/1.5m |
| TSP100K |6.13%/33.0m |2.90%/17m |2.45%/2.6h |
| CVRP1K |5.01%/.2s |3.31%/8.0s |2.72%/1.5m |
| CVRP100K |-.22%/33.1m |-1.00%/11.5m |-2.55%/2.17h |

PRC can be faster than full greedy construction at large scales because it reconstructs bounded-length segments in parallel from a cheap classical initial tour. Longer search improves quality but is not one forward pass. The results do not establish superiority to classical solvers on every task: AppendixL reports NeuroLKH TSP1K/5K/10K gaps0/.003/.0069%, substantially below PRC100's.58/1.67/2.11%, at larger times27s/3.7m/8.9m. NeuroLKH encounters numerical/memory failures at the two largest tested scales. [Tables1/17.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=24)

### Libraries, ablations and transfer

The formal library evaluation contains33 TSPLIB and14 CVRPLIB instances above1K nodes. PRC1,000 solves all with mean gaps **2.556% and9.574%**, compared with8.244% and15.677% for greedy. Some competing means cover only the subset they can solve, so their aggregate gaps are not directly comparable on a common solved-instance set. NeuroLKH's lower TSPLIB mean.20% covers27/33 instances. [Tables2/18.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=9)

Table3's no-SIT comparison changes training data from small labeled CVRP100 to large-scale pseudo-label training, so it combines the training mechanism with scale/distribution differences. AppendixK provides a more controlled **same-SIT, TSP1K-trained** comparison: at TSP10K, LEHD+SIT gives13.81%/11.7m/9,224MB, versus4.62%/20.1s/94.41MB for the proposed model. These values differ from the separately trained main TSP10K checkpoint's4.05% greedy gap. The proposed model has2.63M parameters; matched-size retrained baselines are also reported, without making all training protocols identical. [Tables3/16/20-21.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=23)

The lmax ablation exposes a quality/time tradeoff; increasing training segment length to10K does not consistently beat1K. Eightfold augmentation improves gaps at an average reported7.1-fold inference-time increase. AppendixH covers300/500/700-node instances, but its table labels times as total and does not clearly specify the PRC iteration count, so those times are not merged with the main per-instance protocol. [Tables5/11/19.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=21)

AppendixP applies the **TSP100K checkpoint without retraining** to200K and500K nodes: PRC100 reports3.57%/33m/3,166MB and6.03%/1.1h/7,916MB. Reference generation and sample counts are not detailed there; these are limited scale-transfer results, not a cross-problem generalist demonstration. [Table23.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=27)

## Limitations

### Discussed in the Paper

- Repeated pseudo-label generation remains expensive and can make training beyond100K prohibitively slow.
- A fixed sampling-length range trades local efficiency against global route quality; adaptive lengths and multi-GPU training are proposed future work.
- Other CO problems, including scheduling/bin packing/knapsack, are future extensions rather than tested tasks. [Conclusion/AppendicesO-P.](https://proceedings.iclr.cc/paper_files/paper/2025/file/264f2e10479c9370972847e96107db7f-Paper-Conference.pdf#page=26)

### Curator Notes

- Per-prediction linear attention does not imply linear complete-route computation. Parallel latency claims require the actual device/batching assumptions.
- Main results rely on task/scale-specific training; PRC incurs a substantial iterative search budget.
- Heuristic-reference gaps, incomplete baseline coverage and unmatched baseline training/search conditions limit broad dominance claims.
- Formal Table15 prints POMO's TSP5K gap as87.72%, whereas Table1 gives72.1% and87.72 is its objective. The associated61.7% reduction claim is therefore not reused here.
- No multi-seed uncertainty is reported for the main tables. Beyond100K evaluation details and the small-scale PRC budget are incompletely specified.

## Reproducibility

- **Full reading:** all27 formal pages, including scientific AppendicesA-Q; all16 pages of the older arXivv3; all10 official slides; and the complete official poster were freshly read. Original formulas, framework/result figures, representative-node ablation and major tables were visually inspected. The poster PNG is retained and embedded into a one-page PDF solely to record its reading coverage.
- **Publication:** the formal ICLR2025 title/seven authors and four affiliations are verified. The [publisher metadata](https://proceedings.iclr.cc/paper_files/paper/2025/hash/264f2e10479c9370972847e96107db7f-Abstract-Conference.html) explicitly records `citation_publication_date` as **2025-05-01**, independently of any paper-specific acceptance date. A generic conference notification date remains excluded from acceptance metadata. The first-manuscript date2024-03-28 belongs to the precursor's actual arXivv1 history, not to the formal proceedings release.
- **Version identity:** the precursor remains titled [Self-Improved Learning for Scalable Neural Combinatorial Optimization](https://arxiv.org/pdf/2403.19561v3), with six authors and v3 dated2024-05-02. The formal title adds YaoxinWu and calls the training scheme SIT. The curator identifies **precursor-to-formal continuity** from shared distinctive diagrams, algebra and text, rather than claiming arXiv has changed its title or that a publisher supplied an explicit version declaration. Old Figure3/page4 and formal Figure2/page6 retain the same route-node geometry and self-training loop; old Equations3-6/page5 and formal Equations2-4/page5 carry the same endpoint projection/aggregate/broadcast construction; old page15/Equation16 and formal page15/Equation7 use the same10-customer route, depot-bit vector and distinctive alignment explanation. This supports mapping citations of the earlier work to stable ID`sil` while preserving their actual2024 title/authors/version. The manuscripts are **not textually or experimentally identical**: the precursor's20-node RL warm-up, training-round counts and reported PRC scores differ from the formal version. Current notes use formal results.
- **Scientific supplements:** the publisher combined PDF containsA-Q. The manually inspected official ICLR virtual page links the slides and poster, both fully read. OpenReview API access returned403; no claim is made to have retrieved hidden attachments. The complete official code tree has52 entries and no extra PDF/ZIP/TeX scientific file; no explicit missing scientific attachment is identified in the obtained material.
- **Code:** [CIAM-Group/SIL](https://github.com/CIAM-Group/SIL), with separate TSP/CVRP training and greedy/PRC workflows, externally linked data/checkpoints and insertion utilities. README, representative-token construction, selected training/repair functions and test configurations were inspected. The release lists Python3.8.6/PyTorch1.12.1. The PRC example selects1,000 rounds and random insertion, whereas pure greedy disables nearest-neighbor restriction; separately projected last-node tokens implement AppendixC. A configurable1,000-neighbor option exists in the current model and is active in the PRC configuration, though bounded PRC segments are at most1,000. Full checkpoint downloads, benchmark training and reported-result reproduction were not performed.
- **Figure:** complete original Figure2/page6, cropped directly from the formal PDF; this is the training/reconstruction process, not an invented architecture diagram.
