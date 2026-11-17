---
id: cardnn
short_title: CardNN
title: 'Towards One-shot Neural Combinatorial Solvers: Theoretical and Empirical Notes on the Cardinality-Constrained Case'
authors:
- Runzhong Wang
- Li Shen
- Yiting Chen
- Xiaokang Yang
- Dacheng Tao
- Junchi Yan
year: 2023
date: '2023'
publication:
  date: '2023'
  source_url: https://openreview.net/forum?id=h21yJhdzbwz
venue: ICLR
paper_url: https://openreview.net/forum?id=h21yJhdzbwz
institutions:
- Shanghai Jiao Tong University
- JD Explore Academy
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Differentiable Optimization
- Facility Location
- Graph Optimization
- Portfolio Optimization
problems:
- Cardinality-Constrained CO
- Facility Location
- Maximum Coverage
- Portfolio Optimization
summary: A differentiable cardinality layer uses entropic optimal transport and Gumbel perturbations; task-specific networks initialize extensive test-time probability search, while a separate predictive portfolio model jointly learns the decision objective.
code_url: https://github.com/Thinklab-SJTU/NAR-CO-Solver
figure:
  path: paper-assets/cardnn/framework.png
  alt: Task-specific problem encoder, optimal-transport cardinality layer, objective estimator and self-supervised loss for facility location, maximum coverage and predictive portfolio optimization.
  caption: 'Figure 1: the CardNN cardinality-constrained learning pipeline.'
  source_url: https://openreview.net/pdf?id=h21yJhdzbwz#page=3
---
# Towards One-shot Neural Combinatorial Solvers: Theoretical and Empirical Notes on the Cardinality-Constrained Case

> **TL;DR:** CardNN embeds a differentiable top-k relaxation in task-specific networks, using optimal transport, Gumbel perturbations and optional temperature homotopy. The deterministic CO experiments use a learned initialization followed by **many test-time gradient steps and hundreds of parallel samples**. “One-shot” describes the non-autoregressive network, rather than the complete measured inference procedure. The theoretical claims concern a soft-to-binary relaxation distance, not an objective approximation ratio or a universal optimal-solution guarantee.

## Motivation

