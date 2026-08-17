---
id: mapdp
short_title: MAPDP
title: 'MAPDP: Cooperative Multi-Agent Reinforcement Learning to Solve Pickup and Delivery Problems'
authors: [Zefang Zong, Meng Zheng, Yong Li, Depeng Jin]
year: 2022
date: 2022-06-28
acceptance:
  date: "2021-11-29"
  source_url: "https://aaai.org/conference/aaai/aaai-22/"
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/21236
institutions: [Tsinghua University, Hitachi China Research and Development Corporation]
figure:
  path: paper-assets/mapdp/framework.png
  alt: MAPDP architecture with paired context embedding, context encoding, and cooperative agent decoding.
  caption: 'Figure 2: Overall multi-agent model structure with shared context and communicating vehicle policies.'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/download/21236/20985
scope: specialist
paradigm: constructive
problem_families: [Routing]
problems: [Pickup and Delivery Problem]
summary: MAPDP models multiple vehicles as cooperative agents that construct pickup-and-delivery routes under a shared reward.
---

# MAPDP: Cooperative Multi-Agent Reinforcement Learning to Solve Pickup and Delivery Problems

> **TL;DR:** MAPDP coordinates several vehicle policies so that assignments and routes are constructed jointly rather than by a single centralized sequence.

## Motivation

Pickup-and-delivery systems require both task assignment and routing across vehicles. Treating the whole solution as one long sequence obscures vehicle cooperation and scales poorly with the joint action space.

## Contributions

- Formulates cooperative PDP as multi-agent reinforcement learning.
- Designs shared encodings and communication/coordination for vehicle decisions.
- Evaluates learned cooperation against routing and multi-agent baselines.

## Methodology

1. Encode unserved pickup-delivery requests and all vehicle states. 2. form agent-specific contexts with shared global information. 3. select feasible next requests for vehicles under precedence/capacity masks. 4. optimize a shared route-cost reward.

## Experiments

- **Problems:** Cooperative pickup-and-delivery instances over the fleet and request sizes in the AAAI paper.
- **Baselines:** Single-agent neural routing, heuristic assignment/routing, and cooperative ablations.
- **Metrics:** Total route cost, runtime, and scaling with agents.
- **Main finding:** Explicit cooperative policies improve joint routing in the reported synthetic settings; fleet size and decoding scheme define the inference budget.

## Limitations

### Reported by the Authors

- Joint multi-agent decisions become more complex as fleet size increases.

### Curator Notes

- Results are specialized to the paper's PDP dynamics and do not establish transfer to arbitrary VRP constraints.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Main paper references:** MARL formulation, model architecture, and experiment section.
