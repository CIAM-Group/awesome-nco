---
id: coexpander
short_title: COExpander
title: 'COExpander: Adaptive Solution Expansion for Combinatorial Optimization'
authors:
- Jiale Ma
- Wenzheng Pan
- Yang Li
- Junchi Yan
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/ma25r.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/ma25r.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Graph Optimization
problems:
- Maximum Independent Set
- Maximum Clique
- Minimum Vertex Cover
- Maximum Cut
- Traveling Salesman Problem
- Asymmetric Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: Partial-solution-conditioned heatmaps guide greedy commitment of variable groups, with separate task/scale models; six main problems and a weaker CVRP extension expose task-dependent quality/time tradeoffs.
code_url: https://github.com/Thinklab-SJTU/COExpander
figure:
  path: paper-assets/coexpander/framework.png
  alt: A neural heatmap conditioned on fixed partial decisions guides greedy variable assignments and mask updates for node- and edge-selection tasks.
  caption: 'Figure 1: Partial-solution prediction and adaptive determination; committed decisions condition the next prediction.'
  source_url: https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=3
---
# COExpander: Adaptive Solution Expansion for Combinatorial Optimization

> **TL;DR:** Repeatedly predict a full heatmap while preserving already committed decisions, then greedily fix another group of variables. The method bridges one-shot prediction and single-action construction through **adaptive expansion**. It uses separately trained task/scale models, and its best settings can include classical search or even single-determination prediction; the headline aggregate is qualified by inconsistencies in the published summary table.

## Motivation

One-shot heatmaps can become uninformative as greedy decoding diverges from their initial global context. Autoregressive construction updates that context but requires many sequential predictions. COExpander aims to choose an intermediate decision granularity: use global predictions, commit a feasible partial solution and condition the next prediction on those commitments. The paper calls this Adaptive Expansion (AE), distinct from its Global Prediction (GP) and Local Construction (LC) categories. These labels describe its variable-determination framework; they do not change the repository's separate construction/improvement taxonomy. [Sections1-3/AppendixB.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=2)

## Contributions

- Partial-solution prompting for a graph-based consistency predictor, together with supervised training from solver-generated solutions.
- Task-specific greedy determination operators with conflict-aware stopping and variable-group commitment.
- A collection of29 benchmark settings covering six main problems, baseline wrappers and detailed training/evaluation configurations.
- Extensive ablations, real-world/large-instance tests, optional classical postprocessing and an additional **CVRP extension** whose quality remains weaker than the compared construction baseline. Thus seven problem types are evaluated when the extension is included. [Sections4-6/AppendicesD-H.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=9)

## Methodology

### Partial-solution-conditioned prediction

The global predictor follows Fast-T2T's discrete consistency approach. Training corrupts a solver-provided target at two noise levels and predicts its binary decisions. A random mask replaces some noisy variables with their target values, teaching the predictor to work from partial commitments. With probability.9 the sampled prompt fraction is zero; otherwise that fraction is uniform on[0,1], followed by task-specific propagation, such as fixing neighbors of a selected independent-set node. [Equations1-5.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=4)

The implemented backbone has12 graph-convolution layers with hidden width256. Embeddings and outputs are tailored to node versus edge tasks; ATSP uses edge-only features because coordinates are unavailable. Calling this architecture task-agnostic does **not** mean its parameters are shared across tasks: Table13 explicitly lists21 individually trained main models, including scale curricula and objective-fine-tuned cut models. [Section4.3/AppendixF.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=21)

The supervised objective is a sum of classification losses at two noise levels. Equation3 motivates it using the triangle inequality, then specifies binary cross-entropy for the distance. **BCE is not a metric and does not generally satisfy that inequality**: for prediction values.1/.2 and target0, BCE(.1,.2)≈.5448 exceeds BCE(.1,0)+BCE(.2,0)≈.3285 under the standard prediction/target convention. The supervised objective remains well-defined, but the stated triangle-inequality argument is not treated as a general guarantee of optimization consistency. This deterministic check is recorded separately from any empirical benchmark.

### Determination and search

Each round samples fresh noise, overwrites committed entries, performs the chosen number of consistency inferences and obtains a heatmap. Greedy determination then commits variables until a threshold or a conflict is reached. MIS selects high-probability nodes and excludes neighbors; clique excludes non-neighbors; MVC excludes low-probability nodes and includes their neighbors; cut commits the most confident partition assignments. TSP/ATSP use edge scores while preserving tour feasibility. The final round completes the solution. [Algorithm1/Section4.2.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=5)

The main controls are independent: **S** is the number of sampled heatmaps, **Ds** the maximum determination rounds and **Is** the denoising inferences within each round. Approximate neural work scales with S×Ds×Is, but conflict stopping, sparsity and classical search also affect runtime. The public implementation has task/size-specific thresholds, including three-round routing schedules; “adaptive” does not imply a learned universal schedule or that every round commits an equal fraction.

