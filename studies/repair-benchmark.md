---
id: repair-benchmark
short_title: RePAIR
title: 'Re-assembling the past: The RePAIR dataset and benchmark for real world 2D and 3D puzzle solving'
authors:
- Theodore Tsesmelis
- Luca Palmieri
- Marina Khoroshiltseva
- Adeela Islam
- Gur Elkin
- Ofir Itzhak Shahar
- Gianluca Scarpellini
- Stefano Fiorini
- Yaniv Ohayon
- Nadav Alali
- Sinem Aslan
- Pietro Morerio
- Sebastiano Vascon
- Elena Gravina
- Maria Cristina Napolitano
- Giuseppe Scarpati
- Gabriel Zuchtriegel
- Alexandra Spühler
- Michel E. Fuchs
- Stuart James
- Ohad Ben-Shahar
- Marcello Pelillo
- Alessio Del Bue
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/3507ec8d7d6895eb9feb87a2098abe11-Abstract-Datasets_and_Benchmarks_Track.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/3507ec8d7d6895eb9feb87a2098abe11-Abstract-Datasets_and_Benchmarks_Track.html
institutions:
- Istituto Italiano di Tecnologia
- Ca' Foscari University of Venice
- Ben-Gurion University of the Negev
- Archaeological Park of Pompeii
- University of Lausanne
- Durham University
- University of Milan
- University of Genoa
scope: study
paper_type: benchmark
problem_families:
- Graph Matching
- Planning
problems:
- 2D Puzzle Reassembly
- 3D Puzzle Reassembly
summary: A multimodal real-fragment dataset benchmarks realistic two- and three-dimensional puzzle solving.
code_url: https://github.com/RePAIRProject
---

# Re-assembling the past: The RePAIR dataset and benchmark for real world 2D and 3D puzzle solving

> **TL;DR:** RePAIR pairs textured 3D scans, 2D projections and expert group assemblies to benchmark irregular-fragment reassembly. Its 1,070 digitized fragments include isolated pieces without known solutions and modern test fragments; it is not a complete reconstruction of the full archaeological inventory.

## Motivation

Synthetic jigsaws often have clean edges, complete pieces or strong shape assumptions. Archaeological fragments instead have erosion, missing neighbors, weak pictorial cues and uncertain larger arrangements. RePAIR makes these conditions available for evaluating fragment grouping and pose reconstruction, using frescoes associated with Pompeii's House of Painters at Work (PDF pp. 1–5).

## Contributions

The dataset contains 1,070 digitized fragments, with 117 assembled 3D groups of 2–44 pieces and a smaller 101-group 2D collection. The total includes 150 isolated fragments whose assemblies remain unknown, and 119 artificially made/broken fragments alongside 951 naturally fractured ones. These counts differ from the approximately 16,000 fragments available in the archaeological collection. Group poses are annotated from physical expert assemblies; the complete fresco arrangement is not known (pp. 2–6, 20–21).

The benchmark supplies high-resolution textures, meshes, rendered images, archaeological/geometric metadata, evaluation procedures and baselines. Two simple 2D reconstruction methods supplement an adapted prior archaeological solver, while five learned 3D assembly methods provide a separate comparison. This is a dataset and evaluation study, rather than a single model jointly solving 2D and 3D reassembly.

## Methodology

A structured-light scanner captures fragment geometry and a separate high-resolution camera supplies texture imagery. Top/bottom registration, mesh refinement, photogrammetry, segmentation and texture transfer produce textured meshes. Experts' physical arrangements are manually recreated in Blender to obtain six-degree-of-freedom group poses. Planar painted surfaces are projected orthographically for 2D positions and rotations; nonplanar stucco fragments reduce 2D coverage. Scanner resolution is not a certificate of exact ground-truth assembly poses (pp. 5–6, 22–26).

The stated split is 80% training and 20% testing. The 2D comparison uses texture-based greedy assembly with diffusion-based extrapolation, a genetic geometry objective, and geometric greedy matching. The 3D comparison trains Global, LSTM, DGL, SE(3)-Equiv. and DiffAssemble for 500 epochs with their default learning-rate/optimizer choices. The 3D baselines do not use fragment color. NSM and RGL-NET are excluded for task-specific reasons, so the introductory reference to six methods should not be read as six evaluated 3D rows (pp. 6, 8–9, 27–28).

