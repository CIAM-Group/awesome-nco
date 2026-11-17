---
id: puzzlefusion
short_title: PuzzleFusion
title: 'PuzzleFusion: Unleashing the Power of Diffusion Models for Spatial Puzzle
  Solving'
authors:
- Sepidehsadat Hosseini
- Mohammad Amin Shabani
- Saghar Irandoust
- Yasutaka Furukawa
year: 2023
date: '2022-11-24'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/1e70ac91ad26ba5b24cf11b12a1f90fe-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/1e70ac91ad26ba5b24cf11b12a1f90fe-Abstract-Conference.html
institutions:
- Simon Fraser University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
- Graph Matching
problems:
- Jigsaw Puzzles
- Room Arrangement
summary: Conditional pose diffusion assembles polygonal jigsaws and room layouts using
  separately trained models, corner/polygon attention and matching supervision; evaluation
  protocols distinguish rotation prediction from given-rotation ablations.
arxiv_url: https://arxiv.org/abs/2211.13785
code_url: https://github.com/sepidsh/PuzzleFussion
---

# PuzzleFusion: Unleashing the Power of Diffusion Models for Spatial Puzzle Solving

> **TL;DR:** Denoise per-corner pose estimates conditioned on polygon geometry to assemble jigsaws or room layouts. The same architecture is trained separately for experimental settings; learned pose generation is not an exact feasibility or optimality certificate.

## Motivation

Spatial assembly often enumerates compatible piece pairs and searches over global arrangements, which can be expensive and brittle to noisy geometry. PuzzleFusion learns a distribution over complete arrangements and iteratively denoises their poses. Geometry and optional texture, room-type and door information provide conditions rather than a manually enumerated set of complete arrangements.

## Contributions

The work adapts conditional diffusion to cross-cut jigsaw puzzles (CJP), Voronoi jigsaws (VJP) and room layout arrangement (RLA). It adds a redundant per-corner pose representation, polygon/global attention and a matching loss. New Voronoi and MagicPlan datasets provide ground-truth arrangements, while comparisons and ablations examine noise, missing/duplicate pieces, appearance, room types, doors and representation choices.

This is a **specialist/constructive** spatial solver. Section 5.3 explicitly trains a network for each experimental setting. Shared architecture and input/output conventions do not demonstrate one unchanged checkpoint across CJP, VJP and RLA. Noise-free puzzle models are transferred to noisy or missing/duplicate-piece tests, but that is within-task robustness rather than cross-problem checkpoint sharing.

## Methodology

Each input polygon is a loop of corner coordinates relative to its center. Jigsaw outputs are 2D translations and arbitrary rotations; RLA restricts orientations to four Manhattan rotations. Room-type indicators and separate two-corner door segments condition RLA, while pictorial CJP adds 128-dimensional features from a pretrained image autoencoder. Every corner stores a redundant four-dimensional pose: two center coordinates and two rotation-vector components.

A 1,000-step cosine-noise DDPM corrupts ground-truth poses. Its denoiser embeds the current pose, original geometry, polygon/corner indices, diffusion time and optional attributes into width 256. Six four-head Transformer blocks combine polygon self-attention with global attention. The denoiser predicts noise, and final per-corner outputs are averaged within each polygon. The noise-regression loss is supplemented by matching corresponding transformed corners; RLA's best variant matches door corners, and matching supervision is used only for t<500. These are learned soft objectives, not hard non-overlap, connectivity or exact-assembly constraints.

The paper specifies AdamW, batch size 512, initial learning rate 0.0005 and weight decay 0.05, with roughly 24 hours training and three seconds per arrangement on its i9/dual-A6000 workstation. The inspected publisher/current launchers instead use learning rate 0.001; reproductions should select a documented configuration rather than treat those values as identical. The public/publisher transformer and diffusion files agree after newline normalization, including the t<500 pairwise loss.

## Experiments

**Data/protocols.** CJP uses 100,000 training and 1,000 test puzzles; VJP uses 200,000/1,000. MagicPlan supplies 98,780 single-floor house/apartment arrangements split 93,780/5,000, with 3–10 rooms; RPLAN uses 55,000/5,000 and 3–8 rooms. Shapes are normalized, with additional test-time RLA scaling in [0.8,1.0] to reduce reliance on a fixed assembled extent. Small subsets restrict houses to six rooms for the expensive candidate-enumeration baseline. Apictorial Harel comparisons cap each solve at two minutes and count failures; the pictorial baseline comparison uses only 20 uncapped samples.

