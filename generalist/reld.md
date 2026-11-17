---
id: reld
short_title: ReLD
title: Rethinking Light Decoder-based Solvers for Vehicle Routing Problems
authors:
- Ziwei Huang
- Jianan Zhou
- Zhiguang Cao
- Yixin Xu
year: 2025
date: '2025-03-02'
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/447ac93bf22099aa346a45577376492d-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2503.00753
code_url: https://github.com/ziweileonhuang/reld-nco
institutions:
- Singapore Management University
- Nanyang Technological University
scope: generalist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Duration Limits
- Asymmetric Traveling Salesman Problem
summary: Residual context injection and a query feed-forward block improve static-key/value routing decoders; jointly trained VRP models handle sixteen attribute combinations, while CVRP and ATSP studies use additional task-specific checkpoints.
figure:
  path: paper-assets/reld/framework.png
  alt: Layer sharing distinguishes light and heavy decoders; ReLD adds direct context identity mapping and a query feed-forward block while keeping cached static keys and values.
  caption: 'Figure 1: Computation sharing and ReLD decoder modifications.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=3
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/447ac93bf22099aa346a45577376492d-Abstract-Conference.html
---
# Rethinking Light Decoder-based Solvers for Vehicle Routing Problems

> **TL;DR:** Keep static node keys/values, but strengthen the construction query with a direct context residual and a feed-forward block. ReLD improves POMO-style size transfer and **joint multi-task models covering sixteen capacitated VRP combinations**. Those shared VRP models justify generalist classification; the additional CVRP-only and ATSP experiments use separate checkpoints.

## Motivation

A light decoder reuses embeddings computed before construction, even as visited nodes are removed and vehicle state changes. The authors argue that a simplistic query transformation struggles to extract the relevant information. They study this bottleneck empirically and preserve the efficiency of cached keys/values rather than recomputing every remaining-node embedding at every step. Their exponential-context/information-density explanation is a modeling argument, not a proved exponential representation lower bound. [Sections1-2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=5)

## Contributions

- A direct residual from current-node/dynamic context into the attention output.
- A feed-forward query transformation that increases decoder capacity while preserving static keys/values and multi-start sharing.
- CVRP training with varying instance size/capacity and an explicit distance heuristic, plus a separately evaluated multi-task version without those additions and a stronger-transfer variant with them.
- Shared six-task training/ten-unseen-combination transfer, CVRP100-1000 and library size transfer, component/fine-tuning/deeper-query ablations and a separate MatNet-based ATSP extension. The old generic TSP description omitted this actual task scope. [Sections3-4/AppendicesC-I.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=8)

## Methodology

### Query changes with cached representations

The static encoder embeddings supply keys and values throughout route construction. At each decision, cross-attention aggregates feasible-node information using a context query. ReLD adds the current-node embedding plus a learned projection of dynamic attributes directly to that attention output. A two-layer feed-forward block and residual then refine the query before final compatibility scores. The encoder normalization layers are removed in the evaluated ReLD implementations. [Equations9-11/Figure1.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=7)

For CVRP, the dynamic residual maps remaining capacity; the multi-task model maps four dynamic attributes. Static/dynamic node features, environment updates and feasibility masks inherited from MVMoE allow the same network to act on different constraint combinations. This is not learned automatic discovery of every constraint rule. The public feed-forward implementation has an intermediate ReLU followed by a linear output; printed Equation11 additionally depicts an outer activation. The implementation distinction is recorded rather than assumed immaterial.

The distance-enhanced CVRP version subtracts log current-to-candidate distance inside the clipped compatibility computation before softmax, as visible in Equation12 and the inspected code. Training samples sizes40-100 and varies expected route size/capacity. Plain ReLD-MTL/ReLD-MoEL instead isolate the decoder/normalization changes in the inherited multi-task protocol; ReLD-MoEL+ additionally uses the generalization techniques. [Section3.3/4.2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=9)

The added dense query operations have cost independent of node count at fixed embedding width **per query**, not an overall node-independent solver. The static encoder remains quadratic attention, route construction still has sequential decisions, and multiple trajectories/augmentation multiply work. AppendixB's proposal to refresh shared embeddings every K steps is a future framework, not the measured main algorithm.

### Evidence for a decoder bottleneck

The paper adds irrelevant random nodes before encoding and then decodes only the original sub-instance. POMO/AM are relatively tolerant while LEHD/BQ are more sensitive in this artificial intervention. This supports a useful difference in representation use, but does not prove that including original-graph information makes a policy mathematically invalid. Remaining-state information can be sufficient without forbidding a redundant original-instance representation. [Table1.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=6)

