---
id: gdpg
short_title: GDPG
title: Graph-based Deterministic Policy Gradient for Repetitive Combinatorial Optimization Problems
authors:
- Zhongyuan Zhao
- Ananthram Swami
- Santiago Segarra
year: 2023
date: '2023'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=yHIIM9BgOo
venue: ICLR
paper_url: https://openreview.net/forum?id=yHIIM9BgOo
institutions:
- Rice University
- DEVCOM Army Research Laboratory
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Weight Independent Set
- Minimum Weight Dominating Set
- Node-Weighted Steiner Tree
- Minimum Weight Connected Dominating Set
- Delay-Oriented Wireless Link Scheduling
summary: A graph actor adjusts the costs used by fixed constructive heuristics; a differentiable node-wise twin critic trains task-specific policies for repeated graph problems and long-term wireless scheduling.
code_url: https://github.com/XzrTGMu/twin-nphard
figure:
  path: paper-assets/gdpg/framework.png
  alt: Original Algorithm 1 alternates training a differentiable twin critic and continuous heuristic parameters for independent repetitive graph problems.
  caption: 'Algorithm 1: GDPG-Twin training for independent repetitive problems.'
  source_url: https://openreview.net/pdf?id=yHIIM9BgOo#page=15
---
# Graph-based Deterministic Policy Gradient for Repetitive Combinatorial Optimization Problems

> **TL;DR:** GDPG-Twin learns continuous costs or local weight transformations for a fixed, feasible graph heuristic. A differentiable **node-wise twin** predicts the heuristic's expected outcomes, enabling approximate deterministic policy gradients through an otherwise nondifferentiable pipeline. Separate task models improve fast greedy baselines on repeated graph problems; they do not learn incumbent-editing moves or establish one shared checkpoint across problems.

## Motivation

Wireless schedules and related graph decisions recur while node weights change more quickly than topology. Solving every instance with a slow centralized optimizer may violate runtime or communication constraints. A reusable topology-dependent weight transformation can improve a fast heuristic while amortizing the GNN's cost over many weight realizations. In a sequential system, decisions also change future queues, so minimizing the current COP cost can differ from optimizing long-term backlog. [Sections 1-2.](https://openreview.net/pdf?id=yHIIM9BgOo#page=1)

## Contributions

