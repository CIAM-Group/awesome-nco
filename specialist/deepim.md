---
id: deepim
short_title: DeepIM
title: Deep Graph Representation Learning and Optimization for Influence Maximization
authors:
- Chen Ling
- Junji Jiang
- Junxiang Wang
- My T. Thai
- Renhao Xue
- James Song
- Meikang Qiu
- Liang Zhao
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/ling23b.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/ling23b.html
institutions:
- Emory University
- Fudan University
- NEC Laboratories America
- University of Florida
- Dakota State University
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Graph Optimization
problems:
- Influence Maximization
summary: A fixed-graph seed-set autoencoder and diffusion surrogate support latent influence optimization with cardinality
  or node-cost budgets.
code_url: https://github.com/triplej0079/DeepIM
---

# Deep Graph Representation Learning and Optimization for Influence Maximization

> **TL;DR:** DeepIM jointly learns a fixed-graph seed-set autoencoder and diffusion predictor, then optimizes a latent seed representation under a proposed budget projection. Its empirical influence gains do not establish exact constrained optimization or all of the claimed monotonicity guarantees.

## Motivation

Influence maximization selects seed nodes to maximize expected diffusion. The paper targets costly repeated node selection, misspecified hand-chosen diffusion models and differing per-node budget costs. It learns a surrogate spread model together with a continuous representation of seed sets, aiming to optimize the latter directly (Sections1-3).

## Contributions

- A seed-set autoencoder compresses graph-indexed binary seed vectors into a continuous latent space.
- A GAT diffusion teacher learns infection probabilities; a smaller latent-input student is proposed for faster spread estimation.
- Latent optimization combines spread maximization with seed reconstruction and a cost-budget constraint that can represent cardinality or node-degree costs.
- Experiments cover simulated IC/LT/SIS diffusion, degree-constrained variants, teacher/student inference time and seven graph datasets.

## Methodology

**Training.** For a given graph, randomly sample seed sets and simulate diffusion to create training pairs. An MLP encoder/decoder learns reconstruction, while a two-layer GAT with four64-dimensional heads per layer predicts infection probabilities from reconstructed seeds and graph structure. The proposed joint objective includes reconstruction, diffusion prediction and student distillation. The teacher's parameters are constrained nonnegative. Architectures/input dimensions depend on the graph's node set, so this is not an inductive unchanged checkpoint across arbitrary unknown graphs (Sections3-4/5.1).

**Inference.** Initialize a latent vector from training seed encodings and optimize decoded seed scores using a squared error toward full infection and a reconstruction/likelihood term. The all-infected target |V| is an aspirational upper bound, not necessarily attainable under a budget. The paper proposes projecting decoded scores to a valid set after iterations: highest scores for cardinality and a cost-efficient score/cost rule for nonuniform node prices. An additive constraint sum_i F(v_i,G)*x_i<=k expresses cardinality or degree costs. Score/cost sorting is a heuristic for weighted selection and requires an explicit budget-feasibility procedure; it is not an exact general knapsack projection or proof of global IM optimality (Section4.2/Algorithm1/AppendixA).

**What the theory establishes.** Theorem1 is the valid conditional composition principle: if every aggregation/update/readout is coordinatewise nondecreasing in its relevant inputs, their composition is monotone. That alone does not establish those conditions for arbitrary attention. Corollary2 tries to obtain GAT monotonicity from nonnegative weights, but its proof incorrectly treats softmax as coordinatewise nondecreasing. For a simple positive scalar attention aggregation F(h)=sum_j softmax(h)_j*h_j, F(0,4) is about3.9281 while F(0.1,4) is about3.9226. This refutes the asserted layer monotonicity implication over nonnegative continuous hidden features; it is not a claim that the paper's particular trained network empirically violates binary-seed monotonicity (Section4.1/Corollary2).

The printed Jensen step in Equation6 also reverses the inequality: for positive random likelihood L, convexity gives -log(E[L]) <= E[-log L]. The expected negative-log objective is an upper bound in that step. Corollary3/AppendixA do not obtain general strict ranking preservation merely from continuity, meaningful latent samples or minimized reconstruction error. Exact reconstruction, or sufficiently controlled surrogate/reconstruction errors relative to a ranking margin, would be additional requirements. These derivation issues should not be presented as a certified solution-quality guarantee.

## Experiments

**Data and supervision.** Real graphs are Cora-ML, Network Science, Power Grid, Jazz, Digg and Weibo, plus a50,000-node synthetic Erdos-Renyi graph. Weibo has2,251,166 nodes and225,877,808 edges in Table1, not a tested billion-node network. Main labels are generated with the named simulators rather than inferred from unknown real-world cascades: IC uses inverse in-degree edge probabilities; LT thresholds are uniform in[0.3,0.6]; SIS infection/recovery probabilities are0.001 (Section5.1/Tables1-3).

