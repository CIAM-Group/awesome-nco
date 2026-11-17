---
id: flexplanner
short_title: FlexPlanner
title: 'FlexPlanner: Flexible 3D Floorplanning via Deep Reinforcement Learning in Hybrid Action Space with Multi-Modality
  Representation'
authors:
- Ruizhe Zhong
- Xingbo Du
- Shixiong Kai
- Zhentao Tang
- Siyuan Xu
- Jianye Hao
- Mingxuan Yuan
- Junchi Yan
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/585e9cf25585612ac27b535457116513-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/585e9cf25585612ac27b535457116513-Abstract-Conference.html
institutions:
- Department of Computer Science and Engineering, School of AI and MoE Key Lab of AI, Shanghai Jiao Tong University
- Huawei Noah’s Ark Lab
- College of Intelligence and Computing, Tianjin University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- 3D Floorplanning
summary: A specialist multimodal hybrid-action constructor interleaves fixed per-die block queues and predicts positions
  and shapes for 3D floorplanning, with partial-alignment, feasibility and transfer qualifications.
code_url: https://github.com/Thinklab-SJTU/EDA-AI
figure:
  path: paper-assets/flexplanner/framework.png
  alt: 'Original FlexPlanner Figure1: multimodal state, three hybrid-action heads and critic, with complete caption.'
  caption: 'Figure1: original FlexPlanner pipeline, with vision, netlist and sequence representations.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/file/585e9cf25585612ac27b535457116513-Paper-Conference.pdf#page=4
---

# FlexPlanner: Flexible 3D Floorplanning via Deep Reinforcement Learning in Hybrid Action Space with Multi-Modality Representation

> **TL;DR:** A specialist neural constructor combines layout images, netlist graphs and block sequences to place soft blocks across preassigned dies. It chooses current coordinates and the next die/shape, improving alignment and projected wirelength on eight small floorplanning benchmarks; feasibility, transfer and current-release settings require qualifications.

## Motivation

Traditional B*-tree/corner-block representations and fixed block shapes restrict cross-die alignment and flexible 3D floorplanning. FlexPlanner directly predicts coordinates and aspect ratios while interleaving placement on different dies. This is floorplanning with preassigned die membership, rather than unconstrained neural assignment of blocks to dies. [pp.1–4]

## Contributions

- A hybrid action policy chooses discrete current-block coordinates and the next die, plus a continuous aspect ratio for the next block.
- Vision masks, a netlist graph and per-die block sequences expose alignment, wirelength and future queue-head information.
- An asynchronous die-selection policy and shaped rewards improve the reported eight-circuit benchmark and support within-task transfer from a policy trained on n100. [pp.4–10]

## Methodology

**State and construction.** Each block's die is preassigned. Blocks within each die are sorted by descending area into a fixed FIFO queue. The die action selects which queue head will be placed next; it does not freely reorder all remaining blocks or reassign their dies. At step t, the policy places the current block at (x,y), selects the next die and sets the next block's aspect ratio. Thus the neural policy constructs a layout from a partial canvas. [pp.3–7,21]

**Multimodal architecture.** Canvas, incremental wirelength, position and alignment masks encode the current block and candidate queue heads. A two-layer GAT represents netlist clique connections; a sequence Transformer has two encoder and two decoder layers. CNN/GAT shared features are updated through the critic only. An upsampling position head, die-selection head and Gaussian aspect-ratio head form the hybrid actor. Aspect ratios range from .5 to2; discrete grid rounding introduces area error. [pp.4–7,15–16]

**Constraints and objective.** Alignment is the intersection of two blocks' 2D projections, divided by the required area and clipped at1. The formal experiments require the complete smaller block area, α=1. The mean score .940 therefore measures partial normalized alignment, not a94% fully feasible-pair rate. If an alignment partner is unplaced, its mask imposes no current restriction. Figure4's green visualization uses a looser .5 threshold. HPWL is projected 2D half-perimeter wirelength, without an explicit vertical/TSV routing cost. [pp.3–5,8,15,19]

**Learning.** Hybrid PPO separately clips and weights the three component probability ratios. Local reward differences combine alignment, HPWL and overlap. Algorithm2 also adds the final episode score to interior rewards before GAE; this outcome-dependent shaping term is called a global baseline in the paper, but is not an action-independent critic baseline with an established unbiasedness guarantee. The paper contains no formal convergence/optimality proof. [pp.5–7,19–27]

**Classification:** Specialist / constructive. Policies are trained for the floorplanning task, commonly per circuit; n100-to-other-circuit transfer is within that task, not one checkpoint demonstrated across different optimization problems.

## Experiments

| Setting | Formal protocol |
| --- | --- |
| Circuits | MCNC ami33/ami49; GSRC n10/n30/n50/n100/n200/n300 |
| Layout | Two square dies,128×128 grid,85% utilization, aspect ratio .5–2 |
| Alignment | Required area=min(block areas), α=1 |
| Statistics | Five independent seeds, mean±standard deviation |
| Training |1,000 epochs,10 update epochs,8 parallel environments; episode-length×8 buffer |
| PPO |Adam10⁻⁴, batch128, discount.99, GAE.95, clip.2 |
| Hardware |RTX3090 with24GB; two32-core Threadripper3970X CPUs,128GB RAM |

