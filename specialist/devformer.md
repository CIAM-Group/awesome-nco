---
id: devformer
short_title: DevFormer
title: 'DevFormer: A Symmetric Transformer for Context-Aware Device Placement'
authors:
- Haeyeon Kim
- Minsu Kim
- Federico Berto
- Joungho Kim
- Jinkyoo Park
year: 2023
date: '2023-07-03'
publication:
  date: '2023-07-03'
  source_url: https://proceedings.mlr.press/v202/kim23h.html
venue: ICML
paper_url: https://proceedings.mlr.press/v202/kim23h.html
institutions:
- Department of Electrical Engineering, Korea Advanced Institute of Science and Technology
- Department of Industrial and Systems Engineering, Korea Advanced Institute of Science and Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Placement
- Routing
problems:
- Decoupling Capacitor Placement
- TSP
summary: Probing-aware autoregressive device placement with expert imitation and self-generated permutation-consistency
  regularization, plus a separate cyclic-symmetry TSP experiment.
code_url: https://github.com/ai4co/devformer
figure:
  path: paper-assets/devformer/framework.png
  alt: Original DevFormer Figure3 with complete caption, showing probing-relative embeddings and PCN/RCN attention
    decoding.
  caption: 'Figure3: original DevFormer architecture and context encodings.'
  source_url: https://proceedings.mlr.press/v202/kim23h/kim23h.pdf#page=3
---

# DevFormer: A Symmetric Transformer for Context-Aware Device Placement

> **TL;DR:** A specialist autoregressive device-placement policy combines probing-relative embeddings with expert imitation and permutation-consistency regularization. It improves simulated decoupling-capacitor placement with scarce expert labels; separate AM experiments also demonstrate cyclic-consistency training for TSP.

## Motivation

Power-integrity optimization requires costly electrical simulations, while high-quality offline placement labels are limited. A completed set of identical decoupling capacitors has the same electrical objective regardless of placement order, but an autoregressive policy can assign different probabilities to those orders. DevFormer encodes probing-port context and trains against this order bias. [pp.1–4]

## Contributions

- Probing positional embeddings (PPE) represent distance to the probing port. Probing-port and previous-node context networks (PCN/RCN) guide attention decoding.
- Collaborative symmetricity exploitation (CSE) combines teacher-forced expert imitation on permuted placements with a self-generated trajectory probability-consistency loss.
- DPP simulations test data scarcity, grid/decap-count transfer and a hierarchical HBM model. A separately trained attention model uses cyclic rather than arbitrary action permutations for TSP20/100. [pp.3–8]

## Methodology

**Task and constructor.** Each grid port has coordinates and a condition: allowed, keep-out or probing. The policy sequentially selects K different allowed ports, masking previously selected, keep-out and probing locations. K is supplied externally; the model does not directly learn the minimum capacitor count meeting every electrical constraint. Its main reward is the sum of impedance suppression weighted by1GHz/f over201 frequency points from200MHz to20GHz. The benchmark uses an approximate unit-cell segmentation simulator. [pp.2–3,12–17]

**Architecture.** Three attention encoder layers use128-dimensional embeddings and512-dimensional feed-forward layers in the formal experiment. Node embeddings plus probing-relative distances feed the encoder. PCN uses the probing-node embedding, while RCN uses the immediately previous selected node; the selected-set mask provides further state information. This structure encourages contextual learning but does not architecturally enforce equal probabilities for every permutation of a complete placement. [pp.3–5]

**Training.** GA supplies2,000 expert layouts, each with100 simulator evaluations. Expert exploitation trains negative trajectory log likelihood on action-permuted copies. Self-exploitation samples from a stopped-gradient copy of the current policy and minimizes absolute differences between original and permuted complete-trajectory probabilities. The formal weight is of order10³² because these probabilities are extremely small. This is probability consistency, not reward-weighted self-imitation of better solutions. [pp.4–5,16–18,23–25]

**Theory.** Theorem1 proves that zero expected absolute permutation discrepancy is equivalent to symmetry when every context/action/permutation has positive probability mass. The elementary nonnegative-sum proof is valid for the finite DPP setting. For continuous context distributions, the expectation only yields an almost-everywhere statement unless additional regularity is imposed. Neither the theorem nor a small sampled discrepancy proves global optimality or exact symmetry of the trained network. [pp.4,26]

**Classification:** Specialist / constructive. DPP policies and the separate TSP attention-model experiment are task-specific; no single checkpoint is demonstrated solving both problems.

## Experiments

| Setting | Reported protocol |
| --- | --- |
| Main DPP |10×10 chip PDN over a40×40 package model; K=20 |
| Contexts |Random probe and0–15 keep-out ports;100 test and100 validation cases |
| Larger grid |15×15 with50 test/50 validation cases |
| Expert cost |2,000 contexts×100 GA evaluations=200,000 simulator calls |
| Inference |One greedy generated solution; no simulation-driven test-time search, followed by simulation for evaluation |
| Statistics |Five seeds, mean±standard deviation of scores averaged over100 main test contexts |
| Formal training |Learning rate10⁻⁵, batch100, permutation setting P=4; λ reporting has inconsistencies below |

**Main scores:** DevFormer-CSE12.88±.003, AM-CIL11.74±.075, Pointer-CIL10.49±.119, GA10012.56±.017 and random search10,00012.70±.000. Online RL baselines score9.56–9.79 under their specified training/search budgets. The headline zero-shot result excludes the offline200,000-call expert-generation cost; it means transfer to an unseen context without adapting the policy. [pp.5–6,18–19]

