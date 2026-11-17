---
id: l2r
short_title: L2R
title: Learning to Reduce Search Space for Generalizable Neural Routing Solver
authors:
- Changliang Zhou
- Xi Lin
- Zhenkun Wang
- Qingfu Zhang
year: 2026
date: '2025-03-05'
venue: KDD
paper_url: https://doi.org/10.1145/3770855.3818173
arxiv_url: https://arxiv.org/abs/2503.03137
code_url: https://github.com/CIAM-Group/L2R
institutions:
- Southern University of Science and Technology
- Xi’an Jiaotong University
- City University of Hong Kong
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Vehicle Routing Problem with Time Windows
summary: A lightweight context-conditioned reducer ranks remaining feasible nodes, and a local attention constructor
  selects the next visit; distance priors and separate problem-specific models support large-scale routing, with
  optional borrowed PRC search.
figure:
  path: paper-assets/l2r/framework.png
  alt: Static distance reduction followed by learned candidate scoring, local coordinate normalization and attention-based
    next-node construction.
  caption: 'Figure 3: L2R combines static reduction, dynamic candidate ranking and local construction.'
  source_url: https://arxiv.org/pdf/2503.03137v3#page=4
publication:
  date: '2026-08-08'
  source_url: https://api.crossref.org/works/10.1145/3770855.3818173
---
# Learning to Reduce Search Space for Generalizable Neural Routing Solver

> **TL;DR:** Rank the remaining feasible nodes with a lightweight, distance-biased model, then use a heavier constructor on a small candidate set. Separate TSP, CVRP and CVRPTW models are trained at100 nodes. Large-scale results distinguish greedy construction from optional SIL-style PRC search: the largest10-million-node experiment is **one TSP instance taking96 hours**, not a real-time result for every routing problem.

## Motivation

