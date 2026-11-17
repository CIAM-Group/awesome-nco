---
id: oarest
short_title: OAREST
title: Train on Pins and Test on Obstacles for Rectilinear Steiner Minimum Tree
authors:
- Xingbo Du
- Ruizhe Zhong
- Junchi Yan
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/ec370e882e8a02be955679ddbd2731b8-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/ec370e882e8a02be955679ddbd2731b8-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Rectilinear Steiner Minimum Tree
- Obstacle-Avoiding RSMT
summary: A pin-trained attention policy constructs variable-degree Steiner routes with dynamic obstacle-corner activation;
  finite rechecking leaves measurable failures.
code_url: https://github.com/Thinklab-SJTU/EDA-AI/tree/main/OAREST
---

# Train on Pins and Test on Obstacles for Rectilinear Steiner Minimum Tree

> **TL;DR:** A pointer policy trained on obstacle-free pins constructs rectilinear edge sequences and transfers to rectangular obstacles by dynamically activating corner vertices. It supports variable-size GPU batches and strong empirical routing quality, while finite obstacle checks leave some overlapping solutions. Representation optimality does not certify the learned policy.

## Motivation

Steiner routing connects pins with short horizontal/vertical segments. Learned pin-only constructors often assume one net size and cannot navigate blockages. OAREST extends the rectilinear-edge-sequence (RES) representation with obstacle corners and masking, retaining obstacle-free training while handling obstacle-aware inference (Sections1–2).

## Contributions

- An extended RES representation includes a selected subset of rectangular obstacle corners; the paper states existence of an optimal obstacle-avoiding representation.
- Input, obstacle, visited and activation masks support variable-degree training, batched inference and local detours without obstacle-aware training examples.
- Synthetic RSMT/OARSMT tests, real routing nets, degree-transfer experiments and full architecture/proof appendices assess quality and throughput (Sections3–4/AppendicesA–B).

## Methodology

**Problem and representation.** The objective is total rectilinear union length connecting all pins. Obstacles are rectangles whose interiors cannot intersect routes; boundaries may be used. A RES incrementally connects an unvisited pin/corner to an already visited point with an oriented horizontal/vertical edge pair. The extended Hanan grid uses pin and obstacle-corner coordinates. This is tree construction for individual nets, rather than capacity-constrained whole-chip routing or a design-rule-clean detailed router (Section2).

**Network and training.** Actor and critic each use a 1×1 convolution/batch-normalized embedder and multi-head self-attention encoder. The actor uses pointer decoders for point selection and orientation; the critic pools encoded points with a learned glimpse and predicts length. Input padding is masked, and the visited mask ensures incremental connectivity. Training samples pin-only instances, evaluates route length with the classical evaluator and uses an actor–critic REINFORCE update. AppendixB.4 first trains degrees3–50 sequentially for40000iterations each, initializing each degree from the previous model. Batch size decreases from4096 to512; Adam starts at2.5×10⁻⁴ and decays0.96 per degree. A second40000iteration-scale phase fine-tunes ranges3–10,10–20,20–30,30–40,40–50 or3–50 at5×10⁻⁵. These are substantial pretraining costs, rather than a single brief obstacle-free fit (Section3/AppendixB.3–B.4).

**Obstacle transfer and decoding.** All corners are encoded but normally unavailable. If a proposed L-shaped connection crosses an obstacle, its corners become eligible and the decoder chooses a detour. Corner activation resets after the adjustment. Inference uses eight geometry-preserving rotations/reflections and selects the best candidate. RSMT tests use degree-range-specific checkpoints and batches of100000/degree. All obstacle tests use the40–50 checkpoint and10000-instance batches. Although Algorithm1 prints a while-loop until clear, AppendixB.5 explicitly limits obstacle inspection to once to preserve batch efficiency; AppendixB.1 acknowledges overlaps and redundant-edge removal. The current public implementation instead caps adjustment at three iterations. These versions should not be conflated (Sections3.2/4.1/AppendicesB.1/B.5).

**Theory and classification.** Theorem2.5/A.10 concerns existence of an optimal RES using some obstacle corners under the geometric assumptions. It is not a bound on finite trained-policy suboptimality, a proof that its masks retain every optimal representation, or a guarantee of successful finite decoding. Specialist / constructive is retained: pin-only and obstacle-aware tests remain variants of the same native Steiner-routing task; the neural policy constructs a route before postprocessing rather than editing a complete routing incumbent.

## Experiments

