---
id: fmip
short_title: FMIP
title: 'FMIP: Joint Continuous-Integer Flow For Mixed-Integer Linear Programming'
authors:
- Hongpei Li
- Hui Yuan
- Han Zhang
- Jianghao Lin
- Dongdong Ge
- Mengdi Wang
- Yinyu Ye
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/f5a24b8fa97f7073aff5e8baadf583f1-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/f5a24b8fa97f7073aff5e8baadf583f1-Abstract-Conference.html
institutions:
- Shanghai University of Finance and Economics
- Princeton University
- National University of Singapore
- Shanghai Jiao Tong University
- Shanghai Institute for Mathematics and Interdisciplinary Sciences
- Stanford University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Joint integer/continuous flow generates candidates for classical MILP restricted search; reported cross-controller
  primal gains have explicit guidance-specification, BKS/budget, scalability and current-code limits.
code_url: https://github.com/Lhongpei/FMIP
figure:
  path: paper-assets/fmip/framework.png
  alt: Joint continuous-integer flow and solver-guided MILP inference in FMIP.
  caption: 'Figure 2: Joint continuous-integer flow and solver-guided MILP inference in FMIP.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/f5a24b8fa97f7073aff5e8baadf583f1-Paper-Conference.pdf
---

# FMIP: Joint Continuous-Integer Flow For Mixed-Integer Linear Programming

> **TL;DR:** A joint discrete/continuous flow model generates both variable types, using instance objective and violation feedback before classical restricted solving. Reported gains span eight benchmark groups and four solver controllers, with important distinctions between feasible primal results and generated candidates, relative versus percentage-point gains, and printed formulas versus current code.

## Motivation

Integer-only generative models omit the continuous completion that determines a mixed-integer assignment's cost and feasibility. FMIP studies a joint candidate distribution so both types can contribute to generation and instance-specific guidance. Its contribution is this joint representation/generation pipeline; it does not replace an exact MILP backend or certify an optimum through a neural sample (Sections1–3/AppendixH).

## Contributions

- A time-dependent bipartite coefficient graph distinguishes integer, continuous and constraint node types.
- Shared graph features feed an integer categorical head and a continuous regression head, trained jointly along discrete and continuous corruption paths.
- Objective/violation guidance combines continuous gradient updates with integer candidate sampling/reweighting.
- Integrations with four classical-solver controllers, four graph backbones, eight benchmark groups and additional large-instance analyses.

## Methodology

**Graph and flow.** Static variable features are objective coefficient, lower/upper bounds and two finite-bound indicators; the current candidate value supplies a sixth feature. Constraints have RHS features and edges carry coefficients. The default typed Tri-GCN remains bipartite: integer/continuous sources have distinct parameters, gated aggregation, residual updates and time embeddings. It is not a graph with a third layer of objective nodes. Two heads predict clean integer probabilities and continuous values. Continuous states follow a Gaussian-to-data interpolation; integer states follow a uniform-categorical-to-data path. Training combines squared continuous denoising error divided by(1−t) and weighted integer cross-entropy. Sampling uses discrete transitions and an ODE update on a cosine time grid, with default12steps,12GNN layers and64hidden units (Sections3–4.2/AppendicesB–D).

The formal problem assumes finite integer categories and per-variable bounds. The notation alternates between values0..K and K categories; the code uses an explicit class count. Finite bit encoding handles bounded integer ranges, not a literal arbitrary unbounded integer variable without an additional truncation/representation assumption. Projection clips to bounds; it does not project onto all Ax<=b constraints or establish joint feasibility.

**Guidance.** The intended minimized score is f(x)=w^T x+gamma*sum_i max(0,A_i x−b_i)^2. A continuous step descends this score through predicted clean continuous values and clips bounds. Integer guidance samples candidate assignments, evaluates the complete candidate score and combines their transition rates according to weights. Finite penalties and finite gradient steps supply a heuristic preference, not guaranteed feasibility, monotone primal improvement or an optimality certificate (Section4.3).

**Construction and scope.** Generated candidates/probabilities feed Neural Diving(ND), Predict-and-Search(PS), probabilistic multi-variable branching(PMVB) or Apollo. All use Gurobi as the actual backend; they are solver controllers/wrappers, not four independent exact solver engines. They fix/restrict selected variables or repeatedly reduce a model before classical complete-solution construction. The noisy generative state is not an incumbent-editing trajectory, so **constructive** remains appropriate even when several neural predictions or Apollo corrections occur (Section4.4/AppendicesE/H).

