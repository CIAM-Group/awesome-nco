---
id: step-wise-routing
short_title: Step-Wise
title: Step-Wise Deep Learning Models for Solving Routing Problems
authors:
- Liang Xin
- Wen Song
- Zhiguang Cao
- Jie Zhang
year: 2021
date: '2020-10-15'
acceptance:
  date: '2020-10-12'
  source_url: https://doi.org/10.1109/TII.2020.3031409
venue: IEEE TII
paper_url: https://doi.org/10.1109/TII.2020.3031409
institutions:
- Nanyang Technological University
- National University of Singapore
- Shandong University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: Step-wise routing re-encodes residual inputs during construction; SW-PtrNet uses supervision and SW/ASW
  attention variants use RL, with explicit quality, runtime and approximation tradeoffs.
publication:
  date: '2020-10-15'
  source_url: https://doi.org/10.1109/TII.2020.3031409
code_url: https://github.com/liangxinedu/stepwise
figure:
  path: paper-assets/step-wise-routing/framework.png
  alt: ASW-TAM keeps lower encoder layers fixed while updating the masked top attention layer at each decoding step.
  caption: 'Figure 5: approximate step-wise attention architecture; purple blocks run once and green blocks run
    per decision.'
  source_url: https://doi.org/10.1109/TII.2020.3031409#page=6
---

# Step-Wise Deep Learning Models for Solving Routing Problems

> **TL;DR:** Re-encode the remaining routing problem after each construction decision. Full step-wise encoding improves small-instance policies but costs much more; ASW-TAM updates only the top attention layer to trade some quality for efficiency.

## Motivation

Embeddings computed once can retain information from nodes that have already been visited. The authors use Bellman's principle of optimality to motivate a representation focused on the remaining subproblem, while retaining relevant start/previous-node and vehicle state. This is an architectural argument and empirical inductive bias, rather than a proof that static encoders cannot represent optimal decisions (Sections I–IV).

## Contributions

- SW-PtrNet re-encodes the remaining sequence with an LSTM and is trained by supervised imitation for TSP.
- SW-TAM re-runs attention encoding with infeasible-node masking and is trained by REINFORCE for TSP/CVRP.
- ASW-TAM keeps lower layers fixed and recomputes the masked top-layer representation, with an incremental weighted-sum formulation to reduce theoretical cost.

## Methodology

**Full step-wise models.** SW-PtrNet retains the starting city, removes selected nodes, reuses the unchanged LSTM prefix when possible and encodes the suffix again. The decoder performs one selection without carrying an independent recurrent history between subproblems. SW-TAM recomputes the attention representation at each decision; for CVRP, the feasible set also depends on remaining capacity. Masks constrain the next action, and routes are constructed without backtracking or learned local moves (Algorithms 1–2).

**Approximation.** ASW-TAM computes the first L−1 layers and top-layer query/key/value projections once, then updates the top attention output with the current mask. Equations 21–28 describe subtracting a removed node's contribution from the unnormalized weighted sums and their denominator. The paper gives O(n²d² + dn³) for full SW-TAM versus O(n²d²) for the engineered approximation; the latter depends on those incremental updates. Lower-layer representations still contain information from the initial graph, so this remains an approximation rather than complete residual re-encoding. The paper's abbreviation **TAM** denotes Kool et al.'s attention model, not the later Two-stage Divide Method with the same abbreviation.

## Experiments

- **Data/protocol:** Uniform Euclidean TSP/CVRP20/50/100, with demands 1–9 and capacities 30/40/50. Use a fixed 10,000-instance test set per setting. TSP references are Concorde optima; CVRP gaps use LKH3 heuristic solutions. SW-PtrNet uses 1.6 million labelled TSP20 instances and one million training iterations; attention variants use 100 epochs with 1.28 million newly generated instances per epoch. Different native tasks and sizes use their respective trained models, so this remains specialist construction.
- **Small-instance effect:** On TSP20, SW-PtrNet improves gap from 1.28% to 1.00%, while total inference time increases from three to fourteen seconds over the 10,000-instance set (Table I). Full SW-TAM improves TSP20 gap from 0.29% to 0.19% and CVRP20 from 4.46% to 4.15%, but training an epoch takes 52/66 minutes versus TAM's 6/9 minutes. Reaching the same quality in fewer epochs does not automatically mean less wall time.
- **Approximation:** Table II reports TSP100 gaps of 4.35% for TAM and 3.20% for ASW-TAM, with total test times six and twenty-nine seconds. CVRP100 gaps are 7.07% and 4.99%, with eight and thirty-nine seconds. ASW-TAM's TSP20 gap of 0.23% is weaker than full SW-TAM's 0.19%, while its training epoch takes twelve minutes instead of fifty-two. These are greedy-decoding comparisons, not equal-quality one-pass speedups over classical solvers.
- **Generalization and longer training:** A TSP100-trained model is evaluated on 38 TSPLIB instances of 51–318 cities; mean gap decreases from 14.75% to 12.20%, with 29 wins. The table displays only ten selected instances, with some gaps still above 30%. Batch-normalization statistics are recalculated in advance using instances of the target size, so this is not completely unchanged preprocessing. Longer training (600 epochs at TSP20; 800/1,000 at TSP50 for ASW/TAM) retains a quality advantage, with additional training cost (Section V-C; Table III).

## Limitations

Repeated full encoding is expensive and is evaluated only at size 20; the approximation scales the experiments to 50/100 but is slower at inference than its original attention baseline. Attention histograms support the authors' design intuition empirically and do not prove a hierarchy of universally relevant features or optimality. The quoted multi-hour LKH runtime comes from prior literature rather than a newly matched hardware comparison. Explicitly removing visited nodes is not sufficient by itself to guarantee globally optimal routing decisions.

**Current code qualification:** `ASWTAM/nets/graph_encoder.py::change` masks and renormalizes a dense attention matrix, then calls `torch.matmul(attn, V)` each step. It does not implement the incremental numerator/denominator subtraction shown in Equations 26–28; consequently, the paper's quadratic attention-update claim should not be assigned to that current routine without modification. This observation concerns the inspected release, not a rerun or disproof of the reported measurements.

## Reproducibility

- **Source/metadata:** Freshly read all eleven pages of the user-provided final IEEE issue PDF, including 35 references, all tables and figures. The first page directly states acceptance **12 October 2020**, online publication **15 October 2020**, and issue July 2021. NTU, Shandong University and National University of Singapore are the actual affiliations. The original file remains in `addpapers`; its review-cache copy has a registered SHA.
- **Official code:** [liangxinedu/stepwise](https://github.com/liangxinedu/stepwise), directly linked on page 10. The 218-member author code archive was inventoried and contains no additional scientific PDF, notebook, nested ZIP or video; README and relevant SW/ASW model routines were checked. Download scripts supply data/models separately. The formal paper identifies color figures but no separate narrative appendix; an external IEEE attachment inventory was not asserted. No training or optimization experiment was rerun.
- **Figure/relations:** Figure 5 is cropped directly from PDF page 6 with its complete ASW-TAM diagram and caption. Twelve exact internal citations are recorded; printed citation-year/byline errors do not change the identity of the cited works.
