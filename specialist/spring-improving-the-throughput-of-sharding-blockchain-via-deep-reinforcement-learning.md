---
id: spring-improving-the-throughput-of-sharding-blockchain-via-deep-reinforcement-learning
short_title: SPRING
title: 'SPRING: Improving the Throughput of Sharding Blockchain via Deep Reinforcement Learning Based State Placement'
authors:
- Pengze Li
- Mingxuan Song
- Mingzhe Xing
- Zhen Xiao
- Qiuyu Ding
- Shengjie Guan
- Jieyi Long
year: 2024
date: '2024-05-13'
publication:
  date: '2024-05-13'
  source_url: https://dl.acm.org/doi/10.1145/3589334.3645386
venue: WWW
paper_url: https://doi.org/10.1145/3589334.3645386
institutions:
- Peking University
- Theta Labs
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Partitioning
problems:
- Blockchain State Placement
summary: A PPO policy assigns newly appearing blockchain accounts to shards using recent per-shard transaction counts
  and sender locations, trading cross-shard transactions against load balance; evaluation combines online training
  traces and a 16-shard PBFT testbed.
figure:
  path: paper-assets/spring-improving-the-throughput-of-sharding-blockchain-via-deep-reinforcement-learning/framework.png
  alt: SPRING uses an actor-critic agent in an agent shard to assign new addresses to transaction shards, using
    transaction history and existing address locations.
  caption: 'Original Figure 2: SPRINGChain integrates learned new-state placement with agent and transaction shards.'
  source_url: https://www.mingxuansong.com/papers/SPRING-%20Improving%20the%20Throughput%20of%20Sharding%20Blockchain%20via%20Deep%20Reinforcement%20Learning%20Based%20State%20Placement.pdf#page=4
---

# SPRING: Improving the Throughput of Sharding Blockchain via Deep Reinforcement Learning Based State Placement

> **TL;DR:** SPRING learns where to place **new** blockchain accounts. PPO balances fewer cross-shard transactions against shard workload. In a 16-shard BlockEmulator experiment, the reported 2023 throughput is 437.961 transactions/second, approximately 36.03% above Shard Scheduler. Performance traces are collected during separate online training runs, not a demonstrated frozen checkpoint transferred across years.

## Motivation

Sharding enables parallel transaction processing, but transactions involving accounts on different shards incur additional coordination. Placing every account together removes these transactions at the expense of parallelism. Hash-based or least-populated-shard assignment ignores transaction relationships; global graph partitioning can be too costly during block production. SPRING targets incremental new-account placement during the consensus phase. Redistribution of existing accounts during reconfiguration is a distinct, potentially complementary operation. [pp. 1–3]

## Contributions

- Formulates new-state placement as sequential shard assignment with recent transaction and account-location features.
- Uses a PPO actor-critic policy and a soft reward trading cross-shard cost against workload imbalance.
- Describes an agent-shard deployment/training protocol integrated with PBFT and relay-based cross-shard processing.
- Evaluates three historical Ethereum transaction periods, block sizes, per-shard load, throughput and agent overhead. [pp. 2–8; Appendices A–C]

## Methodology

SPRINGChain has one agent shard and k transaction shards. The agent shard receives transactions, maps new accounts to transaction shards and records the account-to-shard relation. Transaction shards execute/validate transactions and report block information. Already placed accounts retain their location: this neural operation constructs assignments for newly encountered states rather than locally relocating a complete incumbent partition. [pp. 3–4; Figs. 1–3]

The observation has **11k+1 dimensions**: total and cross-shard transaction counts over the previous five blocks for each shard, sender-location features and a smart-contract/account flag. The action selects one of k destination shards for a new account. Recent block statistics update at block boundaries; sender-location information also updates as addresses are assigned within the block. The reward combines the inverse cross-shard transaction ratio with exp(−beta times the summed absolute workload deviation). This is a soft trade-off, not a hard balance constraint or a proof of minimum cross-shard cost. [p. 5, Eqs. 1–6]

Separate actor and critic feed-forward networks use three linear layers, two ReLU activations and two hidden layers of 64 neurons. PPO uses clipped policy updates, generalized advantage estimation and an Adam-trained value function. Reported settings include batch size 2,048, learning rate 3×10^-4, clipping 0.2, discount 0.99, beta 0.1 and reward weight lambda 0.5. The lambda choice is selected from 0.2/0.5/0.8 for the particular testbed; it is not claimed optimal for every blockchain design. [p. 6; Appendix B, pp. 10–11]

Agent-shard peers start with identical model parameters and a genesis-derived seed. Placement proposals pass a PBFT-style prepare/commit protocol; a Jaccard-based tolerance permits differences between local views. Appendix A's safety/liveness statements assume fewer than one third Byzantine nodes **within the agent shard**, appropriate consensus quorums, unforgeable signatures and partial synchrony. Random shard assignment/reconfiguration is separately used to discuss the probability of a bad shard. A global adversarial fraction alone does not remove these per-shard assumptions; the discussion is not an independent security audit of a deployed system. [pp. 3–4, 10]

