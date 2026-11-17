---
id: diffuco
short_title: DiffUCO
title: A Diffusion Model Framework for Unsupervised Neural Combinatorial Optimization
authors:
- Sebastian Sanokowski
- Sepp Hochreiter
- Sebastian Lehner
year: 2024
date: '2024-07-08'
publication:
  date: '2024-07-08'
  source_url: https://proceedings.mlr.press/v235/sanokowski24a.html
venue: ICML
paper_url: https://proceedings.mlr.press/v235/sanokowski24a.html
institutions:
- Johannes Kepler University Linz
- ELLIS Unit Linz
- NXAI
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Graph Optimization
problems:
- Maximum Independent Set
- Maximum Clique
- Minimum Dominating Set
- Maximum Cut
- Minimum Vertex Cover
summary: A joint reverse-KL upper bound trains task-specific discrete diffusion models without solution labels, combining exact conditional expectations with REINFORCE; repeated test-time diffusion and tokenized conditional-expectation decoding trade compute for quality.
code_url: https://github.com/ml-jku/DIffUCO
figure:
  path: paper-assets/diffuco/framework.png
  alt: DiffUCO forward noise process and learned reverse diffusion process on an independent-set instance, showing changing assignments and constraint violations.
  caption: 'Figure 1: forward and reverse discrete diffusion for solution generation.'
  source_url: https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=2
---
# A Diffusion Model Framework for Unsupervised Neural Combinatorial Optimization

> **TL;DR:** Train a discrete diffusion solver **without solution labels** by minimizing a tractable joint reverse-KL upper bound. Each denoising step is conditionally mean-field, while the latent multi-step process represents dependencies in the final solution. More inference steps and tokenized conditional-expectation decoding improve quality at additional compute cost. “Data-free” refers to the absence of target solution samples; training still uses graph instances and known objectives.

## Motivation

Mean-field output distributions are easy to evaluate but express limited dependencies. Autoregressive models are more expressive but require a variable ordering and many sequential decisions. Latent models such as diffusion samplers offer another route, yet their exact marginal sample probabilities are generally intractable. DiffUCO optimizes a **joint path distribution** to avoid requiring those marginal likelihoods. [Sections1-3.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=3)

## Contributions

- Derive the **Joint Variational Upper Bound** on reverse KL and instantiate it for discrete diffusion paths.
- Combine differentiable exact conditional expectations with REINFORCE gradients through discrete sampled trajectories.
- Study categorical flip noise and an energy-dependent annealed noise distribution.
- Accelerate conditional-expectation decoding through joint configuration tokens, and increase test-time diffusion steps without retraining.
- Evaluate five graph CO tasks: MIS, maximum clique, minimum dominating set, maximum cut and MVC. [Sections3-6.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=7)

## Methodology

### Joint objective and diffusion

For a target Boltzmann distribution pB and latent variables Z, the KL chain rule yields **KL(q(X)||pB(X)) <= KL(q(X,Z)||p(X,Z))**. The difference is an expected conditional KL, hence nonnegative. The right side is tractable up to parameter-independent normalization constants. If it reaches zero, the marginal matches the target; in practice, minimizing this bound neither certifies zero bias nor guarantees that the marginal KL decreases monotonically at every optimization step. [Equation5/AppendixA.1.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=15)

DiffUCO substitutes the intermediate diffusion states for Z. Its reverse chain starts from a uniform prior and iteratively samples time-conditioned binary assignments. A GNN receives the current assignment, graph and discrete time embedding. Each reverse transition is a product of Bernoulli distributions; integrating over sampled latent states makes the final marginal more expressive than a single independent output. The network parameters remain fixed during evaluation. [Section3.1/AppendixC.4.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=4)

The path loss combines conditional entropy, forward/reverse path compatibility and final energy. The categorical forward process flips bits with a scheduled probability. The alternative annealed distribution uses the graph energy at intermediate temperatures and retains an energy-dependent term when the outer training temperature reaches zero. Its unnormalized log density is sufficient for optimization; training does not require samples from the intractable target distribution.

The loss uses exact expectations where conditional independence permits them, including the distinction between off-diagonal products and diagonal binary terms. REINFORCE with variance-reduction baselines handles expectations over discrete paths, alongside ordinary backpropagation through exact terms. The original ICML method uses **RAdam and REINFORCE**, not the later PPO training added to the shared repository. The paper also interprets EGN/EGN-Anneal as a one-step special case with random features and parameter-independent constants. [Section4/AppendixA.3-A.5.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=17)

