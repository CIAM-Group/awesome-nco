---
id: att-gcn
short_title: Att-GCN
title: Generalize a Small Pre-trained Model to Arbitrarily Large TSP Instances
authors:
- Zhang-Hua Fu
- Kai-Bin Qiu
- Hongyuan Zha
year: 2021
date: '2020-12-19'
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/16916
code_url: https://github.com/Spider-scnu/TSP
institutions:
- Shenzhen Institute of Artificial Intelligence and Robotics for Society
- The Chinese University of Hong Kong, Shenzhen
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: Small supervised attention-GCN models build a large TSP edge heatmap from
  normalized overlapping subgraphs; adaptive k-opt search improves complete tours
  using that heatmap.
arxiv_url: https://arxiv.org/abs/2012.10658
publication:
  date: '2021-05-18'
  source_url: https://doi.org/10.1609/aaai.v35i8.16916
figure:
  path: paper-assets/att-gcn/framework.png
  alt: 'Complete Att-GCRN pipeline: graph sampling and sub-heatmaps, graph fusion,
    complete heatmap, and Monte Carlo search for a TSP tour.'
  caption: 'Figure 1: Local neural heatmaps are fused before complete-tour search.'
  source_url: https://cdn.aaai.org/ojs/16916/16916-13-20410-1-2-20210518.pdf#page=3
---

# Generalize a Small Pre-trained Model to Arbitrarily Large TSP Instances

> **TL;DR:** Reuse small supervised models on overlapping normalized subgraphs, average their edge probabilities into a large heatmap, then optimize complete tours with heatmap-guided k-opt search. The experiment reaches 10,000 cities without training a 10,000-city network.

## Motivation

A supervised TSP model trained at one size can lose accuracy on larger graphs, and collecting optimal large-instance labels is expensive. The paper separates local neural prediction from global tour optimization. Its size extrapolation uses fixed-size local inputs and a handcrafted global search procedure, rather than simply applying a small model directly to a much larger graph.

## Contributions

- Combines coverage-balanced nearest-neighbor graph sampling, coordinate normalization, and overlapping edge-heatmap averaging.
- Trains an attention graph convolutional residual network (Att-GCRN) on small optimal-tour labels.
- Introduces complete-tour improvement search with compact variable-k edge exchanges and adaptive edge statistics. This differs from the constructive MCTS of Xing and Tu, whose tree states are partial tours.

## Methodology

**Small neural model.** Node coordinates and edge distances are embedded into 300-dimensional features. Thirty residual graph convolutional layers update node and edge representations with batch normalization, ReLU, and normalized attention derived from edge features. A three-layer MLP classifies final edge embeddings. The full-version appendix specifies a class-balanced focal loss, batch size 500, Adam with initial learning rate `1e-2`, and 990,000 Concorde-labeled instances per training size. Two distinct models are trained: size 20 for test sizes up to 100, and size 50 for larger instances. Reported training takes 12/25 hours on one GTX 1080 Ti (970/1,270 epochs as printed), excluding optimal-label generation. This is not a single jointly trained multi-size checkpoint. [Full version, Appendix Sections 1.1-1.5, pp. 10-11.]

**Large heatmap.** Choose a vertex that has appeared least often and extract its `m` nearest vertices, including itself. Continue until every vertex appears at least five times. Translate the sampled graph and scale both axes by the same reciprocal maximum span, preserving relative Euclidean geometry; this fits a bounding box in the unit square but does not mathematically guarantee a uniform distribution. The small model predicts each subgraph heatmap, and each edge's estimates are averaged over its occurrences. Edges with probability below `1e-4` are excluded from search. The procedure merges *probabilities*, not valid local tours, and does not iteratively splice subtours from an evolving incumbent. [Main, p. 3, Equations 1-2.]

**Tour optimization.** Initialize a complete tour with a probability-biased constructive rule, then repeatedly apply the first improving promising 2-opt move. When locally stuck, sample larger variable-k transformations. A compact ordered sequence determines which edges to remove and add, with intermediate segment reversals maintaining the final Hamiltonian tour. The appendix works through a complete example. An action closes when it becomes improving or reaches 10 exchanges. [Main, p. 4; full version, Appendix Section 2, pp. 11-12.]

