---
id: select-and-optimize
short_title: Select & Optimize
title: 'Select and Optimize: Learning to solve large-scale TSP instances'
authors:
- Hanni Cheng
- Haosi Zheng
- Ya Cong
- Weihao Jiang
- Shiliang Pu
year: 2023
date: '2023-04-11'
venue: AISTATS
paper_url: https://proceedings.mlr.press/v206/cheng23a.html
institutions:
- Hikvision Research Institute
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: A fixed-endpoint neural path optimizer rewrites every contiguous candidate window in parallel, then accepts the largest actual tour improvement; classical LK initialization/fragment repair and substantial inference budgets remain part of the solver.
inclusion: reference
inclusion_reason: AISTATS is outside the approved main-conference and journal inclusion list.
publication:
  date: '2023-04-11'
  source_url: https://proceedings.mlr.press/v206/cheng23a.html
code_url: https://github.com/honey0920/select-and-optimize
figure:
  path: paper-assets/select-and-optimize/framework.png
  alt: Starting from a full initialized tour, all contiguous subpaths are optimized in parallel, one improving rewrite is accepted and periodic destroy/repair perturbs the incumbent.
  caption: 'Figure 1: incumbent-tour selection, neural subpath optimization and periodic destroy-and-repair.'
  source_url: https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=3
---
# Select and Optimize: Learning to solve large-scale TSP instances

> **TL;DR:** Optimize all candidate contiguous subpaths of an existing tour with a small neural path solver, then accept the **largest measured improvement**. Selection is not a separate learned value-prediction head. Classical K-means/LK initialization and periodic LK destroy-and-repair support the neural improvement loop. The paper reports useful speed/quality tradeoffs, with explicit exceptions and numeric inconsistencies; the publisher-linked public repository currently contains **only a README**.

## Motivation

Large TSP instances can exceed the useful generalization range of a directly applied small neural solver, while global heatmap/MCTS search can be slow. The proposed method confines neural decisions to small fixed-endpoint path rewrites and derives whole-tour improvement from replacing just one segment. It follows POPMUSIC's local optimization principle and evaluates **symmetric two-dimensional Euclidean TSP**. CVRP and bin packing are future extensions, not completed experiments. [Sections 1-3/Conclusion.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=3)

## Contributions

- A full-tour improvement loop evaluates contiguous subproblems in parallel and chooses one by actual gain.
- A Transformer-style **fixed-head/fixed-tail Hamiltonian path policy** includes both endpoints in its context.
- Reversal symmetry is exploited during training and through two-direction inference.
- Classical initialization and periodic long-edge destroy/LK repair help address poor global connections that short contiguous windows cannot readily change. [Figure1/Sections3.2-3.6.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=4)

## Methodology

### Initialization and neighborhood definition

The initializer extends POPMUSIC: use approximately **n^.56 K-means centers**, select the nearest cities as anchors, form an LK-improved anchor tour, insert each remaining city after its nearest anchor, optimize three-cluster subpaths with LK, then optimize sections. Section length is **N/4 for medium instances and500 for large instances**. This supplies a complete classical initial incumbent, rather than a newly learned neural constructor. The authors call its K-means initialization deterministic; no public implementation is available here to establish all random seeds/settings. [Supplement Algorithm1.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=11)

A tour of N cities defines **N contiguous windows**, each of r cities, including wrap-around. The experiment uses separately trained **r50 and r100** models. Every candidate is reconstructed by the neural optimizer; actual before/after path costs determine the winner. Only the largest improving replacement is applied; if none improves, the incumbent stays unchanged. Fixed endpoints ensure that the local path-cost change equals the global tour-cost change. The method therefore performs learned candidate generation followed by a **classical argmax of measured gain**, not an independent neural region-value estimator. [Sections3.3-3.4.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=4)

The paper's nearly-O(1) statement refers to exploiting parallel hardware for candidate processing. There are still **N candidate neural subproblems per round**, growing memory/work, and r-step autoregressive decoding. It is not a constant-work or hardware-independent time-complexity guarantee.

### Neural path policy and learning

