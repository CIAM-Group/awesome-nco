---
id: sawt
short_title: SAWT
title: Learning Solution-Aware Transformers for Efficiently Solving Quadratic Assignment Problem
authors:
- Zhentao Tan
- Yadong Mu
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/tan24d.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/tan24d.html
institutions:
- Peking University
scope: specialist
paper_type: solver
paradigm: improvement
problem_families:
- Graph Matching
problems:
- Quadratic Assignment Problem
summary: Separate facility and location encodings with assignment-dependent attention learn feasible permutation
  swaps for budgeted Koopmans-Beckmann QAP improvement.
code_url: https://github.com/PKUTAN/SAWT
---

# Learning Solution-Aware Transformers for Efficiently Solving Quadratic Assignment Problem

> **TL;DR:** SAWT improves a feasible facility-location permutation by learned swaps, using separate facility/location embeddings and assignment-dependent pair costs in attention, avoiding the full association-graph representation.

## Motivation

Association-graph solvers build n-squared candidate-pair vertices with potentially n-to-the-fourth pair interactions. SAWT targets Koopmans-Beckmann QAP, whose cost factors into facility flows and location distances, with a smaller representation and iterative improvement policy. This factorized input is more restricted than an arbitrary Lawler affinity matrix (Sections1-2).

## Contributions

- Independently encode facility flow structure through mixed-score attention and location geometry through a GCN.
- Combine these representations according to the current assignment, injecting assignment-dependent pair costs into a solution-aware Transformer.
- Train an actor-critic swap policy without optimum labels, evaluating generated QAPs, size/distribution transfer, QAPLIB and separately trained TSP models.

## Methodology

**Improvement process.** Maintain current and best-so-far feasible permutations. Sample two distinct facilities and swap their assigned locations, preserving bijection. Accept the new current state even if worse; reward only a decrease in best-so-far cost, and return the best encountered solution after a step budget. This is exploration with a retained incumbent, not monotone descent of every visited assignment (Section4).

**Network and training.** Facilities start from random one-hot features with nominal dimension128 and two mixed-score attention modules using flow values. Three residual GCN layers encode two-dimensional location coordinates and distance weights. Concatenate each facility with its assigned location, then apply two/three solution-aware attention blocks. Separate current/best encodings feed a sequential two-index policy and critic. REINFORCE-style advantages, eight-step bootstrapping, discount0.99, entropy and value losses train400-step episodes with Adam (Section5; AppendixA).

**Attention formula and implementation.** The intended pair cost is F elementwise-multiplied by the distance matrix with both indices reordered by the incumbent assignment. Printed Equation8 defines only Dsigma=Xsigma D, but the next-page explanation uses D[sigma(i),sigma(j)]. The inspected code implements the latter by permuting coordinates and recomputing all pairwise distances. It multiplies cost into attention after softmax; printed Equation9 places the multiplication before softmax. These operations are not algebraically equivalent and should not be silently conflated (Sections5.2/AppendixA; author code).

**No gradient-descent theorem.** AppendixB correctly derives the continuous gradient F-transpose X D-transpose + F X D, reducing to2 F X D for symmetric matrices. Its subsequent assertion that this matches the elementwise cost matrix is false in general: F=D=[[0,1],[1,0]], X=identity gives elementwise cost F but gradient2I. Even a correctly computed continuous gradient would not guarantee the sampled discrete swap reduces cost. The architectural signal is objective-related information, without an exact optimization, convergence or approximation guarantee (Section5.2/AppendixB).

## Experiments

**Generated tasks and references.** QAP10/20/50/100 have unit-square location coordinates and symmetric uniform flows, with entries removed with probability0.7. Each size uses5,120 training and256 test instances. Models train200 epochs with batch512,400 search steps and learning rate1e-3. Testing uses2K/4K/10K swaps. Reported gap is a ratio of mean costs against a finite5,000-step tabu-search reference; only QAP10 has a Gurobi-proven optimum. Negative gaps on larger tasks therefore mean beating that reference, not surpassing a certified optimum. Tabu search is a heuristic despite being called an exact solver in the paper (Section6.1/AppendixD).

**Quality and total test time.** At10K steps, mean gaps are0.00/-0.54/-0.04/0.52% for QAP10/20/50/100, with total times2m30s/2m32s/2m40s/7m32s over256 instances. TS5K gives0-reference gaps but takes11m10s/1h38m/17h56m/6d23h34m, with four CPU units used for QAP100. Faster neural inference is conditioned on these implementations, devices, batch sizes and search budgets; TS5K has the better QAP100 mean1608.82 versus1617.23. SAWT is not the fastest solver in every quality regime: one-shot spectral methods and some DACT rows are faster (Table1).

