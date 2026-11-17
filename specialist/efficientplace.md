---
id: efficientplace
short_title: EfficientPlace
title: Reinforcement Learning within Tree Search for Fast Macro Placement
authors:
- Zijie Geng
- Jie Wang
- Ziyan Liu
- Siyuan Xu
- Zhentao Tang
- Mingxuan Yuan
- Jianye Hao
- Yongdong Zhang
- Feng Wu
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/geng24b.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/geng24b.html
institutions:
- University of Science and Technology of China
- Huawei Noah's Ark Lab
- Tianjin University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Macro Placement
summary: A rolling partial-layout frontier directs PPO/U-Net macro completion with minimum-wire-increment masks;
  budgeted best-of-search gains depend on task/configuration and classical downstream placement.
code_url: https://github.com/MIRALab-USTC/AI4EDA-EfficientPlace.git
---

# Reinforcement Learning within Tree Search for Fast Macro Placement

> **TL;DR:** EfficientPlace maintains promising **partial-layout prefixes** in a rolling search frontier and uses a PPO/U-Netpolicy to complete them. Wire-increment masking restricts choices to greedy-minimum positions. The reported best-of-search HPWLimproves at useful budgets, while theory, baseline protocols and current release configuration require precise qualifications.

## Motivation

Repeated RLrollouts from an empty canvas can revisit unproductive prefixes. Pure black-box optimization does not learn from placement experience. EfficientPlace combines a global prefix tree with an online learned completion policy, seeking a good layout per chip rather than a broadly pretrained cross-chip policy (Sections1–4).

## Contributions

- Rolling frontiers retain several promising partial placements and allocate local rollouts among them.
- A spatial U-Netwith skip connections/bilinear upsampling learns where to place the next macro.
- Wiremask-based candidate restrictions, tree/architecture/grid ablations and downstream placement/congestion studies evaluate sample efficiency (Section4/AppendicesA–B).

## Methodology

**Task and state.** Ordered macros are placed on anN×Ngrid, minimizing pin-level half-perimeter wirelength(HPWL). A state is a prefix of assigned coordinates. Position masks exclude overlap/boundary violations, while a wiremask records incremental HPWLfor the next macro. The formal method orders macros by descending area and restricts the policy to legal grid positions with the **minimum immediate wire increment**. Such restriction makes the neural decision a choice among local ties; it does not establish the globally best full placement (Sections3/4.3).

**Search and learning.** Tree nodes record prefixes, visit counts and the best descendant negativeHPWL. Rollouts uniformly select a frontier and complete it using the current policy; sampled full outcomes update the tree and PPO. A UCT-inspired scoreQ+α/√visitsgoverns rolling frontier promotion. Promoted branches are excluded from parent evaluations to diversify search. The final output is the best complete layout retained in the tree/pool. PPOupdates and frontier maintenance are distinct from backpropagating rollout **statistics** through the tree (Section4.2/Algorithms1–2).

**Network and classification.** Occupancy/legal-position/wire images feed a U-Netactor; timestep/context features and a critic support PPO. Grid resolutions vary by circuit up to512. Specialist / constructive: the neural policy completes unassigned coordinates from a partial prefix; it does not edit an existing complete feasible placement. Searching for improving best-so-far solutions, or later running a classical placer, does not by itself make this neural improvement (Sections4.2–4.3).

**Theoretical scope.** Theorem1assumes a full-size frontier set, every frontier visited and an improved policy satisfying pointwisev_new≥v_oldon those frontiers. Its inequalities concern expected/best-observed frontier values, not exact optimal placements, a finite-time approximation ratio or a guarantee that PPOsatisfies the assumptions. The proof uses retained descendant maxima and replacement by no-worseQvalues. These conditions must be distinguished from the actual score-based promotion and parent/ancestor recomputation inAlgorithm2; the nested-descendant monotonicity argument does not directly justify every such recomputation (p6/AppendixA.2).

## Experiments

**Protocols.** EightISPD2005circuits are used, with five independent random seeds. Table3lists full macro populations except256selected onbigblue2and1024onbigblue4. This task definition is important: some older learned baselines used additional fixed terminals/selected subsets. Table1imports most learned baseline results from earlier papers, reruns SA, and adds a WireMask-EAbigblue2run at128grid. It is not uniformly a matched-task rerun. Performance is the **best HPWLreached within the rollout budget**, not single-forward quality. A step is a rollout/search evaluation, not one macro action or gradient update (Section5/Table1/AppendixA.3).

