---
id: learning-scheduling-algorithms-for-data-processing-clusters
short_title: Decima
title: Learning Scheduling Algorithms for Data Processing Clusters
authors:
- Hongzi Mao
- Malte Schwarzkopf
- Shaileshh Bojja Venkatakrishnan
- Zili Meng
- Mohammad Alizadeh
year: 2019
date: '2018-10-03'
publication:
  date: '2019-08-19'
  source_url: https://doi.org/10.1145/3341302.3342080
venue: SIGCOMM
paper_url: https://doi.org/10.1145/3341302.3342080
institutions:
- Massachusetts Institute of Technology
- Tsinghua University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
- Packing
problems:
- Online DAG Cluster Scheduling
- Multi-Resource DAG Cluster Scheduling
summary: Hierarchical graph embeddings and REINFORCE learn workload-specific stage and executor-allocation policies
  for Spark-style DAGs; real-cluster and multi-resource simulations show gains, with separate training for objectives/environments
  and explicit workload-shift failures.
arxiv_url: https://arxiv.org/abs/1810.01963
code_url: https://github.com/hongzimao/decima-sim
figure:
  path: paper-assets/learning-scheduling-algorithms-for-data-processing-clusters/framework.png
  alt: Job DAGs and executor state enter graph and policy networks; scheduling actions run in a cluster and return
    an objective-based reward.
  caption: 'Original Figure 4: the Decima scheduling-agent framework.'
  source_url: https://web.mit.edu/decima/content/sigcomm-2019.pdf#page=4
---

# Learning Scheduling Algorithms for Data Processing Clusters

> **TL;DR:** Decima learns a workload-specific cluster scheduler with graph embeddings, stage selection and job-level parallelism control. REINFORCE uses an increasing random episode horizon and arrival-sequence-conditioned baselines. A real 25-worker Spark testbed and separate multi-resource simulations show completion-time gains; the paper also documents poor workload transfer, restricted optimality comparisons and incomplete production-code availability.

## Motivation

Data-processing DAGs contain stages with different task counts, costs and dependencies. Equal resource shares, strict shortest-job-first and static parallelism can miss opportunities to complete small jobs without inefficiently expanding their executor counts. Decima learns how to prioritize runnable stages and allocate groups of executors from workload profiles, optimizing mean job completion time (JCT) or, in separately trained experiments, makespan. It retains Spark's lower-level task scheduler. [Accepted pp. 1–4]

## Contributions

- A hierarchy of node, job and cluster embeddings shares small neural transformations across differently sized DAG collections.
- A factored action selects a runnable stage and a job-level executor limit, balancing action-space size against trajectory length.
- An exponentially distributed episode horizon grows during training, while repeated job-arrival sequences permit input-dependent reward baselines.
- A Spark integration, profiling-based simulator and resource-packing extension support empirical comparisons and ablations. [Accepted pp. 4–8; Appendix C]

## Methodology

Node features contain remaining task count, mean task duration, current and available executors, and executor locality. Messages flow from children to parents: an embedding adds raw features to g(sum_u f(e_u)). Separate transformations summarize each job and the whole cluster. Two-hidden-layer functions with 32/16 hidden units implement the six graph transformations and two policy scorers; the reported model has 12,736 parameters, approximately 50 KB. [Accepted pp. 5–8, Figures 5–6]

A masked softmax samples a runnable stage. Another shared scorer takes a candidate parallelism limit as an input, rather than maintaining a separate network for each possible limit. Executors are allocated until the selected job reaches its limit; if free executors remain, another action follows. The limit must exceed the job's current allocation, ensuring that each action assigns at least one new executor. Running tasks are not preempted, and executors move between jobs after stage completion. [Accepted pp. 5–6, 12]

For mean JCT, the reward is negative elapsed time multiplied by the number of active jobs. Relating time-average job count to mean JCT invokes Little's law and the corresponding stable long-run setting, rather than a guarantee for an overloaded learned policy. Training uses REINFORCE, sixteen parallel workers with the same sampled arrival sequence, an input-dependent return baseline, differential rewards and Adam rate 0.001. Appendix C caps incoming jobs at 2,000, decays reset probability from 5e−7 to 5e−8, uses a 100,000-step average-reward window and reports at least 50,000 iterations. [Accepted pp. 6–7, 15–16]

The model is **specialist / constructive**. The multi-resource extension adds an executor-class action and retrains for that environment; the makespan and zero-migration-cost examples learn different policies. The paper does not demonstrate one checkpoint across those native formulations. Transfer among numbers of jobs, executors or arrival rates is within the corresponding scheduling problem. [Accepted pp. 10–12, 18–19]

## Experiments

The real testbed runs modified Spark 2.2 on twenty-five worker VMs with two executors each, plus a master. TPC-H has 22 query types and input sizes 2/5/10/20/50/100 GB. Batched tests use twenty unseen query combinations in each of 100 experiments. Decima reports 21% lower mean JCT than the closest tuned weighted-fair heuristic. That baseline sweeps its weight exponent from −2 to 2 in steps of 0.1 and is tuned per experiment. Continuous tests sample 1,000 jobs with mean interarrival time 45 seconds, approximately 85% load; Decima reports 29% lower mean JCT, with about a twofold advantage during busy hours. These are workload- and comparator-specific reductions, distinct from model-inference latency. [Accepted pp. 8–9]

