---
id: phyblock
short_title: PhyBlock
title: 'PhyBlock: A Progressive Benchmark for Physical Understanding and Planning via 3D Block Assembly'
authors:
- Liang Ma
- Jiajun Wen
- Min Lin
- Rongtao Xu
- Xiwen Liang
- Bingqian Lin
- Jun Ma
- Yongxin Wang
- Ziming Wei
- Haokun Lin
- Mingfei Han
- Meng Cao
- Bokui Chen
- Ivan Laptev
- Xiaodan Liang
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/9e97206b14d09c0da5c7fea47a67c6ac-Abstract-Datasets_and_Benchmarks_Track.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/9e97206b14d09c0da5c7fea47a67c6ac-Abstract-Datasets_and_Benchmarks_Track.html
institutions:
- Mohamed bin Zayed University of Artificial Intelligence
- Tsinghua Shenzhen International Graduate School, Tsinghua University
- Shenzhen Campus of Sun Yat-sen University
- Spatialtemporal AI
- Shanghai Jiao Tong University
scope: study
paper_type: benchmark
problem_families:
- Planning
- Constraint Satisfaction
problems:
- 3D Block Assembly
summary: A simulation benchmark diagnoses block selection, support-dependent assembly order and physical VQA, using
  400 assembly scenes and 2200 questions.
code_url: https://github.com/PhyBlock/PhyBlock
---

# PhyBlock: A Progressive Benchmark for Physical Understanding and Planning via 3D Block Assembly

> **TL;DR:** PhyBlock evaluates existing vision-language models on 400 simulated assembly scenes and 2,200 physical VQA questions. Models select oriented block candidates and order them under annotated support dependencies; precise coordinates, motor control and real-robot execution are outside the evaluated task.

## Motivation

Recognizing objects does not ensure that a model understands their support relations or can plan a physically sensible construction sequence. The benchmark combines controlled block assemblies with targeted questions to distinguish perceptual, spatial and multi-step planning weaknesses (Sections 1-3).

## Contributions

The benchmark contains four assembly difficulty levels, from basic candidate recognition to structures with up to 22 blocks, plus four VQA groups with 16 subtasks: object properties, object relationships, scene understanding and dynamic reasoning. An Activity-on-Vertex dependency graph supports partial-credit scoring and error diagnosis. This is a benchmark of pretrained models, rather than a newly trained neural optimizer or a demonstrated shared generalist solving policy.

Eight geometric block assets in five colors are modeled in Blender and rendered with Genesis. The authors manually construct 150 core scenes and augment them to 400. Appendix A.2 reports 36/121/138/119 level memberships and explicitly notes overlap between Levels 1 and 2; these counts are not four disjoint splits. Static VQA uses GPT-4o generation followed by human review; dynamic questions use simulated block removal and rendered outcomes with additional human verification.

## Methodology

The input includes a target image, a dictionary of candidate blocks shown at specified orientations, and instructions. One-time planning emits the full block-ID sequence. Step-by-step planning receives updated simulated observations and action history and emits `Move(id)` or `Done`. Candidate indices may be repeated, but models cannot rotate a candidate; they must select an appropriately oriented one (Appendix B.4). Exact 3D pose prediction was abandoned after unsuccessful pilots, as explained in Appendix E.4.

The AOV evaluator greedily matches each proposed block to an unplaced target block with matching attributes whose prerequisites have already been placed. Correct matches are TP, unmatched predictions FP, and remaining target blocks FN; micro precision, recall and F1 aggregate these counts. The strict setting matches type, color and Euler orientation; a relaxed diagnostic ignores orientation. The inspected public implementation checks annotated dependencies rather than predicting placement coordinates or executing a robot. Its basic Level-1 routine also omits dependency ordering and uses type/color matching.

VQA uses answer accuracy, including image-option questions and permutation ordering. Ordering has a different random baseline from ordinary four-choice questions. The evaluation does not minimize action count or establish that a correct plan is an optimal combinatorial solution.