The attention encoder embeds coordinates with width128. Decoder context concatenates **last-visited, head and tail embeddings**. It masks visited nodes and the tail until path completion, uses eight attention heads and tanh logit clipping10. REINFORCE trains on negative path length with a batch-average baseline. During training, head/tail roles are flipped; at test time both directions are decoded and the better path is retained. These are two trajectories for the same fixed-endpoint subproblem, not an extra complete-tour generalist policy. [Equations2-3/Figure2.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=5)

The **SO100** configuration uses the100-city optimizer. **Mixed** first runs SO100 then re-optimizes with the separately trained SO50 model. Both optimize completed incumbent segments. Classification remains **specialist / improvement**; having two subproblem-size checkpoints does not make the method generalist or a substantive learned full-tour construction stage.

### Destroy-and-repair

At a fixed interval, remove long incumbent edges and additional connections so that **25 fragments** have comparable lengths, then use **Lin-Kernighan** to reconnect them. The repaired complete tour is accepted only when shorter. This is a classical global perturbation/repair component and incurs extra compute. It is disabled in the medium-scale main experiment and used for larger settings. Its interval is **T/2**. [Section3.6/Figures3-4.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=6)

## Experiments

### Data, training and inference budgets

Uniform unit-square training starts with1,000 instances each at sizes200/500/1,000, initialized as above. SO50 receives **1.4 million augmented subpath examples** from200/500-city tours; SO100 receives **2.0 million** from1,000-city tours. Adam uses rate **.0002**, weight decay1e-6, batch256 and1,000 epochs, taking about **16 hours SO50 and40 hours SO100** on one V100. [Section4.1.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=6)

Tests contain **128 instances each at200/500/1,000**, **32 each at2,000/5,000**, **16 at10,000**, and **eight at20,000**. Iteration limits are50 for medium scales,60/80/100 for2K/5K/10K, and100 for TSPLIB. At10K the authors disable two-direction symmetry because of GPU memory exceptions. Mixed adds a second model/refinement phase. Conventional C++/MCTS code runs on an E5-2650v4 CPU and neural Python code on a Tesla V100; the authors acknowledge language, batching and multiprocessing affect runtime comparisons. [Sections4.1-4.2.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=7)

Medium-scale references come from exact Concorde; larger synthetic gaps are relative to **LKH-3**, not a certified exact optimum. Main synthetic runtimes explicitly split **initialization plus iterative solving**; ablation runtimes exclude initialization. This separation must be preserved when comparing speedups.

### Synthetic results and exceptions

| Size | Mixed gap | Mixed initialization + refinement | AttGCRN-MCTS gap / reported time |
| --- | --- | --- | --- |
| 200 | .6362% |1.00 +8.95 s | .8844% / .10 +20 s |
| 500 |2.4012% |1.50 +13.50 s |2.5365% / .20 +50 s |
| 1,000 |2.8004% |2.94 +23.10 s |3.2238% / .30 +100 s |
| 2,000 |2.7577% |6.6 +48.38 s |3.2942% /4 +200 s |
| 5,000 |3.3357% |20 +195.65 s |3.5161% /20 +500 s |
| 10,000 |3.5166% |40 +417.60 s |3.6856% /70 +1,000 s |

The selected comparison supports faster solving with modest quality gains under these schedules. It does not mean every learned method is slower: POMO takes **.05 seconds on200 cities**, versus Mixed9.95 seconds, with a worse1.6158% gap. SO100 alone is slightly **worse** than AttGCRN-MCTS at200/500 (.8900/2.5590 versus.8844/2.5365%). Conventional LKH-3 remains much closer to reference quality. [Tables1-2.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=8)

At20K, the table lists Mixed cost **105.0344**, gap **3.7101%**, and185 +1,822 seconds versus LKH cost101.2861 in4,185.87 seconds. This is around twofold faster under the stated run, with a remaining quality gap and only eight test cases. Two neighboring rows do not reconcile under a ratio of displayed mean lengths: SO100 cost105.0575 gives approximately **3.7235%**, versus its printed4.2195%; AM cost244.1992 gives approximately **141.10%**, versus the printed113.7504%. Instance-wise values are unavailable here to separate a transcription issue from differing averaging conventions. These arithmetic checks do not replace the paper's reported measurements or establish independently reproduced corrected gaps. [Table3.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=8)