**Room arrangement.** Main Table 1 predicts positions and rotations. PuzzleFusion obtains MPE/GED 10.55/0.97 on Full RPLAN versus TransVector 46.18/2.27, and 40.81/3.09 on Full MagicPlan versus 53.11/6.41. It does not beat every competing metric: Small MagicPlan GED is 1.95 versus Shabani's better 1.89. Appendix Table 6 instead supplies ground-truth rotations to accommodate TransRaster and reports 27.9±0.7 MPE/2.7±0.5 GED on Full MagicPlan. Those easier-task numbers must remain separate from main Table 1. Their stochastic-output variation is not evidence of confidence intervals over independently trained networks.

**Jigsaws.** Noise-free CJP overlap is 0.94 versus Harel's 0.91, and noise-level-2 overlap is 0.93 versus 0.30. However, noise-free connectivity recall is lower, 0.91 versus Harel's 0.99. VJP achieves overlap 0.70 without noise and 0.67 at level 2; Harel is inapplicable to this geometry, so no direct VJP superiority over that baseline is measured. Models trained on noise-free pieces are reused for noisy tests. Appendix C reports missing/duplicate tests at 10% per-piece corruption without such training corruptions; for missing CJP pieces, overlap/precision/recall are 0.88/0.92/0.82. Pictorial input changes full-CJP overlap only slightly, 0.9398 to 0.9417, while accelerating convergence.

**Ablations/qualitative evidence.** Removing global attention or door supervision worsens room arrangement. Rare architecture and inherent ambiguity remain failure cases. Averaging per-corner predictions produces more coherent layouts than raw predictions, but does not certify correct geometry. The supplemental video illustrates this denoising/voting behavior and several pictorial/apictorial/layout samples; it is qualitative evidence rather than another benchmark or timing measurement.

## Limitations

Large supervised datasets and repeated denoising impose training/inference costs. Per-setting models limit claims of generalist deployment. No theorem ensures exact assembly, non-overlap, connectivity or optimality, and some reported metrics favor a baseline. Results depend on supplied piece geometry/types/doors, synthetic puzzle generation and processed Manhattan room layouts. Ground-truth-rotation experiments and 20-sample pictorial comparisons have narrower scope than the main room-layout and apictorial studies. The paper identifies data efficiency and mobile-device computation as future work.

## Reproducibility

- The complete 24-page formal PDF, all its references and integrated A–C appendices were read. The publisher ZIP also contains a separate 11-page anonymous-submission scientific supplement, which was independently read in full, including its references; it largely overlaps the integrated appendix and is not counted as an extra paper. Two one-page repository vector figures were also read. All four PDF sources are registered with hashes and coverage, totaling 37 source pages. Twenty-six pages across these sources were rendered/visually inspected, including all visual-only result pages.
- [Formal publication](https://proceedings.neurips.cc/paper_files/paper/2023/hash/1e70ac91ad26ba5b24cf11b12a1f90fe-Abstract-Conference.html): NeurIPS 2023, DOI 10.52202/075280-0420, publisher date December 15, 2023. The [arXiv history](https://arxiv.org/abs/2211.13785) starts November 24, 2022; this is the note's chronological date. The formal PDF, author page/repository and arXiv spell the first author's surname **Hosseini**, while publisher HTML incorrectly prints Hossieni. The formal spelling is used here.
- The [publisher ZIP](https://proceedings.neurips.cc/paper_files/paper/2023/file/1e70ac91ad26ba5b24cf11b12a1f90fe-Supplemental-Conference.zip) has 301 entries, including AppleDouble metadata, source/data samples, `120-sup.pdf` and `120.mp4`; its SHA-256 is `3722bbcffb21b60d20dba670fe6b4a32774abb2a4150fca57791f80759566498`. Its full inventory/hashes are cached. OpenReview API v1/v2 attachment queries return 403, while the publisher's identified scientific materials were obtained.
- Video `120.mp4` has SHA-256 `15536bf857f0d4f3a8546ef45d959cb039ae7eaecccfebad8dd6fee0756de35d` and duration 146.91 s. All 75 sampled frames, covering every two seconds plus 146.85 s, were viewed on 13 sheets and their on-screen explanations read. This is temporal sampling, not frame-by-frame playback. The entire native 48-kHz stereo track was decoded: all 14,104,576 PCM samples are exactly zero, confirming no audible narration rather than relying on a sampled or canceled mono signal.
- The [author repository](https://github.com/sepidsh/PuzzleFussion), commit `065297cb66776ee99aa4e17be689aca06902467c`, has 184 files, task-specific code/configurations and external dataset/checkpoint links. The full transformer, CJP loader and launcher files and scientific diffusion-loss sections were inspected against the publisher code. Dataset/checkpoint links are availability evidence, not a claim that full datasets were audited or tensor checkpoints executed. No neural training or evaluation benchmark was rerun. Complete citation scans identified no supported existing-catalogue targets; no diffusion-architecture similarity edges are added.
