---
id: predicting-propositional-satisfiability-via-end-to-end-learning
short_title: End2EndSAT
title: Predicting Propositional Satisfiability via End-to-End Learning
authors:
- Chris Cameron
- Rex Chen
- Jason Hartford
- Kevin Leyton-Brown
year: 2020
date: '2020-04-03'
publication:
  date: '2020-04-03'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/5733
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/5733
institutions:
- University of British Columbia
scope: study
paper_type: analysis
problem_families:
- Satisfiability
problems:
- Random 3-SAT Satisfiability Prediction
- Auxiliary Variable-Assignment Prediction
summary: Exchangeable sparse networks and NeuroSAT-style message passing predict SAT labels on balanced random 3-SAT
  near the phase transition; auxiliary assignment supervision improves classification, while reported bit agreement
  is not a verified SAT-witness success rate.
code_url: https://github.com/ChrisCameron1/End2EndSAT
figure:
  path: paper-assets/predicting-propositional-satisfiability-via-end-to-end-learning/framework.png
  alt: Sparse exchangeable matrix layers pool a problem representation for a feedforward satisfiability predictor.
  caption: 'Original Figure 1: the exchangeable prediction architecture.'
  source_url: https://www.cs.ubc.ca/labs/algorithms/Projects/End2EndSAT/paper.pdf#page=3
inclusion: reference
inclusion_reason: SAT-label classification and auxiliary bit prediction; reported bit agreement is not a demonstrated
  valid SAT-witness solver.
---

# Predicting Propositional Satisfiability via End-to-End Learning

> **TL;DR:** Sparse exchangeable networks predict whether hard random 3-SAT formulas are satisfiable, with useful accuracy and size transfer. An auxiliary head also predicts variable values. The reported evaluation measures SAT-label accuracy and agreement with one reference assignment; it does not establish certified SAT decisions, valid-witness success rates or exact-solving speedups.

## Motivation

Satisfiability prediction can inform algorithm selection and runtime models, but established predictors require manually engineered features that can be expensive to compute. The paper asks whether raw CNF structure, processed with the right row/column symmetries, can support accurate and efficient prediction even when exact labeling is costly. It explicitly distinguishes this prediction objective from NeuroSAT's search for satisfying assignments. [Main pp. 1–3]

## Contributions

- Uses sparse exchangeable clause–variable tensors to respect clause and variable permutations.
- Compares independently parameterized exchangeable layers with recurrent NeuroSAT-style message passing.
- Studies auxiliary assignment supervision, single-size prediction, transfer to larger formulas and mixed-size training.
- Reports feature-computation versus inference cost, size-feature ablations and qualitative latent-space analyses. [Main pp. 3–7; supplementary Appendices A–D]

## Methodology

The CNF input has two literal-sign channels for each clause–variable incidence. Exchangeable layers combine a local incidence representation with means over its variable, clause and entire problem. Stacking layers propagates information while respecting row/column permutations. Global mean pooling yields a problem embedding passed through an MLP and sigmoid SAT-probability output. Fixed-width, fixed-depth computation is linear in the number of nonzero incidences; this is an inference complexity statement for an approximate classifier. [Main pp. 3–4]

An auxiliary head pools variable-specific representations and applies an MLP to predict each Boolean value, adding a normalized assignment cross-entropy term. Thus the paper **does have an assignment-output architecture**. However, learning one solver-provided assignment does not encode all valid assignments, and its reported bit-level accuracy is not the probability of satisfying every clause. The studied main task is prediction, with no evaluated neural branch/search integration or valid-witness success metric. The entry is therefore **study / analysis**, retained as a related reference rather than a demonstrated constructive or improvement solver. [Main pp. 2, 4–6; supplement pp. 2–3, D.2/Table 4]

The exchangeable model uses eight 128-channel layers with leaky ReLU and a final width 64, then pooled scalar prediction. Adam uses rate 1e−4 and batches of 32, accumulating instance gradients sequentially to manage memory. NeuroSAT uses 128-dimensional embeddings, 32 message-passing iterations, three-hidden-layer MLPs, Adam rate 2e−5, norm clipping 0.65 and batches up to 12,000 graph nodes. Auxiliary assignment prediction is added to both model families. [Main p. 5]

## Experiments

