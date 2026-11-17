---
id: beyond-static-priors-dynamic-neural-guidance-for-large-scale-ant-colony-optimization
short_title: DyNACO
title: 'Beyond Static Priors: Dynamic Neural Guidance for Large-Scale Ant Colony Optimization'
authors:
- Dat Thanh Tran
- Van Khu Vu
- Yining Ma
year: 2026
date: '2026-06-02'
publication:
  date: '2026-08-08'
  source_url: https://doi.org/10.1145/3770855.3817893
venue: KDD
paper_url: https://doi.org/10.1145/3770855.3817893
institutions:
- VinUniversity
- Massachusetts Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Routing
- Packing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Orienteering Problem
- Multiple Knapsack Problem
- Bin Packing Problem
summary: A state-aware GNN repeatedly shapes ant transitions using pheromone and incumbent features, trained with
  trajectory replay. Large-scale routing uses incumbent perturbation and restricted refinement; separately trained
  non-routing extensions use constructive ACO. Conditional local-search arguments and version-specific code qualify
  the claims.
arxiv_url: https://arxiv.org/abs/2606.04039
code_url: https://github.com/shoraaa/DyNACO
figure:
  path: paper-assets/beyond-static-priors-dynamic-neural-guidance-for-large-scale-ant-colony-optimization/framework.png
  alt: Dynamic graph guidance observes pheromone and incumbent state, supplies ant probabilities and receives post-refinement
    training feedback.
  caption: 'Figure 1: Static DeepACO guidance versus DyNACO state-aware and trajectory-aware guidance.'
  source_url: https://arxiv.org/pdf/2606.04039v1#page=3
---

# Beyond Static Priors: Dynamic Neural Guidance for Large-Scale Ant Colony Optimization

> **TL;DR:** DyNACO repeatedly predicts neural ACO guidance from the current pheromone and incumbent, rather than freezing a geometry-only prior. Its TSP/CVRP branches improve existing solutions; separately trained OP/MKP/BPP extensions use constructive ACO. The complete paper is **specialist/constructive–improvement**, with no demonstrated joint checkpoint across native problems.

## Motivation

