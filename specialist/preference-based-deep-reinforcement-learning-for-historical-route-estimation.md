---
id: preference-based-deep-reinforcement-learning-for-historical-route-estimation
short_title: POMO+PO
title: Preference-based Deep Reinforcement Learning for Historical Route Estimation
authors:
- Boshen Pan
- Yaoxin Wu
- Zhiguang Cao
- Yaqing Hou
- Guangyu Zou
- Qiang Zhang
year: 2025
date: '2025'
publication:
  date: '2025'
  source_url: https://www.ijcai.org/proceedings/2025/955
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2025/955
institutions:
- Dalian University of Technology
- Eindhoven University of Technology
- Singapore Management University
- Key Laboratory of Social Computing and Cognitive Intelligence (Dalian University of Technology), Ministry of Education,
  China
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Preference-aware Capacitated Vehicle Routing Problem
summary: A POMO route constructor learns from synthetic historical routes using arc-difference reward and pairwise
  preference optimization. Experiments improve historical-arc agreement on CVRP benchmarks; simulated preferences,
  incomplete budgets and manuscript/release objective differences limit broader human-alignment claims.
code_url: https://github.com/pandarking/Preference-based-DRL
figure:
  path: paper-assets/preference-based-deep-reinforcement-learning-for-historical-route-estimation/framework.png
  alt: CVRPLIB subinstances and historical routes produce arc-difference rewards and preference loss for a POMO
    route generator.
  caption: 'Original Figure 1: the preference-aware reinforcement-learning framework.'
  source_url: https://www.ijcai.org/proceedings/2025/0955.pdf#page=2
---

# Preference-based Deep Reinforcement Learning for Historical Route Estimation

> **TL;DR:** POMO+PO trains a **specialist/constructive** CVRP policy to generate routes resembling historical examples. Arc agreement is a proxy for preference; the reported histories are simulated, and the results do not establish real-driver satisfaction or uniformly shorter routes.

## Motivation

