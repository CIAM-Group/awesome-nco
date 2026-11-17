---
id: apollo-milp
short_title: Apollo-MILP
title: 'Apollo-MILP: An Alternating Prediction-Correction Neural Solving Framework for Mixed-Integer Linear Programming'
authors:
- Haoyang Liu
- Jie Wang
- Zijie Geng
- Xijun Li
- Yuxuan Zong
- Fangzhou Zhu
- Jianye Hao
- Feng Wu
year: 2025
date: '2025-05-01'
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/ebcdb4d0372ebbdd0e6a7dce9662b6b4-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/ebcdb4d0372ebbdd0e6a7dce9662b6b4-Abstract-Conference.html
institutions:
- University of Science and Technology of China
- Huawei Noah's Ark Lab
- Tianjin University
- Shanghai Jiao Tong University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Integer Programming
problems:
- Mixed-Integer Linear Programming
summary: Task-specific neural predictions alternate with classical trust-region references and agreement fixing;
  feasibility is witnessed, while the printed general UEBO KL bound and optimality-preservation claims need qualification.
figure:
  path: paper-assets/apollo-milp/framework.png
  alt: Alternating neural prediction and trust-region correction in Apollo-MILP.
  caption: 'Figure 2: Alternating neural prediction and trust-region correction in Apollo-MILP.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/ebcdb4d0372ebbdd0e6a7dce9662b6b4-Paper-Conference.pdf
code_url: https://github.com/MIRALab-USTC/Apollo-MILP
---

# Apollo-MILP: An Alternating Prediction-Correction Neural Solving Framework for Mixed-Integer Linear Programming

> **TL;DR:** A task-specific GNN repeatedly predicts binary-variable values on a progressively reduced MILP; classical trust-region solves supply reference solutions, and only agreeing predicted/reference values are fixed. Reported primal quality improves the selected baselines, but agreement preserves a feasible witness rather than an optimum, and the printed unconditional UEBO KL bound has a counterexample.

## Motivation

Incorrect neural fixing can eliminate good solutions or make a reduced MILP infeasible. Predict-and-search softens these assignments with a trust region but retains a larger search space. Apollo alternates neural prediction with solver feedback to select a smaller set of apparently reliable assignments (Sections1-3).

## Contributions

- Alternating prediction, classical correction and consistency-based fixing progressively reduces the instance.
- A predictor is trained on original and artificially reduced instances using weighted solution pools.
- UEBO combines predictor entropy and disagreement with a solver reference as a motivating uncertainty heuristic.
- Theory separates a conditional precision argument and a feasible-reference witness; experiments cover four main MILP families, selected MIPLIB instances, size transfer and additional power/production applications. The claimed general KL bound requires the correction documented below.

## Methodology

**Learning and prediction.** A bipartite four-half-convolution GNN predicts Bernoulli marginals for binary variables, assuming factorized predictions. Labels average up to50 solver solutions with weights proportional to exp(-objective), rather than proving exact optimal marginals. For each original training instance, five reduced examples fix30-70% of variables to values from a collected good solution; their own solution pools support training. Features include normalized objective/coefficient/degree information and a12-bit variable-position encoding, so the encoder is not simply an order-free representation (Sections3-4.1/AppendicesD-E).

**Correction and fixing.** Select k0 low-probability variables as0 and k1 high-probability variables as1. A conventional solver searches a Hamming/L1 trust region of radius Delta around that partial assignment while respecting the current reduced MILP. Among selected variables, only those agreeing with the returned feasible reference solution are permanently fixed. The next predictor sees this reduced instance. Four solver allocations are100/100/200/600seconds; the last iteration solves a trust-region problem to obtain its best primal solution. UEBO is not directly computed in the actual fixing rule: equality of hard predicted/reference values is used instead (Sections4.2-4.3/Algorithm1/AppendixB).

**Guarantees and their limits.** Theorem3 is a conditional probability comparison under Assumption1's consistency inequalities, not an unconditional theorem that fixing is correct. Corollary4 is a valid feasibility witness argument: the feasible reference agrees with every retained fixing, hence remains feasible in the reduced problem. It does not establish that any original global optimum remains. The optional strict objective-improvement cut excludes that witness and is not covered by the same proof; a better solution might not exist. The single-label consistency/entropy motivation is distinct from a certified KL bound (Section4.3/AppendixC).

**Classification.** Predictors and hyperparameters are trained/configured for each family, with transfer to larger CA/SC instances within those families. Neural prediction constructs variable assignments before classical solves and does not edit a complete feasible incumbent. Despite repeated classical reference solves, the neural paradigm is constructive, replacing the earlier mixed label; scope remains specialist.

## Experiments

**Data, references and compute.** Main families are combinatorial auction(CA), set covering(SC), item placement(IP) and workload apportionment(WA, called appointment in the paper), with240/60/100 train/validation/test instances each. Main sizes are1500/5000/1083/61000 variables; IP and WA contain continuous variables but no general integers. One-thread Gurobi runs3600seconds per label instance, collecting its best50 solutions, before neural training up to10000 epochs with early stopping. GPU3090/XeonE5-2667v4, PyTorch/Geometric, SCIP and Gurobi are reported. These offline costs and extra reduced-instance labels are distinct from the1000second online search allocation (Section5/AppendicesD,F).

BKS is a one-hour Gurobi best primal objective for CA/SC; for IP/WA it is replaced by Apollo's own better reported result. Absolute/relative primal gaps therefore measure distance to a best-known reference, not a certified optimum; Apollo's zero IP/WA gaps follow this reference choice. All main runs reach their caps. ND/ConPS are the authors' reimplementations, with AppendixI reproduction checks on NNV/IP, rather than the original authors' exact historical checkpoints (Sections5.1-5.2/AppendixI).

