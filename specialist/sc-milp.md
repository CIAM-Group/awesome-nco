---
id: sc-milp
short_title: SC-MILP
title: Dynamic Stratified Contrastive Learning with Upstream Augmentation for MILP Branching
authors:
- Tongkai Lu
- Shuai Ma
- Chongyang Tao
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/lu26v.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/lu26v.html
institutions:
- Beihang University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Feature-stratified contrastive training and equivalent/noisy upstream augmentation improve per-family GCNN
  branching, with actual strong-branch refinement upstream and explicit feature-proof/metric limits.
code_url: https://github.com/lutk3029/SC-MILP
---

# Dynamic Stratified Contrastive Learning with Upstream Augmentation for MILP Branching

> **TL;DR:** SC-MILP improves a separately trained GCNN branching policy through feature-based strata, equivalent/noisy upstream augmentation and distance-aware contrastive learning. Its deployed solver additionally runs strong branching on a neural top-five shortlist near the root. Reported runtime gains coexist with accuracy/tree-size exceptions and local gaps in exact augmentation-feature claims.

## Motivation

Shallow B&B states are rare, expensive to label by full strong branching and distributed differently from deeper states. A single undifferentiated imitation objective can underfit their semantics even though early choices influence the subsequent tree. AppendixA reports a1000-versus1000-node MMD permutation test with p=.003 and substantial expert-labeling cost; these are empirical motivation, not a universal distribution-shift theorem.

## Contributions

- Solver-feature clustering defines ordered strata of B&B states rather than using depth alone.
- Sign/shift equivalent MILPs, redundant-row additions and small objective/constraint/dual-feature perturbations augment scarce upstream examples.
- A contrastive objective treats same-stratum states as positives and applies increasing distance-dependent weights to different-stratum negatives.
- A hybrid deployment uses neural top-five screening followed by actual strong branching upstream and direct GCNN selection downstream.

## Methodology

**Grouping.** Seven solver-state features include depth, LP lower bound, fractional-variable count/max fractionality, local-bound shifts, conflicts and candidate ratio. Features are standardized, K-means runs once on training data, and assignments remain fixed throughout training. Unordered clusters are sorted by their minimum observed depth. Four strata are selected for set cover/auction/MIS and five for facility location; the learned contrastive weights are dynamic, not repeated dynamic reclustering (Section4.2/AppendixD.1).

**Upstream augmentation.** LT-MILP uses xhat=Tx+t, diagonal T entries ?1 and integer shifts on integer coordinates, with transformed coefficients and correctly reoriented bounds. Feasible/optimal solution sets correspond, and paired LP solutions have corresponding strong-branch subproblems with up/down branches exchanged for negative signs. RC-MILP adds the sum of two original constraint rows, preserving the feasible polyhedron. These mathematical equivalences do not force independently re-solved degenerate LPs or solver bases/tie-breaking to match (Section4.3/AppendixC).

Objective/constraint coefficients and dual features are also perturbed while retaining original labels. A50-sample calibration reduces noise until at least95% of measured strong-branch choices agree, then fixes variance.05 for remaining examples. This is empirical label-noise control, not exact label preservation for every perturbed problem. Equivalent derivations each have35% probability and the three perturbations each10%; added upstream data is approximately30% of the100000 original easy-level examples. Integer shifts are sampled from {?10,10}; continuous shifts are uniform[?10,10]; redundant rows use paired10% selected original constraints (Sections4.3/E.1).

**Training.** A bipartite GCNN produces variable scores and mean-pooled graph embeddings. Supervised strong-branch cross-entropy is combined with same-stratum supervised contrastive loss. Negative-pair cosine logits are weighted by sigmoid of cumulative softplus parameters indexed by stratum distance; this enforces monotone weights in(0,1), not a guarantee of prescribed embedding distances or optimal branching. Temperature.08 is selected and the contrastive balancing coefficient is learned; auxiliary contrastive computation is removed during inference (Section4.4).

**Deployment and scope.** Root candidate count and ratio rho=.8 define the first depth where candidates fall below rho times root count. Before that cutoff, neural scores shortlist k=5 variables for real strong branching; deeper nodes use the network directly. Thus the final results include expensive solver feedback and are not pure learned-policy selection. Models are trained/evaluated by problem class, and broader cross-MILP-type modeling is explicitly future work. This is specialist constructive solver control, not neural improvement of complete feasible incumbents. Exactness belongs to exhaustive classical B&B if it finishes (Sections4.5,6/AppendixA).

## Experiments

**Protocol.** Four generated families are set cover, combinatorial auction, capacitated facility location and MIS, with100 test instances at each easy/medium/hard level. The paper also reports an80/20 train/test split for real datasets: MIK, CORLAT, mixed-neos/supportcase subsets, load balancing and anonymous competition problems. SCIP7.0.1 uses3600-second limits, cuts only at root, no restarts and otherwise default settings. Timeouts are assigned3600seconds in average-time statistics. Hardware is XeonGold6148 at2.4GHz/TeslaV10032GB; average times and per-instance wins are distinct from solved counts (Section5.1/AppendixE).

