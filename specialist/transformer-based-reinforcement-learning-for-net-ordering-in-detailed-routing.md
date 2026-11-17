---
id: transformer-based-reinforcement-learning-for-net-ordering-in-detailed-routing
short_title: TREND
title: Transformer-based Reinforcement Learning for Net Ordering in Detailed Routing
authors:
- Zhanwen Zhou
- Hankz Hankui Zhuo
- Jinghua Zhou
- Wushao Wen
year: 2025
date: '2025'
publication:
  date: '2025'
  source_url: https://www.ijcai.org/proceedings/2025/1055
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2025/1055
institutions:
- Sun Yat-sen University
- Nanjing University
- National Key Laboratory for Novel Software Technology, Nanjing University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- VLSI Detailed-routing Net Ordering
summary: A GCN/Transformer/pointer actor constructs regional net permutations for a classical detailed router, using
  routing-cost feedback and a critic. ISPD tests show selected quality gains and substantial runtime overhead; classical
  rip-up/reroute is distinguished from the learned permutation constructor.
code_url: https://github.com/xrouting/trend
figure:
  path: paper-assets/transformer-based-reinforcement-learning-for-net-ordering-in-detailed-routing/framework.png
  alt: Regional net features and overlap edges feed separate GCN/Transformer actor and critic; pointer decoding
    yields a net order and glimpse pooling estimates a baseline.
  caption: 'Original Figure 3: TREND actor/critic architecture.'
  source_url: https://www.ijcai.org/proceedings/2025/1055.pdf#page=4
---

# Transformer-based Reinforcement Learning for Net Ordering in Detailed Routing

> **TL;DR:** TREND learns an autoregressive permutation of unrouted nets inside a chip-routing region. A classical detailed router executes that order and performs rip-up/reroute. The learned method is **specialist/constructive** net ordering; classical host refinement alone does not make it a neural construction-and-improvement method.

## Motivation

