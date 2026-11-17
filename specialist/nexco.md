---
id: nexco
short_title: NExCO
title: Native Adaptive Solution Expansion for Diffusion-based Combinatorial Optimization
authors:
- Yu Wang
- Yang Li
- Jiale Ma
- Junchi Yan
- Yi Chang
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/3d681cc4487b97c08e5aa67224dd74f2-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/3d681cc4487b97c08e5aa67224dd74f2-Abstract-Conference.html
institutions:
- School of Artificial Intelligence, Jilin University
- School of Artificial Intelligence, Shanghai Jiao Tong University
- International Center of Future Science, Jilin University
- Engineering Research Center of Knowledge-Driven Human-Machine Intelligence, MOE, China
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Maximum Independent Set
summary: Task-specific time-agnostic masked denoisers construct feasible partial solutions through confidence-guided
  expansion, with published convergence and current-release reconstruction/budget qualifications.
code_url: https://github.com/yuuuuwang/NExCO
figure:
  path: paper-assets/nexco/framework.png
  alt: Original NExCO Figure1 showing one-way masking, a time-agnostic denoiser and intended native adaptive feasible
    expansion.
  caption: 'Figure1: original NExCO masked learning and native expansion framework.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/3d681cc4487b97c08e5aa67224dd74f2-Paper-Conference.pdf#page=3
---

# Native Adaptive Solution Expansion for Diffusion-based Combinatorial Optimization

> **TL;DR:** NExCO trains task-specific time-agnostic denoisers on partially masked reference solutions, then uses confidence-guided feasible expansion to construct TSP, CVRP and independent-set solutions. The formal algorithm is constructive; the current public test code instead exposes substantial complete-decode/remask and incumbent-rewrite machinery. Those versions, their budgets and the limits of the stated convergence claim must be distinguished.

## Motivation

Global heatmap prediction can create conflicting decisions, while applying adaptive expansion around an entire diffusion sampler repeatedly invokes that sampler. NExCO makes one denoiser call per expansion stage and trains on partial states with optimization meaning. Feasibility comes from problem-specific projection rules, rather than from a neural heatmap being inherently feasible. [pp.1–6]

## Contributions

- One-way masking drops selected1 entries to0 without adding false positive decisions; mask and unselected background share the same numeric state.
- A denoiser omits timestep conditioning and predicts the same reference solution from two coupled corruption levels.
- Native Adaptive Expansion(NAE) selects confident candidate variables, filters them by feasibility and commits a chosen fraction.
- Experiments cover TSP/MIS/CVRP, size/distribution transfer, heuristic supervision and expansion/projection ablations. [pp.4–10,16–21]

## Methodology

**Training.** A reference solution may come from an exact solver or a strong heuristic. Its selected entries are randomly erased; unselected entries remain zero. Coupling the masks can make the two corruption levels nested. The time-agnostic optimization-consistency objective sums their supervised discrepancies to the same label, rather than proving that all learned predictions equal a true global optimum. The inspected scheduler shares its uniform random mask across the paired levels and uses an absorbing1→0 transition. [pp.5–6; current scheduler/consistency loss]

**Network.** An anisotropic gated GCN uses task-specific node/edge features and partial-solution attributes. The formal setup uses12 layers, sinusoidal input embeddings and256-dimensional hidden states except ER-MIS128. Routing outputs edge heatmaps; MIS outputs node scores. TSP500/1,000 use KNN factors50/100, with100 for the10K experiment. Task-specific inputs, architectures/checkpoints and feasibility rules remain necessary. [pp.5,16,19–21]

**Formal inference.** Starting from no selected variables, the model scores uncommitted variables. Scores above a threshold define candidates; a descending-confidence feasibility pass retains admissible decisions, and a fraction of these is committed. TSP predicates enforce degree/subtour restrictions, MIS forbids neighboring selected vertices, and CVRP accounts for route/capacity constraints. The intended process preserves already committed decisions. Its O(Ts) statement counts denoiser calls, not the total complexity of GNN operations, candidate sorting, feasibility checks and local search. The written algorithm still takes a threshold, finite iteration budget and expansion schedule. [pp.6–7]

