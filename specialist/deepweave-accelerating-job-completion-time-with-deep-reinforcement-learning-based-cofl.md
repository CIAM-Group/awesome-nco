---
id: deepweave-accelerating-job-completion-time-with-deep-reinforcement-learning-based-cofl
short_title: DeepWeave
title: 'DeepWeave: Accelerating Job Completion Time with Deep Reinforcement Learning-based Coflow Scheduling'
authors:
- Penghao Sun
- Zehua Guo
- Junchao Wang
- Junfei Li
- Julong Lan
- Yuxiang Hu
year: 2020
date: 2020-07
publication:
  date: 2020-07
  source_url: https://www.ijcai.org/proceedings/2020/458
venue: IJCAI
paper_url: https://www.ijcai.org/proceedings/2020/458
institutions:
- National Digital Switching System Engineering & Technological R&D Center
- Beijing Institute of Technology
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Scheduling
problems:
- DAG-Aware Coflow Scheduling
summary: Policy-gradient training learns a graph-conditioned coflow priority list, translated by a hand-designed
  port scheduler; simulation results concern DAG-aware coflow scheduling, with fixed-size padded policy inputs and
  incomplete reward/protocol specification.
figure:
  path: paper-assets/deepweave-accelerating-job-completion-time-with-deep-reinforcement-learning-based-cofl/framework.png
  alt: A graph neural network and policy network produce priorities, translated by a policy converter and evaluated
    by a simulator.
  caption: 'Original Figure 3: the DeepWeave reinforcement-learning framework.'
  source_url: https://www.ijcai.org/proceedings/2020/0458.pdf#page=3
---

# DeepWeave: Accelerating Job Completion Time with Deep Reinforcement Learning-based Coflow Scheduling

> **TL;DR:** DeepWeave uses a GNN and policy-gradient learning to rank correlated coflows in a job DAG. A classical converter schedules their constituent flows at switch ports. Simulations report shorter job completion times than four coflow baselines, but the article leaves reward signs, dataset splits and several scheduling details unspecified.

## Motivation

Coflows group semantically related flows in a distributed computation. Optimizing each coflow independently can overlook the dependencies of a multi-stage job. The paper models computation stages as vertices and coflows as edges, seeking priorities that reduce job-level completion time. Communication occurs through a nonblocking fabric with equal-capacity ingress and egress ports; computation costs are treated as constant. This is a specific scheduling model, rather than a general network-routing optimizer. [Formal pp. 1–3]

## Contributions

- Combines descendant-to-ancestor graph aggregation, a job-level summary and a feedforward policy network to produce coflow priorities.
- Trains with parallel episodic policy gradients and a cross-agent return baseline, borrowing short-episode training from Decima.
- Converts learned priorities into port-level flow scheduling with a largest-flow-first heuristic.
- Tests completion time, deadline misses and architecture variants in trace/query-driven and synthetic simulations. [Formal pp. 3–6, Algorithms 1–2]

## Methodology

The job DAG includes Starts-After and Finishes-Before dependency types. Node features include computation cost. Graph attributes recursively aggregate descendant attributes using two small feedforward functions f and g, each with two hidden layers; another network computes a job summary. Sorted node attributes and the summary enter a one-hidden-layer policy network. Its input size is fixed to the largest DAG expected in the experiments, with zero padding for smaller graphs. Thus the GNN's variable-size aggregation does not imply an unbounded-size policy head. [Formal pp. 2–4, Figures 2–4]

The action is a priority list. The converter assigns a coflow the priority of its source node, assuming one outgoing edge per such node. Algorithm 2 selects the highest-priority coflow, gives its largest flow the highest remaining ingress priority, and schedules other flows sharing the selected egress to align completion times. Egress scheduling is described as similar. This is neural priority construction followed by classical scheduling, not neural improvement of an incumbent solution. It is **specialist / constructive**: different DAG shapes and sizes remain the same native coflow problem. [Formal pp. 4–5]

Algorithm 1 accumulates score-function gradients using returns minus a cross-agent baseline; Adam uses learning rate 0.001. The article describes the reward as job completion time while also maximizing accumulated reward and printing a plus-sign policy update. It does not state the negative-time transformation or equivalent minimization convention. The prose says episode lengths grow, but Algorithm 1 places the reset to l_init inside the outer loop. These are specification ambiguities in the printed method; the review does not infer an unreported implementation or claim that experiments optimized the wrong direction. [Formal pp. 3–4]

## Experiments

The Python 3.6 simulator and TensorFlow policy run on an Intel i7-7700-class desktop, GTX 1080 Ti and 32 GB RAM. Training uses 60,000 iterations. Comparators are Varys, Approximate, Sincronia and IAOA. Their cited approximation factors apply to their respective coflow formulations, not to DeepWeave or automatically to the paper's dependent job objective. [Formal p. 5]

Completion-time experiments use TPC-DS queries generated with Shark, with one wave per computation stage and critical-path lengths four to seven. The text says each DAG contains five queries. Figure 5 normalizes each comparator's mean JCT to DeepWeave; the best comparator is reported at least 1.7 times DeepWeave's JCT, and at length seven all are at least twice its JCT. This is a ratio of simulated completion times in these configurations, not an inference speedup or universal approximation bound. No raw times or exact uncertainty calculation are supplied. [Formal pp. 5–6]

Deadline experiments generate twenty fan-in/fan-out GGen DAGs per size from 4 to 64 vertices, with fifty ingress and fifty egress ports. CoflowSim generates coflows. Deadlines are fine-tuned per DAG to distinguish methods, so the miss rate is conditional on that chosen deadline protocol. Figure 6 reports the learned method as best; its legend labels that curve “Autoflow”, although the body calls it DeepWeave. Architecture ablations in Figure 7 compare one/three-layer graph functions, deeper policy heads and removal of the summary; their normalized JCTs are worse in the plotted settings. Deeper graphs are attributed to overfitting, without a separate statistical diagnosis. [Formal p. 6]

## Limitations

The p. 3 formulation calls the target job transmission time but writes a sum of individual coflow durations C_i=End(e_i)−Start(e_i); this is not generally the job's last-finish completion time. The note retains that distinction rather than silently replacing the authors' objective. Reward direction, episode growth, maximum supported DAG size, train/test split, random seeds, test sample counts for the JCT plot, training duration and inference overhead are incompletely specified. Baseline comparisons may reflect treatment of dependencies as well as the learned ranking.

The equal-port, nonblocking fabric, constant computation times, source-node-to-coflow priority mapping and hand-designed flow converter restrict applicability. Shorter JCTs do not constitute a feasibility proof for arbitrary DAGs, an approximation ratio, guaranteed monotonic policy improvement or operational deployment evidence. No multi-problem checkpoint is reported.

## Reproducibility

All seven formal pages, both algorithms, equations and complete references were read. The architecture, scheduling algorithm and all three result plots were rendered and visually checked; the framework image is an original Figure 3 crop. The publisher page and its full link inventory expose the formal PDF and the cited CoflowSim simulator, with no separately named scientific appendix. No same-paper arXiv version, official DeepWeave implementation or pretrained weights were identified through the primary proceedings/author entry and exact-title public searches. CoflowSim is a third-party simulator, not DeepWeave code; no solver-code link is invented.

The formal byline has six authors. Guo is affiliated with Beijing Institute of Technology and the other authors with the National Digital Switching System Engineering & Technological R&D Center. Publisher BibTeX and publisher-deposited Crossref agree on July 2020, retained at month precision; Crossref's record-creation day is not used as the publication day. No training, simulation or historical checkpoint was independently rerun.
