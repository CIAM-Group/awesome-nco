---
id: hrl-aug-branching
short_title: HRL-Aug
title: 'Towards Imitation Learning to Branch for MIP: A Hybrid Reinforcement Learning based Sample Augmentation
  Approach'
authors:
- Changwen Zhang
- Wenli Ouyang
- Hao Yuan
- Liming Gong
- Yong Sun
- Ziao Guo
- Zhichen Dong
- Junchi Yan
year: 2024
date: '2024-05-31'
publication:
  date: '2024-05-31'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/850cc7c4e5619fdc2f30c4eaa5ce3c17-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/850cc7c4e5619fdc2f30c4eaa5ce3c17-Abstract-Conference.html
institutions:
- Lenovo Research
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: A learned expert/model collector and fitted return filter iteratively augment task-specific imitation branching;
  publisher code supports evaluation with pretrained models.
code_url: https://proceedings.iclr.cc/paper_files/paper/2024/file/850cc7c4e5619fdc2f30c4eaa5ce3c17-Supplementary-Conference.zip
---

# Towards Imitation Learning to Branch for MIP: A Hybrid Reinforcement Learning based Sample Augmentation Approach

> **TL;DR:** HRL-Aug iteratively trains a branching GCNN on demonstrations collected by a learned expert/model selector and filtered with a fitted return envelope. Its reported benefits depend on task, metric and collection/training budget; the released publisher supplement contains evaluation code and task-specific checkpoints.

## Motivation

Strong branching is costly and locally greedy, while cloning it can inherit imperfect demonstrations. Pure RL faces a large variable-action space and sparse bound improvements. The paper combines expert and learned branching trajectories, then selects demonstrations using their eventual dual-bound return (Sections1-2).

## Contributions

- An online actor-critic chooses whether strong branching or the current GCNN supplies the next branching decision.
- An offline fitted value envelope filters collected examples before imitation learning.
- Repeating collection/filtering/GCNN training improves several reported solve-time and bound metrics and reduces retained training data.
- Ablations separate the two agents and replace the final GCNN with MLP/CNN/RNN architectures (Sections3-4).

## Methodology

**Online selector.** Its two actions choose a source policy, not one of all candidate variables directly. State contains expert candidate scores, learned scores and bipartite LP/constraint/variable features. Reward is the change of the solver dual bound. Undiscounted Monte Carlo return sums subsequent changes to episode end, avoiding discounting long intervals without improvement. It does not directly minimize solve time. Expert scores remain part of the online state, so choosing a model-generated demonstration is not evidence that strong-branching computation was avoided (Section3.2/Figure2).

**Offline filter.** Equation3 fits a regularized neural upper envelope f(O,A)>=R to collected returns; Equation4 keeps examples satisfying R>=z*f(O,A). This is a learned empirical filter, not a proof that accepted branches are optimal or that the envelope holds for unseen states. It is trained only in the first iteration. The online actor-critic is refreshed initially and every fifth iteration with the current GCNN; retained data accumulate and GCNN is retrained iteratively. The paper gives the retention threshold symbol z but does not provide a clear numeric value in its hyperparameter section (Sections3.3-3.4/Algorithm1).

**Solver and scope.** At inference the trained policy scores fractional candidates and SCIP executes the selected branch. Correct branch partitioning and the classical search establish exactness if search completes; the neural policy has no learned optimality certificate. Different problem types have separately loaded checkpoints in the supplement. Size transfer within a problem and retraining other network architectures do not establish a shared model across native tasks: specialist constructive is retained (AppendicesA.1-A.2/released policy loader).

## Experiments

**Protocol.** Four generated binary-integer applications are combinatorial auction, set covering, maximum independent set and capacitated facility location. Each has10000 easy training instances,4000 validation and40 test instances per easy/medium/hard size; five seeds give200 attempts, not200 independent instances. Each iteration collects10000/4000 training/validation samples, with20 iterations for these applications and50 for the three ML4CO tasks. GCNN baseline uses100000/40000 samples. Models use Ecole, SCIP7.0.3 with heuristics/restarts disabled, XeonSilver4210 and A100; RL hidden width128, offline embedding64, Adam0.003, gamma1. Budgets are one hour for four standard tasks and900seconds for ML4CO (Sections4.1-4.2).

**Metrics.** Time is1-shifted geometric mean; node counts use instances solved by all compared methods, while solved counts use each method's attempts. ML4CO reports final dual bounds, a gap to a best-known primal reference and an integrated-bound reward under the time cap. These are distinct from solved-to-proven-optimum runtime. The Gurobi9.5 comparison is the item-placement ablation, not a seven-task complete comparison (Section4.1/Tables5-6,9).

