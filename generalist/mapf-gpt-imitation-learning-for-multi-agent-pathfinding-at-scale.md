---
id: mapf-gpt-imitation-learning-for-multi-agent-pathfinding-at-scale
short_title: MAPF-GPT
title: 'MAPF-GPT: Imitation Learning for Multi-Agent Pathfinding at Scale'
authors:
- Anton Andreychuk
- Konstantin Yakovlev
- Aleksandr Panov
- Alexey Skrynnik
year: 2025
date: '2024-08-29'
publication:
  date: '2025-04-11'
  source_url: https://doi.org/10.1609/aaai.v39i22.34477
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v39i22.34477
institutions:
- AIRI
- Federal Research Center Computer Science and Control of the Russian Academy of Sciences
- Moscow Institute of Physics and Technology
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Path Planning
problems:
- Multi-Agent Pathfinding
- Lifelong Multi-Agent Pathfinding
summary: A behavior-cloned decentralized transformer constructs MAPF movements and reuses its6Mcheckpoint zero-shot
  for lifelongMAPF; corrected evaluations, cost-to-go inputs and negative throughput comparisons qualify its generality.
arxiv_url: https://arxiv.org/abs/2409.00134
code_url: https://github.com/CognitiveAISystems/MAPF-GPT
figure:
  path: paper-assets/mapf-gpt-imitation-learning-for-multi-agent-pathfinding-at-scale/framework.png
  alt: Original Figure1 shows scenario generation, LaCAM expert labels, tokenization and imitation training.
  caption: Original Figure1 and full caption show MAPF-GPT training from expert trajectories, not an optimality
    certificate.
  source_url: https://arxiv.org/pdf/2409.00134v5#page=4
---

# MAPF-GPT: Imitation Learning for Multi-Agent Pathfinding at Scale

> **TL;DR:** MAPF-GPT behavior-clones a centralized MAPF expert into a decentralized transformer policy from one billion observation/action pairs. The same 6M checkpoint is also tested without retraining on lifelong MAPF, supporting limited **generalist/constructive** transfer between these two native variants, rather than unrestricted cross-domain solving.

## Motivation

Decentralized multi-agent pathfinding must coordinate movements from limited observations. The paper investigates whether large-scale imitation learning can replace dedicated online communication and search modules while retaining useful performance on unseen map layouts. [pp. 1–3]

## Contributions

- Generate a large LaCAM expert dataset and tokenize local map/agent information.
- Train 2M, 6M and 85M non-autoregressive transformers to sample movement actions.
- Evaluate map/density transfer, input ablations and both zero-shot/fine-tuned lifelong MAPF. [pp. 3–7]

## Methodology

LaCAM receives 10 seconds per training scenario. Duplicate observations and 80% of wait-at-target examples are filtered. The context contains 256 tokens: 121 for an 11×11 cost-to-go patch, plus nearby-agent positions, goals, five-action histories and greedy directions for up to 13 agents. A 67-token vocabulary handles numbers, actions, special directions and padding. A decoder-style transformer without causal masking predicts one of five actions through cross-entropy training and multinomial sampling. [pp. 3–5]

The policy uses cost-to-go and greedy-direction **input features**, despite the absence of an additional online search/communication decision module. It should not be described as requiring only raw obstacles. Classical MAPF seeks paths to fixed goals; lifelong MAPF repeatedly assigns new goals and measures throughput. Table 2 explicitly reuses the original 6M policy in zero-shot mode, separately from a policy fine-tuned on 90M RHCR examples. This actual reuse establishes the limited two-variant scope; different map families alone would not. [pp. 5–7]

## Experiments

Training scenarios use 17–21-square random/maze maps with 16/24/32 agents. Evaluation covers Random, Mazes, Warehouse, Cities-tiles and Puzzles, with success rate, relative SoC, throughput and runtime. The 85M model takes 243 hours on four H100s, 6M takes 50 hours on two A100s, and 2M takes 12 hours on one H100; these costs exclude nearly 100 hours of expert data generation. [Appendices B–D]

The **read v5 corrects SCRIMP results** following a technical evaluation error discovered after the AAAI conference, explicitly noted on p. 6. Its corrected comparisons favor MAPF-GPT on Random/Mazes, while SCRIMP is superior on Warehouse above 128 agents. Removing action history improves Mazes success from 74.6% to 85.8%; removing goal information improves Cities-tiles from 82.0% to 88.4%. The complete input is not uniformly best. [Figure 3; Table 1]

Zero-shot/tuned lifelong Warehouse throughput is 1.113/1.270, below RHCR 2.352, Follower 2.731 and MATS-LP 1.701. Every Table 2 row remains below those three comparators even after tuning. Runtime speedups concern the next joint action for all agents, on one RTX3080Ti, averaged over five seeds; they are not total planning time including data/training. [Table 2; Figure 5; Appendix D]

## Limitations

There is no theoretical optimality or completion guarantee. Cost-to-go features are crucial: removing them reduces Random success from 97.6% to 25.8% and Warehouse from 94.1% to 11.5%. Local context truncation, expert quality and large training/data requirements limit applicability. Expert trajectories are time-limited LaCAM solutions, not certified optimal labels; about 3% of generated scenarios failed and were excluded. [Table 1; Appendices C/E]

Zero-shot applicability to lifelong MAPF is distinct from a performance advantage, and fine-tuned results belong to a different checkpoint. Generality is limited to the demonstrated classical/lifelong pair, without evidence for arbitrary combinatorial tasks. [p. 7]

## Reproducibility

Read all **12 pages of arXiv v5**, including the complete bibliography and scientific Appendices A–F; inspected all three contact sheets and original Figure 1/full caption. Actual arXiv history gives v1 **2024-08-29**, v5 **2025-04-08**. The publisher DOI independently establishes AAAI2025, four authors, pages 23126–23134 and publication **2025-04-11**. The corrected reading copy is not presented as byte-identical to the accepted/formal version.

The [pinned author release](https://github.com/CognitiveAISystems/MAPF-GPT/tree/d6307447ddc6bc2b7bf5da4f81d4e0707fbc8fa3) has 117 tree entries and no extra scientific PDF/TeX/notebook. The full README documents dataset generation, training, benchmark configurations, Docker and Hugging Face data/weights. Manuscript and current README dataset sizes are approximately 258/256 GB, respectively. No weights were deserialized, no large dataset was downloaded, and benchmarks/training were not rerun. No exact current-catalogue body-plus-bibliography target was established for an internal edge.
