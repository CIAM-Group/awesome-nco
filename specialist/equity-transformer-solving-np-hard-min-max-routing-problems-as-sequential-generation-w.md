---
id: equity-transformer-solving-np-hard-min-max-routing-problems-as-sequential-generation-w
short_title: Equity-Transformer
title: 'Equity-Transformer: Solving NP-Hard Min-Max Routing Problems as Sequential Generation with Equity Context'
authors:
- Jiwoo Son
- Minsu Kim
- Sanghyeok Choi
- Hyeonah Kim
- Jinkyoo Park
year: 2024
date: '2023-06-05'
publication:
  date: '2024-03-24'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/30007
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/30007
institutions:
- Korea Advanced Institute of Science and Technology
- Omelet
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Min-max Multiple Traveling Salesman Problem
- Min-max Multi-agent Pickup and Delivery Problem
- Min-max Capacitated Vehicle Routing Problem
summary: An autoregressive centralized Transformer constructs min-max multi-agent routes with ordered depot tokens
  and a four-part workload context. Separate task models and size-specific context finetuning support large routing
  tests; optional external NCE refinement and batched-throughput measurements have distinct protocols.
arxiv_url: https://arxiv.org/abs/2306.02689
code_url: https://github.com/kaist-silab/equity-transformer
figure:
  path: paper-assets/equity-transformer-solving-np-hard-min-max-routing-problems-as-sequential-generation-w/framework.png
  alt: City embeddings and position-encoded dummy depot tokens feed a three-layer encoder and attention decoder,
    using dynamic equity context to select nodes and delimit agent tours.
  caption: 'Original Figure 2: Equity-Transformer architecture.'
  source_url: https://arxiv.org/pdf/2306.02689v3#page=3
---

# Equity-Transformer: Sequential Generation with Equity Context

> **TL;DR:** A centralized autoregressive Transformer constructs multiple agents' tours as one sequence, using ordered dummy depot tokens and workload context to minimize the longest tour. This is **specialist/constructive**: mTSP and mPDP have separate training/checkpoints, with an additional small mCVRP experiment. Optional external NCE refinement is a separate evaluation pipeline.

## Motivation

