---
id: x2gnn
short_title: X2GNN
title: Learning to Explore and Exploit with GNNs for Unsupervised Combinatorial Optimization
authors:
- Utku Umur Acikalin
- Aaron Ferber
- Carla Gomes
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/e944bacecce6b06374ac39b260348db0-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/e944bacecce6b06374ac39b260348db0-Abstract-Conference.html
institutions:
- Cornell University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Optimization
problems:
- Maximum Cut
- Maximum Independent Set
- Maximum Clique
- Maximum Weight Independent Set
summary: X2GNN couples candidate graph solutions with cross-attention and repeatedly
  refines perturbed soft outputs, using unsupervised objective and diversity losses;
  native task checkpoints remain separate.
code_url: https://github.com/utkuumur/X2GNN
---

# Learning to Explore and Exploit with GNNs for Unsupervised Combinatorial Optimization

> **TL;DR:** Couple parallel soft graph solutions through attention, then reuse the network to refine randomly perturbed outputs. Search trades parallel candidates for sequential refinement without optimal-solution labels. The paper demonstrates separate MIS, clique and MaxCut models, with an additional adapted weighted-MIS model.

## Motivation

A small set of independent neural predictions can miss good graph solutions. X2GNN combines exploration through diverse interacting candidates with exploitation through stochastic iterative refinement. The relevant trade-off is not simply more forward passes: clique and independent-set feasibility shrink differently as nodes are selected, so their preferred allocation of parallel candidates and refinement steps can differ (Sections1-3/5.5).

## Contributions

The method constructs a multilayer graph containing K copies of the original graph, with cross-edges joining copies of each node. Within-copy GIN layers and cross-copy GAT attention let candidate solutions exchange information. The tested default K=2 couples two solutions; C independent couples give 2C candidates per outer iteration. A diversity loss discourages overlapping selected nodes for MIS/clique or overlapping cut edges for MaxCut. Two-stage unsupervised training first learns construction, then refinement (Sections4-5).

This is a specialist improvement solver. Construction and refinement reuse weights within a native task, and trained models transfer across sizes/distributions. The native-task models are trained separately. Clique is represented as MIS on the complement graph, but that reduction does not establish one deployed checkpoint shared between native clique and MIS. Weighted MIS adds a weight embedding and weighted loss, rather than demonstrating unchanged unweighted weights solving another task (AppendixB.2).

## Methodology

Initialize node probabilities near .5, use a GNN to predict soft inclusion probabilities, and obtain the next input by randomly zeroing some previous soft predictions. The outer recurrence conditions on the previous candidate output, rather than selecting the globally best incumbent as its next input. Best decoded solutions are retained for reporting. The architecture also has an inner hidden-state recurrence; it is distinct from the outer soft-solution refinement loop. Maximum clique operates on the complement graph, MIS/clique use feasibility repair/decoding, and MaxCut thresholds probabilities (Section4; AppendixA.1).

Training minimizes a negative objective plus constraint and diversity penalties, with no optimal labels. Table1 prints positive objective sizes/cut values in a minimization expression; the inspected MIS training code uses `-mis_loss + penalty_loss + div_coef*div_loss`. Thus the note describes the executable objective sign, without treating the printed sign convention as evidence that experiments maximized the wrong quantity. Default training uses four couples, hidden width64, four GIN/GAT pairs, learning rate .001, batch64 and separate construction/refinement stages. Tables specify50 epochs; the released loop runs the configured epoch count in each stage (AppendixA; released MIS trainer).

## Experiments

**Main graph benchmarks.** Training uses4,000 graphs per distribution and testing typically500, with128 ER test graphs. Table2's largest clique-search setting reaches19.074 on RB250 and40.17 on RB1000, with the latter a1.19% mean gap to the reported reference in23.5 seconds per instance. Gurobi/KaMIS report40.652 in287/51 seconds. These are average quality/runtime trade-offs, not a guarantee that every output is within1.2% of an optimum. For MIS, the strongest native settings have reported drops .04%/.94%/.72% on RB250/RB1000/ER relative to KaMIS references. A smaller MIS model transfers to larger graphs, but remains below dedicated larger-distribution models (Tables2-3).

**MaxCut and scaling.** Table4 reports BA1000 cut2989.3 with zero gap to the compared methods' virtual best in7.3 seconds; Gurobi's30-minute run gives2966.58. On BA250, X2GNN735.26 is slightly below Gurobi735.32. The million-node regular-MIS experiment takes roughly600 seconds and uses analytical reference densities, not certified finite-instance optima. Runtimes are means per instance. Traditional heuristics use one CPU core, Gurobi four, and neural methods one A10080GB. Baseline times are rerun on the authors' machine, while original solution-quality values are reused where available (Section5; AppendixA.3).

