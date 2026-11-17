---
id: diffusion-chip-placement
short_title: Diffusion Chip Placement
title: Chip Placement with Diffusion Models
authors:
- Vint Lee
- Minh Nguyen
- Leena Elzeiny
- Chun Deng
- Pieter Abbeel
- John Wawrzynek
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/lee25y.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/lee25y.html
institutions:
- University of California, Berkeley
- SambaNova Systems
- Stanford University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Macro Placement
summary: Synthetic-pretrained guided diffusion constructs macro/cluster coordinates zero-shot; classical standard-cell
  placement, residual legality error and per-circuit quality/runtime exceptions remain.
code_url: https://github.com/vint-1/chipdiffusion
---

# Chip Placement with Diffusion Models

> **TL;DR:** A GNN/attention denoiser trained only on synthetic netlists simultaneously generates macro or macro/cluster coordinates. HPWL/overlap guidance supports zero-shot transfer; classical placement handles individual standard cells. Large average gains coexist with imperfect legality, circuit-specific losses and slower runtime than DREAMPlace.

## Motivation

Per-netlist online RL training is costly, while sequential mistakes are difficult to undo. Diffusion permits offline training and simultaneous coordinate generation, but realistic placement data are scarce. The paper therefore studies which synthetic netlist distributions support transfer to real circuits (Sections1–2).

## Contributions

- An inverse-data generator first produces nonoverlapping rectangles and then samples plausible distance-biased pin connections.
- Interleaved graph/attention layers, residual MLPs and sinusoidal coordinate features provide a scalable denoising model.
- Dataset-shift studies and HPWL/legality-guided sampling are evaluated on clustered, macro-only and mixed-size placement (Sections4–5).

## Methodology

**Task and metrics.** Coordinates are normalized to[−1,1]; node features are object dimensions and edges encode source/destination pin offsets. A star representation links each driving pin to its sinks. HPWLis a bounding-box proxy, and synthetic HPWLratio divides generated wirelength by the dataset placement's wirelength, **not a certified optimum**. Legality is in-boundary union area divided by total object area: exactly1indicates no overlap/boundary violation under the simplified definition; a value near1is not strict legality or downstream routing signoff (Section3).

**Data and model.** Random legal rectangles receive power-law pin counts. Edges are sampled with distance-dependent probability proportional to exp(−L1distance/s). v1contains40kcircuits averaging230vertices/1600edges and broadly sampled scales; v2contains5kcircuits averaging960vertices/9510edges. A6.29M-parameter Large model combines GATv2message passing, attention, two-layer residual MLPs and2Dsinusoidal encodings. Training uses3MAdamsteps on v1plus250kfine-tuning steps on synthetic v2, on oneA5000GPU; no realistic placement data train this model (Sections4–5/Tables1/7–8).

**Inference.** A1000-step cosine-schedule DDPMstarts from Gaussian coordinates. Backwards universal guidance performs gradient steps on predicted clean coordinates using HPWLand overlap potentials. A changing legality multiplier trades the two terms. These continuous candidate states need not be legal. The paper provides empirical optimization, not a proof of global optimality, complete feasibility or monotonic improvement (Sections3.3/4.3/AppendixA).

**Evaluation pipelines and classification.** Realistic clustered circuits retain macros and aggregate standard cells into512hMetisclusters. Macro-only evaluation removes standard cells and places **all** macros, including sets larger than those used by some original baselines. For mixed-size results the generated cluster coordinates initialize standard cells and DREAMPlace4.1places those cells with macros **fixed**. This is specialist / constructive: denoising generates continuous placement candidates, with no learned edit policy on a complete feasible incumbent. Cross-chip transfer remains one native placement task (Sections4.4/5.4–5.5/AppendixB).

## Experiments

**Synthetic transfer and ablations.** Fewer edges, more vertices and mismatched connection scales degrade legality or HPWL. Scale diversity and larger-circuit fine-tuning improve IBMlegality from.7794(v0)to.8835(v2); guidance raises it to.9970and reduces HPWL3.203→2.976×10⁷. The corresponding DREAMPlace clustered value is3.724×10⁷, but the authors explicitly note it is not optimized for clustered placement. Replacing attention with graph convolution drops synthetic legality.960→.799; model/data ablations support these design choices rather than unrestricted distribution generalization (Figures4–8/Tables2–4).

