---
id: maskplace
short_title: MaskPlace
title: 'MaskPlace: Fast Chip Placement via Reinforced Visual Representation Learning'
authors:
- Yao Lai
- Yao Mu
- Ping Luo
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/97c8a8eb0e5231d107d0da51b79e09cb-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/97c8a8eb0e5231d107d0da51b79e09cb-Abstract-Conference.html
institutions:
- The University of Hong Kong
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Macro Placement
- Chip Placement
summary: Visual PPO constructs pin-aware grid macro placements with conditional nonoverlap masks and congestion
  fallback; standard cells use classical DREAMPlace.
code_url: https://github.com/laiyao1/maskplace
---

# MaskPlace: Fast Chip Placement via Reinforced Visual Representation Learning

> **TL;DR:** A CNN/PPO policy sequentially places macros on a224×224grid using occupancy, legal-position and pin-aware incremental-wirelength images. Conservative size rounding/masking supports nonoverlap when legal choices remain; congestion checking has an explicit fallback rather than an unconditional threshold guarantee. Standard cells are placed classically, and some quality/runtime comparisons favor baselines.

## Motivation

Coarse placement representations can lose pin offsets and real macro sizes. MaskPlace encodes the placement state as spatial masks and uses dense incremental HPWLrewards to retain detailed geometric information while learning sequential macro decisions. The main neural task is **macro placement**, despite discussion of chips containing millions of standard cells (Sections1–3/AppendixA.1).

## Contributions

- Pin-aware wire masks, legal-position masks and an occupancy view provide visual placement observations, including the current and next macro.
- A global ResNet18encoder/deconvolutional decoder and local1×1convolutions combine contextual and fine spatial signals.
- Benchmark quality, overlap, congestion, runtime, transfer and component studies evaluate the learned macro constructor, sometimes followed by classical standard-cell placement (Sections3–4/AppendixA).

## Methodology

**Task and metrics.** The objective is pin-level half-perimeter wirelength(HPWL), with zero macro overlap and desired congestion threshold. HPWLsums each net's bounding-box width+height. RUDYestimates congestion from reciprocal net-box width/height accumulated over cells. Reported “routing wirelength” uses a minimum-spanning-tree estimator, not a completed detailed routing solution; density is a binned coverage proxy and is not equivalent to pairwise overlap. Power/timing/manufacturability are motivations rather than directly measured final signoff outcomes (Section2/AppendixA.2).

**Masks and network.** Real macro widths/heights are rounded **up** to grid-cell coverage in the hard version. The position mask excludes boundary-crossing and intersecting placements; the wire mask measures the extra partialHPWLfor candidate positions using net bounding boxes shifted by pin offsets. The view mask marks occupied grid cells. Masks for the current and next macro feed the global/local branches, and a positional embedding plus global encoding feeds the value network. Macros follow a handcrafted order based on net count, area and connections to already placed modules; the policy learns locations rather than this order (Section3/AppendicesA.3–A.4/A.8).

**Learning/inference.** PPO2uses rewardHPWL_previous−HPWL_current. The dense reward sums to final negative HPWLonly without discounting; actualγ.95emphasizes earlier increments. Value updates stop gradients into the shared global encoder. AppendixA.5specifiesAdam.0025,batch64,150epochs,update epochs10,clip.2andgradient norm.5on oneRTX3090/Ryzen5950X. A curriculum variant pretrains on one third of macros for30epochs. During training congestion checking is disabled. At inference, if the sampled action violates the threshold, additional actions are sampled, ranked by wire cost/congestion and checked. If none satisfies the threshold, the least-congested sampled action is chosen. This is an explicit **soft failure fallback** (Section3/Algorithm4).

**Classification.** Specialist / constructive: the network creates macro locations in sequence. Training on one netlist and transfer to other chips remain one native task; no cross-task shared-checkpoint evidence is presented. Standard-cell analytical placement and classical congestion resampling do not constitute neural editing of a complete incumbent.

## Experiments

**Scope.** The primary suite contains24circuits fromISPD2005,17IBMdesigns(excluding macro-freeibm05)andAriane; supplementarybigblue4is an additional case. Main macro-plus-standard-cell experiments fix the learned macros and run **DREAMPlace** for standard cells. Table14lists up to1329macros(adaptec4), rather than the main prose's1293largest-count claim, and chips with over one million standard cells. Learning-method comparisons generally use five seeds; classicalNTUPlace3is deterministic. Training and inference clocks must be kept separate (Section4/AppendicesA.5–A.7).

