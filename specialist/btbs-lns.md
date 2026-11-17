---
id: btbs-lns
short_title: BTBS-LNS
title: 'BTBS-LNS: Binarized-Tightening, Branch and Search on Learning LNS Policies for MIP'
authors:
- Hao Yuan
- Wenli Ouyang
- Changwen Zhang
- Yong Sun
- Liming Gong
- Junchi Yan
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/7eca17ef54789b0663cab421f2e9dbf5-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/7eca17ef54789b0663cab421f2e9dbf5-Abstract-Conference.html
institutions:
- Lenovo Research
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Integer Programming
problems:
- Mixed-Integer Programming
summary: Task-specific learned LNS combines incumbent-centered integer interval tightening with binary-unfixing
  policies; local/global teachers, MIPLIB exclusions, solver budgets and public example-code limits qualify reported
  gains.
code_url: https://github.com/hao-design/BTBS-LNS
---

# BTBS-LNS: Binarized-Tightening, Branch and Search on Learning LNS Policies for MIP

> **TL;DR:** Starting from a feasible incumbent, learned neighborhood destruction, incumbent-centered integer bound tightening and an extra binary-unfixing network guide classical reoptimization. Local/global teacher variants yield strong reported means but differ materially; MIPLIB results use cross-validation and exclude22instances, and public example code differs from the formal configuration.

## Motivation

Binary LNS policies can fix important variables too early and struggle with large integer domains. BTBS-LNS studies finer incumbent-centered integer restrictions and an additional policy that revisits some fixed binary decisions. Its aim is better budgeted primal solutions, not learning a complete B&B algorithm or proving globally optimal search (Sections1–3).

## Contributions

- Binary substitute features/actions for general integers guide iterative interval tightening around the incumbent.
- A tripartite variable/constraint/objective representation uses attention without softmax neighbor normalization.
- A separately trained imitation network revisits variables fixed by the RL-LNS policy, with local versus global-reference label variants.
- Native binary/MIP, size-transfer, heterogeneous-MIPLIB and backend/hardware ablations report both benefits and limits.

## Methodology

**Incumbent LNS and bounds.** A baseline solver first supplies a feasible complete assignment. The RL policy chooses which variables to free and which to fix/tighten. Bounded general integers are represented by binary substitute nodes inheriting the original connections/static features, with current binary digits as dynamic features. Consecutive reliable-bit decisions shrink the original variable's interval around its current value; an explore decision stops further tightening. Bounds reset to their original values at each LNS iteration, avoiding irreversible cumulative shrinkage. For original[0,15], current3, the numerical example gives[0,10], then[0,8], eventually[0,6]; current12 eventually gives[9,15]. One-sided unbounded variables receive a virtual opposite bound symmetric about the incumbent; fully free variables are left free (Algorithm1/AppendicesA.2–A.3/A.9).

This is heuristic neighborhood tightening, not a globally valid presolve bound deduction. It retains the incumbent in the ideal restricted subproblem but can exclude better global assignments. All reliable bits need not fix the integer to one value. The paper's ceil(log2(ub−lb))notation/loop indices need endpoint care; the provided code instead sizes binary digits using ceil(log2(ub−lb+1)).

**Graph/RL policy.** Static root features include variable type/objective/bounds/reduced cost, LP constraint features and coefficient edges. Dynamic features include incumbent/average/best values; branching additionally sees the LNS action. Objective nodes aggregate corresponding variable states and connect through objective/RHS coefficients. Six typed message directions are applied sequentially per graph layer: V→O,O→C,V→C,C→O,O→V,C→V. Learned coefficients avoid softmax, while the message sum is still divided by neighbor count. Two64-dimensional graph layers and an MLP yield per-variable destroy probabilities. Q-actor-critic training rewards objective improvement after classical reoptimization (Section3.3/Table7).

**Two branching teachers.** A separate imitation policy, trained after LNS, predicts binary variables to reopen. In BTBS-LNS-G, training labels compare fixed incumbent bits against a best-known reference; the initially described global optimum is explicitly replaced by a portfolio BKS because exact optima are difficult. In BTBS-LNS-L, a local-branching teacher permits up to50changes among previously fixed binary variables and labels useful changed bits. Both use cross-entropy and instance/state/LNS-action features. Deployment predicts without querying the test optimum. A further Hamming budget r*n bounds changes among reopened variables, default r=.1. This branching is neighborhood-variable unfixing, not ordinary B&B tree-node branching; identified differing bits are heuristic backdoor candidates, not a certified tractability backdoor set (Section3.4/Algorithms2–3).

