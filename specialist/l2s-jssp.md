---
id: l2s-jssp
short_title: L2S-JSSP
title: Deep Reinforcement Learning Guided Improvement Heuristic for Job Shop Scheduling
authors:
- Cong Zhang
- Zhiguang Cao
- Wen Song
- Yaoxin Wu
- Jie Zhang
year: 2024
date: '2024-05-31'
publication:
  date: '2024-05-31'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/c75abb33341363ee874a71f81dc45a3a-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/c75abb33341363ee874a71f81dc45a3a-Abstract-Conference.html
institutions:
- Nanyang Technological University
- Singapore Management University
- Shandong University
- Eindhoven University of Technology
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Scheduling
problems:
- Job Shop Scheduling Problem
summary: A stochastic GNN policy swaps N5 critical-block operation pairs in complete
  JSSP schedules, retaining the best incumbent; batched message passing evaluates
  the resulting schedules.
code_url: https://github.com/zcaicaros/L2S
---

# Deep Reinforcement Learning Guided Improvement Heuristic for Job Shop Scheduling

> **TL;DR:** Learn which critical-block operation pair to swap in a complete job-shop schedule. A topology/context GNN chooses moves without evaluating the entire neighborhood, while a GPU-compatible message-passing evaluator computes schedule times. Larger search budgets improve quality, with important budget and complexity qualifications.

## Motivation

Constructive scheduling graphs omit parts of the machine-order information until operations are dispatched. Conventional improvement heuristics represent complete schedules, but evaluating every candidate move is expensive and greedy move choice can cycle. The paper instead learns a stochastic move-selection policy over complete disjunctive graphs (Sections1-2).

## Contributions

The method combines a topological GIN module, a context-aware module with separate job/machine attention, an N5 move policy, n-step REINFORCE training and a batched schedule evaluator. It evaluates classic JSSP benchmarks, longer search horizons, five-policy ensembles and much larger synthetic instances. Its central empirical contribution is learned search control rather than a proof of optimal scheduling (Sections4-5; AppendicesA-M).

This is a **specialist improvement solver for JSSP**. Each job visits the fixed machines in a predefined order. Five models are trained separately at10x10,15x10,15x15,20x10 and20x15; the main test selects the closest-size model, while the ensemble runs all five and retains the best result. Size transfer and ensembles do not demonstrate one checkpoint solving different native optimization problems. Related FFSP and semiconductor scheduling work is discussed, not implemented as additional tasks (PDF3/7-9/20-21).

## Methodology

Start from the feasible FDD/MWKR dispatching schedule. The graph contains job-precedence arcs and machine-processing order. From one critical path, N5 proposes swaps of the first/last adjacent pair in each critical block, subject to the special restrictions on the first/last block. The selected swap changes machine-order arcs and the schedule is recomputed; the current schedule may worsen, while the best incumbent is retained. Empty action sets receive a no-op. This restricted-neighborhood stopping condition is not a global optimality certificate (Sections3-4; AppendixJ).

Operation features are processing duration, earliest start and latest start. Four TPM/CAM layers combine topology and separate job/machine context. An MLP transforms node/global embeddings; the printed method then explicitly forms a full node-pair score matrix, masks non-N5 pairs and samples a move. Reward is the positive reduction against the best makespan found so far, so cumulative undiscounted reward telescopes to initial minus best makespan. The best value is therefore part of the reward's history even though the printed state is described only as the current schedule (PDF4-7).

The forward evaluator propagates readiness flags and max-plus start-time messages along the DAG; after at most its dependency depth H, the terminal value is makespan. This is suitable for GPU batches, but H synchronous rounds are distinct from a single linear-work DAG traversal. The release computes latest starts by reversed-edge max aggregation followed by addition of the **receiving node's** duration. The printed backward formula uses a different duration index, discussed below (PDF7/15-17).

Printed training uses128,000 generated instances per size, batch64,500-step episodes,10-step updates, Adam5e-5 and100validation instances every10batches. Test horizons are500/1000/2000/5000. Processing times are normalized by99 and schedule times by1000. All experiments sample actions rather than use a stated greedy policy (AppendixB).

## Experiments

**Classic benchmarks.** Table1 covers Taillard,ABZ,FT,LA,SWV,ORB andYN. Gaps use optimal or best-known literature makespans, which are not all certified optima. The500-step model usually improves on learned dispatchers and hand rules, but does not win every row: on SWV20x10 it has29.6% versus RL-GNN28.4%. Longer search reduces its gap to17.8%, still well behind CP-SAT0.1% on that row. On Taillard100x20,5000steps reach3.0% in8.4minutes versus CP-SAT3.9% with a one-hour limit. On Taillard30x20, the offline policy reaches12.6% in about144seconds versus the compared per-instance online RL13.08%/600seconds; AppendixF shows losses on five of the ten individual cases (PDF8-9/18).

