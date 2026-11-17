---
id: fer
short_title: FER
title: Learning Feature Embedding Refiner for Solving Vehicle Routing Problems
authors:
- Jingwen Li
- Yining Ma
- Zhiguang Cao
- Yaoxin Wu
- Wen Song
- Jie Zhang
- Yeow Meng Chee
year: 2024
date: '2023-06-23'
acceptance:
  date: '2023-05-25'
  source_url: https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=1
venue: IEEE TNNLS
paper_url: https://doi.org/10.1109/TNNLS.2023.3285077
institutions:
- Sichuan Normal University
- National University of Singapore
- Singapore Management University
- Eindhoven University of Technology
- Shandong University
- Nanyang Technological University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: FER uses a pool of complete historical solutions, accumulated graph attention and recurrent memory to refine a pretrained constructive solver's embeddings between repeated full-solution constructions.
publication:
  date: '2023-06-23'
  source_url: https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=1
code_url: https://github.com/jingwenli0312/Feature-Embedding-Refiner
figure:
  path: paper-assets/fer/framework.png
  alt: FER repeatedly aggregates a pool of historical complete solutions using AGA, GRU memory and a gated nonlinear layer, then decodes a new complete solution. Original encoder embeddings are reused.
  caption: 'Figure 2: FER outer iterations with a three-solution pool.'
  source_url: https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=4
---
# Learning Feature Embedding Refiner for Solving Vehicle Routing Problems

> **TL;DR:** FER inserts a learned refiner between a pretrained routing encoder and decoder. A pool of **complete historical solutions** and recurrent memory change the distribution used to construct the next complete route. The refinement occurs **between full constructions**, rather than at each decision of one partial route. It improves AM/POMO on the tested TSP/CVRP settings, with extra computation and dependence on backbone quality.

## Motivation

Repeated sampling from a fixed constructive policy can revisit similar routes. FER conditions later samples on previously constructed solutions, while retaining the original encoder-decoder architecture. It seeks more useful search diversity without selecting task-specific local neighborhood operators. Here a search iteration is an entire route-construction rollout, or N rollouts for POMO; it is not one next-customer decision. [Sections 1-3.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=2)

## Contributions

- Introduces an encoder-refiner-decoder framework for repeated, history-conditioned construction.
- Combines accumulated graph attention (AGA), GRU memory and a gated nonlinear layer (GNL) to integrate a solution pool with fixed original instance embeddings.
- Trains the refiner and pretrained decoder jointly with best-so-far improvement rewards, while freezing the encoder.
- Tests FER-AM and FER-POMO on synthetic TSP/CVRP, pool/component ablations and TSPLIB/CVRPLIB transfer. [Sections 3-5.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=3)

## Methodology

### Complete-solution search state

The state contains original node embeddings and a pool of at most K complete solutions, including their directed edges and costs. An action constructs **y complete solutions from scratch**: y=1 with AM and y=N with POMO's different starting nodes. The reward is the reduction in best-so-far tour cost; for multiple rollouts the paper maintains corresponding best-so-far records. Historical incumbents guide embeddings, but the new solution is not a structural edit of an incumbent. [Section 3 and Figure 2.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=3)

### Refiner and decoder

1. The pretrained encoder produces width-128 embeddings using AM's three or POMO's six attention layers, with eight heads and feed-forward width512. The **original output is reused at every outer iteration**.
2. **AGA** represents each historical route as directed edges. Endpoint query/key compatibility and edge distance enter a learned three-layer 2-to-16-to-1 feed-forward transformation. Multihead outputs are fused and accumulated across routes, scaled inversely by each route's cost. Missing edges receive negative infinity before row softmax. The resulting weights aggregate original embeddings of successor nodes appearing in the pool.
3. A **GRU** combines the current aggregated pool information with memory from earlier outer iterations.
4. **GNL** computes absorb/reserve gates from the original node representation and recurrent information, then combines original features with the learned guidance. The decoder uses these refined representations to construct complete feasible solutions with its normal visited/capacity masks and autoregressive context. [Sections 4.A-4.C, Equations 2-21 and Figure 3.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=4)

