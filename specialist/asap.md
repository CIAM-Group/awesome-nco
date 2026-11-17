---
id: asap
short_title: ASAP
title: 'ASAP: Exploiting the Satisficing Generalization Edge in Neural Combinatorial Optimization'
authors:
- Han Fang
- Paul Weng
- Yutong Ban
year: 2026
date: '2025-01-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/fang26t.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/fang26t.html
institutions:
- Shanghai Jiao Tong University
- Duke Kunshan University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- 3D Bin Packing
summary: A proposal policy restricts feasible construction actions and a separate selector adapts to shifted distributions; tested with task-specific routing/online-packing models, with measured adaptation costs and limits to the printed theoretical guarantee.
arxiv_url: https://arxiv.org/abs/2501.17377
code_url: https://github.com/Kasumigaoka-Utaha/ASAP
figure:
  path: paper-assets/asap/framework.png
  alt: Proposal and selection policies construct actions; pretraining and cooperative tuning prepare the model, then online adaptation freezes proposal weights and updates selection weights.
  caption: 'Figure 3: ASAP decision stages, training phases and selection-only adaptation.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=5
---
# ASAP: Exploiting the Satisficing Generalization Edge in Neural Combinatorial Optimization

> **TL;DR:** A proposal policy retains promising feasible actions, and a selection policy chooses among them. New-distribution adaptation freezes the proposal and updates the selector. The paper reports gains on routing and online packing, using distinct task/backbone models: **specialist/constructive**. Its printed probability threshold is not a universal sufficient guarantee; the current code release also discloses important differences from the published experiments.

## Motivation

A learned policy can retain a good action among its top candidates even when distribution shift changes their precise ranking. ASAP calls this the **Satisficing Generalization Edge** and separates candidate coverage from final selection. This motivates adapting a smaller selector rather than repeatedly changing the complete policy. It is an empirical design rationale with conditional analysis, not a guarantee that arbitrary proposal pruning preserves optimal actions or that every gradient update improves a tour. [Sections1–4.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=1)

## Contributions

- A neural proposal/selection split is applied to PCT-based online3D bin packing and POMO/INViT-based TSP/CVRP construction.
- Base initialization and cooperative tuning prepare two policy roles; distribution-task MAML is proposed to improve initialization for adaptation.
- Online adaptation updates the selection policy while keeping the proposal fixed.
- Main and supplementary experiments compare coverage, solution quality, candidate-set size and separate training/adaptation costs. The theoretical claims require the qualifications below.

## Methodology

### Decision stages versus training phases

At a construction step, the proposal policy outputs a subset of feasible placement/next-node actions; the selection policy chooses the final action from that subset. In packing, the PCT representation and Empty Maximal Space heuristic first generate feasible placement candidates. In routing, feasibility masks and the host architecture supply visitation/capacity constraints. The two learned policies need not share parameters or have identical architectures. [Figure3/Section4.2.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=5)

The paper first trains a base policy, then initializes/tunes the proposal and selection roles cooperatively. MAML treats distributions as tasks, adapts on task-specific instances and updates an initialization through the adapted loss. On a shifted distribution, only selection parameters are updated with the host's reinforcement-learning loss. These are **parameter-adaptation operations**, not learned moves on a complete incumbent routing solution. All resulting routes/packings are constructed action by action.

The current implementation uses alternating role-training blocks rather than one differentiable update through discrete top-k. The INViT proposal/selection structures differ and its documentation requires separate initialization checkpoints. Packing uses deterministic top-k; routing supports top-k and weighted sampling without replacement. Thus the theoretical sampling model and every empirical proposal mode are not identical.

### Tasks and scope

Euclidean TSP minimizes closed-tour length; CVRP minimizes total depot-return route length subject to customer demand and vehicle capacity. Online3D-BPP receives the current cuboid without future-item information, places it irreversibly without overlap/out-of-bin violations, and maximizes packed-volume utilization. The appendix describes the packed prefix before failure; this is not arbitrary item-subset selection or a guarantee of physical stability under a full dynamics model. [AppendixA.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=13)

PCT, POMO and INViT integrations, packing versus routing environments and TSP/CVRP input/state architectures are separately trained. Reusing the proposal/selection recipe across them does not establish one joint cross-problem checkpoint. Distribution-specific meta tasks also differ from distinct optimization problems.

### What the theoretical analysis supports

Theorem4.2/B.1 claims that, when the target action has probability `p > 1/(n-1)`, sampling k candidates without replacement and selecting with the same restricted policy improves the target-action probability. AppendixB reasons about a **single timestep**, initially with one target action, and uses approximations for remaining probability mass and an average-mass substitution for the conditional selector. The threshold is stronger than uniform random probability1/n, and it is not by itself sufficient in general. [Theorem4.2 and complete proof.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=14)

