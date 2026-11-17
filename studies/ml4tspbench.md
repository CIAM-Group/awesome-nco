---
id: ml4tspbench
short_title: ML4TSPBench
title: 'Unify ML4TSP: Drawing Methodological Principles for TSP and Beyond from Streamlined Design Space of Learning
  and Search'
authors:
- Yang Li
- Jiale Ma
- Wenzheng Pan
- Runzhong Wang
- Haoyu Geng
- Nianzu Yang
- Junchi Yan
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/a3dc6e903082902d8e916bb9fccbfcbc-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/a3dc6e903082902d8e916bb9fccbfcbc-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
- Massachusetts Institute of Technology
scope: study
paper_type: analysis
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Maximum Independent Set
summary: A modular TSP study recombines learning and search, evaluates conditional design principles, and demonstrates
  separate CVRP and MIS adaptations.
code_url: https://github.com/Thinklab-SJTU/ML4TSPBench
---

# Unify ML4TSP: Drawing Methodological Principles for TSP and Beyond from Streamlined Design Space of Learning and Search

> **TL;DR:** A modular study recombines TSP learning and search, identifies useful design choices under explicit budgets, and tests separate adaptations to CVRP and MIS. Its solver factory is a collection of configurations and checkpoints.

## Motivation

Neural TSP pipelines interleave representations, supervised or label-free objectives, decoding, test-time optimization and heuristic search. Comparing complete pipelines can hide which components improve solutions and whether lower prediction loss actually translates into better tours. The paper constructs a reusable design space to examine this interaction (PDF pp. 1–3).

## Contributions

ML4TSPBench separates four learning functionalities—edge prediction, edge-regret prediction, solution generation and sequential node prediction—from training objectives and solving-stage components. It reproduces representative pipelines, recombines their components and proposes node-wise probability normalization, symmetry-aware variants and alternative initializations for a decoupled MCTS search (pp. 3–10).

The proposed principles concern correlations between decisions, equivalent solution representations, instance-specific online optimization and compatibility with search. These are supported by ablations and examples, rather than approximation or optimality guarantees. Appendix C develops a reusable ML4CO-Kit skeleton and evaluates selected ideas separately on CVRP-50 and SATLIB MIS (pp. 19–22).

## Methodology

Offline objectives include edge classification, approximate edge-regret regression, generative distribution learning, penalty-based unsupervised learning, REINFORCE and meta-learning. At inference, optional active search updates model/prediction parameters, while diffusion gradient search repeatedly perturbs and denoises an incumbent with objective guidance. Feasible construction then combines with optional two-opt, relocate/guided local search or MCTS (pp. 3–6, 29–32).

Node-wise normalization couples edge scores around each node before clipping and decoding. It promotes consistency but does not define a guaranteed feasible distribution over Hamiltonian tours. Symmetry interventions include undirected representations for the reproduced generative models, randomized starting nodes for edge-prediction RL, and multistart/symmetry baselines for sequential policies. The MIS adaptation uses a deliberately relaxed LinSAT normalization, followed by feasible decoding (pp. 7–9, 21–22).

The MCTS variant separates tour initialization from improvement, changes two-opt selection, and refreshes search randomness for TSP-500. Random MCTS therefore means random initial tours with learned heatmap-guided improvement, not removal of the neural guidance. Its quality depends on initialization count, heatmap compatibility and time budget (pp. 6, 9, 27–32).

## Experiments

Main tasks are uniformly sampled Euclidean TSP-50/100/500, with 1,280/1,280/128 test instances and Concorde reference tours. Supervision is produced by LKH with size-dependent trial budgets, so training labels are not generally certified optimal. Larger models are initialized through a TSP-50 → TSP-100 → TSP-500 curriculum; these are separate checkpoints. Tests use RTX3090 GPUs and an AMD Threadripper 3970X CPU (pp. 6, 27, 36–37).

With greedy decoding, node normalization reduces TSP-100 Drop from 7.078% to 2.721% at similar reported inference time. On TSP-500, the reproduced generative symmetry intervention reduces greedy Drop from 9.639% to 6.695%, with runtime increasing from 1.2 to 1.6 s. Active/gradient search and additional samples often improve quality with substantial extra computation; lower training loss and stronger initial tours do not uniformly predict the final MCTS result (pp. 7–9, 26–29).

