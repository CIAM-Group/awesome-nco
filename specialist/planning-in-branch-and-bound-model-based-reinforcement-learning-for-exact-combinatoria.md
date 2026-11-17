---
id: planning-in-branch-and-bound-model-based-reinforcement-learning-for-exact-combinatoria
short_title: PlanB&B
title: 'Planning in Branch-and-Bound: Model-Based Reinforcement Learning for Exact Combinatorial Optimization'
authors:
- Paul Strang
- Zacharie Alès
- Côme Bissuel
- Olivier Juan
- Safia Kedad-Sidhoum
- Emmanuel Rachelson
year: 2026
date: '2025-11-12'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/39759
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/39759
institutions:
- EDF R&D
- ENSTA Paris, Institut Polytechnique de Paris
- CNAM Paris, CEDRIC
- ISAE-SUPAERO
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Set Covering
- Combinatorial Auctions
- Maximum Independent Set
- Multiple Knapsack
summary: MuZero-style latent models and Gumbel search train separate branching policies for four MILP families;
  policy-only inference improves aggregate results over prior RL, while online planning and transfer gains depend
  on problem family and node-selection protocol.
arxiv_url: https://arxiv.org/abs/2511.09219
code_url: https://github.com/abfariah/planbb
figure:
  path: paper-assets/planning-in-branch-and-bound-model-based-reinforcement-learning-for-exact-combinatoria/framework.png
  alt: PlanB&B encodes a real MILP node and imagines left/right child states with policy, subtree-value and branchability
    predictions.
  caption: 'Original Figure 3: learned branching dynamics and prediction heads generate imagined subtrees; branchability
    pruning here is part of planning rather than pruning the real exact solver.'
  source_url: https://arxiv.org/pdf/2511.09219v4#page=4
---

# Planning in Branch-and-Bound: Model-Based Reinforcement Learning for Exact Combinatorial Optimization

> **TL;DR:** PlanB&B learns a latent branching model and uses Gumbel search to improve its training targets. The main results use policy-only inference with no test-time search. Separate policies are trained for four MILP families; online planning helps MIS but can fail on larger combinatorial-auction instances. The real SCIP solver retains responsibility for feasibility, bounds and exactness.

## Motivation

Learning-to-branch must assign credit across long combinatorial searches. Strong-branching demonstrations are expensive, while model-free RL may explore inefficiently. PlanB&B adapts MuZero-style learning and planning to branch-and-bound without solving extra real LP relaxations for every imagined step. Its objective is distribution-specific search efficiency, rather than learning one universal MILP solver or replacing exact optimization with neural predictions. [pp. 1–4]

## Contributions

- Learns left/right latent child-node dynamics together with policy, subtree-value and branchability predictions, and simulates node selection over the resulting imagined tree.
- Uses Gumbel search, replayed subtree trajectories, a distributional value loss and auxiliary branchability/tree-consistency objectives to train branching policies without an expert-action imitation objective.
- Compares policy-only inference and additional planning budgets, including transfer failures, alignment with strong branching, and the effects of node selection. [pp. 3–7, 10–17]

## Methodology

The environment state includes the branch-and-bound tree and incumbent. A branching action chooses a fractional integer variable. With a fixed DFS node-selection policy, the paper uses an undiscounted reward of −1 per transition and a decomposition into open-node subtree values. The model observes a bipartite variable–constraint representation of the current MILP node and incumbent-related features, rather than encoding the entire global tree. The DFS argument supplies the training formulation; it does not prove that an approximate neural model is exact. [pp. 2–4]

A representation network h embeds the observation. A dynamics network g predicts two child representations after a selected branching variable, with independent left/right heads. Prediction network f provides variable scores, histogram-encoded subtree values and branchability scores. Imagined branchable children are retained; an imagined DFS stack chooses the next node, while total imagined value sums open-node subtree predictions. These predicted pruning decisions affect planning only. Actual branch-and-bound still uses SCIP's LP solutions, bounds and feasibility tests. [pp. 4, 10–11; Fig. 3]

Gumbel search samples a limited root action subset and applies sequential halving, with a different selection rule below the root. Planning produces policy targets. Training unrolls recorded subtree trajectories, fits policy/value/branchability predictions, and adds a SimSiam-style consistency term between imagined child embeddings and later real observations, using stop-gradient on the target branch. HL-Gauss value distributions operate on a log scale for negative subtree sizes. [pp. 11–15]

**Classification: Specialist / constructive.** Each of the four benchmark families trains its own agent; four task-specific checkpoints are provided. Different MILP applications sharing an architecture do not establish a common cross-problem checkpoint. Neural branching extends a partial exact-search assignment and is not an incumbent-editing operator. Training is based on DFS; evaluation has an explicit multiple-knapsack exception discussed below. [pp. 5, 14; official models/ and evaluator]

## Experiments

Benchmarks are set covering (SC), combinatorial auctions (CA), maximum independent set (MIS) and multiple knapsack (MK). Training/test dimensions include SC 500 items/1,000 sets, CA 100 items/500 bids, MIS 500 nodes, and MK 100 items/six knapsacks. Transfer increases the respective scales to 1,000 items/1,000 sets, 200 items/1,000 bids, 1,000 nodes, and 100 items/twelve knapsacks. Evaluation uses 100 held-out test and 100 larger transfer instances per family, with metrics averaged over five seeds. [pp. 5, 11]

