---
id: l2c-insert
short_title: L2C-Insert
title: Learning to Insert for Constructive Neural Vehicle Routing Solver
authors:
- Fu Luo
- Xi Lin
- Mengyuan Zhong
- Fei Liu
- Zhenkun Wang
- Jianyong Sun
- Qingfu Zhang
year: 2025
date: '2025-05-20'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/7e3192a54b4ce5855a90dc182eac2036-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2505.13904
code_url: https://github.com/CIAM-Group/L2C_Insert
institutions:
- Southern University of Science and Technology
- City University of Hong Kong
- Xi’an Jiaotong University
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A supervised insertion-position policy uses rule-selected customers to construct routes, then guides the
  paper’s own geometric destroy-and-reinsert incumbent search; local candidate restriction enables large instances
  with quality/runtime trade-offs.
figure:
  path: paper-assets/l2c-insert/framework.png
  alt: A rule-selected current node, unvisited-node context and adjacent-node insertion-position tokens feed a heavy
    attention decoder that predicts the insertion gap.
  caption: 'Figure 2: L2C-Insert learns insertion position; the current customer is selected by a fixed rule.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=4
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/7e3192a54b4ce5855a90dc182eac2036-Abstract-Conference.html
---
# Learning to Insert for Constructive Neural Vehicle Routing Solver

> **TL;DR:** Select the next customer with a fixed proximity rule and learn **where to insert it** into a partial route. The same supervised policy powers the paper's new geometric destroy-and-reinsert search over complete incumbents. Its strongest results use100–1,000 reconstruction iterations and restricted local context, with separate TSP/CVRP weights. The network does not jointly learn customer selection and insertion position.

## Motivation

Appending commits to a partial route's current endpoint. Inserting a selected customer between existing visited nodes can change a different local connection, providing another set of construction trajectories and a useful reconstruction operator. Both paradigms can represent complete tours; insertion does not by itself create a strictly larger feasible set of final TSP tours. A temporarily crossing partial route can also be useful once unvisited nodes are included, as the paper's own Figure4 illustrates. The work studies learning insertion choices rather than inventing the classical insertion operation. [Sections1–3/AppendicesE/I.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=1)

## Contributions

- A light encoder/heavy decoder predicts a masked distribution over gaps between adjacent visited nodes, with separate current-node, unvisited-node and position token types.
- A supervised target follows the labelled tour's cyclic order after omitting the other unvisited customers, teaching the correct insertion gap.
- A new **distance-based local reconstruction** removes nearby customers from a complete incumbent, reinserts them using the learned policy and retains a better solution.
- Local candidate restriction and feature scaling support experiments up to100,000 nodes. The reported large-instance gaps remain nonzero, and some smaller-instance baselines outperform it at lower budgets.

## Methodology

### What the neural policy selects

The unvisited customer nearest to the **previously inserted customer** is chosen by a rule. TSP uses Euclidean proximity. AppendixE.1 specifies depot-centered **polar-angle proximity for CVRP**, refining the main text's generic Euclidean description. The network predicts an insertion *position*, not which customer to insert. Learning a joint customer-selection policy is explicitly future work. [Sections2.3/3.1/5 and AppendixE.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=4)

For TSP, every cyclic adjacent pair in the partial tour defines a possible insertion gap, including the closing edge. Its two node embeddings are concatenated and projected from2d to d. The current node and remaining unvisited nodes have separate projections. Their tokens jointly pass through nine heavy decoder attention layers, followed by a scalar projection and masked softmax over valid position tokens. The encoder has one attention layer. Main dimensions are128, eight heads, query/key width16 and feed-forward width512; normalization is removed from the attention layers, despite its appearance in the generic introductory formula. [Figure2/AppendixN.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=4)

CVRP starts with the depot and a nearest customer. A depot-to-depot gap represents beginning a new route. Position tokens additionally carry the corresponding route's remaining capacity, and capacity-infeasible insertions are masked. Extra zero pairs used for batch padding are masked separately from the real new-route gap. For the tested ordinary CVRP, new singleton routes remain available when each customer's demand fits the capacity; this does not establish feasibility handling for arbitrary additional constraints. [AppendixB.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=24)

### Supervised training

Separate one-million-instance TSP100 and CVRP100 datasets use Concorde and HGS labels, respectively. HGS labels are near-optimal heuristic solutions rather than certificates. Start from a single randomly chosen labelled-tour node, follow the fixed customer-selection rule, and insert the next customer at the gap between its two adjacent *already visited* nodes in the restricted labelled cyclic tour. Negative log-likelihood trains this position classifier. The label determines targets during training; it is not an optimal tour supplied as test input. [Figure3/AppendicesK–L.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=5)

TSP uses Adam for50 epochs and CVRP AdamW for15, batch1,024, initial learning rate.0001 with.97 decay each epoch, on one RTX4090/24GB. The visible trainer updates after individual insertion decisions; epochs/batches should not be mistaken for an equal number of optimizer updates. The training presentations are50M and15M labelled instances, with many insertion targets per instance.

