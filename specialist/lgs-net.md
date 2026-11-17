---
id: lgs-net
short_title: LGS-Net
title: Latent Guided Sampling for Combinatorial Optimization
authors:
- Sobihan Surendran
- Adeline Fermanian
- Sylvain Le Corff
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/surendran26a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/surendran26a.html
institutions:
- Sorbonne Universite
- Universite Paris Cite
- CNRS
- Califrais
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Routing
- Packing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- 0-1 Knapsack Problem
summary: LGS-Net learns an instance-conditioned latent distribution and masked decoder,
  then combines population search with decoder adaptation; conditional sampling theory
  and the released annealed greedy implementation have distinct scopes.
code_url: https://github.com/SobihanSurendran/LGS
---

# Latent Guided Sampling for Combinatorial Optimization

> **TL;DR:** Learn an instance-conditioned latent search space with reinforcement learning, then alternate population-based latent exploration and lightweight decoder adaptation. TSP/CVRP experiments show strong quality at specified budgets, with a small additional knapsack study. The analyzed sampling kernel and the public default implementation differ substantially.

## Motivation

Neural constructive solvers need an effective inference strategy as well as a trained policy. Fixed latent priors can ignore the geometry of the current instance, while supervised latent models require high-quality solution labels. LGS-Net instead learns a conditional latent distribution from costs and uses inference-time search/adaptation to explore it, with particular attention to the cost of full gradient-based latent optimization (Sections1-3).

## Contributions

A neural encoder maps the instance to Gaussian latent parameters; a masked autoregressive decoder conditions on that latent variable and the current solution state. The paper proposes cost-weighted, entropy-regularized RL training and Latent Guided Sampling, combining interacting MCMC-style proposals with stochastic-approximation updates of decoder parameters. It presents fixed-parameter sampling and adaptive-kernel tracking analyses, plus routing comparisons, ablations, CVRP200 and an additional0/1-knapsack experiment (Sections4-6; AppendicesA-F).

The classification remains specialist/constructive-improvement. TSP and CVRP have separate models/checkpoints, and inference further adapts decoder parameters. Knapsack changes features/decoder state and is presented as an adapted model, with no evidence that the same routing checkpoint solves it. CVRP with time windows and job-shop scheduling are outlines for future adaptation, not additional tested shared-checkpoint tasks (AppendixA.3/F.2.4; official task directories).

## Methodology

The encoder has six attention layers, eight heads and128-dimensional node embeddings. Feed-forward heads produce latent means/log variances; Gaussian reparameterization supplies z. The single attention decoder uses z, previous-node information and a task-specific context, masking visited nodes and infeasible capacity moves. Main training uses100-node instances,100 latent samples, entropy coefficient .01 and a cost-weighted multi-sample objective. The printed optimizer settings are Adam5e-4, batch128 and8,000epochs; current launch defaults differ as described below (Section4; AppendixA/F.1).

For the **analyzed** inference procedure, the joint target is proportional to p_phi(z|x)*p_theta(y|x,z)*exp(-lambda*C(y,x)). A symmetric proposal moves in latent space, a stochastic decoder proposes a feasible solution, and a joint MH accept/reject step targets that distribution. Holding theta fixed gives the standard detailed-balance construction in PropositionC.1. The proof of geometric mixing uses compact latent support, bounded cost and uniform lower bounds for proposal/prior/feasible decoding probabilities; mere pointwise positivity does not alone establish those uniform bounds. Finite lambda targets a reweighted distribution, not only globally optimal solutions (PDF5-6/22-24).

Adaptive-theta analysis additionally assumes bounded score/target regularity and L2 convergence of parameters to theta_infinity at a specified rate, with step/window conditions controlling tracking error. It is not a proof that arbitrary Adam adaptation converges globally or that a finite inference budget finds an optimum. A gradient-norm bound for biased stochastic approximation does not, by itself, establish convergence of the entire parameter sequence to a fixed limit. Kernel-product tracking also needs care when parameters depend on the chain's own history (Theorem5.3; AppendixD).

