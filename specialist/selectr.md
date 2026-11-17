---
id: selectr
short_title: SELECTR
title: Neural Learning of One-of-Many Solutions for Combinatorial Problems in Structured Output Spaces
authors:
- Yatin Nandwani
- Deepanshu Jindal
- Mausam
- Parag Singla
year: 2021
date: '2020-08-27'
publication:
  date: '2021'
  source_url: https://openreview.net/forum?id=ATp1nW2FuZL
venue: ICLR
paper_url: https://openreview.net/forum?id=ATp1nW2FuZL
institutions:
- Indian Institute of Technology Delhi
scope: specialist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2008.11990
paradigm: constructive
problem_families:
- Constraint Satisfaction
problems:
- N-Queens
- Futoshiki
- Sudoku
summary: A training-time neural selector weights valid supervision targets for non-autoregressive CSP predictors under solution multiplicity; inference remains a separate task-specific prediction network, with empirical gains and full-target-set theoretical assumptions distinguished.
code_url: https://github.com/dair-iitd/1oML
figure:
  path: paper-assets/selectr/framework.png
  alt: The selection module compares a lagged predictor output with candidate valid targets, supplies training weights and learns from the current predictor reward.
  caption: 'Figure 2: training-time target selection and joint prediction/selection updates.'
  source_url: https://arxiv.org/pdf/2008.11990v2#page=6
---
# Neural Learning of One-of-Many Solutions for Combinatorial Problems in Structured Output Spaces

> **TL;DR:** SELECTR learns which **valid training target** to emphasize when several complete outputs solve the same puzzle. It jointly trains a target selector and a task-specific non-autoregressive prediction network. The selector operates **during training**; inference does not search the target set or run a learned incumbent-improvement policy. The reported gains concern held-out CSP solution accuracy, with up to about 21 percentage points over the unique-only baseline on the tested overall Futoshiki task.

## Motivation

