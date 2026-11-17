---
id: drhg
short_title: DRHG
title: Destroy and Repair Using Hyper-Graphs for Routing
authors:
- Ke Li
- Fei Liu
- Zhenkun Wang
- Qingfu Zhang
year: 2025
date: 2025-02-22
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/34018
arxiv_url: https://arxiv.org/abs/2502.16170
code_url: https://github.com/CIAM-Group/DRHG
institutions:
- Southern University of Science and Technology
- City University of Hong Kong
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: DRHG uses heuristic destruction and supervised neural repair of an incumbent, representing intact route segments by paired endpoints so only isolated nodes and segment endpoints are decoded.
figure:
  path: paper-assets/drhg/framework.png
  alt: DRHG trains a supervised repair model on reduced optimal tours, then repeatedly reduces, repairs and restores an incumbent during testing.
  caption: 'Figure 1: Supervised training and iterative destroy-repair evaluation.'
  source_url: https://arxiv.org/pdf/2502.16170v1#page=2
publication:
  date: '2025-04-11'
  source_url: https://doi.org/10.1609/aaai.v39i17.34018
---
# Destroy and Repair Using Hyper-Graphs for Routing

> **TL;DR:** DRHG destroys an incumbent using a **handcrafted clustering rule**, compresses intact segments into endpoint pairs, and learns to reconnect the reduced problem with **supervised repair**. It does not learn a destroy policy or use a hypergraph neural encoder. Strong TSP results, particularly after large-instance fine-tuning, coexist with much weaker CVRP benchmark transfer.

## Motivation

