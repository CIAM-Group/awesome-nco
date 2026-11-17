---
id: pid-controlled-constrained-rl-for-hub-based-joint-pricing-dispatching-and-routing-with
short_title: PID-SACA
title: PID-Controlled Constrained RL for Hub-based Joint Pricing, Dispatching, and Routing with Service Guarantees
authors:
- Pengfei Du
- Yucen Gao
- Bin Wang
- Xiaochun Yang
year: 2026
date: '2026'
publication:
  date: '2026'
  source_url: https://ijcai.org/proceedings/2026/246
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2026/246
institutions:
- Northeastern University, China
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Hub-Based Joint Pricing, Dispatching and Routing
summary: A continuous pricing/allocation SAC controller uses attention-constructed bus routes and PID Lagrangian
  feedback for aggregate service targets; empirical trade-offs and violations qualify the claimed guarantees, while
  the public simulator and bounded controller differ materially from the printed analysis.
code_url: https://github.com/jerry0375/PID-SACA
figure:
  path: paper-assets/pid-controlled-constrained-rl-for-hub-based-joint-pricing-dispatching-and-routing-with/framework.png
  alt: A pricing/dispatch SAC policy interacts with neural route execution; observed order-response errors update
    a PID-controlled Lagrange multiplier.
  caption: 'Figure 2: Alternating SAC decisions, attention route execution and PID service feedback.'
  source_url: https://ijcai.org/proceedings/2026/0246.pdf#page=4
---

# PID-Controlled Constrained RL for Hub-based Joint Pricing, Dispatching, and Routing with Service Guarantees

> **TL;DR:** PID-SACA combines continuous destination pricing/seat allocation, constructive neural bus routing and PID-controlled service penalties. It is a **specialist/constructive** integrated solver. Aggregate service improves in the listed simulations, but some targets are missed and the printed theorem assumptions do not establish the advertised unconditional guarantee.

## Motivation

