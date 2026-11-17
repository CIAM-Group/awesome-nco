---
id: multilevel-curriculum
short_title: MultiL-Cur
title: Curriculum learning for multilevel budgeted combinatorial problems
authors:
- Adel Nabli
- Margarida Carvalho
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/4eb7d41ae6005f60fe401e56277ebd4e-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/4eb7d41ae6005f60fe401e56277ebd4e-Abstract.html
institutions:
- Université de Montréal
- CIRRELT
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Multilevel Critical Node
summary: A bottom-up curriculum trains frozen afterstate-value experts for increasing remaining budgets in perfect-information zero-sum graph games; MCN experiments expose afterstate-scaling costs and the limits of heuristic multilevel value metrics.
code_url: https://github.com/AdelNabli/MCN
figure:
  path: paper-assets/multilevel-curriculum/framework.png
  alt: Graph node and pooled graph embeddings combine with budgets to produce a Q action score or a weighted sum of node survival probabilities for V.
  caption: 'Figure 2: the value and Q networks used for multilevel critical-node decisions.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=7
---
# Curriculum learning for multilevel budgeted combinatorial problems

> **TL;DR:** MultiL-Cur builds a pool of **frozen value experts** from small remaining budgets to larger ones. Each move enumerates possible afterstates and chooses the best according to the relevant expert and player objective. It improves small-instance learning over the tested RL alternatives, but does not provide a general approximation guarantee. Its 100-node ordinary-MCN row has **49.6% mean relative error**, and approximate play at every level can conceal poor leader decisions.

## Motivation

Single-level constructive optimization has one decision maker. Infrastructure defense can instead involve a defender's vaccination, an attack and a subsequent defense, where evaluating an initial decision requires solving the lower-level responses. The paper studies **perfect-information, deterministic, two-player zero-sum budgeted graph games**, not arbitrary multiplayer or stochastic optimization. Both players know prior moves and budgets; taking an available action is assumed never worse than passing. [Sections 1-2.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=2)

## Contributions

- Express multilevel budgeted combinatorial problems as alternating Markov games with individual unit-budget decisions.
- Extend value/Q learning to the alternating maximizer/minimizer setting through **MultiL-DQN** and a value-network Monte-Carlo comparator.
- Propose **MultiL-Cur**, a bottom-up curriculum that generates heuristic value targets using previously trained budget experts.
- Evaluate ordinary, directed and weighted variants of the **Multilevel Critical Node problem**, with explicit discussion of scalability and the difficulty of certifying multilevel solution quality. [Sections 4-6/Conclusion.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=5)

## Methodology

### Unit decisions and the multilevel game

A level selecting a set of at most b actions is unfolded into b consecutive individual decisions by the same player. A complete episode then has **B = sum of all level budgets** steps. Deterministic graph transitions are known and the discount factor is one. The Bellman rule maximizes or minimizes **immediate reward plus afterstate value**, depending on the current player. Sequential unfolding is equivalent under the stated action/monotonicity assumptions; it does not collapse a multilevel game into an efficiently solvable exact single-level problem. [Lemma 4.1/Equations 4-6.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=4)

### The bottom-up curriculum

With only one unit of budget remaining, enumerate all actions and calculate terminal outcomes exactly, assuming the terminal combinatorial quantity is polynomial-time computable. Train a value network on those examples. For the next budget, enumerate afterstates, use previously trained experts to select actions and roll out the remaining game, and regress the resulting **heuristic total rewards**. Repeat toward earlier/larger-budget stages. After each stage, freeze the best validation checkpoint as a separate expert to avoid forgetting. The deployed model is therefore a **budget-indexed expert pool**, rather than one unchanging checkpoint handling every budget. [Algorithm 1/Section 4.4.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=6)

