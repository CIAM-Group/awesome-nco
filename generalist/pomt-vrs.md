---
id: pomt-vrs
short_title: PoMtVRS
title: 'PoMtVRS: Preference-Optimized Multi-Task Vehicle Routing Solver with Preference Gating'
authors:
- Dian Meng
- Yaoxin Wu
- Yaqing Hou
- Zhiguang Cao
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/meng26m.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/meng26m.html
institutions:
- Dalian University of Technology
- Eindhoven University of Technology
- Singapore Management University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Duration Limits
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Mixed Backhauls
- Multi-Depot Vehicle Routing Problem
summary: Head-wise decoder gating and within-instance strict-pair preference optimization train a shared constructive
  VRP policy; separate MVMoE/CaDA, size and optional active-search configurations are evaluated.
code_url: https://github.com/Regina921/PoMtVRS
figure:
  path: paper-assets/pomt-vrs/framework.png
  alt: PoMtVRS adds a preference-gated decoder block and ranks sampled routes with a Bradley–Terry loss.
  caption: 'Figure 1: original formal PoMtVRS architecture and pairwise-preference training.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/meng26m/meng26m.pdf#page=4
---

# PoMtVRS: Preference-Optimized Multi-Task Vehicle Routing Solver with Preference Gating

> **TL;DR:** A preference-gated decoder block and within-instance Bradley–Terry ranking loss improve separately trained MVMoE/CaDA routing backbones. Models train on all 16 native variants and are tested on 32 unseen MB/MD variants. “Preference” means the cost ordering of candidate routes, rather than a multi-objective weight vector or human feedback.

## Motivation

PoMtVRS targets limited decoder adaptation when constraints change, and sensitivity of reward-based training to task-dependent cost scales. It adds state-conditioned decoder modulation and trains from relative route rankings. Ranking still requires computing the routing objective and sampling candidates; this is not optimization without reward/cost information. [pp. 1–3]

## Contributions

- Adds a Preference-Gated Block (PGB) between concatenated attention-head outputs and compatibility scoring.
- Uses all ordered candidate pairs within an instance to train log-likelihood differences against strict cost-based preferences.
- Evaluates two separately instantiated backbones, size transfer, unseen constraints and an optional efficient-active-search/LoRA extension. [pp. 4–9, 23–24]

## Methodology

PGB reshapes the attention output by head and multiplies each head by a sigmoid gate computed from current-node/vehicle context. A second branch projects five dynamic attributes—remaining linehaul/backhaul capacity, current time, route length and open-route status—and adds the current-node embedding. Residual normalization and a feed-forward/gated MLP fuse the branches before masked pointer scoring. The sigmoid head gates are continuous modulation: the paper/release does not establish exact head pruning or skipped attention computation. Sparse top-k encoder attention and MoE expert routing are distinct backbone mechanisms. [pp. 5–6, 17–18; released decoder]

For P candidate routes, compute each route's summed action log-likelihood ℓᵢ and negative cost rᵢ. Center rewards within the instance and define yᵢⱼ=1 only when rᵢ>rⱼ. Minimize −P⁻² Σᵢⱼ yᵢⱼ log sigmoid(α(ℓᵢ−ℓⱼ)), with α=0.03 in the main runs. Diagonal and tied-reward pairs contribute zero. This is the positive ordered-pair loss printed in Eq. 20, rather than a second negative-label BCE term or a reference-policy KL objective. The release differentiates log-likelihoods for the sampled trajectories while treating their rank labels as fixed. [pp. 5–6; `trainer.py`]

**Classification:** Generalist / constructive. Each trained model shares weights across all 16 C/O/B/L/TW routing variants. Backhaul B requires linehaul-before-backhaul, while the unseen MB variants remove that ordering; MD uses three depots. Size-50/100 models and the MVMoE/CaDA instantiations are separate checkpoints. EAS changes parameters of added modules and generates routes again; it does not establish a learned operator that directly edits a complete incumbent, so the optional search does not change this classification. [pp. 3, 8–9, 14–18, 23]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Training | All 16 native variants; separate size-50/100 models; 300 epochs × 100,000 generated instances = 30 million; batch 256 |
| Architecture | Six encoder layers, one decoder layer, width 128, eight heads, FFN width 512; backbone-specific expert/sparse attention components |
| Optimization | Learning rate 3×10⁻⁴, weight decay 10⁻⁶, milestones 270/295, gradient clipping 1; one V100 32 GB; Table 7/release use AdamW, while main prose says Adam |
| Main tests | 1,000 instances per task/size; greedy multi-start decoding with eight geometric augmentations; heuristic-reference gaps |
| Unseen constraints | 16 MD, eight MB and eight MDMB variants; zero-shot use of trained routing parameters |