A direct counterexample under the stated weighted sampling model is n=100, k=2: give the uniquely optimal action probability.02, another action.9 and each of98 remaining actions.08/98. The condition.02>1/99 holds. Enumerating every pair containing the target gives

`P_two = Σ_j [p q_j/(1-p) + q_j p/(1-q_j)] p/(p+q_j) = .00741947190925`,

which is below the one-stage.02. Therefore the **printed universal sufficiency claim fails for this allowed policy**, without implying that the reported trained ASAP policies fail empirically. The robustness threshold in Theorem4.3/B.2 also relies on approximations and additional large-action/small-probability assumptions; it is not an unconditional distribution-shift guarantee or a full-return theorem. Multiple optimal actions are not independent events under sampling without replacement.

## Experiments

### Packing protocol and results

The container is20×20×20. Default discrete dimensions are2/4/6/8/10; ID subsets restrict these to large/medium/small sets, and OOD sets introduce dimensions1–11. Rotation-equivalent shapes are removed. Each subset samples100 nonuniform item distributions ×64 sequences, with continuous dimensions additionally perturbed by noise in[-.5,.5]³. Thus “ID” refers to dimension support as well as distribution choices, not simply an unchanged iid uniform generator. [AppendixE.1.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=23)

Packing uses ACKTR/KFAC, one graph-attention layer,64-dimensional embeddings and128 hidden units. Initialization250epochs ×200batches ×64 gives3.2M sequence presentations; a50-epoch phase adds.64M before accounting for role scheduling. Table4's horizon is70 and proposal size3, with50 discrete/100 continuous heuristic leaves. The sensitivity tables indicate that the **main continuous rows match k=10**, whereas discrete main rows match k=3; the single table-wide default should not be asserted for every result. Three seeds are reported, without full confidence intervals for all rows.

With MAML and selection adaptation, discrete ID-Large utilization changes73.5→74.2%, versus PCT70.0→70.2%. Continuous OOD-Small changes70.5→72.6%, versus PCT67.5→68.0%. These are percentage-point utilization gains. MCTS reference73.1% in the latter case is an approximate look-ahead benchmark, not a certified optimum. Larger k is not monotonically better; several discrete settings favor3–5 rather than10. [Tables1/6–8.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=7)

The preliminary “optimal action” frequencies come from sampled future sequences completed with a pretrained DRL rollout policy. Top-k coverage and the maximum.3percentage-point utilization loss in proposal-pruned MCTS support the specific heuristic-filter experiment. They do not turn that approximate rollout frequency into exact Q-values, nor supply measured MCTS wall-time speedups for every pruning setting. [AppendixC/Table3.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=19)

### Routing protocol and results

Main training uses TSP100/CVRP50;400initialization epochs ×300batches ×64 correspond to7.68M instance presentations, followed by50epochs/.96M per stated phase. Table5 specifies128-dimensional embeddings,512 feed-forward width, eight heads, two encoder/three decoder layers, k=8, learning rate1e-4 and eightfold augmentation. The paper's POMO configuration is therefore not its original standard architecture. CVRP uses capacity50 with demands1–10; the large CVRP500 column explicitly fine-tunes at100 nodes, while TSP100→1K fine-tunes at100. These are transfer-after-adaptation results, distinct from the “Before” zero-shot columns. [Tables2/5; AppendixE.2.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=24)

For clustered TSP1K, POMO changes57.25→68.23% gap after baseline adaptation, while POMO+ASAP without MAML changes47.88→40.01%. INViT with ASAP/MAML changes11.13→7.94%, versus INViT14.30→14.43%. On CVRPLIB cases above500 nodes, INViT+ASAP/MAML reaches10.32% after adaptation and TSPLIB above1K reaches6.98%. These remain nontrivial gaps and do not establish competitiveness against every stronger search solver at matched budget. [Tables2/10.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=8)

Selection-only adaptation and MAML are not universally the best rows: clustered CVRP500 INViT full-parameter tuning reaches9.01%, slightly better than selection-only9.15%; POMO's clustered CVRP50 ASAP without MAML5.11% beats its MAML5.33%. The k-sensitivity table's caption says “without MAML” while its actual rows say “with MAML” and match the main MAML numbers. The row identities are preserved instead of silently relabelling that experiment. [Tables2/11.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=30)