Reported metrics include area/volume-weighted pose overlap, Qpos; translation/rotation errors; and weighted neighbor-graph scores. Largest-fragment alignment is intended to remove global rigid-motion ambiguity. A separate ablation fixes the largest fragment during 3D prediction, which changes the solver setting and must be distinguished from alignment during evaluation (pp. 7, 26, 28).

## Experiments

All three 2D methods have low reported pose-overlap scores: 0.037 for the adapted archaeological solver, 0.047 for genetic optimization and 0.023 for geometric greedy matching. Their reported F1 scores are 0.471, 0.394 and 0.351. On 3D reassembly, Global has the largest Qpos in the main comparison, 0.127, while other methods perform better on some error or neighborhood columns; no method dominates all metrics (Tables 3–4, p. 8).

Cross-dataset experiments train on RePAIR and evaluate on 2,000 Breaking Bad objects, and reverse the training/evaluation domains. The reverse direction has much lower pose-overlap scores in these experiments. Because the target datasets and geometries also change, the asymmetry is not a controlled proof that one training dataset is universally more informative (Tables 5–6, pp. 8–9).

Fixing a pivot fragment changes several metrics in different directions. DiffAssemble's Qpos rises to 0.384 in that ablation, while the other models' Qpos falls and translation errors increase. It should not be mixed with the unanchored main comparison as one common solver ranking (Table 7, p. 28). The paper explicitly does not report error bars (p. 17).

## Limitations

The benchmark covers a limited archaeological domain, with a small number of annotated groups, incomplete frescoes and manually recreated reference poses. Isolated fragments have no solved reference arrangement. The authors identify degraded geometry, weak textures, missing pieces and the geometry-only 3D baselines as important challenges; broader archaeological and multimodal reasoning are proposed directions, rather than evaluated capabilities (pp. 9–10, 20–21, 26).

Metric names require care. In printed Equation 3, Qprecision divides the weighted true-neighbor intersection by the ground-truth graph, while Qrecall divides by the predicted graph—the reverse of conventional precision/recall naming. The released 2D adjacency implementation uses the same denominators. F1 is symmetric under swapping them, but the individual columns should not be given the usual interpretation without adjustment (p. 7).

Printed Equation 2 uses a sum of Euclidean errors divided by √n, rather than conventional root-mean-square aggregation. The current 2D implementation instead averages individual errors and scales by 1/√2. Thus the reported “RMSE” label, printed expression and released implementation should be reconciled before numerical reproduction or comparison with standard RMSE from another benchmark. This note retains the authors' reported results without treating those metric names as independently verified standard definitions.

## Reproducibility

The [30-page publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2024/file/3507ec8d7d6895eb9feb87a2098abe11-Paper-Datasets_and_Benchmarks_Track.pdf) was read completely, including all 97 references, checklist and Appendices A–I. The [NeurIPS Datasets and Benchmarks record](https://proceedings.neurips.cc/paper_files/paper/2024/hash/3507ec8d7d6895eb9feb87a2098abe11-Abstract-Datasets_and_Benchmarks_Track.html) also links a 217-second video supplement. Its slides were inspected at five-second intervals plus the end frame; complete decoding of both audio channels confirmed silence. The presentation includes some older 2D numbers, so the numerical summary above follows the formal PDF tables.

Data and documentation are linked through [Zenodo](https://zenodo.org/records/13993089) and the [dataset project page](https://repairproject.github.io/RePAIR_dataset/). The [author organization](https://github.com/RePAIRProject) separates [digitization](https://github.com/RePAIRProject/fragment_digitization), [2D baselines](https://github.com/RePAIRProject/2D-baselines) and [3D baselines](https://github.com/RePAIRProject/3D-baselines), alongside segmentation/rendering/ground-truth tools. The baseline READMEs and relevant 2D metric implementations were inspected. Large mesh datasets and model checkpoints were not downloaded, and no baseline training or numerical benchmark was rerun.
