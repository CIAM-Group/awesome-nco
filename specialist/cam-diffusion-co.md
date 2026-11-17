---
id: cam-diffusion-co
short_title: CAM
title: Unsupervised Diffusion Solver for Combinatorial Optimization via Combinatorial
  Adjoint Matching
authors:
- Shengyu Feng
- Tarun Suresh
- Yiming Yang
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/feng26o.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/feng26o.html
institutions:
- Carnegie Mellon University
- University of Illinois Urbana-Champaign
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Routing
problems:
- Maximum Independent Set
- Traveling Salesman Problem
- Maximum Cut
- Capacitated Vehicle Routing Problem
summary: CAM trains task-specific diffusion solvers with approximate terminal-to-trajectory
  flip signals; routing uses greedy/local-search teachers, and idealized adjoint theory
  is distinguished from the practical surrogate.
code_url: https://github.com/Shengyu-Feng/CAM
---

# Unsupervised Diffusion Solver for Combinatorial Optimization via Combinatorial Adjoint Matching

> **TL;DR:** Use terminal improvement signals to train intermediate discrete diffusion decisions. Graph energies provide local flip information; routing uses decoded/local-search-improved solutions as teachers. The practical method is an approximate trajectory-training rule, with separate models for each native task.

## Motivation

Supervised diffusion needs strong solution labels, while policy gradients and importance-weighted objectives can be unstable with limited sampling. CAM seeks to reuse one informative terminal evaluation across an entire sampled trajectory. Unsupervised means no near-optimal labels for its training loss; the objective and task-specific local search remain available, and supervised comparator labels are still generated (Sections1-2).

## Contributions

The paper formulates discrete generation as controlled continuous-time single-bit-flip Markov chains. It defines an exact discrete adjoint as a difference of cost-to-go values, derives its backward equation, and introduces a simplified lean-adjoint approximation to produce a tractable trajectory objective. Practical variants use analytical graph-energy signals or binary classification toward routing heuristic outputs. Experiments cover MIS, TSP, MaxCut and CVRP.

This is a specialist constructive/sampling framework, with separately trained task/dataset-specific models. ER-size transfer within MIS is demonstrated, but the shared training algorithm is not a neural checkpoint shared across MIS and routing. A graph GNN and a different edge-scoring routing GNN are used.

## Methodology

The ideal stochastic-control objective minimizes terminal surrogate cost plus temperature times a path-space KL. The surrogate must have global minimizers consistent with the constrained CO problem (Equation2). With a homogeneous base flip rate sigmoid(-lambda/temperature), sufficiently small **fixed positive** lambda, a unique closest minimizer and fixed time below1, Proposition3.1 characterizes low-temperature rates toward that minimizer. Proposition3.2 is an exact backward-Kolmogorov identity for cost-to-go differences. These idealized identities are distinct from learning the practical neural policy (Section3; AppendixA).

CAM simplifies the exact adjoint using counterfactual rate sharing, then transports a terminal bit-flip signal backward, changing its sign according to the parity between intermediate and terminal bits. AppendixA.4 explicitly identifies a terminal boundary layer and assumes consistency between local and global improvement directions. Discretization approximates integrated rates by independent Bernoulli flips. The actual experiments set lambda=0; they therefore do not directly instantiate the fixed-positive-lambda limiting theorem. Entropy and rate penalties are empirically secondary (Equations17-30).

For graph QUBO-like objectives, analytical local differences avoid separately evaluating every bit perturbation. For routing, decode the terminal edge scores and improve them with task heuristics, then label intermediate bits by whether they should flip toward that teacher. TSP uses greedy merging plus2-opt; CVRP uses score-guided Clarke-Wright savings and classical local search. Binary cross-entropy replaces the raw flip-gradient regression-style objective. This is self-generated heuristic supervision; its sample-dependent distance-to-teacher surrogate is not the same as a fixed global CO objective satisfying Equation2 (Section4.2).

## Experiments

MIS uses4000 training/1000 test RB graphs at200-300 or800-1200 nodes, and16,284 training ER graphs at700-800 nodes. ER tests have128 small or16 large9000-11000-node instances; the latter uses the small-ER trained model. Inference takes50 steps and20 runs, increased to200 steps for large ER. The graph GNN has64 hidden units and8 message-passing layers, or6 for large RB; timestep embeddings are omitted. TSP uses128,000/64,000 training instances for500/1000 cities and128 test cases, a12-layer256-dimensional anisotropic GNN,50 epochs and, in the printed protocol, four training trajectories with10 steps. Inference uses10 steps,16 independent samples and up to1000 iterations of2-opt (AppendixB.2).

All diffusion comparators are retrained under the paper's unified setup and share terminal post-processing/inference budgets; non-diffusion rows are taken from earlier sources. In particular, **SDDS means its forward-KL importance-sampling variant**, not the reverse-KL/PPO variant that was strongest on average in the original SDDS UCO study. Bernoulli/annealing noise variants are selected per dataset. The article does not establish that every original-method best configuration is reproduced (AppendixB.1).

