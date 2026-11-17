---
id: packing-configuration-tree
short_title: PCT
title: Learning Efficient Online 3D Bin Packing on Packing Configuration Trees
authors:
- Hang Zhao
- Yang Yu
- Kai Xu
year: 2022
date: '2022'
publication:
  date: '2022'
  source_url: https://openreview.net/forum?id=bfuGjlCwAq
venue: ICLR
paper_url: https://openreview.net/forum?id=bfuGjlCwAq
institutions:
- National University of Defense Technology
- Nanjing University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Packing
problems:
- Online 3D Bin Packing
summary: ACKTR chooses feasible candidate leaves from a geometry-informed packing
  configuration representation; heuristic expansion supports discrete/continuous online
  3D packing and separately trained practical preferences.
code_url: https://github.com/alexfrom0815/Online-3D-BPP-PCT
---

# Learning Efficient Online 3D Bin Packing on Packing Configuration Trees

> **TL;DR:** Represent packed boxes and feasible placements together, learn attention-based priorities over heuristic-generated candidates, and place each arriving box immediately. Candidate generation and feasibility checks remain central; continuous coordinates do not mean an unrestricted continuous-action policy.

## Motivation

Online packing sees only the current arriving item and must place items in arrival order. Grid-based neural policies scale poorly with coordinate resolution and may omit information below the upper heightmap. The paper retains packed-item geometry and uses a finite set of promising feasible placements to support richer constraints without enumerating every coordinate.

## Contributions

A packing configuration tree (PCT) keeps packed items as internal nodes, candidate placements as leaves and the current item as another input. Corner-point, extreme-point, empty-maximal-space (EMS) and event-point (EV) rules generate candidates. Attention encodes their joint spatial information, while a pointer actor selects a candidate and ACKTR learns from packing rewards. Tests cover discrete and continuous sizes, distribution shifts, unseen items, practical preferences and a warehouse robot demonstration.

This is **specialist/constructive** online 3D packing. Different stability/orientation/density conditions and reward preferences are trained as packing settings; direct transfer is demonstrated for item distributions and scale, not one shared checkpoint across native combinatorial problems. Isle friendliness/load balancing add task-specific descriptors or rewards rather than a demonstrated universal model.

## Methodology

The experiment maximizes occupancy within one bin until the next item cannot be placed, rather than directly optimizing a complete multi-bin offline packing. Loading is vertical/top-down and boxes are axis-aligned. Packed-node descriptors contain size and position, placement leaves contain oriented size and location, and extra density/category attributes support the corresponding variants. Only candidates passing containment, non-overlap and applicable stability checks reach the policy. Heuristic expansion and optional leaf truncation restrict the searchable placements.

Three MLPs map heterogeneous nodes to 64-dimensional features. A single-head scaled dot-product attention block with residual/feed-forward transformations processes a fully connected node graph. Tree edges do not impose the attention connectivity; dummy padding is masked. The mean over valid embeddings forms a query for pointer attention over leaves, with tanh clipping constant 10. ACKTR uses a critic on the global context. The standard successful-placement reward is ten times the box/bin volume ratio, with gamma 1; category proximity or mass-variance penalties modify the reward for preferences.

Appendix A uses 64 parallel environments, 80 packed-node slots and 25 times the orientation count leaf slots during training. It recommends selecting test leaf capacity on validation data over 50–300 in increments of ten. The finite candidate policy supports real-valued geometry through geometric candidate rules, rather than sampling arbitrary coordinates from a continuous density. The continuous implementation rounds sampled dimensions to three decimals; stability-aware settings also draw heights from a five-value set.

## Experiments

**Three settings.** Setting 1 checks stability and permits two horizontal orientations; setting 2 permits all six axis-aligned orientations with containment/non-overlap; setting 3 adds random item density to setting 1. Tests use 2,000 instances and Gold 5117/TITAN V hardware. Table 1 reports discrete occupancy 76.0%, 86.0% and 75.7% for the best EV/EMS choices, versus the cited neural baseline's 70.9%, 70.3% and 59.6%. No single expansion scheme is best everywhere. The reported variances describe instance outcomes and should not be relabeled as uncertainty across independent training seeds.

