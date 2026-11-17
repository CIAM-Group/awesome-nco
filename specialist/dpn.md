---
id: dpn
short_title: DPN
title: 'DPN: Decoupling Partition and Navigation for Neural Solvers of Min-max Vehicle Routing Problems'
authors:
- Zhi Zheng
- Shunyu Yao
- Zhenkun Wang
- Xialiang Tong
- Mingxuan Yuan
- Ke Tang
year: 2024
date: '2024-05-27'
acceptance:
  date: '2024-05-02'
  source_url: https://raw.githubusercontent.com/CIAM-Group/NCO_code/main/single_objective/DPN-minmaxVRP-master/Rebuttal_OpenReview.pdf#page=2
venue: ICML
paper_url: https://proceedings.mlr.press/v235/zheng24m.html
arxiv_url: https://arxiv.org/abs/2405.17272
code_url: https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/DPN-minmaxVRP-master
institutions:
- Southern University of Science and Technology
- City University of Hong Kong
- Huawei Noah’s Ark Lab
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Min-max Multiple Traveling Salesman Problem
- Min-max Multiple Pickup and Delivery Problem
- Min-max Multi-depot Vehicle Routing Problem
- Min-max Flexible Multi-depot Vehicle Routing Problem
- Min-max Capacitated Vehicle Routing Problem
summary: A single autoregressive constructor separates partition/navigation representations, trains with agent-order symmetry and depot-aware positional features, using distinct models across four min-max routing tasks; a public rebuttal additionally tests small capacitated cases.
figure:
  path: paper-assets/dpn/framework.png
  alt: One P&N encoder alternates customer navigation attention and agent/customer partition attention, with depot-conditioned rotation embeddings for agents.
  caption: 'Figure 2: initial embeddings and the P&N encoder inside a single-stage constructive policy.'
  source_url: https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=4
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/zheng24m.html
---
# DPN: Decoupling Partition and Navigation for Neural Solvers of Min-max Vehicle Routing Problems

> **TL;DR:** DPN constructs all routes with **one autoregressive policy** whose encoder separates partition-related and navigation-related representations. It does not first partition customers with one policy and then solve each part with a second policy. Agent-permutation-symmetric training and depot-aware rotation features support the min-max objective. The paper trains distinct task/scale models, so its classification is **specialist/constructive**.

## Motivation

Min-max routing minimizes the **longest vehicle route**, with a prescribed number of vehicles. Assigning customers among vehicles and ordering each route both affect that objective. A merged customer/agent self-attention representation can obscure their different roles, while always decoding agents in one order can induce order-sensitive behavior. DPN addresses these issues within sequential construction. It does not optimize total travel length or establish a general fairness/risk guarantee. [Sections1–3.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=1)

## Contributions

- The Partition-and-Navigation encoder uses customer self-attention for navigation and directed agent/customer attention for partition-related information.
- An agent-permutation-symmetric (APS) baseline averages costs from different decoding orders of the same set of agents.
- Rotation-based positional embeddings incorporate depot information when distinguishing single-depot agents; the multi-depot architecture adds explicit depot tokens and additional partition interactions.
- Main experiments cover min-max mTSP, paired pickup-and-delivery, same-depot-return routing and flexible-end-depot routing. The official archived rebuttal additionally reports a preliminary small capacitated experiment.

## Methodology

### One constructive policy, four main task definitions

The decoder selects customers or depot/route-boundary actions, completes one vehicle route and then proceeds to the next agent in its sampled order. The terminal cost is the maximum route length. Constraints are supplied by problem-specific states and masks: mTSP routes return to the single depot; mPDP requires pickup before its matching delivery on the same vehicle; MDVRP returns to the chosen starting depot; FMDVRP may finish at a different depot. The four main variants do not add general capacity or time-window constraints. [AppendicesB.1–B.5.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=14)

There is one encoder/decoder and one loss for partition and navigation, rather than separate learned decomposition and TSP-solution stages. Six P&N layers use customer-to-customer navigation attention, agent-to-customer attention and customer-to-agent **sharp attention**. Removing the usual square-root attention temperature makes the latter sharper, but it remains a softmax mixture: exclusivity is enforced by decoding constraints, not proved by sharp attention. Multi-depot tasks additionally model depot/customer and agent/depot relations. PDP uses heterogeneous customer attention and separate pickup/delivery features. [Figure2/Equations9–14 and AppendicesC.1–C.4.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=4)

### APS and agent representations

Relabelling the order of an unordered set of optimal vehicle routes preserves its longest-route objective. APS exploits this by sampling K agent orders and using their mean constructed-solution cost as the REINFORCE baseline. The released training code minimizes `(cost - mean_cost) * log_probability`; it shares encoder embeddings across permutations and defaults to K=60. This symmetry of optimal values does not imply that a trained model returns the same routes for every order. The public rebuttal's “bias” tables measure order-dependent objective differences, not a proof of an unbiased policy-gradient estimator. [Section3.2; rebuttalpp13–15.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=5)

