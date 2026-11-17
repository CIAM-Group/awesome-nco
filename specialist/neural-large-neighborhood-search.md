---
id: neural-large-neighborhood-search
short_title: NLNS
title: Neural Large Neighborhood Search for the Capacitated Vehicle Routing Problem
authors:
- André Hottung
- Kevin Tierney
year: 2020
date: 2019-11-21
venue: ECAI
paper_url: https://doi.org/10.3233/FAIA200124
arxiv_url: https://arxiv.org/abs/1911.09539
code_url: https://github.com/ahottung/NLNS
institutions:
- Bielefeld University
figure:
  path: paper-assets/neural-large-neighborhood-search/framework.png
  alt: NLNS repair network attending over incomplete routes and feasibility features.
  caption: 'Figure 2: Neural repair network used inside large-neighborhood search.'
  source_url: https://arxiv.org/pdf/1911.09539v2#page=5
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Split Delivery Vehicle Routing Problem
summary: NLNS learns fragment-connection repair operators for CVRP and SDVRP and combines
  them with batch or annealed single-instance large-neighborhood search.
inclusion: reference
inclusion_reason: ECAI is outside the approved main-conference and journal inclusion
  list.
publication:
  date: '2020'
  source_url: https://doi.org/10.3233/FAIA200124
---

# Neural Large Neighborhood Search for the Capacitated Vehicle Routing Problem

> **TL;DR:** NLNS learns how to reconnect route fragments after destruction, then uses fixed trained repair operators inside large-neighborhood search. It supports CVRP and split deliveries, with distinct batch and single-instance search strategies.

## Motivation

Constructive neural routing methods largely relied on sampling or beam search, while traditional large-neighborhood search benefited from a stronger search framework but required sophisticated repair heuristics. NLNS learns the difficult repair component and retains simple destruction, feasibility checks, and search guidance. Fragment-level input is intended to limit the neural repair problem to the destroyed part of a solution.

## Contributions

- Introduces an attention-based, nonrecurrent repair policy that connects incomplete tours through their exposed endpoints.
- Integrates multiple separately trained destroy-repair pairs into GPU-oriented batch search and single-instance parallel search.
- Evaluates both CVRP and SDVRP, including generated CVRP groups with 100-297 customers and classical split-delivery instances. This ECAI paper remains a reference entry under this repository's approved-venue policy.

## Methodology

A nearest-customer heuristic supplies the initial feasible routes. Point-based destruction removes customers near a random point; tour-based destruction breaks nearby complete tours into single-customer pieces. Removing an interior customer splits a route into the preceding fragment, that customer, and the following fragment. Destruction therefore produces incomplete tours that must be reconnected. [Sections 3-3.1, pp. 2-3.]

Each free endpoint is represented by coordinates, its fragment's demand, and a status indicating a singleton, a multi-customer fragment, or a fragment connected to the depot. The depot has its own input. A reference endpoint is connected to another endpoint or the depot; capacity and self-connection masks restrict legal actions. After a merge, the policy continues from the new open end, or chooses another unfinished fragment. The representation depends on the remaining fragments, rather than encoding the entire original instance at every step. Its size still grows with the amount destroyed. [Section 3.2, pp. 3-4.]

Shared position-wise feed-forward layers embed candidate endpoints; separate parameters embed the reference endpoint. Additive attention produces a context vector, a two-layer feed-forward module combines context and reference, and a pointer-like softmax selects a connection. The hidden dimension is 128. There is no recurrent decoder or separate whole-instance graph encoder. REINFORCE trains repair cost with a learned critic baseline; the critic sums position-wise cost estimates. Each repair model is trained for a specific destruction procedure, destruction rate, and instance distribution. [Sections 3.2.1-3.2.2, Equations 1-8.]

**Single-instance search** maintains a batch of alternative solutions, uses simulated-annealing acceptance and reheating, and selects destroy-repair pairs uniformly. The best solution is retained separately. The first 80% of the batch is synchronized to the accepted current solution, while the remaining alternatives evolve independently. The reported batch size is 300. **Batch search** processes different instances together, accepts only improving repairs, and selects the operator pair with the strongest exponentially smoothed recent average improvement. This adaptive operator selection does not update neural weights. The paper does not propose test-time active-search fine-tuning. [Section 3.3, Algorithm 1.]

