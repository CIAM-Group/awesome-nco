---
id: ucpo-a-universal-constrained-combinatorial-optimization-method-via-preference-optimiza
short_title: UCPO
title: 'UCPO: A Universal Constrained Combinatorial Optimization Method via Preference Optimization'
authors:
- Zhanhong Fang
- Debing Wang
- Jinbiao Chen
- Jiahai Wang
- Zizhen Zhang
year: 2026
date: '2025-11-13'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/41017
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/41017
institutions:
- Sun Yat-sen University
- National University of Singapore
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- TSPTW
- TSPDL
- CVRPTW
- CVRPTWLV
summary: Feasibility-aware preference losses fine-tune constructive routing policies with task-specific checkpoints,
  improving many feasibility/quality tradeoffs while retaining hard-setting failures and release-specific reproducibility
  limits.
arxiv_url: https://arxiv.org/abs/2511.10148
code_url: https://github.com/Birdie-Go/UCPO
figure:
  path: paper-assets/ucpo-a-universal-constrained-combinatorial-optimization-method-via-preference-optimiza/framework.png
  alt: OriginalFigure1 depicts candidate sampling, feasibility splitting and three preference-loss components for
    UCPO.
  caption: OriginalFigure1 with its full caption from the read17p authorversion; it depicts training of constructive
    policies.
  source_url: https://arxiv.org/pdf/2511.10148v1#page=3
---

# UCPO: A Universal Constrained Combinatorial Optimization Method via Preference Optimization

> **TL;DR:** UCPO fine-tunes constructive routing policies with preferences that rank feasible solutions first, then favor lower cost or lower penalized cost. Three training-loss terms support exploration, feasibility and objective quality. It is a reusable training method with task-specific models, rather than a demonstrated shared cross-problem checkpoint.

## Motivation

Complex time-window, draft and fleet constraints can make simple action masking insufficient. Penalty-based RL introduces a difficult feasibility/quality tradeoff. UCPO uses sampled complete solutions and feasibility-aware preferences to adapt existing policies while retaining their network architecture. [pp. 1–3]

## Contributions

- A preference hierarchy separates feasible and infeasible solutions and orders each subset by objective or Lagrangian value.
- Feasibility-margin, primal-refinement and dual-exploration losses activate according to the sampled batch's feasibility composition.
- Warm-start fine-tuning is evaluated with several routing backbones, accompanied by cold-start and preference/sampling ablations. [pp. 4–7; Appendix D]

## Methodology

The policy samples complete trajectories. When all candidates are infeasible, a dual-exploration loss favors the best penalized candidate. When both feasible and infeasible candidates exist, a margin loss favors the best feasible one over infeasible candidates. When at least two feasible candidates exist, a primal loss favors the lowest-cost feasible candidate. Bradley–Terry likelihood differences are scaled by cost/Lagrangian ratios. These are training updates to a constructive policy; they are not an inference-time neighborhood improvement policy. [Equations 1–4; Figure 1]

The study covers TSPTW, TSPDL, CVRPTW and CVRPTW with limited vehicles, using POMO, PIP/PIP-D and a reported SLIM-based variant. **Specialist/constructive** reflects task-specific fine-tuning and evaluation. No result establishes one unchanged checkpoint across these native tasks; sharing the loss or network architecture is insufficient for that classification. [pp. 5–8]

Warm-start adds up to 500 epochs for POMO/PIP and 100 for PIP-D, compared with 10,000 original epochs. The advertised 1%–5% concerns additional training epochs relative to pretraining, not a measured end-to-end compute ratio including source-model training. The main setup uses GTX 1080 Ti GPUs and a Xeon E5-2640 v4 CPU. [p. 5]

## Experiments

The reported validation sets contain 10,000 instances. TSPTW/TSPDL use 50/100-node variants with different constraint hardness; Table 3 reports 50-node CVRPTW variants. Inference takes a best feasible candidate from size-dependent sampling with eightfold geometric augmentation. An instance fails if no sampled candidate is feasible; objectives average over feasible results. Reported TSPTW/TSPDL gaps use **LKH3 references**, not certified global optima. Appendix C specifies 10,000 LKH trials and three solver runs per instance. [pp. 5–6; Appendix C]

