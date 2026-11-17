---
id: learning-task-specific-city-region-partition
short_title: Task-Specific Region Partition
title: Learning Task-Specific City Region Partition
authors:
- Hongjian Wang
- Porter Jenkins
- Hua Wei
- Fei Wu
- Zhenhui Li
year: 2019
date: '2019-05-13'
publication:
  date: '2019-05-13'
  source_url: https://doi.org/10.1145/3308558.3313704
venue: WWW
paper_url: https://doi.org/10.1145/3308558.3313704
institutions:
- Twitter
- Pennsylvania State University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Partitioning
problems:
- Task-Specific Connected City Region Partitioning
summary: A neural immediate-reward scorer guides tract reassignment to improve task-dependent city partitions, with
  MCMC comparators; Chicago crime/house-price results use fixed 77-region temporal evaluations, while connectedness
  handling, training budgets and the hardness sketch have important limits.
figure:
  path: paper-assets/learning-task-specific-city-region-partition/framework.png
  alt: Community and tract ID embeddings encode a partition and a boundary-move action, then a flattened MLP estimates
    its value.
  caption: 'Original Figure 2: the neural action-value architecture.'
  source_url: https://faculty.ist.psu.edu/jessieli/Publications/2019-WWW-region-partition.pdf#page=4
---

# Learning Task-Specific City Region Partition

> **TL;DR:** Starting from Chicago's administrative regions, the method learns to score boundary-tract reassignment actions by their immediate effect on a downstream regression loss. A sampled-action search improves reported prediction MAE. Despite the DQN label, the actual discount is zero; the experiments do not establish long-horizon planning, a universal partitioner or an optimality guarantee.

## Motivation

Administrative boundaries may aggregate tracts with different relationships between demographics and a target such as crime count or house price. The paper jointly seeks connected regions and a regression model whose aggregated targets are predictable from aggregated features. Unlike clustering solely by geography or features, the objective depends on the downstream supervised task. [Formal pp. 1–2]

## Contributions

- Defines a fixed-count partition into non-overlapping, exhaustive and spatially connected communities, with squared prediction loss and a partition-property penalty.
- Studies uniform and error-biased Metropolis–Hastings proposals from an initial administrative partition.
- Learns an embedding/MLP action-value scorer for tract moves and evaluates two Chicago prediction targets.
- Provides a claimed hardness argument and empirical local-search comparisons; the argument's limitations are distinguished below. [Formal pp. 2–6]

## Methodology

A state assigns each tract to a community. An action moves a boundary tract into an adjacent community. The immediate reward is exp(−F(new))−exp(−F(old)), where F includes the refitted prediction loss and a partition penalty. The MCMC variants use a Boltzmann target, accepting proposals according to the corresponding proposal ratio; softmax proposals favor high-error communities. Precise connectivity-preserving move checks, nonempty-region handling and practical penalty settings are not fully specified. [Formal pp. 2–3]

The neural method embeds community IDs in two dimensions and tract IDs in four dimensions. It flattens the current assignment and proposed destination embeddings, concatenates the tract embedding, and applies 200- and 100-neuron fully connected layers followed by a sigmoid-related value output. This index-based representation is tied to a tract/community universe, rather than permutation-invariant graph processing. [Formal pp. 3–5, Figure 2]

The printed Q expression sums possible future action values, but the implemented experimental design explicitly sets discount δ=0. Thus selection depends on an immediate reward estimate. It samples 32 possible actions and picks the highest-scoring candidate. Random action sequences generate training examples; the text says the model is saved across rounds/tasks and updated when the selected action fails to improve reward. It does not document a fixed checkpoint evaluated without updates across crime and house-price tasks. The classification is **specialist / improvement**, because neural moves revise an existing partition rather than constructing one from scratch. [Formal pp. 3–5]

## Experiments

The data cover 801 Chicago census tracts, 2010 census demographics, over 700,000 crime incidents in 2010–2011, and over 44,000 house sales from January 2015 to December 2017. Both tasks use aggregated demographic features and a negative-binomial regression model with exponential conditional mean. Crime uses 2010 for training and 2011 for testing; housing is split at August 1, 2016. The evaluation additionally describes leave-one-out cross-validation across regions, without fully detailing its nesting with temporal partition/model selection. [Formal pp. 4–5]

All methods target 77 communities. Clustering baselines use features alone, target alone, or both. Agglomerative clustering includes an adjacency constraint; k-means and spectral clustering do not guarantee connected regions, so not every baseline satisfies the same feasible set. Stochastic methods are repeated ten times; deterministic agglomerative results have no reported standard deviation. MCMC uses approximately 1,500 iterations with early stopping. [Formal p. 5]

Table 1 reports crime MAE 602.93±91.65 for DQN versus 1,826.84 for administrative regions, approximately a 67% reduction. House-price MAE is 22.64±2.24 versus 31.29. These are prediction-error reductions after changing aggregation regions, not optimization gaps to known optimal partitions. Negative results matter: naive and softmax MCMC have house-price MAE 33.21 and 32.99, both worse than the administrative baseline. Softmax's small advantage over naive search is explicitly described as inconclusive as a general claim. [Formal pp. 5–6]

Stopping monitors the standard deviation of F over fifty iterations against an unspecified threshold. The convergence figure shows one house-price run: DQN stops before 300 iterations while the MCMC variants need over 400. Neural training overhead is acknowledged as higher; the article provides neither matched wall-clock budgets nor a total runtime comparison. A single trajectory does not establish a reliable speedup distribution or global convergence. [Formal p. 6]

## Limitations

The NP-hardness discussion on p. 2 is a **printed proof sketch**, not an independently verified reduction. It replaces the jointly fitted model with a fixed model and upper-bounds total loss by m times the largest regional loss. Feasibility of this stronger bound implies feasibility of the original objective, but that one-way implication alone does not transfer hardness. The proposed graph construction also uses partition-dependent regional losses as edge weights and asserts cut-edge count exceeds component count, which is not a general graph fact. These are curator observations about missing proof conditions; they do not establish that the original optimization problem is easy or negate the empirical search results.

No approximation ratio, globally optimal partition certificate, cross-city transfer or shared frozen multi-task policy is demonstrated. The fixed indexed inputs and repeated regression fitting restrict scalability. The partition penalty, optimizer, learning rate, training-example count, acceptance/update details, random seeds and hardware are not fully specified. Best reported MAE does not establish causal neighborhood effects or uniform improvements on every task.

## Reproducibility

All seven formal pages, complete 29-item bibliography, mathematical definitions, proof sketch, architecture and result figures/table were read. Pages 2/4/5/6 were rendered and visually inspected; the image is an original Figure 2 crop. The author publication page links this exact PDF, labels it a WWW 2019 short paper and lists no associated code or scientific appendix. Publisher PDF/HTML requests returned 403, while the author-hosted formal copy was accessible. The article does not name an unavailable independent proof supplement. Exact-title searches identified no same-paper arXiv or official implementation; no code link is invented.

Publisher-deposited metadata and Penn State's publication record agree on formal publication 2019-05-13. The formal byline lists Wang at Twitter (with a footnote that the work was done at Penn State), and Jenkins, Wei, Wu and Li at Penn State. No training, data reconstruction or numerical benchmark was rerun. The full bibliography contains no confirmed citation to another active catalogue paper; the general learning-to-optimize reference is retained as an external citation rather than matched to an unrelated neural combinatorial solver.