**Classification:** Specialist / constructive, according to the formal NAE method. Separate task/size checkpoints are trained; the work does not demonstrate one cross-problem shared model. The current release's additional reconstruction/rewrite stages are documented below and are not silently substituted for the published algorithm. [pp.6–9,19–21]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| TSP train/test |Main text:1.28M/128K/64K training instances at100/500/1,000; test1,280/128/128, with Concorde references |
| TSP curriculum |100 epochs at100 nodes,50 at500 and50 at1,000; learning rate2×10⁻⁴; batch16/6/4 |
| MIS training |90K RB200–300,6.4K RB800–1,200,163,840 ER700–800; ER edge probability.15;500 test instances per described set |
| MIS references |KaMIS heuristic solutions, not universal optimality certificates |
| CVRP data |Capacities40/50/80 at50/100/200; demand integers stated as[1,10]; uniformly sampled coordinates |
| CVRP train/test |Training1.28M/640K/32K; test10K/10K/100; HGS heuristic references |
| Expansion budgets |Generally3/5/7 stages, with separate greedy and four-sample comparisons |
| Hardware/time |A40 48GB and Xeon Gold5220; paper states single-threaded evaluation and average time per instance |

Table13 lists1,502K TSP100 training instances, conflicting with the main text's1,280K. The two figures should not be merged into one purportedly exact dataset count. [pp.7–9,20–21]

**Selected TSP results, average per instance:**

| Configuration | TSP100 gap/time | TSP500 gap/time | TSP1,000 gap/time |
| --- | --- | --- | --- |
| NExCO3 stages |.04% /.05s |.39% /.23s |.85% /.91s |
| NExCO5 stages |.03% /.08s |.28% /.33s |.63% /1.31s |
| NExCO7 stages |.02% /.11s |.25% /.43s |.52% /1.68s |
| FastT2T5 diffusion+5 gradient steps |.03% /.31s |.39% /1.41s |.58% /5.81s |
| NExCO5, four samples |.01% /.25s |.14% /1.16s |.35% /4.85s |
| LKH3,512 trials |.00% /.12s |.00% /1.17s |.01% /2.91s |

NExCO often improves the tested quality/time trade-off, but its5-stage greedy TSP1,000 gap.63% is worse than FastT2T.58%. Classical quality remains stronger, and the speedup depends on the exact expansion/gradient/sampling budget. Rounded zero does not establish exact optimality on every instance. [p.7]

- **Cross-size TSP:** Training at500 then testing at1,000 gives.58% gap; training at1,000 then testing at500 gives.37%. Training at100 and testing at1,000 gives3.86%, worse than FastT2T3.08% and T2T3.16%. Training at100 and testing at500 is2.96%, worse than FastT2T1.77%. Generalization is not uniformly best. [p.8]
- **Imperfect labels:** TSP500 labels perturbed to1.65/3.35% gaps still train5-stage models reaching.31%, and7-stage models.25/.26%. This tests complete but imperfect reference solutions; large-scale incomplete-label/self-training claims later in the appendix describe potential directions. [pp.8,16]
- **MIS:** Seven-stage NExCO gives sizes19.76/41.25/42.98 on smallRB/largeRB/ER in.14/1.00/.56s. KaMIS remains stronger at20.10/43.00/44.87. Five-stage largeRB40.94 is below COExpander41.09. Under ER density shifts and larger RB scales, NExCO improves over the listed neural baselines but remains below KaMIS in every displayed case. [pp.9,16]
- **CVRP:** Five-stage gaps.85/1.40/2.45% improve on Sym-NCO1.95/2.37/2.86%, but its200-node.39s is slower than Sym-NCO.36s. COExpander's.03/.06/.20s is faster than NExCO3-stage.04/.08/.27s and5-stage.06/.12/.39s. The main prose's broad1.6–2× speedup claim is not supported by those rows. [p.9]
- **TSP10K:** NExCO gives1.53% gap in52s versus FastT2T1.63% in70s. LKH has the better reference tour in332s; GLOP is faster at15s but4.90% gap. KNN sparsification and the restricted candidate graph are part of this protocol. [pp.16–17]
- **TSPLIB:** The29-instance50–200-node set uses20 expansion stages and2-opt, reporting.09% mean gap. NExCO is worse on lin105(.54% versus FastT2T0%) and pr124(.58% versus.08%). Table9's first four Mean entries duplicate the eil51 row, so those printed baseline means are not trustworthy summaries. The normalized-coordinate metric also needs consistent references. [p.17]
- **Ablations:** At500/1,000 nodes and five stages, mask corruption gives.28/.63% versus uniform corruption.59/.86%. NAE improves gaps over the global fixed-schedule comparison, but takes.33/1.31s versus.29/1.04s. Against complete-greedy reconstruction, its five-stage1,000-node gap ties.63% while time falls1.95→1.31s. These are quality/cost comparisons, not proof of universal superiority. [pp.18–19]

