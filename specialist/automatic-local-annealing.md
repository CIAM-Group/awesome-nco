---
id: automatic-local-annealing
short_title: Automatic Local Annealing
title: Automatic Local Annealing
authors:
- Jared Leinbach
year: 1988
date: '1988'
publication:
  date: '1988'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1988/hash/42a0e188f5033bc65bf8d78622277c4e-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1988/hash/42a0e188f5033bc65bf8d78622277c4e-Abstract.html
institutions:
- Carnegie Mellon University
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Constraint Satisfaction
problems:
- Neural Constraint Optimization
summary: A local constraint-goodness score controls whether each continuous unit updates or resets to rest, replacing
  a global annealing schedule; evidence is from two hand-designed networks, without a convergence proof.
---

# Automatic Local Annealing

> **TL;DR:** Each unit chooses between an ordinary continuous activation update and a reset to its resting value using a locally computed temperature. The method removes a global time schedule, while retaining a hand-chosen update-probability function and freezing threshold.

## Motivation

Constraint-satisfaction networks can become trapped in poor local maxima of an agreement objective. A single externally scheduled temperature can disturb already satisfactory regions and stop processing in unresolved regions. Automatic Local Annealing (ALA) lets each unit respond to how well its own weighted constraints are currently satisfied (PDF pp. 1-2).

## Contributions

- Defines a unit-level temperature from local constraint goodness and precomputed attainable goodness extremes.
- Uses that temperature to select an ordinary update or reset to resting activation, without a common cooling schedule.
- Compares the same ALA configuration on two hand-designed networks with several scheduled Boltzmann-machine annealing configurations.

## Methodology

The network has bidirectional positive/negative constraint weights and continuous bounded activations. A unit's net input sums neighbors' deviations from rest, weighted by their connections. Its goodness is its own deviation from rest multiplied by that net input. Normalizing goodness by the unit's positive/negative attainable extremes gives a signed temperature between -1 and 1: locally satisfactory units are colder. These extremes depend on fixed weights and activation bounds and can be computed before simulation (PDF p. 3).

All units begin at random activations and update synchronously. On each cycle, a unit either makes a normal activation change or resets exactly to rest. The probability of the normal update increases as temperature decreases. The experimental activation range is [0,1], rest is 0.5 and the normal-update step factor is 0.6. The chosen probability curve makes units colder than -0.79 update normally with probability one, creating freezing/satisficing behavior. Removing a cooling schedule does not remove this manually chosen response curve or its threshold (PDF pp. 2-4).

Weights specify the optimization instance; the reported algorithm changes activations, not learned policy parameters. The discussion proposes possible weight-learning rules as future research, without evaluating them (PDF pp. 7-8).

## Experiments

Two small constructed constraint networks are tested. The difficult network has near-global local maxima that differ only slightly in objective from its two best states. The easier Necker-cube network has many local maxima farther from its best states. Their structures and relevant best/local states are described in Figure 1; they are not random large-scale combinatorial benchmark suites (PDF pp. 3, 5).

Each curve in Figure 2 uses 100 trials and plots the percentage that have reached a stable global maximum against synchronous processing cycles. Stable means remaining in that state for the rest of that finite trial. The comparator uses the best-performing three-leg Boltzmann annealing schedules found at several lengths, rather than one universally fixed schedule. ALA uses the same parameter setting on both networks. The plotted ALA curves reach high stable-success frequencies earlier than comparably reliable displayed schedules, while short comparator schedules trade reliability for earlier completion (PDF pp. 4, 6).

The evidence concerns cycles and success rates on these two networks. It is not a measured wall-clock speedup, a certified approximation ratio or a demonstration of optimal solutions on arbitrary instances. No uncertainty intervals, modern train/test split or large-scale runtime study is supplied.

## Limitations

The author explicitly says that a mathematical account of the proposed relation between state quality and visitation frequency has not been developed. The accompanying informal infinite-time discussion therefore should not be promoted to a proved stationary distribution or global-convergence theorem (PDF p. 7).

Freezing deliberately permits completely stable states without perfect satisfaction of every constraint. Its time/quality trade-off depends on the response function and freezing threshold. The paper's biological plausibility and possible learning benefits are arguments and future directions, not separately measured results.

**Curator interpretation:** this is a specialist neurodynamic constraint-optimization method with hand-designed instance weights. Reusing its update rule for two networks is not evidence of a jointly trained generalist checkpoint. A precise modern reproduction would require the full plotted update-probability function, graph weights, initialization and stopping conventions; the curve is given graphically rather than as a complete parameterized formula.

## Reproducibility

- **Read source:** all eight official scanned PDF pages, printed pages 602-609, including all three bibliography entries. Local-temperature/activation formulas, the probability curve, test-network descriptions and both 100-trial performance plots were visually checked.
- **Publication:** official NIPS 1988 volume 1 proceedings record; author Jared Leinbach, Carnegie-Mellon University Department of Psychology. No inferred acceptance date is added.
- **Supplements:** the official landing lists bibliography, metadata and the paper only. The complete article has no appendix or reference to separate scientific materials; no additional scientific attachment was identified.
- **Code/results:** no simulator repository or machine-readable trial data is linked in the article. No simulator or experiment was rerun during this review.
- **Citation graph:** all references were checked; none identify another paper in the frozen collection, so no outgoing internal relation is added.