- Formulates both independent repetitive COPs and COPs embedded in a graph-based MDP, retaining a manually chosen feasible downstream heuristic.
- Learns a differentiable twin of **element-wise expected outcomes**, then applies a known linear system objective to obtain a policy-gradient surrogate.
- Samples continuous policies near the current policy when fitting the twin, reducing overfitting on fixed topology.
- Evaluates four independent graph problems and one delay-oriented scheduling application. The experiments concern the improvement of fast heuristics, rather than beating all slower centralized algorithms. [Sections 1.3/3/4.](https://openreview.net/pdf?id=yHIIM9BgOo#page=3)

## Methodology

### Independent repeated instances

For topology (V,E), original costs c and a fixed feasible heuristic h', define transformed weights **w_i=f_loc(c_i;Z_i)** and construct **x=h'(V,E,w)**. The objective uses original costs, E[c^T x]. A twin GNN receives topology, mean costs and Z, and predicts the vector **E[c elementwise-multiplied by x]**. Summing its components estimates the system objective; differentiating this surrogate updates Z or an actor that generates Z from topology. Training targets are actual heuristic outcomes, so exact optimal-solution labels are unnecessary. [Equations 5-9.](https://openreview.net/pdf?id=yHIIM9BgOo#page=5)

On a static topology, Z can be optimized directly and no actor is needed. For changing topologies, an actor outputs Z from the topology and mean cost features. Independent-instance inference can reuse Z across N successive weight realizations, reducing amortized GNN cost to O(L|E|/N). This saving depends on topology/policy reuse; it is not a claim that the GNN is free when N=1. Uniform noise in [-epsilon,epsilon] around Z helps the twin learn a local loss landscape. [Section 3.1 and Algorithm 1.](https://openreview.net/pdf?id=yHIIM9BgOo#page=15)

### Decisions with long-term effects

In the graph-MDP setting, an actor uses the **current state** to produce a cost vector for the same kind of fixed heuristic. The twin predicts node-wise discounted future returns, and its target uses the observed reward plus a bootstrapped next-state value. For delay-oriented wireless scheduling, state includes queue backlogs and link rates; feasible schedules are independent sets in a conflict graph. The actor changes costs at each time step, rather than reusing one static Z throughout the trajectory. [Equations 10-12, Appendices A/C/D.](https://openreview.net/pdf?id=yHIIM9BgOo#page=6)

The independent critic-target derivation uses linearity of expectation. The MDP derivation explicitly replaces a future return with an estimated twin value; these gradient surrogates do not guarantee exact policy gradients, global convergence or an optimal COP solution when the critic is imperfect. [Appendices B-C.](https://openreview.net/pdf?id=yHIIM9BgOo#page=13)

### Implementations and classification

The MWIS pipeline multiplies node weights by a three-layer GCN output, then constructs a set with local greedy selection. MWDS uses a five-layer actor and a cost-effective covering heuristic. NWST learns weights for a shortest-path merging heuristic. MWCDS combines an independent dominating set with a connecting Steiner-tree heuristic, using a two-output actor and a rectified affine local transformation. Separate twin GCNs are trained alongside these actors. The scheduling actor has one GCN layer and its twin has five. [Appendix H/Section 4.2.](https://openreview.net/pdf?id=yHIIM9BgOo#page=19)

Classification is **specialist / constructive**. The paper expressly develops four separate pipelines and different task configurations. Optimization of neural/cost parameters during training, and repeated schedules across changing states, are not learned edits to an incumbent combinatorial solution. Each actual decision is constructed by a fixed heuristic. This corrects the previous constructive-improvement label. Application discussions of graph coloring, object tracking or multicast networking are not additional direct task experiments.

## Experiments

### Data, architecture and budget

The independent tasks use ER, BA, Gaussian random partition and Watts-Strogatz graphs, principally trained on 100-300 nodes and tested through 300, 350 or 500 nodes depending on the task. Most graph-model test sets contain 2,000 graphs. The MWIS comparison instead uses **500 ER graphs with optimal references**, trained on 6,000 ER graphs. Only MWIS uses exact optima; the other independent-task ratios use specified **greedy references**. [Section 4.1/Appendices F-H.](https://openreview.net/pdf?id=yHIIM9BgOo#page=7)

Algorithm 1 reports actor/critic learning rates 1e-4, E=25, B=100 and sampling radius .15. Algorithm 2 reports learning rates 1e-4, horizon 64 and E=200 for scheduling. Appendix H gives roughly **1/1/5/8 hours** training for MWIS/MWDS/NWST/MWCDS on eight CPUs and one GTX 1080 Ti, with 16 GB RAM. Current README commands and later stability changes are version-specific implementation instructions, rather than evidence that all paper experiments used those newer defaults. [Algorithms 1-2/Appendix H.](https://openreview.net/pdf?id=yHIIM9BgOo#page=15)

### Quality and reference points

| Task | Reported result | Reference and qualification |
| --- | --- | --- |
| MWIS | GDPG-Twin 93.1%; ad hoc RL 93.2%; ZOO 92.7%; plain local greedy 89.7% | Mean ratio to exact optimum on the specified 500 graphs; Twin is close to, rather than better than, ad hoc RL |
| MWDS | Mean improvements 11.42% BA, 6.8% ER, 3.0% GRP, 2.6% WS | Relative to the same vanilla centralized greedy heuristic |
| NWST | 6.8% BA; 1.4% ER; 1.2% GRP; .9% WS; .9% Internet topology data | Relative to the vanilla shortest-path heuristic; not exact optimality gaps |
| MWCDS | Improvements 17.8% GRP, 16.0% ER, 6.6% WS, 4.0% BA | Improves distributed greedy, while a large gap to centralized greedy remains |

The paper explicitly avoids a claim of smaller gaps than state-of-the-art slower centralized heuristics. A ratio below one in a minimization comparison means improvement over the selected reference, not beating the true optimum. The small Internet-backbone NWST experiment uses graphs averaging **31.23 nodes**; most evaluation is synthetic. [Figures 1-6 and Section 4.1.](https://openreview.net/pdf?id=yHIIM9BgOo#page=8)

### Sampling efficiency, latency and reuse

Twin reaches the MWIS training plateau with approximately **one-third to one-half as many heuristic evaluations** as two-point zeroth-order optimization. Scheduling has similar mean/median backlog to the five-step-lookahead RL baseline while using **2 rather than 10 heuristic evaluations per time step**. These are counts of calls to the nondifferentiable process; they do not alone establish equivalent wall-clock speedups once neural training and other operations are included. [Figures 7-8.](https://openreview.net/pdf?id=yHIIM9BgOo#page=9)

On a CPU-only quad-core i5 laptop, measured **centralized** MWDS runtime is 32-78 ms per instance, or 2-17 ms with large reuse. Centralized implementations of the distributed MWIS/NWST/MWCDS heuristics take about .017-.05/.07-1.5/.08-2 seconds. Per-node figures estimating under .18/5.1/5.8 ms exclude communication delay, which the authors identify as a major unmeasured component. These estimates are not actual end-to-end distributed latency. Figure 3's message rounds also exclude GNN overhead by assuming N approaches infinity. [Figure 3/Appendix I/Figures 9-11.](https://openreview.net/pdf?id=yHIIM9BgOo#page=20)

The official repository additionally contains nine one-page plot PDFs. All were inspected. They include paper-aligned convergence, graph-task quality and communication plots, plus scheduling summaries by topology and load. The latter expose heterogeneous behavior: several mean-backlog ratios are near or slightly above one; some median ratios are much lower. These repository outputs do not demonstrate uniformly superior backlog on every topology, or substitute for a controlled replication.

## Limitations

### Reported by the Authors

- Variance and worst-case optimality gaps are not addressed.
- Evaluation relies predominantly on synthetic topologies; broader edge-related tasks require further actor/critic design.
- The purpose is to enhance selected fast/distributed heuristics, with no claim to beat all slower centralized solvers. [Sections 4.1/5.](https://openreview.net/pdf?id=yHIIM9BgOo#page=9)

### Curator Notes

- Feasibility comes from the selected heuristic, while quality depends on learned weight transformations and twin approximation accuracy.
- Amortization assumes suitable topology reuse; current-state-dependent scheduling still invokes an actor at each time step.
- Different tasks have different models and heuristics. A common framework does not establish generalist weights or learned local improvement.
- Most ratios use heuristic references, distributed communications are unmeasured, and mean quality does not provide a worst-case guarantee.
- The graph-generation appendix prints an ER edge-probability expression |V|/k, which can exceed one for its stated sizes/ranges; that printed expression should not be silently treated as a valid probability or repaired without version-specific implementation evidence.

## Reproducibility

- **Full text:** all 21 pages were read, including Appendices A-I, all algorithms, derivations, references and runtime plots. The reading copy identifies itself as the ICLR 2023 conference paper. Metadata uses year precision; no individual acceptance day is inferred from the general conference calendar or an announcement date.
- **Scientific supplement check:** the OpenReview forum/API required browser verification/returned 403. The complete article includes its scientific appendices. The official recursive code tree had 7,199 members and nine PDF output plots; every one-page PDF was downloaded, registered and visually read. No additional scientific ZIP/PDF appendix was found in that tree. The author page also offers presentation materials, rather than a missing appendix explicitly required by the article.
- **Implementation:** [XzrTGMu/twin-nphard](https://github.com/XzrTGMu/twin-nphard), linked in the paper. The full README was read, including task-specific model paths and later updates: January 2024 learning-rate/API fixes and flexible output activations, and March 2024 exploration/stability changes. Current commands are not asserted to be the unchanged 2023 code.
- **Visual provenance:** original Algorithm 1, PDF page 15, is reproduced as the method illustration. Original equations, all main plots, derivations and final runtime figures were visually inspected; no synthetic architecture diagram was substituted.
- **Scope of verification:** source claims and reference links were checked; training, latency measurements and numerical scores were not independently reproduced.
