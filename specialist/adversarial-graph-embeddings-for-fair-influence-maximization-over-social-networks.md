---
id: adversarial-graph-embeddings-for-fair-influence-maximization-over-social-networks
short_title: Fair-Emb
title: Adversarial Graph Embeddings for Fair Influence Maximization over Social Networks
authors:
- Moein Khajehnejad
- Ahmad Asgharian Rezaei
- Mahmoudreza Babaei
- Jessica Hoffmann
- Mahdi Jalili
- Adrian Weller
year: 2020
date: '2020-05-08'
publication:
  date: 2020-07
  source_url: https://ijcai.org/proceedings/2020/bibtex/594
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2020/594
institutions:
- Monash University
- RMIT University
- Max Planck Institute for Software Systems
- The University of Texas at Austin
- University of Cambridge
- Alan Turing Institute
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
- Subset Selection
problems:
- Fair Influence Maximization
- Independent Cascade Seed Selection
summary: Graph-specific adversarial autoencoder embeddings feed classical group-aware seed clustering; experiments
  reduce group-normalized cascade disparity while maintaining competitive influence, without fairness/optimality
  certificates.
arxiv_url: https://arxiv.org/abs/2005.04074
code_url: https://github.com/redfox-codder/fair_influen_max
figure:
  path: paper-assets/adversarial-graph-embeddings-for-fair-influence-maximization-over-social-networks/framework.png
  alt: Original Figure1 contrasts ordinary and adversarial autoencoder node embeddings and the sensitive-attribute
    discriminator.
  caption: Original Figure1 and full caption illustrate graph-specific adversarial representation learning before
    seed selection.
  source_url: https://ijcai.org/proceedings/2020/0594.pdf#page=3
---

# Adversarial Graph Embeddings for Fair Influence Maximization over Social Networks

> **TL;DR:** Fair-Emb trains a graph-specific autoencoder against sensitive-attribute classifiers, then selects seed nodes through classical clustering in the learned embedding. The reported cascades show reduced group disparity with competitive total reach. Matching latent distributions is a heuristic for downstream fairness, not a certificate of it.

## Motivation

Maximizing total influence alone can underserve smaller or less connected communities. The paper measures fairness through approximately equal expected fractions reached within each group, IA/|A|≈IB/|B|, rather than equal absolute counts or merely balanced seed membership. It aims to reduce this disparity while retaining high total Independent Cascade reach. [pp. 1–3]

## Contributions

- Graph-specific neural embeddings preserve adjacency information while an adversarial discriminator predicts a sensitive attribute.
- Adding one discriminator per attribute extends the training objective to multiple sensitive attributes.
- Clustering and group-aware seed selection connect the representation to a discrete influence-maximization solution. [pp. 2–4]

## Methodology

Each node is represented by its adjacency row. A dense encoder/decoder learns a low-dimensional representation; adversarial training encourages overlap between group embedding distributions. The paper writes reconstruction loss minus a weighted discriminator-difference term. The released notebooks implement binary-cross-entropy classifiers and an encoder loss with flipped discriminator labels, using weights 10 for the single-attribute notebook and 2 for the two-attribute notebook. These are related adversarial objectives, but not identical printed formulas. [pp. 3–4; notebook loss cells]

Selection first clusters the embeddings, then uses nearest-to-centroid group composition to allocate seed slots within clusters. The experimental discussion uses four initial clusters. A cluster centroid is not automatically a graph node; the release maps the selections to actual node indices. The `re-cluster` implementation fits one centroid per subgroup and takes the allocated number of nearest nodes, while the prose describes multiple subgroup centroids. Algorithm 2 also has an inconsistent initial k/|S| notation, so exact seed-budget reproduction requires checking the chosen implementation. [Algorithm 2; pp. 4,6]

This is **specialist/constructive**. Neural representation learning supports construction of a seed set; there is no learned incumbent-improvement policy or cross-problem shared-checkpoint experiment. The adjacency-width input and graph-specific training are transductive, rather than an established inductive solver for unseen graph sizes.

## Experiments

The source Rice Facebook network has 1,205 nodes, but the reported experiment filters age>20 and uses groups of 97 and 344 nodes:441 nodes total. Edge activation probability is 0.01. The displayed synthetic network has 500 nodes split 150/350 with activation probability 0.03. Additional synthetic settings are mentioned but not fully reported. Seed-count plots extend to 40. [pp. 4–5]

Figures 3–4 compare ordinary embeddings, Fair-Emb, classical greedy and Tsang's fair-influence method. Fair-Emb generally raises the minority's reached fraction and reduces the difference between group-normalized reach, while total influence remains competitive. This does not mean total reach is identical at every seed count or that all fairness/quality tradeoffs disappear. Figure 5 extends disparity comparisons to two attributes and reports runtime in hours; it is not a complete modern scaling or hardware-controlled benchmark. [pp. 5–6]

## Limitations

- Similar group embedding distributions do not mathematically guarantee equal diffusion reach. The paper supplies an intuition, without a general fairness or approximation guarantee for this neural/clustering pipeline.
- Approximate reconstruction does not establish the prose's exact invertibility claim. Selection also depends on attribute labels and clustering choices.
- The main evaluation is one filtered real graph and a displayed synthetic setting under fixed IC probabilities. Generalization across unseen networks or other diffusion models is not demonstrated.
- The article does not fully report uncertainty, independent training seeds and a reproducible hardware/training-cost protocol. Current code/README disagree on discriminator pretraining and joint-training epoch counts; these versions should not be silently combined.

## Reproducibility

Read all seven pages of the [formal IJCAI 2020 paper](https://ijcai.org/proceedings/2020/0594.pdf), its complete bibliography and all figures/algorithms. The official [publication metadata](https://ijcai.org/proceedings/2020/bibtex/594) identifies the Special Track on AI for Computational Sustainability and Human Well-being, pages 4306–4312, DOI 10.24963/ijcai 0.2020/594, **July 2020** at month precision. The matching six-author [arXiv history](https://arxiv.org/abs/2005.04074) has v1 on **2020-05-08** and v2 on 2020-05-11; only the formal PDF is counted as fully read here.

The paper's original Ahmadreza 401 repository redirects to the [author implementation](https://github.com/redfox-codder/fair_influen_max/tree/5d9905e681ddfae079ccc630ec79fee31c3161de). Its complete eight-entry inventory contains two notebooks and data, with no separate scientific PDF/archive. README and relevant notebook architecture, loss, seed-selection and configuration cells were inspected; this does not claim all notebook experiments were rerun. The 30-dimensional release encoder uses 120/60/30 units, with a 60/120/N decoder and 25/15/6/1 discriminator. The official 270-second presentation is listed separately and is not counted as read PDF material or a verified verbal source. Figure 1/full caption is an original crop from formal page 3. No internal citation edge was supported by matching this bibliography to the current catalogue.
