---
id: learning-to-solve-travelling-salesman-problem-with-hardness-adaptive-curriculum
short_title: TSP-HAC
title: Learning to Solve Travelling Salesman Problem with Hardness-Adaptive Curriculum
authors:
- Zeyang Zhang
- Ziwei Zhang
- Xin Wang
- Wenwu Zhu
year: 2022
date: '2022-04-07'
publication:
  date: '2022-06-28'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/20899
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/20899
institutions:
- Tsinghua University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Travelling Salesman Problem
summary: A solver-relative hardness surrogate drives coordinate perturbations and curriculum weighting during training
  of an attention-based TSP constructor. Experiments address distribution shift on TSP50; input generation and parameter
  training do not form a neural incumbent-tour improvement solver.
arxiv_url: https://arxiv.org/abs/2204.03236
code_url: https://github.com/wondergo2017/TSP-HAC
figure:
  path: paper-assets/learning-to-solve-travelling-salesman-problem-with-hardness-adaptive-curriculum/framework.png
  alt: Hardness-adaptive coordinate generation uses a surrogate and current model; curriculum weights then train
    the autoregressive TSP solver.
  caption: 'Original Figure 2: hardness-adaptive generator and curriculum learner.'
  source_url: https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=5
---

# TSP-HAC: Learning to Solve Travelling Salesman Problem with Hardness-Adaptive Curriculum

> **TL;DR:** TSP-HAC changes the training instances and their weights to improve an attention-based TSP constructor under geometric distribution shift. It is **specialist/constructive**: the evaluated solver constructs tours sequentially, while hardness adaptation modifies training inputs and network parameters, rather than editing a complete incumbent tour at inference.

## Motivation

A small gap on uniformly sampled coordinates does not establish that a neural TSP solver transfers to clustered layouts. The paper evaluates this shift at fixed problem size and proposes generating instances that expose the current solver's weaknesses. Hardness is explicitly solver-relative and changes during learning; it is distinct from an instance-independent computational-complexity classification. [Motivation and related work.](https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=1)

## Contributions

- A self-improvement surrogate estimates how much better another feasible solver could perform without requiring exact labels during generation.
- Coordinate-gradient perturbations and normalization produce instances with adjustable empirical difficulty.
- A temperature-controlled curriculum reweights mixed uniform and hard training examples.
- Controlled comparisons of generation and curriculum components examine TSP50 distribution transfer. [Overview.](https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=2)

## Methodology

### Hardness surrogate and its limited guarantee

For a current solver M and a surrogate M', hardness is H=(C_M−C_M')/C_M', with positive feasible tour costs. It is no greater than the current solver's true optimality gap because C_M' is at least the optimum; equality requires the surrogate to achieve the optimum. This algebraic bound does not imply that H closely estimates the gap or is always positive. For a stochastic constructor, costs are expectations rather than best-of-sample values. A greedily updated model is proposed as the surrogate. [Equations7–8.](https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=4)

### Coordinate generation and curriculum training

The conceptual energy model assigns density proportional to exp(H). Starting from random coordinates, the practical routine takes gradient-ascent steps on hardness and min–max normalizes each coordinate dimension back to the unit square. Step size eta and iteration count control perturbation strength. This is not a demonstrated exact sampler from the proposed energy distribution or a guarantee of monotonically harder instances.

The derivation explicitly holds the surrogate cost constant while differentiating. Its stated gradient-estimation interpretation therefore applies to that approximation; differentiating the full ratio as a function of coordinates would also involve the surrogate denominator. Sampling/normalization are not proved to preserve all geometry or attain a target hardness.

The curriculum assigns softmax weights from transformed hardness divided by temperature, and uses weighted REINFORCE with the best-so-far greedy rollout as a variance-reduction baseline. The solver is the Attention Model: three encoder layers,128-dimensional embeddings and eight heads, followed by autoregressive masked node selection. There is no new learned complete-tour neighborhood operator. [Equations9–15 / Algorithm1.](https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=5)

### Printed procedure and released implementation

Algorithm1 says to increase temperature; accompanying text explains that decreasing temperature concentrates weights on hard examples. The inspected release instead uses a periodic descending schedule, `20-(epoch % 20)`, and weights based on detached tanh-transformed `(cost/baseline_cost)*log_likelihood`. Its generator computes a greedy-decoding cost/log-likelihood gradient with a no-gradient baseline, then normalizes coordinates. These concrete implementation choices are recorded separately from the conceptual H formula; the release is not silently substituted for every printed equation.

## Experiments

### Scope and budgets