**Classification: Specialist / constructive.** The policy solves one native new-state-placement task. Each historical-period experiment trains from scratch; the article does not demonstrate a shared frozen neural checkpoint across distinct combinatorial problems. Changing the transaction period does not itself establish generalist scope. [pp. 5–8]

## Experiments

The agent shard is **simulated in Python 3.9**. Transaction shards run BlockEmulator on 64 Alibaba Cloud ecs.c7.large instances in one zone, arranged as 16 shards with four consensus nodes each. Training uses an i7-9750H CPU, 64 GB RAM and an RTX 2080. Ethereum transactions come from 2015, 2019 and 2023, encompassing up to six million transactions. This is historical transaction replay plus a blockchain testbed, not a live Ethereum deployment or a complete measured production agent-shard implementation. [p. 6]

Block-size exploration considers 100, 200, 500, 1,000 and 2,000 transactions, with 1,000 blocks in each experiment; 1,000 transactions/block is chosen for subsequent tests. This holds the block count fixed, not the transaction count across block-size settings. Main comparisons use one million transactions/1,000 blocks per period and collect cross-shard/load metrics **during training**. The article explicitly trains separate agents from scratch for the three periods. It does not specify an independent held-out evaluation split or repeated-seed confidence intervals. [p. 7; Figs. 4–7]

Baselines are random placement, least-state-count Shard Scheduler, address-hash Monoxide and an adapted SkyChain. The SkyChain comparison reuses its state/reward ideas for placement; it is not the complete original dynamic-sharding control task. The reported peak cross-shard-ratio reduction is 26.63%. The 2023 throughput experiment instead states a 20.99% cross-shard reduction, so these peaks should not be merged as one identical setting. [pp. 6–8]

Table 2 reports SPRING throughput of **486.8532 / 426.424 / 437.961 TPS** for 2015/2019/2023. The displayed baseline rows are for **2023**: SkyChain 342.35, random 326.691, Monoxide 325.542 and Shard Scheduler 321.957 TPS. The 2023 SPRING-versus-Shard-Scheduler increase is approximately **36.03%**. The introduction prints 36.09%, inconsistent with the abstract, Section 5.5.3 and these table values; this note uses the table-supported 36.03%. The omitted earlier-period baseline values are not invented from the stated qualitative similarity. [pp. 1–2, 8]

Load plots use logarithmic transaction-count axes. All methods retain imbalance because account activity is strongly skewed: a few popular addresses dominate transactions. SPRING improves the transaction-cut trade-off but does not guarantee equally loaded shards, and an even account count does not imply an even transaction count. The paper reports a roughly 30 KB agent, approximately **0.002 seconds per new-account assignment** and **0.1 seconds per model update**, on the stated training machine. These measurements do not by themselves prove that a fully decentralized agent shard cannot bottleneck every deployment. [pp. 6–8; Fig. 8]

## Limitations

The method places new states and cannot directly repair poor locations of existing popular accounts. Historical periods are separately trained, with metrics observed during learning; broad held-out or cross-period checkpoint generalization remains unestablished. The reward, shard count, fixed block size and relay/PBFT implementation influence the trade-off. No learned-policy approximation ratio, global optimum or hard workload feasibility guarantee is supplied. [pp. 3, 5–8]

The decentralized deployment and security arguments rely on their stated model assumptions, while the evaluated agent shard is simulated. Consensus costs, partial-view differences, shard compromise probability and deterministic training behavior require more than the quoted single-agent inference time to validate in a production system. Public implementation and trained weights were not identified, and several replication details such as exact PPO iteration counts, seeds and data slices remain unspecified. [pp. 4, 6, 10–11]

## Reproducibility

The formal paper is WWW 2024, pp. 2836–2846, DOI 10.1145/3589334.3645386, published **2024-05-13** in the saved publisher-deposited Crossref online/print metadata. The seven-author camera-ready identifies six Peking University authors and Jieyi Long at Theta Labs. All eleven pages of the author-hosted camera-ready were read, including all 53 references, Appendix A security statements/proofs, Appendix B network/PPO details and Appendix C baseline descriptions.

Publisher article/supplement endpoints returned 403. The primary author page supplies the complete camera-ready; all scientific appendices explicitly named in the body are integrated and were read. No separate required missing scientific attachment or verified official SPRING implementation was identified. BlockEmulator is the cited testbed and is not relabeled as the authors' complete policy code. No arXiv identity or Code link is invented from unrelated projects with the same acronym.

All nine figures, two tables, placement/reward formulas, Appendix A security conditions and Appendix B algorithm were rendered and inspected. Original Figure 2 is included. No model training, blockchain run, security experiment or historical benchmark reproduction was executed. No existing catalogue target was supported by both the body's citations and a matching bibliography entry, so no internal citation edge was added.
