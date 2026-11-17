---
id: mistar
short_title: MIStar
title: Learning Memory-Enhanced Improvement Heuristics for Flexible Job Shop Scheduling
authors:
- Jiaqi Wang
- Zhiguang Cao
- Peng Zhao
- Rui Cao
- YuBin Xiao
- Yuan Jiang
- You Zhou
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/77629f2df5ef97ad967157c69cd8af7b-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/77629f2df5ef97ad967157c69cd8af7b-Abstract-Conference.html
institutions:
- Jilin University
- Singapore Management University
- Nanyang Technological University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Scheduling
problems:
- Flexible Job Shop Scheduling Problem
summary: MIStar learns FJSP reinsertion moves from a directed operation-machine graph
  and retrieved scheduling history, evaluating multiple sampled candidates before
  executing the best.
code_url: https://github.com/wplus0077-dev/L2S-FJSP
---

# Learning Memory-Enhanced Improvement Heuristics for Flexible Job Shop Scheduling

> **TL;DR:** Starting from complete flexible-job-shop schedules, MIStar uses graph embeddings and retrieved state-action history to propose critical-operation reinsertions. It evaluates a batch of proposed moves and executes the best. Performance gains depend on initialization and candidate budgets, with a terminal-node caveat in the claimed action compression.

## Motivation

FJSP jointly chooses compatible machines and operation order. Complete schedules permit improvement search, but conventional JSP swaps cannot change machine assignments and can violate precedence when same-job operations share a machine. Flexible assignment also enlarges the search space. The paper therefore combines a directed operation-machine representation, richer reinsertions, memory and parallel candidate evaluation (Sections1-3; AppendixA).

## Contributions

MIStar contributes a directed heterogeneous disjunctive graph with ordered machine hyper-arcs, a memory-enhanced heterogeneous GNN, a compact state-history representation and n-step PPO with parallel greedy exploration. It evaluates synthetic distributions, public benchmarks, initialization sensitivity and architectural/search ablations. The solver is **specialist/improvement for nonpreemptive FJSP**, rather than an implemented dynamic-production or multi-problem solver (Sections3-5).

Main models are trained for four small shapes at each of two synthetic distributions and transferred to larger shapes; the public benchmark uses the10x5-trained SD2 model. Section5.4 additionally identifies a20x15-trained model for larger tests. These are separate size/distribution configurations, not a demonstrated shared checkpoint across distinct native CO tasks. The current release contains four MIStar size checkpoints and four DANIEL initializer checkpoints (PDF8-10; repository inventory).

## Methodology

Each job has an ordered operation chain; each operation has a compatible machine set and machine-dependent duration. A feasible complete schedule fixes both assignment and order. Nine operation features describe durations, flexibility, earliest/latest starts, machine rank and job processing time; four machine features describe utilization, criticality, load and efficiency. GIN/GAT operation encoders and heterogeneous machine attention extract embeddings from the directed job/machine structures (PDF4-7/22-23).

Nopt2 removes a critical-path operation and reinserts it into an admissible interval on another compatible machine. An action is a triple(operation, insertion target, machine). The policy omits the machine coordinate when it can be recovered from the insertion target, and forms a dense operation-pair score matrix. This gives O(N²) score storage rather than an O(N²M) triple tensor; it is not a linear complexity claim (Section4.3; AppendixE).

The memory stores the operation-machine matrix whose nonzero entries are machine-order ranks, plus the executed action. Frobenius inner products retrieve15similar histories from a600-entry buffer. Component-wise weighted voting yields a historical action embedding used as context, not an automatically feasible executed move. Reward combines positive best-incumbent improvement with a similarity penalty. Only the improvement component telescopes to initial minus best makespan; the full penalized objective additionally encourages diversity. A fully specified Markov state would also include the incumbent and relevant memory (PDF5/7/23-24).

The printed training configuration uses four graph layers,64hidden units, four actor/three critic layers, Adam5e-4, clipping0.2, entropy0.01,10-step PPO updates with three optimization passes, batch20 and100search iterations. Each step samples50candidate moves, evaluates their schedules and executes the lowest-makespan candidate, retaining the best incumbent. Test horizons extend to400. DANIEL samples100initial schedules per instance, and comparison improvement rules receive matched starts (PDF8/25-26).

## Experiments

**Synthetic instances.** SD1 andSD2 each contain100test instances at six shapes; four shapes are trained and30x10/40x10 test size transfer. The models substantially improve on constructive HGNN/DANIEL, especially SD2. For SD2 15x10,400iterations produce465.71 versus DANIEL522.51 and BI514.73. Improvements are not universal at every budget: SD1 10x5 at100iterations gives100.02 versus GD100.00, and SD2 40x10 gives931.04 versus BI930.44. Negative gaps to finite OR-Tools runs mean better incumbents, not better than proven optima (Tables1-2; AppendixH).