The paper calls its enlarged-neighborhood procedure MCTS/RL. Its online adaptation updates symmetric edge weights `W`, access counts `Q`, and a global simulation count, using heatmap priors, a UCB-like exploration term, and observed improving moves. It does not fine-tune the pretrained GCN by policy gradients. A failed sampling pool triggers a new random initial tour. Defaults are `alpha=1`, `beta=10`, at most `10n` sampled actions, and search limits of `10n` milliseconds for small instances or `40n` milliseconds for larger ones. The best tour across restarts is returned. [Main, pp. 4-6, Equations 3-6.]

## Experiments

**Protocol.** Set 1 contains 10,000 random Euclidean instances each at 20/50/100 cities. Set 2 contains 128 instances each at 200/500/1,000 and 16 at 10,000. These are generated datasets; the paper does not report the previous note's claimed TSPLIB evaluation. Neural methods run on one GTX 1080 Ti with as much batching as fits, while classical methods use an eight-core Xeon Gold 5118. Some baseline beam/sampling settings are expanded for additional runtime, as indicated by underlining in the table. [Main, pp. 5-7.]

**Small sizes.** Table 1 reports lengths 3.8303/5.6914/7.7638 with Concorde-reference gaps 0.0000%/0.0145%/0.0370% at sizes 20/50/100. Times cover all 10,000 instances: 23.33 s plus 1.25 min, 2.59 plus 5.33 min, and 3.94 plus 10.62 min, respectively, split into heatmap building and search. A rounded zero mean gap does not establish exact optimality on every instance. The caption warns that integer approximation makes some Concorde reference values nonoptimal under the evaluated distance convention. [Main, Table 1, p. 7.]

**Larger sizes.** The size-50 model produces gaps 0.8844%/2.5365%/3.2238% at 200/500/1,000 cities relative to the printed Concorde values. At 10,000 cities, the length is 74.9290 versus LKH3's 71.7778, a 4.3902% gap to a heuristic reference, not an optimality certificate. Total time for all 16 largest instances is 4.16 minutes for heatmaps plus 1.69 hours for search. LKH3's reported 8.8 hours uses a different hardware configuration. Several baselines fail memory or five-hour limits at this size; excluding them does not establish that every modern solver is inferior. [Main, Tables 2-3.]

**Ablation.** Replacing the heatmap with uniform edge probabilities greatly worsens the same search: at 1,000 cities the reported gap rises from 3.22% to 2,073.67%. This supports the value of candidate guidance in the tested framework, but does not isolate the relative benefits of sampling, normalization, network changes, and search. Cross-paper comparisons to Xing/Tu and Wu use their published values rather than identical test instances and hosts. [Main, p. 6 and Table 4.]

## Limitations

The evaluated problem is two-dimensional Euclidean TSP. Generalizing to non-Euclidean TSP is explicitly future work. Local predictions need not coincide with globally optimal edges, and candidate pruning can remove useful connections. Dense global heatmap, edge-weight and access-count matrices retain quadratic memory requirements; 'arbitrarily large' in the title is not a proof of unbounded practical scalability or uniform approximation quality. Classical solvers remain substantially stronger references, training requires optimal labels, and success depends on both inference and search budgets.

## Reproducibility

- **Official code and full text:** [Spider-scnu/TSP](https://github.com/Spider-scnu/TSP), explicitly linked by the paper. The repository supplies an extended PDF, dataset and heatmap links, network code, and GPU/CPU search variants. README and repository inventory were inspected; code was not executed.
- **Reading:** All nine publisher pages plus all 13 pages of the author-linked full version were freshly read, including the unique four-page appendix on network architecture, loss, exchange example, and baseline training. Key equations, tables and diagrams were visually checked. [Audit record](../data/reviews/papers/att-gcn.json).
- **Dates and affiliations:** First arXiv submission is 19 December 2020, replacing the unsupported November date. Publisher/Crossref publication is 18 May 2021; no individual acceptance date is established. Both the Shenzhen Institute of Artificial Intelligence and Robotics for Society and CUHK Shenzhen appear in the title block.
- **Supplement check:** The OJS landing returned a bot block. Its CDN paper explicitly refers to the full version in the author repository; that complete 13-page PDF was obtained and read. The repository inventory's other ZIPs are datasets or heatmaps, not additional scientific appendices.
