---
id: invit
short_title: INViT
title: 'INViT: A Generalizable Routing Problem Solver with Invariant Nested View Transformer'
authors:
- Han Fang
- Zhihao Song
- Paul Weng
- Yutong Ban
year: 2024
date: '2024-02-04'
venue: ICML
paper_url: https://proceedings.mlr.press/v235/fang24c.html
arxiv_url: https://arxiv.org/abs/2402.02317
institutions:
- Shanghai Jiao Tong University
- Duke Kunshan University
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: INViT constructs routes using dynamically selected, normalized nested k-nearest-neighbor views, combining
  their embeddings to improve transfer across graph sizes and coordinate distributions.
figure:
  path: paper-assets/invit/framework.png
  alt: INViT normalizes nested local views, independently encodes each view, concatenates common-node embeddings
    and selects the next node from the smallest candidate view.
  caption: 'Figure 3: INViT nested-view encoders and autoregressive multi-view decoder.'
  source_url: https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=5
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/fang24c.html
code_url: https://github.com/Kasumigaoka-Utaha/INViT
---
# INViT: A Generalizable Routing Problem Solver with Invariant Nested View Transformer

> **TL;DR:** INViT limits each constructive decision to a small candidate neighborhood and encodes several nested, normalized local views. Trained on uniform100-node instances, separate TSP/CVRP policies transfer to much larger and shifted-distribution instances. Strong large-scale results coexist with weaker small/medium-scale results, substantial residual benchmark gaps and restricted candidate choices.

## Motivation

As node density increases, close coordinates can become difficult for a fixed encoder to distinguish; attention over a larger complete graph can also accumulate contributions from many distant nodes. INViT calls these **embedding aliasing** and **interference from irrelevant nodes**. Empirical optimal-tour neighbor statistics motivate restricting candidate actions and using several local state views. These arguments motivate an architecture; they are not an optimality or generalization guarantee. [Sections 3.2-3.3 and Appendix A.1.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=4)

## Contributions

- A dynamic nested k-nearest-neighbor design separates the smallest action set from larger contextual neighborhoods.
- Per-view coordinate normalization and projection reduce scale/density effects without adding a full-graph encoder.
- Independent attention encoders produce common-node embeddings that a multi-view decoder combines for autoregressive next-node selection.
- A policy-gradient implementation averages augmented-instance rewards during training and selects the best rollout during testing; evaluations cover four coordinate distributions and public routing benchmarks. [Sections 4-5.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=5)

## Methodology

### Local views and invariant representation

At each decoding step, select nested neighborhoods around the **last visited node** among feasible remaining nodes. The smallest neighborhood is the potential candidate action set; larger sets add contextual nodes. The first visited node, or CVRP depot, is retained because it affects the eventual return. The depot is a candidate when revisiting it is permitted. [Sections 3.1/4.1.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=4)

Each view subtracts coordinate-wise minima and divides by the largest coordinate span, preserving geometry under translation and common positive scaling. When a first node/depot outside the local region is not currently visitable, its normalized coordinates are clipped to the unit boundary. This projection loses distant geometric detail. Rotations/reflections are also used as augmentations; the normalization formula alone should not be described as exact invariance to every possible geometric transformation. [Equations 5-6.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=5)

### Attention and construction

Each view has an independent two-layer attention encoder, width128, feed-forward width512 and eight heads, without positional sequence encoding. Nodes with different feature roles use distinct initial linear embeddings. Retain embeddings for nodes common to every view: candidates, last node and first node/depot. Concatenate these embeddings **channel-wise**; use the last/first embeddings as decoder query and candidate embeddings as keys/values. A three-layer decoder produces masked next-node probabilities, with zero mass outside the candidate set. [Figure3 and Equation7; Appendix A.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=5)

