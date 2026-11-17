---
id: poppy
short_title: Poppy
title: 'Winner Takes It All: Training Performant RL Populations for Combinatorial Optimization'
authors:
- Nathan Grinsztajn
- Daniel Furelos-Blanco
- Shikha Surana
- Clément Bonnet
- Thomas D. Barrett
year: 2023
date: '2022-10-07'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/97b983c974551153d20ddfabb62a5203-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/97b983c974551153d20ddfabb62a5203-Abstract-Conference.html
institutions:
- InstaDeep
- Imperial College London
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Packing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Knapsack
- Job Shop Scheduling Problem
summary: Poppy trains task-specific populations of shared-encoder, separate-decoder constructive policies using
  winner-only updates, then selects the best sampled feasible solution.
arxiv_url: https://arxiv.org/abs/2210.03475
code_url: https://github.com/instadeepai/poppy
figure:
  path: paper-assets/poppy/framework.png
  alt: Poppy first trains one encoder-decoder, then clones decoder heads and trains a population using the best
    reward on each instance/start.
  caption: 'Figure 2: Single-agent pretraining and population specialization; shared encoder and winning decoder
    receive gradients in the paper algorithm.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=6
---
# Winner Takes It All: Training Performant RL Populations for Combinatorial Optimization

> **TL;DR:** Poppy learns complementary constructive policies and returns the best solution from their rollouts. It trains shared encoders and separate decoder heads for each task; population size, starting points, augmentation and extra sampling all consume inference budget. It improves over matched POMO ensembles, while large-size transfer can remain poor.

## Motivation

A policy optimized for its average single rollout may compromise across instances. If several policies are evaluated and only the best result matters, training should reflect that selection. Poppy encourages performance-driven specialization without an explicit behavioral descriptor or diversity penalty. This is an expected-population-reward objective, not a guarantee of diversity, optimality or usefulness of every agent. [Sections 1-3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=2)

## Contributions

- Defines the expected **maximum reward across a population** as the training objective.
- Derives a winner-only policy gradient with the second-best reward as a control-variate baseline.
- Implements efficient populations with one shared encoder and lightweight agent-specific decoder heads.
- Tests TSP, CVRP, 0-1 knapsack and job-shop scheduling, including population/ensemble ablations, larger inference budgets and size transfer. [Sections 3-4 and Appendices A-G.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=5)

## Methodology

### Population objective and practical training

For K policies, independently sample one trajectory per policy and maximize the expected best reward. Theorem 1 and Appendix B derive a gradient supported on the **winning trajectory**, weighted by its reward minus the runner-up's reward. The difference measures its marginal contribution to the sampled population. Ties have zero reward difference. The proof does not establish a strict specialization guarantee. [Section 3.2 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=16)

The main experiments use a **different practical baseline**: POMO's mean reward over starting points. Algorithm 2 samples P starts per instance, rolls out K*P trajectories, picks the winning agent separately for each start and backpropagates only through those winning trajectories. Its update includes both the shared encoder and selected decoders. Appendix C separately studies the analytical second-best baseline; it should not be presented as the baseline used for every main-table result. [Algorithm 2 and Appendix C.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=15)

Ordinarily, Phase 1 trains one policy; Phase 2 clones its pretrained decoder K times and specializes the population. Pretraining avoids unstable winner domination from poorly initialized agents. **Knapsack is an exception**: its population is initially trained in parallel from scratch before specialization. [Section 3.2 and Appendix E.3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=23)

### Task-specific architectures and construction

TSP/CVRP/KP use six-layer attention encoders, embedding width 128, eight heads, feed-forward width 512 and one-layer attention decoders. Layer normalization replaces batch normalization. TSP additionally inverts a mask within decoder attention computations; the complete policy still enforces feasible city choices. CVRP/KP retain their capacity/visited masks. Training starting-point counts are P=50 for TSP and 100 for CVRP/KP, with Adam 1e-4 and L2 coefficient 1e-6. [Appendix E.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=20)

