---
id: complex-contagion-influence-maximization-a-reinforcement-learning-approach
short_title: RL4CCIM
title: 'Complex Contagion Influence Maximization: A Reinforcement Learning Approach'
authors:
- Haipeng Chen
- Bryan Wilder
- Wei Qiu
- Bo An
- Eric Rice
- Milind Tambe
year: 2023
date: 2023-08
publication:
  date: 2023-08
  source_url: https://ijcai.org/proceedings/2023/bibtex/614
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2023/614
institutions:
- William & Mary
- Carnegie Mellon University
- Nanyang Technological University
- University of Southern California
- Harvard University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Subset Selection
problems:
- Complex Contagion Influence Maximization
- Threshold-Cascade Seed Selection
summary: Graph-specific GAT/Double-DQN seed construction combines exploration filtering, reward-aware replay and
  leave-one-out shaping for complex contagion; small-graph gains coexist with printed filtering/MIP qualifications.
figure:
  path: paper-assets/complex-contagion-influence-maximization-a-reinforcement-learning-approach/framework.png
  alt: Original Figure3 shows graph-based seed construction, solution filtering, shaped transition replay and a
    neural Q-agent.
  caption: Original Figure3 and full caption describe the RL4CCIM training architecture.
  source_url: https://ijcai.org/proceedings/2023/0614.pdf#page=5
---

# Complex Contagion Influence Maximization: A Reinforcement Learning Approach

> **TL;DR:** RL 4CCIM trains a graph-specific GAT/Double-DQN seed constructor for threshold-like, non-submodular influence cascades. Exploration filtering, reward-aware replay and leave-one-out reward shaping address sparse useful feedback. Reported gains concern small known networks; several printed filtering/MIP claims require qualifications.

## Motivation

In complex contagion, combinations of active neighbors can trigger adoption that individual seeds cannot. Greedy marginal influence and ordinary RL feedback may therefore be uninformative early in a selection sequence. The paper distinguishes scarcity of useful complete seed sets from difficulty assigning credit to their individual members. [pp. 1–4]

## Contributions

- A sequential seed-selection MDP uses a graph-attention Q-network within Double DQN.
- A structural candidate set biases early exploratory actions toward neighbors of nodes that can reach the activation threshold.
- Replay combines TD error and reward/return, while a complete-episode leave-one-out marginal contribution augments each seed's local reward.
- Experiments compare baselines and component ablations across nine real networks. [pp. 2–8]

## Methodology

The model selects T distinct seeds. Selection-state transitions are deterministic even when the separate cascade simulator is stochastic. Base rewards are incremental expected spread; after an episode, each selected seed receives additional credit from removing it from the final seed set. This is a heuristic shaping objective, without a demonstrated general policy-invariance guarantee. [Equations 3–7]

The candidate set A is the union of neighborhoods of nodes with degree at least K. Filtering biases exploration and is gradually relaxed; full-node exploration remains available in Algorithm 1. PER uses a mixture of absolute TD error and reward, with the implementation description actually using five-step returns. The GAT has eight attention heads. [pp. 5–6; Appendix B]

The appendix reports 5,000 training steps, learning rate 0.0005, batch 32, target updates every 20 steps starting at 2,500, PER offset 0.01/exponent 0.6, and exploration/filtering probabilities declining from 0.99 to 0.01. Reward-shaping weights, priority variant and β are tuned per network. This is **specialist/constructive**: policies construct seed sets for known graphs; transfer to unseen graphs is explicitly future work. [Appendix B; conclusion]

## Experiments

The nine graphs range from 40 to 410 nodes, including five youth-shelter friendship networks, Football, Polbooks, India and Exhibition. The base setting is deterministic, with p0=1/p1=0, thresholds 3/4/6 and seed budget 8, except Exhibition 12. Additional experiments vary propagation, budget and threshold on three networks. [Table 1; Appendix C/Table 2]

RL 4CCIM has the best or tied displayed non-MIP result across the nine base settings. On India it reaches 0.5347 normalized influence versus greedy 0.0396, DPIM.3911 and RL 4IM.3465; on Football it reaches 1.0 versus RL 4IM.513. CHANGE is a tie at 0.283 with DPIM/RL 4IM. It remains below the reported MIP reference on CHANGE(0.283 versus 0.3019) and MFP(0.3472 versus 0.375). These are results from the paper, rather than independently rerun benchmarks. [Table 1]

The evaluation reports the best validated RL model from 15 runs, with validation every 20 training steps; Random+ is averaged over 50 runs and stochastic greedy/DPIM over 20. RL numbers must therefore not be labeled 15-seed means. Training is reported under two hours on the small graphs using a V100. Cascade estimates use 50 simulation repetitions in greedy/DPIM training/configuration and 1,000 at stochastic evaluation. [pp. 6–8; Appendix B]

## Limitations

- Scalability and cross-graph generalization are explicitly unresolved. The demonstrated graphs are small, despite references to earlier billion-node methods.
- Theorem 3's statement that A contains every effective seed set is too broad as printed. For a triangle plus an isolated vertex, K2/T3, A is the triangle: restricting all seeds to A reaches 3 nodes, while choosing two triangle vertices and the isolated vertex reaches 4. This checks the unrestricted printed claim; the actual algorithm's full-node exploration means this counterexample does not by itself refute its empirical results.
- The printed appendix MIP omits seed/persistence terms needed to represent progressive activation, and does not state variable domains. Even treating variables as binary, on a two-node edge with K1/T1 its displayed recurrence can alternate one active node, while progressive contagion reaches both. The unavailable experiment code prevents deciding whether this is a typesetting omission. The printed equations alone do not certify the benchmark's OPT row.
- MIP uses horizonL 10, described as empirically sufficient; without an adequate horizon it is only a lower-bound formulation for the intended process. The main text also mentions a 12-hour timeout starting at SPY while displaying a numeric OPT entry there, without enough solver-status detail to certify every reference value.
- The prose's claim of exact greedy optimality for submodular objectives is too strong; the relevant background guarantee is an approximation guarantee under its assumptions. The stochastic section labels the varied probabilityp 1, while other notation describes a generic propagation probability; this parameterization is not fully resolved by the available implementation description.

## Reproducibility

Read the complete ten-page [formal proceedings paper](https://ijcai.org/proceedings/2023/0614.pdf) and the complete 12-page [author manuscript with Appendices A–E](https://drive.google.com/file/d/1tqBiyHeAdOA7_IL8ShiMmgYz2MUN-Kg1/view), including both full bibliographies. The latter is directly linked by the [current Harvard Teamcore publication list](https://teamcore.seas.harvard.edu/publications/). Older author/NTU copies contain only ten pages; the old Harvard file endpoint is inaccessible. All scientific figures/tables were checked visually, including the appendix MIP equations; the original Figure 3 and full caption were cropped from formal page 5.

The [publisher BibTeX](https://ijcai.org/proceedings/2023/bibtex/614) gives Main Track, pages 5531–5540, DOI 10.24963/ijcai 0.2023/614, **August 2023** at month precision, with six authors and five institutional groups. No matching arXiv version or released article-specific implementation was established. The paper promises its DPIM implementation as supplemental material, but the obtained scientific appendix does not contain that code; exact implementation/benchmark reproduction remains unavailable and no Code link is fabricated. The small counterexamples qualify literal printed claims and are separate from any assertion about unpublished code or the reported experimental outcomes.
