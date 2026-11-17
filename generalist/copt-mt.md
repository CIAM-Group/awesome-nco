---
id: copt-mt
short_title: COPT-MT
title: Can Computational Reducibility Lead to Transferable Models for Graph Combinatorial Optimization?
authors:
- Semih Cantürk
- Thomas Sabourin
- Frederik Wenkel
- Michael Perlmutter
- Guy Wolf
year: 2026
date: '2026-03-02'
publication:
  date: '2026-09-29'
  source_url: https://proceedings.mlr.press/v306/canturk26a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v306/canturk26a.html
institutions:
- Université de Montréal
- Mila – Quebec AI Institute
- Valence Labs
- Boise State University
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Minimum Vertex Cover
- Maximum Independent Set
- Maximum Clique
- Maximum Cut
- Minimum Dominating Set
- Graph Coloring
summary: A shared multi-filter GNN learns graph optimization through task-specific energies and heads; reduction-informed
  pretraining accelerates some adapted tasks, with substantial frozen-transfer, coloring and OOD limitations.
code_url: https://github.com/semihcanturk/COPT-MT
arxiv_url: https://arxiv.org/abs/2603.02462
figure:
  path: paper-assets/copt-mt/framework.png
  alt: Related graph tasks and a shared GCON encoder with task-specific prediction heads, losses and decoders.
  caption: 'Figure 1: Pairwise reductions and multitask pretraining/fine-tuning architecture.'
  source_url: https://raw.githubusercontent.com/mlresearch/v306/main/assets/canturk26a/canturk26a.pdf#page=3
---

# Can Computational Reducibility Lead to Transferable Models for Graph Combinatorial Optimization?

> **TL;DR:** A shared GCON encoder learns several graph optimization tasks through task-specific heads and unsupervised energies. Related tasks can provide useful initialization, but effective reductions do not guarantee useful frozen representations, zero-shot transfer or uniformly positive adaptation.

## Motivation

Polynomial reducibility relates problem complexity, whereas learned transfer depends on representations, graph distributions, losses and decoding. COPT-MT investigates whether known relationships between graph problems can inform pretraining-task selection. It works mainly on the original graph with different task heads rather than forcing every problem into one reduced instance format.

## Contributions

- A GCON-based baseline combines a multiscale filter bank, node statistics, energy-based losses and parallel greedy decoding.
- Pairwise experiments distinguish the topology-preserving MIS/MVC complement relation from MaxClique transfer through a complementary graph.
- Multitask and leave-one-out experiments guide selection of MDS, MIS and ten-coloring as joint pretraining tasks, followed by adaptation to other heads.
- Additional experiments examine reduction-based controls, larger synthetic graphs, size transfer, runtime and DIMACS instances.

## Methodology

**Encoder/objectives.** Degree, clustering coefficient and triangle count initialize nodes. The sixteen-layer, width-64 GCON encoder uses multiscale wavelet filters and localized attention, with GELU, normalization and concatenated layer outputs. The shared backbone has 39.2 thousand parameters. Task-specific MLP heads predict node membership probabilities or ten color scores. Differentiable Hamiltonians trade objective size against violations; training does not require optimal solution labels. Multitask losses have equal unit weights in the reported setup. Theoretical correctness of a discrete energy's optimum does not guarantee a neural optimizer reaches it.

**Actual decoders.** Appendix B specifies distinct procedures, refining the generic sequential-decoder description in the main text. MIS/clique decoders initialize different ranked seed nodes and add nodes while maintaining independence/clique structure. MDS/MVC candidates skip different initial ranked nodes and greedily select until domination/coverage holds. MaxCut thresholds at 0.5; coloring takes a color assignment and measures monochromatic-edge violations. In particular, the coloring output is not guaranteed feasible. These are learned scores followed by constructive rules, without learned edits of a complete incumbent.

**Sharing and adaptation.** Joint pretraining uses one encoder and multiple active task heads, so the actual shared multitask model supports the generalist label. This does not mean a single unchanged head solves all six tasks. Pairwise experiments reset or invert a head and train it with either frozen or trainable backbone. The main multitask study pretrains for 200 epochs and adapts for twenty, adding target heads and generally updating the backbone; coloring is the stated frozen-backbone exception. Learned transfer is an empirical finding under this protocol, not a theorem following from NP-completeness.

## Experiments

