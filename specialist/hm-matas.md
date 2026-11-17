---
id: hm-matas
short_title: TARGETNET
title: Heterogeneous Graph Transformers for Simultaneous Mobile Multi-Robot Task Allocation
  and Scheduling under Temporal Constraints
authors:
- Batuhan Altundas
- Shengkang Chen
- Shivika Singh
- Shivangi Deo
- Minwoo Cho
- Matthew Gombolay
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/82a227f51354b7ebafea51023d547d29-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/82a227f51354b7ebafea51023d547d29-Abstract-Conference.html
institutions:
- Georgia Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Routing
problems:
- Multi-Robot Task Allocation and Scheduling
summary: Residual heterogeneous graph models produce task allocations and static task
  priorities from the initial state; feasibility-heavy rewards train mobile multi-agent
  scheduling with important seed-selection and relaxed-baseline qualifications.
code_url: https://github.com/CORE-Robotics-Lab/NeurIPS2025_TARGETNET
---

# Heterogeneous Graph Transformers for Simultaneous Mobile Multi-Robot Task Allocation and Scheduling under Temporal Constraints

> **TL;DR:** TARGETNET generates heterogeneous mobile-agent task assignments and ordering scores from the initial observation, avoiding a new graph evaluation after every task. Its strongest reported results use selection across three trained seeds; task-level feasibility and a relaxed optimizer baseline require careful interpretation.

## Motivation

Mobile task allocation must combine agent-dependent execution/travel times, task windows and precedence constraints with minimum waiting times. Classical search can become expensive as teams/tasks grow. Sequential graph policies also repeatedly rebuild/process a large relational graph. The paper studies whether an initial-state allocation-and-ordering policy can retain useful task feasibility while substantially reducing schedule-generation time.

## Contributions

The model is named **TARGETNET**; HM-MATAS denotes the heterogeneous mobile multi-agent allocation/scheduling problem. Its graph contains agents, tasks, candidate assignments, task-order and global-state information. Edge-aware heterogeneous graph transformers and raw-input residual concatenations process pairwise travel/execution constraints. A simultaneous policy predicts assignments and scheduling priorities without updating its graph embeddings after every assignment. Experiments compare heuristic/genetic and sequential graph methods, transfer small-instance training to larger systems, and include qualitative Robotarium demonstrations.

This is a **specialist/constructive** solver for joint mobile multi-agent task allocation/scheduling. Varying agent count, task count, windows, wait times or velocities stays within that native problem. The method assigns one agent per task and constructs a global task order; it does not demonstrate one neural checkpoint jointly solving unrelated routing and scheduling problems.

## Methodology

Each task has a location, start/end window and heterogeneous execution duration per agent. Agents have locations and velocities; precomputed travel distances generate agent-specific travel times. The nominal optimization formulation minimizes makespan while requiring task assignment, sequencing, temporal dependencies and time windows. The learned reward instead combines dense+1/-1per-step feasibility feedback with a final reward containing the number of feasible assignments and normalized makespan. Thus learned evaluation emphasizes completing feasible tasks, and its final reward ratio is not a pure makespan approximation ratio (Equations1/7/8).

Candidate assignment nodes number O(agents*tasks), with O(agents*tasks²)assignment-transition edges. Node and edge attention pass relational messages, and residual layers concatenate raw input features. The simultaneous allocation component samples one agent for every task. Its scheduling component uses allocation-dependent scores and samples a task permutation without recomputing graph embeddings after each choice. The released implementation has separate allocation and scheduling graph networks, both evaluated from the initial observation; “one-shot” means avoiding repeated environment-conditioned graph recomputation, rather than literally one neural-module call.

Simultaneous policies train with REINFORCE and discounted feasibility/terminal rewards; sequential comparators use an actor-critic method described as SAC. Four graph layers are used, but simultaneous models use one attention head versus eight in sequential models. Reported learning rate is0.001and entropy coefficient0.01; the release uses discount0.95and a Monte Carlo return recurrence. These training/architecture differences accompany the sequential-versus-simultaneous comparison and should not be attributed solely to the number of forward passes. Simultaneous deployment uses allocation argmax and sorting of fixed task scores in the inspected code.

## Experiments

Training uses200ten-agent/twenty-task problems. Testing uses200small and200medium problems,30large problems, and10extra-large problems up to40agents/200tasks. Large problems are constructed by merging two/four medium problems on a shared map. The same trained native-task policy is applied without fine-tuning. Small-to-large timing uses an Apple M1Mac Studio with32GBRAM; the extra-large tests use an AMD EPYC7452server. Timing is reported over a separate subset of ten problems (PDF7/31-32).

**Selection protocol.** For each test instance, the main evaluation takes the best result among three separately trained seeds, then reports mean/standard deviation over instances. The task-feasibility percentage counts feasible task assignments, not the fraction of fully feasible complete schedules. “Optimality rate” is terminal reward divided by the corresponding optimizer-baseline reward. At extra-large scale the baseline is reported as partial, so rates above100%do not establish improvement over a certified optimum.

**Full result table.** Table2reports TARGETNET small-scale task feasibility98.17±2.88%, compared with100%for the optimizer,86.67%for Gen-EDF3and72.00%for HetGAT. Reported schedule-generation times are0.10s,1.27s,19.18s and3.12s, respectively; simple EDF is faster at0.07s. At extra-large scale, TARGETNET has97.85±0.81%feasible assignments and7.96±0.14s, versus the reported optimizer baseline27.05±2.62%and6232.24±5041.77s. The70.80difference is in percentage points; interpreting it as70.80%relative improvement is incorrect. The abstract's231.73%headline does not match these displayed feasibility entries, so this note retains the table's raw values instead of silently reconciling the headlines.

