---
id: lmask
short_title: LMask
title: 'LMask: Learn to Solve Constrained Routing Problems with Lazy Masking'
authors:
- Tianyou Li
- Haijun Zou
- Jiayuan Wu
- Zaiwen Wen
year: 2026
date: '2025-05-23'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/ade039c1db0391106a3375bd2feb310a-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/ade039c1db0391106a3375bd2feb310a-Abstract-Conference.html
institutions:
- Peking University
- Chinese Academy of Sciences
- University of Pennsylvania
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem with Time Windows
- Traveling Salesman Problem with Draft Limits
summary: A constructive policy refines feasibility masks through bounded backtracking, search-refinement features
  and violation-penalized training; infinite-budget validity and idealized probabilistic bounds do not guarantee
  finite-budget feasibility or optimality.
code_url: https://github.com/optsuite/LMask
arxiv_url: https://arxiv.org/abs/2505.17938
figure:
  path: paper-assets/lmask/framework.png
  alt: The LMask learning framework and LazyMask prefix-construction, verification, backtracking and mask-refinement
    loop.
  caption: 'Figure 1: LMask training and the LazyMask constructive decoding procedure.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=6
---
# LMask: Learn to Solve Constrained Routing Problems with Lazy Masking

> **TL;DR:** Build a route with a cheap overestimate of feasible next actions. When construction reaches a dead end, backtrack and remove the failed choice from the prefix's mask. A refinement embedding and violation-penalized learning help the policy use this search. Finite budgets can still fail; the theorem concerns an idealized model with explicit assumptions, and the public release has material protocol differences.

## Motivation

Local feasibility does not guarantee that a partial TSP route can be completed under time windows or draft limits. Exact completion-aware masks can themselves require difficult search, while deeper lookahead becomes expensive. LMask replaces irreversible one-pass construction with policy-guided prefix search that progressively discovers impossible choices. The target tasks are TSP with time windows (TSPTW) and with draft limits (TSPDL), rather than a demonstrated universal constrained-routing checkpoint. [Sections1–3.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=1)

## Contributions

- **LazyMask:** initialize an overestimate of feasible next actions using one- or two-step lookahead; backtrack on a dead end and refine the parent mask.
- **Refinement intensity embedding (RIE):** encode a capped local refinement count and whether the global backtracking budget is reached. This summarizes search history rather than storing the complete trace in the neural representation.
- **Training:** combine route length, constraint-violation penalties and an entropy term, using smaller search budgets during learning.
- **Analysis and experiments:** state infinite-budget feasibility and conditional distribution-approximation bounds; evaluate feasibility, conditional solution quality and runtime on synthetic and benchmark instances, including failure examples and a500-node scalability study.

## Methodology

### Prefix search, not incumbent-tour editing

The exact potential set contains next nodes admitting at least one feasible full completion. LazyMask starts from a superset: single-step lookahead (SSL) checks immediate monotone impossibility, while two-step lookahead (TSL) tests each candidate's effect on remaining nodes. For TSPTW, waiting is allowed; a remaining customer that can no longer be reached before its deadline proves the current prefix impossible under the metric-travel assumptions. For TSPDL, the tested model accumulates **pickup load after visiting a port**, subject to that port's draft limit; it does not use remaining delivery load. [Algorithm1/AppendixA/E.2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=5)

At a dead end, the algorithm restores the parent prefix, excludes the failed child, and tries another action. The formal budgeted algorithm relaxes an empty mask to unvisited nodes after budget exhaustion, permitting complete but infeasible routes. The release distinguishes this training behavior from test-time termination, described below.

This remains **constructive**, because neural decisions extend/retract incomplete routes until a candidate is generated. Backtracking a partial construction is not a learned operator editing a complete incumbent. Separate task, size and hardness checkpoints make this a **specialist** framework, even though a TSPTW checkpoint transfers within that problem to other widths/sizes.

### Policy and learning

The POMO-derived encoder has six attention layers,128-dimensional embeddings, eight heads, feed-forward width512 and instance normalization. Static features are coordinates/time windows or coordinates/demands/draft limits. Dynamic context includes current time/load. RIE adds five capped local-count categories and two global-budget categories, projected into the decoder query. Masked cross-attention produces next-node logits. AppendixE.7 separately substitutes a ReLD decoder. [AppendixC/Table5.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=16)

The formal loss is expected route length plus rho times total lateness/excess draft load, with `lambda * log p` entropy regularization. Multi-sample policy gradients use a shared reward baseline. Table5 reports50/100 training samples per instance, batch512/64,256,000/100,000 generated instances per epoch and at most1,000 epochs, for the two size regimes. The corresponding nominal ceilings are256M/100M training instances **per separately configured run**, not a single shared model's budget. AdamW uses learning rates.0003/.0001, weight decay.000001 and scheduled decay; rho=1 is the default. [AppendixB/E.2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=15)

