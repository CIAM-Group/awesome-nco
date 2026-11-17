---
id: learning-branching-heuristics-for-propositional-model-counting
short_title: Neuro#
title: Learning Branching Heuristics for Propositional Model Counting
authors:
- Pashootan Vaezipoor
- Gil Lederman
- Yuhuai Wu
- Chris Maddison
- Roger B. Grosse
- Sanjit A. Seshia
- Fahiem Bacchus
year: 2021
date: '2020-07-07'
publication:
  date: '2021-05-18'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/17474
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/17474
institutions:
- University of Toronto
- University of California, Berkeley
- Vector Institute
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Satisfiability
problems:
- Exact Propositional Model Counting (#SAT)
summary: Family-specific GNN branching policies trained with evolution strategies guide exact SharpSAT model counting;
  large step reductions become runtime improvements on selected structured families, while time annotations, inference
  overhead and family-specific training limit the scope.
arxiv_url: https://arxiv.org/abs/2007.03204
code_url: https://github.com/NeuroSharp/learningCNF
figure:
  path: paper-assets/learning-branching-heuristics-for-propositional-model-counting/framework.png
  alt: Literal-clause incidence graph with positive and negative literal nodes and two independent components.
  caption: 'Original Figure 1: the literal-clause incidence representation used by Neuro#.'
  source_url: https://cdn.aaai.org/ojs/17474/17474-13-20968-1-2-20210518.pdf#page=3
---

# Learning Branching Heuristics for Propositional Model Counting

> **TL;DR:** Neuro# learns which literal an exact SharpSAT model counter should branch on. The classical solver still performs exhaustive counting with propagation, clause learning and component caching. Family-specific policies substantially reduce branching on some larger structured instances; branch-count gains, selected wall-clock gains and cross-family model sharing are separate questions.

## Motivation

Exact #SAT counts every satisfying assignment of a CNF formula. Useful encodings arise in probabilistic inference and bounded planning, but a generally useful branching heuristic may ignore repeated family structure. Neuro# customizes the 2012 SharpSAT search procedure using a generator of small training instances, hoping that learned decomposition choices transfer to larger instances of that same family. This is exact counting guidance, rather than a neural satisfiability classifier or approximate #DNF count predictor. [Formal pp. 1–2]

## Contributions

- Casts residual-component literal branching as an episodic decision process optimized by evolution strategies.
- Uses a literal–clause GNN, including paired positive/negative literal embeddings, to score branch choices.
- Studies held-out and larger generated instances from eight domain categories, with selected runtime comparisons and solver-statistic analyses.
- Separates graph-only features from original-problem time annotations, and reports a negative ablation when adding VSADS scores. [Formal pp. 3–7; arXiv v2 pp. 13–15]

## Methodology

For a selected literal, the exact solver counts both truth branches and adds their counts; independent residual components have counts multiplied and cached. The network changes branch order, not this counting logic. Correctness of a completed run belongs to the classical algorithm; a capped incomplete run is not an exact count supplied by the neural model. [Formal pp. 2–3, Algorithm 1; v2 pp. 9–10, Algorithms 2–3]

The current component is represented by a literal–clause incidence graph. Two GIN-style message-passing rounds use 32-dimensional embeddings; literal-to-clause messages concatenate each literal and its negation. A 32–256–64–1 MLP selects the highest-scoring literal. Grid-world experiments append the normalized original encoding timestep, producing a 33-dimensional input to the policy head. This semantic annotation is available from the generator; it is not automatically recovered from arbitrary CNF input. [Formal p. 4, p. 6]

Training penalizes each branching step by 1e−4 and gives a terminal reward of 1; truncated episodes receive no completion reward. Each of 1,000 ES updates samples eight formulas and 48 Gaussian perturbations with sigma 0.02, mirrored to 96 perturbations: 768 episodes per update. Adam uses learning rate 0.01 and weight decay 0.005. Training and testing caps are normally 1,000 and 100,000 branching steps. [Formal pp. 3–6]

The networks are trained separately for problem families. The native solver task is #SAT throughout; transferring a cell/grid policy to a larger instance is size transfer. The actual model paths also distinguish Sudoku, bit-vector, individual cellular rules and grid families. The appropriate classification is **specialist / constructive exact-solver guidance**, despite the common architecture and diverse source encodings. [Formal pp. 1, 4–6; official evaluation script]

## Experiments

The generated categories are Sudoku, blocked n-queens, three cellular-automaton rules, SHA-1 preimages, island planning, grid-world planning, bit-vector expressions and iterated expressions. The formal setup states 1,800 training and 200 test instances per dataset. Appendix C instead describes average ten-hour training on 1,000 instances per problem; this discrepancy remains unresolved. It reports three nodes, each with a 32-core AMD Ryzen Threadripper 2990WX and 128 GB RAM. Runtime testing is sequential. Hyperparameters are selected using i.i.d. test performance, initially on cell(35); no separate clean validation protocol is established by that description. [Formal pp. 4–6; v2 pp. 10–12]

Table 1 reports mean branching steps, not seconds. Examples are Sudoku 220→195, grid-world 195→66 and cell(49) 338→206 versus default SharpSAT. Upward transfer is highly uneven: larger Sudoku is 2,373→2,300, while cell(49,348,280) is 37,345→2,671. On cell(9,40,40), the random policy's 39,000 steps are better than Neuro#'s 42,325, although Neuro# improves over default SharpSAT's 53,349. [Formal p. 5, Tables 1–2]

For grid-world(10,12), the capped table reports 93,093→1,320, approximately 71×. A separate uncapped run reports 809,408→1,320, approximately 613×. Neither ratio is a wall-clock speedup, and censored 100,000-step cells do not establish finite exact ratios. Figures 4 and 9 show runtime gains on selected cell/grid tests despite neural/Python overhead. They do not establish uniform runtime improvements on every domain. [Formal pp. 5–6; v2 p. 12]

The time-only policy accounts for most of the grid-world gain. Adding VSADS scores hurts upward performance on the two appendix ablation datasets. Larger cell heatmaps and cache/conflict radar plots suggest useful learned decomposition and conflict avoidance, but are empirical interpretations. Appendix A's branch-width complexity discussion describes classical counting algorithms under suitable branching orders; it is not a learned-policy approximation or runtime theorem. The appendix also compares centrality-enhanced SharpSAT and GANAK on the two runtime datasets. [Formal p. 7; v2 pp. 10–15]

## Limitations

The method needs an appropriate instance generator, family-specific training and sufficiently large branch reductions to offset inference overhead. Original-domain time annotations are an additional source of information. The experimental scope does not demonstrate one common checkpoint across arbitrary CNF families, real industrial deployment or a guaranteed superlinear gain.

Some reporting details require care: Table 1 prints island means 86 and 30 with a parenthetical 1.8×, although their ratio is approximately 2.87. This arithmetic inconsistency is recorded without changing the printed cells. Training-set size differs between the main setup and Appendix C. Mean capped branch counts, uncapped runs and selected wall-clock plots remain separately labeled. GANAK's cited title identifies it as a probabilistic exact model counter; the discussion's informal error-tolerance phrasing is not treated as a relative-error approximation guarantee.

## Reproducibility

All nine formal pages and all fifteen pages of identified arXiv v2 were read, including references and scientific Appendices A–E. Algorithms, GNN equations, both tables, all appendix plots and the original graph were visually checked. Primary arXiv history gives v1=2020-07-07 and v2=2022-09-08; v2 is a separately identified scientific reading copy within the cutoff. Publisher/Crossref publication date is 2021-05-18, distinct from the conference event and Crossref record creation date. The formal seven-author byline is used; Vaezipoor and Lederman contributed equally. An older author-hosted v1 has a different byline and is not merged into the formal author list.

The official repository's pinned commit `e2f1cb209bab4b841dad2207385f3175c33760fb` is dated 2022-03-23. A complete 3,983-file git tree was inventoried without downloading every large artifact: no separate PDF/TeX/video/archive scientific attachment occurs in that tree. Its sole notebook was read completely and is a model-evaluation utility, rather than an additional scientific appendix. README, the 59-line evaluation script, grid annotation decoder and exact-solver callback/reward boundary were checked. The README supplies a Docker image and rebuilding instructions. The current script repeats experiment selector 15, so its later grid(12,14) command overwrites the earlier grid(10,14) choice; this is a release invocation issue, not evidence against the paper's measured results. The Docker container and saved weights were not executed or loaded, and no historical benchmark was independently reproduced. Publisher HTML/OpenReview API access failures are logged; the named extended scientific appendix is fully covered by the read v2 copy.