## Experiments

**Protocols.** Main routing tests contain1,000 instances per size, with coordinates uniform in the unit square. Models train at100nodes and test at100/125/150, with an additional CVRP200 comparison. CVRP capacities are50/55/60 at100/125/150. Reported times are totals over all1,000 instances on one RTX6000 GPU, not per-instance latency. The paper uses600 latent particles without augmentation and300 with augmentation, adjusting batch sizes. The inference budgets are based on a DE reference run; greedy, CVAE-Opt and classical rows do not all use the same elapsed time. Neural inference/adaptation costs are separate from pretraining and extra ablation training (Section6; AppendixF).

**Routing quality.** Without augmentation, TSP100/125/150 gaps to Concorde are .002%/.012%/.081% at20/30/40minutes. With augmentation they are .000%/.001%/.027% at40/60/90minutes. Thus the tables support near-optimal means, not literal optimality at every size or on every instance. Without augmentation, CVRP100/125/150 gaps are-.102%/-.022%/.343% at40/60/90minutes. Negative CVRP gaps mean improvement over the LKH3 **heuristic reference**, not improvement over a certified optimum (Tables1/4-5).

The augmented CVRP150 case favors EAS:19.212(-.041%) versus LGS19.229(+.046%) at3hours20minutes. HGS obtains better CVRP objectives at all three sizes, with longer recorded times. The additional CVRP200 result is22.284(1.289%) in2hours10minutes, compared with EAS22.361/COMPASS22.455 at that budget and LKH3 reference22.00. The main prose's broad all-settings dominance is therefore narrowed to the actual displayed cases (Tables5/11).

**Ablations.** CVRP100 inference comparison gives direct sampling15.652, independent parallel MCMC15.557, interacting MCMC15.535 and LGS15.524. Interacting MCMC already has a negative LKH-reference gap(-.032%), so LGS is not the only negative-gap row. Cost-weighted training15.524 improves POPPY-loss15.527 slightly. Instance-independent latent15.641 and COMPASS+LGS15.579 are worse than the full conditional model; this does not prove that the inference routine improves every pretrained policy. Deterministic-latent variants also perform worse. Figure2 averages ten runs; uncertainty for every other table is not inferred from that statement (Tables2/6-9).

A diffusion-prior variant improves CVRP150 to19.278(.302%), but requires100,000 DE-optimized latent targets(500DEsteps each) and an extra200-epoch training stage. It is distinct from the main encoder's training without solution labels. Latent dimension100 is best among2/50/100/150 in the displayed study; larger particle count has diminishing gains, radius affects quality, and the manually chosen increasing update schedule[1,1,5,15,25,100,150] outperforms the tested fixed schedules (Table10/12; Figures6-8).

**Knapsack.** AppendixF.2.4 tests1,000 instances each at50/100items with independent uniform[0,1] weights/values and capacities12.5/25. LGS gives mean objectives20.018/40.512, matching the printed OR-Tools/dynamic-programming means to three decimals; sampling gives20.012/40.501. Rounded mean equality is not a per-instance certificate. The printed termination instruction refers to exactly zero remaining capacity, so reproduction also needs a stop rule when no remaining item fits. The public repository does not supply this task's implementation/model (Table13).

## Limitations

Autoregressive decoding, particle count and inference-time learning incur substantial work. Tested scale is limited to at most200nodes in CVRP, and global/history-dependent constraints can require more than local masks. Native-task retraining/adaptation remains necessary. The theoretical target, finite-budget optimizer behavior and best-found-solution quality are separate objects. The following qualifications retain empirical observations while identifying limits of literal proofs and release reproducibility.

### Curator Analysis

