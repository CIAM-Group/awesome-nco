---
id: memento
short_title: MEMENTO
title: Memory-Enhanced Neural Solvers for Routing Problems
authors:
- Felix Chalumeau
- Refiloe Shabe
- Noah De Nicola
- Arnu Pretorius
- Thomas D. Barrett
- Nathan Grinsztajn
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/2f888eaccece0de24cc29d3ed02fd54b-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/2f888eaccece0de24cc29d3ed02fd54b-Abstract-Conference.html
institutions:
- InstaDeep
- University of Cape Town
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A learned memory module corrects construction logits using previous rollouts and remaining budget; network
  weights stay fixed during inference, while task-specific memory and search budgets govern adaptation.
code_url: https://github.com/instadeepai/memento
figure:
  path: paper-assets/memento/framework.png
  alt: Node-indexed memories of previous construction transitions supply learned logit corrections to a fixed base
    policy; newly generated tours add experience to the memory.
  caption: 'Figure 2: Memory-conditioned construction with frozen network weights at inference.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=4
---
# Memory-Enhanced Neural Solvers for Routing Problems

> **TL;DR:** Store outcomes from previous route constructions and use a small learned network to correct the next-action logits of a base solver. At inference, **both neural networks are frozen**; adaptation occurs through memory contents and conditional outputs. MEMENTO improves many tested routing settings and transfers its module to COMPASS, but quality gains depend on budget and can incur substantial runtime overhead.

## Motivation

Independent rollouts do not directly exploit feedback from earlier attempts on the same instance. Policy-gradient active search uses feedback but requires backpropagation and may adapt inefficiently with small batches. MEMENTO learns how to translate retrieved experience into action-logit corrections, enabling a budget-aware construction policy. Here “policy improvement” means adapting a distribution over newly constructed routes, rather than applying a neural move to an existing complete tour. [Sections1-3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=3)

## Contributions

- A node-indexed transition memory and lightweight auxiliary network that outputs additive construction-logit corrections.
- Offline multi-shot training emphasizing improvements over previously found solutions and conditioning on remaining inference budget.
- Zero-shot integration of a POMO-trained memory module with a task-matched COMPASS policy.
- TSP/CVRP evaluation at100-200 nodes and separately trained500-node models, with time/sample-budget studies, feature ablations and update-rule analyses. The claimed11-of12 best results are restricted to the paper's evaluated settings and comparator protocols. [Sections3-4.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=5)

## Methodology

### Memory retrieval and logit correction

Each transition records its current node, selected next node, trajectory return, action log-probability, memory correction information, trajectory/suffix log-probabilities and the budget stage. Retrieval uses the **same current node**, separately by starting point, as a cheap proxy for full partial-state similarity. It does not identify states by all visited nodes or exactly match remaining-route context. The published CVRP implementation additionally provides normalized remaining-capacity differences to the auxiliary network. [Section3.2/AppendixI.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=5)

Retrieved features are normalized and combined with remaining budget. A two-hidden-layer MLP, with eight units per hidden layer and GELU, maps each entry to a scalar. Weighted one-hot encodings of past actions are aggregated into a correction vector, added to the base action logits before the final action distribution is formed. The inspected code averages over the memory-entry axis and applies the usual final logit clipping; its scalar weights are not a separately normalized attention distribution. [Figures2-3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=4)

Memory has finite capacity: typical inference settings retain40 entries per node/starting point. The method's ability to reuse experience should not be described as unlimited storage of every past attempt. An alternative nearest-neighbor lookup based on decoder-state embeddings is discussed, but the chosen method uses node indexing to avoid its additional cost.

### Offline training versus inference

Training starts from a pretrained POMO policy. It rolls out repeated attempts on each training instance, rewarding positive improvement over the best prior return, with increasing logarithmic weights as budget is spent. Gradients accumulate across the budget before an optimizer update. **Encoder, decoder and memory-module parameters are trained together**; an optional later phase freezes the base and trains only the memory at one-tenth learning rate. Thus the learned base checkpoint may differ from the original POMO base used by an EAS comparator. [AppendixB/Algorithm1.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=27)

The published loss code handles the first attempt with its raw return, subtracts a mean baseline across rollouts, then uses rectified improvements for later attempts. It computes the loss before updating the stored best return. Algorithm1's displayed update-before-improvement order should not be implemented literally, since doing so would erase a positive improvement. The informal claim that summed positive increments equal the final best return also requires a first-return/initial-baseline convention; the code includes that special case.

