---
id: neuro-cross-exchange
short_title: NCE
title: Learning to CROSS exchange to solve min-max vehicle routing problems
authors:
- Minjun Kim
- Junyoung Park
- Jinkyoo Park
year: 2023
date: '2022-06-06'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=ZcnzsHC10Y
venue: ICLR
paper_url: https://openreview.net/forum?id=ZcnzsHC10Y
institutions:
- KAIST
scope: generalist
paper_type: solver
arxiv_url: https://arxiv.org/abs/2206.02771
paradigm: improvement
problem_families:
- Routing
problems:
- Min-max Flexible Multi-Depot Vehicle Routing Problem
- Min-max Multi-Depot Vehicle Routing Problem
- Min-max Multiple Traveling Salesman Problem
- Min-max Capacitated Vehicle Routing Problem
- Capacitated Vehicle Routing Problem
summary: A supervised GNN prunes CROSS-exchange candidates; one min-max FMDVRP-trained predictor transfers to three
  min-max routing variants, while min-sum CVRP uses retraining.
figure:
  path: paper-assets/neuro-cross-exchange/framework.png
  alt: Improvement pipeline with heuristic initialization, two-tour CROSS exchange and intra-route optimization.
  caption: 'Figure 1: CROSS-exchange improvement framework; NCE learns to restrict the inter-route exchange search.'
  source_url: https://openreview.net/pdf?id=ZcnzsHC10Y#page=2
---

# Learning to CROSS exchange to solve min-max vehicle routing problems

> **TL;DR:** A supervised GNN prunes CROSS-exchange candidates. One predictor trained on min-max flexible multi-depot VRP transfers without fine-tuning to min-max MDVRP, mTSP and CVRP; ordinary min-sum CVRP is a separately retrained variant.

## Motivation

Min-max routing minimizes the longest vehicle route rather than total distance, so exchanging work between vehicles can be especially useful. Exhaustive CROSS exchange chooses the beginning and end of a subsequence in each of two routes, giving a quartic candidate space. NCE learns which beginning-node pairs are promising and explicitly searches the ending nodes only for a small retained set. This replaces expensive search guidance with prediction while still computing the actual cost of candidate moves. [Sections 1-3.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=1)

## Contributions

- A GNN predicts the best achievable cost decrement conditional on two routes and a pair of subsequence beginnings.
- Fixed-size candidate pruning reduces the stated exchange-search order from quartic to quadratic in route length; the predictor does not output a complete route or certify the best exchange.
- Supervised labels come from exhaustive local exchange evaluations, without requiring an expert complete-solution label.
- A single min-max FMDVRP-trained predictor is reused across depot constraints and capacity-constrained min-max variants. The formal appendices additionally cover min-sum retraining, larger sizes, distribution shifts and a sterilizing-robot planning case. [Sections 3-4 and Appendices A-M.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=4)

## Methodology

### Search loop and predicted candidates

A clustering/greedy assignment heuristic creates feasible initial tours. The main policy selects the longest and shortest route, applies NCE to exchange two subsequences, then uses the classical **elkai** TSP solver for intra-route reordering. When improvement stops, random exchanges perturb the routes; the best solution is retained across these attempts. Defaults are K=10 candidate beginning pairs and p=5 perturbations, justified by small-instance ablations. These classical components are substantive parts of the complete solver. [Algorithms 1-2 and Appendix F.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=3)

The GNN scores every pair of possible starting nodes. Retain the K highest-scoring pairs, then enumerate feasible ending-node pairs for each and execute the exchange with the best **evaluated** improvement. For fixed K this is O(K*n-squared), summarized as quadratic exchange search. It does not bound total solve time: neural encoding, candidate sorting, intra-route optimization and repeated improvement/perturbation remain. Prediction errors can prune the best move. On 1000 held-out FMDVRP instances, top-one recall of the best beginning pair is 42.9%, top-ten 90.9% and top-twenty 97.4%. [Section 3.1 and Appendix H.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=5)

