---
id: self-guiding-exploration
short_title: SGE
title: Self-Guiding Exploration for Combinatorial Problems
authors:
- Zangir Iklassov
- Yali Du
- Farkhad Akimov
- Martin Takáč
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/eb9120be0dcaac0aec66d2e75deb69dd-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/eb9120be0dcaac0aec66d2e75deb69dd-Abstract-Conference.html
institutions:
- Mohamed bin Zayed University of Artificial Intelligence
- King's College London
scope: generalist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Routing
- Scheduling
- Packing
- Assignment
problems:
- Assignment
- Knapsack
- Bin Packing
- Traveling Salesman Problem
- Vehicle Routing Problems
- Job Scheduling
summary: A frozen LLM explores heuristic trajectories, decomposes and executes subtasks, critiques candidate solutions
  and integrates an answer across six CO task types; tool access, repeated calls and unresolved feasibility/reproduction
  details qualify the reported gains.
code_url: https://github.com/Zangir/LLM-for-CP
figure:
  path: paper-assets/self-guiding-exploration/framework.png
  alt: SGE prompts a generative model through exploration, decomposition, subtask resolution, feedback and refinement,
    then final integration.
  caption: 'Figure 1: the five-phase Self-Guiding Exploration prompting workflow.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=4
---
# Self-Guiding Exploration for Combinatorial Problems

> **TL;DR:** Use the same frozen language model with general meta-prompts to propose heuristic approaches, break them into subtasks, execute them, critique/refine candidates and integrate a final answer. This is a **prompt-and-tool solver**, without a newly trained CO network. The main reported improvement is against other prompting strategies; it does not establish superiority to strong classical solvers or guarantee feasible, monotonically improving solutions.

## Motivation

A single LLM response can miss useful algorithms or fail to execute a complex heuristic correctly. SGE combines exploration, decomposition and self-feedback so a model can choose different approaches for different optimization tasks. Its generality concerns a common pretrained model and prompting workflow, rather than training a new shared embedding architecture across tasks. [Sections1-3.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=1)

## Contributions

- A five-phase prompting workflow: **explore methods, decompose steps, resolve subtasks, obtain feedback/refine, and integrate**.
- Recursive decomposition when the model judges a subtask difficult.
- Evaluation across assignment, knapsack, bin packing, TSP, vehicle routing and job-shop scheduling, with additional arithmetic/commonsense/symbolic tasks.
- Comparisons of prompting quality, model choice, average model calls, selected API costs and some larger scheduling/routing instances. These are empirical results, not approximation or optimality guarantees. [Algorithm1/Sections4-5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=4)

## Methodology

### Prompted exploration and execution

The query describes the objective, data and constraints in text. An exploration prompt asks the LLM for possible methods; each returned method becomes a trajectory. Another prompt decomposes it into actionable steps. For each step, the model judges whether direct execution is easy; difficult steps may recursively invoke SGE. The resulting thought is followed by a separate feedback call and a refinement call. A final integration prompt combines the last thought from each trajectory into an answer. N trajectories and K subtasks are generated rather than fixed in the displayed algorithm. [Sections4.1/Algorithm1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=4)

The pseudocode lists a maximum recursion depth D, but does not show a depth counter or stopping condition using D. The recursion formula in the prose also repeats the feedback formula. Consequently, the exact recursion budget should not be inferred from the notation. General meta-prompts do not remove the need to supply task-specific problem definitions, numerical data and output formatting.

For GPT-4 and Gemini-1.5, the paper describes **Python/Code Interpreter** use for computation and programming subtasks. The example constructs a nearest-neighbor tour and asks for 2-opt refinement. Thus numerical performance includes external code execution where enabled, rather than unaided language-only inference. The same underlying model is repeatedly called without CO-specific weight updates. [Figure2/Section5.2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=7)

### Construction, refinement and generality

SGE builds candidate solutions and explicitly revises existing candidate tours in its refinement stage. Classification is therefore **generalist / constructive-improvement**. This is supported by the actual nearest-neighbor-plus-2-opt example, not merely by the word “refinement” applied to reasoning text. Generalist refers to the reuse of a frozen LLM across distinct tasks; tool availability, input descriptions and selected heuristics vary by setting. The paper does not demonstrate one new universal CO checkpoint trained by the authors.

The method does not specify a universal external feasibility checker or cost-based incumbent acceptance rule for the final integration. A prompted instruction to retain only shorter tours is not a verified guarantee that the returned tour follows that rule. [Figures1-2/Appendix worked example.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=26)

