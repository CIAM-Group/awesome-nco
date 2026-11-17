---
id: beyond-single-step-updates-reinforcement-learning-of-heuristics-with-limited-horizon-s
short_title: LHBL
title: 'Beyond Single-Step Updates: Reinforcement Learning of Heuristics with Limited-Horizon Search'
authors:
- Gal Hadar
- Forest Agostinelli
- Shahaf S. Shperberg
year: 2026
date: '2025-11-13'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/41023
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/41023
institutions:
- Ben-Gurion University of the Negev
- University of South Carolina
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Heuristic Search / Planning
problems:
- Rubik’s Cube
- 35 Sliding-Tile Puzzle
- Lights Out
summary: Domain-specific neural cost-to-go learning uses search-derived samples and reverse-Dijkstra frontier targets;
  puzzle/horizon-dependent gains include strong sampling-only counterexamples.
arxiv_url: https://arxiv.org/abs/2511.10264
code_url: https://github.com/SPL-BGU/limited-horizon-bellman-learning
figure:
  path: paper-assets/beyond-single-step-updates-reinforcement-learning-of-heuristics-with-limited-horizon-s/framework.png
  alt: Original Figure2 illustrates frontier heuristic edges to an auxiliary node and edge reversal for shortest-path
    heuristic backups.
  caption: Original Figure2 and full caption explain the auxiliary-node/reverse-graph label computation.
  source_url: https://arxiv.org/pdf/2511.10264v1#page=4
---

# Beyond Single-Step Updates: Reinforcement Learning of Heuristics with Limited-Horizon Search

> **TL;DR:** Limited-Horizon Bellman-based Learning (LHBL) searches locally before constructing heuristic-training targets. It combines exact path costs inside that search with a target network's frontier estimates. Improvements depend on the puzzle, horizon and search batch size; sampling alone can outperform the full update.

## Motivation

Randomly sampled training states can differ from states prioritized by heuristic search. A single-step Bellman target also relies on just one exact transition cost before bootstrapping a potentially inaccurate neural estimate. LHBL studies both changes separately: learning from search-expanded states and replacing the single-step target with a limited-horizon path target. [pp. 1–3]

## Contributions

- Search-derived samples expose the network to states encountered by the deployed search procedure.
- A target minimizes the known path cost to a reachable frontier state plus its target-network heuristic, with zero target for goals.
- An auxiliary node and reversed graph reduce these labels to a single-source shortest-path computation that handles cycles.
- A sampling-only ablation, LHBLS, distinguishes the sampling effect from the additional multi-step backup. [pp. 3–5]

## Methodology

A target network guides a fixed-budget search from a sampled state. Frontier/goal states define terminal estimates for the explored graph. Reverse Dijkstra propagates the minimum path-plus-frontier estimate to expanded states; a neural network fits these labels by mean squared error. Deployment uses batch-weighted A* with priority λg+h. This is offline heuristic training rather than online tabular real-time learning. [Equations 3–5; Algorithm 1; pp. 3–5]

The release's ASTAR update takes frontier nodes from OPEN and adds goals. Its reverse propagation clamps non-goal neural frontier values to at least zero and uses unit transition costs, consistent with these puzzle experiments. Extension to arbitrary weighted transitions requires preserving their actual costs. [updaters/updater.py; utils/search_utils.py]

This is **specialist/constructive**: a domain-trained neural cost-to-go guides path construction by classical search. Reusing the training procedure and architecture across three puzzles does not establish one shared checkpoint. The method does not neurally edit an already complete solution.

## Experiments

Tests use 3×3 Rubik's Cube, the 35 sliding-tile puzzle and 7×7 Lights Out. Each configuration has three seeds and the first 200 DeepCubeA test instances, with a ten-minute cap per instance. Comparisons use SSBL, sampling-only LHBLS and full LHBL, with search horizons 10/50/100. Fully trained tests fix λ=0.6 and vary search batches 1/100/1,000/10,000. [pp. 5–7]

On 35-STP, full LHBL solves 100% across displayed batches, versus SSBL 99.7%; at batch 1, LHBL(50) generates 601 nodes on average versus SSBL 3,384. For Lights Out at batch 100, LHBL(50) solves 91.7% versus SSBL 13.2%. These observations support improved heuristics in the tested settings, while also exposing important exceptions. [Figure 4]

In Rubik's Cube, sampling-only variants outperform full LHBL in the reported final-search metrics. At batch 1, LHBLS(50) solves 100% with 2,819 generated nodes, while LHBL(50) solves 95% with 528,025 nodes. In Lights Out, the horizon 10 sampling-only variant also solves more instances than full LHBL(10). Increasing the horizon therefore does not guarantee improvement. [Figure 4]

Training uses approximately 10 billion generated samples for Rubik/STP and 1 billion for Lights Out. Reported training is 3–4,6–7 and 10–12 days per algorithm/seed for Lights Out, STP and Rubik respectively. Improved sample efficiency should not be read as a demonstrated universal wall-clock training reduction. Appendix B supplies runtimes: larger batches reduce GPU overhead but generate more nodes, and batch 100 usually gives the best reported time tradeoff. [pp. 5–6; Appendix B/Figure 7]

## Limitations

- Neural heuristics are not guaranteed admissible or consistent; learned-heuristic BWAS here has no demonstrated general optimality/suboptimality certificate. The background guarantees are conditional on appropriate heuristic assumptions.
- Success percentages and node/time averages have different meanings when some instances time out. The paper does not establish superior solution lengths or optimality gaps on every setting.
- Results depend strongly on horizon, domain and inference batch. The sampling ablation is a substantive competing result, especially on Rubik's Cube.
- The released test.sh uses domain-specific weights 0.6/0.8/0.2 and batches 10,000/20,000/1,000, rather than the unified fully-trained comparison. It must be adjusted for reproducing each heatmap. The supplied train.sh reuses one save-folder argument across commands, so runs need distinct destinations to retain separate models/configurations.

## Reproducibility

Read the complete 10-page [arXiv v1](https://arxiv.org/pdf/2511.10264v1), including both scientific appendices, full references, all seven figures and magnified result/runtime heatmaps. The formal article is [AAAI 2026](https://ojs.aaai.org/index.php/AAAI/article/view/41023), pages 36955–36963, DOI 10.1609/aaai.v40i43.41023. Publisher-deposited metadata confirms the same three authors and publication on **2026-03-14**; the [actual arXiv history](https://arxiv.org/abs/2511.10264) gives **2025-11-13** for v1. The identified arXiv copy is used under the repository's permitted reading-copy policy.

The [author implementation](https://github.com/SPL-BGU/limited-horizon-bellman-learning/tree/0ab94364f82760455fdd8dc6ea21c3e1d107a249) has 144 inventoried entries, task-specific saved-model paths, training/test scripts and results. No additional scientific PDF/archive/slide/video was identified in the untruncated tree. README, training/testing configuration and core updater/reverse-Dijkstra code were checked; the review does not rerun the multi-day training. Figure 2/full caption is an original crop of page 4. No internal citation edge is inferred merely because another repository paper concerns similar puzzles: the full bibliography was checked against actual article identities.
