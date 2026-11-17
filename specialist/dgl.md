---
id: dgl
short_title: DGL
title: 'DGL: Dynamic Global-Local Information Aggregation for Scalable VRP Generalization with Self-Improvement
  Learning'
authors:
- Yubin Xiao
- Yuesong Wu
- Rui Cao
- Di Wang
- Zhiguang Cao
- Xuan Wu
- Peng Zhao
- Yuanshu Li
- You Zhou
- Yuan Jiang
year: 2025
date: '2025'
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2025/964
code_url: https://github.com/wuyuesong/DGL
institutions:
- Jilin University
- Nanyang Technological University
- Singapore Management University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A local autoregressive constructor recomputes compact global distance/direction features while choosing
  nearest unvisited candidates, trained through best-of-sampling self-imitation with instance replacement; official
  later results correct an unfair ELG configuration.
publication:
  date: '2025'
  source_url: https://www.ijcai.org/proceedings/2025/964
figure:
  path: paper-assets/dgl/framework.png
  alt: DGL dynamically combines coordinates, directions and global-distance summaries for local candidates; sampled
    better solutions train the policy with augmentation and random instance replacement.
  caption: 'Figure 2: DGL construction and replacement-based self-improvement training.'
  source_url: https://ijcai.org/proceedings/2025/0964.pdf#page=3
---
# DGL: Dynamic Global-Local Information Aggregation for Scalable VRP Generalization with Self-Improvement Learning

> **TL;DR:** DGL constructs a route from nearby candidates while updating compact global distance/direction features at every decision. Its self-improvement loop generates stronger labels and replaces part of the training-instance pool. TSP and CVRP have distinct models/checkpoints, supporting **specialist/constructive** classification. The official repository later corrects the published CVRP ELG comparison; those results are distinguished below.

## Motivation

