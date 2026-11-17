---
id: entropy-adaptive-sinkhorn
short_title: Entropy-Adaptive Sinkhorn
title: Learning Permutation from Structure Without Supervision
authors:
- Ran Eisenberg
- Ofir Lindenbaum
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/eisenberg26a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/eisenberg26a.html
institutions:
- Faculty of Engineering, Bar-Ilan University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Permutation Optimization
- Routing
problems:
- Sorting
- Jigsaw Puzzles
- Traveling Salesman Problem
summary: Task-specific structural losses and locally adaptive Gumbel–Sinkhorn learn sorting, anchored jigsaw and
  TSP permutations, with measured three-seed gains and theoretical/release limitations.
code_url: https://github.com/LindenbaumLab/Learning-Permutation-from-Structure-Without-Supervision
figure:
  path: paper-assets/entropy-adaptive-sinkhorn/framework.png
  alt: Original entropy-adaptive Gumbel–Sinkhorn Figure1 with full caption contrasting uncertain and confident assignments
    under local/global control.
  caption: 'Figure1: original entropy-adaptive permutation learning overview.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/eisenberg26a/eisenberg26a.pdf#page=3
---

# Learning Permutation from Structure Without Supervision

> **TL;DR:** Task-specific networks learn soft permutations from monotonicity, image-boundary or tour-length losses. Entropy-adaptive Gumbel–Sinkhorn uses local temperature control to improve the tested global-temperature baselines. Larger jigsaw experiments require revealed anchor positions, and the TSP results remain30–68% above their references without post-hoc search.

## Motivation

During weakly supervised permutation learning, some assignments become confident while others remain ambiguous. A single temperature may sharpen uncertain assignments too early or leave confident ones diffuse. The method adjusts this exploration/discretization balance locally while retaining global assignment constraints. [pp.1–3]

## Contributions

- Structural losses train a permutation operator without directly supplying a complete target ordering.
- Row/column assignment entropy controls a bounded local temperature field through a detached controller.
- A fixed-field optimal-transport interpretation identifies adaptive inverse temperature as local cost rescaling.
- Sorting, anchored CelebA reconstruction and unsupervised TSP compare local adaptation with global schedules; TSP uses a task-specific degree-violation signal. [pp.4–8,12–21]

## Methodology

**Adaptive relaxation.** A task network predicts compatibility scores S. First compute Q=Sinkhorn(β₀ stopgrad(S)) and its row/column entropies normalized by log n. A bounded boost b(H) activates above threshold H₀. The main formulation sets row/column inverse temperatures toβ₀/(1+b), averages those inverse temperatures, then computes Sinkhorn(β⊙(S+g)) with independent Gumbel noise. Gradients pass through this final relaxation, while the controller field is held fixed for that step. [pp.4–5]

**Task objectives.** Sorting uses a squared hinge penalty on negative adjacent differences in the softly reordered list; jigsaw uses squared border discontinuities. A GNN-based TSP model minimizes expected tour length through an induced successor heatmap, with a row-sum penalty. Its degree-violation adaptation(DV-TA) uses|expected degree−2| as an uncertainty signal; it is not simply the generic entropy controller. Deterministic Hungarian assignment produces hard permutations, without additional TSP search. [pp.6–8,13–16]

**Classification:** Specialist / constructive. Different task architectures, losses and separately trained models are used. A common relaxation framework does not demonstrate one shared cross-problem solver. Temperature adaptation is part of training/decoding rather than an independent learned incumbent-improvement policy. [pp.6–8,15–16]

## Experiments

| Task | Reported protocol |
| --- | --- |
| Number sorting |Uniform[0,1] or[10,11], lengths5/10/50/100/200/300;10K training lists/100 test lists,150 epochs, batch256 |
| Sorting relaxation |Lightweight Conv1D, five Gumbel samples per batch, ten log-Sinkhorn iterations; baseβ.66→2; H₀=.7/bmax=.1 |
| CelebA jigsaw |178×178 images; grids4–7; anchors0/1/6/12 at16/25/36/49 tiles;500–600 epochs, five Gumbel samples, ten Sinkhorn iterations |
| TSP100/200 |300 epochs, batch128; baseβ1→5 over200 epochs; adaptation from epoch30 |
| TSP500/1,000 |500 epochs, batch8; baseβ.285→2 over300 epochs;50 Sinkhorn iterations |
| TSP sampling |Eight Gumbel samples for GS models versus one for UTSP; deterministic/no-Gumbel evaluation |
| Statistics |Means and standard deviations over three random seeds; Adam; paper specifies gradient clipping norm1 |
| Additional cost |One deterministic Sinkhorn pass for entropy; paper estimates10–15% extra training time, without a detailed hardware/timing table |

**Sorting:** On[10,11], adaptive/global GS Kendallτ is.80±.11/.74±.10 at100,.67±.22/.60±.22 at200, and.15±.14/.06±.12 at300. The improvement does not imply successful long-list sorting:τ remains low at300. On[0,1], adaptive GS at300 gives.69±.23 versus global.44±.22, but train-free NeuralSort reaches.73 and supervised GS1.00. Translation from[0,1] to[10,11] leaves pairwise value differences unchanged; the observed difficulty includes model/numerical sensitivity, rather than establishing greater intrinsic permutation ambiguity. [pp.6–7,16–18]

