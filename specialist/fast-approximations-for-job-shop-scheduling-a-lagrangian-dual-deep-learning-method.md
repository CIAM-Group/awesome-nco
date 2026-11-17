---
id: fast-approximations-for-job-shop-scheduling-a-lagrangian-dual-deep-learning-method
short_title: JSP-DNN
title: 'Fast Approximations for Job Shop Scheduling: A Lagrangian Dual Deep Learning Method'
authors:
- James Kotary
- Ferdinando Fioretto
- Pascal Van Hentenryck
year: 2022
date: '2021-10-12'
publication:
  date: '2022-06-28'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/20685
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/20685
institutions:
- Syracuse University
- Georgia Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Job Shop Scheduling
summary: Job/machine structured neural networks predict start times for a fixed job-shop routing under processing-time
  slowdowns, trained with supervised and Lagrangian violation losses; classical schedule recovery produces the final
  feasible solution.
arxiv_url: https://arxiv.org/abs/2110.06365
figure:
  path: paper-assets/fast-approximations-for-job-shop-scheduling-a-lagrangian-dual-deep-learning-method/framework.png
  alt: Separate job and machine input branches feed shared layers predicting operation start times.
  caption: 'Original Figure 2: the job–machine architecture of JSP-DNN.'
  source_url: https://cdn.aaai.org/ojs/20685/20685-13-24698-1-2-20220628.pdf#page=5
---

# Fast Approximations for Job Shop Scheduling: A Lagrangian Dual Deep Learning Method

> **TL;DR:** JSP-DNN predicts operation start times using job and machine subnetworks, then recovers a feasible schedule with a linear program. Lagrangian violation penalties improve the predictions. Experiments concern processing-time perturbations of fixed benchmark routings; the reported gaps use a time-limited CP incumbent as reference.

## Motivation

Repeatedly scheduling a production system after a machine slowdown can require an answer much faster than solving every job-shop instance from scratch. A small processing-time change can alter optimal operation orderings. Direct supervised prediction can produce overlapping operations and deceptively short makespans, so prediction accuracy alone does not make an executable schedule. [Formal PDF pp. 1–3]

## Contributions

- Learns operation start times from solved examples, rather than directly predicting a one-hot machine permutation.
- Combines mean-squared prediction error with weighted precedence and machine-overlap violations, updating nonnegative multipliers during training.
- Separates job and machine processing branches before shared output layers.
- Recovers feasible schedules and compares their quality and online cost with CP Optimizer, a capacity-matched fully connected network, and five dispatching rules. [Formal pp. 2–7]

## Methodology

The input contains operation durations and a **fixed assignment of operations to machines**. Each job visits each machine once in the evaluated setting; the objective is makespan minimization under within-job precedence and machine exclusivity. Models and output dimensions are tied to their benchmark root, job count and machine count. The paper assumes a tie-breaking rule for labels and uses a secondary L1 objective to stabilize neighboring schedules during data generation. This is **specialist / constructive** prediction followed by classical recovery, without evidence of one checkpoint solving different native scheduling problems. [Formal pp. 2–3, 6; arXiv pp. 14–15]

The JM architecture processes durations grouped by each job and by each machine, concatenates their latent outputs into shared layers, and predicts one start time per operation. All layers use ReLU. The precedence penalty is a positive part of the precedence deficit; a disjunctive non-overlap penalty takes the smaller of the two possible separation violations. Training minimizes supervised MSE plus multiplier-weighted penalties, increases multipliers using observed violations, and warm-starts the weights across epochs. The displayed dual optimization is approximated by stochastic gradient updates; the article does not establish convergence to a globally optimal constrained neural model. [Formal pp. 3–5, Eqs. 3–7, Algorithm 1]

Predicted operation midpoints induce an ordering on each machine. An LP minimizes makespan under those orderings and job precedence. With consistent orderings, the difference-constraint structure yields integral solutions for integral durations. The authors acknowledge that inconsistent machine/job orderings can make the LP infeasible and describe a priority-queue greedy fallback; they report never needing that fallback on the tested predictions. This feasibility mechanism belongs to the recovery stage, rather than a guarantee that raw network outputs satisfy every constraint. [Formal p. 5, Model 2 and Algorithm 2]

