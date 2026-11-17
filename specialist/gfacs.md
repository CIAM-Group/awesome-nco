---
id: gfacs
short_title: GFACS
title: Ant Colony Sampling with GFlowNets for Combinatorial Optimization
authors:
- Minsu Kim
- Sanghyeok Choi
- Hyeonah Kim
- Jiwoo Son
- Jinkyoo Park
- Yoshua Bengio
year: 2025
date: 2024-03-11
venue: AISTATS
paper_url: https://proceedings.mlr.press/v258/kim25a.html
arxiv_url: https://arxiv.org/abs/2403.07041
code_url: https://github.com/ai4co/gfacs
institutions:
- KAIST
- Mila
- Université de Montréal
- Omelet
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
- Scheduling
- Packing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Capacitated Vehicle Routing Problem with Time Windows
- Prize-Collecting Traveling Salesman Problem
- Orienteering Problem
- Single Machine Total Weighted Tardiness
- Bin Packing
summary: Off-policy trajectory-balance training learns diverse instance-conditioned heuristics for ACO, using local-search experiences and reshaped energies; task-specific construction and learned perturbation/repair depend on explicit search budgets, with no guaranteed dominance over RL.
figure:
  path: paper-assets/gfacs/framework.png
  alt: A pretrained GNN produces a fixed heuristic matrix; ants construct solutions from heuristic times pheromone weights and update the pheromone trails.
  caption: 'Figure 2: GFlowNet-trained heuristic prediction and ACO solution sampling.'
  source_url: https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=3
inclusion: reference
inclusion_reason: AISTATS is outside the approved main-conference and journal inclusion list.
publication:
  date: '2025-04-23'
  source_url: https://proceedings.mlr.press/v258/kim25a.html
---
# Ant Colony Sampling with GFlowNets for Combinatorial Optimization

> **TL;DR:** Train an instance-conditioned GFlowNet to supply a diverse heuristic prior, then combine it with pheromone-guided ant sampling and local search. Off-policy local-search examples, energy reshaping and per-instance normalization improve the learned prior. The strongest results depend on subsequent local search; **removing it can make GFACS worse than DeepACO**. This entry retains its existing reference-tier inclusion.

## Motivation

A reward-maximizing RL heuristic can concentrate on a narrow set of candidates that leaves little room for later search. GFACS instead aims to learn multiple promising modes, so ACO and local search can exploit varied starting points. This is a learned prior for a search procedure, rather than a claim that a diverse one-pass sample is always better. [Sections1-3.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=1)

## Contributions

- A conditional GFlowNet heuristic prior coupled to ant-colony solution construction and pheromone updates.
- Off-policy training from both directly sampled and locally refined solutions.
- Energy reshaping that values a candidate partly by the quality achievable after local search.
- Per-instance energy centering and experiments across seven CO tasks, ACO variants, ablations and an alternative active-search integration. The paper explicitly states that it does not prove better optimality than its RL counterpart. [Sections3-6.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=4)

## Methodology

### Learned prior and ACO

An anisotropic edge-gated GNN predicts a nonnegative heuristic matrix eta(G). Ants construct feasible solutions autoregressively using transition probabilities proportional to **pheromone(i,j)*eta(i,j)** with task-specific feasibility masks. The GNN is fixed during ordinary ACO inference; pheromones change after each ant batch according to solution quality. “Prior” and “posterior” describe these successive search distributions, not a specified Bayesian likelihood model. [Equations2-6/Figure2.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=3)

For training, pheromones are fixed to1. The target reward is exp(-beta*energy), and trajectory balance fits the forward policy and an instance-conditioned log partition function. A uniform backward policy accounts for trajectories that represent the same solution: nondegenerate undirected TSP cycles have2N cyclic/reversal representations; CVRP routes admit route-order permutations and route reversals, with singleton-route exceptions. These symmetry counts require the stated problem assumptions and must not be applied indiscriminately to asymmetric/time-window variants. [Sections2.2/3.2/AppendixE.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=19)

The usual exact trajectory-balance result concerns zero loss over all trajectories for a specified reward. Here finite off-policy data, learned parameters and reshaped/centered rewards are used. That result does not certify that the trained prior exactly matches the original objective distribution or that finite ACO reaches an optimum.

### Off-policy experience and energy reshaping

For each graph, collect K model-generated solutions as an exploration batch and K locally improved solutions as an exploitation batch. A backward trajectory is sampled for each refined solution. The original solution's energy is replaced by **alpha*E(refined)+(1-alpha)*E(original)**, allowing an initially mediocre candidate to receive credit for its local-search potential. Alpha increases linearly from .5 to1 over training. [Figure3/Equation7.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=5)

Within each graph and experience type, subtract the batch mean energy. The exploration and exploitation batches are normalized separately, and their trajectory-balance losses receive equal weights. The paper uses compact partition-function notation; the released implementation uses **separate logZ outputs for the two experience streams**, consistent with their separately centered targets. Beta follows a task-specific log-shaped annealing schedule; it is shared across scales of the same task, not evidence of shared network weights. [Equations8-10/AppendixA.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=13)