Multi-resource results use a simulator and approximately 20,000 Alibaba jobs, training on the first half and testing on the remaining half. Up to 30,000 executors are partitioned evenly into four memory classes, each with one CPU core and memory 0.25/0.5/0.75/1. Decima reports 32% lower mean JCT than Graphene*, or 43% in a 200-executor TPC-H simulation. **Graphene*** is an adaptation to discrete executor classes with tuned troublesome-node grouping and weighted fairness, not the original continuous-resource formulation. The appendix explicitly acknowledges that this restriction may favor Decima. Lower JCT trades off resource fragmentation: it is not best on every packing metric. [Accepted pp. 10, 17–18]

Ablations show that removing graph information, parallelism control, streaming training or variance reduction can make policies unstable at higher loads. Workload shift is a material negative result: at test interarrival time 45 seconds, training on the anti-skewed 75-second workload yields 104.8±37.6 seconds, worse than the heuristic's 91.2±23.5. Mixed-workload training yields 82.3±31.2, or 76.6±33.4 with interarrival-time hints. These are different trained policies, not guaranteed zero-shot robustness. [Accepted pp. 10–11, Figure 14, Table 2]

Appendix H enumerates ten-factorial **job orderings** in a simplified simulator, with fixed critical-path stage selection and no wave, startup or parallelism-slowdown effects. It does not enumerate all schedules or establish a global optimum; Decima can beat this restricted search by about 9%. Appendix I reports scale transfer, but its Table 3 values are slightly worse than matching-scale training: 3,540 versus 3,290 seconds, and 630 versus 610. The nearby prose says “reduced”; the table supports increased JCT in these comparisons. Missing-duration experiments still beat the tested heuristic, without claiming robustness to arbitrary missing information. [Accepted pp. 18–19]

## Limitations

The simulator relies on job profiles and models first-wave costs, JVM migration delays and parallelism-dependent slowdown. Its reported mean runtime errors are within 5% for isolated jobs and 9% for shared workloads, with larger tail discrepancies. These limited fidelity checks do not eliminate simulation-to-system gaps. Fairness, deadlines, tail guarantees and preemption remain future directions; minimizing mean JCT may disadvantage individual large jobs. No convergence to a globally optimal schedule or universal approximation ratio is proved.

Some printing/source differences require care. Pages 5 and 16 give f≈log(x/n), g≈exp(nx) as a max construction; in g(sum f), those transformations are reversed relative to the standard log-sum-exp max approximation. This concerns the illustrative construction, not the existence or measured usefulness of the architecture. Main-text iteration time is about five seconds, whereas Appendix C reports roughly 1.5 seconds on a Xeon E5-2640/P100. Official slides use a 25-second arrival setting and 28% reduction, while the article uses 45 seconds and 29%; these protocols are not merged. The scale-transfer “reduced” wording conflicts with Table 3 as explained above.

## Reproducibility

The complete nineteen-page author-hosted accepted manuscript, including all eighty references and Appendices A–J, was read. The appendices explicitly state that supporting material was not peer reviewed. All 34 official talk slides, 62 extended slides and the one-page poster were also read; key equations, architecture, algorithms, plots and tables were rendered and visually checked. The extended deck's video-adaptation/Park sections describe separate projects, not additional Decima tasks solved by one checkpoint. The ordinary talk video is inventoried but was not watched, and is not counted as a read scientific supplement.

The author arXiv v4 (2019-08-21) was retrieved and compared with the accepted manuscript: pages 5–19 have identical whitespace-normalized text, and the earlier pages differ in copyright/frontmatter and reflow, without identified extra scientific sections. It is retained as an alternate copy, not double-counted as independently read pages. The primary arXiv history establishes v1 on 2018-10-03, distinct from formal SIGCOMM publication on 2019-08-19 confirmed by publisher-deposited metadata. The formal byline has five authors: Meng at Tsinghua and the other authors at MIT CSAIL.

The project links the official simulator repository at commit c010dd74ff4b7566bd0ac989c90a32cfbc630d84 (2019-08-21). Its 515 ZIP members/504 files were inventoried. README training/testing commands and the differential-reward path were checked: train.py subtracts the running reward rate multiplied by elapsed time and uses a piecewise-linear time baseline. The README explicitly says the Spark implementation is being refactored; the simulator release is not evidence of a complete published deployment stack. No training, Spark deployment or historical result was rerun.

Two nested archives contain **154 per-query DAG PDFs and 1,414 per-stage duration plots**. These are raw profiling/data visualizations, not separate article proofs or an independent results appendix. All member names were inventoried and one example from each archive was extracted and visually checked; the remaining raw plots were not individually read. No coverage claim is made for them. The complete scientific explanation and ablations are in the read article and its A–J appendices.
