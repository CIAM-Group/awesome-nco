---
id: parameterizing-branch-and-bound-search-trees-to-learn-branching-policies
short_title: TreeGate
title: Parameterizing Branch-and-Bound Search Trees to Learn Branching Policies
authors:
- Giulia Zarpellon
- Jason Jo
- Andrea Lodi
- Yoshua Bengio
year: 2021
date: '2020-02-12'
publication:
  date: '2021-05-18'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/16512
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/16512
institutions:
- Polytechnique Montréal
- Mila
- Université de Montréal
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Heterogeneous Mixed-Integer Linear Programming
summary: A shared neural branching policy uses 25 candidate features and 61 search-tree features to gate variable
  scoring across heterogeneous MILPs; controlled experiments reduce nodes relative to a candidate-only model, with
  known-optimum cutoffs and test-involved model selection limiting the conclusions.
arxiv_url: https://arxiv.org/abs/2002.05120
code_url: https://github.com/ds4dm/branch-search-trees
figure:
  path: paper-assets/parameterizing-branch-and-bound-search-trees-to-learn-branching-policies/framework.png
  alt: TreeGate uses a search-tree embedding to gate multiple layers of candidate-variable representations before
    scoring branching choices.
  caption: 'Original Figure 2: NoTree candidate scoring and TreeGate context gating.'
  source_url: https://cdn.aaai.org/ojs/16512/16512-13-20006-1-2-20210518.pdf#page=4
---

# Parameterizing Branch-and-Bound Search Trees to Learn Branching Policies

> **TL;DR:** TreeGate imitates SCIP's reliability hybrid branching with a shared network across heterogeneous MILPs. A 61-feature tree state gates the processing of 25 features per candidate variable. It reduces explored nodes relative to a candidate-only neural model in a controlled experiment, without establishing faster general-purpose optimization or superiority to default SCIP.

## Motivation

Class-specific learned branching often relies on regularities in a particular MILP formulation. The authors instead ask whether dynamic roles in a branch-and-bound search provide a representation shared across different formulations. Candidate features summarize past search behavior, while tree features contextualize how useful a variable might be at the current search stage. The proposed generalization is empirical; no theorem establishes recovery of universal branching factors. [Formal pp. 1–3]

## Contributions

- Designs 25 candidate-variable features and 61 features for the evolving search tree.
- Introduces NoTree scoring with variable-sized candidate sets and TreeGate modulation using the global tree state.
- Learns SCIP reliability hybrid branching decisions rather than directly imitating full strong branching.
- Evaluates shared policies across a curated heterogeneous MILP split, including node counts, timeout cases, data augmentation and a negative batch-normalization ablation. [Formal pp. 3–7; arXiv v4 pp. 9–16]

## Methodology

Each candidate has LP solution/bound information, normalized branching scores and statistics on past branching, inferences, conflicts, cliques and cutoffs. Tree features describe the current node, tree composition, depth/backtracks, LP activity, gaps, bound evolution, average scores and open-node distributions. They are collected through customized PySCIPOpt. These hand-crafted features abstract the formulation; they still depend on the solver trajectory and are not a complete Markov state. [Formal p. 3; v4 pp. 10, 15–16, Table 10]

NoTree applies common dense layers to every candidate, reduces feature dimensions and average-pools to a scalar score. A softmax defines the training distribution over the current candidate set. TreeGate embeds the tree state into sigmoid gates that modulate multiple candidate-processing layers. The candidate count acts as a variable batch dimension; a common set of weights handles different counts. Public evaluation chooses the maximum-scoring candidate deterministically. SCIP then performs valid branching and the remaining search. This is constructive solver guidance, not a neural incumbent-edit policy. [Formal pp. 3–4, Figure 2; official brancher]

Cross-entropy behavioral cloning uses decisions of `relpscost`, SCIP's reliability version of hybrid branching. Training searches use variable permutations and optionally the first k random branching decisions before switching to the expert, with k in {0,1,5,10,15}. The purpose is broader search-state coverage; labels from an expert trajectory do not remove imitation distribution shift or guarantee a minimum search tree. [Formal pp. 4–5]

The selected NoTree and TreeGate models are each trained jointly over the heterogeneous training set and deployed across the different test MILPs. This is actual shared-checkpoint evidence, beyond common architecture or one synthetic family's size shift. The entry is **generalist / constructive**, limited to heterogeneous MILP branching with the same solver interface. [Formal pp. 1–2, 5–7; v4 Table 4; official checkpoint-loading/evaluation code]

## Experiments