The objective for the transferred min-max model is the maximum of the two selected route lengths. Capacity constraints are enforced by restricting the explicit ending-pair search to feasible exchanges; depot handling and initialization also remain task-specific. Formal Section 4.3/Appendix E explicitly **retrain** the predictor under the sum of route lengths for ordinary min-sum CVRP. That result must not be included in the unchanged-checkpoint transfer claim. [Section 4.3 and Appendix E.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=8)

### GNN and supervision

The two routes form a directed complete graph. Node inputs are Euclidean coordinates and a depot indicator; edge input is Euclidean distance. Five attentive graph-network layers update node/edge embeddings. Four-layer, width-64 Mish MLPs parameterize edge updates, attention, node updates and the final prediction. The prediction combines four boundary-node embeddings and edge embeddings corresponding to links added and removed by an exchange. [Section 3.2 and Appendix G.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=5)

Training uses 50000 random FMDVRP instances: 10-100 customers, 2-9 depots, two vehicles and uniform unit-square coordinates. Exhaustive endpoint searches for each feasible beginning pair generate **47856986 local labels**. Huber loss is optimized for three epochs with AdamW learning rate 5e-4. Labels are cheaper to define than complete optimal solutions, but still require substantial enumeration; they are not free or unsupervised. [Appendix G.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=22)

## Experiments

### Formal min-max benchmarks

Random routing tests report mean makespan and time over 100 instances per size. The stated server has an AMD Threadripper 2990WX and RTX 3090; evaluation uses a single CPU core, while some imported neural baselines have GPU timings. Small cases compare CPLEX optima; larger gaps use CE, LKH or a chosen best method and therefore are not certified optimality gaps. [Section 4 and Appendix G.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=6)

| Formal setting | NCE cost / average seconds | Comparison |
| --- | --- | --- |
| FMDVRP, 100 customers / 8 depots / 5 vehicles | 1.75 / 6.41 s | CE 1.74 / 218.46 s; OR-Tools 2.00 / 30.46 s |
| FMDVRP, 800 / 40 / 40 | 0.65 / 3802 s | OR-Tools 1.09 / 72166 s; greedy is much faster but worse |
| mTSP, 100 customers / 5 vehicles | 2.25 / 16.01 s | LKH-3 2.20 / 262.85 s; DAN 2.72 / 0.43 s |
| mTSP, 750 customers | 1.99 / 580 s | LKH-3 1.99 / 6303 s in the reported configuration |
| Min-max CVRP, 30 customers / 3 vehicles | 2.25 / 2.03 s | Ten samples: 2.19 / 5.78 s; OR-Tools 2.44 / 1.0 s |

NCE approaches full CE quality with much less search, and improves the listed neural baselines' makespans. Its speed advantage is comparison-specific: tiny cases can be slower than CE or OR-Tools due to network overhead, and fast neural constructors such as DAN can be faster while returning worse solutions. FMDVRP at 800 nodes still takes roughly an hour per reported mean run. [Tables 1-5 and A.5.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=6)

The min-max CVRPLIB experiment averages twenty runs on eleven E-series cases. NCE often improves the listed N2/NMCF local-search baselines, but not uniformly: E-n22-k4 is 110.70 versus both baselines' 110.00, and NMCF is slightly better on E-n33-k4 and E-n76-k8. Likewise mTSPLIB's column labeled Gap uses a ratio around one; it is not an average percentage optimality gap. Only starred CPLEX entries are stated optimal. [Appendices C-D, Tables A.4/A.6.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=17)

### Separate min-sum variant and transfer studies

The retrained min-sum model obtains CVRP100 cost 16.29 (4.09% against LKH) in 13.67 s. Ten samples with p=20 improve to 15.81 (1.02%) in **90.12 s**. The imported POMO row has 15.73 (0.43%) in 0.01 s on GPU, while LKH has 15.65 in 4.68 s. This variant is not a general quality or speed winner; the authors explicitly identify inefficient min-sum search as a limitation. These formal results supersede the different min-sum table in the 2022 preprint. [Appendix E, Table A.7.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=19)