A shortest route can differ from a driver's habitual route because of unobserved operational preferences. Instead of specifying all preferences as explicit constraints, this work learns route generation from historical examples. Despite the title's estimation wording, the output is a newly constructed feasible CVRP solution, so it is a neural combinatorial solver rather than only a trajectory-prediction model. [Introduction/problem definition.](https://www.ijcai.org/proceedings/2025/0955.pdf#page=1)

## Contributions

- A reward combines negative route length and arc disagreement with historical routes.
- Pairwise comparisons derived from that scalar quality guide preference optimization of a POMO policy.
- Reward-based ranking is invariant to a common positive affine transformation, preserving the order of compared candidates.
- Synthetic-history CVRP comparisons, reward/objective ablations and unseen-instance/100-node tests evaluate historical-route agreement. [Framework and methodology.](https://www.ijcai.org/proceedings/2025/0955.pdf#page=2)

## Methodology

### Arc-difference proxy and route construction

The CVRP retains depot returns, one visit per customer and vehicle-capacity constraints. A POMO autoregressive policy generates feasible routes; there is no learned operator editing a complete incumbent. For each candidate, the printed arc difference averages the number of its directed arcs absent from each of N historical routes. This is a one-sided arc-set discrepancy, not a symmetric geometric distance or direct human rating.

The reward is the negative weighted sum of route length and arc difference, with beta controlling the trade-off. At beta=1, there is **no explicit route-length term**. The reported improvement in historical agreement therefore does not imply a shorter or cost-optimal route. Binary preference labels are induced from this reward, not collected as independent human pairwise judgments. [Equations1-3.](https://www.ijcai.org/proceedings/2025/0955.pdf#page=4)

### Preference objective and implementation boundary

The paper motivates policy-log-probability differences through an entropy-regularized optimal policy and a Bradley-Terry/Thurstone preference link. The partition function cancels for two trajectories of the same instance. This optimal-distribution identity is not a proof that a finite trained POMO network achieves the entropy-regularized optimum.

Printed Equation9 selects r1<r2 while increasing log preference for trajectory1, which conflicts with the higher-is-better negative-cost reward convention; subsequent prose also calls r an arc difference. The released trainer instead uses reward1>reward2, a **linear log-probability-difference loss**, and adds a mean-baseline REINFORCE loss. It does not implement the displayed log-sigmoid Bradley-Terry likelihood verbatim. The environment explicitly sets beta=1 and reward=-AD. These inspected conventions clarify what the available snapshot does; the note does not silently repair the printed equation or claim full experimental reproduction. [Equations4-9.](https://www.ijcai.org/proceedings/2025/0955.pdf#page=5)

## Experiments

### Data and budget

The experiments use an Intel i5-13400,32GB RAM and RTX4090. The historical-data generator starts from one CVRPLIB instance with73 customers, samples20-customer subinstances and random demands, and uses batches of50. It multiplies pairwise distances by independent U(.8,1.2) factors, solves a heuristic initial route, then adds29 perturbed routes to produce30 histories per subinstance. These are **simulated histories**, not a documented collection of actual drivers' preferred routes.

The paper does not specify a complete train/test count/split, the full training epoch budget, inference candidate budget, runtime table or repeated-seed uncertainty. Its released train_n20 configuration supplies100epochs and batch50; these snapshot defaults are not retroactively attributed to every published result. [Experimental setup/data generation.](https://www.ijcai.org/proceedings/2025/0955.pdf#page=5)

### Agreement results

Table1 reports mean AD3.15 and normalized AD12.5% for POMO+PO, versus NN8.81/36.9%, Markov13.21/55.3%, and distance-oriented POMO9.15/28.6%. ADmin=0 means at least one displayed evaluation example attains a zero observed discrepancy; it does not mean every route or every driver is perfectly matched. Normalized and unnormalized mean statistics are reported as separate table quantities rather than reconstructed from a single assumed arc denominator.

Increasing beta from0/.1/.9/1 changes mean AD7.96/6.78/5.77/3.15 and AD%31.3/26.7/22.9/12.5%. Table3 compares POMO-RL7.54/29.8% with POMO+PO3.15/12.5%. These ablations support historical-arc matching under the constructed proxy; they do not establish the cost of sacrificing distance or a real human preference win. [Tables1-3/Figure2.](https://www.ijcai.org/proceedings/2025/0955.pdf#page=6)

For unseen instances, Table4 reports POMO+PO mean AD6.68 and AD26.5%, compared with the original-instance3.15/12.51%. The proxy still degrades under transfer, though the displayed NN/Markov variants degrade further to roughly64-72%. On unseen100-node instances, mean AD8.82 versus15.97/15.93 for two NN variants is reported, without a corresponding normalized percentage or runtime. This is within-problem transfer, not a shared checkpoint across different native combinatorial tasks. [Tables4-5.](https://www.ijcai.org/proceedings/2025/0955.pdf#page=7)

## Limitations

History similarity is an assumed preference proxy; noisy, unsafe or inefficient historical habits are not independently distinguished. Simulated histories derived from one base instance and random perturbations limit real-world conclusions. Distance/feasibility/perceived preference trade-offs are not jointly quantified in the reported tables. Dynamic or time-dependent VRP deployment is future work, and complete budgets and statistical uncertainty remain unspecified. Positive-affine rank invariance is an ordering property, not a proof of convergence, optimum recovery or robustness to arbitrary preference inconsistency.

The objective sign/link discrepancy between print and release limits exact reproduction. No policy training, full benchmark rerun or independent human-preference study was performed during this review.

## Reproducibility

- Formal IJCAI2025 DOI10.24963/ijcai.2025/955, pages8591-8599, has six authors. Hou and Zhang correspond. Affiliations are DUT, TU/e, SMU and the DUT Ministry-of-Education laboratory. Publisher BibTeX says August while deposited Crossref says September, so publication precision remains2025; no arXiv posting or acceptance day is invented.
- **All nine formal pages were fully read**, including every table, all41references and the complete final conclusions. No appendix or separate scientific supplement is explicitly promised by the paper. Normal primary/title searches did not identify an arXiv version; the available formal source is sufficient here.
- The [official repository](https://github.com/pandarking/Preference-based-DRL), explicitly linked on page5, was inventoried at SHA0f74c7bd2a411d6fb9d040c476292861c55911a9:91entries with source, datasets, checkpoints and one project README; no scientific PDF/TeX/ZIP/notebook. Releases are empty. The complete README and the relevant reward/ranking/loss/training configuration were actually inspected; checkpoint availability is not evidence that the tables were rerun.
- Original Figure1 is cropped from formal PDFpage2, rectangle(51,54,297,176), at5x and actually viewed. Equations1-9, the route comparison and all five tables were rendered and visually inspected.
- Internal relationships require explicit body citations and matching bibliographic identities. AM and Bello are retained as their actually cited2018/2016 arXiv versions. The cited Lin et al.2025 preference-optimization work is distinguished from this paper despite the related titles.
