---
id: polynet
short_title: PolyNet
title: 'PolyNet: Learning Diverse Solution Strategies for Neural Combinatorial Optimization'
authors:
- André Hottung
- Mridul Mahajan
- Kevin Tierney
year: 2025
date: '2024-02-21'
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/c7b9810b2e27bccdc8d605a3a54c8cd6-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2402.14048
code_url: https://github.com/ahottung/PolyNet
institutions:
- Bielefeld University
- Boston University
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Capacitated Vehicle Routing Problem with Time Windows
- Flexible Flow Shop Problem
summary: A bit-vector-conditioned single decoder learns complementary construction strategies through winner-only
  training; separate task/size models support sampling or optional instance-specific adaptation of the added layers.
figure:
  path: paper-assets/polynet/framework.png
  alt: One instance encoder supplies one shared decoder, shown at multiple bit-vector-conditioned evaluations, producing
    diverse routes.
  caption: 'Figure 1: A single shared decoder constructs routes conditioned on different bit vectors; repeated decoder
    boxes represent shared weights.'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=4
publication:
  date: '2025-05-01'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2025/hash/c7b9810b2e27bccdc8d605a3a54c8cd6-Abstract-Conference.html
---
# PolyNet: Learning Diverse Solution Strategies for Neural Combinatorial Optimization

> **TL;DR:** Condition **one shared decoder** on different bit vectors and train only the best rollout for each instance. This encourages complementary construction strategies without prescribing their first actions. Tests cover three routing tasks and flexible flow-shop scheduling, using **separate task/size models** and either sampling or optional efficient active search.

## Motivation

Forcing different first actions can exploit symmetry in simple routing tasks, but may be harmful when the first customer affects time-window feasibility and solution quality. Separate decoder populations also add parameters. PolyNet seeks useful diversity through a shared conditional policy and winner-based training, while allowing the first action to be selected by the policy. It does not promise that every generated solution is better or distinct. [Sections1-3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=1)

## Contributions

- A bit-vector-conditioned residual block within a single routing decoder; the instance is encoded once for multiple strategy evaluations.
- Poppy-style winner-only training with a shared rollout baseline, promoting specialization without a KL-divergence or entropy diversity penalty.
- An optional EAS integration adapting the added conditional layers for a test instance.
- Experiments on TSP, CVRP, CVRPTW and FFSP, with diversity measurements, first-move/layer ablations, warm/cold training and search-budget analyses. [Sections3-4/AppendicesA-F.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=4)

## Methodology

### Conditional construction and training

The routing architecture extends POMO. A bit vector is concatenated to the masked multi-head-attention output, followed by a linear/ReLU/linear residual block that affects the pointer logits. The conditional block uses a256-dimensional hidden representation. Repeated decoder boxes in Figure1 represent **applications of the same weights**, not independent policy heads. The block can learn to ignore the bit input; diversity is encouraged by the objective rather than structurally guaranteed. [Figures1-2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=5)

For each training instance, sample K conditional rollouts and update using only the best one, with the mean rollout reward as baseline. Main routing experiments use **K=128** and do not force different first actions. This differs from updating every sampled strategy or explicitly maximizing pairwise divergence. Best-of-set performance can improve even if some individual samples are worse. [Equation2/Section3.3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=5)

The current TSP release uses **16-bit vectors**, drawing128 vectors per training instance from a65,536-vector pool. Thus its K is a rollout count, not evidence that the release contains exactly128 permanently fixed decoder heads or globally enumerated strategies. The paper's conceptual finite strategy set and Figure1's illustrative four-bit example are distinguished from that public configuration.

### Sampling, adaptation and scope

Unguided inference independently constructs solutions from conditional policies and keeps the best. Main comparisons sample **64N solutions per instance**, including augmentation. Optional EAS runs200 iterations with eight augmentations and N trajectories per augmentation, giving200×8N constructions. EAS adapts copies of the learned PolyNet residual-layer parameters; it does not insert a new architectural block or update the whole encoder. [Section3.5/4.2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=7)

The public EAS code freezes the remaining model, copies the existing conditional weights per augmented instance and combines policy-gradient training with incumbent imitation. Incumbent replay scores a complete prior tour while other rollouts construct new tours. This remains **constructive**: it is parameter adaptation and whole-solution reconstruction, not a proposed neural move operator on an incumbent tour.

