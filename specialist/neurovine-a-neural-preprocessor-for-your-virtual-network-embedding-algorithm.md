---
id: neurovine-a-neural-preprocessor-for-your-virtual-network-embedding-algorithm
short_title: NeuroViNE
title: 'NeuroViNE: A Neural Preprocessor for Your Virtual Network Embedding Algorithm'
authors:
- Andreas Blenk
- Patrick Kalmbach
- Johannes Zerwas
- Michael Jarschel
- Stefan Schmid
- Wolfgang Kellerer
year: 2018
date: 2018-04
publication:
  date: 2018-04
  source_url: https://doi.org/10.1109/INFOCOM.2018.8486263
venue: INFOCOM
paper_url: https://doi.org/10.1109/INFOCOM.2018.8486263
institutions:
- Technical University of Munich
- Nokia Bell Labs, Munich
- University of Vienna
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Network Embedding
problems:
- Virtual Network Embedding
summary: A hand-configured Hopfield network preselects substrate nodes before conventional virtual-network embedding,
  with metric-dependent simulation gains and soft-count/feasibility qualifications.
figure:
  path: paper-assets/neurovine-a-neural-preprocessor-for-your-virtual-network-embedding-algorithm/framework.png
  alt: Original Figure2 showing virtual request and substrate inputs, Hopfield node preselection and downstream
    VNE embedding.
  caption: 'Figure2: original NeuroViNE preprocessing pipeline and complete caption.'
  source_url: https://schmiste.github.io/infocom18neuro.pdf#page=3
---

# NeuroViNE: A Neural Preprocessor for Your Virtual Network Embedding Algorithm

> **TL;DR:** A hand-configured Hopfield network selects a promising subset of substrate nodes before a conventional virtual-network embedding algorithm runs. It can improve resource efficiency or reduce model-construction cost, with topology-dependent acceptance tradeoffs. The neural stage neither trains a reusable predictor nor directly solves the complete VNE problem.

## Motivation

Virtual network embedding maps requested CPU capacities and unsplittable virtual links onto a resource-limited physical network. Exact formulations become expensive; independent node rankings can place communicating virtual machines far apart, increasing path bandwidth costs. Selecting high-capacity nodes that are close together can reduce the candidate space without replacing an existing embedding algorithm. [pp. 1–2]

## Contributions

- A recurrent Hopfield preprocessor combines residual CPU, residual-bandwidth-aware distances and a node-count preference.
- Constant, request-size-proportional and inverse request-size selection rules expose an efficiency/acceptance tradeoff.
- A data-center modification excludes switches from hosting virtual machines and permits a conventional fallback when preprocessing rejects a request.
- Simulation compares several conventional embedding algorithms on random, wide-area and data-center topologies. This is specialist **neurodynamic** optimization: reusing one analytical energy construction with several downstream algorithms is not evidence of a shared learned model across distinct CO tasks. [pp. 2–8]

## Methodology

**Neural responsibility.** There is one neuron per substrate node. Residual CPU contributes a node cost; shortest-path distances derived from link weights contribute pairwise costs. A weighted k-out-of-n term encourages a selected-node countζ. The weight matrix and bias are calculated from the current network, without supervised examples or reinforcement-learning training. The reported coefficients areα=10,β=7,γ=3. [pp. 3–4]

**Dynamics and decoding.** Continuous internal states follow a leaky Hopfield ODE with tanh outputs. Algorithm 2 starts from random states and uses a three-stage Runge–Kutta update, step size 0.1, terminating on a change threshold or iteration cap. Thresholding selects substrate nodes. The cardinality term is a soft preference: the paper explicitly reports that too few nodes can be selected. For data centers, switch neurons are clamped off so they cannot host virtual machines. [pp. 2,4–5]

**Downstream embedding.** Crucially, Section III-H restricts **node placement** to the selected subgraph but maps virtual links on the **full original substrate**. Unselected physical nodes can therefore still participate in routing. The neural output is a preprocessing decision, not a complete feasible VNE assignment. The data-center fallback can invoke the original algorithm on a failed request, adding computational cost. [pp. 4–5]

## Experiments

