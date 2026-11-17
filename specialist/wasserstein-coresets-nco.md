---
id: wasserstein-coresets-nco
short_title: Wasserstein Coresets
title: Efficient and Robust Neural Combinatorial Optimization via Wasserstein-Based Coresets
authors:
- Xu Wang
- Fuyou Miao
- Wenjie Liu
- Yan Xiong
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/b629d824041acb94837bf4249723bd40-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/b629d824041acb94837bf4249723bd40-Abstract-Conference.html
institutions:
- University of Science and Technology of China
- Hefei National Laboratory
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Maximum Independent Set
summary: Rigid-Wasserstein diversity subsets reduce training data for task-specific neural solvers; optional test-input alignment improves some shifted settings, with conditional coreset theory and explicit preprocessing costs.
code_url: https://github.com/little-worm/coreset_CO_ICLR2025
figure:
  path: paper-assets/wasserstein-coresets-nco/framework.png
  alt: A training dataset is compressed to a coreset; its tree supports optional test-instance alignment before a separately trained neural solver.
  caption: 'Figure 3: Coreset training and optional test-input alignment.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=7
---
# Efficient and Robust Neural Combinatorial Optimization via Wasserstein-Based Coresets

> **TL;DR:** Select geometrically diverse training instances, train an existing neural solver on that subset, and optionally align test inputs to the subset's tree. The work studies **training-data efficiency**, with DIFUSCO for TSP/MIS and LEHD for CVRP. Coresets often improve over equally sized uniform subsets, but do not uniformly match full-data training or improve every distribution, and alignment has a measurable cost.

## Motivation

Large supervised NCO datasets cost storage, label generation and training time. A uniformly sampled small subset can omit useful variation, especially under distribution shift. The proposed framework represents instances as probability measures and uses a distance invariant to rigid motion to retain diverse examples. It is a wrapper around separately trained solvers, rather than a new shared network for every problem. [Sections 1-3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=4)

## Contributions

- A rigid-Wasserstein distance, RWD, for comparing point-measure representations of optimization instances.
- A hierarchical Gonzalez-style coreset with a tree reusable for inference alignment.
- A merge-and-reduce construction enabling parallel subsets and a conditional weighted-loss coreset theorem.
- TSP experiments on compressed Gaussian-mixture/uniform datasets, larger sizes and TSPLIB; appendix studies of MIS and CVRP, including preprocessing/labeling costs, alignment and graph-embedding variants. [Sections 3-4/Appendices B-F.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=7)

## Methodology

### Instance distance and subset construction

A Euclidean instance is represented directly by its node coordinates; a general graph first needs an embedding, such as force-directed, spectral or MDS coordinates. The formal presentation uses equal node masses. RWD jointly minimizes squared transport cost over a coupling and a Euclidean rigid transformation, then takes the square root. Translation/rotation/reflection-equivalent measures have distance zero: this is a pseudometric on raw measures, or a metric after quotienting by those equivalences. Approximate graph embeddings need not preserve every graph distinction or optimization objective. [Definitions 2.1-2.3/Section 3.1.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=3)

Each tree node selects up to 2^(2*ddim) far-apart centers, assigns instances to clusters, removes a radius-r ball around each center, and recursively handles the remaining buffer. Centers represent ball masses in the **weighted theoretical coreset**. With dataset radius R and the assumed doubling dimension, the stated size is O((R/r)^(2*ddim)); these bounds can be large when dimension or precision is unfavorable. Experiments set ddim=1 without proving the dataset has that dimension. [Algorithms 1-2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=5)

Merge-and-reduce compresses chunks in parallel and merges their summaries, with radius r/H per level so errors accumulate to at most r. Parallel depth retains logarithmic dependence on dataset size, assumes sufficient workers, and does not make total work or reading all input data independent of dataset size. The paper's informal dataset-independence wording is therefore qualified. [Section 3.3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=6)

### What the theorem establishes

Theorem3.3 assumes a uniform L-Lipschitz nonnegative loss in RWD and a **strictly positive loss lower bound gamma for all model parameters**. With mass-preserving representative weights and radius r=epsilon*gamma/L, replacement changes the original weighted loss by at most Lr, yielding a relative-error coreset. The induction and weighted error summation are in AppendixC. This proves conditional objective representation, not neural training convergence, solution approximation to the optimum or robustness to arbitrary unseen distributions. [Theorem3.3/complete proof.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=18)

