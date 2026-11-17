---
id: dynsep
short_title: DynSep
title: Dynamic Configuration for Cutting Plane Separators via Reinforcement Learning on Incremental Graph
authors:
- Mingxuan Ye
- Jie Wang
- Fangzhou Zhu
- Zhihai Wang
- Yufei Kuang
- Xijun Li
- Weilin Luo
- Jianye Hao
- Feng Wu
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/c88f029bcf6d62b57a17ae88101ac7d0-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/c88f029bcf6d62b57a17ae88101ac7d0-Abstract-Conference.html
institutions:
- University of Science and Technology of China
- Huawei Noah's Ark Lab
- Shanghai Jiao Tong University
- Tianjin University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Incremental-graph PPO controls SCIP separator scheduling and node round caps; unchanged-policy cross-family
  tests support a shared configuration component, with negative transfer, large small-instance overhead and appendix
  reporting limits.
code_url: https://github.com/MIRALab-USTC/L2O-DynSep
---

# Dynamic Configuration for Cutting Plane Separators via Reinforcement Learning on Incremental Graph

> **TL;DR:** A learned incremental-graph/Transformer component changes SCIP separator activation and scheduling across cut rounds. Explicit unchanged-policy cross-family tests support generalist scope, while classical branch-and-cut constructs solutions; substantial small-instance inference overhead, negative transfer and inconsistent appendix cells qualify the reported efficiency gains.

## Motivation

Separator usefulness changes as LP relaxations, local bounds and generated cuts evolve. A configuration chosen once at the root cannot express round-specific early/deferred/off decisions. Re-encoding the full growing MILP graph is also expensive. DynSep therefore learns configuration from incremental changes while retaining historical round representations. The motivating best-of50 random configurations are selected per instance and are an oracle analysis, distinct from the deployable Search(50) baseline selected on a validation subset (Sections1–3, AppendixE.1).

## Contributions

