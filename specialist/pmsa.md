---
id: pmsa
short_title: PMSA
title: Preference-Modulated Structural Attention for Multi-Objective Combinatorial Optimization
authors:
- Rongsheng Jia
- Jun Zhang
- Yifan Zhang
- Jian Cheng
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/jia26l.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/jia26l.html
institutions:
- School of Mathematics and Statistics, Nanjing University of Science and Technology
- C2DL, Institute of Automation, Chinese Academy of Sciences
- School of Artificial Intelligence, University of Chinese Academy of Sciences
- University of Chinese Academy of Sciences, Nanjing
- AiRiA
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Multi-Objective Traveling Salesman Problem
- Multi-Objective Capacitated Vehicle Routing Problem
- Multi-Objective Knapsack Problem
summary: Separate constructive multi-objective policies couple preference-conditioned node attention and task-specific
  edge representations, improving many HV comparisons with explicit memory/runtime trade-offs.
code_url: https://github.com/RongshengJia/PMSA
figure:
  path: paper-assets/pmsa/framework.png
  alt: Original PMSA Figure1 showing coupled node and edge streams with preference-modulated structural attention.
  caption: 'Figure1: original preference-modulated node/edge encoder.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/jia26l/jia26l.pdf#page=3
---

# Preference-Modulated Structural Attention for Multi-Objective Combinatorial Optimization

> **TL;DR:** PMSA couples preference-conditioned node attention with an explicit, preference-modulated edge stream. Separately trained constructive policies approximate trade-offs for bi-/tri-objective TSP, bi-objective CVRP and bi-objective knapsack. Quality improves over the tested node-only WE-CA configurations in many settings, with greater memory/runtime and several stronger classical or neural comparisons.

## Motivation

A preference vector changes which local relationships matter in multi-objective optimization. Conditioning only global/node representations can overlook these edge-specific changes. PMSA injects objective-dependent edge information into attention and feeds node-attention context back into edge representations. It still requires a task-specific edge definition; it does not learn an objective-independent universal formulation. [pp.1–4]

## Contributions

- Preference-modulated structural attention combines a WE-CA-style node/preference stream with a learned edge stream.
- Preference-dependent edge features bias attention scores; attention weights in turn aggregate/update the edges.
- Separate policies are evaluated on four multi-objective task settings, including size transfer and three KroAB out-of-distribution cases.
- Ablations isolate edge aggregation and preference modulation, with explicit memory/parameter comparisons. [pp.3–9,16–17]

## Methodology

**Objectives and decoding.** A nonnegative preference vector sums to one. The main experiments minimize a weighted sum of objectives; knapsack's two profits require the corresponding maximization convention. POMO-style autoregressive decoding constructs routes or item subsets, and REINFORCE uses a multiple-start cost baseline. Varying preferences yields an approximate trade-off set. Weighted sums do not guarantee recovery of every unsupported Pareto point, and the paper does not provide a global Pareto-optimality certificate. AppendixG also tests Tchebycheff scalarization. [pp.3–5,13–16]

**Problem-specific edges.** Bi-/tri-objective TSP assigns an independent coordinate set to each objective and uses its Euclidean distance matrix. CVRP minimizes total route length and the longest route, sharing the geometric distance representation. Knapsack builds heuristic pair features from the sum of the two items' profit/weight ratios for each objective. These designs and task-specific inputs/decoders remain part of the formulation. [pp.4,13]

**Coupled streams.** A preference embedding conditions node representations through FiLM-style transformations. The edge MLP produces head-specific features, modulated by projected preferences and added to scaled query-key attention scores. Attention-derived edge aggregation, residual connections, feed-forward layers and layer normalization update the edge stream. All-pairs edge states require quadratic storage in the number of nodes; avoiding a separate graph convolution does not remove that cost. The formal encoder pads preference-token edges with zeros. The current release differs in details described below. [pp.4–5,14–15; Figure1]

**Classification:** Specialist / constructive. The evaluated task models have distinct inputs, edge construction and decoding. A shared preference-conditioned model spans preferences and training sizes within a task, rather than providing one checkpoint across TSP, CVRP and knapsack. The learned inference policy extends partial solutions; selecting a better candidate from multiple starts is not learned incumbent editing. [pp.3–5,13–15]

