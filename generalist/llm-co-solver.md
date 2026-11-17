---
id: llm-co-solver
short_title: LLMCoSolver
title: Large Language Models as End-to-end Combinatorial Optimization Solvers
authors:
- Xia Jiang
- Yaoxin Wu
- Minshuo Li
- Zhiguang Cao
- Yingqian Zhang
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/f0c6c93e1dbff84daf6082fef7e1a094-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/f0c6c93e1dbff84daf6082fef7e1a094-Abstract-Conference.html
institutions:
- Eindhoven University of Technology
- Singapore Management University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Scheduling
- Graph Optimization
problems:
- Traveling Salesman Problem
- Orienteering Problem
- Capacitated Vehicle Routing Problem
- Maximum Independent Set
- Minimum Vertex Cover
- Permutation Flow Shop Scheduling
- Job Shop Scheduling
summary: Direct text-to-solution fine-tuning supports seven native problems, with a jointly SFT-trained generalist
  and separate SFT/GRPO specialists evaluated through best-of-N sampling.
code_url: https://github.com/Summer142857/LLMCoSolver
figure:
  path: paper-assets/llm-co-solver/framework.png
  alt: Original LLMCoSolver Figure1 showing solver-generated labels, LoRA SFT, feasibility-aware GRPO and best-of-N
    inference.
  caption: 'Figure1: original LLMCoSolver training and inference framework.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/f0c6c93e1dbff84daf6082fef7e1a094-Paper-Conference.pdf#page=4
---

# Large Language Models as End-to-end Combinatorial Optimization Solvers

> **TL;DR:** LLMCoSolver trains language models to emit solutions directly from text descriptions. Its main results use task-specific SFT+feasibility-aware GRPO models and best-of-eight sampling. A separate experiment jointly fine-tunes **one** Qwen2.5-7B model on seven problem types, establishing generalist coverage. Neither experiment guarantees feasibility on arbitrary inputs, and the current release has checker limitations documented below.

## Motivation

Generating heuristic code or invoking a solver through an LLM still requires interfaces and domain knowledge. This work instead maps a text-attributed instance (TAI) directly to a route, set or schedule. Solver-generated demonstrations teach solution patterns without reproducing the solver's internal search. The interface still needs problem descriptions, numerical-to-text conversion, parsers and problem-specific feasibility/objective checks. [pp. 1–6, 16–25]

## Contributions

- SFT learns textual solution generation from high-quality solver demonstrations.
- Feasibility-and-optimality-aware reinforcement learning (FOARL) combines rule-based constraint rewards with objective rewards using GRPO and LoRA.
- Best-of-N inference selects among complete generated candidates. Experiments cover seven native problems, alternate backbones, distribution shift, Taillard/selected TSPLIB instances and an explicitly jointly trained generalist. [pp. 4–10, 16–32]

## Methodology

The seven tasks are TSP, open-route orienteering (OP), CVRP, **maximum** independent set, minimum vertex cover, permutation flow-shop scheduling (PFSP) and job-shop scheduling (JSSP). “Maximal independent set” in an appendix heading refers here to the maximum-cardinality formulation. TAI prompts list the objective, constraints, numerical data and inexpensive heuristic hints: routing top-two neighbors, graph neighbors/degrees or short-processing-time operations/jobs. Reference outputs list a route/set/order/machine schedule and objective. [pp. 3–4, 16–24]

SFT uses next-token cross-entropy. The standard task-specific second stage samples eight completions per instance, computes group-normalized rewards and optimizes a clipped GRPO objective with KL regularization. Feasibility rewards score parseability and individual constraints. Minimization rewards use inverse reference-relative cost; Appendix A uses achieved/reference prize or cardinality for OP/MIS maximization. These task definitions matter more than treating the generic minimization equation as the reward for every problem. [pp. 5–6, 17–25]

