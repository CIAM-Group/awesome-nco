---
id: learning-heuristic
short_title: Learning Heuristic
title: Learning Heuristics for the TSP by Policy Gradient
authors:
- Michel Deudon
- Pierre Cournut
- Alexandre Lacoste
- Yossiri Adulyasak
- Louis-Martin Rousseau
year: 2018
date: '2018-06-08'
venue: CPAIOR
paper_url: https://doi.org/10.1007/978-3-319-93031-2_12
institutions:
- Polytechnique (France)
- Element AI
- HEC Montréal
- Polytechnique Montréal
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
summary: An attention-only REINFORCE policy uses three-action context and optional classical 2-opt; size-50-to-100
  transfer is demonstrated, with size-100 quality below the listed OR-Tools and sampled pointer baselines.
figure:
  path: paper-assets/learning-heuristic/framework.png
  alt: Complete original attention encoder and illustrative pointer decoder, including encoder input and both appendix
    captions.
  caption: 'Appendix Figures 1-2: Encoder and adapted decoder illustrations; Equation 3 specifies the three-action
    query.'
  source_url: https://stage.hanalog.ca/wp-content/uploads/2018/11/cpaior-learning-heuristics-6.pdf#page=12
inclusion: reference
inclusion_reason: CPAIOR is outside the approved main-conference and journal inclusion list.
publication:
  date: '2018-06-08'
  source_url: https://link.springer.com/chapter/10.1007/978-3-319-93031-2_12
---

# Learning Heuristics for the TSP by Policy Gradient

> **TL;DR:** An attention-only policy constructs TSP tours from three-step context, then optional classical 2-opt improves the best sampled tour. Size-50 training transfers to size 100, but the reported size-100 hybrid is weaker than OR-Tools and the sampled pointer-network baseline.

## Motivation

The paper replaces the LSTM-based pointer-policy architecture with attention and combines learned construction with a simple classical improvement heuristic. It studies two-dimensional Euclidean TSP, rather than demonstrating the proposed framework on several native optimization tasks (PDF pp. 1-3).

## Contributions

- Uses a self-attention set encoder and a decoder that explicitly retains only recent actions.
- Trains by REINFORCE with a learned critic baseline, without optimal-tour supervision.
- Tests sampling, optional 2-opt and size-50-to-100 transfer.

## Methodology

Centered coordinates undergo PCA, intended to reduce orientation dependence. The encoder uses three residual attention/feedforward stacks, sixteen heads, 128-dimensional embeddings and a 512-wide feedforward inner layer. Equation 3 forms a query from the last three selected city embeddings rather than a recurrent state. A pointer-style scorer, visited-city exclusions and temperature-controlled sampling generate the tour. The critic uses the same encoder type, a zero-query glimpse and two fully connected layers; it learns tour length by MSE (PDF pp. 4-7).

REINFORCE minimizes expected tour length using the critic to reduce variance. Training uses on-the-fly unit-square instances, batch size 256 and 20,000 Adam steps, reported as about two hours on two Tesla K80 GPUs. Inference samples 128 tours and applies classical 2-opt to the best when requested. This remains **constructive** under the collection's neural-stage taxonomy: 2-opt is not a learned improvement policy (PDF pp. 6-8).

## Experiments

Each test size, 20/50/100, has 1,000 random instances. Size-100 results use the size-50-trained model. Table 1 reports model/model+2opt/Concorde lengths of 3.84/3.82/3.82, 5.81/5.77/5.68 and 8.85/8.16/7.77. Equality after two-decimal rounding at size 20 does not establish that every instance is solved optimally (PDF pp. 7-8).

The hybrid beats the listed OR-Tools mean at size 50 (5.77 vs 5.80), but loses at size 100 (8.16 vs 7.99). The sampled pointer baseline is also better at size 100 (8.05). Thus neither transfer nor 2-opt establishes universal heuristic superiority. LKH is said to be close to Concorde and is omitted from the quality table (PDF pp. 7-8).

For size 50, reported average times are 0.05/0.14/0.02 seconds for CPU Concorde/LKH/OR-Tools, versus 0.30/0.06 seconds for single-GPU pointer/model inference. The headline fivefold speedup concerns the pointer comparison; the model is slower than the displayed OR-Tools time. Different hardware and an unseparated incremental 2-opt cost limit broader timing conclusions. Inference temperatures are 2.4 for size 20 and 1.2 for 50/100 (PDF pp. 7-8).

## Limitations

Training and testing use a restricted synthetic distribution, and no global-optimality guarantee is established. PCA preprocessing, inference sample count and classical postprocessing matter to the results. Size transfer within TSP does not make this a generalist model.

**Printed specification caveats:** Equation 4 sets visited logits to minus infinity, but literal substitution into Equation 5's tanh clipping makes them finite `-C`, hence nonzero under softmax. Exact exclusion requires an additional mask after clipping or equivalent filtering. This qualifies the printed formula composition, not an assertion that the reported experiments used an invalid implementation. Figure 2 is an adapted schematic containing two recent actions and a global vector, while Equation 3 explicitly specifies three recent embeddings; the equation is the method description used here. The unavailable code prevents checking those implementation details (PDF pp. 5,12; curator analysis).

## Reproducibility

- **Read source:** all thirteen pages of the author/lab-hosted manuscript, including all 25 references and the complete appendix/three figures. The formal Springer HTML appendix was also read and its literature review/figure descriptions checked. The typeset chapter spans twelve pages; byte identity or an explicit revision date for the thirteen-page copy is not claimed.
- **Publication:** CPAIOR 2018, pages 170-181, first online **2018-06-08** per Springer, rather than the conference-start date. The unsupported acceptance field is removed. This remains a reference because CPAIOR is outside the agreed main venue list.
- **Affiliations:** Polytechnique (France), Element AI, HEC Montréal and Polytechnique Montréal. CIRRELT appears in acknowledgments, rather than as a byline affiliation.
- **Figures:** complete original appendix Figures 1-2 are extracted from PDF page 12, restoring the previously cropped encoder input/captions. Figure 3's before/after tours were also checked.
- **Code:** the article/publisher identify `MichelDeudon/encode-attend-navigate`; GitHub, its repository API and contents API all returned 404 during this review. The current Code button is removed, while this historical release attribution is retained. Experiments were not rerun.
- **Supplements and relations:** the full manuscript includes the scientific appendix, and the publisher's appendix is accessible in HTML; no further scientific attachment was identified. Exact references identify Bello's NCO paper, S2V and Pointer Networks. AAAI 2016 learning-to-branch is not substituted by the different 2019 GCNN branching paper.
