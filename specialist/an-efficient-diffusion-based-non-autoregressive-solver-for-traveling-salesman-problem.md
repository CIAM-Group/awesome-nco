---
id: an-efficient-diffusion-based-non-autoregressive-solver-for-traveling-salesman-problem
short_title: DEITSP
title: An Efficient Diffusion-based Non-Autoregressive Solver for Traveling Salesman Problem
authors:
- Mingzhao Wang
- You Zhou
- Zhiguang Cao
- Yubin Xiao
- Xuan Wu
- Wei Pang
- Yuan Jiang
- Hui Yang
- Peng Zhao
- Yuanshu Li
year: 2025
date: '2025-01-23'
publication:
  date: '2025-07-20'
  source_url: https://doi.org/10.1145/3690624.3709343
venue: KDD
paper_url: https://doi.org/10.1145/3690624.3709343
institutions:
- Jilin University
- Singapore Management University
- Heriot-Watt University
- Nanyang Technological University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: A dual-modality graph transformer predicts TSP edge heatmaps with one-step denoising, repeatedly re-noises
  predictions and decodes accumulated candidates with greedy merging and classical 2-opt. Separate Euclidean-TSP
  models trade iteration budget for quality; the released trainer omits the manuscript self-consistency terms.
arxiv_url: https://arxiv.org/abs/2501.13767
code_url: https://github.com/DEITSP/DEITSP
figure:
  path: paper-assets/an-efficient-diffusion-based-non-autoregressive-solver-for-traveling-salesman-problem/framework.png
  alt: Node coordinates, noisy edge adjacency and time embeddings enter dual-modality node/edge attention mixing
    before edge classification.
  caption: 'Original Figure 2: the dual-modality graph-transformer denoiser.'
  source_url: https://arxiv.org/pdf/2501.13767v1#page=5
---

# An Efficient Diffusion-based Non-Autoregressive Solver for Traveling Salesman Problem

> **TL;DR:** DEITSP predicts edge heatmaps non-autoregressively, explores several noise levels and constructs tours with greedy decoding plus classical2-opt. It is **specialist/constructive**. One-step denoising is one network call, while the main quality results use repeated calls and postprocessing.

## Motivation

