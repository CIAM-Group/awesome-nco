---
id: pomo
short_title: POMO
title: 'POMO: Policy Optimization with Multiple Optima for Reinforcement Learning'
authors:
- Yeong-Dae Kwon
- Jinho Choo
- Byoungjip Kim
- Iljoo Yoon
- Youngjune Gwon
- Seungjai Min
year: 2020
date: 2020-10-30
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2020/hash/f231f2107df69eab0a3862d50018a9b2-Abstract.html
arxiv_url: https://arxiv.org/abs/2010.16011
code_url: https://github.com/yd-kwon/POMO
institutions:
- Samsung SDS
figure:
  path: paper-assets/pomo/framework.png
  alt: POMO comparison between one start-token rollout and parallel rollouts from multiple starting nodes.
  caption: 'Figure 2: Single-trajectory decoding and POMO multi-start parallel trajectories.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/file/f231f2107df69eab0a3862d50018a9b2-Paper.pdf
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- 0-1 Knapsack Problem
summary: Forced multiple starts, a shared mean-return baseline and augmented greedy inference improve separately
  trained attention policies for TSP, CVRP and knapsack.
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper/2020/hash/f231f2107df69eab0a3862d50018a9b2-Abstract.html
---

# POMO: Policy Optimization with Multiple Optima for Reinforcement Learning

> **TL;DR:** POMO forces different first choices, trains their conditional trajectories against a shared mean-return baseline, and selects the best of parallel greedy rollouts. Its experiments cover TSP, CVRP and 0-1 knapsack, with separate problem-specific models.

## Motivation

A cyclic TSP tour has many sequence representations: shifting its first node changes the sequence without changing the physical tour. Conventional autoregressive training nevertheless learns a first-node decision, which can concentrate exploration on particular representations. POMO uses this symmetry to diversify rollouts and obtain an inexpensive instance-specific baseline. The symmetry argument concerns representations of a solution; it does not establish that every instance has several distinct optimal tours.

## Contributions

- Forced, different starting choices generate a group of conditional trajectories for the same instance, instead of repeatedly sampling the first action from a learned START token.
- The group's mean return supplies a shared REINFORCE baseline without a separately trained critic or a separate frozen-policy rollout.
- Best-of-group greedy inference combines with objective-preserving instance transformations. Routing experiments use eight square-coordinate symmetries; knapsack uses multiple starts without this augmentation.

## Methodology

For each instance, select `N` first nodes and sample one trajectory `τᶦ` from each start. With `b(s) = (1/N) Σⱼ R(τʲ)`, the update averages `(R(τᶦ) − b(s)) ∇θ log pθ(τᶦ | s)` over the group. The policy likelihood begins at the second decision because the first is prescribed. Routing rewards are negative length; knapsack rewards are selected value. The within-group advantages sum to zero. The paper motivates more stable exploration empirically; it does not prove global convergence or give a general optimality guarantee.

The implementation adapts Kool et al.'s Attention Model. A shared encoder is evaluated once per instance, while stacked decoder queries evaluate the starts in parallel. **The supplementary implementation uses six encoder layers**, 128-dimensional embeddings, eight attention heads and 512-dimensional feed-forward layers. This differs from the three-layer encoder in the original Attention Model paper.

For TSP, every node is a valid first node of a cyclic representation. For CVRP, the depot remains the fixed first node and the forced choice is the **first customer**. Trajectories that finish early remain at the depot with probability one until the group finishes; these padded actions add neither distance nor policy gradient. For knapsack, item weight and value replace coordinates, selected or non-fitting items are masked, and zero-weight/zero-value dummy items pad unequal trajectory lengths. The episode ends when no remaining item fits. Unlike cyclic TSP, not every forced first customer or item can begin an optimum; the paper explicitly acknowledges this limitation and leaves learned start selection for future work.

At inference, return the best of `N` greedy trajectories. Eight routing transformations increase this to `8N` candidates: TSP100 therefore evaluates 800 trajectories in the strongest reported configuration. The supplement discusses further transformations, but these proposals should not be confused with the transformations actually benchmarked.

## Experiments