## Experiments

In Table 1's one-time planning comparison, Claude-3.7 Sonnet has 47.4% overall F1, with 76.8% at Level 1 and 41.8% at Level 4. Its thinking variant has 47.1% overall F1. This is a narrow comparison of the evaluated variants, rather than proof that additional reasoning never helps. GPT-o1's overall F1 changes from about 43.36% to 80.96% when the evaluator ignores orientation (Figure 3); that change relaxes the scoring criterion rather than improving the generated plan.

Table 2 reports GPT-o3's 70.0% overall VQA accuracy, including 82.0% for object properties and 64.3% for dynamic reasoning, versus a 24.1% overall random baseline. Table 3 separately evaluates four step-by-step systems: Qwen2.5-VL-72B-Instruct reaches 52.1% F1, GPT-4o 22.8%, Qwen-VL-Max 28.2%, and Claude-3.7 Sonnet-Thinking 35.6%. These use interactive observations and a different model subset from the main table.

Appendix D adds five-seed results for three models: overall F1 is 39.73 +/- 1.1 for GPT-4.1, 20.40 +/- 1.2 for Qwen2.5-VL-7B-Instruct and 23.27 +/- 1.2 for Cosmos-Reason1-7B. Thus, some supplementary results include variation even though the main tables are point estimates. The reported 20-person human study averages about 94.7% over a 400-task mixture; it is an empirical reference, not a mathematical upper bound or a directly interchangeable assembly micro-F1 score.

## Limitations

The setting uses simple assets, four canonical viewpoints and annotated support graphs, and does not systematically assess VLA models, grasping, trajectory optimization, hardware execution or sim-to-real transfer. Related augmented scenes and overlapping difficulty memberships also limit interpretations of cross-level transfer. Million-scene expansion and precise-pose planning are proposed extensions, rather than demonstrated benchmark scale or solver capabilities. The size-performance plot is observational and does not establish a universal 100B-parameter threshold for physical reasoning.

### Curator Notes

Model counts vary across the source: 23 in the abstract, 21 in the contribution summary and 25 in the setup/limitations, while the tables use distinct subsets. We identify each reported experiment rather than treating these as one consistent comparison count. The PDF also includes two checklists with different compute-resource and IRB answers; its claims of no human participants conflict with the reported human study and manual annotation. These disclosure inconsistencies should be checked against the authors' underlying records, without inferring an unreported approval status.

## Reproducibility

- [NeurIPS 2025 Datasets and Benchmarks publication](https://proceedings.neurips.cc/paper_files/paper/2025/hash/9e97206b14d09c0da5c7fea47a67c6ac-Abstract-Datasets_and_Benchmarks_Track.html): the complete 49-page proceedings PDF includes references, both checklists and Appendices A-F. No separate publisher supplementary download is listed.
- [Official code](https://github.com/PhyBlock/PhyBlock), [documentation](https://phyblock-documentation.readthedocs.io/en/latest/evaluation.html) and [dataset](https://huggingface.co/datasets/PhyBlock/PhyBlock_Benchmark) are linked by the project. At inspected commit `da81ed9cad8184509aadb6f01af83d53e5c9d6fa`, the repository supplies scene/candidate annotations, model outputs, inference scripts and evaluation code. Local paths in the evaluation entry point require configuration; no pinned requirements file was identified in its tree. The full benchmark was not rerun.
- Eight README GIF demonstrations and a short asset MP4 were inspected using time samples spanning their durations, with hashes, duration and audio status retained in the audit cache. They show simulated assembly/assets and provide no real-robot validation. Both OpenReview API versions for `z6WfQ43sHr` returned 403; no explicitly referenced missing scientific document was identified.
- The 15-author byline and five affiliations were checked against the PDF, including capitalization of Haokun Lin. All 62 references and body citations were inspected; none matched an existing catalog paper, so no internal citation edge was inferred from general similarities.
