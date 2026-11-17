---
id: learning-network-dismantling-without-handcrafted-inputs
short_title: MIND
title: Learning Network Dismantling Without Handcrafted Inputs
authors:
- Haozhe Tian
- Pietro Ferraro
- Robert Noel Shorten
- Mahdi Jalili
- Homayoun Hamedmoghadam
year: 2026
date: '2025-08-01'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/39790
venue: AAAI
paper_url: https://doi.org/10.1609/aaai.v40i31.39790
institutions:
- Imperial College London
- RMIT University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Network Dismantling
- Node-Removal Ordering
summary: Featureless-initialized sigmoid-attention GNNs and discrete SAC construct graph dismantling sequences,
  transferring from rewired small graphs to large networks with important large-diameter and per-network exceptions.
arxiv_url: https://arxiv.org/abs/2508.00706
code_url: https://github.com/HaozheTian/MIND-ND
figure:
  path: paper-assets/learning-network-dismantling-without-handcrafted-inputs/framework.png
  alt: Original Figure1 shows FilmTrust before/after dismantling and relative LCC removal curves for MIND and baselines.
  caption: Original Figure1 and full caption illustrate the dismantling task and reported comparison, rather than
    a network-architecture diagram.
  source_url: https://arxiv.org/pdf/2508.00706v2#page=1
---

# Learning Network Dismantling Without Handcrafted Inputs

> **TL;DR:** MIND trains a featureless-initialized GNN/SAC policy to construct node-removal sequences. Sigmoid attention, embeddings from multiple message-passing depths and structurally diversified training graphs support transfer from small synthetic graphs to large real graphs. The best aggregate results coexist with substantial large-diameter-network exceptions.

## Motivation

Network dismantling seeks a removal sequence that quickly shrinks the largest connected component (LCC). Existing neural approaches often initialize nodes with manually computed structural heuristics. MIND replaces those input features with all-ones initialization and learns structural information from adjacency, aiming to reduce preprocessing and dependence on a fixed collection of heuristics. This does not mean the method has no architectural assumptions or inductive bias. [pp. 1–3]

## Contributions

- All-to-one attention uses cross-head information and sigmoid coefficients without neighborhood softmax normalization.
- Message-iteration profiles concatenate intermediate node representations to preserve information from several receptive-field sizes.
- An omni-node aggregates graph context for the policy and Q decoders.
- Degree-preserving rewiring diversifies small training graphs in assortativity and modularity before RL training. [pp. 3–4; Appendix C]

## Methodology

The policy repeatedly selects a node for removal from the residual graph. Node and omni-node embeddings feed shared scalar decoders. A discrete SAC procedure uses twin Q-functions, entropy regularization and exact action expectation within a graph. Although the ideal objective is an undiscounted normalized LCC area, actual training uses discount 0.99 and stops when the LCC falls below 10% of the initial graph size. The training surrogate should therefore be distinguished from a guarantee of optimizing every term of the full removal curve. [Equations 1–8; Appendix D/Algorithm 1]

The reported architecture has four heads with four features each, six message-passing layers and a 96-dimensional concatenated profile. Ten thousand training graphs have 100–200 nodes, from LPA, Copying and ER models followed by connectivity-preserving rewiring. Table 3 specifies eight million **steps**, replay 2 million, batch 512, Adam 3e-4,100,000 random-start steps and target synchronization every 8,000 steps. The main text instead says eight million episodes; the detailed step-based protocol is retained explicitly. Reported training takes about 90 hours on an RTX 5000 Ada. [Appendices C–D]

This is **specialist/constructive**. A shared checkpoint transfers between graphs of the same dismantling task. It constructs a removal ordering, rather than revising an incumbent complete ordering or solving distinct native CO problems with one model.

## Experiments