N-Queens, Futoshiki and Sudoku can admit several valid completions. Penalizing a network against every valid target independently can encourage incompatible coordinate marginals, even when one complete prediction is already correct. The desired objective is to produce **any one valid complete assignment**, not every target, and the known training candidates are all correct rather than noisy labels. The networks learn from example solutions; task relations such as shared rows/columns and inequality indicators are still provided as inputs or graph structure. [Sections 1-3.](https://arxiv.org/pdf/2008.11990v2#page=4)

## Contributions

- Formalize **one-of-many learning**, allowing each training input to have only a subset of its valid complete solutions.
- Show a failure of the naive per-target objective and propose a one-target-weighted formulation.
- Compare greedy **MINLOSS**, predictor-based **I-EXPLR** and a learned **SELECTR** target-selection module.
- Evaluate three puzzle domains with NLM/RRN backbones, incomplete Sudoku target sets and explicit one-solution/multiple-solution splits. [Sections 3-4.](https://arxiv.org/pdf/2008.11990v2#page=5)

## Methodology

### Objectives and the scope of the theory

The naive objective sums losses over all known targets. A Boolean two-coordinate example shows that its cross-entropy optimum can favor .5/.5 marginals instead of either valid complete assignment. CC-LOSS instead maximizes total probability mass over known valid targets; the appendix implements it stably with **log-sum-exp**, so numeric underflow is addressed in the compared baseline rather than treated as unavoidable.

The proposed objective attaches a one-hot target weight vector to each input. **MINLOSS** chooses the current minimum-loss candidate and updates the predictor toward it. Lemma 2 identifies the minimized weighted **zero-one loss** with an empirical validity error **when the full valid target set is known**. This does not prove global convergence of cross-entropy training, or consistency with an arbitrarily incomplete candidate subset. A logistic-regression counterexample illustrates how greedy joint target/predictor updates can become trapped. [Equations 1-5/Lemmas 1-2 and their complete appendix proofs.](https://arxiv.org/pdf/2008.11990v2#page=13)

### The selection network

For each training input, a lagged predictor copy produces an output. The selector's latent network compares that output with each known valid candidate and assigns a softmax probability to the candidate. The reward is the **number of matching output positions** between a candidate and the **current predictor** output, a granular proxy for predicting the entire selected target correctly. It is not a reward obtained by solving a new puzzle after a hypothetical future gradient step. Selector parameters maximize expected reward, while predictor parameters minimize selector-weighted target loss. [Equations 6-8/Figure 2.](https://arxiv.org/pdf/2008.11990v2#page=6)

Although motivated as selecting/sampling one target, the actual experiments backpropagate the **expected loss over the tractable candidate set**. Predictor pretraining uses either MINLOSS or unique-solution-only examples, chosen on a held-out dev set; the selector is pretrained against the frozen predictor. Joint training then updates both modules, periodically copying predictor parameters into the selector's internal prediction copy. I-EXPLR instead derives candidate probabilities directly from the predictor. [Algorithm 1.](https://arxiv.org/pdf/2008.11990v2#page=7)

### Task-specific prediction and selector architectures

- **N-Queens:** a depth-30 Neural Logic Machine with eight intermediate predicates and maximum arity two predicts all board-cell queen indicators. A smaller depth-four, ten-predicate NLM selects targets from candidate-minus-prediction features. Shared row/column/diagonal/off-diagonal predicates encode task relations.
- **Futoshiki:** another separately trained NLM predicts cell-digit predicates; the selector also receives inequality indicators. This representation has N cubed atomic variables, which carries a separate size cost.
- **Sudoku:** an RRN on the 81-cell row/column/box graph performs **32 message-passing steps**. Final-step output determines evaluation accuracy; training/selection can use all intermediate predictions. The appendix describes four convolution layers plus a fully connected selector head, whereas the inspected public code adds an additional one-channel convolution before the fully connected layer. This version/detail difference is retained. [Appendix architecture details.](https://arxiv.org/pdf/2008.11990v2#page=16)

Classification remains **specialist / constructive**. Parallel assignment prediction counts as constructing a complete solution. RRN hidden-state iterations are not an incumbent-tour editing process, and target exploration during training is not test-time local search. The three tasks use separate training and different input/backbone configurations; a generic selection framework does not demonstrate one shared cross-task solver checkpoint.

## Experiments

### Dataset and evaluation protocol

N-Queens trains on **10-by-10 boards with five queens given** and tests on 11-by-11 boards with five given. There are **165,744 training and 10,000 test queries**; multi-solution fractions are 7.04%/16.67%. Known target sets are complete, with two to six solutions for multiple-solution queries.

Futoshiki trains on **5-by-5 puzzles with 14 missing digits**, tests on 6-by-6 with 20 missing digits, and uses up to five inequalities of each direction. There are **10,000 train and 10,000 test queries**, with multiple-solution fractions 17.05%/24.95%, and complete small target sets. Sudoku uses **20,000 train and 10,000 test queries**, half unique and half multiple, with 17-34 givens. Its generation filters puzzles with more than **50 valid solutions**, and training keeps **at most five sampled targets** per query. The reported average of 13.8 solutions per multi-solution training query refers to the full solution set, not five retained targets. [Table 1/Appendix data generation.](https://arxiv.org/pdf/2008.11990v2#page=8)

Accuracy requires a **complete valid solution under all puzzle constraints**; no partial credit is awarded. Results separate OS, unique-solution inputs, and MS, multi-solution inputs. Three random seeds are run; parenthesized main-table values come from the **dev-selected run**, not an independently maximized score in every OS/MS column. Dev-set tuning also selects sampling ratios, early stopping and pretraining choices.

### Main accuracy results

| Task | Unique-only overall | MINLOSS overall | I-EXPLR overall | SELECTR overall | SELECTR MS |
| --- | --- | --- | --- | --- | --- |
| N-Queens | 73.72% | 77.28% | 77.70% | **79.72%** | 79.68% |
| Futoshiki | 55.53% | 75.18% | 76.33% | **76.40%** | 71.57% |
| Sudoku | 77.79% | 82.59% | 84.46% | **85.21%** | 81.73% |

The approximately **21-point** headline is the Futoshiki overall difference **76.40 - 55.53 = 20.87 points** over Unique, not the gain over MINLOSS or all baselines under all metrics. Against MINLOSS, overall gains are **2.44/1.22/2.62 points**. SELECTR is not uniformly best on every subgroup: Sudoku OS accuracy **88.69%** is below Unique's **89.19%**, and Futoshiki OS **78.01%** is below I-EXPLR's **78.15%**. Its Futoshiki overall advantage over I-EXPLR is only **.07 points**. [Table 2.](https://arxiv.org/pdf/2008.11990v2#page=9)

The appendix reports standard errors and seed-wise MINLOSS gains, while the main p-values come from McNemar tests on dev-selected best models. Those significance statements are not a large-seed uncertainty study. Appendix Table 3 **swaps the Random and Unique numeric columns relative to main Table 2**; the table above follows main Table 2 and its surrounding baseline interpretation, and does not silently treat both versions as consistent. [Appendix Tables 3-4.](https://arxiv.org/pdf/2008.11990v2#page=19)

### Training budget, transfer and multiplicity analysis

Experiments use a **12 GB NVIDIA K40 and four Xeon E5-2680v3 CPU cores**. Adam starts at .005 for NLM and .001 for RRN; the RL phase uses one tenth of the initial rate, with further dev-plateau decay. N-Queens uses batch four, approximately **10-12 hours pretraining plus 6-8 hours fine-tuning**; Futoshiki takes **12-14 plus 7-8 hours**. Sudoku takes **20-22 plus 10-12 hours**, with batch 32 for baselines and 16 for joint RL training. Selector pretraining uses 250 updates for NLM tasks and 1,250 for Sudoku. These are additional training costs; the paper does not supply a comprehensive solver-runtime comparison with conventional CSP algorithms. [Appendix training details.](https://arxiv.org/pdf/2008.11990v2#page=17)

Size transfer is tested within the N-Queens/Futoshiki tasks. Sudoku keeps the board size fixed and studies target multiplicity. All methods degrade as the number of solutions increases, but the bins also have **fewer givens and very unequal counts**; the curve does not isolate a causal effect of multiplicity alone. The appendix's diagnostic measures whether the selector's **highest-probability** candidate differs from the predictor-nearest target. I-EXPLR's zero value for that diagnostic does not mean its stochastic target distribution performs no exploration. SELECTR's additional exploratory behavior is empirical, not a guarantee of globally optimal learning. [Figures 3/6/7.](https://arxiv.org/pdf/2008.11990v2#page=20)

## Limitations

### Reported by the Authors

- Performance still decreases with increasing solution multiplicity.
- Autoregressive prediction and symbolic-CSP integration are beyond the tested framework.
- Only three random-seed experiments are affordable given the training cost.
- Theoretical full-target assumptions and practical incomplete target sets are distinct. [Conclusion/Appendix.](https://arxiv.org/pdf/2008.11990v2#page=19)

### Curator Notes

- Candidate valid completions are supplied by enumeration/solvers during data generation; target-selection learning does not eliminate that supervision cost.
- A training reward based on position agreement is a proxy for full-solution validity, and no global optimization or general correctness certificate follows.
- Given relations encode substantial task structure even though the networks do not receive an explicit general-purpose constraint solver.
- Subgroup exceptions, small I-EXPLR differences, dev-selected runs, the Random/Unique table discrepancy and CNN layer-count version difference matter for accurate comparison.
- Separate task models, filtered Sudoku multiplicity and modest size transfer limit broad generalist or scaling claims.

## Reproducibility

- **Full reading:** all **21 pages of arXiv2008.11990v2, 4 April 2021**, including the full bibliography, both proofs, numerical implementation, task details and extended result figures/tables, were freshly read and scientifically relevant diagrams/formulae/tables/plots visually inspected.
- **Metadata:** the PDF explicitly states ICLR2021. ArXiv confirms first submission **27 August 2020**, v2 date and all four authors; the malformed author `Mausam .` is corrected to **Mausam**. All title-page affiliations are IITDelhi. Year-only formal publication precision is retained.
- **Scientific supplement discovery:** OpenReview returned a verification page. The complete v2 embeds the scientific appendix through page21 and refers to the author resource page, which was manually inspected. Its linked cleaned-code and exact-replication source ZIP inventories contain **587/649 members**. The only PDF is a vendored generic weighted-sampling proof, not a supplement to this study; no additional paper-specific scientific PDF/ZIP was identified. Source archives were inspected, not counted as scientific reading.
- **Official resources:** [author page](https://sites.google.com/view/yatinnandwani/1oml), [cleaned code](https://github.com/dair-iitd/1oML), [paper-replication directory](https://github.com/dair-iitd/1oML_workdir). Both READMEs and selector implementations were inspected. The author warns that the replication directory may be less readable and contain unused parameters; the cleaned repository is not assumed byte-identical to the experimental version. The page links datasets; no new experiment was run here.
- **Figure:** original Figure2, PDF page6, cropped directly with its full training diagram and caption.
