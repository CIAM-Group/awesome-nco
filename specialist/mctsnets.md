---
id: mctsnets
short_title: MCTSnets
title: Learning to search with MCTSnets
authors:
- Arthur Guez
- Theophane Weber
- Ioannis Antonoglou
- Karen Simonyan
- Oriol Vinyals
- Daan Wierstra
- Remi Munos
- David Silver
year: 2018
date: '2018-07-03'
publication:
  date: '2018-07-03'
  source_url: https://proceedings.mlr.press/v80/guez18a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v80/guez18a.html
institutions:
- DeepMind
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Sokoban
summary: A supervised Sokoban planner learns vector-valued tree memories, backups
  and simulation choices inside a simulator-based search computation graph.
---

# Learning to search with MCTSnets

> **TL;DR:** MCTSnet places a tree-search computation inside a neural architecture. Learned vector memories, backup operations, simulation choices and root readout replace hand-designed MCTS statistics. The demonstrated agent learns from search-generated action labels for small Sokoban problems and still requires the true transition/reward simulator at deployment.

## Motivation

Ordinary MCTS combines a simulation policy, leaf evaluator and fixed backup rule. Learning only a value network leaves its training partly disconnected from how search uses that value. MCTSnet makes these internal computations trainable together, targeting useful decisions under small simulation budgets (Sections 1-3).

## Contributions

The main contribution is a dynamic search-network architecture with a vector memory at each tree node. An embedding network initializes new leaves, a gated residual backup updates memories along the visited path, a learned simulation policy chooses which path to explore, and a readout converts the final root memory to an action distribution. Unvisited memories persist between simulations. The computation depends on visitation order, not only the final tree.

The paper also proposes credit assignment based on intermediate improvements in prediction loss. An undiscounted loss-difference reward telescopes to the final objective; discounting emphasizes nearer improvements while trading bias against variance. These design choices are evaluated on one Sokoban domain, not on a shared multi-problem checkpoint.

## Methodology

Search uses a known deterministic transition model and reward model. Each simulation follows learned choices until an unexpanded leaf, embeds that state and propagates child, parent, action and reward information upward. The backup has a learned gate around a residual update. Simulation logits can combine a small pretrained policy prior with learned parent/child-memory information (Algorithms 1-2; Equations 1-7).

The actual experiments use supervised action prediction. An expensive MCTS teacher with roughly 2,000 simulations per real action supplies trajectories. The loss is expected action cross entropy over stochastic internal search choices. Gradients through a fixed expanded computation graph train embedding, backup and readout networks; discrete traversal choices require score-function estimation rather than ordinary differentiation through action sampling. The text's potential extension to reinforcement learning is future work, not the demonstrated training protocol.

The supplement describes a three-residual-block convolutional embedder with 128-dimensional node memory, an MLP readout, a smaller policy-prior network, and TensorFlow control-flow implementation. Training uses 32 asynchronous workers, batch size one and SGD at learning rate 0.0005. Subtree reuse across real actions is described as a possible recurrent use of the architecture; it should not be silently assumed for every reported run.

## Experiments

The domain is 10-by-10 Sokoban with four boxes/targets and symbolic wall/agent/box/target feature planes. The dataset has 250,000 trajectories from distinct levels and a 2,500-trajectory test set. The teacher solves approximately 92% of its generated levels; solved trajectories average 60 steps and unsolved trajectories stop at 100. These are teacher-data properties, distinct from the learned agent's success rate (Supplement A.1).

With 25 simulations per action, the reported MCTSnet solves 84 +/- 1% of levels. Value-network UCT solves approximately 30% at the same simulation count and needs around 20 times as many simulations to approach that performance. A stronger prior-and-value PUCT-like baseline reaches approximately 65% at 25 simulations. The 20-times claim is relative to that UCT configuration and simulation counts, not a uniform wall-clock advantage over every MCTS baseline (Figure 2; Section 4.1).

Copy-model controls replace the simulator by unchanged states and zero rewards while matching parameters, and in one case computation count; their lower performance supports the value of genuine simulated information. Gated residual backups outperform the tested MLP backup and are more stable as simulations increase. Learned modulated simulation policies outperform uniform traversal, and discounted credit assignment improves the displayed learning curves. Figure 5 varies simulation counts during both training and evaluation; it is not a demonstration that a single fixed trained checkpoint improves arbitrarily with additional test-time search. The cited 87% I2A result uses a different RL/data regime and is not a matched training comparison.

## Limitations

The evidence covers small Sokoban searches with symbolic observations and a true simulator. Optimal solution length, arbitrary-domain transfer and global search convergence are not established for learned MCTSnet. The teacher-label generation cost is substantial. Internal discrete decisions create difficult high-variance credit assignment, and discounting changes the training gradient. More simulations and memory increase computation. The meaning of the reported +/-1 uncertainty is not specified in the text, so it should not be labeled a confidence interval or standard deviation without additional evidence.

### Curator Notes

The printed gradient signs need attention. Equation 9 correctly writes the loss score term as minus score times log-likelihood. Section 3.6 then defines the surrogate reward as negative loss change, so its return R is a negative loss. Equations 10/13 print a positive score-times-R term as part of a loss gradient, which has the opposite sign under those definitions. For a one-step Bernoulli internal action with loss equal to that action, at probability 1/2 the true logit loss derivative is +1/4, whereas the printed positive score-times-negative-loss expectation is -1/4. This is a local inconsistency in the displayed loss-gradient derivation; it does not identify what sign was used in the unpublished implementation or invalidate the reported architecture experiments.

## Reproducibility

- [ICML 2018 proceedings](https://proceedings.mlr.press/v80/guez18a.html), PMLR 80:1822-1831: all ten main-paper pages and all references were read. Official HTML supports the retained July 3 publication date and eight-author DeepMind attribution.
- The separately linked [two-page scientific supplement](https://proceedings.mlr.press/v80/guez18a/guez18a-supp.pdf) was read completely, including dataset generation, network/training details and Figures 6-8. Four main derivation/result pages and both supplement pages were visually checked. Both OpenReview API versions queried by exact title returned 403; the publisher's scientific supplement is available and complete.
- The paper's qualitative demonstration-video shortlink redirects to a Google Drive sign-in page, as does a public download request for the resolved file. The video was not obtained or viewed and is not counted as a read supplement. All quantitative results and scientific architecture/training details used here come from the fully read main paper and formal supplement.
- No author implementation was verified from the publisher, full text or official DeepMind publication listing. Search surfaced a third-party PyTorch reimplementation, which is not substituted for the authors' TensorFlow implementation. No training or Sokoban evaluation was rerun. The complete reference scan found no exact existing-catalogue paper citations, so no similarity-based relation is added.
