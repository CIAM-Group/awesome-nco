---
id: physics-guided-geometric-diffusion-for-macro-placement-generation
short_title: MacroDiff+
title: Physics-Guided Geometric Diffusion for Macro Placement Generation
authors:
- Jongho Yoon
- Jinsung Jeon
- Seokhyeong Kang
year: 2026
date: '2026-05-15'
publication:
  date: '2026'
  source_url: https://ijcai.org/proceedings/2026/735
venue: IJCAI
paper_url: https://ijcai.org/proceedings/2026/735
institutions:
- POSTECH Institute of Artificial Intelligence
- KAIST InnoCORE LLM
- Seoul National University
- Pohang University of Science and Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Macro Placement
- Mixed-Size Chip Placement
summary: A topology-conditioned GATv2/Transformer diffusion model generates macro coordinates with HPWL/overlap
  guidance, evaluated after classical legalization and DREAMPlace; gains and stability vary by design, with design-specific
  inference tuning and stronger analytical-placement results.
arxiv_url: https://arxiv.org/abs/2605.16451
code_url: https://github.com/jhy00n/MacroDiff-plus
figure:
  path: paper-assets/physics-guided-geometric-diffusion-for-macro-placement-generation/framework.png
  alt: MacroDiff+ heterogeneous graph denoiser, Transformer U-Net and fusion of net-centric and macro-centric noise.
  caption: Original Figure 1, cropped from the formal IJCAI paper. Net-centric predictions are projected into coordinate
    space before fusion.
  source_url: https://ijcai.org/proceedings/2026/0735.pdf
---

# Physics-Guided Geometric Diffusion for Macro Placement Generation

> **TL;DR:** MacroDiff+ generates all macro coordinates through a topology-conditioned diffusion model, then guides sampling with wirelength and overlap costs. Its mixed-size HPWL results include external legalization and DREAMPlace, and improve on many learned baselines while remaining worse than standalone DREAMPlace in every reported circuit.

## Motivation

Sequential macro placement can propagate early decisions, while unconstrained coordinate generation can overlook connectivity or create overlaps. MacroDiff+ combines graph-based netlist information with global geometric modeling and inference-time physical costs. HPWL is the optimization proxy; the reported experiments do not measure a complete routed chip's timing, power or manufacturing feasibility. [formal pp. 1–3]

## Contributions

- A dual-branch denoiser combines heterogeneous graph attention with a Transformer U-Net conditioned on macro dimensions.
- A wirelength Jacobian maps learned net-level predictions into coordinate changes before fusion with macro-level predicted noise.
- Clean-space HPWL/overlap guidance refines intermediate predictions. Eight-circuit comparisons and bigblue3 ablations examine final wirelength, legalization displacement and variability. These are empirical methods and findings, not a hard-feasibility or global-optimality theorem. [formal pp. 3–7]

## Methodology

A heterogeneous graph contains macro and net nodes connected by pin-level edges. Static inputs include macro dimensions, chip size, net degree and pin offsets; noisy positions and per-net wirelength change through denoising. GATv2 message passing updates both node types using timestep information. The Transformer takes macro embeddings, applies self-attention for geometric context and cross-attention to size features, and predicts macro-coordinate noise. Its input already contains graph-derived embeddings, so this branch within the full model is not wholly independent of topology. [formal pp. 3–4; arXiv p. 9, Appendix B]

Net-node predictions represent connection importance rather than coordinate displacements. Equation 7 multiplies them by a transposed per-net wirelength Jacobian and adds the macro-centric prediction using two scalar weights. Training minimizes noise-prediction MSE against DREAMPlace-generated reference layouts. [formal pp. 2–4]

At inference, the network estimates a clean placement from the current noisy state. Several gradient steps minimize a weighted HPWL/overlap objective in that clean space; a two-phase schedule reduces HPWL emphasis after a plateau to concentrate on overlap removal. The adjusted clean estimate guides the next reverse-diffusion step. The algorithm starts from Gaussian noise rather than an incumbent feasible placement. The evaluation subsequently legalizes macros, runs DREAMPlace for standard cells with macros fixed, and performs final legalization. [formal pp. 4–5, Eqs. 8–12, Algorithm 1]

**Classification: Specialist / constructive.** A model generates macro placements for multiple circuit designs within one native optimization task. The released inference script loads one checkpoint before looping through the designs, but cross-netlist sharing does not demonstrate one neural solver across distinct native problems. The physical gradient steps and downstream classical legalizers do not constitute a separate learned incumbent-improvement policy. [formal pp. 3–5; repository test.py]

## Experiments

Training data comprises 1,000 degree-preserving rewired netlists for each of eight ISPD2005-derived MMS designs, giving 8,000 augmented samples, each labeled with a DREAMPlace reference placement. Thus evaluation on these eight parent designs is not a demonstrated leave-one-design-out or unseen-design-family test. Appendix D lists 32–959 macros, alongside fixed I/O pads; the much larger underlying standard-cell problem is handled downstream by DREAMPlace. [formal p. 5; arXiv p. 9]

