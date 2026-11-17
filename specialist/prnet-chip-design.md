---
id: prnet-chip-design
short_title: PRNet
title: The Policy-gradient Placement and Generative Routing Neural Networks for Chip Design
authors:
- Ruoyu Cheng
- Xianglong Lyu
- Yang Li
- Junjie Ye
- Jianye Hao
- Junchi Yan
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/a8b8c1ad51df1b93d9e3d1fca75debbf-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/a8b8c1ad51df1b93d9e3d1fca75debbf-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
- Huawei Noah's Ark Lab
- Shanghai AI Laboratory
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
- Routing
problems:
- Mixed-size Macro Placement
- Global Routing
summary: Size-aware PPO macro placement and generative net routing share a chip pipeline with learned ordering,
  classical repair and measurable legality/runtime trade-offs.
code_url: https://github.com/Thinklab-SJTU/EDA-AI
figure:
  path: paper-assets/prnet-chip-design/framework.png
  alt: Original PRNetFigure3 showing sequential macro placement, net-order selection, generative routing and alternating
    router/PPO updates.
  caption: 'Figure3: neural macro placement and routing pipeline, with original complete caption.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/file/a8b8c1ad51df1b93d9e3d1fca75debbf-Paper-Conference.pdf#page=6
---

# The Policy-gradient Placement and Generative Routing Neural Networks for Chip Design

> **TL;DR:** PRNet combines size-aware macro placement, image-based generative routing and learned net ordering. The paper reports lower placement overlap and better macro-only pipeline metrics, but residual overlap, routing failures and runtime/overflow trade-offs remain. Disconnected routes explicitly use classical maze repair.

## Motivation

Macro size and existing fixed blocks complicate grid-based placement. Grid-step RL routers are slow and have difficulty scaling beyond small layouts. PRNet predicts a whole route image per net and feeds neural-router wirelength back to placement/net-order policies. The scope is **global routing**, with detailed physical routing excluded (Sections1–2).

## Contributions

- Size-aware macro footprints and preplaced-block occupancy extend a PPO placement agent.
- A conditional ResNet-style generator adapts from64×64 to128×128 grids, with separate connectivity and realness discriminator heads.
- Focal, reconstruction and HPWL-regularization terms train sparse route predictions.
- An EM-inspired alternating pipeline couples the router with placement and net-order learning; sequential and batched routing expose quality/runtime trade-offs (Sections3–4).

## Methodology

**Placement.** The state includes an occupied-layout image and netlist graph. A CNN and three-layer GCN with16/32/16channels produce policy features. A candidate macro center is masked if its footprint intersects occupancy; fixed macros are included in the initial image. PPO receives a terminal negative weighted sum of wirelength, congestion and overlap. Standard cells in the complete-placement experiment are placed by the GPU gradient-based DREAMPlace component, not by a shared trained neural cell-placement policy (Section3.1/4.2).

**Single-net routing.** Input channels encode pin positions and available horizontal/vertical grid capacity. The generator outputs one route-pixel score; thresholding produces a candidate route. Smaller layouts are padded to64×64. For larger grids, a downsampled guiding network and a filling network combine feature maps; submodules are pretrained before joint fine-tuning. No latent random noise is used in the initial design. A connectivity-label discriminator and realness discriminator share early layers. Their learned scores are not hard connectivity/capacity certificates: Section3.2 expressly invokes **maze routing to refine disconnected outputs**.

**Loss and pipeline.** Adversarial loss is combined with focal loss, L2 and distance between generated length and HPWL. SupplementA.3.1 sets discriminator weights.5/.5, focalα=.5/γ=2, reconstruction/focal multipliers5,000 and length multiplier.1. HPWL is a lower bound for a connected rectilinear net, not a certificate that a generated image is connected or shortest. Routing is trained on classical NCTU-GR labels. Router updates alternate with joint PPO updates for placement/net ordering; reward interpolates HPWL and router wirelength withλ=1−exp(−.01·iteration). The EM comparison is an algorithmic analogy, with no EM convergence theorem (Sections3.2–3.3).

**Scope and paradigm.** The net-order policy chooses the next net from the remaining set using the current routing image and a netlist-dual graph. The text explicitly describes the same policy feature network and joint RL for placement/net-order tasks. These are cooperating stages of one chip pipeline; the study does not establish independent cross-native-task checkpoint evaluation. It remains **specialist**. Learned actions construct macro placements, ordering and route images; classical cell optimization/maze repair does not make the neural paradigm improvement. The previous mixed label is therefore corrected to **constructive** (Sections3.3/4.5).

## Experiments

**Data and resources.** Experiments use RTX3090 GPUs/AMD3970X. ISPD2005 placement preprocessing converts most fixed macros to movable ones. Approximately750k ISPD2007-derived routing cases supply30k small≤4-pin,80k small and100k large datasets, each randomly split80/20. Models are selected using performance on these **test** splits, then the selected64/128grid models receive another200k/400k cases for ISPD98 evaluation. These split/selection roles limit interpreting those scores as untouched final tests. PPO Adam learning rate is2.5e−4; router Adam uses2e−4, β=.5/.999, weight decay.01, batch64 and linear decay (Section4.1).

**Mixed-size placement.** Table1 reports roughly3.9× DeepPlace/PRNet overlap ratio with a small average wirelength increase. All eight PRNet overlap areas remain nonzero. Its wirelength is worse in six circuits and better only in adaptec3/4; for bigblue4 it is1,001,315,712 versus951,984,128. These are complete macro/standard-cell placement measurements, distinct from the later macro-only pipeline experiment (Section4.2/Table1).

