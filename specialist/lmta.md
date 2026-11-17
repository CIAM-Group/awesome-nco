---
id: lmta
short_title: LMTA
title: Learning Multi-Timescale Abstractions for Hierarchical Combinatorial Planning
authors:
- Vivienne Huiling Wang
- Tinghuai Wang
- Joni Pajarinen
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/wang26if.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/wang26if.html
institutions:
- Aalto University
- Qutwo
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Planning
- Graph Optimization
problems:
- Adaptive Influence Maximization
- Stochastic Orienteering
- Sequential Stochastic Combinatorial Optimization
summary: Task-specific latent subgoal MCTS and budget policies construct adaptive selections; conditional theory,
  a strict-ranking counterexample and compute tradeoffs qualify reported gains.
---

# Learning Multi-Timescale Abstractions for Hierarchical Combinatorial Planning

> **TL;DR:** LMTA learns latent subgoals, budget allocation and variable-duration dynamics for hierarchical influence maximization and stochastic prize routing. Subgoal-level MCTS and geometry losses improve reported rewards, with higher inference latency than several baselines. Exact theory assumptions are strong, and the printed pairwise-hinge strict-ranking theorem has a finite counterexample; empirical results remain separately reported.

## Motivation

Sequential stochastic combinatorial optimization requires choosing both a strategic subtask and its resource budget. Scalar-budget hierarchies lack intent, while fixed-stride world models can misrepresent variable execution lengths. LMTA predicts the post-subgoal outcome in one latent transition and learns a geometry correlated with executed duration, allowing lookahead without rolling out every low-level action inside search (Sections1–3).

## Contributions

- A model-based hierarchy searches a finite learned subgoal dictionary and then samples a subgoal-conditioned budget.
- Primitive-step cap, macro-displacement margin and duration-ordering objectives structure a common unit-normalized latent space.
- AIM, stochastic orienteering(SOP), Power-2500, transfer, exact tiny-instance calibration, ablations and compute sweeps assess the approach (Sections4–5/AppendicesA–O).

## Methodology

**Hierarchy and model.** A two-layer GNN encodes graph state into a128dimensional unit vector. MLPdynamics/reward heads predict the next macro latent and cumulative reward; policy/value heads guide MuZero-style PUCTsearch over32learned subgoal embeddings. Search does **not** branch jointly over budgets: the dynamics model marginalizes transitions under the current learned budget rule/low-level controller. After choosing a subgoal, a masked categorical budget head selects0…remaining budget. Its changing policy therefore also changes the target dynamics distribution. Subgoal-conditioned GNN Q-values construct primitive node/city choices for at most the budget or until legal actions are exhausted (Sections4.1/4.4/AppendicesB/F/G).

**Temporal objective.** The Pull loss penalizes consecutive encoded-state jumps beyondκ.10; Push penalizes a macro displacement below a learned regularized margin; Order uses pairwise hinge labels from **realized executed durations**, including stopping due to budget/legality. Duration is not unconstrained subgoal completion time. Primitive discountγLLand decision discountγare both.997in the default experiment, but macro backups applyγonce per decision rather thanγLL^duration. The paper explicitly calls this a decision-time preference approximation, not strict primitive-time SMDPequivalence (Sections3–4.2/AppendicesA.1/A.8).

**Learning.** Search visit counts/root values supervise MuZero-style unrolls(length5); budget actor–critic uses realized macro reward plus next-state search value. Search targets/advantages are stop-gradient; the encoder also receives geometric losses. The low-level DQN has a periodically refreshed target. A three-epoch average-budget warm-up delays learned budget control without freezing other heads. Adam uses HLlearning rate.001, LL.001AIM/.0005SOP, batch8/8, clipped gradient norm5and buffers1000games/10000primitive steps. Main search budgets are150/250simulations per HLdecision, with different exploration settings across native domains (AppendicesF/G).

**Theory and classification.** Geometry–duration bounds require uniform conditional cap-risk and planning-rollout modeling errors; value regret additionally assumes true values factor through the encoder, Lipschitz value smoothness, reward/leaf error control, and an assumed finite-search concentration property. Root-visit coverage is an extra condition for converting minimum-action visits into total simulations. These assumptions are not certified by small training losses or correlation plots. Specialist / constructive is retained: task/configuration models are trained separately, with no demonstrated shared AIM/SOPcheckpoint; online neural guidance constructs selections/routes rather than editing complete incumbents.

## Experiments

**Tasks/protocol.** AIMuses directed independent-cascade propagation with inverse-indegree probabilities. SOPfollows WS-option's daily stochastic profits/submodular daily aggregation and distance penalties; it is not a standard hard-feasible shortest-path benchmark. Main graphs have500nodes and(T,K)=(10,50/60/70)or(20,10). Ten seeds/configuration yield mean±**SEM**, with two-sided Welch tests on seed means. Small-to-large tests train once on100nodes/T10/K60, whereas the separate200→500scaling curve retrains at each graph size. Do not merge these protocols (Sections5/AppendicesD/E/J/N).