Hub-based transport couples prices, accepted demand, limited bus capacity and route duration/cost. Profit-oriented allocation can leave many potential requests unserved. The paper adds a minimum average Order Response Rate(ORR) and uses PID feedback to moderate oscillating Lagrangian penalties. A high network-wide ORR does not itself guarantee geographic, demographic or per-passenger fairness; that requires additional constraints or measurements. [Introduction.](https://ijcai.org/proceedings/2026/0246.pdf#page=1)

## Contributions

- A constrained online hub-service formulation jointly models destination prices, capacity allocation and route-execution feedback.
- An attention-based constructor supplies route costs/travel times to a continuous entropy-regularized actor–critic.
- PID feedback updates a log-parameterized service multiplier, with empirical comparisons, capacity/target sensitivity and controller ablations.
- A dual boundedness/service argument is presented, but its missing assumptions and clipping inconsistencies are material limitations rather than an established guarantee for arbitrary learned policies.

## Methodology

### Coupled control and route construction

The state includes potential regional demand, available buses and context. The policy emits one continuous price and allocation ratio per destination. Realized demand is an explicit price–distance conversion function, and nominal fulfilled requests are the minimum of demand and allocated idle-bus capacity. Bus routes start/return at the hub; route lengths determine operating costs and unavailability durations. ORR divides actually fulfilled requests by **potential** requests, rather than only converted demand. The service constraint averages slot ORRs, which is distinct from pooling all requests into a single demand-weighted rate. [Definitions/equations1–5.](https://ijcai.org/proceedings/2026/0246.pdf#page=3)

Given assigned destinations, an attention pointer decoder sequentially constructs visits. This supplies environment feedback for the upper policy; there is no learned complete-route rewrite or demonstrated shared checkpoint across native optimization tasks. The underlying routing is heuristic neural construction, despite prose calling its output an 'optimal trajectory'. The paper also calls the module differentiable, but the release loads a pretrained64-dimensional/eight-head/three-layer router and calls discrete route selection under`torch.no_grad()`. Integration through realized costs does not establish end-to-end differentiation through route actions. [Routing execution.](https://ijcai.org/proceedings/2026/0246.pdf#page=4)

The released dispatcher first greedily assigns closest pending orders to available buses up to capacity, then constructs a route over each bus's unique assigned destinations. Region-level action allocation and this vehicle-level order assignment are different decisions. Served requests are reconciled with actual assigned routes before ORR/reward calculation, and haversine distances provide geometry-based costs; this is not demonstrated road-network routing with all real traffic constraints.

### SAC and PID

The main surrogate reward is profit plus nu×ORR, with the constant target term omitted for fixed nu. The multiplier is nu=exp(x); the printed update accumulates e=delta−ORR, its running integral and a derivative difference, then increments x. Positive violation increases the service penalty, and negative violation can reduce it. A differentiable profit/service critic surrogate, policy-gradient updates and actual route-execution feedback should not be conflated.

The retrieved release uses a **leaky, clipped** integral I←clip(.5I+e,−.5,.5), clips the log increment to[−1,1], and additionally clips nu to an explicit maximum200,000. Those anti-windup/hard-cap operations differ from the printed unbounded integral. Controller feedback is applied to four-slot windows within an episode and again at episode end. Hard-cap boundedness is an implementation property, not experimental confirmation of the printed unclamped-multiplier theorem.

The actor/critic is also more specific than 'standard SAC'. Critic forward values contain a zero-valued differentiable analytic immediate-profit/ORR surrogate with gradient weight.98, while learned action-dependent critic gradients are scaled.02. The actor entropy term is multiplied by.02 and its optimizer learning rate is at least1e-3. These release-specific choices must be reconciled for a faithful reproduction of the stated algorithm.

### Scope of the theoretical claims

Theorem1 lists Slater existence of a feasible policy, bounded errors/rewards, nonnegative PID gains with positive integral gain, and clipped multiplier increments. Its proof then asserts sufficiently negative violation under an **optimal primal response** at large nu. That behavior is not a consequence of merely having some feasible policy and is not included with an approximation/error condition among the printed assumptions.

A counterexample to those assumptions alone is a one-state, two-action system with bounded zero rewards, ORR0 or1, target.7 and the behavior policy always choosing ORR0. The other policy supplies Slater margin.3, while e=.7 continually drives a positive clipped log increment with KP=KD=0, KI=1, eta=.1. From step15 onward the clipped increment is1, so nu grows without bound. The finite100-step calculation reaches log(nu)=93.35; the eventual constant positive increment establishes unbounded growth. This does not simulate the actual SAC policy or its hard-capped controller. It identifies the missing policy-response condition in the statement. [Theorem1/full proof.](https://ijcai.org/proceedings/2026/0246.pdf#page=5)

Theorem2 further treats a raw integral-driven increment as unbounded despite the clipping assumption, and infers global log-multiplier divergence from an infinite subsequence associated with positive limsup average violation. Those steps require additional justification. Consequently, the analysis is retained as the authors' proposed argument with explicit gaps, not a verified unconditional convergence/service theorem for this learned system. These theory qualifications do not refute the empirical outcomes.

## Experiments

### Data, released configuration and budgets

The paper describes7,065,937 Chengdu DiDi records from November1–30,2016, with DBSCAN denoising and PAM selecting30destination medoids. The release supplies station coordinates but no raw order records. Its actual environment samples Poisson demand with mean12 per destination and optional sinusoidal variation(default variation0), then applies the analytical price-conversion model. Thus available code is a station-based simulator, not an independently verified replay of all seven million observed requests. [Dataset/destination setup.](https://ijcai.org/proceedings/2026/0246.pdf#page=6)

The printed paper does not fully specify train/test day splits, independently trained seed count, all network/optimizer settings or total training runtime. Main curves span150episodes and controller ablation curves200; these are observed plotting protocols, not a complete hardware budget. Current code defaults to ten80-seat buses, speed30, distance-cost coefficient.15,24slots, gamma.99, batch256, replay100,000, hidden256 and critic learning rate3e-4. Its loop allows up to200episodes with minimum180 before convergence stopping; a separate Config.episodes=100 is not the actual loop bound. These are current defaults, not inferred paper hyperparameters.

### Trade-offs and negative results

At the main target.70, PID-SACA reports profit100.14, cost22.46, ORR.70 and distance150.50. ST-SACA and GRC-ELG have higher profits111.99/106.12 but lower ORRs.47/.44. PID-SACA therefore improves the measured service/profit trade-off rather than maximizing every metric or uniformly improving profit. The .70 versus SACA.54 ORR difference is16percentage points(about29.6% relative); it is not a30percentage-point gain. [Table1.](https://ijcai.org/proceedings/2026/0246.pdf#page=6)

Capacity40/60/80 gives PID-SACA ORR.39/.61/.70 and profit48.31/84.49/100.14. Higher relative coverage than baselines at low capacity does not mean satisfying a .70 target. The target sweep gives ORR.59/.59/.63/.70/.71/.81/.85 for targets.10/.25/.40/.55/.70/.80/.90. **The .90 target is missed**, so strict coverage claims across all resources/targets are not supported by these rows. Feasibility/Slater conditions are not independently established for each scenario. [Tables2/4.](https://ijcai.org/proceedings/2026/0246.pdf#page=7)

The controller ablation reports profit/ORR100.14/.70 with PID,90.18/.63 without PID and77.18/.56 without Lagrangian penalties. Multiplier standard deviation falls241.68→208.11. These are the displayed run statistics, with no independently confirmed seed-average confidence interval or proof of convergence. A single30-region heatmap illustrates one peak slot; it does not certify geographic fairness over the operating horizon. [Table3/Figures4–5.](https://ijcai.org/proceedings/2026/0246.pdf#page=7)

The public repository includes five standalone scientific curve PDFs and CSV logs. Their full one-page figures were read and visually checked as supplied artifacts. They are provenance for author-provided curves, not an independent reproduction or new evidence that the theoretical guarantees hold.

## Limitations

Average ORR is weaker than service to every region/request, and some displayed targets are violated. The price-conversion model, static station set, fleet geometry and synthesized demand limit operational conclusions. The current neural route construction does not certify optimality, and frozen discrete routing is not end-to-end differentiable execution. Core results compare service/profit trade-offs under incomplete reported training/test budgets.

The theorem statements require stronger primal-response and clipping/limit arguments. The current code's capped controller, modified critic gradients, simulated arrivals and version-specific schedules are material deviations to reconcile; availability of weights/plots does not show that the published tables run unchanged. No training, full checkpoint evaluation or table reproduction was performed during this review.

## Reproducibility

- Formal IJCAI2026 DOI10.24963/ijcai.2026/246, pages2208–2216, lists Pengfei Du, Yucen Gao, Bin Wang and Xiaochun Yang at Northeastern University, China; Gao/Yang correspond. The repository BibTeX orders the last two differently; formal byline controls. Publisher BibTeX month8 conflicts with publisher-deposited Crossref2026-09 while HTML gives year2026, so publication retains year precision. No unverified arXiv or acceptance date is supplied.
- All **nine official PDF pages** and **five one-page author-repository scientific plots** were fully read. The full public82-entry tree/only-main/no-tags-or-releases inventory contains those plots, code, logs, coordinates and router weights; no additional scientific appendix/proof document is named or found. Both printed theorem proofs were read in full.
- [Official code](https://github.com/jerry0375/PID-SACA), tree SHA`9e9817fe780c540126a315bfd97edd6cce9b9a7f`, was inspected in actual environment/route/controller/actor–critic and experiment paths. Its main branch was pushed2026-10-27, within the collection cutoff. The repository's LLM-use declaration describes assistive editing/implementation and author responsibility; it does not establish table reproduction, and no inference about research misconduct is made from code/theory discrepancies.
- `theorem-assumption-check.json` records the bounded-reward/Slater counterexample arithmetic with the interpreted clipped update; it is a statement-level assumption check, not a simulation of the released capped system or a claim that SAC never learns.
- Original complete Figure2 is cropped from formal PDFpage4, rectangle(52,48,560,261), at4× and visually checked. Main theory/table pages and all standalone curve PDFs were rendered/viewed, with manual source-page checkpoints.
- Five internal references are supported by explicit body/full-bibliography matches. The body calls GRC-ELG's route planner 'ELG' but cites Yoon2024; that bibliography entry is **ExpertDiff**, an unrelated diffusion/classification paper, so no ELG edge is forced. The actual EFormer six-author primary publisher identity was checked independently. Other uncataloged MoD/control references remain external.
