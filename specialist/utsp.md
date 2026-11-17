---
id: utsp
short_title: UTSP
title: Unsupervised Learning for Solving the Travelling Salesman Problem
authors:
- Yimeng Min
- Yiwei Bai
- Carla P. Gomes
year: 2023
date: '2023-03-19'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/93b8618a9061f8a55825c13ecf28392b-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2303.10538
institutions:
- Cornell University
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: UTSP learns a soft city-position assignment without tour labels, transforms it into an edge heatmap, and
  guides k-opt improvement of complete TSP tours.
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/93b8618a9061f8a55825c13ecf28392b-Abstract-Conference.html
code_url: https://github.com/yimengmin/UTSP
figure:
  path: paper-assets/utsp/framework.png
  alt: Coordinates are mapped to soft city-position assignment T and transformed into edge heatmap H.
  caption: 'Figure 1: Soft-indicator to heatmap transformation; the cycle illustration assumes an exact permutation.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=3
---

# Unsupervised Learning for Solving the Travelling Salesman Problem

> **TL;DR:** UTSP learns a soft city-position assignment without optimal-tour labels, transforms it into an edge heatmap, and guides k-opt improvement of complete TSP tours. The continuous loss does not guarantee a valid or optimal decoded cycle.

## Motivation

Supervised heatmaps need expensive tour labels, and policy-gradient training often relies on rewards available after completing a route. UTSP instead optimizes a differentiable objective directly on the network output. A discrete search still produces the final feasible solution, so label-free training and search-free solving are distinct claims. [Sections 1-2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=1)

## Contributions

- A Scattering Attention GNN (SAG), combining low-pass and band-pass channels, produces a soft assignment rather than independent tour edges.
- A cyclic transformation maps the assignment to a heatmap. It represents a single Hamiltonian cycle **if** the assignment is an exact permutation.
- A differentiable loss combines row constraints, self-loop discouragement and weighted tour distance without labelled training solutions.
- Experiments measure small training sets, expressive representations, candidate-edge coverage and heatmap-guided local search. [Sections 3-6 and Appendix D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=2)

## Methodology

### Soft assignment and surrogate loss

Coordinates and Euclidean distances D give weighted adjacency `W[i,j]=exp(-D[i,j]/temperature)`. SAG outputs an n-by-n matrix; **column-wise** softmax gives T, whose columns are soft city choices at tour positions. If p_t is column t, `H=sum_t p_t*p_(t+1)^T`, including the closing n-to-one term. Equivalently `H=T*V*T^T` for cyclic shift V. T and H therefore have different meanings. [Sections 3.1-3.3 and Appendix A.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=2)

The loss penalizes squared deviations of T's row sums from one, adds a penalty on H's diagonal, and minimizes the distance-weighted sum of H. Column normalization is exact; row normalization and self-loop suppression are encouraged by penalties. Appendix D proves the cycle result only when each row and column of T contains exactly one one. A general doubly stochastic **soft** T does not satisfy that condition. The procedure does not certify integrality, feasibility or optimality. The authors explicitly state that surrogate loss is not theoretically guaranteed to measure final solution quality. [Equation 2, Section 6 and Appendix D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=4)

Top-M off-diagonal entries per row define candidates, and symmetrization forms an undirected candidate set. Pruning can remove optimal-tour edges; it is a learned search-space reduction, not an exact elimination rule. [Section 3.5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=4)

### Best-first incumbent search

Each search node is a **complete TSP tour**. Start from a random tour improved by 2-opt. Stochastic sequential k-opt removes and adds edges guided by the heatmap. Close a move when it improves the tour, or abandon it at maximum depth K. Candidate cities come from heatmap scores or nearest neighbors. Try up to T expansion actions per current tour and choose the best improvement; if none is found, restart from a new random solution. K and the candidate-set source are randomized across rounds. [Sections 4.1/4.3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=5)

The proposal score combines heatmap weight with a visit-count bonus, but the main settings use **alpha=0**, leaving the heatmap term. Successful moves increase weights of added edges with coefficient beta. This changes the **instance heatmap**, not neural parameters. For sizes 100/200/500/1000, Table 4 gives M=8/8/5/5, random K in [5,35)/[10,90)/[30,130)/[10,110), and T=300/600/1000/2000 attempts per search node. Beta is 10 at 100/200 and 50 at 500/1000. These attempt/depth settings differ from a global time limit. [Section 4.2 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=13)

## Experiments

### Training and benchmark protocol

