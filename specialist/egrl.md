---
id: egrl
short_title: EGRL
title: Optimizing Memory Placement using Evolutionary Graph Reinforcement Learning
authors:
- Shauharda Khadka
- Estelle Aflalo
- Mattias Marder
- Avrech Ben-David
- Santiago Miret
- Shie Mannor
- Tamir Hazan
- Hanlin Tang
- Somdeb Majumdar
year: 2021
date: '2020-07-14'
publication:
  date: '2021'
  source_url: https://openreview.net/forum?id=-6vS_4Kfz0
venue: ICLR
paper_url: https://openreview.net/forum?id=-6vS_4Kfz0
institutions:
- Intel Labs
- Intel Israel
- Technion
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2007.07298
paradigm: constructive-improvement
problem_families:
- Placement
problems:
- Memory Placement
summary: Evolutionary GNN and stateless policies share off-policy learning to optimize hardware tensor-memory maps;
  compiler-relative inference speed and limited same-task transfer do not imply optimality.
---

# Optimizing Memory Placement using Evolutionary Graph Reinforcement Learning

> **TL;DR:** EGRL combines graph policies, off-policy learning and evolutionary search to place neural-network tensors in NNP-I memory tiers. Its reported1.28–1.78×inference-speed ratios are hardware measurements, not28–78%elapsed-time reductions or optimality certificates.

## Motivation

Static inference graphs have many weight/activation tensors competing for memory capacity and bandwidth. Choosing DRAM, LLC or SRAM jointly creates a huge discrete search space. Per-layer greedy choices and standalone policy-gradient learning can miss interactions, motivating population search informed by shared learning experience (Sections1–3).

## Contributions

- A graph-based policy proposes all tensor memory assignments simultaneously, avoiding a long sequential placement decision chain.
- A mixed evolutionary population contains GNN policies and fast stateless Boltzmann policies; an off-policy learner shares replay and periodically migrates into the population.
- Training and evaluation run on real Intel NNP-I hardware, with compiler feedback for invalid maps, three workloads and limited cross-workload embedding transfer. The task is memory-tier mapping, distinct from physical chip placement or generic CPU/GPU operation assignment.

## Methodology

**Representation and action.** Nodes represent operational layers, edges connectivity, and nineteen features include tensor shapes/sizes, operation identity and remaining-work summaries. A Graph-U-Net-based policy outputs two categorical memory choices per node, for weights and activations. Memory tiers have capacity/bandwidth trade-offs:32GBDRAM,24MBLLCand4MBSRAM. Selected experiments use one complete-map action per episode, beginning with DRAM as the initial mapping; the enormous action-space count is not a count of search steps actually executed (main p.4;appendix A–B).

**Compiler feedback.** The compiler checks the proposed map and reports changed assignments. If invalid, the method uses a negative reassigned-byte-ratio reward and skips inference; if unchanged/valid, it measures inference and uses squared performance relative to the native compiler. The positive score uses reciprocal latency, so the learning reward is a squared speed ratio. The appendix hyperparameter table also lists an invalid reward of−1; this should be reconciled with the continuous mapping-error formulation before exact reproduction. Compiler validation is an environment service, not a proof supplied by the neural network (Algorithm1;appendix B).

**Evolution and RL.** Twenty population members,20%Boltzmann, supply experiences to a100,000-entry shared buffer. Evolution ranks/selects elites, performs crossover/mutation and preserves strong candidates. A modified discrete SAC learner updates actor/critic from replay and periodically replaces a weak population member. Boltzmann policies store per-node priors and temperatures, can be seeded from GNN outputs and mutate without a neural forward pass. The deployed choice is the best-ranked population policy, which need not always be a GNN. This is a hybrid search system, not the standalone SAC baseline (Figure2;appendix C–E).

**Configuration and guarantees.** The appendix uses four GNN layers,128-dimensional hidden/output sizes, four attention heads, actor/critic learning rate10⁻³,batch24,discount0.99,entropy coefficient0.05,target-updateτ10⁻³and4,000environment steps. Discrete entropy and clipped Gaussian perturbations of one-hot actions modify the critic/actor learning. These are algorithmic choices; no theorem proves convergence to a globally optimal memory map or universal improvement over every compiler (appendix B–D).

## Experiments

