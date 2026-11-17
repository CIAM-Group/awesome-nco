---
id: diffged
short_title: DiffGED
title: Towards Generative Graph Matching for Graph Edit Distance Computation
authors:
- Wei Huang
- Hanchen Wang
- Dong Wen
- Wenjie Zhang
- Ying Zhang
- Xuemin Lin
year: 2026
date: '2026-09-29'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/huang26bi.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/huang26bi.html
institutions:
- University of New South Wales
- University of Technology Sydney
- Zhejiang Gongshang University
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Matching
problems:
- Graph Edit Distance
summary: Discrete diffusion samples graph matchings, greedy injections yield feasible edit paths, and best-of-k
  decoding estimates GED upper bounds.
code_url: https://github.com/piupiupiuu/DiffGED
---

# Towards Generative Graph Matching for Graph Edit Distance Computation

> **TL;DR:** DiffGED samples many graph-conditioned binary matching matrices with discrete diffusion, greedily converts each into an injection, and returns the cheapest induced edit path. This is a learned upper-bound heuristic, not a certified exact GED algorithm.

## Motivation

Methods that repeatedly extract assignments from one deterministic similarity matrix can return correlated candidates. DiffGED instead generates separate matching matrices, aiming to explore different low-cost edit paths in parallel. The task is unit-cost edit distance between undirected, node-labeled graphs: node insertion/deletion/relabeling and edge insertion/deletion. The standard formulation assumes the smaller graph's nodes are injected into the larger graph and unmatched target nodes are inserted (Sections1-3).

## Contributions

- A conditional discrete-diffusion model generates multiple candidate matching matrices rather than deriving every candidate from one score matrix.
- A GIN/anisotropic graph-neural denoiser combines intra-graph structure, cross-graph messages, noisy pair indicators and time embeddings.
- Parallel greedy injection and edit-cost evaluation select the best candidate under an explicit sampling budget.
- Experiments examine candidate diversity, accuracy/time tradeoffs, train/test structural leakage, approximate-label provenance, ablations, an alternative unsupervised loss, and additional datasets.

## Methodology

**Diffusion and training.** Each source-target node pair has a binary match indicator. Independent categorical bit flips with transition matrix [[1-beta,beta],[beta,1-beta]] corrupt a clean matching matrix. The denoiser predicts its clean entries conditioned on both graphs and time. A categorical posterior uses that prediction to reverse the process. The forward schedule has1,000 steps with linear beta from1e-4 to0.02; inference normally uses ten spaced reverse steps. These skipped-step transitions still sample categorical variables: the DDIM-inspired schedule is not evidence of deterministic inference or an optimality guarantee (Sections4-5/AppendixA).

Six GIN/AGNN layers have widths128/64/32/32/32/32. Cross-graph messages depend on noisy matching information and sinusoidal time/pair encodings; shared pair heads combine the two directions. Matching labels supervise binary cross entropy. The printed Equation1 omits the leading negative sign of a loss, whereas Algorithm2 calls BCELoss and the release uses BCEWithLogitsLoss with sampled negative entries. The implementation returns logits, with sigmoid used in reverse-posterior prediction (Sections4-5/AppendixB; inspected loss_fn.py/models.py).

**Feasible decoding and cost.** For each of k normally100 independently initialized binary matrices, repeatedly take a largest available entry and mask its row/column until every source node is assigned. This produces an injection but is not an exact maximum-weight Hungarian assignment. Insert unmatched target nodes, relabel mismatched mapped labels, and count edge disagreements; each resulting edit path gives an upper bound on the minimum edit distance. Return the minimum cost over the candidates. The stated greedy complexity is O(m^2 n) per candidate for m<=n; batching candidates does not remove their work or pair-matrix memory. Sampling diversity does not establish coverage of all edit paths, convergence to the optimum, or a probability certificate (Sections3/5; AppendixB).

The printed Algorithm1 line15 says to delete an edge when its mapped edge is present, conflicting with the correct absent-edge condition in Section3; its inverse-mapping notation also has inconsistent primes. The inspected implementation computes absolute adjacency differences divided by two plus node-feature differences, avoiding that printed deletion-condition error. This is a pseudocode discrepancy, not evidence that its experiments used that incorrect edit rule.

## Experiments

**Data and reference quality.** AIDS700 has700 labeled graphs and Linux1,000 unlabeled graphs, each at most ten nodes; IMDB has1,500 unlabeled graphs up to89 nodes. Graphs are split60/20/20. Small-graph matching labels come from the GEDGNN exact-label data. Large IMDB training/evaluation pairs are made using random edits:1-5 edits for10-20 nodes and1-10 for larger graphs. These induced edit paths provide approximate upper-bound labels, because the applied edits need not be a minimum edit sequence. Consequently, equality to the large-graph reference is not proof of exact GED (Section6/AppendixC).

