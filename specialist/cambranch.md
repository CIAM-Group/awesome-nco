---
id: cambranch
short_title: CAMBranch
title: 'CAMBranch: Contrastive Learning with Augmented MILPs for Branching'
authors:
- Jiacheng Lin
- Meng XU
- Zhihua Xiong
- Huangang Wang
year: 2024
date: '2024-05-31'
publication:
  date: '2024-05-31'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/7b39f4512a2e3899edcc59c7501f3cd4-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2024/hash/7b39f4512a2e3899edcc59c7501f3cd4-Abstract-Conference.html
institutions:
- University of Illinois Urbana-Champaign
- Tsinghua University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Set Covering
- Combinatorial Auction
- Capacitated Facility Location
- Maximum Independent Set
summary: Integer-preserving MILP shifts augment expert branching data; task-specific GCNNs combine imitation, contrastive
  and prediction-consistency losses.
---

# CAMBranch: Contrastive Learning with Augmented MILPs for Branching

> **TL;DR:** Integer-preserving variable translations produce corresponding MILP branching examples without new strong-branching solves. A GCNN combines imitation, graph-level contrastive learning and prediction consistency. Ten-percent-data models improve several difficult benchmarks, with explicit exceptions for set covering, easier instances and some sample-ratio comparisons.

## Motivation

Strong-branching expert labels require evaluating candidate LP branches and are costly to collect. The reported100k-sample collection costs are26.65/12.48/84.79/53.45 hours for set covering(SC), combinatorial auction(CA), capacitated facility location(CFL) and maximum independent set(MIS). CAMBranch reuses a smaller labeled pool through transformations that preserve the underlying optimization problem and corresponding branching scores, while learning representation invariance (Introduction/Section3).

## Contributions

- Variable-shift augmentation transforms the right-hand side, bounds and objective constant while preserving feasibility/integrality under the specified shifts.
- Primal/dual correspondence and reduced-cost calculations motivate generating augmented graph features without resolving each transformed instance.
- A three-part objective combines strong-branching behavior cloning, graph-level InfoNCE and consistency between original/augmented variable predictions.
- Separate-domain experiments compare10k original expert samples plus augmentation with100k-sample GCNNs, and study sample ratios, full data, ablations and collection/training cost.

## Methodology

**Transformation.** Let x_hat=x+s, choosing integral s_j for integer variables and real s_j for continuous variables. Replace b by b+As, lower/upper bounds by l+s/u+s, and use objective c^T x_hat-c^T s. This is an exact bijection of the original feasible set, with corresponding LP optima and identical objective values. Integer shifts also preserve the floor/ceiling branch partition after translation. For a corresponding fractional LP optimum and exact candidate LP solves, child-bound gains and the associated strong-branching score set match (Section3.1/Lemma3.1/Theorem3.1/AppendixB).

**Theory boundary.** The argument concerns corresponding mathematical states. Under degeneracy, two independently run solvers need not select corresponding LP optima or bases, and tied branching choices need consistent tie handling to produce an identical sequence. Reduced-cost invariance uses corresponding bases; dual optimal sets agree through cancellation of the objective shift, but arbitrary solver-selected dual representatives need not be numerically identical. Presolve, tolerances and approximate strong branching are additional implementation choices. These translation facts do not prove that a trained network is invariant, optimal at branching or faster on every MILP.

**Graph augmentation and network.** A bipartite graph has constraint and variable nodes and coefficient edges. Matrix/objective coefficients and many normalized features stay unchanged; right-hand sides and primal/incumbent values shift. The supplement explicitly allows binary/integer type conversion after translation, rather than assuming a shifted0/1 variable remains binary. The GCNN uses variable-to-constraint and constraint-to-variable message passing, hidden dimension64, and candidate-masked softmax branching scores. Max and mean pooling on each node type, followed by MLP merging, gives the graph embeddings (Section3.2/AppendixC.1-C.2).

**Loss and deployment.** Cross entropy imitates strong branching. Normalized original/augmented graph embeddings form InfoNCE positives; other augmented graphs in the batch are negatives. A squared difference penalizes original/augmented candidate-distribution disagreement. Total loss is supervised+0.05 InfoNCE+0.01 consistency. At test time the learned variable selector operates inside SCIP B&B; completeness/certification comes from the surrounding solver when it terminates successfully, not a neural optimality theorem. Each native problem is explicitly trained/tested separately, so this is specialist constructive search control (Sections3.3/4.1/AppendixC.3).

## Experiments

**Data and setup.** Full GCNN training has100k strong-branching samples per problem; the main CAMBranch setting starts from10k. Expert data come from Easy instances;20 new instances per difficulty are run with five solver seeds, giving100 attempts at each Easy/Medium/Hard level. Imitation evaluation uses20k expert states per problem. The paper refers to the Gasse generators/splits for detailed instance sizes. Models run with SCIP6.0.1, a3,600-second cap, cuts only at the root and restarts disabled; other solver settings are default. Hardware is Xeon Gold5218@2.30GHz,128GB RAM and RTX2080Ti. Adam beta=(0.9,0.999), a learning-rate grid{1e-3,5e-4,1e-4}, and a ten-epoch plateau reduction to20% are reported (Section4/AppendixD).