The seven native datasets have separate training/checkpoint pipelines. AppendixD.1 additionally describes a pooled model trained on the other benchmark families for heterogeneous MIPLIB testing. That actual pooled training must be retained, but a MIPLIB manifest or per-native evaluation of this pooled checkpoint is not supplied by the checked release. The note retains **specialist** for the demonstrated native solver pipelines and does not infer shared unchanged decision weights across native test tasks solely from generic MILP syntax, backbone compatibility or MIPLIB heterogeneity.

## Experiments

**Protocol/reference.** Native groups are CA, generalized independent set(GIS), MIS, fixed-charge multi-commodity network flow(FCMNF), SC, load balancing(LB) and item placement(IP), plus MIPLIB2017. Other datasets use90/10 train/test splits; exact counts/manifests are not completely tabulated. Labels come from3600second COPT runs with12threads. Training uses H100,300epochs/Adam-style learning rate2e-4, weight decay1e-4 and cosine scheduling; maximum feasible batch size depends on graph memory. Backend tests use12 Xeon8469C cores. ND/PS/PMVB/Apollo budgets are400/600/600/800seconds, compared with3600second vanilla Gurobi. BKS is the best found across methods plus a long Gurobi run. Seven groups report absolute BKS difference; MIPLIB reports |OBJ−BKS|/(|BKS|+1). These primal metrics are explicitly distinguished from optimality/dual-gap certificates (Section5.1–5.2/AppendixD).

**Overall means.** In Table1, FMIP is best or tied among the three tested learned training approaches for each displayed controller/group. Several easy columns tie at BKS, so improvement is0rather than a strict gain. Examples are ND MIS gap.40 versus best learned9.70; ND LB.40 versus6.44; PS IP.18 versus.99; Apollo IP0 versus.27. The SC BKS400.70 and LB705.90 are slightly better than the3600second Gurobi values400.80/706.00. Conversely, vanilla Gurobi has MIPLIB relative gap0 versus FMIP4.15–5.55%, and ND/other controllers remain behind Gurobi on several native groups. A zero empirical BKS difference is not proof of an optimum (Table1).

The41.34% headline is the paper's claimed average, not raw-objective improvement or a universal speedup. Its table mixes seven groups' relative gap reductions with MIPLIB **percentage-point differences**, so the aggregate does not have a single uniform relative-reduction interpretation. Also, PMVB MIPLIB best learned5.88% minus FMIP5.55%=.33percentage points, whereas the table prints.57%; simply averaging all32printed improvement cells gives about41.13%, not41.34. These discrepancies prevent reconstructing the headline exactly from the displayed cells and are not silently corrected into new experimental results.

**Compatibility and timing.** Bi-GCN/Tri-GCN/GAT/ClusterGCN are tested on IP/LB with each controller, usually favoring FMIP. This is concrete compatibility with those four encoders, not an empirical proof for arbitrary networks. In Table2's PMVB/Bi-GCN LB cell, SL706.50 versus FMIP706.32 is a small improvement; many cells tie or differ by only hundredths. Table3 measures neural inference **including guidance and excluding downstream solve time**: one-pass FMIP.176s on IP and2.043s on MIPLIB; three-pass Apollo1.805s MIS/3.229s LB/4.812s MIPLIB. This is small relative to long solve budgets but is slower than one-shot SL and some diffusion cells. The text's three Apollo inferences differs from Table6's K2notation; exact iteration interpretation/configuration needs care (Sections5.3–5.4/Tables2–3/6).

**Ablations and non-monotonicity.** Full FMIP IP objectives13.99/13.92/14.41/13.74 improve each ablated variant for ND/PS/PMVB/Apollo. However, contrary to the prose, removing continuous generation is not the worst ablation: PMVB22.32 without objective guidance is worse than14.95 without continuous generation; similar orderings occur elsewhere. Adding sampling steps eventually degrades quality. The IP adaptive-gamma study reports fixed12step objective11.79 and fixed32step13.25, versus adaptive alpha2/32step11.92. At12steps every tested adaptive variant is worse than fixed gamma; alpha1.5 worsens11.85 at24steps to12.68 at32. These results do not establish universally beneficial adaptation or monotone generation. Table5's IP objective scale11.79 differs from main PS13.92/BKS13.74 without a fully specified common evaluation protocol, so the two blocks should not be combined into one reference claim (Section5.5/Tables4–5/Figure3).

