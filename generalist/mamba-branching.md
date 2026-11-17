---
id: mamba-branching
short_title: Mamba-Branching
title: 'Towards Better Branching Policies: Leveraging the Sequential Nature of Branch-and-Bound Tree'
authors:
- Ce Zhang
- Bin Zhang
- Guoliang Fan
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/b2f56a345fe0ce337df3bdfb31e2b350-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/b2f56a345fe0ce337df3bdfb31e2b350-Abstract-Conference.html
institutions:
- Chinese Academy of Sciences
- University of Chinese Academy of Sciences
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: A shared contrastively pretrained TreeGate/Mamba branching component transfers across native MILP applications;
  gains use known-optimum cutoffs and have classical, instance-level and statistical exceptions.
code_url: https://github.com/doctor-watson626/Mamba-Branching/
---

# Towards Better Branching Policies: Leveraging the Sequential Nature of Branch-and-Bound Tree

> **TL;DR:** A contrastively pretrained TreeGate encoder and Mamba sequence model share a learned branching component across heterogeneous native MILP applications. Under a controlled SCIP experiment with known-optimum cutoffs, it improves aggregate neural baselines and difficult-instance bound integrals; default reliable pseudocost is substantially faster on easier cases.

## Motivation

A branching decision depends on search history as well as the current candidate set. Instance-independent solver features permit a common policy across heterogeneous MILPs, but treating past states as independent/unordered can discard temporal context. Long histories containing every candidate create many tokens; the proposed Mamba model offers linear sequence processing and a compact representation (Sections1-3).

## Contributions

- A shared TreeGate-derived encoder maps25 candidate features and61 tree features to8-dimensional embeddings.
- Max-pooled candidate anchors define contrastive pretraining against reliable-pseudocost expert selections.
- Mamba processes sequences of candidate embeddings and selected actions with common positional IDs within each branching step.
- Heterogeneous MILP-S/MILP-L tests, expert/root ablations, context-length tests and additional difficult-instance statistics characterize branching performance and cost.

## Methodology

**Pretraining.** The selected expert candidate is encouraged to have greater cosine similarity to the max-pooled candidate anchor than other candidates. The loss subtracts selected-anchor similarity and adds mean unselected-anchor similarity. This is a representation-learning objective, not a proof that the expert choice minimizes total tree size. The teacher is SCIP reliable pseudocost(relpscost), not full strong branching; its history-sensitive features align with TreeGate. AppendixC's controlled TreeGate comparison gives test accuracy.7561 versus.2465 and time137.41 versus512.32s for relpscost versus strong-branch teachers (Sections4.1/C).

**Sequential policy.** At each visited branching decision, all candidate embeddings are followed by the chosen-action embedding; the final/current state omits its unknown action. Embeddings in the same step share a learned positional ID. A Mamba selective state-space layer processes the concatenated history, and mean pooling over each candidate's output dimensions produces logits/softmax probabilities. Autoregressive cross-entropy imitates recorded actions during training, whereas inference feeds back actual previous predictions. This is chronological solver search history, not a promise that every visited node lies on one optimal root-to-leaf ancestry. Token count is the sum of candidate counts plus past actions, not inherently exponential in history length (Sections4.2-4.3/Figure1).

**Configuration and deployment.** Candidate width64 reduces to embedding8; tree network depth3, Mamba state64/convolution4/expansion2. Contrastive Adam uses1e-4; imitation AdamW uses1e-3/weight decay.01/batch32. Training uses100 branching steps(T=99); inference uses24 previous steps plus the current state. The release's49-element deque stores alternating candidate sets/actions, matching that25-state window. SCIP8.0.4 retains classical LP, bounds and branch partitioning. Main neural comparisons use a relpscost root initialization; separate -p variants remove it (Sections5.1/F/Table6).