### Construction followed by the paper's own improvement search

First construct a full tour greedily. Local reconstruction then chooses a random seed customer, removes a geometric neighborhood, joins the remaining tour/routes, and uses the neural position policy to reinsert the removed customers. A complete candidate replaces the incumbent only if its original objective is better. Model weights remain fixed during this search. CVRP reconstruction may act across different routes while maintaining capacity masks. [Section3.3/AppendixB.3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=6)

The paper's principal inference uses k=100 for TSP and200 for CVRP, separately restricting nearby unvisited-context nodes and insertion positions; position distance is the minimum distance to either endpoint. Reconstruction size is bounded near300, and coordinates of the selected local context are independently min-max scaled by axis for sizes above1,000. The implementation recomputes the encoder on this restricted context, rather than materializing unrestricted100K-node attention.

The catalog classifies the **whole principal solver as constructive-improvement**, consistent with LEHD's own construction plus reconstruction protocol. AppendixI calls the lower-level insertion network purely constructive and explicitly distinguishes its upper-level LNS-style improvement application. Both statements are retained: the model's primitive constructs partial routes, while the paper's own principal final pipeline also edits complete incumbents. Separate problem-specific checkpoints make it **specialist**. [AppendicesF–J.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=30)

## Experiments

### Dataset sizes, reference quality and time

Synthetic tests contain10,000 instances at100 nodes;128 TSP or100 CVRP instances at1,000; and only16 instances per task at10K,50K and100K. CVRP capacities are50/200/300 at100/1K/larger sizes. Main neural computation uses one RTX4090. Classical CPU times are explicitly not directly comparable; some heatmap/SO-mixed baseline numbers are borrowed from their original papers. LEHD's reconstruction destruction size is capped at1,000 in this comparison. [Section4/AppendixC/G.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=6)

TSP gaps use LKH references, and CVRP gaps use HGS. These are heuristic-reference gaps. Even a solver named Concorde is not automatically a proof that every displayed run is optimal: Table1's TSP10K Concorde row is.310% above the LKH reference, and no optimality certificate is provided there.

| Setting | Greedy gap |1,000-reconstruction gap | Total time at1,000 iterations |
| --- | --- | --- | --- |
| TSP100 |.459% |.0002% |8.0h for10,000 |
| TSP1K |4.754% |.481% |46.4min for128 |
| TSP10K |7.754% |2.079% |16.64min for16 |
| TSP100K |7.419% |4.920% |26.07min for16 |
| CVRP100 |3.892% |.413% |10.6h for10,000 |
| CVRP1K |8.009% |4.836% |2.05h for100 |
| CVRP10K |12.901% |8.646% |34.72min for16 |
| CVRP100K |8.804% |8.168% |1.16h for16 |

The search gain is important, especially at100 nodes, but is not uniformly cheap or near-optimal. On CVRP1K, BQ's4.762% in15 minutes is better than L2C's4.836% in2.05 hours; LEHD gives3.028% in4.15 hours. On TSP1K, L2C improves LEHD's.731%/5.2 hours to.481%/46.4 minutes in this protocol. At100K,8.168% CVRP and4.920% TSP gaps demonstrate scalability with a remaining quality deficit. [Tables1–2.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=7)

Different test-set sizes explain why a larger graph can have a lower *total* test time. AppendixH's amortized TSP times at1,000 reconstruction iterations are2.9/21.8/62.4/97.8 seconds per instance for100/1K/10K/100K. These divide batched whole-set time by instance count; they are not measured unbatched service latencies. [Table14.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=32)

### Benchmark and architectural evidence

The real-data evaluation selects49 symmetric EUC_2D TSPLIB instances and100 CVRPLIB Set-X instances up to1K nodes. At1,000 iterations the displayed aggregate gaps are.308% and3.201%, versus LEHD.380%/3.512%. These aggregates do not certify an improvement on every benchmark instance or describe all TSPLIB/CVRPLIB variants. [Table3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=8)

The matched-training append/insert comparison favors insertion quality at the tested search counts. At1,000 iterations, however, TSP100 insertion takes8 hours versus appending2.28 hours, and TSP1K46.4 versus16.88 minutes. Equal iteration count is not equal runtime. Geometric destruction improves1K/10K gaps from1.182/6.980% under sequence destruction to.481/2.079%. [Tables4–5.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=9)

The greedy backbone study has important negative cases: insertion loses all six aggregate groups with the INViT-based variant and all three TSPLIB groups with the POMO-based variant, while gaining its three CVRP groups. The LEHD-based insertion variant wins four groups, but its overall TSPLIB gap2.691% is worse than appending2.626%. Insertion is not universally better independently of architecture and inference setup. [Table12.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=30)

### Input and hyperparameter studies

