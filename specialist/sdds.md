---
id: sdds
short_title: SDDS
title: 'Scalable Discrete Diffusion Samplers: Combinatorial Optimization and Statistical
  Physics'
authors:
- Sebastian Sanokowski
- Wilhelm Berghammer
- Haoyu Wang
- Martin Ennemoser
- Sepp Hochreiter
- Sebastian Lehner
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/d87eadbe6114b768e76c5d5e8eb39388-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/d87eadbe6114b768e76c5d5e8eb39388-Abstract-Conference.html
institutions:
- Johannes Kepler University Linz
- Georgia Institute of Technology
- NXAI
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Statistical Physics
problems:
- Maximum Independent Set
- Maximum Clique
- Minimum Dominating Set
- Maximum Cut
- Ising Model
- Edwards-Anderson Spin Glass
summary: SDDS minibatches discrete diffusion steps using PPO or self-normalized importance-weighted
  forward KL; joint-path corrections give asymptotic target estimation under coverage
  and mixing conditions.
code_url: https://github.com/ml-jku/DIffUCO
---

# Scalable Discrete Diffusion Samplers: Combinatorial Optimization and Statistical Physics

> **TL;DR:** Train discrete diffusion samplers without retaining the full trajectory's autodifferentiation graph. Reverse-KL/PPO favors average optimization quality; forward-KL importance weighting can favor best-of-many solutions and corrected sampling. Models remain separately trained for each target problem/distribution.

## Motivation

Data-free neural probabilistic optimization has access to an energy function, but not samples from its Boltzmann distribution. DiffUCO minimizes a joint-path reverse-KL upper bound on the marginal KL; its original gradient computation limits diffusion length through activation memory. Scientific observables introduce another requirement: correcting the learned distribution's bias even though diffusion marginal likelihoods are intractable (Sections1-2).

## Contributions

SDDS introduces two training alternatives. Reverse-KL training becomes a finite-horizon policy-gradient problem optimized with PPO. Forward-KL training uses self-normalized importance sampling on complete diffusion paths and minibatches time steps. Both avoid keeping all steps' neural activations for one backward pass. The paper also lifts importance sampling and independence Metropolis-Hastings to the tractable joint-path space, then marginalizes to the desired endpoint observable.

This is a specialist sampling/constructive optimization framework. Each graph problem, dataset and Ising/spin-glass target has its own training run/checkpoint; the same training recipe is not evidence of a neural model shared across native problems. GNNs handle graph energies, while a U-Net handles the regular Ising lattice.

## Methodology

The target is proportional to exp(-energy/temperature). A fixed forward corruption kernel extends it to a distribution over complete paths. The reverse model has an evaluable joint likelihood, a uniform prior and time-conditioned product-Bernoulli reverse transitions, despite the endpoint marginal's intractability. For reverse KL, intermediate rewards contain forward-noise log-probability minus reverse log-probability, with terminal negative energy. A critic, normalized advantages and clipped PPO updates permit training from stored trajectory minibatches (Equation5; AppendicesA.2.5/A.3.6).

For forward KL, compute unnormalized joint-path target/proposal ratios, normalize them across sampled trajectories, and train a weighted negative log-probability over sampled time steps. The finite-sample self-normalized gradient is generally biased; its asymptotic justification requires adequate proposal support. Reusing a collected buffer while parameters change is a practical training procedure, not an exact new on-policy gradient after every inner update (Section3.1; AppendixA.2.6/Algorithm1).

At evaluation, the same path weights estimate endpoint expectations without evaluating marginal likelihoods. Their unnormalized average is an unbiased partition-function estimator under coverage; normalized observable ratios are generally only asymptotically unbiased, and taking a logarithm to estimate free energy introduces another nonlinear transformation. Joint-space independent Metropolis-Hastings instead accepts whole proposed paths using target/proposal ratios. Correct target invariance, coverage and adequate mixing are distinct from exact finite-time samples. AppendixA.3.3 proposes epsilon-clipping Bernoulli probabilities to guarantee positive support, but reports no empirical improvement from the tried clipping settings.

UCO anneals temperature toward zero and optionally applies conditional-expectation (CE) decoding at the final step. The graph GNN uses64 hidden units, normalization and a value head for PPO. The energy table uses A=1,B=1.1 penalties; its dominating-set energy contains a neighborhood product and is not literally quadratic in the displayed variables. No universal optimality or approximation ratio follows from the sampler (AppendicesA.3-A.5).

## Experiments

Seven graph datasets cover MIS/clique on RB graphs and cut/dominating set on Barabasi-Albert graphs. Small graphs have200-300 nodes, large graphs800-1200; each dataset has4000 training,500 validation and1000 test graphs. Three training seeds are used for the main uncertainty estimates. Models are evaluated with three times as many diffusion steps as training. The revised DiffUCO baseline also adds graph normalization, cosine scheduling and changed compute budgets, so its gains over previously reported DiffUCO are not solely SDDS effects (Section5.1; AppendicesA.6/A.7/A.10).

