---
id: comparison-rescheduling
short_title: Comparison Rescheduling
title: Comparison Training for a Rescheduling Problem in Neural Networks
authors:
- Didier Keymeulen
- Martine de Gerlache
year: 1993
date: '1993'
publication:
  date: '1993'
  source_url: https://proceedings.neurips.cc/paper_files/paper/1993/hash/aeb3135b436aa55373822c010763dd54-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/1993/hash/aeb3135b436aa55373822c010763dd54-Abstract.html
institutions:
- Vrije Universiteit Brussel
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Aircrew Rescheduling
summary: A shared-weight dual comparator learns expert substitute-pilot choices from externally generated feasible
  candidates; Sabena training curves support the comparison method, without a quantified held-out scheduling benchmark.
---

# Comparison Training for a Rescheduling Problem in Neural Networks

> **TL;DR:** A dual neural comparator learns which legally eligible substitute pilot an expert prefers. Evidence comes from Sabena observations and training-error plots; the network neither generates the feasible candidate set nor optimizes a complete crew schedule.

## Motivation

When a pilot becomes unavailable, a rescheduling team must choose a replacement while preserving schedule stability and equitable workload/pay. An external scheduling system supplies potential substitute pilots satisfying legislation and safety rules. Experts can identify a preferred candidate more easily than assign numerical utilities or rank every alternative. The learning problem therefore uses best-choice labels rather than complete scores or rankings (PDF pp. 1-4).

## Contributions

- Formulates substitute-pilot choice as learning an expert comparison function.
- Explains a dual/siamese-style architecture for differentiating comparisons between nonlinear profile evaluations.
- Shows training curves for the Sabena application and a manually increased comparison-scale factor.

## Methodology

Fifteen rated input parameters encode candidate occupation before/after the disruption, additional human-related information and shared schedule context. A single nonlinear network C evaluates each profile; the preferred candidate should have the lowest value among candidates for the same disrupted schedule. These values need not reproduce absolute expert utilities (PDF pp. 3-4,6).

Training uses two identical, shared-weight copies. Their outputs feed a sigmoid comparison through positive and negative weights. A best/non-best pair has target 0 in one order and 1 when swapped. The article explains why applying a nonlinear network to an input difference is generally not equivalent to subtracting its separate outputs. During recall, evaluate all candidates with one copy and take the smallest output (PDF pp. 4-7).

The proposed acceleration manually increases the comparison scale V, amplifying updates for unlearned comparisons relative to already learned ones. Learning V itself by the generalized delta rule is reported to have no significant convergence benefit. The manual schedule remains a training choice rather than an automatically obtained guarantee (PDF p. 6).

## Experiments

The data were collected by observing Sabena's crew-rescheduling team for 15 days, retaining disrupted schedules for training and testing. Figure 3 plots mean training comparison error and illustrates faster convergence with increasing V. Successful learning is defined by the preferred candidate having the smallest comparison value for every training schedule (PDF pp. 6-7).

The paper does not report numerical held-out selection accuracy, train/test sample counts, split details, inference time, realized cost savings or whole-schedule optimality. Generalization to a new schedule similar to a learned one is described qualitatively; how much similarity is required is explicitly left for further study. Contradictory training choices prevent convergence, and the proposed remedy is adding contextual features (PDF pp. 7-8).

## Limitations

Feasibility is provided by the external candidate generator, and preferences depend on hand-designed features and the observed experts. Training-error convergence does not establish out-of-distribution accuracy or global scheduling quality. The entry remains specialist: constructive refers here to selecting a replacement for one vacancy within a scheduling pipeline, not generating a full schedule or performing learned iterative local search.

## Reproducibility

- **Read source:** all eight scanned proceedings pages, printed pages 801-808, including all seven references. Comparison loss, nonlinear-difference identity, dual architecture and training plots were visually inspected.
- **Publication:** official NIPS 1993 volume 6 record; Didier Keymeulen and Martine de Gerlache, Vrije Universiteit Brussel.
- **Supplements:** the official landing has bibliography, metadata and the article; no appendix or attached scientific supplement is identified. The separately cited earlier application paper is not treated as read supplementary material.
- **Implementation:** no source, dataset or complete architecture/training configuration is linked. No experiments were rerun.
- **Relations:** all references were checked; none identify another frozen collection entry, so no internal edge is added.