The backend is SCIP 8.0.3 with a one-hour limit, restarts disabled and cuts restricted to the root. Primal heuristics otherwise remain enabled. Reported solving time excludes presolve, which is shown separately. The paper cautions that custom branching invokes auxiliary solver routines, so comparing tree sizes alone with native SCIP heuristics does not isolate runtime efficiency. Appendix G states that MK uses SCIP's default node selection for all baselines except IL-DFS; the official evaluator confirms that PlanB&B switches to DFS only for non-MK families. [pp. 5–6, 14; env_wrapper.py and test/run_agents.py]

Training uses 100,000 steps, batches of 128, Adam with learning rate 1e-3 to 1e-5, three unroll and TD steps, discount 1, latent width 64, 43/5/1 variable/constraint/edge features, replay capacity 100,000, 50 search simulations and ten root actions. The reported server has 128 CPU cores, 1,024 GB RAM and four 40-GB A100 GPUs, with Ray workers for solving, replay preprocessing, imagined batches and learning. [pp. 13–14]

**Policy-only results:** Main Table 1 sets test-time MCTS budget to zero. With PlanB&B normalized to 100, aggregate solving-time scores are 188 for DQN-tMDP, 241 for DQN-Retro, 254 for PG-tMDP, 131 for IL-DFS, 116 for default-node-selection IL*, and 363 for SCIP on test instances. On transfer, IL* is better at 83, compared with PlanB&B's 100 and IL-DFS's 136. Thus the aggregate advantage over earlier RL and IL-DFS does not imply dominance over ordinary IL on larger instances. For example, transfer SC takes 46.2 s versus IL*'s 23.1 s; transfer CA is 9.1 s versus 9.4 s. The main table uses geometric means, not a win on every instance. [pp. 5–6]

**Planning budgets and ablations:** MIS planning can reduce tree size by roughly 20% on test and 50% on transfer at the illustrated larger budgets; the best transfer runtime occurs at a much smaller budget, around nine simulations. More planning is not monotonically faster. CA transfer shows worsening nodes and time as planning grows, attributed to value-head distribution shift. In CA ablations, removing branchability learning substantially harms training; temporal consistency mainly helps briefly during early training and has little measurable final benefit in the tested regime. Strong-branching alignment experiments use 100 test and 20 transfer MIS instances and show PlanB&B need not imitate strong branching more closely. [pp. 6–7, 15–16; Figs. 4, 7–8]

## Limitations

Results concern four separately trained synthetic MILP distributions. Learned latent/value predictions have no certified accuracy bound, and Gumbel-search policy-improvement arguments do not certify improvement in the real solver under arbitrary model error. DFS can make credit assignment tractable while finding incumbents late on larger instances; its warm starts can also shorten per-node LP transitions. Reported net runtime reflects both effects and the MK node-selection exception, rather than a uniform DFS protocol. [pp. 3–7, 14, 16–17]

**Curator source crosscheck:** Appendix E prints positive log-likelihood and cosine-similarity expressions as losses while Section 3 describes minimization. The current code uses negative policy cross-entropy, ordinary branchability cross-entropy and a distance-like consistency loss, which resolves the intended optimization direction. The implementation's consistency objective also includes a normalized-distance component, rather than only the printed cosine expression. These are printed-formula/current-code distinctions, not evidence that the reported experiments failed. [pp. 4, 13; core/train.py]

Some summary tables disagree: CA-transfer random nodes are 317,235 in Table 1 versus 3,172,355 in Table 8, and MIS-transfer IL* nodes are 1,993 versus 1,882. Table 7 also prints a CA-transfer DQN-tMDP mean rank of 9.97 despite listing seven baselines. The note uses explicitly identified tables and does not silently correct their entries or independently reproduce these rankings. [pp. 6, 18–19]

## Reproducibility

The formal AAAI 2026 article is volume 40(30), pp. 25627–25635, DOI 10.1609/aaai.v40i30.39759, with publisher-deposited online date 2026-03-14. arXiv v1 dates to 2025-11-12; this review uses the complete nineteen-page v4 of 2026-04-02, including Appendices A–I, under the authorized fallback policy. Full v4/formal bylines contain Olivier Juan, whereas the initial arXiv metadata listed five authors. Affiliations were checked against the actual PDF and formal primary byline. The blocked publisher PDF is not represented as read or as byte-identical to arXiv.

The author repository was inspected at commit 198eebf302184748ec9f8d2d0a2f812d5c52ad2a, dated 2026-07-21. Its complete 61-member archive contains code, environment specification, four current family checkpoints and an older MK checkpoint, without an additional scientific PDF or video. The environment pins SCIP 8.0.3, PySCIPOpt 4.3.0 and Ecole 0.8.1; training/evaluation require the compiled MCTS extension and substantial compute. Checkpoint files were inventoried and hashed without deserializing them. Model, loss, node-selection and evaluation paths were inspected, with no training or end-to-end performance rerun.

The author project links OpenReview submission 8481hfKVsr; both OpenReview notes APIs returned 403. The primary publisher's indexed Downloads lists the PDF only, and the full arXiv article does not identify an absent separate scientific supplement. All nineteen registered scientific pages were read, including all references and all appendix figures/tables. Key model, loss, protocol, ablation and transfer-result pages were rendered and visually checked. Original Figure 3, repository inventory/hashes, primary history HTML and access-check results are retained with the review.