**Anchored jigsaw:** Adaptive/globalτ is.199±.010/.178±.003 at5×5,.283±.038/.256±.003 at6×6 and.291±.093/.201±.003 at7×7. The mask-only anchor/random-fill baselines are.029/.126/.189. Adaptive gains beyond those baselines are.170/.157/.102; rawτ is not comparable across these differing anchor budgets. The paper reports non-convergence without anchors on the larger cases. Twelve revealed positions out of49 make the largest case partially supervised. [pp.7–8,14–16]

**TSP:**

| Method |100-node gap |200-node gap |500-node gap |1,000-node gap |
| --- | --- | --- | --- | --- |
| UTSP rerun |45.08±3.48% |50.68±2.61% |66.61±9.19% |77.44±5.79% |
| GS UTSP |31.24±3.86% |38.51±.98% |52.95±5.18% |70.95±3.03% |
| GS UTSP+DV-TA |30.14±1.48% |37.67±1.17% |49.06±.45% |67.65±3.00% |

These direct-permutation/no-search configurations improve the displayed baselines but remain far from the Concorde references. They should not be equated with published UTSP pipelines that include search or with competitive specialized routing solvers. The GS-versus-UTSP sampling budgets also differ. Global annealing alone has smaller gains than DV-TA. [pp.7–8,14–15]

**Ablations:** The7×7 default adaptiveτ.291±.093 exceeds product-combination.246±.033 and wider-band smoothness.247±.051. Fixed/global values range.152–.197. A16-point TSP500 sweep reports tour lengths about48.9–50.4 without NaNs/non-improving initialization under its stated failure criterion; its colorbar is mistakenly labeled Kendallτ. The selected OT4P sorting setup performs near chance for n≥50, which AppendixP correctly limits to that objective/numerical configuration. [pp.8,17–21]

## Limitations

### Curator Notes

- **Global-temperature proposition:** AppendixA's Lemma1 labels a sufficient threshold as necessary; the exact isolated-block threshold is log((n₁−1)(1−ε)/ε)/Δ. More fundamentally, with two equal two-item blocks and ε=η=.25, both requirements hold for anyβ in[log3/Δ,log3/δ], a nonempty interval wheneverΔ>δ. Thus the printed universal choice-of-margins argument is not generally valid. A finite example Δ=1,δ=.01,M=100,β=2 gives easy diagonals.880797 and hard diagonals.505, satisfying both targets. The empirical controller may still help; this issue concerns the stated proposition/proof.
- **Scope of optimal transport:** Proposition2 is the standard fixed-positive-field KL/Sinkhorn equivalence for a converged assignment solution. It does not prove optimal neural training, exact discrete recovery, or exact row/column feasibility after ten/fifty iterations. Local cost scaling differs from introducing independently weighted entropy terms.
- **Weak structural objectives:** A uniform soft assignment maps input[0,1] to[.5,.5] and has zero monotonicity penalty while identifying no correct hard ordering. Symmetry/relaxation ambiguities are not eliminated by temperature control. Anchors and the chosen structural objectives are consequential parts of the reported results.
- **Printed/released temperature combination:** Main text and poster average inverse temperatures. AppendixQ.1 and the current sorting release average temperatures before inversion. With unit base inverse temperature and row/column boosts0/.1, these yield.954545 and.952381 respectively. The release also supports raw row/column-softmax entropy, though the benchmark's default selects the formal Sinkhorn source. Stop-gradient and bounded boosts are implemented.
- **Current release coverage:** The public repository supplies sorting experiments only, with no jigsaw/TSP implementation, datasets or checkpoints. Its inspected training loop lacks the paper's stated gradient-clipping call; deterministic evaluation applies Hungarian matching to raw score logits. Optional test-τ monitoring/checkpoint selection and extra model/mask variants exist, but are not evidence that historical experiments used those options. Full benchmark/training results were not replayed here.
- **Reporting limits:** Table4's caption identifies7×7/12 anchors while nearby prose refers to6×6; the caption/poster agree on7×7. OT4P uses row-argmax decoding in AppendixP despite the broad all-Hungarian statement in AppendixF. Assertions that trained sorting operators fundamentally fail are stronger than these specific experiments establish. Three seeds provide uncertainty estimates, not a universal robustness guarantee.

## Reproducibility

- **Publication:** [ICML2026/PMLR306,27720–27740](https://proceedings.mlr.press/v306/eisenberg26a.html), explicit publisher date2026-09-29. Both authors are affiliated with the Faculty of Engineering, Bar-Ilan University.
- **Full text:** All21 formal pages, complete references, AppendicesA–Q, Algorithm1 and both propositions/proofs were freshly read; all four figures/ten tables were visually checked on14 relevant paper pages.
- **Companions:** The [official event](https://icml.cc/virtual/2026/poster/65061) supplies19 PDF slide pages/eight logical slides, all read, and a1.871MB poster, fully read in three overlapping tiles. The untruncated13-entry GitHub tree and14-member140,968-byte ZIP contain only the README, sorting/utility code, overview image and bytecode; no additional scientific PDF/notebook/archive is present.
- **Code:** [Author implementation](https://github.com/LindenbaumLab/Learning-Permutation-from-Structure-Without-Supervision), treeb88c8de697a39e18e67213a94b9a2a93699eceb6. The README, Conv1D scorer, entropy/temperature controller, log-Sinkhorn/Hungarian utilities, data generator, training loss/evaluation and benchmark defaults were inspected. Local formula/finite-matrix checks establish only the specified boundaries.
- **Figure:** Original Figure1 with its full caption contrasts local and global temperature control.
