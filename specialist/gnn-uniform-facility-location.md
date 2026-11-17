---
id: gnn-uniform-facility-location
short_title: GNN-UniFL
title: Learning to Approximate Uniform Facility Location via Graph Neural Networks
authors:
- Chendi Qian
- Christopher Morris
- Stefanie Jegelka
- Christian Sohler
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/qian26d.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/qian26d.html
institutions:
- RWTH Aachen University
- Technical University of Munich
- Massachusetts Institute of Technology
- University of Cologne
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Facility Location
problems:
- Uniform Facility Location
summary: An unsupervised MPNN constructs randomized uniform-facility solutions with strong empirical costs; fixed-size
  conditional theory, printed radius-sign inconsistency, degree shift and nonmetric city references qualify guarantees.
code_url: https://github.com/chendiqian/FacGNN
---

# Learning to Approximate Uniform Facility Location via Graph Neural Networks

> **TL;DR:** An unsupervised MPNN predicts randomized facility-opening probabilities. It achieves strong empirical uniform-facility-location costs and size transfer, but the printed radius construction has a sign inconsistency, its learning theorem is conditional and fixed-size, and neither guarantees arbitrary trained models on nonmetric road networks.

## Motivation

Classical approximation algorithms protect worst-case solution quality but cannot exploit a recurring input distribution. Fully learned combinatorial heuristics often need expensive solver labels or reinforcement learning. This work uses uniform facility location(UniFL) to connect radius-based distributed algorithms with differentiable expected-cost training, separating classical approximation arguments, neural expressivity and empirical learning (Sections1–2).

## Contributions

- A local radius/opening-probability formulation yields differentiable expected-cost learning without optimum labels.
- Classical simple and recursive randomized algorithms are analyzed, followed by neural representation/lower-bound results and a conditional finite-training-set theorem.
- Experiments cover Euclidean geometric graphs, four large road networks, graph-size/degree shifts and a separately trained squared-distance clustering variant (Sections3–4/AppendicesA–D).

## Methodology

**Native task.** A finite metric space X supplies both clients and candidate facilities. Minimize |F|+sum_x d(x,F), for F contained in X; a common positive opening cost can be normalized by rescaling distances. Capacities, unequal opening costs and a fixed externally imposed cluster count are not solved by this formulation. A point's radius r_x satisfies sum_y max(r_x−d(x,y),0)=1, including its own zero distance, hence 1/n≤r_x≤1. The local graph retains distances at most1; experiments explicitly add zero-weight self-loops (Section2.1).

**Classical sampling.** SIMPLEUNIFORMFL independently opens x with probability min(1,c log(n)r_x), then opens uncovered points as fallback. Proposition2's expected O(log n) approximation assumes metric distances and c≥2. The recursive alternative uses min(1,c d(x,F),c r_x), assigns points sufficiently close to opened facilities and repeats; its constant-factor analysis requires c≥6. Lemma12 bounds a point's probability of remaining unassigned by1/10. It is **not** a1.1 approximation ratio, despite the results prose referring to a “10% theoretical bound” (Algorithms1–3/AppendixC).

**Neural policy/loss.** MPNNs aggregate edge distances and output opening probabilities; sampling and fallback construct a complete facility set. The objective analytically sums expected initial opening cost, fallback opening cost and nearest-open-facility connection cost, giving differentiable unsupervised training. Equation5 assumes distinct distances for its strict-order product. Released models.py explicitly resolves equal-distance ties by neighbor index and uses small log stabilizers. The implemented model learns probabilities directly through a sigmoid, rather than executing the symbolic radius-estimation construction literally. Current sample_gnn.py also computes connection cost after fallback, allowing any newly opened facility to serve neighbors; the printed expected connection expression tracks the original sampled set. These conventions should be distinguished when interpreting exact expected-loss equality.

