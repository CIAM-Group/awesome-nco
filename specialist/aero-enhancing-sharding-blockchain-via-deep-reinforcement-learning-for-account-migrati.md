---
id: aero-enhancing-sharding-blockchain-via-deep-reinforcement-learning-for-account-migrati
short_title: AERO
title: 'AERO: Enhancing Sharding Blockchain via Deep Reinforcement Learning for Account Migration'
authors:
- Mingxuan Song
- Pengze Li
- Bohan Zhou
- Shenglin Yin
- Zhen Xiao
- Jieyi Long
year: 2025
date: '2025-04-22'
publication:
  date: '2025-04-22'
  source_url: https://dl.acm.org/doi/10.1145/3696410.3714926
venue: WWW
paper_url: https://doi.org/10.1145/3696410.3714926
institutions:
- Peking University
- Theta Labs
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Problems
problems:
- Blockchain Account-to-Shard Assignment
- Dynamic Account Migration
summary: An attention-based PPO policy migrates prefix-defined account groups between blockchain shards; a PBFT-integrated
  prototype reports throughput gains on Ethereum transaction replay, with explicit reward/attention specification
  and security-assumption boundaries.
figure:
  path: paper-assets/aero-enhancing-sharding-blockchain-via-deep-reinforcement-learning-for-account-migrati/framework.png
  alt: AEROChain uses epoch randomness and node assignment before PBFT pre-prepare, prepare and commit phases that
    coordinate AERO account migration.
  caption: 'Original Figure 1: the PBFT-based AEROChain migration and reconfiguration workflow.'
  source_url: https://www.mingxuansong.com/papers/AERO-%20Enhancing%20Sharding%20Blockchain%20via%20Deep%20Reinforcement%20Learning%20for%20Account%20Migration.pdf#page=3
---

# AERO: Enhancing Sharding Blockchain via Deep Reinforcement Learning for Account Migration

> **TL;DR:** AERO learns to migrate groups of existing blockchain accounts between shards, using shared address prefixes to reduce the decision space. Its AEROChain prototype reports 31.77% higher throughput than the stated state-of-the-art comparator on Ethereum transaction replay. The published reward/attention descriptions contain inconsistencies, and the security claims depend on PBFT and network assumptions.

## Motivation

Transactions between accounts on different shards require extra communication. Uneven account activity also overloads some shards while others remain underused. Changing the existing account placement can address both effects, but individual-account decisions scale poorly and graph partitioning adds computational cost. AERO groups accounts by address prefix and learns migration sequences from recent workload and action history. This is account-to-shard assignment optimization, not blockchain mining or neural cryptography. [pp. 1–3]

## Contributions

- Proposes group-level, prefix-based account migration driven by an attention-based PPO policy.
- Integrates proposal generation, validation and execution into the logical/physical-shard AEROChain design.
- Compares transaction ratios, load variance, distributions and overall throughput against five alternatives, including an individual-account AERO-S ablation.
- Includes Appendices A–D on conditional safety/liveness, neural architecture, experimental settings/overhead and complete transaction heatmaps. [pp. 2–11]

## Methodology

A migration operation is a triple (source shard, destination shard, account prefix). An action is a variable-length sequence of such triples. The state contains shard throughput, cross-shard transaction statistics and prefix-level intra-/cross-shard volumes for the current and previous epoch. A sliding window supplies recent action history. Attention combines state and history; an autoregressive decoder produces migration operations until a stopping token or a maximum length. PPO updates the policy. [pp. 5–6, 10]

AEROChain separates physical shards, which execute transactions and maintain account state, from a logical shard containing all nodes, which agrees on migration proposals with PBFT. A leader proposes a migration list, replicas validate it, and prepare/commit quorums authorize execution through the cross-shard transaction module. The intended replica consistency assumes common initial model parameters, a shared seed, deterministic state inputs and deterministic model updates; a seed alone is not a demonstrated guarantee for every numerical implementation. [pp. 3–6]

The optimization specification needs qualification. Equations 2–4 say the goal is to minimize a weighted transaction-ratio/variance cost but print an argmax. Equations 8–12 define reward as w1 times the positive cross-shard ratio plus w2 times a negative variance of cross-shard **counts**. Reducing the ratio under reward maximization requires an appropriate sign or transformation, and the paper does not supply the coefficient values/signs. The count-variance equation also differs from its accompanying description as ratio or overall workload variance. These are printed specification ambiguities; this note does not invent a corrected implemented reward. [pp. 5–6]

