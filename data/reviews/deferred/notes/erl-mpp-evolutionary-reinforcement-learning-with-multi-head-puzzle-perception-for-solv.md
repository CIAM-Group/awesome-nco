---
id: erl-mpp-evolutionary-reinforcement-learning-with-multi-head-puzzle-perception-for-solv
short_title: ERL-MPP
title: 'ERL-MPP: Evolutionary Reinforcement Learning with Multi-head Puzzle Perception for Solving Large-scale Jigsaw
  Puzzles of Eroded Gaps'
authors:
- Xingke Song
- Xiaoying Yang
- Chenglin Yao
- Jianfeng Ren
- Ruibin Bai
- Xin Chen
- Xudong Jiang
year: 2025
date: '2025-04-13'
publication:
  date: '2025-04-11'
  source_url: https://api.crossref.org/works/10.1609/aaai.v39i7.32748
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v39i7.32748
institutions:
- University of Nottingham Ningbo China
- Nottingham Ningbo China Beacons of Excellence Research and Innovation Institute
- University of Nottingham
- Nanyang Technological University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Matching
problems:
- Eroded Grid Jigsaw Puzzle Assembly
summary: Shared local/global puzzle perception guides actor-critic-evaluator evolutionary swaps of complete grid
  permutations; main formal/arXiv reading is complete but the explicitly referenced reward-ablation supplement remains
  unavailable.
arxiv_url: https://arxiv.org/abs/2504.09608
figure:
  path: paper-assets/erl-mpp-evolutionary-reinforcement-learning-with-multi-head-puzzle-perception-for-solv/framework.png
  alt: ERL-MPP local/global perception and evolutionary actor-critic-evaluator swap loop.
  caption: OriginalformalFigure2withcompletecaption,p3/printed6970,extractedandvisuallychecked.
  source_url: https://ojs.aaai.org/index.php/AAAI/article/download/32748/34903
---

# ERL-MPP: Evolutionary Reinforcement Learning with Multi-head Puzzle Perception for Solving Large-scale Jigsaw Puzzles of Eroded Gaps

> **Review in progress:** Both the complete formal ten-page paper and its shorter nine-page arXiv version have been read. The formal paper explicitly refers to additional reward-ablation supplementary material that has not yet been obtained; full scientific verification remains open.

## Motivation

Large eroded gaps weaken fragment-boundary comparisons, while many pieces make exhaustive swapping expensive. ERL-MPP learns both a local/global assessment of the current assembly and a policy-assisted evolutionary search over swaps. The task is complete **grid-jigsaw permutation reassembly**, including 25-, 70- and 150-piece cases, rather than arbitrary archaeological geometry recovery (formal pp1–4).

## Contributions

- A shared multi-head puzzle perception network (MPPN) combines horizontal/vertical adjacency heads, a 2×2 puzzlet head, and a global discriminator.
- An actor proposes actions, a critic learns state values, and a separately soft-updated evaluator scores evolved action sequences.
- Expand two-piece swaps with three-piece and 2×2 puzzlet swaps, using action crossover/mutation and historical experience.
- Evaluate on the eroded JPLEG-5/JPwLEG-5 benchmark and large MIT grid puzzles, with component/action ablations and explicit runtime/model-size tradeoffs. The formal paper contains scientific results absent from the read arXiv v1 (formal Tables 1–7).

## Methodology

**Perception.** A U-shaped encoder/decoder combines convolution and Swin Transformer blocks. EfficientNet-B3-derived discrimination assesses a reconstructed whole puzzle; three local heads score horizontal pairs, vertical pairs and 2×2 groups. Weighted sums aggregate local evidence with global evidence. The formal version describes GAN pretraining of MPPN, followed by joint training with the actor/critic losses **without continuing adversarial losses** (formal pp3–6, Equations 1–3).

![ERL-MPP perception and evolutionary actor-critic-evaluator architecture](../public/paper-assets/erl-mpp-evolutionary-reinforcement-learning-with-multi-head-puzzle-perception-for-solv/framework.png)

*Original formal Figure 2 and complete caption, extracted from PDF p3/printed p6970 and visually checked.*

**Neural search.** Start with a complete grid permutation. The actor supplies candidate swap actions; combine them with historical actions, perform evolutionary crossover/mutation, score offspring with the evaluator, and execute the selected leading swap. Replay stores state/action/reward transitions. The critic supplies a temporal-difference advantage and the evaluator tracks its parameters by soft update. The policy objective is described as clipped and inspired by PPO, but its printed notation does not specify every implementation detail of a conventional PPO likelihood ratio; this note does not silently fill those gaps (formal Algorithm 1, Equations 5–10).

**Reward and stopping boundary.** Training reward combines absolute positions, correct neighbor relations, a perfect-assembly bonus and a step term. Those label-based rewards are training signals, not an oracle that is freely available on an unseen real puzzle. The learned evidence/evaluator is a surrogate and is not certified equivalent to ground-truth correctness. The paper's language “optimal action/sequence” refers to selecting among sampled/evolved candidates, without a global optimality or guaranteed-convergence theorem (formal pp4–6).

**Classification.** Specialist / improvement: learned actions directly swap an existing complete discrete grid assignment. No same-checkpoint evidence across different native combinatorial task families is provided. Larger puzzle counts and dataset transfers remain within jigsaw assembly (formal p4).

## Experiments

