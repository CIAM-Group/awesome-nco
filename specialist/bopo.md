---
id: bopo
short_title: BOPO
title: 'BOPO: Neural Combinatorial Optimization via Best-anchored and Objective-guided Preference Optimization'
authors:
- Zijun Liao
- Jinbiao Chen
- Debing Wang
- Zizhen Zhang
- Jiahai Wang
year: 2025
date: '2025-10-06'
publication:
  date: '2025-10-06'
  source_url: https://proceedings.mlr.press/v267/liao25a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v267/liao25a.html
institutions:
- School of Computer Science and Engineering, Sun Yat-sen University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Routing
problems:
- Job Shop Scheduling Problem
- Flexible Job Shop Scheduling Problem
- Traveling Salesman Problem
summary: Task-specific constructive models learn from best-anchored self-generated preference pairs with objective-ratio
  scaling, evaluated on JSP,FJSP and TSP with explicit sampling costs and baseline tradeoffs.
code_url: https://github.com/L-Z-7/BOPO
figure:
  path: paper-assets/bopo/framework.png
  alt: Original BOPO Figure1 showing hybrid rollout, sorted-rank filtering, best-anchored pairs and the objective-guided
    preference update.
  caption: 'Figure1: original BOPO preference-pair construction and training pipeline.'
  source_url: https://raw.githubusercontent.com/mlresearch/v267/main/assets/liao25a/liao25a.pdf#page=3
---

# BOPO: Neural Combinatorial Optimization via Best-anchored and Objective-guided Preference Optimization

> **TL;DR:** BOPO trains constructive policies from preferences between their own sampled solutions. It combines one greedy rollout with stochastic rollouts, filters candidates across objective ranks, and compares the best retained solution against the others using an objective-ratio-scaled logistic loss. Separate JSP, FJSP and TSP models show useful gains over several RL/self-labeling baselines, with explicit exceptions and substantial rollout costs.

## Motivation

External optimal labels can be expensive, while self-labeling commonly trains only on the best of many generated candidates. BOPO also uses inferior candidates as preference comparisons, using the directly computable optimization objective rather than a learned reward model. This removes the need for external optimal training demonstrations, not the cost of generating and evaluating training trajectories. [pp.1–4]

## Contributions

- Hybrid rollout combines B−1 sampled solutions and one greedy solution.
- Uniform filtering across the sorted objective ranks retains K candidates; best-anchored pairing constructs K−1 comparisons rather than all pairs.
- A length-normalized pairwise logistic loss scales preference logits by the loser/winner objective ratio, without a separate reference policy.
- Experiments integrate the training procedure with task-specific scheduling MGL models, a POMO-style TSP model and a separately trained INViT-2V model. [pp.3–8]

## Methodology

For positive-cost minimization, the explicit preference is−g(y). Sort B generated solutions from best to worst, select ranks1+floor(B/K)(k−1), and pair the best retained solution with each other retained candidate. Uniform here means **spacing in sorted ranks**, not uniform sampling of the feasible solution space. The checked scheduling release requires B divisible by K. [p.4; release pair construction]

Write Δ as the winner's average token log-likelihood minus the loser's. The loss is−log sigmoid(βΔ), with β=g(loser)/g(winner). Thus the objective controls a **ratio**, rather than an unnormalized cost difference. This choice assumes nonzero positive costs, as in the evaluated makespan/tour settings; it is not invariant to an arbitrary additive shift of an objective. The correct derivative with respect to Δ is−β sigmoid(−βΔ), encouraging the observed winner relative to the loser. BOPO does not supply an optimality or convergence theorem for the neural policy. [pp.4,17–19]

**Scheduling model.** MGL encodes static operation features with graph attention over job-precedence and machine-conflict edges. FJSP additionally represents operation–machine pairs and same-operation edges. An LSTM consumes the previously selected operation embedding; context features and operation embeddings supply attention keys for selecting the next eligible operation/machine. Static and contextual feature designs remain problem-specific. [pp.5,7,14–17]

**TSP model.** The POMO-style backbone has six Transformer encoder layers and a multi-head attention decoder. Separate size-specific models are trained on uniform20/50/100-node instances. INViT-2V is trained separately with BOPO for size/distribution tests; architecture compatibility does not imply a shared cross-problem model. [pp.6–8]

