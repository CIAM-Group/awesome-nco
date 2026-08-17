---
id: graph-pointer-network-hrl
short_title: GPN/HGPN
title: 'Combinatorial Optimization by Graph Pointer Networks and Hierarchical Reinforcement Learning'
authors:
  - Qiang Ma
  - Suwen Ge
  - Danyang He
  - Darshan Thaker
  - Iddo Drori
year: 2020
date: 2019-11-12
acceptance:
  date: "2019-12-06"
  source_url: "https://deep-learning-graphs.bitbucket.io/dlg-aaai20/"
venue: 'AAAI Workshop on Deep Learning on Graphs: Methodologies and Applications'
paper_url: https://arxiv.org/abs/1911.04936
arxiv_url: https://arxiv.org/abs/1911.04936
code_url: https://github.com/qiang-ma/graph-pointer-network
institutions:
  - Columbia University
  - Cornell University
scope: specialist
paradigm: constructive
problem_families:
  - Routing
problems:
  - Traveling Salesman Problem
  - Traveling Salesman Problem with Time Windows
summary: Graph Pointer Networks combine dynamic relative-coordinate embeddings with an autoregressive pointer decoder, while a hierarchical reinforcement learning extension separates constraint satisfaction from objective optimization.
figure:
  path: paper-assets/graph-pointer-network-hrl/framework.png
  alt: Two-layer hierarchical Graph Pointer Network with graph context, LSTM encoders, and combined pointer vectors.
  caption: 'Figure 3: Two-layer hierarchical architecture of the Graph Pointer Network.'
  source_url: https://arxiv.org/pdf/1911.04936
---

# Combinatorial Optimization by Graph Pointer Networks and Hierarchical Reinforcement Learning

> **TL;DR:** GPN dynamically encodes the positions of candidate cities relative to the current city and selects the next city with a pointer decoder, while HGPN uses a lower policy to guide feasibility and a higher policy to optimize constrained tours.

## Motivation

Pointer Networks formulate the Traveling Salesman Problem as an autoregressive decision process and select the next city from the input set. However, the original Pointer Network primarily encodes cities as a sequence and does not explicitly model the relational structure among the candidate cities.

Graph neural networks offer a natural way to represent relationships between entities in a combinatorial optimization problem. The paper therefore extends the Pointer Network with a graph-based context encoder, producing the Graph Pointer Network. It also introduces a relative-coordinate representation intended to improve transfer from small training instances to much larger TSP instances.

For constrained problems such as the Traveling Salesman Problem with Time Windows, directly combining route length and constraint violations in a single penalty-based reward may result in unstable training and requires careful tuning of penalty coefficients. The paper proposes a hierarchical reinforcement learning framework that separates constraint satisfaction from objective optimization across different policy layers.

## Contributions

- Introduces the Graph Pointer Network, which combines a graph-based context encoder with an autoregressive pointer decoder.
- Proposes vector context, representing every candidate city relative to the currently visited city rather than using only absolute coordinates.
- Uses early stopping to reduce specialization to the training size and improve transfer from TSP50 or TSP100 to substantially larger instances.
- Introduces a hierarchical Graph Pointer Network for constrained combinatorial optimization.
- Trains the hierarchy from the bottom up, assigning different objectives to lower and higher policies.
- Uses the lower policy's pointer logits as latent information that biases the decisions of the higher policy.
- Evaluates the method on synthetic Euclidean TSP, large-scale cross-size TSP, TSP with Time Windows, and selected TSPLIB instances.

## Methodology

1. **Sequential decision formulation.** A state contains the cities visited so far, and an action selects the next unvisited city. The policy generates a complete permutation autoregressively. The negative tour cost is used as the reinforcement-learning signal for the unconstrained TSP.

2. **Point encoder.** At each decoding step, the coordinate of the current city is linearly embedded and passed through an LSTM. The LSTM hidden state represents the current city together with information accumulated from the previously visited sequence.

3. **Dynamic vector context.** Suppose the current city is \(x_i\). The model subtracts \(x_i\) from every candidate coordinate in the instance. Each row of the resulting matrix is therefore a vector pointing from the current city to one candidate city. This context is translation-invariant and is recomputed after every selected city.

4. **Graph context encoder.** The vector-context matrix is processed by three graph embedding layers with a hidden dimension of 128. Each layer combines a transformed residual branch with a nonlinear aggregation branch controlled by a trainable coefficient.

5. **Pointer decoder.** The LSTM hidden state acts as the query, while the encoded candidate contexts act as references. A Bahdanau-style additive attention mechanism produces one logit for every candidate city.

6. **Feasibility mask.** Logits corresponding to previously visited cities are set to negative infinity. Applying softmax to the remaining logits produces a probability distribution over feasible next cities.