**Distribution transfer.** Policy50 transfers without retraining to QAP20/100 and QAPLIB. The common small-instance QAPLIB subset has class-aggregated mean gap26.8% versus RGM35.8%, with12.11 versus75.53 seconds per instance. SM/RRWM are faster but weaker on average. SAWT loses on categories such as kra30.1 versus RGM15.0 and sko17.7 versus RGM10.6; chr110.7 and ste93.5 remain large. The min/max columns are aggregates of category statistics, not a global47% worst-case guarantee. Full Table13 includes much worse individual cases such as chr20a201.2% and esc128206.2%; reference values are labeled upper bounds/best-known values and are not newly certified by SAWT (Tables2-3/13; AppendixF.5-F.6).

**Ablations, initialization and TSP.** Both independent embedding and solution-aware attention improve QAP20 in Table4. Random initialization at test time alone can worsen quality; training and testing with random starts improves the reported means, but not every category over the fixed-start version. Against TS5K the stated winning rates are100/72.26/67.42/10.15% across the four sizes, underscoring that mean results do not imply instance-wise superiority. TSP20/50/100 models are explicitly trained on TSP data: SAWT gaps0/.04/.22% versus NeuOpt0/0/.02. This demonstrates architecture reuse with task-specific training, not one unchanged generalist policy (Tables4-6/9-10; AppendixF).

**Training/inference cost.** Reported per-epoch times are1m40s/4m20s/9m54s/19m48s on a3080Ti/i5-12600KF. At200 epochs this corresponds to about5.6/14.4/33/66 hours per size before other development costs. Neural inference tables exclude that training. Encoder+decoder timings do not sum to total because of CPU action sampling and CPU/GPU overhead; Table11 explicitly reports the larger end-to-end total (Sections6.1-6.2; AppendixF.4).

## Limitations

### Discussed in the Paper

QAPLIB's distribution diversity leaves high gaps, especially sparse/different flow-distance regimes. The authors suggest meta-learning to improve transfer. Different random-start protocols affect variance and quality, and model initialization imposes a size capacity (Section7; AppendixF).

### Curator Notes

The paper contains further inconsistencies: AppendixF.6 calls p=.7 a density while Section6.1 uses it as deletion probability; some ablation prose differs from its table; AppendixF.1 says512 test instances while main/Figure4 say256. The AppendixA example samples only100 one-hot indices despite claiming a128 pool. Thus the code snippet does not establish arbitrary transfer to every n<128, and the claim to solve all QAPLIB sizes up to256 requires a precise larger-instance initialization/input conversion not supplied by that snippet.

The public release confirms current/best permutation swaps, two-index geometric costs and negative-entropy minimization. Printed Equation16 instead adds positive entropy to a minimized loss, which would favor lower entropy. Its optimizer-decay defaults and after-softmax attention also differ from the printed design. Current repository code mainly reproduces coordinate-based generated QAPs; it does not provide the full arbitrary-distance QAPLIB/TSP pipelines or every adapted baseline, so those results were not independently rerun. The README recommends40GB A40 training for QAP50/100, whereas the paper reports12GB3080Ti training; both statements should retain their provenance.

## Reproducibility

- **Publication:** [ICML2024/PMLR235](https://proceedings.mlr.press/v235/tan24d.html), pages47627-47648, July8,2024 from official HTML citation metadata and publisher issued source; separate from event dates.
- **Complete reading:** all twenty-two [publisher PDF](https://raw.githubusercontent.com/mlresearch/v235/main/assets/tan24d/tan24d.pdf) pages, full references and AppendicesA-F, including derivative derivation, architecture/code example, all instance-level QAPLIB rows, TSP experiments and latency accounting. Publisher related links/source extras=[] and author ZIP inventory identify no additional scientific PDF/ZIP member.
- **Code:** [official SAWT](https://github.com/PKUTAN/SAWT) has training/testing, generator, swap environment, attention/model implementations and20/50/100 checkpoints. These routines were inspected; training was not rerun and current release differences are documented above.
- **Relations:** thirteen explicit body/bibliography matches are recorded, including RGM under its cited2022 author-version label and Bello under its explicitly cited workshop version; formal inclusion status is not changed by those citation aliases.
