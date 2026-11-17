---
id: lehd
short_title: LEHD
title: 'Neural Combinatorial Optimization with Heavy Decoder: Toward Large Scale Generalization'
authors:
- Fu Luo
- Xi Lin
- Fei Liu
- Qingfu Zhang
- Zhenkun Wang
year: 2023
date: '2023-10-12'
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/1c10d0c087c14689628124bbc8fa69f6-Abstract-Conference.html
arxiv_url: https://arxiv.org/abs/2310.07985
code_url: https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/LEHD
institutions:
- Southern University of Science and Technology
- City University of Hong Kong
scope: specialist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Traveling Salesman Problem
- Capacitated Vehicle Routing Problem
summary: A light encoder and dynamic heavy decoder construct routes; the same neural policy then reconstructs incumbent
  segments with accept-improving Random Re-Construct search.
figure:
  path: paper-assets/lehd/framework.png
  alt: LEHD architecture with a single-layer light encoder and a multi-layer heavy decoder.
  caption: 'Figure 1: Light-encoder and heavy-decoder architecture of LEHD.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=4
publication:
  date: '2023-12-15'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2023/hash/1c10d0c087c14689628124bbc8fa69f6-Abstract-Conference.html
---

# Neural Combinatorial Optimization with Heavy Decoder: Toward Large Scale Generalization

> **TL;DR:** LEHD encodes an instance with one attention layer, then repeatedly models the current endpoints and remaining nodes with a six-layer decoder. Supervised partial-route training supports size transfer. Its strongest results add Random Re-Construct (RRC), which uses the neural policy to rebuild incumbent segments and keeps improvements; this is substantive construction plus improvement.

## Motivation

Attention routing models commonly put most computation in a static encoder. Relations learned on small graphs can transfer poorly to larger graphs. LEHD shifts capacity into a decoder that recomputes relations among the currently available nodes at every decision. Because full-rollout reinforcement learning is costly with this architecture, the main training scheme learns from supervised route fragments of varying length and direction. [Sections 1-2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=1)

## Contributions

- Introduces a one-attention-layer encoder and a multi-layer decoder that dynamically re-embeds the two endpoints and available nodes.
- Trains on sampled teacher-route fragments instead of requiring a full policy rollout before each reward signal.
- Proposes **Random Re-Construct**: repeatedly rebuild a randomly selected segment of an existing solution and replace it only if route cost decreases.
- Evaluates size-100-trained TSP/CVRP policies up to size 1,000 and on TSPLIB/CVRPLIB; the integrated appendices also explore poor labels, direct RL and solver-free self-improved training. [Sections 3-6 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=3)

## Methodology

### Light encoder, heavy dynamic decoder

Input features are linearly embedded, then processed once by a single attention layer. At every decoding decision, learned role projections distinguish the current node and fixed destination; their embeddings are concatenated with embeddings of all available nodes. Six attention layers recompute their relations before a linear projection and masked softmax choose the next action. Previously visited irrelevant nodes are removed from this decoder input. The initial light-encoder embeddings are cached, while heavy-decoder representations are recomputed, unlike a fully static encoder/light-decoder design. [Section 3 and Appendix C.2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=4)

The embedding size is 128, with eight heads and feed-forward dimension 512. Residual attention/feed-forward blocks omit normalization. For TSP, features are coordinates and the output scores one available node. For CVRP, features include normalized demand, remaining capacity is added to endpoint embeddings, and two output scores per customer represent visiting directly or via the depot. This yields a fixed customer-step sequence despite a variable number of subtours. Separate TSP and CVRP models are trained; one checkpoint across tasks is not demonstrated. [Sections 3/6 and Appendix D.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=17)

### Learning route fragments

The main datasets contain one million size-100 instances per task. Concorde supplies TSP optima; HGS supplies high-quality CVRP solutions, which are heuristic labels rather than uniformly certified optima. A contiguous segment with length sampled from 4 through the instance size and a random direction supplies the supervised training target. Its first/last nodes specify the reconstruction endpoints; CVRP fragments must end at the depot. Cross-entropy trains sequential choices under the teacher route. The optimal-subpath motivation is exact for optimal teachers; fragments from heuristic CVRP labels remain heuristic demonstrations. [Section 4 and Figure 2.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=5)