## Experiments

**Training and hardware.** Each repair operator receives 250,000 training batches of 256 instances, using Adam with a fixed learning rate of `1e-4`. Training takes several hours for small instances and up to four days near 300 customers. NLNS uses one Tesla V100 and all 10 cores of an Intel Xeon Silver 4114 at 2.2 GHz. Four repair operators are trained per relevant problem class or instance group. These training and hardware costs accompany the reported search quality. [Section 4, p. 6.]

**Batch search.** Table 1 evaluates 10,000 instances per task-size combination. CVRP mean lengths for 20/50/100 customers are 6.19/10.54/15.99 for NLNS and 6.25/10.62/16.20 for AM sampling 1,280 solutions. Total dataset wall times are 431/1,453/3,737 s and 451/1,471/3,750 s, respectively. SDVRP lengths are 6.15/10.50/16.00 for NLNS and 6.25/10.59/16.27 for AM, again at similar total times. These are times for all 10,000 instances, not individual latency. Nazari's beam-search results were imported from its paper and its 1,000-instance times multiplied by 10; their starred times are not measurements on the same host. That baseline is faster but has worse average cost. [Section 4.1, Table 1.]

**Single-instance CVRP.** The XE dataset has 17 groups of 20 instances with matched characteristics, not one universal model evaluated unchanged on unrelated benchmarks. Four repair models are trained separately for every group on separate training instances. Integer-rounded distances are used, with three runs per instance. Table 2 reports roughly 190-191 s for groups below 200 customers and 612-615 s for larger groups. NLNS beats the handcrafted-repair LNS in every group and beats LKH3's mean cost in 11 of 17 groups, but UHGS has lower mean cost in every group. NLNS gaps to UHGS range from 0.04% to 3.10%; these are heuristic-reference gaps, not certified optimality gaps. LKH3 runs on a different CPU and one core, limiting direct speed comparisons. [Section 4.2.1, Table 2.]

**Single-instance SDVRP.** Eight classical instances contain 75 or 100 customers with capacity 160. Two sets of four repair operators are trained on 100-customer distributions and reused across those instances. Table 3 averages 20 runs. SplitILS has lower cost on all four 75-customer cases; NLNS has lower cost on all four 100-customer cases. Runtime is not uniformly favorable: for S101D1, NLNS obtains 718.30 in 311 s versus SplitILS's 718.40 in 14 s. The results demonstrate conditional quality gains, rather than dominance over SplitILS in every setting. [Section 4.2.2, Table 3.]

## Limitations

Instance-distribution and destruction-specific training is central to the evaluation, with multiple repair models per group. The compact fragment representation does not imply constant-size input under arbitrary destruction rates. Search still needs manually chosen destruction procedures, capacity rules, acceptance schedules, and runtime budgets. Better quality comes with repeated repairs and, in the single-instance experiments, minutes of search. UHGS remains stronger on the CVRP comparison, optimality is not certified, and comparisons across different hardware or imported baseline results require care. The authors propose joint destroy/repair learning as future work.

## Reproducibility

- **Official implementation:** [ahottung/NLNS](https://github.com/ahottung/NLNS), linked on paper page 6. Its README provides pretrained models, XE instances and generation, training, batch search, single-instance search, rounding, and split-delivery commands. These instructions were inspected without rerunning experiments.
- **Reading source:** All eight pages of arXiv v2 (30 November 2020), including all 32 references, were freshly read and key figures, formulas, algorithms, and tables visually checked. [Audit record](../data/reviews/papers/neural-large-neighborhood-search.json).
- **Publication identity:** The correct ECAI 2020 DOI is `10.3233/FAIA200124` (pp. 443-450), confirmed by the manuscript, arXiv, and Crossref. The previous note pointed to a different DOI. First arXiv submission: 21 November 2019. No paper-specific acceptance date is established.
- **Supplement check:** The IOS publisher landing is access-blocked. The complete author manuscript and official repository were inspected; neither points to a separate scientific supplement, and the eight-page manuscript has no omitted appendix reference. This records the accessible-source check without claiming to have inspected blocked publisher attachments.
