---
id: hsdag-placement
short_title: HSDAG
title: A Structure-Aware Framework for Learning Device Placements on Computation Graphs
authors:
- Shukai Duan
- Heng Ping
- Nikos Kanakaris
- Xiongye Xiao
- Panagiotis Kyriakis
- Nesreen K. Ahmed
- Peiyu Zhang
- Guixiang Ma
- Mihai Capotă
- Shahin Nazarian
- Theodore L. Willke
- Paul Bogdan
year: 2024
date: '2024-12-16'
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/94bd1b8c906494bada774096bd0fdd73-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/94bd1b8c906494bada774096bd0fdd73-Abstract-Conference.html
institutions:
- University of Southern California
- Meta
- Cisco Outshift
- Intel Labs
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
problems:
- Device Placement
summary: OpenVINO computation-graph coarsening, graph-parsing representations and
  latency-reward placement search combine grouping with encoding; hardware-specific
  results and released feature/configuration differences limit broad claims.
code_url: https://github.com/hping666/HSDAG
---

# A Structure-Aware Framework for Learning Device Placements on Computation Graphs

> **TL;DR:** HSDAG combines OpenVINO graph construction, structural features, learned graph parsing and a placement policy trained with measured inference latency. Its three-model Intel CPU/dGPU results favor the method, while the headline percentages use CPU latency as their reference and the released default is not the complete printed configuration.

## Motivation

Computation-graph device placement assigns neural operations to hardware to reduce inference time. Grouper-placer methods explicitly coarsen operations before allocation; encoder-placer methods learn operation representations. The paper seeks to combine these ideas with a graph representation that retains information about directed acyclic structure, avoiding some of the cost of searching a large fine-grained graph. This is optimization of where a pretrained neural workload executes, rather than training that workload for better prediction accuracy.

## Contributions

HSDAG is a five-stage framework: computation-graph construction, feature extraction, joint representation/group learning, device assignment and real-runtime reward feedback. Its graph-parsing variant uses learned edge affinities to choose a variable number of groups. Experiments cover Inception-V3, ResNet-50and base-uncased BERT, with placement baselines, feature ablations and limited downstream-output sanity checks.

This is a **specialist/constructive** device-placement solver. Each candidate assigns grouped operations to devices and expands that assignment to original operations. The three workload graphs are separately optimized using their hardware runtime feedback; no shared checkpoint solving several native combinatorial problems or demonstrated zero-shot placement across these workloads is established. Repeated candidate evaluation is part of the search/training budget.

## Methodology

OpenVINO produces a smaller operation DAG than the fine-grained alternatives considered by the authors. A co-location heuristic additionally merges a node with its sole child when that child has only that parent. The formal features combine operation-type, in/out-degree and output-shape information with topological position/positional encoding and node fractal-dimension estimates. A GNN encoder enriches the representation, and a sigmoid edge network scores pairs using their embedding interaction (Equations3-7).

Dominant-edge selection and graph parsing turn those scores into hard groups. A node-to-group matrix maps the coarsened representation and its adjacency to the original graph. An MLPsamples a device for each group; the assignment is expanded and executed with OpenVINO. Reward is inverse measured latency. Group embeddings are added back to node features for subsequent exploration, and a REINFORCE-style loss updates the policy from a buffer. These equations define a heuristic training procedure, not an optimality or convergence guarantee.

AppendixHreports128hidden channels, two transform/GNN/parsing layers, GCN, network dropout0.2, parsing dropout0, Adam learning rate0.0001,100episodes,20exploration steps and four policy updates. The available hardware includes an i9-12900K CPU, Intel UHD770iGPU and Flex170dGPU with64GBRAM, but the limitations explicitly exclude the iGPUfrom the actual experiment; the implemented placement choices are CPUand GPU.1. OpenVINO version is2023.3.0.

## Experiments

The OpenVINO graphs have728nodes/764edges for Inception-V3,396/411for ResNet and1,009/1,071for BERT. The method reports10.5ms versus CPU12.8ms/GPU12.0ms on Inception,7.66ms versus CPU16.0ms/GPU7.81ms on ResNet, and2.67ms versus CPU6.38ms/GPU2.77ms on BERT. Table2's “Speedup%” is numerically a latency reduction relative to CPU:17.9%,52.1%and58.2%. For BERT, the displayed values instead imply about3.61%latency reduction relative to the fastest GPU-only baseline. The abstract's60.24%comparison is not silently substituted for the rounded table's raw values.

Placement latency is measured ten times, averaging the last five. These are repeated executions of a fixed placement, not identified independent policy-training seeds or confidence intervals. The authors state that critical results were reproduced at least twice in their setup, but the tables do not report training-seed variability. RNNand Placeto baselines are the authors' adaptations/reimplementations on OpenVINO, and the RNN BERTcase is out of memory.

