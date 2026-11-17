---
id: fast-t2t
short_title: Fast T2T
title: 'Fast T2T: Optimization Consistency Speeds Up Diffusion-Based Training-to-Testing Solving for Combinatorial
  Optimization'
authors:
- Yang Li
- Jinpei Guo
- Runzhong Wang
- Hongyuan Zha
- Junchi Yan
year: 2024
date: '2025-02-05'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/352b13f01566ae34affacc60e98c16af-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2502.02941
code_url: https://github.com/Thinklab-SJTU/Fast-T2T
institutions:
- Shanghai Jiao Tong University
- Massachusetts Institute of Technology
- The Chinese University of Hong Kong, Shenzhen
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
- Graph Optimization
problems:
- Traveling Salesman Problem
- Maximum Independent Set
summary: Fast T2T trains optimization-consistency models for short-step TSP/MIS construction and refines complete
  solutions by objective-guided latent-probability updates, with fixed neural weights at test time.
figure:
  path: paper-assets/fast-t2t/framework.png
  alt: Vanilla consistency maps a trajectory to its origin; optimization consistency targets one reference solution
    for each graph across trajectories.
  caption: 'Figure 2: Optimization-consistency training target; the illustration is not an optimality guarantee
    for unseen instances.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=5
publication:
  date: '2024-12-16'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2024/hash/352b13f01566ae34affacc60e98c16af-Abstract-Conference.html
---
# Fast T2T: Optimization Consistency Speeds Up Diffusion-Based Training-to-Testing Solving for Combinatorial Optimization

> **TL;DR:** Fast T2T learns direct mappings from different noise levels to good solutions, then optionally improves complete solutions with gradients on latent probabilities. It reduces neural sampling steps, while feasibility decoding, backpropagation and optional 2-opt still contribute to runtime. TSP and maximum independent set use separate models.

## Motivation

T2T's solution rewriting still relies on multiple diffusion denoising steps. Fast T2T changes both the **trained generative backbone** and the **test-time search** so a short construction schedule can be followed by short guided refinement. One neural generation step is not equivalent to one operation for the complete solving pipeline. [Sections 1-2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=1)

## Contributions

- Defines instance-conditioned **optimization consistency**: points across different noise trajectories and timesteps should map toward the same reference solution for a graph.
- Trains that mapping directly to allow one-step or short-step initial generation.
- Introduces a consistency/free-energy-inspired objective-gradient search that updates latent solution probabilities rather than network weights.
- Studies TSP and maximum independent set (MIS), including runtime-quality tradeoffs, TSPLIB, SATLIB and shifted graph distributions. [Sections 4-6 and Appendices A-E.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=4)

## Methodology

### Supervised optimization-consistency construction

Solutions are binary edge selections for TSP and node selections for MIS, each encoded as two-category one-hot variables. Categorical transitions add noise. Instead of only learning a reverse transition from t to t-1, the network predicts clean-variable probabilities directly from a noisy state, timestep and graph. Training samples two noisy states from different trajectories associated with the same labelled reference solution and applies binary cross entropy to the reference at both. The training target is described as optimal in the definition; actual large-TSP/MIS labels come from heuristics and need not be proven optima. [Section 4 and Algorithm 2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=5)

The implementation uses an edge-gated anisotropic **12-layer GCN**, dimensions 256 for TSP and 128 for MIS. TSP500 uses k=50 nearest-neighbor sparsification, TSP1000 k=100. Training uses learning rate .0002, cosine decay, weighting lambda=1 and a .5 timestep scaling in Algorithm 2. The main loss discussion motivates an upper bound using a distance metric; this should not be interpreted as an exact-optimality proof for the implemented binary-cross-entropy model. [Appendices A/C/D.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=14)

One-step generation samples uniform noise and applies the consistency model once. Multistep generation alternates fresh noise injection and direct reconstruction; this is **Ts**, the initial sampling budget. Task-specific greedy decoding turns the predicted heatmap into a feasible tour or independent set; classical 2-opt can additionally refine TSP. [Section 5.1/Algorithm 1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=6)

### Consistency-based improvement

