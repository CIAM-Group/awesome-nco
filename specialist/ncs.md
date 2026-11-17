---
id: ncs
short_title: NCS
title: Efficient Neural Collaborative Search for Pickup and Delivery Problems
authors:
- Detian Kong
- Yining Ma
- Zhiguang Cao
- Tianshu Yu
- Jianhua Xiao
year: 2024
date: '2024-09-03'
acceptance:
  date: '2024-08-18'
  source_url: https://doi.org/10.1109/TPAMI.2024.3450850
venue: IEEE TPAMI
paper_url: https://doi.org/10.1109/TPAMI.2024.3450850
institutions:
- Nankai University
- National University of Singapore
- Singapore Management University
- The Chinese University of Hong Kong, Shenzhen
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Pickup and Delivery Traveling Salesman Problem
- Pickup and Delivery Traveling Salesman Problem with LIFO Constraints
summary: NCS collaboratively trains a modified attention constructor and an N2S pair-removal/reinsertion improver
  using shared-critic PPO, curriculum initialization and imitation; separate models solve PDTSP and PDTSP-LIFO.
publication:
  date: '2024-09-03'
  source_url: https://doi.org/10.1109/TPAMI.2024.3450850
code_url: https://github.com/dtkon/PDP-NCS
figure:
  path: paper-assets/ncs/framework.png
  alt: NCS connects a learned constructor and N2S improvement policy with shared-critic, curriculum and imitation
    during training.
  caption: 'Figure 1: NCS framework, including collaborative training and construction followed by iterative improvement.'
  source_url: https://doi.org/10.1109/TPAMI.2024.3450850#page=2
---

# Efficient Neural Collaborative Search for Pickup and Delivery Problems

> **TL;DR:** NCS jointly trains a modified attention constructor and an N2S improvement policy. The constructor supplies initial tours; N2S removes and reinserts complete pickup–delivery pairs. Shared-critic PPO, curriculum initialization and imitation of improved tours connect the two policies during training.

## Motivation

Construction policies generate tours quickly but can plateau in quality. Improvement policies can explore neighbourhoods but spend effort starting from poor tours. Pickup-before-delivery and LIFO constraints further restrict generic single-node or segment-reversal moves. The paper combines learned construction and improvement, with a pairwise neighbourhood designed for these constraints.

## Contributions

- NCS collaboratively trains two policies using a shared critic, curriculum learning and imitation learning, instead of stacking independently trained models.
- N2S learns which pickup–delivery request to remove and where to reinsert its two nodes, using feasibility masks.
- Synthesis Attention combines coordinate-based and cyclic-position-based attention scores while reusing auxiliary scores across encoder layers.
- Invariant coordinate transformations and a shorter action-history window enhance inference diversity.

## Methodology

**Actual problems.** Experiments solve the single-vehicle pickup-and-delivery TSP (PDTSP) and PDTSP-LIFO. There are n paired requests and 2n+1 locations including the depot. Every pickup precedes its paired delivery; LIFO additionally requires unloading the topmost outstanding request. Time windows, dynamic orders and capacitated multi-vehicle PDPs are not evaluated. Appendix F discusses adding capacity and dummy depots as an extension.

**N2S improvement.** A three-layer, four-head, 128-dimensional encoder combines coordinate embeddings with cyclic positional attention through a learned MLP. One decoder selects a request using local compatibility and recent-action history. A second predicts a joint distribution over the two reinsertion positions, masking infeasible choices. Actions modify a complete incumbent tour, while a separate best-so-far solution is retained; the current trajectory need not improve at every step. Reward measures newly achieved best-so-far cost reduction.

**Construction and collaboration.** The modified attention model m-AM encodes paired pickup/delivery information and constructs a masked autoregressive tour. N-step PPO trains both policies. An N2S critic and a learned scalar provide a baseline for the constructor. Curriculum initialization first uses high-temperature sampling, then increasingly large best-of-sample sets, with an additional short improvement stage for size 101. Quality-gated imitation teaches m-AM from improved tours. The critic is an approximate training baseline; its interpretation as a remaining gap does not certify an optimal objective.

**Inference and classification.** NCS samples initial solutions with m-AM, improves the chosen tours for a fixed number of N2S steps and returns the best. NCS-A runs floor(|V|/2) coordinate-transform branches; the action-history window is shortened at inference. Standalone N2S instead starts from random feasible tours. NCS is a specialist **constructive–improvement** solver with two learned stages, not a portfolio of several improvement policies. Different PDP variants/sizes have separate trained models and explicit problem-specific masks.

## Experiments

