---
id: macsim
short_title: MACSIM
title: Multi-Action Self-Improvement For Neural Combinatorial Optimization
authors:
- Laurin Luttmann
- Lin Xie
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1bf4cad47f5a54c98fbe7d10516ebf77-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1bf4cad47f5a54c98fbe7d10516ebf77-Abstract-Conference.html
institutions:
- Leuphana University Lüneburg
- Brandenburg University of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Routing
problems:
- Flexible Job Shop Scheduling Problem
- Flexible Flow Shop Scheduling Problem
- Min-max Heterogeneous Capacitated Vehicle Routing Problem
summary: Multi-action elite self-imitation constructs coordinated assignments with fewer neural evaluations; specialist
  policies trade quality, skip usage and latency.
code_url: https://github.com/LTluttmann/macsim
---

# Multi-Action Self-Improvement For Neural Combinatorial Optimization

> **TL;DR:** MACSIM constructs several coordinated agent–task assignments per neural evaluation and trains on its own best sampled trajectories with a set-based imitation loss. It improves the reported neural scheduling/routing baselines, but classical quality and latency counterexamples remain. Different problem families use different trained policies.

## Motivation

Self-imitation repeatedly generates candidate solutions, keeps an elite trajectory and trains on its decisions. For multi-agent problems, predicting one assignment per neural call repeats encoding work and treats different orders of an equivalent assignment set as different supervision. MACSIM amortizes encoding across multiple agents while retaining sequential conflict resolution (Sections1–3).

## Contributions

- A joint matrix of agent–task logits supports multiple assignments from one expensive neural evaluation.
- Sequential pair sampling masks selected agents and real tasks; reusable skip actions permit useful deferral.
- Independent per-agent cross-entropy supplies permutation-invariant supervision for an expert assignment set, within an elite-sampling/self-imitation training loop.
- Scheduling, routing, public benchmarks, loss/skip/order ablations and memory/runtime profiling test the resulting trade-offs (Sections4–5/AppendicesA–H).

## Methodology

**Representation and generation.** A bipartite graph represents agents and available tasks. Type-specific projections, self/cross attention and edge-weight mixing produce embeddings; a multiple-pointer decoder emits clipped joint logits. At each global step a categorical distribution is normalized over all remaining feasible agent–task pairs. One pair is sampled, its agent and real-task column are removed, and this fast autoregressive process continues without another network call until agents have acted. This is coordinated sequential sampling from jointly predicted scores, not independent or simultaneous discrete choices (Section4.2/Algorithm1/AppendixB).

**Skip and training.** A learned dummy-task embedding is reusable across agents; at least one real assignment is required per nonterminal step. An annealed penalty discourages excessive skips. The current reference policy generates many complete trajectories; the best objective/penalized trajectory supplies state–assignment-set examples. The target network learns per-agent cross-entropy over these examples, and the reference is replaced after validation improvement. The surrogate ignores the likelihood coupling between assignments even though shared attention parameters and inference masks coordinate them. "Self-improvement" describes training, not neural edits of an existing complete solution (Sections4.3–4.4/AppendicesE–G).

**Actual tasks and scope.** FJSP assigns eligible machines to successive operations under job precedence and minimizes makespan. FFSP chooses a machine per stage and schedules each job at its earliest available time, again minimizing makespan. Routing minimizes the **maximum vehicle travel time**, accounting for heterogeneous speed and capacity, rather than total distance. The released routing environment permits depot returns/refilling. Separate family/size models are trained; the README expressly limits a FJSP checkpoint to FJSP evaluation. The released mixed-size FJSP configuration remains one native task. Accordingly this entry is **specialist / constructive**, despite a common multi-agent framework (Sections5/C/H; official README/configurations).

**Theory.** Proposition1 normalizes the sequential distribution provided every reached remaining feasible-pair set is nonempty. Theorem2 proves LCE≥Lideal and a conditional near-certainty gap bound for the appendix's defined permutation-prior/row-conditional model. These are distribution/loss statements, not global optimality, approximation ratios or convergence of the self-improvement algorithm (AppendicesA/F).

## Experiments

