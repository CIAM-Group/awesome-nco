---
id: vag-co
short_title: VAG-CO
title: Variational Annealing on Graphs for Combinatorial Optimization
authors:
- Sebastian Sanokowski
- Wilhelm Berghammer
- Sepp Hochreiter
- Sebastian Lehner
year: 2023
date: '2023-12-15'
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/c9c54ac0dd5e942b99b2b51c297544fd-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/c9c54ac0dd5e942b99b2b51c297544fd-Abstract-Conference.html
institutions:
- Johannes Kepler University Linz
- ELLIS Unit Linz
- LIT AI Lab
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Minimum Vertex Cover
- Maximum Clique
- Maximum Cut
summary: A task-specific autoregressive graph policy minimizes annealed variational free energy with PPO, generates
  joint multi-spin tokens, and prunes fixed spins; reported gains depend on candidate-order budgets, feasibility
  repair and benchmark difficulty.
code_url: https://github.com/ml-jku/VAG-CO
figure:
  path: paper-assets/vag-co/framework.png
  alt: Original three-panel comparison on hard MIS and MVC graphs and an ablation of temperature annealing and joint
    subgraph tokenization.
  caption: 'Figure 1: hard-instance results and the annealing/tokenization ablation; an experimental figure rather
    than an architecture diagram.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=8
---
# Variational Annealing on Graphs for Combinatorial Optimization

> **TL;DR:** VAG-CO learns an autoregressive distribution over graph assignments with an **annealed free-energy objective and PPO**. A token represents one of all2^k joint configurations of k spins, reducing sequential passes without imposing within-token independence. It is evaluated on MIS, MVC, maximum clique and maximum cut using separately trained settings. Stronger dependency modeling helps on several hard benchmarks, while simple greedy, mean-field plus rounding, and Gurobi retain important wins.

## Motivation

Independent Bernoulli outputs make solution generation inexpensive but restrict the dependencies that a learned distribution can represent. On hard graph CO instances, those restrictions can limit solution quality. Autoregressive generation is more expressive but needs many sequential steps and can train poorly without entropy regularization. This work combines those ideas with block tokens and dynamic graph reduction. It learns over a distribution of training instances, rather than optimizing model parameters separately for every test instance. [Sections1-3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=3)

## Contributions

- Model conditional spin assignments with a graph autoregressive policy instead of a mean-field factorization.
- Train with free energy and annealed entropy regularization, translated into dense sequential rewards for PPO.
- Predict **joint k-spin configuration tokens** and remove assigned spins while absorbing their effects into remaining node fields.
- Compare the learned distribution, best-of-several decoding and classical/rounding baselines separately, including intentionally hard synthetic graphs. [Sections3/6.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=4)

## Methodology

### Ising representation and generation

The four tasks are represented as Ising energies with local fields and pairwise couplings. A graph node corresponds to a spin; edge features encode couplings. Node features encode the local field and whether a spin has been assigned+1/-1, is currently being generated, or remains for later. The generation order is **breadth-first search (BFS)**. A GNN predicts the next conditional distribution, assignments update the state, and the process continues to a complete solution. [Equations1/5 and Section3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=3)

For k-spin tokenization, the policy outputs a **2^k-way softmax** over all joint configurations of the next k BFS-ordered nodes. The corresponding ordered node embeddings are concatenated with a global summed graph embedding. This is not k independent binary predictions. The usual k is5, with6 for the listed clique runs and8 for MaxCut; the output dimension and memory grow exponentially in k. Padding adds disconnected zero-field dummy spins when necessary. Sequential passes scale as approximately **ceil(N/k)**, rather than becoming independent of graph size. [AppendixA.10/Table7.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=21)

Once a spin is fixed, its couplings to unassigned neighbors become additional local-field contributions. Removing that node and updating those fields preserves the remaining energy decisions and reduces graph memory. The formal expanded appendix describes3/4-layer message-passing networks, optional skip connections, a global aggregation and separate policy/value MLPs. [Section3/AppendixA.10.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=4)

### Objective, annealing and PPO

The objective is expected energy plus **T times log probability**, equivalently energy minus T times entropy. High temperature encourages diverse solutions; training reduces temperature toward zero. Autoregressive factorization decomposes both energy and log probability into step rewards. PPO uses a clipped policy objective, a value loss and generalized advantage estimation. The policy is fixed during evaluation; there is no per-instance parameter fine-tuning. [Equations2-6/AppendixA.9/A.15.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=20)

Training rollouts use **30 graph instances and30 solution trajectories per graph**, with minibatches over graph/trajectory/time coordinates. The reported PPO settings are gamma1, lambda1-1/T_horizon, clipping .1, value coefficient .5 and two optimization repeats. The cosine-modulated temperature schedule uses a400-epoch warm-up, three oscillations and a decaying amplitude; it reaches zero multiple times to permit intermediate assessment. This is not a purely monotone cooling curve. [AppendicesA.9/A.14.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=23)

