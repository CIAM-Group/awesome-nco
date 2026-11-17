---
id: dar
short_title: DAR
title: Distance-Aware Attention Reshaping for Enhancing Generalization of Neural Solvers
authors:
- Yang Wang
- Ya-Hui Jia
- Wei-Neng Chen
- Yi Mei
year: 2025
date: '2024-01-13'
acceptance:
  date: '2025-07-08'
  source_url: https://doi.org/10.1109/TNNLS.2025.3588209
venue: IEEE TNNLS
paper_url: https://doi.org/10.1109/TNNLS.2025.3588209
institutions:
- South China University of Technology
- Victoria University of Wellington
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Traveling Salesman Problem
- Asymmetric Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Vehicle Routing Problem with Time Windows
- Capacitated Arc Routing Problem
- 0-1 Knapsack Problem
summary: DAR adds fixed, task-specific proximity scores to constructive decoding logits during neural-solver training; the formal journal study covers six separately trained routing/knapsack settings and qualifies entropy-based generalization arguments.
publication:
  date: '2025-07-17'
  source_url: https://doi.org/10.1109/TNNLS.2025.3588209
arxiv_url: https://arxiv.org/abs/2401.06979
code_url: https://github.com/ftwangyang/DAR
figure:
  path: paper-assets/dar/framework.png
  alt: DAR combines neural decoding attention scores with fixed distance-derived expert scores before masking and softmax; the base solver is trained with this adjustment.
  caption: 'Figure 3: DAR inside the constructive solver''s decoding pipeline.'
  source_url: https://ieeexplore.ieee.org/ielx8/5962385/11195929/11083123.pdf#page=4
---
# Distance-Aware Attention Reshaping for Enhancing Generalization of Neural Solvers

> **TL;DR:** DAR combines learned decoder logits with a fixed proximity-based score to favor useful local choices. The **formal 2025 journal version trains the base solver with DAR**, rather than merely attaching it after training. It adds no trainable neural parameters, but still incurs ordinary solver training and distance computations. Six separately trained TSP/ATSP/CVRP/VRPTW/CARP/KP settings improve their tested backbones, with residual gaps, budget differences and conditional theoretical arguments.

## Motivation

An attention policy trained on small instances may assign high scores to many candidate nodes when node count or coordinate distribution changes. DAR calls this attention dispersion and adds explicit task knowledge to distinguish candidates. A preference for nearby nodes is useful for metric routing, while other tasks require a suitable analogous score. Lower uncertainty alone does not prove that the resulting decision or complete solution is better. [Sections 1/3.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=3)

## Contributions

- Identifies an empirical attention-dispersion pattern and analyzes attention entropy under stated assumptions.
- Adds a fixed distance-score transformation to neural decoder logits without new neural weights.
- Trains the underlying solver with this adjustment and tests transfer across instance sizes/distributions.
- The expanded formal paper includes six task settings and additional analyses beyond the 9-page, CVRP-focused 2024 preprint; the two versions must not be treated as interchangeable evidence for every claim. [Sections 3-4.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=4)

## Methodology

### Fixed proximity score inside decoding

For current node i and candidate j, obtain the learned attention score a(i,j) and a normalized distance-like quantity d(i,j). Among the K nearest candidates, set **b(i,j)=-ln d(i,j)**; for other candidates set **b(i,j)=-d(i,j)**. This changes logits rather than forbidding all distant candidates. Feasibility masks still handle visited nodes and task constraints. Combine scores as **a'=omega 1*a+omega 2*b**, apply 50*tanh(a'), mask and softmax. Default weights are **fixed 0.5/0.5**, with K 100; ATSP uses K 50. These are configured hyperparameters, not learned additional neural parameters. [Equations 10-14/31.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=4)

The journal explicitly places DAR **inside training**. REINFORCE trains the base network using multiple starting-node rollouts and their mean reward as baseline. The earlier preprint's statement about no additional training should not be used to claim that all formal results come from a frozen pretrained policy with a postprocessing patch. During evaluation, neural parameters stay fixed; the core method constructs routes/items autoregressively. [Algorithm 1 and Section 3.C.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=7)

### Task-specific meanings and taxonomy

- **TSP/CVRP:** normalized Euclidean distance inside POMO-style decoding.
- **ATSP:** matrix distances inside a separately trained MatNet implementation; the studied one-hot implementation limits size to 256.
- **VRPTW:** a separately trained POMO-style constrained routing model, using the task's masks and proximity adjustment.
- **CARP:** average distance between the four endpoint pairs of candidate service edges; the paper also replaces POMO's initial linear encoder with a graph-convolutional encoder.
- **KP:** reciprocal profit-to-weight ratio serves as the distance-like score, favoring profitable low-weight items. KP maximizes value; figure labels using the word cost do not change the objective.