Both models use Adam, batch size 1,024 and initial learning rate `1e-4`. TSP trains 150 epochs with decay `0.97` per epoch; CVRP trains 40 epochs with decay `0.9`. Training and neural testing use one RTX3090 GPU with 24 GB memory. Instances are uniform Euclidean graphs; CVRP demands are uniform integers 1-9 and capacities are 50/80/100/250 for 100/200/500/1,000 customers. [Section 6 and Appendix D.1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=7)

### Initial construction and neural improvement

For greedy TSP inference, one randomly chosen node serves as both the initial current node and fixed destination. The decoder visits the remaining nodes one by one. **RRC** then samples a segment of the incumbent route with random endpoints/direction, reconstructs it with the same neural model and accepts only a lower-cost replacement. Iteration count is an explicit quality/computation budget. This changes the incumbent solution without updating network parameters; it is different from EAS-style test-time parameter adaptation. [Sections 4.3-5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=6)

The paper calls its architecture constructive, but its proposed full solver includes both neural initial construction and neural incumbent improvement. The repository therefore classifies LEHD as **specialist / constructive-improvement**, while retaining the greedy-only results as a distinct configuration.

## Experiments

### Main uniform TSP/CVRP results

Table 1 evaluates 10,000 size-100 instances and **128 instances at each larger size** of 200, 500 and 1,000. Times are dataset totals, not per-instance latency. TSP gaps use Concorde optima; CVRP gaps use LKH3 heuristic references. Classical solver CPU times and neural GPU times are not directly hardware-matched. Att-GCN+MCTS numbers are imported; BQ is independently retrained/reproduced by the LEHD authors, so these rows should not be silently substituted for BQ's original-paper results. [Section 6 and Table 1.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=7)

| Configuration | TSP100 gap / time | TSP1000 gap / time | CVRP100 gap / time | CVRP1000 gap / time |
| --- | --- | --- | --- | --- |
| Greedy | 0.577% / 0.4 min | 3.168% / 1.6 min | 3.648% / 0.5 min | 4.912% / 1.6 min |
| RRC100 | 0.0114% / 13.7 min | 1.218% / 43 min | 0.272% / 17 min | 2.370% / 45 min |
| RRC500 | 0.0025% / 1.1 h | 0.818% / 3.5 h | -0.044% / 1.4 h | 1.270% / 4 h |
| RRC1000 | 0.0016% / 2.2 h | 0.719% / 7 h | -0.112% / 2.8 h | 0.921% / 8 h |

At size 1,000, the reproduced BQ beam-16 gaps are 2.605% for TSP and 7.784% for CVRP. LEHD's initial CVRP100 greedy gap is worse than BQ greedy's 2.993%; reconstruction drives the strongest outcomes. With RRC500, CVRP200/500 gaps are -0.246%/-0.107% relative to LKH, while HGS is still stronger at -1.126%/-1.794%; HGS also reaches -2.162% for CVRP1000. Negative CVRP gaps mean improvement over LKH, not a certified optimum. The large-scale near-optimal wording must therefore be read together with its reference solver and hours of reconstruction. [Table 1, PDF p. 8.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=8)

### Benchmark instances and controlled studies

Table 2 covers **70 TSPLIB instances** through 4,461 nodes and **192 CVRPLIB instances** in groups A/B/E/F/M/P/X, without extra constraints such as time windows. RRC uses 1,000 iterations. Aggregate greedy/RRC gaps are 5.260%/1.529% for TSPLIB and 9.465%/2.253% for CVRPLIB. The above-1,000 TSPLIB group remains at 4.088% after reconstruction. The aggregate table supplies no corresponding benchmark runtimes. These are empirical transfer results from separate task models, rather than general guarantees for arbitrary routing constraints. [Table 2 and Appendix E.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=8)

Training POMO with the same supervised approach still gives TSP1000 gap 34.419% versus LEHD greedy 3.168%, supporting an architectural contribution. A fixed-budget TSP50 RL-versus-SL study favors SL but does not prove RL is impossible. The reconstruction study uses a **different dataset count**: 10,000 instances at sizes 100/200, 1,000 at 500/1,000. On that study's 1,000 TSP1000 instances, RRC1000 takes 57 hours for 0.735%, versus seven hours for the main table's 128 instances. [Tables 3-5.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=9)