### Search operators and classification

For TSP/CVRP/CVRPTW, the experiments use2-opt/Swap*/PyVRP granular search with a learned-heuristic perturbation scheme inherited from DeepACO. The current TSP implementation alternates2-opt on learned heuristic distances with2-opt on real distances, retaining improved true-cost incumbents. The remaining task branches use the paper's destroy-and-repair procedure: select a symmetry-equivalent incumbent trajectory, drop its suffix, reconstruct with the learned policy and an increasing inverse temperature, then retain top-K candidates for the next round. [AppendixC.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=15)

The **specialist / constructive-improvement** classification is retained because learned construction and substantive learned perturbation/repair of incumbents both occur in the actual solving framework. This is not based merely on pheromone adaptation or the presence of a classical local solver. Tasks and principal sizes are trained separately; one multi-task checkpoint is not demonstrated.

An additional active-search experiment is an alternative integration: sample20 solutions and make5 gradient updates per iteration for50 iterations on a test instance. This adapts neural parameters and is distinct from ordinary fixed-network ACO inference; it is not a mandatory extra stage of every main result. [Section5.5.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=9)

## Experiments

### Tasks, instances and objectives

The seven tasks are TSP, CVRP, CVRPTW, prize-collecting TSP, orienteering, single-machine total weighted tardiness and bin packing. Synthetic tests contain128 TSP instances and100 for other tasks. Most summary values average three independently trained seeds; Figure4 shading is the **min-max range**, not a confidence interval. [Section5.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=6)

TSP/CVRP coordinates are uniform in the unit square. CVRP demands are1-9 and capacity is **50 at200/500/1,000 customers**, unlike studies that scale capacity with N. OP100 has a distance-derived prize and route-length budget4. PCTSP100 uses minimum collected prize25, prizes uniform0-1 and penalties0-.12. Scheduling uses due dates uniform0-N, weights0-1 and durations0-2. BPP120 has item sizes20-100 and bin capacity150. [AppendixB.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=14)

The formal BPP objective is a **weighted sum of inverse bin utilizations**, rather than simply the number of bins. Its reported value51.8428 should therefore not be labeled a51.84-bin solution. CVRPTW generation is delegated to the referenced RL4CO generator; its exact training counts are not separately included in Table5, although beta settings are listed. No missing values are inferred from other tasks.

### Training and search budgets

GFACS uses the DeepACO edge-gated architecture plus partition outputs, AdamW and cosine annealing. Table5 counts **instances per epoch**, not mini-batches. TSP200/500 use50 epochs with400 instances per epoch, mini-batch20 and30 sampled solutions per instance. CVRP200/500 use50 epochs,200 instances, mini-batch10 and20 samples. For1,000-node tasks, a500-node checkpoint is fine-tuned for20 epochs, using200 TSP or100 CVRP instances, mini-batches10/5 and20/15 samples. The smaller OP/PCTSP/scheduling/BPP tasks use20 epochs,100 instances, mini-batch5 and30 samples. DeepACO is trained with the matching listed counts. [Table5.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=13)

Beta ranges include200-1,000 for TSP,500-2,000 for CVRP/CVRPTW and1,000-2,000 for BPP. Different tasks require different ranges; excessively high beta can harm both diversity and quality. Training uses an RTX A6000 with EPYC7542; runtime testing uses a separate RTX4070Ti/Ryzen5900X system. The paper reports short training, under three hours in its discussed comparison, but this is not a matched whole-project compute comparison against every baseline.

Figure4's prior comparison uses **100 ants and100 ACO iterations**. The main TSP/CVRP table instead uses **100 ants and10 iterations**, with local-search costs included. These are not interchangeable budgets. Reported main runtimes are average **per instance**; selected AM/POMO/DIMES/SO/Pointerformer numbers come from earlier publications, and EAS/SGBS have5/10-minute limits for500/1,000-node cases. [Sections5.1-5.2.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=7)

### Main routing and library results

| Setting | GFACS gap / time | DeepACO gap / time |
| --- | --- | --- |
| TSP500 |1.56% /15s |1.77% /15s |
| TSP1,000 |2.63% /66s |2.87% /66s |
| CVRP500 |1.95% /36s |2.43% /36s |
| CVRP1,000 |2.11% /1.3m |2.40% /1.3m |

TSP references are Concorde; CVRP uses PyVRP near-optimal solutions, not universally proven optima. LKH3/PyVRP obtain better displayed objectives with larger budgets, for example CVRP1,000 PyVRP119.29/1.4h versus GFACS121.80/1.3m. The evidence supports a tested quality/time tradeoff, not uniform dominance over classical solvers. [Table2.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=7)

