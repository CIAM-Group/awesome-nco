---
id: gelato
short_title: GELATO
title: 'Gelato: Graph Edit Distance via Autoregressive Neural Combinatorial Optimization'
authors:
- Paolo Pellizzoni
- Till Hendrik Schulz
- Karsten Borgwardt
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1943190d92efee1fccfc8d6579b0f8d9-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/1943190d92efee1fccfc8d6579b0f8d9-Abstract-Conference.html
institutions:
- Max Planck Institute of Biochemistry
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Graph Edit Distance
summary: Autoregressive GINE predictions construct feasible GED edit paths with reduction and initial-seed ensembling;
  exact-reference small-graph results, feature-compatible transfer, supervision/search budgets and cost-condition
  limits are explicit.
code_url: https://github.com/BorgwardtLab/Gelato
---

# Gelato: Graph Edit Distance via Autoregressive Neural Combinatorial Optimization

> **TL;DR:** GELATO repeatedly predicts a node correspondence conditioned on earlier matches, reduces completed neighborhoods and chooses the best of multiple initial seeds. It produces feasible edit-path upper bounds with strong small-graph GED results, while supervision cost, topology/feature transfer, search budget and the scope of its existence lemma remain material qualifications.

## Motivation

GED minimizes node/edge insertion, deletion and substitution costs. Scalar distance regression need not return an attainable edit path or even an upper bound. One-shot linear-assignment heuristics do return matchings but cannot update scores after choices reveal structural dependencies. GELATO recomputes a pair predictor after each match, connecting GED to sequential neural combinatorial construction (Sections1–3/Figures1–2).

## Contributions

- GED with fixed matches(GEDFM) defines a sequential state space and a reduction deleting matched pairs whose remaining interactions are irrelevant up to a constant cost.
- A source/target-labelled graph with cross-graph match edges encodes the partial matching; a GINE pair predictor learns from random restrictions of solved matchings.
- Symmetry-aware supervision and multi-seed autoregressive inference address alternative optimal matchings and sensitivity to the initial choice.
- Isomorphism-separated datasets, exact-reference matches through30 nodes, noisy/limited supervision, non-unit costs, size/domain transfer and detailed timing/ablations support the empirical evaluation (Sections3–5/AppendicesC–H).

## Methodology

**Objective/state.** A matching contains source-target node pairs with no repeated endpoints. Unmatched source/target nodes imply deletions/insertions; induced edge costs determine a valid edit path. Consequently any candidate's computed cost upper-bounds the true GED, although it may be suboptimal. GEDFM fixes an existing matching and minimizes over extensions. Its exact recursion includes stopping at the current matching as well as adding a pair; the actual learned inference instead continues until the smaller graph is fully matched (Definitions1–3/Sections3/4.4).

**Reduction/encoding.** For a matched pair(u,v), if all neighbors of u **or** all neighbors of v are already matched, the pair can be removed from the state representation. Theorem1 relates optimal extensions of the original/reduced instances through a matching-independent cost offset. This is a reduction property, not proof that the learned policy finds the optimum. The graph encoder keeps original labels plus source/target flags and marks cross-graph match edges; Lemma2 gives a left inverse, hence no information is lost by this exact representation. In code, reduction removes incident edges while leaving isolated nodes, avoiding repeated re-indexing; batch normalization means such nodes can still affect training statistics, an implementation distinction explicitly acknowledged in AppendixF.2.

**Network/learning.** Linear features feed five128-dimensional GINE layers with batch normalization/residual connections. An MLP scores concatenated source-target embeddings. Optimal training matchings come from Gurobi's MIP-F2 GED formulation, warm-started by REFINE; each pair supplies40 random partial-match subinstances. Binary cross-entropy promotes remaining optimal pairs without enforcing one fixed action order. Exact automorphism classes would justify adding alternative equivalent positive actions by Lemma3. Actual training uses five-round WL hashing enriched with closed-walk counts as a **proxy**, rather than exact graph automorphism orbits; the theorem does not certify every proxy-equivalent pair. Parameters are selected by validation normalized error (Sections4.1–4.3/AppendicesC/D/F).

