---
id: ml4co-bench-101
short_title: ML4CO-Bench-101
title: 'ML4CO-Bench-101: Benchmark Machine Learning for Classic Combinatorial Problems on Graphs'
authors:
- Jiale Ma
- Wenzheng Pan
- Yang Li
- Junchi Yan
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/aa9340420e8d78021c35ae984e1bda85-Abstract-Datasets_and_Benchmarks_Track.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/aa9340420e8d78021c35ae984e1bda85-Abstract-Datasets_and_Benchmarks_Track.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
scope: study
paper_type: benchmark
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Asymmetric Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Maximum Independent Set
- Maximum Clique
- Minimum Vertex Cover
- Maximum Cut
summary: A seven-problem benchmark separates neural prediction, decoding and heuristic search, with task- and size-specific
  evaluation settings.
code_url: https://github.com/Thinklab-SJTU/ML4CO-Bench-101
---

# ML4CO-Bench-101: Benchmark Machine Learning for Classic Combinatorial Problems on Graphs

> **TL;DR:** A seven-problem benchmark compares neural prediction, decoding and heuristic search through a shared implementation framework; GP4CO, LC4CO and AE4CO name method categories, rather than one jointly trained generalist solver.

## Motivation

Reported neural CO results mix changes to networks, data, preprocessing, decoding, stochastic restarts and search budgets. Even identically named greedy decoders can differ. The paper seeks to make these components visible and reusable so that improvements from learning can be distinguished from improvements supplied by the surrounding solver pipeline (PDF pp. 1–3).

## Contributions

The benchmark covers TSP, metric ATSP, CVRP, maximum independent set, maximum clique, minimum vertex cover and maximum cut. Its taxonomy combines solving paradigm—global prediction (GP), local construction (LC) or adaptive expansion (AE)—with one-shot/generative models and supervised, unsupervised, reinforcement or meta-learning. Table 1 explicitly describes GP4CO, LC4CO and AE4CO as categories, not new methods (pp. 3–4).

Appendix C.4 and Table 11 enumerate **24 training datasets and 65 test datasets**, including synthetic, real-world and distribution-shift settings. This is the most explicit inventory in the article. The conclusion, broader-impact text and current repository introduction instead retain a headline count of 34; these numbers should not be treated as interchangeable dataset version identifiers (pp. 10, 19–20).

## Methodology

GP predicts a global heatmap before feasible decoding, LC fixes decisions sequentially, and AE repeatedly predicts a heatmap and fixes a compatible subset of remaining decisions. Model family and learning rule are separate axes. The framework reimplements or adapts representative methods and, in selected cases, extends their evaluated problem coverage beyond their original papers (pp. 3–4).

For the main architecture/learning comparisons, the authors use greedy decoding without postprocessing. Additional experiments vary beam width 16, sampling, four parallel generative runs, routing two-opt/MCTS/Classic-LS, and RLSA for node problems. The RLSA postprocessor initializes noisy samples around a neural solution; its parallel population and iteration budgets vary by task and dataset. MCTS also has explicit size-dependent time limits, maximum depth 10 and maximum 5,000 iterations (pp. 4–5, 15–17).

Architectures follow source methods rather than being identical across all learning regimes: examples include SAG for UTSP, separate DIMES/Meta-EGN backbones, MatNet for ATSP, GOAL-derived supervised construction, and supplied DiffUCO checkpoints. Table 11 specifies training datasets separately by task and scale. A common framework therefore does not establish one checkpoint solving all seven tasks, nor a completely isolated causal comparison of learning objectives (pp. 17–20).

## Experiments

Tests use one NVIDIA H800 80 GB GPU, an Intel Xeon Platinum 8558 CPU, and batch size one/single-thread settings unless specified otherwise. References include Concorde, LKH, GA-EAX, HGS, KaMIS and time-limited Gurobi. The reported Drop is relative to the selected reference solution, which may be heuristic or time limited; negative Drop does not mean exceeding a certified optimum (pp. 6, 17, 20–26).