**Ablations and transfer.** K=2 is best among tested K=1/2/4/8 settings. On the selected MIS experiment, deterministic refinement raises the drop from .43% to4.97%, one-stage training to1.44%, and removing diversity to1.81%. These establish empirical contributions in that setting, not a universal optimal K or allocation rule. AppendixB's37 DIMACS clique cases give mean gap17.41% before fine-tuning and6.68% after, compared with KaMIS3.87%. Some base outputs are zero; fine-tuning can also worsen individual cases such as keller5/6. Its separate training cost is not reported. The printed DIMACS paragraph says an RB1000-trained clique model, whereas main clique training/settings list RB250; this checkpoint-description discrepancy remains explicit (Tables5/7).

The32 coding-theory MIS cases match best-known values on20 instances versus KaMIS28, with mean gaps3.37% versus .34%. Excluding the large outlier changes X2GNN's gap to1.74%; that is a conditional subset statistic. Weighted MIS uses integer weights1-5 and reaches objective82.28 versus Gurobi82.94 (.8% gap), taking4.92 versus .21 seconds. The GAT-to-MLP ablation has weaker low-budget cases, so not every MLP configuration beats other neural methods (Tables8-10).

A separately ER-trained MaxCut model transfers to14 SNAP and35 unweighted Gset graphs. Table12 gives virtual-best mean gaps .12%/.11% for its two budgets, versus ANYCSP .69%/.56%, BLS .01% and KHLWG .13%. SNAP includes ties and two exceptions. Best-known/virtual-best references are not optimality certificates. Increasing the budget across separate runs can worsen individual Gset rows; this is different from retaining the best value within a single run (Tables11-12).

## Limitations

Search cost grows with candidate count and sequential iterations. No convergence, monotonic raw-output improvement or approximation-ratio theorem is supplied. Cross-size transfer is not cross-native-task checkpoint sharing. Objective penalties, graph complement density, feasibility decoding and hardware/runtime protocols affect comparisons. Strong classical solvers still lead on several quality or speed measures, and fine-tuning results include additional adaptation.

### Curator Analysis

The printed `(2C x T)` label denotes copies times outer iterations, but released example MIS flags `--k2 8 --R 256` mean eight actual graph copies over256 iterations, while main paper labels often reverse those dimensions. Reproduction should record flags and candidate count rather than infer the exact allocation from a label alone. The available clique checkpoint is named `rb250-300.pt`, whereas its pretrained example requests `rb200-300.pt`; the ER MIS example similarly requests a name differing from `er750.pt`.

The current NumPy undirected-pair constructor writes the reverse cross-edge as `base + 2*i + 1*N` rather than `base + (2*i+1)*N`. An isolated execution for N=3 and four copies produces an unexpected edge(5,6) and misses the intended(9,6). This is a reproducible current-release discrepancy for later pairs, not evidence that the unprovided historical experiment environment used that code or that all reported results fail. No neural benchmark was rerun.

## Reproducibility

- All19 pages of the formal ICLR2025 PDF were read, including all references, AppendicesA-B, twelve tables and three figures. Twelve pages were visually inspected, including architecture/loss, main comparisons, ablations and every appendix table. Publisher metadata verifies three Cornell authors and May1,2025; publisher spelling Carla Gomes is retained while the PDF expands Carla P.Gomes.
- The publisher exposes Paper/Bibtex without a separate scientific supplement. Both OpenReview API notes requests for `vaJ4FObpXN` returned403. The complete scientific appendices are integrated in the formal PDF; no explicitly missing scientific document was found.
- The [official repository](https://github.com/utkuumur/X2GNN) was inspected at `feb6d8d1c45c586023f514c3bc157c37c5a7b132`:42 files, six PT checkpoints, auxiliary data and no PDF/ZIP scientific attachment. Full root/data READMEs, MIS utilities/data constructors and selected model/training/evaluation paths plus example shell scripts were read. Checkpoint folders confirm separate native tasks. Training data are not all bundled; the data README links external downloads. Code paths, filenames and budget semantics require reconciliation as described above.
- The local `recompute_constructor.py` executes only the original array constructor, without Torch training. 10 existing-paper edges require explicit body and full-reference evidence. T2T is included after manual hyphenated-title identification; table-only DIMES mentions without a matching full bibliography entry do not create an inferred edge.
