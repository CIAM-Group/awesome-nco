---
id: learning-to-solve-np-complete-problems-a-graph-neural-network-for-decision-tsp
short_title: Learning to Solve NP-Complete Problems
title: 'Learning to Solve NP-Complete Problems: A Graph Neural Network for Decision TSP'
authors:
- Marcelo Prates
- Pedro H. C. Avelar
- Henrique Lemos
- Luis C. Lamb
- Moshe Y. Vardi
year: 2019
date: '2018-09-08'
publication:
  date: '2019-07-17'
  source_url: https://api.crossref.org/works/10.1609/aaai.v33i01.33014731
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/4399
institutions:
- Institute of Informatics, Federal University of Rio Grande do Sul
- Department of Computer Science, Rice University
scope: study
paper_type: analysis
problem_families:
- Routing
problems:
- Decision Traveling Salesman Problem
- TSP Optimal-Cost Estimation
summary: An edge–vertex message-passing GNN learns decision-TSP supervision and estimates cost through repeated
  probability queries. Experiments analyze size and distribution transfer; the method does not produce a tested
  feasible tour or certificate.
arxiv_url: https://arxiv.org/abs/1809.02721
inclusion: reference
inclusion_reason: Evaluated output is decision probability or estimated optimal cost; feasible-tour extraction is
  explicitly future work.
code_url: https://github.com/machine-reasoning-ufrgs/TSP-GNN
figure:
  path: paper-assets/learning-to-solve-np-complete-problems-a-graph-neural-network-for-decision-tsp/framework.png
  alt: Decision-GNN pseudocode exchanges edge–vertex messages, averages edge votes and outputs a probability.
  caption: 'Original Algorithm 1: message passing and decision probability, without tour decoding.'
  source_url: https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=2
---

# Learning to Solve NP-Complete Problems: A Graph Neural Network for Decision TSP

> **TL;DR:** A GNN predicts whether a graph admits a tour below a supplied cost. Repeated queries estimate optimal cost. This is **analysis/reference**: feasible-tour extraction remains future work in the formal conclusion and author slide 42.

## Motivation

Decision TSP asks whether a Hamiltonian route below a target cost exists. The authors explore relational reasoning with a single Boolean label, building on [NeuroSAT](../generalist/neurosat.md), explicitly cited as the 2018 arXiv manuscript 1802.03685. A predicted positive is neither a route witness nor a correctness certificate. [Introduction.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=1)

## Contributions

- A bipartite edge–vertex GNN incorporates numeric edge weights and a target route cost.
- Paired targets just below and above an optimum provide opposite Boolean labels for the same graph.
- Acceptance curves motivate binary search for a scalar cost estimate.
- Experiments analyze graph size, threshold deviation, metric-distribution transfer and nine TSPLIB instances. [Overview.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=2)

## Methodology

Vertices start from one shared learned vector; an MLP embeds each edge's weight and target cost. Incidence-matrix aggregation exchanges messages between edges and vertices. Layer-normalized LSTM updates repeat for 32 steps with 64-dimensional embeddings. A voting MLP maps final edge states to logits; their mean passes through a sigmoid. Adam minimizes binary cross entropy.

Concorde supplies exact C* to generate a NO instance at 0.98 C* and a YES instance at 1.02 C*. Single-bit output supervision therefore still requires exact optimization during data generation. Edge weights are normalized into [0,1], and target cost is divided by the number of vertices. [Algorithm 1 and training.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=2)

The initial network loses positive confidence for extremely large targets. Before binary search, the paper retrains for one additional epoch with deviations −2%, +2%, +100%, +200% and +1000%. Algorithm 2 brackets cost using sums of the n lightest/heaviest edges, queries a probability threshold near 0.5 and uses relative interval tolerance 0.01. Every query runs the 32-step GNN again. This estimates cost without decoding a route or guaranteeing monotonic probabilities. [Algorithm 2.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=4)

Formal page 7 leaves route extraction as future work; author slide 42 says attempted clustering was unsuccessful. The evaluated output is decision probability or estimated cost, so the entry is a study rather than a constructive tour solver. Cross-size and cross-distribution tests remain one native decision task.