- **Protocol:** Uniform Euclidean instances with 21/51/101 total nodes, including the depot. Train for 200 epochs, twenty batches of 600 instances each, with 250 improvement steps per instance, n-step length five, three PPO updates, clipping threshold 0.1 and discount 0.999. The server has eight RTX 2080Ti cards and an Intel E5-2680 CPU. Main comparisons report totals over 2,000 test instances, using sixteen CPU cores for LKH3 and up to eight GPUs for neural methods.
- **Quality and budget:** At size 101 with 3,000 improvement steps, unaugmented NCS gaps to LKH3-10k are 3.20% for PDTSP and 1.29% for PDTSP-LIFO. NCS-A lowers these to −0.22% and −1.68%, respectively. Its reported total test times are **9+121 minutes** versus LKH3's 98 minutes for PDTSP, and **9+161 minutes** versus 67 minutes for LIFO; the plus sign separates construction and improvement. Lower route cost therefore does not imply a universal runtime advantage. These negative gaps beat a finite-budget heuristic reference, not a certified optimum.
- **Training/memory:** NCS training takes roughly one/seven/ten days across the three sizes, versus N2S one/three/seven days. For PDTSP51, reported training memory is 19,918 MB versus 14,786 MB, and inference memory 6,136 MB versus 5,758 MB. Neural baselines use different training schedules; speed and sample counts must be interpreted with those differences.
- **Ablations:** At dimension 128, Synthesis Attention uses 0.76 million parameters and 340 seconds for the reported 2,000-case/3k-step evaluation, versus DAC-Att's 1.25 million and 400 seconds, with gaps 2.40%/2.43%. Replacing either learned decoder degrades quality; curriculum and imitation improve collaboration, but augmented N2S-A/NCS-A differences are not always statistically significant. Paired tests use 2,000 instances and the stated 5% threshold.
- **Generalization:** Appendix E normalizes coordinates, selects the closest-size checkpoint and increases decoder clipping constant C from six to ten. These are specified inference changes. On ten PDTSP201 instances, NCS-A's mean gap is 2.24%, while the mean best-of-ten-run gap is 1.93%. LIFO benchmark gaps use two heuristic references, not certified optima. Main prose mentions sizes up to 201 for LIFO, but Table X and the twenty-four Appendix Table 15 cases cover at most 101. The authors acknowledge weaker out-of-distribution performance relative to strong classical solvers.

## Limitations

The tested tasks are static single-tour paired problems; broader PDP coverage is proposed rather than established. Feasibility relies on explicit precedence/LIFO logic, and search quality depends materially on step, sampling and augmentation budgets. Neither a learned critic nor lack of a statistically significant N2S/NCS difference proves that a solution is close to the true optimum. GPU/CPU comparisons use different implementations and parallel hardware.

**Printed formula versus code:** Equation 20 writes an imitation objective using route probability without a logarithm. The inspected release computes negative quality-gated **log likelihood** (`agent/ppo.py`, lines 1097–1102), with the constructor summing per-action log probabilities. The note reports this difference instead of silently treating the two objectives as identical or attributing the printed probability objective to the released implementation.

## Reproducibility

- **Full text:** Freshly read the user-provided sixteen-page final IEEE issue PDF and all four supplied appendix pages. The latter actually contain **Appendices A–F**, including formulations, complete algorithms, hyperparameters, significance tests and full benchmark tables. Their draft header says 2023 and pagination is 16–19; NCS-specific algorithm numbering, references and benchmark summaries correspond to the formal main text. This provenance is recorded without claiming the file is byte-identical to an IEEE-hosted attachment.
- **Metadata:** The formal first page gives acceptance **18 August 2024**, publication **3 September 2024**, and current-version date 5 November 2024. Affiliations are Nankai University, National University of Singapore, Singapore Management University and The Chinese University of Hong Kong, Shenzhen. An unsupported 2023 public date and the previous NTU-only affiliation have been corrected. N2S's IJCAI 2022 precursor is a distinct explicitly cited work, not an automatic self-citation edge to this expanded journal article.
- **Official code:** [dtkon/PDP-NCS](https://github.com/dtkon/PDP-NCS), branch `master`, contains both constructor and improvement code, with `--shared_critic` selecting NCS. The 24-member archive was inventoried, with no additional PDF, notebook, nested archive or video. README, relevant constructor and imitation routines and inference instructions were inspected; model/data downloads are linked separately. No training or benchmark run was reproduced.
- **Figure/relations:** Original Figure 1 is cropped from PDF page 2 with its complete training/inference diagram and caption. All ten main tables, method figures and appendix pages were rendered and checked. 20 exact references match existing repository entries; speculative architectural similarity and the distinct IJCAI precursor do not create extra edges.
