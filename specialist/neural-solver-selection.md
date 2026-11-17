---
id: neural-solver-selection
short_title: Neural Solver Selection
title: Neural Solver Selection for Combinatorial Optimization
authors:
- Chengrui Gao
- Haopu Shang
- Ke Xue
- Chao Qian
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/gao25l.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/gao25l.html
institutions:
- National Key Laboratory for Novel Software Technology, Nanjing University
- School of Artificial Intelligence, Nanjing University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: Task-specific supervised graph selectors choose small heterogeneous neural routing portfolios, improving
  measured gaps with explicit quality/runtime tradeoffs.
code_url: https://github.com/lamda-bbo/neural-solver-selection
figure:
  path: paper-assets/neural-solver-selection/framework.png
  alt: Original Figure1 comparing instance-level neural solver complementarity and showing the solver selection
    framework.
  caption: 'Figure1: original instance-specific solver comparison and neural selection framework.'
  source_url: https://raw.githubusercontent.com/mlresearch/v267/main/assets/gao25l/gao25l.pdf#page=2
---

# Neural Solver Selection for Combinatorial Optimization

> **TL;DR:** A supervised graph model chooses an instance-specific subset of heterogeneous pretrained neural routing solvers. Ranking-based top-2 selection reduces reported gaps from1.95% to1.07% on the selected TSPLIB set and6.10% to5.39% on CVRPLIB Set-X, at increased solver runtime. Separate TSP/CVRP selectors are trained; the selector does not itself learn to edit complete solutions.

## Motivation

Different neural solvers win on different instances, even when one has the best mean performance. Choosing a suitable solver or a small portfolio can exploit that complementarity without running the entire pool. The empirical observations concern the tested distributions; invoking the no-free-lunch theorem does not independently prove that any finite benchmark must exhibit this pattern. [pp.1–3]

## Contributions

- An instance-level framework combines feature extraction, supervised solver scoring and confidence-based portfolio selection.
- A hierarchical graph encoder downsamples representative nodes, and classification/listwise-ranking objectives learn from measured solver costs.
- Greedy, top-k, rejection and top-p strategies expose quality/runtime tradeoffs; an exploratory solver-feature representation tests adding a held-out solver without selector fine-tuning. [pp.3–9]

## Methodology

The standard selector receives node coordinates, normalized demands for CVRP and the instance size. Its output dimensions are fixed solver identities. The graph-attention encoder uses128-dimensional embeddings,8 heads,512-wide feed-forward layers and ReZero residual scaling. The hierarchical formulation has two blocks of two attention layers, followed by attention-based scores and retention of the top80% of nodes. Selected embeddings receive their scalar score as an additive modulation. Mean/max readouts from the levels are **summed in the paper's formulation**; the release distinction is documented below. An MLP maps the instance representation and size to solver scores. [pp.4–5,14–15]

Supervision is the cost achieved by **every candidate solver** on training instances. Classification predicts the best solver; listwise ranking maximizes a Plackett–Luce-style likelihood of the complete ordering from low to high cost. Training does not optimize a latency-aware reward. Constructing these labels already requires running the underlying portfolio offline. [pp.5–6,9]

At deployment, greedy runs the highest-scored solver; top-k runs k solvers and takes the best result. Rejection runs top-2 on the20% of the **test batch** with lowest maximum softmax confidence and top-1 otherwise. Top-p is defined as the smallest prefix whose normalized score mass reaches p. These confidence measures are not proven calibrated probabilities that the selected portfolio contains the winner. [pp.5,15,18]

After contribution-based pruning, the TSP pool has seven alternatives: BQ, LEHD, ELG, DIFUSCO100/500 and T2T100/500. CVRP has five: BQ, LEHD, Omni and MVMoE, together with ELG. Multiple size-specific diffusion checkpoints count as separate alternatives. Greedy decoding is specified; POMO-based solvers use100 starts and8 augmentations, and diffusion methods use50 denoising steps/100 classical2-opt iterations. These are composite constituent-solver protocols, rather than a single neural call. [pp.14–15]

