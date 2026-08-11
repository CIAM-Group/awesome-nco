---
id: rbg
short_title: RBG
title: 'RBG: Hierarchically Solving Large-Scale Routing Problems in Logistic Systems via Reinforcement Learning'
authors: [Zefang Zong, Hansen Wang, Jingwei Wang, Meng Zheng, Yong Li]
year: 2022
date: 2022-08-12
venue: KDD
paper_url: https://doi.org/10.1145/3534678.3539037
institutions: [Tsinghua University, Beijing Tsingroc, Hitachi China Research and Development Corporation]
figure:
  path: paper-assets/rbg/framework.png
  alt: RBG hierarchy initializing regions, generating subsolutions, repartitioning, and rewriting the global solution.
  caption: 'Figure 2: Five-step workflow of the hierarchical Rewriting-by-Generating framework.'
  source_url: https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf
scope: specialist
paradigm: improvement
problem_families: [Routing]
problems: [Large-scale Vehicle Routing Problem]
summary: RBG hierarchically decomposes large logistics routing into region-level grouping and learned subproblem solving.
---

# RBG: Hierarchically Solving Large-Scale Routing Problems in Logistic Systems via Reinforcement Learning

> **TL;DR:** RBG alternates a high-level region policy with lower-level route generation so large logistics instances are handled as connected subproblems.

## Motivation

End-to-end neural decoding becomes costly on city-scale customer sets, while naive partitioning can damage global route structure. Hierarchical decisions can allocate attention to a manageable region at each stage.

## Contributions

- Proposes a region-based hierarchical reinforcement-learning framework.
- Coordinates high-level region construction with lower-level routing decisions.
- Evaluates synthetic and logistics-oriented large-scale instances.

## Methodology

1. Encode customers and current global solution state. 2. select or form a region at the high level. 3. solve/revise its routes with a lower-level policy. 4. merge the regional change and continue until the global solution is complete or the search budget ends.

## Experiments

- **Problems:** Large-scale routing instances motivated by logistics systems.
- **Scale and budget:** The KDD study evaluates hundreds to thousands of locations under fixed hierarchical search settings.
- **Baselines:** Neural constructors, decomposition methods, and routing heuristics.
- **Metrics:** Total cost, runtime, and size scaling.
- **Main finding:** Hierarchical decomposition maintains neural tractability at larger scales, while quality depends on region construction and repeated lower-level calls.

## Limitations

### Reported by the Authors

- Region decisions can introduce cross-region inefficiency.

### Curator Notes

- Industrial transfer depends on constraints and distributions beyond the public experimental setup.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Main paper references:** Hierarchical framework, algorithms, and large-scale evaluation.
