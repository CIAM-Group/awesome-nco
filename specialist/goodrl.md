---
id: goodrl
short_title: GOODRL
title: Graph Assisted Offline-Online Deep Reinforcement Learning for Dynamic Workflow Scheduling
authors:
- Yifan Yang
- Gang Chen
- Hui Ma
- Cong Zhang
- Zhiguang Cao
- Mengjie Zhang
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/370fa2e691f57eb319bc263a07dad4a5-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/370fa2e691f57eb319bc263a07dad4a5-Abstract-Conference.html
institutions:
- Victoria University of Wellington
- Nanyang Technological University
- Singapore Management University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Workflow Scheduling
summary: Task-action and system graph attention support offline-initialized online workflow dispatch; simulated
  flowtime gains, non-universal adaptation, slower inference, CPU training cost and limits of cross-task transfer
  evidence are explicit.
code_url: https://github.com/YifanYang1995/GOODRL
---

# Graph Assisted Offline-Online Deep Reinforcement Learning for Dynamic Workflow Scheduling

> **TL;DR:** Separate task-action and system graphs support a learned workflow dispatcher, initialized by HEFT imitation and PPO and adapted online with guarded actor updates. It substantially improves simulated mean flowtime, but online gains are modest and not universal, inference is slower than baselines, and FJSS experiments show framework reuse rather than clearly documented shared weights.

## Motivation

Cloud workflows arrive over time, have precedence DAGs and use heterogeneous machines. A scheduling agent must distinguish candidate machines while tracking an evolving set of unfinished workflows. GOODRL separates the information useful for the next assignment from that needed for long-horizon value prediction, and studies online fine-tuning after offline training (Sections1–4).

## Contributions

- A task-specific graph represents each candidate machine's effect on one focused task for the actor.
- A system graph, bidirectional graph attention and global self-attention provide a separate critic representation.
- HEFT imitation followed by offline PPO supplies initialization; gradient-gated actor updates and more frequent independent critic training support online adaptation.
- Offline/online/shift/ablation studies, an FJSS adaptation and a retrained flowtime-cost extension assess the design (Sections4–5/AppendicesA–S).

## Methodology

**Scheduling model.** The simulator automatically selects a ready focused task; the neural action assigns it to one machine queue. Machines execute one task at a time in FIFO order. A task's execution time is its workload divided by machine speed. The objective is **mean workflow flowtime**, completion minus arrival, rather than makespan, total rental cost or joint optimization of every task priority. Future workflow structures are unknown until arrival, while current DAG/workload information is available. The episode finishes after all requested workflows complete (Section3/AppendicesA/B).

**Actor/critic.** Graph nodes are unfinished tasks with seven status/workload/remaining-work/execution-time/completion-time/speed/utilization features. Edges encode precedence, machine queue order and candidate assignment. The actor evaluates each state-action graph separately, updating the focused task's machine-conditioned features, then applies two GAT layers and four128-dimensional MLP layers to score its focused embedding. Softmax scores select a machine. The critic uses all candidate edges, independent bidirectional GAT layers, one global two-head self-attention layer, mean pooling and an MLP. This exposes newly arrived tasks and distant interactions without forcing actor and critic to share parameters (Sections4.1–4.2/AppendicesC–G/J).

**Learning.** Rewards are negative sums of flowtimes for workflows completed between decisions, normalized by1000. Actor imitation uses7680HEFT transitions,10epochs, batch64, Adam1e−4. Offline PPO warms the critic200iterations then trains1000iterations, four independent episodes each, gamma.99 and clip.2. Online adaptation uses one long stream and512-step windows,50critic-warmup iterations,5actor versus20critic epochs, learning rates5e−5/1e−4. Actor gradient updates are **skipped**, rather than simply clipped/rescaled, if they exceed the previous norm mean plus standard deviation or.075. No mathematical global optimality, no-regret or monotonic-policy-improvement theorem is supplied (Sections4.3/Algorithms1–2/Tables8–10).

**Classification.** This is **specialist/constructive** machine-dispatch policy learning, incrementally adding task assignments. Online parameter fine-tuning is not neural editing of a complete feasible schedule. Unchanged policies handle different DWS machine pools/workflow distributions, but AppendixN says it applies the graph representation/architecture to FJSS and does not establish an identical already-trained checkpoint. AppendixO explicitly retrains with changed rewards. Neither claim alone proves one shared cross-native-task neural policy.

## Experiments

**Instances/references.** Four Pegasus scientific DAG patterns have25–30tasks each; training uses30workflows, offline tests1000/3000/5000 and online5000/10000/20000. Up to600000tasks is the **cumulative stream**, not a claim of simultaneous600000-node graph attention: completed tasks are removed. Poisson rates5.4/9workflows per hour and25or24machines model the benchmark. VM speed is identified with8–96vCPUs and processing time scales inversely, an idealized assumption. Amazon-style prices/configurations are historical inputs, not independently current pricing recommendations. Each offline scenario has30instances. Reported gap is relative to the **best compared heuristic objective in that row**, not an exact optimum (Sections5.1–5.2/AppendixI).