There are **2000 unlabelled training and 1000 validation instances per size**, with separate models at 20/50/100/200/500/1000. Tests contain 10000 instances at 20/50/100 and 128 at each larger size. Main results use size-specific training, not zero-shot transfer across sizes. TSP100 uses a two-layer, width-64 SAG with **44392 parameters** and about 30 minutes of V100 training. The roughly 0.2% data and 10% parameter claims compare with selected million-sample/larger-network baselines; they are not universal ratios. [Section 5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=5)

Adam training runs on V100. UTSP and rerun Att-GCRN search use the same Intel Xeon Gold 6326 environment. Other baseline times are imported and described by the authors as indicative. UTSP results average four random seeds; times below cover the **whole test set** and separate heatmap inference from search. [Section 5.2 and Appendix C.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=7)

| Size | UTSP cost / reported reference gap | Heatmap + search time | Comparison |
| --- | --- | --- | --- |
| 200 | 10.7289 / 0.0918% | 0.56 + 1.11 min | Att-GCRN 0.1563%; 20.62 s + 1.33 min |
| 500 | 16.6846 / 0.8394% | 1.37 + 1.33 min | DIFUSCO 0.46%; 10.13 min |
| 1000 | 23.3903 / 1.1770% | 3.35 + 2.67 min | DIFUSCO 1.17%; 24.47 min |

The standard size-500 budget has a larger gap than DIFUSCO. Longer UTSP search gives **0.42% at 1.37 + 8.32 minutes**. Size-1000 quality is approximately comparable to the listed DIFUSCO mean rather than strictly better. Imported hardware/times prevent treating every row as a controlled speed comparison. [Tables 2-3 and footnote 2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=7)

The tables contain negative gaps against nominal Concorde references; the small-instance prose attributes negative values to rounding. Some larger-instance Gurobi costs also fall below the listed Concorde costs. These references must not be interpreted as proof of beating the true optimum. This note preserves the reported comparison without claiming certified optimality. Small-instance prose and tables also differ in the decimal scale of some negative percentages. [Tables 1-3 and Section 5.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=6)

### Representation and edge coverage

With the same loss, SAG gives lower training/validation losses than a low-pass GCN and more differentiated heatmaps in the illustrated instance. On 1000 size-100 validation cases with M=10, after 100 epochs SAG covers **99.756%** of reference edges on average, but fully covers a reference tour in only **780/1000** cases. Its mean candidate set contains 583.134 edges versus 4950 possible undirected edges; GCN gives 33.893% overlap and no fully covered cases. Average edge recall is not the probability of retaining a whole optimal tour. Ground-truth tours support this evaluation, although they are not used in the training loss. [Sections 5.3/6 and Figures 2-4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=8)

## Limitations

### Reported by the Authors

- No theorem guarantees that lower surrogate loss means a better final solution.
- More expressive GNNs, edge features and alternative losses are future directions. [Sections 6-7.](https://proceedings.neurips.cc/paper_files/paper/2023/file/93b8618a9061f8a55825c13ecf28392b-Paper-Conference.pdf#page=10)

### Curator Notes

- **Specialist / improvement:** separate TSP models guide incumbent k-opt search from classical initial tours. The old constructive label obscured the actual inference mechanism.
- The permutation theorem applies to ideal discrete T, not every soft output; discrete search remains necessary.
- Pruning loses at least one reference edge in a nontrivial fraction of cases; restarts and depth affect quality/compute.
- Training at several sizes does not demonstrate broad distribution/size transfer. Negative reference gaps and imported runtimes need qualification.

## Reproducibility

- **Reading:** all 15 pages of the formal NeurIPS PDF were reread, including Appendices A-D, the full proof and all search settings. Manual publisher-page inspection shows the integrated paper and no separate scientific attachment; every referenced appendix is present. [Publisher record.](https://proceedings.neurips.cc/paper_files/paper/2023/hash/93b8618a9061f8a55825c13ecf28392b-Abstract-Conference.html)
- **Metadata:** three authors are at Cornell; formal publication is NeurIPS 2023, and arXiv first submission is 19 March 2023. ArXiv v2 (10 April 2024) is described as camera-ready with appendix typo fixes; results here follow the actually read formal PDF. Generic conference notification-day acceptance metadata was removed.
- **Implementation:** [yimengmin/UTSP](https://github.com/yimengmin/UTSP) is the author repository, correcting the old unconfirmed-code statement. Its full README was read: size-specific training/heatmap commands, checkpoints, inherited C++ search, candidate-count/header configuration and a separate time parameter are documented. Some current examples differ from Table 4; paper settings and code examples should not be silently interchanged. Experiments were not rerun.
- **Image:** Figure 1 is cropped from formal p. 3 with the soft assignment, transformed heatmap and route examples. Loss/transformation equations, candidate coverage, result tables and every proof diagram were visually inspected.
