---
id: hybrid-branching
short_title: Hybrid Branching
title: Hybrid Models for Learning to Branch
authors:
- Prateek Gupta
- Maxime Gasse
- Elias B. Khalil
- M. Pawan Kumar
- Andrea Lodi
- Yoshua Bengio
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/d1e946f4e67db4b362ad23818a6fb78a-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/d1e946f4e67db4b362ad23818a6fb78a-Abstract.html
institutions:
- University of Oxford
- The Alan Turing Institute
- Mila
- Polytechnique Montreal
- University of Toronto
- Universite de Montreal
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
- Graph Optimization
- Set Selection
- Facility Location
problems:
- Mixed-Integer Linear Programming
- Set Covering
- Combinatorial Auction Winner Determination
- Capacitated Facility Location
- Maximum Independent Set
summary: Task-specific root GNN representations condition fast CPU branching, with family-dependent accuracy, runtime
  and transfer tradeoffs.
code_url: https://github.com/pg2455/Hybrid-learn2branch
---

# Hybrid Models for Learning to Branch

> **TL;DR:** A GNN runs once at the root of each MILP search, then conditions cheaper MLP branching decisions. CPU-focused experiments show useful speed/accuracy tradeoffs with task-dependent failures and explicit limits on size transfer.

## Motivation

Applying a GNN at every branch can save search nodes yet lose wall time on CPU. This work asks how to reuse structural information from the root and combine it with inexpensive changing features, targeting CPU inference rather than assuming a dedicated GPU for each MILP (Sections1–3).

## Contributions

- A hybrid brancher caches variable representations from the root GNN and combines them with local candidate features at subsequent nodes.
- CONCAT, FiLM, HyperSVM and HyperSVM-FiLM span expressivity/cost tradeoffs. End-to-end training, knowledge distillation, representation-diversity objectives and depth-weighted loss are studied separately.
- CPU evaluation covers four MILP families, with separate problem-trained policies and within-family size extrapolation. The common MILP architecture is not evidence of a single checkpoint solving all four families (Sections4–5).

## Methodology

**Search and features.** The policy selects a fractional integer variable while SCIP retains the LP, branching disjunction, cuts, bounds, pruning and exact search logic. One GNN encodes the root variable–constraint graph. Subsequent node scores use cached per-variable structure and cheaper dynamic candidate features, avoiding repeated graph extraction/message passing. Known variable bounds, LP values, fractionality, reduced cost, incumbent information and constraint statistics remain engineered solver features (pp.3–4; supplementSection2).

**Architectures.** CONCAT appends the root embedding to candidate features. FiLM uses root-predicted scales/shifts to modulate MLP hidden states. HyperSVM predicts a cheap linear score's weights; HyperSVM-FiLM adds elementwise nonlinear modulation. These models trade per-node inference cost against accuracy, rather than guarantee fewer B&B nodes (Table1).

**Training.** Strong-branching labels support cross-entropy imitation. Root GNN weights can be frozen after pretraining or jointly trained through tree-node predictions. Distillation mixes soft teacher outputs with hard labels; supplementSection5 specifies temperature2 and soft-target mixing0.9. Euclidean-distance/hyperspherical-energy auxiliary tasks encourage differentiated root embeddings; sigmoid depth weighting emphasizes earlier decisions less aggressively than the tested exponential/linear alternatives (pp.5–7).

The supplement reports150000 training states from a10000-instance pool, with30000 validation/test states and their corresponding stated instance pools. Epochs sample10000 training and2000 validation states. The MLP has three256-unit layers, GNN width64, batch32 and initial rate0.001, reduced by0.2 after15 plateau epochs with30-epoch stopping. Facility-location settings instead use0.005 and10/20 patience/stopping. MIS size transfer additionally tunes weight decay using2000 states from medium instances outside evaluation, so that transfer is not free of larger-instance validation (supplementSections5,8).

## Experiments

