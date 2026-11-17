---
id: nice-robust-scheduling-through-reinforcement-learning-guided-integer-programming
short_title: NICE
title: 'NICE: Robust Scheduling through Reinforcement Learning-Guided Integer Programming'
authors:
- Luke Kenworthy
- Siddharth Nayak
- Christopher Chin
- Hamsa Balakrishnan
year: 2022
date: '2021-09-24'
publication:
  date: '2022-06-28'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/21218
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/21218
institutions:
- US Air Force–MIT AI Accelerator
- Massachusetts Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Integer Programming
problems:
- Robust Flight Crew Scheduling
summary: PPO pilot-assignment probabilities become objective coefficients in a smaller crew-scheduling IP; shuffled
  rollouts or independent slot resets extract weights, while the classical solver enforces feasibility and the observed
  robustness benefit depends on schedule density and reward design.
arxiv_url: https://arxiv.org/abs/2109.12171
code_url: https://github.com/nsidn98/NICE
figure:
  path: paper-assets/nice-robust-scheduling-through-reinforcement-learning-guided-integer-programming/framework.png
  alt: Repeated shuffled neural pilot-assignment rollouts yield averaged pilot-slot weights passed to an integer-programming
    solver.
  caption: 'Original Figure 1: Monte Carlo coefficient extraction and IP scheduling.'
  source_url: https://cdn.aaai.org/ojs/21218/21218-13-25231-1-2-20220628.pdf#page=5
---

# NICE: Robust Scheduling through Reinforcement Learning-Guided Integer Programming

> **TL;DR:** PPO learns a scheduling preference, and NICE converts its pilot-assignment probabilities into coefficients of a compact integer program. The IP supplies a globally feasible assignment. Dense-schedule results support a useful empirical robustness–runtime tradeoff; the explicit buffer IP is better in the easier setting, and a different learned reward fails to improve robustness.

## Motivation

An IP can model pilot qualifications, availability and conflicting flights, but explicitly optimizing robustness adds many pilot/flight-pair variables. Sequential neural assignment is fast yet can leave an unfillable slot after earlier choices. NICE combines learned preferences with the IP's simultaneous consideration of all assignments. The target is disruption-resistant squadron scheduling, rather than a replacement for all airline crew-scheduling formulations. [Formal pp. 1–4]

## Contributions

- Replaces a constant feasibility objective with neural pilot–slot probability coefficients while retaining the simpler feasibility constraints.
- Compares shuffled Monte Carlo extraction with independent “blank slate” slot evaluation.
- Studies robustness under simulated delays and density shifts using an anonymized squadron-derived event generator.
- Reports both successful buffer-reward models and an unsuccessful move-up-pilot reward alternative in the appendix. [Formal pp. 3–7; arXiv v3 pp. 10–11]

## Methodology

Binary Xis assigns pilot i to slot s. Constraints enforce leave, qualifications, exactly one pilot per slot, at most one slot of a flight per pilot, and no overlapping flights. The baseline maximizes the number of assignments, an objective that is constant when every slot is required filled. All flights return to the same base, and supplied flight intervals already include rest time; relocation and separate rest regulations are outside the evaluated model. [Formal p. 3, Eqs. 1.1–1.7]

PPO learns to assign one pilot per slot from current event attributes, pilot availability and training-requirement features. Buffer rewards are b+1 for a gap of b days, T−1 for a pilot's first event, +25 for completing a schedule and −10 for failure. These are surrogate local rewards; the IP objective `sum(ais Xis)` is not an exact expected-disruption objective or a product/log-likelihood of the sequential policy. [Formal pp. 3–6]

Monte Carlo extraction randomly shuffles slots, records pilot probabilities and averages n rollouts, using zeros for unfilled slots. Blank slate extraction evaluates each slot as the first decision using the same network. NICE then solves the original compact feasibility IP with these coefficients. It does not iteratively improve an incumbent through learned edits, so it is **specialist / constructive solver guidance**. Claims about other IP/DES-isomorphic domains are proposed applicability; the experiments demonstrate one native crew-scheduling task. Buffer and move-up rewards train separate networks. [Formal p. 4, Eq. 3; arXiv v3 p. 10]

## Experiments

The source dataset has 87 pilots, 32 qualifications and 801 flights over six months, comprising seven mission and nine simulator types with two or three slots. A generator samples weekly counts, flight types/durations and start days from this data, while retaining supplied leave information. This is synthetic evaluation derived from one squadron, not a deployed operational trial or a held-out organization. The fixed 87-pilot output layer requires retraining when adding pilots. [Formal pp. 5–6]

