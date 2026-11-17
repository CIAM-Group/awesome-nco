---
id: online-3d-bin-packing-with-constrained-deep-reinforcement-learning
short_title: Online 3D-BPP / BPP-1
title: Online 3D Bin Packing with Constrained Deep Reinforcement Learning
authors:
- Hang Zhao
- Qijin She
- Chenyang Zhu
- Yin Yang
- Kai Xu
year: 2021
date: '2020-06-26'
publication:
  date: '2021-05-18'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/16155
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/16155
institutions:
- National University of Defense Technology
- Clemson University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Packing
problems:
- Online 3D Bin Packing
summary: An ACKTR actor-critic constructs irreversible cuboid placements using height-map features and supervised
  feasibility prediction. A fixed policy also supports virtual lookahead search and critic-based bin selection;
  stability is a support-area surrogate and the learned mask is not a physical-safety guarantee.
arxiv_url: https://arxiv.org/abs/2006.14978
code_url: https://github.com/alexfrom0815/Online-3D-BPP-DRL
figure:
  path: paper-assets/online-3d-bin-packing-with-constrained-deep-reinforcement-learning/framework.png
  alt: A bin height map and next-item dimensions feed a CNN shared by actor, critic and feasibility predictor; mask
    supervision and probability penalties train placement actions.
  caption: 'Original Figure 2: height-map state, placement mask and prediction-and-projection actor-critic architecture.'
  source_url: https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=3
---

# Online 3D Bin Packing with Constrained Deep Reinforcement Learning

> **TL;DR:** A neural actor selects where to place the next cuboid, assisted by feasibility prediction. Placements are irreversible, making this **specialist/constructive**. Lookahead MCTS explores hypothetical future placements using fixed neural weights; it does not repair an existing complete packing. Different input distributions and orientation-specific models do not establish a joint checkpoint across native problems.

## Motivation

Practical packing may reveal only the next item or a short lookahead sequence. An arriving item must be packed immediately without buffering, changing its arrival order or moving previously packed boxes. The paper studies integer-sized, axis-aligned cuboids, incorporating collision/height limits and a simplified support criterion to favor stable stacks. It primarily maximizes packed volume in a fixed bin until the next item cannot be placed. [Problem scope.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=1)

## Contributions

- A compact height-map state and grid of front-left-bottom placement actions support online construction.
- A shared CNN and actor-critic learn placements with supervised mask prediction, infeasible-probability penalties and feasible-action exploration.
- Virtual permutation MCTS adds lookahead while preserving actual arrival order; critic-based bin selection and separately trained horizontal rotation extend the setting.
- Synthetic, algorithmic ablation, preliminary robot and human-app experiments evaluate quality and practical limitations. [Method overview.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=3)

## Methodology

### State, actions and physical assumptions

The bin bottom is an L×Winteger grid. A height map records the top surface at each cell; the next item's three dimensions are repeated into three additional channels. An action picks a grid cell for its front-left-bottom corner, with vertical position determined by the maximum height beneath its footprint. Once placed, the item remains fixed.

Feasibility includes available space and one of three support rules: more than60%bottom area plus all four corners supported; more than80%plus three corners; or more than95%area supported. These are conservative geometric heuristics chosen because mass distributions are unknown, not complete rigid-body or contact-dynamics tests. The main setting restricts every dimension to at most half the corresponding bin dimension.

