---
id: deepplace-deeppr
short_title: DeepPlace / DeepPR
title: On Joint Learning for Solving Placement and Routing in Chip Design
authors:
- Ruoyu Cheng
- Junchi Yan
year: 2021
date: '2021-12-06'
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper/2021/hash/898aef0932f6aaecda27aba8e9903991-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2021/hash/898aef0932f6aaecda27aba8e9903991-Abstract.html
institutions:
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Placement
problems:
- Chip Placement
- Global Routing
summary: Circuit-specific RL macro placement learns from downstream analytic cell placement or macro-only routed-wirelength
  feedback; coordinated components do not demonstrate a shared placement/routing policy.
code_url: https://github.com/Thinklab-SJTU/EDA-AI/tree/main/DeepPlace
---

# On Joint Learning for Solving Placement and Routing in Chip Design

> **TL;DR:** DeepPlace trains a macro placer using feedback from a standard-cell optimizer; DeepPR instead uses routed wirelength feedback on macro-only circuits. The demonstrated pipelines do not jointly solve full macro/standard-cell placement and routing with one shared policy.

## Motivation

Optimizing macro placement alone can disagree with later standard-cell placement and routing. Half-perimeter wirelength and congestion estimates are useful but imperfect proxies. The work changes the training feedback so the macro agent accounts for the downstream stage (Sections 1–3).

## Contributions

- **DeepPlace:** combine PPO macro placement with GPU-accelerated DREAMPlace standard-cell optimization, using completed-placement feedback to fine-tune the macro policy.
- **DeepPR:** feed a macro placement through a router and optimize using its routed wirelength; the framework allows a classical router or a separate RL routing agent.
- Fuse CNN layout features and GCN macro features, and add random-network-distillation exploration. These are coordinated pipeline components, not evidence of the same trained network solving placement and routing as separate native tasks.

## Methodology

**Macro policy.** The canvas is a32×32or64×64 grid with occupied-position indicators. A sequential action assigns the next macro a currently available grid location. A CNN encodes the partial-layout image; a two-layer GCN with32/16channels encodes connectivity/local macro information. Their concatenated embedding feeds a fully connected action distribution. Overlapping outcomes can be replaced by the nearest valid position. The authors identify macro shape/size treatment as unfinished, so discrete empty-position masking should not be equated with complete physical-design legality (Sections3.1–3.2,5;Figure6).

**Rewards and exploration.** DeepPlace's extrinsic feedback is negative HPWL minus a weighted RUDY congestion estimate, after arranging standard cells with macros fixed. The congestion criterion is0.1; the trade-off coefficient depends on the circuit. Its HPWL formula includes grid-cell offsets and is a proxy rather than exact routed wirelength or full power/performance/area. RND adds the squared prediction error of a learned image embedding against a fixed random target as an intrinsic bonus; minimizing that error trains the predictor. It encourages novelty without proving optimal exploration (Sections3.3–3.4).

**Analytic optimization versus neural learning.** DREAMPlace supplies a classical gradient-based placement optimization implemented through deep-learning tooling. PPO receives its resulting score; the paper does not derive a differentiable end-to-end gradient through every downstream optimization stage. “End-to-end” here describes the training objective/pipeline. The millions of standard cells are optimized by that analytic module, while the RL agent places hundreds to roughly1,300movable macros (Sections2,3.4;Table1).

**Routing variant.** DeepPR decomposes nets into pin-to-pin connections, runs a router and uses final wirelength as reward. If a learned router is used, it is a distinct agent optimized with the shared feedback, rather than a shared placer/router policy. The article allows multiple router choices but does not fully specify a routing network/backend and all hyperparameters for the reported experiment; “unbiased reward” means using the selected router's measured objective rather than a HPWL proxy, not a proof of global optimality or optimal statistical estimation (Section3.5).

**Training protocol.** Pretrain each policy on macro-only connectivity, then fine-tune with downstream feedback. PPO uses Adam learning rate2.5×10⁻⁴ on one RTX2080Ti without parallelism. On adaptec1, moderate300-iteration pretraining outperforms both scratch training and500-iteration pretraining; more pretraining is therefore not uniformly beneficial. No unchanged-policy transfer across unseen circuits is demonstrated (Sections4.1–4.3,Figure4).

## Experiments

