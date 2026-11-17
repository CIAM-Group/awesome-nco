---
id: nds
short_title: NDS
title: Neural Deconstruction Search for Vehicle Routing Problems
authors:
- André Hottung
- Paula Wong-Chung
- Kevin Tierney
year: 2025
date: 2025-01-07
venue: TMLR
paper_url: https://openreview.net/forum?id=bCmEP1Ltwq
arxiv_url: https://arxiv.org/abs/2501.03715
code_url: https://github.com/ahottung/NDS
institutions:
- Bielefeld University
- University of British Columbia
scope: specialist
paradigm: improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Vehicle Routing Problem with Time Windows
- Prize-Collecting Vehicle Routing Problem
summary: A learned, seed-conditioned policy removes customers from incumbent routes; classical insertion and parallel simulated annealing rebuild and search, with separate task/size training and explicit time budgets.
figure:
  path: paper-assets/nds/framework.png
  alt: Autoregressive neural customer selection deconstructs incumbent routes before sequential greedy insertion reconstructs them.
  caption: 'Figure 1: Learned customer removal followed by classical reconstruction.'
  source_url: https://arxiv.org/pdf/2501.03715v2#page=4
publication:
  date: 2025-05
  source_url: https://arxiv.org/pdf/2501.03715v2#page=1
---
# Neural Deconstruction Search for Vehicle Routing Problems

> **TL;DR:** Learn which customers to remove and in which order, while delegating route rebuilding to classical insertion. NDS combines a seed-conditioned removal policy with simulated annealing and multiple search trajectories. Its strongest reported results use **task- and size-specific models**, days of offline training and explicit CPU/GPU search budgets.

## Motivation

