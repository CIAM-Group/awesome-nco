---
id: gms-multigraph-routing
short_title: GMS
title: 'Beyond Simple Graphs: Neural Multi-Objective Routing on Multigraphs'
authors:
- Filip Rydin
- Attila Lischka
- Jiaming Wu
- Morteza Haghir Chehreghani
- Balázs Kulcsár
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/7e0c50ca569760d0b9da9149db6a727f-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/7e0c50ca569760d0b9da9149db6a727f-Abstract-Conference.html
institutions:
- Chalmers University of Technology
- University of Gothenburg
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Multi-Objective Traveling Salesman Problem
- Multi-Objective Capacitated Vehicle Routing Problem
- Multigraph Multi-Objective Traveling Salesman Problem
- Multigraph Multi-Objective Capacitated Vehicle Routing Problem
- Multigraph Multi-Objective Traveling Salesman Problem with Soft Time Windows
summary: Separate GREAT-based routing models choose parallel edges directly or prune before node decoding, with
  explicit quality/resource trade-offs on synthetic multi-objective multigraph problems.
code_url: https://github.com/filiprydin/GMS
figure:
  path: paper-assets/gms-multigraph-routing/framework.png
  alt: Original GMS Figures1 and2, showing autoregressive edge construction and dual-head edge pruning followed
    by node construction.
  caption: 'Figures1–2: original GMS-EB and GMS-DH architectures.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/7e0c50ca569760d0b9da9149db6a727f-Paper-Conference.pdf#page=5
---

# Beyond Simple Graphs: Neural Multi-Objective Routing on Multigraphs

> **TL;DR:** GMS explicitly chooses between parallel edges in multi-objective routing. GMS-EB selects edges autoregressively, while GMS-DH first selects one parallel edge per ordered node pair and then constructs a node route. Separate task/distribution models expose a useful quality/runtime trade-off on synthetic asymmetric and multigraph benchmarks, including soft time-window violations.

## Motivation

Between two locations, different paths can trade distance against travel time. A node sequence alone then leaves the actual path unspecified, while a simple graph discards potentially useful alternatives. Existing coordinate-based multi-objective routing architectures do not directly solve this edge-choice problem. The cited real-road cost savings motivate the representation; they are results of prior studies, not GMS's own real-road experiment. [pp.1–3,15–17]

## Contributions

- A GREAT graph-edge encoder supports explicit parallel-edge representations.
- GMS-EB couples node order and parallel-edge choice through an autoregressive edge decoder.
- GMS-DH combines non-autoregressive pruning with autoregressive node construction, sharing an encoder across those stages.
- Experiments cover asymmetric simple graphs, multiple parallel edges, different objective counts, larger instances and a soft-window multigraph problem. [pp.3–10,25–34]

## Methodology

**Preference decomposition.** The main GMS training reward is the negative Chebyshev-scalarized objective, conditioned on a simplex preference vector. A hypernetwork generates decoder weights; the initial encoder is preference-agnostic and can be reused across preferences. Linear scalarization is also evaluated. Proposition1 preserves the scalar optimum after selecting minimum-linear-cost parallel edges for **additive MOTSP**. It does not establish an equivalent rule for a nonadditive Chebyshev objective or time-window-violation counts. Solving finitely many subproblems approximately does not certify the complete Pareto front. [pp.3–6,18,24–25]

**Encoder.** Node-based GREAT aggregates incident edge information into intermediate node features and then updates edges using their endpoint features. Residual connections retain differences between parallel edges. The formal setup retains all relevant edge embeddings before pruning. [pp.4,18–19]

**GMS-EB.** The edge-based multi-pointer decoder scores outgoing edges using initial/last-edge, graph and visited-edge context, subtracts a scalarized edge cost, applies tanh clipping and masks inadmissible moves. Selecting an edge specifies both the next node and the path used to reach it. Under the paper's POMO accounting, its decoding scales as O(MN⁴) for N nodes and M parallel edges, versus O(N³) for node decoding. These are the stated implementation/rollout accounting, not lower bounds ruling out more efficient implementations. [pp.4,18]

**GMS-DH.** The selection head independently chooses one edge per ordered node pair before route rollout. Its two extra GREAT layers and preference-conditioned scores operate on shared encoder features. A final GREAT layer and two Transformer layers produce node embeddings for a second, node-based multi-pointer decoder. The fixed edge choice cannot adapt to the later partial-tour context. The early preference-agnostic encoder is reused across preferences, unlike pruning before encoding. [pp.5,18–19]

