---
id: neur2sp
short_title: Neur2SP
title: 'Neur2SP: Neural Two-Stage Stochastic Programming'
authors:
- Justin Dumouchelle
- Rahul Patel
- Elias B. Khalil
- Merve Bodur
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/9793671e4be9858a69a32545204d59d1-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/9793671e4be9858a69a32545204d59d1-Abstract-Conference.html
institutions:
- University of Toronto
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Integer Programming
problems:
- Two-Stage Stochastic Programming
summary: Separate fixed-instance neural recourse surrogates support fast scenario-set optimization, without certifying
  the original stochastic optimum.
code_url: https://github.com/khalil-research/Neur2SP
---

# Neur2SP: Neural Two-Stage Stochastic Programming

> **TL;DR:** Regress second-stage value functions and embed a small ReLU predictor in a MIP to select first-stage decisions. The expected-value model makes the embedded surrogate compact across scenario counts, but exact surrogate optimization does not certify the original stochastic optimum.

## Motivation

An extensive formulation (EF) of a two-stage stochastic program replicates recourse variables and constraints for every scenario. Integer or nonlinear recourse can make these models expensive even when a useful first-stage decision is needed quickly. Neur2SP replaces repeated recourse structure with an offline-trained value approximation (Sections 1–3).

## Contributions

- **NN-P:** predict the value of one scenario's recourse problem and embed one predictor per scenario.
- **NN-E:** aggregate a variable-size scenario set into an embedding and predict its expected recourse value with one embedded small network.
- Test this common modeling framework on four stochastic-program families with separately trained models. Shared implementation and varying scenario counts do not demonstrate unchanged weights across native optimization tasks.

## Methodology

**Preserved and approximated components.** For first-stage decision x, the true objective is its deterministic cost plus expected optimized recourse Q(x, ξ). The surrogate retains the first-stage feasible set and cost, replacing Q or its expectation with a regressor. Fixed-x recourse solves supply training labels. This is value-function regression followed by optimization, rather than direct decision imitation or differentiation through the recourse optimizer (Sections 2–5).

**Two embeddings.** NN-P receives x and a scenario ξ; a weighted sum of K predictions approximates expected recourse and introduces K copies into the surrogate MIP. NN-E applies a shared scenario encoder to each probability/scenario pair, mean-aggregates these embeddings and applies another embedding network. With scenarios fixed, that set embedding is computed outside optimization; a small ReLU head takes x and the embedding. Only this head is replicated once inside the MIP. Thus embedded MIP size is independent of K, while reading/encoding the K scenarios still costs work (Sections 4–5; supplement A).

**Exactness boundary.** Indicator constraints encode the chosen ReLU network's forward computation exactly. They do not encode the original recourse function exactly or bound its prediction error. An optimal surrogate MIP solution therefore has no demonstrated global-optimality certificate for the original 2SP. First-stage feasibility is retained, but original recourse feasibility still depends on the problem/model assumptions and subsequent evaluation. For example, CFLP explicitly permits expensive unmet-demand slack to obtain relatively complete recourse. A solver-representable first stage and usable sampled labels remain practical requirements despite the framework's broad “structure-agnostic” description (Sections 3–5; supplement B).

**Training unit and costs.** Each fixed base instance/problem configuration gets its own model and data; a model is then reused for different scenario sets/counts of that base problem. NN-P uses 10,000 decision/scenario examples; NN-E uses 5,000 examples with up to 100 sampled scenarios per example. The split is 80/20. Data generation solves recourse subproblems with 43 CPU processes. Combined generation/training is material: Table 2 gives NN-E 2,490 seconds for CFLP10 and up to 10,875 seconds for an integer investment configuration; NN-P costs roughly 140–1,004 seconds. These offline costs are separate from reported surrogate solve times (Sections 5–6; supplement C).

**Model selection.** One hundred random hyperparameter configurations are evaluated per problem. The supplement specifies optimizer, batch size, regularization, dropout and layer sizes: NN-P uses 1,000 epochs and an embedded hidden dimension of 32/64; NN-E uses 2,000 epochs and an embedded hidden dimension chosen from 64/128/256/512, with a separate deeper scenario embedding. The tables do not establish that the headline online runtime includes all hyperparameter-search cost (supplement D).

## Experiments

**Tasks and implementation.** Capacitated facility location (CFLP), server location (SSLP), investment (INVP) and pooling (PP) cover binary/continuous first stages and mixed-integer or nonconvex recourse. Investment uses two first-stage continuous variables and four binary/integer recourse variables with technology variations; pooling uses sixteen binary first-stage variables and eleven continuous recourse variables. Experiments use Gurobi 9.1.2, PyTorch 1.10, scikit-learn 1.0.1, Xeon E5-2683 CPUs and a P100 GPU. The main EF budget is three hours (Sections 6 and supplement B–C).

