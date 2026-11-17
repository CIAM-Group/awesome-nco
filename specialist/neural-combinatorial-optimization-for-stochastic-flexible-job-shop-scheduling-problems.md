---
id: neural-combinatorial-optimization-for-stochastic-flexible-job-shop-scheduling-problems
short_title: SPM-DAN
title: Neural Combinatorial Optimization for Stochastic Flexible Job Shop Scheduling Problems
authors:
- Igor G. Smit
- Yaoxin Wu
- Pavel Troubil
- Yingqian Zhang
- Wim P.M. Nuijten
year: 2025
date: '2024-12-18'
publication:
  date: '2025-04-11'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/34870
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/34870
institutions:
- Eindhoven University of Technology
- Dassault Systèmes
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Stochastic Flexible Job Shop Scheduling
- Stochastic Job Shop Scheduling
summary: Inducing-point scenario attention augments deterministic scheduling features and PPO rewards to construct
  fixed schedules under uncertain processing times; separate DAN/L2D models target VaR or expected makespan, with
  qualified baseline comparisons and current implementation/evaluation boundaries.
arxiv_url: https://arxiv.org/abs/2412.14052
code_url: https://github.com/ai-for-decision-making-tue/NCO-for-Stochastic-FJSP
figure:
  path: paper-assets/neural-combinatorial-optimization-for-stochastic-flexible-job-shop-scheduling-problems/framework.png
  alt: Scenario attention pools sampled features for operations, machines and pairs, concatenating them with deterministic
    features for a dual attention scheduler.
  caption: Original Figure 1 from the complete arXiv paper. SPM is attached separately to three DAN input feature
    types.
  source_url: https://arxiv.org/pdf/2412.14052v1#page=4
---

# Neural Combinatorial Optimization for Stochastic Flexible Job Shop Scheduling Problems

> **TL;DR:** SPM-DAN augments a constructive scheduler with attention over sampled processing-time scenarios. It plans the complete schedule before realizations are known and optimizes sampled 95% VaR or expected makespan. Reported gains are strongest on larger instances; some small/public cases and important current-code evaluation details qualify the headline claims.

## Motivation

Many factories need an advance schedule rather than a dispatching policy that observes realized durations during execution. Using only nominal processing times ignores risk, while repeatedly optimizing many stochastic scenarios can be expensive. The paper incorporates sampled uncertainty into both neural state features and training rewards, using deterministic base schedulers as components. The uncertainty concerns processing times, not random job routes or online job arrivals. [pp. 1–3]

## Contributions

- Introduces a scenario processing module (SPM) with inducing-point attention and mean aggregation.
- Separates state scenarios from reward scenarios and trains constructive policies for different sampled makespan objectives.
- Evaluates SPM-DAN for flexible JSP and a separately trained SPM-L2D extension for JSP, including size/distribution/scenario-count transfer, CP baselines and significance tests. Modular reuse across separately trained networks is distinct from sharing one solver checkpoint across problems. [pp. 3–8, 11–13]

## Methodology

At each construction step, the policy chooses a compatible machine for the first unscheduled operation of a job. The same action is applied to the deterministic instance and every sampled scenario, preserving a common machine assignment and operation order. Each scenario maintains its own completion-time features; no actual future realization is revealed during planning. [p. 3]

For each operation, machine and operation–machine pair, the intended SPM embeds features over scenarios. Trainable inducing vectors attend to scenario tokens, those tokens attend back to the induced representation, and mean aggregation produces one stochasticity embedding. Concatenating it with deterministic features supplies the base dual-attention network. With a fixed number of inducing points, attention cost is linear in scenario count; this does not eliminate feature-maintenance, candidate-evaluation or operation-count costs. [pp. 3–4, Fig. 1]

Independent reward scenarios track completion-time lower bounds. The incremental reward is f(C_t)−f(C_(t+1)), where f is sample mean or sample VaR. With gamma=1, the sum telescopes to initial minus terminal sampled objective. This establishes an objective identity for the fixed sampled trajectories and action-independent initial term, not a population-risk or optimality guarantee from finite samples. PPO trains the actor/critic on these common-action transitions. [pp. 3–5]

**Classification: Specialist / constructive.** FJSP sizes/distributions use task-specific trained models; the JSP experiment trains a different L2D-based network. Mean-objective and VaR-objective policies are also trained separately. Shared sampling/attention design across these experiments does not demonstrate one unchanged checkpoint across native problems. [pp. 5, 7, 11]

## Experiments

Training uses SD1 and the paper's SD3 generator at 10×5, 20×5, 15×10 and 20×10 jobs×machines. SD3 correlates alternative-machine durations around an operation-specific value, avoiding extreme unrelated times in the earlier SD2 generator. Default uncertainty is log-normal with coefficient of variation sampled from 0.1–0.5; additional tests use beta and mixed log-normal/beta/gamma distributions. Test sets contain 100 synthetic instances per type, plus mk/rdata/edata/vdata benchmarks. [pp. 5–8]

The reported setup has 1,000 training episodes, renewed instance batches every twenty episodes, validation every ten, 100 state scenarios and 1,000 reward/evaluation scenarios. SPM is described with dimension 32, four heads and sixteen inducing points; the actor hidden size increases to 128. Training takes one to fourteen hours on an A100 and eighteen-core Xeon; CP-SAT uses a separate 32-core AMD CPU and one-hour limits. CP-stoch uses 25 scenarios on the two smallest synthetic sizes and ten elsewhere; it is omitted from large tests after memory limits. Neural inference is greedy or samples 100 candidate schedules. [p. 5]

