---
id: rl-vrp
short_title: VRP-RL
title: Reinforcement Learning for Solving the Vehicle Routing Problem
authors:
- Mohammadreza Nazari
- Afshin Oroojlooy
- Lawrence V. Snyder
- Martin Takáč
year: 2018
date: 2018-02-12
venue: NeurIPS
paper_url: https://papers.nips.cc/paper_files/paper/2018/hash/9fb4651c05b2ed70fba5afe0b039a550-Abstract.html
arxiv_url: https://arxiv.org/abs/1802.04240
code_url: https://github.com/OptMLGroup/VRP-RL
institutions:
- Lehigh University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Split Delivery Vehicle Routing Problem
- Stochastic Vehicle Routing Problem
- Traveling Salesman Problem
summary: A recurrent constructive policy attends to static locations and changing demands; beam search, split-delivery
  masks and a separately trained stochastic-routing extension have distinct protocols.
figure:
  path: paper-assets/rl-vrp/framework.png
  alt: VRP-RL model with input embeddings, recurrent decoder state, and an attention layer over dynamic customer
    states.
  caption: 'Figure 2: Dynamic vehicle-routing model with embeddings, recurrent decoder state, and attention.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2018/file/9fb4651c05b2ed70fba5afe0b039a550-Paper.pdf
publication:
  date: '2018'
  source_url: https://proceedings.neurips.cc/paper/2018/hash/9fb4651c05b2ed70fba5afe0b039a550-Abstract.html
---

# Reinforcement Learning for Solving the Vehicle Routing Problem

> **TL;DR:** Removing the recurrent input encoder lets an attention policy use changing customer demands and vehicle load. Distribution-specific training yields greedy or beam-search CVRP construction; split delivery relaxes the same policy's mask, while stochastic routing uses a separately trained A3C policy.

## Motivation

A Pointer Network encoder treats its input as a sequence, although customer inputs form an unordered set. Updating customer demand after each visit would also require refreshing recurrent encodings. The paper instead embeds each customer's local features directly and uses a recurrent decoder to remember decisions. The intended reuse is across instances sampled from a given distribution, size and capacity setting; it is not one policy trained jointly over arbitrary optimization tasks. [Sections 1-3, main PDF pp. 1-5](https://proceedings.neurips.cc/paper_files/paper/2018/file/9fb4651c05b2ed70fba5afe0b039a550-Paper.pdf#page=2).

## Contributions

- Separate static coordinates from dynamic demand/load features, omitting the recurrent encoder while retaining an LSTM decoder and attention glimpse.
- Learn route construction with reward-based policy gradients and a learned critic, using explicit state updates and masks to enforce the evaluated constraints.
- Compare greedy and width-5/10 beam decoding for capacitated VRP; relax a mask to permit split deliveries without retraining.
- Supply auxiliary TSP comparisons and a stochastic arrival/abandonment experiment with a different training objective and A3C training. These are distinct experimental settings, rather than evidence for a shared multi-task checkpoint.

## Methodology

**Represent and attend.** Shared one-dimensional convolution projections embed each node's coordinates into 128 dimensions. Demand and hypothetical remaining load after serving that node are also embedded into 128 dimensions. The decoder is a one-layer, 128-state LSTM, receiving static features of the selected location. Dynamic features enter attention, not the LSTM input. A first attention softmax combines the embedded node and decoder state into a context vector; a second attention softmax scores the next destination using that context. The model is not a graph-convolutional encoder: a tested one-layer GCN brought no improvement and was omitted. [Main Sections 3.2-3.3, pp. 5-6; Supplement C.1, p. 4](https://proceedings.neurips.cc/paper_files/paper/2018/file/9fb4651c05b2ed70fba5afe0b039a550-Supplemental.zip).