**Continuous/OOD.** Table 3 reports best occupancy 65.4%, 66.3% and 66.6% across the three settings. Although x/y sizes are sampled continuously in [0.1, 0.5], settings 1/3 use heights from {0.1, 0.2, 0.3, 0.4, 0.5} to avoid unsupported-plane degeneracy. Table 4 directly transfers uniform-trained policies to truncated normal distributions; Appendix C additionally perturbs the probabilities of a 125-item set and trains on 100 items before testing on all 125. These are within-problem distribution/generalization tests.

**Preferences and scale.** Table 5 jointly reports occupancy and the preference-specific score, where lower score is better. In setting 1, the load-balancing model reports 73.7% occupancy/40.5 score versus 60.3%/88.0 for the baseline. A transferred setting-2 EMS policy packs an average 241.3 discrete small items at 81.3% occupancy, or 185.4 continuous items at 61.9%. These finite stress tests do not establish an asymptotic sublinear bound on leaf count or total neural computation.

**Cost and robot deployment.** Table 8 times placement decisions including candidate feasibility checking and environment interaction. Setting-2 EMS costs 0.00949 s per discrete item and 0.0236 s per continuous item; faster heuristics also exist. Appendix C.6 describes a STEP SR20E arm, conveyor and two RGB-D cameras, with Mask R-CNN monitoring packed-item drift and updating PCT coordinates. On 50 real sequences, a separately trained EV/load-balancing policy reports 78.6% occupancy and 50.9 packed items in a 110×90×80 cm bin. The text provides the measurement; the linked video was not obtained for independent viewing.

## Limitations

Heuristic candidates can omit feasible placements, and truncation offers no optimality guarantee. Feasibility comes from geometric/stability procedures, rather than neural attention alone. Practical constraints still require descriptors, prechecks and suitable training rewards. The study covers cuboids and a particular vertical-loading setup; irregular shapes are future work. Finite instance averages and qualitative robot demonstrations do not prove arbitrary physical robustness or universal performance.

### Curator Analysis

Appendix A Equation 9 prints a positive advantage-times-log-probability term as an actor loss within a summed loss. Minimizing that literal term would reverse the usual reward-maximizing policy direction. The inspected release instead explicitly minimizes the negative detached-advantage term in `train_tools.py`, consistent with reward maximization. A two-action automatic-gradient calculation records the opposite signs. This is a printed-loss versus implementation distinction, not a claim that the reported training used the reversed update.

Table 9 prints 0.095 s for the original setting-2 discrete EMS baseline, while Table 8 prints 0.00949 s for that condition. This note uses the explicitly labeled Table 8 comparison and retains the discrepancy rather than silently repairing either table. The observed growth of candidate count in two stress-test rows is an empirical observation, not a proved complexity law.

## Reproducibility

- All 18 formal ICLR 2022 pages were read, including complete references and integrated Appendices A–C. Eight key method, result, geometry, loss and robot pages were rendered and inspected. The file's registered SHA-256 is `c3a2e4b186aa8c3ec14ff91f5fca79c7a07cd9d59168eebafa48ffb44a3b45dc`.
- The [author repository](https://github.com/alexfrom0815/Online-3D-BPP-PCT), commit `5e7b4238b18310af4529e0f85157d17de605850c`, has 41 files and no scientific PDF/archive. Its README, complete encoder/actor/critic/training files, discrete/continuous environments and data settings were inspected. It links datasets and pretrained EMS models externally; those tensor/data downloads were not treated as read scientific appendices or executed.
- The formal text names a real-robot video supplement. OpenReview forum/API/attachment access returns verification/403; Bilibili returns 412. The author's YouTube page identifies the same 266-second robot demonstration, but actual video retrieval failed, and it was **not viewed** or counted as a read supplement. The complete scientific PDF appendices are available and read; the inaccessible video remains a disclosed qualitative-demo limitation.
- Formula gradients, file hashes, timing discrepancy and finite scale arithmetic are saved in `research/full-text-review/packing-configuration-tree/recompute_scope.py` and JSON. No network training or packing benchmark was rerun. Explicit citations support only the existing catalogue's Bello reinforcement-learning work and Pointer Networks; uncatalogued packing references are not invented as new relation IDs.