For SD3 20×10, greedy SPM-DAN reports VaR 1289.77 in 3.14 seconds, versus DAN's 1376.18 in 2.63 seconds. Sampling reports 1261.80 in 10.50 seconds, versus DAN's 1336.97 in 3.80 seconds and deterministic CP-SAT's 1351.58. Negative gaps mean improvement over that deterministic CP baseline, not a gap below a certified stochastic optimum. Policies trained at 20×10 also improve the listed baselines on 30×10 and 40×10. [p. 6, Tables 1–2]

The result is not uniform dominance. CP-stoch is better on the 10×5 VaR tests; on SD1 10×5, greedy DAN's 149.03 is slightly lower than SPM-DAN's 149.58. On mk, DAN is slightly better under both decoding modes. On edata, sampled SPM-DAN is 1457.05 versus CP-SAT's 1423.01. For expected makespan, CP-SAT also wins the two smallest SD3 sets. Additional scenarios or candidate sampling are not monotonically better: the 40×10 SD3 greedy result 2294.33 beats its sampled 2305.52. [pp. 6–8]

Appendix A trains SPM-L2D on 10×10 JSPs and reports improvements at three test sizes. Appendix D gives t-tests against the best DAN/DAN-stoch alternative: SD1 10×5 and mk differences are not significant, and edata greedy has p=0.07. These tests do not establish significance against every CP/PDR baseline. [p. 11]

## Limitations

Performance depends on supplied processing-time distributions and finite scenarios. VaR is an empirical quantile estimate; the paper does not provide a statistical coverage certificate for real realized schedules. Distributional and size transfer remain within the tested scheduling formulations. The actor-size change and separately trained base models are relevant when attributing gains solely to SPM. [pp. 3–8]

The current evaluation code has a material selection boundary. Its sampling function directly takes the best mean and best VaR across all candidates **on the evaluation scenarios**, rather than selecting one candidate on construction scenarios and then scoring that fixed choice on a third held-out set. The two metrics can also select different schedules. Its stored runtime ends before replaying those candidates on the evaluation scenarios. These values therefore describe best-of-candidate sample evaluation and construction timing; they should not be described as independent held-out evaluation of an already selected single deployment schedule or complete risk-evaluation runtime. This finding concerns the pinned public implementation, without independently reproducing historical tables. [test_trained_model_stochastic.py, lines 180–343]

Two further local implementation qualifications are preserved as curator analysis. The printed CP-stoch Algorithm 2 counts how many makespans are larger but compares that count with round(0.95n); the public code instead uses round((1−alpha)n), optional machine intervals and presence guards. For ten distinct makespans 1,…,10, the actual Python rank expression at alpha=0.95 selects 9, while the empirical nearest-rank 95% quantile is 10 and NumPy's linear quantile is 9.55. The printed rule has no eligible count in that case. These are formulation/quantile-convention distinctions, not a rerun of the complete CP baseline. [p. 12; FJSPmodel_stoch.py]

In addition, current operation/machine branches reshape [batch,scenario,entity,feature] directly into scenario groups without first moving the entity axis, mixing entity labels within an SPM input. A saved labeled-array trace documents this grouping; the pair branch explicitly permutes axes first. The trace's identity-attention example illustrates data layout, not measured outputs from trained weights. Current SPM constructors also use one attention head and disable layer normalization, unlike the printed four-head/normalization description. Historical experimental impact remains unmeasured. [main_model.py, lines 262–369]

## Reproducibility

The formal article is AAAI 2025, volume 39(25), pp. 26678–26687, DOI 10.1609/aaai.v39i25.34870, published 2025-04-11. Its five authors are affiliated with Eindhoven University of Technology and Delmia R&D, Dassault Systèmes. The separate arXiv v1 date is 2024-12-18. Publisher page/PDF requests returned access challenges; the complete identified thirteen-page arXiv version supplies main text, full references and Appendices A–D, all read in full.

The publisher's indexed Poster link was traced to official Underline lecture 112195. Its actual one-page Poster_AAAI_25.pdf was downloaded, read and visually inspected; the public metadata has no slideshow/video attachment. The complete [official repository](https://github.com/ai-for-decision-making-tue/NCO-for-Stochastic-FJSP), at commit 1b92d3d934adc146688792d76ac8c1c682e335f8 dated 2026-01-29, contains 5,952 files: 63 Python files, four READMEs, three TOMLs, 5,862 deterministic FJSP instances, sixteen NumPy benchmark files, three illustrative L2D weights and requirements. No separate scientific PDF, video or nested archive is present. Large generated stochastic instances and the main SPM-DAN checkpoints are not bundled; the README supplies regeneration commands.

Core SPM fusion, common-action/reward separation, inference selection/timing and CP formulation paths were inspected. All result tables, CP pseudocode, SPM diagrams and the full poster were rendered or viewed. The local rank/tensor/selection checks and archive hashes are saved, with their scope explicit. No model weights were deserialized, and no training, CP-SAT/FJSP benchmark or historical result reproduction was run.
