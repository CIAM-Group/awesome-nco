---
id: ucom2
short_title: UCOM2
title: 'Tackling Prevalent Conditions in Unsupervised Combinatorial Optimization:
  Cardinality, Minimum, Covering, and More'
authors:
- Fanchen Bu
- Hyeonsoo Jo
- Soo Yong Lee
- Sungsoo Ahn
- Kijung Shin
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/bu24b.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/bu24b.html
institutions:
- KAIST
- POSTECH
- AI4CO Open-Source Community
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Graph Optimization
problems:
- Facility Location
- Maximum Coverage
- Robust Graph Coloring
summary: UCOM2 derives independent-variable probabilistic objectives and incremental
  greedy derandomization for common constraints; task-specific GNN experiments cover
  facility location and coverage, while robust coloring directly optimizes probabilities.
code_url: https://github.com/ai4co/unsupervised-CO-ucom2
---

# Tackling Prevalent Conditions in Unsupervised Combinatorial Optimization: Cardinality, Minimum, Covering, and More

> **TL;DR:** Build differentiable expectations for common combinatorial conditions, then greedily fix or improve variables using incremental objective changes. Facility location and maximum coverage use separately trained GNNs; robust coloring directly optimizes per-instance probabilities. Exact derandomization results concern a penalized objective, with further conditions required for feasibility.

## Motivation

Unsupervised neural CO can optimize a probabilistic objective without solution labels, but constructing an appropriate relaxation and decoding it efficiently are separate challenges. Cardinality, minimum-over-a-selected-subset and covering conditions require more than thresholding marginal probabilities. UCOM2 derives reusable components and asks how to avoid reevaluating the entire objective for every potential rounding decision (Sections1-3).

## Contributions

For independent Bernoulli decisions, the expectation of a finite discrete function is differentiable and multilinear, hence entry-wise concave. The paper derives probabilistic objective/penalty expressions and incremental changes for cardinality, subset minimum, covering and clique conditions. It extends the framework to independent categorical decisions and uncertain edges. Greedy derandomization selects the best coordinate/value pair and may revisit coordinates, seeking a discrete one-coordinate local minimum of the penalized objective (Theorems1-2/5-6).

The principal experiments address facility location, maximum coverage and robust coloring. AppendixE additionally sketches robust k-clique, robust dominating set, clique cover and minimum spanning tree formulations; these are not benchmarked neural solvers. TSP/MST empirical development is explicitly deferred. The article supplies a common framework rather than one checkpoint solving several native tasks (Sections5-6; AppendixE.5).

## Methodology

Construct an expectation of an objective or a discrete upper-bound penalty. For a desired cardinality set, penalize the distance between the selected count and that set, using its Poisson-binomial distribution computed through a discrete Fourier transform. For subset minimum, sort candidates by distance and sum the probability that each is the nearest selected candidate. For covering, the product of exclusion probabilities is the probability of being **uncovered**. Clique penalties sum probabilities of selecting nonedges. Categorical coloring uses same-color probabilities for hard conflicts and negative log probabilities for violated soft edges (Sections4-5).

Use gradient descent either on a task-specific encoder or directly on probability parameters, then greedily evaluate incremental conditional changes. The exact Theorem2/6 process can reach a discrete solution no worse under the relaxed penalty and locally optimal against one-coordinate changes, with progress on rounding ties. It does not establish global optimality or unconditional feasibility. The paper's recalled/extended feasibility result additionally assumes a nonnegative upper-bound objective and beta greater than both the initial loss and the maximum feasible objective; an arbitrary positive penalty coefficient is insufficient (AppendicesB.2/D.1).

Facility-location and coverage experiments are inductive, with distinct architectures and saved models. Facility location uses a three-layer SplineConv GNN; coverage uses a three-layer bipartite GraphSAGE model. The code trains each for100 epochs. Real-world graphs use a model trained on random500 instances of the **same** problem. Robust coloring instead applies Adam to per-instance categorical logits; its experiment does not train a neural encoder (Sections6/G.1; inspected source).

