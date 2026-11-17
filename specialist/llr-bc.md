---
id: llr-bc
short_title: LLR-BC
title: Lifelong Learning with Behavior Consolidation for Vehicle Routing
authors:
- Jiyuan Pei
- Yi Mei
- Jialin Liu
- Mengjie Zhang
- Xin Yao
year: 2026
date: '2025-09-26'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/c2c62117283dda155db754e54dbe8d71-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/c2c62117283dda155db754e54dbe8d71-Abstract-Conference.html
institutions:
- Victoria University of Wellington
- Lingnan University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: State/behavior replay with confidence-weighted reverse-KL supports continual TSP/CVRP policy learning across
  distributions and sizes, with explicit retention, reference-quality and backbone exceptions.
code_url: https://github.com/PeiJY/LLR-BC
arxiv_url: https://arxiv.org/abs/2509.21765
---

# Lifelong Learning with Behavior Consolidation for Vehicle Routing

> **TL;DR:** A finite replay buffer of past routing states and action distributions supports continual constructive-policy training. Confidence-weighted reverse-KL consolidation balances retention and adaptation across changing sizes/distributions, with explicit forgetting, backbone and individual-instance exceptions.

## Motivation

Fine-tuning on newly arriving routing distributions can degrade previously learned behavior. Generating arbitrary old-task instances or training all tasks jointly may be unavailable in a sequential stream. LLR-BC retains selected historical decisions rather than requiring unrestricted replay generation, aiming to preserve old-task quality while learning new tasks (Sections1-3).

## Contributions

- A fixed-size reservoir stores partial-route states and historical action-probability vectors.
- Confidence-aware experience weighting emphasizes lower-variance, less-confident historical decisions.
- Decision-seeking behavior consolidation combines current-task reinforcement learning with KL(current policy || buffered policy).
- Six synthetic distribution/scale tasks, five orders, real benchmark transfer, ablations and three base architectures evaluate continual learning.

## Methodology

**Replay.** Constructive states encode partial routes and actions select the next city/customer/depot. Only the final epoch of each task contributes new state/behavior experiences, when the current model is expected to be trained. Reservoir sampling retains each incoming experience with probability buffer_size/number_seen, replacing a uniform stored entry; replay itself samples uniformly. Equal experience retention does not imply equal retention per task, because tasks produce different numbers of decisions. GPU implementation stores batches of states/behaviors rather than individual instances or entire tours (Sections3.1/A.1/C.3).

**Confidence and consolidation.** For an action vector P of length m, confidence is variance(P)/((m?1)/m^2). Weight1?confidence is normalized over replayed experiences, emphasizing uncertain decisions. The consolidation loss is weighted sum_a Q(a)log(Q(a)/P(a)), with Q the current policy and P the buffered teacher. It is added to the new-task policy-gradient loss with alpha=100. The reverse direction discourages assigning mass to actions historically near zero; it does not guarantee an unchanged greedy action or optimal route. Both KL directions have unconstrained minimum Q=P, as AppendixA.3 acknowledges (Sections3.2-3.3).

**Scope and assumptions.** The primary base is POMO, with separate TSP and CVRP networks. Within each native problem, one evolving model transfers across six distribution/scale tasks; cross-TSP/CVRP lifelong learning is explicitly future work. The entry is specialist constructive, despite the word tasks meaning distributions/scales here. Task boundaries and fixed known budgets are used to identify each final epoch; unknown task order does not mean fully boundary-free continual learning. Only model weights and buffer transfer between tasks (Sections3,5/AppendixA).

## Experiments

**Task and compute protocol.** Coordinate distributions are uniform, Gaussian mixture, explosion, compression, grid and ring, with CVRP-specific demand distributions and scales20/50/100. Uniform/ring use20, grid/explosion50, compression/Gaussian100, with capacities30/40/50. Five randomized fixed orders contain all six tasks. Each POMO task uses200epochs; per-epoch problem counts10000/4000/2000 and batch sizes64/32/16 vary with scale. Each test task has1000 fixed unseen instances. Every method/order starts from the same initialization, and each order is run once; standard deviations over orders are not independent training-seed uncertainty. One order takes roughly1.5days on a single A100 (Section4/AppendicesB,C).

**Metrics and references.** AP, forgetting AF/max forgetting AMF, plasticity APl and next-task zero-shot AG normalize average route distance by the best observed method/run performance for that task; table values usually use units1e-3. These are comparative learned-policy metrics, not global-optimum gaps. For example AP4.2 means.0042 relative deviation, not4.2% optimality gap. AF measures degradation from immediately after learning each task, clipping improvements; AMF retains the maximum later degradation. The benchmark CVRPLIB/TSPLIB scores likewise use the best solution found in these experiments rather than published optima (Section4/AppendicesC.2,D.4).

**Retention/adaptation.** Across five orders, CVRP AP4.2 improves fine-tuning23.5 and Feng24.6; TSP AP3.4 improves14.8 and24.1. AG26.7/41.1 also improves the displayed averages. Retention is not universally best: Li inter/intra have CVRP AF0.0/0.0 and TSP.4/.2, below LLR-BC.7/.8, at the cost of weak plasticity. LLR-BC's APl3.5/2.8 improves fine-tuning3.8/3.5 on average, but individual orders differ. Thus the conclusion's blanket superiority on both stability and plasticity requires qualification (Table1/Figures3-4/Tables5,8).

