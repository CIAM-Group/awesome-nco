[Back to main index](../README.md)

# Specialist Neural Solvers

Specialist neural solvers are trained for a single optimization problem. Reusing the same architecture for another problem does not make it generalist when a separate model or checkpoint must be trained for each problem.

Generalization across instance sizes, input distributions, or constraint ranges within the same problem is valuable, but it is still specialist generalization under this repository's taxonomy.

## Solver Paradigms

- **Constructive:** Builds a complete solution from an empty or partial solution.
- **Improvement:** Starts from a complete solution and repeatedly modifies it.
- **Constructive + Improvement:** Both construction and improvement are substantive parts of the proposed method. Optional conventional post-processing alone does not qualify.

The paradigm describes the proposed solver pipeline, not every auxiliary operation used during training or evaluation.

## Papers

Select a paper title to open its research note.

<!-- GENERATED_PAPER_INDEX_START -->
### [DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization](deepaco.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Orienteering Problem; Prize Collecting Traveling Salesman Problem; Sequential Ordering Problem; Single Machine Total Weighted Tardiness Problem; Resource-Constrained Project Scheduling Problem; Multiple Knapsack Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **First public:** 2023-09-25
- **Institutions:** Soochow University; Singapore Management University; Tsinghua University

### [DIMES: A Differentiable Meta Solver for Combinatorial Optimization Problems](dimes.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Traveling Salesman Problem; Maximum Independent Set
- **Venue:** NeurIPS
- **Year:** 2022
- **First public:** 2022-10-08
- **Institutions:** Carnegie Mellon University

### [RBG: Hierarchically Solving Large-Scale Routing Problems in Logistic Systems via Reinforcement Learning](rbg.md)

- **Paradigm:** Improvement
- **Problems:** Large-scale Vehicle Routing Problem
- **Venue:** KDD
- **Year:** 2022
- **First public:** 2022-08-12
- **Institutions:** Tsinghua University; Beijing Tsingroc; Hitachi China Research and Development Corporation

### [Simulation-Guided Beam Search for Neural Combinatorial Optimization](simulation-guided-beam-search.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Flexible Flow Shop Problem
- **Venue:** NeurIPS
- **Year:** 2022
- **First public:** 2022-07-13
- **Institutions:** Samsung SDS; Bielefeld University

### [MAPDP: Cooperative Multi-Agent Reinforcement Learning to Solve Pickup and Delivery Problems](mapdp.md)

- **Paradigm:** Constructive
- **Problems:** Pickup and Delivery Problem
- **Venue:** AAAI
- **Year:** 2022
- **First public:** 2022-06-28
- **Institutions:** Tsinghua University; Hitachi China Research and Development Corporation

### [Diffusion Models as Plug-and-Play Priors](diffusion-plug-and-play-priors.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** NeurIPS
- **Year:** 2022
- **First public:** 2022-06-17
- **Institutions:** Stony Brook University; Mila - Quebec AI Institute; Microsoft Research

### [Sym-NCO: Leveraging Symmetricity for Neural Combinatorial Optimization](sym-nco.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Prize Collecting Traveling Salesman Problem; Orienteering Problem
- **Venue:** NeurIPS
- **Year:** 2022
- **First public:** 2022-05-26
- **Institutions:** Korea Advanced Institute of Science and Technology

### [Pareto Set Learning for Neural Multi-Objective Combinatorial Optimization](pareto-set-learning.md)

- **Paradigm:** Constructive
- **Problems:** Bi-objective Traveling Salesman Problem; Tri-objective Traveling Salesman Problem; Multi-objective Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2022
- **First public:** 2022-03-29
- **Institutions:** City University of Hong Kong; University of Essex

### [Learning to Solve Routing Problems via Distributionally Robust Optimization](routing-dro.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** AAAI
- **Year:** 2022
- **First public:** 2022-02-15
- **Institutions:** Nanyang Technological University; Singapore Institute of Manufacturing Technology

### [Learning 3-opt Heuristics for Traveling Salesman Problem via Deep Reinforcement Learning](neural-3-opt.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** ACML
- **Year:** 2021
- **First public:** 2021-11-17
- **Institutions:** Institute of Computing Technology; Chinese Academy of Sciences; University of Chinese Academy of Sciences; Zhongke Big Data Academy