## Limitations

### Curator Notes

- **Finite-time convergence needs actual progress.** Proposition1's A2 says a strictly expanding activation mask *exists*. It does not require the thresholded neural candidate mask to choose it. A one-vertex edgeless MIS, identity feasibility projection, threshold.5, constant score.1 and retained fraction1 satisfies A1–A3 but remains empty indefinitely. Thus the stated assumptions do not establish completion within Nmax steps for the written algorithm; a forced-progress/fallback condition is needed. This concerns the printed proposition, not evidence that evaluated runs failed.
- **Greedy projection is not the exact Eq.8 argmax.** In a three-vertex star with center confidence.9 and leaf confidences.6/.6, choosing the center yields.9 while choosing both nonadjacent leaves yields1.2. The current MIS decoder also chooses the center on this example. Its output can be feasible/maximal without maximizing the displayed weighted objective or the MIS cardinality.
- **Published/current inference differs substantially.** The inspected MIS test path first greedily decodes a complete set, then samples a partial source, predicts again and decodes another complete set. The decoder receives scores and graph adjacency, not a hard committed-node mask. On a two-node edge, conditioning on selected node0 does not prevent decoding node1 instead. TSP/CVRP similarly reconstruct complete routes and run local search inside the loop. This differs from AppendixB.6's claimed monotone partial trajectory without premature full reconstruction.
- **Current budgets:** The MIS RB example sets one rewrite step and100 incumbent-rewrite iterations, rather than simply five/seven native expansions. TSP100's example sets five rewrite steps and five rewrite iterations, with up to5,0002-opt iterations in each complete decode; the README manual example sets zero rewrite iterations. These configurations cannot be treated as the main table's fixed five-NFE budget without examining the call path. Under the inspected single-stream MIS example, the initial two calls plus100 seeded calls total102 denoiser calls.
- **Training/architecture distinctions:** The scheduler correctly uses absorbing masking and shared randomness for paired levels. Main/model forward paths are time-agnostic, although AppendixC still prints undefined t⁰ terms. The current implementation adds small random scaling to binary-state inputs. These details should be recorded separately from the formal simplified architecture.
- **Preliminary formula:** The symmetric bit-flip marginal in Eq.3 uses1−∏(1−β), while Eq.2's symmetric flips give[1−∏(1−2β)]/2. For two.1 flips these are.19 and.18. This is a preliminary formula issue, not a counterexample to the proposed absorbing-mask scheduler.
- **Scope of evidence:** Confidence/feasibility heuristics do not guarantee global optimality; sparse candidate graphs may exclude optimal edges. No independent training-seed significance study is established by these tables. Extending the method to industrial scales or incomplete-label bootstrapping is discussed as future work, not validated here.
- No neural checkpoint training or full benchmark replay was performed. Exact small examples and original decoder execution verify the specified boundaries; they do not establish that historical numerical results are false.

## Reproducibility

- **Publication:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/3d681cc4487b97c08e5aa67224dd74f2-Abstract-Conference.html), explicit publisher date2026-04-20. The catalog retains the proceedings title; the PDF/README use the shorter “NExCO: Native Solution Expansion” wording for the same authors/work.
- **Full text:** All21 formal pages, complete references, Algorithm1, Proposition1 and AppendicesA–F were freshly read; all four figures and14 tables were visually checked.
- **Companions:** The [official event](https://iclr.cc/virtual/2026/poster/10011968) exposes a2.999MB scientific poster, fully read in three overlapping high-resolution tiles. No separate slides/scientific supplement is exposed. The untruncated115-entry GitHub tree and116-member39.49MB ZIP contain no additional scientific PDF/notebook/archive. Both READMEs were read; checkpoints are externally linked rather than bundled.
- **Code:** [Official implementation](https://github.com/yuuuuwang/NExCO), inspected tree7a23ab3b61fc9f5f12dcfd05d32db4e7050fcf8f. The mask scheduler, MIS training/test/decoder, TSP/CVRP reconstruction/test paths, forwarding methods and example scripts were inspected. Small original MIS-decoder executions and the printed-assumption examples are recorded locally with source hashes.
- **Figure:** Original formal Figure1, with its complete caption, depicts mask-conditioned learning and the intended native expansion process.
