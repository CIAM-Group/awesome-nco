---
id: practical-vrp-joint-learning
short_title: GCN-NPEC
title: 'Efficiently Solving the Practical Vehicle Routing Problem: A Novel Joint Learning Approach'
authors:
  - Lu Duan
  - Yang Zhan
  - Haoyuan Hu
  - Yu Gong
  - Jiangwen Wei
  - Xiaodong Zhang
  - Yinghui Xu
year: 2020
date: 2020-08-23
acceptance:
  date: "2020-05-15"
  source_url: "https://www.kdd.org/kdd2020/calls/view/kdd-2020-call-for-research-papers.html"
venue: KDD
paper_url: https://doi.org/10.1145/3394486.3403356
institutions:
  - Zhejiang Cainiao Supply Chain Management Co. Ltd
  - Alibaba Group
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Vehicle Routing Problem
  - Capacitated Vehicle Routing Problem
summary: GCN-NPEC encodes customer nodes and directed real-distance edges, constructs routes with a recurrent node decoder, and jointly trains an auxiliary edge classifier using routes sampled from the current policy.
---

# Efficiently Solving the Practical Vehicle Routing Problem: A Novel Joint Learning Approach

> **TL;DR:** A static node-edge graph convolutional encoder is followed by a dynamic GRU route decoder, while an auxiliary edge classifier learns from the sampled routes to improve the shared representation through joint reinforcement and supervised training.

## Motivation

Most earlier neural routing models represent travel cost using Euclidean distances derived from customer coordinates. This assumption may be inadequate in practical delivery systems because real travel distances are affected by road topology, one-way streets, traffic conditions, and other geographic factors. The distance from customer \(i\) to customer \(j\) may also differ from the distance from \(j\) to \(i\).

The paper therefore models a practical Vehicle Routing Problem as a directed graph containing both node and edge features. Customer coordinates and demands are represented as node features, while directed travel distances obtained from a geographic information system are represented explicitly as edge features.

Obtaining optimal labels for large practical VRP instances is expensive. The paper avoids requiring optimal routes by training the route-construction decoder with reinforcement learning. It additionally introduces an edge-classification task whose labels are generated from routes sampled by the current policy, combining reinforcement learning and supervised learning in a shared encoder.

## Contributions

- Introduces GCN-NPEC, a graph convolutional model that jointly represents customer nodes and directed travel edges.
- Incorporates real GIS travel distances rather than deriving all travel costs only from Euclidean coordinates.
- Uses a recurrent node sequential prediction decoder to construct capacity-feasible vehicle routes.
- Introduces an auxiliary edge classification decoder that predicts whether each directed edge appears in the generated solution.
- Converts routes sampled from the node decoder into binary edge matrices that supervise the edge classifier without requiring optimal solutions.
- Combines a REINFORCE route-construction loss and a supervised edge-classification loss in one training objective.
- Evaluates the method on problem sets constructed from historical delivery locations and on a real-order dataset with varying problem sizes.

## Methodology

1. **Directed graph formulation.** A VRP instance is represented by a directed graph \(G=(V,E)\). Node 0 is the depot and nodes 1 through \(n\) are customers. Every ordered pair of nodes has a directed edge because the practical distance from \(i\) to \(j\) may differ from the distance from \(j\) to \(i\).

2. **Route representation.** The output is a sequence containing customer indices and repeated occurrences of the depot. For example, the sequence \(\{0,4,5,1,0,2,3,0\}\) represents two vehicle routes: \(0\rightarrow4\rightarrow5\rightarrow1\rightarrow0\) and \(0\rightarrow2\rightarrow3\rightarrow0\).

3. **Node input features.** The depot is represented by its coordinates. Each customer is represented by its coordinates and demand. Separate linear transformations embed coordinates and demand before concatenating them into the initial customer feature.

4. **Edge input features.** Every directed edge contains its real GIS travel distance and a categorical adjacency tag. The tag is 1 for a \(k\)-nearest-neighbor edge, -1 for a self-connection, and 0 otherwise. The reported experiments use \(k=10\).

5. **Initial graph embeddings.** The node features and edge features are independently projected into hidden node and edge embeddings. The reported hidden dimension is 256.

6. **Node aggregation.** At each graph convolutional layer, a node attends to the embeddings of its graph neighbors using scaled dot-product attention. The attention-weighted neighborhood representation is passed through a learned transformation and nonlinear activation.

7. **Edge aggregation.** The representation of directed edge \((i,j)\) is updated from three inputs: its previous edge embedding, the previous embedding of source node \(i\), and the previous embedding of destination node \(j\).

8. **Combination.** For both nodes and edges, a transformed self representation is concatenated with the newly aggregated representation. The model also uses skip connections and layer normalization.

9. **Static encoder output.** After three graph convolutional layers, the encoder produces a node embedding for every depot or customer and an edge embedding for every directed node pair. These representations are computed once for the instance before autoregressive route construction.

