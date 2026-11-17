---
id: unls-milp
short_title: UNLS-MILP
title: Unsupervised Neural Langevin Sampler for Mixed Integer Linear Programming
authors:
- Yixin Huang
- Shengyu Feng
- Yiming Yang
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/huang26j.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/huang26j.html
institutions:
- Carnegie Mellon University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: An unsupervised learned sampler edits complete binary candidates with LP continuous completion; downstream
  gains have raw feasibility/quality, finite-penalty Jensen and reference-budget limitations.
code_url: https://github.com/CindyH1103/UNLS4MILP
---

# Unsupervised Neural Langevin Sampler for Mixed Integer Linear Programming

> **TL;DR:** A learned sampler edits complete binary assignments, while exact LP subproblems complete continuous variables and supply energy/subgradient feedback. It is a useful warm-start generator with no label supervision, but raw feasibility/quality and the finite-penalty Jensen argument have explicit limitations.

## Motivation

Labeling MILPs is costly, and rounding joint discrete/continuous predictions may violate constraints. Separating binary search from continuous LP completion exploits problem structure: once discrete assignments are fixed, an LP evaluates feasible completions or a phase-I LP measures violation. The work learns transitions from these oracle signals instead of supervised solution labels (Sections1-4).

## Contributions

- A binary-variable sampler operates over a Benders-inspired continuous-value-function decomposition.
- Optimal dual LP solutions give subgradients with respect to integer assignments; slack-minimization LPs provide feedback on infeasible guesses.
- REINFORCE, a mean-assignment Erd?s surrogate with a curvature heuristic, and Gumbel-based training offer different bias/variance tradeoffs.
- Facility location, item placement and load balancing evaluate raw candidates, LP completion and classical downstream searches.

## Methodology

**LP oracle.** For min c^T x+d^T y subject to Ax+By>=b,y>=0, fixing binary x leaves value f(x)=max{(b?Ax)^T u:B^T u<=d,u>=0}. A finite optimum supplies subgradient?A^T u; the full objective has c?A^T u. This is an LP-value subgradient at nonsmooth basis changes, not universal smooth differentiation. The paragraph after Equation15 prints d in place of c; the dimensional interpretation follows the preceding formulation. The method uses the decomposition/oracle but does not solve an exact Benders integer master or maintain a certified global bound (Sections3.4/4.1-4.2).

If the completion is infeasible, phase-I min 1^T s subject to By+s>=b?Ax,y,s>=0 gives violation and a direction. The implemented training energy substitutes a finite large value, e.g.10^6, plus violation for infeasible assignments, while feasible assignments use their objective. This practical energy differs from the extended-valued LP objective that is +infinity outside its feasible projection (Section4.3).

**Neural transitions.** A coefficient-aware graph has integer-variable, continuous-variable and constraint node types but variable-constraint bipartite edges. Integer features include the current binary assignment; continuous variables encode their coefficients/bounds without predicted values. Repeated variable/constraint embeddings process multiple samples on one graph. The network predicts binary-flip logits; repeated proposals modify complete assignments, with an LP evaluating each candidate and the best evaluated candidate retained. IP uses a grouped one-hot/Gumbel construction to satisfy item-assignment equalities. This explicitly uses problem-specific structure rather than offering a universally constraint-free decoder (Section4.4/AppendixB.2-B.3).

**Learning and scope.** Each step minimizes expected next-state energy. REINFORCE uses sampled score-function gradients; Gumbel uses relaxed/hard differentiable sampling; the Erd?s loss evaluates the LP energy at the mean next assignment and adds a gradient-outer-product curvature surrogate. The latter is acknowledged not to give a strict upper bound. Training and evaluation use10-step trajectories, separate task models and50epochs. All tested discrete variables are binary; general integer extensions are future work. This is specialist improvement: the neural policy directly changes complete discrete candidates with LP continuous completion, including feasible candidates when encountered. The chain can traverse infeasible points and need not improve at every step; only the best evaluated record is retained (Section4.4/Limitations/AppendicesB,C/release).

## Experiments

**Protocol and quality references.** Two capacitated facility datasets have100/200facilities and customers, respectively; IP and LB come from the referenced benchmark pipeline. Each dataset has1000/100/100 train/validation/test instances. Gurobi3600-second runs provide reference labels/values; IP/LB references can be suboptimal, so negative gaps are possible. Training is unsupervised with respect to labels but repeatedly calls classical LP oracles. Metrics are objective, relative gap to reference, per-instance inference+downstream time and feasibility. CFLP objective means use feasible outputs only, so partial-feasibility baseline means have selection effects (Section5/AppendixB).

**Facility location.** Erd?s obtains100% reported feasibility and objectives18992.49/37981.29, gaps6.24/11.96%, in4.73/28.12s. Supervised SL+LP has better quality18731.74/35897.17, gaps4.78/5.82%, and DIFUSCO+LP is also better at3.50/8.87%. Gumbel/REINFORCE quality is substantially worse on these tasks. Gurobi is better in objective at17876.29/33922.88, taking7.44/31.91s. Not all neural baselines are faster: DIFUSCO+LP takes52.21s on the larger task and FMIP+LP47.79s. FMIP+LP feasibility is75/31.7%; raw FMIP and the tested DiffILO adaptations fail here. These are adapted-baseline outcomes under this implementation, not proofs that those methods cannot solve any MILP (Table1).