**Inference/classification.** Highest-scoring available pairs are added, the representation is reduced and scores are recomputed. Default k=32 initial pair seeds run separate greedy branches, returning the minimum true edit cost among them. This is initial-seed ensembling, not width32 beam search throughout. **Specialist/constructive** is retained: it builds node matchings for the native GED objective, and separately trained dataset models are released. AppendixH genuinely transfers unchanged weights across graph domains, but each remains the same GED task. These positive domain-transfer results are preserved below rather than denied because the solver is specialist.

## Experiments

**Data/reference.** AIDS/LINUX have at most10 nodes, IMDB is restricted to16, molecular ZINC/molhiv to16 and code2 syntax graphs to22. Graph splits are60/20/20, retaining isomorphic copies within splits while separating isomorphism classes across splits. Table6 reports700/1000/1185/836/6734/2087 graphs but667/89/167/835/6733/785 classes; the unlabeled datasets therefore contain many repeated structural types. Larger tests use17–24-node ZINC/molhiv and23–30-node code2. Exact-reference GEDs/matchings are reported from MIP-F2; finite .1-second MIP-F2 used as a baseline is a different budget, not the exact-label generation procedure. No certificate corpus was independently regenerated in this audit (Section5/AppendixE).

**Metric/budget.** nMAE averages |prediction−reference|/max(1,reference); tables multiply by100. For feasible matching methods this is normalized nonnegative excess edit cost. EHR is the fraction with exactly the reference **cost**, not necessarily the same node matching. Scalar GREED/GRAPHEDX predictions lack the corresponding feasibility interpretation; rounded GREED values are used for EHR. The appendix's claim that every method except GREED returns upper bounds overlooks its own earlier classification of GRAPHEDX as a regressor. Tests report five runs of1000 sampled pairs; larger-size groups use500. Current test.py loads one checkpoint and varies the pair-sampling seed five times, so its standard deviation must not be described as five independently trained networks. The paper does not supply a separate training-seed decomposition.

**Quality and negative cases.** GELATO's nMAE/EHR percentages on AIDS/LINUX/IMDB/ZINC/molhiv/code2 are .1/99.3, .1/99.9, .1/99.9, .7/91.1, .5/95.3, .6/95.7. These substantially improve the listed competitors on AIDS/ZINC/molhiv/code2. GRAIL is slightly better on saturated LINUX(0.0/100.0) and IMDB(0.0/99.9); Tables7–8 explicitly retain its lower MAE/RMSE there. Edge-unlabelled molecular controls remain strong(.7/92.3 and .5/95.6), helping address that several baselines do not use edge labels. Full optimum rates remain below100% on the harder datasets, and the size-transfer curves decline, especially code2 (Tables1–2/7–10/Figures5/11).

**Timing/training.** Default GPU inference averages3.2/2.9/3.6/4.2/4.1/5.3ms per pair on H100; CPU values11.5/8.2/24.7/27.1/24.9/61.2ms use Xeon Silver4116. GEDGNN/HOT are much slower under their reported100-candidate default budgets; GELATO uses32 branches with batching. These comparisons measure complete implementations/budgets on the stated system. Very fast BRANCH/REFINE and scalar regressors can still run below1ms, so “faster than all methods” is incorrect. Training times include validation: GELATO5422/4760/7850/9194/11979/7216 seconds. On ZINC it is **slower than MATA*(8247seconds)**, contradicting a blanket faster-training statement, although it beats GEDGNN/HOT on every listed row and MATA* elsewhere (Tables3/15–16).

**Ablations/limited supervision.** k=1 EHR falls to41.4/52.8/65.3 on ZINC/molhiv/code2. Non-autoregressive assignment degrades substantially. Reduction helps most rows but code2 nMAE is14.5 without reduction versus20.6 with it at k=1; EHR changes in the other direction(60.9 versus65.3), so its benefit is metric dependent. Naive automorphic-pair handling improves some IMDB/code2 results. Increasing k from32 to128 raises ZINC EHR about91→97% at4.2→6.3ms, explicitly trading search budget for quality. Training on1000 exact pairs still yields ZINC52.1%/code2 77.5%EHR; .1-second noisy-teacher10000-pair training gives62.6/87.3%. These remain useful but materially weaker than full supervision. Stated .4 CPU-hour label generation for1000 ZINC pairs is not whole model-training cost (Tables4–5/Figures6–10).