Starting from a solution eta, form Bernoulli probabilities `p_x=eta*Q_(alpha*T)`. Differentiate through the fixed consistency network and apply a multiplicative exponential-gradient update to these probabilities. The loss combines reconstruction consistency with eta and the relaxed problem objective. TSP uses distance-weighted edges; MIS uses negative cardinality plus penalties on adjacent selected nodes. Decode the heatmaps before/after the update and choose the lower-cost feasible result. The probabilistic/free-energy derivation is approximate, not a guarantee that every proposed sample is feasible or optimal. [Section 5.2, Equations 5-8.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=7)

**Tg** counts guided search steps and therefore includes gradient computation and further reconstruction, beyond ordinary forward-only sampling. Main settings use noise .2 on TSP/ER and .3 on RB, with consistency/objective weights both 50 for TSP and both 2 for MIS. Neural weights stay fixed during solving; the solution probabilities change. [Appendices A.2/C.5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=14)

Under this repository's definitions Fast T2T is **specialist, constructive-improvement**: its own newly trained consistency constructor and its own guided incumbent refinement are both core contributions. Rows listing only Ts and no Tg are pure-construction ablations. This differs from T2T's borrowed DIFUSCO initial point. Separate task/checkpoint training prevents a claim that one network solves both problem types. The maximum-cardinality MIS definition is used here despite “Maximal” in the abstract. [Sections 3-5.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=4)

## Experiments

### Data and compute

TSP tests contain **1280 instances at 50/100 nodes and 128 at 500/1000**. References use Concorde for small sizes and LKH-3 for large sizes. Table 11 lists dataset sizes 1.502M/1.502M/128K/64K, with four-A100 training times **41 h 16 min / 139 h 26 min / 45 h 2 min / 101 h 3 min**. The authors report approximately double DIFUSCO's offline training cost because two noisy predictions are evaluated per example. [Appendix C.3-C.4.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=18)

Tests use **RTX 4090 for TSP50/100 and MIS, A100 for TSP500/1000**. RB MIS uses 90K training and 500 test graphs of 200-300 nodes; ER uses 163840 training graphs of 700-800 nodes with edge probability .15, and the released DIMES test set. Labels come from KaMIS. These are separately learned datasets/models, not a shared multitask checkpoint. [Appendix C.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=17)

The main tables identify DIFUSCO Ts=100 and T2T Ts=50,Tg=30; the opening experiments paragraph instead describes 50 and 15. Comparisons below follow the **explicit table rows**, with sampling x4 and 2-opt distinguished. Times are reported test-run times; imported baseline times are not all matched hardware measurements. [Tables 1-4 and Appendix C.6.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=8)

### TSP budgets and quality

On TSP50/100 greedy decoding **without 2-opt**, Ts=1,Tg=1 gives .03/.10% gaps in 54 seconds/1 minute; Ts=3,Tg=3 gives .01/.03% in 3 minutes each. Pure one-step construction gives .31/1.31%, compared with DIFUSCO Ts=100 at .41/1.16%; the one-step model is not better on every size. Reported 82.8-fold and 35.4-fold speedups average particular small-size settings, not universal pipeline speedups. [Table 1.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=8)

| Sampling x4 + 2-opt | TSP500 gap / time | TSP1000 gap / time |
| --- | --- | --- |
| DIFUSCO Ts=100 | .87% / 19 min 8 s | 1.31% / 51 min 56 s |
| T2T Ts=50,Tg=30 | .48% / 19 min 42 s | 1.07% / 51 min 3 s |
| Fast T2T Ts=1,Tg=1 | .54% / 2 min 33 s | .83% / 6 min 14 s |
| Fast T2T Ts=5,Tg=5 | .21% / 6 min 51 s | .42% / 18 min 17 s |

Fast T2T's 1+1 variant is worse than T2T at TSP500 in this setting, despite being faster. Pure one-step sampling is also worse than DIFUSCO at TSP500 (1.02% versus .87% after 2-opt). Longer Fast T2T schedules improve quality at additional cost. Runtime curves show an advantage over LKH **early in selected time-limited runs**; they do not establish superiority over unrestricted LKH or optimality. [Table 2 and Figures 3-6.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=9)

For TSPLIB, greedy decoding plus 2-opt and Ts=10,Tg=10 gives **.28% average over 29 small cases**, versus T2T .35%; the larger 20-case table gives **.93% versus 1.59%**. The construction-only counterpart is .41/2.20%, showing the role of search. Fast T2T still loses on individual cases: bier127 is 1.50% versus T2T .54%, kroB200 is 2.50% versus .92%, and p654 is 1.67% versus 1.19%. These settings differ from the earlier T2T paper's four-sample TSPLIB experiment. [Appendix B.1, Tables 5-6.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=15)

