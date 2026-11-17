---
id: circuit-sat-neural
short_title: Neural Circuit-SAT
title: 'Learning To Solve Circuit-SAT: An Unsupervised Differentiable Approach'
authors:
- Saeed Amizadeh
- Sergiy Matusevych
- Markus Weimer
year: 2019
date: '2019'
publication:
  date: '2019'
  source_url: https://openreview.net/forum?id=BJxgz2R9t7
venue: ICLR
paper_url: https://openreview.net/forum?id=BJxgz2R9t7
institutions:
- Microsoft
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
- Graph Optimization
problems:
- Circuit SAT
- Boolean Satisfiability
- Graph Coloring Decision
summary: A shared DAG assignment network trains through a differentiable circuit evaluator and transfers via fixed
  reductions from random SAT to small coloring decision instances; experimental training selects SAT circuits.
---

# Learning To Solve Circuit-SAT: An Unsupervised Differentiable Approach

> **TL;DR:** DG-DAGRNN predicts circuit-input assignments and trains through a differentiable circuit evaluator. It uses no satisfying-assignment targets, but the experiments select satisfiable training circuits. The same random-SAT-trained model transfers to small graph-coloring decision encodings; the paper does not claim completeness or competitiveness with industrial SAT solvers.

## Motivation

Neural SAT classification does not directly optimize assignment discovery, and flat CNF representations can obscure a circuit's computational structure. The paper combines directed sequential graph propagation with a direct satisfaction objective, while allowing domain-specific ordering information in the circuit representation.

## Contributions

- Deep-Gated DAG Recursive Neural Networks with forward/reverse topological propagation and recurrent reuse of the stacked layers.
- A trainable assignment network paired with a fixed, differentiable evaluator of the input circuit, trained by backpropagation rather than sampled policy-gradient rewards.
- Random-SAT size extrapolation and fixed-model transfer to SAT encodings of graph-coloring decision problems, compared with a retrained NeuroSAT baseline.

## Methodology

Circuit nodes represent variables and AND/OR/NOT gates with one-hot type features. Each DAG layer processes nodes in topological order using a GRU and a learned permutation-invariant aggregation of predecessor states. Reverse layers carry information from circuit outputs toward variables. Recurrent stacks reuse their weights, so inference can run for more recurrences than training without adding parameters.

The final reverse layer reads variable states and an MLP produces values in the unit interval. A separate, nontrainable evaluator shares the circuit topology. During training it replaces AND/OR with smooth min/max and NOT with one minus its input. A step-shaped loss encourages higher circuit satisfaction. Annealing the smooth-gate temperature spreads gradients early and sharpens them later; this is an exploration analogy, not standard reinforcement learning.

At test time the evaluator uses exact min/max, not the smooth training gates. A strict output greater than 0.5 identifies a candidate satisfying assignment after thresholding variables; negative output from the learned candidate does not prove UNSAT. Appendix B supplies a threshold argument for this positive-witness property, rather than a guarantee that training will discover a witness. Its printed all-input lemma has a boundary caveat: at an exact input of 0.5, the claimed identity between thresholded NOT and NOT of the strict-thresholded value fails. Boolean witness validation avoids conflating that lemma with an unconditional solver guarantee.

Experimental training excludes UNSAT examples to avoid wasting updates, even though the objective can be computed without SAT/UNSAT labels. Thus the loss is label-free in form, while dataset selection uses satisfiability knowledge. Circuit preparation also uses a bounded recursive variable-splitting expansion and ordering heuristics: occurrence frequency for random CNF and graph degree for coloring. Structural preprocessing belongs to the algorithmic budget.

The same model trained on random k-SAT is tested without retraining on graph k-coloring encodings. This supports **generalist reuse through a common circuit representation and fixed reductions**, not direct optimization of chromatic number or arbitrary native problem specifications. The neural role remains constructive assignment prediction.

## Experiments