**Seed sensitivity and ablations.** Table4reports full-model small-scale feasibility98.17/55.10/18.47%for seeds10/11/12; at extra-large scale it reports97.85/32.25/0.90%. These results show substantial initialization sensitivity despite the strong selected model. The no-edge model has slightly higher best-seed extra-large feasibility98.20%and small feasibility98.28%; edge features are therefore not a uniform gain for every selected checkpoint. Across the three full-model extra-large seed means, the simple average is about43.67%, substantially below97.85%; this is curator arithmetic on rounded table entries, not another experiment. Sensitivity tests vary windows, wait constraints and agent speeds. They assess this task family and do not prove robustness to arbitrary dynamic changes.

Robotarium video and obstacle-animation examples demonstrate execution qualitatively. The scheduler does not explicitly handle inter-agent collision avoidance; the platform supplies dynamic collision handling, which can delay execution relative to the scheduler's static travel-time model (AppendixH).

## Limitations

Static precomputed travel omits changing obstacles and direct agent-agent collision avoidance. Initial-state priorities cannot react to arbitrary execution disturbances without replanning. Per-instance best-of-three selection, a small extra-large test set and unstable individual seeds constrain how the headline performance generalizes to a single trained checkpoint. Genetic baselines are restricted to one/three generations with population100, and the architecture/training choices differ between sequential and simultaneous policies. No approximation ratio, full-schedule feasibility guarantee or training convergence theorem is established.

### Curator Analysis

The published formulation has hard assignment/time constraints and a makespan objective. However, both the publisher-supplied code and the current GitHub `solve_with_MILP` set that objective and then unconditionally call `m.feasRelaxS(0, False, False, True)` before optimization. The [documented Gurobi semantics](https://docs.gurobi.com/projects/optimizer/en/current/reference/python/model.html#Model.feasRelaxS) change the objective to total linear-constraint violation; with `minrelax=False`, the original makespan objective is not retained as the optimization priority. Even on a fully feasible problem this new objective can be indifferent among schedules with different makespans. The evaluation also creates a random schedule if the solver returns none and randomly fills missing assignments before replaying the result in the environment. Accordingly, these released baseline results should not be called certified incumbents of the original hard-constrained makespan MILP.

This is a source/API-semantics audit of the inspected releases, not a rerun proving which historical result used which branch. The local check records the exact call arguments and an elementary objective distinction: for min x subject to1<=x<=10, x=1and x=10both have zero violation cost although only x=1minimizes the original objective. Gurobi was not installed locally and no optimizer experiment is claimed. The table percentages, timings and reward ratios remain reported observations with the above qualifications.

## Reproducibility

- All38pages of the [formal article](https://proceedings.neurips.cc/paper_files/paper/2025/file/82a227f51354b7ebafea51023d547d29-Paper-Conference.pdf) were read, including references1-98, the complete checklist, MILP/graph/training definitions, all rotated tables and scientific AppendicesA-I. Sixteen central pages were rendered and visually checked. The publisher's canonical title says “Multi-Robot”; the PDF title says “Multi-Agent” and has the same six authors/hash. All authors are at Georgia Institute of Technology. NeurIPS2025conference identity is separate from the explicit proceedings publication date April23,2026; DOI10.52202/085713-3031.
- The [publisher supplement](https://proceedings.neurips.cc/paper_files/paper/2025/file/82a227f51354b7ebafea51023d547d29-Supplemental-Conference.zip) was downloaded and recursively inventoried:554entries including the nested code ZIP and AppleDouble metadata, no scientific PDF. The MP4and GIF were checked separately. Exact-title OpenReview APIv1/v2queries returned403; the complete registered PDF and scientific media are covered, with no explicitly missing scientific appendix.
- The76.23sMP4was visually checked at2sintervals plus its final frame,40samples spanning the whole video; this is sampling, not frame-by-frame playback. Its complete decoded16kHzmono audio has1,220,069samples, all exactly zero, so there is no scientific narration. The GIFhas2,182frames, all decoded;23frames at every100th frame plus the final frame were visually checked across the full animation. Stored GIFframe delays are zero, so218.2sfrom ffmpeg's10fpsinterpretation is only nominal; the animation's displayed simulation time reaches72.01s. File hashes and exact coverage are saved in `media-metadata.json`, `media-coverage.json` and `recompute_scope.json` under this paper's audit directory.
- AppendixIverifies the [official implementation](https://github.com/CORE-Robotics-Lab/NeurIPS2025_TARGETNET). Commit`7906db4762a2e18670bca6ca91e7af6119f1fc75` has78files with generators/configuration, model/training/evaluation code and analysis outputs, but no pretrained tensor checkpoint. The publisher ZIPincludes code and logs; its MILP relaxation call was checked independently of GitHub. The README, training/evaluation launchers, allocation/order decoder, edge/residual layers, environment reward/feasibility sections, Monte Carlo loss and optimizer/fallback paths were inspected. The supplied simultaneous training launcher currently selects the plain`hgt`ablation; reproduce the intended full model with an explicit matching configuration.
- No complete neural training or benchmark was rerun. The local AST/API-scope and rounded-table arithmetic checks are in `research/full-text-review/hm-matas/close_checks.py` and `recompute_scope.json`. Two existing-catalogue relationships have explicit body and complete bibliography evidence: the recurrent transformer CSP paper and Bello's neural combinatorial optimization paper.
