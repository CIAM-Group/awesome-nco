---
id: neural-approximation-position
short_title: Neural Approximation Position
title: 'Position: Neural Approximation Is Rarely Justified for Hard Combinatorial Problems'
authors:
- Pritish Chakraborty
- Indradyumna Roy
- Soumen Chakrabarti
- Abir De
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/chakraborty26d.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/chakraborty26d.html
institutions:
- Indian Institute of Technology Bombay
- Aalto University
scope: study
paper_type: analysis
problem_families:
- Graph Optimization
- Routing
problems:
- CO Evaluation
- Maximum Clique
summary: A position paper audits five costs and five guarantees, tests clique decoders and retrieval pipelines,
  and argues for application-specific justification of neural optimization.
---

# Position: Neural Approximation Is Rarely Justified for Hard Combinatorial Problems

> **TL;DR:** A position paper argues that neural solver replacement needs evidence beyond inference speed. It evaluates costs, decoder dependence and selected distribution shifts, while supporting differentiable layers, retrieval embeddings and useful neural guidance inside classical solvers.

## Motivation

Reported inference speed or benchmark quality can omit label generation, training, postprocessing, failure consequences and maintenance under distribution shift. The authors ask whether the neural component supplies a necessary capability for the application or whether a mature combinatorial method already meets its requirements. The thesis concerns justifying replacement of a known optimization procedure; it is an argued position, not an impossibility theorem for learning (PDF pp. 1–3).

## Contributions

The framework tracks five costs—per-instance inference, training, data/labels, approximation failure and distribution shift—and five desired guarantees: feasibility, approximation quality, robustness, incremental improvement and generalization. It distinguishes solver replacement, neural augmentation and differentiable components, then offers a five-question diagnostic checklist (pp. 2–4, 8).

The paper adds clique-decoder ablations, training/inference-time measurements, size-shift examples and graph-retrieval experiments. It also discusses opposing arguments from amortized optimization and learning unknown or nonlinear objectives. Neural methods are explicitly supported when they enable useful gradients, fit a serving/indexing interface, or guide a solver without discarding its correctness machinery (pp. 7–9, 14–18).

## Methodology

The main controlled experiment retains each method's decoder while replacing neural scores with uniform-random, node-degree or core-number scores. It uses decoders associated with DIFUSCO, Erdős Goes Neural (EGN) and hybrid geometric scattering networks (labelled SCT in the results). DIFUSCO is **adapted from independent set to clique estimation**; this is not an experiment originally reported for clique by DIFUSCO's authors. Random scores use eight samples and keep the best decoded clique for each test graph (pp. 7, 14–15).

The six settings are IMDB-BINARY, ENZYMES, a MUTAG-derived matching construction, RB, Brockington and DSJC. The appendix says the MUTAG task represents maximum common induced subgraph size, which should be distinguished from ordinary clique estimation on the original molecular graph. Results are measured by clique-number MSE, rather than a bound on every solution or runtime-adjusted dominance over all neural configurations (pp. 7, 14).

The retrieval study separates indexing from scoring. A FAISS random-hyperplane LSH index over IsoNet embeddings filters a 100,000-item corpus to at most 2,500 candidates for 100 test queries. The authors compare exhaustive oracle scoring, indexed oracle scoring and indexed neural scoring, exposing a separate quality/latency tradeoff at each stage (p. 15).

## Experiments

Table 2 shows that simple decoder inputs can be competitive under the tested protocol. On IMDB, eight-start random scores yield zero MSE for EGN and SCT decoders, versus neural-score MSE 0.102 and 4.102. DIFUSCO's degree scores improve RB MSE from 55.630 to 47.335 and Brock from 10.590 to 6.245. This is not universal: EGN's neural scores are better on DSJC and MUTAG, and random DIFUSCO scores can be much worse. The result supports performing decoder ablations rather than eliminating neural components in every pipeline (pp. 7–8, 14–15).

