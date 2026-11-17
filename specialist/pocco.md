---
id: pocco
short_title: POCCO
title: Preference-Driven Multi-Objective Combinatorial Optimization with Conditional
  Computation
authors:
- Mingfeng Fan
- Jianan Zhou
- Yifeng Zhang
- Yaoxin Wu
- Jinbiao Chen
- Guillaume Sartoretti
year: 2025
date: '2026-04-23'
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/10fc83943b4540a9524af6fc67a23fef-Abstract-Conference.html
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/10fc83943b4540a9524af6fc67a23fef-Abstract-Conference.html
institutions:
- National University of Singapore
- Nanyang Technological University
- Eindhoven University of Technology
- Sun Yat-sen University
scope: specialist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
- Packing
problems:
- Multi-Objective Traveling Salesman Problem
- Multi-Objective Capacitated Vehicle Routing Problem
- Multi-Objective Knapsack Problem
summary: POCCO adds sparsely routed feed-forward/identity experts to preference-conditioned
  MOCO decoders and trains reward-ranked solution comparisons; native problems still
  use separate models.
code_url: https://github.com/mingfan321/POCCO
---

# Preference-Driven Multi-Objective Combinatorial Optimization with Conditional Computation

> **TL;DR:** Add a sparsely activated computation block to existing multi-objective neural constructors, and learn from pairs of better and worse scalarized solutions. One model handles preferences within a native problem; the paper does not deploy one shared checkpoint across routing and knapsack.

## Motivation

Different objective weights can favor different solution structures. A fixed dense decoder may lack the capacity to specialize across these scalarized subproblems. POCCO combines conditional computation with pairwise preference learning, using objective-derived comparisons instead of the magnitude of a REINFORCE advantage. Preference labels still require evaluating the numerical objectives (Sections1-3).

## Contributions

The conditional computation optimization (CCO) block combines learned feed-forward experts and a parameter-free identity expert. A router selects a sparse subset for the current decoding context. POCCO-W integrates it into WE-CA, and POCCO-C integrates it into CNH. A Bradley-Terry loss compares length-normalized policy log-likelihoods of reward-ranked trajectories. The authors evaluate two- and three-objective TSP, multi-objective CVRP and bi-objective knapsack, including size/distribution shifts and extensive ablations.

These are task-specific constructive solvers with preference sharing, not a shared neural checkpoint across different native problems. Routing and knapsack models are separately trained. Size generalization within each problem does not change that classification.

## Methodology

The decoder computes a context from preference-conditioned node encodings, the current partial solution and attention. CCO sits after this multi-head-attention context and before action compatibility scores. Its default block has four learned feed-forward experts plus one identity expert, activates the top two, and applies residual/normalization operations. Routing uses the current context at each step, so the selected experts need not remain fixed throughout a trajectory. The experts are computation modules inside a policy, rather than independently trained complete solvers (Section4.2; AppendixC).

For each instance and sampled weight, produce several solutions and rank their scalarized objectives. The comparison score is the average action log-probability, log pi(solution)/trajectory length. The loss is the negative log sigmoid of beta times the winner-minus-loser score. Algorithm1 and the released POMO trainer form pairwise comparisons among multiple rollouts; ties do not supply a winning comparison. Default beta is3.5 for bi-objective tasks and4.5 for tri-objective TSP. There is no separate reference policy in this loss. With different trajectory lengths, ordering average log-probabilities is not equivalent to ordering complete-trajectory probabilities (Equations4-5; AppendicesB-D).

The standard models have six encoder layers, eight attention heads and embedding dimension128. Training uses200 epochs of100,000 instances, batch64 and Adam at3e-4. Mixed-size training covers20-100 nodes for routing and50-200 items for knapsack. Inference evaluates101 bi-objective or105 tri-objective weight vectors. Optional coordinate augmentation uses8 transformations for CVRP,64 for bi-objective TSP and512 for tri-objective TSP. Encoder results can be reused across POMO rollouts for one weight; the preference-conditioned encoder is not one weight-independent encoding reused across every weight (Sections4-5; AppendicesC/F/G).

## Experiments

Tables1-2 compare normalized hypervolume (HV), runtime and reported gaps. WE-CA to POCCO-W improves Bi-TSP100 HV0.7034鈫?.7055, and with augmentation0.7066鈫?.7078. WS-LKH remains higher at0.7090; its reported runtime is6hours versus14minutes for POCCO-W-Aug. For CVRP100 the corresponding values are0.4068鈫?.4084, or0.4081鈫?.4089 with augmentation. Tri-TSP100 improves0.4975鈫?.4985, or0.5035鈫?.5048 with augmentation, while WS-LKH reaches0.5076. Tri-objective augmentation costs about2hours. These are reference-point-dependent set metrics, not exact optimality certificates.

The prose says gaps are relative to POCCO-W, but the table values use POCCO-W-Aug: for example0.7055 versus0.7078 yields the displayed0.32% gap. Improvements are not universal. Augmentation reduces Bi-TSP20 HV0.6275鈫?.6270; EMNH-Aug slightly exceeds POCCO-W-Aug on CVRP20; EMNH and POCCO-C reach0.4535 on KP100 versus POCCO-W0.4534. The paper discusses the augmentation quality/diversity trade-off (Section5).

