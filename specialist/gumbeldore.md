---
id: gumbeldore
short_title: Gumbeldore
title: 'Self-Improvement for Neural Combinatorial Optimization: Sample without Replacement, but Improvement'
authors:
- Jonathan Pirnay
- Dominik G. Grimm
year: 2024
date: 2024-03-22
venue: TMLR
paper_url: https://openreview.net/forum?id=agT8ojoH0X
arxiv_url: https://arxiv.org/abs/2403.15180
code_url: https://github.com/grimmlab/gumbeldore
institutions:
- Technical University of Munich
- University of Applied Sciences Weihenstephan-Triesdorf
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Job Shop Scheduling
summary: Self-imitation trains constructive policies on their best sampled trajectories; round-wise stochastic beam search removes sampled sequences and adjusts cached trie logits by estimated advantages, with task-specific models and explicit sampling budgets.
publication:
  date: 2024-06
  source_url: https://openreview.net/forum?id=agT8ojoH0X
figure:
  path: paper-assets/gumbeldore/framework.png
  alt: Gumbeldore samples complete leaves, removes their probability mass and propagates their estimated advantage to update an augmented search trie.
  caption: 'Figure 2: a sampling round, advantage propagation and the resulting normalized trie.'
  source_url: https://arxiv.org/pdf/2403.15180v2#page=8
---
# Self-Improvement for Neural Combinatorial Optimization: Sample without Replacement, but Improvement

> **TL;DR:** Generate training instances, sample several complete solutions with the current best constructive policy, and imitate the best solution for each instance. **Gumbeldore (GD)** makes this sampling more effective through round-wise stochastic beam search, without-replacement mass removal, advantage-based updates of cached trie logits and a growing sampling nucleus. The theoretical improvement result concerns an exact conditional-advantage update; it is not a guarantee for the practical finite-sample procedure.

## Motivation

