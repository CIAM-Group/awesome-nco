---
id: on-the-study-of-curriculum-learning-for-inferring-dispatching-policies-on-the-job-shop
short_title: RASCL
title: On the Study of Curriculum Learning for Inferring Dispatching Policies on the Job Shop Scheduling
authors:
- Zangir Iklassov
- Dmitrii Medvedev
- Ruben Solozabal Ochoa de Retana
- Martin Takac
year: 2023
date: 2023-08
publication:
  date: 2023-08
  source_url: https://ijcai.org/proceedings/2023/594
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2023/594
institutions:
- Mohamed bin Zayed University of Artificial Intelligence
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Job Shop Scheduling
summary: An LSTM/set2set actor-critic constructs job-shop schedules and uses adaptive curriculum training across
  sizes; results use 128-sample inference and gaps against known upper bounds, with explicit printed curriculum
  and size-transfer ambiguities.
code_url: https://github.com/Optimization-and-Machine-Learning-Lab/Job-Shop/tree/main_nips
figure:
  path: paper-assets/on-the-study-of-curriculum-learning-for-inferring-dispatching-policies-on-the-job-shop/framework.png
  alt: The dispatching actor and critic combine machinery features with backward-LSTM remaining-operation encodings
    aggregated through set2set.
  caption: 'Original Figure 1: size-agnostic job-shop dispatching architecture.'
  source_url: https://ijcai.org/proceedings/2023/0594.pdf#page=4
---

# On the Study of Curriculum Learning for Inferring Dispatching Policies on the Job Shop Scheduling

> **TL;DR:** RASCL combines an autoregressive job-shop dispatcher with adaptive curriculum learning. The reported mean gaps are approximately 10.46% on Taillard and 18.85% on DMU, using **128 sampled schedules**. These gaps use known upper bounds, and the printed algorithm, comparison headline and large-size training description require the qualifications below.

## Motivation

A neural dispatching policy trained directly on large job-shop instances may learn less effectively than one trained first on smaller instances. Moving sequentially through sizes can also degrade earlier capabilities. The paper investigates how the curriculum and inference strategy affect a size-agnostic dispatcher, rather than attributing every gain to architecture alone. The native problem is deterministic, non-preemptive JSP with fixed machine assignments, operation precedence and machine non-overlap. [pp. 1–3]

## Contributions

- A recurrent remaining-operation encoder and set2set job aggregation support an actor-critic dispatcher across JSP sizes.
- RASCL expands the available curriculum levels using a gap threshold and aims to revisit poorly performing levels.
- Comparisons cover fixed-size training, incremental/uniform/adaptive curricula and greedy/POMO/sampling/beam inference.
- Evaluation includes Taillard/DMU schedules, complete configuration details and released experiment tables/plots. [pp. 1–7]

## Methodology

At each step, the policy chooses a job whose next pending operation is dispatched. The deterministic scheduling environment respects machine/precedence constraints; completed jobs are masked. An episode ends after all job operations are scheduled. The step cost is the increase in the current completion horizon, so its undiscounted sum telescopes to the final makespan. REINFORCE minimizes expected makespan using a learned return-to-go critic; the critic minimizes squared return error. The scientific formulation should not be relabeled PPO. [p. 3, Eqs. 1–5]

For each job, a backward LSTM encodes the remaining operation sequence. These encodings are cached and indexed by the next pending operation. Set2set aggregates job descriptions without depending on their input order. Machinery status and job embeddings feed separate actor/critic heads. The stated encoder/LSTM width is 128; the two-layer actor/critic heads have a 16-neuron hidden layer and job-score/scalar outputs. Size-agnostic representation does not itself establish equally good generalization at arbitrary sizes. [pp. 4, 7; Fig. 1; Table 3]

Curriculum levels represent JSP sizes. Incremental CL moves through them sequentially; uniform CL samples sizes uniformly; adaptive staircase CL expands the learned set and revisits previous sizes. RASCL's stated intention is to emphasize levels with larger gaps and add a new level when the largest current gap is below 15%. The printed Algorithm 1 instead samples `softmax(1/g)`: for finite positive gaps, this assigns **more** probability to smaller gaps, opposite to that intention. The surrounding “inversely proportional” wording is likewise inconsistent with its subsequent larger-gap explanation. This is a specific printed-description discrepancy, not a refutation of the measured results. [pp. 4–5]

The released `cl_train.py` adversarial mode uses a direct softmax of computed residual scores, rather than inverse gaps. It also uses explicit progress/time limits. Consequently, the printed pseudocode should not be presented as an exact executable description of the current release. The training script exposes different curricula through commented configuration blocks; its default active block trains a fixed-size base model. [repository lines 148–152, 237–259; `main_train.py`]

**Classification: Specialist / constructive.** The neural policy incrementally constructs JSP schedules across sizes. There is no shared checkpoint demonstrated across different native combinatorial problems. The sampled candidates and beam search are inference strategies, rather than a learned local-improvement policy over a completed schedule. [pp. 2–7]

## Experiments