The entry remains **specialist**. Routing models are trained separately by task and at100/200 nodes. FFSP uses a different MatNet-based architecture, adding conditional residual blocks to its decoding networks; reuse of the conditional idea is not a shared routing/scheduling checkpoint. [Section4.2/AppendixA.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=15)

## Experiments

### Data, training and budgets

Routing models trained at100 are tested at100/150 nodes; those trained at200 are tested at200/300. Test sets contain10,000 instances at100 and1,000 at each other size. TSP/CVRP follow the cited Kool/Hottung generators. CVRPTW uses clustered positions and variable demands, a centered depot and coordinates in[0,999]². Capacities are50 below200 customers and70 at200 or more. Its return horizon is2,400, maximum window width500 and service duration50; time windows are generated without the reference-route3-opt procedure. [Sections4.1-4.2/AppendixF.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=19)

Main100-node routing training warm-starts from trained POMO:200 epochs for TSP and300 for CVRP/CVRPTW, with **400 million solution rollouts per epoch**. Learning rates are1e-4 for TSP/CVRP and1e-5 for CVRPTW. The200-node model continues from its100-node PolyNet checkpoint for20/40/40 epochs. The baseline POMO pretraining cost is additional. Poppy with eight decoders is retrained under the stated matching setup; the custom CVRPTW POMO base receives50,000 epochs. Runs use a single A100. [Section4.2.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=7)

AppendixC's400-epoch warm/cold runs take **several weeks**. Cold-start TSP catches up by400 epochs, but CVRP and especially lower-learning-rate CVRPTW remain worse. Warm-starting reduces the extra cost; it does not make total training cost vanish.

### Routing results and interpretation

| Test setting | Sampling gap / total test-set time | PolyNet+EAS gap / total test-set time |
| --- | --- | --- |
| TSP100,10,000 instances |.000% /4m |.000% /3h |
| TSP200,1,000 instances |.032% /2m |.001% /2h |
| CVRP100,10,000 instances |.49% /5m |.14% /4h |
| CVRP200,1,000 instances |.88% /3m |.25% /2h |
| CVRPTW100,10,000 instances |2.73% /5m |.96% /5h |
| CVRPTW200,1,000 instances |4.40% /3m |1.72% /3h |

These times are **for the entire indicated test set**, not a single instance. TSP gaps use Concorde optima; CVRP uses HGS and CVRPTW PyVRP0.5.0, with PyVRP stopped after1,000 iterations without improvement. A displayed TSP.000% is rounded aggregate reporting, not proof that every sampled instance is solved exactly. PolyNet improves the displayed POMO/Poppy sampling results, while EAS exchanges substantial extra computation for better quality. Classical reference solvers retain better routing objective values in the displayed comparisons. [Tables1-3.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=8)

Transfer gaps increase: CVRP100→150 has2.34% sampling/.59% EAS, and200→300 has2.94%/.92%; CVRPTW200→300 reaches8.07% sampling/3.00% EAS. These are size-transfer results from a chosen task-specific checkpoint, not unrestricted generalization. Unguided sampling does not always beat slower guided methods in quality: CVRP150 PolyNet2.34% is worse than COMPASS/DPDP1.35% and POMO+EAS.79%, albeit faster. Main prose's broad superiority language is therefore qualified by method and budget.

### FFSP and diversity analyses

FFSP has20/50/100 jobs, three stages and four machines per stage, minimizing makespan. Separate MatNet-based models warm-start from MatNet, use **K=24**, batches256/128/32 and100/100/20 epochs, each with2.4 million rollouts. These settings differ from routing K=128 and400 million rollouts. [AppendixA.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=15)

Unaugmented FFSP makespans are26.7/51.0/91.2 versus MatNet27.1/51.5/91.6. With128 augmentation they are24.9/49.2/89.2 versus25.4/49.6/89.8. Table6 uses the best displayed PolyNet row as its reference because optima are unavailable: its “Gap” values are **absolute makespan differences**, for example46.4−24.9=21.5 for CPLEX60s at20 jobs, not21.5% optimality gaps. The augmented times are4/9/23 minutes in the table's test-set reporting; they are not claimed single-instance latencies.