**Budgets and references.** Main neural sampling uses1,280 solutions per instance; greedy results are separate. Gaps are relative to the compared **best-known solution reference**, not automatically a certified optimum. Formal settings use dimension256, four layers, dropout.1 and Adam1e−4; FJSP has50epochs/4,000instances per epoch and128 training candidates, FFSP100/150/200epochs for20/50/100jobs with1,000instances and128candidates, and routing200epochs with1,000instances/200candidates. Each run uses one80GB A100 on a dual-Xeon6338 workstation. Synthetic FJSP/FFSP tests use1,000instances; routing uses1,280 per setting. The separately profiled memory experiment uses an A10040GB (Sections5/H/Table7).

**Scheduling.** Sampling achieves FJSP objectives97.64/188.10/145.95 for10×5,20×5,15×10 in.86/2.28/6.19seconds. OR-Tools is better on10×5 and15×10 (96.32/143.53), while MACSIM narrowly improves20×5 (188.10 versus188.15 at a1,800-second classical limit). FFSP20/50/100jobs with three four-machine stages gives23.96/47.74/87.22, the best displayed objectives, in.49/.91/3.60seconds. Greedy PARCO is slightly quicker on FFSP20 and100. On larger FJSP20/30/40×10, MACSIM sampling is best among neural comparators, but OR-Tools still wins30×10 (274.67 versus275.48). "All methods" superiority therefore requires the specific task and budget qualifier (Tables1–2).

**Routing.** MACSIM sampling reaches6.76/8.78/10.67 for60/80/100customers with three vehicles, versus SISR6.57/8.52/10.29: reported gaps2.89/3.05/3.69%. SISR takes478/750/1,084seconds versus1.65/2.29/2.76 for MACSIM. Conversely2D-Ptr is faster (.32/.44/.55seconds) with slightly worse6.82/8.85/10.71 objectives. The claimed neural quality gains do not establish universal fastest inference or best classical quality (Table1).

**Generalization and controls.** Public Brandimarte/Hurink results select the best-performing model among the trained sizes for each benchmark type. MACSIM sampling leads the displayed neural methods but OR-Tools is better in all four groups. More FFSP agents yield MACSIM47.74/30.74/23.06 versus SLIM48.13/31.65/24.41. Removing skip actions worsens FJSP15×10 from145.95 to159.65 while reducing time6.19→3.89seconds. The CE ablation wins the four displayed cells; the conflict-rate/logit figures give empirical coordination evidence, not a hard feasibility guarantee from the loss itself (Tables3–6/Figures5–8).

**Scaling and latency.** At FFSP500, measured peak training memory is1.95GB versus MatNet12.87GB for batch1; training time63.62 versus264.41minutes/epoch uses each method's largest feasible batch (64 versus8). These are different measurement protocols. Profiling FFSP50 across12/18/24agents attributes neural evaluation234–568ms to MACSIM versus3,119–8,845ms to SLIM, while sampling costs125–156ms versus120–121ms. The primary saving is fewer network evaluations, not a zero-cost or parallel discrete sampler (Tables7–8).

## Limitations

### Discussed in the Paper

Step-wise re-encoding can be slower than lightweight solvers; caching/incremental updates are future work. Independent training loss and coupled inference have an acknowledged mismatch. Skip usage trades quality against construction length (Sections6/F/G).

### Curator Notes

