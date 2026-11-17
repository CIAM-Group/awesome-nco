---
id: machine-learning-for-cutting-planes-in-integer-programming-a-survey
short_title: Learning to Cut Survey
title: 'Machine Learning for Cutting Planes in Integer Programming: A Survey'
authors:
- Arnaud Deza
- Elias B. Khalil
year: 2023
date: '2023-02-17'
publication:
  date: 2023-08
  source_url: https://www.ijcai.org/proceedings/2023/739
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2023/739
institutions:
- University of Toronto
- SCALE AI Research in Data-Driven Algorithms for Modern Supply Chains
scope: study
paper_type: survey
problem_families:
- Integer Programming
problems:
- Learning for Cutting-Plane Management
summary: Survey of learned cut scoring, cut-set size/order, scoring parameters and local-cut configuration, with
  literature-based empirical and sample-complexity discussion; it introduces no new solver or common rerun benchmark.
arxiv_url: https://arxiv.org/abs/2302.09166
figure:
  path: paper-assets/machine-learning-for-cutting-planes-in-integer-programming-a-survey/framework.png
  alt: A two-dimensional integer program illustrates valid cuts, the integer hull, relaxed and integer optima, and
    cut-quality metrics.
  caption: 'Original Figure 1: a geometric cutting-plane example.'
  source_url: https://www.ijcai.org/proceedings/2023/0739.pdf#page=2
---

# Machine Learning for Cutting Planes in Integer Programming: A Survey

> **TL;DR:** This IJCAI Survey Track article organizes learning for cut management by decision type, learning paradigm and optimization setting. It explains why individually strong cuts need not form the best subset, and why better bounds need not mean faster solves. Its numerical comparisons summarize earlier papers; it supplies neither a new neural solver nor a uniformly rerun benchmark.

## Motivation

Valid cuts can tighten an MILP relaxation, but adding too many increases LP cost. Practical solvers must choose cut families, separation rounds, subsets, scoring weights, locations and removal rules. Fixed heuristic scores may suit some instances better than others. The survey reviews how machine learning can inform these decisions while preserving the optimization solver's role. [Formal pp. 1–3]

## Contributions

- Introduces MILP/LP formulations, separation rounds and four inexpensive cut-quality metrics.
- Categorizes learning tasks: individual-cut scoring, cut-bag scoring, count/order selection, metric-weight configuration and local-cut activation.
- Summarizes reinforcement, imitation and supervised methods, including neural and non-neural models.
- Discusses sample complexity, limits of fixed scoring, fair baselines and public-data gaps. The catalogue classifies it as **study / survey**, not a generalist or specialist solver. [Formal pp. 2–7, Table 1]

## Methodology

The review explains efficacy, directed cutoff distance, integer support and objective parallelism, followed by integrality-gap closure after separation. These are different criteria: geometric separation, bound improvement and total runtime are not interchangeable. The displayed SCIP scoring weights refer specifically to version 8.0 and the historical setting of the survey, rather than the current solver release. Gap-closure fractions assume a nonzero original gap. [Formal pp. 2–3, Equations 4–9]

Tang et al.'s approach selects one Gomory cut per round using attention/LSTM scoring trained with evolutionary strategies. Paulus et al.'s NeuralCut imitates a lookahead expert that solves an LP for each candidate cut, amortizing that labeling cost with a tripartite GNN. The survey highlights limited small-instance baselines for the former and independent-cut scoring for both; it does not claim that imitation makes labeling free. [Formal pp. 4–5]

HEM is reviewed as learning both selection count and order: a higher-level model outputs a fraction and a pointer model selects an ordered subset. Huang et al. train on aggregated cut bags, yet score singleton bags at inference, which the survey argues does not capture the full combinatorial interaction. Other reviewed methods use an MLP for nonconvex quadratic cuts or an SVM for Benders-cut classification. Their optimization problems and guarantees differ from MILP Gomory selection. [Formal pp. 5–6]

