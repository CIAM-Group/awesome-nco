---
id: beyond-heatmap-mcts
short_title: Beyond Heatmap
title: 'Beyond the Heatmap: A Rigorous Evaluation of Component Impact in MCTS-Based TSP Solvers'
authors:
- Xuanhao Pan
- Chenguang Wang
- Chaolong Ying
- Ye Xue
- Tianshu Yu
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/e3bf2f0f10774c474de22a12cb060e2c-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/e3bf2f0f10774c474de22a12cb060e2c-Abstract-Conference.html
institutions:
- The Chinese University of Hong Kong, Shenzhen
- Shenzhen Research Institute of Big Data
- Sun Yat-sen University
scope: study
paper_type: analysis
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: A component study measures MCTS configuration, heatmap postprocessing and an empirical nearest-neighbor-rank
  prior on large Euclidean TSP, with separate tuning and transfer evaluations.
code_url: https://github.com/LOGO-CUHKSZ/beyond-heatmap-mcts-tsp
---

# Beyond the Heatmap: A Rigorous Evaluation of Component Impact in MCTS-Based TSP Solvers

> **TL;DR:** Carefully tuned MCTS makes simple heatmaps strong controls for learned TSP guidance. GT-Prior assigns probabilities from empirical neighbor-rank statistics of reference tours; its heatmap has no trainable neural weights, while its downstream search still requires tuning. This is an evaluation study, not a new neural solver.

## Motivation

In a heatmap-plus-MCTS pipeline, the neural model predicts promising edges and a conventional search produces the final tour. Different candidate sets, search depths, weight updates and postprocessing can confound claims about the learned component. The paper asks how much performance comes from the heatmap, how much comes from search configuration, and whether strong simple priors change the comparison.

## Contributions

- Evaluates each heatmap with independently selected MCTS settings rather than attributing default-search results entirely to the model.
- Introduces GT-Prior, a non-neural control based on the empirical frequency of edges to the first, second and subsequent nearest neighbors in solved instances.
- Studies hyperparameter importance with SHAP, heatmap postprocessing, offline tuning cost, scale/distribution transfer and TSPLIB behavior.

## Methodology

The inherited search maintains a valid tour and explores k-opt modifications. A heatmap initializes edge weights; a potential combines normalized weights with a visit-dependent exploration term. Improving moves update weights, and the search restarts or continues within a time limit. The study varies six settings: exploration coefficient Alpha, update coefficient Beta, maximum k-opt depth, candidate-set size, simulation parameter H and whether the heatmap constructs candidate sets.

Grid search uses a separate uniform tuning set of 128 instances for TSP500/1000 and 16 for TSP10000. The nominal Cartesian space has 864 configurations; the Zero control fixes heatmap-based candidate selection to false. Test performance is evaluated after selecting settings by mean reference gap. SHAP attributes observed changes within this tested configuration space; these attributions do not prove a universal causal ranking of hyperparameters.

GT-Prior first solves a small reference set with Concorde at the two smaller scales and LKH3 at TSP10000. For each tour edge it records the destination's distance rank from its source, then averages the resulting rank frequencies across instances. An edge `(i,j)` receives the empirical probability for its neighbor rank `k(i,j)`. Appendix L prints the actual probability vectors. The paper calls this heatmap parameter-free: there is no neural fitting or tuned temperature. It nevertheless uses solved-instance statistics, and the complete pipeline has tuned MCTS parameters. It is therefore inaccurate to describe GT-Prior as a data-free or tuning-free solver.

Appendices B and D separately examine heatmap sparsification, distance-based refinement, greedy decoding and plain 2-opt. The reproduced Fast-T2T-to-MCTS adapter is this study's postprocessing choice; the original Fast-T2T paper does not report this particular MCTS configuration.

## Experiments

The main benchmark uses uniform two-dimensional Euclidean TSP500, TSP1000 and TSP10000 from earlier large-TSP work. Concorde references are used at the smaller scales and LKH3 reference tours at the largest; these largest-scale gaps are not certificates of distance from the global optimum. Borrowed reference objectives can occasionally produce small negative reported gaps. Experiments run on an AMD EPYC 9754 128-core CPU with 256 GB RAM. The MCTS cap is `Time_Limit * N` seconds per instance: the principal settings correspond to about 50, 100 and 1,000 seconds respectively.

| Heatmap with tuned MCTS | TSP500 gap | TSP1000 gap | TSP10000 gap |
| --- | ---: | ---: | ---: |
| Zero | 0.66% | 1.16% | 3.80% |
| SoftDist | 0.43% | 0.80% | 2.95% |
| DIFUSCO | 0.33% | 0.53% | 2.37% |
| Fast-T2T | 0.12% | 0.65% | 4.22% |
| GT-Prior | 0.50% | 0.85% | 2.14% |

