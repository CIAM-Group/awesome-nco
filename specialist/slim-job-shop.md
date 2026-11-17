---
id: slim-job-shop
short_title: SLIM
title: Self-Labeling the Job Shop Scheduling Problem
authors:
- Andrea Corsini
- Angelo Porrello
- Simone Calderara
- Mauro Dell'Amico
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/be8987a75afeeadfa65007cf7ee25de0-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/be8987a75afeeadfa65007cf7ee25de0-Abstract-Conference.html
institutions:
- University of Modena and Reggio Emilia
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Routing
problems:
- Job Shop Scheduling Problem
- Traveling Salesman Problem
summary: SLIM samples feasible schedules, trains on the lowest-makespan trajectory
  with cross-entropy and deploys a constructive graph pointer model; a separate TSP
  study demonstrates training-method portability.
code_url: https://github.com/AndreaCorsini1/SelfLabelingJobShop
---

# Self-Labeling the Job Shop Scheduling Problem

> **TL;DR:** Sample several feasible schedules, select the best under makespan and train the model to imitate that trajectory. A graph pointer scheduler trained with this self-labeling method provides strong constructive JSP results, while a separate attention-model experiment tests the training recipe on TSP.

## Motivation

Supervised scheduling methods often need expensive high-quality reference solutions, while RL training can be sensitive to reward design and optimizer settings. SLIM needs only a generative model able to sample multiple feasible candidates and an objective able to rank them. It turns each model-generated best candidate into a pseudo-label, avoiding externally solved target trajectories in the training loss (Sections1-2/4).

## Contributions

The main contribution is Self-Labeling Improvement Method, a training strategy rather than an inference-time local-search operator. For each instance, sample beta trajectories and minimize the mean cross-entropy of the lowest-makespan one. The paper also proposes a graph encoder/attention decoder for JSP, studies alternative architectures and candidate budgets, compares with PPO, and trains a separate TSP Attention Model using SLIM. Its relationship to the cross-entropy method is explicitly discussed (Sections4/6).

The solver remains specialist/constructive. One JSP model is trained across several instance shapes and tested across sizes. A separate TSP model demonstrates portability of the training recipe; it does not establish that a single neural checkpoint solves scheduling and routing. Flexible/dynamic job shop and flow shop are potential extensions, not additional tested native tasks. The article provides empirical studies, and its checklist explicitly says it has no theoretical results (PDF2/10/20).

## Methodology

Represent each operation as a node of a disjunctive graph, using job-precedence arcs, same-machine relations and15 operation features. A two-layer GATv2 encoder runs once per instance, producing143-dimensional operation embeddings. At each decoding step, the next operation of each unfinished job is available. An attention memory network processes11 handcrafted partial-schedule features into128-dimensional job states; a classifier combines each state with the corresponding ready-operation embedding. Completed jobs are masked. Selecting a job appends its next operation to that machine's schedule at the earliest time allowed by the machine and job, ensuring a feasible constructed schedule (Sections3-4; Tables1/4).

SLIM independently samples beta parallel feasible trajectories, ranks them by final makespan and backpropagates cross-entropy only through the selected best trajectory. No loss is taken on the other sampled trajectories. Test-time greedy decoding selects the highest-probability job; randomized GM128/GM512 select the best of128/512 constructed solutions. The word Improvement describes learning from better pseudo-labels and does not change this constructive inference classification. Neither the best-sample loss nor sampling alone provides a theorem of monotonically improving population quality or freedom from mode collapse (Section4).

The main dataset contains30,000 synthetic JSP instances:5,000 each at10x10,15x10,15x15,20x10,20x15 and20x20. Printed training settings are20epochs, Adam2e-4, gradient accumulation over16instances and beta256 during training/validation, with600held-out validation instances and approximately120hours total training. Current and publisher-ZIP script settings differ from this common description, as documented below (Section5.1).

## Experiments

**Main JSP comparisons.** Taillard and Demirkol each contain80instances, with many shapes larger than those in training. Percentage gap is100*(makespan/reference-1), where the reference is optimal or best known, not always a certified optimum. Table2 reports Taillard mean gaps8.4%/7.8% for GM128/GM512, compared with randomized CL10.5%, L2S5k7.4%, MIP8.4% and CP2.0%. Demirkol gives14.0%/13.1%, versus CL19.0%, MIP14.6% and CP3.5%. GM512 is competitive with some improvement methods and beats limited-budget MIP on larger shapes, while CP and strong classical metaheuristics often provide better quality. GM128 ties SBH at13.5% on Demirkol20x20 rather than strictly winning every constructive row (Tables2/7).

**Other benchmarks and runtime.** Lawrence contains40smaller cases. GM512 averages2.5% versus L2S5k1.8% and the printed exact-solver0.0% rows; greedy INSA beats greedy GM on several smaller shapes. On the selected two-per-shape Taillard subset, GM has the best aggregate14.5%, but DQN and CL lead on several individual shapes. Thus the result is not an every-instance dominance claim (Tables5-6).

Hardware is an i9-11900K and RTX309024GB. Figure6 gives mean **per-instance** times, including9.35seconds for GM512 on100x20, versus2.10seconds for greedy GM and9.39seconds for single-solution L2D. Dispatching rules and insertion heuristics are faster. Its Tot Sum sums shape means, not all instance runtimes. Some neural comparator qualities come from original papers; the authors rerun their own coded methods and randomized L2D. All comparison rows are therefore not one uniform hardware/budget experiment (Sections5/Figure6).

