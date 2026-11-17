---
id: compass
short_title: COMPASS
title: Combinatorial Optimization with Policy Adaptation using Latent Space Search
authors:
- Felix Chalumeau
- Shikha Surana
- Clément Bonnet
- Nathan Grinsztajn
- Arnu Pretorius
- Alexandre Laterre
- Thomas D. Barrett
year: 2023
date: '2023-11-13'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/18d3a2f3068d6c669dcae19ceca1bc24-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2311.13569
code_url: https://github.com/instadeepai/compass
institutions:
- InstaDeep
scope: specialist
paradigm: constructive
problem_families:
- Routing
- Scheduling
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
- Job Shop Scheduling Problem
summary: Separately trained task policies condition construction on continuous latent codes; CMA-ES adapts those
  codes per instance while neural weights stay fixed.
figure:
  path: paper-assets/compass/framework.png
  alt: COMPASS training and inference pipelines for latent-conditioned routing policies.
  caption: 'Figure 1: COMPASS training and per-instance latent-search workflow.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=4
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/18d3a2f3068d6c669dcae19ceca1bc24-Abstract-Conference.html
---

# Combinatorial Optimization with Policy Adaptation using Latent Space Search

> **TL;DR:** COMPASS trains a continuous family of constructive policies within a task, then searches a 16-dimensional conditioning space with CMA-ES. Each candidate code generates a fresh solution. Test-time search changes the latent code, not network weights or incumbent-tour segments; separate models cover TSP, CVRP and job-shop scheduling.

## Motivation

Repeated samples from a fixed policy can have limited behavioral diversity, while fine-tuning network parameters per instance is expensive. COMPASS trains with inference-time search in mind: different latent conditions specialize to different subsets of a task distribution. Search can then focus on promising conditions for a new instance rather than only resampling one unchanged policy. [Sections 1-2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=2)

## Contributions

- Learns task-specific conditional policy families using a best-of-sampled-conditions training objective inherited from population-based specialization.
- Uses multiple independently initialized CMA-ES components to search the conditioning space without test-time network backpropagation.
- Tests three optimization problems, including a distinct JSSP architecture, on size transfer and procedurally mutated routing distributions.
- Releases JAX implementations, checkpoints and datasets, while documenting a material EAS-baseline implementation difference in the formal supplement. [Sections 3-4 and supplement N.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=4)

## Methodology

### Conditioning and specialization

A latent vector is sampled uniformly from a 16-dimensional box; the implementation scales the nominal `[-1,1]` values by 100. It is fixed throughout one trajectory. This defines a continuously parameterized policy family, rather than proving that every vector yields a distinct policy or that every optimization problem shares one checkpoint.

For routing, POMO supplies the backbone and initial checkpoint. The vector is concatenated to the decoder's query/key/value inputs; the routing encoder is reused during a search budget. New conditioning weights start at zero, preserving the pretrained behavior initially. JSSP instead uses the Jumanji attention actor-critic: machine status, durations and job/machine interactions are encoded at each step, and the condition enters the decoder MLP. Actor and critic weights are separate. The JSSP and routing models are architecturally distinct and trained separately. [Section 3.2 and supplement D-E.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=4)

For each training instance, sample multiple latent conditions, construct trajectories and backpropagate only through the highest-return condition's trajectory. The shared network is updated; a latent code is not itself trained as a permanent parameter. The supplement excludes instances with a tie for the top return from this update. No explicit diversity regularizer or learned latent prior is used. Table 5 specifies 128 conditions and an eight-instance batch; the published code archive's JSSP training config instead defaults to 16 conditions, so the paper hyperparameters and a default code configuration should not be assumed identical. [Supplement F-G and archived configuration.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Supplemental-Conference.zip)

The reported conditioning-training costs on TPU v3-8 are 4.5 days/110 million environment steps for TSP, 5.5 days/76.5 million for CVRP and 4.5 days/4.2 million for JSSP, following backbone pretraining. TSP/CVRP train on uniform size-100 instances; JSSP trains on 10 jobs and 10 machines with maximum operation duration 98. These offline costs are additional to the inference tables. [Main Section 4 and supplement F.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=6)