**Classification:** Specialist / constructive. JSP, FJSP and TSP use separate models and training. Inference extends partial schedules/routes, optionally generating multiple complete candidates and selecting the best. The learned policy does not edit complete incumbents; improving the policy through preference training is distinct from an improvement solver at inference. [pp.3,5–7]

## Experiments

| Setting | Reported protocol |
| --- | --- |
| JSP training |30,000 instances,5,000 per six shapes from10×10 through20×20;100 validation instances per shape;20 epochs |
| JSP rollout/update |B=256,K=16, one instance per update; Adam2×10⁻⁴ |
| JSP tests |Taillard, Lawrence and Demirkol; larger/other shapes held out from training |
| FJSP training |25,000 instances across five shapes, equally r/v datasets;B=128,K=16,D=1 |
| FJSP tests |Lawrence e/r/v variants with1–2,1–3 or1–m candidate machines per operation |
| POMO-style TSP training |B=128,K=8,D=64 at20/50;B=256,K=16,D=48 at100 |
| TSP inference |Multiple start nodes and optional eight geometric augmentations |
| INViT-2V training |D=1,B=64,K=8 and doubled epochs relative to the compared original setup |
| Hardware |NVIDIA TITAN Xp and Intel XeonE5-2680; PyTorch |

**JSP benchmark averages:**

| Method/decoding | Taillard gap | Lawrence gap | Demirkol gap |
| --- | --- | --- | --- |
| SLIM greedy |13.4%|7.8%|20.3%|
| BOPO greedy |12.9%|6.7%|20.0%|
| SLIM best of512 |7.8%|2.5%|13.1%|
| BOPO best of512 |7.5%|2.3%|12.9%|

The means improve, but individual shapes do not uniformly improve. At greedy decoding, BOPO's Taillard50×20 gap11.8% is worse than SLIM11.6%; Demirkol50×20 is25.2% versus22.4%. At512 samples, Taillard20×20 is9.1% versus9.0%, Lawrence10×5 is2.1% versus1.1%, and Demirkol40×20 is15.9% versus14.8%. OR-Tools with the stated one-hour limit has lower Taillard/Demirkol mean gaps2.0%/3.5%, while taking much longer. L2S5K's Taillard7.4% is slightly better than BOPO7.5%. [pp.5–6,19]

- **Scheduling runtime:** Table12 reports per-instance BOPO512 times0.75–7.96s across the eight Taillard shapes, versus92.2–504s for L2S5K. SLIM512 is faster for15×15(0.72s versus0.75s), although BOPO is faster on the other displayed shapes. Main-text aggregate minutes and AppendixD per-instance values should not be mixed. [pp.5,19]
- **TSP100:** With eight augmentations, BOPO has0.04% gap in18.1s for the1,000-instance set, compared with POMO0.14%, SLIM1.17% and DABL0.05%. Without augmentation, DABL is better at all three shown sizes:0.01/0.04/0.29% versus BOPO0.02/0.14/0.37%. At augmented TSP50, DABL rounds to0.00% versus BOPO0.01%. Rounded zero values do not certify every solution optimal. [p.7]
- **TSPLIB subset:**49 selected instances in four size groups(6/21/16/6) give BOPO gaps1.26/2.55/10.41/22.44%, versus POMO2.36/3.08/14.81/30.14%. These tests support a relative gain on the selected cases, not near-optimal large-scale routing. The release's distance/reference convention needs the qualification below. [p.7]
- **INViT transfer:** Figure2 tests1,000/5,000/10,000 nodes under uniform, cluster, explosion and implosion distributions. BOPO generally improves the displayed retrained/original INViT results, e.g., uniform10K4.97% versus6.21/6.18%. These are a different backbone/training experiment from Table2's POMO model. [p.8]
- **FJSP:** At100 samples, BOPO gaps6.1/4.0/0.6% on e/r/v data improve the shown HG/RS comparisons. At512 they reach5.0/3.4/0.4%. Greedy e-data14.5% remains worse than RS13.2%. [p.7]
- **Ablations:** Demirkol mean gap13.3% for the complete pair construction rises to14.4% without hybrid rollout and15.6% with only top-K filtering. Larger B increases memory and eventually gives diminishing returns; K=16 is the reported balance for the studied JSP setup. At small TSP20/50, B=20/50 matches the shown B=128 gaps, while simply grafting hybrid/filtering onto POMO worsens its results. [pp.7–9,19–20]
- **Architecture efficiency:** The262.19MB versus7,110.69MB training-memory comparison is measured for **one15×15 instance at B=256**, comparing MGL with the tested GAT-MHA implementation. It is not a universal27× memory guarantee for LSTM over all attention implementations or scales. [p.17]

