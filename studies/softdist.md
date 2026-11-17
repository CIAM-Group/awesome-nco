---
id: softdist
short_title: SoftDist
title: 'Position: Rethinking Post-Hoc Search-Based Neural Approaches for Solving Large-Scale Traveling Salesman
  Problems'
authors:
- Yifan Xia
- Xianliang Yang
- Zichuan Liu
- Zhihao Liu
- Lei Song
- Jiang Bian
year: 2024
date: '2024-06-02'
venue: ICML
paper_url: https://proceedings.mlr.press/v235/xia24f.html
arxiv_url: https://arxiv.org/abs/2406.03503
code_url: https://github.com/xyfffff/rethink_mcts_for_tsp
institutions:
- Nanjing University
- Microsoft Research Asia
- Institute of Automation, Chinese Academy of Sciences
scope: study
paper_type: analysis
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: A position paper uses a distance-based heatmap baseline and matched search budgets to reassess the contribution
  of learned guidance in large-scale TSP.
figure:
  path: paper-assets/softdist/framework.png
  alt: Distance-based SoftDist heatmaps guide MCTS during temperature selection and testing.
  caption: 'Figure 3: SoftDist-guided MCTS during training and testing.'
  source_url: https://raw.githubusercontent.com/mlresearch/v235/main/assets/xia24f/xia24f.pdf
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/xia24f.html
---

# Position: Rethinking Post-Hoc Search-Based Neural Approaches for Solving Large-Scale Traveling Salesman Problems

> **TL;DR:** A non-neural distance-softmax heatmap is competitive with several learned priors inside the evaluated MCTS pipeline. Matched CPU search comparisons favor LKH3. This published ICML position paper analyzes solver evaluation; SoftDist itself is not a learned neural solver.

## Motivation

A heatmap generator is usually trained with a tractable surrogate objective, while the reported final tour comes from a separate, expensive search process. Comparing complete pipelines can therefore obscure which gains arise from the learned prior, downstream implementation, hyperparameters or computation. The paper questions both the benefit of learned heatmaps and the practical efficiency of the particular heatmap-guided MCTS paradigm.

## Contributions

- Introduces SoftDist, a distance-based heatmap with one temperature parameter, as a simple control for learned edge priors.
- Selects its parameter using the final MCTS tour cost, explicitly including the search pipeline in parameter selection.
- Compares aligned heatmap/MCTS settings and introduces a gap-ratio Score relative to LKH3 at matched search resources.

## Methodology

For each off-diagonal pair, SoftDist sets `Φᵢⱼ = exp(−dᵢⱼ/τ) / Σₖ≠ᵢ exp(−dᵢₖ/τ)`. Self-edges are excluded. Small `τ` concentrates probability on nearby nodes; larger values spread it across alternatives. There are no learned network weights, reference-tour labels or gradient updates. “Training” means coarse then refined grid search over `τ`, evaluating the original final tour objective after MCTS on generated tuning instances.

The chosen heatmap initializes edge weights in a guided k-opt search. Exploration depends on both edge weights and visit counts; successful moves update the weights. The procedure also uses conventional initial-tour construction and 2-opt. Consequently, SoftDist's negligible heatmap latency is not its complete solve time.

The proposed metric is `Score = Gap(LKH3) / Gap(MCTS)`, with both gaps relative to a specified reference length. At matched resources, a value below 100% means LKH3 has the smaller residual gap. **Score is a ratio of errors, not a measured runtime speedup or a percentage of instances solved.** Its interpretation depends on the reference and becomes delicate for near-zero gaps.

## Experiments

The study evaluates uniformly generated two-dimensional Euclidean TSP500, TSP1000 and TSP10000. Parameter selection uses 1,024 instances at each smaller scale and 128 at the largest, with seed 1234. Selected temperatures are 0.0066, 0.0051 and 0.0018 respectively. Test instances come from the prior large-TSP benchmark used by Att-GCN and subsequent methods.