Library evaluation selects separate200/500/1,000-node checkpoints for size ranges100-299/300-699/700-1,499. GFACS's TSPLIB mean gaps are1.21/2.60/3.88%; CVRPLIB X-instance groups give2.69/3.71/4.32%. **Vanilla ACO is better on the smallest CVRPLIB group**,2.50% versus2.69%, while GFACS is better in the larger groups. There are30/10/12 TSP and43/40/17 CVRP instances per group. Library per-instance times are separately reported in Table12, reaching77.0s for the largest TSP group and61.8s for the largest CVRP group. [Tables1/12.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=19)

### Dependence on local search and ablations

Table11 removes local search at test time from policies trained with it. At TSP500, GFACS's cost worsens from16.80 to21.72, while DeepACO without search gives18.83. Thus the diverse, reshaped prior is not a universally stronger standalone constructor. The paper explains that its training target intentionally values post-search potential. That table repeats a TSP500 column heading; the ambiguous column is not silently relabeled here. [AppendixD.6.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=18)

Removing shared energy normalization is the largest displayed ablation penalty: TSP500 cost16.8042 to17.5209, CVRP50064.1858 to65.5069 and BPP objective51.8428 to90.7332. Three-seed standard deviations are given, including a large9.1649 BPP deviation without normalization. These descriptive statistics are not a formal statistical significance test despite the appendix's strong wording. Removing off-policy training or energy reshaping also worsens the reported means. [Table10.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=18)

Additional tests support gains under Ant System, Elitist and MAX-MIN pheromone rules; beta sweeps show an empirical diversity-quality tradeoff. The alternative active-search prior comparison at200 nodes gives TSP.29% versus.65% and CVRP1.47% versus1.79% for GFlowNet versus RL training. This is a separate parameter-adaptation protocol. [Tables4/8/Figure6.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=17)

### Public-release differences

The current source confirms a12-layer,32-unit edge GNN, separate training logZ heads and learned-distance perturbation. However, its BPP branch still **maximizes mean squared bin utilization**, unlike the formal inverse-utilization energy. Its training exploitation comment explicitly says it does not directly refine a solution: it resamples from pheromones, selects top/random candidates and resets pheromones before scoring trajectories. The BPP inference loop constructs ants and updates pheromones without implementing the published AppendixC suffix destroy-and-repair. The repository is therefore not assumed to reproduce the final BPP tables verbatim. This is a source-version discrepancy, not a measured correction to the published numbers.

## Limitations

### Discussed in the Paper

- No formal proof establishes better optimality than the RL-trained counterpart.
- High beta can restrict exploration and reduce quality as well as diversity.
- Performance depends on the subsequent local-search mechanism; small CVRPLIB instances can favor vanilla ACO. [Conclusion/AppendicesD.2/D.6.](https://raw.githubusercontent.com/mlresearch/v258/main/assets/kim25a/kim25a.pdf#page=9)

### Curator Notes

- Reward-proportional GFlowNet targets, finite fitted distributions and finite-budget ACO search are separate claims.
- Search budgets, task/scale-specific models, fixed CVRP capacity50 and classical local-search resources constrain comparisons to other neural routing papers.
- BPP objective definitions and public-code versions must be matched before interpreting scores or attempting reproduction.
- The appendix's basic symmetry formulas assume nondegenerate feasible cycles; its stated2N count for all N>1 has a degenerate two-node exception. No tested large-instance result depends on that corner case.
- CVRPTW training-count detail, full generic repair hyperparameters and one mislabeled table column remain incompletely specified in the formal text.

## Reproducibility

- **Full reading:** all21 formal pages, including complete AppendicesA-F, task definitions, repair method, ablations, symmetry proofs and extended related work, were freshly read. Original framework/training diagrams, result plots, formulas, proofs and tables were visually inspected.
- **Publication:** the PMLR entry verifies six authors and AISTATS2025, volume258/pages469-477. Its actual `citation_publication_date` is2025-04-23, used as the publication date; a generic conference notification date is removed. First arXiv submission2024-03-11 is retained. Mila/Université de Montréal/Omelet affiliations are added to KAIST from the formal title page. Existing reference-tier inclusion is preserved.
- **Scientific supplements:** the manually inspected PMLR page supplies the combined21-page PDF, OpenReview and software links, with no separate scientific supplement. All included scientific appendices were read. The official159-entry code tree contains no additional PDF/ZIP/TeX scientific file; its extra SOP code is not converted into an unreported paper task.
- **Code:** [ai4co/gfacs](https://github.com/ai4co/gfacs), based on DeepACO. README, selected complete TSP network/training/search functions and BPP objective/exploitation/inference functions were inspected. The release lists Python3.11.5, PyTorch2.1.1 and PyG2.4.0. The two logZ heads, learned-distance NLS and the older BPP implementation are distinguished above. No full benchmark training or solving was rerun.
- **Figure:** complete original Figure2/page3 cropped from the formal PDF, including the pheromone feedback loop and ant constructions.
