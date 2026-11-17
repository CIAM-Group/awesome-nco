---
id: consformer
short_title: ConsFormer
title: Self-Supervised Transformers as Iterative Solution Improvers for Constraint Satisfaction
authors:
- Yudong W. Xu
- Wenhao Li
- Scott Sanner
- Elias B. Khalil
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/xu25q.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/xu25q.html
institutions:
- University of Toronto
- Vector Institute
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Constraint Satisfaction
problems:
- Sudoku
- Graph Coloring
- Nurse Rostering
- Maximum Cut
summary: Separately trained self-supervised Transformers iteratively edit CSP candidates; within-task transfer,
  negative classical/ANYCSP comparisons, soft-loss feasibility limits and fixed constraint structure are distinguished.
code_url: https://github.com/khalil-research/ConsFormer
---

# Self-Supervised Transformers as Iterative Solution Improvers for Constraint Satisfaction

> **TL;DR:** A separately trained Transformer per task learns one-step constraint-driven refinement, then repeatedly edits complete assignments. Additional inference improves several Sudoku/coloring results, but is not a completeness guarantee; classical coloring solvers and ANYCSP remain stronger on important comparisons.

## Motivation

Feasible CSP labels can be expensive and ambiguous when many solutions exist. RL adds multi-step optimization and reward design. ConsFormer instead differentiates continuous approximations of known constraint violations to train a one-step neural refiner, then reuses it recurrently only at test time (Sections1–3).

## Contributions

- Variable-value tokens combine absolute variable positions, pairwise constraint relations and an editable-subset embedding.
- Cardinality, AllDifferent and inequality penalties train without feasible-solution labels.
- Iterative deployment, stochastic variable subsets, multistart and positional/temperature ablations investigate refinement across Sudoku, coloring, simple nurse rostering and MaxCut (Sections3–4/AppendicesA–I).

## Methodology

**Representation and action.** Each variable has a categorical value embedding; multidimensional variable indices use concatenated positional embeddings. A binary graph connects variables participating in a common constraint. Relative-position biases penalize or mask nonadjacent attention, while a special embedding marks randomly selected editable variables. Fixed givens, such as Sudoku clues, are excluded. A Transformer outputs Gumbel-softmax value distributions for selected variables; their argmax gives discrete updates, with unselected values retained. The paper's framework assumes common value domains for the studied variables (Sections3.1–3.2).

**Training/deployment.** Each training example begins with a random complete candidate; a single update is evaluated by a weighted sum of squared constraint penalties. At inference, the same task model's output becomes the next input until a valid solution or budget limit. There is no theorem that every step improves violation, that repeated application terminates, or that infeasible assignments cannot recur. MaxCut minimizes equal-side edge penalties and records the best cut encountered. Stochastic subset editing distinguishes this from constructing a partial assignment token by token. This is **specialist/improvement**: every task/color-count model is trained separately, with no demonstrated shared checkpoint across native tasks (Sections3/4.2/Table8).

The formal cardinality penalty is the absolute discrepancy between desired and summed probability mass; equal-size AllDifferent sums absolute column-mass discrepancies. For excess domain values it adds ReLU mass-above-one and mass times its absolute distance from one; inequality uses the dot product of value distributions. Rendered formulas contain absolute-value signs that plain extraction can omit. Zero penalties are exact on their intended **one-hot discrete assignments**, but soft zero need not imply feasible argmax: n=m variables each uniformly distributed have unit column masses and zero equal-size AllDifferent penalty, yet a common deterministic argmax produces duplicates. Therefore the stated zero-penalty equivalence must not be expanded into an integrality/rounding certificate for arbitrary soft outputs (Tables1/7/AppendixH).

**Cost.** Best models use4–7 layers,3 heads,128-dimensional embeddings(126 for rostering), dropout.1 and AdamW1e−4. Final training uses batch512 and5000epochs, about6–10hours per model on a single P100/V100/T4; a grid search evaluates a few hundred configurations per problem. This is label-free training, not negligible total search/training cost (AppendixD).

## Experiments

**Sudoku.** SATNet training contains9000 instances; the in-distribution test has1000, and the harder RRN test has18000. Main solve rates are100% in distribution and65.88%/77.74% OOD at2000/10000iterations, compared with the reported energy-diffusion62.1%. These are whole-instance discrete solve rates, not cell accuracy. Longer inference does not monotonically help every model: the recurrent-Transformer comparison falls from32.9% to14.0% OOD with its2000-iteration setting. AppendixE also reports **85.67%** for temperature.1 ordinary softmax, better than the headline77.74% Gumbel setting; Gumbel noise is therefore not universally best. Classical OR-Tools is stated to solve100% of Sudoku. The text labels[31,42] and[17,34] as missing-cell ranges despite describing the latter as harder; that terminology should not be silently treated as an independently verified clue-count protocol (Table2/Section4.1/AppendixE).

**Coloring.** Five-color graphs train at50vertices/test OOD100; ten-color graphs at100/test200. ER/geometric(and BA for five colors) graphs are filtered using greedy required colors k' and k=max(3,min(10,k'−1)). Thus a greedy failure does not certify uncolorability, and this data construction deliberately makes the selected color target tighter than that heuristic. Each test set has1200 instances. With10seconds per sequentially evaluated graph, five-color solve rates81.00/47.33% are below OR-Tools83.08/57.16, but above ANYCSP79.17/34.83. Ten-color rates52.60/11.92 narrowly exceed OR-Tools52.41/10.25; allowing OR-Tools60seconds raises its small-graph result to53.67%, above ConsFormer, while200-vertex11.66% remains slightly below11.92. These finite small margins do not establish broad solver superiority or a statistical confidence interval (Tables3/11).