Tables1-2 report average quality over30 sampled solutions. Reverse-KL/PPO is significantly better in four datasets, insignificantly better in two, and slightly worse on large-graph MaxCut. For example MIS RB-large improves DiffUCO39.44→39.97, whereas MaxCut BA-large changes2974.60→2971.62. In best-of150 comparisons with CE, forward KL or PPO leads in six of seven cases; forward KL can have worse mean quality while producing better selected samples. CPU Gurobi rows include time-limited runs and use different hardware, so they are not uniform certified-optimum or like-for-like runtime comparisons. CE can add substantial runtime, e.g. PPO MIS RB-large0:03→6:35 in the table's total evaluation time (Tables1-3).

On the24x24 Ising model at critical temperature, models use300 diffusion steps and a U-Net; the matched autoregressive baseline requires576 sequential passes. With480,000 importance samples, forward KL estimates free energy per spin -2.11209±0.00008 versus theoretical -2.11215; its effective-sample fraction is0.0102±0.0024, far below ideal1. NMCMC uses400 iterations with1200 parallel states. Error bars for these corrected estimates are over three sampling runs, not three independently trained models. Diffusion improves the matched AR implementation; hardware differences prevent a universal comparison with all published AR results (Table4; AppendixA.7.3).

Additional16x16 Edwards-Anderson sampling has no exact free-energy reference. Forward KL gives the lowest estimated free energy, but the **lowest** ESS fraction:3.2e-6 versus5.22e-6 for DiffUCO and8.56e-6 for PPO. It therefore does not show uniformly better coverage/ESS. Separate10x10 ground-state experiments favor PPO. The memory ablation varies4/8/12/16 steps: fixed time minibatches permit smaller activation memory, at increasing sampling/training time. Its12-step PPO run beats16-step DiffUCO with about four times less stated memory. Measurements exclude JAX compilation. Hardware ranges from one to four40GB A100 GPUs (AppendicesA.8-A.10).

## Limitations

The learned endpoint distribution is approximate. Importance corrections can have severe weight degeneracy, and MCMC convergence cannot be established merely from a finite autocorrelation estimate. Neither correcting a distribution nor annealing temperature establishes globally optimal CO solutions. More diffusion steps and CE cost computation; minibatching neural activations does not remove the linear-sized trajectory buffers explicitly stored in Algorithms1-2. PPO clipping, advantage normalization, critics and temperature schedules add practical choices beyond the exact policy-gradient identity. Broader graph distributions, native-task transfer and difficult real-world constraints are not demonstrated.

### Curator Analysis

AppendixA.2.5's final line on PDF20 incorrectly writes the **total** derivative of E_q[log q] as zero. What vanishes is the expected partial score E_q[partial log q], not the total entropy derivative: a Bernoulli parameter p gives d/dp E[log q]=log(p/(1-p)). The intended score cancellation can justify the entropy reward treatment without that printed equality. On PDF23, Algorithm1 also places a gradient inside the scalar loss before a second gradient update, and the PPO text omits the minimization sign convention. The released implementation clarifies the intended weighted scalar log-loss and negative clipped actor loss. These are precise notation/pseudocode qualifications, not a claim that the overall policy-gradient approach or measured results fail.

## Reproducibility

- All30 pages of the [formal ICLR2025 PDF](https://proceedings.iclr.cc/paper_files/paper/2025/file/d87eadbe6114b768e76c5d5e8eb39388-Paper-Conference.pdf) were read, including every reference and scientific AppendicesA.1-A.12. Eight method/proof/table/figure pages were visually inspected. Publisher metadata gives May1,2025. Its author order places Haoyu Wang before Martin Ennemoser, whereas the PDF reverses those two and expands Wang's name; this note retains publisher metadata explicitly.
- The [publisher supplement](https://proceedings.iclr.cc/paper_files/paper/2025/file/d87eadbe6114b768e76c5d5e8eb39388-Supplemental-Conference.zip) has203 entries and contains code/configurations/pickles, with no separate scientific PDF or other document. Both READMEs and the experiment commands were checked; no scientific attachment was silently omitted. OpenReview v1/v2 notes requests for `peNgxpbdxB` returned403. The official1039-file tree contains no PDF/ZIP science attachment.
- The [official JAX repository](https://github.com/ml-jku/DIffUCO) was inspected at `39d3e25861174045d6fe34d568a0b6a1b8de66be`. Its complete191-line root README and82-line corrected-sampling entry were read, together with forward trainer125-245 and PPO loss529-569. The code uses a scalar weighted negative log-likelihood with one autodifferentiation, and a negative minimum clipped PPO surrogate. The README supplies task/dataset/seed-specific checkpoint IDs and flags for time minibatches; it also states that TSP experiments did not enter this paper. Repository capability alone is not added to the paper's benchmark list. No training or benchmark was rerun. Eleven exact existing-paper references are recorded.
