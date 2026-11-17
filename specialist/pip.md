---
id: pip
short_title: PIP/PIP-D
title: Learning to Handle Complex Constraints for Vehicle Routing Problems
authors:
- Jieyi Bi
- Yining Ma
- Jianan Zhou
- Wen Song
- Zhiguang Cao
- Yaoxin Wu
- Jie Zhang
year: 2024
date: '2024-10-28'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/a9d2a5fd12d34250c21b5e4fa8d906b0-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2410.21066
code_url: https://github.com/jieyibi/PIP-constraint
institutions:
- Nanyang Technological University
- Shandong University
- Singapore Management University
- Eindhoven University of Technology
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem with Time Windows
- Traveling Salesman Problem with Draft Limits
summary: PIP combines violation-aware training with look-ahead infeasibility masks for TSPTW/TSPDL; PIP-D learns
  an auxiliary mask decoder to reduce training-time rule evaluation.
figure:
  path: paper-assets/pip/framework.png
  alt: PIP uses a rule-based preventative infeasibility estimator; PIP-D additionally trains a state-conditioned
    auxiliary mask decoder alongside the routing policy.
  caption: 'Figure 3: Rule-based PIP and auxiliary-decoder PIP-D training flows.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=6
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/a9d2a5fd12d34250c21b5e4fa8d906b0-Abstract-Conference.html
---
# Learning to Handle Complex Constraints for Vehicle Routing Problems

> **TL;DR:** Proactive Infeasibility Prevention (PIP) adds violation-aware RL and one-step look-ahead masks to constructive routing policies. PIP-D learns those masks to reduce their repeated computation **during training**. Actual experiments cover **single-tour TSP with time windows and draft limits**, with substantial remaining failures on some hard and benchmark settings.

## Motivation

An action can satisfy its own time window yet make an unvisited customer unreachable later. Immediate masking therefore cannot guarantee completion, while checking every possible future completion is itself hard. PIP uses an inexpensive necessary look-ahead check to avoid some dead ends, without claiming a complete feasibility oracle. This issue is especially severe for a single tour; adding another vehicle to restart at time zero changes the problem. [Sections 1/3/4.1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=4)

## Contributions

- Combines a constraint-violation penalty with **preventative infeasibility (PI) masking**.
- Adds a PIP decoder, mirroring the routing backbone, trained against rule-generated PI labels with class-balanced binary cross entropy.
- Uses scheduled periods of decoder updates and frozen predictions to reduce training cost.
- Evaluates TSPTW and TSPDL on AM/POMO, and TSPTW500 on GFACS, including overlap-controlled feasibility/quality comparisons and public benchmarks. [Sections 4-5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=5)

## Methodology

### Violation-aware training and look-ahead

The reward penalizes tour length, violation magnitude and the **number of infeasible nodes**. TSPTW sums lateness beyond upper time-window bounds; TSPDL sums cumulative-load excess above a port's draft limit. Although motivated through a Lagrangian formulation, the main experiments **fix lambda=1** and optimize neural parameters; there is no alternating learned dual-multiplier update. Penalties encourage feasibility but do not guarantee it. [Section 4.2 and Appendix D.1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=5)

For each candidate next node, hypothetically visit it and check whether any remaining node would become unreachable under the relevant constraint. If so, mask that candidate. The standard setting checks one step ahead, avoiding enumeration of complete continuations. Its per-decoding-step rule computation is O(n^2), and even correct one-step masks can miss later conflicts. The method supplements, rather than replaces, ordinary visited/immediate-constraint masks. [Section 4.2 and Appendix A.3/D.3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=17)

### PIP-D auxiliary prediction

PIP itself uses the rule estimator. **PIP-D** adds a separate sigmoid mask decoder sharing encoded instance information and conditioned on the current solution. RL trains the routing decoder; weighted BCE trains the auxiliary decoder on PI labels computed from the rule, without externally solved optimal-tour labels. Feasible/infeasible class weights depend on their counts at a decoding step. Initial, periodic and final supervised-update windows alternate with periods using a frozen best-so-far predictor, selected by feasible-class accuracy. [Section 4.3 and Appendices B/C.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=6)

For AM/POMO, the auxiliary head uses attention like the original decoder, changing its final activation. For GFACS it uses a three-layer MLP with last-edge/solution features added to make mask prediction state-dependent; graph neighbors are selected by time-window overlap rather than just distance. POMO's stipulated different starting cities are removed, since they can force infeasible routes; training samples n trajectories for the baseline instead. [Section 3 and Appendix B/C.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=19)