**Solve times and tree sizes.** In Table1, SC-MILP has the lowest mean capped runtime across all12 generated family/difficulty cells: hard times953.24/99.81/331.30/964.79s, compared with GCNN1299.99/114.32/563.54/1187.50. It wins925 of1200instances, or77.08%; hard wins are82/87/92/87 of100. The paper reports12.36% average reduction over MILP-Evolve under its aggregation. Smaller trees are not universal: medium set cover uses1452nodes versus CAMBranch1279, easy facility111 versus TGAT96, and easy MIS44 versus CAMBranch41/RPB21. Full strong branching can have much smaller trees but much larger per-node expense (Table1).

**Prediction exceptions.** Top-one accuracy is68.9/66.4/71.3/65.3% versus GCNN61.8/64.1/70.4/64.0. TGAT still beats auction top-one accuracy71.4 versus66.4; GCNN facility top-five97.9 exceeds97.6. Consequently, the prose's best performance on every benchmark/metric is too broad. Overall cross-dataset accuracy improvements are node-weighted, not an arithmetic mean of the displayed dataset percentages; AppendixE.3 explicitly defines this aggregation (Table2/AppendixE.3).

**Ablations.** On set cover, removing upstream augmentation lowers overall/top20%-shallow accuracy68.9/51.3 to64.2/46.7 and raises hard time953.24 to1096.43s. Removing contrastive learning gives65.4/43.3 and1137.06s. Removing hybrid branching keeps neural accuracy fixed and hurts medium/hard times, but improves easy time5.99 to5.95s and nodes117 to107. Feature-based K-means, GMM and hierarchical clustering are close; hierarchical clustering is slightly faster/economical on easy cases5.98s/116nodes versus5.99/117. Training the same backbones with/without the framework improves the reported GAT/GIN/GCNN cells, but this is retraining portability, not one shared checkpoint (Tables3-4,10-12).

**Real datasets and cost.** Table5 reports only runtime, with SC-MILP233.96/77.53/357.41/293.53/728.14/371.76s versus GCNN256.42/87.49/417.70/348.65/756.29/421.43. It does not provide a full-MIPLIB heterogeneous model test or per-instance optimum-gap/solved-count evidence. Original100000-label collection takes31.94/16.72/108.63/70.45hours across the four generated tasks. Claimed augmentation generation is minutes, avoiding roughly68.3hours of additional expert collection. At batch128, training time increases.12726 to.13143s per batch and94.37085 to118.41296s per epoch, approximately3.2/25.5%. The source claims under10% extra early decision cost from hybrid strong branching; these costs were not independently rerun (Table5/13/AppendicesA.2,F).

## Limitations

### Discussed in the Paper

The work targets branching rather than other solver components. Generalization across MILP types and multiple solvers is future work. Real benchmarks use selected heterogeneous subsets rather than the entire MIPLIB collection. Perturbation labels can change, and extra upstream strong branching has a tradeoff with decision cost. K-means partitions too finely or poorly chosen temperature/ratio can degrade runtime.

### Curator Notes

The affine/constraint redundancy theorems concern corresponding mathematical problems and LP optimizers; they do not guarantee every solver-selected optimal basis, complete strong-branch trajectory, raw feature vector or trained policy is unchanged. Perturbed labels remain heuristic even after95% agreement on50 samples. No theorem guarantees learned-policy quality or universal runtime gains.

AppendixD.2.2's displayed dual derivation is invalid as written: it requires s>=0 and shat=Ts, yet p19 asserts shat>=0 despite sign flips. T=?1,s=1 directly gives shat=?1. Correctly transformed bound cones must be represented explicitly; this local proof issue does not refute feasible-set equivalence or existence of corresponding row multipliers in a properly formulated dual.

AppendixD.2.3 sets a redundant summed row's is_tight feature to zero because it allegedly cannot become tight. Two simultaneously active independent rows have an active sum: min ?x?y with x<=0,y<=0 and bounds[?1,0] has optimum(0,0), where redundant x+y<=0 is tight. Therefore feature augmentation is not an exact solver-feature identity in all cases. Table8 correctly swaps has_lb/has_ub under a negative sign, while p20 prose says they remain unchanged; one-sided bounds expose that inconsistency. These points limit exact-feature claims without implying the reported empirical training benefits are invalid.

The definition of the candidate cutoff and the prose interpretation of increasing rho also require care: for the same nonincreasing candidate-count sequence, a larger fraction is crossed earlier. No unavailable implementation was inferred to resolve this wording. Accuracy comparisons contain the explicit exceptions above, and no statistical uncertainty across independent full training runs or complete solver-result artifacts are supplied here.

## Reproducibility

- **Publication:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/lu26v.html), pages81323-81345, official HTML date September29,2026. Three authors and Beihang University affiliation checked on page1.
- **Coverage:** all23 formal pages, bibliography, AppendicesA-F, complete proofs, feature tables and efficiency analyses read; Figure1/major result and mathematical pages rendered and checked. Publisher lists only PDF/OpenReview; ordinary LDNH3sQtMW API returned403. Official ICML2026 event64655 has only the OpenReview link and no scientific poster/slide/PDF media link. No additional scientific attachment was found through available entries.
- **Code:** the paper's [lutk3029/SC-MILP](https://github.com/lutk3029/SC-MILP) link was checked through ordinary HTML, GitHub API and main-branch archive requests; all returned404. No source code, checkpoint or separate code-hosted scientific appendix was obtained, and no training/solver experiment was rerun. This is an access/reproduction limitation, not an unread discovered scientific supplement.
- **Relations:** explicit body/bibliography identities matched to catalogue entries; background citations in AppendixB were included, while unlisted generic solver/theory references were not converted into catalogue edges.
