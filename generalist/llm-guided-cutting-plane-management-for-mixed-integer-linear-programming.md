---
id: llm-guided-cutting-plane-management-for-mixed-integer-linear-programming
short_title: LLM-guided Cut Management
title: LLM-guided Cutting-plane Management for Mixed-integer Linear Programming
authors:
- Zetao Zheng
- Zhe Wang
- Jie Shao
year: 2026
date: '2026'
publication:
  date: '2026'
  source_url: https://ijcai.org/proceedings/2026/736
venue: IJCAI
paper_url: https://ijcai.org/proceedings/2026/736
institutions:
- University of Electronic Science and Technology of China
- Sichuan Artificial Intelligence Research Institute
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Set Covering
- Maximum Independent Set
- Multiple Knapsack
- Mixed-Integer Knapsack
- CORLAT
summary: Pretrained LLMs configure SCIP separators and guide online cut selection across five MILP families without
  task-specific neural training; reported gains depend on dataset/backend, configuration time is excluded, and the
  released implementation differs materially from the proposed heuristic-library workflow.
code_url: https://github.com/BeeeeenWANG/LLM-guided-cutting-plane-management
figure:
  path: paper-assets/llm-guided-cutting-plane-management-for-mixed-integer-linear-programming/framework.png
  alt: LLM-guided separator configuration and online cutting-plane management within SCIP branch and cut.
  caption: Original Figure 2, cropped from the formal IJCAI paper. The LLM configures and selects SCIP-generated
    cuts.
  source_url: https://ijcai.org/proceedings/2026/0736.pdf
---

# LLM-guided Cutting-plane Management for Mixed-integer Linear Programming

> **TL;DR:** A pretrained LLM configures classical SCIP separators and guides online cut selection without task-specific fine-tuning. The same backends are tested across five native MILP families, but the headline table selects different backends by task, several baselines win particular comparisons, and the public implementation does not fully implement the described heuristic-library workflow.

## Motivation

Cutting planes tighten LP relaxations inside branch and cut, but separator choice and cut-selection rules can behave differently across MILP families and search stages. The paper asks whether pretrained language models can use problem descriptions and solver feedback to reduce manual configuration and the need for task-specific training data. Valid inequalities still come from SCIP's classical separators; the LLM is not a source of newly proved valid cuts. [formal pp. 1–4]

## Contributions

- Proposes instance-conditioned separator configuration with chain-of-thought prompting and six separator controls.
- Describes stage-aware selection of executable cut heuristics from a curated semantic repository using the current branch-and-bound state.
- Evaluates separator configuration, online selection, their combination and seven LLM backends on five MILP families. These are empirical comparisons, without an approximation, convergence or universal solver-performance guarantee. [formal pp. 3–7; author Appendix C]

## Methodology

The offline configuration stage represents a problem by its type and structural profile. Equations 3–4 ask an LLM to choose active separators and their frequency, root/non-root round limits, root/non-root cut limits and maximum depth. Different separator choices change the candidate pool offered to the cut selector. [formal pp. 3–4, Fig. 2]

Equation 5 presents history-conditioned generation of executable heuristic code. The practical workflow in Equation 6 instead uses a repository of heuristic implementations paired with natural-language descriptions: the LLM matches the current search state to one of these strategies and switches during solving. This runtime library selection is distinct from repeatedly evolving a fresh heuristic online. SCIP generates cuts, maintains the LP relaxation and executes branch and cut; the neural component controls configuration and cut-selection decisions. [formal pp. 4–5]

**Classification: Generalist / constructive.** Appendix C evaluates each listed pretrained backend across set covering, independent set, multiple knapsack, mixed-integer knapsack and CORLAT, with no task-specific neural fine-tuning. This is shared-model evidence across native MILP families. It does not mean the headline Table 1 uses a single backend for every task: that table chooses between Qwen3-30B and Claude 3.5 by problem. The neural role is construction of a cut-enhanced search process rather than learned editing of an incumbent feasible solution. [formal pp. 5–6; author p. 12, Table 4]

## Experiments

Experiments use SCIP 8.0 with a 300-second limit and compare default SCIP, normalized violation, efficacy, HEM and the proposed configuration/selection components. Table 1 lists the five native families; set covering also has a separate small/large test, reaching a stated 200,000 variables and 200,000 constraints. Reported metrics include primal-dual gap, primal bound and primal-dual integral (PDI), with smaller PDI preferable. The main quality tables do not clearly specify the complete instance/seed count, statistical test or uncertainty protocol. The ten-trial runtime comparison and Appendix A's five repetitions are separate experiments, not evidence that every table uses those repetitions. [formal pp. 5–7; author p. 11]