JSSP uses a different Jumanji transformer actor-critic: separate machine-status and duration attention, followed by joint job/machine attention. It predicts per-machine categorical actions; actor/critic do not share weights. Tests use 10 jobs, 10 operations each and 10 machines, horizon 1250 and an over-horizon penalty of 2500. [Appendix E.4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=23)

Each policy builds a feasible solution incrementally. Evaluating many policies, starts or stochastic rollouts is constructive search, not modification of a completed incumbent. No inference-time neural-weight tuning is required. Models are trained **separately per task**; shared encoders refer to agents within one task's population. Thus Poppy is **specialist, constructive**, despite using the same training framework across four tasks. [Sections 3-4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=6)

## Experiments

### Compute, data and population overhead

All reported Poppy experiments use JAX/Jumanji on a **v3-8 TPU**. Training batches contain 64 instances for TSP/CVRP/KP and 128 for JSSP. For TSP100, Phase 1 takes 4.5M steps/about five days; population specialization takes 400K steps/about one-four days. Appendix A.2 reports single-agent/largest-population training of **5+4 days TSP, 7+5 CVRP, 1+3 KP and 1+3 JSSP**. The separate KP text describes a short initial parallel-training phase; that is not a claim that the whole reported KP population trains in minutes. [Sections 4 and Appendix A.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=15)

TSP parameter counts rise from **1.289M for one agent to 2.771M for 16 and 4.352M for 32**. Sharing reduces overhead compared with duplicating whole models, but populations still use additional memory and rollouts. Imported GPU/PyTorch baseline times are marked separately; the authors' informal divide-by-two conversion to TPU time is not a measured hardware calibration. [Table 4 and Section 4.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=7)

### Routing and size transfer

Routing models train on 100 nodes. Tests contain **10000 instances at 100 and 1000 each at 125/150**, with total-dataset timing. TSP gaps reference Concorde; main CVRP gaps reference **heuristic HGS**, whose score is not certified optimal. CVRP demands are integers 1-9 normalized by capacities 50/55/60 at sizes 100/125/150. [Section 4.1 and Appendix E.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=8)

| Main comparison | Size 100 gap / total time | Size 125 gap | Size 150 gap |
| --- | --- | --- | --- |
| POMO TSP, 16 samples | .27% / 1 min | .42% | .81% |
| POMO TSP, 16-head ensemble | .33% / 1 min | .53% | .95% |
| Poppy TSP, 16 agents | .07% / 1 min | .14% | .27% |
| POMO CVRP, 32 samples | 1.31% / 5 min | 1.82% | 2.94% |
| POMO CVRP, 32-head ensemble | 1.36% / 5 min | 1.87% | 2.73% |
| Poppy CVRP, 32 agents | 1.06% / 5 min | 1.47% | 2.33% |

These support population specialization over matched ensembles. They do **not** support every broad superiority statement in the prose: Table 1 lists Att-GCRN+MCTS at **.037%**, below Poppy's .07% but with more time, and Table 2's 1.31-to-1.06% CVRP change is not a halving. The specialized classical reference solvers retain better main-table quality. [Tables 1-2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=8)

The analytical baseline gives TSP100 .05% instead of .07%, but TSP150 .28% instead of .27%; it is not uniformly superior. Appendix C's CVRP gaps instead reference **LKH**, so its .48/.52% values cannot be compared directly with main-table HGS gaps. [Tables 5-6.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=17)

Large-size transfer is a substantial failure case: at **TSP1000**, Poppy16 reports **71.7% gap in 39 minutes**, versus POMO's 120%; DIMES gives 2.46% in five hours. Relative improvement over POMO does not establish good large-instance solutions. [Appendix G/Table 11.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=25)

### Knapsack, scheduling and extra sampling

KP uses 100 independent uniform item weights/values and capacity 25, with 10000 tests. At **1600 candidate samples per instance**, Poppy16 gives a .0005% gap versus POMO sampling .0060% and ensemble .021%, all in two reported minutes. Rounded mean objective values coincide despite different gaps; this is not exact optimality on every instance. [Table 3a and Appendix E.3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=9)

