---
id: learning-heuristic
short_title: Learning Heuristic
title: "Learning Heuristics for the TSP by Policy Gradient"
authors:
  - Michel Deudon
  - Pierre Cournut
  - Alexandre Lacoste
  - Yossiri Adulyasak
  - Louis-Martin Rousseau
year: 2018
date: 2018-06-26
acceptance:
  date: "2018"
  source_url: "https://doi.org/10.1007/978-3-319-93031-2_12"
venue: CPAIOR
paper_url: https://doi.org/10.1007/978-3-319-93031-2_12
code_url: https://github.com/MichelDeudon/encode-attend-navigate
institutions:
  - Polytechnique Montreal
  - Element AI
  - HEC Montreal
  - CIRRELT
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
summary: This paper learns a policy-gradient TSP heuristic with an attention-only encoder-decoder, an explicit critic baseline, and optional 2-opt post-processing.
figure:
  path: paper-assets/learning-heuristic/framework.png
  alt: Attention-only neural encoder and pointer-style neural decoder used by the learned TSP heuristic.
  caption: 'Appendix Figures 1–2: Neural encoder and neural decoder used by the learned heuristic.'
  source_url: https://hanalog.polymtl.ca/wp-content/uploads/2018/11/cpaior-learning-heuristics-6.pdf
---

# Learning Heuristics for the TSP by Policy Gradient

> **TL;DR:** This paper learns a policy-gradient TSP heuristic with an attention-only encoder-decoder, an explicit critic baseline, and optional 2-opt post-processing.

## Motivation

The paper starts from the observation that many practical TSP heuristics still rely on hand-crafted logic, while supervised neural approaches depend on expensive optimal labels. It asks whether a reinforcement-learning policy can learn a useful construction heuristic directly, and whether a lightweight local search step can make that learned heuristic competitive with strong OR baselines.

## Contributions

- Proposes an attention-based encoder-decoder for TSP that removes the LSTM encoder used in earlier policy-gradient routing models.
- Uses a custom critic as a baseline for REINFORCE, rather than relying on the exact setup from prior pointer-network work.
- Adds a simple 2-opt post-processing step to improve sampled tours.
- Shows that the learned heuristic is competitive with OR-Tools and can get close to optimal on 2D Euclidean TSP instances.

## Methodology

1. Input cities are represented by 2D coordinates, and PCA is applied to centered coordinates for rotation invariance.
2. The encoder maps each city to an embedding using stacked multi-head self-attention and feed-forward layers.
3. The decoder keeps only the last three visited cities instead of an LSTM state, which forms the query for the next action.
4. A pointing mechanism scores unvisited cities, masking those already in the tour and clipping logits to stabilize training.
5. The policy is trained with REINFORCE and a learned critic baseline to reduce gradient variance.
6. At inference time, multiple samples can be drawn and the best tour can be improved further with 2-opt.

## Experiments

- **Problems:** 2D Euclidean TSP at sizes 20, 50, and 100.
- **Baselines:** OR-Tools, Christofides, Concorde, the Pointer Network trained with policy gradient, and the paper's own model with and without 2-opt.
- **Metrics:** Average tour length and runtime.
- **Main finding:** The learned policy is competitive with classical heuristics, and the 2-opt hybrid closes most of the remaining gap, especially on the Euclidean benchmark instances reported in the paper.

## Limitations

Author-reported constraints and curator observations are separated to keep interpretation transparent.

### Reported by the Authors

- The paper is focused on the 2D Euclidean TSP, so it does not demonstrate direct transfer to constrained or non-Euclidean routing variants.
- The method still benefits from 2-opt at inference time, so the strongest results are not from pure one-shot construction alone.
- The model is trained and evaluated on fixed benchmark sizes, with transfer to TSP100 shown by pretraining on TSP50 rather than by a single universal model.

### Curator Notes

- The critic is part of the training setup, so the note should not be read as a pure actor-only policy-gradient method.
- The improvement from 2-opt comes with extra inference cost, so quality comparisons should respect the decoding budget.
- The result is still specialist under this repository's taxonomy because the model is trained for TSP rather than reused across different combinatorial problems.

## Reproducibility

- **Official implementation:** [MichelDeudon/encode-attend-navigate](https://github.com/MichelDeudon/encode-attend-navigate)
- **Checkpoints:** Not mentioned in the paper excerpt; repository should be checked separately.
- **Main paper references:** Sections 3-5, Table 1, and the appendix figures.
