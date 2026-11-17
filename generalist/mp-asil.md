---
id: mp-asil
short_title: MP-ASIL
title: Towards Generalizable Multi-Policy Optimization with Self-Evolution for Job
  Scheduling
authors:
- Inguk Choi
- Woo-Jin Shin
- Sang-Hyun Cho
- Hyun-Jung Kim
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/2330c4be5e12c504705ba1db8a507966-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/2330c4be5e12c504705ba1db8a507966-Abstract-Conference.html
institutions:
- KAIST
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Routing
problems:
- Single-Machine Scheduling Problem
- Unrelated Parallel-Machine Scheduling Problem
- Permutation Flow Shop Scheduling Problem
- Flexible Flow Shop Scheduling Problem
- Job Shop Scheduling Problem
- Flexible Job Shop Scheduling Problem
- Stochastic Flexible Job Shop Scheduling Problem
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Vehicle Routing Problem with Time Windows
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Duration Limits
- Vehicle Routing Problem with Backhauls and Duration Limits
- Open Vehicle Routing Problem with Duration Limits
- Vehicle Routing Problem with Backhauls and Time Windows
- Open Vehicle Routing Problem with Duration Limits and Time Windows
- Open Vehicle Routing Problem with Backhauls and Time Windows
summary: Latent-conditioned policies learn through advantage-weighted self-imitation;
  separate scheduling backbones and a shared multi-task VRP model are evaluated.
code_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/2330c4be5e12c504705ba1db8a507966-Supplemental-Conference.zip
---

# Towards Generalizable Multi-Policy Optimization with Self-Evolution for Job Scheduling

> **TL;DR:** Condition a neural constructive solver on latent variables, generate several candidate solutions, and imitate the best candidate with an advantage-based weight. The paper evaluates separate scheduling models and a genuinely shared multi-task routing model; the public supplement covers only five scheduling implementations.

## Motivation

A single scheduling policy can repeatedly sample similar solutions. Multiple decoders can diversify search but increase model size, while reward shaping adds task-specific design work. MP-ASIL uses latent-conditioned policies and self-generated labels to encourage useful diversity without external solution labels or a shaped reward. It still needs a feasible construction environment, action masks and the final objective to rank complete solutions (Sections1-3).

## Contributions

The method combines a shared-parameter latent policy population, winner-only self-imitation and an adaptive label weight computed from all candidate costs. It is applied to six deterministic scheduling variants, stochastic FJSP, TSP/CVRP and multi-task VRP constraint combinations. Ablations study each component, latent priors, training/inference population sizes and optional latent-space search. The paper explicitly reports no formal theoretical results; the optimization rationale and diversification claims are empirical (PDF4-10/17/25-47).

**Classification: generalist/constructive, with a precise model boundary.** AppendixE.3 trains a POMO-MTL-based model jointly on CVRP, VRPTW, OVRP, VRPB and VRPL, then evaluates the same multi-task setting on five unseen combinations of backhaul, route duration, open routes and time windows. This is shared neural modeling across distinct feasible sets. In contrast, the six scheduling studies explicitly use problem-specific backbones and training, and the main TSP/CVRP experiments use separate models. Latent policies sharing one network within an individual scheduling task are not themselves cross-task sharing (PDF6/28-30/41-43).

## Methodology

For each instance, sample k latent vectors, hold each vector fixed during an autoregressive rollout, and generate one candidate per conditioned policy. Select the minimum-cost trajectory and its associated latent vector. The loss is its mean stepwise negative log-likelihood multiplied by **abs(best cost - population mean)/population standard deviation**. Only the winner's trajectory likelihood is directly imitated; the other costs affect the weight. Pseudo-labels need not be optimal, and the weight measures relative separation within the sampled population, rather than an absolute optimality gap (Eq1-4; Algorithm1).

The default prior concatenates four uniform[-1,1] coordinates and a twelve-dimensional one-hot category. UPMSP uses two continuous coordinates and six categories. For HELD models, the described latent embedding is concatenated into attention query/key/value inputs; for LEHD models it enters the decision MLP after dynamic hidden embeddings. The number of neural parameters is fixed as k grows, but rollout memory and computation grow with k. Random policy sampling is the main inference procedure; AppendixD.10 additionally searches latent vectors with three parallel CMA components and 1,600 attempts (AppendicesB/D.10).

