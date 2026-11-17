---
id: rl-eda
short_title: RL-EDA
title: Black-Box Combinatorial Optimization with Order-Invariant Reinforcement Learning
authors:
- Olivier Goudet
- Quentin Suire
- Adrien Goëffon
- Frédéric Saubion
- Sylvain Lamprier
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/goudet26a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/goudet26a.html
institutions:
- LERIA, Université d’Angers
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Black-Box Optimization
problems:
- QUBO
- NK Landscapes
- Categorical NK3 Landscapes
- Neural Architecture Search (NAS-Bench-101)
summary: A specialist online neural EDA constructs assignments with randomized variable orders and rank-based KL
  updates; gains depend on landscape, evaluation budget and implementation version.
code_url: https://github.com/GoudetOlivier/RL-EDA
figure:
  path: paper-assets/rl-eda/framework.png
  alt: Original Figure1 showing randomized generation orders, masked conditional networks, ranked population rewards
    and training orders.
  caption: 'Figure1: original RL-EDA generation and training phases, with complete caption.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/goudet26a/goudet26a.pdf#page=5
---

# Black-Box Combinatorial Optimization with Order-Invariant Reinforcement Learning

> **TL;DR:** RL-EDA optimizes a discrete black-box instance by repeatedly sampling complete assignments with randomized variable orders and updating conditional neural samplers from population ranks. Its strongest results are on larger synthetic landscapes with sufficient evaluation budget. Each instance is optimized from newly initialized parameters; this is a specialist online optimizer.

## Motivation

Classical estimation-of-distribution algorithms either neglect variable dependencies or explicitly learn a dependency structure. A fixed autoregressive order can also restrict which interactions are easily represented. RL-EDA instead learns masked conditional distributions and varies the generation order. Here order invariance concerns the order in which variables are generated, rather than a symmetry that permutes a solution without changing its objective. [pp.1–4]

## Contributions

- A population-based neural EDA combines independently randomized generation and training orders with critic-free, rank-based reinforcement-learning updates.
- Experiments compare binary QUBO/NK and categorical NK3 landscapes against a large Nevergrad portfolio and classical EDAs, with ablations for ordering, optimization budget, population size, KL penalty, critics and parameter sharing.
- A NAS-Bench-101 lookup experiment extends the method to mixed binary/ternary variables. This evaluates an existing architecture table rather than training newly discovered networks. [pp.5–9,23–49]

## Methodology

**Representation and construction.** For binary variables, the formal model encodes observed values as−1/+1 and missing values as0. A small MLP for each variable predicts its conditional distribution from a partially specified assignment. Sampling fills an initially empty assignment one variable at a time. Evaluated populations guide subsequent model updates; the neural action does not edit an incumbent complete solution. Parameter sharing in an ablation shares layers across variables within an instance, rather than providing one pretrained checkpoint for unrelated instances or problem families. [pp.3–6,44–46]

**Learning.** A generation order σG is sampled for each individual, while separate training orders σT expose different masks during optimization. Rank utility is U=1−2r/(λ−1), where lower rank is better. The default update uses an importance-ratio surrogate with a forward-KL penalty, rather than PPO clipping. The two sides of a ratio can condition on different variable subsets; it is therefore not automatically the ordinary on-policy PPO ratio. [pp.5–6,15–24]

**Default protocol.** Population sizeλ=10,50 Adam epochs per generation, learning rate.001, KL coefficientβ=1 and probability clipping[.001,.999] are used with the described single-hidden-layer20-unit tanh networks. Runs stop after10,000 objective evaluations or one hour. The objective is accessible only through evaluations; online optimization time is part of solving the instance. [pp.23–29]

## Experiments

| Setting | Evidence and scope |
| --- | --- |
| Synthetic suite |42 settings:18 QUBO and12 each NK/NK3; dimensions64/128/256;10 instances×10 restarts per setting |
| Binary comparisons |500 Nevergrad configurations plus PBIL/MIMIC/BOA:503 competitors |
| Ternary comparisons |496 Nevergrad configurations plus MIMIC/BOA:498 competitors; PBIL excluded |
| Evaluation |Mean best-so-far objective across100 runs, with reported ranks and significance annotations |
| NAS |21 binary and5 ternary variables; approximately510 million encodings but423,000 valid NAS-Bench-101 entries; invalid encodings score0 |

**Budget-dependent performance.** The default10,000-evaluation method has printed rank1 in27/42 settings in Table4:10/18 QUBO,8/12 NK and9/12 NK3. This is not a win on every landscape. All64-variable QUBO/NK settings have better-ranked competitors; NK3 with K=8 has RL-EDA ranks62/62/43 at dimensions64/128/256. At1,000 evaluations the default has rank1 in9/42 settings. The separately tuned fast variant—λ=5,100 epochs and curriculum dropout—has rank1 in22/42 at that shorter budget; it is a different protocol. The extra42 released ranking plots were also visually checked and show the importance of early-versus-late optimization behavior. [pp.7–9,30–32,39–43]