These are **specialist, constructive** solvers. The shared scoring recipe does not establish shared trained weights across tasks, and the core method has no learned incumbent-editing stage. Optional RRC evaluation is a separate search setting. [Sections 4.A/4.C.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=10)

### Scope of the theory

Proposition 1 bounds attention entropy assuming logits stay in a bounded range whose width is independent of problem size. Proposition 2 assumes probability mass moves toward already-higher-probability choices and uses a small-perturbation expansion. The paper motivates that ordering with **81.39%** empirical distance/logit pair agreement, which is not universal agreement. Proposition 3 uses an idealized uniform-spacing calculation to compare inverse-distance, negative-distance and negative-log-distance transforms; the text itself notes that final tanh clipping changes the asymptotic analysis. [Propositions 1-3/Equations 3-31.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=4)

These arguments should be read with their assumptions. They do not prove that every DAR update decreases entropy, that nearer choices are always optimal under constraints, or that every complete tour improves. The reported two-neighbor asymptotic comparison is not an optimality certificate or a uniform theorem for all six tasks.

## Experiments

### Training, data and inference settings

For symmetric TSP/CVRP, the paper trains at 100 nodes for up to **200000 steps**, then adds **25000 steps with sizes 100-500**. Thus large-instance testing is not solely transfer from a 100-node-only model. All experiments report an **RTX 3090 24 GB/PyTorch 1.13** environment. Other task schedules refer to their backbones. CARP uses 128000 training instances and 100 test cases, degree 1-5, edge cost/demand 1-10 and capacity 100. [Section 4.A.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=8)

Main comparisons use greedy decoding without extra search, but greedy can include multiple starting trajectories. The inspected official VRPLib tester uses **min(n,1000)starts**, freezes neural parameters and selects the best rollout; its current CVRP config has **eight augmentations**, while TSP config has one. Both current configs list 250000 training steps rather than the paper's 225000 total. These are code-version/default differences, not grounds to silently assign the augmented budget to every main-paper row. Reported timing must retain its associated test count and hardware; copied CPU classical runtimes are not hardware-matched latency comparisons.

### TSPLIB, CVRPLIB and remaining failures

Table I evaluates 49 TSPLIB 50-1000 cases and 100 CVRPLIB Set-X cases. Formal table gaps are:

| Method | TSPLIB gap | Set-X gap |
| --- | --- | --- |
| POMO |7.45% |10.37% |
| LEHD |2.53% |12.25% |
| ELG |4.60% |6.03% |
| DAR |3.69% |5.66% |

DAR improves its backbone and is the best listed neural Set-X result, while **LEHD is better on TSPLIB**. Classical LKH/HGS references are stronger at these budgets. Some prose retains older ELG/POMO numbers; this note follows the formal table rather than mixing versions. [Table I.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=8)

On six 3000-11000-node Set-XXL cases, DAR has **10.82%** mean BKS  gap, versus greedy 13.08%, POMO 30.85%, ELG 16.08% and GLOP 19.75%. DAR costs 7-90 seconds per displayed case, averaging 42 seconds, versus POMO 41 seconds. Greedy/GLOP are faster at 10/4 seconds but worse in mean quality. Large residual errors remain: **Leuven 2 16.06%**, Ghent 2 14.79%. A better quality/time tradeoff against selected neural rows is not superiority over an exact optimum. [Table II/Figure 7.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=9)

The 35 Set-XML rows were individually checked. DAR improves most larger cases but loses several small ones: XML 100_1113 has 5.24% versus ELG 1.61%, and XML 500_1215 has 7.86% versus Omni 4.08%. XML 4000_2153 improves to 4.76%, while some baselines exceed 50%gap; a large gap alone is not evidence of an infeasible solution. Table XI reports 5.20%Set-XML average. [TablesIX/XI.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=12)

Table VII's 1000-instance cross-distribution tests also have exceptions. At 300 nodes, Omni-VRP beats DAR on both CVRP distributions and on rotated TSP. At 1000 nodes, DAR is better among listed neural rows, but still has **11.68%TSP/10.66%CVRP explosion gaps**. Absolute gaps can grow with scale despite improved relative performance. [Table VII.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=11)

### Extended task results