- **Native tasks:** Reported mean CaDA gaps improve from 1.721%/2.844% to 1.405%/2.205% at sizes 50/100. MVMoE improves from 2.227%/3.680% to 1.809%/2.951%. These per-backbone gains coexist with losses to other solvers: OVRP50 is 2.010% versus MoSES(CaDA)'s 1.857%, and OVRPL50 is 2.004% versus 1.846%. The CaDA-based method takes roughly 4–5 seconds per 1,000 size-50 instances and 17–20 seconds at size 100, versus CaDA's 3/13–14 seconds; it is faster than the listed MoSES configuration but slower than the original backbone. [pp. 7–8]
- **Unseen constraints:** At size 50 the reported MD/MB/MDMB mean gaps are 34.807%/7.770%/43.827%; at 100 they are 39.812%/10.936%/51.281%. These improve the listed group means, but large remaining heuristic-reference gaps limit a claim of near-optimal performance. No detailed per-variant table establishes dominance on each of the 32 tasks. [p. 9]
- **CVRPLib:** The article reports an overall gap of 8.326% on 100 Set-X instances versus CaDA's 9.230% and RF-TE's 8.428%. In its largest reported bin, however, RF-TE is better: 12.253% versus 12.651%. Individual losses include X-n167-k10 at 5.380% versus CaDA's 2.534%, and X-n766-k71 at 17.499% versus MoSES's 10.462%. The consistency check below qualifies the published aggregate. [pp. 9, 21–22]
- **Ablations and sensitivity:** Full PGB+PO has the best reported aggregate among the ablations, but not every task cell: removing state mapping improves CVRP50 to 0.833% from 0.843%. Temperature selection is consequential: α=0.08/0.1 gives reported mean gaps of 258.950%, versus 1.405% at 0.03. This grid search does not establish universal variance reduction or unconditional stability. [pp. 8, 19–21]
- **Test-time search:** On CVRP50, base/EAS/EAS-LoRA report 0.843%/0.144%/0.273% with 4 seconds/16.4 minutes/6.4 minutes over 1,000 instances. At CVRP100 the EAS and LoRA totals are 1.32/1.03 hours. These are adapted search results with substantially larger budgets. Appendix D does not specify the update count, learning rate, LoRA rank or exact projection targets, so the search is not fully reproducible from its description alone. [pp. 23–24]

## Limitations

### Reported by the Authors

- Richer real-world constraints, broader distributions, larger scales and better deployment efficiency remain future directions. [p. 9]

### Curator Notes

- Main gaps compare with time-limited heuristic results, not certified global optima. Task coverage, different backbones, separate scale checkpoints and optional adapted search should not be merged into one unchanged universal policy.
- The mean of the 100 displayed, rounded PoMtVRS gaps in Table 9 is approximately **8.424%**, rather than the reported **8.326%**. RF-TE's corresponding displayed-row mean is approximately 8.428%. This is an arithmetic check of the published table, not an independent benchmark rerun; underlying raw measurements were not available to resolve it. Bin boundaries also mix customer counts and instance filename node counts, so the all-100 check avoids that ambiguity.
- Appendix D's VRPBTW100 EAS row prints objective 15.768 with gap 0.926% against reference 29.467, whereas the adjacent method rows have objectives near 30. This cell cannot be treated as a verified numerical improvement without clarification. No corrected objective is invented.
- Main/Table 7 optimizer naming, Table 2/Table 8 gate-ablation averages and the TW definition differ: main text uses latest service start, while Appendix A Eq. 29 requires service completion by that time. The release uses arrival-before-latest plus return-to-depot checks. These versions must be aligned before reproducing comparisons.
- Current size-100 scripts default to batch 64 and 391 steps, unlike the printed batch 256/100,000 instances per epoch. Override settings are necessary for the paper's budget. The released source has no confirmed EAS/LoRA implementation. Such release differences do not show what settings the published runs actually used.

## Reproducibility

- **Published paper:** [ICML 2026 / PMLR 306](https://proceedings.mlr.press/v306/meng26m.html), published 2026-09-29. All 24 pages, full references and Appendices A–D were read, including all 100 CVRPLib instance rows and every EAS comparison cell. The two original method figures were visually checked.
- **Official materials:** [Source](https://github.com/Regina921/PoMtVRS), [data/checkpoints](https://huggingface.co/datasets/Regina921/PoMtVRS/tree/main) and [official poster](https://icml.cc/virtual/2026/poster/60922). The full poster was visually read. The 80-member source archive and 495-entry linked data tree contain no extra scientific PDF, notebook, archive or video. Four size/backbone checkpoint files are listed separately. The publisher exposes the full paper without a separate supplement; OpenReview API access returned 403 and was not counted as inspected content.
- **Implementation checks:** Read the exact strict-pair loss, sampled-trajectory update, CaDA head gates/state branch, train configuration, optimizer and time-window masks. The rank/aggregation consistency check uses only printed values. No model training or benchmark reproduction was performed.
- **Relations and figure:** Relations use explicit full bibliography identities, including GOAL's source “Learning” versus formal “Learner” wording and POCCO's publication year versus venue year. The framework is original formal Figure 1.
