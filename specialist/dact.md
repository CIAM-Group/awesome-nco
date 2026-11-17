---
id: dact
short_title: DACT
title: Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer
authors:
- Yining Ma
- Jingwen Li
- Zhiguang Cao
- Wen Song
- Le Zhang
- Zhenghua Chen
- Jing Tang
year: 2021
date: '2021-10-06'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2021/hash/5c53292c032b6cb8510041c54274e65f-Abstract.html
arxiv_url: https://arxiv.org/abs/2110.02544
code_url: https://github.com/yining043/VRP-DACT
institutions:
- National University of Singapore
- A*STAR
- Shandong University
- University of Electronic Science and Technology of China
- Hong Kong University of Science and Technology
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: DACT improves an existing route by separately encoding node identity and cyclic position, then learning
  pairwise local moves with PPO.
figure:
  path: paper-assets/dact/framework.png
  alt: Dual-aspect collaborative Transformer policy network with node and positional feature streams.
  caption: 'Figure 3: Architecture of the dual-aspect collaborative Transformer policy network.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2021/file/5c53292c032b6cb8510041c54274e65f-Paper.pdf#page=4
publication:
  date: '2021-12-06'
  source_url: https://proceedings.neurips.cc/paper/2021/hash/5c53292c032b6cb8510041c54274e65f-Abstract.html
---

# Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer

> **TL;DR:** DACT keeps node features and cyclic tour positions in separate attention streams, then combines their proposals to sample local improvement moves. The 2021 publisher paper and the authors' corrected December 2022 version have different CVRP results and timing protocols, distinguished below.

## Motivation

Adding node and position embeddings before attention mixes semantic and positional query-key terms. For an improvement policy, positions describe a current cyclic tour rather than a fixed input sentence. The paper argues that mixed correlations and linear positional encodings can introduce unwanted biases and hinder transfer to different tour sizes. These are architecture motivations and empirical observations, not proofs that conventional Transformers cannot encode tours.

## Contributions

- Separates node-feature embeddings (NFE) and positional-feature embeddings (PFE), with cross-aspect attention references instead of immediately adding them.
- Introduces cyclic positional encoding (CPE), inspired by cyclic Gray-code adjacency and reflection patterns.
- Aggregates action proposals from both streams and trains the improvement policy through n-step PPO with an initialization curriculum.
- Studies TSP and CVRP with separately trained problem/size models, representation ablations, and benchmark transfer.

## Methodology

**Improvement MDP.** A state describes the current complete solution. The action selects a node pair for a prescribed 2-opt, insert, or swap operator; the main results use 2-opt. Feasible moves are accepted even if they worsen the current tour. Reward is the nonnegative decrease in the **best-so-far** tour length. Actions are sampled during both training and inference. This differs from greedy acceptance-only descent. The corrected author version also resets the current tour to the best incumbent after a prescribed number of non-improving steps: 250 for ordinary inference, 10 for TSPLIB and 20 for CVRPLIB. [Publisher, Section 3; corrected v3, pp. 4,16.]

**Representation and encoder.** Each aspect has dimension 64. CPE uses periodic sinusoidal patterns with increasing wavelengths to represent adjacency across a tour boundary. It is a cyclic inductive bias, not an established guarantee that the complete policy is invariant to every rotation or reversal. Three encoder layers separately compute NFE and PFE self-attention. Each stream uses both its own attention weights and the other stream's weights to aggregate its own value features. Four heads have key/value dimension 16; residual connections, layer normalization and a 64-unit feed-forward layer complete each block. [Sections 4.1-4.2.]

**Decoder.** Global max-pooling information augments each stream. Four compatibility heads per aspect propose node-pair scores; an `8-32-32-1` feed-forward aggregator combines them. Tanh clipping uses constant 6. Masks exclude infeasible pairs, diagonal pairs and the previous action pair. CPE transfer is evaluated with either target-size frequencies or reused training-size frequencies, and the appendix reports the better of the two. This choice is an additional transfer protocol, not a single automatic size-independent setting. [Sections 4.3; v3 Appendix B.]

**CVRP and learning.** CVRP uses dummy depot copies to keep solution lengths fixed: 10 at size 20 and 20 at sizes 50/100. Seven node features include coordinates, distances to predecessor/successor and route-demand summaries. Models use PPO with a critic, clipped policy and value losses, and discount 0.999. The curriculum first improves random initial tours with the current policy and gradually increases these warmup steps, so training sees better starting solutions. Inference starts from greedy solutions. [v3 Appendices C-D.]