**Runtime.** For10,000 evaluations at dimension128, the reported CPU times are78s for CMApara,2,100s for BOA and690s for default RL-EDA; the V100 result for RL-EDA is300s. Batching100 dimension128 instances takes about20 minutes on that GPU. These figures include objective evaluation and are hardware/protocol-specific; the method does not establish universal wall-clock superiority. [pp.28–29,37]

**Ablations.** Larger populations help NK more consistently than QUBO; known interaction structure can accelerate early search while limiting later improvement. A critic is worse overall and approximately doubles computation, but wins significantly in seven Table8 cases. The within-instance shared-parameter variant helps the large1024-variable examples. NAS results are100-run table-lookup optimization curves, including1,000- and10,000-evaluation comparisons. [pp.33–47]

## Limitations

### Curator Notes

- **Theory qualification:** AppendixC's step from Eq.(27) to Eq.(28) replaces a conditional expectation despite the changed ordering/context. A full-support two-variable counterexample uses the same joint under both orders: P(00)=P(11)=.4, P(01)=P(10)=.1, reward1[x1=x2], behavior order(2,1) and target order(1,2). The telescoping expectation in Eq.(27) is0, while the resampling and ratio expressions in Eqs.(28–29) are−.3. Thus even identical joint distributions do not justify that printed step. This limits the general derivation, without refuting the measured benchmark outcomes. AppendixD's exchangeability argument establishes an unbiased estimator for its stated surrogate; it does not by itself prove global convergence. Finite neural conditionals also need not define the same compatible joint under every order. [pp.15–18,46–47]
- **Reported inconsistencies remain visible:** Tables6/7 print BOA's QUBO128,K4 score857.3, exceeding the listed best-other845.8 while assigning rank254. The large shared-model discussion says1028 in one passage versus1024 in Figure20. The dropout discussion's QUBO256 comparison has p=.1, rather than the stronger threshold used for other examples. These were not silently repaired. [pp.35,41–46]
- **Current code is versioned evidence:** In the inspected release, middle layers are held in a plain Python list and omitted from registered optimizer parameters; their gradients exist but Adam does not update them. The default also inserts an extra hidden stage relative to the described one-hidden-layer model. Binary input encoding `data*mask*2−1` makes an observed zero and a missing value identical, unlike the formal−1/+1/0 representation. These are current-release differences, not a reconstruction of the historical experiments.
- **Categorical regularization differs:** The release averages Bernoulli KL across categorical components. For distributions(.2,.3,.5) and(.3,.2,.5), that is.01797 versus categorical KL.04055. A fresh Adam optimizer is created each generation. Such implementation choices matter when reproducing the stated protocol.
- The competitor count includes configured portfolios and related optimizer variants, rather than503 unrelated new CO algorithms. Synthetic landscapes, lookup NAS, the one-hour cap and newly initialized per-instance models limit claims about transfer and expensive real-world objectives.

## Reproducibility

- **Publication:** [ICML2026 / PMLR306](https://proceedings.mlr.press/v306/goudet26a.html), publisher date2026-09-29; five authors at LERIA, Universitéd'Angers.
- **Full text:** All49 formal pages were freshly read, including the complete bibliography, Algorithm1 and integrated AppendicesA–U. All21 figures and nine tables were checked visually. Original Figure1 and its full caption illustrate generation orders, masks and rank-based training.
- **Companion inventory:** The publisher PDF contains the scientific appendices. The title-verified official event62945 exposes no additional downloadable scientific file; event video was not reviewed. OpenReview API access forbcRBqG8FFN returned403, so no inaccessible attachment was claimed as read. The complete primary and simplified code trees contain no additional PDF/notebook/archive supplement; the simplified README was read but its implementation was not audited.
- **Code:** [Author RL-EDA repository](https://github.com/GoudetOlivier/RL-EDA), untruncated862-entry treeeabe59991cc974290e03cbdbcb69e6f4a17ba2f0;863-member611,423,265-byte ZIP. The main README, full neural generator/update implementation, CLI/fitness mapping and all42 released ranking plots were checked. No pretrained neural checkpoint is required by the described per-instance procedure.
- **Local checks:** Exact finite-distribution arithmetic reproduces the stated Eq.(27–29) counterexample. Selected original model classes were executed on a tiny CPU example to verify parameter registration, mask encoding and KL semantics. These checks do not reproduce the full optimization benchmark.
- **Citation graph:** The complete bibliography and the main-text solution-symmetry discussion explicitly identify POMO and Sym-NCO; only those two catalogue links were added.
