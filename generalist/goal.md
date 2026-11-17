---
id: goal
short_title: GOAL
title: 'GOAL: A Generalist Combinatorial Optimization Agent Learner'
authors:
- Darko Drakulić
- Sofia Michel
- Jean-Marc Andreoli
year: 2025
date: '2024-06-21'
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/826aea2253363fe04e8c4991b2a8869e-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2406.15079
code_url: https://github.com/naver/goal-co
institutions:
- NAVER LABS Europe
scope: generalist
paradigm: constructive
problem_families:
- Routing
- Scheduling
- Packing
- Graph Optimization
problems:
- Asymmetric Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Capacitated Vehicle Routing Problem with Time Windows
- Orienteering Problem
- Job Shop Scheduling Problem
- Unrelated Machine Scheduling Problem
- Knapsack Problem
- Minimum Vertex Cover
- Traveling Repairman Problem
- Prize-Collecting Traveling Salesman Problem
- Open Capacitated Vehicle Routing Problem
- Split-Delivery Capacitated Vehicle Routing Problem
- Sequential Ordering Problem
- Maximum Coverage Location Problem
- Maximum Independent Set
- Open Shop Scheduling Problem
summary: One mixed-attention backbone and lightweight task adapters jointly learn eight routing, scheduling, packing
  and graph problems; eight further native tasks require supervised or self-labeling adaptation.
figure:
  path: paper-assets/goal/framework.png
  alt: GOAL shared codebooks, mixed attention and tied multi-type blocks with task-specific input/output adapters.
  caption: 'Figure 1: GOAL architectures for single-type and multi-type problems; formal ICLR version.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/826aea2253363fe04e8c4991b2a8869e-Paper-Conference.pdf#page=4
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/826aea2253363fe04e8c4991b2a8869e-Abstract-Conference.html
---

# GOAL: A Generalist Combinatorial Optimization Agent Learner

> **TL;DR:** One shared Transformer backbone learns eight routing, scheduling, packing and graph tasks through small task-specific adapters. Mixed node/edge attention and shared parameters across node types support this breadth; eight further tasks require new adapters and supervised or self-labeling fine-tuning.

## Motivation

Neural solvers often specialize their architecture and weights to one problem. GOAL asks whether task sharing can extend beyond structurally similar routing variants. The challenge is to accommodate different node, edge and global features and heterogeneous entities, while learning representations useful for adapting to new task interfaces.

## Contributions

- A single backbone trains jointly on ATSP, CVRP, CVRPTW, orienteering, knapsack, vertex cover, job-shop scheduling and unrelated-machine scheduling.
- Mixed attention incorporates edge features into both keys and queries, while task-specific low-rank input adapters feed a shared codebook.
- A multi-type architecture reuses the same layer parameters for meaningful self- and cross-attention blocks, such as operations and machines.
- Experiments compare shared and individual-task policies, target-task fine-tuning, architecture ablations and larger-instance transfer.

## Methodology

**Construction/interface.** GOAL uses the BQ-MDP representation: a residual instance encodes the state, and an action usually selects a node, sometimes with a task-specific option such as direct travel or via-depot travel. Input/output adapters, state updates and feasibility masks remain task-specific. Global features can be replicated at nodes. Relational information is supplied through edge features; random node identifiers break otherwise indistinguishable representations. The policy constructs solutions sequentially. Sampling better teacher trajectories during training is not neural editing of a complete test-time incumbent, so the primary paradigm remains constructive.

**Backbone.** Nine layers use node/edge embedding width 128, feed-forward width 512, eight attention heads and ReZero normalization. Task adapters first project node/edge features to dimensions eight/four, then shared codebooks map these to full embeddings. Attention scores use the inner product of node-plus-edge query and key projections. For heterogeneous problems, different type pairs invoke the same learned mixed-attention block rather than separate task-specific backbones. The backbone has approximately 2.1 million parameters, with a few thousand adapter parameters per task. Low rank is an architectural bias toward sharing; the empirical ablation is not a theorem ruling out task specialization.

**Learning and new tasks.** Behavioral cloning samples a task and suffix subproblems from high-quality expert trajectories. Ordered trajectories use a single target action; unordered knapsack/vertex-cover solutions use a multi-action target loss. The actual eight-task shared checkpoint supports the generalist label. For new tasks, input/output adapters are learned from scratch and full-backbone fine-tuning is the main setting, with frozen-backbone variants separately compared. Self-labeling adaptation samples 128 candidate solutions per instance and imitates a sufficiently improved best trajectory. These adapted policies do not establish arbitrary new-task zero-shot ability; the paper explicitly requires seeing each task's interface in training or fine-tuning.

## Experiments

