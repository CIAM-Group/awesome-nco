---
id: online-planner-selection-with-graph-neural-networks-and-adaptive-scheduling
short_title: GNN Planner Selection
title: Online Planner Selection with Graph Neural Networks and Adaptive Scheduling
authors:
- Tengfei Ma
- Patrick Ferber
- Siyu Huo
- Jie Chen
- Michael Katz
year: 2020
date: '2018-11-01'
publication:
  date: '2020-04-03'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/5949
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/5949
institutions:
- IBM Research
- MIT-IBM Watson AI Lab
- University of Basel
- Saarland University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
problems:
- Cost-Optimal Classical Planning
- Neural Planner Portfolio Selection
summary: Shared GCN/GG-NN models predict planner failures across heterogeneous PDDL domains and may switch planners
  at half the time budget; coverage gains are conditional on a filtered portfolio-solvable benchmark, and classical
  planners construct and certify the plans.
arxiv_url: https://arxiv.org/abs/1811.00210
code_url: https://github.com/matenure/GNN_planner
figure:
  path: paper-assets/online-planner-selection-with-graph-neural-networks-and-adaptive-scheduling/framework.png
  alt: A blocksworld start/goal task and its grounded and lifted structural graph representations.
  caption: 'Original Figure 1: planning-task graph representations used for neural portfolio selection.'
  source_url: https://ai.dmi.unibas.ch/papers/ma-et-al-aaai2020.pdf#page=2
---

# Online Planner Selection with Graph Neural Networks and Adaptive Scheduling

> **TL;DR:** A graph network predicts which of seventeen cost-optimal planners is likely to finish a task within a deadline. A conditional second-stage model may switch planners after half the budget. The neural models select classical search procedures across different PDDL domains; they do not construct plans directly. Coverage improves over one learned selection, but a three-planner greedy portfolio and FDSS achieve higher coverage in the reported fixed split.

## Motivation

Different planning algorithms perform well on different domains, and trying every planner is expensive. Earlier neural portfolio selection converts a task graph into an image, losing node labels and sensitivity to node permutations. This paper learns graph representations directly and uses the observation that a successful planner often finishes early to reconsider the choice at halftime. [Accepted pp. 1–2]

## Contributions

- Uses grounded problem-description graphs and lifted abstract-structure graphs, including node-type labels, for planner selection.
- Compares graph convolutional and gated graph neural networks with attention-weighted graph readout.
- Learns a separate conditional failure predictor for a two-stage planner schedule.
- Evaluates fixed and repeated training/validation splits, selector overhead, and stronger fixed/offline portfolio alternatives. [Accepted pp. 3–7]

## Methodology

Grounded graphs represent facts, variables, actions, effects and axioms; lifted graphs represent PDDL abstract structures and their inclusion relationships. They summarize task structure, rather than enumerating the potentially enormous state-transition graph. Initial node features encode types. GCN propagates through normalized adjacency layers, whereas GG-NN uses recurrent GRU updates with separate incoming/outgoing message transformations. Sigmoid node gates weight a summed readout. A planner-specific gate variant is also considered. [Accepted pp. 2–4]

The first predictor f has seventeen independent sigmoid failure outputs, trained by binary cross-entropy. The chosen planner minimizes predicted failure within T=1,800 seconds; this objective need not select the fastest planner. If planner p has not finished by T/2, a second predictor g takes the graph representation and p's one-hot identity. Its labels distinguish continuing p for the full total budget T from starting another planner with only T/2 remaining. The scheduler continues p if it remains the preferred choice, otherwise stops it and starts the selected alternative. [Accepted pp. 3–5]

The neural model determines portfolio selection and time allocation. Classical cost-optimal planners search for and certify plans. The background A* guarantee requires admissible heuristics and the usual valid search conditions; it is not a guarantee that neural selection solves every task before timeout. This is **constructive portfolio guidance**, not an incumbent-edit method. [Accepted pp. 2, 4–5]

Common trained models operate across heterogeneous PDDL domains rather than separate networks for every domain. The official released test list includes ten domains, such as agricola, nurikabe, organic-synthesis, snake and termes; historical training includes blocks, logistics, transport and multiple puzzle domains. The entry is **generalist / constructive**, narrowly meaning shared neural portfolio control across different native planning domains, with a fixed seventeen-planner portfolio. The grounded/lifted architectures and repeated splits still train separate experimental models. [Accepted p. 5; dataset companion p. 3; official problem-name lists]

## Experiments

