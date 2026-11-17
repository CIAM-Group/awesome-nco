---
id: rdc-sat
short_title: RDC-SAT
title: Learning Splitting Heuristics in Divide-and-Conquer SAT Solvers with Reinforcement
  Learning
authors:
- Shumao Zhai
- Ning Ge
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/f5c683b93319b82689af3afc71257df2-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/f5c683b93319b82689af3afc71257df2-Abstract-Conference.html
institutions:
- Beihang University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
problems:
- Boolean Satisfiability
summary: RDC-SAT learns dynamic partition-variable selection for Painless D&C SAT
  solving, using tree-aggregated runtime rewards and GPU-per-split or CPU-once inference
  with separate LRB/VSIDS-trained models.
---

# Learning Splitting Heuristics in Divide-and-Conquer SAT Solvers with Reinforcement Learning

> **TL;DR:** A graph actor-critic learns which variable should partition a running SAT subproblem between parallel workers. It changes D&C splitting, rather than every internal CDCL branching decision. Reported PAR2 gains use explicitly filtered evaluation subsets, and random-versus-competition tests use different models adapted to their underlying CDCL branching rules.

## Motivation

GNN decisions can be expensive when called at every CDCL branch. Parallel divide-and-conquer splitting is less frequent and influences load balance and total solving time, making it a candidate for learned decisions with manageable inference overhead. A training wrapper records the branching dependency tree because chronological split requests from different workers are not necessarily successive parent/child states (Sections 1-3).

## Contributions

RDC-SAT contributes the PainlessEnv interaction layer, a binary-tree record of subproblem outcomes, different SAT/UNSAT runtime-return aggregation and DPPO-trained split-variable selection. Deployment supports recurrent GPU inference or a one-time CPU-generated ranking. The experiments isolate splitting heuristics within the same underlying Painless configuration and include a small circuit-equivalence comparison with a portfolio solver.

The entry remains a specialist SAT solver. The random benchmark uses a model trained with LRB CDCL branching; the competition benchmark uses a newly trained/adapted VSIDS model. Both learn from random 3-SAT instances, but the experiments do not demonstrate a single unchanged checkpoint across those two solver configurations or distinct native CO tasks.

## Methodology

Painless uses MapleCOMSPS workers, clone-based splitting, work stealing and all-to-all learned-clause sharing. At a split, the graph represents variables, original clauses, core/tier2 learned clauses, literal polarity, activity/LBD and global solver counts. An encoder/processor/decoder GNN feeds an actor over valid unsplit variables and a critic pooling clause/global features. The architecture uses four processing steps, MLP layer normalization and aggregation batch normalization (Sections 3-4; Appendices B-C).

Training retains a binary tree of split/solve times. For UNSAT parents it aggregates the slower child; for SAT parents it uses the faster satisfiable child, including split and elapsed transition times. Despite the terminology “discounted rewards,” the experiments set gamma to **one**. The custom environment defers return computation until postorder traversal. During training it continues other subproblems after the first SAT result to retain a complete tree, whereas ordinary production solving can stop early. This is a practical dependency/credit-assignment design, not a proof that an MDP cannot represent a global tree state.

Five CPU exploration processes each run sixteen solving threads and send experience to one GPU learner. Training uses balanced 1,000-instance sets at 300 and 350 variables, Adam/PPO, normalized returns and decreasing epsilon-greedy exploration. LRB training takes two to three days, followed by approximately half a day for the VSIDS model. TorchScript exports remove the Python dependency at deployment. GPU-always recomputes scores at each split; CPU-once calls the network at the first split and reuses its ranking. Very large graphs trigger a default-heuristic fallback (Sections 4.4-5; Table 2).

## Experiments

Initial evaluation selects 200 random instances at 450/500 variables and 305 of the 400 SAT Competition 2023 instances with combined variable/clause count below one million. All methods receive sixteen threads and a 5,000-second limit; PAR2 charges 10,000 seconds for a timeout. Table 1 then **excludes instances that every compared solver times out on**, leaving 141 random and 140 competition cases. Its headline percentages are conditional on those retained subsets (Section 5.2).

On the retained random cases, GPU-always solves 129/141 versus FLIPS 124/141 and reduces PAR2 from 1,988.64 to 1,489.96, about 25.08%. CPU-once solves 126 and reduces PAR2 to 1,769.95. On the retained competition cases, both learned modes solve 135/140 versus FLIPS 133/140; GPU-always reduces PAR2 from 1,108.25 to 942.57, about 14.95%, and CPU-once to 1,060.67. CPU-once's mean wall-clock time there is 882.10 versus FLIPS 858.25, so its PAR2 improvement is not a uniform wall-clock improvement. Split/solve CPU times sum across workers and are distinct from elapsed wall-clock time (Table 1).

Appendix E.3 includes the commonly unsolved random instances in its separate 100-instance tables. Easy 350-variable cases favor FLIPS over GPU-always, illustrating inference overhead. Averaging its 450-/500-variable PAR2 entries gives 4,000.42 for GPU-always and 4,351.99 for FLIPS across all 200 cases. The small miter circuit-equivalence experiment uses 100 instances, sixteen threads and a 1,000-second cap: RDC-SAT solves eighty with PAR2 513.64, versus PRS seventy-nine and 595.44. This domain result is not an overall SAT-competition championship claim (Tables 4-5).

## Limitations

The authors study splitting rather than construct a fully modern state-of-the-art parallel SAT solver. MapleCOMSPS, graph memory limits, inference cost, random-only training and retained features restrict the scope. CPU-once loses the benefit of later learned-clause information. Appendix F acknowledges GIL serialization and CPU inference distort training split costs; evaluation ran multiple solvers concurrently with aggregate threads exceeding physical cores. Its claim that resource contention affects every solver equally is an assumption, not an independently established measurement. No repeated-run uncertainty analysis establishes universal superiority.

### Curator Notes

For scale of the denominator effect only, reconstructing PAR2 on the initially selected 200/305 cases yields approximately 8.08%/1.29% GPU-always reductions over FLIPS, rather than the retained-subset 25.08%/14.95%. This arithmetic assumes each excluded common-timeout case receives 10,000 seconds for every solver and uses rounded published means, so the percentages are approximate; rankings are unchanged by the common additive penalties. The random value also agrees with Appendix Table 4's full-case entries. This is a transparent recomputation of printed summaries, not a fresh solver benchmark, and does not replace the authors' explicitly conditional result.

## Reproducibility

- All 22 pages of the [formal ICLR 2025 article](https://proceedings.iclr.cc/paper_files/paper/2025/file/f5c683b93319b82689af3afc71257df2-Paper-Conference.pdf) were read, including complete references, Appendices A-F, every algorithm and parameter/result table. Eight key graph/reward/protocol/appendix pages were visually checked. Publisher metadata confirms Shumao Zhai/Ning Ge and May 1, 2025; the byline confirms Beihang/CCSE affiliations.
- The publisher provides no separate supplement link. Manual OpenReview API v1/v2 requests for `uUsL07BsMA` returned 403; all named scientific appendices are included in the read proceedings version. No explicit missing scientific document was identified.
- No author implementation/checkpoint URL was verified from the full article or checked publisher/search results. Painless, PyTorch and PyG are dependencies, not themselves releases of RDC-SAT. Training, timing and SAT-solving experiments were not rerun. A small arithmetic script checks only the published PAR2 denominator calculation. Two exact existing-paper citation edges are recorded, merging the two cited Graph-Q-SAT versions into one work identity.
