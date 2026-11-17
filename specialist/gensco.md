---
id: gensco
short_title: GenSCO
title: Generation as Search Operator for Test-Time Scaling of Diffusion-Based Combinatorial Optimization
authors:
- Yang Li
- Lvda Chen
- Haonan Wang
- Runzhong Wang
- Junchi Yan
year: 2025
date: '2026-04-23'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8e9869fa827226ff68db9290659a20c-Abstract-Conference.html
code_url: https://github.com/Thinklab-SJTU/GenSCO
institutions:
- School of Computer Science and School of Artificial Intelligence, Shanghai Jiao Tong University
- Shanghai Innovation Institute
- Massachusetts Institute of Technology (current affiliation footnote for Runzhong Wang)
scope: specialist
paradigm: improvement
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Maximum Independent Set
- Maximum Clique
summary: Task-specific rectified-flow models enhance perturbed existing solutions within a classical disruption/feasible-decoding
  search loop, evaluated on TSP, maximum independent set and maximum clique.
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8e9869fa827226ff68db9290659a20c-Abstract-Conference.html
figure:
  path: paper-assets/gensco/framework.png
  alt: Original GenSCO Figure1 showing disruption of a current solution, short rectified-flow enhancement and feasible
    post-processing.
  caption: 'Figure1: original generation-as-search operator and solution-to-solution training.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/b8e9869fa827226ff68db9290659a20c-Paper-Conference.pdf#page=2
---

# Generation as Search Operator for Test-Time Scaling of Diffusion-Based Combinatorial Optimization

> **TL;DR:** GenSCO trains task-specific rectified-flow models to map perturbed solutions toward good labels, then repeatedly alternates disruption, learned enhancement and feasible decoding. It evaluates TSP, maximum independent set and maximum clique. Extra search cycles improve many reported results, but larger TSP instances, hard distribution shifts and classical benchmarks expose clear limits.

## Motivation

Increasing denoising steps within one diffusion generation can saturate without exploring other promising solutions. GenSCO allocates inference computation to many short solution-to-solution refinement cycles. The design combines a learned generative prior with classical disruption and decoding, rather than applying objective-gradient updates during inference. Its models are trained for this search use; the method is not simply an unchanged pretrained diffusion sampler. [pp.1–7]

## Contributions

- A search operator disrupts a solution, applies short rectified-flow enhancement and decodes a feasible replacement.
- Supervised training pairs suboptimal solutions with good labels to learn solution-to-solution trajectories.
- A Transformer processes node embeddings and predicts either edge heatmaps or node scores, reducing explicit edge-feature processing.
- Search cycles, parallel runs, augmentation and local-search budgets are evaluated separately, including learning from imperfect supervision. [pp.3–10,23–29]

## Methodology

**Formal flow model.** Let x_opt be a target label and x_subopt its perturbed counterpart. The paper interpolates x_t=t x_subopt+(1−t)x_opt, and fits the velocity to x_subopt−x_opt with a squared-error objective. Sampling integrates backward from t=1 to0 using a few numerical steps; the written parameterization predicts the target solution through f_θ. These linear *training interpolation targets* do not prove that a learned flow follows an exact straight path or converges to the global optimum. The checklist explicitly states that the paper has no theoretical results. [pp.5,17]

**Architecture.** Attention combines learned query-key scores with an adjacency/state bias. TSP uses a16-layer encoder and six-layer decoder with256-dimensional embeddings and eight heads, then predicts pairwise edge logits by inner product. MIS/MCl use node-score outputs; the formal appendix describes decoder-only256-dimensional models with four heads and12/8 layers for RB/ER settings. Inputs, output heads and separately trained task models differ. Node-feature processing still uses all-pairs attention and, for TSP, an N×N heatmap; the method is not linear in node count. [pp.6,29]

**Search.** The formal procedure starts with a random feasible solution obtained by classical greedy decoding. TSP disruption applies N/4–3N/4 random2-opt moves; graph tasks use variable flips. The flow predicts a relaxed heatmap, then greedy conflict-aware decoding restores a valid tour/set/clique, with optional improving2-opt for TSP. The best solution found across cycles is reported. An individual cycle need not improve the incumbent; retaining the best is different from a monotone guarantee for each proposal. [pp.5–7]