### Task definitions and formulation caveats

Assignment minimizes a one-to-one matching cost and is polynomially solvable; not every included combinatorial task is NP-hard. Knapsack **maximizes** value, while bin packing minimizes occupied bins and job-shop scheduling minimizes makespan. The VRP description includes customer demands/capacity and permits multiple depot-customer trips when a demand exceeds capacity, so it is not automatically identical to standard unsplit CVRP.

Several displayed mathematical formulations are incomplete: TSP gives assignment-style degree constraints without subtour elimination; VRP does not fully encode capacity/depot/vehicle coupling. These equations should not be reused as complete exact formulations. [AppendixA.2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=15)

## Experiments

### Models, data and comparison protocol

The models are GPT-4, Gemini-1.5, GPT-3.5, Llama-2-70B and Llama-2-7B. No CO-specific training or task fine-tuning is described. The main setup says 100 random instances per size and lists sizes 5/10/15/20/30 with uniform numerical data over 0-100. However, the size analysis and full raw tables instead use **5/8/12/15/20/25/30**. This discrepancy prevents treating the size/sample specification as a single fully reconciled dataset manifest. [Section5.1/Tables9/12-16.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=18)

Baselines are direct Input-Output (IO), Chain-of-Thought, Self-Refine and Decomposition prompting. IO/CoT use repeated candidates and majority voting, and CoT/Refine model-call counts are controlled to match SGE in the efficiency comparison. The paper does not report complete token counts, latency distributions, per-model tool-call budgets or exact hosted-model version identifiers. GPT-4/Gemini tool access also confounds model comparisons with tool availability. The main text says GPT-3.5 lacks Code Interpreter, while the reasoning-table caption says GPT-3.5 with it; that setting remains ambiguous. [Sections5.1-5.2/Table11.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=9)

### Interpreting the headline

The main metric is improvement relative to the IO result, not a gap to a certified optimum. For minimization the paper gives 100(gIO-gmethod)/gIO. Knapsack requires the corresponding maximization direction. The GPT-4 task-specific SGE scores in Table1 are **41.33/70.39/74.72/72.10/71.92/75.33%** for assignment/knapsack/bin packing/TSP/VRP/job scheduling.

Table4 averages to **67.63% for SGE versus39.79% for Decomposition**: their difference is **27.84 percentage points on the IO-relative metric**. It is not a demonstrated27.84% reduction in objective versus Decomposition, nor a27.84% smaller optimality gap. SGE averages **58.32 model calls versus31.04**, an87.89% increase. CoT/Refine also receive58.32 calls in that comparison. AppendixTable7 reports average VRP API costs of$0.0961/$0.1676/$0.1964/$0.3515 at5/8/12/20 nodes; these are the paper's historical charges, not current pricing. [Tables1/4/7.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=17)

For small5/8/12-node cases, Table2 reports OR-Tools-referenced gaps for Llama-2-70B. At12 nodes, SGE gives11.26% assignment,16.82% knapsack,22.38% bin packing,16.12% TSP,24.00% VRP and22.86% scheduling. The paper calls its references global optima, but the released routing helper selects `PATH_CHEAPEST_ARC` and does not certify optimality. Reference claims and actual solver settings therefore need to be distinguished. [Table2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=8)

### Larger instances and other reasoning tasks

On scheduling with50/100 jobs and10/20 machines, SGE's IO-relative gains are59.1/62.9/61.4/60.8; **OR-Tools is better in all four columns** at61.3/63.1/62.4/61.7. SGE exceeds the tested LNS in three columns and ties one. On VRP100/150/200, SGE gives59.6/60.1/59.8, below both OR-Tools62.5/61.2/60.3 and LKH3 65.3/64.4/65.8. Time limits and complete matched budgets for these solvers are not specified. [Tables5-6.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=17)

The eight non-CO reasoning datasets report GPT-4 mean accuracy **89.60% versus86.43%** for Decomposition, a3.17-percentage-point difference in Table3. The abstract's2.46% figure is not the subtraction of these displayed averages. These additional reasoning scores are kept distinct from CO objective quality. No uncertainty/error bars are supplied; the checklist explicitly answers No for statistical significance reporting. [Table3/checklist7.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=29)

### Checks on the worked example and public evaluation helpers