**Interacting-kernel extension.** AppendixC.3 infers product-target reversibility from reversible component kernels despite simultaneous dependence on the old population. That implication is not generally valid. Take two uniform particles on[0,1], split into equal halvesA/B, constant cost and one feasible solution. For each coordinate, propose a half switch with probability .2 when the other particle is inA, or .8 when it is inB; choose uniformly inside the resulting half. Each fixed-other proposal is positive, symmetric and preserves uniform. Parallel updates nevertheless send product-uniform probabilityP(A,A)=.25 to .34, so the product target is not invariant. This counterexample limits the printed general extension argument; it does not deny the valid single-chain joint-MH balance calculation or directly rebenchmark the specific solver (PDF25/33).

**Algorithm and normalization details.** Algorithms1/3 explicitly mention rejecting z, whereas PropositionC.1's kernel correctly rejects the joint(z,y). The latter is needed for the stated target. AppendixA.4's importance-sampling interpretation needs the target normalizer and sample averaging; raw exp(-C/tau) weights are not equal to normalized importance ratios. For equiprobable costs1/2 and tau1, the unnormalized weighted-cost expectation is .319275, while the normalized target expectation is1.268941. This qualifies that interpretation rather than replacing the stated raw-weight objective with an author-unclaimed corrected objective (PDF18/22).

**Current public implementation versus analyzed kernel.** Inspected default code uses greedy decoding, a random donor as the proposal base, crossover and coordinatewise clipping to[-40,40], rather than current-particle Gaussian steps on the stated radius40ball. Its Gaussian noise has standard deviation .01, whereas the text calls .01 the variance. Acceptance uses temperature1e-4*.9^iteration; CVRP tempers the prior log ratio by1e-5 and TSP omits it. No proposal-density Hastings correction appears. On the interior one-dimensional population[0,1], the released random-base proposal has densities9.973557 at0 and4.986779 at .379, so its forward/reverse off-diagonal densities differ. Conditional symmetry of the different printed current-base proposal cannot justify that release rule.

Each released MCMC phase initializes population costs to100; the accepted population is not assigned back to `model.z` because that line is commented. The next SA phase draws fresh greedy trajectories at the last proposed latents, using an unweighted centered-cost loss. Training uses normalized detached weights of standardized advantages, a temperature nearly1(`exp(-.0005/epoch)`), and a selected-action entropy proxy, with opposite proxy signs in TSP/CVRP. TSP training defaults to2,000epochs/batch100 and both task launchers use1e-5 learning rate, differing from the common printed settings. These observed differences prevent automatically transferring the sampling proof to the shipped default. They do not establish which historical configuration generated the paper's tables, and no neural benchmark was rerun.

## Reproducibility

- All40 pages of the [formal ICML2026 PDF](https://raw.githubusercontent.com/mlresearch/v306/main/assets/surendran26a/surendran26a.pdf) were read, including every reference and scientific AppendicesA-F. Twenty key pages were visually checked, covering all eight figures, principal experimental tables and critical proofs. PMLR306 verifies September29,2026, pages117626-117665 and three authors; affiliations include Sorbonne/Universite Paris Cite/CNRS and Califrais' LOPF.
- The publisher links the integrated PDF, OpenReview and code without a separate scientific supplement. Both OpenReview notes APIs for `k5xsXvNYQS` returned403. The27-file official tree contains no PDF/ZIP scientific attachment. No explicitly missing scientific document was found.
- The [official repository](https://github.com/SobihanSurendran/LGS) was inspected at `ef75b5a900725b5e407c7d1d15cee87bc04a0183`. It contains two task-specific pretrained checkpoints and six test datasets, not eight model checkpoints. README/requirements, both task train/test launchers and full test scripts were read, together with complete CVRP training, TSP training loss and relevant CVRP encoder/decoder paths. Enter a task subdirectory before running the README commands. Knapsack, diffusion-prior and full comparator implementations are absent from this small release.
- `research/full-text-review/lgs-net/recompute_scope.py` verifies the four-state aggregation of the continuous-half counterexample, the released proposal's interior density asymmetry and normalization arithmetic. These are small arithmetic checks, not neural performance tests. Thirty-four current-catalogue citations have explicit body/table and full bibliographic identity evidence.
