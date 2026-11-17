---
id: learning-collaborative-policies
short_title: LCP
title: Learning Collaborative Policies to Solve NP-hard Routing Problems
authors:
- Minsu Kim
- Jinkyoo Park
- Joungho Kim
year: 2021
date: '2021-10-26'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/564127c03caab942e503ee6f810f54fd-Abstract.html
arxiv_url: https://arxiv.org/abs/2110.13987
code_url: https://github.com/alstn12088/LCP
institutions:
- Korea Advanced Institute of Science and Technology
figure:
  path: paper-assets/learning-collaborative-policies/framework.png
  alt: Complete LCP pipeline showing a seeder, parallel revisers and repeated decomposition and recomposition.
  caption: 'Figure 1: Complete seeder-reviser collaboration, including seeding, segment revision and repeated recomposition.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Paper.pdf
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Prize Collecting Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: An entropy-regularized seeder constructs diverse candidates; separately trained endpoint-conditioned revisers
  reconstruct disjoint segments in parallel, with task- and budget-specific inference.
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper/2021/hash/564127c03caab942e503ee6f810f54fd-Abstract.html
---

# Learning Collaborative Policies to Solve NP-hard Routing Problems

> **TL;DR:** A seeder samples diverse complete routes and a separately trained reviser reconstructs fixed-endpoint segments in parallel. Repeating decomposition and recomposition improves candidate quality, with performance depending on sample width, revision count and task-specific constraints.

## Motivation

