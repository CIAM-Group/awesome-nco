---
id: t2t
short_title: T2T
title: 'T2T: From Distribution Learning in Training to Gradient Search in Testing for Combinatorial Optimization'
authors:
- Yang Li
- Jinpei Guo
- Runzhong Wang
- Junchi Yan
year: 2023
date: '2023-12-15'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/9c93b3cd3bc60c0fe7b0c2d74a2da966-Abstract-Conference.html
code_url: https://github.com/Thinklab-SJTU/T2TCO
institutions:
- Shanghai Jiao Tong University
scope: specialist
paradigm: improvement
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Maximum Independent Set
summary: T2T improves complete TSP tours or independent sets by partial noising and objective-gradient-guided diffusion
  reconstruction, followed by feasible decoding, while keeping network weights fixed.
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/9c93b3cd3bc60c0fe7b0c2d74a2da966-Abstract-Conference.html
figure:
  path: paper-assets/t2t/framework.png
  alt: T2T repeatedly noises an existing complete solution and denoises with objective guidance while its learned
    diffusion model stays fixed.
  caption: 'Figure 3: Offline distribution learning and test-time incumbent rewriting.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=7
---
# T2T: From Distribution Learning in Training to Gradient Search in Testing for Combinatorial Optimization

> **TL;DR:** T2T adds noise to a complete solution, reconstructs it using objective-guided diffusion, and keeps the best feasible result. Testing changes the solution and its noisy representation, **not neural-network weights**. Separate models solve TSP and maximum independent set.

## Motivation

Fitting historical reference solutions does not directly optimize each new instance. Repeated diffusion sampling can explore a learned distribution but restarts from scratch. T2T reuses an existing solution, disrupts part of its structure and guides reconstruction with the instance objective. [Sections 1-2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=1)

## Contributions

- Combines supervised solution-distribution learning with test-time diffusion-based **improvement**.
- Derives an objective-gradient modification of denoising probabilities without requiring the optimal objective value or an additional trained guidance network.
- Applies the same framework to edge decisions in TSP and node decisions in maximum independent set (MIS), with different model inputs, checkpoints and feasibility decoders.
- Evaluates rewriting budgets, graph sparsification, weaker supervision, size/distribution transfer and TSPLIB. [Sections 3-4 and Appendices A-G.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=4)

## Methodology

### Learning the solution distribution

A binary selection is represented by a two-category one-hot variable for each edge or node. Forward categorical transitions gradually corrupt a reference solution; the reverse model predicts clean-variable probabilities conditioned on the graph and timestep. Training follows the discrete diffusion variational objective inherited from DIFUSCO. Feasibility is learned only approximately and is finally enforced by **problem-specific decoding**. [Section 3.2, Equations 2-5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=4)

The denoiser is an anisotropic, edge-gated **12-layer GCN**, with sinusoidal embeddings, residual updates and timestep features. TSP uses dimension 256 and edge outputs; MIS uses dimension 128 and node outputs. TSP500/1000 use k-nearest-neighbor sparsification with k=50. Separate models are trained for the different tasks and sizes; framework reuse is not one shared checkpoint. [Appendices E/G.4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=18)

### Objective-guided incumbent reconstruction

For a complete incumbent s, sample a corrupted representation at timestep alpha*T, then perform a shortened guided denoising trajectory. The guidance multiplies the ordinary reverse probability by an exponential term derived from the **negative gradient of the relaxed objective through the denoiser's predicted clean probabilities**. The derivation uses an energy model, a first-order Taylor approximation and a plug-in predicted expectation. Its Bayes identity is not a proof of exact optimal sampling, convergence or feasible intermediate states. [Section 3.3, Equations 7-13 and Appendix C.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=5)