**Main results.** With Gurobi, mean absolute gaps are129.41/0.10/0/0 versus standalone319.07/0.45/0.48/0.61 and ConPS152.49/0.25/0.19/0.49. With SCIP, gaps777.25/0.55/3.96/4.41 improve standalone1072.48/1.85/5.60/4.74 but are far from zero on IP/WA. Consequently a claim of more than50% improvement on every backend/task is incorrect. Table1's CA improvement cell52.2% also does not equal the reduction59.44% computed from its displayed mean gaps319.07->129.41; no unreported per-instance aggregation is assumed. The1000-versus3600second claim concerns IP/WA best-known primal quality, not proven-optimal runtime (Table1/Figure3).

**Ablations and negative settings.** Direct fixing, repeated PS and warm-start variants give worse main IP/WA objectives than consistency-based correction, but baseline labels are described in reversed ways in Section5.3 versus AppendixH.3; table labels are retained without asserting a resolved implementation identity. Increasing fixing coverage or rounds is not uniformly helpful: CA70% coverage gap686.61 is much worse than50%129.41, and five equal-time rounds726.89 are worse than four equal-time228.38. Removing reduced-instance augmentation gives222.94 versus129.41. Different time allocations/radii materially change quality, so defaults are application tuned (Tables2-3,13-19).

**Additional applications and transfer.** An11-instance selected MIPLIB subset trains on8 and tests only ramos3/scpj4scip/scpl4; instances with presolve over300seconds or GPU-memory overflow are excluded. Mean gap18.33 improves Gurobi23, while all three tested objectives remain above their MIPLIB references; this is not entire-MIPLIB coverage. SCUC/APS absolute gaps7285.23/44525.71 improve selected baselines but remain nonzero; APS includes9600 general integers, extending beyond the main mixed-binary setting. Smaller CA reaches the reported reference in94.04s versus105.61 Gurobi. On100 larger CA/SC cases, gaps333.02/0.71 improve ConPS403.65/0.73, with the SC advantage modest (Tables11-12,20-21).

## Limitations

### Discussed in the Paper

Reduced instances differ from the original training distribution, motivating augmentation. Prediction quality and trust-region/partial-size/time budgets affect results. Heterogeneous MIPLIB requires a similarity-selected subset and tuned hyperparameters. Future work extends the correction framework and its applicability (Sections4-6/AppendicesF-H).

### Curator Notes

**UEBO is not a general KL certificate as printed.** Proposition1 defines d(p,qref)=-sum qref*log p and claims KL(p||qtrue)<=H(p)+d(p,qref). Let p be Bernoulli0.5, qtrue Bernoulli0.01 and qref=qtrue independently of the predicted value. This also satisfies the proof's mixture identity. KL=0.5*log50+0.5*log(0.5/0.99)=1.61446, while H(p)+d=2*log2=1.38629. AppendixC.1's Jensen step actually weights log qref by p, opposite to its declared d. The inequality is false in the stated generality. A second reviewer independently read the rendered original pages6/20 and confirmed this counterexample. This qualifies a theoretical claim; it does not establish invalid empirical feasible solutions or negate agreement's heuristic usefulness.

**Feasibility is weaker than optimality preservation.** For min x over one binary variable, a predictor selecting1 and a radius-zero correction yield reference1; agreeing fixing x=1 is feasible but excludes the optimum x=0. A relative precision improvement under assumptions is not a joint certificate that all fixed variables match some global optimum. The optional strict objective cut can also make an otherwise witnessed reduced problem infeasible. The reported test curves cannot supply such guarantees.

**Release limitations.** The original author repository is partial: its README command defines the prediction_correction function without calling it at the file end; the loaded pretrain path differs from its sole supplied models/IP.pth, and task hyperparameters are implemented only for IP. More materially, fix_variable marks selected variables with status1 while the subsequent trust-region loop skips every status other than2, leaving no selected-variable distance terms on that path. These observations concern the inspected public revision, not proof that the historical experiments executed the same code. No checkpoint was loaded or solver run. The README also links a later MILP-X integration; that separate framework is not treated as the original evaluated release.

## Reproducibility

- **Publication:** [ICLR2025 proceedings](https://proceedings.iclr.cc/paper_files/paper/2025/hash/ebcdb4d0372ebbdd0e6a7dce9662b6b4-Abstract-Conference.html), official HTML issued date May1,2025; all eight authors and USTC/Huawei/Tianjin/SJTU affiliations checked against page1.
- **Coverage:** all28 pages, full bibliography and AppendicesA-I read; architecture, equations, proofs, benchmark/ablation tables and reproduction figures visually checked. Publisher action list has no separate supplement; official ICLR2025 event28474 has no additional scientific PDF. The complete445554byte author ZIP contains code/model assets and no PDF/TeX attachment. Ordinary OpenReview API mFY0tPDWK8 returned403 without bypass.
- **Implementation:** [MIRALab-USTC/Apollo-MILP](https://github.com/MIRALab-USTC/Apollo-MILP), now linked in metadata. README, Apollo.py, GCN/helper and solver logic inspected. The original code uses Gurobi9.5.2/PySCIPOpt4.2.0/Ecole0.8.1/Python3.9/PyTorch1.12.1; full training/benchmark reproduction was not executed.
- **Relations:** twenty current-catalogue papers have explicit body citations and matching bibliography entries. These encode cited work, not inferred method ancestry; the TPAMI HEM extension is not mistaken for a new local ID, and absent similarly named ND/LNS papers receive no invented edge.