**Quality and counterexamples.** Table2gives the lowest macroHPWLmean on six of seven displayed main circuits. Onadaptec4,MaskPlace79.21×10⁵is worse thanDREAMPlace37.41andRePlAce37.64; it still beats the listedRLbaselines. OnAriane, **hard**MaskPlace normalizedHPWL.1025/congestion1.0137is worse than theGraphPlacementGitHubvariant.1013/.9174, though overlap improves4.29%→0. The soft-rounded variant improvesHPWL/congestion(.0879/.9049)but has3.33%overlap. Thus “all key metrics superior” requires qualification (Tables2–4).

**Wirelength and full placement.** The reported60–90%routing-wirelength reduction is relative toDeepPR's estimator-based results, not a uniform reduction against strong classical placers or physical routed silicon. With standard cells,MaskPlace+DREAMPlaceimproves all six Table6means, e.g.bigblue3HPWL37.29×10⁷versusDREAMPlace70.02andDeepPR+DREAMPlace45.06. SupplementTable15similarly favors the hybrid on the17IBMcircuits; those are combined pipelines rather than millions of neural standard-cell actions (Tables5–7/AppendixA.7).

**Time and transfer.** Inference on the same3090machine takes4.26–13.87seconds over six circuits and beats the two listedRLmethods, butDREAMPlaceGPUis faster onadaptec4(7.39versus13.36)andbigblue3(12.25versus13.87). Search/training curves show useful quality within a few hours, not zero training cost. Theadaptec1checkpoint transfers without retraining but loses6–76%HPWLagainst independently trained target-chip models;bigblue3ratio1.76is a substantial transfer penalty. Curriculum, next-macro features, wire masks and local1×1fusion help in the displayedablation. Tighter congestion thresholds trade worseHPWLfor lower estimated congestion and become unattainable below the tested feasible range (Section4/Tables8–9/Figures6–7/supplementFigure10).

## Limitations

### Discussed in the Paper

The method covers one stage of chip design. Millions of standard cells still require classical optimization. Congestion thresholds can be unattainable, soft grid rounding permits overlap, and chip-specific training remains stronger than transfer (Sections4–5).

### Curator Notes

- A nonoverlap mask excludes illegal **current** actions conditional on nonempty legal space; it does not prove that every prefix permits completion or that every circuit fits the grid. Congestion fallback explicitly permits threshold violation. No global optimality, complete-placement or signoff guarantee is proved.
- SupplementAlgorithm1accumulates a positiveHPWLincrease although the main reward is its negative;Algorithm3prints `bbox+offset`, while the geometric explanation and released code shift by **minus**the pin offset. These are printed-pseudocode/implementation discrepancies, not evidence that all experiments used the wrong sign.
- The statedO(V)position-mask/O(NP)wire-mask costs count rectangle/row operations at a fixed grid. Algorithm2actually allocates/multiplies denseN×Nmasks within theVloop, and row updates touchNcells. These statements should not be read as full scalar complexity bounds independent of resolution.
- The current public script defaults to placing128macros and runs up to100000episodes, differing from the full-macro150epochformal setup. It adds a wire-cost restriction to policy logits, and all-excluded logits set to the same finite−10¹⁰would produce a uniform softmax rather than a legal action. Replication needs explicit full-task/configuration/empty-mask handling.
- Current`get_net_img`subtracts offsets as intended but its last y-region adds`j−start_y`rather than`j−end_y`; port minimum-x initialization also merits checking. The README's displayedArianeexample has1.94%overlap. These release examples/configurations are not silently equated with the formal hard-mask zero-overlap table; no experiment rerun or blanket invalidation is claimed.

## Reproducibility

The [formal NeurIPS2022 record](https://proceedings.neurips.cc/paper_files/paper/2022/hash/97c8a8eb0e5231d107d0da51b79e09cb-Abstract-Conference.html) givesvolume35,pp24019–24030,DOI10.52202/068431-1744,issued2022-12-06. All12main and9publisher-linked supplementary pages were read, including every algorithm/table/example and related-work/checklist section. Key mask equations/algorithms and negative-result tables were rendered. The officialevent54344poster was visually read; OpenReviewT2DBbSh6_uYAPIreturned403and the event exposes no separate scientific slide file.

The [project page](https://laiyao1.github.io/maskplace/) links the [author code](https://github.com/laiyao1/maskplace). Its complete69-entry untruncated tree contains oneREADMEand Python/data/images, without an extra scientificPDF/TeX/notebook. The fullREADME, public demonstration results and relevant PPO/network/mask/reward/congestion/environment code were inspected. Dependencies, dataset acquisition and standard-cell pipeline are documented, but exact formal-result replication has not been run.

**Internal citation.** Actual in-text[22]and the matching mainp11bibliography verify [DeepPlace/DeepPR](deepplace-deeppr.md), *On Joint Learning for Solving Placement and Routing in Chip Design*. Other cited classical, Nature and workshop placement methods are not forced onto unrelated catalogue entries.
