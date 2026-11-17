---
id: frontierco
short_title: FrontierCO
title: 'FrontierCO: Real-World and Large-Scale Evaluation of Machine Learning Solvers for Combinatorial Optimization'
authors:
- Shengyu Feng
- Weiwei Sun
- Shanda Li
- Ameet Talwalkar
- Yiming Yang
year: 2026
date: '2025-05-22'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/c131c8875c7b1133ffdad2b53cb10e91-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/c131c8875c7b1133ffdad2b53cb10e91-Abstract-Conference.html
institutions:
- Carnegie Mellon University
scope: study
paper_type: benchmark
problem_families:
- Routing
- Scheduling
- Graph Optimization
- Facility Location
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Maximum Independent Set
- Minimum Dominating Set
- Capacitated Facility Location Problem
- Capacitated p-Median Problem
- Flexible Job-Shop Scheduling
- Steiner Tree Problem
- Asymmetric Traveling Salesman Problem
- CO Benchmark
summary: A benchmark contrasts task-specific neural solvers and generated algorithms with classical solvers on diverse
  public CO instances, including large-scale and structurally hard sets.
code_url: https://github.com/sunnweiwei/FrontierCO
arxiv_url: https://arxiv.org/abs/2505.16952
---

# FrontierCO: Real-World and Large-Scale Evaluation of Machine Learning Solvers for Combinatorial Optimization

> **TL;DR:** FrontierCO evaluates neural solvers and LLM-generated algorithms on eight main CO problems, using public competition/archive instances, synthetic training resources and one-hour test budgets. The study finds substantial gaps to selected classical baselines, with specific agent wins; it does not train one shared eight-problem neural solver.

## Motivation

Performance on small synthetic instances may conceal sensitivity to scale, structure and distribution shift. FrontierCO asks whether current learned solvers remain competitive on the public archives and challenging instances used by classical optimization research (Sections 1-2).

## Contributions

The main suite covers MIS, minimum dominating set, Euclidean TSP, CVRP, capacitated facility location, capacitated p-median, flexible job-shop scheduling and Steiner tree. Each has easy and hard test sets, best-known-solution references, and training/development resources. Easy/hard reflects solver difficulty and structure, rather than a monotonic size threshold: some hard SAT-derived MIS and hypercube STP instances are smaller than easy graphs. Table 1 reports TSP sizes up to ten million nodes and MIS up to about eight million. Appendix F separately adds 64 nonmetric ATSP instances with 131-932 cities.

The contribution is an evaluation benchmark and diagnosis of existing methods. The neural models use separate tasks, sizes, checkpoints and training protocols; agents develop task-specific programs. Applying an agent framework across all tasks does not establish one jointly trained generalist checkpoint.

## Methodology

Test instances combine real-world, adapted and synthetic competition sources, including TSPLIB/DIMACS, BHOSLib, PACE, facility-location archives and FJSP/STP collections. Training and agent development use problem-specific generators, with differing sizes and budgets; Appendix B explicitly omits some neural training counts. The first eight Golden CVRP instances have their route-length constraints removed, so evaluation uses that modified problem definition.

Costs are converted to minimization, with infeasible solutions penalized. Equation 2 measures absolute distance to an optimal or best-known reference, normalized by the larger absolute cost; infeasibility or opposing cost signs gives a gap of one. This differs from the common routing percentage gap. References include published results and, where necessary, up-to-two-hour classical runs; they are not uniformly proven optima.

Core tests allow one hour per instance on one AMD EPYC 7313 CPU core, with one RTX A6000 for neural models. Missing feasible solutions receive gap one and runtime 3,600 seconds. Gaps are averaged arithmetically; runtime summaries use geometric means and multiplicative variation. Runtime comparisons span CPU/GPU and implementation differences and exclude training or agent-development cost.

Appendix C specifies official pretrained checkpoints or task-specific retraining: for example, DIFUSCO uses its TSP-10,000 checkpoint plus greedy/2-opt decoding, DeepACO adds HGS decoding, GCNN learns from strong-branching samples, and LNS uses local-branching trajectories. The LLM agents run 64 development iterations with 300-second dev evaluations, then test the best dev-set program for 3,600 seconds. Self-Refine uses o4-mini at medium reasoning effort; FunSearch and ReEvo have their separately stated population settings. Generated programs yield improving candidates over time.

## Experiments

