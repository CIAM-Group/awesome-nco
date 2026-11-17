---
id: causal-lm-logic-puzzles
short_title: Causal LM Puzzles
title: Causal language modeling can elicit search and reasoning capabilities on logic
  puzzles
authors:
- Kulin Shah
- Nishanth Dikkala
- Xin Wang
- Rina Panigrahy
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/67b31ca159553d5593e62d7b998d63ea-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/67b31ca159553d5593e62d7b998d63ea-Abstract-Conference.html
institutions:
- The University of Texas at Austin
- Google Research
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Constraint Satisfaction
problems:
- Sudoku
- Zebra Puzzles
summary: Separately trained causal Transformers solve filtered Sudoku and symbolic
  Zebra puzzles by learning a teacher-selected assignment order, with beam search
  improving full-puzzle accuracy.
code_url: https://github.com/kulinshah98/llm-reasoning-logic-puzzles
---

# Causal language modeling can elicit search and reasoning capabilities on logic puzzles

> **TL;DR:** A 42M-parameter causal Transformer learns to generate cell assignments in a deductive solver's order. On the studied datasets, this order is much more effective than fixed or random ordering. The headline Sudoku/Zebra accuracies require beam width five; this is a synthetic reasoning study with separately trained task models, rather than a shared general-purpose constraint solver.

## Motivation

Next-token training can hide the order in which a puzzle is easy to solve. Predicting an arbitrary cell may require reasoning that is unnecessary when another cell is immediately deducible. The study asks whether teacher-selected assignment order helps an otherwise conventional causal Transformer learn both where to act and which value to output (Sections 1-3).

## Contributions

The experiments separate fixed, random and solver-decomposed training orders, test solver-provided position hints at inference, and add beam decoding. A candidate-set analysis examines whether output logits retain information about alternative values, even at positions the model would not naturally choose next.

The evidence covers standard 9-by-9 Sudoku and symbolic Zebra puzzles with three to six entities and attributes. Models share the architecture recipe, but Sudoku/Zebra and the different ordering conditions have separate training pipelines; there is no demonstrated joint checkpoint. This entry records a specialist constructive neural approach and its empirical analysis. The authors explicitly distinguish their scientific question from competing with stronger traditional CSP solvers (Appendix B).

## Methodology

Sudoku examples serialize known cells and then solution assignments as row/column/value triplets. A human-like solver chooses assignments by trying seven deductive strategies. Only two strategies directly fill cells; the others narrow candidates. The training sequence provides the resulting assignments and their order, not the complete elimination/search trace or explicit rule explanations. The current data loader also removes the stored strategy-ID column before forming model inputs.

The 42M GPT-2-style model uses eight layers, eight heads, dimension 576 and MLP width 3,456. Causal next-token loss is applied to the solution portion. Zebra inputs instead serialize seven symbolic clue types and entity/attribute/value solutions. Its teacher combines one-, two- and three-clue subsets. Position-hinted decoding asks the teacher which cell to fill, so those results describe an assisted inference condition. Beam decoding retains a finite number of likely partial token sequences; it does not give complete CSP search or a correctness guarantee (Sections 2-4; Appendices C-D).

## Experiments

The Sudoku corpus is filtered to puzzles solvable by the seven teacher strategies: 1.8M training and 0.1M evaluation examples. Fixed-order training yields 58.64% cell accuracy and 7.2% complete-puzzle accuracy; random ordering gives about 52% and 1%. Solver-order training with greedy decoding reaches 94.23% cell and 87.18% puzzle accuracy. Beam widths three/five raise whole-puzzle accuracy to 91.36%/94.21%. Solver-provided position hints give the solver-order model 99.02% **cell** accuracy; this is neither an unassisted result nor a whole-puzzle success rate. The hinted random-order model reaches only 54.57% cell accuracy (Figure 1; Table 2; Sections 3.3-3.5).

The probing statistic is top-k output-logit overlap with the teacher's candidate set, where k is the teacher-provided set size. It is averaged across empty cells of **correctly solved puzzles** at selected fill counts. Overlap rises from 93.19% at 35 filled cells to 99.37% at 75. Section 4.2 explicitly says this is direct logit inspection, without training a linear probe. These are conditional average-overlap statistics, not exact candidate-set recovery on every puzzle, despite the abstract's broader linear-probing phrasing.

On the 18,000-puzzle RRN evaluation set, the width-five model obtains 95.43% complete accuracy versus the reported RRN 96.6%. Table 5 describes 320k Zebra puzzles, 20k per entity/attribute-size combination, with 15k held out and the remainder for training; Appendix D rounds training to 0.3M. Zebra greedy decoding reaches 91.17% whole-puzzle accuracy and beam width five 92.04%. Appendix I also describes monitoring on a 1k evaluation set and notes that smaller instances are easier and more prevalent in that evaluation. These results do not establish held-out-size generalization. The four-shot GPT-4o/Gemini comparison uses a different training regime and is not a matched-data comparison (Tables 1-5; Appendices F and I).

## Limitations

The datasets deliberately exclude Sudoku puzzles requiring backtracking beyond the chosen deductive teacher, and Zebra instances are generated until the nonbacktracking teacher succeeds. The experiment therefore does not establish general NP-hard CSP solving. There is no proof that alternative training could never learn these tasks, that candidate overlap establishes a human-equivalent reasoning algorithm, or that the method invents new strategies. The paper acknowledges synthetic-task, long-horizon and creativity limitations. Its checklist explicitly reports no multi-seed error bars (Section 5; checklist item 7).

### Curator Notes

The Sudoku difficulty rating is described inconsistently: Section 2 calls it maximum guess-stack depth, whereas Appendix F.2 calls it an average number of guesses. It is safest to interpret Figure 6 as dataset-rating bins without equating those two definitions. Evaluation/test/validation and Zebra's monitored-versus-table evaluation set sizes also require care. These are reporting limitations, not a rerun demonstrating invalid experimental results.

## Reproducibility

- The complete [NeurIPS 2024 proceedings paper](https://proceedings.neurips.cc/paper_files/paper/2024/file/67b31ca159553d5593e62d7b998d63ea-Paper-Conference.pdf) was read: all 29 pages, references, Appendices A-I and checklist. Eight key result/analysis/strategy pages were visually inspected. Publisher metadata verifies the four authors, DOI 10.52202/079017-1805 and publication date December 16, 2024.
- The publisher landing page has no separate scientific supplement link; all named appendices are integrated. Manual exact-title OpenReview API v1/v2 requests returned 403. The official repository tree at commit `66a49af440cf52eef087793727f6bd41b8c19eb2` contains eighteen files and no PDF/ZIP scientific attachment.
- The [official implementation](https://github.com/kulinshah98/llm-reasoning-logic-puzzles) provides separate Sudoku/Zebra training commands, environment instructions and a dataset link. Its complete README and four data/configuration modules were inspected. Current configuration defaults differ from Appendix D: learning rate 0.0002 rather than 0.0001, different warmups and separate step limits. The README describes a larger Zebra release (about 1.5M/0.1M train/test) than the proceedings corpus. These current-release settings and data sizes should not be silently substituted for the reported experiment. Dataset contents and model training were not rerun.
- Three exact citations to existing catalog IDs are registered with body and full-reference page evidence. Architecture resemblance is not used to invent relation edges.
