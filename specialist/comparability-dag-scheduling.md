---
id: comparability-dag-scheduling
short_title: DAG-CAI-DR
title: Reinforcement learning for one-shot DAG scheduling with comparability identification
  and dense reward
authors:
- Xumai Qi
- Dongdong Zhang
- Taotao Liu
- Hongcheng Wang
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/dc16950e510bcd573783f5c2d7d8cc31-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/dc16950e510bcd573783f5c2d7d8cc31-Abstract-Conference.html
institutions:
- Tongji University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Heterogeneous Workflow DAG Scheduling
- Resource-Constrained Workflow DAG Scheduling
- Job Shop Scheduling
summary: One neural pass assigns DAG priorities; ready-node antichain selection and
  heuristic-relative node completion feedback train a constructive list scheduler,
  with specific sampling and unbiasedness qualifications.
code_url: https://github.com/9erAlpenjaeger/DAG-CAI-DR
---

# Reinforcement learning for one-shot DAG scheduling with comparability identification and dense reward

> **TL;DR:** Compute task priorities once, build a precedence-feasible order through ready-node selections, and train with per-node completion feedback relative to a heuristic. Most tested scheduling settings improve, but the claimed exact probability/unbiased-gradient interpretation needs qualifications for the implemented fixed-Gumbel sampler and dense feedback.

## Motivation

Several priority lists can induce the same precedence-feasible execution order. The paper seeks to avoid comparisons that cannot change that order and to provide more detailed feedback than a single final makespan. Its contribution concerns how priorities are decoded and trained, while retaining list scheduling and task-specific resource simulation.

## Contributions

Comparable antichain identification(CAI) uses the zero-in-degree ready set during priority topological sorting. Dense reward(DR) compares each node's achieved completion cost with its cost in a heuristic schedule. A single GNN/MLP pass provides all priorities, followed by iterative decoding and simulation. Comparisons cover scientific workflows, resource-constrained TPC-H workflows and JSSP, with CAI/DR ablations and additional heuristic baselines.

The paper remains **specialist/constructive**. Different benchmarks have different features, resource rules, baselines and separately configured training; no shared Pegasus/TPC-H/JSSP checkpoint or joint training is demonstrated. One-shot describes neural feature/priority computation, not simultaneous schedule construction: topological sorting and resource dispatch still execute sequential steps. It constructs a schedule from priorities rather than improving an existing complete schedule.

## Methodology

A DAG represents precedence constraints. A ready task has no unscheduled predecessor. At each decoding step the highest perturbed priority among ready tasks is removed, thereby generating a topological order. Lemmas1/2 motivate which nodes need priority comparison. Original logits produce ready-set softmax factors, while one independent Gumbel value per node perturbs the fixed priorities. These factors train the model with node-level feedback. The exact correspondence between these factors and the distribution induced by fixed perturbations requires the distinction below (PDF3-6/13/15).

Pegasus uses heterogeneous processor speeds, output-data transfer costs and an earliest-finish-time greedy processor assignment; HEFT supplies the baseline. TPC-H uses a homogeneous resource pool with concurrent tasks constrained by total resource capacity, and shortest-time-first supplies its baseline. JSSP has prescribed machines and job precedence, with SPT as baseline. The neural output chooses priorities; it does not learn all of these resource-allocation rules (AppendixB).

The formal encoder is a four-layer/four-head Graphormer with64-dimensional node embeddings and a64x64x1ReLU MLP. Adam uses learning rate0.0005, batch16, priority regularization0.001and up to1,000epochs per benchmark. SimPy evaluates schedules and node completion costs. The paper first writes return-like final-cost-minus-prefix-cost values, then defines the actual advantage-like signal as heuristic node cost minus the selected node's completion cost, with optional batch normalization (Equations8-10; AppendicesC-D).

## Experiments

**Scientific workflows.** On SIPHT100, reported makespan is196.9versus HEFT227.0and the reproduced one-shot baseline218.5, taking0.61seconds versus0.005/0.07. At SIPHT1000the full method gives1819.2versus HEFT1821.4, a much smaller improvement. Additional LIGO/GENOME tables show predominantly favorable quality, but LIGO1000ties HEFT at2373.5. These are heuristic-relative comparisons, not gaps to certified optimal schedules (Tables1/4/5).

**TPC-H and JSSP exceptions.** TPC-H50/100improve to20.49/39.22versus heuristic24.97/42.85. At150sub-DAGs, however, full CAI+DR gives73.47, worse than heuristic69.76and the no-CAI variant67.91. On JSSP20x10, POMO-DAG341.6beats the full method397.3; removing DR also slightly improves it to394.7. Other JSSP configurations favor the full method, including30x20makespan1426.0versus POMO-DAG1458.0. Thus neither component gives a uniform gain (Tables2-3).

CAI generally improves quality but increases decoding overhead versus sorting priorities alone. The full approach is slower than the reproduced one-shot comparator in many rows, while generally much faster than adapted POMO-DAG and edge-generation scheduling(EGS). Those baselines are the authors' reconstructions/adaptations: AppendixE explicitly notes missing original training/policy code for Jeon/EGS and describes its replacements. Heuristic-baseline selection with HEFT/CPOP/SFT gives similar SIPHT results in the tested sizes; that experiment does not prove unbiasedness or a convergence rate.

