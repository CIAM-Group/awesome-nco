---
id: puzzles-benchmark
short_title: PUZZLES
title: 'PUZZLES: A Benchmark for Neural Algorithmic Reasoning'
authors:
- Benjamin Estermann
- Luca A. Lanzendörfer
- Yannick Niedermayr
- Roger Wattenhofer
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/e5d1eaadeed651ba1021c09149db4b92-Abstract-Datasets_and_Benchmarks_Track.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/e5d1eaadeed651ba1021c09149db4b92-Abstract-Datasets_and_Benchmarks_Track.html
institutions:
- ETH Zurich
scope: study
paper_type: benchmark
problem_families:
- Constraint Satisfaction
- Planning
problems:
- Logic Puzzles
summary: A common RL interface exposes forty logic puzzles with adjustable sizes and difficulty.
code_url: https://github.com/ETH-DISCO/rlp
---

# PUZZLES: A Benchmark for Neural Algorithmic Reasoning

> **TL;DR:** Forty configurable logic puzzles become Gymnasium environments for RL and reasoning evaluation. Baselines train separate agents per puzzle; their performance depends strongly on observations, masking, reward sparsity and stopping rules. The reported “Optimal” reference is an action-count upper bound.

## Motivation

The paper seeks a broad set of procedurally generated puzzles for studying algorithmic reasoning in reinforcement learning. Adjustable sizes and difficulty levels allow controlled changes in task demands, while a common interface supports comparisons between RL methods. Completing these environments tests interactive puzzle solving, including cursor control and exploration, rather than isolating abstract reasoning from its interface (PDF pp. 1–4).

## Contributions

PUZZLES adapts all 40 games in Simon Tatham's Portable Puzzle Collection to Python/C, Pygame and Gymnasium. It exposes internal-state and pixel observations, discrete keyboard-style actions, reproducible generation parameters, optional state-repetition termination and custom reward wrappers. The paper supplies baseline RL comparisons, observation/masking ablations, selected size-transfer experiments and preliminary LLM/VLM evaluations (pp. 2–9, 15–39).

This is a benchmark contribution in the NeurIPS Datasets and Benchmarks track. The RL baselines use separately trained agents for the individual puzzles and configurations; the paper does not demonstrate a single checkpoint solving all 40 puzzle types.

## Methodology

Each episode starts from a generated puzzle. Actions move a cursor or alter the selected game object; action cardinality varies by game, up to 14. Internal-state observations have game-specific structure, while padded RGB observations provide a common visual format. The optional action mask removes actions that would not change state; it does not generally prohibit rule-breaking moves. Default rewards occur at successful completion or failure, with configurable termination and intermediate rewards (pp. 15–19, 27–31).

The main RL comparison uses small, easy configurations, five training seeds, internal-state observations and sparse terminal rewards. Evaluation uses 1,000 random episodes per policy with a 10,000-step limit. Methods include PPO, recurrent PPO, A2C, TRPO, DQN, QRDQN, MuZero and DreamerV3, largely using default implementation settings. The study reports roughly 10,000 GPU hours overall; the described hardware is NVIDIA RTX 3090 (pp. 5, 31–37).

Success rate and mean length of successful episodes are distinct metrics. The “Optimal” values are estimated upper bounds on actions needed to implement a solution, including cursor movement, rather than exact minimum solution lengths. Figure 3 aggregates results after excluding Loopy, Pearl, Pegs, Solo and Unruly, which were intractable for the baseline algorithms. Its aggregate must not be described as an unfiltered 40-puzzle score (pp. 5–6, 28–30, 34–36).

## Experiments

Baseline performance varies considerably by puzzle and metric. Some small puzzles are solved reliably, while others remain unsolved or close to a random policy. DreamerV3 often obtains shorter successful trajectories, but it does not dominate every success-rate comparison. Action masking substantially reduces successful-episode length in many settings; its effect is not uniformly positive for every success-rate aggregate (pp. 5–7, 34–36).

The size-transfer experiment uses a custom variable-input Transformer encoder with PPO on Netslide, Same Game and Untangle. Checkpoints selected on the training environment obtain larger-instance success rates of 18.6%, 9.4% and 87.3%, respectively. A separate † column selects checkpoints using the generalization environment itself; it raises some results, but includes target-environment model selection and should be distinguished from the first protocol. Training agents directly on harder settings in Table 1 is a different experiment (Table 3, p. 8).

A DreamerV3 ablation on a selected ten-puzzle subset compares 10,000/100,000-step limits and termination after repeated states. Longer episodes alone do not consistently help; repetition termination can help some puzzles and settings. Preliminary GPT-4o mini and Gemini 1.5 Flash evaluations give each model five attempts with instructions, current internal state, an image and the most recent action. They use masks, a five-repeat stopping rule and a per-puzzle upper-bound step budget, rather than the RL baseline's 10,000-step protocol. These models solve few of the tested configurations (pp. 8, 37–39).

## Limitations

Sparse rewards, default hyperparameters and discrete action spaces limit the baseline comparison. The cursor interface, observation representation, masking, time budget and treatment of failed episodes influence scores. A short mean trajectory conditional on success can coexist with a low success rate, so both metrics are needed. Failure of these baselines does not establish an inherent reasoning or learnability limit (pp. 5–9, 18, 33–38).

Some printed tables are not reconciled. For Netslide `2x3b1`, Table 1 gives PPO 35.3 steps/100% success, while Table 10 gives 1,612 steps/41.6%; the paper does not clearly explain a configuration difference for those entries. The two Untangle “Optimal” values in Tables 10–12 also appear reversed relative to Table 1 and the size-dependent reference formula. These entries should be checked against experiment configurations before numerical reuse. The note preserves the distinction between reported tables rather than choosing a single corrected result.

The LLM comparison is small and depends on the specific historical models and restricted interaction protocol. Procedural generation enables fresh instances, but does not alone prove absence of related training data or that the experiment isolates reasoning from visual and interface difficulties.

## Reproducibility

The full [40-page publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2024/file/e5d1eaadeed651ba1021c09149db4b92-Paper-Datasets_and_Benchmarks_Track.pdf) was reviewed, including all 73 references, 40 puzzle descriptions, parameter/action tables, detailed results and checklist. The [official proceedings page](https://proceedings.neurips.cc/paper_files/paper/2024/hash/e5d1eaadeed651ba1021c09149db4b92-Abstract-Datasets_and_Benchmarks_Track.html) links no separate scientific supplement. The author repository's file inventory contains no additional PDF or ZIP scientific attachment.

The [repository](https://github.com/ETH-DISCO/rlp) provides installation instructions, per-puzzle experiment commands, training/evaluation scripts and model-specific code. Its README, experiment instructions and relevant training/evaluation implementation were inspected. Installation requires Python, a C compiler, CMake and the relevant RL dependencies; the authors recommend Linux. The main training script evaluates 1,000 episodes and separately records success rate and successful-episode length, while the standalone evaluation script uses a different exploratory evaluation flow. Exact protocol/configuration matching is needed for reproduction. No training, game suite or API-model evaluation was rerun here.