**What the timing measures.** NN-E surrogate solve times in the main tables are 0.11–1.66 seconds. This is online optimization of the already trained surrogate, excluding data generation, training/model selection and separate original-recourse reevaluation. Constant embedded size is not constant end-to-end cost. NN-P grows with scenario count and sometimes reaches the time limit without a feasible surrogate solution on large investment cases. Conversely, on tiny investment instances EF can be both faster and more accurate: INVP_I_H_4 takes EF 0.02 seconds versus NN-E 0.35 seconds, with NN-E 13.78% worse; INVP_B_E_4 is 0.02 versus 0.36 seconds and 9.54% worse (Tables 3–6).

**Objective and reference definitions.** Main tables evaluate returned first-stage decisions using the original second-stage problems, not merely the neural prediction. Their percentage difference compares this true objective with EF's incumbent after its budget; it is not a certified optimality gap unless that EF optimum is established. The −102.69% SSLP10_2000 difference reflects a poor EF incumbent and signed objective values, rather than a 102% reduction in a known optimality gap. CFLP rows average ten scenario-set instances and SSLP rows eleven, including a SIPLIB instance; investment and pooling rows each represent one instance (Tables 3–6).

**Certified-reference subset.** Supplemental Table 14 separately compares SIPLIB cases to known optima. NN-E attains zero gap on the five SSLP10_50 cases with 50–2,000 scenarios, whereas EF reaches 28.64% and 51.24% gaps on the two largest within its budget. For SSLP15_45 with 5/10/15 scenarios, NN-E gaps are 0.46/1.57/0.53%, so these are high-quality approximations rather than uniformly optimal solutions.

**Negative cases and surrogate error.** Pooling NN-E is worse than EF by 3.25–9.06% across Table 6; NN-P is worse by approximately 36.64–41.32%. Linear regression also beats NN-E on the three SSLP15_45 true-objective rows in supplemental Table 11, despite often performing poorly elsewhere. Predicted surrogate values and actual objective values can differ substantially: PP125 has NN-E surrogate objective 189.75 but true profit 264.30. Accuracy on sampled validation decisions does not by itself control errors at decisions selected by surrogate optimization (supplement Tables 10–13).

**Ablations and comparison scope.** Validation-MAE plots show substantial sensitivity to random hyperparameters. The training-set-size experiment is confined to CFLP10_10 and exhibits diminishing validation-error improvement beyond roughly 5,000 samples; it is not a universal 2SP sample-complexity result. Comparisons primarily target the generic EF baseline and a linear surrogate. The cited progressive-hedging timings come from different hardware and are explicitly not a controlled head-to-head experiment (Section 7; supplement D–E).

## Limitations

### Discussed in the Paper

NN-P's replicated networks scale poorly with scenario count, while NN-E requires more offline data-generation/training effort. Limited parallel resources can favor NN-P. The authors leave more comprehensive comparisons with problem-specialized algorithms, improved architectures and other optimization settings to future work (Sections 6–7).

### Curator Notes

This is a specialist surrogate-optimization framework under the repository's shared-model criterion: experiments train for fixed base instances/configurations and demonstrate scenario-set transfer, not one model across CFLP, SSLP, investment and pooling. Preserve the distinction between the surrogate's exact solve, original-objective reevaluation, EF-incumbent differences and the smaller known-optimum SIPLIB subset. None of these results establishes a general original-problem optimality or error guarantee. Offline labeling, tuning, inference and original recourse evaluation must all be counted for an end-to-end deployment comparison.

## Reproducibility

- **Publication:** [NeurIPS 2022 proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/9793671e4be9858a69a32545204d59d1-Abstract-Conference.html); official HTML metadata explicitly gives publication date `2022-12-06`. The PDF and official repository BibTeX list Justin Dumouchelle before Rahul Patel and mark them equal contributors; the publisher landing metadata reverses these two names. The note follows the reviewed PDF's order and names, including Elias B. Khalil.
- **Reading:** all fourteen publisher-paper pages and [eight supplement pages](https://proceedings.neurips.cc/paper_files/paper/2022/file/9793671e4be9858a69a32545204d59d1-Supplemental-Conference.pdf), including all benchmark equations, architecture details, objective tables, SIPLIB gaps, hyperparameter tables and figures. The publisher Supplemental link supplies this sole scientific supplement; official repository document inventory and both READMEs were manually checked, and its results notebook reproduces the published tables.
- **Code:** [author implementation](https://github.com/khalil-research/Neur2SP), with modular data generation, regression, model-to-MIP, evaluation and sequential/parallel runners. The README warns that the full experiments can take several days and requires separate SIPLIB data downloads. An available implementation is not a claim that this audit reran all solver/training experiments.
- **Citation graph:** the explicit related-work citation to Wu et al.'s scenario-representation paper is matched to the exact `cvae-sip` catalogue record; other stochastic-learning references were checked without replacing them with similar titles.