The theoretical motivation bounds density-estimation error for **bounded energies and iid samples from a target Boltzmann distribution**, with sample complexity scaling like inverse-temperature squared for fixed error/confidence. It motivates an easier-to-harder curriculum. It does not prove that PPO tracks the target distribution, that the chosen schedule is optimal, or that neural inference finds the global minimum. [Remark1/AppendixA.15.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=24)

### Decoding and feasibility

The principal evaluation uses **ordered greedy (OG)** decoding: choose a greedy token at each step for each of several BFS orders. “Best8” therefore explores eight order-induced candidates, not eight independently sampled tokens at every step. The paper also studies direct sampling and ordered sampling. Strong mean-field baselines use **conditional expectation (CE)** with eight random-feature initializations, so their best-of-eight result includes a classical discrete rounding procedure.

Sampled solutions are **not guaranteed feasible** by the neural architecture. If violations remain, AppendixA.3 repeatedly flips the node with most violations until the penalty term vanishes; the authors report this is rare. Energy penalties A1/B1.1 make violating assignments non-minimal, but that property alone does not forbid a learned policy from sampling them. This deterministic repair is distinct from a learned incumbent-improvement policy.

Classification remains **specialist / constructive**: task/dataset-specific models build whole assignments autoregressively. A common Ising interface is not evidence that one checkpoint was trained jointly across all four tasks. The RGA used to standardize training energies is also not the neural solver's incumbent initialization.

## Experiments

### Protocols, metrics and compute

The real graph studies include ENZYMES, PROTEINS, IMDB-BINARY, COLLAB, MUTAG and TWITTER. MIS/clique settings use the described **.6/.1/.3 split**, including only the first1,000 COLLAB graphs in the stated MIS protocol; MVC states **.7/.1/.2**. Borrowed Meta-EGN results have their own original split/settings, so these are not automatically identical test-instance comparisons.

Hard MIS uses **RRG-100**, with80-120 nodes, degrees3/7/10/20 and3,000/100/1,000 train/validation/test graphs. Hard MVC uses **RB-200**, approximately200 nodes, with hardness parameter sampled from.25-1 and2,000/500/1,000 graphs. These are not the100K-node scale-transfer experiments of Meta-EGN. MaxCut uses4,000/500/500 preferential-attachment graphs of200-300 nodes with attachment parameter4. [Section6.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=9)

Best approximation ratio **AR*** summarizes the best of eight candidates; the average ratio summarizes30 candidates and measures distribution quality rather than best-candidate search. MVC ratios are minimized toward1; MIS/clique ratios are maximized toward1. The expanded appendix states three model seeds except **one seed for RRG-100**. Its printed Equation10 uses min uniformly, which conflicts with the meaning of best ratio for maximization; the accompanying task definitions and result interpretation are used here, without pretending to independently reconstruct every numeric evaluation. Table5 also prints minimum positive cardinality for maximum clique, inconsistent with the stated task and Ising objective. [AppendixA.1/A.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=16)

Training uses A10040GB or A4048GB GPUs, with **A10080GB for COLLAB MVC**. Example costs are about **one day for Twitter MVC** and **ten hours for ENZYMES MIS**. Hard RB/RRG settings use20,000 annealing epochs, versus2,000-12,000 in many smaller settings. Hyperparameters are tuned separately by problem/dataset. Gurobi10 runs on a Xeon Platinum8168 CPU, with26 threads reported. The learned timings use **JIT-compiled performance and an assumed parallelized sampling interpretation**; earlier-paper baseline times use other setups. These times do not establish hardware-independent or uniformly measured end-to-end speedups. [AppendicesA.11-A.13.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=22)

### Real graph results and exceptions

| Task/setting | VAG-CO best8 result | Relevant comparison |
| --- | --- | --- |
| MIS ENZYMES | .9960,.026s | MFA-Anneal+CE .9880,.036s; Gurobi1.000,.001s |
| MIS COLLAB | .9988,.064s | MFA-Anneal+CE .9991,.054s is slightly better/faster |
| MVC TWITTER |1.0024,.15s | Meta-EGN adapted1.017,.80s from its reported setup; Gurobi1.0001,.028s |
| MVC COLLAB |1.0017,.16s | MFA+CE1.00021,.05s is better/faster |
| Clique ENZYMES | .987,.029s | MFA-Anneal+CE .9921,.04s is better quality |
| Clique IMDB-BINARY | .9981,.017s | MFA+CE .999,.025s is better quality |