**Very large cases.** AppendixE uses20instances per shape at200x20,200x40,500x20 and500x40. GM512 times are31/64/164/343seconds versus3,600seconds for CP-Sat. The authors report better GM solutions on73of80cases. These are comparisons to that finite CP run, not optimality guarantees. Table8 prints CP500x40 mean546064.0, inconsistent in scale with GM53942.9 and its reported gap sum; the note preserves the discrepancy because corresponding raw large-instance data are not in the linked workbook (Table8).

**Training studies.** Replacing attention with feed-forward layers still permits self-labeling, but full GM is stronger in the displayed aggregate. The PPO comparison uses40,00030x20training instances and repeatedly evaluates Taillard every100steps; the authors explicitly avoid claiming SLIM universally superior to PPO and label the partial-reward explanation an intuition. Larger training/test candidate budgets generally help with memory/time costs. Sampling1,024 instead of512 improves the displayed aggregate by roughly .4percentage points while taking about1.9times longer (Section6; AppendicesF-G).

**TSP.** Train a separate Attention Model on20-node instances, batch32 and100,000steps, comparing SLIM and POMO under the stated shared settings. Figure5 repeatedly evaluates TSPLIB cases of at most100nodes. SLIM converges faster in that study and approaches the pretrained POMO20 curve; this is a validation-curve demonstration, not a new exact TSP solver or a shared JSP/TSP checkpoint (Section6.5).

## Limitations

Only one of beta samples contributes a pseudo-label, so generation can be sample-inefficient and memory-intensive. Improvements depend on obtaining useful candidates and on the generative architecture; final-cost ranking does not make the method objective-free. The standard JSP implementation uses rectangular job/machine arrays and should not be assumed to handle arbitrary flexible-machine or unequal-operation variants. Standard deviations in AppendixD describe variation **across benchmark instances**, not a claimed number of independent training seeds. No approximation ratio, global-convergence or formal anti-collapse result is provided (Sections6-7/checklist).

### Curator Notes

**Published values and released raw results differ.** The paper-linked current workbook has three sheets and200instance rows. Every original cell/formula cache was parsed and4,120 valid makespan/gap pairs were independently recomputed; each equals makespan/UB-1 within numerical tolerance. However, Lawrence MIP makespansAA4:AA43 are missing while AB4:AB43 cache-1, which must be treated as unavailable rather than-100% performance. TaillardBE86:BE106 contains21`#REF!` summary errors. Current raw rows yield Taillard CP1.5841% instead of the article2.0%, and Demirkol greedy GM19.9825% instead of20.3%. GM128/GM512 aggregates closely match the paper. These are source-version/data discrepancies; the article's numbers are not silently replaced.

**Release settings.** The publisher ZIP has a2e-4starting learning rate with ReduceLROnPlateau and default beta32; the current script uses constant2e-5/default beta128. Both validate with128samples and select checkpoints by mean reference-relative gap, whereas the article describes beta256 and lowest average makespan. The current best-trajectory cross-entropy correctly excludes the final forced operation, whose probability is1. Stored reference makespans are used for gap reporting/validation; their presence is distinct from using stored schedules as supervised training targets. Reproduction should set parameters explicitly and identify the release version. The released loader also defines its remaining-work feature including the current operation, unlike the printed after-operation description in Table4. No full neural training or scheduling benchmark was rerun.

## Reproducibility

- All24pages of the [formal NeurIPS2024 PDF](https://proceedings.neurips.cc/paper_files/paper/2024/file/be8987a75afeeadfa65007cf7ee25de0-Paper-Conference.pdf) were read, including all58references, scientific AppendicesA-G and complete checklist. Twelve key pages were visually inspected, covering all six figures, eight tables and central formulas. The publisher confirms four University of Modena and Reggio Emilia authors, December16,2024 and DOI10.52202/079017-3349.
- The [publisher supplemental ZIP](https://proceedings.neurips.cc/paper_files/paper/2024/file/be8987a75afeeadfa65007cf7ee25de0-Supplemental-Conference.zip) is44,326,481bytes with30,806entries, including30,760JSP data files, code and checkpoints, with no separate scientific PDF or workbook. Scientific appendices are integrated. Both OpenReview notes APIs for`buqvMT3B4k` returned403. No explicitly missing scientific document was found.
- The [official repository](https://github.com/AndreaCorsini1/SelfLabelingJobShop) was inspected at`2168f8543b13d2f5729ff44b11e1139bde05b9ad`:30,839files, four SLIM checkpoints and eleven L2D comparator checkpoints. README/requirements, complete train/test/PointerNet/sampling/data-loader sources and all train/test differences from the ZIP were read. The core architecture, sampler and loader are byte-identical between ZIP/current. TSP training code/checkpoint and Table8large-instance raw results are absent from this release.
- The paper explicitly links [the extended result workbook](https://github.com/AndreaCorsini1/SelfLabelingJobShop/blob/2168f8543b13d2f5729ff44b11e1139bde05b9ad/output/Results.xlsx). Read-only Artifact Tool import and original XML extraction cover20,053cells/6,357formulas across Lawrence/Taillard/Demirkol, with independent JS per-row/per-shape aggregation and raw-cache/import comparison. No workbook was edited, recalculated or exported; structured coverage is not a claim of visual reading of every cell. Workbook SHA256 is`fb98559ab31d93401b7f0a92c7997317f8bcb92cd2b521c8473bcf750d2eef16`; scripts/results are in the paper's research cache.
- Eight current-catalogue edges require explicit body references plus full bibliography identity. General scheduling references and unrelated curriculum-learning articles do not create inferred edges.