These are Table 1 results for the evaluated pipeline, not each baseline's original best result. Att-GCN, DIMES, UTSP, SoftDist and DIFUSCO rows marked with a dagger reuse heatmaps supplied through the SoftDist study and rerun MCTS locally. Some conventional-solver results and heatmap-generation timings are inherited. Heatmap and MCTS times are separate; MCTS entries are equivalent sequential time per instance. A displayed `0.00m` heatmap cost is rounded, not proof of literally zero computation. UTSP is omitted at TSP10000 because matching heatmaps were unavailable.

Changing MCTS settings alone moves DIMES on TSP10000 from 4.86% to 91.31% gap in the explored spectrum. Candidate-set size and the heatmap-selection switch are particularly influential at the largest scale. GT-Prior is competitive, but Fast-T2T and DIFUSCO have smaller gaps at the two smaller scales, so the result does not establish universal superiority of simple priors.

For scale transfer, a prior derived at TSP500 gives 2.13% gap at TSP10000 versus its same-scale 2.14% reference result. On clustered, explosion and implosion TSP10000, uniformly derived priors with uniformly tuned search give 0.35%, 0.93% and 0.58%. TSPLIB exposes a different limitation: on medium instances GT-Prior has 10.08% gap with uniform-tuned settings, 3.63% with default settings and 0.55% under instance-level TSPLIB grid selection. The last setting uses information from the evaluated instance and must be distinguished from transfer.

Offline tuning is substantial. Appendix I reports grid-search costs of 24, 48 and 6 hours versus 1.39, 2.78 and 3.47 hours for 50 SMAC3 configurations. The SMAC3 comparison also uses different evaluation budgets at the largest scale. Training-cost figures in Appendix C are approximate, cross-hardware references, not a controlled speed comparison. Appendix K studies shorter tuning runs and sample counts; its evidence supports these settings rather than a general sample-complexity guarantee.

## Limitations

### Discussed in the Paper

- The experiments and prior concern Euclidean TSP and a search with TSP-specific k-opt actions. Other routing constraints, non-Euclidean costs and alternative search actions need separate evaluation.
- Hyperparameter selection is empirical, potentially expensive and dependent on instance distribution. The paper does not derive an optimal configuration rule.
- Extending the component findings to other search mechanisms remains future work.

### Curator Notes

- GT-Prior uses reference-tour statistics, and its good transfer on the tested synthetic distributions does not guarantee robustness on all geometric structures. The TSPLIB settings show concrete transfer failures.
- Tuning on TSPLIB instances, tuning on separate uniform instances and using defaults are different evaluation protocols; their scores should not be combined into one generalization claim.
- The manuscript contains small numerical inconsistencies between some appendix prose and tables, and rounded gaps differ between Tables 1, 2 and 7. The selected main comparison above follows Table 1 exactly; no result was independently rerun to resolve those discrepancies.
- This is an empirical analysis of learned guidance and conventional search, with a non-neural control. It does not show that neural optimization is ineffective in general or count as a specialist/generalist learned solver.

## Reproducibility

- **Publication:** [ICLR 2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/e3bf2f0f10774c474de22a12cb060e2c-Abstract-Conference.html), pages 140561-140589. The [publisher metadata](https://proceedings.iclr.cc/paper_files/paper/2026/hash/e3bf2f0f10774c474de22a12cb060e2c-Abstract-Conference.html) explicitly records `citation_publication_date` as **2026-04-20**, independently of any paper-specific acceptance date.
- **Reviewed source:** All 29 [publisher PDF](https://proceedings.iclr.cc/paper_files/paper/2026/file/e3bf2f0f10774c474de22a12cb060e2c-Paper-Conference.pdf) pages, including complete references and Appendices A-N. Search equations, key result tables, prior distributions and time-budget figures were checked visually.
- **Supplement:** The publisher-linked ZIP was inspected, including its nested test-data ZIP. It contains Python/C++ code, READMEs and three text datasets, with no additional scientific PDF. The two READMEs were read; code was not executed.
- **Implementation:** [Official author repository](https://github.com/LOGO-CUHKSZ/beyond-heatmap-mcts-tsp), also linked in the paper. The supplement gives Python 3.10, CPU PyTorch/SMAC setup, test scripts, a GT-Prior generator and the MCTS wrapper; other baseline heatmaps require the cited SoftDist resources.
- **Reading map:** Sections 3-5 cover tuning and comparisons; Appendix B postprocessing; C setup cost; D-F expanded results; G TSPLIB protocols; H-I configurations and SMAC3; J-L prior/tuning evidence; M limitations. This review verifies reported information and source provenance, not numerical reproduction.
