---
id: latent-search-space-routing
short_title: CVAE-Opt
title: Learning a Latent Search Space for Routing Problems Using Variational Autoencoders
authors:
- André Hottung
- Bhanu Bhandari
- Kevin Tierney
year: 2021
date: '2021'
venue: ICLR
paper_url: https://openreview.net/forum?id=90JprVrJBO
code_url: https://github.com/ahottung/CVAE-Opt
institutions:
- Bielefeld University
- University of Massachusetts Amherst
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A separately trained conditional VAE decoder constructs routing solutions while differential evolution
  searches its fixed latent inputs; evaluated on TSP and CVRP with substantial offline supervision and online search.
publication:
  date: '2021'
  source_url: https://iclr.cc/Downloads/2021
figure:
  path: paper-assets/latent-search-space-routing/framework.png
  alt: CVAE-Opt training encoder/decoder and search with a continuous optimizer feeding latent inputs to a route
    decoder.
  caption: 'Figure 1: supervised CVAE training and fixed-decoder latent search.'
  source_url: https://openreview.net/pdf?id=90JprVrJBO#page=3
---

# Learning a Latent Search Space for Routing Problems Using Variational Autoencoders

> **TL;DR:** A supervised conditional VAE learns an instance-conditioned routing decoder. Differential evolution searches its latent inputs with fixed network weights, repeatedly constructing complete routes; the quality gain comes with substantial offline supervision and per-instance search.

## Motivation

Fast learned routing policies do not necessarily use additional runtime effectively. CVAE-Opt learns a continuous representation of good solutions so that a generic continuous optimizer can guide search, without a hand-designed routing neighborhood or a separately learned objective surrogate. Training targets still require an external routing solver (Sections 1–3).

## Contributions

- Couple an instance-conditioned VAE with a generic continuous optimizer, evaluating decoded solutions using their actual routing cost.
- Train with randomly chosen equivalent solution sequences to reduce the effect of syntactic symmetries.
- Compare differential evolution (DE) with random latent search, attention-model sampling and classical/search baselines; analyze local latent neighborhoods and transfer across nearby instance sizes.

## Methodology

**Representation and network.** The experiments address Euclidean TSP and CVRP. A sequential encoder sees an instance and a high-quality solution and predicts a diagonal Gaussian latent posterior. Linear node embeddings, attention and GRUs encode the sequence; the autoregressive pointer decoder uses the instance, latent code and partial route to select the next node. Feasibility masks and updated demands/remaining vehicle capacity handle CVRP constraints. Corresponding embedding, attention and recurrent components share weights between encoder and decoder (Section 3; Appendix A).

**Offline learning.** Maximize reconstruction log likelihood minus a beta-weighted KL divergence to a standard Gaussian. Instead of always reconstructing exactly the encoder's input sequence, draw an equivalent target ordering at each epoch. The decoder is encouraged to represent equivalent solutions consistently; this is an empirical training mechanism, not a proof that symmetry is completely removed or that every latent point produces a high-quality solution.

**Online search.** Freeze the learned network. DE maintains 600 latent vectors, creates 600 crossover/mutation offspring per iteration and greedily decodes each to a complete route. Use 300 iterations, differential weight 0.3 and crossover probability 0.95; bounds cover 99% of coordinates obtained by encoding 1,000 separate validation instances. The comparison random search samples a Gaussian prior. This is repeated neural **construction** guided by classical search in latent space, rather than a learned operator that edits an incumbent route; the collection therefore labels it constructive. Models are separately trained for each task/size, so this is a specialist method.

## Experiments

- **Protocol:** TSP and CVRP with 20, 50 and 100 nodes/customers using the Kool et al. generator. Per class: 93,440 training instances, 100 search-validation instances and 1,000 test instances. TSP targets are Concorde optima; CVRP targets are heuristic LKH3 solutions. Train separate models for 300 epochs, validate every 25 epochs and choose among fewer than 20 training runs per class. The reported symmetry/beta ablations use five runs per setting.
- **Quality and runtime:** On TSP100, DE reports a 0.34% gap in 55.1 seconds, versus attention-model sampling at 1.65% in 82.1 seconds. On CVRP100, its average cost is 15.75 in 94.7 seconds, versus attention sampling at 15.93 in 97.2 seconds. LKH3 and NLNS both report 15.54, with runtimes 53.8 and 93.3 seconds; Concorde solves TSP100 optimally in 0.5 seconds. These results do not establish superiority over classical routing solvers (Table 1).
- **Comparison conditions:** CVAE-Opt and rerun attention sampling use one V100 and one CPU core; the attention baseline samples 500,000 solutions. NLNS uses ten CPU cores, GCN-BS batches 200 instances, and NeuRewriter results are quoted from its authors. The paper explicitly warns that these timing conventions differ. DE's nominal 600-by-300 offspring evaluations are substantial search, rather than one-pass inference.
- **Structure and transfer:** The latent-neighborhood experiment compares costs around a best-of-1,000 reference and excludes identical decoded solutions; it measures an average cost-distance association, not continuity or a global smoothness guarantee. Models trained on size 100 transfer better near that size than at 150: TSP gap rises from 0.34% to 1.45%; CVRP gap relative to LKH3 rises from 1.36% to 3.24% (Table 2). CVRP reference gaps are not certified optimality gaps.

## Limitations

The authors report expensive supervised preparation, sensitivity to beta and degradation away from training sizes; applying the framework to other problem types is future work. Generic continuous search avoids a routing-specific high-level neighborhood but still relies on problem-specific input features, masks, cost evaluation and solver-generated targets.

**Curator qualifications:** Claims that the learned space contains only good solutions are training aims and empirical observations, not guarantees. Appendix A describes posterior vectors as 128-dimensional, while Figure 6 describes two of 100 latent dimensions; the released code explicitly separates 128 hidden features from a default 100-dimensional latent space. Keep this distinction when implementing the model. Baseline quality, decoding budgets, hardware, offline label generation and model selection must all be considered when comparing methods.

## Reproducibility

- **Official code:** [ahottung/CVAE-Opt](https://github.com/ahottung/CVAE-Opt), directly linked by the paper. The earlier note's `learning-a-latent-search-space` URL was incorrect. The current repository provides model files and instance sets; large training data/solutions use Git LFS. No training or optimization experiment was rerun in this audit.
- **Code check:** README, configuration files and selected model/search/DE routines were inspected. Defaults agree on population 600, 300 iterations, weight 0.3 and crossover 0.95, with an additional 600-second time limit. The decoder combines the embedded previous node with context and latent code through two consecutive linear maps; Appendix A uses compact raw-input/single-map notation. The implementation's posterior projections use the independently configured latent dimension, clarifying the 100/128 distinction.
- **Version and supplements:** All 13 pages were freshly read, including the complete bibliography and Appendices A–B. The publicly accessible conference-archive mirror has the ICLR 2021 publication header and matching title/byline; its actual retrieval URL and SHA are registered. Byte identity to the blocked original is not asserted. Normal OpenReview access is challenged; no separate scientific supplement has been identified. The 48-entry code tree contains data ZIPs/LFS pointers, not a further narrative appendix.
- **Figure:** Figure 1 is reproduced directly from PDF page 3, including both training and search panels and its caption. Evidence pages and nine exact internal citations are registered separately.