Unconstrained neural outputs and penalty-only objectives can leave a mismatch between continuous training decisions and discrete cardinality-constrained solutions. The paper studies a differentiable architecture that encodes selection of k items and trains directly against the downstream objective. It evaluates facility location, weighted maximum coverage, and a separate predictive portfolio application. These are distinct task-specific models, not one shared checkpoint solving all three tasks. [Sections1-4.](https://openreview.net/pdf?id=h21yJhdzbwz#page=3)

## Contributions

- **CardNN-S:** represent top-k selection as a two-destination entropically regularized optimal-transport problem, solved approximately by Sinkhorn normalization.
- **CardNN-GS:** perturb scores with Gumbel noise and evaluate multiple relaxed selections in parallel.
- **CardNN-HGS:** progressively reduce the Sinkhorn temperature during inference; the noise scale is held fixed in the reported homotopy schedules.
- Study the soft-to-binary discrepancy theoretically and empirically, and jointly train an LSTM predictor with the cardinality layer in a predictive portfolio model. These claims remain specific to the paper's cardinality setting. [Sections2-4.](https://openreview.net/pdf?id=h21yJhdzbwz#page=4)

## Methodology

### Cardinality layer and theoretical scope

For m item scores, the transport matrix has **two rows and m columns**, with row masses m-k and k and unit column masses. Its selected row is a differentiable selection vector. Entropic regularization uses temperature tau; alternating row/column normalization produces the relaxed matrix. Hard top-k converts a candidate to a discrete k-item set. The paper's general formulation permits at most k nonzeros; its FLP/MCP implementation selects exactly k, appropriate for the monotone objectives used here. [Equations1-5.](https://openreview.net/pdf?id=h21yJhdzbwz#page=4)

**Constraint violation (CV)** is defined as the expected Frobenius distance from a relaxed transport matrix to its nearest feasible binary transport matrix. It is not simply the error in the sum of selection probabilities, and it is not the percentage of final hard solutions violating cardinality. For converged Sinkhorn and a nonzero adjacent score gap, Proposition2.3 bounds CV by **2m tau log(2) divided by that score gap**. A tied gap makes this bound uninformative; it does not make the actual bounded matrix distance infinite.

The authors derive a Gumbel-perturbed bound with probability/cutoff conditions, a simplified bound that suppresses logarithmic terms, and a zero-noise connection under a unique-boundary-gap assumption. None establishes an objective approximation ratio. Finite Sinkhorn iterations, sampling variance and test-time optimization remain additional practical factors. [Propositions2.3-2.4, Corollaries2.5-2.6 and AppendixC.](https://openreview.net/pdf?id=h21yJhdzbwz#page=15)

**Proof-check caveat:** AppendixC, Equation29 factors a joint adjacent-ranking event into products of pairwise ranking probabilities, although those events share random variables. For m=3, k=1 and equal original scores, a fixed ordered top-two pair has probability **1/6** under iid continuous Gumbel noise, whereas the displayed product is **1/4**. This directly challenges that equality, without by itself proving that the final upper bound is false; an alternative inequality/proof would have to be established separately. The note therefore reports the theoretical results as the authors' claims, rather than certifying the proof. [Equation29.](https://openreview.net/pdf?id=h21yJhdzbwz#page=15)

### Facility location and maximum coverage

Facility location minimizes the sum of distances to the nearest selected facility. A proximity graph joins two locations below a threshold, .02 in the described setting, and a **three-layer SplineCNN** predicts scores. A softmax-based nearest-facility surrogate enables differentiation. Maximum coverage uses a set-item bipartite graph, **three GraphSAGE layers plus a sigmoid head**, and the weighted union objective, counting each covered item's weight once. [Equations12-14.](https://openreview.net/pdf?id=h21yJhdzbwz#page=6)

Training updates neural weights using the task objective without optimal-solution labels. During deterministic CO inference, the trained network predicts the initial score/latent vector; **gradient search updates this vector, not the network weights**, and hard candidates are evaluated and the best objective retained. The current maximum-coverage code explicitly detaches the model prediction and constructs an Adam optimizer over that latent vector. Homotopy repeats optimization at decreasing temperatures. [Algorithms2-3.](https://openreview.net/pdf?id=h21yJhdzbwz#page=21)

The classification is **specialist / constructive**. Each relaxed or hard candidate represents a whole selected set. Gradient search over scores is not a learned neighborhood that edits an incumbent combinatorial solution; keeping the best candidate does not itself make the neural method an improvement policy. Separate SplineCNN, GraphSAGE and LSTM models also do not demonstrate shared-weight cross-task generality.

### Predictive portfolio application

An encoder-decoder LSTM predicts future price changes and hence predicted return/covariance. A fully connected head predicts selection scores. For each sampled mask, inverse-covariance weights are masked, clipped by ReLU and normalized. Training optimizes mean realized future Sharpe ratio over samples; it uses future training-period prices as supervision, not optimal portfolio labels. At test time, **1,000 candidates are ranked by predicted Sharpe**, and the paper specifies hard top-k on the selected portfolio before evaluating future realized performance. [Section4/AppendixF.](https://openreview.net/pdf?id=h21yJhdzbwz#page=29)

The currently released portfolio branch computes weights from **soft probabilities** and returns the candidate with best predicted Sharpe; the inspected test caller does not apply the paper's final hard top-k. This is a paper/code discrepancy, not evidence that the published results used that exact current code snapshot. The current source is therefore not an implementation-level verification of hard-cardinality compliance in the published portfolio measurements.

## Experiments

### Data and compute

Synthetic FLP and MCP use **100 training and100 test instances** per setting. FLP uses500 locations/k30 and800/k50; MCP uses500 sets/1,000 items/k50 and1,000 sets/2,000 items/k100. The hardware is an **i7-9700K,16GB RAM and RTX2080Ti11GB**. The paper describes training within tens of minutes and tuning on a small subset of about five instances. [AppendixE.](https://openreview.net/pdf?id=h21yJhdzbwz#page=22)

Defaults are tau .05, noise .25 with **500 samples** for FLP, and noise .15 with **1,000 samples** for MCP. Homotopy uses tau .05/.04/.03. The current configurations use up to **800 probability-search iterations for CardNN-S,1,500 for FLP-GS and1,000 for MCP-GS**, plus multi-stage HGS schedules. Current configuration budgets are not guaranteed to match every paper result: for example, a released MCP setting gives Gurobi30 seconds, whereas Table5 reports100/120-second budgets. The appendix fixes **100 Sinkhorn iterations**, so convergence assumed by the theoretical statements must not be taken for granted. [AppendixE.2/E.4.](https://openreview.net/pdf?id=h21yJhdzbwz#page=27)

### Synthetic CO results

The reported gap is **abs(J-Jbest)/max(J,Jbest)**, where Jbest is the best observed method unless an integer solver proves optimality. Table entries such as .023 mean **2.3%**, not .023%. Gurobi does not prove the larger MCP optima within24 hours; a rounded zero gap there is not a certificate.

| Setting | CardNN-GS | CardNN-HGS | Relevant comparison |
| --- | --- | --- | --- |
| FLP500 | .023 gap,76.53s | .021 gap,103.74s | budgeted Gurobi .033,125.59s; exact Gurobi0,314.80s |
| FLP800 | .027 gap,120.69s | .023 gap,158.40s | exact Gurobi0,648.21s |
| MCP500 | .002 gap,28.10s | .002 gap,39.58s | greedy .011 gap,.024s |
| MCP1,000 | .001 gap,60.69s | rounded .000 gap,89.76s | greedy .008 gap,.089s; exact optimum not certified |

These results show a quality/compute tradeoff rather than universal dominance over greedy or integer programming. The neural method can use far more time than a strong greedy baseline. [Tables4-5.](https://openreview.net/pdf?id=h21yJhdzbwz#page=23)

### Real data and protocol exceptions

Facility-location transfer tests use **London166, New York260, Shanghai510 and Seoul569 Starbucks locations**, selecting30 facilities, with the paper's Euclidean/Manhattan labels. The authors' current README clarifies that its Euclidean implementation actually uses **squared Euclidean distance**; neither metric is a real road-distance calculation. London is an explicit speed/quality exception: the Euclidean-labelled HGS cost .042 in50.3s is worse and slower than exact SCIP .040 in2.8s. Shanghai HGS improves on the short-budget Gurobi result (.155 versus .222) but remains worse than exact .139. [Tables6-13.](https://openreview.net/pdf?id=h21yJhdzbwz#page=24)

Maximum coverage uses six Twitch language graphs with **1,912-9,498 nodes**, choosing50 users to cover the sum of **log-transformed viewer counts**, not a stochastic diffusion/influence model. HGS matches the integer-programming optimum on all six graphs, but SCIP is consistently much faster: **.1-1.5s versus19.7-56.1s**. The Spanish graph's greedy solution already reaches the reported optimum in .1s. [Tables14-19.](https://openreview.net/pdf?id=h21yJhdzbwz#page=26)

The EGN baseline has an important exception: because synthetic-to-real transfer performs poorly, the authors also **train EGN directly on each real test dataset**. Figure4 excludes that training time; the detailed tables distinguish these rows. CardNN's reported real-data protocol transfers its synthetic-trained models. Thus the plotted times are not uniformly inclusive end-to-end training-plus-inference comparisons. [AppendixE.3.](https://openreview.net/pdf?id=h21yJhdzbwz#page=23)

### Portfolio and ablations

The portfolio study uses **494 S&P500 assets**, training prices from2018-01-01 through2020-12-30 and testing in2021, with a120-trading-day future horizon, cardinality20 and annual risk-free rate3%. The reported Sharpe ratio increases from **1.082 to1.968**, annual return from24.1% to40.0%, and risk decreases from19.5% to18.8%, relative to the LSTM-plus-Gurobi baseline. Prediction MSE simultaneously worsens from **.153 to1.382**. AppendixB passes CardNN-trained predictions to Gurobi and obtains Sharpe **1.002**, illustrating predictor/solver coupling rather than a universally superior price forecaster. This is a single historical evaluation, with no demonstrated return guarantee or comprehensive transaction-cost study. [Table3/AppendixB.](https://openreview.net/pdf?id=h21yJhdzbwz#page=13)

The temperature/noise/sample-count ablations do not establish monotonic improvement for every setting. Contrary to the prose claim that all1,000-sample results beat800 samples, Table20/21 contain exceptions: tau .1/noise .15 gives **44,837.2 versus44,841.5**, and tau .05/noise .2 gives **44,638.1 versus44,651.5**. Smaller temperature can also hurt because a fixed iteration budget fails to converge and gradients become unstable. [Tables20-22.](https://openreview.net/pdf?id=h21yJhdzbwz#page=28)

## Limitations

### Discussed in the Paper

- The theoretical study does not establish objective approximation ratios and is restricted to cardinality constraints.
- Finite normalization, numerical instability and increased sampling variance constrain the temperature/noise choices.
- Predictive models may be tightly coupled to their downstream solver. [AppendixB/E.4.](https://openreview.net/pdf?id=h21yJhdzbwz#page=13)

### Curator Notes

- The joint-ranking factorization in Equation29 needs justification or correction; this audit does not independently certify the final theoretical bound.
- Non-autoregressive architecture does not make the actual deterministic CO experiment a single forward pass.
- Exact hard selection, soft relaxation distance and objective quality are distinct claims.
- Real-data baseline training/time exceptions, very fast classical optima on Twitch, and non-monotone ablation entries qualify the headline comparisons.
- The current public code includes a later general-positive-linear-constraint extension and differs in some budgets and the portfolio hard-top-k step. Those later capabilities are not retroactively attributed to the ICLR paper.

## Reproducibility

- **Full reading:** all **31 pages**, including AppendicesA-H, complete proofs, pseudocode, detailed synthetic/city/Twitch tables, portfolio steps and all portfolio plots, were freshly read. Key framework, transport equations, ranking proof, algorithms, result tables and frontier plots were visually inspected.
- **Source provenance:** the read PDF is a31-page public mirror copy carrying the ICLR2023 publication header, matching the title and six authors. The primary OpenReview record is retained; this is not a claim of a byte comparison with an independently downloaded official PDF.
- **Scientific supplements:** manual source/author-code inspection found AppendicesA-H within this PDF and no separately referenced missing scientific material. The official source ZIP contains72 members and no additional PDF, ZIP or TeX scientific attachment. The full README and relevant cardinality, coverage, portfolio and configuration paths were inspected; no new training/solver run was performed.
- **Code:** [Thinklab-SJTU/NAR-CO-Solver](https://github.com/Thinklab-SJTU/NAR-CO-Solver), the destination of the original author link. It contains both this ICLR work and a later positive-linear-constraint paper. The README records PyTorch1.6.0/PyG1.6.3, explicitly warns that retraining/random seeds can materially affect results, and clarifies squared-Euclidean distance. Its current BibTeX omits Dacheng Tao; the note correctly retains all six authors from the paper.
- **Figure:** original Figure1, page3, cropped directly with its complete diagram and caption. Publication precision remains **2023**; no unsupported exact acceptance day is introduced.
