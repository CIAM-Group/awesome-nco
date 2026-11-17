---
id: chipbench
short_title: ChiPBench
title: Benchmarking End-To-End Performance of AI-Based Chip Placement Algorithms
authors:
- Zhihai Wang
- Zijie Geng
- Zhaojie Tu
- Jie Wang
- Yuxi Qian
- Zhexuan Xu
- Ziyan Liu
- Siyuan Xu
- Zhentao Tang
- Shixiong Kai
- Mingxuan Yuan
- Jianye Hao
- Bin Li
- Feng Wu
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/1cba8502063fab9df252a63968691768-Abstract-Datasets_and_Benchmarks_Track.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/1cba8502063fab9df252a63968691768-Abstract-Datasets_and_Benchmarks_Track.html
institutions:
- University of Science and Technology of China
- Huawei Noah's Ark Lab
- Tianjin University
scope: study
paper_type: benchmark
problem_families:
- Placement
problems:
- Chip Placement
summary: An end-to-end benchmark evaluates AI placers through final physical-design metrics.
code_url: https://github.com/MIRALab-USTC/ChiPBench
---

# Benchmarking End-To-End Performance of AI-Based Chip Placement Algorithms

> **TL;DR:** ChiPBench evaluates placement outputs through a common OpenROAD backend to expose mismatches between proxy objectives and post-route power, timing and area. It catalogs 20 designs; the printed detailed macro-placement tables cover 16, and conclusions depend on the chosen flow, adaptations and metrics.

## Motivation

Macro half-perimeter wirelength and other fast placement objectives need not predict final physical-design quality. The paper addresses missing design files and incompatible evaluation pipelines by linking placement outputs to downstream global placement, legalization, clock-tree synthesis and routing. “End-to-end” here means tool-based physical implementation and reports, rather than fabricated-chip measurements (PDF pp. 1–6).

## Contributions

ChiPBench supplies a 20-design catalog, an OpenROAD-based evaluation flow, format-conversion utilities and comparisons of six macro-placement methods with DREAMPlace and Hier-RTLMP. It analyzes relationships between intermediate and final metrics and adds commercial-tool and logic-synthesis comparisons. This is a benchmark study; its broad “AI-based” category includes classical black-box search and analytical optimization as well as neural policies (pp. 3–9, 14–20).

## Methodology

The catalog draws from CPU, GPU and NPU designs. An automated procedure hardens selected RTL modules into macros to create diverse variants, using the NanGate45 technology library. Table 1 lists 26,667–427,003 cells and 10–136 macros across the 20 entries; these are related design variants rather than 20 unrelated industrial chips (pp. 4–5).

The evaluated macro methods are SA, WireMask-EA, AutoDMP, MaskPlace, ChiPFormer and MaskRegulate. Outputs requiring Bookshelf format are converted back to DEF and inserted into the common backend. For methods that also place standard cells, only macro positions are retained in the main comparison before the shared downstream flow. This evaluates a controlled stage replacement, rather than every method's complete native pipeline (pp. 6, 14–15).

The protocol is not uniformly zero-shot: Appendix B specifies 100 online fine-tuning iterations for ChiPFormer and 3,000 epochs for MaskPlace, with pretrained models/default settings used where applicable. The adapters also modify non-square canvas handling, macro import/export and benchmark parsing. Final metrics include WNS, TNS, violating paths, total power and standard-cell area; raw negative slack is better closer to zero, while the normalized positive ratios in Table 2 are oriented lower-is-better (pp. 6–7, 15).

## Experiments

The published normalized aggregate gives WireMask-EA a MacroHPWL ratio of 0.844 relative to Hier-RTLMP, but WNS and TNS ratios of 1.556 and 11.007. AutoDMP improves the HPWL aggregate to 0.892 while its timing ratios also exceed one. These results support a mismatch between particular proxy gains and timing outcomes in this evaluation, rather than failure of every learned placement method on every circuit (Table 2, p. 7).

On `swerv_wrapper`, MaskRegulate improves TNS from −613.774 to −516.377 and the violating-path count from 1,435 to 1,365, while its WNS is slightly worse, −0.670 versus −0.660. Case studies associate central macro clustering, peripheral placement and dataflow with different downstream behaviors. The Pearson correlations are observational evidence from the chosen algorithms/designs, not causal laws for arbitrary placement problems (pp. 7–9).

The detailed macro results in Tables 6–7 list 16 designs, omitting `or1200`, `mor1kx`, `isa_npu` and `bp68` from the 20-design catalog. The runtime table covers 17 designs. The paper does not clearly reconcile these coverage differences, so the catalog size should not be equated with 20 fully displayed per-method result sets (pp. 4, 16–18).

Appendix E compares six commercial-tool placements through the open-source backend, evaluates placements under both commercial and open-source flows, and compares Yosys with a commercial synthesizer. These are additional settings with their own coverage and should not be pooled into the main macro-placement average (pp. 19–20).

## Limitations

Results depend on NanGate45, selected circuit variants, fixed downstream stages, method adapters and tuning budgets. Extracting only macro positions can discard benefits of a method's joint placement pipeline. The reported backend evaluation times exclude the placement algorithm itself, synthesis and data preparation; they are not total solver runtimes. The study does not give a clear repeated-seed uncertainty protocol for the main numerical tables (pp. 5–6, 15–16, 23).

The commercial-flow comparison supports testing consistency but does not preserve every pairwise ranking as the prose claims. For example, commercial WNS ratios rank AutoDMP 1.129 ahead of WireMask-EA 1.161, whereas the open-source ratios rank WireMask-EA 1.280 ahead of AutoDMP 1.316. Such reversals prevent treating the comparison as exact ranking equivalence across all metrics or toolchains (Table 10, p. 19).

Low proxy correlation in this finite collection does not establish that all surrogate objectives are ineffective. Regularity and dataflow are plausible design considerations supported by examples; their universal optimality or causal sufficiency is not proved.

## Reproducibility

The complete [27-page publisher PDF](https://proceedings.neurips.cc/paper_files/paper/2025/file/1cba8502063fab9df252a63968691768-Paper-Datasets_and_Benchmarks_Track.pdf), including all 49 references, Appendices A–F, detailed numerical tables and checklist, was reviewed. The [NeurIPS proceedings record](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1cba8502063fab9df252a63968691768-Abstract-Datasets_and_Benchmarks_Track.html) identifies the Datasets and Benchmarks track and links no separate supplement.

The [author repository](https://github.com/MIRALab-USTC/ChiPBench) provides Docker/build instructions, pinned OpenROAD and Yosys versions, design configurations, conversion tools and the metric collection code. The [dataset card](https://huggingface.co/datasets/MIRA-Lab/ChiPBench-D) documents DEF/LEF/Liberty/Verilog/SDC assets. The README, conversion instructions and relevant benchmarking/metric extraction functions were inspected; power is assembled from internal, switching and leakage reports, and units are retained in the output metadata. No large circuit dataset was downloaded and no placement or EDA flow was rerun.
