---
id: glsearch
short_title: GLSearch
title: 'GLSearch: Maximum Common Subgraph Detection via Learning to Search'
authors:
- Yunsheng Bai
- Derek Xu
- Yizhou Sun
- Wei Wang
year: 2021
date: '2021-07-01'
publication:
  date: '2021-07-01'
  source_url: https://proceedings.mlr.press/v139/bai21e.html
venue: ICML
paper_url: https://proceedings.mlr.press/v139/bai21e.html
institutions:
- University of California, Los Angeles
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Matching
problems:
- Maximum Common Subgraph
summary: An afterstate GAT value model guides feasible connected induced-MCS search with curriculum training and
  promise-based backtracking.
code_url: https://github.com/DerekQXu/GLSearch
---

# GLSearch: Maximum Common Subgraph Detection via Learning to Search

> **TL;DR:** A GAT-based afterstate value model orders feasible node-pair expansions in branch-and-bound for connected, node-induced common subgraphs, with search-derived pretraining, MCSP-guided exploration and promise-based backtracking.

## Motivation

Exact maximum-common-subgraph search can spend its finite budget exploring branches that lead to small incumbents. Degree ordering and per-instance shallow reward updates need not favor a large common subgraph early. GLSearch learns an expansion order across training graph pairs while retaining a search environment that enforces induced isomorphism and node-label compatibility (Sections1-2).

## Contributions