Minimizing the longest vehicle route requires balancing workload across agents. Decentralized event-based policies face coordinated action spaces; a single sequential generator simplifies planning but can lose relationships between earlier and later agents. Equity-Transformer introduces agent order and workload context into this centralized construction process. Sequential planning here concerns a static known instance, rather than a demonstrated online dispatcher handling stochastic arrivals. [Introduction and formulation.](https://arxiv.org/pdf/2306.02689v3#page=1)

## Contributions

- Homogeneous agents receive sinusoidal positional encodings through replicated depot tokens, creating an artificial order for planning their routes.
- Four-part dynamic equity context combines global embeddings, the active agent, remaining cities per unused agent and distance information.
- Symmetric shared-baseline REINFORCE trains the constructor; context-only finetuning adapts it to larger sizes.
- Experiments cover synthetic min-max mTSP/mPDP, converted TSPLIB, distribution and agent-ratio shifts, optional external NCE refinement and a small min-max CVRP case. [Architecture and context.](https://arxiv.org/pdf/2306.02689v3#page=3)

## Methodology

### A sequence of agent tours

The formulation includes the depot among N locations and adds M dummy depots, one per agent. A masked autoregressive sequence is split into agent tours whenever a depot token is selected. The objective is the maximum Euclidean tour length, not total fleet distance. Positional encoding distinguishes otherwise identical agent/depot representations. A three-layer AM-style encoder processes the augmented city/agent tokens; a contextual attention decoder chooses the next feasible index.

The context concatenates four projected components: mean problem embedding; current agent-depot and last-node embeddings; remaining-city/unused-agent ratio; and current route length plus maximum distance from the depot to an unvisited city. These features encourage balanced stopping decisions but do not impose an equal-load theorem. [Formulation/Figures2-3.](https://arxiv.org/pdf/2306.02689v3#page=2)

### Learning, adaptation and optional refinement

Training uses a shared mean-cost baseline across symmetric samples. The displayed policy-gradient approximation omits the score-function gradient factor; the inspected released `train.py` multiplies the centered cost by log-likelihood before differentiation, matching the stated REINFORCE training intention. Finetuning adjusts context parameters at selected larger sizes. Parameter adaptation changes the constructor; it is not an incumbent-tour editing operator.

AppendixD.3 defines **ET*** as ET initialization followed by the separately published NCE cross-exchange improver. That external combination is evaluated independently against two-stage baselines and should not be conflated with the primary ET constructor or used to claim a newly learned ET edit operator. [Training and optional pipeline.](https://arxiv.org/pdf/2306.02689v3#page=4)

## Experiments

### Training, hardware and inference budgets

AppendixB specifies100epochs,1,280,000instances per epoch, batch512 and learning rate1e-4 for each task. Initial size is50; context finetuning uses learning rate1e-5, batch128 and15hours. The stated finetuning sizes are200/500 for mTSP and200 for mPDP. Reported initial training times are about one day for mTSP and four days for mPDP. Inference uses eight augmentations; **ET†** additionally samples100solutions per instance. Separate mTSP/mPDP checkpoints are released.

Synthetic tables average100uniform instances per configuration at N=200,500,1000,2000,5000, primarily N/M between10and20. Hardware is one A100 GPU and a32-core AMD EPYC7542 CPU. Primary times process instances serially; CPU heuristic budgets and GPU neural times remain hardware-dependent. LKH uses one run, seed3333 and maximum1,000trials subject to the stated wall-time limit. OR-Tools uses cheapest-arc initialization and guided local search. NCE receives size-dependent time budgets. [Detailed settings.](https://arxiv.org/pdf/2306.02689v3#page=11)

### Main min-max results and numerical qualifications

For mTSP1000/M100, ET reports cost2.05 in1.79s versus LKH600s cost2.92. The timing ratio is about335x, while the cost reduction for this **same row** is about29.8%, not the abstract's53%. NCE is2.05 in15.01s in the table; the surrounding prose's2.16 is ScheduleNet's value. ET therefore matches NCE quality there while running faster. At5000/M300, ET2.40/8.78s compares with NCE2.97/290s. These are selected configurations and bounded baseline searches, not an approximation guarantee.

For mPDP200/M10, ET†4.68/.55s compares with OR-Tools18.76/600s: about75% lower cost and **1,091x**, rather than the printed1,901x timing ratio. At5000nodes, ordinary ET takes roughly53-55s versus AM8.3s and HAM34.4-34.7s, while achieving substantially shorter longest routes. ET is therefore not uniformly the fastest neural row. MAPDP was excluded because the authors could not access its code. [Full Tables1-2.](https://arxiv.org/pdf/2306.02689v3#page=5)

### Appendices, ablations and additional tasks

The positional/context ablation supports the combined design overall, but adding positional encoding to context alone ties at some displayed configurations. AppendixA measures **batch throughput within ET**:500instances with1000nodes take815.52s serially versus5.35s in parallel, about152x. This must not be multiplied into the main single-instance heuristic speedup.

Converted TSPLIB covers11instances and three agent counts each. ET† is often strong but not uniformly best: OR-Tools beats it on kroA200/M10, and ordinary ET is better than ET† on pr1002/M50 and fl1577/M100. The caption's augmentation range `500 <= N < 500` is inconsistent; the intended boundary is not silently inferred. These are converted min-max instances, not established exact mTSP optima.

Four unseen coordinate distributions are compared with LKH600s on100instances each at500/M50. Larger N/M ratios100and250 are tested in three configurations, with600/3600s heuristic budgets. AppendixD.3 compares ET* with published SplitNet/GNN-DisPN numbers because SplitNet code was unavailable, so it is not a fresh identical-code rerun. AppendixD.4 adds min-max CVRP30/M3: ET2.23/.29s versus NCE2.25/2.03s and AM1200-sample2.29/27.6s. That small extension lacks equally detailed capacity/training/checkpoint documentation and does not establish one shared multi-problem policy. [Complete AppendicesA-D.](https://arxiv.org/pdf/2306.02689v3#page=10)

## Limitations

The approach is centralized and static; variable agent counts and larger sizes do not demonstrate a generalist checkpoint across native problem types. Context finetuning is part of the large-size protocol, so the full results are not all zero-shot transfer from size50. The min-max objective concerns the longest geometric route and does not by itself validate practical fairness, service constraints or real-time robustness.

Classical baselines have explicit finite budgets and different hardware paths. The paper's statement that every method eventually reaches optimality with unlimited time is not established for these learning/heuristic methods. No certified approximation bound or multiple-training-seed uncertainty is provided. Numerical wording and the appendix caption inconsistency are recorded above without changing the authors' table entries. No training or benchmark experiment was independently rerun.

## Reproducibility

- Formal AAAI2024 DOI10.1609/aaai.v38i18.30007, pages20265-20273, has publisher-deposited publication date2024-03-24. The full manuscript lists Jiwoo Son, Minsu Kim, Sanghyeok Choi, Hyeonah Kim and Jinkyoo Park, affiliated with KAIST and Omelet. Son/Kim are marked equal contributors; no corresponding-author label is invented.
- **All16pages of arXiv2306.02689v3(2024-02-05) were fully read**, including complete references and AppendicesA-D. Primary history independently establishes first submission2023-06-05. Formal publisher access returned a challenge; the identifiable arXiv version is the actual scientific reading source.
- The [official repository](https://github.com/kaist-silab/equity-transformer) was manually inventoried at SHA2b2763ba11b5a477365f0e7849650e7e231731fb:104entries, one README, no PDF/TeX/ZIP/notebook science attachment and no releases. The full README and relevant policy-gradient code were read. Released checkpoints and datasets are separated by task/size. Python>=3.8, PyTorch>=1.7, NumPy, tqdm and tsplib95 are listed; README mPDP evaluation examples use the literal problem argument `pdp`, whereas training uses `mpdp`, a command detail to check before execution.
- Complete original Figure2 is cropped from actual PDFpage3, rectangle(315,50,568,291), at5x and actually viewed. The context diagram, training formula, all main tables, ablation, throughput table and every appendix result table were rendered and visually inspected.
- Internal citations require explicit body discussion and matching full bibliography identities. CoRR/arXiv versions are identified as such; independent journal extensions such as Hu2020 are not forced onto conference counterparts.