Mean-field distributions are often much weaker before CE, particularly for clique, but there are exceptions even in the average-ratio comparison: MVC COLLAB shows **MFA1.00106 versus VAG-CO1.0056**. The tables do not support a blanket assertion that every autoregressive result exceeds every mean-field result. On the small real graphs, Gurobi often reaches an exact or essentially exact result faster. [Tables2-4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=8)

MaxCut averages **722.31 cut edges in.17s**, versus the reported GFlowNet704.30/.35s and EGN693.45/.092s. Gurobi achieves **731.34 in.1s** in this paper's run, exceeding VAG-CO quality. The learned-method comparison and the classical comparison should both be retained. [Table4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=9)

### Hard synthetic graphs and ablations

Expanded-main Table6 gives RB-200 MVC **1.0059 at.20s** and RRG-100 MIS **.975 at.08s** for VAG-CO. RRG improves over mean-field+CE .947 and annealed mean-field+CE .955, but a longer Gurobi budget reaches.987 at.16s and1.000 at.37s. On RB-200, Gurobi **1.0052 at.09s** already beats the aggregate VAG-CO quality/time; VAG-CO's more favorable comparisons concentrate on the hardest low-p graphs and particular budgets.

Annealing improves the displayed RB-100 learning curves relative to zero-temperature training. Tokenization improves quality per gradient update and reduces decoding time. The k1/2/5/10 study **retunes learning rate and initial temperature for each k**; it is not an isolated fixed-hyperparameter comparison. The k1 versusk5 learning-curve experiment changes rollout horizon and GAE lambda so each collection covers the same number of spins. OG benefits from multiple orders, and with **only one candidate DB-Greedy is strongest** in the displayed sampling ablation. [Figures1-3/AppendixA.8.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=19)

### Published scientific-attachment differences

The separately linked publisher ZIP contains an earlier line-numbered appendix. Its Table4 reports RB-200 VAG-CO **1.0063**, versus **1.0059** in the expanded main Table6, and different mean-field results. It describes linear message maps and a40-unit node MLP/dPsi30, whereas the expanded main appendix describes a message MLP and64-unit node/message MLPs. Its hyperparameter table omits the later clique/MaxCut rows and k column. These attachments were read independently and are not mixed into a single allegedly uniform implementation specification. Quantitative summaries above use the expanded main PDF.

## Limitations

### Discussed in the Paper

- Autoregressive inference still requires a number of network passes proportional to graph size.
- BFS order is fixed by the chosen traversal; learned or order-invariant alternatives are left open.
- A comprehensive optimization of the annealing schedule is future work. [Section7.](https://proceedings.neurips.cc/paper_files/paper/2023/file/c9c54ac0dd5e942b99b2b51c297544fd-Paper-Conference.pdf#page=10)

### Curator Notes

- Joint token expressivity entails a2^k output space; grouping more spins is not free.
- Neural feasibility requires a repair safeguard, and the theory motivates training rather than certifying solver quality.
- Seed counts, candidate-order search, CE, tuning, hardware and parallel timing assumptions matter to the comparison.
- Classical wins and mean-field exceptions should remain visible alongside the hard-instance gains.
- The main PDF and its scientific ZIP differ in numerical results and architecture details. The current release also lacks a complete pretrained-model/hyperparameter bundle.

## Reproducibility

- **Full reading:** all **24 main-PDF pages**, including the expanded A.1-A.15 appendix, plus **seven Appendix.pdf pages and four bib_for_appendix.pdf pages** from the official scientific ZIP were freshly read: **35 registered pages** in total. Key formulas, all result tables/plots, tokenization and schedule figures, and the differing attachment architectures were visually inspected.
- **Source identity:** the official proceedings title, four authors and NeurIPS2023 venue match. Affiliation coverage includes JKU, ELLIS Unit Linz and LIT AI Lab. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2023/hash/c9c54ac0dd5e942b99b2b51c297544fd-Abstract-Conference.html) explicitly records `citation_publication_date` as **2023-12-15**, independently of any paper-specific acceptance date.
- **Supplement discovery:** the publisher page explicitly links the ZIP. Its three members are a directory and the two PDFs named above; both scientific files are registered with archive-member provenance and fully read. No attachment was treated as complete after extraction alone.
- **Code:** [ml-jku/VAG-CO](https://github.com/ml-jku/VAG-CO). The206-entry official tree and all four README files were inspected, along with representative dataset/Gurobi code. The repository gives training/evaluation commands, including `--Ns 8 --sample_mode OG`, but says a pretrained RB-200 model and the complete argument list will be added. Evaluation requires editing a model-path setting. No new training/solver experiment was run.
- **Image:** complete original Figure1, main page8, directly cropped with all three panels and caption. It is explicitly an experimental comparison/ablation figure, rather than a fabricated framework diagram.
