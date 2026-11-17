---
id: gimf
short_title: GIMF
title: Neural Multi-Objective Combinatorial Optimization via Graph-Image Multimodal
  Fusion
authors:
- Jinbiao Chen
- Jiahai Wang
- Zhiguang Cao
- Yaoxin Wu
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/546888acdf5dd477333d6ebb88ff72bf-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/546888acdf5dd477333d6ebb88ff72bf-Abstract-Conference.html
institutions:
- Sun Yat-sen University
- Singapore Management University
- Eindhoven University of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Multi-Objective Traveling Salesman Problem
- Multi-Objective Capacitated Vehicle Routing Problem
- Multi-Objective Knapsack Problem
summary: GIMF fuses native node features with derived raster images using adaptive
  resolution and modality-specific bottlenecks; task-specific CNH/PMOCO variants improve
  tested multi-objective benchmarks.
code_url: https://github.com/bill-cjb/GIMF
---

# Neural Multi-Objective Combinatorial Optimization via Graph-Image Multimodal Fusion

> **TL;DR:** Rasterize a problem instance, encode its patches alongside the original nodes, and exchange information through small modality-specific bottlenecks. Adaptive image resolution helps tested size transfer. The image is derived from the existing input, not an independent observation; separate models are trained for each native problem/backbone.

## Motivation

Existing attention-based neural MOCO models process node features directly. GIMF tests whether a raster view makes spatial distributions easier to learn, and whether keeping image density similar across sizes improves extrapolation. It addresses representation and inductive bias, rather than supplying new external data or an exact optimizer (Sections1-3).

## Contributions

The framework introduces task-specific instance images, problem-size adaptive resolution (PSAR), learned coordinate-based patch positions, and fusion through separate graph/image bottleneck tokens. It is instantiated with CNH as GIMF-C and PMOCO as GIMF-P. Experiments compare native backbones, fusion mechanisms, resolution, bottleneck/patch/fusion-layer settings and roughly matched model sizes.

This is a specialist constructive framework. GIMF-C shares preferences and trained sizes within a native task; GIMF-P uses preference-conditioned decoder parameters and size-specific models. The same architecture is reused for TSP, CVRP and knapsack, but no common cross-task checkpoint is demonstrated. Multi-task native transfer is future work (Sections5-6; AppendixD).

## Methodology

For M-objective TSP, M image channels mark occupied coordinate pixels with zero against a one-valued background. CVRP maps coordinates to pixels and normalized demand to pixel values; knapsack maps its two values to coordinates and its item weight to pixel values. These are lossy quantizations of original attributes; original node features remain available. Coincident bins can merge image entries, and a raster endpoint/overwrite convention matters (Section4.1).

With square patch width w, PSAR chooses image side ceil(10*sqrt(n)/w)*w, maintaining approximately1% occupied pixels in the low-collision regime. A two-coordinate MLP generates patch positional embeddings. Defaults use16-by-16 patches, six encoder layers, three fusion layers and ten learnable bottlenecks per modality. Each stream attends to its own tokens and the other stream's bottlenecks; decoder attention reads final node and patch embeddings before selecting a masked eligible node. Bottlenecks reduce direct cross-modal all-pairs interaction, but within-stream attention remains; the paper does not prove linear total complexity (Sections4.2-4.3).

GIMF-C retains CNH's dual preference attention and size-aware decoder, with mixed-size training. GIMF-P retains PMOCO's MLP hypernetwork for preference-dependent decoder parameters. POMO-style multi-start REINFORCE trains the constructors on weighted-sum scalarized costs. Task-specific contexts/masks implement tours, remaining vehicle capacity or remaining knapsack capacity (AppendicesA-D).

## Experiments

The settings include bi-/tri-TSP20/50/100, bi-CVRP20/50/100 and bi-knapsack50/100/200. GIMF-C/CNH train across20-100 nodes, or50-200 knapsack items; other methods use size-specific training. Each model receives200epochs of100,000 random instances, batch64, Adam learning rate1e-4 except1e-5 for knapsack. Inference uses101 bi-objective or105 tri-objective weights. Tables report200-instance normalized hypervolume, gaps relative to **GIMF-C-Aug**, and solving time, with Wilcoxon rank-sum comparisons at1%. These gaps are not distances to an exact Pareto front, and test-instance significance is not training-seed uncertainty (Section5.1; AppendixE).

