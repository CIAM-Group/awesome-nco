# Neural Combinatorial Optimization：已发表论文核验与待添加清单

> 截止日期：**2026-11-16**。当前仓库：**504 篇笔记**。论文详情见各篇笔记，本文件记录发表核验与录入进度。

[统计结果](#audit-summary) · [现代方法](#modern-methods) · [综述与评测](#research-references) · [历史研究](#historical-papers) · [待核验](#pending-papers) · [已有覆盖](#existing-coverage) · [检索审计](#search-audit)

<a name="audit-summary"></a>

## 统计结果

在下述发表、场合与主题口径内，共 **836 篇**去重正式论文；**482 篇**已对应仓库笔记，**354 篇**待添加。

| 类别 | 符合口径的总数 | 仓库已覆盖 | 待添加 |
| --- | ---: | ---: | ---: |
| 现代方法、训练机制与理论（2015 年起） | 706 | 441 | 265 |
| 综述、评测与研究资源 | 41 | 22 | 19 |
| 早期神经优化及神经动力学方法 | 89 | 19 | 70 |
| **合计** | **836** | **482** | **354** |

另有 **41 篇待核验**与 **92 篇范围边界参考项**，均未计入正式总数。

[conference-163-2026-11-17 批次](../data/imports/conference-163-2026-11-17.json)：原定 163 篇，活动 140 篇，已完成全文复核 140 篇，用户指定待补 23 篇。

[iclr-neurips-icml-2026-11 批次](../data/imports/iclr-neurips-icml-2026-11.json)：原定 272 篇，活动 272 篇，已完成全文复核 272 篇，用户指定待补 0 篇。

覆盖统计仅计已完成全文复核的笔记；待复核草稿和用户指定待补项仍保留在待添加清单。待补材料及保全证据见[待补清单](conference-163-deferred-2026-11-17.md)。

此前“至少 310 篇”是初轮粗筛下界；当前数字按逐条记录、出版证据和仓库对应关系重算。总数仅适用于明确列出的场合、主题和检索协议，覆盖限制见文末。

## 纳入、排除与去重规则

1. **正式发表。** 须有正式会议论文集、期刊文章或出版社已上线的 Early Access / Article in Press 记录；仅 arXiv、投稿、接收公告和会议 workshop 不计。DOI 注册日期本身不作为首次发表日期。截止日是 11 月 16 日，不预计 11 月余下日期或 NeurIPS 2026 的接收论文。
2. **会议范围。** NeurIPS/NIPS、ICML、ICLR、AAAI、IJCAI、KDD、WWW、CVPR、ICCV、ECCV，以及明确相关的 INFOCOM、SIGCOMM 正式研究论文。AISTATS、UAI、ICAPS、CP/CPAIOR、ECAI、ACML、GECCO 等不自动纳入本次严格会议口径。
3. **期刊范围。** IEEE / IEEE-ACM Transactions 系列；按用户确认扩展至 JMLR、TMLR、Artificial Intelligence、JAIR、EJOR、INFORMS Journal on Computing、Operations Research，以及 Nature、Nature Machine Intelligence、Nature Communications、Science 中直接研究 NCO 的论文。该白名单是本次可复查的工作口径，不把“顶级”当作无边界的质量判断。IEEE Access、一般应用期刊和 Letters 不自动纳入。
4. **主题范围。** 神经网络、深度强化学习、学习型图模型或神经动力学直接构造、改进、搜索离散解，或直接引导组合求解器；包括路由、调度、packing、图优化、MIP、SAT/CSP、神经搜索及明确的离散布局。直接研究这些求解器的训练、理论、综述和评测分别列类。纯连续控制、模型预测后调用既有求解器、非神经 tabular RL、一般图分类/相似性估计不自动计入。仅让 LLM 生成算法代码的工作单列范围边界。
5. **去重单位。** 相同完整题名（含大小写、标点和明确拼写变体）、DOI 或已确认相同论文标识的版本合并；预印本与正式版本只计一次。相同题名的会议/期刊记录合并保留来源；不同题名的实质期刊扩展不靠题名相似度强行合并。
6. **与仓库对照。** 对照全部 504 篇现有题名及发表链接；已有笔记不重复列入待添加部分。Generalist/Specialist 需要确认是否共享同一模型跨问题，不能仅凭“多个测试问题”决定，因此清单先按问题领域排。

## 使用方式

- 待添加部分列尚未完成全文复核的论文；完成复核后运行 `npm run audit:sync`，条目会移入已有覆盖并重新计算数量。
- 机器可读 JSON 中的 `audit_id` 是稳定标识；`data/imports/` 将其对应到笔记 ID、路径和来源。
- 题名链接正式论文，已有覆盖部分直接链接仓库笔记。不要仅根据文章题名判断 Generalist/Specialist。

<a name="modern-methods"></a>

## 待添加：现代方法、训练与理论

共 **265 篇**。

### 路由与旅行商问题（54 篇）

- [ ] **M0001** [Elite Pattern Reinforcement for Vehicle Routing Problems](https://ojs.aaai.org/index.php/AAAI/article/view/40949) — AAAI 2026
- [ ] **M0002** [GRIP: Latent Field-Guided Graph Policy for Budget-Constrained Multi-Agent Routing](https://ojs.aaai.org/index.php/AAAI/article/view/40191) — AAAI 2026
- [ ] **M0015** [Deep Reinforcement Learning With Adaptive Enhanced Attention for CTSPs](https://ieeexplore.ieee.org/document/11433609/) — IEEE Transactions on Artificial Intelligence 2026
- [ ] **M0016** [Towards Generalizable Meta-Deep Reinforcement Learning Algorithm for Multiobjective Traveling Salesman Problems](https://ieeexplore.ieee.org/document/11181152/) — IEEE Transactions on Artificial Intelligence 2026
- [ ] **M0017** [Edge Filtering Attention Model With Depot-Neighbor Strategy for Multi-Depot Capacitated Arc Routing Problem](https://ieeexplore.ieee.org/document/11482515/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2026
- [ ] **M0018** [CMIP: Combining Constructive Model With Improvement Policy for Large-Scale Min-Max Multiple Traveling Salesman Problem](https://ieeexplore.ieee.org/document/11264504/) — IEEE Transactions on Intelligent Transportation Systems 2026
- [ ] **M0019** [Lifelong Learner: Discovering Versatile Neural Solvers for Vehicle Routing Problems](https://ieeexplore.ieee.org/document/11523155/) — IEEE Transactions on Intelligent Transportation Systems 2026
- [ ] **M0020** [Reinforcement Learning Approach for Traveling Salesman Problem With Drones in Dynamic Environment](https://ieeexplore.ieee.org/document/11585683/) — IEEE Transactions on Intelligent Transportation Systems 2026
- [ ] **M0021** [StructFormer: A Transformer-Based Multi-Structure Attention Model for Solving Routing Problems](https://ieeexplore.ieee.org/document/11603829/) — IEEE Transactions on Intelligent Transportation Systems 2026
- [ ] **M0022** [Vision-Assisted Foundation Model for Solving Multitask Vehicle Routing Problems](https://ieeexplore.ieee.org/document/11578301/) — IEEE Transactions on Neural Networks and Learning Systems 2026
- [ ] **M0023** [Heuristic-Augmented Attentions for the Electric Vehicle Routing Problem With Time Windows](https://ieeexplore.ieee.org/document/11397826/) — IEEE Transactions on Vehicular Technology 2026
- [ ] **M0030** [Learning to Handle Constrained Routing Problems From a Decoupling Perspective](https://doi.org/10.1145/3770855.3817954) — KDD 2026
- [ ] **M0031** [MoE-Pointer: Seq2Seq Reinforcement Learning for Dynamic Multi-Echelon Pickup-and-Delivery with Courier-Drone Relay](https://doi.org/10.1145/3770855.3818924) — KDD 2026
- [ ] **M0032** [See to Solve: A Geometry-Aware Vision-Language Agent for Real-World Routing Problem](https://doi.org/10.1145/3770855.3818894) — KDD 2026
- [ ] **M0036** [Emergency Scheduling of Aerial Vehicles via Graph Neural Neighborhood Search](https://ieeexplore.ieee.org/document/10838579/) — IEEE Transactions on Artificial Intelligence 2025
- [ ] **M0037** [Multiobjective Optimization for Traveling Salesman Problem: A Deep Reinforcement Learning Algorithm via Transfer Learning](https://ieeexplore.ieee.org/document/10754652/) — IEEE Transactions on Artificial Intelligence 2025
- [ ] **M0038** [GPCB Routing: Generative Pretrained Transformers-Based Printed Circuit Board Routing Method](https://ieeexplore.ieee.org/document/10734385/) — IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems 2025
- [ ] **M0039** [A Deep Reinforcement Learning-Based Adaptive Large Neighborhood Search for Capacitated Electric Vehicle Routing Problems](https://ieeexplore.ieee.org/document/10660531/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2025
- [ ] **M0040** [Exact and Deep Q-Network Assisted Swarm Intelligence Methods for Scheduling Multiobjective Heterogeneous Unmanned Surface Vehicles](https://ieeexplore.ieee.org/document/10559384/) — IEEE Transactions on Evolutionary Computation 2025
- [ ] **M0041** [A Neural Solver With Traversal-Based Feature Representation and Adjacent Attention for Capacitated Arc Routing Problem](https://ieeexplore.ieee.org/document/11182268/) — IEEE Transactions on Intelligent Transportation Systems 2025
- [ ] **M0042** [Multiobjective Vehicle Routing Optimization With Time Windows: A Hybrid Approach Using Deep Reinforcement Learning and NSGA-II](https://ieeexplore.ieee.org/document/10816276/) — IEEE Transactions on Intelligent Transportation Systems 2025
- [ ] **M0043** [Temporal and Spatial Attention-Based Reinforcement Learning for Vehicle Routing Problem With Mixed Backhauls and Late Penalties](https://ieeexplore.ieee.org/document/11112790/) — IEEE Transactions on Intelligent Transportation Systems 2025
- [ ] **M0044** [Neuro-Ins: A Learning-Based One-Shot Node Insertion for Dynamic Routing Problems](https://ieeexplore.ieee.org/document/11037764/) — IEEE Transactions on Knowledge and Data Engineering 2025
- [ ] **M0045** [Task Offloading in Internet of Vehicles: A DRL-Based Approach With Representation Learning for DAG Scheduling](https://ieeexplore.ieee.org/document/10848209/) — IEEE Transactions on Mobile Computing 2025
- [ ] **M0046** [Conditional Neural Heuristic for Multiobjective Vehicle Routing Problems](https://ieeexplore.ieee.org/document/10478025/) — IEEE Transactions on Neural Networks and Learning Systems 2025
- [ ] **M0047** [Deep Reinforcement Learning for Solving Vehicle Routing Problems With Backhauls](https://ieeexplore.ieee.org/document/10485273/) — IEEE Transactions on Neural Networks and Learning Systems 2025
- [ ] **M0048** [Reinforcement Learning-Based Nonautoregressive Solver for Traveling Salesman Problems](https://ieeexplore.ieee.org/document/10737904/) — IEEE Transactions on Neural Networks and Learning Systems 2025
- [ ] **M0049** [Solving Scalable Multiagent Routing Problems With Reinforcement Learning](https://ieeexplore.ieee.org/document/11099060/) — IEEE Transactions on Neural Networks and Learning Systems 2025
- [ ] **M0050** [Learning-Aided Neighborhood Search for Vehicle Routing Problems](https://ieeexplore.ieee.org/document/10938384/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2025
- [ ] **M0051** [Attention-Enhanced Deep Reinforcement Learning for Electric Vehicle Routing Optimization](https://ieeexplore.ieee.org/document/11016767/) — IEEE Transactions on Transportation Electrification 2025
- [ ] **M0057** [Enhancing Generalization in Large-Scale HCVRP: A Rank-Augmented Neural Solver](https://doi.org/10.1145/3711896.3736935) — KDD 2025
- [ ] **M0061** [Reinforcement Learning for Solving Colored Traveling Salesman Problems: An Entropy-Insensitive Attention Approach](https://ieeexplore.ieee.org/document/10684320/) — IEEE Transactions on Artificial Intelligence 2024
- [ ] **M0062** [A Twin Learning Framework for Traveling Salesman Problem Based on Autoencoder, Graph Filter, and Transfer Learning](https://ieeexplore.ieee.org/document/10115237/) — IEEE Transactions on Consumer Electronics 2024
- [ ] **M0063** [A Scalable and Adaptable Supervised Learning Approach for Solving the Traveling Salesman Problems](https://ieeexplore.ieee.org/document/10558731/) — IEEE Transactions on Intelligent Transportation Systems 2024
- [ ] **M0064** [Multi-Agent Deep Reinforcement Learning for Recharging-Considered Vehicle Scheduling Problem in Container Terminals](https://ieeexplore.ieee.org/document/10568385/) — IEEE Transactions on Intelligent Transportation Systems 2024
- [ ] **M0065** [Multi-Type Attention for Solving Multi-Depot Vehicle Routing Problems](https://ieeexplore.ieee.org/document/10568457/) — IEEE Transactions on Intelligent Transportation Systems 2024
- [ ] **M0069** [Neural TSP Solver with Progressive Distillation](https://ojs.aaai.org/index.php/AAAI/article/view/26432) — AAAI 2023
- [ ] **M0070** [SplitNet: A Reinforcement Learning Based Sequence Splitting Method for the MinMax Multiple Travelling Salesman Problem](https://ojs.aaai.org/index.php/AAAI/article/view/26049) — AAAI 2023
- [ ] **M0072** [A Privacy-Preserving Service Framework for Traveling Salesman Problem-Based Neural Combinatorial Optimization Network](https://ieeexplore.ieee.org/document/10157979/) — IEEE Transactions on Cloud Computing 2023
- [ ] **M0073** [A Deep Reinforcement Learning Based Real-Time Solution Policy for the Traveling Salesman Problem](https://ieeexplore.ieee.org/document/10077449/) — IEEE Transactions on Intelligent Transportation Systems 2023
- [ ] **M0074** [Learning Large Neighborhood Search for Vehicle Routing in Airport Ground Handling](https://ieeexplore.ieee.org/document/10054476/) — IEEE Transactions on Knowledge and Data Engineering 2023
- [ ] **M0075** [Solving Dynamic Traveling Salesman Problems With Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/9537638/) — IEEE Transactions on Neural Networks and Learning Systems 2023
- [ ] **M0078** [Neural large neighborhood search for routing problems](https://doi.org/10.1016/j.artint.2022.103786) — Artificial Intelligence 2022
- [ ] **M0079** [Neuro-Ising: Accelerating Large-Scale Traveling Salesman Problems via Graph Neural Network Guided Localized Ising Solvers](https://ieeexplore.ieee.org/document/9747927/) — IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems 2022
- [ ] **M0080** [Deep Reinforcement Learning for Combinatorial Optimization: Covering Salesman Problems](https://ieeexplore.ieee.org/document/9523517/) — IEEE Transactions on Cybernetics 2022
- [ ] **M0081** [Deep Reinforcement Learning for Solving the Heterogeneous Capacitated Vehicle Routing Problem](https://ieeexplore.ieee.org/document/9547060/) — IEEE Transactions on Cybernetics 2022
- [ ] **M0082** [Reinforcement Learning With Multiple Relational Attention for Solving Vehicle Routing Problems](https://ieeexplore.ieee.org/document/9478307/) — IEEE Transactions on Cybernetics 2022
- [ ] **M0083** [A Multi-Agent Reinforcement Learning Method With Route Recorders for Vehicle Routing in Supply Chain Management](https://ieeexplore.ieee.org/document/9714823/) — IEEE Transactions on Intelligent Transportation Systems 2022
- [ ] **M0084** [Deep Reinforcement Learning for the Electric Vehicle Routing Problem With Time Windows](https://ieeexplore.ieee.org/document/9520134/) — IEEE Transactions on Intelligent Transportation Systems 2022
- [ ] **M0086** [Reinforcement Learning from Optimization Proxy for Ride-Hailing Vehicle Relocation](https://doi.org/10.1613/jair.1.13794) — JAIR 2022
- [ ] **M0088** [A Hybrid of Deep Reinforcement Learning and Local Search for the Vehicle Routing Problems](https://ieeexplore.ieee.org/document/9141401/) — IEEE Transactions on Intelligent Transportation Systems 2021
- [ ] **M0089** [Solving Multi-Agent Routing Problems Using Deep Attention Mechanisms](https://ieeexplore.ieee.org/document/9151266/) — IEEE Transactions on Intelligent Transportation Systems 2021
- [ ] **M0090** [Reinforcement Learning for Route Optimization with Robustness Guarantees](https://www.ijcai.org/proceedings/2021/357) — IJCAI 2021
- [ ] **M0096** [Online Vehicle Routing With Neural Combinatorial Optimization and Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/8693516/) — IEEE Transactions on Intelligent Transportation Systems 2019

### 调度、任务分配与芯片布局（129 篇）

- [ ] **M0099** [A DeepSets-guided scheduling framework for total tardiness minimization in single-machine scheduling](https://www.sciencedirect.com/science/article/pii/S0377221726008672) — European Journal of Operational Research 2026
- [ ] **M0100** [A low-carbon resource-constrained project scheduling problem with limited three-dimensional workspaces and its hierarchical deep reinforcement learning approach](https://www.sciencedirect.com/science/article/pii/S0377221726001487) — European Journal of Operational Research 2026
- [ ] **M0101** [An evolutionary reinforcement learning framework for joint work package sizing and scheduling with uncertainties](https://www.sciencedirect.com/science/article/pii/S0377221726000457) — European Journal of Operational Research 2026
- [ ] **M0102** [Deep reinforcement learning for order-tote-robot coordination in multi-tote storage and retrieval systems with sequential picking stations](https://www.sciencedirect.com/science/article/pii/S0377221726005370) — European Journal of Operational Research 2026
- [ ] **M0103** [Deep Reinforcement Learning for path planning and storage policy in automated warehouses](https://www.sciencedirect.com/science/article/pii/S0377221726007253) — European Journal of Operational Research 2026
- [ ] **M0104** [Multi-objective green flexible job shop scheduling optimization based on constraint-aware transformer reinforcement learning](https://www.sciencedirect.com/science/article/pii/S0377221726004273) — European Journal of Operational Research 2026
- [ ] **M0105** [Reinforcement learning for joint scheduling in robotic mobile fulfillment systems](https://www.sciencedirect.com/science/article/pii/S0377221726006466) — European Journal of Operational Research 2026
- [ ] **M0106** [Solving the paint shop problem with flexible management of multi-lane buffers using reinforcement learning and action masking](https://www.sciencedirect.com/science/article/pii/S0377221725009841) — European Journal of Operational Research 2026
- [ ] **M0112** [Event-Driven Double Dueling Deep Q-Learning for Efficient Serverless Edge Function Offloading and Scheduling](https://ieeexplore.ieee.org/document/11563620/) — IEEE Transactions on Cloud Computing 2026
- [ ] **M0113** [Real-Time Adaptive Workflow Scheduling With Graph Learning and Transformer-Driven Reinforcement in Heterogeneous Clouds](https://ieeexplore.ieee.org/document/11291150/) — IEEE Transactions on Cloud Computing 2026
- [ ] **M0114** [Solving Human–Robot Collaborative Circular Disassembly Line Balancing Problem via Graph Neural Network-Enhanced Proximal Policy Optimization Algorithm](https://ieeexplore.ieee.org/document/11433703/) — IEEE Transactions on Computational Social Systems 2026
- [ ] **M0115** [NeuroSchedule2.0: A Novel GNN-Based Scheduling Method With RL-Based Preprocessing Optimization for High-Level Synthesis](https://ieeexplore.ieee.org/document/11372709/) — IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems 2026
- [ ] **M0116** [A Multiagent Transformer-Based Algorithm for Multitask Dynamic Scheduling With Constrained Machines](https://ieeexplore.ieee.org/document/11419132/) — IEEE Transactions on Cybernetics 2026
- [ ] **M0117** [A Spatiotemporal Graph Neural Network Based Deep Reinforcement Learning Method for Online Distributed Job-Shop Scheduling Problem](https://ieeexplore.ieee.org/document/11264594/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2026
- [ ] **M0118** [Clustering Based Neural Combinatorial Optimization for Scanning Path Planning of Heterogeneous Multi-Agent System](https://ieeexplore.ieee.org/document/11494373/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2026
- [ ] **M0119** [A Deep Reinforcement Learning Framework Assisted by Genetic Programming for Dynamic Flexible Job Shop Scheduling](https://ieeexplore.ieee.org/document/11317967/) — IEEE Transactions on Evolutionary Computation 2026
- [ ] **M0120** [A Heterogeneous Graph Reinforcement Learning Framework With Question-Aware Neighborhood Aggregation and Interoption Prompt Attention for Dynamic Flexible Job Shop Scheduling Problem](https://ieeexplore.ieee.org/document/11354147/) — IEEE Transactions on Industrial Informatics 2026
- [ ] **M0121** [A Transformer-Initialized Dual-Population Evolution for Large-Scale Task Scheduling in Heterogeneous Distributed Systems](https://ieeexplore.ieee.org/document/11346020/) — IEEE Transactions on Industrial Informatics 2026
- [ ] **M0122** [Knowledge Guided DRL for Intelligent Reconfiguration and Scheduling in Customized and Personalized Manufacturing Workshop](https://ieeexplore.ieee.org/document/11195724/) — IEEE Transactions on Industrial Informatics 2026
- [ ] **M0123** [Two-Stage Optimization of PCBA Placement Route Schedule Based on Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/11192731/) — IEEE Transactions on Industrial Informatics 2026
- [ ] **M0124** [AEDS: An Affinity-Driven Efficient DRL-Based Task Scheduling Framework for Edge Computing](https://ieeexplore.ieee.org/document/11155212/) — IEEE Transactions on Mobile Computing 2026
- [ ] **M0125** [Hybrid Computing of Decentralized Applications in Edge Web 3.0: A Scheduling Strategy via Decision Transformer](https://ieeexplore.ieee.org/document/11399928/) — IEEE Transactions on Mobile Computing 2026
- [ ] **M0126** [Multi-Layer Scheduling in Gig Platforms Using a Generative Diffusion Model With Duality Guidance](https://ieeexplore.ieee.org/document/11176145/) — IEEE Transactions on Mobile Computing 2026
- [ ] **M0127** [Optimization of Task Scheduling Strategy With Timing and Data Dependencies in VEC Based on Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/11304528/) — IEEE Transactions on Mobile Computing 2026
- [ ] **M0128** [Two-Level Pareto-Based Hierarchical Reinforcement Learning for Dynamic Multi-Objective Scheduling in Semiconductor Fabs](https://ieeexplore.ieee.org/document/11569966/) — IEEE Transactions on Semiconductor Manufacturing 2026
- [ ] **M0129** [A Hierarchical GNN-Based Multi-Agent Framework for Workflow Scheduling in Hybrid Clouds Considering Privacy Constraints](https://ieeexplore.ieee.org/document/11478352/) — IEEE Transactions on Services Computing 2026
- [ ] **M0130** [A Search Strategy With Graph Attention Networks and Neighborhood Search Features for Dynamic Flexible Job Shop Scheduling](https://ieeexplore.ieee.org/document/11353239/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026
- [ ] **M0131** [Deep Reinforcement Learning Using Multiview Graph Attention Mechanisms for Flexible Job Shop Scheduling](https://ieeexplore.ieee.org/document/11575116/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026
- [ ] **M0132** [Distributed Flexible Job Shop Scheduling With Heterogeneous Transportation Resources Constraints via Deep Reinforcement Learning and Graph Neural Network](https://ieeexplore.ieee.org/document/11367629/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026
- [ ] **M0133** [Multi-Agent Flexible Job Shop Scheduling by Deep Learning on Graphs With Evolutionary Neural Topology](https://ieeexplore.ieee.org/document/11391556/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026
- [ ] **M0134** [Real-Time Scheduling for Energy-Efficient Distributed Hybrid Flow-Shop With Evolution Strategies-Based Multiple Graph Neural Networks](https://ieeexplore.ieee.org/document/11220952/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026
- [ ] **M0135** [Scheduling Dual-Arm Cluster Tools With Multifunctional Process Modules Using Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/11398812/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026
- [ ] **M0136** [GAT-HDRL: Hierarchical Deep Reinforcement Learning With Graph Attention Network for Real-Time Scheduling of Satellite Task Flows](https://ieeexplore.ieee.org/document/11264375/) — IEEE Transactions on Vehicular Technology 2026
- [ ] **M0138** [An Improving Column Is All You Need: Enhancing Column Generation for Parallel Machine Scheduling via Transformers](https://pubsonline.informs.org/doi/10.1287/ijoc.2024.1005) — INFORMS Journal on Computing 2026
- [ ] **M0139** [EDA Job Scheduling Using Reinforcement Learning with Adaptive Macro Actions](https://doi.org/10.1145/3770855.3818390) — KDD 2026
- [ ] **M0141** [Generalizing Beyond Suboptimality: Offline Reinforcement Learning Learns Effective Scheduling through Random Solutions](https://openreview.net/forum?id=4vVhm4817Q) — TMLR 2026
- [ ] **M0143** [Deep reinforcement learning for solving the stochastic e-waste collection problem](https://www.sciencedirect.com/science/article/pii/S0377221725003182) — European Journal of Operational Research 2025
- [ ] **M0147** [Deep Reinforcement Learning and Edge Computing for Multisatellite On-Orbit Task Scheduling](https://ieeexplore.ieee.org/document/11051113/) — IEEE Transactions on Aerospace and Electronic Systems 2025
- [ ] **M0148** [A Hierarchical Multi-Action Deep Reinforcement Learning Method for Dynamic Distributed Job-Shop Scheduling Problem With Job Arrivals](https://ieeexplore.ieee.org/document/10488144/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0149** [A Learning-Based Assembly Sequence Planning Method Using Neural Combinatorial Optimization With Satisfactory Generalization Ability](https://ieeexplore.ieee.org/document/10752093/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0150** [An Adaptive Meta-Reinforcement Learning Framework for Dynamic Flexible Job Shop Scheduling](https://ieeexplore.ieee.org/document/11222732/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0151** [DL-DRL: A Double-Level Deep Reinforcement Learning Approach for Large-Scale Task Scheduling of Multi-UAV](https://ieeexplore.ieee.org/document/10430091/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0152** [Dynamic Scheduling With Task Migration in Cloud Manufacturing Using Hybrid Federated Deep Reinforcement Learning and Graph Neural Network Model](https://ieeexplore.ieee.org/document/10969813/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0153** [Graph-Based Imitation Learning for Real-Time Job Shop Dispatcher](https://ieeexplore.ieee.org/document/10744209/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0154** [Hybrid Task Scheduling in Cloud Manufacturing With Sparse-Reward Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10459076/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0155** [Noncyclic Scheduling of Cluster Tools Using Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/11245603/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0156** [Scheduling Cluster Tools for Concurrent Processing: Deep Reinforcement Learning With Adaptive Search](https://ieeexplore.ieee.org/document/10530232/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0157** [A Graph-Based Deep Reinforcement Learning Model for Task Scheduling on Heterogeneous Resource-Elastic Management of Resource Pool](https://ieeexplore.ieee.org/document/11202232/) — IEEE Transactions on Cloud Computing 2025
- [ ] **M0158** [DRKC: Deep Reinforcement Learning Enhanced Microservice Scheduling on Kubernetes Clusters in Cloud-Edge Environment](https://ieeexplore.ieee.org/document/11214429/) — IEEE Transactions on Cloud Computing 2025
- [ ] **M0159** [ReflexPilot: Startup-Aware Dependent Task Scheduling Based on Deep Reinforcement Learning for Edge-Cloud Collaborative Computing](https://ieeexplore.ieee.org/document/10943261/) — IEEE Transactions on Cloud Computing 2025
- [ ] **M0160** [Cost and Makespan-Aware Task Scheduling With Deep Reinforcement Learning in Multicloud Environments](https://ieeexplore.ieee.org/document/10955421/) — IEEE Transactions on Computational Social Systems 2025
- [ ] **M0161** [RCM: A Neural Policy Model With Reconstruction Mechanism to Construct a Solution for the Agile Satellite Scheduling Problem](https://ieeexplore.ieee.org/document/10903990/) — IEEE Transactions on Cybernetics 2025
- [ ] **M0162** [Deep Reinforcement Learning Assisted Genetic Programming Ensemble Hyper-Heuristics for Dynamic Scheduling of Container Port Trucks](https://ieeexplore.ieee.org/document/10478109/) — IEEE Transactions on Evolutionary Computation 2025
- [ ] **M0163** [Evolutionary Trainer-Based Deep Q -Network for Dynamic Flexible Job-Shop Scheduling](https://ieeexplore.ieee.org/document/10439992/) — IEEE Transactions on Evolutionary Computation 2025
- [ ] **M0164** [GTSNet: A Generalized Traffic Scheduler for Time-Sensitive Networking Based on Graph Neural Network](https://ieeexplore.ieee.org/document/10691653/) — IEEE Transactions on Industrial Informatics 2025
- [ ] **M0165** [Integrated Scheduling Optimization for Automated Container Terminal: A Reinforcement Learning-Based Approach](https://ieeexplore.ieee.org/document/10981459/) — IEEE Transactions on Intelligent Transportation Systems 2025
- [ ] **M0166** [Unified Scheduling Model for High-Speed Train Timetable Optimization and Rescheduling Based on Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10923657/) — IEEE Transactions on Intelligent Transportation Systems 2025
- [ ] **M0167** [AFAS: Arbitrary-Freedom Adaptive Scheduling for Multiworkflow Cloud Computing via Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10985890/) — IEEE Transactions on Network and Service Management 2025
- [ ] **M0168** [A Reinforcement Learning Control Framework Based on Scalable Graph Transformer for Large-Scale Fuzzy Job Shop Scheduling Problems](https://ieeexplore.ieee.org/document/11016935/) — IEEE Transactions on Neural Networks and Learning Systems 2025
- [ ] **M0169** [Uncertain Interruptibility Multiobjective Flexible Job Shop via Deep Reinforcement Learning Based on Heterogeneous Graph Self-Attention](https://ieeexplore.ieee.org/document/11084978/) — IEEE Transactions on Neural Networks and Learning Systems 2025
- [ ] **M0170** [Deep Reinforcement Learning for Scheduling Applications in Serverless and Serverful Hybrid Computing Environments](https://ieeexplore.ieee.org/document/10832542/) — IEEE Transactions on Services Computing 2025
- [ ] **M0171** [TF-DDRL: A Transformer-Enhanced Distributed DRL Technique for Scheduling IoT Applications in Edge and Cloud Computing Environments](https://ieeexplore.ieee.org/document/10836729/) — IEEE Transactions on Services Computing 2025
- [ ] **M0172** [A Bidding-Based Deep Reinforcement Learning Approach for Multi-Agent Job Shop Scheduling Problem](https://ieeexplore.ieee.org/document/11029239/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2025
- [ ] **M0173** [A Co-Evolution Algorithm With Dueling Reinforcement Learning Mechanism for the Energy-Aware Distributed Heterogeneous Flexible Flow-Shop Scheduling Problem](https://ieeexplore.ieee.org/document/10812344/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2025
- [ ] **M0174** [Graph-Based Dual-Agent Deep Reinforcement Learning for Dynamic Human–Machine Hybrid Reconfiguration Manufacturing Scheduling](https://ieeexplore.ieee.org/document/11180937/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2025
- [ ] **M0175** [Real-Time Scheduling for Flexible Job Shop With AGVs Using Multiagent Reinforcement Learning and Efficient Action Decoding](https://ieeexplore.ieee.org/document/10829984/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2025
- [ ] **M0184** [Dual Operation Aggregation Graph Neural Networks for Solving Flexible Job-Shop Scheduling Problem with Reinforcement Learning](https://doi.org/10.1145/3696410.3714616) — WWW 2025
- [ ] **M0186** [An actor-critic algorithm with policy gradients to solve the job shop scheduling problem using deep double recurrent agents](https://www.sciencedirect.com/science/article/pii/S0377221723005957) — European Journal of Operational Research 2024
- [ ] **M0187** [Container port truck dispatching optimization using Real2Sim based deep reinforcement learning](https://www.sciencedirect.com/science/article/pii/S0377221723008792) — European Journal of Operational Research 2024
- [ ] **M0191** [Deep Reinforcement Learning-Based Approach With Varying-Scale Generalization for the Earth Observation Satellite Scheduling Problem Considering Resource Consumptions and Supplements](https://ieeexplore.ieee.org/document/10475401/) — IEEE Transactions on Aerospace and Electronic Systems 2024
- [ ] **M0192** [A DRL-Based Reactive Scheduling Policy for Flexible Job Shops With Random Job Arrivals](https://ieeexplore.ieee.org/document/10123416/) — IEEE Transactions on Automation Science and Engineering 2024
- [ ] **M0193** [A Reinforcement Learning Based Large-Scale Refinery Production Scheduling Algorithm](https://ieeexplore.ieee.org/document/10285719/) — IEEE Transactions on Automation Science and Engineering 2024
- [ ] **M0194** [Double DQN-Based Coevolution for Green Distributed Heterogeneous Hybrid Flowshop Scheduling With Multiple Priorities of Jobs](https://ieeexplore.ieee.org/document/10304305/) — IEEE Transactions on Automation Science and Engineering 2024
- [ ] **M0195** [Federated Deep Reinforcement Learning for Task Scheduling in Heterogeneous Autonomous Robotic System](https://ieeexplore.ieee.org/document/9950249/) — IEEE Transactions on Automation Science and Engineering 2024
- [ ] **M0196** [Stochastic Economic Lot Scheduling via Self-Attention Based Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10054449/) — IEEE Transactions on Automation Science and Engineering 2024
- [ ] **M0197** [A DRL-Based Service Offloading Approach Using DAG for Edge Computational Orchestration](https://ieeexplore.ieee.org/document/9756415/) — IEEE Transactions on Computational Social Systems 2024
- [ ] **M0198** [Edge Generation Scheduling for DAG Tasks Using Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10382409/) — IEEE Transactions on Computers 2024
- [ ] **M0199** [Flow-Shop Scheduling Problem With Batch Processing Machines via Deep Reinforcement Learning for Industrial Internet of Things](https://ieeexplore.ieee.org/document/10540330/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2024
- [ ] **M0200** [Intelligent Scheduling for Group Distributed Manufacturing Systems: Harnessing Deep Reinforcement Learning in Cloud-Edge Cooperation](https://ieeexplore.ieee.org/document/10414284/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2024
- [ ] **M0201** [A Knowledge-Guided End-to-End Optimization Framework Based on Reinforcement Learning for Flow Shop Scheduling](https://ieeexplore.ieee.org/document/10143317/) — IEEE Transactions on Industrial Informatics 2024
- [ ] **M0202** [Deep Reinforcement Learning-Driven Scheduling in Multijob Serial Lines: A Case Study in Automotive Parts Assembly](https://ieeexplore.ieee.org/document/10210628/) — IEEE Transactions on Industrial Informatics 2024
- [ ] **M0203** [Dynamic Job-Shop Scheduling via Graph Attention Networks and Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10477770/) — IEEE Transactions on Industrial Informatics 2024
- [ ] **M0204** [Large-Scale Dynamic Scheduling for Flexible Job-Shop With Random Arrivals of New Jobs by Hierarchical Reinforcement Learning](https://ieeexplore.ieee.org/document/10114974/) — IEEE Transactions on Industrial Informatics 2024
- [ ] **M0205** [Deep Reinforcement Learning for Channel Traffic Scheduling in Dry Bulk Export Terminals](https://ieeexplore.ieee.org/document/10618995/) — IEEE Transactions on Intelligent Transportation Systems 2024
- [ ] **M0206** [DMITS: Dependency and Mobility-Aware Intelligent Task Scheduling in Socially-Enabled VFC Based on Federated DRL Approach](https://ieeexplore.ieee.org/document/10618900/) — IEEE Transactions on Intelligent Transportation Systems 2024
- [ ] **M0207** [Reinforcement Learning for Scalable Train Timetable Rescheduling With Graph Representation](https://ieeexplore.ieee.org/document/10433936/) — IEEE Transactions on Intelligent Transportation Systems 2024
- [ ] **M0208** [GA-DRL: Graph Neural Network-Augmented Deep Reinforcement Learning for DAG Task Scheduling Over Dynamic Vehicular Clouds](https://ieeexplore.ieee.org/document/10497174/) — IEEE Transactions on Network and Service Management 2024
- [ ] **M0209** [A Reinforcement Learning Approach for Flexible Job Shop Scheduling Problem With Crane Transportation and Setup Times](https://ieeexplore.ieee.org/document/9913668/) — IEEE Transactions on Neural Networks and Learning Systems 2024
- [ ] **M0210** [Flexible Job Shop Scheduling via Dual Attention Network-Based Reinforcement Learning](https://ieeexplore.ieee.org/document/10246328/) — IEEE Transactions on Neural Networks and Learning Systems 2024
- [ ] **M0211** [Multi-Agent Deep Reinforcement Learning Framework for Renewable Energy-Aware Workflow Scheduling on Distributed Cloud Data Centers](https://ieeexplore.ieee.org/document/10417832/) — IEEE Transactions on Parallel and Distributed Systems 2024
- [ ] **M0212** [Latency-Aware Container Scheduling in Edge Cluster Upgrades: A Deep Reinforcement Learning Approach](https://ieeexplore.ieee.org/document/10509802/) — IEEE Transactions on Services Computing 2024
- [ ] **M0213** [Multi-Objective DAG Task Offloading in MEC Environment Based on Federated DQN With Automated Hyperparameter Optimization](https://ieeexplore.ieee.org/document/10713971/) — IEEE Transactions on Services Computing 2024
- [ ] **M0214** [A Deep Reinforcement Learning-Based Preemptive Approach for Cost-Aware Cloud Job Scheduling](https://ieeexplore.ieee.org/document/10214311/) — IEEE Transactions on Sustainable Computing 2024
- [ ] **M0215** [Co-Evolution With Deep Reinforcement Learning for Energy-Aware Distributed Heterogeneous Flexible Job Shop Scheduling](https://ieeexplore.ieee.org/document/10242078/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2024
- [ ] **M0216** [Deep Reinforcement Learning With a Look-Ahead Search for Robotic Cell Scheduling](https://ieeexplore.ieee.org/document/10274095/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2024
- [ ] **M0217** [Generalized Model and Deep Reinforcement Learning-Based Evolutionary Method for Multitype Satellite Observation Scheduling](https://ieeexplore.ieee.org/document/10399872/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2024
- [ ] **M0218** [Learning to Construct a Solution for the Agile Satellite Scheduling Problem With Time-Dependent Transition Times](https://ieeexplore.ieee.org/document/10589717/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2024
- [ ] **M0223** [Deep learning-driven scheduling algorithm for a single machine problem minimizing the total tardiness](https://www.sciencedirect.com/science/article/pii/S0377221722008918) — European Journal of Operational Research 2023
- [ ] **M0224** [Reinforcement learning for multi-item retrieval in the puzzle-based storage system](https://www.sciencedirect.com/science/article/pii/S0377221722002661) — European Journal of Operational Research 2023
- [ ] **M0229** [A Fast Approach to Satellite Range Rescheduling Using Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10256124/) — IEEE Transactions on Aerospace and Electronic Systems 2023
- [ ] **M0230** [Event-Triggered Deep Reinforcement Learning for Dynamic Task Scheduling in Multisatellite Resource Allocation](https://ieeexplore.ieee.org/document/9998480/) — IEEE Transactions on Aerospace and Electronic Systems 2023
- [ ] **M0231** [Reinforcement Learning for the Agile Earth-Observing Satellite Scheduling Problem](https://ieeexplore.ieee.org/document/10058020/) — IEEE Transactions on Aerospace and Electronic Systems 2023（Early Access）
- [ ] **M0232** [Scalable Scheduling of Semiconductor Packaging Facilities Using Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/9635709/) — IEEE Transactions on Cybernetics 2023
- [ ] **M0233** [Deep Reinforcement Learning Based Optimization Algorithm for Permutation Flow-Shop Scheduling](https://ieeexplore.ieee.org/document/9594768/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2023
- [ ] **M0234** [A Deep Reinforcement Learning Framework Based on an Attention Mechanism and Disjunctive Graph Embedding for the Job-Shop Scheduling Problem](https://ieeexplore.ieee.org/document/9757835/) — IEEE Transactions on Industrial Informatics 2023
- [ ] **M0235** [Distributed Multiagent Deep Reinforcement Learning for Multiline Dynamic Bus Timetable Optimization](https://ieeexplore.ieee.org/document/9733265/) — IEEE Transactions on Industrial Informatics 2023
- [ ] **M0236** [Flexible Job-Shop Scheduling via Graph Neural Network and Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/9826438/) — IEEE Transactions on Industrial Informatics 2023
- [ ] **M0237** [Dynamic Job-Shop Scheduling Problems Using Graph Neural Network and Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10176351/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2023
- [ ] **M0238** [Dynamic Parallel Machine Scheduling With Deep Q-Network](https://ieeexplore.ieee.org/document/10185153/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2023
- [ ] **M0239** [Task Scheduling Under a Novel Framework for Data Relay Satellite Network via Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10004750/) — IEEE Transactions on Vehicular Technology 2023
- [ ] **M0241** [GAL-VNE: Solving the VNE Problem with Global Reinforcement Learning and Local One-Shot Neural Prediction](https://doi.org/10.1145/3580305.3599358) — KDD 2023
- [ ] **M0242** [Permutation flow shop scheduling with multiple lines and demand plans using reinforcement learning](https://www.sciencedirect.com/science/article/pii/S0377221721006743) — European Journal of Operational Research 2022
- [ ] **M0243** [Real-Time Scheduling for Dynamic Partial-No-Wait Multiobjective Flexible Job Shop by Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/9521514/) — IEEE Transactions on Automation Science and Engineering 2022
- [ ] **M0244** [Distributed Real-Time Scheduling in Cloud Manufacturing by Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/9783015/) — IEEE Transactions on Industrial Informatics 2022
- [ ] **M0245** [Adaptive Metro Service Schedule and Train Composition With a Proximal Policy Optimization Approach Based on Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/9376690/) — IEEE Transactions on Intelligent Transportation Systems 2022
- [ ] **M0246** [Dynamic Scheduling for Stochastic Edge-Cloud Computing Environments Using A3C Learning and Residual Recurrent Neural Networks](https://ieeexplore.ieee.org/document/9169832/) — IEEE Transactions on Mobile Computing 2022
- [ ] **M0247** [DRAS: Deep Reinforcement Learning for Cluster Scheduling in High Performance Computing](https://ieeexplore.ieee.org/document/9894371/) — IEEE Transactions on Parallel and Distributed Systems 2022
- [ ] **M0248** [GOSH: Task Scheduling Using Deep Surrogate Models in Fog Computing Environments](https://ieeexplore.ieee.org/document/9656655/) — IEEE Transactions on Parallel and Distributed Systems 2022
- [ ] **M0249** [Performance and Cost-Efficient Spark Job Scheduling Based on Deep Reinforcement Learning in Cloud Computing Environments](https://ieeexplore.ieee.org/document/9599497/) — IEEE Transactions on Parallel and Distributed Systems 2022
- [ ] **M0250** [A Generic Markov Decision Process Model and Reinforcement Learning Method for Scheduling Agile Earth Observation Satellites](https://ieeexplore.ieee.org/document/9200466/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2022
- [ ] **M0257** [Deep Reinforcement Learning Enhanced Greedy Algorithm for Online Scheduling of Batched Tasks in Cloud in Cloud HPC Systems](https://ieeexplore.ieee.org/document/9664254/) — IEEE Transactions on Parallel and Distributed Systems 2021（Early Access）
- [ ] **M0258** [DL2: A Deep Learning-Driven Scheduler for Deep Learning Clusters](https://ieeexplore.ieee.org/document/9328612/) — IEEE Transactions on Parallel and Distributed Systems 2021
- [ ] **M0259** [A Multi-Graph Attributed Reinforcement Learning based Optimization Algorithm for Large-scale Hybrid Flow Shop Scheduling Problem](https://doi.org/10.1145/3447548.3467135) — KDD 2021
- [ ] **M0260** [A graph placement methodology for fast chip design](https://doi.org/10.1038/s41586-021-03544-w) — Nature 2021
- [ ] **M0263** [A Reinforcement Learning Approach to Robust Scheduling of Semiconductor Manufacturing Facilities](https://ieeexplore.ieee.org/document/8946870/) — IEEE Transactions on Automation Science and Engineering 2020（Early Access）
- [ ] **M0264** [Deep Learning-Based Dynamic Scheduling for Semiconductor Manufacturing With High Uncertainty of Automated Material Handling System Capability](https://ieeexplore.ieee.org/document/8954636/) — IEEE Transactions on Semiconductor Manufacturing 2020
- [ ] **M0265** [Scalable Parallel Task Scheduling for Autonomous Driving Using Multi-Task Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/9219229/) — IEEE Transactions on Vehicular Technology 2020
- [ ] **M0269** [Smart Manufacturing Scheduling With Edge Computing Using Multiclass Deep Q Network](https://ieeexplore.ieee.org/document/8676376/) — IEEE Transactions on Industrial Informatics 2019
- [ ] **M0270** [A Double Deep Q-Learning Model for Energy-Efficient Edge Scheduling](https://ieeexplore.ieee.org/document/8449105/) — IEEE Transactions on Services Computing 2019

### 装箱、背包与空间排列（9 篇）

- [ ] **M0278** [One4Many-StablePacker: An Efficient Deep Reinforcement Learning Framework for the 3D Bin Packing Problem](https://www.ijcai.org/proceedings/2026/479) — IJCAI 2026
- [ ] **M0280** [A Learning-Based Two-Stage Bidirectional Packing Framework for 3D Packing Problems](https://ieeexplore.ieee.org/document/11153660/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0281** [Tree Search Reinforcement Learning for Two-Dimensional Cutting Stock Problem With Complex Constraints](https://ieeexplore.ieee.org/document/10680425/) — IEEE Transactions on Automation Science and Engineering 2025
- [ ] **M0285** [Heuristics Integrated Deep Reinforcement Learning for Online 3D Bin Packing](https://ieeexplore.ieee.org/document/10018146/) — IEEE Transactions on Automation Science and Engineering 2024
- [ ] **M0286** [Learning to Solve 3-D Bin Packing Problem via Deep Reinforcement Learning and Constraint Programming](https://ieeexplore.ieee.org/document/9606618/) — IEEE Transactions on Cybernetics 2023
- [ ] **M0287** [Machine Learning–Supported Prediction of Dual Variables for the Cutting Stock Problem with an Application in Stabilized Column Generation](https://pubsonline.informs.org/doi/10.1287/ijoc.2023.1277) — INFORMS Journal on Computing 2023
- [ ] **M0288** [Provably Good Solutions to the Knapsack Problem via Neural Networks of Bounded Size](https://pubsonline.informs.org/doi/10.1287/ijoc.2021.0225) — INFORMS Journal on Computing 2023
- [ ] **M0292** [Brain-Inspired Experience Reinforcement Model for Bin Packing in Varying Environments](https://ieeexplore.ieee.org/document/9698837/) — IEEE Transactions on Neural Networks and Learning Systems 2022
- [ ] **M0297** [A Data-Driven Approach for Multi-level Packing Problems in Manufacturing Industry](https://doi.org/10.1145/3292500.3330708) — KDD 2019

### 图上的组合优化（14 篇）

- [ ] **M0311** [IMGNN: An Efficient, Effective and Generalizable Algorithm for Influence Maximization in Social Networks](https://doi.org/10.1145/3770854.3780321) — KDD 2026
- [ ] **M0313** [CADO: From Imitation to Cost Minimization for Heatmap-based Solvers in Combinatorial Optimization](https://openreview.net/forum?id=fvxx5FOED6) — TMLR 2026
- [ ] **M0314** [Graph Coloring via Learning and Metric-Guided Independent Set Extraction](https://openreview.net/forum?id=0uvGZZZNxn) — TMLR 2026
- [ ] **M0315** [Preference-Based Gradient Estimation for ML-Guided Approximate Combinatorial Optimization](https://openreview.net/forum?id=2S224XC378) — TMLR 2026
- [ ] **M0316** [Test-Time Adaptation for Unsupervised Combinatorial Optimization](https://openreview.net/forum?id=VVyGfRp4fG) — TMLR 2026
- [ ] **M0317** [DynaFLUX: Implicit Dynamics-Preserving Reinforcement Learning for Topology-Free Influence Maximization](https://doi.org/10.1145/3774904.3792742) — WWW 2026
- [ ] **M0325** [Deep-learning-aided dismantling of interdependent networks](https://doi.org/10.1038/s42256-025-01070-2) — Nature Machine Intelligence 2025
- [ ] **M0338** [Continuous Parallel Relaxation for Finding Diverse Solutions in Combinatorial Optimization Problems](https://openreview.net/forum?id=ix33zd5zCw) — TMLR 2025
- [ ] **M0340** [Learning Encodings for Constructive Neural Combinatorial Optimization Needs to Regret](https://ojs.aaai.org/index.php/AAAI/article/view/30069) — AAAI 2024
- [ ] **M0345** [Distributed constrained combinatorial optimization leveraging hypergraph neural networks](https://doi.org/10.1038/s42256-024-00833-7) — Nature Machine Intelligence 2024
- [ ] **M0352** [Searching for spin glass ground states through deep reinforcement learning](https://doi.org/10.1038/s41467-023-36363-w) — Nature Communications 2023
- [ ] **M0362** [Improving Variable Orderings of Approximate Decision Diagrams Using Reinforcement Learning](https://pubsonline.informs.org/doi/10.1287/ijoc.2022.1194) — INFORMS Journal on Computing 2022
- [ ] **M0363** [Combinatorial optimization with physics-inspired graph neural networks](https://doi.org/10.1038/s42256-022-00468-6) — Nature Machine Intelligence 2022
- [ ] **M0375** [Finding key players in complex networks through deep reinforcement learning](https://doi.org/10.1038/s42256-020-0177-2) — Nature Machine Intelligence 2020

### 图匹配、图编辑与二次指派（25 篇）

- [ ] **M0384** [Efficient Few-Step Solution Generation via Discrete Flow Matching for Combinatorial Optimization](https://ojs.aaai.org/index.php/AAAI/article/view/41035) — AAAI 2026
- [ ] **M0388** [Dynamic task allocation of heterogeneous aircraft for wildfire suppression via deep reinforcement learning](https://www.sciencedirect.com/science/article/pii/S0377221726005916) — European Journal of Operational Research 2026
- [ ] **M0392** [NCOGAP: Neural Combinatorial Optimization for Solving Large-Scale Airport Gate Assignment Problems](https://ieeexplore.ieee.org/document/11494267/) — IEEE Transactions on Intelligent Transportation Systems 2026
- [ ] **M0393** [Learning With Partial and Noisy Correspondence in Graph Matching](https://ieeexplore.ieee.org/document/11426829/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2026
- [ ] **M0394** [ERL-MPP: Evolutionary Reinforcement Learning with Multi-head Puzzle Perception for Solving Large-scale Jigsaw Puzzles of Eroded Gaps](https://doi.org/10.1609/aaai.v39i7.32748) — AAAI 2025
- [ ] **M0395** [Deep reinforcement learning for the real-time inventory rack storage assignment and replenishment problem](https://www.sciencedirect.com/science/article/pii/S0377221725003649) — European Journal of Operational Research 2025
- [ ] **M0396** [The first mile is the hardest: A deep learning-assisted matheuristic for container assignment in first-mile logistics](https://www.sciencedirect.com/science/article/pii/S0377221725000505) — European Journal of Operational Research 2025
- [ ] **M0398** [Contrastive Learning Network for Unsupervised Graph Matching](https://ieeexplore.ieee.org/document/10671578/) — IEEE Transactions on Circuits and Systems for Video Technology 2025
- [ ] **M0399** [Deep Probabilistic Graph Matching](https://ieeexplore.ieee.org/document/11037466/) — IEEE Transactions on Knowledge and Data Engineering 2025
- [ ] **M0400** [DeepNM: Incremental Graph Matching Based on Sinkhorn Similarity](https://ieeexplore.ieee.org/document/11051053/) — IEEE Transactions on Knowledge and Data Engineering 2025
- [ ] **M0401** [Hierarchy-Aware Neural Subgraph Matching With Enhanced Similarity Measure](https://ieeexplore.ieee.org/document/11049885/) — IEEE Transactions on Knowledge and Data Engineering 2025
- [ ] **M0402** [Neural Combinatorial Optimization for Multiobjective Task Offloading in Mobile Edge Computing](https://ieeexplore.ieee.org/document/10908871/) — IEEE Transactions on Vehicular Technology 2025
- [ ] **M0409** [Dynamic resource matching in manufacturing using deep reinforcement learning](https://www.sciencedirect.com/science/article/pii/S0377221724003862) — European Journal of Operational Research 2024
- [ ] **M0412** [Deep Semantic Graph Matching for Large-Scale Outdoor Point Cloud Registration](https://ieeexplore.ieee.org/document/10403839/) — IEEE Transactions on Geoscience and Remote Sensing 2024
- [ ] **M0413** [A Robust Framework for One-Shot Key Information Extraction via Deep Partial Graph Matching](https://ieeexplore.ieee.org/document/10416209/) — IEEE Transactions on Image Processing 2024
- [ ] **M0414** [Learnable Graph Matching: A Practical Paradigm for Data Association](https://ieeexplore.ieee.org/document/10423205/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2024
- [ ] **M0416** [MGMatch: Fast Matchmaking with Nonlinear Objective and Constraints via Multimodal Deep Graph Learning](https://doi.org/10.1145/3637528.3671553) — KDD 2024
- [ ] **M0425** [Random Deep Graph Matching](https://ieeexplore.ieee.org/document/9944859/) — IEEE Transactions on Knowledge and Data Engineering 2023
- [ ] **M0426** [Combinatorial Learning of Robust Deep Graph Matching: An Embedding Based Approach](https://ieeexplore.ieee.org/document/9128045/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2023
- [ ] **M0427** [Unsupervised Learning of Graph Matching With Mixture of Modes via Discrepancy Minimization](https://ieeexplore.ieee.org/document/10073537/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2023
- [ ] **M0435** [A Fast Graph Neural Network-Based Method for Winner Determination in Multi-Unit Combinatorial Auctions](https://ieeexplore.ieee.org/document/9305731/) — IEEE Transactions on Cloud Computing 2022
- [ ] **M0436** [Robust Point Cloud Registration Framework Based on Deep Graph Matching](https://ieeexplore.ieee.org/document/9878213/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2022（Early Access）
- [ ] **M0438** [Proxy Graph Matching with Proximal Matching Networks](https://ojs.aaai.org/index.php/AAAI/article/view/17179) — AAAI 2021
- [ ] **M0448** [Neural Graph Matching Network: Learning Lawler’s Quadratic Assignment Problem with Extension to Hypergraph and Multiple-graph Matching](https://ieeexplore.ieee.org/document/9426408/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2021（Early Access）
- [ ] **M0461** [Graph Matching Using Hierarchical Fuzzy Graph Neural Networks](http://ieeexplore.ieee.org/document/7505936/) — IEEE Transactions on Fuzzy Systems 2017

### 整数规划与混合整数优化（6 篇）

- [ ] **M0464** [Lifted branching: Learning to improve branching strategies](https://www.sciencedirect.com/science/article/pii/S0377221726006648) — European Journal of Operational Research 2026
- [ ] **M0483** [Neural network assisted branch and bound algorithm for dynamic berth allocation problems](https://www.sciencedirect.com/science/article/pii/S0377221724005204) — European Journal of Operational Research 2024
- [ ] **M0492** [Learning to Cut via Hierarchical Sequence/Set Model for Efficient Mixed-Integer Programming](https://ieeexplore.ieee.org/document/10607926/) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2024
- [ ] **M0496** [Differentiating Through Integer Linear Programs with Quadratic Regularization and Davis-Yin Splitting](https://openreview.net/forum?id=H8IaxrANWl) — TMLR 2024
- [ ] **M0497** [Reinforcement Learning for Node Selection in Branch-and-Bound](https://openreview.net/forum?id=VrWl6yNk1E) — TMLR 2024
- [ ] **M0513** [Lookback for Learning to Branch](https://openreview.net/forum?id=EQpGkw5rvL) — TMLR 2022

### SAT、CSP 与离散约束推理（1 篇）

- [ ] **M0533** [Budget-Aware Sequential Brick Assembly with Efficient Constraint Satisfaction](https://openreview.net/forum?id=0mRfQOnkqk) — TMLR 2024

### 神经搜索、路径规划与组合谜题（5 篇）

- [ ] **M0547** [Learning-guided Prioritized Planning for Lifelong Multi-Agent Path Finding in Warehouse Automation](https://doi.org/10.1613/jair.1.20611) — JAIR 2026
- [ ] **M0549** [Decision-focused neural adaptive search and diving for optimizing mining complexes](https://www.sciencedirect.com/science/article/pii/S0377221724005654) — European Journal of Operational Research 2025
- [ ] **M0550** [Meta-Heuristics Graph Neural Architecture Search for Combinatorial Optimization](https://ieeexplore.ieee.org/document/11125530/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2025（Early Access）
- [ ] **M0561** [ASNets: Deep Learning for Generalised Planning](https://doi.org/10.1613/jair.1.11633) — JAIR 2020
- [ ] **M0564** [Solving the Rubik’s cube with deep reinforcement learning and search](https://doi.org/10.1038/s42256-019-0070-z) — Nature Machine Intelligence 2019

### 通用框架、训练方法与跨问题迁移（22 篇）

- [ ] **M0574** [TransACO: Transformer-Guided Ant Colony Algorithm for Combinatorial Optimization](https://ieeexplore.ieee.org/document/11514096/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2026
- [ ] **M0575** [An Effective Cross-Task Unified Multiobjective Neural Metaframework for Solving Combinatorial Optimization Problems](https://ieeexplore.ieee.org/document/11676837/) — IEEE Transactions on Neural Networks and Learning Systems 2026（Early Access）
- [ ] **M0576** [Brain-Inspired Chaotic Graph Backpropagation for Combinatorial Optimization](https://ieeexplore.ieee.org/document/11346543/) — IEEE Transactions on Neural Networks and Learning Systems 2026
- [ ] **M0577** [Scaling Neuro-symbolic Problem Solving: Solver-Free Learning of Constraints and Objectives](https://doi.org/10.1613/jair.1.21105) — JAIR 2026
- [ ] **M0585** [Solving Multiobjective Combinatorial Optimization via Learning to Improve Method](https://ieeexplore.ieee.org/document/10906524/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2025
- [ ] **M0586** [Diversifying Graph Augmentation for Learning to Solve Graph Optimization Problems](https://ieeexplore.ieee.org/document/11172707/) — IEEE Transactions on Knowledge and Data Engineering 2025
- [ ] **M0589** [Efficient Training of Multi-task Neural Solver for Combinatorial Optimization](https://openreview.net/forum?id=HJbcwRbMQQ) — TMLR 2025
- [ ] **M0597** [Multiobjective Combinatorial Optimization Using a Single Deep Reinforcement Learning Model](https://ieeexplore.ieee.org/document/10266708/) — IEEE Transactions on Cybernetics 2024
- [ ] **M0598** [Neural Improvement Heuristics for Graph Combinatorial Optimization Problems](https://ieeexplore.ieee.org/document/10271315/) — IEEE Transactions on Neural Networks and Learning Systems 2024
- [ ] **M0599** [A Neural Separation Algorithm for the Rounded Capacity Inequalities](https://pubsonline.informs.org/doi/10.1287/ijoc.2022.0310) — INFORMS Journal on Computing 2024
- [ ] **M0600** [Scalable Primal Heuristics Using Graph Neural Networks for Combinatorial Optimization](https://doi.org/10.1613/jair.1.14972) — JAIR 2024
- [ ] **M0603** [A general deep reinforcement learning hyperheuristic framework for solving combinatorial optimization problems](https://www.sciencedirect.com/science/article/pii/S037722172300036X) — European Journal of Operational Research 2023
- [ ] **M0609** [Exploring Rule-Free Layout Decomposition via Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/10002897/) — IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems 2023
- [ ] **M0610** [RL-CSL: A Combinatorial Optimization Method Using Reinforcement Learning and Contrastive Self-Supervised Learning](https://ieeexplore.ieee.org/document/9690950/) — IEEE Transactions on Emerging Topics in Computational Intelligence 2023
- [ ] **M0611** [Combinatorial Optimization Meets Reinforcement Learning: Effective Taxi Order Dispatching at Large-Scale](https://ieeexplore.ieee.org/document/9611023/) — IEEE Transactions on Knowledge and Data Engineering 2023
- [ ] **M0612** [Multi-Objective Neural Evolutionary Algorithm for Combinatorial Optimization Problems](https://ieeexplore.ieee.org/document/9527391/) — IEEE Transactions on Neural Networks and Learning Systems 2023
- [ ] **M0614** [The (Un)Scalability of Informed Heuristic Function Estimation in NP-Hard Search Problems](https://openreview.net/forum?id=JllRdycmLk) — TMLR 2023
- [ ] **M0615** [Understanding Curriculum Learning in Policy Optimization for Online Combinatorial Optimization](https://openreview.net/forum?id=gKEbBKRUjA) — TMLR 2023
- [ ] **M0616** [Facility Relocation Search For Good: When Facility Exposure Meets User Convenience](https://doi.org/10.1145/3543507.3583859) — WWW 2023
- [ ] **M0617** [A deep reinforcement learning based hyper-heuristic for combinatorial optimisation with uncertainties](https://www.sciencedirect.com/science/article/pii/S0377221721008821) — European Journal of Operational Research 2022
- [ ] **M0622** [Adaptive Layout Decomposition With Graph Embedding Neural Networks](https://ieeexplore.ieee.org/document/9672139/) — IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems 2022
- [ ] **M0623** [Deep Learning-Driven Simultaneous Layout Decomposition and Mask Optimization](https://ieeexplore.ieee.org/document/9360853/) — IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems 2022

<a name="research-references"></a>

## 待添加：综述、评测与研究资源

共 **19 篇**。

- [ ] **R0005** [Neural Combinatorial Optimization Algorithms for Solving Vehicle Routing Problems: A Comprehensive Survey With Perspectives](https://ieeexplore.ieee.org/document/11615127/) — IEEE Transactions on Neural Networks and Learning Systems 2026（Early Access）
- [ ] **R0006** [Unrealized Expectations: Comparing AI Methods vs Classical Algorithms for Maximum Independent Set](https://openreview.net/forum?id=ksGoCT5zW6) — TMLR 2026
- [ ] **R0010** [Reusability report: A distributed strategy for solving combinatorial optimization problems with hypergraph neural networks](https://doi.org/10.1038/s42256-025-01141-4) — Nature Machine Intelligence 2025
- [ ] **R0017** [MaxCutBench: Revisiting and Benchmarking Graph Neural Networks for Maximum Cut](https://openreview.net/forum?id=322PpCGAX8) — TMLR 2025
- [ ] **R0018** [Survey on Genetic Programming and Machine Learning Techniques for Heuristic Design in Job Shop Scheduling](https://ieeexplore.ieee.org/document/10065588/) — IEEE Transactions on Evolutionary Computation 2024
- [ ] **R0019** [Machine Learning to Solve Vehicle Routing Problems: A Survey](https://ieeexplore.ieee.org/document/10379532/) — IEEE Transactions on Intelligent Transportation Systems 2024
- [ ] **R0021** [Understanding Sample Generation Strategies for Learning Heuristic Functions in Classical Planning](https://doi.org/10.1613/jair.1.15742) — JAIR 2024
- [ ] **R0022** [Pygmtools: A Python Graph Matching Toolkit](https://jmlr.org/papers/v25/23-0572.html) — JMLR 2024
- [ ] **R0025** [DIG-MILP: a Deep Instance Generator for Mixed-Integer Linear Programming with Feasibility Guarantee](https://openreview.net/forum?id=MywlrEaFqR) — TMLR 2024
- [ ] **R0026** [G4SATBench: Benchmarking and Advancing SAT Solving with Graph Neural Networks](https://openreview.net/forum?id=7VB5db72lr) — TMLR 2024
- [ ] **R0027** [Graph Reinforcement Learning for Combinatorial Optimization: A Survey and Unifying Perspective](https://openreview.net/forum?id=HduK51xNtS) — TMLR 2024
- [ ] **R0028** [The first AI4TSP competition: Learning to solve stochastic routing problems](https://doi.org/10.1016/j.artint.2023.103918) — Artificial Intelligence 2023
- [ ] **R0031** [Combinatorial Optimization and Reasoning with Graph Neural Networks](https://jmlr.org/papers/v24/21-0449.html) — JMLR 2023
- [ ] **R0034** [Machine learning at the service of meta-heuristics for solving combinatorial optimization problems: A state-of-the-art](https://www.sciencedirect.com/science/article/pii/S0377221721003623) — European Journal of Operational Research 2022
- [ ] **R0036** [Inability of a graph neural network heuristic to outperform greedy algorithms in solving combinatorial optimization problems](https://doi.org/10.1038/s42256-022-00587-0) — Nature Machine Intelligence 2022
- [ ] **R0037** [Modern graph neural networks do worse than classical greedy algorithms in solving combinatorial optimization problems like maximum independent set](https://doi.org/10.1038/s42256-022-00589-y) — Nature Machine Intelligence 2022
- [ ] **R0038** [Reply to: Inability of a graph neural network heuristic to outperform greedy algorithms in solving combinatorial optimization problems](https://doi.org/10.1038/s42256-022-00588-z) — Nature Machine Intelligence 2022
- [ ] **R0039** [Reply to: Modern graph neural networks do worse than classical greedy algorithms in solving combinatorial optimization problems like maximum independent set](https://doi.org/10.1038/s42256-022-00590-5) — Nature Machine Intelligence 2022
- [ ] **R0040** [Machine learning for combinatorial optimization: A methodological tour d’horizon](https://www.sciencedirect.com/science/article/pii/S0377221720306895) — European Journal of Operational Research 2021

<a name="historical-papers"></a>

## 待添加：早期神经优化与神经动力学方法

共 **70 篇**。

- [ ] **H0001** [Neural sampling from cognitive maps enables goal-directed imagination and planning](https://doi.org/10.1038/s42256-026-01254-4) — Nature Machine Intelligence 2026
- [ ] **H0002** [A Fuzzy Adaptive Network With Learnable Parameters for Mixed-Integer Optimization](https://ieeexplore.ieee.org/document/11159174/) — IEEE Transactions on Fuzzy Systems 2025
- [ ] **H0003** [Energy Efficient Memristive Transiently Chaotic Neural Network for Combinatorial Optimization](https://ieeexplore.ieee.org/document/10555030/) — IEEE Transactions on Circuits and Systems I: Regular Papers 2024
- [ ] **H0004** [Self-Organizing Neural Scheduler for the Flexible Job Shop Problem With Periodic Maintenance and Mandatory Outsourcing Constraints](https://ieeexplore.ieee.org/document/9750014/) — IEEE Transactions on Cybernetics 2023
- [ ] **H0005** [A Two-Timescale Duplex Neurodynamic Approach to Mixed-Integer Optimization](https://ieeexplore.ieee.org/document/9023556/) — IEEE Transactions on Neural Networks and Learning Systems 2021
- [ ] **H0006** [A Time Wave Neural Network Framework for Solving Time-Dependent Project Scheduling Problems](https://ieeexplore.ieee.org/document/8672098/) — IEEE Transactions on Neural Networks and Learning Systems 2020
- [ ] **H0008** [A Neurodynamic Approach for Real-Time Scheduling via Maximizing Piecewise Linear Utility](http://ieeexplore.ieee.org/document/7229340/) — IEEE Transactions on Neural Networks and Learning Systems 2016
- [ ] **H0009** [Efficient Shortest-Path-Tree Computation in Network Routing Based on Pulse-Coupled Neural Networks](http://ieeexplore.ieee.org/document/6338347/) — IEEE Transactions on Cybernetics 2013
- [ ] **H0011** [Noise-Tuning-Based Hysteretic Noisy Chaotic Neural Network for Broadcast Scheduling Problem in Wireless Multihop Networks](http://ieeexplore.ieee.org/document/6332524/) — IEEE Transactions on Neural Networks and Learning Systems 2012
- [ ] **H0012** [Superconducting Neural Network for Solving a Combinatorial Optimization Problem](http://ieeexplore.ieee.org/document/5672805/) — IEEE Transactions on Applied Superconductivity 2011
- [ ] **H0013** [A Suitable Initialization Procedure for Speeding a Neural Network Job-Shop Scheduling](http://ieeexplore.ieee.org/document/5456190/) — IEEE Transactions on Industrial Electronics 2011
- [ ] **H0014** [Design of the Inverse Function Delayed Neural Network for Solving Combinatorial Optimization Problems](http://ieeexplore.ieee.org/document/5352267/) — IEEE Transactions on Neural Networks 2010
- [ ] **H0015** [Novel Hysteretic Noisy Chaotic Neural Network for Broadcast Scheduling Problems in Packet Radio Networks](http://ieeexplore.ieee.org/document/5546979/) — IEEE Transactions on Neural Networks 2010
- [ ] **H0016** [Delay-Constrained Multicast Routing Using the Noisy Chaotic Neural Networks](http://ieeexplore.ieee.org/document/4585367/) — IEEE Transactions on Computers 2009
- [ ] **H0017** [A Novel Constructive-Optimizer Neural Network for the Traveling Salesman Problem](http://ieeexplore.ieee.org/document/4267878/) — IEEE Transactions on Systems, Man and Cybernetics, Part B (Cybernetics) 2007
- [ ] **H0018** [Heuristics and augmented neural networks for task scheduling with non-identical machines](https://www.sciencedirect.com/science/article/pii/S0377221705004303) — European Journal of Operational Research 2006
- [ ] **H0019** [The impact of energy function structure on solving generalized assignment problem using Hopfield neural network](https://www.sciencedirect.com/science/article/pii/S0377221704004540) — European Journal of Operational Research 2006
- [ ] **H0020** [A Gradual Noisy Chaotic Neural Network for Solving the Broadcast Scheduling Problem in Packet Radio Networks](http://ieeexplore.ieee.org/document/1650253/) — IEEE Transactions on Neural Networks 2006
- [ ] **H0021** [An Improved Augmented Neural-Network Approach for Scheduling Problems](https://pubsonline.informs.org/doi/10.1287/ijoc.1040.0108) — INFORMS Journal on Computing 2006
- [ ] **H0022** [On parameter settings of Hopfield networks applied to traveling salesman problems](http://ieeexplore.ieee.org/document/1427907/) — IEEE Transactions on Circuits and Systems I: Regular Papers 2005
- [ ] **H0023** [A comparison of discrete and continuous neural network approaches to solve the class/teacher timetabling problem](https://www.sciencedirect.com/science/article/pii/S0377221703000997) — European Journal of Operational Research 2004
- [ ] **H0024** [A Columnar Competitive Model for Solving Combinatorial Optimization Problems](http://ieeexplore.ieee.org/document/1353292/) — IEEE Transactions on Neural Networks 2004
- [ ] **H0025** [A Noisy Self-Organizing Neural Network With Bifurcation Dynamics for Combinatorial Optimization](http://ieeexplore.ieee.org/document/1263581/) — IEEE Transactions on Neural Networks 2004
- [ ] **H0026** [A noisy chaotic neural network for solving combinatorial optimization problems: stochastic chaotic simulated annealing](http://ieeexplore.ieee.org/document/1335506/) — IEEE Transactions on Systems, Man, and Cybernetics, Part B (Cybernetics) 2004
- [ ] **H0027** [Augmented neural networks for task scheduling](https://www.sciencedirect.com/science/article/pii/S0377221702006057) — European Journal of Operational Research 2003
- [ ] **H0028** [A Kohonen-like decomposition method for the euclidean traveling salesman problem - KNIES_DECOMPOSE](http://ieeexplore.ieee.org/document/1215404/) — IEEE Transactions on Neural Networks 2003
- [ ] **H0029** [Design and implementation of a random neural network routing engine](http://ieeexplore.ieee.org/document/1243716/) — IEEE Transactions on Neural Networks 2003
- [ ] **H0030** [A mixed neural-genetic algorithm for the broadcast scheduling problem](http://ieeexplore.ieee.org/document/1184112/) — IEEE Transactions on Wireless Communications 2003
- [ ] **H0031** [Energy function-based approaches to graph coloring](http://ieeexplore.ieee.org/document/977273/) — IEEE Transactions on Neural Networks 2002
- [ ] **H0032** [Genetic algorithm-based neural fuzzy decision tree for mixed scheduling in ATM networks](http://ieeexplore.ieee.org/document/1049617/) — IEEE Transactions on Systems, Man and Cybernetics, Part B (Cybernetics) 2002
- [ ] **H0033** [A self-organizing neural network approach for the single AGV routing problem](https://www.sciencedirect.com/science/article/pii/S0377221799000326) — European Journal of Operational Research 2000
- [ ] **H0034** [Sequencing jobs on a single machine: A neural network approach](https://www.sciencedirect.com/science/article/pii/S0377221799003021) — European Journal of Operational Research 2000
- [ ] **H0035** [A discrete-time recurrent neural network for shortest-path routing](http://ieeexplore.ieee.org/document/887639/) — IEEE Transactions on Automatic Control 2000
- [ ] **H0036** [Constraint satisfaction adaptive neural network and heuristics combined approaches for generalized job-shop scheduling](http://ieeexplore.ieee.org/document/839016/) — IEEE Transactions on Neural Networks 2000
- [ ] **H0037** [Fast combinatorial optimization with parallel digital computers](http://ieeexplore.ieee.org/document/883436/) — IEEE Transactions on Neural Networks 2000
- [ ] **H0038** [Local routing algorithms based on Potts neural networks](http://ieeexplore.ieee.org/document/857776/) — IEEE Transactions on Neural Networks 2000
- [ ] **H0039** [Lagrangian relaxation neural networks for job shop scheduling](http://ieeexplore.ieee.org/document/833193/) — IEEE Transactions on Robotics and Automation 2000
- [ ] **H0040** [Selecting Scheduling Heuristics Using Neural Networks](https://pubsonline.informs.org/doi/10.1287/ijoc.12.2.150.11893) — INFORMS Journal on Computing 2000
- [ ] **H0041** [A saturated linear dynamical network for approximating maximum clique](http://ieeexplore.ieee.org/document/768824/) — IEEE Transactions on Circuits and Systems I: Fundamental Theory and Applications 1999
- [ ] **H0042** [A unified framework for chaotic neural-network approaches to combinatorial optimization](http://ieeexplore.ieee.org/document/774279/) — IEEE Transactions on Neural Networks 1999
- [ ] **H0043** [Extended Hopfield models for combinatorial optimization](http://ieeexplore.ieee.org/document/737495/) — IEEE Transactions on Neural Networks 1999
- [ ] **H0044** [A gradual neural network approach for FPGA segmented channel routing problems](http://ieeexplore.ieee.org/document/775264/) — IEEE Transactions on Systems, Man and Cybernetics, Part B (Cybernetics) 1999
- [ ] **H0045** [Scheduling multiprocessor job with resource and timing constraints using neural networks](http://ieeexplore.ieee.org/document/775265/) — IEEE Transactions on Systems, Man and Cybernetics, Part B (Cybernetics) 1999
- [ ] **H0046** [Neural Networks for Combinatorial Optimization: A Review of More Than a Decade of Research](https://pubsonline.informs.org/doi/10.1287/ijoc.11.1.15) — INFORMS Journal on Computing 1999
- [ ] **H0047** [Graph coloring via synchronization of coupled oscillators](http://ieeexplore.ieee.org/document/721263/) — IEEE Transactions on Circuits and Systems I: Fundamental Theory and Applications 1998
- [ ] **H0048** ["Optimal" Hopfield network for combinatorial optimization with linear cost function](http://ieeexplore.ieee.org/document/728382/) — IEEE Transactions on Neural Networks 1998
- [ ] **H0049** [Neural techniques for combinatorial optimization with applications](http://ieeexplore.ieee.org/document/728380/) — IEEE Transactions on Neural Networks 1998
- [ ] **H0050** [Mathematical improvement of the Hopfield model for feasible solutions to the traveling salesman problem by a synapse dynamical system](http://ieeexplore.ieee.org/document/735403/) — IEEE Transactions on Systems, Man and Cybernetics, Part B (Cybernetics) 1998
- [ ] **H0051** [Primal and dual neural networks for shortest-path routing](http://ieeexplore.ieee.org/document/725357/) — IEEE Transactions on Systems, Man, and Cybernetics - Part A: Systems and Humans 1998
- [ ] **H0052** [A binary Hopfield neural-network approach for satellite broadcast scheduling problems](https://ieeexplore.ieee.org/document/557699/) — IEEE Transactions on Neural Networks 1997
- [ ] **H0054** [A neural network approach to facility layout problems](https://www.sciencedirect.com/science/article/pii/0377221795000518) — European Journal of Operational Research 1996
- [ ] **H0055** [A neural network model for scheduling problems](https://www.sciencedirect.com/science/article/pii/0377221796000410) — European Journal of Operational Research 1996
- [ ] **H0056** [An adaptive, multiple restarts neural network algorithm for graph coloring](https://www.sciencedirect.com/science/article/pii/0377221796000434) — European Journal of Operational Research 1996
- [ ] **H0057** [Massively parallel analog tabu search using neural networks applied to simple plant location problems](https://www.sciencedirect.com/science/article/pii/0377221796000471) — European Journal of Operational Research 1996
- [ ] **H0058** [Traditional heuristic versus Hopfield neural network approaches to a car sequencing problem](https://www.sciencedirect.com/science/article/pii/0377221796000409) — European Journal of Operational Research 1996
- [ ] **H0059** [An argument for abandoning the travelling salesman problem as a neural-network benchmark](http://ieeexplore.ieee.org/document/548187/) — IEEE Transactions on Neural Networks 1996
- [ ] **H0060** [Neural networks for process scheduling in real-time communication systems](https://ieeexplore.ieee.org/document/536320/) — IEEE Transactions on Neural Networks 1996
- [ ] **H0061** [Group updates and multiscaling: an efficient neural network approach to combinatorial optimization](http://ieeexplore.ieee.org/document/485834/) — IEEE Transactions on Systems, Man and Cybernetics, Part B (Cybernetics) 1996
- [ ] **H0065** [Approximating maximum clique with a Hopfield network](http://ieeexplore.ieee.org/document/377977/) — IEEE Transactions on Neural Networks 1995
- [ ] **H0066** [Limitations of neural networks for solving traveling salesman problems](http://ieeexplore.ieee.org/document/363424/) — IEEE Transactions on Neural Networks 1995
- [ ] **H0071** [A neural network approach to routing without interference in multihop radio networks](http://ieeexplore.ieee.org/document/275311/) — IEEE Transactions on Communications 1994
- [ ] **H0072** [Solving the quadratic assignment problem with clues from nature](http://ieeexplore.ieee.org/document/265961/) — IEEE Transactions on Neural Networks 1994
- [ ] **H0073** [Timetable construction with Markovian neural network](https://www.sciencedirect.com/science/article/pii/0377221793900944) — European Journal of Operational Research 1993
- [ ] **H0074** [A Boolean neural network approach for the traveling salesman problem](http://ieeexplore.ieee.org/document/257714/) — IEEE Transactions on Computers 1993
- [ ] **H0075** [Neural networks for routing of communication networks with unreliable components](http://ieeexplore.ieee.org/document/248462/) — IEEE Transactions on Neural Networks 1993
- [ ] **H0076** [Neural networks for shortest path computation and routing in computer networks](http://ieeexplore.ieee.org/document/286889/) — IEEE Transactions on Neural Networks 1993
- [ ] **H0079** [Knapsack packing networks](http://ieeexplore.ieee.org/document/125871/) — IEEE Transactions on Neural Networks 1992
- [ ] **H0081** [A neural network approach to job-shop scheduling](http://ieeexplore.ieee.org/document/80311/) — IEEE Transactions on Neural Networks 1991
- [ ] **H0087** [An analogue approach to the travelling salesman problem using an elastic net method](https://doi.org/10.1038/326689a0) — Nature 1987
- [ ] **H0089** [Computing with Neural Circuits: A Model](https://doi.org/10.1126/science.3755256) — Science 1986

<a name="pending-papers"></a>

## 待核验：不计入正式总数

共 **41 篇**。正式录入前需补足发表日期或直接神经求解的证据。

- **U0001** [A Hierarchical Bin Packing Framework With Dual Manipulators via Heuristic Search and Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/11435413/) — IEEE Transactions on Automation Science and Engineering 2026
  - 待核验原因：`relevant`。
- **U0002** [Dual-GNN-Driven Cooperative Optimization for Makespan-Minimized and Large-Scale 3C Dynamic Job-Shop Scheduling](https://ieeexplore.ieee.org/document/11373046/) — IEEE Transactions on Automation Science and Engineering 2026
  - 待核验原因：`relevant`。
- **U0003** [Energy-Efficient Distributed Heterogeneous Hybrid Flow-Shop Scheduling Using Graph Neural Network and Deep Reinforcement Learning](https://ieeexplore.ieee.org/document/11091335/) — IEEE Transactions on Automation Science and Engineering 2026
  - 待核验原因：`relevant`。
- **U0004** [Game Theory-Based Production-Maintenance Collaborative Scheduling Using Imitation-Enhanced Alternating-Training Reinforcement Learning](https://ieeexplore.ieee.org/document/11275927/) — IEEE Transactions on Automation Science and Engineering 2026
  - 待核验原因：`relevant`。
- **U0005** [PalletFit: Stability-Aware Online 3-D Bin Packing via Transformer-Based Reinforcement Learning](https://ieeexplore.ieee.org/document/11727506/) — IEEE Transactions on Automation Science and Engineering 2026
  - 待核验原因：`relevant`。
- **U0006** [Robotic Bin Packing via Hierarchical Reinforcement Learning](https://ieeexplore.ieee.org/document/11460230/) — IEEE Transactions on Automation Science and Engineering 2026
  - 待核验原因：`relevant`。
- **U0007** [TERRAN: A Transformer-Based Electric Vehicle Routing Agent for Real-Time Adaptive Navigation](https://ieeexplore.ieee.org/document/11245586/) — IEEE Transactions on Automation Science and Engineering 2026
  - 待核验原因：`relevant`。
- **U0008** [MIND the Proximity: A Transformer-Based RL Scheduler and Placement Optimizer for Cloud-Edge Workloads](https://ieeexplore.ieee.org/document/11753452/) — IEEE Transactions on Cloud Computing 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0009** [Motif-GMN: Motif-Based Signed Graph Matching Network](https://ieeexplore.ieee.org/document/11706722/) — IEEE Transactions on Computational Social Systems 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0010** [Transformer Autoencoder-Embedded Evolutionary Algorithm for Scheduling Energy-Minimized Task of Human–Cyber–Physical Systems](https://ieeexplore.ieee.org/document/11739546/) — IEEE Transactions on Cybernetics 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0011** [A Knowledge-enhanced Framework with k -step DQN for No-Wait Flow-Shop Scheduling with Sequence-Dependent Setup Time](https://ieeexplore.ieee.org/document/11667116/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0012** [A Large Language Model-Assisted Reinforcement Learning Framework with Evolutionary Algorithm for Hybrid Flow-Shop Scheduling](https://ieeexplore.ieee.org/document/11364164/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0013** [An Evolutionary Adversarial Deep Q-Network for Real-time Distributed Hybrid Flow-shop Scheduling with Limited Transportation Resources](https://ieeexplore.ieee.org/document/11782859/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0014** [Branching Deep Q-Network Enhanced Memetic Algorithm for Skilled-Worker Constrained Flexible Job Shop Scheduling Problem](https://ieeexplore.ieee.org/document/11647084/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0015** [Enabling Population-Based Architectures for Neural Combinatorial Optimization](https://ieeexplore.ieee.org/document/11677171/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0016** [Evolutionary Augmented Reinforcement Learning for Neural Combinatorial Optimization](https://ieeexplore.ieee.org/document/11534307/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0017** [Evolutionary Graph Neural Architecture Search for Heterogeneous Graph-Based Combinatorial Optimization](https://ieeexplore.ieee.org/document/11744418/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0018** [Heterogeneous Graph Attention Network Assisted Bi-Population Co-Evolution for Networked Cloud Manufacturing Scheduling](https://ieeexplore.ieee.org/document/11655194/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0019** [Imitation Learning-Assisted Evolutionary Algorithm for Energy-Efficient Flexible Job Shop Scheduling Problem With Automated Guided Vehicles](https://ieeexplore.ieee.org/document/10879050/) — IEEE Transactions on Evolutionary Computation 2026
  - 待核验原因：`pending-neural-component`。
- **U0020** [Large Language Model-Driven Neural–Heuristic Optimization for Large-Scale Routing Problems](https://ieeexplore.ieee.org/document/11509330/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0021** [Multi-Tree Genetic Programming With Deep Contextual Bandits for Learning-Assisted Scheduling of Cluster Tools Integrating Stockers](https://ieeexplore.ieee.org/document/11322796/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0022** [TransGP: Task-Conditioned Transformer-Guided Genetic Programming for Multitask Dynamic Flexible Job Shop Scheduling](https://ieeexplore.ieee.org/document/11698820/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0023** [Two Models with K-means and DQN Assisted Meta-heuristics for Scheduling Multi-objective Amphibious Unmanned Surface Vehicles](https://ieeexplore.ieee.org/document/11653219/) — IEEE Transactions on Evolutionary Computation 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0024** [A Deep Reinforcement Learning-based Parallel Adaptive Search Algorithm for Solving Large-Scale Agile Earth Observation Satellites Tasks Scheduling Problem](https://ieeexplore.ieee.org/document/11749798/) — IEEE Transactions on Geoscience and Remote Sensing 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0025** [Reinforcement Learning-Guided Evolutionary Policy Optimization for Preference-Adjustable Heterogeneous Agile Earth Observation Satellite Scheduling](https://ieeexplore.ieee.org/document/11744443/) — IEEE Transactions on Geoscience and Remote Sensing 2026
  - 待核验原因：`relevant`。
- **U0026** [Dynamic Scheduling for Hot Rolling Production by Hierarchical Reinforcement Learning and Heterogeneous Graph Neural Networks](https://ieeexplore.ieee.org/document/11739881/) — IEEE Transactions on Industrial Informatics 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0027** [Fleet-Size-Agnostic Transformer Model for Electric Vehicle Routing and Scheduling](https://ieeexplore.ieee.org/document/11642138/) — IEEE Transactions on Industry Applications 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0028** [A Learning-Enhanced Method for the Multi-Visit Vehicle-Drone Routing Problem With Continuous Locations](https://ieeexplore.ieee.org/document/11644874/) — IEEE Transactions on Intelligent Transportation Systems 2026
  - 待核验原因：`relevant`。
- **U0029** [Balanced Decoding of Constructive Neural Solvers for Vehicle Routing Problems](https://ieeexplore.ieee.org/document/11782645/) — IEEE Transactions on Intelligent Transportation Systems 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0030** [Deployable Emergency Scheduling for Bidirectional Metro Disruptions: Dynamic Zoning, Periodic Timetabling, and DQN Coordination](https://ieeexplore.ieee.org/document/11576626/) — IEEE Transactions on Intelligent Transportation Systems 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0031** [Relief Vehicle Routing Considering Driver State Evolution in Harsh Environments: A Maximum Likelihood Deep Reinforcement Learning Approach](https://ieeexplore.ieee.org/document/11614955/) — IEEE Transactions on Intelligent Transportation Systems 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0032** [A Heterogeneous Graph Metapath Attention-based Multi-Agent Collaborative Optimization Framework for Integrated Cloud-Edge Collaborative Scheduling](https://ieeexplore.ieee.org/document/11755390/) — IEEE Transactions on Mobile Computing 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0033** [Diffusion-Based Latency-Sensitive Task Scheduling for Generative Digital Twins in Industrial Internet of Things](https://ieeexplore.ieee.org/document/11644323/) — IEEE Transactions on Mobile Computing 2026
  - 待核验原因：`relevant`。
- **U0034** [DApp Scheduling for Hybrid Computing in Edge Web 3.0: A Reinforcement Learning Framework With Heterogeneous Graph Neural Networks](https://ieeexplore.ieee.org/document/11382034/) — IEEE Transactions on Networking 2026
  - 待核验原因：`relevant`。
- **U0035** [GLARE: Graph Learning Assisted Deep Reinforcement Learning for Cost-aware Dynamic Multi-Workflow Scheduling](https://ieeexplore.ieee.org/document/11770432/) — IEEE Transactions on Services Computing 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0036** [TACoS: A DRL-Based Framework for Tidal-Aware Virtual Machine Co-Location Scheduling](https://ieeexplore.ieee.org/document/11790304/) — IEEE Transactions on Services Computing 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0037** [A Deep Reinforcement Learning-Guided Rollout Approach for Adaptable Scheduling of Multiplicity Flexible Job Shops in Semiconductor Packaging](https://ieeexplore.ieee.org/document/11793033/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0038** [Iterative Neural Optimization Model for Flexible Flow Shop Scheduling With Domino Hazard Effect](https://ieeexplore.ieee.org/document/11751643/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2026（Early Access）
  - 待核验原因：`relevant`。
- **U0039** [A Perturbation-Augmented Unsupervised Learning Framework for Integer Linear Programming](https://doi.org/10.1145/3770855.3817737) — KDD 2026
  - 待核验原因：`pending_neural_method_verification`。
- **U0040** [SAT Solver Selection: Move Beyond Handcrafted Features](https://doi.org/10.1145/3770855.3817669) — KDD 2026
  - 待核验原因：`pending_neural_method_verification`。
- **U0041** [WISE: Hierarchical Worker Scheduling for Efficient Multi-Source Urban Delivery](https://doi.org/10.1145/3770855.3819060) — KDD 2026
  - 待核验原因：`pending_neural_method_verification`。

<a name="existing-coverage"></a>

## 仓库已有覆盖：不重复新增

共 **482 篇**，均已移出上方待添加部分。

- [Beyond Single-Step Updates: Reinforcement Learning of Heuristics with Limited-Horizon Search](../specialist/beyond-single-step-updates-reinforcement-learning-of-heuristics-with-limited-horizon-s.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/41023)
- [Boosting Cross-problem Generalization in Diffusion-Based Neural Combinatorial Solver via Inference Time Adaptation](../generalist/boosting-cross-problem-generalization-in-diffusion-based-neural-combinatorial-solver-v.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/40948)
- [Learning Branching Policies for MILPs with Proximal Policy Optimization](../generalist/learning-branching-policies-for-milps-with-proximal-policy-optimization.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/39619)
- [Learning Network Dismantling Without Handcrafted Inputs](../specialist/learning-network-dismantling-without-handcrafted-inputs.md) — AAAI 2026 · [正式论文](https://doi.org/10.1609/aaai.v40i31.39790)
- [Learning to Optimize Job Shop Scheduling Under Structural Uncertainty](../specialist/learning-to-optimize-job-shop-scheduling-under-structural-uncertainty.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/40973)
- [Multi-Agent Pointer Transformer: Seq-to-Seq Reinforcement Learning for Multi-Vehicle Dynamic Pickup-Delivery Problems](../specialist/multi-agent-pointer-transformer-seq-to-seq-reinforcement-learning-for-multi-vehicle-dy.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/38700)
- [Neural Graph Navigation for Intelligent Subgraph Matching](../specialist/neural-graph-navigation-for-intelligent-subgraph-matching.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/38654)
- [Planning in Branch-and-Bound: Model-Based Reinforcement Learning for Exact Combinatorial Optimization](../specialist/planning-in-branch-and-bound-model-based-reinforcement-learning-for-exact-combinatoria.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/39759)
- [RSPlace: Rotation Sensing Macro Placement via Bidirectional Tree Expansion](../specialist/rsplace-rotation-sensing-macro-placement-via-bidirectional-tree-expansion.md) — AAAI 2026 · [正式论文](https://doi.org/10.1609/aaai.v40i28.39559)
- [Scale-Net: A Hierarchical U-Net Framework for Cross-Scale Generalization in Multi-Task Vehicle Routing](../generalist/scale-net-a-hierarchical-u-net-framework-for-cross-scale-generalization-in-multi-task.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/38444)
- [UCPO: A Universal Constrained Combinatorial Optimization Method via Preference Optimization](../specialist/ucpo-a-universal-constrained-combinatorial-optimization-method-via-preference-optimiza.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/41017)
- [USPR: Learning a Unified Solver for Profiled Routing](../specialist/uspr-learning-a-unified-solver-for-profiled-routing.md) — AAAI 2026 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/41025)
- [The Missing GAP: From Solving Square Jigsaw Puzzles to Handling Real World Archaeological Fragments](../specialist/the-missing-gap-from-solving-square-jigsaw-puzzles-to-handling-real-world-archaeologic.md) — CVPR 2026 · [正式论文](https://openaccess.thecvf.com/content/CVPR2026/html/Shahar_The_Missing_GAP_From_Solving_Square_Jigsaw_Puzzles_to_Handling_CVPR_2026_paper.html)
- [PuzLM: Solving Jigsaw Puzzles with Sequence-to-Sequence Language Models](../specialist/puzlm-solving-jigsaw-puzzles-with-sequence-to-sequence-language-models.md) — ECCV 2026 · [正式论文](https://link.springer.com/chapter/10.1007/978-3-032-37281-9_4)
- [Beyond Simple Graphs: Neural Multi-Objective Routing on Multigraphs](../specialist/gms-multigraph-routing.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/7e0c50ca569760d0b9da9149db6a727f-Abstract-Conference.html)
- [Beyond the Heatmap: A Rigorous Evaluation of Component Impact in MCTS-Based TSP Solvers](../studies/beyond-heatmap-mcts.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/e3bf2f0f10774c474de22a12cb060e2c-Abstract-Conference.html)
- [Boolean Satisfiability via Imitation Learning](../specialist/imitsat.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/48adb34f7ee39177c4c23a8e4253a492-Abstract-Conference.html)
- [Chain-of-Context Learning: Dynamic Constraint Understanding for Multi-Task VRPs](../generalist/chain-of-context.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/1a7a22152cd21f0ca3c0f8139bb32905-Abstract-Conference.html)
- [Combination-of-Experts with Knowledge Sharing for Cross-Task Vehicle Routing Problems](../generalist/coeks.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/4572bc2f514e627914cbe60d0398a2d1-Abstract-Conference.html)
- [ConRep4CO: Contrastive Representation Learning of Combinatorial Optimization Instances across Types](../specialist/conrep4co.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/7d2938962f0e77f701b2faa0efeb8b7a-Abstract-Conference.html)
- [Constraint Matters: Multi-Modal Representation for Reducing Mixed-Integer Linear programming](../specialist/constraint-matters.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/25dd41a34a3fee27ca94ebd34186d22c-Abstract-Conference.html)
- [Deft Scheduling of Dynamic Cloud Workflows with Varying Deadlines via Mixture-of-Experts](../specialist/deft.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/f82526e95f7effb92f6a24f282ace472-Abstract-Conference.html)
- [FMIP: Joint Continuous-Integer Flow For Mixed-Integer Linear Programming](../specialist/fmip.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/f5a24b8fa97f7073aff5e8baadf583f1-Abstract-Conference.html)
- [FrontierCO: Real-World and Large-Scale Evaluation of Machine Learning Solvers for Combinatorial Optimization](../studies/frontierco.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c131c8875c7b1133ffdad2b53cb10e91-Abstract-Conference.html)
- [Gelato: Graph Edit Distance via Autoregressive Neural Combinatorial Optimization](../specialist/gelato.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/1943190d92efee1fccfc8d6579b0f8d9-Abstract-Conference.html)
- [Instance-wise Adaptive Scheduling via Derivative-Free Meta-Learning](../specialist/df-meta-scheduling.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/b21fb19109734d351faf54b19ac8b3b7-Abstract-Conference.html)
- [Learning Admissible Heuristics for A*:  Theory and Practice](../specialist/cea-admissible-heuristics.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/7f3b25e39e0f0330435d1ffc1d6fa193-Abstract-Conference.html)
- [Learning from Algorithm Feedback: One-Shot SAT Solver Guidance with GNNs](../specialist/rlaf-sat.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/a04c50c0bd6937760a3b89ee10010c96-Abstract-Conference.html)
- [Learning to Segment for Vehicle Routing Problems](../specialist/l2seg.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/f274af80a7a3aa9ed23ba6f7908470bc-Abstract-Conference.html)
- [Lifelong Learning with Behavior Consolidation for Vehicle Routing](../specialist/llr-bc.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c2c62117283dda155db754e54dbe8d71-Abstract-Conference.html)
- [LMask: Learn to Solve Constrained Routing Problems with Lazy Masking](../specialist/lmask.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/ade039c1db0391106a3375bd2feb310a-Abstract-Conference.html)
- [MaskCO: Masked Generation Drives Effective Representation Learning and Exploiting for Combinatorial Optimization](../specialist/maskco.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/d85816bf41e54d9b0847e02249f4fcc6-Abstract-Conference.html)
- [Multi-Action Self-Improvement For Neural Combinatorial Optimization](../specialist/macsim.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/1bf4cad47f5a54c98fbe7d10516ebf77-Abstract-Conference.html)
- [Native Adaptive Solution Expansion for Diffusion-based Combinatorial Optimization](../specialist/nexco.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/3d681cc4487b97c08e5aa67224dd74f2-Abstract-Conference.html)
- [Neural Multi-Objective Combinatorial Optimization for Flexible Job Shop Scheduling Problems](../specialist/dcan-mofjsp.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/5c411eef5b6ee7d9895ad129a4bfc6cc-Abstract-Conference.html)
- [On the Expressive Power of GNNs for Boolean Satisfiability](../studies/gnn-sat-expressivity.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/cd52ac59cd8ba77478d69304da1149e5-Abstract-Conference.html)
- [RADAR: Learning to Route with Asymmetry-aware Distance Representations](../generalist/radar.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/d28077e5ff52034cd35b4aa15320caea-Abstract-Conference.html)
- [RESCHED: Rethinking Flexible Job Shop Scheduling from a Transformer-based Architecture with Simplified States](../specialist/resched.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/467e109270678b3e2b3c2e7fa6b3d575-Abstract-Conference.html)
- [RRNCO: Towards Real-World Routing with Neural Combinatorial Optimization](../specialist/rrnco.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/9446c291a8744a125a0bda5b18f4d5a1-Abstract-Conference.html)
- [Towards Better Branching Policies: Leveraging the Sequential Nature of Branch-and-Bound Tree](../generalist/mamba-branching.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/b2f56a345fe0ce337df3bdfb31e2b350-Abstract-Conference.html)
- [Towards Efficient Constraint Handling in Neural Solvers for Routing Problems](../specialist/construct-and-refine.md) — ICLR 2026 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2026/hash/1413fbda783a5bad7947c2f7396ba64b-Abstract-Conference.html)
- [A General Neural Backbone for Mixed-Integer Linear Optimization via Dual Attention](../specialist/dual-attention-milp.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/huang26bl.html)
- [ASAP: Exploiting the Satisficing Generalization Edge in Neural Combinatorial Optimization](../specialist/asap.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/fang26t.html)
- [Black-Box Combinatorial Optimization with Order-Invariant Reinforcement Learning](../specialist/rl-eda.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/goudet26a.html)
- [Can Computational Reducibility Lead to Transferable Models for Graph Combinatorial Optimization?](../generalist/copt-mt.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/canturk26a.html)
- [Conformal Prediction for Early Stopping in Mixed Integer Optimization](../specialist/conformal-mip-stopping.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/clarke26a.html)
- [Dynamic Stratified Contrastive Learning with Upstream Augmentation for MILP Branching](../specialist/sc-milp.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/lu26v.html)
- [Latent Guided Sampling for Combinatorial Optimization](../specialist/lgs-net.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/surendran26a.html)
- [Learning Multi-Timescale Abstractions for Hierarchical Combinatorial Planning](../specialist/lmta.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/wang26if.html)
- [Learning Permutation Distributions via Reflected Diffusion on Ranks](../specialist/soft-rank-diffusion.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/he26ax.html)
- [Learning Permutation from Structure Without Supervision](../specialist/entropy-adaptive-sinkhorn.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/eisenberg26a.html)
- [Learning to Approximate Uniform Facility Location via Graph Neural Networks](../specialist/gnn-uniform-facility-location.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/qian26d.html)
- [Learning to Search and Searching to Learn for Generalization in Planning](../specialist/self-improving-wa-star.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/aichmuller26a.html)
- [LoRe: Adaptive Interaction-Evaluation Routing with Per-step Interaction Budgets for Iterative Graph Solvers](../specialist/lore.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/li26gz.html)
- [Neural QAOA$^2$: Differentiable Joint Graph Partitioning and Parameter Initialization for Quantum Combinatorial Optimization](../generalist/neural-qaoa-squared.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/zheng26x.html)
- [Optimal Transport–Guided Stochastic Control for Graph Combinatorial Optimization](../specialist/ot-stochastic-control-co.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/huang26bz.html)
- [PoMtVRS: Preference-Optimized Multi-Task Vehicle Routing Solver with Preference Gating](../generalist/pomt-vrs.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/meng26m.html)
- [Position: Neural Approximation Is Rarely Justified for Hard Combinatorial Problems](../studies/neural-approximation-position.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/chakraborty26d.html)
- [Preference-Modulated Structural Attention for Multi-Objective Combinatorial Optimization](../specialist/pmsa.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/jia26l.html)
- [Problem Distributions as Tasks: Repurposing Meta Learning for Generative Combinatorial Optimization towards Multi-task Pretraining and Adaptation](../generalist/m2genco.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/pan26h.html)
- [RL-SPH: Learning to Achieve Feasible Solutions for Integer Linear Programs](../generalist/rl-sph.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/lee26ac.html)
- [RulePlanner: All-in-One Reinforcement Learner for Unifying Design Rules in 3D Floorplanning](../specialist/ruleplanner.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/zhong26f.html)
- [Theoretical Challenges in Learning for Branch-and-Cut](../studies/branch-and-cut-theory-challenges.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/cheng26a.html)
- [Towards Generative Graph Matching for Graph Edit Distance Computation](../specialist/diffged.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/huang26bi.html)
- [Unsupervised Diffusion Solver for Combinatorial Optimization via Combinatorial Adjoint Matching](../specialist/cam-diffusion-co.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/feng26o.html)
- [Unsupervised Neural Langevin Sampler for Mixed Integer Linear Programming](../specialist/unls-milp.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/huang26j.html)
- [URS: A Unified Neural Routing Solver for Cross-Problem Zero-Shot Generalization](../generalist/urs.md) — ICML 2026 · [正式论文](https://proceedings.mlr.press/v306/zhou26bg.html)
- [Instance-Conditioned Adaptation for Large-Scale Generalization of Neural Routing Solver](../specialist/icam.md) — IEEE Transactions on Intelligent Transportation Systems 2026 · [正式论文](https://ieeexplore.ieee.org/document/11456440/)
- [A Unified Knowledge Embedded Reinforcement Learning-based Framework for Generalized Capacitated Vehicle Routing Problems](../generalist/a-unified-knowledge-embedded-reinforcement-learning-based-framework-for-generalized-ca.md) — IJCAI 2026 · [正式论文](https://www.ijcai.org/proceedings/2026/691)
- [Learning with Foresight: Enhancing Neural Routing Policy via Multi-Node Lookahead Prediction](../specialist/learning-with-foresight-enhancing-neural-routing-policy-via-multi-node-lookahead-predi.md) — IJCAI 2026 · [正式论文](https://www.ijcai.org/proceedings/2026/686)
- [LLM-guided Cutting-plane Management for Mixed-integer Linear Programming](../generalist/llm-guided-cutting-plane-management-for-mixed-integer-linear-programming.md) — IJCAI 2026 · [正式论文](https://www.ijcai.org/proceedings/2026/736)
- [Physics-Guided Geometric Diffusion for Macro Placement Generation](../specialist/physics-guided-geometric-diffusion-for-macro-placement-generation.md) — IJCAI 2026 · [正式论文](https://www.ijcai.org/proceedings/2026/735)
- [PID-Controlled Constrained RL for Hub-based Joint Pricing, Dispatching, and Routing with Service Guarantees](../specialist/pid-controlled-constrained-rl-for-hub-based-joint-pricing-dispatching-and-routing-with.md) — IJCAI 2026 · [正式论文](https://www.ijcai.org/proceedings/2026/246)
- [RODIS: Robust Diffusion Solver to Dataset Quality in Combinatorial Optimization](../specialist/rodis-robust-diffusion-solver-to-dataset-quality-in-combinatorial-optimization.md) — IJCAI 2026 · [正式论文](https://www.ijcai.org/proceedings/2026/586)
- [AGDN: Learning to Solve Traveling Salesman Problem with Anisotropic Graph Diffusion Network](../specialist/agdn-learning-to-solve-traveling-salesman-problem-with-anisotropic-graph-diffusion-net.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770855.3817789)
- [Approximation and Learning-based Algorithms for Influence Maximization in Multilayer Social Networks](../specialist/approximation-and-learning-based-algorithms-for-influence-maximization-in-multilayer-s.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770855.3817870)
- [Beyond Static Priors: Dynamic Neural Guidance for Large-Scale Ant Colony Optimization](../specialist/beyond-static-priors-dynamic-neural-guidance-for-large-scale-ant-colony-optimization.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770855.3817893)
- [Effective Online 3D Bin Packing with Lookahead Parcels Using Monte Carlo Tree Search](../specialist/effective-online-3d-bin-packing-with-lookahead-parcels-using-monte-carlo-tree-search.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770854.3783946)
- [Hierarchical Reinforcement Learning for Cooperative Air-Ground Delivery in Urban System](../specialist/hierarchical-reinforcement-learning-for-cooperative-air-ground-delivery-in-urban-syste.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770855.3818964)
- [Learning to Reduce Search Space for Generalizable Neural Routing Solver](../specialist/l2r.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770855.3818173)
- [RIDGECUT: Learning Graph Partitioning with Rings and Wedges](../specialist/ridgecut-learning-graph-partitioning-with-rings-and-wedges.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770855.3818103)
- [SOAR: Real-Time Joint Optimization of Order Allocation and Robot Scheduling in Robotic Mobile Fulfillment Systems](../specialist/soar-real-time-joint-optimization-of-order-allocation-and-robot-scheduling-in-robotic.md) — KDD 2026 · [正式论文](https://doi.org/10.1145/3770855.3818484)
- [Destroy and Repair Using Hyper-Graphs for Routing](../specialist/drhg.md) — AAAI 2025 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/34018)
- [DualOpt: A Dual Divide-and-Optimize Algorithm for the Large-scale Traveling Salesman Problem](../specialist/dualopt-a-dual-divide-and-optimize-algorithm-for-the-large-scale-traveling-salesman-pr.md) — AAAI 2025 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/34926)
- [Fast and Interpretable Mixed-Integer Linear Program Solving by Learning Model Reduction](../specialist/fast-and-interpretable-mixed-integer-linear-program-solving-by-learning-model-reductio.md) — AAAI 2025 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/34916)
- [MAPF-GPT: Imitation Learning for Multi-Agent Pathfinding at Scale](../generalist/mapf-gpt-imitation-learning-for-multi-agent-pathfinding-at-scale.md) — AAAI 2025 · [正式论文](https://doi.org/10.1609/aaai.v39i22.34477)
- [Neural Combinatorial Optimization for Stochastic Flexible Job Shop Scheduling Problems](../specialist/neural-combinatorial-optimization-for-stochastic-flexible-job-shop-scheduling-problems.md) — AAAI 2025 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/34870)
- [Scaling Combinatorial Optimization Neural Improvement Heuristics with Online Search and Adaptation](../specialist/scaling-combinatorial-optimization-neural-improvement-heuristics-with-online-search-an.md) — AAAI 2025 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/34921)
- [SORREL: Suboptimal-Demonstration-Guided Reinforcement Learning for Learning to Branch](../specialist/sorrel-suboptimal-demonstration-guided-reinforcement-learning-for-learning-to-branch.md) — AAAI 2025 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/33219)
- [Adversarial Generative Flow Network for Solving Vehicle Routing Problems](../specialist/agfn.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b210c387381713a14a4f5a607aff3520-Abstract-Conference.html)
- [Apollo-MILP: An Alternating Prediction-Correction Neural Solving Framework for Mixed-Integer Linear Programming](../specialist/apollo-milp.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/ebcdb4d0372ebbdd0e6a7dce9662b6b4-Abstract-Conference.html)
- [Boosting Neural Combinatorial Optimization for Large-Scale Vehicle Routing Problems](../specialist/sil.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/264f2e10479c9370972847e96107db7f-Abstract-Conference.html)
- [BTBS-LNS: Binarized-Tightening, Branch and Search on Learning LNS Policies for MIP](../specialist/btbs-lns.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7eca17ef54789b0663cab421f2e9dbf5-Abstract-Conference.html)
- [Efficient and Robust Neural Combinatorial Optimization via Wasserstein-Based Coresets](../specialist/wasserstein-coresets-nco.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/b629d824041acb94837bf4249723bd40-Abstract-Conference.html)
- [GOAL: A Generalist Combinatorial Optimization Agent Learner](../generalist/goal.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/826aea2253363fe04e8c4991b2a8869e-Abstract-Conference.html)
- [Graph Assisted Offline-Online Deep Reinforcement Learning for Dynamic Workflow Scheduling](../specialist/goodrl.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/370fa2e691f57eb319bc263a07dad4a5-Abstract-Conference.html)
- [Learning Partial Graph Matching via Optimal Partial Transport](../specialist/opgm.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/cfa8440d500a6a6867157dfd4eaff66e-Abstract-Conference.html)
- [Learning Splitting Heuristics in Divide-and-Conquer SAT Solvers with Reinforcement Learning](../specialist/rdc-sat.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/f5c683b93319b82689af3afc71257df2-Abstract-Conference.html)
- [Learning to Explore and Exploit with GNNs for Unsupervised Combinatorial Optimization](../specialist/x2gnn.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/e944bacecce6b06374ac39b260348db0-Abstract-Conference.html)
- [Learning to Select Nodes in Branch and Bound with Sufficient Tree Representation](../specialist/trgnn-node-selection.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/82f625a28d822d2748b9f5c4f9a89bb9-Abstract-Conference.html)
- [Learning-Guided Rolling Horizon Optimization for Long-Horizon Flexible Job-Shop Scheduling](../specialist/l-rho.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/052e2404709e8df9dc38fbc7bfec5b80-Abstract-Conference.html)
- [Neural Multi-Objective Combinatorial Optimization via Graph-Image Multimodal Fusion](../specialist/gimf.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/546888acdf5dd477333d6ebb88ff72bf-Abstract-Conference.html)
- [PolyNet: Learning Diverse Solution Strategies for Neural Combinatorial Optimization](../specialist/polynet.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/c7b9810b2e27bccdc8d605a3a54c8cd6-Abstract-Conference.html)
- [Rethinking Light Decoder-based Solvers for Vehicle Routing Problems](../generalist/reld.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/447ac93bf22099aa346a45577376492d-Abstract-Conference.html)
- [Rethinking Neural Multi-Objective Combinatorial Optimization via Neat Weight Embedding](../specialist/neat-weight-embedding.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/78efbc5386c5a7c241e7fcc482d3c3dc-Abstract-Conference.html)
- [Scalable Discrete Diffusion Samplers: Combinatorial Optimization and Statistical Physics](../specialist/sdds.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/d87eadbe6114b768e76c5d5e8eb39388-Abstract-Conference.html)
- [Sequential Stochastic Combinatorial Optimization Using Hierarchal Reinforcement Learning](../specialist/ws-option.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/38b787fc530d0b31825827e2cc306656-Abstract-Conference.html)
- [UniCO: On Unified Combinatorial Optimization via Problem Reduction to Matrix-Encoded General TSP](../generalist/unico.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/3acefc84f1355f5f974195bb9f6014a4-Abstract-Conference.html)
- [Unify ML4TSP: Drawing Methodological Principles for TSP and Beyond from Streamlined Design Space of Learning and Search](../studies/ml4tspbench.md) — ICLR 2025 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2025/hash/a3dc6e903082902d8e916bb9fccbfcbc-Abstract-Conference.html)
- [A Mixed-Curvature based Pre-training Paradigm for Multi-Task Vehicle Routing Solver](../generalist/mixed-curvature.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/liu25b.html)
- [BOPO: Neural Combinatorial Optimization via Best-anchored and Objective-guided Preference Optimization](../specialist/bopo.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/liao25a.html)
- [CaDA: Cross-Problem Routing Solver with Constraint-Aware Dual-Attention](../generalist/cada.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/li25bi.html)
- [Can Transformers Reason Logically? A Study in SAT Solving](../studies/transformer-sat-reasoning.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/pan25d.html)
- [Chip Placement with Diffusion Models](../specialist/diffusion-chip-placement.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/lee25y.html)
- [COExpander: Adaptive Solution Expansion for Combinatorial Optimization](../specialist/coexpander.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/ma25r.html)
- [DSBRouter: End-to-end Global Routing via Diffusion Schrödinger Bridge](../specialist/dsbrouter.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/shi25k.html)
- [Graph-Supported Dynamic Algorithm Configuration for Multi-Objective Combinatorial Optimization](../generalist/graph-dac-moco.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/reijnen25a.html)
- [Neural Solver Selection for Combinatorial Optimization](../specialist/neural-solver-selection.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/gao25l.html)
- [Position: Graph Matching Systems Deserve Better Benchmarks](../studies/graph-matching-benchmark-position.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/roy25a.html)
- [Preference Optimization for Combinatorial Optimization Problems](../specialist/preference-optimization-co.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/pan25e.html)
- [Regularized Langevin Dynamics for Combinatorial Optimization](../specialist/rld-co.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/feng25r.html)
- [Self-Supervised Transformers as Iterative Solution Improvers for Constraint Satisfaction](../specialist/consformer.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/xu25q.html)
- [SHIELD: Multi-task Multi-distribution Vehicle Routing Solver with Sparsity and Hierarchy](../generalist/shield.md) — ICML 2025 · [正式论文](https://proceedings.mlr.press/v267/goh25a.html)
- [Distance-Aware Attention Reshaping for Enhancing Generalization of Neural Solvers](../specialist/dar.md) — IEEE Transactions on Neural Networks and Learning Systems 2025 · [正式论文](https://doi.org/10.1109/TNNLS.2025.3588209)
- [DGL: Dynamic Global-Local Information Aggregation for Scalable VRP Generalization with Self-Improvement Learning](../specialist/dgl.md) — IJCAI 2025 · [正式论文](https://www.ijcai.org/proceedings/2025/964)
- [EFormer: An Effective Edge-based Transformer for Vehicle Routing Problems](../specialist/eformer-an-effective-edge-based-transformer-for-vehicle-routing-problems.md) — IJCAI 2025 · [正式论文](https://www.ijcai.org/proceedings/2025/954)
- [Preference-based Deep Reinforcement Learning for Historical Route Estimation](../specialist/preference-based-deep-reinforcement-learning-for-historical-route-estimation.md) — IJCAI 2025 · [正式论文](https://www.ijcai.org/proceedings/2025/955)
- [Transformer-based Reinforcement Learning for Net Ordering in Detailed Routing](../specialist/transformer-based-reinforcement-learning-for-net-ordering-in-detailed-routing.md) — IJCAI 2025 · [正式论文](https://www.ijcai.org/proceedings/2025/1055)
- [An Efficient Diffusion-based Non-Autoregressive Solver for Traveling Salesman Problem](../specialist/an-efficient-diffusion-based-non-autoregressive-solver-for-traveling-salesman-problem.md) — KDD 2025 · [正式论文](https://doi.org/10.1145/3690624.3709343)
- [Diversity Optimization for Travelling Salesman Problem via Deep Reinforcement Learning](../specialist/diversity-optimization-for-travelling-salesman-problem-via-deep-reinforcement-learning.md) — KDD 2025 · [正式论文](https://doi.org/10.1145/3690624.3709181)
- [Improving Subgraph Matching by Combining Algorithms and Graph Neural Networks](../specialist/improving-subgraph-matching-by-combining-algorithms-and-graph-neural-networks.md) — KDD 2025 · [正式论文](https://doi.org/10.1145/3711896.3737006)
- [RL4CO: An Extensive Reinforcement Learning for Combinatorial Optimization Benchmark](../studies/rl4co-an-extensive-reinforcement-learning-for-combinatorial-optimization-benchmark.md) — KDD 2025 · [正式论文](https://doi.org/10.1145/3711896.3737433)
- [$\texttt{STRCMP}$: Integrating Graph Structural Priors with Language Models for Combinatorial Optimization](../specialist/strcmp.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/57f2d605790f01cc2d89699b0bf3b33e-Abstract-Conference.html)
- [A machine learning approach that beats Rubik's cubes](../specialist/cayleypy-cube.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/fb82011040977c7712409fbdb5456647-Abstract-Conference.html)
- [A Markov Decision Process for Variable Selection in Branch & Bound](../specialist/bbmdp.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/923464fb9fc9e0e0cc64878b52e09ed2-Abstract-Conference.html)
- [Benchmarking End-To-End Performance of AI-Based Chip Placement Algorithms](../studies/chipbench.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1cba8502063fab9df252a63968691768-Abstract-Datasets_and_Benchmarks_Track.html)
- [BIPNN: Learning to Solve Binary Integer Programming via Hypergraph Neural Networks](../specialist/bipnn.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/8693ee1ea821666f8569228d1ab38baf-Abstract-Conference.html)
- [Bridging Crypto with ML-based Solvers: the SAT Formulation and Benchmarks](../studies/sat4cryptobench.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/69d97a6493fbf016fff0a751f253ad18-Abstract-Datasets_and_Benchmarks_Track.html)
- [Complexity Scaling Laws for Neural Models using Combinatorial Optimization](../studies/complexity-scaling-nco.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1c9dbe4d49fa0ac833959230a9895c06-Abstract-Conference.html)
- [CORE: Collaborative Optimization with Reinforcement Learning and Evolutionary Algorithm for Floorplanning](../specialist/core-floorplanning.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/cc0f00fd7c873fe2b196529e19b1a6bf-Abstract-Conference.html)
- [Differentiable extensions with rounding guarantees for combinatorial optimization over permutations](../studies/birkhoff-extension.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/9840235bd522f0f067f306ddfd6d1ca1-Abstract-Conference.html)
- [Dynamic Configuration for Cutting Plane Separators via Reinforcement Learning on Incremental Graph](../generalist/dynsep.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/c88f029bcf6d62b57a17ae88101ac7d0-Abstract-Conference.html)
- [Enigmata:  Scaling Logical Reasoning in Large Language Models with Synthetic Verifiable Puzzles](../studies/enigmata.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/058460c719f190500568b341bd06875f-Abstract-Conference.html)
- [Flow Field Reconstruction with Sensor Placement Policy Learning](../specialist/sensor-placement-ppo.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/9708c7d3a0fef3710f33ba05a74e10b3-Abstract-Conference.html)
- [Fractional Langevin Dynamics for Combinatorial Optimization via Polynomial-Time Escape](../specialist/fld-co.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/989a74f28a550b71c77067ba04e9d081-Abstract-Conference.html)
- [Generalization Guarantees for Learning Score-Based Branch-and-Cut Policies in Integer Programming](../studies/score-bc-generalization.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/ac04e54e0a2d1927d60709019e4e7870-Abstract-Conference.html)
- [Generation as Search Operator for Test-Time Scaling of Diffusion-based Combinatorial Optimization](../specialist/gensco.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8e9869fa827226ff68db9290659a20c-Abstract-Conference.html)
- [Geometric Algorithms for Neural Combinatorial Optimization with Constraints](../specialist/geometric-constrained-nco.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/713939ee5a7b14a6fecf69e692ec3799-Abstract-Conference.html)
- [Heterogeneous Graph Transformers for Simultaneous Mobile Multi-Robot Task Allocation and Scheduling under Temporal Constraints](../specialist/hm-matas.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/82a227f51354b7ebafea51023d547d29-Abstract-Conference.html)
- [Improving Generalization of Neural Combinatorial Optimization for Vehicle Routing Problems via Test-Time Projection Learning](../specialist/ttpl.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/6edd46d69ef91f4555d67f7b321d6902-Abstract-Conference.html)
- [Large Language Models as End-to-end Combinatorial Optimization Solvers](../generalist/llm-co-solver.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f0c6c93e1dbff84daf6082fef7e1a094-Abstract-Conference.html)
- [Learning Memory-Enhanced Improvement Heuristics for Flexible Job Shop Scheduling](../specialist/mistar.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/77629f2df5ef97ad967157c69cd8af7b-Abstract-Conference.html)
- [Learning to Insert for Constructive Neural Vehicle Routing Solver](../specialist/l2c-insert.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/7e3192a54b4ce5855a90dc182eac2036-Abstract-Conference.html)
- [Memory-Enhanced Neural Solvers for Routing Problems](../specialist/memento.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/2f888eaccece0de24cc29d3ed02fd54b-Abstract-Conference.html)
- [ML4CO-Bench-101: Benchmark Machine Learning for Classic Combinatorial Problems on Graphs](../studies/ml4co-bench-101.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/aa9340420e8d78021c35ae984e1bda85-Abstract-Datasets_and_Benchmarks_Track.html)
- [MTL-KD: Multi-Task Learning Via Knowledge Distillation for Generalizable Neural Vehicle Routing Solver](../generalist/mtl-kd.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/899c6a43b9976e1077522fe5a39cafa3-Abstract-Conference.html)
- [OPTFM: A Scalable Multi-View Graph Transformer for Hierarchical Pre-Training in Combinatorial Optimization](../generalist/optfm.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/54801e196796134a2b0ae5e8adef502f-Abstract-Conference.html)
- [PhyBlock: A Progressive Benchmark for Physical Understanding and Planning via 3D Block Assembly](../studies/phyblock.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/9e97206b14d09c0da5c7fea47a67c6ac-Abstract-Datasets_and_Benchmarks_Track.html)
- [Preference-Driven Multi-Objective Combinatorial Optimization with Conditional Computation](../specialist/pocco.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/10fc83943b4540a9524af6fc67a23fef-Abstract-Conference.html)
- [Probing Neural Combinatorial Optimization Models](../studies/cs-probing-nco.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/becf96dcee66f9df08169e4c96bbbd8c-Abstract-Conference.html)
- [Reinforcement learning for one-shot DAG scheduling with comparability identification and dense reward](../specialist/comparability-dag-scheduling.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/dc16950e510bcd573783f5c2d7d8cc31-Abstract-Conference.html)
- [Rethinking Neural Combinatorial Optimization for Vehicle Routing Problems with Different Constraint Tightness Degrees](../specialist/constraint-tightness.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8fc784104e74f1b427865d30ad22931-Abstract-Conference.html)
- [RoME: Domain-Robust Mixture-of-Experts for MILP Solution Prediction across Domains](../generalist/rome-milp.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/3071ed272658c4418309962ba7b94ec8-Abstract-Conference.html)
- [Structure-Aware Cooperative Ensemble Evolutionary Optimization on Combinatorial Problems with Multimodal Large Language Models](../generalist/mllm-ensemble-evolution.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/0cda0892c74edef6bc73e46a4480511f-Abstract-Conference.html)
- [Structured Reinforcement Learning for Combinatorial Decision-Making](../specialist/structured-rl.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/fe100e5e7bca984803f0e4c6e94a6a88-Abstract-Conference.html)
- [StruDiCO: Structured Denoising Diffusion with Gradient-free Inference-stage Boosting for Memory and Time Efficient Combinatorial Optimization](../specialist/strudico.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/6728fcf94660c59c938319a6833a6073-Abstract-Conference.html)
- [Teaching Transformers to Solve Combinatorial Problems through Efficient Trial & Error](../specialist/efficient-trial-error.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/c1a2da8d493d37e9e65ebfb23018e234-Abstract-Conference.html)
- [Towards Generalizable Multi-Policy Optimization with Self-Evolution for Job Scheduling](../generalist/mp-asil.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/2330c4be5e12c504705ba1db8a507966-Abstract-Conference.html)
- [Towards Realistic Earth-Observation Constellation Scheduling: Benchmark and Methodology](../studies/aeos-bench.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/7c40c5050bd029a3ea7ff8b01412f735-Abstract-Conference.html)
- [Towards Unsupervised Training of Matching-based Graph Edit Distance Solver via Preference-aware GAN](../specialist/gedranker.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/ebf8764ecf0688cdd9fe1e5a9c525d0d-Abstract-Conference.html)
- [Train on Pins and Test on Obstacles for Rectilinear Steiner Minimum Tree](../specialist/oarest.md) — NeurIPS 2025 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2025/hash/ec370e882e8a02be955679ddbd2731b8-Abstract-Conference.html)
- [Neural Deconstruction Search for Vehicle Routing Problems](../specialist/nds.md) — TMLR 2025 · [正式论文](https://openreview.net/forum?id=bCmEP1Ltwq)
- [RouteFinder: Towards Foundation Models for Vehicle Routing Problems](../generalist/routefinder.md) — TMLR 2025 · [正式论文](https://openreview.net/forum?id=QzGLoaOPiY)
- [AERO: Enhancing Sharding Blockchain via Deep Reinforcement Learning for Account Migration](../specialist/aero-enhancing-sharding-blockchain-via-deep-reinforcement-learning-for-account-migrati.md) — WWW 2025 · [正式论文](https://doi.org/10.1145/3696410.3714926)
- [Unified and Generalizable Reinforcement Learning for Facility Location Problems on Graphs](../generalist/unified-and-generalizable-reinforcement-learning-for-facility-location-problems-on-gra.md) — WWW 2025 · [正式论文](https://doi.org/10.1145/3696410.3714812)
- [COMBHelper: A Neural Approach to Reduce Search Space for Graph Combinatorial Problems](../specialist/combhelper-a-neural-approach-to-reduce-search-space-for-graph-combinatorial-problems.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/30070)
- [Discrete Cycle-Consistency Based Unsupervised Deep Graph Matching](../specialist/discrete-cycle-consistency-based-unsupervised-deep-graph-matching.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/28332)
- [Distilling Autoregressive Models to Obtain High-Performance Non-autoregressive Solvers for Vehicle Routing Problems with Faster Inference Speed](../specialist/distilling-autoregressive-models-to-obtain-high-performance-non-autoregressive-solvers.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/30008)
- [EnMatch: Matchmaking for Better Player Engagement via Neural Combinatorial Optimization](../specialist/enmatch-matchmaking-for-better-player-engagement-via-neural-combinatorial-optimization.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/28760)
- [Equity-Transformer: Solving NP-Hard Min-Max Routing Problems as Sequential Generation with Equity Context](../specialist/equity-transformer-solving-np-hard-min-max-routing-problems-as-sequential-generation-w.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/30007)
- [GLOP: Learning Global Partition and Local Construction for Solving Large-Scale Routing Problems in Real-Time](../specialist/glop.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/30009)
- [Learning to Optimize Permutation Flow Shop Scheduling via Graph-Based Imitation Learning](../specialist/learning-to-optimize-permutation-flow-shop-scheduling-via-graph-based-imitation-learni.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/29998)
- [Learning to Stop Cut Generation for Efficient Mixed-Integer Linear Programming](../specialist/learning-to-stop-cut-generation-for-efficient-mixed-integer-linear-programming.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/30064)
- [NN-Steiner: A Mixed Neural-Algorithmic Approach for the Rectilinear Steiner Minimum Tree Problem](../specialist/nn-steiner-a-mixed-neural-algorithmic-approach-for-the-rectilinear-steiner-minimum-tre.md) — AAAI 2024 · [正式论文](https://doi.org/10.1609/aaai.v38i12.29200)
- [SayCanPay: Heuristic Planning with Large Language Models Using Learnable Domain Knowledge](../specialist/saycanpay-heuristic-planning-with-large-language-models-using-learnable-domain-knowled.md) — AAAI 2024 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/29991)
- [DiffAssemble: A Unified Graph-Diffusion Model for 2D and 3D Reassembly](../specialist/diffassemble-a-unified-graph-diffusion-model-for-2d-and-3d-reassembly.md) — CVPR 2024 · [正式论文](https://openaccess.thecvf.com/content/CVPR2024/html/Scarpellini_DiffAssemble_A_Unified_Graph-Diffusion_Model_for_2D_and_3D_Reassembly_CVPR_2024_paper.html)
- [SG-PGM: Partial Graph Matching Network with Semantic Geometric Fusion for 3D Scene Graph Alignment and Its Downstream Tasks](../specialist/sg-pgm-partial-graph-matching-network-with-semantic-geometric-fusion-for-3d-scene-grap.md) — CVPR 2024 · [正式论文](https://openaccess.thecvf.com/content/CVPR2024/html/Xie_SG-PGM_Partial_Graph_Matching_Network_with_Semantic_Geometric_Fusion_for_CVPR_2024_paper.html)
- [Solving Masked Jigsaw Puzzles with Diffusion Vision Transformers](../specialist/solving-masked-jigsaw-puzzles-with-diffusion-vision-transformers.md) — CVPR 2024 · [正式论文](https://openaccess.thecvf.com/content/CVPR2024/html/Liu_Solving_Masked_Jigsaw_Puzzles_with_Diffusion_Vision_Transformers_CVPR_2024_paper.html)
- [LLMCO4MR: LLMs-aided Neural Combinatorial Optimization for Ancient Manuscript Restoration from Fragments with Case Studies on Dunhuang](../specialist/llmco4mr-llms-aided-neural-combinatorial-optimization-for-ancient-manuscript-restorati.md) — ECCV 2024 · [正式论文](https://www.ecva.net/papers/eccv_2024/papers_ECCV/html/9585_ECCV_2024_paper.php)
- [CAMBranch: Contrastive Learning with Augmented MILPs for Branching](../specialist/cambranch.md) — ICLR 2024 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/hash/7b39f4512a2e3899edcc59c7501f3cd4-Abstract-Conference.html)
- [Deep Reinforcement Learning Guided Improvement Heuristic for Job Shop Scheduling](../specialist/l2s-jssp.md) — ICLR 2024 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/hash/c75abb33341363ee874a71f81dc45a3a-Abstract-Conference.html)
- [L2P-MIP: Learning to Presolve for Mixed Integer Programming](../generalist/l2p-mip.md) — ICLR 2024 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/hash/1e6e0c2edb159b2ad2f9419b898f56d3-Abstract-Conference.html)
- [Learning to solve Class-Constrained Bin Packing Problems via Encoder-Decoder Model](../specialist/ccbpp-encoder-decoder.md) — ICLR 2024 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/hash/6b8dfb8c0c12e6fafc6c256cb08a5ca7-Abstract-Conference.html)
- [M3C: A Framework towards Convergent, Flexible, and Unsupervised Learning of Mixture Graph Matching and Clustering](../specialist/m3c.md) — ICLR 2024 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/hash/2030d35841f8617ab22cca913f55697e-Abstract-Conference.html)
- [Rethinking Branching on Exact Combinatorial Optimization Solver: The First Deep Symbolic Discovery Framework](../specialist/symb4co.md) — ICLR 2024 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/hash/da669dfd3c36c93905a17ddba01eef06-Abstract-Conference.html)
- [Towards Imitation Learning to Branch for MIP: A Hybrid Reinforcement Learning based Sample Augmentation Approach](../specialist/hrl-aug-branching.md) — ICLR 2024 · [正式论文](https://proceedings.iclr.cc/paper_files/paper/2024/hash/850cc7c4e5619fdc2f30c4eaa5ce3c17-Abstract-Conference.html)
- [A Diffusion Model Framework for Unsupervised Neural Combinatorial Optimization](../specialist/diffuco.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/sanokowski24a.html)
- [Contrastive Predict-and-Search for Mixed Integer Linear Programs](../specialist/conpas.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/huang24f.html)
- [DPN: Decoupling Partition and Navigation for Neural Solvers of Min-max Vehicle Routing Problems](../specialist/dpn.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/zheng24m.html)
- [Effective Federated Graph Matching](../specialist/ufgm.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/zhou24v.html)
- [Extending Test-Time Augmentation with Metamorphic Relations for Combinatorial Problems](../studies/magg.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/wei24i.html)
- [GenCO: Generating Diverse Designs with Combinatorial Constraints](../specialist/genco.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/ferber24a.html)
- [INViT: A Generalizable Routing Problem Solver with Invariant Nested View Transformer](../specialist/invit.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/fang24c.html)
- [Learning Solution-Aware Transformers for Efficiently Solving Quadratic Assignment Problem](../specialist/sawt.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/tan24d.html)
- [Learning to Remove Cuts in Integer Linear Programming](../specialist/learn-remove-cuts.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/puigdemont24a.html)
- [MVMoE: Multi-Task Vehicle Routing Solver with Mixture-of-Experts](../generalist/mvmoe.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/zhou24c.html)
- [Position: Rethinking Post-Hoc Search-Based Neural Approaches for Solving Large-Scale Traveling Salesman Problems](../studies/softdist.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/xia24f.html)
- [Predicting Lagrangian Multipliers for Mixed Integer Linear Programs](../specialist/learn-lagrangian-multipliers.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/demelas24a.html)
- [Reinforcement Learning within Tree Search for Fast Macro Placement](../specialist/efficientplace.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/geng24b.html)
- [Symmetric Replay Training: Enhancing Sample Efficiency in Deep Reinforcement Learning for Combinatorial Optimization](../specialist/symmetric-replay-training.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/kim24o.html)
- [Tackling Prevalent Conditions in Unsupervised Combinatorial Optimization: Cardinality, Minimum, Covering, and More](../specialist/ucom2.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/bu24b.html)
- [Towards General Algorithm Discovery for Combinatorial Optimization: Learning Symbolic Branching Policy from Bipartite Graph](../specialist/gs4co.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/kuang24a.html)
- [Training Greedy Policy for Proposal Batch Selection in Expensive Multi-Objective Combinatorial Optimization](../specialist/greedy-policy-moco.md) — ICML 2024 · [正式论文](https://proceedings.mlr.press/v235/lee24w.html)
- [Learning Feature Embedding Refiner for Solving Vehicle Routing Problems](../specialist/fer.md) — IEEE Transactions on Neural Networks and Learning Systems 2024 · [正式论文](https://ieeexplore.ieee.org/document/10160045/)
- [ASP: Learn a Universal Neural Solver!](../specialist/asp.md) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2024 · [正式论文](https://doi.org/10.1109/TPAMI.2024.3352096)
- [Efficient Neural Collaborative Search for Pickup and Delivery Problems](../specialist/ncs.md) — IEEE Transactions on Pattern Analysis and Machine Intelligence 2024 · [正式论文](https://doi.org/10.1109/TPAMI.2024.3450850)
- [A Neural Column Generation Approach to the Vehicle Routing Problem with Two-Dimensional Loading and Last-In-First-Out Constraints](../specialist/a-neural-column-generation-approach-to-the-vehicle-routing-problem-with-two-dimensiona.md) — IJCAI 2024 · [正式论文](https://www.ijcai.org/proceedings/2024/218)
- [Contrastive General Graph Matching with Adaptive Augmentation Sampling](../specialist/contrastive-general-graph-matching-with-adaptive-augmentation-sampling.md) — IJCAI 2024 · [正式论文](https://www.ijcai.org/proceedings/2024/412)
- [Cross-Problem Learning for Solving Vehicle Routing Problems](../specialist/cross-problem-learning.md) — IJCAI 2024 · [正式论文](https://www.ijcai.org/proceedings/2024/769)
- [MARCO: A Memory-Augmented Reinforcement Framework for Combinatorial Optimization](../specialist/marco-a-memory-augmented-reinforcement-framework-for-combinatorial-optimization.md) — IJCAI 2024 · [正式论文](https://www.ijcai.org/proceedings/2024/766)
- [Prompt Learning for Generalized Vehicle Routing](../specialist/prompt-learning-for-generalized-vehicle-routing.md) — IJCAI 2024 · [正式论文](https://www.ijcai.org/proceedings/2024/771)
- [Towards a Theory of Machine Learning on Graphs and its Applications in Combinatorial Optimization](../studies/towards-a-theory-of-machine-learning-on-graphs-and-its-applications-in-combinatorial-o.md) — IJCAI 2024 · [正式论文](https://www.ijcai.org/proceedings/2024/981)
- [Towards Generalizable Neural Solvers for Vehicle Routing Problems via Ensemble with Transferrable Local Policy](../specialist/elg.md) — IJCAI 2024 · [正式论文](https://www.ijcai.org/proceedings/2024/764)
- [GraSS: Combining Graph Neural Networks with Expert Knowledge for SAT Solver Selection](../specialist/grass-combining-graph-neural-networks-with-expert-knowledge-for-sat-solver-selection.md) — KDD 2024 · [正式论文](https://doi.org/10.1145/3637528.3671627)
- [Hierarchical Neural Constructive Solver for Real-world TSP Scenarios](../specialist/hncs.md) — KDD 2024 · [正式论文](https://doi.org/10.1145/3637528.3672053)
- [Influence Maximization via Graph Neural Bandits](../specialist/influence-maximization-via-graph-neural-bandits.md) — KDD 2024 · [正式论文](https://doi.org/10.1145/3637528.3671983)
- [Multi-Task Learning for Routing Problem with Cross-Problem Zero-Shot Generalization](../generalist/mtpomo.md) — KDD 2024 · [正式论文](https://doi.org/10.1145/3637528.3672040)
- [NeuroCut: A Neural Approach for Robust Graph Partitioning](../specialist/neurocut-a-neural-approach-for-robust-graph-partitioning.md) — KDD 2024 · [正式论文](https://doi.org/10.1145/3637528.3671815)
- [A Structure-Aware Framework for Learning Device Placements on Computation Graphs](../specialist/hsdag-placement.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/94bd1b8c906494bada774096bd0fdd73-Abstract-Conference.html)
- [Causal language modeling can elicit search and reasoning capabilities on logic puzzles](../specialist/causal-lm-logic-puzzles.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/67b31ca159553d5593e62d7b998d63ea-Abstract-Conference.html)
- [Controlling Continuous Relaxation for Combinatorial Optimization](../specialist/cra-co.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/54191f424e9013fc1d7b923f6e45dff4-Abstract-Conference.html)
- [Fast T2T: Optimization Consistency Speeds Up Diffusion-Based Training-to-Testing Solving for Combinatorial Optimization](../specialist/fast-t2t.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/352b13f01566ae34affacc60e98c16af-Abstract-Conference.html)
- [FlexPlanner: Flexible 3D Floorplanning via Deep Reinforcement Learning in Hybrid Action Space with Multi-Modality Representation](../specialist/flexplanner.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/585e9cf25585612ac27b535457116513-Abstract-Conference.html)
- [GLinSAT: The General Linear Satisfiability Neural Network Layer By Accelerated Gradient Descent](../specialist/glinsat.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/dd73f39426a03131c38c8d943153d44b-Abstract-Conference.html)
- [Learning Better Representations From Less Data For Propositional Satisfiability](../specialist/neures.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/56a225639da77e8f7c0409f6d5ba996b-Abstract-Conference.html)
- [Learning Cut Generating Functions for Integer Programming](../studies/learn-cgf.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/71008846945765893f43abe829090bf8-Abstract-Conference.html)
- [Learning Plaintext-Ciphertext Cryptographic Problems via ANF-based SAT Instance Representation](../specialist/cryptoanfnet.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/494f876fad056843f310ad647274dd99-Abstract-Conference.html)
- [Learning to Handle Complex Constraints for Vehicle Routing Problems](../specialist/pip.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/a9d2a5fd12d34250c21b5e4fa8d906b0-Abstract-Conference.html)
- [Neur2BiLO: Neural Bilevel Optimization](../specialist/neur2bilo.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/9ddb899a45c889af822fbc49957807ec-Abstract-Conference.html)
- [NeuralSteiner: Learning Steiner Tree for Overflow-avoiding Global Routing in Chip Design](../specialist/neuralsteiner.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/e6617714485265b9380a5315bf3ba98f-Abstract-Conference.html)
- [PUZZLES: A Benchmark for Neural Algorithmic Reasoning](../studies/puzzles-benchmark.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/e5d1eaadeed651ba1021c09149db4b92-Abstract-Datasets_and_Benchmarks_Track.html)
- [Re-assembling the past: The RePAIR dataset and benchmark for real world 2D and 3D puzzle solving](../studies/repair-benchmark.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/3507ec8d7d6895eb9feb87a2098abe11-Abstract-Datasets_and_Benchmarks_Track.html)
- [Rethinking the Capacity of Graph Neural Networks for Branching Strategy](../studies/gnn-branching-capacity.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/dff528ce3e1390c88f10bbf5e722a241-Abstract-Conference.html)
- [Sample Complexity of Algorithm Selection Using Neural Networks and Its Applications to Branch-and-Cut](../studies/neural-algorithm-selection-theory.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/2c9d78ed62ff5bf2377c3840188114c0-Abstract-Conference.html)
- [Self-Guiding Exploration for Combinatorial Problems](../generalist/self-guiding-exploration.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/eb9120be0dcaac0aec66d2e75deb69dd-Abstract-Conference.html)
- [Self-Labeling the Job Shop Scheduling Problem](../specialist/slim-job-shop.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/be8987a75afeeadfa65007cf7ee25de0-Abstract-Conference.html)
- [SymILO: A Symmetry-Aware Learning Framework for Integer Linear Optimization](../specialist/symilo.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/2b94c01ad2b79432f9499501f8754aee-Abstract-Conference.html)
- [UDC: A Unified Neural Divide-and-Conquer Framework for Large-Scale Combinatorial Optimization Problems](../specialist/udc.md) — NeurIPS 2024 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2024/hash/0b8e4c8468273ee3bafb288229c0acbc-Abstract-Conference.html)
- [Self-Improvement for Neural Combinatorial Optimization: Sample Without Replacement, but Improvement](../specialist/gumbeldore.md) — TMLR 2024 · [正式论文](https://openreview.net/forum?id=agT8ojoH0X)
- [SPRING: Improving the Throughput of Sharding Blockchain via Deep Reinforcement Learning Based State Placement](../specialist/spring-improving-the-throughput-of-sharding-blockchain-via-deep-reinforcement-learning.md) — WWW 2024 · [正式论文](https://doi.org/10.1145/3589334.3645386)
- [H-TSP: Hierarchically Solving the Large-Scale Traveling Salesman Problem](../specialist/h-tsp.md) — AAAI 2023 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/26120)
- [LIMIP: Lifelong Learning to Solve Mixed Integer Programs](../generalist/limip-lifelong-learning-to-solve-mixed-integer-programs.md) — AAAI 2023 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/26086)
- [Pointerformer: Deep Reinforced Multi-Pointer Transformer for the Traveling Salesman Problem](../specialist/pointerformer.md) — AAAI 2023 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/25982)
- [Self-Supervised Bidirectional Learning for Graph Matching](../specialist/self-supervised-bidirectional-learning-for-graph-matching.md) — AAAI 2023 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/25943)
- [Siamese-Discriminant Deep Reinforcement Learning for Solving Jigsaw Puzzles with Large Eroded Gaps](../specialist/siamese-discriminant-deep-reinforcement-learning-for-solving-jigsaw-puzzles-with-large.md) — AAAI 2023 · [正式论文](https://doi.org/10.1609/aaai.v37i2.25325)
- [TransPath: Learning Heuristics for Grid-Based Pathfinding via Transformers](../specialist/transpath-learning-heuristics-for-grid-based-pathfinding-via-transformers.md) — AAAI 2023 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/26465)
- [Universe Points Representation Learning for Partial Multi-Graph Matching](../specialist/universe-points-representation-learning-for-partial-multi-graph-matching.md) — AAAI 2023 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/25290)
- [Deep Learning of Partial Graph Matching via Differentiable Top-K](../specialist/deep-learning-of-partial-graph-matching-via-differentiable-top-k.md) — CVPR 2023 · [正式论文](https://openaccess.thecvf.com/content/CVPR2023/html/Wang_Deep_Learning_of_Partial_Graph_Matching_via_Differentiable_Top-K_CVPR_2023_paper.html)
- [Graph Matching with Bi-level Noisy Correspondence](../specialist/graph-matching-with-bi-level-noisy-correspondence.md) — ICCV 2023 · [正式论文](https://openaccess.thecvf.com/content/ICCV2023/html/Lin_Graph_Matching_with_Bi-level_Noisy_Correspondence_ICCV_2023_paper.html)
- [A GNN-Guided Predict-and-Search Framework for Mixed-Integer Linear Programming](../specialist/predict-and-search.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=pHMpgT5xWaE)
- [Backpropagation through Combinatorial Algorithms: Identity with Projection Works](../studies/identity-projection.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=JZMR727O29)
- [Generalize Learned Heuristics to Solve Large-scale Vehicle Routing Problems in Real-time](../specialist/tam.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=6ZajpxqTlQ)
- [Graph-based Deterministic Policy Gradient for Repetitive Combinatorial Optimization Problems](../specialist/gdpg.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=yHIIM9BgOo)
- [Learning Cut Selection for Mixed-Integer Linear Programming via Hierarchical Sequence Model](../specialist/hem-cut-selection.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=Zob4P9bRNcK)
- [Learning to CROSS exchange to solve min-max vehicle routing problems](../generalist/neuro-cross-exchange.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=ZcnzsHC10Y)
- [Learning to Solve Constraint Satisfaction Problems with Recurrent Transformer](../specialist/recurrent-transformer-csp.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=udNhDCr2KQe)
- [Neural DAG Scheduling via One-Shot Priority Sampling](../specialist/one-shot-dag-priorities.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=WL8FlAugqQ)
- [On Representing Mixed-Integer Linear Programs by Graph Neural Networks](../studies/gnn-milp-expressivity.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=4gc3MGZra1d)
- [Revocable Deep Reinforcement Learning with Affinity Regularization for Outlier-Robust Graph Matching](../specialist/rgm.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=QjQibO3scV_)
- [Robust Scheduling with GFlowNets](../specialist/gflownet-scheduling.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=ZBUthI6wK9h)
- [ROCO: A General Framework for Evaluating Robustness of Combinatorial Optimization Solvers on Graphs](../studies/roco.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=2r6YMqz4Mml)
- [Towards One-shot Neural Combinatorial Solvers: Theoretical and Empirical Notes on the Cardinality-Constrained Case](../specialist/cardnn.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=h21yJhdzbwz)
- [Unsupervised Learning for Combinatorial Optimization Needs Meta Learning](../specialist/meta-egn.md) — ICLR 2023 · [正式论文](https://openreview.net/forum?id=-ENYHCE8zBp)
- [ChiPFormer: Transferable Chip Placement via Offline Decision Transformer](../specialist/chipformer.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/lai23c.html)
- [D2Match: Leveraging Deep Learning and Degeneracy for Subgraph Matching](../specialist/d2match.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/liu23ba.html)
- [Deep Graph Representation Learning and Optimization for Influence Maximization](../specialist/deepim.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/ling23b.html)
- [DevFormer: A Symmetric Transformer for Context-Aware Device Placement](../specialist/devformer.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/kim23h.html)
- [GNN&GBDT-Guided Fast Optimizing Framework for Large-scale Integer Programming](../specialist/gnn-gbdt-ip.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/ye23e.html)
- [LinSATNet: The Positive Linear Satisfiability Neural Networks](../specialist/linsatnet.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/wang23at.html)
- [Meta-SAGE: Scale Meta-Learning Scheduled Adaptation with Guided Exploration for Mitigating Scale Shift on Combinatorial Optimization](../specialist/meta-sage.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/son23a.html)
- [Searching Large Neighborhoods for Integer Linear Programs with Contrastive Learning](../specialist/cl-lns.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/huang23g.html)
- [SeedGNN: Graph Neural Network for Supervised Seeded Graph Matching](../specialist/seedgnn.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/yu23h.html)
- [SurCo: Learning Linear SURrogates for COmbinatorial Nonlinear Optimization Problems](../specialist/surco.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/ferber23a.html)
- [Towards Omni-generalizable Neural Methods for Vehicle Routing Problems](../specialist/omni-vrp.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/zhou23o.html)
- [Towards Quantum Machine Learning for Constrained Combinatorial Optimization: a Quantum QAP Solver](../specialist/qap-qnn.md) — ICML 2023 · [正式论文](https://proceedings.mlr.press/v202/ye23g.html)
- [Complex Contagion Influence Maximization: A Reinforcement Learning Approach](../specialist/complex-contagion-influence-maximization-a-reinforcement-learning-approach.md) — IJCAI 2023 · [正式论文](https://www.ijcai.org/proceedings/2023/614)
- [Machine Learning for Cutting Planes in Integer Programming: A Survey](../studies/machine-learning-for-cutting-planes-in-integer-programming-a-survey.md) — IJCAI 2023 · [正式论文](https://www.ijcai.org/proceedings/2023/739)
- [On the Study of Curriculum Learning for Inferring Dispatching Policies on the Job Shop Scheduling](../specialist/on-the-study-of-curriculum-learning-for-inferring-dispatching-policies-on-the-job-shop.md) — IJCAI 2023 · [正式论文](https://www.ijcai.org/proceedings/2023/594)
- [One Model, Any CSP: Graph Neural Networks as Fast Global Search Heuristics for Constraint Satisfaction](../generalist/one-model-any-csp-graph-neural-networks-as-fast-global-search-heuristics-for-constrain.md) — IJCAI 2023 · [正式论文](https://www.ijcai.org/proceedings/2023/476)
- [HardSATGEN: Understanding the Difficulty of Hard SAT Formula Generation and A Strong Structure-Hardness-Aware Baseline](../studies/hardsatgen-understanding-the-difficulty-of-hard-sat-formula-generation-and-a-strong-st.md) — KDD 2023 · [正式论文](https://doi.org/10.1145/3580305.3599837)
- [Influence Maximization with Fairness at Scale](../specialist/influence-maximization-with-fairness-at-scale.md) — KDD 2023 · [正式论文](https://doi.org/10.1145/3580305.3599847)
- [Learning to Solve Grouped 2D Bin Packing Problems in the Manufacturing Industry](../specialist/learning-to-solve-grouped-2d-bin-packing-problems-in-the-manufacturing-industry.md) — KDD 2023 · [正式论文](https://doi.org/10.1145/3580305.3599860)
- [Adjustable Robust Reinforcement Learning for Online 3D Bin Packing](../specialist/ar2l-bin-packing.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/a345ed605675c7c484e740a8ceaa6b45-Abstract-Conference.html)
- [BQ-NCO: Bisimulation Quotienting for Efficient Neural Combinatorial Optimization](../specialist/bq-nco.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/f445ba15f0f05c26e1d24f908ea78d60-Abstract-Conference.html)
- [Combinatorial Optimization with Policy Adaptation using Latent Space Search](../specialist/compass.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/18d3a2f3068d6c669dcae19ceca1bc24-Abstract-Conference.html)
- [DeepACO: Neural-enhanced Ant Systems for Combinatorial Optimization](../specialist/deepaco.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/883105b282fe15275991b411e6b200c5-Abstract-Conference.html)
- [DIFUSCO: Graph-based Diffusion Solvers for Combinatorial Optimization](../specialist/difusco.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/0ba520d93c3df592c83a611961314c98-Abstract-Conference.html)
- [Efficient Meta Neural Heuristic for Multi-Objective Combinatorial Optimization](../specialist/emnh.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/b1efde53be364a73914f58805a001731-Abstract-Conference.html)
- [HubRouter: Learning Global Routing via Hub Generation and Pin-hub Connection](../specialist/hubrouter.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/f7f98663c516fceb582354ee2d9d274d-Abstract-Conference.html)
- [Improving Graph Matching with Positional Reconstruction Encoder-Decoder Network](../specialist/pregm.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6cd3ac24cdb789beeaa9f7145670fcae-Abstract-Conference.html)
- [Learning to Configure Separators in Branch-and-Cut](../specialist/learn-configure-separators.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/bcdec1c2d60f94a93b6e36f937aa0530-Abstract-Conference.html)
- [Learning To Dive In Branch And Bound](../specialist/l2dive.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/6bbda0824bcc20749f21510fd8b28de5-Abstract-Conference.html)
- [Learning to Search Feasible and Infeasible Regions of Routing Problems with Flexible Neural k-Opt](../specialist/neuopt.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/9bae70d354793a95fa18751888cea07d-Abstract-Conference.html)
- [Let the Flows Tell:  Solving Graph Combinatorial Problems with GFlowNets](../specialist/gflownet-combopt.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/27571b74d6cd650b8eb6cf1837953ae8-Abstract-Conference.html)
- [Maximum Independent Set: Self-Training through Dynamic Programming](../specialist/mis-self-training-dp.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/7fe3170d88a8310ca86df2843f54236c-Abstract-Conference.html)
- [Neural Combinatorial Optimization with Heavy Decoder: Toward Large Scale Generalization](../specialist/lehd.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/1c10d0c087c14689628124bbc8fa69f6-Abstract-Conference.html)
- [Neural Multi-Objective Combinatorial Optimization with Diversity Enhancement](../specialist/nhde.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/7b5ae891000049b91b3b62de596b1560-Abstract-Conference.html)
- [Optimizing Solution-Samplers for Combinatorial Problems: The Landscape of Policy-Gradient Method](../studies/policy-gradient-landscape-co.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/2d950a2cfd8a75124c178a89545b97fd-Abstract-Conference.html)
- [Puzzlefusion: Unleashing the Power of Diffusion Models for Spatial Puzzle Solving](../specialist/puzzlefusion.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/1e70ac91ad26ba5b24cf11b12a1f90fe-Abstract-Conference.html)
- [T2T: From Distribution Learning in Training to Gradient Search in Testing for Combinatorial Optimization](../specialist/t2t.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/9c93b3cd3bc60c0fe7b0c2d74a2da966-Abstract-Conference.html)
- [Unsupervised Learning for Solving the Travelling Salesman Problem](../specialist/utsp.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/93b8618a9061f8a55825c13ecf28392b-Abstract-Conference.html)
- [Variational Annealing on Graphs for Combinatorial Optimization](../specialist/vag-co.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/c9c54ac0dd5e942b99b2b51c297544fd-Abstract-Conference.html)
- [Winner Takes It All: Training Performant RL Populations for Combinatorial Optimization](../specialist/poppy.md) — NeurIPS 2023 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2023/hash/97b983c974551153d20ddfabb62a5203-Abstract-Conference.html)
- [Encoding Node Diffusion Competence and Role Significance for Network Dismantling](../specialist/encoding-node-diffusion-competence-and-role-significance-for-network-dismantling.md) — WWW 2023 · [正式论文](https://doi.org/10.1145/3543507.3583233)
- [An Efficient Combinatorial Optimization Model Using Learning-to-Rank Distillation](../specialist/an-efficient-combinatorial-optimization-model-using-learning-to-rank-distillation.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/20845)
- [Enforcement Heuristics for Argumentation with Deep Reinforcement Learning](../specialist/enforcement-heuristics-for-argumentation-with-deep-reinforcement-learning.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/20497)
- [Fast Approximations for Job Shop Scheduling: A Lagrangian Dual Deep Learning Method](../specialist/fast-approximations-for-job-shop-scheduling-a-lagrangian-dual-deep-learning-method.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/20685)
- [Interpretable Neural Subgraph Matching for Graph Retrieval](../specialist/interpretable-neural-subgraph-matching-for-graph-retrieval.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/20784)
- [Joint Deep Multi-Graph Matching and 3D Geometry Learning from Inhomogeneous 2D Image Collections](../specialist/joint-deep-multi-graph-matching-and-3d-geometry-learning-from-inhomogeneous-2d-image-c.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/20220)
- [Learning to Search in Local Branching](../generalist/learning-to-search-in-local-branching.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/20294)
- [Learning to Solve Routing Problems via Distributionally Robust Optimization](../specialist/routing-dro.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/21214)
- [Learning to Solve Travelling Salesman Problem with Hardness-Adaptive Curriculum](../specialist/learning-to-solve-travelling-salesman-problem-with-hardness-adaptive-curriculum.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/20899)
- [MAPDP: Cooperative Multi-Agent Reinforcement Learning to Solve Pickup and Delivery Problems](../specialist/mapdp.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/21236)
- [MIP-GNN: A Data-Driven Framework for Guiding Combinatorial Solvers](../specialist/mip-gnn-a-data-driven-framework-for-guiding-combinatorial-solvers.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/21262)
- [NICE: Robust Scheduling through Reinforcement Learning-Guided Integer Programming](../specialist/nice-robust-scheduling-through-reinforcement-learning-guided-integer-programming.md) — AAAI 2022 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/21218)
- [Appearance and Structure Aware Robust Deep Visual Graph Matching: Attack, Defense and Beyond](../specialist/appearance-and-structure-aware-robust-deep-visual-graph-matching-attack-defense-and-be.md) — CVPR 2022 · [正式论文](https://openaccess.thecvf.com/content/CVPR2022/html/Ren_Appearance_and_Structure_Aware_Robust_Deep_Visual_Graph_Matching_Attack_CVPR_2022_paper.html)
- [Graph-Context Attention Networks for Size-Varied Deep Graph Matching](../specialist/graph-context-attention-networks-for-size-varied-deep-graph-matching.md) — CVPR 2022 · [正式论文](https://openaccess.thecvf.com/content/CVPR2022/html/Jiang_Graph-Context_Attention_Networks_for_Size-Varied_Deep_Graph_Matching_CVPR_2022_paper.html)
- [Multi-Robot Active Mapping via Neural Bipartite Graph Matching](../specialist/multi-robot-active-mapping-via-neural-bipartite-graph-matching.md) — CVPR 2022 · [正式论文](https://openaccess.thecvf.com/content/CVPR2022/html/Ye_Multi-Robot_Active_Mapping_via_Neural_Bipartite_Graph_Matching_CVPR_2022_paper.html)
- [Self-Supervised Learning of Visual Graph Matching](../specialist/self-supervised-learning-of-visual-graph-matching.md) — ECCV 2022 · [正式论文](https://www.ecva.net/papers/eccv_2022/papers_ECCV/html/2203_ECCV_2022_paper.php)
- [Efficient Active Search for Combinatorial Optimization Problems](../specialist/efficient-active-search.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=nO5caZwFwYu)
- [Generalization of Neural Combinatorial Solvers Through the Lens of Adversarial Robustness](../studies/adversarial-nco-generalization.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=vJZ7dPIjip3)
- [Graph Neural Network Guided Local Search for the Traveling Salesperson Problem](../specialist/graph-guided-local-search.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=ar92oEosBIg)
- [Learning Efficient Online 3D Bin Packing on Packing Configuration Trees](../specialist/packing-configuration-tree.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=bfuGjlCwAq)
- [Learning Scenario Representation for Solving Two-stage Stochastic Integer Programs](../specialist/cvae-sip.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=06Wy2BtxXrz)
- [Neural Models for Output-Space Invariance in Combinatorial Problems](../specialist/value-set-invariance.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=ibrUkC-pbis)
- [Pareto Set Learning for Neural Multi-Objective Combinatorial Optimization](../specialist/pareto-set-learning.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=QuObT9BTWo)
- [What’s Wrong with Deep Learning in Tree Search for Combinatorial Optimization](../studies/mis-tree-search-audit.md) — ICLR 2022 · [正式论文](https://openreview.net/forum?id=mk0HzdqY7i1)
- [Augment with Care: Contrastive Learning for Combinatorial Problems](../studies/contrastive-sat.md) — ICML 2022 · [正式论文](https://proceedings.mlr.press/v162/duan22b.html)
- [LeNSE: Learning To Navigate Subgraph Embeddings for Large-Scale Combinatorial Optimisation](../specialist/lense.md) — ICML 2022 · [正式论文](https://proceedings.mlr.press/v162/ireland22a.html)
- [Learning Improvement Heuristics for Solving Routing Problems](../specialist/learning-improvement-heuristics.md) — IEEE Transactions on Neural Networks and Learning Systems 2022 · [正式论文](https://ieeexplore.ieee.org/document/9393606/)
- [Efficient Neural Neighborhood Search for Pickup and Delivery Problems](../specialist/efficient-neural-neighborhood-search-for-pickup-and-delivery-problems.md) — IJCAI 2022 · [正式论文](https://www.ijcai.org/proceedings/2022/662)
- [Learning for Robust Combinatorial Optimization: Algorithm and Application](../specialist/learning-for-robust-combinatorial-optimization-algorithm-and-application.md) — INFOCOM 2022 · [正式论文](https://doi.org/10.1109/INFOCOM48880.2022.9796715)
- [RBG: Hierarchically Solving Large-Scale Routing Problems in Logistic Systems via Reinforcement Learning](../specialist/rbg.md) — KDD 2022 · [正式论文](https://doi.org/10.1145/3534678.3539037)
- [A Deep Reinforcement Learning Framework for Column Generation](../specialist/rlcg.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/3ecfe5c632afb7d96a2337b18ff99b1f-Abstract-Conference.html)
- [Can Hybrid Geometric Scattering Networks Help Solve the Maximum Clique Problem?](../specialist/hybrid-scattering-clique.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/8ec88961d36d9a87ac24baf45402744f-Abstract-Conference.html)
- [Diffusion Models as Plug-and-Play Priors](../specialist/diffusion-plug-and-play-priors.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/5e6cec2a9520708381fe520246018e8b-Abstract.html)
- [DIMES: A Differentiable Meta Solver for Combinatorial Optimization Problems](../specialist/dimes.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a3a7387e49f4de290c23beea2dfcdc75-Abstract-Conference.html)
- [DreamShard: Generalizable Embedding Table Placement for Recommender Systems](../specialist/dreamshard.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/62302a24b04589f9f9cdd5b02c344b6c-Abstract-Conference.html)
- [Graph Coloring via Neural Networks for Haplotype Assembly and Viral Quasispecies Reconstruction](../specialist/neurhap.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/c76f18e65d16cd2786e50a88db00cde4-Abstract-Conference.html)
- [Graph Learning Assisted Multi-Objective Integer Programming](../specialist/graph-moip.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/710aae9186778a91b656e609778f7898-Abstract-Conference.html)
- [Learning to Branch with Tree MDPs](../specialist/tree-mdp-branching.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/756d74cd58592849c904421e3b2ec7a4-Abstract-Conference.html)
- [Learning to Compare Nodes in Branch and Bound with Graph Neural Networks](../specialist/learn-compare-bb-nodes.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/cf5bb18807a3e9cfaaa51e667e18f807-Abstract-Conference.html)
- [MaskPlace: Fast Chip Placement via Reinforced Visual Representation Learning](../specialist/maskplace.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/97c8a8eb0e5231d107d0da51b79e09cb-Abstract-Conference.html)
- [Neur2SP: Neural Two-Stage Stochastic Programming](../specialist/neur2sp.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/9793671e4be9858a69a32545204d59d1-Abstract-Conference.html)
- [Neural Set Function Extensions: Learning with Discrete Functions in High Dimensions](../studies/neural-set-function-extensions.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/6294a235c0b80f0a2b224375c546c750-Abstract-Conference.html)
- [NeuroSchedule: A Novel Effective GNN-based Scheduling Method for High-level Synthesis](../specialist/neuroschedule.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/964b1c8dd5667fd647c09c8772829fd1-Abstract-Conference.html)
- [NSNet: A General Neural Probabilistic Framework for Satisfiability Problems](../specialist/nsnet.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a40462acc6959034c6aa6dfb8e696415-Abstract-Conference.html)
- [Simulation-guided Beam Search for Neural Combinatorial Optimization](../specialist/simulation-guided-beam-search.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/39b9b60f0d149eabd1fff2d7c7d5afc4-Abstract-Conference.html)
- [Sym-NCO: Leveraging Symmetricity for Neural Combinatorial Optimization](../specialist/sym-nco.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/0cddb777d3441326544e21b67f41bdc8-Abstract-Conference.html)
- [The Policy-gradient Placement and Generative Routing Neural Networks for Chip Design](../specialist/prnet-chip-design.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/a8b8c1ad51df1b93d9e3d1fca75debbf-Abstract-Conference.html)
- [Unsupervised Learning for Combinatorial Optimization with Principled Objective Relaxation](../specialist/principled-co-relaxation.md) — NeurIPS 2022 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2022/hash/cbc1ad2066f0afebbcea930c5688fc1f-Abstract-Conference.html)
- [Combining Reinforcement Learning and Constraint Programming for Combinatorial Optimization](../specialist/combining-reinforcement-learning-and-constraint-programming-for-combinatorial-optimiza.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/16484)
- [Generalize a Small Pre-trained Model to Arbitrarily Large TSP Instances](../specialist/att-gcn.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/16916)
- [IA-GM: A Deep Bidirectional Learning Method for Graph Matching](../specialist/ia-gm-a-deep-bidirectional-learning-method-for-graph-matching.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/16461)
- [Learning Branching Heuristics for Propositional Model Counting](../specialist/learning-branching-heuristics-for-propositional-model-counting.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/17474)
- [Learning Generalized Relational Heuristic Networks for Model-Agnostic Planning](../specialist/learning-generalized-relational-heuristic-networks-for-model-agnostic-planning.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/16983)
- [Multi-Decoder Attention Model with Embedding Glimpse for Solving Vehicle Routing Problems](../specialist/multi-decoder-attention-model.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/17430)
- [Online 3D Bin Packing with Constrained Deep Reinforcement Learning](../specialist/online-3d-bin-packing-with-constrained-deep-reinforcement-learning.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/16155)
- [Parameterizing Branch-and-Bound Search Trees to Learn Branching Policies](../generalist/parameterizing-branch-and-bound-search-trees-to-learn-branching-policies.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/16512)
- [Scheduling of Time-Varying Workloads Using Reinforcement Learning](../specialist/scheduling-of-time-varying-workloads-using-reinforcement-learning.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/17088)
- [Synthesis of Search Heuristics for Temporal Planning via Reinforcement Learning](../specialist/synthesis-of-search-heuristics-for-temporal-planning-via-reinforcement-learning.md) — AAAI 2021 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/17413)
- [Combinatorial Learning of Graph Edit Distance via Dynamic Embedding](../specialist/combinatorial-learning-of-graph-edit-distance-via-dynamic-embedding.md) — CVPR 2021 · [正式论文](https://openaccess.thecvf.com/content/CVPR2021/html/Wang_Combinatorial_Learning_of_Graph_Edit_Distance_via_Dynamic_Embedding_CVPR_2021_paper.html)
- [Deep Graph Matching Under Quadratic Constraint](../specialist/deep-graph-matching-under-quadratic-constraint.md) — CVPR 2021 · [正式论文](https://openaccess.thecvf.com/content/CVPR2021/html/Gao_Deep_Graph_Matching_Under_Quadratic_Constraint_CVPR_2021_paper.html)
- [Learnable Graph Matching: Incorporating Graph Partitioning With Deep Feature Learning for Multiple Object Tracking](../specialist/learnable-graph-matching-incorporating-graph-partitioning-with-deep-feature-learning-f.md) — CVPR 2021 · [正式论文](https://openaccess.thecvf.com/content/CVPR2021/html/He_Learnable_Graph_Matching_Incorporating_Graph_Partitioning_With_Deep_Feature_Learning_CVPR_2021_paper.html)
- [Hypergraph Neural Networks for Hypergraph Matching](../specialist/hypergraph-neural-networks-for-hypergraph-matching.md) — ICCV 2021 · [正式论文](https://openaccess.thecvf.com/content/ICCV2021/html/Liao_Hypergraph_Neural_Networks_for_Hypergraph_Matching_ICCV_2021_paper.html)
- [Learning To Match Features With Seeded Graph Matching Network](../specialist/learning-to-match-features-with-seeded-graph-matching-network.md) — ICCV 2021 · [正式论文](https://openaccess.thecvf.com/content/ICCV2021/html/Chen_Learning_To_Match_Features_With_Seeded_Graph_Matching_Network_ICCV_2021_paper.html)
- [Learning a Latent Search Space for Routing Problems using Variational Autoencoders](../specialist/latent-search-space-routing.md) — ICLR 2021 · [正式论文](https://openreview.net/forum?id=90JprVrJBO)
- [Neural Learning of One-of-Many Solutions for Combinatorial Problems in Structured Output Spaces](../specialist/selectr.md) — ICLR 2021 · [正式论文](https://openreview.net/forum?id=ATp1nW2FuZL)
- [Optimizing Memory Placement using Evolutionary Graph Reinforcement Learning](../specialist/egrl.md) — ICLR 2021 · [正式论文](https://openreview.net/forum?id=-6vS_4Kfz0)
- [CombOptNet: Fit the Right NP-Hard Problem by Learning Integer Programming Constraints](../studies/comboptnet.md) — ICML 2021 · [正式论文](https://proceedings.mlr.press/v139/paulus21a.html)
- [Deep Latent Graph Matching](../specialist/deep-latent-graph-matching.md) — ICML 2021 · [正式论文](https://proceedings.mlr.press/v139/yu21d.html)
- [GLSearch: Maximum Common Subgraph Detection via Learning to Search](../specialist/glsearch.md) — ICML 2021 · [正式论文](https://proceedings.mlr.press/v139/bai21e.html)
- [Neuro-algorithmic Policies Enable Fast Combinatorial Generalization](../specialist/neuro-algorithmic-policies.md) — ICML 2021 · [正式论文](https://proceedings.mlr.press/v139/vlastelica21a.html)
- [Stochastic Iterative Graph Matching](../specialist/sigma-matching.md) — ICML 2021 · [正式论文](https://proceedings.mlr.press/v139/liu21i.html)
- [Structured Convolutional Kernel Networks for Airline Crew Scheduling](../specialist/struct-ckn.md) — ICML 2021 · [正式论文](https://proceedings.mlr.press/v139/yaakoubi21a.html)
- [Step-Wise Deep Learning Models for Solving Routing Problems](../specialist/step-wise-routing.md) — IEEE Transactions on Industrial Informatics 2021 · [正式论文](https://ieeexplore.ieee.org/document/9226142/)
- [Adaptive Edge Attention for Graph Matching with Outliers](../specialist/adaptive-edge-attention-for-graph-matching-with-outliers.md) — IJCAI 2021 · [正式论文](https://www.ijcai.org/proceedings/2021/134)
- [A Bi-Level Framework for Learning to Solve Combinatorial Optimization on Graphs](../specialist/ppo-bihyb.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2021/hash/b2f627fff19fda463cb386442eac2b3d-Abstract.html)
- [Brick-by-Brick: Combinatorial Construction with Deep Reinforcement Learning](../specialist/brick-by-brick.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2021/hash/2d4027d6df9c0256b8d4474ce88f8c88-Abstract.html)
- [Learning Collaborative Policies to Solve NP-hard Routing Problems](../specialist/learning-collaborative-policies.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper/2021/hash/564127c03caab942e503ee6f810f54fd-Abstract.html)
- [Learning Large Neighborhood Search Policy for Integer Programming](../specialist/learn-lns-ip.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2021/hash/fc9e62695def29ccdb9eb3fed5b4c8c8-Abstract.html)
- [Learning to Delegate for Large-Scale Vehicle Routing](../specialist/learning-to-delegate.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper/2021/hash/dc9fa5f217a1e57b8a6adeb065560b38-Abstract.html)
- [Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer](../specialist/dact.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper/2021/hash/5c53292c032b6cb8510041c54274e65f-Abstract.html)
- [Matrix encoding networks for neural combinatorial optimization](../specialist/matrix-encoding-networks.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2021/hash/29539ed932d32f1c56324cded92c07c2-Abstract.html)
- [NeuroLKH: Combining Deep Learning Model with Lin-Kernighan-Helsgaun Heuristic for Solving the Traveling Salesman Problem](../specialist/neurolkh.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper/2021/hash/3d863b367aa379f71c7afc0c9cdca41d-Abstract.html)
- [On Joint Learning for Solving Placement and Routing in Chip Design](../specialist/deepplace-deeppr.md) — NeurIPS 2021 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2021/hash/898aef0932f6aaecda27aba8e9903991-Abstract.html)
- [Intelligent Electric Vehicle Charging Recommendation Based on Multi-Agent Reinforcement Learning](../specialist/intelligent-electric-vehicle-charging-recommendation-based-on-multi-agent-reinforcemen.md) — WWW 2021 · [正式论文](https://doi.org/10.1145/3442381.3449934)
- [Deep Neural Network Approximated Dynamic Programming for Combinatorial Optimization](../specialist/deep-neural-network-approximated-dynamic-programming-for-combinatorial-optimization.md) — AAAI 2020 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/5531)
- [Exploratory Combinatorial Optimization with Reinforcement Learning](../specialist/exploratory-combinatorial-optimization-with-reinforcement-learning.md) — AAAI 2020 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/5723)
- [Learning to Optimize Variational Quantum Circuits to Solve Combinatorial Problems](../specialist/learning-to-optimize-variational-quantum-circuits-to-solve-combinatorial-problems.md) — AAAI 2020 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/5616)
- [Online Planner Selection with Graph Neural Networks and Adaptive Scheduling](../generalist/online-planner-selection-with-graph-neural-networks-and-adaptive-scheduling.md) — AAAI 2020 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/5949)
- [Learning Combinatorial Solver for Graph Matching](../specialist/learning-combinatorial-solver-for-graph-matching.md) — CVPR 2020 · [正式论文](https://openaccess.thecvf.com/content_CVPR_2020/html/Wang_Learning_Combinatorial_Solver_for_Graph_Matching_CVPR_2020_paper.html)
- [Solving Jigsaw Puzzles With Eroded Boundaries](../specialist/solving-jigsaw-puzzles-with-eroded-boundaries.md) — CVPR 2020 · [正式论文](https://openaccess.thecvf.com/content_CVPR_2020/html/Bridger_Solving_Jigsaw_Puzzles_With_Eroded_Boundaries_CVPR_2020_paper.html)
- [Deep Graph Matching via Blackbox Differentiation of Combinatorial Solvers](../specialist/deep-graph-matching-via-blackbox-differentiation-of-combinatorial-solvers.md) — ECCV 2020 · [正式论文](https://www.ecva.net/papers/eccv_2020/papers_ECCV/html/6207_ECCV_2020_paper.php)
- [A Learning-based Iterative Method for Solving Vehicle Routing Problems](../specialist/learning-to-improve.md) — ICLR 2020 · [正式论文](https://openreview.net/forum?id=BJe1334YDH)
- [Combining Q-Learning and Search with Amortized Value Estimates](../specialist/save.md) — ICLR 2020 · [正式论文](https://openreview.net/forum?id=SkeAaJrKDS)
- [Deep Graph Matching Consensus](../specialist/deep-graph-matching-consensus.md) — ICLR 2020 · [正式论文](https://openreview.net/forum?id=HyeJf1HKvS)
- [Differentiation of Blackbox Combinatorial Solvers](../studies/blackbox-backprop.md) — ICLR 2020 · [正式论文](https://openreview.net/forum?id=BkevoJSYPB)
- [Learning deep graph matching with channel-independent embedding and Hungarian attention](../specialist/cie-h.md) — ICLR 2020 · [正式论文](https://openreview.net/forum?id=rJgBd2NYPH)
- [Learning Heuristics for Quantified Boolean Formulas through Reinforcement Learning](../specialist/rl-qbf.md) — ICLR 2020 · [正式论文](https://openreview.net/forum?id=BJluxREKDB)
- [Adaptive Droplet Routing in Digital Microfluidic Biochips Using Deep Reinforcement Learning](../specialist/rl-droplet-routing.md) — ICML 2020 · [正式论文](https://proceedings.mlr.press/v119/liang20c.html)
- [An Imitation Learning Approach for Cache Replacement](../specialist/parrot-cache.md) — ICML 2020 · [正式论文](https://proceedings.mlr.press/v119/liu20f.html)
- [Dynamic Knapsack Optimization Towards Efficient Multi-Channel Sequential Advertising](../specialist/msbcb-advertising.md) — ICML 2020 · [正式论文](https://proceedings.mlr.press/v119/hao20b.html)
- [Learning What to Defer for Maximum Independent Sets](../specialist/learning-what-to-defer.md) — ICML 2020 · [正式论文](https://proceedings.mlr.press/v119/ahn20a.html)
- [Multi-Agent Routing Value Iteration Network](../specialist/marvin.md) — ICML 2020 · [正式论文](https://proceedings.mlr.press/v119/sykora20a.html)
- [Reinforcement Learning for Integer Programming: Learning to Cut](../generalist/learning-to-cut.md) — ICML 2020 · [正式论文](https://proceedings.mlr.press/v119/tang20a.html)
- [Adversarial Graph Embeddings for Fair Influence Maximization over Social Networks](../specialist/adversarial-graph-embeddings-for-fair-influence-maximization-over-social-networks.md) — IJCAI 2020 · [正式论文](https://www.ijcai.org/proceedings/2020/594)
- [DeepWeave: Accelerating Job Completion Time with Deep Reinforcement Learning-based Coflow Scheduling](../specialist/deepweave-accelerating-job-completion-time-with-deep-reinforcement-learning-based-cofl.md) — IJCAI 2020 · [正式论文](https://www.ijcai.org/proceedings/2020/458)
- [Learning for Graph Matching and Related Combinatorial Optimization Problems](../studies/learning-for-graph-matching-and-related-combinatorial-optimization-problems.md) — IJCAI 2020 · [正式论文](https://www.ijcai.org/proceedings/2020/694)
- [Learning to Accelerate Heuristic Searching for Large-Scale Maximum Weighted b-Matching Problems in Online Advertising](../specialist/learning-to-accelerate-heuristic-searching-for-large-scale-maximum-weighted-b-matching.md) — IJCAI 2020 · [正式论文](https://www.ijcai.org/proceedings/2020/475)
- [Efficiently Solving the Practical Vehicle Routing Problem: A Novel Joint Learning Approach](../specialist/practical-vrp-joint-learning.md) — KDD 2020 · [正式论文](https://doi.org/10.1145/3394486.3403356)
- [Geodemographic Influence Maximization](../specialist/geodemographic-influence-maximization.md) — KDD 2020 · [正式论文](https://doi.org/10.1145/3394486.3403327)
- [A General Large Neighborhood Search Framework for Solving Integer Linear Programs](../specialist/general-lns-ilp.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/e769e03a9d329b2e864b4bf4ff54ff39-Abstract.html)
- [Adversarial Attacks on Deep Graph Matching](../studies/adversarial-graph-matching.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/ef126722e64e98d1c33933783e52eafc-Abstract.html)
- [Can Q-Learning with Graph Networks Learn a Generalizable Branching Heuristic for a SAT Solver?](../generalist/graph-q-sat.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/6d70cb65d15211726dcce4c0e971e21c-Abstract.html)
- [Curriculum learning for multilevel budgeted combinatorial problems](../specialist/multilevel-curriculum.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/4eb7d41ae6005f60fe401e56277ebd4e-Abstract.html)
- [Erdos Goes Neural: an Unsupervised Learning Framework for Combinatorial Optimization on Graphs](../specialist/erdos-goes-neural.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/49f85a9ed090b20c8bed85a5923c669f-Abstract.html)
- [GCOMB: Learning Budget-constrained Combinatorial Algorithms over Billion-sized Graphs](../specialist/gcomb.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/e7532dbeff7ef901f2e70daacb3f452d-Abstract.html)
- [Graduated Assignment for Joint Multi-Graph Matching and Clustering with Application to Unsupervised Graph Matching Network Learning](../specialist/gann.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/e6384711491713d29bc63fc5eeb5ba4f-Abstract.html)
- [Hybrid Models for Learning to Branch](../specialist/hybrid-branching.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/d1e946f4e67db4b362ad23818a6fb78a-Abstract.html)
- [Learning to Dispatch for Job Shop Scheduling via Deep Reinforcement Learning](../specialist/learning-to-dispatch.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2020/hash/11958dfee29b6709f48a9ba0387a2431-Abstract.html)
- [POMO: Policy Optimization with Multiple Optima for Reinforcement Learning](../specialist/pomo.md) — NeurIPS 2020 · [正式论文](https://proceedings.neurips.cc/paper/2020/hash/f231f2107df69eab0a3862d50018a9b2-Abstract.html)
- [Bounded Suboptimal Search with Learned Heuristics for Multi-Agent Systems](../specialist/bounded-suboptimal-search-with-learned-heuristics-for-multi-agent-systems.md) — AAAI 2019 · [正式论文](https://ojs.aaai.org/index.php/AAAI/article/view/33012387)
- [Deep Graphical Feature Learning for the Feature Matching Problem](../specialist/deep-graphical-feature-learning-for-the-feature-matching-problem.md) — ICCV 2019 · [正式论文](https://openaccess.thecvf.com/content_ICCV_2019/html/Zhang_Deep_Graphical_Feature_Learning_for_the_Feature_Matching_Problem_ICCV_2019_paper.html)
- [Learning Combinatorial Embedding Networks for Deep Graph Matching](../specialist/learning-combinatorial-embedding-networks-for-deep-graph-matching.md) — ICCV 2019 · [正式论文](https://openaccess.thecvf.com/content_ICCV_2019/html/Wang_Learning_Combinatorial_Embedding_Networks_for_Deep_Graph_Matching_ICCV_2019_paper.html)
- [Attention, Learn to Solve Routing Problems!](../specialist/attention-model.md) — ICLR 2019 · [正式论文](https://openreview.net/forum?id=ByxBFsRqYm)
- [Learning a SAT Solver from Single-Bit Supervision](../generalist/neurosat.md) — ICLR 2019 · [正式论文](https://openreview.net/forum?id=HJMC_iA5tm)
- [Learning To Solve Circuit-SAT: An Unsupervised Differentiable Approach](../generalist/circuit-sat-neural.md) — ICLR 2019 · [正式论文](https://openreview.net/forum?id=BJxgz2R9t7)
- [Solving the Rubik's Cube with Approximate Policy Iteration](../specialist/autodidactic-iteration.md) — ICLR 2019 · [正式论文](https://openreview.net/forum?id=Hyfn2jCcKm)
- [SATNet: Bridging deep learning and logical reasoning using a differentiable satisfiability solver](../specialist/satnet.md) — ICML 2019 · [正式论文](https://proceedings.mlr.press/v97/wang19e.html)
- [Solving Continual Combinatorial Selection via Deep Reinforcement Learning](../specialist/solving-continual-combinatorial-selection-via-deep-reinforcement-learning.md) — IJCAI 2019 · [正式论文](https://www.ijcai.org/proceedings/2019/481)
- [Approximation Ratios of Graph Neural Networks for Combinatorial Problems](../studies/gnn-approximation-ratios.md) — NeurIPS 2019 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2019/hash/635440afdfc39fe37995fed127d7df4f-Abstract.html)
- [Exact Combinatorial Optimization with Graph Convolutional Neural Networks](../specialist/gcnn-branching.md) — NeurIPS 2019 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2019/hash/d14c2267d848abeb81fd590f371d39bd-Abstract.html)
- [Learning Generalizable Device Placement Algorithms for Distributed Machine Learning](../specialist/placeto.md) — NeurIPS 2019 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2019/hash/71560ce98c8250ce57a6a970c9991a5f-Abstract.html)
- [Learning Local Search Heuristics for Boolean Satisfiability](../generalist/rl-local-search-sat.md) — NeurIPS 2019 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2019/hash/12e59a33dea1bf0630f46edfe13d6ea2-Abstract.html)
- [Learning to Perform Local Rewriting for Combinatorial Optimization](../specialist/neurewriter.md) — NeurIPS 2019 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2019/hash/131f383b434fdf48079bff1e44e2d9a5-Abstract.html)
- [Learning Scheduling Algorithms for Data Processing Clusters](../specialist/learning-scheduling-algorithms-for-data-processing-clusters.md) — SIGCOMM 2019 · [正式论文](https://doi.org/10.1145/3341302.3342080)
- [Efficient Ridesharing Order Dispatching with Mean Field Multi-Agent Reinforcement Learning](../specialist/efficient-ridesharing-order-dispatching-with-mean-field-multi-agent-reinforcement-lear.md) — WWW 2019 · [正式论文](https://doi.org/10.1145/3308558.3313433)
- [Learning Task-Specific City Region Partition](../specialist/learning-task-specific-city-region-partition.md) — WWW 2019 · [正式论文](https://doi.org/10.1145/3308558.3313704)
- [Spatio-Temporal Capsule-based Reinforcement Learning for Mobility-on-Demand Network Coordination](../specialist/spatio-temporal-capsule-based-reinforcement-learning-for-mobility-on-demand-network-co.md) — WWW 2019 · [正式论文](https://doi.org/10.1145/3308558.3313401)
- [Deep Learning of Graph Matching](../specialist/deep-learning-of-graph-matching.md) — CVPR 2018 · [正式论文](https://openaccess.thecvf.com/content_cvpr_2018/html/Zanfir_Deep_Learning_of_CVPR_2018_paper.html)
- [A Hierarchical Model for Device Placement](../specialist/hierarchical-device-placement.md) — ICLR 2018 · [正式论文](https://openreview.net/forum?id=Hkc-TeZ0W)
- [Learning Latent Permutations with Gumbel-Sinkhorn Networks](../studies/gumbel-sinkhorn.md) — ICLR 2018 · [正式论文](https://openreview.net/forum?id=Byt3oJ-0W)
- [Learning to search with MCTSnets](../specialist/mctsnets.md) — ICML 2018 · [正式论文](https://proceedings.mlr.press/v80/guez18a.html)
- [Spotlight: Optimizing Device Placement for Training Deep Neural Networks](../specialist/spotlight-placement.md) — ICML 2018 · [正式论文](https://proceedings.mlr.press/v80/gao18a.html)
- [NeuroViNE: A Neural Preprocessor for Your Virtual Network Embedding Algorithm](../specialist/neurovine-a-neural-preprocessor-for-your-virtual-network-embedding-algorithm.md) — INFOCOM 2018 · [正式论文](https://doi.org/10.1109/INFOCOM.2018.8486263)
- [Dynamic Bike Reposition: A Spatio-Temporal Reinforcement Learning Approach](../specialist/dynamic-bike-reposition-a-spatio-temporal-reinforcement-learning-approach.md) — KDD 2018 · [正式论文](https://doi.org/10.1145/3219819.3220110)
- [Efficient Large-Scale Fleet Management via Multi-Agent Deep Reinforcement Learning](../specialist/efficient-large-scale-fleet-management-via-multi-agent-deep-reinforcement-learning.md) — KDD 2018 · [正式论文](https://doi.org/10.1145/3219819.3219993)
- [Combinatorial Optimization with Graph Convolutional Networks and Guided Tree Search](../generalist/gcn-guided-tree-search.md) — NeurIPS 2018 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2018/hash/8d3bba7425e7c98c50f52ca1b52d3735-Abstract.html)
- [Mean-field theory of graph neural networks in graph partitioning](../studies/mean-field-gnn-partitioning.md) — NeurIPS 2018 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2018/hash/f6e794a75c5d51de081dbefa224304f9-Abstract.html)
- [Reinforcement Learning for Solving the Vehicle Routing Problem](../specialist/rl-vrp.md) — NeurIPS 2018 · [正式论文](https://papers.nips.cc/paper_files/paper/2018/hash/9fb4651c05b2ed70fba5afe0b039a550-Abstract.html)
- [Device Placement Optimization with Reinforcement Learning](../specialist/rl-device-placement.md) — ICML 2017 · [正式论文](https://proceedings.mlr.press/v70/mirhoseini17a.html)
- [Learning Combinatorial Optimization Algorithms over Graphs](../specialist/learning-co-over-graphs.md) — NeurIPS 2017 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2017/hash/d9896106ca98d3d05b8cbdf4fd8b13a1-Abstract.html)
- [Pointer Networks](../specialist/pointer-networks.md) — NeurIPS 2015 · [正式论文](https://proceedings.neurips.cc/paper/2015/hash/29921001f2f04bd3baee84a12e98098f-Abstract.html)
- [Recurrent networks of coupled Winner-Take-All oscillators for solving constraint satisfaction problems](../specialist/wta-oscillator-csp.md) — NeurIPS 2013 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/2013/hash/d1f255a373a3cef72e03aa9d980c7eca-Abstract.html)
- [Learning to Schedule Straight-Line Code](../specialist/learn-schedule-straight-line.md) — NeurIPS 1997 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1997/hash/bcc0d400288793e8bdcd7c19a8ac0c2b-Abstract.html)
- [A Convergence Proof for the Softassign Quadratic Assignment Algorithm](../studies/softassign-convergence.md) — NeurIPS 1996 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1996/hash/c8ba76c279269b1c6bc8a07e38e78fa4-Abstract.html)
- [Are Hopfield Networks Faster than Conventional Computers?](../studies/hopfield-computational-speed.md) — NeurIPS 1996 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1996/hash/68a83eeb494a308fe5295da69428a507-Abstract.html)
- [Reinforcement Learning for Dynamic Channel Allocation in Cellular Telephone Systems](../specialist/rl-channel-allocation.md) — NeurIPS 1996 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1996/hash/3948ead63a9f2944218de038d8934305-Abstract.html)
- [A Framework for Non-rigid Matching and Correspondence](../specialist/softassign-nonrigid-matching.md) — NeurIPS 1995 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1995/hash/c60d060b946d6dd6145dcbad5c4ccf6f-Abstract.html)
- [High-Performance Job-Shop Scheduling With A Time-Delay TD(λ) Network](../specialist/time-delay-td-jobshop.md) — NeurIPS 1995 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1995/hash/4f16c818875d9fcb6867c7bdc89be7eb-Abstract.html)
- [Improving Elevator Performance Using Reinforcement Learning](../specialist/rl-elevator-control.md) — NeurIPS 1995 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1995/hash/390e982518a50e280d8e2b535462ec1f-Abstract.html)
- [Softassign versus Softmax: Benchmarks in Combinatorial Optimization](../specialist/softassign-vs-softmax.md) — NeurIPS 1995 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1995/hash/b1563a78ec59337587f6ab6397699afc-Abstract.html)
- [Comparison Training for a Rescheduling Problem in Neural Networks](../specialist/comparison-rescheduling.md) — NeurIPS 1993 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1993/hash/aeb3135b436aa55373822c010763dd54-Abstract.html)
- [Digital Boltzmann VLSI for constraint satisfaction and learning](../specialist/digital-boltzmann-vlsi.md) — NeurIPS 1993 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1993/hash/1fc214004c9481e4c8073e85323bfd4b-Abstract.html)
- [Improving Convergence in Hierarchical Matching Networks for Object Recognition](../specialist/hierarchical-matching-convergence.md) — NeurIPS 1992 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1992/hash/3a066bda8c96b9478bb0512f0a43028c-Abstract.html)
- [Merging Constrained Optimisation with Deterministic Annealing to "Solve" Combinatorially Hard Problems](../specialist/adaptive-lagrangian-annealing.md) — NeurIPS 1991 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1991/hash/99c5e07b4d5de9d18c350cdf64c5aa3d-Abstract.html)
- [Neural Network Routing for Random Multistage Interconnection Networks](../specialist/hopfield-multistage-routing.md) — NeurIPS 1991 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1991/hash/f3f27a324736617f20abbf2ffd806f6d-Abstract.html)
- [Automatic Local Annealing](../specialist/automatic-local-annealing.md) — NeurIPS 1988 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1988/hash/42a0e188f5033bc65bf8d78622277c4e-Abstract.html)
- [Neural Networks for Model Matching and Perceptual Organization](../specialist/neural-model-matching.md) — NeurIPS 1988 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1988/hash/a3c65c2974270fd093ee8a9bf8ae7d0b-Abstract.html)
- [Optimization by Mean Field Annealing](../specialist/mean-field-annealing.md) — NeurIPS 1988 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1988/hash/ec5decca5ed3d6b8079e2e7e7bacc9f2-Abstract.html)
- [A Neural-Network Solution to the Concentrator Assignment Problem](../specialist/hopfield-concentrator-assignment.md) — NeurIPS 1987 · [正式论文](https://proceedings.neurips.cc/paper_files/paper/1987/hash/77cdf4ffbd2afd02541e02533ec56820-Abstract.html)

### 现有笔记中未计入本次口径的条目

共 **22 篇**。这些笔记保留在仓库中，但不能从本次正式总数中重复扣除。

- [LEGO-Puzzles: How Good Are MLLMs at Multi-Step Spatial Reasoning?](../studies/lego-puzzles-how-good-are-mllms-at-multi-step-spatial-reasoning.md) — ECCV 2026；General MLLM spatial-reasoning and assembly-planning evaluation; no direct neural combinatorial-optimizer comparison or optimization/feasible-decoder study.。
- [VSAL: A Vision Solver with Adaptive Layouts for Graph Property Detection](../studies/vsal-a-vision-solver-with-adaptive-layouts-for-graph-property-detection.md) — WWW 2026；Binary graph-property detection with no constructed discrete solution, optimization certificate or tested feasible-tour decoder.。
- [Ant Colony Sampling with GFlowNets for Combinatorial Optimization](../specialist/gfacs.md) — AISTATS 2025；AISTATS is outside the approved main-conference and journal inclusion list.。
- [Less Is More -- On the Importance of Sparsification for Transformers and Graph Neural Networks for TSP](../specialist/less-is-more.md) — arXiv 2024；The official Chalmers publication record still labels this work Preprint; no qualifying formal publication has been established as of 2026-11-16.。
- [Select and Optimize: Learning to solve large-scale TSP instances](../specialist/select-and-optimize.md) — AISTATS 2023；AISTATS is outside the approved main-conference and journal inclusion list.。
- [A Comparative Study of Graph Matching Algorithms in Computer Vision](../studies/a-comparative-study-of-graph-matching-algorithms-in-computer-vision.md) — ECCV 2022；Comparison of classical graph-matching optimizers on fixed costs; the paper explicitly excludes cost modeling/learning and does not evaluate neural solvers.。
- [Deep Policy Dynamic Programming for Vehicle Routing Problems](../specialist/deep-policy-dynamic-programming.md) — CPAIOR 2022；CPAIOR is outside the approved main-conference and journal inclusion list.。
- [Learning 3-opt Heuristics for Traveling Salesman Problem via Deep Reinforcement Learning](../specialist/neural-3-opt.md) — ACML 2021；ACML is outside the approved main-conference and journal inclusion list.。
- [Graph Edit Distance Learning via Modeling Optimum Matchings with Constraints](../studies/graph-edit-distance-learning-via-modeling-optimum-matchings-with-constraints.md) — IJCAI 2021；Scalar GED regression with auxiliary soft matching supervision; no reported hard assignment or edit-path solver output.。
- [Integrated Defense for Resilient Graph Matching](../specialist/idr-gm.md) — ICML 2021；Learned embedding and graph-matching defense without an identifiable neural solver architecture in the reviewed paper or supplement; retained as a related reference.。
- [A Deep Reinforcement Learning Algorithm Using Dynamic Attention Model for Vehicle Routing Problems](../specialist/dynamic-am.md) — ISICA 2020；ISICA is outside the approved main-conference and journal inclusion list.。
- [A Graph Neural Network Assisted Monte Carlo Tree Search Approach to Traveling Salesman Problem](../specialist/gnn-mcts-tsp.md) — IEEE Access 2020；IEEE Access is outside the approved main-conference and journal inclusion list.。
- [Predicting Propositional Satisfiability via End-to-End Learning](../studies/predicting-propositional-satisfiability-via-end-to-end-learning.md) — AAAI 2020；SAT-label classification and auxiliary bit prediction; reported bit agreement is not a demonstrated valid SAT-witness solver.。
- [Learn to Design the Heuristics for Vehicle Routing Problem](../specialist/egate.md) — IJCAI HSI Workshop 2020；Workshop-track publication outside the approved main-conference criteria.。
- [Neural Large Neighborhood Search for the Capacitated Vehicle Routing Problem](../specialist/neural-large-neighborhood-search.md) — ECAI 2020；ECAI is outside the approved main-conference and journal inclusion list.。
- [Combinatorial Optimization by Graph Pointer Networks and Hierarchical Reinforcement Learning](../specialist/graph-pointer-network-hrl.md) — AAAI Workshop on Deep Learning on Graphs: Methodologies and Applications 2020；AAAI2020 Deep Learning on Graphs workshop poster/spotlight, outside the approved main-conference criteria.。
- [Learning to Solve NP-Complete Problems: A Graph Neural Network for Decision TSP](../studies/learning-to-solve-np-complete-problems-a-graph-neural-network-for-decision-tsp.md) — AAAI 2019；Evaluated output is decision probability or estimated optimal cost; feasible-tour extraction is explicitly future work.。
- [An Efficient Graph Convolutional Network Technique for the Travelling Salesman Problem](../specialist/efficient-graph-convnet-tsp.md) — arXiv 2019；Current record is arXiv-only; a qualifying formal publication has not been established in this review round.。
- [Learning Heuristics for the TSP by Policy Gradient](../specialist/learning-heuristic.md) — CPAIOR 2018；CPAIOR is outside the approved main-conference and journal inclusion list.。
- [Cellular Network Traffic Scheduling With Deep Reinforcement Learning](../studies/cellular-network-traffic-scheduling-with-deep-reinforcement-learning.md) — AAAI 2018；Continuous duty-fraction traffic control, without learned discrete packet assignments or combinatorial schedule construction.。
- [Post: Device Placement with Cross-Entropy Minimization and Proximal Policy Optimization](../specialist/post-device-placement.md) — NeurIPS 2018；Related RL placement optimizer using directly fitted independent categorical logits rather than a neural solver; retained as a topical reference.。
- [Neural Combinatorial Optimization with Reinforcement Learning](../specialist/neural-combinatorial-optimization.md) — ICLR Workshop 2017；Workshop-track publication outside the approved main-conference criteria.。

## 范围边界参考：不计入正式总数

共 **92 篇**。

<details>
<summary>展开边界参考清单</summary>

- **X0001** [Bridging Synthetic and Real Routing Problems via LLM-Guided Instance Generation and Progressive Adaptation](https://ojs.aaai.org/index.php/AAAI/article/view/40982) — AAAI 2026
- **X0002** [CO-Bench: Benchmarking Language Model Agents in Algorithm Search for Combinatorial Optimization](https://ojs.aaai.org/index.php/AAAI/article/view/40596) — AAAI 2026
- **X0003** [EoH-S: Evolution of Heuristic Set Using LLMs for Automated Heuristic Design](https://ojs.aaai.org/index.php/AAAI/article/view/41038) — AAAI 2026
- **X0004** [Pareto-Grid-Guided Large Language Models for Fast and High-Quality Heuristics Design in Multi-Objective Combinatorial Optimization](https://ojs.aaai.org/index.php/AAAI/article/view/41024) — AAAI 2026
- **X0005** [LEGO-Puzzles: How Good Are MLLMs at Multi-step Spatial Reasoning?](https://link.springer.com/chapter/10.1007/978-3-032-37553-7_1) — ECCV 2026
- **X0006** [A logic-based Benders decomposition with reinforcement learning-guided check-and-cut for the double-stack railway loading problem](https://www.sciencedirect.com/science/article/pii/S0377221726009033) — European Journal of Operational Research 2026
- **X0007** [Decision-focused learning for distributionally robust multi-agent dynamic vehicle routing in e-commerce last-mile delivery](https://www.sciencedirect.com/science/article/pii/S0377221726007678) — European Journal of Operational Research 2026
- **X0008** [An Agentic Framework with LLMs for Solving Complex Vehicle Routing Problems](https://proceedings.iclr.cc/paper_files/paper/2026/hash/b9c91701ff28d480f186e4643e71ad11-Abstract-Conference.html) — ICLR 2026
- **X0009** [AutoEP: LLMs-Driven Automation of Hyperparameter Evolution for Metaheuristic Algorithms](https://proceedings.iclr.cc/paper_files/paper/2026/hash/e2c33c1753e1f1924f5560b11fc4444f-Abstract-Conference.html) — ICLR 2026
- **X0010** [CALM: Co-evolution of Algorithms and Language Model for Automatic Heuristic Design](https://proceedings.iclr.cc/paper_files/paper/2026/hash/75ed738c083f8941cfc990245e4f6265-Abstract-Conference.html) — ICLR 2026
- **X0011** [Generalizable Heuristic Generation Through LLMs with Meta-Optimization](https://proceedings.iclr.cc/paper_files/paper/2026/hash/c1e67cde895c3c91edb43569ad0df260-Abstract-Conference.html) — ICLR 2026
- **X0012** [HeuriGym: An Agentic Benchmark for LLM-Crafted Heuristics in Combinatorial Optimization](https://proceedings.iclr.cc/paper_files/paper/2026/hash/2e49934cac6cb8604b0c67cfa0828718-Abstract-Conference.html) — ICLR 2026
- **X0013** [HiFo-Prompt: Prompting with Hindsight and Foresight for LLM-based Automatic Heuristic Design](https://proceedings.iclr.cc/paper_files/paper/2026/hash/be36e50757bf9cd280aa74f89a7d1c23-Abstract-Conference.html) — ICLR 2026
- **X0014** [Refining Hybrid Genetic Search for CVRP via Reinforcement Learning-Finetuned LLM](https://proceedings.iclr.cc/paper_files/paper/2026/hash/b54532b0e57eb963b19e00583376cda3-Abstract-Conference.html) — ICLR 2026
- **X0015** [ViTSP: A Vision Language Models Guided Framework for Solving Large-Scale Traveling Salesman Problems](https://proceedings.iclr.cc/paper_files/paper/2026/hash/d6e71be5a6cb61dfa3f9ffbdd6e05b3c-Abstract-Conference.html) — ICLR 2026
- **X0016** [STAR-Scheduler: Spatio-Temporal-Aware Scheduler for Streaming Tasks of Large-Scale Moving Objects Based on Multi-Agent Reinforcement Learning](https://ieeexplore.ieee.org/document/11692646/) — IEEE Transactions on Cloud Computing 2026（Early Access）
- **X0017** [Hybrid Learning for Cold-Start-Aware Microservice Scheduling in Dynamic Edge Environments](https://ieeexplore.ieee.org/document/11288032/) — IEEE Transactions on Mobile Computing 2026
- **X0018** [Scalable and Efficient Reinforcement Learning for Virtual Machine Rescheduling in Cloud Data Centers](https://ieeexplore.ieee.org/document/11440117/) — IEEE Transactions on Parallel and Distributed Systems 2026
- **X0019** [Microservice Scheduling With Spatiotemporal Learning in Dynamic and GPU-CPU Heterogeneous Edge Environment](https://ieeexplore.ieee.org/document/11429110/) — IEEE Transactions on Services Computing 2026
- **X0020** [Bridging LLMs and SAT Solving: Automated Evolution of High-Performance Heuristics](https://www.ijcai.org/proceedings/2026/257) — IJCAI 2026
- **X0021** [Learning to Solve and Optimize by Evolving Code](https://www.ijcai.org/proceedings/2026/451) — IJCAI 2026
- **X0022** [Data-Driven Capacity Management of Ride-Hailing Service with Prescriptive Analytics and Deep Learning](https://pubsonline.informs.org/doi/10.1287/ijoc.2024.0595) — INFORMS Journal on Computing 2026
- **X0023** [Learning Capacity Constraints with Convex Neural Networks in Lot-Sizing Problems](https://pubsonline.informs.org/doi/10.1287/ijoc.2024.1033) — INFORMS Journal on Computing 2026
- **X0024** [Learning Virtual Machine Scheduling in Cloud Computing Through Language Agents](https://pubsonline.informs.org/doi/10.1287/ijoc.2025.1368) — INFORMS Journal on Computing 2026
- **X0025** [When Deep Learning Meets Polyhedral Theory: A Survey](https://pubsonline.informs.org/doi/10.1287/ijoc.2024.0902) — INFORMS Journal on Computing 2026
- **X0026** [MobilityBench: A Benchmark for Evaluating Route-Planning Agents in Real-World Mobility Scenarios](https://doi.org/10.1145/3770855.3817498) — KDD 2026
- **X0027** [Two-Stage Learning to Branch in Branch-Price-and-Cut Algorithms for Solving Vehicle Routing Problems Exactly](https://pubsonline.informs.org/doi/10.1287/opre.2023.0615) — Operations Research 2026
- **X0028** [Geometry-Aware MCTS for Extremal Problems in Combinatorial Geometry](https://openreview.net/forum?id=xtlbkvz6qb) — TMLR 2026
- **X0029** [LLM-Guided Evolution of Symbolic Acceleration Inequality Families for MILP](https://openreview.net/forum?id=rxJvINT074) — TMLR 2026
- **X0030** [Towards Near-Real-Time Telemetry-Aware Routing with Neural Routing Algorithms](https://openreview.net/forum?id=jmk2SoQklg) — TMLR 2026
- **X0031** [Vejde: A Framework for Inductive Deep Reinforcement Learning Based on Factor Graph Color Refinement](https://openreview.net/forum?id=EFSZmL1W1Z) — TMLR 2026
- **X0032** [VRPAgent: LLM-Driven Discovery of Heuristic Operators for Vehicle Routing Problems](https://openreview.net/forum?id=2cYbzycSbz) — TMLR 2026
- **X0033** [VSAL: A Vision Solver with Adaptive Layouts for Graph Property Detection](https://doi.org/10.1145/3774904.3792224) — WWW 2026
- **X0034** [HSEvo: Elevating Automatic Heuristic Design with Diversity-Driven Harmony Search and Genetic Algorithm Using LLMs](https://ojs.aaai.org/index.php/AAAI/article/view/34898) — AAAI 2025
- **X0035** [Multi-Objective Evolution of Heuristic Using Large Language Model](https://ojs.aaai.org/index.php/AAAI/article/view/34922) — AAAI 2025
- **X0036** [On the integration of reinforcement learning and simulated annealing for the parallel batch scheduling problem with setups](https://www.sciencedirect.com/science/article/pii/S0377221725003273) — European Journal of Operational Research 2025
- **X0037** [Charting the Design Space of Neural Graph Representations for Subgraph Matching](https://proceedings.iclr.cc/paper_files/paper/2025/hash/255f2cd7a78060aa689c330fed9ac8b0-Abstract-Conference.html) — ICLR 2025
- **X0038** [DRoC: Elevating Large Language Models for Complex Vehicle Routing via Decomposed Retrieval of Constraints](https://proceedings.iclr.cc/paper_files/paper/2025/hash/73d6c3e4b214deebbbf8256e26d2cf45-Abstract-Conference.html) — ICLR 2025
- **X0039** [PharmacoMatch: Efficient 3D Pharmacophore Screening via Neural Subgraph Matching](https://proceedings.iclr.cc/paper_files/paper/2025/hash/d50b5d3afc421b9da7846ca1427d4356-Abstract-Conference.html) — ICLR 2025
- **X0040** [Neural Graph Matching Improves Retrieval Augmented Generation in Molecular Machine Learning](https://proceedings.mlr.press/v267/wang25dg.html) — ICML 2025
- **X0041** [Learning-Based Heterogeneous Autonomous Vehicles Scheduling for On-Demand Last-Mile Transportation](https://ieeexplore.ieee.org/document/11172291/) — IEEE Transactions on Automation Science and Engineering 2025
- **X0042** [Two-Stage Learning Approach for Semantic-Aware Task Scheduling in Container-Based Clouds](https://ieeexplore.ieee.org/document/10810299/) — IEEE Transactions on Cloud Computing 2025
- **X0043** [Cooperative Learning-Based Joint UAV and Human Courier Scheduling for Emergency Medical Delivery Service](https://ieeexplore.ieee.org/document/10745907/) — IEEE Transactions on Intelligent Transportation Systems 2025
- **X0044** [Soft Actor-Critic Deep Reinforcement Learning for Train Timetable Collaborative Optimization of Large-Scale Urban Rail Transit Network Under Dynamic Demand](https://ieeexplore.ieee.org/document/10844003/) — IEEE Transactions on Intelligent Transportation Systems 2025
- **X0045** [LLM-QL: A LLM-Enhanced Q-Learning Approach for Scheduling Multiple Parallel Drones](https://ieeexplore.ieee.org/document/11033203/) — IEEE Transactions on Knowledge and Data Engineering 2025
- **X0046** [MPDA: A Massively Parallel Learning and Dependency-Aware Scheduling Algorithm for Data Processing Clusters](https://ieeexplore.ieee.org/document/11095861/) — IEEE Transactions on Services Computing 2025
- **X0047** [A Learning-Based Approach for Train Timetable Rescheduling With Robustness Guarantee](https://ieeexplore.ieee.org/document/11163394/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2025
- **X0048** [NS4S: Neighborhood Search for Scheduling Problems Via Large Language Models](https://www.ijcai.org/proceedings/2025/966) — IJCAI 2025
- **X0049** [An Efficient Node Selection Policy for Monte Carlo Tree Search with Neural Networks](https://pubsonline.informs.org/doi/10.1287/ijoc.2023.0307) — INFORMS Journal on Computing 2025
- **X0050** [Efficient Heuristics Generation for Solving Combinatorial Optimization Problems Using Large Language Models](https://doi.org/10.1145/3711896.3736923) — KDD 2025
- **X0051** [A unified pre-trained deep learning framework for cross-task reaction performance prediction and synthesis planning](https://doi.org/10.1038/s42256-025-01098-4) — Nature Machine Intelligence 2025
- **X0052** [Partition to Evolve: Niching-enhanced Evolution with LLMs for Automated Algorithm Discovery](https://proceedings.neurips.cc/paper_files/paper/2025/hash/e389b15166cf98966ba058965a8c17e3-Abstract-Conference.html) — NeurIPS 2025
- **X0053** [Mixed-Integer Optimization with Constraint Learning](https://pubsonline.informs.org/doi/10.1287/opre.2021.0707) — Operations Research 2025
- **X0054** [A Systematic Evaluation of the Planning and Scheduling Abilities of the Reasoning Model o1](https://openreview.net/forum?id=FkKBxp0FhR) — TMLR 2025
- **X0055** [Decision-Focused Surrogate Modeling for Mixed-Integer Linear Optimization](https://openreview.net/forum?id=A6tOXkkE4Z) — TMLR 2025
- **X0056** [Reheated Gradient-based Discrete Sampling for Combinatorial Optimization](https://openreview.net/forum?id=uPCvfyr2KP) — TMLR 2025
- **X0057** [A flow based formulation and a reinforcement learning based strategic oscillation for cross-dock door assignment](https://www.sciencedirect.com/science/article/pii/S0377221723005520) — European Journal of Operational Research 2024
- **X0058** [Learning to Optimize Workflow Scheduling for an Edge–Cloud Computing Environment](https://ieeexplore.ieee.org/document/10545338/) — IEEE Transactions on Cloud Computing 2024
- **X0059** [Learned Unmanned Vehicle Scheduling for Large-Scale Urban Logistics](https://ieeexplore.ieee.org/document/10414380/) — IEEE Transactions on Intelligent Transportation Systems 2024
- **X0060** [Reinforcement Learning for Online Dispatching Policy in Real-Time Train Timetable Rescheduling](https://ieeexplore.ieee.org/document/10226458/) — IEEE Transactions on Intelligent Transportation Systems 2024
- **X0061** [Practical Reinforcement Learning for Adaptive Photolithography Scheduler in Mass Production](https://ieeexplore.ieee.org/document/10330650/) — IEEE Transactions on Semiconductor Manufacturing 2024
- **X0062** [A Socialized Learning-Based Scheduling Framework in Intricate Edge Clouds](https://ieeexplore.ieee.org/document/10534813/) — IEEE Transactions on Services Computing 2024
- **X0063** [A Hybrid Graph-Based Imitation Learning Method for a Realistic Distributed Hybrid Flow Shop With Family Setup Time](https://ieeexplore.ieee.org/document/10677442/) — IEEE Transactions on Systems, Man, and Cybernetics: Systems 2024
- **X0064** [Enhancing combinatorial optimization with classical and quantum generative models](https://doi.org/10.1038/s41467-024-46959-5) — Nature Communications 2024
- **X0065** [Automated Design of Metaheuristic Algorithms: A Survey](https://openreview.net/forum?id=qhtHsvF5zj) — TMLR 2024
- **X0066** [Learning Sub-Second Routing Optimization in Computer Networks requires Packet-Level Dynamics](https://openreview.net/forum?id=H95g8UpYKY) — TMLR 2024
- **X0067** [An online reinforcement learning approach to charging and order-dispatching optimization for an e-hailing electric vehicle fleet](https://www.sciencedirect.com/science/article/pii/S0377221723002667) — European Journal of Operational Research 2023
- **X0068** [Learning to select operators in meta-heuristics: An integration of Q-learning into the iterated greedy algorithm for the permutation flowshop scheduling problem](https://www.sciencedirect.com/science/article/pii/S0377221722002788) — European Journal of Operational Research 2023
- **X0069** [Learning Scheduling Policies for Co-Located Workloads in Cloud Datacenters](https://ieeexplore.ieee.org/document/10264223/) — IEEE Transactions on Cloud Computing 2023
- **X0070** [Workflow Scheduling in Serverless Edge Computing for the Industrial Internet of Things: A Learning Approach](https://ieeexplore.ieee.org/document/9931467/) — IEEE Transactions on Industrial Informatics 2023
- **X0071** [Layer Dependency-Aware Learning Scheduling Algorithms for Containers in Mobile Edge Computing](https://ieeexplore.ieee.org/document/9669001/) — IEEE Transactions on Mobile Computing 2023
- **X0072** [Learning to Schedule Multi-Server Jobs With Fluctuated Processing Speeds](https://ieeexplore.ieee.org/document/9925644/) — IEEE Transactions on Parallel and Distributed Systems 2023
- **X0073** [A Prescriptive Machine Learning Approach to Mixed-Integer Convex Optimization](https://pubsonline.informs.org/doi/10.1287/ijoc.2022.0188) — INFORMS Journal on Computing 2023
- **X0074** [A Comparative Study of Graph Matching Algorithms in Computer Vision](https://www.ecva.net/papers/eccv_2022/papers_ECCV/html/7070_ECCV_2022_paper.php) — ECCV 2022
- **X0075** [Learning generalized strong branching for set covering, set packing, and 0–1 knapsack problems](https://www.sciencedirect.com/science/article/pii/S0377221721010018) — European Journal of Operational Research 2022
- **X0076** [Imitation Learning Enabled Task Scheduling for Online Vehicular Edge Computing](https://ieeexplore.ieee.org/document/9151371/) — IEEE Transactions on Mobile Computing 2022
- **X0077** [ASTRAEA: A Fair Deep Learning Scheduler for Multi-Tenant GPU Clusters](https://ieeexplore.ieee.org/document/9655467/) — IEEE Transactions on Parallel and Distributed Systems 2022
- **X0078** [Learning-Based Branch-and-Price Algorithms for the Vehicle Routing Problem with Time Windows and Two-Dimensional Loading Constraints](https://pubsonline.informs.org/doi/10.1287/ijoc.2021.1110) — INFORMS Journal on Computing 2022
- **X0079** [Integrated Defense for Resilient Graph Matching](https://proceedings.mlr.press/v139/ren21c.html) — ICML 2021
- **X0080** [Graph Edit Distance Learning via Modeling Optimum Matchings with Constraints](https://www.ijcai.org/proceedings/2021/212) — IJCAI 2021
- **X0081** [SDP-Based Bounds for the Quadratic Cycle Cover Problem via Cutting-Plane Augmented Lagrangian Methods and Reinforcement Learning](http://pubsonline.informs.org/doi/10.1287/ijoc.2021.1075) — INFORMS Journal on Computing 2021
- **X0082** [Predicting Propositional Satisfiability via End-to-End Learning](https://ojs.aaai.org/index.php/AAAI/article/view/5733) — AAAI 2020
- **X0083** [Dynamic selective maintenance optimization for multi-state systems over a finite horizon: A deep reinforcement learning approach](https://www.sciencedirect.com/science/article/pii/S0377221719309014) — European Journal of Operational Research 2020
- **X0084** [Retro*: Learning Retrosynthetic Planning with Neural Guided A* Search](https://proceedings.mlr.press/v119/chen20k.html) — ICML 2020
- **X0085** [Runtime Task Scheduling Using Imitation Learning for Heterogeneous Many-Core Systems](https://ieeexplore.ieee.org/document/9211494/) — IEEE Transactions on Computer-Aided Design of Integrated Circuits and Systems 2020
- **X0086** [Learning to Solve Large-Scale Security-Constrained Unit Commitment Problems](http://pubsonline.informs.org/doi/10.1287/ijoc.2020.0976) — INFORMS Journal on Computing 2020
- **X0087** [Learning in Combinatorial Optimization: What and How to Explore](https://pubsonline.informs.org/doi/10.1287/opre.2019.1926) — Operations Research 2020
- **X0088** [Learning to Solve NP-Complete Problems: A Graph Neural Network for Decision TSP](https://ojs.aaai.org/index.php/AAAI/article/view/33014731) — AAAI 2019
- **X0089** [Cellular Network Traffic Scheduling With Deep Reinforcement Learning](https://ojs.aaai.org/index.php/AAAI/article/view/11339) — AAAI 2018
- **X0090** [Post: Device Placement with Cross-Entropy Minimization and Proximal Policy Optimization](https://proceedings.neurips.cc/paper_files/paper/2018/hash/92650b2e92217715fe312e6fa7b90d82-Abstract.html) — NeurIPS 2018
- **X0091** [A hybrid breakout local search and reinforcement learning approach to the vertex separator problem](https://www.sciencedirect.com/science/article/pii/S0377221717300589) — European Journal of Operational Research 2017
- **X0092** [Oscillatory Neural Fields for Globally Optimal Path Planning](https://proceedings.neurips.cc/paper_files/paper/1991/hash/c9892a989183de32e976c6f04e700201-Abstract.html) — NeurIPS 1991

</details>

<a name="search-audit"></a>

## 检索来源与覆盖审计

候选发现与发表确认分开：社区索引和综述用于找线索，正式论文集、出版社条目及其登记元数据用于核验发表。没有把 GitHub 清单声称的 venue 直接当作出版事实。

- [NeurIPS 正式论文集](https://proceedings.neurips.cc/)：扫描历史与现代年度目录，另外核查 2025 年主会目录；2026 年只有接收信息的不计。
- [ICML / PMLR](https://proceedings.mlr.press/)：扫描 2015–2026 年正式目录，共 20,240 篇题录；2026 年对应 Volume 306。
- [ICLR 正式论文集](https://proceedings.iclr.cc/)及[官方历史虚拟目录](https://iclr.cc/virtual/2023/papers.html)：扫描 2018–2026；2020 年链接变更用 [ICLR 官方归档](https://iclr.github.io/build/virtual/papers.json)校验。
- [AAAI 出版社](https://ojs.aaai.org/index.php/AAAI) / [出版社登记题录](https://api.crossref.org/)：2015–2026 全量 23,711 条记录，区分主会、IAAI、workshop 与短文。
- [IJCAI 正式论文集](https://www.ijcai.org/proceedings/)：2015–2026 年官方目录。
- [CVF 开放论文集](https://openaccess.thecvf.com/)与[ECVA](https://www.ecva.net/papers.php)：扫描 CVPR/ICCV/ECCV 的相关年度；ECCV 2026 另核 Springer 正式上线日期。
- [JMLR 正式卷册](https://jmlr.org/papers/)：2015–2026 全量题名；[TMLR 正式发表目录](https://jmlr.org/tmlr/papers/)：全量目录题名筛选，相关条目的公开月份早于截止日。
- [IEEE Xplore](https://ieeexplore.ieee.org/)与 [Crossref 出版社登记元数据](https://api.crossref.org/)：多主题召回、核心期刊完整题录扫描，并结合正式 epublish 日期区分 Early Access 与待核验记录。
- 期刊全目录审计：**29 种期刊、142,542 条题录**完成 cursor 分页，逐刊核对返回总数、去重 DOI 数和 API 声明总数一致；包括 23 种 IEEE Transactions、3 种 OR 期刊和 AIJ/JAIR/NMI。原始检索以“2015 年起、截止日已登记题录”为条件；实际纳入仍须通过发表日期核验。
- 社区检索入口：[awesome-ml4co](https://github.com/Thinklab-SJTU/awesome-ml4co)、[COPZoo](https://github.com/dongjinkun/COPZoo)、[NCO-solvers-for-VRP](https://github.com/wuuu110/NCO-solvers-for-VRP)。这些入口只用于发现，不单独证明正式发表。

### 覆盖限制与复核注意事项

- “顶会 / 同级顶刊”不是一个天然封闭集合；本文件的数字只适用于已列明白名单和主题范围。若增加其他场合，需要重新计算。
- 部分出版社页面受访问限制。无法取得足够日期或方法证据的记录留在待核验区，既不伪装成已确认，也不从清单中悄悄丢弃。
- 全目录扫描保证对应目录题名已枚举，不保证仅靠题名能识别所有没有显式主题词的论文；因此另做综述交叉、同义词补查与引用回溯。
- 2015 年以前的 IEEE / OR 历史研究、Nature / Science / Nature Communications 的专题补检采用主题与引用回溯，覆盖深度不同于完整年度目录扫描；历史列表不应被当作这些期刊的逐卷全量复核。
- 对不同题名的期刊扩展、同一算法的新论文以及新的 Generalist 共享模型定义，后续录入时仍应读正文判断。这里先提供可追溯的文章级清单。

### 正式论文的发表年份分布

| 年份 | 符合口径 | 仓库已覆盖 | 待添加 |
| --- | ---: | ---: | ---: |
| 2026 | 152 | 82 | 70 |
| 2025 | 161 | 93 | 68 |
| 2024 | 135 | 75 | 60 |
| 2023 | 102 | 64 | 38 |
| 2022 | 78 | 47 | 31 |
| 2021 | 47 | 36 | 11 |
| 2020 | 41 | 35 | 6 |
| 2019 | 23 | 18 | 5 |
| 2018 | 11 | 11 | 0 |
| 2017 | 3 | 2 | 1 |
| 2016 | 1 | 0 | 1 |
| 2015 | 1 | 1 | 0 |
| 2013 | 2 | 1 | 1 |
| 2012 | 1 | 0 | 1 |
| 2011 | 2 | 0 | 2 |
| 2010 | 2 | 0 | 2 |
| 2009 | 1 | 0 | 1 |
| 2007 | 1 | 0 | 1 |
| 2006 | 4 | 0 | 4 |
| 2005 | 1 | 0 | 1 |
| 2004 | 4 | 0 | 4 |
| 2003 | 4 | 0 | 4 |
| 2002 | 2 | 0 | 2 |
| 2000 | 8 | 0 | 8 |
| 1999 | 6 | 0 | 6 |
| 1998 | 5 | 0 | 5 |
| 1997 | 2 | 1 | 1 |
| 1996 | 11 | 3 | 8 |
| 1995 | 6 | 4 | 2 |
| 1994 | 2 | 0 | 2 |
| 1993 | 6 | 2 | 4 |
| 1992 | 2 | 1 | 1 |
| 1991 | 3 | 2 | 1 |
| 1988 | 3 | 3 | 0 |
| 1987 | 2 | 1 | 1 |
| 1986 | 1 | 0 | 1 |

---

本文只登记元信息、发表证据和录入状态。方法细节请阅读对应论文笔记。
