---
id: attention-model
short_title: AM
title: 'Attention, Learn to Solve Routing Problems!'
authors:
  - Wouter Kool
  - Herke van Hoof
  - Max Welling
year: 2019
date: 2018-03-22
acceptance:
  date: "2018-12-22"
  source_url: "https://iclr.cc/Conferences/2019/CallForPapers"
venue: ICLR
paper_url: https://openreview.net/forum?id=ByxBFsRqYm
arxiv_url: https://arxiv.org/abs/1803.08475
code_url: https://github.com/wouterkool/attention-learn-to-route
institutions:
  - University of Amsterdam
  - ORTEC
  - CIFAR
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
  - Capacitated Vehicle Routing Problem
  - Split Delivery Vehicle Routing Problem
  - Orienteering Problem
  - Prize Collecting Traveling Salesman Problem
  - Stochastic Prize Collecting Traveling Salesman Problem
summary: An attention-based autoregressive policy constructs routing solutions node by node and is trained with REINFORCE using a rollout baseline.
figure:
  path: paper-assets/attention-model/framework.png
  alt: Attention Model decoder selecting a node from the encoded routing graph.
  caption: 'Figure 2: Attention-based decoder for the Traveling Salesman Problem.'
  source_url: https://arxiv.org/pdf/1803.08475
---

# Attention, Learn to Solve Routing Problems!

> **TL;DR:** An attention-based autoregressive policy constructs routing solutions node by node and is trained with REINFORCE using a rollout baseline.

## Motivation

Earlier learned routing heuristics based on Pointer Networks showed promise, but their recurrent encoder-decoder design and critic-based reinforcement-learning setup left room for improvement in representation quality, training stability, and solution quality. The paper investigates whether a fully attention-based model and a simpler rollout baseline can provide stronger learned construction heuristics.

## Contributions

- Introduces an attention-based encoder-decoder for routing problems without recurrent sequence processing in the encoder.
- Trains the policy with REINFORCE and a deterministic greedy rollout baseline instead of a separately learned value-function critic.
- Instantiates the same modeling framework for several routing problems by changing problem-specific features, masks, and decoder context.
- Evaluates greedy decoding and sampling-based decoding against learned, heuristic, and exact or highly optimized baselines.

## Methodology

1. A multi-head attention encoder embeds all nodes in the input graph.
2. At each decoding step, the model forms a context from the graph embedding and the partial solution.
3. Infeasible or already selected actions are masked according to the target problem.
4. An attention-based decoder selects the next node, extending the partial solution autoregressively.
5. REINFORCE minimizes expected solution cost; a periodically updated greedy rollout policy supplies the baseline.

## Experiments

- **Problems:** TSP, CVRP, SDVRP, OP, PCTSP, SPCTSP
- **Main instance sizes:** 20, 50, and 100 nodes/customers
- **Test data:** Primarily synthetically generated instances; 10,000 test instances per problem in the main comparison
- **Decoding:** Greedy decoding or best-of-1,280 sampled solutions
- **Baselines:** Exact solvers, specialized heuristics, insertion heuristics, Pointer Networks, and other learned methods depending on the problem
- **Metrics:** Objective value, optimality gap, and runtime
- **Main finding:** The attention model substantially improves over earlier learned construction heuristics and approaches highly optimized solvers on the studied small-to-medium routing instances.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Discussed in the Paper

- Performance degrades as the test size moves farther from the training size, indicating specialization to the trained scale.
- Runtime comparisons are sensitive to implementation language, hardware, parallelization, and decoding budget.

### Curator Notes

- The experiments do not establish a single cross-problem checkpoint; a model trained separately for each task remains necessary.
- Most main experiments use synthetic distributions, so performance on broader real-world distributions is not established by the paper.
- Sampling improves solution quality by increasing inference cost, so greedy and sampling results should not be compared without their budgets.

## Reproducibility

- Official implementation: [wouterkool/attention-learn-to-route](https://github.com/wouterkool/attention-learn-to-route)
- Training and evaluation scripts: available
- Pretrained models: available in the official repository
- Main paper references: Sections 3-5 and Appendix B