Results support task-dependent gains rather than consistent dominance. On set covering, combined configuration/selection has PDI 58.17 versus default 75.49, while HEM is better at 44.92. On independent set, the combined method is 58.19 versus default 218.24, but HEM achieves 37.45 and configuration alone 40.70. On multiple knapsack, configuration alone has 4.12 versus the combined method's 14.46. On CORLAT, efficacy's 1066.24 is lower than the combined method's 1404.27. [formal p. 5, Table 1]

The separate small set-covering comparison is a negative case: default SCIP has primal integral 6.78 and primal bound 211.43, versus 6.95 and 220.14 for the proposed method. On the large case, the proposed values improve to 1.03e7 and 15475.31, versus default 1.25e7 and 17890.35. The small-case table does not support the accompanying assertion of an improved final bound. [formal p. 6, Table 2]

Runtime includes online LLM calls, which account for approximately half of the reported solving time on most tasks, but excludes one-time separator-configuration inference. The paper acknowledges no clear runtime advantage and reports HEM as fastest in this comparison, excluding its training cost. The component ablation reduces the number of candidate cuts considered; illustrative two-dimensional cut diagrams explain the intended mechanism without establishing a general causal or optimality guarantee. [formal pp. 6–7, Figs. 3–5]

## Limitations

Several printed results require aligned per-instance records before strong aggregate claims are warranted. Table 1 reports zero gaps with different average primal bounds across methods; the matching of instances, objective conventions and retained successful runs is not explained sufficiently to reconcile these values. For native maximization families, the universal downward arrow on primal bound also needs an explicit objective-conversion convention. The main caption describes `nan` as failure to obtain an optimum, whereas Appendix C describes absence of a feasible solution; these conditions differ. Appendix C prints mixed-integer-knapsack values around −4.52e4 rather than the main table's −4516.60, and its claim that only GPT produces a finite CORLAT value conflicts with Grok's printed 268.18. These are reporting limitations, not a rerun of the benchmarks. [formal pp. 5–6; author p. 12]

The proposed workflow and current code also differ. The pinned implementation asks for up to three separator names and sets their frequencies; it does not jointly tune all six stated controls. Online selection asks the LLM for cut indices directly and defaults to one allowed callback call, rather than implementing the documented semantic heuristic library. Its function named default SCIP explicitly changes separator frequencies and several cutting limits. A missing `utils` module supplies cut features, so the inspected archive is not a self-contained runnable reproduction. These observations concern the available implementation, without establishing what code generated historical results.

Two narrow boundary checks are retained as curator analysis. The printed time-dependent example calculates a selection count of five or three but returns an expression that always caps at ten and never uses that variable. In the current callback, the exhausted-call branch can return twelve selected cuts when the callback's maximum is three. An isolated AST extraction reproduces that local return value without importing SCIP or invoking any LLM. Neither check establishes failure of the complete empirical method. [author p. 12, Fig. 7; pinned tools.py, lines 47–56]

## Reproducibility

The formal publication is IJCAI 2026's AI4Tech special track, pp. 6617–6625, DOI 10.24963/ijcai.2026/736. The publisher BibTeX gives August 2026, while its Crossref deposit gives September 2026. With no explicit first-online field resolving this conflict, the repository records year precision, 2026, and preserves both primary-source values. Crossref's creation timestamp is not treated as publication day. The byline names Zetao Zheng, Zhe Wang and Jie Shao, affiliated with UESTC and Sichuan Artificial Intelligence Research Institute.

All nine formal pages and all twelve pages of the author repository's extended version were read, including references and Appendices A–C. The versions have different reference flow and are not asserted byte-identical. The publisher attachment links and complete author archive were checked: five files comprise README, main.py, tools.py, the extended PDF and a paper-preview PNG; no additional scientific PDF, video or nested archive was present. The preview and key figures, prompts, tables and code examples were visually inspected. The original framework figure is reproduced above; source hashes and actual page coverage are retained in the review.

The [official implementation](https://github.com/BeeeeenWANG/LLM-guided-cutting-plane-management) was inspected at commit 5ca8e9d844927610e93c2d1bcc076ed2313d9f95, dated 2026-05-27. It requires SCIP/PySCIPOpt integration, an external feature helper, local dataset paths and configured LLM APIs/model names. The authors link a separate dataset folder, which is not bundled in this archive. No solver benchmark, model training or paid API request was performed. The local checks validate only the explicitly identified printed/current-code boundary cases. The material includes no immutable remote-model version or complete per-instance raw results sufficient to independently reproduce the quality tables.
