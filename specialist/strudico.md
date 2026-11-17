---
id: strudico
short_title: StruDiCO
title: 'StruDiCO: Structured Denoising Diffusion with Gradient-free Inference-stage Boosting for Memory and Time
  Efficient Combinatorial Optimization'
authors:
- Yu Wang
- Yang Li
- Junchi Yan
- Yi Chang
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/6728fcf94660c59c938319a6833a6073-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/6728fcf94660c59c938319a6833a6073-Abstract-Conference.html
institutions:
- School of Artificial Intelligence, Jilin University
- School of Artificial Intelligence, Shanghai Jiao Tong University
- International Center of Future Science, Jilin University
- Engineering Research Center of Knowledge-Driven Human-Machine Intelligence, MOE, China
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Maximum Independent Set
- Capacitated Vehicle Routing Problem
summary: Task-specific absorbing-mask consistency models construct and refine TSP/MIS/CVRP solutions without objective
  backpropagation, with forward-only structural guarantees and published-proof/release qualifications.
code_url: https://github.com/yuuuuwang/StruDiCO
figure:
  path: paper-assets/strudico/framework.png
  alt: Original StruDiCO Figure1 and complete caption showing absorbing forward corruption and reverse denoising.
  caption: 'Figure1: original structured denoising diffusion framework.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/6728fcf94660c59c938319a6833a6073-Paper-Conference.pdf#page=2
---

# StruDiCO: Structured Denoising Diffusion with Gradient-free Inference-stage Boosting for Memory and Time Efficient Combinatorial Optimization

> **TL;DR:** StruDiCO learns task-specific denoisers with one-way solution masking, suppresses low-confidence samples and improves decoded incumbents through further neural denoising and objective-guided greedy decoding. It evaluates TSP, MIS and an additional CVRP experiment. Forward masking preserves feasible subsets; the main reverse sampler does not guarantee a monotone feasible trajectory.

## Motivation

Ordinary bit-flip diffusion can destroy the partial-solution interpretation of intermediate states. The proposed absorbing corruption removes selected variables without introducing new selections. Few-step consistency training and refinement without objective backpropagation aim to reduce the cost of diffusion-based solving. [pp.1–4]

## Contributions

- A variable-absorption forward process maps selected1 entries to0 while leaving unselected entries unchanged.
- Two corruption levels supervise a timestep-conditioned consistency model against the same reference solution.
- Constrained consistency sampling thresholds low-confidence variables before Bernoulli sampling and renewed corruption.
- An incumbent-refinement loop combines masking, neural prediction and objective-aware greedy decoding without inference-time objective gradients. [pp.4–8]

## Methodology

**Learning.** The binary transition matrix has rows(1,0) and(β,1−β). For downward-closed partial representations such as selected tour edges or independent-set vertices, forward noising retains a subset of the reference. The network is a12-layer gated GCN with sinusoidal node/edge/timestep features. Table9 gives hidden dimension256 for routing and RB-MIS,128 for ER-MIS; AppendixF's blanket MIS128 description is less specific. Training minimizes two supervised cross-entropies. Labels need not be globally optimal: TSP500/1,000 use LKH3 references and MIS uses KaMIS. [pp.3–5,19–21]

**Construction.** Algorithm1 starts from zeros, predicts selection probabilities, masks variables below thresholdδ, samples them, and applies absorbing corruption before the next prediction. Experiments commonly useδ=.8, but settings vary by task. This is a predict/resample procedure: AppendixB explicitly says the main reverse path does not strictly preserve feasibility across steps. Its stronger stepwise feasible-greedy variant is left for future study. A final problem-specific decoder is necessary. [pp.5–6,15]

