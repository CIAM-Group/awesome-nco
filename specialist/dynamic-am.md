---
id: dynamic-am
short_title: AM-D
title: A Deep Reinforcement Learning Algorithm Using Dynamic Attention Model for Vehicle Routing Problems
authors:
- Bo Peng
- Jiahai Wang
- Zizhen Zhang
year: 2020
date: 2020-02-09
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
summary: A task-specific CVRP policy re-encodes unserved customers at depot returns and uses a current-policy greedy
  baseline; optional 2-opt adds a separate improvement stage.
figure:
  path: paper-assets/dynamic-am/framework.png
  alt: Static encoder-decoder computation compared with repeated dynamic encoding during decoding.
  caption: 'Figure 6: Comparison between static and dynamic attention-model computation.'
  source_url: https://arxiv.org/pdf/2002.03282v1
inclusion: reference
inclusion_reason: ISICA is outside the approved main-conference and journal inclusion list.
publication:
  date: '2020-05-26'
  source_url: https://link.springer.com/chapter/10.1007/978-981-15-5577-0_51
---

# A Deep Reinforcement Learning Algorithm Using Dynamic Attention Model for Vehicle Routing Problems

> **TL;DR:** AM-D refreshes the attention encoder when the vehicle returns to the depot, masking served customers. A current-policy greedy rollout supplies the training baseline; the evaluated greedy constructor and optional 2-opt extension have distinct costs.

## Motivation

