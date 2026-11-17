---
id: opgm
short_title: OPGM
title: Learning Partial Graph Matching via Optimal Partial Transport
authors:
- Gathika Ratnayaka
- James Nichols
- Qing Wang
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/cfa8440d500a6a6867157dfd4eaff66e-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/cfa8440d500a6a6867157dfd4eaff66e-Abstract-Conference.html
institutions:
- Australian National University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Partial Graph Matching
summary: Learned costs and node-specific unmatched penalties are decoded exactly for a linear partial-assignment
  objective through capped-cost LAP.
code_url: https://github.com/Gathika94/OPGMrs
---

# Learning Partial Graph Matching via Optimal Partial Transport

> **TL;DR:** OPGM learns pair costs and optional node-specific unmatched penalties, then exactly solves that linear partial-assignment objective through a capped-cost linear assignment reduction.

## Motivation

Forcing a full assignment can pair nodes with no meaningful counterpart. Estimating match count separately can propagate errors. This paper jointly chooses the matched subset and correspondence through learned costs plus penalties for leaving nodes unmatched. Its tractable objective is linear in the assignment once neural costs/biases are fixed; it does not solve arbitrary quadratic graph matching exactly in polynomial time (Sections1-4).

## Contributions

- A weighted total-variation partial-transport objective represents both pair costs and node-specific incentives to match.
- Unit-mass integrality and a linear-sum-assignment reduction give an exact discrete optimum for that objective.
- A supervised neural architecture learns pair costs and matching biases using a masked matching loss, evaluated on visual partial matching and separately configured PPI alignment.

## Methodology

**Objective.** For a binary partial injection X, minimize the sum of selected pair costs plus rho times source/target unmatched-node bias sums. Equivalently, begin with all unmatched penalties and add effective edge costs Cij-rho(alpha_i+beta_j). Constraints permit at most one selected entry per row/column. Theorem5.1 excludes edges whose effective cost is strictly positive from any optimum; nonpositive cost makes an edge eligible, not necessarily selected under assignment competition. Equality ties can support more than one optimum (Sections4-5).

**Exact solver.** With one unit of mass per node and nonnegative biases, the partial-transport relaxation has at least one integral optimum; it does not say every optimum is integral. Pad the smaller side to the larger size, cap real pair costs at the sum of unmatched penalties, and set dummy-row penalties using a bias larger than every real source bias. Solve square linear assignment and discard selected real pairs that exceeded their original penalty threshold. The cost identity differs by a constant dummy penalty, and Theorem6.2 proves optimality of the mapped result for the proposed objective. Hungarian gives O(max(m,n)^3) worst-case assignment time; the implementation uses SciPy LAP. This is separate from neural feature computation and semantic correctness (Sections5-6; AppendixA).

**Learned costs/biases.** The visual model uses pretrained VGG16 and GCAN to build a cross-graph affinity matrix. Sinkhorn-derived matching scores give C=1-score. For OPGM-rs, positive row/column affinity maxima enter a sigmoid with a learned nonnegative scale to produce biases in[0,1]; OPGM fixes both biases to one. A supervised BCE loss retains true matches and currently threshold-eligible negative pairs, while a squared bias loss encourages matched nodes' biases toward one. No derivative through the discrete LAP is needed. PPI uses a different five-layer GIN on degree features and cosine affinities, with rho=1e11 to favor full matching (Section7-8).

## Experiments

**Visual datasets.** SPair-71k, PascalVOC and IMC-PT-SparseGM retain partial correspondences/outliers following the stated AFAT/ThinkMatch protocols. Results report F1 with95% confidence intervals over five random starts. SPair mean F1 is57.7±0.2 for OPGM-rs and56.5±0.4 fixed-bias, versus the best listed baseline56.4±0.4. Improvements are not category-wise universal: OPGM-rs motorbike47.2 is below51.9, and plant78.6 is below81.2 (Sections8/Table1).