| Component | Reported protocol |
| --- | --- |
| Repetition |At least 10 runs per substrate setting;2,500 arriving virtual-network requests per setup |
| Baselines |GRC, GREEDY, SDP and deterministic/randomized ViNEYard variants |
| Random substrates |100-node Erdős–Rényi graphs with edge probability 0.11; Barabási–Albert graphs with varying density |
| Real topologies |28 Topology Zoo networks of at least 50 nodes; illustrative KDL graph has 709 nodes/815 links |
| Data centers |FatTree/BCube, with servers distinguished from switches |
| Requests |ER-based 2–20-node requests on general substrates;3–10-node Waxman requests for data centers |
| Metrics |Acceptance ratio, total resource revenue, revenue/cost ratio, model-construction time and solver time |

**Quality is metric dependent.** With GRC, very small constant subsets harm acceptance sharply. Atκ=25 the paper reports 18% higher revenue/cost ratio with slightly lower revenue; atκ=50 it reports 9% higher ratio with similar/slightly higher acceptance and revenue. Factor-based selection usesκ=2.5 after a parameter study. On random graphs, plain GRC can retain better acceptance/revenue; the realistic sparse topologies favor the preprocessor more strongly. [pp. 6–8]

**Data centers and exact formulations.** Reported revenue/cost-ratio gains are approximately 10% on FatTree and 7% on BCube, with little change in already high acceptance. SDP runs have a 30-second solving cap. Neural preprocessing can greatly reduce model-creation time—reported up to tenfold in the shown experiment—but large requests still reach the solving cap. Figure 7 includes Hopfield creation/execution in preprocessing/model setup; it does not establish a hardware-independent end-to-end speed ranking or a globally optimal embedding. [pp. 7–9]

## Limitations

### Curator Notes

- **Feasibility and objective:** Soft node-count control, thresholding and a heuristic ranking objective do not certify feasible or optimal VNE. Explicit negative acceptance/revenue cases and the full-network fallback matter when interpreting improvements.
- **Convergence scope:** Slide 7's broad convergence language must not be treated as a global VNE guarantee. Moreover, the printed quadratic energy alone is not a universal Lyapunov function for the displayed finite-gain, leaky continuous dynamics: in the generic one-neuron background with T=0,I=0.1,U=2 and unit time/gain parameters, its derivative is positive (approximately 0.006712). This narrowly checks Eqs. 5–7; it does not refute the simulated VNE results or execute the complete algorithm. Standard continuous-energy qualifications and a finite numerical integration budget remain relevant.
- **Printed formulas/versions:** Equation 9 is printed as Bmax−Bij/Bmax; it has not been silently replaced with( Bmax−Bij )/Bmax. Figure 2 is a schematic, whereas Section III-H gives the precise full-substrate link-routing rule. Slide 15 labels its illustrative ISP as 750 nodes, while the main paper specifies 709; the main-paper value is used here.
- Manual parameter selection, simulated arrival/lifetime/resource distributions and a capped mathematical solver limit transfer/runtime claims. Automatic adaptation and alternative neural models are future work rather than demonstrated learned generalization.

## Reproducibility

- **Publication:** INFOCOM 2018 main conference, pp 405–413, DOI 10.1109/INFOCOM.2018.8486263. Publisher-deposited Crossref metadata and the author publication list support **April 2018**; the DOI creation timestamp in October is not used as the publication date. The formal six-author order and printed TUM/NokiaBellLabs/UniversityofVienna affiliations are retained, rather than current conference-profile affiliations.
- **Reading:** All nine author-hosted conference-manuscript pages, both algorithms, all 29 references and all seven figures were read/visually checked. The separately author-linked 20-page paper-specific slide deck was also fully read, including every diagram and result plot. No separate scientific appendix is referenced in the obtained article; the author's exact publication entry links the paper and these slides. No inaccessible publisher attachment is claimed as inspected.
- **Implementation:** No paper-specific official code release was identified in the obtained text and exact author publication entry. The paper acknowledges an implementation contributor but does not provide enough released code/configuration to reproduce its entire simulator and solver setup. No training is required by the proposed neural stage; no benchmark was rerun.
- **Figure:** Original Figure 2 and complete caption are cropped directly from manuscript page 3 and were checked at the actual public asset path.
- **References:** Full body/bibliography matching establishes no citation to another current catalogue entry. Pointer Networks is named only as a future direction without a matching reference; that substring does not create a graph edge.
