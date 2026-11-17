---
id: ruleplanner
short_title: RulePlanner
title: 'RulePlanner: All-in-One Reinforcement Learner for Unifying Design Rules in 3D Floorplanning'
authors:
- Ruizhe Zhong
- Xingbo Du
- Junchi Yan
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/zhong26f.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/zhong26f.html
institutions:
- Shanghai Jiao Tong University
- Mohamed bin Zayed University of Artificial Intelligence
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- 3D Floorplanning
- Constrained Floorplanning
summary: A specialist hybrid-PPO policy sequentially constructs 3D floorplans from rule matrices and masks; task-specific
  circuit transfer uses best-of-many source checkpoints and optional fine-tuning.
figure:
  path: paper-assets/ruleplanner/framework.png
  alt: Original RulePlanner pipeline combining rule matrices, graph features, masked position selection and next-block
    aspect-ratio sampling.
  caption: 'Figure2: original RulePlanner hybrid-action floorplanning pipeline.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/zhong26f/zhong26f.pdf#page=4
---

# RulePlanner: All-in-One Reinforcement Learner for Unifying Design Rules in 3D Floorplanning

> **TL;DR:** RulePlanner constructs 3D floorplans using rule-specific spatial matrices, position masks and dense rewards. Hybrid PPO selects a current block's position and the next block's aspect ratio. The experiments show improved rule adherence and circuit transfer, with separate task training and best-of-many-checkpoint inference; they do not establish one unchanged cross-problem solver.

## Motivation

Optimizing wirelength or non-overlap alone can leave boundary, grouping and cross-die alignment requirements unsatisfied. RulePlanner makes these requirements visible to the policy through spatial representations and combines masked actions with explicit geometric rewards. Seven rule groups are enumerated: boundary, grouping, inter-die alignment, pre-placement, non-overlap, outline and shape. [pp. 1–6]

## Contributions

- Represents terminal proximity and block adjacency as spatial matrices, alongside existing layout, wire, alignment and position masks.
- Combines rule-specific binary masks to restrict position selection, and clips soft-block aspect ratios to a prescribed interval.
- Evaluates three combinations of floorplanning rules, ablations, within-task transfer to unseen circuits and thresholded constraint-adherence counts. [pp. 3–8, 12–28]

## Methodology

Die assignments z are given. The solver determines each block's planar coordinates and soft-block shape while respecting fixed block area; it does not learn which die receives a block. The terminal matrix stores minimum Manhattan distance from a terminal to a candidate block boundary. Multiple terminal conditions combine by max for simultaneous alignment or min for any-one alignment. The adjacency matrix sums contact lengths with previously placed group members. Thresholded terminal, adjacency, alignment and position masks multiply into an availability mask. The printed thresholds and constraint guarantees require the qualifications below. [pp. 2–5, 12–16, 21]

Six stacked spatial representations enter a CNN with pooling; a two-layer graph Transformer processes netlist topology and placement-order encodings. Local/global features and an upsampling decoder produce position logits. A local 1×1 convolution branch supplies fine spatial information. A Gaussian aspect-ratio head chooses the **next** block's shape, because that shape is needed to build its masks before its position is selected. The critic shares the main encoder. [pp. 5–6, 17–19]

Hybrid PPO uses separate weighted clipped objectives for position and aspect ratio, GAE and a value loss. Rewards combine normalized wirelength, overlap, terminal distance, adjacency and alignment. Algorithm1 adds the final episodic score to intermediate metric-difference rewards. This is an engineered reward scheme; no policy-invariance theorem for this reshaping is established. New rules require a new matrix/mask/metric definition. Thermal optimization is only an extension recipe here. [pp. 6, 13–18, 20–21]

**Classification:** Specialist / constructive. Appendix M trains n100 models for their corresponding rule tasks and transfers them to other circuits within the same task. Appendix N fine-tunes those weights on a new circuit. No explicit experiment establishes one shared checkpoint serving Tasks1–3 or unrelated native optimization problems. Handling multiple rules jointly and changing circuit size are valuable capabilities, but do not supply that missing cross-problem evidence. The policy sequentially places blocks rather than editing a complete incumbent. [pp. 7, 14–15, 26–27]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Benchmarks | Eight MCNC/GSRC circuits, 10–300 blocks; existing layers are preassigned |
| Rule tasks | Common alignment/non-overlap/outline/shape rules; Task1 adds boundary, Task2 grouping, Task3 boundary+grouping+pre-placement |
| Grid and shape | Two dies, 128×128 grid, 80% utilization; soft-block aspect ratio [1/2,2] |
| Training | 500/1,000 epochs, eight parallel environments, one complete episode per environment in the buffer; ten update epochs; minibatch128 |
| Optimizer | Adam10⁻⁴; PPO clipping0.2; GAEλ0.95; discount0.99; position/shape loss weights1/0.5 |
| Hardware | RTX4090 24 GB; AMD EPYC7402;512 GB RAM; five seeds per experiment |
| Transfer inference | n100 source circuit, same rule task; topK source checkpoints ×M stochastic attempts, best non-overlapping candidate by a selection score |