**Controlled improvement comparisons.** GD,FI andBI use the same initial schedules and the authors' evaluator. FI/BI restart by drawing from a100-solution memory; GD keeps moving without that restart. For5000steps, the adapted TSN5 tabu baseline has better average quality: the authors report about1.9% relative disadvantage for the learned method, which is generally faster. The equal-time table favors the learned method on many rows, with exceptions and ties. AppendixH's prose says90seconds whereas Table5's caption says two minutes, so the precise equal-time budget is inconsistent in the source (PDF17-19).

**Evaluation and extrapolation.** Table2 compares Python CPM with the proposed evaluator on100x20. A single graph takes0.058seconds on GPU versus CPM0.009seconds; batch512 takes0.453seconds versus5.183seconds, giving11.4x batch speedup. This supports throughput, not a single-graph speedup claim. AppendixL tests100random cases each at200x40,500x60 and1000x40 with the20x15-trained model:500steps yield gaps-24.31%/-20.56%/-15.99% against one-hour CP-SAT incumbents in88.7seconds/3.4minutes/4.1minutes per case. These are finite-run comparisons, not certificates of optimality (PDF16/21).

The five-model ensemble improves several displayed gaps but entails multiple searches. Ablations favor combining TPM and CAM; a second attention head converges faster without a substantial displayed final-value difference. Three-seed training curves concern10x10 and do not constitute confidence intervals for every benchmark result. Hardware is Ryzen3600 plus one RTX2070S. The paper reports unbatched mean per-instance main times and author reimplementations of RL-GNN/ScheduleNet; the public test script instead batches instances, which must be accounted for in reproducing timing (PDF9/14/18/20-21).

## Limitations

The native domain is fixed-machine JSSP with one selected critical path and a restricted N5 neighborhood. Quality depends on initialization, search budget, training size and stochastic moves. No global-convergence, approximation-ratio or guaranteed cycle-escape theorem is established. CP and the tested tabu search remain stronger in various quality comparisons. Results from the adapted TSN5 baseline do not establish dominance over all specialized scheduling metaheuristics.

### Curator Notes

**Scope of linear complexity.** Theorem4.1(PDF7) calls the complete policy linear in jobs/machines. AppendixC proves sparse TPM/CAM embedding costs with fixed widths/layers, then treats action selection as just an MLP(PDF15). However, PDF6 explicitly forms `SC=h'h'^T`, an N-by-N matrix. The released `Actor.forward` also uses dense `torch.bmm` and a dense mask: ordinary evaluation needs O(N²q) scoring work and O(N²) score storage. Thus the embedding analysis must not be presented as a linear bound on the complete implemented policy. The evaluator additionally uses up to H full-edge rounds.

**Printed formulas versus implementation.** Corollary4.3(PDF7) and its D.2 proof(PDF16) use the successor duration p_U when propagating negative latest starts. For one operation V of duration5 followed by the zero-duration terminal, Cmax=5 and the printed update gives dbar_V=-5, whereas its actual latest start is0. The public evaluator instead adds p_V after reverse aggregation and returns0 in this example. Algorithm1(PDF13) also prints ascent on a negative REINFORCE loss, whereas the release minimizes that negative loss with Adam. These are bounded text/proof/implementation discrepancies, not evidence that the reported scheduling experiments used the erroneous printed formulas.

The current release further uses mean GIN aggregation rather than the printed sum,128-wide policy layers rather than the stated64, a one-move tabu memory in the environment, and a fixed configurable test model rather than automatic closest-size selection. The graph features supplied to the actor omit the incumbent/tabu history, so treating the printed current-schedule observation alone as a full Markov state needs qualification. AppendixJ's prose also reverses one predecessor-arc direction relative to its displayed new sequence; the figure and public topology update have the expected predecessor direction. No neural benchmark was rerun to resolve historical differences.

## Reproducibility

- All21pages of the [formal ICLR2024 PDF](https://proceedings.iclr.cc/paper_files/paper/2024/file/c75abb33341363ee874a71f81dc45a3a-Paper-Conference.pdf) were read, including complete references and AppendicesA-M. Sixteen key pages were visually checked, covering all eight figures, seven tables and central formulas/proofs. Publisher HTML confirms May31,2024 and the five authors; PDF1 supplies the four institutions.
- The publisher lists the integrated21-page paper without a separate scientific attachment. Both OpenReview notes APIs for`jsWCmrsHHs` returned403. No explicitly missing scientific document was found. The repository inventory has no PDF/ZIP; its talk slide deck and raw/result files are not additional peer-reviewed paper appendices.
- The [official repository](https://github.com/zcaicaros/L2S) was checked at`4deb8fcf344d0730049267ab66abc17bf469702d`:1,111files and36`.pth`checkpoints, including size/module variants. README, complete actor, evaluator, training, parameters, test and environment sources were read. Its pinned environment is an older PyTorch/PyG/CUDA stack. Committed raw/result spreadsheets were inventoried, not independently re-benchmarked or all-cell audited; this note's reported experimental numbers remain the article's.
- Curator arithmetic and rendered evidence are retained in the research cache, including`recompute_printed_backward.py`. This tiny calculation checks the printed latest-start index and dense matrix size; it is not execution of the full neural solver. Thirteen catalogue relations require explicit body citations plus full bibliography identity; title/year variants were resolved manually.