7. **Route generation.** During training, the next city is sampled from the policy to support exploration. During inference, the route can be generated greedily or by repeatedly sampling complete tours and retaining the best result.

8. **Policy-gradient training.** GPN is trained with REINFORCE. The paper presents a central self-critic baseline that combines the reward of a greedy rollout for the current instance with the average sampled-versus-greedy reward difference across the batch.

9. **Hierarchical policy structure.** In a two-layer HGPN, the lower and higher layers are separate GPN policies. At every decision step, the lower policy produces a pointer-logit vector. This vector serves as the latent variable supplied to the higher layer.

10. **Logit-level fusion.** The higher policy computes its own pointer logits and adds a trainable multiple of the lower policy's logits. Softmax is applied to the combined logits, and the resulting higher-level distribution selects the next city. The final route is therefore generated by the higher policy, while the lower policy acts as a learned prior.

11. **Layer-wise optimization.** Policies are trained from the bottom up. The lower layer is trained first and then frozen. When training the higher layer, the frozen lower policy produces latent logits at each state, while gradients update only the higher policy.

12. **TSPTW decomposition.** For the Traveling Salesman Problem with Time Windows, the lower policy is trained to reduce time-window violations. The higher policy is trained to reduce the route-time objective while retaining the feasibility guidance supplied by the lower policy.

13. **TSPTW training schedule.** In the reported experiment, the lower layer is trained for one epoch, after which the higher layer is trained for 19 epochs using the fixed lower-level policy.

## Experiments

- **Problems:** Symmetric two-dimensional Euclidean TSP and Traveling Salesman Problem with Time Windows.
- **Synthetic distribution:** Coordinates are generated uniformly from the two-dimensional unit square.
- **Small-scale training:** TSP20 and TSP50, with training instances generated on the fly.
- **Large-scale transfer:** Models trained on TSP20, TSP50, or TSP100 are evaluated on TSP250, TSP500, TSP750, and TSP1000.
- **Constrained setting:** Two-layer HGPN evaluated on synthetic TSPTW20 instances.
- **Real-world benchmark:** Selected TSPLIB instances with fewer than 1,500 nodes.
- **Baselines:** Pointer Network, Attention Model, structure2vec DQN, nearest neighbor, random insertion, farthest insertion, Christofides, 2-opt, OR-Tools, LKH, Concorde, and Ant Colony Optimization.
- **Metrics:** Tour length, optimality gap, runtime, TSPTW objective cost, and percentage of feasible TSPTW solutions.
- **Default hyperparameters:** Three graph embedding layers, hidden dimension 128, batch size 512, Adam optimizer, learning rate \(10^{-3}\), and 2,500 training steps per epoch.

### Small-Scale TSP

On TSP20 and TSP50, GPN produces better solutions than the original Pointer Network, supporting the value of the additional context encoder. However, it remains worse than the Attention Model on these small fixed-size instances.

### Large-Scale Generalization

A GPN trained on TSP50 for 10 epochs is evaluated on TSP250, TSP500, TSP750, and TSP1000. It generalizes better than the compared Pointer Network and Attention Model when all are trained on TSP50.

For TSP1000, the reported average tour lengths are:

- Pointer Network: 32.714
- Attention Model: 34.055
- GPN: 28.471
- GPN with 2-opt: 26.129
- Farthest insertion: 25.741
- LKH: 23.130
- Concorde: 23.110

These results show that GPN transfers better than the compared neural autoregressive baselines, but it does not outperform strong classical solvers. The paper presents GPN as a possible learned initialization for local search: GPN with 2-opt obtains quality similar to structure2vec DQN and standalone 2-opt while reducing the reported runtime.

Training on larger instances improves transfer. On TSP1000, the reported tour length improves from 33.649 for a model trained on TSP20 to 28.471 for TSP50 training and 28.036 for TSP100 training.

### TSP with Time Windows

The TSPTW20 experiment compares OR-Tools, Ant Colony Optimization, a single-layer GPN, and the two-layer HGPN.

The reported results are:

- OR-Tools: cost 4.045, feasibility 72.06%
- Ant Colony Optimization: cost 4.655, feasibility 62.10%
- GPN greedy: cost 4.209, feasibility 99.87%
- HGPN greedy: cost 4.178, feasibility 99.88%
- HGPN with 100 samples: cost 4.013, feasibility 100%
- HGPN with 500 samples: cost 3.991, feasibility 100%

The greedy HGPN provides a small improvement over the single-layer GPN. The larger improvement is obtained by sampling multiple complete tours and selecting the best candidate, which increases inference time from approximately one second for greedy decoding to 99 seconds for 100 samples and 494 seconds for 500 samples.