**Costs/domain transfer.** Non-unit trials separately set(node,edge) costs to(10,1) or(1,10), with dataset-fixed cost semantics; AIDS EHR98.3/98.9 and ZINC83.0/77.8 remain strong. Unchanged unlabeled checkpoints transfer LINUX→IMDB at74.8%EHR and IMDB→LINUX at88.5%. Shared-feature molecular transfer gives molhiv→moltox97.8 and reverse91.7%. Incompatible one-hot meanings sharply reduce performance: ZINC→molhiv19.0%, code2→ZINC/molhiv4.6%. This is meaningful structural transfer with feature-space conditions, not an arbitrary-cost/graph-family zero-shot guarantee (Tables11–14).

## Limitations

### Discussed in the Paper

Exact matching supervision is expensive. More sophisticated search, self-improvement/RL and size generalization remain open directions; the current method has no end-to-end optimality certificate. Feature meanings must align for cross-domain transfer. Efficient implementation and hardware heavily influence timing, and reduction's isolated nodes interact with batch normalization during training.

### Curator Notes

Lemma1 is an **existence** statement for an oracle score, not a polynomial-time computation or a guarantee for the trained GNN. Its forced complete-smaller-side algorithm additionally needs costs that permit extending an optimum without increasing cost. AppendixC explicitly imposes edge-substitution≤deletion+insertion but does not state the analogous node condition. With two single-node edgeless graphs of different labels, node-substitution3 and insertion/deletion1 each, the optimal empty matching costs2, whereas the forced pair costs3. A stopping action or node-substitution≤node-deletion+insertion closes this particular scope issue. Unit costs and the tested uniformly rescaled node/edge costs satisfy the latter condition, so this is **not a refutation of their experiments** or of Theorem1's reduction. The reduction proof's p18 zero-edge-cost sentence also overlooks possible target-edge insertion; its sum is still a matching-independent constant, so that sentence alone does not invalidate the reduction conclusion.

Current code has release-specific differences: initial seeds are grouped by logit gaps greater than1e−3 rather than exact automorphism classes; training uses weighted BCE/AdamW with zero default weight decay; train.py/README allow up to200000 pairs, matching AppendixF rather than the main text's100000 cap. run_inference passes k for full batches but **omits k for the final incomplete batch**, which therefore uses the model's default1 branch; with1000 pairs and batch32, the final eight pairs use greedy inference. test.py's timer includes batched matching/cost computation, excludes dataset loading and model loading, and performs five resampled test sets from one checkpoint. These static observations identify the actual released path without asserting that every formal result used this exact revision. The audit did not train models or reproduce benchmark scores.

## Reproducibility

- **Identity/publication:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/1943190d92efee1fccfc8d6579b0f8d9-Abstract-Conference.html), pp14972–14999, citation_publication_date April20,2026. FormalPDF/authorREADME use **Till Hendrik Schulz**; publisher/export/event shorten this to Till Schulz. Full-form author identity is retained with that provenance.
- **Scientific coverage:** all28 formal pages, integrated AppendicesA–I, every proof/reference/table read, key reduction/proof/results/transfer pages rendered and checked. Publisher exposes one integrated PDF; official event10011367 has no uploaded poster/document link. Normal OpenReview6ZTcLNmguc API/attachment403 recorded without bypass; no explicitly referenced missing scientific appendix was found.
- **Release inventory:** [author source/checkpoints](https://github.com/BorgwardtLab/Gelato),6670764-byte23-member ZIP, complete README and core training/model/WL/sampling/reduction/cost/timing paths inspected. It contains eight checkpoints and code, no additionalPDF/TeX/notebook/image. All eight linked dataset ZIP central directories were fetched with standard HTTP byte ranges and manually inventoried: each contains only graphs.txt/match.txt/splits.json, no additional scientific documents. Dataset inputs/weights were inventoried rather than claimed read as papers.
- **Relations:** seventeen actual text-plus-bibliography citations are recorded. DiffGED's six authors and arXiv2503.18245 identify the early “Computing ... via diffusion” version of the existing formally published stable ID, whose title later changed. Rolinek's separate ECCV2020 deep-graph-matching paper is not conflated with the differently authored blackbox-backprop stable ID. Citation graph edges record citation identity, not automatic method inheritance.
