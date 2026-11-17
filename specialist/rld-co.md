---
id: rld-co
short_title: RLD
title: Regularized Langevin Dynamics for Combinatorial Optimization
authors:
- Shengyu Feng
- Yiming Yang
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/feng25r.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/feng25r.html
institutions:
- Carnegie Mellon University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Maximum Clique
- Maximum Cut
summary: 'RLD encourages a target expected bit-flip distance: non-neural RLSA uses
  analytical gradients, while task-specific RLNN learns a one-step energy/soft-distance
  objective without long-horizon returns.'
code_url: https://github.com/Shengyu-Feng/RLD4CO
---

# Regularized Langevin Dynamics for Combinatorial Optimization

> **TL;DR:** Encourage discrete samplers to keep moving by regularizing their expected number of bit flips. RLSA is an untrained analytical heuristic; RLNN is a separately trained neural improvement policy. The reported neural experiments use differentiable graph energies, not an arbitrary black-box oracle.

## Motivation

At a discrete local optimum, a smooth extension's gradient can point outside the binary domain rather than vanish. Standard discrete Langevin proposals may then give almost no probability to useful moves. RLD tries to maintain exploration through the expected Hamming distance between consecutive assignments, rather than keeping a constant continuous-space step size (Sections1-3).

## Contributions

The framework yields two solvers. **RLSA** computes analytical graph-energy gradients, thresholds their implied improvement scores with an order statistic, samples coordinate flips in parallel, and anneals temperature while retaining the best visited assignment. **RLNN** learns conditional independent flip probabilities using a local next-state energy objective plus a soft distance penalty. It avoids estimating the return of a long trajectory. The paper evaluates MIS, maximum clique and MaxCut on synthetic graphs, including within-MIS size transfer.

The neural component is a specialist improvement/sampling policy with separate checkpoints for each native task/dataset. RLSA's reuse across tasks is an analytical algorithm, not a generalist neural checkpoint. The largest speed claims belong to the untrained RLSA branch and should not be attributed to RLNN training or inference.

## Methodology

Binary constrained optimization is represented by energy H=a+beta*b, assuming a sufficiently strong penalty makes its minima feasible. MIS and clique use cardinality rewards and edge/nonedge penalties; MaxCut has an unconstrained quadratic energy. Exact derivatives of these chosen smooth extensions are available (Equations17-23).

RLD begins with an intended expected Hamming distance d. RLSA approximates it using flip probabilities sigmoid((Delta_i-Delta_(d)-epsilon)/(2*temperature)), where Delta=(2x-1)*gradient(H) and Delta_(d) is its d-th largest entry. This is an order-statistic heuristic, not exact solution of the sigmoid-sum constraint. The kernel may lose symmetry/local balance after regularization, as the authors state. Algorithm1 has no Metropolis acceptance correction, so it is an optimization heuristic rather than an exact Boltzmann sampler (Equations9-16).

For RLNN, a five-layer128-dimensional residual GCN maps the current assignment and graph to independent bit-flip probabilities. The loss is expected one-step energy plus lambda*(sum flip probabilities-d)^2. With the displayed zero-diagonal graph polynomials the first term is tractable under the product distribution, as in EGN. A REINFORCE alternative is discussed/provided, but the article's experiments use the differentiable unsupervised loss. Training collects current-policy states and differentiates this local conditional loss, not the future trajectory return. Neural inference keeps temperature1 rather than annealing it. Lowest-energy candidates are postprocessed for feasibility (Equation24; Algorithm2; AppendixA).

## Experiments

RB/BA small graphs have200-300 nodes and large graphs800-1200; MIS ER graphs have700-800 nodes for training and9000-11000 for transfer testing. The protocol has1000 training/100 validation graphs and500 RB/BA or128 small-ER test cases; large ER has16 test graphs. The repository clarifies that RB/BA results average two500-instance test groups. Models train for50 epochs, or80 for large-RB clique, with Adam1e-4. Inference uses float16; training uses float32. Training hardware is eight RTX A6000 or ten2080Ti GPUs; measured inference uses one A6000. Most non-iSCO baselines are published results, rather than uniformly rerun methods (Section5; AppendixA).

**RLSA.** With matched numbers of steps/trials, it improves iSCO MIS sizes19.29→19.97 on small RB and36.96→40.19 on large RB, with runtimes2.71minutes→35seconds and11.26→1.85minutes. Large ER improves365.37→375.31, taking1.66minutes versus1.10hours. KaMIS remains better at381.31. The manuscript's5%-20% runtime statement describes selected comparisons and is not a universal ratio: small-RB35seconds/2.71minutes is about21.5%, and other tasks differ. MaxCut large-BA RLSA reaches2955.81 versus iSCO2919.97 in1.45 versus4.18minutes (Tables1-2).

