---
id: mip-gnn-a-data-driven-framework-for-guiding-combinatorial-solvers
short_title: MIP-GNN
title: 'MIP-GNN: A Data-Driven Framework for Guiding Combinatorial Solvers'
authors:
- Elias B. Khalil
- Christopher Morris
- Andrea Lodi
year: 2022
date: '2022-05-27'
publication:
  date: '2022-06-28'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/21262
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/21262
institutions:
- University of Toronto
- Scale AI Research Chair in Data-Driven Algorithms for Modern Supply Chains
- Mila – Quebec AI Institute
- McGill University
- Polytechnique Montréal
- Jacobs Technion-Cornell Institute, Cornell Tech and Technion – IIT
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
- Graph Optimization
problems:
- Generalized Independent Set
- Fixed-Charge Multicommodity Network Flow
summary: Bipartite GNNs learn thresholded near-optimal solution-pool biases and reuse their predictions for CPLEX
  node selection, warm starts and branching; per-distribution models and same-GISP transfer do not establish one
  checkpoint across native optimization problems.
arxiv_url: https://arxiv.org/abs/2205.14210
code_url: https://github.com/lyeskhalil/mipGNN
figure:
  path: paper-assets/mip-gnn-a-data-driven-framework-for-guiding-combinatorial-solvers/framework.png
  alt: Variable-to-constraint and constraint-to-variable messages produce bias predictions used to prioritize branch-and-bound
    nodes.
  caption: 'Original Figure 1: MIP-GNN bias prediction and node selection.'
  source_url: https://cdn.aaai.org/ojs/21262/21262-13-25275-1-2-20220628.pdf#page=2
---

# MIP-GNN: A Data-Driven Framework for Guiding Combinatorial Solvers

> **TL;DR:** Learn variable biases from CPLEX solution pools, then use one prediction vector for several solver decisions. Residual-aware bipartite message passing mainly improves node selection. The experiments use separate problem-distribution models, and neither bias predictions nor the appendix theory provide an integer feasibility guarantee on unseen inputs.

## Motivation

Repeatedly solving structurally related MILPs offers information that general-purpose solver heuristics do not explicitly learn. Near-optimal solution pools reveal variables that tend to take particular values. Predicting that information once can guide multiple solver components without running a neural model at every tree node. [Formal pp. 1–3]

## Contributions

- Defines supervised targets from componentwise averages of good binary solutions, then studies thresholded classification targets.
- Adds constraint residual messages to a variable–constraint GNN.
- Reuses predictions for node selection, partial-solution repair/warm starts and branching priorities in CPLEX.
- Reports GISP and fixed-charge network-flow experiments, same-problem transfer, architectural comparisons, additional random-graph results and a conditional theoretical construction. [Formal pp. 1–7; arXiv pp. 11–21]

## Methodology

A bipartite graph represents variables, constraints and nonzero coefficients. Variable features are objective coefficients and degree; constraint features are right-hand sides and degree; edges carry coefficients. Variable-to-constraint messages update constraint embeddings. A scalar decoder provides intermediate assignments, and `softmax(Ax−b)` residual messages feed the return pass. Layerwise variable embeddings are concatenated before classification. GIN, GraphSAGE and EdgeConvolution variants use four interleaved passes, width 64 and a four-layer final MLP. [Formal pp. 3–4, 6]

The ideal bias averages every feasible solution within a tolerance of the optimum. Actual labels instead average a **solver-generated pool**, collected for up to 60 minutes, stopping at 1,000 solutions within 10% of the best found solution. This pool is not guaranteed to exhaust or uniformly sample all near-optimal assignments. Experiments threshold biases at τ∈{0,0.001,0.1}; τ=0 distinguishes zero pool frequency from any positive frequency, rather than predicting a calibrated marginal probability. [Formal pp. 3–7]

Node selection sums confidence/alignment scores over variables fixed along a branch, with best-bound selection every 100 nodes. Warm starts round only sufficiently confident predictions at six thresholds and ask CPLEX to repair each partial solution. Branching prioritizes the confidence of fractional candidates. These change search priorities or provide candidate starts while the classical solver retains feasibility checking and complete-search logic. A rounded vector alone is not guaranteed feasible. [Formal pp. 4–5; arXiv p. 11]

**Classification: Specialist / constructive solver guidance.** The same trained bias model serves multiple CPLEX components for its distribution. Experiments train separately for ten GISP distributions and one FCMNF distribution; transfer in Figure 2d remains within GISP. Neither multiple solver components nor a shared architecture establishes one deployed neural checkpoint solving GISP and FCMNF. [Formal pp. 6–7; official `mipeval.py` graph-specific model paths]

