---
id: mtl-kd
short_title: MTL-KD
title: 'MTL-KD: Multi-Task Learning Via Knowledge Distillation for Generalizable Neural Vehicle Routing Solver'
authors:
- Yuepeng Zheng
- Fu Luo
- Zhenkun Wang
- Yaoxin Wu
- Yu Zhou
year: 2025
date: 2025-06-03
venue: NeurIPS
paper_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/899c6a43b9976e1077522fe5a39cafa3-Abstract-Conference.html
code_url: https://github.com/CIAM-Group/MTLKD
arxiv_url: https://arxiv.org/abs/2506.02935
institutions:
- Shenzhen University
- Southern University of Science and Technology
- Eindhoven University of Technology
scope: generalist
paradigm: constructive-improvement
problem_families:
- Routing
problems:
- Capacitated Vehicle Routing Problem
- Open Vehicle Routing Problem
- Vehicle Routing Problem with Backhauls
- Vehicle Routing Problem with Time Windows
- Vehicle Routing Problem with Duration Limits
summary: Six task-specific POMO teachers distil a shared heavy-decoder routing student; greedy route construction
  and learned R3C incumbent reconstruction are evaluated separately across six trained and ten unseen variants.
publication:
  date: '2026-04-23'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/hash/899c6a43b9976e1077522fe5a39cafa3-Abstract-Conference.html
figure:
  path: paper-assets/mtl-kd/framework.png
  alt: Six separate RL teacher policies distil next-action distributions into one shared student.
  caption: 'Figure 1: teacher pretraining and multi-task student distillation; original formal NeurIPS figure.'
  source_url: https://proceedings.neurips.cc/paper_files/paper/2025/file/899c6a43b9976e1077522fe5a39cafa3-Paper-Conference.pdf#page=4
---

# MTL-KD: Multi-Task Learning Via Knowledge Distillation for Generalizable Neural Vehicle Routing Solver

> **TL;DR:** Six separately trained POMO teachers distil next-action distributions into one light-encoder/heavy-decoder student. The student constructs routes and can also improve existing routes through the paper's Random Reordering Re-Construct (R3C) procedure. Results distinguish single-trajectory decoding from 200 reconstruction iterations.

## Motivation

Heavy decoders repeatedly re-encode the remaining routing problem and can generalize better across instance sizes, but are expensive to train with trajectory-based reinforcement learning. MTL-KD replaces expert solution labels with online supervision from task-specific RL teachers. “Label-free” here means avoiding an externally labelled solution dataset; it does not remove teacher training or teacher-generated supervision. [pp. 1–4]

## Contributions

- Distils six specialist teachers into a shared student over CVRP, OVRP, VRPB, VRPL, VRPTW and OVRPTW; ten other constraint combinations are unseen during student training.
- Adds dynamic vehicle features and padding/feasibility masks to a multi-task light-encoder/heavy-decoder architecture.
- Introduces R3C: permute the external order of subtours, sample a contiguous segment ending at a depot, reconstruct it with the learned model, and replace the incumbent segment if its cost improves. Feasible reversals provide an additional optional perturbation. [pp. 3–7, 21–22]

## Methodology

Train each POMO teacher independently using REINFORCE and its shared multi-start baseline. During student training, generate batches covering all six tasks. The student samples the next action; the corresponding teacher supplies its action distribution at that same state. Minimize KL(teacher ∥ student) over the feasible next-node distributions, then advance the student trajectory. The current implementation updates parameters at individual decoding steps, rather than backpropagating an entire sampled route. [pp. 3–4; released `Trainer.py`]

The student has one encoder Transformer layer and six decoder layers. At each decision it combines unvisited-node embeddings with last-node/depot embeddings and current load, time, route-duration and open-route features. Padding handles unequal remaining-node counts; explicit feasibility masks remove invalid actions. The evaluated embedding widths 96 and 128 are separate models. Layer normalization is removed from the attention architecture. [pp. 5–7]

**Classification:** Generalist / constructive–improvement. Six native tasks share the student parameters; ten unseen combinations test zero-shot task transfer. Greedy decoding constructs a solution, whereas the paper's own learned R3C reconstructs and replaces parts of a complete incumbent. Backhaul demand is signed and the main text explicitly allows interleaving delivery/pickup nodes; this is not paired pickup-and-delivery with request precedence. [pp. 2, 6–7, 21–22]

## Experiments

