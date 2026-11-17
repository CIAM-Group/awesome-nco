---
id: eformer-an-effective-edge-based-transformer-for-vehicle-routing-problems
short_title: EFormer
title: 'EFormer: An Effective Edge-based Transformer for Vehicle Routing Problems'
authors:
- Dian Meng
- Zhiguang Cao
- Yaoxin Wu
- Yaqing Hou
- Hongwei Ge
- Qiang Zhang
year: 2025
date: '2025-06-19'
publication:
  date: '2025'
  source_url: https://www.ijcai.org/proceedings/2025/954
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2025/954
institutions:
- Dalian University of Technology
- Singapore Management University
- Eindhoven University of Technology
- Key Laboratory of Social Computing and Cognitive Intelligence (DUT), Ministry of Education, China
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Asymmetric Traveling Salesman Problem
summary: Mixed-score edge precoding supplies temporary node features to parallel graph and node encoders; a shared-query
  decoder constructs routes autoregressively. TSP, CVRP and ATSP use separately trained models; an additional coordinate-input
  variant and stochastic augmentation improve selected quality/budget trade-offs.
arxiv_url: https://arxiv.org/abs/2506.16428
code_url: https://github.com/Regina921/EFormer
figure:
  path: paper-assets/eformer-an-effective-edge-based-transformer-for-vehicle-routing-problems/framework.png
  alt: Edge matrix with zero and random one-hot seeds enters a precoder, parallel graph/node encoders and a masked
    autoregressive decoder.
  caption: 'Original Figure 2: the EFormer edge-based precoder, parallel encoders and decoder.'
  source_url: https://www.ijcai.org/proceedings/2025/0954.pdf#page=4
---

# EFormer: An Effective Edge-based Transformer for Vehicle Routing Problems

> **TL;DR:** EFormer converts edge costs into temporary node embeddings, encodes graph and node information in parallel, and constructs routes with a masked autoregressive decoder. It is **specialist/constructive**: TSP, CVRP and ATSP are separately trained applications of one architecture, without evidence of a single cross-problem checkpoint.

## Motivation