The appendix's Proposition 1 is a finite-training-set **existence construction for approximate LP-relaxation feasibility and bias MAE**, not integer solving or out-of-sample generalization. It assumes an exactly simulated oracle for a weighted single-inequality feasibility problem with bounded residual width, plus a bound Δ on distance from feasible LP points to biases. The proof sketch transforms an L1 objective into linear inequalities and simulates multiplicative weights on a suitably augmented block graph; architecture dimension may depend on the finite set. These assumptions and construction do not certify the deployed four-pass, threshold-trained model. [arXiv pp. 12–13, Assumptions 1–2, Proposition 1, Algorithm 1, Theorem 2]

## Experiments

Each of the ten GISP root-graph sets and the FCMNF set has 1,000 training and 100 test instances; 20% of training examples are validation data. GISP uses the challenging SET2 setting with removable-edge probability 0.75. Adam trains for 30 epochs at initial rate 0.001 with decay/early stopping. CPLEX 12.10 keeps presolve, cuts and primal heuristics, with feasibility emphasis and a 30-minute limit. Evaluation and inference use one CPU thread, and inference time is included. Training uses two 32 GB Tesla V100 GPUs and takes 15–40 minutes per model; CPU work uses E5-2683 v4 machines with 125 GB memory. This excludes the potentially hour-long labeling cost for every training instance. [Formal pp. 6–7; arXiv pp. 11, 20]

Node selection reduces mean GISP primal integral in all ten reported sets: for example, 34.19→14.90 on C125.9 and 181.35→43.75 on gen200_p0.9_44. But final solver gap can worsen: brock200_2 is 0.51→0.57 and keller4 is 0.42→0.48. FCMNF mean integral improves 137.05→125.97 while mean solver gap worsens 0.33→0.35. These are distinct primal and primal–dual measures. Primal-integral references use best solutions found by the tested methods; the appendix defines the solver gap using incumbent magnitude, rather than the unknown optimal objective as denominator. [arXiv pp. 14, 18–19, Tables 3–4, 8–9]

Warm starts and branching have important failures. On brock200_2, warm starts lose final-objective comparisons on 52 instances versus 42 wins, and lose solver-gap comparisons on 75 versus 25. Variable selection on C125.9 yields mean gap 0.55 while default is approximately zero. Same-GISP transfer works well on two displayed sets but is substantially worse on p_hat300-1. An additional 200-node Erdős–Rényi GISP experiment uses a shorter ten-minute limit and reports lower primal integral on 956/1,000 unseen tests. [Formal p. 7; arXiv pp. 15–21]

## Limitations

Pool labels are expensive and solver-dependent; thresholding loses magnitude information. GNN expressiveness and cross-distribution transfer remain limited. The extension discussion proposes bounded binary expansions/multiclass targets for integers and LP completion after fixing integer variables, without providing corresponding general-MILP experiments. The theoretical result requires its oracle and finite-set assumptions and supplies no learning convergence or deployed integer-solver guarantee.

FCMNF win/tie/loss rows sum to **98**, although the text describes 100 tests: 81/0/17 for final objective and 62/0/36 for integral. The discrepancy is retained; the missing two outcomes are not invented and the headline counts are not silently renormalized. Formal warm-start prose also summarizes “6 out of 9” datasets although appendix tables display ten; the notes use the actual per-set evidence. [Formal p. 7; arXiv pp. 14–16]

## Reproducibility

All nine formal pages and all 21 arXiv v1 pages were read, including references, every scientific appendix, full proof sketch, all eleven appendix tables and eight figures. The formal byline supplies the listed institutions; arXiv adds RWTH Aachen to Morris's affiliation, a version difference preserved in the evidence. Publisher/Crossref date is 2022-06-28; arXiv's sole v1 history is 2022-05-27. Actual key formulas, the theoretical construction and all figures/tables were rendered and viewed; Figure 1 is an original crop.

The official repository commit `5b52289da54162aff35bc8c2ecc9a2959f6f96b7` is dated 2021-06-04. Its 400,986,589-byte archive has 8,942 members/8,907 files, including code, data and named pretrained models, but no scientific PDF/TeX/video/notebook or nested archive. Thus the paper's named appendix was obtained from the complete arXiv version. Publisher HTML returned 520 locally; an OpenReview API check was unavailable. No explicit scientific supplement remains outside the read material.

README and evaluation configuration were inspected. Model paths are graph-specific and reused across node, warm-start and branching modes. The current evaluation entry point ends with `ThreadPoolExecutor.map_array`, which the imported standard executor does not provide; this visible release issue would require adaptation before following that entry point literally. It is not evidence that the historical experiments used that exact failing invocation. No weights/pickles were deserialized and no CPLEX solve or neural training was executed.
