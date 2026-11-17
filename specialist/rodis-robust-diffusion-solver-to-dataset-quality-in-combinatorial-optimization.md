---
id: rodis-robust-diffusion-solver-to-dataset-quality-in-combinatorial-optimization
short_title: RODIS
title: 'RODIS: Robust Diffusion Solver to Dataset Quality in Combinatorial Optimization'
authors:
- Hui Yuan
- Zhigang Hua
- Zihao Li
- Qi Xu
- Weilin Cong
- Yan Xie
- Taihui Li
- Rong Jin
- Shuang Yang
- Bo Long
year: 2026
date: '2026'
publication:
  date: '2026'
  source_url: https://www.ijcai.org/proceedings/2026/586
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2026/586
institutions:
- Meta Ranking AI
- Princeton University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Weighted Maximum Independent Set
- Maximum Independent Set
summary: Task-specific objective-conditioned diffusion and classifier-free guidance improve weak-label robustness
  before greedy decoding, with dataset-specific exceptions and printed probability-model qualifications.
figure:
  path: paper-assets/rodis-robust-diffusion-solver-to-dataset-quality-in-combinatorial-optimization/framework.png
  alt: Original Figure1 showing objective-labeled training graphs, guided diffusion and greedy decoding.
  caption: 'Figure1: original RODIS generate-then-decode pipeline and complete caption.'
  source_url: https://ijcai.org/proceedings/2026/0586.pdf#page=2
---

# RODIS: Robust Diffusion Solver to Dataset Quality in Combinatorial Optimization

> **TL;DR:** RODIS conditions a diffusion solver on solution quality and uses classifier-free guidance before greedy feasible decoding. It reduces dependence on high-quality labels in the tested TSP/MIS settings, with important high-quality-data exceptions and unresolved printed probability formulas. The paper does not demonstrate one shared checkpoint across its problems.

## Motivation

Supervised diffusion solvers rely on large collections of good solution labels. Exact or strong heuristic labeling can be expensive; cheaper heuristics supply more suboptimal examples. RODIS studies whether explicitly conditioning on the label's objective value can extract useful information from those weaker examples. Its empirical data-scaling plots are observations on the displayed datasets, rather than a theorem establishing a universal exponential sample-complexity law. [pp. 1–2]

## Contributions

- A generate-then-decode formulation represents tours through edge indicators and independent sets through node indicators, followed by task-specific greedy decoding.
- An objective-conditioned denoiser and a masked-objective branch enable classifier-free guidance without a separate classifier.
- Experiments vary label quality, training-set size, requested objective and guidance strength for TSP, weighted MIS and unweighted MIS. [pp. 3–7]

This remains **specialist/constructive**. The shared conditional/unconditional weights are branches of a model for a given problem; that statement does not establish a single trained model reused between TSP and MIS. Starting from diffusion noise and decoding a solution is not incumbent-solution improvement.

## Methodology

**Representation.** The denoiser receives the original problem graph, a noisy solution graph, the diffusion time and an objective value. Positional encodings of the problem/solution features are concatenated. A12-layer anisotropic GNN with hidden width 256 updates node and edge embeddings; time and objective embeddings enter the message computation. [pp. 3–5]

**Training.** Categorical corruption uses 1,000 training diffusion steps. The objective is masked with probability 0.1 to train the unconditional branch with the same parameters. The cross-entropy target remains the supplied solution graph, including when its label is suboptimal. The approach therefore uses objective information from weak labels, rather than eliminating the labeling requirement. [pp. 3–5]

**Inference and decoding.** Reported inference uses 50 denoising steps. Guidance reweights the conditioned probabilities by a conditioned/unconditioned ratio raised toγ; active guidance requires two denoiser passes per step. Target objective andγ are selected using a validation-set reference and then fixed across test instances. The suggested target multipliers can request values better than the validation optimum estimate; this is a tunable conditioning signal, not access to each test optimum or a guarantee of achieving it. TSP greedily adds compatible tour edges; MIS greedily adds nonconflicting nodes. Classical decoding provides the discrete solution. [pp. 3–6]

## Experiments

| Setting | Reported evidence |
| --- | --- |
| TSP |Uniform 2D instances at sizes 50/100/500/1000; training sizes 12,800/76,800/1,502,000 |
| Labels/references |Farthest insertion versus Concorde at small sizes and LKH-3 at large sizes; LKH-3 is a heuristic reference |
| TSP evaluation |1,280 small or 128 large instances; matched greedy decoding without 2-opt |
| MIS |Weighted ER 100, SATLIB and unweighted ER 700–800; findMIS weak labels and Gurobi/KaMIS references |
| Guidance study |Five random seeds for the plotted TSP 50/weighted-MIS 100 ablation |

