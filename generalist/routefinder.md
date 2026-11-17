---
id: routefinder
short_title: RouteFinder
title: 'RouteFinder: Towards Foundation Models for Vehicle Routing Problems'
authors:
- Federico Berto
- Chuanbo Hua
- Nayeli Gast Zepeda
- André Hottung
- Niels A. Wouda
- Leon Lan
- Junyoung Park
- Kevin Tierney
- Jinkyoo Park
year: 2025
date: 2024-06-21
venue: TMLR
paper_url: https://openreview.net/forum?id=QzGLoaOPiY
arxiv_url: https://arxiv.org/abs/2406.15007
code_url: https://github.com/ai4co/routefinder
institutions:
- KAIST
- Bielefeld University
- Rotterdam School of Management, Erasmus University
- Vrije Universiteit Amsterdam
- Omelet
scope: generalist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Mixed Backhauls
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Duration Limits
- Multi-Depot Vehicle Routing Problem
summary: One shared construction policy trains on sixteen VRP variants; a unified forty-eight-variant environment
  and zero-padded adapter layers support further mixed-backhaul and multi-depot fine-tuning.
publication:
  date: 2025-09
  source_url: https://arxiv.org/pdf/2406.15007v4
figure:
  path: paper-assets/routefinder/framework.png
  alt: RouteFinder shared encoder-decoder, mixed batch environment, reward normalization and efficient adapter layers.
  caption: 'Figure 2: Unified RouteFinder construction and adaptation framework.'
  source_url: https://arxiv.org/pdf/2406.15007v4#page=5
---

# RouteFinder: Towards Foundation Models for Vehicle Routing Problems

> **TL;DR:** One autoregressive policy trains jointly on sixteen capacitated VRP variants. A unified environment, modern Transformer encoder, mixed batches and reward scaling support shared learning; zero-extended input projections allow subsequent adaptation to thirty-two additional mixed-backhaul/multi-depot variants.

## Motivation

Separate policies and environments for each routing variant multiply development and training costs. Earlier multitask solvers cover restricted attribute combinations and can use different backhaul semantics. RouteFinder provides a common, explicitly constrained VRP interface and studies how architecture and training affect transfer within that interface.

## Contributions

- A vectorized environment represents forty-eight combinations of open routes, time windows, duration limits, depot configuration and backhaul type, always with capacity constraints.
- Global attribute embeddings, mixed-batch training and task-specific reward normalization support one shared routing policy.
- RF-TE modernizes the encoder using pre-RMS normalization, SwiGLU-style feed-forward blocks and FlashAttention; RF-POMO and RF-MoE provide controlled architecture comparisons.
- Efficient Adapter Layers (EAL) append zero-initialized feature weights to existing input projections, preserving the initial policy when new attributes are introduced, before fine-tuning.

## Methodology

**Actual task space.** The forty-eight variants are three backhaul states (none, strict linehaul-before-backhaul, mixed/interleaved) times the binary open-route, duration, time-window and multi-depot attributes. Customers have either delivery or pickup demand in the experiments. Mixed backhauls are unpaired customers with physical load constraints; neither paired pickup-and-delivery precedence nor simultaneous delivery-and-pickup customers are evaluated. Multi-depot closed routes return to their originating depot. Appendix A distinguishes the standard separate-commodity backhaul setting from earlier signed-demand formulations that can reuse collected goods for later deliveries.

**Shared construction.** Node features contain coordinates, separate linehaul/backhaul demands and service/time-window information. Depot/global embeddings encode open-route, duration and other global attributes. Dynamic decoder context tracks remaining resources, current time and route length; new variants add backhaul availability and/or origin-depot coordinates. The environment supplies explicit state transitions and feasibility masks. A POMO-style autoregressive policy constructs routes; the method does not learn incumbent editing. RF-TE uses six layers, eight heads, embedding width 128 and feed-forward width 512. The generic POMO description in Appendix B.2 and the RF-TE equations in B.3 describe different encoder choices, rather than contradictory normalizations of one encoder.

**Training and normalization.** The base policy learns all sixteen single-depot variants without mixed backhauls. Mixed Batch Training draws different attribute combinations within a batch. REINFORCE uses POMO's shared baseline; the default divides rewards by the absolute exponential moving task mean, with alpha 0.25. The paper also compares cumulative/exponential means and subtract/divide operations. A common subtractive task offset cancels when both reward and the POMO shared baseline are centered consistently, whereas division rescales the advantage; current `model.py` passes normalized rewards to the baseline. The small ablation curves do not establish a large gain for every normalization choice.

**Adaptation boundary.** EAL copies old projection weights and zero-pads new feature columns: mixed backhauls add one global flag and one dynamic load feature; multi-depot routing adds two origin coordinates. The thirty-two new variants are fine-tuned in mixed-backhaul, multi-depot and combined groups. EAL therefore preserves zero-step behavior but does not make the adapted results unchanged zero-shot inference. The release supports full-model fine-tuning as well as embedding-only variants; `adapter_only=True` freezes the backbone while leaving entire input/context embedding modules trainable, not exclusively the newly appended columns. Size-50 and size-100 experiments use separate checkpoints.

## Experiments

