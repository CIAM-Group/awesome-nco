---
id: geometric-constrained-nco
short_title: Geometric NCO
title: Geometric Algorithms for Neural Combinatorial Optimization with Constraints
authors:
- Nikolaos Karalias
- Akbar Rafiey
- Yifei Xu
- Zhishang Luo
- Behrooz Tahmasebi
- Connie Jiang
- Stefanie Jegelka
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/713939ee5a7b14a6fecf69e692ec3799-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/713939ee5a7b14a6fecf69e692ec3799-Abstract-Conference.html
institutions:
- Massachusetts Institute of Technology
- New York University
- University of California, San Diego
- Technical University of Munich
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Coverage
- Cardinality-Constrained Maximum Cut
- Cardinality-Constrained CO
- Matroid Optimization
summary: A neural feasible point is decomposed into constrained candidate sets for self-supervised learning and
  rounding; empirical gains depend on dataset, decomposition budget and classical postprocessing.
code_url: https://github.com/frankx2023/Neural_Combinatorial_Optimization_with_Constraints
figure:
  path: paper-assets/geometric-constrained-nco/framework.png
  alt: A constrained neural output is decomposed into feasible corners; expected objective trains the model and
    the best support set supplies an integral solution.
  caption: 'Figure 1: Convex-decomposition training and constructive rounding.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=2
---
# Geometric Algorithms for Neural Combinatorial Optimization with Constraints

> **TL;DR:** Predict a point in a feasible polytope, decompose it into discrete candidate sets, train with their expected objective, and return the best candidate. The paper connects geometric decomposition with constrained self-supervised learning. Its main evidence concerns weighted maximum coverage; feasibility and rounding statements require valid exact decompositions, and the public implementation differs from the published recurrence.

## Motivation

A soft neural prediction can violate combinatorial constraints after rounding. Penalty-based losses also require objective-specific constraint terms. This work instead builds feasibility into the distribution used for training: a convex combination of feasible solutions supplies both an expected-objective extension and candidates for inference. Efficient applicability depends on the chosen polytope and its optimization/projection operations, rather than following automatically for every NP-hard problem. [Sections 1-3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=3)

## Contributions

- A decomposition-based extension for Boolean constrained optimization, with almost-everywhere differentiability under the stated geometric/oracle assumptions.
- A cardinality-specific top-k decomposition and feasible neural-output map, plus theoretical worked constructions for partition/graphical matroid bases and a fractional stable-set relaxation.
- Short, medium and long maximum-coverage protocols trading additional candidates, augmentation and classical swaps for runtime.
- Comparisons with neural, reinforcement-learning, greedy and Gurobi baselines, learned-versus-random candidate-pool ablations, and a separate cardinality-constrained Max-Cut study. These experiments do not establish empirical generality across all theoretical worked examples. [Sections 4-6/Appendices D-H.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=7)

## Methodology

### Feasible distributions and the conditional rounding guarantee

For a Boolean feasible set C and P=conv(C), the network produces x in P. A geometric decomposition expresses x as a convex combination of feasible corners, with nonnegative probabilities summing to one. The extension F(x) is the probability-weighted discrete objective. Maximization trains the model to increase this expectation; the best support solution has objective at least F(x). This last inequality is an elementary consequence of a **valid normalized distribution of feasible sets**, not an approximation ratio against the global optimum. Equality between the globally best extension value and the discrete optimum does not prove that gradient training finds that value. [Section 4/Theorems 4.1-4.3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=5)

The general construction assumes a well-described rational polytope and access to strong linear optimization, together with valid face and boundary operations. Its polynomial oracle/encoding statement is conditional: an efficient linear oracle for the exact TSP polytope, for example, cannot simply be assumed. A general d-dimensional point needs at most d+1 corners; cardinality's hypersimplex has dimension n-1. [Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=18)

For exact cardinality k, choose the current top-k coordinates as a corner S. The maximal step is a=min(min selected x, 1-max unselected x), followed by **(x-a*1_S)/(1-a)** on the entire residual vector. A centering/scaling map puts neural outputs in the hypersimplex. Practical variants use nine scales, 1,.8,.6,.4,.2,.1,.05,.02,.01, and truncate candidate generation. Truncation leaves residual convex mass unless it is explicitly retained or another distribution is defined. The exponential residual bound requires its coefficient lower-bound assumptions; the stated fallback can produce coefficients below that lower bound. [Section 4.3/Appendices C-D.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=22)

### Other constraints and their limits