Additional training measurements on a single RTX A6000 range from roughly 1 to 26 hours, with reported per-instance inference below one second. These are dataset-specific EGN/adapted-DIFUSCO measurements, with an early-stopping limit of 10,000 epochs; they do not include a complete lifecycle or deployment break-even calculation (pp. 15–16).

On a PTC-MM-m size-based split, EGN MSE changes from 0.284 to 3.260, while the random baseline changes from 0.745 to 1.359. SCT instead improves from 1.802 to 1.256 under the shifted split, although the random and clustering-coefficient baselines remain better. Both directions are reported; the study does not establish that every distribution shift worsens every model (p. 16).

In the three PTC retrieval datasets, LSH plus oracle scoring takes 0.915–1.153 s/query with MAP@100 0.98–1.00, compared with exhaustive oracle times of 26.07–49.34 s/query. Replacing the filtered oracle scorer with IsoNet reduces time to 0.149–0.174 s but MAP@100 to 0.50–0.63. The authors favor retaining oracle scoring in this setting; whether that quality/latency tradeoff is acceptable depends on the application's serving target. Two filtered-oracle times exceed one second, despite the nearby prose saying it already operates under one second (p. 15).

## Limitations

### Discussed in the Paper

Amortized optimization can justify up-front learning costs when deployment volume is high and the instance distribution is sufficiently stable. Learning may also be necessary when costs or task objectives must be inferred. The authors additionally identify GFlowNet-based combinatorial optimization as a promising example, noting that its optimum-concentration argument assumes perfect training and a zero-temperature limit rather than a finite-training guarantee (pp. 6, 8–9).

### Curator Notes

The evidence comes from selected papers, model adaptations, datasets and decoder configurations. Best-of-eight random decoding is a stronger baseline than one random draw and should retain its budget when reproduced. The article does not provide full split thresholds, training configurations, repeated-seed uncertainty or executable code for every added experiment. Its literature criticisms are the authors' assessments, not independently established failures of every cited method (pp. 5–9, 14–18).

Several broad comparisons need their assumptions. Classical exact solvers can provide primal/dual certificates, but generic heuristics and fractional LP relaxations do not automatically guarantee a feasible discrete optimum or a certified approximation. Neural policies can also be combined with incumbents, verifiers or exact solvers. Likewise, a score above a heuristic solver's reference is not by itself proof of infeasibility, and equality with a true optimum is valid; the discussion of strict clique-size inequalities should not replace direct feasibility checks (pp. 5, 8, 17–18).

Distribution changes can require maintenance, but the need and economics of retraining are application-dependent. The paper's measurements do not prove that amortization is impossible, that every neural method lacks a bound, or that the complete modern literature is covered. Its recommendations should be applied using workload-specific evidence and measured end-to-end costs (pp. 6, 8–9, 16–18).

## Reproducibility

- Publication record: [ICML 2026](https://proceedings.mlr.press/v306/chakraborty26d.html).
- Source text: [paper](https://raw.githubusercontent.com/mlresearch/v306/main/assets/chakraborty26d/chakraborty26d.pdf).
- No implementation link was verified in the sources reviewed.

The [publisher metadata](https://proceedings.mlr.press/v306/chakraborty26d.html) explicitly records `citation_publication_date` as **2026-09-29**, independently of any paper-specific acceptance date. July6–11 describes the ICML2026 meeting, rather than its publication-record date. The appendix reports a single RTX A6000 GPU and an Intel Xeon Gold 6130 server running Debian 12, with 64 CPU cores and 1.6 TB RAM. These describe the authors' experiment environment, not independent replication.

This audit read all 18 proceedings pages, the full bibliography and Appendices A–E, including the added rebuttal experiments and all eight tables; eight key pages were inspected visually. The publisher links the PDF and OpenReview but no code or separate scientific supplement. Both OpenReview API versions returned 403 and no explicitly referenced missing scientific attachment was identified. Source-level verification does not claim that the experiments or every historical comparison were rerun.
