---
id: mvmoe
short_title: MVMoE
title: 'MVMoE: Multi-Task Vehicle Routing Solver with Mixture-of-Experts'
authors:
- Jianan Zhou
- Zhiguang Cao
- Yaoxin Wu
- Wen Song
- Yining Ma
- Jie Zhang
- Chi Xu
year: 2024
date: 2024-05-02
venue: ICML
paper_url: https://proceedings.mlr.press/v235/zhou24c.html
arxiv_url: https://arxiv.org/abs/2405.01029
code_url: https://github.com/RoyalSkye/Routing-MVMoE
institutions:
- Nanyang Technological University
- Singapore Management University
- Eindhoven University of Technology
- Shandong University
- Singapore Institute of Manufacturing Technology, A*STAR
scope: generalist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Duration Limits
summary: A task-shared POMO policy uses sparse experts for sixteen capacitated VRP variants; hierarchical dense/sparse
  decoder gating trades a modest synthetic-quality loss for lower training cost, with limited large-instance generalization.
figure:
  path: paper-assets/mvmoe/framework.png
  alt: Shared autoregressive VRP policy with MoE encoder feed-forward blocks and a top-two expert decoder projection.
  caption: 'Figure 2: MVMoE model, explicit feasibility masks and sparse expert routing.'
  source_url: https://raw.githubusercontent.com/mlresearch/v235/main/assets/zhou24c/zhou24c.pdf#page=4
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/zhou24c.html
---

# MVMoE: Multi-Task Vehicle Routing Solver with Mixture-of-Experts

> **TL;DR:** A shared POMO-style policy solves sixteen capacitated VRP variants using sparse mixture-of-experts layers. A hierarchical decoder gate chooses between a sparse expert layer and a dense projection, reducing training cost with a modest in-distribution quality tradeoff; large-instance generalization remains limited.

## Motivation

Separate neural networks for every VRP variant multiply training and deployment costs. Attribute composition permits task sharing, but a small dense policy can have limited capacity. Sparse experts increase parameter capacity while activating only a subset for each input. Autoregressive decoding makes expert dispatch expensive, motivating a cheaper hierarchical gate.

## Contributions

- MoE layers replace encoder feed-forward networks and the decoder attention output projection.
- A hierarchical gate selects a dense projection or a sparse expert layer for a batch, followed by node-level expert routing in the sparse branch.
- One policy trains on six VRP variants and transfers directly to ten unseen combinations of the same attributes.
- Experiments study expert count, routing granularity, load balancing, target-task fine-tuning and external benchmark generalization.

## Methodology

**Task interface.** Coordinates, signed demand and time-window endpoints form static node features. The current-node embedding, remaining capacity, current time, route length and open-route indicator form decoder context. Explicit environment rules update state and mask infeasible actions, including interactions between open routes and return-to-depot duration/time-window constraints. Missing attributes receive default values. Mixed backhauls are unpaired signed-demand customers; paired pickup-and-delivery precedence is not an evaluated task.

**Model and training.** The POMO backbone has six encoder layers, eight heads, embedding width 128 and feed-forward width 512. MVMoE/4E uses four experts, normally routing each input to its top two. Noisy input-choice routing and an importance/load auxiliary loss encourage balanced use. REINFORCE with POMO's shared baseline trains one task-shared policy, sampling a homogeneous task for each batch. MoEs are components of the neural policy, rather than four complete independent routing solvers.

**Hierarchical variant.** MVMoE/4E-L retains sparse encoder layers but routes the decoder through either a dense projection or a sparse MoE. The first gate pools a batch-level representation and samples a branch; the second gate dispatches inputs to experts. This is the paper's problem-level routing mechanism, not a proof of a semantically interpretable expert for each problem. The model constructs routes autoregressively; no learned incumbent editing is part of its main POMO pipeline. Size-50 and size-100 training produce separate checkpoints, while each checkpoint covers multiple native VRP variants.

## Experiments

