---
id: constraint-matters
short_title: Constraint Matters
title: 'Constraint Matters: Multi-Modal Representation for Reducing Mixed-Integer Linear programming'
authors:
- Jiajun Li
- Yixuan Li
- Ran Hou
- Yu Ding
- Shisi Guan
- Jiahui Duan
- Xiongwei Han
- Tao Zhong
- Vincent Chau
- Weiwei Wu
- Zhiyuan Liu
- Wanyuan Wang
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/25dd41a34a3fee27ca94ebd34186d22c-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/25dd41a34a3fee27ca94ebd34186d22c-Abstract-Conference.html
institutions:
- Southeast University
- Huawei Noah's Ark Lab
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Task-specific text/type and instance graphs predict variable and tight-constraint restrictions for MILP
  solving; empirical PDI/BKS gains have explicit noise, prior-formulation, theory and release-configuration limits.
code_url: https://github.com/Liwow/Constraint_Matters
---

# Constraint Matters: Multi-Modal Representation for Reducing Mixed-Integer Linear programming

> **TL;DR:** A task-specific two-level graph network combines instance coefficients with text-embedded variable/constraint types, predicting both binary assignments and selected tight inequalities. Classical solvers search a restricted model. Strong reported budgeted averages coexist with prediction-induced infeasibility, prior-formulation requirements and narrow or flawed theoretical statements; the17.47% headline concerns PDI, not a measured wall-clock reduction.

## Motivation

Variable-fixing methods overlook another way to restrict MILPs: converting selected inequalities into equalities at a good solution. Oracle experiments show that the choice matters enormously: CA_easy original378.226seconds becomes1.851 for the best tested fixing but465.74 for the worst. These are selected combinations using known tight constraints, not a deployed network's universal speedup. The paper asks which categories to label as critical and how instance structure plus abstract formulation semantics can predict them (Sections1–4.2/AppendixH.1).

## Contributions

- Joint prediction of variable assignments and critical tight constraints for classical model reduction.
- Instance-level coefficient graphs coupled to an abstract graph of variable and constraint categories, initialized by pretrained text embeddings.
- An information-inspired priority heuristic for labeling tight constraints, using approximate local feasible-set shrinkage and class-balance rules.
- Tests on CA/MIS/MVC/workload appointment, larger CA/MVC and one real-world middle-mile network family, with solver, representation, presolve and error-sensitivity analyses.

## Methodology

**Representation.** The supported integer decisions are binary; general bounded integers would need binary encoding, which the paper acknowledges can enlarge the model and weaken the relaxation. A weighted instance bipartite graph contains variables, constraints and nonzero coefficients. An abstract graph connects variable types to constraint types according to the known mathematical formulation. T5-base embeds JSON descriptions; some descriptions are LLM-generated from supplied problem formulations. LLMs are not online combinatorial planners here. Separate GNNs perform within-level message passing. Category-query cross-attention pools matching instance-node features, then an MLP updates the category embedding. A learned gate blends mean instance-category and abstract features, multiplying the resulting features into each instance node (Sections3/4.1/AppendicesA/C.3–C.4/F).

**Labels and priority.** A tight inequality has equality at a particular labeled solution. Training collects up to50 Gurobi solutions during3600seconds, with their tight sets; these are time-limited feasible labels, not universally certified optimal solutions. The Tight Constraints Priority module estimates rho=|S_after|/|S_before| in a locally decoupled prototype. Smaller rho is ranked as more informative; categories are selected with minimum5 tight constraints and a desired tight proportion[.1,.8]. Ten prototype types are listed, but several have no uniform estimate and are generally excluded. Exact single-row counts give n/(n+1) for binary set packing and n/(2^n−1) for set covering. These single-row estimates do not exactly count a jointly coupled category's feasible space (Section4.2/AppendicesB/D).

**Prediction and restricted solving.** The network produces binary variable marginals and tight-constraint scores. Top kc selected inequalities receive indicators zi: zi=0 enforces equality and a budget sum zi<=Delta_c permits some not to be fixed. The formal <= formulation uses a sufficiently large Big-M; the released Gurobi implementation uses native equality indicators. A separate Predict-and-Search Hamming trust region around confident binary predictions restricts variables. Gurobi/SCIP then construct complete feasible solutions to this restricted model. This is **specialist constructive**: separate TaskName-trained/checkpointed networks and manually selected type mappings/parameters per native family, with no demonstrated common solver checkpoint across families. Modifying a MILP formulation is not itself neural improvement of a complete primal incumbent (Eq12/AppendixC.5/G.2 and code).

