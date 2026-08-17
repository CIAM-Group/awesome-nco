[Back to main index](../README.md)

# Generalist Neural Solvers

Generalist neural solvers use a shared model or checkpoint to solve multiple distinct optimization problems. Lightweight task conditioning, input/output adapters, or problem-specific action heads are allowed when the core solver is shared across tasks.

A common architecture trained separately for every problem is not generalist. Generalization across sizes or distributions of one problem is also not sufficient. When adaptation is required for a new problem, the entry should state what remains shared and what must be trained or fine-tuned.

## Inclusion Boundary

- **Included:** One jointly trained model serving multiple distinct problems.
- **Included:** A shared backbone with lightweight task-specific adapters.
- **Included:** A shared multi-problem checkpoint that can be adapted to new problems.
- **Not sufficient:** One architecture with a separate checkpoint per problem.
- **Not sufficient:** Size or distribution generalization within one problem.
- **Not sufficient:** Evaluation on several problems after independent training.

## Solver Paradigms

- **Constructive:** Builds a complete solution from an empty or partial solution.
- **Improvement:** Starts from a complete solution and repeatedly modifies it.
- **Constructive + Improvement:** Both construction and improvement are substantive parts of the proposed method. Optional conventional post-processing alone does not qualify.

## Papers

Select a paper title to open its research note.

<!-- GENERATED_PAPER_INDEX_START -->
### [URS: A Unified Neural Routing Solver for Cross-Problem Zero-Shot Generalization](urs.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows; Pickup and Delivery Vehicle Routing Problem
- **Venue:** ICML
- **Year:** 2026
- **Accepted:** [2026-04-30](https://icml.cc/Conferences/2026/Dates)
- **arXiv:** [2025-09-27](https://arxiv.org/abs/2509.23413)
- **Institutions:** Southern University of Science and Technology

### [MTL-KD: Multi-Task Learning Via Knowledge Distillation for Generalizable Neural Vehicle Routing Solver](mtl-kd.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Pickup and Delivery Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2025
- **Accepted:** [2025-09-18](https://neurips.cc/Conferences/2025/CallForPapers)
- **arXiv:** [2025-06-03](https://arxiv.org/abs/2506.02935)
- **Institutions:** Southern University of Science and Technology

### [RouteFinder: Towards Foundation Models for Vehicle Routing Problems](routefinder.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Time Windows; Pickup and Delivery Vehicle Routing Problem
- **Venue:** TMLR
- **Year:** 2025
- **Accepted:** [2025-08](https://openreview.net/forum?id=QzGLoaOPiY)
- **arXiv:** [2024-06-21](https://arxiv.org/abs/2406.15007)
- **Institutions:** TU Dortmund University; KAIST

### [SHIELD: Multi-task Multi-distribution Vehicle Routing Solver with Sparsity and Hierarchy](shield.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Time Windows
- **Venue:** ICML
- **Year:** 2025
- **Accepted:** [2025-05-01](https://icml.cc/Conferences/2025/Dates)
- **arXiv:** [2025-06-10](https://arxiv.org/abs/2506.08424)
- **Institutions:** National University of Singapore

### [A Mixed-Curvature based Pre-training Paradigm for Multi-Task Vehicle Routing Solver](mixed-curvature.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls
- **Venue:** ICML
- **Year:** 2025
- **Accepted:** [2025-05-01](https://icml.cc/Conferences/2025/Dates)
- **arXiv:** —
- **Institutions:** Nanyang Technological University

### [CaDA: Cross-Problem Routing Solver with Constraint-Aware Dual-Attention](cada.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls; Pickup and Delivery Vehicle Routing Problem
- **Venue:** ICML
- **Year:** 2025
- **Accepted:** [2025-05-01](https://icml.cc/Conferences/2025/Dates)
- **arXiv:** [2024-11-30](https://arxiv.org/abs/2412.00346)
- **Institutions:** Southern University of Science and Technology

### [GOAL: A Generalist Combinatorial Optimization Agent Learner](goal.md)

- **Paradigm:** Constructive
- **Problems:** Asymmetric Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Capacitated Vehicle Routing Problem with Time Windows; Orienteering Problem; Job Shop Scheduling Problem; Uniform Machine Scheduling Problem; Knapsack Problem; Minimum Vertex Cover
- **Venue:** ICLR
- **Year:** 2025
- **Accepted:** [2025-01-22](https://iclr.cc/Conferences/2025/Dates)
- **arXiv:** [2024-06-21](https://arxiv.org/abs/2406.15079)
- **Institutions:** NAVER LABS Europe

### [Multi-Task Learning for Routing Problem with Cross-Problem Zero-Shot Generalization](mtpomo.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls; Pickup and Delivery Vehicle Routing Problem
- **Venue:** KDD
- **Year:** 2024
- **Accepted:** [2024-05-16](https://www.kdd.org/kdd2024/research-track-call-for-papers/)
- **arXiv:** [2024-02-23](https://arxiv.org/abs/2402.16891)
- **Institutions:** Southern University of Science and Technology

### [MVMoE: Multi-Task Vehicle Routing Solver with Mixture-of-Experts](mvmoe.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Open Vehicle Routing Problem; Vehicle Routing Problem with Backhauls; Pickup and Delivery Vehicle Routing Problem
- **Venue:** ICML
- **Year:** 2024
- **Accepted:** [2024-05-01](https://icml.cc/Conferences/2024/Dates)
- **arXiv:** [2024-05-02](https://arxiv.org/abs/2405.01029)
- **Institutions:** Nanyang Technological University

### [Cross-Problem Learning for Solving Vehicle Routing Problems](cross-problem-learning.md)

- **Paradigm:** Constructive
- **Problems:** Capacitated Vehicle Routing Problem; Vehicle Routing Problem with Time Windows; Orienteering Problem
- **Venue:** IJCAI
- **Year:** 2024
- **Accepted:** [2024-04-16](https://ijcai24.org/call-for-papers/index.html)
- **arXiv:** [2024-04-17](https://arxiv.org/abs/2404.11677)
- **Institutions:** Nanyang Technological University
<!-- GENERATED_PAPER_INDEX_END -->

## Adding a Generalist Solver

Add a paper here only when one shared model or checkpoint serves multiple distinct optimization problems.

1. Create a paper note in this directory.
2. Add YAML Front Matter using the same schema as the existing paper notes.
3. Set `scope: generalist` and assign one of the three solver paradigms.
4. State clearly which parameters are shared and which components are task-specific.
5. Describe whether new tasks are handled directly, through adapters, or through fine-tuning.
6. Open a pull request; the paper index above is generated automatically from the Front Matter.
