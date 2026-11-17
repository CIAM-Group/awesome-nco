---
id: learning-to-optimize-job-shop-scheduling-under-structural-uncertainty
short_title: UP-AAC
title: Learning to Optimize Job Shop Scheduling Under Structural Uncertainty
authors:
- Rui Zhang
- Jianwei Niu
- Xuefeng Liu
- Shaojie Tang
- Jing Yuan
year: 2026
date: '2026-01-29'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/40973
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/40973
institutions:
- Beihang University
- Hangzhou Innovation Institute of Beihang University
- Zhongguancun Laboratory
- University at Buffalo
- University of North Texas
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Job Shop Scheduling with Structural Uncertainty
summary: A hindsight-conditioned critic stabilizes training of an online dispatching actor, while sampled-scenario
  risk attention informs uncertain-route scheduling; twelve size/uncertainty configurations use separately trained
  specialist models.
arxiv_url: https://arxiv.org/abs/2601.21389
figure:
  path: paper-assets/learning-to-optimize-job-shop-scheduling-under-structural-uncertainty/framework.png
  alt: UP-AAC scenario-risk attention above stochastic actor and hindsight-reconstructed critic.
  caption: 'Original Figure 2: UP-AAC uses sampled-scenario context for the actor and hindsight information only
    for critic training.'
  source_url: https://arxiv.org/pdf/2601.21389v1#page=3
---

# Learning to Optimize Job Shop Scheduling Under Structural Uncertainty

> **TL;DR:** UP-AAC schedules jobs whose routes branch randomly. Its actor observes the current uncertain state, while training uses a critic conditioned on the route realized after the episode. Scenario attention supplies an additional risk embedding. Reported makespans improve over the tested dispatching rules and ordinary actor–critic baseline, with separate models for twelve configurations.

## Motivation

Unlike uncertain processing times, structural uncertainty changes which operations will exist along a job's realized route. The same dispatch action may precede an easy or difficult exogenous route, creating noisy return estimates. UP-AAC targets this source of training noise without giving the deployed actor the actual future route. Its manufacturing examples motivate the formulation; the evaluation uses generated instances rather than an industrial production deployment. [pp. 1–2]

## Contributions

- Models each job's possible processing routes as a probabilistic DAG, with route outcomes selected by the environment rather than the scheduling policy.
- Trains an asymmetric actor–critic through hindsight reconstruction: replay the collected actions on the realized deterministic routes to obtain critic states and rewards.
- Adds an Uncertainty Perception Model (UPM), combining sampled deterministic scenarios with a scheduling lower-bound prior and attention over learnable inducing points.
- Evaluates average makespan, worst-tail makespan and component ablations. The paper does not prove a universal variance reduction or convergence theorem. [pp. 2–7]

## Methodology

At each scheduling event, the actor chooses an eligible operation for dispatch. The state is a disjunctive graph of unfinished operations, with precedence and machine-conflict edges; realized routing branches remove alternatives and completed operations leave the active graph. Dense rewards are written as C_LB(s_t) − C_LB(s_{t+1}). The stated equivalence between cumulative reward and makespan minimization requires the terminal lower bound to equal the absolute final makespan. [pp. 3–4, Eq. 2]

During training the actor first collects trajectories in the stochastic environment. Once the full realized routes are known, the same action sequences are replayed on deterministic hindsight instances. The critic consumes those hindsight states, whereas the actor still consumes its original stochastic states. Equation 3 uses the hindsight critic in a one-step advantage, r_t + gamma V(s_det,t+1) − V(s_det,t). This fixes the exogenous route for critic conditioning; it does not give the online actor privileged future information. Figure 2 labels the update PPO, while Algorithm 1 describes the collection, reconstruction and asymmetric updates at a high level. [pp. 3–5]

UPM samples deterministic scenarios and encodes them with a shared GNN. A scenario's heuristic prior is max(maximum job length, maximum machine workload). Attention scores add a learnable scalar times that prior to the query–key score. Learnable inducing points aggregate scenario features into a static instance-level vector, which is concatenated with the actor's dynamic state features. The sampled scenarios summarize the route distribution rather than identify the route that will actually occur. [p. 5, Eqs. 4–5]

**Classification: Specialist / constructive.** Section 5.1 explicitly trains a separate model for each of twelve size/uncertainty configurations of this scheduling problem. Varying configuration sizes does not establish a shared checkpoint across native problem types. The learned action dispatches an operation during schedule construction, rather than revising a completed incumbent. [pp. 3, 6]