10. **Sequential node decoder.** A two-layer GRU maintains a dynamic hidden state that summarizes the previously generated route. At every decoding step, the GRU state and each static node embedding are concatenated and passed through an additive pointer-attention function to produce a logit for every possible next node.

11. **Capacity and visitation mask.** Previously visited customers and customers whose demands exceed the remaining vehicle capacity are masked. The depot is masked at the first step and immediately after another depot visit, but it can be selected again after serving one or more customers. Selecting the depot resets the remaining vehicle capacity.

12. **Next-node distribution.** Softmax is applied to the unmasked pointer logits. During training, the next node is sampled from this distribution. During inference, the model uses greedy decoding or beam search.

13. **Edge classification decoder.** A shared multilayer perceptron maps each final directed-edge embedding to two probabilities: absent from or present in the generated vehicle routes. Collectively, these predictions form an \((n+1)\times(n+1)\times2\) edge-classification tensor.

14. **Policy-generated edge labels.** A sampled route from the sequential decoder is converted into a binary directed adjacency matrix. For the route \(\{0,4,5,1,0,2,3,0\}\), the positive edges are \(e_{04},e_{45},e_{51},e_{10},e_{02},e_{23},e_{30}\). This matrix serves as the label for the edge classifier.

15. **Reinforcement-learning loss.** The sequential decoder is trained with REINFORCE. The advantage is the sampled route cost minus the cost produced by a deterministic greedy rollout baseline. The baseline policy is held fixed during an epoch and replaced when the current policy shows a statistically significant improvement under a paired test.

16. **Supervised edge loss.** The edge classifier is trained with cross-entropy between its edge probabilities and the binary edge matrix generated from the sampled node route.

17. **Joint objective.** The final loss is a weighted sum of the reinforcement-learning route loss and the supervised edge-classification loss. The experiments use equal coefficients for both terms.

18. **Information flow.** The sampled node route directly supervises the edge classifier. The edge-classification loss updates the edge decoder and the shared graph encoder. The final sequential route decoder is therefore influenced indirectly through the shared encoder rather than by directly consuming the edge heatmap.

## Experiments

- **Problems:** Capacitated Vehicle Routing Problem with directed travel costs and repeated depot visits.
- **Data source:** Historical delivery locations and orders from a large Chinese business-to-business platform.
- **Distance source:** Directed travel distances obtained through the GaoDe Map API.
- **Synthetic-demand sets:** VRP20, VRP50, VRP100, VRP200, and VRP400.
- **Real-order set:** VRP-R, containing real orders with between 20 and 300 customers.
- **Baselines:** Google OR-Tools, PRL based on the Nazari et al. recurrent policy, and the Attention Model of Kool et al.
- **Ablation:** GCN-Node removes the auxiliary edge-classification decoder while retaining the GCN encoder and sequential node decoder.
- **Inference:** Greedy search, beam search selecting the highest-probability route, and beam search selecting the lowest-cost route among the completed beam candidates.
- **Metrics:** Average route cost, percentage gap relative to OR-Tools, inference behavior, learning curves, and cross-size performance.

### Datasets

The five fixed-size sets use historical customer and depot locations, while customer demands are sampled uniformly from \(\{1,\ldots,9\}\).

- VRP20: capacity 30, 50,000 training and 10,000 test instances
- VRP50: capacity 40, 50,000 training and 10,000 test instances
- VRP100: capacity 50, 50,000 training and 10,000 test instances
- VRP200: capacity 60, 25,600 training and 5,000 test instances
- VRP400: capacity 80, 25,600 training and 5,000 test instances

VRP-R contains real orders from September 2019. Orders from the first 15 days are used for training and those from the following 15 days are used for testing. It contains 30,000 training and 10,000 test instances with sizes ranging from 20 to 300 customers.

### Training Configuration

The reported GCN-based model uses:

- Three graph convolutional layers
- Node and edge hidden dimension 256
- A two-layer GRU with 256 hidden units
- A three-layer edge-classification MLP
- Adam with an initial learning rate of \(10^{-3}\)
- Learning-rate decay of 0.96 per epoch
- Gradient-norm clipping at 5
- 1,000 training epochs
- Batch size 256 for VRP20, VRP50, and VRP100
- Batch size 64 for VRP200 and VRP400 because of memory constraints

### Fixed-Size Results

When the lowest-cost route among beam candidates is selected, the reported average costs are:

| Method | VRP20 | VRP50 | VRP100 | VRP200 | VRP400 |
|---|---:|---:|---:|---:|---:|
| OR-Tools | 4.420 | 7.493 | 11.348 | 17.995 | 26.095 |
| PRL | 4.484 | 7.530 | 11.901 | 19.019 | 28.438 |
| Attention Model | 4.415 | 7.421 | 11.643 | 18.516 | 26.781 |
| GCN-Node | 4.399 | 7.312 | 11.259 | 17.660 | 26.093 |
| GCN-NPEC | 4.398 | 7.304 | 11.186 | 17.516 | 25.876 |