## Experiments

| Item | Reported setting |
| --- | --- |
| Training |200 epochs,100,000 generated instances per epoch; batch64; Adam learning rate10⁻⁴, weight decay10⁻⁶ |
| Architecture in release |Six encoder layers, embedding128, eight heads, query/key dimension16, feed-forward512 |
| Test sets |200 instances per size;101 bi-objective or105 tri-objective preference vectors |
| TSP objectives |Two or three independent coordinate sets, with separate distances |
| CVRP data |Demands1–9; capacities30/40/50 for20/50/100 customers |
| Knapsack data |Two profits and weight sampled in[0,1]; capacity12.5 at50/100 items,25 at200 |
| Augmentation |64 for Bi-TSP,512 for Tri-TSP,8 for CVRP; none for knapsack |
| Cross-size TSP |Training across20–100 nodes; testing150/200 |
| Main metric |Hypervolume(HV), higher is better; reported runtimes retain each method's decoding budget |

The paper names its GPU as “NVIDIA TITAN RTX3090,” an ambiguous combination of product names; this review does not infer a more precise device identity. The CPU is stated as Intel Xeon Gold5220. [pp.5–6,13–15]

**Selected unaugmented results:**

| Task/sizes | WE-CA HV | PMSA HV | WE-CA time | PMSA time |
| --- | --- | --- | --- | --- |
| Bi-TSP20/50/100 |.6270/.6392/.7034 |.6272/.6412/.7070 |7/10/21s |8/19/38s |
| Bi-CVRP20/50/100 |.4290/.4089/.4068 |.4293/.4100/.4079 |7/12/26s |8/21/45s |
| Bi-KP50/100/200 |.3558/.4531/.3602 |.3561/.4532/.3602 |9/21/66s |16/35/114s |
| Tri-TSP20/50/100 |.4707/.4389/.4985 |.4712/.4430/.5044 |5/9/20s |6/16/36s |

These comparisons improve quality frequently while increasing time. They do not show a universal Pareto dominance in quality and runtime. [pp.6–7,Tables1–3]

- **Augmented TSP:** PMSA Bi-TSP HV is.6270/.6415/.7083 with1.2/5.8/22min. At20 nodes, its own unaugmented.6272 is slightly higher. MOGLS reaches.6279 at20, and WS-LKH reaches.7090 at100, with much longer reported times. Unaugmented PMSA50(.6412) also falls below augmented WE-CA(.6413). [p.6]
- **Other neural exceptions:** EMNH's augmented CVRP20 HV.4302 exceeds PMSA's.4301; unaugmented EMNH.4299 exceeds PMSA.4293. On knapsack100/200, EMNH.4535/.3603 exceeds PMSA.4532/.3602. [pp.6–7]
- **Tri-TSP:** At100 nodes, unaugmented PMSA achieves.5044 in36s versus augmented WE-CA.5035 in1.8h. The quoted180× is this particular cross-budget comparison, not an across-the-board architecture speedup. Augmented PMSA reaches.5068 in3.2h, while WS-LKH reaches.5076 in6.6h. [p.7]
- **Size transfer:** At150/200 nodes, PMSA reaches.7062/.7408 in1.7/2.8min; WE-CA reaches.7008/.7346 in57s/1.6min. Augmented PMSA reaches.7082/.7430 in1.5/2.9h, still below WS-LKH.7149/.7490 in13/22h. These are transfers beyond the20–100 training-size range, not training only at100. [pp.8,15]
- **Distribution tests:** Three KroAB cases give PMSA.6996/.6976/.7372, augmented PMSA.7008/.6996/.7400 and WS-LKH.7022/.7017/.7430. The smaller runtimes support a trade-off on these three cases, not unrestricted TSPLIB generalization. [pp.8,16]
- **Preference endpoints:** At Bi-TSP100, PMSA-AUG gaps are.34/.24/.33% for preferences(1,0),(.5,.5),(0,1). POMO-AUG gives.03/.77/.39%, outperforming PMSA at the first extreme. [p.9]
- **Ablations:** At100/200 nodes, WE-CA HV.7034/.7346 rises to.7070/.7408 with full PMSA; removing edge aggregation gives.7053/.7371 and removing preference modulation.7057/.7384. Tchebycheff beats weighted sum at20(.6284 versus.6272), ties at50 and is lower at100–200. The tables do not establish a theorem that one scalarization always wins. [pp.9,16]
- **Resource costs:** At size50, PMSA uses2,084/3,058/1,890/2,086MB across Bi-TSP/CVRP/KP/Tri-TSP, versus WE-CA1,051/1,790/916/1,052MB. PMSA has1.60M parameters versus WE-CA1.27M and CNH1.63M. Comparisons with a133.37M multi-model portfolio have a different model-count budget. [p.17]