Restricting neural decisions to nearby nodes can improve scale transfer, but local candidates may miss global context. Conversely, repeatedly processing every remaining node through a large attention model is expensive. DGL adds geometric summaries to local candidates and recomputes their representations as the partial route evolves. “Dynamic” refers to the construction state, rather than an evaluated stochastic-traffic or online-request setting. [Sections1–3.](https://ijcai.org/proceedings/2025/0964.pdf#page=1)

## Contributions

- Local candidate selection is supplemented with current-node distance, summaries of distances to unvisited nodes and orientation relative to the starting node/depot.
- A compact attention model processes these updated features for each next-node choice.
- Replacement-based self-imitation combines stronger sampled pseudo labels, coordinate/solution augmentation and refreshed training instances without a separate validation-triggered update rule.
- Tests cover TSP/CVRP size and distribution transfer, TSPLIB and country-map TSP cases. A dated author correction revises the CVRP ELG baseline configuration.

## Methodology

### Dynamic features and local construction

At each step, select nearby unvisited candidates, k=30 for TSP and50 for CVRP. Their features include coordinates, distance from the current node, mean and standard-deviation-like summaries of distances to remaining nodes, and the unit direction relative to the start/depot. Min–max normalization is applied within the local input. The current node is also supplied; the start is represented through features rather than always adding a separate distant token. [Equations1–10.](https://ijcai.org/proceedings/2025/0964.pdf#page=4)

The article describes four128-dimensional attention layers with eight heads. The released implementation calls its modules an encoder and decoder: the former contains one attention layer and the latter three. Both execute on the **current local view** at each step, consistent with four updated layers rather than a single precomputed full-graph embedding. The masks and CVRP state supply visitation/capacity rules. No newly proposed neural operator edits a completed incumbent tour, and self-improvement in training does not itself change the constructive inference paradigm.

The mean can be updated by removing the selected node's distance rather than recomputing a full statistic. The claimed O(n) cost concerns a **single all-node feature update**, not the whole solver. The release still creates a dense pairwise distance matrix and sorts candidates at successive steps. Its variance-like update is also not an exact generic population-variance deletion identity, as explained under limitations.

### Replacement-based self-imitation

Initialize a pool with uniformly generated instances and nearest-neighbor labels. Sample candidate solutions with the current policy, keep a better label where found, augment both coordinates and label order, and minimize cross-entropy against the retained sequence. Coordinate transforms include rotation/reflection/normalization; TSP labels admit cyclic shifts, while CVRP labels use route reversals and route-order changes. A random fraction of the pool is replaced by new instances, resetting their retained label cost. [Algorithm1/Section3.3.](https://ijcai.org/proceedings/2025/0964.pdf#page=5)

This is offline parameter learning, not test-instance active search or neural route reconstruction. Separate TSP/CVRP source directories, feature projections and released checkpoint files establish task-specific models. “A single model trained at100 nodes” describes size/distribution transfer within a task and does not supply evidence of shared TSP/CVRP weights.

## Experiments

### Budgets and benchmark scope

The formal protocol trains on uniform100-node instances for100epochs ×100iterations, batch256 and64 sampled candidates per iteration, with learning rate1e-4 decayed by.97 and12.5% replacement. This corresponds to2.56M training instance presentations plus candidate-generation cost, rather than2.56M distinct instances. The released training configuration realizes64 branches as16 starts ×beam4. Hardware is Xeon Platinum8352V and RTX4090/24GB. Total training hours and multi-seed confidence intervals are not reported. [Section4.](https://ijcai.org/proceedings/2025/0964.pdf#page=6)

MSVDRP evaluation spans four distributions—uniform, clustered, explosion and implosion—at TSP100/1K/5K/10K and CVRP50/500/5K. TSP source scripts evaluate2,000/200/20/20 instances with64/32/16/8 augmented trajectories, and CVRP scripts select500/50/5 from larger2,000/200/20 files, with64/32/16 augmentations. The script measures the complete evaluation call; paper table times should not be presented as per-instance latency. These source settings are recorded separately because the article does not enumerate every test count or branch. “Plain DGL” already has candidate augmentation; beam width4 is an additional configuration.

Baselines use public checkpoints/default settings, with greedy LEHD/BQ and the stated INViT setup. These choices do not compare every baseline's strongest improvement/search protocol at equal budget. Synthetic gaps use reference solver results; the scripts distinguish Gurobi at TSP100 from LKH runs at larger sizes. Real benchmarks use best-known values, not uniformly certified optima.

### Formal results and important exceptions

Uniform TSP10K gives4.46% gap in5.9minutes for DGL and2.58% in6.4minutes with beam4. At TSP100, ELG.24% beats both plain DGL.60% and beam4.27%. Clustered TSP10K plain DGL6.02% ties INViT6.02%, while beam4 reaches4.49%. Thus improved large-scale transfer does not mean every size/method row wins. [Table1.](https://ijcai.org/proceedings/2025/0964.pdf#page=6)

On CVRP5K, DGL plain gaps are3.08/2.35/3.20/2.77% across the four distributions, improving to2.83/2.22/2.98/2.54% with beam4. CVRP500 is much less favorable: plain gaps8.38/6.26/8.09/7.95% are worse than BQ3.31/4.54/4.50/3.87%. The small-CVRP generalization weakness must not be hidden by the5K improvement. [Table2.](https://ijcai.org/proceedings/2025/0964.pdf#page=7)

TSPLIB contains77 instances, divided into48/24/5 by scale. Plain DGL averages2.42/6.49/8.24% gap; beam4 gives2.23/5.64/5.77%. The largest plain-model group is worse than INViT7.57%. The8 country-map cases span194–22,775 nodes; beam4 improves VM22775 from7.78% to6.54%, but **worsens AR9152 from9.51% to12.46%**. Failure/OOM rows often have different solved-instance counts, so their averages are not identical-population comparisons. The prose mentions CVRPLIB Set-X, but the displayed real-data Table3 contains TSPLIB/country-map columns rather than numerical CVRPLIB results. [Table3.](https://ijcai.org/proceedings/2025/0964.pdf#page=7)

### Official correction to the ELG baseline

The author README notice dated **24October2025** states that the original ELG configuration was unfair and corrects it to `pomo_size=50`. Its attached full CVRP table is read as a separate post-publication scientific source. DGL values remain unchanged; the correction revises ELG's gaps as follows. [Author correction.](https://raw.githubusercontent.com/wuyuesong/DGL/master/Experimental_Results.jpg)

| CVRP size | Uniform | Clustered | Explosion | Implosion |
| --- | --- | --- | --- | --- |
|50 |3.81% |5.61% |4.00% |4.02% |
|500 |6.49% |8.71% |7.03% |6.48% |
|5,000 |7.04% |20.84% |14.22% |8.16% |

For example, uniform CVRP50 ELG improves from the formal8.88% to3.81%, beating plain DGL4.69%; uniform500 ELG6.49% beats both plain8.38% and beam4's7.20%. Large5K DGL remains better than corrected ELG. This is a **CVRP correction**, and it does not supply a revised TSP comparison.

### Ablation evidence

The article verbally states that global features matter and zero replacement harms performance, but explicitly asks readers to contact the first author for detailed ablation results. No numerical ablation table, uncertainty estimates or additional public scientific attachment was found in the inspected publisher/source inventory. Accordingly, quantitative effect sizes or significance claims cannot be recovered from this article alone.

## Limitations

### Discussed by the Authors

Improving computational efficiency, deriving/fusing global features through learning and extending to more complex optimization problems remain future work. Hand-designed features and fixed candidate neighborhoods constrain the representation and available next-node choices.

### Curator Notes

- The paper's Equation1 describes a visited-node mask while referring to unvisited-node summaries; the intended statistic and printed mask definition conflict. Equation7 and the inspected TSP/CVRP code omit the mean-shift term needed for exact variance deletion. For a two-value population0,2, deleting2 leaves variance0, but that recurrence gives1. Treat it as the implemented variance-like feature, not a proved exact statistic update. CVRP additionally clamps negative square-root inputs to zero.
- Local attention avoids all-node neural attention at each step, but dense distance storage, global feature maintenance, candidate sorting and augmented/beam trajectories remain substantial. A linear per-step recurrence does not imply linear overall inference or arbitrary-scale support.
- More search can select a worse real-map result, and different solved-instance populations complicate averages. Zero gap denotes a reference row; strong large-scale results coexist with small/medium-scale failures.
- The source structure and checkpoint paths support task-specific training. Shared architecture and scale transfer alone do not justify generalist classification.
- The official2025 correction must accompany discussion of the original ELG comparison. The current author README's BibTeX itself omits XuanWu; the formal first page and publisher's ten-author metadata are used as the authoritative author list.

## Reproducibility

- **Reading:** all9 formal IJCAI pages, complete bibliography, all3 tables/2 figures, plus the entire author correction image freshly read. The original JPEG is embedded unchanged in a one-page review PDF to register the scientific source and reading coverage. Architecture, recurrence formulas and full result tables were rendered and visually checked.
- **Metadata:** corrected to10 authors from the actual PDF and publisher. Xiao/YuesongWu/RuiCao share first contribution; YouZhou/YuanJiang correspond. JilinUniversity and SingaporeManagementUniversity are added alongside NTU. The official BibTeX supplies month August2025, while its electronic citation_publication_date gives only2025. The publication display conservatively retains that evidenced year; no electronic-publication day or paper-specific acceptance date is inferred from the conference calendar.
- **Scientific inventory:** actual publisher page supplies the complete9-page paper and no supplementary-file link. The official35-entry source treeccb449114beccefa3e88221d93d8032ff3abb9bb has no PDF/TEX/notebook/archive attachment; its full README, architecture PNG and scientifically updated results JPG were inspected. The JPG is registered/read separately; the article's requested-by-contact ablation details remain unavailable rather than invented.
- **Code:** actual TSP/CVRP models, state updates, trainers, configs and inference scripts inspected. Separate task checkpoints are present. One local attention layer labelled encoder plus three labelled decoder match the four-layer model; default debug overrides,16×4 sampling,12.5% replacement, dense matrices, statistics recurrence and whole-evaluation timing are recorded. No training or benchmark rerun is claimed.
- **References:** explicit in-text citations and matching full bibliography only. The old2403.19561 SIL precursor maps to its curator-established formal representative with version qualification. An unrelated2020 lncRNA paper appears in the source bibliography and is not forced onto an NCO record. [Formal publication](https://www.ijcai.org/proceedings/2025/964); [official implementation and correction notice](https://github.com/wuyuesong/DGL).
- **Figure:** complete original Figure2 from formal PDFpage3, cropped directly and visually checked.