**Classification.** This is **specialist/constructive**: neural probabilities precede the first complete facility solution. The clustering experiment changes the loss to squared distances and trains anew; README gives separate training commands. Classical k-means/k-medoids refinement is postprocessing, not evidence of a neural policy editing an incumbent. Distribution and size transfer within UniFL do not establish one trained checkpoint across different native tasks.

**Theory boundaries.** Proposition3/AppendixProposition8 assert existence of suitable parameters for fixed n, not a guarantee for arbitrary gradient-trained weights. There is a concrete inconsistency in the printed construction: p4 defines t_i=min(1,sum_y ReLU(a_i−d(x,y))) for increasing a_i, so t_i is nondecreasing. Equation4 on p5 instead sets r-hat=sum_i a_i(t_(i−1)−t_i), which is nonpositive, although the target radius is positive. AppendixC's p17 proof reuses this expression while claiming a positive discretization interval. This is a gap in the construction/proof as printed; it does not prove that no repaired architecture can have the desired expressivity. The root reviewer independently re-read these exact formal pages and confirmed this limited observation.

Proposition4's symmetric-graph argument gives an Ω(log n) lower bound for the stated deterministic-MPNN/independent-opening framework. It excludes o(log n) approximation, not O(log n); the adjacent prose overstates this distinction. Proposition5/AppendixProposition14 constructs, **for each fixed n**, a finite covering training set with classical algorithm probability labels and a Lipschitz-control regularizer. Sufficiently small regularized supervised probability-fitting error then controls all size-n inputs. It neither proves optimization reaches that error nor proves a checkpoint trained at one smaller size works at every larger n. Empirical unsupervised loss training does not implement the theorem's full labelled-cover/regularizer protocol (AppendixC pp22–23).

## Experiments

**Protocol/reference.** Each synthetic geometric distribution has10000 graphs, ordinarily split80/10/10, with100 Gaussian components and1000 vertices in2/5/10 dimensions plus sparse/dense variants. Five independently trained networks use32-dimensional states, six layers for geometric data,1000 epochs with early stopping. The paper lists ten layers for cities; the author README instead lists six for Paris. Quality averages1000 Bernoulli samples per input and then aggregates inputs/training seeds. Timings count a single forward pass plus one sample, **not the1000-sample quality-evaluation workload**. Neural/stochastic algorithms run on an L40S GPU; ILP and clustering baselines use a Xeon Silver4510 CPU. These are reported hardware-specific costs, not controlled same-device speedups (Section4/AppendixD).

**Geometric UniFL.** Table1 reports MPNN total costs652.133/775.914/813.879/954.973/669.942 against ILP646.129/772.956/812.099/952.074/667.777 across2D/5D/10D/sparse/dense data, ratios1.009/1.003/1.002/1.003/1.003. These are strong but nonzero gaps, not optimum attainment. GPU generation takes .004 seconds(.006 dense); reported ILP CPU times range .089–8.179 seconds. MPNN improves the listed stochastic approximation baselines, while the exact solver has lower objective on these rows. No independent optimization certificates were regenerated during this audit.

**Road networks.** Paris/Shanghai/London/LA contain114127/183917/568795/240587 vertices. Distances are normalized observed road-edge lengths, which the paper explicitly acknowledges can violate the metric assumptions. Table2 MPNN costs36688.742/61530.055/187492.106/79600.658 improve the displayed24-hour ILP incumbents61986.919/91515.949/248708.157/117664.352. All ILP runs time out, so these references are **feasible incumbents rather than optima**; the paper correctly omits optimality ratios. Runtime .078/.125/.390/.166 seconds concerns GPU single-solution generation. The official poster labels its city solver Gurobi, whereas the paper/README describe an OR-Tools ILP pipeline; this presentation difference is not silently treated as an exact backend identity.