CVRP polar proximity improves greedy100/1K gaps5.151/10.155→3.892/8.009% versus Euclidean node selection. Random selection is weaker in the presented experiment. The TSP selection/position-encoding ablations use only ten training epochs, not the main50-epoch budget. Removing unvisited context worsens greedy TSP100 gap.460→5.161% and1K4.757→23.979%, while reducing runtime. This is a quality/compute trade-off, not a proof that full unvisited context is indispensable for all methods. [Tables8–11.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=28)

Increasing k or destruction size is not uniformly beneficial. The selected k=100/200 and cap300 are empirical settings. Table7's CVRP1K50-iteration hyperparameter result42.783 is better than the main1,000-iteration row43.152; the exact setting/version difference is not reconciled in the source, so those tables are not merged into one monotone search trajectory. Similarly, the main prose's claim that200 iterations beats GLOP at50K/100K conflicts with Table2; its quoted relative gains correspond to the **1,000-iteration** row. [AppendixD/Table2.](https://proceedings.neurips.cc/paper_files/paper/2025/file/7e3192a54b4ce5855a90dc182eac2036-Paper-Conference.pdf#page=27)

## Limitations

### Discussed in the Paper

Customer selection is still a non-learned greedy rule. Better architectures, joint node/position learning, appending/insertion combinations and broader task coverage remain future work. AppendixI distinguishes the constructive model from its search application.

### Curator Notes

- Main result quality depends substantially on repeated incumbent reconstruction. Pure greedy construction can be weaker than appending baselines, and longer search does not win every quality/runtime comparison.
- Restricted candidate pools, coordinate normalization, capacity scaling and task-specific node-order rules are part of the tested protocol, rather than one unrestricted universal policy.
- AppendixJ's unrestricted heavy-decoder attention cost is cubic in n at fixed depth/width. Restricting decoder tokens gives an approximately fixed-k attention cost per step, but does not prove the entire implementation—including neighbor scans, sorting and reconstruction bookkeeping—is linear.
- NLL diverges as target probability vanishes, but its softmax-logit gradient is bounded (`p − one_hot(target)`); AppendixL's intuitive discussion is not a proof of unbounded logit gradients or guaranteed optimization convergence.
- The checklist explicitly reports **no statistical-significance analysis** and uses a fixed-seed convention. These tables are not independent-training-seed confidence intervals. Large100K tests contain16 instances per task.

## Reproducibility

- **Reading:** all40 official NeurIPS pages, complete references/checklist and AppendicesA–P,15 tables and six figures. Architecture, target construction, all principal result/budget/ablation tables, local-search positioning and TSPLIB/CVRPLIB insertion visualizations were read; key formulas and figures were visually inspected.
- **Metadata:** seven authors and SUSTech, City University of Hong Kong and Xi’an Jiaotong University checked. The edition/volume year remains2025. The actual publisher HTML gives electronic-record publication date23April2026, now stored as `date`/`publication.date`; this is not an inference about first public availability or conference dates. The arXiv history separately verifies first submission20May2025 and v3 on30October2025. The generic conference notification acceptance day was removed.
- **Scientific inventory:** actual publisher page links the complete40-page paper without a separate supplement. OpenReview API forSXr3Dynctm returned403, disclosed without claiming unseen attachments. The63-entry official tree has no extra PDF/TEX/notebook/ZIP scientific document. README cloud links are labelled training/test data; all named scientificA–P content is in the read paper.
- **Implementation read:** README, representative TSP/CVRP model and trainer paths, nearest-customer functions, restricted-context encoding, local destruction/acceptance and synthetic-test entry configurations. Actual trainers use negative log-likelihood with an optimizer step per insertion. Reconstruction keeps better complete solutions without updating model weights; entry scripts select k100/200, cap300 and large-scale normalization.
- **Actual geometry:** CVRP uses unwrapped absolute `atan2` differences for selecting customers and unvisited context; it does **not** take the shortest modulo2pi angular distance. Candidate-position filtering uses Euclidean minimum endpoint distance, and destruction uses Euclidean neighborhoods. Thus “polar proximity” is not applied identically to every stage. The formal arctan-ratio shorthand and release atan2 implementation are distinguished.
- **Local attention:** for large instances, selected current/unvisited/edge-endpoint coordinates are gathered, optionally normalized, then passed through the encoder. The release does not first encode every100K node with unrestricted attention. The cap samples removal sizes below the bound, so it is not a fixed300-node destruction every iteration.
- **Version/budget boundary:** some borrowed baselines have different hardware provenance, LEHD uses a modified destruction cap, and the CVRP test routine explicitly reseeds1234 while the checklist describes seed123. Source tables, code defaults and actual benchmark execution are not asserted identical. No full training or benchmark rerun was performed.
- **Citation identity:** both formal SIL reference26 and its six-author preprint precursor45 map to the documented formal representative, with their original versions retained. DAR/ICAM references retain early arXiv titles. Duplicate NeuOpt references55/81 describe the same work despite inconsistent printed years, and main prose's incorrect UDC→GLOP reference number is not used to create a false identity.
- **Figure:** original complete Figure2, page4, cropped directly from the formal paper. [Official implementation](https://github.com/CIAM-Group/L2C_Insert).