At inference, **base and auxiliary weights both remain fixed**. Each completed attempt writes experience, changing future conditional logits. This is neither policy-gradient fine-tuning nor neural editing of a complete incumbent tour. The classification is therefore corrected to **specialist / constructive**. TSP and CVRP have separate checkpoints, and100/500-node models are trained separately; zero-shot module transfer between POMO and COMPASS on the same task is not cross-task generalist training.

The COMPASS combination leaves the memory inactive for the first half of the budget, letting latent-policy search specialize, then activates memory while COMPASS search continues. The transferred component needs no additional training in that experiment; the underlying policies and task/size models still require their own offline training. [Section4.2.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=8)

### Scope of the update-rule argument

AppendixF shows that the memory MLP can represent a term resembling the selected-action REINFORCE logit derivative, R(1−π(a)). It does not derive an exact complete parameter-gradient update: the other softmax-logit components include−Rπ(b), and a parameter update also involves the network Jacobian. The result is treated as an **informal expressivity motivation for a REINFORCE-like correction**, not proof that this finite-memory system exactly reproduces every policy-gradient update or converges to an optimal solver. [AppendixF.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=29)

## Experiments

### Training and budgets

Standard routing models train at100 nodes and transfer to125/150/200. Test sets have10,000 instances at100 and1,000 at each larger size. Main evaluation omits eight-fold augmentation and gives **1,600 sequential attempts, each with one trajectory per starting point**. This is1,600N route constructions, not1,600 routes in total. Augmented and matched-runtime studies are separate protocols. Experiments use JAX/Jumanji on TPUv3-8. [Section4.1/AppendixA.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=6)

MEMENTO trains with budget200. At100, batch64/start100 and200 gradient-accumulation steps are listed. Memory learning rate is.004, while encoder/decoder use.0001. At500, TSP uses batch32/start30/accumulation400 and80 training memory entries; CVRP uses batch8/start100/accumulation800 and40 entries. Both use40 entries at inference. Training500-node POMO warm-starts from100, with efficient attention and gradient accumulation; the base training takes about four days, before additional COMPASS/MEMENTO training. Total research compute is not established by that base-only duration. [Tables10-12.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=28)

### Standard benchmark: quality and overhead

| Setting | MEMENTO(POMO) gap / time per instance | EAS gap / time per instance |
| --- | --- | --- |
| TSP100 |.045% /43s |.161% /39s |
| TSP200 |.664% /115s |.672% /91s |
| CVRP100 |.066% /118s |.081% /66s |
| CVRP200 |2.205% /392s |2.460% /179s |

At equal attempts, MEMENTO improves EAS's displayed gap in all eight standard settings but is slower in these examples. COMPASS integration also trades time for quality: CVRP200 changes2.098%/85s to1.808%/272s. On TSP200 the change is much smaller,.349%/49s to.348%/88s. These differences do not establish statistically significant gains over independent training seeds. [Tables1/2/5.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=24)

When runtime is matched to EAS, the paper reports six-of-eight wins, with close exceptions. Table7 includes a CVRP100 inconsistency between displayed objective ordering and gap ordering; its aggregate should not be treated as an independently reconciled statistic. With augmentation, EAS is better on **TSP200 and CVRP125/150**, so the fixed-attempt unaugmented comparison does not transfer unchanged to every protocol. [Tables6-7.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=25)

SGBS values are copied from its paper, with a different POMO checkpoint, augmentation and CVRP starting-point preselection. TSP200's displayed SGBS gap.619% is better than unaugmented MEMENTO.664%. The authors' expectation that a fully matched SGBS comparison would favor MEMENTO is not itself a measured result. CVRP gaps use LKH heuristic incumbents; HGS can give better references. Negative LKH gaps do not mean surpassing the optimum.

### Larger instances and the11-of12 claim

At500 nodes, budgets are25,000 and100,000 completed construction attempts. COMPASS uses ten simultaneous latent vectors and correspondingly fewer starting points to keep total parallel trajectories comparable, affecting memory organization and JAX compilation. TSP and CVRP each have128 test instances. Unlike the standard per-instance table, the large comparison times are **for the full dataset** because external baselines are included. [Section4.3/AppendixA.3.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=23)

MEMENTO(COMPASS) gives TSP500 gaps1.586%/1.507% in10/29 minutes under the low/high budgets. For CVRP500, low-budget cost37.309/.215% in12 minutes improves the displayed competitors. In the high-budget case, **EAS is better**:37.185/−.120% in36 minutes versus MEMENTO(COMPASS)37.251/+.059% in36 minutes; MEMENTO(POMO) is37.306/+.206% in65 minutes. This is the explicit exception behind the restricted11-of12 result. [Tables3-4.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=10)

