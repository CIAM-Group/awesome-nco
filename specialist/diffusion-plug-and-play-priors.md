---
id: diffusion-plug-and-play-priors
short_title: DMPP
title: Diffusion Models as Plug-and-Play Priors
authors:
- Alexandros Graikos
- Esmeralda S. Whitammer
- Nebojsa Jojic
- Dimitris Samaras
year: 2022
date: '2022-06-17'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/5e6cec2a9520708381fe520246018e8b-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2206.09012
code_url: https://github.com/AlexGraikos/diffusion_priors
institutions:
- Stony Brook University
- Mila - Quebec AI Institute
- Microsoft Research
figure:
  path: paper-assets/diffusion-plug-and-play-priors/framework.png
  alt: Frozen diffusion-prior gradients optimize a soft TSP image before greedy tour extraction and classical2-opt.
  caption: 'Figure7: Continuous TSP image optimization, tour extraction and classical refinement.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/file/5e6cec2a9520708381fe520246018e8b-Paper-Conference.pdf
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Generative Optimization
problems:
- Traveling Salesman Problem
summary: A frozen tour-image diffusion prior optimizes a continuous adjacency raster; greedy extraction and classical2-opt
  produce Euclidean TSP tours.
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/5e6cec2a9520708381fe520246018e8b-Abstract-Conference.html
paper_type: solver
---

# Diffusion Models as Plug-and-Play Priors

> **TL;DR:** A frozen diffusion model scores noisy candidate images through input gradients. For Euclidean TSP, it optimizes a continuous adjacency-image representation using a prior trained on solved tours, then constructs a tour by greedy edge insertion and refines it with 2-opt. The TSP loss has no separate explicit tour-length guidance term.

## Motivation

A pretrained unconditional generative model and a new differentiable condition can be combined without retraining the prior. The paper formulates this as approximate inference in a product of a prior and a constraint factor, rather than assuming that every downstream condition has a separately trained conditional diffusion model. Conditional images, land-cover segmentation and TSP test different uses of that inference recipe (Sections1-5).

## Contributions

- A stochastic denoising-based objective differentiates through a frozen denoiser to optimize the candidate, with an annealed sequence of noise levels.
- Auxiliary differentiable factors can impose classifier attributes or segmentation constraints; a latent representation can also map a structured candidate into the image domain.
- TSP uses a diffusion prior trained on rasterized optimal tours, a continuous adjacency relaxation, greedy tour extraction and classical refinement.
- Experiments examine inference budgets, cross-size TSP transfer, larger raster resolutions, conditional-generation failures and land-cover domain transfer.

## Methodology

**Inference objective.** For p(x)c(x,y), a point-estimate variational approximation produces an input objective combining a DDPM denoising loss and -log c. At noise level t, the candidate eta is corrupted as sqrt(alpha_bar_t)eta+sqrt(1-alpha_bar_t)epsilon and differentiated through the fixed epsilon network. The practical denoising loss sets the usual timestep weights to one. Noise levels decrease during optimization, but the updates are candidate gradients, not standard ancestral reverse-diffusion samples or denoiser-parameter training. AppendixA also derives a Gaussian variational variant. These are approximate inference procedures; no posterior-exactness or global-optimization theorem is supplied (Sections2-3/Algorithm1/AppendixA).

**TSP encoding and training.** Points are fixed. A symmetric matrix A is represented as S+S^T, where S has zero diagonal and row-softmax entries. A differentiable rasterizer superposes weighted edge segments and fixed vertex dots into a64x64 grayscale image. Two U-Net DDPMs learn from approximately1.5million Concorde-solved tours each, with either50 vertices or a varying20-50 vertices, T=1000 diffusion steps, eight epochs and batch16; each training run takes about two days on one Tesla K80. The learned tour-image prior supplies the preference for short tours. Unlike the classifier/segmentation examples, TSP does **not** add a separate differentiable length or Hamiltonian-feasibility penalty to the denoising objective (Section5/AppendixB.4).

**Candidate optimization and decoding.** Gradients optimize the latent row-stochastic parameters through the rasterizer and frozen denoiser. The reported TSP settings use4/16/64/256 input updates, Adam beta=(0,0.9), learning rate1 to0.1 and a rescaled descending noise schedule. The relaxed matrix is neither a permutation nor a guaranteed degree-two connected tour: symmetrizing a row-stochastic matrix does not fix every row sum to two. Greedy decoding ranks edges by A_ij/distance, joins compatible path components without premature cycles, and closes the full tour. Classical2-opt then improves it. AppendixB.4 describes the refinement as uncrossing; the current release instead evaluates all candidate segment reversals for objective improvement. This release inspection does not establish which code produced the historical tables.

**Classification.** The neural component optimizes an unrounded representation before a complete feasible tour exists; it does not edit a complete incumbent tour. Ordinary2-opt postprocessing therefore leaves the neural paradigm constructive. TSP is the only native combinatorial task demonstrated. Image and segmentation priors are separately trained and do not establish one unchanged neural solver across multiple combinatorial problems.

## Experiments

**TSP protocol and references.** There are1,280 test instances each for TSP50 and TSP100. Concorde reference mean lengths are5.69 and7.759. The comparison rows for neural baselines are taken from their respective papers, including the explicit [23] attention-model citation, rather than reproduced under one hardware/decoder protocol. The baseline called2-opt uses the same extraction procedure with a uniform adjacency matrix, followed by refinement; it is not a claim that every possible initialization or strong2-opt implementation is beaten (Table2/AppendixB.4).

