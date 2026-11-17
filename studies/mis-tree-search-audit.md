---
id: mis-tree-search-audit
short_title: MIS Tree-Search Audit
title: What’s Wrong with Deep Learning in Tree Search for Combinatorial Optimization
authors:
- Maximilian Böther
- Otto Kißig
- Martin Taraz
- Sarel Cohen
- Karen Seidel
- Tobias Friedrich
year: 2022
date: '2022-01-25'
publication:
  date: '2022'
  source_url: https://openreview.net/forum?id=mk0HzdqY7i1
venue: ICLR
paper_url: https://openreview.net/forum?id=mk0HzdqY7i1
institutions:
- Hasso Plattner Institute
- University of Potsdam
- The Academic College of Tel Aviv-Yaffo
scope: study
paper_type: analysis
arxiv_url: https://arxiv.org/abs/2201.10494
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Maximum Weight Independent Set
summary: A MIS/MWIS reproduction study controls learned versus random guidance, classical reductions and search
  configurations; findings depend on instance coverage, resources and tested implementations.
code_url: https://github.com/MaxiBoether/mis-benchmark-framework
---

# What's Wrong with Deep Learning in Tree Search for Combinatorial Optimization

> **TL;DR:** This reproduction study separates learned MIS guidance from tree search, kernelization and local search. In the tested guided-tree-search configurations, random scores often match trained GCN scores after conventional components are enabled. LwD provides a contrasting positive control: replacing its learned output with random values substantially harms quality. The findings concern these implementations and protocols.

## Motivation

Published neural combinatorial solvers can combine a learned model with extensive conventional algorithms. Strong final solutions do not reveal which component supplied the benefit. Reproducing the complete pipeline, exposing configuration changes and testing random guidance are needed to assess whether training actually contributes.

## Contributions

- A unified benchmark interface for maximum independent set and maximum weight independent set, integrating Intel-TreeSearch, a DGL reimplementation, LwD, KaMIS and Gurobi.
- A configuration study separating learned scores, graph reduction, local search, queue pruning, weighted queue popping and parallel execution.
- Broader comparisons on synthetic/real, small/million-node and weighted graphs, with explicit failures and implementation caveats.

## Methodology

Intel-TreeSearch and DGL-TreeSearch maintain incomplete vertex assignments, rank residual vertices by score maps and construct independent sets greedily. The reimplementation exposes optional KaMIS reduction/local-search routines. Queue pruning drops old partial solutions once a cap is reached; weighted queue popping favors partial assignments with fewer unlabelled vertices. DGL workers use separate queues, whereas the Intel implementation shares a queue. Random-score controls replace the GCN output with uniform random values while retaining the selected search configuration.

The two supervised models train on SATLIB for 20 stated epochs with 32 output maps and hindsight loss. This is distinct from the original paper's stated 200 epochs; Appendix C explains that the original implementation's epoch covers only 2,000 sampled examples rather than all 38,000 training graphs. The study also tests original released weights. These protocol details matter when interpreting the authors' failure to reproduce earlier results.

LwD is trained for 20,000 PPO iterations on SATLIB using its published SATLIB hyperparameters. Its random-output control preserves the transition procedure. The study does not add MIS reduction or local search to LwD. Weighted experiments use DGL's task adaptation, KaMIS and Gurobi; they do not test weighted LwD because the original release lacked that code. This entry is an analysis/benchmark study rather than a new generalist solver.

## Experiments

The benchmark runs on a DGX-1 with two 20-core Xeon E5-2698 CPUs, 512 GB memory and eight available V100 GPUs; individual configurations specify the resources actually used. Main full-configuration comparisons use eight threads sharing one GPU, while KaMIS/LwD run single-threadedly and Gurobi can use up to eight threads. Typical limits are 15 seconds for small random graphs, 30 seconds for several medium datasets and five minutes for harder graphs. Huge-graph tests allow three hours.

**Table means condition on instances where a solution was found.** Parentheses also report found-instance counts, and approximation factors appear only where Gurobi supplied a certified optimum. A large conditional mean from a small successful subset cannot be ranked directly against a solver covering every instance. Reported seconds generally measure time until the best solution was discovered, not an executable stopping rule: absent an optimality certificate, a deployment would often still run to its configured limit.

