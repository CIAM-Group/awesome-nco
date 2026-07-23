---
id: dynamic-AM
short_title: dynamic attention model
title: "A Deep Reinforcement Learning Algorithm Using Dynamic Attention Model for Vehicle Routing Problems"
authors:
  - Bo Peng
  - Jiahai Wang
  - Zizhen Zhang
year: 2019
date: 2019-11-16
venue: ISICA
paper_url: https://doi.org/10.1007/978-981-15-5577-0_51
arxiv_url: https://arxiv.org/abs/2002.03282
code_url: https://github.com/Roberto09/Dynamic-Attention-Model-for-VRP---Pytorch
institutions:
  - Sun Yat-sen University
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Capacitated Vehicle Routing Problem
summary: AM-D recomputes node embeddings whenever the vehicle returns to the depot, using a dynamic encoder-decoder and REINFORCE to improve VRP construction over static attention models.
---

# A Deep Reinforcement Learning Algorithm Using Dynamic Attention Model for Vehicle Routing Problems

> **TL;DR:** AM-D recomputes node embeddings whenever the vehicle returns to the depot, using a dynamic encoder-decoder and REINFORCE to improve VRP construction over static attention models.

## Motivation

The paper targets the static representation used by the original Attention Model for routing problems. In that model, node embeddings are computed once and remain fixed, even though the feasible state of a VRP instance changes after each construction decision. AM-D argues that this misses structure that becomes visible only after some customers have been visited and the remaining instance has effectively changed.

## Contributions

- Introduces a dynamic attention model for VRP that recomputes node embeddings when the vehicle returns to the depot.
- Modifies the encoder so visited nodes are masked during the dynamic re-encoding step, letting the model represent the updated remaining instance.
- Uses the latest node embeddings inside the decoder at each construction step instead of a one-time static encoding.
- Trains the policy with REINFORCE and a greedy rollout baseline, following the learned-heuristic setup used by prior attention-based routing models.
- Reports improved VRP results and stronger generalization across different customer sizes than the static attention baseline.

## Methodology

1. Each VRP node is embedded from its coordinates and demand, with a separate projection for the depot.
2. The encoder applies stacked multi-head attention and feed-forward layers to produce node embeddings.
3. During decoding, the context vector is built from the graph embedding, the last visited node, and the remaining vehicle capacity.
4. Feasible next nodes are scored with attention; customers that exceed the remaining capacity or have already been visited are masked.
5. After the vehicle returns to the depot, the encoder recomputes node embeddings for the updated remaining instance, masking already visited customers inside the attention computation.
6. The policy is trained with REINFORCE, using the greedy rollout tour length as a baseline and sample rollouts for the gradient estimate.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem at 20, 50, and 100 customers.
- **Baselines:** Gurobi, LKH3, RL (greedy), and the original AM (greedy); the paper also reports AM-D with 2OPT and cross-size transfer settings.
- **Metrics:** Average tour length, optimality gap, and runtime for greedy and 2OPT decoding.
- **Main finding:** AM-D consistently beats the static attention baseline and the other learned baselines on the reported VRP sizes, and it generalizes reasonably well across the tested instance scales.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- The method is evaluated only on VRP, so broader applicability to other combinatorial problems is not demonstrated in the paper.
- Training is expensive: the reported setup requires many epochs and long GPU time, especially for the larger VRP100 instances.
- The model still relies on problem-specific masking and decoding rules, so it does not remove the need for task-specific engineering.

### Curator Notes

- The paper compares against a strong static-attention baseline, but not against every later routing solver, so the gain should be read relative to that generation of learned heuristics.
- Improvement from 2OPT adds a substantial runtime cost, so quality/runtime trade-offs depend on the inference budget.
- Because the architecture and masks are specialized to VRP, the note remains specialist even though the paper discusses generalization across customer sizes.

## Reproducibility

- **Official implementation:** [Roberto09/Dynamic-Attention-Model-for-VRP---Pytorch](https://github.com/Roberto09/Dynamic-Attention-Model-for-VRP---Pytorch)
- **Checkpoints:** Not stated in the paper; repository availability should be checked separately.
- **Main paper references:** Sections 3-6, especially Eqs. 22-23 and Tables 1-2.
