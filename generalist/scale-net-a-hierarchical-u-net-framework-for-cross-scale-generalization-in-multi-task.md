---
id: scale-net-a-hierarchical-u-net-framework-for-cross-scale-generalization-in-multi-task
short_title: Scale-Net
title: 'Scale-Net: A Hierarchical U-Net Framework for Cross-Scale Generalization in Multi-Task Vehicle Routing'
authors:
- Suyu Liu
- Zhiguang Cao
- Nan Yin
- Yew-Soon Ong
year: 2026
date: '2026-03-14'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/38444
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/38444
institutions:
- Nanyang Technological University
- Singapore Management University
- Hong Kong University of Science and Technology
- Agency for Science, Technology and Research
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- CVRP
- OVRP
- VRPB
- VRPL
- VRPTW
- OVRPTW
- OVRPB
- OVRPL
- VRPBL
- VRPBTW
- VRPLTW
- OVRPBL
- OVRPBTW
- OVRPLTW
- VRPBLTW
- OVRPBLTW
summary: A graph U-Net supplies multi-scale context to a jointly trained routing constructor; six native VRP variants
  support ten unseen constraint combinations, with substantial training, uneven scale transfer and a verified gradient
  limitation in the released pooling scorer.
code_url: https://github.com/lsyysl9711/Scale-Net
figure:
  path: paper-assets/scale-net-a-hierarchical-u-net-framework-for-cross-scale-generalization-in-multi-task/framework.png
  alt: Graph pooling builds nested encoder levels, unpooling and skip connections restore node features, and multi-scale
    context feeds autoregressive route construction.
  caption: 'Figure 1: Scale-Net hierarchical encoding, feature reconstruction and routing decoder.'
  source_url: https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=4
---

# Scale-Net: A Hierarchical U-Net Framework for Cross-Scale Generalization in Multi-Task Vehicle Routing

> **TL;DR:** Scale-Net adds pooled graph hierarchies, skip-connected feature reconstruction and multi-scale decoder context to a routing policy. One checkpoint jointly learns six VRP variants and is tested on ten unseen combinations: **generalist/constructive**. Sequential large-size fine-tuning improves some transfers substantially, but performance is not uniformly better; current code also leaves the pooling projection without a differentiable training path.

## Motivation

Unified routing policies face both heterogeneous constraints and growth in graph size. Dense attention can be costly, while a decoder using only one representation level may miss useful local/global structure. Scale-Net investigates a hierarchy that preserves fine-scale features through skip connections and provides several levels of context to route construction. Graph down/up-sampling changes the representation; it does not partition the solution into independently solved tours. [Introduction/Methods.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=1)

## Contributions

- A graph U-Net-style representation alternates attention, top-k node pooling, a bottleneck and unpooling with skip connections.
- Summaries from multiple scales condition an autoregressive routing decoder.
- POMO-MTL and MVMoE integrations demonstrate the recipe with separately trained host architectures.
- Joint six-task pretraining, sequential size fine-tuning, ten unseen constraint combinations, real benchmarks and pooling/budget analyses expose both benefits and limits.

## Methodology

### Native problems and shared weights

Every instance has capacity constraints; the four optional attributes are open routes (O), backhauls (B), a route-duration limit (L) and time windows (TW), yielding16 combinations. Training mixes **CVRP, OVRP, VRPB, VRPL, VRPTW and OVRPTW** in one policy. The remaining ten combinations are zero-shot tasks unless explicitly fine-tuned in the few-shot experiment. The same checkpoint is used across native constraint variants, supporting generalist scope. POMO versus MoE hosts,50 versus100 pretraining and later size checkpoints remain distinct models. [Problem definitions/appendix task table.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=13)

Static customer inputs are coordinates, demand and time-window bounds; the depot embeds coordinates. Dynamic context includes spare capacity, time, current route length and open-route status. Usual feasibility masks and environment updates enforce the selected variant. Default synthetic settings use unit-square coordinates, demand1–9, capacity40/50 for50/100 customers,20% backhaul nodes, duration limit3, depot window[0,3] and customer service time.2. These are specific generators, not arbitrary real-world constraint semantics. [Appendix configurations.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=10)

### Hierarchical encoding and construction