The paper combines solution and constraint focal losses with lambda=.4, alpha=.75/gamma2 for MIS/MVC. The printed negative-class term in Eq13 has the wrong positive sign; the supplied focal-loss function correctly places a minus before both log terms. Release defaults also set focal=False, so the formula, intended configuration and executable default must be distinguished.

## Experiments

**Protocol/reference.** Each native family uses240 training,60 validation and100 test instances. Gurobi9.5.2/SCIP8.0.1 run single-thread on a Ryzen9900X, with Gurobi primal focus and aggressive SCIP. Tests use800second reduced-model solver cutoffs. Labels and initial BKS come from3600second single-thread Gurobi; AppendixH.2 explicitly replaces MIS/MVC BKS by this method's better solutions and floors plotted gaps at1e-6. Absolute BKS difference and primal-dual integral(PDI) are different metrics. A near-zero gap to an empirical BKS is not proof of optimality, and reduced-model dual bounds are not automatically valid lower bounds for the unrestricted original MILP (Sections5.1–5.2/AppendicesC/G/H.2).

**Main means.** With Gurobi, CA gapabs decreases197.36 for ConPaS to104.72, MIS.02 to.00, MVC.10 to.00; WA improves the best baseline PS.07 to.06. PDI is73.02/.47/6.26/4.40 across CA/MIS/MVC/WA. With SCIP, gaps3401.63/.34/1.48/.83 and PDI109.41/4.65/18.34/21.52 improve the reported PS/ConPaS cells. The stated51.06% gapabs and17.47% PDI improvements average comparisons against the best learned baseline. Table3's improvement rows instead compare to vanilla Gurobi/SCIP; those denominators must not be interchanged. The abstract/README's17.47% computation-time wording should be read as the body's PDI result, not a demonstrated17.47% wall-clock reduction (Table3/Section5.2).

**Scale and real-world transfer.** Larger CA uses3000items/6000bids and larger MVC6000nodes, with unchanged native-task model families. SCIP gaps5955.86/.55 and PDI131.44/24.54 improve ConPaS6287.22/2.20 and156.95/35.39. MMCN Very-hard-BC2 separately uses240/60/100 train/validation/test instances, not zero-shot transfer of a model trained on another native task. Its SCIP gap3547.08 and PDI246.89 improve ConPaS6064.85/330.05. Standard heterogeneous MIPLIB is not tested because the required mathematical-type descriptions may be absent. Item placement is omitted because its many equalities make this particular inequality-fixing method unsuitable (Tables4–6/AppendixC).

**Ablations and failures.** Multimodal features help early CA convergence, including a reported12% gap reduction at400seconds, but yield negligible gain at the final cutoff. Constraint accuracy rises at10/20% fixing(93.13/84.84 versus90.37/80.62%), while full100% fixing has64.30 versus GNN64.31%, a small negative case. T5 versus OpenAI embeddings changes CA gap104.72 to103.33 and PDI73.02 to72.96; this modest difference does not establish general insensitivity to every text model (Tables13–14).

Bad fixes can be fast and wrong: three CA examples lose objective quality at2–5% incorrectly fixed constraints; one is infeasible at10%, all three at20/30%. More selected constraints do not monotonically improve quality: CA Gurobi(kc,Delta_c)=(10,0) gives492.78 gap versus104.72 for(80,15), and(120,25) worsens to217.94. SCIP's best gap in that sweep is(20,0), whereas(80,15) has better PDI. These are separate quality/trajectory tradeoffs (Tables10–11).

Presolve is useful in some combinations but not uniformly: MVC vanilla PDI worsens68.02 to72.31 and PS7.39 to8.28 when enabled. Table12 also shows CA main-table values match presolve-enabled rows, whereas main MVC values match disabled rows; the blanket same-configuration interpretation needs qualification. Training is costlier than PS: per-epoch CA23.1 versus9.7seconds, MIS148.4 versus66.5, MVC122.6 versus60.2 and WA358.9 versus242.4. Table16's40-instance decoupling diagnostics range widely: WA mixed-binary only8.2% satisfy the WD threshold and7.4% the variable-marginal threshold, whereas MMCN set packing has100% marginal-threshold success but18.5% WD success. These are approximate empirical thresholds, not proof of exact independence (AppendicesH.4–H.7).