### Per-instance latent search

CMA-ES adapts a distribution's mean and covariance based on the rewards of constructed solutions. Multiple components begin at Voronoi-cell centroids to explore different regions. Table 5 uses three components for TSP100/125/150 and JSSP, two for TSP200 and CVRP, initial sigma 100 and sampling batch 16. Inference policy noise is one for TSP100 and 0.1 for the other settings. Network weights stay fixed while latent candidates change. This is policy-space adaptation followed by fresh **constructive** rollouts, not learned local modification of an incumbent solution. [Section 3.2 and supplement E/G.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=5)

The main text describes 1,600 attempts, each evaluating starting positions; supplement B describes 160,000 routing and 8,000 JSSP rollouts. Accordingly 1,600 is not a single-trajectory budget. These reported budget descriptions and released configuration settings should be retained when reproducing a task, rather than silently multiplying them into a universal count. Main routing results omit eightfold coordinate augmentation; a separate table evaluates it. [Section 4 and supplement B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=6)

## Experiments

### Formal main benchmark

Table 1 uses 10,000 routing instances at size 100 and 1,000 at each of 125/150/200. JSSP tests 10x10, 15x15 and 20x15 tasks; the published JSSP config identifies a 100-instance dataset. JAX neural comparisons run on TPU v3-8, and the table's times are dataset totals. TSP gaps use Concorde optima; CVRP uses LKH and JSSP uses OR-Tools reference solutions, so the latter gaps are not all certified optimality gaps. [Section 4.1 and Table 1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=7)

| Formal setting | COMPASS gap / dataset time | Relevant comparison |
| --- | --- | --- |
| TSP100 | 0.002% / 2 h | Poppy 0.013%; EAS 0.176% / 7 h |
| TSP200 | 0.348% / 70 min | Poppy 1.007%; EAS 0.660% / 210 min |
| CVRP100 | -0.361% / 4 h | Improvement over LKH reference; EAS 0.068% |
| CVRP150 | 0.485% / 1 h | EAS is better at 0.341% / 4 h |
| CVRP200 | 2.098% / 100 min | EAS is better at 1.120% / 7 h |
| JSSP10x10 | 4.7% / 3 h | Poppy 5.2%; OR-Tools reference is stronger |
| JSSP20x15 | 10.4% / 8 h | Poppy 11.2%; OR-Tools reference is stronger |

The formal paper's **9/11** claim concerns its selected main RL baselines: four TSP, two of four CVRP and three JSSP settings. It does not mean dominance over classical solvers or every architectural baseline. In particular, supplement Table 3 additionally reports EAS with L2D at **3.7%** on JSSP10x10, better than COMPASS's 4.7%, despite weaker transfer at the larger JSSP sizes. [Supplement A, Table 3.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Supplemental-Conference.zip)

Coordinate augmentation is not uniformly beneficial for COMPASS: it slightly improves TSP200 to 0.337%, but CVRP200 worsens from 2.10% to 2.49%. The comparison with SGBS/EAS-Lay and CVAE-Opt uses their own reported configurations and costs. Equal trajectory budgets also do not imply equal memory or arithmetic work when EAS performs backpropagation. [Main Table 2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=10)

### Mutated distributions and smaller budgets

Nine geometric mutation operators (explosion, implosion, clustering, rotation, two projections, expansion, compression and grid) create 18 task/operator combinations across TSP and CVRP. Ten mutation powers from zero through 0.9 vary the chance of changing each node; supplement A reports 1,800 transformed instances. COMPASS has the best reported neural aggregate across these conditions, while LKH remains a stronger reference on the nontrivial mutated sets. At maximum mutation power, its reported TSP/CVRP gaps are 0.091%/0.196%, versus EAS 0.277%/0.298%. These are controlled synthetic transformations rather than evidence from operational routing deployments. [Section 4.2 and supplement A/C, Table 4.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=8)

