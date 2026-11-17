---
id: sym-nco
short_title: Sym-NCO
title: 'Sym-NCO: Leveraging Symmetricity for Neural Combinatorial Optimization'
authors:
- Minsu Kim
- Junyoung Park
- Jinkyoo Park
year: 2022
date: '2022-05-26'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/0cddb777d3441326544e21b67f41bdc8-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2205.13209
code_url: https://github.com/alstn12088/Sym-NCO
institutions:
- Korea Advanced Institute of Science and Technology
figure:
  path: paper-assets/sym-nco/framework.png
  alt: Sym-NCO architecture applying transformed instances and symmetric solutions around a shared encoder-decoder.
  caption: 'Figure 3: Overview of Sym-NCO problem and solution symmetry training.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf#page=4
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Prize Collecting Traveling Salesman Problem
- Orienteering Problem
summary: Sym-NCO regularizes neural routing policies with problem and solution symmetries during reinforcement learning.
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/0cddb777d3441326544e21b67f41bdc8-Abstract-Conference.html
---

# Sym-NCO: Leveraging Symmetricity for Neural Combinatorial Optimization

> **TL;DR:** Sym-NCO changes how existing constructive routing policies are trained: returns are compared across sampled solutions and rotated/reflected copies of an instance, while a projection loss encourages invariant representations. The experiments train separate task policies; symmetry is encouraged approximately rather than guaranteed by the architecture.

## Motivation

