---
id: construct-and-refine
short_title: CaR
title: Towards Efficient Constraint Handling in Neural Solvers for Routing Problems
authors:
- Jieyi Bi
- Zhiguang Cao
- Jianan Zhou
- Wen Song
- Yaoxin Wu
- Jie Zhang
- Yining Ma
- Cathy Wu
year: 2026
date: '2026-02-17'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1413fbda783a5bad7947c2f7396ba64b-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1413fbda783a5bad7947c2f7396ba64b-Abstract-Conference.html
institutions:
- Nanyang Technological University
- Singapore Management University
- Shandong University
- Eindhoven University of Technology
- Massachusetts Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem with Time Windows
- Capacitated Vehicle Routing Problem with Backhauls, Length Limits and Time Windows
- Capacitated Vehicle Routing Problem
- Traveling Salesman Problem with Draft Limits
- Sequential Ordering Problem
summary: Jointly train neural construction and short incumbent refinement with a shared encoder, diversity and pseudo-supervision;
  hard-masked reconstruction additionally supplies feasible CVRPBLTW outputs, while TSPTW retains failures.
code_url: https://github.com/jieyibi/CaR-constraint
arxiv_url: https://arxiv.org/abs/2602.16012
figure:
  path: paper-assets/construct-and-refine/framework.png
  alt: CaR jointly trains construction and short refinement, with shared representations, diversity regularization
    and feedback supervision from improved candidates.
  caption: 'Figure 1: Construct-and-Refine joint training and candidate refinement.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=5
---
# Towards Efficient Constraint Handling in Neural Solvers for Routing Problems

> **TL;DR:** CaR jointly learns an initial-solution policy and a short neural refinement policy, sharing an encoder and feeding improved candidates back as construction supervision. It improves the feasibility/runtime trade-off on constrained routing. Reported zero CVRPBLTW failures additionally rely on a final hard-masked construction step; neural refinement alone still fails on some instances. Different tasks use separate checkpoints.

## Motivation

Locally feasible construction can reach an infeasible TSPTW dead end, and exact completion-aware masking is intractable in general. Strict masks can also lead to conservative learning on multi-constraint VRPs, while conventional neural local search may need thousands of steps to repair poor initial solutions. CaR targets initial solutions that a jointly trained refiner can improve within a small horizon. This is an empirical approach; the paper does not establish new convergence, sample-complexity or universal feasibility theorems. [Sections1–4/AppendixE.10.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=1)

## Contributions

- Jointly train neural **construction and incumbent refinement**, using a short refinement horizon instead of simply appending a pretrained search to a pretrained constructor.
- Encourage construction diversity and use improved candidates as pseudo-targets for auxiliary supervision.
- Share encoder parameters across construction and refinement while retaining separate decoders and refinement-specific solution-position features.
- Study hard TSPTW and CVRP with backhaul, duration and time-window constraints, plus actual CVRP, TSPDL and sequential-ordering experiments. “General framework” refers to reuse across separately trained solvers, not one jointly trained cross-problem checkpoint.

## Methodology

### Joint policies and short refinement

The constructor produces S candidates; cost-ranked top-p candidates undergo T_R neural refinement steps. CVRP uses POMO multi-start construction; time-constrained tasks sample candidates without forcing every starting node. The constructor has a group-baseline REINFORCE objective, a diversity term and a pseudo-supervised term applied when refinement improves feasibility/objective. The refiner uses group-baseline policy gradients at each short-horizon step, averaged over the horizon. Construction and weighted refinement losses update shared parameters jointly. [Sections4.2–4.3.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=5)

The default shared encoder has six Transformer layers,128-dimensional embeddings, instance normalization and512-wide feed-forward layers. It processes instance coordinates and constraint attributes. Refinement additionally represents the complete incumbent as a linked tour, with cyclic positional encoding and synthesis attention combining node and position compatibility. Depot copies occupy distinct positions in CVRP tours. Separate decoders select construction nodes and either flexible k-opt moves (k≤4) or remove-and-reinsert actions. Refiner features include recent feasibility transitions and node-level violation/demand/time/distance context. [Figures2/5/AppendixC.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=6)

This is **specialist / constructive-improvement**: its own neural constructor and complete-incumbent neural editor are substantive method components. Sharing an encoder between these stages is parameter sharing *within a task*, not evidence of a cross-task generalist model. AppendixB explicitly describes CaR as a single-task solver.

### Constraints and final feasibility handling

Relaxed training penalizes violation magnitudes and violated-node counts, with the formal cost combining distance and violation-dependent terms. Visited-node masks remain in every problem; ordinary CVRP additionally retains capacity masking. “Without masks” therefore means relaxing selected constraint masks, not removing node-visit validity.

TSPTW uses refinement to repair infeasible tours and still has residual failures. For CVRPBLTW, **a final hard-masked reconstruction/construction step supplies feasible candidates**, which are combined with the best feasible construct-and-refine candidates. Table13 separates the stages: at100 customers, R&R construction has3.10% failures, neural refinement1.90%, and final reported reconstruction0.00%; the conditional gap changes−1.715→−2.886→−2.448%. Better conditional quality before the last stage does not remove its failures. The final feasibility result must not be attributed to20 neural refinement moves alone. [AppendixE.1/Table13.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=24)