Rotation features combine agent-index rotations with a projection of the depot coordinates; the multi-depot branch instead begins with a trainable dummy-depot embedding and represents actual depots separately. The base is1,000. These agent features differ from the eightfold coordinate augmentation used to generate inference candidates. Decoder context includes current agent/node, remaining customers/agents and route/depot-distance statistics; PDP adds paired-request distance information. The formal distance preference and some released implementation details differ, as recorded below. [Sections3.3/C.2–C.6.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=20)

No proposed neural operator edits a complete incumbent solution. Training-time fine-tuning changes parameters for an entire task/size setting, rather than performing a route-improvement move. **Constructive** therefore remains appropriate. AppendixD.1 explicitly lists **16 separately trained or fine-tuned models**, including task-specific architectures; one policy controlling multiple agents does not establish a shared checkpoint across optimization tasks.

## Experiments

### Training and inference budgets

The four tasks train separate50/100-scale models from scratch:500epochs ×256,000 instances, or128M instance presentations per model, batch256, K=60 permutations, six layers,128-dimensional embeddings, eight heads and512-dimensional feed-forward blocks. Agent counts vary from2 to10. Adam starts at1e-4; Table5 and source code specify learning-rate decay1, while the main text's “weight decay” wording should not be taken as Adam weight_decay=1. Table6 reports91.7/93.3/105/105hours for the four100-scale models on one TeslaV100S. [Tables5–6.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=24)

Large single-depot models fine-tune100-scale weights for20epochs at1e-5:1.28M presentations at200 nodes and.32M at500 nodes. The500-scale model is also tested at1,000 nodes. Multi-depot fine-tuning uses2.56M presentations; its depot-count settings are inconsistent between Table5's D=8 and the main50-scale evaluation discussion's D=6, so they should not be silently merged. Inference distinguishes plain decoding, ×8 coordinate augmentation and ×8 ×16 agent orders, the last producing128 candidates. Main synthetic test sets contain100 instances; displayed times refer to the **whole test set**, not each instance.

### Main results and comparison boundaries

On min-max mTSP100 with five agents,128-candidate DPN achieves2.2314 versus Equity-Transformer's8-augmentation2.2563 and HGA2.1893. On mPDP100 with five agents it reaches3.4960. The PDP gap reference is the best displayed method, rather than a certified optimum. Plain DPN is not always the best neural configuration: for mTSP100 with ten agents its0.4377% gap is worse than Equity-Transformer's0.4153%; even their8-augmentation gaps are0.1671% versus0.1652%. More candidates improve DPN to0.1542%. [Tables1–2.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=6)

The modified min-max mTSP SetI protocol fine-tunes a200-scale model with M ranging3–20 and obtains average5.36% gap, versus Equity-Transformer10.26% and HGA.07%; individual DPN gaps reach20.89%. The mTSPLib result selects the better of50/100-trained models, producing average2.81% versus Equity-Transformer4.60% and HGA.06%. Cross-distribution200-scale experiments use fine-tuned models: DPN improves over the neural comparator, and beats the one-run HGA on Rotation cases, while HGA retains better Gaussian/Explosion cases. These are not universal zero-shot or optimality claims. [Tables7–9.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=25)

Table4's multi-depot baselines are borrowed from prior reports; AppendixG explicitly says they use different datasets and are not accurate controlled comparisons. FMDVRP100 still favors CE/NCE in the displayed rows. Fine-tuning can worsen a result, e.g., FMDVRP50/M7 changes1.1619→1.1649. Figure19/20 baseline routes were recovered from pixels because code was unavailable, so their objective values may be inconsistent. [Tables4/AppendixG.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=34)

### Components, transfer and the100K variant

With matched128-candidate decoding at M=5, removing P&N, APS or rotation features changes mPDP100 cost from3.4960 to4.5119,5.1915 or3.5158 respectively. At M=10 the corresponding full cost is2.6949; mTSP improvements are much smaller, e.g.,1.9537 without P&N versus1.9532 full. Ablations replace components with prior mechanisms rather than necessarily matching capacity or training cost exactly. The10,000-instance depot-location grid supports improved robustness around central depots, not exact geometric equivariance. [Tables3/11; Figures8–9.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=27)