Autoregressive route generation requires sequential node choices, while earlier parallel heatmap solvers often sacrifice quality or use long diffusion chains. DEITSP aims to retain a parallel denoiser and reuse predictions from several noise levels efficiently. The actual task is two-dimensional Euclidean TSP; different sizes, country-map samples and TSPLIB transfer are not different native problems or evidence of generalist learning. [Introduction/related work.](https://arxiv.org/pdf/2501.13767v1#page=2)

## Contributions

- A controlled binary diffusion process and proposed self-consistency-enhanced supervised loss target direct clean-adjacency prediction.
- A six-layer dual-modality graph Transformer mixes node attention and noisy edge features independently in each branch.
- An iterative exploration strategy retains predictions across noise levels rather than discarding all intermediate clean estimates.
- A decreasing inverse-function schedule allocates more calls to low-noise states, with1/4/16-step and component comparisons. [Algorithms1-2.](https://arxiv.org/pdf/2501.13767v1#page=4)

## Methodology

### Denoising and training

A binary adjacency encodes the target tour. The forward process flips edge states under a linear beta schedule1e-4->.02 over1000 noise levels. A denoiser conditioned on coordinates, adjacency and time predicts a clean edge distribution. The manuscript loss uses two ground-truth cross-entropies at levels t and t+20 plus an L2 consistency term between the outputs. This is supervised learning from Concorde solutions, not an optimality guarantee for unseen instances.

Six dual-modal layers use hidden width256 and8 attention heads. Edge features modulate node attention; attention-derived scores also update edge features through a separately parameterized mixing path and time embedding. Classification yields an edge heatmap whose independent probabilities alone do not ensure tour feasibility. [Equations2-11/Figure2.](https://arxiv.org/pdf/2501.13767v1#page=5)

### Candidate construction and classical refinement

Inference begins with a random noisy adjacency, predicts a heatmap, perturbs the prediction at the next scheduled level, and repeats. The conceptual Algorithm2 keeps all predicted heatmaps. Greedy merging sorts edges by symmetric heatmap score divided by Euclidean distance, inserts compatible edges and forms feasible tours; default experiments then apply classical2-opt. The best candidate is returned.

The changing object is a noisy adjacency/heatmap, not a feasible incumbent tour passed to a learned k-opt editor. Repeated latent/heatmap denoising and classical2-opt therefore do not create a separate neural improvement stage under this catalogue's definition. Retaining the best decoded candidate does not imply each individual denoising prediction monotonically improves.

The inverse schedule rescales f(c)=1/c over c in[.25,1.5], concentrating more evaluations near low noise. It is a heuristic empirical schedule, not a certified search-space contraction or convergence theorem. [Algorithm2/AppendicesA-B.](https://arxiv.org/pdf/2501.13767v1#page=6)

### Available implementation

The official snapshot's training_step uses **one noisy sample and one cross-entropy loss**; it does not contain the second supervised output or L2 consistency term printed in Equation3. Its sampler retains intermediate predictions, and the evaluator explicitly performs greedy merging and2-opt. These are concrete manuscript/release boundaries for the described core features. No training or table reproduction was rerun, and this inspection does not identify the exact unreleased configuration used for every table.

## Experiments

### Scope and budget

Training uses separate TSP20/50/100 datasets with exact labels. Tests include the corresponding standard small instances,128 each at200/500/1000 nodes using the100-node model,100-node subsamples from country maps, and26TSPLIB cases of size51-200. Country labels such as USA13509 identify the source map; those tests do **not** solve the full13,509-node tour.

The stated machine is a Xeon Gold6254 with RTX3090. The paper fixes the same neural batch size across compared methods and otherwise follows their defaults; starred results are taken from original papers and daggers denote TSP50 weights reused for20/50 tests. Exact training dataset counts, epochs, wall time, numeric batch size and repeated-seed uncertainty are not comprehensively specified in the manuscript. The README's TSP20 example supplies batch128,50epochs and learning rate2e-4, as an example rather than a documented universal table budget. Table times are total evaluation runtime. [Setup/Table1.](https://arxiv.org/pdf/2501.13767v1#page=7)

### Quality/time trade-off

On TSP100,1/4/16 iterations give gaps.63/.21/.10% in30.82s/1.13min/3.99min. DIFUSCO gives.23% in9.47min and T2TCO.13% in26.46min. Thus the16-step version improves these particular comparisons. POMO/Pointerformer can be faster at other quality points; no single DEITSP configuration dominates every comparator in time and quality.

With100-node training,200/500-node16-step gaps are.40/2.15%, but on1000nodes Att-GCN gives **3.22% in12.47min**, versus DEITSP16 **3.68% in41.83min**. The text's broad inference-efficiency discussion must be bounded by this displayed counterexample. DEITSP1 is faster(3.77min) with worse4.41% gap. [Complete Tables1-2.](https://arxiv.org/pdf/2501.13767v1#page=7)

Country-map tests show16-step gaps.85%(Japan),2.30%(Burma) and1.89%(USA). ELG is better on Burma at1.55%, so the result is not uniformly best on all countries. On26TSPLIB cases, Table3 reports cost31,711.94 and aggregate length-relative gap.78%; AppendixTable6 separately gives mean per-case gap.832%. Those aggregations are not interchangeable. Individual cases can favor another method or fewer iterations; for example eil51's4-step cost429.484 is shorter than its16-step433.443. [Table3/complete AppendixC.](https://arxiv.org/pdf/2501.13767v1#page=12)

The50-node component ablation substitutes an anisotropic GNN for the dual-modal network or DDIM-style sampling for efficient iteration. The full method usually obtains a better quality/time frontier across the shown budgets; inverse scheduling is empirically favorable. These finite experiments do not prove that every increased iteration budget improves every instance. [Table4/Figure4.](https://arxiv.org/pdf/2501.13767v1#page=9)

## Limitations

Exact supervised labels become expensive at very large training sizes. The scope omits capacity, time windows, asymmetric costs and dynamic routing. Total gains combine learned heatmaps with classical greedy/2-opt processing; they cannot be attributed to a standalone one-call network. Heterogeneous baseline configurations, absent seed intervals and manuscript/release loss differences restrict strong comparative and reproduction claims. The use of the phrase optimal prediction describes the training target, not a verified optimum certificate.

## Reproducibility

- Formal KDD2025 DOI10.1145/3690624.3709343, pages1469-1480, has publisher-deposited online publication2025-07-20. Ten-author formal metadata matches the read source. YouZhou, YuanJiang and HuiYang correspond; affiliations are Jilin, SMU, Heriot-Watt and NTU.
- **All12pages of arXiv2501.13767v1, posted2025-01-23, were fully read**, including all58references, all26case rows and complete AppendicesA-E. This identified authorized reading source is not a claim of reading an unobtained publisher PDF.
- The [official repository](https://github.com/DEITSP/DEITSP) was manually inventoried at master SHA d6f128b6d94835f6da8eec2a4d55a540af32aeb2:23entries, two READMEs and no scientific PDF/TeX/ZIP/notebook. Both READMEs were read. Releasev1.0.0 has no attached assets. The author-linked public Drive folder contains three size-specific58.3MB checkpoints(tsp20/50/100), with no extra scientific document named there. No external scientific proof is promised by the paper.
- Dependencies include Python3.7.16, Torch1.12.1, Lightning1.7.7 and Cython0.29.33; heatmap merging requires the provided Cython extension. Core training, sampling and decode/postprocess paths were inspected only for the claims above. Data/checkpoint presence is not an end-to-end reproduction.
- Complete original Figure2 is cropped from PDFpage5, rectangle(329,74,562,356), at5x and actually viewed. Algorithms, network/formulas, main tables and all scientific appendix figures/tables were rendered and visually inspected.
- The printed MDAM[25]/LCP[56] body labels are transposed relative to their full bibliography: reference25 is LCP, reference56 is MDAM. Both clearly cited works receive identity-qualified edges without swapping their method descriptions. BQ-NCO appears with an unresolved[?]and no matching reference in the full bibliography, so no unsupported BQ edge is forced. Other unmatched preprints are not mapped to independent journal extensions.
