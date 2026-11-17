---
id: influence-maximization-with-fairness-at-scale
short_title: FPS / FAC
title: Influence Maximization with Fairness at Scale
authors:
- Yuting Feng
- Ankitkumar Patel
- Bogdan Cautis
- Hossein Vahabi
year: 2023
date: '2023-06-02'
publication:
  date: '2023-08-04'
  source_url: https://doi.org/10.1145/3580305.3599847
venue: KDD
paper_url: https://doi.org/10.1145/3580305.3599847
institutions:
- Université Paris-Saclay
- CNRS LISN
- CNRS IPAL Singapore
- University of California Berkeley
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Fair Influence Maximization
summary: Fairness-aware cascade embeddings and a classical greedy decoder select influencers; logged-data tests
  distinguish sampled fair baselines, synthetic attributes and full-network comparisons.
arxiv_url: https://arxiv.org/abs/2306.01587
figure:
  path: paper-assets/influence-maximization-with-fairness-at-scale/framework.png
  alt: Original Figure1 contrasts FPS participant sampling and FAC shared embedding learning.
  caption: Original Figure1 and full caption show two separately trained strategies feeding a fair-greedy seed decoder.
  source_url: https://arxiv.org/pdf/2306.01587v2#page=5
---

# Influence Maximization with Fairness at Scale

> **TL;DR:** FPS and FAC learn influencer representations from diffusion cascades, then use a fairness-aware greedy decoder. The method targets proportional influence across sensitive groups. It is **specialist/constructive**, with attribute-specific learned representations and no certified optimality or fairness guarantee.

## Motivation

Fair influence maximization should consider who receives influence as well as total reach. Topology-based simulations can be expensive. This work learns from observed cascade initiators/participants and sensitive attributes, aiming to scale beyond the small graphs used by several fair-IM baselines. [pp. 1–3]

## Contributions

- Define an equity score from variation in group-specific influenced fractions.
- Introduce fairness-based participant sampling (FPS) and fairness-as-context learning (FAC).
- Combine learned embeddings with a tunable fair-greedy decoder and evaluate large logs, synthetic attributes and attribute combinations. [Sections 3–6; Appendix A]

## Methodology

Fairness is proportional representation in the **affected population**, not equal seed allocations. A sigmoid transformation of the coefficient of variation gives the score. FPS reweights/downsamples cascade participants according to initiator fairness and response time. FAC shares influencer embeddings between a cascade-participation objective and fairness regression. Training uses negative-sampling/NCE for the large output space. [pp. 3–5]

The classical decoder adds seeds using a weighted spread/fairness score, lazily recomputing heuristic top-lambda influence sets and removing predicted affected users. Embedding-norm allocations and learned probabilities are surrogates; CELF-like processing alone does not prove a classical submodular approximation ratio for this fairness objective. Attribute-specific training and concatenation experiments do not establish a single unchanged checkpoint across arbitrary tasks. [Algorithm 1; Appendix A.1/A.4]

## Experiments

Weibo has 19698 influencers and 1170688 influencees; Digg has 532 and 336225. Digg's sensitive profiles are **synthetically allocated** using population statistics. Cascades are split chronologically 60/20/20. Embedding size is 50, training lasts ten epochs, learning rate is 0.1 and the default unfairness-aversion weight is 0.2. Hardware is a Xeon E5-2620 v2 server with 188GB RAM and Tesla K40m. [Table 1; Section 6.1]

Full fair-IM baselines are compared on smaller sampled graphs, while complete-dataset experiments use scalable, fairness-agnostic cascade methods. DNI is the union of participants in **held-out logged cascades** started by selected seeds, not measured live campaign causality. FPS/FAC generally perform well, but Weibo gender yields little fairness separation, and combining FPS with FAC is not uniformly beneficial. [Figures 2/3]

Additional experiments deliberately flip selected male profiles to make some Weibo influencers' cascades unbalanced. Joint sensitive attributes produce 72 Weibo or 12 Digg categories. Directly concatenating single-attribute embeddings can save training, but Digg's jointly trained representations perform better on both fairness and spread. Billion-node feasibility is not experimentally demonstrated by these million-scale logs. [Figures 4–6/9/10; Appendix A.3/A.4]

## Limitations

Results depend on available cascades, sensitive labels, the chosen equity definition and learned surrogates. No certified optimal seed set or universal fairness guarantee is proved. Small-sample versus complete-dataset comparator sets must remain separate. Synthetic Digg profiles and the intervention on Weibo limit direct claims about naturally occurring demographic fairness. [Sections 5–7; Appendix A]

## Reproducibility

Read all **12 pages of arXiv v2**, complete references and full scientific Appendix A.1–A.4, and inspected all three contact sheets and original Figure 1/full caption. Actual history dates v1 **2023-06-02**, v2 **2023-06-06**. Primary DOI metadata confirms the four authors, KDD2023 and online publication **2023-08-04**. DOI and institutional bibliographic pagination disagree, so no single unqualified page range is asserted here.

The manuscript's declared repository, goldenretriever-5423/fair_at_scale, returned ordinary GitHub 404 and git repository-not-found during this review. No verified replacement was identified. Code contents were therefore not inventoried or executed; the complete identified scientific appendix was available in the arXiv copy. Missing code alone does not mean the scientific reading is incomplete.