**Training versus inference matters.** Tables 4-5 still vary rule-based PIP steps at evaluation and show that zero-step testing fails frequently, including for PIP-D-trained policies. The inspected official POMO test defaults set `pip_decoder=False`, `use_predicted_PI_mask=False` and `pip_step=1`; main README evaluation commands request `--generate_PI_mask`. Thus the main PIP-D results are not evidence of universally replacing inference look-ahead with a learned head. Optional predicted-mask flags exist, and require their own configuration/validation. [Tables 4-5 and official code.](https://github.com/jieyibi/PIP-constraint/blob/main/POMO%2BPIP/test.py)

Different task/size/hardness models and backbone implementations are trained separately. Core PIP/PIP-D is **specialist, constructive**: masking guides partial-route construction. Optional downstream LKH search is a separate hybrid experiment, not a learned incumbent-editing component of the core framework.

## Experiments

### Data, compute and metric definitions

TSPTW uses 50/100-node easy, medium and hard generators, plus medium500 for GFACS. Easy/medium windows are independently sampled and do not have a theoretical feasibility guarantee; hard windows are built around a random feasible tour, with tightened width. TSPDL uses unit customer demands and draft-limit mutation on **75%/90%** of nodes for medium/hard, with a generator feasibility check. Main TSPTW/TSPDL are not capacitated multi-vehicle VRPTW or orienteering. [Appendix A.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=16)

Tests contain **10000 instances at 50/100 and 128 at 500**. Reported times are whole-test-set throughput on one RTX3090; CPU baselines use 16-core parallel execution on Xeon Gold6326. AM samples **1280 routes per instance**, POMO uses **eight augmented greedy routes**, and GFACS uses **100 ants over ten pheromone iterations**. Those are different candidate budgets. LKH references use one run and 10000 trials, not certified optima. [Section 5 and Appendix C.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=8)

There are two feasibility metrics: **Sol.** is failure across all generated routes; **Inst.** is failure to find any feasible route among the candidate budget. Objective and reference gap average **only successfully solved instances**, whose sets can differ across methods. Lower conditional objective does not necessarily mean better overall performance. Appendix D.2 adds a shared-feasible-subset comparison for POMO variants. [Tables 1-2/10.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=21)

POMO's training schedule is **10000 epochs**, with PIP-decoder initial windows 200/100 epochs at size50/100, periodic updates every1000 for50/20 epochs, and a final50. AM uses100 total epochs; GFACS50. The paper reports PIP-D training about **1.5x/5.8x faster than PIP** at50/100, not the same inference speedup. A medium50 ablation lists **120h full-PIP versus60h penalty-only** training; brief PI fine-tuning is a separate cost/quality tradeoff. [Table 9 and Appendix D.3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=22)

### Main feasibility and quality results

| POMO setting | Penalty-only instance failure | PIP instance failure / gap | PIP-D instance failure / gap |
| --- | --- | --- | --- |
| Medium TSPTW50 | 3.77% | .90% / 2.91% | .65% / 3.32% |
| Hard TSPTW100 | 100% | 16.27% / .37% | 6.48% / .31% |
| Medium TSPDL100 | 32.19% | .38% / 8.08% | .23% / 8.86% |
| Hard TSPDL100 | 99.85% | 20.66% / 12.67% | 7.91% / 12.32% |

These illustrate improved feasibility but also persistent failures and quality tradeoffs. PIP-D is not uniformly better than PIP: medium TSPTW50 and TSPDL100 gaps are worse despite fewer failed instances. On hard TSPTW50, instance failures are **3.07% versus PIP's2.67%**. Main text once says6.28% for hard100, whereas the table repeatedly gives **6.48%**; this note follows the table. [Tables 1-2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=7)

For **medium TSPTW500**, GFACS* has57.81% instance failures and21.32% conditional gap; PIP gives1.56%/15.04%; PIP-D gives0%/11.95%, at6.4/6.5/6.5 reported minutes. Zero observed failures over128 cases is not a general feasibility guarantee. GFACS pheromones change during search, while no test-time neural-weight adaptation is claimed. [Table 3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=9)

On **9524 common feasible medium-TSPTW50 cases**, penalty-only/PIP/PIP-D gaps are **5.22/2.89/3.28%** with augmentation, supporting improvement on a matched subset. Inference without augmentation can behave differently: easy50 PIP's6.51% exceeds penalty-only5.95%. These detailed results limit unqualified claims of universal quality improvement. [Table 10.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=21)

### Search budgets, classical baselines and public cases

Two-step look-ahead improves hard100 PIP-D instance failure from **6.48 to5.63%**, but raises runtime from **48 seconds to35 minutes**. With one-step masking, increasing candidate count from8 to24 gives5.19% failure/.28% gap in2.4 minutes. Neither is interchangeable with the standard budget. [Tables 4-5/13.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=10)

At comparable **per-instance** latency, LKH gives better easy/medium objective values and often zero failures; at matched **batched total** runtime it frequently fails, favoring GPU throughput. The paper reports both protocols, which answer different timing questions. Optional PIP-D-initialized LKH reduces hard100 failures to.21% with100 trials and.05% with1000, taking53minutes/9hours overall. This classical post-search budget is separate from the48-second neural result. [Tables 6-7/11.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=22)

All **54 Dumas benchmark rows** were inspected. In the first27-case group, PIP/PIP-D failures are22.2/14.8%, with conditional mean gaps5.2/5.3%. In the second27-case group, PIP-D is **worse**:37.04% failures and8.50% gap versus PIP25.93%/7.44%. Several individual cases remain unsolved; solved gaps reach double digits. These results do not support robust general feasibility or successful real-world deployment. [Table 15.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=24)

Weighted balancing is essential in the reported severe class-imbalance ablation, and more decoder updates trade time for better accuracy. Appendix D.6 reports nonnormal metric distributions and Wilcoxon comparisons. Auxiliary classification accuracy is not the probability that a full route is feasible. [Appendix D.4-D.6.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=23)

## Limitations

### Reported by the Authors

- Improvements are not guaranteed for every backbone or VRP variant; broader tasks and theoretical justification remain future work.
- One-step PI approximates complete look-ahead; more steps are expensive, and decoder learning requires constraint-specific labels from the estimator.
- Large-scale rule computation and training consume resources. Early stopping PI during initial route steps is suggested for future study, not a validated default. [Section 6 and Appendix D.3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/a9d2a5fd12d34250c21b5e4fa8d906b0-Paper-Conference.pdf#page=10)

### Curator Notes

- PIP-D prediction errors may prune useful routes or miss future infeasibility. The main evaluation still uses rule masks, and neither mechanism certifies completion.
- Feasible-only gap averages and different solved subsets require reading feasibility alongside quality; references are heuristic for main synthetic cases.
- Eight augmentations,1280samples and1000ant constructions are different inference budgets. Throughput versus single-instance latency and offline training gains must remain separate.
- Generality means integration into several separately trained solvers, not one checkpoint spanning constraints/tasks; public benchmark failures are material.

## Reproducibility

- **Formal publication/full text:** [NeurIPS2024](https://proceedings.neurips.cc/paper_files/paper/2024/hash/a9d2a5fd12d34250c21b5e4fa8d906b0-Abstract-Conference.html); all **31 publisher-PDF pages including Appendices A-F and checklist**, fully reread. Publisher landing has integrated scientific material and no separate attachment; recursive official code inventory has no scientific PDF/ZIP.
- **Metadata:** seven authors and four institutions match the formal title page; Shandong University, SMU and Eindhoven were restored. [arXiv history](https://arxiv.org/abs/2410.21066) confirms first posting28October2024. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2024/hash/a9d2a5fd12d34250c21b5e4fa8d906b0-Abstract-Conference.html) explicitly records `citation_publication_date` as **2024-12-16**, independently of any paper-specific acceptance date. A generic conference notification date remains excluded from acceptance metadata.
- **Official implementation:** [jieyibi/PIP-constraint](https://github.com/jieyibi/PIP-constraint), full main/GFACS READMEs and POMO tester/default flags checked. Separate AM/POMO/GFACS directories, provided datasets, generator commands and checkpoints are documented. The current README's later CaR link is not a citation from this2024paper.
- **Figure:** original Figure3, PDFpage6, clearly distinguishes the rule estimator, routing decoder and auxiliary predictor. Main/supplement formulas, all tables and benchmark/failure plots were visually checked.