**Quality.** Seeds comprise1/5/10/20% of vertices, and100 simulations estimate average final influenced-node percentage. Full DeepIM reports the largest values in the shown IC/LT comparison tables. For example, IC Cora-ML gives14.1/28.1/39.6/52.4%; LT gives13.4/69.2/83.5/94.1%. On LT synthetic20%, DeepIM reaches99.9% versus listed baselines up to70.2%. These are influenced-node percentages under specified simulation protocols, not optimality ratios, calibrated confidence intervals or proof of diffusion-model discovery outside the training regimes (Tables2-3).

The distilled student trades quality for speed: IC Network Science5% gives19.1 versus OPIM19.4 and teacher20.9; Power Grid10% gives31.7 versus OIM31.9 and teacher32.5. Under SIS, full DeepIM reports Jazz27.1/57.1/68.1/74.1%; several other datasets show lower spread than in IC/LT. Figure2 studies degree budgets against CELF on five smaller/synthetic graphs, not every arbitrary centrality constraint. Budget definitions and feasibility matter independently of the learned diffusion score (Figure2/AppendixB/Table5).

**Time and resources.** At50,000 nodes with10% seeds, Table4 gives inference12.882s for teacher DeepIM and1.275s for the student, versus IMINFECTOR16.492s, PIANO28.437s and ToupleGDD58.985s. Reported training is1,244.56s/503.12s for teacher/student versus4,753.67s/14,732.63s for IMINFECTOR/PIANO; ToupleGDD training is unreported. The10,000-to50,000-node range is a measured scaling curve, not a global linear-complexity theorem. Main-table out-of-memory dashes concern particular baselines/settings. A complete hardware, simulator-label-generation and model-selection account is not supplied, so no universal cost advantage follows (Section5.4/Table4).

## Limitations

### Discussed in the Paper

The teacher's graph propagation remains costly at scale, motivating the student. Adaptivity to budget constraints is only partially addressed; the actual data-driven diffusion model and constrained optimization are learned approximations. The conclusion emphasizes further diffusion/constraint generalization, without a global optimum certificate (Sections4-6).

### Curator Notes

The conditional monotone-composition result should be separated from the unsupported GAT sufficient-condition proof, Jensen direction and ranking-consistency claim described above. Diffusion monotonicity would also not imply submodularity, an approximation ratio, exact reconstruction or successful nonconvex latent optimization. Training with specified simulated diffusion models does not alone establish robustness to unknown real diffusion patterns. Fixed-graph dense seed encoders and per-setting training make this a specialist IM method.

**Current release versus paper.** The inspected genim.py ignores command-line arguments through parse_args(args=[]), despite README flags. It trains reconstruction BCE plus node-probability MSE, clamps teacher parameters nonnegative, and its sparse attention uses exp(-score). Its inverse objective is MSE toward all ones plus an L1-like decoded-seed penalty, followed by one final top-k extraction whose seed_num is derived from a preceding reconstruction. It does not implement the printed per-iteration degree-budget projection in that script, and no complete student-distillation pipeline or Digg/Weibo reproduction was identified in the small public release. Dense adjacency conversion is also unsuitable evidence for memory scaling to the largest reported graphs. These observations limit reproduction from the current archive; they do not establish which historical implementation generated the published results. No training or experiments were rerun.

## Reproducibility

- **Publication:** [ICML2023/PMLR202](https://proceedings.mlr.press/v202/ling23b.html), pages21350-21361 as listed by the publisher. Official HTML/source gives July3,2023. Publisher metadata names Renhao Xue while the PDF prints Lukas Xue; the catalogue retains the publisher identity and explicitly records this version discrepancy. Ling/Jiang share first authorship; Zhao is marked corresponding author, with Emory/Fudan/NEC/Florida/Dakota State affiliations checked.
- **Scientific coverage:** all twelve [publisher PDF](https://proceedings.mlr.press/v202/ling23b/ling23b.pdf) pages, complete references, AppendixA derivations and AppendixB/SIS table. The publisher HTML/source has extras:[]; full official author archive inventory identified no additional scientific PDF. Key theory, tables and figures were rendered and checked visually.
- **Implementation:** [official DeepIM](https://github.com/triplej0079/DeepIM); complete archive inventory, README, genim.py and teacher/autoencoder modules inspected. Available data/commands cover five named small/synthetic datasets; the material discrepancies above are retained.
- **Relations:** no exact work in the current catalogue was found with both an explicit body citation and matching bibliography identity. General GNN, IM baseline and source-localization citations do not justify inferred relations to other IM papers.
