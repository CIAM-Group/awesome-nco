---
id: learning-improvement-heuristics
short_title: LIH
title: Learning Improvement Heuristics for Solving Routing Problems
authors:
- Yaoxin Wu
- Wen Song
- Zhiguang Cao
- Jie Zhang
- Andrew Lim
year: 2022
date: 2019-12-12
venue: IEEE TNNLS
paper_url: https://doi.org/10.1109/TNNLS.2021.3068828
arxiv_url: https://arxiv.org/abs/1912.05784
code_url: https://github.com/WXY1427/Learn-Improvement-Heuristics-for-Routing
institutions:
- Nanyang Technological University
- National University of Singapore
- Shandong University
- Singapore Institute of Manufacturing Technology
figure:
  path: paper-assets/learning-improvement-heuristics/framework.png
  alt: LIH policy network with self-attention node embeddings and pairwise move compatibility scores.
  caption: 'Figure 2: Policy-network architecture for node embedding and pairwise move selection.'
  source_url: https://arxiv.org/pdf/1912.05784v2#page=3
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A feed-forward self-attention policy samples pairwise local moves in an always-accept search, receiving
  rewards only when the best-so-far tour improves.
publication:
  date: '2021-04-01'
  source_url: https://ieeexplore.ieee.org/document/9393606/
---

# Learning Improvement Heuristics for Solving Routing Problems

> **TL;DR:** LIH learns which node pair should undergo a local move, usually 2-opt. It always accepts feasible next states, including worse tours, while rewarding and returning best-so-far improvements. The policy uses positional self-attention and an immediate reverse-move mask; the read manuscript contains no recurrent search-history module.

## Motivation