For TSPTW-50 Hard, POMO failure falls from 35.25% to 1.32% under warm UCPO and 0.13% under cold UCPO*. For TSPTW-100 Hard, warm UCPO(POMO) still fails on **100%** of instances; cold UCPO* reduces this to 0.87%, with a different training budget. UCPO(PIP-D) reduces that setting's failure from 6.48% to 2.99%. [Table 1]

Quality is not uniformly improved. On TSPDL-100 Medium, warm UCPO(POMO) reduces failure from 32.16% to 0.02% while its feasible-result objective rises from 17.11 to 17.29. On TSPDL-100 Hard, UCPO(PIP)'s objective is 22.40 versus PIP's 22.30, while failure falls from 20.66% to 0.04%. Cold UCPO* has lower CVRPTW objective but worse failure than POMO, 0.75% versus 0.20%. Such averages can cover different feasible subsets. [Tables 2–3]

The ablations also show tradeoffs. On Hard TSPTW-50, UCPO-C improves both default failure and objective (1.18%/25.743 versus 1.32%/25.750), and a scaling variant reaches 1.23%/25.737. Full-pair training has lower objective 25.629 but worse failure 7.67%; its prose incorrectly calls this lower objective worse. Larger sampling budgets and augmentation improve several metrics while increasing evaluation work. [Tables 7–11]

## Limitations

- Preference training encourages feasibility but does not certify every generated solution as feasible. Existing PIP/PIP-D masks remain part of those backbones, so mask-agnostic loss design does not establish that every experiment removes masking.
- The margin loss still uses the Lagrangian through its scaling factor. The multiplier is fixed rather than eliminated, and robustness tests cover only 0.5, 1 and 2 on two TSPTW-50 settings. General statements that the margin loss is multiplier-independent are not supported by its printed formula.
- Cost ratios require suitable nonzero denominators and sign conditions; the generic equality/inequality formulation does not establish these for all CO objectives. The paper does not provide a universal convergence or hard-feasibility theorem.
- Appendix A's printed time-continuity constraints include return-to-depot arcs with one depot time variable: summing them around a positive-length closed tour yields a contradiction. Depot reset/return handling is required before treating those displayed MILPs as directly executable specifications. This concerns the printed formulations, not evidence that the neural experiments solved those MILPs.
- Setting fleet size to the ceiling of total demand divided by capacity is a lower bound, not a universal feasibility certificate: three demands of 0.6 with capacity 1 require three vehicles, although that ceiling is two. Time windows can impose additional restrictions. Runtime/memory results and uncertainty across independent training seeds are not reported in the main comparison.

## Reproducibility

Read all **17 pages** of [arXiv v1](https://arxiv.org/pdf/2511.10148v1), including full references and Appendices A–E, and inspected all figures/tables. The [actual arXiv history](https://arxiv.org/abs/2511.10148) gives **2025-11-13**. The [formal AAAI record](https://ojs.aaai.org/index.php/AAAI/article/view/41017) and publisher-deposited DOI metadata establish publication **2026-03-14**, five authors and pages 36900–36908. Formal metadata lists Jinbiao Chen at NUS, whereas the read author copy lists all authors at Sun Yat-sen University; the version difference is retained. The formal PDF request returned HTTP 520 and was not counted as read.

The [author repository at the inspected commit](https://github.com/Birdie-Go/UCPO/tree/1dd7db24fa90b8c708d7c759d12e2959b8eb4b93), dated 2025-11-12, has 16 archive members, with code and README but no additional scientific PDF, data or model checkpoint. README, training arguments, reward construction, the complete loss function and environment imports were checked. In this release, `Trainer._get_loss` uses one best-anchor comparison averaged over all other samples, with mean per-step log probabilities. This differs from the paper's separately normalized conditional terms and sequence log likelihoods. `utils.get_env` also imports CVRPTW/CVRPTWLV modules absent from the inspected archive. These are release-specific reproducibility limitations, not a claim that the historical experiments used this exact implementation. No training or benchmark reproduction was performed.