### What is actually guaranteed

Proposition4.1 assumes a feasible instance, **infinite backtracking budget**, masks that never exclude feasible completions, exact final-step validation and positive probability for admissible actions. Under these conditions the search returns feasible routes and can generate every feasible route. It is not a finite-budget guarantee or a polynomial-time bound.

Theorem4.3 assumes an ideal globally optimized policy whose worst-instance KL approximation error to a constrained Gibbs distribution is at most `c/lambda`. For positive discrete suboptimality separation Delta and `0 < lambda <= Delta`, the failure bound combines an exponentially decreasing Gibbs tail with `sqrt(c/(2*lambda))`. The latter grows as temperature decreases; the displayed result does **not** prove that the trained finite network converges to optimal solutions as lambda tends to zero. It also does not establish that the actual history-dependent backtracking training update reaches the assumed global minimizer. [Section4/complete AppendixD.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=7)

## Experiments

### Synthetic feasibility and quality

TSPTW uses easy/medium/hard settings; TSPDL uses medium/hard settings with75%/90% draft-restricted ports and unit customer demands. Hard time windows are planted around a random feasible route. The released test-generation entry point creates10,000 instances per setting. Main neural inference greedily decodes each of eight dihedral augmentations: **eight candidates**, without50/100 forced-start inference. Backtracking budgets for TSPTW50/100 are100/150 (easy),100/200 (medium) and200/300 (hard); TSPDL uses150. [Tables1–5/AppendixE.1–2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=8)

|100-node hard setting | LMask instance failure | LMask candidate failure | Gap | Total GPU time |
| --- | --- | --- | --- | --- |
| TSPTW |0.00% |0.00% |.21% |18s |
| TSPDL |.26% |.80% |4.34% |15s |

PIP's corresponding instance failure rates are16.68% and21.65%, with gaps.37% and12.87%. LMask improves both measures in these comparisons, but TSPDL still has failures and a material gap. Classic solvers generally offer better feasible-route quality at larger budgets. Negative gaps against LKH are improvements over a heuristic reference, not evidence of beating an optimum.

Instance failure means none of the candidates is feasible; candidate failure counts individual generated solutions. Mean objective excludes failed instances. Gaps use only the intersection where the evaluated method and PyVRP (TSPTW) or LKH3 (TSPDL) both succeed. These means can therefore use **different subsets**, and a low conditional gap cannot be interpreted without the failure rate. [Metrics, Section5.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=7)

The main hardware is one A800 GPU (80GB) for neural inference versus32 CPU cores for classical solvers. PyVRP/OR-Tools receive20/50 seconds per instance at sizes50/100; LKH3 uses10,000 trials and one run. CPU-only LMask whole-set inference is3.2–5.6 minutes and11.4–12.4 minutes. Training is4.2/7.8 days, compared with PIP4.7/28.4 and PIP-D3.6/12.2: LMask is slower than PIP-D at50. The implementation also optimizes lookahead indexing, so the training-time comparison does not isolate the effect of backtracking alone. [AppendixF/Tables13–14.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=30)

### Transfer and scalability

On the54 selected Dumas benchmark instances (20/20/5/9 instances at sizes20/40/60/80), LMask reports zero instance failures and mean gaps.7/1.0/4.3/3.5%. **PIP/PIP-D numbers are borrowed from their original published appendix** because the authors' attempted replication was inaccurate, as AppendixE.10 explicitly states. They are not newly rerun baselines. One Table12 row, `n20w80.002`, prints optimum353 but LMask338/0% and PIP347/2.66%; that row is internally inconsistent and is not independently reconciled here. [Tables3/12.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=9)

A fixed hard-TSPTW50 model trained at maximum width100 transfers to widths20/60/200 with zero reported failures; gaps rise to2.99% at200. ReLD improves displayed quality across the ten primary settings but slightly worsens candidate failure on easy TSPTW100 (.01→.02%) and often adds runtime. [Tables7/9.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=27)

The500-node experiment contains128 hard TSPTW instances, budget600 and average **16 seconds per instance**, with zero reported failures and.53% gap. PyVRP receives four minutes per instance; LKH uses10 runs and averages13 minutes. The paper does not clearly specify the500-node checkpoint's training provenance, so this is recorded as scalability rather than an established100→500 zero-shot protocol. [AppendixE.6.2/Table8.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=26)

### Ablations and failure cases

On medium TSPTW50, RIE improves gap2.31→1.68% and candidate failure.14→.05%. Entropy coefficient.01 performs best in the displayed easy-TSPTW100 ablation, while.05 worsens gap to7.38%. Larger penalties favor feasibility at a quality cost; a scheduled penalty gives2.48% versus2.52% for rho1 on hard TSPDL50. These are tuning observations rather than universal optimum settings.