**Quality.** The20-50 training variant reaches mean lengths5.76/7.92 and reported gaps1.23/2.11%;50-only training gives5.76/7.93 and1.28/2.19%. Uniform-adjacency2-opt gives5.86/8.03 and2.95/3.54%. However, the Bresson-Laurent transformer row is stronger at5.71/7.88 and0.31/1.42%. Thus diffusion improves the listed simple refinement baseline and some learned baselines, not all listed approaches. The paper's beam5000 attention-model comparison quotes a2.18% TSP100 gap and similar computation, without a complete matched runtime benchmark (Table2).

**Budget ablation.** For the50-only prior,256 steps give5.763/7.930 and11.6/50.6 refinement moves. At64 steps the lengths are5.780/7.942 and moves14.3/45.7;16 steps give5.858/8.052, while four give5.851/8.031. More denoising steps help the main high-budget comparison, but quality and refinement counts are not monotone at every adjacent budget. Table2 prints2.60% beside the64-step TSP50 length5.780, versus1.28% beside5.763; this apparent objective/gap mismatch should be checked against raw per-instance records rather than silently replacing the reported gap with a ratio of rounded means.

**Larger instances.** Applying the20-50 prior to200 nodes at64x64 gives3.77% mean gap and219 refinement moves, only marginally better quality than the3.81%/115-move baseline. Increasing inference raster size to128x128 with the same fully convolutional prior gives2.59% and81 moves. FigureB.6's2.12% is one illustrated instance, not that aggregate. Higher resolution also changes denoiser cost. The additional coarse-to-fine/cropping and improved-decoder suggestions are proposed extensions, not completed experiments (AppendixB.4).

**Other applications and counterexamples.** MNIST uses ten prior-training epochs and1,000 input updates. FFHQ combines an external prior and a separately trained attribute classifier, with200 updates and an optional denoising cleanup that can remove intended attributes; FigureB.2 explicitly includes failures. Land-cover inference uses local color-cluster mutual information and weak-label distribution matching, with200 candidate updates. Table1 evaluates a separate inference U-Net trained or fine-tuned using generated segmentations, not the speed or direct quality of a single200-step optimization. Its fine-tuned accuracies are79.8/79.5/69.6 for NC/TX/AZ, but IoUs46.4/45.4/32.4 are below the implicit-posterior baseline48.4/49.5/46.0 in all three regions. AZ also loses accuracy76.2 versus69.6. The supplement details640 generated patches per target city, PA pretraining, one-epoch last-layer tuning for NC/TX and five-epoch full tuning for AZ (Sections4-5/AppendicesB.1-B.3).

## Limitations

### Discussed in the Paper

Many denoiser evaluations make inference expensive. Conflicting classifier conditions and postprocessing can produce failed conditional samples. TSP raster crowding limits transfer at200 nodes; changing resolution helps but does not remove the representation issue. All main experiments are single runs without error bars according to the checklist (Conclusion/AppendixB/checklist).

### Curator Notes

The variational objective and visual tour prior do not certify exact posterior inference, optimal tours or arbitrary-size generalization. The learned matrix alone need not encode a Hamiltonian tour. AppendixB.4's written insertion bullets omit an explicit degree guard; the released implementation maintains path endpoints in its components structure, which supplies that restriction before closure. This distinction matters when implementing from the prose alone.

Fixed raster size bounds the denoiser's input dimensions, not the whole algorithm's complexity. The current implementation materializes dense N-by-N distances, latent scores and per-edge raster buffers, sorts edges, and runs iterative classical refinement. The paper's sublinear-scaling suggestion must not be reported as an established end-to-end complexity result. Training labels are exact-solver generated and costly; the benchmark is Euclidean TSP, not general weighted routing. No numerical experiment or training run was reproduced in this audit.

## Reproducibility

- **Publication and versions:** [NeurIPS2022 proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/5e6cec2a9520708381fe520246018e8b-Abstract-Conference.html), official HTML publication date December6,2022. arXiv v1 was posted June17,2022. Current publisher HTML and author README list Esmeralda S. Whitammer, while the read publisher PDF and arXiv v1 print Nikolay Malkin; the catalogue retains the current publisher metadata with this version difference recorded.
- **Scientific coverage:** all14 publisher-PDF pages, full45-entry bibliography/checklist, and all eight pages of the publisher ZIP member `supplementary_material 2/suppl.pdf`, including AppendixA and B.1-B.4. The entire ZIP was inventoried; it also contains implementation/notebook files. The current author archive has no additional scientific PDF/archive. Key equations, main tables, figures and appendix failure/larger-instance illustrations were rendered and checked.
- **Implementation:** [AlexGraikos/diffusion_priors](https://github.com/AlexGraikos/diffusion_priors), README, archive inventory, TSP latent/raster/optimizer/decoder and refinement inspected. The checkpoint and data are externally hosted. The current256-step script uses a learning-rate scheduler with total_iters=1000 rather than the supplement's budget-rescaled schedule, and its refinement evaluates improving reversals more generally than crossing-only prose; record the exact release when reproducing.
- **Relations:** three exact current-catalogue citations: Attention Model[23], Deudon's Learning Heuristics[6] and Joshi/Laurent/Bresson's GCN[16]. The grouped body citation on page8, GNN baseline on page10 and full bibliography pages11-12 establish these identities. DDPM foundations and other absent works are not invented as local graph links.