## Experiments

**Protocols.** Synthetic groups contain100 graphs: facility location uses500/800 points and coverage uses500sets/1,000items or1,000sets/2,000items. Real cases include Starbucks/McDonald's/Subway locations, Twitch networks and Italian railway coverage data. Facility objectives sum squared Euclidean distances to the nearest chosen center; reported groups choose30 centers, except random800 uses50. Models use disjoint synthetic training/testing graphs. Hyperparameter selection compares15 combinations per method, using training objectives for synthetic distributions and the smallest real graph as validation. Results average five independent trials (Section6; AppendixF.1).

Short/middle/long UCOM2 variants differ in test-time augmentation counts and best-candidate selection, adding Gaussian feature noise and edge dropout with scale .2. They are quality/runtime trade-offs, not a single method uniformly dominating every baseline. The machine has two Xeon Silver4210R CPUs,256GB RAM and RTX2080Ti11GB GPUs; GPU methods use one GPU. MIP budgets are nominally120seconds for selection tasks and300seconds for coloring, with solver overruns reported; random search gets240seconds for selection tasks (AppendixF).

**Facility location.** Table4's random500 result is2.40 in73.86seconds for UCOM2-long versus CardNN-HGS2.41 in100.40seconds. UCOM2-short is faster at .91seconds but has objective2.51. Long achieves the best printed normalized objectives across the five groups, with random500 ties after rounding. These normalized values and limited-budget solver comparisons are not approximation ratios to certified optima (Tables1/4).

**Maximum coverage.** Table5 gives UCOM2-long45,000.41 in30.02seconds on random500 versus Gurobi44,880.59 in120.05seconds. Twitch is an exception: all three variants give33,828.40, below Gurobi/SCIP33,840.40. Greedy is much faster there (.69seconds versus UCOM2-short1.82seconds) with33,822.40. Railway long7,620.50 improves the listed CardNN-HGS7,619.90 slightly, with reported variance across trials. Near1.00 normalized values can hide these differences (Tables2/5).

**Robust coloring.** Four uncertain graphs use eight graph/color-count settings; the highest-weight20% of edges become hard constraints. Compared with the limited-budget Gurobi row, UCOM2 has five strictly better objectives, two worse and one tie: Gavin8colors42.99 exceeds Gurobi42.41, Krogan8colors53.44 exceeds46.78, and Krogan15colors ties .87. GPU times are1.91-17.25seconds; CPU times are reported separately. The quality statistic is negative log-likelihood of no violated soft conflict, not a count of colors or an optimality gap (Table3; AppendixF.1.4).

**Ablations.** Improved objective formulas alone can increase runtime, and facility random800 is slightly worse with iterative rounding (2.67 versus EGN-naive2.63). Greedy incremental decoding yields stronger trade-offs in the reported ablation. Tables10-11 show approximately181-1,232-fold speedups of the **derandomization component** against naive full reevaluation, not end-to-end speedups over all competing solvers. Penalty sensitivity remains, particularly on real graphs (Tables6-14).

## Limitations

Independence assumptions and tractable component formulas restrict applicability. Encoder training has no global-convergence guarantee, local optimality is for a chosen penalized objective, and numerical/heuristic decoding differs from exact derandomization. Same-problem distribution transfer is not native-task checkpoint sharing. The authors explicitly acknowledge weak evidence for cycles/trees and that random initial probabilities can sometimes rival learned encoders out of distribution (AppendicesE.5/G).

### Curator Analysis

The following checks concern literal printed formulas and assumptions, not a blanket rejection of the empirical results or of the multilinearity/local-improvement results.