**Learning.** Both heads use REINFORCE with POMO-style average-reward baselines. The pruning reward is approximated by the best of K2 constructed tours on that pruned graph; it is not an exact optimum oracle. During training K1=4 pruning samples and K2=N routing starts are used; inference uses K1=1. AppendixD specifies five initial simple-XASY pretraining epochs and blocks selection-loss gradients into the shared encoder, while routing loss still trains that encoder. [pp.6–7,19–20]

**Classification:** Specialist / constructive. Problem-specific features, environments and separately trained checkpoints are used. The paper evaluates a common architecture across tasks, rather than one shared multi-task checkpoint. Both architectures construct routes; the pruning stage does not edit an incumbent complete solution. [pp.7,19,22–23; release task-specific model layout]

## Experiments

| Setting | Actual formulation/protocol |
| --- | --- |
| Simple-graph MOTSP |Two independent total distances; Euclidean, triangle-inequality TMAT or independent asymmetric XASY distances |
| Simple-graph MOCVRP |Total distance and longest vehicle route; demands1–9, capacities30/40/50 for20/50/100 customers |
| Multigraph MOTSP |Two competing total distances; FLEX or FIX parallel edges |
| Multigraph MOCVRP |Two conflicting **total** distances, rather than total distance plus makespan |
| Multigraph MOTSPTW |Number of violated windows and total distance; zero service time, no waiting, fixed depot |
| Multigraph distributions |FLEX samples independent edge vectors and removes dominated choices; FIX sorts objective attributes in opposing order; neither ensures triangle inequality |
| Training |Usually200 epochs ×100,000 generated instances; batch64; Adam10⁻⁴; embeddings128 and eight heads |
| Curriculum |For50 nodes:100 epochs at20 then100 at50. DH100:100/50/50 epochs at20/50/100. EB100:100/100/10, totaling210 |
| Evaluation |Generally200 instances and101 bi-objective preferences; size-generalization tables use100 instances; eight scaling augmentations when marked |
| Tri-objective tests |MOTSP/MGMOTSP,105 or1,035 neural preferences; classical scalarized baselines use105 |
| Hardware |One48GB NVIDIA Tesla A40 for neural runs; Intel Xeon Gold6338, eight parallel CPU processes for classical methods |

Reference bounds for normalized hypervolume depend on task, size and distribution. For example, Bi-MOTSP100 uses(60,60), FLEX multigraph TSP uses the same bound, while FIX uses(N,N); simple CVRP100 uses(60,3). HV is higher-is-better, and gaps are relative to the best displayed method, not certified optimal Pareto sets. Runtime entries are totals for the indicated instance set. [pp.7–8,19–24,32–34]

**Main selected100-node comparisons:**

| Task/distribution | GMS-EB HV gap/time | GMS-DH HV gap/time | Stronger quality reference |
| --- | --- | --- | --- |
| MOTSP/XASY |3.03% /3.6min |4.87% /20s |LKH0% /32min |
| MOTSP/XASY, augmented |2.76% /28min |3.85% /2.6min |LKH0% /32min |
| MGMOTSP/FLEX2 |1.81% /9.1min |2.11% /49s |LKH0% /31min |
| MGMOTSP/FLEX2, augmented |1.47% /1.2h |1.61% /6.6min |LKH0% /31min |
| MGMOCVRP/FLEX2 |4.08% /10min |4.94% /1.0min |HGS0% /75h |
| MGMOCVRP/FIX2, augmented |2.38% /1.4h |3.05% /8.1min |HGS0% /74h |

These show the EB/DH trade-off, not that either dominates every baseline in both time and quality. Augmented EB can already be slower than LKH. On simple-graph CVRP, augmented EB is the best of the displayed methods; that comparison has no HGS row for the nonadditive distance/makespan objective. [p.9,Table1]

