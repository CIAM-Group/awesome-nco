---
id: adversarial-graph-matching
short_title: Graph Matching Attacks
title: Adversarial Attacks on Deep Graph Matching
authors:
- Zijie Zhang
- Zeru Zhang
- Yang Zhou
- Yelong Shen
- Ruoming Jin
- Dejing Dou
year: 2020
date: '2020'
publication:
  date: '2020'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/ef126722e64e98d1c33933783e52eafc-Abstract.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2020/hash/ef126722e64e98d1c33933783e52eafc-Abstract.html
institutions:
- Auburn University
- Microsoft
- Kent State University
- University of Oregon
- Baidu Research
scope: study
paper_type: analysis
problem_families:
- Graph Matching
problems:
- Network Alignment
summary: GMA combines density-guided topology edits with meta-learned attack initializations to evaluate the vulnerability of supervised network alignment.
---

# Adversarial Attacks on Deep Graph Matching

> **TL;DR:** GMA attacks supervised network alignment by changing edges in both graphs, combining a density surrogate with meta-learned projected-search initializations. Its evidence concerns attack effectiveness under specified budgets, rather than certified imperceptibility or a general-purpose matching solver.

## Motivation

Matching accounts or entities across two graphs depends on both within-graph topology and cross-graph correspondence. An attacker can make the true counterpart harder to distinguish by placing a node near many structurally similar nodes. The paper asks whether small topology changes can damage learned alignment, and whether choosing better attack starting points improves projected search (paper PDF pp. 1–3).

## Contributions

The graph matching attack model, GMA, combines two components: kernel density estimation (KDE) to favor confusing dense regions, and meta learning-based projected gradient descent (MLPGD) to learn initializations that adapt to batches of matched nodes. Gaussian smoothing and a Monte Carlo gradient estimator allow optimization through the discrete attack module (paper pp. 3–7).

This is an adversarial evaluation method for learned matching. Additional experiments adapt the framework to node classification and embedding/link prediction; they do not establish that one trained checkpoint solves all these tasks. The supplement's KDE calculations analyze an idealized statistical estimator, rather than certify attack optimality or matching robustness.

## Methodology

Each node is represented by its binary adjacency row. Known matched pairs supervise a mapping between graphs, while the other nodes and their topology are visible in the transductive setting. The attack changes edges in both graphs and maximizes the matching-distance term plus estimated densities of the attacked nodes, as in Eq. (9) (paper pp. 2–4).

Algorithm 1 shrinks dimension-specific KDE bandwidths using derivative and variance estimates. The implementation uses a product Gaussian kernel and a Gaussian parametric correction. Appendix A.5 assumes independent, identically distributed samples and kernel moment conditions; its Taylor/central-limit calculations additionally use smooth-density and shrinking-bandwidth asymptotics. These assumptions should not be silently transferred to dependent binary adjacency rows (supplement PDF pp. 4–8).

Two three-layer perceptrons generate attack starting points. MLPGD adapts their parameters to batches, evaluates a discrete projected attack, and updates shared initialization parameters. Algorithms 3–4 estimate gradients of a Gaussian-smoothed attack loss with sampled parameter perturbations. The projected process has a per-node edit budget; Appendix A.4 specifies that the reported global-budget experiments use **epsilon = 1**, repeatedly selecting nodes until the graph-wide edit limit is reached. This implementation detail differs from the main text's separate suggestion of epsilon between 2 and 3 (paper pp. 5–8; supplement p. 4).

## Experiments

The main evaluation uses autonomous-system graphs (AS), Last.fm/LiveJournal social networks (SNS), and DBLP coauthor graphs, attacking SNNA, CrossMNA and Deep Graph Matching Consensus. Ten percent of known correspondences are used for training and the rest for testing. Existing graph attacks are adapted by replacing their original objectives with a matching loss; evaluation reports mismatching rate and Precision@30 (paper p. 7).

At a **5% graph-wide edge-perturbation budget**, DGMC mismatching rates change from 34.7% to 54.9% on AS, 41.6% to 55.7% on SNS, and 63.2% to 80.7% on DBLP. GMA has the largest mismatching rate in all nine entries of Table 2. Figures 3–6 vary edit budgets and supervised-match ratios, and ablate KDE, PGD and meta-learned initialization. These are attack results, not matching-accuracy improvements (paper pp. 7–9).

The supplement tests attacks adapted to GCN and GraphSAGE on Cora, Citeseer and Pubmed, and tests adversarial training and low-rank defenses. GMA is strongest in most, rather than every, auxiliary comparison: Cora GCN accuracy is 72.4% under GMA versus 72.2% under CW-PGD, where lower accuracy means a stronger attack. Defense reduces damage without restoring clean matching performance. Parameter sweeps and convergence curves are also provided; their finite-run stabilization is empirical (supplement pp. 1–4).

## Limitations

### Curator Notes

Higher estimated density is a surrogate for confusion and concealment. The paper does not measure human detection rates or prove undetectability. The reported Shapiro–Wilk nonrejections on AS/SNS do not establish that arbitrary binary graph rows are independent Gaussian samples. The KDE results consequently require their statistical assumptions and do not furnish graph-level robustness certificates (paper pp. 3–4; supplement pp. 3–8).

The printed implementation description says that composing ReLU and Softsign produces binary initializations (paper p. 6). Under their usual definitions, a positive input of 1 instead produces 1/2 in either composition order; an additional discretization rule would be needed for exact binary output. This is a curator qualification of that implementation assertion, rather than evidence that the measured attacks were not run. Likewise, the quadratic complexity statement on p. 8 suppresses iteration counts, gradient samples, network dimensions and tuning; it is not an end-to-end runtime comparison.

The experiments concern three alignment datasets, selected target models and specified edit budgets. Adaptation of the attack objective to another task is separate from transferring a fixed learned attack without retraining. No certified optimal adversarial perturbation, universal solver, or guarantee against arbitrary defenses is established.

## Reproducibility

The [NeurIPS 2020 proceedings record](https://proceedings.neurips.cc/paper_files/paper/2020/hash/ef126722e64e98d1c33933783e52eafc-Abstract.html) confirms the title and six authors and links both the [18-page paper](https://proceedings.neurips.cc/paper_files/paper/2020/file/ef126722e64e98d1c33933783e52eafc-Paper.pdf) and [9-page scientific supplement](https://proceedings.neurips.cc/paper_files/paper/2020/file/ef126722e64e98d1c33933783e52eafc-Supplemental.pdf). Both were read completely, including all references and Appendices A.1–A.7; key algorithms, statistical formulas, figures and tables were inspected visually.

Appendix A.4 gives Python 3.7.3, NumPy 1.16.4 and SciPy 1.3.0, reports the PyTorch version as 1.0.14, and specifies 512-unit hidden layers, batch size 512 and learning rate 0.001. It lists the tested grids for adaptation/meta step sizes, gradient-sampling count, initial bandwidth and shrinkage factor, with parameter selection after 50 training iterations. Target matching implementations use 500 iterations and their linked author implementations. The supplement links target-model and baseline code, but no GMA implementation URL was verified in the publication record or the complete scientific PDFs. Experiments were not rerun.
