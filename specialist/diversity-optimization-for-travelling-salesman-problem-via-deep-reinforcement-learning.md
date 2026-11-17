---
id: diversity-optimization-for-travelling-salesman-problem-via-deep-reinforcement-learning
short_title: RF-MA3S
title: Diversity Optimization for Travelling Salesman Problem via Deep Reinforcement Learning
authors:
- Qi Li
- Zhiguang Cao
- Yining Ma
- Yaoxin Wu
- Yue-Jiao Gong
year: 2025
date: '2025-01-01'
publication:
  date: '2025-07-20'
  source_url: https://doi.org/10.1145/3690624.3709181
venue: KDD
paper_url: https://doi.org/10.1145/3690624.3709181
institutions:
- South China University of Technology
- Singapore Management University
- Massachusetts Institute of Technology
- Eindhoven University of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Multi-solution Traveling Salesman Problem
- Multi-solution Capacitated Vehicle Routing Problem
summary: A relativized coordinate encoder and five autoregressive decoders generate diverse route sets; per-instance
  parameter adaptation switches between shared and decoder-specific baselines. Quality/diversity filters and MSQI
  quantify selected trade-offs, with substantial active-search budgets and no joint cross-task checkpoint evidence.
arxiv_url: https://arxiv.org/abs/2501.00884
code_url: https://github.com/LiQisResearch/KDD--RF-MA3S
figure:
  path: paper-assets/diversity-optimization-for-travelling-salesman-problem-via-deep-reinforcement-learning/framework.png
  alt: A coordinate relativization filter and shared encoder feed five attention decoders, with shared/respective
    baseline switching during test-time parameter adaptation.
  caption: 'Original Figure 2: RF-assisted multi-attentive adaptive active search.'
  source_url: https://arxiv.org/pdf/2501.00884v1#page=3
---

# Diversity Optimization for Travelling Salesman Problem via Deep Reinforcement Learning

> **TL;DR:** RF-MA3S constructs sets of TSP/CVRP routes using five neural decoders and per-instance network-parameter adaptation. It is **specialist/constructive**: test-time active search changes the policy that constructs new routes, rather than applying a learned edit to an incumbent tour.

## Motivation