The GCN-based models provide larger gains over PRL and the Attention Model than the edge-classification auxiliary task provides over GCN-Node. Nevertheless, GCN-NPEC improves consistently over GCN-Node, and the difference becomes more visible on the larger problem sets.

On VRP400, GCN-NPEC obtains 25.876 compared with 26.093 for GCN-Node, an improvement of approximately 0.83%. It also obtains a reported cost approximately 0.84% below OR-Tools on this set.

The learning curves show that the GCN-based models converge faster than PRL and the Attention Model. GCN-NPEC also converges faster than the node-only GCN ablation.

### Real-Order Results

On VRP-R, the reported average costs are:

| Method | Average cost |
|---|---:|
| OR-Tools | 131.596 |
| PRL | 139.438 |
| Attention Model | 135.741 |
| GCN-Node | 130.634 |
| GCN-NPEC | 129.949 |

GCN-NPEC reports a cost approximately 1.25% lower than OR-Tools and approximately 4.27% lower than the Attention Model on this dataset.

The paper reports that the trained neural policy solves an instance in a few seconds, while its OR-Tools configuration requires several hours. Exact per-instance runtime measurements are not provided in the result tables.

## Limitations

### Reported by the Authors

- The authors do not compare against optimal solutions because Gurobi fails to converge to optimality within two hours even for some 20-customer instances.
- The main quality gaps are therefore calculated relative to OR-Tools rather than relative to known optimal solutions.
- Some routes appear visually unintuitive, including circular-looking paths. The paper attributes this partly to the complexity of real directed travel distances.
- The experiments focus on data derived from one delivery platform and one geographic delivery setting.
- The extension to pickup-and-delivery problems is discussed conceptually but is not evaluated experimentally.

### Curator Notes

- The interaction between the two decoders is asymmetric. The node decoder directly creates labels for the edge classifier, whereas the edge-classifier output is not directly inserted into the node decoder's logits.
- The final inference route is generated by the sequential node decoder. The paper does not report a separate set of solutions decoded directly from the edge-probability matrix.
- The edge auxiliary task helps the route policy indirectly through the shared graph encoder and the joint training objective.
- Because edge labels are generated by the current policy rather than by an optimal solver, the edge classifier learns to reproduce the current policy's routes. Errors in sampled routes can therefore become supervision for the auxiliary task.
- In the forward encoder equations, node aggregation uses node embeddings and does not explicitly consume the learned edge embeddings. Real edge features directly affect the edge branch, while their influence on route construction is primarily mediated through auxiliary training and shared parameters.
- The edge-classification branch predicts one label for every directed node pair, although only a small fraction of edges occur in a feasible solution. The paper does not describe class weighting or negative-edge sampling for this imbalance.
- Storing a 256-dimensional embedding for every directed node pair has quadratic memory cost. The reduced batch sizes for VRP200 and VRP400 reflect this scaling issue.
- The best beam-search result is selected by evaluating the true cost of every completed candidate, not by choosing the route with the highest neural probability. Reported quality therefore depends on both the learned policy and the inference budget.
- The paper does not state a single beam width and comparable wall-clock budget for all methods in the main result table.
- The evaluation does not include known optimal solutions, so outperforming OR-Tools does not establish proximity to optimality.
- The real-order experiment uses data from one month and one platform. Generalization to other cities, road networks, seasons, demand distributions, or delivery operators is not established.
- Several printed formulas contain notation inconsistencies. The customer condition in the node-input equation overlaps with the depot case, the pointer-mask equation changes candidate indices, and the capacity mask appears to exclude a demand exactly equal to the remaining capacity even though equality is feasible.
- The paper writes the supervised loss as a negative cross-entropy expression, although cross-entropy is conventionally already defined as a nonnegative loss. The intended implementation is standard minimization of cross-entropy.
- The paper describes a “mutual promotion” between the two decoders, but the architecture provides direct supervision only from the sequential decoder to the edge decoder. The reverse effect is indirect through the shared encoder.

## Reproducibility

- **Official implementation:** Not publicly available.
- **Checkpoints:** Not publicly available.
- **Training data:** Not publicly available. The datasets depend on proprietary historical orders and customer locations from the industrial partner.
- **Real-distance data:** Generated through the GaoDe Map API, but the exact queries, historical road conditions, and resulting distance matrices are not released.
- **Baseline configuration:** The paper identifies OR-Tools, PRL, and the Attention Model, but does not provide a complete runnable configuration for reproducing every comparison.
- **Model details:** Encoder depth, hidden dimensions, optimizer, learning-rate schedule, gradient clipping, epoch count, and batch sizes are reported.
- **Main paper references:** Section 3.1 defines the practical directed CVRP; Sections 3.2.1-3.2.3 describe the node-edge encoder and both decoders; Section 3.2.4 and Algorithm 1 describe joint training; Section 4 reports the datasets, baselines, hyperparameters, ablations, and results; Appendix A visualizes example routes.