Comparisons exclude method-agnostic local search for the concurrent neural baselines and do not include supervised LEHD in the main ranking. Claims of overall superiority must therefore retain the paper's comparator scope, training regime and postprocessing choices rather than imply dominance over every available neural/classical solver.

### Scaling, memory and ablations

The timing experiment varies size with50 starting points×100 iterations, and decoder depth with100 starts×160 iterations on CVRP100. At950 nodes, Table9 reports940s for MEMENTO versus1,122s EAS, but at100 nodes MEMENTO is148s versus84s. These are specific JAX/backend settings and timing studies, not quality evidence for a trained1,000-node solver. [AppendixA.4/Figure7.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=26)

The paper's simplified example has100 nodes×100 starts×40 entries×five float32 features≈8MB. Actual code stores additional fields, so that is not a measured full-process memory bound. Memory is linear in nodes **if start count is fixed**; using every node as a start makes this replicated component quadratic in N. It is independent of base-policy parameter count, not independent of instance/batch/search configuration.

Feature ablations support budget/age/log-probability context in the tested setup. Update-rule heatmaps hold other features fixed and provide qualitative interpretation, rather than a causal guarantee of exploration. Training-budget experiments cover100/200/300 on TSP100; the200-budget model is favored by hyperparameter tuning. Table13's printed percentages do not align transparently with its rounded objectives/reference, so no exact new gap claim is derived from them. [AppendicesG-K.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=32)

## Limitations

### Discussed in the Paper

- Extra computation/memory relative to the base policy, especially for large batches of instances.
- Same-node retrieval is a practical proxy for full-state similarity.
- Training jointly with diversity-based methods and extracting an analytic learned update are future directions. [Conclusion/AppendicesA/I.](https://proceedings.neurips.cc/paper_files/paper/2025/file/2f888eaccece0de24cc29d3ed02fd54b-Paper-Conference.pdf#page=10)

### Curator Notes

- Memory adaptation, parameter fine-tuning and incumbent solution editing are distinct mechanisms.
- Separate task/size checkpoints and offline joint training constrain transfer claims; only a task-matched module combination is shown without retraining.
- Equal route-attempt counts do not imply equal runtime; standard and large-table time units differ.
- High-budget CVRP, augmented/time-matched exceptions and SGBS checkpoint differences limit universal superiority claims.
- Pseudocode ordering, simplified memory accounting and informal REINFORCE expressivity should not be read as formal implementation or convergence guarantees.

## Reproducibility

- **Full reading:** all32 official NeurIPS pages, including complete checklist and scientific AppendicesA-K, all13 tables and11 figures. Framework/feature aggregation, update heatmaps, complete main/extended tables, scaling/training/ablation curves and budget analysis were visually checked.
- **Metadata:** official NeurIPS38/2025 publication and six authors are verified. The title-page full name **Thomas D. Barrett** is used, with the proceedings landing page's Tom Barrett understood as an alias. InstaDeep/UCT affiliations are retained. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2025/hash/2f888eaccece0de24cc29d3ed02fd54b-Abstract-Conference.html) explicitly records `citation_publication_date` as **2026-04-23**, independently of any paper-specific acceptance date. No unsupported acceptance or first-preprint date is introduced.
- **Scientific supplements:** the actual official Supplemental ZIP was downloaded and manually inspected: two outer members, containing a nested `code.zip` with356 members across four method branches. It contains code/configuration/readmes and four byte-identical framework PNGs, with **no separate PDF/TeX/notebook scientific appendix**. The framework PNG was visually read and matches the paper's method illustration. All scientific appendices are in the complete formal PDF. The82-entry public main-branch tree was also inspected and has no additional PDF/ZIP/TeX attachment.
- **Published code:** selected full loss, memory-feature aggregation, retrieval, trainer loss/best-update functions and task/training/COMPASS configurations were read directly from the published ZIP. They confirm first-attempt handling, a rollout-mean baseline, log weights, additional CVRP capacity context and memory-conditioned logits. README lists Python3.8/JAX0.4.6, four method branches, Docker and train/evaluation scripts; data/checkpoint links are reproduction assets. No TPU training or full benchmark rerun was performed.
- **Figure:** original complete Figure2/page4 cropped from the formal PDF, illustrating memory-derived logit corrections during repeated construction.