**Absolute quality and non-lifelong comparisons.** On order1, CVRP distances10.72/15.17/11.36/6.56/5.70/13.03 have reported reference gaps3.3/4.3/3.1/1.5/14.1/3.3%. Those CVRP references are generated by HGS, a heuristic, despite the paper calling them optimal; no independent optimality certificate is supplied. TSP references are described as Gurobi-generated, with LLR-BC gaps1.3/2.6/.1/.2/0/2.1%. Multitask POMO is better on CVRP explosion/compression(10.66/15.10 versus10.72/15.17), while LLR-BC is competitive on later tasks. A pretrained INViT comparison has a different training regime, so it is not a matched total-training-budget ranking (Tables6-7/AppendixD.1-D.3).

**Benchmark transfer and failures.** Mean comparative scores are7.88 on CVRPLIB versus fine-tuning8.54 and18.08 on TSPLIB versus38.16, under the stated1e-3 normalization. Many individual cases favor alternatives: X-n153-k22 is23.72 versus fine-tuning0; X-n895-k37 is21 versus0; kroA200 is48.77 versus0; pr1002 is29.88 versus LiBOG0. Zero in these tables means the experiment's best compared result, not a certified optimal tour. The manuscript says maximum scale1001 but includes TSPLIB pr1002; the named instance manifests are the reproducible scope (Tables2,9-10).

**Ablations and applicability.** Removing confidence weighting gives CVRP AP5.2 versus4.9 for the order1 default, but TSP1.8 versus1.7, with mixed forgetting/plasticity cells. Lower alpha10 improves TSP AP1.3 versus1.7 while worsening CVRP13.2 versus4.9; fixed settings are not uniformly best. Instance-level replay substantially hurts CVRP AP35.4. Omni and INViT can incorporate the framework, but Omni CVRP plasticity worsens16.9 to19.9, and INViT TSP forgetting worsens.6 to4.5/max forgetting.6 to6.3 while AP ties14.5. AppendixD.6 mistakenly calls the latter CVRP despite Table4 and its accompanying TSP explanation. Different backbone normalizations are independent, so AP values across bases should not be directly ranked (Tables3-4/AppendixD.5-D.6).

**Memory/time.** Default buffer1000 and replay16 are measured in experience batches, not1000 individual state pairs. The POMO CVRP buffer occupies about400MB. Its.01% statistic compares1000 stored batches with approximately8.75million generated batches. The stated ideal extra20/8/4% overhead uses replay4, not default16, and excludes some implementation effects. Reported whole-stream additional training is at most8hours; inference uses the original base model with no replay overhead. Equal buffer counts across instance-based and state-based baselines need not imply equal bytes or decision diversity (AppendicesA.5,C).

## Limitations

### Discussed in the Paper

Known task boundaries/final epochs and fixed budgets are assumed. Cross-native-problem lifelong learning, continuous task evolution and other distance matrices remain future work. Fixed replay size16 can overemphasize older large-scale experiences when learning smaller tasks or underconsolidate when learning larger tasks. Memory and training overhead accompany retention, and lower confidence may reflect genuinely multiple equally good actions rather than model uncertainty.

### Curator Notes

The approach is empirical regularized reinforcement learning, without a theorem guaranteeing no forgetting, unchanged argmax actions, optimal tours or convergence under arbitrary task streams. Historical behavior can itself be suboptimal. Variance is a confidence heuristic, not calibrated uncertainty; reverse-KL mode-seeking language describes an optimization tendency, not a universal greedy-decision preservation result.

The main comparisons modify earlier methods for this stream setting: Li/Feng receive task-specific instance reservoirs, alpha=.5 is selected without a published recommendation, and Feng's fixed n-by-n component is removed to support changing sizes. These are disclosed adaptations rather than exact reproductions of the original algorithms. One run/order and multiple correlated orders limit statistical interpretation. The HGS reference and best-observed normalization distinctions above are essential to interpreting quality.

The main text's all-metric superiority does not cover the explicit retention/backbone/instance exceptions. AppendixC.1 says N^2 trajectories per batch, but N starts per instance and batch C imply C*N; the release uses the actual configured batches. Confidence normalization in the current implementation is performed within each replayed batch before averaging batches. The available release contains POMO TSP/CVRP pipelines; paper-reported Omni/INViT experiments should not be described as independently reproduced by that archive.

## Reproducibility

- **Publication:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c2c62117283dda155db754e54dbe8d71-Abstract-Conference.html), official HTML date April20,2026. Five authors and Victoria University of Wellington/Lingnan affiliations checked against page1. Author arXiv link2509.21765 is recorded as a separate preprint entry.
- **Coverage:** all30 formal pages, references, AppendicesA-E, algorithms/generation definitions and all full result/forgetting/learning figures read; key math/results rendered. Publisher actions have no supplemental archive. Ordinary OpenReview sEdGLzgf6s API returned403. Full author77,895,079-byte ZIP has no PDF/TeX/notebook scientific attachment; its framework PNG and full scientific poster were read/inspected. Official ICLR event10007077 scientific poster PNG2,937,394bytes was separately downloaded/read and checked.
- **Code:** [PeiJY/LLR-BC](https://github.com/PeiJY/LLR-BC). Full README/requirements and task-specific pipelines inspected, including reservoir add/sample, masked historical probabilities, reverse-KL direction, variance/smoothed weighting, final-epoch collection and separate task models. Requirements pin PyTorch2.5.1+cu121/NumPy1.26.4 and related CUDA packages. Initial models, synthetic tests and benchmark instances are provided; training and solver benchmarks were not rerun.
- **Relations:** fifteen explicit body/bibliography identities match catalogue entries. The GOODRL bibliography item has no matching body citation in the complete main/appendix scan, so it does not create an edge merely by appearing in the reference list.
