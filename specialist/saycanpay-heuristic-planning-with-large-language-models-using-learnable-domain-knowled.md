---
id: saycanpay-heuristic-planning-with-large-language-models-using-learnable-domain-knowled
short_title: SayCanPay
title: 'SayCanPay: Heuristic Planning with Large Language Models Using Learnable Domain Knowledge'
authors:
- Rishi Hazra
- Pedro Zuidberg Dos Martires
- Luc De Raedt
year: 2024
date: '2023-08-24'
publication:
  date: '2024-03-24'
  source_url: https://doi.org/10.1609/aaai.v38i18.29991
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/29991
institutions:
- Örebro University
- KU Leuven
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Language-Guided Task Planning
summary: Domain-trained feasibility and payoff models guide LLM action-level beam search; separate domain models
  and negative OOD results qualify its planning gains.
arxiv_url: https://arxiv.org/abs/2308.12682
code_url: https://github.com/rishihazra/SayCanPay
figure:
  path: paper-assets/saycanpay-heuristic-planning-with-large-language-models-using-learnable-domain-knowled/framework.png
  alt: Original Figure1 contrasts feasibility and payoff scores for BabyAI action plans.
  caption: Original Figure1 and full caption explain Say, Can and Pay; the illustrated grid is not a visual input.
  source_url: https://arxiv.org/pdf/2308.12682v2#page=2
---

# SayCanPay: Heuristic Planning with Large Language Models using Learnable Domain Knowledge

> **TL;DR:** An LLM proposes actions, domain-trained BERT models score feasibility and discounted payoff, and action-level beam search constructs plans. The method is **specialist/constructive**: the domain models are trained separately, and performance gains are conditional on task, model and distribution.

## Motivation

Language-model plans can contain infeasible actions or unnecessarily long sequences. SayCanPay combines language generation with learned affordances and a long-term payoff estimate to improve offline planning without requiring a complete symbolic domain file. [pp. 1–3]

## Contributions

- Formulate language-model planning as search over action histories.
- Combine Say, Can and Pay scores, distinguishing token-level decoding from action-level search.
- Evaluate success, expert-length matching and out-of-distribution transfer in Ravens, BabyAI and VirtualHome. [Sections 4–7]

## Methodology

Vicuna-13B or Flan-T5-11B generates candidate action strings. Minimum edit distance maps them to an exhaustive environment action vocabulary; this is distinct from checking whether an action is feasible in the current state. Can uses BERT with contrastive positive/negative action examples. Pay uses BERT regression to discounted expert rewards, with negative actions assigned zero. Greedy-action selection combines the three scores; beam-action search retains multiple partial plans using accumulated, length-normalized scores. [pp. 4–8; Figure 2]

The LLM is not fine-tuned, but Can/Pay require **domain-specific expert trajectories**. Reusing an LLM or architecture across environments does not establish a single shared trained solver. Beam search extends partial plans; it is not a learned operator that revises a complete incumbent. Learned scores are not proven admissible or calibrated feasibility certificates. [Sections 5–7]

## Experiments

Training uses 800 expert trajectories per Ravens task, 400 BabyAI trajectories and about 800 compatible VirtualHome trajectories. Test sets usually contain 100 episodes; VirtualHome OOD uses 20. Success and cost-effectiveness are evaluated on separate test subsets. Cost-effectiveness counts successful plans having the expert plan's length; crowdsourced VirtualHome references are not guaranteed optimal. [pp. 8–9; footnote 5]

Beam SayCanPay with Vicuna attains 70/56/94/53 successful plans on Hanoi, blocks, BabyAI and VirtualHome. Gains are not uniform: Flan-T5 BabyAI success falls from greedy SayCanPay's 36 to beam's 30, while beam SayCan reaches 36. On OOD blocks, Flan-T5 greedy-token reaches 94 successes versus beam SayCanPay's 24; learned domain models can substantially hurt transfer. [Tables 3–5]

Paper training uses seven V100 GPUs, 20 epochs and batch size 50. Approximate reported decoding times are 9 seconds for greedy-token, 17 for greedy-action and 35 for beam-action. More search improves many outcomes at additional runtime; no uniform fastest or shortest-plan guarantee follows. [pp. 8–10]

## Limitations

Expert data, environment action vocabularies and domain-specific models remain necessary. Missing good candidate actions cannot be repaired by Can/Pay, and learned feasibility is fallible. OOD adaptability is limited; VirtualHome goal achievement also involves manual review of executed plans. Demonstrated cost-effectiveness is a reference-length metric rather than a proof of optimality. [Sections 7.3–7.5]

## Reproducibility

Read all **12 pages of arXiv v2**, including the complete bibliography and all scientific sections, and inspected all three contact sheets, tables and figures. No separately identified scientific appendix is omitted. Actual arXiv history gives v1 **2023-08-24**, v2 **2024-01-01**; publisher metadata independently identifies the three authors, AAAI2024 and pages 20123–20133.

The [pinned official release](https://github.com/rishihazra/SayCanPay/tree/1b0aeb9fe5bbeede104c3a1113df81f7a6c31e2e) has 705 entries with no extra scientific PDF/TeX/notebook/archive. Its complete README documents data generation, domain training and inference. Example settings use 30 Can epochs/20 Pay epochs and batch size 60, distinct from the manuscript's reported run. Benchmarks, expert generation and large-model inference were not rerun. No exact current-catalogue citation target was established after checking both body and full bibliography.