The published four-customer VRP example provides coordinates and a nearest-neighbor route depot-3-2-4-1-depot with length232.22. Its later “refined” final answer is depot-1-3-2-4-depot. Direct Euclidean recomputation gives **232.2164 versus273.5182**, so the displayed refinement is worse. Enumeration of all24 customer permutations confirms232.2164 is the optimum for that particular nonbinding-capacity example. This local check does not rerun the benchmark, but it directly refutes a claim that the displayed refinement necessarily improves its candidate. [Appendix example/pages24-26.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=24)

The current public helpers also limit exact reproduction:

- `plots_n_tables.ipynb` computes **absolute** relative cost differences, unlike the signed minimization formula. A cost increase100 to120 would be displayed as a positive20% difference; this can hide wrong-direction changes.
- `get_cp_solution` parses integer lists and inserts depot endpoints, but does not ensure every required customer appears exactly once or enforce capacity. The isolated helper accepts `[1,1]` as `[0,1,1,0]`.
- Assignment `compute_cost` adds whole matrix rows rather than selecting worker-task entries. For cost matrix[[1,10],[20,2]] and assignment[1,2], it returns vector[21,12] instead of scalar3.
- The routing helper has no capacity dimension and returns the last vehicle's route/cost. Its first-solution setting is not an exact-optimality certificate. The scheduling cost helper sums durations rather than simulating a makespan; the knapsack reference helper accumulates weights while the requested objective is value.
- The original `SGE` helper omits the recursive check and calls list `.join`, which fails in Python; the faster helper uses two trajectories. The newer `main.py` instead generates and executes three TSP heuristic programs, a change explicitly identified in the README, with other tasks left as future work.

These are concrete discrepancies in the current release, not evidence that a particular corrected implementation was used for the published results. No paid model calls, untrusted generated programs or benchmark runs were executed during this audit.

## Limitations

### Discussed in the Paper

- Results depend strongly on the underlying LLM.
- SGE uses87.89% more model calls than Decomposition in the reported comparison.
- Performance tends to deteriorate with problem size; improving cost efficiency is future work. [Sections5-6.](https://proceedings.neurips.cc/paper_files/paper/2024/file/eb9120be0dcaac0aec66d2e75deb69dd-Paper-Conference.pdf#page=10)

### Curator Notes

- Model/tool access and task descriptions differ, and main hosted-model versions and total token/latency budgets are incomplete.
- SGE improves over selected prompting baselines, while stronger classical solvers remain better in the larger-instance comparisons.
- Prompted refinement, final integration and the public parser do not provide universal feasibility/monotonicity guarantees.
- The incomplete mathematical formulations, size-list discrepancy, headline units, worked-example worsening and current evaluation-helper errors require the qualifications above.
- Full raw tables contain bin-count entries exceeding the stated number of items, for example GPT-4 SGE5.02 bins for the row labeled5 items. Under the stated nonempty-bin objective a feasible packing uses at most one bin per item. An unexplained changed scale/metric or invalid output could cause this; the paper does not resolve it. Reported means are not treated here as independently validated feasible solutions.

## Reproducibility

- **Full reading:** all33 formal NeurIPS pages, including AppendixA.1-A.4, complete result tables, worked prompts and the full checklist, were freshly read. Framework, algorithm, example boxes, figures and formulation/result tables were visually inspected.
- **Publication:** formal four-author title and MBZUAI/King's College London affiliations are verified. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2024/hash/eb9120be0dcaac0aec66d2e75deb69dd-Abstract-Conference.html) explicitly records `citation_publication_date` as **2024-12-16**, independently of any paper-specific acceptance date. The actual first arXiv submission is2024-05-28. The formal33-page PDF, rather than the older22-page preprint, supplies the scientific claims in this note.
- **Scientific supplements:** the manually inspected proceedings page links the combined paper without a separate supplement. Its complete appendix was read. The public12-entry code tree has no additional PDF/ZIP/TeX science attachment; notebook examples/metric-generation source were also inspected.
- **Code:** [Zangir/LLM-for-CP](https://github.com/Zangir/LLM-for-CP). README, full original prompting/helper solver files, selected model/backend functions, updated TSP code and notebook evaluation cells were inspected. The README lists Python3.9+, NumPy1.26.4, SciPy1.9.1, OpenAI1.13.3, Transformers4.38.1 and OR-Tools9.9.3963. Its newer TSP-only code-generation pipeline is distinguished from the paper's generic recursive prompt workflow. Local arithmetic and isolated helper tests are saved in `research/full-text-review/self-guiding-exploration/deterministic-checks.json`; they are not a full benchmark reproduction.
- **Figure:** complete original Figure1/page4, directly cropped from the formal PDF.