## Experiments

The twelve generated configurations combine 5/10/15/20 jobs with 10/15/20 machines. Uncertainty is coupled to machine count: respectively one, two or three branching operations per job. Each configuration contains 50 distinct test instances, and each instance is evaluated under 50 independent random seeds. CVaR is the average of the worst 20% of makespan outcomes. Seven priority rules and a conventional actor–critic using the same GNN form the policy baselines. [pp. 5–6]

Models use a three-layer GCN of width 72, three-layer actor/critic MLPs, LayerNorm and LeakyReLU, and one NVIDIA V100. UPM uses 100 sampled scenarios per instance during training. The article does not supply the full training episode count, learning-rate schedule, update budget, inference latency or a training-seed confidence analysis. [p. 6]

Tables 1–2 report better average makespan and CVaR than the tested PDRs and standard actor–critic on all twelve configurations. For example, on (10 jobs, 20 machines, 3 branches), UP-AAC obtains average 1,334.83 and CVaR 1,457.83, versus ordinary AC's 1,445.08 and 1,516.43. On (20,20,3), the averages are 1,884.30 and 1,922.53 respectively. Small/medium gaps use CP/OR-Tools optima as references; large-instance gaps use the best solution found among tested methods, which is not a certified optimum. [pp. 5–7]

Table 3 removes AAC or UPM on the six small/medium configurations. The full method improves on both ablations. At (10,20,3), removing UPM gives average 1,369.99 and CVaR 1,508.02. Keeping UPM but replacing AAC gives 1,434.63 and 1,515.75, illustrating that adding scenario context alone does not guarantee an improvement over ordinary AC. [p. 7]

**Curator arithmetic:** The prose reports a 1.94% average small/medium gap, but the six displayed Table 1 gap entries are 1.86%, 1.20%, 1.08%, 3.31%, 2.77% and 2.37%, whose unweighted mean is approximately 2.10%. The aggregation behind 1.94% is not explained sufficiently to reconcile these numbers. This is a check of printed summaries, not a new scheduling benchmark. [pp. 6–7]

## Limitations

Separate specialist models and generated Taillard-style instances limit claims of cross-task or industrial generalization. Problem scale and branching uncertainty increase together, so their effects are not isolated. The small-instance CP reference and large-instance best-found reference have different strength; a small large-instance gap cannot be interpreted as the same near-optimality guarantee as a small certified gap. The handling of future route information in the CP reference and its time budget are not detailed. [pp. 5–7]

Hindsight resolves route uncertainty for the critic, while future policy actions can remain stochastic. The claimed stability and reduced credit-assignment noise are methodological motivations supported by the reported comparisons, rather than a proved variance ordering for arbitrary critics or policies. The paper's reward telescoping argument also requires undiscounted summation and an absolute completion-time bound. Because its graph description removes completed operations and calls the bound a critical path over remaining operations, an implementation must retain appropriate elapsed/completion-time information to make C_LB(s_T)=C_max. The article does not spell out that accounting; a literal remaining-work-only bound would end at zero. This qualification concerns the printed definition, not a demonstrated failure of an unavailable implementation. [pp. 3–5]

## Reproducibility

The formal article appears in AAAI 2026, volume 40(43), pp. 36509–36517, DOI 10.1609/aaai.v40i43.40973; publisher-deposited metadata gives 2026-03-14. The independently identified arXiv v1 was submitted on 2026-01-29. Its complete nine pages, including acknowledgments and all references, were read. Publisher page/PDF requests returned an access challenge, so the accepted arXiv fallback supplies the scientific text. Full authors and affiliations agree with the primary publisher's indexed byline.

The complete article does not point to an appendix, scientific supplement, source repository or checkpoint. The publisher's indexed Downloads lists only the paper PDF; arXiv lists no author code pointer. Exact-title and UP-AAC code/supplement searches did not identify an author-linked implementation. This is a bounded availability check, not a claim that no private or later code exists. No code execution or solver performance reproduction was possible. Figures 2–3, the reward/advantage definitions, Algorithm 1 and all three result tables were crosschecked against rendered pages; the original Figure 2 was retained as the framework image. Source hashes, primary HTML, metadata and the printed-gap arithmetic are stored with the review.