The detailed tables show substantial distribution/scale challenges. On easy/hard TSP, LEHD's mean normalized gaps are 10.23%/76.84%, DIFUSCO's 4.19%/69.04%, and SIL's 2.51%/21.34%, versus LKH-3's 0.03%/2.89%. Asterisks mark sets containing at least one timeout or memory failure, so aggregate gaps include failed instances. On hard CPMP, all three evaluated neural methods receive 100%; on hard MDS, DiffUCO and SDDS run out of memory.

There are qualified agent wins: Self-Refine achieves 1.30% versus KaMIS's 1.51% on easy MIS, and FunSearch achieves 6.52% versus HGS's 6.74% on hard CVRP. These are means for the selected instances and implementations, without independent-run significance tests establishing superiority. Across the eight main tasks, Table 2 reports mean gaps of 20.35% for FunSearch, 15.11% for Self-Refine and 13.25% for ReEvo.

Two component ablations show DIFUSCO improving over plain 2-opt, 4.19% versus 20.09%, and GCNN improving over SCIP, 3.22% versus 6.50%, while stronger classical baselines remain better. Two separately trained Steiner-node predictors learn Euclidean graphs more readily than the sampled non-Euclidean graphs; this is an empirical architectural/data result, rather than a universal expressivity theorem. The additional ATSP test gives RRNCO 1.42%/15.46% versus LKH-3 0.00%/0.08% on easy/hard sets. Appendix E's separate fast-configuration comparison includes runs exceeding the main one-hour cap and should not be merged into that protocol.

## Limitations

The benchmark couples scale and distribution changes and evaluates a finite collection of solver implementations. Its results do not isolate each cause of degradation or prove that all learned approaches fail. Some classical references are heuristic or time-limited, and the strongest cited FJSP decomposition implementation was unavailable. Agent programming can require substantial API/development resources, beyond the final per-instance budget; the article does not supply a complete end-to-end resource accounting.

### Curator Notes

The abstract's count of 16 ML solvers does not cleanly match Section 3.2's 16 named neural variants plus three LLM agent frameworks, with another neural solver added for ATSP. Table 1 lists 20 hard FJSP instances while Appendix B.7 says 24. Table 11 prints identical RL/SL Steiner-tree rows throughout; we retain their reported values without inventing independent differences. SIL's short description miscites Luo et al. (2023), although Appendix C links its actual repository. These source inconsistencies should be checked when reconstructing experiments.

The gap formula has edge cases hidden by the prose: a feasible empty MIS solution has cost zero and gap one against a negative reference, so 100% gap alone does not prove infeasibility. Zero gap establishes agreement with the reference, not optimality unless that reference is certified; the absolute-difference definition also assigns a positive value to improvements over an outdated reference. The current public aggregation helper has additional boundary behavior: it assigns gap one when both costs are zero, and its missing-row time-padding calculation follows an already-padded gap list. Its exact reproduction should therefore be checked against the paper protocol rather than assumed.

## Reproducibility

- Publication and full text: [ICLR 2026 record](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c131c8875c7b1133ffdad2b53cb10e91-Abstract-Conference.html) and complete 25-page proceedings PDF, including all references and Appendices A-G.
- [Official implementation](https://github.com/sunnweiwei/FrontierCO) and [benchmark data](https://huggingface.co/datasets/CO-Bench/FrontierCO) provide generators, classical-solver interfaces and agent evaluation. The inspected repository commit is `6cafdd8fc0b8138f50e7cf8c2effad80c837b9c3`; neural training/evaluation is partly delegated to upstream repositories. The README's example uses o3-mini, distinct from the paper's stated Self-Refine o4-mini setting.
- The publisher ZIP has 180 entries of code/configuration/documentation and no separate scientific PDF or video. Its documentation and all integrated article appendices were read. Both OpenReview notes API versions for `BVprkacwFY` returned 403; no explicitly referenced missing scientific attachment was identified.
- Author spelling follows the publisher's Ameet Talwalkar, rather than the PDF's Talwalker typo. The [publisher metadata](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c131c8875c7b1133ffdad2b53cb10e91-Abstract-Conference.html) explicitly records `citation_publication_date` as **2026-04-20**, independently of any paper-specific acceptance date. Full bibliography/body matching supplies the review's citation edges; the misattributed SIL citation is not silently converted into a paper edge.

The [primary arXiv history](https://arxiv.org/abs/2505.16952) begins on **2025-05-22** under the precursor title *A Comprehensive Evaluation of Contemporary ML-Based Solvers for Combinatorial Optimization*. The same five-author version chain uses the formal FrontierCO title in v3. This preprint inception is distinct from the **2026-04-20** formal publication-record date.
