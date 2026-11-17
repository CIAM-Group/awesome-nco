---
id: ttpl
short_title: TTPL
title: Improving Generalization of Neural Combinatorial Optimization for Vehicle Routing Problems via Test-Time
  Projection Learning
authors:
- Yuanyao Chen
- Rongsheng Chen
- Fu Luo
- Zhenkun Wang
year: 2025
date: '2025-06-03'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/6edd46d69ef91f4555d67f7b321d6902-Abstract-Conference.html
code_url: https://github.com/CIAM-Group/TTPL
arxiv_url: https://arxiv.org/abs/2506.02392
institutions:
- Southern University of Science and Technology
- Peng Cheng Laboratory
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: LLM-based program evolution discovers coordinate projections for a frozen local neural route constructor;
  eight-view logit fusion and optional LEHD reconstruction have distinct quality/budget protocols, while projection
  search itself takes hours.
figure:
  path: paper-assets/ttpl/framework.png
  alt: LLM-evolved projection programs are evaluated by a frozen neural routing model and selected through a population
    loop.
  caption: 'Figure 2: LLM-driven projection-program evolution and neural route-cost evaluation.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=5
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/6edd46d69ef91f4555d67f7b321d6902-Abstract-Conference.html
---
# Improving Generalization of Neural Combinatorial Optimization for Vehicle Routing Problems via Test-Time Projection Learning

> **TL;DR:** TTPL uses an LLM to evolve **coordinate-projection programs**, then feeds projected local neighborhoods to a **frozen** pretrained routing model. Neural weights are not fine-tuned. Its reported protocols are pure construction, construction with eight-view logit fusion, and a separate optional **1,000-iteration LEHD reconstruction** stage. Projection discovery costs **5.5/9.6/19.9 hours** in the reported TSP1K/5K/10K settings; those costs are separate from the short final-solver times.

## Motivation

A model trained on uniform 100-node instances can receive geometrically different inputs when a much larger route is constructed through nearest-neighbor subgraphs. Restricting the action set controls the immediate neural input size but does not itself align the local geometry with training. TTPL searches for preprocessing that improves the frozen model's decisions. Distribution alignment here is an **empirical coordinate-transformation heuristic**, not a proven optimal transport map or a guarantee that every neighborhood becomes uniform. [Sections 2-4.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=4)

## Contributions

- An **LLM-driven evolutionary program search** discovers coordinate projections, seeded with an existing INViT projection.
- The projection is inserted into local autoregressive construction without retraining the pretrained NCO network.
- **Multi-View Decision Fusion (MVDF)** combines action logits from multiple geometric views at each decision.
- Experiments distinguish construction, view fusion, optional reconstruction, cross-distribution transfer, backbone changes, LLM changes and projection-search overhead. [Figure 2/Sections 5-6/Appendices B-E.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=5)

## Methodology

### Program search and frozen-model evaluation

Each individual contains a natural-language description and a Python/PyTorch projection function. EoH-style prompts propose new functions from two parent strategies or modify one parent. Candidate fitness comes from routing quality on evaluation set D: for every construction step, select **100 nearest unvisited neighbors**, transform their coordinates, query the frozen neural model and append the chosen node. Complete-route quality supplies feedback to the program population. The output is the **best found function**, not neural parameters or a certified globally optimal projection. [Algorithm 1/Equation 2.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=6)

The reported search uses **population20, 105 generations, two parents and GPT-4o-mini**. TSP and CVRP each receive separate projections for **1K, 5K and 10K**; the 10K function is reused at 50K/100K because search is expensive. The four TTPL prompts are E1/E2 exploratory generation and M1/M2 structural/parameter modification. Appendix B's generic EoH pseudocode additionally names M3. The present release instead sets population **15**, maximum **2,000 samples**, 105 generations and ten samplers/evaluators; these are current code defaults, not silently substituted for the paper's setting. [Section 6/Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=8)

The main algorithm describes route length as fitness but sorts descending. The actual released evaluator returns **negative gap**, consistent with maximization and with the prompt text. The candidate-search evaluation set is distinct conceptually from an unseen future workload, but the paper does not specify a fully independent search-versus-reported-test split. The inspected evaluator calls the same task `main_test` entry point and dataset paths. The evidence therefore supports target-data-driven strategy selection; it does not establish that every reported target instance was untouched during projection discovery.

### What the projections do

Only **coordinates** are transformed; CVRP demands/capacity remain unchanged. The final route is evaluated in the original problem geometry. The main LEHD checkpoint uses embedding128, six decoder attention layers, eight heads and feed-forward width512, pretrained on 100-node instances. Separate TSP/CVRP policies are retained. [Settings/Appendix B-C.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=7)

The published representative functions are concrete rather than an unspecified trainable projection layer:

