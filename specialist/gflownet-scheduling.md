---
id: gflownet-scheduling
short_title: Scheduling GFlowNet
title: Robust Scheduling with GFlowNets
authors:
- David W. Zhang
- Corrado Rainone
- Markus Peschl
- Roberto Bondesan
year: 2023
date: '2023-01-17'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=ZBUthI6wK9h
venue: ICLR
paper_url: https://openreview.net/forum?id=ZBUthI6wK9h
institutions:
- University of Amsterdam
- Qualcomm AI Research
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2302.05446
paradigm: constructive
problem_families:
- Scheduling
problems:
- DAG Scheduling
summary: A graph- and temperature-conditioned GFlowNet constructs diverse DAG schedules, ranks candidates with a
  proxy and selects among the best100using separate target-model evaluations.
code_url: https://github.com/davzha/scheduling-gflownet
---

# Robust Scheduling with GFlowNets

> **TL;DR:** Train a conditional GFlowNet to generate diverse, low-proxy-makespan schedules; evaluate a shortlist on a separate target model and select its best schedule. Robustness is demonstrated for modeled runtime/communication errors, not measured hardware deployment.

## Motivation

Optimizing an inexpensive scheduling proxy can exploit its mistakes. The proxy here assumes accurately profiled operation durations and instantaneous inter-device data movement, whereas the intended target can have noisy durations, bandwidth limits or startup latency. Several schedules with similarly good proxy cost may perform differently on that target. The paper therefore seeks a useful candidate distribution rather than only one proxy optimum.

## Contributions

The method introduces a graph-conditioned scheduling GFlowNet trained with a log-partition variance loss, avoiding a separate graph-to-log-partition regression head. Temperature conditioning permits changing the diversity/quality trade-off without retraining. A finite-flow continuity theorem motivates this conditioning, and experiments examine single-graph robustness, transfer to synthetic graph distributions and unseen real-world compiler computation graphs.

It remains a **specialist/constructive** solver. Every sample builds a precedence-feasible DAG schedule with operation-to-device assignments and an order on each device. Graph distribution, graph size and temperature changes stay within that native scheduling problem. The reported experiments use four homogeneous devices throughout; there is no shared multi-problem checkpoint demonstration.

## Methodology

A state is a partial schedule. A forward action selects an operation whose predecessors are already scheduled and appends it to a device chain; these constraints ensure that the combined precedence/device graph stays acyclic. The proxy derives earliest start times by longest-path-style recurrence, then computes makespan. Speedup U is total serial duration divided by that proxy makespan; reward is exp((U-m)/sigma), with m the device count and positive temperature sigma.

For a complete trajectory, the implicit log-partition estimate zeta equals log reward plus summed backward log-probabilities minus summed forward log-probabilities. Its variance across trajectories for the same graph/temperature supplies the training loss, in place of explicitly regressing log Z. A shared Topoformer graph encoder uses topology-dependent attention masks and separate forward/backward MLP policy heads. Temperature embeddings modulate hidden features through learned scale/shift transformations. Input features include operation duration and current proxy start time, device placement, valid-forward/valid-backward indicators and scheduled status (Equations4-9; AppendicesC-E).

Each update samples one graph and one log-uniform temperature between0.01and1, then100on-policy trajectories for that conditioning pair. Adam uses its default settings as described in the article. At inference the method samples1,000schedules at temperature0.005, outside the training interval, retains the100best according to the proxy, and evaluates those100on the target model. PPO uses the same sampling/shortlist counts; BRKGA supplies100final-population candidates; critical-path list scheduling supplies a single schedule. These candidate/evaluation budgets are part of the method, rather than a single-shot neural prediction.

## Experiments

**Single graph.** An approximately78-node real-world graph is both the training and test graph. For modeled bandwidth limitation, GFlowNet target speedup is1.78±0.03versus PPO1.38±0.49; for modeled latency limitation it is2.11±0.03versus1.87±0.38. The noisy-duration case slightly favors PPO,3.07±0.09versus GFlowNet3.05±0.04. Thus the overall robustness trend does not mean winning every target. GFlowNet has higher reported candidate diversity, while its best proxy speedup3.21is lower than PPO3.28 (Table1).

**Unseen synthetic graphs.** Training uses1,000fifty-node Erdős-Rényi/layered graphs. Testing uses50graphs equally drawn from those two distributions and stochastic-block, Watts-Strogatz and Barabási-Albert distributions, with durations drawn uniformly from(0,1). GFlowNet gives proxy top1speedup3.46and top100average3.41, versus PPO3.48/3.46. Its higher diversity is therefore accompanied by a proxy-quality trade-off, not superior pure proxy optimization. The temperature plots show sharper, higher-speedup samples at lower inference temperatures (Table2/Figure3).

