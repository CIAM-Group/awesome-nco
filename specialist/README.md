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

### [Learning to Iteratively Solve Routing Problems with Dual-Aspect Collaborative Transformer](dact.md)

- **Paradigm:** Improvement
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem
- **Venue:** NeurIPS
- **Year:** 2021
- **First public:** 2021-10-06
- **Institutions:** National University of Singapore; A*STAR; Shandong University; University of Electronic Science and Technology of China; Hong Kong University of Science and Technology

### [Attention, Learn to Solve Routing Problems!](attention-model.md)

- **Paradigm:** Constructive
- **Problems:** Traveling Salesman Problem; Capacitated Vehicle Routing Problem; Split Delivery Vehicle Routing Problem; Orienteering Problem; Prize Collecting Traveling Salesman Problem; Stochastic Prize Collecting Traveling Salesman Problem
- **Venue:** ICLR
- **Year:** 2019
- **First public:** 2018-03-22
- **Institutions:** University of Amsterdam; ORTEC; CIFAR
<!-- GENERATED_PAPER_INDEX_END -->

## Adding a Specialist Solver

Add a paper here when its reported results rely on a model trained for one problem, even if the same architecture is evaluated on several problems through separate training runs.

1. Create a paper note in this directory.
2. Add YAML Front Matter using the same schema as the existing paper notes.
3. Set `scope: specialist` and assign one of the three solver paradigms using the operational definitions above.
4. Follow the structure of an existing paper note and link to original sources.
5. Open a pull request; the paper index above is generated automatically from the Front Matter.