- **Data/budget:** Train on CVRP, OVRP, VRPB, VRPL, VRPTW and OVRPTW; evaluate all sixteen combinations of capacity with open routes, backhauls, duration and time windows. Uniform coordinates, integer demand 1–9, capacities 40/50 at sizes 50/100, 20% backhauls, duration limit three and explicitly generated time windows define the synthetic distributions. Training uses 5,000 epochs of 20,000 instances, batch size 128, Adam at 0.0001 and weight decay 0.000001. MoE auxiliary weight is 0.01. Main experiments use A100-80GB GPUs; classical solvers run 32 instances on 32 CPU cores.
- **Inference/reference:** Greedy node selection with eightfold augmentation is used on 1,000 test instances per setting; table times are totals over the set. Gaps use the best listed classical solver as reference, often finite-budget OR-Tools, HGS or LKH3, not certified optima. OR-Tools receives 20/40 seconds per instance or tenfold longer in the comparison setting.
- **Quality tradeoff:** Four-expert routing improves the dense POMO-MTL baseline, but independently trained POMO remains stronger on each seen task. On unseen OVRPBLTW100, gaps are 10.498% for dense MTL, 10.009% for 4E and 10.263% for 4E-L. Broad superiority wording does not cover every light-model cell: at OVRPB50, 4E-L's 6.522% is worse than dense MTL's 6.430%. Hierarchical gating reduces training time by around 23% in the reported setting; it does not make the model universally faster than the dense baseline.
- **Scaling/adaptation:** Ablations use 2,500 epochs/50 million instances. Increasing experts from 4 to 8/16 is also tested with 50/100/200 million instances and batch sizes 128/256/512, so those gains do not isolate expert count. Optional few-shot fine-tuning uses 10,000 target-task instances per epoch on two unseen variants; its curves are adaptation results rather than unchanged zero-shot inference. Auxiliary loss, normalization and gating choices materially affect results.
- **External benchmarks:** On the selected smaller Set-X cases, mean gaps are 9.820% for dense MTL, 6.884% for 4E and 5.160% for 4E-L; Solomon means are 21.380/20.317/18.490%. On the thirty-two large Set-X cases, however, dense MTL's 16.796% beats both 4E's 26.408% and 4E-L's 19.607%. A separate supervised LEHD experiment, trained for twenty epochs, improves mean greedy gap from 12.836% to 9.678% using hierarchical experts; with 100 random-reconstruction iterations, means are 7.001/6.884%. This is a separately trained CVRP experiment, not the task-shared POMO policy or a uniform per-instance win.

## Limitations

Zero-shot composition is limited to predefined attributes and their supplied feasibility logic. New constraint types are future work. Sparse activation reduces arithmetic but still requires all experts in memory. The large-instance degradation, modest synthetic gains and different training/search/hardware budgets limit broad efficiency or robustness claims. Table 6's size-1,000 batch-one times are roughly one to three seconds, with MVMoE generally slower than dense MTL; a small latency does not itself establish competitive solution quality. The proposed explanation connecting OOD imbalance to failure is empirical, not a proved generalization theorem.

**Current code qualification:** In `MOEModel_Light.py`, lines 323–325 compute the upper gate's probability vector only at decoding step two and reuse it while sampling branches at later steps. This differs from describing the upper gate as recomputing a new current-state distribution at every decision; the source comment explicitly notes how to remove that condition. Gate sampling also remains stochastic even when node selection uses argmax. The observation concerns the inspected release, without establishing which revision generated the published measurements.

## Reproducibility

- **Full text/supplements:** Freshly read all twenty-one pages of the formal PMLR paper, including references and Appendices A–D. The author repository contains a one-page scientific ICML poster, also extracted, SHA-registered and fully read. The 16,241-byte author-hosted review compilation was read separately; reviewer suggestions are not treated as published paper results or citation edges. The 298-member archive has no other PDF, notebook, nested archive or video.
- **Metadata:** First arXiv publication is 2 May 2024. Official PMLR HTML explicitly records publication on **8 July 2024**, separate from the 21–27 July meeting dates. A generic notification date has been removed from acceptance metadata. The PDF/author README use **Chi Xu**, while the PMLR HTML/BibTeX reverse this to **Xu Chi**; the note preserves the author-provided form and records the discrepancy. Actual affiliations comprise NTU, SMU, Eindhoven, Shandong and SIMTech/A*STAR.
- **Code:** [RoyalSkye/Routing-MVMoE](https://github.com/RoyalSkye/Routing-MVMoE), branch `main`, provides all sixteen environments, models, pretrained checkpoints and baseline scripts. README, key model/gate/environment routines were inspected. The backhaul environment adds an upper capacity mask and special handling of pickup-only remaining routes, so the earlier MTPOMO implementation's one-sided mask should not be attributed unchanged to this code. No training or benchmark reproduction was run.
- **Figure/relations:** Original Figure 2 is cropped from formal PDF page 4 with the complete model and caption. Main and appendix tables/plots were rendered and checked. 38 exact references match existing repository entries, using author-year labels; similar but distinct 2-opt/3-opt or generalization papers are not merged.
