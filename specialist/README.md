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
### [Learning to Segment for Vehicle Routing Problems](l2seg.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2026
- **Accepted:** [2026-01-25](https://iclr.cc/Conferences/2026/Dates)
- **arXiv:** [2025-06-22](https://arxiv.org/abs/2507.01037)
- **Institutions:** Massachusetts Institute of Technology

### [Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver](icam.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Asymmetric Traveling Salesman Problem
- **Venue:** IEEE T-ITS
- **Year:** 2026
- **Accepted:** [2026](https://doi.org/10.1109/TITS.2026.3674538)
- **arXiv:** [2024-05-03](https://arxiv.org/abs/2405.01906)
- **Institutions:** Southern University of Science and Technology; City University of Hong Kong

### [Learning to Reduce Search Space for Generalizable Neural Routing Solver](l2r.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** KDD
- **Year:** 2026
- **Accepted:** [2025-11-23](https://kdd2026.kdd.org/research-track-call-for-papers/)
- **arXiv:** [2025-03-05](https://arxiv.org/abs/2503.03137)
- **Institutions:** Southern University of Science and Technology; City University of Hong Kong

### [Improving Generalization of Neural Combinatorial Optimization for Vehicle Routing Problems via Test-Time Projection Learning](ttpl.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2025
- **Accepted:** [2025-09-18](https://neurips.cc/Conferences/2025/CallForPapers)
- **arXiv:** [2025-06-03](https://arxiv.org/abs/2506.02392)
- **Institutions:** Southern University of Science and Technology

### [Rethinking Neural Combinatorial Optimization for Vehicle Routing Problems with Different Constraint Tightness Degrees](constraint-tightness.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** NeurIPS
- **Year:** 2025
- **Accepted:** [2025-09-18](https://neurips.cc/Conferences/2025/CallForPapers)
- **arXiv:** [2025-05-30](https://arxiv.org/abs/2505.24627)
- **Institutions:** Southern University of Science and Technology

### [Generation as Search Operator for Test-Time Scaling of Diffusion-Based Combinatorial Optimization](gensco.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** NeurIPS
- **Year:** 2025
- **Accepted:** [2025-09-18](https://neurips.cc/Conferences/2025/CallForPapers)
- **arXiv:** —
- **Institutions:** Shanghai Jiao Tong University

### [Learning to Insert for Constructive Neural Vehicle Routing Solver](l2c-insert.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2025
- **Accepted:** [2025-09-18](https://neurips.cc/Conferences/2025/CallForPapers)
- **arXiv:** [2025-05-20](https://arxiv.org/abs/2505.13904)
- **Institutions:** Southern University of Science and Technology

### [Neural Deconstruction Search for Vehicle Routing Problems](nds.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** TMLR
- **Year:** 2025
- **Accepted:** [2025-05-05](https://openreview.net/forum?id=bCmEP1Ltwq)
- **arXiv:** [2025-01-07](https://arxiv.org/abs/2501.03715)
- **Institutions:** TU Dortmund University

### [DGL: Dynamic Global-Local Information Aggregation for Scalable VRP Generalization with Self-Improvement Learning](dgl.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** IJCAI
- **Year:** 2025
- **Accepted:** [2025-04-28](https://2025.ijcai.org/important-dates/)
- **arXiv:** —
- **Institutions:** Nanyang Technological University

### [Adversarial Generative Flow Network for Solving Vehicle Routing Problems](agfn.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2025
- **Accepted:** [2025-01-22](https://iclr.cc/Conferences/2025/Dates)
- **arXiv:** [2025-03-03](https://arxiv.org/abs/2503.01931)
- **Institutions:** Nanyang Technological University

### [Rethinking Light Decoder-based Solvers for Vehicle Routing Problems](reld.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2025
- **Accepted:** [2025-01-22](https://iclr.cc/Conferences/2025/Dates)
- **arXiv:** [2025-03-02](https://arxiv.org/abs/2503.00753)
- **Institutions:** Nanyang Technological University

### [Boosting Neural Combinatorial Optimization for Large-Scale Vehicle Routing Problems](sil.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2025
- **Accepted:** [2025-01-22](https://iclr.cc/Conferences/2025/Dates)
- **arXiv:** —
- **Institutions:** Southern University of Science and Technology

### [PolyNet: Learning Diverse Solution Strategies for Neural Combinatorial Optimization](polynet.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2025
- **Accepted:** [2025-01-22](https://iclr.cc/Conferences/2025/Dates)
- **arXiv:** [2024-02-21](https://arxiv.org/abs/2402.14048)
- **Institutions:** TU Dortmund University

### [Ant Colony Sampling with GFlowNets for Combinatorial Optimization](gfacs.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** AISTATS
- **Year:** 2025
- **Accepted:** [2025-01-21](https://aistats.org/aistats2025/dates.html)
- **arXiv:** [2024-03-11](https://arxiv.org/abs/2403.07041)
- **Institutions:** KAIST; Mila

### [Distance-Aware Attention Reshaping for Enhancing Generalization of Neural Solvers](dar.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IEEE TNNLS
- **Year:** 2025
- **Accepted:** [2025](https://doi.org/10.1109/TNNLS.2025.3588209)
- **arXiv:** —
- **Institutions:** South China University of Technology; Victoria University of Wellington

### [Destroy and Repair Using Hyper-Graphs for Routing](drhg.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** AAAI
- **Year:** 2025
- **Accepted:** [2024-12-09](https://aaai.org/conference/aaai/aaai-25/)
- **arXiv:** [2025-02-22](https://arxiv.org/abs/2502.16170)
- **Institutions:** Southern University of Science and Technology

### [Fast T2T: Optimization Consistency Speeds Up Diffusion-Based Training-to-Testing Solving for Combinatorial Optimization](fast-t2t.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** NeurIPS
- **Year:** 2024
- **Accepted:** [2024-09-25](https://neurips.cc/Conferences/2024/CallForPapers)
- **arXiv:** [2025-02-05](https://arxiv.org/abs/2502.02941)
- **Institutions:** Shanghai Jiao Tong University

### [Learning to Handle Complex Constraints for Vehicle Routing Problems](pip.md)

- **Paradigm:** Constructive
- **Problems:** Vehicle Routing Problem with Time Windows; Orienteering Problem
- **Venue:** NeurIPS
- **Year:** 2024
- **Accepted:** [2024-09-25](https://neurips.cc/Conferences/2024/CallForPapers)
- **arXiv:** [2024-10-28](https://arxiv.org/abs/2410.21066)
- **Institutions:** Nanyang Technological University

### [UDC: A Unified Neural Divide-and-Conquer Framework for Large-Scale Combinatorial Optimization Problems](udc.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2024
- **Accepted:** [2024-09-25](https://neurips.cc/Conferences/2024/CallForPapers)
- **arXiv:** [2024-06-29](https://arxiv.org/abs/2407.00312)
- **Institutions:** Southern University of Science and Technology

### [Self-Improvement for Neural Combinatorial Optimization: Sample without Replacement, but Improvement](gumbeldore.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** TMLR
- **Year:** 2024
- **Accepted:** [2024-06](https://openreview.net/forum?id=agT8ojoH0X)
- **arXiv:** [2024-03-22](https://arxiv.org/abs/2403.15180)
- **Institutions:** German Cancer Research Center

### [Hierarchical Neural Constructive Solver for Real-world TSP Scenarios](hncs.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** KDD
- **Year:** 2024
- **Accepted:** [2024-05-16](https://www.kdd.org/kdd2024/research-track-call-for-papers/)
- **arXiv:** [2024-08-07](https://arxiv.org/abs/2408.03585)
- **Institutions:** National University of Singapore

### [Position: Rethinking Post-Hoc Search-Based Neural Approaches for Solving Large-Scale Traveling Salesman Problems](softdist.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** ICML
- **Year:** 2024
- **Accepted:** [2024-05-01](https://icml.cc/Conferences/2024/Dates)
- **arXiv:** [2024-06-02](https://arxiv.org/abs/2406.03503)
- **Institutions:** Microsoft Research Asia

### [DPN: Decoupling Partition and Navigation for Neural Solvers of Min-max Vehicle Routing Problems](dpn.md)

- **Paradigm:** Constructive
- **Problems:** Min-max Multiple Traveling Salesman Problem
- **Venue:** ICML
- **Year:** 2024
- **Accepted:** [2024-05-01](https://icml.cc/Conferences/2024/Dates)
- **arXiv:** [2024-05-27](https://arxiv.org/abs/2405.17272)
- **Institutions:** Southern University of Science and Technology

### [INViT: A Generalizable Routing Problem Solver with Invariant Nested View Transformer](invit.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICML
- **Year:** 2024
- **Accepted:** [2024-05-01](https://icml.cc/Conferences/2024/Dates)
- **arXiv:** [2024-02-04](https://arxiv.org/abs/2402.02317)
- **Institutions:** Shanghai Jiao Tong University

### [Towards Generalizable Neural Solvers for Vehicle Routing Problems via Ensemble with Transferable Local Policy](elg.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IJCAI
- **Year:** 2024
- **Accepted:** [2024-04-16](https://ijcai24.org/call-for-papers/index.html)
- **arXiv:** —
- **Institutions:** University of Science and Technology of China

### [Less Is More -- On the Importance of Sparsification for Transformers and Graph Neural Networks for TSP](less-is-more.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** arXiv
- **Year:** 2024
- **Accepted:** —
- **arXiv:** [2024-03-25](https://arxiv.org/abs/2403.17159)
- **Institutions:** Chalmers University of Technology

### [Efficient Neural Collaborative Search for Pickup and Delivery Problems](ncs.md)

- **Paradigm:** Improvement
- **Problems:** Pickup and Delivery Problem; Pickup and Delivery Problem with Time Windows
- **Venue:** IEEE TPAMI
- **Year:** 2024
- **Accepted:** [2024](https://doi.org/10.1109/TPAMI.2024.3450850)
- **arXiv:** —
- **Institutions:** Nanyang Technological University

### [ASP: Learn a Universal Neural Solver!](asp.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IEEE TPAMI
- **Year:** 2024
- **Accepted:** [2024](https://doi.org/10.1109/TPAMI.2024.3352096)
- **arXiv:** [2023-03-01](https://arxiv.org/abs/2303.00466)
- **Institutions:** Peking University

### [GLOP: Learning Global Partition and Local Construction for Solving Large-Scale Routing Problems in Real-Time](glop.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Asymmetric Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Prize Collecting Traveling Salesman Problem
- **Venue:** AAAI
- **Year:** 2024
- **Accepted:** [2023-12-09](https://aaai.org/conference/aaai/aaai-24/)
- **arXiv:** [2023-12-13](https://arxiv.org/abs/2312.08224)
- **Institutions:** Soochow University; Singapore Management University

### [T2T: From Distribution Learning in Training to Gradient Search in Testing for Combinatorial Optimization](t2t.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** —
- **Institutions:** Shanghai Jiao Tong University

### [Combinatorial Optimization with Policy Adaptation using Latent Space Search](compass.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** [2023-11-13](https://arxiv.org/abs/2311.13569)
- **Institutions:** InstaDeep

### [Learning to Search Feasible and Infeasible Regions of Routing Problems with Flexible Neural k-Opt](neuopt.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** [2023-10-27](https://arxiv.org/abs/2310.18264)
- **Institutions:** Nanyang Technological University

### [Neural Combinatorial Optimization with Heavy Decoder: Toward Large Scale Generalization](lehd.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** [2023-10-12](https://arxiv.org/abs/2310.07985)
- **Institutions:** Southern University of Science and Technology; City University of Hong Kong

### [DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization](deepaco.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Orienteering Problem; Prize Collecting Traveling Salesman Problem; Sequential Ordering Problem; Single Machine Total Weighted Tardiness Problem; Resource-Constrained Project Scheduling Problem; Multiple Knapsack Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** [2023-09-25](https://arxiv.org/abs/2309.14032)
- **Institutions:** Soochow University; Singapore Management University; Tsinghua University

### [Unsupervised Learning for Solving the Travelling Salesman Problem](utsp.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** [2023-03-19](https://arxiv.org/abs/2303.10538)
- **Institutions:** Cornell University

### [DIFUSCO: Graph-based Diffusion Solvers for Combinatorial Optimization](difusco.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** [2023-02-16](https://arxiv.org/abs/2302.08224)
- **Institutions:** Carnegie Mellon University

### [BQ-NCO: Bisimulation Quotienting for Efficient Neural Combinatorial Optimization](bq-nco.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2023
- **Accepted:** [2023-09-21](https://neurips.cc/Conferences/2023/CallForPapers)
- **arXiv:** [2023-01-09](https://arxiv.org/abs/2301.03313)
- **Institutions:** NAVER LABS Europe

### [Meta-SAGE: Scale Meta-Learning Scheduled Adaptation with Guided Exploration for Mitigating Scale Shift on Combinatorial Optimization](meta-sage.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICML
- **Year:** 2023
- **Accepted:** [2023-04-24](https://icml.cc/Conferences/2023/Dates)
- **arXiv:** [2023-06-05](https://arxiv.org/abs/2306.02688)
- **Institutions:** KAIST

### [Towards Omni-generalizable Neural Methods for Vehicle Routing Problems](omni-vrp.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** ICML
- **Year:** 2023
- **Accepted:** [2023-04-24](https://icml.cc/Conferences/2023/Dates)
- **arXiv:** [2023-05-31](https://arxiv.org/abs/2305.19587)
- **Institutions:** Nanyang Technological University

### [Generalize Learned Heuristics to Solve Large-scale Vehicle Routing Problems in Real-time](tam.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Traveling Salesman Problem
- **Venue:** ICLR
- **Year:** 2023
- **Accepted:** [2023-01-21](https://iclr.cc/Conferences/2023/Dates)
- **arXiv:** —
- **Institutions:** Alibaba Group

### [Select and Optimize: Learning to Solve Large-Scale TSP Instances](select-and-optimize.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** AISTATS
- **Year:** 2023
- **Accepted:** [2023-01-19](https://aistats.org/aistats2023/)
- **arXiv:** —
- **Institutions:** Hikvision Research Institute

### [Learning Feature Embedding Refiner for Solving Vehicle Routing Problems](fer.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IEEE TNNLS
- **Year:** 2024
- **Accepted:** [2023](https://doi.org/10.1109/TNNLS.2023.3285077)
- **arXiv:** —
- **Institutions:** Nanyang Technological University

### [H-TSP: Hierarchically Solving the Large-Scale Traveling Salesman Problem](h-tsp.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** AAAI
- **Year:** 2023
- **Accepted:** [2022-11-18](https://aaai-23.aaai.org/aaai23call/)
- **arXiv:** [2023-04-19](https://arxiv.org/abs/2304.09395)
- **Institutions:** Huazhong University of Science and Technology; Microsoft Research Asia

### [Pointerformer: Deep Reinforced Multi-Pointer Transformer for the Traveling Salesman Problem](pointerformer.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** AAAI
- **Year:** 2023
- **Accepted:** [2022-11-18](https://aaai-23.aaai.org/aaai23call/)
- **arXiv:** [2023-04-19](https://arxiv.org/abs/2304.09407)
- **Institutions:** Huazhong University of Science and Technology; Microsoft Research Asia

### [DIMES: A Differentiable Meta Solver for Combinatorial Optimization Problems](dimes.md)

- **Paradigm:** Constructive + Improvement
- **Problems:** Traveling Salesman Problem; Maximum Independent Set
- **Venue:** NeurIPS
- **Year:** 2022
- **Accepted:** [2022-09-14](https://neurips.cc/Conferences/2022/CallForPapers)
- **arXiv:** [2022-10-08](https://arxiv.org/abs/2210.04123)
- **Institutions:** Carnegie Mellon University

### [Simulation-Guided Beam Search for Neural Combinatorial Optimization](simulation-guided-beam-search.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Flexible Flow Shop Problem
- **Venue:** NeurIPS
- **Year:** 2022
- **Accepted:** [2022-09-14](https://neurips.cc/Conferences/2022/CallForPapers)
- **arXiv:** [2022-07-13](https://arxiv.org/abs/2207.06190)
- **Institutions:** Samsung SDS; Bielefeld University

### [Diffusion Models as Plug-and-Play Priors](diffusion-plug-and-play-priors.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** NeurIPS
- **Year:** 2022
- **Accepted:** [2022-09-14](https://neurips.cc/Conferences/2022/CallForPapers)
- **arXiv:** [2022-06-17](https://arxiv.org/abs/2206.09012)
- **Institutions:** Stony Brook University; Mila - Quebec AI Institute; Microsoft Research

### [Sym-NCO: Leveraging Symmetricity for Neural Combinatorial Optimization](sym-nco.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Prize Collecting Traveling Salesman Problem; Orienteering Problem
- **Venue:** NeurIPS
- **Year:** 2022
- **Accepted:** [2022-09-14](https://neurips.cc/Conferences/2022/CallForPapers)
- **arXiv:** [2022-05-26](https://arxiv.org/abs/2205.13209)
- **Institutions:** Korea Advanced Institute of Science and Technology

### [RBG: Hierarchically Solving Large-Scale Routing Problems in Logistic Systems via Reinforcement Learning](rbg.md)

- **Paradigm:** Improvement
- **Problems:** Large-scale Vehicle Routing Problem
- **Venue:** KDD
- **Year:** 2022
- **Accepted:** [2022-05-18](https://kdd.org/kdd2022/cfpResearch.html)
- **arXiv:** —
- **Institutions:** Tsinghua University; Beijing Tsingroc; Hitachi China Research and Development Corporation

### [Pareto Set Learning for Neural Multi-Objective Combinatorial Optimization](pareto-set-learning.md)

- **Paradigm:** Constructive
- **Problems:** Bi-objective Traveling Salesman Problem; Tri-objective Traveling Salesman Problem; Multi-objective Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2022
- **Accepted:** [2022-01-24](https://iclr.cc/Conferences/2022/Dates)
- **arXiv:** [2022-03-29](https://arxiv.org/abs/2203.15386)
- **Institutions:** City University of Hong Kong; University of Essex

### [Graph Neural Network Guided Local Search for the Traveling Salesperson Problem](graph-guided-local-search.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** ICLR
- **Year:** 2022
- **Accepted:** [2022-01-24](https://iclr.cc/Conferences/2022/Dates)
- **arXiv:** [2021-10-11](https://arxiv.org/abs/2110.05291)
- **Institutions:** University of Cambridge

### [Efficient Active Search for Combinatorial Optimization Problems](efficient-active-search.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Orienteering Problem; Prize Collecting Traveling Salesman Problem; Flexible Flow Shop Problem
- **Venue:** ICLR
- **Year:** 2022
- **Accepted:** [2022-01-24](https://iclr.cc/Conferences/2022/Dates)
- **arXiv:** [2021-06-09](https://arxiv.org/abs/2106.05126)
- **Institutions:** Bielefeld University; Samsung SDS

### [Deep Policy Dynamic Programming for Vehicle Routing Problems](deep-policy-dynamic-programming.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** CPAIOR
- **Year:** 2022
- **Accepted:** [2022](https://doi.org/10.1007/978-3-031-08011-1_14)
- **arXiv:** [2021-02-23](https://arxiv.org/abs/2102.11756)
- **Institutions:** University of Amsterdam; ORTEC

### [MAPDP: Cooperative Multi-Agent Reinforcement Learning to Solve Pickup and Delivery Problems](mapdp.md)

- **Paradigm:** Constructive
- **Problems:** Pickup and Delivery Problem
- **Venue:** AAAI
- **Year:** 2022
- **Accepted:** [2021-11-29](https://aaai.org/conference/aaai/aaai-22/)
- **arXiv:** —
- **Institutions:** Tsinghua University; Hitachi China Research and Development Corporation

### [Learning to Solve Routing Problems via Distributionally Robust Optimization](routing-dro.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** AAAI
- **Year:** 2022
- **Accepted:** [2021-11-29](https://aaai.org/conference/aaai/aaai-22/)
- **arXiv:** [2022-02-15](https://arxiv.org/abs/2202.07241)
- **Institutions:** Nanyang Technological University; Singapore Institute of Manufacturing Technology

### [Learning Collaborative Policies to Solve NP-hard Routing Problems](learning-collaborative-policies.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Prize Collecting Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2021
- **Accepted:** [2021-09-28](https://neurips.cc/Conferences/2021/CallForPapers)
- **arXiv:** [2021-10-26](https://arxiv.org/abs/2110.13987)
- **Institutions:** Korea Advanced Institute of Science and Technology

### [NeuroLKH: Combining Deep Learning Model with Lin-Kernighan-Helsgaun Heuristic for Solving the Traveling Salesman Problem](neurolkh.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Pickup and Delivery Problem; Vehicle Routing Problem with Time Windows
- **Venue:** NeurIPS
- **Year:** 2021
- **Accepted:** [2021-09-28](https://neurips.cc/Conferences/2021/CallForPapers)
- **arXiv:** [2021-10-15](https://arxiv.org/abs/2110.07983)
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University

### [Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer](dact.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2021
- **Accepted:** [2021-09-28](https://neurips.cc/Conferences/2021/CallForPapers)
- **arXiv:** [2021-10-06](https://arxiv.org/abs/2110.02544)
- **Institutions:** National University of Singapore; A*STAR; Shandong University; University of Electronic Science and Technology of China; Hong Kong University of Science and Technology

### [Learning to Delegate for Large-Scale Vehicle Routing](learning-to-delegate.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** NeurIPS
- **Year:** 2021
- **Accepted:** [2021-09-28](https://neurips.cc/Conferences/2021/CallForPapers)
- **arXiv:** [2021-07-08](https://arxiv.org/abs/2107.04139)
- **Institutions:** Massachusetts Institute of Technology

### [Matrix Encoding Networks for Neural Combinatorial Optimization](matrix-encoding-networks.md)

- **Paradigm:** Constructive
- **Problems:** Asymmetric Traveling Salesman Problem; Flexible Flow Shop Problem
- **Venue:** NeurIPS
- **Year:** 2021
- **Accepted:** [2021-09-28](https://neurips.cc/Conferences/2021/CallForPapers)
- **arXiv:** [2021-06-21](https://arxiv.org/abs/2106.11113)
- **Institutions:** Samsung SDS

### [Learning 3-opt Heuristics for Traveling Salesman Problem via Deep Reinforcement Learning](neural-3-opt.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** ACML
- **Year:** 2021
- **Accepted:** [2021-09-17](https://www.acml-conf.org/2021/)
- **arXiv:** —
- **Institutions:** Institute of Computing Technology; Chinese Academy of Sciences; University of Chinese Academy of Sciences; Zhongke Big Data Academy

### [Learning a Latent Search Space for Routing Problems Using Variational Autoencoders](latent-search-space-routing.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2021
- **Accepted:** [2021-01-14](https://iclr.cc/Conferences/2021/Dates)
- **arXiv:** —
- **Institutions:** Bielefeld University; University of Massachusetts Amherst

### [Learning Improvement Heuristics for Solving Routing Problems](learning-improvement-heuristics.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IEEE TNNLS
- **Year:** 2022
- **Accepted:** [2021](https://doi.org/10.1109/TNNLS.2021.3068828)
- **arXiv:** [2019-12-12](https://arxiv.org/abs/1912.05784)
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University; Singapore Institute of Manufacturing Technology

### [Multi-Decoder Attention Model with Embedding Glimpse for Solving Vehicle Routing Problems](multi-decoder-attention-model.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** AAAI
- **Year:** 2021
- **Accepted:** [2020-12-01](https://aaai.org/conference/aaai/aaai-21/)
- **arXiv:** [2020-12-19](https://arxiv.org/abs/2012.10638)
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University

### [Generalize a Small Pre-trained Model to Arbitrarily Large TSP Instances](att-gcn.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem
- **Venue:** AAAI
- **Year:** 2021
- **Accepted:** [2020-12-01](https://aaai.org/conference/aaai/aaai-21/)
- **arXiv:** —
- **Institutions:** The Chinese University of Hong Kong; Shenzhen

### [POMO: Policy Optimization with Multiple Optima for Reinforcement Learning](pomo.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2020
- **Accepted:** [2020-09-26](https://neurips.cc/Conferences/2020/Dates)
- **arXiv:** [2020-10-30](https://arxiv.org/abs/2010.16011)
- **Institutions:** Samsung SDS

### [Learn to Design the Heuristics for Vehicle Routing Problem](egate.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** IJCAI HSI Workshop
- **Year:** 2020
- **Accepted:** [2020-05-20](https://groups.google.com/g/search-list/c/XmRwwEX9laY)
- **arXiv:** [2020-02-20](https://arxiv.org/abs/2002.08539)
- **Institutions:** Nanjing University of Aeronautics and Astronautics

### [Efficiently Solving the Practical Vehicle Routing Problem: A Novel Joint Learning Approach](practical-vrp-joint-learning.md)

- **Paradigm:** Constructive
- **Problems:** Vehicle Routing Problem; Capacitated Vehicle Routing Problem
- **Venue:** KDD
- **Year:** 2020
- **Accepted:** [2020-05-15](https://www.kdd.org/kdd2020/calls/view/kdd-2020-call-for-research-papers.html)
- **arXiv:** —
- **Institutions:** Zhejiang Cainiao Supply Chain Management Co. Ltd; Alibaba Group

### [Neural Large Neighborhood Search for the Capacitated Vehicle Routing Problem](neural-large-neighborhood-search.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** ECAI
- **Year:** 2020
- **Accepted:** [2020-01-15](https://ecai2020.eu/call-for-papers/mainconference/)
- **arXiv:** [2019-11-21](https://arxiv.org/abs/1911.09539)
- **Institutions:** Bielefeld University

### [Step-Wise Deep Learning Models for Solving Routing Problems](step-wise-routing.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** IEEE TII
- **Year:** 2021
- **Accepted:** [2020](https://doi.org/10.1109/TII.2020.3031409)
- **arXiv:** —
- **Institutions:** Nanyang Technological University; National University of Singapore; Shandong University

### [A Graph Neural Network Assisted Monte Carlo Tree Search Approach to Traveling Salesman Problem](gnn-mcts-tsp.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** IEEE Access
- **Year:** 2020
- **Accepted:** [2020](https://doi.org/10.1109/ACCESS.2020.3000236)
- **arXiv:** —
- **Institutions:** Shanghai Jiao Tong University

### [A Learning-based Iterative Method for Solving Vehicle Routing Problems](learning-to-improve.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Split Delivery Vehicle Routing Problem
- **Venue:** ICLR
- **Year:** 2020
- **Accepted:** [2019-12-19](https://iclr.cc/Conferences/2020/Dates)
- **arXiv:** —
- **Institutions:** Ant Financial

### [Combinatorial Optimization by Graph Pointer Networks and Hierarchical Reinforcement Learning](graph-pointer-network-hrl.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Traveling Salesman Problem with Time Windows
- **Venue:** AAAI Workshop on Deep Learning on Graphs: Methodologies and Applications
- **Year:** 2020
- **Accepted:** [2019-12-06](https://deep-learning-graphs.bitbucket.io/dlg-aaai20/)
- **arXiv:** [2019-11-12](https://arxiv.org/abs/1911.04936)
- **Institutions:** Columbia University; Cornell University

### [Learning to Perform Local Rewriting for Combinatorial Optimization](neurewriter.md)

- **Paradigm:** Improvement
- **Problems:** Capacitated Vehicle Routing Problem; Job Shop Scheduling Problem
- **Venue:** NeurIPS
- **Year:** 2019
- **Accepted:** [2019-09-04](https://neurips.cc/Conferences/2019/Dates)
- **arXiv:** [2018-09-30](https://arxiv.org/abs/1810.00337)
- **Institutions:** Facebook AI Research; University of California, Berkeley

### [An Efficient Graph Convolutional Network Technique for the Travelling Salesman Problem](efficient-graph-convnet-tsp.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** arXiv
- **Year:** 2019
- **Accepted:** —
- **arXiv:** [2019-06-04](https://arxiv.org/abs/1906.01227)
- **Institutions:** Nanyang Technological University; Loyola Marymount University

### [A Deep Reinforcement Learning Algorithm Using Dynamic Attention Model for Vehicle Routing Problems](dynamic-am.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem
- **Venue:** ISICA
- **Year:** 2019
- **Accepted:** [2019](https://doi.org/10.1007/978-981-15-5577-0_51)
- **arXiv:** [2020-02-09](https://arxiv.org/abs/2002.03282)
- **Institutions:** Sun Yat-sen University

### [Attention, Learn to Solve Routing Problems!](attention-model.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Split Delivery Vehicle Routing Problem; Orienteering Problem; Prize Collecting Traveling Salesman Problem; Stochastic Prize Collecting Traveling Salesman Problem
- **Venue:** ICLR
- **Year:** 2019
- **Accepted:** [2018-12-22](https://iclr.cc/Conferences/2019/CallForPapers)
- **arXiv:** [2018-03-22](https://arxiv.org/abs/1803.08475)
- **Institutions:** University of Amsterdam; ORTEC; CIFAR

### [Reinforcement Learning for Solving the Vehicle Routing Problem](rl-vrp.md)

- **Paradigm:** Constructive
- **Problems:** Vehicle Routing Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2018
- **Accepted:** [2018-09-05](https://neurips.cc/Conferences/2018/Dates)
- **arXiv:** [2018-02-12](https://arxiv.org/abs/1802.04240)
- **Institutions:** Lehigh University

### [Learning Heuristics for the TSP by Policy Gradient](learning-heuristic.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem
- **Venue:** CPAIOR
- **Year:** 2018
- **Accepted:** [2018](https://doi.org/10.1007/978-3-319-93031-2_12)
- **arXiv:** —
- **Institutions:** Polytechnique Montreal; Element AI; HEC Montreal; CIRRELT

### [Learning Combinatorial Optimization Algorithms over Graphs](learning-co-over-graphs.md)

- **Paradigm:** Constructive
- **Problems:** Minimum Vertex Cover; Maximum Cut; Traveling Salesman Problem
- **Venue:** NIPS
- **Year:** 2017
- **Accepted:** [2017-09-04](https://neurips.cc/Conferences/2017/Dates)
- **arXiv:** [2017-04-05](https://arxiv.org/abs/1704.01665)
- **Institutions:** Georgia Institute of Technology; Ant Financial

### [Neural Combinatorial Optimization with Reinforcement Learning](neural-combinatorial-optimization.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Knapsack Problem
- **Venue:** ICLR
- **Year:** 2017
- **Accepted:** [2017-02-06](https://iclr.cc/archive/www/doku.php%3Fid%3Diclr2017%3Amain.html)
- **arXiv:** [2016-11-29](https://arxiv.org/abs/1611.09940)
- **Institutions:** Google Brain

### [Pointer Networks](pointer-networks.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Convex Hull; Delaunay Triangulation
- **Venue:** NeurIPS
- **Year:** 2015
- **Accepted:** [2015](https://neurips.cc/Conferences/2015/Dates)
- **arXiv:** [2015-06-09](https://arxiv.org/abs/1506.03134)
- **Institutions:** Google Brain; University of California, Berkeley
<!-- GENERATED_PAPER_INDEX_END -->

## Adding a Specialist Solver

Add a paper here when its reported results rely on a model trained for one problem, even if the same architecture is evaluated on several problems through separate training runs.

1. Create a paper note in this directory.
2. Add YAML Front Matter using the same schema as the existing paper notes.
3. Set `scope: specialist` and assign one of the three solver paradigms using the operational definitions above.
4. Follow the structure of an existing paper note and link to original sources.
5. Open a pull request; the paper index above is generated automatically from the Front Matter.
