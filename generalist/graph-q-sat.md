---
id: graph-q-sat
short_title: Graph-Q-SAT
title: Can Q-Learning with Graph Networks Learn a Generalizable Branching Heuristic for a SAT Solver?
authors:
- Vitaly Kurin
- Saad Godil
- Shimon Whiteson
- Bryan Catanzaro
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/6d70cb65d15211726dcce4c0e971e21c-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/6d70cb65d15211726dcce4c0e971e21c-Abstract.html
institutions:
- University of Oxford
- NVIDIA
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
- Graph Optimization
problems:
- Boolean Satisfiability
- Graph Coloring Decision
summary: A graph DQN guides early MiniSat branches and transfers to fixed coloring-decision encodings before VSIDS
  fallback.
code_url: https://github.com/NVIDIA/GraphQSat
---

# Can Q-Learning with Graph Networks Learn a Generalizable Branching Heuristic for a SAT Solver?

> **TL;DR:** A DQN graph policy chooses early MiniSat branches before falling back to VSIDS. One random-SAT-trained policy also transfers to SAT-encoded graph-coloring decisions, with mixed results.

## Motivation

VSIDS activities begin without accumulated conflict information, making its initial branching choices relatively weak. Graph-Q-SAT investigates whether a structural learned policy can guide this warm-up phase while keeping the complete CDCL algorithm intact (Sections1–3).

## Contributions

- A graph-network Q-function chooses a variable and Boolean polarity in MiniSat, trained by a simple per-decision penalty rather than expert branch labels.
- Experiments distinguish size transfer, SAT-to-UNSAT transfer, cross-family transfer, training-set size and the number of neural decisions before VSIDS resumes (Sections4.1–4.4).
- One SAT-50-218-trained policy is reused on SATLIB flat coloring encodings (Table3). This demonstrated shared decision-solving behavior supports generalist classification here; it does not optimize chromatic number, and the coloring-trained model in Table4 is separate.

## Methodology

**Host solver and actions.** MiniSat retains propagation, clause learning, conflict analysis, backtracking and the complete search procedure. Each action assigns one currently unassigned variable true or false. The observed residual formula contains unassigned variables, unsatisfied clauses and newly learned clauses; the paper explicitly notes partial observability because hidden assignments may be undone after conflicts (p.4). Exact SAT/UNSAT reasoning comes from CDCL, not a neural classification guarantee.

**Representation.** Variable/clause node-type one-hots and positive/negative edge labels form a compact directed bipartite graph. An encode–process–decode graph network, with edge, node and global updates, produces two Q-values per variable; argmax selects the branch. Four message rounds, sum edge-to-node aggregation, mean global aggregation and layer normalization are specified in supplementC. The encoder/core widths are32/64 and the core output dimensions are64/64/32 for vertices/edges/global state.

**Learning and handoff.** DQN uses replay, a target network and epsilon-greedy exploration, with a nonterminal step penalty of−0.1 and terminal reward0. SupplementTable5 specifies Adam at2e−5, gamma0.99, batch64, replay20000,50000 batch updates,5000 initial exploration steps, exploration1.0→0.01 over30000 environment steps, updates every4 steps and target-update frequency10. Neural calls are capped, then MiniSat/VSIDS finishes search; VSIDS activity still updates during neural guidance. The usual test cap is500, varied from0 to1000 in Figure3. Wall-clock experiments use only10 neural calls (paperp.5; supplementA,C).

## Experiments

**Metric and data.** Median Relative Iteration Reduction (MRIR) is the median across instances of MiniSat decision count divided by the hybrid solver's decision count. Values above1 mean fewer decisions, not a wall-time speedup. Results average MRIR over five training runs with min/max. SAT-50-218 has800 training,100 validation and100 test formulas; other random-SAT benchmarks use100 each. Models are selected by validation performance, and comparisons use the better MiniSat restart setting (p.5; supplementC.2).

**Size and satisfiability transfer.** Table2 reports MRIR2.46,3.94,3.91 on satisfiable50/100/250-variable datasets and2.34,2.24,1.54 on corresponding UNSAT datasets, when training only on SAT-50-218. The abstract's2–3X wording therefore describes decision reductions with dataset variation, not universal timing. Greater propagation per decision is measured; the VSIDS-warm-up explanation remains an empirically supported interpretation (pp.5–6).

**Cross-family transfer.** Table3 reuses the random-SAT policy on eight coloring benchmarks. Mean MRIRs are1.51,1.36,1.40,1.44,1.02,0.76,0.67,0.67; the three largest sets regress. The separately coloring-trained model in Table4 improves mean MRIR on held-out sets. Its75-180 training and100-239 model-selection results must not be counted as held-out tests (pp.6–8; supplementC.2).

**Budgets and time.** Figures3–4 study initial neural-call budgets and training on1–800 formulas. A single formula can yield useful transfer on selected random-SAT benchmarks, rather than establish universal one-example learning. SupplementFigure5 shows wall-time gains on SAT/UNSAT-250 with10 neural calls; timings include inference in that implementation. The scaling argument requires accumulated propagation savings to exceed inference costs and relies on observed near-linear inference scaling, not an asymptotic solver guarantee (supplementA).

## Limitations

### Discussed in the Paper

The principal bottleneck is inference time, and industrial-scale competitiveness remains unestablished. The authors suggest faster C++ integration, smaller networks, less frequent polling and using predictions as activities. Training on larger formulas is less stable, and transfer can be worse than MiniSat (pp.7–9).

### Curator Notes

The learned representation is partially observed; completeness is inherited from the retained host solver and fallback search. The cross-task evidence is fixed SAT decision encodings, not shared graph optimization. MRIR includes the host solver's continuation and must not be quoted as neural-only efficiency. Mainp.5 says validation every1000 batch updates, while supplementAlgorithm2 checks environment-step frequency; reproduction should resolve that specification difference against the chosen code revision. The publication does not provide a hardware-matched comparison to current industrial SAT solvers.

## Reproducibility

- Fully reviewed the14-page [NeurIPS2020 publisher paper](https://proceedings.neurips.cc/paper_files/paper/2020/file/6d70cb65d15211726dcce4c0e971e21c-Paper.pdf) and all6 scientific pages of its [official supplement](https://proceedings.neurips.cc/paper_files/paper/2020/file/6d70cb65d15211726dcce4c0e971e21c-Supplemental.pdf), linked on the [proceedings record](https://proceedings.neurips.cc/paper_files/paper/2020/hash/6d70cb65d15211726dcce4c0e971e21c-Abstract.html).
- The author-linked [NVIDIA/GraphQSat repository](https://github.com/NVIDIA/GraphQSat) contains the modified MiniSat interface, DQN implementation and train/evaluate scripts. Its README volume number is inconsistent with the publisher's volume33; venue metadata here follows the proceedings.
- Architecture, data exclusions, training settings and pseudocode are in supplementC. No solver experiments were rerun during this audit.
