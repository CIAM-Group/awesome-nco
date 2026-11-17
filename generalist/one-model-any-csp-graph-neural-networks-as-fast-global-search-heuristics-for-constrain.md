---
id: one-model-any-csp-graph-neural-networks-as-fast-global-search-heuristics-for-constrain
short_title: ANYCSP
title: 'One Model, Any CSP: Graph Neural Networks as Fast Global Search Heuristics for Constraint Satisfaction'
authors:
- Jan Tönshoff
- Berke Kisin
- Jakob Lindner
- Martin Grohe
year: 2023
date: '2022-08-22'
publication:
  date: 2023-08
  source_url: https://ijcai.org/proceedings/2023/476
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2023/476
institutions:
- RWTH Aachen University
scope: generalist
paper_type: solver
paradigm: improvement
problem_families:
- Constraint Satisfaction
- Graph Optimization
problems:
- Constraint Satisfaction
- Graph Coloring
- Boolean Satisfiability
- Max-k-SAT
- Max-Cut
summary: A recurrent constraint-value GNN resamples complete CSP assignments with REINFORCE-trained global search;
  cross-evaluation shows the same RB/coloring policies transfer to coloring/SAT, while main task-specific models
  and failed Max-Cut transfer limit universality claims.
arxiv_url: https://arxiv.org/abs/2208.10227
code_url: https://github.com/toenshoff/ANYCSP
figure:
  path: paper-assets/one-model-any-csp-graph-neural-networks-as-fast-global-search-heuristics-for-constrain/framework.png
  alt: ANYCSP repeatedly maps a constraint-value graph and recurrent states to a soft assignment, samples a new
    complete assignment and relabels the graph for the next step.
  caption: 'Original Figure 2: recurrent global search over complete CSP assignments.'
  source_url: https://ijcai.org/proceedings/2023/0476.pdf#page=4
---

# One Model, Any CSP: Graph Neural Networks as Fast Global Search Heuristics for Constraint Satisfaction

> **TL;DR:** ANYCSP searches over complete CSP assignments with a recurrent GNN that can change every variable in parallel. A shared trained RB policy also solves coloring and SAT instances in the cross-comparison. The main results nevertheless use separate task-trained models; the Max-Cut model transfers poorly, so “any CSP” describes a generic architecture rather than one universally strongest checkpoint.

## Motivation

Many neural combinatorial solvers use problem-specific graph encodings or modify only one/few variables per expensive GNN call. ANYCSP seeks a common constraint-satisfaction representation and uses global assignment changes to exploit GPU parallelism. It addresses both finding a satisfying assignment and maximizing the number of satisfied constraints. Failure to find a satisfying assignment does not provide an unsatisfiability certificate. [formal pp. 1–4]

## Contributions

- A tripartite constraint-value graph handles finite variable domains and variable constraint arities with common trainable functions.
- A recurrent global-search policy independently samples a value for every variable at each iteration.
- Best-so-far improvement rewards train a REINFORCE policy without a critic or reward baseline.
- Experiments cover Model RB, coloring, 3-SAT, Max-k-SAT and Max-Cut, with cross-problem model comparisons and global/local/reward ablations. [formal pp. 1–7; arXiv Appendices A–C]

## Methodology

The graph has variable, variable-value and constraint vertices. Each value connects to its variable and to relevant constraints. A binary value label records the current assignment. A constraint-value edge label indicates whether switching **that one variable** to the value would satisfy the constraint while others retain their current assignments. Labels are recomputed after each sampled assignment, providing a compact, state-dependent view of relation semantics. They do not make arbitrary implicit constraints free to evaluate. [formal pp. 2–3; arXiv pp. 12–13]

Each iteration passes messages value→constraint→value→variable→value. Value nodes maintain 128-dimensional GRU states; constraints and variables have no recurrent state. MLPs, LayerNorm and residual connections combine messages. Per-variable softmax distributions sample all variables independently, allowing a complete reassignment in one step. The environment checks its quality and relabels the graph. Unlike constructive partial-assignment decoding, intermediate assignments may violate constraints, and the current assignment can worsen while the best observed quality is retained. [formal pp. 3–4; arXiv pp. 10–15, Algorithms 1–2]

