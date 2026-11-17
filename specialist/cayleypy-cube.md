---
id: cayleypy-cube
short_title: CayleyPy Cube
title: A machine learning approach that beats Rubik's cubes
authors:
- Alexander Chervov
- Kirill Khoruzhii
- Nikita Bukhal
- Jalal Naghiyev
- Vladislav Zamkovoy
- Ivan Koltsov
- Lyudmila Cheldieva
- Arsenii Sychev
- Arsenii Lenin
- Mark Obozov
- Egor Urvanov
- Alexey Romanov
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/fb82011040977c7712409fbdb5456647-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/fb82011040977c7712409fbdb5456647-Abstract-Conference.html
institutions:
- Institut Curie
- Universite PSL
- Technical University of Munich
- Novosibirsk State University
- RTU MIREA
- Innopolis University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Rubik's Cube
- Cayley-Graph Pathfinding
- Pancake Sorting
- LRX Sorting
- Wreath Puzzles
- Globe Puzzles
- Periodic Sliding Puzzles
- Sliding Tile Puzzles
summary: Separately trained random-walk-depth regressors guide GPU beam search on permutation puzzles; independently
  trained ensembles shorten cube solutions without guaranteeing shortest paths.
code_url: https://github.com/khoruzhii/cayleypy-cube
---

# A machine learning approach that beats Rubik's cubes

> **TL;DR:** CayleyPy trains residual MLPs to predict random-walk depth from puzzle states and uses their scores in GPU beam search. Wider search and ensembles of independently trained models improve solution length. The same recipe is retrained for different groups; this is not evidence of one shared checkpoint solving every puzzle.

## Motivation

Large permutation-puzzle graphs are too large for ordinary exhaustive search, and training with bootstrapped shortest-distance targets can be expensive. Random walks from a known goal provide cheap supervised targets. The paper studies whether these imperfect depth estimates can still guide useful search on cubes and other permutation puzzles (Sections 1-2).

## Contributions

The work combines direct random-walk-depth regression, residual MLPs, batched beam search and best-path selection across independent agents. Empirical studies vary model/data size, beam width and ensemble size, and compare with cube solvers and Santa 2023 reference solutions. Further experiments retrain a fixed architectural recipe on 39 groups, plus an appendix extension to classical sliding puzzles.

The specialist classification reflects actual checkpoint scope: cube sizes/metrics and other groups have separate training runs and input dimensions. Appendix B.8 says each group is trained separately; the supplied Table 4 scripts start a fresh training process for each group/target. “Single agent” in the broad-puzzle claim means one independently trained agent per group, not one universally shared set of weights.

## Methodology

Training generates nonbacktracking walks from the goal. Each state is labeled with the number of moves used to reach it, rather than its optimal distance. A one-hot state representation feeds an MLP with residual blocks and batch normalization. Adam at learning rate 0.001 minimizes MSE; approximately one million fresh examples are generated per epoch. Cube walk horizons are 26/45/65 for 3/4/5-layer cubes. Model weights remain fixed during solving (Section 2; Appendices B.3-B.4).

Beam search expands retained states, removes duplicates using hashes and keeps the W states with smallest predicted depth until it finds the goal, repeats a visited beam or reaches a search limit. The main protocol uses 200 steps, while supplied general-group scripts use group-dependent limits. Neither the regressor nor finite beam search is an admissible shortest-path or complete-search guarantee. An ensemble runs several independently trained models and returns the shortest found solution; its cost includes those distinct searches and training runs (Section 2; Appendix B.5).

## Experiments

Table 1 compares QTM cube results on 1,000 DeepCubeA states separately from Santa's UQTM convention, which permits unfixed corners/centers. At width 2^18, a single 4M-parameter, ten-layer model trained on 8B states obtains mean length 21.14 and 75.4% optimality. At width 2^24, a single such model reports 97.3%, and 26 agents report 98.4% with mean length 20.67. The prose instead repeatedly says 97.6% for that ensemble; this discrepancy is retained below. A one-layer model at the wider beam reports 90.4% (Table 1).

On Santa's 43 four-layer cube scrambles, 29 trained agents reach mean length about 46.5 versus reference 53.5. On nineteen five-layer scrambles, 69 trained agents reach 92.2 versus 96.6, with shorter found solutions on every listed scramble. Only ten agents contribute selected best paths in the post hoc four/five-layer ensembles; that does not reduce the number actually trained to ten. These are improvements over best-known references, not certified optima. Figure 3's agent study uses 69 selected difficult three-layer states, whereas Table 1's summary uses all 1,000. Its error bands are standard errors across evaluated scrambles, not uncertainty over a new ensemble-selection/training experiment (Sections 3-4; Appendix B.6).