- **Budget/data:** Main training is 300 epochs of 100,000 instances each, or thirty million instances, using Adam at 0.0003, weight decay 0.000001, batch size 256, gradient clipping at one and learning-rate milestones 270/295. Reported training takes about 9–24 hours on an A100. Coordinates are uniform; demands are integers 1–9, capacities are 40/50 at sizes 50/100, and pickup customers have probability 0.2. Time windows, service times, route-duration limits and depot coverage are explicitly generated. These distributions and backhaul semantics matter when comparing earlier published numbers.
- **Evaluation:** There are 1,000 instances per variant/size. Neural evaluation uses n POMO starts and eight geometric augmentations, selecting among n times eight constructed solutions, on an RTX 3090. Classical comparisons use sixteen CPU workers and per-instance limits of 10/20 seconds. Tables report aggregate runtimes. HGS/PyVRP and OR-Tools references are finite-budget heuristics, not general certificates of optimality. MTPOMO and MVMoE are retrained on the common task/data interface for the architecture comparison.
- **Main quality:** RF-TE is generally strong at size 100: CVRP gap is 1.505% versus 1.988% for retrained MTPOMO and 1.694% for MVMoE; OVRP gaps are 4.055/4.965/4.621%. This is not a uniform greater-than-ten-percent improvement. At CVRP50, RF-TE's 1.274% is worse than MVMoE's 1.242%; RF-MoE's OVRPBLTW50 gap 1.312% is worse than MTPOMO's 1.229%. Capacity-shift tests also have losses: at capacity 50, POMO cost 15.72 beats RF-TE's 15.79, while at capacity 200 RF-TE improves 9.24 to 9.02.
- **Large instances:** Across thirty-two large Set-X instances, printed mean gaps are 12.303% for RF-TE, 18.795% for the newly trained MVMoE and 30.202% for the newly trained MTPOMO. The older published MTPOMO reference is 16.796%, so training on every variant does not uniformly improve that baseline. Individual instances also favor alternatives. These gaps show meaningful residual size-generalization error.
- **New attributes:** Fine-tuning uses ten epochs of 10,000 target-distribution instances each, or 100,000 new instances per adaptation run. Combined multi-depot/mixed-backhaul zero-shot gaps around 40–50% fall to roughly 7–19% after EAL fine-tuning; these remain gaps to the classical reference. Zero-step equivalence comes from zero-padding, while subsequent gains require target data and optimization. The t-SNE visualization averages node embeddings for 100 instances per variant, with perplexity 30; clusters and selected route drawings are illustrations, not generalization guarantees.

## Limitations

Generality is bounded by hand-engineered feature and feasibility interfaces. New attributes require representation/environment changes and usually adaptation. The base checkpoint covers sixteen trained native variants, rather than all forty-eight unchanged. Multiple starts, augmentation, training, adaptation and CPU/GPU differences must accompany quality/runtime claims. The paper notes difficulty with more complex attributes and multi-depot cases; neither universal feasibility beyond implemented rules nor arbitrary cross-domain optimization is established.

**Source-table qualification:** In Appendix Table 9, the newly trained MTPOMO objective column repeats the optimum column despite nonzero gaps: X-n502-k39 lists 69,226 in both columns alongside 9.410%, and X-n513-k21 lists 24,201 alongside 42.511%. The original table was checked at high resolution. Those objective entries cannot be reconciled with the printed gaps as individual-instance measurements; missing true costs are not reconstructed. The mean gaps above are identified as reported values, not independently recomputed benchmark results.

**Current notebook qualification:** The CVRPLIB notebook independently rescales the coordinate axes, which can change Euclidean geometry, then computes floating-distance route totals in restored coordinates and applies a ceiling to the total. This need not match each benchmark's edge-weight convention. Saved negative gaps therefore do not establish improvements over certified optima. The saved outputs are demonstrations, not a rerun or independent reproduction of the paper's table.

## Reproducibility

- **Version/metadata:** Freshly read all forty-one pages of arXiv v4, dated 15 September 2025, with the explicit header “Published in Transactions on Machine Learning Research (09/2025)”; all references and Appendices A–E are included. First arXiv publication is 21 June 2024. September 2025 is supported as publication month; the old August acceptance month lacks accessible paper-specific evidence and has been removed. Nine authors and five actual affiliations are checked against page 1.
- **Code/data:** [ai4co/routefinder](https://github.com/ai4co/routefinder) supplies the environment, policy/baseline models, adaptation scripts and experiment configurations, with Hugging Face data/checkpoint links. README and relevant model, normalization and EAL routines were inspected. No training, notebook execution or full benchmark reproduction was performed.
- **Scientific supplements:** The 214-member official repository archive contains no extra PDF, nested archive or video, but includes four scientific notebooks. All fifty cells, saved textual outputs and twelve PNG outputs were freshly read/viewed: quickstart, CVRPLIB evaluation, t-SNE and route visualizations. Per-file SHA-256, cell coverage and output-image inventory are recorded separately; they are not represented as invented PDF pages. The quickstart is a short interrupted demonstration, and selected route panels overlap the paper's illustrations.
- **Figure/relations:** Original Figure 2, including its complete caption, is cropped from PDF page 5. All main/appendix plots and tables, and all eighty qualitative route panels on pages 40–41, were visually checked. Exact bibliography identities are linked to existing catalogue entries; NCS is distinguished from its separate N2S precursor, and spelling/year differences do not create duplicate papers.
