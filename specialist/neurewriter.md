---
id: neurewriter
short_title: NeuRewriter
title: Learning to Perform Local Rewriting for Combinatorial Optimization
authors:
- Xinyun Chen
- Yuandong Tian
year: 2019
date: 2018-09-30
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper/2019/hash/131f383b434fdf48079bff1e44e2d9a5-Abstract.html
arxiv_url: https://arxiv.org/abs/1810.00337
code_url: https://github.com/facebookresearch/neural-rewriter
institutions:
- Facebook AI Research
- University of California, Berkeley
figure:
  path: paper-assets/neurewriter/framework.png
  alt: Complete NeuRewriter framework with region selection, rule selection, and the
    local state transition.
  caption: 'Figure 1: Learned region and rule selection for iterative local rewriting.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2019/file/131f383b434fdf48079bff1e44e2d9a5-Paper.pdf#page=2
scope: specialist
paradigm: improvement
problem_families:
- Routing
- Scheduling
- Symbolic Optimization
problems:
- Capacitated Vehicle Routing Problem
- Online Multi-resource Job Scheduling
- Expression Simplification
summary: NeuRewriter learns where to apply task-specific legal rewrite rules, using
  actor-critic training to optimize complete expressions, schedules, and vehicle routes.
publication:
  date: '2019'
  source_url: https://proceedings.neurips.cc/paper/2019/hash/131f383b434fdf48079bff1e44e2d9a5-Abstract.html
---

# Learning to Perform Local Rewriting for Combinatorial Optimization

> **TL;DR:** A region policy chooses where to edit a complete solution, and a rule policy chooses a legal local rewrite. Separate task-specific models optimize Halide expressions, online resource schedules, and CVRP routes.

## Motivation

A constructive policy can be difficult to train when the output has a rich structure or complicated feasibility constraints. Existing local search already provides legal transformations, but its effectiveness depends on choosing the right region and rule. NeuRewriter learns these choices while retaining the domain's feasible representation and rewrite machinery. It can use temporarily unfavorable moves when they enable later gains.

## Contributions

- Factorizes learned local search into region selection and rule selection, trained jointly with an actor-critic objective based on objective changes.
- Provides three distinct instantiations: expression simplification, online single-machine scheduling with multiple resource types, and capacitated vehicle routing.
- Evaluates rewrite budgets, distribution transfer, alternative initial schedules, and task-specific heuristics. The common framework does not imply a shared checkpoint or an identical state encoder across tasks.

## Methodology

A state is a feasible solution `s` with cost `c(s)`. A region `w` and a legal rule `u` produce `s' = f(s,w,u)`, with reward `c(s)-c(s')`. Regions are expression subtrees, scheduled jobs, or route customers. A critic estimates the discounted future improvement for each region; its softmax defines the region policy. The critic is regressed to sampled discounted returns, and the rule actor uses the return minus that critic as its advantage. This is not bootstrapped DQN. The combined loss weights the critic term by 10, with discount 0.9. [Main, Sections 3-4, pp. 2-4.]

**Expression simplification.** A tree LSTM encodes the Halide expression. The rule selector receives both the root and selected-subtree embeddings. The implementation groups the manually defined rules into 19 categories. Min/max expansion supplies an example of an *uphill* rule: expression length can increase before a later simplification. Semantics are preserved by the supplied rules, rather than learned from scratch. [Main, Section 5.1; supplement, A.1, B.1, C.1.]

**Online scheduling.** Jobs arrive at one machine with `D` resource types. Each nonpreemptive job has fixed duration and resource demands; a pending queue holds at most 10 jobs. The objective is mean slowdown `(completion-arrival)/duration`. This is not the classical job-shop problem. An earliest-job-first schedule is encoded as a dependency DAG with a child-sum DAG-LSTM. A rewrite relocates a job to its arrival time or after another completion, then repairs resource conflicts by rescheduling affected jobs in topological order. This repair is more substantial than a simple pairwise swap. [Main, Section 5.2; supplement, Algorithm 1 and C.2.]

**CVRP.** A nearest-feasible-customer heuristic supplies the initial route, with depot returns subject to remaining capacity. A bidirectional LSTM encodes customer and predecessor coordinates, demand, distance, and remaining load. A selected customer is relocated after another node, using an attention rule selector for the variable candidate set. The operator should not be equated with a generic 2-opt move. [Main, Section 5.3; supplement, A.3 and C.3.]