The results show conditional quality/runtime tradeoffs. In Table 2, TSP-500 GP-OS-SL has 9.683% Drop at 0.047 s, LC-OS-SL 8.825% at 3.964 s, and AE-Gen-SL with three determination steps and five inference steps 3.466% at 0.231 s. More generative inference steps help several tasks but worsen the displayed large-RB clique result. Supervised learning is strong for the tested routing prediction models; unsupervised models are competitive on selected node tasks, especially max-cut, and meta-learning has selected size-transfer advantages. These are findings for the reproduced configurations, not universal rankings (pp. 7–9).

Search materially changes the picture: TSP-500 AE-Gen-SL with four greedy samples and two-opt reaches 0.257% reference-relative Drop at 0.695 s, compared with Concorde's reported 18.672 s. This is a hybrid pipeline result. Cross-distribution tests reuse selected configurations but show substantial ATSP failures, particularly SAT reductions whose known optimum is zero; a percentage Drop is therefore omitted there (pp. 9–10).

The real-data summaries also require their actual selection rule. CVRPLIB's 5.469% mean Drop is Table 20's per-instance best solution from three separately size-trained LC-RL checkpoints, each using multistart sampling and local search. Individual checkpoint means are 7.590%, 8.878% and 7.730%. Using the best-solution portfolio requires accounting for all evaluated runs, rather than assigning that aggregate to one checkpoint (p. 28).

## Limitations

### Discussed in the Paper

The study excludes divide-and-conquer pipelines, learned improvement/search methods, learning-assisted traditional solvers and hypergraphs. It focuses on seven classic problems; time-window routing and job-shop scheduling are proposed extensions. Node selection objectives are unweighted in this benchmark; routing still uses distance/cost matrices (pp. 5–6, 15, 19).

### Curator Notes

The shared protocol reduces some confounding but retains different source backbones, training data, model sizes and task-specific postprocessing budgets. The appendix reports standard deviations of instance performance drops; these are not documented as confidence intervals over repeated independent training runs. Best-composition tables combine learning and heuristics and cannot by themselves isolate the neural component (pp. 7–10, 17–26, 31–32).

Some printed summaries need reconciliation before exact numerical reuse. For example, Table 4 gives TSP-100 LC-RL greedy time 0.767 s, while Table 12 gives 0.098 s for the correspondingly labelled row. Table 8 gives TSP-10K Drop 1.450%, while Table 12 gives 1.501% with the same printed objective/time. Table 11 catalogs TSP-200 although the complete TSP result table omits that size. The TSPLIB BEST column is also not consistently the minimum of the three displayed values, as illustrated by berlin52. These are curator observations about the printed record; no missing results or author corrections are inferred (pp. 8–9, 20–21, 27).

## Reproducibility

- Publication record: [NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/aa9340420e8d78021c35ae984e1bda85-Abstract-Datasets_and_Benchmarks_Track.html).
- Source text: [paper](https://proceedings.neurips.cc/paper_files/paper/2025/file/aa9340420e8d78021c35ae984e1bda85-Paper-Datasets_and_Benchmarks_Track.pdf).
- Implementation linked by the authors: [code](https://github.com/Thinklab-SJTU/ML4CO-Bench-101).

The author repository provides Linux/CUDA installation instructions, task-specific training/testing scripts, dataset/checkpoint links and a dataset authentication manifest. Its documented stack includes PyTorch 2.1.0 and ML4CO-Kit 0.3.3; DIMES requires a different legacy environment, and DiffUCO/LwD reproduction is delegated to their original repositories. The README asks users to choose training/validation splits, so exact split choices should be recorded when rerunning experiments. Data, weights and result collections are linked through [Hugging Face](https://huggingface.co/datasets/ML4CO/ML4CO-Bench-101-SL).

This audit read the complete 35-page proceedings PDF, all 78 references, Appendices A–E and checklist, and visually checked the taxonomy, algorithms, dataset inventory and key result tables. The publisher exposes no separate supplement; the complete author-repository tree contains no scientific PDF/ZIP attachment. Both OpenReview API versions returned 403 and this access outcome is recorded. Results are checked against the source text and selected author documentation, without retraining models or rerunning the benchmark.