Quality is the fraction of satisfied constraints. Reward is the positive increase over the previous best, and is zero for all non-record steps, including worsening moves. **Undiscounted** rewards telescope to the improvement in the best observed quality over initialization. Training instead uses discounted returns, typically with lambda=0.75, which also favors earlier gains; the telescoping identity should not be rewritten as a guarantee for that discounted policy objective. Training uses a REINFORCE-style log-probability surrogate, one trajectory per instance and no critic. No optimal-policy, approximation-ratio or general convergence guarantee is established. [formal pp. 4–5; arXiv pp. 11, 14–15]

For explicit extension constraints, relabeling uses allowed/forbidden tuples and parallel scatter operations. SAT benefits from a single forbidden tuple per clause. The implementation also supports linear inequalities and all-different constraints, which are described separately from the main benchmark results. The message-passing memory analysis includes constraint-edge count and domain size; it is not a polynomial-size representation theorem for every arbitrarily specified relation. Random assignment feedback breaks deterministic graph symmetries; Appendix A.6 discusses this using prior randomized-GNN results rather than proving universal optimal CSP solving. [arXiv pp. 12–13]

**Classification: Generalist / improvement, with bounded shared-model evidence.** Appendix B.6/Table 6 evaluates unchanged trained policies across native problems. The RB-trained policy solves **42 RB50 / 50 low-coloring / 98 SATLIB-250** instances; the coloring-trained policy solves **15 / 50 / 96**, respectively. These are actual cross-problem policy evaluations, not merely common architecture. However, the five headline benchmark models are trained separately, and the Max-Cut-trained model solves zero of the displayed RB/coloring/SAT decision sets. The neural operation repeatedly changes a complete candidate assignment, so it is global improvement search with nonmonotonic current states. [formal p. 5; arXiv pp. 17–18]

## Experiments

Each task-specific model trains for **500,000 steps × batch 25**, totaling 12.5 million on-the-fly sampled instances, with **40 search iterations per training instance**. Hyperparameter candidates first train for 100,000 steps; selected configurations receive full training. Validation uses 200 fixed instances and 200 search iterations, often on larger instances than training. Adam starts at 5×10^-6 and decays to 5×10^-7. Training takes approximately 24–48 hours per model. All neural methods use an A6000 48 GB; classical methods use a Xeon Platinum 8160/64 GB RAM. Different hardware and stopping protocols must remain explicit. [formal p. 5; arXiv pp. 11–12]

**Model RB:** Training uses 30-variable, binary-arity random CSPs. On 50 satisfiable structured RB benchmarks with 50 variables, one run per instance and a 20-minute limit, ANYCSP solves **42**, versus CoSoCo's **34**. Long test searches can exceed 500,000 iterations despite training on 40-step trajectories. The main text says 23 domain values, while the older appendix says 22; the named benchmark is Random-RB-2-50-23f, and this version discrepancy is not silently resolved by guessing. [formal pp. 5–6; arXiv p. 16]

**Coloring:** Training mixes three random graph distributions with 50 vertices and 3–10 colors. Tests use 100 structured graphs, divided into two groups of 50, under 20-minute limits. ANYCSP and HybridEA both solve **50 low-color / 40 high-color** instances, including a 73-color graph. This is not a strict win over HybridEA, and the detailed appendix includes instances/timings where classical methods are faster or succeed when ANYCSP fails. Classical coloring heuristics can also search over color counts, whereas ANYCSP is given the target count. [formal pp. 5–6; arXiv pp. 16–17, 20–21]

**Max-Cut:** Training uses 100-vertex unweighted Erdős–Rényi graphs; evaluation covers the unweighted Gset graphs with 800–10,000 vertices. Neural methods use **20 parallel runs and 180 seconds**; SDP receives up to three hours and is restricted to graphs of at most 1,000 vertices. Reported values are **absolute deviations from best-known cut sizes**, not percentage gaps or proof of optimality. ANYCSP's group means are 1.22, 2.44, 13.11 and 51.63, below the compared neural baselines. Individual exceptions remain: ECORD has lower deviations on graphs such as G2, G5 and G45. The comparison is not an exhaustive claim against all classical Max-Cut heuristics. [formal p. 6; arXiv pp. 17, 19]