The actual neural decision edits a full incumbent's neighborhood, so **improvement** is supported. Separate native-family LNS/branch checkpoints and heterogeneous-MIPLIB cross-validation do not establish unchanged shared weights across unrelated native test tasks; **specialist** remains appropriate. General integer applicability, a common architecture and generic MIP syntax should not be conflated with same-checkpoint generalist evidence. Unless explicitly suffixed, BTBS-LNS means the **local** teacher variant throughout the formal paper (Sections3/4.1).

## Experiments

**Protocol and reference.** Four binary families(SC/MIS/CA/MaxCut) use200train/20validation/100test instances, plus doubled/quadrupled-variable tests using the corresponding small-task policy. Training uses20epochs per instance,50iterations/epoch and2second subproblem limits; both policies train sequentially. Main native comparisons use200seconds, SCIP7.0.3 backend and Gurobi9.5.0 baseline with aggressive primal-focused settings. CPU experiments use four physical XeonE5-2678v3/2.5GHz cores. Three seeds supply averaged results/standard deviations. Primal gap is absolute objective difference normalized by the larger absolute objective magnitude against a BKS from the compared methods; PI integrates reference-adjusted objective over time. BKS comparisons do not automatically certify optimality (Section4.1/AppendicesA.2/A.5–A.6).

**Small binary results and exceptions.** Global G achieves SC/MIS/CA/MC gaps.35/.05/1.43/.59%, versus local L.47/.05/2.18/1.99. Vanilla Gurobi gives.75/0/1.44/.62, so G is competitive/better in three families but worse on MIS. Local L is **worse** than CL-LNS on CA final gap2.18 versus2.05, while its PI2196.8 slightly beats2198.5. Thus the sentence that both variants consistently beat every LNS baseline in every metric is too broad. PI and final-gap rankings differ (Table2).

**Size transfer.** Larger SC2 favors L.51 over G.68; SC4 favors L.84 over G1.20. CA2 similarly favors L1.67 over G1.89; CA4 L1.39 over G1.46, while MC4 G1.51 narrowly beats L1.52. Gurobi still gives better MIS2 gap.01/PI495.88 than either variant, and MC2 gap1.01/PI2195.6 beats L1.45/3385.9. On CA4 L sharply improves Gurobi gap12.61 to1.39 at200seconds, and reaches the selected BKS at500seconds. The58x runtime claim concerns a particular CA4 target/experiment, not an all-task speedup to a certified optimum (Tables3/5).

**Mixed families and budgets.** Balanced item placement has1050binary/33continuous variables and195constraints; AMIPLIB is a curated general-integer MIPLIB subset. Table4 gives Item L13.82/G13.45 versus Gurobi12.67, with gaps16.82/15.78 versus6.73. AMIPLIB gaps L4.19/G4.35 versus Gurobi.81 also favor vanilla Gurobi. AMIPLIB uses70/15/15 cross-validation,1800second total/60second subproblem limits, unlike native200second tests. Some early-time advantages and roughly27% reported instance wins do not establish final mean dominance (Section4.2/Table4/Figure3).

**MIPLIB scope.** The main text calls this the whole240-instance benchmark, with70/15/15 cross-validation,300second total and5second reoptimization limits. AppendixA.8 explicitly removes six infeasible instances and sixteen instances lacking a SCIP feasible initialization within the cutoff, reporting **218/240** rows. This selection must qualify headline coverage/performance; it does not measure the ability to find an initial feasible solution on all240. Table6 gives BTBS1.75% versus Gurobi1.98% and SCIP15.15%, a.23percentage-point or about11.6% relative reduction from Gurobi. The text's10% is an approximate relative-gap claim, not a ten-point/raw-objective gain. The reported12.4% better-instance/77% equally-good figures need their exclusion/tie/reference convention retained, rather than interpreted as certified optimum frequencies (Section4.5/AppendixA.8).

All218 per-instance table rows were read. They include substantial losses: bab2 BTBS−354092.9 versus Gurobi−357525.96; bab6−280546.4 versus−284248.23; germanrr48440630 versus47135500; proteindesign121hz512p9 2609 versus1477; rail01−69.89 versus−70.57; supportcase26 1755.525 versus1745.124. There are also many ties and BTBS wins, such as nursesched-medium-hint03 117 versus152 and neos-848589 2358.43 versus3206.12. Some rows remain above the column labeled Optimal Solution. The poster's over70% global-optimum language does not supply independent certificates beyond these reported references (Table15).

