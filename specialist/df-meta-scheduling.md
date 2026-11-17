---
id: df-meta-scheduling
short_title: DF-META
title: Instance-wise Adaptive Scheduling via Derivative-Free Meta-Learning
authors:
- Hefang Qing
- Miao Zhang
- Yaoxin Wu
- Weinan Huang
- Jianhao Yang
- Wen Song
- Gang Wang
year: 2026
date: '2026-04-20'
publication:
  date: '2026-04-20'
  source_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/b21fb19109734d351faf54b19ac8b3b7-Abstract-Conference.html
venue: ICLR
paper_url: https://proceedings.iclr.cc/paper_files/paper/2026/hash/b21fb19109734d351faf54b19ac8b3b7-Abstract-Conference.html
institutions:
- Shandong University
- Xiaomi Corporation
- Eindhoven University of Technology
- Zhongguancun Academy
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- Flexible Job Shop Scheduling Problem
- Job Shop Scheduling Problem
summary: Derivative-free first-order meta-training learns a neural scheduler initialization
  for per-instance evolutionary parameter adaptation, with separate DANIEL-FJSP and
  SPN-JSP studies.
code_url: https://github.com/calmQ/DF-META
---

# Instance-wise Adaptive Scheduling via Derivative-Free Meta-Learning

> **TL;DR:** Train a neural scheduling initialization for subsequent instance-wise parameter adaptation. Evolution strategies estimate update directions from schedule costs, while population batching uses the GPU efficiently. The practical meta-update is a first-order approximation, and adaptation/training budgets remain material.

## Motivation

Optimizing a policy's average training performance can leave individual scheduling instances poorly solved. AS/EAS adapt at test time but do not train explicitly for that adaptation. DF-META instead trains an initialization through simulated instance-specific fine-tuning, using derivative-free fitness evaluation to avoid backpropagation through discrete schedule generation (Sections1-2).

## Contributions

The work combines instance-wise meta-learning, Gaussian evolutionary search in neural parameter space, two Monte Carlo fitness strategies and a GPU population network/environment. It separately evaluates DANIEL on FJSP and the self-labeling pointer scheduler SPN on JSP. The framework is model-agnostic at the method level, but the paper does not demonstrate a common FJSP/JSP checkpoint or shared native architecture. It remains **specialist/constructive**: parameter search adapts a policy that constructs complete schedules, rather than directly editing an incumbent's operation sequence (Sections3-5; AppendixD).

## Methodology

Each training instance is an adaptation task. Starting from the meta-parameters, an inner loop evaluates perturbed neural schedulers and updates instance-specific parameters. An outer loop aggregates the resulting instance feedback to improve the initialization. The full nested ES expression is presented in Algorithm3, but Section4.1.2 explicitly replaces it with a FOMAML-style first-order approximation(Eq4), avoiding differentiation through adaptation. It is not exact optimization of the full nested meta-gradient (PDF4-6).

For Gaussian perturbations epsilon and fixed scale sigma, the score-function identity estimates the gradient of a **Gaussian-smoothed expected fitness**, provided the expectations exist. It does not provide a global optimum guarantee for the original discrete scheduling problem. For each perturbed individual, MC averaging uses the mean makespan of Lrollouts; MC best-sample uses their minimum. The latter targets expected best-of-Lperformance, rather than being an unbiased estimate of mean single-rollout makespan. Policies and environments carry a population dimension so fitness can be evaluated in parallel without neural backpropagation (Algorithms1-3; Eq2-6).

Printed FJSP settings are population100, sigma0.2, inner/outer step0.05, batch20instances, three inner updates and200epochs. L=20averages train the greedy-evaluated configuration, while L=100best-sample trains the sampling configuration. All adaptation methods receive10test-time updates, and final sampling uses100solutions. SD1 has variable operations per job with nearby machine-specific times; SD2 fixes operation count to the machine count and uses1-99processing times. Four smaller shapes are trained;30x10/40x10 use the20x10model, and public tests use separate SD1 10x5/15x10models (PDF7-8/13).

## Experiments

**FJSP quality and latency.** Against DANIEL,AS,EAS-EMB and MWKR, DF-META improves the displayed neural quality rows. On SD2 20x10, sampling reaches529.9/14.72% versus DANIEL552.6/19.64%, AS537.1/16.28% and EAS540.8/17.08%. Runtime is1.30minutes versus direct DANIEL5.97seconds and EAS1.62minutes. On SD2 40x10, greedy DF-META2.55minutes is slightly slower than EAS2.53minutes despite better quality. Gaps use finite one-hour OR-Tools incumbents, so negative values are not negative gaps to certified optima. CP is still better in many rows (Table1).

For public Brandimarte/Hurink, the SD1 10x5 sampling meta-model reaches2.25%/3.28%/5.75%/0.14% across mk/rdata/edata/vdata. It improves on the compared neural adaptation rows, while OR-Tools remains the reference. The15x10model also gives strong but different results; this is instance/size/distribution transfer within FJSP (Table2).