Small TSP references use Gurobi; larger TSP uses LKH with20K iterations and ten runs at1K/one run at10K. CVRP uses HGS, with a four-hour limit for the supplementary5K reference. Heuristic-relative gaps are not certified optimality gaps. OOM-triggered reductions in parallel POMO trajectories change inference budgets and are not fully itemized. Formal generator parameters for clustered/implosion cases also differ from the released code, as noted below.

### Training and adaptation are separate costs

Packing reports46hours discrete and152hours continuous training, with6.5/22.2minutes average adaptation. POMO+ASAP training is6h22m TSP/7h7m CVRP and adaptation21.5/22.8minutes; INViT+ASAP adaptation takes56.1/41.7minutes. These costs are additional to the inference-time columns. Reporting only.3–10.8minute routing inference times would omit the adaptation used to obtain the after-tuning results. The article does not fully specify the test-set normalization, online update counts or held-out adaptation/evaluation split for every table. [Tables9/12.](https://raw.githubusercontent.com/mlresearch/v306/main/assets/fang26t/fang26t.pdf#page=28)

Table12 prints52hours total for INViT TSP but its27hour pretraining +15hour post-training sum is42hours. This internal discrepancy is retained, rather than using one value as an unqualified recovered budget. Hardware is i7-12700/RTX4090; the pie chart's dominant simulation cost explains a measured profile, not a general no-latency-overhead guarantee.

## Limitations

### Discussed in the Paper

A selector cannot recover a high-quality action excluded by the proposal. Cooperative training needs a useful initialization, and candidate coverage, k and adaptation data affect performance. The reported method still incurs offline training and online interaction/gradient costs.

### Curator Notes

- The printed probability theorem has the explicit local counterexample above; its threshold and approximate robustness analysis must not be presented as universal guarantees. The empirical coverage/return results remain distinct evidence.
- Meta-learning across distributions and task-specific host integrations do not imply one generalist solver checkpoint. Adaptive parameters do not themselves make the inference paradigm an incumbent-improvement method.
- The formal clustered description uses Gaussian mean1/std0 and implosion also prints std0. The inspected generator instead uses standard-normal cluster offsets and a clipped normal displacement, so the source generator is not a literal implementation of those printed parameters.
- Continuous packing k, routing sensitivity labels, INViT training-time arithmetic and unspecified adaptation/test splits limit exact recovery of the original protocol. Three-seed declarations are not full uncertainty estimates or proof against adverse shifts.
- Current source validation and newly supplied routines do not establish that the published checkpoints used these implementations or that their result tables have been reproduced.

## Reproducibility

- **Reading:** all30 formal PMLR pages, full bibliography and scientific AppendicesA–F,12 tables and10 figures freshly read. Architecture, probability proof, MCTS plots, complete packing/routing tables and cost breakdown were rendered and visually checked. The deterministic pair enumeration is cached with its exact probabilities for the theoretical qualification.
- **Metadata:** actual PMLR meta confirms three authors, SJTU/DukeKunshan affiliations and publication29September2026. Actual arXiv history gives v1 on29January2025, v2 June2025, v3 January2026 and v4 June2026; its link and separate initial-publication date are now provided.
- **Scientific inventory:** PMLR's asset directory contains only the complete PDF. OpenReviewQI139RyR6I page/API/attachment are browser-challenged or403; no unobserved attachment is claimed read. All named scientificA–F material is inside the formal PDF. The official133-entry code tree4f126cd225b6f8e1637135d784d32bed828e82e9 has no additional PDF/TEX/notebook/archive. All six documentation files were read. The project page links an earlier arXivv3 paper, not a separate scientific supplement.
- **Actual implementation:** the official release has PCT-based packing and separate POMO/INViT TSP/CVRP modules. Its packing meta routine recomputes the outer loss on the initial model after adapting a separate inner model, with no adaptation-gradient connection/transfer; the authors explicitly say this is **not faithful MAML or first-order MAML**. The new routing functional-weight MAML does use independent support/query losses, but was added during repository preparation and has no published-result weights. The default task family list also includes all four distributions, so those families are seen tasks for that run.
- **Release limits:** datasets, pretrained checkpoints, complete MCTS/preliminary-figure implementation and AR2L/GOPT implementations are absent. Source/package smoke checks reported by the authors establish small-scale software execution, not convergence or published-table reproduction. Actual policy/filter/adaptation/meta/generator code was inspected here; no training/benchmark rerun is claimed.
- **References/figure:** only explicit citations with matched full references support internal edges, preserving the cited preprint/year. Complete original Figure3 is cropped from formal PDFpage5. [Formal publication](https://proceedings.mlr.press/v306/fang26t.html); [official implementation and scope disclosure](https://github.com/Kasumigaoka-Utaha/ASAP).