Across100 sampled routing solutions, average broken-pairs distances are4.621/18.535/19.969 for PolyNet versus2.400/16.785/18.162 for POMO. PolyNet selects only24.5/3.8/7.0 distinct first nodes on average while producing more diverse complete solutions. All128 examined strategies contribute best solutions, but TSP ties mean contribution counts are not mutually exclusive percentages. Individual-sample quality can worsen, as the18 appendix scatter panels explicitly show. [Section4.3/AppendixD.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=9)

At100 nodes, forcing first moves worsens TSP/CVRP/CVRPTW sampling gaps from.000/.49/2.73% to.006/.59/3.00%. A parameter-count-controlled ablation shows benefit from the conditional training beyond merely adding layers. Extended search curves favor larger K, but AppendixE explicitly states that **training and testing were not replicated across multiple seeds**. That experiment has no augmentation/EAS and uses separately trained150-epoch models,200 for CVRP; it is not the main-table protocol. [Tables4-5/AppendicesB/E.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=19)

## Limitations

### Discussed in the Paper

- Attention and autoregressive construction restrict practical scale; the authors focus on fewer than1,000 nodes rather than demonstrating large-scale routing.
- Black-box decisions can be unsuitable in some decision contexts.
- Larger diversity does not ensure that each sample improves, and extended-search evidence has no repeated-seed validation. [Conclusion/AppendicesD-E.](https://proceedings.iclr.cc/paper_files/paper/2025/file/c7b9810b2e27bccdc8d605a3a54c8cd6-Paper-Conference.pdf#page=10)

### Curator Notes

- Separate task/size training, POMO/MatNet warm starts and weeks-long cold/warm analyses limit claims of cheap universal training.
- Match whole-set runtime, sample count, augmentation and adaptation before comparing quality; fast sampling and EAS are different operating points.
- Mean best-of-set gains and broken-pairs diversity do not prove globally optimal search or guaranteed coverage of distinct modes.
- The current validation code counts unique **objective values** as its uniqueness statistic, which can merge distinct equal-cost tours; it is not automatically identical to counting unique solutions.
- The manually inspected public tree contains routing implementations but no FFSP files, so the scheduling implementation is not assumed available there.

## Reproducibility

- **Full reading:** the complete19-page official ICLR2025 PDF, including AppendicesA-F, was freshly read. Original framework/architecture, equations, all six tables, complete training/search/diversity plots and18 per-instance scatter panels were visually inspected.
- **Metadata:** the official proceedings verifies the title, three authors and ICLR2025. First arXiv submission2024-02-21 is retained. The [publisher metadata](https://proceedings.iclr.cc/paper_files/paper/2025/hash/c7b9810b2e27bccdc8d605a3a54c8cd6-Abstract-Conference.html) explicitly records `citation_publication_date` as **2025-05-01**, independently of any paper-specific acceptance date. The generic conference notification day remains excluded from acceptance metadata. Affiliations are corrected from TU Dortmund to Bielefeld/Boston, and CVRPTW/FFSP plus the Scheduling family are added.
- **Scientific supplements:** the actual publisher page links the combined19-page paper and BibTeX, with no separate scientific supplement. Its included AppendicesA-F were all read. The OpenReview API returns403, so inaccessible attachments are not claimed inspected. The complete123-entry official GitHub tree has no PDF/ZIP/TeX scientific supplement and no FFSP implementation; the complete formal PDF has no explicit missing-science pointer.
- **Code:** [ahottung/PolyNet](https://github.com/ahottung/PolyNet), built on POMO, lists Python≥3.9/PyTorch2.0.0/tqdm. README, conditional decoder, winner-only loss/vector sampling, EAS adaptation and routing train/evaluation configurations were inspected. Current TSP100 settings confirm a six-layer128-dimensional encoder/eight heads,16-bit conditioning,128 training rollouts,200 epochs×400 million rollouts,64N sampling and200×8N EAS. The EAS release also includes incumbent imitation and per-instance parameter copies, as described above. No full multi-week training or benchmark rerun was performed.
- **Figure:** original complete Figure1/page4, with the shared-weight meaning of repeated decoder evaluations made explicit in the caption.
