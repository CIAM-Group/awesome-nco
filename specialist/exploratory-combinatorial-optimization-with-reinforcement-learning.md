---
id: exploratory-combinatorial-optimization-with-reinforcement-learning
short_title: ECO-DQN
title: Exploratory Combinatorial Optimization with Reinforcement Learning
authors:
- Thomas D. Barrett
- William R. Clements
- Jakob N. Foerster
- Alex I. Lvovsky
year: 2020
date: '2019-09-09'
publication:
  date: '2020-04-03'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/5723
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/5723
institutions:
- University of Oxford
- indust.ai
- Facebook AI Research
- Russian Quantum Center
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Optimization
problems:
- Max-Cut
summary: A message-passing Q-network improves weighted cuts through reversible vertex flips, shaped exploratory
  rewards and random restarts; graph-transfer gains use best-found references with budget and classical-baseline
  qualifications.
arxiv_url: https://arxiv.org/abs/1909.04063
code_url: https://github.com/tomdbar/eco-dqn
figure:
  path: paper-assets/exploratory-combinatorial-optimization-with-reinforcement-learning/results.png
  alt: OriginalFigure1 compares ECO-DQN learning and single-episode MaxCut performance with S2V-DQN andgreedybaselines.
  caption: OriginalFigure1/fullcaption reports empirical ablations andsingle-episode comparisons, notanarchitecturediagram.
  source_url: https://arxiv.org/pdf/1909.04063v2#page=4
---

# Exploratory Combinatorial Optimization with Reinforcement Learning

> **TL;DR:** ECO-DQN learns reversible vertex flips for weighted Max-Cut. History-related observations and rewards for new best cuts/novel local optima support exploration through temporarily worse solutions. Random restarts improve results, with graph-transfer rather than cross-problem generalization.

## Motivation

An irreversible construction policy cannot repair an earlier subset decision. ECO-DQN instead starts from an arbitrary complete partition and learns to revisit decisions while retaining the best cut found during an episode. [pp. 1–3]

## Contributions

- Reversible graph-node actions replace add-only subset construction.
- Seven local/global observations and exploration rewards support repeated visits to promising regions.
- Random-start search and transfer to different graph sizes/distributions are evaluated against S2V-DQN and classical heuristics. [pp. 3–7]

## Methodology

A message-passing Q-network scores flipping each vertex between the two sides of a cut. Rewards include positive improvements over the episode's best cut, normalized by graph size, and a small bonus for newly reached local optima. Observations include current membership, immediate cut change, time since a flip, incumbent-related information and remaining budget. Training uses discount 0.95; reversible episodes last `2|V|` actions and return their best visited solution. [p. 3]

The reported MPNN uses 64-dimensional embeddings and three message-passing rounds. Training uses batch 64, a gradient update every 32 environment actions, learning rate 0.0001 and epsilon decreasing from 1 to 0.05. This is **specialist/improvement**: all reported tasks are weighted Max-Cut, and flips revise an existing feasible partition. [Appendix/Algorithm 1]

## Experiments

Training samples signed Erdős–Rényi or Barabási–Albert graphs, with 50 fixed graphs for learning curves and a separate 100-graph evaluation set. Some curves average five training seeds; Figure 1 tables report quartiles across graphs, whereas Figure 3 uses 68% confidence intervals. These uncertainty conventions should be kept distinct. [pp. 3–6]

Agents trained on 40-node graphs transfer to sizes up to 500; a 200-node ER-trained agent is tested on Physics and GSet benchmarks. Table 1 gives best-reference ratios 0.996 versus S2V-DQN's 0.950 for G1–10 and 0.971 versus 0.919 for the larger GSet group. The 800-node group uses 50 restarts; the 2000-node group uses one episode owing to cost. Reversible agents also have a longer per-episode action budget than the add-only baseline. [Figures 1–3; Table 1]

Results are not universally superior: the single-episode BA-200 comparison gives 0.93 for ECO-DQN versus 0.94 for S2V-DQN. Supplemental Table 5 shows the Leleu heuristic reaching the best reference on 97/100 BA-500 graphs versus 12/100 for the ECO-DQN reference-building ensemble. On 500-node graphs, ECO-DQN's reported time **per action** is 6.64 ms versus 1.38 ms for greedy MCA on a Tesla M60; this is not a full-run speed comparison. [Figure 1; Tables 3–5]

## Limitations

The broad graph-CO formulation is demonstrated empirically only on Max-Cut. The finite search budget and discounted/shaped rewards do not supply a global-optimality or approximation-ratio guarantee. The paper itself identifies short reward horizons and handcrafted history features as limitations. [p. 6]

For many synthetic graphs, the denominator called “optimum” is the **best solution found by a battery of methods**, including ECO-DQN. Supplemental comparisons combine different agents/restarts, allow CPLEX ten minutes per instance and tune two continuous heuristics separately. Exact certification is reported only for smaller instances, so ratios near one should not automatically be described as proven optimal solutions. [pp. 4, 9]

## Reproducibility

Read all **nine pages** of [arXiv v2](https://arxiv.org/pdf/1909.04063v2), including the architecture/training appendix, full references and the complete final-page **Supplemental Material**. Inspected every figure/table and cropped original Figure 1 with its caption. The [actual version history](https://arxiv.org/abs/1909.04063) gives v1 **2019-09-09** and read v2 **2020-01-31**. The formal [AAAI 2020 article](https://ojs.aaai.org/index.php/AAAI/article/view/5723), DOI 10.1609/aaai.v34i04.5723, is independently identified by publisher-deposited metadata: four authors, pages 3243–3250 and online publication **2020-04-03**.

The [paper-linked code at the inspected commit](https://github.com/tomdbar/eco-dqn/tree/134df732cbdc32ad840ee2c05079fb2dbb6dd6d0) has 202 archive members and includes experiment scripts, graph/reference files and pretrained agents. README was read; the full archive inventory contains no additional scientific PDF, TeX, notebook or nested archive. Stored graph/model files were inventoried without deserialization. Training and benchmark reproduction were not performed. Four internal citation edges use actual body mentions and exact matching references.
