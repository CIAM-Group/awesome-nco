---
id: agdn-learning-to-solve-traveling-salesman-problem-with-anisotropic-graph-diffusion-net
short_title: AGDN
title: 'AGDN: Learning to Solve Traveling Salesman Problem with Anisotropic Graph Diffusion Network'
authors:
- Bolin Shen
- Ziwei Huang
- Zhiguang Cao
- Yushun Dong
year: 2026
date: '2026-06-17'
publication:
  date: '2026-08-08'
  source_url: https://doi.org/10.1145/3770855.3817789
venue: KDD
paper_url: https://doi.org/10.1145/3770855.3817789
institutions:
- Florida State University
- Singapore Management University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: Directional multi-hop graph propagation predicts TSP edge heatmaps for incumbent-based Monte Carlo tree
  search. Supervised and unsupervised variants have different architectures; inference-only timing, spectral-proof
  gaps and release-specific MixScore defects limit broader claims.
arxiv_url: https://arxiv.org/abs/2606.19185
code_url: https://github.com/LabRAI/AGDN
figure:
  path: paper-assets/agdn-learning-to-solve-traveling-salesman-problem-with-anisotropic-graph-diffusion-net/framework.png
  alt: Two directional embedding spaces use MixScore and graph propagation to predict an edge heatmap, followed
    by Monte Carlo tree search.
  caption: 'Figure 1: MixScore, directional graph propagation, heatmap prediction and MCTS.'
  source_url: https://arxiv.org/pdf/2606.19185v1#page=3
---

# AGDN: Learning to Solve Traveling Salesman Problem with Anisotropic Graph Diffusion Network

> **TL;DR:** AGDN learns TSP edge heatmaps with directional graph propagation and uses them to guide incumbent-based MCTS. It is a **specialist/improvement** solver under the actual public search workflow. This is graph feature diffusion, not a generative denoising model. The supervised and unsupervised variants, their budgets and the currently released implementation need to be distinguished.

## Motivation