The principal Taillard results cover eight size groups from 15×15 to 100×20; DMU has 80 instances across eight groups from 20×15 to 50×20. Baselines include SPT, FDD/WKR, MWKR, MOPNR and the published Zhang et al. learning-to-dispatch results. CP-SAT is used to approximate reference solutions for curriculum evaluation. Table 1 explicitly defines its gap relative to the **known upper bound**, which is not necessarily a proven optimum. [pp. 5–6]

Appendix A specifies 1,000 randomly generated validation instances, Adam at 10^-4, batch size 128, 45,000 training iterations for Base/ICL/UCL and evaluation every 100 iterations. The adaptive threshold is 15%. Reported RASCL training takes approximately eight hours on an A100 SXM 40 GB, with the stated AMD EPYC CPU/256 GB RAM system. The article does not provide a complete matched inference-time comparison or multi-training-seed uncertainty analysis. [p. 7]

RASCL with 128-sample inference reports Taillard gap values from **3.96% to 16.09%** and DMU values from **14.66% to 25.42%**. The eight printed Taillard entries average approximately **10.46%**; DMU averages **18.85%**. These are benchmark gap values under a multi-sample budget, not greedy-dispatch results or certified approximation ratios. Sampling is better than the three-start POMO and width-three beam settings in Table 2, but these widths do not constitute matched search budgets. For example, on 20×15, greedy is 16.52% versus sampling's 10.58%. [pp. 6–7; Tables 1–2]

The headline **19.35%→10.46%** comparison needs a comparator qualification. Curator arithmetic on the displayed Table 1 rows reproduces 19.35% by choosing the better **PDR for each size group**; the displayed Zhang et al. neural column instead averages approximately **27.09%**. Therefore, the claimed 45.94% reduction should not be described as arithmetic directly comparing those two neural columns. For DMU, the printed Zhang entries average approximately **38.48%**, while the headline says 38.43%. These small/source-comparator inconsistencies are preserved rather than silently rewriting the authors' reported numbers. The released workbook independently supports the displayed-column means; no solver benchmark was rerun. [pp. 1–2, 6–7]

RASCL is not uniformly better than adaptive staircase CL: ASCL is slightly better on 15×15, by the stated 0.24 percentage points. More importantly, Section 6 calls 50×15, 50×20 and 100×20 sizes absent from training, while Appendix A/Figure 4 explicitly show training curves for those sizes. The released curriculum size list also includes them. The note consequently retains demonstrated multi-size performance without labeling every large-size result as established zero-shot size transfer. [pp. 6–7]

## Limitations

Results remain deterministic JSP experiments with fixed machine routes. Stochastic/partially observable extensions are future work. Performance depends on curriculum thresholds, reference solutions and inference width. Adaptive curricula can consume different training budgets, and the supplied comparisons do not isolate all compute-budget effects. Known-upper-bound gaps, larger sampling budgets and the absence of seed confidence intervals limit broad superiority claims. [pp. 3–7]

The inverse-gap sampling statement, headline comparator and large-size training description conflict with other parts of the article or current code. These are documented reproduction boundaries; they do not establish that every experimental result is incorrect. The architecture's job-order equivariance is a structural design property, not a proof of optimal scheduling or universal out-of-distribution generalization. [pp. 4–7]

## Reproducibility

The formal paper is IJCAI 2023 Main Track, pp. 5350–5358, DOI 10.24963/ijcai.2023/594. Publisher BibTeX and deposited metadata give **August 2023**, so the date retains month precision. The four authors are affiliated with MBZUAI. All nine formal PDF pages were read, including Appendix A and all 33 references. No separate same-paper arXiv version was identified or added.

The official `main_nips` repository is pinned to **d35f33ef7b2f8f8b57bf44df8d6c895ae0dd296e**, committed 2025-01-03. Its complete ZIP has 282 members/269 files. The bundled nine-page manuscript was also read fully; its scientific text matches the formal article apart from publication furniture and plot-axis text extraction. All four additional one-page plot PDFs were read and visually inspected, including the standalone Base heatmap absent from the displayed combined Figure 3 layout. Their separate labels, including “ACL” in a curriculum plot, are not silently substituted for the formal article.

The supplied workbook was inspected **read-only** across all seven sheets and 493 nonempty rows. All 3,120 formulas, original values and cached results were extracted; independent arithmetic/AVERAGE checks agree with the cached formula values within 10^-9. This was a structured source-table check, not a visual inspection of every cell, an Excel-engine refresh or a rerun of scheduling experiments. Per-instance gaps use the recorded known-upper-bound denominator. The ten `.tar` files are actually PyTorch ZIP data containers; all member names were inventoried and contain serialized test data/version records rather than additional scientific documents. They were not unpickled.

Publisher/author repository inventories identify no missing separate scientific appendix. All four formal figures, three tables, key equations and Algorithm 1 were rendered and viewed; original Figure 1 is included. No training, inference benchmark, CP-SAT solve or historical-weight execution was performed. Internal relations use explicit body references and full matching bibliography identities, including the DeepWeave citation's printed 2021 label for the catalogue's IJCAI 2020 paper.
