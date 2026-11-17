---
id: optfm
short_title: OPTFM
title: 'OPTFM: A Scalable Multi-View Graph Transformer for Hierarchical Pre-Training in Combinatorial Optimization'
authors:
- Hao Yuan
- Wenli Ouyang
- Changwen Zhang
- Congrui Li
- Yong Sun
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/54801e196796134a2b0ae5e8adef502f-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/54801e196796134a2b0ae5e8adef502f-Abstract-Conference.html
institutions:
- Lenovo Research
scope: generalist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Integer Programming
problems:
- MILP Representation
- Solution Prediction
- Large Neighborhood Search
- Solver Configuration
summary: A shared frozen MILP encoder supports separately trained prediction and incumbent-LNS heads and retrieved
  solver configurations; adaptation, data overlap and solver-budget limits are explicit.
code_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/54801e196796134a2b0ae5e8adef502f-Supplemental-Conference.zip
---

# OPTFM: A Scalable Multi-View Graph Transformer for Hierarchical Pre-Training in Combinatorial Optimization

> **TL;DR:** One frozen, self-supervised MILP graph encoder supplies reusable representations across native optimization families. Separately trained GBDT and RL-MLP heads drive solution prediction and incumbent improvement; instance embeddings retrieve solver configurations. This is shared representation learning with downstream adaptation, with explicit solver-budget, pretraining-overlap and release-code limits.

## Motivation

Task-specific MILP networks repeatedly learn structural features from expensive solver labels. Very large variable/constraint graphs also make dense attention and joint full-graph training costly. OPTFM studies transferable node and instance representations, decoupling self-supervised representation learning from supervised or reinforcement-learning downstream decision heads (Sections1–3).

## Contributions

- A bipartite multi-view transformer combines variable/constraint self-attention, two directed cross-attention operations and sparse coefficient information.
- Adaptive random partitions and two artificial global nodes bound the graph processed in each update.
- Masked adjacency reconstruction trains a node encoder; contrastive learning over multiple partition sequences trains a separate graph encoder.
- Frozen representations are evaluated in three solver pipelines: binary-solution prediction, neural large-neighborhood search and nearest-neighbor solver configuration.

## Methodology

**Attention and partitions.** Ecole-style variable/constraint/coefficient features represent a MILP. Linear maps and Frobenius-normalized queries/keys replace softmax all-pair attention; a diagonal normalizer rescales V+(1/N)Qtilde(Ktilde^T V). Sparse adjacency multiplication supplies local information, concatenated with global attention before a residual update. Self-attention acts separately on each node type; constraint-to-variable and variable-to-constraint cross-attention exchange their information. A single layer/head,64-dimensional embeddings and residual beta=.5 are used. The attention-plus-sparse-edge operation is O(N+E) at fixed feature dimension, as Section5.5 explicitly states; the abstract's O(N) shorthand does not bound every operation in pretraining or classical optimization (Sections4.1/5.1/5.5).

Random partitions balance node types and preferentially retain connected constraints under a maximum size. They discard cross-partition edges rather than reconstruct an exact whole-graph computation. One artificial variable and one artificial constraint connect to opposite-type nodes within each partition. Default gsize=20000 trades memory against lost structural information (Algorithm3/AppendixA.2/A.6).

**Two pretraining stages.** Masking a fraction of coefficient edges creates inputs; pairwise concatenations of variable/constraint embeddings predict their original adjacency with cross-entropy. This is edge reconstruction, not supervised prediction of feasible or optimal assignments. After freezing the trained node encoder, each original instance produces20 random partition sequences. A token concatenates its partition's two global-node embeddings. A second transformer, without an explicit inter-partition edge matrix, followed by mean pooling supplies an instance embedding. ProxyAnchorLoss brings views of the same instance together and separates other instance identities. Node/graph pretraining are sequential rather than jointly optimized. Algorithm1 updates one shared encoder across the dataset, despite the prose describing training individually on graphs (Sections4.2–4.3/Algorithms1–2).