**INViT-2V** uses neighborhood sizes35/15; **3V** uses50/35/15. These are counts of nearest neighbors, not fixed geometric radii. The neighborhoods and embeddings change with the partial solution. Greedy rollouts from several starts/augmentations create candidate complete tours, with the best returned; there is no learned incumbent-editing phase or test-time neural-weight update.

### Training and classification

REINFORCE compares sampled policy tours against a separately maintained greedy-rollout baseline. Training rewards average over augmented versions, including rotated/reflected/normalized instances and varied starts. At the end of an epoch, replace baseline parameters when the training policy performs better. Testing instead retains the best augmented rollout. [Equations 2/8 and Section4.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=6)

Core INViT is **specialist, constructive**. TSP and CVRP have separate networks/checkpoints, and2V/3V are different trained models. One policy transferring to more sizes/distributions of its own task does not mean one checkpoint solves both tasks. The paper's broad use of the term iterative for other search methods in Appendix A.3 is not itself this repository's classification rule.

## Experiments

### Data, references and compute

MSVDRP comprises **uniform, clustered, explosion and implosion** distributions: TSP100/1000/5000/10000 and CVRP50/500/5000. Each subset has2000 cases at TSP100/CVRP50,200 at1000/500 and20 at5000/10000. Tests also include **77 Euclidean2D symmetric TSPLIB instances,51-18512 nodes**, and **100 CVRPLIB Set-X cases**. CVRP synthetic capacity is50 and demands are integers1-10. [Section5.1 and Appendix A.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=6)

Models train on **uniform100-node** instances; Omni baselines additionally train on diverse sizes50-200/distributions. ELG-v1's CVRP model was retrained at100 with local k50 because no suitable small-scale checkpoint was available. Other baselines use provided checkpoints. Default training is150000 steps, initial learning rate1e-4 and weight decay.01, taking about **five days per problem** on the reported machine. Main text says batch128; Appendix A.2 says64, a discrepancy preserved here. [Section5.1 and Appendix A.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=7)

Evaluation uses one **RTX4090 and i7-12700**, processing one test instance at a time. Greedy multi-start count is capped at100, with augmentation; some baseline counts are reduced further to fit GPU memory. Tables report **total time for a dataset**, not per-instance time, and do not establish performance for every method's original high-search-budget configuration. Default paper augmentation count is8. [Section5.1 and Appendix A.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=15)

References are Gurobi for TSP100, LKH3 for larger TSP and HGS for CVRP. Appendix A.2 specifies LKH20000 iterations with10 runs at1000 and1 at10000, but omits an equally explicit5000 setting. HGS uses20000 iterations at50/500 and a **four-hour-per-instance limit at5000**. The authors explicitly note that a weaker large-CVRP reference partly explains lower gaps at5000 than500. These are heuristic-reference gaps, not certified optimality for every scale. [Appendix A.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=15)

### Synthetic results and exceptions

| Setting | INViT-3V gap / dataset time | Selected comparison |
| --- | --- | --- |
| Uniform TSP100 | .95% /4.2min | PointerFormer .43% /1.7min |
| Uniform TSP1000 | 5.99% /4.8min | LEHD2.76% /12min |
| Uniform TSP10000 | 6.01% /10.3min | BQ-NCO18.78% /14.1h |
| Clustered TSP10000 | 8.79% /10.5min | ELG-v1 38.94% /10.2min |
| Uniform CVRP500 | 7.89% /2.6min | BQ-NCO4.72% /10.5min |
| Implosion CVRP5000 | 5.09% /4.2min | BQ-NCO6.60% /2h |

The large-scale average gaps across all four distributions are **7.97% at TSP5000,7.52% at TSP10000 and5.63% at CVRP5000**, strongest among the listed methods under these settings. At smaller/medium scales, several baselines win; for example Omni-VRP beats INViT on every CVRP500 distribution.3V generally improves2V in the main synthetic tables at additional runtime, but is not universally best on individual public cases. [Tables1-2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=7)

### Public benchmarks and ablations