A coordinate-only policy must infer travel costs from geometry, whereas practical costs may be given directly as a distance matrix. EFormer learns a matrix-based representation while retaining node-style autoregressive decoding. Its edge-only description concerns the spatial/cost representation: CVRP still needs demands, capacity and depot state. The public CVRP precoder explicitly embeds demands, and the decoder receives remaining load. It would be inaccurate to say a cost matrix alone defines a capacitated instance. [Motivation/precoder.](https://www.ijcai.org/proceedings/2025/0954.pdf#page=1)

## Contributions

- A MatNet-inspired mixed-score precoder combines edge costs, zero row embeddings and randomized one-hot column embeddings to obtain temporary node representations.
- Parallel residual gated GCN and attention encoders process graph-derived and node-derived representations in separate feature spaces.
- A decoder integrates the two context queries and attention streams to construct routes; random seed embeddings enable repeated instance augmentation.
- Separate TSP/CVRP studies, large-size/distribution transfer, TSPLIB/CVRPLIB, a coordinate-input EFormer-node variant and an ATSP extension evaluate the architecture. [Method/contributions.](https://www.ijcai.org/proceedings/2025/0954.pdf#page=2)

## Methodology

### Precoding and parallel encoders

Mixed-score attention combines the learned dot-product score and each supplied edge cost through a small MLP. Random one-hot seeds allow different encodings and candidate routes for the same instance. These repeated encodings are stochastic test-time augmentation, not a learned improvement operator editing a previous route.

A k-nearest-neighbor graph uses k=20. Six residual gated GCN layers and three MLP layers form the graph branch; six multihead-attention layers form the node branch. The standard embedding/GCN hidden width is256, with16 attention heads and feedforward width512. Sparse graph processing does not imply that every dense precoder/node-attention operation has linear complexity. [Equations1-9; detailed AppendixA.](https://arxiv.org/pdf/2506.16428v1#page=11)

### Decoding, learning and task variants

The first/current-node context is computed separately for the two representations and combined into one query; separate attention results are merged before clipped logits, feasibility masks and softmax. POMO-style REINFORCE uses multiple starting trajectories and their mean return as a shared baseline. Even the setting labelled greedy(x1) chooses the best of N starting trajectories; x8/x128 additionally repeat the randomized encoding. These budgets must not be read as one isolated greedy trajectory.

EFormer-node removes the precoder and supplies **coordinates and edge distances** directly to the remaining parallel encoders. The ATSP experiment retrains the same architecture on asymmetric matrices generated using MatNet's procedure. AppendixB explicitly says TSP and CVRP are trained separately, and AppendixD changes the ATSP training data; neither architectural reuse nor size transfer proves generalist checkpoint sharing. [Decoder/training; AppendicesB-D.](https://arxiv.org/pdf/2506.16428v1#page=12)

## Experiments

### Training and comparison protocol

The paper uses one TeslaV100-SXM2-32GB,100,000 generated instances per epoch, Adam learning rate1e-4 and decay factor.1. TSP20/50 train510epochs; TSP100 and CVRP train1010epochs. Main tests contain10,000 uniform instances. Larger-size tests use128 instances at100/200/300/500 nodes; explosion/grid/implosion transfer uses10,000 instances. Baseline GCN-BS is modified to edge-only inputs, and MatNet is retrained/adapted for symmetric TSP and CVRP; these are not all untouched original checkpoints. GREAT results are taken from its paper. [Complete AppendixB1.](https://arxiv.org/pdf/2506.16428v1#page=11)

Table times are reported in minutes for the stated evaluation collections, not per-instance milliseconds. TSP gaps use Concorde references; CVRP uses LKH reference solutions, which need not be optimal. No multiple-training-seed uncertainty or complete wall-clock training duration is supplied.

### Main edge-based results

On TSP100, EFormer x1/x8/x128 gives0.324/0.115/0.045% gaps in1.22/6.81/66.55min, versus MatNet0.940/0.410/0.170% in.52/5.28/60.11min. Quality is better at the displayed corresponding budgets, with additional runtime. On CVRP100 the gaps are1.259/.830/.563% and times.98/6.86/85.65min; HGS gives a lower reference-relative cost(-.401%) but much longer total time. Negative CVRP gaps indicate improvement over the selected LKH reference, not a proof of beating an optimum. [Formal Table1.](https://www.ijcai.org/proceedings/2025/0954.pdf#page=6)

k=20 and the full architecture perform favorably in the displayed component ablations, but the CVRP50 full-model row in Table2 differs from Table1:10.474/1.231% versus10.457/1.067% at x1. These distinct printed rows are retained without pretending they are one numerical run. Removing the precoder also disables its random-seed augmentation, so that ablation changes more than one inference capability.

### Transfer and variants

At500 nodes, x8 gaps remain23.457% on TSP and11.865% on CVRP: relative improvement over edge-based baselines does not establish near-optimal large-scale performance. The greedy TSP300 EFormer cost15.077 is worse than MatNet14.930, while augmented EFormer improves the displayed comparison. TSPLIB/CVRPLIB grouped tests also have sizable residual gaps, including26.924%/15.325% for the301-500 groups at x8. These are benchmark transfers, not a deployed logistics study. [Formal Table3/extended Table4.](https://arxiv.org/pdf/2506.16428v1#page=13)

EFormer-node x8 gives.027% on TSP100 and.498% on CVRP100 in Table6. The adjacent prose's CVRP100 figure.4731% differs from that table, so this note uses the explicit table. It improves several node-based comparisons, while broad statements of universal superiority are qualified: edge-only EFormer x8 on CVRP100(.830%) is worse than POMO x8(.689%) and LEHD RRC50(.524%). At CVRP20, edge-only x8(.098%) also slightly outperforms node-variant x8(.114%), so extra coordinates do not uniformly improve every row.

The separately trained ATSP50 extension evaluates10,000 instances. EFormer x1/x8/x128 gaps1.105/.399/.143% are close to or better than MatNet1.350/.472/.144%, with greater corresponding runtime(.27/1.65/25.16 versus.15/1.23/16.55min). This supports an architecture extension, not zero-shot transfer from a TSP checkpoint. [AppendicesC-D, Tables6-7.](https://arxiv.org/pdf/2506.16428v1#page=16)

## Limitations

Dense representation/attention and autoregressive rollout constrain scalability; a lighter architecture is future work. Training is task/size specific, augmentation adds substantial compute, and gaps grow on larger or shifted benchmarks. Several tables/prose passages contain inconsistent printed values, so exact table reproduction would require the original experimental configuration and raw outputs. No convergence, approximation-ratio or global-optimality theorem is established.

The inspected public snapshot's TSP100 training script defaults to510epochs, whereas AppendixB specifies1010 and released checkpoints include1010(and longer) runs. This is a concrete configuration distinction, not evidence that the paper's stated1010-epoch experiment never occurred. No model training or end-to-end table reproduction was performed for this review.

## Reproducibility

- Formal IJCAI2025 DOI10.24963/ijcai.2025/954, pages8582-8590, and both read PDFs give six authors, with Hou corresponding. The arXiv abstract metadata's five-author count does not replace the complete byline. DUT, SMU, TU/e and the DUT Ministry-of-Education laboratory are retained with their actual affiliations.
- Publication precision remains **2025**: official publisher BibTeX says August, while publisher-deposited Crossref says September. The front date separately records primary arXivv1 first posting2025-06-19; no acceptance date is inferred.
- **All nine formal pages, all17pages of arXiv2506.16428v1, and the complete one-page official poster were read**, including the full bibliographies and AppendicesA-D. All methodological figures, formulas and main/extended result tables were rendered and viewed. The formal paper itself points to the arXiv appendices.
- The [official repository](https://github.com/Regina921/EFormer) was inventoried at SHA6abdd7aac7215dff1329cbfc7b7448f47f2e2b49:42entries, one README and one scientific poster, with no TeX/notebook or separate proof PDF. Releases are empty. The complete README and relevant CVRP demand/load and per-task training configurations were inspected.
- The author-linked HuggingFace data/model archives were manually inventoried using their actual ZIP central directories:33members each, exclusively directories, `.pt` checkpoints and `.txt` datasets; no additional scientific manuscript/proof document. These were **inventoried**, not represented as trained, executed or fully downloaded. The README lists Python>=3.8, PyTorch>=2.0.1 and dataset/checkpoint placement.
- Complete original Figure2 is cropped from formal PDFpage4, rectangle(45,49,568,201), at4x and actually viewed. Internal relationships use explicit body citations and matching references; extra bibliography-only items in the longer preprint are not automatically converted to citation edges. The cited BQ-NCO Generalizable title is the identified2301.03313 preprint version of the stable formal representative, not a different paper.