An orthogonal transformation preserves Euclidean pairwise distances and therefore the routing objectives considered here, but an ordinary coordinate-based policy need not exploit this equivalence. Different valid solution sequences can also have equal reward. Sym-NCO uses these properties as training signals while retaining established encoder-decoder architectures. The study tests TSP, CVRP, PCTSP and OP, principally with 100 nodes. [Sections 1-2.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf#page=1)

## Contributions

- Distinguishes **problem symmetry**, meaning an identical set of optimal solutions, from **solution symmetry**, meaning equal objective values for two solutions.
- Combines a same-instance shared-return baseline, a baseline shared across transformed instances and a projected-representation cosine loss.
- Integrates the training scheme with POMO, AM and a PointerNet baseline; the main four-task comparison uses POMO for TSP/CVRP and AM for PCTSP/OP.
- Evaluates greedy construction, augmentation-based best-of-many construction, TSPLIB transfer and a small large-scale CVRP experiment using additional EAS adaptation. [Sections 3-6 and supplement C-D.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf#page=4)

## Methodology

### Symmetry assumptions and objectives

The CO-MDP sequentially selects feasible nodes until a complete solution is produced. Reward is negative travel cost for TSP/CVRP/PCTSP and collected prize for OP. The orthogonal-transformation theorem relies on the problem's rewards and constraints being preserved when coordinates are transformed and other node features remain unchanged. The proof uses equality of pairwise Euclidean distances; it does not establish symmetry for arbitrary non-Euclidean or coordinate-dependent constraints. [Section 2 and supplement A.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf#page=1)

The training objective is `L_ps + beta * L_ss + alpha * L_inv`:

- **`L_ss`:** sample `K` solutions of one instance and subtract their mean reward in REINFORCE. Group advantages sum to zero, encouraging better returns relative to peers. The sampled trajectories are not assumed already to be equal-cost representations of one tour, and this competition does not prove their returns will become identical.
- **`L_ps`:** sample `L` orthogonal transforms and `K` solutions per transformed instance. Use the mean across the entire `L*K` group as the shared baseline, exploiting the unchanged objective landscape.
- **`L_inv`:** maximize cosine similarity between projected encoder representations of an instance and its transform. A two-layer ReLU projection MLP has input, hidden and output dimension 128; regularization acts on its output rather than forcing raw encoder features to coincide.

These losses encourage approximate symmetry in a conventional neural policy. The theorem concerns the optimization problem, not a guarantee that the trained policy is exactly invariant or globally optimal. [Sections 3.1-3.2 and supplement C.4.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf#page=4)

### Task-specific settings and inference

AM/PointerNet use `alpha=0.1`, `beta=0`, `K=1`, `L=10`: the transformed-instance baseline alone also supplies multiple competing rollouts. POMO uses `beta=1`, `K=100`, `L=2`, with `alpha=0.1` for TSP and `0.2` for CVRP. Forced distinct first nodes are retained **only for TSP**; CVRP first-customer selection is allowed to vary. Thus the method extends POMO's training mechanism rather than simply applying an unchanged POMO start rule to every task. [Supplement C.1-C.2.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf#page=3)

The POMO-based models use six encoder layers, embedding size 128, eight heads, feed-forward size 512, batch size 64 and learning rate `1e-4`. Training schedules are 2,000 epochs of 100,000 TSP instances and 8,000 epochs of 10,000 CVRP instances. AM-based schedules use three layers, batch size 512 and 100 epochs of 1.28 million instances. Sym-NCO keeps the respective backbone settings while changing its loss and baseline. POMO+Sym-NCO takes about two weeks on one A100; AM+Sym-NCO about three days on four A100 GPUs. These are offline costs, additional to inference. [Supplement B-C.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf#page=2)

At test time the trained decoder constructs routes greedily or returns the best among multiple transformed/multi-start constructions. TSP/CVRP comparisons include widths 1, 100 and 800 (100 starts times eight standard coordinate augmentations); PCTSP/OP use 200 random orthogonal augmentations for the main multi-start results. Ordinary inference does not adapt parameters or perform incumbent-tour moves. EAS appears only in the separate large-scale transfer study. [Supplement C.3 and D.3.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf#page=3)

## Experiments

### Main 100-node routing benchmarks

Tables 1-2 report mean results and **total time for 10,000 instances**. Neural inference uses one RTX2080Ti; classical methods run on an Intel Xeon E5-2630 CPU. The paper explicitly compares practical CPU/GPU configurations, so speed ratios are not hardware-matched algorithmic speedups. TSP gaps use Concorde; CVRP, PCTSP and OP gaps use LKH3, ILS and Compass heuristic references respectively.

| Task | Greedy Sym-NCO objective / gap | Multi-start objective / gap | Multi-start dataset time |
| --- | --- | --- | --- |
| TSP100 | 7.84 / 0.94% | 7.79 / 0.39% (100 starts) | 13 s |
| CVRP100 | 16.10 / 2.88% | 15.87 / 1.46% (100 starts) | 16 s |
| PCTSP100 | 6.05 / 1.23% | 5.98 / -0.02% (200 augmentations) | 3 min |
| OP100 | 32.51 / 2.03% | 33.04 / 0.45% (200 augmentations) | 3 min |

Lower is better except for OP's collected prize. The corresponding POMO 100-start gaps are 0.44%/1.67% for TSP/CVRP; AM with 1,280 samples has 1.67%/1.55% for PCTSP/OP. This supports improvement over the tested backbone/budget configurations, while the classical TSP/CVRP/OP references retain stronger final objectives. PCTSP's 240-fold reported inference speed ratio comes from ILS taking 12 hours versus three minutes for Sym-NCO at slightly better average cost. A negative PCTSP gap means improvement over ILS, not improvement over a certified optimum. The table's TSP greedy gap is 0.94%, while nearby prose says 0.95%; the note follows the table. [Tables 1-2 and Section 5.4.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf#page=7)

### Transfer beyond the training distribution

The 28 listed TSPLIB instances have 51-226 nodes. Both policies were trained at size 100 and use **`N*20` candidates per instance**, including random orthogonal augmentations. The reported average gap decreases from POMO's 1.87% to Sym-NCO's 1.62%, although individual instances worsen: for example, kroD100 rises from 0.91% to 1.89%. Table 9 also contains a cost/gap inconsistency in the lin105 Sym-NCO row; the aggregate is reported as printed, rather than independently certified from those rounded costs. [Supplement D.2, Table 9.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf#page=6)

Large-scale transfer uses only **ten randomly generated CVRP instances** at each of 500 and 1,000 customers, starting from a CVRP100 policy and applying 200 EAS iterations. Relative to LKH3, Sym-NCO+EAS gaps are 3.37%/5.92%, versus POMO+EAS 4.85%/9.34%. Few-shot tables cover 1, 2, 5 and 10 adaptation iterations and favor Sym-NCO initialization. This is parameter adaptation with an additional search algorithm, not zero-shot large-scale generalization or evidence from a broad benchmark suite; no end-to-end adaptation times are supplied in those tables. [Supplement D.3, Tables 10-11.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf#page=7)

### Ablations and comparison limits

Training curves test the contribution of shared-baseline losses, invariant projection, projection-head removal and a simple EGNN encoder substituted into POMO. Sym-NCO improves over those tested variants; poor convergence of this six-layer EGNN baseline does not establish a general impossibility for equivariant routing architectures. The CVRP `alpha=0.2` versus `0.1` ablation provides limited hyperparameter evidence. [Section 6.1 and supplement D.1.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf#page=8)

Supplement D.4 reports 800-candidate TSP/CVRP gaps of 0.14%/0.90%. Improvement-method comparisons reuse Titan RTX timing figures, while Sym-NCO uses RTX2080Ti; the D.5 comparison also spans GTX1080Ti and Tesla P100. Those rows should not be treated as controlled speed measurements. The supplement's Table 12 contains mislabeled task and cost/time headers; the text and Table 1 identify the intended TSP/CVRP comparison. [Supplement D.4-D.5.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf#page=8)

## Limitations

### Reported by the Authors

- The studied problem symmetry is Euclidean rotation/reflection; other transforms and graph/non-Euclidean optimization problems are future directions.
- Large-scale adaptation receives only a small EAS-based demonstration; curriculum and meta-learning are proposed for further work.
- Training resources limited systematic loss-weight tuning. [Section 6.2 and supplement D.1.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf#page=9)

### Curator Notes

- This is a reusable training scheme with separate task models, supporting **specialist / constructive** classification; four tasks do not demonstrate one cross-task checkpoint.
- Shared baselines and projection similarity are optimization incentives, not proofs of exact symmetry, equal-quality sampled solutions or global optimality.
- Main results do not report repeated-seed uncertainty. Multi-start budgets, offline training, heterogeneous hardware and optional EAS adaptation materially affect comparisons.
- Printed reference/header errors should not create false relations: MDAM is bibliography entry [26], despite its table rows printing [25] (which is DACT).

## Reproducibility

- **Full-text sources:** the [14-page NeurIPS 2022 publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Paper-Conference.pdf) and its [nine-page supplement](https://proceedings.neurips.cc/paper_files/paper/2022/file/0cddb777d3441326544e21b67f41bdc8-Supplemental-Conference.pdf), covering Appendices A-D.5, were read in full. The proceedings page exposes one scientific Supplemental PDF; it contains the proof, all implementation details and additional tables. The first arXiv submission was 26 May 2022; the formal venue is NeurIPS 2022. A generic conference notification date was removed from acceptance metadata.
- **Official implementation:** [alstn12088/Sym-NCO](https://github.com/alstn12088/Sym-NCO), linked by the paper. Its README provides POMO-based TSP/CVRP and AM-based task commands, and identifies pretrained PCTSP/OP AM policies. The original release and its newer RL4CO recommendation are distinct implementations; no numerical reproduction was run during this document audit.
- **Audit locators:** main pp. 3-5 for assumptions/losses, pp. 6-9 for protocols and ablations, supplement pp. 1-4 for proof/training, pp. 6-9 for every transfer/comparison table. The displayed image is original Figure 3, publisher PDF p. 4, rendered with its full contents.
