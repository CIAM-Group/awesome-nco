---
id: qap-qnn
short_title: QAP-QNN
title: 'Towards Quantum Machine Learning for Constrained Combinatorial Optimization: a Quantum QAP Solver'
authors:
- Xinyu Ye
- Ge Yan
- Junchi Yan
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/ye23g.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/ye23g.html
institutions:
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Quantum Optimization
- Graph Matching
- Routing
problems:
- Quadratic Assignment Problem
- Graph Matching
- Traveling Salesman Problem
summary: A supervised quantum circuit constructs QAP assignments with classical Sinkhorn/Hungarian decoding; tiny
  simulated GM/TSP results, soft constraints and auxiliary-gate symmetry limits qualify claimed benefits.
---

# Towards Quantum Machine Learning for Constrained Combinatorial Optimization: a Quantum QAP Solver

> **TL;DR:** A supervised parameterized quantum circuit predicts a relaxed QAP assignment, followed by classical Sinkhorn/Hungarian decoding. Tiny simulated graph-matching/TSP experiments improve the selected quantum baselines, while simple classical TSP methods remain stronger. Soft constraints, an auxiliary-gate equivariance gap and missing training-cost accounting qualify broader claims.

## Motivation

QAOA ordinarily encodes unconstrained binary objectives; penalties for assignment constraints do not automatically yield feasible solutions. Constrained mixers can restrict evolution but still typically optimize circuit parameters per instance. QAP-QNN instead trains a reusable quantum network offline from solved examples, then predicts on held-out inputs. Its intended advantage is amortized inference, not a proved quantum runtime advantage (Sections1–2).

## Contributions

- A graph/association-graph representation maps binary QAP variables to quantum node features.
- Repeated feature encoding, auxiliary assignment-control gates and shared quantum perceptrons form a supervised circuit, followed by pooling and classical matching normalization.
- Simulated graph matching and4-/5-city TSP, layer/module ablations and a limited readout-noise test explore the proposal. The paper's permutation claim requires the qualifications below (Sections3–5).

## Methodology

**Task.** Optimize vec(X)^T K vec(X) with one-to-one row/column assignment constraints. Although a partial rectangular formulation appears initially, the study restricts to square equal-cardinality assignments. For graph matching, association nodes are candidate correspondences and K contains node/edge affinities. For TSP, X_(v,j) assigns city v to tour position j; quadratic costs connect consecutive positions modulo the number of cities, so a permutation decodes a complete tour without a separate subtour heuristic (Equations1/8).

**Quantum features.** A problem with N assignment variables uses m qubits per variable, hence mN qubits. Diagonal K entries parameterize RY rotations; off-diagonal affinities parameterize RZZ interactions. An auxiliary layer rotates a target by RX(beta) only if the other variables in its assignment row/column are all zero. Shared m-qubit RZ/RY/CNOT perceptrons process every variable; repeated blocks re-encode the input. Shared matrix-product-state-style pooling reduces each variable to a measured output. These are trainable quantum circuits simulated with TorchQuantum, not classical GNN layers disguised as quantum hardware measurements (Figures2–6/Equations2–5).

**Training/decoding.** Measured scores are reshaped and Sinkhorn-normalized to a relaxed doubly stochastic matrix. Binary cross-entropy against a reference permutation trains beta/theta/alpha using classical Adam(initial learning rate .1). At test time a classical Hungarian algorithm rounds scores to a permutation. The paper explicitly calls the auxiliary layer a **soft** constraint: neither quantum amplitudes nor a finite Sinkhorn iteration alone certify binary assignment feasibility. The eventual Hungarian solution provides the combinatorial assignment, but does not globally optimize the original quadratic objective (Section3.6/Figure2 caption).

**Scope.** Specialist/constructive is retained. The paper supplies distinct graph-matching and TSP supervised datasets/trials, without demonstrating unchanged learned circuit weights transferring between those native tasks. Shared architecture/parameter tying across vertices is not proof of a shared cross-task checkpoint. Inference constructs the first complete assignment and does not neurally edit a complete incumbent; unlike per-instance QAOA, network fitting is an offline supervised phase.

**Permutation analysis.** The paper uses “invariance” for an output that should actually permute with input variables(equivariance). Shared local perceptrons and commuting diagonal RZZ gates support their respective symmetry arguments. However, Section4's additional claim that the whole auxiliary layer is order independent is not established by sharing beta: overlapping zero-controlled RX gates generally do not commute. Its operator equation U_permuted=P U also omits the usual right inverse/conjugation; equality on the all-zero initial state is a separate, weaker condition. A precise counterexample to the auxiliary claim is given below, rather than treating the printed analysis as a theorem guaranteeing every complete circuit.

## Experiments

**Simulation/data.** Hardware is a workstation with four Xeon Platinum8276 CPUs(total224 cores) and an A100 GPU; TorchQuantum state simulation allows only small qubit counts, with training batch16. Graph matching uses ten base point sets, each with320 distorted training graphs and100 test graphs, under independent scaling/noise. Targets are fully connected and references use Delaunay triangulation. Thus tests share base target templates with training; they are not a held-out-template transfer study. Planted correspondences provide matching supervision/accuracy, and should not automatically be called certified optimal permutations of every noisy affinity instance. Main classical comparisons use four-node graphs(16 assignment qubits); quantum comparisons use three-node graphs(9 qubits at m=1 or18 at m=2) (Section5.1).