The scheduling implementations differ substantially. SMSP minimizes weighted tardiness with a BQ-style transformer. UPMSP includes machine eligibility, release dates and sequence-dependent setup times. PFSP uses a MatNet-based permutation constructor and separate five-/ten-machine models; FFSP fine-tunes separate MatNet/PolyNet-based models at three sizes. JSSP uses the SLIM pointer scheduler, while deterministic FJSP uses DANIEL. Stochastic FJSP separately applies the method to SPM-DAN, training on 95% makespan VaR and evaluating both VaR and mean makespan without retraining. These remain constructive schedulers; self-improvement during training does not mean local editing of complete schedules at inference (AppendicesC/D.7/F).

## Experiments

**Scheduling.** On Taillard PFSP, mean gap is1.68% versus NEH2.28% and the compared neural IL18.38%. On Taillard JSSP, mean gap is7.4% versus SLIM7.8%, while OR-Tools is2.0%. This is an average neural improvement: at15x15, MP-ASIL6.8% is worse than SLIM6.5%; at30x20,12.8% is worse than12.7%. Lawrence's average2.3% ties TBGAT's displayed average and improves SLIM2.5%, rather than establishing sole best quality. Synthetic Gamma-PFSP transfer extends training20x5 to1000x5; at100x5, however, NEH117.24 beats MP-ASIL117.37 (Tables2-3/9-11).

SMSP, UPMSP and FFSP gaps in Table1 use **MP-ASIL Large**, with16times as many policies, as the anchor. Their0% values do not certify global optimality. At UPMSP100x6, k=6 improves the displayed objective502.4 to458.1 versus the same-backbone RL baseline at similar10.6/10.7minutes. Detailed parameter combinations are not uniformly won: for50x3 withT=0.2/R=0.2, ATCSR37.35 is better than MP-ASIL54.76 (Tables1/8).

Deterministic FJSP training at10x5 transfers to larger sizes; on20x10 the reported gap is-3.00% relative to an1800-second OR-Tools incumbent, not a negative gap to a certified optimum. Public Brandimarte/edata/vdata/rdata gaps are7.32/7.24/0.50/4.66%. Stochastic FJSP improves the SPM-DAN reference's VaR by2.35-5.07% and its expected makespan by2.24-4.39%, with slightly greater runtime on larger instances (Tables12-15).

**Routing and actual shared tasks.** Separate POMO-based TSP100/CVRP100 models obtain0.000%/0.28% gaps relative to LKH3; this is not a proof of global optimality. Size and distribution transfers are tested. With a separate BQ backbone at large TSP sizes, MP-ASIL is worse at200/1000 nodes, ties the printed100-node gap, and is slightly better at500 nodes than the two displayed BQ baselines (Tables5/17-19).

The joint VRP experiment uses5,000instances per task. Mean gaps to HGS are2.68% on five trained tasks versus POMO-MTL3.05%, and6.78% on five unseen tasks versus7.03%. The unseen set is **VRPBL, OVRPL, VRPBTW, OVRPLTW and OVRPBTW**. OVRPL worsens from4.57% to4.90%; the other four displayed unseen gaps improve. Routing runtimes are36seconds versus35seconds for POMO-MTL in this table, with several reference measurements imported from other papers (Table20).

**Ablations and compute.** The complete method wins22of24 displayed ablation datasets, with JSSP15x15 and30x20 exceptions. Unique-solution percentages and policy-winning counts support diversity empirically; they are not a guarantee that every latent variable yields a distinct useful policy. Figure3 averages ten runs; AppendixD reports three trials because policy sampling varies, without identifying these as independently trained seeds. Most main tables lack confidence intervals/significance tests. Hardware is a24-core i9-14900KS plus one RTX4090. Approximate training costs include JSSP4days, TSP12days and CVRP4days. Reported1.3-250times fewer epochs to reach baseline validation scores is not an equal-rollout or wall-clock training comparison. Asterisked times use other papers' hardware/settings (PDF6/9/18/30-31/44-47).

