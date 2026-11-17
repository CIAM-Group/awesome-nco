---
id: rbg
short_title: RBG
title: 'RBG: Hierarchically Solving Large-Scale Routing Problems in Logistic Systems via Reinforcement Learning'
authors:
- Zefang Zong
- Hansen Wang
- Jingwei Wang
- Meng Zheng
- Yong Li
year: 2022
date: '2022-08-14'
venue: KDD
paper_url: https://doi.org/10.1145/3534678.3539037
institutions:
- Tsinghua University
- Beijing Tsingroc Co. Ltd
- Hitachi (China) Research & Development Corporation
figure:
  path: paper-assets/rbg/framework.png
  alt: RBG initializes a partition and regional solutions, then repeatedly repartitions whole routes, merges selected region pairs and regenerates local solutions.
  caption: 'Figure 2: Five-step workflow; steps3-5 form incumbent improvement.'
  source_url: https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=5
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Capacitated Vehicle Routing Problem with Time Windows
- Capacitated Vehicle Routing Problem with Mixed Delivery and Pickup
summary: RBG learns which incumbent route regions to merge and regenerate with an AM, LKH or HGS subsolver, repartitioning on whole routes and retaining only cost-improving replacements.
publication:
  date: '2022-08-14'
  source_url: https://doi.org/10.1145/3534678.3539037
---
# RBG: Hierarchically Solving Large-Scale Routing Problems in Logistic Systems via Reinforcement Learning

> **TL;DR:** Rewriting-by-Generating (RBG) learns to select pairs of regions in a **complete incumbent routing solution**, merges them, solves their combined subproblem, and accepts improving replacements. AM, LKH or HGS can be the regional generator. The strongest reported CVRP variant is RBG-HGS; the framework was deployed for two logistics tasks, while alternative methods were replayed offline.

## Motivation

Small routing subproblems are easier to solve, but a fixed partition prevents routes from combining useful customers across its boundaries. RBG improves the partition and its existing routes together, using a learned region-pair selector to allocate expensive subsolver calls. It does not learn every hierarchical operation: initialization, route-preserving partitioning and the generator remain explicitly specified components. [Sections1/4.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=2)

## Contributions

- A hierarchical merge-regenerate-repartition search changes the regional decomposition of an incumbent solution.
- A learned route/region encoder and partner-selection policy choose which nearby regions to combine.
- The same framework accepts a neural AM generator or classical LKH/HGS generators; this is modularity, not evidence that one neural checkpoint solves every VRP variant.
- Evaluates500/1000/2000-customer CVRP, two constraint variants, shifted customer distributions and a Guangdong logistics deployment. [Sections4-6.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=3)

## Methodology

### Initialization and regional solving

Cluster customers into K=ceil(N/Ns) initial hyper-regions, where Ns is a suitable subsolver size. K-means uses a weighted combination of Euclidean and depot-centered polar distance; the paper uses beta=.09 and10 initialization iterations. Include the depot in every local problem. Obtain a complete feasible global solution by solving every initial region with the selected AM/LKH/HGS generator. [Sections4.2-4.3 and AppendixA.1.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=4)

### Rewriting the incumbent

1. **Partition on whole routes.** Represent routes by customer spatial centers, project those centers onto one PCA dimension, then split a hyper-region's routes into two groups with similar customer counts. Existing routes remain unchanged; this split alone does not change total cost.
2. **Encode and select.** Feed each route's coordinate/demand sequence through a learned MLP and LSTM. Average route representations within a region and apply a fully connected layer, obtaining width100 regional features. Given one region, choose its partner using softmax of feature dot products, restricted to its5/8/9 nearest regions at500/1000/2000.
3. **Merge and regenerate.** Combine the two regions and run the selected subsolver on their union. Replace their incumbent routes **only if total cost improves**; otherwise reject both the proposed partition/solution update. Repeat partition-select-merge-generate. [Sections4.4-4.5, Equations6-11 and Figure2.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=5)

The reward is old pair cost minus regenerated cost. REINFORCE trains the rewriter using a running-average reward baseline, with SGD learning rate.001 and baseline update parameter.99. Training has50epochs of100instances,10 rewriting steps per instance and random rotations around the depot. Validation uses20samples after each epoch; evaluation uses100 rewriting steps. AppendixA.1 specifies one **RTX2080Ti**; CPU model and detailed local-solver search limits are not fully given. [AppendixA.1.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=10)

**Specialist, improvement:** the newly learned core selects rewrites of an already complete incumbent. Initial construction uses existing pluggable solvers; the strongest main configuration and deployed version use classical HGS. The work does not propose a separately learned new constructor alongside its rewriter. Separate models are trained for size/settings, and replacing the generator for CVRPTW/CVRPMDP does not establish shared neural weights across tasks. Inference changes regions/routes, without reported test-time neural-weight optimization.

## Experiments

### Data and protocol

Synthetic locations are uniform in the unit square with a central depot, demands1-9 and vehicle capacity50. The historical Beijing dataset samples locations from a week of orders in June2020, but **demands are still synthetically sampled1-9**; distances come from a GIS platform. Both evaluate500/1000/2000customers. Main Section5.1 says the synthetic test set has1000instances per scale, while AppendixA.1 says reported evaluation averages100instances; the publication does not reconcile these statements. [Section5.1 and AppendixA.1.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=6)

