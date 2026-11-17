---
id: agfn
short_title: AGFN
title: Adversarial Generative Flow Network for Solving Vehicle Routing Problems
authors:
- Ni Zhang
- Jingfeng Yang
- Zhiguang Cao
- Xu Chi
year: 2025
date: '2025-03-03'
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/b210c387381713a14a4f5a607aff3520-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2503.01931
institutions:
- Singapore Management University
- Singapore Institute of Manufacturing Technology (SIMTech), A*STAR
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A GFlowNet constructor learns a static edge heatmap with trajectory balance and a discriminator trained on raw versus search-refined routes; inference mixes greedy and sampled construction without local search.
figure:
  path: paper-assets/agfn/framework.png
  alt: A sparse graph generator constructs routes; training-only local search supplies positive examples for a discriminator whose scores enter generator rewards.
  caption: 'Figure 1: Adversarial GFlowNet training; inference retains only the constructor.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=5
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/b210c387381713a14a4f5a607aff3520-Abstract-Conference.html
code_url: https://github.com/ZHANG-NI/AGFN
---
# Adversarial Generative Flow Network for Solving Vehicle Routing Problems

> **TL;DR:** Train a GFlowNet route constructor against a discriminator that distinguishes generated routes from search-refined routes. At inference, use only the generator and mix95% greedy decisions with5% sampled decisions, keeping the best of100 routes. AGFN is fast and transfers well relative to selected baselines on large tests, but small-transfer quality is weaker and some large-instance quality gaps remain unknown.

## Motivation

Neural constructors can concentrate probability on a narrow set of routes, while larger Transformer training can be expensive. A GFlowNet instead aims to assign probability across rewarded solutions; a learned discriminator is introduced to shape its feedback. The proposal concerns a **constructive distribution over complete routing solutions**, rather than neural editing of an incumbent at test time. [Sections1-3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=3)

## Contributions

- A gated graph-network GFlowNet generator, trained with **trajectory balance**, not the flow-matching loss stated in the previous note.
- Alternating adversarial training: raw routes are negative examples and locally refined routes are positive examples for a squared-error discriminator.
- A per-decision greedy/sampling mixture, with a fixed inference candidate budget.
- CVRP/TSP size transfer, synthetic and library benchmarks, decoding/label-source ablations and an additional CVRP evaluation up to10,000 customers. These results use separate task/size checkpoints. [Sections3-4/AppendicesA-C.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=6)

## Methodology

### Static edge heatmap and trajectory balance

The input is a directed nearest-neighbor graph. Residual node/edge updates use sigmoid edge gates, mean aggregation, batch normalization and SiLU; an MLP predicts positive edge scores. Feasibility masks and normalization turn these into transition distributions as routes are constructed. A sigmoid score alone is not a normalized categorical policy. The paper describes coordinate/edge-distance inputs, whereas the released CVRP graph builder uses normalized demand as the node feature and distance as the edge feature. [Section3.1/Equations1-6.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=4)

The negative log reward combines one minus the discriminator score with route length minus the sampled mean length. Trajectory balance penalizes the squared mismatch between log source flow plus forward trajectory probability and log reward plus backward probability. The release learns logZ and computes a backward factor accounting for route permutations and reversals. At finite loss and with a changing discriminator reward, this is not a proof that the learned distribution exactly matches a fixed ideal reward distribution or finds a global optimum.

### Discriminator and training-only search

Raw generator routes receive label zero; search-refined routes receive label one. The discriminator minimizes squared score errors and its feedback enters generator training. The described positive-example search performs destruction/reconstruction and top-k selection; the ablation also substitutes LKH. **Local search supplies training examples and is not used in the main inference protocol.** [Section3.2-3.3/Figure1.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=5)

The operational release imports `netd.py`, a graph-based edge-scoring model, rather than the separate unused LSTM discriminator variant in `net_D.py`. Its training code scores selected transitions, exponentiates their log probabilities and aggregates them. It alternates four generator epochs with a discriminator epoch, with raw/positive update selection inside that discriminator phase. This code-level mechanism is more specific than the paper's abstract route-quality classifier description. It does not justify treating the score as a calibrated probability of optimality.

### Hybrid decoding and taxonomy

At every next-node decision, choose a sampled action with probabilityP and the greedy action otherwise. Training uses pure sampling with20 routes per instance; main testing usesP=.05 and100 routes. The mixture is applied during **new solution construction**, not as a hybrid construction/improvement solver. Only the generator remains at test time; no neural fine-tuning is performed. Classification remains **specialist / constructive** because TSP/CVRP and100/200/500/1000 training sizes have distinct checkpoints. [Section3.4.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=6)

The paper usesk=|V|/4 nearest outgoing edges; the release forcesk=N//5 and retains all depot connections. Both are fixed fractions of problem size, so edge count is still asymptotically quadratic. Sparse relative to a complete graph should not be described as a proven linear-memory solver.

## Experiments

### Instances, budgets and training disclosure

CVRP coordinates are uniform on the unit square, demands are integers1-9, and capacity is fixed at50 at the main200/500/1000 test sizes. Each test set has128 instances. TSP uses unit-square instances with the same sizes/counts. Hardware is a TeslaV100-32GB plus XeonGold6148. The main table time is **average seconds per instance**, and gaps use LKH-3 with100 trials as a heuristic reference. Negative values do not mean beating an optimum. [Section4/Tables1-2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=7)