**Reported quality.** AtT10/K70,AIM324.15±2.38versusWS-option301.53±9.10andbest displayed heuristic313.74±3.02; SOP31.60±1.94versusWS12.99±1.25andGreedy23.58±.16. AdditionalAIM/SOPresults beat Director306.53/20.74,FlatMuZero260.60/17.75andSampledMuZero283.93/19.41. Power2500/K60reports856.14±10.20versusDirector725.61±5.00andWS676.86±21.58. TinyAIM(N10,T4,K4)has exact8.91,LMTA8.73(≈.98ratio)andWS7.72: this is a tiny calibration example, not a large-instance optimality certificate (Tables1–3/16–20).

**Transfer/ablations.** The100node model's1000→2500node AIMrewards rise416.06→654.29andSOP31.27→38.88, above the reported baselines. Removing Pull/Push/Order reduces means, particularlySOP31.60→24.66/25.14/26.48. Fixed margin28.62versuslearned31.60suggests a useful adaptive component but uncertainty overlaps in some sensitivity comparisons. Learned score-versus-duration Kendallτis.74/.76versusfixedmargin.71/.69. Durations are averaged over five executions of each subgoal from sampled states; these empirical correlations do not prove exact ranking or value sufficiency (AppendicesH–N).

**Cost/negative tradeoffs.** On synchronizedV10032GB/PyTorch2.0.1profiling(AIM500,T10,K70), LMTAmedian decision latency441.03ms exceedsWS101.21,Director40.38andFlatDQN62.65, while beatingFlatMuZero851.53. Epoch times are62.34seconds versus12.56/22.5/329.03/822.39respectively. Table22also reports62.26seconds/epoch,16episodes/epoch and4.2884seconds/episode; preserve these reported clock definitions and the small table discrepancy. Matched-compute Figure8shows high reward even with greedy zero-search execution and only modest extra inference-search gains; distinguish training with search from needing extensive search at deployment. Chance-budget MCTS variants slightly **reduce** reward versus the default marginalized model (Tables20–23/Figure8).

## Limitations

### Discussed in the Paper

Budget marginalization trades modeling accuracy for manageable search branching. Fixed decision-time discounting approximates primitive-time preferences. Latent subgoals are not a human-authored semantic control vocabulary; interpreting/controlling them and larger-scale deployment remain open (Sections3–4/AppendicesA/J/K/O).

### Curator Notes

- **Printed A.11strict-ranking claim fails in general under its stated A.4.** Take three equally likely state/subgoal types with independent durations1+Bernoulli(.4,.45,.6)and identical budget2. Their means are strictly ordered and every informative pair has comparison-majority direction consistent with those means. Nevertheless the shared-score pairwise hinge risk has a global minimizer `f1=f2=0,f3=1`: the sum over three unordered pairs is2.65, versus2.76for unit-separated scores0,1,2. A zero subgradient and exact rational breakpoint enumeration certify the minimum. Pair margins cannot all be independently minimized because they are differences of one shared scorer. This also limits A.12's claimed strict-misordering control from hinge excess alone. The check was independently reproduced by a separate reader/LP; it concerns the theorem, not an asserted failure of the actual trained agent.
- A.3requires an almost-sure **conditional** second-moment cap. An average population loss does not automatically upper-bound every conditional risk as its training-connection prose suggests; rare states can have larger violations. Likewise rank correlation between learned value targets and distances does not establish the exact true-value factorization/Lipschitz assumption.
- A.13assumes concentration about an estimator's mean; its proof further identifies mean-search bias solely with leaf approximation. Finite internal search may have additional action-selection bias, which is not established by concentration alone. Keep this as a printed-proof qualification rather than assigning the displayed regret expression as an unconditional MCTS certificate. Its argmax-Qchoice also differs from the visit-count policy used in practical search.
- Pull/Pushalone permit a collapsed encoder with zero learned margins; empirical prediction/order objectives and optimization provide additional anti-collapse pressures, not a proof of global noncollapse. Stochastic budgeting and soft routing penalties also need explicit conventions for zero-budget steps and negative rewards when applying nonnegative-reward theory assumptions.

## Reproducibility

The [formal PMLR record](https://proceedings.mlr.press/v306/wang26if.html) givesICML2026volume306,pp130665–130698,issued2026-09-29. All34formal pages, all proofs, every appendix table/curve and full bibliography were read; mathematical assumptions/ranking theorem/latency tables were rendered and checked. The officialevent60513poster was read visually and supplies no separate code link or scientific slide PDF.

Publisher-linked resources and asset inventory were manually checked: no separate supplement/software link is displayed; the asset APIreturned404and OpenReviewzV5ktcEs8j403. An exact-title public repository search found no released implementation, and the full formal text contains no source-code URL. No code availability, implementation agreement, benchmark rerun or independent reproduction is asserted. The local exact theoretical audit is preserved in `research/full-text-review/lmta/ranking-exact-check.py`/JSONwith rational probabilities, all breakpoints and a convex subgradient certificate; parent independently solved a separate six-hinge LPand checked the source theorem pages.

**Internal citations.** Explicit text plus bibliography verify [WS-option](ws-option.md), [Attention Model](attention-model.md), [Neural Combinatorial Optimization](neural-combinatorial-optimization.md) (cited2017workshop version), [Pointer Networks](pointer-networks.md) and [GCN-Guided Tree Search](../generalist/gcn-guided-tree-search.md). The latter is actually cited asLi2018even though the surrounding introduction describes broadSSCOmotivation; that semantic mismatch does not change the bibliography identity.