**Transfer and negative cases.** A1000-node10D checkpoint maintains ratios1.002–1.003 through10000 nodes;2D ratios grow1.009→1.012 with approximately preserved average degree. Degree shift is harder: Table4's2D ratio becomes1.011/1.026/**1.124** at degrees10/12/17. The prose incorrectly calls its training-distribution starting ratio1.002; the actual2D table gives1.009. Mixed training on10000 graphs with800–1200 nodes/degrees5–15 reduces the displayed high-degree losses, reaching1.013/1.020 at degrees22/27. This is a newly trained mixed-distribution model, not an unchanged narrow-distribution model acquiring robustness (Tables3–6/10).

**Clustering variant.** Loss is retrained with squared distances; each comparison fixes k to the neural prediction's facility count. On2D/5D/10D, GNN connection costs162.800/296.984/444.445 beat discrete k-medoids170.904/312.669/458.796, but continuous k-means130.161/223.515/323.422 has lower inertia and may use centers outside X. GNN-initialized k-means improves5D/10D but worsens2D(132.438 versus130.161). GNN-initialized k-medoids improves inertia yet is slower(.095/.095/.081 seconds versus .028/.026/.017). Objective domains, initialization overhead and these counterexamples qualify blanket dominance claims (Table7).

## Limitations

### Discussed in the Paper

The architecture is tailored to uniform metric facility location; unequal opening costs, capacities and side constraints need further work. Distributional/topological shifts can degrade the learned policy. Establishing conditions under which gradient descent achieves an appropriate loss remains future research. City road data violate the theoretical metric setting, and exact city optima are unavailable.

### Curator Notes

The printed sign/monotonicity inconsistency and fixed-n conditional learning theorem prevent restating the conclusion as an unconditional guarantee for every trained network or arbitrary larger graph. They qualify specific mathematical claims, not the validity of all empirical improvements or the possibility of a corrected expressivity theorem. Tuned classical baseline c values(e.g. Simple .560 and Recursive .037 on2D) fall below sufficient constants2/6 in the corresponding guarantees; the displayed tuned runs should not inherit those guarantees automatically. Recursive code stops after100 rounds and then opens uncovered nodes, whereas the formal analysis considers its unbounded stopping process.

The complete28-cell data-generation notebook contains an explicitly labelled “save as test only” cell that writes the same batch into train/valid/test files. The ordinary data/dataset.py process instead makes disjoint80/10/10 slices. The example cell is therefore a reproducibility hazard if executed indiscriminately, **not evidence that the formal experiments used overlapping splits**. No training, solver rerun or benchmark reproduction was performed here.

## Reproducibility

- **Publication:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/qian26d.html), pp100849–100871, official published date September29,2026. Four authors/institutions and formal first-page identity checked.
- **Coverage/supplements:** all23 formal pages, every proof/reference/appendix/result row read. Key formula pages and tabular layouts checked; official event66751 poster265386bytes fully inspected. Publisher links one integrated main/appendix PDF and author Software. Normal publisher asset API404/OpenReview0dmd06JuBr API403 recorded without bypass; no missing explicitly referenced scientific supplement was identified.
- **Code:** [FacGNN](https://github.com/chendiqian/FacGNN),26191-byte26-member archive manually inventoried: source/configs/README and one28-cell notebook, no additional scientific PDF/TeX/image. Complete README/notebook read, core message passing/loss/training/sampling/timing/split/recursive paths inspected. Public default64 dimensions/five layers differs from the explicit paper-style README override32/six; checkpoint model paths and full commands are required.
- **Internal relations:** explicit text citations plus actual bibliography support [Neural CO](neural-combinatorial-optimization.md), [S2V-DQN](learning-co-over-graphs.md), [Erdős Goes Neural](erdos-goes-neural.md), [GCNN branching](gcnn-branching.md), [Neural Set Function Extensions](../studies/neural-set-function-extensions.md), [geometric constrained NCO](geometric-constrained-nco.md), [NeuroSAT](../generalist/neurosat.md) and [RLAF](rlaf-sat.md). RLAF is cited as its2025arXiv precursor; the stable ID represents the formally published2026 paper. These are documented citations, not inferred method ancestry or performance endorsement.