The formal paper does not give enough exact offline training duration/epoch detail to equate total training cost across all comparators. Inspected CVRP defaults are5,000 epochs,20 minibatch steps, batch10, generatorAdamW learning rate.0007 and discriminator.001, with cosine scheduling, seed0 and additional reward/temperature schedules. TSP defaults differ, including500 epochs and10 training trajectories. These are **release defaults**, not a verified complete reconstruction of every published run; the release'sk=N//5 also differs from the paper.

### Synthetic CVRP and TSP

| Training/test protocol | AGFN result | Scope of comparison |
| --- | --- | --- |
| CVRP100-trained, test200 |31.2601 /8.41% /.17s | POMO with augmentation has1.20% and GANCO3.97%; AGFN is faster but weaker in quality. |
| CVRP100-trained, test1000 |133.9662 /1.65% /.72s | Better than displayed100-trained POMO/GANCO, but LKH1,000 gives124.5755 in66.57s. |
| CVRP500-trained, test1000 |129.0175 /-2.11% /.72s | Better than AGFN1000-trained129.6242: larger training is not uniformly better. |
| TSP100-trained, test1000 |27.1448 /17.39% /.75s | LKH100 gives23.1234, and10,000 trials give22.6784; substantial quality gap remains. |

At500/1000 test sizes, AGFN often improves both quality and time relative to the listed100-trained POMO/NeuOpt/GANCO models. This is a restricted comparison: some competitors are evaluated with model-size transfer and without their usual refinement; the paper deliberately disables local search for GFACS and other post-generation baselines. It does not compare with the complete strongest GFACS protocol. Some prose percentage improvements do not match the tabulated objectives, so the note uses raw table values. [Tables1-2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=8)

### Library and much larger tests

Table3 reports aggregate gaps17.95% on CVRPLIB and27.36% on TSPLIB, versus augmented POMO34.97%/50.02% and GFACS94.46%/102.01%. AGFN is faster in those aggregates, but these are not near-optimal results, and the paper does not enumerate enough individual library instances to infer exhaustive coverage or independent statistical significance. [Table3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=9)

AppendixC tests the100-trained CVRP model at2,000/3,000 nodes with128 instances each, and5,000/10,000 with64 each. It reports259.5364/2.61s,369.9986/4.03s,607.2905/7.13s and1,146.1652/14.60s. The available LKH1,000-trial reference gives gaps+1.13% and-3.60% for2k/3k, under a30-minute per-instance cap. **No LKH/reference gap is supplied at5k/10k**, so completing those sizes establishes scalability of execution, not certified high solution quality. GFACS/POMO results are present at5k but absent at10k; the prose claim that all other baselines fail already at5k overstates the table. [Table6.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=15)

### Ablations

Figure2 favors hybrid decoding over pure greedy/pure sampling across the displayed settings. Sensitivity tests considerP=.01,.03,.05,.07,.10. P=.05 is the chosen compromise and best for the displayed TSP cases, but CVRP1000 is slightly better atP=.03 (1.58% versus1.65%); it is not uniformly the best value. Figure3 on CVRP200 shows similar training curves for local-search versus LKH positive labels and a weaker non-adversarial variant. No repeated-training confidence interval or general convergence guarantee is established. [Figures2-3/Tables4-5.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=10)

## Limitations

### Discussed in the Paper

Performance depends on generator diversity/representation and is weaker on200-node transfer. More advanced graph networks, adversarial schemes and broader robust-solver comparisons are future work. [Conclusion.](https://proceedings.iclr.cc/paper_files/paper/2025/file/b210c387381713a14a4f5a607aff3520-Paper-Conference.pdf#page=10)

### Curator Notes

- Training-only search, test-time hybrid action selection and neural incumbent improvement are different mechanisms.
- A fixed-fraction neighbor graph remains quadratic; practical model/runtime gains do not prove universal asymptotic superiority over Transformers.
- Separate training sizes, disabled competitor refinement, heuristic references and missing5k/10k reference gaps limit broad superiority claims.
- Reward scores and finite trajectory-balance training are not optimality certificates; the adversarial target changes during training.
- Missing detailed offline compute, narrow library aggregates, release/paper parameter differences and absent training-seed intervals limit exact replication and significance claims.

## Reproducibility

- **Full reading:** all15 official ICLR pages, complete references and scientific AppendicesA-C. Full main/large tables, all three figures, reward/TB formulas and sensitivity tables were read; framework, curves, bars and key numerical tables were visually inspected.
- **Metadata corrected:** Singapore Management University and SIMTech/A*STAR replace the unsupported NTU affiliation. Four authors are confirmed. arXiv history gives first submission3March2025; official proceedings HTML explicitly gives publication1May2025. The generic22January notification was removed as an unsupported paper-specific acceptance date.
- **Scientific supplements:** actual proceedings landing has only Paper/Bibtex and no Supplemental link; the guessed Supplemental ZIP returns404. OpenReview forum API returns403, which is recorded without claiming access to unseen attachments. All scientific AppendicesA-C are included in the read final PDF, and no text points to missing scientific material. The43-entry official code tree has no PDF/TeX/notebook; its27-member HGS vendor ZIP was manually inventoried with no extra scientific document/image.
- **Code restored:** the paper and author README explicitly link [ZHANG-NI/AGFN](https://github.com/ZHANG-NI/AGFN), contradicting the old claim that no code was confirmed. Read selected complete generator/discriminator, training/reward/backward-probability, feasibility/graph-building, hybrid-decoding and positive-search functions. Checkpoints and synthetic test files are present; no upstream executable was run and no benchmark/training rerun is claimed.
- **Figure:** original complete Figure1/page5 from the formal proceedings PDF, showing discriminator/search training rather than asserting search is required at inference.