### MIS, transfer and source inconsistencies

With four-sample decoding, Fast T2T 5+5 gives mean RB/ER independent-set sizes **19.70/41.73**, reported gaps **1.90/6.99%**, in 6 min 59 s/5 min 51 s. KaMIS gives larger sets, 20.10/44.87. The faster 1+1 ER result is 40.98 (8.66%), worse than T2T's 41.41 (7.72%). On supplementary SATLIB, Fast T2T 5+5 gives 425.23 (.17%) in 25 min 35 s, still below KaMIS/Gurobi. The authors identify limited SATLIB training data as a difficulty for the more demanding consistency mapping. [Tables 4/7 and Appendix B.2.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=10)

MIS transfers to other edge probabilities, graph sizes and graph families generally improve over the listed diffusion baselines, but large reference gaps remain: ER1400-1600 four-sample 1+1 gives **24.25%**. Cross-task transfer is not evaluated. [Tables 8-10.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=17)

Several source inconsistencies are preserved rather than resolved by assumption. **Table 3 and Figure 7 assign opposite training/testing axes** to the same displayed matrix; the broad “below .6% on all other scales” claim is therefore not used here. Table 10 repeats “Train:ER; Test:RB” on both graph-family blocks, making one direction ambiguous. Some Table 4 gap cells do not match the rounded displayed mean/reference scores, such as RB Gurobi 19.98 versus KaMIS 20.10 with a listed .01% drop. This note does not silently recompute or certify those cells. [Tables 3/4/10 and Figure 7.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=16)

## Limitations

### Reported by the Authors

- As graphs grow, serial feasibility/postprocessing occupies more runtime, reducing the speedup gained by faster neural inference.
- Consistency training costs about twice as much as the original diffusion training; the benefit is principally at inference.
- SATLIB provides insufficient training diversity for learning the harder consistency mapping. The checklist explicitly reports **no statistical-significance/error-bar analysis**. [Appendices B.2/E and checklist.](https://proceedings.neurips.cc/paper_files/paper/2024/file/352b13f01566ae34affacc60e98c16af-Paper-Conference.pdf#page=20)

### Curator Notes

- “One step” counts a model sampling/search unit, not all forward/backward calls, decoding, sampling candidates or 2-opt work.
- Supervised reference targets and optimization-consistency definitions do not certify globally optimal solutions for unseen instances.
- Quality and speed depend on Ts, Tg, graph sparsity, sampling width, local search and hardware. Single-step results lose to longer-budget baselines on some cases.
- Axis, baseline-step and gap-cell inconsistencies limit exact cross-scale or percentage claims; the concrete unambiguous rows above remain attributable to the paper.

## Reproducibility

- **Formal publication/full text:** [NeurIPS 2024](https://proceedings.neurips.cc/paper_files/paper/2024/hash/352b13f01566ae34affacc60e98c16af-Abstract-Conference.html); all **28 publisher-PDF pages**, including Appendices A-E and the full checklist, were reread. The publisher exposes the integrated PDF and no separate scientific attachment. OpenReview API returned challenge403; unavailable attachment bytes are not claimed as checked.
- **Date/version:** [arXiv:2502.02941](https://arxiv.org/abs/2502.02941) was first posted **5 February 2025**, after the formal 2024 conference. The actual read source is the publisher PDF. The [publisher metadata](https://proceedings.neurips.cc/paper_files/paper/2024/hash/352b13f01566ae34affacc60e98c16af-Abstract-Conference.html) explicitly records `citation_publication_date` as **2024-12-16**, independently of any paper-specific acceptance date. A generic conference notification date remains excluded from acceptance metadata.
- **Official code:** [Thinklab-SJTU/Fast-T2T](https://github.com/Thinklab-SJTU/Fast-T2T); main/data READMEs and recursive file inventory checked. The README notes DIFUSCO parameter initialization for TSP50/100; the codebase also includes earlier T2T examples, which require distinguishing from Fast T2T commands.
- **Figure:** original Figure 2, PDF page 5, illustrates the conditional training target rather than a guarantee on generated solutions.
