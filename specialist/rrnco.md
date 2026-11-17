---
id: rrnco
short_title: RRNCO
title: 'RRNCO: Towards Real-World Routing with Neural Combinatorial Optimization'
authors:
- Jiwoo Son
- Zhikai Zhao
- Federico Berto
- Chuanbo Hua
- Zhiguang Cao
- Changhyun Kwon
- Jinkyoo Park
year: 2026
date: '2025-03-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/9446c291a8744a125a0bda5b18f4d5a1-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/9446c291a8744a125a0bda5b18f4d5a1-Abstract-Conference.html
institutions:
- Omelet
- KAIST
- Radical Numerics
- Singapore Management University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Asymmetric Traveling Salesman Problem
- Asymmetric Capacitated Vehicle Routing Problem
- Asymmetric Capacitated Vehicle Routing Problem with Time Windows
- Stochastic Multi-Period Time-Dependent Vehicle Routing Problem
summary: An autoregressive routing constructor fuses coordinates with sampled asymmetric costs and learns distance/angle/duration
  biases; separate task checkpoints are evaluated on100-city road data, with a separately trained multi-snapshot
  stochastic extension.
code_url: https://github.com/ai4co/real-routing-nco
arxiv_url: https://arxiv.org/abs/2503.16159
figure:
  path: paper-assets/rrnco/framework.png
  alt: Adaptive coordinate/distance row-column node embeddings feed bias-conditioned attention-free encoder blocks
    and a MatNet/ReLD-style autoregressive decoder.
  caption: 'Figure 2: RRNCO combines adaptive node embeddings, neural edge-cost biases and sequential route construction.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=4
---
# RRNCO: Towards Real-World Routing with Neural Combinatorial Optimization

> **TL;DR:** Fuse coordinates with sampled asymmetric road costs, then learn encoder biases from distance, direction and optional travel duration. A100-city dataset supports separate ATSP, ACVRP and ACVRPTW checkpoints. The stochastic appendix distinguishes a static-trained model from a **separately trained three-snapshot variant**; a shared framework does not demonstrate one shared checkpoint solving every task.

## Motivation

Euclidean coordinates alone do not encode one-way streets or the difference between travel distance and travel duration. RRNCO addresses these missing edge features through a routing architecture and a locally reproducible OSRM data-generation pipeline. It studies road-topology asymmetry and a simulated stochastic extension. Actual live-traffic APIs and traffic forecasting are explicitly future work, rather than completed deployment evidence. [Sections1–3/AppendixB.2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=1)

## Contributions

- **Adaptive Node Embedding (ANE):** combine coordinate features with sampled outgoing/incoming distance features through learned contextual gates.
- **Neural Adaptive Bias (NAB):** fuse distance, directional angle and optional duration features to condition row/column attention-free encoder aggregation.
- A100-city road-cost dataset and fast online instance subsampling preserve asymmetric distance/duration relationships.
- Experiments evaluate held-out instances, held-out cities, clustered sampling and a separately specified stochastic traffic protocol.

## Methodology

### Adaptive node and edge representations

For each node, ANE samples k cost entries with probabilities inversely related to distance. Separate projections produce row/outgoing and column/incoming tokens; a sigmoid gate mixes those tokens with coordinate embeddings. Demand/time-window attributes are incorporated through additional learned projections. The release uses25 sampled entries, sorts the gathered row/column values, and adds depot-relative polar-angle coordinate features for CVRP. Its sampler adds an epsilon and sets diagonal cost to a large value before reciprocal sampling, handling the formal equation's zero-diagonal singularity in code. [Equations3–9.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=5)

NAB maps distance, pairwise angle and, for time-window variants, duration through small neural projections. A learned gate fuses available modalities and projects each ordered pair to a scalar bias. AAFM then uses that dense bias in gated exponential aggregation of column values into row tokens and vice versa. Sampling the *initial embedding features* does not remove full matrix computation: NAB explicitly creates N-by-N feature maps and the solver still receives full asymmetric matrices. [Equations10–16/Figure2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=5)

### Autoregressive construction

The decoder draws on MatNet and ReLD: a context representing the current route state queries cached embeddings using MHA, receives a direct context residual and a feed-forward residual, then selects the next feasible node. ATSP includes the first node in its context; ACVRP uses remaining capacity, and ACVRPTW also uses current time. The paper's Equation21 adds a negative-log-distance heuristic before clipping and softmax. [AppendixA.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=15)

Each action extends a partial route; the method does not learn an operator that rewrites a complete incumbent. The catalog retains **constructive**. Official examples train and load distinct ATSP/ACVRP/ACVRPTW models, so scope remains **specialist**, despite the paper's broad wording about a unified framework. Static embeddings adapting to a partial route are not proof of cross-problem checkpoint sharing.

### Training and source-version boundaries