- **Training/budget:** Each of eight tasks has one million generated, oracle-solved instances. Typical size is 100 nodes, JSSP is 10 by 10 and unrelated-machine scheduling is 100 jobs by twenty machines. AdamW starts at 0.0005 with a factor 0.97 every ten epochs. The paper reports batch size 256, about 400 epochs and seven days on eight V100 GPUs. Model selection uses 128 validation instances per task. Generating expert solutions is additional offline work.
- **Reference/test protocol:** Main results use 128 test instances per task and report runtimes over the set, not milliseconds per instance. References include LKH, HGS, an orienteering evolutionary solver, OR-Tools and FastWVC; several are heuristic or finite-budget references. The UMSP oracle is called HiGHS in the main protocol but OR-Tools in Appendix F.15, an unresolved source discrepancy. The mostly greedy neural comparison has an explicit exception: COMPASS scheduling numbers use substantial search, marked in Table 2 despite the main text's blanket greedy wording.
- **Shared versus specialist quality:** At size 100, individual/shared GOAL gaps are 0.30/0.91% for ATSP, 2.34/3.16% for CVRP, 2.61/3.82% for CVRPTW and 2.73/4.13% for JSSP. Single-task GOAL is best or tied among the selected neural rows on seven tasks, but this is not a claim about the shared model universally beating specialists. POMO's CVRP gap 1.21% beats both GOAL versions; BQ-NCO's OP gap 0.22% beats shared GOAL's 0.43%. The single-task OP gap of -0.04% improves a heuristic reference, rather than disproving an optimality certificate.
- **Eight target tasks:** TRP, PCTSP, open CVRP, split-delivery CVRP, SOP, maximum coverage location, maximum independent set and open-shop scheduling are adapted separately. Supervised adaptation uses 128 solved examples and takes minutes; self-labeling takes hours and includes the 128-sample teacher budget. The main curves show best results over ten runs, not mean outcomes or confidence bounds. Example reported self-labeling endpoints are TRP 0.92%, PCTSP 4.88%, open CVRP 8.49%, split delivery 9.38%, SOP 0.11%, coverage 2.92%, MIS 0.39% and open-shop 3.90%, each relative to its reference. Backbone freezing and the stronger full fine-tuning curves remain distinct.
- **Ablations/scaling:** Mixed attention, multi-type processing and codebooks are tested with smaller 100,000-instance datasets; the multi-type JSSP ablation reaches about 4.6% versus 8.9% after 200 epochs. The codebook improves adaptation stability, while the text does not clearly define its printed “confidence interval of 100.” Larger-instance tests have mixed outcomes: ATSP1000 gap is 1.96% versus BQ-NCO's 8.09%, but CVRP1000 is 7.37% versus 5.88%; OP1000 reaches 15.62%, KP1000 2.59% versus BQ-NCO's 0.92%, and JSSP20x15 reaches 22.53% versus COMPASS's 10.40% under hours of search. These are size-transfer results on known tasks, distinct from new-task adaptation.

## Limitations

The eight new tasks need adapter training and usually backbone updates. Handwritten representations, transitions, masks and trajectory conventions are part of the method. The framework requires problems whose feasible solutions can be built incrementally with manageable feasibility checks. Dense attention is quadratic, and the authors regard sizes beyond roughly a thousand as expensive without additional heuristics. Oracle labels, seven-day pretraining and best-of-ten adaptation outcomes limit simple claims of training-free universality or uniform efficiency.

**Version/current-code qualifications:** The formal paper correctly defines **maximum** independent set; the arXiv v3 manuscript and README sometimes use “maximal” while optimizing cardinality. UMSP is **unrelated** machine scheduling, not uniform-machine scheduling as previously tagged. In the current generator, MIS self-labeling uses fixed edge probability 0.15 rather than the appendix's sampled 0.05–0.15. PCTSP uses prizes uniform in [0,4/N] and penalties in [0,0.12], differing from the literal sampling/scaling formula printed in Appendix F.11. These observations concern the inspected release and do not identify which historical revision produced each result. Although a test-dataset argument is passed through the self-labeling pipeline, the inspected generator creates fresh random instances and does not use that argument; this alone is not evidence of training on test instances. Output-adapter initialization is selected on eight freshly generated instances. No end-to-end reproduction was run.

## Reproducibility

- **Full text/supplements:** Freshly read all twenty-two pages of arXiv v3, all twenty-four pages of the formal ICLR 2025 proceedings, including complete references and Appendices A–F in both, and all sixteen official presentation slides: sixty-two registered source pages in total. All scientific slides, model diagrams, result tables and curves were rendered/read. The formal version renumbers the architecture as Figure 1; its original complete figure and caption now replace the manuscript crop.
- **Metadata:** [The proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/826aea2253363fe04e8c4991b2a8869e-Abstract-Conference.html) verify the ICLR 2025 publication, three authors and NAVER LABS Europe. [arXiv history](https://arxiv.org/abs/2406.15079) verifies first submission on 21 June 2024 and v3 on 25 February 2025. The old generic conference-notification date is removed; no paper-specific acceptance day is asserted. The author name Drakulić follows the formal byline.
- **Code:** [naver/goal-co](https://github.com/naver/goal-co) includes pretrained weights, test/fine-tuning data, problem decoders and a training-data download link. The 136-member archive has no additional PDF, notebook, nested archive or video. README, argument defaults, mixed-attention implementation, full tuner and relevant instance/trajectory generators were inspected. Default batch size 128 differs from the reported 256; defaults are not treated as a complete published configuration. The official sixteen-slide conference file is separately SHA-registered and fully covered in the reading log.
- **Relations:** Exact bibliography titles and author/preprint identities are matched to catalogue papers, including the SIL preprint precursor mapped to its later formal representative with manuscript-comparison evidence. Uncatalogued representation papers, generalist control agents and literature surveys do not create invented solver edges.