**Downstream heads and scope.** In TaskI, frozen node embeddings train a GBDT on small instances labeled by a two-hour SCIP run; larger instances receive those predictions, followed by SCIP repair and neighborhood search restricted to30% of variables. TaskII concatenates frozen embeddings with dynamic incumbent features and trains an RL-MLP to choose variables to free/fix; a classical solver reoptimizes the resulting neighborhood and reward measures objective improvement. TaskIII replaces MILPTune's learned metric with frozen graph embeddings and retrieves a configuration through KNN before SCIP solves the instance. These are different adapted decision heads, not a single unchanged action policy (Sections5.2–5.4/AppendixA.4).

The shared pretrained node weights are actually reused across native CA/MIS/MVC/SC solution-prediction families and SC/MIS/CA/MaxCut LNS families. The released solution-prediction and LNS utilities load the same node-pretrain checkpoint path, independent of the selected problem; RL heads have per-problem checkpoints. This supports **generalist** classification for the shared neural representation component with lightweight adaptation. The two actual neural roles support **constructive-improvement**: prediction/classical construction and learned edits of a complete incumbent in LNS. Neither heterogeneous MILP syntax alone nor the word foundation establishes this classification.

## Experiments

**Data, overlap and costs.** Pretraining starts from1065 MIPLIB2017 collection instances, with up to38868107 variables and19912111 constraints. Five modified versions of each instance delete up to roughly1% of rows/variables and randomly change some coefficients/RHS values. Augmented data are split80/20 for training/validation; original base instances remain the reconstruction test set. Thus this reconstruction test shares base-instance identities/structure with augmented training, rather than testing wholly disjoint original graphs. The later MIPLIB benchmark240 is drawn from the collection used for pretraining; its solver results should not be described as wholly unseen-instance foundation-model generalization. Synthetic native downstream families are expressly described as absent from pretraining. Experiments use two A10040GB GPUs and report three-seed averages (Section5.1/AppendicesA.3/A.5/A.7).

**TaskI solution prediction.** CA/MIS/MVC/SC each use50 instances at each of three scales, with the smallest scale training the GBDT. Variables reach one million for CA/MIS/MVC and two million for SC. Budgets vary substantially:2000seconds for intermediate groups,30000 for largest CA,8000 for largest MIS/MVC and12000 for largest SC. Table1 prints OPTFM's best mean objective in all eight columns, with task-specific maximize/minimize direction. This is budgeted feasible-objective performance, not certified optimality or a universal speedup. The largest-SC advantage over LIGHT-MILPOPT is only165972.6 versus165973.1. GBDT labels are high-quality time-limited SCIP solutions, not universally known optima (Table1/AppendixA.4.1).

**TaskII LNS.** Each of SC/MIS/CA/MaxCut has100 training,20 validation and50 test instances, plus doubled/quadrupled-variable test groups. All methods receive200seconds in Tables2–3. Primal gaps compare against best-known solutions using absolute objective difference divided by the larger absolute objective magnitude. The printed integral is the time-integrated objective minus budget times reference, so maximization requires an objective-sign convention; a normalized, certified primal-dual gap should not be inferred from this notation (AppendixA.4.2).

OPTFM improves many learned-baseline/SCIP averages, but the blanket consistently-best statement has exceptions. On small SC, CL-LNS gap.92% beats OPTFM.93%, although OPTFM's PI16782 beats17025. Gurobi gives better small-family gaps in all four columns: SC.75 versus.93, MIS0 versus.05, CA1.44 versus1.93 and MaxCut.62 versus3.02. At larger scales OPTFM beats Gurobi on CA2 gap2.19 versus3.60 and CA4 gap1.98 versus12.61. MIS4 ties their.04% gaps while Gurobi PI2215.7 beats2241.9. Quality and anytime-integral rankings can differ (Tables2–3).

On all240 MIPLIB benchmark instances,300second runs give gaps15.15/8.07/8.95/5.19/2.92/1.98% for SCIP/RL-LNS/pretrained-GCN/SGFormer/OPTFM/Gurobi. The paper reports OPTFM matches or exceeds Gurobi on71% and strictly improves10%, while Gurobi has the better mean gap and203/240 reported Wins versus171/240. These overlapping Wins are not mutually exclusive global-best counts; their exact tie/reference convention is not fully specified for Table4. RL-LNS uses active search, while CL-LNS and the baseline labeled Branching are omitted from this heterogeneous benchmark. The Branching citation[68] actually names Sonnerat et al.'s LNS preprint; its label should not create a false neural B&B-branching relationship (Section5.3/Table4).

