---
id: lore
short_title: LoRe
title: 'LoRe: Adaptive Interaction-Evaluation Routing with Per-step Interaction Budgets for Iterative Graph Solvers'
authors:
- Jintao Li
- Yong-Yi Wang
- Zheng-An Wang
- Heng Fan
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/li26gz.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/li26gz.html
institutions:
- Beijing Academy of Quantum Information Sciences
- Institute of Physics, Chinese Academy of Sciences
- Beijing Key Laboratory of Advanced Quantum Technology
- Hefei National Laboratory
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Graph Optimization
- Routing
problems:
- Maximum Independent Set
- Traveling Salesman Problem
- Minimum Vertex Cover
summary: A training-free interaction-budget wrapper accelerates frozen constructive/improvement graph solvers, with
  scale/topology-dependent quality loss and conditional stability analysis.
---

# LoRe: Adaptive Interaction-Evaluation Routing with Per-Step Interaction Budgets for Iterative Graph Solvers

> **TL;DR:** LoRe reduces expensive neural interaction evaluation by dynamically selecting a small support at each inference step. Frozen backbones and final decoding are retained. Large-instance speed/memory gains are substantial, but small-instance overhead and task/topology-dependent quality losses remain; the stability discussion is conditional rather than an optimization guarantee.

## Motivation

Dense graph/factor evaluation can dominate every step of an iterative neural solver and exhaust GPUmemory. Fewer denoising steps do not necessarily reduce the peak footprint of one step, while a fixed sparse support may omit conflicts that become important later. LoRechanges inference-time evaluation support rather than training another solver (Sections1–2).

## Contributions

- A hard budget counts evaluated interactions separately from the underlying graph and total inference horizon.
- A dynamic hotspot set plus a small structural skeleton directs computation without backbone retraining.
- Reported inclusive timing/memory, size/topology shifts, cross-framework tests and routing ablations examine the speed–quality trade-off (Sections3–4/AppendicesA–B).

## Methodology

**Operator and budget.** The conceptual solver update combines node-wise evolution, interaction messages and optional projection/decoding. LoReevaluates at mostB=floor(ρ|A|)interactions per step. A fixed skeleton contains high degree-sum edges; the rest are refreshed everyRsteps using endpoint uncertainty and temporal changes. ForMIS, uncertainty is1−|2x−1|and the score adds the two endpoint temporal changes weighted byλ. Canonical scoring scans all edges inO(|E|)at refreshes: the budget limits **heavy neural evaluation**, not every operation or storage requirement (Section3/Algorithm1).

**Optional recall and decoding.** A parameter-free coverage-weighted interpolation can supply a pooled global signal. Main experiments disable recall to isolate routing itself. Identical greedy decoding/repair is retained per compared backbone;TSPuses merge plus2-opt where applicable. This is inference-time graph sparsity over continuous/latent candidates rather than a permanent removal of the problem's actual constraints (Sections3.3–3.4).

**Scope/classification.** LoReis a wrapper around separately trained DIFUSCO/T2TCO/COExpandercomponents. Its common **untrained routing rule**acrossMIS/TSP/MVCis not a shared cross-native neural checkpoint. It remains specialist under this catalogue's neural-sharing criterion. Constructive–improvement reflects the demonstrated backbone modes: defaultDIFUSCOconstructs a solution after latent denoising, whileT2TCOis an existing improvement solver. LoReitself does not introduce a new learned full-incumbent edit policy (Sections2/4/Table2).

**Theory.** The appendix obtains e_next≤L·e+delta by triangle inequality under a Lipschitzfull update. For one GNNlayer with a1-Lipschitzactivation, a norm bound uses||A||·||W||; unrolling gives a geometric error factor. This is a conditional trajectory perturbation estimate. It does not prove contraction(L<1), accurate sparse predictions, global optimality or a fixed solution-quality ratio after discrete decoding (Section3.3/AppendixA).

## Experiments

**Protocols.** Tests use dualEPYC9654CPUs and a96GBRTXPRO6000GPU. The defaultρ=.08,R=10,skeletonγ=.05,λ=.5is reported across settings; backbone-specific routing adaptations are allowed. Table2timings include diffusion and post-processing, with3–30runs depending on scale, and100graph–budget evaluations per topology family. Speedups are means of per-instance ratios, which need not equal ratios of displayed mean times. Retention is LoRe/base set size forMISandbase/LoRetour length forTSP, not accuracy against an optimum (Sections4/4.4/Table2).

**MISsize scaling.** At15knodes the dense baseline takes3604seconds/86.7GBversus442seconds/7.32GB, with reported8.16×speedup and1.010retention. It runs out of memory at20k;LoRereaches50kwithin79.5GB. Relative quality is undefined where the baseline isOOM. At1k/2k/3knodes, however, retention is only.815/.804/.835, so “quality preserved”does not describe all scales. AppendixBalso showsKaMIS157versusLoRe111at5kand169versus119at10k; preserving a weak neural reference is distinct from matching specialized classical quality (Tables2/6).