Fifteen buffer models cover densities 1/2/3 and five seeds. Four extraction choices n=0/2/4/8, each evaluated on twenty generated scenarios, select density-1 training and n=2. One selected seed model then evaluates 100 trials at each delayed-flight fraction 25/50/75/100%. One day into the week, not-yet-departed flights are delayed uniformly by one to three days; another IP minimizes changed assignments. Infeasible generated schedules are skipped jointly for NICE/baseline; incomplete pure-RL schedules are independently excluded. Paired t-tests compare NICE and baseline, while Welch tests compare their differing successful-schedule samples with RL. These are conditional averages, not full success-rate comparisons. [Formal p. 6]

At density 1, NICE disruption means are 0.34/0.67/0.66/0.63 versus baseline 0.61/1.16/1.13/1.06. **The buffer IP achieves zero disruptions**, with NICE and buffer schedules both taking under 0.85 seconds on average. At density 2, NICE reports 1.99/3.17/3.32/2.81 versus baseline 2.99/5.01/6.32/4.70, the source of the approximately 33–48% reduction claim. NICE averages 1.85–1.90 seconds; the buffer IP finds no schedule before 90-minute timeouts in ten attempted runs per delay fraction. NICE's corresponding experiment has 100 trials, so the timeout result is a finite experimental observation, not a universal runtime bound. [Formal p. 7, Tables 1–2]

The move-up appendix trains another fifteen policies, selecting density 2 and n=2. At evaluation density 1 its NICE disruptions do not differ significantly from baseline: e.g. 0.63 versus 0.61 at 25% delay, p=0.88, and 1.19 versus 1.13 at 75%, p=0.73. The authors attribute this to a weaker robustness surrogate. This negative result prevents treating arbitrary reward-to-IP coefficient extraction as automatically effective. [arXiv v2/v3 pp. 10–11, Table 3]

Training details survive in **arXiv v2**, although omitted from v3: 5,000 epochs, 4,000 steps per epoch, two 64-unit hidden layers, policy/critic learning rates 3e−4/1e−3, gamma 0.99, lambda 0.97, clip 0.2 and target KL 0.01. Training uses forty MPI processes on the described Intel Xeon-P8 infrastructure; schedule experiments use an Intel Core i7 laptop with 32 GB RAM and Gurobi 9.1.2. Offline training and model/extraction selection costs are separate from the reported online schedule times. [v2 pp. 10–11, Implementation Details]

## Limitations

Robustness is an empirical property under the chosen delay generator and reward, not a theorem. Gurobi enforces the encoded feasibility constraints, but coefficient extraction does not encode all nonlinear objectives or guarantee optimal robustness. The fixed squadron/qualification dimensions restrict transfer. Conditional exclusion of infeasible inputs and incomplete RL schedules should accompany the large neural-baseline differences.

Some printed appendix labels are inconsistent: v3 Table 3 calls the comparator “Buffer IP” although the surrounding section and v2 correctly identify a move-up IP. Its prose also verbally inverts the disruption ratio while retaining the r<1 interpretation. These are documented specification/label issues; the reported cells are not silently rewritten or presented as new experiments.

## Reproducibility

The nine-page formal article, eleven-page arXiv v3, eleven-page v2, 44-page official slide PDF and one-page official poster were read completely: **31 article pages plus 45 slide/poster pages**. The extra v2 was necessary to recover the explicitly referenced training appendix. All scientific tables, formulas, the original diagram, appendix negative results and slide-specific overqualification illustration were visually checked. Author revision PDF content comparison found the same v2 science, with an arXiv stamp removed and a paragraph moved across a page boundary; it is inventoried without counting another independent article read. The project links a talk and editable slides; these are not claimed as viewed video or additional read documents.

Formal publication is 2022-06-28. Primary arXiv history records v1=2021-09-24, v2=2021-12-10 and v3=2022-04-14. The official repository commit `2fc10642c08b999523836082330e16f5a8217c81` is dated 2022-07-13. Its 232-member/215-file archive has implementation, experiment logs and model files but no separate scientific PDF/TeX/video/archive/notebook. README, model naming, density/seed/reward training sweep, online timing wrapper and exclusion/statistical-test code were inspected. CARLO/LOGITS/NICE are documented aliases. No weights were loaded, training run, Gurobi benchmark rerun or historical result independently reproduced. Local publisher/OpenReview access failures are recorded; all named scientific appendices are covered by the read arXiv copies.
