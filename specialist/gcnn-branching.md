---
id: gcnn-branching
short_title: GCNN Branching
title: Exact Combinatorial Optimization with Graph Convolutional Neural Networks
authors:
- Maxime Gasse
- Didier Chételat
- Nicola Ferroni
- Laurent Charlin
- Andrea Lodi
year: 2019
date: '2019'
publication:
  date: '2019'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/d14c2267d848abeb81fd590f371d39bd-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/d14c2267d848abeb81fd590f371d39bd-Abstract.html
institutions:
- Mila
- Polytechnique Montreal
- University of Bologna
- HEC Montreal
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
summary: Separate MILP graph branchers imitate strong branching, trading decision quality against inference cost
  inside exact SCIP search.
code_url: https://github.com/ds4dm/learn2branch
---

# Exact Combinatorial Optimization with Graph Convolutional Neural Networks

> **TL;DR:** Task-specific graph branchers imitate strong-branching decisions in SCIP. A variable–constraint representation and sum convolutions with fixed prenormalization improve selected MILP benchmarks, while exactness remains the solver's responsibility.

## Motivation

Strong branching evaluates candidate splits with additional LP solves and often produces small trees, but its computational cost can dominate solving time. The paper learns cheaper branching decisions for repeated instances from a known distribution, seeking to retain useful decisions while reducing feature and inference costs (Sections1–4).

## Contributions

- A sparse bipartite variable–constraint representation exposes the current LP relaxation to a GCNN brancher, reducing feature engineering relative to previous rank/score models.
- Behavioral cloning treats branching as classification of the expert's selected variable, rather than regression of strong-branching scores or ranking all candidates (Equation3).
- A single variable-to-constraint then constraint-to-variable convolution, with unnormalized sums and frozen prenorm layers, is evaluated in a nearly full SCIP setup and across larger same-family instances. Models are trained separately for each of four benchmarks (pp.5–8), so the note retains specialist scope despite the common MILP interface.

## Methodology

**Host optimization.** The learned policy selects a fractional integer variable at the focused branch-and-bound node. SCIP retains LP relaxations, valid variable-bound splits, node selection, pruning, primal heuristics and exact optimality/infeasibility logic. Learning does not prove that its choices minimize tree size or runtime, and time-limited runs need not finish with an optimum (Sections3–4).

**Observation and network.** Each current LP row and column is a constraint/variable node; nonzero matrix coefficients are edges. Features include constraint/objective similarity, bounds, dual values, LP tightness/age, variable type, fractionality, basis status, reduced cost and incumbent values, with normalized coefficients on edges. This is a subset of solver state, explicitly a partially observed formulation (p.5; supplementTable2).

Two successive message passes use two-layer ReLU MLPs, with64-dimensional node embeddings and a final masked softmax over candidate variables. Sum aggregation retains counting information lost by means. Prenorm applies fixed empirical training-set mean and standard deviation immediately after aggregation; it is not a trainable batch-normalization statistic updated at test time (pp.5–6).

**Expert data and learning.** Side-effect-free `vanillafullstrong` supplies oracle decisions/scores without strong branching's ordinary solver-state side effects. For each benchmark the available generator pools contain10000 training and2000 validation instances, sampled with replacement until100000/20000 branching states are collected. Only4349–6661 unique training instances are actually used, depending on task (supplementSection1/Table1). Cross-entropy training uses TensorFlow/Adam, batch32 and initial rate0.001; divide by5 after10 validation-loss plateau epochs and stop after20 (supplementSection2.1).

## Experiments

**Tasks and configuration.** Separate models train on easy instances: set covering500rows/1000columns; combinatorial auctions100items/500bids; capacitated facility location100customers/100facilities; MIS500vertices. Medium/hard tests increase rows, items/bids, customers, or vertices up to2000rows,300items/1500bids,400customers and1500vertices. SCIP6.0.1 allows cuts only at the root, disables solver restarts, otherwise keeps defaults, and imposes a3600-second limit (p.6). The paper calls MIS graphs Erdos–Renyi with affinity4, whereas the checked official generator calls `Graph.barabasi_albert(...,affinity=4)`; reproduction must identify the exact generator revision rather than silently equate these distributions.