SoftDist heatmaps run on an A100 GPU. MCTS and the resource-matched LKH3 comparison use an AMD EPYC 7V13 CPU, with 64 threads for TSP500/1000 and 16 for TSP10000. The LKH3 comparison uses up to 10,000 trials and adjusts runs to align the search time. Some non-MCTS baseline values and heatmap-generation times are inherited from earlier work; the full table is not a fresh identical-hardware rerun of every baseline.

| Test | SoftDist + default MCTS mean length | Gap | MCTS total time | Score against matched LKH3 |
| --- | ---: | ---: | ---: | ---: |
| TSP500 | 16.78 | 1.44% | 1.67 min | 0.84% |
| TSP1000 | 23.63 | 2.20% | 3.34 min | 4.17% |
| TSP10000 | 74.03 | 3.13% | 16.78 min | 29.88% |

The table times cover the full test datasets, not a single instance. SoftDist's separately reported heatmap latency is below 0.01 seconds at the two smaller scales and below 0.1 seconds at the largest. TSP500/1000 gaps use Concorde references; the largest uses an LKH3 reference rather than certified optima.

SoftDist outperforms Att-GCN, DIMES and aligned UTSP configurations on the tested heatmap/search tradeoffs, while DIFUSCO has smaller gaps and substantially larger heatmap-generation cost. For example, reproduced DIFUSCO has TSP10000 gap 2.77% versus SoftDist's 3.13%. The paper explicitly flags this DIFUSCO reproduction: original heatmaps were unavailable and code issues may overestimate its gaps. Att-GCN, DIMES and UTSP comparisons use heatmaps supplied by their authors with MCTS rerun locally. These provenance differences matter when interpreting rankings.

With UTSP-style MCTS settings, even a near-constant heatmap becomes competitive. The “Zeros” control actually contains `1e-10` to avoid division by zero. On TSP500, SoftDist's gap is 1.03% and this control's 1.06%; on TSP1000 they are 1.73% and 1.85%. Search parameter changes can improve quality while reducing runtime, indicating that some previously attributed heatmap gains depend strongly on the search configuration. All tested Score values remain below the matched LKH3 reference, including these alternatives and the studied time-budget curves.

## Limitations

### Reported by the Authors

- They argue that surrogate heatmap training may not align with the final search objective and call for stronger theoretical justification.
- They propose studying more autonomous end-to-end solution generation and better-integrated objectives.
- They disclose reproduction caveats for DIFUSCO rather than treating the reproduced gap as an exact replacement for its original result.

### Curator Notes

- The paper offers analytical motivation and controlled empirical evidence, not a theorem proving that surrogate training cannot work.
- Findings apply to the tested Euclidean TSP distributions, heatmap generators, search implementations and budgets. They do not show that learning is ineffective for every constraint or hybrid solver.
- Temperature is selected separately by scale and search objective; simplicity does not establish parameter-free transfer or generalization guarantees.
- This is categorized as a **research analysis**, retaining the officially published “Position:” title. It is not added to specialist or generalist neural-solver totals.

## Reproducibility

- **Published record:** [PMLR, ICML 2024](https://proceedings.mlr.press/v235/xia24f.html), pages 54178–54190.
- **Official implementation:** [xyfffff/rethink_mcts_for_tsp](https://github.com/xyfffff/rethink_mcts_for_tsp), linked in the paper. Appendix C provides the core heatmap-generation function; reproducing the comparisons additionally requires the specified MCTS, LKH3 and heatmap resources.
- **Reviewed source:** All 13 publisher pages, including the grid-search tables, code appendix, extended related work and time-budget figures. Figure 3 and key tables/formulae were checked visually.
- **Reading map:** Sections 3–5 define the search, baseline and Score; Section 6 describes provenance and comparisons; Appendix A supplies temperature searches and Appendix B alternative-budget plots. This review does not claim experiment reproduction.