**Ablations and compute.** ES training/adaptation without meta-learning already improves over some gradient baselines; adding meta-training reduces SD2 10x5gap from14.38% to13.18%. Compared with FOMAML, quality improves in every displayed setting, while DF-META is slower on most larger configurations and all listed sampling configurations. On40x10, sampling is4.52minutes versus FOMAML2.95minutes. Table4's GPU0.5/1.1/2.4/3.8seconds versus Ray CPU9.8/29.8/62.1/122.3seconds measures **one population fitness evaluation for100individuals**, not whole-solver or training speed (Tables3-5; PDF10).

Offline training is more costly than FOMAML: DF-META2.1/4.5/7.2/11.2GPUhours versus1.5/2.9/3.7/5.5hours, with1.3/1.6/2.0/2.2GB versus0.9/1.0/1.0/1.2GB. Hardware is an i9-9900K plus one RTX4090; the CPU comparison uses16threads. At100x20, the20x10meta-model gives1562.2sampling zero-shot and1492.2after fine-tuning versus DANIEL1612.9 and OR-Tools1737.1. AS/EAS encounter OOM in that configuration; this is hardware/implementation-specific rather than an impossibility result for those algorithms (Tables8-9).

**Separate JSP study.** Apply the method to SPN/SLIM, using3,000fixed instances per epoch(500each at six shapes), ten DFepochs versus twenty SPNepochs, population100, sigma0.04, step0.005and L20/128. Each test instance receives10adaptation steps, with128final sampled candidates. On Taillard15x15, sampling gap is6.31% versus SPN8.52%, AS7.54% and EAS7.06%; on30x20 it is14.07% versus15.91/14.52/14.33%. This modified training dataset/budget is distinct from the original SLIM article's larger dataset (Table10; AppendixD).

Tables11-13 provide mean/std gaps but do not identify an independently trained seed count or significance test. The representative Gantt example improves536to459; it is an illustration, not proof that every fine-tuned instance removes all idle time (AppendicesE-F).

## Limitations

Derivative-free search requires many complete rollout evaluations and stores population parameters. Ten adaptation updates do not equalize the number of generated schedules or compute across methods. Meta-training and its per-instance inference cost may not suit tight latency budgets. The experiments do not prove global convergence, superiority over all specialized scheduling metaheuristics or a general advantage of derivative-free optimization in every regime. JSP and FJSP use separate base models and training settings.

### Curator Notes

The current release implements antithetic perturbations, population-standardized **negative** makespan fitness, Adam updates and parameter clipping to[-10,10]. These are practical modifications to the raw-cost `1/(population*sigma)` estimator and plain update displayed in the text. Meta-training averages the final inner-loop search direction across instances; it does not run the full nested estimator in Algorithm3. This release should be described as the practical first-order method rather than an exact unbiased meta-gradient implementation.

`train.py` refreshes the20training instances every20outer updates, unlike the prose's per-epoch generation, and its validation checks the meta-initialization without the test adaptation loop. `fine_tune.py` hard-codes FJSP sigma0.04 despite the printed FJSP0.2setting. It evaluates initialization plus ten successive adapted models, retains the best evaluated makespan, and computes an additional unused update after the final evaluation. Thus the displayed result is a best-across-adaptation-iterates result, with11population evaluations, rather than exclusively the last model. These observations are version/settings evidence; no neural benchmark was rerun to infer their historical effect.

## Reproducibility

- All16pages of the [formal ICLR2026 PDF](https://proceedings.iclr.cc/paper_files/paper/2026/file/b21fb19109734d351faf54b19ac8b3b7-Paper-Conference.pdf) were read, including all references and scientific AppendicesA-F. Eleven key pages were visually checked, covering all five figures, thirteen tables and central equations/algorithms. Publisher metadata confirms April20,2026, seven authors and pages109624-109639; PDF1 identifies Shandong/Xiaomi/Eindhoven/Zhongguancun affiliations.
- The publisher lists the integrated paper without separate scientific attachments. Both OpenReview notes APIs for`XcCqRcHzJ3` returned403. No explicitly missing scientific document was found. Three repository PDF paths are copies of the cited external2012FJSPbenchmark report, not DF-META appendices.
- The [official repository](https://github.com/calmQ/DF-META) was inspected at`251f80567d3773af2be8cf38d56e961b1da6e447`:7,162files, sixteen FJSPmeta checkpoints and sixteen AS/EASbaseline checkpoints. README, full parameters/optimizer/train/fine-tune/META wrapper and both population/master DANIEL model sources were read. The release does not include the JSP/SPN experiment's training code/checkpoint. Python3.10.18, PyTorch2.5.0, NumPy1.26.4 and pandas2.3.3 are documented; optimizer/test code assumes CUDA in several places.
- Thirteen catalogue relations have explicit body citations and full bibliography identity. Generic mentions of pointer-network architecture are not a Vinyals paper citation and do not create an edge. Source/visual evidence and reading logs are retained; no full training/adaptation experiment was executed.