Attention first processes each active node set. A linear projection scores nodes and top-k selection keeps a nested subset; node budgets are manually chosen. Coarse features are processed at the bottleneck. Unpooling scatters them back to the previous node set, uses zeros for removed nodes, concatenates the corresponding skip features and applies attention. The final node representations retain original-node resolution. The decoder uses the current node, dynamic state and multi-level context to construct the next feasible visit. [Equations4–10/Figure1.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=4)

In the current implementation, context means are collected before each pool and at the bottleneck, then concatenated into a fixed-size query input. This clarifies the paper's schematic concatenation of whole hierarchy matrices. The bottleneck remains a collection of node features before its mean context is computed; it is not solely a single vector for all reconstruction operations. Two additional full-graph refinement layers appear in the released MTL model, and one in its MoE host.

REINFORCE uses multiple-start rollouts and a baseline; MoE additionally balances experts. Parameter fine-tuning adapts the constructor. Neither fine-tuning nor feature reconstruction edits a complete incumbent route, so they do not imply a constructive/improvement hybrid.

### Pooling and computational scope

Attention at the first and final original-resolution levels remains quadratic in node count. Pooling reduces work in intermediate blocks; it does not establish subquadratic whole-model complexity. The appendix's FP32 attention-matrix calculation compares about4.6GB for six5,000-node layers with about1.6GB for its assumed hierarchy, a reported65.2% reduction. This is an analytical matrix-storage estimate, not measured peak training/inference memory including all activations, parameters, optimizer state or the release's extra refinement layers. Parameter counts actually increase from1.25M to2.01M for the MTL host and3.69M to4.24M for MoE. [Memory analysis/hyperparameter table.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=11)

The released `gPool` computes projection scores only to obtain discrete `topk` indices, then returns gathered input features. It never gates the features with scores or supplies a straight-through estimator. An isolated CPU backward pass through the actual released class gives nonzero input gradients but **None for projection weight/bias gradients**. Thus the claimed importance scorer is not trained by that ordinary loss path in this release. Other encoder weights can still learn and change rankings indirectly. This precise implementation limitation does not by itself invalidate the paper's empirical hierarchy comparisons.

## Experiments

### Training and evaluation budgets

Each50/100 pretraining run uses5,000 epochs×20,000 instances =100M instance presentations, batch128, Adam1e-4, weight decay1e-6 and a final learning-rate decay. The100-node checkpoint is sequentially fine-tuned at1K/2K/3K using500×8,000 =4M,100×3,000 =.3M and100×1,200 =.12M presentations, learning rates1e-5/1e-6/5e-7 and batches24/12/3. Few-shot tests separately use10×10,000 =100K presentations per target task. Repeated presentations and fresh generated instances should not be confused with independent benchmark test counts. [Appendix training/parameter table.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=14)

The paper reports48 CPUs/four RTX A6000 GPUs, and approximately five days for pretraining/four for fine-tuning on a single A6000, without clearly assigning that latter duration to every individual scale stage. Small tests have1,000 instances per task and eight-fold augmentation; large tests have128 instances for1K–3K and16 for4K/5K. Pooling schedules are40/30/20 for50,75/50/25 for100 and500/250/125 in the stated large-size setup. POMO search width is reduced for computational reasons; the code's test default is2 starts, so all result settings require explicit configuration.

### Benefits and negative results

At1K, Scale-Net-1K improves the listed neural baselines across the16 tasks. Later checkpoints extend useful construction to5K: on5K CVRP, objectives are159.211 for Scale-Net-1K,80.047 for POMO-MTL-1K and73.773 for Scale-Net-3K. Thus the early hierarchy checkpoint can transfer very poorly; the later large-size training is material to the gain. On3K OVRP, even Scale-Net-3K236.382 is worse than ReLD-MVMoE-L215.191 and POMO-MTL-1K222.294. Larger-size fine-tuning can also degrade smaller-size performance. [Main Tables1–2/appendix Table10.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=5)

Small-size MTL augmentation generally reduces reported gaps, but MoE gains are mixed: at100-node VRPTW, Scale-MVMoE4.986% is worse than MVMoE4.903%; similar negative cases occur in some combined-constraint tasks. Aggregate reported p-values do not imply every row is independently significant or improved. Specialized VRPTW fine-tuning can also outperform the unified model on its native task, despite worse average performance across all16 tasks. [Small-size tables/specialization comparison.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=15)

