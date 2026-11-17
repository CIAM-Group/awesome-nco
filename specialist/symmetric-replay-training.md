---
id: symmetric-replay-training
short_title: SRT
title: 'Symmetric Replay Training: Enhancing Sample Efficiency in Deep Reinforcement Learning for Combinatorial Optimization'
authors:
- Hyeonah Kim
- Minsu Kim
- Sungsoo Ahn
- Jinkyoo Park
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/kim24o.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/kim24o.html
institutions:
- KAIST
- POSTECH
- Omelet
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Scheduling
- Constrained Design
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Asymmetric Traveling Salesman Problem
- Flexible Flow Shop Scheduling
- Decoupling Capacitor Placement
- Molecular Optimization
summary: An auxiliary likelihood replay objective reuses valid equivalent construction trajectories to improve reward-call efficiency of separately trained policies; benefits depend on task, representation, replay budget and implementation.
code_url: https://github.com/kaist-silab/symmetric_replay
figure:
  path: paper-assets/symmetric-replay-training/framework.png
  alt: Reward-maximizing policy updates discover successful objects, and symmetric likelihood replay explores equivalent construction trajectories without requiring a new object reward.
  caption: 'Figure 1: Alternating reward-maximizing learning and symmetric replay.'
  source_url: https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=2
---
# Symmetric Replay Training: Enhancing Sample Efficiency in Deep Reinforcement Learning for Combinatorial Optimization

> **TL;DR:** Alternate ordinary RL with likelihood training on equivalent trajectories of successful solutions. SRT reduces the need for new expensive reward evaluations in several constructive policies, including hardware and molecular optimization. It adds neural computation, does not improve every molecular oracle, and the visible release has material differences from the paper's idealized replay procedure.

## Motivation

Many action sequences encode the same terminal combinatorial object. Evaluating a hardware simulator or molecular scoring function repeatedly can be expensive, while training on a new encoding of an already scored object can reuse its reward. The paper separates reward-seeking interaction from an auxiliary imitation step that explores the object's equivalent trajectory space. This is most useful when oracle cost dominates the extra neural replay, rather than when ordinary Euclidean tour length is cheap. [Sections1-3.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=3)

## Contributions

- A replay likelihood objective that can augment on-policy and off-policy constructive DRL without replacing the base architecture or its RL objective.
- Uniform, adversarial minimum-likelihood and inverse-policy-weighted transformation strategies.
- An entropy decomposition explaining conditional exploration within a fixed solution's trajectory class.
- TSP50/100, CVRP50/100, ATSP50/100 and flexible-flow-shop experiments, plus two decap-placement environments and23 molecular oracles under reward-call budgets. These are separate task policies, not one shared cross-domain checkpoint. [Sections4-5/AppendicesA-D.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=5)

## Methodology

### Two different update objectives

StepA uses an existing episodic RL method to generate and reward complete feasible solutions. StepB collects successful examples, obtains alternative valid trajectories of those objects, and minimizes **negative trajectory log likelihood**, scaled by alpha. Collection depends on the task: greedy rollouts for TSP, above-average sampled solutions for hardware, and prioritized/top-k buffer entries for molecules. Greedy rollouts are assumed to be useful rather than individually certified high reward. [Algorithm1/AppendixC.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=16)

The auxiliary objective needs no RL importance ratio because it is an imitation objective under the chosen replay distribution. This does **not** make it an unbiased on-policy policy-gradient estimator; the overall training objective has changed. Algorithm1's displayed loss/update sign convention is ambiguous, while Equation1 and the inspected implemented negative-log-likelihood update specify the intended maximization of replay likelihood.

Uniform sampling over an object's valid trajectory class is the default conceptual transformation. Adversarial replay chooses the lowest-policy-likelihood equivalent sequence; the weighted alternative samples in proportion to policy likelihood raised to negative beta. Beta=0 gives uniform replay and large beta concentrates on the least likely sequences. With ties it concentrates on the minimizing set, not necessarily a single trajectory as the simplified proof notation suggests. Enumerating these alternatives requires additional policy evaluations, although no new object rewards. [Section4.2/AppendixA.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=14)

### Which transformations preserve the object?

For symmetric Euclidean TSP, cyclic shifts and reversal encode the same tour. CVRP can reorder depot-separated vehicle routes and reverse an individual symmetric-distance route, provided its constraints remain valid. ATSP permits cyclic shifts but **not arbitrary tour reversal**. Decap placement reorders the sequence of selecting the same placed capacitors; it is not an assumption that rotating a physical PDN preserves its objective. Molecular replay uses alternative graph/string constructions. The validity and reward invariance of each representation must be established for the actual task.