On SATLIB, default Intel-TreeSearch finds no solution within the study's limit; default DGL finds solutions for only two of 500 graphs, with conditional mean size 340.50. Reduction/local search makes the configurations competitive. Table 2 reports single-thread DGL with reduction/local search at 426.25, the fuller queue-pruning/weighted-pop/reduction/local-search configuration at 426.37, and its random-score counterpart at 426.48, all over 500 graphs. These small differences support the configuration-specific control result rather than a statistical theorem that learned scores never help.

The positive control is substantial: Table 3 gives LwD SATLIB size 423.48 versus 144.85 after randomization, both covering 500 instances. LwD is quick, but its quality is not always highest: on ER700-800 it reaches 33.65 versus KaMIS 44.57, and on VC-BM 36.02 versus full Intel 45.10. On DIMACS, the full DGL mean 79.58 covers only 26 of 37 graphs, whereas LwD 70.11 and KaMIS 76.78 cover all 37. These details qualify the main text's broad descriptions of near-optimal performance.

Large-graph tests cover HK, WS and hyperbolic graphs up to five million nodes plus large real networks. For HK500,000, several methods attain size 289,486, but time to that result ranges from KaMIS 0.27 seconds to LwD 145.40 seconds and full Intel 242.91 seconds. At two/five million nodes, DGL and LwD frequently run out of memory. The authors explicitly state that missing original graph-generation/large-scale settings prevent a directly comparable verification of LwD's earlier two-million-node claim; this is not proof that such scaling is impossible.

Weighted tests use positive integer-rounded normal node weights and a 30-second budget. KaMIS reductions work very well on several graph types but time out on the tested ER setting. DGL with queue pruning can outperform Gurobi there. For Amazon vehicle-routing-derived MWIS instances, only Gurobi returns usable results; the other implementations encounter unsupported large weights, memory/time failures or an invalid infinite output. No universal solver ranking follows from either the unweighted or weighted subset.

Appendix D tests Gurobi tuning and a quadratic MIS formulation. The default linear formulation is usually as good or better on these data; the quadratic variant marginally improves DIMACS mean quality at increased time. This is a benchmark-specific observation, not a general statement about linear versus quadratic optimization.

## Limitations

### Reported by the Authors

- Missing or undocumented configurations complicate exact reproduction, including queue pruning and large-scale graph generation.
- Framework abstractions affect memory and runtime; DGL can run out of memory where the lower-level Intel representation succeeds.
- Weighted support differs across releases and conventional reduction rules; some systems cannot represent the tested inputs reliably.

### Curator Notes

- Random guidance matching a trained GCN in these hybrids does not invalidate every neural MIS method. The LwD control itself demonstrates a different outcome.
- Training epochs, original/retrained weights, search enhancements, instance coverage and hardware allocations must accompany the claims.
- A rounded ratio of 1.00, a heuristic reference or matching solution sizes alone does not certify an optimum. The paper's tables identify when certified references are available.
- The current full-text reading covers the arXiv copy and all integrated scientific appendices. Page 10 describes the separate supplement as code/solver patches; the matching Intel/LwD patches and README were checked in the author repository. The OpenReview-hosted copy of that code archive was inaccessible, a provenance limitation rather than an unread scientific appendix.

## Reproducibility

- **Formal qualification:** [ICLR 2022 official event](https://iclr.cc/virtual/2022/poster/6426) and the paper's publication header identify the conference article; the [OpenReview record](https://openreview.net/forum?id=mk0HzdqY7i1) is retained as its canonical link.
- **Actual reading version:** [arXiv:2201.10494v1](https://arxiv.org/abs/2201.10494v1), submitted 25 January 2022, all 25 pages including Appendices A-E. The arXiv source is explicitly distinguished from a byte-verified final publisher copy.
- **Official implementation:** [MaxiBoether/mis-benchmark-framework](https://github.com/MaxiBoether/mis-benchmark-framework), linked in the paper. The current repository includes the two Intel/LwD patches, data-generation modules and solver wrappers; it does not warrant assuming the evaluation is infallible.
- **Supplement check:** OpenReview forum, PDF, attachment and public API endpoints were manually attempted; the official ICLR event and author repository were checked as fallbacks. The paper describes its separate attachment as code/patches, which are available in the checked author repository; no additional scientific appendix is referenced. The exact OpenReview-hosted code archive was not retrieved.
- **Validation scope:** literature/source/note audit; no benchmark runs, retraining or numerical reproduction were performed here.