On28 smaller CVRPLIB Set-X instances,100-trained Scale-Net has average reported gap5.82%, compared with POMO-MTL9.82%, MVMoE-L5.160% and separately trained Scale-MVMoE4.58%. On32 larger Set-X instances, the100-trained Scale-Net gap23.45% is worse than POMO-MTL16.769%; fine-tuning yields Scale-Net-1K9.85% versus POMO-MTL-1K13.49%. These are different protocols. On the selected Solomon instances, Scale-Net/Scale-MVMoE report13.78%/13.72%; the table's MVMoE-L value is18.490%, whereas nearby prose says17.84%. [Appendix Tables5–7.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=16)

Pooling sensitivity for the **fine-tuned** model compares four schedules with gaps9.85/9.65/9.83/9.97% and reported mean9.825±.114. A different, **100-trained** model uses size-dependent schedules and reports21.41% versus23.45%; this is not an improvement from the9.85% fine-tuned result. [Appendix Tables8–9.](https://raw.githubusercontent.com/lsyysl9711/Scale-Net/main/Paper/Scale_Net.pdf#page=18)

## Limitations

The hierarchy has no optimality guarantee. Manual pool budgets, task/generator choices, reduced search width, restricted fine-tuning comparisons and distribution/scale forgetting limit conclusions. POMO-MTL2K/3K fine-tuning is omitted after reported OOM, so the comparison does not establish superiority to equally trained feasible implementations on every architecture/hardware configuration. Negative gaps against OR-Tools describe beating a heuristic reference, not surpassing a true optimum.

Several reporting details require caution. The appendix specifies a200-second OR-Tools limit per large instance, while main tables show25m without a complete timing reconciliation. Its five evaluation sizes are paired with six batch-size values, and the capacity description says linear scaling but gives3,000 at5K. Some per-instance gap cells are inconsistent with their printed objective/reference: Set-X X-n209-k16 lists31,889 against30,656 but gap5.81%, whereas their direct ratio is about4.02%. Quoted table aggregates are retained as reported and are not silently recomputed into corrected claims.

The current code's hardcoded MTL pool schedule350/125/50 and extra global refinement blocks differ from the main configuration description. `Tester.py` overrides its test count to16 and contains experiment-specific data paths; `Trainer.py` resets loaded-checkpoint learning rate to5e-7. The package initializer also references `models/SINGLEModel.py`, absent from the retrieved tree. These issues must be reconciled for reproduction; availability of checkpoints alone is not evidence that every table runs unchanged.

## Reproducibility

- Formal AAAI2026 DOI10.1609/aaai.v40i17.38444 and publication2026-03-14 are supported by publisher/Crossref metadata. Four authors and NTU/SMU/HKUST/A*STAR affiliations match the read byline; Nan Yin corresponds. No acceptance date or unverified arXiv date is inferred.
- The actual reading source is the **21-page author-repository PDF**, with complete main text, full references and all scientific appendix tables/configurations. OJS access failure is not mistaken for a readable paper; byte identity with its unavailable formal PDF is not claimed.
- [Official repository](https://github.com/lsyysl9711/Scale-Net), tree SHA `122fd13acf72e0768c662476261358bd9a83476e`, has44 entries including that PDF, architecture image, code and seven pretrained checkpoints. Both READMEs and actual training/model/evaluation paths were inspected; no extra scientific archive/PDF was present. The linked Drive folder is described as test data. The original full Figure1 is cropped from PDFpage4.
- The same `Train_ALL` model receives randomly selected batches from six environments; the tester loads one checkpoint and loops across task environments. This directly supports generalist scope. MoE and MTL hosts and successive size versions are kept distinct.
- `pool-gradient-check.json` records the isolated released-module gradient result. No full training, checkpoint evaluation or paper-table reproduction was rerun. Public code boundaries are separated from the paper's reported outcomes.
- Internal references require explicit body citations and matching full bibliography identities. RouteFinder's actually cited2024 eight-author workshop/preprint is linked via the same arXiv2406.15007 version chain to the formal representative; year/author changes are preserved. Printed bibliographic year/edition mistakes are not propagated into target metadata.
