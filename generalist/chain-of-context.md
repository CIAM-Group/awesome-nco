---
id: chain-of-context
short_title: CCL
title: 'Chain-of-Context Learning: Dynamic Constraint Understanding for Multi-Task VRPs'
authors:
- Shuangchun Gui
- Suyu Liu
- Xuehe Wang
- Zhiguang Cao
year: 2026
date: '2026-03-02'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1a7a22152cd21f0ca3c0f8139bb32905-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1a7a22152cd21f0ca3c0f8139bb32905-Abstract-Conference.html
institutions:
- Singapore Management University
- Guangdong Laboratory of AI and Digital Economy
- Sun Yat-sen University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Duration Limits
- Multi-Depot Vehicle Routing Problem
- Vehicle Routing Problem with Mixed Backhauls
- Flexible Flow Shop Scheduling Problem
summary: RGCR constraint context and trajectory-shared recurrent node re-embedding guide a constructive policy over
  16 trained and 32 unseen VRP variants; base, ReLD-equipped and four-rate ensemble protocols are evaluated separately.
code_url: https://github.com/gshuangchun/CCL-MTLVRP
arxiv_url: https://arxiv.org/abs/2603.01667
figure:
  path: paper-assets/chain-of-context/framework.png
  alt: CCL architecture with constraint relevance and recurrent node re-embedding shared across trajectories.
  caption: 'Figure 1: original formal CCL framework, RGCR and TSNR modules.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/1a7a22152cd21f0ca3c0f8139bb32905-Paper-Conference.pdf#page=4
---

# Chain-of-Context Learning: Dynamic Constraint Understanding for Multi-Task VRPs

> **TL;DR:** CCL constructs routes with constraint-relevance context and recurrent node re-embedding shared across parallel trajectories. Separate size-50/100 models train on 16 routing variants and test on 32 unseen variants. The ReLD-equipped CCL†, base CCL and four-setting CVRP ensemble have distinct results and budgets.

## Motivation

Constraint urgency and node relevance change during route construction. CCL argues that a policy should update node representations together with the current vehicle context, instead of repeatedly combining a changing context with fixed embeddings. This is an architectural argument about the policy's representation; the paper does not prove that every earlier environment formulation violates the Markov property. [pp. 1–3]

## Contributions

- **Relevance-Guided Context Reformulation (RGCR):** Embed four constraint-specific states and measure their relevance to the current node before combining them into a trajectory context.
- **Trajectory-Shared Node Re-embedding (TSNR):** Update one set of node embeddings from the previous node representations and all current trajectory contexts, then carry that updated representation into later decisions.
- Evaluates a shared routing policy on 16 trained variants and 32 unseen mixed-backhaul/multi-depot variants, with additional complexity, update-frequency and benchmark studies. [pp. 4–10]

## Methodology

The six-layer dual-attention encoder combines node attributes with four binary constraint attributes for backhauls, open routes, route-duration limits and time windows. Combinations require a multi-hot attribute vector, despite the paper calling it “one-hot.” RGCR embeds remaining load, current location/distance and time-window/vehicle-clock information separately. Its printed equations use dot products with the current node to weight constraint embeddings, added to a projected concatenation of those embeddings. [pp. 4–5, 15–16]

TSNR uses previous-step nodes as attention queries, with the concatenated nodes and N trajectory contexts as keys/values. A distance bias and residual feed-forward block update the shared nodes. Updates occur probabilistically, with separate training and test rates. The attention matrix has (N+1)×(2N+1) entries: smaller than self-attention over all 2N+1 tokens, but still quadratic in N. A masked pointer decoder constructs the next action, and POMO-style REINFORCE trains the policy. Shared re-embedding couples the parallel trajectories; it is not independent re-encoding of each route. [pp. 5–6, 16, 20]

**Classification:** Generalist / constructive. A single model shares neural parameters across the 16 native routing variants, and the same trained routing model is applied to 32 unseen variants with their corresponding environment constraints. Backhaul B enforces linehaul-before-backhaul; MB relaxes that ordering. The size-50 and size-100 policies are separate. The preliminary FFSP and distance-vector-input demonstrations are separately trained experiments, rather than evidence that the routing checkpoint transfers unchanged to scheduling. [pp. 3–4, 6–7, 21–22]

## Experiments

| Protocol | Reported setting |
| --- | --- |
| Training | 300 epochs, 100,000 instances per epoch in the release; batch 256; Adam 3×10⁻⁴; weight decay 10⁻⁶; one L40S GPU |
| Validation / tests | CVRP validation set of 128 for checkpoint selection; 1,000 test instances per routing variant |
| Main refinement rates | Size 50: training 0.75 / test 1; size 100: training 0.25 / test 0.5 |
| Unseen-task tests | Test refinement rate 0.15 at size 50 and 0.02 at size 100 |
| Benchmark rates | CVRP and 600-customer VRPTW: 0.1; 100-customer Solomon VRPTW: 0.25; CVRP ensemble selects best of four rates 0.1/0.15/0.25/0.3 |