**Update feasibility.** On visiting customer `i`, remaining demand becomes `max(0, d_i - load)` and remaining load becomes `max(0, load - d_i)`. The depot refills the vehicle. Fully served customers are masked, zero vehicle load forces a depot return, and a customer whose demand exceeds remaining load is masked in CVRP. Dropping the last condition permits partial deliveries and revisits. Decoding ends after all demand is served, with routes returning to the depot. Beam search retains probable partial sequences and selects the complete beam member with the shortest tour; beam width is not a local-improvement budget. [Main Section 4, pp. 6-7; Supplement C.2, p. 4](https://proceedings.neurips.cc/paper_files/paper/2018/file/9fb4651c05b2ed70fba5afe0b039a550-Paper.pdf#page=6).

**Train the policy.** REINFORCE maximizes negative tour length using the actor score gradient multiplied by the observed return minus the critic's instance-value estimate. The critic minimizes squared return error. Adam uses learning rate `1e-4`, batch size 128, gradient clipping at norm 2, decoder dropout 0.1 and Xavier initialization. Entropy regularization was tried and excluded after no observed improvement. Supplement C.1 reports about 13.5 hours for 20 epochs of VRP20 on a K80 GPU. [Supplement C.1 and D, pp. 4, 9-10](https://proceedings.neurips.cc/paper_files/paper/2018/file/9fb4651c05b2ed70fba5afe0b039a550-Supplemental.zip).

**Separate the stochastic experiment.** Customers arrive by a rate-one Poisson process, with uniform unit-square locations and integer demands 1-9. Depot is fixed at `(0.5,0.5)`, speed is 0.1, customers abandon after five time units, and the horizon is 100. Available-location inputs include the current vehicle location, and customer time in system is an added dynamic feature. A3C uses event-driven decisions, one-step advantages, demand served per elapsed time as reward and RMSProp at `1e-5`. This policy is retrained; it is not the CVRP checkpoint merely receiving new inputs. [Supplement C.6 and D, pp. 7-10](https://proceedings.neurips.cc/paper_files/paper/2018/file/9fb4651c05b2ed70fba5afe0b039a550-Supplemental.zip).

## Experiments

**Protocol.** CVRP tests contain 1,000 instances per size. Customers and depot are uniform on the unit square; demands are uniform integers 1-9. Customer counts 10/20/50/100 use capacities 20/30/40/50. Exact mixed-integer references are obtained for 10 and 20 customers; larger instances are compared using mean objective and pairwise winning rate. Baselines are Clarke-Wright, Sweep and randomized variants, and the paper's configured OR-Tools. OR-Tools uses coordinate scaling by `10^4` and ten vehicles. This is a historical implementation comparison, not a statement about current OR-Tools configurations.

| Setting | Greedy length | Beam width 10 length | OR-Tools length | Beam-10 mean time |
| --- | ---: | ---: | ---: | ---: |
| CVRP10 | 4.84 | 4.68 | 4.67 | 0.072 s |
| CVRP20 | 6.59 | 6.40 | 6.43 | 0.162 s |
| CVRP50 | 11.39 | 11.15 | 11.31 | 0.232 s |
| CVRP100 | 17.23 | 16.96 | 17.16 | 0.445 s |

[Supplement Table 2, p. 6](https://proceedings.neurips.cc/paper_files/paper/2018/file/9fb4651c05b2ed70fba5afe0b039a550-Supplemental.zip). Times are **mean per-instance sequential inference seconds**, measured on a single-core Intel 2.6 GHz CPU, rather than the total test-set times used by several later papers. OR-Tools is C++ and the other implementations are Python, so this is not a language-matched timing study. The main paper separately describes batching 1,000 VRP10 instances on K80 in about one second, versus roughly 50 seconds one by one; that is a different hardware/batching setting.

Beam-10 wins against OR-Tools on 60.2% of CVRP50 and 62.2% of CVRP100 instances. It does not dominate every size: OR-Tools has the better CVRP10 mean. Exact small-size mean reference lengths are 4.55 and 6.10. Split-delivery beam-10 gives 16.86 on 100 customers, but this solves a relaxed problem. Negative gaps against the non-split optimum are not violations of optimality and do not establish an advantage over an optimal split-delivery solver.

**Transfer and auxiliary tests.** A VRP100 policy is evaluated at sizes 90-110. Larger changes degrade quality: VRP50 policies tested on VRP100-Cap50 produce lengths 18.00/17.80, worse than OR-Tools. Supplement A compares TSP greedy construction after 20 epochs on one million training instances per size; at TSP100, this method gives 8.44, its reimplementation of Pointer-RL 8.45 and Concorde 7.77. The reported benefit is mainly removing recurrent-encoder cost, not matching exact quality. The stochastic experiment reports 112.21 demand served and 28.8% satisfied on 100 instances versus simple random, largest-demand and max-reachable baselines. These are reported table statistics; more sophisticated stochastic baselines remain future work.

## Limitations

### Reported by the Authors

- Distribution and substantial size/capacity shifts degrade performance.
- Hard constraints may require a difficult problem-specific masking design.
- Illustrated routes can cross themselves and remain suboptimal.
- Active search is slower and worse than beam decoding in the reported VRP10 experiment; it is excluded from the main comparisons.
- Multi-depot, collaborative multi-vehicle routing and other optimization families are proposed extensions, not completed benchmark demonstrations.

### Curator Notes

- The method remains specialist and constructive. Parameter updates in the separate training stages are not incumbent local-search moves.
- The stochastic study changes objective, features and training; split delivery changes the feasible set. Their results require those qualifications.
- Large-size optimum gaps are unavailable, the classical baselines are limited, and historical runtime comparisons mix implementations and batching choices.
- The supplement's claim that large training sets remove seed effects is an empirical assertion, not a general reproducibility guarantee. No experiments were rerun for this review.

## Reproducibility

- **Publication:** [NeurIPS 2018 article record](https://proceedings.neurips.cc/paper/2018/hash/9fb4651c05b2ed70fba5afe0b039a550-Abstract.html). The venue record/arXiv order Snyder before Takáč; the publisher PDF title block prints them in the reverse order. Metadata follows the bibliographic record and preserves this discrepancy here.
- **Dates:** [arXiv history](https://arxiv.org/abs/1802.04240) supports first submission on 12 February 2018. Only publication year is asserted; the previous generic conference-notification date was removed.
- **Sources read:** All 11 publisher-paper pages and all ten scientific supplement pages, extracted from the publisher-linked ZIP member `vrp_neurips_2018_supplementary.pdf` (printed pages 12-21). The ZIP contains that single PDF. Key attention equations, Figure 2, winning-rate panels, the result table and A3C algorithm were inspected visually.
- **Official code:** [OptMLGroup/VRP-RL](https://github.com/OptMLGroup/VRP-RL), TensorFlow implementation. The README documents training, batch versus single inference and an explicit saved-model directory; absent `model_dir`, inference uses a random model. A downloadable pretrained checkpoint is not identified in the inspected README. Source availability is not an execution check.
- **Audit trail:** [Reading coverage, claim locators and explicit citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/rl-vrp.json).