- A variable/constraint/**separator** tripartite graph records new cuts and changed solver features, rather than an objective-node graph or a neural cut generator.
- A decoder-only Transformer aggregates incremental round token blocks, with shared within-round positions and a block-causal mask.
- PPO learns22 ternary separator decisions and a node-level maximum-round choice, retaining ordinary SCIP cut generation and branch-and-cut.
- Native-family, size, cross-family unchanged-policy and mixed-MIPLIB transfer experiments establish a shared learned configuration component, with both positive and negative outcomes (Sections3–4/AppendicesA–E).

## Methodology

**State and incremental encoding.** At a node, the first input contains the full current tripartite graph. Later inputs contain new cut rows, corresponding incidences and updated bound/LP/statistical features. Variable–constraint coefficient edges and separator-origin relations support typed message passing. Separator nodes carry identity and statistics including calls, time, cuts, applications, domain reductions and cutoffs; graph scalars include dual degeneracy and the ratio of unfixed variables to LP basis size. Typed message paths V→C→V, S→V→S and S→C→S plus separator attention/global pooling yield a graph token and22 separator tokens per round (Sections3.2/3.4, AppendixB/Table4).

Each23-token block has a common round positional encoding. Block-causal attention sees all tokens in its own and earlier rounds. Four Transformer layers, four heads,64-dimensional embeddings and256-dimensional feed-forward layers summarize the within-node history. Actor and critic have separate Transformers. The actor concatenates the current block's hidden states before a joint linear head; the critic reads its graph token. This is historical context **within a node/episode**, not a memory of the complete global B&B tree (Section3.4/AppendixD.1).

**Actions and training.** Each separator receives η in{−1,0,+1}: deferred, disabled or early activation. A categorical choice sets maximum rounds in1…5. Crucially, only the first-round maximum-round decision at a node is applied; later maximum-round outputs do not implement a fresh adaptive stop decision every round. Existing solver stopping conditions can also terminate separation. Configuration is applied at depth frequency10. The PPO reward combines normalized incremental solving time, relative dual-bound improvement and separator utility; it is a shaped empirical objective rather than a guaranteed runtime reduction. The training recipe uses100epochs,16 sampled instances per epoch, Adam1e−4, PPO clipping.2 and learning-rate decay.96 every five epochs (Sections3.3–3.5/AppendicesB.4/D.1–D.2).

**Equivariance scope.** Proposition1 establishes blockwise permutation equivariance of the hidden Transformer with identical within-block positions, a block-compatible mask and shared rowwise operations. This structural statement is not an optimization, runtime or approximation guarantee. It also does not by itself prove equivariance of the complete actor's arbitrary flattened joint linear head: the released decoder explicitly uses a Linear(23*d, outputs) after concatenation. No corresponding head weight tying is established. The standard attention permutation argument supports the hidden-state statement despite abbreviated matrix manipulations in the printed proof (AppendixA, rendered pp23–24; decoder_only_transformer.py153/218–221).

**Classification.** The neural component controls separation in a classical solver before/through solution search, without editing a complete feasible incumbent, supporting **constructive**. AppendixE.7.1 explicitly trains four source-family checkpoints(SC, knapsack, MIK, supportcase), then applies each learned policy unchanged across the other benchmark families. E.7.2 also trains one configuration policy on168 MIPLIB instances and tests without tuning on CORLAT, load balancing, maritime inventory routing(MIRP) and seismic-resilient pipe-network planning(SRPN). These actual shared-component experiments support **generalist**, rather than inferring it from generic MILP syntax or heterogeneous data alone. Main per-family models remain separate. Shared neural separator configuration plus SCIP is the demonstrated capability, not a universal end-to-end solution decoder (pp37–39; classification independently page-checked by the root reviewer).

## Experiments

**Protocol and comparisons.** Main tests use SCIP8.0.0,22 built-in separators, at most five cut rounds and300seconds, with presolve and primal heuristics enabled. Nine families span SC, MIS, multiple knapsack, CORLAT, MIK, Anonymous, load balancing and two Distributional-MIPLIB collections(neos/supportcase). Main datasets use80/20 train/test splits; the best training checkpoint is selected by training performance. Search(50) chooses one of50 random configurations on a validation subset drawn from training, and Prune disables separators with zero measured contribution on that subset. L2Sep baselines are adapted to the same300second solver settings and active frequency10. LLM4Sep uses DeepSeek Chat with problem/separator descriptions. Easy/medium experiments use RTX2080Ti/XeonE5-2667v4 hardware; hard experiments use3090Ti/XeonGold6246R hardware (Section4/AppendixD).

**Means and reference.** Table1 reports DynSep times1.51/.53/.52/22.96/10.99seconds on SC/MIS/knapsack/CORLAT/MIK. Hard-family PD integrals are15656.70/3720.26/8511.58/9212.24. The headline64% easy/medium time and16% hard integral improvements are comparisons against learning baselines under the paper's aggregation; the table's Improv. columns instead use NoCuts as reference. They are not certified-optimum speedups or a guarantee against every solver configuration. MIK illustrates the difference: DynSep is fastest at10.99seconds but has PD integral134.15, worse than L2Sep-R2's44.69 and default82.80. Anonymous Prune has slightly lower mean time241.75 versus241.89, though a worse integral. Load-balancing runs mostly hit300seconds, so its integral improvement is not a comparable solved-instance runtime gain. Large standard deviations remain visible (Table1).

**Size and ablation limits.** Larger native-family tests reuse the smaller-family policy. The largest printed MIS case has1500 variables/5940 constraints versus training500/1953; the label9x should not be rewritten as nine times as many variables or constraints. Full components do not win every metric: noBlockPE gives neos integral8291.49 versus full8511.58; removing incremental graph and Transformer gives SC1.23seconds/integral29.33 versus full1.51/33.88; removing Transformer gives MIS.44/9.16 versus.53/9.66. Additional parameter-group variants also trade time against integrals. Group1 and Group3 list the same two SCIP parameters in the prose despite differing descriptions, so that paragraph alone is insufficient to reproduce distinct groups (Tables2–3/9/14–16).

**Unchanged-policy transfer.** SC-trained policy gives MIS1.00seconds versus default30.40 and knapsack.68 versus2.01, but MIK24.80 versus default16.65 and integral139.10 versus82.80. The supportcase-trained policy gives MIK163.60/785.46, a substantial negative transfer. Conversely, MIK-trained policy gives SC7.74seconds versus default5.24 despite a better integral80.78 versus95.56. Thus transfer is real and frequently useful but not uniform. The mixed-MIPLIB model yields MIRP487.59seconds/integral33193.25 versus default580.98/52362.46, and SRPN288.48/7582.60 versus332.04/11687.01 (Tables17–18).

**Additional MIPLIB reporting.** Separately trained MIRP/SRPN tests use600seconds. Whole-MIPLIB Table8 reports238.88seconds/integral15092.16 versus default258.77/17153.69, but explicitly averages **all235 instances** after a70/30 training/test split, so this is not a clean held-out235-instance statistic. The prose says five exclusions and235 remaining from240 but lists six names; retain this unresolved source inconsistency rather than silently selecting a denominator. Table18's rendered CORLAT/LB default rows visibly repeat the easy SC/MIS values, with a stray knapsack row; its accompanying all-four-domains-dominance sentence cannot be numerically verified from those cells. Do not compute CORLAT/LB gains from that malformed table (pp34/39).

**Overhead and memory.** Per-call mean latency is.05–.41seconds except load balancing3.04, with worst supportcase6.85seconds. More importantly, Table11 gives total inference fractions69.54%/77.36%/80.77%/72.13% for SC/MIS/knapsack/CORLAT,14.29% for MIK and3.51–10.69% on the four hard families at300seconds. Therefore negligible overhead is inaccurate as an all-dataset statement. At3600seconds hard-family fractions drop to.44–3.19%; MIRP/SRPN600second fractions are6.80/1.72%. The paper distinguishes SCIPsepaGetTime aggregate inference timing from logged wall-clock per-call timings; those quantities should not be directly summed/interchanged. Reported model weights are2.08MB, overall peak GPU allocation15.68–257.60MB, and CPU memory roughly2.8–4.9GB, rather than presenting2MB as whole-process memory (Tables10–13).

## Limitations

### Discussed in the Paper

The policy lacks an efficient summary of the global B&B search tree. More lightweight encoders and broader solver-parameter control are future directions. Frequency, round caps and extended parameter groups have empirical trade-offs; extra rounds or every component can hurt individual instances/families. Histories and actions remain tied to the solver's exposed separators/features.

### Curator Notes

SCIP's exactness comes from its own valid cuts, branching, bounds and termination, not from PPO or Proposition1. A finite time limit can leave nonzero/infinite gaps. Table6 includes sentinel-scale gaps near1e19 for missing bounds/solutions; these should not be read as ordinary precise objective errors. Generalization results preserve negative transfer, and the held-in MIPLIB aggregate and malformed Table18 cannot substantiate unrestricted held-out superiority.

The appendix's frequency prose is inconsistent: p24 describes frequency0 as firing everywhere, while p25 uses0 for disabled; actual code correctly uses−1 to disable and positive10 to activate, and comments identify0 as root-only. Released priority is default_priority*η, which is not an absolute universal positive/negative priority guarantee without inspecting each default. Algorithm1 prints an ascent-style update for a squared critic error; actual algorithms.py205–209 uses ordinary positive-MSE backpropagation/optimizer descent. These are specific paper/code distinctions, not evidence that all reported experiments failed. Reward relative-bound division uses a1e−6 denominator guard in code, which does not create a global boundedness or monotonicity theorem. No solver run/checkpoint benchmark was executed in this audit.

## Reproducibility

- **Publication/identity:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/c88f029bcf6d62b57a17ae88101ac7d0-Abstract-Conference.html), volume38, pp137309–137349, DOI10.52202/085713-4582. Official HTML citation_publication_date is **April23,2026**, distinct from the conference year. PDF/poster identify third author **Fangzhou Zhu**, correcting the official HTML's duplicated Fangzhou metadata; nine authors/four institutions checked.
- **Scientific coverage:** all41 formal pages, full bibliography/checklist/AppendicesA–E8 read. Official413988byte supplemental ZIP contains a20page appendix PDF. Every full page text and RGB rendered pixel buffer is identical to formal pages22–41: mapping supplement1→formal22 through20→formal41, both file SHAs and every text/pixel SHA are saved in duplicate-appendix-page-proof.json. Supplement coverage explicitly reuses those completely read identical pages rather than claiming an independent second reading. Key formulas/tables/transfer pages were rendered. Official NeurIPS event116555 poster6619316bytes was fully inspected; event links OpenReview iXjVis9Cwn.
- **Implementation:** [author repository](https://github.com/MIRALab-USTC/L2O-DynSep), complete62member153889byte archive/README inventoried, with no additional PDF/TeX/notebook/scientific image. The custom [PySCIPOpt binding](https://gitee.com/heronland/pyscipopt-dynsep) landing page/complete README was also read; it is a solver interface dependency rather than an additional scientific supplement. Checkpoint loading in eval_best_model.py272–296, ternary/frequency/maxround mapping in sepasel_agent.py, PPO descent, actor concatenation and block mask/positions were checked. README requires Python3.8/CUDA11.7/PyTorch1.13/SCIP8.0/customPySCIPOpt4.1 and links external datasets; archive availability alone does not establish exact historic benchmark reproduction.
- **Relations:** eight catalogue identities are verified against explicit numbered in-text citations and the full references. The HEM edge is supported **only by[33]**, whose bibliography onp12 explicitly gives the eight authors, exact ICLR2023 title and OpenReviewZob4P9bRNcK. Bodypp7–9/29 independently cite[33]. Reference[42] onp13 is the distinct ten-author TPAMI2024 journal extension *Learning to Cut via Hierarchical Sequence/Set Model for Efficient Mixed-Integer Programming*; it is not merged into the HEM stable ID and generates no additional catalogue edge. Other noncatalogue cut-generation/control works and classical/solver citations are not converted into invented internal nodes.
