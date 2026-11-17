---
id: urs
short_title: URS
title: 'URS: A Unified Neural Routing Solver for Cross-Problem Zero-Shot Generalization'
authors:
- Changliang Zhou
- Canhong Yu
- Shunyu Yao
- Xi Lin
- Zhenkun Wang
- Yu Zhou
- Qingfu Zhang
year: 2026
date: 2025-09-27
venue: ICML
paper_url: https://proceedings.mlr.press/v306/zhou26bg.html
arxiv_url: https://arxiv.org/abs/2509.23413
code_url: https://github.com/CIAM-Group/URS
institutions:
- Southern University of Science and Technology
- Guangdong Provincial Key Laboratory of Fully Actuated System Control Theory and Technology
- Shenzhen University
- City University of Hong Kong
- Xi’an Jiaotong University
scope: generalist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Asymmetric Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Asymmetric Capacitated Vehicle Routing Problem
- Orienteering Problem
- Prize-Collecting Traveling Salesman Problem
- Stochastic Prize-Collecting Traveling Salesman Problem
- Pickup and Delivery Traveling Salesman Problem
- Pickup and Delivery Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Duration Limits
- Vehicle Routing Problem with Time Windows
- Multi-Depot Vehicle Routing Problem
summary: A shared constructive routing policy trained on 11 native problems uses unified features, mixed geometric/relational
  bias and generated decoder projections to handle 99 additional variants without fine-tuning.
figure:
  path: paper-assets/urs/framework.png
  alt: Original URS pipeline showing unified node features, mixed-bias encoder, generated decoder projections and
    problem-presence conditioning.
  caption: 'Figure 1: original URS pipeline, illustrated on an asymmetric pickup–delivery TSP.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/zhou26bg/zhou26bg.pdf#page=3
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/zhou26bg.html
---

# URS: A Unified Neural Routing Solver for Cross-Problem Zero-Shot Generalization

> **TL;DR:** URS trains a shared constructive policy on 11 routing problems and applies it without fine-tuning to 99 additional variants. A common node representation, three geometric/relational attention branches and problem-conditioned decoder projections support this coverage. Feasibility still depends on explicit problem-specific masks, and broad coverage does not imply the best gap on every task.

## Motivation

Existing multi-task routing models cover a limited constraint vocabulary or adapt separate problem heads. URS instead combines continuous node attributes, structural roles, asymmetric distances and pickup–delivery relations in one representation. Its experiments test combinations within that representation; arbitrary new constraint semantics and dynamic VRPs remain outside the established results. [pp. 1–5, 9, 13–19]

## Contributions

- A Unified Data Representation (UDR) combines three positional scalars, six attributes and five node-role indicators. A separate 13-slot presence vector conditions the model; the coordinate pair occupies one presence slot.
- A Mixed Bias Module (MBM) combines outgoing distance, incoming distance and optional pickup–delivery relation branches.
- Hypernetworks generate attention-bias coefficients and decoder projection matrices, allowing one trained policy to construct routes across 110 evaluated variants. [pp. 3–5, 16–21]

## Methodology

Node inputs contain a random identifier for asymmetric problems, coordinates where applicable, demand/prize/penalty/time attributes and depot/pickup/delivery/subroute/open-route roles. Three learned linear maps sum these components into initial embeddings. The multi-hot vector λ records active feature types rather than raw values. It does not uniquely encode every constraint: B and BP share feature-presence patterns, while their masks impose different ordering rules. [pp. 3–4, 14–19]

Each of 12 encoder layers applies three attention branches biased by normalized D, Dᵀ and relation matrix R. R is zero for a defined pickup–delivery pair and one otherwise; its branch is zeroed when no relation is supplied. Concatenation and a linear map fuse the outputs, followed by residual instance normalization and an FFN. Attention uses the ICAM adaptation-attention-free formulation, with distance bias proportional to −α log₂(N)d and no size factor for R. This retains quadratic pairwise complexity O(N²d); “attention free” does not mean linear complexity in instance size. [pp. 4–5, 20–22]