The sterilization case models a building floor as 500 grids, including 25 obstacle cells and 99 contaminated cells. Travel and location-dependent service times define a min-max mTSP for one to five robots. With five robots NCE gives makespan 245 in 233.2 s, versus OR-Tools 269 in 1043.8 s and greedy-plus-TSP 294 in 4.51 s. This is a modeled path-planning case; physical robot deployment is not established by this experiment. [Appendix K.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=27)

Appendix M tests the unchanged FMDVRP predictor on cluster, expansion, explosion, grid, implosion and mixed distributions at two task sizes. The reported quality/runtime generally improves the listed CE and OR-Tools rows. Appendix L separately plots a runtime-quality tradeoff on 100 FMDVRP(60,5,5) instances. These are controlled transfer studies within routing rather than evidence of arbitrary optimization-task transfer. [Appendices L-M.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=28)

## Limitations

### Reported by the Authors

- Pickup-and-delivery and time-window constraints are not handled; incorporating these is future work.
- Min-sum CVRP requires many more improvement iterations, suggesting a different local operator may be needed for efficiency. [Conclusion and Appendix E.](https://openreview.net/pdf?id=ZcnzsHC10Y#page=9)

### Curator Notes

- **Generalist / improvement** is supported specifically by one unchanged predictor across the four min-max routing variants. The separate min-sum checkpoint and the task-specific feasible search must remain explicit.
- The top-K reduction can miss the globally best exchange, and a near-zero gap to CE does not certify a globally optimal route.
- Some printed source expressions are internally inconsistent: Equation 5/Algorithm 2 write after-cost minus before-cost while describing maximized positive cost decrements. Their intended improvement mechanism should not be implemented by blindly copying that sign. Table A.16 also contains gap/reference inconsistencies, including a mixed-distribution CE cost 3.03 alongside a zero gap despite NCE 1.27. The note does not treat these printed gaps as certificates or silently repair source numbers.
- Imported CPU/GPU runtimes, perturbation counts, multistart sampling and the substantial supervised-label generation budget limit direct cross-method speed claims.

## Reproducibility

- **Reading sources:** all **25 pages of arXiv v1 (6 June 2022)** and all **29 pages of the ICLR 2023 camera-ready copy** were reread. The formal copy includes the complete scientific Appendices A-M; all references, formulas, tables and examples were checked. OpenReview currently returns a challenge/403, so the formal PDF was recovered from a [document mirror](https://huggingface.co/datasets/Chelsea707/Conference_2020-2025/resolve/main/ICLR/2023/Learning%20to%20CROSS%20exchange%20to%20solve%20min-max%20vehicle%20routing%20problems.pdf), with publisher header, formal title, authors and KAIST affiliation manually matched against the [KAIST institutional publication record](https://pure.kaist.ac.kr/en/publications/learning-to-cross-exchange-to-solve-min-max-vehicle-routing-probl/). No byte-identity assertion is made about an inaccessible direct download.
- **Version distinction:** the arXiv title is *Neuro CROSS exchange: Learning to CROSS exchange to solve realistic vehicle routing problems*. Formal publication uses *Learning to CROSS exchange to solve min-max vehicle routing problems*. The formal version adds min-max CVRP and other experiments, and explicitly states min-sum retraining; old preprint tables are not substituted into the formal results. Formal year 2023 and first preprint date 6 June 2022 are separate metadata.
- **Supplement check:** the formal copy contains every scientific appendix referenced by the main text through M. Publisher access denial is recorded; no unknown inaccessible attachment is claimed read. The author homepage and KAIST record were inspected and no separate missing scientific file was identified.
- **Implementation:** no author-maintained NCE repository was confirmed from the full manuscripts and inspected author/institutional pages. Elkai is a third-party intra-route dependency, not the NCE implementation. Experiments were not rerun.
- **Image:** displayed Figure 1 is a complete original formal-PDF p. 2 crop. The predictor/positive-cost plots, exchange equations, main tables, min-sum failures, route examples and sterilization/distribution studies were visually inspected.
