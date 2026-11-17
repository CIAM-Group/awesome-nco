---
id: unico
short_title: UniCO
title: 'UniCO: On Unified Combinatorial Optimization via Problem Reduction to Matrix-Encoded General TSP'
authors:
- Wenzheng Pan
- Hao Xiong
- Jiale Ma
- Wentao Zhao
- Yang Li
- Junchi Yan
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/3acefc84f1355f5f974195bb9f6014a4-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/3acefc84f1355f5f974195bb9f6014a4-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Satisfiability
- Graph Optimization
problems:
- Traveling Salesman Problem
- Asymmetric Traveling Salesman Problem
- Directed Hamiltonian Cycle
- Boolean Satisfiability
- Vertex Cover
summary: A shared matrix-encoded TSP interface learns ATSP, Euclidean TSP, Hamiltonian-cycle and small SAT distributions
  through reductions, with RL/POE and supervised-diffusion backbones; vertex cover is an additional experiment.
code_url: https://github.com/Thinklab-SJTU/UniCO
figure:
  path: paper-assets/unico/framework.png
  alt: UniCO reduces native combinatorial problems to cost matrices, solves a general TSP and transforms the tour
    back.
  caption: 'Figure 2: Problem reduction, shared matrix solving and result transformation.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/3acefc84f1355f5f974195bb9f6014a4-Paper-Conference.pdf#page=3
---

# UniCO: On Unified Combinatorial Optimization via Problem Reduction to Matrix-Encoded General TSP

> **TL;DR:** UniCO maps several native problems to distance-matrix TSP instances and jointly trains a shared matrix solver. MatPOENet uses reinforcement learning and size-flexible positional features; MatDIFFNet uses supervised discrete diffusion. The evaluated universality is substantially narrower than all polynomially reducible problems.

## Motivation

Coordinate-based neural TSP models do not directly accept asymmetric, binary or nonmetric distances. Problem reductions offer a common interface for native routing, Hamiltonian-cycle and satisfiability tasks, provided reduction size and solution recovery are practical. UniCO studies shared learning in this matrix space, rather than assuming computational-complexity equivalence automatically yields an effective universal learned solver.

## Contributions

- A reduction–matrix-solving–solution-recovery pipeline jointly trains on ATSP, Euclidean TSP, directed Hamiltonian cycle and 3SAT distributions.
- MatPOENet replaces MatNet's fixed one-hot node initialization with pseudo one-hot embeddings (POE), enabling a fixed embedding width for variable matrix sizes.
- MatDIFFNet combines distances with noisy solution-edge labels and maintains separate source/destination node features for directed graphs.
- A DIMES instantiation, vertex-cover experiment, supervised heatmap variant, adaptation experiments and external TSP tests explore extensions of the interface.

## Methodology

**Reduction and scope.** HCP edges receive cost zero and missing edges cost one, so a zero-cost Hamiltonian tour witnesses a Hamiltonian cycle. The paper constructs variable/clause gadgets for 3SAT with **2 times the number of variables times the number of clauses, plus the number of clauses** reduced nodes. Appendix E gives a vertex-cover construction with 4|E|+k nodes. Recovering a validated satisfying assignment or cover is distinct from simply emitting a permutation. A heuristic's failure to find a zero-cost tour does not certify UNSAT or nonexistence. The printed definition of 3SAT incorrectly says at most three variables overall; the intended bound is per clause, as the experimental tables themselves use up to nine variables.

**MatPOENet.** A nearest-neighbor tour supplies node positions. Circularly shifted samples of an impulse-shaped hyperbolic-secant function form POE features whose inner products favor nearby rough-tour positions. This is an initialization for matrix attention, not a learned operation editing the nearest-neighbor tour. Two embedding streams mix attention scores with directed costs; the decoder masks visited nodes and constructs tours sequentially. POMO's REINFORCE objective uses multiple starting nodes and their mean cost as baseline. The primary policy is a constructive generalist: an actual common set of parameters trains on the four native task distributions. “Single” rows train separately per task, “Mixed” rows share across tasks at one size, and starred rows share across all three sizes.

**MatDIFFNet and other backbones.** An MLP combines the cost matrix with a noisy binary edge map. A GNN with distinct source/destination features denoises the solution distribution. Greedy heatmap decoding constructs a valid tour, optionally followed by conventional directed 2-opt. Diffusion uses solution labels, so the two proposed solvers should not both be called unsupervised: MatPOENet learns from costs without solution labels, while MatDIFFNet is supervised. UniCO-DIMES predicts an initial heatmap and supports instance-specific gradient-based active search; its search budget is separate from a forward pass. Large-instance GLOP experiments add an external divide-and-conquer/local-reviser pipeline and do not establish direct full-instance decoding at ten thousand nodes.

## Experiments