- A neural search policy targets common-subgraph size through unit rewards, rather than directly rewarding reduction of a search-space upper bound.
- An afterstate reformulation Q(s,a)=1+gamma*V(s') uses graph, selected-subgraph and bidomain embeddings to reflect the consequences of a candidate match.
- Exhaustive small-instance supervision, MCSP imitation and subsequent DQN exploration are combined with a four-stage graph curriculum.
- A promise queue revisits states with large remaining action spaces when the incumbent stagnates; finite-budget tests extend to sampled million-node road-network pairs.

## Methodology

**Task and search.** The paper seeks a maximum-cardinality connected node-induced common subgraph. Mapped node labels must agree, and every edge/nonedge between matched nodes must correspond. Bidomains group unmatched nodes according to adjacency to the current mapping. Extension within compatible connected bidomains preserves induced isomorphism/connectivity; the initial empty state permits starting pairs. The upper bound adds the current matched size to the sum over bidomains of min(left size,right size). An admissible upper bound prunes states unable to improve the incumbent. Complete unrestricted enumeration can certify the maximum; the reported budgeted output is only a feasible lower bound on its size (Sections2-3/Algorithm1; supplementC).

**Neural policy.** Three64-dimensional GAT layers encode local degree-profile features once per input graph and cache them during search. Sum-plus-MLP readouts form whole-graph, matched-subgraph and bidomain vectors. A shared one-dimensional convolution followed by elementwise max across the two graphs and an MLP gives a commutative interaction. Nonlinear readout/interaction matters because pure sums would erase bidomain partitioning. Four32-dimensional components enter a seven-layer value MLP; evaluating the next state factors out the constant immediate reward of one. This is a learned estimate of future solution growth, not an exact value oracle (Sections3.1-3.2; supplementB.3).

**Training and backtracking.** Four curricula each contain120 real/synthetic pairs of increasing difficulty, with2,500 iterations per curriculum. The first1,250 total iterations use complete unpruned search and longest-path targets on small graphs. The next2,500 collect MCSP-guided sequences with Bellman targets; the last6,250 use the learned epsilon-greedy policy. Gamma=1, replay capacity1,024, transition batch32, target synchronization100 iterations and epsilon0.1 decaying to0.01 are specified. Thus the method is not entirely free of exact-solver supervision: it explicitly uses it in pretraining (Section3.3; supplementB-C).

A parallel priority queue ranks saved states by action-space size. If the best solution has not improved for three iterations, search can pop the most promising saved state rather than the stack top. Large action spaces are also screened: select one small bidomain and up to20 high-degree nodes per side; the scaled version uses three. These caps are substantive algorithm settings, not implied by the admissible size bound. SupplementC.7 gives O(Nd^2*(|V|-|Vs|)) per search iteration after cached graph encoding, while worst-case complete search remains exponential.

## Experiments

**Protocols and references.** Seven medium datasets comprise six50-pair synthetic sets (BA/ER/WS at50/100 nodes) and100 NCI109 molecule pairs averaging28.73 nodes. Eight large datasets each contain only one pair: roads, DBpedia variants, email, co-purchase, labeled circuits and PPI. Their smaller graph sizes range652-4,275. Two additional sampled road-network pairs have978,513 and1,080,909 nodes per graph. Medium/large budgets are500/7,500 search iterations; the million-node comparison is50 minutes. Ratios in Tables2-4 divide average/found size by the best size among the compared methods, not a known optimum (Section4; supplementA/D).

The main model has ratio1.0 on all seven medium and eight large datasets under those budgets. Large-pair common-subgraph sizes are131,508,482,521,543,791,3,515 and404 respectively. These are observed feasible sizes. In the constructed common-core tests at ten minutes, GLSearch still misses known lower bounds on ROAD-ss,188 versus222, and DBZH-ss,350 versus381. Even the isomorphic CIRC pair has4,275 nodes but the main result matches only3,515 (Tables2-3; supplementE.3/Table6).

**Negative ablations.** Full GLSearch is not best in every ablation row: main Table4 gives its ROAD/COPR/CIRC ratios0.992/0.990/0.881 relative to132/799/3,989, with simplified variants reaching the respective best values. SupplementTable4's no-supervision variant is better on dense ENRO/HPPI and other entries; the complete training recipe is not uniformly necessary. SupplementTable5 isolates promise search and reports improvements on four datasets, ties on four. Row labels/settings and normalization differ across these tables, so their numbers should not be combined into a single universal score (Section4.5; supplementE.2).

**Time and implementation conditions.** Search iteration counts are matched, but neural iterations cost more. SupplementTable3 reports8.132ms versus2.040ms for MCSP on ROAD, and60.509ms versus0.498ms on HPPI; plotted time trajectories nevertheless show larger final incumbents within the selected budgets. The authors port the C++ baselines to a common iterative Python framework and modify image-matching backbones/losses for MCS. This is evidence about these adapted implementations, not a direct speed comparison against all optimized original releases. Hardware is an i7-6800K and one Nvidia Titan GPU. Adam learning rate0.001 and10,000 training iterations are used; no complete offline training-time account is supplied (Section4; supplementC/D/E).

Million-node tests use GLSearch-SCAL with16-dimensional instead of64-dimensional GAT embeddings and smaller action screening. Dense-matching baselines encounter memory errors there. This demonstrates feasible partial matching on those road-network pairs, not an exact million-node MCS certificate or unchanged64-dimensional checkpoint transfer. The visual snapshots illustrate partial solutions; node-layout/color choices are explained in supplementE/G.

## Limitations

### Discussed in the Paper

Finite budgets can miss larger solutions, and a baseline could improve with more search. Per-iteration neural overhead, large candidate spaces and limited interpretability remain. Current chemical MCS constraints can be insufficient for chemistry-specific validity. Weighted/directed/approximate/disconnected variants, clique detection and additional constrained tasks are proposed extensions rather than evaluated capabilities (Section6; supplementC/E/F/G).

### Curator Notes

Feasibility comes from bidomain/label checks, whereas learned value quality affects search order. The exactness statement belongs to an exhaustive complete search; neither neural values, finite budgets nor the stated candidate screening alone prove completeness or optimality. Shared training across graph domains remains one native MCS task, so this is a specialist solver under the repository's classification criterion.

The author release confirms top-bidomain/high-degree screening, saved-state backtracking and a separate scalable implementation. It depends on externally hosted preprocessed data and configured checkpoint paths. No training or benchmark was rerun. Claims about speed should preserve Python baseline adaptation, GPU/CPU conditions and distinct iteration/wall-clock budgets.

## Reproducibility

- **Publication:** [ICML2021/PMLR139](https://proceedings.mlr.press/v139/bai21e.html), pages588-598. Publisher HTML and source issued metadata give July1,2021, distinct from July18-24 conference dates. Bai and Xu are equal contributors; all four authors are at UCLA in the paper.
- **Scientific coverage:** all eleven [main PDF](https://proceedings.mlr.press/v139/bai21e/bai21e.pdf) pages and all twenty-seven [publisher supplement](https://proceedings.mlr.press/v139/bai21e/bai21e-supp.pdf) pages, including curricula, search details, ablations, plots, all qualitative pages and both bibliographies. Both source identities/versions were checked against the publisher links. No other scientific attachment is listed.
- **Implementation:** [author GLSearch repository](https://github.com/DerekQXu/GLSearch). Full archive inventory, README, action-screening/search/state code and configuration inspected; the README supplies Docker setup and an external data folder. No extra scientific PDF was present in the code archive.
- **Relations:** four exact current-catalogue works are explicitly cited in the body and bibliography: CIE, Learning Combinatorial Optimization Algorithms over Graphs, Gasse et al.'s GCNN branching, and Bello et al.'s Neural Combinatorial Optimization. Other graph-matching references were not converted into edges to different papers sharing an acronym or author.