**TaskIII configurations.** Item placement100, load balancing100 and anonymous20 ML4CO test instances use900second SCIP budgets. OPTFM reports mean objective improvements3.24/.58/1.41% over default, with best-solution counts74/70/12; SGFormer gives2.55/.33/1.09%. These are solver-configuration gains under the stated reference/budget, not reductions in globally certified optimality gaps. KNN still needs indexed configurations/costs from offline exploration (Section5.4/Table5).

**Diagnostics.** Partition sizes below10000 severely degrade reconstruction; improvements saturate around20000. Better reconstruction epochs correlate with better trained MaxCut-LNS heads in the reported experiment; that observed correlation is not a theorem of downstream monotonicity. Most original-instance reconstruction F1 scores exceed.7, while some fall below.5. On controlled1000–50000-node set-cover graphs, measured transformer epoch time/memory increase approximately linearly but remain above GCN. Fixed-budget downstream comparisons include embedding inference, not the entire offline pretraining/label/configuration-search bill. Table9 supplies three-seed standard deviations; the claim that all are below3% has an anonymous-config3.05% counterexample and a malformed MC4 cell printed1.88& (Figures3–6/AppendicesA.5–A.7).

## Limitations

### Discussed in the Paper

The study focuses on MILPs; broader CO/nonlinear applications remain future work. More effective pretraining objectives are proposed. Very large graphs need partitioning; small partitions lose information, and low-F1 instances remain challenging. The checklist explicitly declares no formal theoretical results.

### Curator Notes

Freezing the backbone does not eliminate supervised labels, separately trained GBDTs, RL training, active search or configuration-database construction. Shared representations therefore do not imply zero-shot unchanged optimization decisions. Independently predicted marginals need not satisfy constraints; repair and restricted neighborhoods can exclude a global optimum. No approximation, optimum or arbitrary-distribution transfer guarantee is established.

Attention scalability must be separated from the reconstruction head: both the described all-variable/constraint-pair decoder and released cross-attention implementation materialize pairs and dense adjacency labels inside each partition. That decoder has O(n_variables*n_constraints) pairs, even when attention is O(N+E). Partitioning bounds this per-step cost; it does not prove an O(N) unrestricted end-to-end training pipeline. StageII also discards explicit inter-partition edges. Table6 calls the features static while including reduced cost, whose value depends on an LP/solver state; exact extraction/provenance needs care.

The public proceedings ZIP labels itself sample code/data and promises full release upon acceptance. Its defaults differ from the formal setup:1000-node partition bounds and epoch0 checkpoint paths, hardcoded instance/checkpoint/data directories, and configuration embeddings initialized to32dimensions in the example. These snippets establish reuse paths and provide implementations, but do not independently establish that the complete reported benchmark is immediately reproducible or that those defaults generated every formal table. No solver/training benchmark was rerun during this review.

## Reproducibility

- **Publication:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/54801e196796134a2b0ae5e8adef502f-Abstract-Conference.html), five Lenovo Research authors. Official HTML citation_publication_date is April23,2026, distinct from conference year2025.
- **Coverage:** all28 formal PDF pages, complete references/checklist and AppendixA.1–A.7 read; attention, result, partition and variability pages rendered. Publisher scientific supplemental ZIP43745560bytes/694members manually inventoried: no PDF/TeX/notebook/scientific image; full OPTFM README, upgrade report and embedded MILPTune README/overview read. Official NeurIPS event120176 scientific poster4012751bytes fully inspected after compositing transparent background onto white. Ordinary OpenReview API request returned403; no challenge bypass was attempted.
- **Code:** [official proceedings supplement](https://proceedings.neurips.cc/paper_files/paper/2025/file/54801e196796134a2b0ae5e8adef502f-Supplemental-Conference.zip). Inspected actual hierarchical attention/pair decoder, dense labels, shared node-pretraining checkpoint loads, GBDT fitting, per-problem RL paths/incumbent updates and KNN/configuration interface. A separate author GitHub implementation was not located in the checked primary records.
- **Relations:** sixteen explicit in-text/bibliographic matches. RouteFinder[59] identifies its eight-author2024 ICML workshop precursor; arXiv2406.15007v1 and the author repository's July2024/September2025 history establish lineage to the catalogue's later TMLR representative. This relation does not import that later version's48-variant results into this paper's citation.
