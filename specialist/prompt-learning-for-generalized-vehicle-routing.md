---
id: prompt-learning-for-generalized-vehicle-routing
short_title: PromptVRP
title: Prompt Learning for Generalized Vehicle Routing
authors:
- Fei Liu
- Xi Lin
- Weiduo Liao
- Zhenkun Wang
- Qingfu Zhang
- Xialiang Tong
- Mingxuan Yuan
year: 2024
date: '2024-05-20'
publication:
  date: 2024-08
  source_url: https://www.ijcai.org/proceedings/2024/771
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2024/771
institutions:
- City University of Hong Kong
- Southern University of Science and Technology
- Huawei Noah's Ark Lab
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
summary: A frozen POMO-style CVRP constructor uses fixed feature-cluster keys to retrieve learned continuous prompt
  tokens for its encoder. One checkpoint supports scale/coordinate-distribution transfer within CVRP; top-k prompt
  and symmetry evaluation add inference budget, and broad all-baseline superiority is not uniform.
arxiv_url: https://arxiv.org/abs/2405.12262
code_url: https://github.com/FeiLiu36/PromptVRP
figure:
  path: paper-assets/prompt-learning-for-generalized-vehicle-routing/framework.png
  alt: Frozen feature encoder retrieves a key-prompt pair; selected continuous tokens are reshaped and injected
    at six layers of the frozen routing encoder before autoregressive decoding.
  caption: 'Original arXiv Figure 4: PromptVRP feature extraction, prompt retrieval and prompted constructor.'
  source_url: https://arxiv.org/pdf/2405.12262v1#page=11
---

# PromptVRP: Prompt Learning for Generalized Vehicle Routing

> **TL;DR:** PromptVRP learns continuous encoder tokens around a frozen CVRP solver and retrieves them using fixed feature-cluster keys. It is **specialist/constructive**: generalized refers to scales and coordinate distributions within CVRP, rather than a shared checkpoint across different native optimization problems. These are neural embedding prompts, not natural-language LLM instructions.

## Motivation