Table1 shows CAM MIS sizes19.91/41.25 on small/large RB versus DiffUCO19.88/40.52. It remains below KaMIS20.10/43.15. On large ER it reaches384.38 versus KaMIS381.31 and DiffUCO373.31. Gaps there use CAM itself as the reference; zero is not an optimality certificate. Total large-ER runtime is5.53minutes versus KaMIS7.60hours under the reported setups. Classical/previously reported rows are not fully hardware-matched reruns.

TSP500 CAM length16.91/gap2.18% improves SDDS16.98/2.60%, but is worse than DIFUSCO16.85/1.81% and the adapted FMIP16.83/1.69%. TSP1000 CAM23.70/2.51% beats those neural diffusion rows, while LKH/Concorde reach23.12. CVRP100 CAM15.98/2.70% improves SDDS16.16/3.86% and FMIP16.04/3.08%, but slightly trails DIFUSCO15.97/2.63% and HGS15.56. TSP and CVRP runtimes include heuristic decoding/local search and multiple samples. MaxCut CAM2964.20 slightly exceeds SDDS2963.95 and MQLib2961.38; its zero gap again means best listed result, not a certified bound (Tables1-4).

Table5's TSP500 gap worsens2.18%→2.83% without adjoint propagation and to2.36% with only a greedy terminal teacher. Large-ER scaling curves favor CAM, and a TSP training curve is more stable than the chosen forward-KL SDDS configuration. These are empirical mechanism comparisons, not universal variance bounds or convergence proofs. Main result tables provide point estimates without uncertainty over training seeds; small gaps should be interpreted accordingly (Figures1-2).

## Limitations

The authors acknowledge idealized theory, surrogate gradients, handcrafted local search and possible local optima. Strong architectures matter, and extending native constraints requires corresponding representations/decoders. More inference steps, samples and routing heuristics consume real computation. Optional update-magnitude regularization and segmented trajectory objectives in AppendixC add feedback; the one-terminal-evaluation statement does not describe every explored variant. Learned models have no established approximation ratio or global optimality guarantee.

### Curator Analysis

**General QUBO formula.** For g(x)=x^T Qx, the exact binary flip difference is (1-2x_i)*((Q+Q^T)x)_i+Q_ii. Equation32 on PDF5 omits the final diagonal term. With Q=[-1] and x=0 its printed expression is0 while the true change is-1. The formula is valid for a zero-diagonal quadratic part with a separately included linear term. The released MIS code does use a zero-diagonal adjacency and a separate b=-1 linear term, so this printed general-form issue is not automatically an implementation error.

**Counterfactual rate sharing.** The statement before Equation17 on PDF4 is not implied solely by a unique closest minimizer at the current state. Let g(000)=g(111)=0 and g=1 elsewhere, x=100, i=2 and j=3. At x the unique closest minimum is000; at x^i=110 it is111. With lambda=.1 and fixed t=.3, the optimal j-flip rates tend respectively to0 and1/(1-t)=1.428571. Thus these rates cannot always be equated for the lean-adjoint simplification. A compatible additional condition is stability of the selected optimum across the counterfactual states; this is a curator condition, not an author theorem. This example limits that simplification, without denying the exact Proposition3.2, Proposition3.1's pointwise limiting rates or the reported empirical usefulness. AppendixA.4's separate local/global-consistency approximation also remains necessary.

## Reproducibility

- All20 pages of the [formal ICML2026 article](https://raw.githubusercontent.com/mlresearch/v306/main/assets/feng26o/feng26o.pdf) were read, including every reference, all proofs in AppendicesA.1-A.4, experimental AppendixB and scientific AppendixC. Eight key pages were visually inspected. Publisher metadata confirms three authors, PMLR306:30359-30378 and September29,2026; the PDF gives the two listed institutions.
- Publisher Related Material provides the complete PDF, OpenReview and Software, with no separate scientific supplement. Both OpenReview notes APIs for `y6LGSCnNOz` returned403. The official55-file tree has no additional PDF/ZIP; the integrated scientific appendix is complete. Data/checkpoints are separately linked on Hugging Face rather than included as neural weights in this tree.
- The [official implementation](https://github.com/Shengyu-Feng/CAM) was inspected at `1d3f4ae2806c742f3222af5f4e1d13454751b33d`. Complete README/requirements,85-line CAM solver,72-line MIS environment,36-line MaxCut environment,104-line MIS loader,226-line TSP environment and two launch scripts were read, plus shared solver lines268-389. MIS removes self-loops and retains the separate linear reward; routing labels come from decoded/refined tours. The TSP500 launch currently uses batch4 and eight training trajectories, versus printed batch8/four trajectories, and samples1024 training examples per epoch. These release defaults require reconciliation for exact reproduction. No code was changed and no neural experiment was rerun.
- `research/full-text-review/cam-diffusion-co/recompute_scope.py` executes only the two curator arithmetic checks above. Its exact finite-state SOC rates converge to0 and1.428571 as temperature decreases. Sixteen exact existing-paper references are recorded, including the renamed FrontierCO manuscript verified by the identical arXiv2505.16952 identifier; an old title does not imply a different cited work.
