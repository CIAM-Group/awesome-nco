---
id: omni-vrp
short_title: Omni-VRP
title: Towards Omni-generalizable Neural Methods for Vehicle Routing Problems
authors:
- Jianan Zhou
- Yaoxin Wu
- Wen Song
- Zhiguang Cao
- Jie Zhang
year: 2023
date: '2023-05-31'
venue: ICML
paper_url: https://proceedings.mlr.press/v202/zhou23o.html
arxiv_url: https://arxiv.org/abs/2305.19587
institutions:
- Nanyang Technological University
- Eindhoven University of Technology
- Shandong University
- Singapore Management University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: Size/distribution meta-training with hardness-aware scheduling and a second-to-first-order switch improves
  task-specific routing models; POMO construction and L2D improvement are evaluated separately, with explicit zero/few-shot
  budgets.
figure:
  path: paper-assets/omni-vrp/framework.png
  alt: Meta-training framework over size/distribution tasks with hierarchical task selection and inner/outer updates,
    followed by task adaptation.
  caption: 'Figure 1: meta-training and task adaptation; POMO construction and L2D improvement are separate instantiations.'
  source_url: https://proceedings.mlr.press/v202/zhou23o/zhou23o.pdf#page=4
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/zhou23o.html
code_url: https://github.com/RoyalSkye/Omni-VRP
---

# Towards Omni-generalizable Neural Methods for Vehicle Routing Problems

> **TL;DR:** Meta-train routing models across instance sizes and coordinate distributions, using a hardness-aware scheduler and an initial second-order phase before first-order updates. The paper studies zero-shot transfer and fast task adaptation within TSP or CVRP, with distinct models and inference budgets.

## Motivation

Policies trained only on uniform instances of a fixed size can fail when both size and distribution change. The goal is to learn a useful initialization from diverse data and enable adaptation to new instance classes with little extra data, rather than train a universal solver for every routing formulation (Sections 1–3).

## Contributions

- A model-agnostic, MAML-style training framework over tasks defined by **size and node distribution**.
- A hierarchical scheduler that gradually increases size and favors distributions with larger gaps to fixed LKH3 validation references.
- An empirical second-order-to-first-order switch that reduces training cost, evaluated primarily on POMO construction and separately on supervised L2D subproblem selection.

## Methodology

**Meta-training.** Initialize a task model from meta-parameters, update it on task-specific training instances and evaluate it on distinct validation instances; backpropagate the latter loss through inner updates to train the initialization. The scheduler uses a size curriculum and softmax weights from relative gaps to fixed LKH3 solutions, refreshed every 100 iterations. Main POMO settings use one task and one inner update per meta-iteration. The practical approximation uses second-order updates for the first 50,000 iterations, then first-order updates through iteration 250,000 (Section 4; Algorithm 1).

**Inference modes.** Zero-shot constructs routes with the unchanged model for that native problem. Few-shot adapts that model on additional instances from the new size/distribution before evaluating distinct test instances. EAS instead adapts instance-specific parameters and appears in additional benchmark experiments. These are different protocols and should not share a zero-shot label.

**Classification.** The 341 training tasks are 31 sizes (50–200 in steps of five) times eleven coordinate distributions, not 341 native optimization problems. TSP and CVRP use distinct problem models. The collection retains specialist scope and uses the primary POMO instantiation's **constructive** paradigm. Appendix D.5 is a separate meta-trained **improvement** instantiation of L2D; it is not an improvement stage attached to POMO and does not turn the primary solver into a learned two-stage hybrid. No VRPTW evaluation is reported.

## Experiments

