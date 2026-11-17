---
id: learning-branching-policies-for-milps-with-proximal-policy-optimization
short_title: TGPPO
title: Learning Branching Policies for MILPs with Proximal Policy Optimization
authors:
- Abdelouahed Ben Mhamed
- Assia Kamal-Idrissi
- Amal El Fallah Seghrouchni
year: 2026
date: '2025-11-17'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/39619
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/39619
institutions:
- Ai movement, University Mohammed VI Polytechnic
- LIP6, Sorbonne University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
- Set Covering
- Capacitated Facility Location
- Combinatorial Auctions
- Scheduling MILPs
summary: A shared PPO-trained, tree-gated Transformer selects branching variables across heterogeneous MILPs; high
  per-instance win rates coexist with weaker overall geometric means than TBRANT under a known-optimum cutoff protocol.
arxiv_url: https://arxiv.org/abs/2511.12986
code_url: https://github.com/benmhamed-a/tgppo-aaai-26
figure:
  path: paper-assets/learning-branching-policies-for-milps-with-proximal-policy-optimization/framework.png
  alt: TGPPO actor, SCIP solver, state builder, reward shaper and PPO trajectory-update dataflow.
  caption: Original Figure 1 architecture, rendered from the author camera-ready archive. The current implementation
    instantiates separate actor and critic encoders.
  source_url: https://github.com/benmhamed-a/tgppo-aaai-26/blob/4f90ccddd7999779c93ff2425ca8dd056113a523/crc/AAAI_26_Camera_Ready_8_Pages.zip
---

# Learning Branching Policies for MILPs with Proximal Policy Optimization

> **TL;DR:** TGPPO trains one branching policy on a heterogeneous MILP collection using PPO and tree-gated attention. It beats TBRANT on most reported instances, while the reported overall geometric means favor TBRANT. The experiment supplies an optimal-objective cutoff and disables primal heuristics, so it does not establish a speedup for an ordinary end-to-end solver.

## Motivation

Branching-variable selection changes the size and progress of a branch-and-bound search. The authors seek to learn directly from SCIP trajectories rather than imitate strong-branching labels, while handling variable-sized candidate sets and varying problem structure. The motivation concerns a learned component of an exact solver; the network itself does not certify an optimal solution. [arXiv pp. 1–3]

## Contributions

- Introduces Tree-Gate PPO, combining an on-policy actor–critic objective with candidate self-attention, tree–candidate matching and a tree-conditioned branching head.
- Compares three normalized reward families, selecting the difficulty-adaptive H3 formulation through hyperparameter search.
- Evaluates a shared policy on a curated mixture of MILP applications, reporting instance-level wins, geometric aggregates and rank-based tests separately. These are empirical results, without a new approximation or PPO convergence theorem. [pp. 2–7, 9–11]

## Methodology

SCIP exposes 25 features per fractional branching candidate, eight current-node features and 53 MIP/tree features. Linear embeddings and layer normalization put these features into a common space. The actor concatenates each candidate embedding with tree context, applies a masked Transformer encoder, refines candidates with bidirectional matching, and multiplies successive branching-head representations by sigmoid gates derived from the tree context. A softmax over candidate logits samples the next branching variable. The critic pools valid candidate representations and predicts a scalar value. The candidate-set operations are intended to be permutation equivariant, with an invariant pooled critic. [pp. 3–4, Eqs. 3–5; Fig. 1]

PPO uses the clipped probability-ratio objective, an entropy bonus and a value regression term, with generalized advantage estimates. Rewards normalize search statistics against RELPSCOST baselines. H3 combines node efficiency, a pace term, a current-gap penalty, PDI/progress shaping and a status-dependent terminal reward. Appendix A supplies the H1–H3 equations, although the progress quantity q_t is not fully specified there. The published algorithm describes a rollout horizon and periodic updates; reproducing it also requires the supplied implementation and solver hooks. [pp. 3–5, 8–9]

**Classification: Generalist / constructive.** Sections 4.3 and 5.1 describe a single final policy trained on all 25 heterogeneous training MILPs, including covering, facility-location, auction and scheduling formulations, and evaluated across the heterogeneous test set. The current evaluator also loads the same checkpoint for all instance jobs. This is shared learned branching across native MILP application structures, rather than separate models that merely use the same architecture. The neural action extends a partial branch-and-bound assignment; it is not an incumbent-editing policy. [pp. 5–6; official code, test.py]

## Experiments

The curated benchmark has 25 training instances and a declared 66-instance test list from MIPLIB and CORAL. Five SCIP seeds augment each training instance, without creating 125 distinct underlying MILPs. Hyperparameter selection uses a stated 5-by-2 nested cross-validation protocol and a composite node/PDI score. The final configuration has width 256, five Transformer layers, eight heads, dropout 0.05, actor/critic learning rates 2.4e-4/1.2e-4, PPO clip 0.16, entropy weight 0.003, gamma 0.97, GAE lambda 0.92, batch size 256 and three optimization epochs. Final training is reported as 500 complete episodes on 40-core CPU nodes. [pp. 5–6]