## Limitations

### Discussed in the Paper

Training still needs many rollout solutions. The authors propose symmetry and problem-specific heuristics as future ways to improve candidate quality. B and K trade solution quality against memory/compute; removing a separately tuned preference temperature does not remove these hyperparameters. [pp.8–9]

### Curator Notes

- Best-anchored supervision is limited by the generated pool. Greedy **stepwise** decoding is not guaranteed to have the highest joint sequence likelihood, so AppendixE's explanatory sentence is not a general property of autoregressive policies.
- AppendixC.2 first gives the correct chain-rule components but then prints a combined gradient with the loser-minus-winner bracket and an extra negative sign, reversing the derivative of Eq.4. The released negative-log-sigmoid loss has the correct optimization direction. A scalar autograd check confirms this distinction; it does not establish erroneous historical training.
- The gradient multiplier β sigmoid(−βΔ) is not monotonically increasing in β for an already correctly ordered pair. For Δ=2 it drops from0.1192 at β=1 to0.0360 at β=2. The objective ratio changes emphasis together with confidence saturation, rather than guaranteeing a larger gradient for every larger objective disparity.
- **TSP release:** During training, `if self.training or eval_type=='softmax'` executes before the hybrid branch, so the visible training path samples all trajectories instead of reserving a greedy one. Executing the original forward on fixed synthetic probabilities confirms this. The shared best-anchor loss is present, but the release does not exactly implement every hybrid-rollout claim as written.
- **Reproduction defaults:** JSP defaults to learning rate2×10⁻⁵ rather than the paper's2×10⁻⁴, and its epoch-end log references greedy counters before initialization. FJSP's active DEBUG branch overrides B/K/epochs to32/8/2 and restricts loaded examples. TSP training scripts also enable debug runs; the size100 non-debug epoch default is2,100, while the described selected checkpoint is700. These settings require attention before attempting the published protocol.
- **TSPLIB metric:** The reader retains EUC_2D cases below1,000 nodes and scales official optimal values by a coordinate range, while tour cost is computed from unrounded floating-point Euclidean distances. TSPLIB95's EUC_2D definition rounds each edge to the nearest integer. The reported comparison therefore needs consistent edge-cost/reference recomputation before it can be treated as a strict official-metric gap. The bundled FAQ and manual distance section explicitly specify this distinction.
- The inspected release has JSP/FJSP/POMO implementations and five task/size checkpoints, but no INViT implementation or checkpoint. No training or full benchmark replay was performed here; targeted checks concern only the specified equations/branches.

## Reproducibility

- **Published source:** [ICML2025/PMLR267](https://proceedings.mlr.press/v267/liao25a.html), explicit publisher date2025-10-06. All20 formal pages, complete references, Algorithm1 and AppendicesA–F were read; all five figures,13 tables and the gradient formulas were visually checked.
- **Companion inventory:** The official event exposes a1.644MB poster, read in three overlapping tiles, with no separate slides/supplement link. The untruncated755-entry source tree and756-member104.32MB ZIP were inventoried. Four nested archives contain500/25,000/600/30,000 validation/training instance files and no extra scientific documents. A bundled16-page1995 TSPLIB format manual is a legacy benchmark document, not a BOPO supplement; its relevant specification/distance pages and the full FAQ were inspected.
- **Code:** [Official implementation](https://github.com/L-Z-7/BOPO), inspected tree2739fbfe39a478755173c892b80c4b06f9f59b05. Both READMEs, scheduling models/train/test/pair-loss functions and TSP policy/trainer/environment/evaluator/configurations were read. Binary weights/data were inventoried, not executed as evidence of paper accuracy.
- **Targeted verification:** Exact original TSP forward execution demonstrates the training-branch distinction; scalar autograd checks Eq.4 and the printed derivative. These checks do not replay any learned checkpoint or amend the upstream code.
- **Figure:** Original formal Figure1, including its caption, illustrates hybrid sampling, filtering, anchored comparisons and the objective-guided update.