Autoregressive construction predicts an entire route, making the number of decoding steps grow with the instance. NDS instead predicts a short removal sequence from a complete incumbent, then exploits an inexpensive classical repair rule. Fixing the removal count fixes the number of neural decoding steps, **not the total complexity of encoding, insertion or the whole search**. [Sections1/4.](https://arxiv.org/pdf/2501.03715v2#page=4)

## Contributions

- An incumbent-aware autoregressive deconstruction policy, with a random binary seed to diversify its removal sequences.
- A training procedure that reinforces the best improvement among multiple seeded rollouts.
- A CPU/GPU search design that reuses a batch of neural removal sequences across successive incumbent changes, reducing communication overhead.
- Evaluation on CVRP, VRPTW and **prize-collecting VRP**, including larger instances, distribution shifts, size transfer, ablations and training curves. PCVRP is not the minimum-prize PCTSP. [Sections3-5.](https://arxiv.org/pdf/2501.03715v2#page=3)

## Methodology

### Incumbent-aware removal and classical repair

The model encodes coordinates and task features, current tour assignments and each customer's predecessor/successor. Its128-dimensional encoder uses two initial attention layers, message passing over solution neighbors, tour aggregation and two further attention layers. An autoregressive attention/pointer decoder with recurrent state selects **15 customers**, without replacement, conditioned on a10-bit seed. The current public encoder applies tour aggregation before message passing, whereas the paper describes them in the opposite order; this source-version distinction is retained. [Sections4.2.1-4.2.2.](https://arxiv.org/pdf/2501.03715v2#page=6)

The tour-layer prose describes a mean, but its displayed formula uses a **sum**. The inspected implementation also uses `scatter_add` without division. This note follows the equation/code for that operation rather than silently equating the two aggregations. The complete network still encodes all customers and includes attention, so a fixed15-step decoder does not imply constant runtime or memory in instance size.

The selected customers are removed and reinserted sequentially. For mandatory-service routing, greedy insertion selects a feasible low-incremental-cost position, opening a tour when needed. Test-time repair tries **five orders: the neural order and four random permutations**, retaining the best reconstruction. PCVRP permits non-service and balances incremental travel against prize; the released C++ code also contains randomized single-customer-tour creation. It should not be described as a universally deterministic repair procedure. [Sections4.1/5.1.](https://arxiv.org/pdf/2501.03715v2#page=5)

For PCVRP, the conceptual objective maximizes collected prizes minus travel. The released solver reports the equivalent minimization **travel + uncollected prizes**, obtained by adding the constant total available prize to travel minus collected prizes. Thus the positive costs and percentage gaps in the tables are not percentage changes in profit.

### Training

Algorithm1 starts with classical single-customer tours and performs **10 neural warm-up improvement steps**. Each of100 subsequent training iterations samples128 seeded removal rollouts from the current incumbent. Reward is the positive part of its cost reduction, and the best rollout receives the REINFORCE signal relative to the mean rollout reward. Gradients accumulate over the100 iterations before a parameter update. The algorithm and released policy-loss function use a **mean-reward baseline**; the surrounding prose's reference to average cost is not substituted into the loss. If all clipped rewards are zero, selecting a tied candidate does not establish monotonic improvement of the training chain. [Algorithm1/Section4.2.3.](https://arxiv.org/pdf/2501.03715v2#page=5)

### Search and classification

At evaluation,200 seeded removal sequences are generated from the **same starting incumbent**, then applied **sequentially to a changing incumbent** on the CPU. They are not200 independent candidates all repaired from that starting state. The deliberately stale neural guidance reduces CPU/GPU transfers. Simulated annealing can accept worse states while a separate best solution is retained. Multiple augmented trajectories share GPU inference; trajectories above the best cost plus a temperature-scaled threshold can be replaced by a better trajectory. [Section4.3/Figure2.](https://arxiv.org/pdf/2501.03715v2#page=7)

Main settings use temperature.1 to.001, threshold factor15, eight augmentations for CVRP/VRPTW and128 for PCVRP. Supplemental runtime sweeps change PCVRP augmentation counts at some budgets and sizes; they are separate protocols. Network weights remain fixed during this search: incumbent replacement and temperature changes are not test-time parameter adaptation.

The entry remains **specialist / improvement**. Learned actions edit complete incumbents through removal; classical initialization and insertion do not constitute a new neural constructor. Each task and principal size is trained separately. Reusing the architecture across three problems does not demonstrate one shared multi-task checkpoint.

## Experiments

### Training, data and resources

The principal sizes are100,500,1,000 and2,000 customers. For sizes through1,000, each task/size model trains for2,000 epochs with1,500 new instances per epoch,100 improvement steps per instance and128 removal rollouts per step, at learning rate1e-4. Reported training takes approximately **five/eight/fifteen days for100/500/1,000**. The2,000-node model starts from a1,000-node checkpoint after1,500 epochs and receives500 additional epochs, taking about eight more days. These are substantial offline model costs, not the short inference times in the main table. [Section5.1/AppendixB.](https://arxiv.org/pdf/2501.03715v2#page=9)

CVRP test sets contain10,000 instances at100,128 at500 and100 at1,000/2,000, drawn from the cited benchmark sources. VRPTW and PCVRP use10,000 at100 and250 at each larger size. Their task generators and distributions differ; the same table size does not imply identical instances or capacities across papers. The VRPTW generator follows the cited Solomon-style procedure, while prizes are associated with PCVRP customers.

Runs use one A100 and a single CPU core, with approximate per-instance limits **5/60/120/240 seconds** at100/500/1,000/2,000. Neural baseline total-set budgets are adjusted for their parallel processing. This addresses measured inference time; it does not equalize offline training, checkpoint scale or the resources of CPU-only methods.

### Main results

| Task |100 |500 |1,000 |2,000 |
| --- | --- | --- | --- | --- |
| CVRP: gap to time-limited HGS |.04% |-.20% |-.90% |-2.34% |
| VRPTW: gap to time-limited PyVRP/HGS |-.19% |-2.17% |-3.14% |-3.50% |
| PCVRP: gap to time-limited PyVRP | -2.07% |-4.12% |-4.71% |-4.60% |

NDS has the best displayed result in **11 of12** task/size settings; HGS is slightly better on CVRP100. Reference solutions here are time-limited heuristic incumbents, not proven optima, so negative gaps do not mean surpassing a true optimum. Differences can be very small: at2,000 customers, CVRP costs are56.00 versus SISRs56.04, and VRPTW167.48 versus167.49. Main-table repeated-seed uncertainty is not provided, and descriptive superiority is not a statistical significance test. [Table1.](https://arxiv.org/pdf/2501.03715v2#page=10)

The runtime study is more qualified than uniform dominance: NDS's CVRP500 result at30 seconds beats SISRs at250 seconds in that experiment, but **SISRs is better on PCVRP500 at15 seconds**. Supplemental curves extend the budget and sometimes change augmentation counts. Their results must be interpreted with those settings. [Figure3/AppendixD.](https://arxiv.org/pdf/2501.03715v2#page=11)

### Baseline qualifications and ablations

SISRs is the authors' own C++ reimplementation because its original implementation was unavailable. BQ and LEHD use models trained at100 and transfer to larger sizes, whereas NDS generally trains for the target size. UDC is retrained at500/1,000;2,000-node training runs out of memory, and its1,000-node sample count is reduced. BQ's2,000-node beam64 setting also runs out of memory. GLOP retains its published fast LKH3 configuration and is not extended to consume the full NDS budget. These are documented comparisons, not perfectly matched training/generalization experiments. [AppendixA.](https://arxiv.org/pdf/2501.03715v2#page=17)

Ablations train for1,000 epochs rather than the main2,000 and use separate evaluation settings:1,000 ASA iterations/eight augmentations for CVRP/VRPTW,50 iterations/128 augmentations for PCVRP. Removing both message and tour layers degrades the displayed PCVRP cost from42.96 to43.62; individual CVRP differences can round to the same36.81. Learning reinsertion order gives only small displayed improvements (.05/.08/.09 across the three tasks), while warm-up and the neural removal policy are more consequential in their tested comparisons. [Tables2/3/AppendicesE-F.](https://arxiv.org/pdf/2501.03715v2#page=12)

Distribution transfer is tested on CVRP500 using changes in capacity and uniform/clustered locations, not unrestricted cross-problem transfer. Size transfer uses500-trained models: at CVRP2,000, the gap changes from **-2.34% in distribution to+.43% out of distribution** (cost56.00 to57.63). VRPTW transfers more closely, while PCVRP2,000 changes from-4.60% to-3.24%. Thus transfer works to differing degrees and can reverse a baseline ranking. [Table4/AppendixG.](https://arxiv.org/pdf/2501.03715v2#page=25)

The scalability plot reports61% more time and23% more GPU memory at1,000 than100 under its evaluated procedure. This empirical plot does not establish size-independent complexity, especially given full-instance attention and classical repair costs. All12 training curves,36 removal-sequence visualizations and the complete runtime/hyperparameter plots were inspected.

## Limitations

### Discussed in the Paper

- GPU-dependent neural inference and the need for training data resembling the target distribution.
- Long task/size-specific training; a foundation model with adaptation is a future direction rather than an evaluated capability.
- Dependence on the quality of greedy reconstruction and repeated search. [Conclusion.](https://arxiv.org/pdf/2501.03715v2#page=13)

### Curator Notes

- Fixed removal length limits decoder steps, not whole-solver asymptotic cost.
- Sequential reuse of a neural removal batch, annealing, augmentation counts and repair permutations all affect the effective search budget.
- Main comparisons use different offline model budgets and include custom baseline implementations, memory failures and transferred100-node models.
- The tour mean/sum wording and layer-order differences between paper and current code are recorded explicitly. Public configuration also restricts reinsertion to newly represented/affected tours, so its candidate positions should be checked before treating the release as a literal transcription of the paper's generic insertion description.
- Percentage gaps depend on the actual reference objective, particularly PCVRP's constant-shifted cost; they are not proof of optimality or relative profit improvement.

## Reproducibility

- **Full reading:** all25 pages of actual arXiv2501.03715v2, dated2025-10-06 and carrying the TMLR05/2025 header, including complete AppendicesA-G. Original diagrams, equations, tables, all training/rollout plots and extended experiments were visually checked.
- **Metadata:** first arXiv submission2025-01-07 is confirmed by its version history. Publication is recorded at the **month precision May2025** stated in the PDF, replacing an unsupported exact acceptance date. The title page verifies three authors and Bielefeld/UBC affiliations, correcting the old TU Dortmund attribution. Reading this later author version does not assert byte identity with the formal publication.
- **Scientific supplements:** the OpenReview landing page returns an access challenge and its API403; unavailable attachments are not claimed to have been inspected. The complete identified author version includes AppendicesA-G, all read, with no explicit missing scientific-material pointer. The manually scanned139-entry official code tree contains no separate PDF/ZIP/TeX scientific attachment.
- **Code:** [ahottung/NDS](https://github.com/ahottung/NDS) provides Python/PyTorch inference, C++ routing operators, data, task/size checkpoints and YAML configurations. README, encoder/tour aggregation, reward/policy-loss, annealing/search and PCVRP objective/repair code were inspected. Current500-node configurations confirm15 removals, five repair attempts and task-specific search/training settings; their initializer options are retained as public-release settings rather than inferred formal guarantees. No multi-day training or full benchmark rerun was performed.
- **Figure:** original complete Figure1/page4 cropped from the actual read PDF; it illustrates neural removal followed by classical reconstruction.
