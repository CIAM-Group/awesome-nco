---
id: sorrel-suboptimal-demonstration-guided-reinforcement-learning-for-learning-to-branch
short_title: SORREL
title: 'SORREL: Suboptimal-Demonstration-Guided Reinforcement Learning for Learning to Branch'
authors:
- Shengyu Feng
- Yiming Yang
year: 2025
date: '2024-12-20'
publication:
  date: '2025-04-11'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/33219
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/33219
institutions:
- Carnegie Mellon University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
- Set Covering
- Maximum Independent Set
- Combinatorial Auction
- Capacitated Facility Location
- Multiple Knapsack
summary: Task-specific GNN branchers combine offline value learning with behavior cloning and online PPO/self-imitation
  from smaller search trees; five MILP families show gains over matched suboptimal-demonstration neural baselines,
  with qualified exact-solver, surrogate-return and public-code boundaries.
arxiv_url: https://arxiv.org/abs/2412.15534
code_url: https://github.com/Shengyu-Feng/SORREL
figure:
  path: paper-assets/sorrel-suboptimal-demonstration-guided-reinforcement-learning-for-learning-to-branch/framework.png
  alt: SORREL first trains a brancher from a heuristic demonstration buffer, then initializes online reinforcement
    learning and self-imitation from its best trajectories.
  caption: 'Original Figure 1: offline pretraining followed by online reinforcement learning and self-imitation.'
  source_url: https://arxiv.org/pdf/2412.15534v2#page=3
---

# SORREL: Suboptimal-Demonstration-Guided Reinforcement Learning for Learning to Branch

> **TL;DR:** SORREL uses value estimates to learn beyond a weak branching demonstrator, then finetunes with PPO and self-imitation. Separate models cover five MILP families. It improves the matched neural baselines in the reported tables, while classical branching can remain faster and the public implementation has important formulation and data-flow differences.

## Motivation

Imitating full strong branching requires expensive demonstrations and does not guarantee the best search tree or runtime for every MILP family. Online RL avoids a fixed teacher but spends substantial time collecting useful branching trajectories. SORREL combines inexpensive, imperfect demonstrations with online improvement. The experiment's teacher is a synthetic vanilla hybrid brancher (VHB): full strong branching with probability 0.05 and pseudocost branching otherwise. [pp. 1–2, 5]

## Contributions

- Combines offline value learning and behavior-cloning regularization, rather than unconditionally imitating every demonstration.
- Defines a random-walk return over a binary branching tree and uses it for actor–critic updates.
- Finetunes with PPO plus self-imitation of positive-advantage decisions from the best previously observed trajectories for each instance.
- Evaluates demonstration quality, offline/online components and size transfer on five MILP benchmarks. The transfer concerns larger instances within a trained family, not one cross-family checkpoint. [pp. 3–7]

## Methodology

SCIP retains the exact B&B search; a bipartite variable–constraint GNN chooses a fractional branching variable. The paper standardizes this architecture across neural baselines. Offline transitions contain a parent and its two children. The critic bootstraps a child-distribution-weighted return; the actor maximizes estimated action value while retaining a log-likelihood term for the demonstrated action. The value weight is normalized by mean absolute demonstrated-action Q-value. [pp. 3–5, Eqs. 4–7]

Online PPO initializes from offline parameters. A per-instance bounded priority queue prefers trajectories with fewer search nodes. Self-imitation then weights past actions by the positive part of their return minus the current state-value estimate. A shared Q-network is pooled with a maximum over actions to initialize the state-value critic. Queue preference for small trees and the dual-bound surrogate used in the critic are separate quantities. [p. 4, Eqs. 8–11]

The theoretical statements need their stated modeling scope. Proposition 2 is the usual sup-norm gamma-contraction for a fixed Markov transition/policy with gamma<1 on an appropriate bounded value-function space. Proposition 3 concerns realizing an arbitrary leaf distribution on a finite tree by assigning child probabilities; at zero-mass subtrees the conditional choices can be arbitrary. These statements do not establish optimal branching or minimum runtime for the nonlinear trained networks. Definition 1 uses local sub-MILPs and the minimum child dual-bound increment; the authors expressly describe this as a surrogate rather than the complete temporally evolving solver. Global solver information would have to be incorporated when necessary for a Markov model of the actual implementation. [pp. 3–4]

The discounted random-walk return should also be distinguished from an undiscounted final bound difference. For example, a generic two-edge path with increments 1 and 1 has return 1.9 at gamma=0.9, whereas its undiscounted sum is 2. This curator accounting example qualifies the prose interpretation of leaf improvement; it does not refute contraction or constitute a MILP performance counterexample. [pp. 3–4]

**Classification: Specialist / constructive.** The released checkpoints and task-specific training scripts train distinct policies for SC, MIS, CA, CFL and MK. The common MILP representation is reusable, but the paper and artifacts do not demonstrate one unchanged neural checkpoint across those native problems. Neural variable selection is embedded in an exact constructive search, rather than a neural local-improvement policy over complete solutions. [p. 5; official training/checkpoint directories]

## Experiments

