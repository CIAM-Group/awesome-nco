---
id: dgl
short_title: "DGL"
title: "DGL: Dynamic Global-Local Information Aggregation for Scalable VRP Generalization with Self-Improvement Learning"
authors:
  - "Yubin Xiao"
  - "Yaoxin Wu"
  - "Rui Cao"
  - "Di Wang"
  - "Zhiguang Cao"
  - "Peng Zhao"
  - "Yong Li"
  - "Yu Zhou"
  - "Ying Jiang"
year: 2025
date: 2025-01-15
acceptance:
  date: "2025-04-28"
  source_url: "https://2025.ijcai.org/important-dates/"
venue: "IJCAI"
paper_url: "https://www.ijcai.org/proceedings/2025/964"
code_url: "https://github.com/wuyuesong/DGL"
institutions:
  - "Nanyang Technological University"
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - "Capacitated Vehicle Routing Problem"
summary: "DGL dynamically combines global route context with normalized local neighborhoods and improves its training data through self-generated solutions."
---

# DGL: Dynamic Global-Local Information Aggregation for Scalable VRP Generalization with Self-Improvement Learning

> **TL;DR:** DGL dynamically combines global route context with normalized local neighborhoods and improves its training data through self-generated solutions.

## Motivation

Purely local policies miss global capacity structure, while full global attention scales poorly and shifts with graph size.

## Contributions

- Introduces **DGL** as a concrete neural routing method for Capacitated Vehicle Routing Problem.
- A dynamic aggregation block fuses compact global summaries with local customer views, followed by self-improvement training on stronger generated routes.
- Evaluates solution quality together with the inference or search budget needed to obtain it.

## Methodology

1. The instance and current solution state are represented for Capacitated Vehicle Routing Problem.
2. A dynamic aggregation block fuses compact global summaries with local customer views, followed by self-improvement training on stronger generated routes.
3. Greedy and reconstruction or augmented modes use different budgets; self-improvement is a training-time cost.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem.
- **Scale and budget:** Experiments focus on CVRP scale generalization from small training graphs to much larger synthetic and benchmark instances.
- **Metrics:** Objective value or optimality gap, runtime, and—where relevant—generalization across scale, distribution, or constraint variants.
- **Main finding:** The global-local balance improves scalability without discarding route-level information.

## Limitations

### Reported by the Authors

- The design is specialized to CVRP state and strongest results may rely on extra reconstruction or self-generated data rounds.

### Curator Notes

- Results should be compared only after matching trajectory count, augmentation, adaptation steps, local-search iterations, and hardware assumptions.
- The repository scope label reflects whether one trained checkpoint covers distinct optimization problems, not whether the algorithmic framework is reusable.

## Reproducibility

- **Published paper:** [IJCAI](https://www.ijcai.org/proceedings/2025/964)
- **Official implementation:** [repository](https://github.com/wuyuesong/DGL)
- **Budget note:** Reproduce the reported decoding, sampling, adaptation, or search budget before comparing objective values.