The released FFSP path relabels the machine axis of processing-time matrices and uses guided job replay; arbitrary job permutation is not a valid generic schedule symmetry. It also uses suffix likelihood after dropping an initial prefix. This task-specific implementation should not be replaced by an invented general schedule transformation.

### Scope of the entropy argument

Theorem4.1 is the chain rule: trajectory entropy equals terminal-object entropy plus expected conditional trajectory entropy. For a **fixed object marginal**, replacing each conditional distribution with a uniform one maximizes that conditional entropy. The theorem does not show that a finite neural MLE update preserves the object marginal, increases total entropy at every step, improves reward monotonically, or explores new objects outside the existing orbit. Those gains are evaluated empirically. [Complete proof, AppendixA.1.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=14)

SRT remains **specialist / constructive**: it trains policies that generate new complete solutions, with no proposed neural incumbent-edit operator. Reusing a terminal solution as an imitation target does not change this. TSP/CVRP/ATSP/FFSP, hardware environments and molecular objectives have separate models/training runs.

## Experiments

### Synthetic reward-limited studies

TSP uses the Attention Model with actor-critic, greedy-rollout policy gradient, PPO or a GFlowNet. The primary TSP50 budget is2 million reward calls, with four independent training seeds and average validation costs/standard deviations. Batch size is100 and each epoch contains10,000 instances. At2M calls:

| Base method | Baseline cost | With SRT |
| --- | --- | --- |
| Actor-critic |6.129±.021 |6.038±.005 |
| PG-rollout |6.226±.026 |6.131±.019 |
| PPO |6.319±.110 |6.249±.045 |
| GFlowNet |6.195±.010 |6.167±.013 |

These measure learning under artificially limited reward evaluations, not optimality gaps or the strongest unrestricted TSP inference protocol. TSP alpha values are.001/.001/.00001/.1 and transformation widths1/1/5/10 for the four bases. PPO clipping/inner loops and GFlowNet reward temperature/loops are separately tuned. [Tables1/4-6.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=18)

AppendixD.7 adds TSP/CVRP50/100 and non-Euclidean ATSP/FFSP50/100 at200k/2M calls. TSP uses AM-critic, CVRP uses Sym-NCO with reduced augmentation, and ATSP/FFSP use MatNet-Sampled with matched starts. At2M, TSP100 improves8.917 to8.573; CVRP100 improves18.630 to18.304; ATSP100 improves2.915 to2.513. FFSP100's difference is smaller,94.978±.055 to94.934±.051, and is not an independently established large effect. [Tables12-13.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=25)

### Hardware: reward cost versus replay overhead

Decap placement optimizes power-integrity simulation on chip-package and HBM PDNs. The DevFormer architecture is trained with the same four RL bases,15,000 reward calls and four independent runs. SRT permutes placement order and collects above-average online examples. The batch is100, epoch size600; alpha is.01 for the three policy-gradient bases and.1 for GFlowNet. [Section5.2/AppendixC.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=7)

On chip-package PDN, A2C reward rises9.772 to12.757 and GFlowNet9.740 to12.784; on HBM the latter rises25.845 to26.469. Table9 compares whole-training wall time for15k evaluations. A2C chip-package changes4,204.50 to4,265.25, GFlowNet3,528.75 to3,528.25, while PPO changes3,884.25 to4,700.00, about21% overhead. Thus additional computation can be small relative to simulation, but is not universally negligible. The table does not itself specify a unit/hardware sufficient to extrapolate these numbers to another setup. [Tables2/9.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=21)

### Molecular optimization: average gains with exceptions

PMO has23 scoring oracles and a10,000-call limit, with five independent runs. The principal metric is area under the curve of average top-ten distinct-molecule score. These are computational proxy objectives, not wet-lab validation or demonstrated drug safety; QED is a drug-likeness proxy. SELFIES is the main string representation for REINVENT, while the graph GFlowNet uses its own constructive model. Replay uses24 REINVENT buffer entries/alpha.001 and64 GFlowNet examples/alpha1. [Section5.3/AppendixC.3.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=8)

Mean AUC rises.431 to.489 for GFlowNet and.615 to.632 for REINVENT-SELFIES. Several individual tasks worsen: GFlowNet oracle#6 changes.700 to.688 and#7 .666 to.657; REINVENT#3 changes.603 to.590 and#8 .940 to.924. Oracle#22 is zero throughout. The prose reports12 improved GFlowNet oracles, while direct comparison of the rounded Table3 values gives a slightly different count; no reconciled exact win count is asserted here.