Removing output shape or node IDraises Inception latency to11.7ms; removing the combined structural features gives10.9ms. Changes for ResNet are small, and removing structural features ties the displayed full result7.66ms. Thus the ablations do not show a uniform gain from every feature on every model. Table5reports total placement-method runtimes of2454/1047/2765s versus Placeto2808/1162/4512s; these measurements are an empirical search/training-cost comparison, not an asymptotic-complexity theorem.

Downstream checks use a Samoyed-image classification example and BERToutput-embedding comparisons. BERTcosine similarity is reported as0.999across device comparisons, with nonzero MSE/L2differences. These limited examples support approximate preservation in the tested cases, not identical outputs or a general accuracy-preservation theorem.

## Limitations

Results depend on OpenVINO conversion, hardware-specific compilation/communication and the selected workload/input. The paper acknowledges uncontrolled thermal effects, using the CPUfor both policy and workload, excluding the iGPUand reimplementing baselines without their original authors' code. Runtime feedback is still costly; broader generalization and learned reward models are future work. Arbitrary device counts, new hardware and full workloads beyond these three optimized graphs require evaluation.

### Curator Analysis

The hard partition ranking is not a differentiable random grouping distribution merely because edge scores are learned. However, the actual code multiplies pooled embeddings by continuous within-group score/link-count factors, so the presence of argmaxdoes not imply that all parsing-network gradients vanish. The released GPNalso symmetrizes adjacency before graph convolutions: DAGdirection is therefore not preserved as directed message passing in that component; node/order features carry distinct structural information.

Both the publisher code and pinned GitHubdefault have the same core files. Their active `main.py`feature vector contains averaged operation-type indicators plus a numeric node ID; output-shape concatenation and fractal-feature branches are commented. The current defaults are learning rate0.001,25episodes and K_epochs5, versus0.0001/100/4in Table6. The code computes one buffer-wide discounted reward sum and weights concatenated log-probabilities by it; it should not be silently equated with a separately weighted per-step version of printed Equation14.

The original `sim_runtime` also returns1e10before inference for assignments that place all operations on CPUor all on GPU. A local execution of that unmodified early-return method confirms both cases, using a minimal model stub and no OpenVINO. Thus this release's candidate search explicitly discourages homogeneous placements even though the paper evaluates them as feasible baselines. These are reproducibility qualifications for the inspected release; no full hardware benchmark or historical-result invalidation is claimed.

## Reproducibility

- All25pages of the [formal NeurIPS2024paper](https://proceedings.neurips.cc/paper_files/paper/2024/file/94bd1b8c906494bada774096bd0fdd73-Paper-Conference.pdf) were read, including all33references, AppendicesA-H, both pseudocode algorithms, six tables and the complete checklist. Eight key pages were rendered and checked for the full pipeline, grouping equations, latency/ablation/results, graph examples and hyperparameters. Publisher metadata verifies the12authors in formal order, including Mihai Capotă, affiliations USC/Meta/Cisco Outshift/Intel Labs, December16,2024publication and DOI10.52202/079017-2597.
- The [publisher supplement](https://proceedings.neurips.cc/paper_files/paper/2024/file/94bd1b8c906494bada774096bd0fdd73-Supplemental-Conference.zip) was downloaded and recursively inventoried, including its nested Placeto archive. Its318entries contain code/notebooks/configuration and metadata, with no additional scientific PDF. Main and baseline READMEinstructions were read; AppleDouble resource files are not treated as real nested ZIPs. Exact-title queries to both OpenReview APIsreturned403; no separately required scientific text is explicitly missing from the complete integrated version.
- The [official repository](https://github.com/hping666/HSDAG), verified in AppendixA, was inspected at`9d5caf7770cd50f975e014d19920873c112df095`. It has23files, no scientific PDFor pretrained placement checkpoint. The full README, configuration, GPNmodel/parsing layer and the relevant feature, training and OpenVINOexecution code were read. Core`main.py`, `model.py`, `layer.py`and`config.py`match the publisher archive after newline normalization. The READMErequires supplying the OpenVINOXMLmodel and matching inputs; the active example uses an Inception-shaped(1,3,299,299)input while BERTbranches are commented.
- The local original-method early-return execution, source hashes, archive comparisons and raw-table percentage conversions are saved in `research/full-text-review/hsdag-placement/recompute_release.py` and its JSONoutput. OpenVINO/PyG/torch_sparse were unavailable locally, so this audit does not claim a complete neural or hardware rerun. Three relationships have explicit body and full-reference evidence: Placeto, hierarchical device placement and the original RLdevice-placement paper.