The five families are set covering, independent set, combinatorial auction, capacitated facility location and multiple knapsack. The paper generates 10,000 training and 2,000 validation instances per family, with 100 training instances held for online finetuning and twenty for validation. VHB supplies 100,000 training transitions and 20,000 GCNN validation transitions. Testing uses 100 standard instances and twenty larger transfer instances, each evaluated under five solver seeds. SCIP 7.0.1 has a one-hour limit. Reported summaries are 1-shifted geometric mean runtime and 10-shifted geometric mean node count; variability is the mean per-instance standard deviation expressed relative to the summary, not a confidence interval. [p. 5]

SORREL is the fastest listed neural method in every family in Tables 1–2 and has the smallest compared neural node counts. On standard MIS, it reports 4.46 seconds and 44 nodes, versus GCNN-VHB's 5.51 seconds and 93 nodes. On transfer MIS, the respective values are 62.41/1707 versus 424.53/8511. On standard MK, SORREL's 142 nodes improve over TreeDQN's 159 and GCNN-VHB's 458. [p. 6]

The comparisons are not universal dominance. RPB is faster on standard CA (3.60 versus 4.40 seconds) and MK (0.64 versus 2.54), and on transfer CA (71.18 versus 366.49) and MK (2.29 versus 8.98). Classical branchers often have fewer nodes; the table captions restrict node-count ranking to neural methods. In Table 3, high-quality-demonstration GCNN-FSB has fewer nodes than full SORREL on SC/MIS/CA/CFL (28/37/220/218 versus 32/44/253/239); SORREL wins MK (142 versus 305). [p. 6]

Offline RL alone improves over GCNN-VHB in all five Table 3 cases; online finetuning gives smaller additional gains except the larger MK improvement from 234 to 142 nodes. MIS/MK training curves support the self-imitation ablation in update/sample-efficiency terms. The paper does not provide a complete numerical wall-clock training-cost comparison or hardware budget, so these curves should not become an unsupported hours-to-solution claim. The MIS teacher-quality study varies FSB probability over 0.05, 0.1, 0.2 and 0.5. [pp. 6–7]

## Limitations

SIL's conservativeness limits benefits from longer RL training, as the authors acknowledge. Demonstration robustness is tested with this synthetic teacher family, rather than arbitrary corrupt demonstrations or heterogeneous industrial MIPLIB tasks. Larger transfer instances frequently time out; partial search-tree sizes then depend on hardware and time budget, and Table 2 explicitly omits TreeDQN CA node counts because of overwhelming unfinished runs. Exactness is a property of the retained solver when its search terminates, not a guarantee of solving every instance within one hour. [pp. 5–7; official README]

Current-code inspection identifies narrower implementation boundaries. At the pinned commit, reward.py records each child's individual dual-bound increment, whereas printed Definition 1 uses the minimum across children. The critic uses Huber loss rather than the squared error printed in Eq. 5. More materially, common/multiprocessing.py lines 261–262 call build_graph with a None observation for both child inputs, although actual child observations have already been stored; common/buffer.py lines 104–115 converts None to a dummy zero-feature graph. This means those current offline bootstrap inputs do not contain the real nonterminal child features. These are source-level findings, not an independent reproduction or invalidation of historical result tables.

The code's generator/README uses 200 online instances versus the paper's 100. Some helper summaries reverse the time/node shifts or use time data for the returned node metric, while evaluate.py's final aggregation correctly reads saved node logs and uses shifts 1/10 as printed. Reproduction should use the final saved-log aggregation and make the chosen training instance count explicit. [official source files and saved local arithmetic check]

## Reproducibility

The article is formally published in AAAI 2025, volume 39(11), pp. 11212–11220, DOI 10.1609/aaai.v39i11.33219, on 2025-04-11. Both authors are at Carnegie Mellon University. The separate arXiv first submission is 2024-12-20; the complete identified v2 is dated 2025-02-25. All nine v2 pages, including both complete reference pages, were read. The publisher requests returned access challenges, so the accepted arXiv fallback supplies the scientific reading copy without an asserted byte-identical formal PDF.

The official repository was pinned to 82d155ed700fd276f4d4c1d7ce972f075090d95b (2025-05-04). Its archive has 53 members/38 files: fourteen Python files, eight shell scripts, ten task-specific weight files, one framework image, README/environment files, license and instances.zip. The nested archive has 500 LP instances and directories, with no scientific PDF, video or additional archive. Weights were inventoried and hashed without deserialization. The environment pins Python 3.8.17, Ecole 0.7.3, PySCIPOpt 3.5.0, SCIP 7.0.3 and Torch 2.0.1; this SCIP patch version differs from the paper's 7.0.1.

All scientific figures, equations, tables and the original Figure 1 were visually inspected. Both arXiv versions have nine pages; their saved text comparison found editorial corrections and no additional appendix. No separately named scientific supplement is referenced by the article or supplied in the author repository. Official Underline lecture 111768 is indexed with Slides and an automatic transcript, but live requests returned 404 and download links redirected to login; these presentation materials were not read or counted. Local checks cover scalar discounted-return accounting and the actual isolated shifted-geometric-mean helper only. No SCIP solve, neural training, checkpoint execution or benchmark reproduction was performed.