**Ablations/hardware.** Nineteen MIPLIB instances have unbounded integers before presolve, only four afterward. Special handling improves two and ties two versus leaving them free; Gurobi is still better on gen-ip054/murg/buildingenergy. Branch ratios above the empirical.1sweet spot degrade performance as neighborhoods become too hard. Separate Gurobi-backend runs improve the reported means in Tables11–13, including Item12.27 versus vanilla12.67. The README explicitly requires **separate training** for the Gurobi backend and uses SCIP feature extraction, so this is backend compatibility rather than a frozen-policy transfer experiment. RTX2080 gives small reported Item gap/PI improvements.83/.99% over CPU. Three-seed standard deviations are printed below2% but use mixed objective/percentage notation, not a formal robustness bound (AppendicesA.3–A.6).

## Limitations

### Discussed in the Paper

Broader real-world deployment is future work. Large neighborhood sizes overburden classical reoptimization, and local optima remain possible. Global teachers require expensive best-known training references rather than generally available exact optima. Initialization and one-sided-unbounded handling have explicit practical scope. The Sonnerat baseline is reimplemented with a SCIP initial feasible solution replacing its original neural-diving initialization; that is a modified comparison, not unchanged original code.

### Curator Notes

No theorem proves optimality, a global approximation ratio, guaranteed escape from local optima or polynomial-time backdoor discovery. Incumbent-containing neighborhoods and best-so-far tracking explain feasible improvement in the intended algorithm, subject to correct solver/model handling; they do not make every sampled action useful or remove finite-budget failure. Cross-validation on selected heterogeneous instances is different from zero-shot generality across unknown application domains.

The official scientific supplement is explicitly an example release. Its executable defaults materially differ from the formal configuration: test_LNS_branching.py sets a.25branch-selection fraction,10second subproblems, selects top branch logits and forces their destroy actions, with an additional stagnation-triggered Hamming constraint. The integer example sets180second limits when handling general integers. Consequently, one cannot infer that these defaults implement every formal Algorithm3/r=.1/table configuration. The dedicated integer script's finite-domain path is present, while the formal one-sided-unbounded procedure needs an exact historical deployment path to reproduce. The current GitHub tree contains only the generator Python file plus data/checkpoints/patches/README, despite README commands referencing missing test/train programs; the publisher ZIP contains fuller example inference sources.

Objective-based PI values depend on reference files/sign conventions and runtime handling. Reported teacher labels use BKS rather than a test-time optimum oracle; performance claims and citation descriptions preserve that distinction. No code, checkpoint, patch or solver benchmark was executed during this audit.

## Reproducibility

- **Publication:** [ICLR2025 proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/7eca17ef54789b0663cab421f2e9dbf5-Abstract-Conference.html), official publication date May1,2025. Six authors/two institutions verified; Wenli Ouyang capitalization corrected from publisher lowercase.
- **Coverage:** all25 formal pages, full references/AppendixA.1–A.9 and all218 Table15 rows read, with dense tables extracted in block order and key bound/result/exclusion pages rendered. Official publisher ZIP49717222bytes/505members manually inventoried: code/data/model checkpoints/training logs/README/requirements, no extra PDF/TeX/notebook/scientific image. Complete supplement/current-author READMEs and requirements read; logs identified as training traces rather than extra scientific prose. Official ICLR event28102 poster4355303bytes fully inspected; event links OpenReview siHHqDDzvS.
- **Code:** [hao-design/BTBS-LNS](https://github.com/hao-design/BTBS-LNS) and [formal scientific supplement](https://proceedings.iclr.cc/paper_files/paper/2025/file/7eca17ef54789b0663cab421f2e9dbf5-Supplemental-Conference.zip). Checked complete GitHub recursive tree, task-specific RL/branch checkpoints, actual bound-digit sizing/interval updates, branch-logit action override, classical subproblem timing/initialization and best-so-far tracking. Full training/evaluation completeness remains limited by the example/public-tree mismatch.
- **Relations:** seventeen explicit author-year/bibliographic identities. Pointer Networks is a substring false match inside Ma et al.'s Graph Pointer Networks and does not create a Vinyals2015 edge. Sonnerat's baseline labeled Branching is an LNS paper, not a substituted B&B branching citation; the two-author Xing/Tu2020 IEEEAccess TSP paper is matched to its own stable ID.
