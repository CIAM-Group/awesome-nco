---
id: roco
short_title: ROCO
title: 'ROCO: A General Framework for Evaluating Robustness of Combinatorial Optimization Solvers on Graphs'
authors:
- Han Lu
- Zenan Li
- Runzhong Wang
- Qibing Ren
- Xijun Li
- Mingxuan Yuan
- Jia Zeng
- Xiaokang Yang
- Junchi Yan
year: 2023
date: '2021-12-28'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=2r6YMqz4Mml
venue: ICLR
paper_url: https://openreview.net/forum?id=2r6YMqz4Mml
institutions:
- Shanghai Jiao Tong University
scope: study
paper_type: analysis
arxiv_url: https://arxiv.org/abs/2201.00402
code_url: https://github.com/Thinklab-SJTU/ROCO
problem_families:
- Graph Optimization
problems:
- CO Robustness
- DAG Scheduling
- Asymmetric Traveling Salesman Problem
- Maximum Coverage
- Maximum Coverage with Separate Coverage Constraints
summary: ROCO evaluates black-box solvers by searching for graph edits that worsen returned solutions while guaranteeing a no-worse optimum.
---

# ROCO: A General Framework for Evaluating Robustness of Combinatorial Optimization Solvers on Graphs

> **TL;DR:** ROCO searches for graph edits that make a solver return a worse objective even though the edited problem has a no-worse optimum. Problem-specific admissible edits make this comparison possible without optimal labels or gradients through the target solver.

## Motivation

A poor returned solution can reflect either a harder optimum or an unreliable solver. Optimality-gap measurements require unavailable optimal solutions, while gradient-based attacks do not directly cover classical heuristics or mixed-integer solvers. ROCO separates these issues by changing an instance in a direction that provably cannot worsen its optimum, then testing whether the solver nevertheless performs worse under the specified resource budget (arXiv v2 PDF pp. 1–4).

## Contributions

The framework supplies an optimum-free sufficient test for an **increase in additive optimality gap**. For minimization, if the edited optimum is no larger than the original optimum and the returned cost is larger, the new additive gap must be larger. The implication is Eq. (2), not a procedure for recovering the gap's absolute value (p. 4).

ROCO uses either a learned black-box attacker or search baselines, and demonstrates problem-specific admissible edits on four tasks with classical and learned target solvers. It is a robustness-evaluation framework; neither the use of several tasks nor the word “general” establishes a single generalist solving checkpoint.

## Methodology

For DAG scheduling, deleting precedence edges enlarges the feasible schedule set. For ATSP, halving an edge cost cannot increase any fixed tour's cost. For maximum coverage, adding set–element incidence edges cannot decrease the best achievable covered weight. The separate-coverage variant adds only black-element incidences, leaving the white-element coverage constraint unchanged. The maximization tasks use the corresponding reversed objective direction (pp. 4, 7–9, 12).

ROCO-RL treats an edited graph as a state, an admissible edge modification as an action, and the change in the target solver's returned objective as reward. PPO trains an actor–critic with task-specific GNN encoders and attention pooling. Start/end nodes are selected sequentially; testing uses a limited beam. Candidate masks exclude some current-solution edges or selected sets to reduce search cost. These masks and beam search are heuristics, rather than exhaustive optimization over all valid attacks (pp. 5–6, 8–9, 13–14).

ROCO-RA repeats random trajectories and retains the best; ROCO-OG maintains a beam with sampled actions; ROCO-SA uses simulated annealing. The single-trajectory random baseline is a different comparison. Appendix H specifies task-specific budgets and search widths: 20 modifications for DAG/ATSP and 10 for the two coverage tasks, with RL beam widths 3, 5, 6 and 6 respectively. Attacker settings are chosen to make evaluation times comparable, while training cost is separate (pp. 6, 16–17).

## Experiments

The study reports 14 solver–problem combinations across DAG scheduling, ATSP, maximum coverage and maximum coverage with separate coverage constraints (MCSCC). DAG/ATSP/MC/MCSCC attack datasets have 50 training instances per configuration and respectively 10/20/20/10 test instances. Problem sizes, solvers and time limits are explicitly task dependent (pp. 7–9, 12–13).

For example, on 50-city ATSP, MatNet's mean tour length rises from 1.6915 to 1.7279 million under ROCO-RL, while LKH3 changes from 1.6621 to 1.6679 million. On ordinary maximum coverage with 100 sets and 200 elements, Gurobi at 0.5 seconds changes from 0.7491 to 0.7409 in units of ten thousand covered weight. The headline degradation above 20% belongs to the more challenging **MCSCC** setting: at 30 sets, 150 black elements and 3,000 white elements with a 1-second limit, Gurobi's covered weight falls from 18.8934 to 14.2740, about 24.4% relative to the clean returned value (Tables 3–5, pp. 8–9, 13).

Random baselines use 100 trials; the search attackers use 10 trials; the fixed trained RL attacker with deterministic beam decoding is reported once. This does not imply that retraining the RL agent is independent of random seeds. The study also compares MatNet trained on fresh instances with a fixed 10,000-instance training set, and reports longer unbounded-time Gurobi solves on attacked MCSCC cases (pp. 6–9, 13).

## Limitations

### Curator Notes

A successful attack certifies an additive-gap increase under the no-worse-optimum premise. Failure to find one does not certify robustness: the attack family, candidate masks, training and search budget restrict the search. Feasible returned solutions and comparable solver resource budgets are part of the interpretation; failure to find an incumbent under a short MILP time limit requires separate handling (pp. 3–6, 9).

The allowable edits require problem-specific reasoning and do not apply automatically to every CO task. Few edge edits need not preserve the original data distribution or secondary structural properties. In particular, halving an individual ATSP edge preserves the no-worse-optimum argument but does not generally preserve the triangle inequality of the clean “tmat” generator. The appendix's MCSCC generator deliberately creates heterogeneous set quality to expose attacks, so these results should not be treated as a distribution-free solver ranking (pp. 8, 16, 18).

The printed Appendix E.2 “ILP” expression includes a product of decision variables in its coverage indicator constraint. That expression encodes the intended binary logic but is not itself linear; reproducing a literal MILP requires a linearization or an equivalent coverage formulation. This is a curator observation about Eq. (13), not a claim that the public implementation uses that exact nonlinear expression (p. 16).

## Reproducibility

The [official ICLR 2023 poster entry](https://iclr.cc/virtual/2023/poster/11370) confirms the formal title and nine authors; the linked [scientific poster](https://iclr.cc/media/PosterPDFs/ICLR%202023/11370.png) was read visually. The full scientific reading copy is [arXiv:2201.00402v2](https://arxiv.org/pdf/2201.00402v2), dated 4 June 2022: all 18 pages, 43 references and Appendices A–I were read, with key formulas, attack diagrams and numerical tables inspected visually. That version has a shorter title and six authors; the frontmatter retains the formally published nine-author metadata. The formal OpenReview PDF and both attachment APIs returned verification-required 403 responses. All scientific appendices explicitly referenced by the available full text are integrated in v2.

The [author implementation](https://github.com/Thinklab-SJTU/ROCO), linked on the official poster, provides task directories, pretrained models, environment instructions and DAG/ATSP train/test commands. It specifies Python 3.7, PyTorch 1.9.0 and PyTorch Geometric 1.7.2; ATSP requires the separately compiled LKH executable. Appendix F calibrates solver limits using 20 repeated calibration-MIP solves, while Appendix H gives GNN depth, feature dimensions, PPO parameters and search settings. Reading the repository confirms these reproduction resources, rather than successful reproduction of every experiment; numerical experiments were not rerun.