**Exploratory new-solver features:** For each solver, select its best1% of winning instances by winner/runner-up cost ratio. A momentum instance encoder(m=0.99), summary token and two attention stages produce a solver representation for instance–solver scoring. The experiment holds out and reintroduces the second-best solver. Computing features for that solver still needs measured performance on representative synthetic instances; “without fine-tuning” does not mean without offline solver evaluation. [pp.7–9]

**Classification:** Specialist / constructive. TSP and CVRP use different selectors, input dimensions, solver pools and checkpoints. A shared design or constituents with broader original capabilities does not establish one cross-problem selector. The learned operation selects complete-solution generators; it does not condition on an incumbent and predict a neighborhood edit. Classical2-opt or search inside a selected constituent is described separately, so the previous constructive-improvement label is replaced. [pp.3–6,14–15; separate released configurations]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Selector data |10,000 training instances per task with8-fold augmentation;1,000 validation and1,000 synthetic test instances |
| Training scale |50–500 nodes; Gaussian mixtures with randomized covariances, including uniform instances |
| CVRP attributes |Two capacity regimes selected equally: scale-related30+ceil(N/5), or randomized triangular parameters; formal demands sampled1–10 |
| OOD tests |Selected TSPLIB instances with N≤1,002 and CVRPLIB Set-X, approximately100–1,000 nodes |
| Optimization |50 epochs, Adam10⁻⁴, weight decay10⁻⁶, validation-based checkpoint choice |
| Repetitions |Five independently trained selectors; reported mean and standard deviation |
| Default strategies |Top-2;20% rejection to top-2; top-p0.5(TSP)/0.8(CVRP) |
| References |Gap to stated best-known solutions from expert search; not a proof that every reference is globally optimal |

**Ranking selector results, gap / average seconds per instance:**

| Dataset | Best fixed solver | Greedy selection | Top-2 selection | Full-pool oracle |
| --- | --- | --- | --- | --- |
| Synthetic TSP |2.33% /1.45|1.86% /1.33|1.51% /2.56|1.24% /8.93|
| Synthetic CVRP |6.82% /0.24|5.31% /0.62|4.82% /1.90|4.64% /4.38|
| TSPLIB subset |1.95% /1.74|1.33% /1.28|1.07% /2.48|0.89% /9.14|
| CVRPLIB Set-X |6.10% /1.31|5.76% /1.31|5.39% /2.56|5.10% /6.81|

The0.88/0.71 gains are **percentage-point gap reductions**, not relative percentages or optimality certificates. The oracle runs all pool members and is a comparison bound; it is not the learned selector's achieved accuracy. Selection-only inference is small(Table7:0.0070s), but running two solvers can materially increase total time. Synthetic CVRP top-2 is1.90s versus the best fixed Omni's0.24s. [pp.6–8,17,21–22]

- **Ranking is not universally best:** Synthetic CVRP classification top-2 has gap4.81%, slightly better than ranking4.82%. Greedy winner-identification accuracies are35%/62%/40%/56% for ranking on TSP/CVRP/TSPLIB/CVRPLIB, versus classification36%/61%/40%/52%. Lower solver-selection regret is distinct from perfect winner classification. [pp.7–8,19]
- **Feature ablations:** Hierarchical features improve TSPLIB1.45%→1.33% and CVRPLIB5.87%→5.76% relative to the simple attention encoder. Synthetic CVRP slightly worsens5.30%→5.31%; manual features on CVRPLIB give6.35%, worse than the best fixed solver6.10%. Training per epoch rises1m40s→2m30s. [pp.8,17–18]
- **Portfolio size:** Figure4 compares dynamic top-k against the best fixed subset of the same size for k=1–4; gains shrink near the full-pool oracle. Figure5 shows rejection/top-p tradeoffs, without a universal winner between them. [pp.16–18]
- **Adding a solver:** Representative features improve many top-k results after adding the held-out solver, but top-1 degrades slightly. This is a preliminary transfer experiment, not arbitrary unseen-solver generalization without evidence collection. [pp.7–9]
- **Larger TSP:** With GLOP/UDC added and N=500–2,000, the new pool's best fixed solver gives3.562%/5.274s, greedy3.126%/6.892s and top-2 2.955%/13.713s. The quality improvement comes with runtime costs. [p.19]