### TSPLIB

On the selected TSPLIB instances, GPN with 2-opt reports an average optimality gap of \(9.35 \pm 3.45\%\) and a runtime of 200 seconds. The reported Concorde comparison has a gap of \(0.13 \pm 0.6\%\) and a runtime of 1,377 seconds. The learned method is faster in this comparison but produces substantially longer tours.

## Limitations

### Reported by the Authors

- GPN improves over the original Pointer Network on small instances but remains worse than the Attention Model in the TSP20 and TSP50 experiments.
- GPN does not outperform strong TSP solvers such as LKH or farthest insertion in the large-scale experiments.
- The method is presented partly as an initialization for local search rather than a replacement for established TSP solvers.
- Cross-size generalization depends strongly on early stopping. Training the TSP50 model for 100 epochs produces worse TSP500 and TSP1000 results than stopping after approximately 10 epochs.
- Models trained on larger instances generally transfer better, so generalization is not independent of the training scale.
- The real-world TSPLIB experiment shows a substantial solution-quality gap relative to Concorde.
- The hierarchical experiment is demonstrated only on a two-layer architecture for synthetic TSPTW20.

### Curator Notes

- The generic graph embedding equation describes aggregation over neighboring nodes, but the released implementation flattens candidate representations and applies shared linear and ReLU transformations independently to each candidate. It does not contain an explicit sum or attention operation across different candidate nodes in the graph encoder.
- Consequently, the main relational signal in the released implementation comes from the dynamic relative vector \(x_j-x_i\), rather than from conventional message passing between different candidate cities.
- The vector context must be recomputed and re-encoded after every selected city. GPN is therefore fully autoregressive and dynamic, unlike a static graph encoder that is evaluated only once per instance.
- The lower HGPN does not directly choose the final route. Its pointer logits are added to the higher policy's logits as a prior, and the actions sampled by the higher policy determine the state transitions.
- HGPN performs layer-wise training rather than joint end-to-end optimization. Once the lower layer is trained, it is fixed while the higher layer learns, so errors or biases in the lower policy may be inherited by the higher policy.
- The proposed hierarchy is a hierarchy of reward objectives and logit priors rather than temporal abstraction: the lower layer does not generate macro-actions that persist across several higher-level time steps.
- The paper presents a central self-critic baseline in the general policy-gradient section, but the TSPTW experiment explicitly states that an exponential-moving-average critic baseline is used. These should not be treated as the same experimental setting.
- The printed TSPTW violation formula uses \(\max(l_i-c_i,0)\), although the accompanying text defines a violation as arriving after the leaving time. The intended penalty should increase when \(c_i>l_i\), and the released code checks this condition directly.
- The masking condition in the printed pointer-attention equation has ambiguous indices. The released implementation uses a standard visited-city mask.
- The TSPTW data are constructed around a route obtained with 2-opt so that every generated instance has at least one feasible solution. This may represent a narrower feasibility distribution than unconstrained real-world TSPTW data.
- Runtime comparisons combine different hardware utilization, search limits, sampling budgets, and local-search procedures. Solution quality should therefore be interpreted together with the reported inference budget.
- The improvement of greedy HGPN over greedy GPN on TSPTW20 is small; much of the best reported result comes from evaluating 100 or 500 sampled tours.

## Reproducibility

- **Official implementation:** [qiang-ma/graph-pointer-network](https://github.com/qiang-ma/graph-pointer-network)
- **Dependencies:** The repository specifies Python 3.6 or newer and PyTorch 1.1.
- **Training code:** Separate scripts are provided for small-scale TSP, large-scale transfer, lower-level TSPTW training, higher-level TSPTW training, and non-hierarchical TSPTW training.
- **Evaluation code:** Greedy and sampling-based evaluation scripts are provided for TSP and TSPTW.
- **Baselines:** The repository includes implementations or wrappers for nearest neighbor, 2-opt, farthest insertion, LKH, OR-Tools, and Ant Colony Optimization.
- **Checkpoints:** The current repository snapshot does not contain tracked pretrained checkpoint files, although the paper and repository description refer to models.
- **Datasets:** Training instances can be generated by the provided scripts, but the current repository snapshot does not include a packaged benchmark dataset.
- **Documentation:** The repository provides basic commands but does not include a complete environment lock file, automated tests, or a step-by-step reproduction of every reported table.
- **Main paper references:** Sections 3 and 4 describe hierarchical reinforcement learning and GPN/HGPN; Section 5 reports the synthetic TSP, cross-size, TSPTW, and TSPLIB experiments; Section 6 discusses vector context, early stopping, clipping, and hierarchical training.