**Metric interpretation.** Time uses a shifted geometric mean with shift1; AppendixD.1.4 also specifies a node shift100 despite initially calling that metric a geometric mean. Wins/solved counts must accompany times and nodes, especially when timeout subsets differ. Five seeds on twenty instances are100 solver attempts, not100 independent instances or five independent training replications. Imitation accuracy measures agreement with the expert, not solution optimality or total solve speed.

**Main positive cases.** Hard CFL time is470.83 seconds versus full GCNN680.78 and same-data GCNN672.88, with95 solved attempts for each neural method and77 wins for CAMBranch. Hard MIS is496.86 versus1020.58/695.96, with40 solved versus17/20, and10,828 nodes versus21,925/17,034. Medium MIS solves all100 attempts versus89 for10%-GCNN. These support useful data-efficient branching on the tested distributions (Table2).

**Important exceptions.** SC is a strong counterexample to universal superiority: CAMBranch times6.79/61.00/1427.02 exceed full GCNN6.03/50.11/1344.59, and it solves only55 Hard attempts versus GCNN68 and RPB63. Hard SC RPB is also faster at1210.18. Easy CA/CFL full GCNN is slightly faster, and Medium CA10%-GCNN12.38 is faster than CAMBranch12.68. CFL's RPB node counts are lower even where its runtime is worse; fewer B&B nodes and shorter wall time are different outcomes (Table2).

**Imitation, full data and CL ablation.** CAMBranch acc@1 is65.27/67.85/60.50/80.38%, below full GCNN70.39/68.95/61.70/80.70% in all four domains but above10%-GCNN. Full-data CA augmentation reaches1.73/10.04/109.96 seconds and93/88/83 wins in its separately compared table, versus full GCNN1.96/11.30/158.81; win counts depend on the comparison portfolio. CL ablation on SC improves Medium/Hard runtime and solved counts, but Easy runtime worsens6.55 to6.79 and acc@10 slightly drops96.16 to96.14. There is no basis for claiming every metric improves (Tables3/6-8).

**Ratios, data diversity and cost.** Sample-ratio tables are also mixed: CA5% Hard CAMBranch121.81 is slower than GCNN117.90, CA20% Easy/Medium1.68/9.92 exceed1.66/9.81, and MIS20% Easy/Medium6.19/68.47 exceed5.84/55.22. MIS Hard20% solves49 versus43 and is faster416.24 versus465.00. Increasing labels is not universally beneficial: with50 CA instances,10k to20k samples worsens Hard time158.24 to166.02 and nodes9834 to10892. Collection for CFL is reported84.79 hours versus8.48 for10k originals+0.28 augmentation=8.76 hours, an89.67% collection saving, not total training-plus-solving savings. Batch64 SC training takes0.09666 versus0.09216 seconds, about4.9% extra per batch (Tables9-12/Section4.2.3).

## Limitations

### Discussed in the Paper

Imitation agreement and solving performance do not coincide; strong branching itself is not guaranteed to define the best policy. Set covering is the main observed weakness. More expert labels can fail to help when the underlying instance pool is small; jointly improving data diversity and learned policies is left for further study (AppendixE).

### Curator Notes

Translation augmentation changes coordinates, not the feasible combinatorial structures or number of independent source instances. Its exact correspondences should be stated with integral shifts, correctly translated bounds/constant, matched optima/bases and tie handling. They are not a guarantee of identical numerical solver trajectories or neural inference under arbitrary coordinate changes. Multi-domain evaluation uses separate models and therefore does not establish shared cross-task weights.

Rendered Table5 prints augmented inc_val as V_j,11+s_j although original inc_val is column12; translating the incumbent itself requires V_j,12+s_j, consistent with Section3.2. AppendixG also has facility-demand/index inconsistencies. Implementations should derive these quantities from the mathematical variables rather than copying those subscripts blindly. No public author implementation was located through the paper, current author publication entry or official conference resources, so feature generation and the numerical reproduction could not be independently checked against author code. These are precise reproducibility limits, not claims that the reported solver tables are invalid.

## Reproducibility

- **Publication:** [ICLR2024 proceedings](https://proceedings.iclr.cc/paper_files/paper/2024/hash/7b39f4512a2e3899edcc59c7501f3cd4-Abstract-Conference.html), official HTML issued May31,2024. Title, current author capitalization and UIUC/Tsinghua affiliations verified; Lin/Xu are equal contributors.
- **Scientific coverage:** all24 proceedings pages, full bibliography and AppendicesA-G; exact translation/dual/reduced-cost proofs, all feature/result tables and key rendered formulas. The official conference's one-page Slides PDF was registered/read/rendered; its separate poster PNG was inspected and duplicates that scientific poster. Publisher links have no extra supplement; the ordinary OpenReview API request returned403 and was not bypassed. The complete integrated appendix remains available.
- **Resources:** [author publication entry](https://linjc16.github.io/publications/) links the paper without CAMBranch code. The official conference lists paper/slides/poster. No checkpoint, training script or numeric reproduction was verified. Hyperparameters and generator references are documented, but the shift sampling distribution/feature implementation cannot be recovered from a verified author repository in this audit.
- **Relations:** four explicit current-catalogue identities: GCNN branching, hybrid branching, S2V-DQN and Tree-MDP branching. S2V is cited in AppendixF, although the surrounding prose calls those references surveys; the actual bibliography title identifies the solver paper. Other general contrastive-learning or uncatalogued branching references are not local graph edges.
