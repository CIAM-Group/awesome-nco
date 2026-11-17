---
id: efficient-trial-error
short_title: Trial-and-Error Transformer
title: Teaching Transformers to Solve Combinatorial Problems through Efficient Trial & Error
authors:
- Panagiotis Giannoulis
- Yorgos Pantis
- Christos Tzamos
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/c1a2da8d493d37e9e65ebfb23018e234-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/c1a2da8d493d37e9e65ebfb23018e234-Abstract-Conference.html
institutions:
- National Technical University of Athens
- National and Kapodistrian University of Athens
- Archimedes, Athena Research Center
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Constraint Satisfaction
problems:
- Sudoku
- 1-in-3 Satisfiability
summary: Task-specific Transformers construct partial assignments with learned DFS/backtracking; Sudoku depth-one
  restart optimization uses a success-mass loss, with a separate1-in-3SAT experiment.
code_url: https://github.com/gpt-reasoning/ReasoningCombinatorials
figure:
  path: paper-assets/efficient-trial-error/framework.png
  alt: Original Figure2 with multi-target Sudoku teacher transcripts, deduction, guess-level, dead-end and backtracking
    tokens.
  caption: 'Figure2: original multi-target DFS training transcript and backtracking tokens.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/c1a2da8d493d37e9e65ebfb23018e234-Paper-Conference.pdf#page=6
---

# Teaching Transformers to Solve Combinatorial Problems through Efficient Trial & Error

> **TL;DR:** Task-specific GPT-2-style models learn rule application, guesses and backtracking from solver-generated transcripts. Sudoku imitation reaches98.9% whole-board accuracy on the stated random test; a separate depth-one restart formulation reports99.8%. A separate planted1-in-3SAT experiment reaches99.10%. The framework is reusable across problems, but the paper does not demonstrate one shared cross-problem checkpoint or a general efficient NP solver.

## Motivation

Imitating human-style deductions alone leaves puzzles that need guessing unsolved. The work teaches a Transformer to emit both deductions and a search trace, then studies how to concentrate guess probability on choices that let simple rules finish a puzzle. An efficient verifier and problem-specific transcript generator provide supervision. TSP and clique detection motivate the framework; they are not evaluated native tasks here. [pp.1–6,32–33]

## Contributions

- Compact action tokens and multiple valid next-token targets teach rules and explicit depth-first guessing/backtracking.
- A depth-one, independent-restart policy uses successful backdoor guesses and a success-mass loss; analysis connects the ideal objective to Min-Sum Set Cover.
- SudokuPy and transcript-generation libraries support streamed training; experiments include Sudoku and a separate1-in-3SAT model. [pp.4–10,28–33]

## Methodology

**Imitation model.** The42M-parameter GPT-2-style network has8 layers,8 attention heads, embedding width576 and feed-forward width3,456. It is trained for these tasks rather than prompted as a general pretrained language model. A Sudoku action is one token encoding(row,column,value), instead of three separate tokens. Special tokens mark start, rules exhausted, guess depth, dead end and completion. The teacher applies lone-single/hidden-single deductions, guesses when they stop, and backtracks after contradictions. Multi-target supervision sums negative log probabilities over valid next actions; the release averages selected log probabilities across the batch. [pp.4–7,27]

At inference the DFS model predicts the transcript autoregressively, including dead-end and guess-level tokens. A dead end returns to the latest guess and tries another value for that cell. The final board takes each cell's **last assigned value** in the transcript. The checked DFS evaluator greedily generates tokens and compares the reconstructed board with the reference; it does not call the C teacher/verifier to approve every generated token. Solver/verifier use for teacher generation and evaluation should therefore be distinguished from external function calling during neural generation. The released Sudoku loop caps the generated sequence at approximately500 tokens. [pp.6–7,32; release DFS evaluation]

**Beyond imitation.** After deterministic deductions, a single backdoor guess should allow simple rules to complete the board. Each failed trial restarts from the same state without remembering previous choices. This is depth-one search with potentially **multiple attempts**, not a promise that the first guess succeeds. Let S be successful backdoors and P=∑ᵢ∈S pᵢ. Independent sampling has expected trials1/P when P>0. The paper compares this reciprocal objective with the multi-target loss−∑ᵢ∈S log pᵢ. For numerical stability it actually trains **−log P**, implemented by a log-sum-exp difference. [pp.8–10,29–30]

The beyond-imitation variant also has a task-specific **81-token scratchpad**: fixed cell positions receive solution-value supervision, and the guess token and scratchpad use a local full-attention window. During the described generation, this window is temporarily appended for the guess forward pass and then removed. Thus the imitation backbone is a standard causal Transformer, while the second variant is not an entirely unchanged causal attention mask. [p.28]

**Theory.** AppendixE proves that the best independent identically distributed choice policy costs at most the harmonic factor Hₙ times a fixed permutation policy under the stated hidden-set/unit-test-cost model. Convexity holds in the probability simplex for the raw expected reciprocal objective; it does not establish global optimization of a Transformer. The contextual discussion explicitly acknowledges nonconvex neural optimization. Positive success mass gives eventual success for instances with a backdoor under this model, not polynomial runtime for arbitrary NP problems or guaranteed success on finite-budget neural traces. [pp.28–31]

**Classification:** Specialist / constructive. Sudoku and1-in-3SAT have distinct training pipelines, vocabularies and models. Reusing a framework is not evidence of shared solver weights. Backtracking revises a **partial assignment** before completion, rather than learning an operator that improves complete incumbents, so the previous improvement label is replaced. [pp.6–10,32–33; separate released models]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Sudoku generation | Uniform completed board, then randomly ordered clue removal subject to uniqueness |
| Random evaluation |100,000 held-out generated puzzles |
| Kaggle evaluation |Unfiltered3M-puzzle source, with100K sampled for the stated protocol; filtered source contains1.9M rule-solvable puzzles |
| RRN data |180K training/18K test;17–34 givens |
| Training |3M steps, batch32, AdamW, peak10⁻⁴,5 warm-up steps and linear decay |
| Compute |Single NVIDIA A10G, approximately168GPU hours for the described model training |
| SAT setting |Planted satisfiable1-in-3SAT,25 variables and15 clauses; distinct variables within each initially sampled clause |