**Main results:**

| Circuit | Alignment | HPWL |
| --- | --- | --- |
| ami33 |.905±.017 |58,339±1,894 |
| ami49 |.955±.010 |762,712±12,878 |
| n10 |.917±.012 |29,781±75 |
| n30 |.920±.024 |83,962±1,030 |
| n50 |.970±.004 |105,839±916 |
| n100 |.961±.017 |176,375±960 |
| n200 |.923±.020 |316,199±1,080 |
| n300 |.965±.010 |459,221±5,935 |

Across the eight circuits, mean alignment is .940 versus MaskPlace .474. Reported average HPWL249,053 versus Wiremask-BBO296,791 gives a16.085% reduction as a ratio of the displayed averages. Most adapted baselines keep fixed aspect ratios, so these are not matched degrees of freedom for isolating the neural architecture. [pp.7–8,16]

- **Transfer:** A policy trained on n100 is evaluated without fine-tuning on seven other circuits. HPWL is worse than separately training on each target by .8–9.5%; alignment is lower on five, equal on n50 and higher on n30. For ami49, alignment falls .955→.894 and HPWL rises9.5%. Subsequent fine-tuning curves are separate evidence. [p.9]
- **Ablations:** On n100, alignment .961 falls to .349 without the alignment mask, .850 with synchronous die placement, .874 without graph features, .860 without sequence features, .840 with sparse reward and .721 with the alternative difference reward. Table5's HPWL176,639±1,001 differs from the main table176,375±960 and should remain a separate reported run. [pp.9–10]
- **Runtime:** Mean inference time is4.266s per floorplan versus Wiremask-BBO1.179, RL-CBL1.826, DeepPlace3.989, GraphPlace4.368 and MaskPlace4.469. At n200/n300, FlexPlanner7.991/10.261s is slower than each of the three listed neural placement baselines. These are inference times, not complete training costs. [p.17]
- **Feasibility and discretization:** Out-of-bound values are reported as zero, but n10 has residual overlap .009±.008; the mean is .001. Algorithm4 divides excess occupancy across both dies by WH, not by total DWH area. At n100, grid128 has2.4% average block-area error; grid256 reduces it to1.3%, but increasing resolution does not monotonically improve HPWL/alignment. [pp.17–19]
- **Preplaced modules:** Figure7 illustrates six fixed modules on n50 and twelve on n100. This is a qualitative demonstration rather than a broad statistical evaluation. [pp.18–19]

## Limitations

### Discussed in the Paper

Thermal optimization is future work. Grid resolution trades execution cost against shape/area precision. Evaluation covers two dies and eight compact circuits rather than complete industrial 3D routed PPA. [pp.10,18]

### Curator Notes

- Masks do not establish unconditional feasibility. The inspected actor progressively drops alignment, then relaxes position constraints and finally falls back to a boundary mask if no candidate remains. The printed residual-overlap results are consistent with qualifying the guarantee; no claim is made that every branch was observed in a replayed benchmark.
- Algorithm1's O(wh), described as O(1), is not constant in grid/block dimensions: constructing the WH mask/output and overlap window requires dimension-dependent work and storage. Vectorization does not change that distinction.
- Current `script/alignment.sh` uses2,000 epochs, alignment_rate=.1 and area_util=1.6. Because the loader sets per-die area=total block area/area_util, the latter means80% aggregate utilization on two dies, versus the formal85%. These examples are not the exact published configuration α=1/1,000epochs.
- Current reward code implements local metric differences and the optional final-score addition, enabled by the example launcher; these match the described shaping mechanism. Its final-outcome dependence does not independently prove variance reduction, convergence or unbiased policy gradients.
- No complete neural training or floorplanning benchmark was independently replayed. Within-task zero-shot results, stronger shape flexibility and partial alignment scores must retain their stated comparison limits.

## Reproducibility

- **Publication:** [NeurIPS2024 proceedings](https://proceedings.neurips.cc/paper_files/paper/2024/hash/585e9cf25585612ac27b535457116513-Abstract-Conference.html); explicit publisher date2024-12-16 retained.
- **Full text:** All27 formal pages,55 references, AppendicesA–G, Algorithms1–5 and complete checklist were freshly read. All seven figures/twelve tables were visually crosschecked on eleven relevant pages; the complete official poster was inspected in three overlapping tiles.
- **Companions:** The [official event](https://neurips.cc/virtual/2024/poster/93514) links the poster, with no separate downloadable scientific supplement/slides identified. The untruncated EDA-AI tree has2,727 entries and its325.394MB ZIP2,728 members, without scientific PDFs/notebooks/nested archives. Root and FlexPlanner READMEs were read; the95-file FlexPlanner subtree includes benchmark inputs but no pretrained checkpoints.
- **Code:** [Author repository](https://github.com/Thinklab-SJTU/EDA-AI), treefd9d3a3df1cf53b6828528bab8925d35abdfa7c8. Inspected actor mask fallback, environment reward, terminal-reward rewriting, layer/partner construction and example launcher; exact reported-average arithmetic is saved locally, without claiming a training replay.
- **Figure:** Original Figure1, including its full caption, replaces the previous illustration.
