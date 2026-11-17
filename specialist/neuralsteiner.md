---
id: neuralsteiner
short_title: NeuralSteiner
title: 'NeuralSteiner: Learning Steiner Tree for Overflow-avoiding Global Routing in Chip Design'
authors:
- Ruizhi Liu
- Zhisheng Zeng
- Shizhe Ding
- Jingyan Sui
- Xingquan Li
- Dongbo Bu
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/e6617714485265b9380a5315bf3ba98f-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/e6617714485265b9380a5315bf3ba98f-Abstract-Conference.html
institutions:
- Chinese Academy of Sciences
- University of Chinese Academy of Sciences
- Henan Academy of Sciences
- Beijing Institute of Open Source Chip
- Peng Cheng Laboratory
- Minnan Normal University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Global Routing
- Rectilinear Steiner Minimum Tree
summary: Congestion-aware neural Steiner/corner-point prediction guides classical connected-route construction;
  major learned-baseline overflow gains, nonzero residuals, wirelength/runtime losses and unavailable announced
  code are qualified.
---

# NeuralSteiner: Learning Steiner Tree for Overflow-avoiding Global Routing in Chip Design

> **TL;DR:** A congestion-aware image model proposes Steiner/corner points, then classical graph connection constructs routes. It sharply reduces overflow versus HubRouter, but retains nonzero congestion, can lose wirelength/runtime, and needs substantial heuristic postprocessing. Neural prediction guides construction rather than editing complete routes.

## Motivation

Short global-routing trees can still exceed grid-edge routing capacity. Previous neural routers emphasize wirelength/connectivity, while detours require broader congestion context. NeuralSteiner learns candidate points from congestion-aware expert routes and balances length with overflow when connecting them (Sections1–3).

## Contributions

- Full-resolution candidate-point prediction uses a modified ResNet34 and two recurrent crisscross-attention passes.
- Nonoverlapping-net batching and a connected net-augmented graph(NAG) support classical greedy route construction.
- Small-net,14-chip global-routing, larger CUGR+DRCU detailed-routing and component ablations assess transfer and congestion reduction (Sections3–4/AppendicesA–C).

## Methodology

**Task.** Chip regions become grid vertices, with edge resource r=capacity−demand; overflow occurs when r<0. Metal-layer resources are projected to a2D routing graph. Candidate labels include degree>2Steiner junctions and degree2corners, rather than every routed pixel. This is congestion-aware global routing, not proof of a rectilinear minimum tree or a completed design-rule-clean detailed route (Sections2/Definition1).

**Prediction and training.** Pin and logistic overflow maps are input channels. CUGR maze-routing/rip-up-and-reroute supplies candidate labels and current resource maps. The modified backbone omits pooling/downsampling to preserve locations; eight residual blocks before and eight after RCCA integrate local and full-map context. Two crisscross passes connect row/column information globally. Focal and Dice losses fit sparse candidate labels, and an additional predicted-point overflow average permits candidates beyond the expert labels. Coefficients are1/1/2; validation-based learning-rate halving and early stopping operate within100epochs. A sigmoid map must become discrete candidate points; exact threshold/implementation details could not be independently recovered from a public release (Section3.3/AppendicesB.1–B.2).

**Classical construction.** Nets sorted by half-perimeter wirelength(HPWL) are grouped if their pin bounding boxes do not overlap. For each net, pins and predicted candidates are connected to neighboring aligned points. NAG edge cost is length+5times summed congestion. Disconnected components are joined with extra candidates/edges; then shortest paths greedily merge nearest pin components until connected, with path reuse to reduce length. NAG connectivity and merging explain pin connectivity; they do not enforce zero overflow. Algorithm3's added inter-component geometry is abbreviated, so exact rectilinear bridging/tie handling is not independently reconstructed without code (Section3.4/Algorithms2–5).

The stated O(pin⁴logpin) worst-case construction cost assumes O(pin)NAG size based on observed candidate counts, not a universal bound on an arbitrary predicted map. A limited-node-pair variant reduces the stated cost to O(pin³logpin), trading search completeness for speed. The paper's checklist explicitly says there are no theoretical results; these are heuristic procedures and complexity discussions, not an approximation/overflow guarantee (AppendixB.5/checklist).

**Classification.** This is **specialist/constructive**. One routing model transfers among chip designs and scales, all within the same native task. The network proposes points before the complete route is constructed; classical path reuse, rip-up-and-reroute in the label generator or subsequent CUGR integration do not constitute a neural full-incumbent improvement policy.

## Experiments

**Data/hardware.** Four ISPD07three-dimensional benchmark sources—bigblue04,newblue03,newblue04,newblue07—provide about25000samples each. Training nets have HPWL≤128 and maps retain original bounding-box dimensions. Six ISPD98ibm designs and eight ISPD07two-layer designs supply global-routing tests; the largest maps reach973×1256, with maximum16008pins/16951candidates. More than92% of nets have≤10pins, making whole-design runtime different from uniformly large-net performance. Training source newblue03_3d and test newblue03_2d share a base name; the paper asserts no sample overlap but does not release a net-level manifest here. Do not strengthen that statement into independently proven disjoint underlying designs, or infer actual duplicate samples solely from the names. Hardware is XeonGold6230R, A80080GB and250GBRAM (Sections4.1/4.4/TablesS1/AppendixB.2).