**Improvement.** A feasible incumbent is masked by confidence, partially corrupted at ratioα, denoised, and decoded again. The formal greedy score is pᵢ/(ϕᵢ+ε), with distance as the TSP penalty and neighboring probabilities as the MIS conflict penalty. Repeat for Tg refinement iterations; optional2-opt/local search adds separate classical work. This yields the repository's **specialist / constructive-improvement** classification: the neural model supplies both initial construction and its own incumbent refinement, while separate task/size checkpoints are trained. [pp.6–8]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| TSP training |50/100/500/1,000 nodes; Table9 lists1,502K/1,502K/128K/64K instances,50 epochs, learning rate2×10⁻⁴, batch32/12/6/4 |
| TSP evaluation |1,280 instances at50/100;128 at500/1,000; Concorde references for50/100, LKH3 for500/1,000 |
| MIS |RB200–300:90K train/500 test; ER700–800 with edge probability.15:163,840 train, DIMES test data; KaMIS references |
| Sparsification |TSP500/1,000 KNN factors50/100; candidate restriction is part of the protocol |
| Hardware/time |A40 48GB and Xeon Gold5220; batch1/single-thread evaluation unless four-sample decoding is specified; times average per instance |
| Additional tasks |AppendixD evaluates CVRP50/100/200 with classical local search and29 TSPLIB instances50–200 |

**Selected TSP results:**

| Configuration | TSP500 gap/time | TSP1,000 gap/time |
| --- | --- | --- |
| StruDiCO Ts5/Tg5, greedy |2.045% /.651s |2.753% /2.533s |
| StruDiCO Ts5/Tg5, greedy+2-opt |.326% /.674s |.535% /2.614s |
| FastT2T Ts5/Tg5, greedy+2-opt |.383% /1.387s |.603% /5.779s |
| StruDiCO Ts5/Tg5, four samples+2-opt |.168% /2.437s |.261% /6.836s |
| FastT2T Ts5/Tg5, four samples+2-opt |.194% /5.095s |.419% /13.029s |
| LKH3 |rounded.00% /1.848s |rounded.00% /4.641s |

Thus the displayed paired neural configurations improve quality and runtime, but LKH3 is both faster and more accurate than the four-sample TSP1,000 configuration. At100 nodes, Ts3/Tg3+2-opt gives.024% in.083s versus FastT2T.036% in.180s; without refinement, StruDiCO's.038s is slightly slower than FastT2T.037s. The reported30–70% memory saving and40–65% runtime reduction are measured comparisons/normalized radar plots for particular configurations, not universal complexity or speed guarantees. [pp.6–9]

- **Transfer:** Training at100 and testing at500/1,000 yields2.96/3.22% gaps versus FastT2T1.77/3.08%. Training at500 and testing at1,000 gives.75% versus1.06%, showing both favorable and unfavorable cases. [p.9]
- **MIS:** Ts5/Tg5 greedy gives RB/ER sizes19.748/42.125 in.181/.552s; four samples give19.908/43.265 in.492/1.988s. These improve on the displayed diffusion baselines but remain below KaMIS20.090/44.969. KaMIS's table label does not establish an exact optimum. Density/size shifts are additionally plotted in Figures6–9. [pp.9–10,18–19]
- **CVRP:** Three construction/three refinement steps give gaps1.12/1.88/3.19% at50/100/200; five/five gives.85/1.53/2.71% in.07/.17/.38s. The three-step200-node gap is worse than Sym-NCO2.86%; the five-step200-node runtime is slower than Sym-NCO.36s. COExpander is faster on all three sizes. This appendix reports local search, without the detailed CVRP training table/checkpoint coverage supplied for TSP/MIS. [p.18]
- **TSPLIB:** A model trained at100 nodes is evaluated with Ts=Tg=10 on29 normalized-coordinate instances50–200. Reported mean gap is.13%, but individual losses include kroE1002.15% versus FastT2T.13%. Negative zero is rounding, not a certified improvement over an optimum. [p.18]
- **Ablation:** Absorbing noise alone is worse than the uniform baseline in all six Table6 settings; ER gap increases15.898→23.461%. Uniform noise plus constrained sampling also worsens ER15.898→16.522%. The combined absorbing-noise/constrained-sampling design works better; neither component alone is uniformly beneficial. [p.10]

## Limitations

### Curator Notes

