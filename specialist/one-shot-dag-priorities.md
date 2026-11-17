---
id: one-shot-dag-priorities
short_title: One-Shot DAG Scheduler
title: Neural DAG Scheduling via One-Shot Priority Sampling
authors:
- Wonseok Jeon
- Mukul Gagrani
- Burak Bartan
- Weiliang Will Zeng
- Harris Teague
- Piero Zappi
- Christopher Lott
year: 2023
date: '2023'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=WL8FlAugqQ
venue: ICLR
paper_url: https://openreview.net/forum?id=WL8FlAugqQ
institutions:
- Qualcomm AI Research
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- DAG Scheduling
summary: One Topoformer pass predicts priority logits; Gumbel permutations and list
  scheduling yield task-specific DAG schedules, with explicit sample budgets and finite-time
  CP-SAT comparisons.
---

# Neural DAG Scheduling via One-Shot Priority Sampling

> **TL;DR:** Encode a DAG once, sample full priority permutations cheaply, and decode them with resource-aware list scheduling. Results support fast task-specific scheduling, with quality depending on sample budgets; they do not establish shared-checkpoint generalism or optimality.

## Motivation

Autoregressive neural schedulers repeatedly encode a changing graph, making inference expensive on large computation graphs. Classical list scheduling is fast but depends on hand-designed priorities. This work learns all node priorities in one graph-encoder pass and retains conventional scheduling to enforce dependencies and resource availability.

## Contributions

The paper combines Topoformer node embeddings, a scalar logit head, one-shot Gumbel priority sampling and list scheduling. Training uses REINFORCE with cost standardization and logit-norm regularization. JSSP, resource-constrained TPC-H DAGs and synthetic/proprietary computation graphs measure the quality/runtime tradeoff of greedy decoding and best-of-16/64/256 samples. Ablations compare training choices and genetic search seeded by neural priorities.

This is a **specialist/constructive** solver. Appendix F trains separate models for each JSSP setting, TPC-H setting, synthetic distribution/size and real-graph dataset. Several scheduling formulations under one architecture do not demonstrate one unchanged checkpoint across native problems. Its action is a node priority, rather than arbitrary hardware assignment or kernel selection.

## Methodology

A DAG carries precedence edges, operation durations, resource requirements and a prescribed machine type for each node. A node can start after its predecessors complete and when machine-type capacity is sufficient. List scheduling processes ready nodes by decreasing priority and advances to the next completion event. JSSP has one resource per machine; TPC-H uses one type with capacity 6,000; computation graphs use three types with capacities 1, 1 and 4 (Appendix B).

Topoformer and an MLP produce one logit per node. Independent Gumbel perturbations are drawn once and sorted into a full permutation. The permutation need not be a topological order: list scheduling enforces precedence. Equation 10 gives the full Plackett–Luce probability over all remaining nodes, rather than a product restricted to the ready set. Equation 11 applies REINFORCE to this latent permutation and its decoded makespan. Several permutations can decode to one schedule; that fact alone does not invalidate the latent-variable gradient.

Algorithm 1 standardizes sampled makespans within each graph/batch and adds mean-squared-logit regularization with coefficient 0.001. Appendix F uses epsilon 0.1 in the standardization denominator. These practical modifications should be distinguished from the unmodified expected-makespan objective. Appendix A's binary illustration assumes distinct logits and a fixed positive standardization constant: population standardization fixes their absolute difference, permitting only two Bernoulli distributions. Equal logits give an undefined unstabilized denominator. This is a bounded illustration, not a theorem about all scheduling networks' expressivity.

Inputs include duration, nonconstant resource requirement, machine-type one-hot encoding, forward/backward critical-path durations and 20-dimensional Laplacian positional encodings from the undirected graph. Greedy inference sorts raw logits. Sampling inference sorts perturbed logits, decodes candidates and returns the best makespan. One encoder pass does not remove sorting, feasibility decoding, feature computation or multi-sample evaluation costs.

## Experiments

**JSSP.** Each setting uses 100 training and 50 unseen test graphs. For 50 jobs/20 machines, Table 1 reports greedy makespan 3,108.56 in 0.049 s and S(256) 2,997.10 in 1.527 s, versus L2D 3,452.70 in 3.711 s. L2D is retrained on this fixed limited dataset, unlike its original fresh-instance training. Fast heuristics remain quicker: SPT takes 0.008 s. Tables 5–6 cover five job/machine configurations.

**TPC-H.** Each setting has 50 training and ten test graphs. For TPC-H-50, S(256) obtains 8,694.4 in 0.540 s versus PPO-BiHyb 8,905.4 in 66.484 s, while CP-SAT obtains the better makespan 8,629.4. CP-SAT has a 24-hour limit; only three TPC-H-50 graphs are certified optimal, and TPC-H-150 runs exhaust memory. Other entries are time-limited incumbents, so better neural values elsewhere are not evidence of outperforming certified optima.

**Computation graphs.** Synthetic training uses 3,000 graphs per distribution/size and 300 test graphs; proprietary data has 92 training and 23 test graphs. On 1,000-node layered graphs, S(256) reports speedup 4.889 with 2.418 s scheduling time, versus MOPNR 4.745 with 0.075 s. On the largest real-graph bucket, greedy reports 2.846 with 0.060 s and S(256) 2.860 with 2.001 s, versus PPO-BiHyb 2.798 with 322.793 s. Speedup means summed modeled node durations divided by modeled schedule makespan, rather than measured accelerator throughput.

**Budgets.** Appendix F selects the best of five training seeds for JSSP/computation graphs and ten for TPC-H, using 1,000 or 2,000 priorities per update. Selected-run tables do not give across-seed confidence intervals. Appendix H seeds genetic search with 256 neural priorities and runs 100 generations/population 1,000. Gains are often small or absent: layered-graph results change from 4.889/2.418 s to 4.997/723.245 s. TPC-H-100 remains 14,964.7 while runtime rises from 2.270 to 965.119 s.

## Limitations

Quality is heuristic and depends on sampling/search budgets. Task/size-specific retraining and best-seed selection limit generalization claims. Fixed small training sets change baseline protocols; proprietary graphs prevent complete public replication. Prescribed machine types and simplified resource models do not establish hardware-level performance guarantees. CP-SAT timeouts and memory failures remain essential comparison conditions.

## Reproducibility

- All 21 pages of the identified ICLR 2023 conference PDF were read, including the full bibliography and integrated Appendices A–H, their calculation, data, baselines, architecture, ablations and search tables. Eight central method/proof/result pages were rendered and inspected. Registered public-mirror SHA-256: `fda10cd1f6b29832601fd5b7838d6571796ad169a1ec479191d876fcdc8ad737`.
- The formal header identifies ICLR 2023 and seven Qualcomm AI Research authors; the first two contributed equally. The author's publication page links this work but labels its year 2022; the formal conference header governs here. No exact publication day is asserted.
- The [OpenReview forum](https://openreview.net/forum?id=WL8FlAugqQ) and API v1/v2 attachment queries return verification/403 responses saved in the cache. The scientific appendix is integrated; no separately required scientific attachment is specified in the text. The author entry has a PDF link but no verified implementation repository. Baseline/Pymoo links are not released code for this work.
- Five relations have explicit body citations and matching full references: Attention Model, Learning CO over Graphs, L2D, NeuroLKH and PPO-BiHyb. Architectural resemblance alone adds no edge. This audit does not retrain networks or rerun scheduling benchmarks.