The tested CVRPBLTW has capacities40/50 at sizes50/100,20% backhaul customers, duration limit3, depot horizon3 and service time.2. **There is no strict linehaul-before-backhaul precedence** in the described generator. These mixed-service settings should not be silently equated with a different ordered-backhaul variant. TSPDL is draft-limited routing; the release README's “Deadlines” expansion is a naming error. SOP fixes start/end nodes with20% sampled precedence pairs and two distance/noise-mixture variants. [AppendixB.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=18)

## Experiments

### Training and inference budgets

Each primary model trains on20,000 fresh instances per epoch for5,000 epochs, batch128:100M instance presentations and approximately780k gradient steps, rather than a single shared multi-task training run. Refinement uses T_R=5 during training after an approximately ten-epoch construction warm-up. Adam uses learning rate.0001 and weight decay.000001. Diversity/supervision weights are.01/1; the refinement-loss multiplier is100 for TSPTW/CVRP and10 for CVRPBLTW. Training p is memory-dependent; the TSPTW50 ablation uses10. [Sections5/D.1/E.7.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=7)

At inference, eight coordinate augmentations yield one **sampled** initial solution per augmentation for TSPTW and one **greedy** candidate for CVRPBLTW, each refined for5/10/20 steps. CVRP uses multi-start construction but refines top2 candidates at50 and top1 at100 per augmentation. Main times cover10,000 TSPTW instances or1,000 CVRPBLTW/CVRP instances on one RTX4090, with an i9-10940X CPU for classical processing. OR-Tools receives20/40 seconds per instance in short mode and200/400 in long mode; LKH generally uses10,000 trials/one run. Some baseline results are borrowed from original papers and have different hardware provenance. [AppendixD.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=21)

### Hard TSPTW: window definition matters

The primary100-node hard set uses width-control eta=n rather than PIP's fixed50, making the training/test setting **looser than the original PIP100 hard benchmark**. Table10 separately transfers to the original tighter dataset. The general sentence about reusing PIP test data does not override this explicit setting distinction. The planted random tour ensures feasible hard instances. [AppendixB.1/Table10.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=18)

| TSPTW setting | Method/budget | Gap to LKH reference | Instance failure | Total time |
| --- | --- | --- | --- | --- |
|50 | CaR-PIP,20 steps |.005% |0.00% |52s |
|100, primary looser set | CaR-PIP,20 steps |.146% |.02% |2.4min |
|100, primary looser set | Adapted NeuOpt,5,000 steps |.123% |.02% |30min |
|100, primary looser set | CaR-POMO,5 steps |1.065% |4.20% |36s |

Thus CaR offers a useful speed/quality trade-off, not dominance at every budget. At100 nodes the long NeuOpt run has a slightly smaller gap at substantially greater time. PIP sampling10 reports4.47% failures and1.026% gap in4.7 minutes. The paper's6–8× speedups refer to particular runtime curves/comparators, not every solver or hardware setting. [Table2/Figure3.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=7)

The average objective uses best feasible solutions. Failure is evaluated per instance after candidate selection/refinement. Gaps are relative to strong **heuristic references**, not certified optima; quality means over successful instances must be considered alongside failures. Negative gaps against LKH/OR-Tools do not imply beating true optima.

### CVRPBLTW, ordinary CVRP and additional tasks

At CVRPBLTW100,20-step R&R plus the final feasible-candidate stage reports−2.448% gap to long OR-Tools,0% failure and19 seconds for1,000 instances; k-opt gives−1.724% in17 seconds. Ordinary POMO is7.004% in4 seconds. These comparisons measure additional refinement/feasibility handling, rather than cost-free improvement to the same constructor. [Table2/13.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=7)

At CVRP100,20-step CaR gives.889% in23 seconds; NeuOpt5,000 steps gives a slightly better.878% in6.8 minutes. The most expensive CaR sampling4+EAS variant achieves.148% in1.7 hours, versus POMO+EAS+SGBS long at.170% in34 minutes. Its best displayed gap comes with a different runtime budget. The cheaper CaR+EAS50 variant does not beat the displayed long SGBS50 gap. [Table14.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=25)

TSPDL50 reports2.190% gap/.26% failure/53 seconds versus sampled PIP2.630%/1.86%/60 seconds. SOP50's two variants improve POMO gaps1.436→.676% and.463→.084% against LKH. These are actual extra task experiments and are included in the note's metadata. [Tables3–4.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=9)

### Transfer and ablations

CVRPBLTW100→200 transfer gives2.09% gap,0% failure and10 seconds, versus the displayed adapted construction-search baseline4.51%/2.1 minutes. On the tighter TSPTW100 distribution, a loose-trained CaR-PIP gives.02% gap/3.52% failures versus tight-trained PIP.26%/4.62%, both around2.3 minutes. A tiny conditional gap here is not perfect feasibility. [Tables9–10.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=10)