- **Main training:** Compare methods using approximately 32 million instances: 250,000 paired inner/outer meta-updates versus 500,000 ordinary POMO updates. Batch size is 64, reduced to 32 for larger training instances; use Adam and default batch normalization without tracked running statistics. The task set contains uniform/Gaussian-mixture data, while rotation/explosion distributions provide additional shifts. CVRP demands are 1–9 and capacity is ceil(30 + n/5). Classical solvers use 32 CPU cores; neural methods use one A100 GPU (Appendices B–D.1).
- **Cost of training:** The approximation reports 2.5 days/17 GB for TSP and three days/25 GB for CVRP, compared with five days/53 GB and six days/71 GB for full second-order training. Matching instance counts does not equate computation or wall time. These are separately reported task-specific training runs, not one joint TSP/CVRP model.
- **Quality and adaptation:** On CVRP300 uniform, POMO's 5.74% gap becomes 4.10% for the default method and 3.92% with one few-shot update. On TSP1000 rotation, gaps are 21.38%/19.36%/14.30% for POMO/default/default plus one update, with total times 0.8/0.8/6.5 hours over 1,000 test instances. Few-shot uses 1,000 extra, distinct adaptation instances. All neural test modes use greedy rollouts with eightfold augmentation. TSP references are Concorde optima; CVRP references are HGS solutions, not certified optima (Tables 1–2).
- **Limits of the gains:** Results are not uniformly better. For example, default TSP200 on the unseen GM(2,5) distribution gives 2.71% versus retrained POMO's 2.56%. TSPLIB/Set-X tables contain additional losses, and EAS itself is worse than the reported unadapted result on some instances. The generated XML4000_2153 case gives 52.24% for the proposed method versus Meta-POMO's 14.78%. The larger XML500–5000 cases are newly generated extensions with HGS references, rather than original optimal XML100 instances (Tables 5–7).
- **Separate L2D experiment:** Meta-train a regression-based subproblem selector on six mixed CVRP size/distribution classes, using HGS with one-second subproblem limits. Evaluate ten instances per test class. Several classes improve substantially, but others favor a retrained L2D baseline. Its second-order training takes nine hours on a V100; the release explicitly omits the task scheduler and reports unstable first-order training for this instantiation (Appendix D.5/E and code README).

## Limitations

The authors identify training efficiency, memory use, scalability and sensitivity to the base model/meta-learning algorithm. Pretraining may help initialization. The tested distributions cover only a small part of possible instances, and training on larger sizes does not ensure strong small-instance performance.

Appendix A is a simplified SGD/Taylor discussion plus empirical gradient-direction comparisons; the authors explicitly note the difficulty of extending that derivation to their Adam/RL setting. It does not prove a universal approximation or convergence guarantee for the implemented method. Few-shot adaptation and EAS incur extra computation and must be kept separate from direct inference. Baseline models marked with an asterisk were trained under narrower settings and serve as shift illustrations, while retrained baselines support the main comparison.

## Reproducibility

- **Sources:** All 21 publisher pages were freshly read, including the complete bibliography and Appendices A–E. The official proceedings page links this complete PDF and no separate scientific supplement. The author-released 4,000-by-2,667 poster was also read through four full-coverage image tiles; its hash and local path are recorded separately without inventing PDF pages.
- **Metadata:** The formal PMLR HTML gives publication date **3 July 2023**; the arXiv v1 history confirms first public date **31 May 2023**. Four affiliations are stated in the PDF: NTU, Eindhoven University of Technology, Shandong University and Singapore Management University. The previous NTU-only entry and calendar-derived acceptance date are corrected.
- **Official code:** [RoyalSkye/Omni-VRP](https://github.com/RoyalSkye/Omni-VRP). README, separate TSP/CVRP training configurations and L2D protocol sections were inspected. The training scripts default to full `maml`; reproducing the paper's approximation requires selecting `maml_fomaml`. The README warns that some supplied checkpoints may be outdated and recommends retraining. No training or routing experiment was rerun in this audit.
- **Figure:** Figure 1 is reproduced directly from publisher PDF page 4 with its complete caption. It illustrates meta-training and adaptation, not a neural route-repair pipeline. Explicit citations are matched to existing IDs, with older arXiv-title aliases documented where needed.
