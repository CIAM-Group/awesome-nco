---
id: parrot-cache
short_title: Parrot
title: An Imitation Learning Approach for Cache Replacement
authors:
- Evan Zheran Liu
- Milad Hashemi
- Kevin Swersky
- Parthasarathy Ranganathan
- Junwhan Ahn
year: 2020
date: '2020-11-21'
publication:
  date: '2020-11-21'
  source_url: https://proceedings.mlr.press/v119/liu20f.html
venue: ICML
paper_url: https://proceedings.mlr.press/v119/liu20f.html
institutions:
- Stanford University
- Google Research
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Resource Allocation
problems:
- Cache Replacement
summary: Program-specific imitation of Belady eviction improves offline cache hit rates; future-free inference,
  normalized metrics and unmeasured deployment overhead define its scope.
code_url: https://github.com/google-research/google-research/tree/master/cache_replacement
---

# An Imitation Learning Approach for Cache Replacement

> **TL;DR:** PARROT imitates the future-aware Belady eviction oracle using only past/current accesses at inference. It improves trace-level cache hit rates, but does not demonstrate net production latency gains after charging neural-policy overhead.

## Motivation

Hand-designed replacement heuristics cover limited access patterns, while Belady's optimal policy needs unavailable future accesses. Fixed recorded traces make that future available for offline supervision, allowing an online neural policy to learn richer eviction behavior (Sections 1–3).

## Contributions

- Formulate direct cache-line eviction as imitation learning with Belady labels available at every training state.
- Combine an LSTM/history-attention policy with on-policy state recollection, a differentiable ranking loss and auxiliary log-reuse-distance prediction.
- Evaluate trace-level hit rates and ablations on thirteen SPEC CPU2006 programs plus an industrial web-search trace; release policy code and a cache-replacement environment. Experiments train for individual program traces, rather than establish shared cross-problem optimization weights.

## Methodology

**Task and oracle.** A cache miss in a full W-way set requires evicting one of its W lines; a hit needs no action. Inputs are current address/program counter, accessed set's cache lines and past access history. The objective is the undiscounted number of hits. For fixed future traces and the single-level equal-line miss-count objective, Belady evicts the resident line whose next use is farthest away. That offline oracle is a reference/supervisor, not information supplied to the deployed policy. Its optimality does not automatically extend to latency-weighted misses, hierarchical cache control or the learned approximation (Sections 2–3,7).

**Policy.** Current memory address and program counter embeddings enter an LSTM. Each candidate resident line attends over the last H hidden states, augmented with positional embeddings; a dense scoring head and softmax yield eviction probabilities, with argmax at inference. Full models learn separate address/PC embeddings; unseen symbols map to UNK. A byte embedder instead concatenates learned per-byte embeddings and a linear projection to reduce embedding storage, not necessarily the total policy to a few kilobytes (Sections 4.1,4.5; supplement A).

**Training.** Roll out the current policy to collect states, label those states using future trace information, and refresh them every 5,000 parameter updates; initial states are collected with the oracle. Truncated backpropagation warms up on H accesses and trains on the next H. The final objective combines a smooth NDCG-inspired ranking loss based on true reuse distances and mean-squared error for predicted log reuse distance. It supplies more graded supervision than only the single optimal action. This is supervised imitation with state recollection, not online reward-driven RL (Sections 4.2–4.4, Algorithm 1).

**Configuration.** PyTorch/Adam uses learning rate 0.001, 64-dimensional address/PC embeddings, 128-dimensional position embeddings, LSTM size 128 and H=80. PC vocabulary size is 5,000; address vocabulary follows each program's training addresses. Shared hyperparameters are tuned on omnetpp validation data, but policies/embeddings are fitted per program. A DAgger-style procedure reduces distribution mismatch empirically; the paper does not prove learned-policy optimality (supplement B.2).

## Experiments

**Cache and traces.** L1 is four-way 32 KB, L2 eight-way 256 KB and last-level cache sixteen-way 2 MB. LRU controls L1/L2; PARROT controls the last level only. Fifty-second instrumented traces are passed through L1/L2, then accesses from 64 randomly selected last-level sets are retained. Each program is split chronologically into 80% training, 10% validation and 10% test; validation hit rate selects checkpoints. Means use three random seeds. This tests later accesses from the same program, not cross-program zero-shot deployment (Section 5.1; supplement B.3–B.4).

