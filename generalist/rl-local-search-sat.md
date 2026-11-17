---
id: rl-local-search-sat
short_title: RL SAT Local Search
title: Learning Local Search Heuristics for Boolean Satisfiability
authors:
- Emre Yolcu
- Barnabás Póczos
year: 2019
date: '2019'
publication:
  date: '2019'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/12e59a33dea1bf0630f46edfe13d6ea2-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2019/hash/12e59a33dea1bf0630f46edfe13d6ea2-Abstract.html
institutions:
- Carnegie Mellon University
scope: generalist
paper_type: solver
paradigm: improvement
problem_families:
- Satisfiability
- Graph Optimization
problems:
- Boolean Satisfiability
- Clique Detection
- Vertex Cover Decision
- Graph Coloring Decision
- Dominating Set Decision
summary: A shared SAT local-search policy transfers across decision encodings; task-specific curricula learn specialized
  flip heuristics.
code_url: https://github.com/emreyolcu/sat
---

# Learning Local Search Heuristics for Boolean Satisfiability

> **TL;DR:** A graph policy learns variable flips inside stochastic local search. Most experiments train distribution-specific policies; a separate shared random-SAT policy transfers across several SAT-encoded graph decision problems.

## Motivation

Generic SAT flip rules may miss structure in repeatedly encountered instance distributions. The paper studies whether reinforcement learning can discover useful variable-selection heuristics from minimal state features, with success measured primarily by search steps rather than wall time (paper pp.1–2,7).

## Contributions

- A variable/clause GNN provides the learned component of a hybrid stochastic-local-search flip rule, trained from terminal satisfaction rewards without assignment labels (Sections4–5).
- A curriculum increases problem size within each distribution. Table2 studies separately specialized heuristics for random3-SAT and bounded clique, vertex-cover, coloring and dominating-set decisions encoded as SAT (Sections6–7).
- Table3 additionally reuses one SR(10)-trained policy on four different graph-problem encodings. This demonstrated shared decision solver supports the generalist classification here; the separately trained Table2 policies are not one universal checkpoint. Neither experiment measures optimal graph objectives (p.8).

## Methodology

**Search and representation.** Start from a uniformly random Boolean assignment and repeatedly flip one variable. With probability1/2 choose a random variable in a random unsatisfied clause; otherwise sample from the learned softmax over all variables. The neural action may select variables outside unsatisfied clauses. Return a verified satisfying assignment or “unsolved” after the search budget; the latter is not an UNSAT proof (Algorithm1, Sections3–4).

The bipartite factor graph has one node per variable and one per clause, with positive/negative occurrence edges. Node features encode true variable, false variable, or clause, rather than handcrafted break counts. Four direction/polarity message MLPs and separate variable/clause update MLPs run two rounds per flip; the output MLP scores variables. Hidden/message width is32, output-MLP hidden width64, with ReLU and per-graph batch normalization (p.4; supplementA).

**Learning.** A terminal reward is1 only when an assignment satisfies the formula, otherwise0. REINFORCE discounts earlier actions with gamma0.25 and accumulates five trajectories per sampled formula. Random-walk actions do not receive a policy-gradient update. Training therefore uses no satisfying-assignment supervision, but CNFgen instances are filtered with MiniSAT to retain satisfiable cases; this is not solver-free data preparation (Sections5–6; supplementA–B).

RMSprop starts at0.001 for the first10000-iteration curriculum stage, halving at specified milestones; later stages start at0.0001 and multiply by0.8 at milestones. Curriculum checkpoint selection evaluates the next larger same-class distribution and minimizes median flips there. Training flip caps are chosen from sampled WalkSAT behavior (Section6.2; supplementA). The appendix reports no benefit from additional message rounds, actor–critic, or entropy regularization for the searched settings.

## Experiments

**Protocol.** Table2 uses50 satisfiable formulas per distribution and25 random-initialization trials per formula, with750-flip caps and walk probability1/2 for learned and WalkSAT policies. Reported “solved” is the fraction of formulas whose median trial length is below the cap. The median metric is the median across formulas of their within-formula trial medians; averages include capped failures (p.7).

**Specialized policies.** Diagonal Table2 average flips are367 versus385 for random3-SAT,116 versus237 for clique,181 versus319 for vertex cover,342 versus416 for coloring, and205 versus217 for dominating set. Corresponding learned/WalkSAT solved fractions are84/80%,100/100%,100/96%,88/80%,100/100%. Most cross-class policies degrade sharply. These are SAT-witness search statistics, not optimization gaps or graph optimality rates.

**Shared-policy transfer.** The SR(10) policy in Table3 obtains98%,86%,98%,70% solved on clique, vertex-cover, coloring and dominating-set encodings, respectively; a separately trained rand3(10,43) policy obtains4%,16%,84%,16%. Their average flips are363/649,410/643,204/390,499/653. The shared SR policy also scales to SR(20–80) with larger iteration budgets in Figure4; this does not establish constant-budget transfer (pp.8–9).

**Distribution shift and behavior.** Table5 aggregates60 problems per task from random-regular, geometric, Barabasi–Albert and Watts–Strogatz graphs with10–15 vertices. Learned policies use fewer average flips on three tasks, but dominating set worsens to271 versus255 and vertex-cover solved fraction falls to90% versus92%. Table4 shows fewer sideways moves and more upward/downward moves than WalkSAT for two selected tasks, not a proof of causal search advantages (pp.8–9).

## Limitations

### Discussed in the Paper

Neural steps cost much more than WalkSAT steps, and the authors explicitly state that runtime is much longer and uncompetitive with state-of-the-art SAT solvers. WalkSAT is a simple sanity-check baseline, not the strongest contemporary solver. Reducing GNN overhead, larger-scale evaluation, backtracking/model-based search and algorithm portfolios remain future directions (pp.7,9).

### Curator Notes

The principal task experiments are small satisfiable synthetic cases with separate policies and curriculum validation on the next distribution. One shared-policy transfer experiment justifies limited cross-problem scope through fixed SAT encodings, rather than a shared optimization model for clique size, cover size or chromatic number. Search caps,25 restarts and median-based success definitions must accompany quoted solved fractions. Failure to find a witness supplies no unsatisfiability certificate.

## Reproducibility

- Formal source: [NeurIPS2019 proceedings](https://proceedings.neurips.cc/paper_files/paper/2019/hash/12e59a33dea1bf0630f46edfe13d6ea2-Abstract.html); fully reviewed12-page [publisher paper](https://proceedings.neurips.cc/paper_files/paper/2019/file/12e59a33dea1bf0630f46edfe13d6ea2-Paper.pdf).
- Supplement check: the publisher landing page links an [official ZIP](https://proceedings.neurips.cc/paper_files/paper/2019/file/12e59a33dea1bf0630f46edfe13d6ea2-Supplemental.zip). Its sole member, `Appendix.pdf`, is one scientific page (printed p.13); both hyperparameters and training algorithm were fully read.
- Author-linked [implementation](https://github.com/emreyolcu/sat) provides data-generation scripts, curriculum configurations, training/evaluation entry points and MiniSAT/PyMiniSolvers setup. Paper metrics should be reproduced with25 trials, not the README's small illustrative sample command. No experiments were rerun in this audit.
