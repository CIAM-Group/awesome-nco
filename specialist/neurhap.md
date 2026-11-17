---
id: neurhap
short_title: NeurHap
title: Graph Coloring via Neural Networks for Haplotype Assembly and Viral Quasispecies Reconstruction
authors:
- Hansheng Xue
- Vaibhav Rajan
- Yu Lin
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/c76f18e65d16cd2786e50a88db00cde4-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/c76f18e65d16cd2786e50a88db00cde4-Abstract-Conference.html
institutions:
- Australian National University
- National University of Singapore
scope: specialist
paper_type: solver
paradigm: neurodynamic
problem_families:
- Graph Optimization
problems:
- Graph Coloring
- Haplotype Assembly
summary: Per-instance neural parameter optimization colors signed read-overlap graphs before classical MEC refinement;
  known haplotype count, surrogate/threshold effects and release-specific refinement limits qualify biological and
  scaling results.
code_url: https://github.com/xuehansheng/NeurHap
---

# Graph Coloring via Neural Networks for Haplotype Assembly and Viral Quasispecies Reconstruction

> **TL;DR:** Instance-specific neural optimization partitions sequencing reads through same/different-color constraints, then classical recoloring reduces minimum error correction(MEC). Reported biological datasets improve substantially, but graph constraints are a surrogate for MEC, k is known, and released refinement code has narrower scope than the formal algorithm.

## Motivation

Sequencing reads mix noisy fragments from multiple haplotypes/viral strains. A SNP matrix retains variant positions after reference alignment; grouping rows into coherent components permits consensus reconstruction. Earlier representation-then-clustering methods can miss read relationships. NeurHap explicitly models pairwise agreement/conflict, particularly for polyploid or multi-strain data, while optimizing a separate biological reconstruction discrepancy (Sections1–2).

## Contributions

- A read-overlap graph encodes both equal-color consistency and different-color conflict, distinct from ordinary minimum-chromatic-number coloring.
- An instance-trained message-passing model minimizes a differentiable constraint loss and outputs a discrete partition.
- A classical single-vertex refinement explicitly evaluates consensus MEC and accepts improving recolorings.
- Simulated/real potato and viral experiments, mean-versus-best controls, parameter analyses and supplementary scaling tests support the method's reported utility (Sections3–4/AppendixA).

## Methodology

**Task and graph.** Given m reads and n SNP positions, partition reads into a supplied k haplotypes. A cluster's consensus is determined by allele voting; MEC sums read-to-consensus Hamming discrepancies on observed positions. Reads are consistent if they overlap sufficiently and agree everywhere observed, conflicting if at least q positions differ, and otherwise ambiguous. Consistent edges require equal colors, conflict edges unequal colors; ambiguous relationships are omitted. Parameters p/q control this noisy-evidence graph, so it is not a universally exact reduction of the unconstrained noisy MEC problem. The paper's thresholds vary: main defaults p=3/q=5, the runnable example p=6/q=2, and a supplementary sensitivity example favors p=5/q=4 (Sections3.1–3.2/AppendixA2–A3).

**Neural search.** For each input, message functions over conflict-neighbor embeddings, mean aggregation and a recurrent combine operator produce k-way soft assignments. Conflict matrix J−I and consistency matrix I give probabilities that an edge satisfies its corresponding relation. The objective is average negative log satisfaction for conflict edges plus λ times that for consistency edges, rather than direct MEC differentiation. Typical settings are32-dimensional representations,10 message iterations,2000 optimization epochs, Adam1e−3 and λ=.01. Argmax probabilities yield a full coloring; no certificate guarantees every signed edge is satisfied or global MEC minimized. Empty edge sets/numerical log probabilities require implementation care (Equations1–4/Algorithm1/AppendixA2).