### Architecture and inference budgets

The GNN uses64-unit embeddings, neighborhood sum aggregation, skip connections, node MLPs and a final three-layer probability head. Task settings use4-8 message-passing layers. Five random node features are added for the RB experiments except clique. Models and hyperparameters are trained separately by task/dataset; a common energy interface does not establish a jointly trained generalist checkpoint.

The principal training settings use **3-6 diffusion steps**. Benchmark evaluation repeats each time-conditioned step **three times**, giving9-18 steps, rather than introducing new trained time embeddings. The ablation increases evaluation steps further and reports improving quality with approximately linearly increasing evaluation cost. This is repeated generation from a noise prior, not neural editing of an independently supplied incumbent; classification is **specialist / constructive**. [AppendixC.2/Table7.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=21)

### Conditional-expectation decoding

CE rounds the final conditional probability vector by assigning variables to reduce expected energy. **CE-STk** groups k variables and evaluates their2^k binary configurations in parallel, reducing sequential rounds by about k while increasing configuration work. The tested implementation is fastest around **k8**; larger k eventually costs more. This classical decoding stage can materially change solution quality, especially for clique and MIS, and should not be omitted when reporting the solver budget. It is not itself a learned incumbent-improvement module. [Section4.1/AppendixB.3.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=19)

## Experiments

### Data, training and timing

RB graphs support MIS/clique and BA graphs support MDS/MaxCut. The small and large datasets contain **200-300 and800-1,200 nodes**, with4,000/500/500 training/validation/test graphs. MVC uses the harder RB-200 setting,2,000 training and500 validation graphs, with100 test graphs at each hardness value. Tables1/3 report **mean solution sizes over eight trajectories**, then aggregate over three training seeds; MVC AR* instead selects the best of eight. These are different metrics.

The tabled learning rates range1e-3 to3e-3, with1,000-4,500 annealing epochs, graph batches18-30 and5-10 sampled training paths per graph. RB-large MIS requires an **A10080GB** GPU. MVC training takes **2days2hours**, versus the authors' reported VAG-CO3days7hours. Complementary dense graphs make clique particularly expensive. The authors cannot make a matched training-resource comparison with every borrowed baseline. [AppendixC.5-C.6.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=22)

**Timing is qualified:** the reported DiffUCO measurements include only **JIT-compiled forward passes plus CE**, exclude dataloader time, and measure sample states sequentially before **averaging their times under an assumed parallel-sampling interpretation**. They are not measured end-to-end wall time for eight sequential trajectories. Self-run Gurobi uses a24-core Xeon Platinum8168 CPU; other baseline timings are borrowed from another paper. Tables below preserve the displayed time conventions. [AppendixC.7.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=22)

### Main quality comparisons

| Task/setting | DiffUCO | DiffUCO CE-ST8 | Selected reference |
| --- | --- | --- | --- |
| MIS RB-small |18.88,7s |19.24,13s | LTFT19.18,32s; KaMIS20.10,1h24m12s |
| MIS RB-large |38.10,10s |38.87,1m5s | LTFT37.48,4m22s; KaMIS43.15,2h3m36s |
| MDS BA-large |107.01,5s |106.61,40s | LTFT110.28,32m12s; Gurobi103.80,13m48s |
| Clique RB-small |14.51,4s |16.30,13s | LTFT16.24,42s; Gurobi19.05,1m55s |
| MaxCut BA-large |2,947.27,4s |2,947.53,53s | Gurobi300s/graph2,944.38,1day17h35m |

Larger is better for MIS/clique/cut, smaller for MDS; displayed times are for the500-instance test sets under the caveats above. Raw DiffUCO is worse than LTFT on small MIS and clique; CE changes that conclusion, and its clique margin over LTFT is small relative to the reported uncertainty. Integer/heuristic solvers often retain higher quality. A cut exceeding a **time-limited** Gurobi incumbent is not a cut exceeding the true optimum. Table1's EGN-Anneal small-MDS size cell contains the time-like value **1:01**; it is not copied as a meaningful set size. [Tables1/3.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=9)