- **Data/budget:** Synthetic datasets contain 6,000 graphs, with small graphs around 200–300 nodes and large graphs around 800–1,200. Pairwise studies use RB graphs; multitask studies use Barabási–Albert graphs with attachment parameter four. AdamW uses learning rate 0.001, zero weight decay, cosine scheduling, dropout 0.3 and batches 256/128 for small/large graphs. Pairwise results generally report three runs; leave-one-out results report five. Target-only twenty-epoch baselines are compared with models that already received 200 pretraining epochs, so this is a target-training saving rather than equal total compute.
- **Individual baselines:** On RB-small, GCON obtains clique 16.92 and MIS 18.12, while Gurobi obtains 19.05/19.98 and GFlowNet obtains 16.24/19.18. GCON improves the tested local-message-passing baselines but does not beat every solver. Changing the clique energy improves the previously reported GCON result; this comparison does not isolate encoder architecture alone.
- **Pairwise transfer:** Full fine-tuning with an inverted MIS head improves MVC from 211.69 to 211.56 average selected nodes, while the reverse-direction MIS result 18.00 remains below its 18.12 baseline. Frozen-head variants are worse in both directions. For MIS-to-clique, the best reduction-aware full fine-tuning result is 16.82 versus the matched dual-statistics baseline 16.63, but the original-statistics baseline is 16.92. Global Transformer layers have high variance and do not provide a consistent win. The paper's row references #12/#13 in the discussion correspond to Table 4's #10/#11; no extra experimental conditions are inferred.
- **Multitask transfer:** Leave-one-out adaptation improves most twenty-epoch outcomes, but MDS worsens from 35.57 to 36.15. With the selected three-task backbone, adapted MaxCut is 722.77 versus 716.90 from scratch for twenty epochs and 726.58 after 200; coloring has 17.29 violations versus 49.04 and 3.52. These are faster learning curves with residual quality differences, not universal parity with full training. BA-large also has a counterexample: adapted clique 4.31 is below the twenty-epoch baseline 4.32. Size-extrapolation experiments still include target fine-tuning, and coloring violations increase by 71.26% or 63.52% against same-size pretraining/fine-tuning.
- **Reduction control and OOD:** Appendix C reports substantially larger reduced graphs and weaker transfer for its unified-MDS control; the largest transformation averages about 30,874 nodes versus 250 original nodes. The paper estimates twenty-epoch fine-tuning there at about two days on an L40S. This is a specific reduction/implementation study, not evidence that all SAT-based or reduction-based learning must fail. On thirty-seven DIMACS instances, pretrained MIS inference beats random initialization almost everywhere, with a tie on hamming8-4; MANN_a81 is still 300 versus best-known 1,100. These are zero-shot OOD heuristic results, not SOTA or optimality claims.
- **Runtime:** Table 14 explicitly reports totals over 500 RB-small graphs on a Tesla V100: GCON clique 1m20s and MIS 1m05s versus Gurobi 1m55s/47m34s, while GFlowNet takes 42s/32s. Table 13 lists L40S task evaluation times without equally explicit per-instance normalization; its values are not presented here as per-instance latency. Training and adaptation remain additional costs.

## Limitations

The reduction/transfer relationship remains incomplete and empirically sensitive to graph topology and initialization. Frozen backbones can fail under complementary-graph distribution shift, and the chosen tasks do not span arbitrary combinatorial optimization. Most main tests are synthetic and target adaptation is substantial. Positive transfer is not uniform, coloring retains violations, and stronger conventional/specialist baselines remain ahead in several settings.

**Source qualification:** Appendix C inconsistently describes the direction of its graph transformations: Algorithm 1 builds an MDS instance from MVC, while surrounding table/text sometimes describes the opposite starting direction. Recovering an original solution also requires handling gadget nodes, beyond a literal complement of all reduced-node assignments. The displayed control is therefore reported as the authors' experiment, without turning its schematic description into an independently verified reduction theorem or a general impossibility result. Similarly, the generic “strictly enforces constraints” statement is narrowed by Appendix B and the nonzero coloring results. Current `metrics.py` confirms thresholded MaxCut, argmax coloring violations and explicit MDS coverage/fallback handling; it does not supply an optimality certificate.

## Reproducibility

- **Full text/metadata:** Freshly read all twenty pages of the formal PMLR 306 paper, including the four-page bibliography and Appendices A–D. Both figures and main/appendix tables were rendered and checked. Five authors and the actual Montréal/Mila/Valence Labs/Boise State affiliations are verified from page 1. [Primary arXiv history](https://arxiv.org/abs/2603.02462) establishes first submission on 2 March 2026; [PMLR HTML](https://proceedings.mlr.press/v306/canturk26a.html) explicitly records publication on 29 September 2026, distinct from the July meeting.
- **Code/supplements:** [semihcanturk/COPT-MT](https://github.com/semihcanturk/COPT-MT) includes multitask training and fine-tuning configurations. The main README was read, including the actual multitask/adaptation commands after its acknowledged template sections. Relevant loss, decoder, shared-head and training code was inspected; no experiment rerun was performed. The 296-member official archive contains no PDF, notebook, nested archive or video, and the publisher page provides no separate scientific supplement beyond the integrated appendices.
- **Figure/relations:** Original Figure 1 is cropped from formal PDF page 3 with the complete caption. Bibliography identities are checked manually rather than relying on two-column text matching. The cited Zong et al. UniCO (arXiv:2505.06290) is a different paper from Pan et al.'s existing UniCO entry, so no false edge connects them.