- **Minimum and covering changes.** In Lemma5, use the valid facility-distance row d=(0,1), probabilities(.5,.5), and set the second probability to1. The printed minimum expression changes from .25 to .5, so the increment is .25, but the printed x=1 incremental formula returns0. Its derivation drops the all-empty mass. An explicit empty-set convention is also needed to interpret the minimum expectation. Lemma7 labels a nonempty event while its product evaluates the empty event; Lemma8's x=0 product uses `(p_v-1)`, producing-.25 instead of the correct+.25 with two .5-probability neighbors. Cardinality sums must include count0; literal `[n]` as defined in the paper excludes it (PDF4-5/15-17).
- **Minimum values, argmin sets and probability bounds.** A multilinear expectation preserves a discrete function's minimum value, but can have fractional minimizers on flat faces: a constant function has continuous argmin[0,1], not just binary vertices. Thus propertyP5's argmin-set equality needs qualification. The printed Theorem7 probability conditions also fail for all-feasible f identically1, beta2, epsilon .5 and t .5: the displayed conditions hold but the claimed success probability is0. The Markov argument needs the objective/epsilon relation and the infeasibility-penalty convention corrected; the stronger deterministic feasibility conditions are stated separately (PDF3/19/21-22).
- **Additional recipes.** The robust dominating-set expression in AppendixE.2 omits whether a neighbor is selected. With two nodes, an uncertain edge of probability .5, the instructed probability1 self-loops and selected set{0}, the true expected uncovered count is .5 whereas the printed all-neighbor product gives0. AppendixE.4 allows every node in layer0, yielding no parent edges, zero penalty and zero cost even on a positive-weight two-node connected graph. A unique-root/connectedness condition is needed for an MST construction. These unbenchmarked sketches are not treated as validated neural implementations (PDF23-25).

**Public implementation.** The current facility/coverage scripts include count0 and extra practical safeguards: truncated conditional recurrences (`s_max=100`), .001/.999 assignments, stronger final cardinality penalties and final top-k selection. Facility location additionally multiplies low-cardinality penalties and applies discrete k-means after top-k. Its inspected incremental-add expression retains the printed minimum-mass omission. The coverage launcher sets `zero_start=True` on Twitch, replacing GNN outputs with zeros. Thus those Twitch runs do not demonstrate encoder benefit. Robust coloring uses positive `H_soft.max()` rather than the printed negative `max log(1-P)` coefficient, with a stronger10,000 penalty during final improvement. These are static release observations; no neural benchmark was rerun.

Some repeated table entries differ: Subway short time3.56seconds in Table4 versus10.35 in Table8, and Krogan8 objective53.44 in Table3 versus52.44 in Table14. The note retains the main/raw table values and does not silently reconcile unprovided logs.

## Reproducibility

- All34 pages of the [formal ICML2024 PDF](https://raw.githubusercontent.com/mlresearch/v235/main/assets/bu24b/bu24b.pdf) were read, including every reference, proofs and scientific AppendicesA-G. Sixteen key pages were rendered and visually checked, covering the only main figure, all principal tables and critical proof/formulation pages. PMLR235 verifies July8,2024, pages4696-4729 and five authors with KAIST/AI4CO/POSTECH affiliations.
- The publisher exposes the integrated PDF and OpenReview record, without a separate scientific supplement link. OpenReview v1/v2 notes requests for `6n99bIxb3r` returned403. The official177-file tree has no PDF/ZIP scientific attachment; no explicitly missing scientific document was found.
- The [official repository](https://github.com/ai4co/unsupervised-CO-ucom2) was inspected at `3adbf5452415cdd5a58f6802554ec4dadf84064f`. Root and both task READMEs, complete FL/coverage launchers, full robust-coloring359-line script and Poisson-binomial52-line utility were read, together with the relevant model/loss/decoder sections. The49 `.pt` files are **datasets**, not49 pretrained model checkpoints. Saved-model directories are generated by training.
- `research/full-text-review/ucom2/recompute_scope.py` executes small exact arithmetic checks of the printed formulas. It does not train a GNN or reproduce the tables. Twenty-nine current-catalogue references are matched by explicit body and full bibliographic identity, including the old BQ-NCO title matched by its five authors and manuscript identity rather than dropping a valid citation because its title changed.
