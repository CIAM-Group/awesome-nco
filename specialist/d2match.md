---
id: d2match
short_title: D2Match
title: 'D2Match: Leveraging Deep Learning and Degeneracy for Subgraph Matching'
authors:
- Xuanzhou Liu
- Lin Zhang
- Jiaqi Sun
- Yujiu Yang
- Haiqin Yang
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/liu23ba.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/liu23ba.html
institutions:
- Tsinghua University
- International Digital Economy Academy
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Subgraph Matching
summary: A sampled WL-subtree/Hall-condition filter with learned graph-pair scores approximates induced subgraph-isomorphism
  decisions, with optional chordless-cycle augmentation.
code_url: https://github.com/XuanzhouLiu/D2Match-ICML23
---

# D2Match: Leveraging Deep Learning and Degeneracy for Subgraph Matching

> **TL;DR:** D2Match combines a sampled subtree/Hall-condition filter with learned graph-pair classification and optional cycle augmentation; its predictions are approximate subgraph-isomorphism decisions, not exact linear-time isomorphism certificates.

## Motivation

Exact subgraph matching can be expensive, while generic learned graph similarity may exploit dataset artifacts rather than correspondence structure. D2Match adds an explicit structural necessary-condition test to learned node/graph features. The abstract's reduction language must be read with Section 4.1, which deliberately replaces necessary-and-sufficient subgraph conditions by necessary conditions only (Sections 1/4.1).

## Contributions

- Derive a necessary correspondence condition using rooted WL unfolding trees, with recursive subtree matching expressible as a query-side-saturating bipartite matching problem.
- Implement sampled Hall inequalities through max/sum neighborhood aggregation, combining the structural filter with learned attributes and graph-pair representations.
- Add chordless-cycle supernodes and evaluate approximate classification under varied data-generation distributions, including comparisons with time-limited exact solvers.

## Methodology

**Problem and structural relaxation.** The formal task is induced subgraph isomorphism: an injective map must preserve both edges and nonedges on the selected target nodes. If a valid map exists, its rooted WL unfoldings satisfy the stated subtree-containment condition, provided the tree generator preserves subgraph containment. Theorem 4.1 establishes this direction only. Local unfolding-tree consistency need not assemble into one globally consistent injective graph map; it is not an equivalence proving polynomial exact subgraph isomorphism (Sections 3/4.1; Appendix A.2).

**Recursive Hall checks.** Neighboring query subtrees must match distinct compatible target subtrees. Complete Hall conditions quantify over every query-neighbor subset. D2Match checks full/singleton subsets and a finite number of randomly edge-sampled subsets using normalized max/sum aggregation. Theorem 4.3 explains how one such inequality is computed, not why a fixed finite sample exhausts all subsets. Passing these checks can leave false positives. The paper's term perfect matching means saturating the smaller query side, not necessarily every vertex on both unequal sides (Equations 7-8; Theorems 3.1/4.2-4.3).

**Learned score and cycles.** Initialize node compatibility using raw cosine features or a learned projection. Alternate subtree updates with GNN features/pair-interaction tensors. Chordless cycles become typed supernodes; preserving their consistency requires the induced-subgraph setting. The practical predictor replaces hard comparisons by learned sigmoids, summarizes compatibility with two count-style tests, and combines a subtree score with a neural-tensor/GNN score. Training uses MAE for the subtree branch plus MSE for the GNN branch. This softened graph-pair score is a classifier, not a validated mapping certificate (Sections 4.2-4.3; Appendix A.3/Equations 22-30).

**Complexity conditions.** The stated structural-update cost is O(L K |VT| |EQ| + L |VQ| |ET|), with an additional learned-module pairwise term. Calling it linear in target size assumes fixed query size, depth, sampling count and feature dimensions. Cycle discovery/augmentation is preprocessing; the number of chordless cycles and the augmented graph size can be much larger than the original input. The result is not a linear bound for arbitrary growing queries plus unrestricted cycle enumeration, nor an exact algorithm for the NP-complete decision problem (Section 4.3).

## Experiments

**Supervised decision protocol.** Generate positive query graphs by BFS-style sampling from target graphs and negative queries by random generation or edge perturbation. Models are trained separately on datasets; synthetic pairs use ER/WS graph generators. Original datasets have 1,000 pairs, except AIDS/IMDB-Binary with 2,000; harder variants have 500 pairs. Report mean classification accuracy under five-fold 4:1 splits and the best settings up to 500 epochs. Appendix A.3 specifies Adam at 0.0003, five layers and width ten; the sensitivity study separately finds six layers/five samples best in its tested range. These are not globally optimized instance rates or one unchanged model across native tasks (Sections 5.1-5.5; Appendix A.8).

**Main and harder-data results.** Table 1 accuracy is 74.3% on Synthetic, 100% on Proteins/MUTAG/COX2/FirstMMDB, 99.9% on Enzymes, 99.5% on AIDS and 93.3% on IMDB-Binary. COX2 ties NeuroMatch at 100%, rather than beating every baseline strictly. Harder density-controlled/perturbed variants reduce performance: Proteins falls to 83.4%, Enzymes 96.0%, AIDS 95.0% and FirstMMDB 86.4%. This supports the tested structural-filter benefit but does not prove that other GNNs only memorize distributions or that D2Match is distribution-independent (Tables 1-2).