**RLNN.** It reaches MIS small-RB19.52 and small-ER43.34, improving several neural baselines, but large-RB38.46 trails DiffUCO38.87. Large-BA MaxCut2907.18 trails DiffUCO2947.53 and iSCO2919.97. Fewer neural inference samples/steps than RLSA reflect the cost of a GCN pass; their budgets are not identical. Reported training completes within three hours, compared with a cited two-day DiffUCO run, but the comparison uses different configurations/hardware and does not isolate a universal wall-clock training factor (Tables1-2; AppendixA.2).

**Ablations and longer runs.** Regularization improves RLNN MIS small-RB18.64→19.52, small-ER37.73→43.34 and clique16.62→18.13, but hurts small-BA MaxCut730.20→729.00. Figure1 compares RLSA with three standard-Langevin step sizes; its bands describe variation across test instances, not confidence intervals across independent training seeds. Tenfold-longer RLSA remains competitive, e.g. large-RB MIS41.83 versus iSCO40.47 and large-BA MaxCut2968.59 versus2960.23. These are best-known/reference-quality comparisons, not proof of exact optimality; some listed Gurobi values are exceeded (Table3; AppendixB).

## Limitations

The authors explicitly provide an intuitive explanation rather than a general theory. Binary graph tasks with local penalties are the tested scope; categorical/mixed-integer variables and globally constrained TSP remain future work. Maintaining movement does not prove escape from every local optimum, convergence to a target distribution, a fixed approximation ratio or global optimality. Differentiable-energy RLNN training is not evidence for arbitrary black-box performance. Hyperparameters, graph distribution, architecture, precision, multi-GPU training and postprocessing affect the trade-off.

### Curator Analysis

The expected-distance equality is approximate in RLSA and softly penalized in RLNN. With ten identical Delta values, epsilon=0 and d=2, the order-statistic sampler gives probability1/2 to every flip and expected distance5, not2. Ties are common in unweighted graph energies. A positive epsilon changes the low-temperature boundary again. This illustrates the stated approximation, without contradicting its empirical usefulness. The sampler should not be described as enforcing exactly d flips or exactly expected d at every step.

AppendixA.3 describes greedy single-flip energy descent, whereas the current MIS release greedily builds a maximal independent set in candidate-score order. These decoders can yield different solutions. The article's AppendixC says timing covers its displayed RLSA function, while the current wrapper also invokes decoding and logs mean per-instance time. Reproducing total test-set runtimes requires preserving the original decoder, timing boundary and aggregation rather than comparing raw log fields as totals.

## Reproducibility

- All16 pages of the [formal ICML2025 article](https://raw.githubusercontent.com/mlresearch/v267/main/assets/feng25r/feng25r.pdf) were read, including every reference, scientific AppendicesA/B and every line of AppendixC's example code. Eight key method/table/ablation/code pages were visually inspected. Publisher metadata verifies two CMU authors, PMLR267:16977-16992 and October6,2025.
- Publisher Related Material has the complete PDF, OpenReview and Software, with no separately linked scientific supplement. OpenReview v1/v2 requests for `bbJ0QCujU4` returned403. The official32-file repository has no PDF/ZIP scientific attachment; all printed scientific appendices were read. Neural weights and test data are separately linked on Hugging Face.
- The [official code](https://github.com/Shengyu-Feng/RLD4CO) was inspected at `7c3e5e7a161322d4dd4339fb760e1a8691847666`. Full README,122-line model,75-line MIS problem/loader and both22-/19-line evaluation/training scripts were read, plus solver lines123-339. Current training uses batch64 versus printed32; state generation uses `num_k` rather than the separately assigned `num_kp`. The training shell redirects through `LOGDIR` although it defines `SAVEDIR`, so the log directory must be set/corrected before use. RLSA's epsilon-free order statistic matches the AppendixC variant. No training or benchmark was rerun.
- 18 exact existing-paper references are recorded. Duplicate Li2018a/b entries map to one paper. The old-title Feng2025b reference is the same FrontierCO manuscript by exact arXiv2505.16952 identity. Sorrel and the separate Yau2024 theory paper are not assigned edges to unrelated existing IDs merely because their topics overlap.