| Stage | Reported budget |
| --- | --- |
| Teachers | Six models, each trained at size 100 for 4,000 × 20,000 = 80 million instances; batch 128, learning rate 10⁻⁴ |
| Student | Size 100, 850 × 24,000 = 20.4 million mixed-task instances; batch 1,500 = 250 per task, learning rate 10⁻⁴, halved every 100 epochs after epoch 300 |
| Tests | 1,000 instances at size 100; 128 each at 200/500/1,000; one RTX 4090 listed for the experiments |
| Search comparison | Single-trajectory greedy decoding versus the 128-wide model with R3C200; neural baselines also report N starts × eightfold augmentation |

These counts imply 480 million teacher-training instances before student distillation. Training-instance counts do not directly equal runtime, and 200 sequential reconstructions are not the same computational budget as N×8 parallel starts. [pp. 6–9]

- **Scale transfer:** On CVRP1,000, the 128-wide student's single-trajectory gap is 4.09%, improving to 2.10% with R3C200; RF-Transformer with N×8 augmentation reports 11.08%. Large-scale benefits are substantial in the reported setting.
- **Negative cases:** At CVRP100 the single-trajectory student's 3.30% gap is worse than MT-POMO's augmented 1.69%. Even R3C200 has negative cells: VRPB100 is 0.43% versus MVMoE's augmented 0.31%, and unseen VRPBL100 is 0.55% versus 0.28%. Thus the student is not uniformly better at every scale or decoding budget.
- **Real instances:** Reported mean gaps are 4.025% on the smaller Set-X list, 15.786% on the listed Solomon instances, and 6.655% on large Set-X. These aggregate improvements coexist with individual losses: Solomon R103 is 14.090% versus POMO-MTL's 9.812%, and large X-n513-k21 is 7.215% versus LEHD's 5.880%. Some comparison values are imported from MVMoE/RouteFinder. [pp. 8–9, 23–25]
- **Ablations:** Reordering improves the reconstruction curves, and random segment length generally improves the 50-iteration comparison, with an OVRP tie at displayed precision. The RL-versus-KD comparison uses an RL model trained only at size 20, whereas the principal KD model is trained at size 100; it does not isolate the training objective under matched conditions. [pp. 8–10, 22]

## Limitations

### Reported by the Authors

- Heavy decoding remains computationally expensive; more efficient and robust architectures are left to future work.
- The checklist reports no error bars/statistical significance analysis and fixes the random seed at 2025. A fixed seed does not imply that training or randomized reconstruction is intrinsically deterministic. [pp. 10, 16]

### Curator Notes

- Expert labels are replaced by six learned teachers with substantial pretraining cost. Teacher coverage and quality remain relevant; neither approximation guarantees nor optimality certificates are established. Negative gaps against OR-Tools indicate improvements over a heuristic reference.
- Backhaul conventions, capacity limits and time-window generation must match before comparing checkpoints. The paper's interleaved signed-demand setting should not be silently identified with every earlier strict linehaul-before-backhaul benchmark.
- The tables principally report quality; they do not supply matched wall-clock measurements establishing that R3C200 is faster than the baseline search budgets.
- The current release defaults to 900 epochs and 150,000 instances per epoch, rather than the paper's 850/24,000. Testing defaults to one unaugmented trajectory with R3C disabled. These settings require adjustment to reproduce the corresponding paper rows; they are not evidence that the published runs used the current defaults.

## Reproducibility

- **Published paper:** [NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/899c6a43b9976e1077522fe5a39cafa3-Abstract-Conference.html), DOI 10.52202/085713-3195. All 25 formal pages, references, checklist and complete Appendices A–F were read. The publisher records publication on 2026-04-23; the venue year remains 2025. The [arXiv history](https://arxiv.org/abs/2506.02935) begins on 2025-06-03; generic conference notification dates were removed.
- **Supplement:** The official ZIP contains a five-page scientific PDF despite its template-like filename. All five pages were read separately. It is an older line-numbered appendix with different reference numbers and no later segment-length ablation; its three real-instance tables repeat the reported means above. The two versions must not have their reference numbers interchanged.
- **Official materials:** [Code and pretrained models](https://github.com/CIAM-Group/MTLKD) and [official poster](https://neurips.cc/virtual/2025/poster/115747). The complete poster PNG was visually read; it repeats the distillation architecture, R3C and main tables. The 53-member source archive has no extra scientific PDF, notebook, nested ZIP or video. The README links externally hosted datasets.
- **Code check:** Read the README, training/test settings, teacher-distribution/KL update loop, R3C orchestration and segment acceptance logic, and signed-capacity mask. The implementation checks both lower and upper load limits and accepts shorter reconstructed segments. No full training or benchmark reproduction was performed.