The main comparison generates 300,000 SAT/UNSAT pairs with 3-10 variables. NeuroSAT uses the pairs; DG-DAGRNN uses only their SAT members. Both compared models have roughly 180,000 parameters. DG-DAGRNN uses two DAG layers of dimension 100, a two-layer output MLP with hidden width 30 and learned aggregation MLPs of width 50. Adam uses `1e-5`, weight decay `1e-10`, gradient norm clipping 0.65 and aggregation dropout 20%. The authors train each model for about one day on a single GPU, without specifying its model or full resource accounting.

All reported solving tests retain only satisfiable examples and measure the fraction with a found assignment. Figure 2 gives in-distribution recovery around 91% for DG-DAGRNN versus 92% for NeuroSAT; DG-DAGRNN reaches its plateau with fewer recurrences. On 40-variable out-of-distribution formulas, recovery is 41% versus 36%; on 80 variables, 14% versus 9%. These are partial success rates, with test iterations continued until the metric stabilizes, not an equal fixed-step or complete-SAT benchmark.

The transfer test uses graphs with 6-10 nodes and color bounds 2-4. Dataset 1 draws from six random graph families and keeps colorable instances; Dataset 2 starts from trees and adds edges up to a satisfiability boundary. The unchanged DG-DAGRNN model recovers 48% and 27%, whereas the study's NeuroSAT model recovers none even after 128 message rounds. The authors explicitly state that this differs from NeuroSAT's original graph-coloring result and that encoding differences may explain it; the reason remains open. Circuit preprocessing and the much smaller 3-10-variable training regime also qualify comparison with the original NeuroSAT paper.

Reported timing examples give roughly three seconds for 40 neural rounds on a 20-variable formula versus 0.7 seconds for MiniSAT, while a separate GPU-batched 10,000-example comparison reports eight versus 114 minutes. These figures mix per-example and batched execution and do not demonstrate equal completeness, hardware-parallelism or end-to-end conversion costs. The paper itself says substantial work remains before competing with industrial SAT solvers.

## Limitations

### Discussed in the Paper

- Large training samples and GPU memory constrain the tested training sizes.
- Representation/encoding differences can change transfer behavior; the discrepancy with NeuroSAT is not resolved.
- The approach is preliminary relative to industrial SAT solvers, and learned mechanisms need further analysis.

### Curator Notes

- Direct differentiable training still selects SAT data and relies on explicit circuit construction/order heuristics.
- A found Boolean witness certifies SAT; failure of one learned candidate, even after more recurrences, cannot establish UNSAT.
- The exact min/max evaluation condition must not be transferred to finite-temperature soft gates, nor should the boundary issue in the printed threshold lemma be ignored.
- More recurrences, different circuit sizes and batching affect computation; fewer iterations alone do not establish lower total work.
- Graph-coloring results concern feasibility at a supplied color bound on tiny graphs, not optimum coloring or general native graph optimization.

## Reproducibility

- **Formal qualification:** [ICLR 2019 official listing](https://iclr.cc/Downloads/2019) and [Microsoft's accepted-poster page](https://www.microsoft.com/en-us/research/event/iclr-2019/accepted-posters/) identify this paper; the canonical record is [OpenReview](https://openreview.net/forum?id=BJxgz2R9t7).
- **Actual reading copy:** the [author-hosted Microsoft PDF](https://www.microsoft.com/applied-sciences/uploads/publications/91/learning_to_solve_circuit_sat_an_unsupervised_differentiable_approach.pdf), whose metadata dates creation/modification to 29 December 2018 and whose header identifies ICLR 2019. All 14 pages, including references and integrated Appendices A-D, were read.
- **Supplement check:** OpenReview forum/API/attachment returned access challenges. The available complete author copy contains the classification variant, proof and conversion details, and does not reference another missing scientific appendix. No official implementation link was established in the scientific sources; third-party reimplementations are not presented as author code.
- **Visual verification:** evaluator/loss equations, Figure 2, threshold proof and graph-coloring encoding were inspected in rendered pages.
- **Validation scope:** literature/source/note audit; no retraining, solver benchmarking or numerical reproduction was performed.