### [Learning Collaborative Policies to Solve NP-hard Routing Problems](learning-collaborative-policies.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Prize Collecting Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2021
- **First public:** 2021-10-26
- **Institutions:** Korea Advanced Institute of Science and Technology

### [NeuroLKH: Combining Deep Learning Model with Lin-Kernighan-Helsgaun Heuristic for Solving the Traveling Salesman Problem](neurolkh.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Pickup and Delivery Problem; Vehicle Routing Problem with Time Windows
- **Venue:** NeurIPS
- **Year:** 2021
- **First public:** 2021-10-15
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University

### [Graph Neural Network Guided Local Search for the Traveling Salesperson Problem](graph-guided-local-search.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** ICLR
- **Year:** 2022
- **First public:** 2021-10-12
- **Institutions:** University of Cambridge

### [Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer](dact.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2021
- **First public:** 2021-10-06
- **Institutions:** National University of Singapore; A*STAR; Shandong University; University of Electronic Science and Technology of China; Hong Kong University of Science and Technology

### [Learning to Delegate for Large-Scale Vehicle Routing](learning-to-delegate.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** NeurIPS
- **Year:** 2021
- **First public:** 2021-07-08
- **Institutions:** Massachusetts Institute of Technology

### [Matrix Encoding Networks for Neural Combinatorial Optimization](matrix-encoding-networks.md)

- **Paradigm:** Constructive
- **Problems:** Asymmetric Traveling Salesman Problem; Flexible Flow Shop Problem
- **Venue:** NeurIPS
- **Year:** 2021
- **First public:** 2021-06-21
- **Institutions:** Samsung SDS

### [Efficient Active Search for Combinatorial Optimization Problems](efficient-active-search.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Orienteering Problem; Prize Collecting Traveling Salesman Problem; Flexible Flow Shop Problem
- **Venue:** ICLR
- **Year:** 2022
- **First public:** 2021-06-09
- **Institutions:** Bielefeld University; Samsung SDS

### [Deep Policy Dynamic Programming for Vehicle Routing Problems](deep-policy-dynamic-programming.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** CPAIOR
- **Year:** 2022
- **First public:** 2021-02-23
- **Institutions:** University of Amsterdam; ORTEC

### [Multi-Decoder Attention Model with Embedding Glimpse for Solving Vehicle Routing Problems](multi-decoder-attention-model.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** AAAI
- **Year:** 2021
- **First public:** 2020-12-18
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University

### [Generalize a Small Pre-trained Model to Arbitrarily Large TSP Instances](att-gcn.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** AAAI
- **Year:** 2021
- **First public:** 2020-11-26
- **Institutions:** The Chinese University of Hong Kong; Shenzhen

### [POMO: Policy Optimization with Multiple Optima for Reinforcement Learning](pomo.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2020
- **First public:** 2020-10-30
- **Institutions:** Samsung SDS

### [Step-Wise Deep Learning Models for Solving Routing Problems](step-wise-routing.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IEEE TII
- **Year:** 2021
- **First public:** 2020-10-15
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University

### [Learning a Latent Search Space for Routing Problems Using Variational Autoencoders](latent-search-space-routing.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2021
- **First public:** 2020-09-25
- **Institutions:** Bielefeld University; University of Massachusetts Amherst

### [Efficiently Solving the Practical Vehicle Routing Problem: A Novel Joint Learning Approach](practical-vrp-joint-learning.md)

- **Paradigm:** Constructive
- **Problems:** Vehicle Routing Problem; Capacitated Vehicle Routing Problem
- **Venue:** KDD
- **Year:** 2020
- **First public:** 2020-08-23
- **Institutions:** Zhejiang Cainiao Supply Chain Management Co. Ltd; Alibaba Group

### [Learn to Design the Heuristics for Vehicle Routing Problem](egate.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** IJCAI HSI Workshop
- **Year:** 2020
- **First public:** 2020-02-20
- **Institutions:** Nanjing University of Aeronautics and Astronautics

### [A Graph Neural Network Assisted Monte Carlo Tree Search Approach to Traveling Salesman Problem](gnn-mcts-tsp.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** IEEE Access
- **Year:** 2020
- **First public:** 2020-01-01
- **Institutions:** Shanghai Jiao Tong University

