---
id: gedranker
short_title: GEDRanker
title: Towards Unsupervised Training of Matching-based Graph Edit Distance Solver via Preference-aware GAN
authors:
- Wei Huang
- Hanchen Wang
- Dong Wen
- Shaozhen Ma
- Wenjie Zhang
- Xuemin Lin
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/ebf8764ecf0688cdd9fe1e5a9c525d0d-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/ebf8764ecf0688cdd9fe1e5a9c525d0d-Abstract-Conference.html
institutions:
- University of New South Wales
- University of Technology Sydney
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Graph Edit Distance
summary: Candidate-cost preferences and best-record reconstruction train a GED matching solver without optimal labels;
  small-reference versus synthetic/unknown large optima, supervised/ablation counterexamples and continuous-relaxation
  limits qualify results.
code_url: https://github.com/piupiupiuu/GEDRanker
---

# Towards Unsupervised Training of Matching-based Graph Edit Distance Solver via Preference-aware GAN

> **TL;DR:** GEDRanker trains a diffusion matching solver from candidate edit costs using best-so-far reconstruction and a preference discriminator. It substantially reduces dependence on optimal matching labels, but supervised DiffGED remains more accurate, large-graph references are approximate or unavailable, and continuous relaxations are not feasibility certificates.

## Motivation

Scalar GED regression need not yield an attainable edit path. Matching-based solvers provide explicit paths but optimal training matchings are expensive. GEDRanker replaces optimal labels in the **generator's objective** with self-generated candidate records and pairwise preferences computed from their actual edit costs, using an adversarial discriminator as a differentiable exploration surrogate (Sections1–4).

## Contributions

- A trainable preference discriminator ranks generated matchings against current best and previous candidates, including a symmetric treatment of cost ties.
- Best-so-far matching reconstruction and annealed adversarial exploration train the DiffGED backbone without optimal-match supervision.
- Main, unseen-pair and genuinely unlabeled large-graph evaluations, architecture/loss/schedule ablations and a GEDGNN compatibility experiment test the approach. These are empirical results; the checklist explicitly declares no theoretical results (Sections4–5/AppendicesA–D).

## Methodology

**Native objective/decoder.** The paper uses unit-cost node insertion/deletion/relabeling and edge insertion/deletion, with no edge-label substitution experiment. Assuming source size n1≤target size n2, a binary matching has one1 per source row and at most one per target column. It supplies a feasible edit path whose cost upper-bounds exact GED. Greedy decoding repeatedly selects a largest matrix score and masks its row/column, costing O(n1²n2); deriving an edit path from a valid matching takes O(n2+|E1|+|E2|). The linear-time statement concerns that final derivation, not total neural inference or greedy assignment (Section3.1).

**Backbone.** DiffGED uses binary categorical corruption with1000 forward steps and a denoiser over graph pairs, noisy pair indicators and diffusion time. Six layers with dimensions128/64/32/32/32/32 combine siamese GIN/GraphNorm graph updates and anisotropic cross-graph/pair messages. Two directed pair representations share parameters and their final scores are summed to respect graph exchange in the intended design. Reverse inference starts from random binary matrices, denoises for ten steps and greedily decodes at the end;100 independent candidates are generated in parallel and the lowest edit cost is returned. Intermediate noisy matrices are not feasible assignments (Section3.2/AppendixA.1/A.3/B.2).

**Self-generated labels/preferences.** Each training pair stores a randomly initialized feasible best matching and the previous candidate. A random diffusion time corrupts the best record. The generator minimizes reconstruction BCE plus lambda times the negative discriminator score on its differentiable Gumbel-Sinkhorn output. Actual greedily decoded edit costs rank this output against both stored records; the discriminator minimizes BPR pairwise logistic losses. Equal costs contribute both directions, encouraging equal scores. A record changes only on a strictly smaller actual cost. Thus **stored training-record costs cannot increase**, but this does not guarantee monotonically improving learned parameters, test solutions, calibrated discriminator scores or global optimality (Equations5–9/Algorithm3).

The discriminator has three128/64/32 layers and uses pair-conditioned GIN/AGNN features without diffusion time. It is more expressive than a score linear in a fixed pair-cost matrix, but its learned score remains a surrogate, not the true discrete objective. RMSProp uses learning rate .001 and weight decay5e−4, batch128,200 epochs. Lambda falls linearly1→0 during the first100 epochs, remaining0 thereafter. Gumbel-Sinkhorn has five iterations and temperature1 (AppendicesA/B).

