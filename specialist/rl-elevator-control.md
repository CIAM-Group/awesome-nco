---
id: rl-elevator-control
short_title: RL Elevator Control
title: Improving Elevator Performance Using Reinforcement Learning
authors:
- Robert H. Crites
- Andrew G. Barto
year: 1995
date: '1995'
publication:
  date: '1995'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/390e982518a50e280d8e2b535462ec1f-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1995/hash/390e982518a50e280d8e2b535462ec1f-Abstract.html
institutions:
- University of Massachusetts Amherst
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Resource Allocation
problems:
- Elevator Dispatching
summary: Shared or decentralized neural event-driven Q-learning improves simulated elevator stop/continue control;
  hand rules, four-day training and metric-specific counterexamples qualify the reported generalization.
---

# Improving Elevator Performance Using Reinforcement Learning

> **TL;DR:** Shared or decentralized feedforward Q-networks learn stop/continue decisions for four elevator cars in a simulated building. They improve several service metrics under the tested traffic profiles, with substantial offline training and a tail-wait counterexample to universal superiority.

## Motivation

Elevator dispatching has continuous time, partial observation, changing passenger arrivals and interacting cars. Exhaustive dynamic programming is impractical. The paper learns car decisions from simulation using a common system-wide waiting cost (PDF pp. 1-3).

## Contributions

- Uses event-driven neural Q-learning with elapsed-time-dependent discounting.
- Compares a shared network across cars (RLp) with a separate network per car (RLd).
- Tests learned control against eight contemporary dispatching heuristics and two added-up-traffic conditions.

## Methodology

The simulator has ten floors, four 20-passenger cars and a varying down-peak Poisson profile. Interfloor demand is also modeled. Passenger expectations constrain passing and turning; added rules prevent unnecessary stops, duplicate pickups and prefer moving upward when direction is free. Consequently, the learned choices are essentially **stop versus continue**, not unconstrained assignment of all passenger requests (PDF pp. 2-3).

Each agent estimates discounted cost-to-go and uses a minimum-Q bootstrap with discount `exp(-beta*elapsed_time)`. Boltzmann action selection cools during training. RLp shares weights; RLd permits different weights, but neither observes other agents' actions explicitly. Inputs do include other cars' position/direction footprints. The selected network has 47 inputs including a bias, 20 sigmoid hidden units and two linear outputs; beta is 0.01 and reported learning rates are 0.01 or 0.001 (PDF pp. 3-5).

Costs may use simulator-known waits or online estimates based on elapsed button times and estimated Poisson rates. Section 3 integrates discounted instantaneous waiting penalties. This return should not be assumed algebraically identical to the evaluation table's empirical SquaredWait statistic; the paper states squared waiting as its motivating objective, while reporting several service measures (PDF pp. 3-4).

## Experiments

Each RL controller experiences 60,000 simulated hours, taking four days on a 100-MIPS workstation. Evaluation averages cover 30 simulated hours. In down-only traffic, RLd reports average wait 14.7 seconds, squared wait 313, system time 41.7 seconds and 0.07% waiting above 60 seconds; RLp is similar. ESA, the stronger information-privileged comparator, knows queue lengths unavailable in the real system (PDF pp. 5-7).

Added-up-traffic tests reuse down-only training but also **force upward-moving cars to stop for upward hall calls**. With two lobby up-passengers/minute, RLd improves average wait and system time over FIM (16.9 vs 17.9 seconds; 42.7 vs 48.9 seconds), but has a worse above-60-second fraction: 1.40% vs 0.50%. At four up-passengers/minute, RLp/RLd trade off mean wait, squared wait, system time and tail fraction. Therefore the tables do not support winning every metric in every condition (PDF p. 6).

## Limitations

The optimal policy is unknown and no global guarantee is established for neural multi-agent learning. Evaluation covers one simulated building and related traffic profiles, without confidence intervals or operational deployment evidence. The upward-call rule, hand-designed action restrictions, feature choices and large training budget matter. This is a specialist dispatching decision component; changed demand within the same task is not cross-problem generalism.

## Reproducibility

- **Read source:** all seven official scanned pages, printed pages 1017-1023, including all eight references. Missing text-layer equations, all four tables and traffic specifications were visually checked.
- **Publication:** NIPS 1995 volume 8; full byline names Robert H. Crites and Andrew G. Barto, University of Massachusetts Amherst.
- **Supplements:** the official entry links bibliography, metadata and the article. No separate appendix or scientific attachment is identified; cited simulator reports are not claimed as read supplements.
- **Implementation:** no public source, trained weights or complete reproducible experiment configuration is linked. Simulations were not rerun.
- **Relations:** no bibliography entry identifies another frozen collection paper, so no internal citation edge is added.
