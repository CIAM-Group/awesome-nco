---
id: scheduling-of-time-varying-workloads-using-reinforcement-learning
short_title: TVW-RL
title: Scheduling of Time-Varying Workloads Using Reinforcement Learning
authors:
- Shanka Subhra Mondal
- Nikhil Sheoran
- Subrata Mitra
year: 2021
date: '2021-05-18'
publication:
  date: '2021-05-18'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/17088
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/17088
institutions:
- Princeton University
- Adobe Research
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Packing
problems:
- Online Placement of Time-Varying Cluster Workloads
summary: REINFORCE learns online machine placement from quantized CPU/memory histories and workload equivalence
  classes; trace-driven simulations show packing benefits with reward-dependent utilization/overshoot tradeoffs
  on a fixed ten-machine cluster.
figure:
  path: paper-assets/scheduling-of-time-varying-workloads-using-reinforcement-learning/framework.png
  alt: Workload equivalence-class prediction builds a temporal state representation for a neural machine-placement
    policy and feedback from a compute cluster.
  caption: 'Original Figure 1: the TVW-RL scheduling workflow.'
  source_url: https://cdn.aaai.org/ojs/17088/17088-13-20582-1-2-20210518.pdf#page=3
---

# Scheduling of Time-Varying Workloads Using Reinforcement Learning

> **TL;DR:** TVW-RL places incoming workloads onto machines using resource histories and learned workload classes. REINFORCE balances contention, unused capacity, overshoot and waiting penalties. Trace-driven simulations show useful packing behavior; the policy is specialized to a fixed cluster representation, and its reward trades utilization against resource shortages.

## Motivation

Long-running services have changing CPU and memory demands. Packing them using only current or peak demand can either waste resources or colocate simultaneous spikes. The paper studies initial online placement with historical resource-usage information, aiming to reduce contention and fragmentation while using fewer machines. It does not optimize a job-shop makespan or provide an exact optimizer for arbitrary cloud workloads. [Formal pp. 1–2]

## Contributions

- Encodes recent per-machine CPU/memory histories and a waiting queue as a quantized, workload-class-labeled state.
- Combines four reward penalties for temporal contention, under-utilization, first overshoot and waiting requests.
- Groups workloads into equivalence classes to reduce the number of labels, with a classifier updating class estimates from metadata and partial observations.
- Evaluates trace-driven placement, noise robustness and reward/clustering sensitivities on Google and Alibaba traces. [Formal pp. 2–7]

## Methodology

Each machine/resource dimension has a history-by-capacity grid, with h previous logical timesteps and quantized capacity Cd. Occupied pixels identify workload equivalence classes. This representation combines individual machine states with the queue; increasing the history or capacity resolution increases state size. For each incoming request, the policy selects a machine, observes subsequent penalties and learns through episodic REINFORCE. Its fixed output size equals the number of cluster machines. [Formal pp. 2–5, Figures 1–2, Algorithm 1]

The contention surrogate sums time-aligned resource-series inner products for colocated workload pairs. Under-utilization penalizes unused capacity on active machines with exponent Ku; overshoot adds a high first-event penalty; waiting penalizes queue length. Contention and overshoot feedback can be delayed. These soft penalties shape a placement preference; they do not guarantee capacity feasibility, zero overshoot, fairness or a globally optimal packing. [Formal pp. 3–4]

Equivalence classes use normalized temporal features with k-means, or dynamic-time-warping distances with k-medoids. Candidate cluster counts 3–15 are compared over fifty initializations using silhouette scores. Per-class resource-prediction accuracy provides a proxy for choosing a mapping before expensive RL training. A separate two-hidden-layer classifier predicts a workload's class using metadata and partial resource observations; labels of running workloads are refreshed before placement. [Formal pp. 4–5]

The policy has one 20-neuron ReLU hidden layer and a machine-sized softmax head, implemented with Theano. Experiments use ten machines, history length 20, two resource dimensions and eight quantized units per resource. This is **specialist / constructive** online placement. Two source organizations, three arrival loads and noise settings do not establish a shared checkpoint across distinct native optimization problems. [Formal p. 5]

## Experiments