**Nurse rostering.** The simplified CSP assigns9 shift slots per day from10 nurses, prevents same-day reuse and last-shift/next-first-shift overlap. ConsFormer and OR-Tools both solve100% within10seconds; the paper explicitly says many valid solutions make these easy. AppendixC.2 prints the **same**10days/3shifts/3nurses/10available configuration for ID and OOD, so a larger/harder nurse distribution shift is not established by that description. This is not a full practical nurse scheduling model with all labor preferences and constraints (Sections4.1/4.3/AppendicesB/C).

**MaxCut.** A separate100-vertex model is tested on weighted GSET800–10000vertices. Relative gaps use **best-known** cuts, not an optimality certificate. Group gaps .31/.34/.43/1.27% improve OR-Tools1.84/2.09/3.38/3.08, but ANYCSP.02/.05/.12/.42 is better in every group. ECORD is also better through2000vertices(.11/.16/.36), with ConsFormer better in the≥3000group(1.27vs1.53). Baselines other than rerun ConsFormer/OR-Tools are inherited from the cited ANYCSP study; AppendixG specifies20parallel180-second runs for the new MaxCut comparison. This differs from the coloring10-second protocol (Table4/AppendixG).

**Ablations.** Updating every variable quickly plateaus on Sudoku/coloring; stochastic subsets improve later solve rates. Relative masking improves larger coloring generalization, while2D absolute positions alone nearly solve in-distribution Sudoku. Multistart is nonmonotone under a fixed budget: five-color pool2 falls43.42% below single47.33, pool100 reaches55.67 but still below OR-Tools57.16; ten-color pool50 reaches15%, then pool100 falls13.25. More parallel candidates reduce iterations per candidate. Direct continuous SGD on10Sudoku trials achieves26.8/25.8/24.5/21.8 satisfied AllDifferent constraints out of27 as missing cells increase, not a solve-rate theorem against every per-instance optimizer (Figures3/Tables5–12).

## Limitations

### Discussed in the Paper

Constraints have a fixed learned structure and are not explicitly encoded beyond pairwise participation. Arbitrarily signed/parametric SAT clauses cannot be represented by the presented architecture. Neuro-symbolic backtracking/restarts, self-improvement and broader constraint families remain future work. The nurse benchmark is intentionally easy.

### Curator Notes

Empirical improvement with more iterations is distinct from monotonic updates, guaranteed feasibility or completeness. Soft penalty zero requires a discrete feasibility check. Claims of generalization across domains describe a common framework with task-specific models; they do not show one cross-task checkpoint. OOD nurse configuration, Sudoku count terminology, inherited baseline protocols and task-specific negative results require explicit limits.

The current release's README explicitly covers both ICML2025 and a later CPAIOR2026 paper. It includes prediction-guided destroy strategies and soft recurrent outputs; `_decode` uses hard=False Gumbel-softmax and the trainer feeds that soft output forward, unlike a literal hard-assignment reading of the formal argmax recurrence. Its nurse loss also uses a weighted squared ReLU plus a signed binarization term, rather than the printed absolute-value expression. These are **current snapshot differences**, not proof of what code produced the formal results. Training selects `_best` using the supplied test_loader loss; whether this is an independent validation split depends on the supplied data/configuration, so this audit does not infer formal test leakage from the variable name alone. No training/search benchmark was rerun.

## Reproducibility

- **Formal metadata:** [ICML2025/PMLR267](https://proceedings.mlr.press/v267/xu25q.html), pp69432–69450, official citation_publication_date October6,2025. Formal names Yudong W. Xu and Elias B. Khalil retained; publisher expands/shortens those names. University of Toronto/Vector affiliation checked; SCALE AI is the named chair rather than a separate demonstrated institutional affiliation.
- **Complete scientific coverage:** all19 formal pages, full references and AppendicesA–I read; architecture/constraint formulas, all task tables and appendix ablations visually inspected. Publisher HTML lists the integrated PDF and no separate scientific supplement; its asset API returns404. Normal OpenReview IQN6ID0snT API403 recorded without bypass.
- **Additional author materials:** the author page links a1-page1,011,115-byte poster and14-page1,320,191-byte slides, all independently read and rendered, including figure-only slides. Their paper QR decodes to arXiv2502.15794, latest v2June9,2025. Its first page was independently read; every complete text and RGB pixel of pages2–19 exactly matches already-read formal pages2–19. Per-file/page hashes and mapping are saved in qr-version-page-equivalence.json; reading logs disclose identical-page coverage, **not a second independent reading**. Poster code QR points to the same author repository.
- **Code/data:** [author repository](https://github.com/khalil-research/ConsFormer),840,369-byte20-member ZIP manually inventoried, sole documentation README fully read; no PDF/TeX/notebook scientific attachment. Architecture image and core solver/loss/trainer/task-specific entry points checked. Data are separately linked through Google Drive; no new scientific appendix is indicated there. Current repo includes later CPAIOR features, which are not attributed to ICML results.
- **Relations:** ten actual in-text/full-bibliography matches to existing stable IDs. ANYCSP, RRN and energy-diffusion comparisons remain named external references where no matching catalogue item exists; their names do not justify edges to different papers.