Tests cover KroAB coordinates and larger sizes. Bi-TSP200 HV improves0.7346鈫?.7371 without augmentation and0.7381鈫?.7399 with it; WS-LKH remains0.7490. Additional Bi-TSP300/500/1000 results favor POCCO-W over WE-CA. Additional KP300 is an exception,0.6000鈫?.5947, whereas KP500/1000 improve. Normalization references for these largest added sizes are not fully enumerated in Table4, so raw HV across sizes should not be treated as directly comparable (AppendicesI/J).

The first five training batches show substantially lower measured gradient variance for preference learning than the tested REINFORCE setup, e.g.10.124832 versus0.000059 on TSP100. This is an empirical comparison, not a universal variance theorem. A DPO-style comparator updates its reference from the previous epoch and takes122hours versus36 for POCCO; it narrowly wins TSP20 while losing at larger tested sizes. Two CCO layers yield slightly higher HV than one, but take59seconds versus36 on TSP100 and5.6minutes versus2.4 on TSP200. The five-expert default is a cost/quality choice, not the best HV in every expert-count ablation (AppendicesB/K/L).

Scalarized gaps in Table13 use LKH as the reference, not proven optima. POCCO-W-Aug gaps at weights(1,0),(.5,.5),(0,1) are0.25%,0.79%,0.24%; POMO-Aug is better for the middle weight at0.77%. WS outperforms the tested Tchebycheff variant, without proving complete Pareto-front recovery. Memory is material: on size50 CVRP, POCCO-W uses4522MB versus WE-CA1790MB; on knapsack2417MB versus916MB. Parameter counts are2.00M versus1.47M, or2.16M versus CNH1.63M (AppendicesM-P).

## Limitations

Preference sharing and sparse expert activation do not guarantee coverage of unsupported Pareto points, feasibility for new constraints, global optimality or transfer across native tasks. Test-time augmentation and many preference queries add substantial work. The authors identify more complex real-world constraints and scalability as future directions. Claimed energy benefits in the broader-impact discussion are qualitative; no energy measurement is supplied.

### Curator Analysis

AppendixB correctly differentiates the fixed-sample comparison loss. Its bounded sigmoid multiplier and length normalization do not alone prove lower gradient variance than every REINFORCE formulation: scaling a reward and its baseline by epsilon scales that estimator's variance by epsilon squared while preserving hard preference labels. This limits the universal interpretation, without contradicting Table3's measured comparison or the useful empirical results. No general convergence or approximation-ratio theorem is established; the checklist marks new theoretical results as not applicable.

Figure5 labels a knapsack plot Bi-KP100 but its HV scale near0.360 differs from Table1's KP100 value0.4534. The intended plotting protocol/size is not resolved by the article, so those plot values are not used as verified KP100 benchmark results.

## Reproducibility

- All34 pages of the [formal NeurIPS2025 article](https://proceedings.neurips.cc/paper_files/paper/2025/file/10fc83943b4540a9524af6fc67a23fef-Paper-Conference.pdf) were read, including70 references, the checklist and scientific AppendicesA-R. The publisher metadata gives April23,2026 as the publication date and DOI10.52202/085713-0389, separately from the2025 conference label. Publisher author spelling is retained; the PDF expands the last author's middle name to Adrien.
- The publisher's [supplemental ZIP](https://proceedings.neurips.cc/paper_files/paper/2025/file/10fc83943b4540a9524af6fc67a23fef-Supplemental-Conference.zip) has two members: the nine-page scientific `POCCO_Appendix.pdf`, read completely, and a1010-byte AppleDouble metadata file with a misleading `.pdf` suffix. The real appendix overlaps the integrated material but is a different, earlier appendix layout; it was not skipped. Both OpenReview exact-title notes queries returned403. No explicitly missing scientific document was found. Eight formal and four supplemental pages were visually inspected.
- The [official code](https://github.com/mingfan321/POCCO) was inspected at `79fa144be4383826a359b00c45dcbe0408ad2232`. The275-file tree contains no additional PDF/ZIP and38 PT/PTH data/model files. Full README files and the140-line TSP training entry were read, plus trainer lines206-293 and expert/router lines144-218,281-322,361-425. This is selected implementation inspection, not a claim to have read all code.
- The current entry enables debug mode, disables CUDA and supplies a local pretrained model path. Debug reduces training to two epochs/ten episodes/batch4; those defaults require adjustment for the paper protocol. Actual sampled routing sizes have weights proportional to n-19 rather than uniform weights. The trainer uses all POMO pairs, average token log-probabilities and beta3.5; its auxiliary load-balancing-loss addition is commented out. Training-time routing includes Gaussian noise while evaluation uses clean scores. No training or benchmark was rerun. 20 exact existing-paper references are recorded; the paper's BOPO reference is not the distinct ICML paper by Pan et al.