- **Rule metrics:** Task1 mean terminal distance is0, Task2 normalized adjacency is0.223 versus the best baseline mean0.082, and Task3 mean adjacency/alignment are0.162/0.938. The method reports zero overlap across the shown circuits/tasks. [pp. 8, 23–25]
- **Tradeoffs:** Task3 mean HPWL is275,334 versus FlexPlanner285,446, but n100 is197,302 versus Analytical161,774 and WireMask-BBO178,027. Grouping is not uniformly strongest: on Task3/n10, adjacency0.137 is below GraphPlace/WireMask-BBO0.219. Strong average constraint metrics do not imply dominance on every circuit/objective. [pp. 24–25]
- **Constraint counts:** Tables24–26 report complete adherence for the method on the counted Task1 boundary, Task2 grouping and Task3 alignment cases under Appendix O's thresholds. Those thresholds differ from requiring every normalized alignment score to equal one, and the counting inconsistencies below limit a blanket guarantee. [pp. 27–28]
- **Circuit transfer:** Task1/ami49 zero-shot HPWL is1,017,943, 1.278× the circuit-trained result. Task3/ami33 contact length is0.159 versus0.210 from circuit training. Other metrics remain competitive, and fine-tuning curves show faster learning from n100 weights. “Zero-shot” here allows a bank of trained checkpoints and multiple attempts; K and M are not numerically specified. [pp. 7–8, 26–27]
- **Ablations and time:** Both feature and mask components improve the reported ablation means. Runtime plots show similar or lower latency than the listed neural baselines and slower inference than network-free WireMask-BBO. The paper does not establish matched end-to-end latency for an unspecified K×M transfer budget. [pp. 8, 20, 22]

## Limitations

### Reported by the Authors

- Thermal optimization is not implemented; power/temperature maps and thermal rewards are proposed future extensions. [pp. 8, 17–18]

### Curator Notes

- Eq.6 accepts B≥b̄, while Table8 sets b̄=0 and Eq.3/Algorithm3 make B nonnegative everywhere. As printed, this grouping mask accepts all positions. Positive contact can still be learned through features/rewards, but this threshold does not establish hard grouping enforcement. The illustrated thin adjacency mask implies a stricter condition than the printed combination.
- Appendix O says nonnegative terminal distance must be **less than zero** to count as valid, yet Table24 accepts zero-distance cases. It also changes n10 counts relative to Table9: two boundary blocks versus five and four grouped blocks versus ten; Table25's B*-3D-SA n10 denominator is2 while the other methods use4. These are manuscript/protocol ambiguities, not corrected measurements.
- A finite −10⁸ position-logit penalty requires an actual feasible candidate. No complete empty-mask recovery procedure is specified. Likewise, early placements and aspect choices need not preserve global extendability merely because each currently selected action passes a local mask.
- HPWL is a proxy for routed wirelength; the reported experiment does not establish downstream PPA, timing, thermal or industrial signoff. Some baseline implementations are extended to 3D and extra reward terms, so the comparison is with the stated adaptations.
- New rule representations require expert definitions and may change input channels/training. The extensibility discussion does not establish zero-shot handling of arbitrary new rule semantics.

## Reproducibility

- **Published paper:** [ICML2026 / PMLR306](https://proceedings.mlr.press/v306/zhong26f.html), issued2026-09-29. All28 formal pages, complete references, Appendices A–O,26 tables,12 figures and four full pseudocode algorithms were read.
- **Scientific companion:** The official [slides PDF](https://icml.cc/media/icml-2026/Slides/66120.pdf) is a single poster page. Its entire three-column content was visually read, including methods, results, ablations and layouts. The conference page exposes no separate poster/supplement link; OpenReview API access returned403 and was not counted as inspected content.
- **Code availability:** The paper links [EDA-AI](https://github.com/Thinklab-SJTU/EDA-AI). The complete2727-entry public tree and its README currently list DeepPlace, PRNet, HubRouter, PreRoutGNN, FlexPlanner, DSBRouter and OAREST, with no RulePlanner implementation or checkpoint entry. The shared repository link is retained here as the author's pointer, while the catalogue's available-code field is removed. Earlier FlexPlanner code is not treated as RulePlanner's implementation.
- **Verification scope:** The note distinguishes mask specifications, empirical threshold counts, circuit-specific training and best-of-K×M transfer. The grouping-threshold observation follows directly from printed nonnegativity and comparison signs; no unpublished implementation or benchmark run was inferred. The framework image is original formal Figure2.