**Shared-model scope.** A single MILP-L-trained TreeGate+Mamba pair is applied without task-specific reloads to the mixed73-instance test set. Tables22-23 include unitcal_7 and nursesched-medium-hint03: official MIPLIB descriptions identify California seven-day unit commitment and INRC2010 nurse scheduling, respectively. The evaluation code loads both checkpoints once and passes the same models to every test-instance/seed job. This concrete cross-native-task reuse supports generalist constructive classification. What is shared is a learned branching component plus the same classical MILP solver, not a universal end-to-end solution decoder; a separate MILP-S model and homogeneous set-cover auxiliary training do not imply one checkpoint for every experiment (Section5.1/AppendixD/Tables20-23).

## Experiments

**Protocol and reference quality.** MILP-S uses19 train/8 test instances; MILP-L uses25 train/73 test, divided into57 easier cases(reference SCIP under20minutes) and16 difficult cases. Training explores r=0/1/5/10/15 random steps before relpscost, with seeds0-3 for training and4 for validation. Tests use five seeds and geometric means. Critically, all primal heuristics are disabled and each test receives a known optimal objective cutoff; collection omits that cutoff to obtain longer trajectories. These controlled branching experiments do not measure an unassisted complete solver's discovery of unknown primal solutions. Difficult cases use one-hour unnormalized primal-dual bound-gap integrals, while nodes/fair nodes/time describe easier cases (Sections5.1-5.2).

**Aggregate gains and classical exceptions.** MILP-S times are111.78s for Mamba,113.85 for TreeGate and165.59 for T-BranT; relpscost is faster at82.51. MILP-L easy times are123.79/145.44/210.27s, while relpscost takes68.43; fair nodes2053.91 also exceed relpscost1455.49. On16 difficult cases, Mamba's integral12319.55 improves TreeGate14625.68,T-BranT13538.47 and relpscost12741.36. These are aggregate improvements, not a win on every instance: Mamba beats relpscost on9/16 median-seed integrals and loses7; easy runtime wins against TreeGate are34/57 with23 losses. Among MILP-S neural methods it has the lowest fair-node count on only3/8 individual instances (Table1/Figure2/Tables11-13).

Removing root relpscost gives -p time147.96s versus TreeGate163.39/T-BranT257.23 and fair nodes2272.43. A separately trained homogeneous set-cover experiment gives time9.64 versus relpscost11.96s despite more nodes265.07 versus170.81. These help separate root/teacher effects but do not remove the main known-cutoff setting (Tables2-3).

**Statistics.** On easy cases, the node-count Friedman test has p=.2862, providing no significant overall difference. Runtime is significant overall, with Mamba versus T-BranT post-hoc p=.000014 but versus TreeGate p=.071287, above.05. Difficult-integral post-hoc values in Table15 are.011501 versus T-BranT,.007880 versus TreeGate and.114340 versus relpscost. Thus the small aggregate difficult-case advantage over the classical default is not statistically significant at.05 in that test. Table15's method ordering is retained where adjacent prose swaps the two neural comparator labels (AppendixG/Tables14-15).

**Context and architecture.** Longer context is not uniformly better. Training100steps gives111.78s versus118.09 at10 and168.74 at500, with reported training memory7.94 versus35.89GB. At inference,25states minimize reported time111.78s, while50states use fewer nodes2032.14 versus2068.83 but take112.77s;100states take121.98s. Transformer uses a shorter10-step training horizon because100steps exceed GPU memory, while Mamba uses100; this is a practical resource comparison with unequal available context, not an isolation of architecture at equal trained history. Table16's25-step inference reports.00093s/13MB for Mamba versus.075s/1.051GB for Transformer, under its measured setup (Tables7-8,16).

**Ablations and extended difficult cases.** Removing contrastive learning, positional encoding, or replacing Mamba with the tested GRU worsens MILP-S counts; InfoNCE/triplet losses give123.49/127.59s versus111.78 for the selected cosine loss. Additional r-prefix MIPLIB filtering yields9cases; Mamba wins6 and improves the geometric-mean integral10489.28 to7371.76, but loses on ran14x18-disj-8(7082.15 to9582.30), rd-rplusc-21 and reblock115. The prefix/filter list is transparent, but independence of application difficulty from initial letters is asserted rather than established; this is not a random-sampling guarantee (AppendicesI-J/Tables17-19).