Removing normalization improves LEHD TSP1000 from 12.209% with batch normalization and 222.730% with instance normalization to 3.168%. POMO normalization variants remain weak, supporting the authors' view that normalization is not the sole explanation. Imported H-TSP/SO comparison timings and their solver configurations are separate from the controlled architecture ablations. [Appendix A and Tables 6-9.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=10)

### Extra training evidence in the integrated appendices

Appendix B materially qualifies the main conclusion's statement that LEHD can only be properly trained with SL:

- **Poor teachers:** 100,000 CVRP100 OR-Tools labels and ten SL epochs take about 1.25 hours. Relative to **HGS** in this table, the OR-Tools teacher is 6.762%; LEHD greedy is 10.428%, but RRC500 improves to 2.525% in 1.4 hours. This demonstrates improvement beyond those teachers with added inference, not equal-cost teacher dominance.
- **Direct RL:** 40 epochs of 100,000 TSP20 instances take roughly nine hours. The policy has 0.274% greedy gap on TSP20 and 5.463% when transferred to TSP100; TSP100 RRC500 reaches 0.740% in 1.1 hours for 10,000 tests.
- **Self-improved LEHD-SI:** an RL seed produces labels for 200,000 TSP100 instances using RRC, followed by supervised refinement. The stated 40 RL/185 SL epochs cost 2.7 days without an external labeling solver. On the larger-count dataset, LEHD-SI+RRC200 reaches TSP1000 gap 1.721% in 10.5 hours, versus 4.523% greedy. This experiment is for TSP, not a demonstration of the entire procedure on CVRP.

[Appendix B, Tables 10-12, PDF pp. 14-16.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=14)

## Limitations

### Reported by the Authors

- The heavy decoder makes full-rollout RL expensive and slow to converge. Efficient training and more efficient reconstruction remain research directions; Appendix B nevertheless demonstrates feasible small-scale RL/self-improvement configurations.
- The best solutions require repeated reconstruction, with a user-selected runtime budget. [Section 7 and Appendix B.](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf#page=10)

### Curator Notes

- The proposed solver includes a learned improvement phase. Reporting RRC quality as one-shot greedy construction obscures its principal computation budget.
- HGS/LKH labels and comparisons are heuristic for CVRP. Fixed-budget empirical improvements supply no global optimality certificate.
- Network parameters stay fixed during ordinary RRC. Self-improved **training**, neural incumbent reconstruction and EAS parameter adaptation are different mechanisms.
- The separate publisher Supplemental file is an earlier, line-numbered appendix version with different numbering and some differing figure labels. For example, X-n1001-k43 is labeled 3.1% there versus 2.9% in the integrated main-PDF figure. Numerical summaries above follow the integrated main PDF's tables, rather than mixing versions.

## Reproducibility

- **Reading sources:** the complete [20-page publisher main PDF](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Paper-Conference.pdf), including integrated Appendices A-F, and the separately linked [eight-page Supplemental PDF](https://proceedings.neurips.cc/paper_files/paper/2023/file/1c10d0c087c14689628124bbc8fa69f6-Supplemental-Conference.pdf) were read. The latter includes two additional route illustrations (pr1002 and X-n561-k42), which were also visually examined. The official page lists one separate Supplemental attachment; both its science and the expanded main appendices were checked.
- **Metadata:** formal NeurIPS 2023 publication and all five authors/two institutions are confirmed by the title page and proceedings. [ArXiv history](https://arxiv.org/abs/2310.07985) confirms first submission on 12 October 2023. A generic conference notification date was removed from individual acceptance metadata.
- **Official implementation:** [CIAM-Group/NCO_code, LEHD directory](https://github.com/CIAM-Group/NCO_code/tree/main/single_objective/LEHD), explicitly linked on the title page. Its README specifies Python/PyTorch dependencies and the dataset mirrors/formats for TSP and CVRP. This document audit did not rerun the experiments or certify every supplementary training configuration in the released code.
- **Audit locators:** main pp. 4-6 for model/fragment/RRC definitions; pp. 7-10 for complete protocols and Tables 1-7; pp. 14-17 for normalization, all extra training methods and CVRP details. The displayed original Figure 1 is rendered from PDF p. 4 with its previously clipped bottom labels restored.
