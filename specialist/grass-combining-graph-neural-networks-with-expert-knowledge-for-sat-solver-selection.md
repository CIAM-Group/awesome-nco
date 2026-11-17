---
id: grass-combining-graph-neural-networks-with-expert-knowledge-for-sat-solver-selection
short_title: GraSS
title: 'GraSS: Combining Graph Neural Networks with Expert Knowledge for SAT Solver Selection'
authors:
- Zhanguang Zhang
- Didier Chételat
- Joseph Cotnareanu
- Amur Ghose
- Wenyi Xiao
- Hui-Ling Zhen
- Yingxue Zhang
- Jianye Hao
- Mark Coates
- Mingxuan Yuan
year: 2024
date: '2024-05-17'
publication:
  date: '2024-08-24'
  source_url: https://dl.acm.org/doi/10.1145/3637528.3671627
venue: KDD
paper_url: https://doi.org/10.1145/3637528.3671627
institutions:
- Huawei Noah's Ark Lab
- McGill University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Constraint Satisfaction
problems:
- Boolean Satisfiability
- SAT Solver Selection
summary: A heterogeneous literal-clause GNN with expert features and clause-position encodings selects one of seven
  classical SAT solvers using a runtime-sensitive supervised loss; it improves solver-only means on two filtered
  datasets, with feature extraction reported separately.
arxiv_url: https://arxiv.org/abs/2405.11024
figure:
  path: paper-assets/grass-combining-graph-neural-networks-with-expert-knowledge-for-sat-solver-selection/framework.png
  alt: GraSS encodes SAT formulas as attributed literal-clause graphs, applies heterogeneous graph convolutions
    and pooling, and predicts a solver using offline runtime labels.
  caption: 'Original Figure 1: GraSS trains a graph-based SAT solver selector using portfolio runtimes.'
  source_url: https://arxiv.org/pdf/2405.11024#page=2
---

# GraSS: Combining Graph Neural Networks with Expert Knowledge for SAT Solver Selection

> **TL;DR:** GraSS chooses one classical SAT solver from a seven-solver portfolio. Its graph network combines formula structure, hand-designed features and clause-order encodings. The reported mean solver runtimes improve on adapted SATzilla baselines, but exclude feature computation; the network does not itself produce a satisfying assignment or unsatisfiability certificate.

## Motivation

Different SAT solvers can have substantially different runtimes on the same formula. Portfolio selection aims to exploit this variation before solving. Existing selectors use expensive fixed-dimensional summary features, while a literal-clause graph preserves structural information. The authors argue that combining this graph with expert features is more useful than choosing exclusively between raw structure and hand engineering. [pp. 1–4]

## Contributions

- A heterogeneous graph model distinguishes positive literals, negative literals and clauses, with relation-specific message passing.
- Domain features describe literal occurrence, Horn clauses, clause length and polarity; sinusoidal clause positions encode order effects.
- A supervised loss penalizes squared expected runtime regret rather than treating all incorrect solver labels equally.
- Experiments compare solver selection, feature costs, architectural variants and feature ablations on industrial equivalence-checking and SAT Competition data. [pp. 2–8]

## Methodology

Each CNF formula becomes a literal-clause graph. A variable has positive and negative literal nodes linked as complements; incidence edges connect a literal to each clause containing it. Three-dimensional literal features summarize normalized degree, Horn-clause occurrence and positive/negative occurrence ratios. Clause features combine seven expert statistics with a ten-dimensional sine/cosine positional encoding, for 17 dimensions. The full feature inventory is in Appendix A. [pp. 4–5, 10; Figs. 1–2; Table 7]

Two relation-specific graph-convolution rounds use degree-normalized messages and ReLU updates. Pooling summarizes the clause and literal embeddings; a linear classifier and softmax produce seven probabilities. Given all seven measured runtimes for a training instance, Equation 1 squares the difference between the probability-weighted runtime and the best portfolio runtime. Deployment selects the highest-probability solver and runs it. This is offline supervised portfolio selection, not reinforcement learning, an online bandit, or a new SAT search engine. No optimal-selection or convergence theorem is presented. [pp. 4–6]

The portfolio contains Kissat-3.0, bulky, HyWalk, MOSS, mabgb, ESA and UCB. The first two are Kissat-based; the others vary bandit-based branching. The model is trained using Adam with a learning rate of 10^-3, up to 100 epochs with early stopping, on a Tesla V100 using PyTorch and DGL. Runtime labels require executing every portfolio member on each labeled formula. [pp. 5–6]

**Classification: Specialist / constructive.** The learned component is a SAT solver selector that delegates constructive/exact search to an existing solver. Choosing among seven algorithms is not evidence of one neural checkpoint solving seven different native combinatorial problems. The two datasets are trained/evaluated separately; no shared cross-domain checkpoint is demonstrated. [pp. 5–8]

## Experiments