## Limitations

Fixed latent priors may miss good instance-specific regions, and larger populations increase training/inference cost. Self-teachers can remain suboptimal; no convergence, global optimality or guaranteed diversification theorem is established. The winner-weighted imitation loss is a practical surrogate, not presented with a proof that it is an unbiased gradient of Eq3's expected best-of-k cost. Dense stepwise likelihood feedback still depends on evaluating complete candidate objectives. Dynamic, communication-latency and multi-objective scheduling are future directions; the stochastic FJSP experiment should not be omitted when describing the mostly static scope (AppendixG).

### Curator Notes

The **publisher ZIP's SMSP implementation has a latent-cancellation boundary**. `SMTWTModel.py:104-120` computes hidden embeddings without z, broadcasts the same z to every job, and applies one affine scalar output layer. Thus logit_i=aᵀh_i+bᵀz+c, and the common bᵀz cancels in softmax. For a fixed state, this released decoder's action distribution is independent of z. A minimal check directly importing the original five-layer decoder gave identical probabilities for two valid latent vectors. Independent stochastic rollouts can still differ. This finding concerns this SMSP release, not the paper's general nonlinear-MLP design, the other backbones or an unrerun historical result table.

Eq4 requires a convention when all candidate costs are equal, because its printed weight becomes0/0. The released SMSP/PFSP/FFSP/UPMSP trainers add an epsilon to variance; JSSP `Train.py:125-132` does not, and an equal-makespan population gives NaN. The FFSP release uses a PolyNet residual latent adapter after attention, differing from the generic HELD concatenation diagram. UPMSP's released learning rate/weight decay and JSSP's default64samples differ from printed settings; the supplied JSSP checkpoint filename identifies256samples. These are implementation/configuration boundaries, not evidence that every published experiment failed.

The Table20 trained-task POMO-MTL average objective16.27 does not equal the arithmetic mean16.08 of its five printed task means; the gap means are separate instance-relative metrics. PDF42's prose names OVRPBLTW where Table20 actually lists OVRPLTW and OVRPBTW; the task inventory here follows the table. The JSSP30x30 ablation mention similarly differs from Figure13's30x20 label. These printed inconsistencies are recorded without silently reconstructing unprovided raw results.

## Reproducibility

- All48pages of the [formal NeurIPS2025 PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/2330c4be5e12c504705ba1db8a507966-Paper-Conference.pdf) were read, including86references, the checklist and complete AppendicesA-I. Twenty-eight rendered pages cover all fifteen figures, twenty-eight tables and central equations/Algorithm1. The publisher lists volume38, DOI10.52202/085713-0828 and publication April23,2026; PDF1 identifies four KAIST authors.
- The [official supplemental ZIP](https://proceedings.neurips.cc/paper_files/paper/2025/file/2330c4be5e12c504705ba1db8a507966-Supplemental-Conference.zip) was downloaded and recursively inventoried:32,418members/32,287files, no additional scientific PDF or nested scientific document. Its39Python files, six READMEs, datasets and five checkpoints cover SMSP/UPMSP/PFSP/JSSP, with FFSP source and external model/data links. It does **not** include FJSP, stochastic FJSP, TSP/CVRP or joint VRP source/checkpoints. The code entry therefore denotes this partial release.
- All six READMEs, the complete JSSP trainer and UPMSP training module, and central sampling/loss/latent-decoder sections of the released models were inspected. The root README documents Python3.10.13, PyTorch2.2.2, PyG2.5.2 and NumPy1.24.3. Both OpenReview notes APIs for`VPm6afl0Sc` returned403; all scientific appendices are integrated in the formal PDF. Archive hashes, member inventory and the bounded original-decoder arithmetic check are retained. No training or full benchmark was rerun.
- Twenty-seven catalogue relations have explicit body citations and matching full references, including year/preprint variants. Generic backbone applicability is kept separate from the demonstrated joint routing checkpoint and from the release's actual coverage.