The actual release creates a new neural model and optimizer per input. Each forward pass samples random initial node states, recurrently predicts assignments and optimizes network parameters; best assignment is selected by conflict-violation ratio, not by exact MEC. It does not apply one previously trained checkpoint across biological tasks. Consequently **specialist/neurodynamic** describes the neural solve: continuous per-instance parameter optimization followed by discretization. Ordinary MEC recoloring afterward is retained as postprocessing and does not establish neural improvement or a constructive/improvement mixed policy. This classification follows the same per-instance-optimization criterion as related energy-style neural methods and was confirmed by the root reviewer.

**Refinement.** The formal supplementary pseudocode iterates vertices and alternative colors absent from current conflict neighbors, accepting a change only when recomputed MEC strictly decreases, then repeats until no accepted improvement. With finite assignments and exact strict comparisons this process terminates at a local outcome, not a global optimum. It explicitly checks conflict edges; it does not independently preserve every equal-color consistency edge. A zero-conflict initial assignment and correct current-neighbor handling are needed to claim conflict feasibility is preserved (main p6/supplementp1).

## Experiments

**Protocol/reference.** Sim-Potato is tetraploid k=4, with ten samples at coverages5x/10x/20x/30x. Real-Potato uses ten randomly chosen genomic regions of a potato chromosome5 capture-seq dataset. Viral datasets have known5 HIV/10 HCV/15 ZIKV strains and ten samples each. Reads are aligned by BWA-MEM, with the same SNP extraction tool/settings used by CAECseq/GAEseq. Main results report the **lowest MEC of ten independent runs per input**, then aggregate over samples; the displayed deviations are not confidence intervals showing that every random run matches that best. k is provided rather than inferred from abundance. Baselines include CAECseq/GAEseq, plant-specific H-PoP/AltHap and viral TenSQR (Section4/AppendixA2).

**Reported quality.** On simulated potato, NeurHap MEC means29.9/51.9/92.6/142.0 compare with CAECseq96.2/141.4/254.2/372.9 and GAEseq153.7/261.6/372.8/496.9. Real-Potato mean371.6 compares with CAECseq400.0 and GAEseq409.2; sample4 is a tie at1 with CAECseq, so all-sample strict dominance is too strong. Viral means are1371.4 HIV versus best baseline1638.5,1008.1 HCV versus1144.3, and702.3 ZIKV versus851.3. All per-sample rows were read. The HIV difference is267.1 MEC, not the prose's approximately160. These are reconstruction-error improvements on the stated references, not exact optimum gaps or demonstrated downstream biological correctness (Tables1–3).

**Mean-run and baseline controls.** Supplementary Table1 averages runs rather than taking minima: NeurHap37.5/62.8/113.2/166.3 versus CAECseq160.5/266.0/466.5/629.5, retaining strong mean MEC gains. Supplementary graph-coloring comparisons use conflict-only graphs for Greedy/RUN-CSP, omitting the consistent-edge information that NeurHap receives. Real-Potato means505.3/418.6/371.6 and HIV3612.0/2406.6/1371.4 therefore measure the full adapted pipelines, not equal-information direct optimization of an identical signed objective. Classical refinement helps: HIV neural-search1453.5→1371.4 (main Figure5/supplementTables1–2).

**Cost and parameter scope.** A Sim-Potato30x timing example reports258seconds NeurHap versus341 CAECseq/492 GAEseq, with lower reported MEC. This limited example does not establish all-dataset or whole-genome speed dominance; preprocessing, ten-start selection and stage-level costs need consistent accounting. Hardware is a6-core i7-7800X,96GB RAM and two48GB RTX A6000 GPUs. The supplementary environment states PyTorch1.8, while README lists1.3.1. Dimension16–128 and λ0–.1 are comparatively stable in the displayed experiments, whereas λ=.5 worsens; iteration10 is best in one example and p/q strongly affect graph quality (mainp9/supplementpp2–3).

**Scaling, including long reads.** Supplementary cumulative real-potato rows grow240→3074 reads and4317→68950 total signed edges; neural-search time28→253seconds with MEC183→3992, versus CAECseq243→2774seconds/MEC229→4524. These are **NeurHap-search**, not necessarily full refinement timings, and rough empirical edge correlation is not a proved linear-complexity bound.

