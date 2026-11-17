---
id: marco-a-memory-augmented-reinforcement-framework-for-combinatorial-optimization
short_title: MARCO
title: 'MARCO: A Memory-Augmented Reinforcement Framework for Combinatorial Optimization'
authors:
- Andoni I. Garmendia
- Quentin Cappart
- Josu Ceberio
- Alexander Mendiburu
year: 2024
date: '2024-08-05'
publication:
  date: 2024-08
  source_url: https://ijcai.org/proceedings/2024/bibtex/766
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2024/766
institutions:
- University of the Basque Country (UPV/EHU)
- Polytechnique Montreal
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Graph Optimization
- Routing
problems:
- Maximum Cut
- Maximum Independent Set
- Traveling Salesman Problem
summary: Problem-specific neural policies retrieve shared instance-local solution memory; binary improvement and
  fresh-tour construction improve exploration, with classical-solver exceptions and main/supplement/release setting
  differences.
arxiv_url: https://arxiv.org/abs/2408.02207
code_url: https://github.com/TheLeprechaun25/MARCO
figure:
  path: paper-assets/marco-a-memory-augmented-reinforcement-framework-for-combinatorial-optimization/framework.png
  alt: 'Original MARCO Figure2: parallel maximum-cut solution improvement, visited state-action memory and retrieved
    neural-policy features.'
  caption: Original Figure2 and full caption show the MC improvement variant; TSP uses a separate constructive variant.
  source_url: https://ijcai.org/proceedings/2024/0766.pdf#page=4
---

# MARCO: A Memory-Augmented Reinforcement Framework for Combinatorial Optimization

> **TL;DR:** MARCO retrieves previously visited solutions and feeds their action or edge statistics into a neural policy. It improves exploration through instance-local memory shared across search threads. Maximum Cut/MIS use neural improvement, while TSP uses repeated fresh construction; each problem has its own trained model.

## Motivation

Constructors can repeatedly generate similar solutions, while improvement policies can revisit states or settle into local search cycles. MARCO asks whether storing complete solutions provides more context than recording only the most recent action, and whether parallel search threads can benefit from a shared memory. Unlike an external tabu filter, its retrieved information enters the policy's input. [pp. 1–3]

## Contributions

- A memory module stores complete graph solutions and, for binary improvement, the corresponding actions.
- Similarity-based top-k retrieval aggregates historical information into node or edge features used by the neural policy.
- Shared-memory and independent-memory variants are evaluated on Maximum Cut, Maximum Independent Set and TSP. [pp. 2–5]

This is **specialist**, because Section 6.2 and Appendix A.3 explicitly train one model per problem. The **constructive/improvement** label describes distinct implementations within the paper: MC/MIS edit incumbents and TSP constructs new tours. It does not describe a single constructor-then-improver pipeline or a checkpoint shared across these problems.

## Methodology

**Memory and policy.** Each instance maintains a growing bank of solutions. Similarity search retrieves k historical states, and a weighted aggregation supplies extra features to a Graph Transformer. MARCO-ind keeps thread-specific banks; MARCO allows threads for the same instance to share their bank. The memory is search state, rather than evidence of learned cross-instance retrieval. [pp. 3–5, Algorithms 1–2]

**Binary improvement.** MC/MIS policies select node flips from complete current assignments. The reward combines improvement over the best objective seen so far with a revisit penalty. MIS masks additions that would violate independence in the released environment. The released MC environment stores ±1 Ising vectors for similarity, whereas the paper introduces a 0/1 encoding; the implementation's inner product therefore counts both agreements and disagreements. Applying the displayed 0/1 formula literally would count shared ones only. [pp. 4–5; released MC/env/Env.py and memory.py]

**TSP construction.** A POMO-style policy sequentially builds a fresh feasible tour, using memory-derived edge features in attention. Completed tours enter memory; partial tours query it during the next construction. The reward penalizes similarity to earlier tours. Repeated construction remains construction, even though the best returned tour may improve across attempts. [pp. 4–5; Appendix A.2]

**Training.** REINFORCE trains the models. Appendix A uses 64-dimensional, three-layer MC/MIS encoders and a 512-dimensional, six-layer, 16-head TSP encoder. Training uses AdamW, learning rate 1e-4, batch 128 and gradient clipping 1. MC/MIS use discount 0.95 and 20-step episodes. TSP first trains 200 epochs without memory, then freezes the original policy and trains the added memory network for 50 epochs using five further constructions after an initial rollout. [Appendix A/Table 1]