The paper's wording “training set consists of 100,000 instances” should be read alongside the released 100,000-per-epoch setting, implying 30 million generated training instances per model. The code evaluates multi-start routes with eight geometric augmentations. Rates, search budgets and base/† variants must match when comparing rows. [pp. 6–10, 18–22; release configuration and `test.py`]

- **Seen tasks:** CCL† has the lowest reported neural gap on all 16 seen tasks at both sizes, with lower classical-reference objectives still present. Base CCL is not uniformly better than CaDA†: on CVRP100 it reports 1.287% versus 1.070%, while CCL† reaches 1.058%. Base CCL is slower: roughly 19–22 seconds per 1,000 size-100 instances versus CaDA's 8–9 seconds. CaDA is the authors' RouteFinder reimplementation; Appendix C separately compares the originally reported CaDA values. [pp. 7–8, 17]
- **Unseen tasks:** CCL† reports mean gaps 24.102%/34.788% at sizes 50/100; base CCL reports 27.588%/34.892%. The best of base/† wins 27/32 tasks at 50 and 24/32 at 100, not every task with one chosen variant. On VRPMB100, base CCL's 13.438% and CCL†'s 10.530% are worse than CaDA†'s 8.399%. On MDVRPTW100, CaDA's 34.783% beats base CCL's 39.557% and CCL†'s 50.829%. [pp. 18–19]
- **Benchmarks:** On 27 Set-X CVRP instances, base CCL averages 4.707%, worse than CaDA's 4.625%; the four-rate ensemble improves to 4.261%. The often quoted 16/27 wins combines CCL and that ensemble. On 27 Solomon instances CCL averages 27.114% and wins 24/27; on 60 Homberger 600-customer instances it averages 70.961% and wins 35/60. These large remaining gaps and individual losses qualify claims of practical readiness. [pp. 10, 22–23]
- **Ablations and statistics:** Removing RGCR slightly improves CVRP/VRPL50, and random relevance scores have a slightly lower overall gap than dot products, although dot products are better on the time-window subset. At matched inference time, base CCL and CaDA-HD tie at 1.802% on the non-TW mean, while CCL improves the TW mean to 0.749% from 1.256%. Three independent test seeds assess stochastic refinement; they do not constitute three independent training runs. Table 6 additionally reports instance-level t-tests against CaDA†. [pp. 8–9, 17–21]

## Limitations

### Reported by the Authors

- Re-embedding increases inference time and memory; reducing its frequency trades quality for speed.
- The FFSP demonstration becomes unstable in later training, and adapting/filtering its machine information is left for further work. [pp. 9–10, 21]

### Curator Notes

- Main gaps use HGS-PyVRP heuristic reference values. Benchmark columns labelled “Opt.” also include negative gaps, for example Solomon R101; these should not be presented as certified global optimum comparisons without matching objective and feasibility conventions.
- CCL† adds ReLD, and CCL-Ens uses four test settings with best selection. Those gains should not be assigned to base CCL at a single inference budget. The separate FFSP/graph-input retraining does not establish zero-shot cross-family transfer.
- Table 9 compares GPU batched throughput with parallel CPU classical runs and separately reports per-instance times. Dividing total wall time by 1,000 is not the same latency measurement. No independent rerun validates the reported speedup factors.
- The present release adds scaled sigmoid relevance gates, training noise and task masks beyond the printed raw-dot-product equations. Its TSNR bias is negative log distance, whereas Eqs. 11–12 print positive Euclidean distance. Base CCL currently defaults to the unseen-task test rates; the ReLD branch uses a different size-100 training rate. These are concrete paper/release differences requiring protocol alignment, not proof that the published experiments used current defaults.

## Reproducibility

- **Published paper:** [ICLR 2026](https://proceedings.iclr.cc/paper_files/paper/2026/hash/1a7a22152cd21f0ca3c0f8139bb32905-Abstract-Conference.html), published 2026-04-20. All 23 pages, references, complete Appendices A–C, all detailed result rows and Figures 1–6 were read. The [arXiv history](https://arxiv.org/abs/2603.01667) starts on 2026-03-02; no generic conference notification date is substituted.
- **Official materials:** [Code](https://github.com/gshuangchun/CCL-MTLVRP) and [official poster](https://iclr.cc/virtual/2026/poster/10011011). The complete poster was visually read. The publisher links no separate scientific supplement; OpenReview API retrieval returned 403 and was not counted as inspected content.
- **Archive checks:** The 435-member source archive contains four notebooks, forming two byte-identical pairs. Both unique notebooks' 34 cells, saved textual outputs and nine plots were read: they are inherited RouteFinder demonstrations, not additional CCL benchmark evidence. The linked 293 MB data/model archive has 752 entries: 582 NPZ files, five checkpoints and directories, with no additional scientific PDF, notebook, archive or video.
- **Implementation checks:** Read the model/loss loop, recurrent decoder/cache update, constraint context, encoder, train configurations and multi-start/augmentation test path. Current hard-coded rates and gating/bias differences are recorded above. The original formal Figure 1 is used for the framework illustration. No full model training or benchmark reproduction was performed.