**Classification:** Specialist / improvement. TSP, MIS and maximum clique use separate models and task-specific decoding. Neural inference enhances an existing, possibly disrupted complete solution, while the initial solution is generated classically. Feasibility reconstruction within that improvement operator does not by itself establish a separate learned initial constructor. [pp.5–7,9–10,29; current task-specific training/checkpoint paths]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| TSP |Uniform coordinates in the unit square; training1.28M instances at100 nodes and128K at500/1,000 |
| TSP test/reference |1,280 instances at100,128 at500/1,000; Concorde reference tours |
| TSP inference |Four sampling steps, eight parallel operators, optional N/50 improving2-opt steps per cycle; C controls cycles |
| TSP candidate filtering |AppendixD specifies top5,000 edges at100 nodes and20,000 at500/1,000 |
| MIS |RB200–300 nodes; ER700–800 with edge probability.15;90,000 RB and163,840 ER training instances,500 RB test instances |
| MIS reference |KaMIS labels/references; Gurobi is time limited, not a certified optimum baseline on all cases |
| Maximum clique |RB200–300 and RB800–1,200; time-limited Gurobi reference |
| MIS/MCl inference |Three sampling steps, one operator stream; hundreds to thousands of cycles |
| Repetitions |AppendixD reports averaging five random inference seeds; these are not five independently trained models |
| Resources |RTX4090 inference; stated TSP training costs≤2/1/1 days at100/500/1,000 on a24GB4090 |

The appendix calls the training device “GTX4090,” inconsistent with its RTX4090 terminology. Generative baselines are described as rerun under common settings; several other baselines are quoted from prior papers. The paper does not establish a fully matched end-to-end CPU/GPU/thread/compilation budget for every classical/neural comparison. [pp.7–10,23–29]

**TSP quality/time for the full indicated test set:**

| Configuration | TSP100 gap/time | TSP500 gap/time | TSP1,000 gap/time |
| --- | --- | --- | --- |
| GenSCO C10 |0.000% /6s |.023% /5s |.559% /12s |
| GenSCO C40 |— |.016% /18s |.258% /46s |
| GenSCO C10 +2-opt |0.000% /6s |.019% /5s |.063% /16s |
| GenSCO C40 +2-opt |— |.012% /18s |.046% /58s |
| GenSCO C160 +2-opt |— |.010% /1.2min |.036% /3.9min |
| LKH3,128 trials |.003% /1.2min |.011% /1.1min |.015% /3.1min |
| LKH3,4,096 trials |0.000% /14.1min |0.000% /15min |.001% /36.3min |

The141× headline is14.1min divided by6s on TSP100 at a **rounded**0.000% gap; it is not a proof that every tour is exactly optimal or a universal speedup. At1,000 nodes, LKH's128-trial row is both better and faster than GenSCO C160. The paper itself notes that LKH can overtake the method as time/scale increase. [pp.7–8,23]

- **Cross-size transfer:** GenSCO trained at100 and tested at1,000 has5.40% gap, worse than T2T3.16%. Training at500 and testing at1,000 gives.11%, supporting transfer within the larger-scale group. The framework does not eliminate distribution/size sensitivity. [pp.8–9]
- **Weak supervision:** Labels from2-opt have1.920/6.994% gaps at100/500 nodes. GenSCO trained with them gives.014/1.676%; successive relabeling/fine-tuning on1/75 of the data reaches.005/.583%. These are distinct trained models, not inference-only improvements with one fixed checkpoint. [p.9]
- **MIS:** At500 cycles, RB/ER objectives are19.85/42.46 in1.1min/40s. At16,000 cycles they reach20.06/44.41 in35.2/21.4min, still below KaMIS20.10/44.87. The gaps therefore refer to a heuristic reference, not known global optimality on all graphs. [pp.9–10]
- **Maximum clique:** At1,000 cycles, RB-small/large objectives19.08/40.23 have0.00/−.13% gaps relative to the displayed Gurobi reference19.08/40.18. A negative gap beats that time-limited incumbent, not a proved optimum. The quoted334× compares6.9min with38.4h under those specified runs. [p.10]
- **Parallelism:** At TSP500/C40, one versus eight runs gives.028% in2.408s versus.013% in17.974s. At1,000 nodes the same comparison gives.083% in7.609s versus.047% in47.468s. Eight-way search improves quality with a substantial total runtime increase. [p.23]
- **TSPLIB:** The29-instance50–200-node table reports.061% mean gap, but kroB150 is.340% versus T2T0%. The20-instance200–1,000-node table reports.355%; d493 is3.872%, worse than DIFUSCO/T2T1.81% and FastT2T1.43%. The small-set test uses C200 and16 operators, rather than the main C10/eight-run configuration. [pp.24–25]
- **Ablations:** At TSP500/NFE160, flow+2-opt gives.012% in18s versus consistency+2-opt.021% in93s. Removing augmentation raises C40/TSP500 gap.012→.026% with2-opt. Removing disruption also worsens the displayed results, but the relevant table's labels need the qualification below. Increasing sampling steps has diminishing returns and increases time. [pp.25–26]