Height maps also hide under-surface cavities: the supplement explicitly exhibits different packed volumes with the same surface map. The representation is therefore not a complete description of every physical packing configuration or an exact value-function sufficient statistic. [State and support rules.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=3) [Aliasing example.](https://arxiv.org/pdf/2006.14978v5#page=13)

### Learning and feasibility prediction

ACKTR trains an actor and critic around a five-layer CNN, alongside a mask-prediction head supervised by an environment-computed mask. Step reward is10times the successfully packed volume fraction; failure gives zero and ends the episode. The supplement sets discount1.

The composite objective contains actor/critic losses, mask MSE, total probability on infeasible actions and entropy over feasible actions, with weights1,0.5,0.5,0.01,0.01. Mask modulation is softened during training with a small nonzero factor, rather than an exact zero. Ground-truth masks are described as training supervision; the supplement says the inference penalty can even be omitted. Reported99.5%legitimate predicted placements is empirical accuracy, not100%feasibility or physical safety. [Architecture/loss.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=4) [Complete network specification.](https://arxiv.org/pdf/2006.14978v5#page=10)

The current release contains both caller-supplied environment-mask paths and a predicted-mask path. `Policy.act/evaluate_actions` use supplied `location_masks`; `evaluate_actions_indepen` uses the binarized prediction. Its categorical distribution applies a logit penalty14and probability floor, rather than literally multiplying probabilities by0.001. README explicitly notes that ground-truth masks can replace prediction for BPP-1, while prediction helps reduce MCTS cost. Thus one should identify the actual execution path when reproducing the paper.

### Lookahead and other packing settings

BPP-k reuses the trained BPP-1 actor to simulate virtual orders of visible items. If a future item is virtually placed before an earlier one, its footprint is blocked for the earlier item to prevent invalid support dependencies. Only the actual current item's action is committed, retaining arrival order. MCTS uses greedy actor placements, a maximum-return backup and a critic estimate at rollout termination. Exhaustive permutation search explores permutations under this placement policy, not all possible continuous or grid packings.

The published supplementary pseudocode also names `Last`, the first item after its lookahead list, for critic bootstrapping. That input convention should be specified when comparing lookahead budgets; it is not silently assumed to be unavailable or free. The paper does not give one universal simulation-count budget for every reported lookahead setting.

Multi-bin packing compares critic-value changes across bins using the single-bin network. Horizontal item rotation doubles the action/mask space and requires a rotation-trained network. These are related packing variants rather than evidence of a native-problem generalist. [Search and extensions.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=5) [Full algorithms.](https://arxiv.org/pdf/2006.14978v5#page=16)

## Experiments

### Data and cost

Main tests use10×10×10bins and64item types with dimension values2–5. RS samples types randomly. CUT-1/CUT-2 recursively cut a bin into items, then order by bottom height or supporting-item dependencies, respectively. These cutting constructions provide perfectly packable reference sequences, unlike random sequences with unknown optimum. There are2,000test sequences per benchmark.

Training at10×10resolution takes approximately16hours on a TitanV12GB / XeonGold5115 server with64GBsystem memory. BPP-1 decisions are below10ms; this should not be transferred to lookahead MCTS. The reported k20lookahead time is3.6seconds per item. The release README describes approximately one day to obtain a satisfactory model and requires its own configuration for exact replication. [Setup.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=5)

### Main comparison and ablations

| Method | RS utilization | CUT-1 utilization | CUT-2 utilization |
| --- | --- | --- | --- |
| Boundary heuristic |34.9%|41.2%|40.8%|
| Online BPH |35.4%|51.9%|49.2%|
| Offline LBP |54.7%|59.1%|59.5%|
| Neural BPP-1 |50.5%|73.4%|66.9%|

The neural method beats the listed online heuristics but loses to the offline comparator on RS. It is neither an exact solver nor uniformly best against every reference. Mask-prediction/modulation/entropy ablations support the combined design; on CUT-2 the full combination reaches66.9%, compared with7.82%when all three are absent.

More lookahead generally improves packing but eventually plateaus and is not strictly monotonic at every k. Allowing separately trained horizontal rotation raises RS50.5%to62.1%, an11.6percentage-point change, not11.6%relative improvement. With25bins, the multi-bin experiment reports77.8%utilization and45msdecision time per item, versus67.4%/2.2msin its single-bin comparison. [Tables1–3.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=5) [Full lookahead and orientation results.](https://arxiv.org/pdf/2006.14978v5#page=11)

### Generalization and supplementary controls

Training on40of64item types yields49.4%RSutilization when testing all64, versus50.5%when all types are trained. Cross-sequence transfer uses separate RS/CUT-1/CUT-2models: the CUT-2trained policy reaches47.6%on RS and69.4%on CUT-1, below their respective matched-training results50.5%and73.4%. Different distributions are not equivalent or uniformly solved by one best checkpoint.

The supplement evaluates20/30resolutions, a125-type set, boundary constraints and alternative DRL algorithms. With125types, utilization is46.3%/59.2%/58.3%for RS/CUT-1/CUT-2. ACKTR reaches66.9%on CUT-2 versus58.8%RAINBOW,53.0%A2C,44.2%SAC and35.3%DQN in that comparison; this does not establish general on-policy superiority.

Reward controls qualify the main claim: terminal-only reward is39.2%on RS versus50.5%step-wise, but adding missing occupancy information to the terminal-reward input restores50.3%. On CUT-1/CUT-2the difference is small. This supports a representation-dependent effect, not a universal theorem favoring dense rewards. [All supplementary controls.](https://arxiv.org/pdf/2006.14978v5#page=12)

### Robot and human studies

A preliminary robot test over50random sequences reports66.3%utilization, compared with39.2%boundary and43.2%BPH. The text does not provide a broad robot-failure evaluation or physical-safety certificate.

The app study has50users, including15palletizing workers, on CUT-2samples with no time limit and virtual placement previews. It reports mean68.9%for AI versus52.1%for humans over1,851games. Published win/draw counts1,339+406+98sum to1,843, leaving an eight-game discrepancy that is not resolved in the source. The result concerns this preliminary interface and participant/task selection, not a general human-level packing guarantee. [Study.](https://cdn.aaai.org/ojs/16155/16155-13-19649-1-2-20210518.pdf#page=7) [App protocol.](https://arxiv.org/pdf/2006.14978v5#page=11)

## Limitations

Grid discretization, rectangular geometry, fixed arrival order and heuristic support rules restrict applicability. Predicted masks and softened penalties cannot certify all actions; surface maps omit internal voids. Neither MCTS nor the learned policy has a demonstrated global optimality or approximation guarantee.

Quality depends on item-size/distribution training, orientation settings and search budget. Stronger lookahead and additional bins consume more computation. The robot and human studies are preliminary, lack broad controlled uncertainty analysis, and do not validate arbitrary materials, mass distributions or irregular objects. No experiment was independently rerun.

## Reproducibility

- Formal AAAI2021 DOI10.1609/aaai.v35i1.16155 spans741–749 and was published2021-05-18. Five authors list NUDT and Clemson; Hang Zhao/Qijin She are explicitly co-first authors and Kai Xu corresponds.
- All9formal pages and all16pages of arXiv2006.14978v5 were fully read, including references and scientific supplemental SectionsA–H with every additional table, figure and algorithm. Primary history records first submission2020-06-26 and v5on2022-01-13. Added material is attributed to the actual v5reading copy, not claimed to be part of the9-page formal file.
- Official repository commit581828685d780681dfa4805e1b8e3fa10223667b has115paths. Both full READMEs, dataset/checkpoint and scientific-attachment inventory, ordinary empty releases page and relevant mask/training/search code were inspected. No extra PDF/TeX/ZIP/notebook exists in that tree. Source includes the user app, multi-bin routines and MCTS; four released model files distinguish RS/CUT training and rotation. The linked videos are demonstrations, and no video-only numerical result is claimed as reviewed evidence here.
- The paper's explicit scientific supplement requests are satisfied by the fully read v5SectionsA–H, including architecture, simulator/search pseudocode, generation, baseline, human protocol, rewards and extra results. Current source paths and configuration differences are documented without claiming the original training was reconstructed.
- Original formal Figure2 is cropped from PDFpage3, rectangle(48,48,565,241), rendered4x and actually viewed. All formal diagrams/results and supplementary Figures9–19, Tables4–10 and Algorithms1–3 were rendered and visually inspected.
- Two internal edges have explicit body citations and matching references: Bello's1611.09940preprint and Pointer Networks. Distinct uncatalogued neural packing/reward papers are not mapped onto unrelated IDs.
