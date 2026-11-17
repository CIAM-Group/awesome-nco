---
id: efficient-active-search
short_title: EAS
title: Efficient Active Search for Combinatorial Optimization Problems
authors:
- André Hottung
- Yeong-Dae Kwon
- Kevin Tierney
year: 2022
date: 2021-06-09
venue: ICLR
paper_url: https://openreview.net/forum?id=nO5caZwFwYu
arxiv_url: https://arxiv.org/abs/2106.05126
code_url: https://github.com/ahottung/EAS
institutions:
- Bielefeld University
- Samsung SDS
figure:
  path: paper-assets/efficient-active-search/framework.png
  alt: Efficient Active Search variants that adapt instance embeddings or lightweight
    decoder parameters.
  caption: 'Figure 1: Sampling a TSP solution with static instance embeddings; the
    diagram motivates the lightweight EAS updates.'
  source_url: https://arxiv.org/pdf/2106.05126v3#page=4
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Job Shop Scheduling Problem
summary: EAS adapts instance-specific decoder keys, added residual layers, or a gradient-free
  probability table while repeatedly constructing fresh solutions from task-specific
  pretrained policies.
publication:
  date: '2022'
  source_url: https://openreview.net/forum?id=nO5caZwFwYu
---

# Efficient Active Search for Combinatorial Optimization Problems

> **TL;DR:** Retain a pretrained constructive policy and adapt only instance-specific keys, a small added layer, or a lookup table while resampling complete solutions. EAS-Emb and EAS-Lay use gradients; EAS-Tab does not.

## Motivation

Full active search updates an entire neural policy separately for each test instance, making large batches difficult and incurring substantial time and memory costs. Pure sampling keeps its distribution fixed regardless of previously discovered solutions. EAS adapts a much smaller instance-specific component to redirect future samples while sharing most computation across instances.

## Contributions

- Introduces EAS-Emb, EAS-Lay and EAS-Tab as three distinct adaptations of an existing construction method.
- Combines REINFORCE and incumbent imitation for the gradient-based variants; proposes a separate probability-table update without backpropagation.
- Evaluates TSP and CVRP with POMO, and **job-shop scheduling with L2D**. The paper does not evaluate the previous note's orienteering, prize-collecting TSP or flexible flow-shop tasks.

## Methodology

**EAS-Emb** adjusts selected embeddings after encoding while keeping the pretrained network weights fixed. For POMO routing, only the keys of the decoder's final single-head attention are adapted. The loss adds REINFORCE with the POMO baseline to the negative log-likelihood of the best complete solution seen so far, evaluated with teacher forcing. The imitation weight controls how strongly search exploits the incumbent. [Sections 3.1 and 4.1, Equations 1-2.]

**EAS-Lay** inserts a two-linear-layer residual block with a ReLU between them. Initializing its second weight matrix and bias to zero makes the block initially an identity. Only the added block's parameters are trained per instance, using the same RL and imitation objectives. For POMO it acts on the final query before the single-head attention. Its insertion location affects quality and memory use. [Sections 3.2 and 4.1, Equations 3-4.]

**EAS-Tab** modifies constructive action probabilities with an exponent/temperature term and a multiplicative lookup factor, then renormalizes. The table promotes transitions in the incumbent solution; it is updated by an explicit rule, not gradient descent. For routing, entries correspond to directed city-to-city edges, deliberately discarding some state history. This requires a problem-dependent state/action-to-table mapping, so it is not free of domain design. [Section 3.3, Equation 5.]

JSSP uses a different pretrained architecture and adaptations: L2D recomputes operation embeddings after every scheduling decision, so EAS-Emb learns a zero-initialized static offset added to each dynamic embedding. EAS-Lay acts on operation embeddings; EAS-Tab records consecutive operation selections. A shared recipe across these policies does not establish one shared TSP/CVRP/JSSP checkpoint. Adaptations are discarded after the target instance is solved. [Sections 3 and 4.3.]

The solver repeatedly **constructs new solutions**, adapting its proposal distribution between batches. It does not apply learned local incumbent edits, so the repository paradigm remains constructive despite the word 'search'.

## Experiments