Twenty-seven curated instances from MIPLIB 3/2010/2017 and MILPLib yield 19 training and eight test problems. Root-solved problems are removed, and manageable search sizes with known optima are preferred. Training/validation share the same 19 instances but different permutation seeds; the test set uses distinct instances. The split has 85,533 training, 14,413 validation and 28,307 test branching samples. Five solver seeds are used per instance. This is a small curated benchmark, rather than an unrestricted sample of industrial MILPs. [Formal p. 5; v4 pp. 9–10]

SCIP 6.0.1 keeps presolve and cut separation, disables all primal heuristics, receives the known optimal objective value as a cutoff, and has a one-hour limit. Several strong-branching side effects are disabled. The paper's “fair” node measure accounts for remaining domain reductions/cutoffs from strong-branching probes; it is separate from raw node counts. These settings isolate branching behavior and do not model finding a good incumbent from scratch. [Formal pp. 5–6; v4 pp. 10–11, Table 5]

Models train for 40 epochs with Adam, weight decay 1e−5 and learning-rate reductions at epochs 20 and 30; hidden widths 32/64/128/256, three learning rates and TreeGate depths 2/3/5 are explored. The final TreeGate uses width 64, depth 5 and rate 0.01; NoTree uses width 128 and rate 0.001. Policies are first shortlisted using **test accuracy**, then selected by their node average over **all 135 training-and-test solver runs**. Thus the final test results are not an untouched model-selection holdout. [Formal pp. 5–6; v4 p. 12, Table 7]

Selected top-1 test accuracies are 83.70% versus 64.02%, a **19.68 percentage-point** difference. Shifted geometric node means with shift 100 are 1,056.79 versus 1,241.79 over all instances, and 2,239.47 versus 3,068.96 over test instances: approximately 14.9% and 27.0% fewer nodes. These are reductions relative to NoTree, not runtime improvements. Default `relpscost` remains better in aggregation: test raw/fair node means are 712.77/1,276.76. TreeGate also loses to NoTree on map18 and mine-166-5. [Formal pp. 5–7, Tables 2–3]

Both selected neural policies and default branching finish all runs within one hour. The GCNN comparison times out 24 times across seven instances; its aggregate censored node counts require that qualification. GCNN uses full strong-branching labels, a ten-minute collection limit, reduced training/test batch sizes 4/16 and separate hardware. The comparison supports a result for the tested setup, not a theorem that graph representations cannot generalize. Appendix E also reports batch-normalized NoTree instability and five one-hour timeouts on a training instance, despite apparently stable imitation accuracy in one case. [Formal p. 6; v4 pp. 10–14]

## Limitations

Known-optimum cutoffs, disabled heuristics and selection using test outcomes materially constrain the experiment. Eight distinct test instances and solver permutations provide limited evidence about broader task distributions. Higher imitation accuracy need not mean fewer nodes, and fewer nodes need not mean less wall-clock time once feature extraction and network inference are included. No generalization, approximation-quality or runtime guarantee is proved.

The method depends on engineered solver features and a custom PySCIPOpt interface. Exact optimization correctness remains a property of SCIP's complete valid search, rather than the neural predictor. The paper's hypothesis about shared higher-order branching factors is an interpretation of the observed benchmark results.

## Reproducibility

All nine formal pages, all sixteen pages of identified arXiv v4, the one-page official AAAI poster and fifteen-page official SCIP Workshop handout were read completely: **25 article pages plus 16 poster/slide pages**. This covers all references, Appendices A–E, ten tables, input normalizations, 86 feature specifications, optimization curves and the batch-normalization negative result. Key formulas, architecture, tables, figures and supplementary media were visually checked. The repository explicitly points to the arXiv copy as the full scientific supplement; no missing independent proof PDF is named. The linked ordinary talk video was not claimed as viewed.

Primary history gives v1=2020-02-12 and read v4=2021-06-02. Formal publication is 2021-05-18, distinct from the February conference event. The official code commit `b0cec513c026b52a00b666f7471d6f4abaf6e1ce` is dated 2021-07-19. Its 320-member/303-file archive was inventoried; the only scientific PDFs are the fully read poster and handout, with no other scientific archive, TeX, video or notebook. README documents SCIP 6.0.1, customized PySCIPOpt, OSF data and selected models. Network/gating modules, deterministic branch selection and common checkpoint loading were inspected; they implement solver-guided branching and CPU evaluation. Weights were not loaded, code trained, or SCIP benchmarks independently rerun. Different hardware is recorded for neural training, classical SCIP evaluation and GCNN; reported node-count results are not converted into cross-machine runtime claims. Publisher HTML/OpenReview access failures are logged separately from the accessible formal PDF and integrated supplement.