The corrected appendix specifies 200 epochs, 20 batches per epoch, batch size 600 (512 for CVRP100), three PPO updates, clipping 0.1, actor/critic learning rates `1e-4`/`3e-5`, and epoch decay 0.985. TSP uses four-step returns over 200 training steps; CVRP uses five-step returns over 250. Larger models may warm-start from smaller pretrained models. Reported CVRP training is about four days on one GPU, one week on two GPUs and two weeks on four GPUs at sizes 20/50/100. These are the corrected-version settings. [v3 Appendix E.1-E.2.]

## Experiments

**Original publisher results (2021).** Table 1 evaluates mostly 10,000 synthetic instances per setting, with footnoted baselines using other datasets/counts. TSP100 gaps fall from 1.62% at 1,000 moves to 0.61% at 5,000, 0.37% at 10,000 and 0.09% with four coordinate augmentations. Original CVRP100 gaps are 1.55% at 5,000, 1.12% at 10,000 and 0.19% with six augmentations, relative to LKH's heuristic reference. Negative CVRP gaps at size 20 mean a better cost than that reference, not a proof of optimality. The publisher's braces refer to **512 instances on one GPU**, while parentheses cover **all 10,000 using multiple GPUs**; these times must not be mixed. [Publisher, Table 1 and Section 5.1.]

**Author correction (v3, 1 December 2022).** The arXiv history and official repository explicitly report corrected CVRP feasibility masks, a corrected CPE formula and revised comparisons. TSP quality values above remain, but the revised CVRP100 results are 1.92% at 5,000, 1.51% at 10,000 and 0.57% with six augmentations, using a revised LKH reference. These are not the original publisher numbers. Revised Table 1 times all cover 10,000 instances: parentheses use one RTX 2080 Ti, brackets use four GPUs for TSP or eight for CVRP. At 10,000 moves, TSP100 takes 3.5 h/50 min and CVRP100 7 h/52 min, respectively; six-augmentation CVRP100 takes 41 h/5 h. Many baseline rows remain imported, and NLNS uses one GPU plus ten CPUs. [v3, pp. 7-9; official `new_version` README.]

**Transfer and ablations.** A size-50 TSP model evaluated at size 100 has 2.98% gap with CPE versus 7.93% with absolute PE. At 5,000 steps, dual-aspect DACT has 0.29 million parameters and 0.61% TSP100 gap versus the controlled single-aspect model's 0.37 million and 1.55%. Curriculum curves average five seeds with 90% confidence intervals. These support the tested representation/training choices while retaining a significant inference cost. [Tables 2b-3; Figure 7.]

The corrected benchmark appendix gives all 29 TSPLIB and 22 CVRPLIB instances up to 200 customers. With 10 runs and four/six augmentations, average gaps are 1.90%/3.85%, and best-of-run gaps 1.01%/2.97%. They are different statistics and budgets. DACT is not best on every instance: for CVRPLIB `X-n129-k18`, POMO has 0.97% while DACT's augmented mean is 3.91%. Original publisher Table 2 instead printed aggregate DACT gaps 2.07%/3.41%; those should not be substituted for the corrected appendix's averages. [v3 Appendix E.4, Tables 4-5.]

## Limitations

DACT is specialized to learned routing improvement and still requires problem-specific features, move operators, masks, dummy-depot choices and training. Thousands of sampled moves and repeated augmentations make it slower than fast constructors such as POMO. The corrected version explicitly recognizes stronger quality from DPDP. Cross-size transfer uses a best-of-two CPE frequency choice, and benchmark best-of-run values consume more search than one run. No approximation or optimality guarantee follows. The published and corrected code/text must be version-matched because feasibility handling, results, hardware and timing conventions changed.

## Reproducibility

- **Official code:** [yining043/VRP-DACT](https://github.com/yining043/VRP-DACT). The default archival branch warns about corrected CVRP masks; the [`new_version` branch](https://github.com/yining043/VRP-DACT/tree/new_version) README provides updated pretrained checkpoints, a notebook, training and evaluation commands, dummy-depot ratios, and CPE transfer settings. Instructions were inspected; experiments were not rerun.
- **Full reading:** All 12 publisher pages and all 18 pages of identified arXiv v3 were freshly read, including Appendices A-E and every benchmark row. Key formulas, algorithms, plots and tables were visually inspected. [Audit record](../data/reviews/papers/dact.json).
- **Supplement inventory:** The publisher landing links no Supplemental file, although its text explicitly refers to appendices. The complete appendices were obtained in the author-linked full arXiv version; no scientific appendix remains unread. The v3 correction date is recorded separately from formal publication.
- **Dates:** First arXiv submission 6 October 2021; formal NeurIPS 2021 publication. The previous conference-wide acceptance date was removed. Stable paper ID and formal eligibility remain unchanged by the author correction.