### TSPLIB and ablations

The public benchmark uses **18 instances**, eleven in the1,000-2,000 group and seven in2,000-6,000. Mixed mean gaps are **3.75% and5.46%**, compared with LKH **.05% and.09%**, OR-Tools5.74% and4.89%, and the rerun AttGCRN-MCTS308.84% and1,579.53%. The latter means are dominated by extreme failed transfers, including **3,359.25% onfl1400** and **5,622.43% onpcb3038**. They are outcomes of this rerun/protocol, not typical universal performance estimates for all learned solvers. OR-Tools beats Mixed quality in the larger group and several individual instances; LKH is frequently faster and more accurate, with expensive fl-instance exceptions. [Tables4/7.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=13)

Although the main prose calls Table4 times total runtime, its values align with **mean per-instance times** in Table7: Mixed's eleven smaller-instance times sum to499 seconds, giving **45.36 seconds**, near the displayed45, rather than a45-second group total. The larger group displays125 seconds. Timing interpretation follows this explicit row-level check rather than the conflicting prose.

Selector ablations compare random, bucket-count, random-among-promising and best-actual-gain selection while retaining the same neural optimizer. Best-gain selection improves convergence in the plotted500/2,000 cases; the axes are **iterations**, not matched wall-clock. Tail context improves gaps, while removing symmetry saves time at some quality cost. D&R makes small improvements at extra runtime: on10K, **3.5708% without versus3.5395% with D&R**, with305 versus376 seconds excluding initialization. Initializer sensitivity curves use longer convergence runs than the main budgets, and retain nonzero optimality gaps. [Figures5-6/Tables5-6/8.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=9)

## Limitations

### Reported by the Authors

- Contiguous subpath improvement remains vulnerable to local minima and poor long global connections.
- Practical constraints, wider distribution differences, CVRP and bin packing remain future work.
- Inference time comparisons depend on implementation language, GPU batching and CPU execution details.
- Two-direction inference is disabled at10K because of memory exceptions. [Sections3.6/4/5.](https://proceedings.mlr.press/v206/cheng23a/cheng23a.pdf#page=7)

### Curator Notes

- Parallel evaluation of all windows does not eliminate scaling work/memory or the cost of autoregressive reconstruction.
- Classical LK participates in both initialization and optional repair; this is material to the solver's behavior and runtime.
- Neural quality/speed exceptions, LKH-reference gaps, tiny20K samples and numeric/table timing inconsistencies qualify headline comparisons.
- Mixed uses two separately trained size-specific networks, and no multi-task checkpoint is shown.
- The public repository currently lacks the scripts/models invoked by its README, preventing a direct implementation-level reproduction from that snapshot.

## Reproducibility

- **Full reading:** all **13 publisher pages**, including three embedded supplementary pages, initialization pseudocode, sensitivity plots and every detailed TSPLIB/ablation row, were freshly read. All architecture/framework/repair diagrams, formulas, result tables and plots were visually inspected.
- **Metadata:** PMLR206:1219-1231 confirms five authors, Hikvision and AISTATS2023. Actual publisher HTML records **citation_publication_date2023/04/11** and matching article timestamp; the prior25April conference-first-day date is corrected to **11April2023**. The generic conference acceptance day is removed. The existing **reference-only AISTATS inclusion** remains unchanged.
- **Scientific supplement discovery:** the publisher page manually lists the combined paper and Software. Supplement A-B is embedded on pages11-13 and fully read; there is no separately linked scientific supplement. The publisher-linked source ZIP contains only the root and README, **two members**, with no extra scientific PDF/ZIP or executable source.
- **Official repository:** [honey0920/select-and-optimize](https://github.com/honey0920/select-and-optimize). Its full README says the source is being organized and lists generation/training/evaluation commands; those paths and checkpoints are absent from the actual archive. The link is retained as provenance, not described as a complete released implementation. No new solver experiment was run.
- **Figure:** original Figure1, publisher page3, directly cropped with its full pipeline and caption.