The main metric is mean total routing cost, with **mean seconds per instance**, unlike whole-test-set runtime in many routing papers. LKH time separates preprocessing from subsequent search. Comparisons include HGS, LKH, OR-Tools, ACO, AM, NeuroRewriter, L2I and Learning to Delegate; their printed budgets differ, and AM rows omit runtime. No exact global optimum is supplied for these large cases. [Tables1-2.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=6)

### Main results and tradeoffs

| Dataset/scale | HGS cost / time | RBG-HGS cost / time | RBG-AM cost / time |
| --- | --- | --- | --- |
| Synthetic500 |49.18 /15s |49.13 /15s |51.23 /7s |
| Synthetic1000 |92.82 /61s |91.74 /59s |95.96 /15s |
| Synthetic2000 |177.20 /180s |174.50 /90s |181.43 /30s |
| Historical2000 |178.81 /120s |174.87 /88s |180.99 /30s |

RBG-HGS gives the best listed costs at all these scales; at synthetic2000 its cost is about1.52% below HGS with half the listed time. On the historical2000 set it is about1.66% below the best non-RBG listed competitor, L2D177.83. RBG-AM is faster but materially worse in cost. The paper's roughly80x comparison to LKH's40-minute search at2000 refers to RBG-AM's30seconds, **not matched solution quality**:181.43 versus LKH178.23. [Tables1-2.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=7)

RBG-LKH is slightly worse than plain LKH on500-customer synthetic and historical cases, while improving larger cases. Thus framework modularity does not mean every generator configuration wins at every scale.

### Constraints, distributions and ablations

For **CVRPTW**, windows are generated around sampled centers with half-widths.1-1. For **CVRPMDP**, half the customers have pickups and half deliveries, with demands1-9 and capacity25. Only RBG-LKH is evaluated for these variants, alongside LKH and L2D. At2000, its costs are210.85 versus212.15/213.62 for CVRPTW and191.79 versus196.72/193.00 for mixed delivery/pickup. At CVRPTW500 it loses to LKH,63.48 versus62.84. No experiment establishes universal transfer across arbitrary practical constraints. [Table3/Section5.3.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=7)

Four distribution tests vary depot position and clustered/random customers, while the evaluated policy is trained on central-depot uniform data. Costs generally decrease over rewriting steps. However, Section5.4 identifies the clustered setting as the remaining loss, whereas **Figure4's legend assigns the above-LKH curve to random-depot/random-customer**; this labeling/narrative conflict prevents confidently attributing that exception to one distribution. The plot is iteration-based, not a wall-time convergence comparison. [Figure4 and AppendixA.5.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=8)

Reallocation and acceptance rates decline along with cost in the reported search traces, supporting useful incumbent rewriting, without proving convergence to a global optimum. The initialization-distance ablation varies gamma=beta/(1-beta); tested normalized costs vary by at most about.25%, with gamma.1 selected. [Figures7-8 and AppendixA.2-A.3.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=10)

### Deployment evidence

Only **RBG-HGS** was run online; all alternatives were evaluated afterward on the same collected data. There are two daily tasks,500 and700customers, and the700task uses policies trained at500 or1000. For500, RBG-HGS has cost31.84 in14s versus HGS31.85 in60s; for700, it has39.44/39.46 in21s versus39.48 in90s. These are small cost differences with lower listed runtime. They are not a randomized online A/B study or evidence of measured driver/customer outcomes. [Section6/Table4.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=8)

## Limitations

### Reported by the Authors

- Global quality depends on regional divisions and generator capability;500-customer RBG-LKH and CVRPTW500 show losses to LKH.
- The distribution study has an exception, and variant support requires an appropriate regional solver.
- Cross-size deployment uses a policy trained at a nearby scale; exhaustive coverage of operational scales is not claimed. [Sections5-6.](https://fi.ee.tsinghua.edu.cn/public/publications/6910245c-644d-11ee-84fe-0242ac120002.pdf#page=7)

### Curator Notes

- Acceptance preserves nonincreasing incumbent cost, but a local merge neighborhood and fixed100-step search do not certify optimality.
- Full generator settings, CPU timing details, test-set averaging count and Figure4's exception label remain incompletely specified or internally inconsistent in the publication.
- Historical customer coordinates plus synthetic demands, and two replay-compared deployment tasks, support narrower conclusions than broad real-world superiority.
- No author-maintained public implementation/checkpoint was confirmed. This differs from asserting that none exists anywhere.

## Reproducibility

- **Formal publication/full text:** [KDD2022/ACM](https://doi.org/10.1145/3534678.3539037), pages4648-4658. The author-hosted **formal11-page ACM article including AppendicesA.1-A.5** was fully reread; title/DOI, five authors and three affiliations match. ACM/Crossref record publication **14August2022**;12August is DOI-record creation, so the previous date was corrected. The generic conference acceptance date was removed.
- **Scientific material:** complete appendix contains training, analysis and visualizations; no separate scientific material is explicitly referenced. ACM landing was manually attempted and returned403; the publisher/Crossref record and author-lab publication entry were checked. The lab entry links only this PDF, with no code/supplement link. No inaccessible ACM attachment is claimed to have been inspected.
- **Implementation:** [FIB-LAB publication listing](https://fi.ee.tsinghua.edu.cn/publications/) confirms the author-provided PDF but supplies no RBG code. Exact-title/DOI repository searches did not confirm an official release; reproduction would require implementation or author contact, with unresolved run settings kept explicit.
- **Figure:** original Figure2, PDFpage5, retains the initialization and steps3-5 rewriting loop. Equations and all tables/appendix figures were visually checked.