## Limitations

### Curator Notes

- **Metric convention:** AppendixC's prose describes per-instance ideal/nadir rescaling, while Table5 gives fixed ideal/reference bounds. The released `cal_ps_hv.py` instead computes WFG hypervolume on the raw front and divides by the fixed reference-box volume, defaulting to ideal zero; Bi-TSP100 uses reference(65,65). A reproduction should state the actual convention rather than combine these descriptions. Knapsack has nonzero fixed ideal bounds in Table5.
- **Reported gap:** Zero entries are not certified distances to the true Pareto front. For example, PMSA-AUG Bi-TSP100 is labeled zero at HV.7083 while WS-LKH has higher HV.7090 and a negative reported gap. Main-text Bi-TSP100 prose also prints.28% where Table1 prints.18%; the table values above are preserved.
- **Statistics:** The paper states a Wilcoxon rank-sum test at1%. It does not establish multiple independent training seeds or confidence intervals; this should not be described as a five-seed study or a paired signed-rank test.
- **Release coverage:** The complete inspected repository contains a two-objective TSP implementation, eight test-data files and one checkpoint. It does not expose corresponding Tri-TSP, CVRP or knapsack implementations/checkpoints, so availability of the repository does not establish complete reproduction coverage.
- **Encoder specification:** The release includes the preference token among attention keys/values, whereas AppendixD's written context excludes it. Zero edge padding occurs initially, but the affine edge-bias projection and subsequent edge updates do not reimpose zero preference-token biases at every layer. These are current-code/formal-description differences, not evidence that historical experiment numbers are false.
- **Distance typography:** The official one-page poster writes squared Euclidean distance; formal Eq.4 and the released `torch.cdist(...,p=2)` use the unsquared Euclidean norm. The formal/released convention is used here.
- **Reproduction setup:** Visible training samples an integer node count uniformly from20 through100 and samples a Dirichlet(1,1) preference per batch. The size100 test config defaults to augmentation factor1 despite enabling the augmentation switch; factor64 is required for that augmented setting. Published resource comparisons must retain the chosen augmentation and preference budgets.
- No training run or full benchmark replay was performed in this review. Source reading and formula/configuration checks verify the documented distinctions, not all historical numerical results.

## Reproducibility

- **Publication:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/jia26l.html), explicit publisher date2026-09-29. All17 formal pages, complete references, Algorithm1 and AppendicesA–I were freshly read; all three figures and nine tables were visually checked.
- **Companions:** The [official event](https://icml.cc/virtual/2026/poster/63171) links a one-page scientific poster through its Slides URL. Its complete text and three overlapping high-resolution tiles were read. No additional separate slide deck or scientific supplement is exposed there.
- **Code:** [Verified official implementation](https://github.com/RongshengJia/PMSA), linked by the publication. The untruncated47-entry source tree and48-member19.50MB ZIP were inventoried, with no extra scientific document; the README and model, trainer, environment, problem generator, evaluator and HV code were inspected. Inspected tree SHA:c4dc1607315b1449ccd607e45da774d2ff961f9f. Binary data/weights were inventoried, not replayed.
- **Figure:** Original formal Figure1, including its caption, shows the coupled node/edge architecture and preference modulation.
