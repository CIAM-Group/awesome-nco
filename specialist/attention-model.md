---
id: attention-model
short_title: AM
title: Attention, Learn to Solve Routing Problems!
authors:
- Wouter Kool
- Herke van Hoof
- Max Welling
year: 2019
date: 2018-03-22
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
summary: Task-specific attention-based routing policies are trained by REINFORCE against a frozen greedy-rollout
  baseline, with explicit state, constraint masks and inference budgets.
figure:
  path: paper-assets/attention-model/framework.png
  alt: Attention Model decoder selecting a node from the encoded routing graph.
  caption: 'Figure 2: Attention-based decoder for the Traveling Salesman Problem.'
  source_url: https://arxiv.org/pdf/1803.08475v3
publication:
  date: '2019'
  source_url: https://arxiv.org/pdf/1803.08475v3#page=1
inclusion: main
paper_type: solver
---

# Attention, Learn to Solve Routing Problems!

> **TL;DR:** An attention encoder and a state-dependent autoregressive decoder learn routing construction policies. A frozen greedy-rollout policy supplies the REINFORCE baseline; models are trained separately for the evaluated problem variants and sizes.

## Motivation

Earlier learned routing methods relied on recurrent encoders or difficult-to-train critics. This paper improves both the policy architecture and its training baseline, aiming to learn useful construction heuristics across routing formulations. It explicitly does not aim to replace a specialized exact TSP solver. Applying a common architecture with shared hyperparameters across experiments is distinguished from deploying one jointly trained multi-problem checkpoint. [Introduction and related work, PDF pp. 1–2](https://arxiv.org/pdf/1803.08475v3#page=1).

## Contributions

- An attention-only encoder replaces recurrent input processing; a compact decoder context represents the remaining routing decision.
- A deterministic greedy rollout of a frozen baseline policy provides an instance-dependent control variate for REINFORCE.
- Problem-specific features, masks, contexts, and objectives support TSP, CVRP, split-delivery VRP, orienteering, and deterministic or stochastic prize-collecting TSP.
- Ablations separate the effects of the architecture and the training baseline, rather than attributing every improvement to attention alone. [Sections 3–5, PDF pp. 3–9](https://arxiv.org/pdf/1803.08475v3#page=3).

## Methodology

**Encode the instance once.** Node features are projected to 128-dimensional embeddings and processed by three attention layers. Each layer has eight attention heads, a node-wise feed-forward block with 512 hidden units, residual connections, and batch normalization. Positional encodings are omitted. Node-aligned outputs follow a permutation of the input nodes; mean pooling supplies an input-order-independent graph embedding. [Section 3.1 and Appendix A, PDF pp. 3 and 13](https://arxiv.org/pdf/1803.08475v3#page=13).

**Construct a solution.** At each step, the decoder computes a multi-head attention glimpse using a state-dependent context, followed by a single-head pointer distribution. For TSP, the context concatenates the graph embedding and the embeddings of the first and current nodes; learned placeholders are used before the first selection. Visited nodes are masked. The final logits use the following form before softmax:

```text
score_j = 10 * tanh(q^T k_j / sqrt(d_k))   if node j is feasible
score_j = -infinity                       otherwise
```

The glimpse and final pointer use their own projections and head configurations. The decoder does not repeat the encoder's all-node attention stack at every decision. [Section 3.2, PDF pp. 3–4](https://arxiv.org/pdf/1803.08475v3#page=4).

**Train against a frozen rollout baseline.** For a sampled solution with cost `L`, the gradient estimator is `(L - b(s)) * grad(log p_theta(solution | s))`. Here `b(s)` is the cost of a greedy solution from a separate frozen policy. At the end of an epoch, the current policy replaces that baseline only if a one-sided paired t-test on 10,000 evaluation instances finds an improvement at the 5% level. Evaluation instances are regenerated after replacement. The paper uses an exponential baseline for initial warmup; it does not train a critic for the principal rollout-baseline method. [Section 4 and Algorithm 1, PDF p. 5](https://arxiv.org/pdf/1803.08475v3#page=5).

**Adapt the problem representation.** The adaptations below are substantive parts of the solver, rather than unrestricted handling of new constraints:

| Problem | Features and changing state | Feasibility and termination |
| --- | --- | --- |
| TSP | Coordinates; graph, first-node and current-node embeddings | Mask visited nodes and close the tour after all are selected. |
| CVRP | Demands; current node and remaining capacity | Mask served or oversized demands; depot visits reset capacity. |
| Split-delivery VRP | Remaining node demand also changes decoder keys and values | Partially served nodes may be revisited; a zero remaining demand is masked. |
| Orienteering | Node prizes; remaining route-length budget | A candidate must allow a return to the depot within the budget; choosing the depot ends the route. |
| PCTSP | Prizes and penalties; remaining required prize | Returning to the depot is masked until the prize requirement is satisfied or all nodes have been visited. |
| Stochastic PCTSP | Expected prizes are known; actual prizes are revealed on visits | Update the remaining prize using observed values and replan through successive decisions. |

The stochastic model is retrained rather than simply evaluated using the deterministic model's weights. Training rollouts and their baseline share the same hidden sampled prizes, reducing gradient noise without revealing future prizes to the policy. [Appendices C–F, PDF pp. 17–25](https://arxiv.org/pdf/1803.08475v3#page=17).

## Experiments

**Training and test budgets.** Experiments use 20, 50 and 100 customer/node instances, with uniform unit-square coordinates and problem-specific demands, prizes and penalties. Training runs for 100 epochs with 2,500 batches per epoch and normally 512 instances per batch; VRP100 uses 256. Adam uses learning rate `1e-4` for the main setting. Test sets contain 10,000 instances. Results distinguish one greedy construction from the best of 1,280 sampled solutions, without adding 2-opt to the AM results. [Section 5 and Appendices B–F, PDF pp. 6–25](https://arxiv.org/pdf/1803.08475v3#page=6).

Selected results from Table 1 are shown below. Gaps are the paper's reported gaps against the best value in that comparison; for several non-TSP settings the reference is a heuristic result, not a certified optimum.

| Setting | AM greedy | AM, 1,280 samples | Reference |
| --- | --- | --- | --- |
| TSP100, lower is better | 8.12; 4.53% gap | 7.94; 2.26% gap | Concorde/Gurobi/LKH3: 7.76 |
| CVRP100, lower is better | 16.80; 7.34% gap | 16.23; 3.72% gap | LKH3: 15.65 |
| Distance-prize OP100, higher is better | 31.62; 4.75% gap | 32.68; 1.55% gap | Compass: 33.19 |
| PCTSP100, lower is better | 6.25; 4.46% gap | 6.08; 1.67% gap | C++ ILS: 5.98 |

[Table 1, PDF p. 7](https://arxiv.org/pdf/1803.08475v3#page=7). The ablation compares AM and the Pointer Network with exponential, critic, and rollout baselines, using two random seeds. Both architecture and baseline contribute. Higher learning rates can destabilize deeper models; the appendix reports diverged runs rather than universal robustness. [Section 5.2 and Table 2, PDF pp. 9 and 16](https://arxiv.org/pdf/1803.08475v3#page=16).

**Time accounting matters.** Table 1 times cover the entire 10,000-instance test set, using a GTX 1080Ti for AM or a 32-virtual-CPU system for applicable baselines. They are not per-instance latencies measured on identical hardware. Training TSP20/50/100 takes approximately 5:30, 16:20, and 27:30 minutes per epoch in the reported setup, with two GPUs for TSP100. Sampling improves quality at a higher inference budget. [Section 5, PDF p. 6](https://arxiv.org/pdf/1803.08475v3#page=6).

## Limitations

### Discussed in the Paper

- Cross-size solution quality deteriorates as test size moves away from the training size; Figure 5 does not establish unrestricted size generalization.
- Important practical constraints cannot always be handled by a simple local mask. Backtracking is proposed as a future direction, not implemented as a general solution here.
- The authors could not reproduce the previously reported Pointer Network result under their own critic-baseline implementation and distinguish their reproduction from the original numbers.
- Qualitative CVRP examples still contain suboptimal route orderings, suggesting opportunities for additional optimization. [Sections 5.2–6 and Appendices B.5/C.4, PDF pp. 9, 15–19](https://arxiv.org/pdf/1803.08475v3#page=9).

### Curator Notes

- Common hyperparameters across tasks do not imply shared trained weights. This is a specialist constructive-method entry.
- Stochastic-prize adaptation is demonstrated under a particular reveal-on-visit distribution and feasibility convention, not arbitrary stochastic routing.
- Sampling count, device, baseline configuration and whether the reference is optimal or best-known must accompany performance comparisons.

## Reproducibility

- **Formal record:** [ICLR 2019](https://openreview.net/forum?id=ByxBFsRqYm).
- **Reviewed copy:** [arXiv:1803.08475v3](https://arxiv.org/pdf/1803.08475v3), dated 7 February 2019 and explicitly headed as published at ICLR 2019; all 25 pages, including Appendices A–F, were read.
- **Dates:** [arXiv history](https://arxiv.org/abs/1803.08475) establishes the first submission on 22 March 2018. The previous conference-notification date has been removed as unsupported paper-specific acceptance evidence.
- **Official implementation:** [attention-learn-to-route](https://github.com/wouterkool/attention-learn-to-route), linked in the paper, with training/evaluation scripts and pretrained models. Availability was checked; experiments were not rerun for this review.
- **Audit trail:** [Source locators, reading coverage, and verified outgoing citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/attention-model.json).