## Limitations

### Discussed in the Paper

Prior knowledge of the actual MILP formulation/types is required. The heuristic type-level priority can miss instance-level critical constraints, and the authors seek a more principled method. Prediction errors can create infeasible or poor reduced models. The local-decoupling assumption is explicitly an analytic motivation, rather than a necessary condition for implementing the heuristic. Uniform integer encoding and equality-dominated native problems are practical limitations.

### Curator Notes

Fixing inequalities truly tight at one retained optimum preserves that optimum, provided all other restrictions also admit it. Under noisy predictions, indicator and variable budgets do **not** ensure a nonempty region or retention of the optimum. For a binary x with original x<=0 and x<=1, falsely selecting x<=1 with Delta_c=0 forces x=1 and makes the reduced model infeasible. Allowing a finite number of exceptions only tolerates that many such mistakes. This logical limitation does not invalidate the reported averages; Table11 directly documents failure sensitivity. Moreover, slack at one optimum does not mean an inequality is globally redundant: binary x1+x2<=1.5 is slack at a maximum-cardinality optimum of1 but deleting it admits cardinality2 (Sections3/4.2).

The entropy discussion requires finite local domains and the deliberately uniform/decoupled model. The legitimate entropy **decrease** is H(before)−H(after)=−log rho; Eq16 prints after-minus-before but Eqs17–18 evaluate the opposite. A smaller local feasible-set cardinality does not imply a solver-runtime theorem, as the motivation experiment's slower oracle fixings already show. The b≈n/2 binomial estimate is reasonable, but AppendixB.2.3 incorrectly promotes a lower bound at b≈sqrt(n) into rho=Theta(1/sqrt(n)). In that regime binomial(n,b)/sum_{k<=b}binomial(n,k) tends1, not0 (for example,.89155 at n100/b10 and.98990 at n10000/b100). Gaussian narrow-band estimates for weighted knapsack also need non-dominant-weight/local-lattice assumptions and are not uniform exact-equality guarantees. These are scoped mathematical limits, not an assertion that the learned solver's experiments are invalid.

Reproduction must separate the printed method from release defaults: publisher/source training uses200epochs rather than formal150, task-specific checkpoint folders, focal=False and detached normalization of each component loss. Both code releases require a separately installed local T5 model plus dataset/solution/model artifacts. Task metadata uses variable/constraint naming conventions to match instance nodes to abstract categories. The pseudocode's early returns and type-level approximation should not be treated as an exact optimal constraint-subset algorithm. No solver/training benchmark was rerun here.

## Reproducibility

- **Publication:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/25dd41a34a3fee27ca94ebd34186d22c-Abstract-Conference.html), official HTML publication date April20,2026. Twelve authors and two institutional affiliations checked against formal page1; first author's capitalization normalized from publisher metadata to Jiajun Li.
- **Coverage:** all27 formal pages, full bibliography and AppendicesA–I read; key formulas, proof and every main/additional result block inspected as rendered pages. Official supplemental ZIP34230bytes/13members is code only, no PDF/TeX/notebook/scientific image. Full current author ZIP3995439bytes/32members contains no extra PDF/TeX/notebook; README and both scientific framework/result PNGs fully inspected. Official ICLR event10006774 poster1334932bytes fully read; it repeats the main method/results and links OpenReview vqNg2Vl8o1.
- **Code:** [Liwow/Constraint_Matters](https://github.com/Liwow/Constraint_Matters) and [formal supplemental code](https://proceedings.iclr.cc/paper_files/paper/2026/file/25dd41a34a3fee27ca94ebd34186d22c-Supplemental-Conference.zip). Inspected task-specific train/load paths, T5/category mapping, true signed focal implementation, indicator constraints, trust-region settings and classical solver calls. Current README includes environment/generation instructions; it repeats the abstract's PDI/time conflation.
- **Relations:** twelve explicit body/bibliography matches against the catalogue, including PS/ConPaS, GNN representation, Apollo, L2P, SymILO and NeuroSAT's identified2018arXiv precursor. Duplicate Ding2020a/b records are one paper identity, and unlisted or similarly named papers do not create substitute edges.