**Exact-solver comparison uses different metrics.** Table 4 reports the fraction of exact-solver runs finishing within ten seconds, alongside D2Match classification accuracy. Appendix A.10 instead uses a sixty-second timeout and plots exact completion, completed-run accuracy and D2Match accuracy on separate axes. Completing a prediction is different from predicting correctly, and an exact solver can certify a negative answer when it finishes. Thus the model's 100% execution completion must not be presented as 100% correct subgraph decisions. Runtime is not uniformly best: MUTAG QSI takes 0.16 seconds versus D2Match 1.04 in Table 3 (Section 5.4).

**Scale and limitations.** The separate large-scale section describes DD/Firstmm settings of 300,000/50,000 nodes; its reported D2Match accuracy is 99.2/60.0%, with time 46.61/32.62 seconds. These scale claims must remain separate from the base FirstMMDB dataset's mean target size of approximately 1,376 nodes and fifteen-node queries in Appendix A.8; the paper does not supply a complete construction/hardware/timing manifest for the enlarged setup. LFTJ completion on Firstmm is 77.2%, while D2Match's 60.0% is accuracy, again a different quantity. Synthetic size sweeps retain only roughly 63-74% classification accuracy (Tables 5-6/11-12).

**Ablations and cost.** Subtree-only often outperforms the GNN-only branch, while combining them helps hard data. Cycle augmentation changes Synthetic from 72.7%/10.3 seconds per epoch to 74.3%/19.7 seconds, nearly doubling that measured cost. Another runtime table reports full D2Match training/inference 8.163/1.114 seconds per epoch versus SimGNN 1.732/0.385 and NeuroMatch 2.234/0.311; these are different configurations/tables, not one interchangeable timing number. Table 1 and the cycle ablation also print different uncertainty for the same 74.3 mean. Random-split robustness is checked only on two easy 100%-accuracy datasets, not all difficult regimes (Appendices A.5-A.7).

## Limitations

### Discussed in the Paper

Section 4.2 explicitly says the method cannot select all true isomorphism pairs precisely. The method trades exactness for time-constrained learned decisions; harder/synthetic cases remain imperfect. Cycle/attribute information improves performance at additional cost, and further structural/positional information is future work (Sections 4.2/5-6; Appendix A.7).

### Curator Notes

**Logical boundary.** Even the two final hard count conditions in Appendix A.3 are insufficient for a matching: every query column can be nonempty and the total candidate-target union large enough while two columns share only one possible target, violating Hall on that subset. Learned sigmoid tests weaken the certificate interpretation further. Qualitative highlighted subgraphs are not an exhaustive exact-mapping validation benchmark. Equation 2 also prints S AQ S-transpose = AT, which is too strong for general induced subgraph containment; with the stated rectangular injection, the induced constraint compares S-transpose AT S with AQ instead.

**Current-code checks.** In e2e_model.py the two final count expressions both take the same target-axis maximum, unlike the two distinct conditions in the appendix. Dataset generators use VF2-style label checks, but may accept a would-be negative when the 600-second check times out; dataset fallback paths can also generate negatives with the check disabled after retries. Such generated labels are not uniformly certified non-isomorphism, and this audit does not quantify the incidence in historical experiments. Stratified splitting is over generated pairs; no separate target-graph-disjoint or nested epoch-selection protocol is established by the released entry point. These are reproducibility/interpretation limits, not proof that reported labels or measurements are all incorrect.

## Reproducibility

- **Publication:** [PMLR ICML 2023 record](https://proceedings.mlr.press/v202/liu23ba.html), pp. 22454-22472. Five authors and Tsinghua Shenzhen/IDEA affiliations match the paper. The [publisher source](https://raw.githubusercontent.com/mlresearch/v202/gh-pages/_posts/2023-07-03-liu23ba.md) explicitly records issued date 2023-07-03.
- **Reading/supplements:** every page of the nineteen-page publisher PDF, including complete references and Appendices A.1-A.10, every proof, algorithm, formula, classification table, timing table and visualization. Publisher extras are empty; normal OpenReview API/API2 checks return 403, and official repository inventory identifies no further scientific PDF/ZIP attachment.
- **Code:** [official D2Match implementation](https://github.com/XuanzhouLiu/D2Match-ICML23), directly linked in Appendix A.3. Although README still says release soon, actual model, graph/data generation, cycle transform, configuration and training code are available and were inspected. Current cycle augmentation uses lengths three/four in preprocessing, and entry-point defaults use five layers/five samples. This audit does not rerun training, dataset generation or exact search.
- **Citation graph:** the entire catalogue was checked against explicit body citations and bibliography identities. The cited NeuroMatch/SimGNN/Graph Matching Networks works do not have exact existing records in this catalogue; no relation is invented from similar names or the unrelated SIGMA set-cover reference.