**Metric definitions.** Raw hit rate is the fraction of accesses that hit. Normalized hit rate is (policy−LRU)/(Belady−LRU), so LRU is zero and Belady one. Improvements in this normalized score must not be read as percentage-point raw hit gains, miss-rate reductions or measured program speedups. Table 1's average raw gain of about sixteen refers to approximately sixteen **percentage points**, based on its listed raw hit rates, rather than a 16% relative increase (pp.6–7).

**Web search.** Raw hit rate rises from LRU 45.5% to PARROT 59.0%, with Belady at 67.5%. The raw improvement is 13.5 percentage points and the normalized score is 13.5/(67.5−45.5)≈0.614, closing about 61% of the LRU–oracle gap. The abstract's “61%” should be interpreted with this definition, not as 61 percentage points of raw improvement or a 61% latency reduction (Table 1, Figure 5).

**SPEC and baseline quality.** Full PARROT beats Glider on ten of thirteen SPEC programs; Glider is marginally better on bzip, bwaves and mcf. The authors report an average 20% improvement in normalized score; the smaller byte model achieves a reported 8% average improvement and trails the full model. Glider's exact traces are unavailable, so its numbers come from that paper/provided results and are compared on normalized scores after checking approximate LRU/Belady agreement. This is not an identical-trace rerun of the baseline. The abstract's wording “increases cache miss rates by 20%” conflicts with the body/figures and is not repeated as the intended result (pp.1,6–7).

**Ablations and generalization.** Reuse-distance supervision, state recollection and ranking contribute reported average normalized-score gains of 16.8%, 9.8% and 3.5% on five selected workloads. Yet off-policy oracle rollouts are as good or better on mcf/Web Search, so DAgger is not uniformly beneficial. History improvements saturate near eighty accesses. A nearest-neighbor oracle baseline succeeds on repetitive programs but struggles on varied code paths. Table 3 distinguishes unique unseen symbols from the fraction of test accesses involving unseen symbols; e.g. mcf's 21.6% is an access-frequency statistic, not 21.6% of unique addresses (pp.7–8; supplement Tables 2–3).

**Auxiliary diagnostics.** Oracle top-1/top-5 agreement and reuse-distance gaps help explain predictions, but neither is equivalent to hit rate: similar-use candidate lines can yield comparable outcomes even when exact oracle choices differ. These are descriptive decision-quality metrics, not certified optimality gaps (supplement B.1).

## Limitations

### Discussed in the Paper

This is a proof of concept. Neural inference latency and memory can overshadow better cache decisions; production deployment is not evaluated. Compression, distillation, quantization and software caches with longer decision windows are future directions. Misses have unequal latency costs, and optimal multilevel replacement is not supplied by the single-level oracle (Sections 4.5,7).

### Curator Notes

Better offline hit rate does not establish end-to-end system acceleration. Time-split traces from the same program, sampled cache sets and program-specific embeddings limit out-of-distribution claims. Oracle labels rely on fixed future traces and should not be confused with future-free training data. Full/baseline comparisons use different available traces and normalization. The released code is useful, but exact original traces are unavailable, preventing byte-identical replay of the paper's experiments from the release alone.

## Reproducibility

- **Publication:** [ICML 2020, PMLR 119:6237–6247](https://proceedings.mlr.press/v119/liu20f.html). Publisher source explicitly records issued 2020-11-21; the July 13–18 conference dates are a different field. The PDF uses Evan Zheran Liu, while the landing page shortens it to Evan Liu.
- **Reading:** complete eleven-page publisher article and the [three-page publisher supplement](https://proceedings.mlr.press/v119/liu20f/liu20f-supp.pdf), including architecture, all table rows, hyperparameter emphasis and sampled set IDs; key mathematical definitions and result figures were visually inspected. Manual Related Material inspection identifies Software and this sole scientific PDF supplement.
- **Code:** [official Google Research release](https://github.com/google-research/google-research/tree/master/cache_replacement), linked by both paper and publisher. Its README documents Python 3.7, policy/environment usage and baseline dependencies. It explicitly says the exact experimental traces cannot be released; it provides a toy trace and instructions for analogous CRC2/DynamoRIO traces. No reproduction run was performed in this source audit.
- **Citation graph:** all references were scanned against the catalogue. No exact internal paper matches were found; general attention, imitation-learning and differently titled caching works were not converted into speculative relations.
