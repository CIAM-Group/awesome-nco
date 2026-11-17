---
id: neural-combinatorial-optimization
short_title: PN-AC
title: Neural Combinatorial Optimization with Reinforcement Learning
authors:
- Irwan Bello
- Hieu Pham
- Quoc V. Le
- Mohammad Norouzi
- Samy Bengio
year: 2017
date: 2016-11-29
publication:
  date: '2017'
  source_url: https://bengio.abracadoudou.com/publications/pdf/bello_2017_iclr_workshop.pdf
venue: ICLR Workshop
paper_url: https://openreview.net/forum?id=Bk9mxlSFx
arxiv_url: https://arxiv.org/abs/1611.09940
institutions:
- Google Brain
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Traveling Salesman Problem
- Knapsack Problem
summary: A masked pointer policy learns from objective costs, with distinct greedy, sampling and active-search budgets;
  the workshop TSP paper and extended arXiv experiments are identified separately.
figure:
  path: paper-assets/neural-combinatorial-optimization/framework.png
  alt: Pointer Network encoder-decoder architecture for selecting a permutation of input elements.
  caption: 'Figure 1: Pointer Network policy architecture used for neural combinatorial optimization.'
  source_url: https://arxiv.org/pdf/1611.09940v3#page=4
inclusion: reference
inclusion_reason: Workshop-track publication outside the approved main-conference criteria.
paper_type: solver
---

# Neural Combinatorial Optimization with Reinforcement Learning

> **TL;DR:** A pointer-network policy is trained from solution costs using policy gradients. Greedy decoding, fixed-policy sampling and per-instance parameter adaptation have substantially different quality and runtime budgets.

**Versions covered.** The author-hosted, five-page ICLR 2017 Workshop Track paper and the 15-page arXiv v3 (12 January 2017) were both read completely. The detailed critic architecture, standalone greedy timing table and knapsack experiment below are explicitly from the longer arXiv manuscript; the shorter workshop paper concentrates on TSP. Their TSP quality values and search budgets agree, but the files are not identical.

## Motivation