Crucially, the empirical framework **sets every selected instance's weight to 1/|S| to emphasize diversity**, rather than retaining ball masses. Thus its experimental training distribution is not automatically the mass-weighted object in the theorem. Neither the required uniform L/gamma nor the assumed low doubling dimension is verified for all tested neural losses. [Section3.4.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=7)

### Alignment, solver and taxonomy

RWD is estimated by alternating optimal transport with translation and orthogonal Procrustes updates for a fixed iteration budget; this is a heuristic, not a certificate of the globally best joint alignment. Test alignment greedily follows a closest-child tree path and retains a promising center/transformation. It is optional and does not change network parameters. Rigid transformations preserve Euclidean distances, whereas arbitrary scale changes are not part of this invariance. [Algorithms3-4.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=17)

DIFUSCO supplies TSP/MIS predictions; TSP greedy decoding is evaluated both with and without classical2-opt. CVRP uses a separately trained LEHD and separately reports optional RRC budgets0/50/100/200/500. **Specialist / constructive** is retained for the proposed coreset-and-input-alignment mechanism: the paper does not introduce a neural incumbent-edit operator, and borrowed host refinement is reported as its own protocol. Distinct tasks use distinct solvers/checkpoints; a common data-selection framework does not demonstrate a single cross-task generalist model.

## Experiments

### Data and resource accounting

The main TSP training set has128,000 instances:125,000 from N(0,1) plus3,000 uniform examples. Coordinates are reduced modulo10. Shifted tests use Gaussian variances4/16/64 and U(0,10); these are wrapped coordinate distributions, and the nominal Gaussian training set already contains a uniform component. TSP100 tests have1,280 instances; larger sizes have128. TSP-3D is **planar2D data with a zero third coordinate followed by random rotation**, rather than a volumetric3D benchmark. [Section4/AppendixD.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=9)

DIFUSCO is trained20 epochs, learning rate.0002, batch64, and uses50 reverse-diffusion steps at inference. TSP labels come from LKH-3; MIS labels from KaMIS2. TSP/MIS use an NVIDIA L20, while CVRP uses an RTX3090 and20-epoch LEHD training. Equal epochs on different subset sizes entail different numbers of training updates. Labeling cost is part of the claimed resource saving, and heuristic labels are not certified optima. [AppendicesD-F.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=19)

For the Gaussian-mixture2D TSP setting, Table4 lists total full-data cost33,272 versus2,567 for a4,003-example coreset:145 labeling +691 coreset construction +1,731 training. The equally sized uniform subset costs2,041 and is faster than coreset selection. These are the paper's reported time units; the subset method trades preprocessing for better selected-data coverage, rather than beating uniform sampling in every cost category. For MIS3,973, total costs are119,362 full-data,9,497 coreset and4,910 uniform; labeling dominates much of the full-data difference. [Tables4/18.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=29)

### TSP: matched-subset gains and full-data limits

| Protocol | Coreset versus matched uniform subset | Relevant full-data reference |
| --- | --- | --- |
| TSP100,4,003 examples, U(0,10), greedy |94.73 versus119.78 | Full128k model89.29, better than both. |
| TSP100,12,951 examples, nominal N(0,1), greedy |21.57 versus21.99 | Full-data20.39. |
| TSP1000,12,951 examples, N(0,16), greedy |252.92 versus382.77 | Full-data281.64: coreset transfers better in this row. |
| Uniform-trained TSP100,8,245 examples, greedy |93.12 versus92.66 | Uniform sampling is slightly better here. |

On TSPLIB, the nominal-Gaussian coreset12,951 gives133.63 greedy/112.45 after2-opt, versus uniform162.19/114.31; the full-data model remains129.35/112.23. The paper does not enumerate enough benchmark-selection details to infer universal TSPLIB coverage from these aggregates. [Tables5-7/13-15.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=22)

Alignment is not uniformly beneficial. In planar3D TSP200 at the nominal unshifted distribution,12,058-example coreset length32.72 becomes33.25 after alignment, versus uniform32.30 and full-data30.02. On shifted3D TSP1000/U(0,10), coreset441.82 becomes383.92, better than random alignment429.90, but the full-data model is313.23. The alignment column adds980 to about2,819 inference time in this setting; it is not included as zero-cost preprocessing. [Tables9-11.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=24)

