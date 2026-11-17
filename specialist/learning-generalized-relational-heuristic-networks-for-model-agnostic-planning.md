---
id: learning-generalized-relational-heuristic-networks-for-model-agnostic-planning
short_title: GHN
title: Learning Generalized Relational Heuristic Networks for Model-Agnostic Planning
authors:
- Rushang Karia
- Siddharth Srivastava
year: 2021
date: '2020-07-10'
publication:
  date: '2021-05-18'
  source_url: https://doi.org/10.1609/aaai.v35i9.16983
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v35i9.16983
institutions:
- Arizona State University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Combinatorial Search
problems:
- Classical Planning
summary: Domain-trained role-based networks combine action preferences and remaining-plan estimates with classical
  search; leapfrogging supports larger instances, with mixed coverage and wall-clock results.
arxiv_url: https://arxiv.org/abs/2007.06702
code_url: https://github.com/AAIR-lab/GHN/tree/aaai-21
figure:
  path: paper-assets/learning-generalized-relational-heuristic-networks-for-model-agnostic-planning/framework.png
  alt: Original Figure1 GHN action and plan-length network architecture.
  caption: Original Figure1 and full caption from the formal AAAI2021 paper.
  source_url: https://cdn.aaai.org/ojs/16983/16983-13-20477-1-2-20210518.pdf#page=3
---

# Learning Generalized Relational Heuristic Networks for Model-Agnostic Planning

> **TL;DR:** GHNs combine role-based state abstraction, learned action preferences and remaining-plan estimates to guide classical search. They transfer across object counts within a planning domain and can bootstrap larger training problems. They are **specialist/constructive** under this catalogue's shared-checkpoint criterion.

## Motivation

Planning heuristics commonly depend on symbolic action models or hand-designed domain features. GHNs aim to learn useful search guidance from trajectories while preserving a representation across differently named and differently sized object sets. They still require a simulator that supplies valid successors and observable state atoms. [Formal pp. 1–3]

## Contributions

- Encode objects by roles defined through unary predicates, with three-valued relations between roles.
- Combine action/parameter preferences with a remaining-plan-length predictor in a hybrid search priority.
- Use leapfrogging: a learned heuristic solves larger problems to produce the next iteration's training data.
- Evaluate thirteen IPC planning domains with explicit failures and comparisons to compiled planners. [Sections 2–5]

## Methodology

Canonical abstraction replaces object identities with sets of satisfied unary predicates. Relations take false, true or mixed values; count vectors retain population information. Binned counts support action prediction while absolute counts support plan-length regression. The tested network uses two fully connected networks with 32-unit hidden layers: an action Softmax with parameter-role Sigmoids, and a ReLU plan-length output. Goal hints add goal/done predicates. [Definitions 2.1/2.2; Figure 1; Section 3]

Action likelihood and parameter-role agreement define an artificial path cost, added to predicted remaining length for search ordering. A standard closed-list search retains actual path costs for duplicate handling. The finite-state soundness/completeness statement **does not establish admissibility or optimal plan cost**. Model-agnostic means symbolic transition formulas need not be supplied; successor generation still uses correct action execution. Unary/binary relational input and a domain's predicate/action vocabulary remain assumptions. [Equations 1–6; Theorem 4.1]

Networks are trained **separately per domain**. Object-count/name transfer and a common architecture do not demonstrate one checkpoint solving distinct native planning domains. Experiments seed trajectory collection with FF; the possibility of using blind search is a method discussion. Leapfrogging then uses earlier GHNs to generate larger-problem trajectories. [Sections 3/5]

## Experiments

The formal paper evaluates thirteen domains. Its main baseline comparison uses **500 uniformly generated test problems per domain**; the leapfrogging analysis separately uses **400 problems, 100 per size bin**. Each planner receives 600 seconds per problem without an additional memory restriction. GHN uses Python/Pyperplan whereas FD and FF use compiled implementations, which matters for wall-clock comparisons. Training uses RMSProp, learning rate 0.001, epsilon 0.001, batch size 32 and 100 epochs. [Formal pp. 5–7]

Compared with hff/GBFS, GHN/GBFS solves more problems in six domains, ties in six and solves fewer in one. Against FD the corresponding counts are **one/nine/three**. For equal coverage, node-expansion comparisons are also mixed. GHN is usually slower than FD despite sometimes expanding fewer nodes; Spanner is a notable exception. Logistics suffers from ambiguous trajectories/representation, and simple goal hints miss useful Goldminer landmark structure. [Formal Figures 2/3; Sections 5.2/6]

The author v1 source includes detailed earlier tables, configurations and ablations absent from the compiled PDFs. These use different size bins and a **5000-node cutoff**, so their numbers are **not replacements for the final paper's unrestricted-node, 600-second evaluation**. They show that leapfrogging need not improve every domain or every step, and that sharing both input types did not materially improve the illustrated Ferry network. [Author-source appendices and detailed tables]

## Limitations

Transfer is within a domain's representation, with separately trained networks across domains. Relational abstraction can alias states and obscure landmarks, especially in Logistics and Goldminer. Learned priorities have no optimal-cost guarantee. Simulator correctness underlies the soundness argument. Node-expansion gains do not imply end-to-end speedups against compiled planners. The recovered source appendix is an earlier author version, whose experimental protocol differs from the formal paper. [Sections 2–6]

## Reproducibility

Read all **10 formal pages**, **9 arXiv v2 pages**, and all recovered author-source scientific appendices: seven locally rendered configuration/ablation pages plus 24 detailed-table/plot pages, including section-title pages. All contact sheets, key equations, tables, plots and the original Figure 1/full caption were inspected. This is **50 registered reading-copy pages**, with overlap between versions, not 50 unique article pages.

arXiv history dates v1 to **2020-07-10** and v2 to 2020-10-20. The formal DOI confirms Karia/Srivastava, AAAI2021, pages 8064–8073, published **2021-05-18**. The [public v1 source archive](https://arxiv.org/src/2007.06702v1) contains supplementary TeX and images that its main compilation does not include. Local review renderings preserve those materials and have saved source hashes, build logs and provenance. They are not publisher PDFs; unresolved cross-references to the uncompiled main document remain visible. No later-version numerical identity is asserted.

The [paper-specific official branch](https://github.com/AAIR-lab/GHN/tree/e4f7311f3ecd0e2dcec9d2cdeff041d59a188a93) is `aaai-21`; the current default README also describes later papers. The pinned branch README and file tree were checked for additional scientific documents. Vendor PDFs were inventoried without being treated as this paper's supplements. No planner execution, training or benchmark reproduction is claimed.