Google traces cover 29 days, and Alibaba traces eight days over roughly 4,000 machines. The study filters out evicted, killed, failed and partially recorded traces, with minimum continuous-record requirements for long-running jobs. End-to-end evaluation builds mixtures containing 50% jobs longer than thirty hours, approximately balancing CPU- and memory-intensive jobs. Poisson arrivals target mean cluster loads of 30%, 50% and 80%; each trace supplies 100 training and thirty test job sequences. These are simulations driven by production traces, not an operational deployment or a causal measurement of user-facing performance. [Formal p. 5]

REINFORCE uses twenty trajectories, 2,000 iterations, maximum episode length 200, Adam rate 0.001 and parallel batches of twenty on a 32-core Intel Xeon E5-2686 v4. Default coefficients are Kc=0.1, Ku=3, Ko=30,000 and Kw=50. Offline training is reported as approximately 28–108 hours. No per-decision inference-latency or deployment-scale experiment is established by those training times. [Formal p. 5]

Comparators are Tetris with fairness disabled, FIFO Best-Fit and a modified **DeepRM+Best-Fit**. DeepRM receives peak resource demands, treats the cluster as one monolithic capacity, adds an unused-resource penalty, and uses Best-Fit to map its selected job to an actual machine. This modified combination is what the figures call DeepRM. [Formal pp. 5–6]

Figures 4–5 report higher utilization and lower fragmentation than the tested Tetris and modified DeepRM baselines. The utilization denominator uses the maximum active-machine count during the observation, so tighter placement affects both utilization and machine-count metrics. Best-Fit can have higher utilization but also substantial overshoot. Resource contention is a series-based proxy; the experiments do not directly measure cache stalls, application response time or an SLA guarantee. No precise bar values are invented from the plots. [Formal p. 6]

The ablations expose tradeoffs. Raising Ku from 0 to 3 changes Alibaba CPU utilization 0.103→0.179, memory utilization 0.171→0.298 and machines used 8.967→5.167, but overshoot changes 0→0.145%. Raising Ko reduces overshoot while increasing machine use. Equivalence-class variants improve packing in Table 2 but have higher overshoot than the no-class variant. Under larger [0,3] background noise, noise-trained and untrained policies have overshoot 0.055% and 0.132%, respectively, with more machines used by the trained policy. These robustness results average five seeds and do not establish robustness to arbitrary workload shifts. [Formal p. 7, Tables 2–3]

## Limitations

The fixed ten-machine action space and quantized history representation restrict scale transfer. Workload filtering excludes failed and partial traces, while the simulation assumes sampled resource traces can represent placed workloads. Clustering/prediction errors and changing workload populations can affect placement. The paper does not provide an approximation ratio, formal feasibility certificate or convergence guarantee.

Reported percentage ranges refer to different metrics and comparators and should not be combined into a universal speedup. One noise statement calls 0.132 “240% larger” than 0.055; their ratio is 2.4, corresponding to approximately **140% larger**. This is curator arithmetic about the printed cells, not a rerun or a change to either reported measurement. Reward tuning and equivalence classes do not improve every operational metric simultaneously.

## Reproducibility

All nine formal pages were read, including the complete references. The workflow, state illustration, reward/metric equations, algorithm, three tables and both sets of result plots were visually checked. The author-hosted nine-page PDF is byte-identical to the formal copy, so it is inventoried without adding duplicate reading coverage. No identified arXiv version or separately named scientific appendix was found through the formal article, both author publication pages and the Adobe project page. Publisher HTML and OpenReview API failures are logged; the article does not explicitly refer to an unavailable independent proof or scientific supplement.

Formal publication is 2021-05-18, confirmed by publisher-deposited Crossref metadata. Adobe's February 9 date corresponds to the conference period and is retained as a source discrepancy, rather than replacing the formal publication date. The formal byline is Mondal, Sheoran and Mitra, affiliated with Princeton and Adobe Research; Mondal and Sheoran contributed equally.

The checked primary publication pages link the paper and underlying public traces, but no official TVW-RL implementation or pretrained checkpoint was identified. Adobe's old PDF path returns 404; the current author PDF works and matches the formal bytes. No code link is invented, and the Alibaba trace repository is not presented as solver code. Training, inference, clustering and the historical evaluations were not independently rerun. Details such as policy discount, full queue/defer behavior, classifier training budgets and a comprehensive model-selection protocol are not fully specified by the nine-page article.