The selected normalized edge-prediction + 50 random initializations + MCTS pipeline reaches 0.142% Drop on TSP-500 at 55.3 s. This is a useful recomposition result, not superiority over every classical solver: the same table reports LKH at 0.072% in 4.2 s and 0.014% in 26.3 s. Supervised/generative and non-autoregressive advantages are conditional on the models and search settings compared; RL policies retain very fast small-instance configurations (pp. 10, 18–19).

Generalization tests use TSP-500-trained models on TSP-1000, rescaled TSPLIB instances and selected shifted distributions. The actual TSPLIB example comprises 20 instances with 201–1002 nodes, with rescaled real-valued Euclidean distances and newly computed Concorde references. It should not be equated with the entire original TSPLIB collection or its rounded distance convention (pp. 10, 24–26).

Beyond TSP, MIS normalization changes SATLIB mean solution size from 421.692 to 422.098 while increasing runtime from 22.7 ms to 0.545 s; generative gradient search changes size 424.496 to 425.006 at 1.101 versus 2.380 s. CVRP-50 multistart/symmetry ablations also improve selected configurations, using batch size 100 and HGS reference solutions. These are problem-specific adaptations, not transfer of a single shared checkpoint (pp. 21–22).

## Limitations

### Discussed in the Paper

The authors emphasize that the detailed investigation centers on TSP. Other problems require new constraints, decision variables and problem-specific search components. Regret supervision is expensive, and the implemented sequential RL baselines encounter difficulties training at larger sizes. Supervised labels and more search carry acquisition or computation costs (pp. 19–22, 27, 37).

### Curator Notes

The ablations reduce some confounding without holding all architectures or compute equal. Although the general architecture discussion says dimensions and layer counts are aligned, the detailed defaults are GCN 12 layers/256 dimensions, GAT 3/128 and SAG 3/64. Supervision, training schedules, sparse neighborhoods, sampling and search differ as well. The tables' standard deviations concern test-instance gaps; they do not document uncertainty over independently retrained models (pp. 23–24, 32, 36–37).

Some printed implementation details need reconciliation for exact reproduction. Appendix F.3 gives MCTS time slices of 0.005/0.020/1.000 s for 50/100/500 nodes; Appendix I.1 instead states a maximum time of one tenth the node count. A selected eight-sample generative result also has differing times across Tables 7 and 9. This audit preserves the relevant table and pipeline context rather than assuming one universal timing rule. The MCTS initialization/heatmap scatter experiment additionally uses one TSP-100 instance with 100 samples, so its mechanism evidence should not be read as a population guarantee (pp. 10, 18, 28–29, 32, 36).

## Reproducibility

- Publication record: [ICLR 2025](https://proceedings.iclr.cc/paper_files/paper/2025/hash/a3dc6e903082902d8e916bb9fccbfcbc-Abstract-Conference.html).
- Source text: [paper](https://proceedings.iclr.cc/paper_files/paper/2025/file/a3dc6e903082902d8e916bb9fccbfcbc-Paper-Conference.pdf).
- Implementation linked by the authors: [code](https://github.com/Thinklab-SJTU/ML4TSPBench).

The author repository supplies separate training/test scripts, a modular library, dataset/checkpoint links and a pinned Conda environment including Python 3.8.18, PyTorch 2.0.1 and CUDA 11.7 packages. Its legacy implementation and reorganized library should be distinguished when selecting exact commands. The [publisher metadata](https://proceedings.iclr.cc/paper_files/paper/2025/hash/a3dc6e903082902d8e916bb9fccbfcbc-Abstract-Conference.html) explicitly records `citation_publication_date` as **2025-05-01**, independently of any paper-specific acceptance date.

This audit read all 37 proceedings pages, the full bibliography and Appendices A–J, including code examples, equations and dense recomposition tables. Twelve key pages were visually inspected. The publisher lists no separate supplement; both OpenReview API versions returned 403, and the complete 515-file author-repository inventory contains no scientific PDF/ZIP attachment. These checks establish source coverage, without claiming to have rerun training or search.