At inference, the model generates a complete textual candidate. Best-of-eight sampling evaluates candidates and chooses the best accepted feasible output; it does not learn an incumbent-editing or backtracking operator. Objective values must be recomputed from the parsed solution. The current release adds graded feasibility credits and feasibility gates in objective rewards, which differ from the simplified binary-constraint description. [pp. 6, 9, 17–25]

**Classification:** Generalist / constructive. Section5.5 and AppendixE.8 explicitly train a **single Qwen2.5-7B model by SFT on all seven combined task datasets**, then test that model with N=8. This supplies genuine shared-weight cross-problem evidence. The main table's SFT+RL models are separate specialists; AppendixE.8 does not establish a jointly GRPO-trained model or transfer to arbitrary unseen constraint semantics. [pp. 6–10, 31]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Default backbone | Qwen2.5-7B; Llama3.1-8B and Gemma2-9B in separate backbone experiments |
| Training data |500,000 solver-labeled instances per problem for SFT; at most3,200 additional instances per problem for FOARL |
| Instance scales |10–100 nodes for routing/graph tasks;5–20 jobs/machines for scheduling; times1–100 |
| References |LKH-3 for TSP/CVRP, an evolutionary OP solver, Gurobi for MIS/MVC, QIG for PFSP and OR-Tools CP-SAT with300-second limit for JSSP |
| Fine-tuning |20,000-token context; LoRA rank64/alpha64 on attentionq/k/v/o and FFNgate/up/down;2.08% trainable parameters |
| SFT/FOARL |AdamW2×10⁻⁴/effective batch16; FOARL10⁻⁶,batch8,group8,clip0.1,KL0.05 |
| Evaluation |100 instances per task; LLM experiments repeated three times and the **best run** reported; main BoN uses8 samples |
| Hardware |H100 GPU and AMD EPYC7F72; JSSP SFT approximately65 hours/28GB GPU memory |

**Joint generalist results — SFT, one model, BoN8:**

| Metric | TSP | OP | CVRP | MIS | MVC | PFSP | JSSP |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Reported feasibility |100%|96%|93%|84%|93%|100%|100%|
| Reported gap |0.86%|1.15%|4.50%|1.89%|2.47%|1.31%|8.25%|

These AppendixE.8 values are distinct from the following specialist experiments. [p. 31]

- **Main specialist pipeline:** SFT+FOARL+BoN8 reports gaps1.07%/1.85%/4.53%/1.04%/1.29%/1.03%/8.20% in task order above, averaging9.8 seconds across tasks. Feasibility is100% on six tasks and94% on MIS. Single-generation FOARL gives CVRP80% and MIS83%; high BoN success should not be described as an unconditional feasibility guarantee. [pp. 7, 27]
- **FOARL tradeoff:** OP feasibility improves54%→92% and CVRP59%→80% before BoN, while their reported gaps rise2.32%→4.25% and6.02%→8.27%. Gaps are calculated on accepted feasible outputs, so improving coverage changes the averaging population. A lower conditional gap alone does not establish better overall performance. [pp. 7, 9]
- **Simple heuristics versus stronger solvers:** Results beat many basic rules, especially at small scales. Large CVRP gap7.24% is worse than parallel savings6.12%, and large MVC2.35% is worse than greedy2.21%. AppendixE.5's stronger heuristic references also remain better: TSP0.00%, CVRP−0.19%, OP1.60% and PFSP0.00%, versus the model's1.07%/4.53%/1.85%/1.03%. Gurobi achieves0% on MIS/MVC and2.45% on JSSP within the stated approximately11-second comparison. [pp. 8, 30]
- **Classical routing comparison:** The model improves over the tested time-limited Gurobi formulations on routing, including CVRP4.53% versus35.09%. This does not establish superiority to specialized routing heuristics, which are reported separately. [pp. 29–30]
- **More samples:** On the large-instance subset, MIS feasibility rises75%→92% for N8→64, but the conditional gap is not monotone across N. CVRP gap improves7.24%→4.30%; JSSP16.25%→11.63%. [p. 30]
- **Named benchmarks:** Taillard gaps at N8 are14.22%/21.16%/23.30% for15×15/20×15/20×20, improving to11.34%/17.26%/20.01% with N64. The TSPLIB experiment uses **five instances below100 nodes**, with mean gap2.69%; it is not a full-library or large-scale routing evaluation. [pp. 10, 32]
- **Distribution shift:** Clustered/mixed routing tests retain reported100% feasibility while gaps rise; CVRP changes4.53%→5.12%/5.04%. These tests support transfer across the specified distributions rather than universal generalization. [p. 32]