- **TSP1K:** subtract coordinates from the local coordinate-wise maximum, divide by the largest axis range and clip to [0,1].
- **TSP5K:** subtract local minima, apply `tanh`, divide by the original largest coordinate range and clip.
- **TSP10K:** center at the **bounding-box midpoint**, divide by the largest range, add .5 and clip. This midpoint is not the arithmetic centroid despite the prose terminology.
- **CVRP1K/5K:** use depot-relative vectors with maximum-radius-based scaling, including the code's zero-distance handling; 5K uses the square root of the maximum radius.
- **CVRP10K:** transform depot-relative radius by `exp(radius)-1`, normalize by the largest transformed radius, restore direction with a **1e-6** denominator offset, and add the anchor back. [All six code listings and mathematical descriptions.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=28)

Nonlinear transforms and clipping can change geometric relationships. The formulas and code are not perfectly interchangeable: for example, the TSP1K printed formula adds M after scaling where Code1 does not, and the CVRP10K displayed expression contains `1e6` where Code6/current code uses `1e-6`. This note describes the executable code operations and does not assert exact equivalence of every printed formula or preservation of the original optimal tour.

### Multi-view decisions and optional refinement

MVDF makes **eight geometric views** of each projected subgraph, evaluates the same frozen model and applies **softmax to the sum of action logits**. Equation3 and the inspected implementation agree on this rule. It is not a best-view selector, an average of independently completed tours, or additional learning of invariant network features. Some surrounding prose describes the most confident view; the actual aggregation is retained here. [Equation3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=7)

The optional post-search protocol borrows **LEHD random re-construction, 1,000 iterations**: it reconstructs parts of completed incumbent routes and keeps improvements. Its quality/time must be separated from a single construction trajectory. Classification remains **specialist / constructive** for TTPL's new projection/MVDF construction method; the separately reported borrowed RRC configuration is explicitly an additional improvement stage. Neither a common framework nor separate projections/backbones for two problems demonstrates one cross-task generalist checkpoint.

## Experiments

### Data, references and compute

Synthetic tests use **128 TSP1K instances** and **16 each at 5K/10K/50K/100K**. CVRP uses **100 each at 1K/5K**, then **16 each at 10K/50K/100K**, with capacities200 at 1K and300 at larger sizes. Benchmarks contain **33 symmetric EUC_2D TSPLIB instances**, 1,000-85,900 nodes, and **14 CVRPLIB instances**, 1,000-30,000 customers. Some published prose says over1K although the tables include 1,000. Tests use a **single RTX3090 24 GB GPU**. [Section 6/Appendix D.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=7)

Synthetic reference gaps use **LKH-3 for TSP and HGS for CVRP**. Both are strong heuristic references, not blanket certificates of global optimality. DIFUSCO's starred rows are copied from its paper. Other methods vary in beam width, augmentation, reconstruction and memory coverage; comparisons are not universally equal-budget or equal-solved-subset tests. Current release batches TSP1K128 and the larger TSP sets16, CVRP1K/5K100, larger CVRP16 except100K batches8, while public-benchmark instances are processed individually. The short table timings should retain this batching context and the paper's reported units, not be advertised as universally matched single-instance latency.

### Synthetic results: keep the three protocols separate

| Test | Pure TTPL gap / reported time | TTPL+MVDF gap / time | TTPL+MVDF+RRC1000 gap / time |
| --- | --- | --- | --- |
| TSP1K | 2.65% / .1 s | 2.26% / .5 s | .28% / 3.6 min |
| TSP10K | 3.63% / 2.9 s | 2.39% / 7.2 s | 1.13% / 5.0 min |
| TSP100K | 3.22% / 28.9 s | 2.56% / 1.1 min | 1.63% / 5.9 min |
| CVRP1K | 8.60% / .1 s | 7.79% / .5 s | 3.28% / 4.1 min |
| CVRP10K | 5.11% / 3.8 s | 2.54% / 7.7 s | 1.02% / 6.4 min |
| CVRP100K | 6.33% / 41.3 s | 3.60% / 1.3 min | 3.32% / 7.7 min |

These are not zero-gap solutions. At CVRP1K, the unmodified LEHD-RRC baseline has **2.91%**, better than TTPL-MVDF-RRC's3.28%; the latter does not win every configuration. LKH/HGS reference rows retain lower reported objectives than TTPL, while using different solver budgets. The strongest claimed gains against neural baselines should not be generalized to all conventional solvers. [Table2.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=7)

The baseline table also contains a numerical inconsistency: BQ-bs16's TSP5K objective **58.27** and gap **10.7%** do not reconcile with the displayed LKH reference50.97 (which gives about14.32%). This row is not silently treated as a consistent recomputed measurement. Exact-source labels and heuristic reference values likewise do not automatically establish a single consistent certified optimum for every table row.

### How much comes from search, the seed and MVDF?

The simple INViT seed projection accounts for much of the giant improvement over no projection: TSP100K gap changes **121.42% without projection to3.24% with the seed**, then **3.22% with the evolved projection**. At TSP1K, seed2.96% becomes2.65%. This distinguishes the value of local normalization from the incremental gain of LLM evolution. [Tables1/4.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=9)

MVDF beats no MVDF across all five TSP sizes, but comparison with ordinary POMO-style completed-tour augmentation favors MVDF on **three of five** scales. At TSP1K, POMO augmentation has **.89% versus MVDF2.26%**; at5K it has2.22% versus2.86%. MVDF wins the larger three settings. These procedures use different decision/trajectory ensembles, with their own measured times. [Table5.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=9)