- **Sparse labels:** AppendixE reports DevFormer12.76/12.85/12.86/12.88 for100/500/1,000/2,000 expert contexts, versus AM-CIL11.02/11.80/11.99/11.77. More labels do not monotonically improve the AM baseline. [pp.7,23]
- **Grid/count transfer:** At10×10, DevFormer scores12.23/12.60/12.81/12.95/13.11 for K12/16/20/24/30. At15×15, scores8.47/8.54 for K20/40 exceed the displayed GA7.61/7.69 and AM-CIL6.23/7.75. These are within-task transfers, not a generalist evaluation. [p.7]
- **HBM application:** A hierarchical package/interposer/chip PDN model is used. At target score26.68, DevFormer needs26 capacitors versus GA40 and AM-CIL34:35% fewer than GA, but23.53% fewer than AM-CIL. The more-than30% claim therefore depends on the named comparator. The paper provides model/simulation evidence, not a demonstrated fabrication-yield or measured production-cost study. [pp.7–8]
- **One noise example:** The selected5GHz PLL case has peak-to-peak noise10.546mV initially, .610mV with DevFormer26 capacitors and .682mV with GA40:94.216% and93.533% reductions. This is one selected case among100 HBM contexts, not the distribution-wide noise reduction. [p.22]
- **TSP:** Separate AM-IL and AM-IL+CSE experiments use100 Concorde-labelled training instances and100 synthetic test instances at TSP20/100. CSE uses cyclic rotations that preserve the tour, not all arbitrary node permutations. Figure10 shows improved curves; no exact optimum-gap table or common DPP/TSP checkpoint is reported. [p.8]
- **Order bias:** Sampled raw-probability discrepancy is8.70×10⁻²¹ for AM-CIL versus1.25×10⁻²⁸ for DevFormer. Its absolute size depends strongly on trajectory length and probability scale; it is not a length-normalized distance between distributions over unordered solutions. [p.7]

## Limitations

### Discussed in the Paper

Larger, more complex designs and other hardware tasks remain future work. Electrical parameters and models may be replaced for different devices; the fixed benchmark does not establish general electrical-model transfer. [pp.9,12–16]

### Curator Notes

- **Printed protocol conflicts:** AppendixE.1 text says λ=5 while its table caption says8, with the common10³² scale explained later. AppendixE.2 prose calls8 best, but Table6 prints12.877 at5 versus12.871 at8. Table7 rounds all P4/6/8 CSE scores to12.88, including expert-only P8; a unique optimum or strict improvement for every P is unsupported. AppendixC.2 gives Pointer-CRL160,000 simulations in prose versus200,000 in Table4. These are preserved as unresolved reporting inconsistencies.
- **Current loss version:** `src/train.py` uses stopped-gradient self-generated probabilities and an L1 probability discrepancy, then replaces the scaled consistency loss by scalar10 whenever it exceeds10. That branch contributes no consistency gradient; it is not a universally active equality constraint or a smooth clipping operation. No claim is made about how often this occurred in the historical runs.
- **Current defaults:** `src/options.py` uses learning rate10⁻⁴ and λ=8×10³²; the README/2,000-label launcher uses batch200 rather than the formal10⁻⁵/batch100. Current simulator reward divides the weighted sum by10, whereas EqS1 does not print that scaling. Exact reproduction requires resolving these version/protocol differences.
- **Release scope:** The inspected ZIP includes the four-file simulator/test data archive, with no bundled neural checkpoint or full guiding/training set. The README points to an external Google Drive data package and a checkpoint inside it; those external assets were not retrieved or claimed inspected here. Supplied training reward code fixes the DPP simulator to10×10 unless modified.
- No full model training, five-seed benchmark or fabricated-hardware experiment was independently replayed. One original simulator example was executed and its permutation-invariant score checked, as described below.

## Reproducibility

- **Publication:** [ICML2023 / PMLR202](https://proceedings.mlr.press/v202/kim23h.html), pages16541–16566; publisher metadata explicitly gives2023-07-03.
- **Full text:** All26 formal pages, complete bibliography and AppendicesA–F were freshly read. All10 main figures,15 supplementary figures,3 main tables and7 appendix tables were visually checked, including the theory and parameter conflicts.
- **Companions:** The [official event](https://icml.cc/virtual/2023/poster/24744) has a video embed and the formal PDF link, with no separate downloadable poster/slides/scientific supplement identified. Video was not reviewed or counted. The untruncated105-entry code tree/106-member46.040MB ZIP and nested four-member data ZIP were inventoried; neither contains a scientific PDF/notebook.
- **Code:** The paper's author link redirects to [ai4co/devformer](https://github.com/ai4co/devformer), treee74ae21a34366ad4e1ed9ed42f50db3a6d1f097c. README, construction/masking/context heads, augmentation, loss, simulator, reward and launcher paths were inspected.
- **Local check:** The original simulator and supplied arrays give5.815011933903855 for probe23 and capacitors[1,5,7], matching the release test's5.815012. Permuting them to[7,1,5] gives the identical score. This verifies that example's objective symmetry, not policy exchangeability or the paper's benchmark results.
- **Figure:** Original Figure3 with its complete caption shows the encoder, PPE and PCN/RCN decoder.