**Data and metrics.** JPLEG-5 contains 12,000 MET-derived puzzles, split 9,000/1,000/2,000; 534×534 images become 5×5 pieces with twelve-pixel gaps. MIT evaluation uses sixty images with 7×10 or 10×15 pieces, 64×64 pixels per piece, and two- or four-pixel gaps; training uses DIV2K. Perfect measures completely correct puzzles, Absolute correctly placed pieces, and Horizontal/Vertical correct directional neighbor relations (formal p6).

**Main outcomes.** JPLEG-5 PA/AA/Horizontal/Vertical are **18.6/52.7/56.5/57.3%**, versus PDN-GA **6.1/44.3/30.8/30.6%**. Painting puzzles are especially difficult: PA is only 3.3%, versus 24.4% for engravings and 28.1% for artifact images. On MIT, PA for 70-piece/two-pixel, 70-piece/four-pixel, 150-piece/two-pixel, and 150-piece/four-pixel settings is **50.0/13.3/8.3/0.0%**. The last is a tie at zero across all printed methods, so “strictly better on every metric in every setting” is unsupported. These tested improvements should not be promoted to universal current state of the art (formal Tables 1–3).

**Ablations.** Replacing SD2RL's perception with MPPN changes DQN PA from 5.1 to 9.8%; replacing DQN with EvoRL under the original perception gives 13.5%; combining both gives 18.6%. Formal Tables 5–6 additionally isolate 2×2/global heads and action families: two-piece-only PA is 10.0%, adding three-piece swaps 14.7%, and all action types 18.6% (formal p8). These tables are absent from arXiv v1 and were read in the formal copy.

**Budget and cost.** The formal configuration specifies actor/critic learning rates 0.001, evaluator soft-update factor 0.001, replay capacity **200,000**, batch 32, K=1,000, T=10,000 swaps, ten evolution iterations, population 64, crossover 90%, mutation 10%, discount 0.998, alpha 0.8 and perfect bonus 1,000. The arXiv v1's buffer value 100 differs and is not substituted for the formal value. Table 7 reports **36.2 h training / 53.9 s mean test time per puzzle / 102.1 M parameters**, versus SD2RL **30.7 h / 44.7 s / 44.2 M**. Improved quality thus has greater measured compute/model cost, rather than dominating speed as well (formal pp6/8).

## Limitations

**Empirical limits.** The solver remains imperfect on most hard examples, with no fully solved 150-piece/four-pixel MIT puzzles. Scores concern synthetic grid erosion and known rectangular layouts. Sampled evolutionary search and learned value estimates provide no exactness, monotone-improvement or finite-budget success guarantee.

**Unresolved specification.** Equation 4 adds b while prose calls it a penalty and the formal hyperparameter list prints b=1. The sign convention requires clarification. Equation 7 uses P(at|st) and an incompletely defined clipping function rather than unambiguously printing the usual old/new-policy ratio. No released implementation was identified to resolve these choices. They are reproducibility ambiguities, not evidence that the reported experiments were invalid. Likewise, soft updating alone is not a proof of absence of evaluator overfitting.

**Outstanding scientific material.** Formal p4 explicitly says more detailed reward ablations are supplied in Supplementary Material. The complete main paper, arXiv source archive and currently identified public sources do not contain that extra scientific document. Its results are not claimed reviewed, and the record remains `reading` until this gap is resolved.

## Reproducibility

**Identity and dates.** Formal metadata identifies AAAI 2025, volume 39(7), pp6968–6977, DOI [10.1609/aaai.v39i7.32748](https://doi.org/10.1609/aaai.v39i7.32748), seven authors and affiliations at University of Nottingham Ningbo China, University of Nottingham and Nanyang Technological University, including the Ningbo research institute. Publisher-deposited Crossref gives **2025-04-11** publication. The separately recorded first arXiv posting is **2025-04-13**; in this case it follows formal publication.

**Actually read copies.** All nine pages of [arXiv2504.09608v1](https://arxiv.org/abs/2504.09608v1) and all ten pages of an identifiable proceedings-formatted copy were independently read, including both full bibliographies. Direct official PDF and university repository requests returned access denials. The formal copy was retrieved through a public PDF mirror, with that retrieval URL separately recorded from the canonical publisher URL. Its exact title, full seven-author byline, proceedings header, continuous printed pages6968–6977, and additional Tables5–7 agree with the publisher's indexed PDF contents; it is not mislabeled as the shorter arXiv file. Key diagrams, reward/policy equations, algorithm and additional result tables were rendered and inspected.

**Inventory and remaining work.** The complete author-uploaded arXiv source archive contains the main TeX/bibliography/style files and five embedded figure PDFs, without an extra scientific appendix. A title-specific GitHub API search returned only an unrelated Erlang repository, which was excluded. No official code URL/checkpoint was confirmed. Further work is required to obtain the explicitly mentioned reward-ablation supplement and resolve implementation ambiguities; no reproduction run is claimed.

**Actual internal references.** Both versions explicitly cite [SD2RL](siamese-discriminant-deep-reinforcement-learning-for-solving-jigsaw-puzzles-with-large.md), Song et al.2023a, and [Solving Jigsaw Puzzles with Eroded Boundaries](solving-jigsaw-puzzles-with-eroded-boundaries.md), Bridger et al.2020. The former supplies the comparison/prior RL approach; the latter supplies an inpainting baseline and large-puzzle protocol context. Other topic-related papers were not assigned citation edges without an actual matching bibliography entry.