A fixed encoding of all customers may become less informative as deliveries are completed. AM-D treats the remaining customers as a changing residual instance and recomputes representations at route boundaries. It learns a distribution-specific heuristic from generated CVRP instances, with task-specific demand/capacity masks. [Sections 1-2, PDF pp. 1-3](https://arxiv.org/pdf/2002.03282v1#page=2).

## Contributions

- Re-encode the residual instance after depot visits instead of computing node embeddings only once.
- Exclude already served customers from encoder attention while retaining the depot.
- Train route construction by REINFORCE using sampled and greedy solutions from the current policy.
- Evaluate greedy construction, a separate 2-opt postprocessing configuration and transfer among sizes 20/50/100.

## Methodology

**Attention architecture.** Depot and customers have separate input projections from coordinates/demand. Three encoder layers use 128-dimensional embeddings, eight 16-dimensional heads and a 512-hidden-unit feed-forward network. The reviewed equations apply `tanh` after residual additions; they do not specify the original AM's batch-normalization blocks. Decoder context contains the mean embedding of still-unvisited nodes including the depot, the last node (depot initially) and remaining capacity. A multi-head glimpse and a final single-head clipped-attention softmax select the next node. Previously visited customers and demands exceeding capacity are masked; consecutive depot choices are forbidden. Returning to the depot resets capacity. [Section 3, Equations 2-21, pp. 5-8](https://arxiv.org/pdf/2002.03282v1#page=6).

**Dynamic encoding.** Equation 22 recomputes all layers from the original input embeddings when the previous selection was the depot. Equation 23 masks attention keys corresponding to served customers in every encoder layer, with an exception retaining node zero. Between returns, cached node representations are reused, and decoding uses the latest embeddings. Thus the update is neither every customer decision nor merely a decoder-context refresh. [Section 4, Equations 22-23 and Figure 6, pp. 8-10](https://arxiv.org/pdf/2002.03282v1#page=9).

**Training baseline.** Algorithm 1 generates both a sample rollout and greedy rollout from the **same current parameters** `theta`, then estimates the gradient with `(L_sample - L_greedy) * grad(log p_theta(sample))`. Although the text cites AM's rollout-baseline approach, this algorithm does not contain a separately frozen best-policy baseline, significance test or epoch-based baseline replacement. Adam minimizes the length objective. This distinction matters when reproducing the result. [Section 5, Equations 24-25 and Algorithm 1, p. 10](https://arxiv.org/pdf/2002.03282v1#page=10).

The main method is specialist constructive. Appending 2-opt creates an additional heuristic-improvement stage; learning policy parameters offline is not itself incumbent local search.

## Experiments

**Data and training.** Coordinates are uniform on the unit square and customer demands are uniform integers 1-9. Sizes 20/50/100 use capacities 30/40/50. Each separately trained model receives 30 epochs of 10,000 batches. For sizes 20/50, batch size is 128 and learning rate `1e-4`, with one GTX 1080 Ti; size 100 uses batch 108 and `5e-5`, with three GTX 1080 Ti GPUs. Reported training times are 14/58/250 hours. Test sets contain 10,000 instances per setting. [Section 6, pp. 11-13](https://arxiv.org/pdf/2002.03282v1#page=11).

| Setting | AM greedy length / gap | AM-D greedy length / gap | AM-D with 2-opt length / gap |
| --- | --- | --- | --- |
| CVRP20 | 6.40 / 4.97% | 6.28 / 2.95% | 6.25 / 2.46% |
| CVRP50 | 10.98 / 5.86% | 10.78 / 3.85% | 10.73 / 3.37% |
| CVRP100 | 16.80 / 7.34% | 16.40 / 4.79% | 16.27 / 3.96% |

[Table 1, p. 11](https://arxiv.org/pdf/2002.03282v1#page=11). The reference is exact Gurobi at 20 customers and LKH3 at 50/100, so the larger-size gaps are heuristic-reference gaps. The reported 2.02/2.01/2.55 improvements over AM are **percentage-point gap differences**, not relative percentage reductions. AM-D improves the learned greedy baselines shown, but LKH3 remains better in objective at all three sizes; the paper does not establish superiority over classical routing solvers generally.

**Timing.** Table 2 gives average per-test-instance time: greedy inference takes 0.29/2.51/15.92 milliseconds for 20/50/100 customers, while the 2-opt configurations take 0.05/0.34/2.21 seconds. These are reported GPU-setting averages; evaluation batch size and timing inclusion details for CPU postprocessing are not sufficiently specified to treat them as isolated-request or hardware-matched latencies. The paper supplies no comparable same-device baseline runtimes in Table 1. [Table 2 and discussion, pp. 12-13](https://arxiv.org/pdf/2002.03282v1#page=12).

**Size transfer.** Transfer is uneven. The 20-customer model reaches length 17.37 and 10.99% reference gap at 100 customers, worse than the 17.23 RL-greedy baseline and the 16.40 size-matched AM-D model. The 50-customer model reaches 16.55 at 100 customers; the 100-customer model reaches 6.65 at 20 customers, compared with 6.28 for the size-matched model. These experiments demonstrate executable cross-size transfer with quality loss, rather than uniformly strong or unrestricted generalization. They do not isolate a common checkpoint across optimization families.

## Limitations

### Reported by the Authors

- Training is expensive and limited to small/medium instance sizes by computing resources.
- 2-opt improves solution quality while adding substantial computation.
- More complex routing constraints and hybrid OR integration are future extensions.

### Curator Notes

- The experiment is synthetic CVRP only; depot/capacity feasibility rules remain necessary.
- Dynamic re-encoding, architecture differences, training baseline and training budget differ from original AM, so the comparison is not a completely isolated one-variable ablation.
- Cross-size objective gaps can worsen substantially; reported improvement claims apply to the shown comparison settings.
- Runtime averages require the batching and hardware qualifications above, and the result remains heuristic without an optimality guarantee.

## Reproducibility

- **Formal record:** [Springer ISICA 2019 chapter](https://link.springer.com/chapter/10.1007/978-981-15-5577-0_51), CCIS 1205, pp. 636-650, first online **26 May 2020**. The conference took place in 2019; publication year is 2020. The prior acceptance-year field was not supported as a paper-specific acceptance date and has been removed.
- **Eligibility:** ISICA is outside the approved main-conference/journal scope, so this entry remains reference-only despite having a formal proceedings chapter.
- **Reading source:** [arXiv:2002.03282v1](https://arxiv.org/pdf/2002.03282v1), submitted 9 February 2020, all 15 pages including all 30 references. The formal chapter is access restricted; the user-authorized arXiv version supplies the scientific reading source. No separate scientific supplement is referenced in the full text or linked on the inspected publisher page.
- **Implementation provenance:** The linked [Roberto09 PyTorch repository](https://github.com/Roberto09/Dynamic-Attention-Model-for-VRP---Pytorch) is a **community implementation**, not an official author release identified by this paper. Its README says it derives from a separate TensorFlow implementation and uses different experimental settings. The reviewed paper does not identify an author-maintained code repository. The code link is retained as an implementation resource with this qualification, not proof of numerical reproduction.
- **Visual checks:** Encoder equations, dynamic update equations, Algorithm 1, comparison tables and the full Figure 6 were inspected. The clipped figure asset has been replaced by a complete original crop including both static/dynamic panels and all partial-solution boxes.
- **Audit trail:** [Reading coverage, claim evidence and explicit citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/dynamic-am.json). Training and inference were not rerun.