### MIS and CVRP: separate tasks and mixed cases

MIS trains on128,000 Erdos-Renyi graphs with90-100 nodes and edge probability.15. The main appendix table actually reports400-500 and700-800-node transfer, while surrounding prose names900-1000; the note uses the displayed table scope. A separate embedding table includes1,400-1,500 nodes. At12,417 examples on ER700-800, coreset sampling size35.59 improves uniform34.25, but full-data40.06 is stronger. At8,001 examples on the original size, coreset20.25 greedy/22.27 sampling is slightly worse than uniform20.38/22.33. SATLIB differences are mixed, and its table changes sample labels and average-size scale across rows; those aggregates are not silently reconciled. The embedding comparison uses unequal coreset sizes, so it does not isolate embedding quality at equal data budget. [Tables18-20/27.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=35)

CVRP100 training uses128k wrapped-coordinate instances and tests100/200/500/1000 plus CVRPLIB. Gaussian coordinates have variance.01, and the uniform alternative uses U(0,1). On Gaussian-trained CVRP100 at12,175 examples and RRC500, coreset16.58 improves uniform16.63, while full-data16.18 remains better. CVRPLIB at8,082 examples and RRC100 instead favors uniform796.05 over coreset829.60. Uniform-trained CVRP100 at7,694 examples also slightly favors uniform after RRC100-500. Negative gaps are against the provided LKH/reference baseline, not proof of surpassing an optimum. [Tables21-26.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=32)

## Limitations

### Discussed in the Paper

Coreset construction can itself be expensive; it can be reused across models/hyperparameters. Alignment is optional. Extending the framework to more graph-structured settings is future work. [Remarks3.4-3.5/conclusion.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b629d824041acb94837bf4249723bd40-Paper-Conference.pdf#page=10)

### Curator Notes

- Uniform empirical coreset weights, approximate RWD and unknown doubling/Lipschitz constants separate implemented experiments from the weighted exact theorem.
- Planar3D, a specific Gaussian/uniform mixture and a few graph families do not establish robustness to arbitrary shifts or graphs.
- Full-data baselines and several uniform-sampling/alignment counterexamples limit blanket superiority statements; independent training-seed uncertainty is not reported.
- Table8 prints total1,379 for components159+1,012+2,080, whose sum is3,251. CVRP tables also contain blank/suspicious runtime entries and length/gap inconsistencies. These are preserved as source inconsistencies; no corrected benchmark or speedup is invented.
- Source code uses squared transport costs and determinant-corrected rotations, rather than transparently implementing every exact reflected RWD/metric assumption. The published/released TSP tree uses argmax when assigning remaining nodes to child clusters, differing from the nearest-cluster construction in the text. Theoretical size/error guarantees are not assumed to survive these implementation choices unchanged.

## Reproducibility

- **Full reading:** all35 official ICLR pages, including complete bibliography, all algorithms/proofs, scientific AppendicesA-F and all27 tables. Framework, proof/weight assumptions and representative complete TSP/MIS/CVRP tables were visually inspected.
- **Metadata:** four authors and USTC/Hefei National Laboratory affiliations match the title page. The official proceedings HTML explicitly supplies `citation_publication_date=2025-05-01`, supporting the retained publication day; no generic notification date is substituted for acceptance.
- **Official supplement:** actual58,594,072-byte ZIP manually inventoried,694 members; no PDF/TeX/notebook scientific appendix. Its bundled Concorde tgz was also inventoried,200 members with no PDF/TeX/notebook. Two PNGs and both60-frame GIFs were visually read in full; they are bundled upstream DIFUSCO/Concorde demonstrations, not extra coreset experiments. Published coreset/RWD code and setup instructions were inspected.
- **Public code:**592-entry author tree inspected; the sole notebook is empty. Read the task READMEs and selected complete RWD, TSP tree/alignment/selection, MIS embedding and CVRP generation functions. POT `ot.emd` and squared costs, proper-rotation determinant correction, unweighted subset outputs and task-specific demand masses in CVRP are implementation details distinct from the simple formal equal-mass presentation. Several scripts retain machine-specific paths and multiple old/current variants; no full benchmark rerun is claimed.
- **Figure:** original complete Figure3/page7 cropped from the proceedings PDF, showing subset training and optional test-input alignment.
