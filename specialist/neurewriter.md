---
id: neurewriter
short_title: NeuRewriter
title: 'Learning to Perform Local Rewriting for Combinatorial Optimization'
authors:
  - Xinyun Chen
  - Yuandong Tian
year: 2019
date: 2018-09-30
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2019/hash/131f383b434fdf48079bff1e44e2d9a5-Abstract.html
arxiv_url: https://arxiv.org/abs/1810.00337
code_url: https://github.com/facebookresearch/neural-rewriter
institutions:
  - Facebook AI Research
  - University of California, Berkeley
figure:
  path: paper-assets/neurewriter/framework.png
  alt: NeuRewriter state transition showing a selected region, rewrite rule, and updated solution.
  caption: 'Figure 1: Core local-rewriting transition in the NeuRewriter framework.'
  source_url: https://arxiv.org/pdf/1810.00337
scope: specialist
paradigm: improvement
problem_families:
  - Routing
  - Scheduling
problems:
  - Capacitated Vehicle Routing Problem
  - Job Shop Scheduling Problem
summary: NeuRewriter learns region selection and local rewrite rules that repeatedly improve a feasible solution.
---

# Learning to Perform Local Rewriting for Combinatorial Optimization

> **TL;DR:** NeuRewriter represents optimization as a sequence of learned local rewrites applied to an existing feasible solution.

## Motivation

Constructive neural policies commit to early decisions and often need expensive sampling to recover. Local search is more forgiving, but manually choosing which region to edit and how to rewrite it can be problem specific.

## Contributions

- Defines a reusable local-rewriting formulation with separate region-picking and rule-picking policies.
- Trains the rewrite policy with reinforcement learning from objective improvements.
- Instantiates the framework for CVRP and job-shop scheduling.

## Methodology

1. Build an initial feasible solution with a simple heuristic.
2. Encode the current solution and score candidate local regions.
3. Select a rewrite rule and apply it while preserving feasibility.
4. Use the objective change as feedback and repeat until the iteration budget is exhausted.

## Experiments

- **Problems:** CVRP and job-shop scheduling on synthetic instances.
- **Scale and budget:** Results are reported across the paper's small and medium instance sizes under fixed rewrite-step budgets; more steps increase inference time.
- **Baselines:** Classical heuristics and task-specific neural construction or improvement methods available at publication time.
- **Metrics:** Route length or scheduling objective together with runtime.
- **Main finding:** Learned rewrites improve simple initial solutions and transfer the high-level search template across the two domains, with quality tied to the allowed rewrite budget.

## Limitations

### Reported by the Authors

- The implementation still requires task-specific state encodings and legal rewrite operators.

### Curator Notes

- The method does not eliminate domain engineering: feasibility and neighborhood design remain external to the policy.
- Iteration counts must be reported when comparing against one-shot constructors.

## Reproducibility

- **Official implementation:** [facebookresearch/neural-rewriter](https://github.com/facebookresearch/neural-rewriter)
- **Checkpoints:** See the official repository.
- **Main paper references:** Framework section, algorithm description, and CVRP/JSSP experiment sections.