One construction policy must balance exploration and precise local decisions. LCP separates those roles: a diversity-oriented seeder explores full routes, and revisers correct local orderings within smaller subproblems. It retains multiple candidates until after revision, allowing initially weak seeds to become useful. The stated aim is to improve neural routing frameworks, rather than outperform every specialized solver. [Introduction and related work, main PDF pp. 1-4](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Paper.pdf#page=2).

## Contributions

- A scheduled entropy term encourages diversity during seeder training, emphasizing early construction decisions.
- A separate endpoint-conditioned policy reconstructs segments while their boundary nodes remain fixed.
- Parallel segment inference and successive shifted partitions provide a controllable construction-plus-improvement budget.
- Experiments cover TSP, PCTSP and CVRP, with component, temperature, architecture and random-seed analyses plus a TSPLIB comparison.

## Methodology

**Seeder.** An Attention Model policy samples `M` complete feasible solutions. Full-tour entropy is approximated by the weighted sum of conditional action entropies, with `w_t=(N-t)/N_w` and `N_w=sum(i, i=1..N)`. The training estimator multiplies the policy score gradient by `L - alpha*R_entropy - b(s)`, using the AM greedy-rollout baseline. Main experiments use `alpha=0.5` and seeder batch size 1,024, with other training hyperparameters inherited from the AM setup. The weighted conditional-entropy sum is an approximation and a training incentive, not a guarantee of distinct or uniformly sampled tours. [Section 4.1, Equations 1-2, pp. 5-7](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Paper.pdf#page=5).

**Reviser.** Training is separate from the seeder. A reviser trained on `L` nodes fixes the two endpoints and chooses an ordering of the `L-2` interior nodes. Its AM context replaces the first-node embedding with the destination embedding; the reward is negative endpoint-to-endpoint path length. Entropy regularization is disabled. At inference, disjoint segments from all `M` candidates are revised in parallel; the offset shifts between rounds, then segments are recomposed. Algorithms 1-2 greedily decode revisers and finally select the best revised candidate. They do not specify the old note's claimed explicit accept-only-if-improved replacement rule, and this note does not infer a monotonic-improvement guarantee. Nor does the paper's `l!` possible-segment-orderings argument mean the learned decoder exhaustively evaluates all permutations. [Section 4.2, pp. 6-7; Supplement A.3-A.4, pp. 2-3](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Supplemental.pdf#page=2).

**Task adaptations.** Small TSP uses a length-10 reviser. The stronger LCP* configuration and large TSP/TSPLIB use two revisers: the paper specifies length 20 for 25 rounds followed by length 10 for 20 rounds. Small PCTSP fixes the seed's selected node set, only revising its order; it cannot add or drop visits in that configuration. Larger PCTSP uses a PCTSP100-trained policy for segment revision. CVRP partitions depot-delimited subroutes, pads with depot nodes to equalize lengths, and uses task-specific revisers, including a CVRP100-trained policy in the 500-node experiment. These adaptations retain the respective prize/capacity constraints; they are not a generic unconstrained TSP rewrite. [Supplement A.1-A.4, pp. 1-3](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Supplemental.pdf#page=1).

The full pipeline is classified as specialist **improvement** because it revises complete incumbent candidates, even though seeder and segment decoder each construct sequences. Separate policies, task-specific training and architecture reuse do not establish one shared multi-problem checkpoint.

## Experiments

**Protocol and budgets.** Main Table 1 uses 10,000 synthetic instances at sizes 20/50/100, generated using AM's problem-specific distributions. `{M,I}` denotes seed sample width and revision rounds; LCP* uses two reviser stages totaling 45 rounds. Figure 4's size-100/500 time-quality analyses use 100 instances. Inference temperature is task/size specific: for size 100, TSP/PCTSP/CVRP use 2/1.5/1, while size 500 uses 0.1/0.2/0.3. These choices differ from default AM temperature one; temperature controls are supplied separately. [Section 5; Supplement A.5 Tables 3-4, pp. 3-4](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Supplemental.pdf#page=4).

| Setting, 100 nodes | Configuration | Mean objective | Reported gap | Average time per instance |
| --- | --- | ---: | ---: | ---: |
| TSP | AM, 1,280 samples | 7.94 | 2.26% | 0.36 s |
| TSP | LCP, 1,280 seeds / 10 rounds | 7.85 | 1.13% | 0.90 s |
| TSP | LCP*, 1,280 seeds / 45 rounds | 7.81 | 0.54% | 4.30 s |
| PCTSP | LCP, 1,280 seeds / 5 rounds | 6.04 | 1.00% | 0.39 s |
| CVRP | LCP, 6,500 seeds / 1 round | 15.98 | 2.11% | 1.73 s |

[Table 1, main p. 8](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Paper.pdf#page=8). TSP gaps use exact references; PCTSP100 and CVRP100 use the compared ILS and LKH3 heuristic values, 5.98 and 15.65. LCP improves the reported AM and selected learned baselines, but does not surpass these specialized references. POMO and MDAM are discussed and explicitly **excluded** as main performance baselines, with future collaboration proposed instead.

**Timing interpretation.** Section 5 times are averages per instance, with GPU parallelization; they are not all isolated-request latencies. The neural setup uses RTX 2080 Ti and i7-9700K. Table 1 permits evaluation batch size up to 100; some heuristic timings are inherited from AM's two-Xeon setup. In the size-500 analysis, most algorithms use batch size one, while DRL-2opt and NLNS use ten. Thus the time-quality plots require these batching and hardware qualifications, including when the paper labels a short-budget region as a winner region. [Supplement A.5, pp. 3-4](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Supplemental.pdf#page=3).

**Ablations.** Main Table 2 separates entropy, scheduling and revision. Linear scheduling is not best at every entropy coefficient: Supplement B shows uniform scaling better at coefficients 0.2/0.3 and linear scaling stronger at 0.4/0.5 in its test. Temperature robustness, a Pointer Network seeder experiment, seeder-plus-DRL-2opt comparisons and four training seeds are also reported. The unusually weak sampled Pointer Network control (TSP20 cost 7.33 versus greedy 3.95) is a reported experimental result, not evidence that sampling generally worsens best-of-sample optimization. [Supplement B-F, pp. 5-9](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Supplemental.pdf#page=5).

**TSPLIB.** The text describes 35 instances and 22 wins; the actual displayed Table 7 contains **33 named instance rows**. Its reported average gaps are 9.90% for AM, 7.63% for DRL-2opt and 5.14% for LCP. The latter difference is 2.49 percentage points, not a 2.49% relative reduction. Results are mixed: LCP's reported gap is 8.92% on bier127 versus DRL-2opt's 2.40%. LCP uses 2,560 seeds and the two revisers; AM uses 40,000 samples. Both AM and LCP choose the best among temperatures 0.1/0.5/1/2 and charge four times the runtime. [Supplement G, p. 10](https://proceedings.neurips.cc/paper_files/paper/2021/file/564127c03caab942e503ee6f810f54fd-Supplemental.pdf#page=10).

## Limitations

### Reported by the Authors

- Full solution entropy is approximated; better exploration and revision schemes remain future work.
- Both AM and LCP need low inference temperatures for large TSP in the provided analysis.
- The evaluated policies retain task-specific constraints, segment choices and candidate budgets. Proposed additional routing variants are not completed experiments here.

### Curator Notes

- Small PCTSP revision cannot repair a poor selection of visited nodes, only their order.
- Quality and runtime depend on samples, revision lengths/counts, temperature tuning and batching. No global optimality or monotonic revision guarantee is established.
- Source inconsistencies affect reproducibility: Supplement B says 100 test instances while Table 3 assigns 1,000 to its Table 5; the TSPLIB prose count differs from its table. These are disclosed rather than silently resolved.
- The inspected code README emphasizes TSP, so a statement that all three task experiments are turnkey reproduced by that release would be too strong.

## Reproducibility

- **Publication and dates:** [NeurIPS 2021 record](https://proceedings.neurips.cc/paper/2021/hash/564127c03caab942e503ee6f810f54fd-Abstract.html); [arXiv history](https://arxiv.org/abs/2110.13987) gives first submission on 26 October 2021. Publication year is evidenced; the previous conference-notification acceptance date was removed.
- **Sources read:** All 13 publisher-paper pages, including all 41 references, and all ten separate supplement pages. The manually inspected official article links one scientific Supplemental PDF and no additional scientific archive.
- **Official implementation:** [alstn12088/LCP](https://github.com/alstn12088/LCP), with seeder/reviser training and pretrained evaluation commands. It explicitly states that the release focuses on TSP. Its LCP* example uses revision counts 20/25, whereas the paper's Appendix A.3/G describes 25/20 for length-20/length-10 revisers; choose and document the intended protocol before reproduction. Code examples also use training settings different from the paper. Availability was inspected; no experiments were rerun.
- **Visual checks:** Full Figure 1, entropy equations, result and TSPLIB tables were checked in rendered pages. The clipped framework image has been replaced with the complete original seeding-and-revision diagram.
- **Audit trail:** [Reading coverage, claim locators and directed citations](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/learning-collaborative-policies.json).