Training uses batches of 64 instances, Adam with learning rate `1e-4` and weight decay `1e-6`, and 100,000 fresh instances per epoch. TSP100 takes about seven minutes per epoch on a Titan RTX. Runs extend to 2,000 epochs, while the authors report most improvement within roughly 200. Multiple starts mean more sampled trajectories per instance than a single-rollout baseline, despite efficient parallel execution.

Reported inference times below are for **the complete 10,000-instance test set**, not one instance. Routing gaps use the reference specified in the paper; CVRP's LKH3 reference is not a certificate of optimality.

| Test | Configuration | Mean objective | Reported gap | Total inference time |
| --- | --- | ---: | ---: | ---: |
| TSP100 | Reimplemented AM, greedy | 8.03 | 3.51% | 2 s |
| TSP100 | POMO-trained, one trajectory | 7.84 | 1.07% | 2 s |
| TSP100 | POMO, no augmentation | 7.80 | 0.46% | 11 s |
| TSP100 | POMO, eight augmentations | 7.77 | 0.14% | 1 min |
| CVRP100 | POMO-trained, one trajectory | 16.15 | 3.00% | 3 s |
| CVRP100 | POMO, no augmentation | 15.83 | 0.98% | 19 s |
| CVRP100 | POMO, eight augmentations | 15.73 | 0.32% | 2 min |

TSP100's Concorde reference is 7.76; CVRP100's LKH3 reference is 15.68. Tables 2–3 also compare classical heuristics, other constructive policies and improvement methods. Some comparison values come from other instance sets: the authors adjust certain TSP path lengths using reported gaps and avoid assigning cross-dataset CVRP gaps. In particular, L2I's reported CVRP100 length of 15.57 is not a same-instance result proving a POMO ranking.

Knapsack experiments use 50, 100 and 200 items, uniformly sampled weights/values, and capacities 12.5, 25 and 25. For KP200, dynamic programming gives mean value 57.605; POMO without augmentation reaches 57.597, versus 57.345 in single-trajectory mode. The reported **0.008 gap is an absolute objective difference**, not 0.008%. Corresponding POMO differences for KP50 and KP100 are 0.007 and 0.006.

The single-trajectory control helps distinguish training benefits from multi-start inference. Supplement A additionally applies augmentation to an AM model trained without POMO: TSP100's eight-augmentation result is 7.89, a 1.67% gap. This supports treating augmentation and POMO training as separable components.

## Limitations

### Reported by the Authors

- For CVRP and knapsack, some forced starts cannot lead to an optimum; the evaluated method nevertheless uses all starts.
- Knapsack has no corresponding geometric augmentation in these experiments.
- General-purpose training and augmentation may benefit from problem-specific improvements or better start selection.

### Curator Notes

- Reusing an architecture and training procedure across three problems does not demonstrate one jointly trained solver checkpoint. The entry remains a specialist constructive method.
- Supplement E changes the comparison AM implementation: six encoder layers, batch size 256, longer training, unconditional baseline-network replacement after each epoch rather than a significance test, and a late learning-rate decay. The comparison is therefore not a pure one-variable substitution into the original AM training pipeline.
- Best-of-group and augmented inference consume larger candidate budgets than a single greedy trajectory. Parallel wall-clock speed and total search effort are different measures.
- The results concern the specified synthetic distributions and sizes. They do not establish robustness to arbitrary constraints, industrial distributions or much larger instances.

## Reproducibility

- **Official implementation:** [yd-kwon/POMO](https://github.com/yd-kwon/POMO), linked in the main paper's page-7 footnote. The repository identifies `OLD_ipynb_ver` as the original 2020 code and `NEW_py_ver` as a 2021 restructuring; choose the appropriate version for comparisons.
- **Models:** The paper states that trained models and evaluation code for each problem are shared. This review checks source availability, not successful execution or numerical reproduction.
- **Reviewed sources:** The NeurIPS 2020 publisher paper, all 11 pages, and its separate four-page supplement. Formulae, tables, Figure 2 and the supplementary implementation details were cross-checked visually.
- **Reading map:** Sections 3–4 explain representation symmetry, grouped policy gradients and inference; Section 5 contains all three tasks; Supplement B–D defines task implementations and Supplement E discloses AM baseline changes.

- **Review ledger:** [Page coverage, source locators and explicit outgoing citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/pomo.json).
