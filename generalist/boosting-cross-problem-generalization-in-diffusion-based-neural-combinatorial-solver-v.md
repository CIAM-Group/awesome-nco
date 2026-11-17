---
id: boosting-cross-problem-generalization-in-diffusion-based-neural-combinatorial-solver-v
short_title: DIFU-Ada
title: Boosting Cross-problem Generalization in Diffusion-Based Neural Combinatorial Solver via Inference Time Adaptation
authors:
- Haoyu Lei
- Kaiwen Zhou
- Yinchuan Li
- Zhitang Chen
- Farzan Farnia
year: 2026
date: '2025-02-15'
publication:
  date: '2026-03-14'
  source_url: https://ojs.aaai.org/index.php/AAAI/article/view/40948
venue: AAAI
paper_url: https://ojs.aaai.org/index.php/AAAI/article/view/40948
institutions:
- The Chinese University of Hong Kong
- Huawei Noah’s Ark Lab
scope: generalist
paper_type: solver
paradigm: constructive
problem_families:
- Routing
problems:
- TSP
- PCTSP
- OP
summary: Frozen TSP diffusion checkpoints transfer to PCTSP and OP through energy-guided sampling and recursive
  partial renoising, without target-task training; empirical gains have latency, classical-baseline and printed-theory
  qualifications.
arxiv_url: https://arxiv.org/abs/2502.12188
figure:
  path: paper-assets/boosting-cross-problem-generalization-in-diffusion-based-neural-combinatorial-solver-v/framework.png
  alt: Original Figure1 depicts frozen TSP diffusion, guided denoising and repeated renoising for transfer to PCTSP.
  caption: Original Figure1 and full caption from the read extended author version; its reported PCTSP20 example
    compares19.21% with4.20% gap.
  source_url: https://arxiv.org/pdf/2502.12188v4#page=2
---

# Boosting Cross-problem Generalization in Diffusion-Based Neural Combinatorial Solver via Inference Time Adaptation

> **TL;DR:** DIFU-Ada reuses frozen TSP-trained diffusion checkpoints for PCTSP and OP. Problem-specific energy guidance and repeated partial renoising adapt the sampling process without target-task training. This is demonstrated cross-problem reuse, with latency, classical-solver and theoretical qualifications.

## Motivation

Training a separate neural solver for each routing objective or constraint is expensive. DIFU-Ada asks whether a diffusion prior trained only on TSP can retain useful geometric structure while changing its inference-time energy to solve prize-collecting and budget-constrained routing tasks. [pp. 1–3]

## Contributions

- Add objective/constraint guidance to a pretrained discrete graph diffusion sampler without updating network weights.
- Combine guidance with recursive partial renoising and denoising to move away from the source-task solution distribution.
- Evaluate zero-shot transfer from TSP to PCTSP and OP, including transfer across instance sizes, and analyze structural connections between their tours. [pp. 4–8; Appendices C–F]

## Methodology

A pretrained anisotropic GNN predicts binary edge heatmaps during categorical reverse diffusion. Gradients of the target problem's energy modify sampling; partial forward noising and guided reverse steps repeat before greedy decoding constructs a tour. The experiments use **100 recursive iterations**, each described as **five renoising steps and one guided denoising step**, guidance coefficient 0.1 and constraint coefficient 1, on one Tesla V100. Optional 2-opt/MCTS are discussed, but the reported common decoder is greedy. [pp. 4–8, 15]

The classification is **generalist/constructive**: the identified TSP-trained DIFUSCO checkpoints are reused without target-task training on both PCTSP and OP. There are separate source checkpoints for different training scales; this does not assert that one checkpoint is the only model used for every table. Repeated updates to a noisy latent heatmap do not establish an additional neural incumbent-tour improvement policy. [pp. 6–8, 15]

## Experiments

The main protocol generates 10,000 test instances per task/size at 20, 50 and 100 nodes. Gurobi supplies references at size 20; larger PCTSP/OP references use ILS/Compass heuristics, so their reported gaps are not universally certified optimality gaps. Table 1 compares scale-matched zero-shot transfer, while Tables 2–3 additionally study cross-scale transfer and should not be conflated. [Tables 1–3; Appendix B]

In Table 1, PCTSP-20 gap changes from DIFUSCO's 19.21% to 4.20%, with time increasing from 1.04 to 1.72 seconds. OP-100 gap changes from 20.02% to 8.06%, with time increasing from 2.04 to 2.91 seconds. Across-scale average gaps in Tables 2–3 are 9.70% for PCTSP and 7.26% for OP. ILS and Compass remain substantially stronger in solution quality in those tables; target-task learning baselines and copied timings also have different training/hardware budgets. “Training-free” means no **additional target-task** training, not that the source diffusion prior was trained at no cost. [pp. 8–11, 15]

Appendix F uses 128 instances for PCTSP-500/1000. DIFU-Ada costs 14.5/21.7 in 6.6/8.1 minutes, versus GLOP-S 14.3/19.8 in 1.5/2.5 minutes. Table 5's cross-scale TSP results are generally weaker than Fast T2T. Figures 3–6 show the iteration/time tradeoff and sensitivity to energy-guidance settings. [pp. 9–10, 18–21]

## Limitations

- Cross-problem experiments cover closely related routing tasks. Appendix E's TSP with time windows transformation is a conceptual extension, without a corresponding empirical result or a general feasibility/convergence guarantee.
- The main setup gives GNN hidden width **256**, while Appendix B gives **128**. Appendix B also describes a PCTSP maximum-tour-length setting without completely resolving the prize/penalty-generation protocol. These details require clarification for exact reproduction.
- In the read v4, the printed logarithmic barrier uses `log(-g)` while defining `g` as zero for feasible points and positive for violations. This is outside the real logarithm's domain. Equation 13 also subtracts a score defined earlier as a log-density gradient. These are qualifications of the printed equations; an uninspected implementation must not be silently substituted to repair them.
- Appendix C's PCTSP argument removes the minimum-prize constraint. Its OP proof additionally assumes uniform prizes and equates maximizing visited-node count with maximizing feasible tour length; monotonicity of TSP cost does not justify that equivalence. A depot at 0, nodes at −0.1, −0.2, −0.3 and 0.9, and budget 1.8 give three reachable nearby prizes at tour length 0.6, while the longest feasible tour visits only the far node at length 1.8. This curator counterexample concerns the printed proof, not the reported experiments.
- Appendix D's weighted/directed graph transformation and additional constraints do not by themselves prove that a frozen Euclidean-TSP diffusion prior remains calibrated, or that guided sampling is globally optimal.

## Reproducibility

Read all **21 pages** of [arXiv v4](https://arxiv.org/pdf/2502.12188v4), including complete references and scientific Appendices A–F; inspected every figure/table and cropped original Figure 1 with its caption. The formal PDF download returned HTTP 520 in this environment and was not counted as a read source. The [AAAI publisher record](https://ojs.aaai.org/index.php/AAAI/article/view/40948) and publisher-deposited DOI metadata establish the five authors, pages 36289–36297, and formal publication **2026-03-14**. The actual [arXiv history](https://arxiv.org/abs/2502.12188) gives v1 **2025-02-15** and read v4 **2026-03-11**, with intervening title revisions in the same version chain.

The complete scientific appendices are present in the read copy. No paper-specific public implementation or separate scientific supplement was established from its links and targeted source searches, so no Code link is invented. A finite enumeration of the OP proof example is stored with the review evidence; model training and benchmark tables were not reproduced. Internal citation edges use actual body mentions and matching full references; bibliography reference 7's year 2024 is explicitly mapped to the identically titled NeurIPS 2023 T2T article.