Fine-tuning only POMO's decoder is weaker than encoder-only tuning in the displayed large-transfer test; a separate capacity ablation finds benefits from the proposed decoder changes. These experiments do not establish that every larger decoder or every encoder change will generalize: alternative query/key/value feed-forward designs severely worsen CVRP1000. [Tables2/10.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=20)

### Corrected classification and checkpoint boundaries

**Generalist / constructive** replaces the old specialist label. ReLD-MTL and ReLD-MoEL each jointly train one policy on CVRP, OVRP, VRPB, VRPL, VRPTW and OVRPTW, then use the same checkpoint on ten unseen combinations of open routes, backhauls, duration limits and time windows. The release explicitly trains `Train_ALL`, randomly selects an environment per batch, updates one model/optimizer, and evaluates `ALL` with one checkpoint. [Section4.2/Table7.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=17)

The sixteen variants remain capacitated routing tasks with explicit attribute/mask composition. Backhauls are not automatically paired pickup-and-delivery precedence. The separately trained CVRP architecture study and ATSP extension are not asserted to share those multi-task weights. All proposed policies construct solutions; offline fine-tuning and cache reuse do not constitute neural incumbent improvement.

## Experiments

### Main CVRP training and inference

ReLD trains90 epochs of600,000 instances, or54 million sampled instances, batch120, Adam learning rate.0001 and zero weight decay. Learning rate drops tenfold at epochs70/80. Sizes are uniform40-100; expected route size is triangular T(3,6,25), with capacity derived from mean demand. The retrained POMO baseline uses5,000*10,000=50 million instances, batch64 and a different training distribution/schedule. [Section4.1.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=8)

The synthetic test has10,000 CVRP100 instances and128 each at200/500/1000, with capacities50/80/100/250. Greedy multi-start construction uses at most100 starts, selected from the first-step probabilities, and eightfold augmentation in the main rows. Reported Table3 times are **whole test-set totals**, not per-instance times. Main hardware is one A800-80GB. Gaps use LKH heuristic references, while HGS often improves those references. [Table3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=8)

| Size | ReLD gap / total time | Relevant comparison |
| --- | --- | --- |
| CVRP100 |.960% /1.34min | POMO1.004% /1.07min: small quality gain with overhead. |
| CVRP200 |1.654% /2s | POMO3.403% /2s; LEHD3.312% /2s. |
| CVRP500 |2.975% /15s | LEHD3.178% /15s; POMO11.135% /13s. |
| CVRP1000 |6.757% /.91min | BQ5.892% /1.59min and LEHD4.912% /1.34min have better quality. |

Thus ReLD narrows the large-size quality gap but does not uniformly surpass heavy-decoder methods or classical HGS. Augmentation/start counts and copied original-paper results must accompany rankings. Table10's ReLD values differ slightly from Table3; their rows are kept within their own protocols rather than silently merged.

### Shared sixteen-variant evaluation

Table5 evaluates1,000 test instances per variant under the inherited MVMoE protocol. Table7 reports mean gaps over six trained/ten unseen/all variants:

| Model | Six trained | Ten unseen | All sixteen |
| --- | --- | --- | --- |
| MVMoE-light |2.584% |5.989% |4.712% |
| ReLD-MTL |2.054% |5.059% |3.932% |
| ReLD-MoEL |1.974% |4.962% |3.842% |
| ReLD-MoEL+ |2.172% |5.126% |4.019% |

The plain ReLD models improve their multi-task counterparts across the displayed variants. The stronger cross-size techniques in MoEL+ reduce performance on most of these in-distribution combinations; “plus” is not uniformly better. For VRPL the negative gap is against the benchmark heuristic reference, not proof of beating an optimum. Public multi-task defaults use5,000 epochs of20,000 instances, batch128; these release defaults are reported separately from the54-million CVRP-only protocol. [Section4.2/Tables5/7.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=9)

### CVRPLIB and larger models

Set-X contains100 instances split22/46/32 across the displayed size groups. ReLD averages3.62% and ReLD-MoEL+3.54%, versus ELG6.03%, ICAM without augmentation4.83%, and copied LEHD greedy12.52%. These mix different method/augmentation protocols, and do not establish one universally best generalist. AppendixE actually lists **eight** Set-XXL instances spanning3k-16k, rather than the main text's “four”: ReLD's displayed gaps range7.43-14.69%, better than the listed comparators on those eight cases. [Tables4/8.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=17)