Table12 separately reports genuine100→200 zero-shot transfer:2.0227 at M=10 with128 candidates, improving to1.9993 after fine-tuning. This must be distinguished from the fine-tuned large-scale main table. The original dense navigation encoder has O(N(N+M)) space for one solution and reaches10K nodes on the stated GPU. The100K experiment **removes navigation attention and trains that variant from scratch on100-scale mTSP**, reducing encoder space to O(NM). Ten100K/M500 instances take two hours in total with objective4.2078; no competitive reference bound is supplied. This is neither original-DPN100K inference nor linear total runtime, and the rebuttal says the variant is less competitive at100–1,000 nodes. [AppendicesE.4/E.7; rebuttalp10.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/zheng24m/zheng24m.pdf#page=27)

### Additional public rebuttal experiments

The27-page author-archived OpenReview export reports min-max **capacitated** routing at20/30 nodes, M=3 and128 instances: DPN costs2.0272/2.2248, with reported whole-set time below one second. Masks and decoder context are changed, and prior-method numbers are borrowed. This preliminary fifth task is absent from the formal paper's four-task main evaluation and the inspected released task implementations. The rebuttal also provides250-epoch positional-base comparisons, empirical order-cost variance/bias tables and batch-one memory118.59 versus236.49MB on mTSP100 and146.03 versus318.09MB on mPDP100 for APS versus coordinate-symmetry training. These specific measurements do not prove general factor-two training speed or checkpoint universality. [Official scientific rebuttal.](https://raw.githubusercontent.com/CIAM-Group/NCO_code/main/single_objective/DPN-minmaxVRP-master/Rebuttal_OpenReview.pdf#page=4)

## Limitations

### Discussed by the Authors

The method targets fixed-vehicle min-max objectives, and extending to mainstream min-sum CVRP/CVRPTW is future work. Large decision spaces, notably100-scale FMDVRP, remain difficult. Removing navigation enables100K feasibility but sacrifices small/medium-scale competitiveness; heuristic timeouts do not establish100K solution quality.

### Curator Notes

- Shared architecture and sampled agent counts do not imply one jointly trained cross-task model. Fine-tuning, best-of-two checkpoint selection, augmentation and permutation budgets must be matched separately.
- Dense customer attention remains quadratic. The reduced per-layer interaction count O((N²+2NM)d) removes agent/agent interactions, not all pairwise storage or sequential decoding work.
- Formal problem equations and soft-attention interpretations are not a supplied general feasibility/optimality proof. Actual masking and each task's route objective matter.
- The inspected source's rotation implementation interchanges sine/cosine factors relative to Equation96. Its decoder uses **negative normalized distance**, rather than the printed exponential distance expression. Both are concrete source/formula differences, without claiming a matched experiment establishes their numerical effect.
- The released PDP `no_item_to_delivery` slice starts one element after the first delivery index, which may omit that request when checking whether a vehicle may return. This is a source-level reproduction concern requiring a feasibility check before reusing its outputs, not evidence that every reported paper tour is invalid.
- Formal Table5 uses500epochs but training plots show200; detailed Table6 times also differ from rough main-text estimates. Borrowed/rounded baselines, differing multi-depot datasets, unknown Equity-Transformer sampling budget and CPU/GPU differences restrict broad runtime rankings. Multi-seed uncertainty for all tasks is not established.

## Reproducibility

- **Reading:** all34 formal pages, bibliography and scientific AppendicesA–G, plus all27 pages of the author-released OpenReview rebuttal, freshly read. Encoder, equations, training table, auxiliary measurements and route figures were rendered and visually checked.
- **Metadata:** PMLR's actual publication meta gives8July2024; the archived decision explicitly records2May2024 acceptance. The arXiv v1 date27May2024 remains separate; the actual decision replaces a generic conference notification date. The formal first page supplies SUSTech, CityU HongKong and Huawei affiliations, and equal first contribution of Zheng/Yao.
- **Supplement inventory:** the PMLR landing page lists Paper/OpenReview; the live OpenReview page presents a browser challenge and API403. Its author-archived export identifies forum ar174skI9u and confirms camera-ready appendices were included. All named formal science is present; the official51-entry DPN source subtree additionally supplies the fully read27-page rebuttal. Its data ZIP has33 data/benchmark members and no additional PDF/TEX/notebook/archive science.
- **Code:** actual training, encoder, positional embedding, decoder and PDP-mask source inspected in the official DPN subtree, Git tree415cf60292b23fcc1ebb607d6ef116c470f29b36. The README has a copied Equity-Transformer heading, but the actual source implements P&N/APS/rotation and separate task commands. GoogleDrive is labelled pretrained models. The default loss uses no auxiliary subloss; optional contextual-MLP fine-tuning is separate from the main best fine-tuning protocol. No model training or reproduction run was performed here.
- **Relations:** only explicit in-text citations with matching full references support internal edges. Cited2018/2022/2024 preprint or printed volume years are preserved, including DAR's2024 precursor; uncatalogued Equity-Transformer, SplitNet and the distinct Sun2024 regret paper are not forced onto unrelated IDs.
- **Figure:** complete original Figure2, formal PDFpage4, cropped directly. [Formal publication](https://proceedings.mlr.press/v235/zheng24m.html); [official implementation](https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/DPN-minmaxVRP-master).