## Limitations

### Discussed in the Paper

Fixed solver indices assume a static pool. Solver-feature design remains preliminary; runtime-aware selection for expensive learned search and further complementary-solver training are future work. Applying the framework to scheduling requires adapting features and collecting new solver evidence; no scheduling experiment is reported. [p.9]

### Curator Notes

- Portfolio supervision, stored models and performance-label generation carry costs beyond the selector's approximately two-hour training. The released evaluator combines **stored constituent cost/time records** with measured selector inference, rather than invoking every solver live during each test call. Its wall-clock selector timer has no explicit CUDA synchronization, so the timing protocol should be distinguished from a fresh end-to-end deployment benchmark.
- **Current hierarchical implementation:** `Encoder_h.forward` accumulates `graph_emb_h` but returns only the final `graph_emb`. A direct execution of the original class on a small synthetic input confirms that its output differs from the printed sum of all level readouts. Pooling remains present; the discrepancy concerns the multi-level readout, not the existence of a hierarchical reduction.
- **Current top-p implementation:** The evaluator checks the new top-j mass but records the previous prefix `ind_`. With scores(0.6,0.3,0.1), p=0.8, the original loop selects only the0.6 solver rather than the smallest covering prefix(0.6,0.3). This isolated execution identifies a release boundary; it does not establish which historical source revision produced the paper's tables.
- **Printed pruning sign:** AppendixA.3 defines contribution as gap(S)−gap(S without s). For a best-of-pool minimization gap this is nonpositive, inconsistent with keeping all contributions above positive0.01%. The intended degradation would reverse that subtraction. The note retains the reported final pools without asserting that this printed sign was the executed pruning procedure.
- **Version details:** The released Gaussian generator samples centers over0–100 before min-max scaling, rather than the printed0–1; its random-triangular CVRP branch uses four demand ranges and scales capacity by mean demand. The saved data-generation default is1M, versus10K selector-training instances in the paper. Those defaults should be adjusted/verified for reproduction. Top-p defaults to0.8 in the visible evaluator even for TSP; the formal TSP result uses0.5.
- Main and complete-appendix timing entries differ for some individual TSP solvers(e.g., BQ1.40s versus1.61s). They are retained as source-specific values, not silently reconciled or treated as an additional speed guarantee. No full solver benchmark or retraining was run in this review.

## Reproducibility

- **Published source:** [ICML2025/PMLR267](https://proceedings.mlr.press/v267/gao25l.html), explicit publisher metadata date2025-10-06; the conference itself was held13–19July2025. All22 formal pages, complete references and AppendicesA.1–A.12 were read. All six figures and11 tables were visually inspected.
- **Scientific inventory:** The publisher exposes the main PDF and OpenReview link; the official ICML event exposes a poster and no slide/supplement attachment. The full1.816MB official poster was read in three overlapping tiles. The complete untruncated122-entry author tree and123-member83.84MB source archive contain no additional scientific PDF, notebook or nested archive.
- **Code/data:** [Official implementation](https://github.com/lamda-bbo/neural-solver-selection), inspected tree51a580bf653bddb1e7e0b443d1b2fce6d927c318. The README, entire model/loss/trainer/data pipeline, default/saved configurations and test scripts were inspected. The archive includes two pretrained **selector** checkpoints plus constituent performance records; it does not bundle all underlying routing solver implementations/checkpoints.
- **Targeted verification:** Original-model execution checks the final-only readout; the exact original top-p loop is executed on synthetic scores. These are limited implementation checks, not reproduction of reported trained-model metrics.
- **Figure:** Original formal Figure1 shows instance-dependent solver complementarity and the feature/scoring/selection framework.