The larger-size training ablation uses a different100-500 training protocol; its distance-enhanced100-start version reaches CVRP7000 objective172.83 versus HGS172.10, without augmentation. This is a separately trained setting, not a zero-shot result from the original40-100 training run. [Table11.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=20)

Offline fine-tuning starts from epoch70 and processes about150k100-500-size instances in5,000 batches. It improves CVRP1000 from7.156% to3.947%, while CVRP100 slightly worsens1.143% to1.148%; it is not test-instance active search. ReLD-Large uses five encoder blocks and two query blocks with shared cached K/V. It improves CVRP1000 to6.265% at2.89min versus6.757%/1.95min. AppendixI explicitly uses **different hardware**, so those runtime values are not mixed with main A800 timings. [Tables12-13.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=21)

### Separate ATSP extension

AppendixF modifies MatNet with random scalar node features, a single encoder branch, mixed distance/transposed-distance attention and max-distance normalization. Both MatNet+ and ReLD use these encoder changes. ATSP-ReLD adds the decoder residual/FF and a modified zero-initialized identity-branch coefficient; this is not exactly ordinary ReZero. It trains on100-node instances for2,100 epochs*10,000 instances, batch128, with four heads of64 dimensions. No distance heuristic, variable-size training or augmentation is used. [AppendixF.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=18)

ReLD gaps are5.390%/1.987%/2.357% at20/50/100, improving MatNet+7.208%/2.821%/2.930%. At200/500, ReLD itself supplies the table reference, with no CPLEX optimum:1.645/1.886 are objectives, not certified optimal results. The official MatNet comparison uses a12,000-epoch checkpoint and cannot run beyond its fixed embedding limit. This task extension does not demonstrate shared VRP/ATSP weights. [Table9.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=19)

## Limitations

### Discussed in the Paper

Light decoders still trail heavy decoders on some large settings. Performance versus computation sharing is a tradeoff, and intermediate sharing/update schedules remain future research. [Conclusion/AppendixB.](https://proceedings.iclr.cc/paper_files/paper/2025/file/447ac93bf22099aa346a45577376492d-Paper-Conference.pdf#page=10)

### Curator Notes

- Static-context bottleneck explanations are supported by particular interventions/ablations, not a general theorem of impossibility or exponential neural capacity.
- Jointly shared VRP models, CVRP-only training, larger-size retraining/fine-tuning, ATSP models and ReLD-Large are distinct experiments with distinct budgets.
- More parameters alone can hurt: alternative FF query/key/value changes and some ID/OOD choices are counterexamples.
- LKH/BKS references, limited Set-XXL coverage, different comparator protocols and absent independent training-seed intervals restrict broad superiority claims.
- The printed outer FF activation differs from the inspected implementation; main/ablation table differences and AppendixI hardware changes are disclosed.

## Reproducibility

- **Full reading:** all21 official ICLR pages, complete bibliography, Figure1 and all13 tables/scientific AppendicesA-I. Architecture, query/distance formulas, multi-task results, ATSP and deeper-query tables were visually inspected.
- **Metadata:** added Singapore Management University alongside NTU; first two authors are equal contributors. arXiv history verifies2March2025 first submission, and official HTML explicitly gives1May2025 publication. The generic conference-notification acceptance date was removed.
- **Supplement inventory:** the actual proceedings landing has only Paper/Bibtex and no separate scientific attachment. OpenReview API returned403, disclosed without claiming to inspect inaccessible material. All named scientific appendices are in the complete read PDF, with no explicit missing source. The532-entry author tree has no PDF/TeX/ZIP/notebook/image scientific extra.
- **Code:** read CVRP/MTL model query/FF/normalization paths, full task-selection/training logic, environment/model mappings, configuration and task READMEs. `Train_ALL` maps exactly the six trained variants; `ALL` maps sixteen, with one task-shared model. CVRP and two multi-task checkpoints are present. No ATSP implementation/checkpoint was identified in this tree; no training or full benchmark rerun was performed.
- **Catalog correction:** moved the stableID `reld` note from specialist to generalist and replaced the unsubstantiated ordinary-TSP task tag with the actual ATSP extension, retaining checkpoint boundaries.
- **Figure:** original complete Figure1/page3 from the proceedings PDF, including all computation-sharing and POMO/ReLD architecture panels.