**Unseen real-world graphs.** Eight training graphs have fewer than100nodes; four unseen evaluation graphs range from roughly a dozen to128nodes. Training samples25-75-node subgraphs. GFlowNet's target-model speedups are2.71±0.01for noisy runtimes,1.73±0.01for bandwidth limitation and1.95±0.03for latency limitation; BRKGA gives2.46±0.16,1.55±0.17and1.80±0.18. PPO underperforms here and its training does not converge with the reused hyperparameters. The graphs originate from neural architectures used in commercial AI products, but the reported target evaluations remain simulated models (Table3; AppendixE.6).

The log-partition variance loss begins improving earlier and reaches higher speedup than the learned-log-Z trajectory-balance baseline in the reported ablation. Training across temperatures also outperforms the particular fixed-temperature settings tested. The paper does not identify the number of independent training seeds or define the meaning of its ±entries, and its tables do not provide wall-clock training/selection costs. Diversity metrics are graph-edit distance and two distances based on proxy start times, with/without device-placement features; they are not direct measures of target-error coverage.

## Limitations

Robust selection requires evaluating100shortlisted candidates on the target; a proxy ranking can still discard a target-optimal schedule. Diversity alone is insufficient, as acknowledged by the authors and illustrated by PPO's real-world results. The method provides no worst-case guarantee under arbitrary proxy mismatch, no scheduling approximation ratio and no established training convergence rate. Demonstrated scale reaches128nodes with four homogeneous devices; larger graphs and heuristic integration are future directions. An experiment that uses a real-world graph is distinct from actual runtime measurement on physical target hardware.

### Theory Scope

Theorem1/AppendixArescale each trajectory ending at x by the terminal reward ratio Ri(x)/R(x); if R(x)=0they divide Ri(x)uniformly among its finitely many trajectories. This establishes existence and continuity of nonnegative trajectory flows for the finite scheduling state space. The temperature corollary concerns a suitable unnormalized flow family with U<=m. It does not prove that all learned normalized policy probabilities are monotone, that the neural network learns the ideal distribution, or that a sampled shortlist is robust to every target error.

AppendixB's gradient-direction example assumes the backward policy is independent of the optimized parameters and a nonzero forward gradient; under a sufficiently large log-Z estimation error it shows a sign reversal of the per-trajectory loss direction. The actual architecture shares an encoder across learned forward/backward heads, so that illustrative argument should retain its stated simplifying assumptions. It motivates the loss design rather than certifying superiority of every variance-loss update.

## Reproducibility

- All17pages of the identified [arXivv2manuscript, February14,2023](https://arxiv.org/abs/2302.05446v2) were read, including the complete bibliography and scientific AppendicesA-F. Its header identifies the ICLR2023conference paper; the [author's university publication record](https://ivi.fnwi.uva.nl/vislab/publication/david-iclr-2023/) also identifies the formal venue. The four authors are David W. Zhang, Corrado Rainone, Markus Peschl and Roberto Bondesan, affiliated with University of Amsterdam/Qualcomm AI Research. January17,2023is the arXivv1submission date, so the note retains only2023precision for formal publication rather than treating that submission day as the conference publication date.
- The [OpenReview forum](https://openreview.net/forum?id=ZBUthI6wK9h) is the formal publication link. Its page requires challenge verification, and both APIv1/v2forum queries returned403when checking scientific attachments. The complete identified arXivversion contains AppendicesA-F, and its text does not explicitly require a separate missing scientific supplement. No unavailable attachment is claimed as read. The earlier NeurIPS2022ML4Systems workshop version is distinguished from the included ICLR2023publication.
- The [author-linked repository](https://github.com/davzha/scheduling-gflownet) at commit`8bc2e0d71d9865ad98f7249293521306c7e1a735` contains only README.md and LICENSE. It currently provides no implementation, checkpoint, dataset or scientific PDF. The link is retained as an author repository, with this availability limitation; no released training implementation or benchmark reproduction is claimed.
- Eight central pages were rendered and visually checked for the candidate pipeline, all three result tables, temperature/learning curves, flow proof, gradient-direction derivation and architecture. The correlation plot on PDF7was checked separately. Three relationships to existing catalogue entries have both explicit body references and full bibliography identities: Placeto, EGRL and Learning to Dispatch. Other uncatalogued backbone/GFlowNet/scheduling references do not receive invented relation IDs.