The order in which nets consume routing resources affects connectivity and design-rule violations. Pin counts or bounding-box size alone miss pin accessibility, free space and interactions between nets. TREND uses these regional relationships to choose routing order rather than predicting a full physical wiring solution directly. This is VLSI detailed routing, not vehicle routing or an evaluation of TSP. [Introduction/problem formulation.](https://www.ijcai.org/proceedings/2025/1055.pdf#page=1)

## Contributions

- A region/net representation includes pin accessibility, available routing resources, bounding-box geometry and overlap relationships.
- An actor combines GCN feature propagation, Transformer encoding and pointer decoding of a variable-length net permutation.
- A separate critic and routing-cost reward support offline policy-gradient training.
- XRoute-Env integrates the policy with customized TritonRoute and evaluates ISPD2018/2019 with and without queue-based rip-up/reroute. [Architecture/environment.](https://www.ijcai.org/proceedings/2025/1055.pdf#page=4)

## Methodology

### Regional observation and neural action

A chip is partitioned into7x7GCell regions. Each net supplies ten scalars: pin count, access-point/pin ratio, available/total bounding-box vertices, three-dimensional position, three-dimensional relative size and number of overlapping nets. An undirected edge connects two nets with overlapping bounding boxes. The full environment also tracks physical-grid resources and existing paths; the neural observation is the extracted net graph.

The actor uses two GCN layers10->64->128, three Transformer blocks and a pointer decoder with a360-dimensional query. A visited mask prevents repeated indices, yielding one complete ordering of the region's unrouted nets. Greedy inference chooses the largest-probability next index. If average overlap rate is below.3, it returns the original classical order. Thus part of the deployed pipeline deliberately bypasses neural inference. [Table1/architecture.](https://www.ijcai.org/proceedings/2025/1055.pdf#page=3)

### Classical execution and learning

The router routes nets in the generated order and can rip up/reroute conflicting nets across iterations. TREND constructs the scheduling permutation from its current graph; it does not learn a physical-wire edit operator. Repeated calls during a classical optimization loop do not by themselves establish a separate neural incumbent-edit stage.

The displayed cost weights wirelength/vias/DRV by.5/4/500. Reward is the routing-cost reduction normalized by the region half-perimeter, with a baseline classical ordering used for initialization. Actor and critic have separate parameters; a glimpse head pools the critic encodings into one scalar. The manuscript describes REINFORCE actor updates and squared-error critic fitting. It inconsistently calls L a cost reduction while using b-L, so its reward/cost sign convention should be reconciled with the implementation rather than interpreted as a convergence theorem. [Equations1-5.](https://www.ijcai.org/proceedings/2025/1055.pdf#page=5)

### Public implementation boundary

The inspected actor source confirms the GCN/three-stack encoder/pointer dimensions and full permutation generation. The released train_trend.py sets dr=-r and computes dr-predictions inside `torch.no_grad()`, then squares that detached quantity for critic_loss. As written, that critic term cannot backpropagate the manuscript's stated MSE fitting gradient to the critic. This is a specific snapshot issue observed while checking the claimed training path, not a claim that all unpublished training runs used those bytes or that the published measurements have been independently invalidated.

## Experiments

### Training and routing budget

Training first uses regions from18t1 for30,000 steps at learning rate5e-5, then transfers the learned parameters to19t3 for20,000 steps at2e-5. These two training fixtures also occur in the20-case evaluation tables; results on the remaining fixtures are the relevant unseen-chip transfer evidence. The largest benchmark has899,404standard cells and895,253nets, but inference acts on regional net sets rather than one895,253-token global sequence.

All compared policies use the same XRoute-Env settings, at most64 routing iterations and a one-GCell region shift on alternate iterations. Hardware is a40-core Xeon E5-2650 server,240GB shared memory and two TitanXP GPUs with24GB combined VRAM. Full training wall time, multiple-training-seed uncertainty and complete benchmark statistical variation are not reported. [Tables2-3/setup.](https://www.ijcai.org/proceedings/2025/1055.pdf#page=5)

### Queue-based rip-up/reroute enabled

Table4 shows zero DRV for TREND and TritonRoute on19of20 cases; both retain20DRV on19t10. The main enabled-queue comparison therefore does **not** reduce DRV relative to TritonRoute in those rows. Wirelength/via trade-offs yield lower cost on several large fixtures, while TritonRoute is better on others. On19t10 the costs are60,902,977 versus60,907,651.5, a small aggregate difference, not a broad order-of-magnitude quality gain.

TREND is slower than TritonRoute in every displayed timing row. Examples are12h09m42s versus51m14s on19t8(about14.2x), and16h15m52s versus2h27m33s on19t10(about6.6x). It is faster than the displayed successful Lin-policy runs, while several Lin runs fail with unresolved first-iteration connectivity. A dash is a failure, not a zero-time or zero-cost result. [Tables3-4.](https://www.ijcai.org/proceedings/2025/1055.pdf#page=6)

### Queue-based rip-up/reroute disabled

The separate comparison covers16fixtures;19t7-19t10 exceed100hours for64iterations and are omitted. TREND often has fewer violations than TritonRoute, for example446versus615on19t6, but19t2 is worse(470versus173). Lower DRV does not uniformly imply the lowest weighted cost: on18t6, TREND has53DRV and cost7,226,870 versus Lin32DRV and7,223,364. The table itself includes such exceptions to the surrounding broad superiority wording. [Complete Table5.](https://www.ijcai.org/proceedings/2025/1055.pdf#page=7)

## Limitations

Quality gains depend on the host routing algorithm, queue setting, fixture and selected scalar weights. The major enabled-queue comparison mostly matches existing DRV counts while adding substantial runtime. Two training fixtures, no uncertainty intervals and region-based inference limit claims of generalization across technologies, rule systems or arbitrary chip sizes. Zero reported violations in a contest benchmark is not an independent manufacturing/signoff certificate. Model compression, broader training and more precise exploration are future work.

The public critic-update issue limits exact reproduction until reconciled. No training, full chip route or independent signoff run was performed during this review.

## Reproducibility

- Formal IJCAI2025 DOI10.24963/ijcai.2025/1055, pages9492-9500, is the **AI4Tech: AI Enabling Technologies** track. Four-author publisher metadata matches the full PDF; Zhuo corresponds. Affiliations are Sun Yat-sen University and Nanjing University, including its named laboratory. Official publisher BibTeX says August but deposited Crossref says September, so publication precision remains2025.
- **All nine formal pages were fully read**, including every result table, all24references and the final limitation discussion. No independent scientific appendix/proof attachment is promised. Normal primary/title searches identified no arXiv reading source needed beyond the available formal PDF.
- The [official repository](https://github.com/xrouting/trend) was inventoried at SHA1ddc3025c6a1ecfcd56fc1ce2782a11f440a241d:144entries, three READMEs, no PDF/TeX/ZIP/notebook scientific supplement and no releases. All three READMEs were read, together with the relevant actor/critic and training path.
- The public author-linked simulator folder was manually inspected: `openroad-noripup` and `openroad-ripup`, each79.3MB, are simulator artifacts, not an extra scientific proof. The README requires Ubuntu22.04, local OpenROAD dependencies, environment/server configuration and ports6667/5556. Simulator binaries were not executed or treated as fully reproduced experiments.
- Complete original Figure3 is cropped from formal PDFpage4, rectangle(47,50,568,182), at4x and actually viewed. The physical example, reward equations, timing table and complete quality tables were rendered and inspected.
- The only confirmed internal reference is Pointer Networks, explicitly cited in the decoder discussion and full bibliography. Other topic-related works and distinct journal/conference extensions are not forced onto existing IDs.