**Macro-only quality.** IBMaverage HPWL2.49×10⁵improves over the strongest listed7.33, and RUDY196over324. ISPDaverages45.9×10⁵and546improve over116and836. AppendixBstates baselines were adapted to all macros, so these numbers differ from their original subset protocols. The ISPDmeans hide losses:adaptec1HPWL9.19is worse than WireMask-BBO5.81, ChiPFormer6.75and MaskPlace8.57;bigblue12.64loses to WireMask-BBO2.12. RUDYalso loses onadaptec1,bigblue1andbigblue2against the best displayed comparator. MaskPlace times out on two of eightISPDcircuits (Tables5/9–12).

**Mixed size and negatives.** Five-seed means give diffusion+DREAMPlace22.7×10⁶versusDREAMPlace23.6, roughly4%lower on average. It loses to DREAMPlace on **eight of18circuits**, includingibm068.31versus6.15andibm1434.5versus31.3. On macro-freeibm05,7.79also loses to every displayed comparator, whose values are7.60–7.67. WireMask-BBOfails onibm12/15; its aggregate uses the smallest corresponding competitor values as optimistic substitutions. These are average pipeline improvements, not a universal neural-placement dominance statement (Table6/footnote2).

**Time.** Reported mean runtime is4.39minutes onIBMversus114–227for the listed learned/black-box baselines, but DREAMPlace takes only.475minutes. ISPDmean21.2minutes includes **122minutes onbigblue2** and18.9onbigblue4, while DREAMPlace averages3.00. Thus the method is faster than the tested costly search/training pipelines, not all classical placers or uniformly a few minutes. Synthetic generation(100kapproximately200-object circuits/day on32CPUs)and offline training are additional amortized costs (Sections4–5/Tables13–14).

## Limitations

### Discussed in the Paper

Synthetic data omit nuances such as multimodal object/edge distributions. The model generalizes poorly to sizes/scales not covered by training. The authors propose future RLfine-tuning to trade additional test compute for quality. Cluster-level placement still relies on downstream standard-cell tools (Sections5–6).

### Curator Notes

- Guided legality.9970allows residual overlap/out-of-boundary area. Finite gradient steps and soft penalties do not supply an exact legalizer, and HPWL/RUDYare proxies rather than completed routing/power/timing measurements.
- The printed description uses gradient **descent** on positive`w·(violation−epsilon)`with respect to the legality weight. That sign would lower the penalty on excess violation. The inspected release instead minimizes its **negative**, implementing ascent of the multiplier objective; it also includes boundary penalties beyond the abbreviated pair-overlap equation. This is a text/implementation distinction, not a theorem the paper establishes.
- The release's macro-only READMEcommand adds20guidance steps and up to20000post-sampling legalization iterations, beyond Table7's10inner steps. Sampling/guidance/legalization/checkpoint settings must be stated when comparing clocks and quality.
- The official poster's takeaway says fewer edges are fine while too many are not, but its plotted curve and formalSection5.1.1show the reverse direction. The formal results and graph were used here. Poster affiliations also include a later employer; formal-paper affiliations define this entry.

## Reproducibility

The [formal ICML2025 record](https://proceedings.mlr.press/v267/lee25y.html) givesPMLR267,pp33499–33514,issued2025-10-06. All16formal pages, including full references and all appendices, were read. Guidance equations and negative-result/runtime tables were rendered. The officialICMLposter44664was visually read. Publisher/event links expose no separate scientific appendix/slides; OpenReviewcrCPLUtIuUAPIreturned403.

The publisher links [author code](https://github.com/vint-1/chipdiffusion). Its complete238-entry untruncated tree atSHA6973e90ee1afc345b56da486bbf7dc9772ada1a4contains four notebooks and no additionalPDF/TeX. All notebook scientific cells, visible result text and16saved figures were inspected, alongside README, generator/evaluation configuration and guidance/legalization/loading code. One8MBoutput is a printed node-name/index mapping rather than additional scientific prose. Benchmark conversion, hMetisrequirements, pretrained weights and synthetic-data commands are documented. The README warns that a failed state-dict load can leave random model weights; successful parameter loading needs explicit checking. No training or physical-design experiment was rerun.

**Internal citations.** Explicit text plus bibliography onpp9–10verify [DeepPlace/DeepPR](deepplace-deeppr.md), [MaskPlace](maskplace.md), [ChiPFormer](chipformer.md), and [EfficientPlace](efficientplace.md). The adapted all-macro and fixed-macro mixed-size protocols are not silently equated with each original paper's setup.