**Protocol.** Each family/difficulty uses20 instances and three seeds, for60 attempts. Main runs have a2700-second limit and root-only cuts. Time and common-solved node counts use1-shifted geometric means, including timeouts in time. Wins count fastest CPU strategies; GNN-GPU is a reference excluded from that win competition. COMP optimistically chooses the best of SVMRank, LambdaMART and ExtraTrees for comparison, rather than one deployable fixed policy (pp.6–8). CPU inference uses XeonE5-2650v4/2.20GHz; the GPU reference uses TITANXp/CUDA10.1 (supplementSection5).

**Selected gains and counterexamples.** Table4 reports medium facility-location FiLM136.42s versus CPU COMP172.51s and RPB213.99s; medium auction15.71s versus GNN22.26s and RPB26.36s. Large auction reverses the comparison with RPB:217.02s versus210.95s. Large MIS FiLM has lower aggregate time1823.29s versus RPB1946.51s but solves only15 versus21 attempts, and small MIS GNN-CPU is faster44.07s versus FiLM52.96s. The headline “up to26%” describes selected comparisons, not every family/size or a universal improvement over the fastest hardware setup.

**Gaps.** Table5 restricts comparison to commonly unsolved large instances:33 set-cover and39 MIS cases. Mean reported optimality gaps are0.0597/0.0187 for FiLM versus RPB0.0628/0.0252. These are solver incumbent/bound gaps on a selected subset, not verified errors against known optima (p.8).

**Transfer and ablations.** Unregularized FiLM solves no large MIS cases; validation-chosen regularization materially changes results (supplementTables6–7). At twice-large size with7200-second limits, FiLM solves4 facility cases versus GNN-CPU5 and RPB0; on set cover FiLM solves10 versus RPB12 and has worse time6508.78s versus6346.17s. Thus extrapolation is family dependent. Cheaper HyperSVM variants lose quality/generalization enough to forfeit their inference advantage. KD/auxiliary improvements in imitation accuracy are small, and the best runtime protocol varies; the supplement recommends auxiliary tasks only when accuracy gains are meaningful (supplementSections7–11).

## Limitations

### Discussed in the Paper

Imitation test accuracy imperfectly predicts search performance because learned decisions change the state distribution. Much larger-instance evaluation is expensive, MIS overfits without additional validation, and other MILP families may not gain runtime. Gap-at-timeout objectives also differ from minimizing completion time (pp.8–9).

### Curator Notes

Exactness comes from the retained solver after successful termination, not the trained brancher. Timeout-heavy geometric means and common-solved node intersections should accompany any ranking. GNN/root cache reuse and model-specific validation are different from zero-shot transfer across native tasks; policies remain specialist.

The printed auxiliary Equation4 adds a positive sum of squared embedding distances to an objective being minimized, which would contract distances rather than maximize separation as the prose states. Its hyperspherical expression also requires excluding self-pairs to avoid division by zero. These notation/sign conventions should be resolved against the selected implementation before reproducing that objective; the note does not silently replace the published equation. SupplementSection2 reports92 combined features in prose while its table lists raw counts13+72; exact expanded encoding should likewise be checked against code.

## Reproducibility

- Fully read the11-page [NeurIPS2020 paper](https://proceedings.neurips.cc/paper_files/paper/2020/file/d1e946f4e67db4b362ad23818a6fb78a-Paper.pdf) and all8pages of the [official supplement](https://proceedings.neurips.cc/paper_files/paper/2020/file/d1e946f4e67db4b362ad23818a6fb78a-Supplemental.pdf), including all feature tables, model-selection details, negative cases and figures. The [publisher record](https://proceedings.neurips.cc/paper_files/paper/2020/hash/d1e946f4e67db4b362ad23818a6fb78a-Abstract.html) links both.
- Author-linked [pg2455/Hybrid-learn2branch](https://github.com/pg2455/Hybrid-learn2branch) provides the learn2branch submodule, PyTorch models, data collection, train/test/evaluation scripts and dependency notes. Paper author names follow the PDF (M.PawanKumar), while the publisher lists PawanMudigonda. No training or SCIP benchmark was rerun in this audit.