**Graph matching.** Figure7 shows better matching accuracy than the selected RRWM/IPFP/SM/NGM implementations over the plotted distortions. Table1's four reported objective gaps for m=1 are0/3.153/3.481/.270%, and for m=2 are0/2.879/.521/.045%, versus QAOA4.211/13.21/4.307/6.325% and constrained QAOA3.419/4.236/5.941/2.729%. The text notes that unconstrained QAOA may violate assignment constraints; objective gap alone does not establish comparable feasibility, nor is the precise GM optimal-reference/constraint-repair procedure fully documented. The last row reports2507.3/120.34/.1981/.6284 seconds for QAOA/C-QAOA/QNN-m1/m2. Per-instance optimization is included for the quantum variational baselines, whereas QNN training is offline. Training amortization, state preparation, measurement shots and real-device gate costs are not supplied as an equal end-to-end runtime comparison.

**TSP and counterexamples.** Each size has3200 training and1000 test instances uniformly sampled in the unit square, supervised by Concorde. TSP-4/5 require16/25 qubits at m=1. Relative gaps average per-instance tour_length/optimal_length−1. QAP-QNN yields tour means1.7205/2.2574 and gaps .76/6.30%, compared with QAOA6.47/11.4% and C-QAOA2.53/8.58%. Yet classical insertion is stronger: all three insertion rules attain0% on TSP-4; random insertion attains0% on TSP-5 and nearest/farthest insertion1.98/.63%. Consequently this is evidence against the selected quantum baselines, **not classical state-of-the-art routing superiority** (Table2).

**Ablations/noise.** TSP-4 gaps are2.46% with repeated encoding but no auxiliary layer,12.56% with the auxiliary layer but no repeated encoding, and .76% with both. These numbers correct any implication that removing repeated encoding has only the small loss. Two/four/six/eight/ten blocks give7.32/4.21/.76/.44/1.01%, showing deterioration at ten. Graph-matching precision falls .845→.780 when simulated end-of-circuit bit-phase-flip probability rises0→.05. This limited readout-noise test does not evaluate general gate noise, calibration drift or actual NISQ hardware. No uncertainty intervals/repeated-training-seed statistics accompany the main tables (Tables3–5).

## Limitations

### Discussed in the Paper

Simulation memory limits problem size; m and depth trade representation against optimization/runtime. The auxiliary layer has multi-controlled gates whose decomposition can increase hardware depth. It can be omitted at an accuracy cost. The study is restricted to QAP, with broader mixed-integer/CO solvers left open.

### Curator Notes

For the **printed** auxiliary product, take a2x2 assignment, m=1, beta=pi, zero K and all other rotations identity. Start in0000, ordering bits(x11,x21,x12,x22). Applying the targets in this order produces1001(up to phase); swapping the first two target operations produces0110. Each target is enabled exactly when its row/column neighbors are zero, as Equation2 specifies. A native column swap preserves zero K and the constraint graph but maps1001 to0110; an implementation retaining the same fixed target scan returns1001. Therefore unconditional order independence/equivariance does not follow. A small direct state-vector check is preserved in the audit cache. The root reviewer independently read formal pp4–6 and confirmed this fixed-scan counterexample, including the distinction between operator and all-zero-input state identities. This refutes that layer's unrestricted symmetry assertion, **not feasibility of these two matchings, the numerical benchmark results, or the possibility of a revised symmetric circuit**. Sharing the perceptron alone cannot repair the missing auxiliary symmetry argument.

No trained checkpoint/code release was verified in the publisher, official event/poster or targeted repository search. Exact circuit order, probability mapping from Pauli-Z expectations, measurement-shot count, epochs/stopping, optimizer budgets and baseline repair details therefore cannot be independently reconstructed from a frozen release. The audit did not train a quantum model or rerun benchmark solvers. Classical simulation timings and tiny datasets provide no practical quantum-speedup certificate.

## Reproducibility

- **Formal record:** [ICML2023/PMLR202](https://proceedings.mlr.press/v202/ye23g.html), pp39903–39912; official citation_publication_date July3,2023, distinct from the July23–29 meeting dates. Three authors/SJTU identity checked.
- **Full coverage:** all10 formal pages, every reference/circuit/equation/table read. Key pages4/5/7/8 rendered and inspected. Publisher Related Material links only mainPDF/OpenReview; no appendix or scientific supplement is explicitly referenced. Both normal publisher asset directory API variants returned404; OpenReview Brn6oCUVK5 API403 was recorded without bypass. Unknown unmentioned extras are not asserted nonexistent.
- **Official artifact:** ICML event24148's1302364-byte poster was read in full. It repeats the circuit/ablations and quantum TSP table; its illustrative large tour image is not evidence of a measured large-TSP quantum run. Targeted QAP-QNN/quantum-QAP repository searches returned no matching author release; no unrelated TorchQuantum library was reported as paper-specific code.
- **Relations:** Section6/p8 and bibliography p10 explicitly cite [CardNN](cardnn.md), with the same six authors/year and a slightly expanded “One-shot ... optimization solvers” title in this bibliography. It maps to the existing ICLR2023 stable ID. Full references were compared with the catalogue; external NGM/GM/classical quantum algorithms are not fabricated as new internal nodes.