MIS uses negative selected-node count plus a penalty for selecting adjacent nodes. TSP uses distance-weighted edge scores, without encoding all tour constraints in that differentiable objective. At the final denoising step, greedy conflict-free edge insertion or node insertion converts the heatmap to a feasible tour or independent set; TSP can additionally use classical **2-opt**. The algorithm reports the best objective among the initial and rewritten feasible solutions. Its neural parameters stay fixed; gradients guide the noisy solution representation. [Section 3.3.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=6)

For controlled comparisons, initial solutions come from the same unguided DIFUSCO-style denoiser. T2T's new mechanism operates on complete solutions rather than learning a separate initial-construction stage. Under this repository's definitions it is **specialist, improvement**. The paper's Appendix D/Table 12 also explicitly calls T2T an improvement solver. The abstract's phrase “Maximal Independent Set” is imprecise: the formulation maximizes cardinality, so this note uses **Maximum Independent Set**. [Section 3.1 and Appendix D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=17)

## Experiments

### Data, compute and inference budgets

Synthetic TSP coordinates are uniform on the unit square. TSP50/100 tests contain **1280 instances each**; TSP500/1000 contain **128 each**. Training references use Concorde at small sizes and LKH-3 at large sizes. Appendix G reports dataset sizes 1.502M/1.502M/128K/64K and four-A100 training times **19 h 8 min / 59 h 55 min / 22 h 46 min / 38 h 35 min**. Tests run on one A100. Offline training is substantial even though test-time weights are fixed. [Sections 4.1-4.2 and Table 13.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=20)

The usual runtime-controlled T2T configuration uses **20 initial denoising steps plus three rewrites of ten guided steps each**; each guided step also requires backpropagation. DIFUSCO uses 120 steps for the large TSP comparison and 50 for MIS. Four-way parallel sampling is a separate budget from greedy decoding. Reported runtimes from other methods are imported and supplied for reference, so they are not all controlled hardware comparisons. [Sections 4.1/4.3 and Appendix G.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=7)

There are reproducibility inconsistencies worth retaining: the small-TSP main text says both methods use **50 inference steps**, while Appendix G gives a generic 20-step T2T setup and 120-step DIFUSCO statement. Paper Table 14 sets alpha=.25 for TSP50/100 and .4 for TSP500/1000; the inspected official README reverses those small/large values. The released tsp500.sh uses .4, 20 initialization steps, k=50, 5000 allowed 2-opt iterations and fp16. These configurations should be identified explicitly rather than silently combined.

### TSP quality and reported runtime

With greedy decoding and no 2-opt, TSP50/100 gaps fall from DIFUSCO's **0.48/1.01% to 0.04/0.18%**. With 2-opt they are **0.02/0.06%** for T2T. These Table 1 rows do not include runtime. [Table 1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=8)

| Setting | TSP500 gap / reported time | TSP1000 gap / reported time |
| --- | --- | --- |
| DIFUSCO greedy + 2-opt | 1.55% / 5.75 min | 1.86% / 17.52 min |
| T2T greedy + 2-opt | 0.78% / 4.98 min | 1.25% / 15.90 min |
| DIFUSCO sampling x4 + 2-opt | 0.83% / 19.05 min | 1.30% / 59.53 min |
| T2T sampling x4 + 2-opt | 0.37% / 16.03 min | 0.78% / 54.67 min |

These are the reported Table 2 test-run times, not a per-instance latency claim. The improvements depend on the decoder and local-search budget. The abstract's **49.15%** is a relative reduction across selected TSP reference gaps, not a 49% reduction in tour length. [Table 2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=9)

Cross-size transfer generally improves over DIFUSCO, but not universally: the TSP50-trained model tested on TSP1000 has **4.66% gap versus DIFUSCO's 4.54%**. The TSP1000-trained model gives gaps 1.10/1.96/1.00/1.23% on sizes 50/100/500/1000. [Table 4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=10)