**3-SAT:** Models train on 100-variable random formulas and test on 100 satisfiable SATLIB formulas per size. Stochastic methods receive **ten attempts × 10,000 steps**; deterministic PDP runs once. ANYCSP solves 100/100/100/97/99 for 50/100/150/200/250 variables. This is a step-budget comparison, not matched wall-clock inference. The formal article explicitly states that ANYCSP cannot currently compete with CDCL solvers on structured decision SAT. [formal pp. 6–7; arXiv p. 17]

**Max-k-SAT:** Training mixes arities three/four with 100 variables; testing uses 50 instances each of arity three/four/five with 10,000 variables and a 20-minute limit. Five-literal clauses are absent from training/validation. Formal Table 4 reports mean unsatisfied-clause counts **1537.46 / 1126.44 / 1105.62**. The arXiv v1 main/ablation tables instead report **1103.14** for arity five; this note uses the formal value for the headline result and labels the older appendix separately. Roughly 1,000 times fewer search steps than classical methods means more work per global step, not a 1,000-fold wall-clock speedup. [formal p. 7; arXiv pp. 7, 17, 23]

Appendix C retrains single-variable local-search and current-quality-reward variants. Coloring results are 86/100 solved for the local variant, 62/100 for the quality-reward variant and 90/100 for full ANYCSP. Both variants also have worse reported Max-Cut and Max-k-SAT results. These ablations support the two design choices on these datasets without proving that global actions or one reward are always preferable. [arXiv pp. 22–23]

## Limitations

The shared policies' transfer varies sharply with training distribution and aggregation. MAX aggregation supports the reported decision-task transfer; the SUM Max-Cut policy specializes strongly. Weighted/partial CSPs are future work, and broad industrial structured-SAT superiority is expressly unsupported. The benchmark budgets differ by task, several experiments use one run, and systematic training-seed uncertainty is not provided. [formal pp. 5–7; arXiv p. 18]

GPU memory grows with domain sizes, relation processing and graph density. Arbitrary finite CSP input compatibility does not remove the cost of evaluating constraints or guarantee finding a satisfying assignment. The older appendix and formal article contain specific numerical/domain-description differences, which limit exact cross-version result matching. Historical model files are not included in the inspected current code/data snapshots, so the published cross-transfer results were read, not independently executed. [arXiv pp. 12–13, 16–23]

## Reproducibility

The formal publication is IJCAI 2023 Main Track, pp. 4280–4288, DOI 10.24963/ijcai.2023/476. Publisher BibTeX gives **August 2023**, retaining month precision. The four authors are at RWTH Aachen. The distinct arXiv v1 submission is **2022-08-22**, the only version in saved primary history. All **nine formal pages and 23 arXiv pages** were read, including both complete reference lists, Appendices A.1–A.6/B.1–B.6/C, all 100 detailed coloring rows and all 35 detailed Gset rows. Formal values take precedence where the older reading copy differs.

The official repository is pinned to **d57a72b506014fc4f1b69b2a52eebffc9a8bbd07**, committed 2023-12-07. All 53 ZIP members/40 files were inventoried; none is an additional scientific PDF/archive or trained checkpoint. The README, per-task configuration/scripts, global-assignment update and best-quality/reward-loss paths were inspected. Python 3.10 and PyTorch/CUDA11.7 installation instructions are supplied. Current scripts use separate task model directories, consistent with the main experimental separation.

The author-linked **320,823,765-byte data ZIP** was obtained and all 2,090 members inventoried: 1,150 CNF, 750 XML, 100 coloring and 35 matrix files plus directories, with no scientific PDF, video or nested archive. This is an inventory of supplied validation/test data, not a claim of manually reading or rerunning every instance. The complete arXiv copy includes every scientific appendix explicitly referenced by the formal article; no required scientific supplement remains missing. All key figures, tables, equations and algorithms were rendered and inspected. Original formal Figure 2 is included. No model training, checkpoint execution or solver benchmark reproduction was performed.
