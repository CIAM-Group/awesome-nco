---
id: strcmp
short_title: STRCMP
title: 'STRCMP: Integrating Graph Structural Priors with Language Models for Combinatorial Optimization'
authors:
- Xijun Li
- Jiexiang Yang
- Jinghao Wang
- Bo Peng
- Jianguo Yao
- Haibing Guan
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/57f2d605790f01cc2d89699b0bf3b33e-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/57f2d605790f01cc2d89699b0bf3b33e-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Key Laboratory of Scalable Computing and Systems
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
- Satisfiability
problems:
- Mixed-Integer Linear Programming
- Boolean Satisfiability
summary: Domain-specific graph-conditioned language models discover solver heuristics through supervised/preference
  post-training and evolutionary evaluation; SAT and MILP use separate composites.
code_url: https://github.com/Y-Palver/L2O-STRCMP
figure:
  path: paper-assets/strcmp/framework.png
  alt: Original STRCMP Figure2 showing graph embedding, solver-evaluated data curation, SFT/DPO and evolutionary
    code refinement.
  caption: 'Figure2: original STRCMP composite-model and code-discovery framework.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/57f2d605790f01cc2d89699b0bf3b33e-Paper-Conference.pdf#page=4
---

# STRCMP: Integrating Graph Structural Priors with Language Models for Combinatorial Optimization

> **TL;DR:** STRCMP conditions a code-generating LLM on graph embeddings, then searches for solver heuristics through evolutionary evaluation. Separate SAT and MILP models support EasySAT heuristic optimization and SCIP cut selection. Results depend strongly on the post-training variant; the full SFT+DPO model does not dominate all alternatives, and several printed SAT metric specifications need reconciliation.

## Motivation

Text-only code generation can miss structural distinctions that matter to optimization heuristics. STRCMP learns graph representations of problem classes and supplies them alongside natural-language solver specifications. Its output is executable heuristic code, evaluated inside an existing solver; it is not a direct prediction of the complete combinatorial solution. [pp. 1–5]

## Contributions

- A GNN/LLM composite architecture combines problem-structure embeddings with textual code-generation prompts.
- Solver-evaluated candidate code supplies supervised and preference-training data for SFT and DPO.
- An evolutionary algorithm refines generated heuristics, with ablations on structural conditioning, training strategy and LLM size. An information-theoretic argument describes an ideal conditional-performance bound. [pp. 4–10, 22–26, 36–44]

## Methodology

SAT and MILP use **separate** GNNs and adapted language models. The GNN classifies source problem families using three graph-convolution layers and global mean pooling. The formal SAT widths are16/32/64; MILP uses final width128. Frozen structural embeddings are zero-padded to the language model's hidden width and inserted after its first token, with an added attention-mask position. Qwen2.5-Coder-7B-Instruct supplies the default language backbone. [pp. 5, 7–8, 23–26]

For each prompt, multiple sampled code snippets are executed in the target solver and ranked. SFT imitates the highest-scoring snippet; DPO uses preferred/dispreferred pairs. The formal post-training corpus has8,000 MILP and4,000 SAT examples. LoRA adapts query/value projections with rank16, alpha32 and dropout0.05; other LLM weights and the pretrained GNN remain frozen in the standard two-stage procedure. The paper trains GNNs for3 SAT/4 MILP epochs and the adapted LLM for3 epochs per domain. [pp. 8, 24–26]

The composite model then participates in selection/crossover/mutation of code candidates. Solver execution supplies fitness, and the identified code is evaluated on held-out instances. The MILP task selects cuts through13 numerical cut features inside SCIP8.0.0, retaining presolve and ordinary heuristics. SAT uses EasySAT, with example modifications to variable-activity updates. The LLM4Solver baseline is adapted from its original diving task to cut selection. [pp. 7, 26–29, 41–44]

**Classification:** Specialist / constructive, as solver-assisted algorithm generation. The method trains separate SAT/MILP composites and discovers target-specific heuristic programs. A common code-generation architecture or base LLM does not establish a shared deployed neural optimization policy across the native problems. Evolution improves **code**, rather than having a neural operator edit an incumbent combinatorial solution. Classical solver search supplies the final solution; this label does not imply one-shot neural decoding. [pp. 4–8, 24–28, 41–44]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Actual benchmark coverage | Six MILP families and four SAT datasets in the detailed experimental tables |
| Easy MILP | Set covering500×1,000, MIS500 nodes, multiple knapsack60 items/12 knapsacks;1,000 train and100 test instances per family;60-second limit |
| Medium/hard MILP | MIK/CORLAT use80/20 train/test and120-second limits; load balancing uses80/20 and360 seconds |
| SAT datasets | CNP, CoinsGrid, PRP and Zamkeller; Table3 lists150/78/80/80 instances |
| Solver metrics | MILP solving time and primal-dual integral; SAT timeouts, runtime and PAR-2, with protocol inconsistencies discussed below |
| Hardware | Two H80080GB GPUs and dual AMD EPYC9534 64-core CPUs |
| Generation | Top-k20, top-p0.8, repetition penalty1; solver-evaluated evolutionary search follows post-training |