- **Soft windows:** For FLEX2/FIX2 at50 nodes, augmented EB HV is.90/.93 and augmented DH.87/.92. Replacing DH's learned pruning with linear-cost pruning gives.83/.85, supporting learned edge selection for this nonadditive objective. The solution may violate windows; this is not a hard-TSPTW feasibility guarantee. The “implicit LKH” baseline in Table12 ignores the window objective, so it is not a direct comparison against a dedicated constrained LKH implementation. [pp.9–10,23,31]
- **Pruning ablations:** On additive MGMOTSP50, learned and simple post-encoder pruning are close. Under linear reward on FLEX2, simple pruning gap2.65% is slightly better than learned2.74%. Pre-encoder pruning is substantially worse in these tests and repeats encoding, but the evidence does not show that learned pruning always beats a sound heuristic. [pp.24–25]
- **Neural exceptions:** On MGMOCVRP FIX2-50, augmented MBM gap3.39% beats DH3.96%. At20 nodes, MBM-AUG also slightly beats EB-AUG on both displayed multigraph CVRP distributions. Additional GREAT/GOAL-derived baselines outperform DH in three of16 displayed cases. CNH is generally better on Euclidean50/100-node tasks. [pp.9,25–31]
- **Zero-shot size/edge transfer:** TSP tests extend to150/200 nodes; models trained with five parallel edges are also tested with ten. At FIX10-100, EB gap1.49% takes23min, DH4.11% takes1.1min and LKH0% takes15min. EB FLEX5-200 takes2.1h versus LKH1.2h. Larger-instance efficiency is therefore method/setting dependent. These transfer tables do not establish CVRP200-node results. [pp.10,26,32]
- **Three objectives:** On XASY100 at105 augmented preferences, DH gap13.81% is worse than MBM9.67% and OR-Tools9.96%; EB gives6.91%. Increasing preferences to1,035 changes the budget and does not rescue every DH case. [pp.26,33–34]
- **Training expense:** At50 nodes, epoch times for MBM/DH/EB are4.7/8.4/51min on the stated simple graph and4.7/24/102min on the multigraph. Encoder+decoder parameters are2.38M+.266M,2.06M+1.08M and1.98M+.266M, respectively. The paper explicitly acknowledges GMS training cost as a weakness. [p.20]

## Limitations

### Discussed in the Paper

The pruning decision in DH loses partial-route context. Training, edge storage and EB decoding remain expensive. The experiments principally use synthetic distributions; hard-constrained single-objective and stochastic routing are future directions. The newly designed evolutionary baselines are comparison implementations, not claims of the strongest possible MOEA design. [pp.5,10,20–21,24]

### Curator Notes

- **Current metric implementation:** The inspected DH tester averages objective vectors across instances for each preference, returns that mean front, and its driver then computes a single normalized HV. This differs from the paper's stated mean of per-instance HV values. For example, two two-point fronts{(1,3),(3,1)} and{(3,1),(1,3)} at reference(4,4) each have HV5, whereas their preference-wise average front has HV4. This identifies a current evaluation-path distinction, not a replay or disproof of the historical tables.
- **FLEX generator:** The visible generator retains a fixed number of slots, replacing dominated vectors rather than deleting slots. Because replacements read the original matrix, later replacements can retain a dominated vector when there are at least three slots. Executing the original function on(.1,.1),(.2,.2),(.3,.3) yields(.1,.1),(.1,.1),(.2,.2). This qualifies the current generator's correspondence to the stated Pareto-filtered distribution; stored historical test data were not regenerated or checked here.
- **Release scope:** The visible decoders/generators are configured for two objectives; no tri-objective implementation is exposed in the inspected archive. The GitHub archive contains ten small-size task/architecture checkpoints. The linked Hugging Face inventory supplies44 `.pt` artifacts plus test files; their presence alone does not reproduce every result. All these files were inventoried, not loaded as evidence of numerical accuracy.
- **Settings:** The current TW DH training/test example uses linear scalarization, while the EB example uses Chebyshev. Augmentation is disabled in the inspected default test example. Comparisons need matching reward, dataset, checkpoint and augmentation settings. Current CUDA-specific test code also needs adjustment for CPU-only reproduction.
- **Statistics:** No independent training-seed confidence study is established by the displayed deterministic tables. Broad claims of statistical superiority or complete Pareto recovery would exceed the evidence.
- No model training or full benchmark replay was performed. Targeted source execution concerns only the generator example, while the HV example is an exact mathematical check.

## Reproducibility

- **Formal source:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/7e0c50ca569760d0b9da9149db6a727f-Abstract-Conference.html), explicit publisher date2026-04-20. All34 pages, complete references, Algorithm1 and AppendicesA–H were freshly read; six figures and17 tables were visually checked.
- **Companions:** The [official event](https://iclr.cc/virtual/2026/poster/10011502) exposes a2.278MB scientific poster, read in three overlapping full-resolution tiles. No separate slides/scientific supplement link is exposed there. The complete348-entry GitHub tree/349-member792.12MB ZIP and144-entry Hugging Face inventory expose no additional scientific PDF/notebook/archive; both READMEs were read.
- **Code/data:** [Official GitHub](https://github.com/filiprydin/GMS) and [author-linked Hugging Face](https://huggingface.co/filiprydin/gms). Inspected Git tree4bf337b69a26fb7ec25aba2bd59d8b1d30e69dd5. DH model/trainer/tester/pruning/generator/configuration, EB model/decoder, GREAT encoder and TW environment/generator paths were inspected.
- **Figure:** Original formal Figures1 and2 are cropped with complete captions and placed side by side, preserving the EB/DH architectural distinction.
