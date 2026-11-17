---
id: enigmata
short_title: Enigmata
title: 'Enigmata: Scaling Logical Reasoning in Large Language Models with Synthetic Verifiable Puzzles'
authors:
- Jiangjie Chen
- Qianyu He
- Siyu Yuan
- Aili Chen
- Zhicheng Cai
- Weinan Dai
- Hongli Yu
- Qiying Yu
- Xuefeng Li
- Jiaze Chen
- Hao Zhou
- Mingxuan Wang
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/058460c719f190500568b341bd06875f-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/058460c719f190500568b341bd06875f-Abstract-Conference.html
institutions:
- ByteDance Seed
- Fudan University
- Institute for AI Industry Research (AIR), Tsinghua University
- Shanghai Jiao Tong University
- SIA-Lab of Tsinghua AIR and ByteDance Seed
code_url: https://github.com/BytedTsinghua-SIA/Enigmata
scope: study
paper_type: benchmark
problem_families:
- Constraint Satisfaction
- Planning
problems:
- Puzzle Reasoning
summary: A 36-task puzzle suite combines 30 procedural generators, automatic verifiers and multi-task language-model
  reinforcement learning.
---

# Enigmata: Scaling Logical Reasoning in Large Language Models with Synthetic Verifiable Puzzles

> **TL;DR:** Enigmata provides 36 textual puzzle tasks, a 4,758-instance evaluation set and a shared language-model training recipe. Thirty tasks have procedural generators; six use existing data pools. The trained Qwen and Seed models are separate experiments.

## Motivation

Logical puzzles offer objectively checkable supervision beyond mathematics and coding, but earlier resources trade off task diversity, difficulty control and scalable generation. Enigmata studies whether combining such tasks improves language-model reasoning and transfer (Sections 1–3).

## Contributions

The suite has three components: Enigmata-Data, Enigmata-Eval and a rejection fine-tuning plus reinforcement-learning recipe. Its 36 tasks cover crypto, arithmetic, logic, grid, graph, search and sequential puzzles. All have task-specific verifiers; Sections 3.2 and 4.2 explicitly distinguish 30 generated tasks from six fixed-pool tasks. Evaluation samples up to 50 instances per task and difficulty tier, yielding 4,758 rather than 5,400 instances.

This entry remains a benchmark study because the dataset and evaluation design are central. Its Qwen2.5-32B-Enigmata model is nevertheless jointly trained across tasks; the larger Seed1.5-Thinking-Enigmata model is a separate backbone and checkpoint, rather than the same model at another inference budget.

## Methodology

Generators vary task-specific quantities such as grid size, masking rate and graph density. Difficulty tiers use GPT-4o pass@1/10/100, estimated from 200 samples, rather than a problem-independent complexity certificate. The six existing-data tasks are Full Crosswords, Symbolic Hard, Big Bench Symbolic, Checkmate in One, Knights and Knaves, and FOLIO (Tables 11–13).

Rejection fine-tuning samples eight DeepSeek-R1 responses per puzzle and retains correct solutions. Appendix B reports 12,041 puzzle and 12,533 mathematical examples, including synthetic ARC data and Light-R1 mathematics. Qwen2.5-32B-Instruct is then trained using VC-PPO, with automatic correctness rewards, no KL penalty, critic value pretraining and separate policy/critic GAE parameters. Mix-training jointly uses Enigmata, ARC-AGI 1/2 and AIME 1983–2023; the alternative curriculum first trains on ARC/AIME and subsequently adds Enigmata while retaining earlier data. ARC evaluation therefore measures held-out instances after ARC-domain training, rather than zero-shot transfer to an unseen task family.

The main model is described as using 370 PPO steps. The matched strategy ablations use 425 total steps, including a 200+225 stage split; these settings should be kept separate. Appendix C reports two SFT epochs, a 32,768-token sequence limit, 6,144 prompt and 26,624 response tokens, batch size 4,096, mini-batch size 512, actor/critic learning rates of 1e-6/2e-6, and temperature 1.0.

## Experiments