**Workloads and protocol.** Batch-one inference uses ResNet-50,ResNet-101andBERT with57,108and376operational nodes. The native compiler retains its other optimization/cache-management stages while only memory mapping changes. Five independent runs provide means/standard deviations. Curves count evaluations cumulatively across the population; the text describes hardware-inference iterations while invalid proposals skip inference, so this axis should not be equated with elapsed time or all compilation costs (Section4).

**Baseline quality.** “PG” is the modified discrete SAC component rather than a reproduction of every prior placement system. EA is a population baseline/ablation. “Greedy-DP” tries nine choices per layer with other assignments fixed, repeats through the graph and makes several passes; it is a greedy coordinate-search heuristic inspired by DP, **not an exact dynamic-programming optimum**. The native compiler is a practical heuristic reference, not an optimality bound (Section4).

**Measured results.** Reported final speed ratios over the compiler are1.28forResNet-50,1.78forResNet-101and1.66forBERT. Since speed is reciprocal latency, these correspond to approximately21.9%,43.8%and39.8%less latency respectively, not28%,78%and66%less elapsed time. EA gives1.06,1.47and1.64, so BERT's incremental EGRL gain over EA is small. Standalone PG gives0.29,0.23and0.21, while Greedy-DP gives0.72,1.27and0.67. Thus the hybrid system beats the listed final means, but the individual gradient learner is poor in isolation (Sections4–5,Figure3).

**Transfer.** Figure4reuses learned hidden embeddings from BERT or ResNet-50 on another workload without fine-tuning, changing input/output graph representations for the new topology. Transfer underperforms workload-specific training; performance varies with source checkpoint and can fall below the compiler. The paper notes degradation after additional training, consistent with overfitting. This is a limited zero-shot transfer test within tensor-memory mapping, not an unchanged model solving unrelated combinatorial problems or guaranteed cross-workload superiority (p.7).

**Interpretation and costs.** UMAP clusters and memory-tier transition plots suggest faster maps often avoid DRAM and colocate nearby layers' tensors. They are qualitative observations, not a proof of globally optimal allocations. The reported inference-speed ratios do not include the offline4,000-stephardware search, compiler calls, policy optimization or amortization over future queries (Figures5–6;appendix B).

## Limitations

### Discussed in the Paper

Transfer is preliminary and can worsen with overtraining. Mapping decisions are difficult to interpret. Broader metric trade-offs, batch size, frequencies and power/data decomposition are future extensions. Earlier placement methods cannot all be directly reproduced for this hardware/task, motivating component baselines instead (Sections2,5–7).

### Curator Notes

Hardware/firmware/compiler interfaces, validity feedback and capacity/bandwidth behavior are essential dependencies. Five-seed confidence in selected workloads does not establish behavior on arbitrary accelerators. Neural and stateless policies cooperate, so the headline result should not be attributed to the GNN alone. Native-compiler speed ratios are not certified gaps, and faster batch-one inference is distinct from total optimization cost. The exact hardware/compiler access and complete released implementation were not verified as public reproduction artifacts.

## Reproducibility

- **Formal qualification:** [ICLR2021record](https://openreview.net/forum?id=-6vS_4Kfz0), corroborated by the official ICLR2021download list and the [authors' Technion publication list](https://rlrl.net.technion.ac.il/publications/). Its2020arXiv posting date is not the formal publication date.
- **Actual read version:** all sixteen pages of [arXiv:2007.07298v2,2020-10-15](https://arxiv.org/abs/2007.07298v2), including integrated appendices A–E. A fresh version-specific download matches the cached PDF SHA exactly. It is a preprint reading substitute; byte identity with the final conference PDF is not asserted. Key figures, algorithms and tables were visually inspected.
- **Scientific supplements:** manual OpenReview PDF/forum/API/attachment requests encountered403verification challenges. The accessible author/arXiv sources identify the integrated appendices, all read, and no additional scientific attachment was identified. The authors' publication entry exposes the paper link; unavailable attachments are not assigned invented contents.
- **Code:** the read paper promises open source in future but gives no verified implementation URL. Accessible author/publication discovery did not identify a public EGRL memory-placement implementation; unrelated projects sharing the acronym are not linked as code.
- **Citation graph:** explicit citations match RL Device Placement and Hierarchical Placement. The cited Addanki2018Placeto workshop version uses an earlier title; the coauthor's publication page associates that title with the NeurIPS2019Placeto work, supporting one stable paper identity with the actual cited version recorded. REGAL is a different method and is not equated with EGRL.
