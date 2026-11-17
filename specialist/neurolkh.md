---
id: neurolkh
short_title: NeuroLKH
title: 'NeuroLKH: Combining Deep Learning Model with Lin-Kernighan-Helsgaun Heuristic for Solving the Traveling
  Salesman Problem'
authors:
- Liang Xin
- Wen Song
- Zhiguang Cao
- Jie Zhang
year: 2021
date: '2021-10-15'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/3d863b367aa379f71c7afc0c9cdca41d-Abstract.html
arxiv_url: https://arxiv.org/abs/2110.07983
code_url: https://github.com/liangxinedu/NeuroLKH
institutions:
- Nanyang Technological University
- Shandong University
- Singapore Institute of Manufacturing Technology
figure:
  path: paper-assets/neurolkh/framework.png
  alt: NeuroLKH pipeline predicting candidate edges and node penalties for the LKH heuristic.
  caption: 'Figure 1: NeuroLKH and original LKH pipelines, highlighting learned candidate and penalty guidance.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/file/3d863b367aa379f71c7afc0c9cdca41d-Paper.pdf
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Pickup and Delivery Problem
- Capacitated Vehicle Routing Problem with Time Windows
summary: NeuroLKH predicts candidate edges and node penalties with a sparse graph network, then delegates the combinatorial
  search to LKH.
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper/2021/hash/3d863b367aa379f71c7afc0c9cdca41d-Abstract.html
---

# NeuroLKH: Combining Deep Learning Model with Lin-Kernighan-Helsgaun Heuristic for Solving the Traveling Salesman Problem

> **TL;DR:** A sparse graph network predicts LKH candidate-edge priorities and TSP node penalties. The network guides a conventional local-search engine; it does not directly decode a complete route. Large-size TSP transfer, TSPLIB transfer and constrained-routing extensions use different settings.

## Motivation

LKH restricts and orders its variable-opt search using small candidate sets. Computing these sets and optimizing node penalties independently for every instance can be expensive, while hand-designed scores may overlook useful patterns in a repeated instance distribution. NeuroLKH learns these preprocessing decisions across instances and spends the saved time on additional LKH search.

## Contributions

- A Sparse Graph Network (SGN) learns edge priorities from reference solutions and TSP node penalties from minimum-1-tree degree feedback.
- These outputs replace LKH's candidate-generation and penalty-optimization procedures while retaining its local-search trials.
- Experiments separate synthetic size transfer, distribution transfer to TSPLIB, and adaptations to CVRP, pickup-and-delivery and capacitated VRP with time windows.

## Methodology

The input is a directed graph containing the 20 nearest outgoing edges per node. A 30-layer SGN updates 128-dimensional node and edge representations using residual connections, batch normalization, elementwise attention and a reverse-edge term. Reverse edges are not necessarily present in this sparse graph; the network explicitly distinguishes their absence.

An edge decoder outputs softmax scores over each node's outgoing neighbors. A supervised binary cross-entropy objective encourages high scores for edges in the reference optimal TSP tour. The top-scoring edges form LKH's candidate set, normally five per node, and their scores determine search order. Neither sparseness nor the candidate set guarantees that every optimal-tour edge is retained.

A second decoder outputs `πᵢ = 10 tanh(·)`. For a minimum 1-tree under transformed costs, the node loss is `−(1/|V|) Σᵢ (dᵢ(π) − 2) πᵢ`, where `dᵢ` is the tree degree. This supplies unsupervised feedback encouraging degree two, rather than requiring target penalties. The total loss adds the edge and node terms with coefficient one. The transformation `cᵢⱼ = sᵢⱼ + πᵢ + πⱼ` preserves the ordering of complete TSP tours: every tour gains the same `2 Σᵢ πᵢ`, which is subtracted when reporting its original length. This invariance does not make the heuristic search exact.

After one SGN forward pass, LKH conducts its usual random-initialization trials and variable-opt exchanges using the learned guidance. This is a specialist **improvement** method: the neural outputs guide incumbent search, rather than serving as a constructive route policy. Training one TSP network across sizes does not make it a joint multi-problem solver.

For CVRP, PDP and CVRPTW, the extensions learn candidate scores only; **TSP node penalties are not used**. Features include demands, capacity or time windows as appropriate. PDP adds pickup–delivery connections, while direction-sensitive tasks learn incoming and outgoing scores. Their reference labels come from LKH with 10,000 trials, not certified optimal routes.

## Experiments

The synthetic TSP training set contains approximately 780,000 uniformly sampled Euclidean instances with 101–500 nodes; Concorde supplies tour-edge labels. Training uses Adam at `1e-4` for 16 epochs, about four days on one RTX 2080 Ti. Search uses an Intel i9-10940X CPU. Tests contain 1,000 instances per size, including TSP100, which is just below the stated training interval.

