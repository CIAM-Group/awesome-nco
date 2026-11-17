---
id: tam
short_title: TAM
title: Generalize Learned Heuristics to Solve Large-scale Vehicle Routing Problems in Real-time
authors:
- Qingchun Hou
- Jingwei Yang
- Yiqiang Su
- Xiaoqing Wang
- Yuming Deng
year: 2023
date: '2023'
venue: ICLR
paper_url: https://openreview.net/forum?id=6ZajpxqTlQ
institutions:
- Alibaba Group
scope: specialist
paradigm: constructive
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
summary: A CVRP100-trained attention partitioner groups customers under local and fleet-prior masks, then parallel
  small TSP solvers order each route; large-instance quality, latency and finite-packing feasibility require stated
  conditions.
publication:
  date: '2023'
  source_url: https://iclr.cc/Downloads/2023
figure:
  path: paper-assets/tam/framework.png
  alt: TAM divides a large CVRP into groups with a learned mask, pads training subproblems, solves groups and combines
    routes.
  caption: 'Figure 1: learned partitioning and parallel subroute solving; heuristic reward/feasibility qualifications
    are given in the note.'
  source_url: https://openreview.net/pdf?id=6ZajpxqTlQ#page=2
---

# Generalize Learned Heuristics to Solve Large-scale Vehicle Routing Problems in Real-time

> **TL;DR:** TAM learns to partition CVRP customers into vehicle routes, then independently reorders each route with a small TSP solver. A CVRP100 partitioner transfers to much larger instances under the reported search budgets; quality and feasibility guarantees require qualifications.

## Motivation

Direct neural node-sequence policies trained on small CVRP instances can use too many vehicles and generalize poorly to thousands of customers. TAM separates global customer grouping from within-route ordering, combining a learned partitioner with established small-problem solvers and a prior fleet limit (Sections 1–4).

## Contributions

- Formulate route-set selection and within-route ordering as two stages, with independent subproblems that can be solved in parallel.
- Train the partitioner using costs after subroute reordering rather than its raw node sequence; use a separately trained neural TSP solver and depot padding to batch reward calculation.
- Add an aggregate-demand depot mask intended to constrain vehicle use, and evaluate size/distribution transfer on synthetic CVRP, seven operational cases and CVRPLIB.

## Methodology

**Partition then route.** A modified attention-model encoder/decoder emits customers and depot separators. Customers between separators form a vehicle's group. Each group, together with the depot, becomes a small TSP; LKH3, OR-Tools, HGS or a learned attention model reorders it. The partitioner is neural construction; classical within-group improvement does not make it a learned incumbent-editing method. The full optimization task is CVRP, while TSP is an internal training/subsolver task, rather than evidence of a shared cross-task generalist checkpoint.

**Two-step training.** First train small TSP attention models. Then train the CVRP partitioner with REINFORCE and a greedy-rollout baseline, using the negative sum of reordered subroute lengths as reward. Although Equations 5/18 write an exact minimum, actual training uses a learned TSP heuristic and therefore an approximate cost. Repeated depot nodes pad subproblems for GPU batching. Test-time neural subsolvers use separately trained TSP20/50/100 models chosen by nearby group size. Default inference evaluates ten high-probability partitions with beam search; greedy and random-sampling variants are also reported (Sections 4.5–4.6; Appendix A.3).

**Masks and fleet prior.** Local masks exclude visited or over-capacity customers. A depot return is suppressed when remaining demand exceeds the total capacity of unused vehicles. Synthetic experiments set the fleet limit to ceil(total demand / capacity) + 1. This injects useful global information, but aggregate capacity alone does not ensure that indivisible remaining demands fit available vehicles. See the precise proof qualification below.

## Experiments