**Budgets and hardware.** Experiments use one Tesla V100 and one Xeon 4114 CPU core at 2.2 GHz per experiment. Routing uses the authors' size-100 POMO models. Greedy POMO creates `8n` candidates; sampling, active search and EAS create `200*8n` candidates over 200 iterations. At 100 nodes this is 160,000 candidates per instance. Different methods use different instance batch sizes to fill available GPU memory. Hyperparameters are tuned on separate validation sets, and normally retained during larger-size tests. Reported main-table wall times cover the whole dataset, not individual latency. [Sections 4-4.2.]

**TSP.** Table 1 uses 10,000 size-100 instances and 1,000 each at sizes 125/150/200. At size 100, EAS-Emb/Lay/Tab obtain gaps 0.063%/0.053%/0.048% in 5/7/5 hours, versus pure sampling's 0.074% in 4 hours and full active search's 0.046% in five days. DPDP's 0.004% in two hours is stronger in this table. At size 200, EAS-Emb gives 0.400% versus sampling's 1.416%, but this remains heuristic finite-budget search rather than a guarantee. [Section 4.1, Table 1.]

**CVRP.** On 10,000 size-100 instances, EAS-Lay obtains length 15.61 with a -0.23% gap to LKH3 in 12 hours, versus sampling's 15.67/+0.17% in seven hours and LKH3's 15.65 in six days. The negative gap refers to a heuristic reference, not certified optimality, and CPU/GPU timings are not interchangeable. At size 200, full active search is stronger: +0.22% versus EAS-Lay's +0.45%, EAS-Emb's +0.88% and EAS-Tab's **+11.8%**. Retuning Tab's exponent reduces its gap to 3.54%, but that is an additional tuning experiment, not unchanged generalization. [Section 4.2, Table 2.]

**JSSP.** Three sets of 100 instances have 10x10, 15x15 and 20x15 job/machine sizes. Each stochastic method samples 8,000 schedules per instance over 200 iterations. EAS-Emb achieves OR-Tools-reference gaps 3.7%/11.7%/16.8%, versus sampling's 8.0%/16.0%/20.8%. Its total set times are 8/22/50 hours; the last setting is slower than sampling's 40 hours. L2D is CPU-bound and does not batch different problem instances here. OR-Tools has a one-hour per-instance cap, so its larger-instance output should not automatically be treated as a certified optimum. [Section 4.3, Table 3.]

**Structured XE CVRP.** Appendix A tests nine generated groups with 20 instances each, sizes 100-297, and three runs. Most results use a **new base model trained for three weeks per group**. Up to ten parallel copies of each target share the best incumbent; integer-rounded distances are used. EAS-Emb/Lay beat NLNS and LKH3 on eight of nine groups, but not `XE_11`. The unchanged uniform-model EAS-Lay transfer is listed separately as `Lay*`, with gaps 0.26%-4.08% to hybrid genetic search. These are not 0.26%-4.08% optimality certificates. [Appendix A, Table 4.]

**Ablations.** Incumbent imitation materially helps EAS-Emb/Lay on routing, with little effect on JSSP. Adding imitation to full active search alone does not reproduce EAS's efficiency. Too much or too little table intensification hurts performance, and a favorable setting is problem dependent. [Section 4.5; Appendices B-C.]

## Limitations

EAS spends substantial test-time search compute and is unsuitable for near-instant output. Performance depends on the pretrained policy, adaptation location, table design and tuned hyperparameters. Different base models are used across tasks and distribution-specific XE groups, so this is a specialist search framework under the repository's shared-checkpoint definition. Large-size transfer can fail, particularly for EAS-Tab, and complex industrial side constraints remain untested. Quality and speed are conditional on matched candidate counts, batching and hardware.

## Reproducibility

- **Official implementation:** [ahottung/EAS](https://github.com/ahottung/EAS), explicitly linked in the paper. The complete README documents POMO-based TSP/CVRP adaptation, checkpoints, instances, tuned command-line parameters and XE parallel copies. It describes a routing implementation; it does not document released JSSP experiments. No experiments were rerun.
- **Full reading:** All 13 pages of identified arXiv v3 (15 March 2022), including Appendices A-C, all five tables and four figures, were freshly read and key formulas/results visually checked. [Audit record](../data/reviews/papers/efficient-active-search.json).
- **Supplement check:** OpenReview returned a browser-verification gate. The complete accepted author version contains and cross-references all three scientific appendices. The author repository inventory/README adds code and data without another scientific PDF/ZIP; no referenced scientific appendix remains missing.
- **Dates:** First arXiv submission 9 June 2021; formal venue ICLR 2022. The conference-wide notification date was removed because it does not establish an individual acceptance date.
