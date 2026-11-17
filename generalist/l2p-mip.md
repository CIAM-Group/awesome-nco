---
id: l2p-mip
short_title: L2P-MIP
title: 'L2P-MIP: Learning to Presolve for Mixed Integer Programming'
authors:
- Chang Liu
- Zhichen Dong
- Haobo Ma
- Weilin Luo
- Xijun Li
- Bowen Pang
- Jia Zeng
- Junchi Yan
year: 2024
date: '2024-05-31'
publication:
  date: '2024-05-31'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/1e6e0c2edb159b2ad2f9419b898f56d3-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/1e6e0c2edb159b2ad2f9419b898f56d3-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
- Huawei Noah's Ark Lab
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Wildlife Corridor Planning
- Mixed-Integer Knapsack
- Maritime Inventory Routing
- Set Covering
- Maximum Independent Set
- Item Placement
- Load Balancing
- Production Planning
summary: A shared graph predictor configures SCIP presolving across CORLAT wildlife-corridor and MIK knapsack tasks;
  most other benchmarks use domain-specific models.
code_url: https://github.com/Thinklab-SJTU/L2P-MIP
figure:
  path: paper-assets/l2p-mip/framework.png
  alt: Presolving parameter search, neural training, and inference in L2P-MIP.
  caption: 'Figure 2: Presolving parameter search, neural training, and inference in L2P-MIP.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/file/1e6e0c2edb159b2ad2f9419b898f56d3-Paper-Conference.pdf
---

# L2P-MIP: Learning to Presolve for Mixed Integer Programming

> **TL;DR:** A graph network predicts SCIP presolver priorities, round limits and timing masks from expensive simulated-annealing labels. Most experiments train by domain, but an explicit CORLAT/MIK transfer and joint-model experiment demonstrates a shared presolve component across two native problems. Solver guarantees remain those of SCIP; gains and published runtime accounting have clear limits.

## Motivation

The order and budgets of presolve reductions can influence both preprocessing and subsequent B&B. One default configuration cannot capture every instance's structure. Per-instance parameter search can find better configurations, but repeated solver calls cost hours or days. L2P learns that offline search output to predict useful settings quickly, leaving the classical presolvers and complete solver in place (Introduction/Section2).

## Contributions

- A42-parameter configuration problem covers fourteen presolvers, each with priority, maximum rounds and timing mask.
- Simulated annealing supplies best-found configuration labels rather than strong-branching labels or online RL rewards.
- A bipartite GCNN and shared three-head predictor use priority information to assist round/timing prediction, with dynamic loss balancing.
- Public and private benchmarks study solve-time/primal-dual-integral gains, inference cost, size/domain transfer, joint training and negative MIPLIB search results.

## Methodology

**Search target.** SA perturbs continuous priority parameters and discrete round/timing choices, accepting worse measured configurations with probability exp(-delta/T). Temperature starts1e5, decays by0.9 and stops at1e-2. The measured objective is solver time; hard instances use finite-budget surrogates such as integrality ratio, primal-dual bound gap or primal-dual integral(PDI). AppendixA.10 gives a3,600-second limit per search evaluation. These are expensive, finite best-found labels, not a certified globally best presolve configuration (Sections2.1-2.2/AppendixA.3/A.10).

**Network and loss.** Variable/constraint features and coefficient edges enter two interleaved bipartite GCNN passes with dimension64. Shared features feed three output branches. Priority uses ListMLE ranking loss; round limits and timing masks use cross entropy. The hybrid residual design treats priority information as useful prior input for the other predictions. Dynamic loss averaging weights each head by a softmax of recent loss ratios, temperature2, increasing the weight on slower-improving heads. The stated training is Adam1e-4, batch32,10,000 epochs, with batch reduced to four for large graphs (Section2.3/Section3.1.3/AppendixA.4-A.5).

**Theoretical scope.** AppendixA.4 invokes earlier residual-learning results with conditions on the model and linear output layer; it does not prove an unconditional improvement guarantee for the trained discrete presolve configuration or downstream solver runtime. An imperfect ranking/classification prediction can be worse than default. The learned component changes configuration before SCIP solves; it neither constructs a full primal solution itself nor establishes new feasibility/optimality certificates. Valid presolve reductions and B&B remain responsible for solver correctness and successful termination.

**Cross-task evidence.** Normal training is per dataset. However, Section3.4/Table4 explicitly trains on CORLAT, MIK or their union and tests the same predictor on both. The original benchmark providers identify CORLAT as wildlife-corridor planning and MIK as mixed-integer knapsack. CORLAT-trained weights improve MIK time1.12%, MIK-trained weights improve CORLAT15.52%, and a joint predictor gives33.84%/1.87% improvements on CORLAT/MIK. This supports **generalist presolve-parameter prediction with SCIP**, narrowly across these two native tasks. It is not a shared end-to-end solution decoder across all benchmarks. MIPLIB is not evidence for this classification: its unsuccessful search did not yield a trained model (Table4/AppendixA.8).

## Experiments

**Datasets.** Easy SC/MIS/MIRP each have1,000 generated instances. CORLAT has2,000, MIK100, Item Placement10,000, Load Balancing10,000 and Anonymous118. Each is split80/20. Hard MIRP has about4,120 variables/6,857 constraints; Load Balancing about61,000/64,304 and Anonymous37,881/49,603. Two private production-planning datasets each contain1,000 instances from distinct2022 collection periods, with material transport/production-capacity constraints. These private data are not independently accessible (Section3.1.1/Tables1-2).

