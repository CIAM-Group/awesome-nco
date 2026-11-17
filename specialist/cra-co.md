---
id: cra-co
short_title: CRA
title: Controlling Continuous Relaxation for Combinatorial Optimization
authors:
- Yuma Ichikawa
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/54191f424e9013fc1d7b923f6e45dff4-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/54191f424e9013fc1d7b923f6e45dff4-Abstract-Conference.html
institutions:
- Fujitsu
- The University of Tokyo
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Graph Optimization
- Routing
problems:
- Maximum Independent Set
- Maximum Cut
- Diverse Bipartite Matching
- Traveling Salesman Problem
summary: CRA anneals a polynomial output penalty while optimizing a fresh neural network
  for each instance, moving from continuous toward near-binary outputs; finite training
  still uses projection and does not inherit a global-optimality guarantee.
code_url: https://github.com/Yuma-Ichikawa/CRA4CO
---

# Controlling Continuous Relaxation for Combinatorial Optimization

> **TL;DR:** Add an output penalty that changes from favoring fractional assignments to favoring binary ones during instance-specific neural optimization. CRA improves the studied PI-GNN baselines, but trains anew per instance and still applies a numerical0.5 projection. It is not a pretrained checkpoint that solves multiple native tasks.

## Motivation

Continuous neural relaxations can collapse to unhelpful assignments or finish with threshold-sensitive fractional outputs. CRA targets both optimization plateaus and ambiguity in converting soft solutions to binary assignments. The paper deliberately studies single-instance optimization without a historical training dataset, distinct from learning a reusable policy over many instances (Sections1-3).

## Contributions

Continuous relaxation annealing augments a differentiable penalized CO objective with gamma*Phi(p), where Phi(p)=sum_i[1-(2p_i-1)^alpha] and alpha is an even positive integer. Negative gamma favors the center of the hypercube; positive gamma favors its vertices. CRA increases gamma during optimization of a PI-GNN, including its node embeddings. The paper supplies a global-minimizer limiting argument, reports MIS/MaxCut/diverse matching experiments and includes additional small TSPLIB experiments in AppendixF.4.

The solver is specialist/neurodynamic: parameters are optimized for the current instance. Applying the same annealing recipe to MIS, matching and TSP does not constitute a shared trained neural solver. The conceptual Potts extension is not presented as an experimentally validated coloring solver.

## Methodology

Represent constraints through penalties with coefficients chosen for the task, and choose a differentiable extension on[0,1]^N. A two-layer graph convolution or GraphSAGE network with sigmoid output supplies soft variables. At each optimizer step, minimize the current relaxed objective plus gamma*Phi, then increase gamma by epsilon. Default gamma starts at-20 for MIS/matching and-6 for MaxCut, epsilon=.001 and alpha2. The polynomial Phi is concave; negative gamma makes its contribution convex. Its derivative is finite, unlike an entropy derivative at the boundary (Section3.2).

Theorem3.1/AppendixB concerns **global minimizers in output space** under a bounded objective as gamma tends to either infinity. It motivates center concentration for large negative gamma and vertex concentration for large positive gamma. It does not establish that AdamW finds those global minimizers, that a finite schedule is convex in neural weights, or that finite output discreteness guarantees every constraint. The printed finite-convexification and entropy-generalization statements need the qualifications below.

The paper uses AdamW1e-4 with weight decay.01, five neural initializations per instance and selection of the best result. The main text permits50,000 epochs, while AppendixD permits100,000; both describe tolerance1e-5 and patience1000. Section5.1 explicitly applies a0.5 projection after optimization, while reporting final outputs binary within FP32 precision on its benchmarks. Thus rounding-free denotes reduced ambiguity from nearly discrete outputs, not absence of a final projection instruction. No constraint violations were observed in those experiments; this is an empirical finding (Sections3.2/5.1; AppendixD).

## Experiments

**MIS.** Random regular graphs include10,000/20,000 nodes and varying degree. Table1 compares10,000-node20-/100-regular graphs, averaging five graph seeds. CRA-GraphSAGE reaches reported ApR0.963±0.001 at degree20 versus DGA0.891±0.001 and PI-GNN0.745±0.003; at degree100 it reaches0.924±0.001 versus DGA0.848±0.002 and a collapsed PI-GNN result. These ratios use statistical-mechanics reference densities, not certified optima for every finite graph. AppendixF.2's ER comparison is less favorable: CRA0.928 in47.30minutes versus iSCO0.998 in1.38minutes on700-800-node ER; large ER gives0.963 in1.03hours versus iSCO0.990 in9.38minutes. Those ratios use KaMIS references and prior baseline results. CRA is not uniformly competitive with strong sampling solvers (Table3).

**MaxCut.** The main seven Gset examples improve PI-GNN, e.g. G140.988→0.994 and G220.987→0.998. G49/G50 reach1.000 and tie several classical baselines rather than strictly beating them. The expanded35-instance table generally improves the chosen PI-GNN baseline. Gset ratios use best-known values; random-regular cut curves use a large-graph/degree asymptotic reference, not a universal finite-instance certificate (Tables2/6; AppendixE).

