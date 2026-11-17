---
id: chipformer
short_title: ChiPFormer
title: 'ChiPFormer: Transferable Chip Placement via Offline Decision Transformer'
authors:
- Yao Lai
- Jinxin Liu
- Zhentao Tang
- Bin Wang
- Jianye Hao
- Ping Luo
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/lai23c.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/lai23c.html
institutions:
- The University of Hong Kong
- Shanghai AI Laboratory
- Huawei Noah's Ark Lab
- Zhejiang University
- Tianjin University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Macro Placement
- Chip Placement
summary: Circuit-conditioned offline imitation constructs macro placements, with return-prioritized adaptation and
  classical mixed-size refinement; zero-shot and overlap limits remain.
code_url: https://github.com/laiyao1/chipformer
---

# ChiPFormer: Transferable Chip Placement via Offline Decision Transformer

> **TL;DR:** A circuit-conditioned causal transformer learns sequential macro placements from near-expert trajectories, then optionally adapts by return-prioritized imitation. Transfer reduces target-chip online rollouts, while final mixed-size results also depend on classical optimization that can move the macros again. Zero-shot quality, overlap and industrial metrics have explicit exceptions.

## Motivation

Learning a separate online RL placer for each netlist repeatedly incurs expensive placement rollouts. ChiPFormer amortizes this cost over offline trajectories from several circuits and conditions a shared constructor on a circuit representation. Transfer here is across chips within the native placement task (Sections1–3).

## Contributions

- Offline sequence modeling reuses near-expert macro-placement trajectories across circuits.
- A graph-derived circuit token complements spatial masks and action/state histories.
- Return-prioritized online adaptation, an entropy penalty and a three-phase classical/neural pipeline are evaluated on public and private designs (Sections3–4/AppendixA).

## Methodology

**Task.** The neural decisions are macro coordinates on an84×84grid. The objective is pin-level half-perimeter wirelength(HPWL), with overlap and estimated congestion constraints. Occupancy, legal-position and incremental-wirelength images encode each state; a handcrafted area/net-count order chooses the next macro. This is not direct neural placement of millions of standard cells (Sections2–3).

**Offline model.** The dataset contains500MaskPlace-generated near-expert trajectories for each of12circuits. Four-fold evaluation trains on nine and tests on three held-out circuits. A VGAE uses connectivity and width/height/area/order features; mean pooling yields a32-dimensional circuit representation. The GPT-style policy maximizes demonstrated-action likelihood conditioned on that token and preceding states/actions. The formal sequence has one circuit token plus2Tstate/action tokens and **does not use return-to-go conditioning**. Six128-hidden layers/eight heads use T=256; longer training trajectories supply their first256steps, while testing slides the context window to finish larger circuits (Section3/AppendicesA.3–A.5).

**Adaptation.** New rollouts are sampled with a weight proportional to exp(return/.01); a64-trajectory priority buffer favors high returns. The likelihood objective adds .5·max(0,.5−entropy). Adaptation changes parameters before constructing further trajectories; it is not a learned local editor of an existing complete placement (Section3.4/Table11).

**Full pipeline and classification.** Phase1constructs macros neurally. Phase2fixes macros and globally places standard cells with DREAMPlace. Phase3makes **both macros and standard cells movable** during global/legal/detailed placement. Private industrial evaluation uses a commercial downstream tool. Specialist / constructive therefore describes the neural component; classical refinement alone does not change it into neural improvement. Neither a shared end-to-end optimizer across different native tasks nor a global optimum certificate is demonstrated (Section3.5/Table1).

## Experiments

**Protocols and task definitions.** The32designs comprise26public and six private industrial circuits. Public macro tests use selected sets:63/159/32movable macros onadaptec1/adaptec2/bigblue1,256onbigblue2andIBMdesigns,1024onbigblue4, and full723/1329/1293onadaptec3/adaptec4/bigblue3. Remaining designated terminals can be fixed or treated differently downstream. These subsets differ from the original MaskPlace full-macro setup; raw numbers must not be compared across those protocols. Table2reports best HPWLwithin1/300/2000rollouts, aggregated over five seeds; GraphPlace uses50krollouts and DeepPR/MaskPlace3k. Models/data generation and target-chip search have different costs (Section4/Table5).

