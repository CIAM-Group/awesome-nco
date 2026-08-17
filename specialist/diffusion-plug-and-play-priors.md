---
id: diffusion-plug-and-play-priors
short_title: DMPP
title: 'Diffusion Models as Plug-and-Play Priors'
authors: [Alexandros Graikos, Nikolay Malkin, Nebojsa Jojic, Dimitris Samaras]
year: 2022
date: 2022-06-17
acceptance:
  date: "2022-09-14"
  source_url: "https://neurips.cc/Conferences/2022/CallForPapers"
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/5e6cec2a9520708381fe520246018e8b-Abstract.html
arxiv_url: https://arxiv.org/abs/2206.09012
code_url: https://github.com/AlexGraikos/diffusion_priors
institutions: [Stony Brook University, Mila - Quebec AI Institute, Microsoft Research]
figure:
  path: paper-assets/diffusion-plug-and-play-priors/framework.png
  alt: Denoising sequence that optimizes a latent TSP adjacency image and extracts and refines a tour.
  caption: 'Figure 7: Procedure for solving Euclidean TSP with a denoising diffusion prior.'
  source_url: https://arxiv.org/pdf/2206.09012
scope: specialist
paradigm: constructive
problem_families: [Routing, Generative Optimization]
problems: [Traveling Salesman Problem]
summary: DMPP treats an unconditional diffusion model as a prior and optimizes noisy tour representations against a differentiable TSP constraint.
---

# Diffusion Models as Plug-and-Play Priors

> **TL;DR:** For TSP, DMPP repeatedly denoises soft adjacency representations while differentiable tour-cost guidance steers samples toward short valid tours.

## Motivation

A generative model captures a data manifold, while a new task may be expressible only as an external differentiable constraint. Plug-and-play inference aims to combine the two without retraining the diffusion prior.

## Contributions

- Develops inference algorithms that differentiate constraints through a frozen denoising model.
- Applies the framework to conditional images, segmentation, and TSP.
- Introduces repeated noisy fitness evaluation as a combinatorial search mechanism.

## Methodology

1. Train a diffusion prior over soft TSP tour representations. 2. sample a noisy representation. 3. alternate denoising with gradients from length and feasibility constraints. 4. discretize and optionally refine candidate tours; retain the best sample.

## Experiments

- **Problems:** TSP is the combinatorial case, alongside non-CO image tasks.
- **Scale and budget:** The TSP study uses the paper's trained graph size and many denoising/guidance evaluations per candidate.
- **Baselines:** Neural TSP models and unguided/ablated diffusion inference.
- **Metrics:** Tour length/gap and sample quality.
- **Main finding:** Constraint guidance turns the frozen prior into a workable TSP search process, but it is far more iterative than a single autoregressive pass.

## Limitations

### Reported by the Authors

- Inference is approximate and requires differentiable constraints and many denoiser calls.

### Curator Notes

- The paper is broader than NCO; its TSP experiment should not be read as a universal diffusion routing solver.

## Reproducibility

- **Official implementation:** [AlexGraikos/diffusion_priors](https://github.com/AlexGraikos/diffusion_priors)
- **Checkpoints:** See the repository.
- **Main paper references:** Plug-and-play algorithms and the TSP experiment/figure.