AppendixD.5 reports **one-tailed** t-tests over five-run aggregate scores, with p=.0045 for REINVENT and.0015 for GFlowNet. These support the stated aggregate test, not significance on every oracle. The REINVENT mean there is.633 rather than main Table3's.632. The separate SMILES study reports16/23 improvements, but its average is only.660 to.661 and several tasks worsen, including valsartan-SMARTS. GraphGA's mean is.616 and GPBO's.609; neither is uniformly beaten on every objective. [Tables3/10-11.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=23)

### Replay ablations

On TSP50, symmetric replay remains useful up to16 tested loops while repeated identical-trajectory replay degrades beyond eight. Wider symmetric batches similarly outperform duplicate examples in the tested range. Minimum-likelihood adversarial selection performs well but requires enumerating/scoring alternatives. The experience-replay and direct augmented-RL comparators have higher variance or worse results in these particular implementations; that does not prove all alternative replay/augmentation algorithms inferior. [Figures4-5/8-10.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=19)

## Limitations

### Discussed in the Paper

Extra replay is worthwhile when reward evaluation dominates its cost. Symmetry availability and access to equivalent trajectories constrain adversarial variants, and replay ratio/sample width need tuning. The paper focuses on constructive DRL sample efficiency, rather than evaluating incumbent-improvement methods. [Sections4-6/AppendixE.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/kim24o/kim24o.pdf#page=26)

### Curator Notes

- Valid terminal-object symmetries and reward invariance are prerequisites; trajectory changes that alter a molecule, schedule or constrained route cannot safely reuse its score.
- Conditional entropy bounds are not optimization/convergence guarantees. Separate auxiliary MLE avoids importance weights by using a different objective.
- Seed statistics exist, but aggregate one-sided molecular tests do not imply universal per-task improvement. Several oracle losses and tiny SMILES/FFSP differences matter.
- Reward-call efficiency, rollout cost, gradient updates and end-to-end runtime are separate budgets. A “free” symmetry does not mean free computation.
- The visible release contains material replay differences described below; published result tables are not treated as independently reproduced benchmarks.

## Reproducibility

- **Full reading:** all27 PMLR pages, complete references and scientific AppendicesA-E. All13 tables and12 figures were read, including full molecular rows/proofs; framework, all training/ablation curves, statistical/budget tables and non-Euclidean results were visually inspected.
- **Metadata:** four authors and KAIST/POSTECH/OMELET affiliations checked; the PMLR HTML explicitly supplies publication8July2024, matching the retained date. No unsupported exact first-preprint/acceptance day is invented.
- **Scientific inventory:** actual PMLR page links the complete PDF and OpenReview, with no separate supplement. OpenReview API returns403, disclosed without claiming access. The2,613-entry author tree includes bundled upstream assets: a DOG-Gen poster titled *Barking up the right tree*, dataset archives, AM visualization notebooks and duplicated demonstrations. The poster title and notebooks were inspected to distinguish them from additional SRT science; the two unique notebooks are duplicated byte-for-byte in the hardware subtree. No unseen upstream baseline paper is claimed as fully read.
- **Code read:** selected complete SRT transformation/loss functions and surrounding TSP/hardware/ATSP/FFSP/REINVENT/GFlowNet training paths, README and configurations. The REINVENT replay branch applies an explicit optimizer step; the visible molecular GFlowNet SRT branch calls backward but has no subsequent optimizer step before the next base update clears gradients. This path does not apply its computed auxiliary gradient as written.
- **Other release differences:** ATSP computes a shifted `sym_action` but returns the original action. Euclidean TSP's nominal uniform sampler excludes zero shift, and its minimum-likelihood enumeration is hard-coded for50-node tours. The default TSP replay path calls the likelihood diagnostic with the optional original action, which can be None, so the shown README/default path requires review before being called runnable. Some synthetic greedy calls still compute cheap tour length, whereas the hardware helper explicitly requests reward-free decoding. Budget claims therefore refer to the intended expensive-oracle protocol, not an assertion that every release function avoids all arithmetic objective evaluation.
- **Molecular representation boundary:** the inspected SELFIES helper uses `isomericSmiles=False`; it cannot guarantee stereochemical identity for arbitrary stereosensitive oracles. Its default configuration uses deterministic canonicalization (`do_random=False`), not exact uniform sampling of all molecular encodings. FFSP uses machine relabeling/guided suffix replay. These implementation choices are disclosed without rerunning or changing upstream code.
- **Figure:** original complete Figure1/page2 cropped from the formal PMLR PDF. No full simulator training or benchmark rerun was performed.