Projection search itself takes **5.5, 9.6 and19.9 hours** on TSP1K/5K/10K. Those hours are absent from the short per-solve table rows. A previously discovered projection can be reused, while designing a fresh target strategy adds that separate budget; CVRP search hours and full LLM token/API totals are not given in Table13. [Appendix E.2/Table13.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=39)

### Public benchmarks, shifted distributions and other backbones

On the full33 TSPLIB set, pure TTPL/MVDF/MVDF+RRC mean gaps are **5.80/3.88/1.37%**. On all14 CVRPLIB cases they are **13.19/10.97/7.50%**. Competitor solved counts differ, so their reported means may exclude memory failures. Appendix D's prose says7.34% for CVRP post-search, but **main Table3 and Appendix Table10 both report7.50%**, retained here. Some individual cases remain substantially worse: Flanders2 is19.43% with MVDF and18.18% after RRC. Several smaller Li instances favor baseline methods. [Tables3/7-10.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=37)

Cluster/explosion/implosion tests show substantial improvement over no projection at large scale, but not uniform superiority over the seed. In clustered CVRP100K, the MVDF-equipped method costs **384.6 versus seed373.7**, while using more inference time. TSP5K implosion values tie at46.7 after rounding. The appendix row label TTPL in this experiment corresponds to the MVDF-enhanced protocol described in Section6.3, not the cheaper pure-TTPL row. [Table11.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=38)

Backbone transfer is also conditional: **SIGD-TTPL worsens TSP1K gap from1.96 to3.20%**, although it improves larger tests. The POMO/BQ/LEHD tests support reuse of the projection framework across models without establishing one uniformly strongest backbone. Different LLMs produce different strategies and values; at TSP10K Table14 ranges from **74.00 DeepSeek to76.42 Gemini**, with GPT-4o-mini74.39. No error bars or multi-search-run significance tests are provided. The checklist's deterministic-metrics explanation does not remove stochasticity from LLM evolution and RRC. [Tables12-14.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=39)

The fully inspected solution visualizations show four TSP5K distributions and four TSPLIB routes under the RRC protocol. They are qualitative examples with nonzero gaps, not a further independent aggregate benchmark or optimality certificate. [Appendix F.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=40)

## Limitations

### Reported by the Authors

- LLM optimization converges relatively slowly; more efficient evolutionary operators remain future work.
- Expensive strategy discovery motivates reusing10K projections at50K/100K.
- The paper presents empirical results without a theoretical guarantee. [Section7/Checklist/Appendix E.](https://proceedings.neurips.cc/paper_files/paper/2025/file/6edd46d69ef91f4555d67f7b321d6902-Paper-Conference.pdf#page=10)

### Curator Notes

- Neural weights stay frozen, but projection discovery uses target evaluation data and substantial compute; an independent held-out discovery/evaluation split is not established.
- Coordinate preprocessing is not a guarantee of uniformity, distance preservation, route optimality or universal feasibility; the underlying decoder handles task constraints.
- Final inference, eight-view ensemble,1,000 reconstruction steps and hours of LLM search are separate budgets.
- Seed-normalization gains are much larger than some incremental evolution gains; several backbone, instance and distribution comparisons reverse the broad headline ranking.
- Heuristic reference gaps, differing solved subsets, absent stochastic uncertainty and current-code defaults qualify reproduction and comparison.

## Reproducibility

- **Full reading:** all **43 publisher PDF pages** were freshly read, including the complete checklist, all A-H appendices, every prompt/code listing/math description, all benchmark rows and qualitative plots. Original framework/formulas/tables and scientific solution maps were visually inspected.
- **Metadata:** official NeurIPS38 Main Conference2025 confirms title/four authors/DOI10.52202/085713-2570; title page adds **Peng Cheng Laboratory** to SUSTech. ArXiv first submission remains **3June2025**. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2025/hash/6edd46d69ef91f4555d67f7b321d6902-Abstract-Conference.html) explicitly records `citation_publication_date` as **2026-04-23**, independently of any paper-specific acceptance date. A generic conference notification date remains excluded from acceptance metadata.
- **Scientific supplement discovery:** the manually inspected publisher page lists the complete Paper and no separate scientific supplement. All A-H content is in that43-page source. The official repository's **105-member source ZIP** was inspected and contains no additional scientific PDF/ZIP/TEX.
- **Official code:** [CIAM-Group/TTPL](https://github.com/CIAM-Group/TTPL), whose README is nested under `TTPL/`. The full README, all six released projection functions, evaluator/search configuration and relevant construction/MVDF/reconstruction/timing paths were inspected. The release supports fixed projections without LLM calls and separate new-projection discovery. Population15/max2000samples defaults, negative-gap fitness, eight-view summed logits and shared evaluation paths are documented above. No new model or LLM experiment was run here.
- **Figure:** original Figure2, publisher PDF page5, cropped directly with its complete pipeline and caption.