Optional components must be identified by protocol. Beam16 is used for selected clique/MIS results at **Ds=1**, which the paper itself calls GP rather than AE. Routing tables include classical2-opt, with a default5,000-iteration cap; the ATSP operator relocates a node rather than applying a symmetric subsequence reversal. MIS can use classical RLSA after construction, with1,000 parallel chains and dataset-specific iterations/temperatures. Cut objective-guided fine-tuning uses the original training data, **not per-test-instance adaptation**. [Section5.3/6.1.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=7)

The entry remains **specialist / constructive**. Its neural process commits a growing partial solution; learned revision of complete incumbents is not the proposed core. Classical2-opt/RLSA do not by themselves establish neural improvement. Separate task/scale checkpoints and a common architecture do not establish a single multi-task solver.

## Experiments

### Data, training and resources

The six main problems are MIS, clique, vertex cover, cut, TSP and **metric ATSP**; ATSP matrices satisfy triangle inequality and do not represent every arbitrary directed-cost instance. Graph distributions include RB, ER with edge probability.15 and BA with four attachments. RB/BA size bands are200-300,800-1,200 and2,000-3,000. Additional tests use SATLIB-derived MIS, Twitter/COLLAB graphs,49 TSPLIB instances and TSP up to10,000 nodes. [AppendicesC/E.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=20)

Training labels come from Gurobi, KaMIS, Concorde or finite-budget LKH; labels called optimal in the model discussion are not all certified optima. Initial settings generally use at least50 epochs, learning rate2e-4, AdamW/weight decay1e-4 and cosine decay. Larger graph tasks can continue for10 epochs at5e-5, but the exact table retains50-epoch stages for TSP100/500/1,000 and ATSP100/200. TSP50/100 have1.28 million training instances each; TSP500/1,000 have64,000;10,000-node training uses6,400. The latter **fine-tunes the1,000-node checkpoint**, so it is not a zero-shot10,000-node demonstration. [Tables12-13.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=21)

TSP sparsification is size-dependent: Table13 lists50 neighbors at500/10,000 and100 at1,000, whereas nearby prose says50 more generally. ATSP stays dense after measured edge losses under sparsification. Observed retention of all target TSP edges in a finite study is not a guarantee that nearest-neighbor sparsification always preserves optimal tours.

Evaluation uses an H80080GB and Xeon Platinum8558, with one GPU and batch1, or single-thread classical runs. Times are average **per instance**. Neural baselines use available checkpoints or retraining, identified by table symbols; these are standardized re-evaluations rather than original headline numbers. DualOPT rows marked with a dagger are explicitly taken from its paper and are an exception to the common re-evaluation protocol. Offline label generation, reported as hours to tens of hours per dataset, and model training are additional costs. [Sections5.1-5.2/AppendicesF/H.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=6)

### Representative results and tradeoffs

| Setting / protocol | COExpander result | Relevant comparison |
| --- | --- | --- |
| MIS ER700-800, S1/Ds20/Is1 |42.383 nodes,5.746% drop,.469s |Fast-T2T40.688 nodes,9.513%,1.031s |
| TSP500, S4/Ds3/Is5 +2-opt |.251% gap,.656s |Fast-T2T.500%,.469s |
| TSP1,000, S4/Ds3/Is5 +2-opt |.640% gap,2.430s |Fast-T2T.740%,1.930s |
| TSP10,000, fine-tuned/S1/Ds3/Is5 +2-opt |1.450% gap,29.495s |Fast-T2T1.595%,40.938s; GLOP5.780%,11.776s |
| ATSP500, S4/Ds3/Is5 +2-opt |1.5681% gap,6.597s |LKH100 trials.0010%,1.022s |

These results support task-dependent quality/time tradeoffs. Improved gaps can require longer runtime, and classical LKH can be both better and faster on a displayed ATSP setting. TSP50-1,000 references use Concorde; many graph and large-routing references are **time-limited heuristic incumbents**. Negative gaps to Gurobi do not mean beating a true optimum. Reported standard deviations across the evaluation data are not established confidence intervals over independent training seeds. [Tables18-23.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=29)

At large graph sizes, performance is mixed. Giant MIS obtains46.64 nodes versus Gurobi1h48.56; giant MVC cost2,400.36 is worse than Gurobi1h2,396.78. ER1,400-1,600 MIS does beat the displayed Gurobi1h incumbent,48.43 versus44.81. Cut BA-GIANT is weaker than DiffUCO,7,381.92 versus7,387.76, while faster. More determination steps or denoising calls do not monotonically improve every task/setting. [Tables4/18-21.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=28)

### Which settings produce the headline results?

Two Table4 rows labeled AE match **GP configurations** in the complete appendix tables: giant clique84.12/1.52s is Table19's S4/Ds1/Is1+Beam16, and giant cut7,381.92/1.76s is Table21's fine-tuned S4/Ds1/Is50. They use COExpander-trained predictors, but their quality cannot be attributed specifically to multi-round adaptive expansion. The strongest real-world clique rows also involve the GP+beam branch; an AE setting is not uniformly better than Meta-EGN. [Tables19/21.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=26)