## Experiments

MC/MIS training samples ER graphs with 50–200 nodes and edge probability 0.15. TSP trains on uniformly generated Euclidean instances up to 100 cities; the supplement specifies 20–100 while the main text gives 50–100. Tests cover ER 700–800, RB 200–300/RB 800–1200, and TSP 100/200/500. The main protocol uses 50 MC/MIS threads and 2N improvement steps; its TSP description uses 100 initial solutions and 20 constructions. [pp. 5–7]

| Task and dataset | Reported result and qualification |
| --- | --- |
| MC, ER 700–800 | MARCO 24205.97 in 49s versus ECO-DQN 24114.06 in 2.1 min and Burer 24235.93 in 1 min |
| MC, RB 200–300 | MARCO 2519.47 in 2.2s, matching Burer's rounded objective in 1 min |
| MIS, ER 700–800 | MARCO 43.78 in 17s versus MARCO-ind 43.72 in 19s; KaMIS remains better at 44.98 in 1 min |
| MIS, RB 800–1200 | MARCO 40.13 in 6s, below KaMIS 43.15 in 1 min |
| TSP 500 | MARCO 16.78 in 21s versus the no-memory constructor 16.90 in 2s; Concorde/LKH-3 report 16.59 in 1 min and LEHD 16.63 in 10 min |

The shared-memory ablation generally improves the independent-memory variant. These are comparisons at the displayed budgets, rather than proof of universal dominance or matched-hardware speedups: neural models use an A100 GPU, while exact/classical baselines use Xeon X5650 CPUs, and some comparator results/configurations are taken from their original papers. Table 2/3 explicitly show cases where a simple greedy or nearest-neighbor heuristic exceeds poorly transferring neural baselines. Appendix B/C studies neighbor count and revisit penalties; penalty experiments train five models per coefficient. [pp. 6–7; Appendix B–C]

## Limitations

- Memory and retrieval costs grow with stored solutions. The supplement gives O(N²+TN) storage for node-wise solutions and O(N²+TN²) for edge-wise solutions, apart from fixed-width/batch factors. Its TSP memory estimates are per stored construction, not total GPU usage including the policy and all threads. [p. 7; Appendix D]
- The graph/task-specific aggregation must be redesigned for new problems; cross-task checkpoint reuse is not demonstrated. No optimality certificate is supplied.
- Section 6.1 prints a minimization objective for MIS, although its definition, comparisons and implementation maximize independent-set size. This is retained as a printed inconsistency rather than redefining the task as minimum independent set.
- Main/supplement inference settings differ: the main text gives k20 and 20 TSP constructions, while supplementary Table 1 gives k3 and 10 constructions. The released TSP eval.py defaults instead use k10,10 samples, 50 POMO starts and a 10,000-entry memory; Table 1 lists 100 starts and 100,000 entries. An exact benchmark reproduction must select and report a configuration instead of treating all three as identical.

## Reproducibility

Read the complete nine-page [formal proceedings PDF](https://ijcai.org/proceedings/2024/0766.pdf), all four pages of the [author supplement](https://github.com/TheLeprechaun25/MARCO/blob/6106cb2819ca89208729fc46badb6d03d5566fb1/Supplementary_Material_MARCO.pdf), and the paper-specific [implementation](https://github.com/TheLeprechaun25/MARCO/tree/6106cb2819ca89208729fc46badb6d03d5566fb1). The 649-entry untruncated repository inventory contains the supplement, task-specific code, data and model files; no additional scientific PDF/slide/video/archive was identified there. Source/configuration checks support the constructive-versus-improvement distinction and document the default-setting differences above. The original Figure 2 and its full caption were cropped directly from proceedings page 4 and visually checked.

Publication metadata gives **August 2024** at month precision. The separate [arXiv history](https://arxiv.org/abs/2408.02207) lists v1 on **2024-08-05**, with the same title and four authors. This is the preprint date used for chronology; it does not establish a precise proceedings publication day. The review checks the complete scientific materials and source configuration without rerunning model training or claiming to reproduce the benchmark tables.