The pool is deliberately **not simply the best K routes**. Randomly selected slots are replaced by new decoder solutions, and an epoch-dependent diversification rule increasingly maintains an additional freshly random solution. POMO draws K solutions from its newly generated N candidates. Table II compares this diversified scheme against retaining the best K. [Section 4.D.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=6)

### Training and taxonomy

Training uses n-step A2C. The **encoder is frozen**, but **both the refiner and pretrained decoder are trainable**; an MLP critic processes refined node embeddings and their mean pool. Training rollouts run100 outer iterations. FER-AM uses batch512, n=4 and actor/critic learning rates1e-4/5e-5; FER-POMO uses batch32, n=5 and5e-5/1e-6. The respective learning-rate decays are.99/.988. The published schedule explicitly specifies20 batches per epoch,100 epochs for CVRP20/50 and200 for CVRP100; these CVRP-specific epoch statements should not silently be extended to every TSP setup. [Algorithm 1 and Section 5.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=7)

**Specialist, constructive:** task/size-specific pretrained AM/POMO models and refiners are used; integration into two solver architectures does not establish one checkpoint for multiple problems. Each learned action generates a fresh complete solution through partial-route construction. Best-so-far rewards and pooling make this iterative search, but there is no learned incumbent-editing neighborhood, unlike the improvement methods discussed separately in Section 2.B. Neural parameters remain fixed during evaluation; changing hidden states and embeddings is not online weight training.

## Experiments

### Data and budgets

Synthetic tests use **10000 instances each** of TSP/CVRP20/50/100 from the AM test set. FER-AM uses T=200 or5000 outer iterations; AM samples S=200 or5000 routes. FER-POMO uses T=200, with N routes per iteration and optional **eight augmentations**, for200N or1600N constructed candidates per instance. Matching T and S matches these backbones' route counts, not the number of tours generated by other improvement methods. CVRP pool settings are K=6/6/8 at20/50/100. [Section 5.A-5.B.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=7)

Reported runtime is for the **whole10000-instance set** on one TITAN XP GPU for neural methods, versus a single2GHz CPU core for classical methods. These different implementations/hardware make runtime comparisons indicative; a minute value is not per-instance latency. TSP gaps use Gurobi references, CVRP uses HGS solutions, which are not universal optimum certificates. [Table III.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=9)

### Main comparisons

| Setting | Original backbone gap / full-set time | FER gap / full-set time |
| --- | --- | --- |
| TSP100, AM200 | 2.63% /10min | 1.64% /12min |
| TSP100, AM5000 | 2.13% /4.3h | 1.12% /5h |
| TSP100, POMO200 with eight augmentations | .08% /7.4h | .03% /8.5h |
| CVRP100, AM200 | 4.67% /14min | 3.43% /22min |
| CVRP100, AM5000 | 3.77% /5.5h | 2.64% /8h |
| CVRP100, POMO200 with eight augmentations | 1.01% /12h | .56% /14h |

FER improves its matched backbone across Table III, with extra runtime. Improvements over the already stronger POMO are smaller; **FER-AM still trails POMO** in several comparisons. CVRP20 FER-AM5000 has.50% gap, worse than the cited AM+LCP2560/1 result's.35%, despite other LCP settings/scales favoring FER. Results therefore do not imply dominance over all neural solvers. [Table III and Section 5.C.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=9)

### Ablations and transfer

Increasing CVRP100's pool from2 to10 lowers cost16.025 to15.973 but raises full-set runtime5.7 to9.1hours at5000 iterations; K8 is the chosen compromise. At200 iterations, diversified pooling gives costs6.181/10.560/16.097 versus greedy pooling6.186/10.569/16.116. On CVRP50, AGA plus simple addition has cost10.605; adding GRU gives10.518, GNL without GRU10.512, and all three components10.495. Ablation gaps in Tables I/IV/V use the **best listed method**, not the main HGS reference. [Tables I-II/V.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=8)

