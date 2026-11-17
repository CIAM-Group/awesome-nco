---
id: hopfield-multistage-routing
short_title: Hopfield Multistage Routing
title: Neural Network Routing for Random Multistage Interconnection Networks
authors:
- Mark W. Goudreau
- C. Lee Giles
year: 1991
date: '1991'
publication:
  date: '1991'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1991/hash/f3f27a324736617f20abbf2ffd806f6d-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1991/hash/f3f27a324736617f20abbf2ffd806f6d-Abstract.html
institutions:
- Princeton University
- NEC Research Institute
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Routing
problems:
- Interconnection-Network Routing
summary: Fixed-weight Hopfield relaxation seeks simultaneous nonconflicting RMIN routes; small-network simulation
  shows mixed quality, and analog speed advantages remain unmeasured.
---

# Neural Network Routing for Random Multistage Interconnection Networks

> **TL;DR:** A fixed-weight Hopfield network searches for simultaneous nonconflicting communication routes in small random multistage interconnection networks. Simulation shows mixed routing quality; the proposed speed advantage of an analog parallel implementation is not measured.

## Motivation

In a synchronous shared-memory system, processors request connections to memory modules through a random multistage interconnection network (RMIN). A router should establish as many requested connections as possible within each message cycle; unsuccessful processors can retry later. Exhaustive route search is costly, while irrevocable greedy choices can block other messages. This is communication-network routing, rather than vehicle routing (PDF pp. 1-4).

## Contributions

- Encodes simultaneous routes as a three-dimensional constraint-satisfaction array.
- Constructs symmetric Hopfield weights and message-dependent bias currents from connectivity and conflict penalties.
- Compares routing quality with exhaustive and greedy search on three illustrated small RMINs.

## Methodology

An array element indicates whether message m uses a particular output port at an intermediate stage. Legal arrays require one port per message/stage, connectivity between consecutive stages including source/destination compatibility, and at most one message per stage/port resource. A continuous sigmoid neuron represents each element. Four energy terms penalize multiple selections, contention, missing selections and incompatible consecutive ports; equations 11-12 give the derived weights and bias currents (PDF pp. 4-6).

The physical RMIN determines the neural structure. Only selected biases change for a new message request; weights are constructed rather than trained from examples. The continuous-time network is digitally simulated from random outputs. Reported parameters are `tau=1`, `A=C=D=3`, `B=6`, chosen empirically. An upper bound for an m-input, m-ports-per-stage system is `m^2*S` neurons. A local minimum need not route all messages legally; the intended benefit is that even partial route assignments can serve some requests (PDF pp. 5-7).

## Experiments

Table 1 considers the three RMINs in Figure 2 and message-set sizes 1-8, excluding obvious conflicts such as two processors requesting the same memory module. Exhaustive search and greedy values average over every admissible request set; neural values use 1,000 randomly generated sets per size. Therefore these columns are not paired evaluations on the same sampled instances. The authors explicitly explain that apparent neural superiority over the optimal exhaustive router is sampling variation, not an improvement over the optimum (PDF p. 7).

Results are mixed. For RMIN1 at size 8, the expected numbers routed are 4.33 exhaustive, 4.10 greedy and 3.78 neural. For RMIN3 at size 6, neural routes 5.23 versus greedy's 4.90; at size 8 it routes 6.06 versus 6.10. Exhaustive results for RMIN3 sizes 5-8 are omitted because of computational complexity. These are average numbers of successful messages, not shortest-path costs or optimality gaps (PDF p. 7).

There is no timing or hardware implementation comparison. Statements about essentially constant convergence time refer to other related neural networks, and the conclusion proposes building implementations to compare speeds. An analog parallel router's speed advantage remains a hypothesis in this paper (PDF pp. 7-8).

## Limitations

The authors acknowledge worsening performance with increasing RMIN size and do not expect the present router to scale well to large networks. Local minima, empirical penalty selection and unreported integration details limit reproducibility. The three examples and unmatched averaging protocols do not establish a general quality ranking. The result is a specialist neurodynamic routing method, without a learned shared model or a certified maximum-throughput guarantee.

## Reproducibility

- **Read source:** all eight official scanned pages, printed pages 722-729, including all ten references. Equations 1-12 and Table 1 were visually checked where OCR was incomplete.
- **Publication:** NIPS 1991 volume 4; author names corrected to Mark W. Goudreau and C. Lee Giles. The title page lists Princeton University and NEC Research Institute.
- **Supplements:** the official entry provides bibliography, metadata and the article. No appendix or separate scientific attachment is identified in the full article or landing page.
- **Implementation:** no source release, circuit implementation or complete simulation configuration is linked. No experiments were rerun.
- **Relations:** no reference identifies another frozen collection entry, so no outgoing internal citation edge is added.