JSSP uses 100 synthetic 10x10 cases. At 1600 candidates per instance, Poppy16 gives makespan **857.7 / 6.2% gap / 30 minutes**, compared with matched single-policy sampling 866.0/7.2%/30 minutes. L2D uses 8000 candidates for 871.7/8.0% and an imported eight-hour time. OR-Tools gives 807.6 in 37 seconds, so this is improvement over selected learned baselines rather than an advantage over the classical solver. [Table 3b.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=9)

For routing's larger-budget experiment, first run greedy policies across starts, then distribute remaining samples across promising agent/start pairs: the total is **200*8*N candidates per instance**, including augmentation and both phases. TSP100 reaches **.002% in two hours**; CVRP100 reaches .39% against HGS in four hours. JSSP's 8000-candidate experiment gives 849.7/5.2% in three hours. This is extra constructive sampling, not weight adaptation; EAS comparisons select non-network-backpropagating variants. [Appendix D, Tables 8-10.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=18)

Population analyses show every tested agent contributing to the TSP100 best result and worse average individual performance as the full population improves. Such complementary behavior is empirical. Removing agents from a trained population can harm quality; it is not equivalent to training a smaller population. [Figure 4 and Appendix E.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=20)

## Limitations

### Reported by the Authors

- Populations above 32 are untested. Additional agents may stop finding specialization niches or collapse toward negligible contributions.
- Winner-only training from untrained populations can be unstable, motivating pretraining.
- Training, population storage and candidate evaluation grow with scale; specialized members need not work well individually. [Sections 3.2/5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/97b983c974551153d20ddfabb62a5203-Paper-Conference.pdf#page=10)

### Curator Notes

- The general training method is not one checkpoint spanning routing, packing and scheduling. JSSP even uses a different architecture and baseline.
- Main/theoretical baselines, HGS/LKH references and short/long inference schedules differ; their gaps and times should not be merged.
- TSP1000 transfer remains poor, and selected tables include stronger classical or longer-budget neural methods. “State of the art” statements need the exact comparator class and budget.
- Current repository training instructions differ materially from the paper, as detailed below; pinning the code/configuration is necessary for faithful reproduction.

## Reproducibility

- **Formal publication:** [NeurIPS 2023](https://proceedings.neurips.cc/paper_files/paper/2023/hash/97b983c974551153d20ddfabb62a5203-Abstract-Conference.html). All **25 integrated publisher-PDF pages**, including A-G, were reread.
- **Scientific supplement:** the publisher ZIP contains **56 members**, including a **nine-page line-numbered appendix** and code. That PDF was separately read in full. Its earlier CVRP tables use LKH references and it lacks the integrated PDF's additional baseline-impact/TSP1000 material; those versions are distinguished. Negative LKH gaps do not mean beating a true optimum.
- **Metadata/version:** [arXiv:2210.03475](https://arxiv.org/abs/2210.03475) began **7 October 2022**, revised 13 November 2023. The earlier title “Population-Based Reinforcement Learning for Combinatorial Optimization” belongs to this same version chain. The actual formal title and title-page author **Thomas D. Barrett** are retained; the publisher HTML abbreviates him as Tom Barrett. Clément Bonnet's accent was repaired. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2023/hash/97b983c974551153d20ddfabb62a5203-Abstract-Conference.html) explicitly records `citation_publication_date` as **2023-12-15**, independently of any paper-specific acceptance date.
- **Official implementation:** [instadeepai/poppy](https://github.com/instadeepai/poppy). Both the current README and ZIP README were read. The **paper/ZIP Algorithm 2 clone pretrained decoders and update the shared encoder**, whereas the current GitHub README describes discarding the decoder, random initialization and a frozen encoder. These are not assumed equivalent. The archived README/config examples match cloning/joint updates more closely; no end-to-end numerical rerun is claimed.
- **Figure:** original Figure 2 from PDF page 6, including the training/frozen legend, illustrates which decoder receives a given sample's gradient. The encoder remains trainable in the paper algorithm.