At 10% of the standard budget, COMPASS wins 3/4 TSP, 2/4 CVRP and 3/3 JSSP comparisons among the listed neural methods. For example, TSP125 favors Poppy (0.115% versus 0.138%), and CVRP150 favors EAS (1.593% versus 1.626%). This qualifies claims of superiority at every search budget. [Supplement I, Table 6.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Supplemental-Conference.zip)

### Search and model ablations

Uniform latent sampling beats repeated sampling from a fixed set of conditions; CMA-ES improves use of the budget, and multiple components improve eventual quality over one component in the TSP150 study. A fully trained model with uniform search can beat an undertrained model using CMA-ES, demonstrating that the optimizer alone does not explain the result. Latent-space contour plots use a separately trained **two-dimensional** model and are illustrative; they do not visualize the entire standard 16-dimensional search space. [Section 4.3 and supplement E/M.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=9)

The TSP100 timing study averages 500 evaluations on TPU v3-8. It reports 297.99 ms for 99 decoding steps, 68.31 ms for environment steps and 0.28 ms for one CMA-ES sampling/update event. This supports small adaptation overhead in that implementation, rather than negligible cost for the complete multi-rollout search. [Supplement L, Table 7.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Supplemental-Conference.zip)

## Limitations

### Reported by the Authors

- Specialization is bounded by training-distribution diversity, with no explicit diversity objective.
- Many conditions are evaluated but only one trajectory is trained, which can be data-inefficient and may miss the best latent condition.
- Latent performance is noisy and discontinuous; Bayesian search performed poorly in the tested setup, and smoother representations or informed priors are future directions. [Section 5 and supplement J.](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf#page=10)

### Curator Notes

- Three problem types use separate checkpoints and task-specific networks, supporting **specialist / constructive** classification. The word adaptation refers to latent conditioning, not test-time neural-weight updates or incumbent moves.
- The main and supplementary EAS timings differ, and the official repository documents a subsequent EAS implementation correction. Speed claims depend materially on which version is compared.
- The full search budget can take hours even though a single CMA-ES update is cheap. Classical references, imported baselines, extra augmentation and different rollout budgets should remain explicit.

## Reproducibility

- **Reading sources:** the complete [13-page formal NeurIPS PDF](https://proceedings.neurips.cc/paper_files/paper/2023/file/18d3a2f3068d6c669dcae19ceca1bc24-Paper-Conference.pdf) and **all 14 pages of `supplementary/appendix.pdf` inside the publisher ZIP** were reread, including Appendices A-N. The outer archive also contains a nested code ZIP; its 199-file inventory and README were inspected, with no additional scientific PDF or document attachment found.
- **Important baseline-version distinction:** formal supplement N explicitly states its EAS-Emb reimplementation backpropagates through the whole decoder. The current [official README](https://github.com/instadeepai/compass) states that later code/arXiv reporting corrected this to match EAS's last-attention-layer update. Results above follow the formal publisher tables; later EAS numbers and runtimes are not mixed into those comparisons.
- **Metadata and historical citation:** the title page confirms seven authors, all at InstaDeep, including Clément Bonnet and Thomas D. Barrett. Formal publication is NeurIPS 2023; [arXiv history](https://arxiv.org/abs/2311.13569) gives first submission 13 November 2023. Generic notification-day acceptance metadata was removed. The cited 2022 Poppy preprint had a different title and three authors; its [arXiv version history](https://arxiv.org/abs/2210.03475v1) confirms the same work later titled *Winner Takes It All*, so the relation preserves that actual older citation.
- **Implementation:** [instadeepai/compass](https://github.com/instadeepai/compass). Both the published code README and current repository instructions were read. They identify training, small-budget validation and full-budget scripts, task configs, checkpoints and datasets. Default archived configs differ in places from reported Table 5 (notably JSSP condition count and some search settings); task/table-specific settings are needed to reproduce the reported run. Experiments were not rerun in this audit.
- **Image provenance:** displayed Figure 1 is an original publisher-PDF p. 4 crop; its complete training/inference panels and key result/search/latent plots were visually checked.
