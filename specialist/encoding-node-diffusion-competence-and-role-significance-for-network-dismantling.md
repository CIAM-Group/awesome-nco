---
id: encoding-node-diffusion-competence-and-role-significance-for-network-dismantling
short_title: DCRS
title: Encoding Node Diffusion Competence and Role Significance for Network Dismantling
authors:
- Jiazheng Zhang
- Bang Wang
year: 2023
date: '2023-01-29'
publication:
  date: '2023-04-30'
  source_url: https://doi.org/10.1145/3543507.3583233
venue: WWW
paper_url: https://doi.org/10.1145/3543507.3583233
institutions:
- Huazhong University of Science and Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Network Dismantling
summary: Unsupervised diffusion and structural-role encoders rank nodes for one-pass dismantling; threshold-size
  and curve-area results differ and neither certifies minimum removal.
arxiv_url: https://arxiv.org/abs/2301.12349
code_url: https://github.com/JiazhengZhang/DCRS
figure:
  path: paper-assets/encoding-node-diffusion-competence-and-role-significance-for-network-dismantling/framework.png
  alt: Original Figure2 shows diffusion encoder, role graph construction, role encoder and ranking fusion.
  caption: Original Figure2 and complete caption show the two score encoders and one-pass node ranking.
  source_url: https://arxiv.org/pdf/2301.12349v1#page=4
---

# Encoding Node Diffusion Competence and Role Significance for Network Dismantling

> **TL;DR:** DCRS combines a graph-diffusion encoder and a structural-role graph encoder to rank attack nodes. A one-pass ranking constructs a dismantling set. It is **specialist/constructive**, with an unsupervised surrogate objective rather than a guarantee of the smallest feasible attack set.

## Motivation

Network dismantling seeks a small set of node removals that reduces the giant connected component below a threshold. DCRS combines message-relaying competence with regional structural roles, aiming to improve rankings beyond a single centrality or topology representation. [pp. 1–3]

## Contributions

- Introduce a diffusion-style neural encoder with outgoing normalization and incoming message aggregation.
- Build a role-similarity graph from RolX egonet features and encode it with a GCN.
- Fuse scores and evaluate dismantling size, curves, thresholds and encoder ablations. [Sections 3/4; scientific appendix]

## Methodology

Both graph encoders start from all-one features. RolX uses structural features and nonnegative factorization; cosine similarity connects role-nearest nodes. MLPs produce diffusion/role scores, a fixed-weight fusion and sigmoid produce ranking scores, and the highest-ranked nodes form the attack set. The paper explicitly focuses on **one-pass removal without reinsertion**. Classical selection from learned scores constructs the set; it is not a learned complete-solution improvement policy. [pp. 3–5]

The unsupervised loss combines products of reciprocal neighbor scores with a score-sum regularizer. This egonet-based proxy is not the exact largest-component constraint or a proved probability model for cascading failures. Calling scores probabilities does not establish calibration. Graph-family or size experiments alone do not demonstrate one unchanged checkpoint across native optimization problems. [Equations 10–13]

## Experiments

The 22 real networks range from 291 to 12979 nodes. Main comparisons use threshold 0.01 and 14 ranking baselines on a Xeon E5-2620 v4, 32GB RAM and GTX1080Ti-11GB. Four synthetic families are evaluated, with means and standard deviations over 20 generated instances per setting. [Tables 1/2; Figures 4–6]

At threshold 0.01, DCRS has the smallest attack-set fraction on 21 of 22 real networks. Wikibook is an exception: 11.93% versus PageRank's 11.75%. Mean fractions are reported as 25.97% versus 29.91% for the next-best aggregate comparator. These are relative heuristic comparisons, not gaps to certified optimum. Synthetic averages also do not imply superiority on every instance. [Table 2; pp. 6–8]

Attack-set size at a particular threshold and area under the dismantling curve are distinct metrics. Table 4 includes negative area cases: FilmTrust 34.39 versus PageRank 32.89, DNCEmails 24.77 versus 23.10, and Wikibook 6.71 versus betweenness 6.41. The area values are not directly comparable across differently sized graphs as a universal normalized metric. [Table 4; appendix]

## Limitations

No approximation or exact-feasibility theorem connects the differentiable surrogate to minimum dismantling size. The role graph requires structural extraction, factorization and similarity computation; its empirical MapReduce exponent is not a universal worst-case bound. Very-large-network role construction and higher-order roles remain future work. Reported real networks are modest in size, and the current release trains real-network models separately. [Sections 3.5/3.6/5; current release]

## Reproducibility

Read all **12 pages of arXiv v1**, the complete 50-reference bibliography and full scientific appendix; inspected all three contact sheets and original Figure 2/full caption. History dates v1 **2023-01-29**. The preprint has placeholder DOI fields; independent primary DOI metadata confirms the two HUST authors, WWW2023, pages 111–121 and publication **2023-04-30**.

The [pinned official release](https://github.com/JiazhengZhang/DCRS/tree/1d108f1f13903bb310411943ab7894fd239539a9) has ten files. Its 12.9MB data ZIP has 1096 members and no scientific PDF/TeX/notebook or nested archive. Read the full README, both configuration files and the relevant real-network training loop. That loop instantiates/trains a model per graph and uses a 500-epoch loop, despite configuration entries listing 200; these are current-release facts, not a claim about the historical experiment. No weights were deserialized or benchmark rerun. No exact current-catalogue body-plus-bibliography target was established.