- **SAT timeout counts:** Full STRCMP gives31/17/44/5 on CNP/CoinsGrid/PRP/Zamkeller, versus AutoSAT32/16/9/18. It improves CNP/Zamkeller but worsens CoinsGrid and substantially worsens PRP. The headline PRP9→3 result comes from **DPO-only**, while Zamkeller18→4 comes from **SFT-only**. They are not both results of the full model. [p. 8]
- **SAT quality/time tradeoffs:** Table5 reports full-model PAR-2 values624.15/1,124.09/1,804.46/270.62, versus AutoSAT644.72/1,098.69/639.34/807.75. Reported PRP runtime is46,223 versus22,967 for AutoSAT; DPO-only achieves21,146. Zamkeller runtime is7,990 for the full model and6,929 for SFT-only versus20,772. These are source-reported values with the metric qualifications below. [p. 31]
- **MILP:** Radar plots compare six families and show competitive performance against SCIP, L2B, HEM and adapted LLM4Solver. Raw search-stage tables preserve specialization tradeoffs: CORLAT at iteration9 gives full-model PD integral8,836.85 versus SFT-only7,364.47; load balancing at iteration15 gives1,859.14 versus LLM4Solver1,867.71 and SFT-only2,051.36. These cells belong to their stated iteration protocols, not a universal final-test improvement percentage. [pp. 8, 33, 37–38]
- **Training strategy:** Two-stage versus jointly trained SAT PAR-2 is270.62 versus751.34 on Zamkeller and1,804.46 versus2,092.71 on PRP. The authors report unstable joint training and acknowledge that full SFT+DPO can underperform either stage alone. Their difficulty-based recommendations are empirical heuristics, not a theorem selecting the best training method for arbitrary tasks. [pp. 9–10, 30, 36–39]
- **Backbone ablations:** Llama2 and Qwen2 0.5B/1.5B fail to produce viable code in the tested setup. Increasing Qwen2 from7B to14B helps MIK, but structural conditioning is not uniformly beneficial: set-cover14B PD integral34.29 is worse than34.24 without GNN. These Qwen2 experiments are distinct from the default Qwen2.5-Coder model. [pp. 10, 40]

## Limitations

### Reported by the Authors

- Joint GNN/LLM training is difficult; SFT/DPO distributional conflicts remain unresolved. Generated code becomes harder to inspect as problem complexity increases, and humans still define target components and prompt interfaces. Additional structural/modal priors are future work. [pp. 9–10, 30, 38–40]

### Curator Notes

- **Benchmark count:** The abstract says nine datasets, the main introduction to settings says ten while listing seven MILP families, and the actual detailed data/results show six MILP plus four SAT datasets. “Anonymous” appears in the broad listing but lacks a corresponding detailed benchmark/result entry. This note uses the ten explicitly evaluated sets.
- **SAT metric consistency:** The stated timeout is5,000 seconds and Eq.21 averages PAR-2 with penalty2τ. Taking all150 CNP instances from Table3,31 timeouts alone contribute at least31×10,000/150=2,066.67, already above Table5's624.15. Smaller held-out subsets cannot fix that lower bound. Analogous contradictions occur on the other three datasets. The runtime/timeout/average-score tables therefore require an unreported threshold, denominator or other protocol clarification; source values are preserved rather than silently repaired.
- **NeuroSAT comparison:** Appendix C defines its “timeouts” as total instances minus correct binary predictions on the solver-labeled subset. That is a prediction-coverage proxy, rather than measured timeout of a certificate-producing SAT solver. It should not be read as a like-for-like solver-runtime comparison.
- **Theory and correctness:** Theorem1's conditioning/maximization argument concerns an ideal performance upper bound under true conditional distributions. Theorem2 assumes a performance-enhancing prior. Neither guarantees that a finite trained GNN/LLM improves every task, generates valid code or preserves logical semantics. Optimality certificates come from successful classical solver execution, not from language-model training itself.
- **Release representation:** The SAT `build_vcg` helper merges literals by absolute variable index and discards polarity. Its graphs for `(x1)∧(¬x1)` and `(x1)∧(x1)` are identical despite opposite satisfiability. A direct isolated execution confirmed this collision. It limits the release's claimed one-to-one structural encoding; the original formula still goes to the solver, so this does not establish incorrect solver answers. The feature helper also offers per-folder averaging, rather than exclusively per-instance conditioning.
- **Compute and uncertainty:** Fewer evolutionary iterations do not by themselves establish lower total wall time after code-data curation, GNN training, LLM post-training and solver evaluation. Figure12 shows variability but does not clearly specify repeat count or whether bands are standard deviations/errors/confidence intervals. No universal significance or end-to-end speedup is inferred.

## Reproducibility

- **Published source:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/57f2d605790f01cc2d89699b0bf3b33e-Abstract-Conference.html), formally issued2026-04-23. All44 pages, complete55-entry bibliography, full checklist, AppendicesA–L, both proofs,19 tables,12 figures and complete example prompts/code were freshly read.
- **Scientific companion:** The entire official3,456×2,304 poster was read in three overlapping tiles. The publisher/event expose no separate scientific supplement/slides. The author repository's full29-entry tree/30-member ZIP and pinned AutoSAT submodule's122-entry tree were inventoried; all six READMEs across them were read, with no extra scientific PDF/notebook/archive. The repository framework diagram was visually checked against formal Figure2.
- **Implementation:** [L2O-STRCMP](https://github.com/Y-Palver/L2O-STRCMP), master commitda1a9c8d576237a7844c0aba33683423987df65a. It provides GCN/feature extraction, hybrid forwarding/generation and SFT/DPO trainers, plus an AutoSAT submodule. The `data` entry is a six-byte path placeholder rather than a released training dataset; the documented MILP evaluation points to external LLM4Solver. No released task checkpoint or complete standalone MILP reproduction is established by this tree.
- **Verification scope:** Key GCN/feature and generation code, training entry points and examples were inspected. The CNF collision and printed-table lower bounds were reproduced with a small static script; no GNN/LLM training or benchmark solver rerun was performed. The framework image is original formal Figure2 with its complete caption.