Sampling uses24/80/240 candidates for S=3/10/30 under eight augmentations, with increased time. It generally improves best-of-many results, but not every entry: easy TSPTW100 at S3 worsens gap3.11→3.31%. Increasing sample count does not itself mathematically increase the *proportion* infeasible; sampling and greedy decoding have different candidate distributions. Figure8 varies **inference seeds**, not independent model-training seeds. [Tables10–11/Figures3–5/8.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=28)

The explicit19-customer failure example needs11,000 backtracks after an early wrong choice;10,000 are insufficient. Another late wrong choice is corrected with100. A small overestimate error therefore does not guarantee a cheap search: error depth and remaining branching matter. [Figures6–7.](https://proceedings.iclr.cc/paper_files/paper/2026/file/ade039c1db0391106a3375bd2feb310a-Paper-Conference.pdf#page=24)

## Limitations

### Discussed in the Paper

Current task coverage is limited; broader constrained CO is future work. Backtracking overhead depends on policy quality and instance heterogeneity. The paper's own failure visualization shows potentially large correction costs.

### Curator Notes

- Infinite-budget validity and ideal Gibbs/KL bounds do not certify practical finite-budget feasibility, optimality, training convergence or worst-case runtime.
- Conditional route-quality averages must be read alongside failure rates and the corresponding feasible-instance subsets.
- Separate size/hardness/task models and narrow synthetic generators limit universal generalization claims. Draft-limit feasibility checks here rely on unit pickup demands; sorting draft limits is not a generic proof for arbitrary demand models.
- Benchmark baseline provenance, inference-versus-training seeds and CPU/GPU budgets differ. Published tables were examined, not independently reproduced.
- Main Table1's medium-TSPTW50 greedy result (1.68%/.04% candidate failure) differs from Table10's repeated greedy row (1.73%/.06%). The version/protocol discrepancy is retained rather than silently merged.

## Reproducibility

- **Reading:** all31 formal ICLR pages, full bibliography and AppendicesA–H, complete proofs,15 tables and eight figures; framework, equations, principal results, all ablation/failure heatmaps and stability plots also visually checked.
- **Metadata:** four authors/three institutions checked; Jiayuan Wu capitalization normalized. The actual publisher HTML supplies `citation_publication_date=2026-04-20`, supporting the retained exact publication day. The author README identifies [arXiv:2505.17938](https://arxiv.org/abs/2505.17938).
- **Scientific inventory:** actual proceedings page links the complete PDF without a separate supplement. The404-entry public author tree has no additional PDF/TEX/notebook/archive manuscript; all seven PNG assets were opened and matched to paper framework/ablation/visualization figures. All named scientific appendices are in the read PDF.
- **Code read:** full lazy decoding loop, active TSPTW lookahead/backtracking functions, policy/RIE and ReLD modules, loss functions, representative main/RIE configs, test-all and Dumas drivers, data-generation entry point and requirements. Separate checkpoints are explicit. No training or benchmark rerun was performed.
- **Mask formula:** AppendixC prints `Softmax(C*tanh(z+M))`, which would give a finite logit to a masked entry. The actual action helper instead clips logits first, **then sets excluded entries to minus infinity**, yielding zero probability. The implementation and printed formula are not identical.
- **Budget and loss differences:** the actual test phase stops an unfinished route at the budget; training relaxes masks and penalizes the completed route. The default `combined_penalty` adds both violation magnitude and violated-node count, whereas the formal displayed objective describes magnitude alone. The training loop overwrites per-prefix log-probability stacks on backtracking; the ideal-distribution theorem should not be presented as a proof about this specific finite training update.
- **Configuration boundary:** README's `main/tsptw/...` training example selects a non-backtracking environment and plain policy. The separate `RIE/` configuration enables the lazy trainer/RIE (medium50 training budget15). The inspected `test_all.py` explicitly selects RIE for medium TSPTW50 and ordinary policies for the other default cases; it does not uniformly instantiate RIE everywhere. The Dumas driver uses the medium50 RIE checkpoint with budget5,000 and an optional classical local-search flag, off by default.
- **Data differences:** released50/100 configurations use49/99 customers plus a depot. The hard test-generation entry point defaults to coordinates0–100, whereas AppendixE.1 describes0–50; both use raw window width100. Thus the visible default generator is not automatically an exact reproduction of the formal hard-instance distribution. Pinning configuration and data provenance is necessary.
- **Source license difference:** AppendixG promises an MIT release, while the inspected repository LICENSE is GPL version3. This records source provenance without changing this curated repository's license.
- **Figure:** original complete Figure1 on formal PDF page6, including both training and decoding panels. [Official implementation](https://github.com/optsuite/LMask).