Supervised imitation of solver trajectories is simple but requires expensive labels. Policy-gradient training avoids labels but can be difficult and memory-intensive with large decoders. Self-imitation provides another route, provided the current model can cheaply produce sufficiently varied, useful pseudo-expert solutions. Repeated independent sampling can return duplicate or very similar trajectories, limiting the progress of self-training. [Sections1-3.](https://arxiv.org/pdf/2403.15180v2#page=2)

## Contributions

- A self-improvement loop that repeatedly samples solutions, chooses pseudo-expert trajectories and trains by next-action cross-entropy.
- A sampling mechanism combining incremental without-replacement stochastic beam search, advantage-based trie updates and a growing Top-p nucleus.
- A conditional-advantage policy-improvement proposition and a distinct practical global-advantage approximation.
- Experiments with BQ/LEHD routing networks and a new job/machine-attention scheduling network, plus a small illustrative Gomoku experiment. No single cross-problem checkpoint is presented. [Sections3-5/AppendicesA-E.](https://arxiv.org/pdf/2403.15180v2#page=4)

## Methodology

### Self-imitation training

Each epoch generates new random instances. The **best greedy-validation policy** samples multiple feasible trajectories for each instance; the highest objective trajectory becomes that instance's pseudo-label. Training samples partial sequences and minimizes the next-token negative log-probability. When validation greedy performance improves, replace the generation policy and clear the dataset; otherwise, keep the existing data and append the next epoch's instances. The loop starts from random network weights and does not need optimal training labels. Validation uses average objective values rather than optimality information. [Algorithm1.](https://arxiv.org/pdf/2403.15180v2#page=5)

The dataset does not simply retain one fixed set of incumbents throughout training. Nor is the method a reinforcement-learning reward-gradient update: objective values select pseudo-labels, and gradients then fit their actions by supervised imitation.

### Without-replacement sampling and trie updates

Stochastic Beam Search (SBS) uses Gumbel-Top-k perturbations to sample distinct complete sequences. An augmented trie caches visited partial states and their probability masses. After each sampling round, remove the selected complete sequences' masses from their ancestors so those exact sequences cannot be sampled again. Repeat for n rounds with beam width k to obtain up to k*n samples. Distinct action sequences need not represent distinct objective-equivalent tours/schedules, so “without replacement” does not remove all problem symmetries. [Section4.1/AppendixA.](https://arxiv.org/pdf/2403.15180v2#page=6)

GD additionally estimates expected objective using the normalized SBS importance-weighted estimator. This normalized version is **biased but consistent**, unlike the unnormalized unbiased estimator discussed alongside it. For each sampled trajectory, subtract the estimated global expectation from its outcome and propagate that advantage up its ancestors, scaled by a task-specific sigma. Subsequent draws renormalize the remaining trie masses plus these cached logit adjustments. This changes the **per-instance search distribution**, while the neural network weights remain fixed during sampling. [Equations3-6.](https://arxiv.org/pdf/2403.15180v2#page=7)

Across rounds, a Top-p threshold grows linearly from pmin to1. Training initially uses pmin=1, then .95 after a specified epoch. The authors found that values below .9 could cause premature convergence in training. This is an empirically chosen exploration/exploitation schedule rather than a universal setting. [Algorithm2.](https://arxiv.org/pdf/2403.15180v2#page=8)

### What is proved

AppendixB proves nondecreasing expected objective for a specific operation: along one selected trajectory, adjust each chosen-action logit using its **exact conditional expected return minus its parent's exact conditional return**, followed by normalization. A single-logit lemma and induction over sequence depth establish the claim. Positive sigma scales that exact advantage update.

The implemented update instead propagates a **sample-estimated global advantage**, removes sampled outcomes and may truncate the action distribution. Those changes do not satisfy the proposition's exact operation. Even the experimental “Theory GD” uses estimated conditional values from the sampled tree, not oracle exact expectations. The proposition motivates the method; it does not prove monotonic finite-sample returns, convergence of self-training or optimal solutions. [AppendicesB/C.1.](https://arxiv.org/pdf/2403.15180v2#page=20)

### Task-specific constructive networks

For TSP, the reimplemented BQ architecture uses9 transformer layers, width128,8 heads, feed-forward width512 and ReZero normalization. For CVRP it uses width192 and12 heads. The CVRP policy chooses a customer either directly or via the depot, masking capacity-infeasible actions; inference considers the250 nearest customers. TSP/CVRP train on partial routes, with task-specific representations and geometric/route-order augmentation. [AppendicesD.2-D.3.](https://arxiv.org/pdf/2403.15180v2#page=25)

For JSSP, an action chooses an unfinished job, appending its next operation at the earliest time allowed by job and machine availability. The state comprises remaining operations, processing times and relative availability information. Three pairs of job-wise and machine-wise transformer layers alternate masked attention; sinusoidal positions and job-wise ALiBi encode within-job operation order. A final job-level transformer produces logits over the next available operation, for7 layers in total, width64,8 heads and feed-forward width256. [AppendixD.4/Figures5-6.](https://arxiv.org/pdf/2403.15180v2#page=28)

Classification remains **specialist / constructive**. The same training/sampling algorithm is applied to separate task networks and checkpoints. Sampling constructs new sequences; updating trie probabilities is not neural editing of an incumbent complete tour or schedule. The name “policy improvement” describes search-distribution adaptation, not a solution-improvement paradigm.

## Experiments

### Data and training budgets

Routing trains on100-node instances and evaluates100/200/500/1,000 nodes. The100-node test sets have10,000 instances; larger sets have128. TSP references come from Concorde; CVRP references are HGS solutions and are not universally certified optima. Supervised baselines use one million labeled100-node instances. SI generates1,000 instances per epoch and128 solutions per instance in4 rounds of beam32, then trains1,000 mini-batches of1,024 partial routes. TSP uses sigma=.3 and CVRP3; nucleus sampling starts after500 epochs. Reported training lasts approximately2,200 SI-GD epochs for TSP and2,700 for CVRP, versus4,500/1,300 for supervised baselines. These are not matched total training costs. [Section5.1.](https://arxiv.org/pdf/2403.15180v2#page=9)

An important distribution detail appears in AppendixD.3: **SI CVRP training samples vehicle capacities40-100**, while the standard100-node dataset uses capacity50. Test capacities are50/80/100/250. Thus the CVRP comparison is not simply the same fixed-capacity training distribution with a different optimizer. SI Adam starts at2e-4, versus1e-4 for supervised routing; gradients are described as clipped to unit norm. [AppendixD.](https://arxiv.org/pdf/2403.15180v2#page=26)

JSSP trains100 epochs, each sampling512 instances of a chosen size and128 schedules per instance;1,000 training batches contain512 partial schedules. The main text lists15x10/15x15/15x20, whereas AppendixD.4 prints10x15 for the first size. The released configuration supports **15x10**, agreeing with the main text. Sigma=.05 and pmin becomes.95 after50 epochs. Validation has100 instances of20x20; evaluation uses eight Taillard sizes up to100x20, with gaps relative to best-known upper bounds. [Sections5.2/AppendixD.4.](https://arxiv.org/pdf/2403.15180v2#page=11)

All experiments use two24GB RTX A5000 GPUs; data generation is spread over16 Ray workers. TSP sampling for1,000100-node instances with128 candidates each takes about one minute in the described setup, excluding the subsequent full supervised epoch. The paper does not give a complete matched wall-time/energy comparison of all training alternatives.

### Routing results and limits of parity

Table1 reports **total test-set solving time**, not per-instance latency. The primary evaluation of trained routing policies is greedy or deterministic beam16, which is separate from GD sampling used during training.

| Setting | BQ supervised | BQ SI without-replacement | BQ SI GD |
| --- | --- | --- | --- |
| TSP100, greedy |.40% |.44% |.41% |
| TSP1,000, greedy |1.72% |2.34% |2.11% |
| TSP1,000, beam16 |.91% |1.16% |1.01% |
| CVRP100, greedy |3.03% |3.93% |3.26% |
| CVRP1,000, greedy |5.30% |8.47% |8.33% |
| CVRP1,000, beam16 |2.49% |5.87% |5.57% |

GD generally improves the without-replacement self-imitation baseline and approaches supervised training on TSP, but **CVRP1,000 retains a substantial generalization deficit**. The authors discuss subtour utilization/order and unseen capacities as possible contributors. The evidence does not support uniform parity with expert-supervised policies across tasks/scales. For TSP1,000, the listed total times are32s greedy and10m beam16 over128 instances. [Table1.](https://arxiv.org/pdf/2403.15180v2#page=10)

The additional LEHD architecture experiment reports greedy gaps at100/200/500/1,000 of.40/.72/1.43/3.30% for SI GD, versus.58/.95/1.72/3.34% for supervised LEHD and1.07/1.45/2.56/4.52% for its original RL-plus-reconstruction training. These are **LEHD-specific results**, not replacements for the BQ rows above. [Table3.](https://arxiv.org/pdf/2403.15180v2#page=23)

### Scheduling and inference sampling

At15x15, SI-GD greedy gives9.6% gap, SBS16 with p=.8 gives6.0%, and GD32x4 with growing pmin=.8 gives5.0%. At100x20 the respective gaps are1.7/.7/.4%, with group solving times28s/1.5m/9m. Some deterministic beam16 results are worse than greedy, illustrating that probability ranking and solution quality are different. SI GD also does not improve SI WOR in every greedy cell: at30x20 the values are13.8% versus13.6%. The stronger CP-SAT reference usually produces smaller gaps under much larger time budgets, up to one hour per instance; this is not a claim to beat exact/classical search uniformly. [Table2.](https://arxiv.org/pdf/2403.15180v2#page=12)

GD sampling improves intermediate and late model checkpoints in the plotted low-sample experiments. Figure3 repeats sampling20 times and plots standard errors; Figure4 uses10 repetitions. These are **sampling repetitions**, not independent model-training seeds. Main stochastic JSSP evaluations use five repetitions.

AppendixC.3 uses **constant p=.8**, differing from the main growing-nucleus protocol. At CVRP1,000, GD64x8 yields4.76% and improves SBS64x8's5.80%, but deterministic beam512 is better at3.85%. GD is therefore not uniformly the best inference sampler even with the same512 candidate budget. For JSSP, the appendix's constant-nucleus GD32x4 gives4.8% at15x15, while the main growing-nucleus row is5.0%; the two protocols are not merged. [Tables4-5.](https://arxiv.org/pdf/2403.15180v2#page=24)

### Auxiliary Gomoku experiment

AppendixC.4 trains a separate9x9-board policy against one deterministic black bot, testing white from every black starting position. Each epoch samples320 games per position. Over ten repetitions, GD10x32 with sigma5 and no nucleus reaches greedy wins from all positions in47.7 epochs, versus60.2 with replacement. This is approximately20.8% fewer epochs, **not a measured wall-time speedup or a general self-play/game-playing benchmark**. Winner-action labels and game-outcome advantages differ from the routing/scheduling setup. [AppendixC.4.](https://arxiv.org/pdf/2403.15180v2#page=24)

## Limitations

### Discussed in the Paper

- Sigma must be tuned to each task; advantage magnitude changes throughout training, motivating adaptive scaling.
- Retaining a trie increases memory compared with one standalone SBS round, although cached network evaluations can save computation.
- CVRP scale/capacity generalization remains weaker than expert-supervised training. [Sections5.1/6.](https://arxiv.org/pdf/2403.15180v2#page=13)

### Curator Notes

- The exact policy-improvement proposition does not certify the implemented global-advantage, without-replacement, nucleus-truncated heuristic.
- A shared training algorithm is distinct from a shared trained solver; routing, scheduling and the auxiliary game use independent networks.
- Total group times depend on batching/parallel workers and cannot be read as single-instance latency. Training epochs and sample counts also differ across baselines.
- Capacity distributions, learning rates and current code defaults differ; exact reproduction requires a configuration matching the relevant table.
- Distinct trajectories can encode equivalent solutions, and improvement of best sampled objectives is not an optimality guarantee.

## Reproducibility

- **Full reading:** all30 pages of the actual arXivv2 dated2024-06-11 were freshly read, including AppendicesA-E, the complete improvement proof, all experiments/implementation details and the Gomoku toy. Trie diagrams, algorithms, proofs, sampling plots and job/machine network figures were visually inspected.
- **Publication/version:** the read manuscript explicitly carries the **TMLR06/2024** publication header; the arXiv journal reference confirms TMLR June2024 with Featured Certification. First submission2024-03-22 is retained. Publication uses month precision; no unsupported exact acceptance day is inferred. Both authors' affiliations are TUM Campus Straubing and the University of Applied Sciences Weihenstephan-Triesdorf; the prior German Cancer Research Center affiliation is removed.
- **Scientific supplements:** OpenReview returned a browser challenge and its API403, so no claim is made to have read inaccessible attachments. The obtained30-page publication-identified author manuscript contains complete AppendicesA-E and no explicit reference to an unavailable separate scientific attachment. The full99-entry official code tree contains no extra PDF/ZIP/TeX scientific file; its graphical abstract was also inspected.
- **Code:** [grimmlab/gumbeldore](https://github.com/grimmlab/gumbeldore), with data/checkpoints and `reproduce.py` for greedy evaluations. README/data documentation, all three task configurations and selected core sampling/data-generation functions were inspected. Actual mass removal, cumulative trie advantages, normalized importance estimator and growing nucleus match the described mechanism. Current defaults use CPU workers,100 routing epochs, no gradient clipping, pmin=1 and fixed CVRP capacity50, rather than every published training setting. The optional active-search flag is explicitly described as unused in the paper. No benchmark training or checkpoint evaluation was rerun.
- **Figure:** complete original Figure2/page8, directly cropped from the read manuscript, depicting the sampling/trie update rather than inventing a new framework image.