The supplement additionally reports a genuine long-read chromosome22 experiment: NA12878 input129338 reads/22792 SNPs,734seconds, roughly13GB memory and MEC23114 for two haplotypes. CAECseq/GAEseq reportedly exceed48GB GPU memory. Thus the main text's long-read limitation must be qualified by this additional positive result rather than stated as no long-read test. Whole-human-genome12hours/65GB is explicitly an optimistic extrapolation from chromosome22, **not a measured whole-genome run or reconstruction accuracy validation** (supplementpp4–5/Table3).

## Limitations

### Discussed in the Paper

k is assumed known and cannot be automatically discovered. Long-read search spaces and complex repeats challenge contiguous chromosome-level reconstruction. The supplement limits most evaluation to gene-region datasets, adds a specific chromosome22 long-read case and labels whole-genome scaling optimistic. Threshold selection matters; low-confidence consistent edges or sparse conflict graphs can degrade outcomes.

### Curator Notes

Equation3 is a pairwise constraint surrogate; its correlation with MEC in one training plot is not objective equivalence. Thresholding can omit one-mismatch pairs, so satisfying all retained signed edges need not imply zero MEC. For example, p=2/q=2 with fully observed readsAAA,AAC,CCC,AAA: put the first,second,fourth reads in one color andCCC in another. All retained consistency/conflict relations hold, yet the first cluster has MEC1. This simply qualifies the supplement's ideal-consistency interpretation under realistic ambiguous edges; it does not refute measured improvements or an ideal noiseless assumption that all within-cluster reads truly agree.

The public refinement implementation hardcodes COLORS={0,1,2,3}, despite accepting n_colors/k, and reads neighbor colors from the original assignment while accepted changes accumulate in a separate _ASSIGNMENT. Thus the released path does not implement arbitrary-k/current-neighbor feasibility as printed and may introduce conflicts after interacting changes. It still recomputes and strictly lowers its tracked MEC on accepted changes. The loader's MEC function sums each read's minimum distance to **any** reconstructed consensus, whereas Equation1 sums distances to its assigned cluster's consensus; exact assignment-consistency of these two evaluations is not established by the prose alone. No conclusion that formal k=5/10/15 results used this exact limited release follows. The repository contains only ten Cov5 potato matrices and a loader path hardwired to Cov5/K4 names, so broader claims need the stated external datasets/historical code. No model or reconstruction benchmark was executed during this audit.

## Reproducibility

- **Publication/identity:** [NeurIPS2022 proceedings](https://proceedings.neurips.cc/paper_files/paper/2022/hash/c76f18e65d16cd2786e50a88db00cde4-Abstract-Conference.html), volume35, pp30898–30910, DOI10.52202/068431-2240, official citation_publication_date December6,2022. Three authors/ANU/NUS checked.
- **Coverage:** all13 formal pages/references/checklist plus all5 separate [scientific supplement](https://proceedings.neurips.cc/paper_files/paper/2022/file/c76f18e65d16cd2786e50a88db00cde4-Supplemental-Conference.pdf) pages, every table/cumulative row, refinement pseudocode and long-read details read. Key diagrams/results/scaling pages rendered. Official event53475 poster8028404bytes and author NeurHap.jpg fully inspected. Normal OpenReview zK6PjBczve API403 recorded without bypass.
- **Implementation:** [author code](https://github.com/xuehansheng/NeurHap),492149byte21member ZIP fully inventoried; source/README/one scientificJPG/ten input matrices, no extraPDF/TeX/notebook. Complete README and actual main/model/graph construction/consensus/refine paths checked. Per-inputAdam training, randomized states, checkpoint criterion, fixed-four-color/stale-neighbor limits and paper/README threshold/PyTorch differences are distinguished from formal method claims.
- **Relations:** actual full main/supplement bibliographies were compared with the catalogue, with no matching current internal stable IDs. External CAECseq/GAEseq/RUN-CSP/PI-GNN and classical biological citations are retained as source context rather than invented internal graph nodes.