MVC results favor DiffUCO over the plotted unsupervised comparators across hardness values, particularly on low-p hard graphs, while Gurobi remains strong on easy instances. Noise/temperature ablations show better results with annealing and more training diffusion steps. Categorical and annealed noise are similar with annealing; without it, categorical noise shows larger variability. These observations do not prove one noise family universally superior.

### OOD, search and amortization limits

On Gset MaxCut, the protocol allows20 parallel processes and180 seconds per graph. DiffUCO CE-ST8 ranks second among the listed methods: **ANYCSP wins all four graph-size groups**, with deviations from best-known cut1.22/2.44/13.11/51.63 versus DiffUCO4.11/6.33/31.67/116.75. The authors explicitly distinguish direct solution generation from iterative search and acknowledge differing training distributions. [AppendixB.1/Table5.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=19)

BA-small-trained models transfer to larger graphs. In the OOD table, DiffUCO beats300-second Gurobi cut incumbents on the larger three MaxCut sets, but **Gurobi has better MDS quality at all four sizes**: on BA-giant,253.53 versus259.02. The size description itself is inconsistent: AppendixB.2 gives BA-huge1,200-1,800 nodes, while Table6's caption says an average2,000. Those statements are retained as a source discrepancy rather than silently reconciled. The authors did not design the method as a robust OOD solver and note architecture/degree-distribution effects. [AppendixB.2/Table6.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=20)

The training-amortization table assumes matched solution quality and estimates query counts from **197 to1,752,059**, with clique the most costly case. Its printed inequality omits the query multiplier on repeated Gurobi cost; under the caption's per-query definitions the consistent comparison is **training+n times neural evaluation versus n times classical evaluation**. The table is therefore reported as the authors' illustrative estimate, not an independently certified break-even analysis. [AppendixB.5/Table4.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=19)

## Limitations

### Discussed in the Paper

- Learned samples remain biased relative to the exact target distribution.
- Large/dense graph training can require substantial memory and time, particularly clique on complement graphs.
- Efficient latent/backpropagation architectures and unbiased sampling are future research directions for this paper. [Section7.](https://raw.githubusercontent.com/mlresearch/v235/main/assets/sanokowski24a/sanokowski24a.pdf#page=9)

### Curator Notes

- Absence of target labels does not mean absence of training graphs, objective computation or reference-solver evaluation.
- The joint KL is a valid upper bound, not a solver optimality or unbiased-sampling certificate.
- CE and repeated diffusion are material parts of the method; average-over-eight and best-of-eight results should not be conflated.
- Borrowed baseline runs, parallel timing assumptions, excluded input loading and large training costs qualify headline speedups.
- Several printed expressions/cells are inconsistent: the entropy signs on pages5/18, the small-MDS table entry, the BA-huge caption and the amortization inequality. The note uses the stated Shannon-entropy definition rather than copying erroneous signs. The current REINFORCE code correctly computes **-p logp -(1-p)log(1-p)**; this observation does not independently reproduce published results.

## Reproducibility

- **Full reading:** all **22 publisher pages**, including complete AppendicesA-C, KL/gradient derivations, additional Gset/OOD/compute experiments and every hyperparameter row, were freshly read. The framework, all plots/tables, key equations and appendix derivations were visually inspected.
- **Metadata:** official PMLR235:43346-43367 confirms the three authors and formal ICML2024 venue. Publisher HTML explicitly records **8July2024**; the precise date is supported rather than inferred from conference days. JKU, ELLIS Unit Linz and NXAI affiliations match page1.
- **Scientific supplements:** manual publisher-page inspection lists the combined PDF and OpenReview. This22-page PDF includes the complete scientific appendices; the OpenReview link currently presents browser verification. No explicit missing-science pointer occurs in the read text. The1,165-entry official repository tree is complete and contains no extra PDF/ZIP/TeX scientific attachment.
- **Code:** [ml-jku/DIffUCO](https://github.com/ml-jku/DIffUCO). The full current README and relevant REINFORCE/CE source paths were inspected. This repository now also hosts **ICLR2025 SDDS**, PPO/forward-KL modes, unbiased-sampling tools and newer benchmark weights. Those later features and TSP experiments, which the README says did not enter the paper, are not attributed to the ICML study. The original branch is identified by REINFORCE; no new training/solver experiment was run.
- **Figure:** complete original Figure1 on publisher page2, directly cropped with both process directions, graph states and caption.