## Limitations

### Discussed in the Paper

At larger scales and longer budgets, GenSCO's improvement slows and LKH can surpass it. Certain hard TSPLIB instances degrade average performance; robustness and hybrid switching to classical search remain future work. The method also pays supervised data/training and classical decoding costs. [pp.23–24,28]

### Curator Notes

- **Printed inconsistencies:** Table7's first four mean entries repeat the eil51 row rather than summarize the displayed rows. Table10's C40/80/160 labels accompany Transformer numbers matching Table1's C10/20/40 rows. Table12 labels columns TSP100/500 but shows objectives near16.55/23.13, consistent with the500/1,000-node scales. These are source-level inconsistencies; this note does not silently relabel them or fabricate corrected experiments.
- **References and gap arithmetic:** Rounded mean objectives do not independently verify every gap. In Table4, Gurobi's RB objective19.98 and gap.01% do not agree with the displayed KaMIS20.10 under the straightforward aggregate relative-difference interpretation. The per-instance gap convention/underlying results would be needed to reconcile this row.
- **Statistics:** The checklist explicitly answers No to statistical-significance/error-bar reporting. AppendixD's five inference-seed means do not supply training-seed uncertainty, confidence intervals or a robustness guarantee.
- **Current training differs from Eq.4:** The inspected JAX TSP trainer uses target-edge log-softmax cross-entropy rather than the printed velocity MSE. The released example uses Muon, random-permutation source tours and a separately perturbed target for the interpolation; its data path is named for LKH-generated labels. These settings should be distinguished from the formal suboptimal-to-optimal2-opt interpolation description and Concorde test references.
- **Current integration differs from Eq.5:** TSP calls DPM-Solver++2M. MIS/MCl call an ascending-time Euler update proportional to(predicted target−current state)/(1−t), rather than the paper's written descending-time x_subopt−f_θ parameterization. The release is not a literal implementation of every printed equation; no claim about the historical training is inferred from that difference.
- **Current budgets/seed handling:** The TSP500 example uses top5,000 candidates versus AppendixD's20,000, and the MIS example decodes intermediate predictions as extra candidates. MIS/MCl's `run_batch` passes a batch-index-derived seed to its local generator, rather than the command-line seed; changing that flag alone does not change that explicit generator stream. TSP handles its seed separately. These are current-release reproduction boundaries, not evidence disproving the reported five-run TSP averages.
- **Distance convention:** TSPLIB inputs are described as coordinate-normalized, while the inspected TSP evaluator uses raw floating-point Euclidean lengths. A strict comparison with official rounded TSPLIB edge costs requires consistent objective/reference recomputation; the paper's zero entries alone do not provide that certificate.
- No model training or full benchmark replay was performed. Public code availability and targeted source inspection do not make every historical result independently verified.

## Reproducibility

- **Publication:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/b8e9869fa827226ff68db9290659a20c-Abstract-Conference.html), DOI10.52202/085713-4237. The publisher explicitly dates this proceedings record2026-04-23; the earlier2025-05-23 preprint date and generic conference notification date were removed from publication metadata.
- **Full text:** All29 formal pages, all91 references, the complete checklist, Algorithm1 and AppendicesA–E were freshly read. All five figures and13 tables were visually checked, including the small generalization table and source-label inconsistencies.
- **Companions:** The [official event](https://neurips.cc/virtual/2025/poster/119551) exposes no scientific poster/slide download; its SlidesLive script is site boilerplate and explicitly has no presentation for this event. Publisher/author-source inventories expose no extra scientific PDF. The complete108-entry GitHub tree and109-member1.52MB ZIP contain two READMEs, both read, with no PDF/notebook/nested archive. The OpenReview API was access-restricted; it is not claimed to have supplied a supplement.
- **Code:** [Official JAX implementation](https://github.com/Thinklab-SJTU/GenSCO), inspected treef1bdcef345263576297a7fb760eab493ebfc038e. Models, continuous integrators, all three task search loops, TSP loss/data preprocessing, example train/eval configurations and Euclidean cost helpers were inspected. The README links external checkpoint/data downloads; weights are not bundled in this archive and were not replayed.
- **Figure:** Original formal Figure1, including its full caption, shows disruption, learned flow enhancement and post-processing.