**Modified benchmark.** Eight ISPD2005circuits are changed by making most originally fixed macros movable. They span211K–2,177Kcells,221K–2,230Knets and514–1,309movable macros, with heterogeneous residual fixed objects/densities. These are modified mixed-placement experiments and should not be presented as unchanged official contest conditions or a held-out cross-design test (Table1).

**DeepPlace results.** Table2reports lower wirelength than the sequential macro-pretraining/standard-cell-placement baseline on all eight circuits: e.g.adaptec1is80,117,232versus86,675,688andbigblue4is951,984,128versus1,039,976,064. Direct DREAMPlace, treating movable macros like general cells, fails the paper's congestion criterion on six circuits; on its two passing cases DeepPlace also improves reported wirelength. These comparisons do not establish superiority to every modern macro-aware placement flow or industrial sign-off quality (Section4.3,Table2).

**Runtime interpretation.** Figure5compares deployment placement runtime, reporting roughly4×speedup over RePlAce with a small macro-policy fraction and a larger GPU analytic-standard-cell fraction. Controller training/pretraining is separate from this inference breakdown. GPU acceleration, solver implementation and learned macro placement all change in the comparison, so it does not isolate the neural policy's causal speed advantage under identical solver/hardware conditions (Figure5).

**DeepPR results.** Standard cells are explicitly **omitted** from this experiment. On macro-only versions of the eight circuits, jointly trained feedback produces lower routed wirelength than a separately trained placement/routing pipeline in all rows: adaptec1is5298versus6077andbigblue4is17585versus17829. Inference times range about10.6–98.2seconds; both methods use the same structure and differ in training protocol. These are routed lengths for the selected backend, not globally optimal Steiner routes or evidence of full-chip macro/standard-cell routing (Section4.4,Table3).

**Ablations and uncertainty.** The displayed ablation is the adaptec1macro-only pretraining task: adding local GCN information and RND improves episodic return over the shown alternatives. It is not a multi-design ablation of every downstream metric. The article says error bars can be neglected because the environment is deterministic; deterministic transitions do not eliminate policy-initialization, sampling or optimization variability. No independent-seed uncertainty estimate is supplied by those figures (Sections4.1,4.5,Figure7).

## Limitations

### Discussed in the Paper

The GNN/action space limits the RL component to a moderate macro count. Macro sizes/shapes and overlap handling need improvement. Excessive pretraining can harm exploration. Combining both macro/standard-cell placement with routing in one full flow remains future work, explicitly distinguishing the two presented variants from that larger goal (Sections4.3,5).

### Curator Notes

The work targets a specialist chip-design pipeline with separate components and circuit-specific training. Modified benchmark conditions, proxy metrics, nearest-valid-position repair and partial routing specifications limit reproducibility and deployment claims. A completed placement or routed wirelength is not a certificate of timing closure, design-rule correctness, full PPA optimization or global optimum. Deterministic environment dynamics are insufficient grounds for assuming zero experimental variance.

## Reproducibility

- **Publication:** [NeurIPS2021proceedings](https://proceedings.neurips.cc/paper/2021/hash/898aef0932f6aaecda27aba8e9903991-Abstract.html), Ruoyu Cheng/Junchi Yan, Shanghai Jiao Tong University. The publisher HTML explicitly records `citation_publication_date=2021-12-06`; this date is preserved as publisher metadata, independently of the conference schedule.
- **Reading:** all twelve publisher-PDF pages, references and scientific figures/tables. The publisher landing page has no Supplemental entry; the PDF has no appendix or scientific-supplement reference. The linked OpenReview forum/APIs/attachment discovery returned verification challenges/403. Author-code documentation and its scientific-document inventory exposed no separate appendix; this discovery limitation is recorded without inventing inaccessible contents.
- **Code:** the paper says the release is partial. The [official DeepPlace folder](https://github.com/Thinklab-SJTU/EDA-AI/tree/main/DeepPlace) documents macro and full-placement commands, PPO, PyTorch, DGL and a separate DREAMPlace build. Other folders in the parent repository implement different later papers and are not silently substituted for the2021DeepPR artifact. No fresh training/placement reproduction was executed.
- **Citation graph:** every bibliography entry was checked; no exact internal-catalogue target was identified. The Nature chip-placement paper and DREAMPlace/RePlAce references are distinct from the catalogue's TensorFlow device-placement papers and do not justify relations to those IDs.