**Quality and time.** At1000rollouts EfficientPlace has the lowest displayed mean HPWLon all eightcircuits, e.g.adaptec246.79versusWireMask-EA64.38andChiPFormer67.10, in10⁵units. Mean reported runtime is about2.2hours/circuit versus6.9forWireMask-EA. However, onbigblue2the1000-rollout EfficientPlace time.53hours is **slower** thanEA.37hours;500rollouts takes.28hours but returns4.79versusits1000-rollout4.67. The500-rollout result also loses toEAonbigblue3/4. Reported hardware uses3090GPUs/XeonE5-2667v4; offline ChiPFormerpretraining is a separate cost, and neither method's imported result is automatically a complete equal-resource comparison (Table1/Figures4/9).

**Downstream evaluation.** Classical DREAMPlacefirst places standard cells from learned macro positions, then performs comprehensive mixed placement/legalization/detailing. Table5reports the lowest means on seven of eightcircuits and a tie onadaptec2(9.20versusEA9.20). These are combined pipeline results, with several identicaladaptec3/4baseline columns printed in the table; no independent correction is inferred. Table6normalizes each circuit's own RUDYcongestion to1and lists higher values for available comparators, e.g.EA1.01onbigblue2. This is a relative proxy rather than zero physical congestion or a detailed-routing guarantee (AppendicesB.2–B.3).

**Ablations.** Removing tree search causes more variable learning; removing U-Netskip connections or replacing bilinear upsampling worsens the displayedadaptec1curves. Larger grids improve those tested curves, but no claim of uniformly better runtime/feasibility at any resolution follows. The ablations largely concern one circuit (Figures5–6).

## Limitations

### Discussed in the Paper

The optimization focuses on HPWLrather than final power/performance/area. Dataflow and regularity are proposed as additional metrics. Every target chip requires its own online search/learning, and full standard-cell implementation remains downstream classical work (Sections5–6).

### Curator Notes

- A locally legal mask does not prove every prefix can be completed, and the minimum-increment restriction can exclude globally useful temporary increases. Best-so-far retention can protect the returned objective without proving that the current policy or frontier mean always improves.
- The printed theorem's pointwise improved-policy assumption is not a property proved for finite PPO. Its proof uses an expanding set of all historical descendants, whileAlgorithm2explicitly removes a promoted child's contribution from its parent and recomputes ancestors. That distinction limits using the printed argument as an unconditional guarantee for the implemented frontier statistics.
- The current release generally learns only128macro actions, then greedily places the rest;`bigblue1`also has inconsistent200trainer/128environmentlimits. Itsbigblue2/4database retains256/1024macros, so the128limit is the **learned prefix**, not the complete benchmark set. Formal task size and neural action horizon must be separately configured.
- Released defaults also differ in grid/ranking/frontier-update frequency from the paper: e.g.adaptec1grid256versusformal128; some circuits use net-area ranking instead of descending area. Position exclusions use a finite−1e10logit, and an empty legal action set lacks a feasibility proof. The READMEreferences an environment script absent from the22-entry snapshot. These are reproduction/configuration observations; no paper-result rerun or blanket invalidation is claimed.

## Reproducibility

The [formal ICML2024 record](https://proceedings.mlr.press/v235/geng24b.html) givesPMLR235,pp15402–15417,issued2024-07-08. All16pages were read, including every reference, theorem/proof, algorithm, appendix table and placement figure. Frontier/theorem and downstream tables were rendered. Publisher/event34772expose no separate scientific supplement/poster/slides; OpenReviewAJGwSx0RUVAPIreturned403.

The [author code](https://github.com/MIRALab-USTC/AI4EDA-EfficientPlace) has a complete22-entry untruncated tree atSHAdb1acc25b2ab8827c665aa542f3187976a9d6b35, without extraPDF/TeX/notebook. README, trainer/tree updates, actor/critic/masking, environment reward/termination, macro selection/ranking and all circuit configurations were inspected. Benchmarks and external standard-cell tools must be supplied. No training or layout benchmark was rerun.

**Internal citations.** Actual text plus bibliography verify [DeepPlace/DeepPR](deepplace-deeppr.md)(pp2–3/6–7and9), [PRNet](prnet-chip-design.md)(2–3and9), [MaskPlace](maskplace.md)(1–3/6–8and10), [ChiPFormer](chipformer.md)(1–3/6–7and10), and [HEMcut selection](hem-cut-selection.md)(3and11, the explicit2023ICLRentry). These background solver citations do not demonstrate EfficientPlacecross-task capability.