Training states use **random action prefixes**, because optimal prefixes are unknown. Lemma 4.2 proves that all optimal-prefix states have positive probability under this random construction. This is a **support inclusion result**, not a finite-sample probability bound, a guarantee of low value error, or a guarantee that errors do not propagate through curriculum targets. A one-step enumeration is polynomial given an accurate expert; learning that expert has not solved the underlying hard problem exactly. [Supplement Appendix A.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Supplemental.pdf#page=1)

MultiL-DQN uses alternating min/max bootstrapped Q targets. MultiL-MC uses a value network and Monte-Carlo returns without the bottom-up curriculum, providing a comparison that partially separates the value-versus-Q architecture difference from curriculum learning. Their replay and update schedules still differ. [Supplement Algorithms 2-4.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Supplemental.pdf#page=2)

### MCN actions and architecture

In MCN, the defender first vaccinates/removes up to **Omega** nodes, the attacker marks up to **Phi** remaining nodes as infected, and the defender protects/removes up to **Lambda** further unattacked nodes. Infection spreads through the remaining graph. The defender maximizes the **total weight of saved nodes** and the attacker minimizes it. Vaccinated/protected nodes are saved and supply immediate reward. The three studied variants are undirected unit-weight MCN, undirected positive-weight MCNw and directed unit-weight MCNdir. [Equation 9/Figure 1.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=7)

Node features combine normalized weight, attacked-node indicator and five local-degree statistics. Seven multihead GAT blocks use three heads, residual/batch-normalization and feed-forward layers. APPNP propagates information for **23 or 60 iterations**, according to the training distribution's maximum graph size. Three attention-pooling projections form a graph vector. Budget values, normalized budgets, graph size and total node weight complete the context. The value head predicts a sigmoid survival score for each node and sums **score times node weight**; the Q head instead supplies masked nonnegative action scores. Selected dimensions are 200/400/100 with dropout .2 and APPNP alpha .2, about **2.8 million parameters per network**. [Supplement D.1/Equations 12-20.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Supplemental.pdf#page=4)

The printed Greedy Rollout pseudocode selects afterstates by V alone, whereas the Bellman equation includes immediate reward. The inspected public `take_action_deterministic` code adds the candidate node weight before **both** argmin and argmax. This is consistent with a saved-node reward for a defender action, but the inspected environment defines **zero immediate reward for the attacker**, while its candidate weights remain nonzero. Thus the weighted attack decision has a potential paper/code reward mismatch; no rerun was performed to quantify its effect. Neither the abbreviated pseudocode nor the current code is silently treated as a verified exact implementation of the written Bellman rule.

Classification remains **specialist / constructive**. Selecting successive game actions builds vaccination/attack/protection sets; the method does not learn edits to a completed incumbent solution. The same algorithmic architecture is trained **separately for the three MCN variants**, and shared use by the two players does not establish a cross-task generalist checkpoint.

## Experiments

### Distributions and training budgets

Small training distribution D1 uses Erdos-Renyi graphs of **10-23 nodes**, density .1-.2. Larger D2 uses **20-60 nodes**, density .05-.15. Weighted instances use integers 1-5. Budgets are Omega 0-3, Phi 1-3 and Lambda 0-3. Training/inference use one **V100SXM2 16 GB GPU**. The reported architecture is chosen with **100 Optuna trials on an exactly solved set explicitly called a test set**; a claim of completely untouched test-based model selection would be unwarranted. [Section 6/Supplement D.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=7)

For the small curriculum, each of eight stages has **100,000 training and 1,000 validation instances**, 120 epochs and batch 256: about **808,000 episodes, 375,000 optimization steps and 36 hours**, dominated by target rollouts. MultiL-MC uses 700,000 episodes, 377,000 steps and 56 hours. MultiL-DQN's initial setting uses 960,000 episodes and 29 hours, but the reported final Table 1 quality comes from an expanded **7.68 million-episode, 72-hour** setting. The plotted DQN loss curve and its displayed final gap therefore do not come from the same training configuration. [Supplement D.2/E.1.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Supplemental.pdf#page=5)

For D2, ordinary MCN uses **120,000/2,000 train/validation examples per stage and 200 epochs**, about a week. Directed/weighted variants use **60,000/1,000 per stage and 400 epochs**, about five days each. These are separate expert pools and substantial offline budgets.

### Small-instance learning and reduced-data experiments

Table 1 averages three runs and reports **.51% / 3.34% / 14.53%** error for MultiL-Cur / MultiL-MC / expanded-data MultiL-DQN, with empirical ratios **1.006 / 1.036 / 1.158**. These ratios are measured outcome statistics, not mathematical approximation factors. Appendix E separately compares problem variants: small-distribution errors are **.51% MCN, 2.84% MCNdir and 7.08% MCNw**. [Table 1/Supplement Table 6.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=8)

Reducing the curriculum to 50,000 examples and 60 epochs per stage halves data and quarters gradient steps, reducing training from **36 to 15 hours**. Its vaccination/attack/protection errors change from **.955/.409/.005% to 1.126/.913/.005%**. This is a tested training tradeoff on D1, not evidence that arbitrary reductions preserve quality. [Supplement Table 5.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Supplemental.pdf#page=7)

### Larger-graph results and timing

| Nodes | Exact MCN time | Curriculum time | Ordinary MCN error | Directed / weighted error |
| --- | --- | --- | --- | --- |
| 20 | 29 s | .4 s | .5% | 5.7% / 6.9% |
| 40 | 241 s | .9 s | 5.0% | 11.9% / 6.5% |
| 60 | 405 s | 1.5 s | 4.4% | 4.4% / 3.7% |
| 80 | 636 s | 2.8 s | 2.7% | 1.6% / 2.8% |
| 100 | 848 s | 8.7 s | **49.6%** | 1.8% / 4.1% |

Exact/DA-AD timings are inherited from the earlier MCN paper, while neural timings use the stated GPU setup. The abstract's **185-fold average speedup** is the authors' aggregate comparison; it is not a matched-hardware exactness-preserving acceleration. At 100 nodes, removing one outlier from the 85 exactly solved ordinary-MCN cases still leaves **17.8% error**, rather than near-zero error. DA-AD has **2.7%** ordinary-MCN error there, but takes 207 seconds. [Table 2/Discussion.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=9)

The ordinary MCN test counts for sizes 20/40/60/80/100 are **120/876/110/101/85**, drawn from instances solved within the prior exact solver's two-hour limit. Directed/weighted counts differ and can be very small: at 100 nodes they are **11/27**. Generalization curves use a further set with uneven counts and missing sizes. These selected solved subsets limit broad size-scaling conclusions. [Supplement Tables 3/8.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Supplemental.pdf#page=6)

### What the quality metrics establish

Error is the mean absolute relative difference between an exact game value and the value observed when **both sides use the heuristic**; the empirical ratio symmetrizes exact/heuristic values. In a multilevel game, poor defense and poor attack can cancel numerically. Thus a close heuristic game outcome does not certify a strong first defender action against an optimal adversary. The authors explicitly warn that rigorous leader-strategy evaluation requires solving lower levels optimally. Appendix E's apparent generalization improvement at some larger sizes can reflect this cancellation. Its two-optimal-vaccination example is qualitative and assumes sufficiently accurate afterstate values. [Conclusion/Supplement E.4-E.5.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Supplemental.pdf#page=8)

## Limitations

### Reported by the Authors

- Enumerating every possible afterstate is expensive: a 100-node removal decision requires evaluating up to 100 graphs with 99 nodes.
- Curriculum target generation dominates training and the afterstate representation scales poorly.
- Heuristic play at lower levels can overestimate or underestimate initial strategy quality; dual bounds and guarantees remain future work.
- Restricting rollout exploration and developing cheaper curricula are proposed extensions. [Discussion/Conclusion.](https://proceedings.neurips.cc/paper_files/paper/2020/file/4eb7d41ae6005f60fe401e56277ebd4e-Paper.pdf#page=9)

### Curator Notes

- Support coverage of random-prefix states does not guarantee sufficient finite coverage or bounded approximation error.
- Frozen experts add model storage and are indexed by remaining budget; separate graph variants add further training pools.
- DQN curve/final-score budgets, test-set hyperparameter tuning and prior-paper conventional runtimes must remain explicit.
- The large ordinary-MCN outlier and residual 17.8% error materially qualify claims of near-optimality up to 100 nodes.
- Survival-score interpretation, empirical ratios and polynomial action enumeration do not confer probability calibration or exact-game approximation guarantees.

## Reproducibility

- **Full reading:** all **13 publisher main pages and ten official supplementary pages** were freshly read, including both proofs, all pseudocode, modified exact MIPs, architecture/training details, every extended result and bibliography. Original diagrams, equations, loss/generalization plots and tables were visually inspected.
- **Metadata:** official NeurIPS33:7044-7056 confirms the title, two authors and year2020. The title page confirms Universite de Montreal/CIRRELT, with the institution's French accent restored in metadata. Year-only dates are retained without inventing an acceptance/publication day.
- **Scientific supplement discovery:** the publisher landing page manually lists Paper and Supplemental; the registered ten-page supplement includes Appendices A-E. The official **102-member repository tree** contains no extra scientific PDF/ZIP.
- **Official code:** [AdelNabli/MCN](https://github.com/AdelNabli/MCN). The full README, relevant heuristic/action/reward and metric code, curriculum configuration and notebook were inspected. The README warns pretrained models require **PyTorch Geometric1.4.x**, and exact solving requires CPLEX. The notebook uses the reduced 50,000-example/60-epoch configuration and explicitly says its displayed benchmark results use another model from the paper. The weighted attacker reward discrepancy is recorded above. No new training/solver experiment was run.
- **Figure:** original Figure 2, main PDF page 7, cropped with its full architecture and caption.