**Weak-label gains.** At 12,800 TSP 50 training instances, guided RODIS with heuristic labels reports 6.55 length/16.96% gap, versus DIFUSCO's6.91/23.39% with the same label type and 6.74/20.36% with solver labels. At the largest TSP 100 training set, the corresponding weak-label gaps are 14.97% versus 15.63%. On weighted MIS 100, weak-label RODIS obtains 130.66/3.63% gap versus DIFUSCO 121.78/10.06% and its labeling heuristic 122.37/9.62%. These results support the displayed robustness comparison, without implying near-optimality everywhere. [Tables 2–4]

**Exceptions.** With solver labels, TSP 1000 RODIS reports 27.60/19.07% gap versus DIFUSCO 27.44/18.38%. On solver-labeled SATLIB it gives 421.74/0.87%, versus 423.09/0.55%. Thus the prose's across-all-datasets high-quality-label dominance is stronger than the tables support. SATLIB's weak-label gain is small. [Tables 4–5]

**Cost accounting.** Table 1 times are **label-generation** times for 12,800 instances, not neural inference times; its weighted-MIS exact baseline explicitly uses 32 workers. The paper does not provide a complete training-update/optimizer/hardware budget or an inference wall-clock table. Guidance's doubled forward passes and validation tuning must be included when reproducing cost claims. [pp. 2,5–7]

## Limitations

### Curator Notes

- **Printed posterior:** Equation 5 uses the predicted clean state in the transition-likelihood factor where the observed noisy state is needed by the standard posterior. Read literally at one step, with predicted clean probabilities(0.8,0.2), transition matrix[[0.9,0.1],[0.1,0.9]], previous cumulative transitionI and observed noisy state(0,1), its weights are(148/65,1/5), summing to 161/65 rather than 1. The standard posterior is(4/13,9/13). The missing implementation prevents deciding whether this is only a transcription error; no benchmark invalidity is inferred from this check.
- **Bayes factor:** Equation 6's displayed factor P(f*|noisy graph,problem graph) does not depend on the candidate clean graph, so it cancels when normalized. A meaningful candidate-dependent likelihood is needed to derive nontrivial conditioning. For a fair binary clean variable with uninformative noise and objective equal to that variable, conditioning the objective to 1 should force the clean value 1; the printed factor leaves it fair. This qualifies the stated derivation, separately from empirical guidance performance.
- The output graph/greedy decoder and off-support objective targets do not provide a general global-optimality certificate. The generic bilevel interpretation is not proof that arbitrary CO constraints are solved by the shown two decoders.
- Table 4's weighted-MIS solver-gap change is printed−0.12%, whereas the displayed 1.33% and 1.19% differ by 0.14 percentage points. Printed values are retained; no unreported statistical precision is invented. Main tables omit uncertainty information even though the guidance ablation reports five seeds.
- The publisher HTML/JSON incorrectly assign all ten authors to Princeton. The formal title page instead gives Meta Ranking AI and Princeton; the note follows the byline.

## Reproducibility

- **Publication:** IJCAI 2026 Main Track, pp 5263–5270, DOI 10.24963/ijcai 0.2026/586. Formal PDF and publisher record match all ten authors; electronic metadata supports year 2026 without an inferred paper-specific acceptance day.
- **Reading/inventory:** All eight formal pages, complete bibliography, both algorithms, all seven figures and five tables were read and visually checked. The official HTML and structured JSON link the complete paper/metadata, expose no separate scientific supplement or official implementation, and list an empty video array. The text contains no explicit missing appendix reference. No inaccessible or undiscovered attachment is claimed as read; no additional author manuscript/version chain was established.
- **Implementation and checks:** No paper-specific official code link was identified in the obtained sources. Exact finite probability checks of the printed formulas are saved with the review evidence. No neural training or benchmark was replayed. The original Figure 1 and complete caption were extracted from formal page 2 and checked at the public asset path.
- **Citations:** Six explicit body-plus-bibliography identities were confirmed. The source's Li 2024 reference omits the T2T prefix and uses 2024, while its four authors/title identify the formal NeurIPS 2023 work; that cited-version discrepancy is preserved.
