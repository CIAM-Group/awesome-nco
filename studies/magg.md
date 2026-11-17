---
id: magg
short_title: MAgg
title: Extending Test-Time Augmentation with Metamorphic Relations for Combinatorial Problems
authors:
- Siwei Wei
- Xudong Zhang
- Zhiyang Zhou
- Yan Cai
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/wei24i.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/wei24i.html
institutions:
- Chinese Academy of Sciences
- University of Chinese Academy of Sciences
scope: study
paper_type: analysis
problem_families:
- Satisfiability
- Routing
- Graph Matching
problems:
- SAT Prediction
- Decision TSP
- GED Estimation
summary: Metamorphic aggregation uses known relations between transformed instances to improve predictions.
code_url: https://github.com/MetamorphicAgg/MAgg
---

# Extending Test-Time Augmentation with Metamorphic Relations for Combinatorial Problems

> **TL;DR:** A trained aggregator combines a frozen model's predictions on related transformed inputs. It improves several SAT/decision-TSP classification and graph-edit-distance estimation results, with a slight AIDS regression loss; it does not return certified tours, assignments or edit sequences.

## Motivation

Conventional test-time augmentation averages predictions over label-preserving transformations. Combinatorial problems also have useful implications or inequalities between outputs on transformed inputs, even when their labels change. MAgg asks whether a learned aggregation model can exploit these relations to improve a pretrained predictor (PDF pp. 1–4).

## Contributions

MAgg represents binary metamorphic relations as a directed ego graph whose nodes are original and transformed problem instances. It uses base-model predictions as node features and learns to predict the central instance's label. The study instantiates this framework for NeuroSAT classification, decision-TSP classification with TSP-GNN, and graph edit distance (GED) regression with GREED, with proofs of the chosen relations and empirical sample-count and aggregator ablations (pp. 4–8, 12–22).

These are separate task- and dataset-specific pipelines. Applying the framework to three tasks is not evidence that one trained model solves all three, and a frozen base predictor does not make the method training-free: the aggregator requires labelled training examples.

## Methodology

Single-input transformations generate related instances and can be composed to form multiple graph levels. A simplified message-passing aggregator combines a central prediction with averaged predictions from related instances; its depth matches the transformation levels. For classification, the one-level aggregator is essentially linear, while the two-level version includes a softmax between updates. GED predictions are normalized and discretized into 200 bins; the aggregation head is an MLP for LINUX/IMDB and linear for AIDS (pp. 5–8).

For SAT, assigning a variable a Boolean value yields a formula whose satisfiability implies satisfiability of the original. For complete Euclidean decision-TSP graphs at a fixed cost threshold, inserting a midpoint gives the same one-way implication: a tour of the enlarged graph can shortcut the added point by triangle inequality. For unit-cost reversible graph edits, one edit changes the true GED by at most one in the stated direction. These relations describe the true target functions; MAgg learns their predictive benefit rather than imposing exact logical consistency on its outputs (pp. 6–8, 12, 17–19).

The SAT base model is trained on 10–40-variable formulas, but separate aggregators are trained on 5,000 labelled examples at each tested size of 40, 80 and 120 variables. Decision-TSP uses separate settings for threshold deviations 0.01 and 0.02, with 2,048 aggregator-training examples. GED uses half of the corresponding training pairs. Thus the complete SAT pipeline is not evaluated as zero-shot size transfer of an unchanged aggregator (pp. 6–8).

## Experiments

On SR(40), two-level MAgg(10,10) changes NeuroSAT accuracy from 0.8444 to 0.9757, an increase of 13.13 percentage points. On SR(80) it changes 0.7268 to 0.8533, and on SR(120), 0.6270 to 0.6643. These are average accuracies across ten repeated transformation-generation/aggregator-training runs. The advertised percentage improvements are relative changes, not percentage-point increases (Tables 1–2, p. 7).

One-level MAgg(10) changes decision-TSP accuracy from 0.6562 to 0.6812 at deviation 0.01 and from 0.8101 to 0.8321 at 0.02. MAgg(50) reduces GED RMSE from 0.4151 to 0.2409 on LINUX, about 42% relatively, and from 6.7341 to 6.3107 on IMDB. It slightly worsens AIDS, from 0.7957 to 0.7994; the abstract's broad improvement wording should not obscure this exception (Tables 3–4, p. 8).

SAT comparisons with one chosen label-preserving augmentation and mean aggregation show little gain from that baseline. GCN aggregation performs similarly on the classification tasks, but can be substantially worse on GED: LINUX RMSE is 0.5709 versus the base model's 0.4151. More transformation samples often help with diminishing returns, but do not fix the AIDS result (pp. 13–16, 18–21).

## Limitations

The experiments measure classification accuracy or GED RMSE, rather than feasible solution recovery, tour optimality, edit-sequence quality or solver runtime. Multiple transformed-instance evaluations increase inference work. The tested standard-TTA baseline changes both the transformation family and aggregation rule, so its comparison does not isolate either factor alone or exhaust possible label-preserving augmentations.

Performance depends on transformation informativeness, the base model and labelled aggregator training. The SAT explanation in Appendix A.7 uses illustrative assumptions about sufficiently many mutants and independent prediction correctness; it is not a distribution-free improvement guarantee. The existence of a sound metamorphic relation alone does not guarantee that the learned aggregator improves accuracy or obeys that relation (pp. 14–16, 20–22).

## Reproducibility

The complete [22-page ICML publisher PDF](https://raw.githubusercontent.com/mlresearch/v235/main/assets/wei24i/wei24i.pdf), including the bibliography and Appendices A–D, was reviewed. The [PMLR record](https://proceedings.mlr.press/v235/wei24i.html) identifies the July 2024 proceedings and links no separate scientific supplement. Both OpenReview note APIs returned HTTP 403; no explicitly missing scientific appendix was identified.

The [author repository](https://github.com/MetamorphicAgg/MAgg) contains separate SAT, TSP-GNN and GREED directories, dataset-generation instructions, aggregation notebooks and some pretrained base-model checkpoints. All four READMEs and the task aggregation implementations were inspected. NeuroSAT requires PyMiniSolvers; decision-TSP generation requires PyConcorde; GREED assets are obtained through its original repository. The released code averages transformed-instance predictions, clarifying the neighboring-state aggregation described in Section 3.3. Training and numerical results were not rerun.