The same-hardware EfficientCube reproduction uses width 2^18 and similar mean lengths, **not** the costly 98%-optimal ensemble setting. Reported single-model training times are 3h02m36s versus 25h50m45s, and inference is 9.16 versus 237.9 seconds per scramble. The article calls this approximately 25.6-times faster; the printed times divide to approximately 26.0. This implementation-level comparison includes smaller networks, different training volumes and FP16/GPU optimizations. Overall research used approximately two months of continuous computation on two H100 GPUs, not only the three-hour example training run (Section 4.2; Appendices B.6 and B.9).

Training-size ablations often average only solved scrambles, initially on the first twenty cases. Longer training on 524B examples yields mixed per-instance changes, can reduce the solved fraction and fails under FP16 inference for those two extensively trained networks. The reported plateau therefore concerns a resource/quality tradeoff in these configurations, not a theorem that additional data cannot help (Section 3; Appendix B.7).

Table 4 retrains models for 16/128 epochs with width 2^20 across cubes, Wreath, Globe, periodic sliding, LRX and Pancake groups. A direct count gives 28/39 groups with 100% solved at 16M examples and 30/39 at 128M; the main text's 28/39 statement should be read alongside this table. The 128M model solves all tested Globe 6x10 instances on a group estimated at 10^145 states but fails several other groups, including all tested 6-layer cubes under these fixed settings. Four independent runs per group are described; additional-group tests use ten states each. Appendix B.8 separately reports classical 15-/24-puzzle optimalities of 100%/88% and solve times of 3.5/11 seconds, compared with DeepCubeA 99%/97% and 10.3/19.3 seconds. The 24-puzzle result trades some optimality for speed; periodic and classical sliding-puzzle experiments are distinct.

## Limitations

The research is explicitly empirical. Goal states and legal transition permutations are supplied; “zero knowledge” excludes handcrafted solving heuristics, not knowledge of the puzzle dynamics. Random-walk targets, finite beams, hash handling, training distribution and precision affect success. Large-cube reference sets are small and have no established optimal lengths. Reusing the evaluated cases for best-agent/ensemble analysis is not an independent held-out ensemble-selection guarantee. Extra agents or compute can help observed cases without proving universal success or optimality (Section 4.4).

### Curator Notes

The formal article is internally inconsistent on 26-agent three-layer optimality: Table 1 says 98.4%, Sections 4.1/5 say 97.6%; both should remain visible until resolved against source outputs. The statement that A models of P parameters are equivalent to one AP-parameter model is only an informal computational analogy, not a proved equivalence in accuracy or runtime. General-group scripts also use limits of twice the walk horizon, whereas the prose gives a generic 200-step cap. None of these observations is a rerun showing the reported path sequences invalid.

## Reproducibility

- All 23 pages of the [formal NeurIPS 2025 paper](https://proceedings.neurips.cc/paper_files/paper/2025/file/fb82011040977c7712409fbdb5456647-Paper-Conference.pdf) were read, including every reference, checklist, Appendices B.1-B.9 and all 39 Table 4 rows. Eight key diagram, result, design and generalization pages were visually checked. The conference year remains 2025; publisher HTML separately gives an online publication date of April 23, 2026, recorded in the publication field. The publisher's twelve-author forms are retained.
- The 35,871,141-byte publisher supplement was downloaded, hashed and integrity-checked. Its 341 ZIP entries contain code, puzzle data/weights, logs and documentation, with no scientific PDF or nested ZIP. Both README texts and requirements were fully read, as were the complete model/trainer modules and both Table 4 scripts. All scientific prose appendices are integrated in the read article. Manual OpenReview API v1/v2 exact-title queries returned 403.
- The [official repository](https://github.com/khoruzhii/cayleypy-cube) was checked at commit `f02604fa7b665b82e5fbe5692b336a4fe4a01bdc`: 304 files, no PDF/ZIP scientific attachment. Its full README and the separately linked `puzzle-15` branch README/tree were inspected; that branch contains no separate scientific PDF. The instructions expose group-specific checkpoints and data/metric choices. No training, search or supplied weight/puzzle execution was rerun. One exact existing-paper citation, to the original autodidactic-iteration cube paper, is registered.