## Experiments

Eleven JSPLIB roots range from 20×10 to 50×10 or 30×20 operations. For each root, 5,000 instances increase durations on one selected slowdown machine from 1 to 1.5 times their original values. CP Optimizer labels use a 1,800-second limit and L1 stabilization; an 80:20 split gives within-root duration generalization. It is not an evaluation on unseen routings or arbitrary job counts. Models use two job and machine layers with widths twice the corresponding operation count, shared width 2JM and a JM-sized output; the FC baseline matches the parameter count. Hyperparameter configurations are evaluated with five initialization seeds and the best average model is selected. [Formal pp. 6–7; arXiv pp. 10, 14–15]

Table 2 reports recovered JSP-DNN gaps of −0.045%, −0.143% and −0.48% on yn02, ta25 and ta30, respectively, and positive gaps up to 8.11% on swv13. The negative values mean improvement over the 30-minute CP incumbent, **not improvement over a proven optimum**. FC gaps range from 10.69% to 28.61%; the five simple rules are substantially worse in these experiments. CP's average time to match JSP-DNN ranges from 12.04 seconds to beyond 1,800 seconds. The paper explicitly observes that its incumbent-based gaps understate the true optimality gaps. [Formal p. 7, Table 2 and Figure 4]

The arXiv timing appendix reports 2.9–7.5 milliseconds for neural inference and 8.6–30.1 milliseconds for LP recovery, as separate columns. Selected-model total training times range from 668 to 2,617 seconds; these omit the cost of generating thousands of 30-minute CP labels and the full hyperparameter search. Hardware is an Intel Xeon Platinum 8260 at 2.40 GHz; the listed environment is Ubuntu 20.04.2, Python 3.7.6, PyTorch 1.4.0, NumPy 1.20.3, OR-Tools 8.0.8283 and CP Optimizer 12.10. No GPU configuration is claimed. [arXiv p. 14, Appendices A–C, Table 3]

## Limitations

The supervised mapping is narrow: separate fixed structures, bounded one-machine slowdowns and expensive solver labels. A network prediction alone can be infeasible; the final schedule depends on recovery. Comparisons establish empirical quality and speed on those distributions, without an approximation ratio, worst-case online bound or universal feasibility theorem for neural outputs. Selection over five seeds/configurations is distinct from confidence intervals over independently selected training runs.

There are reproducibility ambiguities in the printed formulas. Formal Algorithm 2 says “while Q is empty” and enqueues the current task rather than its successor, contrary to the explanatory scheduling procedure. Model 2's printed inequality direction also differs from the earlier-to-later midpoint-order description. These are identified as printed specification inconsistencies, not a claim that the historical implementation or experiments used those literal operations. The formal learning-rate search maximum is 0.02, whereas the early arXiv Table 1 prints 0.002 despite selected rates above 0.002 in its Table 4. Formal prose says recovery never exceeds 30 ms, while the earlier appendix reports 30.1 ms for ta50; both are retained at their stated precision. [Formal pp. 5–7; arXiv pp. 10, 14–15]

## Reproducibility

The publisher's eight-page AAAI article and the identified 15-page arXiv v1 were both read completely, including all references and arXiv Appendices A–D. Publication is 2022-06-28 in the publisher/Crossref record; arXiv v1 is independently dated 2021-10-12. The formal article supplies the principal claims, while the earlier appendix supplies additional timing, environment and selected hyperparameters with its version differences preserved.

Author publication pages link the formal article and arXiv, without an identified implementation repository. Appendix C promises a future code release but gives no repository URL. Exact-title/identifier code searches did not identify an official released implementation or extra scientific attachment. The publisher HTML returned 520 locally and an OpenReview lookup returned 400; these access outcomes are recorded, without inventing an attachment inventory. The formal paper's referenced timing appendix is present in the fully read arXiv version. No training, solver benchmark or historical source-code reproduction was performed. All four figures, four unique tables and key recovery/training formulas were rendered and visually checked; the displayed architecture is an original Figure 2 crop.