- **Training/setup:** 1,280,000 generated CVRP100 instances, 100 epochs, batch 512, learning rate 1e-4 and a three-layer/eight-head encoder; a V100 is specified for training. Test 100 instances at each synthetic size 100/400/1,000/2,000/5,000/7,000. Capacities vary with size: 50/150/200/300/300/300. Appendix training uses a TSP20 reward solver and beam size two; this differs from the stated inference beam size ten. Table 10 reports 78.3 training hours for TAM versus 35.7 for AM; preparation of the small TSP solver is an additional consideration.
- **Synthetic results:** TAM-LKH3 on CVRP2000 reports length 64.78 in 5.63 seconds versus AM 114.36 in 1.87 seconds and full-instance LKH3 64.93 in 20.29 seconds. The cost reduction relative to AM is about **43.4%** using Table 1, rather than an unqualified “over 50%.” At size 7,000 it reports 196.91 in 33.21 seconds versus LKH3 244.97 in 501.26 seconds, about 19.6% lower cost and 6.6% of that runtime. LKH3 and POMO are stronger at CVRP100; LKH3 is also better at CVRP400. HGS not returning a solution in the reported 60-second setup is a budget-specific observation, not general inability (Tables 1, 3, 6–7).
- **Operational cases:** Across seven normalized cases of 680–1,299 customers, Table 2 reports mean cost 21.70 and 6.58 seconds for TAM-LKH3 versus 27.50 and 61.56 seconds for LKH3. LKH3 gives lower costs on the 821- and 817-customer cases. These are selected operational instances, not a broad optimality certificate.
- **CVRPLIB and ablations:** Tables 8–9 report average gaps of 11.04% for TAM-LKH3 and 14.30% for LKH3 over the first 36 rows; individual rows favor either method. The final four rows lack LKH3 results and are outside those averages. The 15,001/16,001-node cases take 166.81/187.48 seconds, so “seconds” should not imply a universal few-second latency. Ablations support the reward/mask primarily at larger sizes; removing the mask slightly improves cost at size 100. Appendix figures are individual examples, not extra aggregate trials.

## Limitations

The authors identify Transformer memory/computation limits and the difficulty of beating strong classical heuristics given hours or days of search. Transfer to other constraints without retraining and to other combinatorial tasks remains future work. A proposed time-window mask is not an evaluated VRPTW solver. Parallel subsolver calls and beam candidates must be included when comparing runtime and hardware budgets.

**Curator proof qualification:** Appendix A.4.1 turns d_max / C approximately zero into the exact packing equality sum(d_i) = C (Equations 28–29). That approximation does not prove finite-instance feasibility. For example, with capacity 100, three vehicles and 299 demands of 1.001, total demand is 299.299 < 300 and each demand is about 1% of capacity, yet each vehicle holds at most 99 customers. The fleet cannot serve all 299, and the aggregate-demand/local-capacity masks can deadlock after the first maximal load. Similar examples can use arbitrarily smaller demand/capacity ratios. This identifies a missing finite packing condition in the general claim; it does not contradict the paper's separate statement that its tested cases were feasible. The authors also describe adding a vehicle in early training when necessary. Appendix A.4.2 supplies a factorization-based explanation of transfer, not a statistical generalization bound.

**Source notation:** Appendix A.1 repeats the incoming-depot equation as both Equations 14 and 15, and Algorithm 3 lists 20/30/50 although its inputs and main text specify TSP20/50/100. Figures 7–8 call the 5,000/7,000 examples “real-world,” while the surrounding experiment describes generated synthetic cases. These inconsistencies are retained as qualifications rather than silently repaired into new results.

## Reproducibility

- **Version:** All 37 pages were freshly read, including the full bibliography, all eleven tables, sixteen figures and Appendix A.1–A.6. A public conference-archive mirror supplies the ICLR 2023 publication-header copy; its matching byline, actual retrieval URL and SHA are recorded. Byte identity to the blocked OpenReview original is not asserted. The [official ICLR 2023 list](https://iclr.cc/Downloads/2023) independently confirms publication.
- **Supplements/code:** Normal OpenReview page/API access is challenged, so a complete external-attachment inventory cannot be asserted. No separate missing scientific supplement or author-maintained code repository was identified. No optimization experiment was rerun; the finite packing arithmetic above was independently checked using exact rational numbers.
- **Evidence:** Figure 1 is reproduced directly from PDF page 2, with its source caption preserved; labels such as “optimal” describe the source diagram and are subject to the heuristic qualifications above. Nineteen exact internal citations are recorded, including distinct author-year versions matched by title rather than copied publication years.