Eleven formula sizes from 100 to 600 variables in steps of fifty each contain 5,000 satisfiable and 5,000 unsatisfiable uniform random 3-SAT instances near the estimated phase transition. Each class is split 80:10:10 into training, validation and test, with the best validation epoch selected. The supplement identifies cnfgen generation and the march_hi lookahead solver for labels and one satisfying assignment. Its “11,000 total” sentence conflicts with eleven sets of 10,000; the stated per-set design implies 110,000. The formulas are deliberately balanced after labeling, not a proof that every finite-size phase-transition distribution has exactly 50% SAT probability. [Main pp. 4–5; supplement p. 1]

At 600 variables, exchangeable SAT-only/+assignment prediction accuracies are 81.1%/83.7%; random forest is 81.3%, and message passing SAT-only/+assignment reaches 81.6%/81.8%. Thus the SAT-only exchangeable model does not beat every feature-based comparator at every size. Across sizes, the two auxiliary-supervised architectures average approximately 78.9% and 79.1%. The claims concern classification accuracy, not solved-instance coverage. [Main p. 6, Table 1]

Training on 100-variable formulas and testing at 600 gives 80.9% for the exchangeable model, 73.9% for the random forest and 68.3% for message passing. This supports size transfer within this generated distribution, not transfer to arbitrary industrial SAT or unrelated native optimization tasks. CNN accuracy remains at most 50.5% after 48 hours; expensive nearest-neighbor tests remain below 53%. [Main pp. 5–7, Table 2]

The appendix reports auxiliary assignment agreement of roughly 70–73% with **one** solver-found assignment. It does not report checking those predicted full vectors against the CNF clauses. Adding size features to the eight-layer exchangeable network causes earlier overfitting and generally worsens single-size prediction. Leave-one-size-out mixed training helps some small sizes but can hurt larger ones: at 600 variables, +assignment accuracy is 76.5% versus 83.7% for same-size training. [Supplement pp. 1–3, Tables 3–5]

Training requires at least forty hours; reported per-instance memory is about 500 MB for exchangeable networks and 0.6–3.3 GB for message passing. Appendix C describes one allocated P100 GPU and memory budgets of 2 GB/20 GB for exchangeable/NeuroSAT scripts. The forward pass at 600 variables is over two orders of magnitude faster than the tested hand-engineered feature computation. The comparison does not replace exact labeling, witness construction or unsatisfiability proof by equally reliable neural answers. [Main p. 6 and Figure 2; supplement p. 1]

## Limitations

All results depend on balanced phase-transition random 3-SAT. The learned predictor has substantial classification error; no proof checker or exact fallback converts its output into a certified decision. Auxiliary assignment agreement conflates learning a particular label with finding any valid witness. The latent-space clause-removal paths and decreasing-variance plots are qualitative observations; concentration is stated as a conjecture, not a generalization theorem. [Main p. 7]

Printed supplementary details contain ambiguities beyond the total-instance typo: the forest uses 61 features but its feature-subsampling expression refers to log2(91), and hardware prose inconsistently describes processors/cores. Exact practical CPU topology or an unreported historical configuration is not inferred from these sentences.

## Reproducibility

All eight author-project accepted-paper pages and all three separately linked scientific appendix pages were read, including references, Appendices A–D, every result table, equations and plotted ablations. Key architecture/loss formulas, tables and latent/training plots were rendered and visually checked. Formal AAAI publication is 2020-04-03 from publisher-deposited metadata. The byline is Cameron, Chen, Hartford and Leyton-Brown at UBC. No identified arXiv version is substituted, and the author's misleading year in an alternate PDF filename is not treated as publication evidence. Publisher HTML/OpenReview API failures are logged; the explicitly linked scientific supplement is accessible and complete.

The official repository commit `1ab9def160f70242e5461580b9cacf682c7ad909` is dated 2022-11-04. Its sixteen-member/fourteen-file archive has no separate scientific PDF, TeX, notebook, video or archive. README and the assignment evaluation path were checked. In the current `train.py` single-instance batching branch, the assignment target loaded from data is immediately overwritten with the scalar SAT target (lines 576–577); subsequent assignment-loss/metric guards require length greater than one and are skipped for that scalar target. This is a specific public-release reproducibility limitation, not an independently demonstrated explanation of the historical paper's results.

The 1,731,623,466-byte public data ZIP was inventoried through HTTP range reads of its central directory only. It contains a directory and eleven raw-data `.tar.gz` members for the size sets; nested raw data were not downloaded, unpacked or counted as scientific reading. No model was trained, weights loaded, generated labels checked or benchmark reproduced. The current README provides a classification run command and optional experiment-logging configuration; this is not evidence of a deployed certified SAT solver.