**Small nets.** All compared HubRouter variants and NeuralSteiner reach correctness1.000, which means full connectivity, despite a percent-labelled table. Wirelength ratios are near1.00 with mixed small differences. NeuralSteiner is **slower than GAN/VAE** in all four small-net groups, e.g.6.60seconds versusGAN5.14 andVAE5.33. These are aggregate test-set generation clocks, not per-net milliseconds or universal neural speedups. NeuralSteiner repeats runtime tests three times; the displayed HubRouter deviations also involve its random seeds, not a confidence interval over NeuralSteiner retraining (TableS2).

**Global designs.** Table2 shows ISPD07overflow drops fromHubRouterGAN35441/53652/142131/45230/102108/1516/1857/583901 to82/255/728/97/431/5/35/10343. Large gains are real, including about99.79% onadaptec04, but overflow remains nonzero. The prose's97.8% mean reduction does not match the table: arithmetic mean of the eight per-design reductions is about99.27%(aggregate-total reduction about98.76%). The maximum99.8% headline is consistent with rounding, while an earlier contribution/poster99.6% is a different printed summary (Table2/pp3/8).

NeuralSteiner generally spends more wirelength to avoid congestion. Onibm06,283727versusHubRouterGAN277977 is about**2.07% longer**, so the blanket “within1.8%” claim does not cover every Table1row. GeoSteiner has lower wirelength and much faster runtime across these reported designs. Boxrouter is explicitly reported with **zero overflow** on all six ISPD98cases, unlike NeuralSteiner's remaining2033/3953/1754/2794/18/3042. Thus the strong claim is an overflow improvement over learned baselines, not dominance over all traditional routers on every objective (Tables1/2/S3/Figure3).

Runtime is also mixed: ibm05takes75.99seconds versusGAN69.42, andadaptec03takes1351.91versus1324.81. Other large-chip cases improve GAN time, but classic GeoSteiner/FLUTE remain faster with much more overflow. HubRouter's best-overflow seed from three runs is selected for ISPD07. Quality references are compared routes/metrics, not certified global optima. TableS3 lists different original-method times thanTable1(ibm0124.75vs27.18), so its speedup should use its own comparison pair, not silently combine clocks.

**Detailed routing and ablations.** CUGR+NeuralSteiner followed by DRCU reduces reported short/space metrics on four ISPD18/19cases, with average relative rows.956/.809, while wirelength/via averages rise.2%/.5%. Violations remain; this is downstream improvement rather than a design-rule-clean certificate. CUGR retains the classical optimization role. Removing neural candidates raises adaptec05overflow10905vs431; removing overflow loss2795, removingRCCA2290. ReplacingHubRouter's postprocessor with NAG already reduces102108to5245, showing a major classical contribution, while learned candidates reduce it further to431. Ltd construction is faster but often slightly worsens overflow and sometimes wirelength(TableS3). These separate contributions should accompany any attribution to neural accuracy (Tables3–5/S3).

## Limitations

### Discussed in the Paper

Heuristic RST postprocessing is time consuming and increases wirelength. Continuous candidate maps and more end-to-end route generation remain future work. Expert CUGR labels are not necessarily optimal.

### Curator Notes

Connectivity does not imply capacity feasibility or legal detailed routing. Fixed loss/cost weights trade wirelength against congestion, and candidate count/sparsity determines postprocessing scalability. Map rounding, inter-component geometric completion, exact resource updates and training/test net identities remain harder to reproduce while the announced code is unavailable. Broad within1.8%/always-faster/mean97.8% prose should yield to the actual table values and metric-specific qualifications. No routing/training benchmark was rerun.

## Reproducibility

- **Formal record:** [NeurIPS2024 proceedings](https://proceedings.neurips.cc/paper_files/paper/2024/hash/e6617714485265b9380a5315bf3ba98f-Abstract-Conference.html), vol37pp127346–127368, official issued December16,2024. All six authors and six institutional affiliations checked against formalPDF; the slides use a shorter affiliation set and do not replace it.
- **Full materials:** all23formal pages, references, scientific AppendicesA–C and the complete checklist read. All result/route/algorithm figures were visually inspected. Publisher exposes integrated appendices, no separate supplement link; conventional supplement ZIP404 and normalOpenReviewoEKFPSOWpp API403 recorded without bypass. Official event93636links15slides(1,409,629bytes) and4,910,801-byteposter, both fully read/rendered/visually checked. No explicitly missing scientific content was identified.
- **Code status:** formal checklistp20 and slide15 promise [liuruizhi96/NeuralSteiner](https://github.com/liuruizhi96/NeuralSteiner). Both normalGitHubAPI and webpage return404; targetedNeuralSteiner repository search is empty, and the author's public repository list has no matching release. This is recorded as an announced unavailable implementation, not labelled verified executable code or a reason to invent source details.
- **Relations:** five actual numbered text-plus-full-bibliography references to existing catalogue items retained. Classical router and DAC REST references remain external where no matching item exists.