- **Reverse feasibility:** Formal footnotes and AppendixB limit strict structural guarantees to the forward process. The poster's stronger monotone-reverse wording should not replace that qualification. The current TSP test path additionally unions new samples with its previous mask; MIS replaces the mask. Neither operation by itself ensures tour or independent-set feasibility.
- **KL proof sign:** In AppendixC, Eq29 gives the exact difference −(1−Z)Δ−logZ. With c=−logZ/(1−Z), this is −(1−Z)(Δ−c), whereas Eqs11/31 print Δ+c. The sufficient condition for non-increase is consequently Δ≥c, not the printed Δ≥−c. For p=q=Bernoulli(.2), threshold.5 retains only0: original KL0 becomes−log(.8)=.22314355, while the printed decomposition gives−.22314355. This refutes that decomposition and its zero-slack condition; it does not establish that every weaker small-discarded-mass bound or the empirical method is false.
- **Other theoretical scope:** The preliminary triangle inequality applies to a metric d; cross-entropy is not a metric, so it cannot automatically inherit that argument. Proposition3.1 is explicitly informal: local Lipschitz continuity and bounded perturbations alone do not prove contraction or convergence of a stochastic/discrete greedy iteration. No global optimality guarantee is established.
- **Printed numerical inconsistencies:** Table3's unrefined StruDiCO TSP1,000 objective23.118 duplicates its reference despite a5.967% gap; the sampled FastT2T objective23.287 does not match its.419% gap against23.118. Table2's AM50 objective is below Concorde while its gap is positive. Table6's TSP1,000.797% differs from the corresponding Table3.996% entry. Table8's first four baseline Mean cells repeat eil51. These values are flagged rather than silently reconciled.
- **Current TSP implementation:** Its selected Cython decoder receives the symmetrized heatmap, threshold and seed, sorts confidence, and randomly stitches remaining paths. Coordinates are not an argument, so this path is not the formal p/(distance+ε) greedy rule; distances enter later2-opt/evaluation. Training draws the two corrupted states independently, rather than explicitly coupling a nested trajectory.
- **Current MIS implementation:** The rewrite winner expression takes argmax of the old scalar score instead of the new candidate-score list. With old score4 and candidates[3,5], the exact released expression records5 but selects candidate0, whose score is3. This can mismatch the stored incumbent and score under multiple candidates; single-candidate runs are unaffected. Its logged gap has the opposite sign from the table's positive Drop convention. An `.item`/`.item()` condition also performs an unused final resample; it adds no neural forward call.
- The paper reports no error bars. Multiple evaluated instances or four sampled candidates are not independent training-seed significance tests. No full neural training/checkpoint benchmark was replayed here; the recorded small algebra/source-expression checks establish only the stated boundaries.

## Reproducibility

- **Publication:** [NeurIPS2025 proceedings](https://proceedings.neurips.cc/paper_files/paper/2025/hash/6728fcf94660c59c938319a6833a6073-Abstract-Conference.html), DOI10.52202/085713-2394. The publisher explicitly records electronic proceedings date2026-04-23; the conference edition/year remains2025.
- **Full text:** All28 formal pages were freshly read, including47 references, AppendicesA–G, proofs, all nine figures/nine tables and the complete checklist. Key equations were checked directly in high-resolution page images.
- **Companions:** The [official event](https://neurips.cc/virtual/2025/poster/118241) exposes a1.781MB scientific poster, fully read in three overlapping tiles; no separate slides/scientific supplement was exposed. The untruncated2,714-entry GitHub tree and2,715-member579.56MB archive contain no additional scientific PDF/notebook/nested archive. Both READMEs were read.
- **Code:** [Author implementation](https://github.com/yuuuuwang/StruDiCO), tree538783956830e8532c77bea316f86aacbb6058a4. Scheduler, TSP/MIS losses, sampling/refinement, GCN timestep path, both decoders, evaluator and example scripts were inspected. Seven checkpoints cover TSP/MIS; no CVRP implementation/checkpoint is supplied. A TSP10K checkpoint/script is not evidence of a formal10K experiment in this paper.
- **Figure:** Original Figure1 with its full caption illustrates absorbing corruption and denoising; the reverse-feasibility qualification above applies.