Evaluation uses SCIP 6.0.1, a customized PySCIPOpt interface, five seeds and a 3,600-second limit. Primal heuristics are disabled and a known optimal objective is supplied as a cutoff. Nodes are compared on the easy subset and PDI on the hard subset. Node aggregates use a shift of 100; PDI uses zero shift. This isolates branching under an expert cutoff and is not the usual setting of discovering a good primal solution from scratch. [pp. 5–6]

Table 3 reports wins over TBRANT on 78.8% of easy instances and 90.62% of hard instances. The official raw workbooks, independently aggregated without changing their values, contain 33 easy and 32 hard instances, eight policies and five distinct seeds per policy/instance: 1,320 and 1,280 rows respectively. They reproduce 26/33 node wins and 29/32 PDI wins. The hard percentage therefore uses 32 instances, despite the prose stating 33 and 165 hard runs. [p. 6; official finished_instances.xlsx and timelimit_instances.xlsx]

The overall picture differs from the win counts. Appendix Tables 5–6 report TGPPO/TBRANT node aggregates of 1,588.72/1,318.33 and PDI aggregates of 2,945.33/2,922.72, both favoring TBRANT. Aggregating the current raw workbooks gives approximately 1,588.706/1,318.327 and 2,945.332/2,922.721. Against RELPSCOST, TGPPO wins only 18.2% by nodes and 46.87% by PDI. Table 4's Nemenyi comparison with TBRANT is not significant on easy instances (p=0.5), but is significant on hard instances (p=0.0046); the paper's easy-subset Holm-adjusted Wilcoxon p-values are 0.09–0.11. High win rates should not be presented as universal or aggregate dominance. [pp. 6–7, 10–11]

## Limitations

The small curated training set, known-optimum cutoff and disabled primal heuristics limit deployment conclusions. The paper itself leaves full system wall-clock/memory assessment and interactions with other solver components for future work. Its selection criterion uses outer-fold scores to choose the final configuration, so those outer-fold scores should not be treated as a fully untouched estimate after model selection. Final held-out test instances remain a separate evaluation. [pp. 5–7]

**Curator source crosscheck:** Some appendix entries and names disagree with the current official workbooks. For example, Table 5 prints 111,624.42 TGPPO nodes for neos-1200887, whereas aggregating the released five runs gives 11,164.42. Table 6 labels a row bell4 where the workbook uses biella1, and its per-instance values also differ. The printed overall summaries and raw summaries are therefore recorded separately rather than silently substituting one version for the other. The raw status labels include many infeasible outcomes under the supplied objective cutoff; these labels should not be read as evidence that the original curated feasible MILPs are infeasible. [pp. 6, 10–11; official raw workbooks]

The appendix's H3 formula and current code are not identical. The paper uses a sigmoid difficulty mapping and does not explicitly renormalize the displayed weights; reward.py uses a clipped linear mapping and normalizes their sum. The code also implements a difficulty-dependent pace exponent and additional bound-progress terms. These differences limit an exact historical reconstruction; they do not establish that the reported experiments are invalid. [p. 9; official reward.py]

## Reproducibility

The formal publication is AAAI 2026, volume 40(29), pp. 24379–24387, DOI 10.1609/aaai.v40i29.39619, with publisher-deposited online date 2026-03-14. The independently identified arXiv v1 dates to 2025-11-17 and contains eleven pages including references, reward formulas and per-instance result tables. The publisher page/PDF returned an access challenge, so the complete arXiv version is the scientific reading source, under the accepted fallback policy. Full bylines and affiliations were checked against both accessible PDFs rather than shortened publisher metadata.

The author repository was inspected at commit 4f90ccddd7999779c93ff2425ca8dd056113a523, dated 2026-04-08. Its eight-page camera-ready PDF was read completely. Its eleven-page extended PDF was compared page by page with the read arXiv copy: rendered pages 2–11 are pixel-identical, and page 1 differs only in the left-side arXiv watermark. The camera-ready ZIP contains LaTeX/bibliography/style files and three standalone figure PDFs, all inspected; five additional plot PDFs were also inspected. Both raw XLSX files were fully parsed from their original OOXML and all policy/instance/seed groups were aggregated, with no workbook edits. This is structured complete-data inspection, not a claim of visually reviewing every cell.

The code includes actor/critic modules, branching/environment hooks, reward functions, parallel training/tuning/testing and a pinned customized ds4dm/PySCIPOpt commit. The current actor and critic instantiate separate encoders, despite the paper's shared-front-end description. No trained checkpoint is present in the inspected repository tree, although test.sh expects one; data are linked externally through Mendeley. The current R plotting script contains machine-specific paths. No solver training or end-to-end performance reproduction was run in this review. All scientific PDF pages were read, key equations/results were rendered, and the repository/ZIP inventory, raw-data recomputation and exact source hashes are retained in the review cache.
