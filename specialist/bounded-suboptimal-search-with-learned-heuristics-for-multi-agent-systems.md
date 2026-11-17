---
id: bounded-suboptimal-search-with-learned-heuristics-for-multi-agent-systems
short_title: Learned Focal Search
title: Bounded Suboptimal Search with Learned Heuristics for Multi-Agent Systems
authors:
- Markus Spies
- Marco Todescato
- Hannes Becker
- Patrick Kesper
- Nicolai Waniek
- Meng Guo
year: 2019
date: '2019-07-17'
publication:
  date: '2019-07-17'
  source_url: https://doi.org/10.1609/aaai.v33i01.33012387
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v33i01.33012387
institutions:
- Bosch Center for Artificial Intelligence
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Combinatorial Search
problems:
- Multi-Robot Dynamic Coverage
summary: Imitated multi-robot policies order classical focal search while an admissible primary heuristic retains
  cost bounds; valet-parking simulations show conditional speed–quality tradeoffs.
figure:
  path: paper-assets/bounded-suboptimal-search-with-learned-heuristics-for-multi-agent-systems/framework.png
  alt: Original Figure1 policy/value network and learned secondary focal-search ordering.
  caption: Original Figure1 and full caption from the formal-layout author copy.
  source_url: https://mengguo.github.io/personal_site/papers/pdf/spies2019bounded.pdf#page=3
---

# Bounded Suboptimal Search with Learned Heuristics for Multi-Agent Systems

> **TL;DR:** Use learned action probabilities or plan-length predictions to order nodes **within** a classical focal search set. An admissible primary heuristic preserves the search's cost bound. Experiments concern simulated valet-parking coverage with one or two robots, making this **specialist/constructive**.

## Motivation

A learned policy can fail on unfamiliar states, and using a learned value directly as A*'s primary heuristic can invalidate guarantees. This work places neural guidance in a secondary ordering while retaining an admissible lower bound. [pp. 1–3]

## Contributions

- Combine learned secondary heuristics with bounded-suboptimal and anytime focal search.
- Compare plan-length guidance against path likelihood normalized to a common horizon.
- Compare single-robot policies with a jointly learned multi-robot policy in dynamic coverage. [Sections 3/4]

## Methodology

A convolutional network predicts robot action probabilities and remaining cost from obstacles, a prescribed car path and robot positions. Each branch has fourteen convolutional layers, the first seven shared, followed by agent-centered windows and two fully connected layers. A* expert paths provide action labels and cost targets; unsolved expert instances are discarded. Cross-entropy and L1 losses train the outputs. [Section 3.3]

The primary score remains actual path cost plus an admissible heuristic—car steps-to-go in the experiments. Learned length or horizon-normalized log path likelihood orders the eligible focal nodes. The bound follows from the **primary lower bound and focal eligibility**, not from neural admissibility. The first-solution variant starts with an infinite focal factor and reports an a posteriori bound; it should not be described as satisfying an arbitrary finite preset factor. The anytime wrapper can tighten the bound by continuing classical search. This does not constitute neural editing of complete incumbents. [Sections 3.1/3.4]

## Experiments

In simulated valet parking, robots must maintain line-of-sight coverage of a moving car's monitor region. The car's route is supplied externally. Costs combine elapsed steps and robot movement; sensing uses a 360-degree, infinite-range idealization with ray tracing. Training worlds are 20×20 grids, and variants learn single-robot or two-robot control separately. Thus robot-count variation and common architecture do not establish native cross-problem checkpoint generalization. [Sections 4.1–4.3]

Search comparisons use **100 selected validation worlds** with a five-minute cap. In two-robot tests, MPMW-guided first-solution likelihood search solves all 100, versus A*'s 90% and at most about 60% for direct probabilistic MPMW execution. The first solutions have mean reported bound 7.2 and actual cost ratio 3.1; continued anytime search reduces these to 4.2 and 2.0. **Normalized costs include only instances solved by A* within the cap.** These ratios therefore do not describe all test instances. Single-robot search methods all succeed, while fewer expanded nodes translate into smaller wall-clock gains because each neural query takes about five milliseconds. [Figures 5/6]

## Limitations

Evidence is for fixed simulated coverage tasks with known deterministic dynamics and idealized sensing. A* demonstration generation can require hours and omits unsolved instances. Evaluation reuses validation worlds rather than an independently described final test distribution. Learned secondary scores do not themselves certify feasibility, optimality or multi-agent safety outside the modeled search. The qualitative example reports first-solution timing as 2.5 seconds in Figure 4's caption but one second in the text; these should not be merged into a single exact measurement. The likelihood illustration also contains a reversed printed log inequality; the described intent is to prefer greater likelihood after common-horizon normalization. [Sections 3.4/4]

## Reproducibility

Read all **eight author-hosted formal-layout pages**, complete 25-reference bibliography, figures, Table 1 and key equations; inspected both contact sheets and original Figure 1/full caption. Primary DOI metadata confirms six Bosch authors, AAAI2019, pages 2387–2394 and publication **2019-07-17**. This is the Spies et al. paper, distinct from later similarly titled focal-search papers.

The author's publication entry links this PDF and BibTeX; no additional required scientific supplement or official code release was identified. Source availability is recorded without claiming that code does not exist. No training, planner execution or benchmark reproduction was performed.