**Solver and accounting.** SCIP7.0.3, Ecole0.7.3 and PySCIPOpt3.5.0 are used; other SCIP settings stay default. Hardware is RTX3090/Threadripper3970X. Tables report the solver's own time or PDI, including presolve+B&B but **excluding** the preceding parameter-search/prediction stage. Neural prediction is separately reported below0.05 seconds for medium and0.5 for hard instances; SA takes hours/days. Thus SA's favorable table outcomes do not mean a faster online solver including search. Random selects the best of ten configurations, SMAC3 fits a category-wide configuration, and FBAS is feature-based algorithm selection. Five-seed means/deviations are provided, but the random best-of-ten row is not independently reseeded in AppendixA.7 (Section3.1.2-3.1.4/AppendixA.7).

**Public results and negative cases.** CORLAT time drops31.02 to20.24 seconds,34.74%; MIK237.50 to230.33,3.02%; small MIRP56.54 to50.25,11.12%. Hard PDI improvements are MIRP28.41%, Item Placement4.96%, Load Balancing5.11% and Anonymous51.29%. These are time/PDI reductions, not objective-quality percentages or speedup factors. Easy SC is unchanged7.22 seconds and MIS worsens8.66 to8.68 despite the improvement column displaying0.00%. Effectiveness(win rate) is only7% on MIK and35/42/48/55% on hard MIRP/Item/Load/Anonymous, so a favorable average is not an improvement on every instance (Table1).

**Private/transfer results.** Industrial totals fall21,280.31 to20,420.28 seconds(4.06%) and2,994.69 to2,447.56(18.27%). These are accumulated dataset solve times, not per-instance latencies; SMAC3/FBAS are omitted for privacy reasons. Small-to-large MIRP transfer gives9.41% PDI reduction versus28.41% for in-domain large training; reverse transfer saves6.86% time versus11.12% in-domain. The joint CORLAT/MIK predictor also underperforms each domain-specific predictor on its own domain,33.84<34.74 and1.87<3.02%, while demonstrating actual shared weights (Tables2-4).

**Ablations and unsuccessful setting.** The CORLAT ablation successively removes components and finally substitutes BO labels, so the entire descending sequence is not a collection of independent one-component causal tests. More training data helps the shown MIRP/CORLAT curves and stabilizes around80%. MIPLIB configuration search is mostly negative, ending-8.29% at step225 with only a small positive0.69% at180; the authors could not obtain enough improved labels and did not train/evaluate a learned MIPLIB policy. This is an explicit coverage limitation (Figure4/AppendixA.8-A.11).

## Limitations

### Discussed in the Paper

Benefits are small on already well-optimized synthetic/MIK benchmarks. MIPLIB label search fails to provide useful training data. Nonlinear MIP, larger/decomposable scenarios and commercial-solver integration are future directions. Presolve and later solver stages are coupled; transferring an SCIP configuration to a commercial solver can be unsuitable and was not validated (AppendixA.8/A.12).

### Curator Notes

The42-parameter search, prediction and classical solve have different costs. Reported solver metrics exclude prediction/search overhead, and the full offline labeling effort must be retained when evaluating amortization. Timing means a presolver execution mask, not a wall-clock time allowance. Public tables clip several worse-than-default improvement entries to zero; TableA.7 explicitly marks some corresponding random/FBAS outcomes negative. Guarantees about residual function classes should not be promoted to guarantees of runtime or generalization.

The current author master archive has concrete integration gaps. `annealing_generator.py` calls imported step with five positional arguments and unpacks24 outputs, while `src/train_child.py` defines three arguments and returns11 outputs. `generate_ecole_feature.py` imports an `environments` module absent from that archive. Its solver helper uses a600-second cap for the configured solve, whereas the paper's search illustration says3,600; current neural layers use Tanh where the paper describes ReLU. These static release discrepancies prevent a claim that the README reproduces the published pipeline unchanged. They do not establish that historical experiments used these mismatched files or invalidate their reported results. No training or solver experiment was rerun.

## Reproducibility

- **Publication:** [ICLR2024 proceedings](https://proceedings.iclr.cc/paper_files/paper/2024/hash/1e6e0c2edb159b2ad2f9419b898f56d3-Abstract-Conference.html), official HTML issued May31,2024; authors and SJTU/Huawei affiliations match PDFp1.
- **Scientific coverage:** all22 publisher pages, full bibliography, AppendicesA.1-A.12, formulas/complete parameter table and rendered graphs. The official conference poster PNG was downloaded/read visually. Publisher/conference action links provide no extra scientific supplement; ordinary OpenReview API access returned403 without bypass. The full author master ZIP was inventoried and contains no further scientific PDF/archive.
- **Code:** [Thinklab-SJTU/L2P-MIP](https://github.com/Thinklab-SJTU/L2P-MIP), README, SA generator, solver wrapper, neural heads/pooling, loss selection and dynamic weighting inspected. The public checkout does not supply private industrial data or a complete independently verified reproduction; release-interface mismatches are recorded above.
- **Classification provenance:** [original CORLAT benchmark description](https://www.cs.ubc.ca/labs/algorithms/Projects/AAC/MIP-benchmarks.html) identifies grizzly-bear corridor planning; [original ParamILS benchmark table](https://www.cs.ubc.ca/labs/algorithms/Projects/ParamILS/results.html) identifies MIK through Atamturk's mixed-integer-knapsack reference. These identify the native tasks in the paper's explicit Table4 shared-model experiment.
- **Relations:** 15 exact catalogue references have matching body citations and bibliography entries, including GCNN branching, neural graph/routing/local-rewriting methods, parameter/cut selection, graph matching/robustness and the2024 hybrid-RL branching paper. No edges are inferred solely from an uncatalogued toolkit or common author.