**Sudoku imitation, whole-board accuracy:**

| Test set | Trial-and-Error | Relevant comparison |
| --- | --- | --- |
| Random |98.90%|Random-retrained RRN92.40%, Recurrent Transformer92.60% |
| Kaggle unfiltered |98.90%|Causal Transformer67.16%, masked diffusion74.97% |
| Kaggle filtered |99.50%|Random-retrained Recurrent Transformer99.30% |
| RRN |99.40%|RRN-trained Recurrent Transformer99.50% |

Table2's Causal Transformer67.16% and masked-diffusion74.97% **Random** entries are approximations copied from unfiltered-Kaggle performance, as the table footnote states. They are not fresh measurements on the generated Random test. The method improves the shown broad-distribution comparisons but does not beat every model on every dataset. [pp.7–8,27]

- **Beyond imitation:** The paper reports99.8% on generated Sudoku and attributes the remaining limitation to puzzles without a depth-one backdoor under its simple rules. Figure6 reports median guess quantities1.5 for the reciprocal-inspired loss,2.2 for multi-target CE and2.3 for the correct-value oracle baseline. These are conditional on the specified generator, rules and restart model. The release's plotting helper records inverse **success probability**, with an epsilon and probability floor0.001, rather than recording actual sampled full-trajectory trial counts. Treat it as an expected-trial proxy. [pp.8–10; release evaluation]
- **1-in-3SAT:** AppendixG reports99.10% clause-valid assignments for N=25,M=15. A planted assignment ensures satisfiability, but uniqueness is not required. Teacher propagation uses positive-literal, negative-literal substitution and repeated-variable rules. Evaluation checks exactly one true literal per clause after taking each variable's last assignment. No UNSAT detection, large-variable scaling or shared Sudoku/SAT checkpoint is established. [pp.32–33]
- **Frontier-model comparison:** For each of three input formats, GPT-4o/Gemini-1.5Pro are tested on1,000 puzzles and three reasoning models on only10. They achieve0 whole-board accuracy in that protocol. The prompts explicitly forbid external code and **simulated backtracking** while requesting logical strategies; this differs from training the proposed model to backtrack. These small, constrained comparisons do not establish that all current general models cannot solve Sudoku. [pp.24–27]

## Limitations

### Discussed in the Paper

The optimized policy is limited to depth-one guesses and independent restarts. Multilevel randomized search and appropriate objectives remain future work. Neural contextual policies are nonconvex, with no global optimum guarantee. [pp.10,30–31]

### Curator Notes

- **Training objective versus theorem:** Minimizing log(1/P) per example is not generally equivalent to minimizing expected1/P across a distribution with shared parameters. A two-choice example with successful sets{1}/{2} occurring with probabilities0.9/0.1 gives optimal first-choice mass0.75 for expected trials(1.6), but0.9 for expected log loss(expected trials2.0). This directly computed example qualifies transfer of AppendixE's raw-objective guarantee to the implemented log loss; it does not invalidate the harmonic theorem or reproduce a learned model's behavior.
- **Generator distribution:** Uniform completed boards followed by uniqueness-preserving random deletion do not by themselves prove uniform sampling over all minimal puzzles. Similar learning curves across datasets are not such a proof. The checked training datasets additionally reject rule-only instances until a guess is required, changing the training distribution.
- **Evaluation scope:** Section3.2 specifies100K sampled unfiltered Kaggle puzzles, while nearby prose says accuracy on all3M; keep the explicit sampled protocol and do not silently treat this as an exhaustive3M evaluation. The99.8% result concerns this generator and rules, not all Sudoku or arbitrary NP instances.
- **Release coverage:** The one-level notebook implements the log loss and scratchpad supervision; its evaluation module exposes target-based success-probability histograms rather than a complete free-running restart decoder. The archive does not include pretrained weights or a single turnkey script reproducing all published tables. Independently solving the published benchmarks was not performed here.

## Reproducibility

- **Published source:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/c1a2da8d493d37e9e65ebfb23018e234-Abstract-Conference.html), publisher date2026-04-23, with venue year2025 retained. All33 formal pages, all references, checklist, AppendicesA–G, eight tables and eight figures were read; every scientific figure/table was also visually checked.
- **Scientific companions:** All11 [official slides](https://neurips.cc/media/neurips-2025/Slides/118478_UDeFOZj.pdf), the complete official poster and the author's one-page poster PDF were read. Author-hosted slides are byte-identical to the official copy and are not counted twice. Complete77-member main-code and33-member generator ZIPs expose no additional scientific PDF; the three training notebooks contain2/2/5 cells, and the generator example has one cell, all inspected.
- **Implementation:** [Author code](https://github.com/gpt-reasoning/ReasoningCombinatorials), inspected tree9d2a4885d56b3144915a5c3290ee0cc1c5a0e71a; [SudokuPy](https://github.com/gpt-reasoning/sudokupy), tree2f1642a0eb6dd395f588b7a1d88c4c192209fc84. README files, separate DFS evaluators/optimizers, all training cells, one-level model/attention/data/loss/evaluation and generator example were checked. Code and data inventories are evidence of release contents, not a rerun of the reported metrics.
- **Figure:** Original formal Figure2, showing multi-target teacher transcripts and backtracking tokens, is displayed with its original caption.