TSPLIB uses four samples plus 2-opt and normalized coordinates. A model trained on TSP100 averages **0.133%** across 29 instances of 50-200 nodes versus DIFUSCO's 0.319%. A TSP500-trained model averages **0.27% versus 0.57%** on 19 larger cases; that table includes pr1002 despite its “200-1000” range label. Gaussian, rotation, explosion and cluster experiments favor T2T over the listed DIFUSCO settings but do not prove arbitrary-distribution robustness. [Appendix A, Tables 6-9.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=15)

### Maximum independent set and ablations

MIS uses SATLIB-derived graphs and ER graphs with **700-800 nodes and edge probability .15**. Greedy T2T gives mean sizes **425.02 and 39.56**, gaps **0.22% and 11.83%** to KaMIS, in 8.12/8.53 reported minutes. Four-sample T2T gives **425.22 and 41.37**, gaps **0.17% and 7.81%**, in 23.80/29.73 minutes. DIFUSCO's corresponding sampling gaps are .19%/10.07%. KaMIS remains better in both datasets; on SATLIB the time-limited Gurobi row is also better. The label “Exact” describes solver type, not certified optimality under the imposed time limit. [Table 5 and Section 4.3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=10)

At TSP500, raising rewriting iterations from 0/1/3/5/10 reduces the reported gap from **1.59/.94/.80/.77/.72%**; gains diminish with extra work. Increasing k from 10 to 200 lowers the separate sparsification-ablation gap from .83% to .74%, with more memory/compute. Fewer training examples and farthest-insertion labels still permit useful gradient rewriting; this is weaker-supervision evidence, not label-free training. [Figure 5 and Tables 10-11.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=17)

## Limitations

### Reported by the Authors

- Too much noise harms guidance accuracy, whereas too little restricts structural change; alpha requires tuning.
- Each problem needs a discrete representation and a feasibility decoder. MIP/QAP and additional task coverage are future work, not demonstrated solver capabilities.
- Guided iterations add computational overhead; wider sparse neighborhoods and more samples increase that budget. [Section 3.3.2, Section 5 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/9c93b3cd3bc60c0fe7b0c2d74a2da966-Paper-Conference.pdf#page=7)

### Curator Notes

- Objective-gradient guidance is approximate and does not guarantee that every reconstruction improves the incumbent or reaches an optimum; best-so-far selection protects the final returned score.
- Cross-task models and task-specific decoding justify the specialist classification. Stronger transferred results at some scales do not establish a single task-general checkpoint.
- Small-TSP inference-step statements and paper/README alpha values disagree. Reproduction should pin the implementation and all initialization, rewriting, sampling and postprocessing settings.
- Reported percentage improvements are relative reference-gap changes. Large-TSP training labels and MIS heuristic references should not be conflated with proofs of optimality.

## Reproducibility

- **Formal publication and full text:** [NeurIPS 2023 record](https://proceedings.neurips.cc/paper_files/paper/2023/hash/9c93b3cd3bc60c0fe7b0c2d74a2da966-Abstract-Conference.html); all **21 publisher-PDF pages including Appendices A-G** were reread. The publisher page offers the integrated PDF and no separate scientific attachment. OpenReview page/API required a challenge; unavailable attachments are not claimed as inspected.
- **Metadata precision:** formal title, four authors and Shanghai Jiao Tong University match the title page. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2023/hash/9c93b3cd3bc60c0fe7b0c2d74a2da966-Abstract-Conference.html) explicitly records `citation_publication_date` as **2023-12-15**, independently of any paper-specific acceptance date.
- **Official implementation:** [Thinklab-SJTU/T2TCO](https://github.com/Thinklab-SJTU/T2TCO); main/data READMEs, tsp500.sh and recursive file inventory checked. The code identifies DIFUSCO as its foundation and supplies data/checkpoint links. The newer Fast-T2T is a distinct later paper and is not treated as a citation from the 2023 article.
- **Figure:** original Figure 3, cropped from PDF page 7, distinguishes offline learning from test-time rewriting.