Table 3 reports Qwen2.5-32B-Enigmata scores of 62.6% on Enigmata-Eval, 32.8% on ARC-AGI 1, 0.6% on ARC-AGI 2, 65.0% on KOR-Bench and 60.6% on AIME 2024. Evaluation averages four samples per problem, or 32 on AIME. Enigmata-Eval improves from 12.6% for the instruction model and 46.6% after RFT. It exceeds the listed o3-mini-high and o1 puzzle scores but remains below o4-mini-high's 65.1%; category and benchmark rankings vary. AIME decreases from the RFT model's 62.0%, and graph-puzzle accuracy falls from 55.1% to 54.0% after RL.

For the separate Seed model, with 20B active and 200B total parameters, adding 20K Enigmata examples to otherwise comparable RL training increases the reported AIME 2024/2025, BeyondAIME and GPQA Diamond scores by 0.8/1.9/0.4/0.8 percentage points (Table 5). These are reported finite-benchmark improvements, without uncertainty estimates establishing their significance.

Difficulty-mix, data-size, curriculum and single-domain SFT studies expose transfer tradeoffs. For example, balanced difficulty sampling gives 58.5% Enigmata accuracy versus 58.9% for the medium-heavy mix, while better preserving several other benchmarks (Table 6). Longer responses and code-containing outputs correlate with lower success in the response analyses; these observational partitions do not establish that shortening reasoning or removing code causes improvement. No code execution tool is used in that comparison.

## Limitations

The authors limit the suite to single-turn text and evaluate VC-PPO rather than a broad set of RL algorithms; most analyses use the Qwen backbone. Scaling data can also reduce earlier-task or out-of-domain performance. Puzzle correctness does not certify approximation quality, complete search, or industrial optimization performance.

### Curator Notes

The abstract and project overview describe a generator for every task, but the operational method explicitly has six fixed pools. Table 12 calls for shortest 8/15-puzzle paths, whereas the inspected public verifiers only simulate moves and check whether the goal is reached; they do not compare path length with an optimum. These scores should therefore not be presented as certified shortest-path accuracy.

Several implementation details remain underspecified or inconsistent in the article: the claimed 1:1 puzzle-to-math training ratio is not directly recoverable from Table 9's raw counts; the main text's four mini-batches do not match the straightforward 4,096/512 ratio in Appendix C; and Appendix C's 425-step setting differs from the main 370-step description. We retain both reported settings without inventing sampling weights or a reconciliation. Main results provide no confidence intervals or independent training-seed variation despite the checklist's statistical-significance answer. Appendix F also contains copied formatting instructions, such as rotation steps in the car-painting example; these do not change the task definition used in this note.

## Reproducibility

- Publication record: [NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/058460c719f190500568b341bd06875f-Abstract-Conference.html).
- Scientific source: the complete [49-page proceedings PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/058460c719f190500568b341bd06875f-Paper-Conference.pdf), including references, task specifications/examples, training details and checklist.
- [Official code](https://github.com/BytedTsinghua-SIA/Enigmata), [training data](https://huggingface.co/datasets/BytedTsinghua-SIA/Enigmata-Data), [evaluation data](https://huggingface.co/datasets/BytedTsinghua-SIA/Enigmata-Eval) and [Qwen checkpoint](https://huggingface.co/BytedTsinghua-SIA/Enigmata-Qwen2.5-32B) are linked by the authors. At inspected commit `b9c6f59f6d3f2ca97dd019bc02ca8f622575cf86`, the repository provides generators, verifiers, leakage checking and evaluation scripts; its tree does not contain the complete PPO training pipeline. The two-line requirements file alone is not a complete pinned training environment.
- The publisher's supplementary ZIP contains a README, sample task code/data, and two 180-record JSONL files, each with five examples per task. Its 90 entries include platform metadata but no separate PDF or video. OpenReview API title queries returned 403 for both API versions; no explicitly referenced missing scientific document was identified.
- Author order and the five affiliations above follow the PDF byline. The publisher HTML orders Jiaze Chen, Xuefeng Li and Qiying Yu differently; this source discrepancy is recorded rather than treated as a different paper. No citation edges to existing catalog entries were found after checking all 45 references against their body citations.
