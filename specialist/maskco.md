---
id: maskco
short_title: MaskCO
title: 'MaskCO: Masked Generation Drives Effective Representation Learning and Exploiting for Combinatorial Optimization'
authors:
- Lvda Chen
- Yang Li
- Junchi Yan
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/d85816bf41e54d9b0847e02249f4fcc6-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/d85816bf41e54d9b0847e02249f4fcc6-Abstract-Conference.html
institutions:
- Shanghai Jiao Tong University
- Shanghai Innovation Institute
scope: specialist
paper_type: solver
paradigm: constructive-improvement
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Maximum Independent Set
- Traveling Salesman Problem with Time Windows
summary: Reference-solution masked reconstruction trains task-specific models that construct and improve solutions;
  routing uses greedy insertion and2-opt, with additional TSPTW feasibility experiments.
code_url: https://github.com/Thinklab-SJTU/MaskCO
figure:
  path: paper-assets/maskco/framework.png
  alt: Original MaskCO Figure2 showing repeated incumbent masking, neural heatmap prediction and greedy reconstruction.
  caption: 'Figure2: original MaskCO mask-and-reconstruct inference process.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/file/d85816bf41e54d9b0847e02249f4fcc6-Paper-Conference.pdf#page=6
---

# MaskCO: Masked Generation Drives Effective Representation Learning and Exploiting for Combinatorial Optimization

> **TL;DR:** MaskCO learns to reconstruct a reference solution from arbitrary retained subsets. The resulting model can construct a solution and repeatedly mask/reconstruct an incumbent. Separate TSP, CVRP and MIS models show strong empirical tradeoffs; Appendix F also evaluates TSPTW. Reference generation, classical local search and feasibility handling remain material parts of the pipeline.

## Motivation

Whole-solution imitation and contiguous autoregressive training contexts underuse the many partial structures contained in a good solution. MaskCO creates multiple reconstruction tasks from each instance/reference pair, allowing training and inference to commit several globally ranked components per neural call. Its default “self-supervision” is **solution-level reconstruction**, which still requires supplied reference solutions. A separate heuristic-label/self-training experiment removes the need for optimal labels. [pp. 1–5, 10, 17–18]

## Contributions

- A masked selection objective with arbitrary retained subsets and no separate mask token: zero indicates a variable not yet selected.
- Multi-step greedy decoding plus a neural mask-and-reconstruct search that reuses partial candidate solutions.
- Reuse of the same learned representations with autoregressive, bidirectional, relaxed-AR and fine-tuned consistency decoding; experiments on heuristic-label self-training and constrained routing. [pp. 3–10, 17–18, 27–29]

## Methodology

A binary selection vector represents edges for routing or vertices for MIS. Training samples a retention ratio uniformly and retains components of a reference solution. The formal loss is variable-wise BCE against the **full** reference vector, including its retained components. The selection operator ranks model scores and adds components while preserving extendability. Its abstract definition assumes that this test is available; actual problem-specific decoding and relaxed CVRP handling supply the concrete implementation. [pp. 4–5, 17–18]

The formal model is a pre-normalized SwiGLU Transformer. Instance-only encoder features are cached; a decoder additionally conditions on the partial solution through adjacency bias. Node-selection logits use a scalar projection, while routing edge logits use embedding inner products. TSP uses width256 and 16 encoder/6 decoder layers; CVRP uses width512 and the same depths. MIS-RB/ER use width256 with 12/24 decoder layers and no separate instance-only encoder. [pp. 6–7, 18–20]

Starting from an empty partial solution, K neural calls progressively add high-confidence components under a linear cardinality schedule. MIS estimates target size from summed probabilities and uses greedy completion. After an initial construction, the algorithm keeps a fraction p of the current solution and reconstructs the rest over K calls. It advances the **current** candidate even when it worsens, while separately retaining the best objective found. T counts forward passes, giving roughly T/K construction/reconstruction cycles, rather than T complete independent solutions. [pp. 5–6, 20–21]

Routing experiments also use classical 2-opt between correction cycles. Default CVRP explores a capacity-relaxed space with penalties and records feasible candidates; the paper separately tests strict selection constraints. This distinction is important: the default hybrid pipeline's results do not establish feasibility solely from neural heatmaps. [pp. 7, 22–24]

**Classification:** Specialist / constructive–improvement. TSP, CVRP, MIS-RB and MIS-ER have separate architectures/checkpoints, and cross-size/domain tests reuse those task-specific weights. The neural model both constructs from an empty state and conditions on a masked incumbent to reconstruct it. The latter is a genuine neural improvement component, in addition to ordinary 2-opt. No shared cross-native-problem deployment is established. [pp. 3, 5–6, 20–24]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Routing data | Uniform unit-square locations; CVRP demands1–9 and capacity50 across sizes100/500/1,000 |
| TSP train/test counts | 1.28M training instances at100/500 and128K at1,000; test sets1,280/128/128 |
| CVRP train/test counts | 1.536M/200K/100K training;1,280/128/64 test instances |
| MIS data | RB200–300 and ER700–800,p(edge)=0.15;90,000/163,840 training and500/128 test instances |
| TSP inference K,p | (1,0.2), (1,0.2), (2,0.1) for100/500/1,000 |
| CVRP inference K,p | (2,0.3), (16,0.3), (128,0.6) |
| MIS inference K,p | RB(1,0.6), ER(1,0.5) |
| Hardware | One NVIDIA A100 and32-core Xeon Platinum8352S; traditional baselines are single-threaded |
| Training | Normally600 epochs; CVRP500/1,000:768; TSP1,000:300. Reported TSP training≤2/≤1/≤1 days |