Grouped TSPLIB3V mean gaps are **1.14/4.26/8.61/9.11%** at1-100/101-1000/1001-10000/>10000; LEHD is better in the two smaller bins. Some large LEHD/BQ-NCO cases are out of memory, so their aggregates must not be treated as successful results on every same instance. Grouped CVRPLIB3V gaps are **6.52/9.11/10.21%** at100-200/201-500/>500; Omni-VRP is better in the middle bin. [Table3.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=9)

All rows in Tables5-6 were read. Residual errors and exceptions are substantial: pr152 has3V7.97% versus PointerFormer.45%; X-n856-k95 has3V18.55% versus LEHD2.97%; X-n420-k130 has3V16.25% versus ELG4.24%. On some large cases2V beats3V, such as d18512 at7.87 versus8.07%. These examples limit claims of uniformly strong transfer. [Appendix A.4.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=17)

At TSP10000,2V's gap8.01% increases to15.58% with a global view,66.38% without invariant layers and15.14% with one view. A fourth view gives7.64%;3V gives7.86%. Training at50 rather than100 worsens the corresponding results, and removing training augmentation has a smaller effect than removing normalization/localization. Thus gains are supported by architecture ablations, with additional views trading cost for modest quality gains. [Table4.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=9)

## Limitations

### Reported by the Authors

- INViT does not outperform comparison methods on some small and most medium synthetic datasets.
- Neighbor restriction is motivated empirically; optimal tours sometimes select nodes outside the neighborhood, and far nodes can affect CVRP subroutes through capacity coupling.
- Some baseline rollouts are reduced for memory, and some public cases remain out of memory. [Sections3.3/5.2 and Appendix A.1/A.2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/fang24c/fang24c.pdf#page=13)

### Curator Notes

- Candidate pruning can exclude an optimal action; neither local normalization nor the Lipschitz argument proves an optimal or universally generalizable solver.
- Large CVRP gaps depend materially on a time-limited HGS reference, and large-scale datasets contain only20 cases per distribution.
- The publication and current code have reproducibility discrepancies: batch128 versus64; paper augmentation8 versus current/logged16; some provided example checkpoint logs use250epochs rather than the paper's500. The generator uses standard-normal cluster noise, while Appendix A.2 prints mean1/std0. Checkpoint logs and generated datasets should be used to identify the actual run, rather than merging these statements into a fabricated single protocol.

## Reproducibility

- **Formal publication/full text:** [ICML2024/PMLR235](https://proceedings.mlr.press/v235/fang24c.html), pages12973-12992; all **20 publisher-PDF pages including Appendix A.1-A.4** fully reread. Title-page affiliations include SJTU and previously omitted **Duke Kunshan University**. The [publisher metadata](https://proceedings.mlr.press/v235/fang24c.html) explicitly records `citation_publication_date` as **2024-07-08**, independently of any paper-specific acceptance date. A generic conference notification date remains excluded from acceptance metadata. [arXiv history](https://arxiv.org/abs/2402.02317) confirms first posting4February2024.
- **Scientific material:** the PMLR page links the integrated PDF and OpenReview; OpenReview page/API returned a verification challenge. The full appendix was read. The article's source-code/dataset supplement statement is supported by the linked official repository and data link; its downloaded91-member source archive was manually inventoried and contains no additional PDF/ZIP scientific appendix. No inaccessible OpenReview attachment is claimed to have been inspected.
- **Official implementation:** [Kasumigaoka-Utaha/INViT](https://github.com/Kasumigaoka-Utaha/INViT), explicitly linked on the formal title page. Full README, model-training defaults, generator and example checkpoint headers were checked; separate TSP/CVRP networks/checkpoints and dataset-generation commands are present. This is provenance/configuration verification, not reproduced model training.
- **Figure:** original Figure3, PDFpage5, replacing the introductory concept graphic with the actual nested-view encoding/decoding architecture. Method equations, main tables and appendix distribution/neighbor analyses were visually checked.