Real graphs cover biological, social, information and technological networks, from 128 to 1,402,673 nodes. Synthetic tests use ER, configuration and stochastic-block models at 1k/10k/100k nodes, averaged over ten realizations. Architecture ablations report five runs and validation on 20 synthetic graphs; their uncertainty bars are not automatically uncertainty estimates for every real-network result. [pp. 5–7; Appendices E–F]

Reported overall relative AUC is 100 for MIND, 104.2 for GDM and 115.0 for FINDER in Table 5, where lower is better and each graph is normalized against MIND. The prose gives 104.13 for GDM, a slightly different summary precision. Hyves dismantling is reported as 6.8 hours versus GDM 9.8 and FINDER 12.2 hours; Table 4 gives the exact node count above, whereas the runtime prose rounds it to 1.5 million. [Appendices E–F]

Performance is not uniformly best: on roads-california EI scores 23.4 and GDM 92.2 relative to MIND 100; on roads-sanfrancisco EI 15.5, BC 51.6 and GDM 92.0 are also better. On douban, FINDER 95.0 and GDM 95.7 beat MIND 100. The paper identifies large graph diameters as a weakness of its six-layer message passing. [Table 5; Appendix G]

## Limitations

- The large-diameter failure cases qualify aggregate state-of-the-art language. Claims of applicability beyond dismantling are future directions, without a demonstrated cross-problem checkpoint.
- A fixed-depth GNN pass can scale with nodes plus edges, but a complete sequence requires repeated passes, component computation and graph updates. Table 1 is not by itself a proof of linear end-to-end cost for every full dismantling run; measured hours are retained separately.
- Appendix A analyzes fixed linearized operators with a dominant spectral component. Its argument concerns alignment up to scale; unscaled embeddings need not converge to a finite eigenvector without normalization. It is not a general theorem for every learned nonlinear attention trajectory.
- Appendix B's Fiedler illustration needs a nonzero relevant spectral component. Constant initialization on a regular graph need not contain it, so universal Fiedler recovery is not established. The printed coefficient expressions also differ from its displayed normalized operator; the argument is treated as a conceptual construction, rather than a correctness guarantee for every input.
- The current release adds GraphNorm and uses a 192-input decoder, versus 196 in Table 3. Default 200,000 vector steps across 64 environments mean 12.8 million transitions, with target-frequency 200 meaning 12,800 transitions. These settings need adjustment to match the paper's eight-million-step/8,000-transition protocol.

## Reproducibility

Read all 15 pages of the identified [extended arXiv v2](https://arxiv.org/pdf/2508.00706v2), including complete references and Appendices A–G, and visually checked all figures/tables. The [formal AAAI 2026 article](https://ojs.aaai.org/index.php/AAAI/article/view/39790) is independently identified by the publisher deposit: five authors, pages 25905–25913, DOI 10.1609/aaai.v40i31.39790, publication **2026-03-14**. The [actual arXiv history](https://arxiv.org/abs/2508.00706) gives v1 **2025-08-01** and v2 **2025-12-30**. Publisher metadata expands Robert Shorten's name to Robert Noel Shorten.

The [author release](https://github.com/HaozheTian/MIND-ND/tree/80d5b3ce0fc1408b678b3684b1c753d3cbbdaf26), dated 2026-03-31, has an untruncated 10,120-entry inventory, training/evaluation graphs, one checkpoint, one notebook and a Figure 1 SVG; no additional scientific PDF/archive was identified. README and core network/environment/training/evaluation code were checked. All nine stored notebook images and its complete code cell were inspected without executing or deserializing data/model files. Figure 1/full caption is cropped directly from the PDF and shows the task illustration, rather than an invented architecture diagram.

The release uses negative relative LCC as reward and logs a raw Simpson-sum AUC up to the 10% threshold, without Equation 2's additional 1/N normalization. A constant per-graph scale cancels in within-graph relative AUC comparisons, but matters when comparing raw values or aggregating across graph sizes. These source/configuration checks do not reproduce the 90-hour training or million-node benchmark runs.