## Limitations

### Reported by the Authors

- Inference remains slower than lightweight traditional heuristics. More efficient adaptation/inference, larger instances, improved text representations and integration with heuristics to address remaining infeasibility are future work. Training has substantial computational cost. [pp. 10, 33]

### Curator Notes

- **Checker scope:** An isolated execution of the current release's actual `compute_metric_cop` accepts a TSP tour repeating a city, a CVRP route serving a customer twice, and an MIS containing only out-of-range vertex identifiers. TSP checks distinct-node counts without enforcing visit multiplicities; CVRP uses set coverage; MIS omits identifier-range validation. These are confirmed checker gaps on synthetic outputs. They do not prove that such outputs occurred in the published experiments; replaying saved predictions with strict validators would be needed to establish corrected empirical feasibility rates.
- **Gap statistics:** The release computes gaps only for accepted outputs and clips negative gaps to zero. Its returned dispersion uses `np.std`, whereas the checklist calls the main table's dispersion a standard error. This version/statistic distinction is preserved rather than treating the values as three-run means or confidence intervals.
- **Data/companion differences:** The formal CVRP generator description says capacity equals average demand; the checked release uses `int(r×mean_demand)` with r drawn from a triangular3/6/25 distribution. The formal CVRP reward weights match the release at0.2/0.1/0.6/0.1, while official slide8 lists0.1/0.2/0.5/0.2. No single undocumented protocol is inferred from these differences.
- **References and conditioning:** LKH, QIG and time-limited CP-SAT references need not certify global optima. Table5's LNCS/MIS objective and gap ordering also needs clarification before interpreting its claimed advantage under one common reference. The large-scale limitations and all feasibility denominators remain relevant even when the textual interface is convenient.
- **External work remains:** Problem-specific text templates, heuristic feature calculations, parsers, rewards and validators require engineering. The paper contains no feasibility theorem; its checklist marks theoretical results as not applicable. API baseline timing also varies with provider/hardware, as the authors acknowledge.

## Reproducibility

- **Published source:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/f0c6c93e1dbff84daf6082fef7e1a094-Abstract-Conference.html), issued2026-04-23. All40 formal pages, complete76-entry references, AppendicesA–G,14 tables,four figures,all worked text examples and the full checklist were freshly read.
- **Scientific companions:** All15 pages of the official presentation were read in text and rendered form. The complete4,400×2,457 official poster was visually read on a white background to reveal its transparent black text. No extra scientific PDF/notebook/archive appears in the complete55-entry author tree or56-member source ZIP.
- **Code/data:** [LLMCoSolver](https://github.com/Summer142857/LLMCoSolver), commitf6388991d243c0aa91d9ee7e2fa18ed1c9e72477. Both repository READMEs and key data-generator/reward/evaluation branches were inspected. The linked SFT/RL Drive folders were recursively inventoried:43 folders,74 child entries,33 data files consisting of26 JSON and7 PKL files, with no extra scientific prose. MVC's SFT train folder is empty and the SFT PFSP train folder is absent in this checked inventory; the release is not assumed to provide every training artifact.
- **Verification scope:** Exact current utility functions were isolated for the three checker counterexamples; no pretrained LLM inference, training or benchmark replay was performed. The original formal Figure1 is used for the framework image. The note separately identifies the shared SFT experiment and task-specific full-pipeline results.