Both GIMF variants generally improve their corresponding backbones. For Bi-TSP100, GIMF-C HV0.7040 exceeds CNH0.7019; GIMF-P0.7006 exceeds PMOCO0.6957. Improvements do not imply superiority to every method: EMNH has better raw HV on several CVRP/knapsack cases, and WS-LKH achieves higher TSP HV. GIMF-C-Aug solves200 Bi-TSP100 cases in21minutes with HV0.7065, versus WS-LKH6hours/0.7090. Image processing increases time versus its backbone; Tri-TSP100 augmentation costs2.9hours. Training is additional (Tables1-2).

Larger-size evaluation covers Bi-TSP150/200 and KroAB100/150/200. GIMF-C at Bi-TSP200 obtains HV0.7325 versus CNH0.7292, and augmentation gives0.7362 versus0.7343; WS-LKH remains higher at0.7490. These are specified size/benchmark transfers, not arbitrary domain or constraint generalization (Table3; AppendixG).

Fusion ablations are close in distribution. On size200, full cross-attention can underperform CNH, while modality-specific bottlenecks give the best tested result. Removing PSAR materially harms the reported out-of-size result, especially for GIMF. Defaults L'=3, ten bottlenecks and patch width16 perform well in the tested sweeps; many size100 point estimates tie after rounding and the curves do not establish universal optimal hyperparameters (Figures4-8).

The model-size experiment reduces GIMF dimension to80 or increases backbone dimension to200 to obtain similar parameter counts. GIMF-C uses3.20M parameters versus CNH-L3.22M and gives higher HV at50/100 nodes, but CNH-L has the higher raw20-node value. This supports a tested architecture benefit beyond simply doubling size, not a perfectly controlled equal-compute comparison or uniform strict win (AppendixI; Table6).

## Limitations

The authors explicitly note real-world/task generalization limits, extra computation and the need for problem-specific meaningful images. PSAR's density argument is approximate and does not prove scale-invariant quality. Weighted sums and finite learned subproblems do not guarantee all unsupported/nonconvex Pareto tradeoffs or globally optimal tours. Raster images cannot preserve all node identities/continuous values, so the original graph branch remains important. Separate task/backbone training, augmentation and population of preferences remain computational requirements.

### Curator Notes

The printed one-based pixel mapping floor(W*x)+1 needs a boundary convention at x=1. The checked TSP code uses zero-based floor(W*x) and explicitly changes scaling to W-1 for single-instance KroAB evaluation. This is a relevant implementation detail, not a rerun demonstration of incorrect results. The scientific contribution is a second representation of the same input, and the article provides empirical ablations rather than a general approximation, convergence or size-generalization theorem.

## Reproducibility

- All20 pages of the [formal ICLR2025 article](https://proceedings.iclr.cc/paper_files/paper/2025/file/546888acdf5dd477333d6ebb88ff72bf-Paper-Conference.pdf) were read, including all references and scientific AppendicesA-I. Ten image-construction, architecture, results and plot pages were visually inspected. Publisher metadata verifies four authors, SYSU/SMU/TU Eindhoven affiliations and May1,2025.
- Manual publisher links identify Paper/Bibtex with no separate scientific supplement. Both notes APIs for `4sJ2FYE65U` returned403. The official141-file tree has no PDF/ZIP scientific attachment and lists16 checkpoint files under separate tasks/backbones; no explicitly missing science document was identified.
- The [official implementation](https://github.com/bill-cjb/GIMF) was inspected at `5ce8c80a53f10ce1b8aea276930c1d7e0c833d4b`. The complete README,125-line training configuration and159-line TSP environment were read, plus selected model sections1-210 and226-355 covering patch positions, weight/size input, separate bottlenecks and fusion. The full509-line model is not claimed to have been audited. No training, oracle solving or HV benchmark was rerun. 16 exact existing-paper references are registered with explicit body and bibliography evidence.