**Public benchmarks.** Brandimarte has10instances; Hurink edata/rdata/vdata have40each. MIStar400 reports mean gaps2.96%/2.37%/6.83%/0.24% respectively and improves on the displayed learned/rule-based results. OR-Tools and2SGA retain better quality in several comparisons. The2SGA vdata row uses only la1-30, while MIStar uses the full set, so their mean makespans are not directly comparable. MIStar is not uniformly faster: on edata its400-step time83.77seconds exceeds GD16.51 and BI27.24. Table3 reports mean±standard deviation over10independent runs, without identifying these as independently retrained models (Table3).

**Larger instances.** Ten random instances each at50x15,60x15,100x10 and50x30 receive a one-hour cap. At200iterations, MIStar reaches objectives969.7/1109.8/2138.4 in10.6/14.2/15.9minutes, versus OR-Tools881.45/1075.1/1922.65 after60minutes: faster, but worse quality in all three. For50x30, the authors report that OR-Tools finds no feasible incumbent within the limit while MIStar reaches1040.1; the printed Infeasible entry is not a proof that the instance is infeasible. Table4 uses100*(1-LB/objective), a different gap definition from the best-known-reference and initialization-improvement tables (PDF10).

Six initialization strategies show that larger percentage improvement from weak starts does not imply better final makespan. Ablations favor combining memory, graph modules and candidate parallelism, while parallelism costs more per iteration and memory alone does not prevent poor local solutions. Tests vary P from10to70: quality saturates around20on10x5 and60on15x10. Hardware is an i9-12900K,64GB RAM and RTX409024GB; candidate count and parallel trajectories belong in the compute budget (AppendicesG-J).

## Limitations

Search depends on the initial schedules, one critical path, admissible reinsertions, candidate count and history representation. There is no global convergence or approximation guarantee. The rearrangement inequality in AppendixD concerns positional agreement for fixed multisets; it does not establish that the inner product predicts makespan quality. Different assignments/load patterns also change norms. Reducing a score tensor does not by itself prove better learning performance.

### Curator Notes

**Action-compression boundary.** Theorem2(PDF25) proves triple/pair equivalence using a unique machine f_M(On). This is valid when On is a real scheduled operation. The action definition(PDF5) also permits the shared terminal OT. Consider one operation compatible with three machines, currently assigned toM0, withM1/M2empty. Inserting it at the end ofM1 orM2 gives two feasible triples(1,T,1)/(1,T,2), but the same pair(1,T). The original neighborhood methods produce both; the current model's pair-to-machine lookup takes the first matching row and cannot select the second destination through that code. Thus terminal/empty-machine insertions need additional encoding or restrictions for the claimed bijection. A tiny script executing the unmodified original neighborhood methods reproduces the collision; it does not rerun the experimental solver.

**Training/release distinctions.** Algorithm1(PDF25) initializes and clears both buffers inside each step, which would erase the advertised history if interpreted literally. The implementation instead keeps history through the episode and clears PPO data after updates. It uses exponentiated similarity voting and normalized similarity, rather than the printed raw weighted sum; mean GIN aggregation/layer-summed features also differ from the displayed equations. Current default training uses400iterations rather than the printed100. Selected best-of-P actions are stored with their base policy log probability; the induced best-of-P behavior differs from a single direct policy sample, so this is a PPO-based heuristic without an established exact on-policy correction.

The released test samples100initial schedules, retains20parallel trajectories and reports the best incumbent across them, while dividing elapsed improvement time by20 and excluding initialization from that timer. That normalized trajectory time should not be read as end-to-end wall time to obtain the best-of20result. These release observations are kept distinct from the historical article's reported numbers. No neural training or full scheduling benchmark was rerun.

## Reproducibility

- All29pages of the [formal NeurIPS2025 PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/77629f2df5ef97ad967157c69cd8af7b-Paper-Conference.pdf) were read, including61references, the full checklist and AppendicesA-J. Sixteen key pages were visually checked, covering all eight figures, seven tables and both theorem statements/proofs. Publisher HTML records April23,2026, volume38, pages82849-82877 and DOI10.52202/085713-2776; the conference year remains2025.
- The publisher lists no separate scientific attachment; scientific appendices are integrated. Both OpenReview APIs for`sdlLycSeZl` returned403. No explicitly missing scientific document was found. The checklist's no-code statement describes the paper-time release, whereas a public implementation now exists.
- The [repository identifying itself as the official implementation](https://github.com/wplus0077-dev/L2S-FJSP) was inspected at`f1f0a54173c5b09eb9940624c54783cd3ee261ca`, pushed January4,2026:1,808files, four MIStar and four DANIEL checkpoints, no PDF/ZIP. README, parameters, memory, GNN layers, full policy/PPO and full test sources plus relevant training/environment functions were read. The extra20x15checkpoint named in Section5.4 is not among the released weights. Dependencies include PyTorch1.7.1/PyG1.7.2 and should be recreated explicitly.
- The cache preserves rendered evidence, source files and`recompute_terminal_collision.py`; it executes only four original neighborhood functions on a one-operation case. Eight catalogue relations have both explicit body references and full bibliography identity. Uncatalogued MARCO/HGNN/DANIEL and other related articles are not mapped to similar-looking catalogue entries.