**Scale limits.** AppendixG switches the MIPLIB reference to website BKS and reports size-bin gaps4.70/4.81/4.86/9.04/23.26% up to300000variables, with no listed per-bin instances/counts or complete controller specification. The large-bin degradation qualifies scalability claims. Extreme SC examples use500000–1000000variables with3600second FMIP-PS and longer Gurobi traces. Benefits are substantial late in several cases, but at60seconds on50000constraints/500000variables, FMIP1335583 is worse than Gurobi785972. At3600 it improves52859 versus52877; other examples show large gains while vanilla Gurobi stagnates. These are specific reported scale cases, not universal anytime dominance or certified speedup to an identical optimum (Tables8–9).

## Limitations

### Discussed in the Paper

More steps can oversharpen predictions/reduce diversity or upset objective/feasibility balance. Very large MIPLIB instances degrade substantially; stronger/scalable task representations and a tailored downstream solver are future work. The method is a primal heuristic feeding Gurobi, not an alternative to exact optimization. Fixed-versus-adaptive guidance remains a tuning issue.

### Curator Notes

The printed guidance contains material inconsistencies. Eq7 weights by exp(+f/psi), although f is minimized and psi is explicitly positive; for two equal-base-probability candidates with f0and1this favors1. Current author code instead uses softmax(−normalized_target/temperature), consistent with minimization. Algorithm1 further swaps discrete/continuous initial priors, uses raw fweights in place of the exponential, and prints a positive gradient step despite Eq6's descent. Raw scores can be negative/zero and need not define valid mixture weights. These are limitations of the printed specification, not evidence that the current implementation performs ascent or that the experimental results are invalid. The code also clamps/normalizes categorical transitions and interprets categories explicitly, details absent from the shorthand rate equations (pp4/6/18–19).

Current release semantics should not be assumed byte-equivalent to the formal experiment: training uses ordinary continuous MSE plus a weight rather than the printed1/(1−t)continuous factor; defaults request30inference steps rather than12; guidance hardcodes temperature1 and score weights different from formal gamma50/dataset temperatures. The PS wrapper consumes integer probabilities for rank-selected trust regions, with no continuous-value Start assignment in its actual entry, despite Section4.4 suggesting continuous warm-start use. Thus joint continuous generation demonstrably informs the neural/guidance process, while exact downstream use must be checked per wrapper.

Finite penalties, bound clipping, trust regions and progressively fixed variables do not guarantee a feasible region retaining the original optimum. AppendixE's broad optimality language is not supported by a theorem; exact backend solves only establish whatever is certified for the restricted subproblem. Generalized MILP encodings and hypothetical arbitrary-backbone claims should remain bounded by the implementations and datasets actually evaluated. No trained model/solver benchmark was rerun in this review.

## Reproducibility

- **Publication:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/f5a24b8fa97f7073aff5e8baadf583f1-Abstract-Conference.html), official HTML publication date April20,2026. Seven authors/six formal affiliations checked against page1.
- **Coverage:** all21 formal pages, complete references and AppendicesA–H read; flow/guidance/result/pseudocode/large-instance pages rendered and checked. Publisher lists only the integrated Paper/Bibtex. Full author ZIP76423968bytes/82members contains no extra PDF/TeX/notebook; complete README and its scientific frame PNG read. Official ICLR event10007730 poster3162298bytes fully inspected; its bar chart labels objective-like13.99/13.92/14.41/13.74 values as Primal Gap, so the formal table's OBJ/GAP distinction is preserved. Event links OpenReview kyvW6S0u3z.
- **Code:** [Lhongpei/FMIP](https://github.com/Lhongpei/FMIP). Inspected typed graph/flow schedulers, actual joint loss, sign-corrected integer weighting/continuous descent, bounds/category handling, task-specific training scripts and downstream PS/Apollo entries. README says dataset checkpoint links are to be updated; scripts retain external/local dataset/model paths. Current code differences are disclosed above, with no unverified claim of full experimental reproduction.
- **Figure/relations:** existing framework image checked against formal Figure2 and author frame; it depicts candidate generation plus classical solving, not a neural optimality guarantee. Ten explicit body/bibliography relationships are retained; duplicated ConPaS2024a/b is one identity, and DIFUSCO is distinguished from the cited DIFUSCO-LNS adaptation.