**Raw solutions and feasibility exceptions.** Without ND/PS/Apollo, IP objectives are481.39(Gumbel),483.14(Erd?s),499.29(REINFORCE), still roughly2613-2716% above the time-limited reference17.73. Other raw IP baselines have finite objectives too. On raw LB, Erd?s is NaN, which the paper defines as infeasible/0% feasibility; Gumbel872 and REINFORCE891 correspond to23.51/26.20% gaps. Thus blanket100% feasibility and only-this-method-feasible prose is not true across all reported settings. The LP is an integral repeated oracle/completion cost, even when expensive downstream MILP repair is omitted (Table2/Section5.2).

**Downstream searches.** ND400s, Predict-and-Search600s and Apollo800s substantially improve IP candidates: best UNLS objectives13.82/13.69/13.62 versus Gurobi17.73 at3600s. These are negative reference gaps, not certified-optimality improvements. On LB, Gumbel reaches706.10/705.90/705.90; FMIP is better for ND706.30 versus Erd?s711.92, while ties occur in PS/Apollo. Neural generation adds about1.84s(IP)/24.62s(LB) to the classical budget. Table2's DIFUSCO+ND IP15.41 versus17.73 implies?13.08%, although that cell prints+13.08%. Selected best-loss variants differ across tasks/columns (Table2).

**Ablations and cost.** On CFLP, the reported corrected Erd?s variant improves uncorrected gaps17.40/17.73% to6.94/12.01%, also beating the L2-style surrogate; these ablation values differ slightly from the main trained result and are kept as their own block. Warm-start comparisons with random and short-budget Gurobi favor UNLS downstream quality, but random LB search can terminate far earlier with worse quality, so quality/time dominance is not universal. Table5 lists per-epoch training40minutes/1.5hours/20minutes/1hour for the four datasets over50epochs on eight RTX A6000GPUs; this substantial offline/oracle cost is outside the quoted2-30second inference range (Tables3-5).

## Limitations

### Discussed in the Paper

Only binary discrete variables are tested. LP-basis changes make the value function nonsmooth. The Erd?s curvature correction is a heuristic without a strict target upper bound, and loss choice materially changes results. Infeasible integer guesses require separate phase-I feedback, while IP/LB quality benefits heavily from downstream classical search.

### Curator Notes

Theorem4.2's Jensen argument is valid for the convex extended LP value, or suitable all-feasible support, but not generally for the actual finite-offset energy in Section4.3. A concrete example has binary x, dummy y>=0, constraint?x>=0 and zero objective. The only feasible discrete point is0; phase-I violation for t>0 is t. With offset C>0, actual H(0)=0 and H(t)=C+t for t>0. A Bernoulli(.5) proposal yields H(E x)=C+.5 > E H(x)=(C+1)/2. This curator example limits application of the printed proof to the practical energy; it does not refute convexity of the extended-valued LP function or observed utility of the surrogate.

Finite penalties require objective-scale control to rank every feasible assignment ahead of infeasible ones. Neither exact conditional LP solves nor a10-step learned Langevin chain guarantees global optimality, stationarity of the desired Boltzmann distribution or a feasible final assignment. Repeated independent binary transitions can leave the feasible region. The recorded raw-LB failure and large IP gaps substantiate these boundaries.

The current release includes task-specific one-hot/IP handling, Bernoulli.8 LB initialization, Hamming-limited variants and multiple loss/oracle branches. Some inference paths hard-code CUDA devices5/6; training launch scripts default to four processes whereas the paper reports eight GPUs. These are concrete portability/configuration differences, not evidence that historical reported runs used those defaults. Baseline references, repeated LP calls and downstream budgets must all be included in matched comparisons.

## Reproducibility

- **Publication:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/huang26j.html), pages46553-46567; official HTML date September29,2026. Three CMU authors checked against PDF page1.
- **Scientific coverage:** all15 formal pages, complete bibliography, AppendicesA-C, theorem, native formulations, graph architecture, warm-start and training-cost tables read; key math/results rendered and inspected. Publisher lists PDF/OpenReview only; ordinary R3za7ajCwo API returned403. Full203387-byte author ZIP has no additional PDF/TeX/notebook scientific material. Official ICML2026 event64087 scientific poster PNG2,325,419bytes was fully read/inspected.
- **Implementation:** [CindyH1103/UNLS4MILP](https://github.com/CindyH1103/UNLS4MILP). README/environment, task scripts, complete-assignment sampling/best tracking, exact LP/phase-I branches, autograd subgradients, Erd?s correction and downstream entries inspected. External ML4CO/FrontierCO data, Gurobi/COPT environments and checkpoints require setup. No training or solver benchmark was rerun.
- **Relations:** ten explicit current-catalogue body/bibliography citations, including the actual regularized-Langevin predecessor, Erd?s/DIFUSCO/DiffUCO, FMIP, GCNN and classical-solver-control/primal frameworks. Duplicate DIFUSCO2023a/2023b bibliography entries map to one stable target.