Historical IPC tasks form 2,294 training/validation examples; 145 IPC 2018 tasks form the fixed test set. **Tasks that none of the seventeen planners solves within 1,800 seconds are removed**, including from test. Reported coverage is conditional on that selected subset, not coverage over the complete IPC 2018 competition. The released split has 2,008 training and 286 validation examples. Additional experiments construct ten domain-preserving and ten random approximately 9:1 training/validation splits while retaining the same test set. [Accepted p. 5; dataset README/poster]

Adam uses learning rate 0.001; GCN layers/GG-NN steps are chosen from 2/4/6 and representation widths from 100/150/200. Shared versus planner-specific attention gates are explored. One model/split is reported to take about ten minutes using eight CPU cores and one GPU with approximately 5–10 GB memory. This excludes generating every planner's runtime labels. No hardware model or fully specified complete search/training budget is provided by the article. [Accepted p. 5]

In the fixed split, lifted GCN solves 87.6% versus lifted CNN 86.9%, with average selection overhead 9.41 versus 3.16 seconds, including graph construction and network evaluation. Grounded GCN reaches 80.7% with 23.15 seconds overhead. GG-NN is weaker: lifted 81.4%. These overheads are reported separately from the 1,800-second planning limit and are not presented as a complete measured deployment latency. [Accepted p. 6, Table 2]

Adaptive lifted GCN increases fixed-split coverage from 87.6% to 89.7%; its two fixed top-ranked planners reach only 65.5%. Across the ten domain-preserving/random splits, adaptive GCN obtains 91.1±3.8% / 92.1±3.2%, versus single GCN 85.6±5.5% / 87.2±3.5%. These standard deviations describe alternative training/validation splits evaluated on the same test tasks. [Accepted pp. 6–7, Table 3 and Figure 4]

The stronger offline comparisons matter: selecting three equal-budget planners greedily from training/validation gives **92.4%**, as does four-planner Fast Downward Stone Soup, both above adaptive GCN's 89.7%. Test-selected greedy oracle values are upper-reference results and are not deployable learned baselines. Thus adaptive conditioning improves on the particular single/two-choice predictors, without dominating all portfolio approaches. [Accepted p. 7, Table 4]

## Limitations

Filtered test membership changes the denominator of coverage. The seventeen-planner portfolio, fixed deadline and historical benchmark domains constrain transfer. Prediction errors can waste half the budget, switching discards the first planner's search, and no learned calibration or optimal scheduling guarantee is established.

Very large graphs and highly skewed sizes challenge neural memory/batching. Graphs are engineered structural representations even though node embeddings are learned. The companion dataset paper reports graph statistics that differ from the AAAI article—for example maximum grounded size 87,140 versus 47,554—so those version-specific statistics are not silently combined.

The released problem-name files contain `briefcaseworld` and `grid` in both training and validation, despite the dataset README's generic domain-preserving description. This curator inventory observation concerns the public default split; it does not establish overlap in the paper's separately generated domain-preserving splits. Its test domain names are disjoint from the released training/validation names.

## Reproducibility

All eight pages of the University of Basel author-hosted accepted article and all nine pages of identified arXiv v4 were read. The explicitly linked scientific dataset companion was also read completely, including its six pages of graph definitions, references and integrated statistics appendix, together with the eighteen-page author slide deck and one-page dataset poster: **23 article/companion pages plus 19 slide/poster pages**. Core graph constructions, GNN equations, conditional labels, four outcome tables, all scientific companion figures and image-only slide results were visually checked. The workshop companion is supporting scientific material, not a separate top-conference catalogue addition.

Primary arXiv history gives v1=2018-11-01 and v4=2019-11-20. Formal AAAI publication is 2020-04-03 from publisher-deposited metadata, distinct from the February event and an institutional blog's preprint date. The accepted five-author byline and its IBM Research, MIT-IBM Watson AI Lab, Basel and Saarland affiliations are retained. Publisher direct requests and OpenReview API returned access errors; the institution identifies the accessible accepted article, and no independent missing scientific supplement is named.

The official implementation commit `f06f649024c1ea2295d38633576a6ae2e5adf8e0` is dated 2020-09-28. Its 58-member/54-file archive has no separate scientific PDF, TeX, video, notebook or archive. README, conditional training-pair labels, sigmoid cross-entropy, gated readout and the continuation/switch evaluation boundary were inspected. The source uses TensorFlow and offline recorded planner runtimes for these evaluations; it is not independently verified as a complete deployed planner-launching service. The dataset repository commit `faf211224712d5c1535d2ccf97be7b6d08ab7147` has eleven files; its full tree, README and all problem-name lists were inventoried without downloading the large graph arrays. Timeout targets use sentinel 10,000 rather than measured completion times. Models were not trained or loaded, and historical planner runs were not reproduced.