- Proposition1's proof requires nonempty choices at every sampled prefix. A generic sparse bipartite graph can possess a full matching yet greedy selection can dead-end: edges(m1,a),(m1,b),(m2,a), choosing(m1,a) leaves no action for m2. The released environments address this with reusable waiting, so this qualification does not claim their schedules fail.
- AppendixF samples an agent permutation with prior w(σ), then normalizes **within each selected row**. Algorithm1 instead normalizes over all remaining pairs; its agent ordering and conditional probabilities depend on the remaining task set. The displayed proof is valid for its explicit auxiliary distribution, but does not itself identify that distribution with the actual joint sampler's unordered likelihood. No unconditional optimization claim follows.
- AppendixE's small softmax probability does not by itself imply vanishing target-logit gradients: for cross-entropy the derivative is p−1, approaching−1 as p→0. Gradient-interference explanations and empirical comparisons should be distinguished from that particular printed argument.
- AppendixC.3's single-route vehicle-flow model allows at most one depot departure per vehicle (Eq33), whereas the actual environment resets used capacity on depot returns and can make multiple trips. One vehicle with capacity2 and two demand2customers illustrates the difference. Treat the printed formulation and implemented multi-trip routing protocol separately; this discrepancy is not evidence that Table1's min-max travel-time measurements are invalid.
- Formal AppendixH settings do not exactly match every released archived config: e.g. FJSP10×5/20×5 use100 training candidates, the archived FFSP50 MACSIM config has three layers/100epochs and eval_per_agent=false, and routing configs use5e−5 learning rates. These snapshots require reconciliation before claiming exact reproduction. The text's FFSP machine-count prose also differs from Table6; the table's evaluated4/6/8 per-stage machines are retained here.

## Reproducibility

The [formal ICLR2026 record](https://proceedings.iclr.cc/paper_files/paper/2026/hash/1bf4cad47f5a54c98fbe7d10516ebf77-Abstract-Conference.html) gives publication2026-04-20 through citation_publication_date and pp16617–16648 through its BibTeX. All32PDFpages, complete bibliography, appendices and scientific figures/tables were read; key formulas and result tables were rendered. The officialposter10011385was visually read. The event/publisher provide no separate scientificPDF/slides; OpenReview6KrETIaOYDAPIreturned403.

The official [implementation](https://github.com/LTluttmann/macsim), full untruncated1,545-entry tree at SHA b08a608ea487933a3afd332d36b92d5d8d55325e, was inspected for extra scientific documents. The main and bundled-DPN READMEs, policy/sampling/loss/elite-generation code, checkpoint loading and all three environment/mask paths were checked. Current code performs one logit computation per global step, masks used real tasks and agents, and restores skip availability for remaining agents. HCVRP reward adds final depot return, divides vehicle distance by speed and takes the maximum. No training or numerical reproduction was run.

The author-linked [OSF archive](https://osf.io/5z2aj/?view_only=783b0bb138e64431a681fd36452ea710) lists one3,761,631,955-byte trained_models.zip. Its complete296-member central directory was retrieved with normal HTTP Range: only checkpoints,22Hydra configs and macOS metadata appear, with no extra scientificPDF/notebook/text supplement. All22configs were extracted, size/CRC checked and inspected without downloading/executing checkpoint weights. The published archive SHA256 is e82ec828bb7ef598a9d51a45820dd111f8b2805d57bb2f898d62b73019301491; it is API provenance, not a claim that the entire3.76GBfile was locally hashed.

**Internal citations.** Explicit in-text citations plus matching bibliography entries on pp10–13 establish the22links below. Earlier citation versions are preserved: Joshi2019 arXiv1906.01227 maps to the same EfficientGCN work, Luo2024/volume36 to the formal LEHD entry, and Bello's2017 arXiv to its stable reference. PARCO,2D-Ptr,Equity-Transformer and the separate Luttmann/Xie papers have no matching stable entry in the current364-paper catalogue and are not forced onto another ID.

[att-gcn](att-gcn.md), [attention-model](attention-model.md), [bq-nco](bq-nco.md), [deepaco](deepaco.md), [difusco](difusco.md), [dimes](dimes.md), [dpn](dpn.md), [efficient-graph-convnet-tsp](efficient-graph-convnet-tsp.md), [fast-t2t](fast-t2t.md), [gumbeldore](gumbeldore.md), [learning-co-over-graphs](learning-co-over-graphs.md), [lehd](lehd.md), [matrix-encoding-networks](matrix-encoding-networks.md), [neural-combinatorial-optimization](neural-combinatorial-optimization.md), [pointer-networks](pointer-networks.md), [polynet](polynet.md), [pomo](pomo.md), [poppy](poppy.md), [rl-vrp](rl-vrp.md), [slim-job-shop](slim-job-shop.md), [sym-nco](sym-nco.md), [t2t](t2t.md).