Appendix B describes state-derived queries and action-history-derived keys/values, but Eq. 14 places action history in the query expression and state in the key/value expressions. The listed dimensions and the three-real-value output do not fully specify discrete shard/prefix decoding, masks or termination. The defensible method description is attention over state/action history with autoregressive migration, without claiming the missing implementation details. [p. 10]

**Classification: Specialist / improvement.** The neural policy alters a complete existing account-to-shard allocation through migration moves. It targets one native placement/migration problem; replaying new transaction streams or epochs is not evidence of one checkpoint solving multiple distinct combinatorial problems. [pp. 3–6]

## Experiments

The paper uses ten million Ethereum 2024 transactions for training and one million for testing. The prototype uses Golang for AEROChain and Python/CleanRL for AERO, built on BlockEmulator. It has sixteen physical shards with eight nodes each, for 128 nodes; each epoch includes 100 consensus blocks, each holding at most 1,000 transactions. Table 1 lists gamma=0.99, six attention heads, batch size 128, minibatch size four, learning rate 1e−5 and 256 neurons per layer. The specific computing hardware, repeated independent training seeds and full PPO update budget are not reported. [pp. 6, 10]

The five alternatives are AERO-S (individual-account migration), SPRING (state placement), BrokerChain, LB-Chain and Monoxide (no added account-migration strategy). Figure 4 plots cross-shard ratio over 1,000 blocks; Figure 6 shows EWMA load variance and a box plot. Figure 5 shows selected eight-shard transaction heatmaps, while Appendix D supplies the full sixteen-shard matrices. These selected heatmaps should not be described as the entire network. [pp. 6–8, 10–11]

Figure 7 and the text report 31.77% higher overall TPS than the state-of-the-art comparator. The plot supplies bars and error bars without exact numeric labels or a clear repeated-run/error-bar definition, so no more precise independently recomputed TPS or significance claim is made here. AERO-S performs worse than grouped AERO, supporting the grouping ablation in this configuration. The paper also recognizes that Monoxide maintains relatively balanced shard loads despite its poor overall throughput: the result is not dominance on every individual load metric. [pp. 7–8]

Appendix C reports roughly 90 KB model storage, 0.06 seconds per migration decision and 0.9 seconds per model update, with updates once per reconfiguration phase. These are reported local component timings on unspecified hardware, not a complete end-to-end decentralized overhead or reproduced graph-partitioner runtime comparison. [p. 10]

## Limitations

Prefix grouping trades individual-account flexibility for fewer decisions; the experiments do not establish behavior under arbitrary prefix distributions, adversarial account creation or long distribution shifts. One Ethereum workload and one sixteen-shard configuration do not establish cross-system generality. Training/test chronology, overlap controls, exact reward coefficients and reproducible numeric result tables are not supplied. [pp. 5–8, 10]

Appendix A's safety/liveness arguments assume fewer than one-third malicious consensus nodes, PBFT quorums/view changes and the required network/model consistency conditions. The proof text also assumes that threshold within each physical shard. A global threshold alone does not establish every shard's threshold after arbitrary node assignment. Liveness uses partial synchrony with an unknown delay bound; the main text's weaker wording about eventual delivery should not be turned into an unconditional asynchronous liveness theorem. The arguments are conditional consensus sketches, not guarantees that the learned migration policy is optimal or that adversarial workloads cannot hurt throughput. [pp. 3–4, 9–10]

The reward and attention inconsistencies above limit a faithful implementation from printed equations. The paper reports a 4,000-line implementation, but an associated public source repository/checkpoint was not identified in the article, author publication pages or targeted searches. Base projects such as BlockEmulator and CleanRL are not the released AERO implementation. [pp. 9–10]

## Reproducibility

The formal article is WWW 2025, pp. 706–716, DOI 10.1145/3696410.3714926. The publisher's deposited metadata gives publication date 2025-04-22, separately from the conference interval April 28–May 2 printed on the paper. The six-author byline and affiliations were checked against the named author's complete eleven-page proceedings-format PDF: five authors are at Peking University and Jieyi Long at Theta Labs. No confirmed arXiv record is added.

All eleven pages, all 36 references and all scientific Appendices A–D were read. The safety lemmas, objective/reward equations, attention equations, hyperparameter table, runtime disclosures and all main/complete heatmaps were rendered and visually inspected. The original Figure 1 is included as a verified crop. ACM article/supplement requests and the OpenReview attachment API returned access challenges/403; the author publication page links the same complete paper but no additional scientific attachment or code. The article's named appendices are integrated and fully covered; unknown inaccessible attachments are not claimed to have been read. No model training, blockchain execution or historical benchmark reproduction was performed.