All main experiments use Euclidean TSP50. A Gaussian-mixture test generator samples three to seven clusters, equal cluster membership probabilities, unit-covariance Gaussian noise, and centers in a square with side c_DIST, followed by coordinate normalization. Increasing center separation changes the geometry despite the final unit-square coordinates.

Generator experiments use100,000training instances per epoch and100test instances. Transfer training uses10,000instances per epoch and a10,000-instance Gaussian-mixture test set, reported as unknown to the model. Figure4 compares uniform/hard generation, each with/without curriculum, over30epochs and15repeated runs. Settings include batch512, Adam learning rate1e-4 and rollout-baseline significance threshold0.05. The paper prints weight decay1.0; the inspected optimizer construction does not pass an Adam weight-decay argument, while options expose learning-rate decay1.0. These are different settings, not interchangeable descriptions.

Gurobi supplies exact reference costs for these small benchmarks. The paper does not report total training wall time, hardware, generation overhead or inference speed comparisons. Faster convergence in epochs is consequently not a measured end-to-end speedup. [Setup.](https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=6)

### Hard-instance generation

Table1 reports Gaussian-mixture mean gaps increasing from3.5%at c_DIST10to20.0%at100. Table2 gives1.70%for uniform instances and12.36%for generated instances at eta5, about7.3times the gap in that specific comparison. The abstract's tenfold description is not a universal ratio across all settings.

Table3 reports generated-instance gaps0.7%,1.5%,2.9%,12.4%,14.7%as eta increases0.1,0.5,1,5,10. Thus a small eta setting need not be harder than the1.70%uniform reference. Figure3 shows distributions continuing to change as the solver is fine-tuned, rather than establishing a fixed hardness target. The main text calls the uncertainty standard deviation; the released `hag.py` computes sample standard deviation divided by sqrt(100), a standard error. [Tables1–3 / Figure3.](https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=4)

### Distribution transfer

Figure4 shows the hard-generator conditions reaching roughly7%test gap after30epochs, compared with roughly11%for uniform training; curriculum gives a smaller additional benefit under hard generation. These are graph readings rather than newly supplied exact endpoint values. The result supports the two training interventions on this fixed TSP50 comparison. It does not establish domination over all cited architectures, size generalization or a guarantee for arbitrary unseen distributions. [Figure4 and protocol.](https://cdn.aaai.org/ojs/20899/20899-13-24912-1-2-20220628.pdf#page=7)

## Limitations

The surrogate is model-dependent and its quality is not certified. Gradient generation assumes differentiability and a fixed surrogate term, and finite projected steps have no exact sampling or global-hardness guarantee. The paper explicitly leaves other combinatorial problems and non-differentiable solvers to future work.

Evaluation concerns synthetic50-node Euclidean TSP, not a shared solver across native optimization problems. More difficult generated samples demonstrate weaknesses of one model, rather than intrinsic difficulty for every solver. Training/generation cost is unreported, and several printed-versus-released curriculum/optimizer details require explicit configuration decisions for replication. No experiment was independently rerun.

## Reproducibility

- Formal AAAI2022 DOI10.1609/aaai.v36i8.20899, pages9136–9144, was obtained as the actual9-page official CDN PDF. Four authors list Tsinghua University; Xin Wang and Wenwu Zhu are explicitly marked corresponding authors. Publisher-indexed and deposited publication date is2022-06-28.
- All9formal pages and all9pages of arXiv2204.03236v1 were independently fully read, including both complete bibliographies. The primary arXiv history gives first submission2022-04-07 and only v1. Both scientific versions end in references, without an additional appendix pointer.
- Official repository commitd47db30d53b67a512a7d5fd63eb61204e2365c39 was manually inventoried:88paths, no scientific PDF/TeX/ZIP/notebook. Its full README and empty ordinary releases page were inspected; the current default tree contains inherited OP/PCTSP/VRP utilities, which do not establish that this paper jointly trained or evaluated those tasks. Relevant generator, training, evaluation and optimizer paths were inspected.
- README includes data generation, Gurobi preprocessing, generator experiments and15-repeat training commands; it credits the Attention Model repository. Gurobi licensing, pretrained checkpoints and dataset preparation are reproduction prerequisites. Current source inspection is not a rerun or a full implementation audit.
- Original Figure2 is cropped from formal PDFpage5 at rectangle(51,48,563,355), rendered4x and actually viewed. All four scientific figures, all three tables, key equations and the algorithm were rendered and visually checked.
- Ten internal references have explicit body citations and matching bibliography identities. Actual old preprint labels for Fu2020 and Ma2019 are preserved. Joshi's distinct later journal generalization study and uncatalogued Transformer/curriculum manuscripts are not forced onto unrelated conference IDs.