The LSTM hidden dimension is 512 and the MLP hidden size is 256. Training uses Adam, batch size 128, learning rate `1e-4` with decay, and gradient clipping at 5. Training samples regions and rules with bounded resampling; evaluation chooses them greedily and stops if the best region has negative predicted gain or the selected rule cannot apply. The maximum rewrite budget is 50 for expressions and schedules, and 200 for CVRP. No universal monotonic-improvement guarantee follows from these rules. [Supplement, C.4-D, Algorithm 2.]

## Experiments

**Expressions.** Approximately 1.36 million generated Halide expressions are divided 8:1:1 into training, validation, and test sets. The test set contains about 136,000 expressions. Figure 3 reports mean character-length reductions of 57.28 for NeuRewriter, 50.81 for Z3's context solver simplifier, 47.08 for heuristic search, 36.13 for the Halide rewriter, and 17.74 for Z3's basic simplifier. Table 1 gives average per-expression times of 0.159 s for NeuRewriter and 1.375 s for the context solver. These are simplification metrics on generated expressions, rather than end-to-end compiler speedups. Training on shorter expressions is also tested on longer inputs. [Main, pp. 6-8; supplement, A.1 and G.]

**Scheduling.** The workload has 100,000 sequences of roughly 50 jobs, split 80,000/10,000/10,000. At 20 resource types, Table 5 reports mean slowdowns of 3.94 for NeuRewriter, 5.00 for SJF, 10.18 for DeepRM, and 15.18 for the configured OR-Tools baseline; offline SJF obtains 4.26 with additional future information. NeuRewriter averages 0.037 s per sequence, versus 0.020 s for DeepRM. Distribution-transfer tables include unfavorable cases, and simple heuristics are competitive when all jobs have similar short or long durations. These results concern the specified resource model and solver configuration. [Main, Figure 4 and Table 1; supplement, E, Tables 3-5.]

**CVRP.** Uniform unit-square instances have 20/50/100 customers, integer demands 1-9, and capacities 30/40/50. Table 6 reports NeuRewriter lengths 6.16/10.51/16.10, versus 6.25/10.62/16.23 for sampled AM and 6.43/11.31/17.16 for OR-Tools. Initial heuristic means are 7.74/13.47/20.36. NeuRewriter averages 0.133/0.211/0.398 s per instance under the 200-step cap; the neural CVRP methods process one instance at a time. Transferring the 50-customer model to 100 customers yields 17.33, worse than both the matched-size model and the 17.16 OR-Tools result. Exact reference solutions are available only for the 20-customer comparison. [Main, Figures 5 and Table 1; supplement, A.3 and F, Table 6.]

The common evaluation host has two Quadro GP100 GPUs and 80 CPU cores, but the reported neural implementation uses one GPU, search baselines use four CPU cores, and search has a 10-second timeout. Reported advantages do not establish dominance under arbitrary hardware or search budgets. [Main, Section 6.]

## Limitations

The framework requires a task-specific feasible representation, encoder, rule set, initial solution, and feasibility repair. It does not discover general legal transformations or certify optimality. Separate task models support a specialist classification despite the three-domain framework. The authors note that local rewriting can be expensive when an improvement requires a large structural change; construction from scratch may then be preferable. Cross-size and workload transfer are conditional, and the reported OR-Tools and neural baselines are the versions and budgets used in this 2019 study.

## Reproducibility

- **Official code:** [facebookresearch/neural-rewriter](https://github.com/facebookresearch/neural-rewriter), explicitly linked in the paper. Its README covers all three tasks, dataset generators, training and evaluation arguments, and baseline commands. Repository instructions were inspected; experiments were not rerun.
- **Reading evidence:** The complete 12-page publisher paper and the publisher ZIP's sole 8-page `supp.pdf` were freshly read, including Appendices A-G, all result tables, and qualitative examples. [Audit record](../data/reviews/papers/neurewriter.json).
- **Dates:** The first arXiv submission is 30 September 2018; the formal venue is NeurIPS 2019. A conference-wide notification date is not evidence of this paper's individual acceptance date.
- **Figure:** The asset is a complete crop of original Figure 1 on publisher PDF page 2, including both policy selection and the state transition.
