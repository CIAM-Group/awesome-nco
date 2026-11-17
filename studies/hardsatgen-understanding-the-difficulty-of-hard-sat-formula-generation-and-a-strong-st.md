---
id: hardsatgen-understanding-the-difficulty-of-hard-sat-formula-generation-and-a-strong-st
short_title: HardSATGEN
title: 'HardSATGEN: Understanding the Difficulty of Hard SAT Formula Generation and A Strong Structure-Hardness-Aware
  Baseline'
authors:
- Yang Li
- Xinyan Chen
- Wenxuan Guo
- Xijun Li
- Wanqian Luo
- Junhua Huang
- Hui-Ling Zhen
- Mingxuan Yuan
- Junchi Yan
year: 2023
date: '2023-02-04'
publication:
  date: '2023-08-04'
  source_url: https://doi.org/10.1145/3580305.3599837
venue: KDD
paper_url: https://doi.org/10.1145/3580305.3599837
institutions:
- Shanghai Jiao Tong University
- Huawei Noah’s Ark Lab
scope: study
paper_type: benchmark
problem_families:
- Constraint Satisfaction
problems:
- Structure- and Hardness-Aware SAT Instance Generation
summary: A neural two-stage clause-merging generator retains and scrambles unsatisfiable cores, controls communities
  and uses solver-guided post-processing to match industrial SAT structure/hardness; the output is benchmark data,
  with solver tuning evaluated downstream rather than a learned SAT solver.
arxiv_url: https://arxiv.org/abs/2302.02104
code_url: https://github.com/Thinklab-SJTU/HardSATGEN
figure:
  path: paper-assets/hardsatgen-understanding-the-difficulty-of-hard-sat-formula-generation-and-a-strong-st/framework.png
  alt: A retained-core graph template is scrambled and processed by separate neural in-community and cross-community
    clause-merging stages.
  caption: 'Original Figure 6: the multi-stage SAT instance generation pipeline.'
  source_url: https://arxiv.org/pdf/2302.02104v3#page=6
---

# HardSATGEN: Understanding the Difficulty of Hard SAT Formula Generation and A Strong Structure-Hardness-Aware Baseline

> **TL;DR:** HardSATGEN augments industrial SAT instances by retaining a known unsatisfiable core, scrambling it, and learning community-controlled clause merges. Classical solver/core-checker post-processing adjusts the generated instances' runtime. This is an original neural **instance-generation method**, catalogued under studies/benchmarks; it does not itself predict satisfying assignments or replace a SAT solver.

## Motivation

Industrial CNFs can differ from random SAT instances in both structure and solver difficulty. Earlier neural split–merge generators may reproduce graph statistics while producing formulas that classical CDCL solvers solve much faster. The paper argues that over-splitting loses rigid logical substructures and encourages homogeneous merges. PCA of learned clause embeddings provides an empirical illustration, not a proof that this mechanism universally determines hardness. [Read v3 pp. 1–4]

## Contributions

- Analyzes structural/hardness mismatch in one-stage SAT instance generators.
- Preserves an unsatisfiable core and adds community nodes to literal/variable–clause graphs.
- Learns separate within-community and cross-community merging policies, with tunable phase lengths and core scrambling.
- Evaluates graph statistics, classical solver runtimes/rankings and downstream solver hyperparameter tuning on public and corporate instance families. [Read v3 pp. 2–9]

## Methodology

Community detection runs on the variable-incidence graph. CaDiCaL and DRAT-trim identify an unsatisfiable clause subset; non-core clauses are split first across communities, then internally. The inverse generation process uses two GNNs to score candidate clause pairs by a sigmoid inner product. Node types are positive literal, negative literal, clause and community. Three-layer GCN or GraphSAGE networks map four-dimensional type indicators to 32-dimensional features; binary cross-entropy learns original versus negative merge pairs. [Read v3 pp. 4–6, 11]

Generation retains the template's core, randomly permutes variable/clause identities and consistently flips literal phases. It then merges within and across communities. A phase parameter α controls cross-community steps: n1=m1+(1−α)m2 and n2=αm2. The default experimental values are 1.2 for MP1 and 0.9 for SP4/LEC-CORP. Inference picks the highest-scoring pair among 100 sampled candidates. Each dataset is trained separately for 200 epochs at learning rate 0.001; this is not one checkpoint generating or solving several native optimization problems. [Read v3 pp. 5–7, 11]

Hardness adjustment is partly **classical, solver-guided processing**. Repeated solving/core detection finds unwanted small cores; a clause outside the protected core is weakened with an auxiliary variable. Appendix A.4 stops when a manually selected runtime threshold is reached. The pipeline therefore requires solving source/generated formulas and cannot be described as a cheap neural forward pass that independently learns hardness. Preserving a valid unsatisfiable core preserves UNSAT, but does not prove a desired runtime distribution; the optional SAT-producing modification needs a different core treatment. [Read v3 pp. 5, 11]

## Experiments