The proprietary logic-equivalence-checking dataset contains 78,727 instances from 30 industrial circuits. Circuit contributions are highly uneven. The SAT Competition dataset contains 2,088 formulas from the 2022 Anniversary Track after removing formulas unsolved by every portfolio member within 1,500 seconds and formulas with more than 20,000 variables. Results average five train-test folds with standard deviations. The article does not state a leave-circuit-out protocol, so these tests do not establish transfer to unseen circuit designs. [p. 6; Table 1]

The three metrics are mean selected-solver runtime, percentage solved within **500 seconds**, and accuracy in identifying the fastest solver. The 500-second success threshold is distinct from the 1,500-second dataset filter and the 5,000-second clause-permutation study. The best single solver is bulky, selected using training data. SATzilla07/12 are adapted baselines with presolving and probing removed; they should not be described as the complete original SATzilla pipelines. ArgoSmArT and a CNN selector are also compared. [pp. 5–7]

On equivalence checking, GraSS reports **341.549 ± 1.440 seconds** and **77.7 ± 0.2%** solved, versus SATzilla12's 344.290 ± 1.115 seconds and 77.2 ± 0.1%. On SAT Competition, the corresponding values are **220.251 ± 16.360 seconds / 84.6 ± 1.8%**, versus 222.146 ± 18.311 seconds / 84.0 ± 2.0%. Runtime improvements over SATzilla12 are approximately 0.8–0.9%; the larger improvements over the single best solver use a different comparator. Runtime entries carry the paper's Wilcoxon significance marker; this does not establish significance for every success or accuracy comparison. [p. 7; Table 2]

GraSS is not the most accurate fastest-solver classifier: SATzilla12 is more accurate on the industrial set, and ArgoSmArT has 0.449 accuracy on SAT Competition versus GraSS's 0.259. These metrics can disagree because misclassifying two nearly equal solvers is less costly than choosing a much slower one. SATzilla12 also has lower runtime on the easiest industrial quartile and the two easiest SAT Competition quartiles. [pp. 7–8; Tables 2–3; Fig. 4]

**Feature extraction is excluded from those runtime means.** Table 4 reports GraSS feature computation of 1.232 seconds on equivalence checking and 33.862 seconds on SAT Competition, versus SATzilla12's 8.643 and 194.155 seconds. The graph features are cheaper than these adapted SATzilla features, but are not free. As curator arithmetic, the SAT Competition feature cost of 33.862 seconds exceeds the solver-only mean saving of 30.651 seconds against the single best solver; this comparison is conditional on adding serialized mean costs and is not an independently rerun end-to-end benchmark. A separate complete inference-overhead budget is not supplied. [p. 8]

LEC ablations favor the proposed heterogeneous architecture and custom features plus positional encoding. The NeuroSAT-inspired comparator uses **four layers instead of the original 26**, with an adapted solver-classification output; it is not an unchanged NeuroSAT implementation. The feature ablation improves mean runtime from 343.143 seconds without clause positions to 341.549 seconds with them. [p. 8; Tables 5–6]

## Limitations

The industrial formulas are proprietary, the competition subset excludes jointly timed-out and large-variable instances, and no unseen-circuit or broad out-of-distribution guarantee follows from the five-fold protocol. Results depend on a fixed seven-solver portfolio, runtime labels and timeout conditioning. Online adaptation is explicitly left unresolved because labeling requires all portfolio runtimes and GNN updates are costly. [pp. 6–8]

The permutation experiment supports sensitivity to clause order, but the text describes LEC data while the Figure 3 caption names SAT Competition; its dataset identity is therefore ambiguous in this reading version. Detailed graph hidden widths, all training/early-stopping settings, complete end-to-end timings and a verified public implementation are not supplied. The paper's claims should remain empirical and dataset-specific. [pp. 4–8]

## Reproducibility

The formal publication is KDD 2024, pp. 6301–6311, DOI 10.1145/3637528.3671627. Saved publisher-deposited Crossref metadata records online publication on **2024-08-24** and print publication on 2024-08-25; conference dates are a separate field. The ten-author byline and affiliations identify Huawei Noah's Ark Lab in Montreal, Hong Kong and Beijing, and McGill University. The separate arXiv v1 submission is **2024-05-17**, the only version listed in the saved primary history.

All ten pages of the identified arXiv v1 were read, including all 50 references and the integrated feature appendix. The preprint's ACM placeholder copyright/DOI is not used as publication metadata, and its ten pages are not asserted to be byte-identical to the formal eleven-page pagination. Publisher article/supplement endpoints returned 403 and are recorded. The complete reading copy identifies Appendix A, which was read, and no required missing separate scientific supplement. Exact-title and author/code searches did not identify a verified official implementation; unrelated projects also named GraSS are excluded, and no Code link is invented.

All four figures, seven tables and the key graph/loss formulas were visually inspected in rendered PDF pages. Original Figure 1 is included. No model training, SAT-solver execution or historical-result reproduction was performed. References to other neural SAT methods are recorded only when both explicit body context and a matching bibliography entry identify an existing catalogue paper.