**TSPscaling.** The dense-trained100-nodeDIFUSCOcheckpoint is evaluated in dense mode with the same merge/2-opt. At100nodes LoReis **slower**(.61versus.34seconds,.55×reported speedup)and retention.936. At1000nodes,.94versus13.6seconds and.11versus4.83GBgive14.61×/43.9×reported ratios, but retention.960means roughly4.2%longer tours relative to this neural baseline. At4kretention1.008slightly favorsLoRe; it continues to30kwhere dense inferenceOOMs. A separate quality-prioritizedTSP500configuration has5.76%Concordegap versus3.97%for the sparse baseline (Table2/AppendixB).

**Topology/framework transfer.** FrozenER-trainedMISmodels retain.991onERand1.002onWS, but **.756onBA**, a substantial loss attributed to concentrated high-degree conflicts. T2TCOreports4.62×/11.49×speedups onMIS5k/TSP1kwith.989/.994retention. COExpanderMISretention.872loses quality despite6.54×speedup; itsMVCrow reports1.001retention, with task-specific interpretation needed. These experiments transfer the wrapper and preserve each backbone's own weights; they do not demonstrate one neural solver trained jointly on all three tasks (Sections4.2/4.5/Table2).

**Routing controls.** The dynamic/static ablation uses a **training-free conflict-descent relaxation**, not the full neural backbone:40ER/BAgraphs,n500/1000,T100andmatchedρ=.08. Dynamic skeleton-plus-hotspots gives better displayed conflict/repairable-size curves than fixed/random/greedy alternatives. Hyperparameter sweeps show relatively small variation in the tested ranges, with only threegraphs perλ/density cell. Those controls support this tested routing mechanism rather than universal robustness (Sections4.3–4.4/Tables3–4).

## Limitations

### Discussed in the Paper

Small graphs may not amortize routing overhead. Quality losses depend on task, size, topology and backbone;BAhubs are difficult. The conclusion proposes tighter stability/accuracy characterizations and broader solver families as future work (Sections4–5).

### Curator Notes

- The C-DMFTcluster/bath analogy is explicitly conceptual, without formal equivalence to quantum dynamics. “Exact”selected interactions means the retained neural operator is evaluated, not that the underlying combinatorial subproblem is solved exactly.
- Low entropy or low variance of omitted predictions does not bound the **magnitude/norm**of omitted messages. Certainty can coexist with a confidently wrong prediction or large constant message. AppendixA's activity table therefore supports an empirical observation, not a proof that truncation/recall residuals are small.
- A single-layerLipschitzbound does not automatically apply to every layer/residual path, stochastic denoising coupling or discontinuous greedy decoder/repair. ForL=1the geometric-series expression needs itsTlimit;L>1allows amplification. Increasing budget does not guarantee a **strictly**smaller residual without additional nesting/message assumptions.
- The interaction set and refresh scoring still have full-graph costs. “Feasible beyondOOM”describes memory feasibility of that baseline/hardware configuration, not proof of an optimal solution or an unrestricted asymptotic improvement. Five or threeinstances at the largest scales limit precision.

## Reproducibility

The [formal ICML2026 record](https://proceedings.mlr.press/v306/li26gz.html) givesPMLR306,pp70969–70982,issued2026-09-29. All14formal pages were read, including the full bibliography, derivation, activity measurements and absolute classical comparisons. Key budget equations/algorithm, full result table and appendix figures were rendered. The officialposter65284was visually read; the publisher/event provide no separate scientificPDF/slides. OpenReviewF75QiiFIOrAPIreturned403.

No author implementation URLappears in the inspected formal paper, publisher or poster/event material. An exact GitHubrepository search forLoRe/graph-solversreturnedzero results; that is a discovery limit rather than proof that no repository exists. The described codebase/checkpoint parity and inclusive accounting are **paper-reported**, with no independent runtime reproduction here. No unspecified repository or unpublished supplementary code is presented as verified.

**Internal citations.** Actual in-text citations and matching references onpp9–12verify [BelloNCO](neural-combinatorial-optimization.md), [PointerNetworks](pointer-networks.md), [AttentionModel](attention-model.md), [RL-VRP](rl-vrp.md), [S2V-DQN](learning-co-over-graphs.md), [DIFUSCO](difusco.md), [DiffUCO](diffuco.md), [SDDS](sdds.md), [T2T](t2t.md), [FastT2T](fast-t2t.md), [GenSCO](gensco.md), [StruDiCO](strudico.md), [COExpander](coexpander.md), and [NeuralLNS](neural-large-neighborhood-search.md). The unrelatedFeng2024DIFUSCO-LNSpreprint is not forced onto a catalogue entry.