Training uses label-free REINFORCE with the POMO shared baseline; “data-free” in the introductory wording does not mean no training instances. Table6 specifies Adam at.0004, decay by.1 at epochs180/195, batch256,100,000 instances per epoch,128-dimensional embeddings,512-dimensional feed-forward layers and12 AAFM blocks. The release has six paired row/column layers, accounting for12 such blocks, and a200-epoch experiment configuration. It specifies batch64 under distributed training; the main paper reports four A100/40GB GPUs and roughly24hours. Per-device and aggregate batch sizes must be distinguished before reproducing the budget. [Section6.1/AppendixC.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=7)

Two implementation differences are material. The inspected `AFTFull` applies softmax to A and K **before** the exponential products; this is not algebraically the unnormalized Equation10. The decoder subtracts learned linear distance/duration terms and applies `log(exp(score−bias)+1e−6)`, rather than Equation21's negative-log-distance expression. The released angle convention uses coordinate differences in the opposite orientation from the displayed formal formula. These are recorded as paper/snapshot differences, without claiming which exact revision produced every published number.

## Experiments

### Dataset scope and train/test separation

Each of100 cities contributes1,000 base locations in a **3×3km patch centered on the city**, not its entire road network. Road-segment sampling is weighted by segment length; bridges, tunnels, highways and water-buffer regions are filtered. Locally hosted OSRM supplies complete distance/duration matrices, followed by preprocessing for unreachable/abnormal entries. Instance generation selects location indices and corresponding submatrices, adding demands/time windows. New subsets increase instance diversity but do not create entirely new road topologies. [Figure3/AppendixB.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=7)

The paper's full city table and actual released split list have80 training cities and20 test cities. The principal examples/test filenames concern100-customer problems, and each main test set contains1,280 instances. In-distribution uses new subsets of training maps; OOD-city uses held-out maps; OOD-cluster changes sampling. These are different generalization axes. The finite1,000-location base also bounds the available distinct locations for a sampled city instance.

### Main result quality and timing

All main evaluations use an A6000 GPU with a Xeon2.20GHz CPU, test batch32, and eightfold augmentation except the supplied SL models LEHD/BQ/GOAL. Table1 times are for each **whole1,280-instance test set**. LKH uses5seconds per instance; PyVRP and OR-Tools use20seconds per instance, on one CPU core, giving approximately1.6hours/7hours totals. Their best solutions define heuristic references, not universal optimality certificates. [Table1/AppendixC.2–C.3.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=8)

| Task | In-distribution gap / time | Held-out-city gap / time | Clustered-sampling gap / time |
| --- | --- | --- | --- |
| ATSP |1.799% /23s |2.268% /23s |2.250% /23s |
| ACVRP |3.450% /26s |3.578% /26s |3.231% /26s |
| ACVRPTW |3.736% /52s |3.775% /52s |4.290% /52s |

RRNCO improves the displayed neural quality rows under this protocol. Its main speed claim needs qualification: ACVRP AAFM takes11seconds versus26seconds for RRNCO, with worse gap9.928vs3.450%; several node-only models are also faster. On ACVRPTW, OR-Tools obtains better in-distribution quality1.377vs3.736%, using a much larger CPU budget. The result is a quality/time trade-off, not simultaneous dominance over every listed solver.

Only RRNCO, MatNet on ATSP/ACVRP and GCN on ACVRP are retrained under the real-data setup. Node-only and supervised models use supplied models without equivalent retraining. Normalizing coordinates does not make a synthetic coordinate-only training distribution equivalent to asymmetric road-cost supervision. Strong sim-to-real baseline failures therefore combine architecture/input limitations with training-protocol differences.

### Ablation evidence

ANE/NAB improve the displayed component ablation. On ACVRPTW, removing duration changes in-distribution gap3.74→3.93%; removing angle as well gives4.06%. The OOD-cluster sequence is4.29→4.65→4.84%. These support incremental utility on this benchmark, not a proof that all modalities are universally indispensable. [Figure4/Table2.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=9)

Training data have a large effect: MatNet trained on its synthetic ATSP generator obtains110.70% real-data gap, versus3.98% after real-data training. RRNCO with noisy synthetic costs gives7.72%, versus1.80% with the real generator. This strengthens the dataset contribution while also demonstrating why unmatched training can exaggerate an apparent architecture-only gain. [Table3.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=10)

### Stochastic traffic is a separate protocol

AppendixE uses an SVRPBench-style simulator: Euclidean free-flow times plus time/distance-dependent congestion, log-normal variability and incident delays. Residential/commercial time-window distributions are separately generated. These simulated inputs are not observed live traffic from the100-city OSRM archive. Standard NAB is trained100epochs on static real-generator instances and evaluated without SMTVRP fine-tuning. Its reported cost is601.03, full feasibility, zero TW violations and.20s. [Table4/AppendixE.1–E.4.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=22)