**Classification.** Specialist/constructive: separately trained native GED models produce first complete matchings from noisy continuous/binary latent representations. A denoising update is not a neural edit of a complete feasible incumbent. Best-record updates occur during training; they do not make test-time construction an improvement solver. GEDGNN compatibility transfers the training recipe, not the same learned checkpoint across distinct native tasks.

## Experiments

**Data and reference quality.** AIDS700/LINUX/IMDB contain700/1000/1500 graphs, maximum10/10/89 nodes, with60/20/20 graph splits. AIDS has29 node labels; the others are unlabeled. At most10-node pairs have exact-solver references. Larger pairs are synthesized by applying a recorded number delta of random edits(1–5 through20 nodes,1–10 above20). Delta is a feasible-path upper bound that can exceed exact GED, **not a certified optimum**. Standard tests pair small held-out query graphs with100 training graphs, or large queries with synthetic partners. No isomorphism-class separation guarantee is documented for these original splits. AppendixC.1 additionally evaluates test queries against100 unseen test graphs (Section5.1/AppendixB.1/C.1).

**Metrics/budget.** MAE is absolute reference-value error; accuracy means exact **cost equality** to the reference, not recovery of an identical matching. Spearman/Kendall and precision@10/20 evaluate query ranking. On synthetic larger pairs, closer agreement with delta need not mean a better feasible edit path. Main baseline numbers, except GEDIOT/GEDGW, are imported from the cited DiffGED study rather than all rerun here. The reported system is RTX3090/24GB and i9-12900K/128GB; candidate count100 and ten reverse steps matter to quality/runtime. Equal200 training epochs do not establish equal total training compute with an extra discriminator. Checklist explicitly reports no error bars, so small differences lack a repeated-run significance analysis.

**Main results and exceptions.** GEDRanker MAE/accuracy on AIDS/LINUX/IMDB are .088/92.6%, .010/99.5%,1.019/94.0%, versus supervised DiffGED .022/98.0%,0/100%,.937/94.6%. Thus the unsupervised method approaches but **does not exceed supervised DiffGED's cost accuracy**. It improves many other supervised competitors on these metrics. GEDGW has a smaller IMDB MAE(.349) and slightly lower accuracy93.9%; this is not a contradiction once approximate synthetic references are distinguished from true optima. Ranking metrics also have exceptions: IMDB precision@10/20 is96.1/97.0% versus GEDGW99.1/98.3%. Broad every-metric dominance is unsupported (Table1).

Main per-pair runtimes are .0759/.06973/.15111seconds, similar to DiffGED .0763/.06982/.15105; IMDB is marginally slower, not uniformly faster. GEDGW .39255/.1826/.37496 is slower in these tests, but Hungarian/VJ run around .0001seconds and small-graph MATA* around .0047seconds with weaker cost quality. Runtime includes the100-candidate matching pipeline, not a single denoiser prediction or a proof of asymptotic speedup. No full training wall-time comparison is supplied (Table1/author trainer.py).

**Unseen and truly unlabeled large pairs.** Table4 unseen-test pairing gives .101/91.4%,.008/99.6%,1.025/93.9%, again worse than DiffGED's reference accuracy. The large real-pair experiment trains GEDRanker on pairs of large training graphs **without exact labels**, while DiffGED(small) is trained only on small exact-label pairs. Mean feasible costs are140.138 versus143.607 and GEDGW140.278; times .1904/.1911/.4032seconds. The0.140 cost advantage over GEDGW is a modest observed mean, not a known optimality gap, and training distributions differ intentionally. AppendixD explicitly states that actual large-graph optimality/ranking errors cannot be evaluated (Table5).

**Ablation counterexamples.** Best-record reconstruction alone yields AIDS MAE.549/accuracy65.4%, REINFORCE .458/69.3%, scalar-cost discriminator .237/82.3%, versus BPR .088/92.6%. Hinge is worse on AIDS(.114/90.5%) but **better on LINUX**(.002/99.9% versus BPR .010/99.5%), despite less favorable early exploration curves. Constant exploration(lambda1) degrades AIDS to1.334/39.3%, worse even than pure exploitation, showing that good best-record search does not by itself imply good reverse inference. Linear/cosine/step schedules have mixed ranking outcomes, e.g. cosine AIDS precision@10 99.2% versus linear99.1%. The linear-cost architecture loses substantially, but these are controlled empirical comparisons, not a formal impossibility theorem (Tables2/6–8/Figures3/6–7).

