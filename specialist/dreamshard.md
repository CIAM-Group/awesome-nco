---
id: dreamshard
short_title: DreamShard
title: 'DreamShard: Generalizable Embedding Table Placement for Recommender Systems'
authors:
- Daochen Zha
- Louis Feng
- Qiaoyu Tan
- Zirui Liu
- Kwei-Herng Lai
- Bhargav Bhushanam
- Yuandong Tian
- Arun Kejariwal
- Xia Hu
year: 2022
date: '2022-12-06'
publication:
  date: '2022-12-06'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/62302a24b04589f9f9cdd5b02c344b6c-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2022/hash/62302a24b04589f9f9cdd5b02c344b6c-Abstract-Conference.html
institutions:
- Rice University
- Meta
- Texas A&M University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Embedding Table Placement
summary: A fusion-aware neural cost model supplies an estimated environment for sequential
  embedding-table placement, transferring across table sets and device counts within
  the same placement problem.
code_url: https://github.com/daochenzha/dreamshard
---

# DreamShard: Generalizable Embedding Table Placement for Recommender Systems

> **TL;DR:** Learn fused embedding-operation costs, then train a sequential GPU-placement policy mainly in that estimated environment. The same policy handles new tables and device counts; real GPU measurements still train the cost model, and generalization stays within embedding-table placement.

## Motivation

Distributed recommendation models place entire embedding tables on devices subject to GPU memory capacity. Both embedding computation and all-to-all communication can become bottlenecks. Fusing several tables into one FBGEMM operation has a nonlinear cost, so summing isolated table costs or balancing only table size/dimension can miss good placements. Measuring every policy rollout on real GPUs is also expensive. The paper addresses these two costs with a learned model of the embedding computation/communication pipeline.

## Contributions

DreamShard combines a neural cost estimator with a policy trained in an estimated placement environment. Shared table encoders, sum reductions over tables and a max reduction over device representations accommodate variable input sizes. A shared per-device policy head permits transfer across table combinations, unseen tables and device counts without fine-tuning. Ablations and supplementary industrial tests examine the importance of fusion-aware prediction, cost features and scalable deployment.

This is a **specialist/constructive** solver. The policy sequentially assigns whole tables to identical GPUs for one native embedding-placement problem. Reusing its checkpoint across different numbers of tables/devices does not demonstrate a shared solver for several distinct combinatorial problems. Heterogeneous CPU/GPU devices, tiered memory and arbitrary cluster topologies are outside the demonstrated main formulation (PDF3/10).

## Methodology

Each table has21features: dimension, hash size, mean pooling factor, memory size and17access-frequency histogram bins. The state contains the tables already assigned to each device, augmented by predicted forward computation, backward computation and backward communication costs. Forward communication is excluded from the cost-feature vector because its measured time includes waiting for other devices. The action selects a device with sufficient remaining memory for the current table. Tables are processed in descending predicted single-table cost; intermediate reward is zero and terminal reward is the negative predicted embedding cost. Local memory masking protects accepted assignments but does not establish optimality or a general completion theorem.

The cost network maps table features through a21-128-32MLP and sums table representations per device. Three32-64-1heads predict the device costs; a max over device representations followed by another head predicts the total placement cost. The independent policy table encoder has the same dimensions; it combines its summed representation with a3-64-32cost-feature encoder and applies a shared64-1device head followed by softmax over legal devices (PDF4-5; supplementary PDF7-11).

Training alternates real placement measurements, cost-model MSE updates and policy-gradient episodes using predicted states/rewards. The stated10iterations collect10real placements each, perform300cost updates with batch64, and perform10policy updates of10episodes per iteration. Adam starts at0.0005with linear learning-rate decay and entropy weight0.001. Discount factor is1for the sparse terminal reward. Real GPU execution is avoided in the simulated policy-update and inference stages, not in collecting cost-model data. Inference greedily chooses the highest-scoring legal device. GPU cost benchmarking uses5warm-up and10timed repetitions with median latency.

## Experiments

The main comparisons use856public synthetic DLRM tables and private production tables, with four/eight-GPU DLRM and two/four/eight-GPU production tasks. The synthetic preprocessing fixes table dimension to16; production dimensions range from4to768. Disjoint halves of the table pool supply50training and50test placement tasks, and reported results average five independent repetitions with standard deviations. These experiments primarily measure embedding-pipeline latency rather than recommendation accuracy or full training throughput.

For Prod80tables/eight GPUs, Table1reports35.2±0.8ms versus41.9±0.1ms for the strongest dimension heuristic: about19%higher throughput, equivalently about16%lower latency. DLRM100tables/four GPUs improves more modestly,77.8±0.8ms versus79.5±0.3ms. Some rows tie rather than strictly improve. Removing predicted cost features degrades DLRM50/four-GPU test latency from40.4to46.3ms; removing pooling-factor features yields47.2ms. Adding an RNN gives40.5ms, with no clear benefit there.