Partition examples concern **bases with fixed cardinality in each block**, not arbitrary upper-bound independence constraints. The final graphical-matroid algorithm includes all relevant rank constraints and a submodular-minimization feasibility procedure when selecting a coefficient; the earlier supplementary manuscript's box-only rule is not the final general algorithm. The independent-set example uses FSTAB, a fractional relaxation with half-integral corners. Those corners are not automatically independent sets; the paper discusses extra constraints or objective treatment. No MIS benchmark is supplied. [Appendices D-F.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=25)

### Inference and classification

Short mode evaluates up to 50 sets for each of nine scales and selects the best. Medium uses up to 100 per scale, then at most ten improving single-element swaps from a fixed pool derived from scale .1. Long adds five noisy/edge-dropped graph views and up to k swap iterations, evaluates on the original objective, and keeps the best result. These are the **paper's protocols**; release configuration differences are documented below. [Appendix G.3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=34)

The neural model creates a static set of candidates and candidate-pool elements. Subsequent swaps are selected by exact objective improvement, without a newly learned incumbent-edit operator or neural parameter adaptation. The entry remains **specialist / constructive**, with classical postprocessing made explicit. This does not remove the model's contribution: replacing the learned candidate pool with a random pool of equal size reduces swap gains in the reported ablation. The cardinality/Max-Cut models and dataset/k checkpoints also do not constitute one shared cross-problem generalist checkpoint.

## Experiments

### Data, training and compute

Maximum coverage chooses k candidate nodes to cover weighted element nodes. Random500 has 500 candidates/1,000 elements, and Random1000 has 1,000/2,000, with 100 graphs per family; the Appendix G construction fixes which side the name denotes. Candidate degree is uniform 10-30 and element weights are uniform 1-100. Six Twitch graphs have 1,912-9,498 vertices on each copied bipartite side; three railway graphs have 507/516/582 candidates and 63,009/47,311/55,515 elements. The explicit railway sizes support roughly 63.5k nodes at the largest instance, rather than independently verifying the abstract's broader size wording. [Appendix G.1.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=32)

The paper describes three GraphSAGE layers plus fully connected projection, 80 epochs, batch four, AdamW learning rate .005, weight decay .0001, warmup/cosine scheduling, and entropy/noise/sharpness schedules. Hardware is a 16-core Xeon Platinum 8268 setup with 32GB RAM and an RTX8000 48GB GPU. Public training splits shuffled graph/k samples 80/10/10 and separately loads test pickle files; this is distinct from the Max-Cut 60/20/20 split. The release uses four message-passing stages, 20 warmup epochs and entropy .005, differing from the described three stages/50 warmup/.05 entropy. [Appendix G.2 and inspected release.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=33)

Gurobi 12.0.1 has a 120-second cap; random search has 240 seconds. Greedy, EGN, CardNN variants, UCOM2 and an actor-critic baseline have different inference mechanisms and budgets. The paper's characterization of a particular UCOM2 implementation as effectively non-learning is an empirical interpretation of its ablations, not a general reclassification of all UCOM2 uses.

### Coverage quality and runtime

| Setting | Reported result | Comparison and scope |
| --- | --- | --- |
| Random500, k=50 | Long 44,866.84 / 24.99s | Greedy 44,597.56 / .121s: higher coverage at substantially greater time. |
| Random1000, k=20 | Short 29,810.12 / .825s | RL 29,912.14 / .102s is both better and faster in this row. |
| Railway, k=50 | Short 7,411.67 / 2.084s | RL 7,456.67 / .219s is better and faster; long reaches 7,631 / 43.28s. |
| Twitch, k=20 | Long 18,526.83 / 26.44s | Greedy 25,855.50 / .397s and CardNN-GS 25,864 / 10.16s remain stronger. |

Consequently, the short-mode blanket superiority wording is not supported uniformly by the numerical tables. Long mode is not uniformly best either: Random1000/k=100 gives 88,796.03 versus UCOM-long 89,408.28 and capped Gurobi 89,696.83. Railway/k=20 gives 5,613.33 versus greedy 5,617. The warm-start **short+Gurobi** variant is a separate classical-solver protocol. [Tables 5-8.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=40)

With the same initial solution and equal pool size, learned-pool medium/long improvements are 2.41/3.28% on Random500/k=10, versus random-pool .23/1.02%; Random1000/k=100 gives 3.83/8.07% versus 2.84/5.79%. These results support usefulness of the static learned pool, while not isolating every training/rounding component. Standard deviations are not confidence intervals over independent training runs. An unreconciled UCOM-long Random500/k=10 value differs between Table 2 (15,779.45) and Table 5 (15,679.45); neither is silently substituted for the other. [Table 1 and full ablations.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=34)

### Separate cardinality-constrained Max-Cut ablation