One short route may be unavailable or poorly match an unstated preference. Multi-Solution TSP(MSTSP) seeks alternative high-quality routes with different edges. This is multiple solutions for one objective, distinct from optimizing several explicit objectives. RF-MA3S targets that quality/diversity trade-off and evaluates a dedicated solution-set metric, rather than only the shortest returned tour. [Introduction/related work.](https://arxiv.org/pdf/2501.00884v1#page=1)

## Contributions

- A Relativization Filter(RF) canonicalizes centered coordinates using normalized polar radius and an angular anchor.
- Five attention decoders produce multiple candidates from a shared three-block encoder.
- Multi-Attentive Adaptive Active Search(MA3S) switches a shared best-decoder baseline to decoder-specific baselines while adapting network parameters to each test instance.
- MSQI combines route-set diversity and best-found-relative quality; experiments include MSTSPLIB, TSPLIB, CVRPLIB and nine60-POI city instances. [Framework/definitions.](https://arxiv.org/pdf/2501.00884v1#page=3)

## Methodology

### Solution-set measures

Candidates are filtered by cost relative to the best found solution(delta1), then pairwise shared-edge similarity(delta2). DI measures overlap with the known set of optima and therefore needs that set. MSQI instead combines an edge-difference score and an optimality score through harmonic means, first per solution and then across the set; a singleton receives zero diversity/SQI. Its ordinary quality reference is the set's best found length, while the city experiment explicitly uses an OR-Tools reference.

MSQI does not require a complete ground-truth optimum set, but it is not a certified absolute optimality gap. Different references and filtering thresholds affect its value, so a high score cannot independently certify proximity to the unknown optimum. Main thresholds are(.1,.8) on MSTSPLIB,(.1,.9) on TSPLIB and(.2,.8) on CVRPLIB/city tests. [Definitions3-8/AppendixB.](https://arxiv.org/pdf/2501.00884v1#page=4)

### RF and constructive policy

RF sorts coordinates, subtracts the centroid, converts to polar coordinates, normalizes radii by the maximum and subtracts a selected anchor angle, then converts back to Cartesian coordinates. A twofold swapped-coordinate augmentation handles the remaining reflection case. The evaluated transformations are translation, rotation, uniform scaling and reflection. The paper's broader affine wording should not imply invariance to arbitrary anisotropic scaling or shear, which generally changes Euclidean-TSP optima.

Five separately initialized attention decoders share an encoder and use multiple starting nodes. REINFORCE uses the best decoder's mean cost as a shared baseline, and training uses a temperature-softmax schedule instead of fixed clipping. More candidates and test-time adaptation improve the chance of finding distinct routes; no network output is an optimality certificate. [RF/decoder/training.](https://arxiv.org/pdf/2501.00884v1#page=5)

### Test-time parameter adaptation

All model parameters can be updated for each instance. Initially a shared best-decoder baseline emphasizes quality; decoder-specific baselines later retain different search tendencies. A threshold controls switching and probabilistic early stopping. Stored candidate sets are retained according to aggregate cost. This is adaptation of a route constructor, not a learned route-edit neighborhood.

The printed scalar switching expression is written as gradient divided by objective without specifying a scalar reduction. The public inference path uses the scalar negative-loss/mean-cost ratio. It switches below.005 and stops when the computed early-stop probability exceeds a uniform draw, while Algorithm1 prints the opposite comparison. These conventions need reconciliation for an exact reproduction; no formal convergence or monotonic-gradient guarantee is established. AppendixC's narrative direction of alpha also conflicts with its displayed timing/diversity table, so the numerical trade-off is stated directly below. [Algorithm1/Equations7-8.](https://arxiv.org/pdf/2501.00884v1#page=5)

## Experiments

### Training and adaptation budgets

Neural methods train for100epochs,10,000uniform instances per epoch, batch64. Hardware is RTX3090 with Corei9-10980XE. Separate training-size models20/50/100 are evaluated; the CVRP extension does not demonstrate a joint TSP/CVRP checkpoint. Main active-search learning rate is1e-5, alpha=.005, with at most2000iterations for TSPLIB/CVRPLIB. EAS receives five times the actual MA3S iteration count to account for the five decoders; LEHD uses RRC50. NGA/NMA have ten independent runs, while the neural training run is stated to occur once.

AppendixTable12 separately repeats inference ten times for RF-MA3S20 on MSTSPLIB: MSQI.7856+/- .0027, diversity.8636+/- .0028, time24.55+/-2.1761min. These are inference-run standard deviations, not ten independently trained neural models. [Setup/Table12.](https://arxiv.org/pdf/2501.00884v1#page=13)

### Multiple-route results

On25MSTSPLIB instances(9-66nodes), RF-MA3S20 has MSQI/DI gaps5.157/6.406% relative to NMA and30min versus40min. NMA remains stronger in several quality/diversity groups; RF-MA3S100 takes1hour, so a speedup is not uniform across training sizes. Fast POMO/Sym-NCO take8seconds with different solution-set quality. The selected1.3x headline is approximately40/30.

TSPLIB includes eight instances through783nodes. RF-MA3S has strong MSQI on rd400/rat783, but NMA is better on berlin52(.466 versus.428). The reported6.6min versus NMA1.7h timing covers **eil51 through lin105**, not necessarily the two largest cases. It supports the selected roughly15x comparison under that scope. [Tables1-2.](https://arxiv.org/pdf/2501.00884v1#page=7)

CVRPLIB evaluation reports27cases. RF-MA3S improves many larger-instance scores, while LEHD is stronger on several small cases, such as A-n32-k5(.685 versus.331). Aggregate times are8.1h for RF-MA3S versus9.1h EAS,3.5min LEHD and3seconds POMO. Thus the diversity-oriented active search is computationally expensive and does not dominate all neural methods in speed. Nine60-POI city cases also show better MSQI than the listed comparators, with130min versus132min EAS and much faster non-adaptive methods. These are static benchmark constructions, not online traffic-control deployment. [Tables5/7.](https://arxiv.org/pdf/2501.00884v1#page=9)

### Ablations and single-route boundary

RF alone reduces MSQI while improving DI in the progressive ablation. Augmentation adds time; five decoders, temperature and adaptation improve later combinations. Because components are added cumulatively, the figure is not a complete independent factorial attribution.

On TSPLIB, raising alpha from.005 to.05 changes MSQI.560->.267 and time6.6min->13seconds. AppendixTable9 separately shows alpha.0025->.01, diversity.751->.856, quality.900->.823 and127->24min, opposite the adjacent claim that larger alpha delays switching and increases runtime. Thresholds strongly affect the selected operating point. [Tables4/9-11.](https://arxiv.org/pdf/2501.00884v1#page=12)

The single-solution TSP100 test with200AASiterations reports rounded0.00% gap but.6day runtime. LEHD RRC500 also reports0.00% in1.4h and a displayed NeuOpt setting in2.1h. Rounded zero is not a certificate of exact recovery on every instance, and this method is primarily designed for route sets rather than the most efficient single-tour solution. [Table6.](https://arxiv.org/pdf/2501.00884v1#page=9)

## Limitations

RF incompletely handles reflections without augmentation, and the broad affine term exceeds the transformations tested. MSQI depends on reference quality, threshold selection and harmonic-mean sensitivity. Per-instance full-parameter adaptation is slow and requires gradients at inference. Neural training uncertainty is not covered by the inference repeats. Neither the adaptive loss heuristic nor a finite benchmark establishes convergence to a global/local optimum or guaranteed diverse-optimum enumeration.

The public snapshot contains TSP-named training/inference implementations and benchmark assets; it is not a complete independently verified reproduction of every CVRP/city result. No model was trained or benchmark rerun in this review.

## Reproducibility

- Formal KDD2025 DOI10.1145/3690624.3709181, pages683-694, has online publication2025-07-20. All five authors match the actual source; Gong corresponds. Affiliations are SCUT, SMU, MIT and TU/e. The arXiv abstract's shorter author count does not replace the full byline.
- **All13pages of arXiv2501.00884v1, first posted2025-01-01, were read**, including44references and complete AppendicesA-C/all extra tables. MIT identifies a final published PDF/deposit archive, but both downloads returned429; they were not registered as PDFs, counted as read or used to claim a formal byte comparison. The authorized identified arXiv copy supplies the complete reading source.
- The [official repository](https://github.com/LiQisResearch/KDD--RF-MA3S) was inventoried at SHA0f1c5f7e74cb3dbf7683fb0194b893e3d86c3997:73entries, one README, source, figures and MSTSPLIB instances/solutions; no PDF/TeX/ZIP/notebook scientific supplement and no releases. The complete README, including its dataset table, was read; the relevant adaptation path was inspected. No separate proof/appendix is promised outside the read manuscript. README dependencies are Python3.8.13, Torch2.0.0 and NumPy.
- Original complete Figure2 is cropped from PDFpage3, rectangle(45,78,566,313), at4x and actually viewed. The RF transformations, training/stopping formulas, main comparisons and all appendix diagrams/tables were rendered and inspected.
- Internal citations use explicit body references and exact full-bibliography identities. The three-author2022 Population-Based RL preprint2210.03475 is mapped to Poppy's stable formal representative through its documented primary arXiv version chain, retaining the cited preprint identity rather than projecting later authors/year backward.
