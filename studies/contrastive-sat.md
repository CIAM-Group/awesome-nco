---
id: contrastive-sat
short_title: Augment with Care
title: 'Augment with Care: Contrastive Learning for Combinatorial Problems'
authors:
- Haonan Duan
- Pashootan Vaezipoor
- Max B Paulus
- Yangjun Ruan
- Chris Maddison
year: 2022
date: '2022-06-28'
publication:
  date: '2022-06-28'
  source_url: https://proceedings.mlr.press/v162/duan22b.html
venue: ICML
paper_url: https://proceedings.mlr.press/v162/duan22b.html
institutions:
- University of Toronto
- Vector Institute
- ETH Zurich
scope: study
paper_type: analysis
problem_families:
- Satisfiability
problems:
- SAT Prediction
summary: A controlled SAT representation-learning study finds that bounded satisfiability-preserving augmentations
  enable effective contrastive pretraining, improving low-label prediction and selected cross-generator transfers.
code_url: https://github.com/h4duan/contrastive-sat
---

# Augment with Care: Contrastive Learning for Combinatorial Problems

> **TL;DR:** Contrastive SAT pretraining works much better with satisfiability-preserving transformations than with generic graph perturbations in the tested synthetic families. Resolution, variable elimination and their composition order matter. The output is a representation for SAT/UNSAT classification; it is not a complete SAT solver or a certificate of the model's predictions.

## Motivation

Generating SAT labels can require expensive conventional solving. Contrastive learning offers a way to pretrain an encoder on unlabelled formulas, but its positive pairs should retain the property later predicted by the classifier. Dropping clauses, variables or incidence edges can change satisfiability, turning two purportedly positive views into formulas with different labels. The paper studies whether SAT's known invariances can supply more useful views without solving each formula.

## Contributions

- Defines label-preserving augmentations and instantiates them using bounded SAT preprocessing transformations.
- Adapts a NeuroSAT encoder to SimCLR-style graph representation learning and compares augmentation type, strength, composition and order.
- Evaluates frozen-representation classification, supervised fine-tuning and small labelled-target transfers, with additional architecture/loss checks in the appendices.
- Provides an empirical augmentation study for SAT prediction. MILP and other combinatorial tasks are discussed as possible extensions, not evaluated by a shared generalist checkpoint.

## Methodology

Each CNF formula is represented by a literal-clause incidence graph with additional links between a literal and its negation (`LIG+`). Two independent stochastic augmentations of the same formula form a positive pair; other batch instances provide contrastive negatives. The primary encoder uses NeuroSAT's literal/clause message passing for 26 rounds, with 128-dimensional literal features. Literal embeddings are mean-pooled into a formula representation, then passed through a two-layer, 64-dimensional projection head for contrastive training. The projection head is discarded for downstream representation evaluation.

The reviewed transformations include unit propagation, adding a fresh unit literal with the required compensating changes, pure-literal elimination, subsumed-clause elimination, clause resolution and variable elimination. Resolution adds a logically implied clause; variable elimination replaces clauses containing a chosen variable with their pairwise resolvents. These preserve **satisfiability**, not necessarily the original variable set or all satisfying assignments without reconstruction. The experiments focus on adding unit literals (AU), subsumption (SC), resolution (CR) and variable elimination (VE); most generated formulas lack the unit/pure literals needed by the other two operations.

VE is run on a small, fixed number of variables rather than to unrestricted completion, and CR adds a bounded fraction of resolvents. The resulting bounded augmentation procedures are not full SAT solving. Their label-agnostic comparisons preserve the required graph format but may change satisfiability: dropping clauses, dropping variables, perturbing incidence links and sampling a subgraph.

After unlabelled pretraining, the paper trains a logistic classifier on frozen embeddings or fine-tunes the network using labelled instances. Thus contrastive pretraining avoids source labels, while the downstream classifiers and model selection still require labels. Separate encoders are trained for different generator/augmentation settings; cross-generator evaluation is a transfer experiment on those representations.