## Experiments

### Data and budget

Complete Euclidean graphs have 20–40 uniformly sampled points in a square of side sqrt(2)/2. The paper reports 2^20 base graphs, 2^21 decision instances and 2,000 epochs. Test accuracy is about 80% on 2,048 unseen decision instances at ±2%; the approximately 85% training curve has a different denominator.

Batch descriptions differ: page 3 specifies 1,024 base graphs per epoch, Figure 1 specifies 128 batches of 16 decision instances, but page 6 says 16 instance pairs per batch. Author slide 30 explicitly states 2 × 8 = 16 instances. The release defaults to eight base graphs doubled by the loader, agreeing with the first descriptions rather than the 16-pair wording. Its default dataset size is 2^15 and epoch count 10,000, so default commands do not reproduce the complete printed configuration. Hardware and wall time are not reported. [Setup.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=3)

### Accuracy and transfer

Table 1 reports 66%, 80%, 98% and 100% accuracy at 1%, 2%, 5% and 10% target deviation on 1,024 graphs of training-range size. The conclusion instead says 96% at 5%; this note retains the tabulated result and discloses that inconsistency. At ±2%, accuracy falls toward chance around 75 vertices; ±10% remains an easier decision problem and exceeds 95% through the plotted sizes up to 80.

Random metric graphs yield 57%, 64%, 82% and 96% at those deviations. Nonmetric random weights yield 50% throughout. Binary search on 1,024 training-range graphs reports mean absolute relative cost error 1.5%, requiring a mean 8.9 GNN queries. These are empirical means, not worst-case approximation bounds. [Tables 1–2.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=5)

### Baseline interpretation

Nearest Neighbor and simulated annealing construct feasible tours, with average excess cost 20.2% and 6.7% on the described synthetic set. Figure 6 compares their ability to witness a tour below a target with the GNN's true-positive rate. Learned positives can be false positives, whereas the heuristic positives have route witnesses; higher TPR does not establish better feasible-tour quality at matched certification or budget.

On nine TSPLIB instances, GNN cost deviations range from −27.20% to +6.37%, mostly below optimum. The paper counts six with smaller absolute cost error than simulated annealing. These estimated costs and SA's actual tour costs have different feasibility meanings: a negative deviation does not beat a true optimum with a valid tour. [Figure 6 and Table 3.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf#page=6)

## Limitations

No evaluated route decoder, exact decision procedure or correctness certificate is provided. Phase-transition and positive-by-default interpretations are observations or conjectures. Tight-target size generalization deteriorates sharply, and nonmetric transfer remains at chance. Exact-label generation, extra retraining, repeated queries and inconsistent batch descriptions qualify performance claims.

## Reproducibility

The official repository was inventoried at commit `020437574e246b62060a2ab082cc95177e2ca49a`: 22 tracked paths include TensorFlow source, graph generation, testing and four experiment scripts. The full README and relevant model, training, loader and binary-search code were inspected. `model.py` clarifies that 8/16/32 are hidden edge-initialization widths followed by a 64-dimensional output. The binary-search script defaults to a fixed checkpoint and CPU execution. No benchmark was rerun.

The repository PDF is a 46-slide author presentation dated November 14, 2018, not a 46-page paper. All slides were read. The formal eight-page paper and references, repository inventory and empty releases page were checked; no additional necessary scientific appendix is pointed to. Primary arXiv history dates v1 to September 8, 2018; this review reads the formal PDF. Publisher-deposited online publication is July 17, 2019, rather than the CDN filename date. The first three authors have equal-contribution markers; no corresponding-author marker is given. Original Algorithm 1 was cropped from formal page 2 (coordinates 319,260–563,553 at 4×), and the public crop and key original tables/formulas were visually inspected.

[Formal paper.](https://cdn.aaai.org/ojs/4399/4399-13-7438-1-10-20190706.pdf) [Official code.](https://github.com/machine-reasoning-ufrgs/TSP-GNN)