Repeated attention over all unvisited nodes becomes expensive at large sizes, but aggressively retaining only the nearest nodes can remove useful long edges. The paper demonstrates this risk by restricting LKH and learned routing models. These are diagnostic baseline experiments: for example, retrained LEHD with20-nearest candidates has11.09% TSP1K gap versus3.17% with its full candidate set. They are not L2R result rows. [Section2/Tables2–3.](https://arxiv.org/pdf/2503.03137v3#page=2)

## Contributions

- A three-stage pipeline combines modest fixed distance pruning, learned state-dependent candidate ranking and local neural construction.
- A reduction model with one embedding layer and context-to-node attention avoids applying a deep global self-attention encoder at every decision.
- Learned compatibility is combined with distance priors in both reduction and local construction; the ablation shows that the reduction-side distance term is critical to large-scale transfer.
- Experiments cover synthetic and public routing benchmarks, including CVRPTW, and separate greedy decoding from an externally proposed reconstruction procedure.

## Methodology

### Static and dynamic reduction

The static rule removes the **farthest10%** of potential neighbors by Euclidean distance. It therefore retains approximately90%, rather than retaining only the nearest10%. The nominal retained graph is still dense in asymptotic terms, and the rule is empirical rather than a proof that an optimal edge survives. [Equation1/Figure3.](https://arxiv.org/pdf/2503.03137v3#page=4)

Each node receives a shared linear embedding of coordinates and relevant attributes. A context constructed from the current partial route queries the remaining feasible nodes. For TSP it uses the first and current nodes; CVRP additionally represents remaining capacity. Projected features and a compatibility operation produce node scores, incorporating a learned negative distance bias proportional to `alpha * log2(N) * distance`. The highest-scoring k nodes form the local candidate set. This is a context-conditioned ranking at each construction step, not one fixed learned subgraph for the whole instance. [Equations2–6.](https://arxiv.org/pdf/2503.03137v3#page=5)

The implementation computes the current-to-all distance row and sorts it at each visit, with a nearest-unvisited fallback when static pruning masks every remaining node. It does not materialize the nominal full N-by-N graph. This avoids quadratic distance storage, but does **not** establish linear total runtime: the route still requires repeated global scans and sorting.

### Local construction and training

The local constructor embeds the first/current nodes and candidate nodes, applies six128-dimensional attention layers with feed-forward width512, residual connections and LayerNorm, then predicts the next visit. It uses the instance-conditioned attention mechanism cited from ICAM. The local distance bias scales with `log2(k)`; k is20/50/15 for TSP/CVRP/CVRPTW. Candidate coordinates are shifted and isotropically scaled by the maximum coordinate range. The reference first node/depot can be clipped into the normalized box. This feature transformation is not an exact distance-preserving transformation of every original input. [Section3.3/AppendixB.](https://arxiv.org/pdf/2503.03137v3#page=5)

The training objective combines reduction and construction log probabilities with the same negative full-route-length reward and a greedy rollout baseline. Separate models are trained on uniformly generated100-node instances. Reported training is100 epochs of2,500 batches: batch180 for TSP,60 for CVRP and128 for CVRPTW, corresponding to45M/15M/32M instance presentations. Adam starts at.0001 with.98 epoch decay on an RTX3090. These are training presentations, not unique stored instances or optimizer-equivalent budgets across tasks. [Section3.4/4.1.](https://arxiv.org/pdf/2503.03137v3#page=5)

### Scope and optional search

The catalog retains **specialist/constructive**: separately trained problem-specific weights produce routes by sequential next-node construction. The paper additionally applies **Parallel local ReConstruction (PRC), explicitly borrowed from SIL reference35**, to greedy initial solutions. PRC edits complete incumbents without retraining the model, but it is an optional external search protocol rather than a newly proposed L2R improvement operator. Greedy, PRC100 and PRC1,000 results must remain distinct. [Section4.1.](https://arxiv.org/pdf/2503.03137v3#page=6)

## Experiments

### Scale, references and timing

Synthetic TSP tests contain128 instances at1K and16 at5K/10K/50K/100K; CVRP contains100 at1K/5K and16 at larger sizes. CVRPTW uses16 instances at each of1K/5K/10K. Main Table4–5 times are **average per instance**. The appendix architecture ablations instead report whole-test-set times: TSP1K6.5seconds over128 instances is consistent with the main.05-second average. These are amortized batch times rather than separately measured single-request latencies. [Section4/Tables4–5/13.](https://arxiv.org/pdf/2503.03137v3#page=6)

TSP gaps use the supplied Concorde/LKH reference solutions, and CVRP/CVRPTW use heuristic HGS/PyVRP references. A negative CVRP gap means improvement over that reference, not a negative gap to a certified optimum. Baselines differ in original training scale, runtime budget and, in some cases, borrowed result provenance.

| Setting | Greedy gap / average time | PRC1,000 gap / average time |
| --- | --- | --- |
| TSP1K |4.49% /.05s |1.72% /24.9s |
| TSP100K |4.79% /1.8min |3.00% /15.5min |
| CVRP1K |11.37% /.1s |7.42% /40.3s |
| CVRP100K |-1.55% /2min |-1.75% /1.1h |

The results demonstrate a quality/time trade-off, not uniform dominance. On TSP1K, LEHD greedy is better at3.11%/.8s, and its RRC1,000 reaches.72% in3.3minutes. On CVRP1K, BQ beam16 is both better and faster than L2R PRC1,000 at4.61%/14s; LEHD reaches2.91% in3.4minutes. L2R's strength is the tested larger-scale regime, including completing cases where several deep global-attention baselines run out of memory. [Table4.](https://arxiv.org/pdf/2503.03137v3#page=7)

CVRPTW greedy gaps are9.39/7.95/8.83% at1K/5K/10K, with mean times.5/2.5/5.2seconds. MTPOMO, MVMoE and ReLD are tested without augmentation to avoid memory limits; the resulting comparison does not represent their full augmented protocols. The scientific paper contains this third task even though the inspected official archive does not yet supply its environment/model/checkpoint. [Table5.](https://arxiv.org/pdf/2503.03137v3#page=7)

### Distribution and public benchmarks

Cross-distribution experiments use20 instances per5K clustered/explosion/implosion dataset. L2R PRC1,000 obtains TSP gaps3.16/3.52/2.87% and CVRP.99/1.14/.73%, with additional search time. Some comparison methods have augmentation disabled. These are specific distribution-shift tests rather than an assertion of distribution-independent performance. [Table7.](https://arxiv.org/pdf/2503.03137v3#page=8)

The public benchmark subset contains33 symmetric TSPLIB instances from1K through85,900 nodes and ten CVRPLIB Set-XXL instances from3K through30K. Greedy aggregate gaps are8.61/11.55%, reduced by PRC1,000 to3.15/8.14%. Baseline aggregates that omit out-of-memory cases are not identical-subset comparisons. [Table8.](https://arxiv.org/pdf/2503.03137v3#page=8)

The DIMACS E-series tests extend TSP alone to1M,3.162M and10M nodes. The last case, E10M.0, has5.048% reference gap and takes96hours; E1M.0 takes2hours at5.021%, and E3M.0 takes12hours at5.049%. This demonstrates completing those particular instances with a100-node-trained model. It does not show10M-node CVRP/CVRPTW performance, real-time latency, or certified near-optimality. [Table9.](https://arxiv.org/pdf/2503.03137v3#page=8)

### What drives the result

Replacing learned ranking with a retrained nearest-neighbor reducer worsens greedy aggregate TSPLIB/XXL gaps8.61→8.98% and11.55→13.06%. The candidate-hit statistic measures whether the chosen candidate set contains a reference route's next node; it is not a guarantee that an optimal complete route remains available. The plotted improvements are modest relative to the much larger change caused by removing the reduction-side distance prior. [Section5/Figure4/Tables10–11.](https://arxiv.org/pdf/2503.03137v3#page=9)

In Table12, removing both distance biases gives305.95% TSP100K gap; retaining only the local bias gives335.51%; retaining only the reducer bias gives5.68%, and using both gives4.79%. Substituting vanilla multi-head attention for ICAM-style attention worsens1K/10K/100K gaps6.90/7.54/7.72% versus4.49/4.82/4.79%. These ablations support the particular combination of geometry, reduction and architecture, rather than a geometry-free learned pruning claim. [AppendixC.](https://arxiv.org/pdf/2503.03137v3#page=12)

Static reduction has a smaller effect: L2R100K whole-set time changes29.6→29.1minutes with the same rounded4.79% gap. Applying it to LEHD1K changes3.11→3.38%, so the general statement that pruning always preserves quality is stronger than the table supports. [Table14.](https://arxiv.org/pdf/2503.03137v3#page=12)

## Limitations

### Discussed in the Paper

The motivation identifies the risk of excluding useful long-distance choices and the difficulty of identifying good candidates using an excessively lightweight model. The proposed balance still uses manually selected candidate counts, distance priors and a fixed static-pruning fraction. Reported large-scale greedy gaps remain nonzero, and optional PRC adds considerable runtime.

### Curator Notes

- Separate task weights and attribute handling do not constitute one shared-checkpoint generalist solver.
- The million-node evidence is a small set of TSP instances, with96-hour time at10M. Public benchmark and distribution tests have finite, explicitly stated coverage.
- Static pruning has no optimality-preservation proof. Retaining90% of nominal edges and repeatedly scanning/sorting all remaining nodes should not be described as an asymptotically sparse, linear-time full solver.
- Greedy construction is weaker than several baselines on1K instances. Equal search counts, different training sizes and CPU/GPU runtimes are not interchangeable comparison budgets.
- Published tables do not supply independent-training-seed uncertainty for all settings; candidate-hit measures depend on the supplied reference routes.

## Reproducibility

- **Reading/version:** all12 pages of arXivv3, including complete references and AppendicesA–C, freshly read. The actual manuscript is dated1June2026 and formatted for KDD2026 with DOI/ISBN. Key architecture, compatibility formulas, all main result groups and appendix ablation tables were visually inspected. This is the identified author-manuscript reading version, not a claim of byte identity with the inaccessible ACM PDF.
- **Publication:** four authors and SUSTech, Xi’an Jiaotong University and City University of Hong Kong checked against page1. Official Crossref metadata identifies the proceedings article and online publication8August2026, print9August2026. The first arXiv submission5March2025 is separately verified; the generic conference-notification acceptance date was removed.
- **Scientific inventory:** the ACM page returned403. The read12-page version includes all namedA–C scientific appendices. The paper's explicit resource DOI resolves to [Zenodo20493139](https://doi.org/10.5281/zenodo.20493139); its9MB official ZIP was downloaded, MD5 checked and all35 members manually inventoried. It contains code, two checkpoints, one architecture PNG and documentation, with no separate PDF/TEX/notebook or nested scientific archive. No unavailable extra attachment was claimed to have been inspected.
- **Archive coverage:** the inspected official release contains TSP/CVRP environments, models, pretrained weights and benchmark entry points, including DIMACS up to10M. It contains **no CVRPTW environment/model/checkpoint**. README cloud links are labelled datasets, not additional scientific documents.
- **Implementation cross-check:** reducer/context embedding, ICAM attention, compatibility, local coordinate transformation, distance-row pruning/fallback, candidate sorting, joint loss and greedy baseline were read. The constructor's NaN guard replaces affected probabilities with a first-candidate fallback. These defensive paths are not a proof of numerical or global-optimality guarantees.
- **Training objective qualification:** the release samples `upper_selected`, records its log probability for the reducer loss, but does not insert that sample into the candidate set; the constructor uses deterministic top-k ranking. Thus the sampled reducer action is not the executed candidate-selection action in that code path. The formal joint REINFORCE expression and release implementation are recorded separately; an unbiased joint gradient is not established by this inspection. No full training or benchmark rerun was performed.
- **Time/version qualification:** the release README's100K times are whole-set values, whereas main Table4 reports per-instance averages. The actual official source snapshot and paper budgets are not asserted identical beyond the checked paths.
- **Citations:** numbered in-text occurrences and the complete67-item bibliography were checked. The T2T and TAM references contain printed venue/year inconsistencies, preserved as source-reference errors rather than used to invent different works. DAR retains the cited early2024 preprint version. SIL35 is explicitly the formal2025 Boosting title/seven-author work.
- **Figure:** complete original Figure3, PDFpage4, cropped directly from the read manuscript. [Official code](https://github.com/CIAM-Group/L2R); [formal article](https://doi.org/10.1145/3770855.3818173).