- **TSP:** At T=320, gaps are0.0000%/0.0020%/0.0071% with total test-set times8/6/18 seconds. At T=2,560 they are0.0000%/0.0007%/0.0027%. Rounded zero gaps do not certify every instance optimal. The headline “>99%” reduction and “10×” speedup are selected neural-baseline comparisons, not a universal advantage over every method or budget. [p. 7]
- **CVRP:** At T=640, gaps are0.232%/0.813%/0.798% in32/21/44 seconds; at T=10,240 they are0.086%/0.448%/0.438% in8m17s/5m8s/7m33s. POMO is faster on CVRP100 at8 seconds, with worse gap1.287%. HGS remains the zero-gap reference at substantially greater runtime. [p. 8]
- **MIS:** T=32K reaches20.08 vertices on RB and44.59 on ER, with gaps0.10%/0.62%. KaMIS reports stronger objectives20.10/44.87; the contribution is a neural quality/runtime tradeoff. T=1K is much faster but less accurate at0.49%/3.73%. [p. 8]
- **Generalization:** TSPLIB mean gaps are0.033% for50–200 nodes and0.115% for201–1,000 using size100/500 weights and T=25,600. VRPLIB gaps are2.15%/3.87% for50–200/201–500 at T=40,960. Transfer is uneven: TSP100→1,000 gives4.707% at T=2,560 versus Fast T2T's3.87%, while MIS-RB→ER gives14.04% versus native ER training's0.62%. [pp. 8, 24]
- **Correction and feasibility ablations:** TSP500 at the same T=320 improves from0.0520% with one long construction to0.0020% with K=1 and repeated correction. Disabling inter-cycle2-opt in relaxed CVRP500/1,000 yields no finite feasible result in Table19; final-only postprocessing recovers solutions but is weaker. Strict selection without relaxation/2-opt remains feasible in Table21, with worse gaps0.717%/3.944%/4.370% at T=640. [pp. 8, 22–24]
- **Heuristic-label training:** Initial128-run2-opt labels give TSP500 gap6.994%; D0/D1/D2 models achieve0.362%/0.089%/0.059%. TSP1,000 starts with size500 transfer at0.733% and reaches0.295% after two self-training rounds. These experiments trade optimal labels for heuristic labeling, pseudo-label generation and fine-tuning compute. [pp. 10, 26–27]
- **TSPTW:** Appendix F.6 tests medium/hard50-node instances with three seeds and2-opt penalty200. At T=1,280, infeasible rates are0.027%/1.280%, and reported feasible-solution gaps against LKH are−1.425%/−0.640%. LKH's hard-case infeasible rate is lower at0.12%; POMO+PIP variants are faster at15 seconds. Negative gaps on feasible subsets do not establish universally feasible or optimal output. [pp. 27–29]

## Limitations

### Discussed in the Paper

- Label quality changes the best K,p settings; medium retention levels can be harder to learn. Hyperparameters are tuned by grid search, and adaptive retention schedules remain future work. Large CVRP labels have finite4/8-minute generation limits and can be noisy. [pp. 20, 22, 25–28]

### Curator Notes

- Runtime columns aggregate different test-set sizes and use GPU batching, multiple cycles and classical postprocessing. They are not uniform per-instance latency measurements. Some baseline values are quoted; SIT/CVRP1,000 was retrained for capacity50.
- Eq.3 describes independent BCE, while the checked JAX routing trainers use row-wise log-softmax cross-entropy; MIS's default sigmoid head uses BCE. Routing training samples Bernoulli retained components rather than fixing exactly the printed retained cardinality. The release also adds time embeddings and attention scaling/soft-capping choices beyond the simplified equations. These are documented implementation distinctions, not evidence that the reported benchmark results are invalid.
- Table15 attributes TSP100/500 training references to Concorde, but the release's data instructions/scripts use LKH-named files. This note keeps the reported dataset sizes and separates the paper's label attribution from the release's file provenance.
- TSPTW still has infeasible outputs. Hard-case violation, averaged only over infeasible solutions, rises from0.389 to0.411 as T increases320→1,280 while the infeasible rate falls. Those two metrics should be reported separately.
- Table3's RB/Gurobi objective19.98 and printed gap0.01% do not align with a simple gap to its shown KaMIS20.10 reference. The original value is not silently recomputed or used as an independent accuracy claim here.

## Reproducibility

- **Published source:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/d85816bf41e54d9b0847e02249f4fcc6-Abstract-Conference.html), dated2026-04-20. All29 pages, complete references, AppendicesA–F,27 tables,11 figures and full Algorithm1 were freshly read. All figures were visually inspected, including the eight K,p study plots and decoding sequence.
- **Scientific companion inventory:** The publisher and official event expose the paper, with no separate poster/slides/supplement link. OpenReview API access returned403 and is not counted as inspected content. The complete120-entry author tree and121-member source ZIP contain no extra scientific PDF, notebook, nested archive or video; both repository diagrams were checked against formal Figures1–2.
- **Implementation:** [Official JAX source](https://github.com/Thinklab-SJTU/MaskCO), commit29dc1cc29992f76f0864b376ba79f7d537dd09a5. The README, data instructions, routing/MIS loss branches, model/attention definitions, three inference loops and representative train/eval configurations were inspected. The release supports dynamic geometric augmentation, CPU greedy insertion and2-opt; the catalogue does not attribute those operations to the neural network alone.
- **Data/checkpoints:** The linked Hugging Face tree has38 entries and its short dataset card was read. The linked public Drive contains eight task/size-specific checkpoints and12 data files. Neither inventory exposes additional scientific prose; binary weights/data were inventoried rather than executed or treated as proof of the reported metrics. No training or benchmark reproduction was performed.
- **Figure:** The displayed image is original formal Figure2, showing successive incumbent masking, neural prediction and reconstruction.