The decoder uses first/last-node embeddings and at most one scalar: remaining load, remaining OP travel budget or remaining required prize. Other dynamic constraints, including time windows, are handled through feasibility masks. A compressed hypernetwork generates first-node, last-node, scalar-state, key and value projections from λ; a separate bias generator conditions distance preferences. Clipped pointer logits and masked greedy or sampled selection append nodes until a complete route solution is obtained. Shared-baseline REINFORCE trains the policy. [pp. 5, 20–22]

**Classification:** Generalist / constructive. One multi-task checkpoint serves distinct native problems, including ATSP, TSP, OP, PCTSP, PDTSP and capacitated/open/time-window/backhaul routing. The 11 URS-STL controls are separately trained specialists. Neither multi-start decoding nor geometric augmentation establishes a neural operator that edits a complete incumbent. [pp. 6, 17–22]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Training tasks | ATSP, TSP, CVRP, ACVRP, OP, PCTSP, PDTSP, CVRPTW, OCVRP, CVRPB and OCVRPTW |
| Multi-task budget | Size 100; 500 epochs × 2,000 batches × 128 = 128 million generated instances; one uniformly sampled task per batch |
| Model and optimizer | 12 encoder layers; width 128; FFN 512; hypernetwork hidden width 256; clipping 50; AdamW 10⁻⁴, weight decay 10⁻⁶, LR ×0.1 at epoch 451 |
| Hardware and duration | One RTX 4090 24 GB; approximately 95 reported training hours; classical solvers use an Intel Xeon Gold 6240R CPU |
| Specialist controls | Same architecture and ordinary hyperparameters, but 300 epochs and decay at 251; approximately 76.8 million instances per specialist |
| Main inference | 1,000 instances per variant; best multi-start result with ×8 symmetric or ×128 asymmetric augmentation; MD uses three depots and 3N trajectories |
| Large-scale tests | Three synthetic variants, 16 instances per size from 1,000 to 5,000; Set-AGS has four 3,000–7,000-node instances |

- **Native performance:** The multi-task model reports TSP/CVRP/ATSP gaps of 0.57%/1.81%/2.26%, versus its specialist controls' 0.08%/1.63%/0.62%. CVRPTW is 6.13% versus ReLD-MTL's 4.56%; CVRPB is 1.46% versus 0.90%. The contribution is coverage with shared weights, with a measurable specialization tradeoff. [pp. 6–7]
- **Unseen variants:** Tables 15–16 cover 44 established and 55 less-explored held-out variants. Improvements on many multi-depot combinations coexist with losses: OCVRPB is 9.35% versus ReLD-MTL's 5.36%, and MDCVRPTW is 37.26% versus 30.90%. Some asymmetric combinations retain gaps above 40%; ASPCTSP reports objective 2.22 without a reference solver. These tables do not establish wins on all 99 problems. [pp. 7, 18–19, 23–24]
- **Scale transfer:** URS improves over the compared multi-task neural models on the three large synthetic families. CVRPB gaps against PyVRP are negative, whereas CVRPTW and OCVRPTW remain roughly 8–9% above that heuristic reference. On the four Set-AGS instances its reported mean gap is 13.29%. These are heuristic-reference comparisons, not certificates of optimality. [pp. 7–8]
- **Set-X:** Table 20 lists 32 instances, X-n502 through X-n1001, corresponding to 501–1,000 customers. Mean gaps are 8.678% for URS, 12.836% for LEHD and 12.303% for RF-TE. Individual losses include X-n670-k130 at 25.748% versus RF-MVMoE's 14.962%, and X-n936-k151 at 30.110% versus 21.571%. [pp. 26, 28]
- **Matched comparisons:** Different backhaul/time-window definitions and training coverage prevent treating all original RF/CaDA results as directly comparable. A six-task aligned subset gives URS five best results; OCVRP remains worse than CaDA. A separate 150-epoch retraining comparison stops at RF's reported NaN training limit and gives URS 32/48 best results, while CaDA wins all five listed native task cells. [pp. 26–27]
- **Ablations:** Full URS gives mean gap 2.74% over 11 seen tasks and 7.05% over 11 selected unseen tasks. The 22-task combined mean is 4.89%; unaugmented UDR ablations use a different inference budget and yield 6.34% overall. Hypernetwork versus adapter means are 2.74% versus 3.37%, with 10/11 wins; OCVRPTW is a negative case at 5.07% versus 4.94%. [pp. 8–9, 25, 29–32]