**Offline quality.** GOODRL has mean rank1.17 across12scenarios and wins10. GPHH is better on the two5×5/5.4/1000–3000workflow cases:408.24vs413.29 and407.81vs408.41. Elsewhere gains are substantial, e.g.6×4/5.4/1000 yields277.65vsHEFT391.61/EST1083.02. The EST gap290.07% means EST is about3.90times the compared best, **not a290% reduction in flowtime**. GPHH uses the best test-scenario result among three heuristics selected from30runs, an evaluation selection advantage that is explicitly reported, and can vary dramatically; ERL-DWS results use the authors' attempted adaptations/available best models, not a universal statement about all tuning of that family (Tables1/12).

**Online quality and cost.** Table2 reuses the5×5/5.4 offline agent for6×4test conditions. Online adaptation improves five of six rows by small amounts, up to the reported1.24% gap to the best; it **worsens**6×4/5.4/10000flowtime from284.09 to285.12, contrary to a literal universal reading of the prose. Figure6 shows selected stream portions after2000warm-up workflows, not every scenario. AppendixJ reports about150CPUhours offline and30/60/120CPUhours online, versus about200CPUhours GPHH training. These training costs must accompany “efficient adaptation.” All formal experiments run on CPUs, not a claimed GPU runtime (Table2/Figure6/AppendixJ).

**Latency.** Actor inference costs6.0–7.6ms per assignment, compared with GPHH.6–1.0ms and ERL-DWS2.5–2.7ms; GOODRL is slower. The paper argues these latencies are operationally acceptable relative to typical communication, but does not benchmark end-to-end cloud communication/data-transfer contention. Critic/online update cost is separate from actor inference (Table17).

**Ablations/transfer.** Focused pairwise embeddings improve HEFT cross-entropy and global critic attention improves value error in most columns; individual early-column exceptions remain(Table4mean-pooling2.7099vsours2.7486, Table5no-extra-edge13.4737vsours14.0938). These losses are proxies, not direct optimal-flowtime certificates. Removing gradient gates or critic update separation can sharply degrade the tested online configuration. Larger-workload/machine-pool/arrival-rate shifts and actor-noise recovery are positive finite experiments, not arbitrary-distribution stability guarantees (Tables4/5/13/14/18/19).

The FJSS adaptation improves three larger sizes but **loses** the10×5case:112.57vsDRL-S105.61 andDRL-G111.67. Its metric/training/checkpoint protocol is not described fully enough to upgrade this to unchanged-weight cross-task transfer. The retrained cost-aware policy lowers rental cost16.17–41.15% while worsening flowtime1.11–7.33%; it is a tradeoff, not simultaneous dominance. AppendixR's cost examples compare two scheduling plans, without a clearly identified controlled online-versus-offline policy pair, so they should not be used to attribute every cost saving specifically to online PPO (Tables15/16/20).

## Limitations

### Discussed in the Paper

Unlimited machine configurations, stronger constraint handling and multiobjective/Pareto learning are future work. Domain-specific graph representations require adaptations for other scheduling variants. The present multiobjective extension changes the reward and retrains.

### Curator Notes

FIFO queues, automatic focused-task selection, known current workloads, ideal speed scaling and four workflow templates bound the cloud applicability. No exact reference objective or universal policy-stability guarantee is established. Preserve the online degradation, FJSS small-instance loss and slower decision latency rather than summarizing every result as state of the art. Cumulative task scale is not concurrent graph size.

The current public `train_actor` computes the **mean of per-parameter tensor gradient norms**, while the main displayed rule uses the L2 norm of the policy-gradient vector; these are different quantities. It also resets the adaptive limit after no accepted updates. `step3.py` allocates a7-window buffer versus Algorithm2's2-window statement. These are current release differences, not evidence that the formal results were generated by an erroneous experiment. Bibliography Wu et al.(2022) is the scenario-representation integer-programming paper even where the introduction describes routing; the actual citation identity is retained rather than relabeled to a different Wu paper. No training/scheduling experiments were rerun.

## Reproducibility

- **Formal identity:** [ICLR2025 proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/370fa2e691f57eb319bc263a07dad4a5-Abstract-Conference.html), pp21561–21589, official issued May1,2025. Six authors and Wellington/NTU/SMU affiliations checked.
- **Complete coverage:** all29formal pages, full references and scientific AppendicesA–S read, all tables and key graphs/algorithms rendered. Publisher lists the integrated paper only; normal OpenReview4PlbIfmX9o API403 recorded without bypass. Official event31012 exposes an18-page3,039,421-byte presentation and3,263,988-byte poster image, both fully read/rendered/visually checked; no additional scientific appendix is identified.
- **Code:** [GOODRL](https://github.com/YifanYang1995/GOODRL),33,643,110-byte146-member ZIP inventoried; README is its only PDF/TeX/notebook/Markdown documentation candidate. Core actor/online training and saved four-scenario actor/critic organization checked. Current CPU-based release explicitly documents separate imitation/PPO/online stages.
- **Later evaluation artifact:** README also links [DWS-Testbed](https://github.com/YifanYang1995/DWS-Testbed); its complete untruncated tree and all three READMEs were checked, with no scientific PDF/TeX/notebook. It explicitly evaluates frozen offline actors, identifies constant-arrival original settings versus added piecewise rates, and labels its workbook one-seed implementation checks. These later references are not substituted for formal tables or counted as online-training replication. Its separately linked deadline-cost environment is a different variant, not an omitted GOODRL scientific supplement.
- **Relations:** Source-supported in-text/full-bibliography matches are retained. The CVAE scenario-representation identity is recorded despite the introduction's loose routing description; software acknowledgments and similarly named scheduling methods alone do not create catalogue edges.
