---
id: graph-pointer-network-hrl
short_title: GPN/HGPN
title: Combinatorial Optimization by Graph Pointer Networks and Hierarchical Reinforcement Learning
authors:
- Qiang Ma
- Suwen Ge
- Danyang He
- Darshan Thaker
- Iddo Drori
year: 2020
date: '2019-11-12'
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
summary: A constructive graph-pointer policy uses relative-coordinate context for size transfer; a separately trained lower policy supplies soft logits to an upper TSPTW policy, with feasibility and sampling-reporting limitations.
figure:
  path: paper-assets/graph-pointer-network-hrl/framework.png
  alt: Original two-layer HGPN diagram combines lower-policy pointer logits with upper-policy logits before choosing the next city.
  caption: 'Figure 3: lower-layer pointer scores act as a soft prior for the upper constructive policy.'
  source_url: https://arxiv.org/pdf/1911.04936v1#page=4
inclusion: reference
inclusion_reason: AAAI2020 Deep Learning on Graphs workshop poster/spotlight, outside the approved main-conference criteria.
publication:
  date: '2020'
  source_url: https://deep-learning-graphs.bitbucket.io/dlg-aaai20/
---
# Combinatorial Optimization by Graph Pointer Networks and Hierarchical Reinforcement Learning

> **TL;DR:** GPN extends a recurrent pointer policy with a context-embedding branch and uses current-city-relative coordinates for transfer to larger TSPs. HGPN first trains a feasibility-oriented lower policy, freezes it, and adds its pointer logits as a **soft prior** to an upper policy. Neither the hierarchy nor greedy decoding guarantees time-window feasibility. **This is an AAAI workshop reference, outside the qualifying main-conference list.**

## Motivation