## Limitations

### Reported by the Authors

- Uniform task sampling does not fully address differences in task complexity; difficulty-aware or hierarchical training and dynamic VRPs are future work. [p. 9]

### Curator Notes

- UDR reduces explicit problem enumeration but still needs defined attributes, generators, objective semantics, relation construction and feasibility masks. It does not establish zero-shot support for arbitrary unseen feature types.
- Time columns are total test-set times. Neural GPU batches, CPU reference settings, multi-start counts and augmentation differ. Main text gives a 20-second limit for PyVRP/OR-Tools, while tables report differing aggregate oracle times; a uniform per-instance latency claim cannot be inferred from those columns.
- Eq. 16 writes a positive score-function expression while defining f as reward. The public trainer minimizes **−advantage × log-probability**, the reward-maximizing sign. The printed expression should be interpreted as a reward gradient rather than copied directly as a minimization loss.
- Eq. 6 prints max(1,z), while `Adaptation_Bias_Module` returns ReLU(z)+1. Both enforce a lower bound of one but differ for identical preactivation z. The hypernetwork's consecutive affine maps have no intervening activation in Eq. 13 or the checked release; no extra hidden nonlinearity is assumed here.
- The released data loader can use placeholder reference scores when solution files are missing. Such fallback gaps are not benchmark evidence. No training or benchmark reproduction was performed during this review.

## Reproducibility

- **Published paper:** [ICML 2026 / PMLR 306](https://proceedings.mlr.press/v306/zhou26bg.html), issued 2026-09-29. All 32 formal pages, complete references, Appendices A–L and all four figures were read and checked. The initial cached arXiv v3 differs on pages 9–13; the formal PDF was registered before this complete review and its text governs the note.
- **Official materials:** [Source](https://github.com/CIAM-Group/URS), [poster](https://icml.cc/virtual/2026/poster/61527), [models](https://drive.google.com/drive/folders/11d_Ot9hMOeDRAENP9XtgH_H3n1UhvYHO) and [data](https://drive.google.com/drive/folders/1Ptj4a78kZUITdvp7DW3tPw5D0o9wHne5). The full official poster was visually read. The 45-member source archive contains no additional scientific PDF, notebook or video. The model folder lists 11 specialist checkpoints and one unified checkpoint. A complete ZIP central-directory inventory of the 2.62 GB data archive finds 704 entries, consisting of routing data/reference files and directories, with no further scientific document or nested archive. Binary datasets/checkpoints were inventoried, not executed or independently reproduced.
- **Supplement check:** PMLR exposes the complete paper and official software without a separate supplement link. OpenReview API access returned 403 and was not counted as inspected content.
- **Implementation checks:** Read model representations, three-branch encoder, generated decoder projections, scalar context, AAFM, bias module, trainer loss/configuration, task lists and inference defaults. The repository uses `unified_checkpoint_500.pt` by default across its 110 defined tasks.
- **Relations and figure:** Internal relations are explicit full-reference identities, including formal SIL's seven-author title, RouteFinder's nine-author TMLR version and MTPOMO's complete title. Source online/issue years are preserved without overwriting the cited paper's verified metadata. The framework is original formal Figure 1.