A policy trained on one routing distribution can degrade on other geometries or sizes. Retraining all parameters or meta-learning a generalized model costs computation. PromptVRP instead reuses a frozen CVRP100 policy and learns a small pool of prompts across many CVRP distributions, enabling inference without per-test-instance gradient updates. [Overview.](https://www.ijcai.org/proceedings/2024/0771.pdf#page=1)

## Contributions

- A frozen feature encoder pools and concatenates intermediate attention representations to identify an instance's distributional features.
- Fixed K-means keys retrieve learned continuous prompts; only prompts are optimized.
- Prompts add tokens at each encoder layer before the frozen autoregressive decoder constructs a feasible route.
- Synthetic distribution shifts, token/prompt-count ablations and115CVRPLIB cases evaluate zero-shot transfer and the inference trade-off. [Method.](https://www.ijcai.org/proceedings/2024/0771.pdf#page=3)

## Methodology

### Retrieval and prompted construction

Node features are coordinates and capacity-normalized demand. A six-layer attention encoder supplies pooled pre-normalization representations, concatenated and standardized into a768-dimensional feature. Key construction samples128instances from each of341distributions,43,648instances total, groups them into four size groups and clusters each group. The main pool has16fixed keys and associated trainable prompts.

Each prompt has6x5x128=3,840parameters: five128-dimensional tokens per encoder layer. The prompt tokens are concatenated into successive hidden layers, while only original node embeddings are passed to the decoder. The decoder uses masked attention and sequential customer selection with capacity state. Base feature/solver weights and keys remain fixed; prompt updates occur during offline training. Top-k inference tries several retrieved prompts and retains the best constructed tour. This is repeated construction, with no learned complete-tour edit operator. [Equations3-9.](https://www.ijcai.org/proceedings/2024/0771.pdf#page=3)

### Training description and released code

The manuscript describes shared-baseline REINFORCE with multiple starting customers and refers to greedy construction in its training subsection. The inspected official `Train/VRPModel.py` instead samples via `multinomial` while the model is training and uses argmax for greedy evaluation; `VRPTrainer.py` explicitly freezes encoder/decoder parameters. The stochastic training branch is recorded as a concrete code/text distinction, without claiming the original runs were reproduced.

## Experiments

### Training distribution and budget

The341training distributions combine31sizes50,55,...,200with11coordinate distributions: uniform, a single Gaussian and nine Gaussian mixtures with three/five/seven clusters and scales10/30/50. Demands are integers1-9 normalized by capacity ceil(30+n/5). Training cycles distributions rather than treating every sample as a different native optimization problem.

The paper specifies batch64, at most10,000epochs,1,000instances per epoch and learning-rate decay1e-3to1e-5. It reports2.5days on an RTX2080Ti11GB. Table1's approximately one-day cost is an adjustment to a25GB-GPU/larger-batch setting for comparison with meta-learning, not the same measured2080Ti run. Frozen backbone pretraining and key preprocessing are additional prerequisites; prompt-training time alone is not full model-development cost. [Setup.](https://www.ijcai.org/proceedings/2024/0771.pdf#page=5) [Full generation details.](https://arxiv.org/pdf/2405.12262v1#page=10)

### Synthetic performance and inference trade-offs

Synthetic comparison tables average1,000instances per distribution. HGS runs5/10/20seconds per instance for50/100/200nodes; LKH uses5/10/60seconds. These are finite heuristic references, and LKH is explicitly not fully converged on some instances. Table times aggregate each1,000-instance set, rather than reporting single-instance latency.

Prompt top-8 with augmentation reports gaps1.31%,1.26%,2.56% on uniform50/100/200. More prompt evaluations cost inference: at200nodes, ordinary Prompt+augmentation takes89s for the set versus12minutes for top-8+augmentation. Single-prompt CVRP100 gap2.57% is worse than the frozen basic POMO2.18%; the broad all-baseline improvement wording is therefore not uniform.

On12unseen size/geometry combinations, single-prompt average gap is3.10%, versus Meta-POMO3.97% and Omni4.36%. With augmentation these are1.72%,2.50% and2.76%. Larger token counts often help other distributions but slightly worsen the displayed uniform100results, so token count is a budget/design choice rather than monotonic dominance. [Tables1-3/Figure2.](https://www.ijcai.org/proceedings/2024/0771.pdf#page=5)

### CVRPLIB and reference-objective boundary

The full appendix lists115instances:27A,23B,23P,22X and20XML. The main summary reports approximately3.5%single-prompt and2.5%top-8average gaps. XML is a counterexample to single-prompt superiority: Prompt6.1% is worse than basic POMO4.4% and multi-distribution POMO3.7%; top-8 is3.4%. Many individual rows favor other policies.

For A/B/P/X, the appendix explains that reference solutions prioritize vehicle count before route length, whereas the neural metric minimizes distance. A negative gap such as P-n55-k15 therefore does not establish beating an exact optimum for the same objective/protocol. XML references come from the cited exact solver study. X quality rows here cover100-200nodes; an illustration showing a979-node case is not itself a979-node quality experiment. [Complete Tables5-9 and discussion.](https://arxiv.org/pdf/2405.12262v1#page=12)

## Limitations

Evidence concerns one native CVRP task, selected demand rules and geometric shifts. Frozen retrieval cannot guarantee that an unseen task has a useful prompt, and a Euclidean nearest key is not an optimal-prompt certificate. No approximation guarantee, broad new constraint-family test or multi-training-seed uncertainty is provided.

Training-cost comparisons depend on hardware adjustments and exclude backbone preparation. Stronger top-k/augmentation settings consume extra inference work. CVRPLIB reference-objective differences and individual negative results qualify aggregate gains. No training or benchmark run was independently reproduced.

## Reproducibility

- Formal IJCAI2024 Main Track DOI10.24963/ijcai.2024/771, pages6976-6984, has August2024 publication precision from matching publisher/deposited metadata. Seven-author byline identifies CityU, SUSTech and Huawei Noah's Ark Lab; Zhenkun Wang and Qingfu Zhang correspond. ArXiv first submission is2024-05-20.
- **All9formal pages and all14pages of arXiv2405.12262v1 were fully read**, including complete references, AppendixA, generation/architecture details and every115-instance result. Both versions are independently registered, with their actual layouts and reading coverage.
- Official repository SHAe7390802544c250805f55bc27e598fc2612b8d10 has449entries. Its full README, scientific-file inventory and empty releases were inspected, together with relevant freeze/sampling code. The sole ZIP has423entries, including one1-page `CVRPLib/Fig_cvrplib.pdf`; that scientific illustration was separately registered, fully read and visually inspected. Its nested XML30.rar was inventoried with tar:20`.vrp`files plus directory, no additional scientific text. Dataset/archive inventory is not experiment reproduction.
- Original Figure4 is cropped from arXiv PDFpage11, rectangle(51,49,565,357), at4x and actually viewed in full. Main method/training equations, all numerical tables, frequency plots and every appendix result table/illustration were rendered and inspected.
- Thirteen internal references have explicit body citations with matching bibliography identities. BQ-NCO's older Generalizable title is tied to arXiv2301.03313's established version chain; independent journal extensions and uncatalogued methods are not forced onto unrelated conference IDs.