Small-size pointer models can perform poorly when applied to much larger routing instances. Current-city-relative coordinates expose local geometry directly. For constrained routing, mixing objective and feasibility penalties in one training reward can be unstable; the hierarchy instead learns a constraint-oriented policy before an objective-oriented policy. The proposed hierarchy combines decisions during construction, rather than editing an already completed lower-policy tour. [Sections 1/3/4.](https://arxiv.org/pdf/1911.04936v1#page=1)

## Contributions

- A graph-pointer architecture combines an LSTM point/history branch with a context branch and an attention pointer decoder.
- Relative coordinate context and early stopping improve transfer from small synthetic TSPs to larger sizes in the tested setting.
- Layer-wise RL trains a lower constraint-oriented policy and an upper policy informed by its logits.
- Evaluates small TSP, size transfer, optional classical 2-opt refinement, synthetic TSPTW20 and a limited TSPLIB study. [Sections 4-6.](https://arxiv.org/pdf/1911.04936v1#page=4)

## Methodology

### GPN construction and relative context

The current city is embedded and processed by an LSTM. A separate branch embeds the candidate-city context through three 128-dimensional layers, and attention compares candidate representations with the recurrent query. Visited-node masking prevents repeats. Small TSP experiments use absolute point context; transfer experiments use **X-current_city**, recomputed as the current city changes. It is not a sparse candidate graph or a fixed relative encoding computed once per instance. [Equations 6-10/Figure 2.](https://arxiv.org/pdf/1911.04936v1#page=4)

The paper calls its context branch a graph embedding network. In the inspected official implementation, the named graph layers are node-wise linear/ReLU branches after flattening node features, with an initial LSTM processing the context. They do not explicitly sum neighbor messages in those branches. The larger-instance notebook enables relative coordinates and size normalization, whereas the small-instance file comments out the relative subtraction. Thus a literal modern message-passing GCN description, or a general permutation-invariance guarantee, would overstate the inspected implementation.

### Hierarchical policy and training

A two-layer HGPN combines upper and lower pointer scores through **softmax(u_upper + alpha*u_lower)**, with learned alpha. The lower network is trained first and its parameters are kept fixed while training the upper network. It supplies a soft action prior, rather than a hard feasibility mask or a proven feasible action set. Both networks participate in selecting each next city. [Algorithm 1/Section 4.2.](https://arxiv.org/pdf/1911.04936v1#page=3)

Vanilla TSP training uses REINFORCE with a central self-critic: an instance's greedy return plus a batch-centered sampled-minus-greedy correction. TSPTW instead uses the stated moving-average-style baseline and separately designed layer rewards. The lower policy focuses on violations; the upper policy combines elapsed-time cost and penalties. No optimal-route labels are needed for policy training, although 2-opt-generated witness routes are used to create feasible time-window datasets. [Equations 4-5/Section 5.3.](https://arxiv.org/pdf/1911.04936v1#page=6)

### Task and classification boundaries

Classification remains **specialist / constructive**. Separate models handle ordinary TSP and TSPTW. Hierarchical logits guide autoregressive construction; they do not perform learned incumbent edits. GPN+2opt adds an **external classical** local-search postprocessor, whose additional time and quality must be reported separately. Training with RL and learning a lower-level constraint policy do not certify optimality or constraint satisfaction for every test case.

## Experiments

### Training and size transfer

Table 1 defaults are **batch 512, 2,500 steps per epoch, Adam 1e-3 with .96 decay and 100 epochs**, with uniformly generated coordinates. On one Tesla P100, an epoch takes about seven minutes for TSP20 or 30 minutes for TSP50. For large-size transfer, GPN is deliberately early-stopped at **10 TSP50 epochs**, while PN/s2v-DQN/AM retain **100 epochs**. Test inference uses batch 50 on **1,000 cases per size**. These are different training schedules, and times in Tables 2-3 are for the **whole 1,000-case set**, not per instance. [Sections 5.1-5.2/6.1.](https://arxiv.org/pdf/1911.04936v1#page=5)

| Method | TSP500 mean length / total time | TSP1000 mean length / total time |
| --- | --- | --- |
| GPN | 19.605 / 111 s | 28.471 / 393 s |
| GPN + classical 2-opt | 18.358 / 974 s | 26.129 / 4,410 s |
| AM transferred from TSP50 | 24.789 / 14 s | 34.055 / 136 s |
| Farthest insertion | 18.288 / 160 s | 25.741 / 945 s |
| LKH | 16.542 / 23,070 s | 23.130 / 50,680 s |

GPN improves the transferred AM's tour length but is slower than that AM row. GPN+2opt remains worse than LKH and is dominated by farthest insertion at these two displayed sizes. At TSP1000, s2v-DQN is slightly shorter, **26.046**, than GPN+2opt, while taking 5,600 seconds. The paper's transfer claim concerns selected neural baselines, not a new exact or overall best TSP solver. On small TSP20/50, GPN beats Pointer Networks but loses to AM. [Figure 4/Table 2.](https://arxiv.org/pdf/1911.04936v1#page=6)

Training on TSP20/50/100 produces TSP1000 lengths **33.649/28.471/28.036**. Early-stopping ablation is non-monotone: TSP50 training at epochs 1/5/10/100 gives TSP1000 lengths **29.23/28.52/28.48/29.28**. These observations support the chosen training/transfer setting without a universal size-generalization guarantee. [Tables 3/6.](https://arxiv.org/pdf/1911.04936v1#page=7)

The TSPLIB experiment selects cases with fewer than 1,500 nodes. Table 5 reports **GPN+2opt gap 9.35 +/-3.45%, 200 seconds**, versus a Concorde row **.13 +/- .6%, 1,377 seconds**. The table does not enumerate the exact subset or explain the nonzero Concorde reference gap. Preserve the numbers as reported rather than claiming that every cited reference run was proven optimal. [Table 5.](https://arxiv.org/pdf/1911.04936v1#page=7)

### TSPTW data, budgets and outcomes

Time windows are generated around a 2-opt witness route on 20 uniform nodes, so the constructed datasets have a feasible witness. The lower layer trains for **one epoch**, the upper layer **19 epochs**. Evaluation uses **10,000 instances** and compares greedy decoding with **100 or 500 complete samples**. [Section 5.3.](https://arxiv.org/pdf/1911.04936v1#page=6)

| Reported method | Cost | Total time | Reported feasible cases |
| --- | --- | --- | --- |
| OR-Tools Savings | 4.045 | 121 s | 72.06% |
| Single GPN greedy | 4.209 | 1 s | 99.87% |
| HGPN greedy | 4.178 | 1 s | 99.88% |
| HGPN, 100 samples | 4.013 | 99 s | 100% |
| HGPN, 500 samples | 3.991 | 494 s | 100% |

The greedy hierarchy's feasibility gain over the single GPN is small, and both have failures. Sampled rows add substantial compute. The 100% figure is empirical on generated TSPTW20 data, not a theorem for arbitrary windows or larger instances. [Table 4.](https://arxiv.org/pdf/1911.04936v1#page=6)

### Formula and implementation qualifications

- **Penalty sign:** printed Equation 12 uses **max(l_i-c_i,0)** while describing lateness. The code instead tests **arrival>leave**; the printed sign is inconsistent with that description. The implementation adds a fixed ten-unit violation penalty, rather than the printed continuous lateness magnitude.
- **Objective definition:** Equation 11 writes a sum of visit/arrival times. The inspected greedy tester accumulates **travel plus waiting plus return travel**, a completion-time-style quantity. It should not be silently called a faithful implementation of the printed sum-of-arrivals objective.
- **Sampling aggregation:** `test_hier_sampling.py` independently takes the minimum cost and minimum penalty over sampled tours. The two minima **need not belong to the same tour**. Consequently the reported minimum cost together with 100% feasible coverage does not establish that the selected minimum-cost route was feasible; source code needs joint route/feasibility selection to reproduce a best-feasible-cost claim.
- **Baseline comparability:** inspected OR-Tools code fixes node zero as depot, shuffles the other nodes, and averages reported costs only over successful assignments. Neural data generation shuffles all nodes and the neural tester averages costs over all cases. The current OR-Tools script also uses a 1,000-second limit and a ten-case default, which are not the paper's 10,000-case protocol. These differences require care before treating Table 4 as a fully matched feasibility/cost benchmark.
- **Clipping/code paths:** the larger-instance notebook clips with 100, matching the transfer discussion, while the small-instance file clips with ten. Lower-policy logits are a soft addition, not a rule that blocks every late decision.

These are source-level discrepancies and reporting limits, not independently measured corrections to the published numeric rows.

## Limitations

### Reported by the Authors

- Ordinary GPN does not beat LKH/farthest insertion in the large-TSP comparisons; it is proposed as a useful initialization.
- Point-context transfer and longer small-instance training can generalize poorly; early stopping is important.
- Feasible generated TSPTW instances can still yield infeasible neural/heuristic outputs. [Sections 5-6.](https://arxiv.org/pdf/1911.04936v1#page=5)

### Curator Notes

- HGPN supplies a learned soft prior and uses engineered rewards; it does not solve general constraint satisfaction by construction.
- Large neural transfer comparisons use different training schedules and GPU batching; optional 2-opt is a separate quality/time budget.
- TSPTW reward, objective, sampling selection and baseline protocol discrepancies limit strong claims about matched feasible costs.
- Small-instance and transfer implementation branches differ, and the named graph layer should not be described as a verified general message-passing operator.
- Workshop publication does not meet the main-list top-conference criterion.

## Reproducibility

- **Full reading:** all **eight arXiv-v1 pages, 12 November 2019**, were reread, including all equations, figures, Tables 1-6 and references. There is no separate appendix in the manuscript.
- **Publication scope:** the [official AAAI2020 Deep Learning on Graphs workshop page](https://deep-learning-graphs.bitbucket.io/dlg-aaai20/) lists this exact title/authors as a poster spotlight, and the author README confirms the workshop venue. `inclusion: reference` is retained. The former 6 December 2019 acceptance date was a workshop-calendar inference; it is removed, with workshop publication recorded only at year precision.
- **Scientific materials:** the official 30-member repository tree, full README and workshop page were manually inspected. No scientific PDF/ZIP supplement was present or explicitly required by the article. The eight-page source covers the full scientific content used for the note.
- **Official code:** [qiang-ma/graph-pointer-network](https://github.com/qiang-ma/graph-pointer-network), explicitly cited in reference 17. Small/large GPN branches, hierarchy training, greedy/sampling testers and OR-Tools baseline were inspected for the identified claims. Current tree contents do not establish availability of every trained checkpoint promised in the paper.
- **Figure:** original Figure 3, PDF page 4, cropped directly from the source. Algorithms, reward formulae and all experimental tables/plots were visually checked.
- **Verification scope:** no training or benchmark reruns were performed; original numeric claims remain attributed to the source, with the above reproducibility qualifications.