The same source-task checkpoint is applied to new table/device counts without fine-tuning. Table2includes20-to100tables on four GPUs at77.9±0.4ms versus77.8±0.8ms for target-trained DreamShard. However, the supplementary tables qualify the headline transfer claim:10tables/two GPUs transferred to40tables/four GPUs yields33.8±0.7ms versus32.4±0.3ms for target training, a1.4ms gap. Supplementary Table7also contains small two-GPU cases where a heuristic is slightly faster, and Figure27shows one such per-instance failure.

**Separate industrial scale test.** Supplementary Table13uses nearly1,000tables, multiple terabytes of memory and128GPUs, and does measure overall training throughput including dense computation/data loading. It reports45.3%improvement over random placement versus13.9%for the strongest heuristic, equivalent to about27.6%relative throughput improvement over that heuristic. Its embedding cost is61.59ms versus90.8ms for that heuristic. The RNN baseline is excluded from this industrial table because the authors report unstable behavior. These private deployment results are distinct from the main microbenchmarks and their five-repeat protocol.

## Limitations

The cost estimator is hardware, kernel and workload dependent; the study provides empirical accuracy and transfer results, not a uniform placement-regret or optimality bound. A good cost-model fit does not certify the best discrete assignment. The public synthetic data has fixed dimensions and is smaller than the private deployment workload. Industrial data and the128-GPU experiment are not fully reproducible from the public files. Two-GPU and mixed-transfer exceptions preclude a universal superiority or sub0.5ms transfer-loss claim.

### Curator Analysis

The printed policy loss in supplementary Equation2uses a positive log-probability-times-return term while describing gradient descent; the released implementation instead minimizes negative log-probability weighted by standardized terminal reward, plus negative entropy. The implementation should be consulted when reproducing the update rather than silently treating those signs as identical. This is a paper/code distinction, not evidence that the reported experiments fail.

The pinned release filters observations to legal devices when sampling, but stores the original observations and recomputes the NLL over all device logits during `train_rl`. When the capacity mask excludes a device, that replay probability differs from the conditional probability used to sample. For two zero logits with only device0legal, conditional NLL has gradient(0,0), while the full two-device NLL has gradient(-0.5,0.5). A local PyTorch primitive check confirms this normalization difference; it does not reproduce the full standardized-reward training loop or establish its impact on any published result. Main PDF8names1080Ti for the training-time plot whereas supplementary B.6names2080Ti for DLRM hardware, so the precise hardware attribution of that timing is not silently reconciled.

## Reproducibility

- All14pages of the [formal paper](https://proceedings.neurips.cc/paper_files/paper/2022/file/62302a24b04589f9f9cdd5b02c344b6c-Paper-Conference.pdf) and26pages of the [separate scientific supplement](https://proceedings.neurips.cc/paper_files/paper/2022/file/62302a24b04589f9f9cdd5b02c344b6c-Supplemental-Conference.pdf) were read, including all references, AppendicesA-L and the checklist. Key architecture, loss, result, transfer and case-study pages were rendered and visually checked. The publisher verifies the nine authors, NeurIPS35main-conference publication and DOI10.52202/068431-1105; its citation metadata supplies December6,2022. PDF1lists Rice University, Meta Platforms and Texas A&M University.
- Manual publisher inspection finds the paper and separate supplemental PDF, both fully covered, with no additional scientific ZIP. Exact-title queries to OpenReview APIv1/v2returned403; no unavailable scientific attachment is explicitly required by the read article. The [official code](https://github.com/daochenzha/dreamshard) was inspected at commit`73128edfd02576c96adcfacd8622ef5855061708`:20files, no scientific PDF/ZIP or pretrained checkpoint. The README describes generating public DLRM tables/tasks, installing FBGEMM and running training/evaluation; private production tables are not released there.
- The full current model, environment, training, sharder, evaluation and task-generation files, and the embedding benchmark implementation were read. They confirm independent policy/cost table encoders, disjoint randomized train/test table pools,100real cost-collection placements under defaults, and greedy legal-device inference. The public benchmark requires appropriate GPUs, PyTorch/FBGEMM and data. No full GPU training or benchmark table was rerun in this audit.
- The local conditional-softmax arithmetic and throughput conversions are saved in `research/full-text-review/dreamshard/recompute_mask_scope.py` and its JSON output. Six catalogue relations are supported by explicit body citations plus matching bibliography entries: the original RL device-placement paper, hierarchical placement, Spotlight, Placeto, POST and Bello's neural combinatorial optimization paper. Other related-work titles without an existing catalogue ID do not receive fabricated edges.
