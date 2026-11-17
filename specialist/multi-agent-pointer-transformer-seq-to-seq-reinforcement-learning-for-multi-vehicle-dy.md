---
id: multi-agent-pointer-transformer-seq-to-seq-reinforcement-learning-for-multi-vehicle-dy
short_title: MAPT
title: 'Multi-Agent Pointer Transformer: Seq-to-Seq Reinforcement Learning for Multi-Vehicle Dynamic Pickup-Delivery
  Problems'
authors:
- Zengyu Zou
- Jingyuan Wang
- Yixuan Huang
- Junjie Wu
year: 2026
date: '2025-11-21'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/38700
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/38700
institutions:
- Beihang University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- Multi-Vehicle Dynamic Pickup and Delivery with Stochastic Requests
summary: A centralized relation-aware Transformer autoregressively assigns visible requests and vehicle destinations,
  using handcrafted priors and feasibility masks; dataset-specific PPO policies improve simulated delivery objectives,
  with qualified transfer and current-release differences.
arxiv_url: https://arxiv.org/abs/2511.17435
code_url: https://github.com/Beihang-BIGSCity/MAPT
figure:
  path: paper-assets/multi-agent-pointer-transformer-seq-to-seq-reinforcement-learning-for-multi-vehicle-dy/framework.png
  alt: Current dynamic state is encoded with entity-relation attention; an autoregressive pointer decoder combines
    learned probabilities with informative priors to schedule requests and vehicles.
  caption: 'Figure 1: MAPT state encoding, joint sequential decoding and informative-prior fusion.'
  source_url: https://arxiv.org/pdf/2511.17435#page=4
---

# Multi-Agent Pointer Transformer: Seq-to-Seq Reinforcement Learning for Multi-Vehicle Dynamic Pickup-Delivery Problems

> **TL;DR:** MAPT makes centralized, sequential pickup/delivery decisions as previously unknown requests arrive. Relation-aware attention represents stations, requests and vehicles; autoregressive decoding coordinates assignments and destinations, while handcrafted priors guide exploration. **Specialist/constructive:** separately trained dataset policies address one dynamic routing formulation; scale/distribution transfer does not establish a cross-problem generalist checkpoint.

## Motivation

Dynamic requests require routing decisions before the complete day's demand is known. Independent vehicle policies can conflict over requests or capacity, while repeatedly solving a large static planning window can be expensive. MAPT models the joint action distribution directly and uses relationships between heterogeneous entities. The evaluated rolling-horizon baselines plan less frequently than MAPT; their delays and runtimes are properties of these protocols, rather than evidence that all rolling-horizon methods must wait for the same batch size. [Sections1–2/AppendixB.](https://arxiv.org/pdf/2511.17435#page=1)

## Contributions

- A centralized MDP represents multi-vehicle dynamic pickup/delivery with stochastic request arrivals, finite capacity and a finite planning horizon.
- Relation-aware attention adds learned relationship biases to entity attention scores.
- Autoregressive pointers first assign visible requests to eligible vehicles or defer them, then select destinations for idle vehicles, conditioning later decisions on earlier ones.
- Load/distance priors and PPO training are evaluated through eight datasets, component ablations, prior-only comparisons and limited scale/distribution transfer.

## Methodology

### Environment and joint construction