Reconstructing one contiguous tour segment can miss useful reconnections between spatially close nodes that are far apart in the current route order. DRHG permits destruction across several segments, while preserving intact segments and reducing the model input to isolated nodes and segment endpoints. This enlarges the repair neighborhood without encoding every interior node at each repair. [Sections1-3.](https://arxiv.org/pdf/2502.16170v1#page=3)

## Contributions

- A destroy-repair framework reduces intact segments to fixed directed hyper-edges, solves a smaller endpoint problem, then restores the full tour.
- A supervised neural repair policy uses a linear encoder and a heavy decoder with representative-node attention.
- A sample-size-alignment procedure gives equally sized reduced graphs within a training batch despite variable segment structure.
- Evaluates1000-iteration TSP/CVRP search, matched-time small-TSP comparisons, fine-tuning and public routing benchmarks. [Sections3-4 and AppendicesA-B.](https://arxiv.org/pdf/2502.16170v1#page=4)

## Methodology

### Destruction and endpoint reduction

Start with a **complete solution**, using random insertion for TSP or sweep for CVRP. Choose a cluster and destroy nearby connections. Every intact segment is fixed during repair; remove its interior nodes from the neural input and retain both endpoints. Each endpoint feature contains its own coordinates, its partner endpoint's coordinates and an endpoint/isolated-node flag. An isolated node repeats its own coordinates. This representation gives both segment orientations without explicitly enumerating all orientation combinations. [Sections3.1-3.2.](https://arxiv.org/pdf/2502.16170v1#page=3)

For CVRP, cut **all depot-adjacent edges** as well, and add demand features: individual demand for an isolated node and aggregated segment demand for an endpoint. Capacity feasibility must respect these aggregate demands. Once one endpoint is selected during repair, its paired endpoint **must be next**; this is a forced constraint, not a learned decision. The corresponding forced-transition gradients are masked during training. The authors explicitly discuss why directly using a hypergraph neural network would be awkward, and instead use paired endpoint features. [Equations1-5 and Section3.4.](https://arxiv.org/pdf/2502.16170v1#page=3)

### Neural repair and supervision

A **single linear layer** projects input features to width128. The heavy decoder processes first/current/unselected-node embeddings through **six linear-attention modules**, with eight heads, representative-node channels and feed-forward width512. Each module aggregates node information into a fixed representative set, then broadcasts it back to the nodes; a linear projection/mask/softmax predicts the next selected node. This is attention on the reduced representation, rather than a learned high-order hypergraph convolution. [Section3.3 and AppendixA, Equations6-12.](https://arxiv.org/pdf/2502.16170v1#page=4)

Training destroys labeled complete tours and minimizes repair cross entropy; **no reinforcement learning or learned destroy selector** is introduced. Clustering destruction and coordinate transformations encourage similar reduced-problem distributions across scales. AppendixB sorts nodes by distance to a destruction center, computes how first/second-order route connections change the reduced node count, and takes cumulative counts to target a fixed batch input size. Samples that cannot match the desired reduced size are discarded. [Section3.4, AppendixB and Algorithm1.](https://arxiv.org/pdf/2502.16170v1#page=10)

TSP and CVRP have separate trained models. Core DRHG is **specialist, improvement**: neural reconnection changes an existing complete incumbent, while initialization uses an external heuristic. Test-time repair updates tours, with fixed neural weights. In the official TSP tester, a candidate is accepted only when its length improves by more than1e-6; this acceptance rule was checked in code rather than inferred from the schematic. [Official tester.](https://github.com/CIAM-Group/DRHG/blob/master/TSP/TSPTester.py)

## Experiments

### Training and inference budgets

Each task trains100epochs on **one million100-node labeled instances**. TSP large-scale **DRHG-FT** additionally fine-tunes20epochs on10000TSP1000 instances. That is a separately adapted checkpoint, not zero-shot transfer of the100-node model. Nominal batch size1024 becomes roughly800 after sample-size alignment; training reduced size is sampled in[20,.8n]. Adam starts at1e-4 with.97epoch decay. Training/evaluation use one **RTX3090 24GB**. [Section4.1.](https://arxiv.org/pdf/2502.16170v1#page=4)

Tests have10000instances at100nodes,128 at200-5000 and16 atTSP10000. Main DRHG uses **1000 destroy-repair iterations**, with k drawn from[20,min(1000,n)] for TSP and[20,min(200,n)] for CVRP. Reported times are **per instance**. Baselines include POMO with eight augmentations, BQ beam16, LEHD1000reconstructions and GLOP with additional revision; some heatmap/SIL/rewriter results are copied from original papers and therefore not measured under identical hardware. [Sections4.1-4.2 and Tables1-3.](https://arxiv.org/pdf/2502.16170v1#page=5)

TSP training/test labels use Concorde through1000 and LKH above1000; CVRP labels use HGS. However, the **printed CVRP comparison gaps are referenced to LKH rows**: HGS itself has negative gaps. Negative gaps denote beating that reference under the evaluation convention, not improving on a certified true optimum. Some public TSPLIB gaps are also negative, including tsp225 at-1.46%; distance/rounding/reference conventions need alignment before treating those numbers as exact optimality. [Tables1/3/6/7.](https://arxiv.org/pdf/2502.16170v1#page=6)

### TSP quality and time

| Setting | DRHG gap / per-instance time | DRHG-FT gap / time | Selected comparison |
| --- | --- | --- | --- |
| TSP100 | .000% rounded /2.73s | Not evaluated | LEHD.002% /1.04s |
| TSP500 | .111% /20.6s | Not evaluated | LEHD.167% /33.8s |
| TSP1000 | .45% /1.72min | .29% /1.66min | DIFUSCO1.17% /11.5s |
| TSP5000 | 2.05% /1.79min | .88% /1.82min | SIL1.84% /7.6min |
| TSP10000 | 3.46% /3.63min | 1.33% /3.70min | DIFUSCO2.58% /3min |

Large-scale headline superiority depends on **DRHG-FT**: unfine-tuned DRHG loses to SIL at5000 and DIFUSCO/SIL at10000. Figure3 records129nonoptimal TSP100 cases out of10000 after1000iterations; the rounded.000% mean gap does not mean every instance is solved optimally. [Table1/Figure3.](https://arxiv.org/pdf/2502.16170v1#page=7)

Matched-time Table2 is a separate protocol. At TSP100, DRHG loses to fast POMO at its budget,1.311% versus.134%; it also narrowly loses to BQ and LEHD. It improves all listed matched-time comparisons at200/500. Full1000-iteration quality therefore cannot be compared with a single very fast constructive rollout as though latency were equal. [Table2.](https://arxiv.org/pdf/2502.16170v1#page=6)

### CVRP and benchmark transfer

CVRP generalization is substantially weaker. At1000, DRHG has **7.66% LKH-reference gap in12.8s**, versus BQ2.88%/8.7s, LEHD.92%/202.5s and SIL-.76%/78.8s. HGS is stronger still at-2.16%/149.1s. At500, DRHG1.31% is worse than BQ1.01%, though it improves markedly on sweep initialization. The claim that all competitors are defeated does not extend to CVRP. [Table3.](https://arxiv.org/pdf/2502.16170v1#page=6)

TSPLIB aggregate DRHG gap is **.95%**, versus LEHD1.59%, with particularly strong larger-instance results. Individual losses remain, including d2103 at1.82% versus LEHD1.22%, lin318 at.30% versus.03%, and rd400 at.36% versus.02%. On usa13509, DRHG still has11.82% gap. Some baseline cases are out of memory; LEHD runs on rl11849/usa13509 were stopped at24hours. Appendix table headers say RRC100 while the discussion/main comparison specifies1000steps, so exact public-baseline budgets require caution. [Tables4/6/7 and AppendixC.](https://arxiv.org/pdf/2502.16170v1#page=11)

**CVRPLIB aggregate gap is11.49%, versus LEHD2.36% and BQ4.94%.** DRHG's Set-F mean is33.18% and Set-X14.78%; LEHD gives1.36% and3.69%. This is a material failure of the broad transfer narrative, even though DRHG improves on sweep and some weaker baselines. [Table5.](https://arxiv.org/pdf/2502.16170v1#page=7)

### Ablations

Training reduced sizes20-80 balance retained segments and repair difficulty, performing best across most larger tests;10-90 is slightly better atTSP100. Destruction degree is also important: without fine-tuning, limiting repair to20-200 gives2.85% atTSP10000, better than the main20-1000setting's3.46%. More destruction is therefore not always better. The visual demonstration reconnects three preserved segments and lowers one illustrated TSP100 tour from8.2294 to8.1062; it is a case study, not a success-rate estimate. [Tables8-9/Figure7 and AppendicesD-E.](https://arxiv.org/pdf/2502.16170v1#page=12)

## Limitations

### Reported by the Authors

- The CVRP implementation does not fully realize the method's potential; improving it and extending to other tasks remain future work.
- More sophisticated destruction methods beyond clustering are suggested for future work.
- Excessive destruction degrades repair quality when training is limited to small reduced problems. [Section5/AppendixD.](https://arxiv.org/pdf/2502.16170v1#page=7)

### Curator Notes

- The method requires solved-tour supervision, repeated search and an initial incumbent; fine-tuned large-TSP results include additional1000-node supervision.
- Condensed input reduces neural work, but destruction, sorting, restoration and1000iterations still contribute cost. Representative-node attention does not make the complete search constant-time.
- Strong TSP results coexist with poor CVRPLIB transfer, and larger reduced neighborhoods can reduce quality.
- Mixed source/hardware baselines, public OOM/24hour caps, negative reference gaps and inconsistent appendix headers limit claims of universal superiority or certified optimality. Table3's CVRP200 sweep objective is printed as.269, inconsistent with its scale/gap; it is not used as a reliable cost here.

## Reproducibility

- **Formal eligibility:** [AAAI2025](https://doi.org/10.1609/aaai.v39i17.34018), volume39/no17, pages18341-18349. Crossref records online publication11April2025. The generic conference-notification acceptance date was removed. Formal metadata and the official code cite **Zhenkun Wang**; the arXiv title page's **Zhengkun** spelling is recorded as a version discrepancy, not propagated into the formal author metadata. **City University of Hong Kong** was restored.
- **Actual full reading:** [arXiv2502.16170v1](https://arxiv.org/abs/2502.16170),22February2025, **all12pages including AppendicesA-E**. The publisher landing/PDF was manually attempted but blocked; user-authorized arXiv reading supplies the scientific text. No byte-identity assertion is made for the inaccessible formal file.
- **Scientific material/code:** the official master tree has70members and no additional PDF/ZIP appendix; full scientific appendices are integrated into the read preprint. [CIAM-Group/DRHG](https://github.com/CIAM-Group/DRHG) README documents separate TSP/CVRP directories, training data shared with LEHD, separate fine-tuning data, test data and commands. The TSP tester's incumbent acceptance branch was checked. No training run or numerical reproduction was performed.
- **Figure:** original Figure1, PDFpage2, showing separate supervised training and incumbent-update testing paths. The endpoint representation, linear-attention module, all main/appendix tables and destruction diagrams were visually checked.