**Main protocols.** Cross-train-test pairs include a training graph, whereas intra-test pairs use held-out graphs; the two should not be conflated. With k=100 and ten denoising steps, Table1 reports cross-train-test MAE/accuracy/seconds per pair of0.022/98.0%/0.0763 for AIDS,0/100%/0.06982 for Linux, and0.937/94.6%/0.15105 for IMDB. Corresponding intra-test values are0.024/96.4%/0.07546,0/100%/0.06901, and0.932/94.6%/0.15107. Accuracy means the fraction of predicted edit costs equal to the reference cost, not correspondence accuracy (Section6/Table1).

**Leakage and generalization limits.** Removing structural train/test leakage reduces AIDS accuracy to96.0% cross-train-test and94.4% intra-test; Linux falls to92.4% and86.1%, with intra-test MAE0.305. IMDB gives94.0%/93.8%. Thus the standard100% Linux result is not a leakage-free generalization guarantee. Training only on small IMDB graphs also lowers accuracy to83.0% and raises MAE to5.789, versus94.6%/0.937 with the stated mixed training data. The separately trained GEDRanker-loss variant reaches92.6/99.5/94.0% on AIDS/Linux/IMDB; that alternative experiment does not make the main supervised method label-free (Tables2-4/AppendixC).

**Candidate budgets, negative cases and timing.** One-candidate greedy decoding can be worse than a single Hungarian extraction; increasing k improves quality in the shown ranges. Hungarian extraction from the generated matrices gives AIDS98.1% versus greedy98.0% and IMDB94.7% versus94.6%; the reported3.5ms versus0.43ms concerns extraction alone, not complete inference. Main end-to-end times include multi-step generation and candidate selection. MATA* is faster on the small datasets, around0.0048s versus0.076s, while Hungarian/VJ are also faster with weaker quality. A24-hour cap for some search baselines is a measured budget limit rather than an impossibility result (Section6/AppendixD/Table6).

The ablations do not uniformly favor full diffusion on every metric. On IMDB, one-shot prediction has MAE0.832 and the VAE alternative0.740, both below full diffusion0.937, although VAE accuracy94.3% is slightly below94.6%; its inference0.01668s is much faster than0.15105s. Additional de-leaked datasets give ZINC70.8% equality accuracy/MAE0.387 and Code2 97.0%/0.040. In the GRAIL comparison, GRAIL is better on IMDB quality,99.3%/0.025 versus DiffGED94.6%/0.932, while DiffGED is faster there,0.15107s versus0.21144s. Neither universal95% accuracy nor universal best quality/speed is supported (Tables5/7-8/AppendicesD-E).

**Resources.** Training uses200 epochs, batch128, Adam learning rate1e-3 and weight decay5e-4. The stated machine has an RTX3090 with24GB VRAM and an i9-12900K/128GB RAM. Test timings exclude offline model training and dataset/label generation. The additional LLM comparison does not provide a matched total training/inference-cost account for both approaches.

## Limitations

### Discussed in the Paper

Multi-step generation is slower than one-shot prediction. Dense source-target matrices and multiple candidates cost memory; the authors propose latent representations, pruning and incremental generation as future directions. Labels, structural leakage and synthetic-graph training affect the measured generalization (AppendicesC-F).

### Curator Notes

The feasible-path upper-bound interpretation is stronger than treating generated matrices themselves as valid assignments, but it supplies no optimality certificate. Approximate IMDB labels and equality-based accuracy require separate interpretation from exact small-instance results. Experiments use dataset-specific models/configurations; one architecture on several graph datasets is not evidence for one unchanged solver across unrelated native optimization tasks.

The released core confirms standard signed BCE, stochastic reverse sampling, greedy injection and adjacency-difference cost evaluation. It also samples negative match entries with a fixed epoch_percent=0.5 in mapping_loss rather than simply averaging every pair entry. The README exposes AIDS/Linux/IMDB pipelines; complete leakage-removal, ZINC/Code2 edge-label and GRAIL-comparison reproduction is not established by those commands alone. No training or benchmark was rerun in this audit.

## Reproducibility

- **Publication:** [ICML2026/PMLR306](https://proceedings.mlr.press/v306/huang26bi.html), pages47851-47870. Official HTML citation_publication_date and publisher source issued metadata give September29,2026, distinct from the conference dates. Six authors and four institutional affiliations were checked against the PDF.
- **Scientific coverage:** all twenty [publisher PDF](https://raw.githubusercontent.com/mlresearch/v306/main/assets/huang26bi/huang26bi.pdf) pages, full bibliography, AppendicesA-F, algorithms, dataset construction and additional tables/figures. The publisher page/source lists no extra supplements; the full author archive inventory contains code/data/checkpoints/results and no additional scientific PDF.
- **Implementation:** [official DiffGED](https://github.com/piupiupiuu/DiffGED); archive inventory, README, model, matching loss, sampling/decoding/cost implementation and parameter configuration inspected. Available commands and checkpoint/data presence are not a claim that all paper experiments were reproduced.
- **Relations:** five exact current-catalogue citations: DIFUSCO and DIMES in the AGNN/discrete-generation discussion; the graph-matching-benchmark position paper for leakage; GEDRanker for the alternative loss; GELATO for processed ZINC/Code2 data. The last two bibliography year labels differ from their formal catalogue venues/years; identity was checked by title/authors rather than year alone.