Static neural heatmaps are commonly trained before pheromone evolves but reused throughout an iterative ACO run. DyNACO trains on evolving search states and periodically refreshes its guidance. Sparse candidate graphs, short incumbent perturbations and scope-restricted refinement make this interface tractable at up to100,000nodes. Claimed improvements concern the tested backends and protocols, not all static-prior or learning-guided optimizers. [Introduction/related work.](https://arxiv.org/pdf/2606.04039v1#page=1)

## Contributions

- A two-level, fixed-duration semi-MDP interface observes geometry, pheromone and incumbent state every S inner ACO iterations.
- Six sparse edge features summarize distance, pheromone concentration/relative strength and incumbent adjacency; a12-layer GNN with a3-layer MLP emits residual guidance logits.
- Trajectory replay and a clipped policy surrogate train guidance from per-ant post-refinement costs over the search run.
- Incumbent-based TSP perturbations and a capacity-aware CVRP backend use scope-restricted refinement(SRR); additional constructive OP/MKP/BPP experiments test the dynamic interface beyond routing. [Method/extension.](https://arxiv.org/pdf/2606.04039v1#page=3)

## Methodology

### Dynamic guidance and training

At outer step h the policy maps the sparse graph, pheromone and incumbent to an N×K logit matrix z. Inner transitions combine alpha·log(tau)+beta·log(eta)+gamma·z; geometric heuristics and classical pheromone are retained. The network output stays fixed for S inner steps, while pheromone and the incumbent continue evolving. Pheromones are interpolated toward fixed bounds[1/K,1], avoiding cost-dependent input scales. Positive transition support on available candidates does not give access to edges outside the candidate/fallback mechanism.

The nominal training objective averages post-refinement cost over all ants and H×S iterations. A per-iteration ant-mean baseline produces advantages; four PPO-style replay epochs follow each outer interval. The manuscript first defines a full path likelihood ratio but also divides log probabilities by stochastic-decision count. **Actual replay uses exp(mean-logp-new−mean-logp-old)**, a geometric-mean ratio, not the unnormalized full-trajectory importance ratio printed in Equation5. This is a modified surrogate; exact standard-PPO/long-horizon policy-gradient guarantees should not be inferred. Rewards are local post-refinement ant costs rather than explicit future-return estimates. [Equations1–5/Algorithm1.](https://arxiv.org/pdf/2606.04039v1#page=5)

### Routing perturbation, other-task construction and scope

For TSP, ants start from a complete incumbent and make up to M neural-guided relocation decisions. Classical refinement repairs the affected region; the best solution and pheromone are updated. CVRP maintains feasible routes with capacity masks and intra-route2-opt, inter-route relocate/swap and2-opt* tail exchange. These are **routing improvement** branches, despite the ACO terminology of 'ant construction'. The public initialization is classical greedy, not a newly learned initial constructor.

Section4.4 applies the proposed trajectory-aware dynamic guidance to DeepACO's original OP, multiple-knapsack and bin-packing environments without SRR. Those independently trained constructive branches justify the whole-paper mixed paradigm; they do not turn routing perturbation into construction. Same architecture/interface across tasks is not a shared joint checkpoint. Current code uses problem-specific input dimensions and weights. [Perturbative environment/extension.](https://arxiv.org/pdf/2606.04039v1#page=3)

### Conditional local optimality and actual implementation

AppendixB.2's argument assumes the incoming tour is already candidate-graph2-opt optimal and that every newly affected candidate move is checked/reactivated. Under those coverage assumptions, no remaining improving move in that restricted move set is the relevant certificate. It is not global TSP optimality, unrestricted all-pairs2-opt optimality, or a proof of policy-gradient convergence. A checklist can propagate beyond the initial M perturbations; the text does not establish an N-independent worst-case O(MK) bound for the complete convergent repair, including all reactivations/tour updates.

In the actual `final_final` branch, TSP `two_opt_nn` advances a cursor through a checklist and only appends affected endpoints if absent from the **entire** list. Already processed endpoints are therefore not reactivated by that routine. Its greedy initialization also does not itself certify candidate2-opt optimality. Consequently the printed convergence argument cannot simply be applied to this inspected routine. The CVRP branch contains its own route/feasibility logic and should not be assumed identical to the older main-branch giant-tour/split implementation. These are snapshot-specific boundaries, not an independent rerun or refutation of the benchmark tables. [Full SRR proof/backend.](https://arxiv.org/pdf/2606.04039v1#page=11)

## Experiments

### Data, models and computation

All evaluations are fixed-seed deterministic single runs, with no across-training-seed confidence interval. Training samples uniform coordinates online:32instances per epoch for10epochs=320instances per training run. The hardware is RTX5090 plus16-core Ryzen97950X. Reported defaults are100ants, H10/S100, M12, K32,12GNN layers/hidden32, AdamW+cosine learning rate5e-6, clip.1 and four replay epochs. The network has67,361parameters; the README's approximate50K is not the paper's exact count.

Main synthetic benchmarks contain128instances at1K and16at each larger scale(5K/10K/50K/100K). CVRP capacities are50/250/500/1000/2000. In-scale models are trained separately; **Tables11–12 separately use1K models zero-shot**. The conclusion's broad 'trained only at1K' phrasing must not replace that distinction. Training takes about30minutes atTSP1K and4hours at100K; complete training budgets for every extra COP/seed/baseline are not supplied. The main text says64backup neighbors while TableA2 says32; actual wrappers default32, so this configuration difference requires reconciliation. [Setup/AppendixC.](https://arxiv.org/pdf/2606.04039v1#page=5)

### Quality and full-runtime trade-offs

At I10000, TSP1K/10K/100K gaps are .20/.82/1.90% versus unguided ACO .48/2.02/3.12%; times3.68/17.89/171.69s versus5.44/26.81/223.32s. These are total CPU+GPU solver times, with matched iteration budgets rather than universal equal-time comparisons to every baseline. The quality gain can outweigh neural inference cost because downstream repair is shorter. SILPRC1000 has2.45% at100K but much longer displayed time2.60h. LKH remains the reference, with larger-scale solutions best-known rather than certified optima.

Synthetic CVRP is more limited: at100K/I10000, DyNACO gap6.75%/11.70minutes improves ACO7.26%/11.55minutes, while SILPRC1000 reaches−2.55% relative to the HGS reference at2.17hours. DyNACO does not have the best quality among all neural methods on these CVRP rows. Negative reference gaps do not mean exceeding a true optimum.

**Neural overhead and total-runtime overhead differ.** Table2 CVRP10K has GPU.56s under1% of total76.70s, but total increases from74.43s by3.05%. At100K,5.93s of GPU is under1%, while total701.97vs692.81s rises1.32%. Shorter I1000 runs show larger total increases, e.g.CVRP50K34.73vs31.73s(+9.5%). Thus the prose's blanket under1% total-overhead claim is not supported across displayed settings. [Tables1–3.](https://arxiv.org/pdf/2606.04039v1#page=6)

### Transfer, ablations and remaining inconsistencies

On33large EuclideanTSPLIB and14CVRPlib cases,1K-model transfer gives gaps .89/3.66% and times11.57/51.07s, versus SIL3.03/7.69% with longer listed runtimes. These selected benchmarks support transfer without claiming operational validation. On syntheticCVRP10K/I1000, the1Kmodel loses .68percentage points against the in-scale model; transfer is not always negligible.

Table4's16-instance ablation shows static→trajectory-aware→state-aware gains, under a different sample set from the main128instance1K tests. SRR gives positive learning progress where unrestricted FLS gives negative progress in the shown run. Stabilizing pheromones improves guided quality, but unguided ACO worsens in TableA3(1.68→2.16%); this is not a universal standalone improvement. Inference schedules are task/scale-dependent: annealing is not always the lowest-gapTSP option, and CVRP5K phased injection7.07% is worse than constant6.58%. Table10 adds OP/MKP/BPP results but lacks a full per-task budget/seed account. [Tables4–12/A3–A8.](https://arxiv.org/pdf/2606.04039v1#page=7)

AppendixA5 has finite TSP10K memory for POMO/LEHD where Table1 marks corresponding configurations OOM; protocols explaining this difference are not provided. AppendixD's SIL100K42h differs from Table1's2.60h; a possible instance-set aggregation is not specified and is not silently assumed. TableA8's100K memory2.584GB differs from A5's3.11GB under unidentified settings. These discrepancies limit exact reproducibility rather than automatically invalidating all reported outcomes.

## Limitations

Fixed candidate size and scale-specific temporal schedules constrain reachability/adaptability. Sparse O(NK) feature storage is different from an N-independent bound for all search/refinement/preprocessing work. The SRR proof is conditional and the inspected routine does not implement its stated processed-node reactivation. The normalized replay ratio differs from literal full-path importance weighting. Separate problem/scale runs, fixed-seed evaluation, selected real-world sets and incompletely matched comparator budgets limit claims of universal dominance or a single generalist model.

The current main branch, later `final_final` branch and historical prototypes differ. This review inspected relevant source paths and artifacts, without compiling the full CUDA/OpenMP environment, retraining models or independently reproducing the tables.

## Reproducibility

- KDD2026 DOI10.1145/3770855.3817893, pages4671–4682, has publisher-deposited online date2026-08-08/print2026-08-09. The front date is primary arXiv first posting2026-06-02. Tran/Vu are at VinUniversity; Ma is MITLIDS/corresponding. All three match the actual manuscript byline.
- **All12pages of arXiv2606.04039v1** were fully read, including all40references and AppendicesA–D. This identified authorized full-reading copy is not claimed byte-identical to an unobtained publisher PDF.
- [Official repository](https://github.com/shoraaa/DyNACO) main tree`6e6ead43fc5f9a9f2105eca4a7f677ee5bbd4bdc` has667entries. All seven branches and release assets were inventoried; the sole release has no assets. Main's sevenPDFs are bundled third-party LKH/TSPLIB reports, not additional DyNACO scientific appendices. Later `final_final` tree`8daa38af9ead2d090216230c171b86c8c5bd230f` was inspected for the actual dynamic network/replay/backend; full README/test-README and the small final-README differences were read. Main and final_final commits are2026-01-29/02-27, within cutoff.
- Historical v2 contains a draftTeX/prototype notebooks, not a named missing final-paper appendix. The standalone one-page`test_viz.pdf` was registered, fully read and actually viewed: only one of four panels contains a BaseMFACO curve with undocumented benchmark/budget. It is explicitly a historical artifact, not additional evidence for formal tables. No claim is made to have executed or exhaustively read all prototype notebook code/outputs.
- Original complete Figure1 is cropped from PDFpage3, rectangle(52,80,560,338), at4× and actually viewed. Key algorithm/proof pages, all reported tables and four main figures were rendered/visually inspected; the supplemental prototype plot also has manual coverage.
- Internal links require explicit body/table references and the matching complete bibliography. The new RL4CO entry was independently matched to its primary publisher DOI/title/all33authors. The separately published2021SNComputerScience2-opt journal extension is not forced onto the ECAI2020 conference ID. SIGD is matched to the exact TMLR paper represented by`gumbeldore`, and SIL to the explicitly cited formal Boosting title.