Table25 prints an average drop reduction3.807%→.657% and runtime3.181s→.799s. Its ATSP previous-method summary **duplicates the MIS summary** at4.253%/7.816s; averaging the four ATSP rows printed immediately above instead gives3.21815%/9.25825s. The headline is therefore retained only as an **author-reported aggregate with an inconsistent source row**, not an independently verified universal improvement factor. No replacement global score is asserted without a fully specified aggregation policy. Main versus appendix MVC-small and some baseline runtime entries also differ; the note avoids silently choosing a favorable conflicting value.

The49-instance TSPLIB mean gap is.367%, using different100/500/1,000-node checkpoints by row. Table24 reports floating Euclidean distances, so those lengths must be distinguished from conventional TSPLIB integer-rounded published optima. This is within-task distribution transfer using a model selection policy, not a single universal checkpoint. [Table24.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=31)

### CVRP extension and postprocessing

CVRP is a measured seventh task, outside the six-problem29-setting core. Sizes50/100/200/500 have capacities40/50/80/100 and integer demands1-10. Each size trains for10 epochs on1.28 million/640,000/32,000/12,800 HGS-labeled instances, with10,000/10,000/100/100 test instances. Adaptive expansion fixes feasible route pieces; subsequent Classic-LS greatly improves quality. [Section6.2/AppendixH.2.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=33)

Even with Classic-LS, gaps3.90/4.25/4.89/5.34% are worse than Sym-NCO+Classic-LS1.91/2.38/2.88/4.17% at every size, although the evaluated runtime is shorter. Without postprocessing, adaptive construction gaps are about12-18%, exposing a substantial reliance on classical repair/search. The50-node HGS mean differs between Tables6/26, so the conflicting reference objective is not presented as a reconciled new benchmark.

RLSA-assisted MIS is a separate protocol: stand-alone RLSA receives twice the iteration count used after COExpander. The combination improves several datasets and avoids the displayed feasibility failures, but is slightly worse on RB-SMALL and slower on ER1,400-1,600. Feasible starts plus randomized intermediate flips are not a formal finite-time feasibility/optimality guarantee. AppendixH.3's MDP/PPO design is explicitly **future, unimplemented work**, not an experiment showing an RL-trained universal expander.

## Limitations

### Discussed in the Paper

- Supervised labels and their generation cost, with incomplete tests on Gaussian/clustered routing and alternative graph distributions.
- Limited performance on complex constraints, demonstrated by the CVRP extension.
- Future coupling of outer commitment and inner denoising, and proposed RL control of expansion. [AppendixH.](https://raw.githubusercontent.com/mlresearch/v267/main/assets/ma25r/ma25r.pdf#page=33)

### Curator Notes

- Separate task/scale models, curriculum fine-tuning, sparse/dense representations and classical postprocessing all affect the comparison.
- Best COExpander results mix AE, GP, beam and objective-fine-tuned variants; do not attribute every summary gain to adaptive multi-round commitment.
- The BCE triangle-inequality argument, duplicated ATSP summary and main/appendix differences are explicit manuscript limitations. They do not erase the measured per-setting results, but limit broad guarantees and aggregate claims.
- Batch1 inference with modern hardware standardizes measured conditions; it does not equalize offline training, labels, all model sizes or copied-paper baseline results.
- For the public release, selecting the intended determination, sample, beam and postprocessing options is necessary: its example MIS script initially selects S1/Ds1/Is1 with RLSA disabled, rather than the paper's stronger AE operating points.

## Reproducibility

- **Full reading:** all35 official PMLR pages, including complete AppendicesA-H,26 tables, problem definitions, model schedules, baseline analyses, all TSPLIB rows and the unimplemented future PPO proposal. Original diagrams, formulas, plots and the critical complete result/summary tables were visually inspected.
- **Metadata:** PMLR267/pages42130-42164 verifies four authors, ICML2025 and actual HTML `citation_publication_date=2025/10/06`, retained at exact publication-date precision. The title page verifies SJTU/Shanghai Innovation Institute and equal contribution of Jiale Ma/Wenzheng Pan. CVRP is added as the measured extension, while preserving the six-main-task distinction.
- **Scientific supplements:** the manually inspected PMLR page provides the combined35-page PDF, OpenReview and software, without a separate scientific supplement. All included A-H material was read. OpenReview API403 is recorded without claiming inaccessible attachments inspected. The complete104-entry official tree has no extra PDF/ZIP/TeX scientific attachment; data/weights links are reproduction assets rather than unexamined scientific appendices.
- **Code:** [Thinklab-SJTU/COExpander](https://github.com/Thinklab-SJTU/COExpander) uses PyTorch Lightning and ML4CO-Kit. README, selected complete prompted-training, mask-update, inference/schedule, MIS decoder/test and CVRP solver functions were inspected. Code confirms cross-entropy at two noise levels, fixed partial masks, task/size schedules, optional RLSA and separate checkpoint mappings. The README's PyTorch version prose/wheel links differ from its install command; no environment compatibility or full benchmark reproduction is claimed.
- **Verification artifacts:** deterministic arithmetic/BCE checks are saved separately; they are not training or solving experiments. Original complete Figure1/page3 is cropped directly from the read formal PDF.
