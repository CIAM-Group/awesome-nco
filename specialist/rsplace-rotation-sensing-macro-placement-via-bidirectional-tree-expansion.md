---
id: rsplace-rotation-sensing-macro-placement-via-bidirectional-tree-expansion
short_title: RSPlace
title: 'RSPlace: Rotation Sensing Macro Placement via Bidirectional Tree Expansion'
authors:
- Tianyi Liu
- Yaxin Xu
- Lin Geng
- Ningzhong Liu
- Han Sun
- Yu Wang
year: 2026
date: '2026-03-14'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/39559
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/39559
institutions:
- Nanjing University of Aeronautics and Astronautics
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Macro Placement
- Mixed-Size Chip Placement
summary: A per-netlist PPO placer combines greedy four-angle rotation sensing with frontier-guided tree search and
  classical rotate-and-repair perturbations; reported HPWL improves across ISPD2005 macros, with DREAMPlace-dependent
  mixed-size results and timing/congestion tradeoffs.
figure:
  path: paper-assets/rsplace-rotation-sensing-macro-placement-via-bidirectional-tree-expansion/framework.png
  alt: RSPlace global MCTS frontiers, top-down PPO construction with rotation sensing, and bottom-up rotate-and-repair
    expansion.
  caption: Original Figure 2 overview, from the author repository, resized for display. The bottom-up perturbation
    and repair are classical search operations.
  source_url: https://github.com/liutianyi123/RSPlace/blob/fff416abbc34981dbf76fe24023ceeda519e7b5c/imgs/RSPlace/RSPlace.png
---

# RSPlace: Rotation Sensing Macro Placement via Bidirectional Tree Expansion

> **TL;DR:** RSPlace adds four-angle macro rotation to a PPO-and-tree-search placer. A greedy mask-based rule selects orientation, PPO selects locations, and classical rotation/repair creates additional placements. It reports lower macro HPWL on eight ISPD2005 circuits, while mixed-size placement depends on DREAMPlace and some congestion/timing metrics favor the baseline.

## Motivation

Fixing macro orientations restricts possible non-overlapping placements and pin locations. RSPlace explores rotations in addition to grid coordinates, aiming to improve wirelength without abandoning the frontier-guided search of EfficientPlace. Its main objective is half-perimeter wirelength (HPWL), a placement proxy; reducing that proxy does not guarantee better timing or every downstream physical-design metric. [pp. 1–4]

## Contributions

- Extends each macro placement to a location/orientation triple and evaluates masks for 0°, 90°, 180° and 270°.
- Combines top-down PPO rollouts with bottom-up orientation perturbations and deterministic placement repair in a shared search tree.
- Provides illustrative mask analysis, five-seed macro comparisons, component ablations, mixed-size results, runtime curves and an OpenROAD PPA comparison. The feasible-position examples are demonstrations rather than a general approximation or global-optimality theorem. [pp. 2–7, 10–13]

## Methodology

Each tree node represents a partial placement; an empty canvas is the root and complete placements are leaves. A frontier set retains promising intermediate states. Rollouts choose a frontier and preserve placements and orientations along its root path, then complete the remaining macros. The frontier score combines the best negative HPWL below a node with a visit-count exploration term. [p. 4, Eqs. 3–4; Algorithm 1]

For the next macro, rotation sensing rotates relative pin coordinates and swaps macro width/height at quarter turns. For each orientation it builds a position mask and a wire-cost mask. Equation 6 chooses the orientation whose combined masks have the smallest entry, measuring immediate placement opportunity. The actor then receives the selected mask combination and canvas, encodes/decodes them to a grid distribution, masks infeasible actions and selects a position. The value branch uses mask features and a time embedding. PPO updates the constructive placement policy. Orientation sensing is an explicit heuristic rather than a separately learned rotation-action policy. [pp. 4–5, 10–11; Algorithm 2, Fig. 7]

After several rollouts, the bottom-up phase selects the best leaf, randomly samples macros and changes their orientations. It then processes macros sequentially, recomputing masks and moving them to feasible grid locations selected using wire-cost and proximity criteria. The repaired leaf and its path are added to the tree and its value is propagated. This classical perturb-and-repair phase helps escape a greedy orientation choice without turning the neural actor into an incumbent-editing policy. [pp. 4–5]

**Classification: Specialist / constructive.** The learned component builds macro placements for the netlist being optimized. The paper does not demonstrate one unchanged neural checkpoint shared across different native optimization problems. Mixed-size chip placement additionally uses a classical analytical placer; it is not evidence of a shared neural macro/standard-cell solver. [pp. 4, 7, 10–12]

## Experiments