**Metrics.** Each difficulty uses20 new instances and five seeds, totaling100 solve attempts. Time is the1-shifted geometric mean including timeouts without extra penalty. Node counts are restricted to the intersection solved by all compared methods; wins count fastest solves. Reported deviations are average within-instance seed variability, not confidence intervals. Table1 accuracy compares predictions against any candidate with maximal expert score, and does not itself establish solve-time performance (pp.7–8).

**Results and adverse cases.** GCNN top1 imitation accuracy is65.5%,61.6%,71.2%,56.5% across the four tasks. Hard set-cover time is1489.91s versus RPB1677.02s, with70 versus65 solved attempts; hard auction114.16s versus136.17s, both100 solved. Facility-location hard time improves563.36s versus631.50s, but GCNN solves95 versus RPB96. Medium MIS is worse at192.91s/82 solved versus110.99s/100; hard MIS solves29 versus42, despite similar aggregate time2024.37s versus2045.61s. Easy auction LMART also beats GCNN in time. Thus no blanket superiority is supported (Table2).

**Ablations and costs.** Set-cover Table3 supports sum+prenorm generalization on harder instances, with similar easy-instance performance. Its common-solved node subset differs from Table2, so node numbers should not be compared across those tables. Baseline rankers/trees use at most250000 candidate-variable samples because of memory/training constraints, while GCNN uses100000 complete states; equal-data GCNN-SMALL controls improve most accuracy measures but do not beat every baseline top1 result (auction55.0% versus57.3%). SupplementTable5 gives GCNN training3.84–18.18h across tasks and Table6 includes both feature extraction and prediction timing. A XeonGold6126/2.60GHz and TeslaV100 are reported (supplementSections2,4–5).

## Limitations

### Discussed in the Paper

Larger/deeper policies can reduce nodes yet increase total solving time. Transfer eventually deteriorates beyond trained size ranges, and the authors report preliminary failures on much larger instances, partially remedied by training larger models on larger instances. MIS has notably high variation and poor solve-count transfer (pp.8–9).

### Curator Notes

The architecture accepts general MILPs, but four independently trained specialist policies establish within-family size transfer, not one shared cross-family checkpoint. Exactness belongs to the retained solver and valid branching, subject to its normal numerical/tolerance behavior and completion; imitation accuracy supplies no optimality theorem. Comparisons use root-only cuts and no restarts, so “default SCIP” refers to its branching rule within that stated setup. The paper/code MIS-distribution mismatch is a provenance limitation, not resolved by relabeling the reported results.

## Reproducibility

- Fully read13-page [NeurIPS2019 paper](https://proceedings.neurips.cc/paper_files/paper/2019/file/d14c2267d848abeb81fd590f371d39bd-Paper.pdf), including references, and all6pages of `learn2branch_supplementary.pdf`, the sole member of the publisher's [official supplemental ZIP](https://proceedings.neurips.cc/paper_files/paper/2019/file/d14c2267d848abeb81fd590f371d39bd-Supplemental.zip). The [proceedings page](https://proceedings.neurips.cc/paper_files/paper/2019/hash/d14c2267d848abeb81fd590f371d39bd-Abstract.html) links both sources.
- Official [ds4dm/learn2branch](https://github.com/ds4dm/learn2branch) provides SCIP patches, generators, data collection, model training and testing. Its [instance generator](https://github.com/ds4dm/learn2branch/blob/master/01_generate_instances.py) was checked for the MIS distribution discrepancy (Graph methods near63/95 and generation near619–680 at review time).
- SupplementSections1–5 specify expert collection, complete feature list, baseline adaptations, matched-data accuracy and timing. No optimization experiments were rerun in this audit.