**Generated-route validity.** Correctness rate counts connected **and overflow-free** nets. WLR sums lengths only over those successful nets versus their classical labels; failed nets are excluded from that ratio. Full-model correctness is.814 on Route-small-4 and.735 on Route-small, with WLR1.010/1.018. Thus failure rates remain18.6%/26.5% in this evaluation. The enhanced loss improves WLR but slightly reduces Route-small correctness from.738 without it. Supplement loss ablation gives focal-only.756correctness/1.091WLR versus full.735/1.018, showing a trade-off (Table2/SupplementTable1).

**Global routing and concurrency.** Sequential ISPD98 routing has zero reported overflow and competitive wirelength, but every classical router in Table4 is faster; NTHU-Route2.0 also has shorter ibm02wirelength (169,881 versus170,270). Batch16 inference plus C++ postprocessing yields3.36–7.98× speedup relative to sequential PRNet, but **positive overflow on all six Table5circuits**, including4 on the otherwise trivial ibm05. Several classical results are copied from older studies, with differing hardware, rather than measured matched-budget runs (Sections4.3–4.4/Tables4–5).

**Joint pipeline and extra controls.** The full placement+generative-router+net-order pipeline wins both WL/RC in all eight Table3rows, but that evaluation includes **macros only**. Without net-order learning, adding the generative router worsens congestion in five circuits; e.g.bigblue2 rises26.318→45.945 before NOL reduces it to25.498. The input-size-adapting network uses12M parameters versus15M for the nonadaptive model, improving large-grid correctness. The extended routing set trains650k cases from three circuits and tests200k from a fourth. A16×16adaptec1control gives1.805seconds/0overflow versus the adapted RL router11.528seconds/157overflow, while the RL result has shorter raw WL4951versus5240. The measured speedup is about6.39×, rather than the appendix prose's approximate10× (Table3/SupplementTables2–5).

## Limitations

### Discussed in the Paper

Classical-router supervision can limit the generator. Concurrent routing can create capacity conflicts and increase both length and overflow. Generative routing is slower than strong classical heuristics, even though the authors' adapted grid-step RL router is much slower and hard to train. Unsupervised/semi-supervised training and runtime reductions are future directions (Sections4–5).

### Curator Notes

- The abstract's blanket absence-of-traditional-heuristics description needs qualification: Section3.2 explicitly uses maze repair, and complete placement uses DREAMPlace. These disclosed components do not invalidate the empirical pipeline, but prevent describing every stage as a learned network.
- "End-to-end" is implemented conceptually through alternating router training and PPO reward feedback, not an established single differentiable path through discrete placement, thresholding, connectivity checks and maze repair.
- A learned connectivity discriminator and footprint masking do not prove global feasibility. Reported nonzero overlap, unsuccessful route fractions and batched overflow must accompany quality claims. Detailed routing, timing closure and final manufacturing-design-rule checks are outside the evaluated scope.
- Table5caption names2.8GHz Pentium4/2GB baseline hardware whereas the prose says1.4GHz PentiumIII. The later Labyrinth rerun in the supplement uses AMD4600H/2GB, distinct from the stated3090/3970X neural server. The official poster also has different Labyrinth rows. These versions are kept separate; no hardware-normalized speed ranking is inferred.
- The current public monorepo documents PRNet, but its full tree does not identify a distinct PRNet implementation/checkpoint. Later HubRouter generative code and earlier DeepPlace source are not substitutes for an independently identifiable PRNet release.

## Reproducibility

The [formal NeurIPS2022 record](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a8b8c1ad51df1b93d9e3d1fca75debbf-Abstract-Conference.html) gives volume35,pp26350–26362, DOI10.52202/068431-1911and citation_publication_date2022-12-06. The six authors and affiliations, including ShanghaiAILaboratory in the first-page footnote, were checked. All13main pages and the **six-page scientificPDF inside the official Supplemental ZIP** were read in full, including both bibliographies and every appendix experiment. The officialposter54263was visually read; the event exposes no additional scientific slides. OpenReviewuNYqDfPEDD8APIreturned403.

The author-linked [EDA-AI repository](https://github.com/Thinklab-SJTU/EDA-AI) was inventoried at full untruncated2,727-entry tree SHA fd9d3a3df1cf53b6828528bab8925d35abdfa7c8. The root and DeepPlace READMEs, top-level directories and targeted PRNet/generative/net-order paths were inspected. Root README lists/cites PRNet, but no independent PRNet directory, training entry or checkpoint was identified. The publisher ZIP contains only the scientific supplementaryPDF, not code. This is a verified public-release discovery limit; no unpublished implementation or numerical reproduction is claimed. OriginalFigure3was extracted with its full caption and visually checked.

**Internal citations.** [DeepPlace](deepplace-deeppr.md) is explicitly cited as main[2] onpp2–3/7–10 with bibliography p11, also supplement[29] p6. [CVAE-Opt](latent-search-space-routing.md) is main[19] onp3 with full title/three-author entry p11. The source prints ICLR2020for that entry; the stable target's formal venue-year is2021. Exact authors/title identify the work, without claiming the source cites a later corrected date. Other classical/DAC/architecture references are not forced into unrelated catalogue IDs.