| Setting | Backbone result | DAR result | Interpretation |
| --- | --- | --- | --- |
| ATSP 200,train 50,1000 cases |MatNet 5.039 cost/22 s |2.477/23 s |Large backbone gain; no certified reference shown |
| VRPTW 1000,100 cases |281.55 cost/19.44 s |212.79/20.40 s |24.4%cost reduction under the reported setup |
| CARP V 500 E 1000,100 cases |16029 cost/5.34 s |9874/6.03 s |38.4%cost reduction; additional computation |
| KP 1000,100 cases |266.15 value |287.98 value |Higher value, not a cost minimization result |

Times are the table's reported values, kept with the corresponding case counts. CARP's first table column is **V 50 E 100**, despite nearby prose calling it V 50 E 200. The extended experiments compare a small number of backbone variants; they do not establish state of the art against all classical/task-specific solvers. [TablesIII-V/Figure 8.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=10)

On 10000 uniform 100-node instances, TableX reports **.11%TSP/2.36%CVRP** LKH-reference gaps, best among the listed rows; the CVRP improvement over ELG 2.38% is small. These results use a separate in-distribution training/testing setup, not every previous benchmark protocol. [TableX.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=13)

### Ablations and data-quality qualifications

On Set-X, -ln(d) has 5.66%mean  gap, versus -d 6.48% and 1/d 7.52%; inverse distance is nevertheless better in the smallest bin. Increasing K helps many tasks, but larger K can hurt VRPTW. Fixed weights 0.5/0.5 are strongest in the displayed sensitivity table; the distance/attention balance is still a tuned design choice. [TablesVI/XI/XII and Figure 9.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=13)

Optional **RRC 100** and **eightfold augmentation** improve 128-case results at additional, separately specified budgets: CVRP 1000 gap 7.275%greedy becomes 6.995%with RRC and 6.271%with augmentation. These settings do not redefine the core method's constructive taxonomy. [Table VIII.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=11)

The formal article contains transcription/protocol issues worth preserving. Table II prints GLOP's Leuven 1 cost as **824539** alongside 16.9% gap, inconsistent with BKS 192848; the earlier preprint prints 225439. Table I's ELG 6.03%conflicts with 5.92%in prose. Table II reports Wilcoxon p-values below 0.01, but does not identify a sampling unit/replicate count sufficient to reproduce them from the six displayed case pairs; an exact two-sided signed-rank test on six all-improved pairs alone has p=.03125. The note therefore does not treat those printed p-values as independently verified significance.

## Limitations

### Reported by the Authors

- Combining DAR with other generalization techniques remains future work.
- Translating expertise into useful real-valued scores for problems with many complex constraints needs further study.
- K depends on the problem, and clipping affects the theoretical analysis. [Sections 3/4.F/5.](https://ieeexplore.ieee.org/ielx 8/5962385/11195929/11083123.pdf#page=14)

### Curator Notes

- No added neural parameters does not mean no training, no distance computation or one checkpoint for six tasks.
- Conditional entropy/asymptotic arguments do not establish universal decision quality, feasibility or optimality.
- Medium/small-distribution losses, six-case XXL evaluation, double-digit residual gaps and limited extended-task baselines constrain generalization claims.
- Current augmentation/start defaults, training-step differences, table/prose errors and unclear significance units require version-specific reproduction.

## Reproducibility

- **Formal full text:** user supplied the 15-page IEEE issue PDF, volume 36/no 10, pages 18900-18914. **Every page was reread**, including all theoretical derivations, Algorithm 1, Tables I-XII and references. The title page explicitly records acceptance**8 July 2025**, publication**17 July 2025** and current-version date 9 October 2025. Four authors/two institutions match. The old date 1 November 2023 was unsupported; [arXiv history](https://arxiv.org/abs/2401.06979) instead gives 13 January 2024.
- **Version separation:** all 9 pages of arXiv v 1 were also read and retained as earlier evidence. It is CVRP-focused, has a different title and simpler weight/training presentation; the formal 15-page extension controls this note's six-task and theory claims. The original user file in `addpapers` remains intact; a cached reading copy is registered separately.
- **Scientific material:** the full formal article has no appendix or explicit missing-scientific-material pointer. The publisher page was manually attempted and required robot verification; author publication pages and the official 584-member recursive source tree were checked, with no separate PDF/ZIP supplement. The formerly missing formal extension is now fully covered, without claiming inspection of inaccessible publisher attachments.
- **Official implementation:** [ftwangyang/DAR](https://github.com/ftwangyang/DAR), explicitly linked in the formal paper; full README, task directories, TSP/CVRP configs and VRPLib test path were checked. This confirms provenance and budgets, not retrained scores or a reproduced significance test.
- **Figure:** original formal Figure 3, PDF page 4, showing the score adjustment inside the encoder-decoder pipeline. Both versions' key figures and all formal raster tables/algorithm were visually inspected.