## Limitations

### Discussed in the Paper

Expert demonstration collection is time-consuming; future work studies reinforcement learning to reduce it. Compact8-dimensional state limits very long-context performance. Autoregressive prediction errors accumulate as the inference history grows. Transformer training/inference resource limits constrain that baseline. Known-optimum/feasibility, variable-count and minimum-branch-count filters exclude many difficult MIPLIB cases.

### Curator Notes

Proposition1 is a desired strict cosine-margin condition, but its printed AppendixA assumptions do not prove it. Let alpha=(1,1), expert quality F(a)=2, other quality F(b)=1, and both noise vectors zero. Then embeddings2alpha and alpha are distinct and encode quality exactly, satisfying the stated linear model/informativeness assumptions; max pooling gives anchor2alpha, yet both cosine similarities equal1. No positive margin delta follows. The root reviewer independently checked this exact counterexample. It limits the stated argument, not the possibility that contrastive training learns useful noncollinear embeddings or the reported experiments.

Relpscost is an expert reference, not a mathematical upper bound on all branching performance. Conditional exactness comes from completed classical search, not the neural score or a universal optimization guarantee. Known-optimum cutoffs/disabled primal heuristics and the non-significant difficult-case classical comparison must accompany claims of surpassing SCIP. Multiple named native tasks establish shared-component scope; heterogeneous syntax alone would not.

The appendix instance manifests contain transcription inconsistencies, including swapped dimensions for several training entries and rail507 printed rai507 in Table22. Current release code includes absolute /home/data1 paths, external dependencies/data and missing checkpoint artifacts, without a root README/environment specification. It cannot be treated as turnkey reproduction. No training or solver benchmark was rerun.

## Reproducibility

- **Publication:** [ICLR2026 proceedings](https://proceedings.iclr.cc/paper_files/paper/2026/hash/b2f56a345fe0ce337df3bdfb31e2b350-Abstract-Conference.html), official HTML publication date April20,2026. Three authors and Institute of Automation,CAS/UCAS affiliations checked against page1.
- **Scientific coverage:** all29 formal pages, references and AppendicesA-J; complete tables/proofs/context/statistical analyses read, key formulas/results rendered. Publisher scientific ZIP76,718,766bytes has1911members: code, datasets and logs, no PDF/TeX/notebook/image scientific document. Both text documents were read; they explicitly omit the large T-BranT test instances and refer to the original source. Author17,962,510-byte archive also has no additional scientific PDF. Official ICLR event10007964's full scientific poster PNG436398bytes was downloaded/read/inspected; ordinary OpenReview iQKzHeLDrN API returned403.
- **Code:** [doctor-watson626/Mamba-Branching](https://github.com/doctor-watson626/Mamba-Branching/). Training contrastive/autoregressive losses, Mamba/TreeGate model, state/action history, root initialization, solver settings and evaluation checkpoint loading inspected. Nine shared pipeline files byte-match publisher versions; evaluate_print differs. Published logs/data are evidence artifacts, not an independent rerun. Dependencies include PyTorch,mamba_ssm,PySCIPOpt and feature-access extensions; trained checkpoints and all external paths must be supplied.
- **Task identity:** [unitcal_7](https://miplib.zib.de/instance_details_unitcal_7.html) explicitly identifies unit commitment; [nursesched-medium-hint03](https://miplib.zib.de/instance_details_nursesched-medium-hint03.html) identifies nurse rostering. They match the paper's actual test manifests. evaluate_all.py lines178-245 load one model pair before lines366-379 dispatch all instances, establishing shared branching weights.
- **Relations:** fifteen current-catalogue citations verified by explicit body and full bibliography identities, including solver-control, primal/LNS and symbolic-branching background; unrelated sequence-model foundations do not become inferred NCO edges.