The1000-instance GA comparison matches FER's initial pool and outer iteration counts in selected rows; a separate GA baseline uses population50 and12000 iterations. FER's advantage there is specific to those protocols. Figure4 compares progress by **iteration**, including POMO's many candidates per iteration; it is not a wall-time or generated-candidate-matched convergence plot. [Table IV/Figure4.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=9)

Models trained at100 transfer to TSPLIB51-200 and CVRPLIB101-200. For these cases, POMO variants sample among the **three most probable next nodes**, using200 iterations and eight augmentations. TSPLIB mean reference gap decreases **7.07 to6.25%**; CVRPLIB **4.53 to3.78%**. These are relative reductions13.12/19.82% in the mean gap, not percentage-point improvements or optimality rates. Opt. entries may be optimal **or best-known** values. [Tables VI-VII and Section 5.E.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=10)

All benchmark rows were checked. Gains are not universal: FER is worse than POMO on pr144, pr152 and u159, and on CVRPLIB X-n106-k14, X-n143-k7 and X-n153-k22; Wu et al. is better on some TSPLIB cases and X-n172-k51. Many substantial gaps remain, including d198 FER21769 versus reference15780. The observed average gains do not demonstrate strong generalization for arbitrary distributions/sizes.

Figure5 compares next-node probabilities for the **same fixed partial route** at outer iterations50/100/150/200; it demonstrates changing history-conditioned distributions across reconstructions. It is not evidence that embeddings are recomputed after every partial-route decision. Figure6 reports approximately quadratic scaling with node count and approximately linear scaling with pool capacity over the tested ranges. [Section 5.D-5.F.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=11)

## Limitations

### Reported by the Authors

- Final quality depends on the pretrained backbone; boosts to a highly optimized model such as POMO may be modest.
- Better out-of-distribution generalization, improvement-method integration, other combinatorial tasks and larger problem sizes remain future work. [Section 6.](https://ymchee66.github.io/home/PDF/embeddingrefiner.pdf#page=12)

### Curator Notes

- Full construction is repeated many times, with additional memory, pool processing and offline training; the reported gain is not cost-free.
- Backbone/sample matching does not equalize every baseline's hardware, complete candidate count or local-search effort. Iteration plots alone do not establish latency superiority.
- Mean benchmark improvements coexist with individual losses and sizable residual gaps; HGS/best-known reference gaps must not be described as certified optimality.
- The code READMEs contain example settings differing from the paper, including FER-POMO training batch100 rather than32, duplicated augmentation labels and CVRP examples pointing to TSP pretrained paths. Use task-correct checkpoints and the published protocol rather than copying these examples literally.

## Reproducibility

- **Formal publication/full text:** [IEEE TNNLS](https://doi.org/10.1109/TNNLS.2023.3285077); fully reread the **13-page formal IEEE issue PDF**, supplied by coauthor Yeow Meng Chee. Its title-page footer explicitly records acceptance25May2023, online publication23June2023, current-version date30October2024, and November2024 volume35/no11 issue. The repository year remains2024; the earlier unsupported15June date is corrected. All seven authors and six institutions match the formal title page.
- **Scientific material:** no separate appendix or missing scientific supplement is referenced in the complete article. The IEEE landing was manually attempted but returned robot verification; the formal author-hosted PDF was read in full. The official recursive code inventory contains332 members and no PDF/ZIP scientific attachment. No claim is made to have inspected inaccessible IEEE attachments.
- **Official implementation:** [jingwenli0312/Feature-Embedding-Refiner](https://github.com/jingwenli0312/Feature-Embedding-Refiner), linked in the paper under the older Demon0312 account name, now redirected. Main, FER-AM and FER-POMO READMEs were fully checked; both backbones, model directories and example commands are present. This review checks provenance/configuration, not executed retraining or reproduced scores.
- **Figure:** original Figure2, PDFpage4, showing AGA/GRU/GNL, fixed encoder features and multiple whole-solution iterations. Method formulas, all seven tables and figures were visually checked.