### [Learning Improvement Heuristics for Solving Routing Problems](learning-improvement-heuristics.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IEEE TNNLS
- **Year:** 2022
- **First public:** 2019-12-12
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University; Singapore Institute of Manufacturing Technology

### [Neural Large Neighborhood Search for the Capacitated Vehicle Routing Problem](neural-large-neighborhood-search.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** ECAI
- **Year:** 2020
- **First public:** 2019-11-21
- **Institutions:** Bielefeld University

### [A Deep Reinforcement Learning Algorithm Using Dynamic Attention Model for Vehicle Routing Problems](dynamic-am.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** ISICA
- **Year:** 2019
- **First public:** 2019-11-16
- **Institutions:** Sun Yat-sen University

### [Combinatorial Optimization by Graph Pointer Networks and Hierarchical Reinforcement Learning](graph-pointer-network-hrl.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Traveling Salesman Problem with Time Windows
- **Venue:** AAAI Workshop on Deep Learning on Graphs: Methodologies and Applications
- **Year:** 2020
- **First public:** 2019-11-12
- **Institutions:** Columbia University; Cornell University

### [A Learning-based Iterative Method for Solving Vehicle Routing Problems](learning-to-improve.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Split Delivery Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2020
- **First public:** 2019-09-25
- **Institutions:** Ant Financial

### [An Efficient Graph Convolutional Network Technique for the Travelling Salesman Problem](efficient-graph-convnet-tsp.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** arXiv
- **Year:** 2019
- **First public:** 2019-06-04
- **Institutions:** Nanyang Technological University; Loyola Marymount University

### [Learning to Perform Local Rewriting for Combinatorial Optimization](neurewriter.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Job Shop Scheduling Problem
- **Venue:** NeurIPS
- **Year:** 2019
- **First public:** 2018-09-30
- **Institutions:** Facebook AI Research; University of California, Berkeley

### [Learning Heuristics for the TSP by Policy Gradient](learning-heuristic.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** CPAIOR
- **Year:** 2018
- **First public:** 2018-06-26
- **Institutions:** Polytechnique Montreal; Element AI; HEC Montreal; CIRRELT

### [Attention, Learn to Solve Routing Problems!](attention-model.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Split Delivery Vehicle Routing Problem; Orienteering Problem; Prize Collecting Traveling Salesman Problem; Stochastic Prize Collecting Traveling Salesman Problem
- **Venue:** ICLR
- **Year:** 2019
- **First public:** 2018-03-22
- **Institutions:** University of Amsterdam; ORTEC; CIFAR

### [Reinforcement Learning for Solving the Vehicle Routing Problem](rl-vrp.md)

- **Paradigm:** Constructive
- **Problems:** Vehicle Routing Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2018
- **First public:** 2018-02-12
- **Institutions:** Lehigh University

### [Learning Combinatorial Optimization Algorithms over Graphs](learning-co-over-graphs.md)

- **Paradigm:** Constructive
- **Problems:** Minimum Vertex Cover; Maximum Cut; Traveling Salesman Problem
- **Venue:** NIPS
- **Year:** 2017
- **First public:** 2017-04-05
- **Institutions:** Georgia Institute of Technology; Ant Financial

### [Neural Combinatorial Optimization with Reinforcement Learning](neural-combinatorial-optimization.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Knapsack Problem
- **Venue:** ICLR
- **Year:** 2017
- **First public:** 2016-11-29
- **Institutions:** Google Brain

### [Pointer Networks](pointer-networks.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Convex Hull; Delaunay Triangulation
- **Venue:** NeurIPS
- **Year:** 2015
- **First public:** 2015-06-10
- **Institutions:** Google Brain; University of California, Berkeley
<!-- GENERATED_PAPER_INDEX_END -->

## Adding a Specialist Solver

Add a paper here when its reported results rely on a model trained for one problem, even if the same architecture is evaluated on several problems through separate training runs.

1. Create a paper note in this directory.
2. Add YAML Front Matter using the same schema as the existing paper notes.
3. Set `scope: specialist` and assign one of the three solver paradigms using the operational definitions above.
4. Follow the structure of an existing paper note and link to original sources.
5. Open a pull request; the paper index above is generated automatically from the Front Matter.
