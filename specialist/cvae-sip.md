---
id: cvae-sip
short_title: CVAE-SIP
title: Learning Scenario Representation for Solving Two-stage Stochastic Integer Programs
authors:
- Yaoxin Wu
- Wen Song
- Zhiguang Cao
- Jie Zhang
year: 2022
date: '2022'
publication:
  date: '2022'
  source_url: https://openreview.net/forum?id=06Wy2BtxXrz
venue: ICLR
paper_url: https://openreview.net/forum?id=06Wy2BtxXrz
institutions:
- Nanyang Technological University
- Shandong University
- A*STAR
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Integer Programming
problems:
- Two-Stage Stochastic Integer Programming
summary: Task-specific graph-conditioned scenario representations support weighted scenario reduction; a classical
  solver handles the reduced stochastic integer program.
code_url: https://github.com/WXY1427/Learning-to-solve-stochastic-integer-programs
---

# Learning Scenario Representation for Solving Two-stage Stochastic Integer Programs

> **TL;DR:** A graph-conditioned CVAE embeds uncertainty scenarios, then K-medoids selects weighted representatives for a smaller stochastic integer program. Optional semi-supervised objective prediction can help select scenarios, but neither reconstruction nor clustering supplies an original-problem approximation guarantee.

## Motivation

Two-stage stochastic integer programs combine discrete decisions with many uncertainty scenarios. Clustering raw scenarios ignores how the deterministic instance changes their optimization significance. This work learns scenario representations conditioned on that instance and uses an ordinary solver after reduction (Sections 1–3).

## Contributions

- A shared GCN processes either deterministic context alone or context plus a scenario, supporting a conditional variational autoencoder.
- **CVAE-SIP** clusters the two-dimensional learned latent representations; **CVAE-SIPA** augments them with a learned single-scenario objective estimate.
- Separate network-design and facility-location models are tested on larger graphs, more scenarios and selected shifted uncertainty distributions. These are within-task transfers rather than a common unchanged model across the two native problems.

## Methodology

**Graph and latent representation.** Complete graphs carry deterministic and uncertain node/edge features. The same ten-layer, 128-dimensional GCN embeds both the context and context/scenario pair, zero-padding absent uncertain features for the context-only pass. Separate projections give a two-dimensional Gaussian latent distribution and two-dimensional context code. A decoder with 128/256 hidden units reconstructs scenario parameters from their concatenation. GCN node/edge messages, residual connections, batch normalization and PReLU are detailed in Appendix A (Sections 4.1–4.2).

**Loss and supervision.** Training combines reconstruction MSE and Gaussian-prior KL regularization, with β=0.005. CVAE-SIPA adds a 512-hidden-unit objective-prediction head and supervised loss weighted by α=100. CPLEX provides optimal objectives for the deterministic problem consisting of one scenario plus its context, using only 1% of training instances. These labels are single-scenario optima, not the full stochastic optimum or the recourse value for an externally fixed first-stage decision. Each minibatch samples one scenario per instance; Adam uses batch 128 and learning rate 10⁻⁴ (Sections 4.1–4.3, 5.1).

**From embedding to decision.** K-medoids chooses original scenarios as representatives. Each representative receives its cluster's probability mass, N_k/N. CPLEX then optimizes the reduced weighted stochastic program, and the chosen first-stage solution is evaluated against the original scenario set. Objective prediction augments clustering features; it does not replace that final mathematical-program solver. The CVAE ELBO is a representation-learning objective, not a bound on decision error, feasibility under unobserved distributions or the original stochastic optimum (Equations 9–10).

**Problem-specific components.** NDP decides which transport edges to open before stochastic commodity demands; recourse routes flow with costly fallback/penalty treatment. FLP opens facilities before uncertain customer presence and assigns customers with extra-capacity penalties. Their node types, features, decoder outputs and training data differ. Parameter sharing refers to context/scenario processing within a model, not demonstrated shared weights across NDP and FLP (Table 1; Appendices B–D).

## Experiments

**Data and resources.** Each native problem uses 12,800 training instances with 200 scenarios: NDP has 14 nodes, including two sources, two targets and ten transit nodes; FLP has ten facility and twenty customer nodes. CVAE-SIP trains for 100 epochs and CVAE-SIPA for 400 on one RTX 2080 Ti. Testing uses a separate Xeon W-2133/Quadro P4000 machine. Main results average 200 normal-size test instances; size/scenario transfers use 50 instances per setting. Training/label-generation costs are not included in the short online table runtimes (Section 5).

**Error units and reference quality.** The defined error is |O(x_reduced)−O(x_reference)|/(|O(x_reference)|+10⁻¹⁰), evaluated under all original scenarios. It is a ratio: 0.24 means approximately 24%, not 0.24%. CPLEX supplies the reference; for FLP(120;200), its one-hour limit means the paper does not establish a proven optimum for every reference instance. Zero is also rounded in the tables. Reported average ratios cannot generally be reconstructed by taking a ratio of the reported average objectives (Section 5.1 footnote; Tables 2–4).