**Protocol.** Synthetic tests use10000uniform-pin instances per degree5,10,…,50 and zero/five/ten rectangular obstacles. An EPYC7402 CPU,512GBRAM and RTX4090 provide the reported setup; three runs provide displayed deviations. CPU classical solvers and GPU-batched learned inference have different execution regimes. The quality denominator for obstacle tests is **unconstrained GeoSteiner RSMT optimum**, not certified obstacle-constrained optimum: even exact ObSteiner can have a positive displayed error because obstacles require detours (Section4.1/Tables2–4).

**Quality and failure rates.** RSMT average excess length over GeoSteiner ranges0.00–0.36%. OAREST is usually best among listed approximate methods, but FLUTE(A=18) is slightly better at45/50pins(0.30/0.29% versus0.31/0.36%). OARSMT length is slightly worse than exact ObSteiner while running much faster in the reported batched regime. Table5 reports zero-overlap success98.01–99.51% with five obstacles and96.26–99.11% with ten. Unconstrained GeoSteiner's low success is expected because it does not solve obstacle avoidance; it is a lower-bound length reference, not a failed exact OARSMT algorithm. Nonzero failure rates qualify broad obstacle-avoidance claims (Section4/AppendixB.1).

**Speed and generalization.** Fixed-size RSMT inference can be slightly slower than REST(T=8). On variable-degree ICCAD2019 nets, the reported runtime is about half REST's and one seventh GeoSteiner's, with second-best wirelength behind exact GeoSteiner. Tests retain nets of3–100pins, excluding the majority two-pin cases and rare larger nets. Models trained on narrow ranges perform best near those ranges; the3–10 model deteriorates strongly on larger instances. Figure6(b), checked visually, shows both40–50 and3–50 models below3% mean error on unseen51–100pin instances. This is empirical size transfer with eight-way augmentation, not a uniform approximation guarantee or an end-to-end congested-chip routing benchmark (Sections4.3–4.4/AppendixB.5).

## Limitations

### Discussed in the Paper

Dense obstacles and more total pins/corners than training can produce repeated overlap; capped activation sacrifices feasibility to batch throughput. Redundant edges require classical postprocessing. Accuracy deteriorates with increasing degree and the work does not optimize whole-chip congestion or layer-aware routing constraints (Section5/AppendixB.1).

### Curator Notes

- AppendixA.6/A.10 moves from Hanan-grid membership to a Manhattan-shortest connecting path without establishing that property for the selected traversal. Grid membership alone does not make every grid path monotone. This is a limitation of the printed proof step, rather than a counterexample to classical Hanan results or a demonstration that no optimal RES exists.
- Equations2/4 print minimization of `(critic−length)×Actor(probability)`. The released training code instead minimizes `(length−critic+overlap penalty)×log_probability`, matching a cost-based score-function update. The sign and missing logarithm in the printed objective should not be treated as the implemented loss.
- Statements about linear computation should be restricted to the intended bounded rechecking/batching strategy. Equation17 and released `self_attn.py` explicitly form the full point-pair attention matrix, quadratic in encoded point count at fixed embedding width; sequential decoding adds further work. GPU throughput is not a linear-time proof.
- All overlap-free rates and quality figures are paper-reported; no solver rerun is claimed. Formal one-recheck inference, pseudocode unbounded rechecking and current three-recheck code are distinct configurations.

## Reproducibility

The [formal NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/ec370e882e8a02be955679ddbd2731b8-Abstract-Conference.html) give volume38, pp161424–161452, DOI10.52202/085713-5390 and explicit issued date2026-04-23. The2025 venue label is retained separately from this publication date. All29formal pages, integrated proofs/checklist/architecture/visual appendices, the official one-page poster-format slide and separate poster were read or visually inspected.

The [author implementation](https://github.com/Thinklab-SJTU/EDA-AI/tree/main/OAREST) was inspected through its complete untruncated repository tree, OAREST/root READMEs, architecture, training/decoding/evaluation and configurations. Its596-file subtree contains no additional scientific PDF/notebook; the included2017GeoSteiner manual is a third-party dependency manual, not an OAREST supplement. The test YAML points to a local `last.ckpt` absent from the tracked subtree; obtaining the exact trained weights remains necessary. Current source differs in obstacle recheck cap and some default training settings. The official event119807 links these materials and OpenReview; the accessible publisher page lists no separate scientific supplement, and the OpenReview API request returned403. The provenance records those checks without claiming access to an unavailable endpoint.

**Internal citations.** Actual in-text citations and matching bibliography entries were checked for [EfficientPlace](efficientplace.md), [ChipFormer](chipformer.md), [NeuralSteiner](neuralsteiner.md), [HubRouter](hubrouter.md), [FlexPlanner](flexplanner.md), [MaskPlace](maskplace.md), and [Pointer Networks](pointer-networks.md). REST/EPST and other external Steiner methods are discussed in the paper but do not gain invented catalogue identities.