**Compatibility.** GEDGNN trained with this recipe gives AIDS1.279/44.6% versus supervised1.098/52.5%; IMDB2.536/85.2% versus2.469/85.5%. LINUX MAE improves .094→.078 while accuracy slightly falls96.6→96.3%. Compatibility therefore demonstrates useful label-free training with tradeoffs, not universally better performance on a second backbone (Table9).

## Limitations

### Discussed in the Paper

Exact large-graph reference GEDs are unavailable, preventing true optimality-gap and ranking evaluation there. Training depends on the backbone's scalability, exploration/exploitation scheduling and discriminator quality. The study is empirical on three benchmark datasets and does not report repeated-run error bars.

### Curator Notes

Equation3 and the official poster print a **positive** binary log-likelihood sum while instructing minimization; BCE reconstruction requires its negative. Actual loss_fn.py uses BCEWithLogitsLoss with the correct sign, additionally subsampling some negative pairs, so the printed formula must be distinguished from executable reconstruction training. This does not show the experiments minimized the wrong sign.

Algorithm1 alternates unit row and unit column normalizations on an n1×n2 matrix without dummy rows. For n1<n2, both marginals cannot equal1: after the last column normalization total mass is n2, whereas row sums1 require n1. A1×2 positive matrix becomes[1,1], not a valid soft row assignment. The public roll_out_gumbel similarly normalizes the actual rectangular pair set before greedy decoding; dummy padding is added later to evaluate the hard solution. Consequently its continuous output should be called a differentiable scoring relaxation, **not a certificate of the row-one/column-at-most-one constraint**. The greedy hard decoder still gives a valid matching, and the mathematical observation does not negate the measured heuristic utility.

The ordinary training loader reads exact/synthetic reference files for reporting/evaluation, but generator/discriminator loss targets use best/last candidate costs and matchings. A separate main_no_gt.py/trainer_no_gt.py path omits loading exact GED labels and trains real large pairs, supporting the narrower unsupervised-objective claim. “Unsupervised” does not mean absent objective feedback: actual candidate edit costs supply preference labels. No global convergence/approximation guarantee follows from adversarial interpretability language. No model training or benchmark rerun was performed during this audit.

## Reproducibility

- **Formal identity/date:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/ebf8764ecf0688cdd9fe1e5a9c525d0d-Abstract-Conference.html), volume38, pp161231–161258, DOI10.52202/085713-5382. Official citation_publication_date is **April23,2026**, independent of venue-year2025. Six authors/three institutions checked; Shaozhen Ma normalized from publisher uppercase against the formalPDF/poster.
- **Full scientific coverage:** all28 formal pages, full checklist/references and integrated AppendicesA–D, every method/ablation/result table read. Math/results pages rendered. Official event119891's1688245-byte poster fully inspected. Publisher mainPDF integrates the scientific appendix; no separate scientific supplement is linked. Conventional supplemental ZIP URL404 and normal OpenReview59HMRbpQ25 API403 recorded without bypass; checklist mentions code/data supplements, whose public author package is documented separately.
- **Implementation inventory:** [author release](https://github.com/piupiupiuu/GEDRanker),38600283-byte3985-member ZIP:51Python files,6READMEs,3205JSON inputs/labels,700onehot files and environment/other files. Entire inventory and all six READMEs checked; no PDF/TeX/notebook/image/additional scientific prose. Core best/last updates, loss direction/ties, rectangular relaxation, RMSProp, diffusion, greedy/cost/timer and no-ground-truth paths inspected. No claim of byte identity to an unavailable anonymous submission archive is made.
- **Relations:** four explicit citations are recorded: [DiffGED](diffged.md), [DIFUSCO](difusco.md), [DIMES](dimes.md), [Gumbel-Sinkhorn](../studies/gumbel-sinkhorn.md). DiffGED[13] is the six-author arXiv2503.18245 precursor, mapped by identity to its retitled formal stable ID. The cited Joshi generalization paper differs from the existing efficient-GCN-TSP title; they are not conflated. Full bibliography was compared with the catalogue rather than generating edges from architecture similarity.