**Macro quality and negative results.** At300rollouts ChiPFormer improves the best displayed RLbaseline in10of12circuits, but loses onbigblue2(6.02versus5.75, +4.70%)andbigblue4(110.10versus103.26, +6.62%), in units10⁵HPWL. At2000rollouts its means are lowest on all12displayed circuits; thebigblue4gain is only.41%. One-rollout zero-shot inference is worse than the best listed baseline on11of12circuits: for exampleadaptec2122.37versus75.16. Adaptation is therefore central to the strong across-circuit result (Table2).

**Mixed size, overlap and industry.** The full workflow has the best displayed mean HPWLon all eightISPDcircuits and17IBMdesigns. ISPDgains range from.31%to21.56%relative to the best listed baseline. Table3explicitly imports baseline results from their respective papers, so it is not uniformly a rerun under identical settings. Table7reports0%overlap on the eightISPDcircuits but **3.27%onAriane**, rather than universal nonoverlap. The congestion frontier uses PRNet-preprocessed circuits and several thresholds. Industrial timing/congestion numbers mostly improve, butC3WNS108is worse than the human102and horizontal overflow1.02ties it (Tables3–4/7–8/Figure11).

**Runtime and ablations.** Figures5/10use twoRTX3090GPUs and aRyzen5950X. Approximately18minutes for300target-chip rollouts contrasts with hours of online training; it excludes amortized near-expert trajectory generation and offline pretraining. More training circuits generally improve transfer; the circuit token helps most, rather than every, design. Priority replay/entropy ablations favor the proposed combination in the tested setup. VGAElink-reconstruction AUC.9600is an auxiliary task score, not a certificate of placement quality (Section4/Tables9–11).

## Limitations

### Discussed in the Paper

Training relies on existing high-quality offline solutions. Generalization still benefits substantially from target-chip interaction. Standard-cell placement and refinement remain classical. Private industrial netlists are not public, and the displayed task subsets are important to reproduction (Sections4–5/AppendixA).

### Curator Notes

- Legal-position masking is conditional on available grid positions and does not prove completion for every prefix. Table7's Ariane overlap is a concrete limitation of unconditional feasibility language. HPWL/congestion proxies are not complete power/timing/routing signoff.
- The printed VGAEdecoder likelihood onp5multiplies sigmoid scores without the observed adjacency exponents/complement factors. AppendixAlgorithm1and released`graph_train.py`instead use binary cross entropy; the abbreviated expression should not be treated as a complete Bernoulli likelihood.
- The public snapshot retains zeroed return-token slots and3T+1sequence positions, whereas the formal architecture specifies2T+1. Its`PlaceDB`explicitly calls`get_circuit_fea(is_graph=False)`, using area/connectivity summaries until manually switched to graph features as the README instructs. Merely loading the default release is not evidence that the formal VGAEconfiguration was reproduced.
- Release adaptation implements exponential **sampling** followed by ordinary cross entropy plus the entropy hinge, matching return-prioritized regression in expectation. Fine-tuning defaults(batch64/three visible GPUIDs)also differ from Table11's batch32/two-GPUreport. These are configuration/version observations, not rerun findings or a blanket invalidation of the experiments.

## Reproducibility

The [formal ICML2023 record](https://proceedings.mlr.press/v202/lai23c.html) gives PMLR202,pp18346–18364,issued2023-07-03. All19pages were read, including every reference, appendix, dataset table and algorithm. Main quality/industrial/overlap/runtime tables and the VGAEequation/pseudocode were rendered and checked. The officialICMLposter25027was visually read; the event and publisher expose no separate scientific supplement/slides, and OpenReviewj0miEWtw87APIreturned403.

The [project](https://sites.google.com/view/chipformer/home) links the [author implementation](https://github.com/laiyao1/chipformer) and offline trajectory dataset. The complete47-entry untruncated tree atSHA7906f3aa60202da1772992f1dc9da29436ac4051contains no extraPDF/TeX/notebook. The fullREADMEand relevant graph encoder, token/forward/loss, circuit feature, replay/adaptation and loading code were inspected. The current README includes a later environment update; no training or formal-result rerun was performed.

**Internal citations.** Explicit in-text citations and matching bibliography entries onpp9–10verify [DeepPlace/DeepPR](deepplace-deeppr.md)(Cheng&Yan2021), [PRNet](prnet-chip-design.md)(Cheng etal.2022), and [MaskPlace](maskplace.md)(Lai etal.2022). Their distinct task subsets/budgets and the combined classical pipeline remain explicit.