The **Multi-Snapshot NAB** changes the architecture to fuse distance, angle and three duration snapshots through five-way gating. It is separately trained100epochs with these inputs, encodes their look-ahead context once, and reports594.19 at the same rounded.20s. It is not simply the unchanged static checkpoint obtaining this improved number. RouteFinder receives20epochs of EAL adaptation and achieves602.20 in.05s, while GOAL is used without adaptation. The adapted/zero-shot budgets differ. [Table7/AppendixE.3–E.5.](https://proceedings.iclr.cc/paper_files/paper/2026/file/9446c291a8744a125a0bda5b18f4d5a1-Paper-Conference.pdf#page=24)

OR-Tools has only24.2% feasibility in that protocol, so its610.08 cost is not automatically a like-for-like aggregate over the same feasible solution set as100%-feasible methods. The exact stochastic test instance count/size, uncertainty across seeds, and evaluation handling of failed cases are not fully stated in these pages. AppendixE's100-epoch training statement also points to180/195 learning-rate milestones that cannot occur within100 epochs; that setting difference remains unresolved.

## Limitations

### Discussed in the Paper

The work targets the topological and edge-feature gap between Euclidean models and road-cost routing. Incorporating commercial live-traffic APIs and forecasting is left to future work. The stochastic appendix introduces an explicitly simulated extension with its own architecture and training.

### Curator Notes

- A reusable framework and separate problem checkpoints do not establish shared-weight generalist solving. Main100-customer examples do not demonstrate arbitrary graph-size scalability.
- Full pairwise matrices, dense per-edge hidden features and multiple starts remain computational requirements; sampled initial cost features do not imply a sparse overall model.
- Unretrained node-only/SL comparators, augmentation differences and CPU/GPU budgets constrain architecture-only conclusions. Several cheaper solvers have weaker quality, and classical longer-budget solvers can be more accurate.
- OSRM city-center patches and generated demands/windows are more structured than Euclidean toy instances but do not include every operational constraint or live congestion source.
- Paper/code discrepancies in exponential aggregation, decoder bias and angle convention are not resolved by a download or successful extraction. The inspected snapshot lacks a complete stochastic simulator/multi-snapshot configuration, limiting reproduction of the appendix extension.
- “First” and universal state-of-the-art language is treated as the authors' positioning, not an independently established exhaustive priority claim. Independent training-seed confidence intervals are not supplied for every main comparison.

## Reproducibility

- **Reading:** all25 official ICLR pages freshly read, including complete references, all100 city-table rows and scientific AppendicesA–E. The architecture, decoder equations, main table, modality ablation and multi-snapshot formulas/results were visually inspected.
- **Formal identity:** publisher HTML verifies seven authors and publication20April2026, plus the only listed Paper link. The first three authors share equal-contribution credit, with Omelet/KAIST/Radical Numerics/SMU affiliations. ArXiv2503.16159 identifiesv1 on20March2025 andv2 on14March2026, with the former six-author title evolving to the present seven-author formal work. Cited old versions remain version-qualified.
- **Scientific inventory:** the full formal PDF contains all namedA–E materials. OpenReview API forsKvo9ZZfpe returned403, disclosed without claiming unseen attachments. The actual193-entry repository tree and194-member fixed-commit ZIP were inspected; no extra PDF/TEX/notebook/nested ZIP was present. Four PNGs match paper Figures1–3. The Korean NAB ablation guide and data-generation README were read in full: the guide describes how to run alternatives and expected comparisons, not new numerical results.
- **Code snapshot:** commit823d510dadf4dd711730ec4fbf337c356a0de6ae; selected complete ANE sampling/gating, encoder row/column updates, AAFM/NAB, decoder, RL loss, training/test configurations and split list were read. Main examples load separate `checkpoints/{problem}/epoch_199.ckpt` paths. Source/config behavior and printed equations are reported separately. No training or benchmark run was repeated.
- **Stochastic-release boundary:** a source search across the complete snapshot found an SMTVRP reward-normalization conditional, but no SMTVRP environment/configuration, incident/congestion simulator or K3 multi-snapshot implementation. The static NAB implementation accepts a single duration matrix. This is an inspected-release limitation, not a claim that the scientific appendix was unread.
- **Citation identity:** actual in-text author/year citations were matched to the full bibliography. SIL includes both its six-author2024 precursor and seven-author2025 formal representative, with their comparison-supported continuity preserved. BQ's cited “Generalizable” preprint title and ICAM's early title belong to their identified arXiv chains; no future formal version is imputed to the citation. Distinct uncatalogued papers are not forced onto similar-looking stable IDs.
- **Figure:** complete original Figure2, PDFpage4, cropped from the formal paper. [Official code/data instructions](https://github.com/ai4co/real-routing-nco); [formal article](https://proceedings.iclr.cc/paper_files/paper/2026/hash/9446c291a8744a125a0bda5b18f4d5a1-Abstract-Conference.html).