The main hardware is an Intel Gold6226R,256GBRAM and RTX3090. Tables do not identify independent retraining seed counts or confidence intervals despite a positive checklist answer about statistical significance. Some printed gaps are inconsistent with their displayed raw makespans: the POMO-DAG JSSP30x10row lists971.3versus SPT845.9but a negative gap. The raw costs imply approximately+14.82%; this is curator arithmetic from rounded entries, not a rerun. Raw makespans are retained when a gap is inconsistent.

## Limitations

The approach remains a list scheduler primarily optimizing makespan with precedence and modeled resource constraints. Deadlines and other domain objectives require adaptation, as the authors acknowledge. One fixed priority assignment cannot respond to arbitrary dynamic system changes without recomputation. The empirical small/sparse TPC-H failures and diminishing gains near strong heuristic solutions limit broad superiority claims. AppendixH explicitly provides no formal convergence bounds; the sampler/feedback issues below also prevent automatically inheriting a standard unbiased policy-gradient guarantee.

### Curator Analysis

**Latent priorities and execution probabilities.** The probability of one execution order is indeed the sum over all priority lists producing it. However, many-to-one decoding alone does not make REINFORCE on a correctly sampled latent list biased: summing p(rank)*cost(decoding(rank))*gradient log p(rank) gives the derivative of expected decoded cost. Redundant lists may affect variance/efficiency, but this identity limits the paper's blanket bias argument (PDF3-4).

**Fixed Gumbels versus fresh ready-set sampling.** For nodes a->c with independent b and three equal logits, the six static priority orders are equiprobable. Priority topological sorting gives probabilities1/6for(a,b,c),1/3for(a,c,b),and1/2for(b,a,c). Equation6's ready-set softmax products instead give1/4,1/4,1/2. The released `GumbelTopoSortAdj` samples perturbations once and reuses them, so it has this distinction. A local exact enumeration executes the original method: for the indicator cost of execution(a,c,b), the true derivative with respect to a's logit at zero is5/36, also recovered by latent-list REINFORCE, while the ready-softmax score estimate gives1/6. Fresh conditional resampling would define a different policy; it is not the pinned static sampler (PDF6/15).

**Dense node feedback.** A fixed value for each heuristic node is not automatically an action-independent state baseline when the selected node changes. For two independent jobs of durations1and2on one machine, every complete schedule has makespan3. SPT finishes a at1and b at3. Equation9gives first-step advantage0when a is chosen first and1when b is chosen first. With equally likely choices and a-logit parameter, Equations7/9before optional batch normalization have expected gradient-1/8, whereas the makespan gradient is zero. This bounds the claim that the dense estimator is an unbiased makespan gradient; it can still be useful as a training surrogate and does not invalidate the empirical scheduling gains (PDF6-7/16-17).

## Reproducibility

- All25pages of the [formal NeurIPS2025 article](https://proceedings.neurips.cc/paper_files/paper/2025/file/dc16950e510bcd573783f5c2d7d8cc31-Paper-Conference.pdf) were read, including every reference, scientific AppendicesA-I and the checklist. Ten central pages were rendered and checked, covering all three figures, six result tables, both lemma arguments and probability/reward formulas. Publisher metadata dates proceedings publication to April23,2026, separately from the2025conference, and verifies four Tongji authors and DOI10.52202/085713-5002.
- The publisher's supplemental ZIP contains only one README announcing the GitHub link; there is no scientific PDF inside. Both OpenReview APIs for`KDKddNgeKo` returned403. The official repository's sole PDF is another25-page version of this same article, not a separate scientific appendix. All25page texts were compared:14match exactly; complete changes on the other11were inspected. They concern editing/reflow, acknowledgments and some SIPHT400gap entries, while raw makespans and the central probability/reward equations remain unchanged. Formal proceedings values govern this note.
- The [official repository](https://github.com/9erAlpenjaeger/DAG-CAI-DR) was inspected at`1a2aacc3fc44d8d8f1ef779488a39cab80abf991`:286files, including vendored Graphormer, three benchmark launchers/environments and no pretrained checkpoint tensors. Dataset README files direct users to external generators/traces. The main README and launcher commands, original Gumbel utilities, actor path, loss normalization/update, simulator interface and completion-feedback sections were read. The supplied shell examples select GAT and sparse `nodw`, so running them unchanged does not reproduce the formal Graphormer/full-DR configuration.
- The current loss additionally standardizes logits, normalizes nonzero dense feedback, clips it to[-2,2] and includes a log-probability-based entropy term. The simulator subtracts heuristic negative completion times to produce the node feedback. Those operations should be reconciled with the desired experiment configuration; the local dense counterexample is explicitly for the unnormalized printed estimator, not an analysis of every normalized-code trajectory.
- Exact three-node enumeration/original-method and two-job arithmetic checks are saved in `research/full-text-review/comparability-dag-scheduling/recompute_probability_scope.py` and its JSON output. They do not train a neural model or rerun benchmark tables. Six existing-catalogue relations have explicit body citations and full bibliography identities; other GNN/backbone or domain references do not receive invented IDs.
