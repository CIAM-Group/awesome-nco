---
id: efficient-graph-convnet-tsp
short_title: GCN
title: 'An Efficient Graph Convolutional Network Technique for the Travelling Salesman Problem'
authors:
  - Chaitanya K. Joshi
  - Thomas Laurent
  - Xavier Bresson
year: 2019
date: 2019-06-04
venue: arXiv
paper_url: https://arxiv.org/abs/1906.01227
arxiv_url: https://arxiv.org/abs/1906.01227
code_url: https://github.com/chaitjo/graph-convnet-tsp
institutions:
  - Nanyang Technological University
  - Loyola Marymount University
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
summary: A supervised edge-aware graph convolutional network predicts a probabilistic TSP edge heatmap that is converted into a valid tour using beam search.
figure:
  path: paper-assets/efficient-graph-convnet-tsp/framework.png
  alt: Graph ConvNet pipeline from an input graph through an edge heatmap and beam search to a TSP tour.
  caption: 'Figure 1: Graph ConvNet edge-heatmap prediction and beam-search tour construction pipeline.'
  source_url: https://arxiv.org/pdf/1906.01227
---

# An Efficient Graph Convolutional Network Technique for the Travelling Salesman Problem

> **TL;DR:** A deep edge-aware graph convolutional network predicts all TSP edge probabilities in parallel, after which beam search converts the predicted heatmap into a valid tour.

## Motivation

Most earlier neural approaches to the Traveling Salesman Problem construct a tour autoregressively, selecting one city at a time with a Pointer Network or an attention-based decoder. Although this formulation naturally maintains a valid partial tour, its sequential decoding process limits parallelization and becomes increasingly expensive when many candidate solutions are sampled.

The paper investigates a non-autoregressive alternative. Instead of predicting the next city at every decoding step, the model predicts the probability that each edge belongs to the final TSP tour. This produces a probabilistic adjacency matrix, or edge heatmap, in one neural-network forward pass. A separate beam-search procedure then converts this heatmap into a valid tour.

The approach also examines whether supervised learning from optimal Concorde solutions can provide better sample efficiency than reinforcement-learning methods that receive only the final tour length as a reward.

## Contributions

- Introduces a non-autoregressive TSP solver based on a deep graph convolutional network that jointly learns node and edge representations.
- Uses learned edge gates to control how strongly neighboring node representations contribute during graph convolution.
- Predicts a dense probabilistic heatmap over candidate TSP edges instead of selecting cities sequentially.
- Converts the predicted edge heatmap into a feasible TSP tour using greedy search, beam search, or beam search followed by shortest-tour selection.
- Trains the complete neural model with supervised edge labels obtained from optimal Concorde tours.
- Evaluates solution quality, inference time, sample efficiency, and generalization across TSP20, TSP50, and TSP100 instances.

## Methodology

1. **Problem representation.** Each TSP instance is represented as a graph whose nodes are two-dimensional city coordinates. The Euclidean distance between every pair of cities is used as an edge feature.

2. **Node initialization.** Each two-dimensional coordinate is linearly projected into an \(h\)-dimensional node embedding.

3. **Edge initialization.** Each edge representation concatenates two components: a learned projection of its Euclidean distance and a learned embedding of a categorical edge tag. The tag distinguishes ordinary edges, \(k\)-nearest-neighbor edges, and self-connections.

4. **Edge-aware graph convolution.** The model stacks multiple graph convolutional layers. At every layer, each node combines its previous representation with messages from neighboring nodes. A normalized sigmoid gate derived from the current edge embedding determines the contribution of each neighboring node.

5. **Edge update.** The representation of edge \((i,j)\) is updated from its previous edge representation and the current representations of its two endpoint nodes. Residual connections and batch normalization are used in both node and edge updates.

6. **Edge classification.** After the final graph convolutional layer, a shared multilayer perceptron maps every edge embedding to two class probabilities: whether the edge is absent from or present in the target TSP tour. Collecting the positive-class probabilities for all node pairs produces an \(n \times n\) edge heatmap.

7. **Supervised training.** An optimal Concorde tour is converted into a binary adjacency matrix. The network minimizes a class-weighted binary cross-entropy loss between the predicted edge classes and this ground-truth adjacency matrix. Class weighting compensates for the fact that only \(2n\) directed edge entries are positive among \(n^2\) possible entries.

8. **Tour decoding.** Directly taking the highest-probability edge for each node may produce disconnected cycles or incorrect node degrees. The paper therefore applies a separate constrained decoder:
   - Greedy search repeatedly selects the highest-probability feasible next edge.
   - Beam search maintains the \(b\) most probable partial tours.
   - Beam search with the shortest-tour heuristic selects the minimum-length tour among the \(b\) complete beam candidates rather than the candidate with the highest predicted probability.

9. **Main configuration.** The reported models use 30 graph convolutional layers, a hidden dimension of 300, a three-layer edge-classification MLP, \(k=20\) nearest-neighbor tags, and a beam width of 1,280.