Turner et al.'s adaptive selection predicts four metric weights from a variable-constraint graph. The survey characterizes its horizon-one training as instance-specific configuration, emphasizing that the encoding omits candidate-cut information. Horizon one is a meaningful restriction on the claimed sequential policy; it does not mathematically prevent formulating a contextual bandit or one-step MDP. Berthold et al.'s separate random forest chooses whether to use local cuts through regression on runtime differences. Thus the survey's scope is broader than neural networks alone. [Formal pp. 6–7]

## Experiments

There is **no new common experimental campaign** with one data split, machine or compute budget. Table 1 lists eight reviewed method families across Gurobi, SCIP, CPLEX, Xpress, a proprietary solver and a Benders framework. Its small/medium/large labels use variable-count × constraint-count ranges [0,1000], [1000,5000] and [5000,∞], rather than equal difficulty or matched compute. The endpoint ranges as printed overlap. [Formal p. 5]

Reported literature results include HEM's 16.4% runtime and 33.48% primal-dual-integral improvements in its synthetic setting; these are attributed comparisons from that paper, not a universal survey-derived speedup. NeuralCut improves three of four synthetic families, with packing largely tied. QP score-evaluation speedups of roughly 2/30/180 times refer to different comparison routines, not whole MILP solves. SVM Benders reductions of 6–47.5% concern selected stochastic facility-location tests. [Formal pp. 5–6]

For adaptive weights, the survey reports root-gap metrics: instance-specific grid search median improvement 9.6%, separately fitted GNN 4.18%, a distribution-trained model median 1.75%, and random initialization 0.5%. These are not end-to-end solving-time reductions. For local-cut configuration it reports an 11.36% perfect-decision-oracle opportunity, versus learned random-forest improvements of 8.5% training and 3.3% testing. Oracle opportunity and train/test measurements are kept separate. [Formal pp. 6–7, Table 2]

The theory section summarizes distributional sample-complexity results for estimating expected branch-and-cut tree size and a special constructed family showing nontermination for a finite set of fixed cut-score weights. These are conditional results from cited papers; the survey does not provide their complete proofs, prove all fixed heuristics fail, or guarantee polynomial-time MILP solving. [Formal p. 7]

## Limitations

The article is a 2023 snapshot, not an exhaustive survey through the repository cutoff in November 2026. It provides a narrative taxonomy rather than a documented systematic search/counting protocol. Performance numbers span different solver versions, candidate generators, instance classes, learning budgets and metrics, so they cannot be pooled into a ranking or average speedup.

Some reviewed methods are non-neural or address non-MILP settings, and some references were preprints at survey time. Their inclusion is not proof of formal-publication eligibility for this catalogue. Claims of novelty or “only” methods are temporal claims in the review, not present-day guarantees. The authors themselves identify weak baselines, missing training/data costs, proprietary large-scale data and solver/hardware sensitivity as unresolved issues. This note relies on the survey for its synthesis while keeping each solver's independently reviewed entry authoritative for detailed claims.

## Reproducibility

All nine formal proceedings pages, both complete reference pages, the geometric cut example, all eleven equations and both tables were read. Key formula/table pages were rendered and visually inspected; the image is an original Figure 1 crop. The publisher's full link inventory contains only the paper PDF, and the author publication entry identifies the Survey Track article without a paper-specific code or scientific-appendix link. No independent scientific supplement is explicitly required. A personal GitHub profile is not represented as a survey implementation.

The arXiv primary history establishes v1 on 2023-02-17 and v2 on 2023-10-31. Formal publisher BibTeX and Crossref agree on August 2023, retained at month precision. The formal byline is Arnaud Deza and Elias B. Khalil, affiliated with University of Toronto, with Khalil additionally listing SCALE AI Research in Data-Driven Algorithms for Modern Supply Chains. The author site's January-1 URL slug is not used as a publication date.

The nine-page arXiv v2 was retrieved and its differences inventoried against the formal copy; changes include reflow/headings, shortened reference metadata and removal of the “medium-sized” qualifier in one HEM sentence. It is an alternate version check, not separately claimed full-page reading coverage, and all scientific claims/evidence here point to the completely read formal PDF. No source experiments, underlying solver implementations or historical training runs were rerun. Internal relations include only eight confirmed active-catalogue identities with explicit body citations and bibliography entries; cited works absent from the active catalogue remain external.