Stations form a fully connected travel-time matrix. A request has an origin, destination, value, cargo volume and appearance time; its information becomes available only on arrival. Vehicles have capacity, spare space, current destination and remaining travel time. A moving vehicle cannot change its destination. The current state is centrally observable, but future requests are not. [Sections2.1–2.2.](https://arxiv.org/pdf/2511.17435#page=2)

At each step, an unassigned request may be loaded onto a co-located, idle vehicle with sufficient space, or deferred. Idle vehicles choose their next stations. Travel proceeds and completed deliveries release space. The finite-horizon objective is completed-request value minus travel cost; service of every request is not required. The implementation pays a request's value when newly delivered and charges travel as it occurs, rather than repeatedly rewarding all previously completed requests.

Linear projections embed station request counts, vehicle capacity/space/travel time, request value/volume and global time/request count. Distance and categorical relationships—including request origin/destination and pickup/delivery association—enter an attention bias. A Transformer encoder contextualizes all entities. The decoder points to vehicles for requests and to stations for vehicles, updating feasibility after preceding choices. Chain-rule factorization is valid for a chosen order; it does not prove permutation invariance of the learned policy with positional encodings. [Sections3.2–3.3/Equations8–20.](https://arxiv.org/pdf/2511.17435#page=4)

### Priors and learning

The printed request-assignment prior favors available vehicle space and assigns a small weight beta to deferral. The destination prior gives weight1 to needed delivery stations, distance-scaled weight to pickup stations and zero to other stations. These weights multiply neural probabilities; the released `Categorical` distribution normalizes the result, with explicit fallback actions when all weights vanish. Priors change which actions can be explored and do not guarantee retention of an optimal waiting/repositioning action. [Section3.4.](https://arxiv.org/pdf/2511.17435#page=5)

PPO trains the joint policy, with a critic based on global context, GAE, clipping and validation-model selection. AppendixF specifies six encoder/two decoder layers, hidden size128, two heads, gamma=.99, GAE lambda=.99, clipping.2, critic coefficient1, one PPO epoch and beta=.03. Adam uses a quarter-budget warm-up followed by linear decay. Attention is quadratic in the total number of stations, vehicles and considered requests; KV caching reduces repeated decoder work without making overall inference linear. [AppendicesD–F.](https://arxiv.org/pdf/2511.17435#page=11)

The public release additionally contains small-capacity TSP-permutation calculations that mask assignments/destinations unable to finish carried deliveries before the horizon, plus a delivery-distance/load combination in the request prior. These go beyond the simplified printed priors. Such classical feasibility computations do not turn the method into a learned incumbent-improvement solver.

## Experiments

### Datasets and training budget

Synthetic S/L/XL instances use20/50/300 stations,110/550/550 requests and5/15/50 vehicles, each with capacity3. Random integer edge weights are converted to shortest-path distances. Horizons are58/128/128; request value is origin–destination distance. S/L also have travel-cost.3 variants, while their default and XL use zero travel cost. [Tables2/5 and AppendixC.](https://arxiv.org/pdf/2511.17435#page=6)

DHRD-derived environments use food-order origins/destinations from Taipei, Singapore and Stockholm, aggregated to36 geographic areas. They simulate800/700/200 requests and20/15/3 vehicles with capacity6. Travel times are area-hop distances, the horizon has48 daily slots and each completion earns1 with zero travel cost. Thus these are routing simulations using real demand, not production delivery deployments or measured monetary profit. The split is76 days for training/validation and14 for testing.

Table6 gives dataset budgets of16K for S,4K for L/XL,8K for Stockholm and2K for Taipei/Singapore, with64/256 rollout and minibatch sizes and learning rates1e-5–1e-4. The release's `num_episodes` is divided by parallel rollout threads before training:16,384 episodes with256 threads give64 rollout batches, each covering the configured horizon. These values should not be multiplied together as16K independent update iterations. The paper's pseudocode and generic “Total” label are less explicit about this unit. Training seeds, complete run dispersion and hardware-matched inference accounting are not fully specified by the reported tables.

### Quality, speed and negative cases

MAPT has the highest reported objective/completion in all eight Table2 columns. For example, synthetic-L is1,875.1/.80 versus Nearest962.6/.41 and MAPDP958.1/.37; Taipei is697.2/.87 versus MAPDP135.4/.17. Starred static baselines receive complete future-request information but are budgeted, adapted solvers, not certified clairvoyant optima. PARCO/MAPDP integrations were modified for distance-matrix inputs, so these numbers should not be treated as exact reproduction of their original papers' protocols. [Section4.2.](https://arxiv.org/pdf/2511.17435#page=6)

The **prior-only baseline is essential**: on synthetic-L it already reaches1,858.9, near MAPT1,875.1. On XL, MAPT3,227.5 exceeds prior-only2,340.7; on the three DHRD environments it gives roughly14–19% higher objectives. Removing all priors causes a much larger deterioration than removing relation attention in Table3. These comparisons support useful learned corrections in the tested setting without attributing the entire gain to neural joint decoding. [AppendixH/Table7.](https://arxiv.org/pdf/2511.17435#page=13)

Table4 reports seconds per whole simulated instance: MAPT1.420/1.416 on S/S-cost,8.300/7.888 on L/L-cost and27.434 on XL. It is slower than MAPDP on S (.794/.827) and much slower than Nearest (.059–.148), while faster than the listed search baselines. SA uses up to5,000 iterations, GA population10/generations500; rolling-horizon replan intervals range10–30 steps. The source CP-SAT solver tries75/150/300-second limits if needed. These are not equally frequent or equally budgeted planning protocols. [Table4/AppendixJ.](https://arxiv.org/pdf/2511.17435#page=7)

Transfer is uneven. An S-trained model reaches2,470.2 on XL, below the XL-trained3,227.5, and74.4 on Stockholm versus its trained78.9. Conversely, Stockholm- and XL-trained models reach only117.4/109.8 on S versus S-trained275.2. No universal out-of-distribution improvement is demonstrated. [AppendixI/Table8.](https://arxiv.org/pdf/2511.17435#page=13)

## Limitations

The model observes all current entities centrally, has quadratic attention and depends on bounded considered-request counts and small vehicle capacities in the public implementation. Learned positional/optional station embeddings and handcrafted priors can limit transfer. The selected tasks omit additional operational details such as individual delivery deadlines or continuous road-network dynamics. Larger vehicles also make the release's permutation-based feasibility calculations more costly.

The paper gives empirical comparisons rather than an approximation or optimality guarantee. Statistical uncertainty is not sufficiently reported to convert every table improvement into an independently established significance claim. Higher objective than a limited static baseline does not establish superiority to an optimal future-informed planner.

Some printed and released details differ: the release defaults to five encoder/three decoder blocks, versus six/two in AppendixF; its DHRD configuration has49 frames and a200-request consideration cap, versus the48-slot paper description. AppendixJ Equation37 prints a pickup-to-delivery implication whose literal direction would require repeated deliveries; the released CP-SAT implementation instead correctly constrains each delivery to have a preceding pickup by that vehicle. The note follows the executable precedence semantics and does not claim the printed formulation can be copied verbatim.

## Reproducibility

- Formal eligibility: AAAI2026, DOI10.1609/aaai.v40i19.38700; publisher/Crossref metadata records2026-03-14. Four authors and Beihang affiliations match the primary byline, with Jingyuan Wang corresponding. arXiv2511.17435v1 appeared2025-11-21; the actual reading copy is **v2,2025-12-17**,15 pages including every scientific AppendixA–J, read in full. Formal PDF byte identity was not claimed.
- [Official repository](https://github.com/Beihang-BIGSCity/MAPT), tree SHA `df8b75d1a32d873f2486adeaed205eeac89db02e`, has35 entries: algorithms, environments, training runner, requirements and three scientific illustrations. The README and critical model/normalization/reward/PPO/budget/CP-SAT code paths were inspected; the illustrations match paper figures. No separate scientific PDF/ZIP was present. DHRD data must be obtained externally; trained evaluation checkpoints are not included in this tree.
- The official proceedings index also links a presentation. Underline141224's public API identifies `MAPT_oral.pptx`, but the asset returns403 and its download endpoint redirects to login. It was not registered or claimed read. All named scientific appendices are available and fully read in the accepted arXiv fallback; the unavailable presentation is disclosed separately.
- The current README's real-data example uses16K episodes/256 threads, which differs from some per-city Table6 budgets. Python3.10/PyTorch2.5 are the paper's environment; requirements additionally pin RL4CO0.6.0 but leave several dependencies unpinned. Current code differences and configuration choices should be reconciled before reproducing tables. No training or full benchmark rerun was performed here.
- Original Figure1 is cropped completely from reading-copy page4. Internal relations use explicit body citations and matching full references, preserving the actually cited preprint years. Distinct or absent catalogue works are not forced into a relation.