## Experiments

- **Problem:** Symmetric two-dimensional Euclidean Traveling Salesman Problem.
- **Instance distributions:** City coordinates are sampled uniformly from the unit square.
- **Problem sizes:** TSP20, TSP50, and TSP100.
- **Training data:** One million optimally labeled instances for each problem size, with optimal tours generated by Concorde.
- **Validation and test data:** 10,000 validation instances and 10,000 test instances for each problem size.
- **Baselines:** Concorde, LKH3, Gurobi, insertion heuristics, nearest neighbor, Pointer Networks, structure2vec, graph attention models, OR-Tools, and other learned TSP solvers.
- **Metrics:** Average tour length, optimality gap relative to Concorde, evaluation time, sample efficiency, and cross-size generalization.
- **Decoding budget:** The main beam-search experiments use a beam width of 1,280 to match the 1,280 sampled solutions reported for the attention model of Kool et al.

### Main Results

With standard beam search, the proposed GCN reports optimality gaps of 0.10% on TSP20, 0.26% on TSP50, and 2.11% on TSP100. Under the comparable 1,280-candidate setting, it improves over the sampled attention model on TSP50 and TSP100, while the attention model is slightly better on TSP20.

When the shortest actual tour is selected from the 1,280 beam candidates, the reported gaps decrease to 0.01% on TSP20, 0.01% on TSP50, and 1.39% on TSP100. This improves solution quality but increases evaluation time because every complete beam candidate must be evaluated by its true tour length.

The supervised model is more sample-efficient than the compared reinforcement-learning approach on the studied fixed-size distributions because training provides the complete optimal edge structure rather than only a scalar tour-length reward.

However, the cross-size experiments show severe degradation. For example, the TSP50 model obtains a 0.26% gap on TSP50 but a 65.39% gap on TSP100. The paper therefore concludes that the learned non-autoregressive representations specialize strongly to the graph size used during training.

## Limitations

### Reported by the Authors

- The method remains less competitive than established Operations Research solvers such as Concorde, LKH3, and Gurobi.
- Models trained on one TSP size generalize poorly to different graph sizes. The authors state that the graph ConvNet appears to memorize size-specific patterns.
- Supervised learning requires optimal or high-quality target solutions. Generating a large labeled dataset becomes increasingly expensive as the problem size grows.
- The advantages of supervised learning diminish on large instances because producing one million optimal labels may become computationally intractable.
- The shortest-tour beam heuristic improves solution quality at the cost of additional evaluation time.
- Separate models are trained for TSP20, TSP50, and TSP100; the experiments do not demonstrate a single size-invariant solver.
- The paper identifies reinforcement learning and transfer learning as future directions for scaling beyond the trained instance sizes.

### Curator Notes

- The edge-classification loss supervises individual edge decisions but does not directly enforce global TSP constraints such as degree two at every node, graph connectivity, or the absence of subtours. Feasibility is supplied by the external search decoder.
- The neural network predicts edge scores independently of the partial tour. It therefore cannot dynamically revise the heatmap according to earlier decoding decisions in the way an autoregressive decoder can.
- The final quality depends substantially on the beam width and on whether the highest-probability or shortest-length beam candidate is selected. Results should therefore be compared only under similar inference budgets.
- Selecting the shortest beam candidate uses the true geometric objective after neural prediction. The resulting performance reflects the combined neural model and search heuristic rather than the edge classifier alone.
- Maintaining embeddings and predictions for all node pairs has quadratic memory and computation requirements with respect to the number of cities, which limits straightforward scaling to much larger dense instances.
- The main experiments use synthetic Euclidean instances sampled uniformly from the unit square. Performance on non-Euclidean, asymmetric, sparse, or real-world routing graphs is not established by the reported experiments.

## Reproducibility

- **Official implementation:** [chaitjo/graph-convnet-tsp](https://github.com/chaitjo/graph-convnet-tsp)
- **Repository status:** The official repository was archived in February 2024 and is read-only.
- **Datasets:** Concorde-labeled TSP10, TSP20, TSP30, TSP50, and TSP100 datasets are linked from the official repository.
- **Checkpoints:** Pretrained TSP20, TSP50, and TSP100 checkpoints are linked from the official repository.
- **Training and evaluation scripts:** The repository provides configuration files, model code, data-generation utilities, and a notebook supporting training, evaluation, and visualization.
- **Original software environment:** Ubuntu 16.04, Python 3.6.7, PyTorch 0.4.1, and CUDA 9.0.
- **Compatibility note:** Reproducing the original environment may require legacy dependencies or code modifications for current PyTorch releases.
- **Main paper references:** Sections 3-6 describe the data, model, training procedure, decoding methods, and main results. Appendix A reports dataset statistics, Appendix B expands the graph convolution equations, Appendix C studies architecture and beam-width choices, Appendix D discusses supervised versus reinforcement learning, and Appendix E provides qualitative solution visualizations.