**Matching.** There are27 Cora-derived100-node bipartite instances, split50/50, with predicted link weights, one-match-per-node constraints and diversity proportions5% or25%. The objective uses row/column penalty coefficients10 and diversity coefficients25. Reported ratios against Gurobi10.0.1 optima improve over PI-GNN across the displayed cases. This experiment still optimizes each instance; it is not a transfer experiment from graph MIS (Section5.4/Figure6).

**Additional TSP and ablations.** Table7 covers burma14, ulysses22, st70 and gr96, three seeds and several curve rates. It reports some near-optimal small-instance results, but not all point estimates exceed0.9: values range roughly0.80-0.99 across settings. Several printed uncertainty/reference entries are ambiguous, including the PI-GNN0.736±1.21 and the gr96 optimum line; they are not treated as independently validated tour statistics. Slower schedules and more negative initial gamma often improve MIS quality at greater optimization cost; alpha2 is best in the tested graph ablation. Empirical runtime fits near N^1.4/N^1.7 apply to the selected degree100 experiment and schedule, not a complexity guarantee. Tables4/5 show improved quality often with longer elapsed time than PI-GNN (AppendixF; Figures4/8/9).

## Limitations

Every new instance requires optimization and possibly several restarts. Differentiable objective/constraint penalties, a suitable relaxation and hyperparameter choices remain necessary. A feasible binary assignment is not automatically optimal. Five graph seeds, best-of-five initializations, theoretical/best-known references and differing runtime protocols must be kept distinct. The paper itself identifies schedule and architecture tuning as important. The released dense QUBO demonstration is not a complete driver for all reported benchmarks.

### Curator Analysis

**Finite convexification versus limiting concentration.** For alpha4, take the smooth bounded relaxed loss l(p)=-(p-.5)^2 and gamma=-g. Writing y=p-.5 gives r=-y^2+16g*y^4-g. Its second derivative at the center is-2 for **every finite g**. For g≥1/8 the two minimizers are .5±1/sqrt(32g): they approach .5 as g increases, although the finite objective never becomes convex. This limits finite-convexification readings of Theorem3.1/B.4, without denying the limiting center, the actual alpha2 experiments or their empirical usefulness. It makes no claim about neural-weight-space convexity.

AppendixB's derivatives omit powers for alpha>2. Correctly, Phi_i''=-4*alpha*(alpha-1)*(2p_i-1)^(alpha-2), preserving concavity but not a uniformly negative curvature at the center. The negative-entropy expression printed in CorollaryB.5 has the opposite extrema from the polynomial Phi: p*log p+(1-p)*log(1-p) is0 at vertices and-log2 at .5. With a positive coefficient it favors .5, so it cannot use the same annealing sign convention as printed. These are qualifications of the stated formulas/generalizations, not a claim that the polynomial CRA mechanism fails.

**Release versus full protocol.** The supplied notebook runs PI-GNN then CRA using the same model/embedding without reinitialization. Its stopping test monitors changes in loss/Phi, not an absolute Phi≈0 condition, and thresholds outputs every epoch. Its QUBO builders also put both off-diagonals at2 for a one-edge MIS(penalty2) or MaxCut example. At x=(1,1), the resulting binary quadratic energy is2 versus0 for the printed lambda2 MIS/negative-cut formula. The MIS example still has a stronger feasibility penalty, but the MaxCut polynomial is not identical to negative cut. These are reproducible properties of the released demonstration; they do not establish which unprovided full-benchmark driver generated the paper's tables.

## Reproducibility

- All28 pages of the [formal NeurIPS2024 PDF](https://proceedings.neurips.cc/paper_files/paper/2024/file/54191f424e9013fc1d7b923f6e45dff4-Paper-Conference.pdf) were read, including every reference, scientific AppendicesA-F and checklist. Twelve key pages covering all principal figures, theory and benchmark tables were visually inspected. Publisher metadata verifies the author/two institutions, December16,2024 and DOI10.52202/079017-1495.
- The [publisher supplemental ZIP](https://proceedings.neurips.cc/paper_files/paper/2024/file/54191f424e9013fc1d7b923f6e45dff4-Supplemental-Conference.zip) has18 entries, containing Python/notebook code, bytecode and duplicate checkpoints, with no separate scientific PDF. Its three source files and complete16-cell notebook, including all stream outputs, were read. Checkpoint copies are byte-identical. OpenReview v1/v2 notes requests for `ykACV1IhjD` returned403. No explicitly missing scientific document was found.
- The [official seven-file repository](https://github.com/Yuma-Ichikawa/CRA4CO) was inspected at `fec02862f542b441d8d1643ab996474b2c1843d6`. Full README/requirements,137-line GNN/trainer,72-line utilities,41-line instance builder and every notebook cell/output were read. Publisher-ZIP code differs only in import paths; notebook installation/import cells differ but all stored outputs are identical. The demonstration uses sqrt(N) embedding width,100,000 epochs and tolerance1e-4, unlike some printed dimensions/limits/tolerances. A current README recommendation of the later QQA successor does not add its newer tasks or a future citation to this2024 article.
- `research/full-text-review/cra-co/recompute_scope.py` checks the finite-convexity/entropy arithmetic and executes only the isolated original QUBO-builder functions on one edge. This is not a neural training or benchmark rerun. Fifteen exact existing-paper citations are recorded; the paper's Sanokowski2024 reference is the VAG manuscript identified by its full title, not a guessed DiffUCO edge.