## Experiments

Initial augmentation comparisons use SR(10), power-random PR(10), double-power DP(20) and popularity-similarity PS(20) formulas, where parentheses give the variable count. DP and PS are **pseudo-industrial generators**, not a benchmark of large real industrial formulas. The pretraining protocol uses temperature 0.5, Adam learning rate `2e-4`, weight decay `1e-5`, batch size 128 and up to 5,000 epochs, generating new unlabelled instances for batches. Frozen linear evaluation uses 100 training labels, 500 validation labels to tune regularization and 10,000 test instances.

The best label-preserving compositions in the main augmentation comparison achieve 95.1%, 93.3%, 86.0% and 96.9% accuracy on SR, PR, DP and PS respectively, well above the tested generic augmentations. Label preservation alone is insufficient: some individual preserving transformations perform poorly. Resolution followed by subsumption is particularly useful; swapping their order or omitting subsumption can substantially reduce accuracy. Adding the same number of random clauses does not reproduce the benefit.

The larger comparison uses 40-variable instances, with SR training sizes sampled between 10 and 40, and varies the number of **training** labels from 2 to 10,000. Figure 5 reports means and standard errors over three trials. In these experiments, the authors report that pretraining plus 100 training labels matches or exceeds their best supervised baselines using 10,000 training labels, for both linear evaluation and fine-tuning. This “100 times fewer labels” comparison concerns training labels; additional labelled validation sets are used, including 200 instances for early stopping in Section 7. It is not an accounting claim that the entire procedure uses only 100 labelled formulas.

Transfer tests fit a classifier to frozen source embeddings using **10 SAT and 10 UNSAT target formulas**, i.e. 20 labels in total. Targets include unseen uniform-random and community-attachment generators and larger formulas. Contrastive representations generally transfer better than the compared supervised source representations, but performance depends strongly on source and target: synthetic SR/PR sources often transfer better than the pseudo-industrial sources. Appendix G also shows cross-generator and 10/20-to-40-variable transfers.

Appendices test a ten-layer GCN and the VICReg objective, and report CryptoMiniSat decision-step counts before/after augmentation on 1,000 instances per dataset. The relatively stable counts support the authors' argument that the augmentations are not simply solving these test instances; they do not constitute a general proof that every augmented formula retains its original solving difficulty.

## Limitations

### Curator Notes

Satisfiability prediction is not complete SAT solving. This work does not supply satisfying-assignment extraction, UNSAT proofs or an end-to-end conventional-solver runtime improvement. Satisfiability-preserving augmentation does not certify a neural prediction on a new formula.

The evidence is restricted to the reported small, generated SAT distributions and selected encoders. Preserving labels is an important design principle supported by these comparisons, not a claim that every preserving augmentation is effective or that no other pretraining design can work. Likewise, the suggested ability to learn resolution rules is an interpretation, not a demonstrated formal reasoning guarantee. VE can have exponential cost if applied without the stated limits. Label-budget comparisons must retain their validation-label and target-adaptation qualifications, and generator-specific gains should not be generalized to arbitrary industrial SAT instances.

## Reproducibility

- Publication record: [ICML 2022](https://proceedings.mlr.press/v162/duan22b.html).
- Source text: [complete 16-page publisher PDF](https://proceedings.mlr.press/v162/duan22b/duan22b.pdf), including all references and Appendices A-I. Architecture equations, augmentation examples, result tables and principal/supplemental plots were checked visually.
- Implementation linked by the authors: [code](https://github.com/h4duan/contrastive-sat).
- The official PMLR page has no separate scientific supplement; the scientific appendices are integrated in the reviewed PDF. The public implementation repository contains source, scripts and generator data, but its README is brief. Reproduction requires the generator parameters, augmentation composition/order and rates, message-passing rounds, label splits and tuning protocol supplied throughout the paper and appendices.
- The proceedings record supports July 2022 publication, rather than the previously stored June 28 day. The study's numerical results were not rerun in this review.