Constructive neural routing policies cannot directly revise earlier choices, while traditional local search relies on handcrafted move-selection rules. LIH learns a stochastic solution-picking policy over a fixed local neighborhood. Its aim is a reusable method for learning improvement heuristics, rather than outperforming every specialized solver. The evaluated tasks are Euclidean TSP and CVRP. [Sections I-III.](https://arxiv.org/pdf/1912.05784v2#page=1)

## Contributions

- Formulates local improvement as a continuing reinforcement-learning task with a user-selected search horizon and rewards based on incumbent improvements.
- Uses one self-attention policy to score node pairs, supporting standard pairwise operators without a separate region-selection policy.
- Trains actor/critic networks with bootstrapped n-step returns and tests much longer horizons than the training rollouts.
- Studies multi-run/multi-checkpoint diversification, initial-solution transfer, size transfer and public routing benchmarks, including cases where transfer remains poor. [Sections IV-V.](https://arxiv.org/pdf/1912.05784v2#page=3)

## Methodology

### Search state, move and reward

The current state is a feasible tour sequence. An action selects a pair of positions; applying a predetermined pairwise operator produces the next tour. The framework considers 2-opt, swap and relocation; 2-opt performs best and is the default in the reported experiments. It does not learn simultaneous operator choice in those experiments. The rule is **always accept**, with a separate best-so-far incumbent returned at termination. Consequently current-tour cost need not decrease at every step. [Sections III-IV.A.](https://arxiv.org/pdf/1912.05784v2#page=2)

Reward is the positive decrease in best-so-far cost after a move and zero otherwise. With discount one, the summed reward telescopes to total improvement over the initial incumbent; training uses discount below one for a continuing task and bootstraps the critic at the rollout time limit. The network parameters remain fixed during test-time local search. [Equation 1 and Section IV.C.](https://arxiv.org/pdf/1912.05784v2#page=3)

### Feed-forward policy and feasibility

Raw node features are projected to dimension 128 and receive sinusoidal encodings of their positions in the current sequence. Three blocks apply single-head self-attention and a feed-forward layer with a 512-unit ReLU hidden layer, residual connections and batch normalization. A max-pooled graph embedding is projected and added to each node representation. Query/key compatibility scores form a matrix over node pairs; `10*tanh(score)` and a masked softmax produce probabilities. Both training and testing **sample** actions rather than taking a greedy argmax. The critic uses analogous embeddings with mean pooling and a scalar output. [Section IV.B-C and Figure 2.](https://arxiv.org/pdf/1912.05784v2#page=3)

TSP features are two-dimensional coordinates. CVRP features have seven components: coordinates of the node and its immediate left/right tour neighbors, plus its demand. Repeated dummy depot nodes make tour sequences have a common padded length and allow local moves to change route boundaries. Masks exclude identical-node choices, infeasible CVRP moves and the previously selected pair to prevent immediate reversal. This short explicit move exclusion is distinct from a recurrent history representation. [Section IV.D.](https://arxiv.org/pdf/1912.05784v2#page=4)

### Training protocol

Separate models are trained for TSP/CVRP at sizes 20, 50 and 100, using uniformly random coordinates. CVRP demands are integers 1-9, with capacities 30/40/50 respectively. Each epoch generates 10,240 TSP instances or 3,840 CVRP instances, split into ten batches. TSP starts from random tours; CVRP starts from nearest-insertion routes. CVRP padded sequence lengths are 40, 100 and 125; the authors could not use length 200 for CVRP100 because of GPU memory limits. [Section V.](https://arxiv.org/pdf/1912.05784v2#page=5)

Training runs 200 epochs with Adam, initial learning rate `1e-4` and decay `0.99` per epoch. TSP uses a 200-step rollout, four-step returns and discount `0.99`; CVRP20 uses 360 steps/ten-step returns, while CVRP50/100 use 480/twelve, all with discount `0.996`. On one Tesla V100, a TSP100 epoch takes about 31 minutes and a CVRP100 epoch about 58 min 53 s; the full schedules therefore involve substantial offline computation. [Section V and Algorithm 1.](https://arxiv.org/pdf/1912.05784v2#page=5)

## Experiments

### Synthetic benchmarks and search budgets

Table I compares 10,000 test instances per task/size. Reported runtimes are **totals for the dataset**, with neural methods processed in ten batches. Classical solvers run on a Xeon W-2133 CPU; LKH solves 16 instances in parallel, while the other classical solvers use one thread. Neural GPU and classical CPU times are not hardware-matched. NeuRewriter objectives are quoted from its original publication rather than rerun on these exact instances. TSP gaps use Concorde optima; CVRP gaps use LKH3 heuristic results. [Section V.A and Table I.](https://arxiv.org/pdf/1912.05784v2#page=5)

| Size-100 configuration | TSP objective / gap / time | CVRP objective / gap / time |
| --- | --- | --- |
| LIH, 1,000 moves | 8.01 / 3.24% / 25 min | 16.30 / 4.16% / 1 h |
| LIH, 3,000 moves | 7.91 / 1.85% / 1.5 h | 16.11 / 2.99% / 3 h |
| LIH, 5,000 moves | 7.87 / 1.42% / 2 h | 16.03 / 2.47% / 5 h |
| AM, 5,000 samples | 7.93 / 2.18% / 5.5 h | 16.12 / 3.03% / 8 h |

At 5,000 moves, LIH improves on the reported AM/NeuRewriter objectives, but remains above Concorde/LKH references. Larger budgets still help: the prose reports TSP100 0.48% and CVRP100 2.24% at 8,000 steps. A rounded zero TSP20 gap in the table is not an instance-by-instance optimality certificate. Matching the number of moves to AM's number of independent samples does not make those operations computationally equivalent. [Table I and surrounding discussion.](https://arxiv.org/pdf/1912.05784v2#page=6)

### Conventional rules and diversification

First- and best-improvement 2-opt baselines are augmented with random restarts when no improving neighbor remains, and receive the same move-step limits. The learned policy gives lower average objectives in most larger cases, while some small-task results tie after rounding. CPU neighborhood scans and neural pair prediction have different costs, so these equal-step comparisons do not establish equal wall-clock budgets. [Table II.](https://arxiv.org/pdf/1912.05784v2#page=6)

Multi-run samples independent trajectories from the same final policy; multi-policy runs checkpoints from the final four/eight training epochs. Table III reports lower objectives with these additional searches. At 5,000 steps, eight runs reach TSP100 objective 7.807 (0.56% gap) and CVRP100 15.880 (1.52%); 32 CVRP100 runs reach 15.809 (1.08%). These results require the extra trajectories and memory. The claim that parallelization adds little latency is conditional on sufficient device memory, not a complete measured runtime table for every ensemble. [Section V.C and Table III.](https://arxiv.org/pdf/1912.05784v2#page=7)

### Generalization and public benchmarks

Switching between random and nearest-insertion initialization at the same size produces similar final quality, but cross-size TSP transfer from random tours can fail badly: a TSP50 policy reaches about 15.30 on TSP100, far above the size-specific result. Nearest-insertion starts make cross-size transfer more effective. This conditional behavior qualifies broad claims of size robustness. [Figure 3 and Section V.D.](https://arxiv.org/pdf/1912.05784v2#page=7)

A TSP100 policy with 3,000 moves is tested on 36 symmetric Euclidean TSPLIB instances up to 299 nodes. It beats AM with 5,000 samples on 27/36, but its average gap is **17.12%**, versus OR-Tools 3.46%; AM's average is 133.54% in this protocol. A CVRP100 policy with 5,000 moves is tested on 22 X-group CVRPLIB instances named n101-n200. The average gap is **14.27%**, versus AM 31.62% and OR-Tools 8.06%; LIH beats AM on 13/22. These tables demonstrate useful relative transfer over AM alongside a substantial remaining distribution gap. [Section V.F and Tables IV-V.](https://arxiv.org/pdf/1912.05784v2#page=8)

## Limitations

### Reported by the Authors

- The main solver uses one predefined pairwise operator and a simple acceptance scheme; simultaneous operator selection and advanced search schemes are future directions.
- Cross-size transfer depends on initialization, and public-benchmark objectives remain substantially worse than OR-Tools on average.
- Dummy-depot padding and pairwise scores create memory pressure; larger horizons and diversification add test-time work. [Sections IV-VI.](https://arxiv.org/pdf/1912.05784v2#page=9)

### Curator Notes

- The learned stage improves complete initial tours, while initialization is random or a classical heuristic. This supports **specialist / improvement**, rather than a substantive learned construction phase.
- Always accepting a feasible current move is compatible with returning a monotonically improving best-so-far incumbent. Describing the current trajectory itself as always improving would be incorrect.
- The read architecture is feed-forward, with sinusoidal sequence positions and a one-step move mask. The previous note's recurrent-history contribution lacked support in this manuscript.
- Separate task/size models, heuristic CVRP reference gaps, imported NeuRewriter numbers and inference budgets must accompany conclusions about quality or efficiency.

## Reproducibility

- **Actual reading version:** all ten pages of [arXiv v2, revised 10 May 2020](https://arxiv.org/abs/1912.05784v2), including every experiment/figure and all 41 references. It has no separately referenced appendix or scientific supplement. The user-authorized arXiv fallback supplies the scientific evidence summarized here; no identity of its bytes with the later typeset journal article is asserted.
- **Formal eligibility:** [IEEE Xplore record 9393606](https://ieeexplore.ieee.org/document/9393606/) identifies first online publication on 1 April 2021 and the September 2022 issue of IEEE TNNLS, volume 33(9), pp. 5057-5069. The note retains issue year 2022 while recording the supported earlier publication date. First arXiv submission is 12 December 2019. The author institutional record corroborates the four listed affiliations.
- **Source access/inventory:** the IEEE page presents a JavaScript verification gate; the SMU institutional record identifies an accepted manuscript, but its download yielded an access challenge. The full arXiv manuscript was available. The official-code repository's recursive document inventory contains its README and no additional PDF/ZIP scientific attachment; no explicitly referenced scientific text is missing from the read version.
- **Implementation:** [WXY1427/Learn-Improvement-Heuristics-for-Routing](https://github.com/WXY1427/Learn-Improvement-Heuristics-for-Routing). Its README identifies the published article and task/size-specific `run.py`/`test.py` or notebook entrypoints. Code/documentation were inspected; no training or benchmark experiments were rerun.
- **Audit locators:** PDF pp. 3-5 for MDP/network/training, pp. 6-9 for all Tables I-V and transfer qualifications. The displayed original Figure 2 is rendered from p. 3 with the complete input/output diagram and excess page-header whitespace removed.