The paper reports ten runs on an AMD EPYC 7513 CPU and RTX A6000, with Ubuntu 18.04, Python 3.8.10 and PyTorch 1.8.1. Tables give mean ± standard deviation and best values. Guidance is explicitly design-tuned: 300–700 inner steps, learning rates 0.005–0.05 and printed plateau thresholds 0.05–0.5. Complete neural training duration and optimizer settings are not specified by the paper's hyperparameter table. Repository defaults separately supply a training recipe, rather than proof of the historical run configuration. [formal p. 5; arXiv p. 9, Tables 5–6]

Table 1 reports final mixed-size HPWL after the full pipeline. MacroDiff+ beats MaskPlace and WireMask on all six circuits where they finish; both baselines have timeouts on bigblue2 and bigblue4. On adaptec2, its 81.6 ± 2.6 contrasts with ChipDiffusion's 96.0 ± 20.9, showing substantially lower observed spread. It does not beat ChipDiffusion on every mean: bigblue1 is 87.3 versus 87.2, and bigblue2 is 139.5 versus 134.9. DREAMPlace alone is lower on all eight designs, for example 64.7 versus 69.1 on adaptec1. Its empirical reference quality is not a certified optimization bound. [formal p. 6]

The bigblue3 architecture ablation reports displacement 8.7 for the full model versus 18.3 without the GNN and 17.0 without the Transformer, in units of 1e3. Removing net-centric noise slightly improves HPWL, 297.7 versus 299.3, while increasing displacement to 11.8. Guidance ablations worsen displacement and wirelength, but establish the measured tradeoff on this one circuit rather than universal necessity of every component. The HPWL unit printed in ablation captions differs from Table 1 despite repeating the full-model numeric value. [formal p. 7, Tables 2–3]

Appendix E reports macro-generation inference times of 30.4–90.9 seconds, versus ChipDiffusion's 140.4–17,274.2 seconds; it attributes the latter's large cases largely to built-in legalization. DREAMPlace is faster on six of eight designs. These timings are labeled macro placement generation, not complete dataset construction, training and downstream mixed-size implementation cost. [arXiv p. 9, Table 7]

## Limitations

Finite gradient optimization of soft overlap penalties does not itself prove that every generated sample is non-overlapping. The explicit external legalization stage and nonzero legalization displacement are essential qualifications to the paper's strong physical-validity language. The model generates coordinates for fixed macro dimensions; the method does not supply a learned orientation policy despite discussing orientation in the general problem motivation. Routing/timing quality and out-of-family transfer remain outside the presented evidence. [formal pp. 1, 3–7]

The headline average reductions require clarification of aggregation. Curator arithmetic from rounded Table 1 means gives approximately 9.97% and 9.46% mean per-design reductions against MaskPlace and WireMask over their six finite comparisons, and 3.15% against ChipDiffusion over eight. Ratios of summed means also do not reproduce the printed 6.1%, 6.2% and 1.2%. This identifies an unspecified reporting convention, not a new benchmark result. The adaptec2 ratio 20.9/2.6 is about eight for standard deviation; the poster's phrase about eightfold variance should not be adopted as a variance calculation.

The available code further limits exact protocol reproduction. It uses a reduced DDIM sampling schedule, applies Adam guidance and clamps positions. Although test.py assigns design-specific thresholds, apply_guidance does not read that attribute and instead switches after a fixed improvement threshold of 1e-5 following fifty burn-in iterations. This static-code observation concerns the inspected commit, not proof that every historical experiment used it. The available checkpoint and evaluation tensors were inventoried and hashed without deserializing or executing them.

## Reproducibility

The formal paper is IJCAI 2026's AI4Tech special track, pp. 6609–6616, DOI 10.24963/ijcai.2026/735. Publisher BibTeX gives August while Crossref gives September, so publication date is retained at year precision, 2026. The separate arXiv date is its actual v1, 2026-05-15; the complete scientific reading version is v2, revised 2026-05-31. The three authors and four byline affiliations were checked; the contribution statement records equal first authorship and Jeon's research while at UC San Diego.

All eight formal pages, ten arXiv pages including Appendices A–F, eight POSTECH laboratory camera-copy pages and the one-page laboratory poster were read. The publisher's links, arXiv history, laboratory attachments and complete official repository were manually inventoried. The formal/camera copies omit the explicitly referenced appendices, which the arXiv version supplies in full. No additional scientific PDF, video or nested archive was identified in the repository. The framework, fusion, sampling algorithm, every result table, complete appendix figures and poster were rendered and inspected.

The [official implementation](https://github.com/jhy00n/MacroDiff-plus) was checked at commit c28ef15bc9ebba6c80eedaf482beb322a7ede4b1, dated 2026-08-11. Its archive contains 36 files including model/training/inference code, one checkpoint, two evaluation tensors and design-index maps. Raw MMS/ISPD2005 benchmarks and training data are not bundled. README defaults specify 1,000 epochs, batch eight and learning rate 1e-4; the Dockerfile uses PyTorch 2.1.2/CUDA 11.8, differing from the paper's environment. Training/inference and core model/guidance paths were inspected, and the arithmetic/static checks are saved with hashes and actual reading logs. No neural training, checkpoint loading or chip-placement benchmark was run.