- **Data:** Each main reduced-size group around 20, 50 and 100 contains 10,000 tests, split equally across four tasks. HCP generation plants a Hamiltonian cycle. SAT examples have only 3–9 native variables and 2–9 clauses before gadget expansion; reduced node count is not original SAT size. Appendix F.4 separately tests 2,500 vertex-cover cases around fifty reduced nodes. Clique, independent set, CVRP and FFSP are proposed extensions, not demonstrated extra native tasks of the shared main checkpoint.
- **Budgets:** MatPOENet uses width 512, eight layers for smaller groups and five around size 100; up to 2,000 epochs of 10,000 generated instances give twenty million training instances. MatDIFFNet uses twelve width-256 layers, 1,000 training noise steps and fifty inference steps; the paper specifies 100 per-task versus 400 mixed epochs, with 1.28 million instances per epoch. It trains on eight H800 GPUs, whereas MatPOENet uses an RTX 3090/RTX 8000 depending on size. Main inference uses one RTX 3090, batch one, and distinguishes eight parallel MatPOENet trials, diffusion plus 2-opt and DIMES active search.
- **Main tradeoff:** At reduced size about 100, mixed MatPOENet-8x averages cost 2.5717 versus LKH-10,000's 2.5848, with total times 15m35s versus 2h15m. This aggregate advantage comes from binary decision distributions: LKH remains better on continuous ATSP and Euclidean TSP, and its HCP found rate is 100% versus 99.48%. MatPOENet's SAT found rate is 77.12% versus LKH's 44.80%. The all-size starred model lowers aggregate cost further to 2.5420 but has lower SAT found rate, 70.92%, so size mixing is not a uniform gain. The average gap is computed from aggregate mean tour length, rather than a mean of per-instance percentages for zero-optimum decision tasks.
- **Negative mixed/transfer results:** At size 100, individually trained MatDIFFNet plus 2-opt has 98.60% SAT found rate versus the mixed model's 91.44%; mixed training does not dominate specialists. A size-50 mixed MatPOENet transferred directly to size 100 has zero found rate on both HCP and SAT in Table 13. Target fine-tuning improves it, but those are adapted models. Table 12 reports 50/100/200 target epochs, despite its caption referring to 500 iterations; those counts cannot be silently treated as identical units.
- **Extensions:** Vertex-cover found rates are 78.28% for MatPOENet-8x and 66.60% for MatDIFFNet-2OPT versus Gurobi's 100%. A separate supervised heatmap variant reaches HCP500/SAT500 found rates 88.12/65.60%, using about 1h24m/1h22m. GLOP-based tests use only 128 instances at 1,000 nodes and sixteen at 10,000, with ten-thousand-node planted-HCP found rate 62.50%. Standard Euclidean TSP tests use 1,280 cases per size; at TSP100 MatPOENet*-8x has 4.78% gap, MatPOENet*-128x 2.28%, MatDIFFNet-2OPT 1.08%, and T2T 0.13%, under distinct runtimes. On forty-five selected TSPLIB cases, average normalized costs are 5.0811/5.2744 versus LKH3's 4.8622. The listed set includes `d198`, despite prose claiming an upper bound of 195. BQ-NCO/GOAL ATSP numbers in Table 22 are estimated from their published gaps, not runs on released checkpoints.

## Limitations

Polynomial reductions can be too large or poorly structured for practical learning. Full MatPOENet training has cubic memory scaling in the paper's implementation, limiting direct large-instance use; reduced-size flexibility is not reliable zero-shot size transfer. Synthetic positive-witness tests and average reduced-tour cost do not establish a complete SAT decision procedure or competitive industrial SAT performance. The paper excludes native specialized SAT/HCP solvers, so its rankings concern the chosen general-TSP interface. Appendix E's VRP-to-SAT discussion is explicitly preliminary; its displayed constraints are not a complete flow/subtour formulation or an implemented CVRP experiment. Future consistency-model and sparsification proposals are not measured improvements here.

**Source/release qualifications:** The paper describes uniformly sampled nonmetric ATSP, but the inspected PyTorch training path calls a generator that repeatedly applies all-pairs shortest-path closure, yielding triangle-inequality distances. Its `utils/generate_data.py` currently contains only supervised data-generator setup, while `ATSPEnv.py` calls undefined `gen_Euclidean`, `gen_hcp` and `gen_3sat`; corresponding functions do exist in the Jittor utility module. The diffusion environment's validation branch maps the `VC` label to HCP generation. These are concrete current-release differences, without proving which revision produced the paper's results. The note also does not repeat the paper's assertion that Concorde is limited to 2D Euclidean TSP: [the official solver page](https://www.math.uwaterloo.ca/tsp/concorde.html) describes symmetric TSP more broadly.

## Reproducibility

- **Sources:** Freshly read all forty-one pages of the formal ICLR 2025 proceedings PDF, including references and Appendices A–G, plus the complete one-page official scientific poster, including its embedded result tables. All eight figures and relevant main/appendix tables were rendered and checked. Original Figure 2 is cropped from PDF page 3 with its full caption.
- **Metadata:** Six authors, SJTU and the corresponding author's additional Shanghai Innovation Institute affiliation are verified from the formal PDF. The venue/year are established by the proceedings. The [publisher metadata](https://proceedings.iclr.cc/paper_files/paper/2025/hash/3acefc84f1355f5f974195bb9f6014a4-Abstract-Conference.html) explicitly records `citation_publication_date` as **2025-05-01**, independently of any paper-specific acceptance date. OpenReview's public forum/API require a challenge; no earlier first-public date or exact acceptance day is asserted. A different paper titled “UniCO: Towards a Unified Model…” is not merged with this work.
- **Code/supplements:** [Thinklab-SJTU/UniCO](https://github.com/Thinklab-SJTU/UniCO), inspected commit `776cc1f7589518e2948317dce21de9d41b2243ad`, includes PyTorch/Jittor implementations, data examples and links to checkpoints/additional data. The complete, nontruncated repository tree and 12,090-member archive contain no additional PDF, notebook, nested archive or video. README files and relevant generators, environment and directed decoder code were read; no training or benchmark rerun was performed. The one-page official poster is registered separately with its hash and actual reading coverage.
- **Relations:** Exact titles, authors and preprint identifiers in the six-page bibliography were checked against catalogue identities. The SIL preprint precursor is mapped to its later formal representative using explicit manuscript-comparison evidence; other solver papers are matched by exact identity; uncatalogued surveys, generators or related SAT works do not acquire invented graph nodes.