**IMC and Pascal negatives.** IMC100 mean F1 is72.8±0.1 for learned bias and72.3±0.4 fixed bias, versus GCAN-AFAT-U71.5±0.2. IMC50 learned bias72.7±0.1 is below the best listed72.9±0.6 and below NGM-AFAT-I72.8±0.4. Pascal means61.0±0.2/60.8±0.4 are below GCAN-AFAT-U62.0±0.2; learned-bias table/sofa values33.2/39.8 are particularly weak. The authors attribute these cases partly to annotation ambiguity, which is an explanation rather than an independently tested causal result (Tables2-3; AppendixB).

**PPI.** Match a1,004-protein yeast graph with4,920 high-confidence interactions against versions with5-25% additional noisy interactions. This is bijective same-node alignment, not a partial outlier benchmark. OPGM-rs node correctness declines88.3→57.7%; fixed-bias OPGM gives87.8→58.8%. Learned bias is better at5% noise but worse at10/15/20/25%, despite broad prose favoring it. Both generally exceed the listed SIGMA/StableGM means. This setting is separately trained/configured and does not show one unchanged visual/PPI solver (Table4/Section8.1).

**Time, tuning and failure modes.** On3,000 IMC100 image pairs, mean inference time is117.8ms for OPGM-rs versus AFAT-I367.1, AFAT-U371.8 and GCAN561.1. Models share the GCAN/Sinkhorn front end in this comparison and differ in partial decoding modules; these are implementation/hardware-conditioned end-to-end inference measurements, excluding training. Hardware is an RTX A6000/Xeon/512GB server. AppendixB gives visual15/20/25-epoch and PPI100-epoch searches, rho/lambda/learning-rate ranges and failure analysis. True matches can be lost either because the learned threshold rejects them or because eligible pairs lose assignment competition (Section8/AppendixB/Figure3).

## Limitations

### Discussed in the Paper

Ambiguous annotations and increasing noise reduce effectiveness. Small rho rejects true matches; large rho can admit false matches. Jointly learning biases may be more sensitive to noisy affinities than fixed biases. Improving those robustness limits is future work (Section9/AppendixB).

### Curator Notes

Exact decoding optimizes the learned surrogate, not F1 or the original edge-quadratic objective. Theorem5.1 is a necessary threshold condition; by itself it neither proves that every eligible pair is matched nor that arbitrary large rho yields a bijection when biases can vanish. Strictly favorable costs on a sufficient full matching provide the relevant extra condition. General non-unit-marginal transport statements should also retain their mass assumptions: AppendixA.1 writes an additive constant in the unit-mass form; with general masses it is rho*(alpha dot mu + beta dot nu). The unit-mass matching reduction is the result used here.

The release confirms capped-cost LAP, threshold projection, bias parameter clamping and the masked BCE/bias loss. Its visual configuration uses backbone learning rate1e-5, whereas the paper's searched backbone rate is1e-4. Code primarily supplies visual GCAN configurations; no complete PPI pipeline or trained checkpoints were found in the inspected archive. These are reproduction limitations, without claiming that current code settings invalidate the paper's experiments.

## Reproducibility

- **Publication:** [ICLR2025 proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/cfa8440d500a6a6867157dfd4eaff66e-Abstract-Conference.html), pages83575-83595; official HTML publication metadata gives May1,2025. Three authors and ANU affiliations match the PDF.
- **Scientific coverage:** all twenty-one [publisher PDF](https://proceedings.iclr.cc/paper_files/paper/2025/file/cfa8440d500a6a6867157dfd4eaff66e-Paper-Conference.pdf) pages, references, all AppendixA proofs and AppendixB results/failure analysis. The linked [supplement ZIP](https://proceedings.iclr.cc/paper_files/paper/2025/file/cfa8440d500a6a6867157dfd4eaff66e-Supplemental-Conference.zip) was downloaded and inventoried: its only file supplementary/code is a one-line official repository URL, with no additional scientific PDF/text.
- **Implementation:** [official OPGMrs](https://github.com/Gathika94/OPGMrs). Full archive inventory, GCAN cost/bias modules, exact decoder, supervised loss, visual configuration and training-notebook cells were inspected. No training was rerun.
- **Relations:** CIE, DGMC and stochastic SIGMA are the three exact current-catalogue works explicitly cited in the body and bibliography. Other partial-matching references are distinct absent entries, without inferred edges from shared names.