Supervised imitation needs high-quality solver demonstrations and optimizes agreement with those demonstrations rather than the final objective. The paper instead trains from a cheaply computed objective: the length of a sampled TSP tour. It also distinguishes learning a reusable policy over a distribution of instances from optimizing policy parameters for one test instance. [Introduction and Section 4, PDF pp. 1–4](https://arxiv.org/pdf/1611.09940v3#page=1).

## Contributions

- Uses a recurrent pointer policy and policy-gradient optimization to construct combinatorial solutions without optimal solution labels.
- Trains an instance-dependent critic to reduce gradient variance during distribution-level training.
- Separates greedy inference, best-of-many sampling, active search from pretrained parameters, and active search from random parameters.
- Evaluates Euclidean TSP and a separately adapted knapsack formulation. These demonstrate a reusable framework, not one checkpoint jointly solving both tasks. [Sections 3–6, PDF pp. 3–10](https://arxiv.org/pdf/1611.09940v3#page=3).

## Methodology

**Policy representation.** An LSTM encoder embeds the sequence of city coordinates. An LSTM decoder uses attention to point to the next city. The previously selected city's embedding becomes its next input; the initial decoder input is learned. Already visited cities receive zero probability through a negative-infinity logit mask. A single attention glimpse is used in the reported configuration; repeating that glimpse is not reported as uniformly beneficial. [Section 3 and Appendix A.1, PDF pp. 3–4 and 14](https://arxiv.org/pdf/1611.09940v3#page=14).

**Distribution-level training.** The objective minimizes expected tour length, rather than the negative log-likelihood of expert tours:

```text
J(theta | s) = E[L(tour | s)]
gradient estimate = (L(tour | s) - b(s)) * grad(log p_theta(tour | s))
```

The baseline `b(s)` must not depend on the sampled tour. The principal training setup learns it with a critic: an LSTM encoder, three processing/glimpse steps, and a two-layer scalar-output network. The critic fits sampled tour lengths by squared error; policy and critic are updated with Adam, using asynchronous workers and mini-batches. [Section 4, Equations 3–6 and Algorithm 1, PDF pp. 4–5](https://arxiv.org/pdf/1611.09940v3#page=5).

**Inference and adaptation.** Greedy decoding selects the largest-probability feasible city. Sampling keeps the shortest complete tour from a fixed policy and can tune the softmax temperature. Active search updates policy parameters on repeated samples from one instance and keeps the best tour found. It uses an exponential moving-average baseline instead of the distribution-level critic, and may start from either pretrained or random parameters. Input-city permutations provide additional stochasticity. Refining network parameters is different from applying a local move to an existing tour: the policy still constructs its sampled candidates autoregressively. [Section 4.1 and Algorithm 2, PDF p. 6](https://arxiv.org/pdf/1611.09940v3#page=6).

**Problem-specific feasibility.** TSP uses an explicit visited-city mask. The knapsack experiment encodes item weights and values and adapts decoding and reward to subset selection. Section 6 warns that difficult constraints, such as time-window feasibility, may require lookahead; a penalty-based alternative is proposed for future work and does not provide a general feasibility guarantee. [Section 6, PDF pp. 9–10](https://arxiv.org/pdf/1611.09940v3#page=10).

## Experiments

**Setup.** TSP20/50/100 test sets each contain 1,000 unit-square Euclidean instances. The model uses 128-dimensional embeddings and LSTM states, mini-batches of 128, and on-the-fly training instances. The learning rate is initially `1e-3` for TSP20/50 and `1e-4` for TSP100, with decay. The main sampling budget is 1,280,000 candidate tours per instance; pretrained active search uses up to 10,000 updates of 128 samples. [Section 5.1, PDF pp. 7–8](https://arxiv.org/pdf/1611.09940v3#page=7).

| TSP100 configuration | Mean tour length | Reported computation |
| --- | ---: | --- |
| Pretrained greedy policy | 8.30 | Table 3: 0.01 s average, single Tesla K80 |
| Best greedy result from 16 pretrained models | 7.97 | Table 3: 0.15 s average, single Tesla K80 |
| Pretrained sampling with tuned temperature | 7.88 | Table 4: 1,280,000 candidates; 2,640 s |
| Pretrained active search | 7.83 | Table 4: 1,280,000 candidates; 12,000 s |
| Reference optimum | 7.77 | Concorde certifies optimality; LKH matches it on these test sets. |

[Tables 2–4, PDF pp. 8–9](https://arxiv.org/pdf/1611.09940v3#page=8). These results must not be combined into a claim that near-optimal sampling quality is available at greedy-decoding latency. CPU solver times use different hardware: Concorde/LKH use an Intel Xeon and OR-Tools an Intel Haswell. Appendix Table 6 also shows that guided local search is a stronger comparator than plain OR-Tools local search; the paper explicitly reports being less competitive with it. Active search from a random model is particularly expensive, reported at roughly 7 and 25 hours per TSP50 and TSP100 instance. [Section 5.2 and Appendix A.3, PDF pp. 8–9 and 15](https://arxiv.org/pdf/1611.09940v3#page=9).

**Knapsack.** Each of KNAP50/100/200 has 1,000 instances, with uniform weights and values and capacities 12.5/25/25. Active search runs for 5,000 updates. The authors report recovering the optimal value for all tested instances; pretrained greedy values remain slightly lower. This is an empirical result on those datasets, not a proof of exact optimization for arbitrary knapsack instances. [Section 6.1 and Table 5, PDF p. 10](https://arxiv.org/pdf/1611.09940v3#page=10).

## Limitations

### Discussed in the Paper

- Distribution-trained policies depend on their training distribution, while per-instance active search has substantial computational cost.
- Active search can concentrate on suboptimal regions; sampling and adaptation change rank depending on instance size and budget.
- Some feasibility constraints cannot be enforced with a simple local mask; penalty-based handling remains a proposed extension.
- Strong handcrafted metaheuristics remain more competitive in the reported comparison. [Sections 4.1, 5.2 and 6, PDF pp. 6, 9–10](https://arxiv.org/pdf/1611.09940v3#page=6).

### Curator Notes

- A policy shared over instances of a task is not a shared TSP-and-knapsack checkpoint. The entry remains specialist and constructive.
- The knapsack stopping description is brief; reproductions should inspect capacity handling rather than infer a universal feasibility procedure from the TSP mask.
- The longer arXiv manuscript has an under-review header and contains material absent from the five-page workshop paper. In particular, knapsack and the detailed multi-step critic must not be attributed to the short workshop text. The workshop speed paragraph contains a malformed comparison sentence; no quantitative five-orders-of-magnitude claim is inferred from it.

## Reproducibility

- **Read sources:** [arXiv:1611.09940v3](https://arxiv.org/pdf/1611.09940v3), all 15 pages including the bibliography and Appendix A, plus the [author-hosted workshop PDF](https://bengio.abracadoudou.com/publications/pdf/bello_2017_iclr_workshop.pdf), all five pages including its complete Appendix 6.1-6.5. The equations, main result tables, baseline table and original Figure 1 crop were visually checked.
- **Bibliographic provenance:** [Samy Bengio's publication archive](https://bengio.abracadoudou.com/samy.html) explicitly lists the 2017 Workshop Track and links this PDF and its OpenReview record. The PDF header independently confirms the track. The first submission date, 29 November 2016, and v3 date come from [arXiv history](https://arxiv.org/abs/1611.09940); neither is a paper acceptance date.
- **Supplement check:** the author-hosted workshop file contains the scientific appendix within its five pages; the longer arXiv copy includes its complete Appendix A. OpenReview forum/PDF/API access was unavailable, so no successful inspection of unknown OpenReview attachment fields is claimed. No additional scientific attachment is explicitly required by the material read. Version provenance is recorded rather than demanding byte identity between these different manuscripts.
- **Implementation:** the longer manuscript announces TensorFlow code but supplies no author-maintained repository URL. Third-party reimplementations should not be labelled official; no training or table reproduction was performed in this review.
- **Reference collection:** the workshop entry is retained for historical context and excluded from main-conference totals, with its stable ID and arXiv extension preserved.
- **Audit trail:** [Current-round source coverage and page evidence](https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/neural-combinatorial-optimization.json).