CVRPLIB evaluates **28 selected X instances with101–251 nodes**, not the entire library. Greedy20-step CaR averages5.00% versus MVMoE6.88%, but loses individual instances: onX-n219-k73, CaR14.07% is worse than INViT2.36%. UDC uses two reconstruction iterations even in this nominal greedy comparison. [Figure4/Table15.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=26)

Shared encoder parameters reduce the main model from2.8M to about1.6M and improve hard-TSPTW50 gap.199→.014%. They do not win every quality setting: medium-TSPTW50 changes2.047→2.173% while failure improves.01→0%. Separating the decoders improves hard50 gap.041→.014% compared with sharing both stages. [Tables8/17–19.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=26)

Pseudo-supervision helps the weaker constructor more; diversity ablations also help at the chosen weight. However, increasing the diversity weight.01→.1 gives32.68% failures, and doubling supervision1→2 gives32.12%. These results show **material hyperparameter sensitivity**, despite broad robustness wording. The approximately15% diversity comparison against PIP is not an isolated causal measurement of the diversity term, since complete model training differs. [Tables6–7/16/21.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=29)

AppendixE.9 varies five **inference seeds**, not independent training runs. Its Table22 gives CaR-PIP100/20-step failure.64±.06%, inconsistent with Table2's.02%; this material discrepancy remains unresolved in the source. The reported pairwise p<.001 lacks a clearly specified test procedure/sampling unit in the accompanying discussion and is not treated as independently validated training-seed significance. Table20 additionally prints a100-step second test horizon while the prose says1,000; that row's exact budget is not silently reconciled. [AppendixE.9/Table22.](https://proceedings.iclr.cc/paper_files/paper/2026/file/1413fbda783a5bad7947c2f7396ba64b-Paper-Conference.pdf#page=30)

## Limitations

### Discussed in the Paper

More constrained problems/backbones, larger instances and foundation-model training remain future work. AppendixE.10 outlines possible learnability, convergence and generalization analyses; it does not prove them.

### Curator Notes

- The main100-node TSPTW distribution is looser than the original fixed-width PIP benchmark; dataset identity and hardness parameters must accompany any comparison.
- The complete CVRPBLTW inference pipeline includes an extra strict-mask construction stage; residual neural-refinement failures and its quality trade-off are visible in Table13.
- Separate task checkpoints, conditional feasible-instance metrics and different inference budgets preclude universal solver/optimality claims.
- Shared representations and auxiliary losses have setting-specific trade-offs; large loss-weight changes can severely damage feasibility.
- Borrowed baseline numbers, adapted baseline architectures and the Table22 failure discrepancy limit strong reproduction/statistical claims.

## Reproducibility

- **Complete reading:** all30 official ICLR pages, references and scientific AppendicesA–F,22 tables and12 figures. Original architectures, operators, learning equations, runtime curves, feasibility stages, trajectories, CVRPLIB rows and statistics were read; key content was visually checked.
- **Metadata:** all eight authors and NTU/SMU/Shandong/TUe/MIT affiliations verified. The actual publisher HTML explicitly supplies publication20April2026. The official README links [arXiv:2602.16012](https://arxiv.org/abs/2602.16012).
- **Scientific inventory:** publisher page links the complete PDF without a separate supplement. OpenReview API forraDFGuQxvD returned403; unseen attachments are not claimed as inspected. All namedA–F material is included and read. The114-entry official master-branch tree contains no extra PDF/TEX/notebook/ZIP scientific document; its sole plot PNG was opened and matched to Figure1. Named compressed SOP files are datasets, not additional scientific manuscripts.
- **Code inspected:** README, model constructor/shared-encoder and construction-probability paths, selected complete reward/loss/feasibility routines, top-p/refinement and pseudo-supervision blocks, inference preset configuration and strict-mask auxiliary construction/merge. The release has real separately named checkpoints for tasks/backbones. No full training or benchmark rerun was performed.
- **Feasible candidate handling:** the visible `aux_mask` test path independently constructs a strict-mask candidate and merges its feasible score with existing construct-and-refine outputs; it does not imply every refined incumbent becomes feasible. The CVRPBLTW test preset enables this stage.
- **Loss/formula differences:** the printed improvement reward uses a minimum with zero, whereas code computes nonnegative best-cost reduction via old best minus updated minimum. The visible imitation loss averages **selected-action probabilities**, while Equation5 specifies their log-likelihood. These objectives are not identical. The default diversity path uses only selected-action `−p log p` terms, not the complete categorical entropy; an all-action option is separate. Actual construction masking is applied after logit clipping, preserving excluded-action zero probability.
- **Reference identity:** citations preserve early AM2018/GCN2019/RouteFinder2024/Cross-problem2024 versions and the actual formal seven-author SIL2025 entry. The distinct Hottung–Tierney *Artificial Intelligence*2022 article103786 is not forced onto the repository's ECAI2020 NLNS identifier merely because it shares authors/code.
- **Figure:** complete original Figure1, page5, cropped directly from the formal paper. [Official code](https://github.com/jieyibi/CaR-constraint).