Training/evaluation use separate MP1 and SP4 SAT-competition families and private LEC-CORP multiplier-equivalence instances. The main tables contain three MP1, three SP4 and eight corporate templates, with original CaDiCaL runtimes spanning roughly fourteen to 411 seconds. Formula sizes are hundreds to about two thousand variables. RTX 3090 supports the public-family experiments and V100 the corporate experiments. The paper does not provide a complete held-out generation protocol, total end-to-end generation cost, number of repetitions behind every uncertainty entry or full preprocessing/post-processing budgets. [Read v3 pp. 7–9, 11]

Structural comparisons include CA/PS handcrafted generators and G2SAT/GCN2S/EGNN2S/ECC2S neural baselines. The reported **38.5% average relative-error reduction** concerns selected graph statistics, not SAT accuracy. Performance is not uniformly best: on MP1, prior GCN2S has VIG modularity error 2.99% versus 7.46% for HardSATGEN; some backbone/metric combinations likewise regress. Matching marginal graph statistics is not a test that the full generated distribution equals the source distribution. [Read v3 pp. 7–8, Table 2]

The **88.4% average reduction in runtime-matching error** compares generated instances with their source templates. For example, MP1-1 has source time 55.68 seconds and SAGE mean 53.29, whereas many baseline means are under a second. Other templates show larger discrepancies; SAGE MP1-3 is 578.51 versus source 410.70. The goal is matching difficulty, not faster solving of generated data. Glucose's corporate lec-6 entry is censored at 1,200 seconds for source and both model backbones, so its printed zero relative error does not prove equal uncapped hardness. [Read v3 pp. 8–9, 12, Tables 4, 6–7]

Solver-ranking results require a source caveat: Table 3 reports 100% recovery, while Appendix Table 8 lists lec-6 as (CaDiCaL,Kissat,Glucose) for HardSATGEN versus (Kissat,CaDiCaL,Glucose) for ground truth. The unqualified “all templates” prose conflicts with that displayed row. Backbone choice is not specified for the aggregate HardSATGEN ranking; the review reports the inconsistency instead of silently correcting the experiment. [Read v3 pp. 8, 12]

For downstream tuning, each method generates five times the original dataset size. MP1 tunes Glucose variable/clause decay over 49 configurations; LEC-CORP tunes three CaDiCaL parameters with HEBO and a 1,000-second limit. Table 5 reports mean test runtime 642.056→499.583 seconds on MP1 (22.19% reduction) and 62.344→52.972 on corporate data (15.03%). The headline 140.7% is a **relative improvement of the tuning gain** over a 9.22% competing gain, not a 140.7% runtime reduction. Corporate-data tuning with several baselines makes runtime worse, including PS at −143.50%. These results concern classical solvers configured using generated data. [Read v3 p. 9]

## Limitations

Core/template reuse, manually tuned runtime thresholds and repeated solver calls make it important to separate learned structural generation from inherited logical difficulty and post-selection. No ablation fully attributes total hardness matching or generation cost to the neural component alone. The paper's Markov factorization is a modeling assumption for the merge sequence, not a proof of exact likelihood over all graph-generation paths.

Runtime depends on solver, configuration and hardware. Small template sets, private corporate data, capped observations and incomplete diversity/deduplication reporting restrict broad distributional claims. Stronger structure or runtime matching does not show success at arbitrary SAT solving, guaranteed novel hard instances or universally beneficial solver tuning. The printed ranking inconsistency and nonuniform metric results remain visible. Separate trained generators are not a shared multi-task SAT solver.

## Reproducibility

The complete twelve-page arXiv v3 was read, including all fifty references and Appendices A.1–A.5, B.1–B.2 and C.1–C.4. The architecture, core modification, probability/model formulas, structural table, runtime/tuning tables, learning curves, graph visualizations and ranking appendix were rendered and visually checked. The image is an original Figure 6 crop. An ordinary public mirror retrieved during source search is byte-identical and is not double-counted.

The primary arXiv history has v1 on 2023-02-04, a withdrawn v2 on 2023-02-11, and restored full v3 on 2024-02-08. The actual reading source is identified as v3; its bytes are not asserted to match the unavailable formal PDF. Formal KDD eligibility is independently supported by the DOI record and author publication entry. Crossref records online publication on 2023-08-04 and print on 2023-08-06; the earlier explicit online date is used. The nine-author byline lists Shanghai Jiao Tong University and Huawei Noah's Ark Lab, with Junchi Yan corresponding. Publisher main/HTML access returned 403; no missing independent scientific appendix is explicitly referenced beyond the integrated, read A–C.

Official code was inventoried at fd029777b1cba60a557f9de3754ab0f085a58ed4 (2023-06-16): 87 archive members, 67 files, no PDF/TeX/video/scientific archive. It contains eight CNFs, sample cores/graphs and no trained checkpoint or private LEC-CORP dataset. README, runtime-threshold shell processing and the invoked auxiliary-literal function were checked. The shell adds a fresh variable on the first pass and reuses it on later passes; this is more specific than prose suggesting a new variable at every step. Its README Glucose grid also differs from the article's 49-combination grid. These are current-release boundaries, not a reconstruction or rejection of the historical experiment. No training, solver run, corpus generation or tuning was rerun. Confirmed internal references have body and complete bibliography evidence; absent/deferred targets remain external.