**Normal-size results.** Learned representations outperform raw K-medoids throughout Table 2, and generally improve as K increases. With K=20, NDP errors are 0.02/0.03 for CVAE-SIP/SIPA versus 0.08 for raw clustering; FLP errors are 0.23/0.15 versus 1.17, with roughly one-second online runtime versus CPLEX's eighteen seconds. This is useful acceleration with a quality trade-off, not uniformly near-optimal FLP performance. The paper's broad claim of superiority to both learning baselines has exceptions: for NDP K=5, Solution-M error 0.26 is better than CVAE-SIP's 0.48 (Table 2).

**Transfer and negative cases.** Networks trained on normal sizes run without retraining on NDP24/44 nodes, FLP60/120 nodes and 400/800 scenarios. CVAE-SIPA is not uniformly better: on FLP(120;200), K=5, its error is 3.13 versus CVAE-SIP 2.27; on NDP(44;200), K=10, it is 0.08 versus 0.06. CVAE-SIP also loses to raw K-medoids on NDP(44;200), K=5 (0.84 versus 0.38). Some scenario-count transfers likewise favor simpler baselines or the unsupervised variant. The authors associate these failures with degraded objective prediction, rather than claiming automatic transfer guarantees (Tables 3–4).

**Stronger OR comparisons.** Appendix I compares CSSC and distribution-oriented Scen-red. CSSC beats both neural variants on normal NDP K=5 (0.10 versus 0.48/0.24). Scen-red beats both on all normal-size FLP K values, including K=20 error 0.08 versus 0.23/0.15 at similar one-second runtime. For FLP120 K=5/10, both OR methods also outperform the learned methods; CVAE-SIPA leads the K=20 row with 0.22 versus Scen-red 0.26. Thus “best among all scenario-reduction methods” is not supported (Table 6).

**Additional analyses.** NDP tests Normal/Binomial demands and two explicitly constructed context-dependent demand ranges; performance remains mixed for small K. Prediction scatter plots show qualitative patterns for selected instances rather than a quantitative global error guarantee. Concatenating original scenario coordinates to learned representations usually hurts, but the NDP44 K=5 CVAE-SIP+Ori row slightly improves over pure CVAE-SIP, another exception to a blanket ordering (Appendices F–J; Figures 2–4; Tables 5–7).

## Limitations

### Discussed in the Paper

The number of representatives K remains manually chosen; automating it and extending beyond graph-based two-stage SIPs are future work. Objective-prediction accuracy may deteriorate on larger instances and worsen the augmented representation. Baselines with fixed output/scenario dimensions cannot all transfer to the larger problems (Sections 5.3, 6).

### Curator Notes

Reconstruction, two-dimensional clustering and a small labeled subset do not provide a worst-case stochastic optimization guarantee. The method still depends on representative selection, original-objective reevaluation and a classical reduced-problem solver. Preserve ratio units, reference-solver stopping conditions, significant FLP errors, OR baseline wins and offline training costs when describing speed/quality. Complete-graph node/edge representations also incur size-dependent memory and computation.

The printed NDP appendix contains notation/model ambiguities: its objective uses flow symbols inconsistent with the declared variables and a penalty variable without a scenario index. The released model implements costly direct origin–destination fallback arcs with continuous flow and per-unit shipping cost 1,000; it does not literally implement the printed binary source-penalty formulation. This is a source/implementation distinction relevant to reproduction, not evidence that the reported learned algorithm is invalid (Appendix B; official `network_design_problem.py`).

## Reproducibility

- **Publication:** [official ICLR 2022 listing/poster](https://iclr.cc/virtual/2022/poster/7065) and [OpenReview record](https://openreview.net/forum?id=06Wy2BtxXrz); four authors and the three affiliations match the reviewed paper and coauthor publication page. The note retains year-level date precision because an exact publication date was not verified here.
- **Reading:** complete nineteen-page accepted-version PDF, including references and integrated Appendices A–J, all formulas, tables and figures. The cached public mirror explicitly carries the ICLR 2022 publication header. Direct publisher PDF and both normal OpenReview API endpoints currently require browser verification; this audit does not claim byte identity to a freshly downloaded publisher file. Manual publisher/API, official conference and author/repository checks identified no additional scientific attachment beyond the integrated appendices.
- **Code:** [author-confirmed implementation](https://github.com/WXY1427/Learning-to-solve-stochastic-integer-programs), linked by the coauthor's publication page and README. It contains NDP/FLP training and test notebooks, network modules and stochastic-program models. Its additional contrastive-learning folder is explicitly extra to the paper's CVAE method; it must not be attributed to the published CVAE experiment without separate evidence. The directory name `flp_10_40` also does not by itself establish the paper's stated ten-facility/twenty-customer setting.
- **Citation graph:** nine exact catalogue papers are explicitly cited in the body and matched to the bibliography. Bibliographic venue/name errors are preserved as provenance rather than substituted with unrelated papers.