**Positive and negative cases.** Hard MIS time577.79s improves GCNN767.95/KIDA677.15/SCIP2048.93 and solves195/200 versus182/185/122. Hard auction time222.758 improves225.23/237.10/298.69 modestly. Easy set cover is slower than both learned baselines(8.15 versus7.85/7.89s). Hard facility location solves186 attempts, fewer than SCIP191, despite a smaller aggregate time718.62 versus921.68. Node counts also need not improve: easy auction77.40 versus SCIP21.58; medium MIS508.79 versus KIDA483.53. Stronger aggregate time does not imply dominance on all instances or all metrics (Table5).

**Large tasks/cost.** Item placement final gap34.16% improves KIDA34.18 and Gurobi36.65; anonymous45.64% improves46.16; workload final gaps tie at2.84 and GCNN dual bound701.82 slightly exceeds HRL-Aug701.80. At40 auction iterations, retained samples268013 versus400000 accompany189 versus191min generation and257 versus359min training. Anonymous at40 iterations needs77.09h generation and36.33h training versus83.85/59.20h. Early anonymous training is more expensive(1.36 versus0.26h atiteration1;9.57 versus6.27h atiteration10). The claimed28%/38% training reductions are later-stage model-training comparisons, not universal savings of total collection plus training (Tables6-9).

**Ablations.** Both collector and filter improve item-placement gap over their individually disabled variants. MLP/CNN/RNN replacements give small easy-auction time improvements over KIDA, showing the augmentation recipe can be retrained with these backbones. AppendixA.5 uses published RL checkpoints trained at different set-cover sizes and altered SCIP configuration; these are not fully matched retraining-cost comparisons. AppendixA.6 finds GCNN smaller than strong branching on40/200 auction instances, while strong branching wins174/200; overlapping ties mean these counts need not sum200 (Tables9-13).

## Limitations

### Discussed in the Paper

The learned selector depends on an evolving branching policy and needs refreshes. The offline model is deliberately frozen after the first iteration. Extensions to learned presolve and instance generation remain future work. Large state/action spaces and delayed dual improvement motivate the hybrid design (Sections3/5).

### Curator Notes

No theorem guarantees an optimal source mixture, valid unseen-state return envelope or monotonically improving policy. The reward/filter reflects future trajectory and the chosen stopping budget, with model-distribution shift across iterations. Lower expert-label accuracy can coexist with faster solving; Table4 should not be described as uniform improvement of imitation accuracy.

Several rendered count cells conflict with the stated200-attempt protocol: Table5 includes75/100,57/100,64/100 and61/100; Table12 contains199/100. These printed denominators cannot be silently treated as validated counts. AppendixA.2's maximum-of-child-gains illustration also should not be equated with every SCIP strong-branching scoring implementation. These are source/reporting qualifications, not proof of invalid empirical solutions.

The publisher ZIP supplies model/inference/evaluation scripts, generators and task-specific pretrained files. Its two READMEs describe evaluation, and the inventory does not provide a clearly documented complete actor-critic/upper-envelope training pipeline. No pickle checkpoints were executed and no solve or training benchmark was rerun. Local paths, GPU assumptions and dependencies need configuration.

## Reproducibility

- **Publication:** [ICLR2024 proceedings](https://proceedings.iclr.cc/paper_files/paper/2024/hash/850cc7c4e5619fdc2f30c4eaa5ce3c17-Abstract-Conference.html), pages31373-31387; official HTML citation_publication_date May31,2024. Eight authors and Lenovo Research/Shanghai Jiao Tong affiliations checked against page1; Wenli Ouyang capitalization corrected.
- **Coverage:** all15 pages, references and AppendicesA.1-A.6 read; collector/filter equations, branch features, numerical tables and figures rendered/checked. The official34503855byte [supplement ZIP](https://proceedings.iclr.cc/paper_files/paper/2024/file/850cc7c4e5619fdc2f30c4eaa5ce3c17-Supplementary-Conference.zip) was downloaded and its entire inventory checked: code/checkpoints, with no separate scientific PDF/TeX/document attachment.
- **Code:** the same publisher supplement is the verified implementation source. READMEs, task-specific policy loading, models, Ecole environments/rewards and evaluation timing inspected. Four directories cover binary applications, ML4CO, ablations and RL baselines; a standalone author GitHub repository was not required or invented.
- **Relations:** exact in-text/bibliography matches support GCNN, Hybrid Branching, Tree-MDP Branching and L2P-MIP. Other cited preprints/generators absent from the present catalogue are not given artificial edges.