Sparsifying a dense TSP graph can discard optimal-tour edges and separate relevant nodes. Stacking ordinary graph-convolution layers to recover distant interactions can increase cost and introduce over-smoothing. AGDN proposes distance-informed transitions and multi-hop propagation within each layer, while separating source and destination embedding spaces. Evaluations concern two-dimensional Euclidean TSP, not a jointly trained family of native routing problems. [Introduction.](https://arxiv.org/pdf/2606.19185v1#page=1)

## Contributions

- **MixScore:** a proposed learned transition combines pairwise geometric proximity with node-feature similarity.
- **Directional multi-hop propagation:** separate source/destination spaces use learned hop weights initialized from personalized PageRank, followed by attention-based aggregation and edge-heatmap prediction.
- **Solver integration and evaluation:** static predicted edge preferences guide a classical MCTS tour search, with size/distribution transfer, three TSPLib cases and supplemental decoder/sparsity/hop comparisons.
- **A proposed spectral argument:** the paper presents a diffusion-distance contraction theorem. Its proof needs additional spectral and contraction conditions; it is not a demonstrated unconditional guarantee for the arbitrary learned directional transitions. [Method/theory.](https://arxiv.org/pdf/2606.19185v1#page=3)

## Methodology

### Representation and learning

Coordinates receive sinusoidal embeddings. A geometric exponential kernel exp(−d/sigma), row normalization, feature inner products and MLP mixing define the intended source/destination transitions. Each space propagates features over multiple hops, and cross-space attention/aggregation supplies an edge-existence heatmap. Supervised training uses solver-generated tour labels and classification loss. **Appendix B explicitly removes anisotropy and the dual-space aggregation in the unsupervised variant**, instead predicting a soft indicator matrix under the UTSP-style surrogate. Its empirical rows therefore do not by themselves isolate the benefit of every directional component advertised for the supervised design. [Equations1–8 and AppendixB.](https://arxiv.org/pdf/2606.19185v1#page=4)

Equation3 prints the same M·H term for every hop rather than powers M^k·H. The inspected implementation actually performs recursive matrix multiplication with a learned linear filter and ReLU at each hop; that is not the literal printed sum. The kernel prose also reverses sigma's effect: for fixed positive distance, a smaller sigma makes exp(−d/sigma) decay faster. These formulation discrepancies are recorded rather than silently repaired.

### Actual search and classification

Section3.5 retains top-k heatmap entries and follows UTSP's MCTS. The public `Generate_Initial_Solution` constructs a random complete permutation without neural preferences; `Markov_Decision_Process` then applies 2-opt and MCTS, restarting from random complete tours. Heatmap weights enter MCTS edge potentials/candidates for incumbent k-opt exchanges. Thus the learned heatmap guides solution improvement; it does not supply a separately proposed learned initial constructor in this pipeline. Different size/SL/UL models remain specialist checkpoints. [Search specification.](https://arxiv.org/pdf/2606.19185v1#page=5)

### Scope of the theory and current release

Appendix A writes the distance as a shared orthonormal Laplacian-eigenvector expansion and asserts that the two selected steps strictly contract the first nontrivial mode. The stated arbitrary directional MixScore matrices do not establish that common real orthonormal spectral representation, an appropriate spectral gap, or the asserted first-mode contraction. Its upper bound for the sum of higher-mode signed differences also requires justification when individual differences can be negative. The appendix argument is therefore retained as the authors' proposed reasoning with missing conditions, not a verified general theorem about the implemented network. This qualification does not negate the displayed empirical results. [Complete proof.](https://arxiv.org/pdf/2606.19185v1#page=11)

In the actual supervised release, `lin_attn_Ti/Tj` applies `Softmax(dim=-1)` immediately after a linear projection to one scalar per node pair. That dimension has length1, so the learned affinity is identically1. With beta=.5, `prop_T` produces .5T+.5·ones rather than the claimed feature-sensitive row-normalized MixScore. An isolated execution of the author's actual `AGDLayer_Node.prop_T` confirms zero change under changed input embeddings and row sum2 for a three-node row-stochastic T. The result and scope are saved in `mixscore-component-check.json`; no full training or table reproduction was performed.

The unsupervised training entry imports `diffusion_agdn`, while the inventoried release contains `diffusion_agd.py` and lacks the imported module (also lacking other unconditionally imported diffusion modules). The available `diffusion_agd.py` still contains dual-space layers, unlike Appendix B's stated removal. These are concrete snapshot discrepancies to resolve, not proof that a different unretrieved experimental version had the same behavior.

## Experiments

### Data, hardware and budgets

The paper describes one million training/10,000 test TSP100 instances, and3,000 training/128 test instances for each of TSP200/500/1000, using prior public datasets. Size transfer trains at100 and tests larger sizes; four spatial distributions and three TSPLib instances are separate protocols. Appendix B gives three layers, hidden128, dropout.5, K5 and teleport.1; supervised training uses20epochs, Adam, weight decay1, StepLR(.8 every8epochs) and gradient clipping1. The stated unsupervised setup follows UTSP, including300epochs and size-dependent batches. Public README configurations include additional size-specific differences; they are not one universal checkpoint/configuration.

Hardware is an RTX6000Ada, AMD EPYC7763/128threads and1TB memory. Search uses32CPU workers. The inspected search termination checks CPU `clock()` against Param_T·N, with Param_T=.08, after already performing an initial 2-opt/MCTS pass; this is not a hard bound on total GPU+CPU wall time. **The paper defines Time as neural inference time**, so its tabulated subsecond/second values do not measure the full MCTS solver. Comparing .97s of AGDN inference with1183s of NeuroLKH decoding is not an equal end-to-end budget comparison. [Metrics/setup.](https://arxiv.org/pdf/2606.19185v1#page=6)

### Measured gains and negative results

Table1 supervised AGDN gaps are .06/.74/1.28% on200/500/1000, versus GatedGCN+MCTS .21/1.28/7.26%. Inference is1.77/2.30/2.40s versus .52/1.46/4.96s: AGDN is slower at200/500 and faster at1000. DIFUSCO's displayed gaps .46/1.17% at500/1000 are better than supervised AGDN, although authors qualify their inability to reproduce DIFUSCO's reported settings. Unsupervised AGDN gives .05/.64/.96% versus UTSP .09/.84/1.18%. These improvements do not establish universal dominance across all methods/budgets.

Size transfer gives .17/.87/1.28% versus GatedGCN .26/1.16/12.1%. Distribution transfer is also mixed: clustered TSP1000 gives AGDN2.17% versus GCN-MCT2.10%, despite broader superiority prose. The three TSPLib cases tsp225/pcb442/pr1002 give .31/.75/2.76% versus GatedGCN .49/1.15/4.25%; three selected cases and one learned baseline do not establish real-world state of the art. [Tables2–4.](https://arxiv.org/pdf/2606.19185v1#page=7)

Appendix C reports hop15/24/30 gaps1.049/1.038/1.024%; the same printed two-decimal length does not imply identical unrounded tours. Sparsity.1–1.0 and 2-opt/Or-opt comparisons support robustness within those tested settings. At1000, AGDN2-opt/Or-opt gaps1.774/1.491% beat the corresponding GatedGCN13.91/11.50%. Broader-baseline Table8 has NeuroLKH .90% versus AGDN-UL .96% at1000. These rows have incomplete matched solver budgets. [All supplemental tables5–8.](https://arxiv.org/pdf/2606.19185v1#page=12)

LKH's negative gap against the displayed Concorde reference is not evidence of beating a true optimum; reference/rounding/protocol differences need reconciliation. Its TSP1000 runtime is38.1h in Table1 but38.1m in Table2. Rounded0.00% gaps and the no-neural-model baseline's0.00s inference do not certify optimality on every instance or zero search time.

## Limitations

Evidence covers Euclidean TSP with task/size-specific learning variants. Dense pairwise representations remain at least quadratic; the hop-efficiency comparison does not establish subquadratic complete-solver complexity. The unsupervised architecture differs materially from the main anisotropic design, and the experiments do not isolate every proposed ingredient. Test protocols mix reported baselines, neural inference timings and substantial classical search. Seeds, total training cost and end-to-end search times are not fully reported.

The spectral proof, printed formula/kernel interpretation, singleton-softmax implementation and missing unsupervised imports need reconciliation before claiming a faithful release reproduction. No assertion is made that all published tables have been independently rerun or invalidated.

## Reproducibility

- KDD2026 formal DOI10.1145/3770855.3817789, pages4173–4184, has publisher-deposited online publication2026-08-08 and print2026-08-09. The front date is arXiv v1 first posting2026-06-17, not the formal publication date. Formal four-author metadata agrees with the read manuscript: Bolin Shen/Yushun Dong at FSU, Ziwei Huang/Zhiguang Cao at SMU; Shen's work-at-SMU note and Dong's correspondence are retained.
- **All12pages of actual arXiv2606.19185v1**, including references and AppendicesA–C, were read with manual checkpoints. This is the identified authorized full-reading copy, not a claim of byte comparison against an unobtained publisher PDF.
- The explicit Zenodo resource DOI20496880 resolves to versioned software record20497158/v1.0.1. Its actual116,409,295-byte ZIP was inventoried and the MD5 matched. Its206members and the GitHub205-entry tree contain code, artifacts and three READMEs; no additional scientific PDF/TeX document was found. All three READMEs and the relevant network/training/search components were read. The author's apparent Slides link points back to the publications page, not an actual slide deck. No hidden slide content is claimed read.
- [Official code](https://github.com/LabRAI/AGDN) tree`82590be97dad43c26ca0383a6286b5550546b567` and the matching archived root were inspected. The isolated MixScore component check is not a full benchmark reproduction. Original full Figure1 is cropped from PDFpage3, rectangle(50,78,562,280), at4× and actually viewed; all key formula/proof/table/diagram pages were rendered and inspected.
- Internal edges require explicit body/table citations and matching bibliography entries. The new DEITSP target was independently matched to its ten-author primary arXiv/SMU metadata. Cited preprint years/titles are preserved; uncataloged HBGFN/NAR4TSP references remain external rather than forced onto unrelated entries.