IMDB-BINARY supplies 1,000 graphs averaging 20 nodes, and 1,000 Erdos-Renyi graphs have 50-100 nodes, edge probability .15 and mean size 75. Each uses a 60/20/20 split, excluding graphs smaller than k. The four settings use k=5/15 and 15/60. Direct optimization performs 150 Adam steps with learning rates .015/.012; the final text specifies one eight-layer GatedGraphConv network with two linear layers and length-ten random-walk positional encodings. Test-instance neural optimization is separate from ordinary offline SSL. [Appendix H/Table 9.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=42)

Reported scores for neural test optimization are .971/.932/.910/.902, versus greedy 1.000/.801/.985/.900 and offline SSL .956/.905/.899/.889. The paper does not clearly define the displayed normalization, so these are **reported scores**, not newly asserted certified approximation ratios. Greedy is stronger at small k; the neural test-optimized variant is stronger in the large-k IMDB setting. These are cardinality-constrained cuts, not k-way graph partitioning.

## Limitations

### Discussed in the Paper

Efficient generalization requires the appropriate feasible polytope operations. Truncated decompositions and support selection trade cost against performance. Dataset transfer, including Twitch, is limited, and neural methods need not outperform greedy or solver-based baselines. [Conclusion/Appendices G-H.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=10)

### Curator Notes

- Exact decomposition guarantees, finite practical candidate distributions and neural training success are distinct statements. Half-integral FSTAB vertices do not give an unconditional feasible-MIS rounding guarantee.
- Appendix B.1 identifies a containing face with an x-weighted maximizer. Taken literally, this does not ensure the minimal face needed for positive progress: on the square, x=(0,.5) and a lexicographic maximizer (1,1) permit no positive subtraction. The general theorem should be used with a valid minimal-face procedure.
- Theorem E.7's claimed continuity for every nonnegative weight vector needs qualification at disconnected positive-support boundaries. For a one-edge/two-vertex graph its tree marginal is one at every positive weight, while the stated zero-weight pseudoinverse expression is zero. Smoothness on strictly positive weights, or a connected positive-support neighborhood, does not imply that all boundary cases are continuous. This is a curator mathematical check, not an experimental result. [Appendix E.](https://proceedings.neurips.cc/paper_files/paper/2025/file/713939ee5a7b14a6fecf69e692ec3799-Paper-Conference.pdf#page=30)
- The released recurrence and finite-mass redistribution differ from the proof; sampled sets still have k elements, but the advertised convex reconstruction is not thereby implemented faithfully. No benchmark rerun has established the effect of these differences.
- Time/quality tradeoffs, unequal solver caps, absent independent training-seed intervals, theoretical-only tasks and ambiguous Max-Cut normalization limit broad superiority claims.

## Reproducibility

- **Full reading:** all 49 final NeurIPS pages and all 46 pages of the actual official Supplemental ZIP's sole PDF, `Greedy_Algorithmic_alignment_final.pdf`. Every appendix, proof, figure, table and checklist was read. Key framework, formulas, all coverage plots/full numerical tables and Max-Cut table were visually inspected.
- **Version provenance:** the ZIP contains an earlier anonymous full manuscript, not an additional final appendix or code package. The final adds the fuller strong-oracle argument, corrects the facet-step denominator, adds graphical-matroid rank constraints and short+Gurobi results, and changes some MIS/architecture wording. The note follows the final version and records the older source independently; it does not treat the two as byte-equivalent.
- **Metadata:** official NeurIPS2025 seven-author title page/proceedings, MIT/NYU/UCSD/TUM affiliations and first-two equal contribution were checked. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2025/hash/713939ee5a7b14a6fecf69e692ec3799-Abstract-Conference.html) explicitly records `citation_publication_date` as **2026-04-23**, independently of any paper-specific acceptance date. No unsupported acceptance day or first-preprint date is introduced.
- **Code:** the official 83-entry repository tree, README, full decomposition/refinement routines, model mapping and selected training/evaluation/config/data code were inspected. No separate PDF/TeX/notebook scientific attachment appears in that tree. The release covers maximum coverage and RL; the Max-Cut/matroid/MIS experimental implementation was not identified there.
- **Important release differences:** selected residual coordinates are only decremented by a, while unselected coordinates alone are divided by (1-a). For x=(.8,.7,.5), k=2 and a=.5, this yields residual (.3,.2,1), summing to 1.5 instead of 2. The code also distributes leftover mass uniformly across previous corners and renormalizes, rather than preserving exact reconstruction. Its feasible-output scaling differs from the paper, and the shown config uses medium 50/long200 decomposition steps and ten long swaps, versus the paper's medium100/at-most-k long swaps. These differences are reported, not patched in upstream code.
- **Figure:** original complete Figure1/page2 cropped from the final proceedings PDF. Local deterministic checks document the recurrence, minimal-face and weighted-tree boundary examples. No full training/benchmark rerun was performed.
