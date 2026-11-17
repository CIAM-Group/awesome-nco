---
id: cs-probing-nco
short_title: CS-Probing
title: Probing Neural Combinatorial Optimization Models
authors:
- Zhiqin Zhang
- Yining Ma
- Zhiguang Cao
- Hoong Chuin Lau
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/becf96dcee66f9df08169e4c96bbbd8c-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/becf96dcee66f9df08169e4c96bbbd8c-Abstract-Conference.html
institutions:
- Singapore Management University
- Massachusetts Institute of Technology
scope: study
paper_type: analysis
problem_families:
- Routing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Asymmetric Traveling Salesman Problem
- Job Shop Scheduling Problem
summary: Linear probes, coefficient significance and targeted embedding ablations analyze learned routing representations,
  with preliminary ATSP and scheduling extensions.
code_url: https://github.com/123zhangzq/NeurIPS2025_probing/
---

# Probing Neural Combinatorial Optimization Models

> **TL;DR:** Linear probes and coefficient significance reveal information decodable from NCO embeddings. Targeted LEHD output ablations and sparsity regularization provide empirical interventions, while the generalization interpretation remains a case study rather than a causal or solver-quality guarantee.

## Motivation

Good tour costs reveal little about what routing embeddings encode or how that information changes across layers, training and problem scales. This study asks whether simple probes can recover geometric and decision-related properties from trained NCO representations, then uses probe coefficients to inspect how those properties are distributed across coordinates (PDF pp. 1–3).

## Contributions

The paper designs four main probing tasks: TSP pairwise Euclidean distance; distinguishing a verified optimal edge from a differing greedy edge; CVRP pairwise demand sums; and membership in the same route of a reference solution. Coefficient Significance Probing (CS-Probing) combines coefficient magnitude with regression significance tests to identify associated embedding coordinates. AM, POMO and LEHD form the main comparison; appendices add preliminary DIFUSCO, MatNet/ATSP and GNN/JSSP analyses (pp. 3–10, 22–34).

The paper also tests interventions on LEHD's final embeddings and trains variants with an L1 sparsity penalty. Its contribution is representation analysis and a limited model-design experiment, rather than a new universal combinatorial solver or a single checkpoint spanning the studied architectures and problems.

## Methodology

The routing datasets contain 10,000 instances per studied scale. Tasks 1 and 3 contain 10,000 regression observations; Tasks 2 and 4 contain 20,000 binary observations. A probe normally receives two concatenated 128-dimensional node embeddings. Some comparisons augment these with their Hadamard product; the demand task also tests the product alone. Such models are linear in the chosen probe features, but interaction-augmented probes are not linear in the original embeddings (pp. 21–27).

For the anti-myopia task, Gurobi obtains an optimal TSP tour and the best of greedy tours from every start node supplies a contrasting edge. The paper describes forcing or forbidding edges and resolving to exclude ambiguous labels. CVRP same-route labels instead use HGS heuristic solutions, so they are not certificates of membership in every global optimum. The probes use OLS for regression or maximum-likelihood classification, with R² or AUC among the evaluation metrics. CS-Probing examines coefficients and p-values; the paper reports Benjamini–Hochberg correction at FDR 0.05 across 256 dimensions for the key LEHD findings (pp. 8, 22–28).

Scale-matched model checkpoints are used for the main probing tables. Separate transfer experiments apply a fixed smaller-scale checkpoint to larger instances. Main coefficient reuse examples compare 20-to-100-node transfer, whereas the large-scale output and regularization experiments use a TSP100-trained LEHD model (pp. 8–10, 25, 34–38).

## Experiments

For 20-node TSP without interaction terms, final-node distance R² is 0.2529 for AM, 0.1981 for POMO and 0.9418 for LEHD; the corresponding anti-myopia AUCs are 0.76, 0.76 and 0.86. Interaction terms improve several AM/POMO results. These comparisons depend on the feature construction, layer and task, and do not establish one architecture's unconditional superiority (Tables 1 and 9, pp. 3, 29).

LEHD's largest probe coefficients reuse candidate-node dimensions 31/69 for distance and 31/97 for the edge classification across the examined scale shift. Retaining only dimensions 31 and 97 in the final 128-dimensional LEHD output changes the TSP100 gap from 0.57% to 0.65%; zeroing both instead gives 60.43%. This is an intervention on the final representation, not a two-dimensional replacement for the entire neural network. Results at 200, 500 and 1,000 nodes show a similar retained-dimension comparison (Tables 2–4, pp. 8–9).

Training LEHD with L1 regularization gives preliminary transfer improvements: λ = 10⁻⁶ changes the TSP1000 gap from 3.17% to 2.87% and the TSPLib gap from 5.26% to 4.94%. Benefits are not uniform: the same setting slightly worsens TSP200, and λ = 10⁻³ increases the TSPLib gap to 8.61% (Table 5, p. 10).

The appendices report lower-/higher-level probes for DIFUSCO, asymmetric distance probes for MatNet and precedence probes for a JSSP GNN. CVRP probing scores do not strongly track solver performance: AM obtains the strongest same-route probing result without being the best CVRP solver. These extensions demonstrate applications of the tool, rather than one learned solver transferring between all tasks (pp. 31–34).

## Limitations

A successful probe establishes predictive decodability for its labels and selected features; it does not by itself establish causal use by the original policy, global optimality reasoning, or a guarantee of constraint feasibility. The targeted output ablations support the importance of particular coordinates in the tested LEHD checkpoint, while coefficient reuse and generalization remain associated observations. Coordinate numbers and coefficient rankings are specific to the learned representation and probe protocol.

The raw-distance anti-myopia baseline is AUC 0.64 in Appendix C.1.1/Figure 11, despite the main text describing it as close to 0.5. It should therefore be treated as a nontrivial baseline rather than random guessing. Exact label collection is costly, and heuristic CVRP labels add reference-solution uncertainty. The authors acknowledge data-generation costs and the difficulty of exact labels on larger problems (pp. 28, 39).

The public example notebook constructs two rows from each routing instance and performs an 80/20 split by row. This supplies held-out probe observations, but does not enforce a split by routing instance. Its statsmodels coefficients and p-values are fitted on the training partition. The example does not establish that every reported experiment used independent held-out routing instances or that repeated probe fits measure variation across independently trained NCO checkpoints.

## Reproducibility

The full [39-page publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/becf96dcee66f9df08169e4c96bbbd8c-Paper-Conference.pdf), including all references, checklist and Appendices A–E, was reviewed. The [NeurIPS 2025 proceedings page](https://proceedings.neurips.cc/paper_files/paper/2025/hash/becf96dcee66f9df08169e4c96bbbd8c-Abstract-Conference.html) has no separate scientific supplement. Two single-page author-repository figure PDFs were also inspected; they reproduce figures already present in the article.

The [author repository](https://github.com/123zhangzq/NeurIPS2025_probing/) supplies sample data-generation code, POMO/LEHD embedding-extraction modifications, an example probing notebook and LEHD regularization files. The notebook, data-generation script and relevant regularization implementation were read. The example uses a standardized-feature linear classifier and a separate statsmodels logistic fit; the regularization code adds a mean token-wise L1 norm before the final projection. Reproduction requires the corresponding original model code and suitable checkpoints. The paper describes complete probing-dataset release as planned; no experiments or model training were rerun here.