ISPD2005 provides eight circuits. Six use their full listed macro sets, while bigblue2 places 256 of 23,084 macros and bigblue4 places 1,024 of 8,170 to follow EfficientPlace. These subsets matter when interpreting scale claims. Tables 1–2 report mean and standard deviation over five random seeds. EfficientPlace and WireMask-EA were rerun from released code; other baseline results were taken from earlier papers. RSPlace, EfficientPlace and WireMask-EA use 1,000 reported steps/evaluations in the direct comparison, whereas other listed budgets differ. [pp. 5–6, 11]

The configuration lists top-down/bottom-up expansion frequencies 4/1, frontier update frequency 2 beginning at 200, PPO clipping 0.2, gradient clipping 0.5 and an RTX 2080 Ti. The neural architecture is illustrated, but full optimizer/learning-rate details and implementation are not provided in the inspected materials. Equal reported steps are not automatically equal wall-clock work; Appendix A.8 separately plots convergence against minutes and acknowledges orientation overhead. [pp. 10–13]

Macro HPWL is lowest for RSPlace in all eight reported circuit comparisons. On adaptec1 it is 4.72 ± 0.07 versus EfficientPlace's 5.90 ± 0.07, in units of 1e5, a 20% reduction. On bigblue4 it is 82.29 ± 1.29 versus WireMask-EA's 86.88 ± 0.99. The visual adaptec2 example's 38.00 value is a particular placement, distinct from Table 1's five-seed mean of 39.79 ± 1.16. [pp. 2, 6]

The adaptec1 ablation compares random orientation, no rotation, no top-down expansion, no bottom-up expansion and the full method. Random orientation performs poorly, and the full combination has the best illustrated convergence. The t-SNE experiment uses 2,500 high-quality trajectories per method to visualize exploration differences; it does not certify that a projected region contains globally optimal placements. [p. 7]

For mixed-size placement, RSPlace first produces macros, DREAMPlace performs coarse placement with them fixed, and DREAMPlace then allows all macros/cells to move during legalization and detailed placement. Table 7 is best on seven of eight circuits; adaptec4 is an exception, with RSPlace 18.61 ± 0.06 versus EfficientPlace 14.70 ± 0.25, in units of 1e7. These results belong to the full three-phase pipeline. [pp. 7, 12]

## Limitations

Rotation sensing minimizes an immediate mask-derived increment, not final placement HPWL; the paper itself motivates bottom-up search because the local choice can be suboptimal. Its four discrete orientations and canvas discretization constrain the feasible space. The non-overlap claim depends on mask construction and successful feasible-grid selection. The qualitative examples showing 12 versus 19 feasible locations do not imply that every rotation increases feasibility or improves every netlist. [pp. 4–5, 10]

Congestion and physical-design improvements are not uniform. In Table 6, where RSPlace congestion is normalized to 1, EfficientPlace obtains 0.69 on adaptec1 and 0.95 on adaptec3. Table 8 compares four OpenROAD circuits: RSPlace reduces reported wirelength and power, but wrapper43 WNS worsens from −11.671 to −16.382, and ariane136 TNS worsens from −610.876 to −630.667. Some violation-count and area values also worsen. HPWL-guided exploration therefore does not establish universal PPA dominance. [pp. 11, 13]

Macro-only placement, downstream mixed-size placement, per-placement visual examples, multi-seed means and PPA evaluations have distinct protocols. Baseline values imported from prior papers and missing implementation details further limit an independent attribution of every improvement to rotation alone. [pp. 6–7, 10–13]

## Reproducibility

The formal article is AAAI 2026, volume 40(28), pp. 23837–23845, DOI 10.1609/aaai.v40i28.39559, with publisher-deposited date 2026-03-14. Its byline contains six authors from Nanjing University of Aeronautics and Astronautics. Live publisher page/PDF requests returned an access challenge. The formal article explicitly points to the author repository for its extended version, so that complete thirteen-page author PDF, including Appendices A.1–A.9, supplies the scientific reading copy; formal byte identity is not claimed.

The [author materials repository](https://github.com/liutianyi123/RSPlace) was inspected at commit fff416abbc34981dbf76fe24023ceeda519e7b5c, dated 2026-08-05. Its complete archive has 33 members and 21 files: the extended PDF, two one-page posters, seventeen PNGs and README. All three PDFs were read in full and visually checked, and all seventeen images were inspected. The repository contains no solver implementation or checkpoint at that commit, so it is not presented as released source code. No placement-training or benchmark reproduction was run.

The publisher's conference-material link also exposes an Underline Slides download, which redirects to login and was not read or counted as source coverage. The full scientific PDF does not identify a missing separate technical supplement. Key algorithms, masks, neural architecture, all result tables and runtime curves were rendered and checked. The original overview image, complete attachment inventory/hashes, access evidence and page-by-page reading logs are retained with the review.