Time limits are set by the total runtime of LKH with 1, 10, 100 or 1,000 trials. NeuroLKH and VSR-LKH receive that same time allowance, rather than necessarily the same number of trials. NeuroLKH's reported solving time includes GPU inference plus CPU search. Times in Tables 1–3 refer to **all 1,000 test instances**.

| Synthetic TSP setting | Total time | LKH mean length | NeuroLKH mean length | NeuroLKH reported gap |
| --- | ---: | ---: | ---: | ---: |
| TSP100, LKH-one-trial time allowance | 33 s | 7.755071 | 7.753332 | 0.111‱ = 0.00111% |
| TSP500, LKH-one-trial time allowance | 338 s | 16.556733 | 16.543197 | 0.826‱ = 0.00826% |
| TSP500, LKH-1,000-trial time allowance | 7,527 s | 16.542125 | 16.541847 | 0.010‱ = 0.00010% |
| TSP5,000, LKH-one-trial time allowance | 40,048 s | 51.025519 | 50.965382 | 0.484‱ = 0.00484% |

**Tables 1–2 use basis points (‱), not percent.** Small-size gaps are against Concorde optima. For 1,000–5,000 nodes, no Concorde run is used and the reference is the best value obtained by the compared methods. A displayed zero therefore does not certify optimality at these larger sizes.

Large synthetic sizes require a short unsupervised adjustment: only the node-penalty decoder is fine-tuned for 100 iterations per target size, with the rest fixed. This is distribution-level adaptation taking under one minute per size, not zero-shot penalty transfer or per-test-instance active search. Edge-score transfer itself needs no modification.

TSPLIB uses 72 Euclidean instances below 10,000 nodes, ten runs each, with up to one trial per node. Here the method uses **edge scores only**. On 24 instances classified as hard, uniformly trained NeuroLKH finds an optimum 6.13 times out of ten on average, versus LKH's 3.75 and VSR-LKH's 6.42. It also misses optimality on some runs of 11 of the 48 easier instances. A separately trained uniform/clustered mixture model reduces this to five and reaches 6.79 successes on hard instances. Thus transfer is useful but uneven, rather than uniform dominance over all benchmarks.

Constrained-routing tests cover synthetic CVRP up to 1,000 customers and PDP/CVRPTW up to 300. For CVRP1,000 at the shortest reported allowance, NeuroLKH has length 56.6469 versus LKH's 58.1372; the **6.937%** reported gap uses the experiment's best-known reference. At 100-trial allowances, fewer than 1% of the PDP/CVRPTW300 instances initially have infeasible outputs; the authors move infeasible visits to the end to obtain feasible solutions. This repair is part of the reported protocol.

CVRPLIB and Solomon tests use additional benchmark-matched training distributions. They are not direct zero-shot transfers of the synthetic uniform-demand/time-window models. Across 43 CVRPLIB instances, mean quality improves on 38, 38 and 31 at the three budgets. Solomon evaluation is restricted to 11 R2 instances, with improvement in 32 of 33 instance-budget comparisons. Supplement D also specifies its route-count objective and training construction.

## Limitations

### Reported by the Authors

- Direct transfer to new CVRP demand and CVRPTW time-window distributions is difficult without training.
- Uniformly trained guidance performs poorly on some special TSPLIB patterns, including nodes arranged along horizontal lines.
- Candidate sets can omit optimal edges; the final solver remains heuristic.

### Curator Notes

- Strong search machinery, exact TSP training labels, hardware, preprocessing and runtime allowance all contribute to the result. Neural prediction alone is not the evaluated solver.
- The supplement's comparison with other neural methods reuses results from potentially different datasets and assumes linear runtime scaling to 1,000 instances.
- Distribution-matched retraining and penalty-decoder adaptation should be retained when comparing claimed generalization.
- This review verifies the reported evidence and accessible implementation, without rerunning training or reproducing the solver experiments.

## Reproducibility

- **Official implementation:** [liangxinedu/NeuroLKH](https://github.com/liangxinedu/NeuroLKH), linked on publisher page 6. The author repository contains a `pretrained` directory, separate task scripts, and `finetune_node.py`.
- **Integration:** The README describes subprocess/file and SWIG interfaces to LKH 3.0.6. Node-penalty training requires the SWIG interface; a working inference script alone is not the complete training setup.
- **Reviewed sources:** All 12 pages of the NeurIPS 2021 publisher paper and all nine pages of its separate appendix. Visual checks cover the network/loss equations, table units, benchmark tables and Figure 1.
- **Reading map:** Section 3 defines LKH and penalty invariance; Section 4 gives the SGN and losses; Section 5 separates the three transfer settings; Appendix A–D supplies candidate diagnostics and individual benchmark results.

- **Review ledger:** [Page coverage, source locators and explicit outgoing citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/neurolkh.json).
